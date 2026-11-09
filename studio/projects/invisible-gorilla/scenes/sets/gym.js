// sets/gym.js: the gym, the passing test (shared by the test, the freeze and the replay), the gorilla, the lab, the road.
import { E, V, mood, layer, backdrop, rr, seg, poly, circle, glow, alpha, shade, mix, linGrad, ease, prog, clamp, lerp, text, S } from '/engine/core.js';
import { drawFigure, POSES, breathe, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { WHITE, BLACK } from '../cast.js';

export const GY = () => E.H * V(0.8, 0.68);

// ---------- basketball ----------
export function ball(g, x, y, r = 16, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  circle(g, 0, 0, r, '#e8742a'); circle(g, -r * 0.3, -r * 0.3, r * 0.35, 'rgba(255,220,180,.35)');
  g.strokeStyle = '#3a1a0a'; g.lineWidth = Math.max(1.5, r * 0.12);
  g.beginPath(); g.moveTo(-r, 0); g.lineTo(r, 0); g.moveTo(0, -r); g.lineTo(0, r); g.stroke();
  g.beginPath(); g.arc(-r * 1.25, 0, r * 0.95, -0.9, 0.9); g.stroke(); g.beginPath(); g.arc(r * 1.25, 0, r * 0.95, Math.PI - 0.9, Math.PI + 0.9); g.stroke();
  g.restore();
}

// ---------- gorilla ----------
// mode: 'walk' | 'beat' | 'stand'; facing 1 = right, -1 = left, 0 = front
export function gorilla(g, o) {
  const { x, y, s = 1, t = 0, mode = 'walk', facing = -1, rim = '#ffe0a0', alpha: a = 1, rimA = 0.85, shadowA = 0.3 } = o;
  const fur = '#17141c', fur2 = '#221e28', face = o.dark ? '#2a2228' : '#4a3c40';
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s);
  g.fillStyle = `rgba(0,0,0,${shadowA})`; g.beginPath(); g.ellipse(0, 2, 70, 10, 0, 0, 7); g.fill();
  const step = mode === 'walk' ? Math.sin(t * 9) : 0, bob = mode === 'walk' ? Math.abs(Math.sin(t * 9)) * 6 : 0;
  g.translate(0, -bob);
  // legs
  seg(g, [[-24, -95], [-30 + step * 16, -45], [-32 + step * 22, 0]], 30, fur2);
  seg(g, [[24, -95], [30 - step * 16, -45], [32 - step * 22, 0]], 30, fur);
  // body
  g.fillStyle = fur; g.beginPath(); g.ellipse(0, -150, 70, 82, 0, 0, 7); g.fill();
  g.fillStyle = fur2; g.beginPath(); g.ellipse(0, -140, 40, 50, 0, 0, 7); g.fill(); // chest
  // arms
  const beat = mode === 'beat';
  const bk = beat ? (Math.sin(t * 16) > 0 ? 1 : 0) : 0;
  const armL = beat ? (bk ? [[-58, -195], [-62, -150], [-22, -160]] : [[-58, -195], [-90, -150], [-60, -125]]) : [[-58, -195], [-86 - step * 10, -120], [-84 - step * 18, -40]];
  const armR = beat ? (!bk ? [[58, -195], [62, -150], [22, -160]] : [[58, -195], [90, -150], [60, -125]]) : [[58, -195], [86 + step * 10, -120], [84 + step * 18, -40]];
  seg(g, armL, 28, fur); seg(g, armR, 28, fur);
  circle(g, armL[2][0], armL[2][1], 17, fur); circle(g, armR[2][0], armR[2][1], 17, fur);
  // head
  const hx = facing * 10, hy = -240;
  circle(g, hx, hy, 40, fur);
  g.fillStyle = face; g.beginPath(); g.ellipse(hx + facing * 6, hy + 8, 27, 24, 0, 0, 7); g.fill();
  seg(g, [[hx - 22 + facing * 6, hy - 10], [hx + 22 + facing * 6, hy - 10]], 9, fur);   // heavy brow
  circle(g, hx - 9 + facing * 8, hy - 1, 4.5, '#fff'); circle(g, hx + 9 + facing * 8, hy - 1, 4.5, '#fff');
  circle(g, hx - 5 + facing * 8, hy + 14, 3, '#1a1416'); circle(g, hx + 5 + facing * 8, hy + 14, 3, '#1a1416');
  if (beat) { g.fillStyle = '#1a0c10'; g.beginPath(); g.ellipse(hx + facing * 6, hy + 24, 10, 6 + bk * 3, 0, 0, 7); g.fill(); }
  // rim light
  if (rimA > 0) { g.strokeStyle = alpha(rim, rimA); g.lineWidth = 4; g.beginPath(); g.arc(0, -150, 70, -2.4, -0.7); g.stroke(); g.beginPath(); g.arc(hx, hy, 40, -2.6, -0.5); g.stroke(); }
  g.restore();
}

