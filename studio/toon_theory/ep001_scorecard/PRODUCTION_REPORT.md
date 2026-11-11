# EP001 "Why Smart Girls Fall for 'Dumb' Boys": production report
- **Final:** final/ToonTheory_EP001_SmartGirlsDumbBoys.mp4. 1080×1920, 30 fps, H.264 + AAC, 95.7 s. Full decode passes. Not in git (too large); rebuild with the steps below.
- **Mix:** final/ToonTheory_EP001_mix.wav. −14.1 LUFS, true peak −1.1 dBFS, voice 15.9 dB above the music and SFX.
- **Subtitles:** burned into the video, plus final/ToonTheory_EP001_SmartGirlsDumbBoys.srt.
- **Thumbnails:** final/thumbnail/ (draft; stopped at the owner's request).
- **Upload text:** final/YOUTUBE_METADATA.md. Assets: asset_ledger.csv. Research: pack/FACTCHECK.md.
- **Script:** the owner's final script. Small changes: the 400-student line is worded as an association, and dialogue runs at 1.06–1.08× with long pauses tightened so it fits about 95 s.
- **QC:** Whisper transcript vs script 99.3%. static_gaps: a visual change every 0.6 s, nothing static for more than 2.5 s. Contact sheet reviewed and layout fixes made.
- **Limits:** I can't listen to audio, so delivery and comic timing are judged by measurement only. The laugh/snort clip was trimmed by level, not by ear.
- **Rebuild:** `python3 build/build.py && python3 build/audio.py`, then `cd /root/hf-shorts/ep001s && npx hyperframes@latest render --output silent.mp4`, then mux the video with final/ToonTheory_EP001_mix.wav using ffmpeg.
