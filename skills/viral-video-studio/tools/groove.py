"""groove.py: catchy, beat-driven background music for YouTube storytelling (the "addictive" bed that keeps people watching).
Every style is built the way viral-channel music is built: a short HOOK (2 bars) that repeats with a tiny variation every
4th bar, a steady groove, a bass that locks to the kick, and sidechain "pump" so the voice always sits on top.
All synthesis is local (numpy); no samples, no API, no copyright risk. Deterministic from the seed.

usage: python3 groove.py PLAN.json OUT.wav DURATION
PLAN.json = {
  "key": "D", "seed": 7,
  "sections": [ {"start":0, "end":30, "style":"lofi", "energy":0.5},          # energy 0..1 adds/removes layers
                {"start":30, "end":75, "style":"pop", "energy":0.8, "bpm":112}, ... ],
  "events": [ {"t":29.0, "type":"riser", "dur":2}, {"t":30.0, "type":"impact"},
              {"t":61.5, "type":"stop", "dur":1.2},      # music drops out (put it under a punch line)
              {"t":120, "type":"tape", "dur":1.0} ]       # tape-stop slowdown into a reveal
}
Styles: lofi (82 bpm, warm Rhodes, dusty swing)   pop (112, plucks + claps, bright)   phonk (130 half-time, bell hook, 808)
        synthwave (100, gated snare, saw arp)    desi (96, tabla + tanpura + sitar-pluck hook)   suspense (120, 16th ostinato)
        trap (140 half-time, hats rolls, dark bells)   epic (90, taiko + piano ostinato + strings)
        dreamy (70, pads + music box, no drums)   chase (150, driving toms + staccato strings)
Rules: one key for the whole video (styles may switch); keep music 12+ dB under speech (mix.py ducks it);
energy 0.3 under explanation, 0.6 for story, 0.9 for montage/reveal; "stop" for 0.5-1.5 s before the biggest line.
Then set config.music = {"enabled":true, "gainDb":-10, "file":"input/groove.wav"}.
"""
import sys, os, json, zlib, numpy as np
for _d in [os.environ.get('GROWKAZ_STUDIO', ''), os.getcwd(), os.path.expanduser('~/growkaz-stickman-studio'), '/home/user/growkaz-stickman-studio']:
    if _d and os.path.isfile(os.path.join(_d, 'audio', 'dsp.py')): sys.path.insert(0, os.path.join(_d, 'audio')); break
from dsp import SR, reverb, lp, hp, write_wav

PLAN = json.load(open(sys.argv[1])); OUT, DUR = sys.argv[2], float(sys.argv[3])
N = int(DUR * SR) + SR * 6
BUS = {k: np.zeros((N, 2), np.float32) for k in ('drums', 'bass', 'music', 'fx')}
rng = np.random.default_rng(PLAN.get('seed', 7))
KEYS = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}
ROOT = 48 + KEYS.get(PLAN.get('key', 'D'), 2)
mh = lambda m: 440.0 * 2 ** ((m - 69) / 12)
T = lambda n: np.arange(n) / SR

def put(bus, sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N or len(sig) == 0: return
    if i < 0: sig = sig[-i:]; i = 0
    j = min(N, i + len(sig)); s = sig[: j - i] * gain
    if s.ndim == 1: BUS[bus][i:j, 0] += s * np.sqrt(0.5 * (1 - pan)); BUS[bus][i:j, 1] += s * np.sqrt(0.5 * (1 + pan))
    else: BUS[bus][i:j] += s

# ---------------- instruments ----------------
def kick(v=1.0, punch=1.0, dist=0.0, length=0.45):
    n = int(length * SR); t = T(n); f = 45 + 110 * punch * np.exp(-t / 0.035)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18); s[:int(0.004 * SR)] += rng.standard_normal(int(0.004 * SR)) * 0.4
    if dist: s = np.tanh(s * (1 + 6 * dist)) / np.tanh(1 + 6 * dist)
    return (s * v).astype(np.float32)
