---
name: yt-channel-studio
description: >-
  End-to-end YouTube growth workflow for ANY channel we run (animated Shorts, short films, explainers, commentary): create/switch channel profiles, choose a niche playbook, write an open-loop hook and score it, build a fact-check list, package title+thumbnail with claim-safety, generate credits/description/pinned comment, audit a built video for static stretches and audio clarity, and plan posting. Use for "new channel", "viral idea/hook/title/description", "thumbnail brief", "credits", "fact-check", "improve retention", "channel growth plan", or pre-upload QC of any video made with our pipeline (youtube-shorts-studio / HyperFrames shorts_gen). Channel-agnostic; Toon Theory is just the first profile. Built on the MIT youtube-agent pack.
---

# yt-channel-studio

One workflow, any channel. Nothing here publishes - the user uploads. Every run ends with: **ship it, or change it?**
Tools are stdlib Python in `tools/` (no network). Run them, do not eyeball.

## Step 0 - pick the channel (profiles)
- `python3 tools/channel.py list` shows profiles; `channel.py use <slug>` makes one active (copies it to `~/.claude/youtube/voice.md`, which every `/yt-*` skill and every tool here reads: brand, banned words, claims policy).
- **New channel:** `python3 tools/channel.py new --name "X" --niche "..." [--audience ... --tone ... --formats ... --voice-id ... --palette ... --banned "a,b" --music ... --hashtags ...]`, then finish the FILL IN parts (or send 3 of the channel's best videos/transcripts and infer the voice), `channel.py use <slug>`, then `channel.py export <slug> skills/yt-channel-studio/profiles/` and commit so it survives sessions.
- Pick the niche playbook in `niches.md` (hook shapes, pacing, claim/copyright risks, visual style) and write its decisions into the profile.
- Profiles in `profiles/`: `toon-theory` (animated explainers/anime/games). Add more as channels are created.

## Rules for every channel
- Never invent a number, source or quote. Hedge unofficial figures on screen AND in title/description ("analysts estimate", "reportedly"). Sensitive claims about real people need a primary source.
- Stock/archival visuals are tagged "illustrative". Free media only (CC0/PD/CC-BY) with credits (`tools/credits.py`); third-party art/footage the user supplies is used for commentary - say so in credits.
- Respect the channel's banned-words list (tools flag violations).
- Cost discipline: one voice take, reuse/synthesize SFX, partial re-renders, review stills before any render. Quality is not negotiable (cinematic look, nothing overlapping, narration always clear).
- Disclose AI voice/synthetic content when YouTube asks.
- **Music (house rule, every video):** pick a real licensed music bed that FITS THE SCRIPT with `python3 studio/tools/pick_music.py`. First read the script and map its moods by section (hook, build-up, reveal, payoff; e.g. `--sections "0-12:dark,12-60:suspense,60-80:epic"`); the tool searches Openverse (Jamendo, CC0/PD/CC BY only; never BY-SA/NC/ND), ranks instrumental tracks by measured tempo/beat/steadiness for that mood, cuts the best window and crossfades sections. Mix it under the voice (voice >= 15 dB above the bed, ducked), cut edits on the beat where possible, drop the music out for 0.4-1 s before the biggest line, and paste the CC BY credit lines from ATTRIBUTION.txt into the description. Never use copyrighted/popular tracks (Content ID). Synthesised music (groove.py) is only the fallback when nothing on Openverse fits. **Sources, as the script needs:** Openverse (music, photos), Internet Archive (public-domain footage), and Pixabay (photos, illustrations, stock video via `studio/tools/free_media.py px-images|px-videos|px-*-get`, needs PIXABAY_API_KEY; Pixabay music is downloaded by hand and given to `pick_music.py --file`). Record every external asset with its licence in the asset ledger / ATTRIBUTION.txt.

## 1. Idea -> hook (tools/hookscore2.py)
Write FIVE hooks from the 21 formulas (`../yt-script/hooks.json`). House rule: **open a loop, never answer yourself** (end the first line on a question or tease: "stay for #4", "here's why", "here's the math"). `python3 tools/hookscore2.py hooks.txt` -> keep the top two; target TOTAL >= 70. First line < 11 words, "you" in the first 8 when natural, a concrete number/year/name.
Retention beats (tune per channel from its own analytics; default from our data: Shorts viewers drop at 10-25 s): payoff planted by 6-8 s, pattern interrupt at 10-12 s, curiosity gap every 6-8 s, visual change every 1.5-2.5 s, loop ending pointing back at the hook.

## 2. Script -> fact-check (tools/factcheck.py)
`python3 tools/factcheck.py script.txt > FACTCHECK.md`; fill sources or hedge; list unverified claims in the delivery message.

## 3. Build
See `pipeline.md` (voice -> word times -> scenes -> snapshot review -> background render -> audio -> mux). Engine choice lives in `youtube-shorts-studio`.

## 4. QC gates before delivery
- `python3 tools/static_gaps.py <project>/index.html` - no stretch > 2.5 s without a visual change; 2+ events in the first 3 s; last 10 s not dead.
- Audio: voice >= 15 dB above music+sfx, -14 LUFS, word-match >= 95% (Whisper on the final mix; numeral differences fine).
- Layout: reserved zones (title / stage / data / captions / avatar), nothing covers footage or captions, backgrounds dimmed behind scenes.
- Correct frame count, clean ffmpeg decode.

## 5. Package (tools/package.py)
`python3 tools/package.py --title "..." --thumb "3 WORDS" --kind shorts|long --desc "..."` - length, number, caps, thumbnail <= 3 words and not repeating the title, claim-safety (official/confirmed/guaranteed/proof/absolutes, unhedged money figures), channel banned words. Give 3-5 title options + `templates/thumbnail_brief.md`.

## 6. Description, credits, pinned comment
`python3 tools/credits.py ATTRIBUTION*.txt --ai-voice [--art "X artwork: Owner"]` (brand comes from the active profile) + `templates/description.md` + `templates/pinned_comments.md`.

## 7. Post + learn
`templates/post_checklist.md`: re-check news dates, space Shorts 24 h, answer comments in hour one (`/yt-comment`), pin one, 48 h later export Studio retention CSV -> `/yt-retention`, write the cliff second into the next script. Monthly `/yt-audit`. Update the profile's "Words I do use" and format notes as the channel learns.

## Related
`youtube-shorts-studio` (engines/build), `/yt-*` pack (script, package, retention, shorts cutter, seo, chapters, audit, plan, comment, viral, edit).

## Fix only what's broken (HyperFrames videos; house rule)
Render every HyperFrames video in chunks: `python3 studio/tools/hf_chunks.py render <hf_dir> --audio <mix.wav> --out <final.mp4> --chunk 4`. For review notes, the owner gives timestamps ("0:23 cat cut off", "1:12-1:15 overlap"): fix the code, rebuild index.html, then `hf_chunks.py fix <hf_dir> --at 23,72-75 --auto --audio ... --out ...`. That re-renders only the chunks the notes touch plus any chunk whose animation state changed (`detect` lists them; it compares GSAP/DOM state, which is repeatable). It joins the film by stream copy and keeps `_vN.mp4`, a `_vN_changes.mp4` (only the re-rendered seconds) and a `_vN_compare.png` (before | after). An audio-only change needs `mux`, not a render. If the film length or timing changed, render the whole film again. Stickman studio projects have the same feature in `studio/tools/fastrender.py --shots/--ranges`. (Idea from VideoHub by TensaikunYT, MIT.)
