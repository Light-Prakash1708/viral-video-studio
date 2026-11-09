// sets/paint2d.js: painted 2D illustration kit (quality bar: top 2D history channels): atmospheric layered skies + skylines,
// additive glows, painted wood/paper, lit characters (shade side + warm rim + contact shadow), chunky outlined headlines.
import { E, clamp, lerp, ease, rng } from '/engine/core.js';
import { drawBean, PLUM } from './bean.js';
const TAU = Math.PI * 2;
export const W = () => E.W, H = () => E.H;
export function grad(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; }
export function glow(g, x, y, r, col, a = 1) { if (a <= 0) return; g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = a; const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); }
export function softCloud(g, x, y, s, col, a = 0.9) { g.save(); g.globalAlpha = a; g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 30 * s; for (const [dx, dy, r] of [[-90, 10, 50], [-40, -22, 70], [30, -12, 62], [90, 12, 46], [0, 22, 66]]) { g.beginPath(); g.arc(x + dx * s, y + dy * s, r * s, 0, TAU); g.fill(); } g.restore(); }
export function sky(g, stops, o = {}) { const w = W(), h = H(); g.fillStyle = grad(g, 0, 0, 0, o.h || h * 0.7, stops); g.fillRect(0, 0, w, h); if (o.sun) { glow(g, o.sun[0], o.sun[1], o.sun[2] || 420, o.sunCol || 'rgba(255,220,150,.9)', 0.9); g.save(); g.beginPath(); g.arc(o.sun[0], o.sun[1], (o.sun[2] || 420) * 0.17, 0, TAU); g.fillStyle = o.discCol || '#fff2c8'; g.fill(); g.restore(); }
  if (o.clouds) { const R = rng(o.seed || 3); for (let i = 0; i < o.clouds; i++) softCloud(g, ((R() * w * 1.4 + (o.t || 0) * 12 * (0.5 + R())) % (w * 1.4)) - w * 0.2, h * (0.06 + R() * 0.28), 0.7 + R() * 0.9, o.cloudCol || '#ffe6c8', 0.55 + R() * 0.3); }
  if (o.stars) { const R = rng(9); g.fillStyle = '#fff'; for (let i = 0; i < o.stars; i++) { g.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin((o.t || 0) * 1.5 + i)); g.fillRect(R() * w, R() * h * 0.45, 3, 3); } g.globalAlpha = 1; } }
// a skyline silhouette layer (depth 0 far .. 1 near): haze-tinted, window glows on near layers
export function skyline(g, baseY, col, o = {}) { const w = W(), R = rng(o.seed || 4), sc = o.scale || 1; let x = -50 - (o.off || 0) % 200;
  while (x < w + 50) { const bw = (60 + R() * 120) * sc, bh = (120 + R() * 320) * sc * (o.tall || 1); g.fillStyle = col; g.fillRect(x, baseY - bh, bw, bh + 4);
    if (R() < 0.25) { g.beginPath(); g.moveTo(x, baseY - bh); g.lineTo(x + bw / 2, baseY - bh - 50 * sc); g.lineTo(x + bw, baseY - bh); g.fill(); }
    if (R() < 0.12) { g.fillRect(x + bw * 0.4, baseY - bh - 70 * sc, bw * 0.2, 70 * sc); }
    if (o.windows) for (let yy = baseY - bh + 20 * sc; yy < baseY - 30 * sc; yy += 34 * sc) for (let xx = x + 12 * sc; xx < x + bw - 16 * sc; xx += 26 * sc) { if (R() < o.windows) { g.fillStyle = 'rgba(255,200,110,.18)'; g.fillRect(xx - 5 * sc, yy - 5 * sc, 22 * sc, 28 * sc); g.fillStyle = o.winCol || '#ffd27a'; g.fillRect(xx, yy, 12 * sc, 18 * sc); g.fillStyle = col; } }
    x += bw + (4 + R() * 10) * sc; } }
