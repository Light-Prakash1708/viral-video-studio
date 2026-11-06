#!/usr/bin/env bash
# splice.sh: replace frame ranges of a finished video with re-rendered parts WITHOUT re-rendering everything.
# Low-memory (cuts with -ss/trim per segment, joins with the concat demuxer; a big trim/concat filter_complex OOMs).
#   bash splice.sh BASE.mp4 OUT.mp4 "A_START_FRAME A_END_FRAME partA.mp4" ["B_START B_END partB.mp4" ...]
# Ranges must be sorted, frame-aligned (24 fps) and match the parts' --from/--to. Audio is copied from BASE.
set -e; BASE=$1; OUT=$2; shift 2; T=$(mktemp -d); prev=0; i=0; : > $T/list.txt
seg() { ffmpeg -loglevel error -y -i "$BASE" -vf "trim=start_frame=$1:end_frame=$2,setpts=PTS-STARTPTS" -an -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -r 24 -threads 2 "$3"; }
for r in "$@"; do set -- $r; if [ "$1" -gt "$prev" ]; then seg $prev $1 $T/s$i.mp4; echo "file '$T/s$i.mp4'" >> $T/list.txt; fi; echo "file '$(realpath $3)'" >> $T/list.txt; prev=$2; i=$((i+1)); done
seg $prev 9999999 $T/s$i.mp4; echo "file '$T/s$i.mp4'" >> $T/list.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i $T/list.txt -i "$BASE" -map 0:v -map 1:a -c copy "$OUT"
ffprobe -v error -show_entries stream=codec_type,duration -of csv=p=0 "$OUT"
