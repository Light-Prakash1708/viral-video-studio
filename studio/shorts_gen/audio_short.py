import sys, subprocess, json, numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
SR = 44100
rng = np.random.default_rng(7)

def load(path, ch=1):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True).stdout
    a = np.frombuffer(out, dtype=np.float32)
    return a.reshape(-1, ch).T if ch > 1 else a

def lp(x, fc, o=2): return sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)

def env(n, a=.005, d=.2, shape=3.0):
    t = np.arange(n) / SR
    e = np.minimum(t / max(a, 1e-4), 1) * np.exp(-t / d * shape / 3)
    return e

def whoosh(d=.7, up=True):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n)
    k = 14
    for i in range(k):
        a, b = int(i * n / k), int((i + 1) * n / k)
        fc = (400 + 5000 * ((i / k) if up else (1 - i / k)) ** 1.5)
        out[a:b] = bp(x, fc * .6, fc * 1.4)[a:b]
    t = np.linspace(0, 1, n)
    return out * np.sin(np.pi * t) ** 1.6 * 1.4

def hit(f0=160, f1=42, d=.5):
    n = int(d * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 14)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    click = lp(rng.standard_normal(n), 3000) * np.exp(-t * 60) * .6
    return s + click

def tick(f=1800, d=.03):
    n = int(d * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 130) * .5

def pop(f=500, d=.09):
    n = int(d * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(f * (1 + 2.5 * t / d)) / SR) * np.exp(-t * 35) * .7

def ding(f=1568, d=.9):
    n = int(d * SR); t = np.arange(n) / SR
    return sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * dec) for m, a, dec in [(1, 1, 5), (2.76, .45, 8), (5.4, .2, 14)]) * .5

def riser(d=1.5):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n); k = 24
    for i in range(k):
        a, b = int(i * n / k), int((i + 1) * n / k); fc = 300 + 7000 * (i / k) ** 2
        out[a:b] = bp(x, fc * .7, fc * 1.3)[a:b]
    return out * np.linspace(0, 1, n) ** 2 * .9

def buzz(d=.12):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sign(np.sin(2 * np.pi * 100 * t)) * .25 + lp(rng.standard_normal(n), 900) * .3) * np.minimum(1, (d - t) * 60)

def declick(sig, fin=.006, fout=.02):
    """remove DC and force the sound to start/end at zero (hard starts/ends are what make clicks)"""
    sig = np.asarray(sig, dtype=np.float64).copy()
    sig -= np.mean(sig)
    a, b = min(len(sig) // 2, int(fin * SR)), min(len(sig) // 2, int(fout * SR))
    if a > 0: sig[:a] *= np.linspace(0, 1, a) ** 2
    if b > 0: sig[-b:] *= np.linspace(1, 0, b) ** 2
    return sig

def place(buf, sig, t, g=1.0):
    i = int(t * SR)
    if i < 0 or i >= len(buf): return
    sig = declick(sig)
    n = min(len(sig), len(buf) - i)
    sig = sig[:n]
    b = min(n // 2, int(.02 * SR))      # if the buffer end truncates the sound, fade there too
    if b > 0 and n < len(sig): sig[-b:] *= np.linspace(1, 0, b)
    buf[i:i + n] += sig * g

def real(path, maxd=None, fade=.05):
    x = load(path)
    if maxd: x = x[:int(maxd * SR)]
    n = int(fade * SR); x = x.copy(); x[-n:] *= np.linspace(1, 0, n)
    return x / (np.max(np.abs(x)) + 1e-6)

def bank(sid, dur=None):
    """render a sound from the earshot bank (free, code-made) into sfx/bank/ and load it; kind syntax 'bank:impact/deep'"""
    import os
    d = '/root/hf-shorts/sfx/bank'; os.makedirs(d, exist_ok=True)
    f = os.path.join(d, sid.replace('/', '_') + '.wav')
    if not os.path.exists(f):
        subprocess.run(['earshot', 'sfx', 'render', sid, '-o', f], check=True, capture_output=True)
    x = load(f)
    return x / (np.max(np.abs(x)) + 1e-6)

def lufs_gain(x, target):
    # crude: RMS-based gain to target dBFS rms over active samples
    r = np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2)) + 1e-9
    return 10 ** (target / 20) / r

def duck_envelope(v, n):
    from scipy.ndimage import gaussian_filter1d, maximum_filter1d
    hop = SR // 100
    e = np.sqrt(np.convolve(v ** 2, np.ones(hop * 5) / (hop * 5), 'same'))[::hop]
    e = np.clip(e / (np.percentile(e, 90) + 1e-9), 0, 1)
    e = maximum_filter1d(e, 12)                 # hold 120 ms so gaps between words do not pump
    e = gaussian_filter1d(e, 14)                # ~140 ms attack / release
    return np.interp(np.arange(n) / SR, np.arange(len(e)) / 100, e)

