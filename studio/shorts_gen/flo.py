import sys
sys.path.insert(0, '/root/hf-shorts')
from common import *

words = load_words('/root/hf-shorts/fl_words.json')
DUR = 67.0
P = Proj('flo', DUR, words)
t = lambda w, n=0: W_(words, w, n)

P.css.append(f"""
#bg{{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 62%,#3a0f2e 0%,#1a0a1c 46%,{INK} 82%)}}
#sun{{position:absolute;left:290px;top:760px;width:500px;height:500px;border-radius:50%;
background:linear-gradient(180deg,#ffd36b 0%,#ff7a59 45%,#ff3d7a 100%);opacity:.28}}
#grid{{position:absolute;left:-400px;right:-400px;top:1130px;height:420px;
background:repeating-linear-gradient(90deg,rgba(255,79,109,.55) 0 3px,transparent 3px 80px),repeating-linear-gradient(0deg,rgba(255,79,109,.45) 0 3px,transparent 3px 70px);
transform:perspective(420px) rotateX(62deg);transform-origin:50% 0;opacity:.35;
-webkit-mask-image:linear-gradient(180deg,#000 0%,transparent 95%)}}
.panel{{position:absolute;left:60px;top:250px;width:960px;height:720px;border-radius:26px;overflow:hidden;opacity:0;box-shadow:0 0 0 4px rgba(255,243,230,.9),0 30px 80px rgba(0,0,0,.7)}}
.panel video{{position:absolute;left:0;top:0;width:960px;height:720px;object-fit:cover;filter:grayscale(.25) sepia(.6) saturate(1.6) contrast(1.18) brightness(.95)}}
.panel .tint{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,79,109,.16),rgba(255,179,71,.14))}}
.panel .scan{{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 2px,transparent 2px 5px)}}
.tag{{position:absolute;font-family:Oswald;font-weight:700;letter-spacing:.22em;font-size:30px;color:{INK};background:{AMBER};padding:8px 20px;border-radius:6px;text-transform:uppercase}}
.year{{position:absolute;left:0;right:0;text-align:center;font-family:Anton;font-size:250px;color:{CORAL};text-shadow:0 0 40px rgba(255,79,109,.65),0 8px 0 rgba(0,0,0,.6);line-height:1}}
.stat{{position:absolute;left:0;right:0;text-align:center;font-family:Anton;font-size:210px;color:{CREAM};line-height:1;text-shadow:0 8px 0 rgba(0,0,0,.7)}}
.sub{{position:absolute;left:0;right:0;text-align:center;font-family:Oswald;font-weight:700;font-size:40px;letter-spacing:.2em;color:{AMBER};text-transform:uppercase}}
.neon{{font-family:Anton;color:#fff;text-align:center;text-shadow:0 0 12px #fff,0 0 30px {CORAL},0 0 70px {CORAL}}}
""")

P.add('<div id="bg"></div><div id="sun"></div><div id="grid"></div>')
P.to('#grid', {'backgroundPosition': '0px 0px,0px 5600px', 'duration': DUR, 'ease': 'none'}, 0)
P.add('<div id="cam" style="position:absolute;inset:0">')

# ---- helpers ---------------------------------------------------------------
def panel(pid, clip, t0, t1, top=250, mstart=0, tag=None, zoom=(1.0, 1.18)):
    P.add(f'<div class="panel" id="{pid}" style="top:{top}px"><video id="{pid}v" class="clip" src="assets/clips/{clip}.mp4" '
          f'data-start="{t0:.2f}" data-duration="{t1-t0:.2f}" data-media-start="{mstart}" muted playsinline></video>'
          f'<div class="tint"></div><div class="scan"></div>'
          + (f'<div class="tag" style="left:22px;bottom:20px;font-size:22px;padding:6px 14px;background:rgba(18,7,18,.8);color:{CREAM}">{tag}</div>' if tag else '') + '</div>')
    P.frm(f'#{pid}', {'opacity': 0, 'y': 60, 'scale': .94}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .35, 'ease': 'power3.out'}, t0)
    P.frm(f'#{pid}v', {'scale': zoom[0]}, {'scale': zoom[1], 'duration': t1 - t0, 'ease': 'none'}, t0)
    P.to(f'#{pid}', {'opacity': 0, 'duration': .2}, t1 - .2)

