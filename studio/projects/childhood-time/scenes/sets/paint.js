// sets/paint.js: nostalgic painterly toolkit + sets. Paper grain, watercolour blobs, brush-stroke grass,
// light leaks, polaroids, a memory jar, calendars and clear title text.
import { E, V, mood, layer, blurLayer, backdrop, rr, seg, poly, circle, glow, alpha, shade, mix, linGrad, radGrad, text, ease, prog, clamp, lerp, rng, S } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const GY = () => E.H * V(0.8, 0.68);

// ---------- painterly primitives ----------
let _paper = null;
function paperTex() {
  if (_paper) return _paper;
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'), r = rng(77);
  x.fillStyle = '#808080'; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) { const v = 100 + r() * 60; x.fillStyle = `rgba(${v},${v},${v},${0.05 + r() * 0.08})`; x.fillRect(r() * 512, r() * 512, 1 + r() * 2.5, 1 + r() * 2.5); }
  for (let i = 0; i < 260; i++) { const v = 90 + r() * 80; x.strokeStyle = `rgba(${v},${v},${v},.08)`; x.lineWidth = 1; x.beginPath(); const a = r() * 512, b = r() * 512; x.moveTo(a, b); x.quadraticCurveTo(a + r() * 40 - 20, b + r() * 40 - 20, a + r() * 70 - 35, b + r() * 70 - 35); x.stroke(); }
  _paper = c; return c;
}
// paper grain over the finished frame (call last in a shot)
export function paper(g, a = 0.13) {
  g.save(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = a; g.fillStyle = g.createPattern(paperTex(), 'repeat'); g.fillRect(0, 0, E.W, E.H); g.restore();
}
// warm light leak from a corner, slowly breathing
export function leak(g, t, o = {}) {
  bokeh(g, t, { a: (o.a ?? 0.2) * 0.9 });
  const { x = E.W * 0.9, y = E.H * 0.1, color = '#ffb060', a = 0.2 } = o;
  g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = radGrad(g, x, y, 0, E.H * 0.7, [alpha(color, a * (0.8 + 0.2 * Math.sin(t * 0.8))), alpha(color, 0)]); g.fillRect(0, 0, E.W, E.H); g.restore();
}
// wobbly watercolour blob: several translucent offset layers with jittered edges
export function blob(g, x, y, r, color, seed = 1, a = 0.35, layers = 3) {
  const R = rng(seed);
  for (let l = 0; l < layers; l++) {
    g.fillStyle = alpha(color, a / layers * 1.6); g.beginPath();
    const n = 22, ox = (R() - 0.5) * r * 0.15, oy = (R() - 0.5) * r * 0.15;
    for (let i = 0; i <= n; i++) { const ang = (i / n) * Math.PI * 2, rr2 = r * (0.85 + R() * 0.25); const px = x + ox + Math.cos(ang) * rr2, py = y + oy + Math.sin(ang) * rr2 * 0.8; i ? g.lineTo(px, py) : g.moveTo(px, py); }
    g.closePath(); g.fill();
  }
}
export function watercolourSky(g, M, seed = 3) {
  backdrop(g, M.sky);
  const R = rng(seed);
  for (let i = 0; i < 9; i++) blob(g, R() * E.W * 1.6 - E.W * 0.3, R() * E.H * 0.55, 180 + R() * 260, M.sky[Math.floor(R() * M.sky.length)], seed + i, 0.28);
}
// brush-stroke grass band
export function grass(g, y0, y1, M, t, o = {}) {
  const { seed = 5, density = 900, tint = M.grass || '#6aa84a', flowers = 0 } = o, R = rng(seed);
  g.fillStyle = linGrad(g, 0, y0, 0, y1, [shade(tint, 0.1), shade(tint, -0.35)]); g.fillRect(-E.W, y0, E.W * 3, y1 - y0 + E.H);
  for (let i = 0; i < density; i++) {
    const x = R() * E.W * 1.8 - E.W * 0.4, y = y0 + Math.pow(R(), 0.7) * (y1 - y0), h = 14 + R() * 40 * (0.4 + (y - y0) / (y1 - y0)), sway = Math.sin(t * 1.6 + x * 0.01) * 5;
    g.strokeStyle = alpha(shade(tint, (R() - 0.5) * 0.5), 0.75); g.lineWidth = 2 + R() * 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + sway * 0.5, y - h * 0.6, x + sway, y - h); g.stroke();
  }
  const F = rng(seed + 9); for (let i = 0; i < flowers; i++) { const x = F() * E.W * 1.6 - E.W * 0.3, y = y0 + 20 + F() * (y1 - y0); circle(g, x, y, 4 + F() * 5, ['#fff4d0', '#ff9aa8', '#ffd27a', '#c8a8ff'][i % 4]); }
}
// faded-photo polaroid with a painted thumbnail and a handwritten caption
export function polaroid(g, x, y, s, rot, caption, paint, o = {}) {
  const { a = 1 } = o;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(-112, -118, 236, 270);
  g.fillStyle = '#fbf4e6'; g.fillRect(-118, -126, 236, 270);
  g.save(); g.beginPath(); g.rect(-102, -110, 204, 190); g.clip(); paint(g); g.restore();
  text(g, caption, 0, 112, { size: 30, font: 'Fredoka', weight: 600, color: '#4a3a30' });
  g.restore();
}
// big, clear on-screen text with a soft dark backing (readable on any painting)
export function bigWord(g, str, y, a = 1, o = {}) {
  if (a <= 0) return;
  const { size = V(96, 112), color = '#fff3e0', sub = null, scale = 1 } = o;
  g.save(); g.globalAlpha *= a; g.translate(E.W / 2, y); g.scale(scale, scale);
  g.font = `700 ${size}px "Fredoka"`; let mw = g.measureText(str).width; if (sub) { g.font = `800 ${size * 0.36}px "Nunito"`; mw = Math.max(mw, g.measureText(sub).width * 1.15); } const w = Math.min(E.W * 0.94, mw + size * 1.1), h = size * (sub ? 2.1 : 1.45);
  rr(g, -w / 2, -size * 0.78, w, h, size * 0.45); g.fillStyle = 'rgba(22,14,10,.62)'; g.fill();
  text(g, str, 0, 0, { size, color, glow: 18, glowColor: 'rgba(255,190,110,.6)', spacing: 3 });
  if (sub) text(g, sub, 0, size * 0.82, { size: size * 0.36, font: 'Nunito', weight: 800, color: '#f2d8b0', spacing: 4 });
  g.restore();
}

