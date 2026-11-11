import copy,scenes_e
ALL={s['id']:copy.deepcopy(s) for s in scenes_e.S}
def rep(sc,old,new):
    assert old in sc['build'],(sc['id'],old[:60]); sc['build']=sc['build'].replace(old,new,1)
# 1) hook -> desk exactly on "It starts small"
ALL['s01']['end']='starts_small'; ALL['s02']['start']='starts_small'
_s1=ALL['s01']
for a,b in [("tl.to(`#${p}-minh`,{rotation:30,svgOrigin:'960 470',duration:D,ease:'none'},0)","tl.to(`#${p}-minh`,{rotation:30,svgOrigin:'960 470',duration:13.2,ease:'none'},0)"),("{scale:1.1,duration:D,ease:'none'},0)","{scale:1.1,duration:13.2,ease:'none'},0)"),("rotation:6*Math.floor(D),svgOrigin:'960 470',duration:Math.floor(D),ease:`steps(${Math.floor(D)})`","rotation:78,svgOrigin:'960 470',duration:13,ease:'steps(13)'"),("driftDust(tl,p,D,50)}","driftDust(tl,p,13.2,50);tl.to(`#${p}-cam`,{opacity:0,duration:.6,ease:'power1.in'},D-.6)}")]:
    assert a in _s1['build'],a[:50]; _s1['build']=_s1['build'].replace(a,b,1)
