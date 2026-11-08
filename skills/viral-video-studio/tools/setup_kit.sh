#!/usr/bin/env bash
# One-time setup for the local voice + sound kit (no API keys). Works on macOS and Linux. Safe to re-run.
#   bash ~/.claude/skills/viral-video-studio/tools/setup_kit.sh [STUDIO_DIR]
set -e
SK="$(cd "$(dirname "$0")/.." && pwd)"; STUDIO="${1:-$HOME/growkaz-stickman-studio}"; VK="$HOME/voicekit"
echo "Skill: $SK"
# 1) sound library + library-aware sfx.py into the studio (skipped if the studio is not on this computer)
if [ -d "$STUDIO/audio" ]; then cp -R "$SK/assets/audio/sfxlib" "$STUDIO/audio/"; cp "$SK/assets/audio/sfx.py" "$STUDIO/audio/sfx.py"; echo "SFX library installed in $STUDIO/audio"
else echo "Studio not found at $STUDIO (SFX library stays in $SK/assets/audio; pass the studio folder as an argument later)"; fi
# 2) uv (Python manager; no Homebrew needed)
if ! command -v uv >/dev/null; then curl -LsSf https://astral.sh/uv/install.sh | sh; fi
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
# 3) voice engine: Chatterbox Multilingual (MIT) in a Python 3.11 venv
[ -x "$VK/.venv/bin/python" ] || { mkdir -p "$VK"; uv venv -q --python 3.11 "$VK/.venv"; }
if [ "$(uname)" = "Darwin" ]; then
  uv pip install -q --python "$VK/.venv/bin/python" chatterbox-tts soundfile faster-whisper "setuptools<81"
else
  uv pip install -q --python "$VK/.venv/bin/python" --index-strategy unsafe-best-match --extra-index-url https://download.pytorch.org/whl/cpu chatterbox-tts soundfile faster-whisper "setuptools<81"
fi
# 4) ffmpeg: use the system one if present, else a private static build inside the venv (no Homebrew, no admin password)
if ! command -v ffmpeg >/dev/null && [ ! -x "$VK/.venv/bin/ffmpeg" ]; then
  uv pip install -q --python "$VK/.venv/bin/python" imageio-ffmpeg
  FFB=$("$VK/.venv/bin/python" -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())")
  ln -sf "$FFB" "$VK/.venv/bin/ffmpeg"; mkdir -p "$HOME/.local/bin"; ln -sf "$FFB" "$HOME/.local/bin/ffmpeg"
  echo "ffmpeg installed (private copy): $FFB"
fi
"$VK/.venv/bin/python" -c "from chatterbox.mtl_tts import ChatterboxMultilingualTTS as M; M.from_pretrained(device='cpu'); print('voice engine ready')"
echo ""
echo "Done. Try:  $VK/.venv/bin/python $SK/tools/voice.py --list"

# real sampled orchestra for tools/orchestra.py (Linux; on a Mac use score.py/groove.py instead)
command -v apt-get >/dev/null 2>&1 && (apt-get install -y -q fluidsynth fluid-soundfont-gm >/dev/null 2>&1 || sudo apt-get install -y -q fluidsynth fluid-soundfont-gm >/dev/null 2>&1) || true

# ---- optional: free AI music + SFX (Stable Audio Open Small, CPU). Needs a Hugging Face token for huggingface.co
# (env HF_TOKEN or a network secret) with the licence accepted at huggingface.co/stabilityai/stable-audio-open-small.
if [ -n "${WITH_SAO:-}" ]; then
  uv venv -q --python 3.11 "$HOME/sao/.venv"
  uv pip install -q --python "$HOME/sao/.venv/bin/python" --index-url https://download.pytorch.org/whl/cpu torch torchaudio
  uv pip install -q --python "$HOME/sao/.venv/bin/python" --no-deps stable-audio-tools pytorch-lightning lightning-utilities torchmetrics torchsde trampoline
  uv pip install -q --python "$HOME/sao/.venv/bin/python" einops einops-exts alias-free-torch safetensors huggingface_hub sentencepiece "transformers<4.50" soundfile numpy scipy PyWavelets
  echo "Stable Audio Open venv ready: ~/sao/.venv/bin/python <skill>/tools/sao.py \"prompt\" out.wav --secs 4"
fi
