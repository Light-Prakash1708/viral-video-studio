#!/usr/bin/env python3
"""tools/hf_chunks.py: render HyperFrames videos in chunks, then re-render ONLY the seconds that need fixing.

Idea taken from VideoHub (TensaikunYT/Videohub, MIT): render once in short chunks; after a fix, re-render just the
chunks the fix touched, join the film again (stream copy, no re-encode) and keep every version.

  python3 studio/tools/hf_chunks.py render <hf_project_dir> --audio mix.wav --out final/Film.mp4 [--chunk 4]
  python3 studio/tools/hf_chunks.py detect <hf_project_dir>                        # which chunks changed since the last render
  python3 studio/tools/hf_chunks.py fix    <hf_project_dir> --at 23,71.5-74 [--auto] --audio mix.wav --out final/Film.mp4
  python3 studio/tools/hf_chunks.py stills <hf_project_dir> --at 23,72               # before/after picture of those moments

- Notes are just timestamps: "0:23 cat is cut off", "1:12-1:15 text overlaps" -> --at 23,72-75 (m:ss works too).
  Each time is widened by --pad (0.3 s) and mapped to the chunks it touches.
- --auto also finds chunks whose picture changed: the page is fingerprinted at --fp-rate frames per second (small
  screenshots, cheap) and compared with the fingerprints stored at the last render. Use --at for anything sub-second.
- State lives in <project>/.chunks/: c_000.mp4 ..., manifest.json (fps, chunk, hyperframes version, fingerprints),
  versions.json. Output: <out> (always the newest), <out stem>_vN.mp4 (every version), <out stem>_v{N}_changes.mp4 (only
  the re-rendered chunks, to check the fix quickly) and <out stem>_v{N}_compare.png (before | after at each --at time).
- Audio is laid under the joined picture at the end (--audio), so a sound-only change never needs a render: run
  `mux` alone.
- Every chunk is checked for its exact frame count; a bad chunk is rendered again once, then the run stops.
"""
import argparse, hashlib, json, os, re, shutil, subprocess, sys, time
HERE = os.path.dirname(os.path.abspath(__file__))
FP_JS = os.path.join(HERE, 'hf_fingerprint.cjs')

def sh(cmd, **kw):
    r = subprocess.run(cmd, **kw)
    if r.returncode: sys.exit(f'failed ({r.returncode}): {" ".join(map(str, cmd[:6]))} ...')
    return r

def probe_frames(f):
    o = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip()
    return int(o or 0)

def page_info(proj):
    html = open(os.path.join(proj, 'index.html')).read()
    dur = float(re.search(r'data-duration="([\d.]+)"', html).group(1))
    fps = int(re.search(r'data-fps="(\d+)"', html).group(1)) if re.search(r'data-fps="(\d+)"', html) else 30
    w = int(re.search(r'data-width="(\d+)"', html).group(1)); h = int(re.search(r'data-height="(\d+)"', html).group(1))
    return dict(dur=dur, fps=fps, w=w, h=h)

def hf_version():
    o = subprocess.run(['npx', '--yes', 'hyperframes@latest', '--version'], capture_output=True, text=True).stdout.strip()
    m = re.search(r'(\d+\.\d+\.\d+)', o); return m.group(1) if m else 'latest'

def tsec(s):
    s = s.strip()
    if ':' in s: m, x = s.split(':'); return int(m) * 60 + float(x)
    return float(s)

def parse_at(spec, pad, dur):
    out = []
    for part in (spec or '').split(','):
        if not part.strip(): continue
        if '-' in part.strip()[1:]:
            a, b = re.split(r'(?<=\d)-', part.strip(), 1); a, b = tsec(a), tsec(b)
        else: a = b = tsec(part)
        out.append((max(0, a - pad), min(dur, b + pad), a, b))
    return out

