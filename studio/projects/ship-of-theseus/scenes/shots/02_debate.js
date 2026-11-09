// shots/02_debate.js: Plutarch and the argument, Hobbes' twist, two ships.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, wordTime, seg, circle, rr, glow, alpha, shade, mix, text, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { drawShip, N, RANK } from '../sets/ship.js';
import { harbor, shipyard, colonnade, study, GY } from '../sets/places.js';
import { THESEUS, PLUTARCH, PHIL_A, PHIL_B, HOBBES } from '../cast.js';

const rimOf = (M, dir = [0, -1]) => ({ color: M.rim, dir, w: 4 });
const local = (info, t, word) => { const w = wordTime(word, info.globalT - t - 0.3); return w == null ? 0 : w - (info.globalT - t); };

// s008: "The writer Plutarch says philosophers argued about it."
registerShot('s008', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.04 + 0.06 * ease.inOut(p), x: V(-40, -30) + 60 * p };
  const { M, GY: gy } = colonnade(g, t, cam);
  const argue = local(info, t, 'philosophers');
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 - V(440, 300), y: gy, s: V(1.5, 1.6), facing: 1, outfit: PLUTARCH, pose: breathe(POSES.holdFront, t), prop: 'paper', expr: 'thinking', rim: rimOf(M, [1, -1]), blink: (t % 3.4) > 3.3 });
    const a = t > argue;
    drawFigure(g, { x: E.W / 2 + V(120, 80), y: gy, s: V(1.2, 1.3), facing: 1, outfit: PHIL_A, pose: breathe(a ? posesAt(t, [[argue, POSES.explain], [argue + 1.2, POSES.point], [argue + 2.2, POSES.explain]]) : POSES.stand, t), expr: a ? 'determined' : 'neutral', rim: rimOf(M) });
    drawFigure(g, { x: E.W / 2 + V(420, 300), y: gy, s: V(1.2, 1.3), facing: -1, outfit: PHIL_B, pose: breathe(a ? posesAt(t, [[argue, POSES.crossArms], [argue + 1.6, POSES.point]]) : POSES.stand, t, 1, 3), expr: a ? 'angry' : 'neutral', rim: rimOf(M), blink: (t % 2.9) > 2.8 });
    if (a) { FX.rings(g, E.W / 2 + V(140, 95), gy - V(250, 270), t, { count: 2, r0: 40, r1: 110, a: 0.35 }); FX.rings(g, E.W / 2 + V(400, 285), gy - V(250, 270), t + 0.4, { count: 2, r0: 40, r1: 110, a: 0.35 }); }
  });
  text(g, 'PLUTARCH', E.W / 2 - V(440, 300), gy + V(60, 70), { size: V(30, 34), font: 'Nunito', weight: 900, color: S().ui.cream, alpha: ease.out(prog(t, 0.6, 1.0)), spacing: 3 });
  FX.dust(g, t, { count: 50, color: '#ffe2bd', a: 0.4 });
} });

// s009: "Some said it was the same ship."
registerShot('s009', { draw(g, t, info) {
  blurLayer(g, 14, (g) => colonnade(g, t, { z: 1.6, x: -160, y: -160 })); veil(g, '#120a10', 0.35);
  const M = mood('golden'), r = V(300, 320) * (1 + 0.04 * t / info.dur);
  bigFace(g, E.W / 2, E.H * V(0.62, 0.56), r, { outfit: PHIL_A, expr: t > 0.5 ? 'happy' : 'smile', rimColor: M.rim, rimSide: -1, blink: (t % 2.7) > 2.6, tilt: Math.sin(t * 5) * 0.03 });
  const a = ease.outBack(prog(t, 0.6, 1.0));
  g.save(); g.translate(E.W / 2, E.H * V(0.16, 0.2)); g.scale(a, a);
  text(g, 'SAME SHIP', 0, 0, { size: V(90, 100), color: '#7dffb0', glow: 24, glowColor: 'rgba(80,255,150,.6)', spacing: 4 }); g.restore();
} });

