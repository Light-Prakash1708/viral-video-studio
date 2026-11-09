// sets/money.js: the story's device. Rupee-style notes with a glowing countdown strip that burn at zero
// (char + glowing ember edge + embers + smoke + ash), the day HUD, the big calendar card, the bank app,
// coins, gold bars, price boards, charts. All 2D, logical units. Generic designs (not real currency art).
import { E, V, S, rr, seg, poly, circle, ring, glow, alpha, shade, mix, linGrad, radGrad, text, ease, prog, clamp, lerp, rng, noise, wordTime } from '/engine/core.js';

export const EMBER = '#ff8a2a', GOLD = '#ffc15a', HOT = '#ffe2a0', TEAL = '#5fd8d0', ASH = '#4a4440';
// word time relative to the shot start
export const local = (info, t, w, fb = null) => { const x = wordTime(w, info.globalT - t - 0.3); return x == null ? fb : x - (info.globalT - t); };

// ---------- the banknote ----------
const NW = 600, NH = 280;
export const PALS = {
  r500: { a: '#9aa79a', b: '#6e7c72', ink: '#2c3a33', hi: '#d8e2d6', accent: '#c8a050' },   // stone-grey 500
  r100: { a: '#a99ac4', b: '#7a6c98', ink: '#2e2440', hi: '#e6def4', accent: '#d0a860' },   // lavender 100
  r2000:{ a: '#c890b4', b: '#946084', ink: '#3a1c30', hi: '#f4dcea', accent: '#e0b060' },
  sepia:{ a: '#e2cfa4', b: '#c0a676', ink: '#4a3420', hi: '#f6ead0', accent: '#8a5a30' },
  chiem:{ a: '#9cc8a4', b: '#5a9a7a', ink: '#163a2c', hi: '#e0f4e4', accent: '#e8b84a' },
};
function burnPath(g, b, seed, t) {
  const ox = NW / 2 + 30, oy = NH / 2 + 30, R = b * Math.hypot(NW, NH) * 1.12, pts = [];
  for (let i = 0; i <= 96; i++) { const a = Math.PI + (i / 96) * Math.PI * 0.5 - 0.15 + (i / 96) * 0.3; const rr2 = R * (1 + 0.13 * noise(i * 0.31, seed) + 0.05 * noise(i * 1.3 + t * 2, seed + 4)); pts.push([ox + Math.cos(a) * rr2, oy + Math.sin(a) * rr2]); }
  return { pts, ox, oy, R };
}
// note(g, x, y, s, { value, timer, burn, t, rot, a, pal, urgent, glowT, seed, label, timerA, shadow })
export function note(g, x, y, s, o = {}) {
  const { value = '500', timer = '30 DAYS', burn = 0, t = 0, rot = 0, a = 1, pal = 'r500', urgent = 0, seed = 3, timerA = 1, shadow = true, word = null } = o;
  if (a <= 0 || burn >= 1) return; const P = PALS[pal] || PALS.r500;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot); g.scale(s, s);
  const bp = burn > 0 ? burnPath(g, burn, seed, t) : null;
  if (shadow) { g.save(); g.fillStyle = 'rgba(0,0,0,.35)'; rr(g, -NW / 2 + 14, -NH / 2 + 18, NW, NH, 14); g.filter = 'blur(10px)'; g.fill(); g.restore(); }
  g.save();
  if (bp) { g.beginPath(); g.rect(-NW / 2 - 40, -NH / 2 - 40, NW + 80, NH + 80); g.moveTo(bp.ox, bp.oy); bp.pts.forEach((p) => g.lineTo(p[0], p[1])); g.closePath(); g.clip('evenodd'); }
  rr(g, -NW / 2, -NH / 2, NW, NH, 12); g.fillStyle = linGrad(g, -NW / 2, -NH / 2, NW / 2, NH / 2, [P.hi, P.a, P.b]); g.fill(); g.save(); g.clip();
  // guilloche waves
  g.strokeStyle = alpha(P.ink, 0.16); g.lineWidth = 2;
  for (let k = 0; k < 9; k++) { g.beginPath(); for (let xx = -NW / 2; xx <= NW / 2; xx += 8) { const yy = -NH / 2 + 20 + k * 30 + Math.sin(xx * 0.03 + k) * 9; xx === -NW / 2 ? g.moveTo(xx, yy) : g.lineTo(xx, yy); } g.stroke(); }
  // rosette emblem (generic)
  g.save(); g.translate(-150, 6); g.strokeStyle = alpha(P.ink, 0.42); g.lineWidth = 2.2; for (let k = 0; k < 12; k++) { g.save(); g.rotate((k * Math.PI) / 12); g.beginPath(); g.ellipse(0, 0, 92, 34, 0, 0, 7); g.stroke(); g.restore(); }
  ring(g, 0, 0, 40, 3, alpha(P.ink, 0.5)); circle(g, 0, 0, 30, alpha(P.hi, 0.5)); text(g, '₹', 0, 3, { size: 44, font: 'Nunito', weight: 900, color: alpha(P.ink, 0.75) }); g.restore();
  // watermark oval + security thread
  g.fillStyle = alpha(P.hi, 0.35); g.beginPath(); g.ellipse(170, 0, 70, 90, 0, 0, 7); g.fill();
  g.fillStyle = alpha(P.accent, 0.8); for (let yy = -NH / 2; yy < NH / 2; yy += 22) g.fillRect(48, yy, 7, 14);
  // borders + denominations
  g.restore(); g.strokeStyle = alpha(P.ink, 0.5); g.lineWidth = 3; rr(g, -NW / 2 + 12, -NH / 2 + 12, NW - 24, NH - 24, 8); g.stroke();
  text(g, value, NW / 2 - 30, -NH / 2 + 52, { size: 64, font: 'Nunito', weight: 900, color: P.ink, align: 'right' });
  text(g, '₹' + value, -NW / 2 + 32, NH / 2 - 40, { size: 34, font: 'Nunito', weight: 900, color: P.ink, align: 'left' });
  text(g, o.label || 'RUPEES', -NW / 2 + 34, -NH / 2 + 44, { size: 20, font: 'Nunito', weight: 900, color: alpha(P.ink, 0.8), align: 'left', spacing: 4 });
  // countdown strip
  if (timer && timerA > 0) {
    const fl = urgent ? 0.7 + 0.3 * Math.abs(Math.sin(t * 20)) : 1, tc = urgent ? mix(EMBER, '#ff3a1e', urgent) : EMBER;
    g.save(); g.globalAlpha *= timerA; rr(g, 70, 46, 238, 72, 14); g.fillStyle = 'rgba(10,6,4,.92)'; g.fill(); g.strokeStyle = alpha(tc, 0.6 * fl); g.lineWidth = 2.5; g.stroke();
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radGrad(g, 189, 82, 0, 160, [alpha(tc, 0.35 * fl), alpha(tc, 0)]); g.fillRect(20, 0, 340, 170); g.restore();
    let fs = 40; g.font = `900 ${fs}px "Nunito"`; const mw = g.measureText(timer).width; if (mw > 210) fs *= 210 / mw;
    text(g, timer, 189, 84, { size: fs, font: 'Nunito', weight: 900, color: mix(tc, '#fff2d0', 0.35), glow: 16, glowColor: alpha(tc, 0.95), alpha: fl });
    g.restore();
  }
  if (word) text(g, word, 0, 0, { size: 90, weight: 700, color: '#fff', glow: 20 });
  g.restore();
  // burn front: char band, ember edge, embers, smoke
  if (bp) {
    g.save(); rr(g, -NW / 2, -NH / 2, NW, NH, 12); g.clip();
    const path = () => { g.beginPath(); bp.pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); };
    path(); g.strokeStyle = 'rgba(40,18,8,.85)'; g.lineWidth = 40; g.lineJoin = 'round'; g.stroke();
    path(); g.strokeStyle = 'rgba(20,8,4,.95)'; g.lineWidth = 16; g.stroke();
    g.globalCompositeOperation = 'lighter'; g.shadowColor = EMBER; g.shadowBlur = 24;
    path(); g.strokeStyle = alpha(EMBER, 0.95); g.lineWidth = 8; g.stroke();
    path(); g.strokeStyle = alpha(HOT, 0.9); g.lineWidth = 2.5; g.stroke();
    g.restore();
    const r = rng(seed + 11), inside = (p) => Math.abs(p[0]) < NW / 2 + 4 && Math.abs(p[1]) < NH / 2 + 4;
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 46; i++) { const p = bp.pts[Math.floor(r() * bp.pts.length)]; if (!inside(p)) { r(); r(); continue; } const ph = (t * (0.6 + r() * 0.8) + r()) % 1; const ex = p[0] + Math.sin(ph * 6 + i) * 18 - ph * 30, ey = p[1] - ph * (120 + r() * 160); circle(g, ex, ey, 2.5 * (1 - ph) + 0.8, alpha(i % 3 ? EMBER : HOT, 0.9 * (1 - ph))); }
    g.restore();
    for (let i = 0; i < 9; i++) { const p = bp.pts[Math.floor(r() * bp.pts.length)]; if (!inside(p)) continue; const ph = (t * 0.35 + r()) % 1; const sx = p[0] - ph * 80 + Math.sin(t + i) * 20, sy = p[1] - 40 - ph * 260, sr = 40 + ph * 110; g.fillStyle = radGrad(g, sx, sy, 0, sr, [`rgba(90,84,80,${0.22 * (1 - ph)})`, 'rgba(60,56,54,0)']); g.beginPath(); g.arc(sx, sy, sr, 0, 7); g.fill(); }
    for (let i = 0; i < 22; i++) { const p = bp.pts[Math.floor(r() * bp.pts.length)]; if (!inside(p)) continue; const ph = (t * 0.5 + r()) % 1; const ax = p[0] - ph * 140 + Math.sin(ph * 9 + i) * 26, ay = p[1] - ph * 200 + ph * ph * 120; g.save(); g.translate(ax, ay); g.rotate(ph * 8 + i); g.fillStyle = alpha(i % 2 ? '#3a3430' : '#6a625c', 0.85 * (1 - ph)); g.fillRect(-6, -3, 12 * (0.5 + r()), 6); g.restore(); }
  }
  g.restore();
}
// falling / drifting ash flakes over a whole frame, with a few glowing embers
export function ashFall(g, t, o = {}) {
  const { count = 70, seed = 5, a = 1, up = false, ember = 0.3, area = [0, 0, E.W, E.H] } = o; if (a <= 0) return; const r = rng(seed);
  for (let i = 0; i < count; i++) { const sp = 40 + r() * 90, x0 = area[0] + r() * area[2], y0 = r() * area[3], ph = r() * 6, hot = r() < ember; const y = area[1] + ((up ? y0 - t * sp : y0 + t * sp) % area[3] + area[3]) % area[3]; const x = x0 + Math.sin(t * 0.9 + ph) * 30;
    if (hot) { g.save(); g.globalCompositeOperation = 'lighter'; circle(g, x, y, 2.2 + r() * 2, alpha(EMBER, 0.8 * a)); glow(g, x, y, 14, EMBER, 0.4 * a); g.restore(); }
    else { g.save(); g.translate(x, y); g.rotate(t * (r() - 0.5) * 4 + ph); g.fillStyle = alpha(r() < 0.5 ? '#2e2a28' : '#5a524c', 0.8 * a); g.fillRect(-5, -2.5, 6 + r() * 10, 5); g.restore(); }
  }
}
export function embers(g, t, o = {}) {
  const { count = 40, seed = 8, a = 1, area = [0, 0, E.W, E.H], color = EMBER } = o; const r = rng(seed); g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < count; i++) { const sp = 60 + r() * 140, x0 = area[0] + r() * area[2], ph = r(); const u = (t * sp / area[3] + ph) % 1; const x = x0 + Math.sin(t * 2 + i) * 24, y = area[1] + area[3] * (1 - u); circle(g, x, y, 1.5 + r() * 2.5, alpha(r() < 0.3 ? HOT : color, a * (1 - u) * 0.9)); }
  g.restore();
}
// 30-day countdown formatting from remaining seconds
export const fmtT = (sec) => { sec = Math.max(0, sec); const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60); return `${String(d).padStart(2, '0')}:${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; };

// ---------- the scrip (Wörgl stamp money) ----------
export function scrip(g, x, y, s, o = {}) {
  const { stamps = 0, a = 1, rot = 0, t = 0, closed = 0, modern = false } = o; if (a <= 0) return;
  const P = modern ? PALS.chiem : PALS.sepia;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.save(); g.fillStyle = 'rgba(0,0,0,.35)'; g.filter = 'blur(10px)'; rr(g, -NW / 2 + 14, -NH / 2 + 18, NW, NH, 10); g.fill(); g.restore();
  rr(g, -NW / 2, -NH / 2, NW, NH, 10); g.fillStyle = linGrad(g, -NW / 2, -NH / 2, NW / 2, NH / 2, [P.hi, P.a, P.b]); g.fill();
  g.strokeStyle = alpha(P.ink, 0.6); g.lineWidth = 4; rr(g, -NW / 2 + 12, -NH / 2 + 12, NW - 24, NH - 24, 6); g.stroke(); g.lineWidth = 1.5; rr(g, -NW / 2 + 20, -NH / 2 + 20, NW - 40, NH - 40, 4); g.stroke();
  if (!modern) {
    text(g, 'WÖRGL', -110, -84, { size: 46, font: 'Playfair Display', weight: 900, color: P.ink, spacing: 6 });
    text(g, 'WORK CERTIFICATE', -110, -42, { size: 20, font: 'Nunito', weight: 900, color: alpha(P.ink, 0.8), spacing: 3 });
    text(g, '1', -110, 36, { size: 110, font: 'Playfair Display', weight: 900, color: P.ink });
    text(g, 'SCHILLING · 1932', -110, 108, { size: 20, font: 'Nunito', weight: 900, color: alpha(P.ink, 0.8), spacing: 3 });
    // 12 monthly stamp boxes
    const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    for (let i = 0; i < 12; i++) { const bx = 50 + (i % 4) * 58, by = -100 + Math.floor(i / 4) * 72; g.strokeStyle = alpha(P.ink, 0.5); g.lineWidth = 2; g.strokeRect(bx, by, 50, 62); text(g, M[i], bx + 25, by + 54, { size: 13, font: 'Nunito', weight: 900, color: alpha(P.ink, 0.7) });
      const k = clamp(stamps - i); if (k > 0) { const pk = 1 + 0.6 * (1 - ease.out(clamp(k * 3))); g.save(); g.translate(bx + 25, by + 24); g.rotate(-0.2 + (i % 3) * 0.15); g.scale(pk, pk); g.globalAlpha *= clamp(k * 3); rr(g, -21, -18, 42, 36, 4); g.fillStyle = '#a8402c'; g.fill(); text(g, '-1%', 0, 1, { size: 16, font: 'Nunito', weight: 900, color: '#f6e6c8' }); g.restore(); } }
  } else {
    g.save(); g.translate(-150, 0); g.strokeStyle = alpha(P.ink, 0.35); g.lineWidth = 2; for (let k = 0; k < 10; k++) { g.save(); g.rotate(k * 0.314); g.beginPath(); g.ellipse(0, 0, 90, 30, 0, 0, 7); g.stroke(); g.restore(); } g.restore();
    text(g, 'CHIEMGAUER', 80, -78, { size: 44, font: 'Fredoka', weight: 700, color: P.ink, spacing: 3 });
    text(g, '10', 80, 20, { size: 110, font: 'Nunito', weight: 900, color: P.ink });
    text(g, 'REGIONAL MONEY', 80, 96, { size: 20, font: 'Nunito', weight: 900, color: alpha(P.ink, 0.8), spacing: 4 });
    // expiry sticker
    const k = clamp(stamps); if (k > 0) { g.save(); g.translate(220, 92); g.rotate(-0.12); g.scale(0.6 + 0.4 * ease.outBack(k), 0.6 + 0.4 * ease.outBack(k)); rr(g, -62, -26, 124, 52, 8); g.fillStyle = '#e8b84a'; g.fill(); text(g, 'LOSES VALUE', 0, -6, { size: 13, font: 'Nunito', weight: 900, color: '#3a2a10' }); text(g, 'IF KEPT', 0, 12, { size: 13, font: 'Nunito', weight: 900, color: '#3a2a10' }); g.restore(); }
  }
  if (closed > 0) { const c = ease.out(clamp(closed)), sc = 1 + 1.4 * (1 - c); g.save(); g.rotate(-0.22); g.scale(sc, sc); g.globalAlpha *= clamp(closed * 4); g.strokeStyle = '#d0281e'; g.lineWidth = 12; rr(g, -230, -66, 460, 132, 16); g.stroke(); text(g, 'CLOSED', 0, 4, { size: 108, font: 'Fredoka', weight: 700, color: '#d0281e', spacing: 10 }); g.restore(); }
  g.restore();
}

// ---------- HUD: small persistent day counter (top-right) ----------
export function dayHUD(g, day, t, o = {}) {
  const { a = 1, total = 30 } = o, k = ease.out(prog(t, 0, 0.3)) * a; if (k <= 0) return;
  const x = E.W - 52, y = 46, w = 250, h = 92;
  g.save(); g.globalAlpha *= k; rr(g, x - w, y, w, h, 18); g.fillStyle = 'rgba(8,10,14,.74)'; g.fill(); g.strokeStyle = alpha(EMBER, 0.45); g.lineWidth = 2; g.stroke();
  // mini calendar icon
  rr(g, x - w + 18, y + 16, 58, 60, 8); g.fillStyle = '#f2ead8'; g.fill(); g.save(); rr(g, x - w + 18, y + 16, 58, 60, 8); g.clip(); g.fillStyle = '#d8442a'; g.fillRect(x - w + 18, y + 16, 58, 16); g.restore();
  text(g, String(day), x - w + 47, y + 56, { size: 28, font: 'Nunito', weight: 900, color: '#2a1a14' });
  text(g, 'DAY ' + day, x - w + 92, y + 36, { size: 32, font: 'Nunito', weight: 900, color: '#fff1dc', align: 'left' });
  // days-left bar (burns down)
  const left = clamp((total - day) / total), bx = x - w + 92, bw = w - 116;
  rr(g, bx, y + 60, bw, 12, 6); g.fillStyle = 'rgba(255,255,255,.12)'; g.fill();
  if (left > 0) { rr(g, bx, y + 60, bw * left, 12, 6); g.fillStyle = linGrad(g, bx, 0, bx + bw, 0, [GOLD, EMBER]); g.fill(); glow(g, bx + bw * left, y + 66, 18, EMBER, 0.8 + 0.2 * Math.sin(t * 8)); }
  g.restore();
}

// ---------- big calendar card with a page flip ----------
// calendar(g, t, { from, to, flipAt, x, y, s, sub })
export function calendar(g, t, o = {}) {
  const { from = null, to = 1, flipAt = 0.35, x = E.W / 2, y = E.H * 0.47, s = 1, sub = null, a = 1, tone = '#d8442a' } = o; if (a <= 0) return;
  const W = 470, H = 520;
  const page = (num, dy = 0) => {
    rr(g, -W / 2, -H / 2 + dy, W, H, 26); g.fillStyle = linGrad(g, 0, -H / 2, 0, H / 2, ['#fbf4e6', '#e6dac4']); g.fill();
    g.save(); rr(g, -W / 2, -H / 2 + dy, W, H, 26); g.clip(); g.fillStyle = tone; g.fillRect(-W / 2, -H / 2 + dy, W, 128); g.restore();
    text(g, 'DAY', 0, -H / 2 + 68 + dy, { size: 66, weight: 700, color: '#fff6ea', spacing: 14 });
    text(g, String(num), 0, 70 + dy, { size: 250, font: 'Nunito', weight: 900, color: '#1e1410' });
  };
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s);
  g.save(); g.fillStyle = 'rgba(0,0,0,.5)'; g.filter = 'blur(26px)'; rr(g, -W / 2 + 10, -H / 2 + 40, W, H, 26); g.fill(); g.restore();
  glow(g, 0, 0, 560, tone, 0.18);
  for (let i = 3; i >= 1; i--) { rr(g, -W / 2 + i * 6, -H / 2 + i * 9, W, H, 26); g.fillStyle = shade('#e6dac4', -0.12 * i); g.fill(); }
  page(to);
  if (from != null) { const k = prog(t, flipAt, flipAt + 0.55); if (k < 1) { g.save(); const e = ease.in(k); g.translate(e * 420, -e * 520); g.rotate(e * 0.9); g.globalAlpha *= 1 - k * 0.6; page(from); g.restore(); } }
  for (const dx of [-150, -50, 50, 150]) { rr(g, dx - 10, -H / 2 - 30, 20, 64, 10); g.fillStyle = '#2a2420'; g.fill(); circle(g, dx, -H / 2 + 22, 6, '#1a1410'); }
  g.restore();
  if (sub) text(g, sub, x, y + H * s * 0.5 + 70, { size: 54, weight: 700, color: '#fff1dc', glow: 18, glowColor: alpha(EMBER, 0.6), spacing: 6, alpha: a * ease.out(prog(t, flipAt + 0.4, flipAt + 0.8)) });
}

// ---------- bank app on a phone ----------
// phoneApp(g, x, y, s, { balance, timer, left (0..1 of bar), t, urgent, title, zero })
export function phoneApp(g, x, y, s, o = {}) {
  const { balance = '₹ 24,500', timer = '29d 23h 59m', left = 1, t = 0, urgent = 0, title = 'MY BANK', label = 'SAVINGS BALANCE', tilt = 0, sub = 'EXPIRES IN' } = o;
  const W = 380, H = 760; g.save(); g.translate(x, y); g.rotate(tilt); g.scale(s, s);
  g.save(); g.fillStyle = 'rgba(0,0,0,.5)'; g.filter = 'blur(24px)'; rr(g, -W / 2 + 16, -H / 2 + 26, W, H, 56); g.fill(); g.restore();
  rr(g, -W / 2, -H / 2, W, H, 56); g.fillStyle = '#07090c'; g.fill(); g.strokeStyle = 'rgba(160,190,200,.35)'; g.lineWidth = 3; g.stroke();
  rr(g, -W / 2 + 16, -H / 2 + 16, W - 32, H - 32, 44); g.fillStyle = linGrad(g, 0, -H / 2, 0, H / 2, ['#0e2a32', '#081820', '#06100e']); g.fill();
  g.save(); rr(g, -W / 2 + 16, -H / 2 + 16, W - 32, H - 32, 44); g.clip();
  rr(g, -60, -H / 2 + 28, 120, 26, 13); g.fillStyle = '#07090c'; g.fill();
  text(g, '9:41', -W / 2 + 60, -H / 2 + 42, { size: 20, font: 'Nunito', weight: 900, color: '#cfe8ec' });
  circle(g, -W / 2 + 70, -H / 2 + 112, 26, TEAL); text(g, '₹', -W / 2 + 70, -H / 2 + 114, { size: 30, font: 'Nunito', weight: 900, color: '#062026' });
  text(g, title, -W / 2 + 110, -H / 2 + 112, { size: 28, font: 'Nunito', weight: 900, color: '#e8fbff', align: 'left', spacing: 2 });
  text(g, label, 0, -H / 2 + 210, { size: 20, font: 'Nunito', weight: 800, color: '#8fb8c0', spacing: 3 });
  let fs = 64; g.font = `900 ${fs}px "Nunito"`; const bw = g.measureText(balance).width; if (bw > W - 70) fs *= (W - 70) / bw;
  text(g, balance, 0, -H / 2 + 270, { size: fs, font: 'Nunito', weight: 900, color: '#ffffff' });
  const tc = urgent ? mix(EMBER, '#ff3a1e', urgent) : EMBER, fl = urgent ? 0.75 + 0.25 * Math.abs(Math.sin(t * 16)) : 1;
  rr(g, -W / 2 + 36, -H / 2 + 330, W - 72, 120, 22); g.fillStyle = 'rgba(30,12,6,.9)'; g.fill(); g.strokeStyle = alpha(tc, 0.7 * fl); g.lineWidth = 2.5; g.stroke();
  text(g, sub, 0, -H / 2 + 362, { size: 18, font: 'Nunito', weight: 900, color: alpha(tc, 0.9), spacing: 4 });
  let ts = 44; g.font = `900 ${ts}px "Nunito"`; const tw = g.measureText(timer).width; if (tw > W - 110) ts *= (W - 110) / tw;
  text(g, timer, 0, -H / 2 + 412, { size: ts, font: 'Nunito', weight: 900, color: mix(tc, '#fff2d0', 0.3), glow: 14, glowColor: alpha(tc, 0.9), alpha: fl });
  // 30-day burn bar
  const bx = -W / 2 + 36, by = -H / 2 + 480, bwid = W - 72; rr(g, bx, by, bwid, 18, 9); g.fillStyle = 'rgba(255,255,255,.1)'; g.fill();
  if (left > 0) { rr(g, bx, by, bwid * left, 18, 9); g.fillStyle = linGrad(g, bx, 0, bx + bwid, 0, [GOLD, tc]); g.fill(); glow(g, bx + bwid * left, by + 9, 26, tc, 0.9); }
  text(g, '30 DAYS', bx + bwid, by + 44, { size: 16, font: 'Nunito', weight: 800, color: '#6f8a90', align: 'right' }); text(g, 'TODAY', bx, by + 44, { size: 16, font: 'Nunito', weight: 800, color: '#6f8a90', align: 'left' });
  // transaction rows
  for (let i = 0; i < 3; i++) { const ry = -H / 2 + 560 + i * 56; rr(g, bx, ry, bwid, 44, 12); g.fillStyle = 'rgba(255,255,255,.05)'; g.fill(); circle(g, bx + 24, ry + 22, 12, alpha(TEAL, 0.5)); rr(g, bx + 48, ry + 14, 120 - i * 20, 14, 7); g.fillStyle = 'rgba(255,255,255,.2)'; g.fill(); }
  g.restore(); g.restore();
}

// ---------- props ----------
export function coin(g, x, y, r, o = {}) {
  const { a = 1, spin = 0, label = '₹' } = o; if (a <= 0) return; const sx = Math.max(0.12, Math.abs(Math.cos(spin)));
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(sx, 1);
  circle(g, 0, r * 0.12, r, '#8a5a1a'); circle(g, 0, 0, r, linGrad(g, -r, -r, r, r, ['#fff0b0', '#f2b84a', '#b8761e'])); ring(g, 0, 0, r * 0.78, r * 0.08, 'rgba(120,70,10,.6)');
  if (sx > 0.4) text(g, label, 0, r * 0.05, { size: r * 1.0, font: 'Nunito', weight: 900, color: 'rgba(110,62,8,.85)' });
  g.restore();
}
export function goldBar(g, x, y, s, o = {}) {
  const { a = 1, shine = 0 } = o; if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s);
  poly(g, [[-90, 0], [90, 0], [70, -46], [-70, -46]], linGrad(g, 0, -46, 0, 0, ['#ffe58a', '#e0a030', '#9a6414'])); poly(g, [[-70, -46], [70, -46], [56, -58], [-56, -58]], '#fff2b8');
  text(g, '999.9', 0, -24, { size: 18, font: 'Nunito', weight: 900, color: 'rgba(110,62,8,.7)' });
  if (shine) { g.save(); g.globalCompositeOperation = 'lighter'; const sx = -120 + ((shine * 260) % 300); g.fillStyle = linGrad(g, sx - 20, 0, sx + 20, 0, ['rgba(255,255,255,0)', 'rgba(255,255,240,.6)', 'rgba(255,255,255,0)']); g.beginPath(); g.moveTo(sx - 20, 0); g.lineTo(sx + 10, -58); g.lineTo(sx + 30, -58); g.lineTo(sx, 0); g.fill(); g.restore(); }
  g.restore();
}
// price board that flips between values (e.g. momos)
export function priceBoard(g, x, y, s, t, o = {}) {
  const { title = 'MOMOS', prices = ['₹60'], at = [0], color = '#ffd27a' } = o; let i = 0; at.forEach((tt, k) => { if (t >= tt) i = k; });
  const kf = prog(t, at[i], at[i] + 0.25), W = 360, H = 250;
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -W / 2, -H / 2, W, H, 18); g.fillStyle = '#16100c'; g.fill(); g.strokeStyle = alpha(color, 0.6); g.lineWidth = 4; g.stroke();
  glow(g, 0, 0, 300, color, 0.12);
  text(g, title, 0, -H / 2 + 44, { size: 40, weight: 700, color: '#fff1dc', spacing: 5 });
  text(g, '1 PLATE', 0, -H / 2 + 84, { size: 20, font: 'Nunito', weight: 900, color: '#b8a890', spacing: 4 });
  g.save(); g.translate(0, 50); g.scale(1, i > 0 ? Math.max(0.05, Math.abs(Math.cos(Math.PI * (1 - ease.out(kf))))) : 1);
  text(g, prices[i], 0, 0, { size: 104, font: 'Nunito', weight: 900, color: i ? mix(color, '#ff5a3c', i / Math.max(1, prices.length - 1)) : color, glow: 18, glowColor: alpha(i ? '#ff5a3c' : color, 0.7) });
  g.restore(); g.restore();
}
// rising line chart in a dark card; pts in 0..1, draws on with k
export function chart(g, x, y, w, h, pts, k, o = {}) {
  const { color = GOLD, fill = true, grid = true, lw = 7, a = 1, bg = true } = o; if (a <= 0) return;
  g.save(); g.globalAlpha *= a;
  if (bg) { rr(g, x - 30, y - 30, w + 60, h + 60, 22); g.fillStyle = 'rgba(6,10,14,.78)'; g.fill(); }
  if (grid) { g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(x, y + (h * i) / 4); g.lineTo(x + w, y + (h * i) / 4); g.stroke(); } }
  const n = pts.length, m = clamp(k) * (n - 1), P = [];
  for (let i = 0; i <= Math.floor(m); i++) P.push([x + (i / (n - 1)) * w, y + h - pts[i] * h]);
  if (m % 1 > 0 && Math.floor(m) < n - 1) { const i = Math.floor(m), f = m - i; P.push([x + ((i + f) / (n - 1)) * w, y + h - lerp(pts[i], pts[i + 1], f) * h]); }
  if (P.length > 1) {
    if (fill) { g.beginPath(); g.moveTo(P[0][0], y + h); P.forEach((p) => g.lineTo(p[0], p[1])); g.lineTo(P[P.length - 1][0], y + h); g.closePath(); g.fillStyle = linGrad(g, 0, y, 0, y + h, [alpha(color, 0.35), alpha(color, 0)]); g.fill(); }
    g.save(); g.shadowColor = color; g.shadowBlur = 18; seg(g, P, lw, color); g.restore();
    const L = P[P.length - 1]; glow(g, L[0], L[1], 50, color, 0.8); circle(g, L[0], L[1], 9, '#fff');
  }
  g.restore();
  return P.length ? P[P.length - 1] : [x, y + h];
}
// big glowing arrow (up/down)
export function arrow(g, x, y, s, color = '#5fe88a', dir = -1, a = 1) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s * -dir);
  g.shadowColor = color; g.shadowBlur = 30; poly(g, [[-30, 60], [30, 60], [30, -20], [70, -20], [0, -100], [-70, -20], [-30, -20]], color); g.restore();
}
// stick hand / forearm reaching in from an edge (insert close-ups). side: 1 from left, -1 from right
export function armIn(g, x, y, s, ang, o = {}) {
  const { sleeve = '#d64a33', ink = S().ink, rim = '#ffc68a', grip = 0.5 } = o;
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  seg(g, [[-1400, 0], [0, 0]], 116, rim); seg(g, [[-1400, 0], [0, 0]], 108, ink); seg(g, [[-1400, 0], [-260, 0]], 150, sleeve); seg(g, [[-1400, -46], [-260, -46]], 10, alpha(rim, 0.5));
  circle(g, 30, 0, 82, rim); circle(g, 30, 0, 76, ink);
  for (let i = 0; i < 4; i++) { const fy = -48 + i * 32; seg(g, [[60, fy], [120 - grip * 40, fy - 6], [140 - grip * 90, fy + grip * 30]], 30, ink); }
  seg(g, [[20, 50], [80, 96]], 32, ink);
  g.restore();
}
// dark cinematic backdrop with bokeh orbs (insert shots)
export function bokehBG(g, t, o = {}) {
  const { top = '#05080c', bot = '#1a1410', warm = EMBER, cool = TEAL, count = 22, seed = 4, a = 1 } = o;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, [top, bot]); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  const r = rng(seed); g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < count; i++) { const x = r() * E.W + Math.sin(t * 0.3 + i) * 30, y = r() * E.H, rad = 30 + r() * 110, c = r() < 0.6 ? warm : cool; g.fillStyle = radGrad(g, x, y, rad * 0.6, rad, [alpha(c, 0.12 * a), alpha(c, 0.0)]); g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill(); ring(g, x, y, rad * 0.92, 2, alpha(c, 0.05 * a)); }
  g.restore();
}
