// shots/q3.js: v5 rebuilds, painted 2D. q11 mansion vs bank (two different worlds), q12 "nobody asks" payout queue ->
// money chute from the dark, q15 headlines -> angry crowd -> six banks collapse one after another.
import { E, registerShot, ease, prog, clamp, lerp, text, rng } from '/engine/core.js';
import { local } from '../sets/ui.js';
import { drawBean, PLUM } from '../sets/bean.js';
import { B } from '../sets/cast_bean.js';
import { grad, glow, softCloud, sky, skyline, dome, woodPanel, vignette, lightRays, litChar, headline, note } from '../sets/paint2d.js';

const W = E.W, H = E.H, TAU = Math.PI * 2;
const atc = (info, t, w, fb) => { const x = local(info, t, w); return x == null || x < -0.2 || x > info.dur ? fb : x; };
const cam = (g, z, cx, cy, rot = 0) => { g.translate(W / 2, H / 2); g.rotate(rot); g.scale(z, z); g.translate(-cx, -cy); };
function keys(t, K) { let cur = { armL: [0.1, 0.12], armR: [0.1, 0.12], tilt: 0, lean: 0, look: 0, lookY: 0, bob: 0, ...K[0][1] }; for (let i = 1; i < K.length; i++) { const [t0, p, d = 0.3] = K[i]; if (t < t0) break; const k = ease.outBack(clamp((t - t0) / d)), nx = { ...cur, ...p }; for (const f of ['armL', 'armR', 'tilt', 'lean', 'look', 'lookY', 'bob']) { const a = cur[f], b = nx[f]; if (Array.isArray(b)) nx[f] = b.map((v, j) => lerp(a ? a[j] : v, v, k)); else if (typeof b === 'number') nx[f] = lerp(a ?? b, b, k); } cur = nx; } cur.tilt += Math.sin(t * 1.5) * 0.025; cur.bob += Math.sin(t * 2.2) * 0.008; cur.t = t; cur.blink = ((t + 0.7) % 3.1) < 0.1; return cur; }
const ink = (g, w = 6) => { g.lineWidth = w; g.strokeStyle = PLUM; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); };
const rect = (g, x, y, w, h, fill, lw = 6) => { g.beginPath(); g.rect(x, y, w, h); g.fillStyle = fill; g.fill(); ink(g, lw); };

// ---------------------------------------------------------------- MANSION: red-brick Georgian estate, golden hour
function tree(g, x, y, s, c1 = '#3e7a34', c2 = '#5ea048') { g.fillStyle = '#4a3020'; g.fillRect(x - 12 * s, y - 120 * s, 24 * s, 120 * s); for (const [dx, dy, r, c] of [[0, -230, 110, c1], [-70, -170, 85, c1], [70, -175, 90, c1], [-20, -260, 70, c2], [40, -210, 60, c2]]) { g.beginPath(); g.arc(x + dx * s, y + dy * s, r * s, 0, TAU); g.fillStyle = c; g.fill(); ink(g, 5); } }
function mansion(g, t, cx, base) {
  const w = W * 0.86, h = H * 0.25, x = cx - w / 2, y = base - h;
  // slate hip roof + chimneys with smoke
  for (const ch of [x + w * 0.2, x + w * 0.8]) { rect(g, ch - 26, y - 230, 52, 130, '#8a3a28'); g.fillStyle = '#5a2418'; g.fillRect(ch - 32, y - 238, 64, 16); for (let k = 0; k < 4; k++) { const u = ((t * 0.35 + k / 4) % 1); g.save(); g.globalAlpha = 0.35 * (1 - u); g.beginPath(); g.arc(ch + u * 60 + Math.sin(u * 6) * 12, y - 250 - u * 220, 20 + u * 40, 0, TAU); g.fillStyle = '#e8e4e0'; g.fill(); g.restore(); } }
  g.beginPath(); g.moveTo(x - 30, y + 6); g.lineTo(x + w * 0.16, y - 170); g.lineTo(x + w * 0.84, y - 170); g.lineTo(x + w + 30, y + 6); g.closePath(); g.fillStyle = grad(g, 0, y - 170, 0, y, [[0, '#4a5068'], [1, '#2e3448']]); g.fill(); ink(g, 7);
  g.save(); g.clip(); g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 3; for (let r = y - 160; r < y; r += 22) { g.beginPath(); g.moveTo(x - 30, r); g.lineTo(x + w + 30, r); g.stroke(); } g.restore();
  // dormers
  for (const dx of [0.33, 0.5, 0.67]) { const dxp = x + w * dx; g.beginPath(); g.moveTo(dxp - 44, y - 40); g.lineTo(dxp - 44, y - 100); g.lineTo(dxp, y - 140); g.lineTo(dxp + 44, y - 100); g.lineTo(dxp + 44, y - 40); g.closePath(); g.fillStyle = '#f2ece0'; g.fill(); ink(g, 5); rect(g, dxp - 22, y - 96, 44, 50, '#ffd890', 4); }
  // brick body
  g.beginPath(); g.rect(x, y, w, h); g.fillStyle = grad(g, x, 0, x + w, 0, [[0, '#b0503a'], [0.6, '#9a4230'], [1, '#7a3020']]); g.fill(); g.save(); g.clip(); g.strokeStyle = 'rgba(60,20,10,.25)'; g.lineWidth = 2; for (let r = 0, yy = y; yy < y + h; yy += 18, r++) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); for (let xx = x + (r % 2) * 22; xx < x + w; xx += 44) { g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx, yy + 18); g.stroke(); } } g.restore(); ink(g, 7);
  g.fillStyle = '#f4efe4'; g.fillRect(x - 8, y - 4, w + 16, 22); g.strokeRect(x - 8, y - 4, w + 16, 22); g.fillRect(x - 8, y + h * 0.46, w + 16, 12);
  // tall white-framed windows glowing warm, shutters
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { if (r === 1 && (i === 2 || i === 3)) continue; const wx = x + w * (0.08 + i * 0.163), wy = y + 40 + r * h * 0.47, ww = 62, wh = h * 0.3; g.fillStyle = '#2e4a3a'; g.fillRect(wx - 22, wy, 18, wh); g.fillRect(wx + ww + 4, wy, 18, wh); rect(g, wx, wy, ww, wh, grad(g, 0, wy, 0, wy + wh, [[0, '#fff2c0'], [1, '#f0b860']]), 5); g.lineWidth = 4; g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.moveTo(wx, wy + wh / 2); g.lineTo(wx + ww, wy + wh / 2); g.stroke(); }
  // white portico with round pediment + double door
  const px = cx; rect(g, px - 130, y + h * 0.5, 260, h * 0.5, '#f4efe4'); g.beginPath(); g.moveTo(px - 160, y + h * 0.5); g.quadraticCurveTo(px, y + h * 0.2, px + 160, y + h * 0.5); g.closePath(); g.fillStyle = '#fbf8f0'; g.fill(); ink(g, 6);
  for (const d of [-1, 1]) { g.fillStyle = grad(g, px + d * 110 - 14, 0, px + d * 110 + 14, 0, [[0, '#ffffff'], [1, '#d8d0c0']]); g.fillRect(px + d * 110 - 14, y + h * 0.5, 28, h * 0.5); g.strokeRect(px + d * 110 - 14, y + h * 0.5, 28, h * 0.5); }
  rect(g, px - 60, y + h * 0.62, 120, h * 0.38, '#2e5a44'); g.beginPath(); g.moveTo(px, y + h * 0.62); g.lineTo(px, base); ink(g, 4); for (const d of [-1, 1]) { g.beginPath(); g.arc(px + d * 14, y + h * 0.82, 6, 0, TAU); g.fillStyle = '#e8b840'; g.fill(); }
  // front: gravel drive, hedges, fountain, iron gate posts
  g.fillStyle = grad(g, 0, base, 0, base + 90, [[0, '#e8dcc0'], [1, '#c8b890']]); g.beginPath(); g.moveTo(cx - 200, base); g.lineTo(cx + 200, base); g.lineTo(cx + 500, base + 140); g.lineTo(cx - 500, base + 140); g.closePath(); g.fill();
  for (const d of [-1, 1]) for (let k = 0; k < 3; k++) { const hx = cx + d * (260 + k * 120); g.beginPath(); g.ellipse(hx, base + 10, 64, 40, 0, Math.PI, 0); g.fillStyle = k % 2 ? '#3e7a34' : '#4a8a3a'; g.fill(); ink(g, 5); }
  for (const d of [-1, 1]) { const gx = cx + d * w * 0.56; rect(g, gx - 22, base - 120, 44, 170, '#e8e0d0'); g.beginPath(); g.arc(gx, base - 132, 24, 0, TAU); g.fillStyle = '#e8e0d0'; g.fill(); ink(g, 5); }
}

