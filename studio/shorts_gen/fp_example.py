import sys, math
sys.path.insert(0, '/home/user/viral-video-studio/studio/shorts_gen')
from common import *

words = load_words('/root/hf-shorts/fp_words.json')
DUR = 49.2
P = Proj('fp', DUR, words)
GREEN = '#43e08a'
GOLD = AMBER

P.css.append(f"""
#bg{{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,#2b0f2a 0%,#170a1b 50%,{INK} 88%)}}
#grid{{position:absolute;left:-400px;right:-400px;top:1180px;height:360px;background:repeating-linear-gradient(90deg,rgba(255,79,109,.45) 0 3px,transparent 3px 80px),repeating-linear-gradient(0deg,rgba(255,79,109,.35) 0 3px,transparent 3px 70px);transform:perspective(420px) rotateX(62deg);transform-origin:50% 0;opacity:.28;-webkit-mask-image:linear-gradient(180deg,#000 0%,transparent 95%)}}
.nd{{position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0;box-shadow:0 8px 26px rgba(0,0,0,.55)}}
.bdg{{position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Anton;color:{INK};opacity:0}}
.chip{{position:absolute;font-family:Anton;font-size:34px;letter-spacing:.02em;color:{CREAM};background:rgba(18,7,18,.88);border:3px solid {CORAL};border-radius:14px;padding:4px 14px;opacity:0;white-space:nowrap}}
.lab2{{position:absolute;left:0;right:0;text-align:center;font-family:Oswald;font-weight:700;letter-spacing:.2em;text-transform:uppercase}}
.stat{{position:absolute;left:0;right:0;text-align:center;font-family:Anton;color:{CREAM};line-height:1;text-shadow:0 8px 0 rgba(0,0,0,.7)}}
.vp{{position:absolute;border-radius:24px;overflow:hidden;opacity:0;box-shadow:0 0 0 4px rgba(255,243,230,.92),0 28px 70px rgba(0,0,0,.75)}}
.vp video{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.2) sepia(.55) saturate(1.5) contrast(1.15) brightness(.95)}}
.vp .tint{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,79,109,.16),rgba(255,179,71,.14))}}
.vp .scan{{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 2px,transparent 2px 5px)}}
.neon{{font-family:Anton;color:#fff;text-align:center;text-shadow:0 0 12px #fff,0 0 30px {CORAL},0 0 70px {CORAL}}}
.tag2{{position:absolute;font-family:Oswald;font-weight:700;letter-spacing:.18em;font-size:26px;padding:6px 16px;border-radius:8px;background:rgba(18,7,18,.85);color:{CREAM};text-transform:uppercase;white-space:nowrap;opacity:0}}
""")
P.add('<div id="bg"></div><div id="grid"></div>')
P.to('#grid', {'backgroundPosition': '0px 0px,0px 5000px', 'duration': DUR, 'ease': 'none'}, 0)
P.add('<div id="cam" style="position:absolute;inset:0">')

GLYPH = '<svg viewBox="0 0 40 40" width="64%" height="64%"><circle cx="20" cy="14" r="7.5" fill="{c}"/><path d="M5 37c0-10 6.5-14.5 15-14.5S35 27 35 37z" fill="{c}"/></svg>'


def shake(t0, amp=12):
    for i, (x, y) in enumerate([(amp, -amp), (-amp, amp), (amp * .6, amp * .5), (0, 0)]):
        P.to('#cam', {'x': x, 'y': y, 'duration': .05, 'ease': 'none'}, t0 + i * .05)

def punch(t, k=1.05):
    P.to('#cam', {'scale': k, 'duration': .07, 'ease': 'power2.out', 'transformOrigin': '50% 50%'}, t)
    P.to('#cam', {'scale': 1, 'duration': .28, 'ease': 'power2.out'}, t + .07)

def flash(t, op=.4):
    uid = P.uid('fl')
    P.add(f'<div id="{uid}" class="abs" style="inset:0;background:#fff;opacity:0;z-index:9"></div>')
    P.frm('#' + uid, {'opacity': 0}, {'opacity': op, 'duration': .05, 'yoyo': True, 'repeat': 1}, t)

def node(nid, x, y, r, fill, t, glyph_c=INK, glyph=True, ring=None, t_out=None, dur=.32, z=4):
    ring_css = f'border:4px solid {ring};' if ring else ''
    P.add(f'<div id="{nid}" class="nd" style="left:{x-r}px;top:{y-r}px;width:{2*r}px;height:{2*r}px;background:{fill};{ring_css}z-index:{z}">' + (GLYPH.format(c=glyph_c) if glyph else '') + '</div>')
    P.frm('#' + nid, {'opacity': 0, 'scale': .2}, {'opacity': 1, 'scale': 1, 'duration': dur, 'ease': 'back.out(2.4)'}, t)
    if t_out is not None: P.to('#' + nid, {'opacity': 0, 'scale': .6, 'duration': .2}, t_out)

