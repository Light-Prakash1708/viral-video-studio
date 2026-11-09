// sets/cine.js: 2D overlays + simple 2D sets for the bystander film.
import { E, V, mood, layer, backdrop, rr, seg, circle, glow, alpha, shade, mix, linGrad, text, ease, prog, clamp, lerp, rng, S } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const GY = () => E.H * V(0.8, 0.68);

// big clear word on a dark pill
export function word(g, str, y, a = 1, o = {}) {
  if (a <= 0) return;
  const { size = V(92, 104), color = '#fff1dc', sub = null, scale = 1 } = o;
  g.save(); g.globalAlpha *= clamp(a); g.translate(E.W / 2, y); g.scale(scale, scale);
  g.font = `700 ${size}px "Fredoka"`; let mw = g.measureText(str).width;
  if (sub) { g.font = `800 ${size * 0.36}px "Nunito"`; mw = Math.max(mw, g.measureText(sub).width * 1.15); }
  const w = Math.min(E.W * 0.95, mw + size * 1.1), h = size * (sub ? 2.1 : 1.45);
  rr(g, -w / 2, -size * 0.78, w, h, size * 0.4); g.fillStyle = 'rgba(6,10,14,.72)'; g.fill();
  text(g, str, 0, 0, { size, color, glow: 16, glowColor: alpha(color, 0.55), spacing: 3 });
  if (sub) text(g, sub, 0, size * 0.82, { size: size * 0.36, font: 'Nunito', weight: 800, color: '#c8d4dc', spacing: 4 });
  g.restore();
}
// security-camera look over whatever is underneath
export function cctv(g, t, stamp = '11/05/2026  08:14:', o = {}) {
  const { cam = 'CAM 04 · PLATFORM 2' } = o;
  g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = 'rgba(128,128,128,.85)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(150,200,170,1)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  for (let y = 0; y < E.H; y += 6) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, y, E.W, 2); }
  const band = (t * 380) % (E.H + 200) - 100; g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(0, band, E.W, 90);
  const m = V(60, 70);
  seg(g, [[m, m + 80], [m, m], [m + 80, m]], 5, 'rgba(220,255,230,.8)'); seg(g, [[E.W - m - 80, m], [E.W - m, m], [E.W - m, m + 80]], 5, 'rgba(220,255,230,.8)');
  seg(g, [[m, E.H - m - 80], [m, E.H - m], [m + 80, E.H - m]], 5, 'rgba(220,255,230,.8)'); seg(g, [[E.W - m - 80, E.H - m], [E.W - m, E.H - m], [E.W - m, E.H - m - 80]], 5, 'rgba(220,255,230,.8)');
  if (Math.floor(t * 2) % 2 === 0) circle(g, m + 40, m + 130, 14, '#ff3b30');
  text(g, 'REC', m + 100, m + 132, { size: 34, font: 'Nunito', weight: 900, color: '#e8ffe8', align: 'left' });
  text(g, cam, E.W - m - 20, m + 132, { size: 28, font: 'Nunito', weight: 800, color: '#e8ffe8', align: 'right' });
  const sec = String(Math.floor(30 + t) % 60).padStart(2, '0');
  text(g, stamp + sec, m + 20, E.H - m - 40, { size: 30, font: 'Nunito', weight: 800, color: '#e8ffe8', align: 'left' });
}
// thought bubble with text
export function thought(g, x, y, str, a = 1, o = {}) {
  if (a <= 0) return;
  const { size = V(34, 40) } = o;
  g.save(); g.globalAlpha *= clamp(a); g.font = `800 ${size}px "Nunito"`; const w = g.measureText(str).width + size * 1.4, h = size * 2;
  rr(g, x - w / 2, y - h / 2, w, h, h / 2); g.fillStyle = 'rgba(240,244,246,.95)'; g.fill();
  circle(g, x - w * 0.18, y + h * 0.7, size * 0.3, 'rgba(240,244,246,.95)'); circle(g, x - w * 0.24, y + h * 1.05, size * 0.18, 'rgba(240,244,246,.95)');
  text(g, str, x, y + 2, { size, font: 'Nunito', weight: 800, color: '#22262c' });
  g.restore();
}
// research lab / cubicle booths
export function lab(g, t, cam, o = {}) {
  const M = mood('interiorCool'), gy = GY();
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, gy, [shade(M.wall, -0.35), shade(M.wall, -0.05)]); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    FX.windowFrame(g, { x: E.W / 2 - V(600, 440), y: gy - V(760, 980), w: 300, h: 380, cols: 2, rows: 2, frame: shade(M.wall, -0.5), bar: 9, blinds: 8 }, (g, x, y, w, h) => backdrop(g, mood('night').sky, [x, y, w, h]));
    FX.godRays(g, E.W / 2 - V(450, 290), gy - V(700, 920), { count: 4, len: V(1000, 1300), color: M.key, a: 0.05, angle: Math.PI * 0.6 });
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 500, [shade(M.floor, 0.05), shade(M.dark, -0.3)]); g.fillRect(-E.W, gy, E.W * 3, E.H * 2); });
  return { M, GY: gy };
}
// a soundproof booth with a person and an intercom; returns nothing
export function booth(g, x, gy, s, o = {}) {
  const { lit = 0.6, label = null } = o;
  g.save(); g.translate(x, gy); g.scale(s, s);
  rr(g, -150, -420, 300, 420, 14); g.fillStyle = '#1a2a34'; g.fill(); g.strokeStyle = 'rgba(160,220,240,.35)'; g.lineWidth = 4; g.stroke();
  glow(g, 0, -300, 220, '#9fe0ff', 0.25 * lit);
  rr(g, 60, -330, 60, 80, 10); g.fillStyle = '#3a4a54'; g.fill(); for (let i = 0; i < 4; i++) seg(g, [[70, -315 + i * 16], [110, -315 + i * 16]], 3, '#1a2228');
  g.restore();
  if (label) text(g, label, x, gy + 40 * s, { size: V(28, 32), font: 'Nunito', weight: 900, color: '#c8e8f4', spacing: 2 });
}
