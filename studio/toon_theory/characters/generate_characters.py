#!/usr/bin/env python3
"""Toon Theory permanent character system.
Generates turnaround + expression + palette sheets (HTML -> PNG via render.js) from ONE parametric
definition per character, so proportions/colours can never drift between episodes.
Edit CHARS below; never hand-edit the SVG output. Output: out/<name>_sheet.html, out/lineup.html
"""
import json, os, sys
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
os.makedirs(OUT, exist_ok=True)
INK = '#1a1220'

# build: shoulder half-width, hip half-width, leg width, head rx ; s = height scale (187cm = 1.0)
CHARS = {
 'priya': dict(label='PRIYA', role='Episode 001 lead', age='22', cm=165, sw=47, hw=44, lw=17, hrx=42, jaw=0,
   skin='#c28a60', shade='#a6714b', hair='#2a1a17', eye='#2b1b14', style='long', brow=3.6, lid=0, stubble=0,
   top='#e0a526', over='#efe2c8', over_len=-280, bottom='#2f3f66', shoe='#f2f0ea', accent='#2a8f93', cuff=14,
   pose='hug', acc=['tote','clip','studs'], brow_col='#2a1a17',
   palette=[('Cream cardigan','#efe2c8'),('Mustard top','#e0a526'),('Indigo jeans','#2f3f66'),('Teal tote','#2a8f93'),('Skin','#c28a60'),('Hair','#2a1a17')],
   body='Shoulders slightly hunched forward, hugs her notebook to her chest, thumbs fidget, leans toward her phone. Straightens and goes very still when she is actually listening.',
   voice='Clear, mid-range, precise. Speeds up when anxious, trails off when unsure.'),
 'meera': dict(label='MEERA', role='Episode 001 friend', age='22', cm=160, sw=48, hw=47, lw=19, hrx=44, jaw=0,
   skin='#dcb08a', shade='#bf8f6b', hair='#16121a', eye='#25181a', style='bob', brow=4.6, lid=0, stubble=0,
   top='#8a2a3d', over='#4f79a8', over_len=-300, bottom='#33343d', shoe='#222126', accent='#d7a63b', cuff=8,
   pose='hip', acc=['hoops'], brow_col='#16121a',
   palette=[('Denim jacket','#4f79a8'),('Burgundy tee','#8a2a3d'),('Charcoal cargos','#33343d'),('Gold hoops','#d7a63b'),('Skin','#dcb08a'),('Hair','#16121a')],
   body='Arms crossed or one hand on hip, weight on one leg, leans back. One eyebrow does most of her talking. Softens fast when Priya is truly hurting.',
   voice='Low, flat, quick. Short sentences. Deadpan, never cruel.'),
 'rohan': dict(label='ROHAN', role='Episode 001', age='23-24', cm=187, sw=52, hw=44, lw=17, hrx=43, jaw=0,
   skin='#b98559', shade='#9d6c45', hair='#1c130f', eye='#2a1810', style='tousled', brow=4.0, lid=.12, stubble=1,
   top='#1d1c22', over='#c4955f', over_len=-300, bottom='#2b2f3b', shoe='#e9e4d8', accent='#b8bcc6', cuff=10,
   pose='pocket', acc=['chain'], brow_col='#1c130f',
   palette=[('Camel suede','#c4955f'),('Black tee','#1d1c22'),('Dark denim','#2b2f3b'),('Silver chain','#b8bcc6'),('Skin','#b98559'),('Hair','#1c130f')],
   body='Open and easy: leans in, hands busy, eyes everywhere at once. Fully present for an hour, gone the next day. Never villainous, never still.',
   voice='Warm, easy, a little vague. Laughs mid-sentence. Self-mocking.'),
 'krish': dict(label='KRISH', role='Permanent recurring', age='21-23', cm=178, sw=44, hw=40, lw=15, hrx=41, jaw=0,
   skin='#d3a077', shade='#b5835c', hair='#17110e', eye='#22150f', style='curly', brow=3.8, lid=.32, stubble=0,
   top='#3b3f48', over='#7d9a7b', over_len=-296, bottom='#18181d', shoe='#8c8f98', accent='#3d8fcf', cuff=8,
   pose='chin', acc=['earbuds'], brow_col='#17110e',
   palette=[('Sage overshirt','#7d9a7b'),('Charcoal tee','#3b3f48'),('Black jeans','#18181d'),('Cool-blue earbuds','#3d8fcf'),('Skin','#d3a077'),('Hair','#17110e')],
   body='Lanky, rounded shoulders, hands in sleeves. Very still while he thinks; stirs things when he overthinks. Notices tiny details others miss, misses his own.',
   voice='Dry, quiet, exact. Understated. Hesitates when unsure ("I think", "don\'t quote me").'),
 'ankush': dict(label='ANKUSH', role='Permanent recurring', age='21-23', cm=182, sw=56, hw=47, lw=19, hrx=45, jaw=1,
   skin='#a8714a', shade='#8f5c3a', hair='#120d0b', eye='#2a160d', style='fade', brow=5.2, lid=0, stubble=1,
   top='#f1eee8', over='#b23a2e', over_len=-296, bottom='#7a93b5', shoe='#f4f4f4', accent='#e9d9b5', cuff=10,
   pose='open', acc=['stripe'], brow_col='#120d0b',
   palette=[('Brick varsity','#b23a2e'),('White tee','#f1eee8'),('Washed jeans','#7a93b5'),('Cream stripe','#e9d9b5'),('Skin','#a8714a'),('Hair','#120d0b')],
   body='Big gestures, takes up space, steals your fries, leans back with his arms spread. Quick to grin, quicker to be wrong. Sincere when it counts.',
   voice='Fast, bright, playful. Confident, teasing, occasionally right.'),
 'aman': dict(label='AMAN', role='Supporting (text and visuals only)', age='22-24', cm=176, sw=48, hw=44, lw=17, hrx=43, jaw=0,
   skin='#c99a72', shade='#ab7d57', hair='#241812', eye='#2a1a12', style='neat', brow=3.8, lid=.08, stubble=0,
   top='#a9c6df', over='#2b3a5c', over_len=-286, bottom='#b9a98a', shoe='#6b4b34', accent='#f1d34a', cuff=10,
   pose='down', acc=['glasses','tote2'], brow_col='#241812',
   palette=[('Navy cardigan','#2b3a5c'),('Sky shirt','#a9c6df'),('Khaki','#b9a98a'),('Bike-light yellow','#f1d34a'),('Skin','#c99a72'),('Hair','#241812')],
   body='Upright and attentive, tote on one shoulder, listens with his whole face. Asks the follow-up question. A friend, not a prize.',
   voice='Text-only in Episode 001 (careful, specific, warm).'),
}
ORDER = ['krish', 'ankush', 'priya', 'meera', 'rohan', 'aman']

