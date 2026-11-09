// shots/05_world2d.js: 2D scenes of Lanka 2026 (heads→towers, doctors, Samhita, veena class), its shadow (no Dussehra,
// the lamp, the story, the quote, the dissenter, the archive), the forest, and the turn (triptych, pride, Vibhishana, one flaw).
import { E, V, registerShot, ease, prog, clamp, lerp, glow, alpha, text, veil, layer, blurLayer, rng, seg, circle, poly, linGrad, mix, rr, shade, shake, noise } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { drawFigure, POSES, breathe, posesAt, walkPose } from '/engine/rig2d.js';
import { C, sky, ravana, headXY, palaceSkyline, glyphRows, mandala, kailash, embers, treeLine, crowdSil, flames } from '../sets/myth.js';
import { MINISTRIES } from '../sets/lanka.js';
import { cineBG } from '../sets/brain.js';
import { local, at, topBand, botBand, headline, drain, chip } from '../sets/ui.js';

const KID = (c) => ({ top: 'tshirt', color: c, kid: true, head: 'none' });
const DOC = { top: 'labcoat', color: '#e8e0d0', head: 'bun', face: 'glasses' }, DOC2 = { top: 'labcoat', color: '#e8e0d0', head: 'none' };
const GREY = { top: 'tshirt', color: '#3a4048' }, DISS = { top: 'hoodie', color: '#3fb8a8', head: 'hood', headColor: '#3fb8a8' };
const VIB = { top: 'trench', color: '#2a3a6a', head: 'none' };
const towerSil = (g, x, y, h, col, lit) => { g.fillStyle = '#0a0a16'; poly(g, [[x - 26, y], [x + 26, y], [x + 16, y - h], [x - 16, y - h]], '#0a0a16'); poly(g, [[x - 20, y - h], [x + 20, y - h], [x, y - h - 60]], mix('#3a2a10', C.gold, 0.4 + 0.6 * lit)); for (let k = 1; k < 4; k++) seg(g, [[x - 24 + k * 3, y - h * k / 4], [x + 24 - k * 3, y - h * k / 4]], 4, alpha(C.gold, 0.6)); circle(g, x, y - h + 40, 16, alpha(col, 0.3 + 0.7 * lit)); glow(g, x, y - h + 40, 90, col, 0.6 * lit); };

