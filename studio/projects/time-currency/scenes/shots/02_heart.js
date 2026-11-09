// shots/02_heart.js: the poor, the mother, the robbery, the turn to us, the ending.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, wordTime, seg, circle, rr, glow, alpha, shade, mix, text, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { stat } from '../sets/stat.js';
import { street, room, rooftop, wrist, cost, fmtLife, YEAR, DAY, HOUR, MIN, GY } from '../sets/world.js';
import { POOR, MOTHER, SON, THIEF, YOU, CAST } from '../cast.js';

const local = (info, t, word) => { const w = wordTime(word, info.globalT - t - 0.3); return w == null ? null : w - (info.globalT - t); };
const rimOf = (M, dir = [0.4, -1]) => ({ color: M.rim, dir, w: 5 });

// c12: "The poor wake up every morning with one day left." grey dawn in a tiny room
registerShot('c12', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.08 + 0.06 * ease.inOut(p), x: -40 };
  const { M, GY: gy } = room(g, t, cam, { kind: 'room', sky: 'dusk' });
  const up = ease.inOut(prog(t, 0.4, 1.4));
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(330, 250), y: gy - V(70, 70) * (1 - up), s: V(1.5, 1.6), facing: 1, outfit: POOR, pose: up < 0.5 ? { ...POSES.lie } : breathe(POSES.sit, t), rot: up < 0.5 ? -Math.PI / 2 * (1 - up * 2) : 0, expr: up < 0.5 ? 'sleepy' : 'sad', rim: rimOf(M, [1, -0.3]) }));
  wrist(g, E.W / 2, E.H * V(0.15, 0.18), V(1.2, 1.4), fmtLife(DAY - 2 - t), { color: '#ff7a4a', flicker: t > 1.5 ? 1 : 0, t });
  stat(g, { label: 'TIME LEFT', value: '1 DAY', x: E.W / 2, y: E.H * V(0.3, 0.31), size: V(90, 100), color: '#ff7a4a', a: ease.out(prog(t, 1.2, 1.6)), pulse: t - 1.2 });
  FX.dust(g, t, { count: 40, color: '#ffd8a8', a: 0.35 });
} });

// c13: "They work to earn tomorrow," a night factory line, +1 day
registerShot('c13', { draw(g, t, info) {
  const cam = { z: 1.1 + 0.05 * t / info.dur };
  const { M, GY: gy } = room(g, t, cam, { kind: 'office', mood: 'interiorCool', sky: 'night' });
  const earn = local(info, t, 'tomorrow') ?? 1.0;
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 6; i++) { const bx = ((t * 160 + i * 220) % (E.W + 300)) - 150; rr(g, bx - 50, gy - 190, 100, 70, 8); g.fillStyle = '#3a4a5a'; g.fill(); }
    seg(g, [[-E.W, gy - 120], [E.W * 2, gy - 120]], 16, '#0c1218');
    for (let i = 0; i < 3; i++) drawFigure(g, { x: E.W / 2 + (i - 1) * V(300, 280), y: gy, s: V(1.4, 1.5), facing: 1, outfit: i === 1 ? POOR : { top: 'tshirt', color: '#4a5060', head: 'none' }, pose: Math.sin(t * 5 + i) > 0 ? POSES.reach : POSES.holdFront, expr: 'sad', rim: rimOf(M), shadow: false });
  });
  wrist(g, E.W / 2, E.H * V(0.15, 0.18), V(1.1, 1.3), fmtLife((t < earn ? 2 * HOUR : lerp(2 * HOUR, DAY + 2 * HOUR, ease.out(prog(t, earn, earn + 0.6)))) - t), { color: '#ffc15a' });
  cost(g, E.W / 2, E.H * V(0.34, 0.33), t, earn, '+1 DAY', '#5fe8c8');
} });

