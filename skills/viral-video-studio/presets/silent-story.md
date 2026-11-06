# Preset: silent-story  (wordless emotional short film — reverse-engineered from @lastsoulorigin, Nov 2026)
Engine: GrowKaz Stickman. 16:9 1080p for the main film (3–6 min), plus a 9:16 45–60 s cut-down for Shorts.
Helpers: `presets/silent-story/silent.js` (desat, colourArc, line, quoteCard, stamp, endCard). Style: `"style": "silent"` (eyes-only faces, soft grey world).

## Why it works (the 9 rules)
1. **No narrator.** Story is told by pictures, sighs, music and 3–8-word in-world lines (`line()`), not voice-over. Their 1M-view film has 24 caption words in 5 min; their talkiest film is their weakest.
2. **Faceless everyman.** Black silhouette, white eyes, no mouth (`noMouth`). The viewer projects themself. Emotion = eye shape + posture + lighting. One signature colour item per hero (red headband, yellow raincoat).
3. **One relatable micro-failure.** Not "life is hard" — a specific, embarrassing, universal habit: quitting a running plan, 2 AM scrolling, bringing anger home, faking friends, phone at dinner.
4. **Props are the inner life.** Make feelings visible as objects: fridge chart filling with red X's, 5:30 alarm + SNOOZE, shoes with the price tag still on, a thermometer next to an angry dad, a step counter 0.69 → 1.41 → 3.08 km.
5. **Repetition with variation.** The same shot 3–5 times (alarm → snooze… snooze… snooze… → START). Viewers feel the loop, then the break.
6. **A mentor asks ONE reframing question.** "Can you run one minute?" "Just 1 hour?" Title = that number/word.
7. **Colour is earned.** World is grey while stuck; warm lamplight appears at the first step; full colour (green fields, autumn orange) at the payoff (`desat(g, colourArc(...))`).
8. **Breathing room.** Black quote cards from real authors (James Clear, Epictetus, Kabat-Zinn) and on-screen clocks/dates as chapter anchors. Silence is allowed.
9. **Callback ending.** Return to the opening location changed (back at the shoe shop, now a runner) → black end card: TITLE + one-line moral.

## Story skeleton (5 chapters; also put these as YouTube chapters)
1. **Big Plans** (0–15%): want + oversized plan (prop shows it).  2. **Giving Up** (15–35%): repetition loop of failure, prop fills with failure marks, low point alone in grey.
3. **The Question** (35–50%): mentor's one-line reframe → tiny action.  4. **Day by Day** (50–80%): montage, a progress meter grows, colour returns, quote card.
5. **Where It Takes You** (80–100%): payoff beyond the original goal + callback location + end card.

## Packaging
- Title: the tiny number/word + "| An Animated Short Film" ("1 MINUTE"), or a confession ("I Told Mom I Had Friends. I Had None.").
- Description: 3-sentence story setup (no spoiler), chapters, then a question CTA ("What keeps you up past midnight?").
- Thumbnail: one silhouette + the key prop + the one accent colour.

## How we beat them
- **Shorts-native cut**: they post 16:9 films and weak Shorts (2–6k views). We make every film ALSO a 9:16 45–60 s version that opens on the most emotional prop shot (not a black quote card).
- **Better sound**: their audio is music + sighs. Add leitmotif music that changes key at the turning point, breath/heartbeat SFX, and Kokoro one-word vocalisations ("Ugh.", "Woo!") via explainroo `say`.
- **Sharper props**: every act gets a measurable meter (chart, counter, clock, thermometer) so progress is legible without words.
- **Volume + consistency**: the pipeline lets us ship weekly; reuse sets and cast across a series (same hero across episodes = returning audience).
