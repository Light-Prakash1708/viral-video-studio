# Viral Video Studio (private kit)

Skills for making cinematic, viral animated YouTube videos with Claude Code: stickman 2D/3D, What-IF life-sim 3D
(18 characters, 22 expressions, 16 background worlds x 6 moods), mythic 3D, finance explainers, Vox collage, 3D cartoon shorts.
Free local multi-voice narration (English + Hindi house voices), 10 catchy music styles, recorded SFX library.

## Install on a Mac (no Homebrew needed)

1. On github.com (signed in), open this repo, click the green **Code** button, then **Download ZIP**.
2. In Terminal:

```bash
mkdir -p ~/.claude/skills && cp -R ~/Downloads/viral-video-studio-main/skills/ ~/.claude/skills/
bash ~/.claude/skills/viral-video-studio/tools/setup_kit.sh
```
(If Downloads holds `viral-video-studio-main.zip` instead of a folder, first run `cd ~/Downloads && unzip -o viral-video-studio-main.zip`.)

The setup installs uv, the voice engine (~2-3 GB model download, 5-15 min) and a private ffmpeg, and ends with
"voice engine ready". Then restart Claude Code.

Check the voices:
```bash
~/voicekit/.venv/bin/python ~/.claude/skills/viral-video-studio/tools/voice.py --list
```

## Update later
```bash
cd ~/vvs-install && git pull && cp -R skills/ ~/.claude/skills/
```