def click_scan(sig, label='bed', thr=9.0, quiet=False):
    """find sample-level discontinuities (clicks) in a mono signal; returns [(time, severity)]"""
    d2 = np.abs(sig[2:] - 2 * sig[1:-1] + sig[:-2])
    win = int(SR * .05); rms = np.sqrt(np.convolve(sig ** 2, np.ones(win) / win, 'same')) + 1e-4
    r = d2 / np.maximum(rms[1:-1], .02); out = []
    for i in np.where(r > thr)[0]:
        t = i / SR
        if not out or t - out[-1][0] > .08: out.append([t, float(r[i])])
        else: out[-1][1] = max(out[-1][1], float(r[i]))
    if not quiet: print(label, 'click scan: %d suspicious spots' % len(out), [(round(t, 2), round(v_, 1)) for t, v_ in out[:12]])
    return out

def soft_limit(x, knee=.8):
    a = np.abs(x); y = np.where(a < knee, x, np.sign(x) * (knee + (1 - knee) * np.tanh((a - knee) / (1 - knee))))
    return y

def build(name, voice_mp3, dur, music, mstart, events, out, mgain_db=-29, duck_db=-7):
    n = int(dur * SR)
    v = load(voice_mp3); v = v[:n]; v = np.pad(v, (0, n - len(v)))
    v *= lufs_gain(v, -17)
    # voice activity envelope for ducking
    act = duck_envelope(v, n)
    m = load(music, 2)[:, int(mstart * SR):int(mstart * SR) + n]
    m = np.pad(m, ((0, 0), (0, n - m.shape[1])))
    m *= lufs_gain(m, mgain_db)
    m *= (10 ** (duck_db / 20)) ** act  # duck while voice active
    fi, fo = int(.6 * SR), int(1.6 * SR)
    m[:, :fi] *= np.linspace(0, 1, fi); m[:, -fo:] *= np.linspace(1, 0, fo)
    fx = np.zeros(n)
    for ev in events:
        t, kind = ev[0], ev[1]; g = ev[2] if len(ev) > 2 else 1.0
        if isinstance(kind, str) and kind.startswith('bank:'):
            place(fx, bank(kind[5:]), t, g * .17); continue
        k = {
            'whoosh': lambda: whoosh(.6, True), 'whoosh_d': lambda: whoosh(.6, False), 'whoosh_s': lambda: whoosh(.35, True),
            'hit': lambda: hit(), 'hit_s': lambda: hit(220, 70, .3), 'tick': lambda: tick(), 'tickh': lambda: tick(2600), 'pop': lambda: pop(),
            'ding': lambda: ding(), 'ding2': lambda: ding(2093, .8), 'riser': lambda: riser(1.4), 'buzz': lambda: buzz(),
            'impact': lambda: real('/root/hf-shorts/sfx/impact.wav') * 1.3, 'boom': lambda: real('/root/hf-shorts/sfx/boom.wav'),
            'swell': lambda: real('/root/hf-shorts/sfx/swell.wav') * .6, 'paper': lambda: real('/root/hf-shorts/sfx/paper.wav'),
            'cash': lambda: real('/root/hf-shorts/sfx/cash.wav', 2.2, .3), 'moto': lambda: real('/root/hf-shorts/sfx/moto.wav') * 1.1,
        }[kind]()
        place(fx, k, t, g * .17)
    # sfx are mono; gentle duck of sfx under voice so words stay clear
    fx *= (1 - .65 * act)
    spk = act > .5
    bed = np.sqrt(np.mean(((m[0] + fx)[spk]) ** 2)) + 1e-9; vv = np.sqrt(np.mean(v[spk] ** 2)) + 1e-9
    mu = np.sqrt(np.mean((m[0][spk]) ** 2)) + 1e-9; fr = np.sqrt(np.mean((fx[spk]) ** 2)) + 1e-9
    print(name, 'voice vs bed %.1f dB | vs music %.1f dB | vs sfx %.1f dB' % (20 * np.log10(vv / bed), 20 * np.log10(vv / mu), 20 * np.log10(vv / fr)))
    L = v + m[0] + fx; R = v + m[1] + fx
    click_scan(m[0] + fx, 'music+sfx bed')
    st = np.stack([soft_limit(L), soft_limit(R)], 1)
    wavfile.write(out + '_pre.wav', SR, (st * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', out + '_pre.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9', '-ar', '44100', '-c:a', 'pcm_s16le', out], check=True)
    print(name, 'audio ok')


def ticks(t0, t1, step, kind='tick', g=.5):
    out, t = [], t0
    while t < t1:
        out.append((round(t, 3), kind, g)); t += step
    return out


if __name__ == '__main__':
    which = sys.argv[1]
    if which == 'flo':
        ev = [(.12, 'impact', 1.0), (.1, 'whoosh_s', .6), (3.35, 'riser', .5)] + ticks(3.4, 5.8, .09, 'tick', .35) + [(4.25, 'whoosh', .8), (5.85, 'hit_s', .6),
              (7.6, 'whoosh', .7), (7.75, 'pop', .5), (8.4, 'pop', .6), (8.62, 'pop', .6), (8.84, 'pop', .6), (9.06, 'pop', .6), (11.6, 'riser', .5), (12.7, 'impact', .8),
              (14.5, 'whoosh', .7), (15.9, 'impact', .9), (17.0, 'whoosh', .6), (20.95, 'boom', 1.0), (21.0, 'hit', .8), (23.6, 'paper', .9), (23.65, 'hit_s', .5),
              (25.2, 'whoosh', .7), (26.1, 'impact', .9), (27.4, 'whoosh', .6), (30.35, 'riser', .5)] + ticks(30.45, 32.1, .06, 'tickh', .3) + [(32.1, 'ding', .5),
              (35.0, 'whoosh', .7), (35.2, 'impact', .85), (39.4, 'whoosh_d', .5), (42.8, 'pop', .8), (42.85, 'hit', .8), (44.2, 'whoosh_d', .8), (44.45, 'impact', 1.0), (44.5, 'swell', .8),
              (47.1, 'hit', .9), (47.0, 'whoosh_s', .5), (48.7, 'whoosh', .4), (52.65, 'moto', 1.0), (54.4, 'impact', 1.0), (56.95, 'moto', 1.0), (57.55, 'boom', 1.0), (57.58, 'impact', .8),
              (58.4, 'whoosh', .7), (58.6, 'hit', .7), (61.1, 'whoosh', .6), (62.6, 'impact', .9), (65.25, 'buzz', .6), (65.38, 'buzz', .6), (65.5, 'buzz', .6), (65.62, 'buzz', .6), (65.8, 'swell', 1.0), (9.45, 'whoosh_s', .7), (9.5, 'hit_s', .6), (44.9, 'paper', .7), (50.7, 'impact', .8), (52.6, 'whoosh', .8), (65.25, 'whoosh_s', .7), (6.14, 'impact', .9), (6.2, 'whoosh_s', .6), (45.55, 'impact', .8), (45.78, 'tickh', 1.4), (45.8, 'hit_s', .6)]
        build('flo', '/root/hf-shorts/fl.mp3', 67.0, '/root/hf-shorts/assets/ba4dc18e-b8e2-4302-b404-787d4a036ff4.mp3', 28, ev, '/root/hf-shorts/out/flo_mix.wav')
    else:
        ev = [(.1, 'whoosh_s', .6), (1.15, 'impact', .9), (2.3, 'riser', .5)] + ticks(2.5, 4.1, .05, 'tickh', .3) + [(4.15, 'cash', 1.0), (4.17, 'hit', .7),
              (5.3, 'impact', .9), (6.8, 'pop', .5), (7.0, 'pop', .5), (7.2, 'pop', .5), (7.4, 'pop', .5), (8.65, 'riser', .4), (10.1, 'ding', .4), (11.1, 'impact', .9), (13.55, 'whoosh', .6),
              (14.0, 'pop', .6)] + ticks(14.1, 15.1, .06, 'tick', .3) + [(15.3, 'hit_s', .6), (18.3, 'whoosh', .7), (21.45, 'impact', 1.0), (21.5, 'cash', 1.0),
              (23.4, 'whoosh', .6), (25.7, 'whoosh', .7), (26.35, 'riser', .5), (28.7, 'pop', .9), (28.85, 'ding2', .6), (28.9, 'hit_s', .6)] + ticks(28.9, 29.8, .05, 'tickh', .3) + [(32.0, 'impact', 1.0),
              (31.9, 'whoosh', .7), (34.6, 'ding', .6), (34.65, 'hit_s', .5), (36.25, 'riser', .5)] + ticks(36.6, 38.4, .05, 'tick', .3) + [(38.4, 'ding2', .5), (39.0, 'whoosh', .7), (39.15, 'pop', .7),
              (42.5, 'whoosh', .6), (43.95, 'impact', .9), (44.75, 'impact', 1.0), (46.1, 'whoosh_s', .5), (47.4, 'hit_s', .7), (49.2, 'impact', 1.0), (49.25, 'swell', .6), (15.25, 'whoosh_s', .7), (39.9, 'whoosh_s', .6), (46.05, 'whoosh_s', .7), (1.7, 'whoosh_s', .7), (1.72, 'hit_s', .5), (3.45, 'whoosh_s', .7), (3.47, 'hit_s', .5), (5.35, 'whoosh_s', .6), (13.7, 'whoosh_s', .6), (18.4, 'whoosh_s', .6), (36.3, 'whoosh_s', .6), (39.6, 'whoosh_s', .6), (43.95, 'hit', .7)] + [(t_, 'pop', .35) for t_ in (2.4, 5.5, 11.1, 14.0, 21.4, 24.9, 28.8, 31.0, 36.6, 39.5, 42.4, 44.8, 47.4, 49.4)]
        ev += [(15.5 + i * .056 if i < 30 else 16.6 + (i - 30) * .06, 'tickh', .25) for i in range(0, 60, 2)]
        build('mth', '/root/hf-shorts/math.mp3', 51.0, '/root/hf-shorts/assets/ac0bba39-4aab-4a31-bb3f-53e5e62d91d2.mp3', 90, ev, '/root/hf-shorts/out/mth_mix.wav')
