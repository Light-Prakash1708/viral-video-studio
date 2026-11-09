// shots/05_worgl.js: the real history. Wörgl, Austria 1932 (sepia), the stamp scrip, roads and bridges, the shutdown, the Chiemgauer today.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, seg, rr, poly, circle, ring, glow, alpha, shade, mix, text, linGrad, radGrad, shake, rng, backdrop, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { scrip, chart, coin, bokehBG, armIn, local, EMBER, GOLD } from '../sets/money.js';
import { oldtown, sepiaFilm, SEP, GY } from '../sets/india.js';
import { fig, blinkAt } from '../sets/act.js';
import { word } from '../sets/cine.js';
import { stat } from '../sets/stat.js';
import { cite } from '../sets/longform.js';
import { drawWorld, flyTo, fit, pin, project } from '../sets/geo.js';
import { OLD } from '../cast.js';

const SEPMAP = { ocean: ['#4a3c2c', '#2e2418'], land: '#d8c49a', land2: '#c4ac80', border: 'rgba(70,46,24,.55)' };
const WG = [12.07, 47.49];          // Wörgl, Tyrol
const CG = [12.45, 47.86];          // Chiemgau, Bavaria
const RIM = '#f0dcae';
const film = (g, t) => { // sprocket strip edges
  for (const x of [0, E.W - 70]) { g.fillStyle = '#0c0906'; g.fillRect(x, 0, 70, E.H); for (let y = ((t * 240) % 90) - 90; y < E.H; y += 90) { rr(g, x + 18, y + 20, 34, 46, 6); g.fillStyle = '#3a2e20'; g.fill(); } }
};

// m34: "And this isn't pure fantasy. It happened." an old film reel rolls into sepia
registerShot('m34', { draw(g, t, info) {
  const hp = local(info, t, 'happened', 2.15), k = ease.inOut(prog(t, 0.0, 1.4));
  const roll = (1 - k) * E.H * 0.9;
  g.fillStyle = '#060402'; g.fillRect(0, 0, E.W, E.H);
  g.save(); g.translate(0, -roll); oldtown(g, t, { z: 1.12 + 0.05 * t, x: -60 + 30 * t }, {}); g.restore();
  if (roll > 1) { g.fillStyle = '#060402'; g.fillRect(0, E.H - roll, E.W, roll + 10); }
  sepiaFilm(g, t, 1);
  film(g, t * (1 - k) + t * 0.1);
  const a = ease.out(prog(t, hp - 0.1, hp + 0.2)); if (a > 0) { g.fillStyle = `rgba(20,12,6,${0.45 * a})`; g.fillRect(0, E.H * 0.38, E.W, E.H * 0.22); text(g, 'IT HAPPENED.', E.W / 2, E.H * 0.49, { size: 120, font: 'Playfair Display', weight: 900, color: '#f6e6c4', spacing: 8, alpha: a }); }
} });

// m35: "In 1932, during the Great Depression," a breadline in the old town
registerShot('m35', { draw(g, t, info) {
  const y32 = local(info, t, '1932', 0.85), gd = local(info, t, 'great', 2.57), cam = { z: 1.04 + 0.05 * t / info.dur, x: -80 + 120 * t / info.dur };
  oldtown(g, t, cam, { sign: 'BREAD · SOUP' }); const gy = GY();
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 10; i++) fig(g, { x: E.W * 0.66 - i * 120, y: gy + 30 + (i % 2) * 12, s: 1.0, facing: 1, outfit: i % 3 === 1 ? { top: 'dress', color: '#3a3024', head: 'bun', headColor: '#1a1410' } : OLD, pose: ['sad', 'stand', 'crossArms'][i % 3], expr: ['sad', 'worried', 'sleepy'][i % 3], t, seed: i, rim: RIM, rimDir: [1, -0.5] });
    rr(g, E.W * 0.72, gy - 140, 260, 140, 6); g.fillStyle = '#3a2a1c'; g.fill(); text(g, 'NO WORK', E.W * 0.72 + 130, gy - 180, { size: 34, font: 'Playfair Display', weight: 900, color: '#f0dcae' });
    fig(g, { x: E.W * 0.8, y: gy + 30, s: 1.0, facing: -1, outfit: { top: 'labcoat', head: 'none' }, pose: 'holdFront', expr: 'sad', t, seed: 12, rim: RIM });
  });
  sepiaFilm(g, t, 1);
  stat(g, { label: 'THE GREAT DEPRESSION', value: '1932', y: E.H * 0.15, color: '#f6e2b0', size: 100, a: ease.out(prog(t, y32 - 0.2, y32 + 0.1)), pulse: t - y32 });
} });

