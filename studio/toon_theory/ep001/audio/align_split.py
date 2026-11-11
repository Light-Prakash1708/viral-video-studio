#!/usr/bin/env python3
"""Split each per-speaker ElevenLabs take into per-line clips using Whisper word timestamps.
usage: python align_split.py   (needs faster-whisper venv python; run with that interpreter)"""
import json, re, os, subprocess, difflib, sys
from lines import LINES
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); RAW = HERE + '/raw'; CL = HERE + '/clips'; os.makedirs(CL, exist_ok=True)
from faster_whisper import WhisperModel
m = WhisperModel('small', device='cpu', compute_type='int8')
NUM = {'1':'one','2':'two','3':'three','4':'four','8':'eight','9':'nine','11':'eleven'}
def norm(w):
    w = re.sub(r"[^a-z0-9']", '', w.lower()); return NUM.get(w, w)
out = {}
for spk, lines in LINES.items():
    wav = f'/tmp/{spk}_16k.wav'
    subprocess.run(['ffmpeg','-y','-v','error','-i',f'{RAW}/{spk}.mp3','-ac','1','-ar','16000',wav],check=True)
    seg,_ = m.transcribe(wav, word_timestamps=True, language='en', vad_filter=False)
    W = [(norm(w.word), w.start, w.end) for s in seg for w in s.words if norm(w.word)]
    exp = []; owner = []
    for lid, t in lines:
        for tok in t.split():
            n = norm(tok)
            if n: exp.append(n); owner.append(lid)
    sm = difflib.SequenceMatcher(None, [w[0] for w in W], exp, autojunk=False)
    emap = {}
    for a, b, size in sm.get_matching_blocks():
        for i in range(size): emap[b+i] = a+i
    print(spk, 'expected words', len(exp), 'matched', len(emap), 'whisper words', len(W))
    # per-line start/end from matched words, interpolating unmatched edges
    bounds = {}; wi = {}
    for lid, _ in lines:
        idx = [i for i, o in enumerate(owner) if o == lid]
        mm = [emap[i] for i in idx if i in emap]
        if mm: wi[lid] = (min(mm), max(mm))
    order = [l for l, _ in lines]
    for k, lid in enumerate(order):   # unmatched line: take the whisper words between its neighbours
        if lid in wi: continue
        lo = wi[order[k-1]][1] + 1 if k and order[k-1] in wi else 0
        nxt = [wi[o][0] for o in order[k+1:] if o in wi]
        hi = (nxt[0] - 1) if nxt else len(W) - 1
        if lo <= hi: wi[lid] = (lo, hi); print('  (recovered', lid, 'from words', [w[0] for w in W[lo:hi+1]], ')')
        else: print('  !! no match for', lid)
    for lid, (a, b) in wi.items(): bounds[lid] = (W[a][1], W[b][2])
    ids = [l for l, _ in lines if l in bounds]
    y, sr = sf.read(wav); y = y if y.ndim == 1 else y.mean(1)
    full, sr0 = sf.read(f'{RAW}/{spk}.mp3'); full = full if full.ndim == 1 else full.mean(1)
    for k, lid in enumerate(ids):
        s, e = bounds[lid]
        prev_e = bounds[ids[k-1]][1] if k else 0.0
        next_s = bounds[ids[k+1]][0] if k+1 < len(ids) else len(full)/sr0
        s0 = max(prev_e + (s - prev_e)/2, s - .12) if k else 0.0   # first line of a take: start at 0 (Whisper can miss the first word)
        e0 = min(e + (next_s - e)/2, e + .22)
        clip = full[int(s0*sr0):int(e0*sr0)]
        if sr0 != 44100: clip = resample_poly(clip, 44100, sr0)
        # tiny fades so clips never click
        n = len(clip); fi = min(int(.006*44100), n//4); fo = min(int(.03*44100), n//4)
        clip = clip.copy(); clip[:fi] *= np.linspace(0,1,fi); clip[-fo:] *= np.linspace(1,0,fo)
        sf.write(f'{CL}/{lid}.wav', clip, 44100, subtype='PCM_16')
        out[lid] = {'spk': spk, 'dur': round(len(clip)/44100, 3), 'text': dict(lines)[lid]}
json.dump(out, open(HERE + '/clips.json', 'w'), indent=1)
print('clips', len(out), 'total speech %.1fs' % sum(v['dur'] for v in out.values()))
for spk in LINES: print(' ', spk, '%.1fs' % sum(v['dur'] for v in out.values() if v['spk'] == spk))
