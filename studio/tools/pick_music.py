#!/usr/bin/env python3
"""tools/pick_music.py: find, measure and rank licence-safe background music from Openverse, then cut the best section to the video.

House rule (all channels): every video gets a real music bed picked here (fast-paced edits + good music = more views).
The music must FIT THE SCRIPT, not just be loud: read the script first, decide the mood of each section (hook, build-up,
reveal, payoff), and pass that mood map with --sections. Emotional/suspense sections are ranked for steadiness and a
gentle pulse, not for energy; hype/comedy/dark sections for tempo and a strong beat. Instrumental tracks only (vocals fight
the voice-over): queries add "instrumental" and titles with "instrumental" get a bonus.
I can't listen, so tracks are ranked by MEASUREMENT (tempo, beat strength, energy, how steady the energy is) — the owner can
still swap the pick by ear: all candidates are kept in <out>/music_candidates/ with a table in candidates.json.

  python3 studio/tools/pick_music.py --mood hype --dur 95 --out <project>/audio
  python3 studio/tools/pick_music.py --query "dark phonk" --query "trap beat" --dur 48 --out ... --bpm 120-160
  python3 studio/tools/pick_music.py --use <openverse_id> --dur 95 --out ...      # skip ranking, use a known track
  python3 studio/tools/pick_music.py --file a.mp3 --file b.mp3 --mood comedy --dur 95 --out ... --credit "Music by X from Pixabay (Pixabay Content License) <url>"
  python3 studio/tools/pick_music.py --sections "0-31:comedy,31-60:quirky,60-96:emotional" --out ...
      # one track per section, joined with 1.2 s crossfades at the section borders (mood changes with the story)

Moods: hype, comedy, dark, suspense, emotional, chill, epic, quirky (or pass --query several times).
Licences: CC0 / public-domain mark / CC BY only (commercial use + modification allowed). BY-SA, NC and ND are never used
(ShareAlike would attach to the whole video). CC BY credit lines go to <out>/ATTRIBUTION.txt -> paste them in the description.
Output: <out>/music_pick.wav (stereo 44.1k, best window of --dur seconds starting on a strong downbeat, 0.4 s fade-in,
1.5 s fade-out), <out>/music_pick.json (track, licence, attribution, window, measurements).
Content ID note: CC tracks from Jamendo artists are occasionally registered with Content ID by distributors; keep the
Openverse/Jamendo URL in music_pick.json to dispute, and prefer CC0 when two candidates score close.
"""
import argparse, json, os, subprocess, sys, shutil
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from free_media import audio_search, getj, dl, credit

MOODS = {
    'hype': ['energetic electronic', 'upbeat edm', 'hip hop beat', 'energetic rock', 'dance pop'],
    'comedy': ['funny upbeat', 'quirky pop', 'playful ukulele', 'comedy', 'happy upbeat'],
    'quirky': ['quirky', 'playful', 'pizzicato funny', 'whimsical upbeat'],
    'dark': ['dark trap', 'phonk', 'dark electronic', 'dark hip hop', 'aggressive beat'],
    'suspense': ['suspense', 'tension cinematic', 'thriller', 'dark ambient pulse'],
    'emotional': ['emotional piano', 'sad cinematic', 'inspiring piano', 'emotional strings'],
    'chill': ['lofi hip hop', 'chill beat', 'chillhop', 'relaxed groove'],
    'epic': ['epic cinematic', 'epic orchestral', 'trailer music', 'heroic'],
}
BPM_DEFAULT = {'hype': (110, 160), 'comedy': (95, 140), 'quirky': (90, 140), 'dark': (120, 170), 'suspense': (80, 140),
               'emotional': (60, 110), 'chill': (70, 100), 'epic': (80, 140)}
# per-mood ranking weights: (tempo fit, beat strength, steadiness, length) ; target loudness of the chosen window (dB rms)
WEIGHTS = {'hype': (35, 30, 20, 15), 'comedy': (30, 30, 25, 15), 'quirky': (30, 25, 30, 15), 'dark': (30, 35, 20, 15), 'epic': (25, 25, 35, 15),
           'suspense': (25, 15, 45, 15), 'emotional': (20, 5, 60, 15), 'chill': (30, 15, 40, 15)}
SR = 22050

def decode(path, sr=SR, ch=1):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', str(ch), '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    y = np.frombuffer(raw, np.float32)
    return y.reshape(-1, ch) if ch > 1 else y

