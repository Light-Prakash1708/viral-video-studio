"""EP001 'Smart girls / dumb boys' master timeline. ('line',id,gap) | ('vis',sec,label) | ('mark',label).
Durations are MEASURED from audio/clips_t.json (dialogue at 1.06x tempo). Clips carry ~0.1-0.2 s of natural
padding each side, so small negative gaps give natural, quick back-and-forth."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
CLIPS = json.load(open(HERE + '/../audio/clips_t.json'))
L = lambda i, g=0.08: ('line', i, g)
V = lambda s, n: ('vis', s, n)
M = lambda n: ('mark', n)
ORDER = [
 M('HOOK'), V(0.2, 'h0'), L('a01', 0), L('p01'), L('a02'), V(0.45, 'scratch'), V(1.0, 'title'),
 M('EVID'), L('p02', 0), V(0.5, 'acad'), L('a03', 0.02), L('p03'), V(1.0, 'rows'), L('a04', 0.05), L('p04'), L('a05'),
 M('PROB'), V(0.25, 'desk'), L('p05', 0), V(1.2, 'cat'), L('x_snort', -0.5), L('a06', -0.15), L('p06'), L('a07'), L('p07'),
 M('SCI'), V(0.45, 'freeze'), L('p08', 0), L('a08'), L('p09'), V(0.8, 'joke'), L('a09', 0), L('p10'), V(0.12, 'b'), L('p11'), L('a10'), L('p12'),
 M('TWIST'), V(1.2, 'glitch'), L('p13', 0), L('a11'), V(0.3, 'grab'), L('a12', 0), V(0.75, 'silence'), L('a13', 0), V(0.6, 'notebook'), L('a14', 0), L('p14'),
 M('PAY'), L('a15', 0.25), L('p15'), L('a16'), V(0.55, 'handsome'), L('p16', 0), L('a17'), V(0.6, 'eyeroll'), L('p17', 0), L('a18'), L('p18'),
 M('END'), V(2.2, 'endcard'),
]
def build():
    t = 0.0; T = {}; MK = {}; VIS = {}
    for e in ORDER:
        if e[0] == 'mark': MK[e[1]] = round(t, 3)
        elif e[0] == 'vis': VIS[e[2]] = (round(t, 3), round(t + e[1], 3)); t += e[1]
        else:
            t = max(0, t + e[2]); d = CLIPS[e[1]]['dur']; T[e[1]] = (round(t, 3), round(t + d, 3)); t += d
    return T, MK, VIS, round(t, 3)
if __name__ == '__main__':
    T, MK, VIS, D = build(); print('total %.2f s' % D); print(MK)
