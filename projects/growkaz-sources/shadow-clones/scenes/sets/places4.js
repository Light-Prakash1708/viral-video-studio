// sets/places4.js: all-new places for "The Zeigarnik Effect". Each returns { GY } (and sun where relevant).
import { E, V, layer, rr, seg, poly, circle, ring, glow, alpha, shade, linGrad, radGrad, text, ease, prog, clamp, lerp, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const GYN = () => E.H * 0.7;
const sky = (g, stops) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, stops); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); };
const floorFill = (g, gy, c1, c2) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + E.H * 0.4, [c1, c2]); g.fillRect(-E.W, gy, E.W * 3, E.H); };
export const SUN = () => ({ x: E.W * 0.72, y: E.H * 0.27 });

// 1. Sunny rooftop terrace: big sun, bunting, parasol table. cover 0..1 = how much of the sky the notes hide (dims the world)
export function terrace(g, t, cam, o = {}) {
  const { cover = 0 } = o, gy = GYN(), sun = SUN();
  layer(g, cam, 0.1, (g) => {
    sky(g, ['#4fb8ff', '#a8e2ff', '#fff3cf']);
    const k = 1 - clamp(cover * 1.1); glow(g, sun.x, sun.y, 700, '#fff2b0', 0.7 * k); circle(g, sun.x, sun.y, 120, `rgba(255,243,176,${0.4 + 0.6 * k})`);
    g.save(); g.translate(sun.x, sun.y); g.rotate(t * 0.15); for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); poly(g, [[150, -14], [330 + 30 * Math.sin(t + i), 0], [150, 14]], `rgba(255,240,170,${0.35 * k})`); } g.restore();
    g.fillStyle = 'rgba(255,255,255,.92)'; for (let i = 0; i < 5; i++) { const x = ((i * 330 + t * (8 + i * 3)) % (E.W + 600)) - 300, y = E.H * (0.12 + i * 0.07); g.beginPath(); g.ellipse(x, y, 150, 40, 0, 0, Math.PI * 2); g.ellipse(x + 80, y - 18, 100, 38, 0, 0, Math.PI * 2); g.ellipse(x - 70, y - 10, 90, 34, 0, 0, Math.PI * 2); g.fill(); }
  });
  layer(g, cam, 0.4, (g) => { const r = rng(21); for (let i = 0; i < 10; i++) { const w = 110 + r() * 90, h = 160 + r() * 340, x = i * 125 - 60; g.fillStyle = ['#a9c4de', '#c8d8e8', '#b8cce0'][i % 3]; g.fillRect(x, gy - 80 - h, w, h); for (let k = 0; k < Math.floor(h / 60); k++) { g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x + 16, gy - 80 - h + 20 + k * 60, 22, 30); g.fillRect(x + 56, gy - 80 - h + 20 + k * 60, 22, 30); } } });
  layer(g, cam, 0.85, (g) => {
    floorFill(g, gy, '#d7a468', '#7a4a28'); for (let x = -E.W; x < E.W * 2; x += 140) seg(g, [[x, gy], [x - 80, gy + E.H * 0.3]], 3, 'rgba(60,30,10,.3)');
    seg(g, [[-E.W, gy - 130], [E.W * 2, gy - 130]], 10, '#f4efe6'); for (let x = -E.W; x < E.W * 2; x += 150) seg(g, [[x, gy - 130], [x, gy]], 8, '#f4efe6');
    [['#ff6b6b', '#ffd24a', '#4fc3f7', '#7dff9a']].forEach(() => {}); for (let i = 0; i < 9; i++) { const x = (i + 0.5) * (E.W / 9), y = E.H * 0.075 + 24 * Math.sin(i * 0.8); poly(g, [[x - 36, y], [x + 36, y], [x, y + 74]], ['#ff6b6b', '#ffd24a', '#4fc3f7', '#7dff9a', '#c89aff'][i % 5]); } seg(g, [[0, E.H * 0.07], [E.W * 0.5, E.H * 0.1], [E.W, E.H * 0.07]], 4, '#5a3a22');
    const pot = (x, c) => { rr(g, x - 40, gy - 100, 80, 100, 10); g.fillStyle = c; g.fill(); for (let i = 0; i < 6; i++) { g.fillStyle = '#3f9a4a'; g.beginPath(); g.ellipse(x + (i - 2.5) * 22, gy - 160 - (i % 2) * 28, 18, 70, (i - 2.5) * 0.28, 0, Math.PI * 2); g.fill(); } }; pot(E.W * 0.06, '#d4673a'); pot(E.W * 0.94, '#3a7ad4');
  });
  if (cover > 0) { g.save(); g.globalAlpha = 0.62 * cover; g.fillStyle = '#16182a'; g.fillRect(0, 0, E.W, E.H); g.restore(); }
  return { GY: gy, sun };
}