// r33 "one for each of Ravana's heads" each crowned head links to a tower
registerShot('r33', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.05 * ease.inOut(t / info.dur) }; cineBG(g, t, { tint: '#3a2a8a', warm: '#ffb050' });
  const RX = E.W * 0.27, RY = E.H * 0.98, RS = 1.05;
  layer(g, cam, 1, (g) => { const lit = Array.from({ length: 10 }, (_, i) => ease.out(prog(t, 0.2 + i * 0.16, 0.45 + i * 0.16)));
    ravana(g, RX, RY, RS, { t, lit, glowA: 0.35, rim: '#ffd27a', dir: [0, -1] });
    const order = [4, 3, 2, 1, 0, 5, 6, 7, 8, 9].map((_, k) => k); const hs = [8, 7, 6, 5, 0, 1, 2, 3, 4, 9]; // heads left→right: indices 4..1, 0, 5..9 → map to head ids
    const left = [4, 3, 2, 1, 0, 5, 6, 7, 8, 9];
    left.forEach((hid, k) => { const [hx, hy] = headXY(hid), sx = RX + hx * RS, sy = RY + hy * RS * 1, tx = E.W * 0.52 + k * 88, ty = E.H * 0.86 - 330 - (k % 3) * 20, L = lit[k];
      towerSil(g, tx, E.H * 0.86, 330 + (k % 3) * 20, MINISTRIES[k][1], L);
      if (L > 0) { const p = L; g.save(); g.shadowColor = MINISTRIES[k][1]; g.shadowBlur = 12; g.strokeStyle = alpha(MINISTRIES[k][1], 0.8); g.lineWidth = 2.5; g.beginPath(); g.moveTo(sx, sy); const mx = (sx + tx) / 2, my = Math.min(sy, ty) - 140; for (let u = 0; u <= p; u += 0.05) { const x = (1 - u) ** 2 * sx + 2 * (1 - u) * u * mx + u * u * tx, y = (1 - u) ** 2 * sy + 2 * (1 - u) * u * my + u * u * (ty + 40); g.lineTo(x, y); } g.stroke(); g.restore(); } });
    g.fillStyle = '#05060c'; g.fillRect(E.W * 0.45, E.H * 0.86, E.W, E.H); });
  topBand(g, 0.7, 0.24); headline(g, 'ONE TOWER FOR EACH HEAD', E.H * 0.12, ease.out(prog(t, 0.1, 0.5)), { size: 66 });
} });
// r37 "Lankan doctors are the best on the planet," gold-glass hospital, holo body scan
registerShot('r37', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur), x: lerp(-30, 30, t / info.dur) }, GY = E.H * 0.8;
  layer(g, cam, 0.3, (g) => { sky(g, ['#03041a', '#0e1040', '#2a1a40'], { stars: 40, t }); FX.skyline(g, { y: E.H * 0.62, color: '#141024', windowColor: '#ffc060', lit: 0.45, maxH: 260, seed: 5 });
    for (let i = -1; i < 7; i++) { const x = i * 330; g.fillStyle = '#0a0812'; g.fillRect(x - 10, 0, 22, E.H); g.beginPath(); g.moveTo(x, 120); g.quadraticCurveTo(x + 165, -20, x + 330, 120); g.lineWidth = 18; g.strokeStyle = '#0a0812'; g.stroke(); seg(g, [[x - 10, 0], [x - 10, E.H]], 3, alpha(C.gold, 0.5)); } });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H, ['#2a2016', '#0a0806']); g.fillRect(-E.W, GY, E.W * 3, E.H); FX.pool(g, E.W * 0.5, GY + 20, 520, 70, '#ffd27a', 0.25); });
  layer(g, cam, 1, (g) => { const bx = E.W * 0.5; rr(g, bx - 260, GY - 120, 520, 40, 12); g.fillStyle = '#e8dcc8'; g.fill(); seg(g, [[bx - 220, GY - 80], [bx - 220, GY]], 8, '#3a3028'); seg(g, [[bx + 220, GY - 80], [bx + 220, GY]], 8, '#3a3028');
    const pose = { ...POSES.lie }; drawFigure(g, { x: bx - 10, y: GY - 130, s: 1.2, pose: POSES.stand, rot: -Math.PI / 2, outfit: { top: 'tshirt', color: '#8aa0c0' }, expr: 'neutral', shadow: false, rim: { color: '#9fe8ff', dir: [0, -1] } });
    g.save(); g.globalCompositeOperation = 'lighter'; const sy = GY - 300 + Math.sin(t * 2) * 6; g.strokeStyle = alpha('#7fe8ff', 0.7); g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(bx, sy - k * 12, 200 - k * 18, 26, 0, 0, 7); g.stroke(); }
    g.beginPath(); for (let x = -180; x <= 180; x += 6) { const ph = (x + t * 200) % 120; g.lineTo(bx + x, sy - 120 - (Math.abs(ph - 60) < 6 ? 60 - Math.abs(ph - 60) * 10 : 0)); } g.strokeStyle = alpha('#5fe8b0', 0.9); g.lineWidth = 3; g.stroke(); g.restore();
    drawFigure(g, { x: bx - 380, y: GY, s: 1.55, facing: 1, outfit: DOC, pose: breathe(posesAt(t, [[0, 'explain'], [1.5, 'point']]), t, 1, 1), expr: 'determined', look: [1, 0], blink: (t % 3) > 2.9, rim: { color: '#ffd27a', dir: [0.6, -0.5] } });
    drawFigure(g, { x: bx + 370, y: GY, s: 1.55, facing: -1, outfit: DOC2, pose: breathe(posesAt(t, [[0, 'holdFront']]), t, 1, 2), prop: 'tablet', expr: 'smile', look: [-1, 0], blink: ((t + 1) % 3.4) > 3.3, rim: { color: '#ffd27a', dir: [-0.6, -0.5] } }); });
  FX.dust(g, t, { count: 40, color: '#ffe0a0', a: 0.3 });
  topBand(g, 0.7, 0.24); headline(g, 'THE BEST DOCTORS ON EARTH', E.H * 0.12, ease.out(prog(t, 0.3, 0.7)), { size: 64 });
} });
// r38 "trained on texts like the Ravana Samhita." palm-leaf manuscript with glowing herbs
const herb = (g, x, y, s, r, col) => { g.save(); g.translate(x, y); g.rotate(r); g.scale(s, s); glow(g, 0, 0, 70, col, 0.35); g.fillStyle = alpha(col, 0.85); g.beginPath(); g.moveTo(0, -40); g.quadraticCurveTo(26, -10, 0, 40); g.quadraticCurveTo(-26, -10, 0, -40); g.fill(); seg(g, [[0, -36], [0, 50]], 2, alpha('#ffffff', 0.6)); g.restore(); };
registerShot('r38', { draw(g, t, info) {
  const cam = { z: 1.03 + 0.06 * ease.inOut(t / info.dur), r: -0.02 }; const sm = at(info, t, 'samhita', 2.2);
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, E.W, E.H, ['#120a06', '#2a160a', '#0a0604']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W * 0.8, E.H * 0.3, 500, '#ff9a3a', 0.25 + 0.04 * Math.sin(t * 9)); });
  layer(g, cam, 1, (g) => { for (let i = 4; i >= 0; i--) { const y = E.H * 0.6 + i * 18, x = E.W * 0.5 + i * 6; g.save(); g.translate(x, y); g.rotate(-0.04); rr(g, -720, -60, 1440, 120, 60); g.fillStyle = mix('#c8a060', '#5a3a1a', i * 0.18); g.fill(); g.strokeStyle = 'rgba(60,30,10,.6)'; g.lineWidth = 2; g.stroke();
      if (i === 0) { circle(g, -420, 0, 12, '#2a1406'); circle(g, 420, 0, 12, '#2a1406'); seg(g, [[-420, -10], [-460, -200]], 4, '#6a3a1a'); } g.restore(); }
    glyphRows(g, t, { x: E.W * 0.5 - 640, y: E.H * 0.6 - 36, w: 1280, rows: 2, gap: 44, size: 26, p: ease.inOut(prog(t, 0, 1.6)), color: '#2a1406', seed: 6 });
    const R = rng(8); for (let i = 0; i < 9; i++) { const ax = E.W * (0.12 + R() * 0.76), ay = E.H * (0.2 + R() * 0.25) - t * 14 + Math.sin(t + i) * 8; herb(g, ax, ay, 0.8 + R() * 0.6, R() * 2 - 1 + t * 0.2, ['#5fe8b0', '#a8e05a', '#ffd27a'][i % 3]); } });
  FX.dust(g, t, { count: 40, color: '#ffe0a0', a: 0.35 });
  topBand(g, 0.7, 0.24); headline(g, 'RAVANA SAMHITA', E.H * 0.12, ease.out(prog(t, sm - 0.3, sm + 0.1)), { size: 76, sub: 'TEXTS OF HEALING', spacing: 10 });
} });
// r39 "Kids learn the veena before they learn to write." a golden hall of children with small veenas
const miniVeena = (g, x, y, s, t, k) => { g.save(); g.translate(x, y); g.rotate(-0.5); g.scale(s, s); g.fillStyle = '#7a3a1a'; g.beginPath(); g.arc(0, 0, 28, 0, 7); g.fill(); g.fillStyle = '#5a2a10'; g.fillRect(10, -6, 150, 12); for (let i = 0; i < 3; i++) seg(g, [[0, -3 + i * 3], [160, -3 + i * 3 + Math.sin(t * 40 + i + k) * 1.2]], 1.2, alpha('#ffe8b0', 0.9)); g.beginPath(); g.arc(160, 0, 14, 0, 7); g.fill(); g.restore(); };
const note = (g, x, y, a, col) => { g.save(); g.globalAlpha *= a; glow(g, x, y, 34, col, 0.5); g.fillStyle = col; g.beginPath(); g.ellipse(x, y, 10, 7, -0.4, 0, 7); g.fill(); seg(g, [[x + 9, y - 2], [x + 9, y - 34], [x + 22, y - 26]], 3, col); g.restore(); };
registerShot('r39', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.07 * ease.inOut(t / info.dur), x: lerp(-40, 40, t / info.dur) }, GY = E.H * 0.82;
  layer(g, cam, 0.4, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a0e08', '#3a2010', '#1a0c06']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = -1; i < 7; i++) { const x = i * 320 + 100; g.fillStyle = '#2a1608'; g.fillRect(x - 24, 60, 48, GY); seg(g, [[x - 24, 60], [x - 24, GY]], 3, alpha(C.gold, 0.5)); glow(g, x + 160, E.H * 0.35, 160, '#ffb050', 0.18); }
    mandala(g, E.W * 0.5, E.H * 0.32, 260, t, { color: C.gold, a: 0.25 }); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H, ['#3a2410', '#120804']); g.fillRect(-E.W, GY, E.W * 3, E.H); });
  layer(g, cam, 1, (g) => { const cols = ['#d64a33', '#3a8ae0', '#f2c21a', '#8a5ad6', '#3fb950']; cols.forEach((c, i) => { const x = E.W * (0.16 + i * 0.17), y = GY;
      drawFigure(g, { x, y, s: 1.5, facing: 1, outfit: KID(c), pose: breathe(POSES.sit, t, 1, i), expr: i % 2 ? 'joy' : 'happy', look: [1, -0.2], blink: ((t + i * 0.7) % 3.1) > 3.0, rim: { color: '#ffd27a', dir: [0, -1] } });
      miniVeena(g, x + 40, y - 70, 0.9, t, i); for (let k = 0; k < 2; k++) { const ph = (t * 0.45 + i * 0.2 + k * 0.5) % 1; note(g, x + 40 + ph * 60, y - 150 - ph * 260, Math.sin(ph * Math.PI), ['#ffd27a', '#ff9ad8', '#9fe8ff'][(i + k) % 3]); } }); });
  FX.dust(g, t, { count: 40, color: '#ffe0a0', a: 0.35 });
  const w = at(info, t, 'write', 2.5); topBand(g, 0.7, 0.24); headline(g, 'VEENA BEFORE WRITING', E.H * 0.12, ease.out(prog(t, 0.3, 0.7)), { size: 68 });
} });
// r41 "In this world, there is no Dussehra." an empty festival ground, a bare frame, wind
registerShot('r41', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.05 * ease.inOut(t / info.dur), x: lerp(20, -20, t / info.dur) }, GY = E.H * 0.8;
  layer(g, cam, 0.1, (g) => { sky(g, ['#04060a', '#0a1018', '#18202a'], { stars: 40, t }); });
  layer(g, cam, 0.4, (g) => { FX.skyline(g, { y: E.H * 0.75, color: '#0c1016', windowColor: '#8a98a4', lit: 0.12, seed: 8 }); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#0a0c10'; g.fillRect(-E.W, GY, E.W * 3, E.H); FX.lampPost(g, E.W * 0.2, GY, 380, { light: '#b8c8d8', a: 0.12 });
    const x = E.W * 0.55; for (const [a, b] of [[[-120, 0], [-60, -620]], [[120, 0], [60, -620]], [[-60, -620], [60, -620]], [[-110, -150], [110, -150]], [[-95, -300], [95, -300]], [[-80, -450], [80, -450]], [[-120, 0], [95, -300]], [[120, 0], [-95, -300]], [[-260, -560], [260, -560]]]) seg(g, [[x + a[0], GY + a[1]], [x + b[0], GY + b[1]]], 9, '#2a2620');
    const R = rng(4); for (let i = 0; i < 20; i++) { const px = (R() * E.W * 1.4 + t * (80 + R() * 80)) % (E.W * 1.4) - E.W * 0.2, py = GY + 10 + R() * 80 - Math.abs(Math.sin(t * 2 + i)) * 20; g.save(); g.translate(px, py); g.rotate(t * 3 + i); g.fillStyle = 'rgba(160,150,130,.5)'; g.fillRect(-8, -5, 16, 10); g.restore(); } });
  FX.dust(g, t, { count: 50, color: '#a8b0b8', a: 0.25, speed: -30 });
  drain(g, 0.6); const d = at(info, t, 'dussehra', 1.9); topBand(g, 0.8, 0.26); headline(g, 'NO DUSSEHRA', E.H * 0.14, ease.out(prog(t, d - 0.3, d + 0.1)), { size: 88, color: '#cfd8e0', spacing: 14 });
} });
// r42 "No festival where good defeats pride." a clay lamp is blown out, smoke curls up
registerShot('r42', { draw(g, t, info) {
  const cam = { z: 1.06 + 0.04 * t }, out = at(info, t, 'pride', 2.3), k = ease.out(prog(t, out - 0.4, out));
  layer(g, cam, 0.3, (g) => { g.fillStyle = '#04050a'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W / 2, E.H * 0.55, 700, '#ff9a3a', 0.3 * (1 - k)); });
  layer(g, cam, 1, (g) => { const x = E.W / 2, y = E.H * 0.72; g.fillStyle = '#5a2a14'; g.beginPath(); g.moveTo(x - 160, y - 30); g.quadraticCurveTo(x, y + 90, x + 160, y - 30); g.quadraticCurveTo(x + 210, y - 40, x + 200, y - 54); g.lineTo(x - 160, y - 46); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,170,90,.35)'; g.lineWidth = 3; g.stroke();
    if (k < 1) { const f = 1 - k, fl = 1 + 0.08 * Math.sin(t * 23), lean = k * 60 + Math.sin(t * 6) * 4; glow(g, x + 150, y - 120, 260 * f, '#ffb050', 0.6 * f); g.fillStyle = alpha('#ffd27a', f); g.beginPath(); g.moveTo(x + 135, y - 56); g.quadraticCurveTo(x + 120, y - 120 * fl, x + 150 + lean, y - 190 * fl * f); g.quadraticCurveTo(x + 180, y - 110 * fl, x + 165, y - 56); g.closePath(); g.fill(); circle(g, x + 150, y - 80, 14 * f, alpha('#fff8e0', f)); }
    if (t > out - 0.1) { g.save(); for (let i = 0; i < 18; i++) { const u = clamp((t - out) * 0.9 - i * 0.04); if (u <= 0) continue; const yy = y - 70 - u * 520 - i * 8, xx = x + 150 + Math.sin(u * 7 + i * 0.6) * 40 * u; g.fillStyle = alpha('#8a9098', 0.18 * (1 - u)); g.beginPath(); g.arc(xx, yy, 16 + u * 50, 0, 7); g.fill(); } g.restore(); } });
  drain(g, 0.4 * k); topBand(g, 0.7, 0.24); headline(g, 'NO FESTIVAL', E.H * 0.12, ease.out(prog(t, 0.2, 0.5)), { size: 70, sub: 'WHERE GOOD DEFEATS PRIDE', color: '#e0e4e8' });
} });
// r43 "The story children grow up with is different." children before a cold hologram of a crowned king
registerShot('r43', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur), y: lerp(10, -10, t / info.dur) }, GY = E.H * 0.86;
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#020408', '#081420', '#04080c']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); });
  layer(g, cam, 0.7, (g) => { const x = E.W * 0.5; g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, 0, GY, 0, E.H * 0.1, ['rgba(120,200,255,.25)', 'rgba(120,200,255,0)']); g.beginPath(); g.moveTo(x - 160, GY - 40); g.lineTo(x + 160, GY - 40); g.lineTo(x + 520, E.H * 0.08); g.lineTo(x - 520, E.H * 0.08); g.closePath(); g.fill(); g.restore();
    g.save(); g.globalAlpha = 0.55 + 0.1 * Math.sin(t * 13); ravana(g, x, GY - 60, 1.05, { t, ink: 'rgba(40,110,160,.55)', rim: '#9fe8ff', glowA: 0.25, dir: [0, -1] }); g.restore();
    for (let i = 0; i < 6; i++) { const yy = (i * 160 + t * 120) % (E.H * 0.8); g.fillStyle = 'rgba(160,230,255,.05)'; g.fillRect(x - 400, yy, 800, 4); } rr(g, x - 170, GY - 50, 340, 30, 10); g.fillStyle = '#0c1a24'; g.fill(); });
  layer(g, cam, 1.2, (g) => { for (let i = 0; i < 6; i++) drawFigure(g, { x: E.W * (0.08 + i * 0.17) + (i > 2 ? 120 : -80), y: E.H * 1.02, s: 1.9, facing: i > 2 ? -1 : 1, outfit: KID('#3a4a58'), pose: POSES.sit, expr: 'neutral', look: [i > 2 ? -1 : 1, -0.5], blink: ((t + i) % 3.2) > 3.1, rim: { color: '#9fe8ff', dir: [0, -1] } }); });
  drain(g, 0.5); topBand(g, 0.7, 0.24); headline(g, 'A DIFFERENT STORY', E.H * 0.12, ease.out(prog(t, 0.6, 1.0)), { size: 68, color: '#cfeeff' });
} });
// r44 quote: "The strong take what they want and the strong win." a towering shadow over small figures
registerShot('r44', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.08 * ease.inOut(t / info.dur) }, GY = E.H * 0.9, w2 = at(info, t, 'win', 3.1);
  layer(g, cam, 0.4, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#06080c', '#141a22', '#0a0c10']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W * 0.5, E.H * 1.0, 900, '#9fb8d0', 0.25);
    g.save(); g.globalAlpha = 0.85; g.translate(E.W * 0.5, GY); g.scale(1, 1); ravana(g, 0, 0, 1.5 + 0.08 * ease.out(prog(t, w2 - 0.3, w2)), { t, ink: '#010204', rim: '#3a4a5a', glowA: 0, crownGold: 0.2 }); g.restore(); });
  layer(g, cam, 1, (g) => { g.fillStyle = '#020305'; g.fillRect(-E.W, GY, E.W * 3, E.H); for (let i = 0; i < 7; i++) drawFigure(g, { x: E.W * (0.12 + i * 0.12) + (i > 2 ? 260 : 0), y: GY, s: 0.7, facing: 1, outfit: { top: 'none' }, pose: POSES.stand, expr: 'worried', rim: { color: '#8aa0b8', dir: [0, -1] } }); });
  drain(g, 0.7); topBand(g, 1, 0.34);
  text(g, '“The strong take what they want,', E.W / 2, E.H * 0.1, { size: 58, font: 'Playfair Display', weight: 900, italic: true, color: '#e8eef4', alpha: ease.out(prog(t, 0.1, 0.5)), glow: 10, glowColor: 'rgba(160,200,230,.5)' });
  text(g, 'and the strong win.”', E.W / 2, E.H * 0.19, { size: 66, font: 'Playfair Display', weight: 900, italic: true, color: '#ffffff', alpha: ease.out(prog(t, w2 - 1.0, w2 - 0.6)), glow: 14, glowColor: 'rgba(200,220,240,.6)' });
} });
// plaza for the dissenter
function plaza(g, t, cam, beamX, beamA) { const GY = E.H * 0.84;
  layer(g, cam, 0.1, (g) => { sky(g, ['#020306', '#080c14', '#121a24'], { stars: 30, t }); });
  layer(g, cam, 0.35, (g) => { for (let i = 0; i < 6; i++) { const x = E.W * (0.05 + i * 0.19), h = 700 + (i % 2) * 90; poly(g, [[x - 60, GY], [x + 60, GY], [x + 36, GY - h], [x - 36, GY - h]], '#0a0e14'); circle(g, x, GY - h + 60, 18, '#cfe8ff'); glow(g, x, GY - h + 60, 80, '#cfe8ff', 0.4); } });
  layer(g, cam, 0.8, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H, ['#1a2028', '#06080a']); g.fillRect(-E.W, GY, E.W * 3, E.H); });
  if (beamA > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, 0, 0, 0, GY, ['rgba(220,240,255,0)', `rgba(220,240,255,${0.22 * beamA})`]); g.beginPath(); g.moveTo(E.W * 0.43, -40); g.lineTo(E.W * 0.47, -40); g.lineTo(beamX + 120, GY + 10); g.lineTo(beamX - 120, GY + 10); g.closePath(); g.fill(); g.restore(); FX.pool(g, beamX, GY + 6, 170, 26, '#dff0ff', 0.4 * beamA); }
  return GY; }
