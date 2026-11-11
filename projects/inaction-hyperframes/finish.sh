#!/bin/bash
set -e
export HOME=/root; cd /root/hf-inaction/proj; O=/root/hf-inaction/out; ORIG=$O/inaction_silent.mp4
cp -n $ORIG $O/inaction_silent_v1.mp4
R(){ npx --yes hyperframes@latest render . --quality looks --fps 24 --workers 2 --start $1 --end $2 -o $O/$3.mp4 > /tmp/hf_$3.log 2>&1; echo "$3 done"; }
R 62.625 94.5 p1; R 162.291667 186.5 p2; R 195.166667 202.083333 p3
for f in p1 p2 p3; do ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 $O/$f.mp4 | sed "s/^/$f frames: /"; done
cat > $O/list.txt <<L
file '$O/inaction_silent_v1.mp4'
inpoint 0
outpoint 62.625
file '$O/p1.mp4'
file '$O/inaction_silent_v1.mp4'
inpoint 94.5
outpoint 162.291667
file '$O/p2.mp4'
file '$O/inaction_silent_v1.mp4'
inpoint 186.5
outpoint 195.166667
file '$O/p3.mp4'
file '$O/inaction_silent_v1.mp4'
inpoint 202.083333
L
ffmpeg -y -loglevel error -f concat -safe 0 -i $O/list.txt -c copy $O/inaction_silent.mp4
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames,duration -of csv=p=0 $O/inaction_silent.mp4 | sed 's/^/spliced: /'
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 $O/inaction_silent_v1.mp4 | sed 's/^/original frames: /'
ffmpeg -y -loglevel error -i $O/inaction_silent.mp4 -i /root/hf-inaction/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -movflags +faststart -shortest $O/INACTION_v2.mp4
ls -la $O/INACTION_v2.mp4
