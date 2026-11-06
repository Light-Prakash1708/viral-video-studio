// sets/act.js: acting helpers (figures with rim + blink defaults, runners with shopping bags, queues, money arcs).
import { E, V, rng, clamp, lerp, ease, prog, rr, seg, circle, glow, alpha, shade, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { note, EMBER } from './money.js';

export const blinkAt = (t, p = 3.1, o = 0) => ((t + o) % p) > p - 0.12;
// fig(g, { x, y, s, facing, outfit, pose|poses, expr, t, seed, rim, rimDir, look, prop, talk, alpha })
export function fig(g, o) {
  const t = o.t || 0, seed = o.seed || 0;
  const pose = o.poses ? posesAt(t, o.poses) : (typeof o.pose === 'string' ? POSES[o.pose] : o.pose) || POSES.stand;
  drawFigure(g, { ...o, pose: o.still ? pose : breathe(pose, t, 1, seed), blink: o.blink ?? blinkAt(t, 2.7 + (seed % 5) * 0.37, seed), rim: { color: o.rim || '#ffc078', dir: o.rimDir || [0, -1], w: o.rimW || 4.5 } });
}
// shopping bag hanging at approx hand position
export function bag(g, x, y, s, color = '#d8442a', sw = 0) {
  g.save(); g.translate(x, y); g.rotate(sw); g.scale(s, s); seg(g, [[-10, 0], [-6, -18], [6, -18], [10, 0]], 3, '#1a1210'); rr(g, -22, 0, 44, 52, 5); g.fillStyle = color; g.fill(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(-22, 8, 44, 6); g.restore();
}
// a running shopper moving right (dir 1) or left
export function runner(g, x, gy, s, t, o = {}) {
  const { dir = 1, outfit = {}, seed = 1, rim = '#ffc078', bags = 2, expr = 'joy', colors = ['#d8442a', '#e8c21a', '#3a8ac8', '#3fb950', '#d84a9a'] } = o;
  const ph = t * Math.PI * 2 * 1.6 + seed * 1.7, p = walkPose(ph, { run: true });
  drawFigure(g, { x, y: gy, s, facing: dir, pose: p, outfit, expr, rim: { color: rim, dir: [0, -1], w: 4 }, blink: blinkAt(t, 2.9, seed) });
  for (let b = 0; b < bags; b++) { const hx = x + dir * (p.hF[0] * s) * (b ? -0.6 : 1), hy = gy + (b ? p.hB[1] : p.hF[1]) * s; bag(g, hx, hy + 6 * s, s * 0.9, colors[(seed + b) % colors.length], Math.sin(ph + b) * 0.3); }
}
// a note flying along an arc from a to b (k 0..1)
export function flyNote(g, a, b, k, s = 0.18, o = {}) {
  if (k <= 0 || k >= 1) return; const h = o.h ?? 160, x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * h;
  glow(g, x, y, 80 * s / 0.18, EMBER, 0.25); note(g, x, y, s, { rot: k * 6 * (o.spin ?? 1), timer: o.timer || '29 DAYS', shadow: false, t: o.t || 0, pal: o.pal || 'r500', value: o.value || '500' });
}
// generic standing crowd strip of silhouettes (2D), rim lit
export function people(g, t, x0, x1, gy, s, o = {}) {
  const { seed = 3, step = 70, rim = '#ffc078', dim = 0, cheer = 0, exprs = ['smile', 'joy', 'neutral', 'surprised'] } = o; const r = rng(seed);
  for (let x = x0; x < x1; x += step * (0.7 + r() * 0.6)) { const pose = cheer && r() < cheer ? posesAt(t + r() * 2, [[0, 'cheer'], [0.4, 'stand'], [0.8, 'cheer']]) : POSES[['stand', 'relaxed', 'crossArms', 'phone', 'talk'][Math.floor(r() * 5)]];
    drawFigure(g, { x, y: gy + r() * 14, s: s * (0.85 + r() * 0.3), facing: r() < 0.5 ? 1 : -1, pose: breathe(pose, t, 1, x), expr: exprs[Math.floor(r() * exprs.length)], dim, rim: { color: rim, dir: [0, -1], w: 3.5 }, blink: blinkAt(t, 3.3, x) }); }
}
