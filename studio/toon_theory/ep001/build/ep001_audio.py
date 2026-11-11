#!/usr/bin/env python3
"""EP001 audio: assemble dialogue from per-line clips at the measured timeline, original synthesised score + room tone,
SFX from the earshot bank (fx_events.json), duck/mix/loudnorm via studio/shorts_gen/audio_short.py."""
import sys, os, json
import numpy as np, soundfile as sf
from scipy.io import wavfile
from scipy.signal import fftconvolve, butter, sosfilt
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, '/home/user/viral-video-studio/studio/shorts_gen')
import timeline, audio_short as A
SR = 44100; T, MK, VIS, DUR = timeline.build(); CL = timeline.CLIPS
OUT = HERE + '/../audio'; rng = np.random.default_rng(5)
N = int(DUR * SR)
def place(buf, y, t, g=1.0):
    i = int(t * SR); y = y[:max(0, len(buf) - i)]; buf[i:i + len(y)] += y * g
def fade(y, a=.3, b=.5):
    y = y.copy(); fa, fb = min(len(y) // 2, int(a * SR)), min(len(y) // 2, int(b * SR)); y[:fa] *= np.linspace(0, 1, fa); y[-fb:] *= np.linspace(1, 0, fb); return y
# ---------------- dialogue track
V = np.zeros(N); GAIN = {'narrator': .85}
for lid, (a, b) in T.items():
    y, _ = sf.read(f'{OUT}/clips/{lid}.wav'); y = y.astype(float)
    spk = CL[lid]['spk']; act = np.abs(y) > .02 * np.abs(y).max(); rms = np.sqrt(np.mean(y[act] ** 2) + 1e-9)
    y = y * (10 ** (-21 / 20) / rms) * GAIN.get(spk, 1.0)
    if lid == 'r01':   # voice note: phone-speaker band-limit + light saturation
        y = sosfilt(butter(2, [380, 3400], 'band', fs=SR, output='sos'), y); y = np.tanh(y * 1.8) * .9
    place(V, np.clip(y, -.98, .98), a)
wavfile.write(OUT + '/voice_track.wav', SR, (np.clip(V, -1, 1) * 32767).astype(np.int16))
# ---------------- original score
def tone(f, d, harm=((1, 1), (2, .35), (3, .18)), a=.01, r=.6, sus=False, amp=1.0):
    t = np.arange(int(d * SR)) / SR; y = sum(h * np.sin(2 * np.pi * f * k * t + k) for k, h in harm)
    e = np.minimum(1, t / a) * (np.minimum(1, (d - t) / .6) if sus else np.exp(-t / r)); return y * e * amp * .25
def pad(freqs, d, amp=1.0):
    y = sum(tone(f, d, ((1, 1), (2, .25), (3, .1)), a=min(1.5, d / 3), sus=True) + tone(f * 1.004, d, ((1, .7),), a=min(1.5, d / 3), sus=True) for f in freqs); return y * amp
def noise_bp(d, lo, hi):
    n = rng.standard_normal(int(d * SR)); return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), n)
NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)
def kind(k, d):
    y = np.zeros(int(d * SR))
    if k == 'tension':
        place(y, pad([NOTE(33), NOTE(40)], d, .9), 0)
        for t in np.arange(0, d - .3, .62): place(y, tone(58, .35, ((1, 1),), a=.004, r=.09, amp=2.2), t)
        place(y, tone(NOTE(93), d, ((1, 1),), a=1.5, sus=True, amp=.05), 0)
    elif k in ('cool', 'warm_soft', 'cold'):
        ch = {'cool': [NOTE(45), NOTE(52), NOTE(57)], 'warm_soft': [NOTE(53), NOTE(57), NOTE(60), NOTE(64)], 'cold': [NOTE(50), NOTE(57), NOTE(60), NOTE(64)]}[k]
        place(y, pad(ch, d, .7 if k != 'cold' else .55), 0)
        sc = {'cool': [57, 60, 64, 67, 69], 'warm_soft': [60, 64, 67, 71, 72], 'cold': [62, 65, 69, 72]}[k]
        t = 0.8
        while t < d - 1: place(y, tone(NOTE(int(rng.choice(sc))), 1.8, ((1, 1), (2, .5), (3, .2)), r=.5, amp=.9), t); t += rng.uniform(1.3, 2.4)
    elif k == 'warm':   # piano-like arpeggio motif (library / walk)
        prog = [[48, 52, 55, 59], [53, 57, 60, 64], [45, 52, 55, 60], [43, 50, 55, 59]]; t = 0.0; bar = 0
        while t < d - .6:
            ch = prog[bar % 4]; place(y, pad([NOTE(ch[0]), NOTE(ch[2])], 3.6, .35), t)
            for j, n in enumerate([ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 12, ch[1] + 12, ch[3] + 12, ch[2] + 12]): place(y, tone(NOTE(n), 1.3, ((1, 1), (2, .45), (3, .15)), r=.35, amp=1.1), t + j * .45)
            t += 3.6; bar += 1
    elif k == 'slot':
        n = noise_bp(d, 600, 5000) * np.linspace(0, 1, len(y)) ** 2 * .35; y += n
        place(y, tone(NOTE(33), d, ((1, 1),), a=2, sus=True, amp=.8), 0)
        t = .3; gap = .4
        while t < d - 1: place(y, tone(2200, .04, ((1, 1),), a=.001, r=.01, amp=1.2), t); t += gap; gap = max(.09, gap * .93)
        for f in (60, 64, 67, 72): place(y, tone(NOTE(f), 1.6, ((1, 1), (2, .4), (3, .2)), r=.6, amp=.9), 6.2)
    elif k == 'box':
        mel = [76, 79, 84, 83, 79, 76, 74, 72]; t = 0; i = 0
        while t < d - .8: place(y, tone(NOTE(mel[i % 8]), 1.6, ((1, 1), (3, .35), (5, .12)), a=.003, r=.5, amp=.9), t); t += .75; i += 1
        place(y, pad([NOTE(48), NOTE(55), NOTE(60)], d, .45), 0)
    elif k == 'void':
        place(y, pad([NOTE(33), NOTE(40)], d, .6), 0)
    elif k == 'end':
        place(y, tone(NOTE(57), d, ((1, 1), (2, .3)), a=1.2, sus=True, amp=.9), 0); place(y, tone(NOTE(64), d, ((1, 1),), a=1.8, sus=True, amp=.45), .5)
    return y
SEC = [(0, MK['S1b'], 'tension'), (MK['S1b'], MK['S3'], 'cool'), (MK['S3'], VIS['S3_cold'][0], 'warm'), (VIS['S3_cold'][0], MK['S4'], 'cold'),
       (MK['S4'], MK['S4'] + 7.0, 'slot'), (MK['S4'] + 7.0, MK['S5'], 'cool'), (MK['S5'], MK['S6'], 'box'), (MK['S6'], MK['S7'], 'cold'),
       (MK['S7'], T['p13'][0] - .2, 'void'), (VIS['S7_facedown'][0] + .9, MK['S8'], 'warm_soft'), (MK['S8'], VIS['S8_quiet'][0] - .1, 'warm_soft'), (T['n02'][0] - .2, DUR, 'end')]
M = np.zeros(N)
for a, b, k in SEC: place(M, fade(kind(k, b - a), .7, .9), a)
# reverb tail (shared IR)
ir = rng.standard_normal(int(1.8 * SR)) * np.exp(-np.arange(int(1.8 * SR)) / (.5 * SR)); ir /= np.abs(ir).sum() / 14
M = .65 * M + .35 * fftconvolve(M, ir)[:N]
# room tone (cafe murmur) only where people are together; silent in void/quiet moments
RT = np.zeros(N)
for a, b in [(MK['S1b'], MK['S3']), (VIS['S3_cold'][1], MK['S5']), (VIS['S5_cafe'][0], MK['S7']), (MK['S8'], VIS['S8_quiet'][0] - .1)]:
    n = noise_bp(b - a, 180, 1100) * (.6 + .4 * np.sin(np.linspace(0, 40, int((b - a) * SR)))); place(RT, fade(n, .8, .8), a)
M = M / (np.abs(M).max() + 1e-9) * .9 + RT / (np.abs(RT).max() + 1e-9) * .05
st = np.stack([M, np.roll(M, int(.011 * SR))], 1)
wavfile.write(OUT + '/music_track.wav', SR, (np.clip(st, -1, 1) * 32767).astype(np.int16))
# ---------------- mix
fxd = json.load(open(OUT + '/fx_events.json')); ev = [tuple(e) for e in fxd['fx']]
A.build('ep001', OUT + '/voice_track.wav', DUR, OUT + '/music_track.wav', 0, ev, OUT + '/ep001_mix.wav', mgain_db=-26, duck_db=-8)
print('mix ->', OUT + '/ep001_mix.wav', 'dur', DUR)
