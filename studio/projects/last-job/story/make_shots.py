# build story/shots.json: each shot starts at its anchor phrase (from timeline/words.json); shots tile the timeline.
import json, re, sys
W = json.load(open('timeline/words.json')); W = W['words'] if isinstance(W, dict) else W
L = json.load(open('vo/lines.json')); DUR = L['duration']
norm = lambda s: re.sub(r"[^\w']", '', s.lower())
words = [(norm(w.get('word', w.get('w', ''))), w['start']) for w in W]
def find(phrase, after):
    p = [norm(x) for x in phrase.split()]
    for i in range(len(words)):
        if words[i][1] < after - 0.05: continue
        if all(i + k < len(words) and words[i + k][0].startswith(p[k]) for k in range(len(p))): return words[i][1]
    raise SystemExit(f'anchor not found: {phrase!r} after {after:.2f}')
DLG = {l['seg']: l for l in L['lines']}
# (id, anchor phrase | ('D', seg) | ('T', absolute time), description, captions, sfx, amb)
S = [
 ('s01', ('T', 0.0), 'Dawn, empty Track 4, push toward the one lit cart; HUD appears', True, [('at', 0.3, 'wind', -26)], ('roomtone', -30)),
 ('s02', 'still had a job', 'Title card over the dawn platform', False, [('rel', 0.55, 'impact', -14), ('rel', 0.55, 'shimmer', -20)], None),
 ('s03', 'His name was', 'CU Walt behind the counter', True, [], ('murmur', -32)),
 ('s04', 'And he sold coffee', 'Insert: coffee pours into a mug', True, [('rel', 0.2, 'pop', -22)], None),
 ('s05', 'Everything else had', 'Neon street full of robots', True, [('rel', 0.0, 'whoosh', -17)], ('city', -26)),
 ('s06', 'Robots drove the trains', 'Bullet train blasts through Track 4', True, [('rel', 0.0, 'carpass', -14)], None),
 ('s07', 'Robots taught the', 'Robot teacher in a classroom', True, [('rel', 0.0, 'swish', -18)], None),
 ('s08', 'Robots did the surgery', 'Robot doctor in a hospital corridor', True, [('rel', 0.0, 'blip', -20)], None),
 ('s09', 'wrote the songs', 'Robot playing guitar on stage', True, [('rel', 0.0, 'swish', -18)], None),
 ('s10', 'and cooked every', 'Robot chef in a kitchen', True, [('rel', 0.0, 'swish', -18)], None),
 ('s11', 'Eight billion people', 'Humans idle in the park, 8 billion counter', True, [('rel', 0.3, 'counter', -20)], ('wind', -28)),
 ('s12', 'The government paid', 'Universal income notification over a bedroom', True, [('rel', 0.4, 'phonebuzz', -18)], ('roomtone', -28)),
 ('s13', 'And nobody it seemed', 'A lone figure in the void', True, [('rel', 0.0, 'hum', -24)], None),
 ('s14', 'Except for one small', 'Crane down Track 4 to the cart', True, [('rel', 0.0, 'whoosh', -18)], ('roomtone', -30)),
 ('s15', 'in a train station', 'Train blasts past without stopping; Walt keeps working', True, [('rel', 0.5, 'carpass', -12)], None),
 ('s16', 'The sign said', 'Tilt from the WALT\'S COFFEE sign down to Walt', True, [], None),
 ('s17', 'Across the street', 'The BREW-O-MAT glows across the tracks', True, [('rel', 1.0, 'blip', -20)], ('city', -30)),
 ('s18', 'And still every morning', 'Twelve people in line for Walt at 6 AM', True, [], ('murmur', -26)),
 ('s19', 'The Department of', 'The Department of Efficiency detects the last human job', True, [('rel', 0.2, 'hum', -22), ('rel', 1.4, 'glitch', -20)], None),
 ('s20', 'So they sent', 'M-7 powers on', True, [('rel', 0.5, 'powerup', -16)], None),
 ('s21', 'to close the last', 'M-7 hovers down the platform toward the cart', True, [('rel', 0.0, 'riser', -20)], ('roomtone', -30)),
 ('s22', ('D', 1), 'M-7 scans the coffee: data callouts', True, [('rel', 0.3, 'blip', -18), ('rel', 1.6, 'blip', -18), ('rel', 2.8, 'blip', -18)], None),
 ('s23', 'Why do they', 'CU M-7, head tilt', True, [], None),
 ('s24', ('D', 2), 'Walt: Stay one week. Then you tell me.', True, [], None),
 ('s25', 'So M-7 stayed', 'Wide: M-7 parked beside the cart, watching', True, [], ('murmur', -28)),
 ('s26', 'On Monday Mr', 'MONDAY: Mr. Bennett arrives', True, [('rel', 0.0, 'whoosh', -20), ('rel', 0.5, 'footstep', -22)], None),
 ('s27', 'He just set down', 'Insert: two cinnamon cookies on the plate', True, [], None),
 ('s28', 'Her favorite', 'CU Mr. Bennett, tears then a small smile', True, [('rel', 0.1, 'shimmer', -26)], None),
 ('s29', 'On Tuesday a young', 'TUESDAY: Arjun shuffles in', True, [('rel', 0.0, 'whoosh', -20)], None),
 ('s30', 'Walt tossed him', 'Walt hands Arjun a dish towel', True, [('rel', 0.1, 'swish', -20)], None),
 ('s31', 'Arjun stayed until', 'Arjun washing mugs, smiling', True, [], None),
 ('s32', 'On Wednesday it was', 'WEDNESDAY: Maya, nervous, math test', True, [('rel', 0.0, 'whoosh', -20)], None),
 ('s33', ('D', 4), 'CU Maya: Extra marshmallows, Mr. Walt?', True, [], None),
 ('s34', ('D', 5), 'CU Walt winks: On test days? Always.', True, [('rel', 0.9, 'ding', -24)], None),
 ('s35', 'Every night M-7', 'Night station: M-7 alone with its tablet', True, [('rel', 0.0, 'whoosh', -20)], ('wind', -30)),
 ('s36', 'Monday said', 'Report terminal: Inefficiency detected', True, [('rel', 0.3, 'tick', -22), ('rel', 1.6, 'tick', -22)], None),
 ('s37', 'By Friday', 'PATTERN UNKNOWN', True, [('rel', 1.3, 'glitch', -20)], None),
 ('s38', 'On Sunday the seventh', 'SUNDAY: M-7 arrives at dawn', True, [('rel', 0.0, 'whoosh', -20)], ('wind', -30)),
 ('s39', 'But the cart was', 'The cart is shuttered', True, [('rel', 0.5, 'stinger', -18)], None),
 ('s40', 'Walt was in the', 'Hospital room at night, rain', True, [('rel', 0.2, 'heartbeat', -22)], ('rain', -26)),
 ('s41', 'It had been working', 'CU Walt resting', True, [], None),
 ('s42', 'M-7 stood by', 'Wide: M-7 at the bedside', True, [], None),
 ('s43', ('D', 7), 'CU M-7: What do I write?', True, [], None),
 ('s44', 'Walt smiled', 'CU Walt smiles', True, [], None),
 ('s45', ('D', 9), 'Walt: open my cart tomorrow', True, [], None),
 ('s46', ('D', 10), 'CU M-7: I am not allowed to do a human job.', True, [], None),
 ('s47', ('D', 11), 'Walt: Then don\'t do it like a machine.', True, [], None),
 ('s48', 'That night the oldest', 'The heart monitor goes quiet; M-7 bows', True, [('rel', 0.3, 'heartbeat', -24)], ('rain', -28)),
 ('s49', 'At six the next', 'Dawn: the shutter rises', True, [('rel', 1.6, 'whoosh', -22)], ('roomtone', -30)),
 ('s50', 'There was a robot', 'M-7 behind the counter with the coffee pot', True, [], ('murmur', -28)),
 ('s51', 'And the coffee was', 'Insert pour, callouts checked green', True, [('rel', 0.8, 'ding', -22), ('rel', 2.0, 'ding', -22)], None),
 ('s52', 'Mr Bennett got', 'Bennett gets cookies, Arjun gets a towel', True, [], None),
 ('s53', 'And Maya\'s hot', 'Maya gets hot chocolate with a note', True, [('rel', 1.8, 'shimmer', -24)], None),
 ('s54', 'Test day Walt', 'The handwritten note over Maya\'s tearful smile', True, [], None),
 ('s55', 'That evening M-7', 'Evening: M-7 alone on the bench', True, [('rel', 0.0, 'whoosh', -22)], ('wind', -30)),
 ('s56', ('D', 13), 'Final report: STATUS NOT CLOSED, HUD turns gold', True, [('rel', 0.3, 'tick', -22), ('rel', 2.1, 'shimmer', -16)], None),
 ('s57', 'And on the cart', 'M-7 hangs HELP WANTED. Humans only.', True, [('rel', 0.8, 'pop', -20)], None),
 ('s58', 'Twelve years later', 'Twelve years later: Maya runs the busiest cart', True, [('rel', 0.0, 'whoosh', -18)], ('murmur', -24)),
 ('s59', 'Her name is Maya', 'CU adult Maya', True, [], None),
 ('s60', 'And on test days', 'Maya hands a kid extra marshmallows, winks', True, [], None),
 ('s61', 'Because machines can', 'Crane up over the busy cart', True, [], None),
 ('s62', 'But somebody still', 'CU the 1999 photo of Walt', True, [('rel', 0.5, 'shimmer', -24)], None),
 ('s63', 'So what is the', 'CTA over the golden platform', True, [], ('roomtone', -30)),
]
out, t_prev = [], 0.0
starts = []
for sid, anc, desc, cap, sfx, amb in S:
    if isinstance(anc, tuple) and anc[0] == 'T': st = anc[1]
    elif isinstance(anc, tuple) and anc[0] == 'D': st = DLG[anc[1]]['start'] - 0.15
    else: st = find(anc, t_prev) - 0.12
    if sid == 's02': st = find('still had a job', 0) + 0.9   # the title rides the hold after "job."
    st = max(st, t_prev + 0.8 if starts else 0); starts.append(st); t_prev = st
