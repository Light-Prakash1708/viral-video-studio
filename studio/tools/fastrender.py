#!/usr/bin/env python3
"""tools/fastrender.py: fast, cheap and high-quality renders for GrowKaz projects.

  python tools/fastrender.py --project projects/P --preset draft                 # half-res preview, ~2.6x faster
  python tools/fastrender.py --project projects/P --preset final --mix           # lossless frames, crf 15, slow, tune animation
  python tools/fastrender.py --project projects/P --shots s01,s04 --mix          # re-render ONLY those shots, splice into build/video_silent.mp4
  python tools/fastrender.py --project projects/P --ranges 0-9.1,21.3-26.5 --preset final --mix

Presets (measured on 4 CPUs, 1080x1920): draft 7.4 fps | balanced 3.0 fps (jpeg q94, crf 18) | final 2.0 fps (png, crf 15 slow animation).
Workers default to cpu_count-1 (3 beat 4 on a 4-core box). Draft never splices (it is half resolution): it writes build/draft*.mp4.
A partial re-render needs an existing build/video_silent.mp4 (the base); the previous base is kept as build/video_silent.prev.mp4.
Audio-only changes never need this: run `python audio/mix.py --project P` alone.
"""
import argparse, glob, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRESETS = {
    'draft':    dict(flags=['--scale', '0.5', '--format', 'jpeg', '--preset', 'ultrafast', '--crf', '30'], crf='30'),
    'balanced': dict(flags=['--format', 'jpeg', '--preset', 'medium', '--crf', '18'], crf='15'),
    'final':    dict(flags=['--format', 'png', '--preset', 'slow', '--crf', '15', '--tune', 'animation'], crf='14'),
}

def run(cmd, **kw):
    r = subprocess.run(cmd, **kw)
    if r.returncode: sys.exit(f'failed: {" ".join(cmd[:4])}…')
    return r

def frames_of(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout.strip()
    return int(out)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--project', required=True); ap.add_argument('--preset', default='balanced', choices=list(PRESETS))
    ap.add_argument('--shots', help='comma list of shot ids from story/shots.json'); ap.add_argument('--ranges', help='e.g. 0-9.1,21.3-26.5 (seconds)')
    ap.add_argument('--workers', type=int); ap.add_argument('--mix', action='store_true', help='run audio/mix.py afterwards'); a = ap.parse_args()
    P = os.path.abspath(a.project); build = os.path.join(P, 'build'); os.makedirs(build, exist_ok=True)
    cfg = json.load(open(os.path.join(P, 'config.json'))); fps = int(cfg.get('fps', 24))
    env = dict(os.environ); env.setdefault('NODE_USE_ENV_PROXY', '1')
    if 'CHROME_PATH' not in env:
        c = sorted(glob.glob('/opt/pw-browsers/chromium-*/chrome-linux64/chrome'))
        if c: env['CHROME_PATH'] = c[-1]
    workers = a.workers or max(1, min(6, (os.cpu_count() or 2) - 1))
    base = ['node', os.path.join(ROOT, 'render.mjs'), '--project', P, '--workers', str(workers)] + PRESETS[a.preset]['flags']
    rng = []
    if a.shots:
        sh = {s['id']: s for s in json.load(open(os.path.join(P, 'story', 'shots.json')))['shots']}
        for i in a.shots.split(','):
            if i not in sh: sys.exit(f'unknown shot {i}; have {", ".join(sh)}')
            rng.append((sh[i]['start'], sh[i]['end']))
    if a.ranges: rng += [tuple(map(float, r.split('-'))) for r in a.ranges.split(',')]
    final_mp4 = os.path.join(build, 'video_silent.mp4')
    if not rng:  # full render
        if a.preset == 'draft': run(base + ['--out', os.path.join(build, 'draft.mp4')], env=env); print('draft ->', os.path.join(build, 'draft.mp4')); return
        run(base, env=env)
    else:
        rng.sort(); merged = []
        for s, e in rng:
            f0, f1 = round(s * fps), round(e * fps)
            if merged and f0 <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], f1)
            else: merged.append([f0, f1])
        parts = []
        for i, (f0, f1) in enumerate(merged):
            out = os.path.join(build, f'{"draft" if a.preset == "draft" else "part"}{i}.mp4')
            run(base + ['--from', str(f0 / fps), '--to', str(f1 / fps), '--out', out], env=env); parts.append((f0, f1, out))
        if a.preset == 'draft': print('draft clips ->', ', '.join(p[2] for p in parts)); return
        if not os.path.exists(final_mp4): sys.exit('no base build/video_silent.mp4: render the full video once first')
        prev = os.path.join(build, 'video_silent.prev.mp4'); os.replace(final_mp4, prev); total = frames_of(prev)
        ins = ['-i', prev]; chains = []; labels = []; pos = 0
        for k, (f0, f1, out) in enumerate(parts):
            if f0 > pos: chains.append(f'[0:v]trim=start_frame={pos}:end_frame={f0},setpts=PTS-STARTPTS[b{k}]'); labels.append(f'[b{k}]')
            ins += ['-i', out]; chains.append(f'[{k + 1}:v]setpts=PTS-STARTPTS[p{k}]'); labels.append(f'[p{k}]'); pos = f1
        if pos < total: chains.append(f'[0:v]trim=start_frame={pos}:end_frame={total},setpts=PTS-STARTPTS[bz]'); labels.append('[bz]')
        fc = ';'.join(chains) + f';{"".join(labels)}concat=n={len(labels)}:v=1:a=0[v]'
        enc = ['-c:v', 'libx264', '-crf', PRESETS[a.preset]['crf'], '-preset', 'slow' if a.preset == 'final' else 'veryfast'] + (['-tune', 'animation'] if a.preset == 'final' else []) + ['-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-r', str(fps)]
        run(['ffmpeg', '-y', '-v', 'error'] + ins + ['-filter_complex', fc, '-map', '[v]'] + enc + [final_mp4])
        n = frames_of(final_mp4); print(f'spliced {len(parts)} range(s): {n} frames (base had {total})')
        if n != total: sys.exit(f'frame count changed ({total} -> {n}): check ranges; previous base kept at {prev}')
    if a.mix:
        run([sys.executable, os.path.join(ROOT, 'audio', 'mix.py'), '--project', P])
    print('done')

if __name__ == '__main__': main()
