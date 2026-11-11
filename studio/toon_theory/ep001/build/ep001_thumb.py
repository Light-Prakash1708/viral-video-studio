import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import rig
OUT = os.path.dirname(os.path.abspath(__file__)) + '/../thumbnail'
css = rig.CSS + """*{margin:0;box-sizing:border-box}body{background:#0b0d18;font-family:Inter,Arial,sans-serif;overflow:hidden;position:relative}.abs{position:absolute}
.reel{position:absolute;background:#fff3e6;border:6px solid #1a1220;border-radius:16px;font:900 64px/150px Inter;color:#1a1220;text-align:center}"""
def slot(x, y, s=1.0):
    return (f'<div class="abs" style="left:{x}px;top:{y}px;width:{540*s}px;height:{420*s}px;transform-origin:0 0;border-radius:44px;background:linear-gradient(160deg,#e9b44a,#b5701c);border:10px solid #5a3a12;box-shadow:0 30px 80px rgba(0,0,0,.6);z-index:5">'
            f'<div class="abs" style="left:{110*s}px;top:{26*s}px;width:{320*s}px;height:{70*s}px;border-radius:16px;background:#2a1530;font:900 {44*s}px/{70*s}px Inter;color:#ffcf5a;text-align:center;letter-spacing:.14em">MAYBE</div>'
            + ''.join(f'<div class="reel" style="left:{(34 + i * 160) * s}px;top:{140 * s}px;width:{140 * s}px;height:{150 * s}px;font-size:{60 * s}px;line-height:{138 * s}px">hey</div>' for i in range(3)) + '</div>')
bg = ('<div class="abs" style="inset:0;background:radial-gradient(ellipse at 25% 30%,rgba(255,140,60,.55),transparent 55%),radial-gradient(ellipse at 85% 70%,rgba(70,130,255,.55),transparent 55%),linear-gradient(180deg,#1b1a33,#120d1a)"></div>')
def page(w, h, body): return f'<!doctype html><html><head><meta charset="utf-8"><style>{css}body{{width:{w}px;height:{h}px}}</style></head><body>{body}</body></html>'
pri, _ = rig.char_html('tp', 'priya', 190, 790, 700, z=9)
v = bg + '<div class="abs" style="left:0;right:0;top:130px;text-align:center;font:900 230px/.92 Inter;color:#fff3e6;text-shadow:0 0 70px rgba(255,140,60,.8),0 10px 0 #000;z-index:20">THE<br>MAYBE</div>' + slot(270, 560, .9) + pri + \
    '<div class="abs" style="left:60px;right:60px;top:1700px;text-align:center;font:800 54px/1.15 Inter;color:#ffc470;z-index:20;text-shadow:0 4px 0 #000">Why smart people wait on the wrong text</div>'
open(OUT + '/thumb_vertical.html', 'w').write(page(1080, 1920, v).replace('id="tp_F" data-e="neutral"', 'id="tp_F" data-e="smile"'))
pri2, _ = rig.char_html('tq', 'priya', 700, 40, 640, z=9)
l = bg + '<div class="abs" style="left:50px;top:70px;font:900 170px/.9 Inter;color:#fff3e6;text-shadow:0 0 60px rgba(255,140,60,.8),0 8px 0 #000;z-index:20">THE<br>MAYBE</div>' + slot(60, 400, .62) + pri2 + \
     '<div class="abs" style="left:56px;top:640px;font:800 34px Inter;color:#ffc470;z-index:20;text-shadow:0 3px 0 #000">Why smart people wait on the wrong text</div>'
open(OUT + '/thumb_landscape.html', 'w').write(page(1280, 720, l).replace('id="tq_F" data-e="neutral"', 'id="tq_F" data-e="worried"'))