for i, (sid, anc, desc, cap, sfx, amb) in enumerate(S):
    st = 0.0 if i == 0 else round(starts[i], 3); en = round(starts[i + 1], 3) if i + 1 < len(S) else round(DUR, 3)
    fx = [{'at': round(a, 3), 'name': n, 'gain': g} for (_, a, n, g) in sfx]
    sh = {'id': sid, 'start': st, 'end': en, 'line': '', 'scene': sid, 'set': desc, 'bars': 'none', 'in': {'type': 'cut', 'dur': 0.2 if i else 0.6}, 'sfx': fx, 'captions': cap}
    if amb: sh['amb'] = {'name': amb[0], 'gain': amb[1]}
    out.append(sh)
dur = [s['end'] - s['start'] for s in out]
print('shots', len(out), 'min %.2f max %.2f mean %.2f' % (min(dur), max(dur), sum(dur) / len(dur)), 'total', DUR)
for s in out:
    if s['end'] - s['start'] > 6.5 or s['end'] - s['start'] < 1.0: print('  check', s['id'], round(s['end'] - s['start'], 2))
json.dump({'title': 'The Last Human Job on Earth', 'duration': DUR, 'shots': out, 'music': [{'start': 0, 'end': DUR, 'mood': 'calm', 'intensity': 0.4}]}, open('story/shots.json', 'w'), indent=1)