EXPR = ['neutral', 'smile', 'laugh', 'deadpan', 'worried', 'stunned', 'smirk', 'hurt']

def brows(c, e, f=1.0):
    """brow paths as (left,right) absolute strings; y baseline -548"""
    y = -548; w = c['brow']
    base = {'neutral': (0, 0, 0), 'smile': (-1, 0, 1), 'laugh': (-3, 0, 2), 'deadpan': (3, 2, 0),
            'worried': (-4, 5, -1), 'stunned': (-7, 0, 0), 'smirk': (-3, 3, 0), 'hurt': (-2, 5, 1)}[e]
    lift, tilt, _ = base
    # left brow rises with tilt (inner end up for worried/hurt), right brow independent for smirk
    li = tilt; ri = tilt
    if e == 'smirk': ri = -3; lift = -1
    if e == 'deadpan': ri = 0
    L = f'M-30 {y+lift+li} Q-22 {y+lift-3} -9 {y+lift-li}'
    R = f'M9 {y+lift-ri} Q22 {y+lift-3} 30 {y+lift+ri}'
    if e == 'smirk': R = f'M9 {y-6} Q22 {y-9} 30 {y-3}'
    return L, R, w

def mouth(e, skin_shade):
    y = -490
    m = {
     'neutral': f'<path d="M-10 {y} Q0 {y+3} 10 {y}" fill="none" stroke="{INK}" stroke-width="3.2" stroke-linecap="round"/>',
     'smile': f'<path d="M-14 {y-2} Q0 {y+11} 14 {y-2}" fill="none" stroke="{INK}" stroke-width="3.4" stroke-linecap="round"/>',
     'laugh': f'<path d="M-16 {y-3} Q0 {y+22} 16 {y-3} Z" fill="#5a1d28" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/><path d="M-12 {y-1} Q0 {y+3} 12 {y-1}" fill="#fff" />',
     'deadpan': f'<path d="M-9 {y+1} L9 {y+1}" stroke="{INK}" stroke-width="3.4" stroke-linecap="round"/>',
     'worried': f'<path d="M-10 {y+5} Q0 {y-4} 10 {y+5}" fill="none" stroke="{INK}" stroke-width="3.2" stroke-linecap="round"/>',
     'stunned': f'<ellipse cx="0" cy="{y+3}" rx="5.5" ry="8" fill="#5a1d28" stroke="{INK}" stroke-width="2.6"/>',
     'smirk': f'<path d="M-11 {y+3} Q3 {y+6} 15 {y-6}" fill="none" stroke="{INK}" stroke-width="3.4" stroke-linecap="round"/>',
     'hurt': f'<path d="M-9 {y+5} Q-1 {y-2} 9 {y+6}" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>',
    }
    return m[e]