// ---------- gym ----------
export function gym(g, t, cam, o = {}) {
  const M = mood('golden'), gy = GY();
  const wall = mix(M.sky[1], '#e8e2d6', 0.55), wallLow = shade(wall, -0.18);
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, gy, [shade(wall, 0.08), wall, wallLow]); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    const wy = gy - V(760, 1040);
    for (let i = -3; i <= 3; i++) FX.windowFrame(g, { x: E.W / 2 + i * 260 - 100, y: wy, w: 200, h: V(220, 260), cols: 2, rows: 2, frame: shade(wall, -0.35), bar: 8 }, (g, x, y, w, h) => { backdrop(g, M.sky, [x, y, w, h]); glow(g, x + w / 2, y + h / 2, 140, M.key, 0.35); });
    FX.godRays(g, E.W * 0.3, wy + 60, { count: 6, len: V(900, 1300), color: M.key, a: 0.06, angle: Math.PI * 0.45 });
    g.fillStyle = shade(wall, -0.3); g.fillRect(-E.W, gy - V(230, 300), E.W * 3, 16);            // padding stripe
    // bleachers + a scoreboard-free back wall
    for (let r = 0; r < 4; r++) { g.fillStyle = shade(wall, -0.25 - r * 0.05); g.fillRect(-E.W, gy - V(200, 260) + r * V(48, 62), E.W * 3, V(40, 52)); }
  });
  layer(g, cam, 0.9, (g) => {
    const wood = '#c98a4e';
    g.fillStyle = linGrad(g, 0, gy - 40, 0, gy + 600, [shade(wood, 0.12), wood, shade(wood, -0.35)]); g.fillRect(-E.W, gy - 40, E.W * 3, E.H * 2);
    g.strokeStyle = 'rgba(90,50,20,.25)'; g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 60) { g.beginPath(); g.moveTo(x, gy - 40); g.lineTo(x + (x - E.W / 2) * 0.6, gy + 600); g.stroke(); }
    g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 6; g.beginPath(); g.ellipse(E.W / 2, gy + 40, V(380, 300), V(60, 70), 0, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(E.W / 2, gy - 40); g.lineTo(E.W / 2, gy + 600); g.stroke();
    FX.pool(g, E.W / 2, gy + 40, 520, 70, M.key, 0.2);
  });
  return { M, GY: gy, CX: E.W / 2 };
}

// ---------- the passing test ----------
// Test-local time tt (0..9.4). White team makes exactly 7 passes; the gorilla crosses 3.0..9.0.
export const WHITE_PASSES = [0.75, 1.85, 2.95, 4.05, 5.25, 6.45, 7.75];
const BLACK_PASSES = [0.4, 1.4, 2.5, 3.6, 4.7, 5.9, 7.1, 8.3];
export const GORILLA = { enter: 3.2, stop: 5.1, beat0: 5.25, beat1: 6.05, exit: 9.0 };