// c14: "and spend it just to stay alive." bread, medicine, rent: the clock drains straight back
registerShot('c14', { draw(g, t, info) {
  blurLayer(g, 12, (g) => room(g, t, { z: 1.4, y: -160 }, { kind: 'shop', sky: 'night' })); veil(g, '#05070a', 0.4);
  const labels = ['BREAD  -6 HRS', 'MEDICINE  -9 HRS', 'HEAT  -8 HRS'];
  labels.forEach((l, i) => { const a = ease.outBack(prog(t, 0.2 + i * 0.45, 0.5 + i * 0.45)); if (a <= 0) return; g.save(); g.translate(E.W / 2, E.H * V(0.36, 0.34) + i * V(110, 130)); g.scale(a, a); rr(g, -V(300, 330), -V(40, 46), V(600, 660), V(80, 92), 40); g.fillStyle = 'rgba(6,10,14,.8)'; g.fill(); text(g, l, 0, 2, { size: V(44, 52), font: 'Nunito', weight: 900, color: '#ff7a4a', spacing: 2 }); g.restore(); });
  const drain = ease.inOut(prog(t, 0.2, 1.7));
  wrist(g, E.W / 2, E.H * V(0.16, 0.18), V(1.3, 1.5), fmtLife(lerp(DAY + 2 * HOUR, 2 * HOUR + 50 * MIN, drain) - t), { color: drain > 0.9 ? '#ff7a4a' : '#ffc15a', flicker: drain > 0.9 ? 1 : 0, t });
  bigFace(g, E.W / 2, E.H * V(0.86, 0.74), V(230, 250), { outfit: POOR, expr: 'worried', look: [0, -0.6], rimColor: '#ffb760', rimSide: 1 });
} });

// c15: "A mother gives her son her last hour," rain; she kneels and presses her wrist to his
registerShot('c15', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.18 + 0.1 * ease.inOut(p), x: -20, y: 40 };
  const { M, GY: gy } = street(g, t, cam, { mood: 'storm' });
  const give = local(info, t, 'last') ?? 1.0, k = ease.inOut(prog(t, give - 0.2, give + 1.0));
  const mx = E.W / 2 - V(170, 150), sx = E.W / 2 + V(160, 150);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: mx, y: gy, s: V(2.1, 2.3), facing: 1, outfit: MOTHER, pose: breathe(posesAt(t, [[0, POSES.kneel], [give - 0.4, { ...POSES.kneel, eF: [40, -104], hF: [74, -112] }]]), t), expr: k > 0.6 ? 'smile' : 'worried', rim: rimOf(M, [0.3, -1]), blink: (t % 3.3) > 3.2 });
    drawFigure(g, { x: sx, y: gy, s: V(2.1, 2.3), facing: -1, outfit: SON, pose: breathe(posesAt(t, [[0, POSES.sad], [give - 0.3, { ...POSES.stand, eF: [16, -128], hF: [36, -122] }]]), t, 1, 2), expr: k > 0.5 ? 'surprised' : 'cry', rim: rimOf(M, [-0.3, -1]) });
    // the stream of light from her wrist to his
    const ax = mx + V(140, 150), bx = sx - V(70, 60), y = gy - V(240, 260);
    if (k > 0 && k < 1) for (let i = 0; i < 14; i++) { const q = ((t * 1.6 + i / 14) % 1); circle(g, lerp(ax, bx, q), y + Math.sin(q * Math.PI) * -40, 6, alpha('#ffc15a', 0.9)); }
    glow(g, (ax + bx) / 2, y, 300, '#ffc15a', 0.45 * Math.sin(k * Math.PI));
  });
  FX.rain(g, t, { count: 200 });
  wrist(g, E.W * 0.3, E.H * V(0.15, 0.17), V(0.75, 0.85), fmtLife(HOUR * (1 - k)), { color: k > 0.9 ? '#ff5a3c' : '#ffc15a' });
  wrist(g, E.W * 0.72, E.H * V(0.15, 0.17), V(0.75, 0.85), fmtLife(5 * MIN + HOUR * k), { color: '#ffc15a' });
  text(g, 'MOM', E.W * 0.3, E.H * V(0.1, 0.115), { size: V(30, 34), font: 'Nunito', weight: 900, color: '#ffe6c4', spacing: 5 });
  text(g, 'SON', E.W * 0.72, E.H * V(0.1, 0.115), { size: V(30, 34), font: 'Nunito', weight: 900, color: '#ffe6c4', spacing: 5 });
} });

