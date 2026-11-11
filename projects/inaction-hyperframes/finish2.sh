#!/bin/bash
set -e
export HOME=/root; cd /root/hf-inaction/proj; O=/root/hf-inaction/out; V1=$O/inaction_silent_v1.mp4
RANGES=("250 950 a" "1503 2712 b" "2930 3172 c" "3895 4476 d" "4684 5165 e" "5410 5654 f")
for r in "${RANGES[@]}"; do set -- $r; s=$(python3 -c "print(f'{$1/24:.6f}')"); e=$(python3 -c "print(f'{$2/24:.6f}')"); npx --yes hyperframes@latest render . --quality looks --fps 24 --workers 2 --start $s --end $e -o $O/r_$3.mp4 > /tmp/hf_r_$3.log 2>&1; echo "range $3 [$s,$e] done $(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 $O/r_$3.mp4) frames (expect $(( $2-$1 )))"; done
python3 - <<'PY'
O='/root/hf-inaction/out'; V1=O+'/inaction_silent_v1.mp4'
R=[(250,950,'a'),(1503,2712,'b'),(2930,3172,'c'),(3895,4476,'d'),(4684,5165,'e'),(5410,5654,'f')]
L=[];pos=0
for a,b,k in R:
    if a>pos: L.append((V1,pos/24,a/24))
    L.append((f'{O}/r_{k}.mp4',None,None)); pos=b
L.append((V1,pos/24,None))
with open(O+'/list2.txt','w') as f:
    for fn,i,o in L:
        f.write(f"file '{fn}'\n")
        if i is not None: f.write(f"inpoint {i:.6f}\n")
        if o is not None: f.write(f"outpoint {o:.6f}\n")
PY
ffmpeg -y -loglevel error -f concat -safe 0 -i $O/list2.txt -c copy $O/inaction_silent.mp4
echo "spliced frames: $(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 $O/inaction_silent.mp4)  original: $(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 $V1)"
ffmpeg -y -loglevel error -i $O/inaction_silent.mp4 -i /root/hf-inaction/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -movflags +faststart -shortest $O/INACTION_v2.mp4
ls -la $O/INACTION_v2.mp4
