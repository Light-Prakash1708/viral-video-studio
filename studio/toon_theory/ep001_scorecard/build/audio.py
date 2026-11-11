#!/usr/bin/env python3
"""EP001 audio: dialogue at the measured timeline + original groove (skills/viral-video-studio/tools/groove.py, code-synthesised)
+ SFX (earshot bank, MIT, and ElevenLabs SFX) -> duck / mix / loudnorm via studio/shorts_gen/audio_short.py."""
import sys, os, json, subprocess, shutil
import numpy as np, soundfile as sf
from scipy.io import wavfile
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, '/home/user/viral-video-studio/studio/shorts_gen')
import timeline, audio_short as A
SR = 44100; T, MK, VIS, DUR = timeline.build(); CL = timeline.CLIPS
AU = HERE + '/../audio'; N = int(DUR * SR)
# ---- dialogue
V = np.zeros(N)
for lid, (a, b) in T.items():
    y, sr = sf.read(f'{AU}/clips_t/{lid}.wav'); y = y if y.ndim == 1 else y.mean(1)
    act = np.abs(y) > .02 * np.abs(y).max(); rms = np.sqrt(np.mean(y[act] ** 2) + 1e-9)
    g = 10 ** (-21 / 20) / rms * (0.8 if lid == 'x_snort' else 1.0)
    i = int(a * SR); y = y[:max(0, N - i)] * g; V[i:i + len(y)] += y
wavfile.write(AU + '/voice_track.wav', SR, (np.clip(V, -1, 1) * 32767).astype(np.int16))
# ---- music (original, synthesised): comedic pop groove, lighter under the science, drops out for the big beats
plan = {'key': 'D', 'seed': 11, 'sections': [
    {'start': 0, 'end': MK['SCI'], 'style': 'pop', 'energy': .7, 'bpm': 112},
    {'start': MK['SCI'], 'end': MK['TWIST'], 'style': 'lofi', 'energy': .4},
    {'start': MK['TWIST'], 'end': MK['PAY'], 'style': 'pop', 'energy': .6, 'bpm': 112},
    {'start': MK['PAY'], 'end': DUR, 'style': 'pop', 'energy': .75, 'bpm': 112}],
  'events': [{'t': VIS['scratch'][0], 'type': 'stop', 'dur': VIS['scratch'][1] - VIS['scratch'][0] + .15},
             {'t': VIS['title'][0], 'type': 'impact'},
             {'t': T['x_snort'][0], 'type': 'stop', 'dur': 1.5},
             {'t': MK['TWIST'] - 1.0, 'type': 'riser', 'dur': 1.0},
             {'t': VIS['silence'][0] - .1, 'type': 'stop', 'dur': VIS['silence'][1] - VIS['silence'][0] + .3},
             {'t': T['p16'][0], 'type': 'stop', 'dur': .8},
             {'t': MK['END'], 'type': 'impact'}]}
json.dump(plan, open(AU + '/groove_plan.json', 'w'), indent=1)
env = dict(os.environ, GROWKAZ_STUDIO='/root/growkaz-stickman-studio')
subprocess.run(['python3', '/home/user/viral-video-studio/skills/viral-video-studio/tools/groove.py', AU + '/groove_plan.json', AU + '/music_raw.wav', str(DUR)], check=True, env=env)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', AU + '/music_raw.wav', '-ar', '44100', '-ac', '2', '-t', str(DUR), AU + '/music_track.wav'], check=True)
# ---- SFX: copy ElevenLabs SFX into the bank folder so audio_short can load them by id
bk = '/root/hf-shorts/sfx/bank'; os.makedirs(bk, exist_ok=True)
for f in os.listdir(AU + '/sfx'):
    if f.endswith('.mp3'):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{AU}/sfx/{f}', '-ac', '1', '-ar', '44100', f'{bk}/tt_{f[:-4]}.wav'], check=True)
fxd = json.load(open(AU + '/fx_events.json'))
ev = []
for t, k, g in fxd['fx']:
    if k.startswith('file:'): k = 'bank:tt_' + k[5:]
    ev.append((t, k, g))
os.makedirs(HERE + '/../final', exist_ok=True)
A.build('ep001s', AU + '/voice_track.wav', DUR, AU + '/music_track.wav', 0, ev, HERE + '/../final/ToonTheory_EP001_mix.wav', mgain_db=-25.5, duck_db=-9)
print('mix ok', DUR)
