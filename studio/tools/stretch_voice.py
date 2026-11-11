#!/usr/bin/env python3
"""stretch_voice.py - lengthen a finished narration WITHOUT new TTS credits by inserting silent pauses between sentences,
and shift the word timings to match (so visuals get time to demonstrate an idea).
usage: stretch_voice.py --voice voice.mp3 --words words.json --cut 11.4:1.0 --cut 12.35:3.6 --out-wav v2.wav --out-words words2.json
Each --cut OLD_TIME:SECONDS inserts SECONDS of silence at the middle of the gap nearest after OLD_TIME (old timeline).
Prints the new pause windows (new timeline) and the new length. words.json = [{"w":..,"s":..,"e":..}] from Whisper.
"""
import argparse, json, subprocess, numpy as np
from scipy.io import wavfile
ap = argparse.ArgumentParser(); ap.add_argument("--voice", required=True); ap.add_argument("--words", required=True); ap.add_argument("--cut", action="append", required=True)
ap.add_argument("--out-wav", required=True); ap.add_argument("--out-words", required=True); a = ap.parse_args()
SR = 44100
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", a.voice, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
v = np.frombuffer(raw, dtype=np.float32); W = json.load(open(a.words))
def mid(t):
    prev = max((w for w in W if w["e"] <= t + .001), key=lambda w: w["e"], default=None)
    nxt = min((w for w in W if w["s"] > (prev["s"] if prev else -1)), key=lambda w: w["s"])
    return (prev["e"] + nxt["s"]) / 2
cuts = sorted((mid(float(c.split(":")[0])), float(c.split(":")[1])) for c in a.cut)
out, pos = [], 0
for c, g in cuts: out += [v[int(pos * SR):int(c * SR)], np.zeros(int(g * SR), dtype=v.dtype)]; pos = c
out.append(v[int(pos * SR):]); y = np.concatenate(out)
wavfile.write(a.out_wav, SR, (y * 32767).astype(np.int16))
T = lambda t: t + sum(g for c, g in cuts if c < t)
json.dump([{"w": w["w"], "s": round(T(w["s"]), 3), "e": round(T(w["e"]), 3)} for w in W], open(a.out_words, "w"))
acc, wins = 0, []
for c, g in cuts: wins.append((round(c + acc, 2), round(c + acc + g, 2))); acc += g
print("new length %.2f s; pause windows (new time): %s" % (len(y) / SR, wins))