def stamp(sid, txt, t0, top, cls='year', color=None, size=None, rot=-4):
    st = (f'top:{top}px;' + (f'color:{color};' if color else '') + (f'font-size:{size}px;' if size else ''))
    P.add(f'<div class="{cls}" id="{sid}" style="{st}opacity:0">{txt}</div>')
    P.frm(f'#{sid}', {'opacity': 0, 'scale': 2.6, 'rotation': rot - 6}, {'opacity': 1, 'scale': 1, 'rotation': rot, 'duration': .22, 'ease': 'power4.in'}, t0)
    shake(t0 + .22)

def shake(t0, amp=14):
    for i, (x, y) in enumerate([(amp, -amp), (-amp, amp), (amp * .6, amp * .5), (0, 0)]):
        P.to('#cam', {'x': x, 'y': y, 'duration': .05, 'ease': 'none'}, t0 + i * .05)

def label(lid, txt, t0, t1, top=150, x=60, color=AMBER):
    P.add(f'<div class="lab" id="{lid}" style="position:absolute;left:{x}px;top:{top}px;font-size:34px;color:{color};opacity:0">{txt}</div>')
    P.frm(f'#{lid}', {'opacity': 0, 'x': -40}, {'opacity': 1, 'x': 0, 'duration': .3, 'ease': 'power2.out'}, t0)
    P.to(f'#{lid}', {'opacity': 0, 'duration': .15}, t1 - .15)

def tw(sel_id, txt, t0, per=.045, tp=None):
    """typewriter via per-char spans fading in"""
    spans = ''.join(f'<span id="{sel_id}_{i}" style="opacity:0">{c if c != " " else "&nbsp;"}</span>' for i, c in enumerate(txt))
    return spans, [(f'#{sel_id}_{i}', t0 + i * per) for i in range(len(txt))]

def svg_truck(x, y, scale=1):
    return f'''<svg class="abs" width="520" height="300" viewBox="0 0 520 300" style="left:{x}px;top:{y}px;transform:scale({scale})">
<rect x="10" y="40" width="340" height="170" rx="14" fill="#e9f3f6" stroke="#0b0b17" stroke-width="6"/>
<rect x="350" y="90" width="150" height="120" rx="14" fill="#cfe3ea" stroke="#0b0b17" stroke-width="6"/>
<rect x="378" y="105" width="90" height="48" rx="6" fill="#52b7d6" stroke="#0b0b17" stroke-width="5"/>
<g stroke="#2a8fb0" stroke-width="7" stroke-linecap="round"><path d="M180 78v94M133 98l94 54M133 152l94-54"/></g>
<circle cx="100" cy="225" r="38" fill="#222" stroke="#0b0b17" stroke-width="6"/><circle cx="100" cy="225" r="14" fill="#999"/>
<circle cx="400" cy="225" r="38" fill="#222" stroke="#0b0b17" stroke-width="6"/><circle cx="400" cy="225" r="14" fill="#999"/>
</svg>'''

def svg_boat(bid, x, y, sc=1, col=CREAM):
    return f'''<svg id="{bid}" class="abs" width="140" height="110" viewBox="0 0 140 110" style="left:{x}px;top:{y}px;transform:scale({sc});opacity:0">
<path d="M10 70h120l-18 28H30z" fill="{col}" stroke="#0b0b17" stroke-width="5"/><path d="M66 12v54M66 12l44 48H66z" fill="{AMBER}" stroke="#0b0b17" stroke-width="5" stroke-linejoin="round"/></svg>'''

def svg_moto(mid, x, y, sc=1):
    return f'''<svg id="{mid}" class="abs" width="360" height="240" viewBox="0 0 360 240" style="left:{x}px;top:{y}px;transform:scale({sc});opacity:0">
<circle cx="70" cy="170" r="52" fill="none" stroke="{CREAM}" stroke-width="12"/><circle cx="290" cy="170" r="52" fill="none" stroke="{CREAM}" stroke-width="12"/>
<path d="M70 170L140 100h90l60 70M140 100l-20-40h50M230 100l30-50h40" fill="none" stroke="{CORAL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="168" cy="52" r="24" fill="{CREAM}"/><path d="M150 76l-40 52 60 24 32-48z" fill="{CREAM}" opacity=".92"/>
</svg>'''

