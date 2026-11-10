import sys
sys.path.insert(0, '/root/hf-shorts')
from common import *

words = load_words('/root/hf-shorts/math_words.json')
DUR = 51.0
P = Proj('mth', DUR, words)
GREEN = '#43e08a'
MONEY = 'function(v){return "$"+Math.round(v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,",")}'
NUM = 'function(v){return Math.round(v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,",")}'

P.css.append(f"""
#bg{{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#2b0f2a 0%,#170a1b 48%,{INK} 85%)}}
#grid{{position:absolute;left:-400px;right:-400px;top:1180px;height:360px;
background:repeating-linear-gradient(90deg,rgba(47,230,208,.5) 0 3px,transparent 3px 80px),repeating-linear-gradient(0deg,rgba(47,230,208,.4) 0 3px,transparent 3px 70px);
transform:perspective(420px) rotateX(62deg);transform-origin:50% 0;opacity:.28;-webkit-mask-image:linear-gradient(180deg,#000 0%,transparent 95%)}}
.panel{{position:absolute;left:60px;top:300px;width:960px;height:720px;border-radius:26px;overflow:hidden;opacity:0;box-shadow:0 0 0 4px rgba(255,243,230,.9),0 30px 80px rgba(0,0,0,.7)}}
.panel video{{position:absolute;left:0;top:0;width:960px;height:720px;object-fit:cover;filter:grayscale(.3) sepia(.55) saturate(1.5) contrast(1.15) brightness(.9)}}
.panel .tint{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(47,230,208,.12),rgba(255,79,109,.14))}}
.panel .scan{{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 2px,transparent 2px 5px)}}
.tag{{position:absolute;font-family:Oswald;font-weight:700;letter-spacing:.2em;font-size:30px;color:{INK};background:{AMBER};padding:8px 20px;border-radius:6px;text-transform:uppercase;white-space:nowrap}}
.stat{{position:absolute;left:0;right:0;text-align:center;font-family:Anton;color:{CREAM};line-height:1;text-shadow:0 8px 0 rgba(0,0,0,.7)}}
.sub{{position:absolute;left:0;right:0;text-align:center;font-family:Oswald;font-weight:700;letter-spacing:.2em;color:{AMBER};text-transform:uppercase}}
.neon{{font-family:Anton;color:#fff;text-align:center;text-shadow:0 0 12px #fff,0 0 30px {CORAL},0 0 70px {CORAL}}}
""")
P.add('<div id="bg"></div><div id="grid"></div>')
P.to('#grid', {'backgroundPosition': '0px 0px,0px 5000px', 'duration': DUR, 'ease': 'none'}, 0)
P.add('<div id="cam" style="position:absolute;inset:0">')


def shake(t0, amp=14):
    for i, (x, y) in enumerate([(amp, -amp), (-amp, amp), (amp * .6, amp * .5), (0, 0)]):
        P.to('#cam', {'x': x, 'y': y, 'duration': .05, 'ease': 'none'}, t0 + i * .05)

def panel(pid, clip, t0, t1, top=300, mstart=0, tag=None, zoom=(1.0, 1.2), fs=1.0):
    P.add(f'<div class="panel" id="{pid}" style="top:{top}px;transform-origin:50% 0"><video id="{pid}v" class="clip" src="assets/clips/{clip}.mp4" '
          f'data-start="{t0:.2f}" data-duration="{t1-t0:.2f}" data-media-start="{mstart}" muted playsinline></video><div class="tint"></div><div class="scan"></div>'
          + (f'<div class="tag" style="left:22px;bottom:20px;font-size:22px;padding:6px 14px;background:rgba(18,7,18,.8);color:{CREAM}">{tag}</div>' if tag else '') + '</div>')
    P.frm(f'#{pid}', {'opacity': 0, 'y': 60, 'scale': .94}, {'opacity': 1, 'y': 0, 'scale': fs, 'duration': .35, 'ease': 'power3.out'}, t0)
    P.frm(f'#{pid}v', {'scale': zoom[0]}, {'scale': zoom[1], 'duration': t1 - t0, 'ease': 'none'}, t0)
    P.to(f'#{pid}', {'opacity': 0, 'duration': .2}, t1 - .2)

