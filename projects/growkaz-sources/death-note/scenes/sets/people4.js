// sets/people4.js: the Zeigarnik cast. Custom hair, facial hair and accessories drawn over the stock rig.
import { E, V, circle, seg, poly, rr, glow, alpha, shade, text, ease, prog, measure } from '/engine/core.js';
import { drawFigure, headPos, bigFace, POSES } from '/engine/rig2d.js';

export const SC = () => V(1.9, 2.7);
export const FH = () => 290 * SC();
export const topOf = (gy, f) => gy - 0.92 * FH() * f;

export const OUT = {
  KIRA:     { top: 'suit', color: '#8a6a46', color2: '#f6f6fa', legs: '#2a2a34', head: 'none' },
  DET:      { top: 'suit', color: '#ececf2', color2: '#ececf2', legs: '#2a4a8a', head: 'none' },
  KAGE:     { top: 'tracksuit', color: '#ff7a1a', color2: '#1c2236', legs: '#ff7a1a', head: 'headband', headColor: '#1c2438' },
  YOU:      { top: 'hoodie', color: '#a78bfa', legs: '#2b2b45', head: 'none' },
  SAM:      { top: 'tshirt', color: '#ff8a3a', legs: '#2a4a8a', head: 'headband', headColor: '#2a4a8a' },
  LANDLORD: { top: 'suit', color: '#6a4a2a', color2: '#e8d8b0', legs: '#3a2a18', head: 'none', face: 'glasses' },
  DENTIST:  { top: 'labcoat', legs: '#8ac0d8', head: 'none', face: 'glasses' },
  MOM:      { top: 'dress', color: '#e07aa0', legs: '#e07aa0', head: 'none', face: 'glasses' },
  PLUMBER:  { top: 'tracksuit', color: '#2a6ac8', color2: '#ffd24a', legs: '#1c3a78', head: 'cap', headColor: '#d64a33' },
  WAITER:   { top: 'suit', color: '#15151c', color2: '#ffffff', legs: '#15151c', head: 'none' },
  WAITER2:  { top: 'suit', color: '#2a2a34', color2: '#ffffff', legs: '#2a2a34', head: 'none', face: 'glasses' },
  DOC:      { top: 'labcoat', legs: '#4a4a58', head: 'none', face: 'glasses' },
  P1:       { top: 'jersey', color: '#3a5ac8', color2: '#ffffff', number: '8', head: 'visor', headColor: '#ffffff', legs: '#222' },
  P2:       { top: 'trench', color: '#a35a2a', head: 'none', legs: '#222' },
};
export const DESIGN = {
  KIRA:     { hair: { style: 'sweep', color: '#7a4f30' }, extras: ['redtie', 'sharpbrow'] },
  DET:      { hair: { style: 'tuft', color: '#14141a' } },
  KAGE:     { hair: { style: 'spiky', color: '#ffd23a' }, extras: ['redscarf'] },
  YOU:      { hair: { style: 'tuft', color: '#3a2418' }, extras: ['totebag', 'freckles', 'coolcap'] },
  SAM:      { hair: { style: 'bob', color: '#3a2a1a' }, facial: 'beard', extras: ['earbuds'] },
  LANDLORD: { hair: { style: 'bald', color: '#8a8a94' }, facial: 'mustache', extras: ['bowtie'] },
  DENTIST:  { hair: { style: 'bun', color: '#6a2a3a' }, extras: ['mask'] },
  MOM:      { hair: { style: 'bun', color: '#c8c8d4' }, extras: ['necklace', 'cardigan'] },
  PLUMBER:  { hair: null, facial: 'mustache', extras: [] },
  WAITER:   { hair: { style: 'slick', color: '#1a1a22' }, facial: 'mustache', extras: ['bowtie'] },
  WAITER2:  { hair: { style: 'slick', color: '#6a6a74' }, extras: ['bowtie'] },
  DOC:      { hair: { style: 'neat', color: '#8a8a94' }, facial: 'beard', extras: [] },
  P1:       { hair: { style: 'neat', color: '#2a1a14' }, extras: [] },
  P2:       { hair: { style: 'long', color: '#2a1a14' }, extras: ['scarf'] },
};
const INK = '#07080c';

