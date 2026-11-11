import sys, math, json, random
sys.path.insert(0, '/home/user/viral-video-studio/studio/shorts_gen')
from common import *

words = load_words('/root/hf-shorts/fp2_words.json')
meta = json.load(open('/root/hf-shorts/fp2_meta.json'))
DUR = round(meta['dur'] + 2.4, 2)
P = Proj('fp2', DUR, words)
GREEN = '#43e08a'; GOLD = AMBER; SICK = '#ff5252'
src = open('/root/hf-shorts/fp.py').read()
exec(src[src.index('P.css.append('):src.index("P.add('<div id=\"bg\">")])      # shared css classes
exec(src[src.index('GLYPH ='):src.index('# ============================ HOOK')])      # shared helpers (node, badge, chip, edges_svg, draw, txt, slam, vpanel, top_label, scene, ...)

# ------------------------------------------------------------------ new background: teal-to-plum night with bokeh + light sweeps
P.css.append(f"""
#bg2{{position:absolute;inset:0;background:linear-gradient(168deg,#06404a 0%,#0a2a3a 34%,#1b1530 70%,#120a1c 100%)}}
.bk{{position:absolute;border-radius:50%;opacity:0}}
.pt{{position:absolute;width:7px;height:7px;border-radius:50%;background:#fff3e6;opacity:0}}
#beam1,#beam2{{position:absolute;top:-200px;height:2400px;width:300px;background:linear-gradient(90deg,rgba(255,243,230,0),rgba(255,243,230,.07),rgba(255,243,230,0));transform:rotate(18deg);opacity:1}}
""")
P.add('<div id="bg2"></div>')
rng = random.Random(11)
cols = [('rgba(255,179,71,.55)', 'rgba(255,179,71,0)'), ('rgba(255,79,109,.5)', 'rgba(255,79,109,0)'), ('rgba(47,230,208,.5)', 'rgba(47,230,208,0)')]
for i in range(16):
    sz = rng.randint(120, 330); x = rng.randint(-60, 1000); y = rng.randint(-40, 1750); a, b = cols[i % 3]
    P.add(f'<div id="bk{i}" class="bk" style="left:{x}px;top:{y}px;width:{sz}px;height:{sz}px;background:radial-gradient(circle,{a} 0%,{b} 68%)"></div>')
    P.frm(f'#bk{i}', {'opacity': 0}, {'opacity': .5 + .3 * (i % 2), 'duration': 1.2}, .1 + .05 * i)
    P.to(f'#bk{i}', {'x': rng.randint(-70, 70), 'y': rng.randint(-90, 90), 'duration': DUR, 'ease': 'sine.inOut'}, 0)
for i in range(26):
    x = rng.randint(20, 1060); y = rng.randint(200, 1800); d = rng.uniform(7, 14)
    P.add(f'<div id="pt{i}" class="pt" style="left:{x}px;top:{y}px"></div>')
    P.frm(f'#pt{i}', {'opacity': 0, 'y': 0}, {'opacity': .7, 'y': -220, 'duration': d, 'ease': 'none'}, rng.uniform(0, DUR - d))
    P.to(f'#pt{i}', {'opacity': 0, 'duration': 1.5}, DUR - 1.6)
P.add('<div id="beam1" style="left:120px"></div><div id="beam2" style="left:640px"></div>')
P.to('#beam1', {'x': 520, 'duration': DUR, 'ease': 'none'}, 0); P.to('#beam2', {'x': -520, 'duration': DUR, 'ease': 'none'}, 0)
P.add('<div id="cam" style="position:absolute;inset:0">')
P.to('#cam', {'scale': 1.035, 'duration': DUR, 'ease': 'none', 'transformOrigin': '50% 45%'}, 0)

# ------------------------------------------------------------------ characters (illustrated, no real people)
CAST = {
    'Ava': dict(skin='#f2c9a0', hair='#3b2417', style='long', shirt='#ffb347', bg='#7a3b00'),
    'Mia': dict(skin='#e8b894', hair='#8a4a22', style='bun', shirt='#2fe6d0', bg='#0b5a55'),
    'Leo': dict(skin='#c98e62', hair='#1d1d1d', style='short', shirt='#ff4f6d', bg='#7a1a2e'),
    'Sam': dict(skin='#f6d3b3', hair='#d6b04a', style='short', shirt='#7bd88f', bg='#1d5a33'),
    'Zoe': dict(skin='#8a5a3c', hair='#1a1210', style='curly', shirt='#ff9a5c', bg='#7a3a10'),
    'Max': dict(skin='#d9a77c', hair='#4a2d1c', style='short', shirt='#5ec7ff', bg='#1b4d6e'),
    'You': dict(skin='#e9bd96', hair='#2b2b2b', style='short', shirt='#ff4f6d', bg='#5a1a2a'),
}

def face_svg(nid, c, mood='smile'):
    s, h, st, sh = c['skin'], c['hair'], c['style'], c['shirt']
    back = f'<path d="M24 40C22 72 30 80 34 82L66 82C70 80 78 72 76 40Z" fill="{h}"/>' if st == 'long' else ''
    top = {'short': f'<path d="M28 42C25 16 75 16 72 42C69 31 61 26 50 26C39 26 31 31 28 42Z" fill="{h}"/>',
           'long': f'<path d="M28 42C25 16 75 16 72 42C69 31 61 26 50 26C39 26 31 31 28 42Z" fill="{h}"/>',
           'bun': f'<path d="M28 42C25 16 75 16 72 42C69 31 61 26 50 26C39 26 31 31 28 42Z" fill="{h}"/><circle cx="50" cy="15" r="10" fill="{h}"/>',
           'curly': ''.join(f'<circle cx="{x}" cy="{y}" r="11" fill="{h}"/>' for x, y in [(33, 33), (44, 24), (56, 24), (67, 33), (29, 44), (71, 44)])}[st]
    return (f'<svg viewBox="0 0 100 100" width="100%" height="100%">{back}<path d="M6 100C6 74 28 66 50 66C72 66 94 74 94 100Z" fill="{sh}"/>'
            f'<rect x="43" y="56" width="14" height="14" rx="5" fill="{s}"/><ellipse cx="50" cy="43" rx="21" ry="24" fill="{s}"/>{top}'
            f'<circle cx="42" cy="45" r="3" fill="#201018"/><circle cx="58" cy="45" r="3" fill="#201018"/>'
            f'<path d="M37 39q5-4 9-1M63 39q-5-4-9-1" stroke="#201018" stroke-width="2" fill="none" stroke-linecap="round"/>'
            f'<path id="{nid}_ms" d="M43 54Q50 61 57 54" stroke="#201018" stroke-width="3" fill="none" stroke-linecap="round" opacity="{1 if mood=="smile" else 0}"/>'
            f'<path id="{nid}_md" d="M43 58Q50 52 57 58" stroke="#201018" stroke-width="3" fill="none" stroke-linecap="round" opacity="{1 if mood=="sad" else 0}"/>'
            f'<ellipse id="{nid}_mo" cx="50" cy="56" rx="5" ry="6.5" fill="#201018" opacity="0"/></svg>')

