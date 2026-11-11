# TOON THEORY — SHOW FORMAT BIBLE (permanent unless changed by the owner)
**Format:** fast-paced, two-character, internet-style psychology and human-behaviour show. Vertical 9:16, 1080×1920. Default 60–90 s.
**Tagline / end card:** TOON THEORY — PEOPLE ARE WEIRD. LET'S EXPLAIN WHY.

## The duo (approved designs; never redesign)
| | PRIYA (the girl) | ANKUSH (the boy) |
|---|---|---|
| Role | Explains, challenges misconceptions, sarcastic | Confidently incorrect, asks the audience's questions, creates comedy |
| Voice (ElevenLabs) | Sarah — clear, dry, quick | Liam — bright, fast, playful |
| Comedy engine | Deadpan put-downs, raised eyebrow, the scorecard | Wrong-but-useful questions, running bits ("Put 'handsome'.") |
| Rule | Not a teacher: she's wrong or caught out at least once per episode | Not stupid: lands one genuinely sharp observation per episode |
Krish, Meera, Rohan, Aman remain in the universe as cameo/guest characters.

## Episode structure (6 beats)
1. **Outrageous hook (0–6 s)** — topic understood in 5 s; a provocative claim the duo immediately argue about.
2. **Relatable situation** — a real-world scene viewers recognise.
3. **Argument + comedy** — the duo disagree; a recurring device (e.g. the scorecard).
4. **Science** — 1–3 findings, each with a compact on-screen citation card and a plain-language limitation.
5. **Unexpected twist** — a finding or reveal that flips the premise.
6. **Punchline + takeaway** — one memorable line, then a callback/loop to the hook; end card + comment prompt.

## Edit grammar
- Visual change every 1–3 s in energetic sections: cut, zoom-punch, freeze-frame + label, split screen, whip-pan, kinetic type, cutout pop.
- Freeze-frame labels: white Inter 900 text on a black tab; red circle/arrow callouts; "WAIT, WHAT?" style slams.
- Intentional silence (0.4–1.0 s) before the twist and before the final line.
- Subtitles always on: Inter 900, white + black stroke, max 2 lines, centred lower third; on-screen text never collides with subtitles.
- Research cards: `Author et al., Year · design (survey / experiment / correlation / meta-analysis) · sample` — small, top-left, 2–3 s.
- Reaction imagery = ORIGINAL character cutouts from the expression library (8 expressions per character). No copyrighted meme templates.
- Music: original score or CC0/CC BY tracks only; ducked under dialogue; voice ≥ 14 dB above bed; loudness −14 LUFS, true peak ≤ −1 dBFS.

## Research standard
Peer-reviewed primary studies and meta-analyses first; read the abstract/paper itself, not snippets; label each claim as **experiment / correlation / survey (stated preference) / meta-analysis / hypothesis / creative interpretation**; never invent numbers; say limitations in plain words ("one study", "on average", "people said, not did"); no gender-stereotype generalisations. Keep notes in `<episode>/RESEARCH.md`.

## Asset & copyright standard
Every external asset gets a row in `<episode>/asset_ledger.csv` (template in `templates/asset_ledger.csv`): creator, original URL, licence + licence URL, attribution text, commercial-use OK, modification OK, ShareAlike, status, notes.
- Accept: CC0, Public Domain Mark (verified), CC BY. **Avoid CC BY-SA** in composites (ShareAlike may attach to the whole video) unless the owner approves. Never NC/ND.
- Internet Archive: use only items whose metadata states PD/CC0 *and* note that IA metadata is not a legal guarantee; keep the item URL. Never assume archival = public domain.
- No identifiable private people (especially minors) from found footage.
- Prefer original characters, graphics and diagrams; external media only where it adds something originals can't.

## Approval gates
1. Research summary + script + scene-by-scene visual plan + asset ledger → **owner approves script**.
2. **Rough edit** (low-res, temp sound) → owner review.
3. Final render + subtitles (.srt) + thumbnail + metadata + production report.

## Reusable production parts
`characters/generate_characters.py` (designs), `ep001/build/rig.py` (puppet rig: expressions, audio-driven lip-sync, blinks), `ep001/audio/align_split.py` (take → per-line clips), `ep001/build/timeline.py` pattern (measured-audio timeline), `studio/shorts_gen/audio_short.py` (mix), HyperFrames for render.
