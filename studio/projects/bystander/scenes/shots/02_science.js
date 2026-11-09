// shots/02_science.js: 2D shots: darting eyes, thought bubbles, the 1968 experiment, the split responsibility, the shout.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, wordTime, seg, circle, rr, glow, alpha, shade, mix, text, rng, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { word, thought, lab, booth, GY } from '../sets/cine.js';
import { stat } from '../sets/stat.js';
import { FALLEN, RED, COMMUTER, STUDENT, DARLEY, LATANE } from '../cast.js';

const local = (info, t, w) => { const x = wordTime(w, info.globalT - t - 0.3); return x == null ? null : x - (info.globalT - t); };
const rimOf = (M, dir = [0.4, -1]) => ({ color: M.rim, dir, w: 5 });
const subwayBg = (g) => { g.fillStyle = '#0c1218'; g.fillRect(0, 0, E.W, E.H); for (let i = 0; i < 6; i++) glow(g, (i * 271) % E.W, E.H * (0.2 + (i % 3) * 0.25), 300, i % 2 ? '#ffd8a0' : '#9fe0ff', 0.12); };

// b04: "Everyone looks around, and everyone sees the same thing." 2x2 grid of faces, eyes darting
registerShot('b04', { draw(g, t, info) {
  subwayBg(g);
  const M = mood('night'), outfits = [COMMUTER[0], RED, COMMUTER[4], COMMUTER[2]];
  outfits.forEach((of, i) => {
    const cx = E.W * (i % 2 ? 0.75 : 0.25), cy = E.H * (Math.floor(i / 2) ? 0.62 : 0.36), k = ease.outBack(prog(t, i * 0.12, i * 0.12 + 0.35)); if (k <= 0) return;
    g.save(); g.beginPath(); g.rect(cx - E.W * 0.245, cy - E.H * 0.13, E.W * 0.49, E.H * 0.26); g.clip(); g.fillStyle = '#141c24'; g.fillRect(0, 0, E.W, E.H);
    const lx = Math.sin(t * 3.2 + i * 1.7) > 0 ? 0.9 : -0.9;
    bigFace(g, cx, cy + E.H * 0.06, V(180, 200) * k, { outfit: of, expr: 'nervous', look: [lx, 0], rimColor: M.rim, rimSide: i % 2 ? 1 : -1, blink: ((t + i) % 2.4) > 2.3 });
    g.restore(); g.strokeStyle = 'rgba(255,255,255,.15)'; g.lineWidth = 4; g.strokeRect(cx - E.W * 0.245, cy - E.H * 0.13, E.W * 0.49, E.H * 0.26);
  });
  const s2 = local(info, t, 'same') ?? 2.4; word(g, 'EVERYONE CHECKS EVERYONE', E.H * V(0.14, 0.15), ease.out(prog(t, 0.3, 0.6)), { size: V(62, 70) });
} });

// b06: "Someone else will help. Someone else has probably called already." a sea of thought bubbles
registerShot('b06', { draw(g, t, info) {
  const cam = { z: 1.05 + 0.05 * t / info.dur };
  blurLayer(g, 10, (g) => { subwayBg(g); });
  const M = mood('night'), gy = GY();
  layer(g, cam, 1, (g) => { for (let i = 0; i < 9; i++) { const x = E.W * (0.08 + i * 0.105), y = gy + (i % 2) * 40; drawFigure(g, { x, y, s: V(1.0, 1.1), facing: i % 2 ? -1 : 1, outfit: i === 4 ? RED : COMMUTER[i % 5], pose: breathe(i % 3 ? POSES.stand : POSES.phone, t, 1, i), expr: 'neutral', rim: rimOf(M), blink: ((t + i) % 3) > 2.9 }); } });
  const lines = ['SOMEONE ELSE WILL HELP', 'NOT MY BUSINESS', "SOMEONE'S CALLED", 'THEY KNOW BETTER', 'IT LOOKS FINE', 'SOMEONE ELSE…'];
  lines.forEach((l, i) => thought(g, E.W * (0.27 + (i % 2) * 0.46), E.H * (0.22 + Math.floor(i / 2) * 0.12), l, ease.out(prog(t, 0.2 + i * 0.4, 0.45 + i * 0.4)), { size: V(30, 34) }));
} });