# 2) masks: cracks, shards, earlier light, figure steps in sooner
s=ALL['s07']
rep(s,'<ellipse cx="-48" cy="-70" rx="26" ry="14" fill="#10141f"/>','<path id="${p}-cr${i}" d="M-8 -176 l16 52 l-22 38 l28 50 l-14 44" stroke="#2a2a3a" stroke-width="6" fill="none" stroke-dasharray="260" stroke-dashoffset="260" stroke-linejoin="round"/><ellipse cx="-48" cy="-70" rx="26" ry="14" fill="#10141f"/>')
rep(s,'s+=`<g id="${p}-light" opacity="0">','s+=X.map((x,i)=>`<g id="${p}-sh${i}" opacity="0">${Array.from({length:8},(_,k)=>`<path class="${p}-shd" d="M${x+(k-4)*30} ${470+(k%3)*40} l${30+k*3} ${-22+k*4} l${-8+k*3} ${40-k*2}Z" fill="#e9dfd0" stroke="#bdb09a" stroke-width="3"/>`).join(\'\')}</g>`).join(\'\');\n s+=`<g id="${p}-light" opacity="0">')
rep(s,"const tr=A.ready_isnt+.2;for(let i=0;i<4;i++)tl.to(`#${p}-m${i}`,{y:420,rotation:(i%2?1:-1)*26,opacity:0,duration:1.1,ease:'power2.in'},tr+i*.12);","const tr=A.ready_isnt+.2;for(let i=0;i<4;i++){tl.to(`#${p}-cr${i}`,{attr:{'stroke-dashoffset':0},duration:.5,ease:'power2.in'},tr-.5+i*.1);tl.to(`#${p}-m${i}`,{opacity:0,duration:.08},tr+.1+i*.12);tl.set(`#${p}-sh${i}`,{opacity:1},tr+.1+i*.12);document.querySelectorAll(`#${p}-sh${i} .${p}-shd`).forEach((e,k)=>{const rr=RND(i*31+k);tl.to(e,{x:(rr()-.5)*520,y:260+rr()*320,rotation:(rr()-.5)*160,opacity:0,duration:1.2+rr()*.5,ease:'power2.in'},tr+.1+i*.12)})}")
rep(s,"tl.to(`#${p}-light`,{opacity:1,duration:2.2},tr+.6);tl.fromTo(`#${p}-light`,{scale:.4,transformOrigin:'960px 600px'},{scale:1.3,duration:4,ease:'none'},tr+.6);","tl.to(`#${p}-light`,{opacity:1,duration:1.4},tr+.1);tl.fromTo(`#${p}-light`,{scale:.4,transformOrigin:'960px 600px'},{scale:1.4,duration:4,ease:'none'},tr+.1);")
rep(s,"tl.fromTo(`#${p}-step`,{opacity:0,x:0},{opacity:1,x:0,duration:.5},A.science-3.4);tl.to(`#${p}-step`,{y:-60,scale:.7,svgOrigin:'960 760',duration:2.4,ease:'power1.inOut'},A.science-3.2);","tl.fromTo(`#${p}-step`,{opacity:0,x:0},{opacity:1,x:0,duration:.5},tr+.9);tl.to(`#${p}-step`,{y:-70,scale:.7,svgOrigin:'960 760',duration:3.2,ease:'power1.inOut'},tr+1.0);")
# 3) stranger's reply bubble lower
s=ALL['s08']
rep(s,'<rect x="1330" y="150" width="280" height="110" rx="30" fill="#16203e" stroke="#ffb24a" stroke-width="4"/><text x="1470" y="222"','<rect x="1330" y="270" width="280" height="110" rx="30" fill="#16203e" stroke="#ffb24a" stroke-width="4"/><text x="1470" y="342"')
rep(s,"transformOrigin:'1470px 205px'","transformOrigin:'1470px 325px'")
# 4) chain break: falling links + warm rays; richer seed
s=ALL['s11']
rep(s,"s+=`<rect id=\"${p}-fl\" width=\"1920\" height=\"1080\" fill=\"#fff\" opacity=\"0\"/>`;","s+=`<g id=\"${p}-deb\">${Array.from({length:16},(_,i)=>`<rect class=\"${p}-db\" x=\"${190+i*100}\" y=\"210\" width=\"46\" height=\"26\" rx=\"13\" fill=\"#0c1022\" stroke=\"#6b7390\" stroke-width=\"5\" opacity=\"0\"/>`).join('')}</g><g id=\"${p}-rays\" opacity=\"0\">${Array.from({length:18},(_,i)=>{const a=i/18*6.283;return `<line x1=\"${960+Math.cos(a)*140}\" y1=\"${520+Math.sin(a)*140}\" x2=\"${960+Math.cos(a)*1300}\" y2=\"${520+Math.sin(a)*1300}\" stroke=\"#ffd089\" stroke-width=\"${i%2?14:30}\" opacity=\".35\"/>`}).join('')}</g><rect id=\"${p}-fl\" width=\"1920\" height=\"1080\" fill=\"#fff\" opacity=\"0\"/>`;")
rep(s,"tl.to(`#${p}-chain`,{y:-120,opacity:0,rotation:-4,duration:.9,ease:'power2.in'},A.spell+.15);","tl.to(`#${p}-chain`,{opacity:0,duration:.2},A.spell+.12);document.querySelectorAll(`.${p}-db`).forEach((e,i)=>{const rr=RND(i+71);tl.set(e,{opacity:1},A.spell+.1);tl.to(e,{y:560+rr()*260,x:(rr()-.5)*220,rotation:(rr()-.5)*420,opacity:0,duration:1.5+rr()*.7,ease:'power2.in'},A.spell+.1)});tl.fromTo(`#${p}-rays`,{scale:.3,opacity:.9,svgOrigin:'960 520'},{scale:1.5,opacity:0,duration:2.4,ease:'power2.out'},A.spell+.1);")
s=ALL['s12']
t=s['build']; a=t.index('s+=`<g id="${p}-lv" opacity="0">'); b=t.index(" return s+dust(p,30,23")
LV=r'''s+=`<g id="${p}-lv" opacity="0"><path d="M960 560 C880 520 810 540 780 600 C850 620 925 610 960 560Z" fill="#6fcf86"/><path d="M960 560 C885 548 835 566 810 596" stroke="#3f9a5c" stroke-width="4" fill="none"/><path d="M964 520 C1040 476 1110 488 1140 548 C1066 574 998 562 964 520Z" fill="#8fe29f"/><path d="M964 520 C1040 504 1090 518 1120 546" stroke="#3f9a5c" stroke-width="4" fill="none"/><path d="M962 470 C930 420 940 380 972 360 C990 400 986 440 962 470Z" fill="#a8eeb2"/><circle cx="1010" cy="560" r="9" fill="#cfe9ff"/><circle cx="1007" cy="556" r="3" fill="#fff"/></g><g id="${p}-sr" opacity="0">${Array.from({length:14},(_,i)=>{const a=i/14*3.1416+3.1416;return `<line x1="${960+Math.cos(a)*300}" y1="${640+Math.sin(a)*300}" x2="${960+Math.cos(a)*1400}" y2="${640+Math.sin(a)*1400}" stroke="#fff0c8" stroke-width="${i%2?10:22}" opacity=".16"/>`}).join('')}</g>`;
'''
t=t[:a]+LV+t[b:]
t=t.replace('stroke="#7bd88f" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="270"','stroke="#7bd88f" stroke-width="20" fill="none" stroke-linecap="round" stroke-dasharray="270"')
t=t.replace("tl.fromTo(`#${p}-lv`,{opacity:0,scale:.2,transformOrigin:'960px 540px'},{opacity:1,scale:1,duration:1.4,ease:'back.out(1.7)'},3.0);","tl.fromTo(`#${p}-lv`,{opacity:0,scale:.2,svgOrigin:'960 560'},{opacity:1,scale:1,duration:1.5,ease:'back.out(1.7)'},2.9);tl.fromTo(`#${p}-sr`,{opacity:0,rotation:-6,svgOrigin:'960 640'},{opacity:1,rotation:6,duration:D-1.5,ease:'none'},1.5);")
s['build']=t
# 5) finale: ring flashes red instead of duplicate text
s=ALL['s14']
rep(s,"tl.fromTo(`#${p}-red`,{opacity:0,y:14},{opacity:1,y:0,duration:.5},A.slowdeath2);tl.to(`#${p}-red`,{opacity:0,duration:.4},A.breath-.3);","tl.to(`#${p}-ring`,{attr:{stroke:'#ff4d4d'},duration:.15},A.slowdeath2);tl.to(`#${p}-ring`,{attr:{stroke:'#ffb24a'},duration:.9},A.breath-.9);tl.fromTo(`#${p}-tm`,{fill:'#ff4d4d'},{fill:'#f4f0e8',duration:.9},A.slowdeath2+.15);")
S=list(ALL.values())
