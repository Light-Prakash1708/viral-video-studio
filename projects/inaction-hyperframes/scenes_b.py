S=[]
# ---------------- S06 DAY 365 ----------------
S.append(dict(id='s06',start='day365',end='masks',fi=.6,fo=.6,build=r'''
function build(){let s=roomBack(p,{rain:true});
 s+=noteSvg(p+'-n1',330,300,-9,'WRITE','THE BOOK','#b79d4e')+noteSvg(p+'-n2',500,400,6,'GET','STRONG','#6f9b84')+noteSvg(p+'-n3',660,290,-5,'SAY','SORRY','#b57a7a');
 let d='';for(let g=0;g<73;g++){const x=210+(g%12)*46,y=455+Math.floor(g/12)*46;d+=`M${x} ${y} l2 34 M${x+9} ${y} l2 34 M${x+18} ${y} l2 34 M${x+27} ${y} l2 34 M${x-4} ${y+24} l36 -14 `}
 s+=`<clipPath id="${p}-tc"><rect id="${p}-tcr" x="200" y="440" width="0" height="130"/></clipPath><path d="${d}" stroke="#e8dcc0" stroke-width="3" fill="none" stroke-linecap="round" clip-path="url(#${p}-tc)" opacity=".8"/>`;
 s+=manBack(p+'-man',880,835,1.3)+roomFront(p)+`<path d="M690 776 L860 752 L1030 776 L860 792Z" fill="#f4ead2"/><ellipse cx="860" cy="764" rx="190" ry="30" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".5"/>`;
 const mo=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
 s+=mo.map((m,i)=>`<g id="${p}-pg${i}" opacity="0"><rect x="810" y="260" width="300" height="380" rx="10" fill="#efe6d4"/><rect x="810" y="260" width="300" height="70" rx="10" fill="#c0463c"/><text x="960" y="312" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="46" fill="#fff" letter-spacing="6">${m}</text><text x="960" y="520" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="150" fill="#3a2f2a">${i+1}</text></g>`).join('');
 return s+dust(p,26,31,300,150,1300,700)+`<rect id="${p}-dim" width="1920" height="1080" fill="#02030a" opacity=".25"/>`}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.1,x1:-50});
 [['n1',0],['n2',.3],['n3',.6]].forEach(([k,t])=>tl.fromTo(`#${p}-${k}`,{opacity:0},{opacity:.85,duration:.8},t));
 tl.to(`#${p}-tcr`,{attr:{width:620},duration:D-3.2,ease:'none'},.4);
 tl.to(`#${p}-light`,{opacity:.55,duration:.1,yoyo:true,repeat:3},2.2);
 const t0=D-4.3;for(let i=0;i<12;i++){const t=t0+i*.26;tl.fromTo(`#${p}-pg${i}`,{opacity:0,x:0,y:40,rotation:0,scale:.9,svgOrigin:'960 450'},{opacity:1,y:0,scale:1,duration:.12},t);tl.to(`#${p}-pg${i}`,{x:-260-i*18,y:-120,rotation:-24,opacity:0,duration:.5,ease:'power2.in'},t+.18)}
 driftDust(tl,p,D,40);fade(tl,p,D,.6,.6)}
'''))
# ---------------- S07 MASKS ----------------
S.append(dict(id='s07',start='masks',end='science',fi=.6,fo=.7,build=r'''
function build(){let s=`<rect width="1920" height="1080" fill="#070a15"/><ellipse cx="960" cy="520" rx="880" ry="420" fill="url(#${p}-cold)" opacity=".25" style="mix-blend-mode:screen"/>`;
 const X=[360,760,1160,1560],ex=['I need more research.',"I'm waiting for the right time.","I'll start on Monday.","I'm just not ready yet."];
 X.forEach((x,i)=>{s+=`<g id="${p}-m${i}" opacity="0"><g transform="translate(${x} 560)"><path d="M-120 -170 C-130 -40 -90 150 0 190 C90 150 130 -40 120 -170 C60 -200 -60 -200 -120 -170Z" fill="#e9dfd0" stroke="#bdb09a" stroke-width="5"/><ellipse cx="-48" cy="-70" rx="26" ry="14" fill="#10141f"/><ellipse cx="48" cy="-70" rx="26" ry="14" fill="#10141f"/><path d="${i%2?'M-50 60 Q0 20 50 60':'M-50 40 Q0 90 50 40'}" stroke="#3a2f2a" stroke-width="8" fill="none" stroke-linecap="round"/></g>
 <rect x="${x-170}" y="230" width="340" height="96" rx="24" fill="#16203e" stroke="#2c3b6e" stroke-width="3"/><text id="${p}-e${i}" x="${x}" y="288" text-anchor="middle" font-family="Inter" font-weight="600" font-size="25" fill="#e8eeff" opacity="1">${ex[i]}</text><text id="${p}-t${i}" x="${x}" y="292" text-anchor="middle" font-family="Playfair Display" font-weight="700" font-size="40" fill="#ffb24a" opacity="0">Tomorrow.</text></g>`});
 s+=`<g id="${p}-light" opacity="0"><circle cx="960" cy="600" r="360" fill="url(#${p}-glow)" style="mix-blend-mode:screen"/><circle cx="960" cy="600" r="30" fill="#fff0c8"/></g><g id="${p}-step" opacity="0"><g transform="translate(960 760)"><ellipse cx="0" cy="0" rx="30" ry="12" fill="#06070e"/><rect x="-14" y="-110" width="28" height="110" rx="12" fill="#06070e"/><circle cx="0" cy="-130" r="24" fill="#06070e"/></g></g>`;
 return s+dust(p,26,12,0,100,1920,800,'#9fb4e8')}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.08,x1:-30});
 [['m0',A.research],['m1',A.right_time],['m2',A.monday],['m3',A.notready]].forEach(([k,t],i)=>{tl.fromTo(`#${p}-${k}`,{opacity:0,y:30},{opacity:1,y:0,duration:.6,ease:'back.out(1.6)'},t-.2);tl.to(`#${p}-m${i}`,{y:'+=8',duration:1.8,yoyo:true,repeat:5,ease:'sine.inOut'},t+.5)});
 const ts=A.notready+2.7;for(let i=0;i<4;i++){tl.to(`#${p}-e${i}`,{opacity:0,duration:.3},ts+i*.15);tl.to(`#${p}-t${i}`,{opacity:1,duration:.3},ts+i*.15)}
 const tr=A.ready_isnt+.2;for(let i=0;i<4;i++)tl.to(`#${p}-m${i}`,{y:420,rotation:(i%2?1:-1)*26,opacity:0,duration:1.1,ease:'power2.in'},tr+i*.12);
 tl.to(`#${p}-light`,{opacity:1,duration:2.2},tr+.6);tl.fromTo(`#${p}-light`,{scale:.4,transformOrigin:'960px 600px'},{scale:1.3,duration:4,ease:'none'},tr+.6);
 tl.fromTo(`#${p}-step`,{opacity:0,x:0},{opacity:1,x:0,duration:.5},A.science-3.4);tl.to(`#${p}-step`,{y:-60,scale:.7,svgOrigin:'960 760',duration:2.4,ease:'power1.inOut'},A.science-3.2);
 driftDust(tl,p,D,50);fade(tl,p,D,.6,.7)}
'''))
# ---------------- S08 SCIENCE ----------------
S.append(dict(id='s08',start='science',end='number',fi=.6,fo=.6,build=r'''
const brain=(id,x,y,s,lbl)=>`<g id="${id}" opacity="0" transform="translate(${x} ${y}) scale(${s})"><path d="M-150 30 C-210 -70 -140 -180 -40 -150 C20 -200 150 -170 160 -70 C230 -20 190 110 100 120 C70 180 -30 180 -70 130 C-130 150 -190 100 -150 30Z" fill="rgba(80,120,255,.12)" stroke="#7fa8ff" stroke-width="5"/><path d="M-20 -150 C-30 -60 20 -10 10 70 M-100 -60 C-60 -30 -50 20 -90 60 M60 -90 C90 -40 70 20 110 50" stroke="#7fa8ff" stroke-width="3" fill="none" opacity=".5"/><circle id="${id}-g" cx="-60" cy="-70" r="40" fill="url(#${p}-cold)" opacity="0" style="mix-blend-mode:screen"/><text x="0" y="250" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="34" letter-spacing="6" fill="#bcd0ff">${lbl}</text></g>`;
function build(){let s=`<rect width="1920" height="1080" fill="#050914"/><g stroke="rgba(80,140,255,.08)" stroke-width="2">${Array.from({length:25},(_,i)=>`<path d="M${i*80} 0V1080M0 ${i*80}H1920"/>`).join('')}</g>`;
 s+=brain(p+'-b1',660,470,1.25,'YOURSELF')+brain(p+'-b2',1260,470,1.25,'A STRANGER');
 s+=`<g id="${p}-eq" opacity="0"><text x="960" y="520" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="120" fill="#ffb24a">=</text><text x="960" y="700" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="34" letter-spacing="8" fill="#ffb24a">SAME PATTERN</text></g><rect id="${p}-scan" x="300" y="200" width="1320" height="6" fill="#7fa8ff" opacity="0"/>`;
 s+=`<g id="${p}-p3" opacity="0"><g transform="translate(560 560) scale(.9)">${bust(p+'q',0,0,.9,{})}</g><g id="${p}-str" transform="translate(1360 560)"><path d="M-200 340 C-195 215 -130 150 -60 132 L60 132 C130 150 195 215 200 340Z" fill="#232a45"/><ellipse cx="0" cy="-20" rx="90" ry="102" fill="#3a3f5a"/><text x="0" y="14" text-anchor="middle" font-family="Playfair Display" font-weight="700" font-size="120" fill="#7d86ab">?</text></g><g id="${p}-box" opacity="0"><rect x="800" y="440" width="260" height="170" fill="#b98a4e" stroke="#7a5630" stroke-width="6"/><text x="930" y="540" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="#2a1d0e" letter-spacing="4">PROBLEM</text></g><g id="${p}-bub" opacity="0"><rect x="1330" y="150" width="280" height="110" rx="30" fill="#16203e" stroke="#ffb24a" stroke-width="4"/><text x="1470" y="222" text-anchor="middle" font-family="Playfair Display" font-weight="700" font-size="54" fill="#ffb24a">Tomorrow.</text></g></g>`;
 return s+dust(p,20,13,0,100,1920,800,'#7fa8ff')}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.08,x1:-30});
 tl.set([`#${p}q-lidL`,`#${p}q-lidR`],{scaleY:.02},0);tl.set(`#${p}q-m-neutral`,{opacity:1},0);
 tl.fromTo(`#${p}-b1`,{opacity:0},{opacity:1,duration:.7},.2);tl.to(`#${p}-b1-g`,{opacity:.9,duration:.4,yoyo:true,repeat:5},A.science+.3>D?.6:1.2);
 tl.to(`#${p}-scan`,{opacity:.8,duration:.2},A.scanned-.2);tl.fromTo(`#${p}-scan`,{y:0},{y:560,duration:2.2,ease:'power1.inOut'},A.scanned-.2);tl.to(`#${p}-scan`,{opacity:0,duration:.3},A.scanned+2.1);
 tl.fromTo(`#${p}-b2`,{opacity:0},{opacity:1,duration:.7},A.scanned);tl.to(`#${p}-b2-g`,{opacity:.9,duration:.4,yoyo:true,repeat:5},A.scanned+.6);
 tl.fromTo(`#${p}-eq`,{opacity:0,scale:.8,transformOrigin:'960px 520px'},{opacity:1,scale:1,duration:.5,ease:'back.out(2)'},A.scanned+2.2);
 tl.to([`#${p}-b1`,`#${p}-b2`,`#${p}-eq`],{opacity:0,duration:.6},A.stranger-.4);tl.to(`#${p}-p3`,{opacity:1,duration:.6},A.stranger);
 tl.fromTo(`#${p}-box`,{opacity:0,x:-320,y:30},{opacity:1,x:0,y:0,duration:1.6,ease:'power2.inOut'},A.handing);tl.to(`#${p}-box`,{x:360,y:-50,duration:1.4,ease:'power2.inOut'},A.handing+2.0>A.answer?A.answer-1.4:A.handing+2.0);
 tl.fromTo(`#${p}-bub`,{opacity:0,scale:.6,transformOrigin:'1470px 205px'},{opacity:1,scale:1,duration:.4,ease:'back.out(2)'},A.answer);
 driftDust(tl,p,D,40);fade(tl,p,D,.6,.6)}
'''))
# ---------------- S09 THE NUMBER ----------------
S.append(dict(id='s09',start='number',end='day14600',fi=.6,fo=.7,build=r'''
function build(){let s=`<rect width="1920" height="1080" fill="#060913"/><defs><pattern id="${p}-pt" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3.8" fill="#e8eeff"/></pattern><pattern id="${p}-pg" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3.8" fill="#ff5a4d"/></pattern><clipPath id="${p}-cp"><rect id="${p}-c1" x="260" y="300" width="1400" height="0"/><rect id="${p}-c2" x="260" y="300" width="0" height="14"/></clipPath><clipPath id="${p}-gc"><rect id="${p}-g1" x="260" y="300" width="0" height="560"/></clipPath></defs>`;
 s+=`<rect id="${p}-grid" x="260" y="300" width="1400" height="560" fill="url(#${p}-pt)" opacity="0"/><rect id="${p}-gone" x="260" y="300" width="1400" height="560" fill="url(#${p}-pg)" clip-path="url(#${p}-cp)" opacity=".9"/>`;
 s+=`<text id="${p}-big" x="960" y="236" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="104" fill="#f4f0e8" letter-spacing="10" opacity="0">4,000 WEEKS</text><text id="${p}-lab" x="960" y="1000" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="#ff5a4d" letter-spacing="8" opacity="0"></text><g id="${p}-tag" opacity="0"><rect x="560" y="150" width="800" height="110" rx="55" fill="#1c0e12" stroke="#ff5a4d" stroke-width="5"/><text x="960" y="222" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="58" fill="#ff5a4d" letter-spacing="8">PAID IN WEEKS</text></g>`;
 return s+dust(p,20,17,0,100,1920,800,'#9fb4e8')}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.07,x1:-20});
 const o={n:0};const lab=document.getElementById(`${p}-lab`);
 const upd=()=>{const n=Math.round(o.n),rows=Math.floor(n/100),part=n%100;document.getElementById(`${p}-c1`).setAttribute('height',rows*14);const c2=document.getElementById(`${p}-c2`);c2.setAttribute('y',300+rows*14);c2.setAttribute('width',part*14)};
 tl.to(`#${p}-grid`,{opacity:.85,duration:1.2},.2);tl.to(`#${p}-big`,{opacity:1,duration:.6},A.number+.4);
 tl.to(o,{n:1560,duration:2.6,ease:'power2.inOut',onUpdate:()=>{upd();lab.textContent=`AGE 30 · ${Math.round(o.n).toLocaleString('en-US')} WEEKS GONE`}},A.thirty);tl.to(lab,{opacity:1,duration:.4},A.thirty);
 tl.to(o,{n:2600,duration:2.6,ease:'power2.inOut',onUpdate:()=>{upd();lab.textContent=`AGE 50 · ${Math.round(o.n).toLocaleString('en-US')} WEEKS GONE`}},A.fifty);
 tl.to(`#${p}-big`,{opacity:0,duration:.4},A.notfree-.2);tl.fromTo(`#${p}-tag`,{opacity:0,scale:.7,transformOrigin:'960px 205px'},{opacity:1,scale:1,duration:.5,ease:'back.out(2)'},A.notfree);
 tl.to(`#${p}-gone`,{opacity:.55,duration:.35,yoyo:true,repeat:5},A.notfree+.5);
 driftDust(tl,p,D,40);fade(tl,p,D,.6,.7)}
'''))
# ---------------- S10 FLASH FORWARD ----------------
S.append(dict(id='s10',start='day14600',end='procrast',fi=.9,fo=.8,build=r'''
function build(){let s=`<g id="${p}-rm">`+roomBack(p,{rain:true})+`<rect x="0" y="0" width="1920" height="1080" fill="#9aa3b8" opacity=".12" style="mix-blend-mode:overlay"/><path d="M170 140 Q300 150 330 300 M170 140 Q210 260 190 330 M170 140 Q250 200 250 260" stroke="#cfd6e6" stroke-width="2" fill="none" opacity=".45"/>`;
 s+=noteSvg(p+'-n1',330,300,-12,'WRITE','THE BOOK','#9d8a55')+manBack(p+'-man',880,835,1.3,{old:true,hair:'#cfcfd8',body:'#252a40'})+roomFront(p)+`<path d="M690 776 L860 752 L1030 776 L860 792Z" fill="#cfc7b4"/></g>`;
 const r=RND(33);
 s+=`<g id="${p}-cl" opacity="0"><rect width="1920" height="1080" fill="#05070f"/><g id="${p}-cl1">${Array.from({length:50},()=>`<circle cx="${480+(r()-.5)*380}" cy="${520+(r()-.5)*260}" r="${14+r()*30}" fill="#c9d0e6" opacity="${.12+r()*.2}"/>`).join('')}</g><g id="${p}-cl2">${Array.from({length:60},()=>`<circle cx="${1440+(r()-.5)*320}" cy="${540+(r()-.5)*300}" r="${26+r()*44}" fill="#02030a" stroke="#1a1f38" stroke-width="2"/>`).join('')}</g><text x="480" y="780" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="38" letter-spacing="6" fill="#9fb0d8">TRIED AND FAILED</text><text x="1440" y="780" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="38" letter-spacing="6" fill="#ff5a4d">NEVER TRIED</text></g>`;
 return s+dust(p,34,18,200,100,1500,760,'#cfd6e6')+`<rect id="${p}-dim" width="1920" height="1080" fill="#010208" opacity="0"/>`}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.1,x1:-50});
 tl.fromTo(`#${p}-n1`,{opacity:0},{opacity:.7,duration:1},.4);tl.to(`#${p}-light`,{opacity:.4,duration:.12,yoyo:true,repeat:7},3.2);tl.to(`#${p}-light`,{opacity:.5,duration:.4},4.6);
 tl.to(`#${p}-man`,{y:'+=14',rotation:1.8,svgOrigin:'880 835',duration:3,ease:'sine.inOut'},A.older);
 tl.to(`#${p}-rm`,{opacity:0,duration:.8},A.regret+3.6);tl.to(`#${p}-cl`,{opacity:1,duration:.8},A.regret+3.6);
 const cl1=document.querySelectorAll(`#${p}-cl1 circle`);cl1.forEach((c,i)=>{const rr=RND(i+3);tl.to(c,{x:-60-rr()*420,y:-80-rr()*300,opacity:0,duration:1.8,ease:'power2.in'},A.failure_fades+rr()*.4)});
 tl.fromTo(`#${p}-cl2`,{scale:1,transformOrigin:'1440px 540px'},{scale:1.7,duration:A.slowdeath1-A.silence+.4,ease:'power1.in'},A.silence);
 tl.to(`#${p}-dim`,{opacity:1,duration:1.2},A.slowdeath1+.3);
 driftDust(tl,p,D,40);fade(tl,p,D,.9,.8)}
'''))
