# build story/shots.json for "What If Ravan Had Won" v2: each shot starts at its anchor phrase in timeline/words.json.
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
# (scene id, anchor, sfx list [(name, at, gain)], amb, captions)
S = [
 ('v01', None, [('impact', 0.05, -10), ('cheer', 0.3, -22)], ('murmur', -22), False),
 ('v02', 'Ten heads', [('flash', 0.0, -16)], None, False),
 ('v03', 'But tell me', [('whoosh', 0.0, -16), ('slowmo', 1.2, -16)], ('wind', -28), True),
 ('d01', 'Wait', [('swish', 0.0, -20)], ('roomtone', -30), True),
 ('r01', 'In one universe', [('riser', 0.0, -20)], ('wind', -28), True),
 ('r08', 'And this is his', [('impact', 0.1, -12), ('shimmer', 0.4, -18)], None, False),
 ('ch1', 'Chapter one', [('stinger', 0.0, -16)], None, False),
 ('r09', 'The Ramayan describes', [('whoosh', 0.0, -20)], ('wind', -28), True),
 ('r10', 'A city of gold', [('shimmer', 0.2, -18)], None, True),
 ('d02', "But wasn't", [('swish', 0.0, -20)], ('roomtone', -30), True),
 ('r11', 'Not just', [('whoosh', 0.0, -20)], None, True),
 ('r13', 'A master of the veena', [('ding', 0.4, -22)], None, True),
 ('r14', 'A devotee of Shiva', [('thunder', 0.6, -22)], ('wind', -28), True),
 ('q16', 'The Shiva Tandav', [('shimmer', 0.2, -20)], None, True),
 ('r17', 'So imagine that mind', [('riser', 0.0, -20)], None, True),
 ('ch2', 'Chapter two', [('stinger', 0.0, -16)], None, False),
 ('r19', 'By the year one thousand', [('whoosh', 0.0, -20)], None, True),
 ('r20', 'Spice silk gold', [('pop', 0.2, -20), ('pop', 0.8, -20), ('pop', 1.4, -20)], None, True),
 ('p21', 'And then the Pushpak', [('whoosh', 0.1, -18), ('shimmer', 0.6, -18)], ('wind', -26), True),
 ('p23', 'In this world Lankan', [('whoosh', 0.2, -20), ('hum', 0.0, -24)], ('wind', -28), True),
 ('r25', 'By 2026', [('riser', 0.0, -20)], ('city', -26), True),
 ('r26', 'Silent golden aircraft', [('whoosh', 0.3, -18), ('whoosh', 1.4, -20)], None, True),
 ('d03', 'Okay that part', [('swish', 0.0, -20)], ('roomtone', -30), True),
 ('r28', "And here's a real fact", [('blip', 0.3, -18)], None, True),
 ('r29', 'was named after', [('powerup', 0.2, -20)], None, True),
 ('r31', 'Ten great towers', [('impact', 0.1, -14)], ('city', -26), True),
 ('r34', 'Medicine Music', [('ding', 0.0, -22), ('ding', 0.6, -22), ('ding', 1.2, -22), ('ding', 1.8, -22)], None, True),
 ('r36', 'Ten minds', [('shimmer', 0.2, -20)], None, True),
 ('ch3', 'Chapter three', [('stinger', 0.0, -14), ('thunder', 0.4, -20)], None, False),
 ('d04', "So where's the catch", [('swish', 0.0, -20)], ('roomtone', -30), True),
 ('q41', 'There is no Dussehra', [('hum', 0.0, -22)], ('wind', -26), True),
 ('q43', 'Children grow up', [], None, True),
 ('q45', 'The ten towers watch', [('glitch', 0.5, -20)], None, True),
 ('r47', "You're simply forgotten", [('slowmo', 0.0, -20)], None, True),
 ('q49', 'And somewhere in the archives', [('whoosh', 0.0, -22)], ('wind', -28), True),
 ('q50', 'Of a woman taken', [('heartbeat', 0.3, -18)], None, True),
 ('d05', 'So was he good', [('swish', 0.0, -20)], ('roomtone', -30), True),
 ('r52', "That's the real question", [('impact', 0.0, -16)], None, True),
 ('r54', 'Even his own brother', [('footstep', 0.8, -20), ('footstep', 1.4, -20)], ('wind', -28), True),
 ('r56', "Maybe that's why", [('riser', 0.0, -22)], None, True),
 ('r57', 'Not because he was weak', [], None, True),
 ('q58', 'Pride', [('impact', 0.0, -10)], None, True),
 ('r63', 'So you burn me every', [('cheer', 1.6, -20)], ('murmur', -22), True),
 ('e01', 'so that you never', [('heartbeat', 0.2, -16)], None, False),
 ('g69', 'So tell me', [('shimmer', 0.0, -20)], ('wind', -28), True),
 ('g70', 'Comment yes', [('pop', 0.3, -18), ('pop', 0.9, -18)], None, True),
]
st, prev = [], 0
for sid, a, *_ in S:
    t = 0 if a is None else find(a, prev) - 0.12
    st.append(max(t, prev)); prev = st[-1] + 0.6
shots = []
for i, (sid, a, fx, amb, cap) in enumerate(S):
    s = round(st[i], 3); e = round(st[i + 1], 3) if i + 1 < len(S) else round(D, 3)
    sh = {'id': sid, 'start': s, 'end': e, 'line': '', 'scene': sid, 'set': '', 'bars': 'none', 'in': {'type': 'cut', 'dur': 0.15}, 'sfx': [{'at': x[1], 'name': x[0], 'gain': x[2]} for x in fx], 'captions': cap}
    if amb: sh['amb'] = {'name': amb[0], 'gain': amb[1]}
    shots.append(sh)
for s in shots:
    d = s['end'] - s['start']
    if d < 1.2 or d > 7.5: print('check', s['id'], round(d, 2))
json.dump({'title': 'What If Ravana Had Won', 'duration': D, 'shots': shots, 'music': [{'start': 0, 'end': D, 'mood': 'epic', 'intensity': 0.5}]}, open('story/shots.json', 'w'), indent=1)
print(len(shots), 'shots', D)
json.dump({'starts': {sid: st[i] for i, (sid, *_) in enumerate(S)}}, open('story/starts.json', 'w'), indent=1)