def badge(bid, text, x, y, r, fill, t, t_out=None, fs=None, color=INK, z=6):
    fs = fs or int(r * 1.15)
    P.add(f'<div id="{bid}" class="bdg" style="left:{x-r}px;top:{y-r}px;width:{2*r}px;height:{2*r}px;background:{fill};font-size:{fs}px;color:{color};z-index:{z};box-shadow:0 4px 14px rgba(0,0,0,.5)">{text}</div>')
    P.frm('#' + bid, {'opacity': 0, 'scale': .2}, {'opacity': 1, 'scale': 1, 'duration': .28, 'ease': 'back.out(3)'}, t)
    if t_out is not None: P.to('#' + bid, {'opacity': 0, 'scale': .6, 'duration': .15}, t_out)

def chip(cid, html, x, y, t, t_out=None, border=CORAL, z=7):
    P.add(f'<div id="{cid}" class="chip" style="left:{x}px;top:{y}px;border-color:{border};z-index:{z}">{html}</div>')
    P.frm('#' + cid, {'opacity': 0, 'scale': .4, 'x': 0}, {'opacity': 1, 'scale': 1, 'duration': .26, 'ease': 'back.out(2.6)'}, t)
    if t_out is not None: P.to('#' + cid, {'opacity': 0, 'duration': .15}, t_out)

def edges_svg(lines, z=2):
    """lines: (id, x1, y1, x2, y2, color, width). returns nothing; adds an svg layer with undrawn lines"""
    body = ''
    for i, x1, y1, x2, y2, col, w in lines:
        L = math.hypot(x2 - x1, y2 - y1) + 2
        body += f'<line id="{i}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-dasharray="{L:.0f}" stroke-dashoffset="{L:.0f}"/>'
    P.add(f'<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;z-index:{z}">{body}</svg>')
    return {i: math.hypot(x2 - x1, y2 - y1) + 2 for i, x1, y1, x2, y2, c, w in lines}

def draw(eid, L, t, d=.35, t_out=None):
    P.frm('#' + eid, {'strokeDashoffset': L}, {'strokeDashoffset': 0, 'duration': d, 'ease': 'power2.out'}, t)
    if t_out is not None: P.to('#' + eid, {'opacity': 0, 'duration': .15}, t_out)

def txt(eid, html, t0, t1, top, size, color=CREAM, cls='stat', ease='back.out(2)', extra='', z=8):
    P.add(f'<div class="{cls}" id="{eid}" style="top:{top}px;font-size:{size}px;color:{color};opacity:0;z-index:{z};{extra}">{html}</div>')
    P.frm('#' + eid, {'opacity': 0, 'scale': .6}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': ease}, t0)
    P.to('#' + eid, {'opacity': 0, 'duration': .15}, t1 - .15)

def slam(eid, html, t0, t1, top, size, color=CORAL, rot=-3, z=8):
    P.add(f'<div class="stat" id="{eid}" style="top:{top}px;font-size:{size}px;color:{color};opacity:0;z-index:{z};text-shadow:0 0 40px {color}99,0 8px 0 rgba(0,0,0,.6)">{html}</div>')
    P.frm('#' + eid, {'opacity': 0, 'scale': 2.6, 'rotation': rot - 6}, {'opacity': 1, 'scale': 1, 'rotation': rot, 'duration': .22, 'ease': 'power4.in'}, t0)
    P.to('#' + eid, {'opacity': 0, 'duration': .15}, t1 - .15)
    shake(t0 + .22, 10)

def vpanel(pid, clip, t0, t1, top, h=540, tag=None, zoom=(1.0, 1.2)):
    P.add(f'<div class="vp" id="{pid}" style="left:60px;top:{top}px;width:960px;height:{h}px;z-index:5"><video id="{pid}v" class="clip" src="assets/clips/{clip}.mp4" data-start="{t0:.2f}" data-duration="{t1-t0:.2f}" muted playsinline></video><div class="tint"></div><div class="scan"></div>'
          + (f'<div class="tag2" style="left:20px;bottom:18px;font-size:22px;opacity:1">{tag}</div>' if tag else '') + '</div>')
    P.frm('#' + pid, {'opacity': 0, 'y': 60, 'scale': .93}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .35, 'ease': 'power3.out'}, t0)
    P.frm(f'#{pid}v', {'scale': zoom[0]}, {'scale': zoom[1], 'duration': t1 - t0, 'ease': 'none'}, t0)
    P.to('#' + pid, {'opacity': 0, 'duration': .2}, t1 - .2)

def top_label(lid, text, t0, t1, top=110, size=44, color=AMBER):
    P.add(f'<div class="lab2" id="{lid}" style="top:{top}px;font-size:{size}px;color:{color};opacity:0;z-index:8">{text}</div>')
    P.frm('#' + lid, {'opacity': 0, 'y': -24}, {'opacity': 1, 'y': 0, 'duration': .3, 'ease': 'power2.out'}, t0)
    P.to('#' + lid, {'opacity': 0, 'duration': .15}, t1 - .15)

def scene(sid, t0, t1):
    P.add(f'<div class="sc" id="{sid}" style="z-index:5">')
    P.st('#' + sid, {'opacity': 1}, t0); P.st('#' + sid, {'opacity': 0}, t1)
    return lambda: P.add('</div>')

