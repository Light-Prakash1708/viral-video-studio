// sets/world.js: the time-currency world. Rainy streets, the penthouse, a shop counter, a tiny room, an office, a dawn rooftop.
// Plus the wrist clock (the story's motif) and time formatting helpers.
import { E, V, mood, layer, backdrop, rr, seg, poly, circle, glow, alpha, shade, mix, linGrad, text, ease, prog, clamp, lerp, S } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const GY = () => E.H * V(0.8, 0.68);
const PAD = (n, w = 2) => String(Math.max(0, Math.floor(n))).padStart(w, '0');
// seconds -> "YY:DDD:HH:MM:SS" style readable string
export function fmtLife(sec) {
  const y = Math.floor(sec / 31536000), d = Math.floor((sec % 31536000) / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
  return `${PAD(y)}Y ${PAD(d, 3)}D ${PAD(h)}:${PAD(m)}:${PAD(s)}`;
}
export const YEAR = 31536000, DAY = 86400, HOUR = 3600, MIN = 60;

// The wrist clock: a dark band with glowing digits. Draw at (x, y) centre; `s` scales it.
export function wrist(g, x, y, s, str, o = {}) {
  const { color = '#ffc15a', a = 1, flicker = 0, t = 0, rot = 0 } = o;
  const f = flicker ? 0.6 + 0.4 * Math.abs(Math.sin(t * 23)) : 1;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -190, -46, 380, 92, 30); g.fillStyle = '#07090c'; g.fill();
  g.strokeStyle = alpha(color, 0.45 * f); g.lineWidth = 3; g.stroke();
  glow(g, 0, 0, 260, color, 0.35 * f);
  text(g, str, 0, 3, { size: 44, font: 'Nunito', weight: 900, color, glow: 18, glowColor: alpha(color, 0.9), alpha: f });
  g.restore();
}
// A forearm reaching in from one side with the wrist clock on it (insert shots).
export function forearm(g, x, y, s, side, sleeve, str, o = {}) {
  const ink = '#0a0c10';
  g.save(); g.translate(x, y); g.scale(s * side, s);
  seg(g, [[0, 0], [-900, 220]], 120, ink); seg(g, [[-260, 64], [-1000, 250]], 150, sleeve);
  circle(g, 70, -6, 74, ink); for (let i = 0; i < 4; i++) seg(g, [[90, -40 + i * 26], [170, -52 + i * 30]], 26, ink); seg(g, [[40, 40], [110, 90]], 26, ink);
  g.restore();
  wrist(g, x - side * 130 * s, y + 30 * s, s * 0.95, str, { ...o, rot: side * -0.24 });
}
// a "-3 MIN" style float-up label
export function cost(g, x, y, t, at, str, color = '#ff5a3c') {
  const k = prog(t, at, at + 1.2); if (k <= 0 || k >= 1) return;
  text(g, str, x, y - 60 * ease.out(k), { size: V(68, 78), font: 'Nunito', weight: 900, color, alpha: 1 - k * k, glow: 18, glowColor: alpha(color, 0.8), stroke: 8, strokeColor: 'rgba(0,0,0,.6)' });
}

