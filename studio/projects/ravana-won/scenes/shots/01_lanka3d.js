// shots/01_lanka3d.js: every 3D shot of Swarna Lanka (night 2026, ancient, dark, storm).
import { E, V, registerShot, ease, prog, clamp, lerp, glow, alpha, text, veil, key } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { buildLanka, MINISTRIES, towerPos, PLAT_Y, TOWER_R } from '../sets/lanka.js';
import { word } from '../sets/cine.js';
import { stat } from '../sets/stat.js';
import { local, at, topBand, botBand, headline, drain, chip } from '../sets/ui.js';

const D = (T, cam, t, keys) => T.dolly(cam, t, keys);
const lit10 = (v) => Array(10).fill(v);

// r01 "The year is 2026." high aerial descending over the golden city at night
registerShot('r01', { kind: '3d', init: (T) => buildLanka(T, { era: '2026' }),
  draw(s, t, info, T) { s.update(t + 3, { lit: 0.6 }); D(T, s.stage.camera, t, [[0, { pos: [170, 120, 190], look: [0, 18, 0] }], [info.dur, { pos: [128, 78, 150], look: [0, 16, 0] }]]); },
  overlay(g, t, info) { topBand(g, 1, 0.34); const y = at(info, t, '2026', 1.0); headline(g, '2026', E.H * 0.2, ease.out(prog(t, y - 0.15, y + 0.3)), { size: 120, sub: 'THE YEAR IS', scale: 1 + 0.03 * t, spacing: 14 }); },
});
// r02 "And the most powerful city on Earth is made of gold." low sweep along the canal toward the palace
registerShot('r02', { kind: '3d', init: (T) => buildLanka(T, { era: '2026' }),
  draw(s, t, info, T) { s.update(t + 5, { lit: 0.7 }); const a0 = -0.15, a1 = 0.55, k = ease.inOut(t / info.dur), a = lerp(a0, a1, k), r = lerp(70, 52, k);
    s.stage.camera.position.set(Math.cos(a) * r, lerp(30, 34, k), Math.sin(a) * r); s.stage.camera.lookAt(0, lerp(26, 30, k), 0); },
  overlay(g, t, info) { const gd = at(info, t, 'gold', 3.5); topBand(g, ease.out(prog(t, gd - 0.4, gd)), 0.3); headline(g, 'MADE OF GOLD', E.H * 0.18, ease.out(prog(t, gd - 0.2, gd + 0.2)), { size: 84, sub: 'THE MOST POWERFUL CITY ON EARTH' }); },
});
// r08 TITLE over the island
registerShot('r08', { kind: '3d', init: (T) => buildLanka(T, { era: '2026' }),
  draw(s, t, info, T) { s.update(t + 9, { lit: 0.8, beams: 0.6 }); T.orbit(s.stage.camera, t, { target: [0, 6, 0], radius: [250, 215], height: [70, 58], from: 0.9, to: 1.25, dur: info.dur }); s.stage.camera.lookAt(0, 34, 0); },
  overlay(g, t, info) { topBand(g, 1, 0.5); const a = ease.out(prog(t, 0.05, 0.6)), s = 1 + 0.03 * t;
    g.save(); g.globalAlpha = a; glow(g, E.W / 2, E.H * 0.2, 700, '#ff9a3a', 0.12); g.restore();
    headline(g, 'WHAT IF', E.H * 0.13, a, { size: 64, color: '#f4e6cc', scale: s, spacing: 18 });
    headline(g, 'RAVANA HAD WON?', E.H * 0.25, ease.outBack(prog(t, 0.15, 0.75)), { size: 132, scale: s, spacing: 8 });
    text(g, 'LANKA · 2026', E.W / 2, E.H * 0.34, { size: 34, font: 'Nunito', weight: 900, color: '#ffcf8a', spacing: 14, alpha: ease.out(prog(t, 0.8, 1.3)) }); },
});
// r09 "Lanka was already legendary." ancient dusk: the island on the horizon across the sea
registerShot('r09', { kind: '3d', init: (T) => buildLanka(T, { era: 'ancient', grow: 0, fog: [120, 700] }),
  draw(s, t, info, T) { s.update(t, { lit: 0 }); D(T, s.stage.camera, t, [[0, { pos: [330, 9, 250], look: [0, 18, 0] }], [info.dur, { pos: [290, 11, 215], look: [0, 18, 0] }]]); },
  overlay(g, t) { topBand(g, 0.8, 0.3); headline(g, 'LANKA', E.H * 0.15, ease.out(prog(t, 0.2, 0.7)), { size: 92, sub: 'ALREADY LEGENDARY', spacing: 20 }); },
});
// r10 "The epic describes it as Swarna Lanka, a city of gold": the golden city rises from the sea
registerShot('r10', { kind: '3d', init: (T) => buildLanka(T, { era: 'ancient', grow: 0, fog: [120, 700] }),
  draw(s, t, info, T) { s.update(t + 2, { lit: 0 }); const k = ease.inOut(prog(t, 0.2, info.dur - 0.6)); s.island.position.y = lerp(-46, 0, k);
    D(T, s.stage.camera, t, [[0, { pos: [150, 16, 150], look: [0, 10, 0] }], [info.dur, { pos: [120, 30, 128], look: [0, 18, 0] }]]); },
  overlay(g, t, info) { const sw = at(info, t, 'swarna', 2.3); topBand(g, ease.out(prog(t, sw - 0.5, sw)), 0.32); headline(g, 'SWARNA LANKA', E.H * 0.16, ease.out(prog(t, sw - 0.1, sw + 0.4)), { size: 96, sub: 'THE CITY OF GOLD', spacing: 10 }); },
});
// r12 "on an island guarded by the ocean itself." wide orbit, waves ringing the shore
registerShot('r12', { kind: '3d', init: (T) => buildLanka(T, { era: 'ancient', grow: 0, fog: [160, 800] }),
  draw(s, t, info, T) { s.update(t + 4, { lit: 0, foam: 2.4 }); T.orbit(s.stage.camera, t, { target: [0, 0, 0], radius: [260, 230], height: [120, 100], from: 2.0, to: 2.45, dur: info.dur }); s.stage.camera.lookAt(0, 4, 0); },
  overlay(g, t, info) { const o = at(info, t, 'ocean', 2.2); topBand(g, 0.8, 0.28); headline(g, 'GUARDED BY THE OCEAN', E.H * 0.14, ease.out(prog(t, o - 0.3, o + 0.2)), { size: 68 }); },
});
// r25 "two thousand years trying to rebuild it" — TIME-LAPSE: ancient lamp-lit Lanka grows into 2026
registerShot('r25', { kind: '3d', init: (T) => buildLanka(T, { era: '2026', grow: 0 }),
  draw(s, t, info, T) { const k = ease.inOut(prog(t, 0.2, info.dur - 0.4)); s.update(t, { grow: k, lit: k * 0.7, rise: 0.6 });
    s.stage.sun.intensity = lerp(2.0, 1.2, k); s.stage.sun.color.setRGB(lerp(1, 0.6, k), lerp(0.7, 0.7, k), lerp(0.45, 1, k));
    T.orbit(s.stage.camera, t, { target: [0, 12, 0], radius: [120, 105], height: [46, 52], from: -0.9, to: 0.1, dur: info.dur }); s.stage.camera.lookAt(0, 20, 0); },
  overlay(g, t, info) { const k = ease.inOut(prog(t, 0.2, info.dur - 0.4)); const yr = Math.round(lerp(26, 2026, k)); topBand(g, 0.9, 0.32);
    stat(g, { label: 'TWO THOUSAND YEARS', value: `YEAR ${yr}`, x: E.W / 2, y: E.H * 0.15, size: 84, color: k > 0.98 ? '#ffd27a' : '#ffe8c0', pulse: k > 0.98 ? t - info.dur + 0.4 : 9 });
    g.save(); g.globalAlpha = 0.6; g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(E.W * 0.3, E.H * 0.255, E.W * 0.4, 6); g.fillStyle = '#ffcf7a'; g.fillRect(E.W * 0.3, E.H * 0.255, E.W * 0.4 * k, 6); g.restore(); },
});
// r26 "By 2026, Lanka has the world's busiest skyport." the skyport ring around the palace spire
registerShot('r26', { kind: '3d', init: (T) => buildLanka(T, { era: '2026', fov: 46 }),
  draw(s, t, info, T) { s.update(t + 20, { lit: 0.7, rise: 0.7 }); const y = s.portY; D(T, s.stage.camera, t, [[0, { pos: [52, y + 16, 34], look: [0, y + 1, 0] }], [info.dur, { pos: [40, y + 12, 44], look: [0, y + 3, 0] }]]); },
  overlay(g, t, info) { const b = at(info, t, 'busiest', 2.9); topBand(g, 0.9, 0.3); headline(g, 'BUSIEST SKYPORT', E.H * 0.15, ease.out(prog(t, b - 0.2, b + 0.2)), { size: 84, sub: "LANKA 2026 · WORLD'S" }); },
});
// r27 "Silent, golden aircraft rise from the old palace like fireflies." low angle up the spire, the fleet rising
registerShot('r27', { kind: '3d', init: (T) => buildLanka(T, { era: '2026', fov: 52, fleet: 60 }),
  draw(s, t, info, T) { s.update(t * 1.6 + 30, { lit: 0.6, rise: 1.3 }); D(T, s.stage.camera, t, [[0, { pos: [36, 14, 34], look: [0, 30, 0] }], [info.dur, { pos: [30, 12, 40], look: [0, 44, 0] }]]); },
  overlay(g, t, info) { const f = at(info, t, 'fireflies', 3.9); topBand(g, 0.7, 0.26); headline(g, 'LIKE FIREFLIES', E.H * 0.13, ease.out(prog(t, f - 0.2, f + 0.3)), { size: 72 }); },
});
// r30 "So the dream of a flying Lanka? It never fully died." from high orbit down to the night island
registerShot('r30', { kind: '3d', init: (T) => buildLanka(T, { era: '2026', fog: [200, 900] }),
  draw(s, t, info, T) { s.update(t + 40, { lit: 0.7, rise: 1 }); D(T, s.stage.camera, t, [[0, { pos: [30, 420, 60], look: [0, 0, 0] }], [info.dur, { pos: [150, 110, 170], look: [0, 16, 0] }]]); },
  overlay(g, t, info) { const d = at(info, t, 'died', 3.8); topBand(g, 0.8, 0.28); headline(g, 'THE DREAM NEVER DIED', E.H * 0.14, ease.out(prog(t, d - 0.3, d + 0.2)), { size: 70 }); },
});
// r31 "The capital glows at night." wide, slow
registerShot('r31', { kind: '3d', init: (T) => buildLanka(T, { era: '2026' }),
  draw(s, t, info, T) { s.update(t + 50, { lit: 0.7 }); T.orbit(s.stage.camera, t, { target: [0, 10, 0], radius: [150, 140], height: [36, 34], from: 2.6, to: 2.78, dur: info.dur }); s.stage.camera.lookAt(0, 20, 0); },
  overlay(g, t) { topBand(g, 0.6, 0.24); headline(g, 'THE CAPITAL', E.H * 0.13, ease.out(prog(t, 0.2, 0.6)), { size: 64, spacing: 16 }); },
});
// r32 "Ten great towers stand around the palace," orbit inside the ring
registerShot('r32', { kind: '3d', init: (T) => buildLanka(T, { era: '2026', fov: 50 }),
  draw(s, t, info, T) { s.update(t + 60, { lit: 0.75 }); T.orbit(s.stage.camera, t, { target: [0, 22, 0], radius: [62, 54], height: [20, 26], from: 0.2, to: 0.9, dur: info.dur }); },
  overlay(g, t, info) { const tn = at(info, t, 'ten', 0.1); topBand(g, 0.8, 0.28); headline(g, 'TEN GREAT TOWERS', E.H * 0.14, ease.out(prog(t, tn, tn + 0.4)), { size: 76 }); },
});
// r34 "and in this world, each head becomes a ministry." towers light up one after another, beams rise
registerShot('r34', { kind: '3d', init: (T) => buildLanka(T, { era: '2026', fov: 46 }),
  draw(s, t, info, T) { const m = at(info, t, 'ministry', 2.5); const lit = Array.from({ length: 10 }, (_, i) => ease.out(prog(t, 0.3 + i * 0.22, 0.6 + i * 0.22))); s.update(t + 70, { lit, beams: ease.out(prog(t, m - 0.5, m + 0.3)) });
    T.orbit(s.stage.camera, t, { target: [0, 20, 0], radius: [105, 92], height: [62, 52], from: -0.4, to: -0.05, dur: info.dur }); s.stage.camera.lookAt(0, 24, 0); },
  overlay(g, t, info) { const m = at(info, t, 'ministry', 2.5); topBand(g, 0.85, 0.3); headline(g, '10 HEADS · 10 MINISTRIES', E.H * 0.15, ease.out(prog(t, m - 0.3, m + 0.2)), { size: 78 }); },
});
// r35 "Medicine. Music. Astronomy. War." travel along the ring, each tower lights as it is named
registerShot('r35', { kind: '3d', init: (T) => buildLanka(T, { era: '2026', fov: 40 }),
  draw(s, t, info, T) { const ws = ['medicine', 'music', 'astronomy', 'war'].map((w, i) => at(info, t, w, 0.15 + i * 0.95)); const lit = Array.from({ length: 10 }, (_, i) => (i < 4 ? ease.out(prog(t, ws[i] - 0.1, ws[i] + 0.25)) : 0.12));
    s.update(t + 80, { lit, beams: 1 });
    // camera outside the ring, looking at the emblem of the tower being named
    let f = 0; for (let i = 0; i < 4; i++) if (t > ws[i] - 0.25) f = i; const pf = i => { const [x, , z] = towerPos(i); const a = Math.atan2(z, x); return { a, H: s.towers[i].H }; };
    const k = (() => { let v = 0; for (let i = 1; i < 4; i++) v += ease.inOut(prog(t, ws[i] - 0.45, ws[i] - 0.05)); return v; })();
    const i0 = Math.floor(k), i1 = Math.min(3, i0 + 1), fr = k - i0; const A = lerp(pf(i0).a, pf(i1).a, fr), H = lerp(pf(i0).H, pf(i1).H, fr);
    const r = TOWER_R + 15; s.stage.camera.position.set(Math.cos(A + 0.12) * r, PLAT_Y + H - 2.5, Math.sin(A + 0.12) * r); s.stage.camera.lookAt(Math.cos(A) * TOWER_R, PLAT_Y + H - 4.5, Math.sin(A) * TOWER_R); },
  overlay(g, t, info) { const ws = ['medicine', 'music', 'astronomy', 'war'].map((w, i) => at(info, t, w, 0.15 + i * 0.95)); topBand(g, 0.8, 0.28);
    for (let i = 0; i < 4; i++) { const a = ease.out(prog(t, ws[i] - 0.1, ws[i] + 0.15)) * (i < 3 ? 1 - prog(t, ws[i + 1] - 0.25, ws[i + 1] - 0.05) : 1); headline(g, MINISTRIES[i][0], E.H * 0.15, a, { size: 92, color: MINISTRIES[i][1], sub: `MINISTRY ${i + 1} OF 10`, scale: 1 + 0.1 * Math.max(0, 1 - (t - ws[i]) / 0.25) }); } },
});
// r36 "Ten minds ruling as one." top-down: the ring of ten, beams, slow rotation
registerShot('r36', { kind: '3d', init: (T) => buildLanka(T, { era: '2026', fov: 42 }),
  draw(s, t, info, T) { s.update(t + 90, { lit: 1, beams: 1 }); const k = ease.inOut(t / info.dur), a = lerp(0, 0.5, k), h = lerp(150, 120, k); s.stage.camera.position.set(Math.cos(a) * 30, h, Math.sin(a) * 30); s.stage.camera.lookAt(0, 6, 0); },
  overlay(g, t, info) { const o = at(info, t, 'one', 2.4); topBand(g, 0.8, 0.26); headline(g, 'TEN MINDS. ONE RULER.', E.H * 0.13, ease.out(prog(t, 0.2, 0.6)), { size: 72, scale: 1 + 0.08 * Math.max(0, 1 - Math.abs(t - o) / 0.3) }); },
});
// r40 "But every empire has a shadow." colour drains from the city, the light goes cold
registerShot('r40', { kind: '3d', init: (T) => buildLanka(T, { era: '2026' }),
  draw(s, t, info, T) { const k = ease.inOut(prog(t, 0.3, 2.2)); s.update(t + 100, { lit: 0.7 * (1 - k * 0.8) }); s.palLight.intensity = 380 * (1 - k * 0.8); s.ringLights.forEach((l) => (l.intensity = 380 * (1 - k * 0.85)));
    T.orbit(s.stage.camera, t, { target: [0, 18, 0], radius: [90, 76], height: [28, 24], from: 3.4, to: 3.6, dur: info.dur }); },
  overlay(g, t, info) { const k = ease.inOut(prog(t, 0.3, 2.2)); drain(g, k * 0.9, 'rgba(120,140,170,1)'); veil(g, '#020408', 0.35 * k); const sh = at(info, t, 'shadow', 2.1); topBand(g, 0.8, 0.26); headline(g, 'EVERY EMPIRE HAS A SHADOW', E.H * 0.14, ease.out(prog(t, sh - 0.4, sh + 0.1)), { size: 66, color: '#d8e0e8' }); },
});
// r45 "The ten towers watch everything." dark era: searchlights sweep the city
registerShot('r45', { kind: '3d', init: (T) => buildLanka(T, { era: 'dark', fov: 48 }),
  draw(s, t, info, T) { s.update(t + 5, { lit: 0.35, search: 1 }); D(T, s.stage.camera, t, [[0, { pos: [70, 18, 40], look: [0, 30, 0] }], [info.dur, { pos: [62, 22, 52], look: [0, 32, 0] }]]); },
  overlay(g, t, info) { const w = at(info, t, 'watch', 1.1); topBand(g, 0.8, 0.26); headline(g, 'THE TOWERS WATCH', E.H * 0.14, ease.out(prog(t, w - 0.2, w + 0.2)), { size: 74, color: '#dfe8f0' }); },
});
// r56 "Maybe that's why the story needs him to lose." storm over the palace, lightning, slow pull-back
registerShot('r56', { kind: '3d', init: (T) => buildLanka(T, { era: 'storm', search: false, fleet: 0 }),
  draw(s, t, info, T) { s.update(t + 7, { lit: 0.25 }); s.palLight.intensity = 520; s.palLight.color.set('#ffb060'); s.gold.color.set('#c89040'); const fl = (t > 0.25 && t < 0.4) || (t > 2.1 && t < 2.2) ? 1 : 0; s.stage.sun.intensity = 0.9 + fl * 6; s.stage.hemi.intensity = 1.2 + fl * 2;
    D(T, s.stage.camera, t, [[0, { pos: [44, 20, 50], look: [0, 30, 0] }], [info.dur, { pos: [86, 26, 98], look: [0, 28, 0] }]]); },
  overlay(g, t) { const fl = (t > 0.25 && t < 0.4) || (t > 2.1 && t < 2.2) ? 1 : 0; if (fl) veil(g, '#dfe8ff', 0.18); },
});
// r68 "So tell me." golden city, slow push
registerShot('r68', { kind: '3d', init: (T) => buildLanka(T, { era: '2026' }),
  draw(s, t, info, T) { s.update(t + 120, { lit: 0.8, beams: 0.5 }); D(T, s.stage.camera, t, [[0, { pos: [118, 40, 96], look: [0, 22, 0] }], [info.dur, { pos: [104, 36, 86], look: [0, 22, 0] }]]); },
});
// r69 "If Ravana had won would you want to live in his golden Lanka?" the question over the city
registerShot('r69', { kind: '3d', init: (T) => buildLanka(T, { era: '2026' }),
  draw(s, t, info, T) { s.update(t + 122, { lit: 0.8, beams: 0.6 }); T.orbit(s.stage.camera, t, { target: [0, 8, 0], radius: [150, 130], height: [44, 36], from: 0.75, to: 0.95, dur: info.dur }); s.stage.camera.lookAt(0, 30, 0); },
  overlay(g, t, info) { topBand(g, 1, 0.42); const a = ease.out(prog(t, 0.3, 0.9)), b = ease.out(prog(t, at(info, t, 'live', 2.6) - 0.2, at(info, t, 'live', 2.6) + 0.3));
    text(g, 'If Ravana had won…', E.W / 2, E.H * 0.12, { size: 70, font: 'Playfair Display', weight: 900, italic: true, color: '#f4ead8', alpha: a, glow: 14, glowColor: 'rgba(255,170,80,.6)' });
    text(g, 'would you live in his golden Lanka?', E.W / 2, E.H * 0.23, { size: 66, font: 'Playfair Display', weight: 900, italic: true, color: '#ffd27a', alpha: b, glow: 20, glowColor: 'rgba(255,150,40,.7)' }); },
});