def snare(v=1.0, tone=190, length=0.3, dusty=0.0):
    n = int(length * SR); t = T(n); nz = hp(rng.standard_normal(n).astype(np.float32), 1200) * np.exp(-t / (0.06 + 0.04 * dusty))
    body = np.sin(2 * np.pi * tone * t) * np.exp(-t / 0.05)
    s = 0.7 * nz + 0.5 * body
    return (lp(s.astype(np.float32), 9000 - 5000 * dusty) * v).astype(np.float32)
def clap(v=1.0):
    n = int(0.35 * SR); t = T(n); env = np.zeros(n)
    for d in (0, 0.009, 0.018, 0.027): k = int(d * SR); env[k:] += np.exp(-(t[: n - k]) / (0.012 if d < 0.027 else 0.12))
    return (hp(rng.standard_normal(n).astype(np.float32), 900) * env * v * 0.5).astype(np.float32)
def hat(v=0.5, open_=False, length=None):
    n = int((length or (0.35 if open_ else 0.05)) * SR); t = T(n)
    s = hp(rng.standard_normal(n).astype(np.float32), 7000) * np.exp(-t / (0.12 if open_ else 0.015))
    return (s * v).astype(np.float32)
def shaker(v=0.3):
    n = int(0.08 * SR); t = T(n); return (hp(rng.standard_normal(n).astype(np.float32), 5000) * np.sin(np.pi * t / t[-1]) * v).astype(np.float32)
def tom(v=1.0, f0=110, length=0.6):
    n = int(length * SR); t = T(n); f = f0 * (1 + 0.6 * np.exp(-t / 0.04))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22) * v + lp(rng.standard_normal(n).astype(np.float32), 2000) * np.exp(-t / 0.02) * 0.3 * v).astype(np.float32)
def tabla(v=0.8, bol='na', base=ROOT + 14):
    n = int(0.5 * SR); t = T(n)
    if bol == 'ge':   # bayan: low with pitch bend up
        f = mh(base - 24) * (1 + 0.25 * (1 - np.exp(-t / 0.12))); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.25)
    else:             # dayan: tuned ring with harmonic partials (na / tin / ta)
        f = mh(base); dec = {'na': 0.18, 'tin': 0.35, 'ta': 0.06}[bol]
        s = sum(a * np.sin(2 * np.pi * f * h * t) for h, a in ((1, 1), (2, 0.6), (3, 0.35), (4.2, 0.2))) * np.exp(-t / dec)
        s += hp(rng.standard_normal(n), 3000) * np.exp(-t / 0.006) * 0.4
    return (s * v * 0.5).astype(np.float32)
def bass808(m, length, v=1.0, slide_from=None):
    n = int(length * SR); t = T(n); f = mh(m) * np.ones(n)
    if slide_from is not None: f = mh(m) + (mh(slide_from) - mh(m)) * np.exp(-t / 0.06)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR); s = np.tanh(s * 1.8) / np.tanh(1.8)
    env = np.minimum(1, t / 0.005) * np.exp(-t / max(0.3, length * 0.8)) * np.minimum(1, (length - t) / 0.03).clip(0, 1)
    return (s * env * v * 0.6).astype(np.float32)
def subbass(m, length, v=1.0):
    n = int(length * SR); t = T(n); s = np.sin(2 * np.pi * mh(m) * t) + 0.3 * np.sin(4 * np.pi * mh(m) * t)
    env = np.minimum(1, t / 0.01) * np.minimum(1, (length - t) / 0.04).clip(0, 1)
    return (s * env * v * 0.45).astype(np.float32)
def saw(f, t, det=(0,)):
    return sum(2 * ((f * 2 ** (d / 1200) * t + rng.uniform()) % 1) - 1 for d in det) / len(det)
