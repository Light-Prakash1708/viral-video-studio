// shots/01_world.js: the hook, the premise, prices, the rich.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, wordTime, seg, circle, rr, glow, alpha, shade, mix, text, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { stat } from '../sets/stat.js';
import { street, penthouse, room, wrist, forearm, cost, fmtLife, YEAR, DAY, HOUR, MIN, GY } from '../sets/world.js';
import { RICH, POOR, SON } from '../cast.js';

export const local = (info, t, word) => { const w = wordTime(word, info.globalT - t - 0.3); return w == null ? null : w - (info.globalT - t); };
const rimOf = (M, dir = [0.4, -1]) => ({ color: M.rim, dir, w: 5 });

// c01: "A billionaire has two hundred years." penthouse above the clouds, gold wrist
registerShot('c01', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.12 - 0.06 * ease.inOut(p), x: 40 * p };
  const { M, GY: gy } = penthouse(g, t, cam);
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(120, 80), y: gy, s: V(1.8, 1.9), facing: 1, outfit: RICH, pose: breathe(POSES.crossArms, t), expr: 'smirk', rim: rimOf(M, [1, -0.3]) }));
  wrist(g, E.W / 2, E.H * V(0.16, 0.2), V(1.2, 1.4), fmtLife(200 * YEAR + 3 * DAY - t * 1), { color: '#ffc15a' });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
} });

// c02: "A poor man has twenty." rain, a streetlamp, a flickering wrist
registerShot('c02', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.1 + 0.06 * ease.inOut(p), x: -30 * p };
  const { M, GY: gy } = street(g, t, cam, { mood: 'storm' });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.22, y: gy, s: V(1.8, 1.9), facing: 1, outfit: POOR, pose: breathe(POSES.sad, t), expr: 'sad', rim: rimOf(M, [-0.3, -1]), blink: (t % 3.4) > 3.3 }));
  FX.rain(g, t, { count: 220 });
  wrist(g, E.W / 2, E.H * V(0.16, 0.2), V(1.2, 1.4), fmtLife(20 * YEAR - t), { color: '#ff7a4a', flicker: 1, t });
} });

// c03: "Would that be a fair economy?" split frame: the tower above, the street below
registerShot('c03', { draw(g, t, info) {
  const half = E.H / 2, slide = ease.out(prog(t, 0, 0.5));
  g.save(); g.beginPath(); g.rect(0, 0, E.W, half - 4); g.clip(); g.translate(0, -half * 0.42 - (1 - slide) * 200);
  penthouse(g, t + 3, { z: 1.0 }); drawFigure(g, { x: E.W / 2, y: GY(), s: V(1.6, 1.7), facing: -1, outfit: RICH, pose: breathe(POSES.relaxed, t), expr: 'smile', rim: { color: '#ffcf8a', dir: [1, -0.3], w: 5 } });
  g.restore();
  g.save(); g.beginPath(); g.rect(0, half + 4, E.W, half); g.clip(); g.translate(0, half * 0.38 + (1 - slide) * 200);
  street(g, t + 3, { z: 1.0 }, { mood: 'storm' }); drawFigure(g, { x: E.W / 2, y: GY(), s: V(1.6, 1.7), facing: 1, outfit: POOR, pose: breathe(POSES.sad, t), expr: 'worried', rim: { color: '#ffb760', dir: [-0.3, -1], w: 5 } }); FX.rain(g, t, { count: 120 });
  g.restore();
  g.fillStyle = '#ffc15a'; g.fillRect(0, half - 4, E.W, 8); glow(g, E.W / 2, half, 500, '#ffc15a', 0.3);
  const a = ease.outBack(prog(t, 0.5, 0.9)); g.save(); g.translate(E.W / 2, half); g.scale(a, a);
  rr(g, -V(130, 140), -V(60, 66), V(260, 280), V(120, 132), 60); g.fillStyle = '#07090c'; g.fill(); text(g, 'FAIR?', 0, 4, { size: V(80, 88), color: '#ffc15a', glow: 20 }); g.restore();
} });

// c04: 3D: a city of glass towers at night, the title floats above
registerShot('c04', {
  kind: '3d',
  init(T) {
    const M = mood('night');
    const st = T.stage({ mood: 'night', fov: V(40, 58), fog: [18, 70], keyPos: [10, 20, -10], keyIntensity: 2.0, ambient: 1.4, bloom: 1.3 });
    st.add(T.ground(200, 200, M.floor));
    for (let i = 0; i < 70; i++) {
      const gx = ((i * 37) % 17) - 8, gz = Math.floor(i / 7) * -4 + 6, h = 4 + ((i * 53) % 11) * (Math.abs(gx) < 3 ? 2.4 : 1.1);
      const b = T.building(2.2, h, 2.2, { color: '#24384a', win: i % 5 ? '#ffbe6a' : '#9fe6ff', lit: 0.6, seed: i }); b.position.set(gx * 2.6, 0, gz); st.add(b);
    }
    return { stage: st };
  },
  draw(s, t, info, T) { T.orbit(s.stage.camera, t, { target: [0, 6, -12], radius: V(34, 40), height: [8, 22], from: -0.35, to: 0.25, dur: info.dur }); },
  overlay(g, t, info) { UI.titleCard(g, t, { lines: ['WHAT IF', 'TIME WAS MONEY?'], dur: info.dur, y: E.H * V(0.2, 0.18) }); },
});

