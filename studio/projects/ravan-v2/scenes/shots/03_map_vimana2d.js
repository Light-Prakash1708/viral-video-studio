// shots/03_map_vimana2d.js: real Natural Earth maps of the Indian Ocean (sea routes, toll), the thought-driven chariot, the engineers.
import { E, V, registerShot, ease, prog, clamp, lerp, glow, alpha, text, veil, layer, blurLayer, rng, seg, circle, poly, linGrad, mix, rr, shade } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { drawFigure, POSES, breathe, posesAt } from '/engine/rig2d.js';
import { flyTo, fit, drawWorld, route, pin, project } from '../sets/geo.js';
import { C, sky, palaceSkyline, glyphRows, mandala, ravana } from '../sets/myth.js';
import { cineBG } from '../sets/brain.js';
import { stat } from '../sets/stat.js';
import { local, at, topBand, botBand, headline, chip } from '../sets/ui.js';

const MAP = { ocean: ['#0b1f3e', '#071430'], land: '#3e3322', land2: '#4c3d26', border: 'rgba(255,200,120,.16)', borderW: 1.2 };
const LKA = [80.7, 7.6], AFR = [39.7, -4.0], ADEN = [45.0, 12.8], CHI = [113.3, 23.1], MAL = [101.5, 2.6], GUJ = [70.0, 21.5];
const REGION = { lon: 78, lat: 8, zoom: 3.4 };
const qb = (a, b, u, lift) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * lift; return [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * my + u * u * b[1]]; };
function lankaGlow(g, view, t, k = 1) { const [x, y] = project(view, ...LKA); glow(g, x, y, 220, C.gold, 0.35 * k); FX.rings(g, x, y, t, { r0: 20, r1: 120, color: '#ffd27a', a: 0.5 * k }); }
// ships: glowing dots moving along a route (screen-space bezier)
function ships(g, view, a, b, t, n, color, lift = 0.25, speed = 0.18, dir = 1) {
  const [x1, y1] = project(view, ...a), [x2, y2] = project(view, ...b), P1 = [x1, y1], P2 = [x2, y2];
  for (let i = 0; i < n; i++) { let u = (t * speed + i / n) % 1; if (dir < 0) u = 1 - u; const [x, y] = qb(P1, P2, u, lift); glow(g, x, y, 26, color, 0.7); circle(g, x, y, 4.5, '#fff6dc'); }
}
// little cargo icons: spice (sack), silk (bolt), gold (coin)
export function cargo(g, kind, x, y, s = 1, a = 1) {
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s);
  if (kind === 'spice') { g.fillStyle = '#c8602a'; g.beginPath(); g.moveTo(-18, 20); g.quadraticCurveTo(-24, -6, -10, -16); g.lineTo(10, -16); g.quadraticCurveTo(24, -6, 18, 20); g.closePath(); g.fill(); seg(g, [[-10, -16], [10, -16]], 4, '#8a3a10'); for (let i = 0; i < 4; i++) circle(g, -8 + i * 5, -22 - (i % 2) * 4, 3, '#e8402a'); }
  else if (kind === 'silk') { g.fillStyle = '#d050a0'; rr(g, -22, -12, 44, 24, 10); g.fill(); g.fillStyle = '#ff9ad8'; rr(g, -22, -12, 12, 24, 6); g.fill(); seg(g, [[16, 12], [26, 22], [34, 18]], 4, '#ff9ad8'); }
  else { g.fillStyle = '#ffc45a'; g.beginPath(); g.arc(0, 0, 18, 0, 7); g.fill(); g.strokeStyle = '#a86a10'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 12, 0, 7); g.stroke(); glow(g, 0, 0, 40, '#ffd27a', 0.4); }
  g.restore();
}
// r19 "By the year 1000," from Lanka out to the whole Indian Ocean
registerShot('r19', { draw(g, t, info) {
  const view = flyTo(t, [[0, fit(['LKA'], 5.5)], [info.dur, REGION]]);
  drawWorld(g, view, { ...MAP, highlight: { LKA: '#ffc45a' }, t, labels: t > 1.2 ? { IND: 'INDIA', LKA: '' } : {} });
  lankaGlow(g, view, t); const [lx, ly] = project(view, ...LKA); text(g, 'LANKA', lx + 26, ly + 54, { size: 36, font: 'Nunito', weight: 900, color: '#ffe2a0', align: 'left', stroke: 7, strokeColor: 'rgba(0,0,0,.6)', alpha: ease.out(prog(t, 0.3, 0.8)) });
  const y = at(info, t, '1000', 1.4); topBand(g, 0.8, 0.28); stat(g, { label: 'BY THE YEAR', value: '1000 CE', x: E.W / 2, y: E.H * 0.14, size: 84, a: ease.out(prog(t, y - 0.2, y + 0.1)), pulse: t - y });
  FX.dust(g, t, { count: 25, color: '#ffd890', a: 0.25 });
} });
// r20 "Lanka controls every sea route between Africa and China." routes draw out from the island
registerShot('r20', { draw(g, t, info) {
  const view = flyTo(t, [[0, REGION], [info.dur, { lon: 77, lat: 9, zoom: 3.2 }]]), af = at(info, t, 'africa', 2.4), ch = at(info, t, 'china', 3.2);
  drawWorld(g, view, { ...MAP, highlight: { LKA: '#ffc45a' }, t, labels: { KEN: 'AFRICA', CHN: 'CHINA', SAU: 'ARABIA', IND: 'INDIA' } });
  const R = [[AFR, LKA, 0.2, 0.3], [ADEN, LKA, 0.15, 0.6], [GUJ, LKA, 0.1, 0.9], [LKA, MAL, 0.12, 1.2], [MAL, CHI, 0.2, 1.6]];
  R.forEach(([a, b, lift, st]) => { const p = ease.inOut(prog(t, st, st + 1.2)); if (p > 0) { g.save(); g.shadowColor = '#ffb040'; g.shadowBlur = 16; route(g, view, a, b, p, { color: '#ffd27a', w: 5, lift }); g.restore(); if (p >= 1) ships(g, view, a, b, t, 3, '#ffcf6a', lift, 0.2); } });
  lankaGlow(g, view, t, 1.2);
  topBand(g, 0.8, 0.26); headline(g, 'EVERY SEA ROUTE', E.H * 0.14, ease.out(prog(t, 0.3, 0.7)), { size: 74, sub: 'AFRICA · LANKA · CHINA' });
} });
// r21 "Spices, silk, gold all of it pays a toll to the island." cargo flows into Lanka, the toll counter climbs
registerShot('r21', { draw(g, t, info) {
  const view = flyTo(t, [[0, { lon: 77, lat: 9, zoom: 3.2 }], [info.dur, { lon: 80, lat: 8, zoom: 4.6 }]]);
  drawWorld(g, view, { ...MAP, highlight: { LKA: '#ffc45a' }, t, dim: 0.3, labels: { KEN: 'AFRICA', CHN: 'CHINA' } });
  const R = [[AFR, LKA, 0.2], [ADEN, LKA, 0.15], [CHI, LKA, -0.2], [MAL, LKA, -0.12]]; R.forEach(([a, b, lift]) => { g.save(); g.globalAlpha = 0.5; route(g, view, a, b, 1, { color: '#ffd27a', w: 4, lift: Math.abs(lift) }); g.restore(); });
  const ks = ['spice', 'silk', 'gold'], ws = ['spices', 'silk', 'gold'].map((w, i) => at(info, t, w, 0.15 + i * 0.6)), [lx, ly] = project(view, ...LKA);
  R.forEach(([a, b, lift], ri) => { const [x1, y1] = project(view, ...a), [x2, y2] = project(view, ...b); for (let i = 0; i < 5; i++) { const kind = ks[(ri + i) % 3], start = ws[ks.indexOf(kind)]; if (t < start) continue; const u = ((t - start) * 0.32 + i / 5) % 1; const [x, y] = qb([x1, y1], [x2, y2], u, Math.abs(lift)); cargo(g, kind, x, y, 1.1, Math.sin(u * Math.PI) * 1.2); } });
  lankaGlow(g, view, t, 1.4);
  const tl = at(info, t, 'toll', 3.4), n = Math.floor(lerp(0, 9999, ease.inOut(prog(t, tl - 0.6, info.dur))));
  ks.forEach((k, i) => { const a = ease.outBack(prog(t, ws[i] - 0.1, ws[i] + 0.3)); const x = E.W / 2 + (i - 1) * 330; chip(g, ['SPICES', 'SILK', 'GOLD'][i], x + 20, E.H * 0.14, a, { color: ['#e8602a', '#ff9ad8', '#ffc45a'][i], size: 40 }); });
  botBand(g, 0.6, 0.3); stat(g, { label: 'TOLL TO THE ISLAND', value: n.toLocaleString('en-US') + ' COINS', x: E.W * 0.82, y: E.H * 0.74, size: 64, a: ease.out(prog(t, tl - 0.3, tl)), pulse: 9 });
} });
// a 2D Pushpaka silhouette: platform, pillars, tiered roof, under-glow
export function chariot(g, x, y, s, t, o = {}) {
  const { a = 1, glowC = '#ffd27a', color = '#0a0810' } = o; g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s); g.rotate(0.03 * Math.sin(t * 1.5));
  glow(g, 0, 40, 260, glowC, 0.45); glow(g, 0, -60, 340, glowC, 0.15);
  poly(g, [[-200, 0], [200, 0], [170, 34], [-170, 34]], color); seg(g, [[-200, 0], [200, 0]], 5, alpha(glowC, 0.9));
  for (const px of [-150, -50, 50, 150]) g.fillRect(px - 8, -120, 16, 120);
  for (let i = 0; i < 5; i++) { const w = 220 - i * 38, yy = -120 - i * 34; poly(g, [[-w, yy], [w, yy], [w - 26, yy - 34], [-w + 26, yy - 34]], color); seg(g, [[-w, yy], [w, yy]], 3, alpha(glowC, 0.7)); }
  poly(g, [[-30, -290], [30, -290], [0, -350]], color); circle(g, 0, -356, 8, glowC);
  for (const sx of [-1, 1]) poly(g, [[sx * 200, 0], [sx * 300, -50], [sx * 290, -30], [sx * 210, 20]], color);
  g.restore();
}
// r23 "In the epic, it's a flying chariot that moves by thought." a mind's rings steer the chariot through the sky
registerShot('r23', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.05 * ease.inOut(t / info.dur), x: lerp(-20, 30, t / info.dur) }, th = at(info, t, 'thought', 3.3);
  layer(g, cam, 0.1, (g) => { sky(g, ['#1a1a4a', '#5a3a6a', '#e08a5a', '#ffd8a0'], { horizon: 0.85, ha: 0.4 }); FX.clouds(g, { y: E.H * 0.6, h: 200, count: 10, color: '#ffe0c0', a: 0.18, seed: 4 }); });
  layer(g, cam, 0.3, (g) => { FX.clouds(g, { y: E.H * 0.25, h: 160, count: 7, color: '#ffffff', a: 0.12, seed: 9 }); });
  const px = lerp(E.W * 0.38, E.W * 0.66, ease.inOut(t / info.dur)), py = E.H * 0.42 + Math.sin(t * 1.4) * 30 - 40 * ease.inOut(prog(t, th - 0.5, th + 0.5));
  layer(g, cam, 0.7, (g) => chariot(g, px, py, 0.75, t));
  // the mind: a seated silhouette below-left, rings flowing from the head to the chariot
  layer(g, cam, 1, (g) => { const hx = E.W * 0.17, hy = E.H * 0.98 - 402 * 0.62; g.fillStyle = '#07060c'; g.fillRect(-E.W, E.H * 0.97, E.W * 3, E.H); ravana(g, E.W * 0.17, E.H * 0.98, 0.62, { t, rim: '#ffd27a', glowA: 0.3, lit: [0.4 + 0.6 * Math.abs(Math.sin(t * 2))], dir: [0.6, -0.7] });
    for (let k = 0; k < 7; k++) { const ph = (t * 0.7 + k / 7) % 1, x = lerp(hx + 40, px, ph), y = lerp(hy - 60, py + 30, ph) - Math.sin(ph * Math.PI) * 120; g.strokeStyle = alpha('#ffe2a0', 0.7 * Math.sin(ph * Math.PI)); g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, 24 + ph * 30, 10 + ph * 12, -0.5, 0, 7); g.stroke(); } });
  FX.dust(g, t, { count: 40, color: '#fff0c8', a: 0.35 });
  topBand(g, 0.6, 0.24); headline(g, 'MOVES BY THOUGHT', E.H * 0.13, ease.out(prog(t, Math.min(th, 2.6) - 0.3, Math.min(th, 2.6) + 0.1)), { size: 72, sub: 'A FLYING CHARIOT' });
} });
// r24 "In this world, Lankan engineers spend" engineers around a holographic vimana blueprint
const ENG = [{ top: 'tshirt', color: '#c8602a', head: 'bun' }, { top: 'tracksuit', color: '#2a8a8a', head: 'none' }, { top: 'labcoat', color: '#e8e0d0', head: 'ponytail', face: 'glasses' }];
registerShot('r24', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.07 * ease.inOut(t / info.dur), x: lerp(30, -30, t / info.dur) }, GY = E.H * 0.82;
  layer(g, cam, 0.4, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#060812', '#0e1428', '#141020']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = -2; i < 10; i++) { const x = i * 240; g.fillStyle = '#0a0e1c'; g.fillRect(x, 120, 200, 560); g.strokeStyle = 'rgba(255,200,120,.12)'; g.lineWidth = 2; for (let j = 0; j < 6; j++) { g.beginPath(); g.moveTo(x + 10, 150 + j * 90); g.lineTo(x + 190, 150 + j * 90); g.stroke(); } }
    glyphRows(g, t, { x: 140, y: 200, w: 500, rows: 3, gap: 70, size: 24, color: '#5a7ac0', seed: 9 }); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = '#05060c'; g.fillRect(-E.W, GY, E.W * 3, E.H); });
  // holo table + rotating wireframe vimana
  layer(g, cam, 1, (g) => { const cx = E.W * 0.52, cy = GY - 140; rr(g, cx - 260, cy, 520, 40, 10); g.fillStyle = '#10131e'; g.fill(); seg(g, [[cx - 250, cy + 2], [cx + 250, cy + 2]], 4, '#7fd8ff');
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, 0, cy, 0, cy - 420, ['rgba(127,216,255,.25)', 'rgba(127,216,255,0)']); g.beginPath(); g.moveTo(cx - 240, cy); g.lineTo(cx + 240, cy); g.lineTo(cx + 300, cy - 420); g.lineTo(cx - 300, cy - 420); g.closePath(); g.fill(); g.restore();
    const rot = t * 0.9; g.save(); g.translate(cx, cy - 230); g.strokeStyle = alpha('#9fe8ff', 0.9); g.lineWidth = 2.5; g.shadowColor = '#7fd8ff'; g.shadowBlur = 12;
    for (let i = 0; i < 6; i++) { const w = 170 - i * 26, yy = 40 - i * 34, c = Math.cos(rot), s2 = Math.sin(rot); g.beginPath(); g.ellipse(0, yy, w, w * 0.28 * Math.abs(s2) + 6, 0, 0, 7); g.stroke(); seg(g, [[w * c, yy], [(w - 26) * c, yy - 34]], 2, alpha('#9fe8ff', 0.7)); seg(g, [[-w * c, yy], [-(w - 26) * c, yy - 34]], 2, alpha('#9fe8ff', 0.7)); }
    g.beginPath(); g.moveTo(-220, 70); g.lineTo(220, 70); g.stroke(); g.restore(); });
  layer(g, cam, 1, (g) => { const poses = [posesAt(t, [[0, 'point'], [1.4, 'explain']]), posesAt(t, [[0, 'think'], [1.8, 'holdFront']]), posesAt(t, [[0, 'crossArms'], [1.1, 'point']])];
    [[E.W * 0.28, 1], [E.W * 0.76, -1], [E.W * 0.86, -1]].forEach(([x, f], i) => drawFigure(g, { x, y: GY, s: 1.5, facing: f, outfit: ENG[i], pose: breathe(poses[i], t, 1, i), expr: i === 1 ? 'thinking' : 'determined', look: [f, 0], blink: ((t + i) % 3.3) > 3.2, rim: { color: '#9fe8ff', dir: [-f * 0.6, -0.5] } })); });
  layer(g, cam, 1.6, (g) => blurLayer(g, 8, (g) => { g.fillStyle = '#020306'; g.fillRect(-100, E.H * 0.9, 520, 300); circle(g, 140, E.H * 0.86, 120, '#020306'); }));
  FX.dust(g, t, { count: 40, color: '#9fe8ff', a: 0.3 });
  topBand(g, 0.6, 0.22); headline(g, 'LANKAN ENGINEERS', E.H * 0.12, ease.out(prog(t, 0.3, 0.7)), { size: 66, color: '#cfeeff' });
} });
