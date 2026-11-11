import copy,scenes_d
ALL={s['id']:copy.deepcopy(s) for s in scenes_d.S}
def cut(sc,a,b,new):
    t=sc['build']; i=t.index(a); j=t.index(b,i); sc['build']=t[:i]+new+t[j:]
# ================= S05: body (v3) + dream (v4) =================
s=ALL['s05']
V34=r'''// v3 body: slumped on the couch, the urge to move fades
 s+=`<g id="${p}-v3" opacity="0" transform="translate(960 470) scale(.82) translate(-960 -500)"><rect width="1920" height="1080" fill="#070a15"/><rect x="0" y="830" width="1920" height="250" fill="#05070f"/>
 <ellipse cx="1180" cy="560" rx="560" ry="320" fill="url(#${p}-cold)" opacity=".4" style="mix-blend-mode:screen"/>
 <rect x="1500" y="400" width="250" height="160" rx="10" fill="#0c1228" stroke="#1d2542" stroke-width="6"/><rect id="${p}-tv" x="1512" y="412" width="226" height="136" fill="#3a5ac0" opacity=".7"/>
 <rect x="40" y="250" width="170" height="580" fill="#0b0f1e" stroke="#151a30" stroke-width="6"/><rect id="${p}-dl" x="46" y="256" width="158" height="568" fill="#ffd089" opacity=".4"/>
 <g transform="translate(70 830)"><path d="M0 0 L190 0 Q222 -8 222 -40 Q190 -86 138 -70 L88 -118 L28 -110 L12 -30Z" fill="#2c3a6a"/><rect x="0" y="0" width="222" height="20" fill="#d9d9e2"/></g><rect id="${p}-sdust" x="60" y="720" width="260" height="120" fill="#9aa3b8" opacity="0" style="mix-blend-mode:overlay"/>
 <rect x="500" y="520" width="800" height="250" rx="40" fill="#1a2040"/><rect x="470" y="670" width="860" height="150" rx="34" fill="#232a52"/><rect x="450" y="610" width="90" height="210" rx="40" fill="#2a3262"/><rect x="1260" y="610" width="90" height="210" rx="40" fill="#2a3262"/>
 <g id="${p}-gh" opacity="0" fill="none" stroke="#ffb24a" stroke-width="5" stroke-dasharray="11 8"><circle cx="838" cy="470" r="58"/><path d="M770 700 C770 600 790 540 840 520 C890 505 930 560 940 700"/></g>
 <g id="${p}-sm"><path d="M770 700 C770 600 790 540 840 520 C890 505 930 560 940 700Z" fill="#232a45"/><path d="M920 650 L1060 660 L1076 790" stroke="#1b2140" stroke-width="56" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="1114" cy="808" rx="52" ry="22" fill="#d9d9e2"/><path d="M846 600 Q900 668 972 656" stroke="#232a45" stroke-width="40" stroke-linecap="round" fill="none"/>
 <g id="${p}-sh"><circle cx="838" cy="470" r="58" fill="#eadccb"/><path d="M780 466 C784 408 892 402 896 466 C872 434 804 436 780 466Z" fill="#1a1b26"/><g fill="none" stroke="#20202c" stroke-width="5"><circle cx="866" cy="476" r="17"/><circle cx="902" cy="476" r="17"/></g><path d="M884 508 q14 6 28 0" stroke="#3a2f2a" stroke-width="5" fill="none"/></g></g>
 <text x="360" y="150" font-family="Oswald" font-weight="700" font-size="38" letter-spacing="8" fill="#9aa8d8">URGE TO MOVE</text><rect x="360" y="172" width="560" height="26" rx="13" fill="#141a36"/><rect id="${p}-bar" x="360" y="172" width="560" height="26" rx="13" fill="#ffb24a"/>
 <circle id="${p}-pu" cx="1180" cy="185" r="60" fill="none" stroke="#ffb24a" stroke-width="7" opacity="0"/><circle id="${p}-pc" cx="1180" cy="185" r="14" fill="#ffb24a" opacity="0"/></g>`;
 // v4 dream: he holds it in his hands, watches it shrink, puts it away, but it still glows
 s+=`<g id="${p}-v4" opacity="0" transform="translate(960 470) scale(.82) translate(-960 -500)"><rect width="1920" height="1080" fill="#080b18"/><ellipse id="${p}-dg" cx="960" cy="640" rx="800" ry="470" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".3"/>${bust(p+'d',960,500,1.2,{})}
 <g id="${p}-hands"><path d="M770 940 C780 860 850 826 910 850" stroke="#e6d6bf" stroke-width="46" stroke-linecap="round" fill="none"/><path d="M1150 940 C1140 860 1070 826 1010 850" stroke="#e6d6bf" stroke-width="46" stroke-linecap="round" fill="none"/></g>
 <g id="${p}-orb"><circle cx="960" cy="800" r="200" fill="url(#${p}-glow)" style="mix-blend-mode:screen"/><circle id="${p}-orbc" cx="960" cy="800" r="106" fill="#ffd27a"/><circle cx="930" cy="770" r="26" fill="#fff0c8" opacity=".8"/></g>
 <g id="${p}-drawer" opacity="0"><rect x="560" y="900" width="800" height="210" rx="12" fill="#161a30" stroke="#2f3862" stroke-width="6"/><rect id="${p}-dfront" x="600" y="936" width="720" height="150" rx="8" fill="#1d2444" stroke="#38427a" stroke-width="4"/><rect x="930" y="974" width="80" height="14" rx="7" fill="#d9b878"/></g><rect id="${p}-seam" x="610" y="938" width="700" height="7" rx="3" fill="#ffb24a" opacity="0"/></g>`;
'''
cut(s,'// v3 shoes + pulse',' return s+dust(p,24,9',V34)
ANIM34=r'''sw('v2','v3',t3-.2);
 tl.fromTo(`#${p}-bar`,{attr:{width:560}},{attr:{width:24},duration:2.7,ease:'power2.in'},t3);tl.to(`#${p}-sdust`,{opacity:.85,duration:2.8,ease:'none'},t3);tl.to(`#${p}-dl`,{opacity:.05,duration:2.8},t3);tl.to(`#${p}-tv`,{opacity:.3,duration:.17,yoyo:true,repeat:13},t3);
 tl.to(`#${p}-sh`,{rotation:15,svgOrigin:'838 540',duration:2.6,ease:'sine.inOut'},t3);
 [[.2,-230,.9],[1.0,-150,.6],[1.8,-70,.38]].forEach(([d,h,o],i)=>{const t=t3+d;tl.fromTo(`#${p}-gh`,{opacity:0,y:0},{opacity:o,duration:.18},t);tl.to(`#${p}-gh`,{y:h,duration:.4,ease:'power2.out'},t);tl.to(`#${p}-gh`,{y:0,duration:.34,ease:'power3.in'},t+.44);tl.to(`#${p}-gh`,{opacity:0,duration:.14},t+.78);
  tl.to(`#${p}-sm`,{y:-9,duration:.12,yoyo:true,repeat:1},t+.12);tl.fromTo(`#${p}-pu`,{scale:.5,opacity:.95-i*.28,transformOrigin:'1180px 185px'},{scale:1.7,opacity:0,duration:.75},t);tl.fromTo(`#${p}-pc`,{opacity:.95-i*.3},{opacity:.12,duration:.4,yoyo:true,repeat:1},t)});
 sw('v3','v4',t4-.2);const q=p+'d';
 tl.set([`#${q}-lidL`,`#${q}-lidR`],{scaleY:.03},0);setMood(tl,q,'hope',t4-.3,.01);tl.to([`#${q}-pl`,`#${q}-pr`],{y:8,duration:.4},t4);blinks(tl,q,[t4+1.0,t4+3.3]);
 tl.to(`#${p}-orbc`,{attr:{r:20},duration:3.0,ease:'power2.inOut'},t4+.6);tl.to(`#${p}-dg`,{opacity:.04,duration:3.0},t4+.6);
 setMood(tl,q,'sad',t4+1.7,.6);lidsOpen(tl,q,.4,t4+2.4,.8);
 tl.fromTo(`#${p}-drawer`,{opacity:0},{opacity:1,duration:.5},t4+3.4);tl.to(`#${p}-dfront`,{y:48,duration:.5,ease:'power2.out'},t4+3.9);
 tl.to(`#${p}-hands`,{y:150,duration:.9,ease:'power2.inOut'},t4+4.1);tl.to(`#${p}-orb`,{y:190,duration:.9,ease:'power2.inOut'},t4+4.1);tl.to(`#${p}-orb`,{opacity:0,duration:.25},t4+4.85);tl.to(`#${p}-hands`,{opacity:0,duration:.3},t4+4.9);
 setMood(tl,q,'tired',t4+4.3,.6);tl.to(`#${p}-dfront`,{y:0,duration:.5,ease:'power2.in'},t4+5.2);
 tl.fromTo(`#${p}-seam`,{opacity:0},{opacity:.9,duration:.7,yoyo:true,repeat:3,ease:'sine.inOut'},t4+5.5);
 '''