def face(nid, who, x, y, r, t, t_out=None, ring=CREAM, z=4, mood='smile', dur=.34):
    c = CAST[who]
    P.add(f'<div id="{nid}" class="nd" style="left:{x-r}px;top:{y-r}px;width:{2*r}px;height:{2*r}px;background:{c["bg"]};border:4px solid {ring};overflow:hidden;z-index:{z}">{face_svg(nid, c, mood)}</div>')
    P.frm('#' + nid, {'opacity': 0, 'scale': .2}, {'opacity': 1, 'scale': 1, 'duration': dur, 'ease': 'back.out(2.4)'}, t)
    if t_out is not None: P.to('#' + nid, {'opacity': 0, 'scale': .6, 'duration': .2}, t_out)

def mood(nid, m, t):
    for k, kk in (('s', 'smile'), ('d', 'sad'), ('o', 'open')):
        P.st(f'#{nid}_m{k}', {'opacity': 1 if kk == m else 0}, t)

def ring(nid, col, t, glow=True):
    P.st('#' + nid, {'borderColor': col, 'boxShadow': f'0 0 36px {col}' if glow else '0 8px 26px rgba(0,0,0,.55)'}, t)

def name_tag(tid, text, x, y, t, t_out=None, col=CREAM, fs=24):
    P.add(f'<div id="{tid}" class="tag2" style="left:{x-70}px;top:{y}px;width:140px;text-align:center;padding:3px 0;font-size:{fs}px;z-index:7;color:{col}">{text}</div>')
    P.frm('#' + tid, {'opacity': 0, 'y': 8}, {'opacity': 1, 'y': 0, 'duration': .25}, t)
    if t_out is not None: P.to('#' + tid, {'opacity': 0, 'duration': .15}, t_out)

def bubble(bid, text, x, y, t, t_out, tail='l', col=CREAM, fg=INK, fs=34):
    tail_css = 'left:30px' if tail == 'l' else 'right:30px'
    P.add(f'<div id="{bid}" class="abs" style="left:{x}px;top:{y}px;opacity:0;z-index:12;transform-origin:{"12% 100%" if tail == "l" else "88% 100%"}"><div style="background:{col};color:{fg};font-family:Anton;font-size:{fs}px;padding:7px 22px;border-radius:26px;white-space:nowrap;box-shadow:0 8px 22px rgba(0,0,0,.5)">{text}</div>'
          f'<div style="position:absolute;{tail_css};bottom:-15px;width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-top:18px solid {col}"></div></div>')
    P.frm('#' + bid, {'opacity': 0, 'scale': .3, 'y': 10}, {'opacity': 1, 'scale': 1, 'y': 0, 'duration': .28, 'ease': 'back.out(2.6)'}, t)
    P.to('#' + bid, {'opacity': 0, 'scale': .85, 'duration': .15}, t_out)

def crown(cid, x, y, t, t_out=None):
    P.add(f'<svg id="{cid}" class="abs" width="70" height="46" viewBox="0 0 70 46" style="left:{x-35}px;top:{y}px;opacity:0;z-index:9"><path d="M5 40L10 10L24 24L35 4L46 24L60 10L65 40Z" fill="#ffd23f" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/></svg>')
    P.frm('#' + cid, {'opacity': 0, 'y': -30, 'scale': .3}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .35, 'ease': 'back.out(2.4)'}, t)
    if t_out is not None: P.to('#' + cid, {'opacity': 0, 'duration': .15}, t_out)

def dim(ids, op, t, d=.2):
    P.to(','.join('#' + i for i in ids), {'opacity': op, 'duration': d}, t)

# ============================ HOOK 0 - 5.7: YOU (3 friends) vs friends with 9 each ==========================
def hook_graph(prefix, t0, speed=1.0, t_out=None):
    cx, cy = 540, 690
    fr = [(324, 565, 'Ava'), (756, 565, 'Mia'), (540, 940, 'Leo')]
    lines = []; sats = []
    for k, (fx, fy, who) in enumerate(fr):
        lines.append((f'{prefix}e{k}', cx, cy, fx, fy, CREAM, 6))
        base = math.atan2(fy - cy, fx - cx)
        for j in range(8):
            ang = base + (j - 3.5) * 0.46; sx, sy = fx + 118 * math.cos(ang), fy + 118 * math.sin(ang)
            sats.append((k, j, sx, sy)); lines.append((f'{prefix}s{k}_{j}', fx, fy, sx, sy, 'rgba(255,243,230,.6)', 3))
    L = edges_svg(lines)
    face(f'{prefix}you', 'You', cx, cy, 64, t0 + .1 / speed, ring=CORAL)
    for k, (fx, fy, who) in enumerate(fr):
        face(f'{prefix}f{k}', who, fx, fy, 46, t0 + (.22 + .1 * k) / speed, ring=GOLD)
        draw(f'{prefix}e{k}', L[f'{prefix}e{k}'], t0 + (.22 + .1 * k) / speed, .3)
    for k, j, sx, sy in sats:
        tt = t0 + (.8 + .035 * (k * 8 + j)) / speed
        node(f'{prefix}t{k}_{j}', sx, sy, 17, 'rgba(255,243,230,.92)', tt, glyph=False, dur=.22, z=3)
        draw(f'{prefix}s{k}_{j}', L[f'{prefix}s{k}_{j}'], tt, .2)
    for k, (fx, fy, who) in enumerate(fr):
        bx, by = (fx + 42, fy - 42) if k < 2 else (fx + 50, fy - 30)
        badge(f'{prefix}bf{k}', '9', bx, by, 26, CREAM, t0 + (1.3 + .1 * k) / speed, fs=34)
    badge(f'{prefix}by', '3', cx + 56, cy - 56, 30, CORAL, t0 + 1.84 / speed, fs=38, color='#fff')
    P.add(f'<div class="tag2" id="{prefix}ytag" style="left:{cx-215}px;top:{cy-22}px;font-size:28px;background:{CORAL};color:#fff;z-index:6">YOU</div>')
    P.frm(f'#{prefix}ytag', {'opacity': 0, 'x': -30}, {'opacity': 1, 'x': 0, 'duration': .25}, t0 + .25 / speed)
    P.to(f'#{prefix}you', {'scale': 1.12, 'duration': .14, 'yoyo': True, 'repeat': 1}, t0 + 1.86 / speed)
    return cx, cy

