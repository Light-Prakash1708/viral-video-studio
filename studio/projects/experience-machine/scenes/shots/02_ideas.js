// shots/02_ideas.js: 2D philosophy beats in the surreal style.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, seg, poly, circle, rr, glow, alpha, shade, mix, text, rng, S, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { word } from '../sets/cine.js';
import { stat } from '../sets/stat.js';
import { DREAMER, FRIEND, NOZICK } from '../cast.js';

const local = (info, t, w) => { const x = wordTime(w, info.globalT - t - 0.3); return x == null ? null : x - (info.globalT - t); };
const voidBg = (g, t, warm = false) => { backdrop(g, warm ? ['#1a0e24', '#4a2a3a', '#8a5a4a'] : ['#06041a', '#1a0e44', '#3a1a6a']); const R = rng(3); for (let i = 0; i < 70; i++) circle(g, R() * E.W, R() * E.H, R() * 2.2, alpha('#ffffff', 0.5 * R())); for (let i = 0; i < 5; i++) glow(g, (i * 311 + t * 20) % E.W, E.H * (0.2 + (i % 3) * 0.3), 320, i % 2 ? '#ff7ab4' : '#7ff0ff', 0.12); };
const rimC = (c = '#7ff0ff', d = [0.4, -1]) => ({ color: c, dir: d, w: 5 });
const tankShape = (g, x, gy, s) => { rr(g, x - 110 * s, gy - 420 * s, 220 * s, 420 * s, 40 * s); g.fillStyle = alpha('#4ad8ff', 0.18); g.fill(); g.strokeStyle = alpha('#bfe8ff', 0.6); g.lineWidth = 4; g.stroke(); glow(g, x, gy - 210 * s, 260 * s, '#4ad8ff', 0.3); };

// e12: "Because if all we wanted was to feel happy, the machine would be perfect." the happiness meter maxes out
registerShot('e12', { draw(g, t, info) {
  voidBg(g, t);
  const gy = E.H * V(0.8, 0.68), k = ease.inOut(prog(t, 0.6, 2.6));
  tankShape(g, E.W / 2, gy, V(1.6, 1.7));
  drawFigure(g, { x: E.W / 2, y: gy - V(80, 90) + Math.sin(t * 1.4) * 10, s: V(1.3, 1.4), facing: 1, outfit: DREAMER, pose: POSES.relaxed, expr: 'joy', rim: rimC(), shadow: false });
  const mx = E.W * 0.12, mw = E.W * 0.76, my = E.H * V(0.3, 0.3);
  text(g, 'HAPPINESS', mx, my - V(56, 62), { size: V(34, 40), font: 'Nunito', weight: 900, color: '#eef0ff', align: 'left', spacing: 4 });
  rr(g, mx, my - 30, mw, 60, 30); g.fillStyle = 'rgba(255,255,255,.1)'; g.fill(); rr(g, mx, my - 30, mw * k, 60, 30); g.fillStyle = mix('#7ff0ff', '#ff7ab4', k); g.fill(); glow(g, mx + mw * k, my, 120, '#ff7ab4', 0.6 * k);
  text(g, Math.round(k * 100) + '%', mx + mw, my - V(56, 62), { size: V(40, 46), font: 'Nunito', weight: 900, color: '#ff9ad0', align: 'right' });
  const p = local(info, t, 'perfect') ?? 3.0; word(g, 'THE PERFECT MACHINE?', E.H * V(0.14, 0.14), ease.out(prog(t, p - 0.2, p + 0.1)), { color: '#ff9ad0', size: V(76, 86) });
} });