# ============================ HOOK (0 - 5.65): YOU vs friends with clusters =================================
def hook_graph(prefix, t0, speed=1.0, t_out=None):
    """YOU (3 friends) vs each friend (9 friends). returns nothing; all ids prefixed"""
    cx, cy = 540, 690
    fr = [(324, 565), (756, 565), (540, 940)]
    sats = []
    lines = []
    for k, (fx, fy) in enumerate(fr):
        lines.append((f'{prefix}e{k}', cx, cy, fx, fy, CREAM, 6))
        base = math.atan2(fy - cy, fx - cx)
        for j in range(8):
            ang = base + (j - 3.5) * 0.46
            sx, sy = fx + 118 * math.cos(ang), fy + 118 * math.sin(ang)
            sats.append((k, j, sx, sy)); lines.append((f'{prefix}s{k}_{j}', fx, fy, sx, sy, 'rgba(255,243,230,.55)', 3))
    L = edges_svg(lines)
    node(f'{prefix}you', cx, cy, 62, CORAL, t0 + .1 / speed, ring=CREAM)
    for k, (fx, fy) in enumerate(fr):
        node(f'{prefix}f{k}', fx, fy, 44, GOLD, t0 + (.22 + .1 * k) / speed)
        draw(f'{prefix}e{k}', L[f'{prefix}e{k}'], t0 + (.22 + .1 * k) / speed, .3)
    for k, j, sx, sy in sats:
        tt = t0 + (.8 + .035 * (k * 8 + j)) / speed
        node(f'{prefix}t{k}_{j}', sx, sy, 17, 'rgba(255,243,230,.9)', tt, glyph=False, dur=.22, z=3)
        draw(f'{prefix}s{k}_{j}', L[f'{prefix}s{k}_{j}'], tt, .2)
    for k, (fx, fy) in enumerate(fr):
        bx, by = (fx + 44 * .9, fy - 44 * .9) if k < 2 else (fx + 50, fy - 30)
        badge(f'{prefix}bf{k}', '9', bx, by, 24, CREAM, t0 + (1.3 + .1 * k) / speed)
    badge(f'{prefix}by', '3', cx + 56, cy - 56, 28, CREAM, t0 + 1.84 / speed, fs=36)
    P.add(f'<div class="tag2" id="{prefix}ytag" style="left:{cx-215}px;top:{cy-22}px;font-size:28px;background:{CORAL};color:#fff;z-index:6">YOU</div>')
    P.frm(f'#{prefix}ytag', {'opacity': 0, 'x': -30}, {'opacity': 1, 'x': 0, 'duration': .25}, t0 + .25 / speed)
    P.to(f'#{prefix}you', {'scale': 1.12, 'duration': .14, 'yoyo': True, 'repeat': 1}, t0 + 1.86 / speed)
    return sats

c = scene('h0', 0, 5.7)
top_label('hl', 'THE FRIENDSHIP PARADOX', 0.15, 5.6, top=120, size=46)
hook_graph('h', 0.0)
slam('hm', 'MATH PROVES IT', 2.76, 4.2, 1100, 104, color=CORAL, rot=-2)
P.add(f'<div class="tag2" id="fe" style="left:300px;top:1235px;z-index:8;font-size:28px;background:{AMBER};color:{INK}">Scott Feld · 1991</div>')
P.frm('#fe', {'opacity': 0, 'y': 20}, {'opacity': 1, 'y': 0, 'duration': .25}, 3.3)
P.to('#fe', {'opacity': 0, 'duration': .15}, 4.15)
# teaser card (opens a loop that closes at the 30 s twist)
P.add(f'<div id="tz" class="abs" style="left:100px;top:1085px;width:880px;height:190px;border-radius:26px;background:rgba(18,7,18,.88);border:4px solid {AMBER};opacity:0;z-index:8">'
      f'<svg class="abs" width="90" height="110" viewBox="0 0 90 110" style="left:36px;top:40px"><rect x="10" y="48" width="70" height="52" rx="10" fill="{AMBER}"/><path d="M24 48V34a21 21 0 0 1 42 0v14" fill="none" stroke="{AMBER}" stroke-width="9" stroke-linecap="round"/><circle cx="45" cy="72" r="7" fill="{INK}"/></svg>'
      f'<div class="abs" style="left:150px;top:26px;font-family:Anton;font-size:74px;color:{CREAM}">THE FLU TWIST</div>'
      f'<div class="abs" style="left:152px;top:116px;font-family:Oswald;font-weight:700;letter-spacing:.2em;font-size:30px;color:{AMBER}">UNLOCKS AT 0:30</div></div>')
P.frm('#tz', {'opacity': 0, 'y': 70, 'scale': .9}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .4, 'ease': 'back.out(1.8)'}, 4.2)
P.to('#tz', {'scale': 1.03, 'duration': .3, 'yoyo': True, 'repeat': 3, 'ease': 'sine.inOut'}, 4.7)
P.to('#tz', {'opacity': 0, 'duration': .15}, 5.55)
punch(0.12, 1.04); punch(2.78, 1.05); flash(2.76, .35)
c()

