import json, re, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from scipy.io import wavfile
from kokoro_onnx import Kokoro
SR = 44100
VOICES = {'N': ('am_adam', 1.06), 'Ava': ('af_heart', 1.08), 'Sam': ('am_puck', 1.08), 'Zoe': ('af_nova', 1.1), 'Max': ('am_liam', 1.08), 'Mia': ('af_sky', 1.08), 'Leo': ('am_eric', 1.08), 'You': ('af_jessica', 1.05)}
SEGS = [
 ('n1', 'N', "Quick question. Do your friends have more friends than you?", .35),
 ('n2', 'N', "Probably. And math says that is totally normal.", .5),
 ('n3', 'N', "Picture a school with six kids.", .25),
 ('n4', 'N', "Ava is friends with everybody.", .1),
 ('a1', 'Ava', "Hi, everyone!", .35),
 ('n5', 'N', "Everyone else has just one friend: Ava.", .6),
 ('n6', 'N', "Let's ask. Sam, how many friends do you have?", .15),
 ('s1', 'Sam', "Just one. Ava.", .45),
 ('n7', 'N', "And how many does Ava have?", .12),
 ('a2', 'Ava', "Five!", .45),
 ('n8', 'N', "So Sam's friend has more friends than Sam. Zoe, Max, Mia, Leo?", .1),
 ('z1', 'Zoe', "Same!", .05), ('m1', 'Max', "Same!", .05), ('mi1', 'Mia', "Same here.", .05), ('l1', 'Leo', "Me too.", .5),
 ('n9', 'N', "Now Ava. Do your friends have more friends than you?", .15),
 ('a3', 'Ava', "Nope. They only have one each.", .5),
 ('n10', 'N', "That's five out of six kids with fewer friends than their friends. Not bad luck. Math.", .6),
 ('n11', 'N', "Why? Popular people show up on everyone's friend list. Ava is on all five lists. Everyone else, just one.", .5),
 ('n12', 'N', "So when you look at your friends, you keep finding the popular ones. Real life is less extreme, but scientists found the same pattern on real social networks, like Facebook.", .6),
 ('n13', 'N', "Here's the cool part. Scientists asked random students to name a friend, then tracked the flu.", .5),
 ('n14', 'N', "Those friends caught it about two weeks earlier. Popular people meet more people, so they catch things first. They're the canary in the coal mine.", .6),
 ('n15', 'N', "So if everyone online seems to have more friends than you,", .2),
 ('y1', 'You', "So it's not me?", .3),
 ('n16', 'N', "It's not you. It's how friendships get counted. Your friends have more friends than you. So do mine. Math says so.", .5),
 ('n17', 'N', "Send this to a friend. They probably have more friends than you.", .4),
]
k = Kokoro('/root/hf-shorts/kokoro/kokoro-v1.0.onnx', '/root/hf-shorts/kokoro/voices-v1.0.bin')
def trim(x, thr=.004):
    nz = np.where(np.abs(x) > thr)[0]
    return x[max(0, nz[0] - 120):nz[-1] + 200] if len(nz) else x
def edges(x, a=.008, b=.03):
    x = x.copy(); na, nb = int(a * SR), int(b * SR); x[:na] *= np.linspace(0, 1, na); x[-nb:] *= np.linspace(1, 0, nb); return x
out = []; segs = []; t = 0.0; words = []
for sid, spk, text, gap in SEGS:
    v, sp = VOICES[spk]
    s, sr0 = k.create(text, voice=v, speed=sp, lang='en-us')
    s = resample_poly(trim(s.astype(np.float64)), 147, 80)
    rms = np.sqrt(np.mean(s ** 2)) + 1e-9; s = edges(s * (10 ** (-20 / 20) / rms))
    s = np.clip(s, -.95, .95)
    dur = len(s) / SR; segs.append({'id': sid, 'spk': spk, 'text': text, 's': round(t, 3), 'e': round(t + dur, 3)})
    out.append(s); out.append(np.zeros(int(gap * SR)))
    if spk == 'N':   # caption timings: distribute over the clip by character length, pauses at punctuation
        toks = text.split(); weights = [len(w) + (6 if re.search(r'[.,?!:]$', w) else 0) for w in toks]; tot = sum(weights); acc = 0
        for w, wt in zip(toks, weights):
            words.append({'w': w, 's': round(t + dur * acc / tot, 3), 'e': round(t + dur * (acc + wt - (6 if re.search(r'[.,?!:]$', w) else 0)) / tot, 3)}); acc += wt
    t += dur + gap
y = np.concatenate(out)
wavfile.write('/root/hf-shorts/fp3_voice.wav', SR, (np.clip(y, -1, 1) * 32767).astype(np.int16))
json.dump(segs, open('/root/hf-shorts/fp3_segs.json', 'w'), indent=0); json.dump(words, open('/root/hf-shorts/fp3_words.json', 'w'))
print('total %.1f s' % (len(y) / SR)); print(' | '.join(f"{s['id']} {s['s']:.1f}-{s['e']:.1f}" for s in segs))
