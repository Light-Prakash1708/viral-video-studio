# story/shots.json for "The Bikini Was Named After a Bomb" v2: shots start at their anchor words; SFX on every beat.
import json, re
W = json.load(open('timeline/words.json')); W = W['words'] if isinstance(W, dict) else W
D = json.load(open('config.json'))['duration']
norm = lambda s: re.sub(r"[^\w']", '', s.lower())
words = [(norm(w['word']), w['start']) for w in W]
def find(ph, after):
    p = [norm(x) for x in ph.split()]
    for i in range(len(words)):
        if words[i][1] < after - 0.05: continue
        if all(i + k < len(words) and words[i + k][0].startswith(p[k]) for k in range(len(p))): return words[i][1]
    raise SystemExit('anchor not found: ' + ph)
S = [  # id, anchor, [(sfx, at, gain)], ambience
 ('f01', None, [('wind', 0.0, -24), ('machine', 0.0, -24), ('whoosh', 1.45, -16), ('riser', 'rock-0.6', -14), ('whoosh', 'rock-0.1', -14), ('impact', 'END-0.62', -6), ('boom', 'END-0.6', -10)], ('wind', -28)),
 ('f02', 'He slams', [('screech', 'brakes', -6), ('swish', 'yanks', -12), ('screech', 'yanks+0.1', -10), ('ditchcrash', 'ditch', -4), ('impact', 'ditch', -8), ('glass', 'ditch+0.1', -16)], None),
 ('f03', 'Without thinking', [('gasp', 0.05, -12), ('swish', 'throws', -8), ('hit', 'throws+0.15', -14), ('swish', 'wife', -8), ('heartbeat', 'little', -16)], None),
 ('f04', "Everyone's okay", [('swish', 'night-0.3', -16), ('heartbeat', 'what', -12), ('heartbeat', 'fast', -12)], ('nightroom', -16)),
 ('f05', "He'd spent years", [('whoosh', 0.0, -16), ('metal', 'navy', -18), ('torpedo', 'blast', -5), ('sparkle', 'air', -14)], ('waves', -30)),
 ('f06', 'So he sketches', [('pencil', 0.2, -8), ('pencil', 'folded', -8), ('pencil', 'steering', -8), ('airbagpop', 'bursts', -12), ('sparkle', 'bursts+0.3', -14)], None),
 ('s07', 'He patents it', [('stamp', 'patents+0.5', -6)], None),
 ('f08', 'and takes it', [('door', 0.0, -14), ('swish', 'every', -16), ('swish', 'carmaker', -16), ('officelaugh', 'laugh', -4), ('officelaugh', 'laugh+0.7', -6), ('impact', 'room', -6)], None),
 ('s09', 'A crash is over', [('typing', 0.0, -22), ('stamp', 'slow', -6)], None),
 ('f10', 'And nobody', [('machine', 0.0, -24), ('impact', 'pothole-0.05', -10), ('airbagpop', 'pothole', -6), ('boing', 'pothole+0.25', -12)], ('wind', -30)),
 ('f11', 'Then an engineer', [('whoosh', 0.0, -16), ('ballmagnet', 'drops+0.1', -6), ('click', 'magnet', -10), ('toycrash', 'wall-0.15', -4), ('metal', 'flies', -12), ('click', 'circuit', -6), ('sparkle', 'circuit+0.05', -12)], None),
 ('f12', 'Swap the air', [('click', 0.3, -10), ('ignite', 'burns', -6), ('air', 'nitrogen', -10), ('airbagpop', 'fills', -4), ('heartbeat', 'blink', -16)], None),
 ('f13', 'But by the time', [('stamp', 'expired', -6), ('coins', 'cent', -18)], ('ambience', -30)),
 ('f14', "And that's how", [('crashtest', 0.5, -4), ('airbagpop', 0.58, -8), ('gong', 'airbag', -14), ('sparkle', 'airbag+0.2', -14)], None),
]
st, prev = [], 0
for sid, a, *_ in S:
    t = 0 if a is None else find(a, prev) - 0.1
    st.append(max(t, prev)); prev = st[-1] + 0.6
def at(v, s, e):
    if not isinstance(v, str): return v
    m = re.match(r"^([A-Za-z']+)([+-][\d.]+)?$", v); off = float(m.group(2) or 0)
    if m.group(1) == 'END': return e - s + off
    try: return find(m.group(1), s - 0.2) - s + off
    except SystemExit: return -1
shots = []
for i, (sid, a, fx, amb) in enumerate(S):
    s = round(st[i], 3); e = round(st[i + 1], 3) if i + 1 < len(S) else round(D, 3)
    sh = {'id': sid, 'start': s, 'end': e, 'line': '', 'scene': sid, 'set': '', 'bars': 'none', 'in': {'type': 'cut', 'dur': 0.12}, 'sfx': [{'at': round(at(x[1], s, e), 3), 'name': x[0], 'gain': x[2]} for x in fx if 0 <= at(x[1], s, e) < e - s], 'captions': True}
    if amb: sh['amb'] = {'name': amb[0], 'gain': amb[1]}
    shots.append(sh)
for s in shots:
    d = s['end'] - s['start']
    if d < 1.2 or d > 8: print('check', s['id'], round(d, 2))
json.dump({'title': 'The Rock That Invented the Airbag', 'duration': D, 'shots': shots, 'music': [{'start': 0, 'end': D, 'mood': 'curious', 'intensity': 0.5}]}, open('story/shots.json', 'w'), indent=1)
json.dump({'starts': {sid: st[i] for i, (sid, *_) in enumerate(S)}}, open('story/starts.json', 'w'), indent=1)
print(len(shots), 'shots', D)
