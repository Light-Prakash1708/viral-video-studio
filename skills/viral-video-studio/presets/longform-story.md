# Preset: longform-story  (6–12 min YouTube long-form, 16:9)
Read `references/longform-playbook.md` first and pick ONE of its 5 formats. Engine: GrowKaz (`--aspect 16:9 --resolution 1080p`), `"captions": false` (long-form viewers use CC), `"bars": null`.
Helpers: `presets/longform-story/longform.js` (counter, pill, cite, chapter, keyword) + any preset's sets (nostalgic-painterly paint.js for warm worlds, urban-3d station.js, map-explainer geo.js for history).

## Production plan
1. **Outline** (before voice): cold open (0:00–0:30) → 4–5 chapters of 1–2 min each, each = naive idea → "except" → mechanism + analogy → named real case → deadpan beat → open loop → emotional low (~60%) → "But here's the thing" → honest answer + price → callback ending + question.
2. **Voice per chapter as separate explainroo scenes** (`## ch1 {hold=1.2}` …) so the pauses between chapters breathe; calm science 135–150 wpm (`speed 1.0`, sentenceGap 0.25, paragraphGap 0.6) or memoir 180–200 wpm. Master with the Voice-first chain.
3. **Recurring home set + 2–3 recurring characters** (opening = closing location, changed). Re-use sets; long-form needs fewer, richer sets (6–8 for 7 min), not 40.
4. **Shot rhythm**: science mode 6–15 s shots with in-scene animation every 2–3 s (counters, labels, characters acting, camera push); memoir mode 3–4 s cut-aways back to the home-base host.
5. **Music**: continuous score, one mood section per chapter, `gainDb −18`, LRA ≤ 5; SFX only on counters, swipes, punchlines.
6. **Package**: question/premise title ≤ 60 chars, chapters in description, pinned question comment, plus a 45 s Short cut from the cold open.
Render time: ~0.8–2 fps → a 7 min 1080p video ≈ 1–2.5 h; render in background, preview with `--from/--to` per chapter first.
