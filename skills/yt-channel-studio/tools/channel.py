#!/usr/bin/env python3
"""channel.py - manage channel profiles (any number of channels).
  channel.py list                       profiles available (and which is active)
  channel.py use <slug>                 make a profile the active voice (~/.claude/youtube/voice.md)
  channel.py show [<slug>]              print a profile
  channel.py new --name "X" --niche "..." [--audience ...] [--tone ...] [--formats ...] [--voice-id ...] [--palette ...]
                 [--banned "a,b,c"] [--music ...] [--hashtags ...] [--engines ...] [--claims ...]
  channel.py export <slug> <dir>        copy a profile into the repo (e.g. skills/yt-channel-studio/profiles)
Profiles live in ~/.claude/youtube/channels/<slug>.md and in the skill's profiles/ folder (source of truth in git).
"""
import sys, os, re, shutil, argparse, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import profilelib as P
SKILL_PROFILES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "profiles")
slugify = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def find(slug):
    for d in (P.CHANNELS, SKILL_PROFILES):
        p = os.path.join(d, slug + ".md")
        if os.path.exists(p): return p
    sys.exit(f"no profile '{slug}'. run: channel.py list")

def sync():
    os.makedirs(P.CHANNELS, exist_ok=True)
    for f in glob.glob(os.path.join(SKILL_PROFILES, "*.md")):
        dst = os.path.join(P.CHANNELS, os.path.basename(f))
        if not os.path.exists(dst): shutil.copy(f, dst)

def main():
    sync(); cmd = sys.argv[1] if len(sys.argv) > 1 else "list"
    if cmd == "list":
        act = P.active().get("slug")
        for f in sorted(glob.glob(os.path.join(P.CHANNELS, "*.md"))):
            m = P.parse(f); print(("* " if m.get("slug") == act else "  ") + m.get("slug", "?").ljust(22), m.get("brand", ""), "-", m.get("niche", "")[:60])
    elif cmd == "use":
        shutil.copy(find(sys.argv[2]), P.ACTIVE); print("active channel ->", P.parse(P.ACTIVE).get("brand"))
    elif cmd == "show":
        print(open(find(sys.argv[2]) if len(sys.argv) > 2 else P.ACTIVE).read())
    elif cmd == "export":
        shutil.copy(find(sys.argv[2]), sys.argv[3]); print("exported")
    elif cmd == "new":
        ap = argparse.ArgumentParser(); ap.add_argument("cmd"); ap.add_argument("--name", required=True); ap.add_argument("--niche", required=True)
        for k in ("audience", "tone", "formats", "voice-id", "palette", "banned", "music", "hashtags", "engines", "claims"): ap.add_argument("--" + k)
        a = ap.parse_args(); slug = slugify(a.name)
        banned = [b.strip() for b in (a.banned or "unlock,game-changer,dive in,smash that like button").split(",") if b.strip()]
        t = f"""---
brand: {a.name}
slug: {slug}
niche: {a.niche}
formats: {a.formats or 'Shorts 45-60 s vertical + 3-8 min films'}
voice_id: {a.voice_id if hasattr(a, 'voice_id') else ''}
palette: {a.palette or 'choose 3-5 colours; avoid blue-purple gradients'}
engines: {a.engines or 'HyperFrames shorts_gen (see youtube-shorts-studio)'}
music: {a.music or 'free CC/PD only (Jamendo via Openverse, archive.org)'}
hashtags: {a.hashtags or '#shorts'}
---
# voice.md - {a.name}

## Who I am talking to
{a.audience or 'ONE named viewer: who they are, what they already know, what they want in the first 5 seconds. FILL IN.'}

## How I actually talk
{a.tone or 'Describe the delivery and rhythm. Better: paste the transcript of the 3 best videos and let the skill infer it. FILL IN.'}

## Words I never use
{', '.join('"' + b + '"' for b in banned)}

## Words I do use
Signature phrases and tics. FILL IN after the first 3 videos.

## What I will not claim
{a.claims or 'Numbers I cannot source, results that are not mine, official figures a company has not published. Stock visuals are tagged illustrative.'}

## My format
{a.formats or 'Length, how a video opens, intro or not, on camera or animated, music level (voice >= 15 dB above music).'}
"""
        os.makedirs(P.CHANNELS, exist_ok=True); path = os.path.join(P.CHANNELS, slug + ".md"); open(path, "w").write(t)
        print("created", path, "\nnext: edit FILL IN parts (or have Claude infer from 3 videos), then: channel.py use", slug, "\nthen mirror into the repo: channel.py export", slug, "skills/yt-channel-studio/profiles/")
    else: sys.exit(__doc__)

main()
