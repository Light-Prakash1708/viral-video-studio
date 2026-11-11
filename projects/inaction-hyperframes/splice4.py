import subprocess,os
O='/root/hf-inaction/out'; V1=O+'/inaction_silent_v1.mp4'; T=O+'/seg'; os.makedirs(T,exist_ok=True)
R=[(250,950,'a'),(1503,2712,'b'),(2930,3172,'c'),(3895,4476,'d'),(4684,5165,'e'),(5410,5654,'f')]
segs=[];pos=0
for a,b,k in R:
    if a>pos: segs.append((V1,pos,a))
    segs.append((f'{O}/r_{k}.mp4',None,None)); pos=b
segs.append((V1,pos,5788))
enc=['-c:v','libx264','-preset','veryfast','-crf','15','-pix_fmt','yuv420p','-r','24','-g','48','-threads','2','-an']
lst=[]
for i,(f,a,b) in enumerate(segs):
    out=f'{T}/s{i:02d}.mp4'
    vf='setpts=PTS-STARTPTS,fps=24' if a is None else f'trim=start_frame={a}:end_frame={b},setpts=PTS-STARTPTS,fps=24'
    subprocess.run(['ffmpeg','-y','-loglevel','error','-threads','2','-i',f,'-vf',vf]+enc+[out],check=True)
    n=subprocess.run(['ffprobe','-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=nb_read_frames','-of','csv=p=0',out],capture_output=True,text=True).stdout.strip()
    print(i,n,flush=True); lst.append(out)
open(T+'/l.txt','w').write(''.join(f"file '{x}'\n" for x in lst))
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',T+'/l.txt','-c','copy',O+'/inaction_silent.mp4'],check=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',O+'/inaction_silent.mp4','-i','/root/hf-inaction/mix.wav','-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-movflags','+faststart','-shortest',O+'/INACTION_v2.mp4'],check=True)
for f in (O+'/inaction_silent.mp4',O+'/INACTION_v2.mp4'):
    print(f,subprocess.run(['ffprobe','-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=nb_read_frames:format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout.split(),flush=True)
print('DONE')
