#!/usr/bin/env bash
# One-time setup for the local voice + sound kit (no API keys). Works on macOS and Linux. Safe to re-run.
#   bash ~/.claude/skills/viral-video-studio/tools/setup_kit.sh [STUDIO_DIR]
set -e
SK="$(cd "$(dirname "$0")/.." && pwd)"; STUDIO="${1:-$HOME/growkaz-stickman-studio}"; VK="$HOME/voicekit"
echo "Skill: $SK"
# 1) sound library + library-aware sfx.py into the studio (skipped if the studio is not on this computer)
if [ -d "$STUDIO/audio" ]; then cp -R "$SK/assets/audio/sfxlib" "$STUDIO/audio/"; cp "$SK/assets/audio/sfx.py" "$STUDIO/audio/sfx.py"; echo "SFX library installed in $STUDIO/audio"
else echo "Studio not found at $STUDIO (SFX library stays in $SK/assets/audio; pass the studio folder as an argument later)"; fi
# 2) uv (Python manager) and ffmpeg
if ! command -v uv >/dev/null; then curl -LsSf https://astral.sh/uv/install.sh | sh; export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"; fi
if ! command -v ffmpeg >/dev/null; then
  if [ "$(uname)" = "Darwin" ] && command -v brew >/dev/null; then brew install ffmpeg; elif command -v apt-get >/dev/null; then apt-get install -y -q ffmpeg >/dev/null 2>&1 || sudo apt-get install -y -q ffmpeg; else echo "Please install ffmpeg (macOS: https://brew.sh then 'brew install ffmpeg')"; fi
fi
# 3) voice engine: Chatterbox Multilingual (MIT) in a Python 3.11 venv
[ -x "$VK/.venv/bin/python" ] || { mkdir -p "$VK"; uv venv -q --python 3.11 "$VK/.venv"; }
if [ "$(uname)" = "Darwin" ]; then
  uv pip install -q --python "$VK/.venv/bin/python" chatterbox-tts soundfile "setuptools<81"
else
  uv pip install -q --python "$VK/.venv/bin/python" --index-strategy unsafe-best-match --extra-index-url https://download.pytorch.org/whl/cpu chatterbox-tts soundfile "setuptools<81"
fi
"$VK/.venv/bin/python" -c "from chatterbox.mtl_tts import ChatterboxMultilingualTTS as M; M.from_pretrained(device='cpu'); print('voice engine ready')"
echo ""
echo "Done. Try:  $VK/.venv/bin/python $SK/tools/voice.py --list"
