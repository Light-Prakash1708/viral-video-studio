# Preset: flat-toon (flat-vector cartoon dash-cam stories; first used on "The Rock That Invented the Airbag" v3, Nov 2026)
Engine: GrowKaz 2D shots (`draw(g,t,info)`) + `presets/flat-toon/flat.js` + `cast_flat.js`. Project style `"style": "flat"` (true whites, no tint/grain/bloom). 9:16, 55–70 s.
Reference grammar (learn, never copy characters): Toon-style character libraries with white round faces, flat vector road/city backdrops, flat side-view cars.

## Look
- **Characters**: white round faces, 6–8 px ink outlines, big outlined eyes with dot pupils, thick brows, red mouth with tongue, spiky/slick/bun/pigtail/bald/curly hair, flat 2-colour clothes, mitten hands. Our own cast in `cast_flat.js` (dad, mom, kid, scientist `breed`, three execs, old man, navy).
- **Expressions** (`EXPRESSIONS`, 26): neutral curious happy smug surprised shocked horrified nervous angry frustrated suspicious confused worried disappointed relieved laughing crying sleep tired determined proud talk realization sad scared scream. Extras auto-drawn: sweat, tears, anger vein, ?, light bulb, puff, zzz.
- **Poses** (`ARM`): rest wave open point chin head shock belly face wheel cheer lap shrug facepalm fist; `legs: 'stand'|'walk'|'run'|'sit'|'none'`; `armL/armR = [shoulder, elbow]` angles from straight down (+ = outward/up), so any reach is keyable.
- **Animation**: `keys(t, [[t0, pose, dur]])` blends every numeric pose field with an overshoot (anticipation → action → settle), adds idle breathing, head bob and blinks. Expressions switch on the key time. Add smear arcs on big throws (see airbag `f03`).
- **Worlds**: `roadSide` (parallax day/night road: clouds, hills, optional town skyline, teardrop + round trees, bushes, lamps at night, foreground ditch), `roadPOV` (driver view with approaching trees/dashes), `carSide` (flat 1950s sedan, riders clipped into the windows, spinning hubcaps, tilt), `carFront` (windshield view: seat, riders, dash, steering wheel, glass glare, hood), `flatRock`, `bush`, `teardropTree`, `townSkyline`, `dust`, `burst`, `speedLines`, `impactBg` (red/orange sunburst reaction card).

## Rules that cost a re-render
- Vertical frames are narrow: zoom 1.3–1.9 so a face is ≥ 1/4 frame width; check every key frame with `--stills … --scale 0.4`.
- Captions at y ≈ 1600 (`captionStyle.y`) so they sit on hood/ground, never on faces.
- Pad world fills beyond the frame (zoom-outs and shakes must never show black).
- A lying character: rotate −90° about the feet and offset the origin by the body length so the head lands on the pillow.
- Use an impact reaction card (`impactBg` + giant face + one word) at the turn of every story beat; 0.5–0.7 s.

## Text-safe layout (v4 rule, from user feedback "text covers the characters")
Three bands on every 9:16 frame: **top 0–0.2 H** = pop words, chips, step headers; **middle 0.2–0.8 H** = characters + action; **bottom 0.8–0.9 H** = captions (`captionStyle.y` ≈ 1600). No character pixel may enter the caption band: seat characters behind desks/benches/dashboards (`legs: 'none'`) or end close-ups at the shoulders. Labels pin to parts in empty background, never on a face.

## Story beats that must be SHOWN, not implied
- A crash "into a ditch": draw a real trench (`ditchBack` → car → `ditchFront`), nose-dive tilt ~0.55 rad, rear wheels still spinning, dirt chunks + steam.
- "Every carmaker laughed": a montage of distinct offices (fictional company names), pitch cuts, then stacked close-up panels laughing together, then a door slam with him outside.
- "How it works": numbered steps in the top band (1 sensor spark → 2 pellets ignite → 3 nitrogen gas → 4 bag fills in 0.03 s → 5 faster than a blink), side cutaway with arrows and pinned labels.
- A sketch: the page must be the hero (≥ 45 % of the frame, nothing on it but the drawing); the pencil follows the stroke being drawn.

## Sound
Hero SFX from ElevenLabs (`eleven_text_to_sound_v2`, 50 credits each, one clear sound per prompt) saved to `audio/sfxlib/<name>/el_<name>.wav`: screech, ditchcrash, officelaugh, pencil, airbagpop, crashtest, ballmagnet, torpedo, nightroom, ignite, toycrash. Narration: `voice.py` per-line direction `{ex=0.9 cfg=0.3 gap=0.4}` at the start of a line, `--takes 3`, no post time-stretch (it makes the voice robotic).
