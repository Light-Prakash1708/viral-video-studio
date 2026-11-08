#!/usr/bin/env python3
"""orchestra.py: story-mapped background music with REAL sampled instruments (free, commercial-safe).

Writes a MIDI arrangement from a plan, renders it with FluidSynth + the FluidR3 GM soundfont (MIT licence),
and masters it. No API, no login.   Setup once: apt-get install -y fluidsynth fluid-soundfont-gm

  python3 orchestra.py plan.json out.wav DURATION
plan.json:
  {"key": "D", "minor": true, "bpm": 96, "seed": 7,
   "sections": [{"start": 0, "end": 9, "mood": "mystery", "energy": 0.5}, ...],
   "events":   [{"t": 8.8, "type": "drop", "dur": 1.2}, {"t": 12.9, "type": "hit"}, {"t": 50, "type": "riser", "dur": 2}]}
moods: epic, mystery, tension, wonder, sad, triumph, curious, dark, warm, chase.
events: hit (timpani + crash + low brass), riser (string/cymbal swell into t+dur), drop (everything stops for dur),
        stinger (brass stab), boom (low impact), tick (clock ticks for dur).
Rules baked in (measured on viral narrated Shorts): one key for the whole film, a hook-y ostinato, sections level-matched,
the bed sits ~11 dB under the voice after mix.py ducking, a drop to near-silence on the twist line.
"""
import json, os, random, struct, subprocess, sys, tempfile
SF = next((p for p in ['/usr/share/sounds/sf2/FluidR3_GM.sf2', '/usr/share/soundfonts/FluidR3_GM.sf2', os.path.expanduser('~/voicekit/FluidR3_GM.sf2')] if os.path.exists(p)), None)
KEYS = {'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63, 'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68, 'Ab': 68, 'A': 57, 'A#': 58, 'Bb': 58, 'B': 59}
# GM programs per channel role
P = dict(strings=48, slow=49, pizz=45, harp=46, brass=61, horn=60, choir=52, piano=0, epiano=4, celesta=8, glock=9, bass=43, pad=89, timp=47, flute=73, sitar=104, tabla=116)
MOODS = {  # progression (scale degrees, minor key), instruments, rhythm
    'epic':    dict(prog=[0, 5, 3, 4], ost='str16', pad=['strings', 'choir'], low='bass', perc='taiko', lead='horn'),
    'triumph': dict(prog=[0, 5, 2, 6], ost='str8', pad=['strings', 'brass', 'choir'], low='bass', perc='taiko', lead='brass', major=True),
    'mystery': dict(prog=[0, 5, 0, 6], ost='celesta', pad=['pad', 'slow'], low='bass', perc=None, lead=None),
    'tension': dict(prog=[0, 0, 5, 4], ost='str8low', pad=['slow'], low='bass', perc='tick', lead=None),
    'wonder':  dict(prog=[0, 5, 2, 6], ost='harp', pad=['strings', 'choir'], low='bass', perc=None, lead='flute', major=True),
    'sad':     dict(prog=[0, 5, 3, 4], ost='piano', pad=['slow'], low=None, perc=None, lead=None),
    'curious': dict(prog=[0, 3, 5, 4], ost='pizz', pad=['strings'], low='bass', perc='light', lead='glock', major=True),
    'dark':    dict(prog=[0, 1, 0, 5], ost='str8low', pad=['slow', 'choir'], low='bass', perc='boom', lead=None),
    'warm':    dict(prog=[0, 4, 5, 3], ost='epiano', pad=['strings'], low='bass', perc='light', lead=None, major=True),
    'chase':   dict(prog=[0, 5, 6, 4], ost='str16', pad=['brass'], low='bass', perc='chase', lead=None),
}
MINOR = [0, 2, 3, 5, 7, 8, 10]; MAJOR = [0, 2, 4, 5, 7, 9, 11]