c = scene('h0', 0, 5.7)
top_label('hl', 'THE FRIENDSHIP PARADOX', 0.15, 5.6, top=120, size=46)
hook_graph('h', 0.0)
mood('hyou', 'sad', 1.9)
bubble('hb1', 'Only 3 friends?!', 40, 805, 2.0, 3.3, tail='l')
slam('hm', 'MATH PROVES IT', 2.76, 4.2, 1100, 104, color=CORAL, rot=-2)
P.add(f'<div class="tag2" id="fe" style="left:300px;top:1235px;z-index:8;font-size:28px;background:{AMBER};color:{INK}">Scott Feld · 1991</div>')
P.frm('#fe', {'opacity': 0, 'y': 20}, {'opacity': 1, 'y': 0, 'duration': .25}, 3.3); P.to('#fe', {'opacity': 0, 'duration': .15}, 4.15)
P.add(f'<div id="tz" class="abs" style="left:100px;top:1085px;width:880px;height:190px;border-radius:26px;background:rgba(18,7,18,.88);border:4px solid {AMBER};opacity:0;z-index:8">'
      f'<svg class="abs" width="90" height="110" viewBox="0 0 90 110" style="left:36px;top:40px"><rect x="10" y="48" width="70" height="52" rx="10" fill="{AMBER}"/><path d="M24 48V34a21 21 0 0 1 42 0v14" fill="none" stroke="{AMBER}" stroke-width="9" stroke-linecap="round"/><circle cx="45" cy="72" r="7" fill="{INK}"/></svg>'
      f'<div class="abs" style="left:150px;top:26px;font-family:Anton;font-size:74px;color:{CREAM}">THE FLU TWIST</div>'
      f'<div class="abs" style="left:152px;top:116px;font-family:Oswald;font-weight:700;letter-spacing:.2em;font-size:30px;color:{AMBER}">UNLOCKS AT 0:39</div></div>')
P.frm('#tz', {'opacity': 0, 'y': 70, 'scale': .9}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .4, 'ease': 'back.out(1.8)'}, 4.2)
P.to('#tz', {'scale': 1.03, 'duration': .3, 'yoyo': True, 'repeat': 3, 'ease': 'sine.inOut'}, 4.7); P.to('#tz', {'opacity': 0, 'duration': .15}, 5.55)
punch(0.12, 1.04); punch(2.78, 1.05); flash(2.76, .35)
c()

# ============================ PARTY OF SIX 5.65 - 22.9 ======================================================
HUB = (540, 710)
POS = {'Mia': (300, 500), 'Leo': (780, 500), 'Sam': (270, 860), 'Zoe': (540, 990), 'Max': (810, 860)}
c = scene('p0', 5.65, 22.95)
top_label('pl', 'A PARTY OF SIX', 5.9, 13.4, top=120, size=52)
vpanel('pp', 'party3', 5.8, 7.6, 330, h=600, tag='archival film · illustrative')
slam('p6', '6 PEOPLE', 6.5, 7.55, 1080, 150, color=CREAM, rot=-2)
flash(5.72, .3)
lines = [(f'pe{k}', HUB[0], HUB[1], x, y, GOLD, 7) for k, (x, y) in POS.items()] + [('peAB', 300, 500, 780, 500, CREAM, 5)]
L = edges_svg(lines)
face('pAva', 'Ava', HUB[0], HUB[1], 72, 7.66, ring=CREAM, t_out=22.8)
crown('pcr', HUB[0], HUB[1] - 112, 8.0, t_out=22.8)
name_tag('pnA', 'AVA', HUB[0], HUB[1] + 62, 8.0, t_out=22.8, col=GOLD)
bubble('hiA', 'Hi, everyone!', 650, 600, 8.35, 9.5, tail='l', col=GOLD)
for i, (k, (x, y)) in enumerate(POS.items()):
    t = 8.28 + .11 * i
    draw(f'pe{k}', L[f'pe{k}'], t, .3, t_out=22.8)
    face(f'p{k}', k, x, y, 56, t + .08, t_out=22.8)
    name_tag(f'pn{k}', k.upper(), x, y + 46, t + .25, t_out=22.8)
draw('peAB', L['peAB'], 10.4, .4, t_out=22.8)
for nm, (x, y), val, tt, rr in [('A', HUB, 5, 8.95, 28), ('Mia', POS['Mia'], 2, 10.06, 25), ('Leo', POS['Leo'], 2, 10.2, 25), ('Sam', POS['Sam'], 1, 10.4, 25), ('Zoe', POS['Zoe'], 1, 10.6, 25), ('Max', POS['Max'], 1, 10.8, 25)]:
    badge(f'pb{nm}', str(val), x + (66 if nm == 'A' else 50), y - (66 if nm == 'A' else 50), rr, CORAL if nm != 'A' else AMBER, tt, t_out=22.8, fs=36, color='#fff' if nm != 'A' else INK)
txt('p12', '1–2 FRIENDS EACH', 9.7, 12.5, 1090, 92, color=CORAL)
# count it: scan ring (12.84)
P.add(f'<div id="scan" class="abs" style="left:0;top:0;width:130px;height:130px;border-radius:50%;border:6px solid {GREEN};box-shadow:0 0 30px {GREEN};opacity:0;z-index:9"></div>')
seq = [('Mia', 300, 500), ('Leo', 780, 500), ('Sam', 270, 860), ('Zoe', 540, 990), ('Max', 810, 860)]
P.st('#scan', {'opacity': 1, 'x': seq[0][1] - 65, 'y': seq[0][2] - 65}, 12.84)
for i, (nm, x, y) in enumerate(seq[1:], 1): P.to('#scan', {'x': x - 65, 'y': y - 65, 'duration': .12, 'ease': 'power2.inOut'}, 12.84 + .12 * i)
P.to('#scan', {'opacity': 0, 'duration': .1}, 13.45)
flash(12.84, .3); shake(12.86, 9)
# ---- the demo (13.46 - 17.06): check Sam, then Zoe & Max, then Mia & Leo
def bars(pre, la, va, lb, vb, t, t_out):
    unit = 120
    for i, (lab, val, col, y) in enumerate([(la, va, CREAM, 1080), (lb, vb, GOLD, 1190)]):
        P.add(f'<div id="{pre}l{i}" class="abs" style="left:50px;top:{y+10}px;width:230px;text-align:right;font-family:Oswald;font-weight:700;letter-spacing:.08em;font-size:27px;color:{col};opacity:0;z-index:8;line-height:1.05">{lab}</div>')
        P.add(f'<div id="{pre}b{i}" class="abs" style="left:300px;top:{y}px;width:{int(val*unit)}px;height:78px;border-radius:16px;background:{col};opacity:0;z-index:8;transform-origin:0 50%;box-shadow:0 6px 18px rgba(0,0,0,.5)"><div style="position:absolute;right:16px;top:4px;font-family:Anton;font-size:60px;color:{INK}">{val:g}</div></div>')
        P.frm(f'#{pre}l{i}', {'opacity': 0, 'x': -20}, {'opacity': 1, 'x': 0, 'duration': .25}, t + .12 * i)
        P.frm(f'#{pre}b{i}', {'opacity': 0, 'scaleX': 0}, {'opacity': 1, 'scaleX': 1, 'duration': .45, 'ease': 'power3.out'}, t + .12 * i)
        P.to(f'#{pre}l{i},#{pre}b{i}', {'opacity': 0, 'duration': .15}, t_out)
