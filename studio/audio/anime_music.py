#!/usr/bin/env python3
"""audio/anime_music.py: original anime-style tracks (generated here = royalty-free, no Content ID claims) + a beat grid.

  python audio/anime_music.py --style explainer --dur 50 --drop 30 --out build/track.wav [--bpm 144] [--seed 1]
  styles: explainer (144 BPM phonk-epic: 808, cowbell, taiko, Hirajoshi plucks), epic (130, taiko+choir), emotional (90, plucks+pad)
Writes <out> and <out>.beats.json {bpm, beat_s, beats[], bars[], drop_s, sections[]} so cuts, text pops and SFX can snap to the grid.
Use with the studio: set config.music.file to the wav (see mix.py) and run tools/snap_shots.py to snap shot boundaries to beats.
"""
import argparse, json, os
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
R = np.random.default_rng(1)
def T(d): return np.arange(int(d * SR)) / SR
def midi(n): return 440 * 2 ** ((n - 69) / 12)
def _f(x, f, kind, o=2):
    f = np.atleast_1d(f) / (SR / 2); b, a = signal.butter(o, f if len(f) > 1 else f[0], kind); return signal.lfilter(b, a, x)
def lp(x, f): return _f(x, f, 'low')
def hp(x, f): return _f(x, f, 'high')
def bp(x, f1, f2): return _f(x, [f1, f2], 'band')
def noise(n): return R.standard_normal(n)

# ---- instruments (each returns a mono numpy buffer)
def kick():
    t = T(0.45); f = 45 + 110 * np.exp(-t * 28); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    return np.tanh((x + 0.3 * hp(noise(len(t)), 2000) * np.exp(-t * 120)) * 1.6)
def snare():
    t = T(0.3); return np.tanh((bp(noise(len(t)), 1200, 6500) * np.exp(-t * 20) + 0.6 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 26)) * 1.5)
def clap():
    t = T(0.25); x = bp(noise(len(t)), 900, 4500) * (np.exp(-t * 28) + 0.6 * np.exp(-((t - 0.012) * 90) ** 2)); return np.tanh(x * 1.8)
def hat(o=False):
    t = T(0.16 if o else 0.045); return hp(noise(len(t)), 7000) * np.exp(-t * (18 if o else 80)) * 0.5
def cowbell():
    t = T(0.22); x = (np.sign(np.sin(2 * np.pi * 587 * t)) + np.sign(np.sin(2 * np.pi * 845 * t))) * 0.5; return bp(x, 500, 3000) * np.exp(-t * 16) * 0.7
def taiko():
    t = T(0.8); f = 58 + 40 * np.exp(-t * 18); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5) + 0.4 * lp(noise(len(t)), 400) * np.exp(-t * 30); return np.tanh(x * 1.4)
def sub808(note, d):
    t = T(d); f = midi(note) * (1 + 1.2 * np.exp(-t * 45)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.7) * np.minimum(1, t * 400) * np.minimum(1, (d - t) * 60); return np.tanh(x * 1.8)
def pluck(freq, d=1.3):
    t = T(d); x = sum((1 / k) * np.sin(2 * np.pi * k * freq * t) * np.exp(-t * (3 + 1.5 * k)) for k in range(1, 7)); return x * np.minimum(1, t * 800)
def pad(notes, d):
    t = T(d); x = np.zeros_like(t)
    for n in notes:
        for dt in (-0.12, 0, 0.12):
            x += signal.sawtooth(2 * np.pi * midi(n) * 2 ** (dt / 12) * t)
    x = lp(x, 1700) + 0.5 * bp(x, 700, 1300); env = np.minimum(1, t / 0.5) * np.minimum(1, (d - t) / 0.6); return x * env / (3 * len(notes))
def riser(d):
    t = T(d); u = t / d; return (hp(noise(len(t)), 800) * u ** 2 * 0.6 + 0.3 * np.sin(2 * np.pi * np.cumsum(200 + 2400 * u ** 2) / SR) * u)
def impact():
    t = T(2.0); return np.tanh((np.sin(2 * np.pi * 42 * t) * np.exp(-t * 2.2) + 0.5 * lp(noise(len(t)), 500) * np.exp(-t * 3)) * 1.5)
def verb(x, secs=1.6, mix=0.22):
    n = int(secs * SR); ir = noise(n) * np.exp(-np.arange(n) / SR * 3.2); ir = lp(ir, 5000); y = signal.fftconvolve(x, ir)[:len(x)]; return x + mix * y / (np.abs(y).max() + 1e-9) * np.abs(x).max()

STYLES = {
    'explainer': dict(bpm=144, kick=[0, 7, 10], snare=[4, 12], hat=list(range(0, 16, 2)), cow=[0, 3, 6, 10, 12], taiko=[0, 8], bass=True, plucks=True, choir=True),
    'epic':      dict(bpm=130, kick=[0, 8], snare=[], clap=[12], hat=[], cow=[], taiko=[0, 4, 8, 10, 12], bass=True, plucks=False, choir=True),
    'emotional': dict(bpm=90,  kick=[0], snare=[], rim=[8], hat=[], cow=[], taiko=[], bass=False, plucks=True, choir=True),
}
CHORDS = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [57, 60, 64]]   # Am F G Am
ROOTS = [33, 29, 31, 33]
HIRA = [57, 59, 60, 64, 65, 69, 71, 72, 76]                          # Hirajoshi (A): the "Japanese" sound

def place(buf, x, t, g=1.0):
    i = int(t * SR)
    if i < 0 or i >= len(buf): return
    n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n] * g

