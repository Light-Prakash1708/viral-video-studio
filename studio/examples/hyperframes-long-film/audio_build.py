import sys,json,subprocess,numpy as np
sys.path.insert(0,'/root/growkaz-stickman-studio/audio')
import anime_music as M, sfx as S
from scipy.io import wavfile
from scipy import signal
SR=48000; ROOT='/root/hf-inaction'
A={k:v['start'] for k,v in json.load(open(ROOT+'/anchors.json')).items()}
W=json.load(open(ROOT+'/words.json'))['words']
A['weeks']=A['number']+4.0; A['day14600']=A['forty']-1.7; A['pushup']=(A['onepage']+A['message'])/2
import re
sd=[w['start'] for w in W if re.sub(r'[^a-z]','',w['word'].lower())=='death' and 175<w['start']<200]; A['slowdeath1']=sd[0] if sd else 179.5; A['slowdeath2']=A.get('slowdeath2',230.7)
A['w0']=W[0]['start']; A['w3']=W[3]['start']
DUR=round(W[-1]['end']+2.4,2); N=int(DUR*SR); M.R=np.random.default_rng(7)
def kf(pts,t): return float(np.interp(t,[p[0] for p in pts],[p[1] for p in pts]))
def put(buf,x,t,g=1.0):
    i=int(t*SR)
    if i<0 or i>=len(buf): return
    x=x if x.ndim==2 else np.stack([x,x],1); n=min(len(x),len(buf)-i); buf[i:i+n]+=x[:n]*g
db=lambda d:10**(d/20)
import os
def RS(name,g=0.9):
    sr,x=wavfile.read(ROOT+'/sfx/'+name+'.wav'); x=x.astype(np.float32)/32768; x=x if x.ndim==2 else np.stack([x,x],1)
    m=np.abs(x).max(1); i=int(np.argmax(m>0.02)); x=x[i:]; return (x/(np.abs(x).max()+1e-9)*g).astype(np.float32)
def LOOP(x,d,fade=.4):
    n=int(d*SR); f=int(fade*SR); out=np.zeros((n,2),np.float32); pos=0; ramp=np.linspace(0,1,f)[:,None]
    while pos<n:
        seg=x.copy(); seg[:f]*=ramp; seg[-f:]*=ramp[::-1]; j=min(n,pos+len(seg)); out[pos:j]+=seg[:j-pos]; pos+=len(seg)-f
    return out

mus=np.zeros((N,2),np.float32)
def nz(d,seed=1): return np.random.default_rng(seed).standard_normal(int(d*SR))
def SWELL(d,lo=180,hi=2600,seed=3):
    t=M.T(d); u=t/d; x=M.bp(nz(d,seed),lo,hi)*(u**2.4); sub=np.sin(2*np.pi*55*t)*u**2*0.5; return (((x*1.2+sub))*np.minimum(1,(d-t)*30)).astype(np.float32)

