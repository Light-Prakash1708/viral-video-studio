"""Toon Theory puppet rig. Characters come ONLY from characters/generate_characters.py (approved designs).
Each instance = one SVG with: body, head (rotatable), expression layers (CSS-switched via data-e), mouth states
(data-m 0/1/2, driven by the REAL dialogue audio envelope) and a blink layer (data-b)."""
import sys, os, json, copy
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE + '/../../characters')
import generate_characters as G

# background extras for the Episode 2 plant (NOT bible characters)
G.CHARS['extra_a'] = {**copy.deepcopy(G.CHARS['ankush']), 'label': 'EXTRA A', 'top': '#2a2a31', 'over': '#6b7d68', 'bottom': '#3a3f4d', 'skin': '#d9ae8c', 'shade': '#bb9070', 'hair': '#3a2c20', 'style': 'neat', 'acc': [], 'stubble': 0, 'jaw': 0}
G.CHARS['extra_b'] = {**copy.deepcopy(G.CHARS['meera']), 'label': 'EXTRA B', 'top': '#e8e2d6', 'over': '#8c6f9a', 'bottom': '#2d2d3a', 'skin': '#b98a64', 'shade': '#9c704c', 'hair': '#4a2f22', 'style': 'long', 'acc': [], 'brow_col': '#4a2f22'}
INK = G.INK
RIM = G.RIM
M1 = f'<ellipse cx="0" cy="-488" rx="6.5" ry="4.6" fill="#5a1d28" stroke="{INK}" stroke-width="2.4"/>'
M2 = f'<ellipse cx="0" cy="-487" rx="8.6" ry="8" fill="#5a1d28" stroke="{INK}" stroke-width="2.6"/><path d="M-6 -492 Q0 -489 6 -492" stroke="#fff" stroke-width="2.4" fill="none"/>'

CSS = """
.F .E{display:none}
%s
.F .m1,.F .m2{display:none}
.F[data-m="1"] .m0,.F[data-m="2"] .m0{display:none}
.F[data-m="1"] .m1{display:inline}.F[data-m="2"] .m2{display:inline}
.F .lids{display:none}.F[data-b="1"] .lids{display:inline}
""" % '\n'.join(f'.F[data-e="{e}"] .E.{e}{{display:inline}}' for e in G.EXPR)