class Mid:
    def __init__(s, bpm): s.ev = []; s.bpm = bpm; s.tpq = 480
    def t2k(s, t): return int(round(t * s.bpm / 60 * s.tpq))
    def note(s, ch, n, t, d, v):
        if not (0 <= n < 128) or d <= 0: return
        v = max(1, min(127, int(v))); s.ev.append((s.t2k(t), 0x90 | ch, n, v)); s.ev.append((s.t2k(t + d), 0x80 | ch, n, 0))
    def prog(s, ch, p, t=0): s.ev.append((s.t2k(t), 0xC0 | ch, p, None))
    def cc(s, ch, c, val, t): s.ev.append((s.t2k(t), 0xB0 | ch, c, max(0, min(127, int(val)))))
    def write(s, path):
        s.ev.sort(key=lambda e: (e[0], 0 if (e[1] & 0xF0) in (0xC0, 0xB0, 0x80) else 1)); out = bytearray(); last = 0
        def vlq(n):
            b = [n & 0x7F]; n >>= 7
            while n: b.append((n & 0x7F) | 0x80); n >>= 7
            return bytes(reversed(b))
        tempo = int(60_000_000 / s.bpm); out += vlq(0) + bytes([0xFF, 0x51, 3]) + tempo.to_bytes(3, 'big')
        for tk, st, a, b in s.ev:
            out += vlq(max(0, tk - last)); last = tk; out += bytes([st, a] + ([] if b is None else [b]))
        out += vlq(0) + bytes([0xFF, 0x2F, 0])
        open(path, 'wb').write(b'MThd' + struct.pack('>IHHH', 6, 0, 1, s.tpq) + b'MTrk' + struct.pack('>I', len(out)) + out)

