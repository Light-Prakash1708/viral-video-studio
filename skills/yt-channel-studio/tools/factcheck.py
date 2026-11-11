#!/usr/bin/env python3
"""factcheck.py - turn a narration script into a claim checklist (numbers, dates, names, absolutes).
usage: factcheck.py script.txt > FACTCHECK.md
"""
import re, sys
txt = open(sys.argv[1]).read() if len(sys.argv) > 1 else sys.stdin.read()
sents = [s.strip() for s in re.split(r"(?<=[.?!])\s+", re.sub(r"\[.*?\]", "", txt)) if s.strip()]
NUMW = "one two three four five six seven eight nine ten hundred thousand million billion".split()
rows = []
for s in sents:
    kinds = []
    if re.search(r"\d", s) or any(w in s.lower().split() for w in NUMW): kinds.append("number")
    if re.search(r"\b(19|20)\d\d\b|nineteen|twenty (twelve|eleven|ten)", s, re.I): kinds.append("date")
    if re.search(r"(?<!^)(?<![.?!]\s)\b[A-Z][a-z]{2,}\b", s): kinds.append("name")
    if re.search(r"\b(most|first|only|never|always|biggest|worst|best|every|record|largest)\b", s, re.I): kinds.append("superlative")
    if re.search(r"\b(blamed|credited|killed|murder|shot|dead|died)\b", s, re.I): kinds.append("sensitive")
    if kinds: rows.append((s, kinds))
print("# Fact-check checklist\n")
print("Rule: verify each claim against a named source, or hedge it on screen ('analysts estimate', 'reportedly'). Sensitive claims about real people need a primary source.\n")
for i, (s, k) in enumerate(rows, 1):
    print(f"{i}. [ ] ({', '.join(k)}) {s}\n      source: ____________   status: unverified / verified / hedged")
print(f"\n{len(rows)} claims flagged out of {len(sents)} sentences.")
