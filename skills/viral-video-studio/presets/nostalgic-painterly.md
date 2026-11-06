# Preset: nostalgic-painterly  (cinematic, emotional, painterly — proven on "Why Childhood Felt Longer", Nov 2026)
Engine: GrowKaz Stickman, 9:16 1080p. `config.json`: `"style": "painterly"`, `"bars": "scope"`, `"captionStyle": {"y":1440,"size":86,"max":2}`,
`"music": {"gainDb": -15, "key": "D", "seed": 7}` (one key + seed = one continuous score), `"sfx": {"gainDb": -8}`.
Helpers (copy into `scenes/sets/`): `presets/nostalgic-painterly/paint.js` (paper grain, light leaks, watercolour blobs/skies, brush grass,
meadow/beach/room sets, polaroid, memory jar, calendar, bigWord) + `presets/silent-story/silent.js` (desat) + `stat.js`.

## Look rules
- Call `leak(g, t)` then `paper(g)` LAST in every shot. Keep paper ≤ 0.15 and leak ≤ 0.25 so it stays crisp ("clear" > "hazy").
- Colour = emotion: childhood/joy saturated; routine/adult `desat(g, 0.75–0.9)`; colour floods back at the resolution.
- Clear text: one `bigWord()` key phrase per shot (dark backing pill), `stat()` for numbers; never more than 2 text elements at once.
- A recurring physical motif that stores the abstract idea (polaroids → memory jar). The same character at two ages, linked by one colour (yellow tee, faded as an adult).

## Voice & music
- Voice: explainroo `af_heart`, speed 1.1, sentenceGap 0.18 (warm, ~190 wpm). Music arc: wonder → sad → mystery → calm → hopeful, intensity 0.45–0.6, ducked under voice automatically by mix.py (−9 dB when speaking).
- SFX: soft only (shimmer, camera flash, tick, slowmo, wind bed). Keep them ≥ 6 dB under the voice.

## Structure
Hook question with a visual contrast (expanding summer vs flipping calendar) → nostalgic firsts montage (3 × polaroid) → the idea made physical (jar fills)
→ the grey loop (one word per beat) → "here's the strange part" close-up → the mechanism (two jars) → named research card → two comparison bars
→ reframing line → hopeful action → end card with both ages + question.
