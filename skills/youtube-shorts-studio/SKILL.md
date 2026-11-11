---
name: youtube-shorts-studio
description: "Your one entry point for making YouTube Shorts (and Reels/TikTok) videos. Combines three toolkits and lets the user pick whichever fits the script/topic: (A) viral-video-studio (stickman, explainroo explainer, Vox paper-collage, 3D cartoon, map explainer, what-if life sim), (B) lemo-opuscar (66 code-rendered film styles: watercolor, ukiyo-e, newsreel, data storytelling, teardown, pixel RPG, etc.) and (C) HyperFrames (HTML/CSS/GSAP to MP4: kinetic type, data viz, captions, UI/promo, about 8x faster rendering). Use when the user says \"make a Short\", \"YouTube Shorts\", \"video for my channel\", \"create a video about <topic>\", \"here's my script\", or asks which video style/engine to use."
---

# YouTube Shorts Studio (merged video skill)

Usage: `/youtube-shorts-studio <topic or script> [--engine viral|lemo|auto] [--style <name>] [--length 30s|45s|60s]`

Three toolkits, one front door (A viral, B lemo, C HyperFrames). Always make Shorts vertical **9:16 (1080×1920)**, ≤ 60 s unless asked otherwise.

| | A. Viral Video Studio | B. Lemo-Opuscar |
|---|---|---|
| Skill to invoke | `viral-video-studio` (and its engine skills: `make-2d-video`, `explainroo`, `vox-director`, `cartoon-3d-short`) | `lemo-opuscar` (library at `~/lemo-opuscar`) |
| Strength | Fast, proven retention formats: faceless story channels, "What if", map explainers, tutorials, punchy facts; ready voice + music + captions pipeline | Distinctive art-directed looks (66 styles) built entirely in code; cinematic, premium, "never seen this before" feel; real-data / archive / product explainers |
| Best for | Daily-cadence viral Shorts, storytelling, listicles, fact videos, tutorials | Brand-look channels, aesthetic/premium Shorts, news/documentary looks, data stories, product teardowns, art-history/culture topics |
| Speed | Faster | Slower, more craft (treatment → look check → produce) |
| Cost | Vox engine needs Atlas Cloud key (confirm before spending) | Free, offline-capable (Kokoro voice) |

## Step 1: Choose the engine (do this once, quickly)

If the user passed `--engine`, use it. Otherwise read the script/topic and recommend one, then ask a single question (AskUserQuestion) with your recommendation first and the other as option 2 (plus "show me style options" as option 3 = list 2–3 candidate styles, one line each, no rendering).

Recommend **A (viral)** when the script is: a story / "what if" / "why does X happen" / fast facts / geography / how-to / self-improvement / listicle, or the user wants volume and speed.
Recommend **B (lemo)** when the script is: visually driven or aesthetic (history, art, culture, nature, poetry, a product, a place), data- or document-driven (satellite, maps of real data, charts, archive, news), or the user wants a signature look that stands out from other faceless channels.
When both fit, name your pick and why, and let the user choose. **Render with exactly ONE engine per video. Never render the same script in both** (wastes tokens and credits); only do a second render if the user explicitly asks later.