function spots(tt) {
  const cx = E.W / 2, gy = GY(), sp = V(280, 300);
  const wob = (i, a) => Math.sin(tt * 1.3 + i * 2.1) * a * 2.2 + Math.sin(tt * 0.7 + i) * a * 0.8;
  return {
    white: [[cx - sp + wob(0, 30), gy], [cx + V(40, 20) + wob(1, 30), gy + V(40, 60)], [cx + sp + wob(2, 30), gy - V(10, 10)]],
    black: [[cx - sp * 0.55 + wob(3, 40), gy + V(20, 30)], [cx + sp * 0.5 + wob(4, 40), gy - V(10, 0)], [cx - V(60, 40) + wob(5, 40), gy + V(70, 100)]],
  };
}
function ballPath(passes, tt, who, order) {
  // returns [x,y] of the ball and the index of the holder (or -1 in flight)
  let k = 0; while (k < passes.length && tt > passes[k] + 0.45) k++;
  const holder = order[k % order.length], next = order[(k + 1) % order.length];
  const inFlight = k < passes.length && tt > passes[k] && tt <= passes[k] + 0.45;
  if (!inFlight) return { holder, pos: null, from: holder };
  const from = order[k % order.length], to = order[(k + 1) % order.length], p = (tt - passes[k]) / 0.45;
  return { holder: -1, from, to, p };
}
export function gorillaAt(tt) {
  const G = GORILLA, gy = GY(), S1 = V(1.15, 1.25), mid = E.W / 2 + V(60, 40);
  const x = tt < G.stop ? lerp(E.W + 120, mid, ease.out(prog(tt, G.enter, G.stop))) : tt < G.beat1 + 0.15 ? mid : lerp(mid, -160, ease.in(prog(tt, G.beat1 + 0.15, G.exit)));
  const mode = tt > G.beat0 && tt < G.beat1 ? 'beat' : tt > G.stop && tt < G.beat1 + 0.15 ? 'stand' : 'walk';
  return { x, y: gy - V(55, 75), s: S1 * 0.48, mode };
}
export function passTest(g, tt, cam, o = {}) {
  const { showGorilla = true, highlight = 0, M } = o;
  const S1 = V(1.15, 1.25), sp = spots(tt), gy = GY();
  const hand = (pt, facing) => [pt[0] + facing * 36 * S1, pt[1] - 152 * S1];
  const W = ballPath(WHITE_PASSES, tt, 'w', [0, 1, 2]), B = ballPath(BLACK_PASSES, tt, 'b', [0, 1, 2]);
  const face = (arr, i, target) => (arr[target][0] > arr[i][0] ? 1 : -1);
  layer(g, cam, 1, (g) => {
    // gorilla walks behind the players
    if (showGorilla && tt > GORILLA.enter && tt < GORILLA.exit) {
      const { x: gx, y: gyy, s: gs, mode } = gorillaAt(tt);
      if (highlight > 0) { glow(g, gx, gyy - 150 * gs, 260, '#ff4a32', 0.4 * highlight); g.strokeStyle = alpha('#ff4a32', highlight); g.lineWidth = 7; g.beginPath(); g.ellipse(gx, gyy - 140 * gs, 120 * gs, 175 * gs, 0, 0, 7); g.stroke(); }
      gorilla(g, { x: gx, y: gyy, s: gs, t: tt, mode, facing: mode === 'walk' ? -1 : 0, rim: M?.rim, rimA: highlight * 0.85, shadowA: 0.12, alpha: 0.92, dark: highlight < 0.5 });
    }
    const draw = (team, arr, st, outfit, seed) => arr.forEach((pt, i) => {
      const holding = st.holder === i, throwing = st.holder === -1 && st.from === i, catching = st.holder === -1 && st.to === i;
      const target = holding || throwing ? (i + 1) % 3 : catching ? st.from : (i + 1) % 3;
      const f = face(arr, i, target);
      const pose = holding ? POSES.holdFront : throwing ? POSES.reach : catching ? POSES.ready : POSES.ready;
      drawFigure(g, { x: pt[0], y: pt[1], s: S1, facing: f, outfit, pose: breathe(pose, tt, 1, seed + i), expr: 'determined', rim: { color: M?.rim || '#fff0c4', dir: [0.3, -1], w: 4 }, blink: ((tt + i) % 3.1) > 3.0 });
      if (holding) { const [hx, hy] = hand(pt, f); ball(g, hx, hy + Math.abs(Math.sin(tt * 6 + i)) * 6, 17 * S1, tt * 2); }
    });
    draw('b', sp.black, B, BLACK, 4); draw('w', sp.white, W, WHITE, 1);
    for (const [st, arr] of [[W, sp.white], [B, sp.black]]) if (st.holder === -1) {
      const fa = face(arr, st.from, st.to), fb = face(arr, st.to, st.from);
      const [ax, ay] = hand(arr[st.from], fa), [bx, by] = hand(arr[st.to], fb);
      const bounce = st.p < 0.5 ? lerp(ay, gy - 10, ease.in(st.p * 2)) : lerp(gy - 10, by, ease.out((st.p - 0.5) * 2));
      const bxp = lerp(ax, bx, st.p);
      if (st === W) {
        for (let k = 1; k <= 6; k++) { const q = Math.max(0, st.p - k * 0.05); const yy = q < 0.5 ? lerp(ay, gy - 10, ease.in(q * 2)) : lerp(gy - 10, by, ease.out((q - 0.5) * 2)); circle(g, lerp(ax, bx, q), yy, 17 * S1 * (1 - k * 0.12), alpha('#ffd23f', 0.35 - k * 0.05)); }
        glow(g, bxp, bounce, 90, '#ffd23f', 0.45);
        if (st.p > 0.85) FX.rings(g, bx, by, (st.p - 0.85) * 2, { count: 2, r0: 20, r1: 90, color: '#ffd23f', a: 0.7 });
      }
      ball(g, bxp, bounce, 17 * S1, st.p * 8);
    }
  });
  return { passesDone: WHITE_PASSES.filter((p) => tt > p + 0.45).length };
}

