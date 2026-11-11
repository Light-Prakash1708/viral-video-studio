// shots/01_note.js: "Death Note's Ceiling" v2. Original stickman hero + NASA public-domain photos. Every number counts up in sync with the spoken word.
import { E, V, measure, registerShot as _reg, veil, ease, prog, clamp, lerp, wordTime, seg, circle, rr, glow, text, poly, rng } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import { person, SC, topOf } from '../sets/people4.js';

const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
const IMG = { earth: await loadImg('/project/assets/earth.jpg'), night: await loadImg('/project/assets/iss.jpg'), moon: await loadImg('/project/assets/moon.jpg') };

const BEAT = 60 / 115;
const RED = '#ff3b3b', WHITE = '#f4f4f6', GREY = '#9a9aa8', GOLD = '#ffd98a';
const ZT = () => E.H * 0.14, GYN = () => E.H * 0.7, DROP = 33.39;
const pop = (t, a, b = 0.3) => ease.outBack(prog(t, a, a + b));
const RIM = { color: '#ff5a5a', dir: [0.5, -0.8], w: 4 };
const fmt = n => Math.round(n).toLocaleString('en-US');
const cnt = (info, a, b, final) => final * ease.out(prog(info.globalT, a, b)); // value rises exactly between two absolute times (the spoken word)

// ---------- motion layer on every shot: beat pulse, camera drift, push-in, name-stream, vignette, embers
const registerShot = (id, o) => _reg(id, { draw(g, t, info) {
  const gt = info.globalT, pulse = 0.014 * Math.exp(-((gt % BEAT) / BEAT) * 6), z = 1.03 + (o.zoom ?? 0.012) * t + pulse;
  g.save(); g.translate(E.W / 2 + Math.sin(gt * 0.6) * 12, E.H * 0.45 + Math.cos(gt * 0.45) * 9); g.rotate(Math.sin(gt * 0.4) * 0.0035); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.45); o.draw(g, t, info); g.restore();
  const R = rng(21); for (let i = 0; i < 18; i++) { const x = R() * E.W, sp = 120 + R() * 220, y = E.H - ((gt * sp + R() * E.H * 2) % (E.H * 1.25)), len = 40 + R() * 70, pts = []; for (let k = 0; k <= 6; k++) pts.push([x + (k % 2 ? 7 : -7) * (R() + 0.3), y - k * len / 6]); seg(g, pts, 3, `rgba(255,${200 - i * 6},${200 - i * 8},${0.07 + 0.06 * R()})`); }
  const vg = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.3, E.W / 2, E.H / 2, E.H * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H);
  const r = rng(11); for (let i = 0; i < 26; i++) { const sp = 40 + r() * 90, x = (r() * E.W + Math.sin(gt * 0.7 + i) * 30), y = E.H - ((gt * sp + r() * E.H) % (E.H * 1.1)); circle(g, x, y, 2 + r() * 4, `rgba(255,${80 + (i * 9) % 120},70,${0.12 + 0.3 * r()})`); } } });

const local = (info, t, word, d = null) => { const w = wordTime(word, info.globalT - t - 0.3); return w == null ? d : w - (info.globalT - t); };
const label = (g, str, x, y, o = {}) => { const sz = o.size || 78, w = measure(g, str, sz, 'Nunito', 900) + 70; g.save(); g.globalAlpha *= 0.72; rr(g, x - w / 2, y - sz * 0.68, w, sz * 1.36, sz * 0.4); g.fillStyle = '#05050a'; g.fill(); g.restore(); text(g, str, x, y, { size: sz, font: 'Nunito', weight: 900, color: '#fff', stroke: 10, strokeColor: 'rgba(0,0,0,.75)', glow: 12, glowColor: 'rgba(255,60,60,.3)', ...o }); };
const L = (g, t, at, str, o = {}) => { const k = pop(t, at, 0.35); if (k > 0) { g.save(); g.translate(E.W / 2, o.y ?? ZT()); g.scale(k, k); label(g, str, 0, 0, o); g.restore(); } };
// tabular rolling-number plate: digits keep a fixed pitch so nothing jitters while counting; fw = final text (sets plate width), suf = unit after the number
const tabLabel = (g, str, x, y, o = {}) => {
  const sz = o.size || 78, fw = o.fw || str, dw = measure(g, '0', sz, 'Nunito', 900), cw = ch => /\d/.test(ch) ? dw : measure(g, ch, sz, 'Nunito', 900), W = s => [...s].reduce((a, ch) => a + cw(ch), 0);
  const ssz = o.suffixSize || sz * 0.5, sw = o.suf ? measure(g, o.suf, ssz, 'Nunito', 900) + 24 : 0, tot = W(fw) + sw + 70, left = x - tot / 2 + 35;
  g.save(); g.globalAlpha *= 0.72; rr(g, x - tot / 2, y - sz * 0.68, tot, sz * 1.36, sz * 0.4); g.fillStyle = '#05050a'; g.fill(); g.restore();
  let ex = left + W(fw); for (let i = str.length - 1; i >= 0; i--) { const ch = str[i], w = cw(ch); ex -= w; text(g, ch, ex + w / 2, y, { size: sz, font: 'Nunito', weight: 900, color: o.color || '#fff', stroke: 10, strokeColor: 'rgba(0,0,0,.75)', glow: 14, glowColor: 'rgba(255,60,60,.35)' }); }
  if (o.suf) text(g, o.suf, left + W(fw) + 24 + sw / 2 - 12, y + sz * 0.05, { size: ssz, font: 'Nunito', weight: 900, color: o.sufColor || GREY, stroke: 6, strokeColor: 'rgba(0,0,0,.7)' });
};
const flash = (g, t, at, d = 0.25, col = '255,255,255') => { const k = 1 - prog(t, at, at + d); if (k > 0 && t >= at) { g.fillStyle = `rgba(${col},${0.6 * k})`; g.fillRect(0, 0, E.W, E.H); } };
const shake = (t, at, d = 0.4, a = 16) => { const k = 1 - prog(t, at, at + d); return t >= at && k > 0 ? Math.sin(t * 95) * a * k : 0; };
function rays(g, cx, cy, r0, r1, t, a = 0.5, n = 56, col = '255,255,255') { for (let i = 0; i < n; i++) { const an = i / n * Math.PI * 2 + t * 0.05, len = r1 * (i % 2 ? 0.8 : 1); seg(g, [[cx + Math.cos(an) * r0, cy + Math.sin(an) * r0], [cx + Math.cos(an) * len, cy + Math.sin(an) * len]], i % 2 ? 3 : 5, `rgba(${col},${a})`); } }