def svg_palm(x, y, sc=1, col='#07030a'):
    return f'''<svg class="abs" width="320" height="560" viewBox="0 0 320 560" style="left:{x}px;top:{y}px;transform:scale({sc});transform-origin:0 100%">
<path d="M160 560C150 420 170 300 158 190" stroke="{col}" stroke-width="16" fill="none" stroke-linecap="round"/>
<g fill="{col}"><path d="M158 190C90 130 30 140 0 190C60 160 110 170 158 190z"/><path d="M158 190C110 110 70 80 20 90C80 100 120 140 158 190z"/><path d="M158 190C170 100 200 60 250 40C210 90 190 140 158 190z"/>
<path d="M158 190C230 130 290 140 320 190C260 160 210 170 158 190z"/><path d="M158 190C200 120 250 100 300 110C240 120 200 150 158 190z"/></g></svg>'''

# ---- 0. hook: 1981 / truck / Burger King ----------------------------------------------------
fullbleed(P, 'fbh', 'miami_night.jpg', 0.0, 7.5, op=.42, pos='50% 60%')
c = P.scene('s0', 0, 7.55)
panel('p0', 'miami_aerial', 0.0, 6.25, top=300, tag='Miami · archival footage', zoom=(1.0, 1.25))
stamp('y81', '1981', .15, 40, size=210)
P.add(f'<div class="stat" id="homs" style="top:1030px;font-size:150px;color:{CORAL};opacity:0">0</div>'
      f'<div class="sub" id="homl" style="top:1188px;font-size:34px;opacity:0">murders · Dade County · 1981</div>')