def build(plan, dur):
    R = random.Random(plan.get('seed', 7)); bpm = plan.get('bpm', 92); beat = 60 / bpm; bar = beat * 4
    root = KEYS.get(plan.get('key', 'D'), 62) - 12; m = Mid(bpm)
    CH = {'strings': 0, 'slow': 1, 'choir': 2, 'brass': 3, 'horn': 4, 'ost': 5, 'bass': 6, 'lead': 7, 'pad': 8, 'timp': 10, 'harp': 11, 'piano': 12, 'pizz': 13, 'celesta': 14, 'glock': 15}
    for name, ch in CH.items():
        if name == 'ost': continue
        m.prog(ch, P.get(name, 48)); m.cc(ch, 91, 70, 0); m.cc(ch, 7, 100, 0)
    m.prog(10 - 1 if False else 10, P['timp'])
    drops = [(e['t'], e['t'] + e.get('dur', 1.0)) for e in plan.get('events', []) if e['type'] == 'drop']
    muted = lambda t: any(a <= t < b for a, b in drops)
    def chord(deg, major, octv=0):
        sc = MAJOR if major else MINOR; return [root + 12 * octv + sc[(deg + k) % 7] + 12 * ((deg + k) // 7) for k in (0, 2, 4)]
    for sec in plan['sections']:
        mood = MOODS.get(sec.get('mood', 'epic'), MOODS['epic']); e = sec.get('energy', 0.6); major = mood.get('major', False) and not plan.get('minor_only')
        t0, t1 = sec['start'], min(sec['end'], dur); t = t0; bi = 0
        ostp = {'str16': ('strings', 0.25), 'str8': ('strings', 0.5), 'str8low': ('strings', 0.5), 'celesta': ('celesta', 0.5), 'harp': ('harp', 0.5), 'piano': ('piano', 1.0), 'pizz': ('pizz', 0.5), 'epiano': ('piano', 0.5)}[mood['ost']]
        ochan = CH[ostp[0]] if ostp[0] in CH else CH['strings']
        if mood['ost'] == 'epiano': m.prog(CH['piano'], P['epiano'], t0)
        elif mood['ost'] == 'piano': m.prog(CH['piano'], P['piano'], t0)
        while t < t1 - 0.05:
            deg = mood['prog'][bi % len(mood['prog'])]; ch3 = chord(deg, major); bl = min(bar, t1 - t)
            if not muted(t):
                # pads (sustained chords), velocity follows energy and swells across the bar
                for pn in mood['pad']:
                    c = CH.get(pn, CH['strings']); oc = 12 if pn in ('choir', 'strings', 'slow', 'pad') else 0
                    for n in ch3: m.note(c, n + oc, t, bl * 0.98, 38 + 40 * e)
                # bass
                if mood['low']: m.note(CH['bass'], ch3[0] - 12, t, bl * 0.95, 55 + 35 * e)
                # ostinato: the hook (seeded pattern repeated, varied every 4th bar)
                step = ostp[1] * beat; pat = [0, 2, 1, 2, 0, 2, 1, 2] if bi % 4 != 3 else [0, 1, 2, 1, 0, 2, 1, 0]
                k = 0; tt = t
                while tt < t + bl - 1e-3:
                    if not muted(tt):
                        n = ch3[pat[k % len(pat)]] + (24 if mood['ost'] in ('celesta', 'harp') else 12 if mood['ost'] not in ('str8low',) else 0)
                        m.note(ochan, n, tt + R.uniform(0, 0.012), step * 0.85, 45 + 45 * e + R.uniform(-6, 6))
                    tt += step; k += 1
                # lead motif on high energy
                if mood['lead'] and e > 0.55 and bi % 2 == 0:
                    c = CH['horn'] if mood['lead'] in ('horn', 'brass') else CH['lead'] if mood['lead'] == 'flute' else CH['glock']
                    if mood['lead'] == 'flute': m.prog(CH['lead'], P['flute'], t)
                    for j, d in enumerate([0, 2, 4, 2]): m.note(c, ch3[0] + 12 + (MAJOR if major else MINOR)[d % 7], t + j * beat, beat * 0.95, 60 + 40 * e)
                # percussion (GM drums on channel 9 + timpani)
                pc = mood['perc']
                if pc == 'taiko':
                    for j in range(4): m.note(9, 41 if j % 2 == 0 else 45, t + j * beat, 0.2, 70 + 45 * e)
                    m.note(CH['timp'], ch3[0] - 12, t, beat, 60 + 50 * e)
                    if e > 0.7: [m.note(9, 38, t + j * beat + beat / 2, 0.1, 55 + 30 * e) for j in range(4)]
                elif pc == 'tick':
                    for j in range(8): m.note(9, 76 if j % 2 else 77, t + j * beat / 2, 0.05, 50 + 30 * e)
                elif pc == 'light':
                    for j in range(4): m.note(9, 42, t + j * beat, 0.05, 35 + 25 * e)
                    m.note(9, 36, t, 0.1, 50 + 30 * e)
                elif pc == 'boom': m.note(CH['timp'], ch3[0] - 24, t, bar, 50 + 40 * e)
                elif pc == 'chase':
                    for j in range(8): m.note(9, 47 if j % 2 else 45, t + j * beat / 2, 0.1, 60 + 40 * e)
            t += bar; bi += 1
    for ev in plan.get('events', []):
        t = ev['t']; ty = ev['type']
        if ty == 'hit':
            m.note(9, 49, t, 1.5, 110); m.note(CH['timp'], root - 12, t, 1.2, 120); m.note(9, 35, t, 0.3, 120)
            for n in (root - 12, root - 5, root): m.note(CH['brass'], n, t, 0.9, 110)
        elif ty == 'boom': m.note(9, 35, t, 0.4, 127); m.note(CH['timp'], root - 24, t, 1.5, 120)
        elif ty == 'stinger':
            for n in (root, root + 3, root + 7, root + 12): m.note(CH['brass'], n, t, 0.35, 115)
        elif ty == 'riser':
            d = ev.get('dur', 2.0); n_steps = int(d / 0.125)
            for j in range(n_steps): m.note(9, 49 if j > n_steps - 2 else 51, t + j * 0.125, 0.1, 20 + 100 * j / n_steps)
            for j in range(n_steps // 2): m.note(CH['strings'], root + 12 + j % 5, t + j * 0.25, 0.24, 30 + 90 * j / (n_steps / 2))
        elif ty == 'tick':
            d = ev.get('dur', 3.0); k = 0
            while k * 0.5 < d: m.note(9, 76 if k % 2 else 77, t + k * 0.5, 0.05, 90); k += 1
    return m

def main():
    if len(sys.argv) < 4: print(__doc__); sys.exit(1)
    plan = json.load(open(sys.argv[1])); out = sys.argv[2]; dur = float(sys.argv[3])
    if not SF: sys.exit('FluidR3_GM.sf2 not found: apt-get install -y fluidsynth fluid-soundfont-gm')
    m = build(plan, dur); td = tempfile.mkdtemp(); mid = os.path.join(td, 'a.mid'); raw = os.path.join(td, 'raw.wav'); m.write(mid)
    subprocess.run(['fluidsynth', '-ni', '-g', '0.9', '-r', '48000', '-R', '1', '-C', '1', '-F', raw, SF, mid], check=True, capture_output=True)
    drops = ''.join(f",volume=enable='between(t,{e['t']:.2f},{e['t'] + e.get('dur', 1):.2f})':volume=0.08" for e in plan.get('events', []) if e['type'] == 'drop')
    af = f"atrim=0:{dur},apad=whole_dur={dur},equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3500:t=q:w=1:g=1.5,aecho=0.8:0.5:60|110:0.18|0.1{drops},afade=t=out:st={max(0, dur - 2.5):.2f}:d=2.5,loudnorm=I=-18:TP=-2:LRA=9"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', af, '-ar', '48000', '-ac', '2', out], check=True)
    print('wrote', out, dur)

if __name__ == '__main__': main()