// ---------------------------------------------------------------- BANK: dark granite temple of money on a cool plaza
function bankBuilding(g, t, cx, base, flip, open, o = {}) {
  const w = W * 0.9, h = H * 0.33, x = cx - w / 2, y = base - h;
  // granite steps
  for (let k = 0; k < 4; k++) { const sw = w + 80 - k * 30; rect(g, cx - sw / 2, base - 22 - k * 22 + 66, sw, 22, k % 2 ? '#5a6070' : '#646a7a', 4); }
  const bb = base - 22;
  // body: dark granite blocks
  g.beginPath(); g.rect(x, y, w, bb - y); g.fillStyle = grad(g, x, 0, x + w, 0, [[0, '#6a7080'], [0.5, '#7a8090'], [1, '#4e5464']]); g.fill(); g.save(); g.clip(); g.strokeStyle = 'rgba(20,24,34,.35)'; g.lineWidth = 3; for (let r = 0, yy = y; yy < bb; yy += 46, r++) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); for (let xx = x + (r % 2) * 60; xx < x + w; xx += 120) { g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx, yy + 46); g.stroke(); } } g.restore(); ink(g, 7);
  // massive pediment with gold acroteria
  g.beginPath(); g.moveTo(x - 40, y); g.lineTo(cx, y - h * 0.36); g.lineTo(x + w + 40, y); g.closePath(); g.fillStyle = grad(g, 0, y - h * 0.36, 0, y, [[0, '#8a90a0'], [1, '#5a6070']]); g.fill(); ink(g, 7); g.beginPath(); g.moveTo(x + 40, y - 14); g.lineTo(cx, y - h * 0.3); g.lineTo(x + w - 40, y - 14); g.closePath(); ink(g, 4);
  // big clock in the pediment
  g.beginPath(); g.arc(cx, y - h * 0.15, 56, 0, TAU); g.fillStyle = '#f4ead2'; g.fill(); ink(g, 6); g.save(); g.translate(cx, y - h * 0.15); g.rotate(t * 2); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -42); ink(g, 5); g.rotate(-t * 2 + t * 0.2); g.beginPath(); g.moveTo(0, 0); g.lineTo(28, 0); ink(g, 6); g.restore();
  // entablature band for the sign
  g.fillStyle = '#3a3e4a'; g.fillRect(x - 20, y, w + 40, 80); g.strokeRect(x - 20, y, w + 40, 80);
  const old = 'HANOVER TRUST', nw = 'PONZI TRUST', len = old.length; g.font = '900 56px "Playfair Display"'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let i = 0; i < len; i++) { const ch0 = old[i] || ' ', ch1 = ' PONZI  TRUST'[i] || ' ', ti = clamp((flip * len - i) / 1.5), sc = Math.abs(Math.cos(ti * Math.PI)), ch = ti < 0.5 ? ch0 : ch1, lx = cx + (i - (len - 1) / 2) * 54; g.save(); g.translate(lx, y + 42); g.scale(1, Math.max(0.05, sc)); g.fillStyle = ti >= 0.5 ? '#ffd040' : '#c8ccd8'; if (ti >= 0.5) { g.shadowColor = '#ffd870'; g.shadowBlur = 22; } g.fillText(ch, 0, 2); g.restore(); }
  // fluted columns
  const n = 6; for (let i = 0; i < n; i++) { const c = x + 70 + i * (w - 140) / (n - 1); g.fillStyle = grad(g, c - 30, 0, c + 30, 0, [[0, '#a8aebc'], [0.45, '#d8dce6'], [1, '#6a7080']]); g.fillRect(c - 28, y + 96, 56, bb - y - 120); g.lineWidth = 4; g.strokeStyle = PLUM; g.strokeRect(c - 28, y + 96, 56, bb - y - 120); g.strokeStyle = 'rgba(40,44,60,.35)'; g.lineWidth = 3; for (const f of [-14, 0, 14]) { g.beginPath(); g.moveTo(c + f, y + 104); g.lineTo(c + f, bb - 30); g.stroke(); } rect(g, c - 38, y + 82, 76, 18, '#c8ccd8', 4); rect(g, c - 38, bb - 26, 76, 18, '#c8ccd8', 4); }
  // bronze doors (centre bay) that swing open onto a gold vault
  const dw = 150, dh = h * 0.5, dx = cx, dy = bb - dh; g.save(); g.beginPath(); g.rect(dx - dw, dy, dw * 2, dh); g.fillStyle = '#1a1206'; g.fill(); g.clip();
  if (open > 0) { glow(g, dx, dy + dh * 0.6, 420 * open, 'rgba(255,200,80,.95)', open); for (let r = 0; r < 4; r++) for (let k = 0; k < 6 - r; k++) { const gx = dx - 110 + k * 40 + r * 20, gy = bb - 30 - r * 26; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + 36, gy); g.lineTo(gx + 30, gy - 22); g.lineTo(gx + 6, gy - 22); g.closePath(); g.fillStyle = grad(g, gx, gy - 22, gx + 36, gy, [[0, '#fff0a0'], [1, '#d89820']]); g.fill(); ink(g, 3); } }
  g.restore();
  for (const d of [-1, 1]) { const sw = Math.cos(open * 1.35); g.save(); g.translate(dx + d * dw, dy); g.scale(sw, 1); g.beginPath(); g.rect(d > 0 ? -dw : 0, 0, dw, dh); g.fillStyle = grad(g, -dw, 0, dw, 0, [[0, '#7a4a1a'], [0.5, '#c88a3a'], [1, '#6a3a14']]); g.fill(); ink(g, 5); for (let k = 0; k < 3; k++) { g.beginPath(); g.rect((d > 0 ? -dw : 0) + 18, 20 + k * (dh - 40) / 3, dw - 36, (dh - 40) / 3 - 14); ink(g, 3); } g.restore(); }
  rect(g, dx - dw - 10, dy - 16, dw * 2 + 20, 18, '#3a3e4a', 4);
  // flags
  for (const d of [-1, 1]) { const fx = cx + d * (w / 2 + 70); g.fillStyle = '#d8d8e0'; g.fillRect(fx - 5, y - 260, 10, bb - y + 300); g.save(); g.translate(fx, y - 250); for (let k = 0; k < 6; k++) { const wv = Math.sin(t * 6 + k) * 8; g.fillStyle = k % 2 ? '#f4f4f4' : '#c8202a'; g.beginPath(); g.moveTo(d * 6, k * 14); g.quadraticCurveTo(d * 60, k * 14 + wv, d * 120, k * 14 + wv * 1.4); g.lineTo(d * 120, k * 14 + 14 + wv * 1.4); g.quadraticCurveTo(d * 60, k * 14 + 14 + wv, d * 6, k * 14 + 14); g.fill(); } g.restore(); }
}
function plaza(g, t) { sky(g, [[0, '#1e3a5a'], [0.55, '#4a7aa0'], [1, '#c8d8e0']], { clouds: 5, cloudCol: '#e0e8f0', t, seed: 21, h: H * 0.62 }); skyline(g, H * 0.6, '#3a4a60', { seed: 13, scale: 1.3, tall: 1.4, windows: 0.25, winCol: '#ffe0a0' });
  g.fillStyle = grad(g, 0, H * 0.66, 0, H, [[0, '#7a7a84'], [1, '#4a4a54']]); g.fillRect(0, H * 0.66, W, H); g.strokeStyle = 'rgba(30,30,40,.25)'; g.lineWidth = 2; for (let r = 0; r < 14; r++) { const yy = H * 0.66 + r * r * 3.4; g.beginPath(); g.moveTo(0, yy); g.lineTo(W, yy); g.stroke(); } for (let i = -12; i < 14; i++) { g.beginPath(); g.moveTo(W / 2 + i * 40, H * 0.66); g.lineTo(W / 2 + i * 180, H); g.stroke(); } }

