---
name: viral-video-studio
description: >
  One-command studio for viral animated YouTube / Shorts / Reels videos. Takes a topic (or voiceover/script),
  lets the user pick or design a style, and routes to the right engine: GrowKaz Stickman (stick-figure 2D+3D),
  explainroo (explainer with local AI voice, hand-drawn diagrams), vox-director (paper-collage motion design),
  or cartoon-3d-short (2D cartoon characters in a 3D world, three.js + Remotion). Use when the user says
  "make a video", "viral video", "YouTube video", "build my video", "/viral-video-studio", or gives a topic
  and wants a finished animated MP4.
---

# Viral Video Studio (bundle skill)

Usage: `/viral-video-studio <topic> [--style <name>|custom] [--format 9:16|16:9] [--length 30s|60s|5min]`

## Style menu (offer this when `--style` is missing; user may also choose "custom")

| # | Style | Engine (skill folder) | Look | Best for |
|---|---|---|---|---|
| 1 | Stickman Cinematic (emerald / ember / arctic / sakura / retro colour grades) | `make-2d-video` (+ `video-styles`, `video-sound`, `render-video`) | Rim-lit stick figures, moody 2.5D sets, 3D shots | Faceless story channels, "What if" videos, own voiceover |
| 2 | Explainer (themes: paper, clean, chalk, blueprint, midnight, editorial) | `explainroo` (`~/explainroo`) | Hand-drawn diagrams, charts, code, narrated, captions | Tutorials, tech, finance, how-it-works |
| 3 | Paper Collage (Vox) | `vox-director` (`~/vox-director`) | Torn paper, halftone, bold colour, motion | Ads, history/culture, punchy shorts |
| 4 | 3D Cartoon Story | `cartoon-3d-short` | Flat cartoon characters in painted 3D world, ink outlines, lens blur, march score | 55-70s vertical history/science stories |
| 5 | Silent Story (preset `silent-story`) | `make-2d-video`, style `silent` | Wordless short film: eyes-only silhouettes, grey world that earns colour, props as feelings, in-world one-liners, quote cards | Emotional self-improvement / relationship stories (3–6 min 16:9 + 60 s Short) |
| 6 | Map Explainer (preset `map-explainer`) | `make-2d-video` + `presets/map-explainer/geo.js` | Real Natural Earth world map, fly-to zooms, glowing country highlights, routes, pins, talking-country jokes | Geography / history "why is X like this?" Shorts |
| 7 | What-IF Life Sim (preset `whatif-life-sim`) | `make-2d-video` 3D shots + `presets/whatif-life-sim/lifesim.js` | Glossy rim-aura bubble-head people, twilight indigo→coral light, real depth of field, glowing threads + game HUD counter | "What IF You…" second-person superpower stories (10 min 16:9 or 70 s 9:16) |
| 8 | Mythic Cinematic 3D (preset `mythic-3d`) | `make-2d-video` 3D + `presets/mythic-3d/` | Golden worldbuilding: island city, ten towers, vimanas, festival fire + fireworks, regal silhouettes, real maps | Mythology alternate-history / "what if the legend ended differently" (3–5 min) |
| 9 | Finance Stickman (preset `finance-stickman`) | `make-2d-video` 2D + 3D + `presets/finance-stickman/` | Rim-lit stick figures in rich Indian streets/interiors, burning-note device, day HUD, charts, 3D wallet/Earth | Money / economics thought experiments (3–4 min) |
| 11 | Philosophy Dialogue Short | GrowKaz three-kit + 2D ink (`presets/philosophy-dialogue.md`) | Faceless white clay figures in a soft portal room + etched white-ink worlds on black, one red-orange accent, word-fade captions, two-voice Socratic script | "Big noun and big noun: deep question?" Shorts (consciousness, time, AI, identity) |
| 10 | Custom | Any engine + a saved style preset | Built from the user's answers | Brand look, niche channel |

Ask which one (single question, show the table). Recommend one based on the topic if the user is unsure.