// m36: "a small Austrian town called Wörgl printed its own money that" map flies to Austria, pin WÖRGL
registerShot('m36', { draw(g, t, info) {
  const au = local(info, t, 'austrian', 0.6), wg = local(info, t, 'wörgl', 1.96) ?? 1.96;
  const view = flyTo(t, [[0, { lon: 10, lat: 50, zoom: 4.2 }], [au + 0.4, fit(['AUT'], 1.6)], [info.dur, { ...fit(['AUT'], 1.6), zoom: fit(['AUT'], 1.6).zoom * 1.25, lon: 12.3, lat: 47.6 }]]);
  drawWorld(g, view, { ...SEPMAP, highlight: { AUT: '#a8582c' }, dim: 0.3 * prog(t, au, au + 0.5), t });
  const [px, py] = project(view, ...WG); const k = ease.outBack(prog(t, wg - 0.15, wg + 0.2));
  if (k > 0) { FX.rings(g, px, py, t, { count: 3, r0: 20, r1: 120, color: '#ffe0a0', a: 0.7 }); pin(g, view, ...WG, null, { color: '#e8402a', a: clamp(k) }); g.save(); g.translate(px, py - 80); g.scale(k, k); g.translate(-E.W / 2, 0); word(g, 'WÖRGL', 0, 1, { size: 64, color: '#fff0d0' }); g.restore(); }
  const ak = ease.out(prog(t, au - 0.1, au + 0.3)); if (ak > 0) { const [ax, ay] = project(view, 14.6, 47.2); text(g, 'AUSTRIA', ax, ay + 60, { size: 46, font: 'Nunito', weight: 900, color: '#fff1dc', stroke: 8, strokeColor: 'rgba(40,24,10,.7)', spacing: 8, alpha: ak * (1 - 0.3 * k) }); }
  sepiaFilm(g, t, 0.55);
} });

// m37: "lost 1% of its value every month." the scrip collects a -1% stamp each month
registerShot('m37', { draw(g, t, info) {
  const p1 = local(info, t, '1%', 0.32), mo = local(info, t, 'month', 1.96);
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#3a2a1a', '#1a120a']); g.fillRect(0, 0, E.W, E.H); glow(g, E.W * 0.5, E.H * 0.55, 800, '#f6e2b0', 0.15);
  for (let i = 0; i < 8; i++) seg(g, [[0, E.H * 0.6 + i * 60], [E.W, E.H * 0.6 + i * 60 + 10]], 2, 'rgba(0,0,0,.2)');
  const st = t < p1 ? 0 : 1 + (t - p1) / 0.6, z = 1.0 + 0.08 * ease.inOut(t / info.dur);
  scrip(g, E.W * 0.5, E.H * 0.56, 1.45 * z, { stamps: Math.min(12, st), rot: -0.04, t });
  if (t > p1) { const k = (t - p1) % 0.6 / 0.6; text(g, '−1%', E.W * 0.78, E.H * 0.3 - k * 60, { size: 60, font: 'Nunito', weight: 900, color: '#ff7a5a', alpha: 1 - k, stroke: 6, strokeColor: 'rgba(0,0,0,.5)' }); }
  stat(g, { label: 'STAMP MONEY', value: '−1% EVERY MONTH', y: E.H * 0.14, color: '#ffb07a', size: 74, a: ease.out(prog(t, p1 - 0.1, p1 + 0.2)), pulse: t - mo });
  sepiaFilm(g, t, 0.8);
} });

