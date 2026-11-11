import subprocess
O='/root/hf-inaction/out'; V1=O+'/inaction_silent_v1.mp4'
R=[(250,950,'a'),(1503,2712,'b'),(2930,3172,'c'),(3895,4476,'d'),(4684,5165,'e'),(5410,5654,'f')]
segs=[];pos=0
for a,b,k in R:
    if a>pos: segs.append(('v',pos,a))
    segs.append(('r',k)); pos=b
segs.append(('v',pos,5788))
inp=['-i',V1]+sum([['-i',f'{O}/r_{k}.mp4'] for a,b,k in R],[])
fc=[];lab=[]
ri=0
for i,s in enumerate(segs):
    if s[0]=='v': fc.append(f"[0:v]trim=start_frame={s[1]}:end_frame={s[2]},setpts=PTS-STARTPTS,fps=24,format=yuv420p[s{i}]")
    else:
        ri+=1; fc.append(f"[{ri}:v]setpts=PTS-STARTPTS,fps=24,format=yuv420p[s{i}]")
    lab.append(f"[s{i}]")
fc.append(''.join(lab)+f"concat=n={len(segs)}:v=1:a=0[v]")
cmd=['ffmpeg','-y','-loglevel','error']+inp+['-i','/root/hf-inaction/mix.wav','-filter_complex',';'.join(fc),'-map','[v]','-map',f'{len(R)+1}:a','-c:v','libx264','-preset','veryfast','-crf','15','-pix_fmt','yuv420p','-r','24','-c:a','aac','-b:a','256k','-movflags','+faststart','-shortest',O+'/INACTION_v2.mp4']
subprocess.run(cmd,check=True)
print(subprocess.run(['ffprobe','-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=nb_read_frames','-of','csv=p=0',O+'/INACTION_v2.mp4'],capture_output=True,text=True).stdout)