def eyes(c, e, dx=0):
    ry = {'neutral': 8, 'smile': 7, 'laugh': 2, 'deadpan': 5.5, 'worried': 8.5, 'stunned': 11, 'smirk': 6.5, 'hurt': 7}[e]
    out = ''
    for sx in (-17, 17):
        cx = sx + dx
        if e == 'laugh':
            out += f'<path d="M{cx-8} -527 Q{cx} -537 {cx+8} -527" fill="none" stroke="{INK}" stroke-width="3.6" stroke-linecap="round"/>'
            continue
        out += f'<ellipse cx="{cx}" cy="-527" rx="9.4" ry="{ry}" fill="#fff" stroke="{INK}" stroke-width="2"/>'
        ix = cx + (3 if e in ('smirk', 'worried') else (-2 if e == 'hurt' else 0))
        iy = -527 + (3 if e in ('hurt', 'worried') else 0)
        out += f'<circle cx="{ix}" cy="{iy}" r="{5.6 if e!="stunned" else 4.2}" fill="{c["eye"]}"/><circle cx="{ix-1.8}" cy="{iy-2}" r="1.7" fill="#fff"/>'
        lid = c['lid'] + (0.16 if e == 'deadpan' else 0) + (.2 if e == 'smirk' else 0)
        if lid > 0:
            h = ry * 2 * min(lid, .6)
            out += f'<path d="M{cx-9.6} {-527-ry} L{cx+9.6} {-527-ry} L{cx+9.6} {-527-ry+h} Q{cx} {-527-ry+h+3} {cx-9.6} {-527-ry+h} Z" fill="{c["skin"]}" stroke="{INK}" stroke-width="1.6"/>'
    return out

def hair_parts(c):
    h = c['hair']; s = c['style']
    back = front = ''
    if s == 'long':
        back = f'<path d="M-53 -520 Q-62 -592 0 -592 Q62 -592 53 -520 L60 -398 Q42 -378 22 -396 L-22 -396 Q-42 -378 -60 -398 Z" fill="{h}"/>'
        front = (f'<path d="M0 -580 Q-50 -577 -47 -516 Q-41 -546 -8 -556 Z" fill="{h}"/><path d="M0 -580 Q50 -577 47 -516 Q41 -546 8 -556 Z" fill="{h}"/>'
                 f'<path d="M-10 -588 Q0 -594 10 -588" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none"/>')
    elif s == 'bob':
        back = f'<path d="M-51 -520 Q-60 -592 0 -592 Q60 -592 51 -520 L53 -468 Q30 -452 0 -460 Q-30 -452 -53 -468 Z" fill="{h}"/>'
        front = f'<path d="M-47 -538 Q-42 -584 12 -582 Q48 -576 47 -538 Q22 -566 -18 -552 Q-38 -548 -47 -520 Z" fill="{h}"/>'
    elif s == 'tousled':
        front = (f'<path d="M-46 -532 Q-54 -592 -20 -588 Q-10 -606 14 -594 Q42 -600 47 -560 Q51 -540 45 -528 Q37 -552 21 -551 Q10 -567 -6 -552 Q-24 -561 -35 -538 Z" fill="{h}"/>'
                 f'<path d="M-30 -586 Q-20 -598 -8 -590" stroke="#fff" stroke-opacity=".18" stroke-width="3" fill="none"/>')
    elif s == 'curly':
        pts = [(-38, -548), (-28, -570), (-10, -582), (10, -583), (28, -571), (40, -548), (-45, -528), (45, -526), (-18, -564), (6, -570), (26, -556), (-30, -552)]
        front = ''.join(f'<circle cx="{x}" cy="{y}" r="{14 if i<8 else 11}" fill="{h}"/>' for i, (x, y) in enumerate(pts))
    elif s == 'fade':
        front = (f'<path d="M-46 -526 Q-46 -580 0 -581 Q46 -580 46 -526 Q40 -552 30 -552 Q0 -548 -30 -552 Q-40 -552 -46 -526 Z" fill="{h}"/>'
                 f'<path d="M-40 -562 Q-10 -600 32 -578 Q48 -566 45 -546 Q22 -562 -4 -557 Q-26 -552 -40 -562 Z" fill="{h}"/>')
    elif s == 'neat':
        front = f'<path d="M-46 -536 Q-49 -586 4 -587 Q49 -583 47 -538 Q35 -562 12 -562 Q-8 -557 -26 -567 Q-41 -561 -46 -536 Z" fill="{h}"/>'
    return back, front

