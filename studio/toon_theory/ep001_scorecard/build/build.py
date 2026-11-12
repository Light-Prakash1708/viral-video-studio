#!/usr/bin/env python3
"""Toon Theory EP001 'Why smart girls fall for "dumb" boys' -> /root/hf-shorts/ep001s/index.html (HyperFrames).
Timing = measured dialogue (timeline.py). Characters = approved designs via ../../ep001/build/rig.py.
All visuals are original (drawn in HTML/SVG). No third-party images."""
import sys, os, json, re, random, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/home/user/viral-video-studio/studio/shorts_gen'); sys.path.insert(0, HERE + '/../../ep001/build'); sys.path.insert(0, HERE)
from common import Proj
import rig, timeline
G = rig.G
T, MK, VIS, DUR = timeline.build()
CL = timeline.CLIPS
P = Proj('ep001s', DUR, [])
random.seed(7)
FX, EXPR, SPAN, TALK = [], {}, {}, []
INSTS = {'priya': [], 'ankush': []}
YEL, PINK, TEAL, ORG, RED, INK, CREAM = '#ffd23f', '#ff4f8b', '#2fe6d0', '#ff8c3c', '#ff3b3b', '#160c22', '#fff6e8'
def fx(t, k, g=1.0): FX.append((round(t, 3), k if k.startswith('file:') else 'bank:' + k, g))
def sfx(t, name, g=1.0): FX.append((round(t, 3), 'file:' + name, g))
def s(l): return T[l][0]
def e(l): return T[l][1]
def v0(n): return VIS[n][0]
def v1(n): return VIS[n][1]

# ---------------------------------------------------------------- helpers
def char(inst, key, left, top, w, t0, t1, **kw):
    start = kw.pop('start', 'neutral')
    html, h = rig.char_html(inst, key, left, top, w, **kw)
    SPAN[inst] = (t0, t1); EXPR[inst] = [(t0, start)]; INSTS[key].append(inst)
    return html
def ex(who, name, t):
    for inst in INSTS[who]: EXPR[inst].append((round(t, 3), name))
def pop(sel, t, d=.28, s0=.5, ease='back.out(2.2)'):
    P.st(sel, {'opacity': 0}, 0)
    P.frm(sel, {'opacity': 0, 'scale': s0}, {'opacity': 1, 'scale': 1, 'duration': d, 'ease': ease, 'immediateRender': False}, t)
def out(sel, t, d=.15): P.to(sel, {'opacity': 0, 'duration': d}, t)
def show(sel, t0, t1): P.st(sel, {'opacity': 1}, t0); P.st(sel, {'opacity': 0}, t1)
def layer(lid, z, html, t0, t1, extra=''):
    P.add(f'<div id="{lid}" class="abs" style="left:0;top:0;width:1080px;height:1920px;z-index:{z};opacity:0;{extra}">{html}</div>')
    show('#' + lid, t0, t1)
def shake(sel, t, n=6, a=14):
    P.to(sel, {'keyframes': [{'x': random.choice([-a, a]), 'y': random.choice([-a, a]) * .6, 'duration': .035} for _ in range(n)] + [{'x': 0, 'y': 0, 'duration': .04}]}, t)
def flash(t, col='#fff', op=.85):
    P.frm('#flash', {'opacity': op, 'background': col}, {'opacity': 0, 'duration': .22, 'immediateRender': False}, t)
def lab(txt, x, y, size=58, col=CREAM, bg=INK, rot=0, lid=None, extra=''):
    lid = lid or P.uid('lb')
    return lid, (f'<div id="{lid}" class="abs lbl" style="left:{x}px;top:{y}px;font-size:{size}px;color:{col};background:{bg};transform:rotate({rot}deg);opacity:0;{extra}">{txt}</div>')

# shared CSS
P.css.append(f"""
@font-face{{font-family:'Caveat';src:url(assets/caveat.ttf);font-weight:400 700}}
*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1080px;height:1920px;overflow:hidden;background:#000}}
#root{{position:relative;width:1080px;height:1920px;overflow:hidden;background:{INK};font-family:Inter,sans-serif}}
.abs{{position:absolute}}
.lbl{{font-family:Inter;font-weight:900;padding:8px 22px;border-radius:12px;white-space:nowrap;letter-spacing:-.01em;box-shadow:0 10px 0 rgba(0,0,0,.35)}}
.card{{position:absolute;background:{CREAM};border-radius:28px;border:6px solid {INK};box-shadow:0 18px 0 rgba(0,0,0,.35),0 30px 60px rgba(0,0,0,.45);color:{INK}}}
.sub{{position:absolute;left:50px;right:50px;top:1625px;text-align:center;font:900 58px/1.12 Inter;color:#fff;-webkit-text-stroke:9px #000;paint-order:stroke fill;opacity:0;letter-spacing:-.01em}}
.sub b{{color:{YEL};font-weight:900}}
.hand{{font-family:'Caveat',cursive}}
.cite{{position:absolute;left:40px;top:118px;font:800 26px Inter;color:{INK};background:{YEL};padding:8px 16px;border-radius:10px;border:3px solid {INK};opacity:0;z-index:58}}
#flash{{position:absolute;inset:0;background:#fff;opacity:0;z-index:95;pointer-events:none}}
#grain{{position:absolute;inset:-300px;z-index:96;pointer-events:none;background:url(assets/noise.png);background-size:256px 256px;opacity:.05}}
#vig{{position:absolute;inset:0;z-index:94;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%)}}
#brand{{position:absolute;left:0;right:0;bottom:46px;text-align:center;z-index:93;font:800 24px Inter;letter-spacing:.5em;color:rgba(255,246,232,.5)}}
""")
P.css.append(rig.CSS)

# ================================================================= THE SET (persistent two-shot, camera = #SET transform)
halftone = ('<div class="abs" style="left:-600px;top:-400px;width:2280px;height:2800px;background:radial-gradient(circle,rgba(255,255,255,.07) 3px,transparent 3.5px) 0 0/34px 34px"></div>')
setbg = (f'<div class="abs" style="left:-600px;top:-400px;width:2280px;height:2800px;background:linear-gradient(180deg,#2b1a55 0%,#3d1f63 40%,#5a2462 70%,#2a1236 100%)"></div>' + halftone +
         '<div class="abs" style="left:-200px;top:300px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(255,140,60,.45),transparent 65%)"></div>'
         '<div class="abs" style="left:600px;top:250px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(70,130,255,.45),transparent 65%)"></div>'
         '')   # v2: the background "TOON THEORY" neon sign was removed; branding stays on the end card only
desk = (f'<div class="abs" style="left:-600px;top:1520px;width:2280px;height:900px;background:linear-gradient(180deg,#e9b27a 0,#c98a55 26px,#9c6538 27px,#6b3f22 100%);z-index:20"></div>'
        f'<div class="abs" style="left:-600px;top:1520px;width:2280px;height:10px;background:#ffd8a8;z-index:21"></div>')
PL, PT, PW = -40, 610, 640
AL, AT, AW = 470, 560, 640
cast = (char('P', 'priya', PL, PT, PW, 0, DUR, z=10, start='smirk') + char('A', 'ankush', AL, AT, AW, 0, DUR, z=10, start='smirk'))
# props that live on the set: graduation cap on Ankush (end gag)
cap = (f'<div id="gcap" class="abs" style="left:{AL+200}px;top:{AT+20}px;width:240px;height:150px;z-index:15;opacity:0">'
       f'<svg viewBox="0 0 240 150" width="240" height="150"><path d="M20 60 L120 20 L220 60 L120 100 Z" fill="#1d1d2b" stroke="#000" stroke-width="5"/><path d="M60 78 L60 120 Q120 145 180 120 L180 78 L120 100 Z" fill="#26263a" stroke="#000" stroke-width="5"/><path d="M200 66 L200 118" stroke="{YEL}" stroke-width="6"/><circle cx="200" cy="124" r="9" fill="{YEL}"/></svg></div>')
P.add(f'<div id="SET" class="abs" style="left:0;top:0;width:1080px;height:1920px;z-index:5;transform-origin:0 0">{setbg}{cast}{cap}{desk}</div>')
# face centres measured from a snapshot (px in 1080x1920 frame) for camera framing
FACE = {'P': (280, 1060), 'A': (790, 900)}
def cam(t, who=None, s=1.0, yc=1080, d=0.0, ease='power3.out'):
    if who is None: props = {'scale': 1, 'x': 0, 'y': 0}
    else:
        fx_, fy_ = FACE[who]; props = {'scale': s, 'x': round(540 - fx_ * s), 'y': round(yc - fy_ * s)}
    if d: P.to('#SET', dict(props, duration=d, ease=ease), round(t, 3))
    else: P.st('#SET', props, round(t, 3))
def punch(t, k=1.06):
    P.to('#SETW', {'keyframes': [{'scale': k, 'duration': .08}, {'scale': 1, 'duration': .35, 'ease': 'power2.out'}]}, t)
# wrap SET in SETW for punch-ins (scale around frame centre)
P.body[-1] = P.body[-1].replace('<div id="SET"', '<div id="SETW" class="abs" style="left:0;top:0;width:1080px;height:1920px;z-index:5;transform-origin:540px 1000px"><div id="SET"', 1) + '</div>'

