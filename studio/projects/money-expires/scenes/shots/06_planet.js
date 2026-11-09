// shots/06_planet.js: scale it to the planet: things break. DAY 30 midnight, the global burn (3D), the morning reset.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, seg, rr, poly, circle, ring, glow, alpha, shade, mix, text, linGrad, radGrad, shake, rng, backdrop, noise, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { note, ashFall, embers, calendar, dayHUD, phoneApp, armIn, bokehBG, local, fmtT, EMBER, GOLD, HOT, TEAL } from '../sets/money.js';
import { street, interior, desk, rooftops, GY } from '../sets/india.js';
import { fig, blinkAt } from '../sets/act.js';
import { word } from '../sets/cine.js';
import { drawWorld } from '../sets/geo.js';
import { earth3D, note3D, starfield, glowSprite } from '../sets/money3d.js';
import { YOU, RICH, POOR, ECON } from '../cast.js';

// m46: "But scale it to the whole planet, and things break." the whole world glows, then cracks
registerShot('m46', { draw(g, t, info) {
  const br = local(info, t, 'break', 2.15), sh = t > br ? shake(t, 16 * Math.exp(-(t - br) * 4), 10) : [0, 0];
  const view = { lon: 20, lat: 18, zoom: lerp(1.9, 1.05, ease.inOut(prog(t, 0, br))) };
  g.save(); g.translate(sh[0], sh[1]);
  drawWorld(g, view, { ocean: ['#04101a', '#020810'], land: '#3a2a1a', land2: '#5a3416', border: alpha(EMBER, 0.5), borderW: 1.2, t });
  veil(g, EMBER, 0.08 + 0.06 * Math.sin(t * 5), 'lighter');
  if (t > br) { const k = ease.out(prog(t, br, br + 0.3)), r = rng(5); g.save(); g.shadowColor = EMBER; g.shadowBlur = 20;
    for (let c = 0; c < 7; c++) { let x = E.W * (0.2 + r() * 0.6), y = E.H * (0.2 + r() * 0.6); const a = r() * 6.28; g.beginPath(); g.moveTo(x, y); for (let i = 0; i < 14 * k; i++) { x += Math.cos(a + (r() - 0.5) * 1.4) * 40; y += Math.sin(a + (r() - 0.5) * 1.4) * 40; g.lineTo(x, y); } g.strokeStyle = '#ffd8a0'; g.lineWidth = 4; g.stroke(); g.strokeStyle = alpha(EMBER, 0.6); g.lineWidth = 12; g.stroke(); }
    g.restore(); veil(g, '#3a0000', 0.25 * k); }
  g.restore();
  const gk = t > br && t < br + 0.35; if (gk) { const c = g.canvas; for (let i = 0; i < 8; i++) { const y = ((i * 211 + Math.floor(t * 24) * 61) % c.height); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(c, 0, y, c.width, 26, Math.sin(i * 5 + t * 60) * 60, y, c.width, 26); g.restore(); } }
  word(g, t > br ? 'THINGS BREAK' : 'THE WHOLE PLANET', E.H * 0.13, ease.out(prog(t, 0.2, 0.5)), { size: 76, color: t > br ? '#ff8a6a' : '#ffe0b0' });
  dayHUD(g, 28, t);
} });

