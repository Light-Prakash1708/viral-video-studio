# Preset: philosophy-dialogue (vertical "big question" Shorts, 2–3 min)
Measured from a fast-growing small channel in this genre (Nov 2026: 4.5K subscribers, 8 uploads, three breakouts: "Time and Infinity: Does Anything Really End?" 294K, "Can We Trust AI? Why Claude Agrees With You" 73K, "Life and Consciousness: What Are We, If We Look Closer?" 48K; the non-breakouts were single plain questions at 3.8K–6.8K). Use it as a genre playbook; our look and scripts are our own.

Engine: GrowKaz three-kit (3D clay room) + 2D canvas ink worlds. Kit: `presets/philosophy-dialogue/dialogue.js` (copy next to `lifesim.js` into `scenes/sets/`). Format: 9:16, 1080x1920, 24 fps, 2:30–3:00.

## 1. What makes it work (measured on the 2:57 reference)
- **Title formula:** `<Big Noun> and <Big Noun>: <Deep Question>?` + 3 hashtags (#consciousness #life #ai …). Two cosmic nouns + a question you can't stop thinking about. Plain single questions ("Should we be scared of AI?") did 10–50x worse.
- **Script = Socratic dialogue, not narration.** Two voices: a curious ASKER (short, naive questions: "What?", "Connecting how?", "A flower?", "Step away where?") and a calm GUIDE (short declaratives). 441 words in 177 s; 229 wpm while speaking but 36 pauses > 0.6 s, so it feels calm. Lines average 5 words. The asker's questions are the viewer's questions, which is why it holds attention.
- **Structure = one journey out, one journey in:** cold-open curiosity line → a surprising frame ("the universe is an interface") → 4 concrete animal examples (bat echo, mole touch, mosquito breath, bee and flower) → "whose is the real one?" → ZOOM OUT (room → city → Earth → atoms → fields → "an ocean of energy") → "where is life? where am I? Nowhere" → ZOOM IN (inside a baby's brain: signals → red → a face → mom → a room → the sky) → reframe ("the world doesn't come in, it gets made in here") → twist ("it's the universe living inside us") → quiet loop line ("every morning … your whole universe assembles again").
- **Visual grammar (two worlds + one warm accent):** (A) faceless white clay figures in a soft matte room with a big round portal window (sky / space / Earth); the GUIDE carries a red-orange starburst on the face. (B) Etched white-ink line art on black for every idea: animals in engraved circles, concentric echo rings, particle spheres, a wireframe "ocean" of waves, labels in small caps (HAND / TABLE / EARTH). (C) For human warmth only: soft pastel portrait drawings (baby, mother). One accent colour (red-orange) is the only colour besides the Earth: it marks the speaker, the point of focus, the source of a signal.
- **Motion:** almost no hard cuts (scene detection finds 0): everything morphs, zooms or dissolves; slow drifts; particles assemble and disperse. Calm = premium.
- **Captions:** small, centred, sentence case, word-by-word fade-in, a red dot before the GUIDE's lines. They are part of the design, not a subtitle bar.
- **Sound:** −22 LUFS, voices 11 dB over a soft ambient pad, almost no SFX. (This is the weakest part of the reference, so it is our biggest opportunity.)

## 2. Our upgrades (how we beat it)
1. **Hook in 1.5 s.** Open on the most impossible line from the middle of the script as a question ("What if nothing has ever been born?"), then the asker's naive reply. The reference opens on a quiet line, which loses scrollers.
2. **Sound that makes ideas physical:** each metaphor gets a signature sound: bat → sonar pings in sync with the rings; mole → soft earth crunches; mosquito → breath + a tiny whine; atoms → crystalline ticks; the field → a low sine swell; baby brain → heartbeat + a single piano note per new "painted" thing; Earth reveal → wind + choir shimmer. Mix to −14 LUFS (Shorts standard), pad 12 dB under the voice, a full drop to silence before the twist line.
3. **Two real voices, free:** `tools/voice.py` with a cast: `@voice ASKER gentle pitch=+1.5 speed=1.03` and `@voice GUIDE storyteller pitch=-1 speed=0.95` (or `deep`); lines tagged `ASKER:` / `GUIDE:`. The asker should sound younger and lighter, the guide slower and warmer.
4. **One signature transition: through the portal.** Every scene change zooms through the round window or an engraved circle (the circle is the motif: portal → eye → atom → Earth → pupil). This gives the film one continuous camera move, which the reference only half does.
5. **Richer ink worlds:** use `inkRings`, `inkSphere` (with `disperse` for "same pieces"), `inkWaves`, `inkCircle` frames, `inkStars`, and draw new animals or objects as clean line paths (stroke white, 2–3 px, hatching for shade). Keep everything monochrome + accent.
6. **Loop ending:** the last line should flow into the first ("…and your universe opens its eyes again." → cut to the opening line). Loops drive replays, and replays drive Shorts reach.
7. **Pinned-comment question** that splits opinion ("Is the world out there, or in here?").

## 3. Script recipe (2:30–3:00, 380–460 words)
- 70% GUIDE / 30% ASKER by words; ASKER lines 1–5 words, mostly questions; GUIDE lines ≤ 10 words.
- Beats: hook question (0–3 s) → frame flip (3–15 s) → 3–4 concrete examples from nature or science (15–45 s) → "so which is real?" → zoom-out sequence with one-word or very short lines (45–90 s) → "where is ___?" list → zoom-in sequence (90–140 s) → reframe → twist → loop line.
- Ground every big claim in a real fact (echolocation, mosquitoes tracking CO2, bees changing nectar, quantum fields, the brain building colour) so comments argue about meaning, not facts.
- Topic bank: Time and Infinity (does anything end?), Memory and Identity (are you the same person as yesterday?), Death and Atoms (where do we go?), Free Will and the Brain (who decides?), Colour and Reality (is red real?), AI and Consciousness (can a mind be made of words?), Dreams and Waking (how do you know you're awake?), Love and Chemistry (is love just molecules?).

## 4. Kit (`dialogue.js`)
- `clayRoom(T, {view: 'sky'|'dawn'|'space'|'earth', portalR, portalX, portalY})` → `{stage, portal, setPortal(kind)}`: matte white room, round portal, table + plant.
- `clayFigure(T, {glyph})` → `.set({glyph, pulse, tilt, nod, turn, armL, armR, reachL, reachR, sit, breathe})`; put them at x ±0.45, z 0.3–0.5, rotate ±1.1 to face each other; camera z 5.5, y 1.6 in 9:16.
- Ink 2D: `inkBG`, `inkStars`, `inkRings(g, t, x, y, {r, n})`, `inkSphere(g, t, x, y, r, {n, disperse, ring})`, `inkWaves(g, t, {top, amp})`, `inkCircle(g, x, y, r, drawFn)`, `inkLabel`, `morph(t, t0, d)`.
- `dialogueCaption(g, t, words, {speaker: 'guide'|'asker', dark})`: build `words` from timeline/words.json for the shot (`{w, t}` shot-local).
- Music: `tools/groove.py` style `dreamy` (energy 0.3–0.5) for the whole piece with `score.py` piano notes on reveals; or a single ambient pad + piano. No drums.
