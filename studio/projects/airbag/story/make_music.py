# story/music_plan.json from the current shot timings: score follows the story beats, two near-silences, hits on key actions
import json
S = {s['id']: s for s in json.load(open('story/shots.json'))['shots']}; D = json.load(open('config.json'))['duration']
st = lambda k: S[k]['start']; en = lambda k: S[k]['end']
sec = [(0, st('f02'), 'warm', 0.45), (st('f02'), en('f03') - 0.3, 'chase', 0.9), (en('f03') - 0.3, en('f03') + 0.4, 'sad', 0.08),
       (en('f03') + 0.4, en('f04'), 'sad', 0.4), (st('f05'), en('s07'), 'curious', 0.6), (st('f08'), en('f08'), 'curious', 0.7),
       (st('s09'), en('f10'), 'tension', 0.6), (st('f11'), en('f12'), 'wonder', 0.8), (st('f13'), en('f13') - 0.2, 'sad', 0.35),
       (en('f13') - 0.2, st('f14') + 0.5, 'sad', 0.06), (st('f14') + 0.5, D, 'triumph', 0.85)]
ev = [{'t': st('f01') + 2.0, 'type': 'riser', 'dur': 1.4}, {'t': st('f01') + 3.6, 'type': 'hit'}, {'t': en('f02') - 0.4, 'type': 'drop', 'dur': 0.6},
      {'t': st('f08') + 1.8, 'type': 'stinger'}, {'t': st('f12') + 3.2, 'type': 'hit'}, {'t': st('f14') + 0.55, 'type': 'boom'}, {'t': st('f14') + 1.0, 'type': 'hit'}]
json.dump({'key': 'E', 'bpm': 96, 'seed': 21, 'sections': [{'start': round(a, 3), 'end': round(b, 3), 'mood': m, 'energy': e} for a, b, m, e in sec if b > a], 'events': ev}, open('story/music_plan.json', 'w'), indent=1)
print('music plan', len(sec), 'sections')