function hairBack(g, d, r) {
  if (!d) return; const c = d.color;
  if (d.style === 'long') { g.fillStyle = c; g.beginPath(); g.moveTo(-r * 0.2, -r * 0.95); g.bezierCurveTo(-r * 1.6, -r * 0.9, -r * 2.0, r * 1.5, -r * 1.25, r * 2.7); g.lineTo(-r * 0.1, r * 2.3); g.bezierCurveTo(-r * 0.55, r * 1.2, -r * 0.3, r * 0.2, -r * 0.2, -r * 0.95); g.fill(); }
  if (d.style === 'bob') { g.fillStyle = c; g.beginPath(); g.moveTo(-r * 0.2, -r * 0.9); g.bezierCurveTo(-r * 1.4, -r * 0.7, -r * 1.5, r * 0.9, -r * 0.9, r * 1.2); g.lineTo(-r * 0.2, r * 0.9); g.closePath(); g.fill(); }
}
function hairFront(g, d, r) {
  if (!d) return; const c = d.color;
  const cap = (k = 1.08) => { g.fillStyle = c; g.beginPath(); g.arc(0, 0, r * k, Math.PI * 1.02, Math.PI * 1.98); g.lineTo(r * 0.55, -r * 0.5); g.quadraticCurveTo(0, -r * 0.78, -r * 0.95, -r * 0.3); g.closePath(); g.fill(); };
  if (d.style === 'neat') { cap(); circle(g, r * 0.45, -r * 1.0, r * 0.4, c); seg(g, [[r * 0.05, -r * 0.95], [r * 0.85, -r * 0.7]], r * 0.07, shade(c, 0.25)); }
  if (d.style === 'slick') { cap(1.04); circle(g, -r * 0.85, 0, r * 0.22, c); seg(g, [[0, -r * 0.98], [r * 0.9, -r * 0.5]], r * 0.07, shade(c, 0.35)); }
  if (d.style === 'tuft') { circle(g, -r * 0.95, r * 0.1, r * 0.3, c); circle(g, -r * 0.85, r * 0.48, r * 0.25, c); circle(g, -r * 0.65, r * 0.7, r * 0.2, c); }
  if (d.style === 'bun') { cap(1.04); circle(g, -r * 0.55, -r * 1.2, r * 0.5, c); circle(g, -r * 0.55, -r * 1.2, r * 0.2, shade(c, 0.3)); }
  if (d.style === 'bob') { cap(); poly(g, [[r * 0.05, -r * 0.98], [r * 0.95, -r * 0.62], [r * 0.5, -r * 0.3]], c); }
  if (d.style === 'bald') { circle(g, -r * 0.9, r * 0.05, r * 0.2, c); circle(g, -r * 0.8, r * 0.38, r * 0.17, c); }
  if (d.style === 'sweep') { cap(1.05); poly(g, [[-r * 0.1, -r * 1.02], [r * 1.05, -r * 0.5], [r * 0.7, r * 0.02], [r * 0.3, -r * 0.3]], c); poly(g, [[r * 0.1, -r * 1.0], [r * 0.75, -r * 0.2], [r * 0.38, r * 0.12]], shade(c, 0.3)); poly(g, [[r * 0.9, -r * 0.55], [r * 1.02, -r * 0.05], [r * 0.9, r * 0.4]], c); poly(g, [[-r * 0.9, -r * 0.7], [-r * 1.15, -r * 0.1], [-r * 0.85, r * 0.2]], c); }
  if (d.style === 'spiky') { g.fillStyle = c; for (let i = 0; i < 6; i++) { const a = Math.PI * (1.08 + i * 0.16), x0 = Math.cos(a) * r * 0.95, y0 = Math.sin(a) * r * 0.95; poly(g, [[x0 - r * 0.2, y0 + r * 0.1], [Math.cos(a) * r * (1.55 + 0.15 * (i % 2)), Math.sin(a) * r * (1.55 + 0.15 * (i % 2)) - r * 0.1], [x0 + r * 0.2, y0 + r * 0.1]], c); } cap(1.0); }
  if (d.style === 'long') { cap(); poly(g, [[r * 0.1, -r * 0.98], [r * 1.0, -r * 0.62], [r * 0.55, -r * 0.3]], c); }
}
function facialBack(g, f, r) { if (f === 'beard') { g.fillStyle = '#4a2c18'; g.beginPath(); g.ellipse(r * 0.42, r * 0.95, r * 0.78, r * 0.62, 0, 0, Math.PI * 2); g.fill(); } }
function facialFront(g, f, r) {
  if (f === 'mustache') { g.fillStyle = '#4a2c18'; g.save(); g.translate(r * 0.42, r * 0.17); [[-r * 0.2, -0.3], [r * 0.2, 0.3]].forEach(([x, rot]) => { g.save(); g.translate(x, 0); g.rotate(rot); g.beginPath(); g.ellipse(0, 0, r * 0.26, r * 0.1, 0, 0, Math.PI * 2); g.fill(); g.restore(); }); g.restore(); }
  if (f === 'beard') { g.fillStyle = '#4a2c18'; g.beginPath(); g.moveTo(-r * 0.12, r * 0.28); g.quadraticCurveTo(-r * 0.05, r * 0.95, r * 0.42, r * 1.0); g.quadraticCurveTo(r * 0.95, r * 0.95, r * 1.0, r * 0.3); g.quadraticCurveTo(r * 0.72, r * 0.62, r * 0.4, r * 0.55); g.quadraticCurveTo(r * 0.1, r * 0.62, -r * 0.12, r * 0.28); g.fill(); }
}

