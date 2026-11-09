// shots/02_science.js: the 1999 study, the result, the brain's filter, real life, and the end.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, wordTime, seg, circle, ring, rr, glow, alpha, shade, mix, text, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { stat } from '../sets/stat.js';
import { gym, lab, road, car, motorcycle, gorilla, ball, passTest, GY } from '../sets/gym.js';
import { bedroom } from '../sets/places.js';
import { YOU, SIMONS, CHABRIS, SUBJECT, DRIVER, CAST } from '../cast.js';

const local = (info, t, word) => { const w = wordTime(word, info.globalT - t - 0.3); return w == null ? null : w - (info.globalT - t); };
const rimOf = (M, dir = [0.4, -1]) => ({ color: M.rim, dir, w: 4 });
const label = (g, str, x, y, a = 1, color = S().ui.cream) => text(g, str, x, y, { size: V(34, 40), font: 'Nunito', weight: 900, color, alpha: a, spacing: 3, stroke: 6, strokeColor: 'rgba(0,0,0,.55)' });

// g08: "In 1999," stat over the lab
registerShot('g08', { draw(g, t, info) {
  blurLayer(g, 12, (g) => lab(g, t, { z: 1.3 })); veil(g, '#0c0a14', 0.3);
  stat(g, { label: 'HARVARD UNIVERSITY', value: '1999', x: E.W / 2, y: E.H * V(0.42, 0.42), size: V(170, 200), pulse: t - 0.1, a: ease.out(prog(t, 0, 0.25)) });
} });

// g09: "two psychologists at Harvard, Daniel Simons and Christopher Chabris,"
registerShot('g09', { draw(g, t, info) {
  const cam = { z: 1.04 + 0.06 * ease.inOut(t / info.dur), x: 20 * t / info.dur };
  const { M, GY: gy } = lab(g, t, cam);
  const ds = local(info, t, 'daniel') ?? 1.3, cc = local(info, t, 'christopher') ?? 2.8;
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 - V(220, 170), y: gy, s: V(1.6, 1.7), facing: 1, outfit: SIMONS, pose: breathe(posesAt(t, [[0, POSES.stand], [ds, POSES.wave], [ds + 1, POSES.explain]]), t), expr: 'smile', rim: rimOf(M), blink: (t % 3.2) > 3.1 });
    drawFigure(g, { x: E.W / 2 + V(220, 170), y: gy, s: V(1.6, 1.7), facing: -1, outfit: CHABRIS, pose: breathe(posesAt(t, [[0, POSES.crossArms], [cc, POSES.wave], [cc + 1, POSES.crossArms]]), t, 1, 3), expr: 'smile', rim: rimOf(M, [-0.4, -1]), blink: (t % 2.8) > 2.7 });
  });
  label(g, 'DANIEL SIMONS', E.W / 2 - V(220, 170), gy + V(70, 80), ease.out(prog(t, ds, ds + 0.3)));
  label(g, 'CHRISTOPHER CHABRIS', E.W / 2 + V(220, 170), gy + V(70, 80) + V(0, 50), ease.out(prog(t, cc, cc + 0.3)));
  text(g, '2 PSYCHOLOGISTS', E.W / 2, E.H * V(0.14, 0.16), { size: V(76, 88), color: S().ui.gold, glow: 18, stroke: 8, strokeColor: 'rgba(0,0,0,.5)', alpha: ease.out(prog(t, 0.1, 0.4)) });
} });

// g10: "showed people a video just like this." OTS: a volunteer watches the passing video on a monitor
registerShot('g10', { draw(g, t, info) {
  const cam = { z: 1.1 + 0.08 * ease.inOut(t / info.dur) };
  const { M, GY: gy } = lab(g, t, cam);
  layer(g, cam, 1, (g) => {
    const sw = V(820, 760), sh = sw * 0.6, sx = E.W / 2 - sw / 2, sy = gy - V(620, 760);
    FX.screen(g, { x: sx, y: sy, w: sw, h: sh, bg: '#1e2a3a', glowC: '#cfe8ff', a: 0.3 }, (g) => {
      g.save(); g.translate(sx, sy); g.scale(sw / E.W, sh / (E.H * 0.42)); g.translate(0, -E.H * 0.42);
      gym(g, t + 4, { z: 1 }); passTest(g, 1.0 + t, { z: 1 }, { M });
      g.restore();
    });
    seg(g, [[E.W / 2, sy + sh + 8], [E.W / 2, gy - 120]], 18, '#1a1622'); rr(g, E.W / 2 - 120, gy - 130, 240, 20, 8); g.fillStyle = '#1a1622'; g.fill();
  });
  blurLayer(g, 4, (g) => drawFigure(g, { x: E.W / 2 - V(40, 30), y: E.H * 1.02, s: V(3.0, 3.2), facing: 1, outfit: SUBJECT, pose: POSES.stand, expr: 'determined', rim: rimOf(M, [0.4, -1]) }));
} });

