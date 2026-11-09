#!/usr/bin/env python3
"""Builds story/shots.json for friendship-countdown (timing owned here; cut points from timeline/words.json)."""
import json, os
P = os.path.dirname(os.path.abspath(__file__))
D = 206.75
S = []
def sh(id, start, scene, set_, tin='cut', tdur=0.3, sfx=(), amb=None, cap=True, **kw):
    d = {"id": id, "start": round(start, 2), "scene": scene, "set": set_, "bars": "none", "in": {"type": tin, "dur": tdur}, "sfx": [dict(at=a, name=n, gain=g) for a, n, g in sfx], "captions": cap}
    if amb: d["amb"] = {"name": amb[0], "gain": amb[1]}
    d.update(kw); S.append(d)
MUR = ('murmur', -24); LIB = ('roomtone', -24); RAIN = ('rain', -16); CITY = ('city', -24); HUM = ('hum', -26); ROOM = ('roomtone', -28); WIND = ('wind', -28)
sh('f01', 0.00, 'Cold open: CU Kabir in the dusk canteen, white 41 floating above his cap', 'canteen', 'cut', sfx=[(0.2, 'shimmer', -16), (1.5, 'blip', -12)], amb=MUR)
sh('f02', 2.30, 'Low angle push up from Kabir\'s face to the number hovering over his head', 'canteen', 'cut', sfx=[(0.0, 'swish', -16), (1.6, 'blip', -16)], amb=MUR)
sh('f03', 5.05, 'OTS from YOU (blurred blue hoodie) to Kabir; tag grows: SMALL / WHITE / GLOWING / 41', 'canteen', 'cut', sfx=[(0.15, 'pop', -16), (0.87, 'pop', -15), (1.81, 'shimmer', -14), (2.2, 'blip', -12)], amb=MUR)
sh('f04', 9.25, 'CU YOU, glasses, blinks twice; reflection of the glow; number still there', 'canteen', 'cut', sfx=[(0.0, 'swish', -14), (0.25, 'tick', -16), (1.1, 'tick', -18)], amb=MUR)
sh('f05', 11.70, 'Wide canteen at dusk: tables, lamps, crowd; numbers pop on above every head', 'canteen', 'whip', 0.35, sfx=[(0.0, 'whoosh', -12), (2.35, 'blip', -16), (2.5, 'blip', -17), (2.65, 'blip', -16), (2.8, 'blip', -18)], amb=('murmur', -20))
sh('f06', 14.90, 'Riya (pony, coral hoodie) laughing with friends; tag rolls up to 2,300', 'canteen', 'cut', sfx=[(0.0, 'swish', -16), (1.8, 'counter', -14), (2.5, 'ding', -16)], amb=MUR)
sh('f07', 18.35, 'Charger guy (beanie, grey) holding a charger cable; red pulsing 3', 'canteen', 'cut', sfx=[(0.0, 'swish', -16), (2.15, 'pop', -12), (2.3, 'heartbeat', -18)], amb=MUR)
sh('f08', 21.80, 'YOU holds phone: Mom on a video call; no number, a warm gold light above her', 'canteen', 'cut', sfx=[(0.1, 'phonering', -20), (4.0, 'shimmer', -12)], amb=MUR)
sh('f09', 26.95, 'CU YOU: realisation, awe; numbers reflected in glasses', 'canteen', 'cut', sfx=[(0.0, 'riser', -14)], amb=MUR)
sh('f10', 28.45, 'Title moment: crane up over the canteen, numbers everywhere. EVERY NUMBER = DAYS THAT FRIENDSHIP HAS LEFT', 'canteen', 'flash', 0.25, sfx=[(0.0, 'impact', -10), (1.9, 'hit', -14)], amb=MUR, cap=False)
sh('f11', 32.55, 'Low-angle hero shot of YOU, smug; HUD lens boots up top-left', 'canteen', 'cut', sfx=[(0.0, 'whoosh', -14), (0.8, 'powerup', -12)], amb=MUR)
sh('f12', 34.55, 'Fake friend (orange, smug) texting "bro send notes?"; amber 12', 'canteen', 'cut', sfx=[(0.0, 'swish', -16), (1.3, 'phonebuzz', -14), (2.7, 'pop', -12)], amb=MUR)
sh('f13', 38.60, 'YOU ignores the text; fake friend walks away into the dusk corridor, his tag counts to 0 and pops', 'canteen', 'cut', sfx=[(0.0, 'swish', -16), (1.0, 'footstep', -18), (1.6, 'footstep', -18), (2.2, 'footstep', -19), (3.05, 'whoosh', -12), (3.15, 'pop', -14)], amb=MUR)
sh('f14', 42.85, 'Library at dusk: tall windows, light shafts, dust; the girl sits alone at a lamp-lit table', 'library', 'dip', 0.4, sfx=[(0.0, 'whoosh', -16)], amb=LIB)
sh('f15', 45.35, 'Closer on library girl; her tag rolls to 11,000, then "30 YEARS"', 'library', 'cut', sfx=[(0.0, 'swish', -18), (1.3, 'counter', -13), (2.75, 'ding', -14), (3.0, 'shimmer', -16)], amb=LIB)
sh('f16', 49.85, 'Two-shot: YOU waves hi, she laughs; both happy', 'library', 'cut', sfx=[(0.0, 'swish', -18), (0.4, 'pop', -18), (1.5, 'blip', -18)], amb=LIB)
sh('f17', 53.60, 'Library blurs back (rack focus) and darkens: serif title THE SCIENCE OF FRIENDSHIP', 'library', 'cut', sfx=[(0.0, 'riser', -16), (2.2, 'hit', -14)], amb=LIB, cap=False)
sh('f18', 56.45, 'Diagram card on blurred library: stranger -> casual friend, hour bar fills to 50 h (Hall, 2018)', 'card', 'cut', sfx=[(0.0, 'pop', -16), (2.1, 'tick', -18), (2.4, 'tick', -18), (2.7, 'tick', -18), (3.0, 'tick', -18), (4.7, 'ding', -14)], amb=LIB)
sh('f19', 61.75, 'Card continues: casual -> close friend, bar fills past 200 h', 'card', 'cut', sfx=[(0.0, 'swish', -18), (1.2, 'counter', -14), (2.9, 'ding', -12)], amb=LIB)
sh('f20', 65.30, 'LUCK (dice) crossed out -> TIME (clock) on blurred canteen', 'card', 'cut', sfx=[(0.3, 'pop', -16), (1.0, 'glitch', -18), (1.72, 'hit', -12), (1.9, 'clock', -18)], amb=MUR, cap=False)
sh('f21', 68.10, 'Spending time like money: glowing clock-coins drop onto the table between YOU, Riya, library girl; their numbers tick up', 'canteen', 'cut', sfx=[(0.3, 'ding', -18), (0.7, 'ding', -18), (1.2, 'blip', -16), (1.6, 'blip', -16)], amb=MUR)
sh('f22', 70.55, 'Kabir alone at a table; his number now amber', 'canteen', 'cut', sfx=[(0.0, 'swish', -16), (0.3, 'heartbeat', -12)], amb=MUR)
sh('f23', 72.65, 'Tight on the number above Kabir: 41 -> 30 -> 22, red-amber pulse', 'canteen', 'cut', sfx=[(0.12, 'pop', -12), (0.2, 'heartbeat', -12), (1.02, 'pop', -11), (1.25, 'heartbeat', -11), (2.0, 'pop', -10), (2.25, 'heartbeat', -10)], amb=('murmur', -30), cap=True)
sh('f24', 75.85, 'Flashback, golden hour: kid YOU and kid Kabir on a gully wall, age seven', 'gully', 'dipWhite', 0.5, sfx=[(0.1, 'shimmer', -14)], amb=WIND)
sh('f25', 77.90, 'Kids playing cricket in the gully: bat swing, ball flies', 'gully', 'cut', sfx=[(0.55, 'hit', -12), (0.7, 'cheer', -22)], amb=WIND)
sh('f26', 79.35, 'Exam nights: teen YOU and Kabir at a desk lamp, books piled', 'room', 'cut', sfx=[(0.0, 'swish', -18), (0.2, 'clock', -18)], amb=ROOM)
sh('f27', 80.55, 'The worst haircut: YOU with a jagged bowl cut, Kabir gives thumbs up "looks fine"', 'gully', 'cut', sfx=[(0.0, 'swish', -18), (2.0, 'pop', -16)], amb=WIND)
sh('f28', 84.15, 'Back to now: Kabir at the canteen window, amber 22; YOU blurred in foreground (rack focus)', 'canteen', 'dip', 0.4, sfx=[(0.3, 'heartbeat', -14), (1.8, 'blip', -16)], amb=('murmur', -28))
sh('f29', 87.20, 'You try everything: YOU slides a plate of samosas to Kabir; 22 does not move', 'canteen', 'cut', sfx=[(0.6, 'swish', -16), (1.8, 'pop', -16)], amb=MUR)
sh('f30', 89.45, 'Movie night: the two on a sofa, TV glow flickering; 22 above Kabir', 'room', 'cut', sfx=[(0.0, 'whoosh', -18)], amb=ROOM)
sh('f31', 91.00, '2 a.m.: phone screen in the dark sending memes; buzz; 22 frozen', 'room', 'cut', sfx=[(0.1, 'phonebuzz', -12), (0.9, 'phonering', -22), (1.5, 'tick', -16), (2.1, 'tick', -16)], amb=ROOM)
sh('f32', 94.00, 'Cold blue wide of the canteen: every number above every head ticks down', 'canteen', 'cut', sfx=[(0.0, 'whoosh', -16), (2.0, 'glitch', -18), (2.2, 'counter', -16)], amb=('murmur', -26))
sh('f33', 98.15, 'Riya talking (muffled bubbles) while YOU stares up at numbers, not listening; cold', 'canteen', 'cut', sfx=[(0.0, 'swish', -18), (1.3, 'tick', -18), (2.6, 'tick', -18)], amb=('murmur', -30))
sh('f34', 102.65, 'Dutch study card: ten friend icons; across 7 years half fade out (Mollenhorst, 2009)', 'card', 'cut', sfx=[(0.0, 'pop', -16), (2.2, 'clock', -18), (3.0, 'tick', -18), (3.5, 'tick', -18), (4.0, 'tick', -18)], amb=ROOM, cap=True)
sh('f35', 108.30, 'Void: two friends under separate spotlights; the floor stretches the gap between them; chat dots fade', 'void', 'dip', 0.35, sfx=[(0.0, 'whoosh', -18), (1.7, 'freeze', -18)], amb=('wind', -30))
sh('f36', 111.55, 'Friendships rarely explode: a tag dims and dissolves into drifting motes', 'void', 'cut', sfx=[(0.6, 'slowmo', -18), (2.2, 'shimmer', -22)], amb=('wind', -32))
sh('f37', 115.10, 'Night rooftop, day 3: YOU and Kabir on the ledge, city lights; red 3 pulsing', 'rooftop', 'dip', 0.5, sfx=[(0.5, 'heartbeat', -16)], amb=('city', -30))
sh('f38', 118.25, 'CU Kabir, sad, finally says it: "I got the job in Canada"', 'rooftop', 'cut', sfx=[], amb=('city', -34))
sh('f39', 121.70, 'CU YOU: stunned (reverse)', 'rooftop', 'cut', sfx=[(0.3, 'heartbeat', -18)], amb=('city', -32))
sh('f40', 123.65, 'Tight on the red 3 glitching: NOT A FIGHT', 'rooftop', 'cut', sfx=[(0.1, 'glitch', -14), (0.4, 'heartbeat', -12), (1.3, 'hit', -14)], amb=('city', -30))
sh('f41', 125.95, 'A flight: plane silhouette crossing a dusk sky, contrail; 3 DAYS', 'sky', 'cut', sfx=[(0.0, 'whoosh', -10), (1.4, 'impact', -16)], amb=WIND, cap=False)
sh('f42', 128.45, 'CU YOU: angry -> pretends it does not matter, looks away', 'rooftop', 'cut', sfx=[(0.0, 'swish', -18)], amb=('city', -30))
sh('f43', 131.85, 'YOU stands up, determined; the number never measured this; city behind', 'rooftop', 'cut', sfx=[(0.6, 'riser', -14)], amb=('city', -28))
sh('f44', 135.40, 'You show up: low angle, YOU steps in beside Kabir, hand on his shoulder', 'rooftop', 'cut', sfx=[(0.1, 'impact', -10)], amb=('city', -28))
sh('f45', 136.75, 'DAY 3: rain-soaked gully at night, cricket, puddles, lightning', 'gully-night', 'whip', 0.35, sfx=[(0.0, 'whoosh', -12), (0.3, 'thunder', -10), (2.2, 'hit', -12)], amb=RAIN)
sh('f46', 140.35, 'Close: two grown men laughing in the rain, splashes, lamp reflections', 'gully-night', 'cut', sfx=[(0.6, 'kick', -16), (2.2, 'thunder', -16)], amb=RAIN)
sh('f47', 144.05, 'DAY 2: desk lamp, YOU writes memories on paper slips', 'room', 'dip', 0.4, sfx=[(0.3, 'swish', -20), (1.0, 'tick', -20)], amb=ROOM)
sh('f48', 146.75, 'Slips of paper go into Kabir\'s backpack', 'room', 'cut', sfx=[(0.3, 'swish', -16), (1.2, 'swish', -18)], amb=ROOM)
sh('f49', 149.10, 'DAY 1, the airport: glass wall, plane outside at dusk, departures board TORONTO BOARDING', 'airport', 'whip', 0.35, sfx=[(0.0, 'whoosh', -12), (0.3, 'ding', -16), (0.0, 'murmur', -24)], amb=HUM)
sh('f50', 150.60, 'The hug at the gate: so hard YOUR glasses crack and tilt', 'airport', 'cut', sfx=[(0.3, 'swish', -16), (1.62, 'hit', -10), (1.7, 'glitch', -16)], amb=HUM)
sh('f51', 153.85, 'Over YOU\'s shoulder: Kabir\'s tag flickers 3, 2, 1 ... 0', 'airport', 'cut', sfx=[(0.6, 'heartbeat', -12), (1.2, 'glitch', -14), (2.1, 'freeze', -12)], amb=HUM)
sh('f52', 157.35, 'The 0 shatters into gold sparks that swirl into a new shape', 'airport', 'cut', sfx=[(0.3, 'riser', -12), (2.0, 'shimmer', -14)], amb=HUM)
sh('f53', 161.85, 'Gold infinity sign above Kabir, warm light floods the gate', 'airport', 'cut', sfx=[(0.1, 'impact', -14), (0.2, 'shimmer', -10)], amb=HUM)
sh('f54', 164.55, 'Insert: Mom\'s video-call glow, the same gold light', 'canteen', 'cut', sfx=[(0.2, 'shimmer', -14)], amb=('roomtone', -30))
sh('f55', 166.60, 'Kabir walks to the gate and turns back to wave; the infinity floats with him', 'airport', 'cut', sfx=[(0.3, 'footstep', -20), (0.9, 'footstep', -20)], amb=HUM)
sh('f56', 168.55, 'Plane takes off past the glass wall; two clocks: MUMBAI / TORONTO', 'airport', 'cut', sfx=[(0.0, 'whoosh', -12), (0.6, 'carpass', -16)], amb=HUM)
sh('f57', 171.00, 'Harvard card: 80-year timeline 1938 -> today, generations of figures', 'card', 'dip', 0.4, sfx=[(0.2, 'pop', -16), (2.8, 'tick', -18), (3.4, 'tick', -18), (4.4, 'ding', -14)], amb=ROOM)
sh('f58', 176.80, 'Its biggest finding: MONEY bar small vs RELATIONSHIPS bar tall', 'card', 'cut', sfx=[(0.1, 'swish', -16), (2.0, 'pop', -16), (4.9, 'ding', -12)], amb=ROOM)
sh('f59', 182.65, 'Old YOU and old Kabir on a bench at golden hour, laughing; infinity above', 'gully', 'fade', 0.5, sfx=[(0.3, 'shimmer', -16)], amb=WIND)
sh('f60', 185.20, 'YOU walks out of the airport into the city night, taxis', 'airport-out', 'dip', 0.35, sfx=[(0.4, 'carpass', -16), (1.0, 'footstep', -20)], amb=CITY)
sh('f61', 186.95, 'Taxi: framed in the rear-view mirror, YOU looks up', 'taxi', 'cut', sfx=[(0.2, 'swish', -18)], amb=('city', -28))
sh('f62', 189.00, 'In the mirror, a number appears above YOUR own head', 'taxi', 'cut', sfx=[(0.6, 'shimmer', -14), (0.9, 'blip', -12)], amb=('city', -28))
sh('f63', 191.40, 'Close on YOUR number, slowly counting', 'taxi', 'cut', sfx=[(0.3, 'tick', -16), (1.3, 'tick', -16)], amb=('city', -30))
sh('f64', 193.30, 'YOU opens the phone: contacts MOM / KABIR / RIYA ... thumb hovers on call', 'taxi', 'cut', sfx=[(0.4, 'blip', -16), (2.4, 'pop', -16)], amb=('city', -30))
sh('f65', 197.45, 'CTA card: faces with "?" numbers; WHOSE NUMBER WOULD YOU CHECK FIRST?', 'card', 'cut', sfx=[(0.1, 'whoosh', -14), (1.0, 'pop', -16), (1.3, 'pop', -16), (1.6, 'pop', -16)], amb=('city', -32), cap=False)
sh('f66', 201.55, 'End: phone calling KABIR, gold infinity, "call them"', 'taxi', 'cut', sfx=[(0.3, 'phonering', -16), (2.4, 'shimmer', -12)], amb=('city', -32), cap=False)
for i, s in enumerate(S): s["end"] = S[i + 1]["start"] if i + 1 < len(S) else D
music = [
  {"start": 0, "end": 26.95, "mood": "playful", "intensity": 0.4},
  {"start": 26.95, "end": 56.45, "mood": "wonder", "intensity": 0.5},
  {"start": 56.45, "end": 70.55, "mood": "hopeful", "intensity": 0.5},
  {"start": 70.55, "end": 94.0, "mood": "tension", "intensity": 0.45},
  {"start": 94.0, "end": 115.1, "mood": "sad", "intensity": 0.4},
  {"start": 115.1, "end": 128.45, "mood": "sad", "intensity": 0.2},
  {"start": 128.45, "end": 149.1, "mood": "hopeful", "intensity": 0.55},
  {"start": 149.1, "end": 171.0, "mood": "triumph", "intensity": 0.7},
  {"start": 171.0, "end": 185.2, "mood": "hopeful", "intensity": 0.45},
  {"start": 185.2, "end": D, "mood": "calm", "intensity": 0.35},
]
json.dump({"title": "What IF You Could See How Many Days Every Friendship Has Left?", "duration": D, "shots": S, "music": music}, open(os.path.join(P, "shots.json"), "w"), indent=1)
print(len(S), "shots")
