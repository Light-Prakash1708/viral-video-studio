# assemble the final voice-over: ElevenLabs narration + local character lines + cinematic holds.
# writes ../input/voiceover.wav and lines.json (who speaks when, in final time)
import json, subprocess, numpy as np
SR = 48000
def load(p, af=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', p] + (['-af', af] if af else []) + ['-ar', str(SR), '-ac', '1', '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).copy()
def rms(x):
    v = x[np.abs(x) > 0.01]; return np.sqrt((v ** 2).mean()) if len(v) else 1e-4
segs = json.load(open('segments.json'))
narr = load('narr.mp3'); NR = rms(narr)
FX = {'M7': 'highpass=f=160,aecho=0.8:0.6:7|13:0.22|0.12,acrusher=bits=11:mix=0.12,lowpass=f=7600',
      'WALT': 'highpass=f=75,equalizer=f=2800:t=q:w=1.3:g=2.5,equalizer=f=180:t=q:w=1.0:g=1.0', 'MAYA': 'highpass=f=120'}
def dlg(i, spk):
    x = np.nan_to_num(load(f'd_{i:02d}_{spk}.wav', FX[spk])); return x * (NR / rms(x)) * (0.95 if spk == 'M7' else 1.0)
# (cut time in narration, list of inserts) ; an insert is ('D', seg index) or ('H', seconds of hold)
PLAN = [(5.88 + 0.25, [('H', 3.8)]),
        (59.34 + 0.3, [('D', 1), ('H', 0.45), ('D', 2), ('H', 0.3)]),
        (92.08 + 0.3, [('D', 4), ('H', 0.4), ('D', 5), ('H', 0.3)]),
        (104.42 + 0.3, [('H', 0.9)]), (109.78 + 0.3, [('H', 0.6)]),
        (119.68 + 0.3, [('D', 7), ('H', 0.35)]),
        (121.02 + 0.3, [('D', 9), ('H', 0.5), ('D', 10), ('H', 0.5), ('D', 11), ('H', 0.4)]),
        (126.40 + 0.35, [('H', 2.6)]),
        (153.66 + 0.3, [('D', 13), ('H', 1.2)]), (158.66 + 0.25, [('H', 1.0)]), (176.68 + 0.35, [('H', 1.6)])]
out, lines, mapping, pos, cur = [np.zeros(int(0.6 * SR), np.float32)], [], [], 0.0, 0.6   # 0.6 s lead-in
for cut, ins in PLAN:
    a, b = int(pos * SR), int(cut * SR); out.append(narr[a:b]); mapping.append((pos, cut, cur)); cur += cut - pos; pos = cut
    for kind, v in ins:
        if kind == 'H': out.append(np.zeros(int(v * SR), np.float32)); cur += v
        else:
            spk = segs[v][0]; x = dlg(v, spk); out.append(x); lines.append({'speaker': spk, 'seg': v, 'text': segs[v][1], 'start': round(cur, 3), 'end': round(cur + len(x) / SR, 3)}); cur += len(x) / SR
out.append(narr[int(pos * SR):]); mapping.append((pos, len(narr) / SR, cur)); cur += len(narr) / SR - pos
out.append(np.zeros(int(4.0 * SR), np.float32)); cur += 4.0
wav = np.concatenate(out)
open('vo_raw.f32', 'wb').write(wav.astype(np.float32).tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', 'vo_raw.f32', '-af',
                'highpass=f=70,equalizer=f=200:t=q:w=1.0:g=1.0,equalizer=f=3500:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=2.2:attack=8:release=150:makeup=1.5,alimiter=limit=0.92',
                '../input/voiceover.wav'], check=True)
json.dump({'lines': lines, 'map': mapping, 'duration': round(cur, 3)}, open('lines.json', 'w'), indent=1)
print('voiceover', round(cur, 2), 's', len(lines), 'dialogue lines')