def analyse(y, dur):
    hop = 512; n = len(y) // hop
    fr = y[:n * hop].reshape(n, hop)
    rms = np.sqrt((fr ** 2).mean(1) + 1e-12)
    spec = np.abs(np.fft.rfft(fr * np.hanning(hop), axis=1))
    flux = np.maximum(0, np.diff(np.log1p(spec), axis=0)).sum(1); flux = np.r_[0, flux]
    fps = SR / hop
    # tempo: autocorrelation of the onset envelope, 60-190 bpm, octave-folded
    o = flux - flux.mean(); ac = np.correlate(o, o, 'full')[len(o) - 1:]
    lags = np.arange(len(ac)); bpm = 60 * fps / np.maximum(lags, 1)
    m = (bpm >= 60) & (bpm <= 190)
    lag = lags[m][np.argmax(ac[m])]; tempo = 60 * fps / lag
    beat_strength = float(ac[lag] / (ac[0] + 1e-9))
    # best window of `dur` seconds: high, steady energy; start on a strong onset
    w = int(dur * fps)
    if n <= w: start = 0
    else:
        cs = np.r_[0, np.cumsum(rms)]; win = (cs[w:] - cs[:-w]) / w
        cand = np.argsort(win)[::-1][:40]
        start = int(max(cand[:1], key=lambda s: win[s]))
        k0 = max(0, start - int(fps)); k1 = min(n - 1, start + int(fps))
        start = k0 + int(np.argmax(flux[k0:k1]))      # snap to the strongest hit near it
    seg = rms[start:start + w]
    energy_db = float(20 * np.log10(np.median(seg) + 1e-9))
    steady = float(1 - min(1, np.std(20 * np.log10(seg + 1e-9)) / 12))      # 1 = no long quiet holes
    quiet = float((20 * np.log10(seg + 1e-9) < energy_db - 15).mean())
    return dict(tempo=round(float(tempo), 1), beat=round(beat_strength, 3), energy_db=round(energy_db, 1), steady=round(steady, 3),
                quiet_frac=round(quiet, 3), start=round(start / fps, 2), track_sec=round(len(y) / SR, 1))

def score(a, bpm_lo, bpm_hi, dur, mood='hype', title=''):
    t = a['tempo']; folded = min([t, t * 2, t / 2], key=lambda x: 0 if bpm_lo <= x <= bpm_hi else min(abs(x - bpm_lo), abs(x - bpm_hi)))
    tempo_fit = 1.0 if bpm_lo <= folded <= bpm_hi else max(0, 1 - min(abs(folded - bpm_lo), abs(folded - bpm_hi)) / 30)
    length_fit = 1.0 if a['track_sec'] >= dur else max(0, a['track_sec'] / dur - .3)
    wt, wb, ws, wl = WEIGHTS.get(mood, WEIGHTS['hype'])
    bonus = 5 if 'instrumental' in (title or '').lower() else 0
    return round(wt * tempo_fit + wb * min(1, a['beat'] / .5) + ws * a['steady'] + wl * length_fit - 40 * a['quiet_frac'] + bonus, 1)

def cut(src, out_wav, start, dur):
    fo = min(1.5, dur / 4)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(start), '-t', str(dur), '-i', src, '-ac', '2', '-ar', '44100',
                    '-af', f'afade=t=in:d=0.4,afade=t=out:st={max(0, dur - fo):.2f}:d={fo:.2f},loudnorm=I=-16:TP=-1.5:LRA=9', out_wav], check=True)

