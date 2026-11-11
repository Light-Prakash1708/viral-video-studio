#!/usr/bin/env python3
"""EP001 QC: probe, loudness, Whisper transcript vs locked script, SRT sanity, frame contact sheet. Run with the faster-whisper venv python."""
import sys, os, re, json, subprocess, difflib
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import timeline
T, MK, VIS, DUR = timeline.build(); CL = timeline.CLIPS
vid = sys.argv[1]; wav = HERE + '/../audio/ep001_mix.wav'
p = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', vid]))
for s in p['streams']: print(s['codec_type'], s.get('codec_name'), s.get('width'), s.get('height'), s.get('r_frame_rate'), s.get('duration'))
print('format duration', p['format']['duration'], 'size MB', round(int(p['format']['size']) / 1e6, 1))
o = subprocess.run(['ffmpeg', '-i', vid, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
for k in ('I:', 'LRA:', 'Peak:'): 
    m = [l for l in o.splitlines() if l.strip().startswith(k)]; print(m[-1].strip() if m else k + ' ?')
from faster_whisper import WhisperModel
m = WhisperModel('small', device='cpu', compute_type='int8')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', vid, '-ac', '1', '-ar', '16000', '/tmp/qc16k.wav'], check=True)
seg, _ = m.transcribe('/tmp/qc16k.wav', word_timestamps=True, language='en')
W = [(re.sub(r"[^a-z0-9']", '', w.word.lower()), w.start) for s in seg for w in s.words]; W = [w for w in W if w[0]]
exp = []
for lid, (a, b) in sorted(T.items(), key=lambda kv: kv[1][0]):
    for tok in CL[lid]['text'].split():
        n = re.sub(r"[^a-z0-9']", '', tok.lower()); 
        if n: exp.append(n)
NUM = {'1': 'one', '2': 'two', '4': 'four', '9': 'nine', '8': 'eight', '11': 'eleven'}
got = [NUM.get(w[0], w[0]) for w in W]
sm = difflib.SequenceMatcher(None, got, exp, autojunk=False)
print('transcript words', len(got), 'script words', len(exp), 'match ratio %.3f' % sm.ratio())
for tag, a1, a2, b1, b2 in sm.get_opcodes():
    if tag != 'equal': print('  diff', tag, 'heard:', got[a1:a2], 'script:', exp[b1:b2])
srt = open(HERE + '/../ep001.srt').read(); n = srt.count('-->')
print('srt cues', n)
os.makedirs(HERE + '/../qc', exist_ok=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', vid, '-vf', 'fps=1/9,scale=216:-1,tile=6x5', '-frames:v', '1', HERE + '/../qc/contact_sheet.jpg'], check=True)
print('contact sheet ->', HERE + '/../qc/contact_sheet.jpg')
