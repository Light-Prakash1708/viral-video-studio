import json,re,os,sys,importlib
from PIL import Image
import numpy as np
ROOT='/root/hf-inaction'; PROJ=ROOT+'/proj'
W0=json.load(open(ROOT+'/words.json'))['words']; W=[]
for w_ in W0:
    if W and (w_['word'].startswith(',') or w_['word'].startswith('%')) and W[-1]['word'][-1].isdigit(): W[-1]=dict(W[-1],word=W[-1]['word']+w_['word'],end=w_['end'])
    else: W.append(dict(w_))
A=json.load(open(ROOT+'/anchors.json'))
TOTAL=round(W[-1]['end']+2.4,2)
norm=lambda w: re.sub(r"[^a-z0-9']","",w.lower())
for i,k in enumerate(['w0','w1','w2','w3']): A[k]={'start':W[i]['start'],'end':W[i]['end']}
A['weeks']={'start':round((A['number']['start']+A['thats_it']['start'])/2+.4,2),'end':0}
A['day14600']={'start':A['forty']['start']-1.7,'end':0}
A['pushup']={'start':round((A['onepage']['start']+A['message']['start'])/2,2),'end':0}
sd=[i for i,w in enumerate(W) if norm(w['word'])=='death' and w['start']>175 and w['start']<200]
A['slowdeath1']={'start':W[sd[0]]['start'] if sd else 179.5,'end':0}
mods=[importlib.import_module(m) for m in sys.argv[1].split(',')] if len(sys.argv)>1 else []
_d={}
for m in mods:
    for s in m.S: _d[s['id']]=s
SC=[_d[k] for k in sorted(_d)]
ONLY=int(sys.argv[2]) if len(sys.argv)>2 else None  # truncate for tests
def tsec(v): return float(v) if isinstance(v,(int,float)) else A[v]['start']
for s in SC:
    s['t0']=tsec(s['start']); s['t1']=tsec(s['end']) if s['end']!='END' else TOTAL
if SC and SC[-1]['id']!='s14' : SC[-1]['t1']=SC[-1]['t1']
LIB=open(ROOT+'/gen/lib.js').read()
os.makedirs(PROJ+'/compositions',exist_ok=True); os.makedirs(PROJ+'/assets',exist_ok=True)
# film grain tile
rng=np.random.default_rng(5); n=(rng.normal(128,60,(512,512))).clip(0,255).astype('uint8'); Image.merge('LA',(Image.fromarray(n),Image.fromarray(np.full((512,512),255,'uint8')))).save(PROJ+'/assets/noise.png')
hosts=''
for s in SC:
    D=round(s['t1']-s['t0'],2); rel={k:round(v['start']-s['t0'],2) for k,v in A.items()}
    html=f'''<template>
<style>#root{{position:absolute;inset:0;overflow:hidden;background:#05070f}}#{s['id']}-cam{{position:absolute;left:0;top:0;width:1920px;height:1080px}}svg{{display:block}}</style>
<div id="root" data-composition-id="{s['id']}" data-width="1920" data-height="1080"><div id="{s['id']}-cam"></div></div>
<script>
{LIB}
const p='{s['id']}',D={D},A={json.dumps(rel)},FG='{s.get('fg','full')}';
const cam$=document.getElementById(p+'-cam');
{s['build']}
let _b=build();if(FG!=='none'&&!_b.includes(p+'-L3'))_b+=fgLayer(p,{abs(hash(s['id']))%900+3},FG);
cam$.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">${{defs(p)}}${{_b}}</svg>`;
const tl=gsap.timeline({{paused:true}});
anim(tl);
if(document.getElementById(p+'-L3'))tl.fromTo('#'+p+'-L3',{{x:50}},{{x:-140,duration:D,ease:'none'}},0);
window.__timelines[p]=tl;
</script>
</template>'''
    open(f"{PROJ}/compositions/{s['id']}.html",'w').write(html)
    hosts+=f'''<div id="{s['id']}" data-composition-id="{s['id']}" data-composition-src="compositions/{s['id']}.html" data-start="{s['t0']}" data-duration="{D}" data-track-index="1" data-width="1920" data-height="1080" style="z-index:1"></div>\n'''
END=SC[-1]['t1'] if ONLY else TOTAL
# captions
caps=[];cur=[]
for w in W:
    if ONLY and w['start']>END: break
    cur.append(w)
    if re.search(r"[.?!…][\"”']*$",w['word']) or (len(cur)>=9 and w['word'].endswith(',')) or len(cur)>=17: caps.append(cur); cur=[]
if cur: caps.append(cur)
def hl(t):
    t=re.sub(r'(?i)\b(tomorrow\w*|\d[\d,]*|four thousand|inaction|slow death|day one)\b',r'<b>\1</b>',t); return t
capshtml='';capjs=''
for i,c in enumerate(caps):
    st=round(c[0]['start']-.05,2); en=round(c[-1]['end']+.35,2); text=' '.join(x['word'] for x in c)
    capshtml+=f'<div id="cap{i}" class="clip cap" data-start="{st}" data-duration="{round(en-st,2)}" data-track-index="30"><span id="cap{i}t">{hl(text)}</span></div>\n'
    capjs+=f'tl.fromTo("#cap{i}t",{{opacity:0,y:10}},{{opacity:1,y:0,duration:.22,ease:"power2.out"}},{st});tl.to("#cap{i}t",{{opacity:0,duration:.25}},{round(en-.28,2)});\n'