ALLN = ['pAva', 'pMia', 'pLeo', 'pSam', 'pZoe', 'pMax']
EDG = ['peMia', 'peLeo', 'peSam', 'peZoe', 'peMax', 'peAB']
dim(ALLN + EDG + ['pbA', 'pbMia', 'pbLeo', 'pbSam', 'pbZoe', 'pbMax', 'pnMia', 'pnLeo', 'pnSam', 'pnZoe', 'pnMax', 'pnA'], .22, 13.46)
dim(['pAva', 'pSam', 'peSam', 'pnA', 'pnSam', 'pbA', 'pbSam'], 1, 13.5)
mood('pSam', 'sad', 13.6); ring('pSam', CORAL, 13.5)
bubble('pbS1', 'I have 1 friend…', 70, 740, 13.6, 15.0, tail='l', col=CREAM)
bubble('pbS2', '…and Ava has 5!', 650, 600, 14.0, 15.0, tail='l', col=GOLD)
bars('d1', 'SAM', 1, 'SAM’S<br>FRIEND', 5, 13.7, 15.05)
chip('d1c', '1 &lt; 5', 780, 1000, 14.5, t_out=15.05)
# Zoe & Max
dim(['pZoe', 'pMax', 'peZoe', 'peMax', 'pnZoe', 'pnMax', 'pbZoe', 'pbMax'], 1, 15.0); dim(['pSam', 'peSam', 'pnSam', 'pbSam'], .22, 15.0)
mood('pZoe', 'sad', 15.1); mood('pMax', 'sad', 15.1); ring('pZoe', CORAL, 15.0); ring('pMax', CORAL, 15.0); ring('pSam', CORAL, 15.0, glow=False)
bubble('pbZ', 'Same here.', 330, 880, 15.1, 16.0, tail='l', col=CREAM)
bubble('pbM', 'Me too!', 700, 760, 15.25, 16.0, tail='r', col=CREAM)
txt('d2', 'ZOE 1 &lt; 5  ·  MAX 1 &lt; 5', 15.05, 16.0, 1110, 66, color=CORAL, extra='z-index:8')
# Mia & Leo
dim(['pMia', 'pLeo', 'pePeAB' if False else 'peAB', 'peMia', 'peLeo', 'pnMia', 'pnLeo', 'pbMia', 'pbLeo'], 1, 16.0); dim(['pZoe', 'pMax', 'peZoe', 'peMax', 'pnZoe', 'pnMax', 'pbZoe', 'pbMax'], .22, 16.0)
mood('pMia', 'sad', 16.1); mood('pLeo', 'sad', 16.1); ring('pMia', CORAL, 16.0); ring('pLeo', CORAL, 16.0); ring('pZoe', CORAL, 16.0, glow=False); ring('pMax', CORAL, 16.0, glow=False)
bubble('pbMi', '2 friends…', 120, 395, 16.1, 17.05, tail='l', col=CREAM)
bubble('pbLe', 'same!', 700, 395, 16.25, 17.05, tail='r', col=CREAM)
bars('d3', 'MIA', 2, 'HER<br>FRIENDS', 3.5, 16.05, 17.1)
chip('d3c', '2 &lt; 3.5', 780, 1000, 16.6, t_out=17.1)
dim(ALLN + EDG + ['pbA', 'pbMia', 'pbLeo', 'pbSam', 'pbZoe', 'pbMax', 'pnMia', 'pnLeo', 'pnSam', 'pnZoe', 'pnMax', 'pnA'], 1, 17.06)
ring('pSam', CORAL, 17.06, glow=False); ring('pMia', CORAL, 17.06, glow=False); ring('pLeo', CORAL, 17.06, glow=False)
# the verdict (narration 17.28 - 22.4)
for nm in ('Mia', 'Leo', 'Sam', 'Zoe', 'Max'): mood('p' + nm, 'sad', 17.06)
P.add(f'<div class="lab2" id="cmpl" style="top:1335px;font-size:28px;color:{AMBER};opacity:0;z-index:8">fewer friends than their friends do</div>')
P.frm('#cmpl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 17.3); P.to('#cmpl', {'opacity': 0, 'duration': .15}, 20.4)
slam('p56', '5 OF 6', 17.82, 20.4, 1100, 220, color=CORAL, rot=-2)
for i, nm in enumerate(('Mia', 'Leo', 'Sam', 'Zoe', 'Max')): ring('p' + nm, CORAL, 17.4 + .3 * i)
ring('pAva', GREEN, 20.48); mood('pAva', 'smile', 20.48)
txt('pex', 'EXCEPT AVA, THE POPULAR ONE', 20.48, 22.95, 1100, 74, color=GOLD, extra='z-index:8')
flash(17.82, .3); punch(17.84, 1.05); punch(20.5, 1.04)
c()

# ============================ WHY: friend lists -> bar chart -> pick-a-friend wheel (22.85 - 38.7) ============
c = scene('w0', 22.85, 38.7)
top_label('wl', "HERE'S WHY", 23.6, 25.0, top=120, size=64, color=CORAL)
rows = [('Mia', ['Ava', 'Leo']), ('Leo', ['Ava', 'Mia']), ('Sam', ['Ava']), ('Zoe', ['Ava']), ('Max', ['Ava'])]
RY = lambda i: 345 + i * 118
top_label('wl2', "EVERYONE'S FRIEND LIST", 25.0, 27.6, top=120, size=50, color=AMBER)
for i, (who, fl) in enumerate(rows):
    P.add(f'<div id="rw{i}" class="abs" style="left:90px;top:{RY(i)}px;width:900px;height:100px;border-radius:20px;background:rgba(255,243,230,.1);border:3px solid rgba(255,243,230,.35);opacity:0;z-index:4"></div>')
    P.frm(f'#rw{i}', {'opacity': 0, 'x': -60}, {'opacity': 1, 'x': 0, 'duration': .3, 'ease': 'power3.out'}, 24.7 + .1 * i); P.to(f'#rw{i}', {'opacity': 0, 'duration': .2}, 27.55)
    face(f'rn{i}', who, 150, RY(i) + 50, 36, 24.8 + .1 * i, t_out=27.55)
    P.add(f'<div class="abs" id="rt{i}" style="left:204px;top:{RY(i)+30}px;font-family:Oswald;font-weight:700;font-size:32px;letter-spacing:.1em;color:{CREAM};opacity:0;z-index:5">{who.upper()}’S LIST</div>')
    P.frm(f'#rt{i}', {'opacity': 0}, {'opacity': 1, 'duration': .2}, 24.85 + .1 * i); P.to(f'#rt{i}', {'opacity': 0, 'duration': .2}, 27.55)
    for j, ff in enumerate(fl):
        face(f'rc{i}_{j}', ff, 600 + j * 120, RY(i) + 50, 38, 25.3 + .12 * i + .06 * j, ring=GOLD if ff == 'Ava' else CREAM, t_out=27.55)
        if ff == 'Ava': P.to(f'#rc{i}_{j}', {'boxShadow': f'0 0 44px {AMBER}', 'scale': 1.15, 'duration': .18, 'yoyo': True, 'repeat': 1}, 25.7 + .22 * i)
P.add(f'<div class="stat" id="hcount" style="top:1060px;font-size:96px;color:{GOLD};opacity:0;z-index:8">AVA IS ON <span id="hn">0</span> OF 5 LISTS</div>')
P.frm('#hcount', {'opacity': 0, 'scale': .7}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 25.9)
P.counter('#hn', 0, 5, 26.0, 1.1, 'function(v){return Math.round(v)}', 'power1.inOut'); P.to('#hcount', {'opacity': 0, 'duration': .15}, 27.55)
# bar chart (27.65 - 30.25)
top_label('bc', 'HOW OFTEN EACH PERSON SHOWS UP', 27.6, 30.3, top=115, size=40, color=AMBER)
APP = [('Ava', 5, GOLD), ('Mia', 2, CREAM), ('Leo', 2, CREAM), ('Sam', 1, CREAM), ('Zoe', 1, CREAM), ('Max', 1, CREAM)]
for i, (who, n, col) in enumerate(APP):
    y = 330 + i * 112; t0 = 27.7 + .16 * i
    face(f'bf{i}', who, 130, y + 44, 40, t0, t_out=30.25, ring=GOLD if who == 'Ava' else CREAM)
    P.add(f'<div id="brb{i}" class="abs" style="left:190px;top:{y}px;width:{n*140}px;height:88px;border-radius:18px;background:{col};opacity:0;z-index:5;transform-origin:0 50%;box-shadow:0 8px 20px rgba(0,0,0,.5)"><div style="position:absolute;right:18px;top:6px;font-family:Anton;font-size:64px;color:{INK}"><span id="bn{i}">0</span></div></div>')
    P.frm(f'#brb{i}', {'opacity': 0, 'scaleX': 0}, {'opacity': 1, 'scaleX': 1, 'duration': .5 + .08 * n, 'ease': 'power3.out'}, t0 + .1); P.to(f'#brb{i}', {'opacity': 0, 'duration': .2}, 30.25)
    P.counter(f'#bn{i}', 0, n, t0 + .15, .5 + .08 * n, 'function(v){return Math.round(v)}', 'power1.out')
txt('bct', 'AVA: 5 LISTS · OTHERS: 1–2', 28.5, 30.3, 1070, 74, color=GOLD, extra='z-index:8')
# pick-a-friend wheel (30.4 - 33.0): 12 friend-list slots, 5 are Ava
top_label('wh', 'PICK A RANDOM FRIEND', 30.35, 33.1, top=115, size=54, color=CORAL)
SLOT = ['Ava', 'Mia', 'Ava', 'Leo', 'Ava', 'Sam', 'Zoe', 'Ava', 'Max', 'Ava', 'Mia', 'Leo']
SX = lambda k: 150 + (k % 6) * 156; SY = lambda k: 530 + (k // 6) * 220
for k, who in enumerate(SLOT):
    face(f'sl{k}', who, SX(k), SY(k), 58, 30.45 + .03 * k, ring=GOLD if who == 'Ava' else CREAM, t_out=33.0, z=4)
    if who == 'Ava': P.to(f'#sl{k}', {'boxShadow': f'0 0 34px {AMBER}', 'duration': .2}, 30.7)
P.add(f'<div id="spot" class="abs" style="left:0;top:0;width:144px;height:144px;border-radius:50%;border:7px solid {GREEN};box-shadow:0 0 34px {GREEN};opacity:0;z-index:9"></div>')
HOPS = [1, 4, 5, 2, 8, 7, 10, 9, 0]   # lands on Ava (2, 0, 7, 9) often - Ava is 5 of the 12 slots
P.st('#spot', {'opacity': 1, 'x': SX(HOPS[0]) - 72, 'y': SY(HOPS[0]) - 72}, 31.0)
for i, k in enumerate(HOPS[1:], 1): P.to('#spot', {'x': SX(k) - 72, 'y': SY(k) - 72, 'duration': .13, 'ease': 'power2.inOut'}, 31.0 + .26 * i)
P.to('#spot', {'scale': 1.3, 'duration': .18, 'yoyo': True, 'repeat': 1}, 33.0 - .5); P.to('#spot', {'opacity': 0, 'duration': .15}, 33.05)
txt('w12', '5 OF 12 SLOTS = AVA', 31.7, 33.1, 1050, 80, color=GOLD, extra='z-index:8')
txt('w42', '≈ 42% OF THE TIME', 32.2, 33.1, 1160, 66, color=CREAM, extra='z-index:8')
flash(30.35, .3)
# the named paradox card (33.2 - 35.4)
P.add(f'<div id="pd" class="abs" style="left:80px;top:420px;width:920px;height:520px;border-radius:30px;background:rgba(10,18,26,.92);border:5px solid {CORAL};opacity:0;z-index:6;text-align:center">'
      f'<div style="margin-top:44px;font-family:Oswald;font-weight:700;letter-spacing:.2em;font-size:34px;color:{AMBER}">ON AVERAGE</div>'
      f'<div style="margin-top:26px;font-family:Anton;font-size:118px;line-height:1.02;color:{CREAM}">YOUR FRIENDS<br><span style="color:{CORAL}">HAVE MORE</span><br>FRIENDS</div></div>')
P.frm('#pd', {'opacity': 0, 'scale': .8, 'rotation': -3}, {'opacity': 1, 'scale': 1, 'rotation': 0, 'duration': .4, 'ease': 'back.out(1.8)'}, 33.2); P.to('#pd', {'opacity': 0, 'duration': .2}, 35.4)
top_label('wp', 'THE FRIENDSHIP PARADOX', 33.2, 35.45, top=130, size=52, color=CORAL)
flash(33.18, .35); punch(33.2, 1.05)
# real networks over a photo (35.42 - 38.0)
P.add(f'<div id="ph" class="abs" style="left:60px;top:330px;width:960px;height:560px;border-radius:24px;overflow:hidden;opacity:0;z-index:5;box-shadow:0 0 0 4px rgba(255,243,230,.92),0 28px 70px rgba(0,0,0,.75)"><img id="phi" src="assets/img/friends2.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:contrast(1.05) saturate(1.1)"/>'
      f'<div class="tag2" style="left:18px;bottom:16px;font-size:22px;opacity:1">photo · illustrative</div></div>')
P.frm('#ph', {'opacity': 0, 'y': 70, 'scale': .92}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .38, 'ease': 'power3.out'}, 35.4)
P.frm('#phi', {'scale': 1.0}, {'scale': 1.15, 'duration': 3.2, 'ease': 'none'}, 35.4); P.to('#ph', {'opacity': 0, 'duration': .2}, 38.55)
net = [(200, 430), (360, 560), (520, 470), (700, 600), (850, 470), (280, 760), (470, 800), (640, 780), (820, 790), (150, 600), (930, 640), (560, 620)]
ned = [(0, 1), (1, 2), (2, 3), (3, 4), (1, 5), (5, 6), (6, 7), (7, 8), (2, 11), (11, 6), (3, 7), (0, 9), (4, 10), (9, 5), (11, 7)]
lines = [(f'ne{i}', net[a][0], net[a][1], net[b][0], net[b][1], 'rgba(255,243,230,.9)', 4) for i, (a, b) in enumerate(ned)]
L = edges_svg(lines, z=7)
for i, (a, b) in enumerate(ned): draw(f'ne{i}', L[f'ne{i}'], 35.5 + .08 * i, .3, t_out=38.5)
for i, (x, y) in enumerate(net): node(f'nn{i}', x, y, 15 + (10 if i in (2, 6, 11) else 0), GOLD if i in (2, 6, 11) else CREAM, 35.5 + .05 * i, glyph=False, dur=.2, t_out=38.5, z=8)
txt('rnet', 'REAL NETWORKS', 35.5, 38.6, 960, 120, color=CORAL)
P.add(f'<div class="lab2" id="fb" style="top:1110px;font-size:50px;color:{CREAM};opacity:0;z-index:8">like Facebook · Twitter studies</div>')
P.frm('#fb', {'opacity': 0, 'y': 24}, {'opacity': 1, 'y': 0, 'duration': .3}, 37.3); P.to('#fb', {'opacity': 0, 'duration': .15}, 38.55)
c()

# ============================ TWIST: Harvard flu chart (39.0 - 46.4) then the infection network (46.4 - 51.2) ====
c = scene('f0', 38.9, 51.3)
slam('ft', 'THE FLU TWIST', 39.0, 41.4, 115, 112, color=GOLD, rot=-2)
flash(39.0, .5); punch(39.02, 1.06)
P.add(f'<div class="tag2" id="hv" style="left:150px;top:268px;z-index:8;font-size:26px">Harvard study · 744 students · 2010</div>')
P.frm('#hv', {'opacity': 0, 'y': 14}, {'opacity': 1, 'y': 0, 'duration': .3}, 40.5); P.to('#hv', {'opacity': 0, 'duration': .15}, 46.3)
X0, X1, BASE = 110, 970, 960
P.add(f'<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;z-index:3"><line id="ax1" x1="{X0}" y1="{BASE}" x2="{X1}" y2="{BASE}" stroke="{CREAM}" stroke-width="6" stroke-linecap="round" stroke-dasharray="880" stroke-dashoffset="880"/><line id="ax2" x1="{X0}" y1="{BASE}" x2="{X0}" y2="420" stroke="{CREAM}" stroke-width="6" stroke-linecap="round" stroke-dasharray="560" stroke-dashoffset="560"/></svg>')
P.frm('#ax1', {'strokeDashoffset': 880}, {'strokeDashoffset': 0, 'duration': .5, 'ease': 'power2.out'}, 39.6); P.frm('#ax2', {'strokeDashoffset': 560}, {'strokeDashoffset': 0, 'duration': .5, 'ease': 'power2.out'}, 39.7)
P.to('#ax1,#ax2', {'opacity': 0, 'duration': .2}, 46.3)
def curve(mu, sig, hgt, n=64):
    pts = [(X0 + 20 + i * (X1 - X0 - 40) / n, BASE - hgt * math.exp(-((X0 + 20 + i * (X1 - X0 - 40) / n - mu) ** 2) / (2 * sig * sig))) for i in range(n + 1)]
    d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)
    return d, sum(math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) for i in range(n)) + 4, pts
