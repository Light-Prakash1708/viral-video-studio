"""score.py: cinematic piano + strings score that follows a story beat-map (one key, humanised, big reverb).
Proven on "What IF You Could See How Many Days Every Friendship Has Left?" (Nov 2026). Replaces the procedural
mood music when the user wants music that does not sound AI-made.

usage: python3 score.py PLAN.json OUT.wav DURATION
PLAN.json = {
  "key": "D", "bpm": 76, "seed": 41,
  "sections": [ {"start":0, "end":27.2, "prog":["vi","IV","I","V"], "mode":"motif|sparse|arp8|block",
                 "vel":0.42, "strings":0.0, "pulse":false, "bass":true}, ... ],
  "events": [ {"t":29.35, "type":"pulse", "vel":0.7}, {"t":24.6, "type":"shimmer", "dur":4, "vel":0.6},
              {"t":143.3, "type":"timp", "dur":2.2, "vel":0.7}, {"t":112.1, "type":"note", "midi":62, "vel":0.45},
              {"t":108.6, "type":"drone", "dur":7.5, "vel":0.35}, {"t":189.8, "type":"final", "chord":"I"} ]
}
Roman numerals are diatonic triads of the major key (I ii iii IV V vi; vi = relative minor).
Recipe: map sections to the story beats from timeline/sentences.json; leave near-silence (a drone + single notes)
under the emotional peak line, cut out on a reveal word, then swell; pulse_on for montages; final chord rings out.
Then set config.music = {"enabled":true,"gainDb":-8,"file":"input/score.wav"} (mix.py still ducks it under the voice).
"""
import sys, numpy as np
import os
for _d in [os.environ.get('GROWKAZ_STUDIO', ''), os.getcwd(), os.path.expanduser('~/growkaz-stickman-studio'), '/home/user/growkaz-stickman-studio']:
    if _d and os.path.isfile(os.path.join(_d, 'audio', 'dsp.py')): sys.path.insert(0, os.path.join(_d, 'audio')); break
from dsp import SR, reverb, lp, hp, write_wav

import json
PLAN = json.load(open(sys.argv[1])); OUT, DUR = sys.argv[2], float(sys.argv[3])
N = int(DUR * SR) + SR * 4
L = np.zeros(N, np.float32); R = np.zeros(N, np.float32)
rng = np.random.default_rng(PLAN.get('seed', 41))
mh = lambda m: 440.0 * 2 ** ((m - 69) / 12)

def add(sig, t, pan=0.0, gain=1.0):
    i = max(0, int(t * SR)); j = min(N, i + len(sig))
    if j <= i: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt(0.5 * (1 - pan)); R[i:j] += s * np.sqrt(0.5 * (1 + pan))

def piano(m, vel=0.6, length=4.0):
    f = mh(m); n = int(length * SR); t = np.arange(n) / SR; out = np.zeros(n, np.float32)
    B = 0.00035; bright = 0.6 + 0.6 * vel
    for k in range(1, 14):
        fk = k * f * np.sqrt(1 + B * k * k)
        if fk > 9000: break
        amp = (1 / k ** (1.55 - 0.5 * vel)) * (1 if k == 1 else bright)
        tau = (3.2 if m < 60 else 2.2) * (220 / max(f, 80)) ** 0.35 / (1 + 0.28 * k)
        ph = rng.uniform(0, 6.28)
        out += (amp * np.exp(-t / tau) * np.sin(2 * np.pi * fk * t + ph)).astype(np.float32)
    att = np.minimum(1, t / 0.004); out *= att
    ham = rng.standard_normal(min(n, int(0.02 * SR))).astype(np.float32) * np.exp(-np.arange(min(n, int(0.02 * SR))) / (0.004 * SR))
    out[: len(ham)] += lp(ham, 2500) * 0.15 * vel
    rel = np.ones(n, np.float32); rs = int(max(0.1, length - 0.6) * SR); rel[rs:] = np.linspace(1, 0, n - rs)
    return out * rel * vel * 0.35

def strings(ms, length, vel=0.5, attack=1.4, bright=1800):
    n = int(length * SR); t = np.arange(n) / SR; out = np.zeros(n, np.float32)
    for m in ms:
        for d in (-0.07, -0.025, 0.0, 0.03, 0.08):
            f = mh(m) * 2 ** (d / 12); vib = 1 + 0.0018 * np.sin(2 * np.pi * (4.8 + rng.uniform(-.4, .4)) * t + rng.uniform(0, 6))
            ph = np.cumsum(2 * np.pi * f * vib / SR); saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
            out += saw.astype(np.float32)
    out = lp(lp(out, bright), bright * 1.3)
    env = np.minimum(1, t / attack) * np.minimum(1, (length - t) / 1.2).clip(0, 1)
    return out * env.astype(np.float32) * vel * 0.03

def bass(m, length, vel=0.5):
    n = int(length * SR); t = np.arange(n) / SR; f = mh(m)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    env = np.minimum(1, t / 0.05) * np.exp(-t / 2.5) * np.minimum(1, (length - t) / 0.3).clip(0, 1)
    return (s * env * vel * 0.5).astype(np.float32)

def pulse(vel=0.5):  # soft felt kick / heartbeat
    n = int(0.5 * SR); t = np.arange(n) / SR; f = 46 + 40 * np.exp(-t / 0.03)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16) * vel).astype(np.float32)

