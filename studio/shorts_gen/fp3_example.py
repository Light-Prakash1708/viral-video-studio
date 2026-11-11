import sys, math, json, random
sys.path.insert(0, '/home/user/viral-video-studio/studio/shorts_gen')
from common import *

words = load_words('/root/hf-shorts/fp3_words.json')
SEGS = json.load(open('/root/hf-shorts/fp3_segs.json'))
S = {s['id']: (s['s'], s['e']) for s in SEGS}
TXT = {s['id']: s['text'] for s in SEGS}
VOICE_END = SEGS[-1]['e']
DUR = round(VOICE_END + 1.8, 2)
P = Proj('fp3', DUR, words)
GREEN = '#43e08a'; GOLD = AMBER; SICK = '#ff5252'
s1 = open('/root/hf-shorts/fp.py').read(); s2 = open('/root/hf-shorts/fp2.py').read()
exec(s1[s1.index('P.css.append('):s1.index("P.add('<div id=\"bg\">")])                 # shared css classes
exec(s1[s1.index('GLYPH ='):s1.index('# ============================ HOOK')])              # node/badge/chip/edges_svg/draw/txt/slam/vpanel/top_label/scene/...
exec(s2[s2.index('# ------------------------------------------------------------------ new background'):s2.index("c = scene('h0', 0, 5.7)")])   # background + characters + bubble + hook_graph
P.to('#cam', {'scale': 1.0, 'duration': .01}, 0)

def say(sid, who_node, x, y, tail='l', col=CREAM, fs=34, pad=0.0):
    a, b = S[sid]
    bubble('bb_' + sid, TXT[sid], x, y, a, b + .35 + pad, tail=tail, col=col, fs=fs)

def picto(pre, label, whos, y, t, t_out, col=CREAM, count=True):
    """a row of little faces = how many friends someone has"""
    P.add(f'<div id="{pre}lb" class="abs" style="left:30px;top:{y+18}px;width:250px;text-align:right;font-family:Oswald;font-weight:700;letter-spacing:.08em;font-size:30px;color:{col};opacity:0;z-index:8;line-height:1.05">{label}</div>')
    P.frm(f'#{pre}lb', {'opacity': 0, 'x': -20}, {'opacity': 1, 'x': 0, 'duration': .25}, t); P.to(f'#{pre}lb', {'opacity': 0, 'duration': .15}, t_out)
    for i, w in enumerate(whos):
        face(f'{pre}f{i}', w, 330 + i * 86, y + 36, 36, t + .1 + .12 * i, t_out=t_out, ring=col, z=8, dur=.28)
    if count:
        P.add(f'<div id="{pre}n" class="abs" style="left:{330+len(whos)*86+10}px;top:{y-4}px;font-family:Anton;font-size:84px;color:{col};opacity:0;z-index:8">{len(whos)}</div>')
        P.frm(f'#{pre}n', {'opacity': 0, 'scale': .3}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2.6)'}, t + .2 + .12 * len(whos)); P.to(f'#{pre}n', {'opacity': 0, 'duration': .15}, t_out)

# ============================ 1. HOOK: do your friends have more friends than you? (0 - 5.9) =============
c = scene('h0', 0, 5.95)
top_label('hl', 'THE FRIENDSHIP PARADOX', 0.15, 5.9, top=120, size=46)
hook_graph('h', 0.0)
mood('hyou', 'sad', 1.9); bubble('hb1', 'Only 3 friends?!', 40, 805, 2.0, 3.0, tail='l')
a, b = S['n2']
slam('hyes', 'YES!', a + .05, a + 1.4, 1090, 190, color=GREEN, rot=-3)
txt('hnorm', 'TOTALLY NORMAL', a + 1.2, b + .5, 1130, 110, color=GOLD)
punch(0.12, 1.04); punch(a + .06, 1.05); flash(a + .05, .35)
c()

# ============================ 2. THE SCHOOL OF SIX (6.0 - 13.4): star network ============================
HUB = (540, 710); POS = {'Mia': (300, 500), 'Leo': (780, 500), 'Sam': (270, 860), 'Zoe': (540, 990), 'Max': (810, 860)}
KIDS = list(POS)
c = scene('s0', 5.95, S['n10'][1] + .8)
a, b = S['n3']
top_label('sl', 'A SCHOOL WITH 6 KIDS', a + .1, S['n5'][1], top=120, size=52)
vpanel('sp', 'party3', a, b + .1, 330, h=600, tag='archival film · illustrative')
slam('s6', '6 KIDS', a + .6, b + .1, 1080, 150, color=CREAM, rot=-2)
flash(a, .3)
n4a, n4b = S['n4']
lines = [(f'se{k}', HUB[0], HUB[1], x, y, GOLD, 7) for k, (x, y) in POS.items()]
L = edges_svg(lines)
face('sAva', 'Ava', HUB[0], HUB[1], 76, n4a + .15, ring=CREAM)
crown('scr', HUB[0], HUB[1] - 118, n4a + .5)
name_tag('snAva', 'AVA', HUB[0], HUB[1] + 66, n4a + .5, col=GOLD)
for i, (k, (x, y)) in enumerate(POS.items()):
    t = n4a + .75 + .12 * i
    draw(f'se{k}', L[f'se{k}'], t, .3); face(f's{k}', k, x, y, 56, t + .08); name_tag(f'sn{k}', k.upper(), x, y + 46, t + .25)