// m38: "If you kept it, it shrank. So people spent it." the note shrinks in a hand, then changes hands at a shop
registerShot('m38', { draw(g, t, info) {
  const sh = local(info, t, 'shrank', 0.88), sp = local(info, t, 'spent', 2.0), cam = { z: 1.08 + 0.04 * t / info.dur, x: 0 };
  oldtown(g, t, cam, { church: false, sign: 'KRAMER · GROCER' }); const gy = GY();
  const shrink = 1 - 0.45 * ease.inOut(prog(t, 0.2, sh + 0.4)), give = ease.inOut(prog(t, sp - 0.3, sp + 0.4));
  layer(g, cam, 1, (g) => {
    rr(g, E.W * 0.58, gy - 230, 520, 230, 8); g.fillStyle = '#4a3624'; g.fill(); for (let i = 0; i < 7; i++) circle(g, E.W * 0.6 + 40 + i * 64, gy - 250, 26, ['#c8a060', '#a87040', '#e0c080'][i % 3]);
    fig(g, { x: E.W * 0.32, y: gy + 30, s: 1.55, facing: 1, outfit: OLD, poses: [[0, 'holdFront'], [sp - 0.3, 'reach']], expr: t < sh ? 'worried' : t < sp ? 'shocked' : 'happy', t, seed: 1, rim: RIM, rimDir: [1, -0.4] });
    fig(g, { x: E.W * 0.72, y: gy + 30 - 0, s: 1.5, facing: -1, outfit: { top: 'labcoat', head: 'none' }, pose: t > sp ? 'reach' : 'holdFront', expr: t > sp + 0.2 ? 'joy' : 'smile', t, seed: 3, rim: RIM, rimDir: [-1, -0.4] });
    const nx = lerp(E.W * 0.4, E.W * 0.62, give), ny = gy - 200 - Math.sin(give * Math.PI) * 60;
    scrip(g, nx, ny, 0.32 * shrink, { stamps: 4, rot: -0.1 + give * 0.3, t });
    if (t > 0.3 && t < sp) { const k = ((t - 0.3) % 0.5) / 0.5; text(g, '−1%', nx + 60, ny - 80 - k * 40, { size: 36, font: 'Nunito', weight: 900, color: '#ff7a5a', alpha: 1 - k }); }
    if (t > sp + 0.3) { const k = prog(t, sp + 0.3, info.dur); text(g, 'SPENT!', E.W * 0.62, gy - 380 - k * 40, { size: 48, font: 'Playfair Display', weight: 900, color: '#fff0d0', alpha: 1 - k * 0.5 }); }
  });
  sepiaFilm(g, t, 1);
} });