# ================================================================= HOOK
h0 = 0.0; a01s, a01e = T['a01']
# --- REVISED OPENING (v2): one clear idea per shot, cuts land on the existing SFX (audio untouched).
# 0.00-1.45 Priya, class topper | 1.45-2.82 spelling-test insert (X on the buzzer 1.95, zoom on the whip 2.4)
# 2.82 cut to the set on the kick | matched medium shots (same scale for both) | reaction cut | freeze on the scratch
# --- shot 1: Priya, class topper: Priya is the focal point, one label, gentle push-in, a little slow confetti
rays = ''.join(f'<div class="abs" style="left:540px;top:1000px;width:1500px;height:120px;background:linear-gradient(90deg,rgba(255,240,180,.55),rgba(255,240,180,0));transform-origin:0 50%;transform:rotate({i*30+8}deg)"></div>' for i in range(12))
medal = (f'<svg viewBox="0 0 200 300" width="120" height="180"><path d="M60 0 L100 120 L140 0 Z" fill="{PINK}" stroke="#000" stroke-width="6"/><path d="M100 0 L80 120 L120 120 Z" fill="{TEAL}" stroke="#000" stroke-width="5"/>'
         f'<circle cx="100" cy="190" r="80" fill="{YEL}" stroke="#000" stroke-width="8"/><circle cx="100" cy="190" r="56" fill="#ffb000" stroke="#000" stroke-width="5"/><text x="100" y="214" text-anchor="middle" font-family="Inter" font-weight="900" font-size="72" fill="#000">1</text></svg>')
conf_all = [f'<div class="abs cf" style="left:{random.randint(0,1040)}px;top:{random.randint(-300,0)}px;width:{random.randint(14,26)}px;height:{random.randint(26,44)}px;background:{random.choice([PINK,TEAL,YEL,"#fff",ORG])};transform:rotate({random.randint(0,180)}deg)"></div>' for _ in range(60)]
conf = ''.join(conf_all[:14])   # all 60 are still drawn from the RNG so every later random value (blinks etc.) stays identical
mA = (f'<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 52%,#ffc56b 0%,#ff9f1c 45%,#e86a10 100%);overflow:hidden">{rays}</div>'
      + char('pT', 'priya', 170, 560, 760, 0, 1.5, z=3, start='smile') +
      f'<div id="medal" class="abs" style="left:480px;top:1440px;z-index:5;transform-origin:50% 0">{medal}</div>{conf}'
      f'<div id="mAt" class="abs lbl" style="left:0;right:0;margin:auto;width:max-content;top:250px;font-size:80px;line-height:1;color:#000;background:#fff;text-align:center;z-index:6">CLASS TOPPER<br><span style="font-size:46px;color:#d0306a">PRIYA · RANK #1</span></div>')
layer('MA', 40, mA, h0, 1.45)
pop('#mAt', .05, .3, .7); pop('#medal', .15, .3, .4)
P.frm('#MA .cf', {'y': 0}, {'y': 1500, 'rotation': 220, 'duration': 3.0, 'ease': 'none', 'stagger': .06}, 0)
P.frm('#pT', {'scale': 1.0}, {'scale': 1.06, 'duration': 1.5, 'ease': 'power1.out'}, 0)
fx(0.0, 'impact/punch', 1.2); fx(0.02, 'pro_shimmer/m2', .8)
# --- shot 2: the spelling test: ONE insert; slow push to "Wensday", the X on the buzzer, a controlled zoom on the whip
tB0, tB1 = 1.45, a01e - .9
tCut = tB1 + .25                       # cut to the set on the existing kick (2.82 s)
paper = (f'<div id="ppr" class="abs" style="left:90px;top:300px;width:900px;height:1180px;background:#fdfdf6;border-radius:10px;box-shadow:0 30px 60px rgba(0,0,0,.5);transform-origin:420px 600px;'
         f'background-image:repeating-linear-gradient(180deg,transparent 0 78px,#9cc3ff 78px 81px);">'
         f'<div class="abs" style="left:70px;top:0;width:4px;height:1180px;background:#ff8a8a"></div>'
         f'<div class="abs hand" style="left:110px;top:60px;font-size:54px;color:#223">SPELLING TEST</div>'
         f'<div class="abs hand" style="left:560px;top:66px;font-size:44px;color:#223">Name: Ankush</div>'
         f'<div class="abs hand" style="left:110px;top:230px;font-size:48px;color:#556">5. Tuesday ✓</div>'
         f'<div class="abs hand" style="left:110px;top:390px;font-size:48px;color:#556">6. Monday ✓</div>'
         f'<div id="wens" class="abs hand" style="left:110px;top:540px;font-size:92px;color:#1b2a6b">7. Wensday</div>'
         f'<div id="xmark" class="abs" style="left:450px;top:470px;font:900 240px Inter;color:{RED};opacity:0;transform:rotate(-8deg)">✗</div></div>')
mB = f'<div class="abs" style="inset:0;background:#20283a"></div>{paper}'
layer('MB', 41, mB, tB0, tCut)
P.frm('#MB', {'x': 1080}, {'x': 0, 'duration': .22, 'ease': 'power3.out', 'immediateRender': False}, tB0)          # slide in from Priya's shot
P.frm('#MA', {'x': 0}, {'x': -1080, 'duration': .22, 'ease': 'power3.out', 'immediateRender': False}, tB0)
P.frm('#ppr', {'scale': 1.0}, {'scale': 1.18, 'duration': .5, 'ease': 'power1.inOut', 'immediateRender': False}, tB0 + .05)
P.frm('#xmark', {'opacity': 0, 'scale': 2.4}, {'opacity': 1, 'scale': 1, 'duration': .16, 'ease': 'power4.in', 'immediateRender': False}, tB0 + .34); fx(tB0 + .5, 'impact/punch', 1.0); sfx(tB0 + .5, 'buzzer', .9)
P.to('#ppr', {'scale': 1.75, 'duration': .3, 'ease': 'power3.out'}, tB0 + .95); fx(tB0 + .95, 'whoosh_fast/whip', 1)
P.to('#ppr', {'keyframes': [{'x': -8, 'duration': .04}, {'x': 7, 'duration': .04}, {'x': -4, 'duration': .04}, {'x': 0, 'duration': .05}]}, tB0 + 1.2); fx(tB0 + 1.2, 'cut_hit/punch', 1)
# --- shots 3+: the conversation on the set, matched medium shots (scale 1.3, faces at the same height)
MS = 1.3
cam(0, 'A', MS, 1080); cam(tCut, 'A', MS, 1080); ex('ankush', 'smirk', 0)
punch(tCut, 1.06); fx(tB1 + .25, 'cut_hit/kick', 1)
# one hook question for the whole exchange (top, mobile-safe), nothing else on screen with it
lid, html = lab('WHY DOES SHE LIKE HIM?', 0, 210, 66, '#000', '#fff', -2, 'hq'); P.add(f'<div id="HQ" class="abs" style="inset:0;z-index:30;display:flex;justify-content:center">{html.replace("left:0px;", "")}</div>')
pop('#hq', tCut + .05, .25, .7); out('#hq', v0('scratch') - .05)
# p01: Priya medium shot; mid-line reaction cut to the two-shot (Ankush's face falls); back to Priya
cam(s('p01') - .05, 'P', MS, 1080); ex('priya', 'deadpan', s('p01')); fx(s('p01') - .05, 'whoosh_fast/tight', .7)
tr = s('p01') + 1.25
cam(tr, None); ex('ankush', 'hurt', tr)
cam(tr + .75, 'P', MS, 1080)
# a02: Ankush medium shot, smirk; small punch-in on "you're still here"
cam(s('a02') - .03, 'A', MS, 1080); ex('ankush', 'smirk', s('a02')); punch(s('a02') + .9)
# record scratch: freeze on Priya (same framing, slight push), the only label is the punchline
ts = v0('scratch')
cam(ts - .05, 'P', 1.45, 1100); ex('priya', 'stunned', ts - .05); sfx(ts - .05, 'scratch', 1.2)
P.add(f'<div id="FRZ" class="abs" style="inset:0;z-index:31;opacity:0;background:rgba(0,0,0,.25);backdrop-filter:saturate(.2)"></div>')
show('#FRZ', ts, v1('scratch'))
lid, html = lab('...SHE IS STILL HERE.', 160, 1360, 62, '#fff', '#000', 2, 'frzt'); P.add(f'<div id="FRZT" class="abs" style="inset:0;z-index:32">{html}</div>'); pop('#frzt', ts + .02, .18); out('#frzt', v1('scratch'))
# title slam
tt = v0('title')
title = (f'<div class="abs" style="inset:0;background:{INK}"></div>{halftone}'
         f'<div id="ti1" class="abs" style="left:0;width:1080px;top:560px;text-align:center;font:900 118px/1 Inter;color:#fff;letter-spacing:-.02em">WHY SMART<br>GIRLS FALL FOR</div>'
         f'<div id="ti2" class="abs" style="left:0;width:1080px;top:830px;text-align:center;font:900 230px/1 Inter;color:{YEL};-webkit-text-stroke:8px #000;paint-order:stroke fill;transform:rotate(-3deg)">"DUMB"</div>'
         f'<div id="ti3" class="abs" style="left:0;width:1080px;top:1090px;text-align:center;font:900 150px/1 Inter;color:#fff">BOYS</div>'
         f'<div id="ti4" class="abs lbl" style="left:330px;top:1290px;font-size:40px;color:#000;background:{TEAL}">TOON THEORY · EP 1</div>')
layer('TITLE', 45, title, tt, v1('title'))
pop('#ti1', tt, .18, 1.6, 'power4.in'); pop('#ti2', tt + .14, .2, 2.2, 'power4.in'); pop('#ti3', tt + .26, .18, 1.6, 'power4.in'); pop('#ti4', tt + .4, .2)
fx(tt + .14, 'impact/deep', 1.4); shake('#TITLE', tt + .3, 6, 16)

