// shots/04_day20.js: DAY 20. No saving: college, hospital, rainy day, the countdown account. Then barter and favours.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, seg, rr, poly, circle, ring, glow, alpha, shade, mix, text, linGrad, radGrad, shake, rng, backdrop, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { note, ashFall, embers, calendar, dayHUD, chart, coin, bokehBG, local, fmtT, EMBER, GOLD, HOT, TEAL } from '../sets/money.js';
import { street, interior, desk, rooftops, GY } from '../sets/india.js';
import { fig, people, blinkAt } from '../sets/act.js';
import { word } from '../sets/cine.js';
import { YOU, NEIGH, STUDENT, MOM, DAD, BAKER, TEACHER, RICH } from '../cast.js';

// m25: "Day 20. You realise the scariest part." the card flips over a close-up that turns scared
registerShot('m25', { draw(g, t, info) {
  const sc = local(info, t, 'scariest', 1.91), hb = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
  blurLayer(g, 5, (g) => { interior(g, t, { z: 1.2, x: 100 }, { kind: 'apartment', sky: 'night', day: 20 }); veil(g, '#04060a', 0.4);
    bigFace(g, E.W * 0.5, E.H * 0.66, 330, { outfit: YOU, expr: t > sc - 0.3 ? 'scared' : 'worried', rimColor: '#ff9a5a', rimSide: -1, blink: blinkAt(t, 2.6) }); });
  veil(g, '#05070c', 0.42 + 0.08 * hb);
  const a = 1 - prog(t, sc - 0.1, sc + 0.4);
  calendar(g, t, { from: 10, to: 20, flipAt: 0.1, s: 0.78, y: E.H * 0.43, tone: '#8a2a1e', a });
  word(g, 'THE SCARIEST PART', E.H * 0.13, ease.out(prog(t, sc - 0.1, sc + 0.25)), { size: 76, color: '#ffb0a0' });
  g.save(); g.fillStyle = radGrad(g, E.W / 2, E.H / 2, E.H * 0.3, E.H * 0.9, ['rgba(0,0,0,0)', `rgba(60,0,0,${0.35 + 0.2 * hb})`]); g.fillRect(0, 0, E.W, E.H); g.restore();
} });