cut(s,"sw('v2','v3',t3-.2);","driftDust(tl,p,D,50);fade(tl,p,D,.6,.7)}",ANIM34)
# ================= S10: tried and failed vs never tried =================
s=ALL['s10']
CL=r'''const POSE=(k,c)=>({stand:`<circle cx="0" cy="-150" r="20" fill="${c}"/><path d="M0 -128 L0 -64 M0 -64 L-16 0 M0 -64 L16 0 M0 -112 L-26 -70 M0 -112 L26 -70" stroke="${c}" stroke-width="14" stroke-linecap="round" fill="none"/>`,crouch:`<circle cx="8" cy="-112" r="20" fill="${c}"/><path d="M6 -90 L0 -52 M0 -52 L-26 -26 L-8 0 M0 -52 L26 -26 L12 0 M4 -82 L-28 -52" stroke="${c}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,jump:`<circle cx="6" cy="-166" r="20" fill="${c}"/><path d="M6 -144 L0 -86 M0 -86 L-22 -54 L-6 -32 M0 -86 L24 -60 L10 -28 M6 -134 L-20 -176 M6 -134 L30 -182" stroke="${c}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,fall:`<circle cx="-56" cy="-20" r="20" fill="${c}"/><path d="M-34 -16 L50 -16 M50 -16 L96 -26 M50 -16 L90 2 M-24 -16 L-44 6" stroke="${c}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`}[k]);
 s+=`<g id="${p}-cl" opacity="0"><rect width="1920" height="1080" fill="#05070f"/><path d="M960 150 V930" stroke="#1a2038" stroke-width="3"/>
 <g id="${p}-lp"><ellipse cx="500" cy="500" rx="560" ry="380" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".18"/><path d="M80 760 H900" stroke="#2a3558" stroke-width="6"/><rect x="700" y="470" width="200" height="30" fill="#2a3558"/><path d="M880 470 V380 L930 405 L880 430" fill="#ffb24a" stroke="#ffb24a" stroke-width="5"/>
 ${[0,1,2].map(i=>`<path id="${p}-tr${i}" d="M260 760 Q${390+i*50} ${620-i*90} ${520+i*40} 760" stroke="#9fb0d8" stroke-width="4" fill="none" stroke-dasharray="10 12" opacity="0"/>`).join('')}
 ${[0,1,2].map(i=>`<g id="${p}-pp${i}" opacity="0"><circle cx="${520+i*40}" cy="742" r="20" fill="#c9d0e6"/><text x="${520+i*40}" y="750" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="22" fill="#10131f">${i+1}</text></g>`).join('')}
 <g id="${p}-pl" transform="translate(260 760)">${['stand','crouch','jump','fall'].map(k=>`<g id="${p}-po-${k}" opacity="${k==='stand'?1:0}">${POSE(k,'#c9d0e6')}</g>`).join('')}</g>
 <text x="490" y="852" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" letter-spacing="7" fill="#9fb0d8">TRIED AND FAILED</text>${Array.from({length:14},(_,i)=>`<circle class="${p}-fp" cx="${540+i*14}" cy="720" r="${26+(i%4)*8}" fill="url(#${p}-glow)" opacity="0" style="mix-blend-mode:screen"/>`).join('')}</g>
 <g id="${p}-rp"><path d="M1020 760 H1840" stroke="#1e2440" stroke-width="6"/><g transform="translate(1430 760)" id="${p}-rf">${POSE('stand','#6a7294')}</g>
 <g id="${p}-mass" opacity="0.95">${Array.from({length:46},()=>`<circle cx="${1430+(r()-.5)*330}" cy="${330+(r()-.5)*190}" r="${34+r()*52}" fill="#02030a" stroke="#161b32" stroke-width="2"/>`).join('')}</g>
 <path id="${p}-wv" d="M1060 880 L1800 880" stroke="#ff5a4d" stroke-width="5" fill="none" opacity=".85"/><text x="1430" y="852" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" letter-spacing="7" fill="#ff5a4d">NEVER TRIED</text></g></g>`;
'''
cut(s,'s+=`<g id="${p}-cl" opacity="0">',' return s+dust(p,34,18',CL)
CLA=r'''const tc=A.regret+3.6,SET=k=>['stand','crouch','jump','fall'].forEach(n=>tl.set(`#${p}-po-${n}`,{opacity:n===k?1:0},0));
 const at=(k,t)=>['stand','crouch','jump','fall'].forEach(n=>tl.set(`#${p}-po-${n}`,{opacity:n===k?1:0},t));
 const pl=document.getElementById(`${p}-pl`);const pos={x:260,y:760};const mv=()=>pl.setAttribute('transform',`translate(${pos.x} ${pos.y})`);
 [0,1,2].forEach(i=>{const t=tc+.5+i*1.55,pk=[130,205,275][i],lx=[520,560,600][i];at('crouch',t);at('jump',t+.3);at('fall',t+1.05);at('stand',t+1.38);
  const o={u:0};tl.to(o,{u:1,duration:.75,ease:'none',onUpdate:()=>{pos.x=260+(lx-260)*o.u;pos.y=760-pk*4*o.u*(1-o.u);mv()}},t+.3);
  tl.to(`#${p}-tr${i}`,{opacity:.55,duration:.2},t+.3);tl.fromTo(`#${p}-pp${i}`,{opacity:0,y:-40},{opacity:1,y:0,duration:.3,ease:'bounce.out'},t+1.05);
  tl.to(o,{u:2,duration:.2,onUpdate:()=>{pos.x=lx;pos.y=760;mv()}},t+1.05);tl.to(o,{u:3,duration:.35,onUpdate:()=>{pos.x=lx+(260-lx)*(o.u-2)*.0;pos.y=760;mv()}},t+1.05);
  tl.to(o,{u:4,duration:.4,onUpdate:()=>{pos.x=lx+(260-lx)*(o.u-3);pos.y=760;mv()}},t+1.4)});
 tl.to([`#${p}-pp0`,`#${p}-pp1`,`#${p}-pp2`],{y:-150,opacity:0,duration:1.4,ease:'power2.in'},A.failure_fades);
 document.querySelectorAll(`.${p}-fp`).forEach((c,i)=>{const rr=RND(i+9);tl.fromTo(c,{opacity:0,y:0,scale:.5,transformOrigin:'center'},{opacity:.6,y:-120-rr()*220,scale:1.3,duration:1.8,ease:'power1.out'},A.failure_fades+rr()*.5);tl.to(c,{opacity:0,duration:.8},A.failure_fades+1.8+rr()*.4)});
 tl.to(`#${p}-tr0`,{opacity:0,duration:.8},A.failure_fades);tl.to(`#${p}-tr1`,{opacity:0,duration:.8},A.failure_fades);tl.to(`#${p}-tr2`,{opacity:0,duration:.8},A.failure_fades);
 tl.fromTo(`#${p}-mass`,{y:0,scale:1,transformOrigin:'1430px 330px'},{y:300,scale:1.55,duration:A.slowdeath1-A.silence+.5,ease:'power2.in'},A.silence);tl.to(`#${p}-rf`,{opacity:.25,duration:A.slowdeath1-A.silence},A.silence);
 const wv={a:46};tl.to(wv,{a:0,duration:A.slowdeath1-A.silence,ease:'power1.in',onUpdate:()=>{let d='M1060 880';for(let x=1060;x<=1800;x+=10)d+=` L${x} ${880+Math.sin(x*.07)*wv.a*(1-Math.abs(x-1430)/520)}`;document.getElementById(`${p}-wv`).setAttribute('d',d)}},A.silence);
 '''