# ================================================================= EVIDENCE (scorecard)
ev0 = MK['EVID']
cam(ev0, None); ex('priya', 'neutral', ev0); ex('ankush', 'smile', ev0)
folder = (f'<div id="fold" class="abs" style="left:70px;top:150px;width:940px;height:640px;z-index:1">'
          f'<div class="abs" style="left:0;top:40px;width:940px;height:600px;background:#e9b864;border:6px solid #000;border-radius:18px"></div>'
          f'<div class="abs" style="left:40px;top:0;width:320px;height:70px;background:#e9b864;border:6px solid #000;border-bottom:none;border-radius:18px 18px 0 0"></div>'
          f'<div class="abs" style="left:60px;top:150px;width:820px;text-align:center;font:900 76px/1.05 Inter;color:#3b2508">THE ANKUSH<br>EVALUATION</div>'
          f'<div class="abs" style="left:250px;top:380px;padding:6px 26px;border:8px solid {RED};color:{RED};font:900 58px Inter;transform:rotate(-8deg)">CONFIDENTIAL</div></div>')
rows = [('ACADEMICS', '2/10', 'r1'), ('PUNCTUALITY', '3/10', 'r2'), ('COMMON SENSE', 'ERROR', 'r3'), ('MAKES HER LAUGH', '10/10', 'r4'), ('HANDSOME', '✓✓✓', 'r5')]
sheet = (f'<div id="sheet" class="card" style="left:60px;top:100px;width:960px;height:610px;opacity:0;padding:0">'
         f'<div class="abs" style="left:40px;top:28px;font:900 50px Inter;letter-spacing:.02em">THE ANKUSH EVALUATION</div>'
         f'<div class="abs" style="left:40px;top:92px;font:700 26px Inter;color:#7a6a7a;letter-spacing:.2em">OFFICIAL · DEFINITELY SCIENTIFIC</div>'
         f'<div class="abs" style="left:40px;top:136px;width:880px;height:5px;background:{INK}"></div>')
for i, (k, v, rid) in enumerate(rows):
    y = 160 + i * 86
    col = RED if i < 3 else ('#11a36b' if i == 3 else '#3b5bff')
    font = "font:900 42px Inter" if i < 4 else "font:700 56px 'Caveat',cursive"
    sheet += (f'<div id="{rid}" class="abs" style="left:40px;top:{y}px;width:880px;height:80px;opacity:0">'
              f'<div class="abs" style="left:0;top:14px;{font};color:{INK if i<4 else "#3b5bff"}">{k}</div>'
              f'<div id="{rid}v" class="abs" style="right:0;top:0;font:900 62px Inter;color:{col};{"font-family:Caveat,cursive;" if i==4 else ""}">{v}</div>'
              f'<div class="abs" style="left:0;top:78px;width:880px;height:3px;background:#d8cfc0"></div></div>')
sheet += (f'<div id="stamp1" class="abs" style="left:520px;top:150px;padding:4px 24px;border:9px solid {RED};color:{RED};font:900 70px Inter;transform:rotate(-12deg);opacity:0">FAIL</div></div>')
P.add(f'<div id="SC" class="abs" style="left:0;top:0;width:1080px;height:1000px;z-index:30;opacity:0">{folder}{sheet}</div>')
P.st('#SC', {'opacity': 1}, ev0)
P.frm('#fold', {'y': -900, 'rotation': -6}, {'y': 0, 'rotation': 0, 'duration': .35, 'ease': 'back.out(1.6)'}, ev0); fx(ev0, 'whoosh_fast/heavy', .9)
P.to('#fold', {'opacity': 0, 'scale': 1.15, 'duration': .2}, s('p02') + 1.1); P.frm('#sheet', {'opacity': 0, 'scale': .8}, {'opacity': 1, 'scale': 1, 'duration': .25, 'ease': 'back.out(2)'}, s('p02') + 1.1)
fx(s('p02') + 1.1, 'swipe/paper', 1.1)
ta = v0('acad')
P.st('#r1', {'opacity': 1}, ta - .45); sfx(ta - .05, 'stamp', 1.1); pop('#r1v', ta - .05, .15, 2.4, 'power4.in'); sfx(ta + .15, 'buzzer', .7); shake('#sheet', ta, 4, 10)
ex('priya', 'deadpan', ta); ex('ankush', 'hurt', s('a03'))
cam(s('a03'), 'A', 1.25, 1260)
cam(s('p03') - .03, 'P', 1.25, 1300); ex('priya', 'deadpan', s('p03'))
tr = v0('rows')
cam(tr, None); P.st('#r2', {'opacity': 1}, tr); sfx(tr + .05, 'stamp', 1); pop('#r2v', tr + .05, .15, 2.4, 'power4.in')
P.st('#r3', {'opacity': 1}, tr + .5); pop('#r3v', tr + .55, .12, 1.4); fx(tr + .55, 'glitch/burst', .9)
P.to('#r3v', {'keyframes': [{'x': -8, 'skewX': 20, 'duration': .04}, {'x': 10, 'skewX': -20, 'color': '#00e5ff', 'duration': .04}, {'x': 0, 'skewX': 0, 'color': RED, 'duration': .05}] * 3}, tr + .6)
ex('ankush', 'worried', tr + .1)
# a04 "Add handsome." lean-in punch
cam(s('a04') - .03, 'A', 1.35, 1250); ex('ankush', 'smirk', s('a04')); sfx(s('a04') + .2, 'boing', .8); punch(s('a04') + .1, 1.08)
cam(s('p04') - .03, 'P', 1.3, 1300); ex('priya', 'deadpan', s('p04'))
lid, html = lab('SCIENTIFIC™', 560, 1400, 50, '#000', TEAL, 4, 'sci1'); P.add(f'<div class="abs" style="inset:0;z-index:31">{html}</div>'); pop('#sci1', s('p04') + .8, .2); out('#sci1', e('p04') + .2)
# a05 science has eyes
cam(s('a05') - .03, 'A', 1.45, 1230); ex('ankush', 'smile', s('a05'))
eyes = ('<svg viewBox="0 0 260 120" width="260" height="120"><ellipse cx="65" cy="60" rx="58" ry="50" fill="#fff" stroke="#000" stroke-width="7"/><ellipse cx="195" cy="60" rx="58" ry="50" fill="#fff" stroke="#000" stroke-width="7"/>'
        '<circle class="pup" cx="80" cy="66" r="22" fill="#000"/><circle class="pup" cx="210" cy="66" r="22" fill="#000"/></svg>')
P.add(f'<div id="EYES" class="abs" style="left:410px;top:740px;z-index:31;opacity:0">{eyes}<div class="abs lbl" style="left:-130px;top:140px;font-size:56px;color:#000;background:{YEL};transform:rotate(-3deg)">SCIENCE HAS EYES</div></div>')
pop('#EYES', s('a05') + .2, .25, .3); out('#EYES', e('a05') + .25); fx(s('a05') + .2, 'pro_pop/boop', 1)
P.to('#EYES .pup', {'x': -24, 'duration': .15, 'yoyo': True, 'repeat': 3}, s('a05') + .5)
P.to('#SC', {'opacity': 0, 'y': -200, 'duration': .25}, MK['PROB'] - .1)

# ================================================================= PROBLEM (desk + cat video)
pb0 = MK['PROB']
notes = ''.join(f'<div class="abs" style="left:{x}px;top:{y}px;width:260px;height:330px;background:{c};transform:rotate({r}deg);border:4px solid #000;border-radius:6px;'
                f'background-image:repeating-linear-gradient(180deg,transparent 0 36px,rgba(80,110,200,.35) 36px 38px)"></div>'
                for x, y, r, c in [(-20, 1330, -12, '#fff'), (40, 1380, 8, '#fffbe0'), (720, 1340, 10, '#fff'), (800, 1400, -6, '#e8f6ff'), (600, 1450, 4, '#fff')])
lamp = (f'<div class="abs" style="left:780px;top:520px;width:600px;height:900px;background:radial-gradient(ellipse at 30% 10%,rgba(255,220,140,.55),transparent 60%)"></div>'
        f'<svg class="abs" style="left:820px;top:430px" width="220" height="1100" viewBox="0 0 220 1100"><path d="M60 0 L200 0 L170 110 L30 110 Z" fill="{TEAL}" stroke="#000" stroke-width="7"/><rect x="105" y="110" width="16" height="980" fill="#333" stroke="#000" stroke-width="4"/></svg>')
deskbg = (f'<div class="abs" style="inset:0;background:linear-gradient(180deg,#1a2347,#2b2d5c 50%,#3a2a4f)"></div>'
          f'<div class="abs" style="left:60px;top:150px;width:380px;height:300px;border:10px solid #111;border-radius:10px;background:linear-gradient(180deg,#0b1030,#27306b)">'
          + ''.join(f'<i class="abs" style="left:{random.randint(10,350)}px;top:{random.randint(10,270)}px;width:4px;height:4px;border-radius:50%;background:#fff;opacity:.8"></i>' for _ in range(20)) + '</div>'
          f'<div class="abs" style="left:520px;top:180px;font:900 70px Inter;color:#ff6b6b;font-variant-numeric:tabular-nums" id="clk">11:47 PM</div>'
          f'<div class="abs lbl" style="left:500px;top:290px;font-size:38px;color:#fff;background:{RED}">ASSIGNMENT DUE 9 AM</div>' + lamp)
laptop = (f'<div class="abs" style="left:160px;top:1300px;width:760px;height:60px;background:#b9bfd0;border:6px solid #000;border-radius:0 0 30px 30px;z-index:24"></div>'
          f'<div class="abs" style="left:230px;top:960px;width:620px;height:350px;background:#1d2030;border:12px solid #b9bfd0;outline:6px solid #000;border-radius:16px;z-index:23;transform:perspective(900px) rotateX(-8deg)">'
          + ''.join(f'<div class="abs" style="left:30px;top:{30+i*40}px;width:{random.randint(260,520)}px;height:14px;border-radius:7px;background:rgba(255,255,255,{.25 if i%3 else .5})"></div>' for i in range(7)) + '</div>')