# ============================ PARTY OF SIX (5.65 - 18.2) ===================================================
HUB = (540, 700); PEOPLE = {'A': (330, 520), 'B': (750, 520), 'C': (290, 830), 'D': (540, 990), 'E': (790, 830)}
c = scene('p0', 5.65, 18.25)
top_label('pl', 'A PARTY OF SIX', 5.9, 9.6, top=120, size=52)
vpanel('pp', 'party3', 5.8, 8.4, 330, h=600, tag='archival film · illustrative')
slam('p6', '6 PEOPLE', 6.5, 8.35, 1080, 150, color=CREAM, rot=-2)
flash(5.72, .3)
lines = [(f'pe{k}', HUB[0], HUB[1], x, y, GOLD, 7) for k, (x, y) in PEOPLE.items()] + [('peAB', 330, 520, 750, 520, CREAM, 5)]
L = edges_svg(lines)
node('pH', HUB[0], HUB[1], 64, GOLD, 7.7, ring=CREAM, t_out=18.1)
P.to('#pH', {'boxShadow': f'0 0 60px {AMBER}', 'duration': .3, 'yoyo': True, 'repeat': 3}, 7.8)
for i, (k, (x, y)) in enumerate(PEOPLE.items()):
    t = 8.28 + .11 * i
    draw(f'pe{k}', L[f'pe{k}'], t, .3, t_out=18.1)
    node(f'p{k}', x, y, 42, CREAM, t + .08, glyph_c=INK, t_out=18.1)
draw('peAB', L['peAB'], 10.4, .4, t_out=18.1)
for nm, (x, y), val, tt in [('H', HUB, 5, 8.95), ('A', PEOPLE['A'], 2, 10.06), ('B', PEOPLE['B'], 2, 10.2), ('C', PEOPLE['C'], 1, 10.4), ('D', PEOPLE['D'], 1, 10.6), ('E', PEOPLE['E'], 1, 10.8)]:
    rr = 26 if nm == 'H' else 22
    badge(f'pb{nm}', str(val), x + (58 if nm == 'H' else 46), y - (58 if nm == 'H' else 46), rr, CORAL if nm != 'H' else AMBER, tt, t_out=18.1, fs=34, color='#fff' if nm != 'H' else INK)
txt('p12', '1–2 FRIENDS EACH', 9.7, 11.8, 1090, 92, color=CORAL, extra='z-index:8')
# scan ring (count it)
P.add(f'<div id="scan" class="abs" style="left:0;top:0;width:110px;height:110px;border-radius:50%;border:6px solid {GREEN};box-shadow:0 0 30px {GREEN};opacity:0;z-index:9"></div>')
seq = [('A', 330, 520), ('B', 750, 520), ('C', 290, 830), ('D', 540, 990), ('E', 790, 830)]
P.st('#scan', {'opacity': 1, 'x': seq[0][1] - 55, 'y': seq[0][2] - 55}, 11.84)
for i, (nm, x, y) in enumerate(seq[1:], 1):
    P.to('#scan', {'x': x - 55, 'y': y - 55, 'duration': .12, 'ease': 'power2.inOut'}, 11.84 + .13 * i)
P.to('#scan', {'opacity': 0, 'duration': .1}, 12.62)
flash(11.84, .3); shake(11.86, 9)
P.add(f'<div class="lab2" id="cmpl" style="top:1052px;font-size:30px;color:{AMBER};opacity:0;z-index:8">own friends  &lt;  friends\' average</div>')
P.frm('#cmpl', {'opacity': 0}, {'opacity': 1, 'duration': .3}, 12.7)
P.to('#cmpl', {'opacity': 0, 'duration': .15}, 15.85)
cmp_pos = {'A': ('2 &lt; 3.5', 60, 480, 12.85), 'B': ('2 &lt; 3.5', 812, 480, 13.2), 'C': ('1 &lt; 5', 60, 790, 13.6), 'D': ('1 &lt; 5', 320, 955, 14.0), 'E': ('1 &lt; 5', 852, 790, 14.4)}
for k, (txt_, x, y, tt) in cmp_pos.items():
    chip(f'pc{k}', txt_, x, y, tt, t_out=18.1)
slam('p56', '5 OF 6', 13.22, 15.8, 1100, 220, color=CORAL, rot=-2)
chip('pcH', '5 &gt; 1.4', 452, 556, 15.9, t_out=18.1, border=GOLD)
txt('pex', 'EXCEPT THE POPULAR ONE', 15.9, 18.2, 1100, 80, color=GOLD, extra='z-index:8')
flash(13.2, .3); punch(13.22, 1.05); punch(15.9, 1.04)
c()

