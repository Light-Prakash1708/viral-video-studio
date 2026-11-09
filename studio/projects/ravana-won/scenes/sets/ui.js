// sets/ui.js: shared overlay helpers for the Ravana film (text bands, word-time helper, gold title text, saturation drain).
import { E, V, wordTime, clamp, ease, prog, text, alpha, rr, measure } from '/engine/core.js';

// seconds into the current shot when `w` is spoken (searching from just before the shot start)
export const local = (info, t, w, after = 0) => { const x = wordTime(w, info.globalT - t - 0.3 + after); return x == null ? null : x - (info.globalT - t); };
export const at = (info, t, w, fb) => local(info, t, w) ?? fb;
// dark gradient band behind top text (keeps titles off the picture)
export function topBand(g, a = 1, h = 0.3) { if (a <= 0) return; g.save(); const gr = g.createLinearGradient(0, 0, 0, E.H * h); gr.addColorStop(0, `rgba(2,3,10,${0.78 * a})`); gr.addColorStop(1, 'rgba(2,3,10,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H * h); g.restore(); }
export function botBand(g, a = 1, h = 0.28) { if (a <= 0) return; g.save(); const gr = g.createLinearGradient(0, E.H * (1 - h), 0, E.H); gr.addColorStop(0, 'rgba(2,3,10,0)'); gr.addColorStop(1, `rgba(2,3,10,${0.8 * a})`); g.fillStyle = gr; g.fillRect(0, E.H * (1 - h), E.W, E.H * h); g.restore(); }
// elegant gold headline (no pill): label small above, big title below
export function headline(g, str, y, a = 1, o = {}) {
  if (a <= 0) return; const { size = 76, color = '#ffd27a', sub = null, subColor = '#f4e6cc', x = E.W / 2, align = 'center', spacing = 6, scale = 1 } = o;
  if (sub && y < E.H * 0.15) y = E.H * 0.15;
  g.save(); g.globalAlpha *= clamp(a); g.translate(x, y); g.scale(scale, scale);
  let sz = size; const mw = measure(g, str, sz, 'Fredoka', 700) + str.length * spacing; if (mw > E.W * 0.88) sz *= (E.W * 0.88) / mw;
  if (sub) text(g, sub, 0, -sz * 0.95, { size: Math.max(26, sz * 0.36), font: 'Nunito', weight: 900, color: subColor, spacing: 6, align, stroke: 6, strokeColor: 'rgba(0,0,0,.5)' });
  text(g, str, 0, 0, { size: sz, color, glow: 26, glowColor: alpha(color, 0.65), spacing, align, stroke: 5, strokeColor: 'rgba(20,10,0,.55)' });
  g.restore();
}
// drain colour (desaturate the frame underneath) amount 0..1
export function drain(g, k, tint = null) {
  if (k <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'saturation'; g.fillStyle = `rgba(128,128,128,${clamp(k)})`; g.fillRect(0, 0, g.canvas.width, g.canvas.height);
  if (tint) { g.globalCompositeOperation = 'multiply'; g.fillStyle = tint; g.globalAlpha = clamp(k); g.fillRect(0, 0, g.canvas.width, g.canvas.height); }
  g.restore();
}
// small chip label with a coloured dot (used for ministries / tags)
export function chip(g, str, x, y, a = 1, o = {}) {
  if (a <= 0) return; const { color = '#ffd27a', size = 40 } = o; g.save(); g.globalAlpha *= clamp(a);
  const w = measure(g, str, size, 'Nunito', 900) + size * 2.2 + str.length * 3, h = size * 1.7; rr(g, x - w / 2, y - h / 2, w, h, h / 2); g.fillStyle = 'rgba(6,8,18,.72)'; g.fill(); g.strokeStyle = alpha(color, 0.8); g.lineWidth = 3; g.stroke();
  g.fillStyle = color; g.beginPath(); g.arc(x - w / 2 + h * 0.55, y, size * 0.26, 0, 7); g.fill();
  text(g, str, x + size * 0.35, y + 2, { size, font: 'Nunito', weight: 900, color: '#fff6e4', spacing: 3 }); g.restore();
}