say('a1', 'sAva', 290, 362, tail='l', col=GOLD)
a5, b5 = S['n5']
txt('s1f', 'EVERYONE ELSE: 1 FRIEND', a5 + .2, b5 + .3, 1125, 80, color=CORAL)
for i, k in enumerate(KIDS): badge(f'sb{k}', '1', POS[k][0] + 50, POS[k][1] - 50, 25, CORAL, a5 + .5 + .22 * i, fs=36, color='#fff')
badge('sbAva', '5', HUB[0] + 68, HUB[1] - 68, 30, GOLD, b5 - .6, fs=40)
c()

# ============================ 3. LET'S ASK THE KIDS (13.7 - 31.5) ===========================================
ALLN = ['sAva'] + [f's{k}' for k in KIDS]; ALLE = [f'se{k}' for k in KIDS]
ALLT = ['snAva'] + [f'sn{k}' for k in KIDS]; ALLB = ['sbAva'] + [f'sb{k}' for k in KIDS]; EXTRA = ['scr']
def focus(names, t, d=.2):
    ids_on = []; ids_off = []
    for grp, fmt in ((ALLN, '{}'), (ALLT, '{}'), (ALLB, '{}')):
        for g in grp:
            nm = g.replace('sn', '').replace('sb', '').replace('s', '', 1) if g not in ('snAva', 'sbAva', 'sAva') else g.replace('sn', '').replace('sb', '').replace('s', '', 1)
            (ids_on if nm in names else ids_off).append(g)
    for k in KIDS: (ids_on if k in names else ids_off).append(f'se{k}')
    (ids_on if 'Ava' in names else ids_off).append('scr')
    if ids_off: P.to(','.join('#' + i for i in ids_off), {'opacity': .2, 'duration': d}, t)
    if ids_on: P.to(','.join('#' + i for i in ids_on), {'opacity': 1, 'duration': d}, t)
