#!/usr/bin/env bash
# Installs earshot from the vendored copy (third_party/earshot, MIT, github.com/Leonxlnx/earshot).
# Light install (sound bank, measure, kit: no models):   bash skills/earshot/bootstrap.sh
# Full install (describe/match/find/realness/timeline/critique need CLAP+AST models, ~1 GB download from huggingface.co):  bash skills/earshot/bootstrap.sh --models
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
python3 -m pip install --quiet numpy scipy soundfile soxr pyloudnorm scikit-learn pillow matplotlib librosa
python3 -m pip install --quiet --no-deps -e "$ROOT/third_party/earshot"
if [ "$1" = "--models" ]; then
  python3 -m pip install --quiet torch --index-url https://download.pytorch.org/whl/cpu
  python3 -m pip install --quiet transformers
  EARSHOT_THREADS=3 earshot doctor --load
fi
earshot sfx list | head -3