// ---------- NASA public-domain photos (Apollo 17 Earth, ISS night lights, full Moon)
function drawMoon(g, x, y, r) { glow(g, x, y, r * 3, '#cfe0ff', 0.25); if (!IMG.moon) return circle(g, x, y, r, '#e9eeff'); g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip(); const sr = 170; g.drawImage(IMG.moon, 622 - sr, 422 - sr, sr * 2, sr * 2, x - r, y - r, r * 2, r * 2); g.restore(); }
function drawEarth(g, cx, cy, r, t) { glow(g, cx, cy, r * 1.9, '#5a9aff', 0.35); if (!IMG.earth) return circle(g, cx, cy, r, '#2a5aa8'); g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.clip(); const sr = 650, ox = Math.sin(t * 0.5) * 55; g.drawImage(IMG.earth, 960 - sr + ox, 979 - sr, sr * 2, sr * 2, cx - r, cy - r, r * 2, r * 2); const sh = g.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.3, cx, cy, r * 1.05); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,10,.55)'); g.fillStyle = sh; g.fillRect(cx - r, cy - r, r * 2, r * 2); g.restore(); }
function drawNight(g, t, a = 0.6, tint = '255,40,40') { if (!IMG.night || a <= 0) return; const sc = E.H / 851 * 1.15; g.save(); g.globalAlpha = a; g.drawImage(IMG.night, -(1280 * sc - E.W) / 2 + Math.sin(t * 0.3) * 40, -(851 * sc - E.H) / 2, 1280 * sc, 851 * sc); g.globalAlpha = a * 0.35; g.fillStyle = `rgb(${tint})`; g.globalCompositeOperation = 'multiply'; g.fillRect(0, 0, E.W, E.H); g.restore(); }

// ---------- the notebook: cover flip, page turns, a pen that writes, names that lift off the page
// o: {open: t0 (cover flip start), lines: [{at,dur,w,seed}], flips: [t...], hover: bool, rot, glow}
function book(g, t, cx, cy, s, o = {}) {
  const PW = 330, PH = 420; g.save(); g.translate(cx, cy); g.rotate(o.rot ?? -0.05); g.scale(s, s);
  if (o.glow) glow(g, 0, 0, 700, RED, o.glow);
  rr(g, -PW - 10, -PH / 2 + 18, PW * 2 + 20, PH + 14, 18); g.fillStyle = 'rgba(0,0,0,.55)'; g.fill();
  rr(g, -PW - 16, -PH / 2 - 10, PW * 2 + 32, PH + 20, 16); g.fillStyle = '#08080d'; g.fill(); g.strokeStyle = '#34343f'; g.lineWidth = 6; g.stroke();
  const opening = o.open != null, k = opening ? ease.inOut(prog(t, o.open, o.open + 0.7)) : 1;
  rr(g, -PW, -PH / 2, PW - 4, PH, 6); g.fillStyle = opening ? '#0c0c12' : '#ebe5d2'; g.fill();
  rr(g, 4, -PH / 2, PW - 4, PH, 6); g.fillStyle = '#f1ecdb'; g.fill();
  if (!opening || k > 0.5) {
    for (let i = 0; i < 11; i++) { seg(g, [[30, -PH / 2 + 56 + i * 32], [PW - 26, -PH / 2 + 56 + i * 32]], 2, 'rgba(60,60,90,.28)'); if (!opening) seg(g, [[-PW + 26, -PH / 2 + 56 + i * 32], [-30, -PH / 2 + 56 + i * 32]], 2, 'rgba(60,60,90,.28)'); }
    if (!opening) { const R = rng(7); for (let i = 0; i < 9; i++) { const pts = []; const len = 120 + R() * 140; for (let x = 0; x <= len; x += 12) pts.push([-PW + 34 + x, -PH / 2 + 50 + i * 32 + Math.sin(x * 0.4 + i) * 4 + (R() - 0.5) * 5]); seg(g, pts, 4, '#23233a'); } }
  }
  const sp = g.createLinearGradient(-45, 0, 45, 0); sp.addColorStop(0, 'rgba(0,0,0,0)'); sp.addColorStop(0.5, 'rgba(0,0,0,.45)'); sp.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sp; g.fillRect(-45, -PH / 2, 90, PH);
  let pen = null; (o.lines || []).forEach((ln, i) => {
    const p = prog(t, ln.at, ln.at + ln.dur); if (p <= 0) return; const R = rng(ln.seed || i + 3), by = -PH / 2 + 50 + i % 11 * 32, len = (PW - 70) * (ln.w || 0.8) * p, pts = [];
    for (let x = 0; x <= len; x += 9) pts.push([30 + x, by + Math.sin(x * 0.45 + i) * 4 + (R() - 0.5) * 6]);
    if (pts.length > 1) { seg(g, pts, 5, p < 1 ? '#1a1a2a' : '#2a1018'); if (p < 1) { const tp = pts[pts.length - 1]; pen = tp; glow(g, tp[0], tp[1], 50, RED, 0.7); } }
    const rel = prog(t, ln.at + ln.dur, ln.at + ln.dur + 1.5); if (rel > 0 && rel < 1) { const fp = []; const R2 = rng(ln.seed || i + 3); for (let x = 0; x <= (PW - 70) * (ln.w || 0.8); x += 9) fp.push([30 + x, by - rel * 520 + Math.sin(x * 0.45 + i) * 4 + (R2() - 0.5) * 6]); g.save(); g.globalAlpha = 1 - rel; seg(g, fp, 8, 'rgba(255,60,60,.35)'); seg(g, fp, 4, '#ffd0d0'); g.restore(); }
  });
  if (o.hover) { const hx = 90 + Math.sin(t * 2) * 12, hy = -40 + Math.cos(t * 3) * 8; pen = [hx, hy]; }
  if (pen) { const jx = o.hover ? 0 : Math.sin(t * 40) * 2; seg(g, [[pen[0] + jx, pen[1]], [pen[0] + 120, pen[1] - 250]], 16, '#16161c'); seg(g, [[pen[0] + 100, pen[1] - 210], [pen[0] + 120, pen[1] - 250]], 18, '#dcdce6'); poly(g, [[pen[0] - 4, pen[1] + 4], [pen[0] + 7, pen[1] - 14], [pen[0] - 10, pen[1] - 10]], '#9a9aa8'); }
  (o.flips || []).forEach(ft => { const f = prog(t, ft, ft + 0.4); if (f <= 0 || f >= 1) return; const w = PW * Math.cos(f * Math.PI); poly(g, [[0, -PH / 2], [w, -PH / 2 - 12 * Math.sin(f * Math.PI)], [w, PH / 2 - 12 * Math.sin(f * Math.PI)], [0, PH / 2]], '#f6f1df'); seg(g, [[w, -PH / 2], [w, PH / 2]], 3, 'rgba(0,0,0,.25)'); });
  if (opening && k < 1) { const w = PW * Math.cos(k * Math.PI); poly(g, [[0, -PH / 2 - 10], [w, -PH / 2 - 10 - 14 * Math.sin(k * Math.PI)], [w, PH / 2 + 10 - 14 * Math.sin(k * Math.PI)], [0, PH / 2 + 10]], k < 0.5 ? '#08080d' : '#0c0c12'); seg(g, [[w, -PH / 2 - 10], [w, PH / 2 + 10]], 5, '#34343f'); if (k < 0.5) { rr(g, w * 0.5 - 46, -30, 92 * Math.max(0.1, Math.cos(k * Math.PI)), 60, 4); g.fillStyle = 'rgba(240,240,248,.85)'; g.fill(); } }
  g.restore();
}