// a glass savings jar with notes inside that can burn
function jar(g, x, y, s, t, burn, label) {
  g.save(); g.translate(x, y); g.scale(s, s);
  glow(g, 0, -120, 220, EMBER, 0.25 * burn);
  for (let i = 0; i < 5; i++) note(g, -30 + (i % 2) * 40, -60 - i * 34, 0.2, { rot: -0.4 + i * 0.25, timer: '10 DAYS', burn: clamp(burn * 1.3 - i * 0.15), t, seed: i + 2, shadow: false });
  g.fillStyle = 'rgba(190,230,240,.12)'; rr(g, -110, -280, 220, 280, 30); g.fill(); g.strokeStyle = 'rgba(210,240,250,.45)'; g.lineWidth = 5; g.stroke();
  rr(g, -90, -310, 180, 36, 10); g.fillStyle = '#8a6a3a'; g.fill(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(-80, -260, 14, 200);
  rr(g, -86, -160, 172, 56, 8); g.fillStyle = '#f2e6c8'; g.fill(); text(g, label, 0, -131, { size: 26, font: 'Nunito', weight: 900, color: '#3a2a1a' });
  g.restore();
}
// m26: "You can't save anymore. Not for college." the student's college jar burns down
registerShot('m26', { draw(g, t, info) {
  const cam = { z: 1.05 + 0.06 * ease.inOut(t / info.dur), x: 40 - 60 * t / info.dur }, co = local(info, t, 'college', 1.99);
  const { M } = interior(g, t, cam, { kind: 'apartment', sky: 'night', day: 20, winX: 420 }); const gy = GY();
  layer(g, cam, 1, (g) => {
    desk(g, E.W * 0.22, gy + 30, E.W * 0.6, 210, M, { top: '#5a3a28', front: '#2a1a12' });
    FX.screen(g, { x: E.W * 0.28, y: gy - 360, w: 340, h: 200, bg: '#0e2430', glowC: '#9fe0ff', a: 0.3 }, (g, x, y, w, h) => { text(g, 'COLLEGE FEES', x + w / 2, y + 50, { size: 28, font: 'Nunito', weight: 900, color: '#cfeef4' }); text(g, 'DUE IN 2 YEARS', x + w / 2, y + 110, { size: 26, font: 'Nunito', weight: 900, color: '#ff8a6a' }); });
    FX.chair(g, E.W * 0.2 - 10, gy + 20, 1.4, '#2a1a12');
    fig(g, { x: E.W * 0.2, y: gy + 20, s: 1.45, facing: 1, outfit: STUDENT, pose: t > co ? 'handsOnHead' : 'sit', expr: t > co ? 'shocked' : 'worried', t, seed: 3, rim: '#9fd8ff', rimDir: [1, -0.5] });
    jar(g, E.W * 0.68, gy - 180, 1.0, t, ease.inOut(prog(t, 0.3, co + 0.6)), 'COLLEGE FUND');
  });
  embers(g, t, { count: 24, area: [E.W * 0.55, E.H * 0.2, E.W * 0.25, E.H * 0.5], a: 0.8 });
  FX.dust(g, t, { count: 40, a: 0.3 });
  dayHUD(g, 20, t);
} });

// m27: "Not for your parents' hospital bills. Not for a rainy day." family at the billing desk, rain outside
registerShot('m27', { draw(g, t, info) {
  const rn = local(info, t, 'rainy', 2.74), cam = { z: 1.02 + 0.06 * t / info.dur, x: -30 + 60 * t / info.dur };
  const { M } = interior(g, t, cam, { kind: 'hospital', sky: 'storm', rain: t > rn - 0.6, winX: 520, winW: 460 }); const gy = GY();
  if (t > rn && t < rn + 0.25) veil(g, '#cfe0ff', 0.25 * (1 - prog(t, rn, rn + 0.25)), 'lighter');
  layer(g, cam, 1, (g) => {
    desk(g, E.W * 0.02, gy + 20, E.W * 0.36, 230, M, { top: '#cfe0e4', front: '#1e3a44' });
    fig(g, { x: E.W * 0.16, y: gy - 200, s: 1.0, facing: 1, outfit: { top: 'labcoat', head: 'bun', headColor: '#1a1210' }, pose: 'holdFront', expr: 'neutral', t, seed: 8, rim: '#bfe6ff', shadow: false });
    fig(g, { x: E.W * 0.5, y: gy + 40, s: 1.35, facing: -1, outfit: STUDENT, pose: 'holdFront', prop: { type: 'paper' }, expr: 'worried', t, seed: 1, rim: '#bfe6ff', rimDir: [-1, -0.4] });
    fig(g, { x: E.W * 0.64, y: gy + 40, s: 1.3, facing: -1, outfit: MOM, pose: 'sad', expr: 'sad', t, seed: 2, rim: '#bfe6ff', rimDir: [-1, -0.4] });
    fig(g, { x: E.W * 0.76, y: gy + 40, s: 1.35, facing: -1, outfit: DAD, pose: posesAt(t, [[0, 'stand'], [1.0, 'think']]), expr: 'worried', t, seed: 4, rim: '#bfe6ff', rimDir: [-1, -0.4] });
    // the bill
    const k = ease.outBack(prog(t, 0.2, 0.6)); g.save(); g.translate(E.W * 0.33, E.H * 0.43); g.rotate(-0.06); g.scale(k, k); rr(g, -150, -110, 300, 220, 10); g.fillStyle = '#f4f0e6'; g.fill();
    text(g, 'HOSPITAL BILL', 0, -72, { size: 30, font: 'Nunito', weight: 900, color: '#1e3a44' }); for (let i = 0; i < 3; i++) { g.fillStyle = 'rgba(30,58,68,.25)'; g.fillRect(-120, -30 + i * 28, 170, 10); g.fillRect(70, -30 + i * 28, 50, 10); } seg(g, [[-120, 60], [120, 60]], 2, 'rgba(30,58,68,.5)'); text(g, 'TOTAL DUE', -60, 84, { size: 22, font: 'Nunito', weight: 900, color: '#1e3a44' }); text(g, '₹ ? ? ?', 74, 84, { size: 26, font: 'Nunito', weight: 900, color: '#d8281e' }); g.restore();
  });
  if (t > rn - 0.3) word(g, 'NOT FOR A RAINY DAY', E.H * 0.13, ease.out(prog(t, rn - 0.3, rn)), { size: 64, color: '#bfe0ff' });
  dayHUD(g, 20, t);
} });

// m28: "A savings account is now just a countdown." the savings bar drains like an hourglass
registerShot('m28', { draw(g, t, info) {
  const cd = local(info, t, 'countdown', 2.04), k = ease.inOut(prog(t, 0.2, info.dur));
  bokehBG(g, t, { top: '#04070a', bot: '#140c08', seed: 31 });
  const cx = E.W * 0.36, cy = E.H * 0.55, z = 1 + 0.06 * t / info.dur;
  g.save(); g.translate(cx, cy); g.scale(z, z);
  // hourglass
  glow(g, 0, 0, 420, EMBER, 0.15);
  seg(g, [[-200, -320], [200, -320]], 22, '#5a3a22'); seg(g, [[-200, 320], [200, 320]], 22, '#5a3a22'); seg(g, [[-180, -320], [-180, 320]], 10, '#3a2414'); seg(g, [[180, -320], [180, 320]], 10, '#3a2414');
  g.save(); g.beginPath(); g.moveTo(-150, -300); g.quadraticCurveTo(-150, -60, -14, 0); g.quadraticCurveTo(-150, 60, -150, 300); g.lineTo(150, 300); g.quadraticCurveTo(150, 60, 14, 0); g.quadraticCurveTo(150, -60, 150, -300); g.closePath(); g.fillStyle = 'rgba(190,230,240,.07)'; g.fill(); g.strokeStyle = 'rgba(210,240,250,.45)'; g.lineWidth = 5; g.stroke(); g.clip();
  const top = lerp(-260, -10, k), bot = lerp(300, 120, k);
  g.fillStyle = linGrad(g, 0, -300, 0, 300, [GOLD, EMBER]); g.fillRect(-160, top, 320, -10 - top + 10); g.fillRect(-160, bot, 320, 300 - bot);
  embers(g, t, { count: 50, area: [-10, 0, 20, 300], a: 0.9 }); seg(g, [[0, 0], [0, bot]], 6, alpha(EMBER, 0.8)); g.restore();
  g.restore();
  // the account card on the right
  const ax = E.W * 0.72, ay = E.H * 0.5; rr(g, ax - 260, ay - 210, 520, 420, 26); g.fillStyle = 'rgba(6,12,14,.85)'; g.fill(); g.strokeStyle = alpha(EMBER, 0.4); g.lineWidth = 3; g.stroke();
  text(g, 'SAVINGS ACCOUNT', ax, ay - 160, { size: 30, font: 'Nunito', weight: 900, color: '#9fc8d0', spacing: 3 });
  text(g, '₹ ' + Math.round(lerp(85000, 0, k * 0.9)).toLocaleString('en-IN'), ax, ay - 80, { size: 70, font: 'Nunito', weight: 900, color: '#ffffff' });
  rr(g, ax - 210, ay - 10, 420, 26, 13); g.fillStyle = 'rgba(255,255,255,.1)'; g.fill(); rr(g, ax - 210, ay - 10, 420 * (1 - k * 0.9), 26, 13); g.fillStyle = linGrad(g, ax - 210, 0, ax + 210, 0, [GOLD, EMBER]); g.fill();
  text(g, fmtT(10 * 86400 - t * 41000), ax, ay + 100, { size: 64, font: 'Nunito', weight: 900, color: '#ffb35a', glow: 18, glowColor: alpha(EMBER, 0.9) });
  text(g, 'UNTIL IT BURNS', ax, ay + 160, { size: 22, font: 'Nunito', weight: 900, color: '#c89070', spacing: 4 });
  word(g, 'SAVINGS = COUNTDOWN', E.H * 0.12, ease.out(prog(t, cd - 0.3, cd)), { size: 70, color: '#ffb35a' });
  dayHUD(g, 20, t);
} });

// m29: "So people get creative. A baker pays his rent in bread." idea bulb, then a basket of bread for the landlord
registerShot('m29', { draw(g, t, info) {
  const cr = local(info, t, 'creative', 0.87), br = local(info, t, 'bread', 3.09), rent = local(info, t, 'rent', 2.79), cam = { z: key(t, [[0, 1.2], [1.6, 1.2], [2.2, 1.0], [info.dur, 1.0]]), x: key(t, [[0, -260], [1.6, -260], [2.2, 0], [info.dur, 20]]) };
  const { M } = interior(g, t, cam, { kind: 'bakery', sky: 'golden', winX: 520, winW: 420 }); const gy = GY();
  layer(g, cam, 1, (g) => {
    const give = prog(t, 2.0, 2.7);
    fig(g, { x: E.W * 0.36, y: gy + 30, s: 1.5, facing: 1, outfit: BAKER, pose: t < cr ? 'think' : t < 2.0 ? 'cheer' : 'reach', expr: t < cr ? 'thinking' : 'joy', t, seed: 2, rim: M.rim, rimDir: [1, -0.5] });
    if (t > cr - 0.1) { const k = ease.outBack(prog(t, cr - 0.1, cr + 0.2)), a = 1 - prog(t, 1.9, 2.2); g.save(); g.globalAlpha *= a; g.translate(E.W * 0.36 + 10, gy - 420); g.scale(k, k); glow(g, 0, 0, 160, '#ffe7a0', 0.7); circle(g, 0, 0, 44, '#fff2b0'); rr(g, -18, 38, 36, 30, 6); g.fillStyle = '#8a8478'; g.fill(); g.restore(); }
    fig(g, { x: E.W * 0.68, y: gy + 30, s: 1.5, facing: -1, outfit: { top: 'suit', color: '#3a3040', head: 'fedora', headColor: '#2a2420' }, pose: t > br ? 'holdFront' : 'crossArms', expr: t > br ? 'happy' : 'neutral', t, seed: 6, rim: M.rim, rimDir: [-1, -0.5] });
    if (t > 1.9) { const bx = lerp(E.W * 0.43, E.W * 0.6, ease.inOut(give)), by = gy - 150; g.save(); g.translate(bx, by); rr(g, -90, -10, 180, 70, 14); g.fillStyle = '#9a6a3a'; g.fill(); for (let i = 0; i < 4; i++) { g.fillStyle = '#d8923a'; g.beginPath(); g.ellipse(-60 + i * 40, -8, 30, 18, -0.4, 0, 7); g.fill(); } seg(g, [[-80, -10], [0, -90], [80, -10]], 6, '#7a4a22'); g.restore();
      const kk = ease.outBack(prog(t, rent - 0.1, rent + 0.2)); if (kk > 0) { g.save(); g.translate(bx, by - 140); g.scale(kk, kk); rr(g, -80, -30, 160, 60, 10); g.fillStyle = '#f2e6c8'; g.fill(); text(g, 'RENT', 0, 2, { size: 38, font: 'Nunito', weight: 900, color: '#8a2a1a' }); g.restore(); } }
  });
  FX.dust(g, t, { count: 60, color: '#ffe0b8', a: 0.45 });
  dayHUD(g, 20, t);
} });

// m30: "A teacher gets paid in electricity." a glowing bulb lights up the classroom
registerShot('m30', { draw(g, t, info) {
  const el = local(info, t, 'electricity', 1.69), lit = ease.out(prog(t, el - 0.3, el + 0.4)), cam = { z: 1.04 + 0.05 * t / info.dur, x: 30 };
  const { M } = interior(g, t, cam, { kind: 'classroom', sky: 'night', winX: 560, winW: 360, board: (g, x, y, w, h) => { text(g, 'A B C  1 2 3', x + w / 2, y + 130, { size: 70, font: 'Nunito', weight: 900, color: 'rgba(240,240,230,.8)' }); text(g, '2 + 2 = 4', x + w / 2, y + 260, { size: 60, font: 'Nunito', weight: 900, color: 'rgba(240,240,230,.6)' }); } });
  veil(g, '#020406', 0.45 * (1 - lit)); const gy = GY();
  layer(g, cam, 1, (g) => {
    fig(g, { x: E.W * 0.5, y: gy + 30, s: 1.5, facing: 1, outfit: TEACHER, pose: t > el ? 'cheer' : 'reach', expr: t > el ? 'joy' : 'surprised', t, seed: 4, rim: mix('#8fa8c0', '#ffe7a0', lit) });
    fig(g, { x: E.W * 0.74, y: gy + 30, s: 1.45, facing: -1, outfit: DAD, pose: 'reach', expr: 'smile', t, seed: 5, rim: mix('#8fa8c0', '#ffe7a0', lit) });
    const bx = lerp(E.W * 0.68, E.W * 0.6, ease.inOut(prog(t, 0.2, 1.0))), by = gy - 300 - lit * 80; glow(g, bx, by, 200 + 500 * lit, '#ffe7a0', 0.2 + 0.6 * lit); circle(g, bx, by, 46, mix('#8a8478', '#fff6c8', lit)); rr(g, bx - 18, by + 40, 36, 30, 6); g.fillStyle = '#6a6458'; g.fill();
    if (lit > 0) FX.rings(g, bx, by, t, { count: 3, r0: 60, r1: 240, color: '#ffe7a0', a: 0.5 * lit });
  });
  word(g, 'PAID IN ELECTRICITY', E.H * 0.12, ease.out(prog(t, el - 0.2, el + 0.1)), { size: 66, color: '#ffe7a0' });
  dayHUD(g, 20, t);
} });

// stairwell of an apartment block
function stairwell(g, t, cam) {
  const M = mood('night'), gy = GY();
  layer(g, cam, 0.5, (g) => { g.fillStyle = linGrad(g, 0, -E.H, 0, gy, ['#0c1418', '#22303a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    for (let i = 0; i < 9; i++) { g.fillStyle = '#2a3a44'; g.fillRect(E.W * 0.62 + i * 70, gy - 80 - i * 60, 600, 16); }
    seg(g, [[E.W * 0.6, gy - 60], [E.W * 0.6 + 630, gy - 600]], 8, '#4a5a64');
    g.fillStyle = 'rgba(220,255,240,.95)'; g.fillRect(E.W * 0.25, gy - 760, 260, 14); glow(g, E.W * 0.25 + 130, gy - 750, 420, '#cff8e8', 0.35); FX.lightCone(g, E.W * 0.25 + 130, gy - 750, { angle: Math.PI / 2, spread: 1.2, len: 800, color: '#cff8e8', a: 0.12 });
    FX.door(g, { x: E.W * 0.06, y: gy, w: 180, h: 360, color: '#5a3a2a' }); rr(g, E.W * 0.06 + 30, gy - 440, 120, 50, 6); g.fillStyle = '#c8a050'; g.fill(); text(g, '302', E.W * 0.06 + 90, gy - 414, { size: 30, font: 'Nunito', weight: 900, color: '#2a1a10' });
    for (let i = 0; i < 6; i++) { circle(g, E.W * 0.36 + i * 40, gy - 320, 16, ['#3fb950', '#2a8a3a'][i % 2]); } });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 400, ['#2a3438', '#0a0e10']); g.fillRect(-E.W, gy, E.W * 3, E.H * 2); });
  return { M, GY: gy };
}
function bike(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); for (const wx of [-110, 110]) { ring(g, wx, -60, 60, 7, '#0c0c0e'); for (let k = 0; k < 6; k++) { const a = t * 3 + k; seg(g, [[wx, -60], [wx + Math.cos(a) * 56, -60 + Math.sin(a) * 56]], 2, '#3a3a40'); } } seg(g, [[-110, -60], [-20, -140], [80, -140], [110, -60]], 8, '#d8442a'); seg(g, [[-20, -140], [10, -60], [-110, -60]], 8, '#d8442a'); seg(g, [[80, -140], [90, -175], [60, -180]], 6, '#1a1a1a'); seg(g, [[-30, -150], [-50, -160]], 10, '#1a1a1a'); g.restore(); }
// m31: "Neighbours start keeping notebooks of favours." bike gets fixed, the favour gets written down
registerShot('m31', { draw(g, t, info) {
  const nb = local(info, t, 'notebooks', 1.7), cam = { z: 1.03 + 0.05 * t / info.dur, x: -30 + 50 * t / info.dur };
  stairwell(g, t, cam); const gy = GY();
  layer(g, cam, 1, (g) => {
    bike(g, E.W * 0.36, gy + 40, 1.1, t < 1.2 ? t : 1.2);
    fig(g, { x: E.W * 0.5, y: gy + 40, s: 1.3, facing: -1, outfit: NEIGH, pose: posesAt(t, [[0, 'crouch'], [1.4, 'crouch'], [1.9, 'point']]), expr: 'happy', t, seed: 2, rim: '#cff8e8', rimDir: [-1, -0.6] });
    fig(g, { x: E.W * 0.7, y: gy + 40, s: 1.45, facing: -1, outfit: YOU, pose: 'holdFront', expr: t > nb ? 'smile' : 'neutral', t, seed: 6, rim: '#cff8e8', rimDir: [-1, -0.6] });
    if (t > nb - 0.3) { const k = ease.outBack(prog(t, nb - 0.3, nb)); g.save(); g.translate(E.W * 0.69 - 40, gy - 150); g.scale(k, k); g.rotate(-0.2); rr(g, -50, -36, 100, 72, 6); g.fillStyle = '#e8d8a8'; g.fill(); seg(g, [[0, -36], [0, 36]], 3, '#8a6a3a'); g.restore(); }
  });
  word(g, 'THE FAVOUR NOTEBOOK', E.H * 0.12, ease.out(prog(t, nb - 0.2, nb + 0.1)), { size: 66, color: '#e8d8a8' });
  dayHUD(g, 20, t);
} });