registerShot('q11', { draw(g, t, info) {
  const ma = atc(info, t, 'mansion', 0.6), wh = atc(info, t, 'why', 2.2), ba = atc(info, t, 'bank', 3.3), cut = wh + 0.15, whip = prog(t, wh - 0.1, wh + 0.4);
  if (t < cut) { // ---- MANSION: golden hour estate, slow push-in, SOLD sign slams, Ponzi spreads his arms
    const z = 1 + 0.06 * ease.inOut(clamp(t / cut)); g.save(); cam(g, z, W / 2 + whip * W * 0.5, H * 0.5);
    sky(g, [[0, '#f08a50'], [0.5, '#ffc070'], [1, '#ffe8b0']], { sun: [W * 0.2, H * 0.3, 460], clouds: 6, cloudCol: '#ffe0c0', t, seed: 31, h: H * 0.62 });
    g.fillStyle = grad(g, 0, H * 0.6, 0, H, [[0, '#7ab040'], [1, '#3e7a24']]); g.fillRect(-W, H * 0.6, W * 3, H);
    tree(g, W * 0.02, H * 0.66, 1.4); tree(g, W * 0.98, H * 0.66, 1.5, '#2e6a2a', '#4e9040');
    mansion(g, t, W / 2, H * 0.66); lightRays(g, W * 0.2, H * 0.3, 0.6, 0.6, H, 'rgba(255,220,150,.5)', 0.12);
    const sd = ease.outBack(prog(t, ma + 0.15, ma + 0.4)); if (sd > 0) { g.save(); g.translate(W * 0.84, H * 0.79); g.fillStyle = '#5a3a24'; g.fillRect(-7, -170, 14, 170); g.translate(0, -190); g.rotate(Math.sin((t - ma) * 9) * 0.06 * Math.exp(-(t - ma) * 3)); g.scale(sd, sd); g.beginPath(); g.roundRect(-120, -55, 240, 110, 10); g.fillStyle = '#f4ead2'; g.fill(); ink(g, 6); g.fillStyle = '#c8202a'; g.font = '900 70px "Playfair Display"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SOLD', 0, 4); g.restore(); }
    const P = keys(t, [[0, { expr: 'proud', legs: 'stand', armL: [0.1, 0.12], armR: [0.1, 0.12] }], [ma, { expr: 'excited', armL: [2.3, 0.3], armR: [2.3, 0.3], handL: 'open', handR: 'open' }, 0.35]]);
    litChar(g, W * 0.3, H * 0.8, 1.3, B.ponzi, P, { light: -1 }); g.restore();
    if (whip > 0) { g.save(); g.globalAlpha = whip; g.fillStyle = '#ffe0b0'; for (let i = 0; i < 40; i++) g.fillRect(0, (i / 40) * H, W, 10 + (i % 3) * 8); g.restore(); }
    vignette(g, 0.3); headline(g, ['A MANSION.'], W / 2, H * 0.09, 120, ma, t, { fill: '#ffffff' });
  } else { // ---- BANK: cool granite plaza, sign flips to gold, bronze doors open on a gold vault, Ponzi flips a coin
    const k = prog(t, cut, cut + 0.35), z = 1.12 - 0.08 * ease.out(prog(t, cut, info.dur)); g.save(); cam(g, z, W / 2 - (1 - ease.out(k)) * W * 0.5, H * 0.5);
    plaza(g, t); bankBuilding(g, t, W / 2, H * 0.68, prog(t, ba - 0.45, ba + 0.05), ease.inOut(prog(t, ba - 0.15, ba + 0.3)));
    const cf = (t - ba + 0.4) / 0.7; const P = keys(t, [[0, { expr: 'smug', legs: 'stand', armL: [0.1, 0.12], armR: [0.4, -0.3] }], [ba - 0.2, { expr: 'laughing', armR: [1.7, 0.3], handR: 'open' }, 0.25]]);
    litChar(g, W * 0.24, H * 0.82, 1.25, B.ponzi, P, { light: 1 });
    if (cf > 0 && cf < 1) { const cx2 = W * 0.33, cy2 = H * 0.46 - Math.sin(cf * Math.PI) * 300; g.save(); g.translate(cx2, cy2); g.scale(Math.cos(cf * 30), 1); g.beginPath(); g.arc(0, 0, 26, 0, TAU); g.fillStyle = '#f0c040'; g.fill(); ink(g, 4); g.restore(); }
    if (t > ba) { const R = rng(7); for (let i = 0; i < 18; i++) { const u = clamp((t - ba) / 0.7), a = -Math.PI / 2 + (R() - 0.5) * 2.2, d = 80 + 460 * ease.out(u) * R(); g.save(); g.globalAlpha = 1 - u * u; g.translate(W * 0.5 + Math.cos(a) * d, H * 0.6 + Math.sin(a) * d + u * u * 320); g.rotate(u * 8 + i); g.beginPath(); g.ellipse(0, 0, 20, 9, 0, 0, TAU); g.fillStyle = '#f4c640'; g.fill(); ink(g, 3); g.restore(); } }
    g.restore(); if (k < 1) { g.save(); g.globalAlpha = 1 - k; g.fillStyle = '#c8d8e8'; for (let i = 0; i < 40; i++) g.fillRect(0, (i / 40) * H, W, 10 + (i % 3) * 8); g.restore(); }
    vignette(g, 0.4, '4,8,20'); headline(g, ['A BANK.'], W / 2, H * 0.09, 130, ba - 0.25, t, { fill: '#ffd23a' });
  }
} });