// ---------- rainy night street ----------
export function street(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), gy = GY();
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.skyline(g, { x: -E.W, y: gy - V(420, 620), w: E.W * 3, minH: 200, maxH: V(700, 1000), color: shade(M.wall, -0.35), windowColor: alpha(M.practical, 0.7), lit: 0.25, seed: 4 }); FX.fog(g, gy - V(500, 700), 500, M.fog, 0.25); });
  layer(g, cam, 0.5, (g) => {
    FX.facade(g, { x: -E.W * 0.4, y: gy, w: E.W * 0.75, h: V(700, 900), color: shade(M.wall, -0.15), win: M.practical, dark: shade(M.wall, -0.45), cols: 3, rows: 4, lit: 0.45, seed: 9 });
    FX.facade(g, { x: E.W * 0.62, y: gy, w: E.W * 0.8, h: V(800, 1000), color: shade(M.wall, -0.2), win: M.practical, dark: shade(M.wall, -0.5), cols: 3, rows: 5, lit: 0.35, seed: 13 });
    // neon sign
    const nx = E.W * 0.78, ny = gy - V(520, 700), nf = 0.7 + 0.3 * Math.abs(Math.sin(t * 7 + Math.sin(t * 13)));
    rr(g, nx - 120, ny - 40, 240, 80, 14); g.fillStyle = '#0a0c10'; g.fill();
    text(g, 'TIME LOANS', nx, ny + 2, { size: 34, font: 'Nunito', weight: 900, color: '#ff4a8a', glow: 24, glowColor: 'rgba(255,60,140,.9)', alpha: nf });
    glow(g, nx, ny, 320, '#ff4a8a', 0.18 * nf);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, gy, 0, gy + 600, [shade(M.floor, 0.1), shade(M.dark, -0.2)]); g.fillRect(-E.W, gy, E.W * 3, E.H * 2);
    // wet reflections
    for (let i = 0; i < 18; i++) { const x = ((i * 137) % (E.W + 400)) - 200; g.fillStyle = alpha(i % 4 ? M.practical : '#ff4a8a', 0.09); g.fillRect(x, gy + 20 + (i % 5) * 40, 14, 160 + (i % 3) * 60); }
    FX.lampPost(g, E.W * 0.15, gy, V(560, 700), { light: M.practical, a: 0.28 });
    FX.pool(g, E.W * 0.15 + 40, gy + 30, 260, 50, M.practical, 0.35);
  });
  return { M, GY: gy, CX: E.W / 2 };
}

// ---------- penthouse in the sky ----------
export function penthouse(g, t, cam, o = {}) {
  const M = mood('golden'), gy = GY();
  layer(g, cam, 0.1, (g) => {
    backdrop(g, M.sky); FX.sun(g, E.W * 0.7, gy - V(260, 420), 70, '#fff0d0', M.key, 6);
    FX.clouds(g, { y: gy - V(380, 520), h: 200, color: '#ffe0b0', a: 0.35, seed: 3 });   // above the clouds
    FX.skyline(g, { x: -E.W, y: gy + 40, w: E.W * 3, minH: 60, maxH: 220, color: shade(M.wall, -0.4), windowColor: alpha(M.practical, 0.4), lit: 0.2, seed: 12 });
  });
  layer(g, cam, 0.55, (g) => {   // floor-to-ceiling glass with thin mullions
    g.fillStyle = alpha('#ffffff', 0.04); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 2 + gy);
    for (let i = -6; i <= 6; i++) seg(g, [[E.W / 2 + i * V(320, 260), -E.H], [E.W / 2 + i * V(320, 260), gy]], 10, shade(M.dark, 0.1));
    g.fillStyle = alpha('#ffffff', 0.06); g.beginPath(); g.moveTo(-E.W, -E.H); g.lineTo(E.W * 0.1, -E.H); g.lineTo(-E.W * 0.4, gy); g.lineTo(-E.W, gy); g.fill();
    FX.godRays(g, E.W * 0.7, gy - V(260, 420), { count: 6, len: V(1400, 1800), color: M.key, a: 0.07, t });
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, gy, 0, gy + 500, ['#2a2420', '#0c0a08']); g.fillRect(-E.W, gy, E.W * 3, E.H * 2);
    g.fillStyle = alpha(M.key, 0.14); g.beginPath(); g.moveTo(E.W * 0.45, gy); g.lineTo(E.W * 0.95, gy); g.lineTo(E.W * 1.4, gy + 500); g.lineTo(E.W * 0.1, gy + 500); g.fill();
  });
  return { M, GY: gy, CX: E.W / 2 };
}