def face(c, e, dx=0, brow_skip=False):
    """frontal head: face base, ears, features, hair. dx shifts features for 3/4."""
    back, front = hair_parts(c)
    rx = c['hrx']; sk = c['skin']; sh = c['shade']
    jaw = ''
    if c['jaw']:
        jaw = f'<path d="M-{rx} -520 Q-{rx} -472 -22 -468 L22 -468 Q{rx} -472 {rx} -520 Z" fill="{sk}"/>'
    stub = f'<path d="M-{rx-3} -505 Q-{rx-4} -470 0 -466 Q{rx-4} -470 {rx-3} -505 Q{rx-14} -482 0 -480 Q-{rx-14} -482 -{rx-3} -505 Z" fill="{c["hair"]}" opacity=".35"/>' if c['stubble'] else ''
    ears = f'<ellipse cx="-{rx}" cy="-520" rx="6" ry="10" fill="{sk}"/><ellipse cx="{rx}" cy="-520" rx="6" ry="10" fill="{sk}"/>'
    base = f'<ellipse cx="0" cy="-523" rx="{rx}" ry="52" fill="{sk}"/>{jaw}{stub}'
    nose = f'<path d="M{dx+1} -520 Q{dx+7} -506 {dx-2} -503" fill="none" stroke="{sh}" stroke-width="3" stroke-linecap="round"/>'
    L, R, w = brows(c, e)
    bro = f'<path d="{L}" fill="none" stroke="{c["brow_col"]}" stroke-width="{w}" stroke-linecap="round"/><path d="{R}" fill="none" stroke="{c["brow_col"]}" stroke-width="{w}" stroke-linecap="round"/>'
    blush = f'<ellipse cx="-28" cy="-504" rx="8" ry="4.5" fill="#e5706a" opacity=".35"/><ellipse cx="28" cy="-504" rx="8" ry="4.5" fill="#e5706a" opacity=".35"/>' if e in ('smile', 'laugh', 'smirk') else ''
    acc = ''
    if 'glasses' in c['acc']:
        acc += f'<g fill="none" stroke="{INK}" stroke-width="3"><circle cx="{-17+dx}" cy="-527" r="13.5"/><circle cx="{17+dx}" cy="-527" r="13.5"/><path d="M{-3.5+dx} -529 Q{dx} -532 {3.5+dx} -529"/></g>'
    if 'hoops' in c['acc']:
        acc += f'<g fill="none" stroke="{c["accent"]}" stroke-width="3"><circle cx="-{rx+1}" cy="-502" r="8"/><circle cx="{rx+1}" cy="-502" r="8"/></g>'
    if 'studs' in c['acc']:
        acc += f'<circle cx="-{rx}" cy="-512" r="3" fill="#f2d27a"/><circle cx="{rx}" cy="-512" r="3" fill="#f2d27a"/>'
    if 'clip' in c['acc']:
        acc += f'<rect x="-9" y="-596" width="18" height="10" rx="5" fill="{c["accent"]}"/>'
    feat = f'<g transform="translate({dx} 0)">{eyes(c, e)}{"" if brow_skip else bro}{mouth(e, sh)}{blush}</g>'
    return f'<g>{back}{ears}{base}{nose}{feat}{front}{acc}</g>'

def head_side(c):
    sk = c['skin']; sh = c['shade']; h = c['hair']
    hair = {'long': f'<path d="M-44 -520 Q-50 -592 8 -590 Q40 -586 38 -540 Q20 -566 -10 -558 L-20 -400 Q-45 -400 -46 -420 Z" fill="{h}"/>',
            'bob': f'<path d="M-44 -520 Q-50 -592 8 -590 Q40 -586 38 -540 Q16 -566 -10 -556 L-8 -462 Q-34 -452 -46 -470 Z" fill="{h}"/>'}.get(c['style'],
            f'<path d="M-44 -530 Q-50 -594 6 -592 Q42 -588 40 -548 Q18 -566 -8 -556 Q-34 -552 -44 -530 Z" fill="{h}"/>')
    if c['style'] == 'curly':
        hair = ''.join(f'<circle cx="{x}" cy="{y}" r="14" fill="{h}"/>' for x, y in [(-30, -556), (-14, -574), (6, -582), (26, -572), (36, -552), (-38, -536), (-8, -562)])
    face_ = (f'<ellipse cx="0" cy="-523" rx="40" ry="52" fill="{sk}"/><path d="M38 -520 L50 -503 L38 -498 Z" fill="{sk}" stroke="{sh}" stroke-width="2"/>'
             f'<ellipse cx="-4" cy="-518" rx="6" ry="10" fill="{sh}"/><ellipse cx="20" cy="-527" rx="7" ry="8" fill="#fff" stroke="{INK}" stroke-width="2"/><circle cx="23" cy="-527" r="4.6" fill="{c["eye"]}"/>'
             f'<path d="M12 -548 Q22 -551 32 -546" fill="none" stroke="{c["brow_col"]}" stroke-width="{c["brow"]}" stroke-linecap="round"/><path d="M24 -490 Q31 -488 36 -491" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>')
    extra = ''
    if 'glasses' in c['acc']:
        extra = f'<g fill="none" stroke="{INK}" stroke-width="3"><circle cx="20" cy="-527" r="12.5"/><path d="M8 -527 L-30 -530"/></g>'
    return f'<g>{face_}{hair}{extra}</g>'

def head_back(c):
    h = c['hair']; sk = c['skin']
    base = f'<ellipse cx="0" cy="-523" rx="{c["hrx"]}" ry="52" fill="{sk}"/>'
    cap = {'long': f'<path d="M-53 -520 Q-62 -594 0 -594 Q62 -594 53 -520 L60 -398 Q40 -376 0 -392 Q-40 -376 -60 -398 Z" fill="{h}"/>',
           'bob': f'<path d="M-52 -520 Q-60 -594 0 -594 Q60 -594 52 -520 L53 -466 Q0 -446 -53 -466 Z" fill="{h}"/>'}.get(c['style'],
           f'<ellipse cx="0" cy="-534" rx="{c["hrx"]+3}" ry="48" fill="{h}"/>')
    if c['style'] == 'curly':
        cap = f'<ellipse cx="0" cy="-534" rx="{c["hrx"]+4}" ry="48" fill="{h}"/>' + ''.join(f'<circle cx="{x}" cy="{y}" r="13" fill="{h}"/>' for x, y in [(-30, -562), (-8, -582), (14, -580), (34, -560), (-40, -532), (42, -530), (0, -552)])
    clip = f'<rect x="-14" y="-566" width="28" height="12" rx="6" fill="{c["accent"]}"/>' if 'clip' in c['acc'] else ''
    return f'<g>{base}{cap}{clip}</g>'