MIN=[(45,[57,60,64]),(41,[53,57,60]),(48,[55,60,64]),(43,[55,59,62])]; MAJ=[(48,[60,64,67]),(43,[59,62,67]),(45,[60,64,69]),(41,[60,65,69])]
PAD=[(0,0),(9,.15),(20,.4),(40,.4),(49,.1),(50.5,0),(53,.35),(86,.45),(114,.3),(135,.5),(155,.55),(172,.4),(176,.12),(180,.55),(182,.6),(200,.75),(225,.7),(234,.9),(237,1.0),(243,.0)]
PNO=[(0,0),(11,0),(12,.5),(40,.55),(49,.25),(54,.5),(113,.45),(135,.5),(154,.4),(176,.2),(181,.6),(200,.75),(225,.65),(234.5,0),(237,.7),(243,.3)]
CEL=[(0,0),(20,0),(39,.35),(49,.35),(50.5,0),(54,.45),(154,.6),(176,.2),(182,.55),(235,.9),(243,0)]
bar=4.0
for b in range(int(DUR/bar)+1):
    t0=b*bar; prog=MAJ if t0>=A['procrast']+0.0 else MIN; root,ch=prog[b%4]
    pa=kf(PAD,t0)
    if pa>.01: put(mus,M.pad(ch,bar+.8)*0.9,t0,pa*.55)
    ce=kf(CEL,t0)
    if ce>.01:
        tt=M.T(bar+.6); f=M.midi(root+12); x=sum(np.sin(2*np.pi*f*k*tt+0.9*np.sin(2*np.pi*5.2*tt)*0.002*k)/k for k in range(1,6)); x=M.lp(x,900)*np.minimum(1,tt/.6)*np.minimum(1,(bar+.6-tt)/.9); put(mus,x*0.18,t0,ce)
    pn=kf(PNO,t0)
    if pn>.01:
        dens=1.0 if (t0>=A['procrast'] or 54<t0<114) else 0.5
        for s in range(8):
            if dens<1 and s%2: continue
            tn=t0+s*.5; n=ch[(s*(2 if t0>=A['procrast'] else 1))%3]+(12 if s%4==3 else 0)
            put(mus,M.pluck(M.midi(n+12),2.6)*0.5,tn,pn*(0.7+0.3*(s%2==0)))
    put(mus,np.stack([np.sin(2*np.pi*M.midi(root-12)*M.T(bar+.5))*np.minimum(1,M.T(bar+.5)/1.0)*np.minimum(1,(bar+.5-M.T(bar+.5))/1.2)]*2,1)*0.22,t0,kf(PAD,t0)*.6+.1) if False else None
# sub drone + heartbeat + ticks
tt=M.T(DUR); drone=np.sin(2*np.pi*55*tt)*0.5+np.sin(2*np.pi*82.4*tt)*0.18; drone*=np.interp(tt,[0,6,40,86,181,236,DUR],[0.0,.07,.1,.1,.1,.12,0]); put(mus,drone.astype(np.float32),0,1.0)
def beat(buf,t,g):
    for dt,f,gg in ((0,62,1.0),(.28,54,.6)):
        x=np.sin(2*np.pi*np.cumsum(f*(1+1.6*np.exp(-M.T(.5)*40)))/SR)*np.exp(-M.T(.5)*11); put(buf,x.astype(np.float32),t+dt,g*gg)
for t in np.arange(A['number']+.5,A['day14600']-1,1.15): beat(mus,t,.55)
for t in np.arange(A['close']-.2,A['slowdeath2']-.4,1.0): beat(mus,t,.6*(1+(t-A['close'])/8))
# music hits
def hit(t,g=1.0): put(mus,M.impact()*0.6,t,g)
riser=lambda t0,d,g=.6: put(mus,SWELL(d,150,2400,5)*0.9,t0,g)
riser(A['thousand_tomorrows'],2.9); hit(A['starts_small']-.1,.5); hit(A['masks']-.3,.35); riser(A['slowdeath1']-3.5,3.5,.55); hit(A['slowdeath1']+.1,1.0)
hit(A['procrast']-.1,.9); riser(A['spell']-3.5,3.5,.7); hit(A['spell']+.05,1.2); riser(A['breath']-2.5,2.5,.7); hit(A['breath']-.05,.9); hit(A['today'],.7)
mus=M.verb(mus[:,0],2.2,.28); mus=np.stack([mus,np.roll(mus,int(.011*SR))*.95],1)
mus/= (np.abs(mus).max()+1e-9); mus*=0.8
# ---------- sfx
fx=np.zeros((N,2),np.float32); T=M.T
def boom():
    t=T(2.2); f=40+55*np.exp(-t*7); sy=np.tanh((np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*1.7)+0.35*M.lp(nz(2.2,2),180)*np.exp(-t*9))*1.6).astype(np.float32); rb=RS('boom',0.8); out=np.zeros((len(sy),2),np.float32); out+=sy[:,None]*0.8; out[:min(len(out),len(rb))]+=rb[:len(out)]*0.9; return out