c = scene('q0', S['n6'][0] - .1, S['a3'][1] + .5)
a6, b6 = S['n6']; sa, sb_ = S['s1']; a7, b7 = S['n7']; aa2, ba2 = S['a2']; a8, b8 = S['n8']; a9, b9 = S['n9']; aa3, ba3 = S['a3']
top_label('qt', 'LET’S ASK THE KIDS', a6, sb_ + .2, top=120, size=56, color=AMBER)
focus(['Sam'], a6 + .1); mood('sSam', 'sad', a6 + .3); ring('sSam', CORAL, a6 + .1)
P.add(f'<div id="spot2" class="abs" style="left:{POS["Sam"][0]-86}px;top:{POS["Sam"][1]-86}px;width:172px;height:172px;border-radius:50%;border:6px solid {GREEN};box-shadow:0 0 30px {GREEN};opacity:0;z-index:9"></div>')
P.frm('#spot2', {'opacity': 0, 'scale': 1.6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, a6 + .2); P.to('#spot2', {'opacity': 0, 'duration': .2}, a7)
say('s1', 'sSam', 70, 740, tail='l')
picto('p1', 'SAM HAS', ['Ava'], 1085, sa + .3, a9 - .3, col=CREAM)
focus(['Ava'], a7 + .1); P.st('#sSam', {'opacity': 1}, a7);
say('a2', 'sAva', 290, 362, tail='l', col=GOLD)
focus(['Ava', 'Sam'], a7 + .1)
picto('p2', 'AVA HAS', ['Sam', 'Zoe', 'Max', 'Mia', 'Leo'], 1185, aa2 + .1, a9 - .3, col=GOLD)
P.add(f'<div class="stat" id="ver1" style="top:1300px;font-size:80px;color:{GREEN};opacity:0;z-index:8">AVA HAS MORE</div>')
P.frm('#ver1', {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, a8 + .2); P.to('#ver1', {'opacity': 0, 'duration': .15}, a8 + 3.0)
punch(a8 + .22, 1.04)
# Zoe, Max, Mia, Leo answer
for sid, who, tt in (('z1', 'Zoe', 0), ('m1', 'Max', 0), ('mi1', 'Mia', 0), ('l1', 'Leo', 0)):
    t0, t1 = S[sid]
    focus(['Ava', who], t0 - .05); mood('s' + who, 'sad', t0); ring('s' + who, CORAL, t0)
    pos = {'Zoe': (330, 880), 'Max': (690, 760), 'Mia': (110, 395), 'Leo': (700, 395)}[who]
    say(sid, 's' + who, pos[0], pos[1], tail='l' if who in ('Zoe', 'Mia') else 'r', fs=36)
    chip(f'cz{who}', '1 &lt; 5', POS[who][0] - 55, POS[who][1] + 78 if who in ('Zoe',) else POS[who][1] + 70, t0 + .15, t_out=b9 + .5, border=CORAL)
# Ava's turn
focus(['Ava'] + KIDS, a9 + .1)
P.to('#snAva', {'opacity': 1}, a9)
mood('sAva', 'smile', a9); ring('sAva', GREEN, aa3)
say('a3', 'sAva', 290, 362, tail='l', col=GOLD, fs=32)
P.add(f'<div class="stat" id="ver2" style="top:1135px;font-size:76px;color:{GOLD};opacity:0;z-index:8">THEY EACH HAVE JUST 1</div>')
P.frm('#ver2', {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, aa3 + .4); P.to('#ver2', {'opacity': 0, 'duration': .15}, ba3 + .3)
txt('ver3', 'AVA IS AHEAD', ba3 - .5, ba3 + .6, 1230, 96, color=GREEN)
c()

# ============================ 4. FIVE OF SIX (31.5 - 36.6) ===================================================
a10, b10 = S['n10']
c = scene('r0', a10 - .1, b10 + .6)
focus(['Ava'] + KIDS, a10)
top_label('rl', 'THE SCORE', a10, b10, top=120, size=56, color=AMBER)
for i, k in enumerate(KIDS): ring('s' + k, CORAL, a10 + .5 + .2 * i); mood('s' + k, 'sad', a10 + .5 + .2 * i)
ring('sAva', GREEN, a10 + 1.7)
slam('r56', '5 OF 6', a10 + .75, b10 - 1.35, 1090, 230, color=CORAL, rot=-2)
P.add(f'<div class="lab2" id="rlab" style="top:1335px;font-size:28px;color:{AMBER};opacity:0;z-index:8">have fewer friends than their friends</div>')
P.frm('#rlab', {'opacity': 0}, {'opacity': 1, 'duration': .3}, a10 + 1.0); P.to('#rlab', {'opacity': 0, 'duration': .15}, b10 - 1.3)
txt('rmath', 'NOT BAD LUCK. MATH.', b10 - 1.3, b10 + .6, 1130, 100, color=GOLD)
flash(a10 + .75, .3); punch(a10 + .8, 1.05); punch(b10 - 1.2, 1.04)
c()

# ============================ 5. WHY: everyone's list has Ava (36.6 - 52.8) ==================================
a11, b11 = S['n11']; a12, b12 = S['n12']
c = scene('w0', a11 - .1, b12 + .3)
top_label('wl', 'WHY?', a11, a11 + 1.4, top=115, size=80, color=CORAL)
top_label('wl2', "EVERYONE'S FRIEND LIST", a11 + 1.4, b11 + .3, top=125, size=48, color=AMBER)
RY = lambda i: 345 + i * 118
for i, who in enumerate(KIDS):
    t = a11 + 1.2 + .15 * i
    P.add(f'<div id="rw{i}" class="abs" style="left:90px;top:{RY(i)}px;width:900px;height:100px;border-radius:20px;background:rgba(255,243,230,.1);border:3px solid rgba(255,243,230,.35);opacity:0;z-index:4"></div>')
    P.frm(f'#rw{i}', {'opacity': 0, 'x': -60}, {'opacity': 1, 'x': 0, 'duration': .3, 'ease': 'power3.out'}, t); P.to(f'#rw{i}', {'opacity': 0, 'duration': .2}, b11 + .3)
    face(f'rn{i}', who, 150, RY(i) + 50, 36, t + .05, t_out=b11 + .3)
    P.add(f'<div class="abs" id="rt{i}" style="left:204px;top:{RY(i)+30}px;font-family:Oswald;font-weight:700;font-size:32px;letter-spacing:.1em;color:{CREAM};opacity:0;z-index:5">{who.upper()}’S LIST</div>')
    P.frm(f'#rt{i}', {'opacity': 0}, {'opacity': 1, 'duration': .2}, t + .1); P.to(f'#rt{i}', {'opacity': 0, 'duration': .2}, b11 + .3)
    face(f'rc{i}', 'Ava', 620, RY(i) + 50, 38, t + .35, ring=GOLD, t_out=b11 + .3)
    P.to(f'#rc{i}', {'boxShadow': f'0 0 44px {AMBER}', 'scale': 1.15, 'duration': .18, 'yoyo': True, 'repeat': 1}, t + .8)
P.add(f'<div class="stat" id="hcount" style="top:1085px;font-size:96px;color:{GOLD};opacity:0;z-index:8">AVA IS ON <span id="hn">0</span> LISTS</div>')
P.frm('#hcount', {'opacity': 0, 'scale': .7}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, b11 - 2.3)
P.counter('#hn', 0, 5, b11 - 2.2, 1.1, 'function(v){return Math.round(v)}', 'power1.inOut'); P.to('#hcount', {'opacity': 0, 'duration': .15}, b11 + .3)
txt('hone', 'EVERYONE ELSE: 1', b11 - .9, b11 + .3, 1215, 76, color=CREAM)
# pick a friend, any friend -> Ava every time
top_label('pk', 'PICK A FRIEND AT RANDOM', a12, a12 + 4.6, top=115, size=44, color=CORAL)
for i, who in enumerate(KIDS):
    x = 150 + i * 195; t = a12 + .5 + .45 * i
    face(f'pq{i}', who, x, 520, 44, t, t_out=a12 + 4.6)
    P.add(f'<div id="pa{i}" class="abs" style="left:{x-5}px;top:585px;width:10px;height:140px;opacity:0;z-index:5"><svg width="10" height="140" viewBox="0 0 10 140"><path d="M5 0V120" stroke="{GREEN}" stroke-width="6" stroke-linecap="round"/><path d="M-6 108L5 130L16 108" fill="none" stroke="{GREEN}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>')
    P.frm(f'#pa{i}', {'opacity': 0, 'y': -30}, {'opacity': 1, 'y': 0, 'duration': .25}, t + .2); P.to(f'#pa{i}', {'opacity': 0, 'duration': .2}, a12 + 4.6)
    face(f'pr{i}', 'Ava', x, 790, 52, t + .35, ring=GOLD, t_out=a12 + 4.6)
    P.to(f'#pr{i}', {'scale': 1.15, 'duration': .15, 'yoyo': True, 'repeat': 1}, t + .7)
txt('pava', 'AVA. AVA. AVA. AVA. AVA.', a12 + 2.6, a12 + 4.7, 1060, 78, color=GOLD)
# real life is less extreme -> real networks over a photo
a_rl = a12 + 4.8
txt('rlx', 'REAL LIFE IS LESS EXTREME', a_rl, a_rl + 2.5, 1000, 86, color=CREAM)
txt('rls', 'BUT THE SAME PATTERN', a_rl + 1.0, a_rl + 2.5, 1160, 80, color=CORAL)
P.add(f'<div id="ph" class="abs" style="left:60px;top:330px;width:960px;height:560px;border-radius:24px;overflow:hidden;opacity:0;z-index:5;box-shadow:0 0 0 4px rgba(255,243,230,.92),0 28px 70px rgba(0,0,0,.75)"><img id="phi" src="assets/img/friends2.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:contrast(1.05) saturate(1.1)"/><div class="tag2" style="left:18px;bottom:16px;font-size:22px;opacity:1">photo · illustrative</div></div>')
t_ph = a_rl + 2.6
P.frm('#ph', {'opacity': 0, 'y': 70, 'scale': .92}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .38, 'ease': 'power3.out'}, t_ph)
P.frm('#phi', {'scale': 1.0}, {'scale': 1.15, 'duration': b12 - t_ph + .3, 'ease': 'none'}, t_ph); P.to('#ph', {'opacity': 0, 'duration': .2}, b12 + .25)
net = [(200, 430), (360, 560), (520, 470), (700, 600), (850, 470), (280, 760), (470, 800), (640, 780), (820, 790), (150, 600), (930, 640), (560, 620)]
ned = [(0, 1), (1, 2), (2, 3), (3, 4), (1, 5), (5, 6), (6, 7), (7, 8), (2, 11), (11, 6), (3, 7), (0, 9), (4, 10), (9, 5), (11, 7)]
lines = [(f'ne{i}', net[a][0], net[a][1], net[b][0], net[b][1], 'rgba(255,243,230,.9)', 4) for i, (a, b) in enumerate(ned)]
L = edges_svg(lines, z=7)
for i, (a, b) in enumerate(ned): draw(f'ne{i}', L[f'ne{i}'], t_ph + .1 + .08 * i, .3, t_out=b12 + .2)
for i, (x, y) in enumerate(net): node(f'nn{i}', x, y, 15 + (10 if i in (2, 6, 11) else 0), GOLD if i in (2, 6, 11) else CREAM, t_ph + .1 + .05 * i, glyph=False, dur=.2, t_out=b12 + .2, z=8)
txt('rnet', 'REAL NETWORKS', t_ph + .1, b12 + .3, 960, 110, color=CORAL)
P.add(f'<div class="lab2" id="fb" style="top:1100px;font-size:50px;color:{CREAM};opacity:0;z-index:8">like Facebook</div>')
P.frm('#fb', {'opacity': 0, 'y': 24}, {'opacity': 1, 'y': 0, 'duration': .3}, b12 - 1.3); P.to('#fb', {'opacity': 0, 'duration': .15}, b12 + .25)
c()

# ============================ 6. THE FLU TWIST (53.1 - 66) ====================================================
a13, b13 = S['n13']; a14, b14 = S['n14']
c = scene('f0', a13 - .1, b14 + .5)
slam('ft', 'THE COOL PART', a13 + .05, a13 + 1.5, 110, 104, color=GOLD, rot=-2)
flash(a13, .45); punch(a13 + .05, 1.06)
# students name a friend
P.add(f'<div class="tag2" id="stl" style="left:60px;top:300px;z-index:8;background:{CORAL};color:#fff;font-size:26px">RANDOM STUDENTS</div><div class="tag2" id="frl" style="left:60px;top:640px;z-index:8;background:{AMBER};color:{INK};font-size:26px">THE FRIENDS THEY NAME</div>')
P.frm('#stl', {'opacity': 0, 'x': -30}, {'opacity': 1, 'x': 0, 'duration': .3}, a13 + 1.4); P.frm('#frl', {'opacity': 0, 'x': -30}, {'opacity': 1, 'x': 0, 'duration': .3}, a13 + 2.4)
P.to('#stl,#frl', {'opacity': 0, 'duration': .2}, a14 - .4)
stu = ['Mia', 'Leo', 'Sam', 'Zoe', 'Max']; frn = ['Ava', 'Ava', 'Ava', 'Ava', 'Ava']
for i, who in enumerate(stu):
    x = 150 + i * 195
    face(f'st{i}', who, x, 430, 46, a13 + 1.6 + .18 * i, t_out=a14 - .4)
    P.add(f'<div id="sa{i}" class="abs" style="left:{x-5}px;top:490px;width:10px;height:100px;opacity:0;z-index:5"><svg width="10" height="100" viewBox="0 0 10 100"><path d="M5 0V82" stroke="{CREAM}" stroke-width="6" stroke-linecap="round"/><path d="M-6 70L5 92L16 70" fill="none" stroke="{CREAM}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>')
    P.frm(f'#sa{i}', {'opacity': 0, 'y': -20}, {'opacity': 1, 'y': 0, 'duration': .25}, a13 + 2.2 + .18 * i); P.to(f'#sa{i}', {'opacity': 0, 'duration': .2}, a14 - .4)
    face(f'sf{i}', 'Ava', x, 750, 52, a13 + 2.6 + .18 * i, ring=GOLD, t_out=a14 - .4)
# the flu
P.add(f'<svg id="vir" class="abs" width="150" height="150" viewBox="0 0 150 150" style="left:465px;top:880px;opacity:0;z-index:8"><circle cx="75" cy="75" r="38" fill="{SICK}"/><g stroke="{SICK}" stroke-width="8" stroke-linecap="round"><path d="M75 15V32M75 118V135M15 75H32M118 75H135M33 33L45 45M105 105L117 117M33 117L45 105M105 45L117 33"/></g><circle cx="62" cy="68" r="5" fill="#fff"/><circle cx="88" cy="72" r="5" fill="#fff"/><path d="M62 90q13 8 26 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>')
P.frm('#vir', {'opacity': 0, 'scale': .2, 'rotation': -40}, {'opacity': 1, 'scale': 1, 'rotation': 0, 'duration': .45, 'ease': 'back.out(2)'}, b13 - 1.3); P.to('#vir', {'opacity': 0, 'duration': .2}, a14 - .3)
txt('flut', 'THEN THEY TRACKED THE FLU', b13 - 1.3, a14 - .3, 1090, 74, color=SICK)
# the curves: friends vs students
X0, X1, BASE = 110, 970, 960
chart_t = a14 + .1
P.add(f'<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;z-index:3"><line id="ax1" x1="{X0}" y1="{BASE}" x2="{X1}" y2="{BASE}" stroke="{CREAM}" stroke-width="6" stroke-linecap="round" stroke-dasharray="880" stroke-dashoffset="880"/><line id="ax2" x1="{X0}" y1="{BASE}" x2="{X0}" y2="420" stroke="{CREAM}" stroke-width="6" stroke-linecap="round" stroke-dasharray="560" stroke-dashoffset="560"/></svg>')
P.frm('#ax1', {'strokeDashoffset': 880}, {'strokeDashoffset': 0, 'duration': .5, 'ease': 'power2.out'}, chart_t); P.frm('#ax2', {'strokeDashoffset': 560}, {'strokeDashoffset': 0, 'duration': .5, 'ease': 'power2.out'}, chart_t + .1)
t_chart_out = a14 + 3.2
P.to('#ax1,#ax2', {'opacity': 0, 'duration': .2}, t_chart_out)
def curve(mu, sig, hgt, n=64):
    pts = [(X0 + 20 + i * (X1 - X0 - 40) / n, BASE - hgt * math.exp(-((X0 + 20 + i * (X1 - X0 - 40) / n - mu) ** 2) / (2 * sig * sig))) for i in range(n + 1)]
    return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts), sum(math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) for i in range(n)) + 4, pts