def body_front(c, view='front', pose='down'):
    sw, hw, lw = c['sw'], c['hw'], c['lw']
    top, over, bot, shoe, sk = c['top'], c['over'], c['bottom'], c['shoe'], c['skin']
    sx = {'front': 1.0, '3q': 0.9, 'back': 1.0}[view]
    L = f'<g transform="scale({sx} 1)">'
    # legs
    for sgn in (-1, 1):
        x0 = sgn * -2; x1 = sgn * (hw * 0.9)
        L += f'<path d="M{x0} -296 L{x1} -296 L{sgn*(lw+6)} -14 L{sgn*2} -14 Z" fill="{bot}"/>'
        L += f'<path d="M{sgn*5} -16 L{sgn*(lw+8)} -16 Q{sgn*(lw+24)} -8 {sgn*(lw+22)} 0 L{sgn*4} 0 Z" fill="{shoe}"/><path d="M{sgn*4} -2 L{sgn*(lw+22)} -2" stroke="#000" stroke-opacity=".25" stroke-width="3"/>'
    # neck
    L += f'<rect x="-11" y="-474" width="22" height="40" rx="8" fill="{sk}"/>'
    # torso
    L += f'<path d="M{-sw} -438 Q0 -454 {sw} -438 L{sw*0.86} -330 L{hw} -292 L{-hw} -292 L{-sw*0.86} -330 Z" fill="{top}"/>'
    if view != 'back':
        L += f'<path d="M-14 -446 Q0 -430 14 -446" fill="{sk}"/>'
    # over layer (open front)
    ol = c['over_len']
    L += f'<path d="M{-sw-2} -438 Q{-sw*0.5} -450 -6 -446 L-9 {ol} L{-hw-6} {ol+4} L{-sw*0.86-4} -330 Z" fill="{over}"/>'
    L += f'<path d="M{sw+2} -438 Q{sw*0.5} -450 6 -446 L9 {ol} L{hw+6} {ol+4} L{sw*0.86+4} -330 Z" fill="{over}"/>'
    if view == 'back':
        L += f'<path d="M{-sw-2} -438 Q0 -454 {sw+2} -438 L{hw+6} {ol+4} L{-hw-6} {ol+4} Z" fill="{over}"/><path d="M0 -446 L0 {ol}" stroke="#000" stroke-opacity=".2" stroke-width="2"/>'
    # arms
    cuff = c['cuff']
    def arm(sg, ang=0, bend=None):
        x0 = sg * (sw + 2); y0 = -436
        if bend:
            return bend
        return (f'<path d="M{x0-sg*12} {y0} Q{x0+sg*10} {y0+6} {x0+sg*6} {y0+60} L{x0+sg*(8+ang)} -262 L{x0-sg*(11-ang)} -262 L{x0-sg*18} {y0+40} Z" fill="{over}"/>'
                f'<rect x="{min(x0+sg*(8+ang), x0-sg*(11-ang))-1}" y="-266" width="{abs(19-0)+2}" height="{cuff}" rx="4" fill="{top}" opacity=".95"/>'
                f'<circle cx="{x0+sg*(-1+ang)}" cy="-246" r="10" fill="{sk}"/>')
    if pose in ('down', 'open') or view == 'back':
        L += arm(-1, 0) + arm(1, 0)
    elif pose == 'hip':
        L += arm(-1, 0)
        L += f'<path d="M{sw-6} -436 Q{sw+22} -400 {hw+10} -336 L{hw-8} -330 Q{sw-4} -380 {sw-18} -420 Z" fill="{over}"/><circle cx="{hw-2}" cy="-324" r="10" fill="{sk}"/>'
    elif pose == 'pocket':
        L += arm(-1, 0)
        L += f'<path d="M{sw-6} -436 Q{sw+10} -380 {hw-2} -330 L{hw-22} -326 Q{sw-6} -380 {sw-20} -424 Z" fill="{over}"/><circle cx="{hw-10}" cy="-322" r="9" fill="{sk}"/>'
    elif pose == 'chin':
        L += arm(-1, 0)
        L += f'<path d="M{sw-8} -436 Q{sw+16} -420 {sw*0.4} -420 L{sw*0.28} -432 Q{sw+4} -432 {sw-22} -428 Z" fill="{over}"/><circle cx="{sw*0.2}" cy="-466" r="0" fill="{sk}"/>'
        L += f'<path d="M{sw*0.6} -425 L{sw*0.36} -482" stroke="{over}" stroke-width="22" stroke-linecap="round"/><circle cx="{sw*0.3}" cy="-492" r="10" fill="{sk}"/>'
    elif pose == 'hug':
        L += f'<rect x="{-hw+4}" y="-404" width="{2*hw-8}" height="64" rx="5" fill="#f4efe6" stroke="{INK}" stroke-width="2.5"/><path d="M{-hw+12} -386 L{hw-12} -386 M{-hw+12} -372 L{hw-18} -372" stroke="#9aa" stroke-width="2"/>'
        L += f'<path d="M{-sw-2} -432 Q{-sw-6} -380 {-sw*0.3} -366 L{-sw*0.3} -350 Q{-sw-18} -368 {-sw+8} -436 Z" fill="{over}"/><path d="M{sw+2} -432 Q{sw+6} -380 {sw*0.3} -366 L{sw*0.3} -350 Q{sw+18} -368 {sw-8} -436 Z" fill="{over}"/>'
        L += f'<circle cx="{-sw*0.3}" cy="-356" r="9" fill="{sk}"/><circle cx="{sw*0.3}" cy="-356" r="9" fill="{sk}"/>'
    # accessories on body
    a = c['acc']
    if 'earbuds' in a and view != 'back':
        L += f'<path d="M-16 -450 Q-14 -420 0 -406 Q14 -420 16 -450" fill="none" stroke="{c["accent"]}" stroke-width="3"/><circle cx="-16" cy="-450" r="4" fill="{c["accent"]}"/><circle cx="16" cy="-450" r="4" fill="{c["accent"]}"/>'
    if 'chain' in a and view != 'back':
        L += f'<path d="M-15 -448 Q0 -420 15 -448" fill="none" stroke="{c["accent"]}" stroke-width="2.5"/>'
    if 'stripe' in a:
        L += f'<path d="M{-sw-6} -432 L{-sw-12} -268" stroke="{c["accent"]}" stroke-width="4"/><path d="M{sw+6} -432 L{sw+12} -268" stroke="{c["accent"]}" stroke-width="4"/>'
    if ('tote' in a or 'tote2' in a):
        col = c['accent'] if 'tote' in a else '#c9b78f'
        L += f'<path d="M{-sw+6} -440 L{hw+28} -330" stroke="{col}" stroke-width="5"/><rect x="{hw+4}" y="-352" width="54" height="66" rx="6" fill="{col}" stroke="{INK}" stroke-width="2"/>'
        if 'tote' in a: L += f'<rect x="{hw+10}" y="-362" width="26" height="14" rx="2" fill="#f4efe6" stroke="{INK}" stroke-width="1.5"/>'
        if 'tote2' in a: L += f'<circle cx="{hw+42}" cy="-336" r="5" fill="{c["accent"]}"/>'
    L += '</g>'
    return L