## Saved presets
Read the preset file before using it: `presets/viral-stickman.md` (bright fast facts), `presets/cinematic-story.md` (emotional "what if"), `presets/silent-story.md` (wordless short film), `presets/map-explainer.md` (map Shorts), `presets/nostalgic-painterly.md` (warm painterly, emotional essays), `presets/urban-3d.md` (cinematic 3D city/psychology), `presets/surreal-3d.md` (futuristic dream worlds, philosophy), `presets/longform-story.md` (6–12 min YouTube long-form; read `references/longform-playbook.md`), `presets/doodle-explainer.md` (black-screen doodle self-help, explainroo), `presets/whatif-life-sim.md` ("What IF You…" 3D life-sim stories: escalation ladder, HUD mechanic, science fact per rung, quiet-thread payoff), `presets/mythic-3d.md` (mythology worldbuilding), `presets/finance-stickman.md` (money thought experiments). Each lists look, voice, structure and pacing rules plus the helper JS to copy into the project's `scenes/sets/`.

## Story doctor (run on every script before rendering)
1. One specific, relatable problem or oddity — visible in the first frame.
2. A prop or meter that makes the invisible visible (chart, clock, counter, map highlight).
3. Repetition with variation (loop of 3+), then the break.
4. One reframing line/question at the midpoint.
5. Earned visual change (colour, light, zoom) that tracks the emotional arc.
6. Callback ending + one-line moral or reframing closer; title = the key number/word.
7. Packaging: title formula, 3-sentence description + question CTA, thumbnail = hero + prop + one accent colour.

## Long-form mode (when the user asks for a YouTube video longer than ~3 min)
Read `references/longform-playbook.md` (measured from top channels) and `presets/longform-story.md`. Key rules: pick one of the 7 formats (science scenario, animated memoir, lore retelling, sketch hypothetical, myth/philosophy question, doodle self-help, "Every X Explained" listicle); cold open with a concrete scene in the first 5 s; naive idea → "except" → mechanism + analogy → named real case, looped per chapter; deadpan comedy every 45–60 s; emotional low at ~60% then "But here's the thing"; honest answer + callback ending; chapters every 1–2 min; calm 135–150 wpm or memoir 180–200 wpm; fewer, richer recurring sets; continuous music; cite every number on screen.

## Voice first (do this BEFORE any visuals, every video)
The user hears "AI voice" instantly and hates it. Default to a human-grade voice:
1. **ElevenLabs v4 (preferred)** via the ElevenLabs connector: `creative_list_voices` (search "storyteller narrator", languages en, use_cases narrative_story) → `creative_generate_speech` model `eleven_v4`, `generations_count: 1`, the WHOLE script in one call with inline audio tags (`[curious] [softly] [whispers] [chuckles] [nervous] [sad] [warmly] [excited] [pause] [short pause]`, ellipses for beats, a tag only where delivery changes) → poll `creative_get_flow_run_status` → `curl` the `content_url` MP3 right away (signed URL expires). ~3,200 credits per 3.5-min script. Proven voices: Leo `TLC61WvtioR7PrhxZ1RH` (young engaging storyteller, What-IF), Clark `q6K6eJHlET6X3ASlVWD9` (trusted explainer, finance), Omar `hbyBxnVrwGXVeMJ30tp2` (Indian-accent history storyteller, mythology), Mia `e6qsVnCuD0MWxmhZcuKz` (elegant reflective). If the free queue is busy ("Free generations are busy"), do not retry that turn: fall back to Kokoro and swap the voice later with `tools/retime.py`.
   Master an ElevenLabs take LIGHTLY (it is already clean; no added room echo): `highpass=f=70,equalizer=f=200:t=q:w=1.0:g=1.0,equalizer=f=3500:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=2.2:attack=8:release=150:makeup=1.5,alimiter=limit=0.92,adelay=150,apad=pad_dur=1.6`.