FM, RM = 480, 730
df, Lf, pf = curve(FM, 95, 430); dr, Lr, pr = curve(RM, 95, 430)
P.add(f'<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;z-index:4">'
      f'<path id="cf" d="{df}" fill="none" stroke="{AMBER}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="{Lf:.0f}" stroke-dashoffset="{Lf:.0f}"/>'
      f'<path id="cr" d="{dr}" fill="none" stroke="{CORAL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="{Lr:.0f}" stroke-dashoffset="{Lr:.0f}"/>'
      f'<line id="pk1" x1="{FM}" y1="{BASE}" x2="{FM}" y2="{BASE-430}" stroke="{AMBER}" stroke-width="4" stroke-dasharray="10 12" opacity="0"/><line id="pk2" x1="{RM}" y1="{BASE}" x2="{RM}" y2="{BASE-430}" stroke="{CORAL}" stroke-width="4" stroke-dasharray="10 12" opacity="0"/>'
      f'<line id="gap" x1="{FM}" y1="{BASE-470}" x2="{RM}" y2="{BASE-470}" stroke="{GREEN}" stroke-width="10" stroke-linecap="round" stroke-dasharray="{RM-FM}" stroke-dashoffset="{RM-FM}"/></svg>')
P.frm('#cf', {'strokeDashoffset': Lf}, {'strokeDashoffset': 0, 'duration': 1.3, 'ease': 'power1.inOut'}, chart_t + .3)
P.frm('#cr', {'strokeDashoffset': Lr}, {'strokeDashoffset': 0, 'duration': 1.5, 'ease': 'power1.inOut'}, chart_t + 1.2)
P.to('#pk1', {'opacity': .9, 'duration': .2}, chart_t + 1.4); P.to('#pk2', {'opacity': .9, 'duration': .2}, chart_t + 2.4)
P.frm('#gap', {'strokeDashoffset': RM - FM}, {'strokeDashoffset': 0, 'duration': .45, 'ease': 'power2.out'}, chart_t + 2.0)
P.to('#cf,#cr,#pk1,#pk2,#gap', {'opacity': 0, 'duration': .2}, t_chart_out)
P.add(f'<div class="tag2" id="lf" style="left:{FM-340}px;top:470px;z-index:8;background:{AMBER};color:{INK};font-size:24px">THEIR FRIENDS</div><div class="tag2" id="lr" style="left:{RM-105}px;top:405px;z-index:8;background:{CORAL};color:#fff;font-size:24px">THE STUDENTS</div><div class="tag2" id="yl" style="left:125px;top:395px;z-index:8;font-size:22px;background:transparent;color:{CREAM}">FLU CASES ↑</div><div class="tag2" id="xl" style="left:820px;top:975px;z-index:8;font-size:22px;background:transparent;color:{CREAM}">TIME →</div>')
P.frm('#lf', {'opacity': 0, 'x': -20}, {'opacity': 1, 'x': 0, 'duration': .25}, chart_t + .6); P.frm('#lr', {'opacity': 0, 'x': 20}, {'opacity': 1, 'x': 0, 'duration': .25}, chart_t + 1.8)
P.frm('#yl,#xl', {'opacity': 0}, {'opacity': .9, 'duration': .3}, chart_t + .2); P.to('#lf,#lr,#yl,#xl', {'opacity': 0, 'duration': .2}, t_chart_out)
P.add(f'<div class="tag2" id="hv" style="left:150px;top:268px;z-index:8;font-size:26px">Harvard study · 744 students · 2010</div>')
P.frm('#hv', {'opacity': 0, 'y': 14}, {'opacity': 1, 'y': 0, 'duration': .3}, chart_t + .1); P.to('#hv', {'opacity': 0, 'duration': .15}, t_chart_out)
txt('wk2', '≈ 2 WEEKS EARLIER', chart_t + 2.0, t_chart_out, 1090, 100, color=GREEN)
# why: popular people meet more people -> star network gets sick, hub first
t_inf = t_chart_out + .15
MINI = {'Ava': (540, 650), 'Mia': (390, 530), 'Leo': (690, 530), 'Sam': (360, 800), 'Zoe': (540, 880), 'Max': (720, 800)}
mlines = [(f'ie{k}', 540, 650, x, y, GOLD, 6) for k, (x, y) in MINI.items() if k != 'Ava']
L = edges_svg(mlines, z=3)
for i, (k, (x, y)) in enumerate(MINI.items()):
    face(f'i{k}', k, x, y, 62 if k == 'Ava' else 46, t_inf + .06 * i, t_out=b14 + .4, ring=GOLD if k == 'Ava' else CREAM)
    if k != 'Ava': draw(f'ie{k}', L[f'ie{k}'], t_inf + .06 * i, .25, t_out=b14 + .4)