// the cool snapback with the "pending" hourglass badge. badge 0..1 (1 = shown, <1 = popping away)
function coolCapSide(g, r, badge, t) {
  const C = '#1fb5c8', D = '#0e8a9a';
  g.save(); g.scale(1.12, 1.12);
  g.fillStyle = C; g.beginPath(); g.arc(0, -r * 0.05, r * 1.14, Math.PI, Math.PI * 2); g.lineTo(r * 1.14, -r * 0.32); g.lineTo(-r * 1.14, -r * 0.32); g.closePath(); g.fill();
  g.fillStyle = alpha('#ffffff', 0.22); g.beginPath(); g.moveTo(r * 0.15, -r * 1.16); g.lineTo(r * 1.13, -r * 0.42); g.lineTo(r * 1.13, -r * 0.32); g.lineTo(r * 0.15, -r * 0.34); g.closePath(); g.fill();
  seg(g, [[0, -r * 1.18], [0, -r * 0.34]], r * 0.06, alpha(D, 0.8)); seg(g, [[-r * 0.6, -r * 1.0], [-r * 0.5, -r * 0.34]], r * 0.05, alpha(D, 0.7));
  circle(g, 0, -r * 1.2, r * 0.1, '#ffffff');
  g.fillStyle = D; g.beginPath(); g.moveTo(r * 0.6, -r * 0.34); g.quadraticCurveTo(r * 1.9, -r * 0.5, r * 2.05, -r * 0.16); g.quadraticCurveTo(r * 1.5, -r * 0.02, r * 0.7, -r * 0.1); g.closePath(); g.fill();
  seg(g, [[r * 0.9, -r * 0.2], [r * 1.9, -r * 0.24]], r * 0.05, alpha('#ffffff', 0.6));
  g.fillStyle = D; g.fillRect(-r * 1.16, -r * 0.4, r * 0.22, r * 0.2); seg(g, [[-r * 1.12, -r * 0.3], [-r * 1.5, -r * 0.2]], r * 0.07, '#f4f4f4');
  if (badge > 0) {
    const bx = r * 0.62, by = -r * 0.78, k = badge, pulse = 1 + 0.06 * Math.sin(t * 5);
    g.save(); g.translate(bx, by); g.scale(k * pulse * 1.3, k * pulse * 1.3); glow(g, 0, 0, r * 1.1, '#ffb347', 0.5);
    circle(g, 0, 0, r * 0.42, '#fff7e0'); g.strokeStyle = '#ff8a2a'; g.lineWidth = r * 0.07; g.beginPath(); g.arc(0, 0, r * 0.42, 0, Math.PI * 2); g.stroke();
    g.rotate(Math.floor(t / 1.6) * Math.PI + ease.inOut(prog(t % 1.6, 1.3, 1.6)) * Math.PI);
    const w = r * 0.2, h = r * 0.27, lvl = 1 - ((t % 1.6) / 1.6) * 0.9;
    g.fillStyle = '#ffb347'; g.beginPath(); g.moveTo(-w * 0.85, -h * 0.05 - h * 0.9 * lvl); g.lineTo(w * 0.85, -h * 0.05 - h * 0.9 * lvl); g.lineTo(0, -h * 0.05); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-w * 0.85, h * 0.95); g.lineTo(w * 0.85, h * 0.95); g.lineTo(0, h * (0.95 - 0.9 * (1 - lvl))); g.closePath(); g.fill();
    g.strokeStyle = '#2a2418'; g.lineWidth = r * 0.045; g.beginPath(); g.moveTo(-w, -h); g.lineTo(w, -h); g.lineTo(0, 0); g.lineTo(w, h); g.lineTo(-w, h); g.lineTo(0, 0); g.closePath(); g.stroke(); seg(g, [[-w * 1.15, -h], [w * 1.15, -h]], r * 0.06, '#2a2418'); seg(g, [[-w * 1.15, h], [w * 1.15, h]], r * 0.06, '#2a2418');
    g.restore();
  } else if (badge === 0 && t < 0) {}
  g.restore();
}