P.frm('#homs', {'opacity': 0, 'scale': .7}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 3.3)
P.frm('#homl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 3.6)
P.counter('#homs', 0, 621, 3.4, 2.4, 'function(v){return Math.round(v).toString()}', 'power2.out')
truck = f'''<svg class="abs" width="520" height="300" viewBox="0 0 520 300" style="left:1100px;top:1252px;transform:scale(.5);transform-origin:0 0"><g id="trkb">
<rect x="10" y="40" width="340" height="170" rx="14" fill="#e9f3f6" stroke="#0b0b17" stroke-width="6"/>
<rect x="350" y="90" width="150" height="120" rx="14" fill="#cfe3ea" stroke="#0b0b17" stroke-width="6"/>
<rect x="378" y="105" width="90" height="48" rx="6" fill="#52b7d6" stroke="#0b0b17" stroke-width="5"/>
<g id="snf" stroke="#2a8fb0" stroke-width="7" stroke-linecap="round"><path d="M180 78v94M133 98l94 54M133 152l94-54"/></g>
<g id="wl"><circle cx="100" cy="225" r="38" fill="#222" stroke="#0b0b17" stroke-width="6"/><circle cx="100" cy="225" r="14" fill="#999"/><path d="M100 195v60M70 225h60" stroke="#888" stroke-width="5"/></g>
<g id="wr"><circle cx="400" cy="225" r="38" fill="#222" stroke="#0b0b17" stroke-width="6"/><circle cx="400" cy="225" r="14" fill="#999"/><path d="M400 195v60M370 225h60" stroke="#888" stroke-width="5"/></g></g></svg>'''
P.add(f'<div id="trk" style="position:absolute;left:0;top:0;opacity:0">{truck}</div>')
P.add(f'<div id="road" class="abs" style="left:0;right:0;top:1390px;height:8px;opacity:0;background:repeating-linear-gradient(90deg,rgba(255,243,230,.75) 0 46px,transparent 46px 92px)"></div>')
P.frm('#road', {'opacity': 0}, {'opacity': 1, 'duration': .2}, 4.15)
P.to('#road', {'backgroundPosition': '-920px 0', 'duration': 2.0, 'ease': 'none'}, 4.15)
P.to('#road', {'opacity': 0, 'duration': .2}, 6.0)
for i in range(4):
    P.add(f'<div id="sl{i}" class="abs" style="left:{1000+i*50}px;top:{1290+i*24}px;width:{200-i*25}px;height:5px;border-radius:3px;background:linear-gradient(90deg,rgba(255,255,255,0),#fff);opacity:0"></div>')
    P.frm(f'#sl{i}', {'opacity': .9, 'x': 0}, {'opacity': 0, 'x': -900, 'duration': 1.5, 'ease': 'none'}, 4.35 + i * .12)
P.frm('#trk', {'opacity': 1, 'x': 0}, {'opacity': 1, 'x': -1420, 'duration': 1.75, 'ease': 'power1.inOut'}, 4.25)
P.to('#trkb', {'y': -3, 'duration': .09, 'yoyo': True, 'repeat': 19, 'ease': 'sine.inOut'}, 4.25)
P.to('#wl', {'rotation': -1500, 'svgOrigin': '100 225', 'duration': 1.75, 'ease': 'power1.inOut'}, 4.25)
P.to('#wr', {'rotation': -1500, 'svgOrigin': '400 225', 'duration': 1.75, 'ease': 'power1.inOut'}, 4.25)
P.to('#snf', {'rotation': 360, 'svgOrigin': '180 125', 'duration': 2.0, 'ease': 'none'}, 4.25)
P.to('#trk', {'opacity': 0, 'duration': .1}, 6.1)
# Burger King punch-in on the word
imgpanel(P, 'bk', 'bk.jpg', 6.12, 7.5, x=60, top=300, w=960, h=720, tag='Burger King', zoom=(1.4, 1.0), pos='50% 30%', enter='none', fs=1.0)
P.add('<div id="bkf" class="abs" style="inset:0;background:#fff;opacity:0;z-index:9"></div>')
P.frm('#bkf', {'opacity': 0}, {'opacity': .55, 'duration': .06, 'yoyo': True, 'repeat': 1}, 6.14)
shake(6.2, 16)
c()

# ---- 1. tease: four stories as image cards ----------------------------------------------------
c = P.scene('s1', 7.5, 14.55)
P.add(f'<div class="lab" id="h4" style="position:absolute;left:0;right:0;top:190px;text-align:center;font-size:56px;opacity:0">4 true stories</div>')
P.frm('#h4', {'opacity': 0, 'scale': 1.6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'power4.in'}, 7.6)
shake(7.85, 8)
cards = [(1, 'police_lights.jpg', '1979', 60, 330), (2, 'keywest.jpg', '1980', 570, 330), (3, 'bales.jpg', 'THE KEYS', 60, 660), (4, 'grisel.jpg', '???', 570, 660)]
for i, img, lab_, x, y in cards:
    mystery = i == 4
    filt = 'blur(11px) brightness(.45) saturate(.6)' if mystery else 'sepia(.35) saturate(1.2) contrast(1.05)'
    P.add(f'<div id="k{i}" class="abs" style="left:{x}px;top:{y}px;width:450px;height:300px;border-radius:22px;overflow:hidden;opacity:0;'
          f'box-shadow:0 0 0 5px {CORAL if mystery else "rgba(255,243,230,.92)"},0 20px 50px rgba(0,0,0,.65)">'
          f'<img src="assets/gta/{img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:{filt}"/>'
          f'<div class="abs" style="left:0;right:0;bottom:0;height:90px;background:linear-gradient(0deg,rgba(18,7,18,.92),rgba(18,7,18,0))"></div>'
          + (f'<div class="big abs" style="left:0;right:0;top:20px;font-size:230px;color:{CORAL};text-shadow:0 0 40px {CORAL}">?</div>' if mystery else '')
          + f'<div class="abs" style="left:16px;top:12px;font-family:Anton;font-size:64px;color:{CORAL if mystery else AMBER};text-shadow:0 4px 0 rgba(0,0,0,.7)">{i}</div>'
          f'<div class="abs" style="right:16px;bottom:12px;font-family:Oswald;font-weight:700;letter-spacing:.14em;font-size:34px;color:{CREAM}">{lab_}</div></div>')
    P.frm(f'#k{i}', {'opacity': 0, 'rotationY': 88, 'scale': .85, 'transformPerspective': 900}, {'opacity': 1, 'rotationY': 0, 'scale': 1, 'transformPerspective': 900, 'duration': .45, 'ease': 'back.out(1.5)'}, 8.3 + (i - 1) * .24)
P.to('#k4', {'boxShadow': f'0 0 0 5px {CORAL},0 0 60px {CORAL}', 'duration': .25, 'yoyo': True, 'repeat': 7, 'ease': 'sine.inOut'}, 11.6)
for j, dx in enumerate([8, -8, 6, -6, 3, 0]):
    P.to('#k4', {'x': dx, 'duration': .04, 'ease': 'none'}, 11.6 + j * .04)
imgpanel(P, 'g1', 'duo.jpg', 9.4, 11.55, x=60, top=1000, w=960, h=300, tag='GTA VI · Rockstar Games', zoom=(1.0, 1.14), pos='50% 55%')
P.add(f'<div class="tag" id="wb" style="left:520px;top:1010px;opacity:0;background:{CORAL};color:#fff;font-size:36px">you won\'t believe</div>')
P.frm('#wb', {'opacity': 0, 'rotation': 8, 'scale': 1.6}, {'opacity': 1, 'rotation': -3, 'scale': 1, 'duration': .25, 'ease': 'power4.in'}, 12.7)
shake(12.95, 10)
c()

# ---- 2. story 1: Dadeland ------------------------------------------------------
c = P.scene('s2', 14.5, 25.3)
label('l1', 'story 1 / 4', 14.6, 25.2)
stamp('y79', '1979', 15.9, 20, size=230)
P.add(f'<div class="sub" id="lt1" style="top:520px;font-size:54px;opacity:0">Dadeland mall · Miami</div>')
P.frm('#lt1', {'opacity': 0, 'y': 30}, {'opacity': 1, 'y': 0, 'duration': .3}, 16.35)
P.to('#lt1', {'opacity': 0, 'duration': .15}, 17.0)
panel('p2', 'police', 17.0, 21.05, top=400, tag='archival footage · illustrative', zoom=(1.05, 1.25))
imgpanel(P, 'i1', 'police_lights.jpg', 21.0, 25.2, x=60, top=400, w=960, h=720, tag='photo · illustrative', zoom=(1.3, 1.0), enter='none')
P.add(f'<div id="flash" class="abs" style="inset:0;background:#fff;opacity:0"></div>')
P.frm('#flash', {'opacity': .0}, {'opacity': .7, 'duration': .06, 'yoyo': True, 'repeat': 1}, 21.0)
shake(21.0, 18)
P.add(f'<div id="dd" class="abs" style="left:60px;right:60px;top:1150px;height:120px;background:{CREAM};border-radius:10px;opacity:0;transform:rotate(-2deg);box-shadow:0 14px 40px rgba(0,0,0,.6)">'
      f'<div class="big" style="font-size:78px;color:#1a0a1c;padding-top:16px;letter-spacing:.04em">DADELAND MASSACRE</div></div>')
P.frm('#dd', {'opacity': 0, 'y': 120}, {'opacity': 1, 'y': 0, 'duration': .3, 'ease': 'power3.out'}, 23.6)
c()

# ---- 3. story 2: Mariel -----------------------------------------------------------
c = P.scene('s3', 25.2, 35.1)
label('l2', 'story 2 / 4', 25.3, 35.0)
stamp('y80', '1980', 26.1, 20, size=230)
P.add(f'<div class="sub" id="lt2" style="top:520px;font-size:54px;opacity:0">Cuba → Florida</div>')
P.frm('#lt2', {'opacity': 0, 'y': 30}, {'opacity': 1, 'y': 0, 'duration': .3}, 26.6)
P.to('#lt2', {'opacity': 0, 'duration': .15}, 27.4)
panel('p3', 'speed2', 27.4, 31.1, top=400, tag='archival footage · illustrative', zoom=(1.0, 1.3))
imgpanel(P, 'i2', 'keywest.jpg', 31.05, 35.0, x=60, top=400, w=960, h=720, tag='photo · illustrative', zoom=(1.3, 1.0), enter='none')
P.add(f'<div class="stat" id="mar" style="top:1150px;font-size:130px;color:{AMBER};opacity:0">0</div>'
      f'<div class="sub" id="marl" style="top:1290px;opacity:0;font-size:36px">people · 5 months · by boat</div>')
P.frm('#mar', {'opacity': 0, 'scale': .7}, {'opacity': 1, 'scale': 1, 'duration': .25}, 30.3)
P.frm('#marl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 31.2)
P.counter('#mar', 0, 125000, 30.45, 1.7, 'function(v){return Math.round(v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,",")}', 'power2.out')
for i in range(5):
    P.add(svg_boat(f'bt{i}', -150, 1340 + (i % 2) * 14, .7 + .08 * (i % 3)))
    P.frm(f'#bt{i}', {'opacity': 0, 'x': 0}, {'opacity': 1, 'x': 1300 + i * 20, 'duration': 3.6 - i * .15, 'ease': 'none'}, 31.3 + i * .3)
c()

# ---- 4. story 3: Keys bales -----------------------------------------------------------
c = P.scene('s4', 35.0, 44.3)
label('l3', 'story 3 / 4', 35.1, 44.2)
stamp('y3', 'THE KEYS', 35.2, 80, size=150, color=TEAL, rot=-3)
panel('p4', 'miami_boat', 35.9, 39.4, top=330, tag='archival footage · illustrative', zoom=(1.0, 1.3))
imgpanel(P, 'i3', 'keylargo.jpg', 39.35, 42.8, x=60, top=330, w=960, h=720, tag='photo · Key Largo', zoom=(1.3, 1.0), enter='none')
imgpanel(P, 'i4', 'bales.jpg', 42.75, 44.2, x=60, top=330, w=960, h=720, tag='photo · archive', zoom=(1.0, 1.2), enter='none')
P.add(f'<svg class="abs" width="1080" height="330" viewBox="0 0 1080 330" style="left:0;top:1070px">'
      f'<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2fe6d0" stop-opacity=".95"/><stop offset="1" stop-color="#0a5a66" stop-opacity=".95"/></linearGradient></defs>'
      f'<rect x="0" y="60" width="1080" height="270" fill="url(#sea)"/><path d="M780 60C860 14 980 22 1080 54V60z" fill="#f3d7a3"/>'
      f'<g id="waves" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="6"><path d="M-120 100q60-30 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0"/><path d="M-180 160q60-30 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0" /></g></svg>')
P.to('#waves', {'x': 120, 'duration': 9, 'ease': 'none'}, 35)
for i in range(5):
    P.add(f'<div id="bale{i}" class="abs" style="left:-140px;top:{1110 + (i%3)*34}px;width:104px;height:90px;background:#caa86a;border:7px solid #5a3d12;border-radius:10px;opacity:0;'
          f'background-image:linear-gradient(90deg,transparent 46%,#5a3d12 46% 54%,transparent 54%),linear-gradient(0deg,transparent 46%,#5a3d12 46% 54%,transparent 54%)"></div>')
    P.frm(f'#bale{i}', {'opacity': 0, 'x': 0, 'rotation': -8}, {'opacity': 1, 'x': 740 + i * 60, 'rotation': 8, 'duration': 3.2 + i * .1, 'ease': 'power1.out'}, 39.4 + i * .28)
    P.to(f'#bale{i}', {'y': -12, 'duration': .45, 'yoyo': True, 'repeat': 5, 'ease': 'sine.inOut'}, 39.5 + i * .28)
P.add(f'<div id="fish" class="abs" style="left:-420px;top:1210px;opacity:0"><svg width="300" height="174" viewBox="0 0 380 220">'
      f'<rect x="40" y="50" width="240" height="120" rx="14" fill="#caa86a" stroke="#5a3d12" stroke-width="8"/><path d="M280 110l80-60v120z" fill="#caa86a" stroke="#5a3d12" stroke-width="8" stroke-linejoin="round"/>'
      f'<circle cx="90" cy="95" r="12" fill="#1a0a1c"/><path d="M50 140q30 20 60 0" stroke="#5a3d12" stroke-width="7" fill="none"/></svg></div>')
P.frm('#fish', {'opacity': 0, 'x': 0}, {'opacity': 1, 'x': 600, 'duration': .5, 'ease': 'back.out(1.6)'}, 42.8)
P.add(f'<div class="year" id="sg" style="top:600px;font-size:116px;color:{AMBER};opacity:0;background:rgba(18,7,18,.78);padding:14px 0">SQUARE GROUPER</div>')
P.frm('#sg', {'opacity': 0, 'scale': 2.6, 'rotation': -9}, {'opacity': 1, 'scale': 1, 'rotation': -3, 'duration': .22, 'ease': 'power4.in'}, 42.85)
shake(43.07)
c()

# ---- 5. story 4: Griselda ----------------------------------------------------------------
c = P.scene('s5', 44.2, 58.5)
label('l4', 'story 4 / 4', 44.3, 58.4, color=CORAL)
stamp('y4', '#4', 44.45, 40, size=260, color=CORAL, rot=-3)
P.add(f'''<div id="fld" class="abs" style="left:90px;top:330px;width:900px;height:720px;opacity:0;transform-origin:0 0">
<div class="abs" style="left:0;top:-54px;width:300px;height:70px;background:#d9c9a8;border-radius:16px 16px 0 0;font-family:Oswald;font-weight:700;letter-spacing:.2em;font-size:30px;color:#3a2a14;padding:16px 24px">CASE FILE</div>
<div class="abs" style="left:0;top:0;width:900px;height:720px;background:#e8dcc0;border-radius:0 24px 24px 24px;box-shadow:0 30px 80px rgba(0,0,0,.7)">
<div class="abs" id="mug" style="left:38px;top:60px;width:340px;height:480px;background:#fff;padding:14px;box-shadow:0 14px 40px rgba(0,0,0,.55);transform:rotate(-4deg);opacity:0">
<img src="assets/gta/grisel.jpg" style="width:312px;height:452px;object-fit:cover;display:block"/>
<div class="abs" style="left:110px;top:-22px;width:120px;height:44px;background:rgba(255,222,120,.82);transform:rotate(3deg)"></div></div>
<div class="abs" id="fn" style="left:420px;top:50px;font-family:Anton;font-size:92px;color:#241606;line-height:1">GRISELDA<br>BLANCO</div>
<div class="abs" id="fs" style="left:420px;top:262px;font-family:Oswald;font-weight:700;letter-spacing:.1em;font-size:27px;color:{CORAL}">"THE COCAINE GODMOTHER"</div>
<div class="abs" style="left:420px;top:350px;width:440px;height:24px;background:#241606"></div><div class="abs" style="left:420px;top:394px;width:380px;height:24px;background:#241606"></div><div class="abs" style="left:420px;top:438px;width:300px;height:24px;background:#241606"></div>
<div class="abs" id="fd" style="left:400px;top:560px;width:470px;height:100px;border:8px solid {CORAL};border-radius:10px;white-space:nowrap;font-family:Anton;font-size:50px;line-height:86px;text-align:center;color:{CORAL};transform:rotate(-6deg);opacity:0">DOZENS OF MURDERS</div>
</div></div>''')
P.add('<div id="cfl" class="abs" style="inset:0;background:#fff;opacity:0;z-index:9"></div>')
P.frm('#fld', {'opacity': 0, 'y': 90, 'rotation': -3}, {'opacity': 1, 'y': 0, 'rotation': 0, 'duration': .5, 'ease': 'power3.out'}, 44.9)
# camera-flash slam of the police photo on "the woman behind"
P.frm('#mug', {'opacity': 0, 'scale': 2.0, 'rotation': 10}, {'opacity': 1, 'scale': 1, 'rotation': -4, 'duration': .25, 'ease': 'power4.in'}, 45.55)
P.frm('#cfl', {'opacity': 0}, {'opacity': .75, 'duration': .05, 'yoyo': True, 'repeat': 1}, 45.78)
shake(45.8, 14)
P.to('#mug', {'scale': 1.04, 'duration': 1.6, 'ease': 'sine.inOut', 'yoyo': True, 'repeat': 3}, 46.2)
for sel, tt in (('#fn', 47.1), ('#fs', 48.7)):
    P.st(sel, {'opacity': 0}, 44.9)
    P.frm(sel, {'opacity': 0, 'x': -30}, {'opacity': 1, 'x': 0, 'duration': .25, 'ease': 'power3.out'}, tt)
shake(47.3, 10)
P.frm('#fd', {'opacity': 0, 'scale': 2.4}, {'opacity': 1, 'scale': 1, 'duration': .2, 'ease': 'power4.in'}, 50.7)
shake(50.9, 12)
P.to('#fld', {'x': -50, 'y': 90, 'scale': .55, 'duration': .45, 'ease': 'power3.inOut'}, 52.55)
imgpanel(P, 'g2', 'bike.jpg', 52.6, 58.3, x=600, top=330, w=400, h=711, tag='GTA VI · Rockstar Games', zoom=(1.0, 1.2))
P.add(f'<div class="tag" id="dbt" style="left:100px;top:1090px;background:{CORAL};color:#fff;opacity:0;font-size:34px;white-space:nowrap">motorcycle drive-by</div>')
P.frm('#dbt', {'opacity': 0, 'x': -50}, {'opacity': 1, 'x': 0, 'duration': .25}, 53.0)
P.to('#dbt', {'opacity': 0, 'duration': .15}, 54.35)
stamp('y12', '2012', 54.4, 1080, size=200, color=CORAL, rot=-2)
P.to('#y12', {'opacity': 0, 'duration': .15}, 56.9)
shake(57.0, 14)
P.to('#g2', {'scale': 1.06, 'duration': .12, 'yoyo': True, 'repeat': 1}, 57.0)
P.add(f'<div class="neon" id="same" style="position:absolute;left:0;right:0;top:1090px;font-size:120px;opacity:0">SAME WAY.</div>')
P.frm('#same', {'opacity': 0, 'scale': 1.8}, {'opacity': 1, 'scale': 1, 'duration': .2, 'ease': 'power4.in'}, 57.55)
shake(57.75, 16)
c()

# ---- 6. outro ----------------------------------------------------------------------------------
fullbleed(P, 'fbo1', 'miami_night.jpg', 58.4, 65.3, op=.55, pos='50% 55%')
fullbleed(P, 'fbo2', 'ocean_neon.jpg', 65.2, 67.0, op=.6, pos='50% 45%')
c = P.scene('s6', 58.4, 67.0)
imgpanel(P, 'g3', 'duo.jpg', 58.45, 65.3, x=60, top=600, w=960, h=620, tag='GTA VI · Rockstar Games', zoom=(1.0, 1.18), pos='50% 40%')
imgpanel(P, 'g4', 'vice.jpg', 65.25, 67.0, x=60, top=600, w=960, h=620, tag='GTA VI · Rockstar Games', zoom=(1.0, 1.1), pos='50% 50%')
P.add(f'<div class="neon" id="o1" style="position:absolute;left:30px;right:30px;top:120px;font-size:126px;line-height:1.02;opacity:0">GTA DIDN\'T<br>INVENT<br>FLORIDA</div>')
P.frm('#o1', {'opacity': 0, 'scale': 1.3}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'power3.out'}, 58.6)
P.to('#o1', {'opacity': 0, 'duration': .15}, 61.0)
P.add(f'<div class="big" id="o2" style="position:absolute;left:30px;right:30px;top:150px;font-size:112px;color:{AMBER};opacity:0">IT JUST<br>TURNED THE<br>VOLUME DOWN</div>')
P.frm('#o2', {'opacity': 0, 'y': 40}, {'opacity': 1, 'y': 0, 'duration': .3, 'ease': 'power3.out'}, 61.1)
P.to('#o2', {'opacity': 0, 'duration': .15}, 62.55)
P.add(f'<div class="neon" id="o3" style="position:absolute;left:0;right:0;top:130px;font-size:170px;line-height:1;opacity:0">GTA VI<div style="font-size:120px;color:{AMBER};text-shadow:0 0 30px {AMBER}">NOV 19</div></div>')
P.frm('#o3', {'opacity': 0, 'scale': 1.5}, {'opacity': 1, 'scale': 1, 'duration': .25, 'ease': 'power4.in'}, 62.6)
shake(62.85, 14)
P.to('#o3', {'opacity': 0, 'duration': .15}, 65.25)
P.add(f'<div class="neon" id="o4" style="position:absolute;left:30px;right:30px;top:130px;font-size:130px;line-height:1.05;opacity:0">WELCOME TO<br><span style="color:{TEAL};text-shadow:0 0 14px {TEAL},0 0 50px {TEAL}">LEONIDA</span></div>')
P.frm('#o4', {'opacity': 0}, {'opacity': 1, 'duration': .08, 'yoyo': True, 'repeat': 5}, 65.3)
P.to('#o4', {'opacity': 1, 'duration': .01}, 65.8)
c()

P.add('</div>')  # cam
P.chrome()
P.captions(y=1420)
P.write()
print('flo ok', len(P.js), 'tl lines')
