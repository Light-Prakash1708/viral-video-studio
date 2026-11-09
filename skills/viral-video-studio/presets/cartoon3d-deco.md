# Preset: cartoon3d-deco (first used on "The Man Who Paid You With Your Own Money", Ponzi, Nov 2026)
Hybrid chosen by the Style choice rule: **Cartoon-3D** story scenes (bean-head ink cards `bean.js` inside lit three.js sets `pz3d.js`:
1920s street with painted cloud sky, flags, trees, signs, Model T, office, pitch hall, columned bank/mansion, hospital) + **Art Deco**
inserts (`deco.js`: gold engraved lines on lacquer black, sunbursts, stepped frames; grammar from Lemo-Opuscar art-deco) for numbers,
coupons, math bars and pyramids + newsreel/halftone press for headlines. Grade `vivid` (Segment-Zero brightness).
Lessons: wide-angle dolly-zoom (`camAt(..., wide=1.45)`) keeps framing but adds cinematic depth; POV hands hook (RickClips) with a
top curiosity line for 2.4 s; per-shot `captionStyle` override in shots.json (POV shots y 1800) so captions never cover hands or faces;
banner/canvas text must fit its texture; buildings placed in front of facade rows (z ≈ -8) or they vanish; ~1.4 word-anchored SFX/s.
Voice: ElevenLabs eleven_v4 with tags, then pauses capped at 0.22 s and ×1.15 formant-preserved tempo (97.8 s → 76.5 s, ~190 wpm).

## v2 fixes (user feedback: hook text, cash, coupon, death, hand catch, voice under music)
- Rebuilt q01/q04/q10/q17 as painted 2D (`paint2d.js`: layered atmospheric skylines, additive glows, painted wood, lit characters with rim + shade, chunky outlined `headline()` — the quality bar of top 2D history channels). Hook headline = huge white/yellow words with thick ink, word-by-word pop (not a small pill).
- Hand catch: anticipation dip, palm opens, notes land between palm and fingers, fingers curl (`povGrip`), squash and settle.
- Mix: generated jazz masks speech → EQ-carve the music (−7 dB @ 2.2 kHz), music gainDb −15 with duckDb −12, SFX duckDb −4 under the narrator, narration presence EQ. `mix.py` now reads `music.duckDb` / `sfx.duckDb`.
- Partial re-render: render only the changed shot ranges (frame-exact), splice with ffmpeg select + concat, remix. Check `df -h` first: a full disk silently stalls the renderer.