def body_side(c):
    sk, top, over, bot, shoe = c['skin'], c['top'], c['over'], c['bottom'], c['shoe']
    d = c['sw'] * 0.55
    L = f'<path d="M-6 -296 L{d*0.7} -296 L{c["lw"]+2} -14 L0 -14 Z" fill="{bot}" opacity=".85"/><path d="M-4 -296 L{d*0.6} -296 L{c["lw"]-6} -14 L-8 -14 Z" fill="{bot}"/>'
    L += f'<path d="M-2 -16 L{c["lw"]+2} -16 Q{c["lw"]+34} -8 {c["lw"]+32} 0 L-4 0 Z" fill="{shoe}"/>'
    L += f'<rect x="-9" y="-474" width="20" height="40" rx="8" fill="{sk}"/>'
    L += f'<path d="M{-d} -438 Q0 -452 {d} -438 L{d*0.9} -330 L{d*0.8} -292 L{-d*0.85} -292 L{-d*0.9} -330 Z" fill="{top}"/>'
    L += f'<path d="M{-d-2} -438 Q0 -452 {d+2} -438 L{d*0.9+2} {c["over_len"]} L{-d*0.9-2} {c["over_len"]} Z" fill="{over}"/>'
    L += f'<path d="M-8 -436 Q{d+4} -420 {d+8} -330 L{d-4} -262 L-8 -262 Z" fill="{over}" stroke="#000" stroke-opacity=".15"/><circle cx="{d-2}" cy="-246" r="10" fill="{sk}"/>'
    if any(a in c['acc'] for a in ('tote', 'tote2')):
        col = c['accent'] if 'tote' in c['acc'] else '#c9b78f'
        L += f'<rect x="{-d-30}" y="-352" width="38" height="66" rx="6" fill="{col}" stroke="{INK}" stroke-width="2"/>'
    return L

RIM = 'filter:drop-shadow(-7px 0 6px rgba(255,140,60,.55)) drop-shadow(7px 0 6px rgba(70,130,255,.5))'

HEAD_SCALE = 1.22
def HS(svg):
    return f'<g transform="translate(0 -468) scale({HEAD_SCALE}) translate(0 468)">{svg}</g>'

