// shots/pz.js: "The Man Who Paid You With Your Own Money" (Charles Ponzi, 1920). Flat toon, 9:16. Text-safe bands:
// top 0-0.2H words/chips, middle 0.2-0.8H characters, bottom 0.8-0.9H captions.
import { E, registerShot, ease, prog, clamp, lerp, text, veil, rng, circle, seg } from '/engine/core.js';
import { local } from '../sets/ui.js';
import { INK, ell, rrect, shade, drawChar, keys, A, skyGrad, cloudStrip, puffCloud, townSkyline, burst, impactBg, speedLines, street1920, modelT, crowd1920 } from '../sets/flat.js';
import { CAST } from '../sets/cast_ponzi.js';

const W = E.W, H = E.H, TAU = Math.PI * 2;
const atc = (info, t, w, fb) => { const x = local(info, t, w); return x == null || x < -0.2 || x > info.dur ? fb : x; };
const cam = (g, z, cx, cy, rot = 0) => { g.translate(W / 2, H / 2); g.rotate(rot); g.scale(z, z); g.translate(-cx, -cy); };
const shk = (t, t0, amp = 18, dur = 0.45) => { const k = clamp(1 - (t - t0) / dur); return t > t0 && k > 0 ? [Math.sin(t * 87) * amp * k, Math.cos(t * 71) * amp * k] : [0, 0]; };
const word = (g, s, x, y, a, size = 130, col = '#ffd23a', rot = -0.06) => { if (a <= 0) return; const sc = 0.6 + 0.4 * ease.outBack(clamp(a)); g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha = clamp(a * 3); g.font = `900 ${size}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = size * 0.16; g.strokeStyle = INK; g.strokeText(s, 0, 0); g.fillStyle = col; g.fillText(s, 0, 0); g.restore(); };
const chip = (g, s, a, y = 170, col = '#ffd23a') => { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = '900 42px Nunito'; const w = g.measureText(s).width + 64; rrect(g, W / 2 - w / 2, y - 38, w, 76, 38); g.fillStyle = INK; g.fill(); g.restore(); text(g, s, W / 2, y + 2, { size: 42, font: 'Nunito', weight: 900, color: col, alpha: a, spacing: 3 }); };
const vign = (g, a = 0.35) => { const v = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(10,6,0,${a})`); g.fillStyle = v; g.fillRect(0, 0, W, H); };
const sepia = (g, a = 0.12) => { g.save(); g.globalAlpha = a; g.globalCompositeOperation = 'multiply'; g.fillStyle = '#e8c890'; g.fillRect(0, 0, W, H); g.restore(); };
const P = CAST.ponzi;
const bill = (g, x, y, s, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); rrect(g, -60 * s, -28 * s, 120 * s, 56 * s, 6 * s); g.fillStyle = '#8ac87a'; g.fill(); g.lineWidth = 4 * s; g.strokeStyle = '#2a5a2a'; g.stroke(); ell(g, 0, 0, 18 * s, 18 * s); g.fillStyle = '#d8f0c8'; g.fill(); g.stroke(); g.fillStyle = '#2a5a2a'; g.font = `900 ${22 * s}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', 0, 1); g.restore(); };
const moneyRain = (g, t, n = 30, seed = 3, a = 1) => { if (a <= 0) return; const R = rng(seed); g.save(); g.globalAlpha = a; for (let i = 0; i < n; i++) { const x = R() * W, sp = 300 + R() * 300, y = ((t * sp + R() * H * 1.4) % (H * 1.4)) - H * 0.2; bill(g, x + Math.sin(t * 2 + i) * 40, y, 0.9 + R() * 0.6, Math.sin(t * 3 + i) * 0.8); } g.restore(); };
const sign = (g, s, x, y, w, h, col = '#1e3a2a', txt = '#ecd8a4', size = 54) => { rrect(g, x - w / 2, y - h / 2, w, h, 10); g.fillStyle = col; g.fill(); g.lineWidth = 8; g.strokeStyle = '#c8a040'; g.stroke(); text(g, s, x, y + 3, { size, font: 'Playfair Display', weight: 900, color: txt }); };
const banner = (g, s, x, y, w, h, k = 1, rot = -0.04) => { if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, k); rrect(g, -w / 2, -h / 2, w, h, 6); g.fillStyle = '#f4ecd8'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.restore(); if (k > 0.6) text(g, s, x, y + 4, { size: h * 0.42, font: 'Nunito', weight: 900, color: '#c8302a', alpha: (k - 0.6) / 0.4 }); };
// office interior: wood panels, window with city, sign
function office(g, t, o = {}) { g.fillStyle = '#5a3a26'; g.fillRect(-W, -H, W * 3, H * 3); g.fillStyle = '#6a442c'; for (let x = -200; x < W + 200; x += 180) { rrect(g, x + 14, H * 0.3, 150, H * 0.34, 8); g.fill(); } g.fillStyle = '#4a2e1e'; g.fillRect(-W, H * 0.66, W * 3, H * 2);
  rrect(g, W * 0.6, H * 0.1, 360, 420, 8); g.fillStyle = '#f0c890'; g.fill(); g.save(); g.clip(); skyGrad(g, W, H, ['#f0a060', '#f8d8a0'], H * 0.1, H * 0.1 + 420); townSkyline(g, W * 0.6, H * 0.1 + 420, 380, 0.6, 5, ['#a86a4a', '#986048']); g.restore(); g.lineWidth = 12; g.strokeStyle = '#3a2416'; g.strokeRect(W * 0.6, H * 0.1, 360, 420); g.beginPath(); g.moveTo(W * 0.6 + 180, H * 0.1); g.lineTo(W * 0.6 + 180, H * 0.1 + 420); g.lineWidth = 8; g.stroke();
  g.save(); g.globalAlpha = 0.14; g.beginPath(); g.moveTo(W * 0.6, H * 0.1 + 420); g.lineTo(W * 0.6 + 360, H * 0.1 + 420); g.lineTo(W * 0.3, H * 0.9); g.lineTo(-200, H * 0.9); g.closePath(); g.fillStyle = '#ffe8b0'; g.fill(); g.restore();
  if (o.sign !== false) sign(g, 'SECURITIES EXCHANGE CO.', W * 0.3, H * 0.15, 560, 120, '#1e3a2a', '#ecd8a4', 40); }

// ---------- p01 HOOK: "In 1920, one man promised to make you rich in forty-five days. And for eight months... he actually did."
registerShot('p01', { draw(g, t, info) {
  const ac = atc(info, t, 'actually', info.dur - 1.2), k = ease.inOut(clamp(t / info.dur)); g.save(); cam(g, lerp(1.05, 1.25, k), W / 2, H * 0.52);
  street1920(g, W, H, 200 + t * 30, { night: true, baseY: H * 0.7 }); crowd1920(g, -60, H * 0.86, W + 200, 2, 0.75, t, { seed: 3, expr: (i) => t > ac ? 'laughing' : 'curious', bounce: t > ac, jitter: true });
  drawChar(g, W * 0.5, H * 0.82, 1.6, P, keys(t, [[0, { expr: 'smug', legs: 'none', armL: [0.12, 0.15], armR: [0.6, -2.3] }], [1.4, { expr: 'talk', ...A('open') }], [ac, { expr: 'laughing', armL: [2.6, 0.2], armR: [2.6, 0.2], bob: -0.04 }, 0.25]], 1));
  g.fillStyle = '#2a2a36'; g.fillRect(-W, H * 0.8, W * 3, H); g.fillStyle = '#3a3a46'; g.fillRect(-W, H * 0.8, W * 3, 12);
  g.restore(); moneyRain(g, t - ac, 20, 3, prog(t, ac, ac + 0.2)); banner(g, '50% IN 45 DAYS', W / 2, H * 0.12, 760, 150, ease.outBack(prog(t, 0.3, 0.7))); chip(g, 'BOSTON · 1920', ease.out(prog(t, 0.2, 0.5)) * (1 - prog(t, ac - 0.4, ac)), 290);
  vign(g, 0.4);
} });

// ---------- p02 "He stepped off the boat in Boston with two dollars and fifty cents."
registerShot('p02', { draw(g, t, info) {
  const tw = atc(info, t, 'two', info.dur * 0.6), k = ease.inOut(clamp(t / info.dur)); g.save(); cam(g, lerp(1.0, 1.3, k), lerp(W * 0.5, W * 0.4, k), H * 0.52);
  skyGrad(g, W, H, ['#8ab8d8', '#d8e4e8', '#f0e0c8'], 0, H * 0.6); g.fillStyle = '#8ab8d8'; g.fillRect(-W, -H, W * 3, H); cloudStrip(g, 100, 260, 420, 40); cloudStrip(g, 600, 380, 360, 36);
  g.fillStyle = '#3a6a8a'; g.fillRect(-W, H * 0.6, W * 3, H); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 4; for (let i = 0; i < 10; i++) { const y = H * 0.62 + i * 30; g.beginPath(); for (let x = -100; x < W + 100; x += 40) g.lineTo(x, y + Math.sin(x * 0.05 + t * 3 + i) * 6); g.stroke(); }
  // steamship
  const sx = W * 0.62; g.fillStyle = '#2a2a34'; g.beginPath(); g.moveTo(sx - 420, H * 0.5); g.lineTo(sx + 560, H * 0.5); g.lineTo(sx + 480, H * 0.62); g.lineTo(sx - 360, H * 0.62); g.closePath(); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.fillStyle = '#b8302a'; g.fillRect(sx - 400, H * 0.585, 900, 20);
  g.fillStyle = '#f4f0e6'; g.fillRect(sx - 300, H * 0.42, 700, H * 0.08); g.strokeRect(sx - 300, H * 0.42, 700, H * 0.08); for (let i = 0; i < 10; i++) { ell(g, sx - 260 + i * 66, H * 0.46, 14, 14); g.fillStyle = '#3a4a5a'; g.fill(); }
  for (const fx of [sx - 120, sx + 120]) { rrect(g, fx - 45, H * 0.27, 90, H * 0.15, 6); g.fillStyle = '#d8a030'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); g.fillStyle = '#1e1e24'; g.fillRect(fx - 45, H * 0.27, 90, 30); for (let i = 0; i < 4; i++) { const u = ((t * 0.4 + i * 0.25) % 1); ell(g, fx + u * 120, H * 0.25 - u * 200, 40 + u * 50, 30 + u * 40); g.fillStyle = `rgba(220,220,228,${0.8 * (1 - u)})`; g.fill(); } }
  // dock + gangplank
  g.fillStyle = '#7a5a3a'; g.fillRect(-W, H * 0.66, W * 3, H); g.fillStyle = '#6a4a2e'; for (let x = -200; x < W * 2; x += 90) g.fillRect(x, H * 0.66, 8, H); g.lineWidth = 7; g.strokeStyle = INK; g.beginPath(); g.moveTo(-W, H * 0.66); g.lineTo(W * 2, H * 0.66); g.stroke();
  g.save(); g.translate(sx - 300, H * 0.5); g.rotate(0.38); rrect(g, -380, -14, 380, 28, 6); g.fillStyle = '#9a7a54'; g.fill(); g.stroke(); g.restore();
  const walk = ease.inOut(prog(t, 0, tw - 0.2)), px = lerp(sx - 560, W * 0.3, walk), py = lerp(H * 0.585, H * 0.78, walk);
  drawChar(g, px, py, 1.15, { ...P, top: '#8a7a64', pants: '#5a4a3a', coat: true, tie: '#5a2a2a' }, keys(t, [[0, { expr: 'happy', legs: walk < 1 ? 'walk' : 'stand', step: t * 8, armL: [0.12, 0.15], armR: [0.3, -0.2] }], [tw - 0.1, { expr: 'surprised', legs: 'stand', armL: [0.9, -0.6], armR: [0.9, -0.6] }, 0.25]], 1));
  rrect(g, px + 70, py - 150, 90, 70, 8); g.fillStyle = '#7a4a2a'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
  g.restore(); word(g, '$2.50', W / 2, H * 0.12, prog(t, tw, tw + 0.25), 170, '#8ac87a'); sepia(g, 0.14); vign(g);
} });

// ---------- p03 "Then he found a loophole. A postal coupon. Buy it cheap in Italy, trade it for stamps worth more in America. Free money."
registerShot('p03', { draw(g, t, info) {
  const co = atc(info, t, 'coupon', 1.0), it = atc(info, t, 'italy', 2.4), am = atc(info, t, 'america', 3.6), fr = atc(info, t, 'free', info.dur - 0.9);
  g.fillStyle = '#e8dcc0'; g.fillRect(0, 0, W, H); g.save(); g.globalAlpha = 0.5; g.strokeStyle = '#c8b898'; g.lineWidth = 2; for (let x = 0; x < W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } g.restore();
  // map strip: Italy (right) to America (left), arc
  const my = H * 0.6, ix = W * 0.82, ax = W * 0.18; g.fillStyle = '#9ac8a0'; g.beginPath(); g.moveTo(ix - 60, my - 140); g.lineTo(ix + 40, my - 120); g.lineTo(ix + 20, my); g.lineTo(ix + 70, my + 110); g.lineTo(ix + 30, my + 120); g.lineTo(ix - 20, my + 20); g.closePath(); g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
  g.beginPath(); g.moveTo(ax - 140, my - 120); g.lineTo(ax + 100, my - 140); g.lineTo(ax + 120, my + 60); g.lineTo(ax - 20, my + 140); g.lineTo(ax - 140, my + 40); g.closePath(); g.fillStyle = '#9ac8a0'; g.fill(); g.stroke();
  text(g, 'ITALY', ix, my + 180, { size: 46, font: 'Nunito', weight: 900, color: INK }); text(g, 'AMERICA', ax, my + 200, { size: 46, font: 'Nunito', weight: 900, color: INK });
  const fl = ease.inOut(prog(t, it + 0.3, am)); if (fl > 0) { g.setLineDash([16, 12]); g.lineWidth = 7; g.strokeStyle = '#c8302a'; g.beginPath(); g.moveTo(ix, my); g.quadraticCurveTo(W / 2, my - 360, lerp(ix, ax, fl), my - Math.sin(Math.PI * fl) * 280 * (1 - fl) * 0); g.stroke(); g.setLineDash([]); const ex = lerp(ix, ax, fl), ey = my - 4 * fl * (1 - fl) * 360; rrect(g, ex - 40, ey - 26, 80, 52, 6); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke(); g.beginPath(); g.moveTo(ex - 40, ey - 26); g.lineTo(ex, ey + 4); g.lineTo(ex + 40, ey - 26); g.stroke(); }
  // price tags
  const tag = (s, x, y, a, col) => { if (a <= 0) return; g.save(); g.translate(x, y); g.scale(ease.outBack(clamp(a)), ease.outBack(clamp(a))); rrect(g, -120, -44, 240, 88, 16); g.fillStyle = col; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); g.restore(); text(g, s, x, y + 3, { size: 46, font: 'Nunito', weight: 900, color: '#fff', alpha: clamp(a * 2) }); };
  tag('CHEAP', ix - 90, my - 230, prog(t, it, it + 0.25), '#2a8a4a'); tag('WORTH MORE', ax + 110, my - 250, prog(t, am, am + 0.25), '#c8302a');
  // the coupon (hero prop) drops in, top band clear
  const ck = ease.outBack(prog(t, co - 0.2, co + 0.3)); if (ck > 0) { g.save(); g.translate(W / 2, H * 0.3); g.rotate(-0.05 + Math.sin(t * 2) * 0.02); g.scale(ck, ck); rrect(g, -330, -150, 660, 300, 14); g.fillStyle = '#f2e2b8'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); g.setLineDash([10, 8]); g.lineWidth = 4; g.strokeStyle = '#8a6a3a'; g.strokeRect(-300, -122, 600, 244); g.setLineDash([]);
    text(g, 'INTERNATIONAL', 40, -70, { size: 40, font: 'Playfair Display', weight: 900, color: '#3a2a1a' }); text(g, 'REPLY COUPON', 40, -20, { size: 48, font: 'Playfair Display', weight: 900, color: '#3a2a1a' }); text(g, 'postage exchange', 40, 40, { size: 30, font: 'Playfair Display', weight: 700, color: '#6a4a2a' });
    ell(g, -210, 10, 80, 80); g.fillStyle = '#c8d8e0'; g.fill(); g.lineWidth = 5; g.strokeStyle = '#3a2a1a'; g.stroke(); g.beginPath(); g.moveTo(-290, 10); g.lineTo(-130, 10); g.moveTo(-210, -70); g.lineTo(-210, 90); g.ellipse(-210, 10, 40, 80, 0, 0, TAU); g.stroke(); g.restore(); }
  // Ponzi peeks in at "Free money"
  const pk = ease.outBack(prog(t, fr - 0.2, fr + 0.2)); if (pk > 0) { drawChar(g, W * 0.5, H * 0.79 + (1 - pk) * 400, 1.4, P, keys(t, [[0, { expr: 'smug', legs: 'none', armL: [0.12, 0.15], armR: [0.5, -2.2] }]], 1)); burst(g, W * 0.78, H * 0.48, 70, '#ffd23a', 8, pk); }
  word(g, 'FREE MONEY?', W / 2, H * 0.08, prog(t, fr, fr + 0.2), 110, '#ffd23a'); vign(g, 0.25);
} });

// ---------- p04 "So he opened a company, and made one promise."
registerShot('p04', { draw(g, t, info) {
  const k = ease.inOut(clamp(t / info.dur)); g.save(); cam(g, lerp(1.0, 1.2, k), W / 2, lerp(H * 0.5, H * 0.46, k)); office(g, t);
  rrect(g, W * 0.12, H * 0.62, W * 0.76, 90, 10); g.fillStyle = '#3a2416'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
  drawChar(g, W * 0.5, H * 0.72, 1.45, P, keys(t, [[0, { expr: 'calculating', legs: 'none', armL: [0.12, 0.15], armR: [-0.3, -2.5] }], [info.dur * 0.55, { expr: 'smug', armR: [0.6, -2.3] }, 0.4]], 1));
  rrect(g, W * 0.15, H * 0.6, W * 0.7, 40, 8); g.fillStyle = '#4a2e1e'; g.fill(); g.stroke(); g.fillStyle = '#2a6a4a'; ell(g, W * 0.24, H * 0.57, 50, 24); g.fill(); g.stroke(); g.fillStyle = '#c8a040'; g.fillRect(W * 0.235, H * 0.5, 12, 60); ell(g, W * 0.24, H * 0.5, 60, 26); g.fillStyle = '#2a8a5a'; g.fill(); g.stroke();
  g.restore(); vign(g, 0.4);
} });
// ---------- p05 PONZI: "Fifty percent profit... in forty-five days!"  (the pitch, from behind the crowd)
registerShot('p05', { draw(g, t, info) {
  const fo = atc(info, t, 'forty', info.dur * 0.55), k = ease.inOut(clamp(t / info.dur)); g.save(); cam(g, lerp(1.25, 1.05, k), W / 2, H * 0.48);
  g.fillStyle = '#4a2e22'; g.fillRect(-W, -H, W * 3, H * 3); for (let i = 0; i < 6; i++) { const x = 60 + i * 200; g.fillStyle = '#5a3a2a'; g.fillRect(x, 0, 120, H * 0.6); ell(g, x + 60, H * 0.12, 40, 40); g.fillStyle = '#ffd88a'; g.fill(); g.save(); g.globalAlpha = 0.15; ell(g, x + 60, H * 0.12, 120, 120); g.fill(); g.restore(); }
  banner(g, '50% IN 45 DAYS!', W / 2, H * 0.24, 820, 170, ease.outBack(prog(t, fo - 0.3, fo + 0.1)), -0.05);
  rrect(g, W * 0.3, H * 0.58, W * 0.4, 160, 10); g.fillStyle = '#6a3a22'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); // podium
  drawChar(g, W * 0.5, H * 0.66, 1.35, P, keys(t, [[0, { expr: 'talk', legs: 'none', armL: [1.0, -1.2], armR: [1.0, -1.2] }], [fo, { expr: 'laughing', armL: [2.3, 0.3], armR: [2.3, 0.3], bob: -0.05 }, 0.25]], 1));
  crowd1920(g, -80, H * 0.92, W + 300, 2, 1.0, t, { seed: 7, expr: () => (t > fo ? 'surprised' : 'curious'), bounce: t > fo, arms: (i, r, tt) => (t > fo && (i + r) % 3 === 0 ? A('cheer') : A('rest')) });
  g.fillStyle = '#2a2a36'; g.fillRect(-W, H * 0.8, W * 3, H); g.fillStyle = '#3a3a46'; g.fillRect(-W, H * 0.8, W * 3, 12);
  g.restore(); vign(g, 0.45);
} });

// ---------- p06 "His first investors got paid. Exactly on time."
registerShot('p06', { draw(g, t, info) {
  const pd = atc(info, t, 'paid', 1.0), ti = atc(info, t, 'time', info.dur - 0.5), k = ease.inOut(clamp(t / info.dur)); g.save(); cam(g, lerp(1.15, 1.3, k), W / 2, H * 0.5);
  office(g, t, { sign: false }); sign(g, 'PAYOUTS', W * 0.5, H * 0.2, 400, 110, '#7a2a1e', '#ecd8a4', 54);
  drawChar(g, W * 0.72, H * 0.74, 1.25, CAST.clerk, keys(t, [[0, { expr: 'happy', legs: 'none', armL: [1.4, -0.6], armR: [0.12, 0.15] }]], 3));
  const reach = ease.inOut(prog(t, pd - 0.4, pd)), ex = lerp(W * 0.6, W * 0.42, reach); rrect(g, ex - 70, H * 0.47, 140, 90, 8); g.fillStyle = '#f2e6c8'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); bill(g, ex, H * 0.47 - 10, 0.9, -0.2); bill(g, ex + 20, H * 0.47 - 18, 0.9, 0.1);
  drawChar(g, W * 0.3, H * 0.78, 1.3, CAST.common, keys(t, [[0, { expr: 'nervous', legs: 'none', ...A('lap') }], [pd, { expr: 'surprised', armL: [0.12, 0.15], armR: [1.4, -0.4] }, 0.25], [pd + 0.6, { expr: 'laughing', ...A('cheer'), bob: -0.06 }, 0.3]], 2));
  rrect(g, W * 0.04, H * 0.62, W * 0.92, 70, 10); g.fillStyle = '#3a2416'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
  g.restore(); word(g, '+50%', W * 0.3, H * 0.1, prog(t, pd + 0.4, pd + 0.6), 150, '#8ac87a'); // clock "exactly on time"
  const ck = ease.outBack(prog(t, ti - 0.3, ti)); if (ck > 0) { g.save(); g.translate(W * 0.75, H * 0.1); g.scale(ck, ck); ell(g, 0, 0, 80, 80); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); seg(g, [[0, 0], [0, -55]], 8, INK); seg(g, [[0, 0], [38, 0]], 8, INK); g.restore(); text(g, '45 DAYS ✓', W * 0.75, H * 0.17, { size: 34, font: 'Nunito', weight: 900, color: '#2a8a4a', alpha: ck }); }
  vign(g, 0.35);
} });

// ---------- p07 "They told their friends. Their friends told everyone."  (word-of-mouth chain, 1 -> 2 -> 4 -> 16)
registerShot('p07', { draw(g, t, info) {
  const fr = atc(info, t, 'friends', 1.0), ev = atc(info, t, 'everyone', info.dur - 0.7); g.fillStyle = '#f4e8cc'; g.fillRect(0, 0, W, H); g.save(); g.globalAlpha = 0.25; for (let i = 0; i < 20; i++) { g.fillStyle = i % 2 ? '#e8d4a8' : '#f4e8cc'; g.fillRect(i * 60, 0, 60, H); } g.restore();
  const lvl = t < fr ? 1 : t < (fr + ev) / 2 ? 2 : t < ev ? 3 : 4, nums = [1, 1, 3, 7, 20];
  const rows = [[W / 2], [W * 0.3, W * 0.7], [W * 0.15, W * 0.38, W * 0.62, W * 0.85]]; const ry = [H * 0.36, H * 0.52, H * 0.68];
  for (let r = 0; r < Math.min(3, lvl); r++) { const a = ease.outBack(prog(t, [0, fr, (fr + ev) / 2][r] - 0.1, [0.2, fr + 0.2, (fr + ev) / 2 + 0.2][r])); rows[r].forEach((x, i) => { g.save(); g.translate(x, ry[r]); g.scale(a, a); drawChar(g, 0, 0, [1.0, 0.8, 0.62][r], [CAST.common, CAST.common2, CAST.rich, CAST.common][(i + r) % 4], { expr: lvl > r + 1 ? 'talk' : 'happy', t: t + i, legs: 'none', ...A(lvl > r + 1 ? 'open' : 'rest') }); g.restore(); if (r > 0) { const px = rows[r - 1][Math.floor(i / 2)]; g.save(); g.globalAlpha = a; g.setLineDash([12, 10]); g.lineWidth = 6; g.strokeStyle = '#c8302a'; g.beginPath(); g.moveTo(px, ry[r - 1] + 10); g.lineTo(x, ry[r] - 230 * [1, 0.8, 0.62][r]); g.stroke(); g.restore(); } }); }
  // speech bubbles "$$$"
  for (let r = 0; r < Math.min(3, lvl - 1); r++) rows[r].forEach((x, i) => { const yy = ry[r] - [1, 0.8, 0.62][r] * 420; g.save(); g.translate(x + 60, yy); const b = ease.outBack(prog(t, [fr, (fr + ev) / 2, ev][r] - 0.2, [fr, (fr + ev) / 2, ev][r] + 0.1)); g.scale(b, b); rrect(g, -60, -34, 120, 68, 30); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke(); text(g, '$$$', 0, 2, { size: 36, font: 'Nunito', weight: 900, color: '#2a8a4a' }); g.restore(); });
  if (lvl >= 4) { const a = ease.out(prog(t, ev, ev + 0.4)); g.save(); g.globalAlpha = a; crowd1920(g, -40, H * 0.82, W + 100, 1, 0.55, t, { seed: 12, expr: 'happy', bounce: true }); g.restore(); }
  word(g, `×${nums[lvl] * (lvl >= 4 ? 50 : 1)}`, W / 2, H * 0.1, 1, 130, '#c8302a', 0);
} });

// ---------- p08 "Soon, lines wrapped around the block."  (track along the queue to the door)
registerShot('p08', { draw(g, t, info) {
  const k = ease.inOut(clamp(t / info.dur)), cx = lerp(0, 1400, k); g.save(); cam(g, 1.15, W / 2, H * 0.55);
  street1920(g, W, H, cx, { baseY: H * 0.62 }); g.save(); g.translate(-cx, 0); sign(g, 'SECURITIES EXCHANGE CO.', 1400 + W * 0.5, H * 0.2, 560, 110, '#1e3a2a', '#ecd8a4', 38); g.restore();
  g.save(); g.translate(-cx * 1.0, 0); crowd1920(g, -200, H * 0.79, 1400 + W * 0.45 + 200, 2, 0.8, t, { seed: 21, expr: (i) => (i % 3 ? 'happy' : 'curious'), jitter: true }); g.restore();
  const car = ((t * 260) % (W + 900)) - 450; modelT(g, W - car + cx * 0.0, H * 0.86, 0.9, { dir: -1, spin: -t * 8 });
  g.restore(); vign(g, 0.3);
} });

// ---------- p09 "He was taking in a million dollars a week, stuffing cash into closets, drawers, even wastebaskets."
registerShot('p09', { draw(g, t, info) {
  const mi = atc(info, t, 'million', 0.8), cl = atc(info, t, 'closets', info.dur * 0.55), dr = atc(info, t, 'drawers', info.dur * 0.68), wa = atc(info, t, 'wastebaskets', info.dur * 0.8);
  g.save(); const k = ease.inOut(clamp(t / info.dur)); cam(g, lerp(1.25, 1.05, k), W / 2, H * 0.52); office(g, t, { sign: false });
  // closet bursting
  const cb = ease.outBack(prog(t, cl - 0.1, cl + 0.25)); rrect(g, W * 0.04, H * 0.24, 280, 520, 8); g.fillStyle = '#4a2e1e'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); if (cb > 0) { g.save(); g.translate(W * 0.04 + 140, H * 0.24 + 260); g.scale(cb, cb); for (let i = 0; i < 26; i++) bill(g, (i % 4 - 1.5) * 64, (Math.floor(i / 4) - 3) * 70, 1.1, (i * 0.7) % 1 - 0.5); g.restore(); g.save(); g.translate(W * 0.04 + 280, H * 0.24); g.rotate(-1.2 * cb); rrect(g, 0, 0, 20, 520, 6); g.fillStyle = '#5a3a26'; g.fill(); g.stroke(); g.restore(); }
  // desk with drawers spilling
  rrect(g, W * 0.3, H * 0.6, W * 0.66, 200, 10); g.fillStyle = '#3a2416'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); const dd = ease.out(prog(t, dr - 0.1, dr + 0.2)); for (let i = 0; i < 2; i++) { rrect(g, W * 0.68, H * 0.62 + i * 90 + dd * 30, 260, 70, 6); g.fillStyle = '#5a3a26'; g.fill(); g.stroke(); if (dd > 0) for (let j = 0; j < 4; j++) bill(g, W * 0.7 + 30 + j * 60, H * 0.62 + i * 90 + dd * 30 - 10, 0.8, j * 0.3); }
  drawChar(g, W * 0.52, H * 0.66, 1.4, P, keys(t, [[0, { expr: 'proud', legs: 'none', armsBehind: true, armL: [2.6, 1.9], armR: [2.6, 1.9], lean: -0.06 }], [mi, { expr: 'laughing' }], [wa, { expr: 'smug' }]], 1));
  // wastebasket stuffed
  const wb = ease.outBack(prog(t, wa - 0.1, wa + 0.2)); g.save(); g.translate(W * 0.18, H * 0.72); g.beginPath(); g.moveTo(-70, -110); g.lineTo(70, -110); g.lineTo(52, 40); g.lineTo(-52, 40); g.closePath(); g.fillStyle = '#6a6a74'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); if (wb > 0) for (let j = 0; j < 7; j++) bill(g, (j % 3 - 1) * 46, -110 - Math.floor(j / 3) * 30 * wb, 0.8, j * 0.5); g.restore();
  g.restore(); moneyRain(g, t, 18, 9, prog(t, mi, mi + 0.3) * 0.9);
  const v = Math.round(1000000 * ease.out(prog(t, mi - 0.1, mi + 0.9))); word(g, '$' + v.toLocaleString('en-US'), W / 2, H * 0.08, prog(t, mi - 0.1, mi + 0.1), 96, '#8ac87a', 0); text(g, 'EVERY WEEK', W / 2, H * 0.145, { size: 40, font: 'Nunito', weight: 900, color: '#ffffff', alpha: prog(t, mi + 0.5, mi + 0.8) }); vign(g, 0.35);
} });

// ---------- p10 "He bought a mansion. Then he bought a bank."
registerShot('p10', { draw(g, t, info) {
  const ba = atc(info, t, 'bank', info.dur * 0.65), sw = ease.inOut(prog(t, ba - 0.5, ba)); g.save(); cam(g, 1.1, lerp(W * 0.5, W * 1.5, sw), H * 0.52);
  skyGrad(g, W * 3, H, ['#f8c890', '#fbe8c8']); g.fillStyle = '#f8c890'; g.fillRect(-W, -H, W * 4, H); g.fillStyle = '#8ab84a'; g.fillRect(-W, H * 0.66, W * 4, H);
  // mansion
  const m = ease.outBack(prog(t, 0.1, 0.6)); g.save(); g.translate(W * 0.5, H * 0.66); g.scale(m, m); g.fillStyle = '#f2ece0'; g.fillRect(-420, -420, 840, 420); g.lineWidth = 8; g.strokeStyle = INK; g.strokeRect(-420, -420, 840, 420); g.fillStyle = '#7a3a2a'; g.beginPath(); g.moveTo(-460, -420); g.lineTo(0, -620); g.lineTo(460, -420); g.closePath(); g.fill(); g.stroke(); for (let i = 0; i < 5; i++) { g.fillStyle = '#e8e2d4'; g.fillRect(-340 + i * 170, -400, 34, 400); g.strokeRect(-340 + i * 170, -400, 34, 400); } for (let r = 0; r < 2; r++) for (let q = 0; q < 4; q++) { rrect(g, -300 + q * 170, -360 + r * 170, 70, 100, 6); g.fillStyle = '#bfe0f0'; g.fill(); g.stroke(); } rrect(g, -60, -160, 120, 160, 8); g.fillStyle = '#5a3a26'; g.fill(); g.stroke(); g.restore();
  const sd = prog(t, 0.6, 0.85); if (sd > 0) { g.save(); g.translate(W * 0.5, H * 0.3); g.rotate(-0.15); g.scale(1 + 0.5 * (1 - ease.out(sd)), 1 + 0.5 * (1 - ease.out(sd))); g.globalAlpha = sd; g.font = '900 110px Nunito'; g.strokeStyle = '#c8302a'; g.lineWidth = 12; const w2 = g.measureText('SOLD').width + 50; rrect(g, -w2 / 2, -70, w2, 130, 16); g.stroke(); g.fillStyle = '#c8302a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SOLD', 0, 4); g.restore(); }
  // bank
  g.save(); g.translate(W * 1.5, H * 0.66); g.fillStyle = '#d8d0c0'; g.fillRect(-420, -480, 840, 480); g.lineWidth = 8; g.strokeStyle = INK; g.strokeRect(-420, -480, 840, 480); g.beginPath(); g.moveTo(-460, -480); g.lineTo(0, -640); g.lineTo(460, -480); g.closePath(); g.fillStyle = '#c8c0b0'; g.fill(); g.stroke(); for (let i = 0; i < 6; i++) { g.fillStyle = '#ece6da'; g.fillRect(-360 + i * 140, -440, 50, 440); g.strokeRect(-360 + i * 140, -440, 50, 440); }
  const flip = ease.inOut(prog(t, ba + 0.2, ba + 0.6)); g.save(); g.translate(0, -560); g.scale(1, Math.abs(Math.cos(flip * Math.PI)) + 0.001); text(g, flip < 0.5 ? 'HANOVER TRUST' : 'PONZI', 0, 0, { size: flip < 0.5 ? 56 : 80, font: 'Playfair Display', weight: 900, color: flip < 0.5 ? '#3a3a3a' : '#c8302a' }); g.restore(); g.restore();
  drawChar(g, lerp(W * 0.25, W * 1.22, sw), H * 0.8, 1.25, P, keys(t, [[0, { expr: 'proud', armL: [0.12, 0.15], armR: [2.4, 0.4] }], [ba + 0.5, { expr: 'laughing', ...A('cheer') }]], 1));
  g.restore(); vign(g, 0.3);
} });

// ---------- p11 "But one reporter did the math. To pay everyone, he'd need 160 million coupons. There were only about 27,000 in the entire world."
registerShot('p11', { draw(g, t, info) {
  const ma = atc(info, t, 'math', 1.2), ne = atc(info, t, 'hundred', 3.0), tw = atc(info, t, 'twenty', 5.0), wo = atc(info, t, 'world', info.dur - 0.5);
  g.fillStyle = '#2a3a3a'; g.fillRect(0, 0, W, H); // chalkboard
  rrect(g, 40, H * 0.06, W - 80, H * 0.54, 14); g.fillStyle = '#2a4a3a'; g.fill(); g.lineWidth = 14; g.strokeStyle = '#7a5a3a'; g.stroke();
  const ch = (s, x, y, a, size = 56, col = '#f4f4ee') => text(g, s, x, y, { size, font: 'Nunito', weight: 900, color: col, alpha: a });
  ch('COUPONS NEEDED', W * 0.3, H * 0.13, prog(t, ne - 0.3, ne), 40); ch('COUPONS THAT EXIST', W * 0.72, H * 0.13, prog(t, tw - 0.3, tw), 40);
  const nb = ease.out(prog(t, ne, ne + 1.0)); g.fillStyle = '#e8b040'; g.fillRect(W * 0.18, H * 0.56 - nb * H * 0.36, W * 0.24, nb * H * 0.36); g.lineWidth = 6; g.strokeStyle = '#f4f4ee'; g.strokeRect(W * 0.18, H * 0.56 - nb * H * 0.36, W * 0.24, nb * H * 0.36);
  ch(Math.round(160000000 * nb).toLocaleString('en-US'), W * 0.3, H * 0.56 - nb * H * 0.36 - 40, prog(t, ne, ne + 0.2), 50, '#ffd23a');
  const eb = prog(t, tw, tw + 0.4); g.fillStyle = '#e85a4a'; g.fillRect(W * 0.6, H * 0.56 - 6 * eb, W * 0.24, 6 * eb); ch('27,000', W * 0.72, H * 0.56 - 50, eb, 50, '#ff8a7a');
  if (t > wo) { g.save(); g.globalAlpha = prog(t, wo, wo + 0.2); g.strokeStyle = '#ff5a4a'; g.lineWidth = 8; g.beginPath(); g.ellipse(W * 0.72, H * 0.535, 150, 50, 0, 0, TAU); g.stroke(); g.restore(); word(g, 'IMPOSSIBLE', W * 0.5, H * 0.62, prog(t, wo, wo + 0.2), 90, '#ff5a4a', -0.05); }
  // reporter below the board
  drawChar(g, W * 0.5, H * 0.84, 1.15, CAST.reporter, keys(t, [[0, { expr: 'suspicious', legs: 'none', armL: [0.12, 0.15], armR: [-0.3, -2.5] }], [ma, { expr: 'determined', armR: [1.5, -0.1] }, 0.3], [wo, { expr: 'shocked', ...A('shock') }, 0.2]], 4));
  vign(g, 0.35);
} });

// ---------- p12 "There was no loophole. He was paying old investors... with new investors' money."  (pyramid that runs out of people)
registerShot('p12', { draw(g, t, info) {
  const ol = atc(info, t, 'old', 2.0), nw = atc(info, t, 'new', info.dur - 1.2); g.fillStyle = '#1e2240'; g.fillRect(0, 0, W, H);
  const lv = [1, 2, 4, 8], top = H * 0.2, rh = H * 0.13; const grow = prog(t, 0.2, nw + 0.6) * 4;
  lv.forEach((n, r) => { const a = clamp(grow - r); if (a <= 0) return; const y = top + r * rh, w = (W * 0.92) * Math.max(n / 8, 0.2), sc = [1.0, 0.8, 0.6, 0.42][r];
    for (let i = 0; i < n; i++) { const x = W / 2 - w / 2 + (i + 0.5) * w / n; g.save(); g.translate(x, y + rh * 0.9); g.scale(a, a); drawChar(g, 0, 0, sc * 0.75, r === 0 ? P : [CAST.common, CAST.common2, CAST.rich, CAST.clerk][(i + r) % 4], { expr: r === 0 ? 'smug' : r === lv.length - 1 && t > nw + 0.8 ? 'worried' : 'happy', t: t + i, legs: 'none' }); g.restore(); }
    if (r > 0 && t > ol) { const f = ((t - ol) * 1.2) % 1; for (let i = 0; i < Math.min(n, 8); i++) { const x = W / 2 - w / 2 + (i + 0.5) * w / Math.min(n, 8); bill(g, lerp(x, W / 2, f * 0.3), y + rh * 0.4 - f * rh, 0.5, 0); } } });
  // the base runs out: an empty row of "?"
  if (t > nw + 0.5) { const a = prog(t, nw + 0.5, nw + 0.8); for (let i = 0; i < 10; i++) text(g, '?', W * 0.06 + i * W * 0.098, top + 4 * rh + rh * 0.55, { size: 64, font: 'Nunito', weight: 900, color: '#ff5a4a', alpha: a }); }
  const cr = prog(t, info.dur - 0.5, info.dur); if (cr > 0) { g.save(); g.strokeStyle = '#ff5a4a'; g.lineWidth = 8; g.beginPath(); g.moveTo(W * 0.5, top); for (let i = 1; i <= 6; i++) g.lineTo(W * 0.5 + (i % 2 ? 40 : -40), top + i * rh * cr * 0.9); g.stroke(); g.restore(); }
  word(g, 'OLD ← NEW', W / 2, H * 0.1, prog(t, ol, ol + 0.2), 100, '#ffd23a', 0); text(g, "paid with the next investor's money", W / 2, H * 0.165, { size: 36, font: 'Nunito', weight: 800, color: '#cfd8ff', alpha: prog(t, ol + 0.3, ol + 0.6) });
} });

// ---------- p13 "The headlines hit. The crowds turned. Banks collapsed."
registerShot('p13', { draw(g, t, info) {
  const hi = atc(info, t, 'hit', 0.6), tu = atc(info, t, 'turned', 1.6), ba = atc(info, t, 'banks', 2.4);
  if (t < tu - 0.1) { // spinning newspaper
    g.fillStyle = '#1a1a1e'; g.fillRect(0, 0, W, H); speedLines(g, W, H, 0.4); const k = ease.out(prog(t, 0, hi + 0.2)); g.save(); g.translate(W / 2, H * 0.47); g.rotate((1 - k) * 6); g.scale(k * 1.0, k * 1.0); rrect(g, -440, -560, 880, 1120, 6); g.fillStyle = '#f2ead6'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
    text(g, 'THE BOSTON POST', 0, -470, { size: 60, font: 'Playfair Display', weight: 900, color: '#1a1612' }); g.fillStyle = '#1a1612'; g.fillRect(-400, -420, 800, 8); text(g, 'PONZI SCHEME', 0, -320, { size: 100, font: 'Playfair Display', weight: 900, color: '#1a1612' }); text(g, 'EXPOSED!', 0, -200, { size: 120, font: 'Playfair Display', weight: 900, color: '#a8202a' });
    rrect(g, -380, -110, 340, 300, 4); g.fillStyle = '#d8d0bc'; g.fill(); g.save(); g.clip(); drawChar(g, -210, 320, 0.95, P, { expr: 'shocked', legs: 'none' }); g.restore(); g.fillStyle = '#9a9488'; for (let i = 0; i < 9; i++) g.fillRect(-10, -100 + i * 34, 390, 12); for (let i = 0; i < 6; i++) g.fillRect(-380, 230 + i * 34, i % 2 ? 560 : 760, 12); g.restore(); return; }
  // the angry crowd at the bank; Ponzi cornered by police; bank doors slam
  const [sx, sy] = shk(t, ba, 22, 0.5); g.save(); cam(g, 1.1, W / 2 + sx, H * 0.52 + sy); street1920(g, W, H, 900, { baseY: H * 0.64, night: true });
  g.fillStyle = '#c8c0b0'; g.fillRect(W * 0.18, H * 0.2, W * 0.64, H * 0.44); g.lineWidth = 8; g.strokeStyle = INK; g.strokeRect(W * 0.18, H * 0.2, W * 0.64, H * 0.44); text(g, 'BANK', W / 2, H * 0.25, { size: 70, font: 'Playfair Display', weight: 900, color: '#3a3a3a' });
  const sl = ease.in(prog(t, ba - 0.05, ba + 0.12)); g.fillStyle = '#4a2e1e'; g.fillRect(W * 0.36, H * 0.38, W * 0.14 * sl, H * 0.26); g.fillRect(W * 0.64 - W * 0.14 * sl, H * 0.38, W * 0.14 * sl, H * 0.26); g.strokeRect(W * 0.36, H * 0.38, W * 0.28, H * 0.26);
  if (sl >= 1) { rrect(g, W * 0.38, H * 0.45, W * 0.24, 70, 6); g.fillStyle = '#f4ecd8'; g.fill(); g.stroke(); text(g, 'CLOSED', W / 2, H * 0.45 + 37, { size: 48, font: 'Nunito', weight: 900, color: '#c8302a' }); }
  crowd1920(g, -60, H * 0.86, W + 200, 2, 0.95, t, { seed: 31, expr: () => 'angry', bounce: true, arms: (i, r, tt) => ((i + r) % 2 ? { armL: [0.12, 0.15], armR: [2.6 + Math.sin(tt * 8) * 0.2, 0.6] } : A('fist')) });
  g.fillStyle = '#2a2a36'; g.fillRect(-W, H * 0.8, W * 3, H); g.fillStyle = '#3a3a46'; g.fillRect(-W, H * 0.8, W * 3, 12);
  g.restore(); word(g, 'BANKS COLLAPSE!', W / 2, H * 0.1, prog(t, ba, ba + 0.2), 100, '#ff5a4a', -0.04); vign(g, 0.45);
} });

// ---------- p14 "Forty thousand people lost twenty million dollars."  (+ the arrest)
registerShot('p14', { draw(g, t, info) {
  const fo = atc(info, t, 'forty', 0.1), tw = atc(info, t, 'twenty', info.dur * 0.55); g.fillStyle = '#20222e'; g.fillRect(0, 0, W, H);
  g.save(); cam(g, 1.0, W / 2, H * 0.5); street1920(g, W, H, 1500, { baseY: H * 0.62, night: true });
  drawChar(g, W * 0.24, H * 0.79, 1.25, CAST.cop, keys(t, [[0, { expr: 'determined', armL: [0.12, 0.15], armR: [-0.7, -0.9] }]], 5)); drawChar(g, W * 0.76, H * 0.79, 1.25, CAST.cop, keys(t, [[0, { expr: 'angry', armL: [-0.7, -0.9], armR: [0.12, 0.15] }]], 6));
  drawChar(g, W * 0.5, H * 0.79, 1.3, P, keys(t, [[0, { expr: 'worried', armL: [-0.15, -1.4], armR: [-0.15, -1.4] }], [tw, { expr: 'defeated' in {} ? 'sad' : 'sad', lookY: 0.6, tilt: 0.1 }, 0.5]], 1));
  ell(g, W * 0.5, H * 0.79 - 1.3 * 100 * 1.3, 40, 18); g.lineWidth = 8; g.strokeStyle = '#c8ccd8'; g.stroke(); // cuffs
  g.restore(); // numbers in the top band
  const a1 = prog(t, fo, fo + 0.3), a2 = prog(t, tw, tw + 0.3); word(g, Math.round(40000 * ease.out(prog(t, fo, fo + 1.0))).toLocaleString('en-US') + ' PEOPLE', W / 2, H * 0.08, a1, 80, '#ffffff', 0); word(g, '$' + Math.round(20000000 * ease.out(prog(t, tw, tw + 1.0))).toLocaleString('en-US') + ' GONE', W / 2, H * 0.16, a2, 80, '#ff5a4a', 0); vign(g, 0.5);
} });

// ---------- p15 "He died broke, in a charity hospital in Brazil."
registerShot('p15', { draw(g, t, info) {
  const k = ease.inOut(clamp(t / info.dur)); g.save(); cam(g, lerp(1.0, 1.25, k), W / 2, H * 0.5);
  g.fillStyle = '#3a4a5a'; g.fillRect(-W, -H, W * 3, H * 3); g.fillStyle = '#2e3c4a'; g.fillRect(-W, H * 0.66, W * 3, H * 2);
  rrect(g, W * 0.58, H * 0.12, 340, 400, 8); g.fillStyle = '#1e2a3a'; g.fill(); g.save(); g.clip(); for (let i = 0; i < 40; i++) { const x = W * 0.58 + (i * 37) % 340, y = H * 0.12 + ((t * 600 + i * 97) % 400); g.strokeStyle = 'rgba(180,200,230,.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 8, y + 30); g.stroke(); } g.restore(); g.lineWidth = 12; g.strokeStyle = '#d8dce4'; g.strokeRect(W * 0.58, H * 0.12, 340, 400);
  text(g, 'RIO DE JANEIRO · 1949', W * 0.3, H * 0.2, { size: 38, font: 'Nunito', weight: 900, color: '#cfd8e8', alpha: prog(t, 0.3, 0.8) });
  rrect(g, W * 0.08, H * 0.56, W * 0.84, 120, 14); g.fillStyle = '#e8ecf2'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); rrect(g, W * 0.08, H * 0.44, 60, 260, 10); g.fillStyle = '#8a9aaa'; g.fill(); g.stroke();
  rrect(g, W * 0.12, H * 0.5, 220, 90, 40); g.fillStyle = '#ffffff'; g.fill(); g.stroke();
  g.save(); g.translate(W * 0.42, H * 0.55); g.rotate(-Math.PI / 2 + 0.03); drawChar(g, 0, 0, 0.95, CAST.ponziOld, { expr: 'tired', t, legs: 'none', ...A('lap') }); g.restore();
  g.beginPath(); g.moveTo(W * 0.24, H * 0.53); for (let x = W * 0.24; x < W * 0.9; x += 30) g.lineTo(x, H * 0.54 - Math.sin(x * 0.02) * 10); g.lineTo(W * 0.92, H * 0.66); g.lineTo(W * 0.22, H * 0.66); g.closePath(); g.fillStyle = '#c8d4e4'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
  // his only belongings: an old boater hat on the chair
  rrect(g, W * 0.72, H * 0.6, 160, 160, 10); g.fillStyle = '#6a5a4a'; g.fill(); g.stroke(); g.save(); g.translate(W * 0.72 + 80, H * 0.6 - 10); ell(g, 0, 0, 90, 18); g.fillStyle = '#c8b888'; g.fill(); g.stroke(); rrect(g, -55, -50, 110, 50, 8); g.fill(); g.stroke(); g.fillStyle = '#7a2a2a'; g.fillRect(-55, -22, 110, 12); g.restore();
  g.restore(); sepia(g, 0.2); vign(g, 0.55);
} });

// ---------- p16 "But his name never died. Because every scam that pays you with someone else's money... is still called a Ponzi scheme."
registerShot('p16', { draw(g, t, info) {
  const ev = atc(info, t, 'every', 1.6), ca = atc(info, t, 'called', info.dur - 1.6), sc = atc(info, t, 'scheme', info.dur - 0.7);
  if (t < ev - 0.1) { // dictionary entry
    g.fillStyle = '#e8dcc0'; g.fillRect(0, 0, W, H); g.save(); g.translate(W / 2, H * 0.45); g.rotate(-0.03); rrect(g, -440, -460, 880, 920, 8); g.fillStyle = '#fbf6e8'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
    text(g, 'Pon·zi scheme', 0, -360, { size: 76, font: 'Playfair Display', weight: 900, color: '#1a1612' }); text(g, '/ˈpɒnzi skiːm/  noun', 0, -290, { size: 36, font: 'Playfair Display', weight: 700, color: '#6a5a4a' });
    g.fillStyle = '#9a9488'; for (let i = 0; i < 6; i++) g.fillRect(-380, -220 + i * 40, i % 2 ? 640 : 760, 14); rrect(g, -160, 60, 320, 340, 6); g.fillStyle = '#d8d0bc'; g.fill(); g.stroke(); g.save(); g.clip(); drawChar(g, 0, 480, 1.2, P, { expr: 'smug', legs: 'none', t }); g.restore(); g.restore(); vign(g, 0.3); return; }
  // today: a phone ad with the same promise; his reflection winks
  g.fillStyle = '#0e1222'; g.fillRect(0, 0, W, H); const k = ease.outBack(prog(t, ev - 0.1, ev + 0.3)); g.save(); g.translate(W / 2, H * 0.47); g.scale(k, k);
  rrect(g, -300, -560, 600, 1120, 60); g.fillStyle = '#1a1a22'; g.fill(); g.lineWidth = 10; g.strokeStyle = '#3a3a4a'; g.stroke(); rrect(g, -270, -500, 540, 1000, 30); g.fillStyle = '#f4f6fa'; g.fill();
  rrect(g, -240, -460, 480, 110, 20); g.fillStyle = '#ffd23a'; g.fill(); text(g, 'GUARANTEED', 0, -420, { size: 50, font: 'Nunito', weight: 900, color: INK }); text(g, '50% RETURNS!', 0, -372, { size: 46, font: 'Nunito', weight: 900, color: '#c8302a' });
  g.strokeStyle = '#2a8a4a'; g.lineWidth = 12; g.beginPath(); g.moveTo(-220, 120); for (let i = 0; i <= 10; i++) g.lineTo(-220 + i * 44, 120 - Math.pow(i / 10, 2) * 360 * clamp((t - ev) / 1.2)); g.stroke();
  rrect(g, -200, 220, 400, 110, 55); g.fillStyle = '#2a8a4a'; g.fill(); text(g, 'INVEST NOW', 0, 278, { size: 52, font: 'Nunito', weight: 900, color: '#fff' }); g.restore();
  const pk = ease.outBack(prog(t, ca - 0.2, ca + 0.3)); if (pk > 0) { g.save(); g.globalAlpha = 0.9 * pk; drawChar(g, W * 0.5, H * 0.78, 1.6, P, keys(t, [[0, { expr: 'smug', legs: 'none', armL: [0.12, 0.15], armR: [0.6, -2.3] }], [sc, { expr: 'laughing' }]], 1)); g.restore(); }
  word(g, 'PONZI SCHEME', W / 2, H * 0.1, prog(t, sc - 0.1, sc + 0.15), 120, '#ff5a4a', -0.04); veil(g, '#000', ease.in(prog(t, info.dur - 0.4, info.dur)) * 0.6);
} });