// m32: '"I fixed your bike, you owe me two dinners."' the notebook page, entries written by hand
registerShot('m32', { draw(g, t, info) {
  const fx = local(info, t, 'fixed', 0.21), dn = local(info, t, 'dinners', 1.67);
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#2a1a12', '#140c08']); g.fillRect(0, 0, E.W, E.H);
  const z = 1.0 + 0.06 * ease.inOut(t / info.dur); g.save(); g.translate(E.W / 2, E.H / 2); g.rotate(-0.04); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  glow(g, E.W * 0.5, E.H * 0.45, 900, '#ffd8a0', 0.18);
  rr(g, E.W * 0.17, E.H * 0.06, E.W * 0.66, E.H * 0.84, 10); g.fillStyle = '#f2ead2'; g.fill(); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(E.W * 0.5 - 4, E.H * 0.06, 8, E.H * 0.84);
  for (let y = E.H * 0.16; y < E.H * 0.88; y += 56) { g.fillStyle = 'rgba(80,120,180,.22)'; g.fillRect(E.W * 0.19, y, E.W * 0.62, 2); }
  g.fillStyle = 'rgba(200,60,60,.35)'; g.fillRect(E.W * 0.23, E.H * 0.06, 3, E.H * 0.84);
  text(g, 'FAVOURS — FLAT 302', E.W * 0.35, E.H * 0.115, { size: 34, font: 'Playfair Display', weight: 900, color: '#2a2a5a', italic: true });
  const rows = [['Ironed Mrs. Rao\'s shirts', '→ 1 lunch', -2], ['Maths tuition for Ravi', '→ 5 kg rice', -2], ['Watered plants (Flat 4)', '→ 1 chai/day', -2], ['I fixed your bike', '→ 2 dinners', fx]];
  rows.forEach(([a, b, at], i) => { const y = E.H * 0.2 + i * 112, k = at < 0 ? 1 : prog(t, at, at + 1.2), k2 = at < 0 ? 1 : prog(t, dn - 0.3, dn + 0.3);
    g.save(); g.beginPath(); g.rect(E.W * 0.25, y - 50, E.W * 0.55 * k, 90); g.clip(); text(g, a, E.W * 0.25, y, { size: i === 3 ? 50 : 40, font: 'Playfair Display', weight: 700, italic: true, color: i === 3 ? '#1a1a4a' : '#3a3a6a', align: 'left' }); g.restore();
    if (k2 > 0) text(g, b, E.W * 0.78, y + (i === 3 ? 4 : 0), { size: i === 3 ? 50 : 38, font: 'Playfair Display', weight: 900, italic: true, color: i === 3 ? '#b82a1e' : '#6a3a3a', align: 'right', alpha: k2 });
    if (at < 0) seg(g, [[E.W * 0.25, y + 4], [E.W * 0.6, y + 4]], 3, 'rgba(40,120,60,.6)'); });
  // pen tip following the writing
  const pk = prog(t, fx, fx + 1.2), px = E.W * 0.25 + E.W * 0.33 * pk, py = E.H * 0.2 + 3 * 112 + Math.sin(t * 30) * 6;
  if (pk < 1) { seg(g, [[px, py], [px + 220, py - 340]], 22, '#1a2a6a'); seg(g, [[px, py], [px + 30, py - 46]], 10, '#c8c8d0'); seg(g, [[px + 220, py - 340], [px + 600, py - 900]], 120, YOU.color); }
  if (t > dn + 0.2) { const k = ease.outBack(prog(t, dn + 0.2, dn + 0.5)); g.save(); g.translate(E.W * 0.72, E.H * 0.82); g.rotate(-0.15); g.scale(k, k); ring(g, 0, 0, 70, 6, '#b82a1e'); text(g, 'DEAL', 0, 2, { size: 40, font: 'Fredoka', weight: 700, color: '#b82a1e' }); g.restore(); }
  g.restore();
} });