def cloth(d=.4,seed=4):
    t=T(d); sy=(M.bp(nz(d,seed),300,2600)*np.sin(np.pi*t/d)**1.5).astype(np.float32); rc=RS('cloth',0.7); n=int(d*SR); r=rc[:n] if len(rc)>=n else np.pad(rc,((0,n-len(rc)),(0,0))); r=r*np.sin(np.pi*np.arange(len(r))/len(r))[:,None]; return (np.stack([sy,sy],1)*0.6+r*0.9).astype(np.float32)
def thud(): t=T(.5); return np.tanh((np.sin(2*np.pi*np.cumsum(75*np.exp(-t*14)+38)/SR)*np.exp(-t*10)+0.3*M.lp(nz(.5,5),500)*np.exp(-t*30))*1.4).astype(np.float32)
def tock(f=220,seed=6): t=T(.12); return (np.sin(2*np.pi*f*t)*np.exp(-t*60)+0.5*M.bp(nz(.12,seed),900,2800)*np.exp(-t*90)).astype(np.float32)
def slide(d=.8,seed=7): t=T(d); return (M.bp(nz(d,seed),160,1400)*np.sin(np.pi*t/d)**.7*0.8).astype(np.float32)
def paper_synth(d=.5,seed=8): t=T(d); return (M.hp(nz(d,seed),1800)*(np.abs(np.sin(t*95))>.6)*np.exp(-t*5)*0.5).astype(np.float32)
def paper(d=.5,seed=8): return RS('paper',.9)
def chain_synth(seed=9): t=T(1.0); x=sum(np.sin(2*np.pi*f*t)*np.exp(-t*(7+k*3)) for k,f in enumerate([420,1160,2290,3740]))*0.3+M.bp(nz(1.0,seed),1500,6000)*np.exp(-t*70)*0.7; return np.tanh(x*1.5).astype(np.float32)
def chain(seed=9): return RS('chain',0.95)
def creak(d=1.4,seed=10):
    t=T(d); f=140+55*np.sin(2*np.pi*3.2*t)*np.exp(-t*.8)+(t/d)*30; x=(np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.5+M.bp(nz(d,seed),200,1200)*0.7)*np.minimum(1,t*10)*np.minimum(1,(d-t)*4)*0.35; return M.lp(x,1800).astype(np.float32)
def breathout(d=.9,seed=11): t=T(d); return (M.bp(nz(d,seed),500,3200)*np.sin(np.pi*t/d)**2*.5).astype(np.float32)
def F(arr,t,g): put(fx,arr,t,db(g))
def E(name,t,g=-12,**kw): put(fx,S.make(name,**kw),t,db(g))
a_=lambda k: A[k]
# clock bed + hook
for t in np.arange(.5,A['day_one']-.4,1.0): E('tick',t,-26,seed=int(t))
F(SWELL(1.6,200,1800,2),A['w0']-.9,-24); F(boom(),A['w3'],-9); F(SWELL(2.9,150,2600,4),A['thousand_tomorrows'],-16); F(boom(),A['day_one']-.1,-12)
# every scene start: a soft low hit + cloth (keeps energy up, no chimes)
for k in ['trick','day30','dies_first','day365','masks','science','number','day14600','procrast','seed','dayone_plan','close']: F(boom(),A[k]-.05,-20); F(cloth(.5,3),A[k]-.3,-27)
for k in ('day_one','day30','day365','day14600','dayone_plan'): F(tock(170),A[k],-15)
for i,k in enumerate(('book','body','apology')): F(paper(.4,i+1),A[k]-.05,-19); F(tock(200+i*20),A[k]+.1,-20)
E('hum',A['tired'],-24,dur=2.5); F(SWELL(1.8,120,900,6),A['tired'],-22); F(SWELL(2.6,200,1800,7),A['tomorrow_better'],-24)
for k in ('energy','time','person'): F(tock(260),A[k],-19); F(cloth(.45,hash(k)%9),A[k]-.15,-27)
F(tock(150),A['person']+1.9,-13); F(boom(),A['person']+1.95,-22)
F(SWELL(2.2,200,1600,8),A['better_version'],-24); F(boom(),A['never_arrives'],-9); F(creak(1.6),A['never_arrives']+.3,-18); put(fx,LOOP(RS('wind',.8),4.4),A['never_arrives']-.4,db(-20))
for i,t in enumerate(np.arange(A['weight']-.3,A['dies_first']+.2,.98)): F(RS('steps',.8),t,-14)
for o,g in ((1.65,-17),(3.25,-15),(4.75,-12)): F(thud(),A['weight']-.3+o,g); F(cloth(.5,int(o*10)),A['weight']-.3+o-.15,-24)
def twang_synth():
    t=M.T(1.2); f=330*(1+.06*np.exp(-t*30)); return np.tanh((np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*5)+.3*M.bp(nz(1.2,12),900,4000)*np.exp(-t*40))*1.2).astype(np.float32)