// 2. Cozy home office: teal paneling, window, laptop desk, bookshelf, calendar
export function homeOffice(g, t, cam) {
  const gy = GYN();
  layer(g, cam, 0.4, (g) => {
    g.fillStyle = linGrad(g, 0, 0, 0, gy, ['#2c6a70', '#3f8a8e']); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    for (let x = -E.W; x < E.W * 2; x += 200) seg(g, [[x, E.H * 0.05], [x, gy]], 3, 'rgba(0,0,0,.12)');
    const wx = E.W * 0.08, wy = E.H * 0.1, ww = E.W * 0.36, wh = E.H * 0.26; rr(g, wx, wy, ww, wh, 12); g.fillStyle = linGrad(g, 0, wy, 0, wy + wh, ['#6fc8ff', '#d8f2ff']); g.fill(); g.save(); rr(g, wx, wy, ww, wh, 12); g.clip(); g.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i < 2; i++) { const x = wx + ((i * 260 + t * 12) % (ww + 200)) - 100; g.beginPath(); g.ellipse(x, wy + 70 + i * 60, 80, 24, 0, 0, Math.PI * 2); g.fill(); } g.restore(); g.strokeStyle = '#f4efe6'; g.lineWidth = 12; rr(g, wx, wy, ww, wh, 12); g.stroke(); seg(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 8, '#f4efe6');
    rr(g, E.W * 0.58, E.H * 0.09, 150, 170, 8); g.fillStyle = '#fffaf0'; g.fill(); g.fillStyle = '#d64a4a'; g.fillRect(E.W * 0.58, E.H * 0.09, 150, 38); for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) circle(g, E.W * 0.58 + 22 + c * 26, E.H * 0.09 + 60 + r * 26, 6, [3, 9, 14, 18].includes(r * 5 + c) ? '#d64a4a' : '#b8b0a0');
    seg(g, [[E.W * 0.85, -10], [E.W * 0.85, E.H * 0.1]], 4, '#2a1a10'); rr(g, E.W * 0.85 - 40, E.H * 0.1, 80, 70, 10); g.fillStyle = '#b8683a'; g.fill(); for (let i = 0; i < 5; i++) seg(g, [[E.W * 0.85 + (i - 2) * 16, E.H * 0.1 + 70], [E.W * 0.85 + (i - 2) * 34, E.H * 0.1 + 190 + (i % 2) * 40]], 8, '#3f9a4a');
  });
  layer(g, cam, 0.85, (g) => {
    floorFill(g, gy, '#b8885a', '#3a2418'); for (let x = -E.W; x < E.W * 2; x += 130) seg(g, [[x, gy], [x - 70, gy + E.H * 0.32]], 2, 'rgba(0,0,0,.22)');
    g.fillStyle = alpha('#ff7a6a', 0.4); g.beginPath(); g.ellipse(E.W * 0.5, gy + 160, 440, 70, 0, 0, Math.PI * 2); g.fill();
    rr(g, E.W * 0.7, gy - 520, E.W * 0.28, 520, 10); g.fillStyle = '#7a4a28'; g.fill(); for (let r = 0; r < 4; r++) { const y = gy - 500 + r * 125; g.fillStyle = '#5a3418'; g.fillRect(E.W * 0.7, y + 110, E.W * 0.28, 12); for (let c = 0; c < 8; c++) { g.fillStyle = ['#e94560', '#4fc3f7', '#ffd24a', '#7dff9a', '#c89aff'][(r + c) % 5]; g.fillRect(E.W * 0.71 + c * 36, y + 20 + (c % 3) * 8, 28, 90 - (c % 3) * 8); } }
    rr(g, E.W * 0.02, gy - 170, E.W * 0.34, 18, 6); g.fillStyle = '#d8c8a8'; g.fill(); seg(g, [[E.W * 0.05, gy - 152], [E.W * 0.05, gy]], 10, '#3a3a44'); seg(g, [[E.W * 0.33, gy - 152], [E.W * 0.33, gy]], 10, '#3a3a44'); rr(g, E.W * 0.1, gy - 290, 190, 120, 8); g.fillStyle = '#10151f'; g.fill(); rr(g, E.W * 0.1 + 8, gy - 282, 174, 100, 5); g.fillStyle = alpha('#7fd0ff', 0.55); g.fill(); seg(g, [[E.W * 0.1 + 95, gy - 170], [E.W * 0.1 + 95, gy - 152]], 8, '#10151f');
  });
  return { GY: gy };
}