// ---------------------------------------------------------------- q12 NOBODY ASKS: happy payout queue, one raised hand gets shushed,
// then the camera slides past the window to a money chute dropping cash out of the dark
registerShot('q12', { draw(g, t, info) {
  const as = atc(info, t, 'asks', 0.5), ob = atc(info, t, 'obvious', 1.0), qu = atc(info, t, 'question', 1.5), ev = atc(info, t, 'everyone', 2.0), wh = atc(info, t, 'where', 3.0), mo = atc(info, t, 'money', 3.4);
  const pk = ease.inOut(prog(t, wh - 0.35, wh + 0.5)); g.save(); cam(g, lerp(1, 1.18, pk), lerp(W * 0.5, W * 1.38, pk), lerp(H * 0.5, H * 0.42, pk));
  // world: warm wood office (0..1.1W), dark back room (1.1W..2W)
  g.fillStyle = '#2a1a10'; g.fillRect(-W * 0.2, -H * 0.5, W * 2.6, H * 2); woodPanel(g, -W * 0.2, 0, W * 1.3, H * 0.66, '#7a4a2a', 3); g.fillStyle = grad(g, 0, H * 0.66, 0, H, [[0, '#5a3420'], [1, '#2a160c']]); g.fillRect(-W * 0.2, H * 0.66, W * 1.3, H);
  for (const lx of [W * 0.2, W * 0.6]) glow(g, lx, H * 0.2, 340, 'rgba(255,200,120,.5)', 0.8);
  // poster on the wall
  g.save(); g.translate(W * 0.36, H * 0.26); g.rotate(-0.03); rect(g, -150, -100, 300, 200, '#f4ead2', 5); text(g, '50% IN', 0, -40, { size: 56, font: 'Playfair Display', weight: 900, color: '#9a1e2c' }); text(g, '45 DAYS', 0, 30, { size: 56, font: 'Playfair Display', weight: 900, color: '#1a1612' }); g.restore();
  // back room: bricks in shadow, chute from the dark ceiling
  const bx = W * 1.1; g.fillStyle = grad(g, bx, 0, bx + W, 0, [[0, '#1a1214'], [1, '#08060a']]); g.fillRect(bx, -H * 0.5, W * 1.2, H * 2); g.strokeStyle = 'rgba(80,50,40,.35)'; g.lineWidth = 2; for (let r = 0, yy = -H * 0.5; yy < H; yy += 40, r++) { g.beginPath(); g.moveTo(bx, yy); g.lineTo(bx + W * 1.2, yy); g.stroke(); for (let xx = bx + (r % 2) * 40; xx < bx + W * 1.2; xx += 80) { g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx, yy + 40); g.stroke(); } }
  const chx = W * 1.42; g.fillStyle = grad(g, chx - 90, 0, chx + 90, 0, [[0, '#4a4a54'], [0.5, '#8a8a96'], [1, '#3a3a44']]); g.beginPath(); g.moveTo(chx - 80, -H * 0.5); g.lineTo(chx + 80, -H * 0.5); g.lineTo(chx + 80, H * 0.36); g.lineTo(chx + 120, H * 0.44); g.lineTo(chx - 120, H * 0.44); g.lineTo(chx - 80, H * 0.36); g.closePath(); g.fill(); ink(g, 6); for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(chx - 80, -H * 0.4 + k * H * 0.13); g.lineTo(chx + 80, -H * 0.4 + k * H * 0.13); ink(g, 3); }
  // basket of cash under the chute + falling notes
  for (let k = 0; k < 7; k++) { const u = ((t * 1.3 + k / 7) % 1); note(g, chx + Math.sin(k * 3 + u * 5) * 50, lerp(H * 0.42, H * 0.64, u), 0.55, u * 4 + k, '100'); }
  g.beginPath(); g.moveTo(chx - 170, H * 0.64); g.lineTo(chx + 170, H * 0.64); g.lineTo(chx + 140, H * 0.8); g.lineTo(chx - 140, H * 0.8); g.closePath(); g.fillStyle = '#8a5a2a'; g.fill(); ink(g, 6); for (let k = 0; k < 5; k++) note(g, chx - 110 + k * 55, H * 0.64 - (k % 2) * 16, 0.5, -0.3 + k * 0.15, '100');
  // the dark: a glowing question mark above the chute
  const qa = prog(t, mo - 0.2, mo + 0.3); if (qa > 0) { glow(g, chx, H * 0.24, 380, 'rgba(255,90,70,.6)', qa); g.save(); g.globalAlpha = qa; g.translate(chx, H * 0.25); g.scale(0.7 + 0.3 * ease.outBack(qa), 0.7 + 0.3 * ease.outBack(qa)); text(g, '?', 0, 0, { size: 300, font: 'Nunito', weight: 900, color: '#ff5a4a' }); g.restore(); }
  // the payout booth with brass bars, Ponzi behind it handing notes out
  const kx = W * 0.74; litChar(g, kx + 150, H * 0.86, 1.15, B.ponzi, keys(t, [[0, { expr: 'charming', legs: 'none', armL: [0.1, 0.12], armR: [1.4, -0.6], handR: 'hold' }], [wh, { expr: 'smug', look: 1 }, 0.3]]), { light: -1 });
  rect(g, kx - 20, H * 0.52, 360, H * 0.3, '#6a3a1e', 7); g.fillStyle = '#8a5a2a'; g.fillRect(kx - 40, H * 0.5, 400, 34); g.strokeRect(kx - 40, H * 0.5, 400, 34); for (let k = 0; k < 7; k++) { const bxx = kx + k * 52; g.fillStyle = '#d8a83a'; g.fillRect(bxx - 4, H * 0.24, 8, H * 0.26); }
  g.fillStyle = '#3a2416'; g.fillRect(kx - 40, H * 0.2, 400, 50); g.strokeRect(kx - 40, H * 0.2, 400, 50); text(g, 'PAYOUTS', kx + 160, H * 0.2 + 26, { size: 40, font: 'Playfair Display', weight: 900, color: '#ffd23a' }); g.fillStyle = '#1a1006'; g.fillRect(kx + 1.1 * 0 + 360, H * 0.2, W * 0.04, H * 0.62);
  // queue: four grinning investors, eyes shut in bliss; the third raises a hand to ask, the rich man pats it down
  const Q = [[B.common, W * 0.57], [B.rich, W * 0.41], [B.clerk, W * 0.25], [B.stranger, W * 0.09]];
  Q.forEach(([c, x], i) => { const asker = i === 2, shush = i === 1, raise = asker ? prog(t, ob, ob + 0.25) * (1 - prog(t, qu + 0.55, qu + 0.8)) : 0, pat = shush ? prog(t, qu, qu + 0.2) * (1 - prog(t, qu + 0.7, qu + 0.9)) : 0;
    const P = { expr: asker && raise > 0.3 ? 'suspicious' : 'laughing', legs: 'stand', bob: -Math.abs(Math.sin(t * 5 + i)) * 0.02, armL: [0.1, 0.12], armR: i === 0 ? [1.5, -0.4] : [0.2, 0.2], handR: i === 0 ? 'grip' : 'relaxed', t, blink: false };
    if (asker) { P.armR = [lerp(0.2, 2.9, raise), lerp(0.2, 0.1, raise)]; P.handR = raise > 0.4 ? 'point' : 'relaxed'; }
    if (shush) { P.armL = [lerp(0.1, 1.6, pat), lerp(0.12, -0.6, pat)]; P.handL = 'open'; P.look = -pat; P.expr = pat > 0.3 ? 'smug' : 'laughing'; }
    litChar(g, x, H * 0.8, 0.95, c, P, { light: -1 }); });
  // notes arc out of the window to the front of the queue, faster on "everyone's getting paid"
  const rate = t > ev ? 2.2 : 1.2; for (let k = 0; k < 3; k++) { const u = ((t * rate + k / 3) % 1); note(g, lerp(kx + 60, W * 0.63, u), lerp(H * 0.44, H * 0.5, u) - Math.sin(u * Math.PI) * 120, 0.6, -0.4 + u, '150'); }
  // the "question" floats above the queue and nobody looks up
  const qf = prog(t, ob - 0.1, ob + 0.3) * (1 - prog(t, wh - 0.4, wh - 0.1)); if (qf > 0) { g.save(); g.globalAlpha = qf * 0.85; g.translate(W * 0.36, H * 0.42 + Math.sin(t * 3) * 10); g.beginPath(); g.ellipse(0, 0, 90, 90, 0, 0, TAU); g.fillStyle = 'rgba(255,255,255,.9)'; g.fill(); ink(g, 5); text(g, '?', 0, 6, { size: 120, font: 'Nunito', weight: 900, color: '#c8202a' }); for (const [dx, dy, r] of [[20, 110, 18], [40, 150, 10]]) { g.beginPath(); g.arc(dx, dy, r, 0, TAU); g.fill(); ink(g, 4); } g.restore(); }
  g.restore(); vignette(g, 0.35 + 0.3 * pk);
  const ha = prog(t, wh, wh + 0.2); if (ha > 0) headline(g, ["WHERE'S THE MONEY", 'COMING FROM?'], W / 2, H * 0.09, 92, wh, t, { col: { 'COMING FROM?': '#ff6a5a' } }); else headline(g, ['NOBODY ASKS.'], W / 2, H * 0.09, 110, as, t, { fill: '#ffffff' });
} });