// ---------- sets ----------
export function meadow(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), gy = GY();
  layer(g, cam, 0.1, (g) => { watercolourSky(g, M, o.seed || 3); FX.sun(g, E.W * (o.sunX ?? 0.7), gy - V(520, 820), 80, '#fff4dc', M.key, 6); });
  layer(g, cam, 0.25, (g) => { const R = rng(11); for (let i = 0; i < 8; i++) blob(g, R() * E.W * 1.8 - E.W * 0.4, gy - V(260, 420) + R() * 80, 260 + R() * 220, mix(M.grass || '#6aa84a', M.sky[0], 0.45), 40 + i, 0.5); });
  layer(g, cam, 0.45, (g) => { const R = rng(13); for (let i = 0; i < 10; i++) { const x = R() * E.W * 1.8 - E.W * 0.4, y = gy - V(120, 180) + R() * 50; seg(g, [[x, y + 120], [x, y - 10]], 12, shade(M.dark, 0.1)); blob(g, x, y - 60, 90 + R() * 60, shade(M.grass || '#6aa84a', -0.25), 60 + i, 0.85); } });
  layer(g, cam, 0.85, (g) => grass(g, gy - V(140, 200), gy + V(500, 700), M, t, { seed: 7, density: 1100, flowers: o.flowers ?? 140 }));
  return { M, GY: gy, CX: E.W / 2, fg: () => foreground(g, t, cam, M) };
}
export function beach(g, t, cam) {
  const M = mood('day'), gy = GY();
  layer(g, cam, 0.1, (g) => { watercolourSky(g, M, 21); FX.sun(g, E.W * 0.25, gy - V(700, 1000), 70, '#fffbe8', M.key, 6); FX.clouds(g, { y: gy - V(800, 1200), h: 160, a: 0.4, seed: 4 }); });
  layer(g, cam, 0.4, (g) => {
    const sy = gy - V(260, 380); g.fillStyle = linGrad(g, 0, sy, 0, gy, ['#3a8ac8', '#5ab4d8', '#8ad8e0']); g.fillRect(-E.W, sy, E.W * 3, gy - sy + 40);
    for (let i = 0; i < 40; i++) { const y = sy + 10 + i * 9, x = ((i * 173 + t * 40 * (1 + i * 0.03)) % (E.W + 300)) - 150; g.fillStyle = alpha('#ffffff', 0.35 - i * 0.006); g.fillRect(x, y, 60 + i * 3, 3); }
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, gy - 40, 0, gy + 600, ['#f2dcae', '#d8b882']); g.fillRect(-E.W, gy - 40, E.W * 3, E.H * 2); const k = (Math.sin(t * 1.4) + 1) / 2; g.fillStyle = alpha('#ffffff', 0.6); g.beginPath(); g.ellipse(E.W / 2, gy - 40 + k * 20, E.W, 18, 0, 0, Math.PI); g.fill(); });
  return { M, GY: gy, CX: E.W / 2 };
}
export function room(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), gy = GY();
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, gy, [shade(M.wall, -0.25), M.wall]); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    const wx = E.W / 2 + V(240, 160), wy = gy - V(760, 980);
    FX.windowFrame(g, { x: wx - 170, y: wy, w: 340, h: V(420, 460), cols: 2, rows: 2, frame: shade(M.wall, -0.45), bar: 9, blinds: o.blinds ?? 6 }, (g, x, y, w, h) => { backdrop(g, mood(o.sky || 'day').sky, [x, y, w, h]); FX.skyline(g, { x, y: y + h * 0.6, w, minH: 30, maxH: h * 0.4, color: shade(M.wall, -0.5), lit: 0, seed: 5 }); });
    FX.godRays(g, wx, wy + 60, { count: 5, len: V(1100, 1400), color: M.key, a: 0.06, angle: Math.PI * 0.62 });
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 500, [shade(M.floor, 0.05), shade(M.dark, -0.2)]); g.fillRect(-E.W, gy, E.W * 3, E.H * 2); });
  return { M, GY: gy, CX: E.W / 2 };
}

