---
name: youtube-shorts-studio
description: "Your one entry point for making YouTube Shorts (and Reels/TikTok) videos. Combines two toolkits and lets the user pick whichever fits the script/topic: (A) viral-video-studio (stickman, explainroo explainer, Vox paper-collage, 3D cartoon, map explainer, what-if life sim) and (B) lemo-opuscar (66 code-rendered film styles: watercolor, ukiyo-e, newsreel, data storytelling, teardown, pixel RPG, etc.). Use when the user says \"make a Short\", \"YouTube Shorts\", \"video for my channel\", \"create a video about <topic>\", \"here's my script\", or asks which video style/engine to use."
---

# YouTube Shorts Studio (merged video skill)

Usage: `/youtube-shorts-studio <topic or script> [--engine viral|lemo|auto] [--style <name>] [--length 30s|45s|60s]`

Two toolkits, one front door. Always make Shorts vertical **9:16 (1080×1920)**, ≤ 60 s unless asked otherwise.

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
