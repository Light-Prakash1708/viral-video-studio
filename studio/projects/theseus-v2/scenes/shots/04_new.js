// shots/04_new.js: shots added for the faster, story-style narration.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, wordTime, seg, circle, rr, glow, alpha, shade, text, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { drawShip, N } from '../sets/ship.js';
import { harbor, colonnade, SEA_Y } from '../sets/places.js';
import { stat } from '../sets/stat.js';
import { THESEUS, PHIL_A, PHIL_B, PLUTARCH } from '../cast.js';

// a03: "This question has been breaking brains for almost two thousand years."
// Three thinkers' heads pop in, each with a spinning confusion swirl, then the 2,000 YEARS stat.
registerShot('a03', { draw(g, t, info) {
  blurLayer(g, 14, (g) => colonnade(g, t, { z: 1.4, y: -120 })); veil(g, '#120a10', 0.4);
  const M = mood('golden');
  const heads = [[PHIL_A, -0.27, 0.62, 0.0, 'confused'], [PLUTARCH, 0.0, 0.55, 0.25, 'shocked'], [PHIL_B, 0.27, 0.62, 0.5, 'worried']];
  for (const [of, dx, yy, d, expr] of heads) {
    const k = ease.outBack(prog(t, d, d + 0.35)); if (k <= 0) continue;
    const x = E.W / 2 + dx * E.W, y = E.H * yy, r = V(130, 150) * k;
    bigFace(g, x, y, r, { outfit: of, expr, rimColor: M.rim, rimSide: dx < 0 ? -1 : 1, blink: ((t + d) % 2.6) > 2.5, tilt: Math.sin(t * 6 + d * 9) * 0.06 });
    // confusion swirl above each head
    g.save(); g.translate(x, y - r * 1.35); g.rotate(t * 6 + d * 3); g.strokeStyle = alpha(S().ui.gold, 0.85 * k); g.lineWidth = 6; g.lineCap = 'round';
    g.beginPath(); for (let a = 0; a < Math.PI * 3.2; a += 0.2) { const rr2 = 6 + a * 7; a ? g.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2) : g.moveTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } g.stroke(); g.restore();
  }
  const two = wordTime('two', info.globalT - t) ?? info.globalT - t + 1.6, at = two - (info.globalT - t);
  stat(g, { label: 'ARGUED ABOUT FOR ALMOST', value: '2,000 YEARS', x: E.W / 2, y: E.H * V(0.14, 0.16), a: ease.out(prog(t, at - 0.1, at + 0.25)), pulse: t - at, size: V(100, 118) });
} });

// a09: "So is it the same ship?" Theseus stares at the fully rebuilt ship.
registerShot('a09', { draw(g, t, info) {
  const cam = { z: 1.25 + 0.15 * ease.out(t / info.dur), x: V(-60, -40) };
  const { M, SY } = harbor(g, t + 20, cam, { mood: 'golden' });
  layer(g, cam, 0.75, (g) => drawShip(g, E.W * 0.62, SY + V(120, 160), V(0.8, 0.85), { wood: 'new', rim: M.rim, t: t + 20 }));
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.2, y: E.H * V(0.8, 0.68) + V(0, 40), s: V(1.5, 1.7), facing: 1, outfit: THESEUS, pose: breathe(POSES.think, t), expr: 'confused', rim: { color: M.rim, dir: [1, -0.4], w: 4 } }));
  const q = ease.outBack(prog(t, 0.25, 0.55)); g.save(); g.translate(E.W * 0.2, E.H * V(0.38, 0.33)); g.scale(q, q); text(g, '?', 0, 0, { size: V(150, 170), color: S().ui.gold, glow: 26, stroke: 8, strokeColor: 'rgba(0,0,0,.5)' }); g.restore();
} });

// a17: "And here's the creepy part." the harbor drops into night, lightning, a slow push on the dark ship
registerShot('a17', { draw(g, t, info) {
  const cam = { z: 1.1 + 0.12 * ease.inOut(t / info.dur), r: 0.02 * Math.sin(t * 2) };
  const [sx, sy] = shake(t, 8 * (1 - prog(t, 0.3, 0.8)), 30);
  g.save(); g.translate(sx, sy);
  const { M, SY } = harbor(g, t, cam, { mood: 'storm', night: true });
  layer(g, cam, 0.75, (g) => drawShip(g, E.W / 2, SY + V(120, 160), V(0.9, 1.0), { wood: 'old', rim: '#9fb4ff', sail: '#5a5a70', t }));
  g.restore();
  FX.rain(g, t, { count: 140 });
  const flash = Math.max(0, 1 - Math.abs(t - 0.3) / 0.12);
  if (flash > 0) { FX.lightning(g, { x1: E.W * 0.78, y1: 0, x2: E.W * 0.62, y2: SEA_Y(), seed: 4, w: 5 }); veil(g, '#ffffff', 0.5 * flash); }
} });

// a18: "This was never really about ships." blueprint ship gets crossed out
registerShot('a18', { draw(g, t, info) {
  const ui = S().ui;
  UI.blueprint(g);
  g.save(); g.translate(E.W / 2, E.H / 2); const z = 1 + 0.06 * t / info.dur; g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  drawShip(g, E.W / 2, E.H * 0.5, V(0.9, 1.0), { wood: 'new', old: shade(ui.bpBg, 0.12), fresh: shade(ui.blueprint, -0.3), ink: ui.blueprint, sail: shade(ui.bpBg, 0.2), rim: ui.blueprint, t });
  g.restore();
  const x1 = ease.out(prog(t, 0.5, 0.75)), x2 = ease.out(prog(t, 0.7, 0.95));
  const c = ui.accent, L = V(380, 420), cy = E.H * 0.42;
  if (x1 > 0) seg(g, [[E.W / 2 - L, cy - L], [E.W / 2 - L + 2 * L * x1, cy - L + 2 * L * x1]], 34, c);
  if (x2 > 0) seg(g, [[E.W / 2 + L, cy - L], [E.W / 2 + L - 2 * L * x2, cy - L + 2 * L * x2]], 34, c);
  if (x2 > 0) glow(g, E.W / 2, cy, 400, c, 0.25 * x2);
} });
