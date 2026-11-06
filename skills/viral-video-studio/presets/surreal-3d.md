# Preset: surreal-3d  (futuristic surreal 3D philosophy Shorts — proven on "The Experience Machine", Nov 2026)
Engine: GrowKaz, `"style": "surreal"` (violet/cyan neon), `"bars": "scope"`, music `{gainDb:-17, key:'D', seed:4}`, voice af_heart reflective (see Voice first).
Helpers: `presets/surreal-3d/dream3d.js` — stageFor, neon grid, drifting glowing shapes + stars, floating islands, glowing headset (+animHeadset), life-support tank, person(); use with `urban-3d/cine.js` word() (auto-fits long text).
Signature moves: dream world → wireframe glitch reveal ("none of it is real"); pull-back from inside a scene to reveal it's a tiny world in a glass orb inside a tank (use twice: dream, then "your life"); YES/NO glowing choice; split FEEL vs DO.
Light budget (or it whites out): stage bloom ≤ 0.7, bloomThreshold 0.88, PointLights intensity 3–6, emissiveIntensity ≤ 0.3, keep cameras ≥ 2.5 m from glowing objects, no trees where the hero stands.

## v2 (Experience Machine remake): dystopian variant + readable machine
- `"style": "dystopia"` (kit styles.js): soot shadows with a green cast, sodium-amber highlights, sat 0.72, vignette 0.62, grain 0.07. Accents: toxic green `#b8ff6a`, warning orange `#ff7a2a`; skies/voids `#060706 → #24261c`.
- `machine.js`: `machine(T, st)` = sleep pod with glass lid, the dreamer lying face-up wearing the headset, 3 TubeGeometry cables to a server tower with a "DREAM ACTIVE" screen; `pulseCables(m, t, power)` animates light pulses; `plugRig()` macro (plug slides into the headset socket, click spark); `showroom()` with the white-fedora dream dealer.
- Storyboard rule: show the mechanism literally (pod → plug click → cables light up → life menu) before any metaphor; use a dealer character to "offer" the deal in the hook and the ending.
- Voice v2: viral but warm = af_heart speed 1.15, gaps 0.12/0.18, only 2–3 [pause 0.3] beats (~200 wpm), CTA "Comment yes or no".