// m47: "Banks can't lend, because loans expire too." the 20-year loan contract burns on the bank desk
registerShot('m47', { draw(g, t, info) {
  const ex = local(info, t, 'expire', 1.69), cam = { z: 1.04 + 0.06 * t / info.dur, x: 20 - 40 * t / info.dur };
  const { M } = interior(g, t, cam, { kind: 'bank', sky: 'night', winX: 520, winW: 420 }); const gy = GY();
  layer(g, cam, 1, (g) => {
    fig(g, { x: E.W * 0.26, y: gy + 20, s: 1.45, facing: 1, outfit: YOU, pose: t > ex ? 'handsOnHead' : 'reach', expr: t > ex ? 'shocked' : 'smile', t, seed: 2, rim: M.rim, rimDir: [1, -0.5] });
    fig(g, { x: E.W * 0.74, y: gy + 20, s: 1.45, facing: -1, outfit: ECON, pose: posesAt(t, [[0, 'explain'], [0.9, 'shrug']]), expr: 'worried', t, seed: 4, rim: M.rim, rimDir: [-1, -0.5] });
    desk(g, E.W * 0.33, gy + 30, E.W * 0.34, 170, M, { top: '#3a4a50', front: '#14222a' });
    // contract
    const burn = ease.in(prog(t, ex - 0.2, info.dur + 0.2)); g.save(); g.translate(E.W * 0.5, gy - 300); g.rotate(-0.05);
    g.save(); if (burn > 0) { g.beginPath(); g.rect(-220, -170 + 360 * burn, 440, 400); g.clip(); }
    rr(g, -170, -170, 340, 340, 8); g.fillStyle = '#f4f0e6'; g.fill(); text(g, 'HOME LOAN', 0, -120, { size: 40, font: 'Nunito', weight: 900, color: '#14303a' }); text(g, '20 YEARS', 0, -70, { size: 34, font: 'Nunito', weight: 900, color: '#b8401e' });
    for (let i = 0; i < 5; i++) { g.fillStyle = 'rgba(20,48,58,.25)'; g.fillRect(-130, -20 + i * 30, 260 - (i % 2) * 60, 10); } seg(g, [[-120, 140], [20, 140]], 2, '#14303a'); text(g, 'signed', -50, 126, { size: 22, font: 'Playfair Display', weight: 700, italic: true, color: '#2a2a5a' });
    g.restore();
    if (burn > 0 && burn < 1) { const yb = -170 + 340 * burn; g.save(); g.globalCompositeOperation = 'lighter'; g.shadowColor = EMBER; g.shadowBlur = 24; g.beginPath(); for (let x = -170; x <= 170; x += 10) g.lineTo(x, yb + noise(x * 0.05 + t * 3, 3) * 12); g.strokeStyle = EMBER; g.lineWidth = 8; g.stroke(); g.restore(); embers(g, t, { count: 30, area: [-170, yb - 300, 340, 300] }); }
    g.restore();
    if (t > ex) text(g, 'EXPIRED', E.W * 0.5, gy - 520, { size: 60, font: 'Nunito', weight: 900, color: '#ff5a3c', glow: 16, glowColor: alpha('#ff5a3c', 0.7), alpha: ease.out(prog(t, ex, ex + 0.2)) });
  });
  dayHUD(g, 28, t);
} });