F(RS('guitar',.9),A['guitar']+.15,-14); F(tock(310,3),A['guitar']+.4,-24); F(tock(290,4),A['guitar']+.9,-25); F(tock(270,5),A['guitar']+1.5,-26)
for t in (A['friend']-.25,A['bodyasks']-.25,A['dream']-.25): F(breathout(.5,int(t)),t,-26); F(cloth(.25,int(t)+1),t,-28)
F(breathout(.5,77),A['dream']+6.2,-26)
tg=M.T(2.6); f=330*np.exp(-tg*.25)*(1+.02*np.sin(2*np.pi*6*tg)); g_=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tg*1.2); put(fx,(g_*0.3).astype(np.float32),A['guitar']+.3,1.0)
E('phonebuzz',A['friend'],-22)
for o in (.2,1.0,1.9): F(tock(300,int(o*10)),A['friend']+o,-20)
for i,(d,h) in enumerate(((.2,1),(1.0,1),(1.8,1))):
    t=A['bodyasks']+d; F(cloth(.4,20+i),t,-20+i*2); F(thud(),t+.78,-13+i*2); F(RS('heart',.8),t,-20+i*2)
E('hum',A['bodyasks'],-30,dur=3.0)
F(SWELL(3.0,120,1200,9),A['dream']+.5,-24); F(RS('drawer',.9),A['dream']+3.6,-13); F(tock(140),A['dream']+4.4,-22); E('hum',A['dream']+5.5,-32,dur=2.0)
for i in range(12): E('swish',A['day365']+4.8+i*.26,-19,seed=i)
for k in ('research','right_time','monday','notready'): F(tock(240,hash(k)%50),A[k]-.1,-17)
for i in range(4): F(tock(190,i),A['notready']+2.7+i*.15,-20)
F(boom(),A['ready_isnt']+.3,-12)
for i in range(7): F(tock(90+i*35,i),A['ready_isnt']+.3+i*.11,-17-i)
F(thud(),A['ready_isnt']+.9,-16); F(SWELL(4.0,150,1500,10),A['ready_isnt']+.6,-22)
F(SWELL(2.2,300,3000,11),A['scanned']-.2,-22); F(tock(260),A['scanned']+.6,-21); F(tock(240),A['science']+1.2,-21); F(cloth(.6,12),A['handing'],-19); F(thud(),A['handing']+1.5,-19); F(tock(200),A['answer'],-16); F(boom(),A['answer'],-19)
F(SWELL(3.0,200,2400,13),A['number']+.6,-22); F(boom(),A['weeks'],-14)
for base in (A['thirty'],A['fifty']):
    for i in range(9): F(tock(150+i*18,i),base+i*(.32-i*.02),-22)
F(boom(),A['notfree'],-8); F(chain(),A['notfree'],-19)
E('buzz',A['day14600']+3.2,-27,dur=1.5); F(breathout(1.0,3),A['older']+1.0,-24); F(tock(130),A['older']+2.6,-26)
tc=A['regret']+3.6
for i in range(3):
    t=tc+.5+i*1.55; F(cloth(.35,30+i),t,-19); F(cloth(.5,40+i),t+.3,-23); F(thud(),t+1.05,-13+i)