// s010: "Others said it was a new one."
registerShot('s010', { draw(g, t, info) {
  blurLayer(g, 14, (g) => colonnade(g, t, { z: 1.6, x: 200, y: -160 })); veil(g, '#120a10', 0.35);
  const M = mood('golden'), r = V(300, 320) * (1 + 0.04 * t / info.dur);
  bigFace(g, E.W / 2, E.H * V(0.62, 0.56), r, { outfit: PHIL_B, expr: 'angry', rimColor: M.rim, rimSide: 1, blink: (t % 3.1) > 3.0, tilt: -Math.sin(t * 4) * 0.03 });
  const a = ease.outBack(prog(t, 0.5, 0.9));
  g.save(); g.translate(E.W / 2, E.H * V(0.16, 0.2)); g.scale(a, a);
  text(g, 'NEW SHIP', 0, 0, { size: V(90, 100), color: S().ui.accent, glow: 24, glowColor: 'rgba(255,80,60,.6)', spacing: 4 }); g.restore();
} });

// s011: "Later, Thomas Hobbes made it harder." night study, the idea strikes
registerShot('s011', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.05 + 0.07 * ease.inOut(p), x: 30 * p };
  const { M, GY: gy } = study(g, t, cam);
  const idea = local(info, t, 'harder');
  layer(g, cam, 1, (g) => {
    const x = E.W / 2 - V(120, 60);
    rr(g, x + V(140, 110), gy - 150, 260, 18, 6); g.fillStyle = '#1a1018'; g.fill(); seg(g, [[x + V(170, 140), gy - 140], [x + V(170, 140), gy]], 10, '#1a1018'); seg(g, [[x + V(380, 350), gy - 140], [x + V(380, 350), gy]], 10, '#1a1018');
    const cx = x + V(330, 300), cy = gy - 190; rr(g, cx - 8, cy, 16, 40, 4); g.fillStyle = '#efe6d4'; g.fill(); circle(g, cx, cy - 10 + Math.sin(t * 9) * 2, 9, '#ffd27a'); glow(g, cx, cy - 10, 260, '#ffb060', 0.45);
    drawFigure(g, { x, y: gy, s: V(1.6, 1.7), facing: 1, outfit: HOBBES, pose: breathe(posesAt(t, [[0, POSES.think], [idea, POSES.pointUp]]), t), expr: t > idea ? 'smirk' : 'thinking', rim: { color: '#ffb060', dir: [1, -0.4], w: 4 } });
    if (t > idea) { FX.sparkle(g, x + V(40, 40), gy - V(420, 440), 40 * ease.outBack(prog(t, idea, idea + 0.4)), '#ffe9a8'); FX.rings(g, x + V(40, 40), gy - V(420, 440), t - idea, { count: 3, r0: 20, r1: 200, color: '#ffe9a8', a: 0.5 * (1 - prog(t, idea, idea + 1.4)) }); }
  });
  text(g, 'THOMAS HOBBES', E.W / 2, E.H * V(0.12, 0.17), { size: V(40, 48), font: 'Nunito', weight: 900, color: S().ui.cream, alpha: ease.out(prog(t, 0.4, 0.9)), spacing: 4 });
  FX.dust(g, t, { count: 40, color: '#ffd9a8', a: 0.35 });
} });