FM, RM = 480, 730
df, Lf, pf = curve(FM, 95, 430); dr, Lr, pr = curve(RM, 95, 430)
areaf = df + f' L{pf[-1][0]:.1f} {BASE} L{pf[0][0]:.1f} {BASE} Z'; arear = dr + f' L{pr[-1][0]:.1f} {BASE} L{pr[0][0]:.1f} {BASE} Z'
P.add(f'<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;z-index:4"><path id="arf" d="{areaf}" fill="{AMBER}" opacity="0"/><path id="arr" d="{arear}" fill="{CORAL}" opacity="0"/>'
      f'<path id="cf" d="{df}" fill="none" stroke="{AMBER}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="{Lf:.0f}" stroke-dashoffset="{Lf:.0f}"/>'
      f'<path id="cr" d="{dr}" fill="none" stroke="{CORAL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="{Lr:.0f}" stroke-dashoffset="{Lr:.0f}"/>'
      f'<line id="pk1" x1="{FM}" y1="{BASE}" x2="{FM}" y2="{BASE-430}" stroke="{AMBER}" stroke-width="4" stroke-dasharray="10 12" opacity="0"/><line id="pk2" x1="{RM}" y1="{BASE}" x2="{RM}" y2="{BASE-430}" stroke="{CORAL}" stroke-width="4" stroke-dasharray="10 12" opacity="0"/></svg>')
