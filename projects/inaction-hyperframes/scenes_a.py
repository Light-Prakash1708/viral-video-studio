S=[]
# ---------------- S01 HOOK ----------------
S.append(dict(id='s01',start=0,end='day_one',fi=0,fo=.9,build=r'''
function build(){let s=`<rect width="1920" height="1080" fill="#030409"/><rect x="0" y="0" width="1920" height="1080" fill="url(#${p}-cold)" opacity=".16"/>`;
 s+=`<g id="${p}-clockg" opacity="0"><circle cx="960" cy="470" r="300" fill="none" stroke="#1d2540" stroke-width="5"/>`;
 for(let i=0;i<60;i++){const a=i/60*6.2832,r1=i%5?282:262,r2=300;s+=`<line x1="${960+Math.sin(a)*r1}" y1="${470-Math.cos(a)*r1}" x2="${960+Math.sin(a)*r2}" y2="${470-Math.cos(a)*r2}" stroke="#2c3860" stroke-width="${i%5?2:5}"/>`}
 s+=`<line id="${p}-minh" x1="960" y1="470" x2="960" y2="262" stroke="#3a4673" stroke-width="9" stroke-linecap="round"/><line id="${p}-sec" x1="960" y1="505" x2="960" y2="215" stroke="#ff4d4d" stroke-width="5"/><circle cx="960" cy="470" r="14" fill="#ff4d4d"/></g>`;
 s+=`<g id="${p}-head"><text x="960" y="450" text-anchor="middle" font-family="Playfair Display" font-weight="700" font-size="138" fill="#f1e9dc" letter-spacing="4"><tspan id="${p}-w0" fill-opacity="0">INACTION </tspan><tspan id="${p}-w1" fill-opacity="0">IS</tspan></text>
 <text x="960" y="620" text-anchor="middle" font-family="Playfair Display" font-weight="700" font-size="138" fill="#f1e9dc" letter-spacing="4"><tspan id="${p}-w2" fill-opacity="0">SLOW </tspan><tspan id="${p}-w3" fill="#ff4d4d" fill-opacity="0">DEATH.</tspan></text>
 <text id="${p}-glow" x="1177" y="620" text-anchor="middle" font-family="Playfair Display" font-weight="700" font-size="138" fill="#ff4d4d" opacity="0" filter="url(#${p}-b28)">DEATH.</text></g>`;
 const r=RND(21),order=Array.from({length:60},(_,i)=>i).sort(()=>r()-.5);
 s+=`<g id="${p}-grid" opacity="1">`;for(let i=0;i<60;i++){const c=i%6,rw=Math.floor(i/6);s+=`<text id="${p}-t${i}" x="${190+c*310+(rw%2?60:0)}" y="${170+rw*88}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="34" letter-spacing="9" fill="#f1e9dc" opacity="0" data-layout-allow-overlap>TOMORROW</text>`}s+=`</g>`;
 s+=`<text id="${p}-cnt" x="960" y="1010" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="76" fill="#ffb24a" letter-spacing="10" opacity="0">× 1,000</text>`;
 return s+dust(p,22,4,0,0,1920,1080,'#9fb4e8')}
function anim(tl){const r=RND(21),order=Array.from({length:60},(_,i)=>i).sort(()=>r()-.5);
 tl.to(`#${p}-clockg`,{opacity:.55,duration:1.4},0);tl.to(`#${p}-sec`,{rotation:6*Math.floor(D),svgOrigin:'960 470',duration:Math.floor(D),ease:`steps(${Math.floor(D)})`},0);tl.to(`#${p}-minh`,{rotation:30,svgOrigin:'960 470',duration:D,ease:'none'},0);
 [['w0',A.w0],['w1',A.w1],['w2',A.w2],['w3',A.w3]].forEach(([k,t])=>tl.to(`#${p}-${k}`,{attr:{'fill-opacity':1},duration:.35,ease:'power2.out'},t));
 tl.to(`#${p}-glow`,{opacity:.85,duration:.5},A.w3);tl.to(`#${p}-glow`,{opacity:.35,duration:.8,yoyo:true,repeat:3},A.w3+.5);
 tl.fromTo(`#${p}-cam`,{scale:1,transformOrigin:'50% 50%'},{scale:1.1,duration:D,ease:'none'},0);
 const t0=A.thousand_tomorrows;tl.to(`#${p}-head`,{opacity:.1,duration:.8},t0);tl.to(`#${p}-clockg`,{opacity:.12,duration:.8},t0);
 order.forEach((ix,k)=>tl.to(`#${p}-t${ix}`,{opacity:.22+RND(ix+5)()*.7,duration:.25},t0+.3+k*.03));
 tl.fromTo(`#${p}-cnt`,{opacity:0,scale:.8,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.4,ease:'back.out(2)'},t0+1.6);
 driftDust(tl,p,D,50)}
'''))
# ---------------- S02 DAY ONE ----------------
S.append(dict(id='s02',start='day_one',end='trick',fi=.8,fo=.7,build=r'''
function build(){let s=roomBack(p,{});
 s+=noteSvg(p+'-n1',330,300,-4,'WRITE','THE BOOK')+noteSvg(p+'-n2',500,400,3,'GET','STRONG','#8fd0a8')+noteSvg(p+'-n3',660,290,-2,'SAY','SORRY','#f2a0a0');
 s+=`<g clip-path="url(#${p}-wc)"><rect id="${p}-dawnw" x="1150" y="110" width="560" height="470" fill="url(#${p}-dawn)" opacity="0"/>
 <g id="${p}-ic1" opacity="0"><circle cx="1270" cy="300" r="40" fill="#ffd27a"/><g stroke="#ffd27a" stroke-width="6" stroke-linecap="round">${Array.from({length:10},(_,i)=>{const a=i/10*6.283;return `<line x1="${1270+Math.cos(a)*56}" y1="${300+Math.sin(a)*56}" x2="${1270+Math.cos(a)*78}" y2="${300+Math.sin(a)*78}"/>`}).join('')}</g></g>
 <g id="${p}-ic2" opacity="0"><path d="M1400 240 L1480 240 L1440 300 L1480 360 L1400 360 L1440 300 Z" fill="none" stroke="#ffd27a" stroke-width="7"/><path d="M1425 345 L1455 345 L1440 325Z" fill="#ffd27a"/></g>
 <g id="${p}-ic3" opacity="0">${manBack(p+'-self',1590,470,.6,{skin:'#ffd890',hair:'#ffcf7a',body:'#ffb85c'})}</g></g>`;
 s+=manBack(p+'-man',880,835,1.3)+roomFront(p);
 s+=`<path d="M690 776 L860 752 L1030 776 L860 792Z" fill="#f4ead2"/><ellipse cx="860" cy="764" rx="190" ry="30" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".7"/>`;
 return s+dust(p,30,3,300,150,1300,700)+`<rect id="${p}-dim" width="1920" height="1080" fill="#02030a" opacity="0"/>`}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.14,x1:-70});
 [['n1',A.book],['n2',A.body],['n3',A.apology]].forEach(([k,t])=>tl.fromTo(`#${p}-${k}`,{opacity:0,y:24},{opacity:1,y:0,duration:.7,ease:'back.out(1.6)'},t));
 tl.to(`#${p}-light`,{opacity:.45,duration:.1,yoyo:true,repeat:5},A.tired);tl.to(`#${p}-light`,{opacity:.7,duration:.6},A.tired+.8);
 tl.to(`#${p}-man`,{y:'+=20',rotation:2.5,svgOrigin:'880 835',duration:2.6,ease:'power2.inOut'},A.tired);
 tl.to(`#${p}-dawnw`,{opacity:.95,duration:2.6},A.tomorrow_better);
 [['ic1',A.energy],['ic2',A.time],['ic3',A.person]].forEach(([k,t])=>{tl.fromTo(`#${p}-${k}`,{opacity:0,y:34},{opacity:1,y:0,duration:.9,ease:'power2.out'},t)});
 tl.to(`#${p}-light`,{opacity:0,duration:.5},A.person+1.9);tl.to(`#${p}-dim`,{opacity:.8,duration:2},A.person+1.6);
 driftDust(tl,p,D,50);fade(tl,p,D,.8,.7)}
'''))
# ---------------- S03 THE EMPTY CHAIR ----------------
S.append(dict(id='s03',start='trick',end='day30',fi=.7,fo=.7,build=r'''
function build(){let s=`<rect width="1920" height="1080" fill="#060813"/><path d="M180 0 L520 0 L1180 1080 L420 1080Z" fill="url(#${p}-cold)" opacity=".35" style="mix-blend-mode:screen"/><rect x="0" y="880" width="1920" height="200" fill="#04050c"/>`;
 s+=`<rect x="1700" y="180" width="170" height="700" fill="#0b0f1e" stroke="#151a30" stroke-width="6"/><rect id="${p}-doorl" x="1700" y="190" width="0" height="680" fill="#ffd089" opacity=".9"/><path id="${p}-spill" d="M1700 880 L1100 1000 L1100 880Z" fill="url(#${p}-cone)" opacity="0"/>`;
 s+=`<rect x="1130" y="560" width="22" height="330" fill="#10132a"/><rect x="1130" y="560" width="190" height="26" rx="8" fill="#161a33"/><rect x="1130" y="740" width="190" height="24" fill="#161a33"/>`;
 s+=`<g id="${p}-ghost" opacity="0">${manBack(p+'-gh',1260,770,1.05,{skin:'#ffd890',hair:'#ffcf7a',body:'#ffb85c'})}<ellipse cx="1260" cy="560" rx="170" ry="260" fill="url(#${p}-glow)" style="mix-blend-mode:screen"/></g>`;
 s+=manBack(p+'-man',640,800,1.3)+`<rect x="360" y="790" width="1200" height="30" rx="6" fill="#1a1f38"/><rect x="420" y="820" width="24" height="150" fill="#10132a"/><rect x="1476" y="820" width="24" height="150" fill="#10132a"/>`;
 s+=`<ellipse cx="960" cy="780" rx="240" ry="30" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".35"/>`;
 return s+dust(p,34,8,0,100,1920,800,'#bcd0ff')}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.13,x0:60,x1:-80});
 tl.fromTo(`#${p}-ghost`,{opacity:0},{opacity:.8,duration:1.4},A.better_version);tl.to(`#${p}-ghost`,{opacity:.55,duration:.5,yoyo:true,repeat:5},A.better_version+1.4);
 tl.to(`#${p}-ghost`,{opacity:0,y:-70,duration:1.5,ease:'power2.in'},A.never_arrives);
 tl.to(`#${p}-doorl`,{attr:{width:150},duration:1.2,ease:'power2.out'},A.never_arrives+.4);tl.to(`#${p}-spill`,{opacity:.55,duration:1.4},A.never_arrives+.6);
 tl.to(`#${p}-man`,{y:'+=16',rotation:3,svgOrigin:'640 800',duration:2,ease:'power2.inOut'},A.never_arrives+1);
 driftDust(tl,p,D,110);fade(tl,p,D,.7,.7)}
'''))
# ---------------- S04 DAY 30 ----------------
S.append(dict(id='s04',start='day30',end='dies_first',fi=.7,fo=.6,build=r'''
function build(){let s=`<g id="${p}-pa"><rect width="1920" height="1080" fill="#0a0e1d"/><rect x="0" y="720" width="1920" height="360" fill="#070a14"/><ellipse cx="960" cy="520" rx="760" ry="420" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".28"/><rect x="330" y="690" width="1260" height="30" rx="5" fill="#1b2037"/>`;
 const r=RND(14);let x=380;for(let i=0;i<13;i++){const w=44+r()*46,h=210+r()*120,cols=['#3a2f4f','#24405a','#4f3a2f','#2f4f45','#503046'];s+=`<rect x="${x}" y="${690-h}" width="${w}" height="${h}" fill="${cols[i%5]}" stroke="#0a0e1d" stroke-width="3"/>`;x+=w+4}
 s+=`<rect id="${p}-book" x="${x+10}" y="400" width="112" height="290" fill="#8a2f2f" stroke="#d9b878" stroke-width="5"/><rect x="${x+30}" y="450" width="72" height="12" fill="#d9b878"/><rect x="${x+30}" y="480" width="50" height="8" fill="#d9b878"/>`;x+=140;
 for(let i=0;i<6;i++){const w=44+r()*40,h=200+r()*110;s+=`<rect x="${x}" y="${690-h}" width="${w}" height="${h}" fill="#2a3552" stroke="#0a0e1d" stroke-width="3"/>`;x+=w+4}
 s+=`<rect id="${p}-dov" x="330" y="470" width="1260" height="230" fill="#9aa3b8" opacity="0" style="mix-blend-mode:overlay"/><path d="M330 690 Q420 650 520 690 M330 690 Q380 600 460 590" stroke="#cfd6e6" stroke-width="2" fill="none" opacity=".4"/>`;
 s+=`<g transform="translate(1480 280) rotate(6)"><path d="M0 0 L190 0 Q200 90 170 150 L0 150Z" fill="#c9ab55"/><text x="95" y="62" text-anchor="middle" font-family="Inter" font-weight="700" font-size="24" fill="#5a4a1e">WRITE</text><text x="95" y="96" text-anchor="middle" font-family="Inter" font-weight="700" font-size="24" fill="#5a4a1e">THE BOOK</text></g></g>`;
 s+=`<g id="${p}-pb" opacity="0"><rect width="1920" height="1080" fill="#0a0f1f"/><ellipse cx="960" cy="560" rx="700" ry="520" fill="url(#${p}-cold)" opacity=".28" style="mix-blend-mode:screen"/>${bust(p,960,640,1.55,{})}<g id="${p}-stone"><ellipse cx="722" cy="860" rx="40" ry="30" fill="#5d6479"/><ellipse cx="712" cy="848" rx="14" ry="9" fill="#8a92a8"/></g><rect id="${p}-door" x="-1920" y="0" width="1920" height="1080" fill="#04050b"/></g>`;
 return s+dust(p,26,6,200,150,1500,700,'#ffe2b0')+`<rect id="${p}-flash" width="1920" height="1080" fill="#fff" opacity="0"/>`}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.12,x1:-40});
 tl.to(`#${p}-dov`,{opacity:.6,duration:D*.35,ease:'none'},0);
 tl.to(`#${p}-pa`,{opacity:0,duration:.6},A.weight-.3);tl.to(`#${p}-pb`,{opacity:1,duration:.6},A.weight-.3);
 ['tired'].forEach(m=>setMood(tl,p,m,A.weight-.3,.01));lidsOpen(tl,p,.45,A.weight,.5);blinks(tl,p,[A.weight+1.4,A.weight+4.6]);
 [1.2,3.8,6.4].forEach((o,i)=>{const t=A.weight+o;tl.fromTo(`#${p}-door`,{x:-1920},{x:0,duration:.35,ease:'power2.in'},t);tl.to(`#${p}-door`,{x:1920,duration:.4,ease:'power2.out'},t+.45);tl.to(`#${p}-stone`,{scale:1.3+i*.45,svgOrigin:'722 880',duration:.4},t+.4)});
 tl.to(`#${p}-flash`,{opacity:.3,duration:.06,yoyo:true,repeat:1},A.dying_loud);
 driftDust(tl,p,D,50);fade(tl,p,D,.7,.6)}
'''))
# ---------------- S05 WHAT DIES FIRST ----------------
S.append(dict(id='s05',start='dies_first',end='day365',fi=.6,fo=.7,build=r'''
function build(){let s=`<rect width="1920" height="1080" fill="#070a15"/>`;
 // v1 guitar
 s+=`<g id="${p}-v1" transform="translate(960 470) scale(.82) translate(-960 -500)"><ellipse cx="860" cy="660" rx="230" ry="260" fill="#6b3f26"/><ellipse cx="860" cy="660" rx="52" ry="52" fill="#120c0a"/><rect x="820" y="140" width="80" height="360" fill="#4f2e1c"/><rect x="800" y="90" width="120" height="70" rx="12" fill="#3a2216"/>${[0,1,2,3,4,5].map(i=>`<circle cx="${815+i*18}" cy="100" r="6" fill="#d9b878"/>`).join('')}<g id="${p}-strings">${[0,1,2,3,4,5].map(i=>`<path id="${p}-s${i}" d="M${826+i*14} 150 L${826+i*14} 720" stroke="#e8dcc0" stroke-width="3" fill="none"/>`).join('')}</g><ellipse cx="860" cy="660" rx="480" ry="360" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".25"/></g>`;
 // v2 phone + friend
 s+=`<g id="${p}-v2" opacity="0" transform="translate(960 470) scale(.82) translate(-960 -500)"><rect x="700" y="90" width="520" height="900" rx="56" fill="#10152c" stroke="#26305a" stroke-width="8"/><circle cx="800" cy="210" r="42" id="${p}-av" fill="#7fa8ff"/><text x="870" y="206" font-family="Inter" font-weight="700" font-size="34" fill="#eaf0ff">Sam</text><text x="870" y="242" font-family="Inter" font-weight="400" font-size="22" fill="#7d8bb8">last seen long ago</text>
 <g id="${p}-b1" opacity="0"><rect x="740" y="330" width="360" height="86" rx="28" fill="#26305a"/><text x="770" y="385" font-family="Inter" font-weight="600" font-size="28" fill="#eaf0ff">Hey, you free this week?</text><text x="740" y="440" font-family="Inter" font-size="20" fill="#7d8bb8">3 days ago</text></g>
 <g id="${p}-b2" opacity="0"><rect x="740" y="480" width="200" height="76" rx="28" fill="#26305a"/><text x="770" y="530" font-family="Inter" font-weight="600" font-size="28" fill="#eaf0ff">Hello?</text><text x="740" y="580" font-family="Inter" font-size="20" fill="#7d8bb8">3 months ago</text></g>
 <g id="${p}-b3" opacity="0"><rect x="740" y="620" width="120" height="76" rx="28" fill="#26305a"/><text x="800" y="672" text-anchor="middle" font-family="Inter" font-weight="800" font-size="34" fill="#eaf0ff">...</text><text x="740" y="720" font-family="Inter" font-size="20" fill="#7d8bb8">1 year ago</text></g>
 <rect x="740" y="880" width="440" height="64" rx="32" fill="#0c1022" stroke="#26305a" stroke-width="3"/><text x="770" y="922" font-family="Inter" font-size="26" fill="#4a5680">Message...</text></g>`;
 // v3 shoes + pulse
 s+=`<g id="${p}-v3" opacity="0" transform="translate(960 470) scale(.82) translate(-960 -500)"><rect x="0" y="820" width="1920" height="260" fill="#05070f"/><g transform="translate(700 800)"><path d="M0 0 L260 0 Q300 -10 300 -50 Q260 -110 190 -90 L120 -150 L40 -140 L20 -40 Z" fill="#2c3a6a"/><rect x="0" y="0" width="300" height="26" fill="#d9d9e2"/></g><g transform="translate(1040 800)"><path d="M0 0 L260 0 Q300 -10 300 -50 Q260 -110 190 -90 L120 -150 L40 -140 L20 -40 Z" fill="#2c3a6a"/><rect x="0" y="0" width="300" height="26" fill="#d9d9e2"/></g><rect id="${p}-sdust" x="660" y="660" width="720" height="170" fill="#9aa3b8" opacity="0" style="mix-blend-mode:overlay"/><circle id="${p}-pu" cx="960" cy="360" r="120" fill="none" stroke="#ffb24a" stroke-width="10" opacity="0"/><circle cx="960" cy="360" r="18" fill="#ffb24a" id="${p}-pc" opacity="0"/></g>`;
 // v4 dream orb + drawer
 s+=`<g id="${p}-v4" opacity="0" transform="translate(960 470) scale(.82) translate(-960 -500)"><rect x="560" y="780" width="800" height="230" rx="10" fill="#161a30" stroke="#2a3052" stroke-width="6"/><rect id="${p}-drawer" x="600" y="820" width="720" height="160" rx="8" fill="#10152a" stroke="#2f3862" stroke-width="5"/><circle cx="960" cy="900" r="10" fill="#d9b878"/><g id="${p}-orb"><circle cx="960" cy="430" r="190" fill="url(#${p}-glow)" style="mix-blend-mode:screen"/><circle id="${p}-orbc" cx="960" cy="430" r="110" fill="#ffd27a"/></g><path d="M700 640 Q780 540 880 520 M1220 640 Q1140 540 1040 520" stroke="#e3d6c2" stroke-width="30" stroke-linecap="round" fill="none"/></g>`;
 return s+dust(p,24,9,0,0,1920,1080,'#9fb4e8')}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.08,x1:-30});
 const t1=A.guitar,t2=A.friend,t3=A.bodyasks,t4=A.dream;const o={sag:0};
 tl.to(o,{sag:1,duration:t2-t1+.2,ease:'power2.in',onUpdate:()=>{for(let i=0;i<6;i++){const sg=Math.min(1,Math.max(0,o.sag*1.3-i*.12));const x=826+i*14,sx=sg*(i%2?26:-30);const e=document.getElementById(`${p}-s${i}`);if(e)e.setAttribute('d',`M${x} 150 Q${x+sx} 450 ${x} 720`)}}},t1);
 const sw=(a,b,t)=>{tl.to(`#${p}-${a}`,{opacity:0,duration:.45},t);tl.to(`#${p}-${b}`,{opacity:1,duration:.45},t)};
 sw('v1','v2',t2-.2);[['b1',t2+.2],['b2',t2+1.0],['b3',t2+1.9]].forEach(([k,t])=>tl.fromTo(`#${p}-${k}`,{opacity:0,y:20},{opacity:1,y:0,duration:.5},t));tl.to(`#${p}-av`,{fill:'#4a5170',duration:2.4},t2+.4);
 sw('v2','v3',t3-.2);tl.to(`#${p}-sdust`,{opacity:.7,duration:2.4,ease:'none'},t3);
 [0,.9,2.0].forEach((d,i)=>{const t=t3+d;tl.fromTo(`#${p}-pu`,{scale:.5,opacity:.9-i*.25,transformOrigin:'960px 360px'},{scale:1.5,opacity:0,duration:.8},t);tl.fromTo(`#${p}-pc`,{opacity:.9-i*.3},{opacity:.15,duration:.4,yoyo:true,repeat:1},t)});
 sw('v3','v4',t4-.2);tl.to(`#${p}-orbc`,{attr:{r:22},duration:3.2,ease:'power2.inOut'},t4+.3);tl.to(`#${p}-orb`,{y:380,duration:1.2,ease:'power2.in'},t4+3.3);tl.to(`#${p}-orb`,{opacity:0,duration:.3},t4+4.4);
 tl.fromTo(`#${p}-drawer`,{x:0},{x:0,duration:.01},0);tl.to(`#${p}-drawer`,{y:-10,duration:.1},t4+4.5);
 driftDust(tl,p,D,50);fade(tl,p,D,.6,.7)}
'''))
