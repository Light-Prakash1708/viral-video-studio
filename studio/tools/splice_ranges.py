#!/usr/bin/env python3
"""splice_ranges.py - replace frame ranges of a finished video with re-rendered parts (fix a few scenes without re-rendering everything).
Frame-accurate re-encode splice (stream-copy concat is NOT reliable: cuts land off keyframes and add frames / break timestamps).
usage: splice_ranges.py --base v1.mp4 --fps 24 --replace 250:950:r_a.mp4 --replace 1503:2712:r_b.mp4 [--audio mix.wav] --out final.mp4
Each --replace START:END:FILE swaps base frames [START,END) for FILE (which must have END-START frames: render it with hyperframes --start START/fps --end END/fps).
Segments are encoded one at a time (low memory), then concatenated losslessly. Prints the frame count to verify.
"""
import argparse, os, subprocess, tempfile
ap = argparse.ArgumentParser(); ap.add_argument("--base", required=True); ap.add_argument("--fps", type=int, default=24)
ap.add_argument("--replace", action="append", default=[]); ap.add_argument("--audio"); ap.add_argument("--out", required=True); ap.add_argument("--crf", default="15"); a = ap.parse_args()
def frames(f): return int(subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", f], capture_output=True, text=True).stdout.strip())
total = frames(a.base)
reps = sorted((int(s), int(e), f) for s, e, f in (r.split(":", 2) for r in a.replace))
segs, pos = [], 0
for s, e, f in reps:
    if s > pos: segs.append((a.base, pos, s))
    segs.append((f, None, None)); pos = e
if pos < total: segs.append((a.base, pos, total))
T = tempfile.mkdtemp(); enc = ["-c:v", "libx264", "-preset", "veryfast", "-crf", a.crf, "-pix_fmt", "yuv420p", "-r", str(a.fps), "-g", str(2 * a.fps), "-threads", "2", "-an"]
parts = []
for i, (f, s, e) in enumerate(segs):
    out = os.path.join(T, f"s{i:02d}.mp4")
    vf = f"setpts=PTS-STARTPTS,fps={a.fps}" if s is None else f"trim=start_frame={s}:end_frame={e},setpts=PTS-STARTPTS,fps={a.fps}"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-threads", "2", "-i", f, "-vf", vf] + enc + [out], check=True); parts.append(out)
lst = os.path.join(T, "l.txt"); open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
silent = os.path.join(T, "silent.mp4"); subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", silent], check=True)
if a.audio: subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", silent, "-i", a.audio, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", a.out], check=True)
else: subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", silent, "-c", "copy", "-movflags", "+faststart", a.out], check=True)
print(f"base {total} frames -> out {frames(a.out)} frames (video {'+ audio' if a.audio else 'only'})")
