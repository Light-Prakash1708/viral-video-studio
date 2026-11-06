"""qc.py: final-video QC in one command: duration, loudness (target -14 LUFS), voice-above-bed dB (target >= 12),
Whisper words understood vs the script (target >= 95%), and a contact sheet (one frame every N s) to LOOK at.
usage: python3 qc.py FINAL.mp4 VOICEOVER.wav SCRIPT.txt [EVERY=6]
"""
import subprocess, sys, re, difflib, numpy as np
V, VO, SC = sys.argv[1:4]; EV = float(sys.argv[4]) if len(sys.argv) > 4 else 6
def load(p):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', p, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
print(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,width,height,duration', '-of', 'csv=p=0', V], capture_output=True, text=True).stdout.strip())
lu = subprocess.run(['ffmpeg', '-i', V, '-af', 'ebur128=framelog=quiet', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('loudness', re.findall(r'I:\s+(-?[\d.]+) LUFS', lu)[-1], 'LUFS')
mix, vo = load(V), load(VO); n = min(len(mix), len(vo)); hop = 1600; db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
k = np.dot(mix[:n], vo[:n]) / np.dot(vo[:n], vo[:n]); res = mix[:n] - k * vo[:n]
vf = np.array([db(vo[i:i + hop]) for i in range(0, n - hop, hop)]); rf = np.array([db(res[i:i + hop]) for i in range(0, n - hop, hop)]); sp = vf > -35
print(f'voice above bed: {np.mean(vf[sp]) + 20 * np.log10(k) - np.mean(rf[sp]):.1f} dB')
from faster_whisper import WhisperModel
segs, _ = WhisperModel('small', device='cpu', compute_type='int8').transcribe(mix, language='en')
heard = re.findall(r"[a-z0-9']+", ' '.join(s.text for s in segs).lower()); script = re.findall(r"[a-z0-9']+", open(SC).read().lower())
m = sum(b.size for b in difflib.SequenceMatcher(None, script, heard, autojunk=False).get_matching_blocks())
print(f'words understood: {m}/{len(script)} ({100 * m / len(script):.1f}%)  (digits read as words count as misses)')
out = V.rsplit('.', 1)[0] + '_qc.png'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', V, '-vf', f'fps=1/{EV},scale=320:-1,tile=8x5', '-frames:v', '1', out]); print('contact sheet:', out)