def timp_roll(length, vel=0.6):
    n = int(length * SR); t = np.arange(n) / SR; s = np.zeros(n, np.float32)
    for i in range(int(length * 14)):
        st = int(i / 14 * SR); k = st / n; seg = pulse(0.25 + 0.75 * k)[: n - st]; s[st:st + len(seg)] += seg * 0.6
    return lp(s, 400) * vel

def shimmer(length, vel=0.4):
    n = int(length * SR); t = np.arange(n) / SR; out = np.zeros(n, np.float32)
    for m in (86, 90, 93, 98):
        out += np.sin(2 * np.pi * mh(m) * t + rng.uniform(0, 6)).astype(np.float32) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(0.2, 0.5) * t))
    return out * np.minimum(1, t / 1.5) * np.minimum(1, (length - t) / 1.5).clip(0, 1) * vel * 0.05

KEYS = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
K0 = 48 + KEYS[PLAN.get("key", "D")]
ROMAN = {"I": (0, 4, 7), "ii": (2, 5, 9), "iii": (4, 7, 11), "IV": (5, 9, 12), "V": (7, 11, 14), "vi": (9, 12, 16)}
def chord(rn):
    r = ROMAN[rn]; root = K0 + r[0]
    if root >= K0 + 5: root -= 12
    return [root, root + (r[1] - r[0]), root + (r[2] - r[0])]
BEAT = 60 / float(PLAN.get("bpm", 76)); BAR = BEAT * 4
J = lambda: rng.normal(0, 0.012)

def chord_block(t0, t1, prog, mode, vel=0.5, strings_on=0.0, pulse_on=False, bass_on=True, oct=12):
    t = t0; i = 0
    while t < t1 - 0.2:
        c = chord(prog[i % len(prog)]); dur = min(BAR, t1 - t)
        if bass_on: add(bass(c[0] - 12, dur + 0.8, 0.35 * vel + 0.1), t, 0, 1)
        if strings_on > 0: add(strings([c[0], c[1] + 12, c[2] + 12], dur + 1.0, strings_on), t, rng.uniform(-.3, .3))
        if mode == 'sparse':
            for b, idx in ((0, 2), (2, 1)):
                if b * BEAT < dur: add(piano(c[idx] + oct + 12, vel * rng.uniform(.8, 1.0), 4), t + b * BEAT + J(), 0.25)
        elif mode == 'motif':
            seq = [c[2] + 24, c[1] + 24, c[0] + 24, c[1] + 24]
            for b in range(4):
                if b * BEAT < dur: add(piano(seq[b], vel * rng.uniform(.75, 1.0), 3), t + b * BEAT + J(), 0.3)
            add(piano(c[0] + oct, vel * 0.7, 4), t + J(), -0.3)
        elif mode == 'arp8':
            seq = [c[0], c[1], c[2], c[1] + 12, c[2] + 12, c[1] + 12, c[2], c[1]]
            for b in range(8):
                if b * BEAT / 2 < dur: add(piano(seq[b] + oct, vel * (1.0 if b % 2 == 0 else .75) * rng.uniform(.85, 1), 2.5), t + b * BEAT / 2 + J(), (b % 3 - 1) * 0.3)
        elif mode == 'block':
            for m in c: add(piano(m + oct, vel * rng.uniform(.85, 1), 4.5), t + J() * 0.5, rng.uniform(-.3, .3))
            add(piano(c[2] + oct + 12, vel * 0.8, 4), t + 2 * BEAT + J(), 0.2)
        if pulse_on:
            for b in range(4):
                if b * BEAT < dur: add(pulse(0.55 if b % 2 == 0 else 0.35), t + b * BEAT, 0)
        t += BAR; i += 1

for s in PLAN["sections"]:
    chord_block(s["start"], s["end"], s.get("prog", ["I", "V", "vi", "IV"]), s.get("mode", "sparse"), s.get("vel", 0.45), s.get("strings", 0.0), s.get("pulse", False), s.get("bass", True))
for e in PLAN.get("events", []):
    ty, t, v = e["type"], e["t"], e.get("vel", 0.5)
    if ty == "pulse": add(pulse(v), t)
    elif ty == "shimmer": add(shimmer(e.get("dur", 4), v), t)
    elif ty == "timp": add(timp_roll(e.get("dur", 2), v), t)
    elif ty == "note": add(piano(e["midi"], v, e.get("dur", 5)), t)
    elif ty == "drone": add(strings([K0 - 12, K0 - 5, K0], e.get("dur", 6), v, attack=2.5, bright=900), t)
    elif ty == "final":
        c = chord(e.get("chord", "I"))
        for m in c: add(piano(m + 12, 0.5, 7), t)
        add(piano(c[0] + 36, 0.4, 7), t + 0.5); add(strings([c[0], c[2], c[0] + 12], 6, 0.4, attack=1.0), t)

mix = np.stack([L, R], 1)
mix = hp(mix, 40)
mix = reverb(mix, size=2.8, wet=0.32)
mix = mix[: int(DUR * SR)]
mix = mix / (np.abs(mix).max() + 1e-9) * 0.7
write_wav(OUT, mix)
print('wrote', OUT, mix.shape[0] / SR)