// b08: "In 1968, John Darley and Bibb Latané ran an experiment."
registerShot('b08', { draw(g, t, info) {
  const cam = { z: 1.05 + 0.06 * ease.inOut(t / info.dur) };
  const { M, GY: gy } = lab(g, t, cam);
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W / 2 - V(200, 160), y: gy, s: V(1.6, 1.7), facing: 1, outfit: DARLEY, pose: breathe(POSES.explain, t), expr: 'smile', rim: rimOf(M) }); drawFigure(g, { x: E.W / 2 + V(200, 160), y: gy, s: V(1.6, 1.7), facing: -1, outfit: LATANE, pose: breathe(POSES.holdFront, t, 1, 2), prop: 'tablet', expr: 'thinking', rim: rimOf(M, [-0.4, -1]) }); });
  const d = local(info, t, 'darley') ?? 1.4, l = local(info, t, 'latan') ?? 2.4;
  stat(g, { label: 'THE EXPERIMENT', value: '1968', x: E.W / 2, y: E.H * V(0.15, 0.16), size: V(140, 160), color: '#ffc15a', a: ease.out(prog(t, 0, 0.3)), pulse: t });
  text(g, 'JOHN DARLEY', E.W / 2 - V(200, 160), gy + V(70, 80), { size: V(30, 34), font: 'Nunito', weight: 900, color: '#e8f4f8', alpha: ease.out(prog(t, d, d + 0.3)), stroke: 6, strokeColor: 'rgba(0,0,0,.5)' });
  text(g, 'BIBB LATANÉ', E.W / 2 + V(200, 160), gy + V(70, 80), { size: V(30, 34), font: 'Nunito', weight: 900, color: '#e8f4f8', alpha: ease.out(prog(t, l, l + 0.3)), stroke: 6, strokeColor: 'rgba(0,0,0,.5)' });
} });

// b09: "A student heard someone having a seizure over an intercom." a booth, a crackling speaker
registerShot('b09', { draw(g, t, info) {
  const cam = { z: 1.2 + 0.06 * t / info.dur };
  const { M, GY: gy } = lab(g, t, cam);
  layer(g, cam, 1, (g) => { booth(g, E.W / 2, gy, V(1.6, 1.7), { lit: 1 }); drawFigure(g, { x: E.W / 2 - V(40, 30), y: gy, s: V(1.5, 1.6), facing: 1, outfit: STUDENT, pose: breathe(POSES.sit, t), expr: t > 1.2 ? 'scared' : 'neutral', look: [1, -0.5], rim: rimOf(M) }); });
  const sz = local(info, t, 'seizure') ?? 1.4;
  if (t > sz - 0.3) { const sx = E.W / 2 + V(150, 150), sy = gy - V(500, 520); FX.rings(g, sx, sy, t, { count: 4, r0: 30, r1: 240, color: '#ff5a3c', a: 0.6, speed: 2 }); }
  word(g, 'A SEIZURE… OVER AN INTERCOM', E.H * V(0.15, 0.16), ease.out(prog(t, sz - 0.2, sz + 0.1)), { size: V(56, 64), color: '#ff9a7a' });
} });

// b10: "When people thought they were alone, most of them ran to help." the student bursts out of the booth
registerShot('b10', { draw(g, t, info) {
  const cam = { z: 1.1 };
  const { M, GY: gy } = lab(g, t, cam);
  const run = local(info, t, 'ran') ?? 1.8, k = ease.in(prog(t, run - 0.4, run + 0.8));
  layer(g, cam, 1, (g) => { booth(g, E.W * 0.35, gy, V(1.5, 1.6), { lit: 1, label: 'ALONE' }); drawFigure(g, { x: lerp(E.W * 0.35, E.W * 1.1, k), y: gy, s: V(1.5, 1.6), facing: 1, outfit: STUDENT, pose: k > 0 ? walkPose(t * 2 * Math.PI * 1.6, { run: true }) : breathe(POSES.sit, t), expr: 'determined', rim: rimOf(M), trail: k > 0.1 ? { count: 3, dx: -40 } : null }); });
  stat(g, { label: 'BELIEVED THEY WERE ALONE', value: '85% HELPED', x: E.W / 2, y: E.H * V(0.15, 0.16), size: V(110, 126), color: '#9fe8c8', a: ease.out(prog(t, run - 0.3, run)), pulse: t - run + 0.3 });
} });

