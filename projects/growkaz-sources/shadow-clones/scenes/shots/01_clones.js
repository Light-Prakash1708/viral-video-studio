// shots/01_clones.js: "Shadow Clones Would Break Your Brain" (working memory). Original ninja hero; text sits on plates in a clear top band.
import { E, V, measure, registerShot, layer, veil, ease, prog, clamp, lerp, wordTime, seg, circle, ring, rr, glow, alpha, text, poly, rng } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { brainLoop } from '../sets/places4.js';
import { person, SC, FH, topOf } from '../sets/people4.js';
import { mark } from '../sets/hero.js';

const local = (info, t, word, d = null) => { const w = wordTime(word, info.globalT - t - 0.3); return w == null ? d : w - (info.globalT - t); };
const GOLD = '#ffd98a', RED = '#ff5a4a', CY = '#7fe3ff', CREAM = '#f4ecd8', GREEN = '#7dff9a';
const ZT = () => E.H * 0.14, GYN = () => E.H * 0.7;
const pop = (t, a, b = 0.3) => ease.outBack(prog(t, a, a + b));
const RIM = { color: '#9fe8ff', dir: [0.5, -0.8], w: 4 }, CLONE = { color: '#7fe3ff', dir: [0.5, -0.8], w: 6 };
const label = (g, str, x, y, o = {}) => { const sz = o.size || 78, w = measure(g, str, sz, 'Nunito', 900) + 70; g.save(); g.globalAlpha *= 0.68; rr(g, x - w / 2, y - sz * 0.68, w, sz * 1.36, sz * 0.4); g.fillStyle = '#080c16'; g.fill(); g.restore(); text(g, str, x, y, { size: sz, font: 'Nunito', weight: 900, color: '#fff', stroke: 10, strokeColor: 'rgba(0,0,0,.7)', glow: 12, glowColor: 'rgba(255,255,255,.3)', ...o }); };
const L = (g, t, at, str, o = {}) => { const k = pop(t, at, 0.35); if (k > 0) { g.save(); g.translate(E.W / 2, o.y ?? ZT()); g.scale(k, k); label(g, str, 0, 0, o); g.restore(); } };
const puff = (g, x, y, t, at) => { const k = prog(t, at, at + 0.7); if (k <= 0 || k >= 1) return; for (let i = 0; i < 9; i++) { const a = i * 0.7, r = 40 + 90 * k; circle(g, x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.5 - 30 * k, 36 + 30 * k, `rgba(235,240,255,${0.8 * (1 - k)})`); } };

// original night dojo: moon, bamboo, lanterns, wooden floor
function dojo(g, t, dim = 0) {
  const gy = GYN(); g.fillStyle = (() => { const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, '#080d26'); gr.addColorStop(0.7, '#1c2c5c'); gr.addColorStop(1, '#2a1e3c'); return gr; })(); g.fillRect(0, 0, E.W, E.H);
  glow(g, E.W * 0.78, E.H * 0.24, 520, '#cfe0ff', 0.35); circle(g, E.W * 0.78, E.H * 0.24, 110, '#f2f6ff'); circle(g, E.W * 0.78 - 30, E.H * 0.24 - 20, 22, 'rgba(180,195,230,.5)');
  const r = rng(4); for (let i = 0; i < 40; i++) circle(g, r() * E.W, r() * E.H * 0.5, 2 + r() * 2, 'rgba(255,255,255,.6)');
  for (let i = 0; i < 9; i++) { const x = (i + 0.5) * E.W / 9 + 12 * Math.sin(t * 0.6 + i), h = 500 + (i * 53) % 300; seg(g, [[x, gy], [x + 10 * Math.sin(t * 0.8 + i), gy - h]], 16, '#0e2a30'); for (let k = 1; k < 5; k++) seg(g, [[x - 10, gy - k * h / 5], [x + 10, gy - k * h / 5]], 6, '#143b44'); }
  g.fillStyle = '#4a3322'; g.fillRect(0, gy, E.W, E.H); for (let x = 0; x < E.W; x += 140) seg(g, [[x, gy], [x - 60, E.H]], 3, 'rgba(0,0,0,.35)'); seg(g, [[0, gy + 3], [E.W, gy + 3]], 5, 'rgba(255,200,120,.35)');
  [0.1, 0.9].forEach((u, i) => { seg(g, [[E.W * u, -10], [E.W * u, E.H * 0.12]], 4, '#2a1a10'); rr(g, E.W * u - 36, E.H * 0.12, 72, 100, 22); g.fillStyle = '#ff6a3a'; g.fill(); glow(g, E.W * u, E.H * 0.16, 260, '#ff9a4a', 0.45 + 0.05 * Math.sin(t * 3 + i)); });
  if (dim) veil(g, '#05060e', dim);
  return gy;
}
const HERO = (t, o = {}) => ({ who: 'KAGE', s: SC() * 0.85, facing: 1, t, rim: RIM, ...o });
const clonesRow = (g, t, gy, xs, at, s = 0.55, expr = 'smile') => xs.forEach((x, i) => { const k = pop(t, at + i * 0.12, 0.25); if (k > 0) { puff(g, x, gy - 140, t, at + i * 0.12); person(g, { who: 'KAGE', x, y: gy, s: SC() * s * k, facing: i % 2 ? -1 : 1, pose: breathe(POSES.relaxed, t + i), expr, alpha: 0.82, rim: CLONE, t }); } });