// c05: "Every person is born with a clock on their wrist." a newborn's wrist lights up
registerShot('c05', { draw(g, t, info) {
  blurLayer(g, 14, (g) => room(g, t, { z: 1.5, y: -200 }, { kind: 'room', sky: 'night' })); veil(g, '#05070a', 0.45);
  const on = local(info, t, 'clock') ?? 1.2, k = ease.out(prog(t, on, on + 0.6));
  const x = E.W * 0.55, y = E.H * V(0.55, 0.5), s = V(1.6, 1.7);
  // a tiny baby arm and fist
  seg(g, [[x, y], [x - 900, y + 260]], 110 * s * 0.6, '#0a0c10'); circle(g, x + 30, y - 6, 60 * s * 0.6, '#0a0c10'); seg(g, [[x - 220, y + 55], [x - 900, y + 270]], 140 * s * 0.6, '#9fb0c8'); for (let i = 0; i < 4; i++) circle(g, x + 70, y - 40 + i * 24, 16 * s * 0.6, '#0a0c10');
  if (k > 0) { glow(g, x - 140, y + 40, 600 * k, '#ffc15a', 0.5 * k); FX.rings(g, x - 140, y + 40, t - on, { count: 3, r0: 40, r1: 400, color: '#ffc15a', a: 0.5 * (1 - prog(t, on, on + 1.5)) }); }
  wrist(g, x - 140, y + 40, V(0.85, 0.95) * (0.6 + 0.4 * k), fmtLife(25 * YEAR), { a: k, color: '#ffc15a' });
} });

// c06: "Twenty five years. That's it." the clock starts ticking down
registerShot('c06', { draw(g, t, info) {
  blurLayer(g, 18, (g) => street(g, t, { z: 1.6, y: -200 })); veil(g, '#05070a', 0.55);
  const tick = Math.max(0, t - 0.2), z = 1 + 0.06 * t / info.dur;
  g.save(); g.translate(E.W / 2, E.H * V(0.48, 0.45)); g.scale(z, z);
  wrist(g, 0, 0, V(2.0, 2.2), fmtLife(25 * YEAR - tick * 7), { color: '#ffc15a' });
  g.restore();
  const thats = local(info, t, "that's") ?? 1.6;
  text(g, "THAT'S IT.", E.W / 2, E.H * V(0.25, 0.27), { size: V(72, 84), color: '#ffe6c4', alpha: ease.out(prog(t, thats, thats + 0.3)), glow: 12, spacing: 6 });
  FX.dust(g, t, { count: 30, color: '#ffd8a8', a: 0.3 });
} });

// c07: "Coffee costs three minutes." pay with your wrist
function payShot(g, t, info, o) {
  const p = t / info.dur, cam = { z: 1.12 + 0.05 * p, x: o.x || 0 };
  const { M, GY: gy } = o.set(g, t, cam);
  const pay = o.pay ?? 0.45;
  layer(g, cam, 1, (g) => { o.extra?.(g, gy, M, pay); drawFigure(g, { x: E.W / 2 - V(220, 170), y: gy, s: V(1.7, 1.8), facing: 1, outfit: POOR, pose: breathe(posesAt(t, [[0, POSES.stand], [pay - 0.3, POSES.reach], [pay + 0.6, o.after || POSES.stand]]), t), expr: o.expr || 'neutral', rim: rimOf(M) }); });
  if (o.rain) FX.rain(g, t, { count: 160 });
  const before = o.from, after = o.from - o.amount, v = t < pay ? before : lerp(before, after, ease.out(prog(t, pay, pay + 0.6)));
  wrist(g, E.W / 2, E.H * V(0.15, 0.18), V(1.1, 1.3), fmtLife(v - t), { color: '#ffc15a' });
  cost(g, E.W / 2, E.H * V(0.34, 0.33), t, pay, o.label);
  if (t > pay && t < pay + 0.35) veil(g, '#ff5a3c', 0.12 * (1 - prog(t, pay, pay + 0.35)));
}
registerShot('c07', { draw(g, t, info) {
  payShot(g, t, info, { set: (g, t, c) => room(g, t, c, { kind: 'shop', sky: 'night' }), from: 19 * YEAR + 40 * DAY, amount: 3 * MIN, label: '-3 MIN', pay: 0.5,
    extra: (g, gy, M, pay) => { const cx = E.W / 2 + V(80, 60), cy = gy - 200; rr(g, cx - 26, cy - 60, 52, 60, 8); g.fillStyle = '#efe4d4'; g.fill(); seg(g, [[cx + 26, cy - 46], [cx + 40, cy - 34], [cx + 26, cy - 22]], 6, '#efe4d4'); for (let i = 0; i < 3; i++) seg(g, [[cx - 10 + i * 10, cy - 70 - Math.sin(t * 3 + i) * 6], [cx - 10 + i * 10, cy - 110 - Math.sin(t * 3 + i) * 10]], 3, alpha('#ffffff', 0.25)); } });
} });
// c08: "Rent costs a month of your life." the landlord's door
registerShot('c08', { draw(g, t, info) {
  payShot(g, t, info, { set: (g, t, c) => street(g, t, c, { mood: 'night' }), from: 19 * YEAR + 40 * DAY, amount: 30 * DAY, label: '-1 MONTH', pay: 0.7, expr: 'sad', after: POSES.sad, x: 40,
    extra: (g, gy, M) => { FX.door(g, { x: E.W / 2 + V(180, 140), y: gy, w: 170, h: 360, color: '#2a1e1a', open: 0.4, light: M.practical }); drawFigure(g, { x: E.W / 2 + V(260, 220), y: gy, s: V(1.7, 1.8), facing: -1, outfit: { top: 'suit', color: '#3a3a44', head: 'none' }, pose: breathe(POSES.crossArms, t), expr: 'smirk', rim: { color: M.practical, dir: [1, -0.5], w: 4 } }); } });
} });
// c09: "A bus ride, an hour." rain at the bus stop, the bus pulls up
registerShot('c09', { draw(g, t, info) {
  payShot(g, t, info, { set: (g, t, c) => street(g, t, c, { mood: 'storm' }), from: 18 * YEAR + 340 * DAY, amount: HOUR, label: '-1 HOUR', pay: 0.75, rain: true,
    extra: (g, gy, M) => { const bx = lerp(E.W + 500, E.W / 2 + V(420, 360), ease.out(prog(t, 0, 0.8))); rr(g, bx - 300, gy - 330, 900, 300, 30); g.fillStyle = '#c9a24a'; g.fill(); for (let i = 0; i < 4; i++) { rr(g, bx - 260 + i * 160, gy - 300, 120, 110, 10); g.fillStyle = alpha(M.practical, 0.7); g.fill(); } circle(g, bx - 160, gy - 30, 46, '#0a0c10'); circle(g, bx + 380, gy - 30, 46, '#0a0c10'); } });
} });

