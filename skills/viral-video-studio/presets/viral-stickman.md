# Preset: viral-stickman
Engine: GrowKaz Stickman (`make-2d-video`), 9:16, 1080p, 24 fps. Proven on "The Ship of Theseus" (Nov 2026).

## Look
- `config.json`: `"style": "aegean"` (bright Mediterranean daylight; defined in kit `engine/styles.js`), `"captions": true`, `"captionStyle": {"y": 1450, "size": 96, "max": 2}`, `"music": {"gainDb": -15}`.
- Bright moods (golden/dusk overridden by aegean). Use night/storm only for 1–2 "dark turn" shots.
- Numbers: always use `presets/viral-stickman/stat.js` → `stat(g, {label, value, ...})` (label above, big value below, dark pill; never `UI.readout` inline label+value).

## Voice (matches top viral story Shorts: ~210–220 wpm, no dead air)
- Write casual story narration: "So he does what any sane person would do." Short punchy sentences, a hook question first, a twist ("here's the creepy part"), a CTA at the end. Facts must stay accurate.
- Generate with explainroo: one scene `## all`, `video.json`: `"voice": "am_michael", "speed": 1.22, "sentenceGap": 0.06, "paragraphGap": 0.1, "lead": 0.1, "music": false, "sfx": false`. Target 200–220 wpm; check with Whisper and fix names with `{Shown|spoken}`.
- Take `build/voice/all.wav` (+1 s tail) as the GrowKaz voiceover; align with `transcribe.py --script`.

## Pacing
- ~23–25 shots per minute, median 2–2.5 s, never > 5 s. Cut on phrase boundaries 0.1–0.2 s early.
- Whip / flash / zoom transitions on story turns; SFX on every pop (pop, whoosh, impact, stinger, riser).
- Music sections: mystery → playful → tension → dark → wonder, intensity 0.6–0.7.