// c16: "so he can make it home." he runs into the light; her clock reads zero
registerShot('c16', { draw(g, t, info) {
  blurLayer(g, 10, (g) => street(g, t + 2, { z: 1.4, x: 200, y: -100 }, { mood: 'storm' })); veil(g, '#05070a', 0.35);
  const M = mood('storm');
  bigFace(g, E.W / 2 - V(60, 40), E.H * V(0.62, 0.58), V(300, 320) * (1 + 0.05 * t / info.dur), { outfit: MOTHER, expr: 'smile', look: [0.7, 0], rimColor: M.rim, rimSide: 1, blink: (t % 2.6) > 2.5 });
  // a single tear
  const ty = lerp(E.H * V(0.6, 0.56), E.H * V(0.7, 0.65), ease.in(prog(t, 0.3, 1.6)));
  g.fillStyle = alpha('#cfe8ff', 0.9); g.beginPath(); g.ellipse(E.W / 2 + V(40, 50), ty, 9, 14, 0, 0, 7); g.fill();
  FX.rain(g, t, { count: 160 });
  wrist(g, E.W / 2, E.H * V(0.16, 0.18), V(1.1, 1.3), '00Y 000D 00:00:00', { color: '#ff5a3c', flicker: 1, t, a: ease.out(prog(t, 0.6, 1.0)) });
} });

// c17: "Nobody can be robbed of money anymore." an alley, a hooded thief grabs a wrist
registerShot('c17', { draw(g, t, info) {
  const cam = { z: 1.15 + 0.06 * t / info.dur, r: -0.02 };
  const { M, GY: gy } = street(g, t, cam, { mood: 'night' });
  const grab = 0.8, k = ease.out(prog(t, grab - 0.3, grab));
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 + V(150, 110), y: gy, s: V(1.7, 1.8), facing: -1, outfit: POOR, pose: breathe(t > grab ? POSES.handsOnHead : POSES.stand, t), expr: t > grab ? 'scared' : 'neutral', rim: rimOf(M, [-0.3, -1]) });
    drawFigure(g, { x: lerp(-200, E.W / 2 - V(130, 100), k), y: gy, s: V(1.8, 1.9), facing: 1, outfit: THIEF, pose: t > grab - 0.2 ? POSES.reach : walkPose(t * 2 * Math.PI * 1.6, { run: true }), expr: 'angry', rim: rimOf(M), dim: 0.3 });
  });
  FX.rain(g, t, { count: 140 });
} });

// c18: "But everyone can be robbed of life." the stolen clock drains to zero
registerShot('c18', { draw(g, t, info) {
  blurLayer(g, 14, (g) => street(g, t, { z: 1.6, y: -200 }, { mood: 'night' })); veil(g, '#0a0204', 0.45);
  const M = mood('night'), d = ease.in(prog(t, 0.1, info.dur - 0.4));
  bigFace(g, E.W / 2, E.H * V(0.66, 0.62), V(300, 320), { outfit: POOR, expr: 'shocked', look: [0, -0.6], rimColor: '#ff5a3c', rimSide: -1 });
  wrist(g, E.W / 2, E.H * V(0.2, 0.22), V(1.4, 1.6), fmtLife(lerp(18 * YEAR, 0, d)), { color: '#ff5a3c', flicker: 1, t });
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = alpha('#600', 0.5 * d); g.fillRect(0, 0, E.W, E.H); g.restore();
} });

// c19: "And here's the uncomfortable part." you, in the dark, turn to camera
registerShot('c19', { draw(g, t, info) {
  g.fillStyle = '#04060a'; g.fillRect(0, 0, E.W, E.H);
  glow(g, E.W * 0.8, E.H * 0.3, 900, '#ffb760', 0.2);
  bigFace(g, E.W / 2, E.H * V(0.62, 0.56), V(330, 350) * (1 + 0.06 * t / info.dur), { outfit: YOU, expr: 'thinking', look: [0, 0], rimColor: '#ffb760', rimSide: 1, blink: (t % 2.4) > 2.3 });
  FX.dust(g, t, { count: 30, color: '#ffd8a8', a: 0.25 });
} });

// c20: "Maybe that world isn't so different from ours." our world: you at a desk late at night, no wrist clock, a wall clock
registerShot('c20', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.1 + 0.06 * ease.inOut(p), x: 30 * p };
  const { M, GY: gy } = room(g, t * 30, cam, { kind: 'office', sky: 'night' });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(200, 160), y: gy, s: V(1.6, 1.7), facing: 1, outfit: YOU, pose: breathe(POSES.sit, t), expr: 'sleepy', rim: { color: '#bfe6ff', dir: [1, -0.4], w: 5 }, blink: (t % 2.0) > 1.8 }));
  text(g, 'OUR WORLD', E.W / 2, E.H * V(0.26, 0.27), { size: V(56, 64), font: 'Nunito', weight: 900, color: '#bfe6ff', spacing: 8, alpha: ease.out(prog(t, 0.4, 0.8)) });
} });