def face_layers(c):
    """split of G.face(): below (hair back, ears, base, nose), per-expression feature groups, above (front hair, accessories)"""
    back, front = G.hair_parts(c)
    rx = c['hrx']; sk = c['skin']; sh = c['shade']
    jaw = f'<path d="M-{rx} -520 Q-{rx} -472 -22 -468 L22 -468 Q{rx} -472 {rx} -520 Z" fill="{sk}"/>' if c['jaw'] else ''
    stub = (f'<path d="M-{rx-3} -505 Q-{rx-4} -470 0 -466 Q{rx-4} -470 {rx-3} -505 Q{rx-14} -482 0 -480 Q-{rx-14} -482 -{rx-3} -505 Z" fill="{c["hair"]}" opacity=".35"/>') if c['stubble'] else ''
    ears = f'<ellipse cx="-{rx}" cy="-520" rx="6" ry="10" fill="{sk}"/><ellipse cx="{rx}" cy="-520" rx="6" ry="10" fill="{sk}"/>'
    base = f'<ellipse cx="0" cy="-523" rx="{rx}" ry="52" fill="{sk}"/>{jaw}{stub}'
    nose = f'<path d="M1 -520 Q7 -506 -2 -503" fill="none" stroke="{sh}" stroke-width="3" stroke-linecap="round"/>'
    below = back + ears + base + nose
    expr = {}
    for e in G.EXPR:
        L, R, w = G.brows(c, e)
        bro = f'<path d="{L}" fill="none" stroke="{c["brow_col"]}" stroke-width="{w}" stroke-linecap="round"/><path d="{R}" fill="none" stroke="{c["brow_col"]}" stroke-width="{w}" stroke-linecap="round"/>'
        blush = '<ellipse cx="-28" cy="-504" rx="8" ry="4.5" fill="#e5706a" opacity=".35"/><ellipse cx="28" cy="-504" rx="8" ry="4.5" fill="#e5706a" opacity=".35"/>' if e in ('smile', 'laugh', 'smirk') else ''
        m0 = G.mouth(e, sh)
        open_already = e in ('laugh', 'stunned')
        expr[e] = (f'<g class="E {e}">{G.eyes(c, e)}{bro}{blush}<g class="m0">{m0}</g>'
                   f'<g class="m1">{m0 if open_already else M1}</g><g class="m2">{m0 if open_already else M2}</g></g>')
    lids = (f'<g class="lids"><ellipse cx="-17" cy="-527" rx="11.5" ry="10" fill="{sk}"/><ellipse cx="17" cy="-527" rx="11.5" ry="10" fill="{sk}"/>'
            f'<path d="M-27 -526 Q-17 -521 -7 -526 M7 -526 Q17 -521 27 -526" fill="none" stroke="{INK}" stroke-width="2.4" stroke-linecap="round"/></g>')
    acc = ''
    if 'glasses' in c['acc']:
        acc += f'<g fill="none" stroke="{INK}" stroke-width="3"><circle cx="-17" cy="-527" r="13.5"/><circle cx="17" cy="-527" r="13.5"/><path d="M-3.5 -529 Q0 -532 3.5 -529"/></g>'
    if 'hoops' in c['acc']:
        acc += f'<g fill="none" stroke="{c["accent"]}" stroke-width="3"><circle cx="-{rx+1}" cy="-502" r="8"/><circle cx="{rx+1}" cy="-502" r="8"/></g>'
    if 'studs' in c['acc']:
        acc += f'<circle cx="-{rx}" cy="-512" r="3" fill="#f2d27a"/><circle cx="{rx}" cy="-512" r="3" fill="#f2d27a"/>'
    if 'clip' in c['acc']:
        acc += f'<rect x="-9" y="-596" width="18" height="10" rx="5" fill="{c["accent"]}"/>'
    return below, expr, lids, front + acc

def char_html(inst, key, left, top, w, crop='bust', pose='down', flip=False, z=5, extra=''):
    c = G.CHARS[key]; k = c['cm'] / 187.0
    below, expr, lids, above = face_layers(c)
    h = int(w * (330 / 220)) if crop == 'bust' else int(w * (640 / 260))
    vb = '-110 -640 220 330' if crop == 'bust' else '-130 -620 260 640'
    body = G.body_front(c, 'front', pose)
    head = (f'<g id="{inst}_head"><g transform="translate(0 -468) scale({G.HEAD_SCALE}) translate(0 468)">{below}'
            f'<g class="F" id="{inst}_F" data-e="neutral" data-m="0" data-b="0">{"".join(expr.values())}{lids}</g>{above}</g></g>')
    fl = 'scale(-1 1)' if flip else ''
    return (f'<div id="{inst}" class="abs" style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;z-index:{z};{extra}">'
            f'<svg viewBox="{vb}" width="{w}" height="{h}" style="{RIM};overflow:hidden"><g transform="{fl}"><g transform="scale({k})">'
            f'<g id="{inst}_body">{body}</g>{head}</g></g></svg></div>'), h

def envelope(clip_path, fps=24):
    y, sr = sf.read(clip_path); y = y if y.ndim == 1 else y.mean(1)
    n = int(sr / fps); fr = [np.sqrt(np.mean(y[i:i + n] ** 2)) for i in range(0, len(y) - n, n)]
    if not fr: return [0]
    ref = np.percentile(fr, 90) + 1e-9
    return [0 if v < .16 * ref else (1 if v < .55 * ref else 2) for v in fr]