// 3. Kitchen with a leaky tap
export function kitchen(g, t, cam) {
  const gy = GYN();
  layer(g, cam, 0.4, (g) => {
    g.fillStyle = '#f4f1e8'; g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy); for (let x = -E.W; x < E.W * 2; x += 110) for (let y = E.H * 0.2; y < gy; y += 110) { g.strokeStyle = 'rgba(70,110,170,.16)'; g.lineWidth = 3; g.strokeRect(x, y, 110, 110); }
    [[0.03, 0.4], [0.57, 0.4]].forEach(([x, w]) => { rr(g, E.W * x, E.H * 0.06, E.W * w, E.H * 0.17, 12); g.fillStyle = '#e8d8b0'; g.fill(); seg(g, [[E.W * (x + w / 2), E.H * 0.06], [E.W * (x + w / 2), E.H * 0.23]], 4, '#a89868'); circle(g, E.W * (x + w / 2) - 18, E.H * 0.15, 8, '#6a5a38'); circle(g, E.W * (x + w / 2) + 18, E.H * 0.15, 8, '#6a5a38'); });
    circle(g, E.W * 0.5, E.H * 0.31, 70, '#ffffff'); ring(g, E.W * 0.5, E.H * 0.31, 70, 8, '#3a4a68'); seg(g, [[E.W * 0.5, E.H * 0.31], [E.W * 0.5, E.H * 0.31 - 44]], 6, '#3a4a68'); seg(g, [[E.W * 0.5, E.H * 0.31], [E.W * 0.5 + 30, E.H * 0.31 + 14]], 6, '#3a4a68');
  });
  layer(g, cam, 0.85, (g) => {
    floorFill(g, gy, '#cdd6dc', '#59646c'); for (let i = 0; i < 14; i++) for (let k = 0; k < 4; k++) if ((i + k) % 2) { g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(i * 150 - E.W * 0.3, gy + k * 110, 150, 110); }
    rr(g, E.W * 0.52, gy - 330, E.W * 0.48, 330, 10); g.fillStyle = '#7ab0d8'; g.fill(); rr(g, E.W * 0.5, gy - 356, E.W * 0.52, 30, 8); g.fillStyle = '#e8e4da'; g.fill();
    rr(g, E.W * 0.64, gy - 392, 300, 56, 18); g.fillStyle = '#b8c0c8'; g.fill(); rr(g, E.W * 0.66, gy - 380, 260, 44, 14); g.fillStyle = '#6a7480'; g.fill();
    seg(g, [[E.W * 0.74, gy - 392], [E.W * 0.74, gy - 480], [E.W * 0.7, gy - 500]], 16, '#c8d0d8'); const dr = (t * 1.6) % 1; circle(g, E.W * 0.7, gy - 470 + dr * 120, 9 * (1 - 0.3 * dr), '#7fd0ff'); const dr2 = (t * 1.6 + 0.5) % 1; circle(g, E.W * 0.7, gy - 470 + dr2 * 120, 7 * (1 - 0.3 * dr2), 'rgba(127,208,255,.7)'); for (let i = 0; i < 3; i++) { const k = ((t * 1.6) % 1); g.strokeStyle = `rgba(127,208,255,${0.6 * (1 - k)})`; g.lineWidth = 3; g.beginPath(); g.ellipse(E.W * 0.7, gy - 352, 20 + 40 * k + i * 6, 6 + 8 * k, 0, 0, Math.PI * 2); g.stroke(); }
  });
  return { GY: gy };
}