// m33: "Without anyone planning it, people stop saving money and start saving each other." warm rooftop dinner
registerShot('m33', { draw(g, t, info) {
  const eo = local(info, t, 'each', 3.86), cam = { z: key(t, [[0, 1.22], [info.dur, 1.0]]), x: key(t, [[0, 80], [info.dur, 0]]), y: key(t, [[0, 60], [info.dur, 0]]) };
  const { M } = rooftops(g, t, cam, { mood: 'dusk', sunX: 0.55, sunY: 220 }); const gy = GY();
  layer(g, cam, 1, (g) => {
    rr(g, E.W * 0.22, gy + 10, E.W * 0.56, 70, 20); g.fillStyle = '#8a2a2a'; g.fill(); for (let i = 0; i < 6; i++) { circle(g, E.W * 0.28 + i * 160, gy + 36, 34, '#c8c0b0'); circle(g, E.W * 0.28 + i * 160, gy + 32, 24, ['#e0a030', '#c84a2a', '#f2e6c8'][i % 3]); }
    glow(g, E.W * 0.5, gy - 40, 600, '#ffc078', 0.22); FX.pool(g, E.W * 0.5, gy + 40, 600, 70, '#ffc078', 0.25);
    const cast = [[0.2, YOU, 1, 'sitBack'], [0.32, STUDENT, 1, 'sit'], [0.44, BAKER, 1, 'sit'], [0.58, MOM, -1, 'sit'], [0.7, DAD, -1, 'sit'], [0.82, NEIGH, -1, 'sitBack']];
    cast.forEach(([x, o, f, p], i) => fig(g, { x: E.W * x, y: gy + 20, s: 1.05, facing: f, outfit: o, pose: posesAt(t + i * 0.4, [[0, p], [1.5, i % 2 ? 'talk' : p], [3, p]]), expr: t > eo - 0.5 ? 'joy' : ['smile', 'happy'][i % 2], t, seed: i, rim: M.rim, rimDir: [0.3, -1] }));
    drawFigure(g, { x: E.W * 0.9 + Math.sin(t) * 20, y: gy + 20, s: 0.95, facing: -1, outfit: { kid: true }, pose: POSES.pointUp, expr: 'joy', rim: { color: M.rim, dir: [0, -1], w: 4 } });
    seg(g, [[E.W * 0.9 - 30, gy - 110], [E.W * 0.7, E.H * 0.2]], 2, 'rgba(255,255,255,.4)');
  });
  blurLayer(g, 10, (g) => { seg(g, [[-200, GY() + 220], [E.W + 200, GY() + 220]], 70, '#140c0a'); for (let x = -100; x < E.W + 100; x += 160) seg(g, [[x, GY() + 220], [x, GY() + 600]], 26, '#140c0a'); }, cam, 1.6);
  word(g, 'SAVING EACH OTHER', E.H * 0.12, ease.out(prog(t, eo - 0.4, eo)), { size: 70, color: '#ffd8a0' });
  FX.dust(g, t, { count: 50, color: '#ffd8a8', a: 0.4 });
  dayHUD(g, 20, t);
} });