put(fx,LOOP(RS('wind',.8),7.0),A['regret'],db(-26))
F(SWELL(1.6,300,2500,14)[::-1].copy(),A['failure_fades']-.3,-22)
F(SWELL(3.8,60,420,15),A['silence'],-17); F(boom(),A['slowdeath1']+.1,-6); F(boom(),A['slowdeath1']+.12,-9); F(tock(100),A['slowdeath1']+.5,-14)
F(boom(),A['wall'],-13)
for r in range(5): F(thud(),A['wall']+2.6+(4-r)*.12,-21-r)
F(tock(210),A['small']-1.4,-18)
for k in ('onepage','pushup','message'): F(tock(210,hash(k)%30),A[k]-.3,-17); F(tock(170,hash(k)%30+1),A[k]+1.1,-18)
F(cloth(.5,50),A['pushup']+.1,-18); F(thud(),A['pushup']+.5,-19); F(breathout(.8,5),A['pushup']+.6,-22)
F(SWELL(2.6,200,3000,16),A['spell']-1.4,-20); F(chain(),A['spell']+.05,-8); F(boom(),A['spell']+.05,-6); F(cloth(.8,51),A['spell']+.1,-14)
F(tock(130),A['seed']+.8,-17); F(thud(),A['seed']+.8,-24); F(SWELL(2.4,300,2200,17),A['seed']+1.2,-26)
F(tock(150),A['evennow']+.3,-15); F(cloth(.6,52),A['evennow'],-22); F(SWELL(3.0,200,1600,18),A['stillworks'],-24)
for t in np.arange(A['close']+.8,A['slowdeath2']+.5,1.0): E('tick',t,-18,seed=int(t))
F(boom(),A['slowdeath2'],-8)
bt=M.T(1.1); br=M.bp(np.random.default_rng(3).standard_normal(len(bt)),400,2400)*np.sin(np.pi*bt/1.1)**2; put(fx,(br*.5).astype(np.float32),A['breath']-1.0,db(-18))
F(SWELL(2.5,150,2200,19),A['breath']-2.5,-20); F(boom(),A['today'],-8); F(SWELL(2.8,150,1800,20)[::-1].copy(),A['today']+.1,-24)
put(fx,LOOP(RS('wind',.8),9.0),2.0,db(-30)); E('hum',A['dayone_plan'],-28,dur=14.0)
# ---------- voice + ducking + master
sr,v=wavfile.read(ROOT+'/voice.wav'); v=v.astype(np.float32)/32768; voice=np.zeros(N,np.float32); voice[:min(N,len(v))]=v[:N]
env=np.sqrt(np.convolve(voice**2,np.ones(int(.05*SR))/int(.05*SR),'same')); act=(env>.012).astype(np.float32)
b,a=signal.butter(1,3.0/(SR/2)); duck=signal.filtfilt(b,a,act); duck=np.clip(duck*1.6,0,1)
musg=db(-27)*(1-duck*(1-db(-8.5)))
for t0_,t1_ in [(A['never_arrives']-.5,A['never_arrives']+.3),(A['dying_loud']+.9,A['dying_loud']+2.4),(A['failure_fades']-.2,A['failure_fades']+2.0),(A['today']-.6,A['today']-.05),(A['slowdeath1'],A['slowdeath1']+.8)]:
    w_=np.zeros(N,np.float32); w_[int(t0_*SR):int(t1_*SR)]=1; w_=signal.filtfilt(*signal.butter(1,6.0/(SR/2)),w_); musg=musg*(1-np.clip(w_,0,1)*.88)
musg=musg[:,None]
fxg=(1-duck*(1-db(-5)))[:,None]*db(-3)
out=np.stack([voice,voice],1)*db(0)+mus*musg+fx*fxg
open(ROOT+'/mix_raw.f32','wb').write(out.astype(np.float32).tobytes())
wavfile.write(ROOT+'/mix_raw.wav',SR,(np.clip(out,-1,1)*32767).astype(np.int16))
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',ROOT+'/mix_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000',ROOT+'/mix.wav'],check=True)
print('mix done',DUR)
