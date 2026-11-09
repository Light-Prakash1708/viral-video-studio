// shots/06_dussehra_end.js: our world's Dussehra in 3D (effigy, crowds, the arrow, fire, fireworks), the x-ray insert,
// the embers, Sri Lanka's memory on a real map, the gold-and-fire split, and the YES / NO end card.
import { E, V, registerShot, ease, prog, clamp, lerp, glow, alpha, text, veil, layer, blurLayer, rng, seg, circle, poly, linGrad, mix, rr, shade } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { buildDussehra } from '../sets/dussehra.js';
import { C, sky, ravana, effigy, flames, embers, fireworks, crowdSil, palaceSkyline } from '../sets/myth.js';
import { flyTo, fit, drawWorld, project } from '../sets/geo.js';
import { local, at, topBand, botBand, headline, drain, chip } from '../sets/ui.js';

const toScreen = (s, x, y, z) => { const v = new s.stage.scene.position.constructor(x, y, z).project(s.stage.camera); return [(v.x * 0.5 + 0.5) * E.W, (-v.y * 0.5 + 0.5) * E.H]; };
// r59 "Back in our world, every Dussehra, the giant effigies go up."
registerShot('r59', { kind: '3d', init: (T) => buildDussehra(T),
  draw(s, t, info, T) { s.update(t, { cheer: 0.3 }); T.dolly(s.stage.camera, t, [[0, { pos: [30, 6, 72], look: [0, 12, 0] }], [info.dur, { pos: [16, 8, 52], look: [0, 13, 0] }]]); },
  overlay(g, t, info) { const d = at(info, t, 'dussehra', 1.7); topBand(g, 0.8, 0.26); headline(g, 'BACK IN OUR WORLD', E.H * 0.13, ease.out(prog(t, 0.1, 0.5)) * (1 - prog(t, d - 0.3, d)), { size: 70 }); headline(g, 'DUSSEHRA', E.H * 0.14, ease.out(prog(t, d - 0.1, d + 0.3)), { size: 92, color: '#ffb050', sub: 'EVERY YEAR', spacing: 18 }); },
});
// r60 "Some of them taller than a ten-storey building." tilt up beside the building, a dimension line
registerShot('r60', { kind: '3d', init: (T) => buildDussehra(T, { fov: 50 }),
  draw(s, t, info, T) { s.update(t + 5, {}); const k = ease.inOut(t / info.dur); s.stage.camera.position.set(lerp(18, 14, k), lerp(3, 6, k), lerp(46, 50, k)); s.stage.camera.lookAt(-6, lerp(8, 16, k), 0); },
  overlay(g, t, info, s) { const [bx, by0] = toScreen(s, -17.5, 0, -1), [, by1] = toScreen(s, -17.5, 31, -1), [ex, ey1] = toScreen(s, 6.5, 23.5, 2), [, ey0] = toScreen(s, 6.5, 0, 2);
    const a = ease.out(prog(t, 0.3, 0.8)); g.save(); g.globalAlpha = a; seg(g, [[bx, by0], [bx, by1]], 3, '#ffe0a0'); seg(g, [[bx - 16, by1], [bx + 16, by1]], 3, '#ffe0a0'); seg(g, [[bx - 16, by0], [bx + 16, by0]], 3, '#ffe0a0');
    seg(g, [[ex, ey0], [ex, ey1]], 3, '#ffb050'); seg(g, [[ex - 16, ey1], [ex + 16, ey1]], 3, '#ffb050'); g.restore();
    chip(g, '10 STOREYS', bx + 10, (by0 + by1) / 2, a, { color: '#ffe0a0', size: 34 }); topBand(g, 0.7, 0.24); headline(g, 'TALLER THAN A BUILDING', E.H * 0.12, ease.out(prog(t, 0.2, 0.6)), { size: 64 }); },
});
// r61 "Ten heads." close on the ten painted heads
registerShot('r61', { kind: '3d', init: (T) => buildDussehra(T, { fov: 40 }),
  draw(s, t, info, T) { s.update(t + 8, {}); const k = ease.inOut(t / info.dur); s.stage.camera.position.set(lerp(-6, 4, k), 17.5, 17); s.stage.camera.lookAt(lerp(-2, 1, k), 20.3, 0); },
  overlay(g, t) { topBand(g, 0.7, 0.22); headline(g, 'TEN HEADS', E.H * 0.11, ease.out(prog(t, 0.05, 0.35)), { size: 80, color: '#ffd27a', spacing: 18 }); },
});
// r62 "Fireworks inside." x-ray cutaway of the effigy, packed with fireworks
registerShot('r62', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur) };
  layer(g, cam, 0.1, (g) => sky(g, ['#020208', '#0a0c24', '#1a1226'], { stars: 70, t }));
  layer(g, cam, 0.6, (g) => { g.fillStyle = '#0a0608'; g.fillRect(-E.W, E.H * 0.9, E.W * 3, E.H); });
  layer(g, cam, 1, (g) => { effigy(g, E.W * 0.5, E.H * 0.93, 1.05, { t, xray: ease.out(prog(t, 0.15, 0.6)) }); });
  FX.dust(g, t, { count: 30, color: '#9fe8ff', a: 0.3 });
  topBand(g, 0.7, 0.2); headline(g, 'FIREWORKS INSIDE', E.H * 0.1, ease.out(prog(t, 0.1, 0.4)), { size: 64, color: '#bff6ff' });
} });
// r63 "And every year, when the arrow flies and the flames rise" the arrow streaks in, ignition, fire and fireworks
const FW = [[0, 2.1], [1, 2.5], [2, 2.9], [3, 3.2], [4, 3.6]];
registerShot('r63', { kind: '3d', init: (T) => buildDussehra(T, { fov: 48 }),
  draw(s, t, info, T) { const a = at(info, t, 'arrow', 1.6), hit = a + 0.15, burn = ease.out(prog(t, hit, hit + 1.8));
    s.update(t, { burn, arrow: prog(t, a - 0.9, hit), fw: FW.map(([i, st]) => [i, st + (hit - 1.75)]), cheer: burn });
    T.dolly(s.stage.camera, t, [[0, { pos: [16, 4, 60], look: [4, 8, 30] }], [hit - 0.1, { pos: [14, 6, 46], look: [0, 14, 4] }], [info.dur, { pos: [22, 8, 56], look: [0, 18, 0] }]]); },
  overlay(g, t, info) { const a = at(info, t, 'arrow', 1.6), hit = a + 0.15; if (t > hit) veil(g, '#fff0d0', 0.4 * (1 - prog(t, hit, hit + 0.3))); },
});
// r64 "we're not just burning a villain." wide: the effigy ablaze, the sky full of fireworks
registerShot('r64', { kind: '3d', init: (T) => buildDussehra(T, { fov: 52 }),
  draw(s, t, info, T) { s.update(t + 3, { burn: 1, fw: [[5, -0.3], [6, 0.2], [7, 0.6], [8, 0.9], [9, 1.2], [0, 1.4]], cheer: 1 }); T.dolly(s.stage.camera, t, [[0, { pos: [-30, 10, 80], look: [0, 22, 0] }], [info.dur, { pos: [-24, 12, 72], look: [0, 26, 0] }]]); },
});
// r65 "We're burning the part of ourselves that thinks being powerful means being right." slow embers, a lone watcher
registerShot('r65', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.08 * ease.inOut(t / info.dur), y: lerp(0, -40, ease.inOut(t / info.dur)) }, pw = at(info, t, 'powerful', 3.8);
  layer(g, cam, 0.1, (g) => { sky(g, ['#020206', '#0a0610', '#2a0e0c', '#6a2010'], { stars: 50, t }); glow(g, E.W * 0.5, E.H * 0.95, 1000, '#ff6a1a', 0.35); });
  layer(g, cam, 0.5, (g) => { flames(g, t, E.W * 0.5, E.H * 0.95, 900, 300, 0.5, { seed: 4, n: 30 }); });
  embers(g, t, { count: 140, area: [0, -E.H * 0.2, E.W, E.H * 1.2], k: 1, speed: 26, size: 3.2 });
  layer(g, cam, 1, (g) => { g.fillStyle = '#030203'; g.fillRect(-E.W, E.H * 0.92, E.W * 3, E.H); drawFigure(g, { x: E.W * 0.3, y: E.H * 0.93, s: 2.1, facing: 1, outfit: { top: 'hoodie', color: '#3a2a2a', head: 'none' }, pose: breathe(POSES.stand, t, 1, 2), expr: 'thinking', look: [0.5, -0.8], blink: (t % 3.4) > 3.3, rim: { color: '#ff8a3a', dir: [0.7, -0.4] } }); });
  layer(g, cam, 1.6, (g) => blurLayer(g, 8, (g) => crowdSil(g, t, E.H * 1.15, { seed: 3, count: 7, scale: 2.4, color: '#020102', rim: alpha('#ff7a2a', 0.3) })));
  topBand(g, 0.5, 0.22); headline(g, 'POWER IS NOT RIGHT', E.H * 0.12, ease.out(prog(t, pw - 0.2, pw + 0.4)), { size: 74, color: '#ffc080', spacing: 12 });
} });
// r66 "And yet in Sri Lanka, some people still remember Ravana as a great king." Sri Lanka in gold on a real map, lamps lit
registerShot('r66', { draw(g, t, info) {
  const view = flyTo(t, [[0, { lon: 80.5, lat: 8, zoom: 9 }], [info.dur, { ...fit(['LKA'], 1.7) }]]), k = at(info, t, 'king', 5.2);
  drawWorld(g, view, { ocean: ['#081a30', '#04101e'], land: '#2e261a', land2: '#3a2e1e', border: 'rgba(255,200,120,.2)', highlight: { LKA: '#d8a040' }, t });
  const R = rng(12); for (let i = 0; i < 26; i++) { const lon = 79.9 + R() * 1.8, lat = 6.1 + R() * 3.6; const [x, y] = project(view, lon, lat); const a = ease.out(prog(t, 0.6 + i * 0.12, 1.0 + i * 0.12)); if (a <= 0) continue; const fl = 0.8 + 0.2 * Math.sin(t * 8 + i); glow(g, x, y, 40, '#ffb050', 0.5 * a * fl); circle(g, x, y, 3, alpha('#fff0c8', a)); }
  FX.dust(g, t, { count: 30, color: '#ffd890', a: 0.3 });
  topBand(g, 0.8, 0.26); headline(g, 'SRI LANKA', E.H * 0.13, ease.out(prog(t, 1.0, 1.5)), { size: 80, spacing: 18 }); botBand(g, 0.7, 0.3); chip(g, 'REMEMBERED AS A GREAT KING', E.W / 2, E.H * 0.82, ease.out(prog(t, k - 0.6, k - 0.2)), { color: C.gold, size: 36 });
} });
// r67 "Both stories survive. Gold and fire." split frame: golden Lanka | the burning effigy
registerShot('r67', { draw(g, t, info) {
  const gd = at(info, t, 'gold', 2.1), fi = at(info, t, 'fire', 3.3), split = E.W / 2 + Math.sin(t * 0.8) * 10;
  g.save(); g.beginPath(); g.rect(0, 0, split, E.H); g.clip(); { const cx = -10 * t; g.save(); g.translate(cx, 0); sky(g, ['#03041a', '#14164a', '#5a3448', '#c8703a'], { stars: 40, t });
    palaceSkyline(g, E.H * 0.78, { color: '#1a1208', seed: 61, scale: 1.1, lamps: 1, t, rim: alpha(C.gold, 0.5) }); glow(g, E.W * 0.25, E.H * 0.65, 500, C.gold, 0.35 * (0.6 + 0.4 * ease.out(prog(t, gd - 0.2, gd + 0.3)))); g.fillStyle = '#0a0806'; g.fillRect(-E.W, E.H * 0.78, E.W * 3, E.H);
    ravana(g, E.W * 0.26, E.H * 0.8, 0.45, { t, glowA: 0.4 }); g.restore(); FX.dust(g, t, { count: 30, color: '#ffd890', a: 0.4 }); } g.restore();
  g.save(); g.beginPath(); g.rect(split, 0, E.W - split, E.H); g.clip(); { g.save(); g.translate(10 * t, 0); sky(g, ['#020206', '#0a0610', '#2a0e0c'], { stars: 30, t }); g.fillStyle = '#0a0406'; g.fillRect(-E.W, E.H * 0.86, E.W * 3, E.H);
    effigy(g, E.W * 0.75, E.H * 0.88, 0.62, { t, burn: 0.8 + 0.2 * ease.out(prog(t, fi - 0.2, fi + 0.4)) }); g.restore(); embers(g, t, { count: 60, area: [split, 0, E.W - split, E.H], k: 1, speed: 80 });
    fireworks(g, t, [{ x: E.W * 0.65, y: E.H * 0.22, at: 0.5, col: '#ffc45a', r: 140 }, { x: E.W * 0.88, y: E.H * 0.3, at: 1.6, col: '#ff5a8a', r: 120 }, { x: E.W * 0.72, y: E.H * 0.16, at: fi, col: '#ff8a3a', r: 170 }]);
    crowdSil(g, t, E.H * 1.02, { seed: 4, count: 10, scale: 1.1, x0: split, x1: E.W + 40, color: '#030203', rim: alpha('#ff7a2a', 0.4), cheer: 0.5 }); } g.restore();
  g.save(); g.shadowColor = '#fff0c8'; g.shadowBlur = 20; seg(g, [[split, 0], [split, E.H]], 3, alpha('#fff0c8', 0.8)); g.restore();
  topBand(g, 0.75, 0.24); headline(g, 'BOTH STORIES SURVIVE', E.H * 0.11, ease.out(prog(t, 0.1, 0.5)), { size: 62, color: '#fff2dc' });
  botBand(g, 0.8, 0.3); headline(g, 'GOLD', E.W * 0 + E.H * 0.84, ease.out(prog(t, gd - 0.1, gd + 0.3)), { size: 92, x: E.W * 0.25, color: '#ffd27a', spacing: 20 }); headline(g, 'FIRE', E.H * 0.84, ease.out(prog(t, fi - 0.1, fi + 0.3)), { size: 92, x: E.W * 0.75, color: '#ff7a3a', spacing: 20 });
} });
// r70 END "Comment below. Yes or no." two glowing options over the golden city
registerShot('r70', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.05 * ease.inOut(t / info.dur) }, ys = at(info, t, 'yes', 2.13), no = at(info, t, 'no', 2.95);
  layer(g, cam, 0.1, (g) => { sky(g, ['#03041a', '#0e1244', '#3a2850', '#a8603a'], { stars: 110, t }); glow(g, E.W * 0.5, E.H * 0.9, 900, C.gold, 0.25); });
  layer(g, cam, 0.4, (g) => { palaceSkyline(g, E.H * 0.9, { color: '#140e0a', seed: 71, scale: 1.0, lamps: 1, t, rim: alpha(C.gold, 0.45) }); g.fillStyle = '#080604'; g.fillRect(-E.W, E.H * 0.9, E.W * 3, E.H); });
  FX.dust(g, t, { count: 50, color: '#ffd890', a: 0.4 });
  const a = ease.out(prog(t, 0.1, 0.6)); topBand(g, 1, 0.45);
  text(g, 'Would you live in his golden Lanka?', E.W / 2, E.H * 0.16, { size: 70, font: 'Playfair Display', weight: 900, italic: true, color: '#fff0d8', alpha: a, glow: 16, glowColor: 'rgba(255,170,80,.6)' });
  text(g, 'COMMENT BELOW', E.W / 2, E.H * 0.27, { size: 34, font: 'Nunito', weight: 900, color: '#ffcf8a', spacing: 10, alpha: ease.out(prog(t, 0.4, 0.9)) });
  const btn = (x, str, col, st) => { const k = ease.outBack(prog(t, st - 0.15, st + 0.3)), pulse = 1 + 0.05 * Math.sin((t - st) * 5) * (t > st ? 1 : 0); if (k <= 0) return; g.save(); g.translate(x, E.H * 0.55); g.scale(k * pulse, k * pulse);
    glow(g, 0, 0, 300, col, 0.35); rr(g, -220, -90, 440, 180, 90); g.fillStyle = 'rgba(8,8,20,.78)'; g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.shadowColor = col; g.shadowBlur = 30; g.stroke(); g.shadowBlur = 0;
    text(g, str, 0, 4, { size: 96, color: col, glow: 24, glowColor: alpha(col, 0.8), spacing: 10 }); g.restore(); };
  btn(E.W * 0.32, 'YES', '#ffd27a', ys); btn(E.W * 0.68, 'NO', '#ff7a5a', no);
  text(g, 'WHAT IF RAVANA HAD WON?', E.W / 2, E.H * 0.8, { size: 30, font: 'Nunito', weight: 900, color: alpha('#fff0d8', 0.7), spacing: 12, alpha: ease.out(prog(t, 3.2, 3.8)) });
  veil(g, '#000', ease.in(prog(t, info.dur - 0.9, info.dur)) * 0.6);
} });