function extrasBack(g, ex, r) {
  if (ex.includes('totebag')) { rr(g, -r * 1.6, r * 3.0, r * 1.5, r * 1.5, r * 0.15); g.fillStyle = '#f2c14e'; g.fill(); seg(g, [[-r * 1.3, r * 3.0], [-r * 0.9, r * 1.4]], r * 0.1, '#d9a42a'); }
}
function extrasFront(g, ex, r, st = {}) {
  if (ex.includes('coolcap')) coolCapSide(g, r, st.badge ?? 1, st.t || 0);
  if (ex.includes('totebag')) { seg(g, [[-r * 0.15, r * 1.3], [-r * 0.9, r * 3.3]], r * 0.14, '#d9a42a'); }
  if (ex.includes('freckles')) [[0.55, 0.15], [0.7, 0.22], [0.42, 0.22], [0.78, 0.12]].forEach(([x, y]) => circle(g, r * x, r * y, r * 0.035, '#c8845a'));
  if (ex.includes('sharpbrow')) { seg(g, [[-r * 0.12, -r * 0.46], [r * 0.3, -r * 0.32]], r * 0.09, '#3a2414'); seg(g, [[r * 0.5, -r * 0.32], [r * 0.9, -r * 0.44]], r * 0.09, '#3a2414'); }
  if (ex.includes('redtie')) { poly(g, [[r * 0.15, r * 1.3], [r * 0.55, r * 1.3], [r * 0.45, r * 2.8], [r * 0.3, r * 3.0], [r * 0.2, r * 2.8]], '#c8102e'); poly(g, [[r * 0.15, r * 1.3], [r * 0.55, r * 1.3], [r * 0.4, r * 1.55]], '#7a0a1c'); }
  if (ex.includes('bowtie')) { poly(g, [[r * 0.2, r * 1.35], [-r * 0.2, r * 1.15], [-r * 0.2, r * 1.55]], '#e94560'); poly(g, [[r * 0.2, r * 1.35], [r * 0.6, r * 1.15], [r * 0.6, r * 1.55]], '#e94560'); circle(g, r * 0.2, r * 1.35, r * 0.1, '#b82a44'); }
  if (ex.includes('scarf')) { g.fillStyle = '#e8c860'; g.beginPath(); g.ellipse(r * 0.2, r * 1.25, r * 0.7, r * 0.28, 0, 0, Math.PI * 2); g.fill(); rr(g, r * 0.0, r * 1.3, r * 0.3, r * 1.2, r * 0.08); g.fill(); }
  if (ex.includes('earbuds')) { circle(g, -r * 0.05, r * 0.35, r * 0.1, '#ffffff'); seg(g, [[-r * 0.05, r * 0.45], [-r * 0.25, r * 1.6], [r * 0.2, r * 2.4]], r * 0.04, '#e8e8f0'); }
  if (ex.includes('redscarf')) { const sw = Math.sin((st.t || 0) * 4) * r * 0.25; g.fillStyle = '#1fb5c8'; g.beginPath(); g.ellipse(r * 0.2, r * 1.25, r * 0.75, r * 0.3, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(-r * 0.2, r * 1.3); g.quadraticCurveTo(-r * 1.2, r * 1.2 + sw, -r * 2.2, r * 1.6 + sw * 1.5); g.lineTo(-r * 2.1, r * 1.95 + sw * 1.5); g.quadraticCurveTo(-r * 1.1, r * 1.6 + sw, -r * 0.1, r * 1.65); g.closePath(); g.fill(); }
  if (ex.includes('mask')) { g.fillStyle = '#bfe0f0'; g.beginPath(); g.moveTo(r * 0.0, r * 0.22); g.lineTo(r * 1.0, r * 0.22); g.lineTo(r * 0.9, r * 0.95); g.lineTo(r * 0.1, r * 0.95); g.closePath(); g.fill(); seg(g, [[0, r * 0.32], [r * 0.9, r * 0.32]], r * 0.04, '#8abbd4'); seg(g, [[0, r * 0.5], [-r * 0.2, r * 0.3]], r * 0.04, '#e8f4fa'); }
  if (ex.includes('necklace')) for (let i = 0; i < 7; i++) circle(g, r * (-0.15 + i * 0.12), r * (1.3 + 0.15 * Math.sin((i / 6) * Math.PI)), r * 0.07, '#f4f0e6');
  if (ex.includes('cardigan')) { seg(g, [[r * 0.1, r * 1.4], [r * 0.15, r * 3.6]], r * 0.07, '#f4d2e0'); }
}
function emoFx(g, emo, r, t = 0) {
  const ex = [r * 0.08, r * 0.66], ey = -r * 0.16;
  if (emo.includes('blush')) { g.save(); g.globalAlpha *= 0.7; g.fillStyle = '#ff6f91'; g.beginPath(); g.ellipse(r * 0.1, r * 0.2, r * 0.2, r * 0.12, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(r * 0.78, r * 0.2, r * 0.2, r * 0.12, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
  if (emo.includes('tired')) ex.forEach((x) => { g.strokeStyle = '#7a6a9a'; g.lineWidth = r * 0.05; g.beginPath(); g.arc(x, ey + r * 0.13, r * 0.18, 0.2, Math.PI - 0.2); g.stroke(); });
  if (emo.includes('bored')) ex.forEach((x) => { rr(g, x - r * 0.2, ey - r * 0.2, r * 0.4, r * 0.2, r * 0.05); g.fillStyle = INK; g.fill(); seg(g, [[x - r * 0.2, ey], [x + r * 0.2, ey]], r * 0.05, '#f4ecd8'); });
  if (emo.includes('hearts')) ex.forEach((x) => { g.save(); g.translate(x, ey); g.scale(r * 0.013, r * 0.013); g.fillStyle = '#ff5a7a'; g.beginPath(); g.moveTo(0, 14); g.bezierCurveTo(-30, -6, -16, -30, 0, -12); g.bezierCurveTo(16, -30, 30, -6, 0, 14); g.fill(); g.restore(); });
  if (emo.includes('dizzy')) ex.forEach((x) => { g.save(); g.translate(x, ey); g.rotate(t * 8); circle(g, 0, 0, r * 0.2, INK); g.strokeStyle = '#f4ecd8'; g.lineWidth = r * 0.04; g.beginPath(); for (let a = 0; a < 12; a += 0.3) g.lineTo(Math.cos(a) * r * 0.017 * a * 2.6, Math.sin(a) * r * 0.017 * a * 2.6); g.stroke(); g.restore(); });
  if (emo.includes('stars')) ex.forEach((x) => { g.save(); g.translate(x, ey); g.rotate(t * 2); for (let i = 0; i < 4; i++) { g.rotate(Math.PI / 4); seg(g, [[-r * 0.2, 0], [r * 0.2, 0]], r * 0.05, '#fff3b0'); } g.restore(); });
}

export function person(g, o) {
  const key = typeof o.who === 'string' ? o.who : null, of = key ? OUT[key] : o.who, s = o.s ?? SC(), fac = o.facing ?? 1, d = (key && DESIGN[key]) || {};
  const base = { x: o.x, y: o.y, s, facing: fac, outfit: of, pose: o.pose || POSES.stand, expr: o.expr || 'neutral', look: o.look, blink: o.blink, rim: o.rim, prop: o.prop, dim: o.dim, alpha: o.alpha, talk: o.talk };
  let hp; try { hp = headPos(base); } catch (e) { hp = null; }
  const [hx, hy, r] = hp || [o.x, o.y - 290 * s, 22 * s];
  const ex = d.extras || [], emo = o.emo || [];
  g.save(); g.globalAlpha *= (o.alpha ?? 1) * (o.dim ? 1 - o.dim * 0.6 : 1); g.translate(hx, hy); g.scale(fac, 1); hairBack(g, d.hair, r); facialBack(g, d.facial, r); extrasBack(g, ex, r); g.restore();
  drawFigure(g, base);
  g.save(); g.translate(hx, hy); g.scale(fac, 1);
  hairFront(g, d.hair, r); facialFront(g, d.facial, r); extrasFront(g, ex, r, { badge: o.capBadge ?? 1, t: o.t || 0 }); emoFx(g, emo, r, o.t || 0);
  g.restore();
  return [hx, hy, r];
}


function coolCapFront(g, r, badge, t) {
  const C = '#1fb5c8', D = '#0e8a9a';
  g.fillStyle = C; g.beginPath(); g.arc(0, -r * 0.1, r * 1.12, Math.PI * 1.02, Math.PI * 1.98); g.lineTo(r * 1.1, -r * 0.45); g.quadraticCurveTo(0, -r * 0.3, -r * 1.1, -r * 0.45); g.closePath(); g.fill();
  g.fillStyle = D; g.beginPath(); g.ellipse(0, -r * 0.5, r * 1.1, r * 0.22, 0, 0, Math.PI * 2); g.fill(); seg(g, [[-r * 0.9, -r * 0.5], [r * 0.9, -r * 0.5]], r * 0.04, alpha('#ffffff', 0.6));
  circle(g, 0, -r * 1.2, r * 0.1, '#ffffff'); seg(g, [[0, -r * 1.2], [0, -r * 0.7]], r * 0.05, alpha(D, 0.8));
  if (badge > 0) { const k = badge, pulse = 1 + 0.06 * Math.sin(t * 5); g.save(); g.translate(0, -r * 0.88); g.scale(k * pulse * 1.25, k * pulse * 1.25); glow(g, 0, 0, r * 1.0, '#ffb347', 0.5); circle(g, 0, 0, r * 0.34, '#fff7e0'); g.strokeStyle = '#ff8a2a'; g.lineWidth = r * 0.06; g.beginPath(); g.arc(0, 0, r * 0.34, 0, Math.PI * 2); g.stroke(); g.rotate(Math.floor(t / 1.6) * Math.PI + ease.inOut(prog(t % 1.6, 1.3, 1.6)) * Math.PI); const w = r * 0.16, h = r * 0.22, lvl = 1 - ((t % 1.6) / 1.6) * 0.9; g.fillStyle = '#ffb347'; g.beginPath(); g.moveTo(-w * 0.85, -h * 0.05 - h * 0.9 * lvl); g.lineTo(w * 0.85, -h * 0.05 - h * 0.9 * lvl); g.lineTo(0, -h * 0.05); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-w * 0.85, h * 0.95); g.lineTo(w * 0.85, h * 0.95); g.lineTo(0, h * (0.95 - 0.9 * (1 - lvl))); g.closePath(); g.fill(); g.strokeStyle = '#2a2418'; g.lineWidth = r * 0.04; g.beginPath(); g.moveTo(-w, -h); g.lineTo(w, -h); g.lineTo(0, 0); g.lineTo(w, h); g.lineTo(-w, h); g.lineTo(0, 0); g.closePath(); g.stroke(); g.restore(); }
}

export function closeUp(g, cx, cy, r, o) {
  const key = o.who, of = OUT[key], d = DESIGN[key] || {}, emo = o.emo || [];
  g.save(); g.translate(cx, cy); if (d.hair && d.hair.style === 'bob') circle(g, 0, r * 0.1, r * 1.35, d.hair.color); g.restore();
  bigFace(g, cx, cy, r, { outfit: of, expr: o.expr, blink: o.blink, look: o.look, rimColor: o.rimColor, rimSide: o.rimSide, tilt: o.tilt });
  g.save(); g.translate(cx, cy);
  if (o.who === 'YOU') coolCapFront(g, r, o.capBadge ?? 1, o.t || 0); else if (d.hair) { g.fillStyle = d.hair.color; g.beginPath(); g.arc(0, 0, r * 1.06, Math.PI * 1.04, Math.PI * 1.96); g.quadraticCurveTo(0, -r * 0.62, -r * 0.98, -r * 0.2); g.closePath(); g.fill(); }
  const exs = [-r * 0.34, r * 0.34], ey = -r * 0.16;
  if (emo.includes('tired')) exs.forEach((x) => { g.strokeStyle = '#7a6a9a'; g.lineWidth = r * 0.05; g.beginPath(); g.arc(x, ey + r * 0.14, r * 0.2, 0.2, Math.PI - 0.2); g.stroke(); });
  if (emo.includes('dizzy')) exs.forEach((x) => { g.save(); g.translate(x, ey); g.rotate((o.t || 0) * 8); circle(g, 0, 0, r * 0.2, INK); g.strokeStyle = '#f4ecd8'; g.lineWidth = r * 0.04; g.beginPath(); for (let a = 0; a < 12; a += 0.3) g.lineTo(Math.cos(a) * r * 0.017 * a * 2.6, Math.sin(a) * r * 0.017 * a * 2.6); g.stroke(); g.restore(); });
  if (emo.includes('hearts')) exs.forEach((x) => { g.save(); g.translate(x, ey); g.scale(r * 0.014, r * 0.014); g.fillStyle = '#ff5a7a'; g.beginPath(); g.moveTo(0, 14); g.bezierCurveTo(-30, -6, -16, -30, 0, -12); g.bezierCurveTo(16, -30, 30, -6, 0, 14); g.fill(); g.restore(); });
  if (emo.includes('blush')) { g.save(); g.globalAlpha *= 0.7; g.fillStyle = '#ff6f91'; exs.forEach((x) => { g.beginPath(); g.ellipse(x * 1.35, r * 0.2, r * 0.2, r * 0.12, 0, 0, Math.PI * 2); g.fill(); }); g.restore(); }
  g.restore();
}

// a sticky note. rot in radians; state: 'red' (open), 'blue' (planned)
const LINES = (str) => { const w = str.split(' '); if (w.length < 2) return [str]; const mid = Math.ceil(w.length / 2); return [w.slice(0, mid).join(' '), w.slice(mid).join(' ')]; };
export function note(g, x, y, str, o = {}) {
  const { w = 250, h = 190, rot = 0, a = 1, scale = 1, color = '#ffe27a', planned = 0, size = 38, glowOn = true } = o;
  if (a <= 0 || scale <= 0) return;
  const col = planned > 0.5 ? '#9ad0ff' : color;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot); g.scale(scale, scale);
  if (glowOn) glow(g, 0, 0, w * 0.9, planned > 0.5 ? '#7fc4ff' : '#ff5a4a', planned > 0.5 ? 0.12 : 0.22);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-w / 2 + 8, -h / 2 + 10, w, h);
  g.fillStyle = col; g.fillRect(-w / 2, -h / 2, w, h); poly(g, [[w / 2 - 36, h / 2], [w / 2, h / 2 - 36], [w / 2, h / 2]], shade(col, -0.18));
  g.fillStyle = alpha('#fff', 0.5); g.fillRect(-34, -h / 2 - 12, 68, 24);
  const ls = LINES(str); ls.forEach((l, i) => text(g, l, 0, (i - (ls.length - 1) / 2) * (size * 1.15) + 6, { size, font: 'Nunito', weight: 900, color: '#2a2418' }));
  if (planned > 0.5) { seg(g, [[-w / 2 + 22, h / 2 - 28], [-w / 2 + 44, h / 2 - 10], [-w / 2 + 84, h / 2 - 48]], 9, '#1f7a3a'); }
  g.restore();
}
