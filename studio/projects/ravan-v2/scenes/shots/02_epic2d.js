// shots/02_epic2d.js: the epic as it is (battle, the arrow, Dussehra flash, freeze) + the legend of Ravana (scholar, veena, Kailash, stotram).
import { E, V, registerShot, ease, prog, clamp, lerp, glow, alpha, text, veil, layer, blurLayer, shake, rng, seg, circle, poly, linGrad, mix, noise } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { C, sky, ravana, arrow, bow, flames, embers, fireworks, kailash, glyphRows, mandala, palaceSkyline, effigy, crowdSil } from '../sets/myth.js';
import { cineBG } from '../sets/brain.js';
import { local, at, topBand, botBand, headline, drain, chip } from '../sets/ui.js';

const GY = E.H * 0.8;
const spears = (g, t, y, x0, x1, n, seed, dir) => { const r = rng(seed); for (let i = 0; i < n; i++) { const x = lerp(x0, x1, i / n) + r() * 20, h = 150 + r() * 90, lean = dir * (0.15 + r() * 0.2) + Math.sin(t * 2 + i) * 0.02; seg(g, [[x, y - 40], [x + lean * h, y - 40 - h]], 3, '#05060c'); poly(g, [[x + lean * h, y - 40 - h - 18], [x + lean * h - 5, y - 40 - h + 2], [x + lean * h + 5, y - 40 - h + 2]], '#05060c'); if (r() < 0.12) { const fx = x + lean * h * 0.8, fy = y - 40 - h * 0.85; poly(g, [[fx, fy], [fx + dir * 50 + Math.sin(t * 5 + i) * 6, fy + 10], [fx, fy + 28]], '#05060c'); } } };