txt('meet', 'POPULAR PEOPLE MEET MORE PEOPLE', t_inf, t_inf + 2.6, 1080, 62, color=AMBER)
for who, tt in (('Ava', t_inf + .5), ('Mia', t_inf + 1.4), ('Leo', t_inf + 1.4), ('Sam', t_inf + 1.9), ('Zoe', t_inf + 1.9), ('Max', t_inf + 1.9)):
    x, y = MINI[who]; r = 62 if who == 'Ava' else 46
    P.add(f'<div id="sk{who}" class="abs" style="left:{x-r}px;top:{y-r}px;width:{2*r}px;height:{2*r}px;border-radius:50%;background:rgba(255,82,82,.55);opacity:0;z-index:6"></div>')
    P.frm(f'#sk{who}', {'opacity': 0, 'scale': .3}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, tt); P.to(f'#sk{who}', {'opacity': 0, 'duration': .2}, b14 + .4)
    mood(f'i{who}', 'open', tt)
txt('first', 'SO THEY CATCH THINGS FIRST', t_inf + 1.2, t_inf + 2.7, 1190, 62, color=SICK)
t_can = b14 - 1.2
P.add(f'<svg id="cn" class="abs" width="130" height="120" viewBox="0 0 120 110" style="left:{MINI["Ava"][0]-65}px;top:{MINI["Ava"][1]-215}px;opacity:0;z-index:9;transform-origin:50% 100%"><ellipse cx="58" cy="64" rx="38" ry="30" fill="#ffd23f" stroke="{INK}" stroke-width="5"/><circle cx="88" cy="42" r="20" fill="#ffd23f" stroke="{INK}" stroke-width="5"/><path d="M104 40l16 6-16 8z" fill="#ff8a3d" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="93" cy="38" r="4.5" fill="{INK}"/><path d="M30 62q18-26 40-4q-14 20-40 4z" fill="#f2b705" stroke="{INK}" stroke-width="4"/><path d="M22 70l-18 12M22 62l-18-2" stroke="{INK}" stroke-width="5" stroke-linecap="round"/><path d="M50 94v12M66 94v12" stroke="#ff8a3d" stroke-width="5" stroke-linecap="round"/></svg>')
P.frm('#cn', {'opacity': 0, 'scale': .2, 'y': -40}, {'opacity': 1, 'scale': 1, 'y': 0, 'duration': .4, 'ease': 'back.out(2.4)'}, t_can)
P.to('#cn', {'y': -10, 'rotation': 5, 'duration': .22, 'yoyo': True, 'repeat': 6, 'ease': 'sine.inOut'}, t_can + .5); P.to('#cn', {'opacity': 0, 'duration': .2}, b14 + .35)
for k in range(3):
    P.add(f'<div id="rg{k}" class="abs" style="left:{MINI["Ava"][0]-80}px;top:{MINI["Ava"][1]-205}px;width:160px;height:160px;border-radius:50%;border:5px solid {GREEN};opacity:0;z-index:8"></div>')
    P.frm(f'#rg{k}', {'opacity': 0, 'scale': .5}, {'opacity': .9, 'scale': .8, 'duration': .1, 'ease': 'none'}, t_can + .3 + .3 * k); P.to(f'#rg{k}', {'opacity': 0, 'scale': 2.6, 'duration': .7, 'ease': 'power2.out'}, t_can + .4 + .3 * k)
