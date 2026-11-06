"""recover_parts.py: rescue frames from render.mjs part files that were cut off (container restart / kill), i.e. MP4s
with no moov atom ("moov atom not found"). Copies SPS/PPS from a finished part of the same render, walks the mdat
NAL units and rebuilds an Annex-B stream, then re-encodes the first N good frames (drops the last ~8 frames).
usage: python3 recover_parts.py GOOD_PART.mp4 BROKEN_PART.mp4 OUT.mp4
Then re-render only the missing tail of that part with render.mjs --from/--to (frame-aligned) and join everything
with the concat demuxer. Part k of a W-worker render covers frames [f0 + k*ceil(N/W), ...).
"""
import re, struct, subprocess, sys
good, broken, out = sys.argv[1:4]
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', good, '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-frames:v', '2', '/tmp/_ref.h264'], check=True)
ref = open('/tmp/_ref.h264', 'rb').read(); idx = [m.start() for m in re.finditer(b'\x00\x00\x01', ref)]
nals = [ref[s + 3:(idx[k + 1] if k + 1 < len(idx) else len(ref))].rstrip(b'\x00') for k, s in enumerate(idx)]
hdr = b''.join(b'\x00\x00\x00\x01' + n for n in nals if n and (n[0] & 0x1f) in (7, 8))
d = open(broken, 'rb').read(); p = 0; mdat = None
while p + 8 <= len(d):
    sz, typ = struct.unpack('>I4s', d[p:p + 8])
    if typ == b'mdat': mdat = p + (16 if sz == 1 else 8); break
    if sz < 8: break
    p += sz
assert mdat, 'no mdat box found'
chunks = [hdr]; q = mdat
while q + 4 <= len(d):
    L = struct.unpack('>I', d[q:q + 4])[0]
    if L <= 0 or q + 4 + L > len(d): break
    chunks.append(b'\x00\x00\x00\x01' + d[q + 4:q + 4 + L]); q += 4 + L
open('/tmp/_rec.h264', 'wb').write(b''.join(chunks))
n = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', '-f', 'h264', '/tmp/_rec.h264'], capture_output=True, text=True).stdout.strip() or 0)
keep = max(0, n - 8)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'h264', '-r', '24', '-i', '/tmp/_rec.h264', '-frames:v', str(keep), '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '24', out], check=True)
print(f'recovered {keep} frames (of {n} decodable) -> {out}')