cut(s,"const cl1=document.querySelectorAll","tl.to(`#${p}-dim`",CLA)
# ================= S11: the push-up =================
s=ALL['s11']
t=s['build']
a=t.index("s+=card(1,960,'ONE PUSH-UP',"); b=t.index("s+=card(2,1440")
PU=r'''s+=card(1,960,'ONE PUSH-UP',`<path d="M790 646 H1130" stroke="#2c3b6e" stroke-width="6"/><g id="${p}-pr"><path id="${p}-pbody" d="M800 632 L1046 522" stroke="#4a5a9a" stroke-width="36" stroke-linecap="round" fill="none"/><path id="${p}-parm" d="M1046 522 L1050 580 L1050 640" stroke="#d9c8b0" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle id="${p}-phead" cx="1084" cy="506" r="27" fill="#eadccb"/><g id="${p}-pgl" fill="none" stroke="#20202c" stroke-width="4"><circle cx="1094" cy="502" r="10"/></g></g><g id="${p}-psw" opacity="0"><path d="M1108 470 q-8 18 0 24 q8 -6 0 -24Z" fill="#cfe4ff"/></g><g id="${p}-pbadge" opacity="0"><circle cx="880" cy="440" r="34" fill="#35e08a"/><text x="880" y="453" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="#07140d">1</text></g>`);
 '''