2. **Local voice, free (house voices, no API)**: `~/voicekit/.venv/bin/python <skill>/tools/voice.py --script input/script.txt --voice storyteller --out input/voiceover.wav --takes 2` (first run: `bash <skill>/tools/setup_kit.sh`). Chatterbox Multilingual (MIT) cloning ORIGINAL synthetic timbre seeds; ~5x real time on 4 CPU cores (3.5 min ≈ 18 min). Presets (`--list`): `storyteller` (warm young male, What-IF), `desi-narrator` (Indian-English male, mythology/India), `deep` (cinematic dark/epic), `gentle` (female, emotional/science), `british` (documentary), `hindi-m`, `hindi-f` (Hindi scripts, `lang hi`). Own voice: `--seed my_30s_recording.wav`. NEVER seed with an ElevenLabs library voice or any real person without consent (it copies a paid voice actor and breaks ElevenLabs terms). Built-in run-on guard re-rolls takes that babble past the line; `--takes 2` picks the best by Whisper.
   **Several voices in one video (free)**: declare the cast at the top of the script, then tag character lines; one render, model loaded once, writes `voiceover.wav.lines.json` (speaker + start/end) for cutting to the speaker and colouring captions:
   `@voice KABIR desi-narrator pitch=-1.5` / `@voice RIYA gentle pitch=+1` / `@voice KID storyteller pitch=+4 speed=1.06` / `@voice DADI hindi-f lang=hi pitch=-2.5` then `KABIR: Bro, how did you know?`. Narration lines stay untagged. Pitch is formant-preserving (rubberband), so a kid or grandma comes from the same seed without chipmunk sound. Budget tip: keep ElevenLabs (credits) for the narrator only if wanted, and make all character lines locally, then splice them into the narration gaps.
3. **Kokoro fallback** (explainroo, local): `af_heart` warm, `am_michael` energetic, `bm_george` deep epic storyteller (mythology). Strip ElevenLabs tags → `[pause 0.3–0.55]`. Never list single words as separate sentences ("Work. Scroll. Sleep.") — use a comma list. Spell tricky names `{Wörgl|Vurgle}`.
   Kokoro master: `highpass=f=75,equalizer=f=180:t=q:w=1.0:g=2.0,equalizer=f=3200:t=q:w=1.2:g=2.0,equalizer=f=7500:t=q:w=1.5:g=-1.5,deesser=i=0.35,acompressor=threshold=-21dB:ratio=3:attack=6:release=120:makeup=2.5,aecho=0.85:0.7:30|55:0.07|0.04,alimiter=limit=0.9`.
4. **Write for the ear**: second person, present tense, contractions, short + long sentence mix, one idea per sentence, a real fact every 45–60 s, quotes for dialogue, CTA question. Pace: storyteller 150–165 wpm; epic/myth 130–140; viral facts 200+.
5. Transcribe with `tools/transcribe.py --script` (≥ 96% alignment is fine; digit/word number mismatches are expected).
6. **Swapping the voice after the visuals are built**: save `timeline/words.json`, drop in the new `input/voiceover.wav`, re-transcribe, run `python3 <skill>/tools/retime.py projects/P words_old.json` — all shots, SFX offsets and music sections follow the new timing; word-timed scenes adapt automatically.
7. **Fixing one line**: regenerate just that line, match RMS, splice into the same slot (keeps shot timing).

## Music that does not sound AI-made
- The procedural `audio/music.py` moods jump keys/genres between sections → reads as stock/AI. For finished films write a score with `python3 <skill>/tools/score.py plan.json input/score.wav DURATION`: one key, humanised felt piano (motif / sparse / arp8 / block), string ensemble, felt pulse for montages, timpani roll into reveals, shimmer for magic, drone + single notes for the emotional peak, cut to silence on the reveal word, final chord rings out. Map sections to `timeline/sentences.json` beats. Then `config.music = {"enabled": true, "gainDb": -8, "file": "input/score.wav"}`.
- **Catchy groove beds (the "addictive" background music)**: `python3 <skill>/tools/groove.py plan.json input/groove.wav DURATION`. 10 styles, all local synthesis: `lofi` (82 bpm, Rhodes, dusty swing: explainers, cosy stories), `pop` (112, plucks + claps: school/social life-sim), `phonk` (130 half-time, bell hook, 808: flex, money, villain arcs), `trap` (140, hat rolls, dark bells: crime, dark facts), `synthwave` (100, gated snare, saw arp: tech, future, 80s), `desi` (96, tabla theka + tanpura + sitar hook: India, mythology, family), `suspense` (120, 16th ostinato: mysteries, countdowns), `epic` (90, taiko + piano ostinato: history, battles), `chase` (150, toms + staccato strings: escapes, climaxes), `dreamy` (70, pads + music box, no drums: memories, endings). Each section gets an `energy` 0–1 (0.3 explanation, 0.6 story, 0.9 montage/reveal); a seeded 2-bar hook repeats with a variation every 4th bar (the earworm); kick-driven sidechain pump keeps the voice on top; sections are level-matched. Events: `riser`, `impact`, `stop` (music drops out under the punch line), `tape` (tape-stop into a reveal). Switch style per chapter but keep ONE key. Use with `config.music = {"enabled":true,"gainDb":-10,"file":"input/groove.wav"}`; for emotional films blend: groove for the fun chapters, `score.py` piano/strings for the heartbreak + ending (render both, crossfade with ffmpeg `acrossfade`).
- Viral storytellers keep the bed only ~7–10 dB under the voice in gaps (mix.py ducks −9 dB while speaking); aim voice ≥ 12 dB above bed while speaking, about −30 dB bed in pauses.

