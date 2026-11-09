// shots/01_ship.js: hook, title, the shipyard, the years, the blueprint count.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, wordTime, seg, circle, rr, glow, alpha, shade, mix, linGrad, text, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { stat } from '../sets/stat.js';
import { drawShip, N, RANK, OLD, NEW } from '../sets/ship.js';
import { harbor, shipyard, SEA_Y, GY } from '../sets/places.js';
import { THESEUS, WRIGHT } from '../cast.js';

const rimOf = (M, dir = [0.4, -1]) => ({ color: M.rim, dir, w: 4 });

// s001: "If every part of a ship is replaced," harbor wide, planks start swapping
registerShot('a01', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1 + 0.08 * ease.inOut(p), x: -30 * p };
  const { M, SY } = harbor(g, t, cam);
  layer(g, cam, 0.75, (g) => drawShip(g, E.W / 2, SY + V(120, 160), V(0.9, 1.05), { replaced: N * 0.45 * ease.inOut(prog(t, 0.3, info.dur)), rim: M.rim, t }));
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
  FX.lensStreak(g, E.W * 0.68, SEA_Y() - V(120, 260), E.W * 1.4, '#ffe0b0', 0.22);
} });

// s002: "is it still the same ship?" push in while the last planks swap, question line
registerShot('a02', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.15 + 0.12 * ease.inOut(p), y: -V(20, 40) };
  const { M, SY } = harbor(g, t + 2.4, cam);
  layer(g, cam, 0.75, (g) => drawShip(g, E.W / 2, SY + V(120, 160), V(0.9, 1.05), { replaced: lerp(N * 0.45, N, ease.inOut(prog(t, 0, 1.8))), rim: M.rim, t: t + 2.4 }));
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
  UI.bigLine(g, t - 0.9, { str: 'SAME SHIP?', dur: info.dur - 0.7, y: E.H * V(0.18, 0.2) });
} });

// s003: title card. Theseus on the pier looks at his ship.
registerShot('a04', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.02 + 0.05 * p, x: 20 * p };
  const { M, SY } = harbor(g, t + 5, cam);
  layer(g, cam, 0.75, (g) => drawShip(g, E.W * 0.62, SY + V(120, 160), V(0.75, 0.8), { wood: 'old', rim: M.rim, t: t + 5 }));
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.17, y: GY() + V(0, 40), s: V(1.3, 1.5), facing: 1, outfit: THESEUS, pose: breathe(posesAt(t, [[0, POSES.stand], [1.6, POSES.crossArms]]), t), expr: 'smile', rim: rimOf(M, [1, -0.4]), blink: (t % 3.2) > 3.1 }));
  UI.titleCard(g, t, { lines: ['THE SHIP OF', 'THESEUS'], sub: 'ANCIENT ATHENS', dur: info.dur, y: E.H * V(0.22, 0.17) });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });

// s004: "When an old plank rotted, they swapped in fresh timber." shipwright swaps one plank
registerShot('a05', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.05 + 0.06 * p, x: V(-60, -20) + 40 * p };
  const { M, GY: gy } = shipyard(g, t, cam);
  const sw = wordTime('ripped', info.globalT - t) - (info.globalT - t);   // seconds into shot when "swapped" is said
  const rot = clamp(prog(t, 0.2, sw)), fresh = ease.inOut(prog(t, sw, sw + 0.9));
  const target = 9;    // first plank to be replaced
  const shipX = E.W / 2 + V(160, 90), shipY = gy - V(170, 200), s = V(0.95, 0.9);
  layer(g, cam, 1, (g) => {
    for (const dx of [-200, 0, 200]) { g.fillStyle = shade(M.dark, -0.3); g.fillRect(shipX + dx * s - 40, gy - 50, 80, 50); }
    drawShip(g, shipX, shipY, s, { rim: M.rim, plankFn: (id) => (id === target ? fresh : 0), t: 0 });
    if (rot > 0 && fresh < 0.5) { const [px, py] = [shipX + (-365 + 2 * (730 / 7) - 52 + 52) * s, shipY + (-20 + 45.5 * 1.5) * s]; FX.rings(g, px, py, t, { count: 2, r0: 30, r1: 110, color: '#ff7a5a', a: 0.5 * rot }); }
    const hold = t > sw - 0.5 && t < sw + 0.4;
    drawFigure(g, { x: E.W / 2 - V(420, 300), y: gy, s: V(1.6, 1.7), facing: 1, outfit: WRIGHT, pose: breathe(posesAt(t, [[0, POSES.think], [sw - 0.6, POSES.reach], [sw + 0.5, POSES.holdFront]]), t), expr: t < sw ? 'worried' : 'happy', rim: rimOf(M, [-0.6, -1]) });
    if (t < sw) { // rotten plank glimmer
      text(g, 'ROTTEN', shipX - V(60, 40), E.H * V(0.12, 0.13), { size: V(54, 64), font: 'Nunito', weight: 900, color: S().ui.accent, alpha: ease.out(prog(t, 0.3, 0.7)) * (1 - prog(t, sw - 0.3, sw)), glow: 10 });
    } else {
      text(g, 'NEW TIMBER', shipX - V(60, 40), E.H * V(0.12, 0.13), { size: V(54, 64), font: 'Nunito', weight: 900, color: S().ui.gold, alpha: ease.out(prog(t, sw + 0.3, sw + 0.7)), glow: 14 });
    }
  });
  FX.dust(g, t, { count: 50, color: '#ffe2bd', a: 0.4 });
  FX.godRays(g, E.W * 0.2, 0, { count: 5, color: M.key, a: 0.07, t });
} });

