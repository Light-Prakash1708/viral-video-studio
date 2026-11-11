"""EP001 master timeline. Entries: ('line',id,gap_before) | ('vis',seconds,label) | ('mark',label).
Real clip durations come from ../audio/clips.json (measured), so runtime is MEASURED, not estimated."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
CLIPS = json.load(open(HERE + '/../audio/clips.json'))
L = lambda i, g=0.2: ('line', i, g)
V = lambda s, n: ('vis', s, n)
M = lambda n: ('mark', n)
ORDER = [
 M('S1'), V(0.8,'S1_drafts'), L('a01',0), L('a02',.3), V(1.0,'S1_send'), M('S1b'), L('k01',.1), L('a03',.2), L('k02',.25), V(1.0,'S1_title'),
 M('S2'), V(1.8,'S2_gag'), V(0.7,'S2_across'), L('m01',0), L('p01',.2), L('m02',.2), L('r01',.45), L('m03',.25), V(0.6,'S2_pface'),
 M('S3'), V(1.8,'S3_in'), L('r02',.1), L('p02',.2), V(0.7,'S3_bag'), L('r03',.2), V(0.9,'S3_remember'), V(1.2,'S3_walk'), L('r04',.1), L('p03',.2), L('r05',.2),
 V(1.3,'S3_cold'), L('p04',.2), L('m04',.2), L('p05',.25),
 M('S4'), V(7.0,'S4_slot'), L('m05',.15), L('p06',.2), V(0.4,'S4_recheck'), L('p07',0), V(0.5,'S4_back'), L('a04',0), L('k03',.2), L('k04',.2), L('a05',.2), L('k05',.3), L('a06',.15),
 M('S5'), V(3.6,'S5_draw'), L('m06',.1), L('p08',.2), V(0.5,'S5_gap'), L('n01',.2), V(0.7,'S5_cafe'), L('k06',0), L('a07',.15), L('k07',.15), L('k08',.2), L('a08',.2), L('k09',.2),
 M('S6'), V(0.9,'S6_watch'), L('k10',0), L('a09',.15), L('k11',.2),
 M('S7'), V(2.3,'S7_msgs'), L('p09',0), L('m07',.2), L('p10',.2), V(1.3,'S7_pages'), L('p11',0), V(1.0,'S7_silence'), L('p12',0), L('m08',.25), V(0.7,'S7_beat'), L('p13',0), L('m09',.2), L('p14',.2), L('m10',.3), V(2.4,'S7_facedown'),
 M('S8'), V(2.4,'S8_walkin'), L('a10',0), L('k12',.2), L('a11',.2), L('k13',.15), V(0.9,'S8_phone'), L('a12',0), L('k14',.2), L('a13',.2), L('k15',.3), L('a14',.35), V(1.4,'S8_quiet'), L('n02',0), V(3.4,'S8_pullback'),
]
TRIMS = ['m07', 'p02', 'a06', 'a11', 'k13']   # the pre-agreed trim list (only applied if the measured total demands it)

def build(trim=()):
    t = 0.0; T = {}; MK = {}; VIS = {}
    for e in ORDER:
        if e[0] == 'mark': MK[e[1]] = round(t, 3)
        elif e[0] == 'vis': VIS[e[2]] = (round(t, 3), round(t + e[1], 3)); t += e[1]
        elif e[0] == 'line':
            if e[1] in trim: continue
            t += e[2]; d = CLIPS[e[1]]['dur']; T[e[1]] = (round(t, 3), round(t + d, 3)); t += d
    return T, MK, VIS, round(t + 1.0, 3)   # +1.0 s tail (fade-out)

if __name__ == '__main__':
    for lab, tr in (('untrimmed', ()), ('trims: p02', ('p02',)), ('trims: m07,a06', ('m07', 'a06')), ('all 5 trims', TRIMS)):
        print('%-16s %.1f s = %d:%02d' % (lab, build(tr)[3], build(tr)[3] // 60, build(tr)[3] % 60))