def figure(c, view, e='neutral', pose=None, scale=1.0, w=260, h=640):
    s = c['cm'] / 187.0 * scale
    pose = pose or 'down'
    if view == 'front':
        inner = body_front(c, 'front', pose) + HS(face(c, e))
    elif view == '3q':
        inner = body_front(c, '3q', pose if pose != 'down' else 'down') + HS(f'<g transform="translate(-2 0)">{face(c, e, dx=9)}</g>')
    elif view == 'side':
        inner = body_side(c) + HS(head_side(c))
    else:
        inner = body_front(c, 'back', 'down') + HS(head_back(c))
    return f'<svg viewBox="-130 -620 260 640" width="{w}" height="{h}" style="{RIM};overflow:visible"><g transform="scale({s})" >{inner}</g></svg>'

def head_icon(c, e, size=190):
    return f'<svg viewBox="-70 -610 140 160" width="{size}" height="{size*160/140:.0f}" style="{RIM}"><g>{face(c, e)}</g></svg>'

CSS = """
*{box-sizing:border-box;margin:0}body{width:1800px;height:1150px;background:radial-gradient(ellipse at 20% 0%,#2a1d34 0%,#14101c 55%,#0a0d18 100%);color:#fff3e6;font-family:Inter,Arial,sans-serif;position:relative;overflow:hidden}
.top{position:absolute;left:48px;top:30px;right:48px;display:flex;align-items:baseline;gap:22px}
.name{font:800 64px Oswald,Impact,sans-serif;letter-spacing:.06em}.meta{font:500 24px Inter;color:#ffb86a}
.sub{position:absolute;left:48px;top:110px;font:500 21px Inter;color:#c9c3d6;width:1700px}
.lab{font:700 15px Inter;letter-spacing:.22em;color:#7fb2ff;text-transform:uppercase}
.row{position:absolute;display:flex}.fig{display:flex;flex-direction:column;align-items:center;width:240px}
.fig small{font:600 14px Inter;color:#b8b2c6;margin-top:2px;letter-spacing:.12em;text-transform:uppercase}
.ex{display:flex;flex-direction:column;align-items:center;width:190px}.ex small{font:600 13px Inter;color:#b8b2c6;letter-spacing:.14em;text-transform:uppercase}
.sw{display:flex;align-items:center;gap:10px;margin:7px 0;font:500 17px Inter}.sw i{width:34px;height:34px;border-radius:8px;border:2px solid rgba(255,255,255,.35);display:block}
.box{position:absolute;font:400 18px/1.45 Inter;color:#e7e1f2}
.ground{position:absolute;left:40px;right:40px;height:3px;background:linear-gradient(90deg,transparent,#ff9a4d,#4d8bff,transparent);opacity:.7}
"""