txt('ew', 'EARLY WARNING', t_can, b14 + .4, 1190, 110, color=GOLD)
flash(t_can, .3); punch(t_can + .02, 1.05)
c()

# ============================ 7. IT'S NOT YOU (66.5 - end) ======================================================
a15, b15 = S['n15']; ay, by = S['y1']; a16, b16 = S['n16']; a17, b17 = S['n17']
c = scene('n0', a15 - .1, DUR)
top_label('nf', 'YOUR FEED', a15, ay, top=130, size=64, color=CORAL)
P.add(f'<div id="ph2" class="abs" style="left:330px;top:330px;width:420px;height:700px;border-radius:46px;border:7px solid {CREAM};background:#0a1620;overflow:hidden;opacity:0;z-index:5;box-shadow:0 30px 80px rgba(0,0,0,.7)"><div id="feed" style="position:absolute;left:0;top:0;width:100%">'
      + ''.join(f'<div style="margin:14px 14px 0;height:122px;border-radius:20px;background:rgba(255,243,230,.1);border:2px solid rgba(255,243,230,.25);position:relative"><div style="position:absolute;left:14px;top:14px;width:54px;height:54px;border-radius:50%;background:{col}"></div><div style="position:absolute;left:82px;top:20px;width:{w}px;height:14px;border-radius:7px;background:rgba(255,243,230,.6)"></div><div style="position:absolute;left:82px;top:46px;width:{w2}px;height:14px;border-radius:7px;background:rgba(255,243,230,.3)"></div><div style="position:absolute;right:16px;bottom:10px;font-family:Anton;font-size:40px;color:{col}">{num}</div></div>'
                for col, w, w2, num in [(AMBER, 170, 120, '98K'), (CORAL, 120, 160, '1.2M'), (TEAL, 190, 100, '450K'), (AMBER, 140, 150, '2.4M'), (CORAL, 180, 110, '730K'), (TEAL, 130, 170, '5M'), (AMBER, 160, 120, '310K'), (CORAL, 150, 140, '8M'), (TEAL, 120, 160, '99K'), (AMBER, 170, 130, '1M')])
      + '</div></div>')
