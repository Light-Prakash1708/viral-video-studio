#!/usr/bin/env python3
"""hookscore2.py - Shorts hook panel tuned for Toon Theory (open-loop first).
usage: hookscore2.py --hook "line" | hookscore2.py hooks.txt   (one hook per line, ranked)
A heuristic, not a predictor: a low score is a reason to rewrite, a high score is not a promise.
"""
import re, os, sys, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import profilelib as PL
STAKES = set("die dead death lose lost cost costs fail failed never only last worst best billion million dollars money cannot can't impossible secret hidden truth illegal banned".split())
TEASE = ["stay for", "number four", "number one", "the last one", "here's why", "here is why", "here's the math", "here is the math", "watch what", "wait for", "until the end", "you won't believe", "nobody tells you", "the reason", "what happens"]
QWORDS = {"why", "how", "what", "which", "who", "can", "does", "is", "are", "will"}

def words(s): return re.findall(r"[\w$'%,.-]+", s)

def score(h):
    ws = words(h); first = re.split(r"(?<=[.?!])\s", h.strip())[0]; fw = words(first)
    low = h.lower(); head = " ".join(w.lower() for w in ws[:8])
    spec = 25 + 25 * min(2, len(re.findall(r"\d", h)) > 0) + 15 * (len(re.findall(r"(?<!^)\b[A-Z][a-z]+", h)) > 0) + 20 * bool(re.search(r"[$%]|\b(19|20)\d\d\b", h))
    addr = 100 if re.search(r"\b(you|your|you're|you'll)\b", head) else (45 if re.search(r"\b(you|your)\b", low) else 20)
    stakes = 20 + 20 * min(4, sum(1 for w in re.findall(r"[a-z']+", low) if w in STAKES))
    loop = 20
    if "?" in h: loop += 40
    if any(t in low for t in TEASE): loop += 40
    if ws and ws[0].lower() in QWORDS: loop += 15
    n = len(fw); brev = 100 if n <= 10 else max(20, 100 - (n - 10) * 9)
    # an opener that fully answers itself (ends in a period, no tease, no question) caps curiosity
    if loop <= 20 and h.strip().endswith("."): loop = 15
    props = {"SPECIFICITY": min(100, spec), "ADDRESS": min(100, addr), "STAKES": min(100, stakes), "OPEN_LOOP": min(100, loop), "BREVITY": brev}
    total = round(.2 * props["SPECIFICITY"] + .15 * props["ADDRESS"] + .2 * props["STAKES"] + .3 * props["OPEN_LOOP"] + .15 * props["BREVITY"])
    verdict = "STRONG" if total >= 70 else "WORKABLE" if total >= 55 else "WEAK"
    tips = {"SPECIFICITY": "add a number, year or named thing", "ADDRESS": "say 'you' in the first 8 words", "STAKES": "name the cost, loss or danger",
            "OPEN_LOOP": "end on a question or a tease ('stay for #4', 'here's why') - do not answer yourself", "BREVITY": "first sentence under 11 words"}
    weakest = min(props, key=props.get)
    return total, verdict, props, weakest, tips[weakest], round(len(ws) / 2.6, 1)

def show(h):
    t, v, p, wk, tip, sec = score(h)
    print(f"\n  {h}\n  {'-' * min(len(h), 78)}")
    for k, x in p.items(): print(f"    {k:<12} {x:3d}  {'#' * (x // 5)}")
    print(f"    TOTAL        {t:3d}  {v}   (~{sec}s spoken)\n    fix first    {wk}: {tip}")
    for b_ in PL.banned_hits(h): print(f"    voice        '{b_}' is on this channel's never-use list")
    return t

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("file", nargs="?"); ap.add_argument("--hook"); a = ap.parse_args()
    hs = [a.hook] if a.hook else [l.strip() for l in open(a.file) if l.strip()] if a.file else sys.exit(__doc__)
    ranked = sorted(hs, key=lambda x: -score(x)[0])
    for h in ranked: show(h)
    if len(ranked) > 1: print("\n  keep the top two:", *[f"\n   {score(h)[0]}  {h}" for h in ranked[:2]])