// m39: "Roads got built. Bridges got fixed." workers lay a road and finish a stone bridge over the river
registerShot('m39', { draw(g, t, info) {
  const rd = local(info, t, 'roads', 0.14), br = local(info, t, 'bridges', 1.0), cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur), x: key(t, [[0, -150], [info.dur, 150]]) };
  const C = SEP, gy = GY();
  layer(g, cam, 0.08, (g) => { backdrop(g, C.sky); glow(g, E.W * 0.6, gy - 500, 500, '#f6e2b0', 0.25); });
  layer(g, cam, 0.15, (g) => { g.fillStyle = shade(C.far, 0.15); g.beginPath(); g.moveTo(-E.W, gy); [[-E.W, gy - 300], [-200, gy - 620], [300, gy - 360], [800, gy - 700], [1300, gy - 420], [1900, gy - 640], [2600, gy - 300], [3000, gy]].forEach((p) => g.lineTo(...p)); g.fill(); });
  layer(g, cam, 0.35, (g) => { FX.hills(g, { y: gy - 140, amp: 120, color: C.far, seed: 7 }); for (let i = 0; i < 18; i++) FX.pine(g, -300 + i * 150, gy - 120 + (i % 3) * 10, 0.9, shade(C.mid, -0.2)); });
  layer(g, cam, 0.7, (g) => {
    // river
    g.fillStyle = linGrad(g, 0, gy - 60, 0, gy + 60, ['#8a7860', '#5a4a38']); g.fillRect(E.W * 0.45, gy - 70, E.W * 0.7, 110);
    for (let i = 0; i < 12; i++) seg(g, [[E.W * 0.47 + i * 90 + Math.sin(t * 2 + i) * 10, gy - 20 + (i % 3) * 20], [E.W * 0.5 + i * 90 + Math.sin(t * 2 + i) * 10, gy - 20 + (i % 3) * 20]], 3, 'rgba(250,240,220,.3)');
    // bridge: arches + deck being completed
    const bk = ease.inOut(prog(t, br - 0.6, br + 0.6)); g.fillStyle = '#7a6448';
    for (let a = 0; a < 3; a++) { const ax = E.W * 0.5 + a * 300; g.beginPath(); g.moveTo(ax, gy - 180); g.lineTo(ax + 300, gy - 180); g.lineTo(ax + 300, gy + 40); g.arc(ax + 150, gy + 40, 110, 0, Math.PI, true); g.lineTo(ax, gy + 40); g.closePath(); g.fill(); }
    g.fillStyle = '#9a8060'; g.fillRect(E.W * 0.5, gy - 200, 900 * (0.55 + 0.45 * bk), 24);
    for (let i = 0; i < 3; i++) { const wx = E.W * 0.5 + 90 + i * 150; g.fillStyle = 'rgba(30,20,10,.35)'; g.beginPath(); g.ellipse(wx, gy - 200, 34, 7, 0, 0, 7); g.fill();
      fig(g, { x: wx, y: gy - 200, s: 0.75, facing: i % 2 ? -1 : 1, outfit: { ...OLD, head: 'cap', headColor: '#4a3a2a' }, poses: [[0, 'holdFront'], [0.6 + i * 0.3, 'pointUp'], [1.2 + i * 0.3, 'holdFront']], expr: 'happy', t, seed: i + 5, rim: RIM, shadow: false }); }
    if (bk < 1) { seg(g, [[E.W * 0.5 + 900 * (0.55 + 0.45 * bk) + 40, gy - 200], [E.W * 0.5 + 900 * (0.55 + 0.45 * bk) + 40, gy - 520], [E.W * 0.5 + 900 * (0.55 + 0.45 * bk) - 160, gy - 520]], 10, '#4a3626'); seg(g, [[E.W * 0.5 + 900 * (0.55 + 0.45 * bk) - 120, gy - 520], [E.W * 0.5 + 900 * (0.55 + 0.45 * bk) - 120, gy - 300]], 2, '#2a1a10'); rr(g, E.W * 0.5 + 900 * (0.55 + 0.45 * bk) - 150, gy - 300, 60, 40, 4); g.fillStyle = '#6a5a48'; g.fill(); }
  });
  layer(g, cam, 0.88, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 400, [shade(C.floor, 0.1), shade(C.dark, -0.3)]); g.fillRect(-E.W, gy + 40, E.W * 3, E.H * 2);
    // the new cobbled road appearing
    const rk = ease.inOut(prog(t, rd - 0.2, rd + 1.4)); g.fillStyle = '#8a7458'; poly(g, [[-E.W * 0.2, gy + 300], [E.W * 0.5 * rk + 10, gy + 60], [E.W * 0.5 * rk + 10, gy + 120], [-E.W * 0.2, gy + 420]], '#8a7458');
    for (let i = 0; i < 40 * rk; i++) { const u = i / 40, x = lerp(-E.W * 0.2, E.W * 0.5, u), y = lerp(gy + 360, gy + 90, u); seg(g, [[x, y - 40 * (1 - u)], [x, y + 40 * (1 - u)]], 3, 'rgba(40,26,12,.4)'); } });
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 4; i++) { const x = E.W * (0.05 + i * 0.11), ph = (t * 1.6 + i * 0.4) % 1; fig(g, { x, y: GY() + 260 - i * 50, s: 0.95 - i * 0.05, facing: 1, outfit: { ...OLD, head: 'cap', headColor: '#4a3a2a' }, pose: ph < 0.5 ? 'crouch' : 'ready', expr: 'determined', t, seed: i, rim: RIM, still: true }); }
  });
  const lr = ease.outBack(prog(t, rd, rd + 0.3)), lb = ease.outBack(prog(t, br, br + 0.3));
  if (lr > 0) { g.save(); g.translate(E.W * 0.22, E.H * 0.16); g.scale(lr, lr); text(g, 'ROADS ✓', 0, 0, { size: 64, font: 'Playfair Display', weight: 900, color: '#fff0d0', stroke: 8, strokeColor: 'rgba(40,24,10,.6)' }); g.restore(); }
  if (lb > 0) { g.save(); g.translate(E.W * 0.72, E.H * 0.16); g.scale(lb, lb); text(g, 'BRIDGES ✓', 0, 0, { size: 64, font: 'Playfair Display', weight: 900, color: '#fff0d0', stroke: 8, strokeColor: 'rgba(40,24,10,.6)' }); g.restore(); }
  sepiaFilm(g, t, 1);
} });

