#!/usr/bin/env python3
"""credits.py - build the description credits block from ATTRIBUTION files (free_media.py output).
usage: credits.py ATTRIBUTION.txt [more.txt ...] [--ai-voice] [--art "GTA VI artwork: Rockstar Games"] [--brand "Toon Theory"]
"""
import sys, os, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import profilelib as PL
ap = argparse.ArgumentParser(); ap.add_argument("files", nargs="+"); ap.add_argument("--ai-voice", action="store_true"); ap.add_argument("--art", action="append", default=[]); ap.add_argument("--brand", default=PL.active().get("brand", "Channel")); a = ap.parse_args()
music, footage, images, other = [], [], [], []
seen = set()
for f in a.files:
    for l in open(f):
        l = l.strip()
        if not l or l in seen: continue
        seen.add(l)
        if l.startswith("Footage:"): footage.append(l[8:].strip())
        elif l.startswith("Image"): images.append(l)
        elif " by " in l and "CC" in l.upper() and "visit" in l: music.append(l.split(" To view")[0].rstrip("."))
        else: other.append(l)
out = ["CREDITS"]
for m in music: out.append(f"Music: {m} (creativecommons.org/licenses/by/3.0/)")
if footage: out.append("Footage (public domain, Internet Archive; illustrative): " + "; ".join(footage))
if images: out.append("Photos (Openverse, CC licences):"); out += [f"  - {i}" for i in images]
for x in a.art: out.append(x + " - shown for commentary.")
for o in other: out.append(o)
if a.ai_voice: out.append(f"Narration: AI voice. Script, animation and edit: {a.brand}.")
print("\n".join(out))