phone_inner = (f'<div class="abs" style="left:0;top:0;width:100%;height:110px;background:#111;color:#fff;font:800 40px/110px Inter;padding-left:30px">Ankush 🙃</div>'
               f'<div class="abs" style="left:30px;top:140px;padding:20px 28px;border-radius:30px;background:#2f6bff;color:#fff;font:800 44px Inter">LOOK AT THIS LMAOOO</div>'
               f'<div class="abs" style="left:30px;top:250px;width:440px;height:330px;border-radius:26px;background:#000;overflow:hidden"><div class="abs" style="left:170px;top:120px;width:0;height:0;border-left:90px solid #fff;border-top:55px solid transparent;border-bottom:55px solid transparent"></div></div>')
phone = f'<div id="ph" class="abs" style="left:280px;top:500px;width:520px;height:700px;background:#f4f4f8;border:14px solid #111;border-radius:50px;overflow:hidden;z-index:26;opacity:0">{phone_inner}</div>'
deskset = deskbg + char('pD', 'priya', 230, 420, 640, pb0, MK['SCI'], z=12, start='worried') + laptop + notes + f'<div class="abs" style="left:-100px;top:1350px;width:1300px;height:700px;background:linear-gradient(180deg,#8b5a36,#4a2c18);z-index:22"></div>' + phone
layer('DESK', 35, deskset, pb0, v0('cat'))
P.frm('#DESK', {'scale': 1.0}, {'scale': 1.06, 'duration': v0('cat') - pb0, 'ease': 'none', 'transformOrigin': '540px 900px'}, pb0)
ex('priya', 'worried', pb0); fx(pb0, 'whoosh_big/thump', .8)
tphone = s('p05') + 1.75
P.frm('#ph', {'opacity': 0, 'y': 500, 'rotation': 12}, {'opacity': 1, 'y': 0, 'rotation': -3, 'duration': .3, 'ease': 'back.out(1.6)'}, tphone); fx(tphone, 'notify/mid_tine', 1.1)
P.to('#ph', {'x': 8, 'duration': .04, 'yoyo': True, 'repeat': 7}, tphone + .32)
ex('priya', 'deadpan', tphone + .2)
# --- the cat video (full-screen phone video, original drawn cat)
tc0, tc1 = v0('cat'), e('x_snort')
catsvg = ('<svg viewBox="0 0 300 260" width="300" height="260"><g stroke="#000" stroke-width="7" stroke-linejoin="round">'
          '<path d="M60 200 Q40 120 100 100 L230 100 Q280 110 270 200 Z" fill="#f2a65a"/>'
          '<path d="M250 140 Q300 100 290 40" fill="none" stroke-width="14" stroke="#000"/><path d="M250 140 Q300 100 290 40" fill="none" stroke-width="8" stroke="#f2a65a"/>'
          '<circle cx="95" cy="95" r="58" fill="#f2a65a"/><path d="M50 60 L45 10 L85 45 Z" fill="#f2a65a"/><path d="M140 60 L145 10 L108 45 Z" fill="#f2a65a"/>'
          '<ellipse id="ceL" cx="75" cy="92" rx="11" ry="15" fill="#fff"/><ellipse cx="115" cy="92" rx="11" ry="15" fill="#fff"/><circle cx="77" cy="95" r="6" fill="#000"/><circle cx="117" cy="95" r="6" fill="#000"/>'
          '<path d="M88 112 Q95 120 102 112" fill="none" stroke-width="5"/></g></svg>')
catv = (f'<div class="abs" style="inset:0;background:#000"></div>'
        f'<div id="cvid" class="abs" style="left:0;top:180px;width:1080px;height:1300px;overflow:hidden;background:linear-gradient(180deg,#d9c7a8,#bfa57e)">'
        f'<div class="abs" style="left:0;top:880px;width:1080px;height:420px;background:#8f6b45"></div>'
        f'<div class="abs" style="left:80px;top:520px;width:760px;height:360px;background:#6d4fb8;border:8px solid #000;border-radius:60px 60px 20px 20px"></div>'
        f'<div class="abs" style="left:640px;top:440px;width:260px;height:440px;background:#5a3fa0;border:8px solid #000;border-radius:80px 80px 20px 20px"></div>'
        f'<div id="cat" class="abs" style="left:620px;top:200px;transform-origin:150px 220px">{catsvg}</div>'
        f'<div id="thud" class="abs" style="left:640px;top:820px;font:900 110px Inter;color:#fff;-webkit-text-stroke:8px #000;paint-order:stroke fill;opacity:0;transform:rotate(-8deg)">THUD.</div>'
        f'<div class="abs" style="left:30px;top:30px;font:800 34px Inter;color:#fff;background:rgba(0,0,0,.5);padding:6px 14px;border-radius:8px">▶ cat_fail_final_FINAL.mp4</div>'
        f'<div class="abs" style="left:0;bottom:0;width:1080px;height:14px;background:rgba(255,255,255,.3)"><div id="cbar" class="abs" style="left:0;top:0;height:14px;width:0;background:{RED}"></div></div></div>')
layer('CAT', 36, catv, tc0, tc1)
P.frm('#cbar', {'width': 0}, {'width': 1080, 'duration': tc1 - tc0, 'ease': 'none'}, tc0)
P.to('#cat', {'x': 30, 'rotation': 8, 'duration': .25, 'ease': 'sine.inOut', 'yoyo': True, 'repeat': 1}, tc0)
P.to('#cat', {'x': 120, 'rotation': 70, 'duration': .2, 'ease': 'power2.in'}, tc0 + .5)
P.to('#cat', {'y': 560, 'rotation': 190, 'duration': .32, 'ease': 'power3.in'}, tc0 + .7)
pop('#thud', tc0 + 1.02, .15, 2); sfx(tc0 + .3, 'cat', 1.3); fx(tc0 + 1.02, 'cut_hit/punch', .8)
# split-screen: top = replay of the cat, bottom = Priya trying not to laugh (snort)
tsn = s('x_snort')
P.to('#cvid', {'y': -180, 'duration': .2, 'ease': 'power3.out'}, tsn)
P.st('#cat', {'x': 0, 'y': 0, 'rotation': 0}, tsn); P.st('#thud', {'opacity': 0}, tsn)
P.to('#cat', {'x': 120, 'rotation': 70, 'duration': .2, 'ease': 'power2.in'}, tsn + .3)
P.to('#cat', {'y': 560, 'rotation': 190, 'duration': .3, 'ease': 'power3.in'}, tsn + .5)
P.to('#cat', {'opacity': 0, 'duration': .01}, tsn + .85); P.st('#cat', {'x': 0, 'y': 0, 'rotation': 0, 'opacity': 1}, tsn + 1.1)
P.to('#cat', {'x': 120, 'rotation': 70, 'duration': .2, 'ease': 'power2.in'}, tsn + 1.3); P.to('#cat', {'y': 560, 'rotation': 190, 'duration': .3, 'ease': 'power3.in'}, tsn + 1.5)
snb = (f'<div class="abs" style="left:0;top:830px;width:1080px;height:1090px;overflow:hidden;background:linear-gradient(180deg,#2a2d5c,#3a2a4f)">'
       + char('pS', 'priya', 90, -30, 900, tsn, tc1, z=2, start='worried') +
       f'<div id="snl" class="abs lbl" style="left:120px;top:60px;font-size:60px;color:#000;background:{YEL};transform:rotate(-3deg);z-index:5;opacity:0">SNORT DETECTED</div></div>'
       f'<div class="abs" style="left:0;top:820px;width:1080px;height:12px;background:#000"></div>')
layer('SNB', 37, snb, tsn, tc1)
P.frm('#SNB', {'y': 1100}, {'y': 0, 'duration': .2, 'ease': 'power3.out'}, tsn)
ex('priya', 'worried', tsn); ex('priya', 'smirk', tsn + .6); ex('priya', 'laugh', tsn + 1.45); pop('#snl', tsn + 1.5, .18, 1.8, 'power4.in'); punch(tsn + 1.45, 1.1)
P.to('#pS', {'y': 14, 'duration': .06, 'yoyo': True, 'repeat': 5}, tsn + 1.45); fx(tsn + 1.5, 'cut_hit/kick', .9)
# CAUGHT! (back on set, Ankush smash zoom + flash + freeze circle on Priya's nose)
cam(s('a06') - .02, 'A', 1.7, 1060); ex('ankush', 'laugh', s('a06')); flash(s('a06'), '#fff', .9); fx(s('a06'), 'shutter/dslr', 1.1); shake('#SETW', s('a06') + .05, 5, 18)
lid, html = lab('CAUGHT!', 330, 300, 140, '#fff', RED, -6, 'cgt'); P.add(f'<div class="abs" style="inset:0;z-index:31">{html}</div>'); pop('#cgt', s('a06'), .15, 2.4, 'power4.in'); out('#cgt', e('a06') + .3)
cam(s('p06') - .03, 'P', 1.45, 1150); ex('priya', 'deadpan', s('p06'))
cam(s('a07') - .03, 'P', 1.9, 1120); ex('priya', 'worried', s('a07'))  # stay on Priya: Ankush's line is about her nose
ring = (f'<div id="ring" class="abs" style="left:470px;top:1175px;width:180px;height:150px;border:10px solid {RED};border-radius:50%;opacity:0;z-index:33"></div>'
        f'<div id="ringt" class="abs lbl" style="left:120px;top:1440px;font-size:52px;color:#fff;background:{RED};transform:rotate(-2deg);opacity:0;z-index:33">EXHIBIT B: THE NOSE</div>')