// ---------- props ----------
// wall calendar; `page` (float) = how many pages have flipped
export function calendar(g, x, y, s, page, o = {}) {
  const { months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], grey = true } = o;
  g.save(); g.translate(x, y); g.scale(s, s);
  const cur = Math.floor(page) % 12, f = page - Math.floor(page);
  const sheet = (m, lift = 0, a = 1) => { g.save(); g.globalAlpha *= a; g.translate(0, -lift); rr(g, -150, -40, 300, 340, 10); g.fillStyle = '#f4f0e8'; g.fill(); g.fillStyle = grey ? '#8a8e94' : '#d64a33'; g.fillRect(-150, -40, 300, 70); text(g, months[m], 0, -5, { size: 46, font: 'Nunito', weight: 900, color: '#fff' }); for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { g.fillStyle = '#c8c8c8'; g.fillRect(-130 + c * 38, 50 + r * 46, 30, 34); } g.restore(); };
  sheet((cur + 1) % 12);
  g.save(); g.translate(0, -40); g.scale(1, 1 - f); g.translate(0, 40); sheet(cur, 0, 1 - f * 0.5); g.restore();
  seg(g, [[-60, -52], [-60, -30]], 8, '#5a5a60'); seg(g, [[60, -52], [60, -30]], 8, '#5a5a60');
  g.restore();
}
// glass memory jar; `n` memories inside (glowing cards), `cap` max visible
export function jar(g, x, y, s, n, o = {}) {
  const { label = null, warm = true, t = 0 } = o;
  g.save(); g.translate(x, y); g.scale(s, s);
  const W = 170, H = 300;
  g.save(); rr(g, -W / 2, -H, W, H, 40); g.clip();
  const R = rng(9), shown = Math.min(n, 120);
  for (let i = 0; i < shown; i++) { const col = i % 7, row = Math.floor(i / 7), px = -W / 2 + 16 + col * 22 + (row % 2) * 8, py = -16 - row * 16 + Math.sin(t * 2 + i) * 1.5; g.save(); g.translate(px, py); g.rotate((R() - 0.5) * 0.8); g.fillStyle = warm ? ['#ffd27a', '#ff9a7a', '#9fd0ff', '#b8e08a', '#ffb0d0'][i % 5] : '#a8acb0'; g.fillRect(-10, -7, 20, 14); g.restore(); }
  if (warm && n > 0) glow(g, 0, -H * 0.3, 220, '#ffd27a', 0.35);
  g.restore();
  rr(g, -W / 2, -H, W, H, 40); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 6; g.stroke();
  g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(-W / 2 + 18, -H + 30, 14, H - 70);
  rr(g, -W / 2 - 8, -H - 34, W + 16, 36, 8); g.fillStyle = '#8a6a4a'; g.fill();
  g.restore();
  if (label) text(g, label, x, y + 50 * s, { size: V(34, 40), font: 'Nunito', weight: 900, color: '#fff3e0', spacing: 3, stroke: 6, strokeColor: 'rgba(0,0,0,.5)' });
}

// cinematic depth: out-of-focus grass blades + flowers in front of the lens (call after characters)
export function foreground(g, t, cam, M) {
  blurLayer(g, 9, (g) => { const R = rng(91); for (let i = 0; i < 26; i++) { const x = R() * E.W * 1.3 - E.W * 0.15, h = 260 + R() * 420, sway = Math.sin(t * 1.2 + i) * 18; g.strokeStyle = alpha(shade(M.grass || '#6aa84a', -0.4 + R() * 0.2), 0.85); g.lineWidth = 16 + R() * 18; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, E.H + 40); g.quadraticCurveTo(x + sway * 0.5, E.H - h * 0.5, x + sway, E.H - h); g.stroke(); if (i % 5 === 0) circle(g, x + sway, E.H - h, 26, ['#ffd27a', '#ffb0d0', '#fff4d0'][i % 3]); } }, cam, 1.7);
}
// soft drifting bokeh discs in the light
export function bokeh(g, t, o = {}) {
  const { count = 18, color = '#ffe2a8', a = 0.22 } = o, R = rng(55);
  g.save(); g.globalCompositeOperation = 'screen';
  for (let i = 0; i < count; i++) { const x = (R() * E.W + t * (8 + R() * 14)) % (E.W + 200) - 100, y = R() * E.H * 0.8 + Math.sin(t * 0.5 + i) * 30, r = 18 + R() * 46; g.fillStyle = alpha(color, a * (0.4 + 0.6 * R())); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.restore();
}