// ---------- set pieces
function room(g, t, o = {}) {
  const gy = GYN(), red = o.red ?? 0.35; const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, '#05050a'); gr.addColorStop(0.6, '#140810'); gr.addColorStop(1, '#2a0a10'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  glow(g, E.W * 0.5, E.H * 0.42, 900, '#ff2020', red * 0.5); rays(g, E.W * 0.5, E.H * 0.42, 330, 760, t, 0.08 + red * 0.1, 48, '255,90,90');
  if (!o.nowin) { const wx = E.W * 0.86, wy = E.H * 0.5; rr(g, wx - 120, wy - 150, 240, 300, 12); g.fillStyle = '#0b0f22'; g.fill(); drawMoon(g, wx - 15, wy - 40, 70); g.strokeStyle = '#2a2a38'; g.lineWidth = 8; g.strokeRect(wx - 120, wy - 150, 240, 300); seg(g, [[wx, wy - 150], [wx, wy + 150]], 6, '#2a2a38'); seg(g, [[wx - 120, wy], [wx + 120, wy]], 6, '#2a2a38'); }
  g.fillStyle = '#1a0d12'; g.fillRect(0, gy, E.W, E.H); seg(g, [[0, gy + 3], [E.W, gy + 3]], 5, 'rgba(255,60,60,.3)');
  if (o.dim) veil(g, '#000', o.dim); return gy;
}
function desk(g, t, gy, o = {}) {
  const dy = gy - 230; rr(g, E.W * 0.12, dy, E.W * 0.76, 40, 10); g.fillStyle = '#2b1810'; g.fill(); g.fillStyle = '#1b0f0a'; g.fillRect(E.W * 0.16, dy + 40, E.W * 0.68, E.H); seg(g, [[E.W * 0.12, dy + 3], [E.W * 0.88, dy + 3]], 4, 'rgba(255,140,100,.4)');
  book(g, t, E.W * 0.5, dy - 78, 0.4, { open: o.open, lines: o.lines, hover: o.hover, flips: o.flips, rot: -0.04, glow: 0.12 });
  const ax = E.W * 0.7, ay = dy - 28; circle(g, ax, ay, 30, '#d4101f'); circle(g, ax - 10, ay - 10, 8, 'rgba(255,255,255,.4)'); seg(g, [[ax, ay - 28], [ax + 6, ay - 46]], 5, '#2a1a10'); poly(g, [[ax + 6, ay - 40], [ax + 34, ay - 52], [ax + 20, ay - 30]], '#2d8a3a'); glow(g, ax, ay, 120, '#ff2030', 0.25);
}
const KIRA = (t, o = {}) => ({ who: 'KIRA', s: SC() * 1.0, facing: 1, t, rim: RIM, ...o });
const reaper = (g, t, cx, cy, s = 1, a = 0.9) => { g.save(); g.globalAlpha *= a; g.translate(cx, cy); g.scale(s, s); const w = Math.sin(t * 1.5) * 18; glow(g, 0, 0, 420, '#ff1a1a', 0.3); poly(g, [[-40, -30], [-420, -190 + w], [-300, -80], [-380, 20 + w], [-240, 10], [-60, 60]], '#030306'); poly(g, [[40, -30], [420, -190 + w], [300, -80], [380, 20 + w], [240, 10], [60, 60]], '#030306'); circle(g, 0, -60, 100, '#030306'); poly(g, [[-70, -140], [-40, -230], [-10, -150], [20, -240], [50, -150], [80, -200], [80, -120]], '#030306'); circle(g, -34, -66, 15, '#ffcc33'); circle(g, 34, -66, 15, '#ffcc33'); seg(g, [[-60, -20], [-30, -10], [0, -22], [30, -10], [60, -20]], 5, '#e8e8f0'); poly(g, [[-70, 40], [70, 40], [110, 330], [-110, 330]], '#030306'); g.restore(); };
const writer = (a, n, step = 0.5, dur = 0.55) => Array.from({ length: n }, (_, i) => ({ at: a + i * step, dur, w: 0.45 + 0.4 * ((i * 37) % 10) / 10, seed: 5 + i }));