# ============================ WHY: friend lists + hubs (18.25 - 30.0) =======================================
c = scene('w0', 18.25, 30.05)
top_label('wl', "HERE'S WHY", 18.3, 22.0, top=120, size=60, color=CORAL)
rows = [('A', ['H', 'B']), ('B', ['H', 'A']), ('C', ['H']), ('D', ['H']), ('E', ['H'])]
RY = lambda i: 360 + i * 122
for i, (who, fl) in enumerate(rows):
    P.add(f'<div id="rw{i}" class="abs" style="left:90px;top:{RY(i)}px;width:900px;height:104px;border-radius:20px;background:rgba(255,243,230,.09);border:3px solid rgba(255,243,230,.35);opacity:0;z-index:4"></div>')
    P.frm(f'#rw{i}', {'opacity': 0, 'x': -60}, {'opacity': 1, 'x': 0, 'duration': .3, 'ease': 'power3.out'}, 18.5 + .1 * i)
    P.to(f'#rw{i}', {'opacity': 0, 'duration': .2}, 25.6)
    node(f'rn{i}', 150, RY(i) + 52, 32, CREAM, 18.6 + .1 * i, t_out=25.6)
    P.add(f'<div class="abs" id="rt{i}" style="left:196px;top:{RY(i)+24}px;font-family:Oswald;font-weight:700;font-size:34px;letter-spacing:.12em;color:{CREAM};opacity:0;z-index:5">{who}\'S LIST</div>')
    P.frm(f'#rt{i}', {'opacity': 0}, {'opacity': 1, 'duration': .2}, 18.65 + .1 * i); P.to(f'#rt{i}', {'opacity': 0, 'duration': .2}, 25.6)
    for j, ff in enumerate(fl):
        col = GOLD if ff == 'H' else CREAM
        node(f'rc{i}_{j}', 560 + j * 120, RY(i) + 52, 36, col, 19.5 + .12 * i + .06 * j, glyph=False, ring=CREAM if ff == 'H' else None, t_out=25.6)
        P.add(f'<div id="rl{i}_{j}" class="abs" style="left:{560+j*120-36}px;top:{RY(i)+52-24}px;width:72px;text-align:center;font-family:Anton;font-size:44px;color:{INK};opacity:0;z-index:6">{ff}</div>')
        P.frm(f'#rl{i}_{j}', {'opacity': 0}, {'opacity': 1, 'duration': .2}, 19.6 + .12 * i); P.to(f'#rl{i}_{j}', {'opacity': 0, 'duration': .2}, 25.6)
        if ff == 'H': P.to(f'#rc{i}_{j}', {'boxShadow': f'0 0 40px {AMBER}', 'scale': 1.12, 'duration': .18, 'yoyo': True, 'repeat': 1}, 20.1 + .22 * i)
P.add(f'<div class="stat" id="hcount" style="top:1080px;font-size:100px;color:{GOLD};opacity:0;z-index:8">H IS IN <span id="hn">0</span> OF 5 LISTS</div>')
P.frm('#hcount', {'opacity': 0, 'scale': .7}, {'opacity': 1, 'scale': 1, 'duration': .3, 'ease': 'back.out(2)'}, 20.5)
P.counter('#hn', 0, 5, 20.6, 1.0, 'function(v){return Math.round(v)}', 'power1.inOut')
P.to('#hcount', {'opacity': 0, 'duration': .15}, 22.1)
# picker hops, always landing on hubs
P.add(f'<div id="pick" class="abs" style="left:0;top:0;width:96px;height:96px;border-radius:50%;border:6px solid {GREEN};box-shadow:0 0 28px {GREEN};opacity:0;z-index:9"></div>')
P.st('#pick', {'opacity': 1, 'x': 560 - 48, 'y': RY(0) + 52 - 48}, 22.28)
for i in range(1, 5):
    P.to('#pick', {'x': 560 - 48, 'y': RY(i) + 52 - 48, 'duration': .15, 'ease': 'power2.inOut'}, 22.28 + .3 * i)
P.to('#pick', {'scale': 1.5, 'duration': .2, 'yoyo': True, 'repeat': 1}, 23.8)
P.to('#pick', {'opacity': 0, 'duration': .15}, 25.5)
slam('whubs', 'YOU SAMPLE<br>THE HUBS', 24.46, 25.7, 1060, 120, color=GOLD, rot=-2)
flash(24.46, .35)
# the named paradox card
P.add(f'<div id="pd" class="abs" style="left:80px;top:430px;width:920px;height:520px;border-radius:30px;background:rgba(18,7,18,.9);border:5px solid {CORAL};opacity:0;z-index:6;text-align:center">'
      f'<div style="margin-top:44px;font-family:Oswald;font-weight:700;letter-spacing:.2em;font-size:34px;color:{AMBER}">ON AVERAGE</div>'
      f'<div style="margin-top:26px;font-family:Anton;font-size:118px;line-height:1.02;color:{CREAM}">YOUR FRIENDS<br><span style="color:{CORAL}">HAVE MORE</span><br>FRIENDS</div></div>')
P.frm('#pd', {'opacity': 0, 'scale': .8, 'rotation': -3}, {'opacity': 1, 'scale': 1, 'rotation': 0, 'duration': .4, 'ease': 'back.out(1.8)'}, 25.7)
P.to('#pd', {'opacity': 0, 'duration': .2}, 27.75)
top_label('wp', 'THE FRIENDSHIP PARADOX', 25.7, 27.8, top=130, size=52, color=CORAL)
flash(25.66, .35); punch(25.7, 1.05)
# real networks over a photo
imgs = 'assets/img/friends2.jpg'
P.add(f'<div id="ph" class="abs" style="left:60px;top:330px;width:960px;height:560px;border-radius:24px;overflow:hidden;opacity:0;z-index:5;box-shadow:0 0 0 4px rgba(255,243,230,.92),0 28px 70px rgba(0,0,0,.75)"><img id="phi" src="{imgs}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:contrast(1.05) saturate(1.1)"/>'
      f'<div class="tag2" style="left:18px;bottom:16px;font-size:22px;opacity:1">photo · illustrative</div></div>')
