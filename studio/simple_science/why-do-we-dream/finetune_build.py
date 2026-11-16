import json,subprocess,re
from PIL import Image
D=58.1; A='/root/growkaz-stickman-studio/projects/your-name-swap/audio'
# bottom gradient (cinematic + hides old captions)
g=Image.new('RGBA',(1080,1920),(0,0,0,0)); px=g.load()
for y in range(1920):
    a=0 if y<1300 else min(215,int((y-1300)/200*215)); 
    if y<300: a=max(a,int((300-y)/300*150))
    for x in range(1080): px[x,y]=(4,4,14,a)
g.save('grad.png')
# captions
W=json.load(open('words.json'))
KEY=set('brain wild fly fall exam movies dark 1953 rem dreaming random noise clue 2010 harvard maze nap improved most memories emotions danger truth tonight work still'.split())
def ts(t): h=int(t//3600); m=int(t%3600//60); s=t%60; return f"{h}:{m:02d}:{s:05.2f}"
ch=[];cur=[]
for w in W:
    cur.append(w); txt=' '.join(x['w'] for x in cur)
    if len(cur)>=3 or len(txt)>13 or re.search(r'[.,?!:]$',w['w']): ch.append(cur); cur=[]
if cur: ch.append(cur)
ev=[]
for i,c in enumerate(ch):
    s=c[0]['s']; e=ch[i+1][0]['s'] if i+1<len(ch) else D; e=min(e,c[-1]['e']+0.6)
    parts=[]
    for x in c:
        t=x['w'].upper(); k=re.sub(r'[^a-z0-9]','',x['w'].lower())
        parts.append(r'{\c&H00D7FF&}'+t+r'{\c&HFFFFFF&}' if k in KEY else t)
    ev.append(f"Dialogue: 0,{ts(s)},{ts(e)},Cap,,0,0,0,,"+r"{\pos(540,1560)\fscx72\fscy72\t(0,90,\fscx108\fscy108)\t(90,170,\fscx100\fscy100)}"+' '.join(parts))
open('cap.ass','w').write(f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Inter Black,96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,1,0,0,0,100,100,0,0,1,8,4,5,60,60,0,1
Style: Hook,Inter Black,90,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,1,0,0,0,100,100,0,0,1,9,5,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 1,0:00:00.05,0:00:02.90,Hook,,0,0,0,,{{\\pos(540,250)\\fad(80,200)\\fscx60\\fscy60\\t(0,140,\\fscx100\\fscy100)}}WHY DO WE{{\\c&H00D7FF&}} DREAM?
""" + '\n'.join(ev)+'\n')
P=[0,6.23,7.43,13.0,19.77,22.57,26.23,36.47,38.4,40.2,42.13,47.93,51.77]
z='0.03*t/58+'+'+'.join(f"if(gte(t,{T}),0.06*exp(-3.5*(t-{T})),0)" for T in P)
fl=''.join(f",drawbox=x=0:y=0:w=iw:h=ih:color=white@0.35:t=fill:enable='between(t,{T},{T+0.06})'" for T in P[1:])
v=("[0:v]split[a][b];[b]crop=1080:500:0:1260,boxblur=28:3,eq=saturation=0.4[bb];[a][bb]overlay=0:1260[c];[c][1:v]overlay=0:0,"
   f"scale=w='2*trunc(540*(1+{z}))':h=-2:eval=frame,crop=1080:1920,"
   "eq=contrast=1.12:saturation=1.08:gamma=0.96,colorbalance=rs=-0.03:bs=0.05:rh=0.04:bh=-0.02,vignette=PI/4,noise=alls=6:allf=t"
   + fl + ",ass=cap.ass,"
   f"drawbox=x=0:y=1904:w='1080*t/{D}':h=16:color=0x6fe3ff@0.95:t=fill[v]")
sfx=[('impact_far',0.0,-8),('wind',0.3,-14),('wind',5.0,-12),('hit',6.23,-12),('heart_fast',7.5,-12),('whoosh',13.0,-12),('shutter',13.6,-8),
     ('whoosh',19.77,-12),('epop',22.6,-12),('lock',24.5,-10),('whoosh',26.23,-12),('eglitch',28.6,-12),('energy',30.2,-12),
     ('whoosh',36.47,-12),('shutter',37.0,-8),('epop',40.2,-12),('whoosh',42.13,-12),('lock',43.4,-10),('whoosh',47.93,-12),
     ('heart_slow',50.2,-8),('heart_slow',51.1,-10),('whoosh',51.77,-12),('impact_far',53.0,-10),('wind',55.5,-14)]
ins=['-i','in.mp4','-loop','1','-i','grad.png','-i','music/music_pick.wav']; parts=[]
for i,(n,t,gn) in enumerate(sfx):
    f={'whoosh':'../yawn/whoosh.mp3','hit':A+'/heart1.wav'}.get(n,f'{A}/{n}.wav')
    ins+=['-i',f]; k=i+3; ms=int(t*1000)
    parts.append(f"[{k}:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:2.5,afade=t=out:st=2.1:d=0.4,volume={gn}dB,adelay={ms}|{ms}[s{i}]")
a=("[0:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit[vo][key];"
   f"[2:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{D},volume=-21dB,afade=t=in:d=0.5,afade=t=out:st={D-2}:d=2[m0];"
   "[m0][key]sidechaincompress=threshold=0.04:ratio=6:attack=15:release=300[m];"+';'.join(parts)+';'
   f"[vo][m]{''.join(f'[s{i}]' for i in range(len(sfx)))}amix=inputs={len(sfx)+2}:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9[a]")
cmd=['ffmpeg','-v','error','-y',*ins,'-filter_complex',v+';'+a,'-map','[v]','-map','[a]','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-t',str(D),'-movflags','+faststart','Why_Do_We_Dream_v2.mp4']
r=subprocess.run(cmd,capture_output=True,text=True); print(r.stderr[-1200:])