def sheet(key):
    c = CHARS[key]
    h = ''
    h += f'<div class="top"><div class="name">{c["label"]}</div><div class="meta">{c["role"]} · age {c["age"]} · {c["cm"]} cm</div></div>'
    h += f'<div class="sub">Slightly stylised 2D figure · ~6 heads tall · warm orange rim light (left) / cool blue rim light (right) · see CHARACTER_BIBLE.md</div>'
    h += '<div class="lab" style="position:absolute;left:48px;top:158px">Turnaround · front · three-quarter · side · back · signature pose</div>'
    views = [('front', 'down'), ('3q', 'down'), ('side', 'down'), ('back', 'down'), ('front', c['pose'])]
    x = 30
    for v, p in views:
        h += f'<div class="row" style="left:{x}px;top:182px"><div class="fig">{figure(c, v, "neutral", p, w=240, h=590)}<small>{v if p=="down" else "signature pose"}</small></div></div>'
        x += 250
    h += '<div class="ground" style="top:772px"></div>'
    h += '<div class="lab" style="position:absolute;left:1310px;top:158px">Expressions</div>'
    for i, e in enumerate(EXPR):
        ex = 1290 + (i % 3) * 165; ey = 182 + (i // 3) * 190
        h += f'<div class="row" style="left:{ex}px;top:{ey}px"><div class="ex">{head_icon(c, e, 150)}<small>{e}</small></div></div>'
    h += '<div class="lab" style="position:absolute;left:48px;top:800px">Palette</div><div class="row" style="left:48px;top:828px;flex-wrap:wrap;width:760px">'
    for n, col in c['palette']:
        h += f'<div class="sw" style="width:245px"><i style="background:{col}"></i>{n}<span style="opacity:.55;font-size:13px">{col}</span></div>'
    h += '</div>'
    h += f'<div class="box" style="left:830px;top:800px;width:900px"><b style="color:#ffb86a">BODY LANGUAGE</b> — {c["body"]}<br><br><b style="color:#7fb2ff">VOICE</b> — {c["voice"]}</div>'
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{h}</body></html>'

def lineup():
    h = '<div class="top"><div class="name">TOON THEORY</div><div class="meta">Relationship-psychology cast · height comparison · consistent scale</div></div>'
    h += '<div class="ground" style="top:900px"></div>'
    x = 40
    for k in ['priya', 'meera', 'rohan', 'krish', 'ankush', 'aman']:
        c = CHARS[k]
        h += f'<div class="row" style="left:{x}px;top:230px"><div class="fig" style="width:290px">{figure(c, "front", "neutral", c["pose"] if c["pose"] in ("down","open","pocket","hip") else "down", w=290, h=700)}<small style="font-size:18px;color:#fff3e6">{c["label"]} · {c["cm"]}cm</small></div></div>'
        x += 285
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{h}</body></html>'

def bust(c, e, w, h, flip=False, pose='down', hs=1.0):
    k = c['cm'] / 187.0
    inner = body_front(c, 'front', 'down') + HS(face(c, e))
    t = f'scale({-1 if flip else 1} 1)' if flip else ''
    return (f'<svg viewBox="-110 -640 220 330" width="{w}" height="{h}" style="{RIM};overflow:hidden"><g transform="{t}"><g transform="scale({k*hs})">{inner}</g></g></svg>')

def lookdev():
    k, a = CHARS['krish'], CHARS['ankush']
    bokeh = ''.join(f'<i style="left:{x}px;top:{y}px;width:{r}px;height:{r}px;background:{col};filter:blur({b}px);opacity:{o}"></i>' for x, y, r, col, b, o in [
      (70,330,190,'#ff9a3d',22,.55),(260,200,120,'#ffb86a',14,.5),(120,560,150,'#ff7a3d',18,.4),(700,260,170,'#4d8bff',22,.5),(880,420,210,'#3d6fe0',26,.45),(560,160,100,'#7fb2ff',12,.4),(930,170,90,'#6ea4ff',10,.5),(430,420,110,'#ffcf8a',14,.35)])
    page = f'''<!doctype html><html><head><meta charset="utf-8"><style>
*{{margin:0;box-sizing:border-box}}body{{width:1080px;height:1920px;overflow:hidden;background:#0b0d18;position:relative;font-family:Inter,Arial}}
.bg{{position:absolute;inset:0;background:linear-gradient(180deg,#1b1a33 0%,#201a2e 35%,#2a1b22 60%,#150f16 100%)}}
.win{{position:absolute;left:40px;top:150px;width:1000px;height:760px;border-radius:22px;background:linear-gradient(90deg,rgba(255,140,60,.22),rgba(40,60,120,.35) 60%,rgba(70,130,255,.28));border:6px solid #3a2f3c;overflow:hidden}}
.win i{{position:absolute;border-radius:50%;display:block}}
.mull{{position:absolute;top:150px;height:760px;width:10px;background:#3a2f3c}}
.table{{position:absolute;left:-60px;right:-60px;top:1500px;height:420px;background:linear-gradient(180deg,#5a3a2a,#2d1c17);transform:perspective(600px) rotateX(24deg);transform-origin:top;box-shadow:0 -10px 60px rgba(255,140,60,.25)}}
.shadowl{{position:absolute;inset:0;background:radial-gradient(ellipse at 15% 40%,rgba(255,140,60,.28),transparent 55%),radial-gradient(ellipse at 90% 30%,rgba(70,130,255,.30),transparent 55%)}}
.vig{{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 45%,rgba(0,0,0,.62))}}
.c1{{position:absolute;left:20px;top:830px}}.c2{{position:absolute;left:540px;top:800px}}
.cup{{position:absolute;left:230px;top:1500px;width:120px;height:90px;border-radius:0 0 40px 40px;background:#efe2c8;box-shadow:0 14px 24px rgba(0,0,0,.5)}}
.fries{{position:absolute;left:660px;top:1520px;width:170px;height:70px;border-radius:12px;background:#d9a441;box-shadow:0 14px 24px rgba(0,0,0,.5)}}
.cap{{position:absolute;left:40px;right:40px;top:1735px;text-align:center;font:900 58px Inter,Arial,sans-serif;color:#fff3e6;letter-spacing:.02em;text-shadow:0 4px 0 #000}}
.tag{{position:absolute;left:40px;top:40px;font:700 22px Inter;letter-spacing:.2em;color:#7fb2ff}}
</style></head><body><div class="bg"></div><div class="win">{bokeh}</div><div class="mull" style="left:380px"></div><div class="mull" style="left:700px"></div>
<div class="shadowl"></div>
<div class="c1">{bust(k,'deadpan',480,720)}</div><div class="c2">{bust(a,'smirk',500,750,flip=False)}</div>
<div class="table"></div><div class="cup"></div><div class="fries"></div>
<div class="vig"></div><div class="tag">LOOK-DEV TEST · NOT FINAL ANIMATION</div><div class="cap">"SHE'S PINNED HIS CHAT."</div></body></html>'''
    return page

if __name__ == '__main__':
    for k in CHARS:
        open(os.path.join(OUT, f'{k}_sheet.html'), 'w').write(sheet(k))
    open(os.path.join(OUT, 'lineup.html'), 'w').write(lineup())
    open(os.path.join(OUT, 'lookdev_cafe_v.html'), 'w').write(lookdev())
    json.dump({k: {kk: vv for kk, vv in v.items() if kk in ('label', 'role', 'age', 'cm', 'skin', 'hair', 'top', 'over', 'bottom', 'shoe', 'accent')} for k, v in CHARS.items()}, open(os.path.join(OUT, 'characters.json'), 'w'), indent=1)
    print('wrote sheets for', ', '.join(CHARS))
