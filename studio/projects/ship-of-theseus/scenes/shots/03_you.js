// shots/03_you.js: the turn to "you", the cells, the mirror, the end screen.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, wordTime, seg, circle, rr, glow, alpha, shade, mix, linGrad, text, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { RANK, N, OLD, NEW } from '../sets/ship.js';
import { bedroom, GY } from '../sets/places.js';
import { YOU, YOU_KID, CAST } from '../cast.js';

const local = (info, t, word) => { const w = wordTime(word, info.globalT - t - 0.3); return w == null ? 0 : w - (info.globalT - t); };

function mirror(g, x, y, w, h, M, inside) {
  rr(g, x - w / 2 - 16, y - h - 16, w + 32, h + 32, 24); g.fillStyle = '#1a1420'; g.fill();
  g.save(); rr(g, x - w / 2, y - h, w, h, 16); g.clip();
  g.fillStyle = linGrad(g, 0, y - h, 0, y, [shade(M.wall, -0.1), shade(M.wall, -0.5)]); g.fillRect(x - w / 2, y - h, w, h);
  inside(g);
  g.fillStyle = 'rgba(200,220,255,.07)'; g.beginPath(); g.moveTo(x - w / 2, y - h); g.lineTo(x - w / 2 + w * 0.35, y - h); g.lineTo(x - w / 2, y - h + h * 0.45); g.fill();
  g.restore();
}

// s015: "Now think about you." you, in front of a mirror at night
registerShot('s015', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.06 + 0.06 * ease.inOut(p), x: -20 * p };
  const { M, GY: gy } = bedroom(g, t, cam);
  layer(g, cam, 1, (g) => {
    const mx = E.W / 2 + V(260, 200);
    mirror(g, mx, gy - 20, V(300, 330), V(560, 600), M, (g) => drawFigure(g, { x: mx, y: gy - 20, s: V(1.4, 1.5), facing: -1, outfit: YOU, pose: breathe(POSES.stand, t), expr: 'thinking', rim: { color: M.practical, dir: [1, -0.4], w: 3 }, dim: 0.25 }));
    drawFigure(g, { x: E.W / 2 - V(200, 170), y: gy, s: V(1.7, 1.8), facing: 1, outfit: YOU, pose: breathe(POSES.stand, t), expr: 'thinking', rim: { color: M.practical, dir: [1, -0.4], w: 4 }, blink: (t % 3.0) > 2.9 });
  });
  FX.dust(g, t, { count: 30, color: '#cfd8ff', a: 0.25 });
} });

// s016: "Your body replaces many of its cells over the years." blueprint body, cells swap
registerShot('s016', { draw(g, t, info) {
  const ui = S().ui, p = t / info.dur;
  UI.blueprint(g);
  const cx = E.W / 2, cy = E.H * V(0.62, 0.55), s = V(2.2, 2.6);
  UI.lineFigure(g, { x: cx, y: cy + 230 * s * 0.5, s, pose: POSES.stand, color: ui.blueprint });
  const c0 = local(info, t, 'cells') - 0.6, done = 40 * ease.inOut(prog(t, c0, info.dur - 0.3));
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2 - Math.PI / 2, r = V(330, 380) + Math.sin(i * 1.7 + t) * 10;
    const k = clamp(done - RANK[i % N] * (40 / N));
    const x = cx + Math.cos(a) * r, y = cy - 60 + Math.sin(a) * r * 1.15;
    circle(g, x, y, V(16, 18) + Math.sin(k * Math.PI) * 8, mix(shade(ui.bpBg, 0.25), ui.gold, k));
    if (k > 0.1 && k < 0.9) glow(g, x, y, 60, ui.gold, 0.5);
  }
  text(g, 'CELLS', E.W / 2, E.H * V(0.12, 0.17), { size: V(64, 76), font: 'Nunito', weight: 900, color: ui.gold, glow: 18, alpha: ease.out(prog(t, c0, c0 + 0.4)), spacing: 6 });
  text(g, 'OLD', cx - V(500, 300), E.H * V(0.9, 0.74), { size: V(30, 34), font: 'Nunito', weight: 900, color: shade(ui.bpBg, 0.45) });
  text(g, 'NEW', cx + V(500, 300), E.H * V(0.9, 0.74), { size: V(30, 34), font: 'Nunito', weight: 900, color: ui.gold });
  void p;
} });