def txt(eid, html, t0, t1, top, size, cls='stat', color=None, ease='back.out(2)', extra=''):
    col = f'color:{color};' if color else ''
    P.add(f'<div class="{cls}" id="{eid}" style="top:{top}px;font-size:{size}px;{col}opacity:0;{extra}">{html}</div>')
    P.frm(f'#{eid}', {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': ease}, t0)
    P.to(f'#{eid}', {'opacity': 0, 'duration': .15}, t1 - .15)

def slam(eid, html, t0, t1, top, size, color=CORAL, rot=-3, cls='stat'):
    P.add(f'<div class="{cls}" id="{eid}" style="top:{top}px;font-size:{size}px;color:{color};opacity:0;text-shadow:0 0 40px {color}99,0 8px 0 rgba(0,0,0,.6)">{html}</div>')
    P.frm(f'#{eid}', {'opacity': 0, 'scale': 2.6, 'rotation': rot - 6}, {'opacity': 1, 'scale': 1, 'rotation': rot, 'duration': .22, 'ease': 'power4.in'}, t0)
    P.to(f'#{eid}', {'opacity': 0, 'duration': .15}, t1 - .15)
    shake(t0 + .22)

# ---- analyst character (original) ---------------------------------------------------------
P.add(f'''<svg id="an" class="abs" width="184" height="240" viewBox="0 0 230 300" style="left:862px;top:1215px;z-index:20">
<g stroke="{CREAM}" stroke-width="9" stroke-linecap="round" fill="none"><path d="M115 130v90M115 160L70 200M115 160l45 38M115 220l-34 70M115 220l34 70"/></g>
<path d="M115 134l-14 20l14 50l14-50z" fill="{CORAL}"/>
<circle cx="115" cy="78" r="52" fill="#2a1820" stroke="{CREAM}" stroke-width="8"/>
<g stroke="{CREAM}" stroke-width="6" fill="none"><rect x="64" y="64" width="40" height="30" rx="8"/><rect x="126" y="64" width="40" height="30" rx="8"/><path d="M104 78h22"/></g>
<circle cx="84" cy="79" r="6" fill="{CREAM}" id="eyeL"/><circle cx="146" cy="79" r="6" fill="{CREAM}" id="eyeR"/>
<path id="mN" d="M92 108h46" stroke="{CREAM}" stroke-width="7" stroke-linecap="round"/>
<ellipse id="mO" cx="115" cy="112" rx="14" ry="18" fill="{CREAM}" opacity="0"/>
<path id="mS" d="M88 104q27 26 54 0" stroke="{CREAM}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0"/>
<path id="mW" d="M90 114q12-12 24 0t24 0" stroke="{CREAM}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0"/>
<path id="sw" d="M170 40q10 18 0 26q-10-8 0-26z" fill="{TEAL}" opacity="0"/>
</svg>''')
P.st('#an', {'opacity': 0}, 0)
P.frm('#an', {'opacity': 0, 'y': 60}, {'opacity': 1, 'y': 0, 'duration': .4, 'ease': 'back.out(1.6)'}, 1.0)
P.to('#an', {'y': -8, 'duration': .5, 'yoyo': True, 'repeat': 90, 'ease': 'sine.inOut'}, 1.5)
def mood(m, t):
    for k in 'NOSW':
        P.st(f'#m{k}', {'opacity': 1 if k == m else 0}, t)
    P.st('#sw', {'opacity': 1 if m == 'W' else 0}, t)
for m, t in [('N', 0), ('O', 2.5), ('N', 5.5), ('O', 21.4), ('N', 24.5), ('O', 28.8), ('N', 31.0), ('W', 32.2), ('N', 36.0), ('W', 38.0), ('S', 42.4), ('S', 44.8), ('N', 47.0), ('S', 49.4)]:
    mood(m, t)

# ---- 0 hook -------------------------------------------------------------------------------
c = P.scene('m0', 0, 5.3)
P.add(f'<div class="neon" id="hh" style="position:absolute;left:0;right:0;top:70px;font-size:160px;opacity:0">GTA VI</div>'
      f'<div class="lab sub" id="hl" style="top:250px;font-size:36px;opacity:0">every minute you play costs</div>')
P.frm('#hh', {'opacity': 0, 'scale': 1.6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'power4.in'}, 1.15)
P.frm('#hl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, .3)
panel('p0', 'adding', 0.0, 5.3, top=330, tag='archival footage · illustrative', zoom=(1.0, 1.3))
P.add(f'<div class="stat" id="big" style="top:1060px;font-size:200px;color:{AMBER};opacity:0;text-shadow:0 0 50px rgba(255,179,71,.6),0 8px 0 rgba(0,0,0,.7)">$0</div>')
P.frm('#big', {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 2.3)
P.counter('#big', 0, 333000, 2.5, 1.6, MONEY, 'power2.out')
shake(4.15, 16)
c()

# ---- 1 estimate ------------------------------------------------------------------------------
c = P.scene('m1', 5.2, 15.3)
slam('hm', "HERE'S THE MATH", 5.3, 6.9, 250, 150, color=TEAL)
P.add(f'<div class="abs" id="bar" style="left:80px;top:700px;width:920px;height:60px;border-radius:30px;background:rgba(255,243,230,.12);opacity:0"></div>'
      f'<div class="abs" id="rng" style="left:540px;top:700px;width:0;height:60px;border-radius:30px;background:linear-gradient(90deg,{AMBER},{CORAL});box-shadow:0 0 40px {CORAL}"></div>'
      f'<div class="lab abs" id="b0" style="left:60px;top:780px;font-size:32px;color:{CREAM};opacity:0">$0</div>'
      f'<div class="lab abs" id="b1" style="left:490px;top:780px;font-size:40px;color:{AMBER};opacity:0">$1B</div>'
      f'<div class="lab abs" id="b2" style="left:900px;top:780px;font-size:40px;color:{CORAL};opacity:0">$2B</div>'
      f'<div class="tag" id="est" style="left:150px;top:600px;opacity:0;background:rgba(18,7,18,.85);color:{CREAM};font-size:28px">analyst estimates · not official</div>')
P.frm('#bar', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 6.8)
for i in range(3):
    P.frm(f'#b{i}', {'opacity': 0, 'y': 20}, {'opacity': 1, 'y': 0, 'duration': .25}, 7.0 + i * .2)
P.frm('#est', {'opacity': 0, 'y': -20}, {'opacity': 1, 'y': 0, 'duration': .3}, 6.9)
P.frm('#rng', {'width': 0}, {'width': 460, 'duration': 1.4, 'ease': 'power2.inOut'}, 8.7)
P.add(f'<div class="stat" id="r1" style="top:900px;font-size:150px;color:{AMBER};opacity:0">$1–2B</div>')
P.frm('#r1', {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 9.7)
P.to('#r1', {'opacity': 0, 'duration': .15}, 10.9)
P.to('#bar,#rng,#b0,#b1,#b2,#est', {'opacity': 0, 'duration': .2}, 10.9)
slam('me', 'MOST<br>EXPENSIVE<br>GAME EVER', 11.1, 13.5, 420, 150, color=CORAL, rot=-2)
txt('lu', 'LET\'S USE', 13.6, 15.2, 360, 90, cls='sub', color=AMBER)
P.add(f'<div class="stat" id="two" style="top:480px;font-size:130px;color:{AMBER};opacity:0">$0</div>')
P.frm('#two', {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 14.0)
P.counter('#two', 0, 2000000000, 14.1, 1.0, MONEY, 'power2.out')
P.to('#two', {'opacity': 0, 'duration': .15}, 15.15)
c()

# ---- 2 per-minute -----------------------------------------------------------------------------
c = P.scene('m2', 15.2, 25.8)
txt('h100', '100 HOURS', 15.3, 16.7, 300, 170, color=TEAL)
P.add(f'<div class="stat" id="m6" style="top:300px;font-size:170px;color:{AMBER};opacity:0">6,000 MIN</div>')
P.frm('#m6', {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 16.65)
# 60 blocks = 100 min each
blocks = ''.join(f'<div id="bk{i}" style="width:130px;height:62px;border-radius:8px;background:{AMBER};opacity:0"></div>' for i in range(60))
P.add(f'<div class="abs" id="bks" style="left:60px;top:560px;width:960px;display:grid;grid-template-columns:repeat(6,1fr);gap:14px;width:900px;left:90px;opacity:1">{blocks}</div>')
for i in range(60):
    P.frm(f'#bk{i}', {'opacity': 0, 'scale': .3}, {'opacity': 1, 'scale': 1, 'duration': .16, 'ease': 'back.out(2)'}, 15.5 + i * .028 if i < 30 else 16.6 + (i - 30) * .03)
P.to('#bks', {'opacity': 0, 'duration': .2}, 17.95)
P.to('#h100,#m6', {'opacity': 0, 'duration': .15}, 17.95)
P.add(f'<div class="stat" id="eq" style="top:330px;font-size:120px;opacity:0;color:{CREAM}">$2,000,000,000<br><span style="color:{TEAL};font-size:150px">÷ 6,000</span></div>')
P.frm('#eq', {'opacity': 0, 'y': 60}, {'opacity': 1, 'y': 0, 'duration': .35, 'ease': 'power3.out'}, 18.3)
P.to('#eq', {'opacity': 0, 'duration': .15}, 21.3)
slam('res', '$333,333', 21.45, 25.7, 400, 230, color=CORAL, rot=-2)
txt('pm', 'PER MINUTE', 22.0, 25.7, 680, 64, cls='sub', color=CREAM)
panel('p2', 'teller', 23.4, 25.8, top=760, zoom=(1.0, 1.15), fs=.58)
c()

# ---- 3 per-developer ----------------------------------------------------------------------------
c = P.scene('m3', 25.7, 31.9)
txt('h2k', '2,000 DEVELOPERS', 25.9, 31.8, 300, 120, color=TEAL, ease='power3.out')
dots = f'background-image:radial-gradient(circle,{CREAM} 0 3px,transparent 3.6px);background-size:14px 14px;'
P.add(f'<div class="abs" id="dots" style="left:90px;top:500px;width:900px;height:420px;{dots}clip-path:inset(0 100% 0 0)"></div>')
P.frm('#dots', {'clipPath': 'inset(0 100% 0 0)'}, {'clipPath': 'inset(0 0% 0 0)', 'duration': 2.0, 'ease': 'power1.inOut'}, 26.4)
P.add(f'<div class="abs" id="you" style="left:{90+14*30+4}px;top:{500+14*14+4}px;width:14px;height:14px;border-radius:50%;background:{CORAL};box-shadow:0 0 0 8px rgba(255,79,109,.35),0 0 40px {CORAL};opacity:0"></div>')
P.frm('#you', {'opacity': 0, 'scale': 4}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 28.7)
P.add(f'<div class="stat" id="mil" style="top:980px;font-size:190px;color:{GREEN};opacity:0;text-shadow:0 0 40px rgba(67,224,138,.5),0 8px 0 rgba(0,0,0,.7)">$0</div>'
      f'<div class="sub" id="eachl" style="top:1180px;font-size:44px;opacity:0">each · for one game</div>')
P.frm('#mil', {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 28.85)
P.counter('#mil', 0, 1000000, 28.9, .9, MONEY, 'power2.out')
P.frm('#eachl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 29.9)
shake(28.85, 12)
c()

# ---- 4 can it fail ---------------------------------------------------------------------------------
c = P.scene('m4', 31.9, 39.1)
slam('cf', 'CAN IT<br>FAIL?', 32.0, 33.6, 330, 230, color=CORAL, rot=-2)
txt('pr', '$70', 34.6, 36.2, 300, 260, color=GREEN)
P.add(f'<div class="sub" id="prl" style="top:600px;font-size:44px;opacity:0">per copy</div>')
P.frm('#prl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 35.1)
P.to('#prl', {'opacity': 0, 'duration': .15}, 36.1)
P.add(f'<div class="abs" id="pb" style="left:80px;top:760px;width:920px;height:70px;border-radius:35px;background:rgba(255,243,230,.12);opacity:0"></div>'
      f'<div class="abs" id="pf" style="left:80px;top:760px;width:0;height:70px;border-radius:35px;background:linear-gradient(90deg,{TEAL},{GREEN});box-shadow:0 0 40px rgba(67,224,138,.6)"></div>'
      f'<div class="stat" id="cp" style="top:880px;font-size:170px;color:{GREEN};opacity:0">0</div>'
      f'<div class="sub" id="cpl" style="top:1080px;font-size:40px;opacity:0">copies to break even</div>')
P.frm('#pb', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 36.0)
P.frm('#pf', {'width': 0}, {'width': 920, 'duration': 2.0, 'ease': 'power2.inOut'}, 36.3)
P.frm('#cp', {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 36.5)
P.counter('#cp', 0, 29000000, 36.6, 1.8, NUM, 'power2.out')
P.frm('#cpl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 37.5)
c()

# ---- 5 GTA V compare ------------------------------------------------------------------------------------
c = P.scene('m5', 39.0, 44.85)
txt('g5', 'GTA V', 39.1, 44.7, 250, 150, color=AMBER, ease='power3.out')
P.add(f'<div class="abs" id="t3" style="left:0;right:0;top:420px;text-align:center;font-family:Anton;font-size:96px;color:{GREEN};opacity:0;text-shadow:0 0 30px rgba(67,224,138,.5)">$1,000,000,000<br><span style="font-size:48px;color:{CREAM};letter-spacing:.2em">IN 3 DAYS</span></div>')
P.frm('#t3', {'opacity': 0, 'scale': .7}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 39.15)
P.to('#t3', {'opacity': 0, 'duration': .15}, 42.4)
# bars: 29M vs 200M+
P.add(f'<div class="abs" id="bA" style="left:230px;bottom:820px;width:240px;height:0;background:{GREEN};border-radius:12px 12px 0 0"></div>'
      f'<div class="abs" id="bB" style="left:610px;bottom:820px;width:240px;height:0;background:{CORAL};border-radius:12px 12px 0 0"></div>'
      f'<div class="stat" id="nA" style="left:150px;width:400px;top:1130px;font-size:66px;color:{GREEN};opacity:0">29M</div>'
      f'<div class="stat" id="nB" style="left:530px;width:400px;top:1130px;font-size:66px;color:{CORAL};opacity:0">200M+</div>'
      f'<div class="sub" id="nAl" style="left:150px;width:400px;top:1210px;font-size:26px;opacity:0">break-even</div>'
      f'<div class="sub" id="nBl" style="left:530px;width:400px;top:1210px;font-size:26px;opacity:0">gta v sales</div>')
P.frm('#bA', {'height': 0}, {'height': 62, 'duration': .5, 'ease': 'power3.out'}, 42.5)
P.frm('#bB', {'height': 0}, {'height': 430, 'duration': .7, 'ease': 'power3.out'}, 42.5)
for k in ('nA', 'nB', 'nAl', 'nBl'):
    P.frm('#' + k, {'opacity': 0}, {'opacity': 1, 'duration': .3}, 42.9)
slam('re', 'ROUNDING ERROR', 43.95, 44.8, 440, 108, color=AMBER, rot=-5)
c()

# ---- 6 can't fail + risk ----------------------------------------------------------------------------------------
c = P.scene('m6', 44.7, 51.0)
slam('cff', "IT CAN'T<br>FAIL", 44.75, 46.0, 330, 220, color=GREEN, rot=-2)
txt('rk', 'THE ONLY THING AT RISK', 46.1, 49.1, 300, 60, cls='sub', color=CORAL, ease='power3.out')
P.add(f'<div class="stat" id="hrs" style="top:420px;font-size:230px;opacity:0;color:{CREAM}">100</div><div class="sub" id="hrl" style="top:690px;font-size:56px;opacity:0">hours of your life</div>')
P.frm('#hrs', {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 47.4)
P.frm('#hrl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 47.9)
P.add(f'<div class="neon" id="nov" style="position:absolute;left:0;right:0;top:880px;font-size:150px;opacity:0;line-height:1">NOV 19<div style="font-size:60px;letter-spacing:.3em;color:{TEAL};text-shadow:0 0 20px {TEAL}">SEE YOU THERE</div></div>')
P.frm('#nov', {'opacity': 0, 'scale': 1.6}, {'opacity': 1, 'scale': 1, 'duration': .25, 'ease': 'power4.in'}, 49.2)
shake(49.45, 14)
c()

P.add('</div>')
P.chrome()
P.captions(y=1430)
P.write()
print('mth ok', len(P.js))
