// shots/07_twist.js: the twist. Your money already expires (inflation), the shrinking ₹100, the quiet timer, invest, CTA.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, seg, rr, poly, circle, ring, glow, alpha, shade, mix, text, linGrad, radGrad, shake, rng, backdrop, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { note, ashFall, embers, chart, coin, armIn, bokehBG, local, fmtT, EMBER, GOLD, HOT, TEAL } from '../sets/money.js';
import { rooftops, interior, GY } from '../sets/india.js';
import { fig, blinkAt } from '../sets/act.js';
import { word } from '../sets/cine.js';
import { stat } from '../sets/stat.js';
import { cite } from '../sets/longform.js';
import { darkStage, bokeh, motes } from '../sets/hand3d.js';
import { wallet3D } from '../sets/money3d.js';
import { YOU, NEIGH, STUDENT, MOM, DAD, BAKER, RICH, TEACHER } from '../cast.js';

// m55: "Now here's the twist." the close-up turns to camera
registerShot('m55', { draw(g, t, info) {
  const tw = local(info, t, 'twist', 0.89);
  bokehBG(g, t, { top: '#04060a', bot: '#141018', seed: 61 });
  const r = rng(3); for (let i = 0; i < 14; i++) text(g, fmtT(r() * 3e8), r() * E.W, r() * E.H, { size: 22 + r() * 20, font: 'Nunito', weight: 900, color: alpha(EMBER, 0.08 + 0.06 * Math.sin(t * 2 + i)) });
  const z = 1.0 + 0.1 * ease.out(prog(t, 0, info.dur)); g.save(); g.translate(E.W * 0.5, E.H * 0.7); g.scale(z, z);
  bigFace(g, 0, 0, 310, { outfit: YOU, expr: t > tw - 0.3 ? 'smirk' : 'thinking', look: [lerp(-0.8, 0, ease.inOut(prog(t, 0.1, 0.7))), 0], rimColor: '#ffb070', rimSide: -1, tilt: lerp(-0.08, 0, prog(t, 0, 0.7)), blink: blinkAt(t, 3.0) }); g.restore();
  word(g, 'THE TWIST', E.H * 0.12, ease.out(prog(t, tw - 0.2, tw + 0.1)), { size: 90, color: '#ffe0b0' });
} });