hud=[('DAY 1','day_one','day30'),('DAY 30','day30','dies_first'),('DAY 365','day365','masks'),('DAY 14,600','day14600','procrast'),('DAY 1','dayone_plan','today')]
hudhtml='';hudjs=''
for i,(t,a,b) in enumerate(hud):
    st=A[a]['start']-.3; en=(A[b]['start']+(-.15 if b=='today' else .3)) if b else END
    if ONLY and st>END: continue
    en=min(en,END)
    hudhtml+=f'<div id="hud{i}" class="clip hud" data-start="{round(st,2)}" data-duration="{round(en-st,2)}" data-track-index="20"><i></i><span id="hud{i}t">{t}</span></div>\n'
    hudjs+=f'tl.fromTo("#hud{i}t",{{opacity:0,x:-14}},{{opacity:1,x:0,duration:.6,ease:"power2.out"}},{round(st,2)});tl.to("#hud{i}t",{{opacity:0,duration:.5}},{round(en-.55,2)});\n'
import random
rr_=random.Random(9);bokehhtml='';bokehjs=''
for i in range(12):
    sz=rr_.randint(60,170);x=rr_.randint(0,1800);y=rr_.randint(120,900);col=['255,178,74','127,168,255','255,208,137'][i%3]
    bokehhtml+=f'<div id="bk{i}" class="bk" style="left:{x}px;top:{y}px;width:{sz}px;height:{sz}px;background:radial-gradient(circle,rgba({col},.26) 0%,rgba({col},0) 70%)"></div>'
    bokehjs+=f'tl.fromTo("#bk{i}",{{x:0,y:0}},{{x:{rr_.randint(-160,160)},y:{rr_.randint(-120,120)},duration:{END},ease:"none"}},0);'
root=f'''<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1920, height=1080"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1920px;height:1080px;overflow:hidden;background:#000}}
#root{{position:relative;width:1920px;height:1080px;overflow:hidden;background:#05070f}}
.cap{{position:absolute;left:0;right:0;bottom:158px;text-align:center;z-index:30;font-family:Inter;font-weight:600;font-size:40px;color:#f4f0e8;text-shadow:0 2px 14px rgba(0,0,0,.9),0 0 3px rgba(0,0,0,.8)}}.cap b{{color:#ffb24a;font-weight:800}}.cap span{{display:inline-block;padding:0 40px}}
.hud{{position:absolute;left:150px;top:150px;z-index:20;font-family:Oswald;font-weight:700;font-size:34px;letter-spacing:.32em;color:#ffb24a;display:flex;align-items:center;gap:18px;text-shadow:0 0 18px rgba(255,178,74,.5)}}.hud i{{display:block;width:46px;height:3px;background:#ffb24a}}
#vig{{position:absolute;inset:0;z-index:40;pointer-events:none;background:radial-gradient(ellipse at 50% 48%,rgba(0,0,0,0) 48%,rgba(0,0,0,.62) 100%)}}
#grain{{position:absolute;inset:-300px;z-index:41;pointer-events:none;background:url(assets/noise.png);background-size:256px 256px;opacity:.05}}
#leak{{position:absolute;inset:0;z-index:38;pointer-events:none;opacity:0;background:linear-gradient(105deg,rgba(255,150,70,.42) 0%,rgba(255,150,70,0) 36%),radial-gradient(circle at 100% 0%,rgba(255,205,130,.38),rgba(255,205,130,0) 42%)}}
#gradew{{position:absolute;inset:0;z-index:39;pointer-events:none;opacity:0;background:rgba(255,160,70,.11)}}
.bk{{position:absolute;border-radius:50%;z-index:36;pointer-events:none;}}
#grade{{position:absolute;inset:0;z-index:39;pointer-events:none;background:linear-gradient(180deg,rgba(20,40,90,.10),rgba(255,150,60,.05))}}
.bar{{position:absolute;left:0;right:0;height:118px;background:#000;z-index:50}}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1920" data-height="1080">
{hosts}{hudhtml}{capshtml}<div id="grade" data-layout-allow-occlusion></div><div id="gradew" data-layout-allow-occlusion></div><div id="leak" data-layout-allow-occlusion></div>{bokehhtml}<div id="vig" data-layout-allow-occlusion></div><div id="grain" data-layout-allow-occlusion></div><div class="bar" style="top:0"></div><div class="bar" style="bottom:0"></div>
</div>
<script>
const tl=gsap.timeline({{paused:true}});
{hudjs}{capjs}tl.to("#grain",{{backgroundPosition:"-24000px -9000px",duration:{END},ease:"steps({int(END*12)})"}},0);
tl.to("#gradew",{{opacity:1,duration:3,ease:"power1.inOut"}},{A['spell']['start']-1});tl.to("#leak",{{opacity:.8,duration:3.5}},{A['spell']['start']});tl.to("#leak",{{opacity:.5,duration:2.4,yoyo:true,repeat:5,ease:"sine.inOut"}},{A['spell']['start']+3.5});
{bokehjs}
window.__timelines["main"]=tl;
</script></body></html>'''
open(PROJ+'/index.html','w').write(root)
print('built',len(SC),'scenes, total',END,'captions',len(caps))