P.add(f'<div class="abs" style="inset:0;z-index:33">{ring}</div>')
pop('#ring', s('a07') + .15, .2, 1.8); pop('#ringt', s('a07') + .3, .2); out('#ring', e('a07') + .1); out('#ringt', e('a07') + .1); fx(s('a07') + .15, 'pro_pop/thup', 1)
cam(s('p07') - .03, None); ex('priya', 'laugh', s('p07')); ex('ankush', 'laugh', s('p07')); punch(s('p07'), 1.05)

# ================================================================= SCIENCE
sc0 = MK['SCI']
# freeze: cat frame freezes, scan-lines transform into a research card
frz = (f'<div class="abs" style="inset:0;background:#0e1430"></div>'
       f'<div class="abs" style="inset:0;background:repeating-linear-gradient(0deg,rgba(47,230,208,.12) 0 2px,transparent 2px 40px),repeating-linear-gradient(90deg,rgba(47,230,208,.12) 0 2px,transparent 2px 40px)"></div>'
       f'<div id="frc" class="abs" style="left:240px;top:420px;transform:scale(1.6);filter:grayscale(1) contrast(1.3)">{catsvg}</div>'
       f'<div id="frs" class="abs" style="left:0;top:0;width:1080px;height:120px;background:linear-gradient(180deg,transparent,rgba(47,230,208,.6),transparent)"></div>'
       f'<div class="abs lbl" style="left:300px;top:1100px;font-size:56px;color:#000;background:{TEAL}">ANALYSING HUMOUR…</div>')
layer('FRZ2', 38, frz, sc0, s('p08') + .5)
P.frm('#frs', {'y': -100}, {'y': 1900, 'duration': .7, 'ease': 'none'}, sc0); fx(sc0, 'pro_riser/nblips', .9); fx(sc0 + .02, 'glitch/data', .7)
P.to('#FRZ2', {'opacity': 0, 'scale': 1.3, 'duration': .3}, s('p08') + .2)
cam(sc0, 'P', 1.2, 1300); ex('priya', 'neutral', sc0); ex('ankush', 'neutral', sc0)
# research card 1 (top zone) + diagram
r1 = (f'<div id="rc1" class="card" style="left:50px;top:150px;width:980px;height:720px;opacity:0">'
      f'<div class="abs" style="left:36px;top:26px;font:900 30px Inter;letter-spacing:.18em;color:#7a3bff">THE STUDY</div>'
      f'<div class="abs" style="left:36px;top:70px;font:900 54px Inter">400 students</div>'
      f'<div class="abs" style="left:36px;top:140px;font:700 32px Inter;color:#5b4b5b">wrote captions for cartoons + took intelligence tests</div>'
      # cartoon panel with blank caption
      f'<div id="cpan" class="abs" style="left:36px;top:210px;width:320px;height:300px;border:6px solid #000;background:#fff;border-radius:8px;overflow:hidden"><div class="abs" style="left:40px;top:40px;transform:scale(.8);transform-origin:0 0">{catsvg}</div>'
      f'<div class="abs" style="left:0;bottom:0;width:100%;height:56px;border-top:5px solid #000;background:#fffbe0"></div><div id="cpen" class="abs hand" style="left:16px;bottom:8px;font-size:30px">"I meant to do that."</div></div>'
      # association arrow
      f'<div id="b1" class="abs" style="left:400px;top:220px;width:540px;height:120px;border-radius:20px;background:{TEAL};border:5px solid #000;font:900 38px/1.05 Inter;padding:16px 22px">VERBAL + GENERAL<br>INTELLIGENCE ↑</div>'
      f'<div id="b2" class="abs" style="left:640px;top:350px;font:900 80px Inter;color:#000">⇅</div>'
      f'<div id="b3" class="abs" style="left:400px;top:450px;width:540px;height:120px;border-radius:20px;background:{YEL};border:5px solid #000;font:900 38px/1.05 Inter;padding:16px 22px">FUNNIER CARTOON<br>CAPTIONS ↑</div>'
      f'<div id="b4" class="abs lbl" style="left:36px;top:600px;font-size:40px;color:#fff;background:{INK}">AN ASSOCIATION — NOT A GUARANTEE</div></div>')
P.add(f'<div id="R1" class="abs" style="inset:0;z-index:30;opacity:0">{r1}<div id="cite1" class="cite">Greengross &amp; Miller (2011) · Intelligence 39(4)</div></div>')
t8 = s('p08'); P.st('#R1', {'opacity': 1}, t8)
P.frm('#rc1', {'opacity': 0, 'y': -60, 'rotation': -3}, {'opacity': 1, 'y': 0, 'rotation': 0, 'duration': .3, 'ease': 'back.out(1.8)'}, t8 + .2); fx(t8 + .2, 'swipe/paper', 1)
P.st('#cite1', {'opacity': 1}, t8 + .3)
w400 = t8 + CL['p08']['dur'] * .33
for i, (sel, tt_) in enumerate([('#b1', w400 + .5), ('#b2', w400 + 1.3), ('#b3', w400 + 1.9), ('#b4', e('p08') - .6)]):
    pop(sel, tt_, .22); fx(tt_, 'pro_pop/bloop', .8)
P.frm('#cpen', {'clipPath': 'inset(0 100% 0 0)'}, {'clipPath': 'inset(0 0% 0 0)', 'duration': .9, 'ease': 'none'}, e('p08') - 1.2)
cam(t8 + 3.5, 'P', 1.35, 1350); punch(w400 + 1.9, 1.04)
# a08 Ankush curious
cam(s('a08') - .03, 'A', 1.35, 1300); ex('ankush', 'worried', s('a08')); ex('priya', 'smirk', s('a08'))
P.to('#R1', {'opacity': 0, 'duration': .2}, s('p09'))
# p09: timing / language / unexpected connections icons
ic = [('TIMING', '⏱', TEAL), ('LANGUAGE', 'Aa', YEL), ('UNEXPECTED<br>CONNECTIONS', '↯', PINK)]
r2 = ''.join(f'<div id="ic{i}" class="card" style="left:{40+i*340}px;top:300px;width:320px;height:360px;opacity:0;background:{c}"><div class="abs" style="left:0;width:100%;top:40px;text-align:center;font:900 140px Inter">{g}</div>'
             f'<div class="abs" style="left:0;width:100%;top:230px;text-align:center;font:900 34px/1.05 Inter">{n}</div></div>' for i, (n, g, c) in enumerate(ic))
P.add(f'<div id="R2" class="abs" style="inset:0;z-index:30;opacity:0">{r2}<div class="abs lbl" style="left:180px;top:180px;font-size:50px;color:#fff;background:{INK}">A GOOD JOKE TAKES…</div></div>')
t9 = s('p09'); show('#R2', t9, v0('joke'))
cam(t9 - .03, 'P', 1.3, 1350); ex('priya', 'neutral', t9)
d9 = CL['p09']['dur']
for i, frac in enumerate([.42, .6, .78]): pop(f'#ic{i}', t9 + d9 * frac, .2, .3); fx(t9 + d9 * frac, 'pro_pop_in/round', 1)
# joke anatomy diagram (joke, a09, p10)
tj = v0('joke')
head_a = G.head_icon(G.CHARS['ankush'], 'smirk', 150)
jd = (f'<div class="abs lbl" style="left:250px;top:150px;font-size:52px;color:#fff;background:{INK}">HOW A JOKE WORKS</div>'
      f'<div id="j1" class="card" style="left:40px;top:260px;width:300px;height:250px;opacity:0;background:#fff"><div class="abs" style="left:0;width:100%;top:90px;text-align:center;font:900 46px Inter">SETUP</div></div>'
      f'<div id="j2" class="card" style="left:390px;top:260px;width:300px;height:250px;opacity:0;background:{YEL}"><div class="abs" style="left:0;width:100%;top:30px;text-align:center;font:900 40px/1.05 Inter">UNEXPECTED<br>TWIST</div>'
      f'<div id="jhead" class="abs" style="left:72px;top:110px;opacity:0">{head_a}</div></div>'
      f'<div id="j3" class="card" style="left:740px;top:260px;width:300px;height:250px;opacity:0;background:{PINK}"><div class="abs" style="left:0;width:100%;top:90px;text-align:center;font:900 44px Inter">PUNCHLINE</div>'
      f'<div id="jno" class="abs" style="left:20px;top:150px;font:900 30px Inter;color:#fff;background:#000;padding:4px 10px;border-radius:8px;transform:rotate(-4deg);opacity:0">not necessarily him</div></div>'
      f'<div id="ja1" class="abs" style="left:338px;top:350px;font:900 60px Inter;color:#fff;opacity:0">→</div><div id="ja2" class="abs" style="left:688px;top:350px;font:900 60px Inter;color:#fff;opacity:0">→</div>')
