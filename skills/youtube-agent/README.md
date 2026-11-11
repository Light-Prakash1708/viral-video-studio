# youtube-agent (installed skill pack)
Source: https://github.com/jakeschincariol/youtube-agent-skill (MIT). Eleven skills: /yt-script, /yt-package, /yt-edit, /yt-comment, /yt-plan, /yt-viral, /yt-retention, /yt-shorts, /yt-seo, /yt-chapters, /yt-audit, plus six dependency-free Python tools (hookscore.py, title.py, deadair.py, chapters.py, retention.py, swipe.py). Reviewed before install: no network/exec/credential access.
Install elsewhere: `cp -r skills/youtube-agent/yt-* ~/.claude/skills/ && mkdir -p ~/.claude/youtube && cp skills/youtube-agent/voice.toon-theory.md ~/.claude/youtube/voice.md`
Channel voice profile for Toon Theory: voice.toon-theory.md (every skill reads ~/.claude/youtube/voice.md).