P.frm('#ph', {'opacity': 0, 'y': 70, 'scale': .92}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .38, 'ease': 'power3.out'}, 27.75)
P.frm('#phi', {'scale': 1.0}, {'scale': 1.15, 'duration': 2.3, 'ease': 'none'}, 27.75)
P.to('#ph', {'opacity': 0, 'duration': .2}, 29.95)
net = [(200, 430), (360, 560), (520, 470), (700, 600), (850, 470), (280, 760), (470, 800), (640, 780), (820, 790), (150, 600), (930, 640), (560, 620)]
ned = [(0, 1), (1, 2), (2, 3), (3, 4), (1, 5), (5, 6), (6, 7), (7, 8), (2, 11), (11, 6), (3, 7), (0, 9), (4, 10), (9, 5), (11, 7)]
lines = [(f'ne{i}', net[a][0], net[a][1], net[b][0], net[b][1], 'rgba(255,243,230,.9)', 4) for i, (a, b) in enumerate(ned)]
L = edges_svg(lines, z=7)
for i, (a, b) in enumerate(ned): draw(f'ne{i}', L[f'ne{i}'], 28.0 + .07 * i, .3, t_out=29.9)
for i, (x, y) in enumerate(net):
    node(f'nn{i}', x, y, 15 + (10 if i in (2, 6, 11) else 0), GOLD if i in (2, 6, 11) else CREAM, 28.0 + .05 * i, glyph=False, dur=.2, t_out=29.9, z=8)
txt('rnet', 'REAL NETWORKS', 28.08, 30.0, 960, 120, color=CORAL)
P.add(f'<div class="lab2" id="fb" style="top:1110px;font-size:54px;color:{CREAM};opacity:0;z-index:8">like Facebook</div>')
P.frm('#fb', {'opacity': 0, 'y': 24}, {'opacity': 1, 'y': 0, 'duration': .3}, 28.92); P.to('#fb', {'opacity': 0, 'duration': .15}, 29.95)
c()

# ============================ TWIST: Harvard flu chart (30.0 - 40.15) =======================================
c = scene('f0', 30.0, 40.2)
slam('ft', 'THE FLU TWIST', 30.25, 33.0, 115, 112, color=GOLD, rot=-2)
flash(30.0, .5); punch(30.28, 1.06)
P.add(f'<div class="tag2" id="hv" style="left:150px;top:268px;z-index:8;font-size:26px">Harvard study · 744 students · 2010</div>')
P.frm('#hv', {'opacity': 0, 'y': 14}, {'opacity': 1, 'y': 0, 'duration': .3}, 31.2); P.to('#hv', {'opacity': 0, 'duration': .15}, 40.0)
X0, X1, BASE = 110, 970, 960
P.add(f'<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;z-index:3"><line id="ax1" x1="{X0}" y1="{BASE}" x2="{X1}" y2="{BASE}" stroke="{CREAM}" stroke-width="6" stroke-linecap="round" stroke-dasharray="880" stroke-dashoffset="880"/><line id="ax2" x1="{X0}" y1="{BASE}" x2="{X0}" y2="420" stroke="{CREAM}" stroke-width="6" stroke-linecap="round" stroke-dasharray="560" stroke-dashoffset="560"/></svg>')
P.frm('#ax1', {'strokeDashoffset': 880}, {'strokeDashoffset': 0, 'duration': .5, 'ease': 'power2.out'}, 30.5)
P.frm('#ax2', {'strokeDashoffset': 560}, {'strokeDashoffset': 0, 'duration': .5, 'ease': 'power2.out'}, 30.6)
P.to('#ax1,#ax2', {'opacity': 0, 'duration': .2}, 40.05)
def curve(mu, sig, hgt, n=64):
    pts = [(X0 + 20 + i * (X1 - X0 - 40) / n, BASE - hgt * math.exp(-((X0 + 20 + i * (X1 - X0 - 40) / n - mu) ** 2) / (2 * sig * sig))) for i in range(n + 1)]
    d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)
    Ln = sum(math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) for i in range(n)) + 4
    return d, Ln, pts
FM, RM = 480, 730   # peak x positions (friends earlier by ~2 weeks)
df, Lf, pf = curve(FM, 95, 430); dr, Lr, pr = curve(RM, 95, 430)
areaf = df + f' L{pf[-1][0]:.1f} {BASE} L{pf[0][0]:.1f} {BASE} Z'; arear = dr + f' L{pr[-1][0]:.1f} {BASE} L{pr[0][0]:.1f} {BASE} Z'
P.add(f'<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;z-index:4"><path id="arf" d="{areaf}" fill="{AMBER}" opacity="0"/><path id="arr" d="{arear}" fill="{CORAL}" opacity="0"/>'
      f'<path id="cf" d="{df}" fill="none" stroke="{AMBER}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="{Lf:.0f}" stroke-dashoffset="{Lf:.0f}"/>'
      f'<path id="cr" d="{dr}" fill="none" stroke="{CORAL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="{Lr:.0f}" stroke-dashoffset="{Lr:.0f}"/>'
      f'<line id="pk1" x1="{FM}" y1="{BASE}" x2="{FM}" y2="{BASE-430}" stroke="{AMBER}" stroke-width="4" stroke-dasharray="10 12" opacity="0"/><line id="pk2" x1="{RM}" y1="{BASE}" x2="{RM}" y2="{BASE-430}" stroke="{CORAL}" stroke-width="4" stroke-dasharray="10 12" opacity="0"/></svg>')
