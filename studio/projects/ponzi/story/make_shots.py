# story/shots.json for the Ponzi Short: shots start at anchor words; dense word-anchored SFX ('word+off' / 'END-off').
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
S = [
 ('q01', None, [('crowdmurmur', 0.0, -26), ('heartbeat', 0.0, -18), ('moneyflutter', 'one', -8), ('swish', 'one+0.2', -12), ('whoosh', 'forty', -10), ('paper', 'forty+0.3', -14), ('paper', 'forty+0.7', -14), ('paper', 'forty+1.1', -14), ('moneyflutter', 'back', -6), ('cashregister', 'fifty', -6), ('tick', 'exactly', -10), ('bell', 'time', -12)], ('city', -30)),
 ('q02', "That's the", [('impact', 0.0, -4), ('stamp', 0.4, -4), ('boom', 0.42, -10)], None),
 ('q03', 'Boston', [('ahooga', 0.3, -12), ('footstep', 0.6, -18), ('footstep', 1.1, -18), ('footstep', 1.6, -18), ('crowdmurmur', 0.0, -24), ('coins', 'broke', -14), ('boing', 'broke+0.1', -14)], ('city', -28)),
 ('q04', 'loophole', [('whoosh', 0.0, -12), ('sparkle', 0.1, -12), ('paper', 'coupon-0.2', -10), ('stamp', 'coupon+0.1', -12), ('click', 'italy', -10), ('whoosh', 'swap', -12), ('coins', 'america', -10), ('sparkle', 'america+0.1', -14)], None),
 ('q05', 'Buy low', [('hit', 'buy', -8), ('hit', 'swap', -8), ('cashregister', 'get', -4), ('coinshower', 'rich', -8)], None),
 ('q06', 'So he makes', [('crowdmurmur', 0.0, -18), ('whoosh', 'fifty-0.2', -10), ('cheer', 'days', -8), ('impact', 'fifty', -10)], None),
 ('q07', "Here's the", [('riser', 0.0, -14), ('cashregister', 'pays', -4), ('moneyflutter', 'pays+0.2', -8), ('cheer', 'every', -12), ('coins', 'money', -10), ('bell', 'time', -10), ('tick', 'on', -14)], None),
 ('q08', 'They tell', [('swish', 0.0, -12), ('swish', 'friends', -12), ('click', 'empty', -10), ('coins', 'savings', -12), ('stamp', 'mortgage', -6), ('door', 'homes', -14)], None),
 ('q09', 'Soon', [('crowdmurmur', 0.0, -16), ('ahooga', 0.8, -12), ('cashregister', 'million', -6), ('coinshower', 'week', -10)], ('city', -28)),
 ('q10', 'Cash in closets', [('door', 'closets-0.05', -8), ('moneyflutter', 'closets', -4), ('hit', 'drawers', -8), ('moneyflutter', 'drawers+0.05', -6), ('metal', 'wastebaskets', -10), ('coinshower', 'wastebaskets+0.1', -8)], None),
 ('q11', 'He buys a mansion', [('stamp', 'mansion+0.2', -6), ('whoosh', 'why', -10), ('bankvault', 'bank', -6), ('gasp', 'bank+0.3', -16)], ('city', -30)),
 ('q12', 'But nobody', [('heartbeat', 0.2, -10), ('tick', 'obvious', -12), ('heartbeat', 'where', -8), ('riser', 'money', -12)], None),
 ('q13', 'One reporter', [('typing', 0.0, -12), ('paper', 'math', -10), ('chalk', 'hundred', -8), ('riser', 'million', -12), ('boom', 'twenty', -6), ('impact', 'world', -4)], None),
 ('q14', 'There was never', [('whoosh', 0.0, -10), ('stamp', 'loophole', -10), ('moneyflutter', 'your', -8), ('coins', 'next', -10), ('heartbeat', 'hundred', -14)], None),
 ('q15', 'The headlines', [('printingpress', 0.0, -8), ('impact', 'hit', -6), ('crowdangry', 'turn', -6), ('policewhistle', 'turn+0.4', -10), ('bankvault', 'six', -6), ('boom', 'collapse', -8)], None),
 ('q16', 'Forty thousand', [('crowdangry', 0.0, -16), ('coins', 'forty', -12), ('impact', 'twenty', -8), ('gasp', 'dollars', -16)], ('wind', -26)),
 ('q17', 'Ponzi dies', [('heartmonitor', 0.0, -12), ('coins', 'seventy', -14)], ('ambience', -30)),
 ('q18', 'But his trick', [('whoosh', 0.0, -12), ('phone', 'crypto', -8), ('click', 'apps', -10), ('phone', 'whatsapp', -8), ('click', 'groups', -10), ('click', 'groups+0.2', -10), ('impact', 'guaranteed', -6), ('cashregister', 'guaranteed+0.2', -10)], None),
 ('q19', 'So if a', [('crowdmurmur', 0.0, -26), ('heartbeat', 0.0, -14), ('moneyflutter', 'hands', -10), ('paper', 'whose', -8), ('whoosh', 'whose', -12), ('boom', 'really', -10)], ('city', -30)),
]
st, prev = [], 0
for sid, a, *_ in S:
    t = 0 if a is None else find(a, prev) - 0.08
    st.append(max(t, prev)); prev = st[-1] + 0.5
def at(v, s, e):
    if not isinstance(v, str): return v
    m = re.match(r"^([A-Za-z']+)([+-][\d.]+)?$", v); off = float(m.group(2) or 0)
    if m.group(1) == 'END': return e - s + off
    try: return find(m.group(1), s - 0.15) - s + off
    except SystemExit: return -1
shots = []
for i, (sid, a, fx, amb) in enumerate(S):
    s = round(st[i], 3); e = round(st[i + 1], 3) if i + 1 < len(S) else round(D, 3)
    sh = {'id': sid, 'start': s, 'end': e, 'line': '', 'scene': sid, 'set': '', 'bars': 'none', 'in': {'type': 'cut', 'dur': 0.08}, 'sfx': [{'at': round(at(x[1], s, e), 3), 'name': x[0], 'gain': x[2]} for x in fx if 0 <= at(x[1], s, e) < e - s], 'captions': True}
    if amb: sh['amb'] = {'name': amb[0], 'gain': amb[1]}
    if sid in ('q01', 'q19'): sh['captionStyle'] = {'y': 1800}
    shots.append(sh)
n = sum(len(s['sfx']) for s in shots)
json.dump({'title': 'The Man Who Paid You With Your Own Money', 'duration': D, 'shots': shots, 'music': [{'start': 0, 'end': D, 'mood': 'curious', 'intensity': 0.5}]}, open('story/shots.json', 'w'), indent=1)
print(len(shots), 'shots', round(D, 1), 's |', n, 'sfx =', round(n / D, 2), 'per second'); [print(s['id'], s['start'], round(s['end'] - s['start'], 2), len(s['sfx'])) for s in shots]