// g11: "About half of them never saw the gorilla." ten volunteers, half get a red X
registerShot('g11', { draw(g, t, info) {
  const ui = S().ui;
  UI.blueprint(g);
  const n = 10, cols = 5;
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols), x = E.W / 2 + (c - 2) * V(170, 190), y = E.H * V(0.48, 0.42) + r * V(330, 380);
    const k = ease.outBack(prog(t, i * 0.05, i * 0.05 + 0.3)), missed = [0, 2, 3, 6, 9].includes(i), m = ease.out(prog(t, 0.9 + i * 0.06, 1.2 + i * 0.06));
    g.save(); g.translate(x, y); g.scale(k, k);
    UI.lineFigure(g, { x: 0, y: 0, s: V(0.9, 1.0), pose: POSES.stand, color: m > 0 ? (missed ? ui.accent : ui.good) : ui.blueprint });
    if (m > 0) text(g, missed ? '✗' : '✓', 0, -V(270, 300), { size: V(70, 80) * m, color: missed ? ui.accent : ui.good, weight: 900, font: 'Nunito' });
    g.restore();
  }
  stat(g, { label: 'NEVER SAW THE GORILLA', value: 'ABOUT HALF', x: E.W / 2, y: E.H * V(0.13, 0.15), size: V(110, 124), color: ui.accent, a: ease.out(prog(t, 0.9, 1.2)), pulse: t - 0.9 });
} });

// g12: "Not because they weren't looking." wide-open eyes
registerShot('g12', { draw(g, t, info) {
  blurLayer(g, 14, (g) => lab(g, t, { z: 1.5, y: -150 })); veil(g, '#0c0a14', 0.35);
  const M = mood('golden');
  bigFace(g, E.W / 2, E.H * V(0.6, 0.55), V(310, 330) * (1 + 0.06 * t), { outfit: SUBJECT, expr: 'surprised', look: [0, -0.1], rimColor: M.rim, rimSide: -1 });
} });

// g13: "Because they were looking too hard." tunnel vision
registerShot('g13', { draw(g, t, info) {
  blurLayer(g, 14, (g) => lab(g, t, { z: 1.5, y: -150 })); veil(g, '#0c0a14', 0.35);
  const M = mood('golden'), k = ease.inOut(prog(t, 0.2, 1.2));
  bigFace(g, E.W / 2, E.H * V(0.6, 0.55), V(330, 350) * (1 + 0.12 * k), { outfit: SUBJECT, expr: 'determined', look: [0, 0], rimColor: M.rim, rimSide: -1 });
  // tunnel: darkness closes in to a small circle
  g.save(); g.fillStyle = alpha('#05040a', 0.85 * k); g.beginPath(); g.rect(-E.W, -E.H, E.W * 3, E.H * 3); g.arc(E.W / 2, E.H * V(0.56, 0.52), lerp(E.H, V(380, 420), k), 0, Math.PI * 2, true); g.fill('evenodd'); g.restore();
  FX.rings(g, E.W / 2, E.H * V(0.56, 0.52), t, { count: 3, r0: 420, r1: 120, color: '#ffffff', a: 0.25 * k });
  if (k > 0.5) text(g, 'FOCUS', E.W / 2, E.H * V(0.16, 0.18), { size: V(96, 110), color: S().ui.gold, glow: 20, alpha: ease.out(prog(t, 0.8, 1.1)), stroke: 8, strokeColor: 'rgba(0,0,0,.5)' });
} });