## Sound effects that do not sound cheap
- Real-world sounds tied to on-screen action (rain, thunder, phones, footsteps, traffic, crowd, paper) + soft transitions. About 0.4 cues per second max (≈ 75 for 3 min).
- **Recorded SFX library** (`audio/sfxlib/<name>/*.wav`, installed by `tools/setup_kit.sh`): `sfx.py` prefers these over synthesis; each use picks a variant by seed and varies pitch ±5 %, brightness and gain, and loops ambience beds with crossfades, so no two videos sound identical. Grow it once with ElevenLabs (`creative_generate_in_flow` node_type `sfx`, model `eleven_text_to_sound_v2`, 4 takes = 200 credits per sound) using the prompts in `audio/sfxlib/PROMPTS.json`; save as `<name>/el_N.wav` (48 kHz stereo). Owned generated sounds may be reused in every video. `SFX_SYNTH_ONLY=1` forces the old synth sounds.
- Avoid game-UI clutter: no `tick`, `glitch`, `ding`, `powerup`, `counter`, `freeze`, `slowmo` spam. `pop`/`blip` ≤ −16 dB and only on a number reveal; `swish`/`whoosh` ≤ −15 dB and at most one per 6 s; `shimmer` only on the magical moments; ambience beds −24 dB (murmur/city/hum) or −20 dB.

## Rendering on a small machine (4 shared cores)
- ONE full render at a time, `--workers 4`. Before starting, `pgrep -fa render.mjs` — a leftover/duplicate render silently halves speed and both write the same `build/parts`.
- Use `bash <skill>/tools/render_chunks.sh projects/P [SCALE] [40] [4]`: ~40 s chunks, skips finished chunks, low-memory concat, upscales to 1080p. The container can restart mid-render; chunks limit the loss.
- Heavy 3D (DOF/bloom) speed-ups: in your stage helper set `composer.renderTarget1/2.samples = 0`, `bloom.setSize(w/2, h/2)`, `sun.shadow.mapSize 1024` (≈ 1.5×), and/or `SCALE 0.8` (≈ 1.5×, upscaled; invisible under DOF). Measured: 2D ≈ 2.5 s/frame shared, 3D life-sim 0.65 fps on 4 workers.
- Crash mid-render: finished `build/parts/part_00k.mp4` are fine; cut-off ones ("moov atom not found") → `python3 <skill>/tools/recover_parts.py GOOD_PART BROKEN_PART out.mp4`, re-render only the missing tail, concat.
- Fix a few shots after delivery: re-render only those ranges (`--from/--to`, frame-aligned), then `bash <skill>/tools/splice.sh base.mp4 out.mp4 "START END part.mp4" …` (never a big trim/concat filter_complex: it OOMs).
- Final QC in one command: `python3 <skill>/tools/qc.py FINAL.mp4 input/voiceover.wav script.txt`, then LOOK at the contact sheet.