// c01 hook: the hero summons clones
registerShot('c01', { draw(g, t, info) {
  const gy = dojo(g, t); person(g, HERO(t, { x: E.W * 0.5, y: gy, pose: breathe(POSES.cheer, t), expr: 'joy' }));
  clonesRow(g, t, gy, [E.W * 0.17, E.W * 0.33, E.W * 0.67, E.W * 0.83], 1.3, 0.6);
  L(g, t, 0.15, 'SHADOW CLONES', { size: 80, color: CY });
  const k = pop(t, 3.4, 0.35); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.27); g.scale(k, k); label(g, 'x 1000', 0, 0, { size: 96, color: GOLD }); g.restore(); }
} });
// c02: a clone vanishes and its memories flow back
registerShot('c02', { draw(g, t, info) {
  const gy = dojo(g, t), van = local(info, t, 'vanishes,', 2.4);
  person(g, HERO(t, { x: E.W * 0.36, y: gy, pose: breathe(POSES.think, t), expr: t > van + 0.8 ? 'surprised' : 'smile', emo: t > van + 1.2 ? ['dizzy'] : [] }));
  const ca = 1 - prog(t, van, van + 0.15); if (ca > 0) person(g, { who: 'KAGE', x: E.W * 0.72, y: gy, s: SC() * 0.85, facing: -1, pose: breathe(POSES.cheer, t), expr: 'happy', alpha: 0.82 * ca, rim: CLONE, t });
  puff(g, E.W * 0.72, gy - 250, t, van);
  for (let i = 0; i < 14; i++) { const k = prog(t, van + 0.5 + i * 0.07, van + 1.5 + i * 0.07); if (k > 0 && k < 1) { const x = lerp(E.W * 0.72, E.W * 0.36 + 20, ease.inOut(k)), y = lerp(gy - 250, topOf(gy, 0.85) + 30, ease.inOut(k)) - 140 * Math.sin(k * Math.PI); glow(g, x, y, 60, '#ffe08a', 0.8); circle(g, x, y, 12, '#fff3b0'); } }
  L(g, t, 0.15, 'MEMORIES FLOW BACK', { size: 68, color: GOLD });
} });
// c03: one clone, one hour: easy
registerShot('c03', { draw(g, t, info) {
  const gy = dojo(g, t); person(g, HERO(t, { x: E.W * 0.34, y: gy, pose: breathe(POSES.explain, t), expr: 'smile' }));
  person(g, { who: 'KAGE', x: E.W * 0.7, y: gy, s: SC() * 0.85, facing: -1, pose: breathe(t % 1 < 0.5 ? POSES.ready : POSES.explain, t), expr: 'determined', alpha: 0.82, rim: CLONE, t });
  L(g, t, 0.15, '1 CLONE = 1 HOUR', { size: 74, color: CY }); const e = pop(t, 1.6, 0.3); if (e > 0) { g.save(); g.translate(E.W / 2, E.H * 0.27); g.scale(e, e); label(g, 'EASY', 0, 0, { size: 90, color: GREEN }); g.restore(); }
} });
// c04: a thousand clones: a thousand hours
registerShot('c04', { draw(g, t, info) {
  const gy = dojo(g, t, 0.25), r = rng(9), n = Math.floor(lerp(1, 1000, ease.in(prog(t, 0.2, 2.6))));
  for (let i = 0; i < Math.min(n, 300); i++) { const x = r() * E.W, y = E.H * 0.34 + r() * E.H * 0.36, s = 0.07 + 0.08 * (y / E.H); circle(g, x, y - 40 * s * 5, 9 * s * 10, '#7fe3ff'); g.fillStyle = 'rgba(127,227,255,.55)'; g.fillRect(x - 6 * s * 8, y - 28 * s * 5, 12 * s * 8, 34 * s * 5); }
  person(g, HERO(t, { x: E.W * 0.5, y: gy + 40, pose: breathe(POSES.handsOnHead, t), expr: 'scared' }));
  L(g, t, 0.1, `${n.toLocaleString('en-US')} CLONES`, { size: 84, color: GOLD }); const k = pop(t, 2.9, 0.3); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.255); g.scale(k, k); label(g, '1,000 HOURS', 0, 0, { size: 70, color: RED }); g.restore(); }
} });
// c05: forty days in one second
registerShot('c05', { draw(g, t, info) {
  const gy = dojo(g, t, 0.4), fill = ease.out(prog(t, 0.2, 2.2)), days = Math.round(41 * fill);
  const cols = 7, rows = 6, cw = 118, x0 = (E.W - cols * cw) / 2, y0 = E.H * 0.3;
  for (let i = 0; i < 42; i++) { const c = i % cols, rr_ = Math.floor(i / cols), on = i < days; rr(g, x0 + c * cw + 6, y0 + rr_ * cw + 6, cw - 12, cw - 12, 16); g.fillStyle = on ? '#ff9a3a' : 'rgba(255,255,255,.1)'; g.fill(); if (on) glow(g, x0 + c * cw + cw / 2, y0 + rr_ * cw + cw / 2, 60, '#ffb347', 0.3); }
  L(g, t, 0.1, `${days} DAYS`, { size: 90, color: GOLD }); const s = pop(t, local(info, t, 'single', 2.1), 0.3); if (s > 0) { g.save(); g.translate(E.W / 2, E.H * 0.865); g.scale(s, s); label(g, 'IN 1 SECOND', 0, 0, { size: 64, color: RED }); g.restore(); }
} });
// c06: working memory has four slots
registerShot('c06', { draw(g, t, info) {
  brainLoop(g, t, { calm: 0 }); const cy = E.H * 0.52;
  const f = local(info, t, 'four', 3.0);
  for (let i = 0; i < 4; i++) { const k = pop(t, 1.0 + i * 0.25, 0.3); if (k > 0) { g.save(); g.translate(E.W * (0.2 + i * 0.2), cy); g.scale(k, k); rr(g, -80, -80, 160, 160, 28); g.fillStyle = 'rgba(8,12,24,.8)'; g.fill(); g.strokeStyle = CY; g.lineWidth = 6; g.stroke(); glow(g, 0, 0, 140, CY, 0.25); g.restore(); } }
  L(g, t, 0.1, 'WORKING MEMORY', { size: 70, color: CY }); const k4 = pop(t, f - 0.2, 0.3); if (k4 > 0) { g.save(); g.translate(E.W / 2, cy - 230); g.scale(k4, k4); label(g, '4 SLOTS', 0, 0, { size: 90, color: GOLD }); g.restore(); }
} });
// c07: four, not four hundred
registerShot('c07', { draw(g, t, info) {
  g.fillStyle = '#07091a'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.45, 800, '#3a4aff', 0.18);
  const k = pop(t, 0.1, 0.35); g.save(); g.translate(E.W / 2, E.H * 0.42); g.scale(k, k); text(g, '4', 0, 0, { size: 520, font: 'Nunito', weight: 900, color: GOLD, glow: 40, glowColor: 'rgba(255,200,90,.7)', stroke: 18, strokeColor: 'rgba(0,0,0,.6)' }); g.restore();
  const h = pop(t, local(info, t, 'hundred.', 1.6) - 0.5, 0.3); if (h > 0) { g.save(); g.translate(E.W / 2, E.H * 0.62); g.scale(h, h); label(g, 'NOT 400', 0, 0, { size: 84, color: RED }); g.restore(); }
} });
// c08: a billion bits in, ten out: the straw
registerShot('c08', { draw(g, t, info) {
  g.fillStyle = '#07091a'; g.fillRect(0, 0, E.W, E.H); const top = E.H * 0.2, mid = E.H * 0.5, bot = E.H * 0.66;
  g.fillStyle = 'rgba(127,227,255,.18)'; g.beginPath(); g.moveTo(E.W * 0.08, top); g.lineTo(E.W * 0.92, top); g.lineTo(E.W * 0.55, mid); g.lineTo(E.W * 0.45, mid); g.closePath(); g.fill(); g.strokeStyle = CY; g.lineWidth = 5; g.stroke(); rr(g, E.W * 0.45, mid, E.W * 0.1, bot - mid, 10); g.fillStyle = 'rgba(255,217,138,.3)'; g.fill(); g.strokeStyle = GOLD; g.stroke();
  const r = rng(3); for (let i = 0; i < 90; i++) { const u = ((t * 0.7 + r()) % 1), x = lerp(E.W * (0.1 + 0.8 * r()), E.W * 0.5, ease.in(u)), y = lerp(top, mid, u); if (u < 0.98) circle(g, x, y, 4 + 3 * r(), CY); }
  for (let i = 0; i < 3; i++) { const u = ((t * 0.5 + i / 3) % 1); circle(g, E.W * 0.5, lerp(mid, bot, u), 6, GOLD); }
  const a = pop(t, 0.2, 0.3), b = pop(t, local(info, t, 'conscious', 3.0) - 0.2, 0.3);
  if (a > 0) { g.save(); g.translate(E.W / 2, E.H * 0.14); g.scale(a, a); label(g, 'SENSES: 1 BILLION BITS/S', 0, 0, { size: 50, color: CY }); g.restore(); }
  if (b > 0) { g.save(); g.translate(E.W / 2, E.H * 0.7 - 20); g.scale(b, b); label(g, 'YOU: ~10 BITS/S', 0, 0, { size: 58, color: GOLD }); g.restore(); }
} });
// c09: overload. The drop hits on "flood"
registerShot('c09', { draw(g, t, info) {
  const dropT = 38.33 - info.globalT + t, sh = Math.max(0, 1 - Math.abs(t - dropT) / 0.5), dx = Math.sin(t * 90) * 14 * sh;
  g.save(); g.translate(dx, 0); const gy = dojo(g, t, 0.35);
  const r = rng(5); for (let i = 0; i < 80; i++) { const k = prog(t, dropT - 0.2 + i * 0.01, dropT + 1.2); if (k > 0 && k < 1) { const x = r() * E.W, y = E.H * 0.22 + (E.H * 0.4) * k; rr(g, x - 24, y - 16, 48, 32, 8); g.fillStyle = `rgba(255,${120 + (i * 7) % 120},80,${1 - k})`; g.fill(); } }
  person(g, HERO(t, { x: E.W * 0.5, y: gy + 30, pose: breathe(POSES.handsOnHead, t), expr: 'scared', emo: ['dizzy'] })); g.restore();
  L(g, t, 0.1, '1000x STRONGER?', { size: 72, color: GOLD }); const k = pop(t, dropT - 0.1, 0.25); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.25); g.scale(k, k); label(g, 'A FLOOD, A STRAW', 0, 0, { size: 76, color: RED }); g.restore(); }
  if (sh > 0.3) { g.fillStyle = `rgba(255,255,255,${0.5 * sh})`; g.fillRect(0, 0, E.W, E.H); }
} });
// c10: the real limit is attention
registerShot('c10', { draw(g, t, info) {
  g.fillStyle = '#07091a'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.5, 800, '#3a8aff', 0.18);
  const a = pop(t, 0.2, 0.35), b = pop(t, local(info, t, 'attention.', 2.0) - 0.6, 0.4);
  if (a > 0) { g.save(); g.translate(E.W / 2, E.H * 0.32); g.scale(a, a); label(g, 'CHAKRA', 0, 0, { size: 96, color: '#8a93b0' }); seg(g, [[-230, 0], [230, 0]], 14, RED); g.restore(); }
  if (b > 0) { g.save(); g.translate(E.W / 2, E.H * 0.5); g.scale(b, b); glow(g, 0, 0, 420, GOLD, 0.45); label(g, 'ATTENTION', 0, 0, { size: 108, color: GOLD }); g.restore(); }
} });
// c11: how many could you handle? Four neat clones.
registerShot('c11', { draw(g, t, info) {
  const gy = dojo(g, t); person(g, HERO(t, { x: E.W * 0.5, y: gy, pose: breathe(POSES.relaxed, t), expr: 'thinking' }));
  clonesRow(g, t, gy, [E.W * 0.14, E.W * 0.3, E.W * 0.7, E.W * 0.86], 0.5, 0.55, 'neutral');
  L(g, t, 0.15, 'HOW MANY COULD YOU HANDLE?', { size: 56, color: '#fff' }); mark(g, '?', E.W * 0.5 + 110, topOf(gy, 0.85) - 10, t, 1.0, { size: 110, color: GOLD });
} });