P.frm('#cf', {'strokeDashoffset': Lf}, {'strokeDashoffset': 0, 'duration': 1.5, 'ease': 'power1.inOut'}, 32.4)
P.frm('#cr', {'strokeDashoffset': Lr}, {'strokeDashoffset': 0, 'duration': 1.9, 'ease': 'power1.inOut'}, 34.2)
P.to('#arf', {'opacity': .22, 'duration': .5}, 33.9); P.to('#arr', {'opacity': .22, 'duration': .5}, 36.0)
P.to('#pk1', {'opacity': .9, 'duration': .2}, 34.0); P.to('#pk2', {'opacity': .9, 'duration': .2}, 36.0)
P.to('#cf,#cr,#arf,#arr,#pk1,#pk2', {'opacity': 0, 'duration': .2}, 40.05)
P.add(f'<div class="tag2" id="lf" style="left:{FM-340}px;top:470px;z-index:8;background:{AMBER};color:{INK};font-size:24px">THEIR FRIENDS</div><div class="tag2" id="lr" style="left:{RM-105}px;top:405px;z-index:8;background:{CORAL};color:#fff;font-size:24px">RANDOM STUDENTS</div>')
P.frm('#lf', {'opacity': 0, 'x': -20}, {'opacity': 1, 'x': 0, 'duration': .25}, 33.0); P.frm('#lr', {'opacity': 0, 'x': 20}, {'opacity': 1, 'x': 0, 'duration': .25}, 35.7)
P.add(f'<div class="tag2" id="yl" style="left:125px;top:395px;z-index:8;font-size:22px;background:transparent;color:{CREAM}">FLU CASES ↑</div><div class="tag2" id="xl" style="left:820px;top:975px;z-index:8;font-size:22px;background:transparent;color:{CREAM}">TIME →</div>')
P.frm('#yl,#xl', {'opacity': 0}, {'opacity': .9, 'duration': .3}, 30.9)
P.to('#yl,#xl', {'opacity': 0, 'duration': .2}, 40.05)
P.to('#lf,#lr', {'opacity': 0, 'duration': .2}, 40.05)
# the two-week gap arrow
P.add(f'<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;z-index:6"><line id="gap" x1="{FM}" y1="{BASE-470}" x2="{RM}" y2="{BASE-470}" stroke="{GREEN}" stroke-width="10" stroke-linecap="round" stroke-dasharray="{RM-FM}" stroke-dashoffset="{RM-FM}"/>'
      f'<path id="gh" d="M{RM-26} {BASE-494} L{RM} {BASE-470} L{RM-26} {BASE-446}" fill="none" stroke="{GREEN}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></svg>')
P.frm('#gap', {'strokeDashoffset': RM - FM}, {'strokeDashoffset': 0, 'duration': .45, 'ease': 'power2.out'}, 34.65)
P.to('#gh', {'opacity': 1, 'duration': .1}, 35.05)
P.to('#gap,#gh', {'opacity': 0, 'duration': .2}, 37.3)
txt('wk2', 'ABOUT 2 WEEKS EARLIER', 34.64, 37.35, 1090, 92, color=GREEN, extra='z-index:8')
# canary = early warning
P.add(f'<svg id="cn" class="abs" width="120" height="110" viewBox="0 0 120 110" style="left:{FM-60}px;top:{BASE-430-118}px;opacity:0;z-index:9;transform-origin:50% 100%"><ellipse cx="58" cy="64" rx="38" ry="30" fill="#ffd23f" stroke="{INK}" stroke-width="5"/><circle cx="88" cy="42" r="20" fill="#ffd23f" stroke="{INK}" stroke-width="5"/><path d="M104 40l16 6-16 8z" fill="#ff8a3d" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="93" cy="38" r="4.5" fill="{INK}"/><path d="M30 62q18-26 40-4q-14 20-40 4z" fill="#f2b705" stroke="{INK}" stroke-width="4"/><path d="M22 70l-18 12M22 62l-18-2" stroke="{INK}" stroke-width="5" stroke-linecap="round"/><path d="M50 94v12M66 94v12" stroke="#ff8a3d" stroke-width="5" stroke-linecap="round"/></svg>')
P.frm('#cn', {'opacity': 0, 'scale': .2, 'y': -40}, {'opacity': 1, 'scale': 1, 'y': 0, 'duration': .4, 'ease': 'back.out(2.4)'}, 38.4)
P.to('#cn', {'y': -10, 'rotation': 5, 'duration': .22, 'yoyo': True, 'repeat': 6, 'ease': 'sine.inOut'}, 38.85)
P.to('#cn', {'opacity': 0, 'duration': .2}, 40.05)
for k in range(3):
    P.add(f'<div id="rg{k}" class="abs" style="left:{FM-70}px;top:{BASE-430-90}px;width:140px;height:140px;border-radius:50%;border:5px solid {GREEN};opacity:0;z-index:8"></div>')
    P.frm(f'#rg{k}', {'opacity': 0, 'scale': .5}, {'opacity': .9, 'scale': .8, 'duration': .1, 'ease': 'none'}, 38.7 + .28 * k)
    P.to(f'#rg{k}', {'opacity': 0, 'scale': 2.6, 'duration': .7, 'ease': 'power2.out'}, 38.8 + .28 * k)
