import json, re, os, subprocess, shutil

W, H, FPS = 1080, 1920, 24
CORAL, AMBER, TEAL, CREAM, INK = '#ff4f6d', '#ffb347', '#2fe6d0', '#fff3e6', '#120712'


class Proj:
    def __init__(self, name, dur, words):
        self.name, self.dur = name, dur
        self.dir = f'/root/hf-shorts/{name}'
        self.body, self.js, self.css, self.n = [], [], [], 0
        self.words = words

    # ---- timeline helpers (json keeps braces safe)
    def to(self, sel, props, t):
        self.js.append(f"tl.to({json.dumps(sel)},{json.dumps(props)},{t:.3f});")

    def frm(self, sel, a, b, t):
        self.js.append(f"tl.fromTo({json.dumps(sel)},{json.dumps(a)},{json.dumps(b)},{t:.3f});")

    def st(self, sel, props, t):
        self.js.append(f"tl.set({json.dumps(sel)},{json.dumps(props)},{t:.3f});")

    def raw(self, s):
        self.js.append(s)

    def add(self, html):
        self.body.append(html)

    def uid(self, p='e'):
        self.n += 1
        return f'{p}{self.n}'

    def scene(self, sid, t0, t1, z=5):
        """open a scene group visible only between t0 and t1; returns closer"""
        self.add(f'<div class="sc" id="{sid}" style="z-index:{z}">')
        self.st('#' + sid, {'opacity': 1}, t0)
        self.st('#' + sid, {'opacity': 0}, t1)
        return lambda: self.add('</div>')

    def counter(self, sel, v0, v1, t0, dur, fmt, ease='power2.out'):
        o = self.uid('o')
        self.js.append(
            f"var {o}={{v:{v0}}};tl.to({o},{{v:{v1},duration:{dur:.3f},ease:{json.dumps(ease)},"
            f"onUpdate:function(){{var e=document.querySelector({json.dumps(sel)});if(e)e.textContent={fmt}({o}.v);}}}},{t0:.3f});")

    # ---- captions
    def captions(self, y=1390):
        ws = []
        for w in self.words:
            t = w['w']
            if ws and (re.match(r'^[,.]\d', t) or t in ('-by.',)):
                ws[-1]['w'] += t
                ws[-1]['e'] = w['e']
            else:
                ws.append(dict(w))
        chunks, cur = [], []
        for w in ws:
            cur.append(w)
            txt = ' '.join(x['w'] for x in cur)
            if re.search(r'[.,?!]$', w['w']) or len(cur) >= 3 or len(txt) > 20:
                chunks.append(cur)
                cur = []
        if cur:
            chunks.append(cur)
        for i, ch in enumerate(chunks):
            spans = ''.join(f'<span id="c{i}w{j}">{re.sub("[^A-Za-z0-9$%,.?!\\-#\\x27]", "", x["w"]).upper()}</span> ' for j, x in enumerate(ch))
            self.add(f'<div class="cap" id="c{i}" style="top:{y}px">{spans}</div>')
            s, e = ch[0]['s'], ch[-1]['e'] + 0.12
            if i + 1 < len(chunks):
                e = min(e, chunks[i + 1][0][0]['s'] if False else chunks[i + 1][0]['s'])
            self.frm(f'#c{i}', {'opacity': 0, 'scale': .86, 'y': 14}, {'opacity': 1, 'scale': 1, 'y': 0, 'duration': .14, 'ease': 'back.out(2)'}, s)
            self.st(f'#c{i}', {'opacity': 0}, e)
            for j, x in enumerate(ch):
                self.st(f'#c{i}w{j}', {'color': AMBER}, x['s'])

    # ---- shared texture/ui
    def chrome(self, tag_events=()):
        self.css.append(f"""
*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:{W}px;height:{H}px;overflow:hidden;background:#000}}
#root{{position:relative;width:{W}px;height:{H}px;overflow:hidden;background:{INK};font-family:Inter,sans-serif}}
.sc{{position:absolute;inset:0;opacity:0}}
.abs{{position:absolute}}
.cap{{position:absolute;left:30px;right:30px;text-align:center;z-index:30;font-family:Anton,Oswald,sans-serif;font-size:84px;line-height:1.05;color:{CREAM};letter-spacing:.01em;
text-shadow:0 5px 0 rgba(0,0,0,.85),0 0 22px rgba(0,0,0,.9);-webkit-text-stroke:3px rgba(0,0,0,.9);paint-order:stroke fill;opacity:0}}
.cap span{{display:inline-block}}
.big{{font-family:Anton,Oswald,sans-serif;color:{CREAM};text-align:center;line-height:.95}}
.lab{{font-family:Oswald,Inter,sans-serif;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:{AMBER}}}
#vig{{position:absolute;inset:0;z-index:40;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 52%,rgba(0,0,0,.66) 100%)}}
#grain{{position:absolute;inset:-300px;z-index:41;pointer-events:none;background:url(assets/noise.png);background-size:256px 256px;opacity:.07}}
#prog{{position:absolute;left:60px;bottom:96px;height:8px;width:0;background:linear-gradient(90deg,{CORAL},{AMBER});z-index:35;border-radius:4px}}
#progbg{{position:absolute;left:60px;right:60px;bottom:96px;height:8px;background:rgba(255,255,255,.13);z-index:34;border-radius:4px}}
#brand{{position:absolute;left:0;right:0;bottom:44px;text-align:center;z-index:35;font-family:Oswald;font-weight:600;letter-spacing:.5em;font-size:26px;color:rgba(255,243,230,.55)}}
""")
        self.add(f'<div id="progbg"></div><div id="prog"></div><div id="brand">TOON THEORY</div>')
        self.frm('#prog', {'width': 0}, {'width': W - 120, 'duration': self.dur, 'ease': 'none'}, 0)
        self.add('<div id="vig"></div><div id="grain"></div>')
        self.to('#grain', {'backgroundPosition': '-9000px -6000px', 'duration': self.dur, 'ease': f'steps({int(self.dur*FPS)})'}, 0)

    def write(self, audio=None):
        os.makedirs(self.dir + '/assets', exist_ok=True)
        os.makedirs(self.dir + '/compositions', exist_ok=True)
        html = f"""<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width={W}, height={H}"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>{''.join(self.css)}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{self.dur:.2f}" data-width="{W}" data-height="{H}">
{''.join(self.body)}
</div>
<script>
window.__timelines=window.__timelines||{{}};
var tl=gsap.timeline({{paused:true}});
{chr(10).join(self.js)}
window.__timelines["main"]=tl;
</script></body></html>"""
        open(self.dir + '/index.html', 'w').write(html)
        return self.dir + '/index.html'


def load_words(path):
    return json.load(open(path))


def W_(words, text, nth=0):
    """time of the nth occurrence of a word that starts with `text` (case-insens, punctuation stripped)"""
    k = -1
    for w in words:
        if re.sub(r'[^a-z0-9$]', '', w['w'].lower()).startswith(text.lower()):
            k += 1
            if k == nth:
                return w['s']
    raise KeyError(text)