def build(style, dur, drop, bpm=None, seed=1):
    global R; R = np.random.default_rng(seed); st = STYLES[style]; bpm = bpm or st['bpm']
    beat = 60 / bpm; bar = beat * 4; step = bar / 16; nbars = int(np.ceil(dur / bar)) + 1
    drop_bar = max(4, round(drop / bar)); N = int((nbars * bar + 3) * SR)
    drums, bass, padb, lead, fx = (np.zeros(N) for _ in range(5)); ks = []
    K, S, C, H, HO, CB, TK, RM = kick(), snare(), clap(), hat(), hat(True), cowbell(), taiko(), hat() * 2
    sections = []
    for b in range(nbars):
        t0 = b * bar; ch = b % 4; intro = b < drop_bar - 2 and b < max(2, drop_bar // 3); build_ = b < drop_bar - 2 and not intro
        pre = drop_bar - 2 <= b < drop_bar; full = b >= drop_bar and b < nbars - 1; outro = b >= nbars - 1; brk = full and ((b - drop_bar) % 12 in (10, 11))
        place(padb, pad(CHORDS[ch], bar + 0.4), t0, 0.7 if not brk else 0.9)
        if st['plucks'] and not (pre and b == drop_bar - 1):
            for s in range(0, 16, 2):
                if intro or build_ or full or outro:
                    if (s % 4 == 0) or R.random() < 0.5: place(lead, pluck(midi(HIRA[(s // 2 + ch * 2 + int(R.integers(0, 3))) % len(HIRA)] + (12 if s % 8 == 6 else 0)), 1.0), t0 + s * step, 0.22)
        if intro or outro:
            for s in st['hat'][::2]: place(drums, H, t0 + s * step, 0.35)
            if style != 'emotional' and outro: place(fx, impact(), t0, 0.6)
        if build_ or full:
            if not brk:
                for s in st['kick']: place(drums, K, t0 + s * step, 1.0); ks.append(t0 + s * step)
                for s in st['snare']: place(drums, S, t0 + s * step, 0.7)
                for s in st.get('clap', []): place(drums, C, t0 + s * step, 0.7)
                for s in st.get('rim', []): place(drums, RM, t0 + s * step, 0.6)
                if full or style == 'explainer':
                    for s in st['hat']: place(drums, HO if s == 14 else H, t0 + s * step, 0.45)
            if full and not brk:
                for s in st['cow']: place(drums, CB, t0 + s * step, 0.5)
                for s in st['taiko']: place(drums, TK, t0 + s * step, 0.9)
                if st['bass']:
                    for s, ln in ((0, 6), (7, 3), (10, 5)): place(bass, sub808(ROOTS[ch], ln * step * 0.95), t0 + s * step, 0.95)
            elif build_ and st['bass'] and b % 2 == 0: place(bass, sub808(ROOTS[ch], bar * 0.9), t0, 0.7)
        if pre:
            if b == drop_bar - 2: place(fx, riser(bar * 2 - beat), t0, 0.7)
            for s in range(8, 16, 1) if b == drop_bar - 1 else []: place(drums, S, t0 + s * step * (1 if s < 12 else 1), 0.35 + 0.05 * s)
        if b == drop_bar: place(fx, impact(), t0, 0.9)
        sections.append(('intro' if intro else 'build' if build_ else 'pre-drop' if pre else 'break' if brk else 'drop' if full else 'outro', round(t0, 3)))
    sc = np.ones(N)
    for k in ks:                                           # sidechain: pad, bass and plucks pump with the kick
        i = int(k * SR); n = min(int(0.25 * SR), N - i)
        if n > 0: sc[i:i + n] = np.minimum(sc[i:i + n], 1 - 0.55 * np.exp(-np.arange(n) / SR * 14))
    pad_out = verb(padb * sc, 2.0, 0.3); mix = drums * 0.9 + bass * 0.9 * sc + pad_out * 0.55 + verb(lead, 1.2, 0.25) + fx
    mix = np.tanh(mix * 1.15)[:int(dur * SR)]; fade = int(min(1.5, dur * 0.05) * SR); mix[-fade:] *= np.linspace(1, 0, fade)
    mix = mix / (np.abs(mix).max() + 1e-9) * 0.89
    L = mix.copy(); Rr = np.concatenate([np.zeros(int(0.012 * SR)), mix[:-int(0.012 * SR)]]) * 0.9
    stereo = np.stack([0.5 * L + 0.5 * mix, 0.5 * Rr + 0.5 * mix], 1)
    info = dict(style=style, bpm=bpm, beat_s=round(beat, 4), bar_s=round(bar, 4), drop_s=round(drop_bar * bar, 3), duration=dur,
                beats=[round(i * beat, 3) for i in range(int(dur / beat) + 1)], bars=[round(i * bar, 3) for i in range(int(dur / bar) + 1)], sections=sections)
    return stereo, info

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--style', default='explainer', choices=list(STYLES)); ap.add_argument('--dur', type=float, default=50)
    ap.add_argument('--drop', type=float, default=30, help='seconds where the drop/reveal lands (snapped to a bar)'); ap.add_argument('--bpm', type=float)
    ap.add_argument('--seed', type=int, default=1); ap.add_argument('--out', default='track.wav'); a = ap.parse_args()
    y, info = build(a.style, a.dur, a.drop, a.bpm, a.seed); os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    wavfile.write(a.out, SR, (y * 32767).astype(np.int16)); json.dump(info, open(a.out + '.beats.json', 'w'), indent=1)
    print(f"wrote {a.out} ({a.dur:.0f}s, {info['bpm']:.0f} BPM, drop at {info['drop_s']}s) + {a.out}.beats.json")