export function dome(g, x, baseY, s, col, gold = '#e8b840') { g.fillStyle = col; g.fillRect(x - 160 * s, baseY - 260 * s, 320 * s, 260 * s); g.beginPath(); g.arc(x, baseY - 260 * s, 120 * s, Math.PI, 0); g.fillStyle = gold; g.fill(); g.fillStyle = col; g.fillRect(x - 8 * s, baseY - 430 * s, 16 * s, 60 * s); for (let i = 0; i < 6; i++) g.fillRect(x - 140 * s + i * 52 * s, baseY - 240 * s, 22 * s, 240 * s); }
// painted wood surface
export function woodPanel(g, x, y, w, h, base = '#6a3e24', seed = 2) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = base; g.fillRect(x, y, w, h); const R = rng(seed); for (let i = 0; i < 90; i++) { const yy = y + R() * h; g.strokeStyle = `rgba(${R() < 0.5 ? '0,0,0' : '255,220,170'},${0.04 + R() * 0.07})`; g.lineWidth = 1 + R() * 4; g.beginPath(); g.moveTo(x, yy); g.bezierCurveTo(x + w * 0.3, yy + (R() - 0.5) * 30, x + w * 0.7, yy + (R() - 0.5) * 30, x + w, yy); g.stroke(); } g.restore(); }
export function vignette(g, a = 0.5, col = '8,4,0') { const w = W(), h = H(), v = g.createRadialGradient(w / 2, h * 0.45, h * 0.25, w / 2, h * 0.5, h * 0.78); v.addColorStop(0, `rgba(${col},0)`); v.addColorStop(1, `rgba(${col},${a})`); g.fillStyle = v; g.fillRect(0, 0, w, h); }
export function lightRays(g, x, y, ang, spread, len, col, a = 0.18) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const a0 = ang - spread / 2 + (i / 4) * spread; g.globalAlpha = a * (0.6 + 0.4 * Math.sin(i * 2.1)); g.fillStyle = grad(g, x, y, x + Math.cos(a0) * len, y + Math.sin(a0) * len, [[0, col], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a0 - 0.05) * len, y + Math.sin(a0 - 0.05) * len); g.lineTo(x + Math.cos(a0 + 0.05) * len, y + Math.sin(a0 + 0.05) * len); g.closePath(); g.fill(); } g.restore(); }
// lit character: draw to an offscreen layer, shade the far side, add a warm rim on the light side, contact shadow underneath
const _off = {}; function layer(w, h) { const k = w + 'x' + h; if (!_off[k]) { const c = document.createElement('canvas'); c.width = w; c.height = h; _off[k] = c; } return _off[k]; }
export function litChar(g, x, y, s, cast, pose, o = {}) { const w = Math.ceil(900 * s), h = Math.ceil(1200 * s), c = layer(w, h), cg = c.getContext('2d'); cg.clearRect(0, 0, w, h);
  drawBean(cg, w / 2, h - 30 * s, s, cast, pose); const L = o.light ?? -1; // -1 light from left, +1 from right
  cg.save(); cg.globalCompositeOperation = 'source-atop'; cg.fillStyle = grad(cg, L < 0 ? 0 : w, 0, L < 0 ? w : 0, 0, [[0, 'rgba(0,0,0,0)'], [0.55, 'rgba(0,0,0,0)'], [1, o.shade || 'rgba(30,10,40,.28)']]); cg.fillRect(0, 0, w, h);
  cg.fillStyle = grad(cg, L < 0 ? 0 : w, 0, L < 0 ? w * 0.4 : w * 0.6, 0, [[0, o.rim || 'rgba(255,190,110,.35)'], [1, 'rgba(255,190,110,0)']]); cg.fillRect(0, 0, w, h); cg.restore();
  if (o.shadow !== false) { g.save(); g.globalAlpha = 0.35; g.fillStyle = '#100808'; g.beginPath(); g.ellipse(x, y - 4, 150 * s, 26 * s, 0, 0, TAU); g.fill(); g.restore(); }
  g.drawImage(c, x - w / 2, y - h + 30 * s); }