s['build']=t[:a]+PU+t[b:]
old="tl.to(`#${p}-pu`,{attr:{d:'M830 590 L930 580 L1090 590'},duration:.5,yoyo:true,repeat:1,ease:'power2.inOut'},A.pushup+.1);"
assert old in s['build']
NEW=r'''const po={u:0};const upd=()=>{const th=(24-18*po.u)*Math.PI/180,sx=800+270*Math.cos(th),sy=632-270*Math.sin(th),Hx=1050,Hy=640,dx=Hx-sx,dy=Hy-sy,d=Math.hypot(dx,dy),h=Math.sqrt(Math.max(0,59*59-(d/2)*(d/2)));let px=-dy/d,py=dx/d;if(px>0){px=-px;py=-py}const ex=sx+dx/2+px*h,ey=sy+dy/2+py*h,hx=sx+46*Math.cos(th),hy=sy-46*Math.sin(th)-6;document.getElementById(`${p}-pbody`).setAttribute('d',`M800 632 L${sx} ${sy}`);document.getElementById(`${p}-parm`).setAttribute('d',`M${sx} ${sy} L${ex} ${ey} L${Hx} ${Hy}`);document.getElementById(`${p}-phead`).setAttribute('cx',hx);document.getElementById(`${p}-phead`).setAttribute('cy',hy);document.getElementById(`${p}-pgl`).setAttribute('transform',`translate(${hx-1084+10} ${hy-506+4})`)};upd();
 tl.to(po,{u:1,duration:.42,ease:'power2.inOut',onUpdate:upd},A.pushup+.1);tl.to(po,{u:0,duration:.55,ease:'back.out(1.5)',onUpdate:upd},A.pushup+.58);
 tl.fromTo(`#${p}-psw`,{opacity:0,y:0},{opacity:1,y:26,duration:.7},A.pushup+.7);tl.to(`#${p}-psw`,{opacity:0,duration:.3},A.pushup+1.4);tl.fromTo(`#${p}-pbadge`,{opacity:0,scale:.3,transformOrigin:'880px 440px'},{opacity:1,scale:1,duration:.4,ease:'back.out(3)'},A.pushup+1.1);'''