// c10: "The rich never run out. They buy centuries," champagne in the penthouse, numbers climb
registerShot('c10', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.04 + 0.08 * ease.inOut(p), x: -30 + 60 * p };
  const { M, GY: gy } = penthouse(g, t, cam);
  const buy = local(info, t, 'centuries') ?? 1.8;
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 - V(200, 160), y: gy, s: V(1.6, 1.7), facing: 1, outfit: RICH, pose: breathe(posesAt(t, [[0, POSES.holdFront], [buy, POSES.cheer]]), t), expr: 'happy', rim: rimOf(M, [1, -0.3]) });
    drawFigure(g, { x: E.W / 2 + V(220, 170), y: gy, s: V(1.5, 1.6), facing: -1, outfit: { top: 'dress', color: '#c9a24a', head: 'ponytail' }, pose: breathe(posesAt(t, [[0, POSES.holdFront], [buy + 0.2, POSES.cheer]]), t, 1, 4), expr: 'joy', rim: rimOf(M, [1, -0.3]) });
  });
  const v = 200 * YEAR + 3 * DAY + (t > buy ? ease.inOut(prog(t, buy, buy + 1.2)) * 300 * YEAR : 0);
  wrist(g, E.W / 2, E.H * V(0.15, 0.18), V(1.1, 1.3), fmtLife(v), { color: '#ffc15a' });
  cost(g, E.W / 2, E.H * V(0.34, 0.33), t, buy, '+300 YEARS', '#5fe8c8');
  if (t > buy) for (let i = 0; i < 20; i++) FX.sparkle(g, (i * 211) % E.W, ((i * 97 + (t - buy) * 300) % (E.H * 0.6)), 14, '#ffe0a0', 0.7);
} });

// c11: 3D: rising past the glass towers, up above the city
registerShot('c11', {
  kind: '3d',
  init(T) {
    const M = mood('golden');
    const st = T.stage({ mood: 'golden', fov: V(40, 60), fog: [30, 120], keyPos: [20, 30, 10], keyIntensity: 2.2, ambient: 1.0, bloom: 1.1 });
    st.add(T.ground(300, 300, '#0c0a08'));
    for (let i = 0; i < 90; i++) {
      const gx = ((i * 41) % 21) - 10, gz = Math.floor(i / 9) * -5 + 10, tall = Math.abs(gx) < 4 && gz < 0;
      const b = T.building(2.6, tall ? 30 + ((i * 7) % 14) : 3 + ((i * 13) % 6), 2.6, { color: tall ? '#3a4a5a' : '#1a1410', win: tall ? '#ffe0a0' : '#ffbe6a', lit: tall ? 0.7 : 0.35, seed: i + 5 });
      b.position.set(gx * 3, 0, gz); st.add(b);
    }
    return { stage: st };
  },
  draw(s, t, info, T) { T.orbit(s.stage.camera, t, { target: [0, 22, -20], radius: V(40, 46), height: [4, 38], from: 0.15, to: -0.15, dur: info.dur }); },
});