// ---------------------------------------------------------------- q15 HEADLINES -> CROWDS TURN -> SIX BANKS COLLAPSE
function smallBank(g, cx, base, s, kind, c, t) { // c: collapse progress 0..1
  const w = 200 * s, h = 150 * s, x = cx - w / 2; g.save(); g.translate(cx, base); const sink = ease.in(clamp((c - 0.25) / 0.75)) * h * 0.9; g.translate(0, sink); g.rotate((kind % 2 ? 1 : -1) * 0.12 * ease.in(c)); g.translate(-cx, -base);
  // body
  const col = ['#d8d0c0', '#c8c0b0', '#e0d8c8'][kind % 3]; rect(g, x, base - h, w, h, col, 5);
  // columns buckle outward
  for (let i = 0; i < 4; i++) { const cxp = x + 30 * s + i * (w - 60 * s) / 3, lean = (i < 2 ? -1 : 1) * 0.5 * ease.in(clamp(c * 1.4)); g.save(); g.translate(cxp, base); g.rotate(lean); g.fillStyle = '#f4f0e6'; g.fillRect(-9 * s, -h + 30 * s, 18 * s, h - 34 * s); g.lineWidth = 3; g.strokeStyle = PLUM; g.strokeRect(-9 * s, -h + 30 * s, 18 * s, h - 34 * s); g.restore(); }
  // pediment / dome drops and tips
  const drop = ease.in(clamp(c * 1.3)) * h * 0.6, tip = (kind % 2 ? -1 : 1) * 0.5 * ease.in(clamp(c * 1.2)); g.save(); g.translate(cx, base - h + drop); g.rotate(tip);
  if (kind % 3 === 1) { g.beginPath(); g.arc(0, 0, w * 0.32, Math.PI, 0); g.fillStyle = '#9ab0a8'; g.fill(); ink(g, 5); } else { g.beginPath(); g.moveTo(-w / 2 - 14, 0); g.lineTo(0, -h * 0.4); g.lineTo(w / 2 + 14, 0); g.closePath(); g.fillStyle = col; g.fill(); ink(g, 5); }
  g.fillStyle = '#3a3428'; g.fillRect(-w * 0.38, 4, w * 0.76, 26 * s); text(g, 'BANK', 0, 18 * s, { size: 22 * s, font: 'Playfair Display', weight: 900, color: '#f4ead2' }); g.restore();
  // cracks
  if (c > 0.05) { g.beginPath(); g.moveTo(cx - 20 * s, base - h); g.lineTo(cx, base - h * 0.6); g.lineTo(cx - 14 * s, base - h * 0.35); g.lineTo(cx + 10 * s, base); ink(g, 4); }
  g.restore();
  // dust cloud + debris
  if (c > 0.15) { const u = clamp((c - 0.15) / 0.85), R = rng(kind * 13 + 5); for (let k = 0; k < 9; k++) { const a = Math.PI + R() * Math.PI, d = (40 + R() * 120) * s * ease.out(u); g.save(); g.globalAlpha = 0.75 * (1 - u * 0.7); g.beginPath(); g.arc(cx + Math.cos(a) * d * 1.6, base - 10 * s + Math.sin(a) * d * 0.5, (30 + R() * 40) * s * (0.5 + u), 0, TAU); g.fillStyle = k % 2 ? '#b8a890' : '#d0c4b0'; g.fill(); g.restore(); }
    for (let k = 0; k < 6; k++) { const vx = (R() - 0.5) * 300 * s, vy = -200 * s - R() * 200 * s, tt = u * 0.9; g.save(); g.translate(cx + vx * tt, base - h * 0.7 + vy * tt + 900 * s * tt * tt); g.rotate(tt * 8 + k); g.fillStyle = '#c8c0b0'; g.fillRect(-10 * s, -7 * s, 20 * s, 14 * s); g.lineWidth = 2; g.strokeStyle = PLUM; g.strokeRect(-10 * s, -7 * s, 20 * s, 14 * s); g.restore(); } }
}
function crowdBacks(g, t, angry) { const R = rng(77); for (let row = 0; row < 3; row++) { const n = 7 - row, y = H * (1.02 - row * 0.09), s = 1.25 - row * 0.2; for (let i = 0; i < n; i++) { const x = W * (i + 0.5 + (row % 2) * 0.4) / n + (R() - 0.5) * 60, ph = R() * 6, hat = R(), dark = ['#1a1218', '#221820', '#2a1e26'][row]; const bob = angry * Math.abs(Math.sin(t * 7 + ph)) * 14;
  g.save(); g.translate(x, y - bob); g.fillStyle = dark; g.beginPath(); g.ellipse(0, 0, 120 * s, 140 * s, 0, Math.PI, 0); g.fill(); g.beginPath(); g.arc(0, -170 * s, 62 * s, 0, TAU); g.fill(); if (hat > 0.4) { g.fillRect(-90 * s, -205 * s, 180 * s, 16 * s); g.fillRect(-55 * s, -265 * s, 110 * s, 64 * s); } else { g.beginPath(); g.ellipse(0, -215 * s, 68 * s, 26 * s, 0, 0, TAU); g.fill(); }
  // raised fists shaking when the crowd turns
  if (angry > 0 && (i + row) % 2 === 0) { const up = ease.outBack(angry), sh = Math.sin(t * 12 + ph) * 0.15; const side = i % 4 < 2 ? 1 : -1; g.save(); g.translate(side * 70 * s, -110 * s); g.rotate(side * (0.25 + sh) - 0); g.fillStyle = dark; g.fillRect(-18 * s, -230 * s * up, 36 * s, 230 * s * up); g.beginPath(); g.arc(0, -240 * s * up, 34 * s, 0, TAU); g.fill(); g.restore(); }
  g.restore(); } } }