P.frm('#cf', {'strokeDashoffset': Lf}, {'strokeDashoffset': 0, 'duration': 1.5, 'ease': 'power1.inOut'}, 41.7)
P.frm('#cr', {'strokeDashoffset': Lr}, {'strokeDashoffset': 0, 'duration': 1.9, 'ease': 'power1.inOut'}, 43.2)
P.to('#arf', {'opacity': .22, 'duration': .5}, 43.2); P.to('#arr', {'opacity': .22, 'duration': .5}, 45.0)
P.to('#pk1', {'opacity': .9, 'duration': .2}, 43.3); P.to('#pk2', {'opacity': .9, 'duration': .2}, 45.0)
P.to('#cf,#cr,#arf,#arr,#pk1,#pk2', {'opacity': 0, 'duration': .2}, 46.3)
P.add(f'<div class="tag2" id="lf" style="left:{FM-340}px;top:470px;z-index:8;background:{AMBER};color:{INK};font-size:24px">THEIR FRIENDS</div><div class="tag2" id="lr" style="left:{RM-105}px;top:405px;z-index:8;background:{CORAL};color:#fff;font-size:24px">RANDOM STUDENTS</div>')
P.frm('#lf', {'opacity': 0, 'x': -20}, {'opacity': 1, 'x': 0, 'duration': .25}, 41.9); P.frm('#lr', {'opacity': 0, 'x': 20}, {'opacity': 1, 'x': 0, 'duration': .25}, 44.4)
P.add(f'<div class="tag2" id="yl" style="left:125px;top:395px;z-index:8;font-size:22px;background:transparent;color:{CREAM}">FLU CASES ↑</div><div class="tag2" id="xl" style="left:820px;top:975px;z-index:8;font-size:22px;background:transparent;color:{CREAM}">TIME →</div>')
P.frm('#yl,#xl', {'opacity': 0}, {'opacity': .9, 'duration': .3}, 40.0); P.to('#yl,#xl,#lf,#lr', {'opacity': 0, 'duration': .2}, 46.3)
P.add(f'<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;z-index:6"><line id="gap" x1="{FM}" y1="{BASE-470}" x2="{RM}" y2="{BASE-470}" stroke="{GREEN}" stroke-width="10" stroke-linecap="round" stroke-dasharray="{RM-FM}" stroke-dashoffset="{RM-FM}"/>'
      f'<path id="gh" d="M{RM-26} {BASE-494} L{RM} {BASE-470} L{RM-26} {BASE-446}" fill="none" stroke="{GREEN}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></svg>')
