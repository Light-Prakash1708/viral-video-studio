# Handoff: continue the video studio in a new Claude Code account / session

Everything needed is in this repo: `skills/` (the Claude skills + voice/music/SFX tools + sound library) and `studio/`
(the GrowKaz render engine + every project's scenes, scripts, shot lists and timelines; media files are not stored,
they are regenerated).

## Start a new session (cloud, claude.ai/code)
1. Give the new account access to this private repo: on GitHub add the new account's GitHub user as a collaborator
   (repo Settings → Collaborators), or connect the same GitHub account in the new Claude account.
2. Start a session with this repo, then say: **"Read HANDOFF.md and set up the studio"**. Claude runs:
   ```bash
   mkdir -p ~/.claude/skills && cp -R skills/* ~/.claude/skills/
   cp -R studio ~/growkaz-stickman-studio && (cd ~/growkaz-stickman-studio && npm install)
   bash ~/.claude/skills/viral-video-studio/tools/setup_kit.sh ~/growkaz-stickman-studio
   WITH_SAO=1 bash ~/.claude/skills/viral-video-studio/tools/setup_kit.sh ~/growkaz-stickman-studio   # AI music/SFX (needs HF token)
   ```
3. Hugging Face token (for Stable Audio Open): add a network secret in the new environment's settings:
   host `huggingface.co`, header `Authorization`, value `Bearer hf_...` (licence already accepted on account Prakash1604).
4. Save the setup as the environment's setup script so later sessions start ready.

## The user's standing preferences (follow every time)
- Human-sounding voice; strong SFX and music; one narrator unless characters truly add something; no robotic pitch/echo FX.
- Clear, cinematic, bright animation in rich worlds; no over-glow/bloom; text never covers characters (move the camera).
- Choose the style per script for viral potential; audience US + global + Indian.
- Only re-render the parts that change; splice; finish fast; don't ask permission for routine steps.
- Music follows the story (never one track pasted everywhere); a near-silent drop on the twist.
- Names: Ravana = "RAH-vuh-nuh" (spell `Rahvuhnuh` for TTS, captions say Ravana); Vibhishana spell `Vibbeeshunnuh`.
- Respect sacred subjects: dignity, no mockery, no gore.
- Deliver: 1080p YouTube export (-14 LUFS, 12 Mbps, faststart) + title, description, chapters, thumbnail idea, pinned comment.

## Formula and tools (details in skills/viral-video-studio/SKILL.md)
- "Viral Shorts formula v2": 200-240 wpm, sentence 1 = concrete paradox with a number, no pause > 0.5 s, cut every 1.4-3 s,
  one-word centred captions, bed ~11 dB under voice, an SFX hit every 1.5-2.5 s, callback ending.
- Voice: `tools/voice.py --voice viral|viral-deep|viral-desi|viral-f` (local Chatterbox, free).
- Music: `tools/orchestra.py` (real sampled instruments, FluidSynth) or the user's track mapped to story sections.
- SFX: `audio/sfxlib` (226 CC0 recordings + 32 Stable Audio Open sounds); new sounds via `tools/sao.py`.

## Videos made so far (projects in studio/projects)
ravan-v2 (What If Ravana Had Won? v4 + Short), money-expires, last-job (The Last Human Job), prisoner-puzzle (Short),
friendship-countdown, time-currency, childhood-time, ship-of-theseus/theseus-v2, bystander, invisible-gorilla,
phantom-limb, experience-machine, ravana-won (v1). Final MP4s are not in git: download them from the old session first.