P.add(f'<div id="JK" class="abs" style="inset:0;z-index:30;opacity:0">{jd}</div>')
show('#JK', tj, s('p11') - .05)
cam(tj, None); ex('priya', 'smile', tj); ex('ankush', 'smile', tj)
for i, (sel, dt) in enumerate([('#j1', 0), ('#ja1', .15), ('#j2', .25), ('#ja2', .4), ('#j3', .5)]): pop(sel, tj + dt, .18, .4); fx(tj + dt, 'pop/%d' % i, .7)
cam(s('a09') - .03, 'A', 1.3, 1350); ex('ankush', 'smirk', s('a09'))
P.frm('#jhead', {'opacity': 0, 'x': 400, 'y': 600, 'scale': 2.5}, {'opacity': 1, 'x': 0, 'y': 0, 'scale': 1, 'duration': .3, 'ease': 'power3.out'}, s('a09') + .1); fx(s('a09') + .1, 'whoosh_fast/crisp', 1); fx(s('a09') + .4, 'pro_pop/thup', 1)
cam(s('p10') - .03, 'P', 1.3, 1350); ex('priya', 'smirk', s('p10'))
P.to('#j2', {'scale': 1.12, 'duration': .2, 'yoyo': True, 'repeat': 1}, s('p10') + .3)
pop('#jno', s('p10') + CL['p10']['dur'] * .55, .2, 2, 'power4.in'); fx(s('p10') + CL['p10']['dur'] * .55, 'cut_hit/punch', .8); ex('ankush', 'hurt', s('p10') + CL['p10']['dur'] * .6)
# research card 2: partner preference
r3 = (f'<div id="rc3" class="card" style="left:50px;top:150px;width:980px;height:720px;opacity:0">'
      f'<div class="abs" style="left:36px;top:26px;font:900 30px Inter;letter-spacing:.18em;color:#7a3bff">ANOTHER EXPERIMENT</div>'
      f'<div class="abs" style="left:36px;top:70px;font:900 46px/1.1 Inter">Women picked the funny guy<br>as a partner more often</div>'
      + ''.join(f'<div id="pf{i}" class="abs" style="left:{60+i*470}px;top:230px;width:400px;height:330px;border:6px solid #000;border-radius:20px;background:{["#eef7ff","#fff2f6"][i]};opacity:0">'
                f'<div class="abs" style="left:0;width:100%;top:20px;text-align:center;font:900 40px Inter">{["PROFILE A","PROFILE B"][i]}</div>'
                f'<div class="abs" style="left:30px;top:90px;width:340px;font:700 30px/1.25 Inter;color:#444">{["“I enjoy long walks and filing taxes.”","“I enjoy long walks… mostly to the fridge.”"][i]}</div></div>' for i in range(2)) +
      f'<div id="heart" class="abs" style="left:780px;top:430px;font:900 150px Inter;color:{RED};opacity:0">♥</div>'
      f'<div id="r3t" class="abs lbl" style="left:36px;top:600px;font-size:38px;color:#fff;background:{INK};opacity:0">ONE STUDY · ON AVERAGE · NOT A UNIVERSAL RULE</div></div>')
P.add(f'<div id="R3" class="abs" style="inset:0;z-index:30;opacity:0">{r3}<div id="cite2" class="cite">Bressler &amp; Balshine (2006) · Evolution &amp; Human Behavior</div></div>')
t11 = s('p11'); show('#R3', t11, MK['TWIST'])
cam(t11 - .03, 'P', 1.3, 1350); ex('priya', 'neutral', t11); ex('ankush', 'neutral', t11)
P.frm('#rc3', {'opacity': 0, 'x': 900}, {'opacity': 1, 'x': 0, 'duration': .3, 'ease': 'power3.out'}, t11); fx(t11, 'whoosh_fast/whip', 1); P.st('#cite2', {'opacity': 1}, t11 + .2)
pop('#pf0', t11 + .9, .2); pop('#pf1', t11 + 1.2, .2); pop('#heart', t11 + CL['p11']['dur'] * .8, .25, .2); fx(t11 + CL['p11']['dur'] * .8, 'pro_shimmer/m1', 1)
pop('#r3t', e('p11') - .1, .2)
# a10 I'M LITERALLY THE DATA
cam(s('a10') - .03, 'A', 1.55, 1250); ex('ankush', 'laugh', s('a10')); punch(s('a10') + .2, 1.1); fx(s('a10') + .2, 'cut_hit/kick', 1)
P.to('#rc3', {'opacity': 0, 'scale': .9, 'duration': .15}, s('a10'))
chart = (f'<div id="CH" class="card" style="left:90px;top:170px;width:900px;height:660px;opacity:0;background:#fff">'
         f'<div class="abs" style="left:90px;top:40px;width:6px;height:520px;background:#000"></div><div class="abs" style="left:90px;top:560px;width:760px;height:6px;background:#000"></div>'
         f'<div class="abs" style="left:110px;top:590px;font:800 28px Inter;color:#666">SAMPLE SIZE: 1 (ONE)</div>'
         f'<div id="dot" class="abs" style="left:420px;top:240px">{G.head_icon(G.CHARS["ankush"], "laugh", 130)}</div>'
         f'<div id="dotl" class="abs lbl" style="left:330px;top:440px;font-size:40px;color:#fff;background:{ORG}">ME = THE DATA</div></div>')
P.add(f'<div class="abs" style="inset:0;z-index:31">{chart}</div>')
pop('#CH', s('a10') + .1, .22, .6); out('#CH', MK['TWIST'] - .05)
P.to('#dot', {'keyframes': [{'x': random.randint(-200, 220), 'y': random.randint(-150, 160), 'duration': .09} for _ in range(30)]}, s('p12'))
P.to('#dotl', {'opacity': 0, 'duration': .1}, s('p12'))
lid, html = lab('ONE VERY NOISY DATA POINT', 150, 870, 52, '#000', YEL, -2, 'noisy'); P.add(f'<div class="abs" style="inset:0;z-index:32">{html}</div>'); pop('#noisy', s('p12') + .4, .2); out('#noisy', MK['TWIST'] - .05)
cam(s('p12') - .03, 'P', 1.3, 1350); ex('priya', 'deadpan', s('p12')); fx(s('p12') + .3, 'glitch/stutter', .6)

# ================================================================= TWIST
tw = MK['TWIST']
cam(tw, None); ex('priya', 'neutral', tw); ex('ankush', 'worried', tw)
P.st('#SC', {'opacity': 1, 'y': 0}, tw); P.st('#fold', {'opacity': 0}, tw); P.st('#sheet', {'opacity': 1, 'scale': 1}, tw)
P.st('#r4', {'opacity': 0}, 0); P.st('#r5', {'opacity': 0}, 0)
P.to('#sheet', {'keyframes': [{'x': -14, 'filter': 'hue-rotate(90deg) saturate(3)', 'duration': .05}, {'x': 16, 'filter': 'hue-rotate(-60deg)', 'duration': .05}, {'x': 0, 'filter': 'none', 'duration': .06}] * 3}, tw + .05)
fx(tw + .05, 'glitch/scramble', 1); fx(tw + .3, 'pro_glitch/framelock', .8)
P.st('#r4', {'opacity': 1}, tw + .45); P.add('<div id="cnt" style="display:none"></div>')
P.counter('#r4v', 0, 10, tw + .5, .6, "function(v){return Math.round(v)+'/10'}")
sfx(tw + .5, 'counter', 1.1); pop('#r4', tw + .45, .2, .7)
P.to('#stamp1', {'opacity': 0, 'duration': .1}, tw)
ex('ankush', 'stunned', tw + .5); ex('priya', 'worried', tw + .9)
# p13 Priya honest close-up, two different gauges
cam(s('p13') - .03, 'P', 1.35, 1350); ex('priya', 'neutral', s('p13'))
P.to('#SC', {'opacity': 0, 'duration': .2}, s('p13') + .2)
gauges = ''.join(f'<div id="g{i}" class="card" style="left:{50+i*500}px;top:220px;width:480px;height:440px;opacity:0;background:{["#e9f5ff","#fff4d6"][i]}">'
                 f'<div class="abs" style="left:0;width:100%;top:30px;text-align:center;font:900 40px/1.05 Inter">{["BOOK SMART","FUNNY"][i]}</div>'
                 f'<svg class="abs" style="left:60px;top:120px" width="360" height="220" viewBox="0 0 360 220"><path d="M30 200 A150 150 0 0 1 330 200" fill="none" stroke="#000" stroke-width="22"/><path d="M30 200 A150 150 0 0 1 330 200" fill="none" stroke="{["#3b8bff","#ff9f1c"][i]}" stroke-width="14"/>'
                 f'<g id="nd{i}" style="transform-origin:180px 200px"><path d="M180 200 L180 70" stroke="#000" stroke-width="12" stroke-linecap="round"/></g><circle cx="180" cy="200" r="16" fill="#000"/></svg>'
                 f'<div class="abs" style="left:0;width:100%;top:350px;text-align:center;font:800 30px Inter;color:#555">{["grades, tests","timing, wordplay"][i]}</div></div>' for i in range(2))
P.add(f'<div id="GA" class="abs" style="inset:0;z-index:30;opacity:0">{gauges}<div id="neq" class="abs" style="left:478px;top:360px;font:900 110px Inter;color:#fff;-webkit-text-stroke:6px #000;paint-order:stroke fill;opacity:0">≠</div>'
      f'<div id="weak" class="abs lbl" style="left:120px;top:720px;font-size:46px;color:#fff;background:{PINK};opacity:0;transform:rotate(-2deg)">WEAKNESS: TERRIBLE JOKES</div></div>')
t13 = s('p13'); d13 = CL['p13']['dur']; show('#GA', t13 + .2, e('a11') - .1)
pop('#g0', t13 + .35, .22); pop('#g1', t13 + d13 * .28, .22); pop('#neq', t13 + d13 * .42, .2, 2); fx(t13 + d13 * .42, 'cut_hit/punch', .9)
P.frm('#nd0', {'rotation': -70}, {'rotation': 60, 'duration': .6, 'ease': 'back.out(2)'}, t13 + .5); P.frm('#nd1', {'rotation': -70}, {'rotation': 40, 'duration': .6, 'ease': 'back.out(2)'}, t13 + d13 * .3)
pop('#weak', t13 + d13 * .72, .2); ex('priya', 'smile', t13 + d13 * .62); fx(t13 + d13 * .72, 'pro_pop/boop', .9)
# a11 sneaky; grab notebook
cam(s('a11') - .03, 'A', 1.35, 1300); ex('ankush', 'smirk', s('a11'))
tg = v0('grab')
nb_cover = (f'<div id="nbc" class="abs" style="left:240px;top:260px;width:600px;height:780px;background:#2f6b5a;border:8px solid #000;border-radius:18px;box-shadow:0 30px 60px rgba(0,0,0,.6)">'
            f'<div class="abs" style="left:70px;top:140px;width:460px;height:200px;background:#fffbe9;border:5px solid #000;border-radius:10px;text-align:center;font:900 54px/1.2 Inter;padding-top:30px">PRIYA<br><span style="font-size:36px">CHEMISTRY NOTES</span></div></div>')