// s005: "One plank at a time." insert: the hull fills the frame, a mallet knocks each plank in
registerShot('a06', { draw(g, t, info) {
  const M = mood('golden');
  const cam = { z: 1, x: 0 };
  blurLayer(g, 12, (g) => shipyard(g, t, { z: 1.6, y: -200 })); veil(g, '#120a10', 0.4);
  const hits = [0.12, 0.45, 0.8].map((h) => h * (info.dur / 1.15));
  const n = hits.filter((h) => t > h).length, cur = hits[Math.max(0, n - 1)] ?? 0;
  const [sx, sy] = n ? shake(t, 6 * (1 - prog(t, cur, cur + 0.3)), 28) : [0, 0];
  g.save(); g.translate(sx, sy);
  layer(g, { z: 1 + 0.05 * t / info.dur }, 1, (g) => drawShip(g, E.W / 2, E.H * V(0.42, 0.47), V(2.4, 2.4), { rim: M.rim, plankFn: (id) => (RANK[id] < n ? 1 : RANK[id] === n ? 0 : 0) + 0 * id, t: 0 }));
  // mallet
  const ang = n < 3 ? -0.9 + 0.9 * Math.abs(Math.sin(((t - cur) / 0.7) * Math.PI)) : -0.2;
  g.save(); g.translate(E.W * 0.82, E.H * V(0.75, 0.62)); g.rotate(ang);
  seg(g, [[0, 0], [-V(260, 220), -V(120, 100)]], 22, '#5a3a24'); rr(g, -V(330, 290), -V(180, 160), 120, 90, 18); g.fillStyle = '#2a1a12'; g.fill();
  seg(g, [[40, 60], [E.W, 400]], 70, '#0e0b12'); seg(g, [[120, 120], [E.W, 420]], 96, WRIGHT.color);
  g.restore(); g.restore();
  if (n) FX.rings(g, E.W / 2, E.H * V(0.48, 0.42), t - cur, { count: 2, r0: 40, r1: 260, color: '#fff3e0', a: 0.5 * (1 - prog(t, cur, cur + 0.8)) });
  stat(g, { label: 'PLANKS REPLACED', value: String(n), x: E.W / 2, y: E.H * V(0.12, 0.13), pulse: t - cur });
} });

// s006: "Years went by." time-lapse: the sun races, every plank keeps swapping
registerShot('a07', { draw(g, t, info) {
  const p = t / info.dur, fast = t * 6;
  const cam = { z: 1.06 - 0.04 * p };
  const night = (Math.sin(fast * 0.9) + 1) / 2 > 0.6;
  const { M, SY } = harbor(g, fast, cam, { mood: night ? 'night' : 'dusk', night });
  layer(g, cam, 0.75, (g) => drawShip(g, E.W / 2, SY + V(120, 160), V(0.9, 1.05), { replaced: 4 + 14 * ease.inOut(p), rim: M.rim, t: fast }));
  FX.clock(g, E.W - V(140, 160), V(150, 330), V(70, 80), t * 30, { speed: 1 });
  FX.speedLines(g, t, { count: 30, a: 0.12 });
} });

// s007: "Picture a day with not one original plank left." blueprint, the count drops to zero
registerShot('a08', { draw(g, t, info) {
  const ui = S().ui, p = t / info.dur;
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(1 + 0.05 * p, 1 + 0.05 * p); g.translate(-E.W / 2, -E.H / 2);
  UI.blueprint(g);
  const rep = lerp(18, N, ease.inOut(prog(t, 0.2, info.dur - 0.9)));
  drawShip(g, E.W / 2, E.H * V(0.58, 0.56), V(1.05, 1.15), { replaced: rep, old: shade(ui.bpBg, 0.12), fresh: ui.gold, ink: ui.blueprint, sail: shade(ui.bpBg, 0.2), rim: ui.blueprint, t });
  const left = Math.max(0, Math.round(N - rep));
  stat(g, { label: 'ORIGINAL PLANKS LEFT', value: String(left), x: E.W / 2, y: E.H * V(0.12, 0.13), color: left === 0 ? ui.accent : ui.gold });
  if (left === 0) FX.rings(g, E.W / 2, E.H * V(0.12, 0.13) + V(70, 80), t - (info.dur - 0.9), { count: 3, r0: 60, r1: 320, color: ui.accent, a: 0.4 });
  g.restore();
} });