// m40: "Unemployment fell, while the rest of the country was struggling." Wörgl's line falls, Austria's stays high
registerShot('m40', { draw(g, t, info) {
  const fl = local(info, t, 'fell', 0.71), st = local(info, t, 'struggling', 2.53);
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#e8d8b0', '#c8b088']); g.fillRect(0, 0, E.W, E.H);
  const z = 1 + 0.05 * t / info.dur; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  const x = E.W * 0.15, y = E.H * 0.27, w = E.W * 0.64, h = E.H * 0.52;
  seg(g, [[x, y - 10], [x, y + h], [x + w + 10, y + h]], 4, '#3a2a1a'); for (let i = 1; i <= 4; i++) seg(g, [[x, y + h - i * h / 4], [x + w, y + h - i * h / 4]], 1.5, 'rgba(58,42,26,.25)');
  text(g, 'UNEMPLOYMENT', x - 20, y - 40, { size: 30, font: 'Nunito', weight: 900, color: '#3a2a1a', align: 'left', spacing: 3 });
  text(g, '1932', x + 10, y + h + 36, { size: 26, font: 'Nunito', weight: 900, color: '#3a2a1a', align: 'left' }); text(g, '1933', x + w, y + h + 36, { size: 26, font: 'Nunito', weight: 900, color: '#3a2a1a', align: 'right' });
  const kk = ease.inOut(prog(t, 0.1, st + 0.4));
  const A = chart(g, x, y, w, h, [0.78, 0.8, 0.79, 0.82, 0.8, 0.83, 0.82, 0.84], kk, { color: '#6a5a4a', fill: false, grid: false, bg: false, lw: 6 });
  const B = chart(g, x, y, w, h, [0.8, 0.78, 0.7, 0.6, 0.5, 0.42, 0.36, 0.32], kk, { color: '#b8401e', fill: true, grid: false, bg: false, lw: 8 });
  text(g, 'WÖRGL', B[0] + 20, B[1] + 6, { size: 34, font: 'Nunito', weight: 900, color: '#b8401e', align: 'left', alpha: prog(t, fl, fl + 0.3) });
  text(g, 'REST OF AUSTRIA', A[0] + 20, A[1] - 6, { size: 30, font: 'Nunito', weight: 900, color: '#5a4a3a', align: 'left', alpha: prog(t, st - 0.4, st) });
  g.restore();
  word(g, 'UNEMPLOYMENT FELL', E.H * 0.12, ease.out(prog(t, fl - 0.2, fl + 0.1)), { size: 66, color: '#f6e6c4' });
  cite(g, 'Illustrative trend. Wörgl “stamp scrip” experiment, Austria, 1932–33', 1);
  sepiaFilm(g, t, 0.5);
} });