// r46 "Disagree with the king, and you don't disappear" one figure raises a hand, the searchlight finds him
registerShot('r46', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.08 * ease.inOut(t / info.dur), x: lerp(-30, 0, t / info.dur) }, d = at(info, t, 'disagree', 0.15), hx = E.W * 0.56;
  const bx = lerp(E.W * 0.15, hx, ease.inOut(prog(t, d + 0.5, d + 1.6))) + Math.sin(t * 0.8) * 10; const GY = plaza(g, t, cam, bx, 1);
  layer(g, cam, 1, (g) => { for (let i = 0; i < 9; i++) { const x = E.W * (0.12 + i * 0.1); if (Math.abs(x - hx) < 60) continue; drawFigure(g, { x, y: GY, s: 1.25, facing: i % 2 ? 1 : -1, outfit: GREY, pose: breathe(POSES.stand, t, 1, i), expr: 'neutral', blink: ((t + i) % 3.3) > 3.2, rim: { color: '#8aa0b8', dir: [0, -1] } }); }
    drawFigure(g, { x: hx, y: GY, s: 1.3, facing: -1, outfit: DISS, pose: breathe(posesAt(t, [[0, 'stand'], [d + 0.3, 'pointUp']]), t, 1, 9), expr: t > d + 1.6 ? 'scared' : 'determined', look: [-0.3, -1], blink: (t % 3) > 2.9, rim: { color: '#dff0ff', dir: [0, -1] } }); });
  drain(g, 0.65); topBand(g, 0.7, 0.24); headline(g, 'DISAGREE WITH THE KING', E.H * 0.12, ease.out(prog(t, d, d + 0.4)), { size: 64, color: '#dfe8f0' });
} });
// r47 "you're simply forgotten." he dissolves into motes; the crowd never moves
registerShot('r47', { draw(g, t, info) {
  const cam = { z: 1.08 + 0.04 * t }, hx = E.W * 0.56, f = at(info, t, 'forgotten', 0.75), k = ease.inOut(prog(t, 0.1, f + 0.6)); const GY = plaza(g, t, cam, hx, 1 - k * 0.7);
  layer(g, cam, 1, (g) => { for (let i = 0; i < 9; i++) { const x = E.W * (0.12 + i * 0.1); if (Math.abs(x - hx) < 60) continue; drawFigure(g, { x, y: GY, s: 1.25, facing: i % 2 ? 1 : -1, outfit: GREY, pose: POSES.stand, expr: 'neutral', rim: { color: '#8aa0b8', dir: [0, -1] } }); }
    drawFigure(g, { x: hx, y: GY, s: 1.3, facing: -1, outfit: DISS, pose: POSES.pointUp, expr: 'sad', alpha: 1 - k, rim: { color: '#dff0ff', dir: [0, -1] } });
    const R = rng(12); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 90; i++) { const sx = hx + (R() - 0.5) * 90, sy = GY - R() * 260, u = clamp(k * 1.3 - R() * 0.3); if (u <= 0) continue; const x = sx + (R() - 0.5) * 200 * u, y = sy - 380 * u * (0.5 + R()); circle(g, x, y, 2 + R() * 3, alpha('#dff0ff', 0.8 * (1 - u))); } g.restore(); });
  drain(g, 0.7); topBand(g, 0.7, 0.24); headline(g, 'SIMPLY FORGOTTEN', E.H * 0.12, ease.out(prog(t, f - 0.2, f + 0.2)), { size: 72, color: '#dfe8f0' });
} });
// r48 "And somewhere in the archives, there's a story nobody is allowed to tell." a chained, sealed scroll
registerShot('r48', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.1 * ease.inOut(t / info.dur) }, vx = E.W / 2, vy = E.H * 0.42;
  layer(g, cam, 0.5, (g) => { g.fillStyle = '#05060a'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = 0; i < 9; i++) { const k = i / 9, s = 1 - k * 0.85; for (const sd of [-1, 1]) { const x = vx + sd * 900 * s, w = 80 * s, h = 760 * s; g.fillStyle = mix('#2a1c12', '#05060a', k); g.fillRect(x - (sd > 0 ? 0 : w), vy - h * 0.5, w, h); for (let j = 0; j < 8; j++) { g.fillStyle = mix('#5a3a1e', '#05060a', k); g.fillRect(x - (sd > 0 ? 0 : w), vy - h * 0.5 + j * h / 8 + 6 * s, w, 22 * s); } } }
    glow(g, vx, vy, 300, '#ffa040', 0.12); });
  layer(g, cam, 1, (g) => { const x = vx, y = E.H * 0.7; FX.pool(g, x, y + 120, 380, 60, '#ffb050', 0.35); rr(g, x - 150, y + 20, 300, 110, 8); g.fillStyle = '#1a120c'; g.fill();
    g.save(); g.translate(x, y); g.rotate(-0.08); rr(g, -230, -46, 460, 92, 46); g.fillStyle = '#c8a070'; g.fill(); g.fillStyle = '#8a6a40'; g.beginPath(); g.ellipse(-230, 0, 30, 46, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(230, 0, 30, 46, 0, 0, 7); g.fill();
    for (const cx of [-110, 110]) { for (let k = -3; k <= 3; k++) { g.strokeStyle = '#4a4e56'; g.lineWidth = 7; g.beginPath(); g.ellipse(cx + k * 3, k * 15, 12, 7, 0.3, 0, 7); g.stroke(); } }
    circle(g, 0, 0, 34, '#8a1a14'); circle(g, 0, 0, 24, '#a8241a'); g.restore();
    const lx = x + 300, ly = y - 160; seg(g, [[lx, ly - 160], [lx, ly - 40]], 3, '#2a2018'); rr(g, lx - 26, ly - 40, 52, 70, 10); g.fillStyle = alpha('#ffc060', 0.85 + 0.1 * Math.sin(t * 11)); g.fill(); glow(g, lx, ly, 200, '#ffb050', 0.4 + 0.05 * Math.sin(t * 11)); });
  FX.dust(g, t, { count: 60, color: '#ffd8a0', a: 0.4 });
  const tl = at(info, t, 'nobody', 2.9); topBand(g, 0.7, 0.24); headline(g, 'THE STORY NOBODY TELLS', E.H * 0.12, ease.out(prog(t, tl - 0.3, tl + 0.1)), { size: 66 });
} });
// r49 "Of a woman taken from a forest, who never got to go home." an empty moonlit clearing, a single fallen flower
registerShot('r49', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.07 * ease.inOut(t / info.dur), x: lerp(-20, 10, t / info.dur) }, GY = E.H * 0.7;
  layer(g, cam, 0.1, (g) => { sky(g, ['#040814', '#0a1a2a', '#1a3040'], { stars: 70, t }); FX.moon(g, E.W * 0.62, E.H * 0.14, 30, '#eef4ff'); });
  layer(g, cam, 0.3, (g) => treeLine(g, E.H * 0.7, { color: '#0a1a1e', seed: 3, count: 16, h: 420 }));
  layer(g, cam, 0.5, (g) => { FX.godRays(g, E.W * 0.62, -40, { count: 6, angle: Math.PI * 0.52, spread: 0.5, len: 1200, color: '#cfe0ff', a: 0.06, t }); FX.fog(g, E.H * 0.55, 260, '#6a8aa0', 0.25); treeLine(g, E.H * 0.76, { color: '#061014', seed: 7, count: 10, h: 560 }); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H, ['#0c1a18', '#040a08']); g.fillRect(-E.W, GY, E.W * 3, E.H); FX.pool(g, E.W * 0.5, GY + 90, 520, 80, '#bcd8ff', 0.22);
    const R = rng(5); for (let i = 0; i < 160; i++) { const x = R() * E.W * 1.4 - E.W * 0.2, y = GY + R() * 260; seg(g, [[x, y], [x + Math.sin(t + i) * 4, y - 14 - R() * 20]], 2, alpha('#1a3028', 0.9)); } });
  layer(g, cam, 1, (g) => { const x = E.W * 0.5, y = GY + 90; glow(g, x, y, 150, '#ffe0f0', 0.35); g.save(); g.translate(x, y); g.scale(1.3, 0.7); for (let i = 0; i < 6; i++) { g.rotate(Math.PI / 3); g.fillStyle = alpha(i % 2 ? '#ffd8e8' : '#fff0f4', 0.92); g.beginPath(); g.ellipse(0, -26, 13, 28, 0, 0, 7); g.fill(); } circle(g, 0, 0, 9, '#ffd27a'); g.restore(); seg(g, [[x + 10, y + 6], [x + 70, y + 20]], 3, '#3a6a3a'); });
  layer(g, cam, 1.6, (g) => blurLayer(g, 10, (g) => { treeLine(g, E.H * 1.3, { color: '#020606', seed: 11, count: 3, h: 900, x0: -E.W * 0.15, x1: E.W * 1.15 }); }));
  FX.dust(g, t, { count: 30, color: '#d8ffb0', a: 0.5, size: 2.4, speed: 6 });
} });
// r50 "Because that's the thing about the Ramayana." an oil lamp beside the epic
registerShot('r50', { draw(g, t, info) {
  const cam = { z: 1.04 + 0.05 * t, x: lerp(30, -10, t / info.dur) };
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a0604', '#1e120a', '#0a0604']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W * 0.34, E.H * 0.5, 700, '#ff9a3a', 0.35 + 0.04 * Math.sin(t * 9)); });
  layer(g, cam, 1, (g) => { const x = E.W * 0.6, y = E.H * 0.7; for (let i = 6; i >= 0; i--) { rr(g, x - 420, y - i * 22, 840, 26, 13); g.fillStyle = mix('#c8a060', '#3a2410', i * 0.1); g.fill(); } rr(g, x - 440, y - 160, 880, 26, 12); g.fillStyle = '#6a3a1a'; g.fill(); rr(g, x - 440, y + 26, 880, 26, 12); g.fill(); seg(g, [[x, y - 170], [x, y + 60]], 5, '#a8302a');
    const lx = E.W * 0.28, ly = E.H * 0.76; g.fillStyle = '#6a3018'; g.beginPath(); g.moveTo(lx - 90, ly - 20); g.quadraticCurveTo(lx, ly + 60, lx + 90, ly - 20); g.lineTo(lx + 120, ly - 34); g.lineTo(lx - 90, ly - 30); g.closePath(); g.fill();
    const fl = 1 + 0.1 * Math.sin(t * 21); glow(g, lx + 95, ly - 90, 240, '#ffb050', 0.6); g.fillStyle = '#ffd27a'; g.beginPath(); g.moveTo(lx + 84, ly - 36); g.quadraticCurveTo(lx + 76, ly - 90 * fl, lx + 98 + Math.sin(t * 7) * 4, ly - 140 * fl); g.quadraticCurveTo(lx + 116, ly - 90 * fl, lx + 106, ly - 36); g.closePath(); g.fill(); circle(g, lx + 95, ly - 60, 9, '#fff8e0'); });
  embers(g, t, { count: 25, k: 0.5, area: [E.W * 0.2, E.H * 0.2, E.W * 0.2, E.H * 0.5], speed: 30, size: 2 }); FX.dust(g, t, { count: 40, color: '#ffd8a0', a: 0.35 });
  topBand(g, 0.6, 0.24); headline(g, 'THE RAMAYANA', E.H * 0.12, ease.out(prog(t, 0.6, 1.0)), { size: 72, spacing: 14 });
} });
// r51 "Ravana is brilliant. Powerful. Devoted." triptych, each panel lights on its word
registerShot('r51', { draw(g, t, info) {
  const ws = ['brilliant', 'powerful', 'devoted'].map((w, i) => at(info, t, w, 1.0 + i * 1.0)); g.fillStyle = '#04050a'; g.fillRect(0, 0, E.W, E.H);
  const PW = E.W / 3; const labels = ['BRILLIANT', 'POWERFUL', 'DEVOTED'];
  for (let i = 0; i < 3; i++) { const a = ease.out(prog(t, ws[i] - 0.15, ws[i] + 0.25)), x0 = i * PW; g.save(); g.beginPath(); g.rect(x0 + 8, 8, PW - 16, E.H - 16); g.clip(); g.translate(x0 + PW / 2, 0); const z = 1 + 0.06 * (t - ws[i]) * (a > 0 ? 1 : 0); g.translate(0, E.H / 2); g.scale(z, z); g.translate(0, -E.H / 2);
    if (i === 0) { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0e0a20', '#2a1a2a']); g.fillRect(-PW, 0, PW * 2, E.H); glyphRows(g, t, { x: -PW * 0.38, y: E.H * 0.4, w: PW * 0.76, rows: 4, gap: 70, size: 30, p: a, color: '#ffd27a', seed: 21 }); glow(g, 0, E.H * 0.55, 300, '#ffb050', 0.2 * a); }
    if (i === 1) { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a0808', '#6a2a14', '#e07a2a']); g.fillRect(-PW, 0, PW * 2, E.H); ravana(g, 0, E.H * 1.02, 1.0, { t, glowA: 0.4 * a, rim: C.gold }); }
    if (i === 2) { sky(g, ['#02040e', '#0a1838', '#2a3a6a'], { stars: 40, t }); kailash(g, 0, E.H * 0.95, 0.55, {}); FX.moon(g, 120, E.H * 0.3, 26); }
    g.restore(); veil(g, '#000', 0); g.save(); g.fillStyle = `rgba(2,3,8,${0.78 * (1 - a)})`; g.fillRect(x0, 0, PW, E.H); g.restore();
    seg(g, [[x0 + 8, 8], [x0 + 8, E.H - 8]], 2, alpha(C.gold, 0.35)); headline(g, labels[i], E.H * 0.13, a, { size: 62, x: x0 + PW / 2, scale: 1 + 0.12 * Math.max(0, 1 - (t - ws[i]) / 0.3) }); }
  topBand(g, 0, 0);
} });
// r52 "And it still isn't enough." alone on a terrace, the gold fading
registerShot('r52', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.04 * t, x: -10 * t }, k = ease.inOut(prog(t, 0.4, info.dur)), GY = E.H * 0.78;
  layer(g, cam, 0.1, (g) => { sky(g, [mix('#1a0e20', '#06060c', k), mix('#5a2a2a', '#10101a', k), mix('#c8602a', '#2a2228', k)], { stars: 30, t }); });
  layer(g, cam, 0.4, (g) => palaceSkyline(g, E.H * 0.8, { color: '#0a060a', seed: 41, scale: 0.6, lamps: 0.5 * (1 - k), t }));
  layer(g, cam, 0.9, (g) => { g.fillStyle = '#050407'; g.fillRect(-E.W, GY, E.W * 3, E.H); for (let i = 0; i < 14; i++) g.fillRect(i * 160 - 200, GY - 60, 20, 60); g.fillRect(-E.W, GY - 70, E.W * 3, 14); });
  layer(g, cam, 1, (g) => ravana(g, E.W * 0.66, GY, 0.5, { t, rim: mix(C.gold, '#6a5a50', k), glowA: 0.3 * (1 - k), crownGold: 0.7 - 0.5 * k }));
  FX.dust(g, t, { count: 30, color: '#ffd8a0', a: 0.25 * (1 - k) });
} });
// r53 "Pride turns his greatest strengths into his downfall." his shadow swells on the wall; gold motes fall as embers
registerShot('r53', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur) }, dn = at(info, t, 'downfall', 2.7), k = ease.inOut(prog(t, 0.2, dn)), GY = E.H * 0.92, [sx, sy] = t > dn && t < dn + 0.4 ? shake(t, 10, 8) : [0, 0];
  cam.x = sx; cam.y = sy;
  layer(g, cam, 0.4, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#120806', '#3a1a0c', '#1a0a06']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W * 0.5, E.H * 1.0, 800, '#ff8a3a', 0.4);
    g.save(); g.globalAlpha = 0.75; ravana(g, E.W * 0.5, GY + 20, lerp(1.1, 1.75, k), { t, ink: '#050202', rim: '#2a1008', glowA: 0, crownGold: 0 }); g.restore(); });
  layer(g, cam, 1, (g) => { g.fillStyle = '#040203'; g.fillRect(-E.W, GY, E.W * 3, E.H); ravana(g, E.W * 0.5, GY, 0.62, { t, rim: mix(C.gold, '#ff4a1a', k), glowA: 0.3, dir: [0, -1] }); });
  const R = rng(3); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 70; i++) { const x = R() * E.W, sp = 60 + R() * 120, y = (R() * E.H + t * sp) % E.H; const c = mix(C.gold, '#ff3a1a', clamp(y / E.H * 1.2 * k + k * 0.3)); circle(g, x, y, 2 + R() * 3, alpha(c, 0.7)); } g.restore();
  if (t > dn) veil(g, '#ff6a2a', 0.25 * (1 - prog(t, dn, dn + 0.4)));
  topBand(g, 0.7, 0.24); headline(g, 'PRIDE', E.H * 0.12, ease.out(prog(t, 0.0, 0.3)), { size: 92, color: '#ffb070', spacing: 24, sub: t > dn - 0.3 ? 'BECOMES THE DOWNFALL' : 'TURNS STRENGTH' });
} });
// palace hall for Vibhishana
function hall(g, t, cam) { const GY = E.H * 0.84;
  layer(g, cam, 0.4, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a0608', '#2a1610', '#120a08']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = -1; i < 8; i++) { const x = i * 300; g.fillStyle = '#1a0e0a'; g.fillRect(x - 40, 0, 80, GY); seg(g, [[x - 40, 0], [x - 40, GY]], 3, alpha(C.gold, 0.45)); g.fillStyle = alpha(C.gold, 0.5); g.fillRect(x - 56, GY - 40, 112, 14); glow(g, x + 150, E.H * 0.3, 150, '#ffa040', 0.2 + 0.03 * Math.sin(t * 8 + i)); } });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H, ['#3a2410', '#0a0604']); g.fillRect(-E.W, GY, E.W * 3, E.H); });
  return GY; }
const crownOn = (g, x, y, s) => { poly(g, [[x - 20 * s, y], [x + 20 * s, y], [x + 12 * s, y - 26 * s], [x, y - 40 * s], [x - 12 * s, y - 26 * s]], C.gold); };
// r54 "His own brother, Vibhishana, warns him"
registerShot('r54', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur), x: lerp(-30, 20, t / info.dur) }, GY = hall(g, t, cam), v = at(info, t, 'vibhishana', 1.1), w = at(info, t, 'warns', 2.0);
  layer(g, cam, 1, (g) => { ravana(g, E.W * 0.7, GY, 0.92, { t, rim: C.gold, glowA: 0.3, dir: [-0.8, -0.4] });
    const vx = E.W * 0.3, s = 1.7, pose = breathe(posesAt(t, [[0, 'stand'], [w - 0.2, 'reach'], [w + 0.9, 'explain']]), t, 1, 3);
    drawFigure(g, { x: vx, y: GY, s, facing: 1, outfit: VIB, pose, expr: t > w ? 'worried' : 'sad', look: [1, -0.4], blink: (t % 3.2) > 3.1, rim: { color: '#ffd27a', dir: [0.7, -0.5] } }); crownOn(g, vx + POSES.stand.head[0] * s, GY + (POSES.stand.head[1] - 22) * s, 1.1);
    if (t > w) FX.rings(g, vx + 60, GY - 330, t, { color: '#ffe0b0', a: 0.4 }); });
  FX.dust(g, t, { count: 40, color: '#ffd8a0', a: 0.35 });
  topBand(g, 0.6, 0.22); chip(g, 'VIBHISHANA · HIS BROTHER', E.W / 2, E.H * 0.1, ease.outBack(prog(t, v - 0.2, v + 0.2)), { color: '#7fb8ff', size: 38 });
} });
// r55 "walks away to join the other side." across the bridge into the blue dawn
registerShot('r55', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.05 * t, x: 20 * t }, GY = E.H * 0.7;
  layer(g, cam, 0.1, (g) => { sky(g, ['#0a1a3a', '#2a4a7a', '#8ab0d0', '#e0d0c0'], {}); glow(g, E.W * 0.95, E.H * 0.66, 600, '#cfe8ff', 0.3); });
  layer(g, cam, 0.3, (g) => { g.save(); g.translate(-E.W * 0.1, 0); palaceSkyline(g, E.H * 0.66, { color: '#1a1410', seed: 51, scale: 0.7, x0: -E.W * 0.3, x1: E.W * 0.35, lamps: 0.8, t }); glow(g, E.W * 0.05, E.H * 0.55, 380, C.gold, 0.25); g.restore(); });
  layer(g, cam, 0.6, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H, ['#4a6a8a', '#0a1a2a']); g.fillRect(-E.W, GY - 30, E.W * 3, E.H); for (let i = 0; i < 12; i++) FX.lensStreak(g, E.W * (0.3 + 0.06 * i) + Math.sin(t + i) * 20, GY + 30 + i * 24, 300, '#cfe8ff', 0.2); });
  layer(g, cam, 1, (g) => { g.fillStyle = '#05080e'; g.fillRect(-E.W, GY - 6, E.W * 3, 26); for (let i = 0; i < 26; i++) { const x = -E.W * 0.5 + i * 140; g.fillRect(x, GY - 70, 10, 70); g.fillRect(x, GY + 18, 22, E.H); } g.fillRect(-E.W, GY - 76, E.W * 3, 8);
    const x = E.W * 0.32 + t * 170, s = 1.0; drawFigure(g, { x, y: GY - 4, s, facing: 1, outfit: VIB, pose: walkPose(t * 6.28 * 0.9), expr: 'sad', rim: { color: '#ffffff', dir: [1, -0.3] } }); crownOn(g, x + POSES.stand.head[0] * s, GY - 4 + (POSES.stand.head[1] - 22) * s, 0.7); });
  topBand(g, 0.5, 0.2); headline(g, 'HE WALKS AWAY', E.H * 0.11, ease.out(prog(t, 0.2, 0.6)), { size: 62, color: '#eaf2ff' });
} });
// r57 "Not because he was weak." low angle, storm, lightning
registerShot('r57', { draw(g, t, info) {
  const cam = { z: 1.06 - 0.03 * t, y: 20 * t }, fl = t > 0.15 && t < 0.3;
  layer(g, cam, 0.1, (g) => { sky(g, ['#04040e', '#141028', '#3a1e2a', '#7a3a2a'], {}); FX.clouds(g, { y: E.H * 0.1, h: 300, count: 10, color: '#0a0610', a: 0.7, seed: 6 }); if (fl) FX.lightning(g, { x1: E.W * 0.25, y1: 0, x2: E.W * 0.3, y2: E.H * 0.6, seed: 8 }); });
  layer(g, cam, 1, (g) => { g.fillStyle = '#030204'; g.fillRect(-E.W, E.H * 1.0, E.W * 3, E.H); ravana(g, E.W * 0.55, E.H * 1.08, 1.6, { t, rim: C.gold, glowA: 0.45, dir: [-0.8, -0.5] }); });
  if (fl) veil(g, '#dfe8ff', 0.16); embers(g, t, { count: 30, k: 0.4 });
  topBand(g, 0.6, 0.22); headline(g, 'NOT WEAK', E.H * 0.12, ease.out(prog(t, 0.2, 0.5)), { size: 84, spacing: 18 });
} });
// r58 "But because he was so strong that only one flaw could bring him down." a great golden crown cracks
const crownPts = [[-300, 200], [300, 200], [280, 40], [340, -60], [220, -40], [180, -220], [90, -150], [0, -380], [-90, -150], [-180, -220], [-220, -40], [-340, -60], [-280, 40]];
const CRACK = [[0, -380], [-12, -290], [20, -220], [-8, -120], [26, -40], [-6, 40], [18, 120], [0, 200]];
registerShot('r58', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.08 * ease.inOut(t / info.dur) }, fl = at(info, t, 'flaw', 3.2), dn = at(info, t, 'down', 4.5), ck = ease.inOut(prog(t, fl - 0.3, fl + 0.8)), sp = ease.out(prog(t, dn - 0.1, dn + 0.8));
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#05040a', '#1a0e10', '#05040a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W / 2, E.H * 0.6, 700, C.gold, 0.25 * (1 - sp * 0.6)); });
  layer(g, cam, 1, (g) => { const cx = E.W / 2, cy = E.H * 0.6;
    for (const side of [-1, 1]) { g.save(); g.translate(cx + side * sp * 40, cy + sp * 20); g.rotate(side * sp * 0.06); g.beginPath(); g.moveTo(0, 200);
      const pts = crownPts.filter(([x]) => side < 0 ? x <= 0 : x >= 0); g.beginPath(); g.moveTo(...CRACK[CRACK.length - 1]); for (const p of (side < 0 ? [[-300, 200], [-280, 40], [-340, -60], [-220, -40], [-180, -220], [-90, -150], [0, -380]] : [[300, 200], [280, 40], [340, -60], [220, -40], [180, -220], [90, -150], [0, -380]])) g.lineTo(...p); for (let i = 1; i < CRACK.length; i++) g.lineTo(...CRACK[i]); g.closePath();
      g.fillStyle = linGrad(g, 0, -380, 0, 200, [mix('#ffe2a0', '#5a4a3a', sp * 0.7), mix('#c88a2a', '#3a2a1a', sp * 0.7), mix('#7a4a10', '#1a120a', sp * 0.7)]); g.fill(); g.strokeStyle = alpha('#fff0c8', 0.6); g.lineWidth = 3; g.stroke();
      for (let k = 0; k < 3; k++) seg(g, [[side * 20, 120 - k * 60], [side * (300 - k * 10), 140 - k * 50]], 6, alpha('#ffd27a', 0.5 - sp * 0.3));
      for (const [jx, jy, jc] of [[side * 150, 80, '#d8202a'], [side * 60, -60, '#2a8ae0'], [side * 240, 20, '#3fb950']]) { circle(g, jx, jy, 18, jc); glow(g, jx, jy, 50, jc, 0.35 * (1 - sp)); }
      g.restore(); }
    if (ck > 0) { g.save(); g.translate(cx, cy); const n = Math.max(2, Math.ceil(ck * CRACK.length)); g.shadowColor = '#ff3a1a'; g.shadowBlur = 30; seg(g, CRACK.slice(0, n), 8, alpha('#ff5a2a', 0.95)); seg(g, CRACK.slice(0, n), 3, '#fff0d0'); g.restore(); } });
  embers(g, t, { count: 40, k: 0.3 + sp, color: '#ff8a4a', area: [E.W * 0.3, E.H * 0.3, E.W * 0.4, E.H * 0.6] });
  topBand(g, 0.7, 0.24); headline(g, 'ONE FLAW', E.H * 0.12, ease.out(prog(t, fl - 0.4, fl)), { size: 92, color: '#ffb070', spacing: 18, sub: 'SO STRONG THAT ONLY' });
} });