// s012: "What if someone kept every old plank, and built a second ship from them?"
registerShot('s012', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.02 + 0.06 * ease.inOut(p) };
  const { M, GY: gy } = shipyard(g, t, cam, { mood: 'dusk' });
  const build = local(info, t, 'built');
  const sx = E.W / 2, sy = gy - V(190, 220), s = V(0.95, 0.95);
  layer(g, cam, 1, (g) => {
    // ghost outline of the coming ship
    g.save(); g.globalAlpha = 0.25 * ease.out(prog(t, build - 0.5, build)); drawShip(g, sx, sy, s, { wood: 'old', rim: M.rim, hideHull: true }); g.restore();
    // planks fly from the pile into place, one by one
    const pw = 730 / 7, ph = 182 / 4;
    for (let id = 0; id < N; id++) {
      const r = Math.floor(id / 7), c = id % 7, k = ease.inOut(prog(t, build + RANK[id] * 0.07, build + RANK[id] * 0.07 + 0.6));
      const tx = sx + (-365 + c * pw + (r % 2 ? -pw / 2 : 0) + pw / 2) * s, ty = sy + (-20 + r * ph + ph / 2) * s;
      const px = E.W / 2 + ((id * 53) % 9 - 4) * V(40, 28), py = gy - 30 - ((id * 7) % 6) * 22;
      const x = lerp(px, tx, k), y = lerp(py, ty, k) - Math.sin(k * Math.PI) * 160, rot = (1 - k) * (((id * 37) % 11) - 5) * 0.08;
      g.save(); g.translate(x, y); g.rotate(rot); rr(g, -pw * s / 2, -ph * s / 2, pw * s - 4, ph * s - 4, 4); g.fillStyle = '#3b2418'; g.fill(); g.fillStyle = alpha(M.rim, 0.35); g.fillRect(-pw * s / 2, -ph * s / 2, pw * s - 4, 3); g.restore();
    }
    const done = prog(t, build + N * 0.07 + 0.3, build + N * 0.07 + 0.8);
    const placed = (id) => (t > build + RANK[id] * 0.07 + 0.6 ? 1 : 0);
    if (done > 0) { g.save(); g.globalAlpha = done; drawShip(g, sx, sy, s, { wood: 'old', rim: M.rim, t: t - build }); g.restore(); }
    void done; void placed;
  });
  text(g, 'ONLY ORIGINAL PLANKS', E.W / 2, E.H * V(0.12, 0.2), { size: V(42, 50), font: 'Nunito', weight: 900, color: '#ffb070', alpha: ease.out(prog(t, build + 1.6, build + 2.0)), glow: 16, spacing: 3 });
  FX.dust(g, t, { count: 50, color: '#ffe2bd', a: 0.4 });
} });

// s013: "Now there are two ships." harbor, A (new wood) and B (old wood)
registerShot('s013', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.0 + 0.05 * p };
  const { M, SY } = harbor(g, t + 30, cam);
  const s = V(0.62, 0.5);
  layer(g, cam, 0.75, (g) => {
    drawShip(g, E.W * 0.27, SY + V(130, 150), s, { wood: 'new', rim: M.rim, t: t + 30 });
    drawShip(g, E.W * 0.73, SY + V(130, 150), s, { wood: 'old', rim: M.rim, t: t + 31 });
  });
  for (const [x, str, c, d] of [[E.W * 0.27, 'A', '#e0302a', 0.2], [E.W * 0.73, 'B', '#14121a', 0.5]]) {
    const a = ease.outBack(prog(t, d, d + 0.4)); g.save(); g.translate(x, SY - V(260, 280)); g.scale(a, a); circle(g, 0, 0, V(52, 58), c); circle(g, 0, 0, V(46, 52), alpha('#ffffff', 0.08)); text(g, str, 0, 4, { size: V(60, 66), color: '#ffffff' }); g.restore();
  }
} });

// s014: "Which one is the real ship of Theseus?" Theseus looks from one to the other
registerShot('s014', { draw(g, t, info) {
  blurLayer(g, 12, (g) => { const { M, SY } = harbor(g, t + 34, { z: 1.3, y: -80 }); drawShip(g, E.W * 0.1, SY + 120, 0.7, { wood: 'new', rim: M.rim, t }); drawShip(g, E.W * 0.9, SY + 120, 0.7, { wood: 'old', rim: M.rim, t }); });
  veil(g, '#120a10', 0.35);
  const M = mood('dusk'), r = V(300, 330) * (1 + 0.05 * t / info.dur);
  const lx = key(t, [[0, 0], [0.4, -1], [1.3, -1], [1.7, 1], [2.5, 1], [2.9, 0]]);
  bigFace(g, E.W / 2, E.H * V(0.62, 0.56), r, { outfit: THESEUS, expr: t > 2.4 ? 'confused' : 'worried', look: [lx, -0.1], rimColor: M.rim, rimSide: -1, blink: (t % 3.3) > 3.2 });
  const q = ease.outBack(prog(t, 2.2, 2.6)); g.save(); g.translate(E.W / 2, E.H * V(0.16, 0.2)); g.scale(q, q); text(g, '?', 0, 0, { size: V(170, 190), color: S().ui.gold, glow: 30 }); g.restore();
} });
