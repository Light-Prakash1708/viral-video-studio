"""profilelib.py - channel profiles shared by all tools. Profiles are markdown with a front-matter block."""
import os, re, glob
HOME = os.path.expanduser("~/.claude/youtube")
CHANNELS = os.path.join(HOME, "channels")
ACTIVE = os.path.join(HOME, "voice.md")          # the file every yt-* skill reads

def parse(path):
    t = open(path).read(); meta = {}
    m = re.match(r"^---\n(.*?)\n---\n", t, re.S)
    if m:
        for l in m.group(1).splitlines():
            if ":" in l: k, v = l.split(":", 1); meta[k.strip()] = v.strip()
    sec = re.search(r"## Words I never use\n(.*?)(\n## |\Z)", t, re.S)
    meta["banned"] = re.findall(r'["`“]([^"`”]+)["`”]', sec.group(1)) if sec else []
    meta["_text"] = t
    return meta

def active():
    return parse(ACTIVE) if os.path.exists(ACTIVE) else {"brand": "Channel", "banned": [], "_text": ""}

def banned_hits(text, prof=None):
    prof = prof or active()
    low = text.lower()
    return [b for b in prof.get("banned", []) if b.lower() in low]
