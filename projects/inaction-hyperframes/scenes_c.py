S=[]
# ---------------- S11 THE TURN ----------------
S.append(dict(id='s11',start='procrast',end='seed',fi=.7,fo=.6,build=r'''
function build(){let s=`<rect width="1920" height="1080" fill="#070a14"/><rect id="${p}-warm" width="1920" height="1080" fill="url(#${p}-dawn)" opacity="0"/>`;
 s+=`<g id="${p}-wall">`;for(let r=0;r<6;r++)for(let c=0;c<10;c++){const off=r%2?88:0,x=80+c*176-off;if(x<-100||x>1840)continue;s+=`<rect id="${p}-b${r}-${c}" class="${p}-brick r${r}" x="${x+4}" y="${150+r*116+4}" width="168" height="108" rx="6" fill="${r===5?'#4a3a22':'#1d2340'}" stroke="${r===5?'#ffb24a':'#2b3460'}" stroke-width="3"/>`}s+=`</g>`;
 s+=`<g id="${p}-lblw" opacity="0"><text x="960" y="96" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="46" letter-spacing="10" fill="#ff5a4d">THE WALL</text></g>`;
 s+=`<g id="${p}-first" opacity="0"><rect x="560" y="300" width="800" height="150" rx="40" fill="#2a1d0e" stroke="#ffb24a" stroke-width="6"/><text x="960" y="396" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="76" letter-spacing="8" fill="#ffb24a">FIRST 5 MINUTES</text></g>`;
 const card=(i,x,t,sub)=>`<g id="${p}-c${i}" opacity="0"><rect x="${x-190}" y="340" width="380" height="440" rx="36" fill="#121832" stroke="#2c3b6e" stroke-width="4"/>${sub}<text x="${x}" y="712" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="44" letter-spacing="5" fill="#f4f0e8">${t}</text><circle id="${p}-ck${i}" cx="${x+150}" cy="390" r="30" fill="#35e08a" opacity="0"/><path d="M${x+136} 390 l10 12 l20 -24" stroke="#07140d" stroke-width="7" fill="none" opacity="0" id="${p}-cm${i}"/></g>`;
 s+=card(0,480,'ONE PAGE',`<rect x="380" y="400" width="200" height="250" rx="8" fill="#efe6d4"/><path id="${p}-ln" d="M405 470 L555 470" stroke="#3a3a55" stroke-width="5" stroke-dasharray="150" stroke-dashoffset="150"/><path d="M405 520 L520 520 M405 565 L545 565" stroke="#cfc6b0" stroke-width="4"/>`);
 s+=card(1,960,'ONE PUSH-UP',`<g stroke="#e8eeff" stroke-width="14" stroke-linecap="round" fill="none"><path id="${p}-pu" d="M830 560 L930 520 L1090 560"/><circle cx="1105" cy="535" r="24" fill="#e8eeff"/></g><path d="M800 620 H1120" stroke="#2c3b6e" stroke-width="6"/>`);
 s+=card(2,1440,'ONE MESSAGE',`<rect x="1350" y="390" width="180" height="270" rx="26" fill="#0c1022" stroke="#7fa8ff" stroke-width="5"/><g id="${p}-sent" opacity="0"><rect x="1370" y="520" width="140" height="56" rx="20" fill="#3a6aff"/><text x="1440" y="558" text-anchor="middle" font-family="Inter" font-weight="700" font-size="22" fill="#fff">Hi 👋</text></g>`);
 s+=`<g id="${p}-chain" opacity="0">${Array.from({length:7},(_,i)=>`<g transform="translate(${190+i*257} 230)"><rect x="-110" y="-46" width="220" height="92" rx="46" fill="#0c1022" stroke="#6b7390" stroke-width="8"/><text x="0" y="12" text-anchor="middle" font-family="Inter" font-weight="800" font-size="22" letter-spacing="4" fill="#8a92b0">TOMORROW</text></g>`).join('')}</g>`;
 s+=`<rect id="${p}-fl" width="1920" height="1080" fill="#fff" opacity="0"/>`;
 return s+dust(p,22,19,0,100,1920,800,'#ffe2b0')}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.07,x1:-20});
 tl.fromTo(`#${p}-wall`,{opacity:0,y:30},{opacity:1,y:0,duration:.9},.3);tl.to(`#${p}-lblw`,{opacity:1,duration:.5},A.wall-1.0);
 const tr=A.wall+2.6;for(let r=0;r<5;r++)document.querySelectorAll(`.${p}-brick.r${r}`).forEach((b,i)=>{const rr=RND(r*13+i);tl.to(b,{y:-240-rr()*500,x:(rr()-.5)*300,rotation:(rr()-.5)*60,opacity:0,duration:1.2,ease:'power2.in'},tr+(4-r)*.12+rr()*.25)});
 tl.to(`#${p}-lblw`,{opacity:0,duration:.4},tr);tl.to(`#${p}-wall`,{opacity:0,duration:.7},A.small-1.2);tl.fromTo(`#${p}-first`,{opacity:0,scale:.8,transformOrigin:'960px 375px'},{opacity:1,scale:1,duration:.6,ease:'back.out(1.8)'},A.small-1.4);tl.to(`#${p}-first`,{opacity:0,duration:.5},A.small+.6);
 [[0,A.onepage],[1,A.pushup],[2,A.message]].forEach(([i,t])=>{tl.fromTo(`#${p}-c${i}`,{opacity:0,y:50},{opacity:1,y:0,duration:.6,ease:'back.out(1.7)'},t-.3);tl.fromTo(`#${p}-ck${i}`,{opacity:0,scale:.2,transformOrigin:`${[630,1110,1590][i]}px 390px`},{opacity:1,scale:1,duration:.35,ease:'back.out(3)'},t+1.0);tl.to(`#${p}-cm${i}`,{opacity:1,duration:.2},t+1.15)});
 tl.to(`#${p}-ln`,{attr:{'stroke-dashoffset':0},duration:.9},A.onepage+.2);tl.to(`#${p}-pu`,{attr:{d:'M830 590 L930 580 L1090 590'},duration:.5,yoyo:true,repeat:1,ease:'power2.inOut'},A.pushup+.1);tl.fromTo(`#${p}-sent`,{opacity:0,y:30},{opacity:1,y:0,duration:.4},A.message+.3);
 tl.to([`#${p}-c0`,`#${p}-c1`,`#${p}-c2`],{opacity:0,duration:.5},A.spell-1.2);
 tl.fromTo(`#${p}-chain`,{opacity:0},{opacity:1,duration:.6},A.spell-1.1);tl.to(`#${p}-chain`,{x:'-=0',duration:.01},A.spell);
 tl.to(`#${p}-fl`,{opacity:.7,duration:.08,yoyo:true,repeat:1},A.spell+.1);tl.to(`#${p}-chain`,{y:-120,opacity:0,rotation:-4,duration:.9,ease:'power2.in'},A.spell+.15);tl.to(`#${p}-warm`,{opacity:.85,duration:2.2},A.spell+.1);
 driftDust(tl,p,D,50);fade(tl,p,D,.7,.6)}
'''))
# ---------------- S12 THE SEED ----------------
S.append(dict(id='s12',start='seed',end='dayone_plan',fi=.6,fo=.5,build=r'''
function build(){let s=`<rect width="1920" height="1080" fill="url(#${p}-dawn)"/><circle cx="960" cy="560" r="420" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".7"/><rect x="0" y="640" width="1920" height="440" fill="#24160d"/><rect x="0" y="640" width="1920" height="24" fill="#3a2414"/>`;
 s+=`<g stroke="#4a2f1c" stroke-width="3" fill="none" opacity=".7">${Array.from({length:22},(_,i)=>`<path d="M${i*92} 700 q20 60 -10 130"/>`).join('')}</g>`;
 s+=`<g id="${p}-seed"><ellipse id="${p}-sa" cx="940" cy="790" rx="26" ry="38" fill="#6a4426" transform="rotate(-18 940 790)"/><ellipse id="${p}-sb" cx="980" cy="790" rx="26" ry="38" fill="#8a5a32" transform="rotate(18 980 790)"/></g>`;
 s+=`<path id="${p}-stem" d="M960 760 C958 680 970 600 960 500" stroke="#7bd88f" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="270" stroke-dashoffset="270"/>`;
 s+=`<g id="${p}-lv" opacity="0"><path d="M960 540 C900 520 860 540 840 580 C890 590 930 580 960 540Z" fill="#7bd88f"/><path d="M962 520 C1020 490 1070 500 1090 540 C1040 560 995 550 962 520Z" fill="#9be8a5"/></g>`;
 return s+dust(p,30,23,200,100,1500,700,'#fff0c8')}
function anim(tl){cam(tl,p,D,{s0:1.12,s1:1.0,x1:0,y0:-20,y1:10});
 tl.to(`#${p}-sa`,{x:-14,rotation:-34,svgOrigin:'940 790',duration:.9},.5);tl.to(`#${p}-sb`,{x:14,rotation:34,svgOrigin:'980 790',duration:.9},.5);
 tl.to(`#${p}-stem`,{attr:{'stroke-dashoffset':0},duration:2.6,ease:'power2.out'},1.0);tl.fromTo(`#${p}-lv`,{opacity:0,scale:.2,transformOrigin:'960px 540px'},{opacity:1,scale:1,duration:1.4,ease:'back.out(1.7)'},3.0);
 driftDust(tl,p,D,50);fade(tl,p,D,.6,.5)}
'''))
# ---------------- S13 DAY ONE (DAWN) ----------------
S.append(dict(id='s13',start='dayone_plan',end='close',fi=.6,fo=.6,build=r'''
function build(){let s=roomBack(p,{dawn:true});
 s+=noteSvg(p+'-n1',330,300,-4,'WRITE','THE BOOK')+noteSvg(p+'-n2',500,400,3,'GET','STRONG','#8fd0a8')+noteSvg(p+'-n3',660,290,-2,'SAY','SORRY','#f2a0a0');
 s+=`<path d="M1150 580 L700 790 L1260 790 L1710 580Z" fill="url(#${p}-cone)" style="mix-blend-mode:screen" opacity=".55"/>`;
 s+=`<g id="${p}-young">`+manBack(p+'-man',880,835,1.3,{rim:'#ffd089'})+`</g><g id="${p}-oldg" opacity="0">`+manBack(p+'-oman',880,835,1.3,{old:true,hair:'#d6d6de',body:'#3a3f5a',rim:'#ffd089'})+`</g>`;
 s+=roomFront(p)+`<path d="M690 776 L860 752 L1030 776 L860 792Z" fill="#f4ead2"/><path id="${p}-ink" d="M770 768 L770 768" stroke="#2a2f4a" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="860" cy="764" rx="210" ry="34" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity=".8"/>`;
 s+=`<g id="${p}-sp" opacity="0"><path id="${p}-spst" d="M1080 770 C1078 730 1086 690 1080 650" stroke="#7bd88f" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="130" stroke-dashoffset="130"/><path d="M1080 690 C1040 676 1018 690 1006 716 C1040 722 1066 714 1080 690Z" fill="#7bd88f"/><path d="M1082 672 C1120 652 1150 660 1160 686 C1128 700 1100 692 1082 672Z" fill="#9be8a5"/></g>`;
 return s+dust(p,34,24,300,150,1300,700,'#ffe9bd')+`<rect id="${p}-bloom" width="1920" height="1080" fill="#ffd089" opacity="0" style="mix-blend-mode:screen"/>`}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.14,x1:-70});
 [['n1',.2],['n2',.4],['n3',.6]].forEach(([k,t])=>tl.fromTo(`#${p}-${k}`,{opacity:0},{opacity:1,duration:.6},t));
 tl.fromTo(`#${p}-sun`,{y:90},{y:-110,duration:D,ease:'none'},0);tl.to(`#${p}-light`,{opacity:.35,duration:.5},0);
 tl.to(`#${p}-ink`,{attr:{d:'M770 768 q30 -16 60 0 t60 0 t60 0 t40 -4'},duration:3.2,ease:'none'},.6);
 tl.to(`#${p}-man`,{rotation:1.6,svgOrigin:'880 835',duration:2.2,ease:'sine.inOut',yoyo:true,repeat:3},.8);
 tl.to(`#${p}-young`,{opacity:.35,duration:.9},A.evennow);tl.to(`#${p}-oldg`,{opacity:1,duration:.9},A.evennow);tl.to(`#${p}-light`,{opacity:.9,duration:.8},A.evennow+.3);
 tl.to(`#${p}-young`,{opacity:.7,duration:.8},A.stillworks);tl.to(`#${p}-sp`,{opacity:1,duration:.3},A.stillworks);tl.to(`#${p}-spst`,{attr:{'stroke-dashoffset':0},duration:1.8},A.stillworks);
 tl.to(`#${p}-bloom`,{opacity:.28,duration:1.4,ease:'power1.in'},D-2.2);
 driftDust(tl,p,D,50);fade(tl,p,D,.6,.6)}
'''))
# ---------------- S14 FINALE ----------------
S.append(dict(id='s14',start='close',end='END',fi=.6,fo=1.2,build=r'''
function build(){let s=`<rect width="1920" height="1080" fill="#04050a"/><circle id="${p}-bg" cx="960" cy="520" r="900" fill="url(#${p}-glow)" style="mix-blend-mode:screen" opacity="0"/>`;
 s+=`<g id="${p}-timer"><circle cx="960" cy="470" r="230" fill="none" stroke="#1c2340" stroke-width="16"/><circle id="${p}-ring" cx="960" cy="470" r="230" fill="none" stroke="#ffb24a" stroke-width="16" stroke-linecap="round" stroke-dasharray="1445" stroke-dashoffset="0" transform="rotate(-90 960 470)"/><text id="${p}-tm" x="960" y="505" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="150" fill="#f4f0e8" letter-spacing="6">5:00</text></g>`;
 s+=`<text id="${p}-red" x="960" y="840" text-anchor="middle" font-family="Playfair Display" font-weight="700" font-size="56" fill="#ff4d4d" opacity="0" letter-spacing="3">Inaction is slow death.</text>`;
 s+=`<circle id="${p}-br0" cx="960" cy="470" r="260" fill="none" stroke="#ffd089" stroke-width="6" opacity="0"/><circle id="${p}-br1" cx="960" cy="470" r="260" fill="none" stroke="#ffb24a" stroke-width="4" opacity="0"/><g id="${p}-d1" opacity="0"><text x="960" y="520" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="300" fill="#fff4dc" letter-spacing="24">DAY 1</text></g><text id="${p}-ttl" x="960" y="660" text-anchor="middle" font-family="Playfair Display" font-weight="700" font-size="60" fill="#ffb24a" letter-spacing="14" opacity="0">INACTION.</text>`;
 return s+dust(p,26,25,0,100,1920,800,'#ffe2b0')}
function anim(tl){cam(tl,p,D,{s0:1.0,s1:1.09,x1:0});
 const o={t:300};const tm=document.getElementById(`${p}-tm`);
 tl.fromTo(`#${p}-timer`,{opacity:0},{opacity:1,duration:.6},A.five-3.2);
 tl.to(o,{t:0,duration:A.slowdeath2-A.five+3,ease:'none',onUpdate:()=>{const s=Math.round(o.t);tm.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}},A.five-2.6);
 tl.to(`#${p}-ring`,{attr:{'stroke-dashoffset':1445},duration:A.slowdeath2-A.five+3,ease:'none'},A.five-2.6);
 tl.fromTo(`#${p}-red`,{opacity:0,y:14},{opacity:1,y:0,duration:.5},A.slowdeath2);tl.to(`#${p}-red`,{opacity:0,duration:.4},A.breath-.3);
 tl.to(`#${p}-timer`,{opacity:0,duration:.6},A.breath-.5);tl.to(`#${p}-bg`,{opacity:.9,duration:2.0,ease:'power1.in'},A.breath-.3);
 [0,.9].forEach((d,i)=>{tl.fromTo(`#${p}-br${i}`,{opacity:.9,scale:.3,transformOrigin:'960px 470px'},{opacity:0,scale:2.4,duration:1.6,ease:'power2.out'},A.breath+d)});tl.fromTo(`#${p}-d1`,{opacity:0,scale:.92,transformOrigin:'960px 440px'},{opacity:1,scale:1,duration:1.0,ease:'power2.out'},A.today);
 tl.to(`#${p}-ttl`,{opacity:.95,duration:1.0},A.today+1.0);
 driftDust(tl,p,D,40);fade(tl,p,D,.6,.8)}
'''))