// chunky outlined headline (reference style: huge white words, thick dark outline, drop shadow), word-by-word pop
export function headline(g, lines, x, y, size, t0, t, o = {}) { let k = 0; g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  lines.forEach((ln, li) => { const words = ln.split(' '); g.font = `900 ${size}px Nunito`; const total = g.measureText(ln).width; let cx = x - total / 2;
    words.forEach((wd) => { const ww = g.measureText(wd + ' ').width, a = ease.outBack(clamp((t - t0 - k * (o.step || 0.12)) / 0.28)); k++; if (a > 0) { const wx = cx + g.measureText(wd).width / 2, wy = y + li * size * 1.05; g.save(); g.translate(wx, wy); g.scale(a, a); g.rotate((1 - Math.min(1, a)) * -0.2);
        g.fillStyle = 'rgba(0,0,0,.45)'; g.fillText(wd, 6, 10); g.lineWidth = size * 0.2; g.strokeStyle = o.ink || '#14100c'; g.strokeText(wd, 0, 0); g.fillStyle = o.col && o.col[wd] ? o.col[wd] : (o.fill || '#ffffff'); g.fillText(wd, 0, 0); g.restore(); } cx += ww; }); });
  g.restore(); }
// a detailed banknote with flutter
export function note(g, x, y, s, rot, val = '100', flip = 1) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(flip, 1); g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.roundRect(-104 * s, -42 * s, 220 * s, 96 * s, 8 * s); g.fill();
  g.fillStyle = grad(g, -110 * s, 0, 110 * s, 0, [[0, '#a8d898'], [0.5, '#c8ecb8'], [1, '#98c888']]); g.beginPath(); g.roundRect(-110 * s, -48 * s, 220 * s, 96 * s, 8 * s); g.fill(); g.lineWidth = 5 * s; g.strokeStyle = '#2a5a2a'; g.stroke();
  g.lineWidth = 1.5 * s; g.strokeStyle = 'rgba(42,90,42,.7)'; for (let i = 0; i < 6; i++) { g.beginPath(); for (let a = 0; a <= TAU + 0.01; a += 0.2) { const r = (14 + i * 3) * s * (1 + 0.15 * Math.sin(a * 8)); g.lineTo(-62 * s + Math.cos(a) * r, Math.sin(a) * r); } g.stroke(); }
  g.beginPath(); g.ellipse(36 * s, 0, 26 * s, 32 * s, 0, 0, TAU); g.fillStyle = '#e8f6dc'; g.fill(); g.stroke(); g.fillStyle = '#2a5a2a'; g.font = `900 ${26 * s}px "Playfair Display"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(val, 36 * s, 2 * s); g.font = `900 ${18 * s}px "Playfair Display"`; g.fillText(val, 86 * s, -30 * s); g.fillText(val, -88 * s, 30 * s); g.restore(); }
// simple 2D particles with gravity (deterministic by seed): returns positions for time u since spawn
export function burstParticles(n, seed, o = {}) { const R = rng(seed); return Array.from({ length: n }, () => ({ vx: (R() - 0.5) * (o.spread || 900), vy: -(o.up || 600) - R() * (o.upVar || 600), rot: R() * TAU, vr: (R() - 0.5) * 10, s: 0.5 + R() * 0.6, delay: R() * (o.delay || 0.2), drag: 0.6 + R() * 0.4 })); }
export function particleAt(p, u, floorY, g0 = 1800) { const tt = Math.max(0, u - p.delay); const x = p.vx * tt * p.drag, y0 = p.vy * tt + 0.5 * g0 * tt * tt; return { x, y: Math.min(y0, floorY), rot: p.rot + p.vr * tt, on: u > p.delay, landed: y0 >= floorY }; }