// ---------- lab ----------
export function lab(g, t, cam) {
  const M = mood('golden'), gy = GY(), wall = mix(M.sky[1], '#dfe6ee', 0.6);
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, gy, [shade(wall, 0.05), shade(wall, -0.12)]); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    FX.windowFrame(g, { x: E.W / 2 - V(700, 480), y: gy - V(720, 980), w: V(300, 280), h: V(400, 420), cols: 2, rows: 3, frame: shade(wall, -0.4), bar: 9 }, (g, x, y, w, h) => { backdrop(g, M.sky, [x, y, w, h]); FX.clouds(g, { y: y + 40, h: 60, a: 0.4, seed: 2 }); });
    // red-brick campus building in the window glow + a whiteboard
    rr(g, E.W / 2 + V(80, 60), gy - V(760, 1000), V(520, 420), V(300, 280), 10); g.fillStyle = '#f4f6f8'; g.fill();
    seg(g, [[E.W / 2 + V(120, 90), gy - V(700, 940)], [E.W / 2 + V(380, 300), gy - V(700, 940)]], 5, '#3a6ea5');
    seg(g, [[E.W / 2 + V(120, 90), gy - V(660, 900)], [E.W / 2 + V(300, 240), gy - V(660, 900)]], 5, '#d64a33');
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 500, [shade(M.floor, 0.25), shade(M.floor, -0.2)]); g.fillRect(-E.W, gy, E.W * 3, E.H * 2); FX.floorLines(g, gy, gy + 600, 'rgba(0,0,0,.15)', 0.1); });
  return { M, GY: gy, CX: E.W / 2 };
}

// ---------- road ----------
export function road(g, t, cam) {
  const M = mood('golden'), gy = GY();
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * 0.78, gy - V(500, 900), 60, '#fff3dc', M.key, 5); FX.clouds(g, { y: gy - V(700, 1200), h: 160, a: 0.3, seed: 6 }); });
  layer(g, cam, 0.35, (g) => FX.skyline(g, { x: -E.W, y: gy - V(160, 220), w: E.W * 3, minH: 120, maxH: V(380, 560), color: mix(M.sky[0], M.wall, 0.5), windowColor: alpha('#fff3d0', 0.6), lit: 0.3, seed: 5 }));
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = '#4a4a52'; g.fillRect(-E.W, gy - V(160, 220), E.W * 3, E.H * 2);
    g.fillStyle = '#8a8a90'; g.fillRect(-E.W, gy - V(170, 230), E.W * 3, 14);
    for (let x = -E.W; x < E.W * 2; x += 200) { g.fillStyle = '#f4e8b0'; g.fillRect(x + ((t * 300) % 200), gy - V(40, 60), 110, 10); }
  });
  return { M, GY: gy, CX: E.W / 2 };
}
export function car(g, x, y, s, color = '#3a6ea5', facing = 1) {
  g.save(); g.translate(x, y); g.scale(s * facing, s);
  rr(g, -170, -110, 340, 80, 30); g.fillStyle = color; g.fill();
  g.beginPath(); g.moveTo(-90, -110); g.lineTo(-50, -170); g.lineTo(80, -170); g.lineTo(120, -110); g.closePath(); g.fill();
  g.fillStyle = '#bfe3f0'; g.beginPath(); g.moveTo(-70, -112); g.lineTo(-42, -158); g.lineTo(18, -158); g.lineTo(18, -112); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(30, -112); g.lineTo(30, -158); g.lineTo(72, -158); g.lineTo(104, -112); g.closePath(); g.fill();
  for (const wx of [-100, 100]) { circle(g, wx, -30, 36, '#15131a'); circle(g, wx, -30, 16, '#8a8a90'); }
  circle(g, 165, -82, 10, '#fff3b0');
  g.restore();
}
export function motorcycle(g, x, y, s, t = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  for (const wx of [-70, 70]) { circle(g, wx, -32, 32, '#15131a'); circle(g, wx, -32, 12, '#8a8a90'); }
  seg(g, [[-70, -32], [-10, -70], [50, -72], [70, -32]], 14, '#d64a33');
  seg(g, [[50, -72], [64, -110]], 8, '#15131a');
  // rider
  seg(g, [[-6, -78], [10, -150]], 16, '#15131a'); circle(g, 16, -176, 24, '#f2c21a'); seg(g, [[10, -140], [58, -112]], 10, '#15131a'); seg(g, [[-6, -78], [30, -40]], 12, '#15131a');
  circle(g, 74, -80, 8, '#fff3b0'); glow(g, 74, -80, 60, '#fff3b0', 0.4);
  g.restore();
}
