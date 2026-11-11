#!/usr/bin/env python3
"""Toon Theory EP001 'THE MAYBE' scene builder -> /root/hf-shorts/ep001/index.html (HyperFrames).
All timing comes from timeline.py (measured dialogue). Characters come from the approved bible via rig.py."""
import sys, os, json, re, random, shutil
sys.path.insert(0, '/home/user/viral-video-studio/studio/shorts_gen')
from common import Proj
import rig, timeline
G = rig.G
T, MK, VIS, DUR = timeline.build()
CL = timeline.CLIPS
HERE = os.path.dirname(os.path.abspath(__file__))
P = Proj('ep001', DUR, [])
random.seed(11)
ORANGE, BLUE, CREAM = '#ff8c3c', '#4682ff', '#fff3e6'
FX, EXPR, SPAN, TALK, SWAY = [], {}, {}, [], {}

def fx(t, k, g=1.0): FX.append((round(t, 3), 'bank:' + k, g))
def vis0(n): return VIS[n][0]
def vis1(n): return VIS[n][1]

# ------------------------------------------------------------------ helpers
def char(inst, key, left, top, w, t0, t1, **kw):
    start = kw.pop('start', 'neutral')
    html, h = rig.char_html(inst, key, left, top, w, **kw)
    SPAN[inst] = (t0, t1); EXPR[inst] = [(t0, start)]
    return html
def ex(inst, name, t): EXPR[inst].append((round(t, 3), name))
def say(line, inst): TALK.append((inst, line))
def scene(sid, t0, t1, body, z=5):
    P.add(f'<div class="sc" id="{sid}" style="z-index:{z}"><div class="cam abs" id="{sid}_cam" style="left:-420px;top:-100px;width:1920px;height:2120px"><div class="abs" style="left:420px;top:100px;width:1080px;height:1920px">{body}</div></div></div>')
    P.st('#' + sid, {'opacity': 1}, t0); P.st('#' + sid, {'opacity': 0}, t1)
def cam(sid, t0, t1, s0=1.0, s1=1.06, x0=0, x1=0, y0=0, y1=0):
    P.frm(f'#{sid}_cam', {'scale': s0, 'x': x0, 'y': y0}, {'scale': s1, 'x': x1, 'y': y1, 'duration': max(.1, t1 - t0), 'ease': 'none'}, t0)
def pop(sel, t, d=.28, s0=.6):
    P.frm(sel, {'opacity': 0, 'scale': s0}, {'opacity': 1, 'scale': 1, 'duration': d, 'ease': 'back.out(2)'}, t)
def show(sel, t0, t1, d=.18):
    P.frm(sel, {'opacity': 0}, {'opacity': 1, 'duration': d}, t0); P.to(sel, {'opacity': 0, 'duration': d}, t1)

def bokeh(items):
    return ''.join(f'<i class="abs" style="left:{x}px;top:{y}px;width:{r}px;height:{r}px;border-radius:50%;background:{c};filter:blur({b}px);opacity:{o}"></i>' for x, y, r, c, b, o in items)
def cafe(sid, cold=False):
    warm, cool = ('rgba(255,140,60,.12)', 'rgba(70,130,255,.38)') if cold else ('rgba(255,140,60,.24)', 'rgba(70,130,255,.30)')
    bk = bokeh([(70, 330, 190, '#ff9a3d', 22, .2 if cold else .55), (260, 200, 120, '#ffb86a', 14, .2 if cold else .5), (120, 560, 150, '#ff7a3d', 18, .15 if cold else .4),
                (700, 260, 170, '#4d8bff', 22, .6), (880, 420, 210, '#3d6fe0', 26, .5), (560, 160, 100, '#7fb2ff', 12, .45), (930, 170, 90, '#6ea4ff', 10, .5), (430, 420, 110, '#ffcf8a', 14, .15 if cold else .35),
                (-300, 300, 160, '#ff9a3d', 20, .3), (1150, 260, 190, '#4d8bff', 24, .45), (1400, 450, 150, '#7fb2ff', 16, .4)])
    return (f'<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:linear-gradient(180deg,#1b1a33 0%,#201a2e 35%,#2a1b22 60%,#150f16 100%)"></div>'
            f'<div class="abs" style="left:40px;top:150px;width:1000px;height:760px;border-radius:22px;background:linear-gradient(90deg,{warm},rgba(40,60,120,.35) 60%,{cool});border:6px solid #3a2f3c;overflow:hidden">{bk}</div>'
            f'<div class="abs" style="left:380px;top:150px;width:10px;height:760px;background:#3a2f3c"></div><div class="abs" style="left:700px;top:150px;width:10px;height:760px;background:#3a2f3c"></div>'
            f'<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:radial-gradient(ellipse at 15% 40%,{warm},transparent 55%),radial-gradient(ellipse at 90% 30%,{cool},transparent 55%)"></div>')
def table(): return '<div class="abs" style="left:-420px;right:-420px;top:1500px;height:520px;background:linear-gradient(180deg,#5a3a2a,#2d1c17);z-index:7;width:1920px"></div>'
def vignette(): return '<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:radial-gradient(ellipse at 50% 45%,transparent 45%,rgba(0,0,0,.6));z-index:20;pointer-events:none"></div>'
def phone(pid, left, top, w, h, inner, z=8, extra=''):
    return (f'<div id="{pid}" class="abs ph" style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;z-index:{z};{extra}"><div class="scr" style="width:{w-20}px;height:{h-20}px">{inner}</div></div>')
SMILEY = '<svg width="46" height="46" viewBox="0 0 46 46" style="vertical-align:-8px;margin-left:8px"><circle cx="23" cy="23" r="20" fill="#ffd23f" stroke="#1a1220" stroke-width="2.5"/><circle cx="16" cy="19" r="2.8" fill="#1a1220"/><circle cx="30" cy="19" r="2.8" fill="#1a1220"/><path d="M13 28 Q23 38 33 28" fill="none" stroke="#1a1220" stroke-width="3" stroke-linecap="round"/></svg>'
def chat_head(name, col, sub='online'):
    return (f'<div class="abs" style="left:0;top:0;right:0;height:130px;background:#171925;border-bottom:2px solid #2a2d3d"></div>'
            f'<div class="abs" style="left:26px;top:28px;width:74px;height:74px;border-radius:50%;background:{col};font:800 40px Inter;color:#1a1220;text-align:center;line-height:74px">{name[0]}</div>'
            f'<div class="abs" style="left:120px;top:26px;font:800 40px Inter;color:#fff">{name}</div><div class="abs" style="left:120px;top:76px;font:500 26px Inter;color:#8e93ad">{sub}</div>')

CSS = rig.CSS + """
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0b0d18;font-family:Inter,Arial,sans-serif}
.sc{position:absolute;left:0;top:0;width:1080px;height:1920px;opacity:0;overflow:hidden}.abs{position:absolute}
.ph{border-radius:70px;background:#0e0f16;border:10px solid #2b2c38;box-shadow:0 30px 80px rgba(0,0,0,.65),0 0 90px rgba(70,130,255,.25);overflow:hidden}
.scr{position:relative;background:#0f1119;overflow:hidden;border-radius:58px}
.bub{position:absolute;padding:20px 30px;border-radius:34px;font:600 40px Inter;color:#fff;background:#2a2d3f;white-space:nowrap}
.bout{background:linear-gradient(135deg,#3b7bff,#2f5fe0)}
.sub{position:absolute;left:70px;right:70px;top:1640px;text-align:center;font:900 56px/1.14 Inter,Arial,sans-serif;color:#fff;letter-spacing:.005em;opacity:0;z-index:60;
 -webkit-text-stroke:9px #000;paint-order:stroke fill;text-shadow:0 4px 0 rgba(0,0,0,.85)}
.sub.n{color:#ffc470;font-style:italic}
#grain{position:absolute;left:-300px;top:-300px;width:1680px;height:2520px;z-index:70;pointer-events:none;background:url(assets/noise.png);background-size:256px 256px;opacity:.06}
.chip{position:absolute;padding:12px 24px;border-radius:30px;font:800 30px Inter;letter-spacing:.06em;color:#14101c;background:#ffc470;box-shadow:0 8px 24px rgba(0,0,0,.45);z-index:30}
"""

