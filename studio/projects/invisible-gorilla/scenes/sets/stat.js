// sets/stat.js: stacked number readout. Small label on top, big glowing value below, never overlapping.
import { E, V, S, text, ease, prog, clamp, alpha, rr, measure } from '/engine/core.js';
export function stat(g, o = {}) {
  const { label, value, x = E.W / 2, y = E.H * 0.13, color = S().ui.gold, size = V(120, 140), a = 1, pulse = 9 } = o;
  if (a <= 0) return;
  const pop = 1 + 0.18 * Math.max(0, 1 - clamp(pulse / 0.25));   // quick scale pop when the value changes
  g.save(); g.globalAlpha *= a;
  const w = Math.max(measure(g, value, size, 'Nunito', 900), measure(g, label, V(34, 40), 'Nunito', 900) + 60) + V(90, 100), h = size * 1.75;
  rr(g, x - w / 2, y - size * 0.95, w, h, 36); g.fillStyle = 'rgba(8,12,24,.62)'; g.fill();
  text(g, label, x, y - size * 0.62, { size: V(34, 40), font: 'Nunito', weight: 900, color: alpha(S().ui.cream, 0.9), spacing: 4, stroke: 6, strokeColor: 'rgba(0,0,0,.55)' });
  g.translate(x, y + size * 0.12); g.scale(pop, pop);
  text(g, value, 0, 0, { size, font: 'Nunito', weight: 900, color, glow: 22, glowColor: alpha(color, 0.7), stroke: 8, strokeColor: 'rgba(0,0,0,.5)' });
  g.restore();
}
