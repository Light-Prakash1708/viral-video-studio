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
 ('f01', None, [('wind', 0.0, -26), ('machine', 0.0, -26), ('whoosh', 1.45, -16), ('whoosh', 2.26, -14), ('riser', 2.3, -16), ('impact', 3.64, -8), ('boom', 3.66, -12)], ('wind', -28)),
 ('f02', 'He slams', [('metal', 0.8, -8), ('swish', 1.4, -12), ('metal', 1.6, -12), ('impact', 4.2, -5), ('boom', 4.25, -10), ('glass', 4.35, -14), ('stones', 4.4, -14)], None),
 ('f03', 'Without thinking', [('gasp', 0.1, -12), ('swish', 1.05, -10), ('hit', 1.2, -14), ('swish', 3.3, -10), ('heartbeat', 1.6, -14)], None),
 ('f04', "Everyone's okay", [('swish', 0.9, -16), ('heartbeat', 1.4, -18), ('sparkle', 2.6, -18), ('heartbeat', 3.0, -16)], ('ambience', -30)),
 ('f05', "He'd spent years", [('whoosh', 0.0, -16), ('metal', 1.4, -18), ('air', 4.46, -8), ('whoosh', 4.5, -12), ('sparkle', 5.2, -14)], ('waves', -30)),
 ('f06', 'So he sketches', [('paper', 0.0, -12), ('swish', 1.0, -18), ('sparkle', 3.2, -12), ('impact', 3.16, -16)], None),
 ('s07', 'He patents it', [('stamp', 0.4, -8)], None),
 ('f08', 'and takes it', [('door', 0.0, -16), ('paper', 0.6, -18), ('cheer', 2.2, -14), ('gasp', 2.6, -20)], None),
 ('s09', 'A crash is over', [('typing', 0.0, -22), ('stamp', 2.6, -8)], None),
 ('f10', 'And nobody', [('machine', 0.0, -26), ('impact', 2.6, -10), ('air', 2.65, -8), ('boing', 2.75, -10)], ('wind', -30)),
 ('f11', 'Then an engineer', [('whoosh', 0.0, -16), ('click', 2.2, -10), ('metal', 2.3, -14), ('click', 5.4, -12), ('impact', 6.16, -8), ('metal', 7.2, -10), ('click', 8.76, -6), ('sparkle', 8.8, -14)], None),
 ('f12', 'Swap the air', [('riser', 0.0, -18), ('click', 1.0, -14), ('fire', 1.35, -10), ('air', 2.3, -12), ('boom', 3.3, -6), ('air', 3.35, -6), ('heartbeat', 5.6, -18)], None),
 ('f13', 'But by the time', [('stamp', 3.1, -8), ('coins', 3.9, -16)], ('ambience', -30)),
 ('f14', "And that's how", [('whoosh', 0.2, -14), ('impact', 0.55, -4), ('glass', 0.6, -12), ('air', 0.65, -10), ('metal', 0.7, -12), ('gong', 1.0, -16)], None),
]
st, prev = [], 0
for sid, a, *_ in S:
    t = 0 if a is None else find(a, prev) - 0.1
    st.append(max(t, prev)); prev = st[-1] + 0.6
shots = []
for i, (sid, a, fx, amb) in enumerate(S):
    s = round(st[i], 3); e = round(st[i + 1], 3) if i + 1 < len(S) else round(D, 3)
    sh = {'id': sid, 'start': s, 'end': e, 'line': '', 'scene': sid, 'set': '', 'bars': 'none', 'in': {'type': 'cut', 'dur': 0.12}, 'sfx': [{'at': x[1], 'name': x[0], 'gain': x[2]} for x in fx if x[1] < e - s], 'captions': True}
    if amb: sh['amb'] = {'name': amb[0], 'gain': amb[1]}
    shots.append(sh)
for s in shots:
    d = s['end'] - s['start']
    if d < 1.2 or d > 8: print('check', s['id'], round(d, 2))
json.dump({'title': 'The Rock That Invented the Airbag', 'duration': D, 'shots': shots, 'music': [{'start': 0, 'end': D, 'mood': 'curious', 'intensity': 0.5}]}, open('story/shots.json', 'w'), indent=1)
json.dump({'starts': {sid: st[i] for i, (sid, *_) in enumerate(S)}}, open('story/starts.json', 'w'), indent=1)
print(len(shots), 'shots', D)