// m48: "Long-term dreams houses, businesses, retirement become almost impossible." three dreams fade to ash
registerShot('m48', { draw(g, t, info) {
  const w = [local(info, t, 'houses', 1.87), local(info, t, 'businesses', 2.47), local(info, t, 'retirement', 3.11)], im = local(info, t, 'impossible', 4.65);
  const cam = { x: key(t, [[0, -700], [w[0], -560], [w[1], 0], [w[2], 560], [info.dur, 640]]), z: 1.0 };
  bokehBG(g, t, { top: '#05070a', bot: '#120c0a', seed: 41 });
  const fade = (i) => 1 - ease.inOut(prog(t, w[i] + 0.4, w[i] + 1.4));
  layer(g, cam, 1, (g) => {
    const P = [E.W * 0.5 - 560, E.W * 0.5, E.W * 0.5 + 560], cy = E.H * 0.55;
    // house blueprint
    g.save(); g.globalAlpha *= fade(0); g.translate(P[0], cy); rr(g, -230, -200, 460, 380, 10); g.fillStyle = '#0c2a4a'; g.fill(); g.strokeStyle = 'rgba(160,210,255,.15)'; g.lineWidth = 1; for (let x = -220; x < 230; x += 30) { g.beginPath(); g.moveTo(x, -200); g.lineTo(x, 180); g.stroke(); }
    g.strokeStyle = '#bfe0ff'; g.lineWidth = 4; g.strokeRect(-140, -40, 280, 180); g.beginPath(); g.moveTo(-170, -40); g.lineTo(0, -160); g.lineTo(170, -40); g.stroke(); g.strokeRect(-40, 50, 80, 90); g.strokeRect(-110, 0, 50, 50); g.strokeRect(60, 0, 50, 50); g.restore();
    // business shop sign
    g.save(); g.globalAlpha *= fade(1); g.translate(P[1], cy); FX.door(g, { x: -70, y: 180, w: 140, h: 230, color: '#3a2a22', open: 0.4, light: '#ffd59a' }); g.fillStyle = '#2a1a14'; g.fillRect(-200, -220, 400, 400); g.fillStyle = '#ffd59a'; g.fillRect(-160, -90, 120, 120); g.fillRect(40, -90, 120, 120); rr(g, -210, -240, 420, 90, 12); g.fillStyle = '#c8402a'; g.fill(); text(g, 'MY BUSINESS', 0, -194, { size: 46, weight: 700, color: '#fff2d8', spacing: 4 }); g.restore();
    // retirement: empty rocking chair on a porch
    g.save(); g.globalAlpha *= fade(2); g.translate(P[2], cy); g.fillStyle = '#3a2a1e'; g.fillRect(-230, 170, 460, 20); glow(g, 0, 0, 300, '#ffc078', 0.2); g.rotate(Math.sin(t * 1.6) * 0.06);
    seg(g, [[-80, 170], [-90, 20], [-60, -140]], 12, '#6a4a2a'); seg(g, [[-90, 30], [80, 30]], 14, '#6a4a2a'); seg(g, [[70, 30], [80, 170]], 12, '#6a4a2a'); seg(g, [[-60, -140], [-20, -140]], 10, '#6a4a2a'); g.strokeStyle = '#6a4a2a'; g.lineWidth = 10; g.beginPath(); g.arc(0, 60, 150, 0.3, Math.PI - 0.3); g.stroke(); g.restore();
    ['HOUSE', 'BUSINESS', 'RETIREMENT'].forEach((s2, i) => text(g, s2, P[i], cy + 240, { size: 44, font: 'Nunito', weight: 900, color: '#fff1dc', spacing: 6, alpha: ease.out(prog(t, w[i] - 0.1, w[i] + 0.2)) * (0.4 + 0.6 * fade(i)) }));
    for (let i = 0; i < 3; i++) if (t > w[i] + 0.3) ashFall(g, t, { count: 40, seed: i + 7, up: true, ember: 0.3, area: [P[i] - 250, cy - 300, 500, 520], a: 1 - prog(t, w[i] + 1.2, w[i] + 2.2) });
  });
  word(g, 'ALMOST IMPOSSIBLE', E.H * 0.12, ease.out(prog(t, im - 0.3, im)), { size: 70, color: '#ff8a6a' });
  dayHUD(g, 29, t);
} });

// m49: "When money can't wait, neither can people." close-up, a huge clock racing behind
registerShot('m49', { draw(g, t, info) {
  const ne = local(info, t, 'neither', 1.66);
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#05080c', '#1a100a']); g.fillRect(0, 0, E.W, E.H);
  blurLayer(g, 4, (g) => { FX.clock(g, E.W * 0.5, E.H * 0.42, 420, t * 60 * 30, { face: '#2a2420', ink: '#8a7a6a', red: EMBER, speed: 1 }); glow(g, E.W * 0.5, E.H * 0.42, 600, EMBER, 0.12); });
  veil(g, '#04060a', 0.35);
  const z = 1 + 0.07 * ease.inOut(t / info.dur); g.save(); g.translate(E.W * 0.5, E.H * 0.7); g.scale(z, z);
  bigFace(g, 0, 0, 300, { outfit: YOU, expr: t > ne ? 'determined' : 'worried', look: [t > ne ? 0 : -0.4, -0.1], rimColor: '#ffb070', rimSide: 1, blink: blinkAt(t, 2.8) }); g.restore();
  word(g, "PEOPLE CAN'T WAIT EITHER", E.H * 0.12, ease.out(prog(t, ne - 0.3, ne)), { size: 64, color: '#ffe0b0' });
  dayHUD(g, 29, t);
} });

