#!/usr/bin/env python3
"""sao.py: free AI music + sound effects with Stable Audio Open Small (stabilityai/stable-audio-open-small).
Runs on CPU (341M params, 8 diffusion steps, ~11 s of 44.1 kHz stereo per call). Licence: Stability AI Community
Licence (free incl. commercial use under $1M annual revenue). Needs a Hugging Face token for huggingface.co with the
model licence accepted, and the venv from setup:  ~/sao/.venv  (see SKILL.md "Free AI music + SFX").

  ~/sao/.venv/bin/python sao.py "wooden door creaks open slowly, close mic" door.wav --secs 4
  ~/sao/.venv/bin/python sao.py --batch prompts.json --outdir audio/sfxlib     # [{"name":"door","prompt":"...","secs":3,"n":3}]
  ~/sao/.venv/bin/python sao.py --music plan.json out.wav DURATION              # long music: chained 10 s blocks, crossfaded

Prompt tips (the model was trained on Freesound + FMA): name the sound source, the action, the space and the mic
("glass shatters on a stone floor, close, dry"); for music give genre, instruments, mood, tempo ("epic cinematic
orchestra, taiko drums and low brass, heroic, 100 BPM"). It cannot do vocals or speech.
"""
import argparse, json, os, sys, numpy as np, torch, soundfile as sf
torch.set_num_threads(os.cpu_count() or 4)
from stable_audio_tools import get_pretrained_model
from stable_audio_tools.inference.generation import generate_diffusion_cond

_M = {}
def model():
    if not _M:
        m, cfg = get_pretrained_model('stabilityai/stable-audio-open-small'); _M['m'] = m.eval(); _M['cfg'] = cfg
    return _M['m'], _M['cfg']

def gen(prompt, secs=10.0, seed=0, steps=8):
    m, cfg = model(); sr = cfg['sample_rate']; n = cfg['sample_size']
    torch.manual_seed(seed)
    with torch.inference_mode():
        out = generate_diffusion_cond(m, steps=steps, cfg_scale=1.0, conditioning=[{'prompt': prompt, 'seconds_total': float(min(secs, 11))}],
                                      sample_size=n, sampler_type='pingpong', device='cpu', seed=seed)
    a = out[0].float().numpy().T[: int(min(secs, 11) * sr)]
    pk = np.abs(a).max() or 1; a = a / pk * 0.9
    f = int(0.01 * sr); a[-f:] *= np.linspace(1, 0, f)[:, None]
    return a, sr

def save(a, sr, path, target_sr=48000):
    import subprocess, tempfile
    t = tempfile.mktemp(suffix='.wav'); sf.write(t, a, sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', t, '-ar', str(target_sr), '-ac', '2', path], check=True); os.remove(t)

def music(plan, out, dur):
    # plan: {"sections":[{"start":0,"end":20,"prompt":"..."}], "seed": 1}; each section = chained 10 s blocks with 1 s crossfades
    sr0 = None; tot = None; xf = 1.0
    for si, sec in enumerate(plan['sections']):
        L = min(sec['end'], dur) - sec['start']; t = 0; blocks = []
        while t < L:
            a, sr0 = gen(sec['prompt'], 10.0, seed=plan.get('seed', 1) * 100 + si * 10 + len(blocks)); blocks.append(a); t += 10 - xf
        if tot is None: tot = np.zeros((int(dur * sr0) + sr0 * 12, 2))
        pos = int(sec['start'] * sr0); F = int(xf * sr0); ramp = np.linspace(0, 1, F)[:, None]
        for b in blocks:
            b = b.copy(); b[:F] *= ramp; b[-F:] *= ramp[::-1]; tot[pos:pos + len(b)] += b; pos += len(b) - F
        pass  # sections are contiguous; their 1 s crossfades overlap at the joins
    tot = tot[: int(dur * sr0)]; save(tot / (np.abs(tot).max() or 1) * 0.9, sr0, out); print('wrote', out, dur)

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('prompt', nargs='?'); ap.add_argument('out', nargs='?'); ap.add_argument('dur', nargs='?', type=float)
    ap.add_argument('--secs', type=float, default=10); ap.add_argument('--seed', type=int, default=0); ap.add_argument('--steps', type=int, default=8)
    ap.add_argument('--batch'); ap.add_argument('--outdir', default='.'); ap.add_argument('--music', action='store_true')
    a = ap.parse_args()
    if a.batch:
        for it in json.load(open(a.batch)):
            d = os.path.join(a.outdir, it['name']); os.makedirs(d, exist_ok=True)
            for k in range(it.get('n', 2)):
                x, sr = gen(it['prompt'], it.get('secs', 4), seed=a.seed + k); p = os.path.join(d, f'sao_{k + 1}.wav'); save(x, sr, p); print('wrote', p)
    elif a.music:
        music(json.load(open(a.prompt)), a.out, a.dur)
    else:
        x, sr = gen(a.prompt, a.secs, a.seed, a.steps); save(x, sr, a.out); print('wrote', a.out)