def pluck(m, v=0.6, length=0.6, bright=1.0):
    n = int(length * SR); t = T(n); f = mh(m); s = np.zeros(n)
    for k in range(1, 12):
        if f * k > 12000: break
        s += (1 / k) * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (3 + k * 2.2 / bright))
    return (s * np.minimum(1, t / 0.002) * v * 0.35).astype(np.float32)
def sitar(m, v=0.6, length=1.2):
    n = int(length * SR); t = T(n); f = mh(m) * (1 + 0.006 * np.exp(-t / 0.1)); ph = 2 * np.pi * np.cumsum(f) / SR; s = np.zeros(n)
    for k in range(1, 16): s += (1 / k ** 0.8) * np.sin(k * ph + 0.3 * k) * np.exp(-t * (1.6 + k * 0.35))
    s = np.tanh(s * 1.4)  # jawari buzz
    return (s * np.minimum(1, t / 0.002) * v * 0.22).astype(np.float32)
def bell(m, v=0.5, length=1.4):
    n = int(length * SR); t = T(n); f = mh(m)
    s = np.sin(2 * np.pi * f * t + 2.2 * np.exp(-t / 0.3) * np.sin(2 * np.pi * f * 3.5 * t)) * np.exp(-t / 0.5)
    return (s * v * 0.3).astype(np.float32)
def musicbox(m, v=0.5): n = int(1.6 * SR); t = T(n); f = mh(m); return ((np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 4.1 * t) * np.exp(-t / 0.1)) * np.exp(-t / 0.7) * v * 0.25).astype(np.float32)
def rhodes(ms, length, v=0.5):
    n = int(length * SR); t = T(n); s = np.zeros(n)
    for m in ms:
        f = mh(m); s += np.sin(2 * np.pi * f * t + 1.2 * np.exp(-t / 0.4) * np.sin(2 * np.pi * f * t)) * np.exp(-t / 1.6)
    trem = 1 + 0.15 * np.sin(2 * np.pi * 4.5 * t)
    return (s * trem * np.minimum(1, (length - t) / 0.1).clip(0, 1) * v * 0.16).astype(np.float32)
def pad(ms, length, v=0.4, bright=2200, attack=0.6):
    n = int(length * SR); t = T(n); s = np.zeros(n)
    for m in ms: s += saw(mh(m), t, (-9, 0, 8))
    s = lp(lp(s.astype(np.float32), bright), bright * 1.3)
    env = np.minimum(1, t / attack) * np.minimum(1, (length - t) / 0.5).clip(0, 1)
    return (s * env * v * 0.07).astype(np.float32)
def supersaw_arp(m, v=0.4, length=0.18, bright=3500):
    n = int(length * SR); t = T(n); s = lp(saw(mh(m), t, (-12, 0, 11)).astype(np.float32), bright)
    return (s * np.exp(-t / 0.09) * v * 0.25).astype(np.float32)
def strings_stac(m, v=0.5, length=0.22):
    n = int(length * SR); t = T(n); s = lp(saw(mh(m), t, (-6, 0, 7)).astype(np.float32), 2600)
    return (s * np.minimum(1, t / 0.01) * np.exp(-t / 0.08) * v * 0.3).astype(np.float32)
def piano_note(m, v=0.5, length=2.0):
    n = int(length * SR); t = T(n); f = mh(m); s = np.zeros(n)
    for k in range(1, 10): s += (1 / k ** 1.4) * np.sin(2 * np.pi * f * k * np.sqrt(1 + 0.0004 * k * k) * t) * np.exp(-t * (0.9 + 0.5 * k))
    return (s * np.minimum(1, t / 0.003) * v * 0.3).astype(np.float32)
def tanpura(root, length, v=0.3):
    n = int(length * SR); t = T(n); s = np.zeros(n)
    for i, m in enumerate((root + 7 - 12, root, root, root - 12)):   # Pa Sa Sa Sa(low), 4-string cycle
        cyc = 2.4; on = (t % cyc) - i * cyc / 4; on = np.where(on < 0, on + cyc, on)
        s += saw(mh(m), t, (0, 4)) * np.exp(-on / 1.6)
    return (lp(np.tanh(s * 1.2).astype(np.float32), 2400) * np.minimum(1, t / 1.0) * np.minimum(1, (length - t) / 1.0).clip(0, 1) * v * 0.12).astype(np.float32)