s['build']=s['build'].replace(old,NEW)
S=list(ALL.values())

# ================= S04: walking through rooms with the growing weight (65-67.5 s) =================
s=ALL['s04']
t=s['build']
a=t.index('s+=`<g id="${p}-pb" opacity="0">'); b=t.index(" return s+dust(p,26,6")
PB=r'''s+=`<g id="${p}-pb" opacity="0"><rect width="1920" height="1080" fill="#090d1c"/>
 <g id="${p}-wl"><rect x="0" y="200" width="5400" height="660" fill="#0e1326"/><rect x="0" y="838" width="5400" height="22" fill="#1a2040"/><rect x="0" y="860" width="5400" height="220" fill="#070a14"/>
 ${[0,1,2,3,4,5,6,7].map(i=>`<g><circle cx="${300+i*700}" cy="226" r="14" fill="#ffd089"/><ellipse cx="${300+i*700}" cy="520" rx="200" ry="330" fill="url(#${p}-glow)" opacity=".14" style="mix-blend-mode:screen"/></g>`).join('')}
 ${[1500,2300,3100].map(x=>`<g><rect x="${x-135}" y="290" width="270" height="570" fill="#04060d" stroke="#1d2542" stroke-width="8"/><rect x="${x-120}" y="304" width="240" height="556" fill="#ffd089" opacity=".35"/><ellipse cx="${x}" cy="866" rx="260" ry="46" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".8"/></g>`).join('')}</g>
 <g id="${p}-figw"><g transform="translate(700 860)">
 <g id="${p}-legB" style="transform-box:fill-box;transform-origin:50% 0%"><path d="M-12 -135 L-6 -70 L-22 0" stroke="#141a34" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="-4" cy="8" rx="34" ry="14" fill="#b8b8c8"/></g>
 <g id="${p}-arm2" style="transform-box:fill-box;transform-origin:50% 0%"><path d="M-6 -250 L-30 -200 L-40 -150" stroke="#2a3258" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>
 <path d="M-40 -258 C-52 -200 -48 -160 -34 -128 L26 -128 C38 -170 36 -220 28 -262Z" fill="#232a45"/>
 <g id="${p}-legA" style="transform-box:fill-box;transform-origin:50% 0%"><path d="M8 -135 L12 -70 L-4 0" stroke="#1b2140" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="14" cy="8" rx="34" ry="14" fill="#d9d9e6"/></g>
 <g id="${p}-head"><circle cx="0" cy="-296" r="42" fill="#eadccb"/><path d="M-42 -300 C-40 -352 38 -352 42 -300 C26 -326 -26 -326 -42 -300Z" fill="#1a1b26"/><circle cx="26" cy="-294" r="14" fill="none" stroke="#20202c" stroke-width="4"/><path d="M12 -292 L-30 -300" stroke="#20202c" stroke-width="4"/><path d="M30 -272 q8 4 14 0" stroke="#3a2f2a" stroke-width="4" fill="none"/></g>
 <g id="${p}-arm1" style="transform-box:fill-box;transform-origin:50% 100%"><path d="M12 -250 L44 -272 L20 -322" stroke="#2f3866" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>
 <g id="${p}-stone" style="transform-box:fill-box;transform-origin:50% 100%"><ellipse cx="22" cy="-340" rx="40" ry="30" fill="#5d6479"/><ellipse cx="10" cy="-350" rx="14" ry="9" fill="#8a92a8"/></g></g></g></g>`;
'''
s['build']=t[:a]+PB+t[b:]
t=s['build']; a=t.index("['tired'].forEach(m=>setMood"); b=t.index("tl.to(`#${p}-flash`")
PBA=r'''const t0=A.weight-.3,dd=A.dies_first-t0+.2;
 tl.fromTo(`#${p}-legA`,{rotation:-26},{rotation:26,duration:.28,yoyo:true,repeat:Math.ceil(dd/.28),ease:'sine.inOut'},t0);tl.fromTo(`#${p}-legB`,{rotation:26},{rotation:-26,duration:.28,yoyo:true,repeat:Math.ceil(dd/.28),ease:'sine.inOut'},t0);
 tl.fromTo(`#${p}-arm2`,{rotation:16},{rotation:-16,duration:.28,yoyo:true,repeat:Math.ceil(dd/.28),ease:'sine.inOut'},t0);tl.fromTo(`#${p}-head`,{y:0},{y:-5,duration:.28,yoyo:true,repeat:Math.ceil(dd/.28),ease:'sine.inOut'},t0);
 tl.fromTo(`#${p}-wl`,{x:0},{x:-2700,duration:dd,ease:'none'},t0);
 [[1.5,1.38,3,6],[3.1,1.8,7,12],[4.6,2.3,12,18]].forEach(([d,sc,rot,hy])=>{tl.to(`#${p}-stone`,{scale:sc,duration:.45,ease:'back.out(2)'},t0+d+.12);tl.to(`#${p}-figw`,{rotation:rot,svgOrigin:'700 860',duration:.6,ease:'power2.out'},t0+d+.12);tl.to(`#${p}-head`,{x:hy*.5,duration:.6},t0+d+.12)});
 '''