registerShot('q15', { draw(g, t, info) {
  const hi = atc(info, t, 'hit', 0.6), tu = atc(info, t, 'turn', 1.4), si = atc(info, t, 'six', 2.2);
  if (t < tu - 0.15) { // newspaper spin-in (kept from v1, it works)
    g.fillStyle = '#121212'; g.fillRect(0, 0, W, H); const k = ease.out(prog(t, 0, hi + 0.2)); g.save(); g.translate(W / 2, H * 0.46); g.rotate((1 - k) * 7); g.scale(k, k); g.beginPath(); g.rect(-440, -560, 880, 1120); g.fillStyle = '#f0e8d4'; g.fill(); g.lineWidth = 8; g.strokeStyle = '#1a1612'; g.stroke();
    text(g, 'THE BOSTON POST', 0, -470, { size: 60, font: 'Playfair Display', weight: 900, color: '#1a1612' }); g.fillStyle = '#1a1612'; g.fillRect(-400, -420, 800, 8); text(g, 'PONZI SCHEME', 0, -320, { size: 100, font: 'Playfair Display', weight: 900, color: '#1a1612' }); text(g, 'EXPOSED!', 0, -200, { size: 124, font: 'Playfair Display', weight: 900, color: '#9a1e2c' });
    g.beginPath(); g.rect(-380, -110, 340, 330); g.fillStyle = '#d8d0bc'; g.fill(); g.save(); g.clip(); drawBean(g, -210, 480, 1.05, B.ponzi, { expr: 'shocked', legs: 'none', t }); g.restore(); g.fillStyle = '#9a9488'; for (let i = 0; i < 9; i++) g.fillRect(-10, -100 + i * 34, 390, 12); for (let i = 0; i < 6; i++) g.fillRect(-380, 250 + i * 34, i % 2 ? 560 : 760, 12); g.restore();
    g.save(); g.globalAlpha = 0.12; g.fillStyle = '#000'; for (let y = 0; y < H; y += 12) for (let x = (y / 12) % 2 * 6; x < W; x += 12) g.fillRect(x, y, 3, 3); g.restore(); return; }
  // ominous red dusk over the financial district; camera shakes with every collapse
  const T0 = si - 0.1, st = 0.085, dur = 0.5; let shake = 0; for (let i = 0; i < 6; i++) { const u = (t - T0 - i * st) / dur; if (u > 0 && u < 1) shake += (1 - u) * 14; }
  g.save(); g.translate(Math.sin(t * 70) * shake, Math.cos(t * 53) * shake * 0.7); const z = 1 + 0.05 * ease.out(prog(t, tu - 0.15, info.dur)); g.translate(W / 2, H * 0.45); g.scale(z, z); g.translate(-W / 2, -H * 0.45);
  sky(g, [[0, '#1a0a14'], [0.5, '#6a1a1a'], [1, '#d8582a']], { clouds: 6, cloudCol: '#5a2028', t, seed: 41, h: H * 0.6 }); skyline(g, H * 0.55, '#2a1218', { seed: 17, scale: 1.2, tall: 1.3, windows: 0.15, winCol: '#ff9a50' }); glow(g, W / 2, H * 0.55, 800, 'rgba(255,90,40,.35)', 0.8);
  g.fillStyle = grad(g, 0, H * 0.6, 0, H, [[0, '#2a1a1a'], [1, '#0e0808']]); g.fillRect(-60, H * 0.6, W + 120, H);
  // six banks in a row (two depths), collapsing one by one
  const pos = [[0.17, 0.58, 0.85], [0.5, 0.58, 0.9], [0.83, 0.58, 0.85], [0.3, 0.66, 1.1], [0.7, 0.66, 1.1], [0.5, 0.75, 1.3]];
  let fallen = 0; pos.forEach(([px, py, s], i) => { const c = clamp((t - T0 - i * st) / dur); if (c > 0.3) fallen++; smallBank(g, W * px, H * py, s, i, c, t); });
  crowdBacks(g, t, ease.out(prog(t, tu - 0.15, tu + 0.25)));
  g.restore(); vignette(g, 0.5, '20,4,4');
  if (t > T0) { const n = Math.max(1, fallen); headline(g, [`${n} BANK${n > 1 ? 'S' : ''}`, 'COLLAPSE'], W / 2, H * 0.08, 110, T0, t, { col: { COLLAPSE: '#ff5a4a' } }); } else headline(g, ['THE CROWDS TURN.'], W / 2, H * 0.09, 96, tu - 0.15, t, { fill: '#ffffff' });
} });