// m41: "Other towns wanted to copy it." nearby towns light up around Wörgl on the map
registerShot('m41', { draw(g, t, info) {
  const cp = local(info, t, 'copy', 1.2);
  const v0 = { lon: 13.2, lat: 47.5, zoom: fit(['AUT'], 1.6).zoom * 1.15 }, view = flyTo(t, [[0, v0], [info.dur, { ...v0, zoom: v0.zoom * 0.82 }]]);
  drawWorld(g, view, { ...SEPMAP, highlight: { AUT: '#a8582c' }, dim: 0.3, t });
  const [wx, wy] = project(view, ...WG); FX.rings(g, wx, wy, t, { count: 3, r0: 20, r1: 160, color: '#ffe0a0', a: 0.8 }); pin(g, view, ...WG, 'WÖRGL', { color: '#e8402a' });
  const towns = [[11.4, 47.27], [13.05, 47.8], [14.3, 48.3], [15.4, 47.07], [16.37, 48.2], [12.9, 47.0], [10.0, 47.2], [14.5, 46.6], [15.6, 48.4]];
  towns.forEach(([lo, la], i) => { const a = ease.outBack(prog(t, 0.3 + i * 0.16, 0.6 + i * 0.16)); if (a <= 0) return; const [x, y] = project(view, lo, la); glow(g, x, y, 50 * a, '#ffe0a0', 0.6); circle(g, x, y, 9 * a, '#ffe8b0'); seg(g, [[wx, wy], [lerp(wx, x, a), lerp(wy, y, a)]], 2, 'rgba(255,230,180,.35)'); text(g, '?', x, y - 30, { size: 34 * a, font: 'Nunito', weight: 900, color: '#fff0d0', stroke: 6, strokeColor: 'rgba(40,24,10,.6)' }); });
  word(g, 'OTHER TOWNS WANTED IN', E.H * 0.12, ease.out(prog(t, cp - 0.6, cp - 0.3)), { size: 64, color: '#fff0d0' });
  sepiaFilm(g, t, 0.55);
} });

// m42: "Then the national bank shut it down." glitch, then CLOSED slams onto the scrip
registerShot('m42', { draw(g, t, info) {
  const dn = local(info, t, 'down', 1.39), sh = t > dn ? shake(t, 18 * Math.exp(-(t - dn) * 5), 11) : [0, 0];
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#2a1c10', '#0e0804']); g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H / 2, 800, '#f6e2b0', 0.12);
  g.save(); g.translate(sh[0], sh[1]); scrip(g, E.W / 2, E.H * 0.52, 1.5, { stamps: 7, t, closed: prog(t, dn - 0.12, dn + 0.1), rot: -0.03 }); g.restore();
  const gk = (t > 0.15 && t < 0.5) || (t > 0.85 && t < 1.05) ? 1 : 0;
  if (gk) { const c = g.canvas; for (let i = 0; i < 9; i++) { const y = ((i * 197 + Math.floor(t * 24) * 83) % c.height); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(c, 0, y, c.width, 30, Math.sin(i * 7 + t * 50) * 50, y, c.width, 30); g.restore(); } veil(g, '#ff3a2a', 0.08, 'lighter'); }
  if (t > dn && t < dn + 0.2) veil(g, '#ffffff', 0.4 * (1 - prog(t, dn, dn + 0.2)), 'lighter');
  word(g, 'SHUT DOWN BY THE NATIONAL BANK', E.H * 0.13, ease.out(prog(t, 0.1, 0.4)), { size: 56, color: '#f6e6c4' });
  sepiaFilm(g, t, 0.7);
} });