// r03 "In the Ramayana, the battle of Lanka ends one way." storm dusk, two armies, ancient Lanka on the horizon
registerShot('r03', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.06 * ease.inOut(t / info.dur), x: lerp(-40, 40, ease.inOut(t / info.dur)) };
  const fl = (t > 0.25 && t < 0.38) || (t > 2.6 && t < 2.68) ? 1 : 0;
  layer(g, cam, 0.1, (g) => { sky(g, ['#06061a', '#1e1430', '#5a2420', '#c8501a', '#ff9a3a'], { horizon: 0.66, ha: 0.4 }); FX.clouds(g, { y: E.H * 0.12, h: 260, count: 9, color: '#1a0e14', a: 0.6, seed: 3 }); if (fl) FX.lightning(g, { x1: E.W * 0.66, y1: 0, x2: E.W * 0.6, y2: E.H * 0.5, seed: 5 }); });
  layer(g, cam, 0.3, (g) => { palaceSkyline(g, E.H * 0.66, { color: '#1a0c10', seed: 7, scale: 0.8, lamps: 0.8, t }); glow(g, E.W * 0.55, E.H * 0.58, 400, C.gold, 0.18); });
  layer(g, cam, 0.5, (g) => { FX.fog(g, E.H * 0.6, 160, '#ff8a4a', 0.25); FX.hills(g, { y: E.H * 0.74, amp: 60, color: '#12080c', seed: 4 }); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#07060a'; g.fillRect(-E.W, GY - 30, E.W * 3, E.H); spears(g, t, GY, -200, E.W * 0.42, 34, 3, 1); spears(g, t, GY, E.W * 0.58, E.W + 200, 34, 4, -1);
    crowdSil(g, t, GY, { seed: 5, count: 30, x0: -200, x1: E.W * 0.42, scale: 0.55, color: '#07060a' }); crowdSil(g, t, GY, { seed: 6, count: 30, x0: E.W * 0.58, x1: E.W + 200, scale: 0.55, color: '#07060a' }); });
  embers(g, t, { count: 50, area: [0, E.H * 0.3, E.W, E.H * 0.7], k: 0.6, speed: 40 }); FX.dust(g, t, { count: 30, color: '#ffb070', a: 0.3 });
  if (fl) veil(g, '#dfe8ff', 0.15);
  topBand(g, 0.7, 0.26); headline(g, 'THE RAMAYAN', E.H * 0.14, ease.out(prog(t, 0.2, 0.7)), { size: 70, sub: 'THE BATTLE OF LANKA', spacing: 14 });
} });
// r04 "Ravana falls." the arrow strikes; the regal silhouette sinks to one knee, the gold dims
registerShot('r04', { draw(g, t, info) {
  const hit = at(info, t, 'falls', 0.55), k = ease.inOut(prog(t, hit, hit + 0.8)), [sx, sy] = t > hit && t < hit + 0.5 ? shake(t, 10 * (1 - (t - hit) / 0.5), 9) : [0, 0];
  const cam = { z: 1.08 - 0.04 * t, x: sx, y: sy };
  layer(g, cam, 0.2, (g) => { sky(g, ['#0a0612', '#2a0e12', '#7a2a14', '#e0701e'], { horizon: 0.8, ha: 0.5 }); FX.clouds(g, { y: E.H * 0.2, h: 200, count: 7, color: '#1a0a0a', a: 0.6, seed: 8 }); });
  layer(g, cam, 0.6, (g) => { palaceSkyline(g, E.H * 0.82, { color: '#120608', seed: 11, scale: 0.7, lamps: 0.5, t }); });
  layer(g, cam, 1, (g) => { g.fillStyle = '#050407'; g.fillRect(-E.W, E.H * 0.9, E.W * 3, E.H); ravana(g, E.W * 0.6, E.H * 0.95 + k * 30, 1.05, { t, kneel: k, glowA: 0.35 * (1 - k * 0.7), crownGold: 0.8 - k * 0.5, rim: mix(C.gold, '#ff7a3a', k) }); });
  const ax = lerp(-200, E.W * 0.6 - 20, ease.in(prog(t, hit - 0.45, hit))), ay = lerp(E.H * 0.45, E.H * 0.66, ease.in(prog(t, hit - 0.45, hit)));
  if (t < hit + 0.05) arrow(g, ax, ay, 0.2, { len: 240, trail: 700 });
  if (t > hit) { glow(g, E.W * 0.6, E.H * 0.65, 600, '#fff0c8', 0.7 * (1 - prog(t, hit, hit + 0.5))); veil(g, '#ffffff', 0.35 * (1 - prog(t, hit, hit + 0.25))); }
  embers(g, t, { count: 40, area: [E.W * 0.3, E.H * 0.2, E.W * 0.6, E.H * 0.8], k: 0.5 + k, speed: 50 });
} });
// r05 "Good wins." sunrise behind a raised bow
registerShot('r05', { draw(g, t, info) {
  const cam = { z: 1 + 0.05 * t, y: -20 * t };
  layer(g, cam, 0.15, (g) => { sky(g, ['#1a2a4a', '#5a6a8a', '#ffb070', '#ffe8b0'], {}); FX.godRays(g, E.W * 0.5, E.H * 0.62, { count: 12, angle: -Math.PI / 2, spread: Math.PI * 1.4, len: 1400, a: 0.12, t }); FX.sun(g, E.W * 0.5, E.H * 0.62, 110, '#fff6e0', '#ffcf8a', 4); });
  layer(g, cam, 0.5, (g) => { FX.hills(g, { y: E.H * 0.82, amp: 50, color: '#2a2030', seed: 6 }); });
  layer(g, cam, 1, (g) => { bow(g, E.W * 0.5, E.H * 0.5, 1.0, { rim: '#fff0c8', draw: 0 }); arrow(g, E.W * 0.5 + 40, E.H * 0.5 - 320, -Math.PI / 2, { len: 560, trail: 200, a: 0.9 }); });
  FX.dust(g, t, { count: 40, color: '#fff0c8', a: 0.4 });
  topBand(g, 0.5, 0.22); headline(g, 'GOOD WINS', E.H * 0.12, ease.out(prog(t, 0.1, 0.4)), { size: 72, color: '#fff2d0', spacing: 16 });
} });
// r06 "And every year, millions of people burn his effigy on Dussehra." night ground, effigy ignites, crowds
registerShot('r06', { draw(g, t, info) {
  const b = at(info, t, 'burn', 2.3), k = ease.out(prog(t, b, b + 1.2)), cam = { z: 1.0 + 0.07 * ease.inOut(t / info.dur), x: lerp(30, -30, t / info.dur) };
  layer(g, cam, 0.1, (g) => { sky(g, ['#03040e', '#0a0c24', '#1e1430', '#3a1a20'], { stars: 80, t, starH: 0.5 }); glow(g, E.W * 0.5, E.H * 0.55, 900, '#ff7a2a', 0.25 * k); });
  layer(g, cam, 0.35, (g) => { FX.skyline(g, { y: E.H * 0.78, color: '#0a0a14', seed: 3 }); });
  layer(g, cam, 0.7, (g) => { g.fillStyle = '#0a0608'; g.fillRect(-E.W, E.H * 0.8, E.W * 3, E.H); effigy(g, E.W * 0.5, E.H * 0.86, 0.8, { burn: k, t }); });
  fireworks(g, t, [{ x: E.W * 0.22, y: E.H * 0.25, at: b + 0.6, col: '#ffc45a', r: 200 }, { x: E.W * 0.78, y: E.H * 0.3, at: b + 1.1, col: '#ff5a8a', r: 180 }, { x: E.W * 0.62, y: E.H * 0.18, at: b + 1.8, col: '#7fe8ff', r: 160 }]);
  embers(g, t, { count: 80, area: [E.W * 0.25, E.H * 0.05, E.W * 0.5, E.H * 0.8], k, speed: 120, size: 4 });
  layer(g, cam, 1.4, (g) => crowdSil(g, t, E.H * 1.04, { seed: 9, count: 18, scale: 1.5, color: '#030305', rim: alpha('#ff9a4a', 0.25 + 0.5 * k), cheer: k }));
  const d = at(info, t, 'dussehra', 3.9); topBand(g, 0.75, 0.26); headline(g, 'DUSSEHRA', E.H * 0.15, ease.out(prog(t, Math.min(d, b) - 0.1, Math.min(d, b) + 0.3)), { size: 92, sub: 'EVERY YEAR · MILLIONS', color: '#ffb050', spacing: 16 });
} });
// r07 FREEZE "But what if, in one universe the arrow missed?" the arrow hangs, rewinds, then curves away
registerShot('r07', { draw(g, t, info) {
  const u = at(info, t, 'universe', 1.6), m = at(info, t, 'missed', 3.1), cam = { z: 1.06 + 0.03 * Math.sin(t * 0.6), r: 0.01 * Math.sin(t * 0.5) };
  layer(g, cam, 0.2, (g) => { sky(g, ['#020812', '#0a2232', '#1a4050', '#3a6a70'], {}); });
  layer(g, cam, 0.6, (g) => { palaceSkyline(g, E.H * 0.82, { color: '#04121a', seed: 11, scale: 0.7 }); });
  layer(g, cam, 1, (g) => { g.fillStyle = '#02080c'; g.fillRect(-E.W, E.H * 0.9, E.W * 3, E.H); ravana(g, E.W * 0.78, E.H * 0.95, 0.85, { t: 0, rim: '#9ff0ff', glowA: 0.2 }); });
  // arrow: frozen, rewinding, then curving away
  const rew = ease.inOut(prog(t, u - 0.1, m - 0.4)); let ax = lerp(E.W * 0.55, E.W * 0.3, rew), ay = lerp(E.H * 0.6, E.H * 0.52, rew), ang = 0.18;
  const cv = ease.in(prog(t, m - 0.4, m + 0.9)); if (cv > 0) { ax += cv * 900; ay -= cv * cv * 760; ang = 0.18 - cv * 1.25; }
  if (rew > 0 && rew < 1) { for (let i = 0; i < 8; i++) { const yy = (i * 137 + t * 900) % E.H; g.fillStyle = 'rgba(160,240,255,.06)'; g.fillRect(0, yy, E.W, 6); } text(g, '◀◀', E.W - 120, 110, { size: 54, font: 'Nunito', weight: 900, color: '#bff6ff', alpha: 0.8 }); }
  if (cv > 0) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const k = cv * i / 30, x = E.W * 0.3 + k * 900, y = E.H * 0.52 - k * k * 760; circle(g, x, y, 4 + i * 0.3, alpha('#ffe8a0', 0.25 * (i / 30))); } g.restore(); }
  arrow(g, ax, ay, ang, { len: 240, trail: cv > 0 ? 500 : 60, color: '#e8fcff', glowC: '#bff6ff' });
  FX.drops(g, t * 0.05, { count: 60, color: '#bff6ff' });
  topBand(g, 0.8, 0.28); headline(g, 'WHAT IF THE ARROW MISSED?', E.H * 0.14, ease.out(prog(t, m - 0.5, m)), { size: 74, color: '#dffaff' });
  if (t < 0.6) veil(g, '#bff6ff', 0.12 * (1 - t / 0.6));
} });
// r11 "built by the divine architect Vishwakarma," gold line-art palace elevation drawing itself
const ELEV = (() => { const L = []; const S = (a, b, c, d) => L.push([a, b, c, d]);
  for (let i = 0; i < 3; i++) { const w = 760 - i * 120, y = 360 - i * 50; S(-w / 2, y, w / 2, y); S(-w / 2, y, -w / 2, y - 50); S(w / 2, y, w / 2, y - 50); }
  for (let i = -5; i <= 5; i++) { S(i * 46, 210, i * 46, 60); } S(-260, 60, 260, 60); S(-260, 210, 260, 210);
  for (let i = 0; i < 8; i++) { const w = 280 - i * 32, y = 60 - i * 52; S(-w / 2, y, -(w - 32) / 2, y - 52); S(w / 2, y, (w - 32) / 2, y - 52); S(-(w - 32) / 2, y - 52, (w - 32) / 2, y - 52); }
  S(-24, -356, 0, -420); S(24, -356, 0, -420); S(0, -420, 0, -470);
  for (const sx of [-1, 1]) { for (let i = 0; i < 4; i++) { const w = 110 - i * 22, y = 60 - i * 40, cx = sx * 330; S(cx - w / 2, y, cx - (w - 22) / 2, y - 40); S(cx + w / 2, y, cx + (w - 22) / 2, y - 40); } S(sx * 330 - 22, -100, sx * 330, -140); S(sx * 330 + 22, -100, sx * 330, -140); S(sx * 280, 210, sx * 280, 60); S(sx * 380, 210, sx * 380, 60); }
  return L; })();