# ------------------------------------------------------------------ SCENE 1a: eleven drafts (hook)
t_send = vis0('S1_send'); s1a_end = MK['S1b']
DR = ["Hey!", "hey", "Hey, long time", "hey :)", "Hi stranger", "hello you", "Oh hey!", "Hey you", "heyy", "hey.", "hey"]
avail = t_send - 0.2; slot = avail / 11
drafts = ''.join(f'<div id="dr{i}" class="abs" style="left:34px;top:22px;width:560px;height:70px;font:600 46px/70px Inter;color:#fff;overflow:hidden;white-space:nowrap;opacity:0">{d}</div>' for i, d in enumerate(DR))
counts = ''.join(f'<span id="dc{i}" class="abs" style="left:0;top:0;opacity:0">{i + 1}</span>' for i in range(11))
screen = (chat_head('Rohan', ORANGE, 'last seen recently') +
          f'<div id="inb" class="bub" style="left:30px;top:200px;font-size:46px">hey stranger{SMILEY}</div>'
          '<div class="abs" style="left:34px;top:290px;font:500 24px Inter;color:#6f748f">11:48 PM</div>'
          '<div id="outb" class="bub bout" style="right:30px;top:420px;font-size:46px;opacity:0">hey</div>'
          '<div class="abs" style="left:20px;top:830px;width:620px;height:106px;border-radius:53px;background:#232637"></div>'
          f'<div class="abs" style="left:20px;top:830px;width:620px;height:106px;overflow:hidden">{drafts}</div>'
          '<div class="abs" style="left:560px;top:850px;width:66px;height:66px;border-radius:50%;background:#3b7bff"></div>'
          '<div class="abs" style="left:420px;top:150px;width:240px;height:50px;font:800 24px Inter;letter-spacing:.2em;color:#ff8c3c;text-align:right">DRAFT <span style="position:relative;display:inline-block;width:40px;height:30px">' + counts + '</span>/11</div>')
body = ('<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:radial-gradient(ellipse at 50% 28%,#1d2742 0%,#0c0f1c 72%)"></div>'
        '<div class="abs" style="left:620px;top:-60px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(255,140,60,.28),transparent 65%)"></div>'
        + phone('s1ph', 200, 70, 680, 980, screen) +
        '<div class="abs" style="left:-420px;top:900px;width:1920px;height:1100px;background:radial-gradient(ellipse at 50% 20%,rgba(70,130,255,.18),transparent 60%);z-index:6"></div>'
        + char('s1_priya', 'priya', 270, 940, 540, 0, s1a_end, pose='hug', z=9, start='worried') + vignette())
scene('S1a', 0, s1a_end, body)
cam('S1a', 0, s1a_end, 1.0, 1.05, 0, 0, 0, -20)
P.frm('#s1ph', {'opacity': 0, 'y': 60}, {'opacity': 1, 'y': 0, 'duration': .35, 'ease': 'power3.out'}, 0)
fx(0.05, 'notify/mid_tine', .9)
for i in range(11):
    a = 0.2 + i * slot; ty = slot * .55
    P.frm(f'#dr{i}', {'opacity': 1, 'clipPath': 'inset(0 100% 0 0)'}, {'clipPath': 'inset(0 0% 0 0)', 'duration': ty, 'ease': f'steps({max(3, len(DR[i]))})'}, a)
    P.to(f'#dr{i}', {'opacity': 0, 'duration': .06}, a + slot * .88)
    P.st(f'#dc{i}', {'opacity': 1}, a); P.st(f'#dc{i}', {'opacity': 0}, a + slot)
    if i < 10: fx(a + .05, 'tap/soft', .5); fx(a + slot * .88, 'ui_pop/blip', .35)
    ex('s1_priya', 'worried' if i % 2 == 0 else 'deadpan', a)
P.st('#dr10', {'opacity': 1}, t_send - .05); P.st('#dr10', {'opacity': 0}, t_send + .06)
ex('s1_priya', 'worried', t_send - .3)
P.frm('#outb', {'opacity': 0, 'y': 40, 'scale': .8}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, t_send + .1)
fx(t_send + .08, 'whoosh_fast/tight', .8); fx(t_send + .3, 'ui_pop/step', .8)
ex('s1_priya', 'stunned', t_send + .35); ex('s1_priya', 'worried', t_send + .9)
P.to('#s1_priya', {'scale': .94, 'y': 24, 'duration': .12, 'yoyo': True, 'repeat': 1}, t_send + .35)
fx(t_send + .35, 'impact/punch', .6)

# ------------------------------------------------------------------ SCENE 1b: cafe window + title
s1b_end = MK['S2']
body = cafe('c1') + char('s1b_k', 'krish', 20, 830, 480, MK['S1b'], s1b_end, z=9, start='deadpan') + char('s1b_a', 'ankush', 540, 800, 500, MK['S1b'], s1b_end, z=9, start='smirk') + table() + vignette()
tt = vis0('S1_title')
body += ('<div id="ttl" class="abs" style="left:0;right:0;top:330px;width:1080px;text-align:center;font:900 200px/1 Inter;color:#fff3e6;letter-spacing:.02em;z-index:40;opacity:0;text-shadow:0 0 60px rgba(255,140,60,.7),0 8px 0 #000">THE<br>MAYBE</div>'
         '<div id="ttlf" class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:#fff3e6;z-index:41;opacity:0"></div>')
scene('S1b', MK['S1b'], s1b_end, body); cam('S1b', MK['S1b'], s1b_end, 1.0, 1.05)
say('k01', 's1b_k'); say('a03', 's1b_a'); say('k02', 's1b_k')
ex('s1b_k', 'neutral', T['k01'][0]); ex('s1b_a', 'smirk', T['a03'][0]); ex('s1b_k', 'smirk', T['k02'][0])
P.frm('#ttl', {'opacity': 0, 'scale': 1.7}, {'opacity': 1, 'scale': 1, 'duration': .22, 'ease': 'power4.in'}, tt)
P.st('#ttlf', {'opacity': 0}, 0); P.st('#ttlf', {'opacity': .85}, tt + .02); P.to('#ttlf', {'opacity': 0, 'duration': .35}, tt + .2); P.to('#ttl', {'opacity': 0, 'duration': .18}, s1b_end - .2)
fx(tt, 'impact/deep', 1.6); fx(tt, 'cut_hit/sub', 1.0); fx(MK['S1b'], 'whoosh_fast/whip', .8)

# ------------------------------------------------------------------ SCENE 2a: the wordless fries/coffee gag
s2a0, s2a1 = MK['S2'], vis0('S2_across')
fries = ''.join(f'<div id="fr{i}" class="abs" style="left:{700 + (i % 5) * 28}px;top:{1535 + (i // 5) * 10 + (i % 3) * 6}px;width:14px;height:70px;border-radius:5px;background:#e2ae48;transform:rotate({-24 + i * 6}deg);z-index:12"></div>' for i in range(10))
cupg = ('<div class="abs" style="left:170px;top:1490px;width:220px;height:110px;border-radius:50%;background:#efe2c8;z-index:11;box-shadow:0 14px 24px rgba(0,0,0,.5)"></div>'
        '<div class="abs" style="left:190px;top:1503px;width:180px;height:84px;border-radius:50%;background:#4a2a1c;z-index:12"></div>'
        '<div id="spoon" class="abs" style="left:279px;top:1542px;width:6px;height:90px;background:#cfd3da;border-radius:3px;z-index:13;transform-origin:50% 0%"></div>'
        '<div class="abs" style="left:640px;top:1525px;width:220px;height:110px;border-radius:50%;background:#eee;z-index:11;box-shadow:0 14px 24px rgba(0,0,0,.5)"></div>')
body = (cafe('c2') + char('s2a_k', 'krish', 20, 830, 480, s2a0, s2a1, z=9, start='deadpan') + char('s2a_a', 'ankush', 540, 800, 500, s2a0, s2a1, z=9, start='smirk') + table() + cupg + fries + vignette())
scene('S2a', s2a0, s2a1, body); cam('S2a', s2a0, s2a1, 1.04, 1.08)
P.frm('#spoon', {'rotation': 0}, {'rotation': 1440, 'duration': s2a1 - s2a0, 'ease': 'none'}, s2a0)
for i in range(10):
    tf = s2a0 + .2 + i * .15
    P.to(f'#fr{i}', {'opacity': 0, 'y': -40, 'scale': .6, 'duration': .15}, tf); fx(tf, 'tap/soft', .3)
P.to('#s2a_a', {'rotation': -2.5, 'x': -14, 'duration': .9, 'yoyo': True, 'repeat': 1, 'ease': 'sine.inOut'}, s2a0 + .1)
ex('s2a_a', 'laugh', s2a0 + 1.0); ex('s2a_k', 'worried', s2a0 + 1.2)