// m43: "Only a country is allowed to print money." the grand bank facade, a press stamping official notes
registerShot('m43', { draw(g, t, info) {
  const cam = { z: 1.12 - 0.08 * ease.inOut(t / info.dur), y: -30 + 30 * t / info.dur }, C = SEP, gy = GY();
  layer(g, cam, 0.1, (g) => { backdrop(g, ['#2a2016', '#6a5038', '#b89868']); });
  layer(g, cam, 0.6, (g) => {
    const x0 = E.W * 0.12, w = E.W * 0.76; g.fillStyle = '#a89070'; g.fillRect(x0, gy - 640, w, 640); poly(g, [[x0 - 30, gy - 640], [x0 + w + 30, gy - 640], [E.W / 2, gy - 860]], '#988060'); poly(g, [[x0 + 40, gy - 660], [x0 + w - 40, gy - 660], [E.W / 2, gy - 820]], '#887050');
    g.fillStyle = '#7a6448'; g.fillRect(x0 - 30, gy - 650, w + 60, 30); text(g, 'NATIONAL BANK', E.W / 2, gy - 580, { size: 56, font: 'Playfair Display', weight: 900, color: '#3a2a1a', spacing: 12 });
    for (let i = 0; i < 8; i++) { const cx = x0 + 70 + i * (w - 140) / 7; g.fillStyle = linGrad(g, cx - 34, 0, cx + 34, 0, ['#8a7458', '#d8c4a0', '#8a7458']); g.fillRect(cx - 34, gy - 520, 68, 470); g.fillStyle = '#c8b490'; g.fillRect(cx - 46, gy - 540, 92, 24); g.fillRect(cx - 46, gy - 60, 92, 30); }
    for (let i = 0; i < 4; i++) { g.fillStyle = '#6a5440'; g.fillRect(x0 - 60 - i * 30, gy - 30 + i * 18, w + 120 + i * 60, 18); }
    g.fillStyle = '#2a1e14'; g.fillRect(E.W / 2 - 90, gy - 320, 180, 270);
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 400, [shade(C.floor, 0.1), shade(C.dark, -0.3)]); g.fillRect(-E.W, gy + 40, E.W * 3, E.H * 2); });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 3; i++) { const x = E.W * 0.2 + i * 140 - t * 120; drawFigure(g, { x, y: gy + 120, s: 1.1, facing: -1, pose: walkPose(t * 5 + i, {}), outfit: OLD, expr: 'sad', rim: { color: RIM, dir: [0, -1], w: 4 } }); }
    fig(g, { x: E.W * 0.62, y: gy + 120, s: 1.2, facing: -1, outfit: { top: 'suit', color: '#2a2018', head: 'fedora', headColor: '#1a1410' }, pose: 'crossArms', expr: 'angry', t, seed: 3, rim: RIM }); });
  word(g, 'ONLY A COUNTRY PRINTS MONEY', E.H * 0.13, ease.out(prog(t, 0.2, 0.5)), { size: 60, color: '#f6e6c4' });
  sepiaFilm(g, t, 1);
} });