// g14: "Your brain can't handle everything your eyes see," blueprint eye flooded with stuff
registerShot('g14', { draw(g, t, info) {
  const ui = S().ui; UI.blueprint(g);
  const ex = E.W / 2, ey = E.H * V(0.62, 0.6);
  g.strokeStyle = ui.blueprint; g.lineWidth = 7; g.beginPath(); g.ellipse(ex, ey, V(180, 200), V(100, 110), 0, 0, 7); g.stroke(); circle(g, ex, ey, V(60, 68), ui.blueprint); circle(g, ex, ey, V(26, 30), ui.bpBg);
  const items = 26;
  for (let i = 0; i < items; i++) {
    const a = (i / items) * Math.PI * 2, phase = ((t * 0.8 + i * 0.137) % 1), r = lerp(V(760, 820), V(200, 220), phase);
    const x = ex + Math.cos(a) * r, y = ey + Math.sin(a) * r * 0.9;
    g.save(); g.globalAlpha = Math.min(1, phase * 3) * (1 - phase * 0.6);
    if (i % 5 === 0) ball(g, x, y, 20); else if (i % 5 === 1) gorilla(g, { x, y: y + 30, s: 0.25, t, mode: 'stand', facing: 0 }); else if (i % 5 === 2) { rr(g, x - 26, y - 16, 52, 32, 8); g.fillStyle = ui.gold; g.fill(); } else if (i % 5 === 3) circle(g, x, y, 18, ui.accent); else { g.strokeStyle = ui.text; g.lineWidth = 5; g.beginPath(); g.moveTo(x - 20, y); g.lineTo(x + 20, y); g.moveTo(x, y - 20); g.lineTo(x, y + 20); g.stroke(); }
    g.restore();
  }
  // overload meter
  const lv = ease.inOut(prog(t, 0.2, info.dur - 0.3));
  rr(g, E.W * 0.15, E.H * V(0.2, 0.24), E.W * 0.7, V(40, 46), 20); g.fillStyle = 'rgba(255,255,255,.12)'; g.fill();
  rr(g, E.W * 0.15, E.H * V(0.2, 0.24), E.W * 0.7 * lv, V(40, 46), 20); g.fillStyle = lv > 0.75 ? ui.accent : ui.gold; g.fill();
  text(g, 'BRAIN LOAD', E.W / 2, E.H * V(0.16, 0.2), { size: V(44, 50), font: 'Nunito', weight: 900, color: ui.cream, spacing: 4 });
  if (lv > 0.85) text(g, 'OVERLOAD!', E.W / 2, E.H * V(0.27, 0.3), { size: V(70, 80), color: ui.accent, glow: 18, alpha: 0.6 + 0.4 * Math.sin(t * 20) });
} });

// g15: "so it quietly throws away whatever doesn't matter for the task." the filter: balls pass, the gorilla gets binned
registerShot('g15', { draw(g, t, info) {
  const ui = S().ui; UI.blueprint(g);
  const fx = E.W / 2, fy = E.H * V(0.45, 0.42);
  // funnel / filter
  g.strokeStyle = ui.blueprint; g.lineWidth = 8; g.beginPath(); g.moveTo(fx - V(330, 360), fy - V(260, 300)); g.lineTo(fx - 70, fy); g.lineTo(fx - 70, fy + 140); g.moveTo(fx + V(330, 360), fy - V(260, 300)); g.lineTo(fx + 70, fy); g.lineTo(fx + 70, fy + 140); g.stroke();
  text(g, 'ATTENTION FILTER', fx, fy - V(330, 370), { size: V(40, 46), font: 'Nunito', weight: 900, color: ui.cream, spacing: 4 });
  // the brain at the bottom
  const by = E.H * V(0.74, 0.66); g.fillStyle = mix('#f29ac0', ui.bpBg, 0.2); g.beginPath(); g.ellipse(fx, by, V(170, 190), V(110, 120), 0, 0, 7); g.fill();
  g.strokeStyle = shade('#f29ac0', -0.35); g.lineWidth = 5; for (let i = -2; i <= 2; i++) { g.beginPath(); g.arc(fx + i * 60, by, 50, 0.3, 2.6); g.stroke(); }
  // balls fall through into the brain
  for (let i = 0; i < 5; i++) { const p = ((t * 0.9 + i * 0.2) % 1); ball(g, fx + Math.sin(i * 2) * lerp(260, 0, Math.min(1, p * 1.6)), lerp(fy - 300, by - 40, p), 22); }
  // the gorilla is bounced out sideways into the trash
  const thr = local(info, t, 'throws') ?? 1.0, p = ease.inOut(prog(t, thr - 0.2, thr + 0.9));
  const gx = lerp(fx, E.W * 0.84, p), gy2 = lerp(fy - 60, E.H * V(0.72, 0.64), p) - Math.sin(p * Math.PI) * 260;
  rr(g, E.W * 0.84 - 80, E.H * V(0.7, 0.62), 160, 180, 16); g.fillStyle = '#4a5a6a'; g.fill(); g.fillStyle = '#6a7a8a'; g.fillRect(E.W * 0.84 - 95, E.H * V(0.7, 0.62) - 14, 190, 20);
  gorilla(g, { x: gx, y: gy2, s: 0.55, t, mode: 'stand', facing: 0 });
  if (p > 0.95) label(g, 'NOT IMPORTANT', E.W * 0.7, E.H * V(0.86, 0.75), 1, ui.accent);
} });

