// sets/hero.js: the hero in four original looks, plus little emotion marks (!, ?, zzz, sweat, sparkle).
//  A = pre-AI: purple hoodie + big headphones
//  B = AI power look: white blazer, purple tie, glowing visor, flowing violet cape
//  C = stranded in the rain: long violet trench, hood up
//  D = the bare look: same trench, hood down
import { E, V, circle, seg, poly, rr, glow, alpha, shade, text, ease, prog } from '/engine/core.js';
import { drawFigure, headPos, POSES } from '/engine/rig2d.js';

export const SC = () => V(1.9, 2.7);
export const FH = () => 290 * SC();

export const OUTFIT = {
  A: { top: 'hoodie', color: '#8a5ad6', head: 'none', legs: '#2b2b3a' },
  B: { top: 'suit', color: '#f1f4fb', color2: '#8a5ad6', head: 'none', legs: '#1c2536' },
  C: { top: 'trench', color: '#4a3a7a', head: 'hood', headColor: '#2f2458', legs: '#14111f' },
  D: { top: 'trench', color: '#4a3a7a', head: 'none', legs: '#14111f' },
};

export function hero(g, o) {
  const v = o.variant || 'A', of = OUTFIT[v], s = o.s ?? SC(), fac = o.facing ?? 1, t = o.t || 0;
  const base = { x: o.x, y: o.y, s, facing: fac, outfit: of, pose: o.pose || POSES.stand, expr: o.expr || 'neutral', look: o.look, blink: o.blink, rim: o.rim, prop: o.prop, dim: o.dim, alpha: o.alpha, talk: o.talk };
  let hp; try { hp = headPos(base); } catch (e) { hp = null; }
  const [hx, hy, r] = hp || [o.x, o.y - 290 * s, 22 * s];
  g.save();
  if (v === 'B') {   // cape flows behind the hero
    g.save(); g.translate(hx, hy); g.scale(fac, 1);
    const sway = Math.sin(t * 2.2) * r * 0.5;
    g.fillStyle = '#6d3fc4'; g.beginPath(); g.moveTo(-r * 0.2, r * 1.5); g.lineTo(-r * 0.8, r * 1.7); g.quadraticCurveTo(-r * 2.4 + sway, r * 4.2, -r * 3.1 + sway * 1.4, r * 6.4); g.lineTo(-r * 0.3, r * 6.6); g.quadraticCurveTo(-r * 0.9, r * 4, -r * 0.2, r * 1.5); g.fill();
    g.strokeStyle = alpha('#9fe8ff', 0.7); g.lineWidth = r * 0.06; g.beginPath(); g.moveTo(-r * 0.8, r * 1.7); g.quadraticCurveTo(-r * 2.4 + sway, r * 4.2, -r * 3.1 + sway * 1.4, r * 6.4); g.stroke();
    g.restore();
  }
  drawFigure(g, base);
  g.save(); g.translate(hx, hy); g.scale(fac, 1);
  if (v === 'A') {   // headphones: band over the head, big ear cup with a cyan ring
    g.strokeStyle = '#15121f'; g.lineWidth = r * 0.2; g.lineCap = 'round'; g.beginPath(); g.arc(0, 0, r * 1.12, Math.PI * 1.02, Math.PI * 1.98); g.stroke();
    circle(g, -r * 0.05, r * 0.12, r * 0.42, '#15121f'); g.strokeStyle = '#7fe3ff'; g.lineWidth = r * 0.07; g.beginPath(); g.arc(-r * 0.05, r * 0.12, r * 0.3, 0, Math.PI * 2); g.stroke();
  }
  if (v === 'B') {   // smart visor across the eyes
    const f = 0.75 + 0.25 * Math.sin(t * 6);
    glow(g, r * 0.45, -r * 0.2, r * 1.2, '#7fe3ff', 0.35 * f);
    rr(g, r * 0.0, -r * 0.38, r * 0.98, r * 0.3, r * 0.12); g.fillStyle = alpha('#7fe3ff', 0.55); g.fill(); g.strokeStyle = '#d6f6ff'; g.lineWidth = r * 0.05; g.stroke();
    seg(g, [[-r * 0.05, -r * 0.24], [-r * 0.6, -r * 0.3]], r * 0.07, '#d6f6ff');
  }
  if (v === 'C' || v === 'D') {   // rain-soaked collar shine
    g.strokeStyle = alpha('#b8a8ff', 0.5); g.lineWidth = r * 0.05; g.beginPath(); g.arc(-r * 0.1, r * 1.3, r * 0.75, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
  }
  g.restore();
  g.restore();
  return [hx, hy, r];
}

// emotion marks that pop beside a head
export function mark(g, kind, x, y, t, at = 0, o = {}) {
  const k = ease.outBack(prog(t, at, at + 0.25)); if (k <= 0) return;
  const a = o.fade ? 1 - prog(t, at + o.fade, at + o.fade + 0.3) : 1; if (a <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k); g.globalAlpha *= a;
  const col = o.color || '#ffe27a', sz = o.size || 120;
  if (kind === '!' || kind === '?') text(g, kind, 0, 0, { size: sz, font: 'Nunito', weight: 900, color: col, glow: 18, glowColor: alpha(col, 0.8), stroke: 10, strokeColor: 'rgba(0,0,0,.65)' });
  if (kind === 'zzz') { ['Z', 'z', 'z'].forEach((c, i) => text(g, c, i * 34, -i * 40 - 6 * Math.sin(t * 2 + i), { size: sz * (0.7 - i * 0.14), font: 'Nunito', weight: 900, color: '#bcd0ff', stroke: 7, strokeColor: 'rgba(0,0,0,.6)' })); }
  if (kind === 'sparkle') { for (let i = 0; i < 3; i++) { const a2 = t * 3 + i * 2.1, px = Math.cos(a2) * 60, py = Math.sin(a2) * 40 - i * 20; seg(g, [[px - 14, py], [px + 14, py]], 5, '#fff7c2'); seg(g, [[px, py - 14], [px, py + 14]], 5, '#fff7c2'); } }
  if (kind === 'sweat') { for (let i = 0; i < 2; i++) { const yy = (t * 160 + i * 70) % 140; g.fillStyle = '#9fd8ff'; g.beginPath(); g.ellipse(i * 34, yy - 20, 9, 14, 0, 0, Math.PI * 2); g.fill(); } }
  g.restore();
}