// m50: "Day 30. Midnight." the final card; the clock snaps to twelve
registerShot('m50', { draw(g, t, info) {
  const mn = local(info, t, 'midnight', 1.2);
  bokehBG(g, t, { top: '#02040a', bot: '#0a0c18', warm: '#4a6ad8', seed: 51 });
  calendar(g, t, { from: 29, to: 30, flipAt: 0.05, s: 0.72, x: E.W * 0.36, y: E.H * 0.47, tone: '#1a1a2a' });
  const hr = lerp(11.75, 12, ease.out(prog(t, 0, mn))), cx = E.W * 0.7, cy = E.H * 0.47;
  circle(g, cx, cy, 220, '#efe6d4'); ring(g, cx, cy, 220, 12, '#1a1410'); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; seg(g, [[cx + Math.cos(a) * 180, cy + Math.sin(a) * 180], [cx + Math.cos(a) * 205, cy + Math.sin(a) * 205]], 8, '#1a1410'); }
  const ah = (hr / 12) * Math.PI * 2 - Math.PI / 2, am = ((hr % 1) * Math.PI * 2) - Math.PI / 2; seg(g, [[cx, cy], [cx + Math.cos(ah) * 120, cy + Math.sin(ah) * 120]], 14, '#1a1410'); seg(g, [[cx, cy], [cx + Math.cos(am) * 180, cy + Math.sin(am) * 180]], 8, '#1a1410'); circle(g, cx, cy, 14, EMBER);
  if (t > mn) { FX.rings(g, cx, cy, t, { count: 3, r0: 230, r1: 420, color: EMBER, a: 0.5 }); text(g, '00:00', cx, cy + 300, { size: 70, font: 'Nunito', weight: 900, color: '#ff8a4a', glow: 20, glowColor: alpha(EMBER, 0.9), alpha: ease.out(prog(t, mn, mn + 0.2)) }); }
  text(g, 'MIDNIGHT', E.W / 2, E.H * 0.12, { size: 80, weight: 700, color: '#dfe6ff', spacing: 14, glow: 16, glowColor: 'rgba(120,150,255,.5)', alpha: ease.out(prog(t, mn - 0.2, mn + 0.1)) });
} });