// b11: "When they thought four others could hear it too, far fewer did, and they were slower."
registerShot('b11', { draw(g, t, info) {
  const cam = { z: 1.0 };
  const { M, GY: gy } = lab(g, t, cam);
  layer(g, cam, 1, (g) => { for (let i = 0; i < 5; i++) { const x = E.W * (0.1 + i * 0.2); booth(g, x, gy, V(0.62, 0.7), { lit: 0.5 }); drawFigure(g, { x: x - 10, y: gy, s: V(0.62, 0.7), facing: 1, outfit: i === 2 ? STUDENT : { top: 'tshirt', color: '#6a7a84', head: 'none' }, pose: breathe(POSES.sit, t, 1, i), expr: 'worried', look: [((t * 2 + i) % 2 > 1 ? 1 : -1), 0], rim: rimOf(M) }); } });
  const ff = local(info, t, 'fewer') ?? 2.0, sl = local(info, t, 'slower') ?? 3.6;
  // comparison bars
  const y0 = E.H * V(0.16, 0.17), bw = E.W * 0.8;
  [['ALONE', 0.85, '#9fe8c8', 0], ['WITH 4 OTHERS', 0.31, '#ff7a5a', ff - 0.3]].forEach(([lab2, v, col, at], i) => {
    const k = ease.out(prog(t, at, at + 0.6)), y = y0 + i * V(150, 170);
    text(g, lab2, E.W * 0.1, y - V(48, 54), { size: V(32, 38), font: 'Nunito', weight: 900, color: '#e8f4f8', align: 'left', spacing: 2, stroke: 6, strokeColor: 'rgba(0,0,0,.5)' });
    rr(g, E.W * 0.1, y - 28, bw, 56, 28); g.fillStyle = 'rgba(6,10,14,.6)'; g.fill(); if (k > 0) { rr(g, E.W * 0.1, y - 28, bw * v * k, 56, 28); g.fillStyle = col; g.fill(); }
    text(g, Math.round(v * 100 * k) + '%', E.W * 0.1 + bw * v * k + 70, y + 2, { size: V(40, 46), font: 'Nunito', weight: 900, color: col });
  });
  word(g, 'AND SLOWER', E.H * V(0.42, 0.4), ease.out(prog(t, sl - 0.1, sl + 0.2)), { size: V(66, 76), color: '#ff9a7a' });
} });

// b12: "The responsibility gets split between everyone watching, until each person feels almost none of it." the pie splits
registerShot('b12', { draw(g, t, info) {
  const ui = S().ui; UI.blueprint(g);
  const n = t < 1.6 ? 1 : t < 2.8 ? 5 : t < 4.0 ? 12 : 40, cx = E.W / 2, cy = E.H * V(0.55, 0.5), r = V(330, 360);
  for (let i = 0; i < n; i++) { const a0 = (i / n) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2, gap = n > 1 ? 0.04 + 0.08 * ease.out(prog(t % 1.2, 0, 0.4)) : 0, mid = (a0 + a1) / 2;
    g.fillStyle = i === 0 ? '#ffc15a' : alpha(ui.blueprint, 0.35); g.beginPath(); g.moveTo(cx + Math.cos(mid) * gap * 200, cy + Math.sin(mid) * gap * 200); g.arc(cx + Math.cos(mid) * gap * 200, cy + Math.sin(mid) * gap * 200, r, a0, a1); g.closePath(); g.fill(); }
  const pct = Math.round(100 / n) + '%'; stat(g, { label: n === 1 ? 'ALONE, YOUR SHARE FEELS LIKE' : `WITH ${n} PEOPLE, IT FEELS LIKE`, value: n === 40 ? '~2%' : pct, x: cx, y: E.H * V(0.15, 0.16), size: V(120, 140), color: '#ffc15a', pulse: t - [0, 1.6, 2.8, 4.0][[1, 5, 12, 40].indexOf(n)] });
  word(g, 'DIFFUSION OF RESPONSIBILITY', E.H * V(0.3, 0.29), ease.out(prog(t, 0.5, 0.9)), { size: V(52, 60) });
} });

// b16: "So if you ever need help, don't shout at the crowd." his "HELP!" dissolves into the crowd noise
registerShot('b16', { draw(g, t, info) {
  g.fillStyle = '#0a0e14'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.5, 800, '#ffd8a0', 0.15);
  const M = mood('night');
  bigFace(g, E.W / 2, E.H * V(0.66, 0.62), V(300, 320), { outfit: FALLEN, expr: 'scared', talk: 0.6 + 0.4 * Math.sin(t * 14), rimColor: '#ffd8a0', rimSide: -1 });
  const k = ease.out(prog(t, 0.2, 0.6)), fade = prog(t, 1.2, 2.4);
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.5, d = 260 + fade * 420; text(g, 'HELP!', E.W / 2 + Math.cos(a) * d, E.H * 0.5 + Math.sin(a) * d * 0.9, { size: V(56, 64) * (1 - fade * 0.4), color: '#fff1dc', alpha: k * (1 - fade), weight: 700 }); }
  const cr = local(info, t, 'crowd') ?? 1.9; word(g, "DON'T SHOUT AT THE CROWD", E.H * V(0.15, 0.16), ease.out(prog(t, cr - 0.2, cr + 0.1)), { size: V(62, 70), color: '#ff9a7a' });
} });