## Characters people remember (cast kit, `presets/whatif-life-sim/cast.js`)
Measured from the top life-sim channels (e.g. "What IF You Could See Everyone's Lie Count?", 11 min): every recurring character is told apart from a WIDE shot by (1) a hair/headwear silhouette (blond curly mop, spiky, afro, beanie, bike helmet, buzz), (2) an outfit pattern/colour block (red plaid, pink hoodie, yellow tie, apron) and (3) one signature prop (flowers, cake, helmet, phone). Faces stay simple but change on every important word. Our upgrade:
- `person2(T, 'bestie' | {...}, overrides)`: 18 archetypes in `CAST` (hero, bestie, crush, nerd, jock, rebel, artsy, rich, shy, biker, teacher, mom, dad, dadi, chef, doctor, gamer, elder), each a unique silhouette + outfit + prop, all overridable.
- 23 3D hairstyles/headwear (`hair3`: afro, curlymop, spiky, mohawk, buzz, bald, swoop, sidepart, short, bowl, long, pony, braid, bun, twobuns, cap, backcap, beanie, helmet, chefhat, turban, hijab, none); 16 outfits (`outfit`: hoodie, tee, plaid, stripes, polka, uniform + `tie`, shirt, blazer, jacket, varsity + `letter`, cardigan, labcoat, overalls, apron, kurta, saree); accessories (`acc`: headphones, earrings, chain, scarf, backpack, watch, wristband, stethoscope, badge); props in hand (`prop` / `giveProp(T, ch, name, hand)`: phone (with screen), book, flowers, coffee, ball, cake, umbrella, guitar, mic, bag, clipboard, spatula, cane, icecream, sign).
- Face features (`face`): lashes, blush, freckles, mustache, stubble, bindi, mole. 22 expressions: neutral happy smug sad surprised awe worried love determined blink talk cry + angry (anger vein) smirk laugh shock nervous (sweat + wavy mouth) wink sleepy cringe suspicious proud. `castLine(ch, t, [[0,'neutral'],[1.2,'shock']])` adds natural blinks.
- Casting rules: max 5 recurring characters; no two share a silhouette or top colour; the hero is the plainest; give each a rim-aura colour that matches their thread/tag colour; Indian stories use mom/dad/dadi/elder looks (kurta, saree, bindi, mustache).

## Background worlds (storyboard options, `presets/whatif-life-sim/worlds.js`)
`world(T, name, {mood, seed, palette})` builds stage + lighting + set dressing + atmosphere and returns `{stage, spots, cams, tick}`. 17 worlds: classroom, bedroom, cafe, street, park, hospital, office, metro, beach, temple, stadium, kitchen, stage (wedding/event), mall, rooftop, void (memory/inner thoughts) + the friendship-film sets in fc.js (canteen, library, gully, airport, deskRoom). 6 moods: day, golden, dusk, night, rain (adds rain + splashes outdoors), dream (motes). 6 palettes: warm, cool, pastel, retro, neon, desi. `seed` re-rolls building heights, colours, prop layout.
Storyboard recipe: give each chapter one world + mood so the colour arc tells the story (warm day school → neon night street → cold rain → golden resolution → dream ending); use `W.cams.wide / mid / close` as starting framings and never cut between the same two; put characters on `W.spots.*`; call `W.tick(t)` in draw(). For a storyboard choice, render `--sheet` of 3 candidate world+mood pairs per chapter and pick.

## Visual lessons (each one cost a re-render)
- **Brightness for retention (v3)**: murky frames lose viewers. Faces must read in every shot: `lifeStage` now adds a warm front "beauty light" (`beauty: 0.9`, number to scale, `false` to disable), `world()` lifts ambient 1.35x (1.7x at night/rain) plus a hemisphere fill; keep night moods by colour (blue/purple sky, warm practicals), not by underexposure. Check a `--sheet`: skin should sit at roughly 55-75 % brightness; if a world is too bright (white walls), trim with `Wd.bright` / `world(..., {bright: 0.8})`.
- Text never over faces, numbers or the hero object: titles 0.08–0.2 H, pills 0.25–0.3 H, captions at the bottom band; check every contact sheet.
- `rr()` starts a new path: for an "everything except this window" mask draw `rr(...)` first, then `g.rect(0,0,W,H)`, then `fill('evenodd')`.
- Glass/transparent boxes need `depthWrite: false` or they hide decals behind them; decals need `polygonOffset`.
- Over-bright spot/point lights + bloom white out models (jet ski): keep SpotLight ≤ 10, PointLight 2–8.
- Real-world objects must read as real: extruded/bevelled side profiles (cars, jet skis, sneakers) instead of stacked boxes; add glass, lights, rims, straps, laces.
- No real brand logos (Nike swoosh, adidas stripes, Puma): invent distinct marks (ring, bolt, star) to avoid trademark/Content-ID claims.
- Deterministic animation only: positions must be functions of t (never `+=` per frame; workers render out of order).
- Figures standing on 2D platforms must be drawn inside the same parallax layer as the platform (or they float).