// a realistic open wallet, top-down, in "our world" colours
function realWallet(g, x, y, s, t, timerA, timer) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.save(); g.fillStyle = 'rgba(0,0,0,.5)'; g.filter = 'blur(30px)'; rr(g, -560, -300, 1140, 660, 50); g.fill(); g.restore();
  rr(g, -560, -320, 1120, 640, 46); g.fillStyle = linGrad(g, -560, -320, 560, 320, ['#5a3826', '#3a2216', '#2a180e']); g.fill();
  g.strokeStyle = 'rgba(230,190,140,.45)'; g.setLineDash([14, 10]); g.lineWidth = 4; rr(g, -530, -290, 1060, 580, 36); g.stroke(); g.setLineDash([]);
  seg(g, [[0, -320], [0, 320]], 10, 'rgba(0,0,0,.35)');
  for (let i = 0; i < 3; i++) { rr(g, -500, -250 + i * 120, 440, 100, 14); g.fillStyle = shade('#3a2216', -0.15 + i * 0.05); g.fill(); rr(g, -480, -235 + i * 120, 400, 40, 8); g.fillStyle = ['#2a4a7a', '#8a2a22', '#c8a050'][i]; g.fill(); }
  note(g, 280, -20, 0.78, { rot: 0.03, timer, timerA, t, shadow: true });
  rr(g, 40, 60, 480, 230, 20); g.fillStyle = 'rgba(40,24,14,.92)'; g.fill(); g.strokeStyle = 'rgba(230,190,140,.35)'; g.setLineDash([12, 9]); g.lineWidth = 3; g.stroke(); g.setLineDash([]);
  g.restore();
}
// m56: "Your money already expires. It's just slower." a real wallet, a faint timer surfaces on the note
registerShot('m56', { draw(g, t, info) {
  const ex = local(info, t, 'expires', 0.77), sl = local(info, t, 'slower', 2.17);
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#2a2622', '#14120f']); g.fillRect(0, 0, E.W, E.H);
  for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(255,255,255,${0.015 + (i % 3) * 0.01})`; g.fillRect(0, i * 96, E.W, 48); }
  glow(g, E.W * 0.6, E.H * 0.3, 900, '#fff0d8', 0.12);
  const z = 1.0 + 0.1 * ease.inOut(t / info.dur), ta = 0.85 * ease.inOut(prog(t, ex - 0.2, ex + 0.8));
  realWallet(g, E.W * 0.47, E.H * 0.53, 0.82 * z, t, ta, t > sl - 0.2 ? 'SLOW BURN' : '…');
  word(g, 'JUST SLOWER', E.H * 0.12, ease.out(prog(t, sl - 0.2, sl + 0.1)), { size: 76, color: '#ffe0b0' });
} });

// m57: "It's called inflation. In India, prices have risen around five to six percent a year for a long time."
registerShot('m57', { draw(g, t, info) {
  const inf = local(info, t, 'inflation', 0.57), fv = local(info, t, 'five', 3.39), lt = local(info, t, 'long', 5.17);
  bokehBG(g, t, { top: '#05080a', bot: '#14100c', seed: 71 });
  const x = E.W * 0.12, y = E.H * 0.34, w = E.W * 0.5, h = E.H * 0.46;
  const pts = Array.from({ length: 13 }, (_, i) => (Math.pow(1.055, i * 1.0) - 1) / (Math.pow(1.055, 12) - 1) * 0.9 + 0.05);
  const P = chart(g, x, y, w, h, pts, ease.inOut(prog(t, 0.5, lt)), { color: '#ff7a4a', lw: 8 });
  text(g, 'PRICES IN INDIA', x, y - 50, { size: 26, font: 'Nunito', weight: 900, color: '#c8b4a0', align: 'left', spacing: 3 });
  text(g, 'YEAR 0', x, y + h + 46, { size: 22, font: 'Nunito', weight: 900, color: '#8a7a6a', align: 'left' }); text(g, 'YEAR 12', x + w, y + h + 46, { size: 22, font: 'Nunito', weight: 900, color: '#8a7a6a', align: 'right' });
  // price tags climbing next to the chart
  const items = [['CHAI', 10], ['MOMOS', 60], ['PETROL (L)', 100]];
  items.forEach(([nm, p0], i) => { const k = ease.inOut(prog(t, 0.6, lt)), price = Math.round(p0 * Math.pow(1.055, 12 * k)); const ty = E.H * 0.38 + i * 140, tx = E.W * 0.8;
    rr(g, tx - 180, ty - 50, 360, 100, 16); g.fillStyle = 'rgba(242,230,200,.95)'; g.fill(); circle(g, tx - 150, ty, 10, '#2a1a14');
    text(g, nm, tx - 120, ty - 14, { size: 22, font: 'Nunito', weight: 900, color: '#5a4a3a', align: 'left' }); text(g, '₹' + price, tx + 150, ty + 8, { size: 48, font: 'Nunito', weight: 900, color: '#c8361e', align: 'right' }); });
  word(g, 'INFLATION', E.H * 0.12, ease.out(prog(t, inf - 0.2, inf + 0.1)) * (1 - prog(t, fv - 0.4, fv - 0.1)), { size: 90, color: '#ff8a5a' });
  stat(g, { label: 'INDIA · PRICES RISE', value: '≈ 5–6% A YEAR', y: E.H * 0.13, size: 76, color: '#ffb35a', a: ease.out(prog(t, fv - 0.1, fv + 0.2)), pulse: t - fv });
  cite(g, 'India CPI inflation has averaged roughly 5–6% a year over the long run (RBI / MOSPI CPI data). Example prices illustrative.', 1);
} });

// m58: "At that rate, ₹100 today buys only about half as much in twelve years." the note shrinks along a timeline
registerShot('m58', { draw(g, t, info) {
  const hf = local(info, t, 'half', 3.65), tw = local(info, t, 'twelve', 4.47), k = ease.inOut(prog(t, 1.0, tw + 0.3));
  bokehBG(g, t, { top: '#05070a', bot: '#120e0a', seed: 81 });
  const yrs = Math.round(12 * k), sc = lerp(1.0, Math.SQRT1_2, k);
  // timeline
  const x0 = E.W * 0.12, x1 = E.W * 0.88, ty = E.H * 0.8; seg(g, [[x0, ty], [x1, ty]], 6, 'rgba(255,240,220,.3)'); seg(g, [[x0, ty], [lerp(x0, x1, k), ty]], 6, EMBER);
  for (let i = 0; i <= 12; i++) { const x = lerp(x0, x1, i / 12); seg(g, [[x, ty - (i % 6 ? 10 : 20)], [x, ty + (i % 6 ? 10 : 20)]], 3, i <= yrs ? EMBER : 'rgba(255,240,220,.3)'); }
  text(g, 'TODAY', x0, ty + 50, { size: 26, font: 'Nunito', weight: 900, color: '#c8b4a0' }); text(g, '+12 YEARS', x1, ty + 50, { size: 26, font: 'Nunito', weight: 900, color: '#c8b4a0' });
  circle(g, lerp(x0, x1, k), ty, 14, '#fff2d0'); glow(g, lerp(x0, x1, k), ty, 60, EMBER, 0.8);
  // ghost outline of the original note
  g.save(); g.globalAlpha = 0.35 * k; g.strokeStyle = '#d8c8f0'; g.setLineDash([16, 12]); g.lineWidth = 4; rr(g, E.W * 0.5 - 300 * 1.15, E.H * 0.44 - 140 * 1.15, 600 * 1.15, 280 * 1.15, 14); g.stroke(); g.restore();
  note(g, E.W * 0.5, E.H * 0.44, 1.15 * sc, { value: '100', pal: 'r100', timer: yrs ? `YEAR ${yrs}` : 'TODAY', t, rot: -0.02 });
  stat(g, { label: '₹100 BUYS', value: k > 0.98 ? 'HALF AS MUCH' : Math.round(100 * Math.pow(1.06, -12 * k)) + '%', y: E.H * 0.13, size: 76, color: k > 0.98 ? '#ff8a5a' : GOLD, pulse: t - hf });
  cite(g, 'Rule of 72: at ~6% a year, prices double in about 72 ÷ 6 = 12 years, so money buys about half as much.', 1);
} });

// m59: "The timer is already running. You just can't see it." 3D callback: the wallet, a faint timer surfaces
registerShot('m59', { kind: '3d',
  init(T) { const st = darkStage(T, { fov: 36, key: 2.2, ambient: 0.9 }); st.scene.fog.near = 3; st.scene.fog.far = 14;
    const w = wallet3D(T, st, { open: 1, emissive: 0.08, notes: [{ timer: '4380 DAYS', timerA: 0 }, { timer: '4380 DAYS', value: '100', pal: 'r100', timerA: 0 }, { timer: '4380 DAYS', value: '2000', pal: 'r2000', timerA: 0 }] });
    const bk = bokeh(T, st, 24); const mt = motes(T, st, 30, '#ffb060'); return { stage: st, w, bk, mt }; },
  draw(s, t, info, T) { const ru = local(info, t, 'running', 1.13), see = local(info, t, 'see', 2.49);
    const ta = 0.75 * ease.inOut(prog(t, 0.2, ru + 0.4)) * (1 - 0.65 * ease.inOut(prog(t, see - 0.1, see + 0.6)));
    s.w.notes.forEach((n, i) => n.draw({ timer: fmtT(4380 * 86400 - t * 1 - i * 777).replace(/^(\d+):/, '$1D '), timerA: ta, t }));
    s.bk.tick(t); s.mt.tick(t, 0.5, [0, 0.2, 0]);
    T.dolly(s.stage.camera, t, [[0, { pos: [0.2, 1.7, 1.75], look: [0.15, 0.1, -0.2] }], [info.dur, { pos: [0.3, 1.25, 1.2], look: [0.2, 0.1, -0.15] }]]); },
});

// coins pile + pot
function coinPile(g, x, y, s, t, n = 14) { const r = rng(5); for (let i = 0; i < n; i++) { const cx = x + (r() - 0.5) * 220 * s, cy = y - Math.floor(i / 5) * 14 * s - r() * 8; g.fillStyle = '#8a5a1a'; g.beginPath(); g.ellipse(cx, cy + 6 * s, 34 * s, 12 * s, 0, 0, 7); g.fill(); g.fillStyle = linGrad(g, cx - 34 * s, 0, cx + 34 * s, 0, ['#b8761e', '#ffe08a', '#d8962e']); g.beginPath(); g.ellipse(cx, cy, 34 * s, 12 * s, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(120,70,10,.6)'; g.lineWidth = 2; g.beginPath(); g.ellipse(cx, cy, 24 * s, 8 * s, 0, 0, 7); g.stroke(); } }
function plant(g, x, y, s, k, t) {
  if (k <= 0) return; const h = 460 * s * ease.out(k), sw = Math.sin(t * 1.3) * 8 * k;
  seg(g, [[x, y], [x + sw * 0.5, y - h * 0.5], [x + sw, y - h]], 10 * s, '#5aa84a');
  const L = (u, side, sz) => { if (k < u) return; const q = ease.outBack(clamp((k - u) * 4)); const lx = x + sw * (1 - u), ly = y - h * (1 - u) * 1; g.save(); g.translate(x + sw * u, y - h * u); g.rotate(side * (0.9 - 0.2 * Math.sin(t + u * 9))); g.scale(q * sz * s, q * sz * s); g.fillStyle = linGrad(g, 0, 0, 90, 0, ['#4a9a3a', '#8ad85a']); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(45, -40, 100, 0); g.quadraticCurveTo(45, 40, 0, 0); g.fill(); g.restore(); };
  [[0.3, -1, 1], [0.45, 1, 1.1], [0.62, -1, 1.2], [0.78, 1, 1.0], [0.92, -1, 0.8]].forEach(([u, sd, sz]) => L(u, sd, sz));
  if (k > 0.9) { const q = ease.outBack(prog(k, 0.9, 1)); coin(g, x + sw, y - h - 20 * s, 34 * s * q, { spin: t * 2 }); glow(g, x + sw, y - h - 20 * s, 120 * s, GOLD, 0.5 * q); }
}
// m60: "That's why people invest." a seed goes into a pot of coins and glows
registerShot('m60', { draw(g, t, info) {
  const iv = local(info, t, 'invest', 1.07), cam = { z: 1.05 + 0.05 * t / info.dur };
  blurLayer(g, 10, (g) => interior(g, t, { z: 1.1, x: 100 }, { kind: 'apartment', sky: 'golden', winX: 300, day: 2 })); veil(g, '#06080a', 0.3);
  layer(g, cam, 1, (g) => {
    const px = E.W * 0.5, py = E.H * 0.8; glow(g, px, py - 160, 500, GOLD, 0.18);
    poly(g, [[px - 220, py - 200], [px + 220, py - 200], [px + 170, py + 60], [px - 170, py + 60]], '#a85a32'); rr(g, px - 240, py - 230, 480, 50, 12); g.fillStyle = '#c86a3a'; g.fill();
    g.fillStyle = '#3a2416'; g.beginPath(); g.ellipse(px, py - 205, 210, 26, 0, 0, 7); g.fill(); coinPile(g, px, py - 210, 0.9, t);
    const dk = ease.inOut(prog(t, 0.1, 0.8)); const sx = px + 10, sy = lerp(py - 560, py - 230, dk);
    if (dk < 1) armIn(g, sx - 60, sy - 130, 0.55, -1.2, { sleeve: YOU.color, grip: 0.8 });
    g.save(); g.translate(sx, sy); g.fillStyle = '#c8a060'; g.beginPath(); g.ellipse(0, 0, 18, 26, 0.3, 0, 7); g.fill(); g.restore();
    if (dk >= 1) { glow(g, sx, sy, 140, '#bff08a', 0.5 * (0.6 + 0.4 * Math.sin(t * 6))); plant(g, sx, sy, 0.6, prog(t, 1.0, info.dur) * 0.3, t); }
  });
  word(g, 'INVEST', E.H * 0.12, ease.out(prog(t, iv - 0.2, iv + 0.1)), { size: 96, color: '#bff08a' });
} });

// m61: "Not to get rich overnight but to stop their money from quietly burning." the plant grows, a note smoulders beside it
registerShot('m61', { draw(g, t, info) {
  const ov = local(info, t, 'overnight', 0.91), qb = local(info, t, 'quietly', 3.05), cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur), x: 20 };
  const M = mood('golden'), day = prog(t, 0, info.dur);
  backdrop(g, [mix('#0c1a2a', '#14283a', day), mix('#3a3a40', '#5a7480', day), mix('#a0603a', '#ffb060', day)]);
  const sa = lerp(Math.PI * 1.1, Math.PI * 1.6, day); FX.sun(g, E.W * 0.5 + Math.cos(sa) * 700, E.H * 0.9 + Math.sin(sa) * 650, 60, '#fff2d6', M.key, 6);
  FX.godRays(g, E.W * 0.5 + Math.cos(sa) * 700, E.H * 0.9 + Math.sin(sa) * 650, { count: 7, len: 1600, color: M.key, a: 0.05, t });
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, E.H * 0.78, 0, E.H, ['#3a2a1e', '#120c08']); g.fillRect(-100, E.H * 0.78, E.W + 200, E.H);
    const px = E.W * 0.58, py = E.H * 0.8; coinPile(g, px, py, 1.1, t, 10 + Math.floor(12 * prog(t, 0.5, info.dur)));
    plant(g, px, py - 40, 1.0, 0.3 + 0.7 * ease.inOut(prog(t, 0.2, info.dur - 0.3)), t);
    glow(g, E.W * 0.22, E.H * 0.72, 200, EMBER, 0.25); note(g, E.W * 0.22, E.H * 0.72, 0.42, { rot: -0.1, timer: 'SLOW BURN', burn: 0.1 + 0.35 * prog(t, 0, info.dur), t, seed: 4 });
  });
  if (t < ov + 0.6) text(g, 'GET RICH OVERNIGHT', E.W * 0.5, E.H * 0.14, { size: 58, weight: 700, color: '#9a9088', alpha: ease.out(prog(t, ov - 0.3, ov)) * (1 - prog(t, ov + 0.3, ov + 0.6)) });
  if (t > ov + 0.2) seg(g, [[E.W * 0.5 - 360, E.H * 0.14], [E.W * 0.5 - 360 + 720 * ease.out(prog(t, ov + 0.1, ov + 0.4)), E.H * 0.14]], 8, alpha('#ff5a3c', 1 - prog(t, ov + 0.3, ov + 0.6)));
  word(g, 'STOP THE QUIET BURN', E.H * 0.13, ease.out(prog(t, qb - 0.4, qb - 0.1)), { size: 76, color: '#bff08a' });
} });

// m62: "So, if your money expired in 30 days what's the first thing you'd buy? Tell me in the comments." end card
registerShot('m62', { draw(g, t, info) {
  const wh = local(info, t, "what's", 2.68), tl = local(info, t, 'tell', 4.3), cam = { z: 1.0 + 0.04 * t / info.dur };
  blurLayer(g, 8, (g) => rooftops(g, t, { z: 1.1, x: 0 }, { mood: 'dusk', sunX: 0.5, sunY: 200 })); veil(g, '#05070a', 0.45);
  layer(g, cam, 1, (g) => { const cast = [YOU, NEIGH, STUDENT, MOM, DAD, BAKER, TEACHER, RICH]; cast.forEach((o, i) => fig(g, { x: E.W * (0.14 + i * 0.103), y: E.H * 0.97, s: 0.95, facing: i < 4 ? 1 : -1, outfit: o, pose: posesAt(t + i * 0.3, [[0, 'stand'], [1.2, i % 2 ? 'wave' : 'relaxed'], [2.4, 'stand']]), expr: ['joy', 'smile', 'happy'][i % 3], t, seed: i, rim: '#ffc078' })); });
  g.fillStyle = linGrad(g, 0, 0, 0, E.H * 0.62, ['rgba(4,6,10,.9)', 'rgba(4,6,10,0)']); g.fillRect(0, 0, E.W, E.H * 0.62);
  const a1 = ease.out(prog(t, 0.2, 0.6)); text(g, 'If your money expired in 30 days…', E.W / 2, E.H * 0.12, { size: 46, font: 'Nunito', weight: 800, color: '#e8d8c4', alpha: a1 });
  const a2 = ease.out(prog(t, wh - 0.3, wh + 0.1)); g.save(); g.translate(E.W / 2, E.H * 0.27); const s2 = 0.92 + 0.08 * ease.outBack(prog(t, wh - 0.3, wh + 0.2)); g.scale(s2, s2);
  text(g, "What's the first thing you'd buy?", 0, 0, { size: 96, font: 'Playfair Display', weight: 900, italic: true, color: '#fff1dc', glow: 26, glowColor: alpha(EMBER, 0.6), alpha: a2 }); g.restore();
  note(g, E.W * 0.5, E.H * 0.5, 0.42, { timer: fmtT(30 * 86400 - t), t, rot: Math.sin(t * 0.8) * 0.05, a: a1 });
  const b = ease.outBack(prog(t, tl - 0.1, tl + 0.25)); if (b > 0) { g.save(); g.translate(E.W * 0.8, E.H * 0.55); g.scale(b, b); rr(g, -230, -60, 460, 120, 30); g.fillStyle = '#f4efe6'; g.fill(); poly(g, [[-120, 50], [-80, 50], [-140, 100]], '#f4efe6'); circle(g, -170, 0, 26, EMBER); text(g, '…', -170, -6, { size: 40, font: 'Nunito', weight: 900, color: '#fff' }); text(g, 'TELL ME BELOW', 30, 2, { size: 40, font: 'Nunito', weight: 900, color: '#2a1a14' }); g.restore(); }
  const c = ease.out(prog(t, tl + 0.6, tl + 1.0)); if (c > 0) { rr(g, E.W * 0.12 - 150, E.H * 0.55 - 40, 300, 80, 40); g.fillStyle = alpha('#e8281e', c); g.fill(); text(g, 'SUBSCRIBE', E.W * 0.12, E.H * 0.55 + 2, { size: 34, font: 'Nunito', weight: 900, color: '#ffffff', alpha: c }); }
  embers(g, t, { count: 40, a: 0.6 });
} });