P.frm('#gap', {'strokeDashoffset': RM - FM}, {'strokeDashoffset': 0, 'duration': .45, 'ease': 'power2.out'}, 43.9); P.to('#gh', {'opacity': 1, 'duration': .1}, 44.3)
P.to('#gap,#gh', {'opacity': 0, 'duration': .2}, 46.3)
txt('wk2', 'ABOUT 2 WEEKS EARLIER', 43.9, 46.35, 1090, 92, color=GREEN, extra='z-index:8')
# infection network: central people get it first (46.4 - 48.2)
MINI = {'Ava': (540, 650), 'Mia': (390, 530), 'Leo': (690, 530), 'Sam': (360, 800), 'Zoe': (540, 880), 'Max': (720, 800)}
mlines = [(f'ie{k}', 540, 650, x, y, GOLD, 6) for k, (x, y) in MINI.items() if k != 'Ava'] + [('ieAB', 390, 530, 690, 530, CREAM, 4)]
L = edges_svg(mlines, z=3)
for i, (k, (x, y)) in enumerate(MINI.items()):
    face(f'i{k}', k, x, y, 62 if k == 'Ava' else 46, 46.4 + .06 * i, t_out=51.2, ring=GOLD if k == 'Ava' else CREAM)
    if k != 'Ava': draw(f'ie{k}', L[f'ie{k}'], 46.4 + .06 * i, .25, t_out=51.2)
draw('ieAB', L['ieAB'], 46.7, .25, t_out=51.2)
top_label('il', 'A FLU SPREADS THROUGH THE PARTY', 46.4, 48.45, top=125, size=38, color=AMBER)
for who, tt in (('Ava', 46.75), ('Mia', 47.25), ('Leo', 47.25), ('Sam', 47.8), ('Zoe', 47.8), ('Max', 47.8)):
    x, y = MINI[who]; r = 62 if who == 'Ava' else 46
    P.add(f'<div id="sk{who}" class="abs" style="left:{x-r}px;top:{y-r}px;width:{2*r}px;height:{2*r}px;border-radius:50%;background:rgba(255,82,82,.55);opacity:0;z-index:6"></div>')
    P.frm(f'#sk{who}', {'opacity': 0, 'scale': .3}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, tt)
    P.to(f'#sk{who}', {'opacity': 0, 'duration': .2}, 51.2)
    mood(f'i{who}', 'open', tt)
txt('ifirst', 'CENTRAL PEOPLE CATCH IT FIRST', 46.45, 48.45, 1090, 66, color=SICK, extra='z-index:8')
# canary = early warning (48.46 - 50.9)
P.add(f'<svg id="cn" class="abs" width="130" height="120" viewBox="0 0 120 110" style="left:{MINI["Ava"][0]-65}px;top:{MINI["Ava"][1]-210}px;opacity:0;z-index:9;transform-origin:50% 100%"><ellipse cx="58" cy="64" rx="38" ry="30" fill="#ffd23f" stroke="{INK}" stroke-width="5"/><circle cx="88" cy="42" r="20" fill="#ffd23f" stroke="{INK}" stroke-width="5"/><path d="M104 40l16 6-16 8z" fill="#ff8a3d" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="93" cy="38" r="4.5" fill="{INK}"/><path d="M30 62q18-26 40-4q-14 20-40 4z" fill="#f2b705" stroke="{INK}" stroke-width="4"/><path d="M22 70l-18 12M22 62l-18-2" stroke="{INK}" stroke-width="5" stroke-linecap="round"/><path d="M50 94v12M66 94v12" stroke="#ff8a3d" stroke-width="5" stroke-linecap="round"/></svg>')
P.frm('#cn', {'opacity': 0, 'scale': .2, 'y': -40}, {'opacity': 1, 'scale': 1, 'y': 0, 'duration': .4, 'ease': 'back.out(2.4)'}, 48.5)
P.to('#cn', {'y': -10, 'rotation': 5, 'duration': .22, 'yoyo': True, 'repeat': 8, 'ease': 'sine.inOut'}, 48.95); P.to('#cn', {'opacity': 0, 'duration': .2}, 51.15)
for k in range(3):
    P.add(f'<div id="rg{k}" class="abs" style="left:{MINI["Ava"][0]-80}px;top:{MINI["Ava"][1]-200}px;width:160px;height:160px;border-radius:50%;border:5px solid {GREEN};opacity:0;z-index:8"></div>')
    P.frm(f'#rg{k}', {'opacity': 0, 'scale': .5}, {'opacity': .9, 'scale': .8, 'duration': .1, 'ease': 'none'}, 48.8 + .3 * k); P.to(f'#rg{k}', {'opacity': 0, 'scale': 2.6, 'duration': .7, 'ease': 'power2.out'}, 48.9 + .3 * k)
