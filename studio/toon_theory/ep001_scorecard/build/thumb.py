"""Thumbnails (vertical 1080x1920 + landscape 1280x720) from the approved character rig."""
import sys, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE + '/../../ep001/build')
import rig
G = rig.G
OUT = HERE + '/../final/thumbnail'; os.makedirs(OUT, exist_ok=True)
def page(W, H, body):
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>@font-face{{font-family:Caveat;src:url(file://{HERE}/assets/caveat.ttf)}}
*{{margin:0;box-sizing:border-box}}body{{width:{W}px;height:{H}px;overflow:hidden;position:relative;font-family:Inter;background:linear-gradient(160deg,#2b1a55,#5a2462 70%,#2a1236)}}
.abs{{position:absolute}}{rig.CSS}</style></head><body>
<div class="abs" style="inset:0;background:radial-gradient(circle,rgba(255,255,255,.08) 3px,transparent 3.5px) 0 0/34px 34px"></div>{body}</body></html>'''
def chars(pl, pt, pw, al, at, aw):
    p, _ = rig.char_html('tp', 'priya', pl, pt, pw); a, _ = rig.char_html('ta', 'ankush', al, at, aw)
    return p.replace('id="tp_F" data-e="neutral"', 'id="tp_F" data-e="smirk"') + a.replace('id="ta_F" data-e="neutral"', 'id="ta_F" data-e="laugh"')
v = page(1080, 1920, chars(-60, 760, 700, 440, 700, 700) +
  '<div class="abs" style="left:-100px;top:1560px;width:1300px;height:400px;background:linear-gradient(180deg,#e9b27a,#6b3f22)"></div>'
  '<div class="abs" style="left:50px;top:150px;font:900 150px/0.95 Inter;color:#fff;-webkit-text-stroke:10px #000;paint-order:stroke fill">SMART GIRL<br><span style="color:#ffd23f">"DUMB"</span> BOY?</div>'
  '<div class="abs" style="z-index:30;left:430px;top:660px;white-space:nowrap;font:900 64px Inter;color:#fff;background:#ff3b3b;padding:8px 24px;border-radius:12px;transform:rotate(-5deg);border:5px solid #000">ACADEMICS 2/10</div>'
  '<div class="abs" style="z-index:30;left:80px;top:1730px;font:700 90px Caveat;color:#1b2a6b;background:#fffdf3;padding:0 30px;border:6px solid #000;border-radius:14px;transform:rotate(-3deg)">Wensday ✗</div>')
l = page(1280, 720, chars(560, 210, 380, 860, 170, 380) +
  '<div class="abs" style="left:40px;top:90px;font:900 112px/0.95 Inter;color:#fff;-webkit-text-stroke:8px #000;paint-order:stroke fill">SMART GIRL<br><span style="color:#ffd23f">"DUMB"</span> BOY?</div>'
  '<div class="abs" style="left:50px;top:470px;font:900 50px Inter;color:#fff;background:#ff3b3b;padding:6px 20px;border-radius:10px;transform:rotate(-4deg);border:4px solid #000">ACADEMICS 2/10</div>')
for name, html, W, H in (('thumb_vertical', v, 1080, 1920), ('thumb_landscape', l, 1280, 720)):
    open(f'/tmp/{name}.html', 'w').write(html)
    js = f"const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:{W},height:{H}}}}});await p.goto('file:///tmp/{name}.html');await p.waitForTimeout(400);await p.screenshot({{path:'{OUT}/{name}.png'}});await b.close();}})();"
    subprocess.run(['node', '-e', js], check=True, env=dict(os.environ, NODE_PATH=subprocess.check_output(['npm', 'root', '-g']).decode().strip()))
print('ok')