def pick(mood, queries, dur, out, n, bpm, licenses, use=None, tag=''):
    cdir = os.path.join(out, 'music_candidates'); os.makedirs(cdir, exist_ok=True)
    lo, hi = map(float, bpm.split('-')) if bpm else BPM_DEFAULT.get(mood, (90, 150))
    rows = []
    if use: recs = [getj(f'https://api.openverse.org/v1/audio/{use}/')]
    else:
        seen, recs = set(), []
        for q in (queries or MOODS.get(mood, [mood])):
            for qq in (q + ' instrumental', q):
                try: res = audio_search(qq, n, min(60, dur * .6), licenses, 'jamendo')
                except Exception as e: print('search failed', qq, e); continue
                for r, _ in res:
                    if r['id'] not in seen and r.get('license') in ('cc0', 'pdm', 'by'): seen.add(r['id']); recs.append(r)
        recs = recs[:n * 2]
    for r in recs:
        path = os.path.join(cdir, r['id'] + '.mp3')
        try:
            if not os.path.exists(path): dl(r['url'], path)
            an = analyse(decode(path), dur)
        except Exception as e: print('skip', r.get('title'), e); continue
        an['score'] = score(an, lo, hi, dur, mood, r.get('title'))
        rows.append(dict(id=r['id'], title=r.get('title'), creator=r.get('creator'), license=r.get('license'), license_version=r.get('license_version'),
                         url=r.get('foreign_landing_url'), attribution=r.get('attribution'), path=path, mood=mood, **an))
        print(f"[{mood}] {an['score']:6.1f}  {an['tempo']:6.1f}bpm beat {an['beat']:.2f} steady {an['steady']:.2f} quiet {an['quiet_frac']:.2f}  {r['license'].upper():4s} {(r.get('title') or '')[:40]} - {r.get('creator')}")
    if not rows: sys.exit(f'no usable tracks for {mood}; try other --query words')
    rows.sort(key=lambda x: (-x['score'], x['license'] != 'cc0'))
    json.dump(rows, open(os.path.join(out, f'candidates{tag}.json'), 'w'), indent=1)
    best = rows[0]; best['window_start'] = best['start'] if best['track_sec'] > dur else 0; best['window_dur'] = dur
    if best['license'] == 'by': credit(out, best.get('attribution') or f"{best['title']} by {best['creator']} (CC BY) {best['url']}")
    else: credit(out, f"Music: {best['title']} by {best['creator']} ({best['license'].upper()}) {best['url']}")
    print(f"PICK [{mood}]: {best['title']} - {best['creator']} [{best['license'].upper()}] score {best['score']} tempo {best['tempo']} (from {best['window_start']}s)")
    if best['track_sec'] < dur: print('NOTE: track shorter than the section; loop it at a bar line or pick the next candidate.')
    return best

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--mood', default='hype'); ap.add_argument('--query', action='append'); ap.add_argument('--dur', type=float)
    ap.add_argument('--sections', help='"start-end:mood,..." in seconds, covering the whole video')
    ap.add_argument('--out', required=True); ap.add_argument('--n', type=int, default=8); ap.add_argument('--bpm'); ap.add_argument('--use')
    ap.add_argument('--licenses', default='cc0,pdm,by')
    ap.add_argument('--file', action='append', help='local track(s), e.g. downloaded from pixabay.com/music: measured and cut the same way; credit line from --credit')
    ap.add_argument('--credit', default='')
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
    out_wav = os.path.join(a.out, 'music_pick.wav')
    if a.file:   # local tracks (Pixabay music etc.): rank by the same measurements, cut the best window
        if not a.dur: sys.exit('--dur is required with --file')
        lo, hi = map(float, a.bpm.split('-')) if a.bpm else BPM_DEFAULT.get(a.mood, (90, 150)); rows = []
        for f in a.file:
            an = analyse(decode(f), a.dur); an['score'] = score(an, lo, hi, a.dur, a.mood, os.path.basename(f)); rows.append(dict(path=f, title=os.path.basename(f), **an))
            print(f"[{a.mood}] {an['score']:6.1f}  {an['tempo']:6.1f}bpm beat {an['beat']:.2f} steady {an['steady']:.2f}  {os.path.basename(f)}")
        best = max(rows, key=lambda r: r['score']); ws = best['start'] if best['track_sec'] > a.dur else 0
        cut(best['path'], out_wav, ws, a.dur); json.dump(dict(best, window_start=ws, window_dur=a.dur, credit=a.credit), open(os.path.join(a.out, 'music_pick.json'), 'w'), indent=1)
        credit(a.out, a.credit or f"Music: {best['title']} (local file; add its source and licence)"); print('->', out_wav, 'from', best['title']); return
    if not a.sections:
        if not a.dur: sys.exit('--dur or --sections is required')
        best = pick(a.mood, a.query, a.dur, a.out, a.n, a.bpm, a.licenses, a.use)
        cut(best['path'], out_wav, best['window_start'], a.dur); json.dump(best, open(os.path.join(a.out, 'music_pick.json'), 'w'), indent=1)
        print('->', out_wav); return
    secs = []
    for part in a.sections.split(','):
        rng, mood = part.split(':'); s0, s1 = map(float, rng.split('-')); secs.append((s0, s1, mood.strip()))
    XF = 1.2; picks, parts, used = [], [], set()
    for i, (s0, s1, mood) in enumerate(secs):
        d = s1 - s0 + (XF if i < len(secs) - 1 else 0)
        best = pick(mood, None, d, a.out, a.n, None, a.licenses, tag=f'_{i}')
        p = os.path.join(a.out, f'music_sec{i}.wav'); cut(best['path'], p, best['window_start'], d)
        picks.append(dict(best, section=[s0, s1])); parts.append(p)
    # join with crossfades at the section borders
    cmd = ['ffmpeg', '-v', 'error', '-y']; [cmd.extend(['-i', p]) for p in parts]
    if len(parts) == 1: shutil.copy(parts[0], out_wav)
    else:
        fc, last = '', '[0:a]'
        for i in range(1, len(parts)):
            lab = f'[x{i}]'; fc += f'{last}[{i}:a]acrossfade=d={XF}:c1=tri:c2=tri{lab};'; last = lab
        cmd += ['-filter_complex', fc.rstrip(';'), '-map', last, '-ar', '44100', '-ac', '2', out_wav]; subprocess.run(cmd, check=True)
    json.dump(picks, open(os.path.join(a.out, 'music_pick.json'), 'w'), indent=1)
    print('->', out_wav, '(sections:', ', '.join(f"{p['section'][0]:.0f}-{p['section'][1]:.0f}s {p['mood']}: {p['title']}" for p in picks), ')')

if __name__ == '__main__': main()