Quick topic → style hints for B (full list: `~/lemo-opuscar/AGENTS.md`, gallery https://lemomo-ai.github.io/lemo-opuscar/): news/current events → Caption News, Broadcast News Package; history → 1920s Newsreel, Woodcut, Ukiyo-e; science/how-it-works → Whiteboard Explainer, Microscope Story, Exploded Teardown; numbers/finance → Data Storytelling, Isometric Infographic; tech → Dark Tech Keynote, Sci-fi Hologram HUD; kids/story → Crayon Picture Book, Mid-century Cartoon; gaming/fun → 16-bit Pixel RPG, Game Show Flat.

## Engine C: HyperFrames (installed; fastest renderer)
Skills: `/hyperframes` (read first), `/hyperframes-cli`, `/hyperframes-registry` (about 450 ready blocks: transitions, titles, kinetic type, captions, charts, maps), `/media-use`, `/reverse-any-video`, `/style-sampling`. Source cloned at `/home/user/heygen-com/hyperframes`; CLI via `npx hyperframes@latest` (v0.9.30, Node 22+, uses system Chrome and ffmpeg). Free and local, deterministic.
- Pick C for typography-, data-, chart-, caption- or UI-led Shorts and any video that is mostly motion graphics. Pick A/GrowKaz for character-driven storytelling (busts, rigs, expressions).
- Flow: `npx hyperframes init <name>` -> set `data-width=1080 data-height=1920` -> write HTML + paused GSAP timeline -> `npx hyperframes check` -> `npx hyperframes render . --quality draft|looks|delivery --fps 30 --workers auto --resolution portrait -o out.mp4`. Partial: `--start S --end E`. `looks` (default, CRF 16) is the quality default; `delivery` is higher; `draft` for iteration.
- Measured here (4 CPUs, 1080x1920, 300 frames with 60 blurred animated particles + glow text): about 12 s capture, ~25 fps, `looks` 1.7 MB. The GrowKaz canvas engine does about 3 fps on the same box. Needs no GPU. `hyperframes doctor` lists optional extras (whisper-cpp, Kokoro TTS).

## Speed, cost and quality rules (all engines)
1. **Iterate cheap, render once.** Contact sheet first (`node render.mjs --project P --sheet --scale 0.4`), fix, then ONE full render. Half-res draft (`fastrender.py --preset draft`, ~7.4 fps vs 2.8) only when motion/timing needs checking.
2. **Never re-render everything for a fix.** `python tools/fastrender.py --project projects/P --shots s01,s04 --preset balanced --mix` re-renders only those shots (from story/shots.json), splices them into build/video_silent.mp4 frame-exactly (frame count is verified; the previous base is kept as build/video_silent.prev.mp4), then mixes. Caption/number/word fixes touch words.json; the affected shots must be re-rendered, not the whole video.
3. **Audio-only change (music, SFX, levels) = `python audio/mix.py --project P` alone, no video render.**
4. **Quality presets** (`tools/fastrender.py`): `draft` half-res ultrafast; `balanced` jpeg q94 crf 18 (default for iterations); `final` lossless PNG frames, crf 15, preset slow, `-tune animation`, bt709 colour tags (about 40% slower than balanced, crisper edges on text/vector art; use for the delivered file). Workers default to cpu_count-1 (3 beat 4 on 4 cores).
5. **Credits.** ElevenLabs speech costs about 18-20 credits per second of audio (927 credits for 50 s): write the script tight (45-55 s), generate ONE take (`generations_count: 1`), use `estimate_only` first when unsure, reuse the SFX library in `audio/` and only generate new SFX when a sound is signature (about 17 credits each). vidIQ: transcript 5, short-form watch 10, long watch 25 credits each: pull transcripts first, watch only the best 1-2 references. Never regenerate voice to fix a caption or visual.
6. **Check once at the end:** duration, -14 LUFS, word-match of the final audio against the script (faster-whisper; flags music masking the voice; fix by lowering music gainDb in config, audio only), contact sheet for text overlap.

## Step 2: Shared Shorts script pass (both engines, before any rendering)

1. Hook in the first 2–3 s: surprising claim, question or stake. No "hey guys".
2. One idea, short spoken sentences, a visual change every 2–4 s, open loop → payoff, loop-back or single CTA at the end. 100–150 words for 45–60 s.
3. Facts verifiable; never invent numbers or quotes; cite on screen where used.
4. Deliver with the video: 3 titles (≤ 55 chars, include `#Shorts` in description not title), 3-sentence description + question CTA, hashtags, thumbnail/cover-frame idea.
5. Show script + beat list; get approval before an expensive render.

## Step 3: Execute with the chosen engine

**A. Viral:** invoke the `viral-video-studio` skill with `--format 9:16` and the chosen style (and its own workflow/voice/music rules). Outputs go to `~/videos/<slug>/`.

**B. Lemo-Opuscar:** invoke the `lemo-opuscar` skill. Shorts overrides:
- Tell it the film is **vertical 1080×1920, ≤ 60 s** (`--size 1080x1920` on every render tool, lay out from `innerWidth`×`innerHeight`; DIRECTOR.md §1 / TECHNIQUE.md).
- Skip its language question when the user already wrote in a language; use it as the voice + subtitle language. Burn in large subtitles (Shorts are watched muted).
- Library lives at `~/lemo-opuscar` (`LIB`). First run in a fresh container: `sh ~/.claude/skills/lemo-opuscar/scripts/setup.sh` then `... deps` (add `deps voice` for Kokoro TTS / Whisper check). `ffmpeg 7+` is required; if only 6.x is present, tell the user (or use a static ffmpeg 7 build in the project) before rendering.
- Project folder: `~/videos/<slug>/` (same place as engine A).
- The user's own saved styles live in `~/lemo-my-styles/` (see `~/lemo-opuscar/MY-STYLES.md`).

## Step 4: QC and deliver (both)
Contact sheet / sample frames, audio level (≈ −14 LUFS, voice clearly above music), captions inside the Shorts safe area (keep ~15 % clear at bottom, ~10 % top), duration ≤ 60 s. Deliver the MP4 path + titles, description, hashtags, thumbnail idea. Do not re-render unless the user asks.

## Persistence note
These skills live in `~/.claude/skills/` and `~/lemo-opuscar` of this container, which is temporary. To keep them, copy `~/.claude/skills/{youtube-shorts-studio,lemo-opuscar}` into a repo or your local `~/.claude/skills/`. `viral-video-studio` is a synced plugin and is left untouched; this skill only calls it.

## Preferred music for anime videos
The user supplied a preferred anime-opening bed: `/root/growkaz-stickman-studio/audio/library/anime_opening_emotional_journey.mp3` (104 s, about 70 BPM, -9.5 LUFS). Use it as `config.music.file` for anime videos when it suits the mood (cut a window with `ffmpeg -ss <start> -t <dur> -af afade=...` so its build lands on the climax, then `mix.py` with music gainDb -13). If it doesn't suit, use `audio/anime_music.py`. The user supplied the track, so remind them to keep its licence/credit for uploads. Audio-only changes never need a video re-render: run `mix.py` alone.

## No-copyright music sources (verified reachable from the container)
- incompetech.com (Kevin MacLeod, CC BY 4.0, needs the credit line). Direct URL: `https://incompetech.com/music/royalty-free/mp3-royaltyfree/<Title%20With%20Spaces>.mp3`. Saved: `audio/library/volatile_reaction_kevin_macleod_CC-BY-4.0.mp3` (about 152 BPM, tense, big hit near 28-30 s: use for tense/hype math Shorts; credit "Volatile Reaction by Kevin MacLeod (incompetech.com), CC BY 4.0").
- pixabay.com returns 403 to scripted downloads. Wikimedia is rate-limited (retry with a generic User-Agent).
- Pick a track by measuring tempo and the biggest energy rise, then cut so the rise lands on the video's climax.

## Music lessons (Hakari video)
- User-supplied `audio/library/sub_clair_no_copyright_music.mp3` (about 123 BPM, quiet intro, break at 40-46 s then a big drop at 47.25 s). Cut at 19.05 s so the drop lands on the climax at 28.2 s; it opens loud (hook from frame 0) and dips during suspense. Use music gainDb -16 for this track (it is -9.9 LUFS raw); -13 made the narration word-match drop from 98.2% to 95.5%.
- stocktune.com blocks scripted access (Cloudflare). Ask the user to download a track and upload it.
- Partial re-render: `render.mjs --from A --to B` writes `build/preview.mp4` (not video_silent.mp4); splice with ffmpeg trim+concat at frame-aligned times, then run `mix.py` alone.

## Retention rules for Shorts (from the user's channel analytics)
Finding: the hook works (high stayed-to-watch) but viewers leave in the 10-25 s zone, so watch percentage drops to 21-40% against a 54%+ average, and YouTube then limits distribution. Target: 55%+ average watch. Write and cut every Short with these rules:
1. **Plant the payoff by 6-8 s** ("by the end you'll see X") and keep that loop open. Give a partial answer around 15 s, then raise the stakes instead of explaining more.
2. **Pattern interrupt at 10-12 s**: a turn line ("But here's the catch"), a hard SFX hit and a visual change (zoom, new location, colour flip). Never run exposition through this window.
3. **A new curiosity gap every 6-8 s** (a question, a number, a "wait"). Every sentence must add new information or a higher stake; cut definitions, setup and second examples.
4. **Pace**: at most about 2.3 words/s, visual change every 1.5-2.5 s in the 10-25 s window, no static infographic longer than 3 s. Shorten to 30-40 s when the idea allows; shorter Shorts finish more often.
5. **Hold the biggest reveal for the last 5 s but tease it at about 15 s.** End on a line that loops back to the first line to lift replays.
6. **Check once published**: read the retention graph in YouTube Studio, find the exact second of the dip and rewrite that line for the next Short.

## Free audio and b-roll sources (standard for every video)
Use `studio/tools/free_media.py` (stdlib only):
- Music/ambience: `python tools/free_media.py audio "ambient piano" --n 8 --min-sec 40` then `audio-get <id> --out assets/`. Openverse, licence filter cc0/pdm/by only (no NC/ND). Default `--source jamendo` because freesound CDN returns 403 and Wikimedia 429 from this container. Anonymous Openverse rate-limits (429): the tool retries; space calls out.
- B-roll: `python tools/free_media.py footage "city night" --n 8` then `footage-get <identifier> --out assets/ --trim 12:20 --size 1920x1080`. archive.org movies, public-domain/CC0 only (`--allow-by` adds CC-BY). Output is silent, cropped H.264.
- Every download appends a credit line to `<out>/ATTRIBUTION.txt`. CC-BY credits MUST go in the video description. Mix music at gain -16 dB under voice; check word-match QC. PD footage can still get Content ID claims: keep source URLs to dispute.
- Prefer this over generating or scraping; archive.org footage suits documentary/newsreel mood (grade it, add grain) and can be used as HyperFrames `<video muted>` layers.

## Huashu Art Motion (installed at ~/.claude/skills/huashu-art-motion, MIT, github.com/alchaincyf/huashu-art-motion)
Art-style/explainer animation toolkit (36 art styles, 9 explainer grammars, storyboard lint, QA, delivery gate). Invoke via the `huashu-art-motion` skill when the user wants painterly/artist-style or grammar-driven explainer shots, or a storyboard lint pass. Reinstall: `git clone --depth 1 https://github.com/alchaincyf/huashu-art-motion ~/.claude/skills/huashu-art-motion`. Its SKILL.md is Chinese; follow its shot-table workflow (镜头表 -> storyboard_lint.py -> per-shot render -> qa.py -> deliver.py).

## Vertical Shorts generator (HyperFrames) — studio/shorts_gen
`common.py` (Proj helpers: timeline, captions, counters, `imgpanel`, `fullbleed`), `flo.py`/`mth.py` (two finished examples), `audio_short.py` (music + synth/real SFX, ducking, -14 LUFS, prints voice-vs-bed dB), `wt.py` (Whisper word times). Workflow: voice -> words json -> scenes keyed to word times -> `snapshot --at ...` contact sheets BEFORE rendering -> render (`run_in_background`, never twice at once) -> audio -> mux -> word-match QC.
Layout rules learned: reserve zones (title 40-300, stage 330-1150, data 1030-1300, captions 1420-1600, avatar bottom-right 858-1034 x 1238-1414); animated props must never cover the footage or captions; put full-bleed backgrounds OUTSIDE scene wrappers (z-index) and dim them (op .3-.6) so numbers stay readable; voice should sit >=15 dB above music+sfx (music ~-29 dB rms, sfx gain .17, duck -7/-65%).
Free images: `python tools/free_media.py images "<query>"` / `image-get <id>` (Openverse photos, cc0/pdm/by; flickr 429 -> retry; browse via /v1/images/<id>/thumb/ contact sheets). Credit CC-BY images in the description. Tag stock/illustrative visuals "illustrative" so they never claim to show the event.

## YouTube growth skills (installed, use on request)
Pack `youtube-agent` (MIT, github.com/jakeschincariol/youtube-agent-skill) is installed globally and mirrored in the repo at skills/youtube-agent: /yt-script (hooks scored with hookscore.py), /yt-package (title+thumbnail lint), /yt-retention (needs a Studio retention CSV), /yt-shorts, /yt-seo, /yt-chapters, /yt-audit, /yt-plan, /yt-comment, /yt-viral, /yt-edit. The channel voice profile is at ~/.claude/youtube/voice.md (Toon Theory). Use them only when the user asks; they never publish. Note: hookscore is a heuristic (it rated our hooks 'WEAK' mostly for low CURIOSITY, i.e. openers that answer themselves; open a question instead).
