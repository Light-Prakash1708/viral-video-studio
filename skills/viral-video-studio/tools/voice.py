"""Local voice-over, no API: script.txt -> mastered voiceover.wav with the studio's house voices.

Engine: Chatterbox Multilingual (Resemble AI, MIT) cloning an ORIGINAL synthetic timbre seed made with
Kokoro (Apache-2.0). Never seed it with a real person's or an ElevenLabs library voice without that
person's consent (your own recorded voice is fine: --seed my_voice.wav).

usage (run with the voicekit venv python):
  ~/voicekit/.venv/bin/python voice.py --script input/script.txt --voice storyteller --out input/voiceover.wav
  options: --lang en|hi (default from preset)  --seed FILE.wav (custom timbre)  --takes 2 (best-of-N per line, scored by Whisper)
           --list (show presets)
Script rules: one sentence per line or normal prose; a blank line = paragraph pause.
Inline pauses: "..." gives a beat; "[pause]" on its own line = 0.8 s of silence.

MULTI-VOICE (one render, every character its own voice, zero API credits):
  @voice KABIR desi-narrator pitch=-1 speed=1.0      <- declare once at the top (preset from voices.json, or a .wav seed)
  @voice RIYA  gentle pitch=+1.5
  @voice KID   storyteller pitch=+4 speed=1.08       <- pitch in semitones (formant-preserving), speed = tempo
  @voice DADI  hindi-f lang=hi pitch=-2
  Narration lines have no tag. Character lines start with the name:
  KABIR: Bro, how did you know?
  RIYA: "Because the number never lies."
Writes OUT plus OUT.lines.json (who speaks when) so shots can cut to the speaker and captions can colour by speaker.
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
_venv_ff = os.path.join(os.path.dirname(sys.executable), 'ffmpeg')
FF = shutil.which('ffmpeg') or (_venv_ff if os.path.exists(_venv_ff) else 'ffmpeg')
VOICES = json.load(open(os.path.join(HERE, 'voices', 'voices.json')))

ap = argparse.ArgumentParser()
ap.add_argument('--script'); ap.add_argument('--out'); ap.add_argument('--voice', default='storyteller')
ap.add_argument('--lang'); ap.add_argument('--seed'); ap.add_argument('--takes', type=int, default=1)
ap.add_argument('--list', action='store_true'); ap.add_argument('--no-master', action='store_true')
ap.add_argument('--tight', action='store_true', help='viral pacing: cap pauses inside lines at 0.22 s and between lines at the preset gap')
a = ap.parse_args()
if a.list:
    for k, v in VOICES.items(): print(f"{k:14s} {v['lang']}  {v['desc']}")
    sys.exit()
P = dict(VOICES[a.voice]); lang = a.lang or P['lang']
seed = a.seed or os.path.join(HERE, 'voices', P['seed'])

import torch, torchaudio as ta
torch.set_num_threads(os.cpu_count() or 4)
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
m = ChatterboxMultilingualTTS.from_pretrained(device='cpu'); SR = m.sr

# ---- split script into lines with the pause that follows each ----
raw = open(a.script, encoding='utf-8').read().strip()
SPK = {'NARRATOR': {'preset': a.voice, 'pitch': 0.0, 'speed': float(VOICES[a.voice].get('speed', 1.0)), 'lang': lang, 'seed': seed}}
body = []
for ln in raw.split('\n'):
    mm = re.match(r'^@voice\s+(\w+)\s+(\S+)(.*)$', ln.strip())
    if mm:
        nm, pv, rest = mm.group(1).upper(), mm.group(2), mm.group(3)
        kv = dict(re.findall(r'(\w+)=(\S+)', rest)); pr = VOICES.get(pv, {})
        SPK[nm] = {'preset': pv, 'pitch': float(kv.get('pitch', 0)), 'speed': float(kv.get('speed', 1)),
                   'lang': kv.get('lang', pr.get('lang', lang)),
                   'seed': pv if pv.endswith('.wav') else os.path.join(HERE, 'voices', pr['seed'])}
        continue
    body.append(ln)
raw = '\n'.join(body).strip()
def speaker_of(line):
    mm = re.match(r'^([A-Z][A-Z0-9_]{1,20}):\s*(.+)$', line.strip())
    return (mm.group(1), mm.group(2).strip().strip('"“”')) if mm and mm.group(1) in SPK else ('NARRATOR', line)
items = []  # (text, pause_after, speaker)
for para in re.split(r'\n\s*\n', raw):
    para = para.strip()
    if not para: continue
    if para.lower() == '[pause]': items.append(('', 0.8, 'NARRATOR')); continue
    for ln in [x for x in para.split('\n') if x.strip()]:
        who, ln = speaker_of(ln)
        if ln.strip().lower() == '[pause]': items.append(('', 0.8, who)); continue
        sents = [s.strip() for s in re.split(r'(?<=[.!?।])\s+', ln) if s.strip()]
        # group short sentences of the same speaker so the model keeps a natural flow (max ~220 chars per call)
        buf = ''
        for s in sents:
            if len(buf) + len(s) > 220 and buf: items.append((buf, 0.2, who)); buf = s
            else: buf = (buf + ' ' + s).strip()
        if buf: items.append((buf, 0.25 if who != 'NARRATOR' else 0.2, who))
    if items: items[-1] = (items[-1][0], P.get('paragraphGap', 0.45), items[-1][2])

def trim(w, thr=0.012, pad=0.04):
    e = np.abs(w); idx = np.where(e > thr)[0]
    if not len(idx): return w[:0]
    i = max(0, idx[0] - int(pad * SR)); j = min(len(w), idx[-1] + int(pad * 2.5 * SR)); return w[i:j]

scorer = None
def score(w, text):
    global scorer
    if a.takes < 2: return 0
    try:
        from faster_whisper import WhisperModel
    except ImportError:  # best-of-N needs faster-whisper; without it keep the first good-length take
        return 0
    import difflib
    if scorer is None: scorer = WhisperModel('small', device='cpu', compute_type='int8')
    with tempfile.NamedTemporaryFile(suffix='.wav') as f:
        ta.save(f.name, torch.tensor(w)[None], SR)
        segs, _ = scorer.transcribe(f.name, language=lang)
        hyp = ' '.join(s.text for s in segs)
    n = lambda s: re.sub(r'[^\w\s]', '', s.lower()).split()
    return difflib.SequenceMatcher(None, n(text), n(hyp)).ratio()

def shape(w, pitch, speed):
    """formant-preserving pitch (semitones) + tempo per character, via ffmpeg rubberband"""
    if abs(pitch) < 0.05 and abs(speed - 1) < 0.005: return w
    with tempfile.TemporaryDirectory() as d:
        i, o = os.path.join(d, 'i.wav'), os.path.join(d, 'o.wav'); ta.save(i, torch.tensor(w)[None], SR)
        r = subprocess.run([FF, '-v', 'error', '-y', '-i', i, '-af', f'rubberband=pitch={2 ** (pitch / 12):.5f}:tempo={speed:.4f}:formant=preserved', o])
        if r.returncode != 0:  # ffmpeg without librubberband (e.g. the private static build): resample pitch + atempo
            k = 2 ** (pitch / 12); subprocess.run([FF, '-v', 'error', '-y', '-i', i, '-af', f'asetrate={int(SR * k)},aresample={SR},atempo={max(0.5, min(2.0, speed / k)):.4f}', o], check=True)
        return ta.load(o)[0][0].numpy()
out, lines, cur = [], [], 0.15  # 0.15 = adelay lead-in added by mastering
def tighten(w, cap=0.22):
    # viral pacing: shorten every silence inside a line to <= cap seconds (measured refs: no pause > 0.5 s, 200-240 wpm)
    fr = int(0.01 * SR); env = np.array([np.abs(w[i:i + fr]).max() if i + fr <= len(w) else 0 for i in range(0, len(w), fr)])
    thr = max(1e-4, 0.03 * env.max()); keep = []; run = 0
    for j, v in enumerate(env):
        if v > thr: run = 0; keep.append(j)
        else:
            run += 1
            if run * 0.01 <= cap: keep.append(j)
    return np.concatenate([w[j * fr:(j + 1) * fr] for j in keep]) if keep else w
for k, (text, gap, who) in enumerate(items):
    if text and (a.tight or VOICES.get(SPK[who]['preset'], P).get('tight')): gap = min(gap, VOICES.get(SPK[who]['preset'], P).get('paragraphGap', 0.14))
    if text:
        sp = SPK[who]; pr = VOICES.get(sp['preset'], P)
        best, bs = None, -1
        # run-on guard: Chatterbox sometimes keeps babbling after short lines. Expected length ~ 14 chars/s
        # (Devanagari ~ 11); a take longer than 1.7x + 1 s is re-rolled (up to 4 tries), then hard-trimmed.
        cps = 11.0 if sp['lang'] == 'hi' else 14.0; exp_len = len(text) / cps + 0.5; lim = exp_len * 1.7 + 1.0
        tries, take = 0, 0
        while take < max(1, a.takes) or (best is not None and len(best) / SR > lim and tries < 4):
            torch.manual_seed(1000 * k + 97 * tries + take + pr.get('seedOffset', 0))
            w = m.generate(text, language_id=sp['lang'], audio_prompt_path=sp['seed'], exaggeration=pr.get('exaggeration', 0.5),
                           cfg_weight=pr.get('cfg', 0.45), temperature=pr.get('temperature', 0.8))[0].numpy()
            w = trim(w); dur = len(w) / SR
            s = score(w, text) - (0.5 if dur > lim else 0)
            if s > bs or best is None or (len(best) / SR > lim and dur <= lim): best, bs = w, s
            if dur > lim: tries += 1
            else: take += 1
            if a.takes > 1 and s > 0.97 and dur <= lim: break
            if tries >= 4: break
        if len(best) / SR > lim:  # last resort: cut at the expected length with a short fade
            n = int(exp_len * 1.25 * SR); best = best[:n].copy(); f = int(0.12 * SR); best[-f:] *= np.linspace(1, 0, f)
        if a.tight or pr.get('tight'): best = tighten(best)
        best = shape(best, sp['pitch'], sp['speed'])
        lines.append({'speaker': who, 'text': text, 'start': round(cur, 3), 'end': round(cur + len(best) / SR, 3)})
        out.append(best); cur += len(best) / SR
        print(f'[{k + 1}/{len(items)}] {who:9s} {len(best) / SR:5.2f}s  {text[:56]}', flush=True)
    out.append(np.zeros(int(gap * SR), np.float32)); cur += gap
wav = np.concatenate(out).astype(np.float32)

tmp = tempfile.mktemp(suffix='.wav'); ta.save(tmp, torch.tensor(wav)[None], SR)
if a.no_master: os.replace(tmp, a.out)
else:
    # light broadcast mastering: rumble cut, warmth, presence, gentle compression, peak safety, lead-in/out
    af = ('highpass=f=70,equalizer=f=200:t=q:w=1.0:g=1.0,equalizer=f=3500:t=q:w=1.2:g=1.5,'
          'acompressor=threshold=-20dB:ratio=2.2:attack=8:release=150:makeup=1.5,'
          + ('loudnorm=I=-16:TP=-1.5:LRA=9,alimiter=limit=0.92,adelay=150,apad=pad_dur=1.6' if not P.get('tight') else 'deesser=i=0.3,equalizer=f=3200:t=q:w=1.2:g=2,highshelf=f=6000:g=2.5,loudnorm=I=-15:TP=-1.5:LRA=7,alimiter=limit=0.92,adelay=60,apad=pad_dur=0.6'))
    subprocess.run([FF, '-v', 'error', '-y', '-i', tmp, '-af', af, '-ar', '48000', '-ac', '1', a.out], check=True)
    os.remove(tmp)
json.dump({'speakers': {k: {kk: vv for kk, vv in v.items() if kk != 'seed'} for k, v in SPK.items()}, 'lines': lines}, open(a.out + '.lines.json', 'w'), indent=1, ensure_ascii=False)
print('wrote', a.out, f'{len(wav) / SR:.1f}s', f'({len(SPK)} voices)')