// c21: "We already trade our hours for money. Forty hours a week, for decades." hourglass sand turns into coins
registerShot('c21', { draw(g, t, info) {
  const ui = S().ui; UI.blueprint(g);
  const cx = E.W / 2, cy = E.H * V(0.58, 0.54), h = V(420, 460), w = V(240, 260);
  // hourglass
  g.strokeStyle = ui.blueprint; g.lineWidth = 8; g.beginPath(); g.moveTo(cx - w, cy - h); g.lineTo(cx + w, cy - h); g.lineTo(cx + 12, cy); g.lineTo(cx + w, cy + h); g.lineTo(cx - w, cy + h); g.lineTo(cx - 12, cy); g.closePath(); g.stroke();
  const k = clamp(t / info.dur);
  g.fillStyle = alpha(ui.gold, 0.85); g.beginPath(); g.moveTo(cx - w * (1 - k) * 0.9, cy - h * (1 - k) * 0.9); g.lineTo(cx + w * (1 - k) * 0.9, cy - h * (1 - k) * 0.9); g.lineTo(cx, cy - 6); g.fill();
  seg(g, [[cx, cy], [cx, cy + h - 40]], 4, alpha(ui.gold, 0.9));
  // coins stacking at the bottom
  const n = Math.floor(k * 14);
  for (let i = 0; i < n; i++) { const x = cx + ((i % 5) - 2) * 60, y = cy + h - 30 - Math.floor(i / 5) * 26; g.fillStyle = '#ffc15a'; g.beginPath(); g.ellipse(x, y, 34, 12, 0, 0, 7); g.fill(); g.fillStyle = '#c98a2a'; g.fillRect(x - 34, y, 68, 8); }
  const forty = local(info, t, 'forty') ?? 2.0;
  stat(g, { label: 'WE ALREADY SELL', value: '40 HRS / WEEK', x: cx, y: E.H * V(0.14, 0.15), size: V(96, 110), color: ui.gold, a: ease.out(prog(t, forty - 0.1, forty + 0.2)), pulse: t - forty });
  const dec = local(info, t, 'decades') ?? 3.4;
  text(g, 'FOR DECADES', cx, E.H * V(0.28, 0.27), { size: V(50, 58), font: 'Nunito', weight: 900, color: ui.cream, spacing: 6, alpha: ease.out(prog(t, dec, dec + 0.3)) });
} });

// c22: "So what is your time really worth?" a rooftop at dawn, you watch the sun come up
registerShot('c22', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.0 + 0.06 * ease.inOut(p), y: -20 * p };
  const { M, GY: gy } = rooftop(g, t, cam);
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(60, 40), y: gy - 60, s: V(1.3, 1.4), facing: 1, outfit: YOU, pose: breathe(POSES.relaxed, t), expr: 'neutral', rim: { color: M.rim, dir: [0.3, -1], w: 6 } }));
  FX.dust(g, t, { count: 60, color: '#ffe0b0', a: 0.4 });
  FX.lensStreak(g, E.W * 0.55, E.H * V(0.55, 0.58), E.W * 1.6, '#ffd8a0', 0.3);
} });

// c23: end screen
registerShot('c23', { draw(g, t, info) {
  UI.endScreen(g, t, { question: 'What would you stop buying?', cast: CAST, moodColors: ['#06080c', '#0e1a22', '#3a2416'], rim: '#ffb760' });
  text(g, 'IF EVERYTHING COST TIME', E.W / 2, E.H * V(0.36, 0.36), { size: V(40, 46), font: 'Nunito', weight: 900, color: '#ffc15a', alpha: ease.out(prog(t, 0.8, 1.2)), glow: 12, spacing: 3 });
  wrist(g, E.W / 2, E.H * V(0.46, 0.46), V(0.9, 1.0), fmtLife(40 * YEAR - t), { color: '#ffc15a', a: ease.out(prog(t, 1.2, 1.6)) });
} });
