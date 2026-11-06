# Preset: urban-3d  (cinematic urban 3D psychology Shorts — proven on "The Bystander Effect", Nov 2026)
Engine: GrowKaz Stickman, `"style": "cinema"`, `"bars": "scope"`, music `{gainDb:-15, key:'D', seed:11}` (keys: plain note names like D, not Dm).
Helpers: `presets/urban-3d/station.js` (Three.js subway: lit tiles, pillars, lightbox ads, point lights, train, 24-person crowd, setFallen(), lookAtFallen()), `cine.js` (word pill, cctv() security-cam overlay, thought bubbles, lab + booth 2D sets).
Rules: 3D for the situation (wide, low angle, overhead "empty ring", CCTV, freeze-frame), 2D for the psychology (eyes grid, thought bubbles, experiment booths, bars, pie split).
3D gotchas: pass `ceiling:false` for overhead/orbit cameras; 2D 'lie' pose doesn't lie in 3D, rotate the root (rotation.x ≈ π/2); keep camera on the wall side when a train passes; ambient ≥ 2.5 + PointLights or the cinema grade crushes it to black.
Story: hook situation → social proof thoughts → named classic experiment with real numbers → mechanism visual → "here's the twist" (modern data, context matters) → actionable tip → call-back to the hero (red jacket) → question.
