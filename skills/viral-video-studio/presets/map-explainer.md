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


## Map-and-diagram explainer (v2, measured Nov 2026 on "The Difference Between the House and Senate", 114 s, 9:16)
**Script recipe (195 wpm, Q&A):** real-world news hook with a date ("On November 3rd, Americans voted…") → "You've heard these titles a hundred times, but do you really know…?" → "Let's break it down. Look, this is…" (point at the screen) → zoom from the big picture to the place → ONE concrete comparison carries the whole idea (New York 26 districts vs Wyoming 1) → "But here's the interesting thing…" (the design problem) → the solution with exact numbers (2 senators per state = 100) → quick "But then, who are…?" for the related term → close on why it matters (balance of power). Every number appears on screen the moment it is said.
**Visual grammar:** zero hard cuts; satellite-style map zooms (Earth → country → city → two states side by side) and diagonal white-edged swipes into a blueprint-blue diagram space; cut-out landmark icons; an org chart that builds node by node and keeps growing through the video (the viewer's mental model on screen); isotype people grids that pop in and count; parliament hemicycles; handwritten yellow annotations with hand-drawn circles; red badges for terms ("6 years"); glowing green ticks for approvals; party flags as icons.
**Kit:** `presets/map-explainer/diagram.js` (copy next to `geo.js`): `blueprint`, `person`, `isotype(g,x,y,n,cols,{size,k,colors})`, `countUp`, `hemicycle(g,cx,cy,R,[{n,color}],{k,label})`, `orgNode(g,x,y,title,k,{icon})`, `orgLink`, `scribble(g,str,x,y,k)`, `scribbleCircle`, `tick`, `badge`, `swipe(g,k,drawA,drawB)`. Combine with `geo.js` `drawWorld/flyTo/project` for the maps. Captions: small sentence-style line at the bottom (not one-word) because the screen already carries labels.
**Sound:** calm explainer bed (orchestra.py `curious`/`warm`, energy 0.4–0.5), a soft pop on every node/number reveal, a swoosh on swipes, a stamp on ticks; voice `viral` or `gentle` at ~195 wpm.