# ------------------------------------------------------------------ SCENE 2b: Priya & Meera (cancelled again / voice note)
s2b0, s2b1 = s2a1, MK['S3']
wave = ''.join(f'<div class="wv abs" style="left:{110 + i * 17}px;top:{58 - (i * 7 % 22)}px;width:8px;height:{20 + (i * 7 % 22) * 2}px;border-radius:4px;background:#8fb4ff;transform-origin:50% 50%"></div>' for i in range(24))
vn = ('<div id="vn" class="abs" style="left:560px;top:1330px;width:480px;height:130px;border-radius:44px;background:#2a2d3f;z-index:30;opacity:0">'
      '<div class="abs" style="left:18px;top:22px;width:84px;height:84px;border-radius:50%;background:#ff8c3c;font:800 44px/84px Inter;color:#1a1220;text-align:center">R</div>' + wave + '</div>')
laptop = '<div class="abs" style="left:60px;top:1470px;width:400px;height:120px;border-radius:10px 10px 0 0;background:#1d2236;z-index:11;border:4px solid #3a4160">' + ''.join(f'<div class="abs" style="left:{14 + (i % 6) * 62}px;top:{12 + (i // 6) * 22}px;width:50px;height:12px;background:{"#2fb28a" if i % 4 else "#e0a526"};opacity:.7"></div>' for i in range(24)) + '</div>'
body = cafe('c3') + char('s2b_p', 'priya', 40, 840, 470, s2b0, s2b1, z=9, start='neutral') + char('s2b_m', 'meera', 560, 880, 450, s2b0, s2b1, z=9, start='deadpan') + table() + laptop + vn + vignette()
scene('S2b', s2b0, s2b1, body); cam('S2b', s2b0, s2b1, 1.0, 1.05)
say('m01', 's2b_m'); say('p01', 's2b_p'); say('m02', 's2b_m'); say('m03', 's2b_m')
ex('s2b_p', 'worried', T['p01'][0]); ex('s2b_m', 'smirk', T['m02'][0]); ex('s2b_p', 'smile', T['r01'][0]); ex('s2b_m', 'deadpan', T['r01'][0] + .3); ex('s2b_m', 'smirk', T['m03'][0]); ex('s2b_p', 'worried', T['m03'][1])
show('#vn', T['r01'][0] - .05, T['r01'][1] + .25)
fx(T['r01'][0] - .1, 'notify/m3', .8)
for i, el in enumerate(range(24)):
    pass
P.to('.wv', {'scaleY': 1.8, 'duration': .18, 'yoyo': True, 'repeat': int((T['r01'][1] - T['r01'][0]) / .18), 'ease': 'sine.inOut', 'stagger': {'each': .02, 'from': 'start'}}, T['r01'][0])

# ------------------------------------------------------------------ SCENE 3a: the library
s3a0, s3a1 = MK['S3'], vis0('S3_walk')
books = ''.join(f'<div class="abs" style="left:{20 + i * 33}px;top:{row * 190 + 190 - (60 + (i * 13 % 60))}px;width:26px;height:{60 + (i * 13 % 60)}px;background:{["#8a3b2b","#2f5a7a","#b08a3a","#4f3a6b","#2f6b57"][(i + row) % 5]};opacity:.8;border-radius:2px"></div>' for row in range(3) for i in range(32))
shelves = f'<div class="abs" style="left:0;top:90px;width:1080px;height:640px;overflow:hidden">{books}' + ''.join(f'<div class="abs" style="left:0;top:{r * 190 + 190}px;width:1080px;height:14px;background:#3a281c"></div>' for r in range(3)) + '</div>'
cards = ''.join(f'<div class="abs" style="left:{60 + i * 95}px;top:{1530 + (i % 3) * 14}px;width:80px;height:52px;background:#f4efe6;transform:rotate({-12 + i * 5}deg);z-index:12;border-radius:4px"></div>' for i in range(8))
cup1 = '<div id="lc1" class="abs" style="left:680px;top:1500px;width:70px;height:70px;border-radius:0 0 22px 22px;background:#efe2c8;z-index:12;opacity:0"></div><div id="lc2" class="abs" style="left:770px;top:1510px;width:70px;height:70px;border-radius:0 0 22px 22px;background:#efe2c8;z-index:12;opacity:0"></div>'
bag = ('<div id="bag" class="abs" style="left:520px;top:1380px;width:170px;height:200px;background:#c9a56b;z-index:14;opacity:0;border-radius:8px;clip-path:polygon(0 8%,12% 0,88% 0,100% 8%,100% 100%,0 100%)"></div>'
       '<div id="sand" class="abs" style="left:470px;top:1450px;width:300px;height:150px;z-index:15;opacity:0"><svg width="300" height="150" viewBox="0 0 300 150"><polygon points="20,120 150,20 150,40 40,130" fill="#e9c98a"/><polygon points="8,130 140,34 150,40 130,138" fill="#d9b06a"/>'
       '<polygon points="170,26 280,120 262,134 160,44" fill="#e9c98a"/><polygon points="170,46 270,134 250,140 160,52" fill="#d9b06a"/><path d="M30 118 L150 44 M170 52 L262 128" stroke="#7a9a5a" stroke-width="7" stroke-linecap="round"/></svg></div>')
ghost = '<div id="ghost" class="abs" style="left:70px;top:610px;width:520px;font:italic 600 34px/1.25 Inter;color:rgba(255,243,230,.85);background:rgba(20,16,28,.6);border:2px dashed rgba(255,243,230,.45);border-radius:26px;padding:16px 22px;z-index:30;opacity:0">“straight cuts are for people who’ve given up”</div>'
lamp = '<div class="abs" style="left:220px;top:380px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(255,160,70,.5),transparent 65%);z-index:4"></div>'
body = ('<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:linear-gradient(180deg,#2a1b1a,#3a2417 55%,#1b110f)"></div>' + shelves + lamp +
        '<div class="abs" style="left:-420px;top:1500px;width:1920px;height:520px;background:linear-gradient(180deg,#6b4428,#33200f);z-index:7"></div>'
        + char('s3a_p', 'priya', 30, 850, 480, s3a0, s3a1, z=9, start='worried') + char('s3a_r', 'rohan', 560, 790, 510, s3a0, s3a1, z=9, start='smile') + cards + cup1 + bag + ghost + vignette())
scene('S3a', s3a0, s3a1, body)
cam('S3a', s3a0, vis0('S3_bag'), 1.0, 1.04); cam_t = vis0('S3_bag')
P.frm('#S3a_cam', {'scale': 1.04, 'x': 0, 'y': 0}, {'scale': 1.28, 'x': -90, 'y': -190, 'duration': .5, 'ease': 'power2.inOut', 'immediateRender': False}, cam_t)
P.to('#S3a_cam', {'scale': 1.05, 'x': 0, 'y': 0, 'duration': .6, 'ease': 'power2.inOut'}, vis1('S3_bag') + .2)
P.frm('#s3a_r', {'x': 620, 'opacity': 0}, {'x': 0, 'opacity': 1, 'duration': .9, 'ease': 'power3.out'}, s3a0 + .3)
fx(s3a0 + .3, 'whoosh_fast/crisp', .6)
show('#lc1', s3a0 + 1.0, s3a1 + 5); show('#lc2', s3a0 + 1.1, s3a1 + 5)
fx(s3a0 + 1.1, 'tap/glass', .5)
say('r02', 's3a_r'); say('p02', 's3a_p'); say('r03', 's3a_r')
ex('s3a_p', 'deadpan', T['r02'][0]); ex('s3a_p', 'smirk', T['p02'][0]); ex('s3a_r', 'laugh', T['p02'][1] - .3); ex('s3a_r', 'smile', T['r03'][0])
P.frm('#bag', {'opacity': 0, 'y': 60}, {'opacity': 1, 'y': 0, 'duration': .3}, vis0('S3_bag')); P.frm('#sand', {'opacity': 0, 'y': 40, 'scale': .8}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .35, 'ease': 'back.out(2)'}, vis0('S3_bag') + .25)
fx(vis0('S3_bag') + .05, 'swish/soft', .9); fx(vis0('S3_bag') + .3, 'pro_pop/bloop', .8)
P.to('#bag,#sand', {'opacity': 0, 'duration': .3}, vis0('S3_remember') + .3)
tr = vis0('S3_remember')
ex('s3a_p', 'stunned', tr); ex('s3a_p', 'smile', tr + .6)
pop('#ghost', tr + .1, .3, .8); P.to('#ghost', {'opacity': 0, 'duration': .3}, vis1('S3_remember') + .2); fx(tr + .1, 'notify/mid_tine', .8)
P.frm('#S3a_cam', {'scale': 1.05, 'x': 0, 'y': 0}, {'scale': 1.2, 'x': 70, 'y': -120, 'duration': .9, 'ease': 'power2.inOut', 'immediateRender': False}, tr)

