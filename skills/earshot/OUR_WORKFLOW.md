# earshot in our workflow (sound effects)
**SFX priority (cheapest first):**
1. **earshot bank** (252 code-made sounds, free, deterministic, audited, no models): `earshot sfx list`, `earshot sfx render <id> -o x.wav [--dur --apex --pitch]`. Families: whoosh_fast/whoosh_big/swish/swipe/zip, riser/downlifter/reverse_swell, impact/cut_hit/sub_drop, logo_sting/shimmer/notify (dings), pop/ui_pop/drip/tap/click/toggle/hover_tick, glitch, shutter, typing. `pro_*` = modelled on professional launch films. Use in shorts_gen: event kind `bank:<id>` in audio_short.py (auto-renders to sfx/bank/).
2. **ElevenLabs SFX** (~17 credits, 1-2 s clips) only for sounds the bank cannot do (a real cash register, motorcycle pass).
3. `earshot forge` / `fit` to make or clone a custom sound (needs models + CPU time).
**QC with ears:** `earshot measure x.wav` (LUFS, true peak, no models). With models installed: `earshot timeline film.mp4` (events + sync to cuts), `earshot sheet`, `earshot critique film.mp4`, `earshot find/rank/match` to pick a sound from candidates. Quote the numbers; never claim "it sounds good" without a reading.
**Setup in a new session:** `bash skills/earshot/bootstrap.sh` (light) or `... --models` (full; downloads CLAP/AST from huggingface.co, allowed on this proxy). Package is vendored at third_party/earshot.
**real-sound skill** (skills/real-sound): premium film soundtrack from REAL licensed recordings with a cue list; use for long films where licensed real foley/ambience is wanted (sourcing from freesound-like sites is limited in this container: freesound CDN 403, wikimedia 429; Jamendo/archive.org work). For Shorts use the bank.
Mix rule unchanged: voice >= 15 dB above music + SFX, -14 LUFS master.