// ---------------------------------------------------------------- q07 HERE'S THE CRAZY PART: spotlight lean-in, cash slam, queue of
// paid investors with PAID stamps popping, ON TIME stamp + watch
function stamp(g, str, x, y, a, col, rot = -0.15, size = 70) { if (a <= 0) return; const k = 1 + 1.4 * (1 - ease.out(clamp(a))); g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); g.globalAlpha = clamp(a * 2); g.font = `900 ${size}px "Playfair Display"`; g.textAlign = 'center'; g.textBaseline = 'middle'; const w = g.measureText(str).width + 50; g.lineWidth = 8; g.strokeStyle = col; g.strokeRect(-w / 2, -size * 0.65, w, size * 1.3); g.fillStyle = col; g.fillText(str, 0, 4); g.restore(); }
registerShot('q07', { draw(g, t, info) {
  const cr = atc(info, t, 'crazy', 0.4), pa = atc(info, t, 'pays', 1.2), ev = atc(info, t, 'every', 1.9), mo = atc(info, t, 'money', 3.0), on = atc(info, t, 'time', info.dur - 0.5);
  const pull = ease.inOut(prog(t, ev - 0.3, ev + 0.5)), z = lerp(lerp(1.0, 1.12, ease.out(prog(t, 0, pa))), 0.86, pull), cx = lerp(W * 0.55, W * 0.42, pull);
  let sh = 0; if (t > pa && t < pa + 0.3) sh = (1 - (t - pa) / 0.3) * 18; g.save(); g.translate(Math.sin(t * 80) * sh, Math.cos(t * 60) * sh); cam(g, z, cx, H * 0.52);
  // office: wood wall, hanging lamp, PAYOUTS board, floor
  g.fillStyle = '#2a1810'; g.fillRect(-W, -H, W * 3, H * 3); woodPanel(g, -W * 0.5, 0, W * 2, H * 0.62, '#6a3e22', 5); g.fillStyle = grad(g, 0, H * 0.62, 0, H * 1.2, [[0, '#4a2a18'], [1, '#1a0e08']]); g.fillRect(-W * 0.5, H * 0.62, W * 2, H);
  
  // spotlight on Ponzi (dims the rest until "pays")
  const spot = 1 - prog(t, pa, pa + 0.4); glow(g, W * 0.68, H * 0.5, 700, 'rgba(255,220,150,.5)', 0.8);
  // Ponzi behind the counter
  const P = keys(t, [[0, { expr: 'smug', legs: 'none', armL: [0.1, 0.12], armR: [0.1, 0.12], lean: 0 }], [cr - 0.1, { expr: 'charming', lean: -0.12, armR: [1.2, -1.4], handR: 'point' }, 0.3], [pa - 0.25, { expr: 'determined', lean: 0, armL: [2.4, 0.2], armR: [2.4, 0.2], handL: 'grip', handR: 'grip' }, 0.15], [pa, { expr: 'laughing', armL: [1.5, -0.3], armR: [1.5, -0.3], handL: 'open', handR: 'open' }, 0.12], [ev, { expr: 'proud', armL: [0.3, 0.2], armR: [2.0, 0.4], handR: 'wave' }, 0.3]]);
  litChar(g, W * 0.7, H * 0.66, 1.2, B.ponzi, P, { light: -1 });
  // counter
  rect(g, W * 0.46, H * 0.63, W * 0.46, H * 0.21, grad(g, 0, H * 0.63, 0, H * 0.84, [[0, '#8a5a2e'], [1, '#5a3418']]), 7); rect(g, W * 0.44, H * 0.615, W * 0.5, 34, '#a8723a', 6);
  // cash stack slams on the counter at "pays" + bills burst
  const sl = prog(t, pa - 0.12, pa); if (sl > 0) { const y = lerp(H * 0.3, H * 0.61, ease.in(sl)); for (let k = 0; k < 6; k++) note(g, W * 0.52 + (k % 2) * 8, y - k * 16, 0.75, 0.02 * (k % 3), '100'); }
  if (t > pa) { const R = rng(3); for (let i = 0; i < 14; i++) { const u = clamp((t - pa) / 0.9), a = -Math.PI / 2 + (R() - 0.5) * 2.6, d = 500 * ease.out(u) * (0.4 + R() * 0.6); g.save(); g.globalAlpha = 1 - u; note(g, W * 0.52 + Math.cos(a) * d, H * 0.58 + Math.sin(a) * d + u * u * 300, 0.5, u * 6 + i, '100'); g.restore(); } }
  // first investor at the counter: worried -> jaw drop -> cheering with the cash
  const I = keys(t, [[0, { expr: 'worried', legs: 'stand', armL: [0.1, -1.2], armR: [0.1, -1.2] }], [pa, { expr: 'shocked', armL: [0.6, -0.4], armR: [0.6, -0.4], handL: 'open', handR: 'open' }, 0.15], [pa + 0.45, { expr: 'laughing', armL: [2.6, 0.3], armR: [2.6, 0.3], handL: 'grip', handR: 'open', bob: -0.03 }, 0.25]]);
  litChar(g, W * 0.3, H * 0.82, 1.15, B.common, I, { light: 1 }); if (t > pa + 0.45) { const hp = [W * 0.3 - 150, H * 0.42]; note(g, hp[0], hp[1] - Math.abs(Math.sin(t * 6)) * 12, 0.6, -0.4, '150'); }
  // the queue revealed on the pull-back: each early investor gets a PAID stamp in turn
  const Q = [[B.rich, W * 0.05], [B.clerk, -W * 0.18], [B.stranger, -W * 0.4]]; Q.forEach(([c, x], i) => { const ti = ev + 0.15 + i * 0.32, got = t > ti; litChar(g, x, H * 0.82, 1.05, c, { expr: got ? 'laughing' : 'curious', legs: 'stand', armL: [0.1, 0.12], armR: got ? [2.5, 0.3] : [0.1, 0.12], handR: got ? 'grip' : 'relaxed', t, bob: got ? -Math.abs(Math.sin(t * 6 + i)) * 0.03 : 0 }, { light: 1 }); if (got) note(g, x + 135, H * 0.43, 0.55, 0.4, '150'); stamp(g, 'PAID', x, H * 0.33, prog(t, ti, ti + 0.18), '#2a9a4a', -0.15 + i * 0.1, 60); });
  stamp(g, 'PAID', W * 0.3, H * 0.33, prog(t, pa + 0.2, pa + 0.38), '#2a9a4a', -0.12, 60);
  g.restore();
  if (spot > 0) { g.save(); g.globalAlpha = 0.55 * spot; const v = g.createRadialGradient(W * 0.62, H * 0.5, H * 0.15, W * 0.62, H * 0.5, H * 0.6); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)'); g.fillStyle = v; g.fillRect(0, 0, W, H); g.restore(); }
  vignette(g, 0.35);
  // watch + ON TIME
  const wa = ease.outBack(prog(t, on - 0.35, on - 0.05)); if (wa > 0) { g.save(); g.translate(W * 0.8, H * 0.24); g.scale(wa, wa); g.beginPath(); g.arc(0, 0, 110, 0, TAU); g.fillStyle = grad(g, -110, -110, 110, 110, [[0, '#fff0b0'], [1, '#c8962e']]); g.fill(); ink(g, 8); g.beginPath(); g.arc(0, 0, 88, 0, TAU); g.fillStyle = '#fbf6e6'; g.fill(); ink(g, 4); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.beginPath(); g.moveTo(Math.cos(a) * 72, Math.sin(a) * 72); g.lineTo(Math.cos(a) * 84, Math.sin(a) * 84); ink(g, 4); } g.rotate(-Math.PI / 2 + (t - on) * 8); g.beginPath(); g.moveTo(0, 0); g.lineTo(66, 0); ink(g, 6); g.restore(); }
  stamp(g, 'ON TIME', W * 0.4, H * 0.24, prog(t, on, on + 0.2), '#c8202a', -0.12, 84);
  const h1 = t < pa - 0.1; if (h1) headline(g, ["HERE'S THE", 'CRAZY PART'], W / 2, H * 0.08, 104, 0.05, t, { col: { 'CRAZY PART': '#ffd23a' } }); else headline(g, ['HE PAYS.'], W / 2, H * 0.08, 124, pa - 0.1, t, { fill: '#8ae07a' });
} });