# ------------------------------------------------------------------ SCENE 3b: walking home (parallax street)
s3b0, s3b1 = vis0('S3_walk'), vis0('S3_cold')
def building(x, w, h, shade):
    wins = ''.join(f'<div class="abs" style="left:{16 + (i % 4) * (w // 4)}px;top:{20 + (i // 4) * 50}px;width:{w // 4 - 24}px;height:30px;background:{"#ffb86a" if (i * 5 + x) % 3 == 0 else "#243050"};opacity:{.9 if (i * 5 + x) % 3 == 0 else .5}"></div>' for i in range(int(h // 50) * 4))
    return f'<div class="abs" style="left:{x}px;top:{1180 - h}px;width:{w}px;height:{h + 800}px;background:{shade}">{wins}</div>'
far = ''.join(building(-300 + i * 260, 230, 380 + (i * 70 % 220), '#141a30') for i in range(10))
near = ''.join(building(-400 + i * 340, 300, 520 + (i * 90 % 260), '#0e1224') for i in range(8))
lamps = ''.join(f'<div class="abs" style="left:{i * 520}px;top:760px;width:12px;height:700px;background:#1a1626"></div><div class="abs" style="left:{i * 520 - 140}px;top:640px;width:290px;height:290px;border-radius:50%;background:radial-gradient(circle,rgba(255,170,80,.75),transparent 66%)"></div>' for i in range(6))
body = ('<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:linear-gradient(180deg,#0b1024,#1a1a3a 55%,#241a2a)"></div>'
        f'<div id="far" class="abs" style="left:0;top:0;width:1080px;height:1920px">{far}</div><div id="near" class="abs" style="left:0;top:0;width:1080px;height:1920px">{near}</div>'
        f'<div id="lmp" class="abs" style="left:0;top:0;width:1080px;height:1920px">{lamps}</div>'
        '<div class="abs" style="left:-420px;top:1500px;width:1920px;height:520px;background:linear-gradient(180deg,#1c1824,#0e0c14);z-index:7"></div>'
        + char('s3b_p', 'priya', 40, 850, 470, s3b0, s3b1, z=9, start='smile') + char('s3b_r', 'rohan', 560, 790, 500, s3b0, s3b1, z=9, start='smile') + vignette())
scene('S3b', s3b0, s3b1, body)
d = s3b1 - s3b0
P.frm('#far', {'x': 0}, {'x': -260, 'duration': d, 'ease': 'none'}, s3b0); P.frm('#near', {'x': 0}, {'x': -520, 'duration': d, 'ease': 'none'}, s3b0); P.frm('#lmp', {'x': 0}, {'x': -1040, 'duration': d, 'ease': 'none'}, s3b0)
for inst in ('s3b_p', 's3b_r'):
    P.to(f'#{inst}', {'y': 7, 'duration': .31, 'yoyo': True, 'repeat': int(d / .31), 'ease': 'sine.inOut'}, s3b0)
say('r04', 's3b_r'); say('p03', 's3b_p'); say('r05', 's3b_r')
ex('s3b_p', 'smile', T['r04'][0]); ex('s3b_p', 'laugh', T['r05'][1] - .6); ex('s3b_r', 'smirk', T['r05'][0]); ex('s3b_p', 'smile', T['p03'][0])
fx(s3b0, 'whoosh_big/gust', .4)

# ------------------------------------------------------------------ SCENE 3c: cold "Seen" + 3d cafe in cold light
s3c0 = vis0('S3_cold'); s3c1 = vis1('S3_cold'); s3d1 = MK['S4']
screen = (chat_head('Rohan', '#6f7a99', 'last seen 1:07 AM') + '<div class="bub" style="left:30px;top:210px;font-size:44px">hey stranger</div>'
          '<div id="cold_out" class="bub bout" style="right:30px;top:360px;font-size:44px">hey</div><div id="seen" class="abs" style="right:34px;top:470px;font:800 30px Inter;color:#7fb2ff;letter-spacing:.1em">SEEN 1:07 AM</div>'
          '<div class="abs" style="left:0;top:0;width:100%;height:100%;background:rgba(30,50,110,.35)"></div>')
body = ('<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:radial-gradient(ellipse at 50% 40%,#101a38 0%,#070a14 70%)"></div>'
        + phone('s3cph', 190, 230, 700, 1000, screen) + vignette())
scene('S3c', s3c0, s3c1, body); cam('S3c', s3c0, s3c1, 1.0, 1.08)
P.frm('#seen', {'opacity': 0, 'x': 40}, {'opacity': 1, 'x': 0, 'duration': .3}, s3c0 + .25); fx(s3c0 + .05, 'pro_riser/roll', .4); fx(s3c0 + .3, 'pro_notify/ding_2296', .5)
body = cafe('c4', cold=True) + char('s3d_p', 'priya', 40, 840, 470, s3c1, s3d1, z=9, start='smile') + char('s3d_m', 'meera', 560, 880, 450, s3c1, s3d1, z=9, start='deadpan') + table() + '<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:rgba(30,60,150,.2);z-index:15"></div>' + vignette()
scene('S3d', s3c1, s3d1, body); cam('S3d', s3c1, s3d1, 1.0, 1.05)
say('p04', 's3d_p'); say('m04', 's3d_m'); say('p05', 's3d_p')
ex('s3d_p', 'smile', T['p04'][0]); ex('s3d_p', 'neutral', T['p04'][1]); ex('s3d_m', 'smirk', T['m04'][0]); ex('s3d_p', 'hurt', T['p05'][0])

# ------------------------------------------------------------------ SCENE 4a: the slot machine (wordless)
s4a0, s4a1 = VIS['S4_slot']
dots = lambda i: f'<div id="td{i}" class="bub" style="left:30px;top:{210 + 120 * (i - 1) * 0}px;opacity:0;padding:22px 34px"><span style="letter-spacing:12px;font-size:54px">•••</span></div>'
pscreen = (chat_head('Rohan', ORANGE, 'online') + '<div class="bub" style="left:30px;top:210px;font-size:42px">hey stranger</div>' + ''.join(dots(i) for i in (1, 2, 3)).replace('top:210px', 'top:340px') +
           '<div id="pizza" class="abs" style="left:14px;top:-150px;width:612px;height:130px;border-radius:30px;background:#f4efe6;z-index:9;box-shadow:0 12px 30px rgba(0,0,0,.5)"><div class="abs" style="left:22px;top:22px;width:86px;height:86px;border-radius:50%;background:#d9402e"></div>'
           '<div class="abs" style="left:126px;top:20px;font:800 30px Inter;color:#1a1220">Pizza Palace</div><div class="abs" style="left:126px;top:66px;font:600 28px Inter;color:#444">2-for-1 tonight only!</div></div>')
reels = ''
for r in range(3):
    syms = ''.join(f'<div class="abs" style="left:0;top:{i * 170}px;width:150px;height:170px;font:900 52px/170px Inter;color:#1a1220;text-align:center">{s}</div>' for i, s in enumerate(['?', '...', 'seen', 'hey', '...', '?', 'seen', 'hey', '...', 'hey']))
    reels += f'<div class="abs" style="left:{50 + r * 180}px;top:200px;width:150px;height:170px;background:#fff3e6;border-radius:14px;overflow:hidden;border:5px solid #1a1220"><div id="rl{r}" class="abs" style="left:0;top:0;width:150px;height:1700px">{syms}</div></div>'
slot = ('<div id="slot" class="abs" style="left:230px;top:300px;width:620px;height:780px;opacity:0;z-index:8"><div class="abs" style="left:0;top:0;width:600px;height:760px;border-radius:50px;background:linear-gradient(160deg,#e9b44a,#b5701c);border:10px solid #5a3a12;box-shadow:0 30px 80px rgba(0,0,0,.6)"></div>'
        '<div class="abs" style="left:150px;top:46px;width:300px;height:96px;border-radius:20px;background:#2a1530;font:900 56px/96px Inter;color:#ffcf5a;text-align:center;letter-spacing:.14em">MAYBE</div>'
        f'<div class="abs" style="left:0;top:0">{reels}</div><div id="lever" class="abs" style="left:590px;top:170px;width:26px;height:230px;background:#cfd3da;border-radius:13px;transform-origin:50% 100%"></div>'
        '<div id="ball" class="abs" style="left:570px;top:128px;width:66px;height:66px;border-radius:50%;background:#d9402e;border:5px solid #7a1e14"></div>'
        '<div class="abs" style="left:60px;top:470px;width:480px;font:800 36px Inter;color:#2a1530;text-align:center;letter-spacing:.08em">HEY STRANGER</div></div>')
glow = '<div id="jack" class="abs" style="left:-100px;top:200px;width:1280px;height:1280px;border-radius:50%;background:radial-gradient(circle,rgba(255,180,70,.9),transparent 65%);opacity:0;z-index:6"></div>'
body = ('<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:radial-gradient(ellipse at 50% 35%,#251a33 0%,#0b0d18 72%)"></div>' + glow +
        phone('s4ph', 200, 70, 680, 1000, pscreen) + slot + char('s4a_p', 'priya', 300, 1030, 480, s4a0, s4a1, z=12, start='neutral') + vignette())
scene('S4a', s4a0, s4a1, body); cam('S4a', s4a0, s4a1, 1.0, 1.05)
for i, (a, b) in enumerate([(.3, .9), (1.2, 1.8), (2.1, 2.6)]):
    show(f'#td{i + 1}', s4a0 + a, s4a0 + b, .12); fx(s4a0 + a, 'tap/soft', .4)
    ex('s4a_p', 'smile', s4a0 + a); ex('s4a_p', 'worried', s4a0 + b)
    P.to('#s4a_p', {'y': -14, 'duration': .3, 'yoyo': True, 'repeat': 1}, s4a0 + a)
P.to('#pizza', {'y': 170, 'duration': .25, 'ease': 'power3.out'}, s4a0 + 2.9); P.to('#pizza', {'y': -150, 'duration': .25}, s4a0 + 3.5)
fx(s4a0 + 2.9, 'notify/mid_tine', 1.0)
ex('s4a_p', 'stunned', s4a0 + 2.9); ex('s4a_p', 'hurt', s4a0 + 3.5)
P.to('#s4a_p', {'scale': 1.12, 'y': -50, 'duration': .15, 'yoyo': True, 'repeat': 1, 'ease': 'power2.out'}, s4a0 + 2.9)
P.to('#s4ph', {'scaleX': .1, 'opacity': 0, 'duration': .5, 'ease': 'power3.in'}, s4a0 + 3.7)
P.frm('#slot', {'opacity': 0, 'scale': .85}, {'opacity': 1, 'scale': 1, 'duration': .5, 'ease': 'back.out(1.8)'}, s4a0 + 4.0)
fx(s4a0 + 3.85, 'whoosh_fast/whip', .9); fx(s4a0 + 4.1, 'pro_pop/bloop', 1.0)
P.to('#lever', {'rotation': 28, 'duration': .2, 'yoyo': True, 'repeat': 1}, s4a0 + 4.5); P.to('#ball', {'y': 90, 'duration': .2, 'yoyo': True, 'repeat': 1}, s4a0 + 4.5)
fx(s4a0 + 4.55, 'impact/punch', .7)
for r in range(3):
    stop = 5.35 + r * .4
    P.frm(f'#rl{r}', {'y': 0}, {'y': [-1190, -1530, -1190][r], 'duration': stop - 4.7, 'ease': 'power2.out'}, s4a0 + 4.7)
    fx(s4a0 + 4.75 + r * .1, 'swish/flick', .6); fx(s4a0 + stop, 'ui_pop/step', .9)
P.frm('#jack', {'opacity': 0, 'scale': .5}, {'opacity': 1, 'scale': 1, 'duration': .35}, s4a0 + 6.2); P.to('#jack', {'opacity': .35, 'duration': .5}, s4a0 + 6.6)
fx(s4a0 + 6.2, 'pro_notify/ding_1930', 1.1); fx(s4a0 + 6.2, 'logo_sting/zip_ping', .8)
ex('s4a_p', 'laugh', s4a0 + 6.2)
P.to('#s4a_p', {'scale': 1.08, 'y': -30, 'duration': .2, 'yoyo': True, 'repeat': 1}, s4a0 + 6.2)

# ------------------------------------------------------------------ SCENE 4b: Priya/Meera counting
s4b0, s4b1 = s4a1, vis0('S4_back')
pph = '<div id="s4pp" class="abs" style="left:420px;top:1400px;width:200px;height:330px;border-radius:30px;background:#0e0f16;border:7px solid #2b2c38;z-index:30;box-shadow:0 0 60px rgba(255,140,60,.5)"><div class="abs" style="left:8px;top:8px;right:8px;bottom:8px;border-radius:22px;background:linear-gradient(160deg,#ff9a4d,#5a8dff);opacity:.85"></div></div>'
body = cafe('c5') + char('s4b_p', 'priya', 40, 840, 470, s4b0, s4b1, z=9, start='smile') + char('s4b_m', 'meera', 560, 880, 450, s4b0, s4b1, z=9, start='deadpan') + table() + pph + vignette()
scene('S4b', s4b0, s4b1, body); cam('S4b', s4b0, s4b1, 1.0, 1.06)
say('m05', 's4b_m'); say('p06', 's4b_p'); say('p07', 's4b_p')
ex('s4b_m', 'smirk', T['m05'][0]); ex('s4b_p', 'neutral', T['p06'][0]); ex('s4b_p', 'worried', T['p07'][0] - .3)
P.to('#s4pp', {'y': -30, 'scale': 1.2, 'duration': .25, 'yoyo': True, 'repeat': 1}, vis0('S4_recheck')); fx(vis0('S4_recheck'), 'notify/mid_tine', .6)

# ------------------------------------------------------------------ SCENE 4c: Krish & Ankush, the study
s4c0, s4c1 = vis0('S4_back'), MK['S5']
chips = ''.join(f'<div id="chip{i}" class="chip" style="left:{60 + i * 8}px;top:{470 + i * 78}px;opacity:0">{t}</div>' for i, t in enumerate(['SMALL STUDY', 'COLLEGE STUDENTS', 'NOT PROOF']))
body = cafe('c6') + char('s4c_k', 'krish', 20, 830, 480, s4c0, s4c1, z=9, start='deadpan') + char('s4c_a', 'ankush', 540, 800, 500, s4c0, s4c1, z=9, start='smirk') + table() + chips + vignette()
scene('S4c', s4c0, s4c1, body); cam('S4c', s4c0, s4c1, 1.0, 1.06)
say('a04', 's4c_a'); say('k03', 's4c_k'); say('k04', 's4c_k'); say('a05', 's4c_a'); say('k05', 's4c_k'); say('a06', 's4c_a')
ex('s4c_a', 'smirk', T['a04'][0]); ex('s4c_k', 'smirk', T['k03'][0]); ex('s4c_k', 'neutral', T['k04'][0]); ex('s4c_a', 'smirk', T['a05'][0]); ex('s4c_k', 'worried', T['k05'][0]); ex('s4c_a', 'laugh', T['a06'][0])
for i in range(3):
    pop(f'#chip{i}', T['k04'][0] + 1.2 + i * 1.1, .25, .7); P.to(f'#chip{i}', {'opacity': 0, 'duration': .2}, T['k04'][1] + .5); fx(T['k04'][0] + 1.2 + i * 1.1, 'ui_pop/blip', .6)

# ------------------------------------------------------------------ SCENE 5a: the unfinished portrait
s5a0, s5a1 = MK['S5'], vis0('S5_cafe')
def portrait(pid, x, y, level):
    """hand-inked Rohan; level 1 rough -> 3 kinder/steadier; level 3 is deliberately unfinished (right side dashed)"""
    st = f'fill="none" stroke="#2a2038" stroke-width="{5 - level * .6}" stroke-linecap="round" stroke-linejoin="round"'
    mouth = ['M130 235 L190 235', 'M128 232 Q160 246 192 232', 'M122 228 Q160 256 198 228'][level - 1]
    eyes = ['<circle cx="128" cy="170" r="6" fill="#2a2038"/><circle cx="192" cy="170" r="6" fill="#2a2038"/>',
            '<path d="M112 172 Q128 158 144 172 M176 172 Q192 158 208 172" ' + st + '/><circle cx="128" cy="172" r="4" fill="#2a2038"/><circle cx="192" cy="172" r="4" fill="#2a2038"/>',
            '<path d="M110 170 Q128 152 146 170 M174 170 Q192 152 210 170" ' + st + '/><circle cx="128" cy="172" r="5" fill="#2a2038"/><circle cx="192" cy="172" r="5" fill="#2a2038"/>'][level - 1]
    brow = ['M108 140 L148 140 M172 140 L212 140', 'M108 144 Q128 130 148 142 M172 142 Q192 130 212 144', 'M106 146 Q128 128 150 142 M170 142 Q192 128 214 146'][level - 1]
    hair = ['M92 120 Q160 40 228 120', 'M88 126 Q96 56 160 52 Q226 56 232 126 Q200 90 160 96 Q122 90 88 126', 'M86 130 Q92 50 160 46 Q230 50 234 130 Q206 84 160 92 Q118 84 86 130'][level - 1]
    right = ' stroke-dasharray="3 12" opacity=".5"' if level == 3 else ''
    return (f'<svg id="{pid}" class="abs" style="left:{x}px;top:{y}px;z-index:6" width="320" height="320" viewBox="0 0 320 320">'
            f'<path class="dw" d="M100 130 Q96 250 160 276 Q224 250 220 130" {st}/><path class="dw" d="{hair}" {st}/><path class="dw" d="{brow}" {st}/>{eyes}<path class="dw" d="{mouth}" {st}/>'
            f'<path class="dw" d="M160 175 Q172 200 158 206" {st}/><path class="dw" d="M88 270 Q160 300 232 270" {st}{right}/></svg>')
ruled = ''.join(f'<div class="abs" style="left:30px;right:30px;top:{70 + i * 56}px;height:2px;background:rgba(90,120,160,.28)"></div>' for i in range(20))
pencil = '<div id="pen" class="abs" style="left:380px;top:360px;width:230px;height:26px;background:linear-gradient(90deg,#e0a526 0 80%,#f2d2a0 80% 92%,#222 92%);border-radius:4px;z-index:20;transform:rotate(-40deg);box-shadow:0 10px 18px rgba(0,0,0,.4)"></div>'
nb = (f'<div id="nbk" class="abs" style="left:100px;top:210px;width:880px;height:1180px;background:#f4efe6;border-radius:12px;transform:rotate(-1.5deg);box-shadow:0 40px 90px rgba(0,0,0,.65);z-index:5">{ruled}'
      '<div class="abs" style="left:60px;top:0;width:3px;height:100%;background:rgba(210,90,90,.45)"></div></div>')
av = lambda key, e, left, top, ident: f'<div id="{ident}" class="abs" style="left:{left}px;top:{top}px;z-index:30;opacity:.0;border-radius:50%;background:rgba(20,16,28,.7);padding:6px;box-shadow:0 0 0 4px rgba(255,196,112,.0)">{G.head_icon(G.CHARS[key], e, 150)}</div>'
body = ('<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:radial-gradient(ellipse at 50% 30%,#3a2417 0%,#150f16 75%)"></div>' + nb + portrait('pt1', 140, 270, 1) + portrait('pt2', 560, 480, 2) + portrait('pt3', 200, 830, 3) + pencil +
        av('meera', 'neutral', 40, 40, 'av_m') + av('priya', 'neutral', 860, 40, 'av_p') + vignette())
scene('S5a', s5a0, s5a1, body); cam('S5a', s5a0, s5a1, 1.0, 1.07)
dr_t = vis1('S5_draw') - s5a0
for i in (1, 2, 3):
    a = s5a0 + (i - 1) * (dr_t / 3.0)
    P.frm(f'#pt{i} .dw', {'strokeDasharray': 900, 'strokeDashoffset': 900}, {'strokeDashoffset': 0, 'duration': dr_t / 3 * .9, 'ease': 'power1.inOut', 'stagger': .12}, a)
    P.frm(f'#pt{i}', {'opacity': 1}, {'opacity': 1, 'duration': .01}, a)
    fx(a + .1, 'tap/knuckle', .35); fx(a + .5, 'tap/soft', .3)
for sel in ('#pt1', '#pt2', '#pt3'): P.st(sel + ' circle', {'opacity': 0}, s5a0);
for i in (1, 2, 3):
    P.to(f'#pt{i} circle', {'opacity': 1, 'duration': .2}, s5a0 + (i - 1) * (dr_t / 3.0) + dr_t / 3 * .6)
P.frm('#pen', {'x': 0, 'y': 0}, {'x': 90, 'y': 420, 'duration': dr_t, 'ease': 'sine.inOut'}, s5a0)
for ident, line in (('av_m', 'm06'), ('av_p', 'p08')):
    P.frm('#' + ident, {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .2}, T[line][0] - .1); P.to('#' + ident, {'opacity': 0, 'duration': .2}, T[line][1] + .1)
    P.to('#' + ident, {'boxShadow': '0 0 0 14px rgba(255,196,112,.55)', 'duration': .25, 'yoyo': True, 'repeat': 3}, T[line][0])
P.to('#nbk', {'boxShadow': '0 0 120px rgba(255,170,80,.7)', 'duration': 1.0}, T['n01'][0])

# ------------------------------------------------------------------ SCENE 5b: sunk cost (Krish & Ankush)
s5b0, s5b1 = s5a1, MK['S6']
body = cafe('c7') + char('s5b_k', 'krish', 20, 830, 480, s5b0, s5b1, z=9, start='neutral') + char('s5b_a', 'ankush', 540, 800, 500, s5b0, s5b1, z=9, start='smirk') + table() + vignette()
scene('S5b', s5b0, s5b1, body); cam('S5b', s5b0, s5b1, 1.0, 1.06)
for l, i in (('k06', 'k'), ('a07', 'a'), ('k07', 'k'), ('k08', 'k'), ('a08', 'a'), ('k09', 'k')): say(l, 's5b_' + i)
ex('s5b_a', 'smirk', T['a07'][0]); ex('s5b_k', 'smirk', T['k07'][0]); ex('s5b_k', 'smile', T['k08'][0]); ex('s5b_a', 'worried', T['a08'][0]); ex('s5b_k', 'deadpan', T['k09'][0]); ex('s5b_a', 'neutral', T['k09'][0] + 1.0)

# ------------------------------------------------------------------ SCENE 6: new layer (Krish watching Priya)
s6a, s6b = MK['S6'], MK['S7']
body = (cafe('c8') + char('s6_p', 'priya', 360, 330, 360, s6a, s6b, z=6, start='worried', extra='filter:blur(5px) saturate(.9);opacity:.9') +
        '<div class="abs" style="left:440px;top:650px;width:200px;height:130px;border-radius:18px;background:linear-gradient(160deg,#ff9a4d,#5a8dff);opacity:.5;filter:blur(18px);z-index:7"></div>' +
        char('s6_k', 'krish', 20, 830, 480, s6a, s6b, z=9, start='neutral') + char('s6_a', 'ankush', 540, 800, 500, s6a, s6b, z=9, start='neutral') + table() + vignette())
scene('S6', s6a, s6b, body); cam('S6', s6a, s6b, 1.02, 1.1, 0, 20, 0, 0)
say('k10', 's6_k'); say('a09', 's6_a'); say('k11', 's6_k')
ex('s6_a', 'smirk', T['a09'][0]); ex('s6_k', 'smile', T['k11'][0]); ex('s6_a', 'neutral', T['k11'][0] + .2)

# ------------------------------------------------------------------ SCENE 7: the realisation
s7a, s7b = MK['S7'], MK['S8']
msgcards = ('<div id="cardA" class="abs" style="left:90px;top:170px;width:900px;height:200px;border-radius:40px;background:#232a44;z-index:10;box-shadow:0 18px 50px rgba(0,0,0,.5)">'
            '<div class="abs" style="left:30px;top:50px;width:100px;height:100px;border-radius:50%;background:#7fb2ff;font:800 56px/100px Inter;color:#14101c;text-align:center">A</div>'
            '<div class="abs" style="left:160px;top:34px;font:800 34px Inter;color:#9fc0ff">Aman · 2 days ago</div><div class="abs" style="left:160px;top:92px;width:720px;font:600 42px/1.2 Inter;color:#fff">Presentation okay? Tell me everything.</div></div>'
            '<div id="cardR" class="abs" style="left:90px;top:410px;width:900px;height:200px;border-radius:40px;background:#3a2a2a;z-index:10;box-shadow:0 18px 50px rgba(0,0,0,.5)">'
            '<div class="abs" style="left:30px;top:50px;width:100px;height:100px;border-radius:50%;background:#ff8c3c;font:800 56px/100px Inter;color:#14101c;text-align:center">R</div>'
            f'<div class="abs" style="left:160px;top:34px;font:800 34px Inter;color:#ffb070">Rohan · now</div><div class="abs" style="left:160px;top:92px;font:600 46px Inter;color:#fff">hey stranger{SMILEY}</div>'
            '<svg id="heart" class="abs" style="left:790px;top:60px" width="80" height="80" viewBox="0 0 24 24"><path d="M12 21s-7-4.6-9.5-9C.8 8.5 2.6 5 6 5c2 0 3.4 1.2 4 2.4C10.6 6.2 12 5 14 5c3.4 0 5.2 3.500 3.5 7C19 16.4 12 21 12 21z" fill="#ff4f6d"/></svg></div>')
def page(pid, bub, tilt):
    return (f'<div id="{pid}" class="abs pg" style="left:150px;top:150px;width:780px;height:640px;background:#f4efe6;border-radius:14px;z-index:12;transform:rotate({tilt}deg);box-shadow:0 30px 70px rgba(0,0,0,.6);opacity:0">'
            f'<div class="abs" style="left:40px;top:60px;width:300px">{portrait(pid + "i", 0, 0, 2).replace("left:0px;top:0px;z-index:6", "left:0;top:0")}</div>'
            f'<div class="abs" style="left:350px;top:80px;width:380px;padding:26px 28px;border:5px solid #2a2038;border-radius:30px;font:italic 700 46px/1.15 Inter;color:#2a2038">{bub}</div></div>')
pages = page('pgA', 'how did it go?', -2) + page('pgB', 'tell me everything', 2) + page('pgC', 'how’d it go?', -1)
msgs_bg = '<div class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:linear-gradient(180deg,#101830,#18122a 60%,#0d0a14)"></div><div class="abs" style="left:620px;top:80px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(255,150,60,.35),transparent 65%)"></div><div class="abs" style="left:-100px;top:1000px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(255,140,60,.2),transparent 65%)"></div>'
sofa = '<div class="abs" style="left:560px;top:1230px;width:540px;height:330px;border-radius:60px 60px 0 0;background:#3a2a52;z-index:5"></div>'
fphone = ('<div id="fph" class="abs" style="left:380px;top:1450px;width:300px;height:520px;z-index:25;opacity:0;perspective:900px"><div id="fphi" class="abs" style="left:0;top:0;width:300px;height:520px;border-radius:44px;background:linear-gradient(160deg,#ff9a4d,#5a8dff);border:8px solid #2b2c38;transform-style:preserve-3d"></div></div>')
tx = ('<div id="tb1" class="bub bout" style="left:130px;top:260px;font-size:50px;z-index:30;opacity:0">It went well. Coffee?</div><div id="tb2" class="bub" style="left:150px;top:420px;font-size:50px;z-index:30;opacity:0;background:#2f3f66">Yes. Tell me how it went.</div>')
body = (msgs_bg + msgcards + pages + tx + sofa + char('s7_m', 'meera', 640, 1040, 380, s7a, s7b, z=6, start='deadpan') + char('s7_p', 'priya', 40, 900, 540, s7a, s7b, z=9, pose='hug', start='neutral') +
        '<div class="abs" style="left:-420px;top:1500px;width:1920px;height:520px;background:linear-gradient(180deg,#2a1f33,#120d18);z-index:11"></div>' + fphone +
        '<div id="dim" class="abs" style="left:-420px;top:-100px;width:1920px;height:2120px;background:rgba(5,8,20,.0);z-index:18"></div>' + vignette())
scene('S7', s7a, s7b, body); cam('S7', s7a, s7b, 1.0, 1.08, 0, 0, 0, -20)
P.frm('#cardA', {'opacity': 0, 'x': -80}, {'opacity': 1, 'x': 0, 'duration': .35}, s7a + .1); P.frm('#cardR', {'opacity': 0, 'x': 80}, {'opacity': 1, 'x': 0, 'duration': .35}, s7a + .25)
P.st('#cardR', {'filter': 'blur(9px)'}, s7a); P.st('#cardA', {'filter': 'blur(0px)'}, s7a)
P.to('#cardA', {'filter': 'blur(9px)', 'duration': .4}, s7a + 1.1); P.to('#cardR', {'filter': 'blur(0px)', 'duration': .4}, s7a + 1.1)
P.to('#heart', {'scale': 1.5, 'duration': .18, 'yoyo': True, 'repeat': 3, 'transformOrigin': '50% 50%'}, s7a + 1.45)
ex('s7_p', 'smile', s7a + .3); ex('s7_p', 'stunned', s7a + 1.5); ex('s7_p', 'worried', s7a + 2.1)
fx(s7a + .2, 'notify/mid_tine', .6); fx(s7a + 1.5, 'pro_pop/thup', 1.0)
P.to('#cardA,#cardR', {'opacity': 0, 'duration': .3}, T['p10'][0] - .2)
say('p09', 's7_p'); say('m07', 's7_m'); say('p10', 's7_p'); say('p11', 's7_p'); say('p12', 's7_p'); say('m08', 's7_m'); say('p13', 's7_p'); say('m09', 's7_m'); say('p14', 's7_p'); say('m10', 's7_m')
ex('s7_m', 'smirk', T['m07'][0]); ex('s7_p', 'hurt', T['p10'][0]); ex('s7_p', 'worried', T['p11'][0]); ex('s7_p', 'neutral', vis0('S7_silence')); ex('s7_p', 'hurt', T['p12'][0]); ex('s7_m', 'neutral', T['m08'][0])
ex('s7_p', 'deadpan', T['p13'][0]); ex('s7_m', 'smirk', T['m09'][0]); ex('s7_p', 'worried', T['p14'][0]); ex('s7_m', 'smile', T['m10'][0])
t_pg = vis0('S7_pages'); step = (T['p11'][1] - t_pg) / 3
for i, pid in enumerate(('pgA', 'pgB', 'pgC')):
    a = t_pg + i * step
    P.frm(f'#{pid}', {'opacity': 0, 'rotationY': 80, 'x': 180}, {'opacity': 1, 'rotationY': 0, 'x': 0, 'duration': .32, 'ease': 'power3.out', 'transformPerspective': 900}, a); fx(a, 'swish/soft', .8)
    P.to(f'#{pid}', {'opacity': 0, 'duration': .15}, a + step if i < 2 else T['p14'][0] - .2)
P.to('#pgCi', {'filter': 'drop-shadow(0 0 22px rgba(255,170,80,.9))', 'duration': .5}, T['p12'][0])
# face-down phone
fd = vis0('S7_facedown')
P.frm('#fph', {'opacity': 0, 'y': 150}, {'opacity': 1, 'y': 0, 'duration': .3}, fd)
P.to('#fphi', {'rotationX': 180, 'duration': .45, 'ease': 'power3.in', 'transformPerspective': 900}, fd + .3)
P.to('#fphi', {'background': '#15161d', 'duration': .05}, fd + .55)
P.to('#fph', {'y': 30, 'duration': .08, 'yoyo': True, 'repeat': 1}, fd + .72)
fx(fd + .72, 'impact/deep', 1.5); fx(fd + .72, 'cut_hit/sub', .8)
P.to('#dim', {'background': 'rgba(5,8,20,.35)', 'duration': .4}, fd + .72)
pop('#tb1', fd + 1.1, .3, .8); pop('#tb2', fd + 1.7, .3, .8); fx(fd + 1.1, 'ui_pop/blip', .9); fx(fd + 1.7, 'notify/mid_tine', .8)
ex('s7_p', 'smile', fd + 1.7)

# ------------------------------------------------------------------ SCENE 8: coda + pull-back (Episode 2 plant)
s8a = MK['S8']
glassbg = cafe('c9')
back = ''.join(char(f'bk_{n}', k, x, 600, 230, s8a, DUR, z=6, start='smile', extra='filter:blur(2.5px)') for n, k, x in (('p', 'priya', 90), ('m', 'meera', 310), ('a', 'aman', 530)))
couple = (char('ex_a', 'extra_a', 1140, 700, 260, s8a, DUR, z=6, start='deadpan', extra='filter:blur(1.5px)') + char('ex_b', 'extra_b', 1370, 720, 250, s8a, DUR, z=6, start='deadpan', extra='filter:blur(1.5px)') +
          '<div id="cg1" class="abs" style="left:1210px;top:880px;width:120px;height:150px;border-radius:20px;background:linear-gradient(160deg,#cfe0ff,#6a8dff);opacity:.8;filter:blur(2px);z-index:8"></div>'
          '<div id="cg2" class="abs" style="left:1440px;top:890px;width:110px;height:140px;border-radius:20px;background:linear-gradient(160deg,#cfe0ff,#6a8dff);opacity:.8;filter:blur(2px);z-index:8"></div>'
          '<div class="abs" style="left:1100px;top:1000px;width:520px;height:30px;background:#3a2a22;z-index:7"></div>')
kph = ('<div id="kph" class="abs" style="left:150px;top:1500px;width:210px;height:300px;border-radius:30px;background:#0e0f16;border:7px solid #2b2c38;z-index:30;opacity:0;box-shadow:0 0 70px rgba(70,130,255,.7)">'
       '<div class="abs" style="left:10px;top:10px;right:10px;bottom:10px;border-radius:22px;background:linear-gradient(160deg,#6a8dff,#2f3f66)"></div>'
       '<div class="abs" style="left:24px;top:40px;font:700 30px Inter;color:#fff">hey</div><div class="abs" style="left:24px;top:200px;font:800 20px Inter;color:#cfe0ff;letter-spacing:.1em">DRAFT 4</div></div>')
bigbg = ('<div class="abs" style="left:-1600px;top:-1300px;width:5200px;height:5200px;background:linear-gradient(180deg,#14132a 0%,#1b1a33 30%,#201a2e 50%,#2a1b22 62%,#150f16 100%)"></div>''<div class="abs" style="left:-1600px;top:1500px;width:5200px;height:2400px;background:linear-gradient(180deg,#5a3a2a,#2d1c17);z-index:2"></div>')
body = (bigbg + glassbg + '<div class="abs" style="left:1060px;top:150px;width:1000px;height:760px;border-radius:22px;background:linear-gradient(90deg,rgba(40,60,120,.35),rgba(70,130,255,.3));border:6px solid #3a2f3c"></div>' + back + couple +
        char('s8_k', 'krish', 20, 830, 480, s8a, DUR, z=9, start='neutral') + char('s8_a', 'ankush', 540, 800, 500, s8a, DUR, z=9, start='neutral') + table() +
        '<div class="abs" style="left:-1600px;top:1500px;width:5200px;height:2400px;background:linear-gradient(180deg,#5a3a2a,#2d1c17);z-index:7"></div>' + kph + vignette() +
        '<div id="fade" class="abs" style="left:-1200px;top:-300px;width:4000px;height:2800px;background:#000;opacity:0;z-index:90"></div>')
scene('S8', s8a, DUR, body)
P.frm('#bk_p,#bk_m,#bk_a', {'x': -520, 'opacity': 0}, {'x': 0, 'opacity': 1, 'duration': 1.6, 'ease': 'power2.out', 'stagger': .12}, s8a + .1)
for inst in ('bk_p', 'bk_m', 'bk_a'): P.to(f'#{inst}', {'y': 6, 'duration': .3, 'yoyo': True, 'repeat': 5}, s8a + .2)
fx(s8a + .3, 'whoosh_fast/crisp', .5)
ex('bk_p', 'laugh', s8a + 1.6); ex('bk_m', 'smirk', s8a + 1.6); ex('bk_a', 'smile', s8a + 1.8)
say('a10', 's8_a'); say('k12', 's8_k'); say('a11', 's8_a'); say('k13', 's8_k'); say('a12', 's8_a'); say('k14', 's8_k'); say('a13', 's8_a'); say('k15', 's8_k'); say('a14', 's8_a')
ex('s8_a', 'smile', T['a10'][0]); ex('s8_k', 'neutral', T['k12'][0]); ex('s8_a', 'smirk', T['a11'][0]); ex('s8_k', 'smirk', T['k13'][0])
tp = vis0('S8_phone')
ex('s8_k', 'worried', tp); ex('s8_a', 'neutral', tp + .2); ex('s8_a', 'smirk', T['a12'][0]); ex('s8_k', 'deadpan', T['k14'][0]); ex('s8_a', 'smirk', T['a13'][0]); ex('s8_k', 'hurt', T['k15'][0]); ex('s8_a', 'smile', T['a14'][0]); ex('s8_k', 'neutral', T['a14'][1] + .2)
P.frm('#kph', {'opacity': 0, 'y': 80}, {'opacity': 1, 'y': 0, 'duration': .3}, tp); fx(tp, 'notify/mid_tine', .9)
P.to('#kph', {'opacity': 0, 'duration': .3}, T['n02'][0] - .1)
P.to('#cg1,#cg2', {'opacity': .45, 'duration': .5, 'yoyo': True, 'repeat': 9}, s8a)
cam('S8', s8a, vis0('S8_pullback'), 1.0, 1.04)
pb0 = vis0('S8_pullback')
pb_s = T['n02'][0] + .5
P.frm('#S8_cam', {'scale': 1.04, 'x': 0, 'y': 0}, {'scale': .66, 'x': -330, 'y': 150, 'duration': DUR - .9 - pb_s, 'ease': 'power2.inOut', 'immediateRender': False}, pb_s)
P.to('#fade', {'opacity': 1, 'duration': .7}, DUR - .8)

# ------------------------------------------------------------------ subtitles (burned in) + SRT
srt, k = [], 1
def fmt(t): return '%02d:%02d:%02d,%03d' % (int(t // 3600), int(t // 60) % 60, int(t) % 60, int(round((t % 1) * 1000)) % 1000)
subs = ''
for lid, (a, b) in sorted(T.items(), key=lambda kv: kv[1][0]):
    text = CL[lid]['text'].replace('...', '…').strip()
    sents = re.split(r'(?<=[.?!…])\s+', text); sents = [s for s in sents if s]
    tot = sum(len(s) for s in sents) or 1; cur = a
    for j, s in enumerate(sents):
        dur = (b - a) * len(s) / tot; i0, i1 = cur, cur + dur; cur = i1
        sid = f'sb{lid}_{j}'; narr = lid.startswith('n')
        subs += f'<div id="{sid}" class="sub{" n" if narr else ""}">{s.replace(chr(39), "’")}</div>'
        P.st('#' + sid, {'opacity': 1}, round(i0 - .03, 3)); P.st('#' + sid, {'opacity': 0}, round(i1 + (.12 if j == len(sents) - 1 else 0), 3))
        srt.append(f'{k}\n{fmt(max(0, i0 - .03))} --> {fmt(i1 + .08)}\n{s}\n'); k += 1
# the voice-over lines are subtitled but have no on-screen speaker mouth
P.add(f'<div class="abs" style="left:0;top:0;width:1080px;height:1920px;z-index:60;pointer-events:none">{subs}</div><div id="grain"></div>')
P.to('#grain', {'backgroundPosition': '-9000px -6000px', 'duration': DUR, 'ease': f'steps({int(DUR * 24)})'}, 0)
open(HERE + '/../ep001.srt', 'w').write('\n'.join(srt))

# ------------------------------------------------------------------ rig animation: expressions, lip-sync (REAL audio envelope), blinks, idle sway, nods
for inst, evs in EXPR.items():
    last = None
    for t, name in sorted(evs, key=lambda e: e[0]):
        if name != last: P.st(f'#{inst}_F', {'attr': {'data-e': name}}, t); last = name
def expr_at(inst, t):
    cur = 'neutral'
    for tt, n in sorted(EXPR[inst], key=lambda e: e[0]):
        if tt <= t: cur = n
    return cur
for inst, lid in TALK:
    env = rig.envelope(f'{HERE}/../audio/clips/{lid}.wav'); t0 = T[lid][0]; prev = None
    for i, s in enumerate(env):
        if s != prev: P.st(f'#{inst}_F', {'attr': {'data-m': s}}, round(t0 + i / 24, 3)); prev = s
    P.st(f'#{inst}_F', {'attr': {'data-m': 0}}, round(t0 + len(env) / 24 + .02, 3))
    P.to(f'#{inst}_head', {'y': -5, 'duration': .09, 'yoyo': True, 'repeat': 1}, t0)
for inst, (a, b) in SPAN.items():
    t = a + random.uniform(.8, 2.0)
    while t < b - .3:
        P.st(f'#{inst}_F', {'attr': {'data-b': 1}}, round(t, 3)); P.st(f'#{inst}_F', {'attr': {'data-b': 0}}, round(t + .11, 3)); t += random.uniform(2.2, 4.2)
    n = max(0, int((b - a) / 2.6) - 1); ph = random.choice([-1, 1])
    P.frm(f'#{inst}_head', {'rotation': -1.2 * ph, 'svgOrigin': '0 -468'}, {'rotation': 1.2 * ph, 'svgOrigin': '0 -468', 'duration': 2.6, 'yoyo': True, 'repeat': min(n, 40), 'ease': 'sine.inOut'}, a)
    P.frm(f'#{inst}_body', {'scaleY': 1.0, 'svgOrigin': '0 -300'}, {'scaleY': 1.012, 'svgOrigin': '0 -300', 'duration': 2.1, 'yoyo': True, 'repeat': min(max(0, int((b - a) / 2.1) - 1), 50), 'ease': 'sine.inOut'}, a)

P.css.append(CSS)
P.add('')
out = P.write()
os.makedirs(P.dir + '/assets', exist_ok=True)
if not os.path.exists(P.dir + '/assets/noise.png'): shutil.copy('/root/hf-shorts/fp3/assets/noise.png', P.dir + '/assets/noise.png')
json.dump({'dur': DUR, 'fx': FX}, open(HERE + '/../audio/fx_events.json', 'w'))
print('built', out, 'dur', DUR, 'sfx events', len(FX), 'talk', len(TALK), 'js', len(P.js))
