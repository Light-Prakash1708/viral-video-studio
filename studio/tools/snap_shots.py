#!/usr/bin/env python3
"""tools/snap_shots.py: snap shot boundaries in story/shots.json to the nearest beat of a track's beats.json (cuts land on the beat).
  python tools/snap_shots.py --project projects/my-video --beats build/track.wav.beats.json [--tol 0.2] [--bars]
Only moves a boundary if a beat (or bar with --bars) is within --tol seconds, so narration sync is kept. Writes shots.json in place (backup: shots.json.bak)."""
import argparse, json, shutil, os
ap = argparse.ArgumentParser(); ap.add_argument('--project', required=True); ap.add_argument('--beats', required=True); ap.add_argument('--tol', type=float, default=0.2); ap.add_argument('--bars', action='store_true'); a = ap.parse_args()
p = os.path.join(a.project, 'story', 'shots.json'); d = json.load(open(p)); g = json.load(open(a.beats)); grid = g['bars' if a.bars else 'beats']
shutil.copy(p, p + '.bak'); moved = 0
for i, s in enumerate(d['shots']):
    if i == 0: continue
    t = s['start']; n = min(grid, key=lambda x: abs(x - t))
    if abs(n - t) <= a.tol and abs(n - t) > 1e-6:
        s['start'] = round(n, 3); d['shots'][i - 1]['end'] = round(n, 3); moved += 1
json.dump(d, open(p, 'w'), indent=1); print(f"snapped {moved}/{len(d['shots']) - 1} boundaries to the {'bar' if a.bars else 'beat'} grid (tol {a.tol}s)")
