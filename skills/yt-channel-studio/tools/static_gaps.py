#!/usr/bin/env python3
"""static_gaps.py - retention audit of a generated HyperFrames Short: finds long stretches with no visual change.
usage: static_gaps.py project/index.html [--max-gap 2.5] [--dur 67]
Counts a 'visual event' whenever a non-caption element fades in / changes (tl calls in the generated timeline).
"""
import re, sys, json, argparse
ap = argparse.ArgumentParser(); ap.add_argument("html"); ap.add_argument("--max-gap", type=float, default=2.5); ap.add_argument("--dur", type=float); a = ap.parse_args()
src = open(a.html).read()
dur = a.dur or float(re.search(r'data-duration="([\d.]+)"', src).group(1))
ev = []
for m in re.finditer(r'tl\.(fromTo|to|set)\((".*?"),(\{.*?\})(?:,(\{.*?\}))?,([\d.]+)\);', src):
    sel, t = json.loads(m.group(2)), float(m.group(5))
    if re.match(r'^#(c\d|prog|grain|grid|cam|rx|ring|face|bub|an$|fl\d|bkf|cfl|flash|brand)', sel) or "," in sel: continue
    blob = (m.group(3) or "") + (m.group(4) or "")
    if re.search(r'"opacity": ?(1|0?\.[1-9])', blob) or '"scale"' in blob or '"rotationY"' in blob or '"width"' in blob or '"height"' in blob:
        ev.append(t)
ev = sorted(set(round(t, 1) for t in ev if 0 <= t <= dur))
pts = [0.0] + ev + [dur]
gaps = sorted(((b - a_, a_, b) for a_, b in zip(pts, pts[1:]) if b - a_ > a.max_gap), reverse=True)
print(f"{len(ev)} visual events over {dur:.0f}s = a change every {dur / max(1, len(ev)):.1f}s on average")
bins = [sum(1 for t in ev if i * 10 <= t < (i + 1) * 10) for i in range(int(dur // 10) + 1)]
print("events per 10s:", bins)
if gaps:
    print(f"\nSTATIC STRETCHES longer than {a.max_gap}s (add a cut, punch-in, counter or image here):")
    for g, s, e in gaps[:8]: print(f"   {s:5.1f}s -> {e:5.1f}s   ({g:.1f}s)")
else: print(f"\nno stretch longer than {a.max_gap}s")
first = [t for t in ev if t <= 3]
print(f"first-3s events: {len(first)}  ({'ok' if len(first) >= 2 else 'WEAK: the opening needs 2+ changes in 3 seconds'})")
