# Viral Video Studio (private kit)

Skills for making cinematic, viral animated YouTube videos with Claude Code: stickman 2D/3D, What-IF life-sim 3D
(18 characters, 22 expressions, 16 background worlds x 6 moods), mythic 3D, finance explainers, Vox collage, 3D cartoon shorts.
Free local multi-voice narration (English + Hindi house voices), 10 catchy music styles, recorded SFX library.

## Install on a Mac

```bash
git clone https://github.com/Light-Prakash1708/viral-video-studio.git ~/vvs-install
mkdir -p ~/.claude/skills && cp -R ~/vvs-install/skills/ ~/.claude/skills/
bash ~/.claude/skills/viral-video-studio/tools/setup_kit.sh
```

The setup installs ffmpeg (via Homebrew) and the voice engine (~2-3 GB model download, 5-15 min) and ends with
"voice engine ready". Then restart Claude Code.

Check the voices:
```bash
~/voicekit/.venv/bin/python ~/.claude/skills/viral-video-studio/tools/voice.py --list
```

## Update later
```bash
cd ~/vvs-install && git pull && cp -R skills/ ~/.claude/skills/
```