def noise_riser(length, v=0.5):
    n = int(length * SR); t = T(n); k = t / length; s = rng.standard_normal(n).astype(np.float32)
    out = np.zeros(n, np.float32); step = int(0.05 * SR)
    for i in range(0, n, step): out[i:i + step] = lp(s[i:i + step], 300 + 9000 * k[i] ** 2)
    return out * k ** 2 * v * 0.5
def impact(v=1.0): return kick(v * 1.2, punch=1.4, dist=0.4, length=1.6) + lp(rng.standard_normal(int(1.6 * SR)).astype(np.float32), 800) * np.exp(-T(int(1.6 * SR)) / 0.4) * 0.3 * v

# ---------------- harmony + hooks ----------------
MAJ = [0, 2, 4, 5, 7, 9, 11]; MIN = [0, 2, 3, 5, 7, 8, 10]; MIX = [0, 2, 4, 5, 7, 9, 10]
def deg(scale, d, base): o, i = divmod(d, 7); return base + scale[i] + 12 * o
def triad(scale, d, base): return [deg(scale, d, base), deg(scale, d + 2, base), deg(scale, d + 4, base)]
STYLE = {  # bpm, scale, progression (scale degrees, 0 = tonic), swing
  'lofi':      dict(bpm=82, scale=MAJ, prog=[1, 4, 0, 5], swing=0.18),
  'pop':       dict(bpm=112, scale=MAJ, prog=[0, 4, 5, 3], swing=0.0),
  'phonk':     dict(bpm=130, scale=MIN, prog=[0, 5, 3, 4], swing=0.06),
  'synthwave': dict(bpm=100, scale=MIN, prog=[0, 5, 2, 6], swing=0.0),
  'desi':      dict(bpm=96, scale=MIX, prog=[0, 6, 3, 0], swing=0.08),
  'suspense':  dict(bpm=120, scale=MIN, prog=[0, 0, 5, 4], swing=0.0),
  'trap':      dict(bpm=140, scale=MIN, prog=[0, 5, 6, 4], swing=0.0),
  'epic':      dict(bpm=90, scale=MIN, prog=[0, 5, 2, 6], swing=0.0),
  'dreamy':    dict(bpm=70, scale=MAJ, prog=[0, 5, 3, 4], swing=0.0),
  'chase':     dict(bpm=150, scale=MIN, prog=[0, 0, 5, 6], swing=0.0),
}
def make_hook(seed, scale_len=7):
    """2-bar hook in 8th notes: pentatonic-leaning degrees, a rhythmic 'call' in bar 1 and an 'answer' in bar 2."""
    r = np.random.default_rng(seed); penta = [0, 1, 2, 4, 5]
    rhythm = [1, 0, 1, 1, 0, 1, 0, 1] if r.random() < 0.5 else [1, 1, 0, 1, 0, 1, 1, 0]
    call = [int(r.choice(penta)) + (7 if r.random() < 0.25 else 0) if on else None for on in rhythm]
    ans = list(call); ans[-3:] = [None if x is None else x - int(r.choice([1, 2])) for x in call[-3:]]; ans[-1] = 0
    return call + ans  # 16 steps