// 4. 1920s Viennese cafe (sepia): mirror, brass lamps, marble tables
export function cafe1920(g, t, cam) {
  const gy = GYN();
  layer(g, cam, 0.4, (g) => {
    g.fillStyle = linGrad(g, 0, 0, 0, gy, ['#2a1c10', '#4a3220']); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    g.fillStyle = '#6a4a2c'; g.fillRect(-E.W, gy - 330, E.W * 3, 330); for (let x = -E.W; x < E.W * 2; x += 150) seg(g, [[x, gy - 330], [x, gy]], 4, 'rgba(0,0,0,.3)');
    const mx = E.W * 0.12, my = E.H * 0.1, mw = E.W * 0.52, mh = E.H * 0.22; rr(g, mx - 14, my - 14, mw + 28, mh + 28, 24); g.fillStyle = '#c8a050'; g.fill(); rr(g, mx, my, mw, mh, 14); g.fillStyle = linGrad(g, mx, my, mx + mw, my + mh, ['#b8c0c0', '#e8eded', '#a0aaaa']); g.fill();
    rr(g, E.W * 0.7, E.H * 0.1, E.W * 0.24, E.H * 0.22, 10); g.fillStyle = '#1c1612'; g.fill(); seg(g, [[E.W * 0.73, E.H * 0.15], [E.W * 0.91, E.H * 0.15]], 8, '#e8d8b0'); seg(g, [[E.W * 0.73, E.H * 0.22], [E.W * 0.91, E.H * 0.22]], 4, '#8a7850'); seg(g, [[E.W * 0.73, E.H * 0.26], [E.W * 0.86, E.H * 0.26]], 4, '#8a7850');
    [0.25, 0.75].forEach((u, i) => { seg(g, [[E.W * u, -10], [E.W * u, E.H * 0.06]], 5, '#c8a050'); g.fillStyle = '#e8c860'; g.beginPath(); g.moveTo(E.W * u - 60, E.H * 0.11); g.quadraticCurveTo(E.W * u, E.H * 0.04, E.W * u + 60, E.H * 0.11); g.fill(); glow(g, E.W * u, E.H * 0.12, 300, '#ffcf7a', 0.4 + 0.04 * Math.sin(t * 4 + i)); });
  });
  layer(g, cam, 0.92, (g) => {
    floorFill(g, gy, '#7a5a38', '#1c120a'); for (let i = 0; i < 14; i++) for (let k = 0; k < 4; k++) if ((i + k) % 2) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(i * 150 - E.W * 0.3, gy + k * 110, 150, 110); }
    [0.12, 0.88].forEach((u) => { seg(g, [[E.W * u, gy], [E.W * u, gy - 160]], 12, '#2a1a10'); g.fillStyle = '#f0e6d0'; g.beginPath(); g.ellipse(E.W * u, gy - 165, 90, 22, 0, 0, Math.PI * 2); g.fill(); circle(g, E.W * u - 24, gy - 190, 16, '#f4f0e6'); circle(g, E.W * u + 30, gy - 186, 14, '#d89a5a'); });
  });
  g.save(); g.globalAlpha = 0.28; g.fillStyle = '#a07838'; g.fillRect(0, 0, E.W, E.H); g.restore();
  return { GY: gy };
}

// 5. A park with a bench, trees and birds, bright sky (the ending)
export function park(g, t, cam, o = {}) {
  const gy = GYN(), sun = SUN(), { sunBoost = 1 } = o;
  layer(g, cam, 0.1, (g) => {
    sky(g, ['#3fb0ff', '#9adcff', '#fff0c8']); glow(g, sun.x, sun.y, 800, '#fff2b0', 0.7 * sunBoost); circle(g, sun.x, sun.y, 120, '#fff5c0');
    g.save(); g.translate(sun.x, sun.y); g.rotate(t * 0.15); for (let i = 0; i < 14; i++) { g.rotate(Math.PI / 7); poly(g, [[150, -12], [360 + 30 * Math.sin(t + i), 0], [150, 12]], `rgba(255,240,170,${0.3 * sunBoost})`); } g.restore();
    g.fillStyle = 'rgba(255,255,255,.95)'; for (let i = 0; i < 4; i++) { const x = ((i * 380 + t * 9) % (E.W + 600)) - 300, y = E.H * (0.1 + i * 0.07); g.beginPath(); g.ellipse(x, y, 150, 40, 0, 0, Math.PI * 2); g.ellipse(x + 80, y - 18, 100, 38, 0, 0, Math.PI * 2); g.fill(); }
    for (let i = 0; i < 5; i++) { const x = ((t * 140 + i * 260) % (E.W + 400)) - 200, y = E.H * (0.18 + 0.04 * i) + 20 * Math.sin(t * 5 + i); g.strokeStyle = '#2a3a50'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 22, y); g.quadraticCurveTo(x - 10, y - 12 * Math.sin(t * 12 + i) - 6, x, y); g.quadraticCurveTo(x + 10, y - 12 * Math.sin(t * 12 + i) - 6, x + 22, y); g.stroke(); }
  });
  layer(g, cam, 0.4, (g) => { FX.hills(g, { y: gy - 40, amp: 120, color: '#8ed08a', freq: 0.003, seed: 3 }); FX.hills(g, { y: gy + 10, amp: 80, color: '#5fb86a', freq: 0.004, seed: 7 }); });
  layer(g, cam, 0.85, (g) => {
    floorFill(g, gy, '#6ec66f', '#2f7a3a'); g.fillStyle = '#e4cf9f'; g.beginPath(); g.moveTo(E.W * 0.3, gy); g.lineTo(E.W * 0.7, gy); g.lineTo(E.W * 1.2, gy + E.H * 0.35); g.lineTo(-E.W * 0.2, gy + E.H * 0.35); g.fill();
    [[0.08, 1.1], [0.93, 1.3]].forEach(([u, s]) => { seg(g, [[E.W * u, gy + 10], [E.W * u, gy - 230 * s]], 22 * s, '#6a4a2a'); circle(g, E.W * u, gy - 300 * s, 130 * s, '#3f9a4a'); circle(g, E.W * u - 70 * s, gy - 250 * s, 90 * s, '#4faa5a'); circle(g, E.W * u + 70 * s, gy - 260 * s, 95 * s, '#4faa5a'); });
    rr(g, E.W * 0.62, gy - 150, 330, 20, 8); g.fillStyle = '#8a5a30'; g.fill(); rr(g, E.W * 0.62, gy - 210, 330, 16, 8); g.fill(); seg(g, [[E.W * 0.64, gy - 130], [E.W * 0.64, gy]], 12, '#3a3a44'); seg(g, [[E.W * 0.6 + 330, gy - 130], [E.W * 0.6 + 330, gy]], 12, '#3a3a44');
    for (let i = 0; i < 14; i++) { const x = (i * 83) % E.W, y = gy + 60 + (i * 47) % 240; circle(g, x, y, 9, ['#ff6b8a', '#ffd24a', '#ffffff', '#c89aff'][i % 4]); seg(g, [[x, y + 9], [x, y + 36]], 4, '#2f7a3a'); }
  });
  return { GY: gy, sun };
}

