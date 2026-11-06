"""retime.py: re-time a finished project to a NEW voice-over (e.g. swap Kokoro for an ElevenLabs take) without
rewriting scenes. Maps every shot boundary, SFX offset and music section from the old word timeline to the new one
(piecewise-linear over matched words), so shots keep landing on the same words.

usage (from the studio root):
  cp projects/P/timeline/words.json /tmp/words_old.json        # BEFORE re-transcribing
  cp new_voice.wav projects/P/input/voiceover.wav
  python3 tools/transcribe.py --project projects/P --script <script.txt>
  python3 <skill>/tools/retime.py projects/P /tmp/words_old.json
Scenes that use wordTime()/local() adapt automatically; hard-coded fallback seconds inside shots stay as they are.
"""
import json, sys, bisect, subprocess
P, OLD = sys.argv[1], sys.argv[2]
ld = lambda f: (lambda d: d if isinstance(d, list) else d['words'])(json.load(open(f)))
old, new = ld(OLD), ld(f'{P}/timeline/words.json')
assert len(old) == len(new), f'word counts differ: {len(old)} vs {len(new)} (same script required)'
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{P}/input/voiceover.wav'], capture_output=True, text=True).stdout)
xs, ys = [0.0], [0.0]
for o, n in zip(old, new):
    for a, b in ((o['start'], n['start']), (o['end'], n['end'])):
        if a > xs[-1] + 1e-3 and b > ys[-1] + 1e-3: xs.append(a); ys.append(b)
cfg = json.load(open(f'{P}/config.json')); xs.append(max(cfg['duration'], xs[-1] + 0.1)); ys.append(round(dur, 3))
def M(t):
    i = max(0, min(bisect.bisect_right(xs, t) - 1, len(xs) - 2)); a, b = xs[i], xs[i + 1]
    return ys[i] + (ys[i + 1] - ys[i]) * (t - a) / (b - a)
d = json.load(open(f'{P}/story/shots.json'))
for s in d['shots']:
    ns, ne = round(M(s['start']), 3), round(M(s['end']), 3); r = (ne - ns) / max(0.01, s['end'] - s['start'])
    for c in s.get('sfx', []) or []: c['at'] = round(float(c.get('at', 0)) * r, 3)
    s['start'], s['end'] = ns, ne
d['shots'][0]['start'] = 0.0; d['shots'][-1]['end'] = round(dur, 3)
for i in range(1, len(d['shots'])): d['shots'][i]['start'] = d['shots'][i - 1]['end']
for m in d.get('music', []) or []: m['start'], m['end'] = round(M(m['start']), 3), round(M(m['end']), 3)
if d.get('music'): d['music'][0]['start'] = 0; d['music'][-1]['end'] = round(dur, 3)
d['duration'] = cfg['duration'] = round(dur, 3)
json.dump(d, open(f'{P}/story/shots.json', 'w'), indent=1); json.dump(cfg, open(f'{P}/config.json', 'w'), indent=1)
L = [s['end'] - s['start'] for s in d['shots']]; print(f'retimed {len(L)} shots to {dur:.2f}s (shortest {min(L):.2f}s, longest {max(L):.2f}s)')