def render_section(sec, sidx):
    st = STYLE[sec.get('style', 'lofi')]; bpm = sec.get('bpm', st['bpm']); sc = st['scale']; prog = sec.get('prog', st['prog'])
    e = float(sec.get('energy', 0.6)); t0, t1 = sec['start'], sec['end']; beat = 60 / bpm; bar = beat * 4; s8 = beat / 2; s16 = beat / 4
    hook = make_hook(PLAN.get('seed', 7) * 31 + zlib.crc32(sec.get("style", "lofi").encode()) % 997)
    base = ROOT + (12 if sec.get('style') in ('pop', 'synthwave', 'dreamy', 'desi') else 0)
    sty = sec.get('style', 'lofi'); swing = st['swing']
    nb = int(np.ceil((t1 - t0) / bar))
    for b in range(nb):
        tb = t0 + b * bar; deg0 = prog[b % len(prog)]; ch = triad(sc, deg0, base); var = (b % 4 == 3)
        if tb >= t1 - 0.05: break
        sw = lambda i: (i * s8 + (swing * s8 if i % 2 else 0))
        # ---- drums ----
        if sty == 'lofi':
            for i in (0, 5) if not var else (0, 3, 5): put('drums', kick(0.8, 0.8), tb + sw(i))
            for i in (2, 6): put('drums', snare(0.55, dusty=1.0), tb + sw(i) + 0.012)
            if e > 0.35:
                for i in range(8): put('drums', hat(0.18 + 0.06 * (i % 2 == 0)), tb + sw(i), pan=0.25)
        elif sty == 'pop':
            for i in range(4): put('drums', kick(0.9), tb + i * beat)
            for i in (1, 3): put('drums', clap(0.8), tb + i * beat)
            if e > 0.4:
                for i in range(8): put('drums', hat(0.2, open_=(i % 2 == 1)) if i % 2 else shaker(0.25), tb + i * s8, pan=-0.2)
        elif sty in ('phonk', 'trap'):
            for i in (0, 7 if var else 10, 11): put('drums', kick(1.0, 1.1, dist=0.5 if sty == 'phonk' else 0.1), tb + i * s16)
            put('drums', clap(0.9) + snare(0.5)[: int(0.35 * SR)] if False else clap(0.9), tb + 2 * beat)
            if e > 0.3:
                for i in range(16):
                    put('drums', hat(0.16 + 0.08 * (i % 4 == 0)), tb + i * s16, pan=0.3)
                    if var and i >= 12: [put('drums', hat(0.12), tb + i * s16 + k * s16 / 3, pan=0.3) for k in (1, 2)]  # rolls
            if sty == 'phonk': [put('drums', bell(deg(sc, 4, base + 12), 0.25, 0.25), tb + i * s16, pan=-0.3) for i in (3, 6, 14)]  # cowbell-ish
        elif sty == 'synthwave':
            for i in (0, 2): put('drums', kick(0.9), tb + i * beat)
            for i in (1, 3): s = snare(0.8, tone=170, length=0.5); put('drums', reverb(s[:, None].repeat(2, 1), size=1.5, wet=0.5)[: len(s)] if False else s, tb + i * beat)
            if e > 0.4: [put('drums', hat(0.15), tb + i * s8, pan=0.2) for i in range(8)]
        elif sty == 'desi':
            theka = [('ge', 0), ('na', 1), ('tin', 2), ('na', 3), ('ge', 4), ('na', 5), ('ta', 6), ('na', 7)]
            for bol, i in theka: put('drums', tabla(0.75 if i % 4 == 0 else 0.5, bol), tb + sw(i), pan=-0.15 if bol == 'ge' else 0.15)
            if e > 0.6: [put('drums', kick(0.5, 0.7), tb + i * beat) for i in (0, 2)]
            if e > 0.5: [put('drums', shaker(0.18), tb + i * s16, pan=0.35) for i in range(16)]
        elif sty == 'suspense':
            for i in (0, 2): put('drums', kick(0.7, 0.9), tb + i * beat)
            for i in range(16): put('drums', hat(0.1 + 0.05 * (i % 4 == 2)), tb + i * s16, pan=0.3)
            if var: put('drums', tom(0.7, 70), tb + 3.5 * beat)
        elif sty in ('epic', 'chase'):
            pat = (0, 3, 6, 8, 11, 14) if sty == 'epic' else range(0, 16, 2)
            for i in pat: put('drums', tom(0.8 if i % 8 == 0 else 0.55, 70 if i % 8 == 0 else 110), tb + i * s16, pan=0.2 * ((i % 3) - 1))
            if sty == 'chase': [put('drums', snare(0.5), tb + i * beat) for i in (1, 3)]
        # ---- bass ----
        rootm = ch[0] - (24 if sty in ('phonk', 'trap', 'suspense', 'chase', 'epic') else 12)
        if sty in ('phonk', 'trap'):
            put('bass', bass808(rootm, bar * 0.55, 0.9, slide_from=rootm + 5 if var else None), tb)
            put('bass', bass808(rootm, bar * 0.35, 0.7), tb + 10 * s16)
        elif sty in ('suspense', 'chase'):
            for i in range(16 if sty == 'chase' else 8): put('bass', subbass(rootm + (12 if i % 4 == 3 else 0), (s16 if sty == 'chase' else s8) * 0.8, 0.7), tb + i * (s16 if sty == 'chase' else s8))
        elif sty == 'desi':
            put('bass', subbass(rootm, beat * 1.5, 0.6), tb); put('bass', subbass(rootm + 7, beat * 0.9, 0.45), tb + 2.5 * beat)
        elif sty != 'dreamy':
            for i in ((0, 3, 5) if sty in ('lofi',) else (0, 2, 3, 5, 6)):
                put('bass', subbass(rootm, s8 * (1.8 if i == 0 else 0.9), 0.7), tb + sw(i))
        # ---- chords / beds ----
        if sty == 'lofi': put('music', rhodes([m + 12 for m in ch] + [deg(sc, deg0 + 6, base + 12)], bar, 0.55), tb + 0.01, pan=-0.1)
        elif sty in ('pop', 'synthwave', 'dreamy', 'epic', 'trap', 'phonk'):
            put('music', pad([m + 12 for m in ch], bar + 0.3, 0.45 if sty != 'dreamy' else 0.6, bright=1600 if sty in ('trap', 'phonk') else 2600), tb)
        elif sty == 'desi': put('music', tanpura(base - 12, bar + 0.2, 0.55), tb)
        elif sty == 'suspense': put('music', pad([ch[0] + 12, ch[0] + 19], bar + 0.3, 0.35, bright=900, attack=1.5), tb)
        if sty == 'synthwave' and e > 0.45:
            arp = [ch[0], ch[1], ch[2], ch[1] + 12]
            for i in range(16): put('music', supersaw_arp(arp[i % 4] + 12, 0.35), tb + i * s16, pan=0.3 * np.sin(i))
        if sty == 'epic': [put('music', piano_note(ch[i % 3] + 24, 0.4, 0.6), tb + i * s8, pan=0.2) for i in range(8)]
        if sty == 'chase': [put('music', strings_stac(ch[(i // 2) % 3] + 12, 0.45), tb + i * s16, pan=-0.2) for i in range(16)]
        # ---- the hook (the earworm): bars 1-2 and repeat, variation on bar 4 of every 4 ----
        if e >= 0.35:
            half = b % 2
            for i in range(8):
                d = hook[half * 8 + i]
                if d is None: continue
                if var and i >= 5: d = d + 2 if i % 2 else d - 1
                m = deg(sc, deg0 * 0 + d, base + 12)
                tt = tb + sw(i)
                inst = {'lofi': lambda: rhodes([m + 12], s8 * 1.6, 0.6), 'pop': lambda: pluck(m + 12, 0.7, 0.5),
                        'phonk': lambda: bell(m + 12, 0.55, 0.6), 'trap': lambda: bell(m + 12, 0.45, 1.2),
                        'synthwave': lambda: pluck(m + 12, 0.5, 0.35, bright=2), 'desi': lambda: sitar(m + 12, 0.7, 1.2),
                        'dreamy': lambda: musicbox(m + 24, 0.55), 'suspense': lambda: bell(m, 0.25, 1.0) if i % 4 == 0 else None,
                        'epic': lambda: None, 'chase': lambda: None}[sty]()
                if inst is not None: put('music', inst, tt, pan=0.25 if i % 2 else -0.1, gain=0.6 + 0.5 * e)
    return 60 / bpm

kick_times = []
for k, sec in enumerate(PLAN['sections']): render_section(sec, k)
# ---- events ----
for ev in PLAN.get('events', []):
    t = ev['t']; ty = ev['type']
    if t >= DUR or t < 0: continue  # event outside this render
    if ty == 'riser': d = ev.get('dur', 2.0); put('fx', noise_riser(d, ev.get('vel', 0.6)), t - d)
    elif ty == 'impact': put('fx', impact(ev.get('vel', 0.9)), t)
    elif ty == 'stop':
        i, j = int(t * SR), int((t + ev.get('dur', 1.0)) * SR); f = int(0.03 * SR)
        for b in ('drums', 'bass', 'music'): ff = max(0, min(f, N - i)); BUS[b][i:i + ff] *= np.linspace(1, 0, f)[:ff, None]; BUS[b][i + ff:j] = 0
    elif ty == 'tape':
        d = ev.get('dur', 1.0); i, j = int(t * SR), int((t + d) * SR)
        for b in ('drums', 'bass', 'music'):
            seg = BUS[b][i:j].copy(); n = len(seg); u = np.linspace(0, 1, n); pos = np.cumsum(1 - u) ; pos = pos / pos[-1] * n * 0.5
            idx = np.clip(pos.astype(int), 0, n - 1); BUS[b][i:j] = seg[idx] * (1 - u)[:, None]; BUS[b][j:j + int(0.3 * SR)] *= 0

# ---- mix: sidechain pump from the drum bus kick energy, glue, reverb on music ----
dr = BUS['drums']; env = np.abs(lp(dr[:, 0] + dr[:, 1], 120)); k = int(0.002 * SR)
env = np.convolve(env, np.ones(k) / k, 'same'); env = env / (env.max() + 1e-9)
duck = 1 - 0.45 * np.minimum(1, env * 3)
sm = np.zeros_like(duck); a_att, a_rel = np.exp(-1 / (0.003 * SR)), np.exp(-1 / (0.18 * SR)); v = 1.0
for i in range(0, len(duck), 64):
    target = duck[i]; c = a_att if target < v else a_rel; v = c * v + (1 - c) * target; sm[i:i + 64] = v
music = reverb(BUS['music'] * sm[:, None], size=2.2, wet=0.28)
bass = BUS['bass'] * sm[:, None]
drums = hp(BUS['drums'], 30)
mix = drums * 0.9 + bass * 0.8 + music * 1.0 + reverb(BUS['fx'], size=2.5, wet=0.3)
mix = hp(mix, 28); mix = np.tanh(mix * 1.3) / 1.3
# level-match sections (energy sets the target) so a style switch never jumps in loudness
g = np.ones(len(mix), np.float32)
for sec in PLAN['sections']:
    i, j = int(sec['start'] * SR), min(len(mix), int(sec['end'] * SR))
    if j - i < SR: continue
    r = np.sqrt((mix[i:j] ** 2).mean()) + 1e-9; tgt = 10 ** ((-16 + 4 * (float(sec.get('energy', 0.6)) - 0.6)) / 20); g[i:j] = min(4.0, tgt / r)
k = int(0.6 * SR); g = np.convolve(np.pad(g, (k, k), mode='edge'), np.ones(k) / k, 'same')[k:-k]
mix = mix * g[:, None]
mix = mix[: int(DUR * SR)]; fo = int(1.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
mix = mix / (np.abs(mix).max() + 1e-9) * 0.8
write_wav(OUT, mix.astype(np.float32)); print('wrote', OUT, round(len(mix) / SR, 1), 's')