s['build']=t[:a]+PBA+t[b:]
# ================= S05: candle tracker + improved guitar corner =================
s=ALL['s05']
t=s['build']; a=t.index("// v1 guitar"); b=t.index("// v2 phone + friend")
V01=r'''// intro: four candles = four things that will die
 const candle=(x,i,ic)=>`<g id="${p}-cd${i}"><g transform="translate(${x} 560)"><rect x="-16" y="0" width="32" height="92" rx="6" fill="#e9dfc8"/><rect x="-16" y="0" width="32" height="14" fill="#cfc4a8"/><path d="M0 0 L0 -12" stroke="#2a2a2a" stroke-width="3"/><g id="${p}-fl${i}"><ellipse cx="0" cy="-34" rx="30" ry="46" fill="url(#${p}-glow)" style="mix-blend-mode:screen"/><path d="M0 -62 C14 -40 12 -18 0 -8 C-12 -18 -14 -40 0 -62Z" fill="#ffcf7a"/><path d="M0 -44 C6 -30 5 -20 0 -14 C-5 -20 -6 -30 0 -44Z" fill="#fff4d0"/></g>${ic}</g></g>`;
 s+=`<g id="${p}-cs"><text id="${p}-ctl" x="960" y="330" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="92" letter-spacing="14" fill="#f4f0e8">WHAT DIES FIRST?</text>${candle(660,0,'<path d="M-18 -112 C-30 -150 -4 -170 6 -150 L26 -190" stroke="#b9855a" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="-14" cy="-100" r="18" fill="#b9855a"/>')}${candle(860,1,'<rect x="-16" y="-170" width="32" height="56" rx="7" fill="#7fa8ff"/>')}${candle(1060,2,'<path d="M-26 -108 L24 -108 Q34 -112 32 -128 L2 -146 L-18 -144Z" fill="#b8c4ff"/>')}${candle(1260,3,'<circle cx="0" cy="-140" r="26" fill="#ffd27a"/>')}</g>`;
 // v1 guitar corner: he watches it go out of tune
 s+=`<g id="${p}-v1" opacity="0" transform="translate(960 470) scale(.82) translate(-960 -500)"><rect width="1920" height="1080" fill="#0a0e1d"/><path d="M1180 0 L1180 1080" stroke="#05070e" stroke-width="30"/><rect x="1180" width="740" height="1080" fill="#070a16"/><rect x="0" y="900" width="1920" height="180" fill="#05070e"/><ellipse cx="860" cy="520" rx="640" ry="460" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".3" id="${p}-vg"/>
 <path d="M1200 100 Q1300 160 1320 300 M1200 100 Q1240 220 1210 340 M1200 100 Q1280 200 1290 250" stroke="#cfd6e6" stroke-width="2" fill="none" opacity=".4"/>
 <path d="M700 900 L760 700 M1020 900 L960 700" stroke="#2a2f4a" stroke-width="14" stroke-linecap="round"/>
 <ellipse cx="860" cy="660" rx="230" ry="260" fill="#6b3f26"/><ellipse cx="860" cy="660" rx="52" ry="52" fill="#120c0a"/><rect x="820" y="140" width="80" height="360" fill="#4f2e1c"/><rect x="800" y="90" width="120" height="70" rx="12" fill="#3a2216"/>
 ${[0,1,2,3,4,5].map(i=>`<g id="${p}-pg${i}" style="transform-box:fill-box;transform-origin:50% 50%"><circle cx="${815+i*18}" cy="100" r="7" fill="#d9b878"/><path d="M${815+i*18} 94 v12" stroke="#7a5a2a" stroke-width="3"/></g>`).join('')}
 <g id="${p}-strings">${[0,1,2,3,4,5].map(i=>`<path id="${p}-s${i}" d="M${826+i*14} 150 L${826+i*14} 720" stroke="#e8dcc0" stroke-width="3" fill="none"/>`).join('')}</g>
 ${manBack(p+'-mn',360,1040,1.0,{})}</g>`;
 '''