P.frm('#ph2', {'opacity': 0, 'y': 80, 'scale': .9}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .4, 'ease': 'power3.out'}, a15 + .05)
P.frm('#feed', {'y': 0}, {'y': -820, 'duration': b15 - a15 + 1.5, 'ease': 'none'}, a15 + .2)
face('nyou', 'You', 210, 560, 58, a15 + .5, t_out=a16 + .3, ring=CORAL); mood('nyou', 'sad', a15 + .9)
say('y1', 'nyou', 90, 440, tail='l', fs=36)
mood('nyou', 'smile', a16 + .1)
P.to('#ph2', {'opacity': .25, 'scale': .94, 'duration': .3}, a16 - .2); P.to('#ph2', {'opacity': 0, 'duration': .2}, a16 + .4)
slam('nyouS', "IT'S NOT YOU", a16 + .05, a16 + 1.6, 1070, 150, color=CORAL, rot=-2)
flash(a16 + .05, .4); punch(a16 + .1, 1.06)
mini = {'H': (540, 640), 'A': (410, 520), 'B': (670, 520), 'C': (390, 760), 'D': (540, 860), 'E': (690, 760)}
who2 = {'H': 'Ava', 'A': 'Mia', 'B': 'Leo', 'C': 'Sam', 'D': 'Zoe', 'E': 'Max'}
tcu = a16 + 1.75
mlines = [(f'me{k}', 540, 640, x, y, GOLD, 6) for k, (x, y) in mini.items() if k != 'H']
L = edges_svg(mlines, z=3)
for i, (k, (x, y)) in enumerate(mini.items()):
    face(f'm{k}', who2[k], x, y, 54 if k == 'H' else 38, tcu + .08 * i, t_out=a16 + 3.55, ring=GOLD if k == 'H' else CREAM)
    if k != 'H': draw(f'me{k}', L[f'me{k}'], tcu + .08 * i, .3, t_out=a16 + 3.55)