// m51: "Across the world, a trillion notes glow orange and turn to ash." 3D: night Earth, a burning wave of notes
registerShot('m51', { kind: '3d',
  init(T) { const st = T.stage({ mood: 'night', fov: 34, sky: ['#010204', '#030812'], fog: false, ambient: 0.35, ambientSky: '#2a4a60', keyColor: '#9fb8ff', keyIntensity: 0.9, keyPos: [-8, 2, -6], bloom: 0.6, bloomThreshold: 0.84 });
    const e = earth3D(T, st, { r: 2, night: true, notes: true, ptSize: 0.06, atm: '#2a7a9a', atmK: 0.7 }); starfield(T, st);
    const fg = []; for (let i = 0; i < 5; i++) { const n = note3D(T, { w: 0.5, note: { timer: '00:00:00:00', urgent: 1 }, emissive: 0.5 }); n.position.set(-1.6 + i * 0.8, 0.9 - (i % 2) * 1.4, 4.2 - (i % 3) * 0.5); n.rotation.set(0.3 * i, -0.4 + i * 0.2, 0.2 * i); st.add(n); fg.push(n); }
    const orange = glowSprite(T, st, '#ff7a2a', 8, [0, 0, -1], 0.0);
    return { stage: st, e, fg, orange }; },
  draw(s, t, info, T) { const gl = local(info, t, 'glow', 1.91), ash = local(info, t, 'ash', 3.57), tu = local(info, t, 'turn', 3.21);
    const glowK = ease.out(prog(t, 0.1, gl + 0.3)) * (1 - 0.7 * prog(t, ash + 0.2, info.dur)), swept = 380 * ease.inOut(prog(t, gl + 0.3, ash));
    s.e.rotation.y = 1.4 + t * 0.12; s.e.burn(t, glowK, swept, -(1.4 * 57.3) - 100);
    s.orange.material.opacity = 0.25 * glowK + 0.4 * Math.exp(-Math.abs(t - ash) * 4);
    s.fg.forEach((n, i) => { n.draw({ timer: '00:00:00:00', urgent: 1, t, burn: clamp(prog(t, gl + 0.4 + i * 0.25, ash + 0.2 + i * 0.1)), seed: i + 3 }); n.rotation.z += 0.002; n.position.y += 0.002; });
    const sh = t > ash ? Math.exp(-(t - ash) * 4) * 0.06 : 0;
    T.dolly(s.stage.camera, t, [[0, { pos: [0.4, 0.6, 9.4], look: [0, 0, 0] }], [info.dur, { pos: [-0.5, 0.9, 6.9], look: [0, 0.1, 0] }]]); s.stage.camera.position.x += Math.sin(t * 60) * sh; s.stage.camera.position.y += Math.cos(t * 53) * sh; },
  overlay(g, t, info) { const ash = local(info, t, 'ash', 3.57), tr = local(info, t, 'trillion', 1.31);
    if (t > ash && t < ash + 0.35) veil(g, '#ffd8a0', 0.45 * (1 - prog(t, ash, ash + 0.35)), 'lighter');
    ashFall(g, t, { count: 80, seed: 12, a: prog(t, ash, ash + 0.5), ember: 0.25 });
    const k = ease.out(prog(t, tr - 0.1, tr + 0.25)) * (1 - prog(t, ash - 0.3, ash)); if (k > 0) word(g, '1,000,000,000,000 NOTES', E.H * 0.12, k, { size: 64, color: '#ffb35a' });
    if (t > ash) word(g, 'ASH', E.H * 0.12, ease.out(prog(t, ash, ash + 0.2)), { size: 90, color: '#c8c0b8' }); },
});

// m52: "And in the morning, a new month begins." sunrise over the rooftops, ash settling
registerShot('m52', { draw(g, t, info) {
  const cam = { z: 1.06 - 0.04 * t / info.dur, y: 20 - 20 * t / info.dur };
  const { M } = rooftops(g, t, cam, { mood: 'golden', sunX: 0.62, sunY: 330 + 140 * ease.out(t / info.dur), sunR: 90, kites: 1, lights: false });
  layer(g, cam, 1, (g) => { fig(g, { x: E.W * 0.3, y: GY() + 30, s: 1.4, facing: 1, outfit: YOU, pose: posesAt(t, [[0, 'sad'], [1.2, 'stand']]), expr: t > 1.2 ? 'awe' : 'sleepy', look: [0.8, -0.3], t, seed: 3, rim: M.rim, rimDir: [1, -0.4] }); });
  ashFall(g, t * 0.4, { count: 50, seed: 22, a: 0.6 * (1 - t / info.dur), ember: 0 });
  word(g, 'A NEW MONTH', E.H * 0.12, ease.out(prog(t, local(info, t, 'new', 1.16) - 0.2, local(info, t, 'new', 1.16) + 0.1)), { size: 76, color: '#fff0d0' });
  dayHUD(g, 1, t);
} });