// c00 cold open: extreme close-up of the eye
registerShot('c00', { zoom: 0.05, draw(g, t, info) {
  g.fillStyle = '#030306'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.43, 800, '#ff1a1a', 0.22); const cx = E.W / 2, cy = E.H * 0.43, op = ease.out(prog(t, 0.1, 0.55)), hw = 400, hh = 180 * op + 4;
  g.save(); g.translate(cx, cy); g.beginPath(); g.moveTo(-hw, 20); g.bezierCurveTo(-hw * 0.5, -hh * 1.6, hw * 0.5, -hh * 1.6, hw, 10); g.bezierCurveTo(hw * 0.5, hh * 1.2, -hw * 0.5, hh * 1.2, -hw, 20); g.closePath(); g.fillStyle = '#f0e8e4'; g.fill(); g.save(); g.clip();
  const ix = 30 * Math.sin(t * 1.3), ir = 150; circle(g, ix, 0, ir, '#7a3a1a'); circle(g, ix, 0, ir * 0.7, '#a2501e'); circle(g, ix, 0, 52 - 12 * Math.sin(t * 3), '#080408'); circle(g, ix - 40, -50, 22, 'rgba(255,255,255,.85)'); for (let i = 0; i < 40; i++) { const a = i / 40 * 6.28; seg(g, [[ix + Math.cos(a) * 60, Math.sin(a) * 60], [ix + Math.cos(a) * 140, Math.sin(a) * 140]], 2, 'rgba(40,10,0,.4)'); } g.restore();
  g.lineWidth = 16; g.strokeStyle = '#080408'; g.beginPath(); g.moveTo(-hw, 20); g.bezierCurveTo(-hw * 0.5, -hh * 1.6, hw * 0.5, -hh * 1.6, hw, 10); g.stroke(); seg(g, [[-hw + 20, -hh * 1.9 - 40], [hw * 0.15, -hh * 1.9 - 90], [hw * 0.9, -hh * 1.9 - 20]], 22, '#3a2414'); g.restore();
  for (let i = 0; i < 6; i++) { const y = ((t * 500 + i * 330) % (E.H * 0.7)) + E.H * 0.15; seg(g, [[0, y], [E.W, y]], 2, 'rgba(255,60,60,.12)'); }
  L(g, t, 0.35, 'LIGHT YAGAMI', { size: 72, color: WHITE }); flash(g, t, 0.05, 0.3, '255,40,40');
} });
// c01 hook: the notebook cover flips open, the pen starts to move
registerShot('c01', { zoom: 0.02, draw(g, t, info) {
  const gy = room(g, t, { red: 0.4 + 0.15 * Math.sin(t * 2) }); reaper(g, t, E.W * 0.5, E.H * 0.34, 0.9, 0.35);
  person(g, KIRA(t, { x: E.W * 0.5, y: gy, pose: breathe(POSES.think, t), expr: t < 1.6 ? 'smirk' : 'determined' })); desk(g, t, gy, { open: 0.5, lines: writer(1.4, 3, 0.35, 0.3) });
  L(g, t, 0.15, 'ONE NOTEBOOK', { size: 76, color: WHITE });
} });
// c01b: 365 days
registerShot('c01b', { zoom: 0.03, draw(g, t, info) {
  g.fillStyle = '#05050a'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.5, 800, '#ff1a1a', 0.2); const n = Math.floor(365 * ease.out(prog(info.globalT, 3.95, 4.75))), x0 = (E.W - 18 * 52) / 2, y0 = E.H * 0.3;
  for (let i = 0; i < 365; i++) circle(g, x0 + (i % 19) * 52, y0 + Math.floor(i / 19) * 34, 11, i < n ? (i === n - 1 ? '#fff' : RED) : 'rgba(255,255,255,.1)');
  const k = pop(t, 0.05, 0.3); if (k > 0) { g.save(); g.translate(E.W / 2, ZT()); g.scale(k, k); tabLabel(g, `${n}`, 0, 0, { size: 96, color: RED, fw: '365', suf: 'DAYS', suffixSize: 60, sufColor: WHITE }); g.restore(); } flash(g, t, 0, 0.25);
} });
// c02 Earth (NASA) turns, murders pulse, the counter hits 450,000 exactly on the spoken number
registerShot('c02', { zoom: 0.02, draw(g, t, info) {
  g.fillStyle = '#06060c'; g.fillRect(0, 0, E.W, E.H); drawNight(g, t, 0.55 * ease.out(prog(t, 2.2, 3.4)), '60,80,255'); glow(g, E.W / 2, E.H * 0.46, 800, '#2a3aff', 0.14);
  const cx = E.W / 2, cy = E.H * 0.47, r = 270 * (0.9 + 0.1 * ease.out(prog(t, 0, 0.6))); drawEarth(g, cx, cy, r, t);
  const R = rng(2); for (let i = 0; i < 40; i++) { const a = R() * 7, d = Math.sqrt(R()) * r * 0.85, k = (t * 0.8 + R()) % 1; circle(g, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 5 + 9 * (1 - k), `rgba(255,70,70,${1 - k})`); }
  L(g, t, 0.1, 'WORLD MURDERS PER YEAR', { size: 52, color: WHITE }); const k = pop(t, 2.5, 0.3); if (k > 0) { g.save(); g.translate(cx, E.H * 0.255); g.scale(k, k); tabLabel(g, fmt(cnt(info, 8.0, 9.7, 450000)), 0, 0, { size: 104, color: RED, fw: '450,000' }); g.restore(); }
} });
// c02b: UN stamp
registerShot('c02b', { zoom: 0.02, draw(g, t, info) {
  g.fillStyle = '#06080f'; g.fillRect(0, 0, E.W, E.H); drawNight(g, t + 3, 0.3, '60,80,255'); glow(g, E.W / 2, E.H * 0.45, 700, '#3a6aff', 0.2); const cx = E.W / 2 + shake(t, 0.1, 0.4, 12), cy = E.H * 0.45, k = 1 + 1.6 * (1 - ease.out(prog(t, 0, 0.18)));
  g.save(); g.translate(cx, cy); g.scale(k, k); g.globalAlpha = clamp(prog(t, 0, 0.12), 0, 1); g.strokeStyle = '#8fb4ff'; g.lineWidth = 12; g.beginPath(); g.arc(0, 0, 250, 0, 7); g.stroke(); g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 215, 0, 7); g.stroke(); for (let i = 0; i < 36; i++) { const a = i / 36 * 6.28 + t * 0.6; seg(g, [[Math.cos(a) * 262, Math.sin(a) * 262], [Math.cos(a) * 290, Math.sin(a) * 290]], 6, '#8fb4ff'); }
  text(g, 'UN', 0, 30, { size: 200, font: 'Nunito', weight: 900, color: '#e8f0ff', glow: 30, glowColor: 'rgba(120,170,255,.7)', stroke: 12, strokeColor: 'rgba(0,0,0,.6)' }); g.restore();
  L(g, t, 0.1, 'OFFICIAL FIGURE', { size: 66, color: WHITE }); const b = pop(t, 0.35, 0.3); if (b > 0) { g.save(); g.translate(E.W / 2, E.H * 0.66); g.scale(b, b); label(g, '~450,000 / YEAR', 0, 0, { size: 62, color: GOLD }); g.restore(); } flash(g, t, 0.15, 0.2, '140,180,255');
} });
// c03 one name: Kira starts writing
registerShot('c03', { zoom: 0.025, draw(g, t, info) {
  const gy = room(g, t, { red: 0.5 }); person(g, KIRA(t, { x: E.W * 0.5, y: gy, pose: breathe(t > 0.3 ? POSES.explain : POSES.think, t * 2), expr: 'determined' })); desk(g, t, gy, { lines: writer(0.3, 2, 0.8, 0.7) });
  L(g, t, 0.1, '1 NAME', { size: 84, color: WHITE });
} });
// c03c: notebook close-up, one name written slowly
registerShot('c03c', { zoom: 0.06, draw(g, t, info) {
  g.fillStyle = '#07040a'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.5, 900, RED, 0.3); rays(g, E.W / 2, E.H * 0.5, 500, 1000, t, 0.12, 40, '255,60,60');
  book(g, t, E.W / 2, E.H * 0.5, 1.25, { lines: [{ at: 0.1, dur: 1.0, w: 0.8, seed: 9 }], rot: -0.06, glow: 0.2 }); L(g, t, 0.05, 'ONE NAME', { size: 80, color: WHITE });
  const k = pop(t, 0.5, 0.3); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.255); g.scale(k, k); label(g, '= 1 MINUTE', 0, 0, { size: 72, color: RED }); g.restore(); } flash(g, t, 0, 0.2);
} });
// c03b: stopwatch
registerShot('c03b', { zoom: 0.03, draw(g, t, info) {
  g.fillStyle = '#05050a'; g.fillRect(0, 0, E.W, E.H); const cx = E.W / 2, cy = E.H * 0.45, p = prog(t, 0.05, 0.75); glow(g, cx, cy, 600, RED, 0.2);
  circle(g, cx, cy, 270, '#0c0c14'); g.lineWidth = 30; g.strokeStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.arc(cx, cy, 240, 0, 7); g.stroke(); g.strokeStyle = RED; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, 240, -Math.PI / 2, -Math.PI / 2 + p * 6.283); g.stroke();
  for (let i = 0; i < 60; i++) { const a = i / 60 * 6.283; seg(g, [[cx + Math.cos(a) * 275, cy + Math.sin(a) * 275], [cx + Math.cos(a) * (i % 5 ? 290 : 305), cy + Math.sin(a) * (i % 5 ? 290 : 305)]], i % 5 ? 3 : 6, '#aaa'); }
  seg(g, [[cx, cy], [cx + Math.cos(-Math.PI / 2 + p * 6.283) * 210, cy + Math.sin(-Math.PI / 2 + p * 6.283) * 210]], 8, '#fff'); text(g, Math.round(p * 60) + 's', cx, cy + 190, { size: 90, font: 'Nunito', weight: 900, color: WHITE, stroke: 8, strokeColor: '#000' }); L(g, t, 0.05, 'ONE MINUTE', { size: 80, color: WHITE });
} });
// c04 60 / 1,440 / 525,600: each row rolls up exactly while the number is spoken
registerShot('c04', { zoom: 0.015, draw(g, t, info) {
  g.fillStyle = '#06060c'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.45, 800, '#ff1a1a', 0.14);
  const rows = [['60', 'PER HOUR', 15.45, 15.58, 16.5, WHITE, 84, 1], ['1,440', 'PER DAY', 17.0, 17.12, 18.4, GOLD, 92, -1], ['525,600', 'PER YEAR', 19.1, 19.18, 21.4, RED, 104, 1]];
  rows.forEach(([n, u, pa, a, b, c, sz, dir], i) => { const k = ease.outBack(prog(info.globalT, pa, pa + 0.35)); if (k <= 0) return; const val = cnt(info, a, b, +n.replace(/,/g, '')); g.save(); g.translate(E.W / 2 + (1 - k) * dir * 500, E.H * (0.27 + i * 0.145)); tabLabel(g, fmt(val), 0, 0, { size: sz, color: c, fw: n, suf: u, sufColor: GREY }); g.restore(); });
  const k3 = prog(info.globalT, 19.1, 21.6); if (k3 > 0) { const w = E.W * 0.7 * k3; rr(g, E.W * 0.15, E.H * 0.6, E.W * 0.7, 18, 9); g.fillStyle = 'rgba(255,255,255,.1)'; g.fill(); rr(g, E.W * 0.15, E.H * 0.6, w, 18, 9); g.fillStyle = RED; g.fill(); glow(g, E.W * 0.15 + w, E.H * 0.6 + 9, 80, RED, 0.6); }
} });
// c04b: 525,600 slam
registerShot('c04b', { zoom: 0.05, draw(g, t, info) {
  const sx = shake(t, 0, 0.5, 18); g.fillStyle = '#12030a'; g.fillRect(0, 0, E.W, E.H); rays(g, E.W / 2, E.H * 0.43, 200, 1000, t, 0.35, 64, '255,70,70'); glow(g, E.W / 2, E.H * 0.43, 800, RED, 0.45);
  const k = pop(t, 0, 0.3); g.save(); g.translate(E.W / 2 + sx, E.H * 0.43); g.scale(k, k); text(g, '525,600', 0, 0, { size: 190, font: 'Nunito', weight: 900, color: WHITE, glow: 50, glowColor: 'rgba(255,50,50,.8)', stroke: 18, strokeColor: 'rgba(0,0,0,.7)' }); g.restore(); L(g, t, 0.1, 'IN ONE YEAR', { size: 80, color: RED }); flash(g, t, 0, 0.3);
} });
// c05 world vs Kira: bar labels count with the bars, +75,600 counts on "seventy-five thousand"
registerShot('c05', { zoom: 0.02, draw(g, t, info) {
  g.fillStyle = '#06060c'; g.fillRect(0, 0, E.W, E.H); drawNight(g, t, 0.18, '255,40,40'); const base = E.H * 0.66, hmax = 560; const a = ease.out(prog(t, 0.2, 1.0)), b = ease.out(prog(t, 0.8, 1.8));
  const hw = hmax * 450000 / 525600 * a, hk = hmax * b; rr(g, E.W * 0.17, base - hw, 300, hw, 14); g.fillStyle = '#c9ccd8'; g.fill(); rr(g, E.W * 0.55, base - hk, 300, hk, 14); g.fillStyle = RED; g.fill(); glow(g, E.W * 0.55 + 150, base - hk, 300, RED, 0.3 * b);
  if (a > 0.1) text(g, fmt(450000 * a), E.W * 0.17 + 150, base - hw + 70, { size: 54, font: 'Nunito', weight: 900, color: '#111' }); if (b > 0.1) text(g, fmt(525600 * b), E.W * 0.55 + 150, base - hk + 70, { size: 54, font: 'Nunito', weight: 900, color: '#fff' });
  text(g, 'WORLD', E.W * 0.17 + 150, base + 54, { size: 44, font: 'Nunito', weight: 900, color: GREY }); text(g, 'KIRA', E.W * 0.55 + 150, base + 54, { size: 44, font: 'Nunito', weight: 900, color: RED });
  L(g, t, 0.1, 'WORLD  vs  KIRA', { size: 66, color: WHITE }); const k = pop(t, 1.6, 0.35); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.25); g.scale(k, k); tabLabel(g, '+' + fmt(cnt(info, 23.6, 25.3, 75600)), 0, 0, { size: 88, color: GOLD, fw: '+75,600', suf: 'MORE', sufColor: WHITE }); g.restore(); }
} });
// c06 but Light has to sleep (real Moon in the window)
registerShot('c06', { zoom: 0.02, draw(g, t, info) {
  const gy = room(g, t, { red: 0.12, dim: 0.35 }); person(g, KIRA(t, { x: E.W * 0.5, y: gy + 8, pose: breathe(POSES.relaxed, t * 0.5), expr: 'sleepy', emo: ['tired'] })); desk(g, t, gy, {});
  for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; text(g, 'Z', E.W * 0.66 + k * 90, topOf(gy, 1.0) - 20 - k * 160, { size: 70 + i * 16, font: 'Nunito', weight: 900, color: `rgba(190,200,255,${1 - k})` }); }
  L(g, t, 0.1, 'BUT HE HAS TO SLEEP', { size: 64, color: WHITE }); const k = pop(t, local(info, t, 'Eight', 2.0) - 0.2, 0.3); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.255); g.scale(k, k); label(g, '8 HOURS A NIGHT', 0, 0, { size: 70, color: '#8fa6ff' }); g.restore(); }
} });
// c06b: sleep wheel, 8h counts with the wedge
registerShot('c06b', { zoom: 0.03, draw(g, t, info) {
  g.fillStyle = '#05060f'; g.fillRect(0, 0, E.W, E.H); drawMoon(g, E.W * 0.82, E.H * 0.2, 90); const cx = E.W / 2, cy = E.H * 0.45, p = ease.out(prog(t, 0.05, 0.6)); circle(g, cx, cy, 270, '#0c0e1c');
  g.fillStyle = '#4a5aa0'; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, 260, -Math.PI / 2, -Math.PI / 2 + p * (8 / 24) * 6.283); g.closePath(); g.fill(); g.fillStyle = RED; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, 260, -Math.PI / 2 + p * (8 / 24) * 6.283, -Math.PI / 2 + p * 6.283); g.closePath(); g.globalAlpha = 0.85; g.fill(); g.globalAlpha = 1;
  for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283 - Math.PI / 2; seg(g, [[cx + Math.cos(a) * 240, cy + Math.sin(a) * 240], [cx + Math.cos(a) * 270, cy + Math.sin(a) * 270]], 4, '#000'); }
  text(g, Math.round(8 * p) + 'h', cx, cy + 25, { size: 130, font: 'Nunito', weight: 900, color: WHITE, stroke: 10, strokeColor: '#000' }); L(g, t, 0.05, '24 HOURS', { size: 80, color: WHITE });
} });
// c07 still writes 350,400 (counts exactly on "three hundred fifty thousand")
registerShot('c07', { zoom: 0.02, draw(g, t, info) {
  g.fillStyle = '#06060c'; g.fillRect(0, 0, E.W, E.H); drawNight(g, t, 0.35, '255,40,40'); glow(g, E.W / 2, E.H * 0.45, 800, '#ff1a1a', 0.14);
  L(g, t, 0.1, 'STILL WRITES', { size: 76, color: WHITE }); const k = pop(t, 0.5, 0.3); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.38); g.scale(k, k); tabLabel(g, fmt(cnt(info, 31.38, 32.6, 350400)), 0, 0, { size: 140, color: RED, fw: '350,400' }); g.restore(); }
  const bx = E.W * 0.1, bw = E.W * 0.8, by = E.H * 0.5, p = ease.out(prog(t, 0.3, 1.2)); rr(g, bx, by, bw * 2 / 3 * p, 60, 14); g.fillStyle = RED; g.fill(); rr(g, bx + bw * 2 / 3, by, bw / 3 * p, 60, 14); g.fillStyle = '#4a5aa0'; g.fill();
  if (p > 0.9) { text(g, '16h WRITING', bx + bw / 3, by + 125, { size: 46, font: 'Nunito', weight: 900, color: WHITE, stroke: 8, strokeColor: '#000' }); text(g, '8h SLEEP', bx + bw * 5 / 6, by + 125, { size: 46, font: 'Nunito', weight: 900, color: '#8fa6ff', stroke: 8, strokeColor: '#000' }); }
} });
// c08 CLIMAX: 78% on the drop
registerShot('c08', { zoom: 0.03, draw(g, t, info) {
  const dT = DROP - info.globalT + t, sh = Math.max(0, 1 - Math.abs(t - dT) / 0.45), dx = Math.sin(t * 90) * 16 * sh; g.save(); g.translate(dx, 0);
  g.fillStyle = t < dT ? '#06060c' : '#2a0508'; g.fillRect(-30, 0, E.W + 60, E.H); drawNight(g, t, t < dT ? 0.3 : 0.55, '255,30,30'); const cx = E.W / 2, cy = E.H * 0.42;
  if (t >= dT) { rays(g, cx, cy, 300, 900, t, 0.5, 64, '255,255,255'); glow(g, cx, cy, 900, RED, 0.5); }
  const pcs = 0.78 * ease.out(prog(t, dT, dT + 1.0)); g.lineWidth = 46; g.strokeStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.arc(cx, cy, 250, 0, 7); g.stroke(); g.strokeStyle = RED; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, 250, -Math.PI / 2, -Math.PI / 2 + pcs * Math.PI * 2); g.stroke();
  const k = t >= dT ? pop(t, dT, 0.3) : 0; if (k > 0) { g.save(); g.translate(cx, cy + 30); g.scale(k, k); text(g, Math.round(pcs * 100) + '%', 0, 0, { size: 210, font: 'Nunito', weight: 900, color: WHITE, glow: 40, glowColor: 'rgba(255,60,60,.7)', stroke: 16, strokeColor: 'rgba(0,0,0,.7)' }); g.restore(); }
  g.restore(); L(g, t, 0.1, 'FROM ONE DESK', { size: 80, color: WHITE }); const b = pop(t, dT + 0.4, 0.3); if (b > 0) { g.save(); g.translate(E.W / 2, E.H * 0.66); g.scale(b, b); label(g, 'OF ALL MURDERS ON EARTH', 0, 0, { size: 54, color: GOLD }); g.restore(); }
  if (sh > 0.3) { g.fillStyle = `rgba(255,255,255,${0.6 * sh})`; g.fillRect(0, 0, E.W, E.H); }
} });
// c08b: one desk, the death god looms
registerShot('c08b', { zoom: 0.05, draw(g, t, info) {
  const gy = room(g, t, { red: 0.9 }); rays(g, E.W / 2, E.H * 0.4, 260, 900, t, 0.25, 48, '255,60,60'); reaper(g, t, E.W * 0.5, E.H * 0.33 - 30 * Math.sin(t * 2), 1.15 - 0.15 * t, 0.75);
  person(g, KIRA(t, { x: E.W * 0.5, y: gy, pose: breathe(POSES.explain, t * 5), expr: 'smirk' })); desk(g, t, gy, { lines: writer(0, 3, 0.4, 0.35) });
  L(g, t, 0.05, 'ONE DESK', { size: 90, color: RED }); flash(g, t, 0, 0.2, '255,40,40');
} });
// c09 a name takes seconds: fast writing close-up, names fly off the page
registerShot('c09', { zoom: 0.06, draw(g, t, info) {
  g.fillStyle = '#07040a'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.5, 900, RED, 0.35); rays(g, E.W / 2, E.H * 0.5, 500, 1000, t * 3, 0.16, 48, '255,60,60');
  book(g, t, E.W / 2, E.H * 0.5, 1.25, { lines: writer(0, 8, 0.17, 0.16), flips: [1.1], rot: -0.06, glow: 0.3 }); L(g, t, 0.05, 'A NAME TAKES', { size: 70, color: WHITE });
} });
// c09b: ...seconds, not a minute
registerShot('c09b', { zoom: 0.03, draw(g, t, info) {
  const gy = room(g, t, { red: 0.6 }); person(g, KIRA(t, { x: E.W * 0.5, y: gy, pose: breathe(POSES.explain, t * 6), expr: 'smirk' })); desk(g, t, gy, { lines: writer(0, 4, 0.3, 0.25) });
  const k = pop(t, 0.1, 0.3); if (k > 0) { g.save(); g.translate(E.W / 2, ZT()); g.scale(k, k); label(g, 'SECONDS', 0, 0, { size: 96, color: RED }); g.restore(); }
  const m = pop(t, 1.2, 0.3); if (m > 0) { g.save(); g.translate(E.W / 2, E.H * 0.255); g.scale(m, m); label(g, 'NOT 1 MINUTE', 0, 0, { size: 54, color: GREY }); seg(g, [[-210, 0], [210, 0]], 6, RED); g.restore(); }
} });
// c10 the limit was never the notebook
registerShot('c10', { zoom: 0.02, draw(g, t, info) {
  const gy = room(g, t, { red: 0.3, dim: 0.2, nowin: true }); reaper(g, t, E.W * 0.5, E.H * 0.4, 0.8, 0.5);
  person(g, { who: 'KIRA', x: E.W * 0.27, y: gy, s: SC() * 0.85, facing: 1, pose: breathe(POSES.relaxed, t), expr: 'smirk', rim: RIM, t }); person(g, { who: 'DET', x: E.W * 0.73, y: gy, s: SC() * 0.85, facing: -1, pose: breathe(POSES.think, t), expr: 'thinking', rim: { color: '#9fb4ff', dir: [-0.5, -0.8], w: 4 }, t });
  L(g, t, 0.1, 'THE LIMIT WAS NEVER THE NOTEBOOK', { size: 46, color: WHITE });
} });
// c10b: close-up of the one who could stop him
registerShot('c10b', { zoom: 0.05, draw(g, t, info) {
  const gy = room(g, t, { red: 0.25, dim: 0.3, nowin: true }); drawMoon(g, E.W * 0.84, E.H * 0.38, 80);
  person(g, { who: 'DET', x: E.W * 0.5, y: E.H * 0.98, s: SC() * 1.6, facing: 1, pose: breathe(POSES.think, t), expr: 'thinking', rim: { color: '#9fb4ff', dir: [-0.5, -0.8], w: 5 }, t });
  for (let i = 0; i < 4; i++) { const k = (t * 0.5 + i / 4) % 1; text(g, '?', E.W * (0.2 + i * 0.2) + Math.sin(t * 2 + i) * 20, E.H * 0.6 - k * 380, { size: 90 + i * 12, font: 'Nunito', weight: 900, color: `rgba(255,70,70,${1 - k})` }); }
  const k = pop(t, 0.8, 0.3); if (k > 0) { g.save(); g.translate(E.W / 2, ZT()); g.scale(k, k); label(g, 'WHO STOPS HIM?', 0, 0, { size: 84, color: RED }); g.restore(); } flash(g, t, 0, 0.2);
} });
// c11 final: Kira, pen ready
registerShot('c11', { zoom: 0.03, draw(g, t, info) {
  const gy = room(g, t, { red: 0.5 + 0.2 * Math.sin(t * 3) }); person(g, KIRA(t, { x: E.W * 0.5, y: gy, pose: breathe(POSES.think, t), expr: 'smirk' })); desk(g, t, gy, { hover: true });
  L(g, t, 0.15, 'SO...', { size: 96, color: WHITE });
} });
// c11b: blank page, pen hovering. The question.
registerShot('c11b', { zoom: 0.05, draw(g, t, info) {
  g.fillStyle = '#07040a'; g.fillRect(0, 0, E.W, E.H); const pulse = 0.25 + 0.15 * Math.sin(t * 7); glow(g, E.W / 2, E.H * 0.5, 900, RED, pulse + 0.15); rays(g, E.W / 2, E.H * 0.5, 500, 1000, t, 0.12, 40, '255,60,60');
  book(g, t, E.W / 2, E.H * 0.52, 1.25, { hover: true, rot: -0.06, glow: 0.3 }); if (Math.floor(t * 3) % 2 === 0) seg(g, [[E.W / 2 + 70, E.H * 0.52 - 160], [E.W / 2 + 70, E.H * 0.52 - 118]], 8, RED);
  L(g, t, 0.05, 'WOULD YOU WRITE', { size: 66, color: WHITE }); const k = pop(t, 0.5, 0.35); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.255); g.scale(k, k); label(g, 'THE FIRST NAME?', 0, 0, { size: 80, color: RED }); g.restore(); }
} });