// g16: "Scientists call it inattentional blindness."
registerShot('g16', { draw(g, t, info) {
  blurLayer(g, 10, (g) => gym(g, t, { z: 1.2 })); veil(g, '#0c0a14', 0.55);
  const M = mood('golden'), k = 1 - ease.inOut(prog(t, 0.2, 1.4));
  gorilla(g, { x: E.W / 2, y: E.H * V(0.86, 0.74), s: V(1.4, 1.6), t, mode: 'stand', facing: 0, rim: M.rim, alpha: 0.1 + 0.8 * k });
  UI.titleCard(g, t, { lines: ['INATTENTIONAL', 'BLINDNESS'], dur: info.dur + 0.5, y: E.H * V(0.3, 0.28) });
} });

// g17: "And it's not just a party trick." you shrug, party balloons deflate
registerShot('g17', { draw(g, t, info) {
  const cam = { z: 1.08 + 0.05 * t / info.dur };
  const { M, GY: gy } = gym(g, t, cam);
  layer(g, cam, 1, (g) => {
    const drop = ease.in(prog(t, 0.5, 1.6));
    [['#d64a33', -0.3], ['#f2c21a', 0], ['#3fb950', 0.3]].forEach(([c, dx], i) => { const bx = E.W / 2 + dx * E.W + V(200, 120), byy = lerp(gy - V(620, 760), gy - 40, drop) + Math.sin(t * 3 + i) * 10; seg(g, [[bx, byy + 50], [bx + 10, byy + 200]], 3, '#2a2230'); g.fillStyle = c; g.beginPath(); g.ellipse(bx, byy, 46 * (1 - drop * 0.4), 58 * (1 - drop * 0.5), 0, 0, 7); g.fill(); });
    drawFigure(g, { x: E.W / 2 - V(160, 120), y: gy + V(40, 60), s: V(1.8, 1.9), facing: 1, outfit: YOU, pose: breathe(posesAt(t, [[0, POSES.cheer], [0.5, POSES.shrug]]), t), expr: t > 0.5 ? 'worried' : 'happy', rim: rimOf(M) });
  });
} });

// g18: "It's one reason drivers miss a motorcycle,"
registerShot('g18', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.06 * ease.inOut(t / info.dur) };
  const { M, GY: gy } = road(g, t, cam);
  const mt = local(info, t, 'motorcycle') ?? 1.0;
  layer(g, cam, 1, (g) => {
    const mx = lerp(-260, E.W * 0.36, ease.out(prog(t, 0, mt + 0.4)));
    motorcycle(g, mx, gy - V(60, 80), V(1.2, 1.3), t);
    car(g, E.W * 0.72 - ease.inOut(prog(t, 0.8, info.dur)) * V(120, 90), gy - V(20, 40), V(1.1, 1.2), '#3a6ea5', -1);
    // driver's eyes look the wrong way
    drawFigure(g, { x: E.W * 0.72 - ease.inOut(prog(t, 0.8, info.dur)) * V(120, 90) - V(10, 10), y: gy - V(120, 145), s: V(0.6, 0.65), facing: 1, outfit: DRIVER, pose: POSES.sit, expr: 'neutral', look: [1, 0], rim: rimOf(M), shadow: false });
  });
  if (t > mt) { FX.rings(g, E.W * 0.36, gy - V(200, 240), t - mt, { count: 3, r0: 60, r1: 260, color: S().ui.accent, a: 0.6 * (1 - prog(t, mt, mt + 1.2)) }); text(g, '!', E.W * 0.36, gy - V(380, 440), { size: V(120, 140), color: S().ui.accent, glow: 20, stroke: 8, strokeColor: 'rgba(0,0,0,.5)', alpha: ease.out(prog(t, mt, mt + 0.2)) }); }
} });