// e13: "Nozick's point was simple. We don't just want to feel like we did something. We want to actually do it."
registerShot('e13', { draw(g, t, info) {
  voidBg(g, t);
  const half = E.H / 2, gy1 = half - V(60, 120), gy2 = E.H * V(0.82, 0.86);
  // top: FEELING it (in a tank, eyes closed, a dream mountain projected)
  g.save(); g.beginPath(); g.rect(0, 0, E.W, half - 4); g.clip();
  poly(g, [[E.W * 0.55, gy1 - V(340, 380)], [E.W * 0.95, gy1], [E.W * 0.15, gy1]], alpha('#bfe8ff', 0.25)); tankShape(g, E.W * 0.32, gy1, V(0.95, 1.0));
  drawFigure(g, { x: E.W * 0.32, y: gy1 - 50 + Math.sin(t * 1.4) * 8, s: V(0.9, 1.0), facing: 1, outfit: DREAMER, pose: POSES.relaxed, expr: 'sleepy', rim: rimC(), shadow: false });
  text(g, 'FEEL IT', E.W * 0.76, gy1 - V(380, 420), { size: V(60, 70), color: '#bfe8ff', glow: 16, glowColor: 'rgba(127,240,255,.6)' });
  g.restore();
  g.fillStyle = '#7ff0ff'; g.fillRect(0, half - 4, E.W, 8); glow(g, E.W / 2, half, 500, '#7ff0ff', 0.25);
  // bottom: DOING it (actually climbing, flag at the top)
  g.save(); g.beginPath(); g.rect(0, half + 4, E.W, half); g.clip();
  backdrop(g, ['#2a3a7a', '#c890c0', '#ffd0a0'], [0, half, E.W, half]);
  poly(g, [[E.W * 0.62, gy2 - V(520, 560)], [E.W * 1.05, gy2], [E.W * 0.1, gy2]], '#3a2a4a'); poly(g, [[E.W * 0.62, gy2 - V(520, 560)], [E.W * 0.7, gy2 - V(420, 450)], [E.W * 0.55, gy2 - V(430, 460)]], '#f4f0ff');
  const k = ease.inOut(prog(t, 0.4, info.dur - 0.4)), cx = lerp(E.W * 0.25, E.W * 0.58, k), cy = lerp(gy2 - 20, gy2 - V(470, 500), k);
  drawFigure(g, { x: cx, y: cy, s: V(0.8, 0.9), facing: 1, outfit: DREAMER, pose: walkPose(t * 2 * Math.PI * 0.8), rot: -0.35, expr: 'determined', rim: rimC('#ffe0f0') });
  if (k > 0.95) { seg(g, [[E.W * 0.62, gy2 - V(520, 560)], [E.W * 0.62, gy2 - V(640, 680)]], 5, '#f4f0ff'); poly(g, [[E.W * 0.62, gy2 - V(640, 680)], [E.W * 0.7, gy2 - V(615, 655)], [E.W * 0.62, gy2 - V(590, 630)]], '#ff5ab4'); }
  text(g, 'DO IT', E.W * 0.22, half + V(120, 140), { size: V(60, 70), color: '#fff0c8', glow: 16 });
  g.restore();
} });

// e14: "We want real friends, not perfect copies."
registerShot('e14', { draw(g, t, info) {
  voidBg(g, t, true);
  const gy = E.H * V(0.8, 0.66), M = mood('interiorWarm');
  glow(g, E.W * 0.3, gy - 200, 420, '#ffd8a0', 0.35);
  FRIEND.forEach((of, i) => drawFigure(g, { x: E.W * (0.16 + i * 0.13), y: gy, s: V(1.0, 1.1), facing: i === 2 ? -1 : 1, outfit: of, pose: breathe(i === 1 ? POSES.cheer : POSES.talk, t, 1, i), expr: i === 1 ? 'joy' : 'happy', rim: rimC('#ffd8a0'), blink: ((t + i) % 2.6) > 2.5 }));
  const cp = local(info, t, 'copies') ?? 1.6;
  for (let i = 0; i < 3; i++) { const x = E.W * (0.62 + i * 0.13), jit = t > cp ? Math.sin(t * 40 + i) * 12 : 0; g.save(); g.globalAlpha = 0.55 + 0.3 * Math.sin(t * 9 + i); drawFigure(g, { x: x + jit, y: gy, s: V(1.0, 1.1), facing: -1, outfit: { top: 'tshirt', color: '#7ff0ff', head: 'none' }, pose: POSES.stand, expr: 'smile', ink: '#3a6a9a', rim: rimC('#7ff0ff') }); g.restore(); for (let y = 0; y < 6; y++) { g.fillStyle = 'rgba(127,240,255,.18)'; g.fillRect(x - 60, gy - 280 + y * 46 + ((t * 120) % 46), 120, 4); } }
  text(g, 'REAL', E.W * 0.29, gy + V(80, 90), { size: V(52, 60), color: '#ffd8a0', weight: 700, glow: 12 });
  text(g, 'COPIES', E.W * 0.75, gy + V(80, 90), { size: V(52, 60), color: '#7ff0ff', weight: 700, glow: 12, alpha: ease.out(prog(t, cp - 0.2, cp + 0.1)) });
  word(g, 'REAL FRIENDS', E.H * V(0.14, 0.14), ease.out(prog(t, 0.2, 0.5)), { color: '#ffd8a0' });
} });

