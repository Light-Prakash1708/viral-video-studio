# Toon Theory EP001 "The Maybe": production report

## Deliverables (studio/toon_theory/ep001/)
| Item | File |
|---|---|
| Final video, 1080×1920, 30 fps, H.264 + AAC | `final/ToonTheory_EP001_The_Maybe.mp4` (not in git, too large; regenerate with the build steps below) |
| Dialogue + music + SFX mix | `audio/ep001_mix.wav` (regenerable); stems `audio/voice_track.wav`, `audio/music_track.wav` |
| Per-line dialogue clips | `audio/clips/*.wav`, takes in `audio/raw/*.mp3` |
| Subtitles | `ep001.srt` (also burned into the video) |
| Thumbnails | `thumbnail/thumb_vertical.png` (1080×1920), `thumbnail/thumb_landscape.png` (1280×720) |
| Title, description, hashtags | `YOUTUBE_METADATA.md` |
| Script / research / casting | `SCRIPT_LOCKED_timing.txt`, `RESEARCH_NOTES.md`, `VOICE_CASTING.md` |
| Character bible + sheets | `../CHARACTER_BIBLE.md`, `../characters/` |

## Tools
- **Voices:** ElevenLabs `eleven_v4`: Narrator George, Krish Will, Ankush Liam, Priya Sarah, Meera Laura, Rohan Joel. One take per character, split into lines with faster-whisper word timestamps (`audio/align_split.py`). Aman is text-only.
- **Animation:** HyperFrames (HTML/SVG + GSAP). The puppet rig (`build/rig.py`) is generated from the approved character definitions: expression layers, **lip-sync driven by each line's real audio envelope** (24 steps/s), blinks, idle head sway, breathing, speaking nods. Scenes in `build/ep001_build.py`; all timing from the measured audio (`build/timeline.py`).
- **Music:** original score synthesised in code (`build/ep001_audio.py`). No third-party music, so no licence obligations.
- **SFX:** earshot sound bank (code-synthesised, MIT licence).
- **Mix:** voice normalised per line, music ducked under speech, loudness-normalised (`studio/shorts_gen/audio_short.py`).
- **Openverse / Internet Archive:** not used. Every visual is original, drawn in code in the approved style, so no stock assets or attributions are needed.

## Runtime
Measured from the real dialogue audio before animation: **2:54 untrimmed**, so **no trims were needed**. The full approved script is in the video.

## Deviations from the approved script
None in dialogue. Visual-only additions: three small on-screen chips during Krish's study line ("SMALL STUDY · COLLEGE STUDENTS · NOT PROOF") to keep the research claim accurately qualified, and a faint "echo" bubble of Priya's own September words in the library to make Rohan's attentiveness readable.

## Build steps (reproducible)
```
python3 studio/toon_theory/ep001/build/ep001_build.py      # -> /root/hf-shorts/ep001/index.html
python3 studio/toon_theory/ep001/build/ep001_audio.py      # -> audio/ep001_mix.wav
cd /root/hf-shorts/ep001 && npx hyperframes@latest render --output <silent.mp4>
ffmpeg -i <silent.mp4> -i audio/ep001_mix.wav -c:v copy -c:a aac -b:a 192k -shortest final/ToonTheory_EP001_The_Maybe.mp4
```

## Limitations (honest)
- **I cannot listen to audio.** Delivery quality, acting and music taste were judged only by measurement: a Whisper transcript match against the script, loudness, voice-over-bed level and a click scan. Please listen before publishing.
- **Body animation is limited.** Characters are busts with expressive faces, lip-sync, head and breathing motion. They have no hands or full-body acting, which is the approved flat 2D style taken to its practical limit in this toolchain.
- **The café two-shot recurs.** Close-up cuts and five other distinct sets break it up, but it remains the most repeated composition.
- **The score is synthesised** (pads, plucks, music-box). It is functional and mood-matched by design, but simpler than a composed or licensed track.

## Quality control (2 of the 3 allowed critique cycles used)
Final file checks: 1080×1920, 30 fps H.264, AAC 192k, 174.2 s, full decode passes. Integrated loudness −14.7 LUFS, true peak −0.8 dBFS, voice 15.8 dB above the music/SFX bed, 0 clicks found in the bed. The Whisper transcript of the final video matches the script at 98.7%. Every scripted word is present; the remaining differences are transcription spellings ("canceled", "a m", a quoted 'hey'), plus one possible mishearing ("is" for "has") that was not confirmed by ear. SRT has 81 cues.

| Category | Cycle 1 | Final | Note |
|---|---|---|---|
| Hook | 8 | 8 | |
| Storytelling / emotional progression | 8 | 8 | |
| Character consistency | 9 | 9 | |
| Facial expressions / body language | 6 | 6 | **Below 8: tool/style limit** (faces and lip-sync yes, no hand/body acting) |
| Environments | 7 | 7 | **Below 8:** flat layered sets by design |
| Animation smoothness | 8 | 8 | |
| Camera composition | 6 | 7 | Close-up cuts added; the two-shot still recurs |
| Lighting / colour | 8 | 8 | |
| Typography / captions | 8 | 8 | |
| Audio quality / sync | 7 | 8* | *Measured only: missing word fixed; not verified by ear |
| Editing rhythm | 7 | 7 | |
| Originality | 7 | 7 | |

Fixed between cycles: a missing first word in Meera's "Cancelled again?" (a dialogue-split bug), a white flash over the opening café shot, the title overlapping a character, the slot reels not landing on "hey hey hey", the voice-note card colliding with subtitles, a set edge revealed in the final pull-back, and a dark strip during close-ups. Added speaker close-up cuts; made the face-down phone smaller.
I stopped after cycle 2 because the categories still below 8 are limits of the approved 2D-bust style and toolchain, which another cycle would not change.