// g19: "and why you can't find the keys sitting right in front of you."
registerShot('g19', { draw(g, t, info) {
  const cam = { z: 1.06 + 0.06 * ease.inOut(t / info.dur), x: 30 };
  const { M, GY: gy } = bedroom(g, t, cam);
  const kt = local(info, t, 'keys') ?? 0.6;
  layer(g, cam, 1, (g) => {
    const tx = E.W / 2 + V(80, 40);
    rr(g, tx - 160, gy - 150, 320, 18, 6); g.fillStyle = '#3a2a2e'; g.fill(); seg(g, [[tx - 130, gy - 140], [tx - 130, gy]], 10, '#2a1e22'); seg(g, [[tx + 130, gy - 140], [tx + 130, gy]], 10, '#2a1e22');
    // keys
    const kx = tx + 20, ky = gy - 170; g.save(); g.translate(kx, ky); g.scale(2.2, 2.2); ring(g, 0, -10, 14, '#f2c21a', 5); seg(g, [[10, -4], [46, 2]], 8, '#d8d8e0'); seg(g, [[34, 2], [34, 12]], 5, '#d8d8e0'); seg(g, [[44, 2], [44, 10]], 5, '#d8d8e0'); g.restore();
    if (t > kt + 0.5) { glow(g, kx + 40, ky - 10, 160, S().ui.gold, 0.5); FX.rings(g, kx + 40, ky - 10, t, { count: 2, r0: 50, r1: 180, color: S().ui.gold, a: 0.6 }); }
    drawFigure(g, { x: E.W / 2 - V(220, 200), y: gy, s: V(1.7, 1.8), facing: 1, outfit: YOU, pose: breathe(posesAt(t, [[0, POSES.think], [kt, POSES.handsOnHead]]), t), expr: t > kt ? 'angry' : 'confused', look: [-1, -0.5], rim: { color: M.practical, dir: [1, -0.4], w: 4 } });
  });
  if (t > kt + 0.5) text(g, 'RIGHT THERE!', E.W / 2 + V(120, 60), E.H * V(0.4, 0.42), { size: V(56, 64), color: S().ui.gold, glow: 16, stroke: 8, strokeColor: 'rgba(0,0,0,.5)', alpha: ease.out(prog(t, kt + 0.5, kt + 0.8)) });
} });

// g20: "So what else are you missing right now?" the gorilla is standing right behind you
registerShot('g20', { draw(g, t, info) {
  const cam = { z: 1.06 + 0.1 * ease.inOut(t / info.dur) };
  const { M, GY: gy } = bedroom(g, t, cam);
  layer(g, cam, 1, (g) => {
    const rise = ease.out(prog(t, 0.6, 1.4));
    gorilla(g, { x: E.W / 2 + V(140, 110), y: gy + (1 - rise) * 120, s: V(1.6, 1.7), t, mode: t > 1.6 ? 'beat' : 'stand', facing: 0, rim: M.practical, alpha: rise });
    drawFigure(g, { x: E.W / 2 - V(140, 110), y: gy + V(30, 50), s: V(1.7, 1.8), facing: 1, outfit: YOU, pose: breathe(POSES.phone, t), prop: 'phone', expr: 'smile', look: [0.4, 0.6], rim: { color: M.practical, dir: [1, -0.4], w: 4 } });
  });
  FX.dust(g, t, { count: 30, color: '#cfd8ff', a: 0.25 });
} });

// g21: end screen
registerShot('g21', { draw(g, t, info) {
  UI.endScreen(g, t, { question: 'Did you see the gorilla?', cast: CAST });
  text(g, 'COMMENT YOUR COUNT', E.W / 2, E.H * V(0.42, 0.42), { size: V(46, 54), font: 'Nunito', weight: 900, color: S().ui.gold, alpha: ease.out(prog(t, 0.8, 1.2)), glow: 14, spacing: 3 });
  gorilla(g, { x: E.W * 0.82, y: E.H - V(170, 420) + 10, s: V(0.55, 0.65), t, mode: t > 1.5 ? 'beat' : 'stand', facing: 0, alpha: ease.out(prog(t, 1.0, 1.4)) });
} });
