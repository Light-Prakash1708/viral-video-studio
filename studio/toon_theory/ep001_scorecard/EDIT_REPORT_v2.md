# EP001 v2: targeted opening edit and background branding cleanup

**Delivered:** `final/ToonTheory_EP001_SmartGirlsDumbBoys.mp4` (also saved as `final/..._v2.mp4`). The original is kept unchanged as `final/..._v1_original.mp4`. The original build script is backed up as `build/build_v1_backup.py`. Editable project: `build/build.py`, which generates the HyperFrames page `/root/hf-shorts/ep001s/index.html`.

## What changed
1. **Opening, 0:00–0:07.7** (rebuilt in the project; everything is timed to the existing sound effects):
   - **0.00–1.45, Priya, class topper.** Softer warm background with gentle rays. Priya is the clear focal point with a slow push-in. One label instead of two (CLASS TOPPER / PRIYA · RANK #1). Smaller medal, moved below her chin. Confetti cut from 60 pieces to 14 and slowed down.
   - **1.45–2.82, spelling test.** A quick slide from Priya's shot into one insert. The camera pushes slowly toward "Wensday", the red ✗ stamps on the existing buzzer (1.95 s), and a controlled zoom lands on the existing whoosh (2.4 s). Removed: the "F" grade, the yellow "SPELLED WEDNESDAY" caption and the extra rotation.
   - **2.82–7.7, dialogue.** Cut to the set on the existing kick sound. Both characters now use the same medium shot (same scale, faces at the same height). There is one hook question at the top ("WHY DOES SHE LIKE HIM?") instead of the big "EXPLAIN THAT." and other stacked labels. A reaction cut to the two-shot mid-way through Priya's line shows Ankush's face fall. A small punch-in lands on "you're still here".
   - **The freeze on the record scratch and the title slam are unchanged** (only the freeze framing matches the new shots).
2. **Background "TOON THEORY" branding removed everywhere.** That's the small footer on every frame and the neon sign (with "PEOPLE ARE WEIRD") behind the set. Both were separate layers in the project, so they were switched off, not blurred or patched. The end card branding is kept.

## What did NOT change
- **Dialogue, voices, lip-sync, music and sound effects:** the audio stream is copied bit-for-bit from v1 (checksums identical).
- **Subtitles:** the SRT file is byte-identical to v1.
- **Story, script, jokes and scene order.**
- **Every scene after 0:09:** pixel comparison against v1 differs only where the footer and neon sign were (average difference elsewhere under 1 out of 255, which is encoding noise).
- **Length, frame rate and size:** 2870 frames at 30 fps, 1080×1920, 95.7 s.

## Was anything re-rendered?
Yes, the whole picture, once. The footer was baked into every frame and the neon sign into most set shots, so the clean removal (switching the layer off) required redrawing every frame from the unchanged project. No blur or patching was used. The render was done in 24 chunks of 4 s (`studio/tools/hf_chunks.py`), so any future fix re-renders only the seconds it touches. All 21 joins between chunks after the opening were checked against v1: no dropped or shifted frames.

## QC
- Full decode passes.
- Loudness −14.1 LUFS, true peak −1.1 dBFS (the same audio as v1).
- Opening contact sheet reviewed against the original.
- End card branding present.

## Noted, not changed (it was already in v1)
Where one speaker's last line meets the next speaker's first line, two subtitles can overlap for about 0.1 s (e.g. 0:07 and 1:25). You asked to keep the subtitles as they are, so this was left. It's a quick partial re-render to fix if you want.