P.add(f'<div id="NBC" class="abs" style="inset:0;z-index:36;opacity:0">{nb_cover}</div>')
show('#NBC', tg, s('a12') + .1)
P.frm('#nbc', {'x': -900, 'rotation': -40}, {'x': 0, 'rotation': 4, 'duration': .3, 'ease': 'power3.out'}, tg); fx(tg, 'whoosh_fast/heavy', 1.1); ex('priya', 'stunned', tg)
# notebook open (full screen)
nbpages = [("I'd tell you a chemistry joke,<br>but I wouldn't get a reaction.", '⚗'), ('Never trust atoms.<br>They make up everything.', '⚛'),
           ("I'm reading a book on anti-gravity.<br>I can't put it down.", '📖'), ('Chemists have all<br>the solutions.', '🧪'), ('Mitochondria? More like<br>MIGHTY-chondria.', '💪')]
nb = (f'<div class="abs" style="inset:0;background:#20283a"></div>'
      f'<div id="nbp" class="abs" style="left:40px;top:170px;width:1000px;height:1300px;background:#fffdf3;border:8px solid #000;border-radius:16px;'
      f'background-image:repeating-linear-gradient(180deg,transparent 0 86px,#a9c8ff 86px 89px);overflow:hidden">'
      f'<div class="abs" style="left:90px;top:0;width:5px;height:1300px;background:#ff9a9a"></div>')
for i, (txt, ic_) in enumerate(nbpages):
    nb += (f'<div id="pg{i}" class="abs" style="left:0;top:0;width:1000px;height:1300px;opacity:{1 if i==0 else 0}">'
           f'<div class="abs hand" style="left:130px;top:{150 if i==0 else 120}px;font-size:60px;line-height:89px;color:#1b2a6b">{txt}</div>'
           f'<div class="abs hand" style="left:600px;top:{520 if i==0 else 420}px;font-size:46px;color:#d0306a;transform:rotate(-6deg)">hehe</div></div>')
nb += (f'</div><div id="pgc" class="abs lbl" style="left:640px;top:1380px;font-size:48px;color:#000;background:{YEL}">PAGE 1 OF 47</div>')
P.add(f'<div id="NB" class="abs" style="inset:0;z-index:37;opacity:0">{nb}</div>')
tnb0, tnb1 = s('a12'), e('a14') - .3
show('#NB', tnb0, tnb1)
P.frm('#nbp', {'scale': .7, 'rotation': -4}, {'scale': 1, 'rotation': 0, 'duration': .3, 'ease': 'back.out(1.5)'}, tnb0); fx(tnb0, 'swipe/paper', 1.2)
P.frm('#nbp', {'scale': 1}, {'scale': 1.06, 'duration': e('a12') - tnb0 - .3, 'ease': 'none', 'immediateRender': False}, tnb0 + .3)
# silence beat: hold on the joke (music stops), then page flips
tsil = v0('silence')
P.to('#nbp', {'scale': 1.25, 'duration': v1('silence') - tsil, 'ease': 'power1.inOut'}, tsil)
tfl = s('a13') + .55
for i in range(1, 5):
    tt_ = tfl + (i - 1) * .32
    P.st(f'#pg{i-1}', {'opacity': 0}, tt_); P.st(f'#pg{i}', {'opacity': 1}, tt_); fx(tt_, 'swipe/paper', .9)
    P.frm('#nbp', {'rotationY': -25, 'scale': 1.0}, {'rotationY': 0, 'scale': 1.0, 'duration': .2, 'transformPerspective': 1200, 'immediateRender': False}, tt_)
P.counter('#pgc', 1, 47, tfl, 1.3, "function(v){return 'PAGE '+Math.round(v)+' OF 47'}")
# a14 PRIYA?! back on set (shock), p14 give it back
cam(s('a14') - .05, 'A', 1.5, 1250); ex('ankush', 'laugh', s('a14')); punch(s('a14'), 1.1); fx(s('a14'), 'cut_hit/kick', 1)
cam(s('p14') - .03, 'P', 1.45, 1250); ex('priya', 'worried', s('p14')); P.to('#SET', {'x': '-=40', 'duration': .12, 'yoyo': True, 'repeat': 1}, s('p14') + .1); fx(s('p14'), 'whoosh_fast/tight', 1)

# ================================================================= PAYOFF
py = MK['PAY']
cam(py - .05, None); ex('priya', 'smirk', py); ex('ankush', 'smile', py)
P.to('#SETW', {'filter': 'saturate(1.15) brightness(1.06)', 'duration': .8}, py)
cam(s('a15') + .2, 'A', 1.15, 1200, d=CL['a15']['dur'] - .2, ease='none')
cam(s('p15') - .03, 'P', 1.35, 1300); ex('priya', 'smirk', s('p15'))
cam(s('a16') - .03, None); ex('ankush', 'smirk', s('a16'))
# scorecard returns with HANDSOME scribbled in
th = v0('handsome')
P.st('#SC', {'opacity': 1, 'y': 0}, s('a16') + .5); P.frm('#sheet', {'y': -700}, {'y': 0, 'duration': .3, 'ease': 'back.out(1.5)', 'immediateRender': False}, s('a16') + .5); fx(s('a16') + .5, 'whoosh_fast/crisp', 1)
P.st('#r5', {'opacity': 1}, th); P.frm('#r5', {'clipPath': 'inset(0 100% 0 0)'}, {'clipPath': 'inset(0 0% 0 0)', 'duration': .45, 'ease': 'none', 'immediateRender': False}, th); fx(th, 'pro_typing_run/soft', .6)
P.to('#sheet', {'scale': 1.07, 'transformOrigin': '50% 100%', 'duration': .3, 'ease': 'power3.out'}, th + .1); sfx(th + .4, 'boing', .9)
cam(s('p16') - .03, 'P', 1.5, 1300); ex('priya', 'stunned', s('p16')); shake('#SETW', s('p16') + .3, 4, 10)
P.to('#SC', {'opacity': 0, 'duration': .2}, s('a17'))
cam(s('a17') - .03, 'A', 1.4, 1250, ); ex('ankush', 'smirk', s('a17'))
pop('#EYES', s('a17') + .3, .25, .3); P.to('#EYES', {'opacity': 0, 'duration': .15}, e('a17') + .1)
te = v0('eyeroll')
cam(te - .03, 'P', 1.5, 1250); ex('priya', 'deadpan', te); P.to('#P_head', {'rotation': -8, 'svgOrigin': '0 -468', 'duration': .3, 'yoyo': True, 'repeat': 1}, te + .05); fx(te + .05, 'swish/soft', .8)
ex('priya', 'smile', te + .5)
lid, html = lab("(she's smiling)", 600, 1380, 46, '#000', '#fff', 3, 'smil'); P.add(f'<div class="abs" style="inset:0;z-index:31">{html}</div>'); pop('#smil', te + .55, .2); out('#smil', s('a18'))
# p17 to camera
cam(s('p17') - .03, 'P', 1.25, 1300, ); cam(s('p17') + .1, 'P', 1.4, 1280, d=CL['p17']['dur'], ease='none'); ex('priya', 'smile', s('p17'))
rep = (f'<div id="rep" class="card" style="left:200px;top:220px;width:680px;height:420px;opacity:0;background:#fffbe9;transform:rotate(-3deg)">'
       f'<div class="abs" style="left:0;width:100%;top:30px;text-align:center;font:900 46px Inter">REPORT CARD</div>'
       f'<div class="abs" style="left:50px;top:120px;font:800 36px Inter;color:#555">Academics ........ 2/10</div>'
       f'<div id="rst" class="abs" style="left:120px;top:220px;padding:6px 20px;border:8px solid #11a36b;color:#11a36b;font:900 54px Inter;transform:rotate(-8deg);opacity:0">UNDER REVIEW</div></div>')