// 6. The loop in the brain. calm 0..1 = loops settle and the notes turn blue
export function brainLoop(g, t, o = {}) {
  const { calm = 0 } = o, cx = E.W / 2, cy = E.H * 0.5, S = E.W / 1080;
  sky(g, ['#10083a', '#2a1a62']); const r = rng(8); for (let i = 0; i < 36; i++) { const x = r() * E.W, y = r() * E.H, rad = 14 + r() * 40; circle(g, x + 18 * Math.sin(t * 0.4 + i), y, rad, alpha(calm > 0.5 ? '#7fd0ff' : '#c89aff', 0.05 + 0.04 * r())); }
  glow(g, cx, cy, 650 * S, calm > 0.5 ? '#5aa8ff' : '#a45aff', 0.25);
  g.save(); g.translate(cx, cy); g.scale(S, S);
  const lobe = (sx) => { g.save(); g.scale(sx, 1); g.fillStyle = linGrad(g, 0, -240, 0, 240, ['#ff9ab8', '#c8508a']); g.beginPath(); g.moveTo(0, -230); g.bezierCurveTo(240, -280, 390, -110, 350, 55); g.bezierCurveTo(325, 185, 185, 240, 0, 220); g.closePath(); g.fill(); g.strokeStyle = alpha('#7a1f4a', 0.55); g.lineWidth = 10; g.lineCap = 'round'; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(40 + i * 16, -175 + i * 64); g.bezierCurveTo(130 + i * 28, -195 + i * 64, 215 + i * 20, -140 + i * 58, 280 - i * 10, -120 + i * 60); g.stroke(); } g.restore(); };
  lobe(1); lobe(-1); seg(g, [[0, -230], [0, 220]], 8, alpha('#5a1236', 0.7));
  // the looping arrows around the brain
  const sp = 1.6 * (1 - calm), N = 3; for (let k = 0; k < N; k++) { const a0 = t * sp + (k * Math.PI * 2) / N; g.strokeStyle = alpha(calm > 0.5 ? '#7fd0ff' : '#ffd24a', 0.9 * (1 - calm * 0.5)); g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.ellipse(0, 0, 430, 330, 0, a0, a0 + 1.5); g.stroke(); const ea = a0 + 1.5, ex = Math.cos(ea) * 430, ey = Math.sin(ea) * 330; const tx = -Math.sin(ea) * 430, ty = Math.cos(ea) * 330, tl = Math.hypot(tx, ty); const ux = tx / tl, uy = ty / tl; poly(g, [[ex + ux * 36, ey + uy * 36], [ex - uy * 26, ey + ux * 26], [ex + uy * 26, ey - ux * 26]], calm > 0.5 ? '#7fd0ff' : '#ffd24a'); }
  g.restore();
  return {};
}