// m53: "Everyone starts again at zero." the app: balance 0, a fresh 30-day timer refills
registerShot('m53', { draw(g, t, info) {
  const z0 = local(info, t, 'zero', 1.26), cam = { z: 1.05 + 0.04 * t / info.dur };
  blurLayer(g, 12, (g) => rooftops(g, t, { z: 1.2, x: 0 }, { mood: 'golden', sunX: 0.5, sunY: 260, kites: 2, lights: false })); veil(g, '#06080a', 0.4);
  layer(g, cam, 1, (g) => { armIn(g, E.W * 0.82, E.H * 1.04, 0.7, -2.5, { sleeve: YOU.color, rim: '#ffd8a0', grip: 0.3 });
    const ref = ease.inOut(prog(t, z0 - 0.2, z0 + 0.6)); phoneApp(g, E.W * 0.5, E.H * 0.48, 1.1, { t, balance: '₹ 0', timer: ref > 0.95 ? '30d 00h 00m 00s' : '00d 00h 00m 00s', left: ref, sub: ref > 0.95 ? 'NEW MONTH · EXPIRES IN' : 'EXPIRED' }); });
  if (t > z0) FX.rings(g, E.W * 0.5, E.H * 0.48 - 110, t, { count: 2, r0: 100, r1: 320, color: GOLD, a: 0.4 });
  dayHUD(g, 1, t);
} });

// m54: "Rich and poor for one strange moment almost equal." side by side at dawn, a balance levels
registerShot('m54', { draw(g, t, info) {
  const eq = local(info, t, 'equal', 2.81), cam = { z: 1.02 + 0.06 * ease.inOut(t / info.dur) };
  const { M } = street(g, t, cam, { mood: 'golden', seed: 11, wires: true, lamps: false, sunX: 0.5 }); const gy = GY();
  layer(g, cam, 1, (g) => {
    FX.pool(g, E.W * 0.5, gy + 40, 600, 60, M.key, 0.25);
    fig(g, { x: E.W * 0.3, y: gy + 40, s: 1.6, facing: 1, outfit: RICH, pose: 'shrug', expr: t > eq - 0.4 ? 'smile' : 'confused', t, seed: 1, rim: M.rim, rimDir: [1, -0.5] });
    fig(g, { x: E.W * 0.7, y: gy + 40, s: 1.6, facing: -1, outfit: POOR, pose: 'shrug', expr: t > eq - 0.4 ? 'smile' : 'surprised', t, seed: 2, rim: M.rim, rimDir: [-1, -0.5] });
    const tilt = 0.32 * (1 - ease.outElastic(prog(t, 0.8, eq + 0.3))), cx = E.W * 0.5, cy = gy - 420;
    seg(g, [[cx, gy], [cx, cy]], 10, '#c8a050'); rr(g, cx - 80, gy - 16, 160, 20, 6); g.fillStyle = '#c8a050'; g.fill();
    g.save(); g.translate(cx, cy); g.rotate(tilt); seg(g, [[-200, 0], [200, 0]], 10, '#e0b860'); for (const s2 of [-1, 1]) { seg(g, [[s2 * 200, 0], [s2 * 200 - 60, 120]], 2, '#e0b860'); seg(g, [[s2 * 200, 0], [s2 * 200 + 60, 120]], 2, '#e0b860'); g.save(); g.translate(s2 * 200, 120); g.rotate(-tilt); g.beginPath(); g.ellipse(0, 0, 70, 16, 0, 0, Math.PI); g.fillStyle = '#e0b860'; g.fill(); text(g, '₹0', 0, -24, { size: 30, font: 'Nunito', weight: 900, color: '#fff2d0' }); g.restore(); } g.restore(); circle(g, cx, cy, 16, '#fff0c0');
  });
  word(g, 'ALMOST EQUAL', E.H * 0.12, ease.out(prog(t, eq - 0.2, eq + 0.1)), { size: 76, color: '#fff0d0' });
  FX.dust(g, t, { count: 50, color: '#ffe8c8', a: 0.4 });
  dayHUD(g, 1, t);
} });