def chunks_of(ranges, chunk, n):
    s = set()
    for a, b, *_ in ranges:
        for c in range(int(a // chunk), min(n - 1, int(b // chunk)) + 1): s.add(c)
    return sorted(s)

class State:
    def __init__(self, proj):
        self.proj = proj; self.dir = os.path.join(proj, '.chunks'); os.makedirs(self.dir, exist_ok=True)
        self.mf = os.path.join(self.dir, 'manifest.json'); self.vf = os.path.join(self.dir, 'versions.json')
        self.m = json.load(open(self.mf)) if os.path.exists(self.mf) else None
        self.v = json.load(open(self.vf)) if os.path.exists(self.vf) else []
    def save(self):
        json.dump(self.m, open(self.mf, 'w'), indent=1); json.dump(self.v, open(self.vf, 'w'), indent=1)
    def cpath(self, c): return os.path.join(self.dir, f'c_{c:03d}.mp4')

def fingerprints(proj, info, rate):
    """small-screenshot hashes of the page, `rate` per second -> list of hex strings (index = sample)"""
    out = os.path.join(proj, '.chunks', 'fp.json')
    node_path = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
    sh(['node', FP_JS, os.path.join(proj, 'index.html'), str(info['dur']), str(rate), str(info['w']), str(info['h']), out], env=dict(os.environ, NODE_PATH=node_path))
    return json.load(open(out))

def render_chunk(st, c, info, chunk, version, quality, workers):
    a = round(c * chunk, 6); b = round(min(info['dur'], (c + 1) * chunk), 6)
    want = round((b - a) * info['fps'])
    tmp = st.cpath(c) + '.tmp.mp4'; dst = st.cpath(c)
    for attempt in (1, 2):
        cmd = ['npx', '--yes', f'hyperframes@{version}', 'render', '--start', str(a), '--end', str(b), '-q', quality, '--quiet', '-o', tmp]
        if workers: cmd += ['-w', str(workers)]
        subprocess.run(cmd, cwd=st.proj, stdout=subprocess.DEVNULL)
        if os.path.exists(tmp):
            sh(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-an', '-c:v', 'copy', dst]); os.remove(tmp)
            got = probe_frames(dst)
            if got == want: return
            print(f'  chunk {c}: {got} frames, wanted {want} (attempt {attempt})')
    sys.exit(f'chunk {c} could not be rendered with the exact frame count; render the whole film instead')

def join_and_mux(st, n, audio, out):
    lst = os.path.join(st.dir, 'list.txt')
    open(lst, 'w').write(''.join(f"file '{st.cpath(c)}'\n" for c in range(n)))
    silent = os.path.join(st.dir, 'video_silent.mp4')
    sh(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', silent])
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    if audio:
        sh(['ffmpeg', '-v', 'error', '-y', '-i', silent, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out])
    else: shutil.copy(silent, out)
    sh(['ffmpeg', '-v', 'error', '-i', out, '-f', 'null', '-'])   # full decode check
    return silent

def save_version(st, out, kind, chunks, ranges):
    n = (st.v[-1]['v'] + 1) if st.v else 1
    stem, ext = os.path.splitext(out); vfile = f'{stem}_v{n}{ext}'
    shutil.copy(out, vfile)
    st.v.append(dict(v=n, file=vfile, kind=kind, chunks=chunks, ranges=[[round(r[2], 2), round(r[3], 2)] for r in ranges], at=time.strftime('%Y-%m-%d %H:%M:%S')))
    return n, vfile

def cmd_render(a):
    st = State(a.proj); info = page_info(a.proj); ver = hf_version()
    n = int(-(-info['dur'] // a.chunk))
    t0 = time.time()
    print(f'{n} chunks of {a.chunk}s at {info["fps"]} fps (hyperframes {ver})')
    for c in range(n):
        render_chunk(st, c, info, a.chunk, ver, a.quality, a.workers)
        el = time.time() - t0; print(f'  chunk {c+1}/{n} ok  {el:.0f}s elapsed, ~{el/(c+1)*(n-c-1):.0f}s left', flush=True)
    st.m = dict(info, chunk=a.chunk, n=n, version=ver, quality=a.quality, fp_rate=a.fp_rate, fp=fingerprints(a.proj, info, a.fp_rate))
    join_and_mux(st, n, a.audio, a.out)
    v, vf = save_version(st, a.out, 'full', list(range(n)), []); st.save()
    print(f'-> {a.out}  (version {v}: {vf})  {time.time()-t0:.0f}s')

def changed_chunks(st, info):
    if not st.m or 'fp' not in st.m: sys.exit('no fingerprints yet: run `render` first')
    new = fingerprints(st.proj, info, st.m['fp_rate'])
    old = st.m['fp']; rate = st.m['fp_rate']; ch = st.m['chunk']
    diff = [i for i in range(max(len(old), len(new))) if i >= len(old) or i >= len(new) or old[i] != new[i]]
    return sorted({min(st.m['n'] - 1, int((i / rate) // ch)) for i in diff}), new, diff

def cmd_detect(a):
    st = State(a.proj); info = page_info(a.proj)
    cs, _, diff = changed_chunks(st, info)
    if not cs: print('no visible change found at the fingerprint rate'); return
    print('changed chunks:', ', '.join(f'{c} ({c*st.m["chunk"]:.0f}-{(c+1)*st.m["chunk"]:.0f}s)' for c in cs))
    print('first changed moments:', ', '.join(f'{i/st.m["fp_rate"]:.2f}s' for i in diff[:12]))

def compare_png(before, after, times, out_png, w=270):
    tiles = []
    tmpd = os.path.join(os.path.dirname(out_png), '.cmp'); os.makedirs(tmpd, exist_ok=True)
    for k, t in enumerate(times):
        for side, f in (('a', before), ('b', after)):
            p = os.path.join(tmpd, f'{k}{side}.png')
            sh(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', f, '-frames:v', '1', '-vf', f'scale={w}:-2', p]); tiles.append(p)
    inputs = sum((['-i', p] for p in tiles), [])
    rows = len(times); layout = '|'.join(f'{c*w}_{"+".join(["h0"]*r) if r else 0}' for r in range(rows) for c in (0, 1))
    sh(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', f'xstack=inputs={len(tiles)}:layout={layout}', out_png])
    shutil.rmtree(tmpd, ignore_errors=True)

def cmd_fix(a):
    st = State(a.proj); info = page_info(a.proj)
    if not st.m: sys.exit('no chunked render yet: run `render` first')
    if abs(info['dur'] - st.m['dur']) > 1e-6 or info['fps'] != st.m['fps']:
        sys.exit(f'the film length/fps changed ({st.m["dur"]}s -> {info["dur"]}s): timing moved, so render the whole film again')
    ranges = parse_at(a.at, a.pad, info['dur']); cs = set(chunks_of(ranges, st.m['chunk'], st.m['n']))
    newfp = None
    if a.auto:
        auto, newfp, _ = changed_chunks(st, info); cs |= set(auto)
        print('auto-detected changed chunks:', auto or 'none')
    cs = sorted(cs)
    if not cs: print('nothing to re-render'); return
    prev = st.v[-1]['file'] if st.v else None
    keep = os.path.join(st.dir, f'prev_v{st.v[-1]["v"] if st.v else 0}'); os.makedirs(keep, exist_ok=True)
    t0 = time.time()
    print(f're-rendering {len(cs)} of {st.m["n"]} chunks: {cs}')
    for c in cs:
        if os.path.exists(st.cpath(c)): shutil.copy(st.cpath(c), os.path.join(keep, os.path.basename(st.cpath(c))))
        render_chunk(st, c, info, st.m['chunk'], st.m['version'], st.m['quality'], a.workers); print(f'  chunk {c} ok', flush=True)
    st.m['fp'] = newfp or fingerprints(a.proj, info, st.m['fp_rate'])
    join_and_mux(st, st.m['n'], a.audio, a.out)
    v, vf = save_version(st, a.out, 'fix', cs, ranges)
    stem, ext = os.path.splitext(a.out)
    # only the changed chunks, back to back, to check the fix fast
    lst = os.path.join(st.dir, 'changes.txt'); open(lst, 'w').write(''.join(f"file '{st.cpath(c)}'\n" for c in cs))
    sh(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', f'{stem}_v{v}_changes.mp4'])
    times = [ (r[2] + r[3]) / 2 for r in ranges ] or [ (c + .5) * st.m['chunk'] for c in cs[:4] ]
    if prev and os.path.exists(prev): compare_png(prev, a.out, times[:6], f'{stem}_v{v}_compare.png')
    st.save()
    print(f'-> {a.out}  (version {v}: {vf}; changes only: {stem}_v{v}_changes.mp4)  {time.time()-t0:.0f}s')

def cmd_stills(a):
    st = State(a.proj)
    if len(st.v) < 1: sys.exit('no versions yet')
    times = [ (r[2] + r[3]) / 2 for r in parse_at(a.at, 0, 1e9) ]
    before = st.v[-2]['file'] if len(st.v) > 1 else st.v[-1]['file']; after = st.v[-1]['file']
    out = os.path.splitext(after)[0] + '_stills.png'; compare_png(before, after, times, out); print('->', out)

def cmd_mux(a):
    st = State(a.proj)
    if not st.m: sys.exit('no chunked render yet')
    join_and_mux(st, st.m['n'], a.audio, a.out); v, vf = save_version(st, a.out, 'audio', [], []); st.save(); print('->', a.out, f'(version {v})')

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest='cmd', required=True)
    for name in ('render', 'detect', 'fix', 'stills', 'mux'):
        p = sp.add_parser(name); p.add_argument('proj')
        p.add_argument('--audio'); p.add_argument('--out'); p.add_argument('--at', default='')
        p.add_argument('--chunk', type=float, default=4.0); p.add_argument('--pad', type=float, default=0.3)
        p.add_argument('--auto', action='store_true'); p.add_argument('--fp-rate', type=float, default=4.0)
        p.add_argument('--quality', default='looks'); p.add_argument('--workers')
    a = ap.parse_args(); a.proj = os.path.abspath(a.proj)
    if a.cmd in ('render', 'fix', 'mux') and not a.out: sys.exit('--out is required')
    {'render': cmd_render, 'detect': cmd_detect, 'fix': cmd_fix, 'stills': cmd_stills, 'mux': cmd_mux}[a.cmd](a)

if __name__ == '__main__': main()
