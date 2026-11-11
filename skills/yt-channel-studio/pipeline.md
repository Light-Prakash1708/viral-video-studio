# Pipeline cheat-sheet (vertical Shorts, any channel)
Channel-specific values (voice id, palette, music, hashtags) come from the active profile: `python3 tools/channel.py show`. Set the palette constants at the top of `studio/shorts_gen/common.py` (CORAL/AMBER/TEAL/CREAM/INK) per channel.
Repo: studio/shorts_gen/{common.py (Proj, imgpanel, fullbleed), flo.py, mth.py (examples), audio_short.py, wt.py}; studio/tools/free_media.py (Openverse audio/images, archive.org footage).
1. Voice: ElevenLabs `creative_generate_speech`, model eleven_v4, voice = profile `voice_id` (Toon Theory: dtSEyYGNJqjrtBArPCVZ "Titan"; pick one with creative_list_voices for a new channel), `[serious]` tag, numbers spelled as words, generations_count 1, poll `creative_get_flow_run_status`, download the mp3 from the content_url.
2. Words: `python wt.py voice.mp3 words.json` (faster-whisper venv). Fix mis-heard names in words.json (they become captions).
3. Assets: `free_media.py audio|footage|images ... ` then `*-get`; credits go to ATTRIBUTION.txt automatically. Archive.org clips are 320x240: show them in a panel with sepia/scanlines, never full-screen.
4. Build: write scenes with Proj helpers (times from words.json), `python3 yourvideo.py`, then `npx hyperframes@latest check` and `snapshot --at t1,t2,...` and LOOK at the contact sheets. Fix, repeat. Only then render.
5. Render: `npx hyperframes@latest render . --quality looks --fps 24 --workers 2 -o out/x_silent.mp4` with Bash `run_in_background` (never twice at once; shell exit kills it). ~5 min per 60 s.
6. Audio: `python3 audio_short.py <name>` (music -29 dB rms, sfx gain .17, duck, -14 LUFS) -> mux `ffmpeg -i silent -i mix -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest out.mp4`.
7. QC: tools/static_gaps.py, word-match, loudness, frame count. Deliver with SendUserFile + the notes file (titles, description, credits, fact-check).
Gotchas: monitors that grep "error" fire early (logs contain 'browserVersion'); stop-hook "unpushed commits" is a shallow-clone false positive (verify with git ls-remote); freesound CDN 403 and wikimedia 429 from this container - use Jamendo audio and flickr images with retries.
