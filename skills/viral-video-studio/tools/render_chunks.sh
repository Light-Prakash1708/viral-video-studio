#!/usr/bin/env bash
# render_chunks.sh: crash-safe full render. Renders the video in ~40 s chunks (each its own MP4), skips chunks that
# already exist, then joins them with the concat demuxer (low memory) and upscales to 1080p if --scale was used.
# A container restart mid-render then costs at most one chunk. Run from the studio root.
#   bash <skill>/tools/render_chunks.sh projects/P [SCALE=1] [CHUNK=40] [WORKERS=4]
# SCALE 0.8 renders 1536x864 (~1.5x faster) and lanczos-upscales; soft DOF/bloom looks hide it. Keep 1 for 2D-heavy films.
set -u; P=$1; SC=${2:-1}; CH=${3:-40}; W=${4:-4}; B=$P/build
DUR=$(python3 -c "import json;print(json.load(open('$P/config.json'))['duration'])")
list=""; k=1; a=0
while python3 -c "import sys;sys.exit(0 if $a < $DUR - 0.01 else 1)"; do
  b=$(python3 -c "print(min($a + $CH, round($DUR * 24 + 1) / 24))")
  out=$B/chunk_$k.mp4; list="$list\nfile chunk_$k.mp4"
  if [ ! -s "$out" ]; then
    extra=""; [ "$SC" != "1" ] && extra="--scale $SC"
    node render.mjs --project "$P" --from $a --to $b --workers $W --format jpeg $extra --out "$out" || { echo "CHUNK $k FAILED"; exit 1; }
  else echo "chunk $k exists, skipping"; fi
  a=$b; k=$((k + 1))
done
printf "$list\n" | sed '/^$/d' > $B/chunks.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i $B/chunks.txt -vf "scale=1920:1080:flags=lanczos,setsar=1" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 24 $B/video_silent.mp4 && echo RENDER_DONE
# (for 9:16 projects change the scale to 1080:1920)
