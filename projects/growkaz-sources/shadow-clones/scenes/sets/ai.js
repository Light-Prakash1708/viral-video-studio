// sets/ai.js: the story's two motifs. The glowing AI orb and the day counter that secretly flips meaning at the end.
import { E, V, text, ease, prog, clamp, alpha, rr, measure, glow, circle, key } from '/engine/core.js';

// the counter value follows the story's clock (global seconds): 0 -> 1 on "One", then climbs to 364 by "Day 364"
export const CUE = [[15.0, 0], [17.2, 1], [18.4, 8], [19.8, 30], [22, 90], [25, 170], [28, 260], [31.3, 364]];
export const dayAt = (gt) => Math.round(key(gt, CUE, ease.out));

// the glowing AI orb. power 0..1 (1 = bright), a = alpha
export function orb(g, x, y, r, t, o = {}) {
  const { a = 1, power = 1, color = '#4fd2ff', flick = 0 } = o;
  if (a <= 0 || power <= 0) return;
  const f = flick ? 0.35 + 0.65 * Math.abs(Math.sin(t * 31) * Math.sin(t * 17)) : 1;
  const p = (0.88 + 0.12 * Math.sin(t * 5)) * f * power;
  glow(g, x, y, r * 4.4, color, 0.5 * a * p);
  g.save(); g.globalAlpha *= a * Math.min(1, 0.4 + p);
  circle(g, x, y, r * 1.12, alpha(color, 0.35));
  circle(g, x, y, r, '#bff3ff'); circle(g, x - r * 0.18, y - r * 0.2, r * 0.62, '#ffffff');
  g.restore();
}

// the counter pill. flip 0 = "DAYS AHEAD" (cyan), flip 1 = "DAYS SINCE YOU LAST DECIDED ANYTHING" (red); between = split-flap squash
export function counter(g, x, y, o = {}) {
  const { value = 0, flip = 0, a = 1, pulse = 9, scale = 1, flicker = 0, t = 0 } = o;
  if (a <= 0) return;
  const showB = flip >= 0.5, sy = flip < 0.5 ? 1 - 2 * flip : (flip - 0.5) * 2;
  const col = showB ? '#ff5a4a' : '#7fe3ff';
  const lines = showB ? ['DAYS SINCE YOU LAST', 'DECIDED ANYTHING'] : ['DAYS AHEAD'];
  const pop = 1 + 0.2 * Math.max(0, 1 - clamp(pulse / 0.28));
  const fl = flicker ? 0.5 + 0.5 * Math.abs(Math.sin(t * 27)) : 1;
  const W = showB ? 700 : 470, H = showB ? 270 : 200;
  g.save(); g.globalAlpha *= a * fl; g.translate(x, y); g.scale(scale * pop, scale * pop * Math.max(0.03, sy));
  rr(g, -W / 2, -H / 2, W, H, 40); g.fillStyle = 'rgba(6,10,20,.78)'; g.fill();
  g.strokeStyle = alpha(col, 0.7); g.lineWidth = 5; g.stroke();
  glow(g, 0, 0, W * 0.9, col, 0.22);
  const top = -H / 2 + 52;
  lines.forEach((l, i) => text(g, l, 0, top + i * 46, { size: 40, font: 'Nunito', weight: 900, color: alpha('#f4ecd8', 0.95), spacing: 3, stroke: 5, strokeColor: 'rgba(0,0,0,.5)' }));
  text(g, String(value), 0, H / 2 - 62, { size: 112, font: 'Nunito', weight: 900, color: col, glow: 24, glowColor: alpha(col, 0.8), stroke: 8, strokeColor: 'rgba(0,0,0,.55)' });
  g.restore();
}

// a rounded speech/question bubble with a small tail pointing at (tx, ty)
export function bubble(g, x, y, str, o = {}) {
  const { a = 1, size = 54, color = '#f6f1e4', ink = '#10141c', tx = x, ty = y + 120, pop = 1 } = o;
  if (a <= 0) return;
  const w = measure(g, str, size, 'Nunito', 900) + 80, h = size + 54;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(pop, pop);
  rr(g, -w / 2, -h / 2, w, h, 34); g.fillStyle = color; g.fill();
  g.beginPath(); g.moveTo(-18, h / 2 - 2); g.lineTo(tx - x, ty - y); g.lineTo(26, h / 2 - 2); g.closePath(); g.fill();
  text(g, str, 0, 4, { size, font: 'Nunito', weight: 900, color: ink });
  g.restore();
}

// a floating "+N" label
export function plus(g, x, y, t, at, str, color = '#7fe3ff') {
  const k = prog(t, at, at + 1.1); if (k <= 0 || k >= 1) return;
  text(g, str, x, y - 90 * ease.out(k), { size: 74, font: 'Nunito', weight: 900, color, alpha: 1 - k * k, glow: 18, glowColor: alpha(color, 0.8), stroke: 8, strokeColor: 'rgba(0,0,0,.6)' });
}
