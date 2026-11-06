# Preset: map-explainer  (geography/history Shorts — reverse-engineered from @geoglobetales, Nov 2026)
Engine: GrowKaz Stickman + `presets/map-explainer/geo.js` + `world50m.js` (Natural Earth 1:50m, public domain). 9:16, 60–100 s.
API: `flyTo(t, [[t, view] …])`, `fit(['CHL','ARG'], pad)`, `drawWorld(g, view, {highlight:{ISO:'#e0443a'}, dim, labels:{ISO:'CHILE'}, t})`, `route(g, view, [lon,lat], [lon,lat], p)`, `pin(g, view, lon, lat, label)`.

## Why it works (their numbers: 2.07M subs; top Shorts 34M, 31M, 18M, 16M views; 2–2.6% like rate)
1. **Title = a weird-map question** with flags/emojis: "Why Chile Is So Long & So Thin 🇨🇱🤯", "The Strangest Border Between Sweden & Finland". The map itself is the hook — the oddity is visible in frame 1.
2. **First line restates the oddity + a scale comparison**: "Chile would stretch from London to Baghdad, but in places it's less than 60 miles wide." "An island smaller than a Costco parking lot."
3. **Visual change every ~0.8–1.5 s**: zooms, flags filling country shapes, red highlight lines, a hand + magnifying glass, period maps, little soldier/helmet icons.
4. **Countries are characters with deadpan one-liners**: "Actually, we live here." "Dude, where is my ocean?" "Let's have a drink." Humour every ~15 s keeps retention.
5. **Fast, casual narration**: 170–190 wpm, conversational ("well, not very successfully"), one through-line, no tangents.
6. **Satisfying resolution line** that reframes: "Just the most polite border adjustment in European history." "When you can't grow wider, you grow longer."
7. **Topics**: borders, odd shapes, "why X is Y", US/UK/Europe-centric (big English-speaking audiences), rivalries (France vs England, USA vs Canada).

## Script skeleton (60–100 s)
Hook question on a striking map (0–3 s) → scale comparison (3–8 s) → "But let's start from the beginning. 18XX…" → 3–5 causal steps, each with a map move → 1–2 character jokes → the twist/answer → reframing closer line (last 3 s). Facts must be verified; dates and numbers on screen.

## How we beat them
- Same map clarity + **our stickman characters as the "countries"** (talking bigFace with flag-colour outfits) instead of static icons → more personality.
- **Data-accurate borders** from Natural Earth (theirs are hand-drawn approximations), animated fills, routes, pins.
- Add **captions + stat pills** (`stat()`) for every number; their numbers are small.
- Turn each Short into a **series** ("Weird Borders #1, #2 …") with a recurring map-detective character.
