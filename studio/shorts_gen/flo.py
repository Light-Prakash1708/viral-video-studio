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

# ---- 0. hook: 1981 / truck --------------------------------------------------
c = P.scene('s0', 0, 7.55)
panel('p0', 'miami_aerial', 0.0, 7.5, top=300, tag='Miami · archival footage', zoom=(1.0, 1.25))
stamp('y81', '1981', .15, 40, size=210)
P.add(f'<div class="stat" id="homs" style="top:1040px;font-size:170px;color:{CORAL};opacity:0">0</div>'
      f'<div class="sub" id="homl" style="top:1225px;opacity:0">murders · Dade County · 1981</div>')
P.frm('#homs', {'opacity': 0, 'scale': .7}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 3.3)
P.frm('#homl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 3.6)
P.counter('#homs', 0, 621, 3.4, 2.4, 'function(v){return Math.round(v).toString()}', 'power2.out')
P.add(f'<div id="trk" style="position:absolute;left:0;top:0;opacity:0">{svg_truck(1140, 560, 1.15)}</div>')
P.frm('#trk', {'opacity': 1, 'x': 0}, {'opacity': 1, 'x': -980, 'duration': 1.1, 'ease': 'power3.out'}, 4.3)
P.to('#trk', {'opacity': 0, 'duration': .2}, 7.3)
P.add(f'<div class="tag" id="trkt" style="left:200px;top:880px;opacity:0">refrigerated truck</div>')
P.frm('#trkt', {'opacity': 0, 'y': 20}, {'opacity': 1, 'y': 0, 'duration': .25}, 5.2)
P.to('#trkt', {'opacity': 0, 'duration': .2}, 7.3)
c()

# ---- 1. tease: four stories ---------------------------------------------------
c = P.scene('s1', 7.5, 14.55)
P.add(f'<div class="lab" id="h4" style="position:absolute;left:0;right:0;top:170px;text-align:center;font-size:44px;opacity:0">4 true stories</div>')
P.frm('#h4', {'opacity': 0, 'y': -30}, {'opacity': 1, 'y': 0, 'duration': .3}, 7.7)
icons = {
    1: f'<path d="M40 200v-90h160v90M60 110V70h120v40M80 200v-40h30v40" fill="none" stroke="{CREAM}" stroke-width="10" stroke-linejoin="round"/>',
    2: f'<path d="M30 140h180l-26 44H56z" fill="{CREAM}"/><path d="M118 50v86M118 50l56 70h-56z" fill="{AMBER}"/>',
    3: f'<rect x="50" y="70" width="140" height="120" rx="10" fill="none" stroke="{CREAM}" stroke-width="10"/><path d="M50 130h140M120 70v120" stroke="{CREAM}" stroke-width="8"/>',
}
pos = {1: (70, 270), 2: (560, 270), 3: (70, 760), 4: (560, 760)}
for i in (1, 2, 3, 4):
    x, y = pos[i]
    inner = icons[i] if i < 4 else f'<text x="120" y="190" text-anchor="middle" font-family="Anton" font-size="190" fill="{CORAL}">?</text>'
    P.add(f'<div id="k{i}" class="abs" style="left:{x}px;top:{y}px;width:450px;height:450px;border-radius:30px;background:rgba(255,243,230,.07);'
          f'border:6px solid {CORAL if i==4 else "rgba(255,243,230,.5)"};opacity:0">'
          f'<svg width="450" height="450" viewBox="0 0 240 240" style="position:absolute;left:0;top:0">{inner}</svg>'
          f'<div class="big" style="position:absolute;left:18px;top:10px;font-size:90px;text-align:left;color:{CORAL if i==4 else AMBER}">{i}</div></div>')
    P.frm(f'#k{i}', {'opacity': 0, 'scale': .6, 'rotation': -6}, {'opacity': 1, 'scale': 1, 'rotation': 0, 'duration': .35, 'ease': 'back.out(2)'}, 8.4 + (i - 1) * .22)
P.to('#k4', {'scale': 1.05, 'boxShadow': f'0 0 60px {CORAL}', 'duration': .25, 'yoyo': True, 'repeat': 5, 'ease': 'sine.inOut'}, 11.6)
P.add(f'<div class="tag" id="wb" style="left:520px;top:1240px;opacity:0;background:{CORAL};color:#fff;font-size:34px">you won\'t believe</div>')
P.frm('#wb', {'opacity': 0, 'rotation': 8, 'scale': 1.6}, {'opacity': 1, 'rotation': -3, 'scale': 1, 'duration': .25, 'ease': 'power4.in'}, 12.7)
shake(12.95, 10)
c()

# ---- 2. story 1: Dadeland ------------------------------------------------------
c = P.scene('s2', 14.5, 25.3)
label('l1', 'story 1 / 4', 14.6, 25.2)
stamp('y79', '1979', 15.9, 20, size=230)
panel('p2', 'police', 17.0, 25.2, top=340, tag='archival footage · illustrative', zoom=(1.05, 1.25))
P.add(f'<div id="flash" class="abs" style="inset:0;background:#fff;opacity:0"></div>')
P.frm('#flash', {'opacity': .0}, {'opacity': .7, 'duration': .06, 'yoyo': True, 'repeat': 1}, 21.0)
shake(21.0, 18)
P.add(f'<div id="dd" class="abs" style="left:60px;right:60px;top:1090px;height:120px;background:{CREAM};border-radius:10px;opacity:0;transform:rotate(-2deg);box-shadow:0 14px 40px rgba(0,0,0,.6)">'
      f'<div class="big" style="font-size:78px;color:#1a0a1c;padding-top:16px;letter-spacing:.04em">DADELAND MASSACRE</div></div>')
P.frm('#dd', {'opacity': 0, 'y': 120}, {'opacity': 1, 'y': 0, 'duration': .3, 'ease': 'power3.out'}, 23.6)
c()

# ---- 3. story 2: Mariel -----------------------------------------------------------
c = P.scene('s3', 25.2, 35.1)
label('l2', 'story 2 / 4', 25.3, 35.0)
stamp('y80', '1980', 26.1, 20, size=230)
panel('p3', 'speed2', 27.4, 35.0, top=340, tag='archival footage · illustrative', zoom=(1.0, 1.3))
P.add(f'<div class="stat" id="mar" style="top:1080px;font-size:140px;color:{AMBER};opacity:0">0</div>'
      f'<div class="sub" id="marl" style="top:1235px;opacity:0;font-size:36px">people · 5 months · by boat</div>')
P.frm('#mar', {'opacity': 0, 'scale': .7}, {'opacity': 1, 'scale': 1, 'duration': .25}, 30.3)
P.frm('#marl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 31.2)
P.counter('#mar', 0, 125000, 30.45, 1.7, 'function(v){return Math.round(v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,",")}', 'power2.out')
for i in range(5):
    P.add(svg_boat(f'bt{i}', -150, 1290 + (i % 2) * 18, .7 + .08 * (i % 3)))
    P.frm(f'#bt{i}', {'opacity': 0, 'x': 0}, {'opacity': 1, 'x': 1300 + i * 20, 'duration': 3.6 - i * .15, 'ease': 'none'}, 31.3 + i * .3)
c()

# ---- 4. story 3: Keys bales -----------------------------------------------------------
c = P.scene('s4', 35.0, 44.3)
label('l3', 'story 3 / 4', 35.1, 44.2)
stamp('y3', 'THE KEYS', 35.2, 80, size=150, color=TEAL, rot=-3)
P.add(f'<svg class="abs" width="1080" height="500" viewBox="0 0 1080 500" style="left:0;top:560px">'
      f'<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2fe6d0" stop-opacity=".9"/><stop offset="1" stop-color="#0a5a66" stop-opacity=".95"/></linearGradient></defs>'
      f'<rect x="0" y="120" width="1080" height="380" fill="url(#sea)"/><path d="M820 120C900 60 1000 70 1080 110V120z" fill="#f3d7a3"/>'
      f'<g id="waves" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="6"><path d="M0 150q60-30 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0"/><path d="M-60 200q60-30 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0" /></g></svg>')
P.to('#waves', {'x': 120, 'duration': 9, 'ease': 'none'}, 35)
for i in range(5):
    P.add(f'<div id="bale{i}" class="abs" style="left:{-140}px;top:{680 + (i%3)*40}px;width:120px;height:104px;background:#caa86a;border:7px solid #5a3d12;border-radius:10px;opacity:0;'
          f'background-image:linear-gradient(90deg,transparent 46%,#5a3d12 46% 54%,transparent 54%),linear-gradient(0deg,transparent 46%,#5a3d12 46% 54%,transparent 54%)"></div>')
    P.frm(f'#bale{i}', {'opacity': 0, 'x': 0, 'rotation': -8}, {'opacity': 1, 'x': 760 + i * 70, 'rotation': 8, 'duration': 3.2 + i * .1, 'ease': 'power1.out'}, 39.4 + i * .28)
    P.to(f'#bale{i}', {'y': -14, 'duration': .45, 'yoyo': True, 'repeat': 5, 'ease': 'sine.inOut'}, 39.5 + i * .28)
P.add(f'<div id="fish" class="abs" style="left:-420px;top:1000px;opacity:0"><svg width="380" height="220" viewBox="0 0 380 220">'
      f'<rect x="40" y="50" width="240" height="120" rx="14" fill="#caa86a" stroke="#5a3d12" stroke-width="8"/><path d="M280 110l80-60v120z" fill="#caa86a" stroke="#5a3d12" stroke-width="8" stroke-linejoin="round"/>'
      f'<circle cx="90" cy="95" r="12" fill="#1a0a1c"/><path d="M50 140q30 20 60 0" stroke="#5a3d12" stroke-width="7" fill="none"/></svg></div>')
P.frm('#fish', {'opacity': 0, 'x': 0}, {'opacity': 1, 'x': 700, 'duration': .5, 'ease': 'back.out(1.6)'}, 42.8)
stamp('sg', 'SQUARE GROUPER', 42.85, 1260, cls='year', size=118, color=AMBER, rot=-3)
c()

# ---- 5. story 4: Griselda ----------------------------------------------------------------
c = P.scene('s5', 44.2, 58.5)
P.add(f'<div id="spot" class="abs" style="left:140px;top:240px;width:800px;height:1000px;background:radial-gradient(ellipse at 50% 38%,rgba(255,243,230,.30),rgba(255,243,230,0) 62%);opacity:0"></div>')
P.frm('#spot', {'opacity': 0}, {'opacity': 1, 'duration': .8}, 44.4)
label('l4', 'story 4 / 4', 44.3, 58.4, color=CORAL)
stamp('y4', '#4', 44.45, 60, size=300, color=CORAL, rot=-3)
P.add(f'<svg id="sil" class="abs" width="620" height="640" viewBox="0 0 620 640" style="left:230px;top:440px;opacity:0">'
      f'<g fill="#0a0408" stroke="{CREAM}" stroke-width="4" stroke-opacity=".45"><circle cx="310" cy="190" r="150"/><circle cx="200" cy="230" r="80"/><circle cx="420" cy="230" r="80"/><circle cx="250" cy="110" r="70"/><circle cx="370" cy="110" r="70"/>'
      f'<path d="M110 640c0-100 60-130 130-160l70-40l70 40c70 30 130 60 130 160z"/></g>'
      f'<ellipse cx="310" cy="250" rx="72" ry="92" fill="#1c0c15"/><rect x="236" y="226" width="148" height="34" rx="12" fill="#05020a"/></svg>')
P.frm('#sil', {'opacity': 0, 'y': 80}, {'opacity': 1, 'y': 0, 'duration': .6, 'ease': 'power3.out'}, 45.2)
P.add(f'<div class="big" id="gb" style="position:absolute;left:0;right:0;top:1090px;font-size:112px;opacity:0;color:{CREAM}">GRISELDA BLANCO</div>'
      f'<div class="sub" id="gg" style="top:1215px;opacity:0;color:{CORAL};font-size:44px">"the cocaine godmother"</div>')
P.frm('#gb', {'opacity': 0, 'scale': 1.4}, {'opacity': 1, 'scale': 1, 'duration': .25, 'ease': 'power4.in'}, 47.1)
shake(47.35, 10)
P.frm('#gg', {'opacity': 0, 'y': 24}, {'opacity': 1, 'y': 0, 'duration': .3}, 48.7)
# motorcycle drive-by #1 (52.8) and #2 (57.0)
for k, (t0, text) in enumerate([(52.7, 'THE MOTORCYCLE DRIVE-BY'), (57.0, '')]):
    P.add(svg_moto(f'mo{k}', -400, 560, 1.15))
    P.frm(f'#mo{k}', {'opacity': 1, 'x': 0}, {'opacity': 1, 'x': 1560, 'duration': .85, 'ease': 'power2.in'}, t0)
    P.to(f'#mo{k}', {'opacity': 0, 'duration': .05}, t0 + .9)
P.add(f'<div class="tag" id="dbt" style="left:230px;top:1010px;background:{CORAL};color:#fff;opacity:0;font-size:34px;white-space:nowrap">motorcycle drive-by</div>')
P.frm('#dbt', {'opacity': 0, 'x': -50}, {'opacity': 1, 'x': 0, 'duration': .25}, 53.2)
P.to('#dbt', {'opacity': 0, 'duration': .15}, 56.3)
P.to('#gb', {'opacity': 0, 'duration': .12}, 54.3); P.to('#gg', {'opacity': 0, 'duration': .12}, 54.3)
stamp('y12', '2012', 54.4, 1060, size=210, color=CORAL, rot=-2)
P.to('#y12', {'opacity': 0, 'duration': .15}, 56.8)
P.add(f'<div class="neon" id="same" style="position:absolute;left:0;right:0;top:1090px;font-size:120px;opacity:0">SAME WAY.</div>')
P.frm('#same', {'opacity': 0, 'scale': 1.8}, {'opacity': 1, 'scale': 1, 'duration': .2, 'ease': 'power4.in'}, 57.55)
shake(57.75, 16)
c()

# ---- 6. outro ----------------------------------------------------------------------------------
c = P.scene('s6', 58.4, 67.0)
P.add(f'<svg class="abs" width="1080" height="560" viewBox="0 0 1080 560" style="left:0;top:700px">'
      + ''.join(f'<rect x="{x}" y="{560-h}" width="{w}" height="{h}" fill="#07030a"/>' + ''.join(
          f'<rect x="{x+10+j*22}" y="{560-h+14+i*34}" width="9" height="14" fill="{AMBER}" opacity=".7"/>' for i in range(max(0, h // 34 - 1)) for j in range(max(0, w // 22 - 1)) if (i * 7 + j * 3 + x) % 5 < 2)
          for x, w, h in [(40, 140, 300), (200, 110, 420), (330, 160, 340), (520, 120, 470), (660, 150, 360), (830, 110, 440), (950, 120, 300)])
      + '</svg>')
P.add(svg_palm(-60, 760, 1.0) + svg_palm(830, 790, .9))
P.add(f'<div class="neon" id="o1" style="position:absolute;left:30px;right:30px;top:230px;font-size:150px;line-height:1.02;opacity:0">GTA DIDN\'T<br>INVENT<br>FLORIDA</div>')
P.frm('#o1', {'opacity': 0, 'scale': 1.3}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'power3.out'}, 58.6)
P.to('#o1', {'opacity': 0, 'duration': .15}, 61.0)
P.add(f'<div class="big" id="o2" style="position:absolute;left:30px;right:30px;top:260px;font-size:130px;color:{AMBER};opacity:0">IT JUST<br>TURNED THE<br>VOLUME<br>DOWN</div>')
P.frm('#o2', {'opacity': 0, 'y': 40}, {'opacity': 1, 'y': 0, 'duration': .3, 'ease': 'power3.out'}, 61.1)
P.to('#o2', {'opacity': 0, 'duration': .15}, 62.55)
P.add(f'<div class="neon" id="o3" style="position:absolute;left:0;right:0;top:230px;font-size:170px;line-height:1;opacity:0">GTA VI<div style="font-size:130px;color:{AMBER};text-shadow:0 0 30px {AMBER}">NOV 19</div></div>')
P.frm('#o3', {'opacity': 0, 'scale': 1.5}, {'opacity': 1, 'scale': 1, 'duration': .25, 'ease': 'power4.in'}, 62.6)
shake(62.85, 14)
P.to('#o3', {'opacity': 0, 'duration': .15}, 65.25)
P.add(f'<div class="neon" id="o4" style="position:absolute;left:30px;right:30px;top:300px;font-size:150px;line-height:1.05;opacity:0">WELCOME<br>TO<br><span style="color:{TEAL};text-shadow:0 0 14px {TEAL},0 0 50px {TEAL}">LEONIDA</span></div>')
P.frm('#o4', {'opacity': 0}, {'opacity': 1, 'duration': .08, 'yoyo': True, 'repeat': 5}, 65.3)
P.to('#o4', {'opacity': 1, 'duration': .01}, 65.8)
c()

P.add('</div>')  # cam
P.chrome()
P.captions(y=1420)
P.write()
print('flo ok', len(P.js), 'tl lines')