// e15: "We want to be someone, not just dream of being someone." he steps out of the screen into the real moment
registerShot('e15', { draw(g, t, info) {
  voidBg(g, t);
  const gy = E.H * V(0.8, 0.68), M = mood('night');
  const sx = E.W / 2, sy = gy - V(470, 520), sw = V(600, 640), sh = V(420, 460);
  rr(g, sx - sw / 2 - 10, sy - sh / 2 - 10, sw + 20, sh + 20, 20); g.fillStyle = '#0c0a24'; g.fill(); g.save(); rr(g, sx - sw / 2, sy - sh / 2, sw, sh, 14); g.clip(); backdrop(g, ['#3a5ad0', '#b890f0', '#ffd8e8'], [sx - sw / 2, sy - sh / 2, sw, sh]); drawFigure(g, { x: sx, y: sy + sh * 0.42, s: V(0.9, 1.0), facing: 1, outfit: DREAMER, pose: POSES.cheer, expr: 'joy', rim: rimC('#ffffff') }); g.restore(); glow(g, sx, sy, 400, '#b890f0', 0.25);
  const k = ease.inOut(prog(t, (local(info, t, 'not') ?? 1.2), (local(info, t, 'not') ?? 1.2) + 1.4));
  drawFigure(g, { x: lerp(E.W * 0.2, E.W * 0.5, k), y: gy, s: V(1.5, 1.6), facing: 1, outfit: DREAMER, pose: k > 0 && k < 1 ? walkPose(t * 2 * Math.PI) : k >= 1 ? breathe(POSES.cheer, t) : breathe(POSES.sit, t), expr: k >= 1 ? 'determined' : 'sleepy', rim: rimC() });
  word(g, 'BE SOMEONE', E.H * V(0.14, 0.14), ease.out(prog(t, 0.2, 0.5)), { color: '#ffffff' });
  word(g, 'NOT JUST DREAM IT', E.H * V(0.14, 0.14) + V(140, 150), ease.out(prog(t, 1.4, 1.7)), { size: V(60, 68), color: '#b890ff' });
} });

// e19: "So maybe it was never about what's real. Maybe it's about what we already have." warm home, the headset left unused
registerShot('e19', { draw(g, t, info) {
  backdrop(g, ['#1a0e14', '#4a2a28', '#a8704a']); const gy = E.H * V(0.8, 0.68);
  glow(g, E.W * 0.65, gy - 400, 600, '#ffd8a0', 0.45); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, gy, E.W, E.H);
  rr(g, E.W * 0.55, gy - 150, 300, 18, 6); g.fillStyle = '#3a2420'; g.fill(); seg(g, [[E.W * 0.58, gy - 140], [E.W * 0.58, gy]], 10, '#2a1a14'); seg(g, [[E.W * 0.55 + 270, gy - 140], [E.W * 0.55 + 270, gy]], 10, '#2a1a14');
  g.strokeStyle = '#e8ecff'; g.lineWidth = 8; g.beginPath(); g.arc(E.W * 0.55 + 150, gy - 175, 34, Math.PI, Math.PI * 2.3); g.stroke(); rr(g, E.W * 0.55 + 112, gy - 172, 76, 18, 6); g.fillStyle = alpha('#7ff0ff', 0.4 + 0.2 * Math.sin(t * 2)); g.fill();
  const al = local(info, t, 'already') ?? 3.2;
  [DREAMER, ...FRIEND].forEach((of, i) => drawFigure(g, { x: E.W * (0.12 + i * 0.12), y: gy, s: V(1.1, 1.2), facing: i < 2 ? 1 : -1, outfit: of, pose: breathe(i === 0 ? POSES.relaxed : POSES.talk, t, 1, i), expr: t > al ? 'joy' : 'happy', rim: rimC('#ffd8a0', [0.6, -0.8]), blink: ((t + i) % 2.8) > 2.7 }));
  const nv = local(info, t, 'never') ?? 0.6; word(g, 'NEVER ABOUT WHAT’S REAL', E.H * V(0.14, 0.14), ease.out(prog(t, nv - 0.2, nv + 0.1)) * (1 - prog(t, al - 0.9, al - 0.6)), { size: V(60, 68), color: '#ffe0c0' });
  word(g, 'WHAT WE ALREADY HAVE', E.H * V(0.14, 0.14), ease.out(prog(t, al - 0.5, al - 0.2)), { size: V(64, 72), color: '#ffd8a0' });
  FX.dust(g, t, { count: 40, color: '#ffd8a0', a: 0.35 });
} });