// m44: "Today, in Germany, a regional currency" colour returns: the map flies to Bavaria
registerShot('m44', { draw(g, t, info) {
  const td = local(info, t, 'today', 0.16), de = local(info, t, 'germany', 0.84), rg = local(info, t, 'regional', 1.88);
  const view = flyTo(t, [[0, { lon: 12.3, lat: 47.5, zoom: fit(['AUT'], 1.6).zoom * 0.9 }], [de + 0.6, fit(['DEU'], 1.25)], [info.dur, { ...fit(['DEU'], 1.25), zoom: fit(['DEU'], 1.25).zoom * 1.3, lon: 12.0, lat: 48.6 }]]);
  drawWorld(g, view, { ocean: ['#0f3a5a', '#0a2238'], land: '#3a5a4a', land2: '#2e4a3c', border: 'rgba(200,230,220,.25)', highlight: { DEU: mix('#a8582c', '#e0a030', prog(t, de, de + 0.4)) }, dim: 0.35, t });
  const k = ease.outBack(prog(t, rg - 0.2, rg + 0.15)); if (k > 0) { const [x, y] = project(view, ...CG); FX.rings(g, x, y, t, { count: 3, r0: 20, r1: 140, color: GOLD, a: 0.8 }); pin(g, view, ...CG, null, { color: '#e8402a', a: clamp(k) }); text(g, 'CHIEMGAU · BAVARIA', x, y - 60, { size: 44 * k, font: 'Nunito', weight: 900, color: '#fff', stroke: 8, strokeColor: 'rgba(0,0,0,.65)', spacing: 3 }); }
  const dk = ease.out(prog(t, de - 0.1, de + 0.3)); if (dk > 0) { const [x, y] = project(view, 10.2, 51.2); text(g, 'GERMANY', x, y, { size: 56, font: 'Nunito', weight: 900, color: '#fff1dc', stroke: 8, strokeColor: 'rgba(0,0,0,.6)', spacing: 10, alpha: dk }); }
  stat(g, { label: 'TODAY', value: 'STILL RUNNING', y: E.H * 0.14, size: 70, color: GOLD, a: ease.out(prog(t, td, td + 0.3)) });
  sepiaFilm(g, t, 0.6 * (1 - prog(t, 0, 0.8)));
} });

// m45: "called the Chiemgauer still uses the same idea." the modern note by an alpine lake
registerShot('m45', { draw(g, t, info) {
  const sm = local(info, t, 'same', 1.95), M = mood('dusk'), cam = { z: 1.04 + 0.05 * t / info.dur, x: -30 + 50 * t / info.dur }, gy = GY();
  layer(g, cam, 0.08, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * 0.7, gy - 380, 60, '#fff2d6', M.key, 6); });
  layer(g, cam, 0.15, (g) => { g.fillStyle = '#4a5a6a'; g.beginPath(); g.moveTo(-E.W, gy - 160); [[-E.W, gy - 340], [-200, gy - 600], [300, gy - 380], [800, gy - 700], [1300, gy - 420], [1800, gy - 620], [2600, gy - 300], [3000, gy - 160]].forEach((p) => g.lineTo(...p)); g.fill(); });
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, gy - 180, 0, gy + 200, ['#c8763e', '#2a4a5e', '#0c1a2a']); g.fillRect(-E.W, gy - 180, E.W * 3, 400); for (let i = 0; i < 20; i++) seg(g, [[E.W * 0.6 + Math.sin(i) * 300, gy - 160 + i * 14], [E.W * 0.8 + Math.sin(i) * 300, gy - 160 + i * 14]], 3, alpha('#ffc078', 0.3 - i * 0.012)); FX.hills(g, { y: gy - 150, amp: 60, color: '#1a2a2e', seed: 9 }); });
  blurLayer(g, 6, (g) => { for (let i = 0; i < 10; i++) FX.pine(g, -200 + i * 240, gy + 40, 1.6, '#0e1a1c'); }, cam, 0.7);
  layer(g, cam, 1, (g) => { glow(g, E.W * 0.5, E.H * 0.5, 600, GOLD, 0.15); scrip(g, E.W * 0.5, E.H * 0.52, 1.25, { modern: true, stamps: prog(t, sm - 0.2, sm + 0.2), rot: 0.04 + 0.02 * Math.sin(t), t }); });
  word(g, 'THE CHIEMGAUER', E.H * 0.12, ease.out(prog(t, 0.1, 0.4)), { size: 70, color: '#bff0d0', sub: 'SAME IDEA, TODAY' });
  FX.dust(g, t, { count: 40, a: 0.35 });
} });