s['build']=t[:a]+V01+t[b:]
t=s['build']
t=t.replace('<g id="${p}-v2" opacity="0"','<g id="${p}-v2" opacity="0"',1)
s['build']=t
t=s['build']; a=t.index("const o={sag:0};"); b=t.index("const sw=(a,b,t)=>")
G=r'''const o={sag:0},snap={u:0};
 tl.fromTo(`#${p}-cs`,{scale:1,y:0,x:0,svgOrigin:'960 560'},{scale:1,y:0,duration:.01},0);[0,1,2,3].forEach(i=>{tl.fromTo(`#${p}-fl${i}`,{scaleY:.92,transformOrigin:'50% 100%'},{scaleY:1.1,duration:.19+i*.03,yoyo:true,repeat:Math.ceil(D/.2),ease:'sine.inOut'},i*.05)});
 tl.fromTo(`#${p}-ctl`,{opacity:0,y:16},{opacity:1,y:0,duration:.6},.2);
 tl.to(`#${p}-cs`,{scale:.4,y:-372,x:-520,duration:.8,ease:'power3.inOut'},t1-.4);tl.to(`#${p}-ctl`,{opacity:0,duration:.35},t1-.45);
 tl.to(`#${p}-v1`,{opacity:1,duration:.5},t1-.25);
 tl.to(o,{sag:1,duration:t2-t1+.2,ease:'power2.in',onUpdate:()=>{for(let i=0;i<6;i++){const sg=Math.min(1,Math.max(0,o.sag*1.3-i*.12));const x=826+i*14,sx=sg*(i%2?26:-30);const e=document.getElementById(`${p}-s${i}`);if(e&&!(i===2&&snap.u>0))e.setAttribute('d',`M${x} 150 Q${x+sx} 450 ${x} 720`)}}},t1);
 [0,1,2,3,4,5].forEach(i=>tl.to(`#${p}-pg${i}`,{rotation:-260-i*40,duration:t2-t1,ease:'power1.in'},t1+i*.1));
 tl.to(snap,{u:1,duration:.12,ease:'power3.in',onUpdate:()=>{const e=document.getElementById(`${p}-s2`);if(e)e.setAttribute('d',`M854 150 Q${854+70*snap.u} ${300+140*snap.u} ${854+20*snap.u} ${420+200*snap.u}`)}},t1+2.0);tl.to(`#${p}-s2`,{opacity:.35,duration:.4},t1+2.12);
 tl.to(`#${p}-vg`,{opacity:.06,duration:t2-t1+.2},t1);tl.to(`#${p}-mn`,{rotation:3,y:6,svgOrigin:'360 1040',duration:2.2,ease:'sine.inOut'},t1);
 [['cd0',t2-.25],['cd1',t3-.25],['cd2',t4-.25],['cd3',D-1.0]].forEach(([k,t])=>{tl.to(`#${p}-${k}`,{opacity:.28,duration:.45},t);tl.to(`#${p}-fl${k.slice(2)}`,{opacity:0,duration:.18},t)});
 '''
s['build']=t[:a]+G+t[b:]
s['build']=s['build'].replace("sw('v1','v2',t2-.2);","sw('v1','v2',t2-.2);",1)
s['build']=s['build'].replace("const sw=(a,b,t)=>{tl.to(`#${p}-${a}`,{opacity:0,duration:.45},t);","const sw=(a,b,t)=>{tl.to(`#${p}-${a}`,{opacity:0,duration:.45},t);",1)
S=list(ALL.values())