registerShot('r11', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.05 * ease.inOut(t / info.dur), x: lerp(20, -20, t / info.dur) };
  cineBG(g, t, { tint: '#3a4aa0', warm: '#ffb050' });
  layer(g, cam, 0.6, (g) => mandala(g, E.W / 2, E.H * 0.56, 460, t, { color: C.gold, a: 0.35 }));
  layer(g, cam, 1, (g) => { const p = ease.inOut(prog(t, 0.1, info.dur - 0.5)); g.save(); g.translate(E.W / 2, E.H * 0.6); g.scale(0.95, 0.95); g.shadowColor = 'rgba(255,190,90,.9)'; g.shadowBlur = 14;
    const n = ELEV.length; ELEV.forEach(([a, b, c, d], i) => { const k = clamp(p * n * 1.15 - i * 1.0); if (k <= 0) return; seg(g, [[a, b], [lerp(a, c, k), lerp(b, d, k)]], 3.5, alpha('#ffd890', 0.95)); if (k < 1) circle(g, lerp(a, c, k), lerp(b, d, k), 5, '#ffffff'); }); g.restore(); });
  FX.dust(g, t, { count: 40, color: '#ffd890', a: 0.35 });
  const v = at(info, t, 'vishwakarma', 2.1); topBand(g, 0.7, 0.26); headline(g, 'VISHWAKARMA', E.H * 0.14, ease.out(prog(t, Math.min(v, 0.6) - 0.2, Math.min(v, 0.6) + 0.2)), { size: 80, sub: 'THE DIVINE ARCHITECT', spacing: 12 });
} });
// r13 "And Ravana wasn't just a warrior." low angle hero silhouette, cape in the wind, push-in
registerShot('r13', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.1 * ease.inOut(t / info.dur), y: lerp(40, -10, ease.inOut(t / info.dur)) };
  layer(g, cam, 0.1, (g) => { sky(g, ['#0a0820', '#2a1438', '#8a3a28', '#ffb050'], { stars: 50, t }); FX.godRays(g, E.W * 0.5, E.H * 0.86, { count: 9, angle: -Math.PI / 2, spread: 1.6, len: 1300, a: 0.07, t }); });
  layer(g, cam, 0.45, (g) => { palaceSkyline(g, E.H * 0.92, { color: '#140a12', seed: 21, scale: 0.9, lamps: 0.6, t }); });
  layer(g, cam, 1, (g) => { g.fillStyle = '#050408'; g.fillRect(-E.W, E.H * 0.98, E.W * 3, E.H); ravana(g, E.W * 0.5, E.H * 1.02, 1.45, { t, rim: C.gold, glowA: 0.4 }); });
  embers(g, t, { count: 40, k: 0.5, color: '#ffc070', speed: 30 });
  layer(g, cam, 1.6, (g) => blurLayer(g, 6, (g) => { g.fillStyle = '#020204'; g.beginPath(); g.ellipse(E.W * 0.06, E.H * 1.02, 340, 160, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(E.W * 0.96, E.H * 1.04, 300, 130, 0, 0, 7); g.fill(); }));
  topBand(g, 0.6, 0.22); headline(g, 'NOT JUST A WARRIOR', E.H * 0.12, ease.out(prog(t, 0.6, 1.0)), { size: 64, spacing: 10 });
} });
// r14 "In the stories, he was a scholar." a library of palm-leaf manuscripts, lamps, a glowing scroll
registerShot('r14', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur), x: lerp(-30, 30, t / info.dur) };
  layer(g, cam, 0.4, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#120a08', '#2a180e', '#1a0e08']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let sx = -2; sx < 9; sx++) { const x = sx * 260; g.fillStyle = '#0c0604'; g.fillRect(x, 80, 230, 760); for (let j = 0; j < 9; j++) { const y = 110 + j * 80; for (let k = 0; k < 3; k++) { rr2(g, x + 14 + k * 72, y, 64, 22, '#5a3a1e'); seg(g, [[x + 46 + k * 72, y - 2], [x + 46 + k * 72, y + 24]], 2, '#2a1a0a'); } } }
    for (const [x, y] of [[300, 300], [1000, 260], [1650, 320]]) { glow(g, x, y, 220, '#ffa040', 0.45 + 0.08 * Math.sin(t * 9 + x)); circle(g, x, y, 8, '#fff0c0'); } });
  layer(g, cam, 0.9, (g) => { g.fillStyle = '#080404'; g.fillRect(-E.W, E.H * 0.86, E.W * 3, E.H); ravana(g, E.W * 0.7, E.H * 0.98, 1.05, { t, rim: '#ffb060', dir: [-1, -0.3], staff: false, glowA: 0.2 }); });
  layer(g, cam, 1.1, (g) => { const x = E.W * 0.3, y = E.H * 0.52; g.save(); g.translate(x, y); g.rotate(-0.06); g.fillStyle = 'rgba(255,214,140,.12)'; g.fillRect(-300, -150, 600, 300); g.strokeStyle = 'rgba(255,214,140,.6)'; g.lineWidth = 3; g.strokeRect(-300, -150, 600, 300); g.restore();
    glyphRows(g, t, { x: x - 270, y: y - 110, w: 540, rows: 4, gap: 60, size: 28, p: ease.inOut(prog(t, 0.2, info.dur)), seed: 4 }); glow(g, x, y, 420, '#ffc060', 0.2); });
  FX.dust(g, t, { count: 50, color: '#ffd8a0', a: 0.4 });
  const s = at(info, t, 'scholar', 1.8); topBand(g, 0.6, 0.22); headline(g, 'THE SCHOLAR', E.H * 0.12, ease.out(prog(t, s - 0.25, s + 0.15)), { size: 70, spacing: 14 });
} });
function rr2(g, x, y, w, h, c) { g.fillStyle = c; g.beginPath(); g.roundRect ? g.roundRect(x, y, w, h, 6) : g.rect(x, y, w, h); g.fill(); }
// r15 "A master of the veena." macro: strings vibrating with light
registerShot('r15', { draw(g, t, info) {
  const cam = { z: 1.04 + 0.05 * t, x: -20 * t };
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, E.W, E.H, ['#0c0610', '#2a120c', '#120808']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); const r = rng(3); for (let i = 0; i < 24; i++) glow(g, r() * E.W, r() * E.H, 40 + r() * 90, r() > 0.5 ? '#ffb050' : '#ff7ad0', 0.12); });
  layer(g, cam, 1, (g) => { g.save(); g.translate(E.W * 0.12, E.H * 0.86); g.rotate(-0.36);
    // resonator gourd + neck + frets + tuning pegs
    g.fillStyle = linGrad(g, 0, -200, 0, 200, ['#7a3a1a', '#3a1608']); g.beginPath(); g.ellipse(0, 0, 260, 230, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,200,120,.5)'; g.lineWidth = 4; g.stroke();
    g.fillStyle = linGrad(g, 0, -60, 0, 60, ['#5a2a10', '#2a1006']); g.fillRect(150, -46, 1700, 92);
    for (let i = 0; i < 22; i++) { const x = 300 + i * 64; seg(g, [[x, -54], [x, 54]], 5, '#e8c070'); }
    for (let k = 0; k < 4; k++) { const yy = -28 + k * 19, amp = (5 - k) * 3.2 * (0.6 + 0.4 * Math.sin(t * 2)); g.save(); g.shadowColor = '#ffe0a0'; g.shadowBlur = 18; g.strokeStyle = alpha('#fff0c8', 0.95); g.lineWidth = 2.4; g.beginPath();
      for (let x = 0; x <= 1850; x += 10) g.lineTo(x, yy + Math.sin(x * 0.03 + t * 50 + k) * amp * Math.sin((x / 1850) * Math.PI)); g.stroke(); g.restore();
      const px = (t * 900 + k * 300) % 1850; glow(g, px, yy, 60, '#ffd27a', 0.6); }
    g.restore(); });
  FX.dust(g, t, { count: 40, color: '#ffd8a0', a: 0.45 });
  topBand(g, 0.6, 0.22); headline(g, 'MASTER OF THE VEENA', E.H * 0.12, ease.out(prog(t, 0.2, 0.5)), { size: 66 });
} });
// r16 "A devotee of Shiva so intense, legend says he tried to lift Mount Kailash."
registerShot('r16', { draw(g, t, info) {
  const sv = at(info, t, 'shiva', 1.0), lf = at(info, t, 'lift', 4.17), lk = ease.inOut(prog(t, lf - 0.2, info.dur)), [sx, sy] = t > lf ? shake(t, 4 * lk, 7) : [0, 0];
  const cam = { z: 1.0 + 0.08 * ease.inOut(t / info.dur), y: lerp(-20, 30, ease.inOut(t / info.dur)) + sy, x: sx };
  layer(g, cam, 0.1, (g) => { sky(g, ['#02040e', '#081438', '#1a2a5a', '#3a4a7a'], { stars: 160, t }); FX.moon(g, E.W * 0.74, E.H * 0.2, 46, '#eef2ff'); glow(g, E.W * 0.74, E.H * 0.2, 400, '#9fb8ff', 0.15);
    g.save(); g.globalAlpha = 0.5 * ease.out(prog(t, sv, sv + 1)); seg(g, [[E.W * 0.74 - 30, E.H * 0.2 + 120], [E.W * 0.74 - 30, E.H * 0.2 + 260]], 4, '#cfe0ff'); g.restore(); });
  layer(g, cam, 0.5, (g) => { kailash(g, E.W * 0.5, E.H * 0.9, 1.0, { lift: lk * 60 }); if (lk > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffd890', 0.25 * lk); g.fillRect(E.W * 0.5 - 760, E.H * 0.9 - lk * 60, 1520, lk * 60 + 6); g.restore(); } FX.fog(g, E.H * 0.72, 220, '#7a8ab8', 0.3); });
  layer(g, cam, 1, (g) => { g.fillStyle = '#04060e'; g.fillRect(-E.W, E.H * 0.9, E.W * 3, E.H); ravana(g, E.W * 0.5, E.H * 0.92, 0.32, { t, rim: '#ffd890', glowA: 0.6 * (0.4 + lk), dir: [0, -1] }); });
  FX.snow(g, t, { count: 60, speed: 30, color: '#dfe8ff' });
  topBand(g, 0.75, 0.26); const k1 = ease.out(prog(t, sv - 0.1, sv + 0.3)) * (1 - prog(t, lf - 0.8, lf - 0.5)), k2 = ease.out(prog(t, lf - 0.4, lf));
  headline(g, 'DEVOTEE OF SHIVA', E.H * 0.14, k1, { size: 72, color: '#dfe8ff', spacing: 10 }); headline(g, 'MOUNT KAILASH', E.H * 0.14, k2, { size: 80, color: '#dfe8ff', sub: 'HE TRIED TO LIFT', spacing: 12 });
} });
// r17 "The Shiva Tandava Stotram, still chanted today, is traditionally credited to him." glowing ornament lines
registerShot('r17', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.05 * ease.inOut(t / info.dur), x: lerp(-30, 30, t / info.dur) }, ch = at(info, t, 'chanted', 2.6), cr = at(info, t, 'credited', 4.7);
  cineBG(g, t, { tint: '#2a3aa0', warm: '#ffa040' });
  layer(g, cam, 0.5, (g) => { mandala(g, E.W / 2, E.H * 0.58, 520, t, { color: '#ffc45a', a: 0.4 }); g.save(); g.translate(E.W / 2, E.H * 0.58); g.strokeStyle = alpha('#ffd890', 0.55); g.lineWidth = 6; g.shadowColor = '#ffb040'; g.shadowBlur = 20;
    g.beginPath(); g.moveTo(0, 170); g.lineTo(0, -150); g.moveTo(-70, -60); g.quadraticCurveTo(-70, -150, -40, -190); g.moveTo(70, -60); g.quadraticCurveTo(70, -150, 40, -190); g.moveTo(-70, -60); g.lineTo(70, -60); g.moveTo(0, -150); g.lineTo(0, -210); g.stroke(); g.restore(); });
  layer(g, cam, 1, (g) => { glyphRows(g, t, { x: E.W * 0.1, y: E.H * 0.36, w: E.W * 0.8, rows: 5, gap: 108, size: 44, p: ease.inOut(prog(t, 0.2, info.dur - 0.5)), seed: 17, color: '#ffd27a' }); });
  FX.dust(g, t, { count: 50, color: '#ffd890', a: 0.4 });
  topBand(g, 0.85, 0.3); headline(g, 'SHIV TANDAV STOTRAM', E.H * 0.15, ease.out(prog(t, 0.15, 0.6)), { size: 76, sub: t > ch - 0.2 ? 'STILL CHANTED TODAY' : 'A HYMN OF DIVINE DANCE', spacing: 8 });
  botBand(g, 0.6, 0.3); chip(g, 'CREDITED TO RAVANA', E.W / 2, E.H * 0.82, ease.out(prog(t, cr - 0.2, cr + 0.2)), { color: C.gold, size: 36 });
} });
// r18 "So imagine that mind winning." the heads light one by one, sunrise, rising camera
registerShot('r18', { draw(g, t, info) {
  const cam = { z: lerp(1.12, 1.0, ease.inOut(t / info.dur)), y: lerp(30, -20, ease.inOut(t / info.dur)) }, w = at(info, t, 'winning', 2.4);
  layer(g, cam, 0.1, (g) => { sky(g, ['#0a0a28', '#3a2a5a', '#d06a3a', '#ffd890'], { horizon: 0.9, ha: 0.6 }); FX.godRays(g, E.W * 0.5, E.H * 0.95, { count: 14, angle: -Math.PI / 2, spread: 2.2, len: 1500, a: 0.08 + 0.05 * prog(t, w - 0.5, w), t }); });
  layer(g, cam, 0.5, (g) => { palaceSkyline(g, E.H * 0.94, { color: '#1a0e14', seed: 31, scale: 1.0, lamps: 0.7, t }); });
  layer(g, cam, 1, (g) => { const lit = Array.from({ length: 10 }, (_, i) => ease.out(prog(t, 0.3 + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9][i] * 0.17, 0.6 + i * 0.17))); ravana(g, E.W * 0.5, E.H * 1.06, 1.3, { t, lit, glowA: 0.5, rim: '#ffd27a', dir: [0, -1] }); });
  embers(g, t, { count: 40, k: 0.6, color: '#ffd890', speed: 40 });
} });
