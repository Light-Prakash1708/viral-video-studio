# Preset: cinematic-story
Engine: GrowKaz Stickman (`make-2d-video`), 9:16, 1080p, 24 fps. Proven on "What If Time Was Money?" (Nov 2026).
Use for "What if…" hypotheticals, emotional stories, social commentary.

## Look
- `config.json`: `"style": "cinema"` (teal shadows, amber highlights, vignette 0.6, bloom, grain; in kit `engine/styles.js`), `"bars": "scope"`, `"captionStyle": {"y": 1440, "size": 84, "max": 2}`, `"music": {"gainDb": -14}`.
- Moods: night/storm with rain + neon for struggle, golden penthouse/sunrise for wealth/hope, dawn rooftop for the closing reflection.
- One recurring glowing motif object (here the wrist clock, `world.js → wrist()`), present in most shots.
- Emotional beats get bigFace close-ups (tear, worried → smile) and 3–4 s holds; 1–2 Three.js city shots (`kind: '3d'`, `T.building`, `T.orbit`).
- Numbers: `stat()` (label above, value below, pill) or `cost()` float-ups placed BELOW the motif (y ≥ 0.33H).

## Voice
- explainroo one-scene voice: `"voice": "am_michael", "speed": 1.1, "sentenceGap": 0.16, "paragraphGap": 0.2` (~185 wpm, room to breathe).
- Structure: shocking hook line pair → "Imagine a world…" → concrete everyday prices → rich vs poor contrast → one tender human moment → a cruel twist → "here's the uncomfortable part" (turn to our world) → reflective question → CTA.

## Pacing & sound
- ~23 shots/min; dip transitions into emotional scenes, flash into the title, whip for contrasts.
- Music: epic → mystery → sad → dark → hopeful. SFX: heartbeat, clock, shimmer, thunder, rain bed.

## Science-body kit (from "Phantom Limb", Nov 2026)
- `cinematic-story/brain.js`: recognisable side-view brain (lobes, gyri, Sylvian fissure, cerebellum, brainstem) with the Penfield touch strip; `brain(g, t, {lit:{HAND:1}, reveal, labels, zoom})`, `zonePoint(name)` for arrows/zooms, `cineBG(g, t)` nebula + bokeh + vignette backdrop (use instead of blueprint grids for emotional science).
- `cinematic-story/hand3d.js`: articulated 3D hands (`real` ink, `phantom` glowing wireframe, `rubber`), `.clench(k)`, `forearm`, `darkStage` (lamp beam + pool + teal back light), `motes`, `bokeh` (out-of-focus background lights).
- Layout rules learned: never place labels or pills over the hero object. Titles go at 0.12–0.16 H, secondary pills at 0.25–0.3 H, and captions at y 1440. Leave the middle band for the visual. For an end shot, frame the whole object diagonally, with dark gradients top and bottom for text.
- Partial re-render: `node render.mjs --from A --to B --out part.mp4` (use frame-aligned times), then splice with an ffmpeg trim/concat on the old MP4 and re-run `audio/mix.py`.