txt('ew', 'EARLY WARNING', 37.36, 40.15, 1090, 120, color=GOLD, extra='z-index:8')
flash(38.4, .3); punch(38.45, 1.05)
c()

# ============================ NOT YOU (40.15 - 49.2) ========================================================
c = scene('n0', 40.15, 49.2)
top_label('nf', 'YOUR FEED', 40.3, 42.5, top=130, size=64, color=CORAL)
P.add(f'<div id="ph2" class="abs" style="left:330px;top:330px;width:420px;height:700px;border-radius:46px;border:7px solid {CREAM};background:#120712;overflow:hidden;opacity:0;z-index:5;box-shadow:0 30px 80px rgba(0,0,0,.7)"><div id="feed" style="position:absolute;left:0;top:0;width:100%">'
      + ''.join(f'<div style="margin:14px 14px 0;height:122px;border-radius:20px;background:rgba(255,243,230,.1);border:2px solid rgba(255,243,230,.25);position:relative"><div style="position:absolute;left:14px;top:14px;width:54px;height:54px;border-radius:50%;background:{col}"></div><div style="position:absolute;left:82px;top:20px;width:{w}px;height:14px;border-radius:7px;background:rgba(255,243,230,.6)"></div><div style="position:absolute;left:82px;top:46px;width:{w2}px;height:14px;border-radius:7px;background:rgba(255,243,230,.3)"></div><div style="position:absolute;right:16px;bottom:10px;font-family:Anton;font-size:40px;color:{col}">{num}</div></div>'
                for col, w, w2, num in [(AMBER, 170, 120, '98K'), (CORAL, 120, 160, '1.2M'), (TEAL, 190, 100, '450K'), (AMBER, 140, 150, '2.4M'), (CORAL, 180, 110, '730K'), (TEAL, 130, 170, '5M'), (AMBER, 160, 120, '310K'), (CORAL, 150, 140, '8M'), (TEAL, 120, 160, '99K'), (AMBER, 170, 130, '1M')])
      + '</div></div>')
P.frm('#ph2', {'opacity': 0, 'y': 80, 'scale': .9}, {'opacity': 1, 'y': 0, 'scale': 1, 'duration': .4, 'ease': 'power3.out'}, 40.3)
P.frm('#feed', {'y': 0}, {'y': -820, 'duration': 4.0, 'ease': 'none'}, 40.5)
P.to('#ph2', {'opacity': .25, 'scale': .94, 'duration': .3}, 42.4)
P.to('#ph2', {'opacity': 0, 'duration': .2}, 43.35)
slam('nyou', "IT'S NOT YOU", 42.44, 44.1, 1070, 150, color=CORAL, rot=-2)
flash(42.44, .4); punch(42.5, 1.06)
# counted unevenly: mini party graph
mini = {'H': (540, 640), 'A': (410, 520), 'B': (670, 520), 'C': (390, 760), 'D': (540, 860), 'E': (690, 760)}
mlines = [(f'me{k}', 540, 640, x, y, GOLD, 6) for k, (x, y) in mini.items() if k != 'H'] + [('meAB', 410, 520, 670, 520, CREAM, 4)]
L = edges_svg(mlines, z=3)
for i, (k, (x, y)) in enumerate(mini.items()):
    node(f'm{k}', x, y, 52 if k == 'H' else 34, GOLD if k == 'H' else CREAM, 43.5 + .08 * i, ring=CREAM if k == 'H' else None, t_out=45.3)
    if k != 'H': draw(f'me{k}', L[f'me{k}'], 43.5 + .08 * i, .3, t_out=45.3)
draw('meAB', L['meAB'], 44.0, .3, t_out=45.3)
txt('cnt', 'COUNTED UNEVENLY', 43.6, 45.4, 1090, 110, color=GOLD)
top_label('nl', 'THE FRIENDSHIP PARADOX', 43.5, 45.4, top=130, size=46)
# loop: back to the hook picture, then the closing line
top_label('nl2', 'THE FRIENDSHIP PARADOX', 45.4, 49.0, top=120, size=46)
hook_graph('z', 45.4, speed=1.6)
P.add(f'<div class="neon" id="end" style="position:absolute;left:0;right:0;top:1090px;font-size:122px;line-height:1.02;opacity:0;z-index:8">MATH SAYS SO.</div>')
P.frm('#end', {'opacity': 0, 'scale': 1.8}, {'opacity': 1, 'scale': 1, 'duration': .25, 'ease': 'power4.in'}, 47.82)
P.to('#end', {'opacity': 0, 'duration': .2}, 49.05)
shake(48.05, 14); flash(47.82, .4); punch(47.84, 1.06)
P.to('#cam', {'opacity': 0, 'duration': .25}, 48.95)
c()

P.add('</div>')
P.chrome()
P.captions(y=1435)
P.write()
print('fp ok', len(P.js))