P.add(f'<div class="abs" style="inset:0;z-index:30">{rep}</div>')
pop('#rep', s('p17') + .3, .25); pop('#rst', s('p17') + CL['p17']['dur'] * .65, .15, 2.4, 'power4.in'); sfx(s('p17') + CL['p17']['dur'] * .65, 'stamp', 1); out('#rep', s('a18'))
# a18 celebration: cap + confetti
cam(s('a18') - .03, None); ex('ankush', 'laugh', s('a18')); ex('priya', 'smirk', s('a18'))
P.frm('#gcap', {'opacity': 0, 'y': -500, 'rotation': -20}, {'opacity': 1, 'y': 0, 'rotation': -8, 'duration': .3, 'ease': 'bounce.out'}, s('a18') + .1); fx(s('a18') + .1, 'pro_logo_sting/zap_bloom', .8)
conf2 = ''.join(f'<div class="abs cf2" style="left:{random.randint(0,1040)}px;top:{random.randint(-500,-20)}px;width:{random.randint(14,24)}px;height:{random.randint(24,40)}px;background:{random.choice([PINK,TEAL,YEL,"#fff",ORG])}"></div>' for _ in range(70))
P.add(f'<div id="CF2" class="abs" style="inset:0;z-index:29;opacity:0">{conf2}</div>'); show('#CF2', s('a18') + .1, e('p18'))
P.frm('#CF2 .cf2', {'y': 0}, {'y': 2400, 'rotation': 720, 'duration': 2.6, 'ease': 'none', 'stagger': .008}, s('a18') + .1)
lid, html = lab('ACADEMIC RECOGNITION!!', 170, 230, 60, '#000', YEL, -3, 'acr'); P.add(f'<div class="abs" style="inset:0;z-index:31">{html}</div>'); pop('#acr', s('a18') + .3, .2); out('#acr', s('p18') + .2)
# p18 callback: WENSDAY, cap falls off, buzzer
cam(s('p18') - .03, 'P', 1.3, 1300); ex('priya', 'smirk', s('p18'))
d18 = CL['p18']['dur']; tw18 = s('p18') + d18 * .62
cb = (f'<div id="cbw" class="abs hand" style="left:130px;top:300px;font-size:150px;color:#1b2a6b;background:#fffdf3;padding:10px 40px;border:8px solid #000;border-radius:16px;transform:rotate(-4deg);opacity:0">Wensday</div>'
      f'<div id="cbx" class="abs" style="left:640px;top:230px;font:900 220px Inter;color:{RED};opacity:0">✗</div>')
P.add(f'<div class="abs" style="inset:0;z-index:31">{cb}</div>')
pop('#cbw', tw18, .2, 2); P.frm('#cbx', {'opacity': 0, 'scale': 3}, {'opacity': 1, 'scale': 1, 'duration': .16, 'ease': 'power4.in'}, tw18 + .25); sfx(tw18 + .4, 'buzzer', 1); fx(tw18 + .4, 'impact/punch', .9)
cam(tw18 + .5, None); ex('ankush', 'hurt', tw18 + .5)
P.to('#gcap', {'y': 900, 'rotation': 120, 'duration': .5, 'ease': 'power2.in'}, tw18 + .6)
out('#cbw', MK['END']); out('#cbx', MK['END'])

# ================================================================= END CARD
en = MK['END']
endc = (f'<div class="abs" style="inset:0;background:{INK}"></div>{halftone}'
        f'<div id="en1" class="abs" style="left:0;width:1080px;top:560px;text-align:center;font:900 150px/1 Inter;color:#ffd9f0;text-shadow:0 0 14px {PINK},0 0 40px {PINK}">TOON<br>THEORY</div>'
        f'<div id="en2" class="abs" style="left:0;width:1080px;top:900px;text-align:center;font:900 54px/1.2 Inter;color:#fff">PEOPLE ARE WEIRD.<br><span style="color:{YEL}">LET\'S EXPLAIN WHY.</span></div>'
        f'<div id="en3" class="abs" style="left:90px;top:1140px;width:900px;text-align:center;font:800 40px/1.3 Inter;color:#000;background:{TEAL};padding:20px;border-radius:20px;border:5px solid #000">COMMENT: the most ridiculous thing you\'ve done to impress someone</div>'
        + G.head_icon(G.CHARS['priya'], 'smirk', 200).replace('<svg ', '<svg id="enp" class="abs" style="left:150px;top:1350px" ', 1)
        + G.head_icon(G.CHARS['ankush'], 'laugh', 200).replace('<svg ', '<svg id="ena" class="abs" style="left:730px;top:1350px" ', 1))
layer('END', 50, endc, en, DUR + 1)
pop('#en1', en, .3, .6); pop('#en2', en + .3, .25); pop('#en3', en + .6, .25); pop('#enp', en + .5, .25); pop('#ena', en + .7, .25)
fx(en, 'pro_logo_sting/swell_sting', 1.1)

# ================================================================= subtitles (burned) + SRT
srt, k = [], 1
def fmt(t): return '%02d:%02d:%02d,%03d' % (int(t // 3600), int(t // 60) % 60, int(t) % 60, int(round((t % 1) * 1000)) % 1000)
subs = ''
def chunks(text):
    words = text.split(); out_, cur = [], []
    for w in words:
        cur.append(w)
        if re.search(r'[.?!,…]$', w) or len(' '.join(cur)) > 26: out_.append(' '.join(cur)); cur = []
    if cur: out_.append(' '.join(cur))
    # merge tiny trailing chunks
    m = []
    for c in out_:
        if m and len(c) < 9 and len(m[-1]) + len(c) < 34: m[-1] += ' ' + c
        else: m.append(c)
    return m
for lid, (a, b) in sorted(T.items(), key=lambda kv: kv[1][0]):
    text = CL[lid]['text'].replace('...', '…').strip()
    if not text: continue
    text_srt = text.replace('LITERALLY', 'literally').replace('CAUGHT!', 'Caught!').replace('PRIYA?!', 'Priya?!').replace('NOT', 'not').replace('THIS', 'this')
    cs = chunks(text_srt); tot = sum(len(c) for c in cs) or 1; cur = a
    col = TEAL if lid.startswith('p') else ORG
    for j, c in enumerate(cs):
        d = (b - a) * len(c) / tot; i0, i1 = cur, cur + d; cur = i1
        sid = f'sb{lid}_{j}'
        subs += f'<div id="{sid}" class="sub" style="color:#fff"><span style="box-shadow:inset 0 -14px 0 {col}55">{c.replace(chr(39), "’")}</span></div>'
        P.st('#' + sid, {'opacity': 1}, round(i0 - .02, 3)); P.st('#' + sid, {'opacity': 0}, round(i1 + (.1 if j == len(cs) - 1 else -.01), 3))
        srt.append(f'{k}\n{fmt(max(0, i0 - .02))} --> {fmt(i1 + .06)}\n{"PRIYA: " if j == 0 and lid.startswith("p") else ("ANKUSH: " if j == 0 else "")}{c}\n'); k += 1
P.add(f'<div class="abs" style="left:0;top:0;width:1080px;height:1920px;z-index:90;pointer-events:none">{subs}</div>')
P.add('<div id="flash"></div><div id="vig"></div><div id="grain"></div>')   # v2: bottom "TOON THEORY" footer removed
P.to('#grain', {'backgroundPosition': '-9000px -6000px', 'duration': DUR, 'ease': f'steps({int(DUR * 24)})'}, 0)
os.makedirs(HERE + '/../final', exist_ok=True)
open(HERE + '/../final/ToonTheory_EP001_SmartGirlsDumbBoys.srt', 'w').write('\n'.join(srt))

# ================================================================= rig: expressions, lip-sync (real envelopes), blinks, sway
for inst, evs in EXPR.items():
    last = None
    for t, name in sorted(evs, key=lambda q: q[0]):
        if name != last: P.st(f'#{inst}_F', {'attr': {'data-e': name}}, t); last = name
for lid, (a, b) in T.items():
    who = 'priya' if lid.startswith('p') or lid == 'x_snort' else 'ankush'
    if lid == 'x_snort': continue
    env = rig.envelope(f'{HERE}/../audio/clips_t/{lid}.wav')
    for inst in INSTS[who]:
        if not (SPAN[inst][0] <= a <= SPAN[inst][1]): continue
        prev = None
        for i, sv in enumerate(env):
            if sv != prev: P.st(f'#{inst}_F', {'attr': {'data-m': sv}}, round(a + i / 24, 3)); prev = sv
        P.st(f'#{inst}_F', {'attr': {'data-m': 0}}, round(a + len(env) / 24 + .02, 3))
        P.to(f'#{inst}_head', {'y': -6, 'duration': .09, 'yoyo': True, 'repeat': 1}, a)
for inst, (a, b) in SPAN.items():
    t = a + random.uniform(.6, 1.6)
    while t < min(b, DUR) - .3:
        P.st(f'#{inst}_F', {'attr': {'data-b': 1}}, round(t, 3)); P.st(f'#{inst}_F', {'attr': {'data-b': 0}}, round(t + .1, 3)); t += random.uniform(2.0, 3.8)
    bb = min(b, DUR); n = max(0, int((bb - a) / 1.8) - 1); ph = random.choice([-1, 1])
    P.frm(f'#{inst}_head', {'rotation': -2 * ph, 'svgOrigin': '0 -468'}, {'rotation': 2 * ph, 'svgOrigin': '0 -468', 'duration': 1.8, 'yoyo': True, 'repeat': min(n, 60), 'ease': 'sine.inOut'}, a)
    P.frm(f'#{inst}_body', {'scaleY': 1.0, 'svgOrigin': '0 -300'}, {'scaleY': 1.015, 'svgOrigin': '0 -300', 'duration': 1.6, 'yoyo': True, 'repeat': min(max(0, int((bb - a) / 1.6) - 1), 70), 'ease': 'sine.inOut'}, a)
# talking bob: body bounces a touch while speaking (sells energy)
for lid, (a, b) in T.items():
    who = 'P' if lid.startswith('p') else 'A'
    if lid == 'x_snort': continue
    P.to(f'#{who}_body', {'y': -5, 'duration': .18, 'yoyo': True, 'repeat': max(1, int((b - a) / .36) * 2 - 1), 'ease': 'sine.inOut'}, a)

out_ = P.write()
os.makedirs(P.dir + '/assets', exist_ok=True)
shutil.copy(HERE + '/assets/caveat.ttf', P.dir + '/assets/caveat.ttf')
if not os.path.exists(P.dir + '/assets/noise.png'): shutil.copy('/root/hf-shorts/fp3/assets/noise.png', P.dir + '/assets/noise.png')
json.dump({'dur': DUR, 'fx': FX}, open(HERE + '/../audio/fx_events.json', 'w'))
print('built', out_, 'dur', DUR, 'sfx', len(FX), 'js', len(P.js))
