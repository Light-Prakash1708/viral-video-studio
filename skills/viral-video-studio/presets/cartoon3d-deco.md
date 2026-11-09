# Preset: cartoon3d-deco (first used on "The Man Who Paid You With Your Own Money", Ponzi, Nov 2026)
Hybrid chosen by the Style choice rule: **Cartoon-3D** story scenes (bean-head ink cards `bean.js` inside lit three.js sets `pz3d.js`:
1920s street with painted cloud sky, flags, trees, signs, Model T, office, pitch hall, columned bank/mansion, hospital) + **Art Deco**
inserts (`deco.js`: gold engraved lines on lacquer black, sunbursts, stepped frames; grammar from Lemo-Opuscar art-deco) for numbers,
coupons, math bars and pyramids + newsreel/halftone press for headlines. Grade `vivid` (Segment-Zero brightness).
Lessons: wide-angle dolly-zoom (`camAt(..., wide=1.45)`) keeps framing but adds cinematic depth; POV hands hook (RickClips) with a
top curiosity line for 2.4 s; per-shot `captionStyle` override in shots.json (POV shots y 1800) so captions never cover hands or faces;
banner/canvas text must fit its texture; buildings placed in front of facade rows (z ≈ -8) or they vanish; ~1.4 word-anchored SFX/s.
Voice: ElevenLabs eleven_v4 with tags, then pauses capped at 0.22 s and ×1.15 formant-preserved tempo (97.8 s → 76.5 s, ~190 wpm).