txt('cnt', 'FRIENDSHIPS GET COUNTED UNEVENLY', tcu, a16 + 3.6, 1100, 62, color=GOLD)
top_label('nl', 'THE FRIENDSHIP PARADOX', tcu, a16 + 3.6, top=130, size=46)
t_loop = a16 + 3.7
top_label('nl2', 'THE FRIENDSHIP PARADOX', t_loop, DUR - .3, top=120, size=46)
hook_graph('z', t_loop, speed=1.6)
t_end = b16 - 1.2
P.add(f'<div class="neon" id="end" style="position:absolute;left:0;right:0;top:1090px;font-size:122px;line-height:1.02;opacity:0;z-index:8">MATH SAYS SO.</div>')
P.frm('#end', {'opacity': 0, 'scale': 1.8}, {'opacity': 1, 'scale': 1, 'duration': .25, 'ease': 'power4.in'}, t_end); P.to('#end', {'opacity': 0, 'duration': .2}, a17 + .1)
shake(t_end + .2, 14); flash(t_end, .4); punch(t_end + .02, 1.06)
P.add(f'<div class="tag2" id="cta" style="left:230px;top:1230px;z-index:8;font-size:34px;background:{CORAL};color:#fff">SEND THIS TO A FRIEND</div>')
P.frm('#cta', {'opacity': 0, 'y': 30}, {'opacity': 1, 'y': 0, 'duration': .3, 'ease': 'back.out(2)'}, a17 + .1)
P.to('#cta', {'scale': 1.1, 'duration': .25, 'yoyo': True, 'repeat': 5, 'ease': 'sine.inOut'}, a17 + .8)
mood('zyou', 'smile', a17 + .2); bubble('zb1', 'Sending it!', 40, 805, a17 + .5, DUR - .4, tail='l', col=GOLD)
punch(a17 + .15, 1.04)
P.to('#cam', {'opacity': 0, 'duration': .25}, DUR - .3)
c()

P.add('</div>')
P.chrome()
P.captions(y=1435)
P.write()
print('fp3 ok', DUR, len(P.js))
