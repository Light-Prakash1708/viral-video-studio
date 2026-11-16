import sys,subprocess
F,A=sys.argv[1],sys.argv[2]; D=32.866667
P=[0,7.5,13,18.5,25]
z='+'.join(f"if(gte(t,{T}),0.07*exp(-3*(t-{T})),0)" for T in P)
fl=''.join(f",drawbox=x=0:y=0:w=iw:h=ih:color=white@0.45:t=fill:enable='between(t,{T},{T+0.07})'" for T in P[1:])
def dt(txt,a,b,y,size,col='white',box='0x1a1440@0.85'):
    fs=f"if(lt(t-{a},0.18),{size}*(0.5+0.5*(t-{a})/0.18),{size})"
    return (f",drawtext=fontfile='{F}':text='{txt}':fontsize='{fs}':fontcolor={col}:x=(w-text_w)/2:y={y}-text_h/2"
            f":box=1:boxcolor={box}:boxborderw=26:enable='between(t,{a},{b})'"
            f":alpha='min(1,min((t-{a})/0.12,({b}-t)/0.15))'")
v=(f"[0:v]scale=w='2*trunc(540*(1+{z}))':h=-2:eval=frame,crop=1080:1920,"
   "eq=contrast=1.08:saturation=1.18:gamma=0.98,colorbalance=rs=0.03:bs=-0.02:rh=0.02:bh=0.03,vignette=PI/4.5,noise=alls=5:allf=t"
   + fl +
   dt('YOU WILL YAWN BEFORE THIS ENDS',0.1,1.95,300,56,'0xffd34a') +
   dt('CLUE 1/3',7.6,12.9,1700,58,'white','0xff6a3d@0.92') +
   dt('CLUE 2/3',13.1,18.4,1700,58,'white','0xf2b705@0.92') +
   dt('CLUE 3/3',18.6,24.9,1700,58,'white','0xe0457b@0.92') +
   dt('DID YOU JUST YAWN?',21.0,22.9,900,70,'0x1a1440','0xffd34a@0.95') +
   f",drawbox=x=0:y=1902:w='1080*t/{D}':h=18:color=0xff6fae@0.95:t=fill[v]")
sfx=[('impact_far',0.0,-10),('whoosh',0.0,-12),('epop',2.0,-14),('lock',5.6,-10),('whoosh',7.5,-12),('epop',7.6,-12),('wind',10.0,-14),
     ('whoosh',13.0,-12),('power_on',13.1,-10),('energy',15.6,-14),('whoosh',18.5,-12),('epop',18.6,-12),('stamp',21.0,-8),('heart_slow',23.2,-10),('whoosh',25.0,-12),('lock',28.6,-12)]
ins=['-i','in.mp4','-i','music.wav/music_pick.wav']; parts=[]
for i,(n,t,g) in enumerate(sfx):
    ins+=['-i','whoosh.mp3' if n=='whoosh' else f'{A}/{n}.wav']; k=i+2; ms=int(t*1000)
    parts.append(f"[{k}:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:2.5,afade=t=out:st=2.1:d=0.4,volume={g}dB,adelay={ms}|{ms}[s{i}]")
a=(f"[0:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit[vo][key];"
   f"[1:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{D},volume=-15dB,afade=t=in:d=0.4,afade=t=out:st={D-1.5}:d=1.5[m0];"
   "[m0][key]sidechaincompress=threshold=0.04:ratio=6:attack=15:release=300[m];" + ';'.join(parts) + ';'
   f"[vo][m]{''.join(f'[s{i}]' for i in range(len(sfx)))}amix=inputs={len(sfx)+2}:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9[a]")
cmd=['ffmpeg','-v','error','-y',*ins,'-filter_complex',v+';'+a,'-map','[v]','-map','[a]','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-t',str(D),'-movflags','+faststart','Why_Do_We_Yawn_v2.mp4']
r=subprocess.run(cmd,capture_output=True,text=True); print(r.stderr[-800:])