## Music & mix check (every video)
- Background music runs the whole video: set `config.music` `key` + `seed` so all sections share one key (one continuous score), mood arc in `shots.json → music`.
- mix.py ducks music under the voice; target voice ≥ 12 dB above the music/SFX bed while speaking, loudness −14 LUFS.
- Verify the final MP4 with Whisper: ≥ 97% of script words must be understood in the mixed audio.

## Custom style builder

When the user picks "custom" or "something different", ask once (skip anything already said):
1. Mood/genre (educational, funny, dramatic, mysterious, hype, calm)
2. Colour palette (3-5 colours or a reference: "neon cyberpunk", "warm pastel", "black and white noir")
3. Line/texture feel (clean vector, hand-drawn, chalk, paper cut-out, ink outline, pixel)
4. Pacing (fast cuts every 2-3s vs slower 5-8s)
5. Voice (Kokoro voice name/gender/accent, own recording, or ElevenLabs if key exists), music mood, captions on/off + caption style
6. Format and length

Then map to the closest engine and implement it there:
- Stickman: add a custom entry to `engine/styles.js` in the studio (see `video-styles` skill, "custom style").
- explainroo: pick nearest `--theme`, then override colours/fonts in the project's `scenes.js` / theme options.
- Collage: change the theme in vox-director's `style_bakeoff` and run a bake-off on one beat.
- 3D cartoon: edit palette/grade values in the Remotion template per `references/STYLE_BIBLE.md`.

Save the result as `~/.claude/skills/viral-video-studio/presets/<name>.md` (engine, parameters, palette, voice, pacing) so the user can reuse it with `--style <name>`. On each run, list files in `presets/` as extra menu options.

## Workflow

1. **Intake (ask once):** topic, audience, length, aspect ratio, style (menu above), own voiceover or generated.
2. **Viral script pass (always before rendering):**
   - Hook in the first 3 seconds (surprising claim, question, or stake). No "hey guys" intros.
   - Open loop then payoff; a visual pattern interrupt every 3-5 s; short sentences; one idea; end with a loop-back or single CTA.
   - Facts must be verifiable; never invent numbers or quotes.
   - Produce 3 title options (≤55 chars), a thumbnail concept, description, hashtags.
   - Show script + shot/beat list; get approval before rendering.
3. **Execute:** read the chosen engine's skill and follow it exactly (run its install step if missing). Keep outputs in `~/videos/<slug>/`.
4. **QC:** contact sheet / sample frames, audio levels, caption legibility, duration. Fix, then deliver.
5. **Deliver:** MP4 path, titles, thumbnail idea, description, hashtags. Offer to restyle (re-run with another style) or save the style as a preset.

## Environment notes
- Node network calls need the proxy: `export NODE_USE_ENV_PROXY=1` before any `node` command that downloads (e.g. `node bin/explainroo.js doctor --fetch`).
- explainroo requires `npm install` + `doctor --fetch` once (done in this container; models cache in `~/.cache/explainroo`).
- vox-director needs `ATLASCLOUD_API_KEY` and spends Atlas Cloud credits: confirm before generating.
- cartoon-3d-short: Remotion project is at `~/remotion-shorts` (deps installed, bridge template in `src/videos/bridge`, entry `src/Root.tsx`). Render with `export TMPDIR=~/remotion-tmp` and `--browser-executable=/usr/bin/google-chrome --gl=swangle` (`--gl=swiftshader` fails to create WebGL here). The Kenney 3D asset kit (`public/bridge/kenney/*.glb`) is NOT in the repo; without it the world renders as bare sky, so add those CC0 assets (kenney.nl) before real renders. Needs Remotion + `@remotion/three`; set `REMOTION_TMP` to a large folder (bundles copy ~1.3 GB).
- Hugging Face downloads require huggingface.co to be allowed in the environment network settings.
- These skills live in `~/.claude/skills/` in a temporary container; copy them out or commit them to keep them.
- GrowKaz Stickman: if Playwright's own Chromium is missing, set `CHROME_PATH` to an existing Chromium/Chrome binary (render.mjs honours it). In this container: `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
- Reusing explainroo narration in Stickman: concatenate `videos/<name>/build/voice/<scene>.wav` with ~0.45 s gaps into one WAV, then run GrowKaz `new_project.py --voice` + `transcribe.py --script`.