txt('ew', 'EARLY WARNING', 48.46, 51.2, 1090, 120, color=GOLD, extra='z-index:8')
flash(48.5, .3); punch(48.52, 1.05)
c()

# ============================ NOT YOU (51.2 - end) =========================================================
c = scene('n0', 51.2, DUR)
top_label('nf', 'YOUR FEED', 51.3, 53.5, top=130, size=64, color=CORAL)
P.add(f'<div id="ph2" class="abs" style="left:330px;top:330px;width:420px;height:700px;border-radius:46px;border:7px solid {CREAM};background:#0a1620;overflow:hidden;opacity:0;z-index:5;box-shadow:0 30px 80px rgba(0,0,0,.7)"><div id="feed" style="position:absolute;left:0;top:0;width:100%">'
      + ''.join(f'<div style="margin:14px 14px 0;height:122px;border-radius:20px;background:rgba(255,243,230,.1);border:2px solid rgba(255,243,230,.25);position:relative"><div style="position:absolute;left:14px;top:14px;width:54px;height:54px;border-radius:50%;background:{col}"></div><div style="position:absolute;left:82px;top:20px;width:{w}px;height:14px;border-radius:7px;background:rgba(255,243,230,.6)"></div><div style="position:absolute;left:82px;top:46px;width:{w2}px;height:14px;border-radius:7px;background:rgba(255,243,230,.3)"></div><div style="position:absolute;right:16px;bottom:10px;font-family:Anton;font-size:40px;color:{col}">{num}</div></div>'
                for col, w, w2, num in [(AMBER, 170, 120, '98K'), (CORAL, 120, 160, '1.2M'), (TEAL, 190, 100, '450K'), (AMBER, 140, 150, '2.4M'), (CORAL, 180, 110, '730K'), (TEAL, 130, 170, '5M'), (AMBER, 160, 120, '310K'), (CORAL, 150, 140, '8M'), (TEAL, 120, 160, '99K'), (AMBER, 170, 130, '1M')])
      + '</div></div>')
P.frm('#ph2', {'opacity': 0, 'y': 80, 'scale': .9}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .4, 'ease': 'power3.out'}, 51.3)
P.frm('#feed', {'y': 0}, {'y': -820, 'duration': 3.2, 'ease': 'none'}, 51.5)
face('nyou', 'You', 220, 560, 56, 52.0, t_out=54.4, ring=CORAL); mood('nyou', 'sad', 52.6)
bubble('nb', 'Everyone has more!', 110, 440, 52.5, 53.9, tail='l', col=CREAM)
P.to('#ph2', {'opacity': .25, 'scale': .94, 'duration': .3}, 53.5); P.to('#ph2', {'opacity': 0, 'duration': .2}, 54.5)
slam('nyouS', "IT'S NOT YOU", 53.54, 54.6, 1070, 150, color=CORAL, rot=-2)
flash(53.54, .4); punch(53.6, 1.06); mood('nyou', 'smile', 53.7)
mini = {'H': (540, 640), 'A': (410, 520), 'B': (670, 520), 'C': (390, 760), 'D': (540, 860), 'E': (690, 760)}
who2 = {'H': 'Ava', 'A': 'Mia', 'B': 'Leo', 'C': 'Sam', 'D': 'Zoe', 'E': 'Max'}
mlines = [(f'me{k}', 540, 640, x, y, GOLD, 6) for k, (x, y) in mini.items() if k != 'H'] + [('meAB', 410, 520, 670, 520, CREAM, 4)]
L = edges_svg(mlines, z=3)
for i, (k, (x, y)) in enumerate(mini.items()):
    face(f'm{k}', who2[k], x, y, 54 if k == 'H' else 38, 54.6 + .08 * i, t_out=56.4, ring=GOLD if k == 'H' else CREAM)
    if k != 'H': draw(f'me{k}', L[f'me{k}'], 54.6 + .08 * i, .3, t_out=56.4)
draw('meAB', L['meAB'], 55.1, .3, t_out=56.4)
txt('cnt', 'COUNTED UNEVENLY', 54.7, 56.45, 1090, 110, color=GOLD)
top_label('nl', 'THE FRIENDSHIP PARADOX', 54.6, 56.45, top=130, size=46)
top_label('nl2', 'THE FRIENDSHIP PARADOX', 56.5, DUR - .3, top=120, size=46)
hook_graph('z', 56.5, speed=1.6)
P.add(f'<div class="neon" id="end" style="position:absolute;left:0;right:0;top:1090px;font-size:122px;line-height:1.02;opacity:0;z-index:8">MATH SAYS SO.</div>')
P.frm('#end', {'opacity': 0, 'scale': 1.8}, {'opacity': 1, 'scale': 1, 'duration': .25, 'ease': 'power4.in'}, 58.92)
P.add(f'<div class="tag2" id="cta" style="left:250px;top:1260px;z-index:8;font-size:30px;background:{CORAL};color:#fff">send this to a friend</div>')
P.frm('#cta', {'opacity': 0, 'y': 30}, {'opacity': 1, 'y': 0, 'duration': .3, 'ease': 'back.out(2)'}, 59.45)
shake(59.1, 14); flash(58.92, .4); punch(58.94, 1.06)
mood('zyou', 'smile', 60.1); bubble('zb1', "I'm sending this!", 40, 805, 60.1, 62.0, tail='l', col=GOLD)
P.to('#cta', {'scale': 1.12, 'duration': .25, 'yoyo': True, 'repeat': 3, 'ease': 'sine.inOut'}, 60.2); punch(60.1, 1.04); flash(60.1, .25)
P.to('#cam', {'opacity': 0, 'duration': .25}, DUR - .3)
c()

P.add('</div>')
P.chrome()
P.captions(y=1435)
P.write()
print('fp2 ok', DUR, len(P.js))
