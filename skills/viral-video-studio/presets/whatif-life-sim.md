# Preset: whatif-life-sim  ("What IF You…" second-person life-sim stories, 3D bubble-head cast)
Measured from a top channel in this genre (Nov 2026: "What IF You Could See Who Has a Crush on You?", 1.3 M views, 10:37) and its catalogue. Use it as a genre playbook. Do NOT copy that channel's characters, colours or titles. Our look is our own: rim-aura bubble people, indigo→coral twilight with teal fill, real depth of field, and an expressive 12-face set.

Engine: GrowKaz three-kit 3D shots + `presets/whatif-life-sim/lifesim.js` (copy to `scenes/sets/`).
Formats: long-form 16:9, 9–11 min (the channel's sweet spot is 10–11 min), or a 60–75 s 9:16 cut of one arc. Bars: `none` for 16:9 (the soft vignette from `lifeGrade` replaces letterboxing); `scope` only for 9:16.

## 1. What wins in this genre (catalogue data)
- Title formula: `What IF You <had a social superpower | broke one rule of life>?` Social, school and status premises win: crush 1.3 M, only guy at a girls' school 774 K, infinite money 699 K, creative mode 637 K, school hero 557 K, control your luck 515 K. Pure physics and elemental premises lose: shrink 1 cm/hour 17 K, earthbending 26 K. Pick premises a 13–25-year-old feels in their chest: love, status, fear, friendship, money, embarrassment.
- One visible game-UI mechanic is the whole hook: a number in the corner of your eye, threads between hearts, a meter or a cooldown. It must be on screen in the first frame and never leave (the HUD counter).

## 2. Story engine (measured script: 1,765 words, 166 wpm, 270 sentences, mean 6.5 words, 38% of sentences ≤ 4 words)
1. **Cold open in second person, present tense, mid-scene (0–30 s):** "You check the number. Three." Stake plus dare ("your friends bet you 20 bucks") → use the power → instant win → friends' jaws drop. No intro and no title card.
2. **Rules of the power (30–60 s):** what it shows, how it scales ("the bigger the crush, the brighter the thread"), who can't see it. End with a 3-beat promise of the whole video: "You'll win every bet. You'll watch the number hit millions. And one day, two threads will pull you in opposite directions…" (this plants the climax).
3. **Escalation ladder (1–5 min):** small → school → town → viral → national. Every rung follows the same beat: dare or challenge → clever use of the power → number change on screen (+5, −4) → a one-line science fact that makes it real ("halo effect", "37-country study: kindness ranked first", "the wobbly-bridge experiment, 2 out of 16 vs half"). That gives a fact every 45–60 s.
4. **Plant a quiet thread early:** a faint, steady signal you ignore (the quiet girl's thread). It pays off at the climax.
5. **Costs (5–7.5 min):** the friend's heartbreak (love triangle), obsessive checking, losing 200,000 overnight, "everyone loves you and nobody knows you", the friendship going quiet.
6. **Climax (7.5–9.5 min):** a real danger (a crowd crush in a blackout) with real survival science. Then a dilemma only the power can solve: two threads, two directions, three seconds. Choose the quiet one; the friend saves the other; the friendship is restored.
7. **Resolution + cosmic twist (9.5–10.3 min):** the number ticks up by one more. The new thread goes up into the stars.
8. **CTA:** "So, would you want to <power>? Tell us in the comments. And if you'd have <hero moment>, like and subscribe for more what ifs."
Rules: 25+ concrete numbers (they are the HUD's food). Dialogue lines are short and in quotes ("Bro, how?"). Running gag: you fail at something small right after a win ("You trip over the ball. Six. Worth it."). Never more than 60 s without the number changing.

## 3. Voice and audio (measured)
- One warm, young narrator, 157–176 wpm steady (166 average), sentences mostly under 7 words, pause > 0.6 s about 10 times per minute. With Kokoro use `am_michael` (or `af_heart` for a gentle story) at speed 1.05–1.1, `sentenceGap 0.16`, `paragraphGap 0.28`. Character lines get a different voice (`am_adam` for the friend, `af_bella` for the crush), spliced with `explainroo say`.
- Music is MORE present than in our Shorts: the bed sits about 7 dB under the voice (we measured −16.5 dB speech vs −23 dB in the gaps), loudness −14 LUFS, LRA only 3.7 LU (dense, compressed mix). Set `config.music.gainDb −13`. Use one score with chapter moods: playful (school), romantic (dance or fair), epic (viral), sad (costs), tense pulse (climax), warm swell (resolution).
- SFX on every number change (`blip` up, `pop` down), `shimmer` when a thread appears, `heartbeat` when a thread pulses, `murmur`/`cheer`/`applause` for crowds, `whoosh` on whip transitions, `riser` → `impact` into the climax, near-silence at the blackout.

## 4. Visual grammar (measured: 120 hard cuts in 10:37, median shot 2.7 s, mean 5.3 s)
- **Shot menu** (rotate it; never use the same framing twice in a row):
  1. Over-the-shoulder: the hero's big glossy head blurred in the foreground, the target sharp in the midground (DOF via `st.focusOn`).
  2. Face close-up for the reaction (smug → surprised → happy), slow push-in.
  3. Wide establishing shot with an instanced crowd (gym, cafeteria, stadium, lake concert).
  4. Low-angle hero shot (buzzer-beater, catch).
  5. 2D diagram card on a blurred and darkened 3D background, with a serif caps label ("THE BRIDGE EXPERIMENT"), simple figures, arrows, +1 / −1, before/after splits.
  6. Phone or screen insert (views counter, messages).
  7. Overhead map or stadium count-up ("55,000").
  8. Silhouette or void shot for the emotional lows (a single figure in dark, threads going dim).
- The power is drawn as light: `beam()` threads draw on from heart to heart, brightness = strength, flicker = heartbeat. Crowds become spider webs of threads at scale.
- HUD: `hudCounter()` top-left in every shot from the first frame, and it pulses on change. Big numbers get a `scoreboard()` or a centred count-up.
- Lighting: twilight key + teal fill + coral rim. The colour arc follows the story: warm school → neon viral → cold blue costs → black-out (only phone screens and threads) → golden resolution → starfield ending.
- Camera: every 3D shot moves (slow dolly or push); no static frames. Shake on impacts and the crowd surge; whip-pan transitions between chapters.

## 5. Our upgrades over the reference
- Rim aura on every character, tinted by their thread colour, so you can tell who likes whom at a glance even in wide shots.
- 12 expressions with brows (`smug, happy, love, sad, cry, worried, surprised, awe, determined, blink, talk, neutral`), blush, tears and sweat drops: more acting in close-ups.
- Real depth of field (BokehPass) with rack-focus between two characters on the line that matters.
- A science card every rung, with the source named on screen (the reference often states studies without one).
- A 9:16 cut: lift the strongest arc (cold open → one rung → the dilemma → twist, about 70 s) and re-frame the over-the-shoulder shots vertically, with captions at y 1440.

## 6. Kit (`lifesim.js`)
- `bubble(T, look)`: character. Look keys: skin, hoodie, pants, shoes, hair `none|bob|pony|bun|cap|beanie`, hairColor, capColor, rim (aura colour), blush, s.
  `.set({expr, look:[x,y], tilt, nod, armL, armR, reachL, reachR, walk, stride, breathe, sit})`; `userData.head/arms/legs/aura`.
- `lifeStage(T, {focus, aperture, maxblur, sky, rim, fill})`: stage with DOF; `st.focusOn(obj)` each frame for rack focus.
- `gymFloor`, `lockers`, `crowd(T, st, {n, area, rise})` (instanced, cheap).
- `beam(T, st, a, b, {color, arc, r})` → `.set(k, t)` draws the thread on, with a travelling spark.
- 2D overlay helpers: `hudCounter(g, value, {pulse})`, `heart`, `serifLabel`, `scoreboard(g, title, value, x, y, a)`, `lifeGrade(g)` (vignette; call last).
- Proven settings: camera 1.6–4 m from faces, aperture 0.004 (≈ f/2.8 look) up to 0.02 for diagram backgrounds, bloom 0.4, beam radius 0.012.

## v2: full film kit (from "What IF You Could See How Many Days Every Friendship Has Left?", Nov 2026, 3:14)
- `presets/whatif-life-sim/fc.js` (copy next to lifesim.js): `stageFor(T, kind)` lighting presets (canteen, library, golden, night, rain, airport…), sets `canteen`, `library`, `gully` (+ `wickets`, `ball`, `giveBat`), `deskRoom`, `rooftop`, `airport`, `plane3D`, `phone3D`, `momCall`, `voidSet`, `spotPool`, `lamp`, `rain`, `dust`, `bokeh`; acting `person`, `faceTo`, `blinkAt`, `kid`; camera `cam`, `shakeCam`.
- **Number over a head** (the device): `s.P = proj(T, stage, char, 0.62)` in draw() (projects the head to screen), then `tag(g, s.P, value, {t, a, pop})` in overlay(); white = healthy, amber = falling, red pulse < 7, gold glow / ∞ for unconditional bonds. Persistent `hud(g, t)` lens badge top-left after the reveal.
- 2D cards over blurred 3D: `darken`, `panel`, `serif`, `bigText`, `cite` (source line), `topBand`.
- lifesim.js now disables MSAA, renders bloom at half res and uses a 1024 shadow map (≈ 1.5× faster, same look under DOF). Life-sim 3D renders at ~0.65 fps on 4 workers → use `tools/render_chunks.sh projects/P 0.8` for long films.
- Voice: ElevenLabs Leo (`TLC61WvtioR7PrhxZ1RH`, eleven_v4 with tags) sounded human; score with `tools/score.py` (D major/B minor piano + strings; silence under "Not a fight.", heartbeat pulse in the montage, swell on the ∞ reveal).

- Cricket kit (fc.js): `giveBat(T, person)` (extruded willow blade, spine, grip; returns the wrist group), `ball(T, st)` (seamed leather, spin, `.trail(pts, speed)` ghost trail, `.burst(at, k)` contact sparks), `deliveryPos(t, {rel, hitT, from, pitch, bat, loft})` (release → bounce → bat → lofted flight), `batSwing(t, hitT)` → `{rx, rz, arm}` (back-lift → stroke → follow-through). Film it side-on so bowler, ball path and batter share the frame; keep the contact light ≤ 0.9.
- Tags over heads: `tag()` clamps to the safe frame. Draw any frame/mask overlay (mirror, phone) BEFORE the tag, and frame the camera so the head sits low enough to leave room for the number; never let it sit over the eyes.

## v3: cast, worlds, voices, music (Nov 2026)
- Copy `cast.js` and `worlds.js` next to `lifesim.js` + `fc.js`. `person2()` replaces hand-built `bubble()` looks; `world()` replaces hand-built sets for new locations. See SKILL.md "Characters people remember" and "Background worlds".
- Multi-voice scripts: `@voice NAME preset pitch=.. speed=..` + `NAME: line` → `tools/voice.py` renders the whole cast locally; use `voiceover.wav.lines.json` to cut to the speaker (over-the-shoulder on the listener, close-up on the speaker) and to tint captions per speaker.
- Music: `tools/groove.py` — `pop` or `lofi` for school/social chapters, `suspense` for the rules/danger, `dreamy` or `score.py` piano for the emotional low, `epic` for the climax, `dreamy` for the twist ending.
- Lessons: a bubble character with an open `CylinderGeometry` hair back must open at theta 0 (the face side); fairy lights and diyas are emissive bulbs (`K.bulb`), not PointLights (keep 3–8 real lights); an `init()` must return `{ stage }` at the top level.