// s017: "Your opinions and your memories change too." giant face, thought bubbles swap colours
registerShot('s017', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.5, x: 120, y: -200 })); veil(g, '#0a0a14', 0.35);
  const M = mood('night'), r = V(290, 310);
  bigFace(g, E.W / 2, E.H * V(0.66, 0.6), r, { outfit: YOU, expr: 'thinking', look: [0.3, -0.6], rimColor: M.practical, rimSide: 1, blink: (t % 3.2) > 3.1 });
  const ops = local(info, t, 'opinions'), mem = local(info, t, 'memories');
  const items = [[-0.26, 0.24, ops, 'OPINIONS'], [0.26, 0.17, mem, 'MEMORIES']];
  for (const [dx, yy, at, label] of items) {
    const a = ease.outBack(prog(t, at, at + 0.4)); if (a <= 0) continue;
    const x = E.W / 2 + dx * E.W, y = E.H * yy, k = (Math.sin((t - at) * 3) + 1) / 2;
    g.save(); g.translate(x, y); g.scale(a, a);
    UI.bubble(g, 0, 0, { w: V(240, 300), h: V(130, 150), color: mix('#5a4a70', '#f2c21a', k) });
    text(g, label, 0, V(110, 125), { size: V(30, 36), font: 'Nunito', weight: 900, color: S().ui.cream, spacing: 3 });
    g.restore();
  }
} });

// s018: "So are you the same person you were ten years ago?" the mirror shows you as a kid
registerShot('s018', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.1 + 0.1 * ease.inOut(p), x: V(120, 90) * ease.inOut(p) };
  const { M, GY: gy } = bedroom(g, t, cam);
  const ten = local(info, t, 'ten'), k = ease.inOut(prog(t, ten - 0.6, ten + 0.4));
  layer(g, cam, 1, (g) => {
    const mx = E.W / 2 + V(260, 200);
    mirror(g, mx, gy - 20, V(300, 330), V(560, 600), M, (g) => {
      g.save(); g.globalAlpha = 1 - k; drawFigure(g, { x: mx, y: gy - 20, s: V(1.4, 1.5), facing: -1, outfit: YOU, pose: breathe(POSES.stand, t), expr: 'thinking', rim: { color: M.practical, dir: [1, -0.4], w: 3 }, dim: 0.25 }); g.restore();
      g.save(); g.globalAlpha = k; drawFigure(g, { x: mx, y: gy - 20, s: V(1.4, 1.5), facing: -1, outfit: YOU_KID, pose: breathe(posesAt(t, [[0, POSES.stand], [ten + 0.6, POSES.wave]]), t), expr: 'happy', rim: { color: M.practical, dir: [1, -0.4], w: 3 } }); g.restore();
      glow(g, mx, gy - 300, 300, '#cfd8ff', 0.25 * Math.sin(k * Math.PI));
    });
    drawFigure(g, { x: E.W / 2 - V(200, 170), y: gy, s: V(1.7, 1.8), facing: 1, outfit: YOU, pose: breathe(POSES.stand, t), expr: k > 0.5 ? 'surprised' : 'thinking', rim: { color: M.practical, dir: [1, -0.4], w: 4 } });
  });
  UI.readout(g, { label: 'MIRROR:', value: '10 YEARS AGO', x: E.W / 2, y: E.H * V(0.13, 0.2), align: 'center', a: ease.out(prog(t, ten, ten + 0.4)) });
  FX.dust(g, t, { count: 30, color: '#cfd8ff', a: 0.25 });
} });

// s019: end screen
registerShot('s019', { draw(g, t, info) {
  UI.endScreen(g, t, { question: 'Same ship, or new ship?', cast: CAST });
  text(g, 'TELL ME IN THE COMMENTS', E.W / 2, E.H * V(0.42, 0.42), { size: V(40, 46), font: 'Nunito', weight: 900, color: S().ui.gold, alpha: ease.out(prog(t, 1.6, 2.0)), glow: 14, spacing: 3 });
} });
