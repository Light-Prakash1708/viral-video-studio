#!/usr/bin/env python3
"""package.py - lint a title + thumbnail text as ONE pairing, with Shorts rules and claim-safety.
usage: package.py --title "..." --thumb "3 WORDS" [--kind shorts|long] [--desc "description text"]
"""
import re, os, sys, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import profilelib as PL
RISKY = {"official": "only say 'official' for figures the company published", "confirmed": "needs a source", "guaranteed": "never promise results", "proof": "overclaims unless you show the proof",
         "100%": "absolute claim", "always": "absolute claim", "cannot fail": "absolute claim - qualify it", "can't fail": "absolute claim - qualify it", "never": "absolute claim"}
HEDGES = ("estimate", "reportedly", "analyst", "allegedly", "according")

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--title", required=True); ap.add_argument("--thumb", default=""); ap.add_argument("--kind", default="shorts"); ap.add_argument("--desc", default=""); a = ap.parse_args()
    t, th = a.title.strip(), a.thumb.strip(); issues, ok = [], []; pts = 100
    lim = 50 if a.kind == "shorts" else 60
    if len(t) > lim: issues.append(f"title is {len(t)} chars (> {lim}): the tail truncates"); pts -= 15
    elif len(t) > 40: issues.append(f"title is {len(t)} chars: fine on desktop, cut on a mobile feed (40) - keep the subject in the first 40"); pts -= 5
    else: ok.append(f"{len(t)} chars")
    if not re.search(r"\d|[$%]", t): issues.append("no number/date/name-with-digits: a concrete figure beats an adjective"); pts -= 15
    else: ok.append("has a number")
    caps = [w for w in re.findall(r"\b[A-Z]{3,}\b", t) if w not in ("GTA", "AI", "USA", "NBA", "FBI", "CIA", "VI")]
    if len(caps) > 2: issues.append(f"{len(caps)} all-caps words: reads as spam"); pts -= 10
    if th:
        tw = th.split()
        if len(tw) > 3: issues.append(f"thumbnail has {len(tw)} words (max 3)"); pts -= 15
        else: ok.append(f"thumbnail {len(tw)} words")
        tl = {w.lower().strip("#$,.?!") for w in re.findall(r"[\w$#,.]+", t)} - {"the", "a", "of", "in", "to", "is", "and"}
        dup = [w for w in tw if w.lower().strip("#$,.?!") in tl and len(w) > 2]
        if dup: issues.append(f"thumbnail repeats the title ({', '.join(dup)}): add a different word, same promise"); pts -= 15
    for b in PL.banned_hits(t + " " + th + " " + a.desc): issues.append(f"channel voice: '{b}' is on this channel's never-use list"); pts -= 5
    low = (t + " " + th).lower(); dlow = a.desc.lower()
    for k, why in RISKY.items():
        if k in low: issues.append(f"claim-safety: '{k}' - {why}"); pts -= 8
    if re.search(r"\$?\d[\d,.]*\s*(billion|million)|\$\d", low) and not any(h in (low + dlow) for h in HEDGES):
        issues.append("money figure with no hedge: add 'estimate'/'reportedly' in the title or the first description line"); pts -= 10
    print(f"\n  TITLE  {t}\n  THUMB  {th or '(none)'}\n  KIND   {a.kind}\n  SCORE  {max(0, pts)}/100")
    for o in ok: print("   ok   ", o)
    for i in issues: print("   fix  ", i)
    print()

main()