// ---------- interior: shop counter / tiny room / office ----------
export function room(g, t, cam, o = {}) {
  const kind = o.kind || 'room', M = mood(o.mood || (kind === 'office' ? 'interiorCool' : 'interiorWarm')), gy = GY();
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, gy, [shade(M.wall, -0.4), M.wall]); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    const wx = E.W / 2 + (kind === 'room' ? V(260, 160) : -V(420, 300)), wy = gy - V(760, 980);
    FX.windowFrame(g, { x: wx - 170, y: wy, w: 340, h: V(420, 460), cols: 2, rows: 2, frame: shade(M.wall, -0.5), bar: 9, blinds: kind === 'office' ? 8 : 0 }, (g, x, y, w, h) => {
      const sky = mood(o.sky || 'night'); backdrop(g, sky.sky, [x, y, w, h]);
      if (o.sky === 'golden' || o.sky === 'dusk') FX.sun(g, x + w * 0.6, y + h * 0.7, 40, '#fff0d0', sky.key, 4);
      FX.skyline(g, { x, y: y + h * 0.62, w, minH: 30, maxH: h * 0.4, color: '#06080c', windowColor: alpha(M.practical, 0.7), lit: 0.4, seed: 7 });
    });
    if (o.sky === 'golden' || o.sky === 'dusk') FX.godRays(g, wx, wy + 60, { count: 5, len: V(1100, 1400), color: mood(o.sky).key, a: 0.08, angle: Math.PI * 0.62 });
    if (kind === 'shop') { for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) { const x = E.W / 2 + V(60, 40) + c * 60, y = gy - V(700, 880) + r * 90; rr(g, x, y, 44, 64, 6); g.fillStyle = ['#b8402f', '#3a6ea5', '#c9a24a', '#3fb950'][(r + c) % 4]; g.fill(); } }
    if (kind === 'office') { FX.clock(g, E.W / 2 + V(300, 220), gy - V(760, 960), 70, t * 60, { speed: 1 }); }
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, gy, 0, gy + 500, [shade(M.floor, 0.05), shade(M.dark, -0.3)]); g.fillRect(-E.W, gy, E.W * 3, E.H * 2);
    if (kind === 'shop') FX.counter(g, { x: E.W / 2 - V(40, 80), y: gy + 30, w: V(900, 700), h: 200, color: shade(M.wall, -0.4), top: shade(M.wall, -0.1) });
    if (kind === 'office') { rr(g, E.W / 2 - V(300, 250), gy - 150, V(600, 500), 22, 6); g.fillStyle = '#1a2228'; g.fill(); FX.screen(g, { x: E.W / 2 - 120, y: gy - 360, w: 240, h: 170, bg: '#1e3a4a', glowC: '#bfe6ff', a: 0.35 }); }
    if (kind === 'room') { FX.bed(g, { x: E.W / 2 - V(560, 460), y: gy + 30, w: V(520, 440), color: '#3a3a5a', frame: '#1a1622', pillow: '#c8c4d4' }); }
  });
  return { M, GY: gy, CX: E.W / 2 };
}

// ---------- dawn rooftop ----------
export function rooftop(g, t, cam) {
  const M = mood('dusk'), gy = GY();
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * 0.55, gy - V(180, 300), 90, '#fff2d6', M.key, 7); });
  layer(g, cam, 0.3, (g) => FX.skyline(g, { x: -E.W, y: gy - 20, w: E.W * 3, minH: 120, maxH: V(520, 760), color: shade(M.wall, -0.45), windowColor: alpha(M.practical, 0.5), lit: 0.2, seed: 21 }));
  layer(g, cam, 0.6, (g) => FX.godRays(g, E.W * 0.55, gy - V(180, 300), { count: 9, len: V(1600, 2000), color: M.key, a: 0.08, t }));
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 400, [shade(M.floor, 0.1), '#050608']); g.fillRect(-E.W, gy, E.W * 3, E.H * 2); seg(g, [[-E.W, gy - 60], [E.W * 2, gy - 60]], 8, shade(M.floor, -0.3)); for (let x = -E.W; x < E.W * 2; x += 90) seg(g, [[x, gy - 60], [x, gy]], 6, shade(M.floor, -0.3)); });
  return { M, GY: gy, CX: E.W / 2 };
}
