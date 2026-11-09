// shots/01_test.js: hook, the passing test, the freeze, the reveal and the replay.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, wordTime, seg, circle, rr, glow, alpha, shade, text, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { stat } from '../sets/stat.js';
import { gym, passTest, gorilla, gorillaAt, GORILLA, WHITE_PASSES, GY } from '../sets/gym.js';
import { YOU } from '../cast.js';

export const local = (info, t, word, n = 0) => { const w = wordTime(word, info.globalT - t - 0.3 + n); return w == null ? null : w - (info.globalT - t); };
const pill = (g, str, y, color = S().ui.gold) => {
  const w = V(760, 920);
  rr(g, E.W / 2 - w / 2, y - V(44, 50), w, V(88, 100), 44); g.fillStyle = 'rgba(8,12,24,.7)'; g.fill();
  text(g, str, E.W / 2, y + 2, { size: V(44, 50), font: 'Nunito', weight: 900, color, spacing: 3 });
};

// g01: "You might miss a gorilla walking right in front of you." you stare at your phone, a gorilla strolls past behind
registerShot('g01', { draw(g, t, info) {
  const cam = { z: 1.05 + 0.08 * ease.inOut(t / info.dur), x: -20 };
  const { M, GY: gy } = gym(g, t, cam);
  layer(g, cam, 1, (g) => {
    const gx = lerp(E.W + 220, -240, ease.inOut(prog(t, 0.2, info.dur)));
    gorilla(g, { x: gx, y: gy - V(20, 40), s: V(1.2, 1.35), t, mode: 'walk', facing: -1, rim: M.rim });
    drawFigure(g, { x: E.W / 2 - V(120, 60), y: gy + V(40, 80), s: V(1.8, 1.9), facing: 1, outfit: YOU, pose: breathe(POSES.phone, t), prop: 'phone', expr: 'smile', look: [0.4, 0.6], rim: { color: M.rim, dir: [0.4, -1], w: 4 } });
  });
  FX.dust(g, t, { count: 40, color: '#fff3d0', a: 0.35 });
} });

// g02: "Don't believe me?"
registerShot('g02', { draw(g, t, info) {
  blurLayer(g, 14, (g) => gym(g, t, { z: 1.5, y: -150 })); veil(g, '#0c0a14', 0.3);
  const M = mood('golden');
  bigFace(g, E.W / 2, E.H * V(0.62, 0.56) + Math.sin(t * 3) * 4, V(300, 320) * (1 + 0.05 * t), { outfit: YOU, expr: 'smirk', look: [0.2, 0], rimColor: M.rim, rimSide: -1 });
} });

// g03: THE TEST. One continuous take: count the white team's passes. The gorilla crosses mid-take.
registerShot('g03', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.03 * t / info.dur };
  const { M } = gym(g, t, cam);
  passTest(g, t, cam, { M });
  pill(g, 'COUNT THE WHITE PASSES', E.H * V(0.1, 0.13));
  // ticking stopwatch ring around the frame top
  const k = clamp(t / info.dur); g.strokeStyle = alpha(S().ui.gold, 0.9); g.lineWidth = 10; g.beginPath(); g.moveTo(E.W * 0.15, E.H * V(0.1, 0.13) + V(70, 80)); g.lineTo(E.W * (0.15 + 0.7 * (1 - k)), E.H * V(0.1, 0.13) + V(70, 80)); g.stroke();
} });

// g04: "Okay, stop. How many did you get? It's seven." the court freezes, the answer pops
registerShot('g04', { draw(g, t, info) {
  const cam = { z: 1.06 + 0.04 * t / info.dur };
  const { M } = gym(g, 9.4, cam);
  passTest(g, 9.35, cam, { M, showGorilla: false });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  FX.drops(g, t, { count: 30, color: '#e0e8ff', rMax: 6, drift: 2 });
  UI.badge(g, { str: 'PAUSED', a: ease.out(prog(t, 0.1, 0.4)) });
  const sev = local(info, t, 'seven') ?? 2.0;
  stat(g, { label: 'WHITE TEAM PASSES', value: t < sev ? '?' : '7', x: E.W / 2, y: E.H * V(0.14, 0.16), pulse: t - sev, a: ease.out(prog(t, 0.6, 0.9)) });
} });

// g05: "But here's the real question. Did you see the gorilla?"
registerShot('g05', { draw(g, t, info) {
  blurLayer(g, 14, (g) => gym(g, t, { z: 1.5, y: -150 })); veil(g, '#0c0a14', 0.35);
  const M = mood('golden'), gw = local(info, t, 'gorilla') ?? 1.9;
  const zoom = t > gw ? 1.12 : 1;
  const [sx, sy] = t > gw ? shake(t, 10 * (1 - prog(t, gw, gw + 0.4)), 30) : [0, 0];
  bigFace(g, E.W / 2 + sx, E.H * V(0.62, 0.56) + sy, V(300, 320) * zoom, { outfit: YOU, expr: t > gw ? 'shocked' : 'thinking', rimColor: M.rim, rimSide: -1, blink: (t % 2.9) > 2.8 });
  if (t > gw) { const a = ease.outBack(prog(t, gw, gw + 0.35)); g.save(); g.translate(E.W / 2, E.H * V(0.16, 0.18)); g.scale(a, a); text(g, 'THE GORILLA?!', 0, 0, { size: V(96, 110), color: S().ui.accent, glow: 24, stroke: 10, strokeColor: 'rgba(0,0,0,.6)' }); g.restore(); }
} });

// g06: "Let's rewind. A gorilla walked right through the middle, stopped, and beat its chest."
registerShot('g06', { draw(g, t, info) {
  const rw = 0.8, tt = t < rw ? lerp(9.4, 3.3, ease.inOut(t / rw)) : 3.3 + (t - rw);
  const ga = gorillaAt(Math.max(tt, 3.3)), zk = ease.inOut(prog(t, rw + 0.6, rw + 1.6));
  const cam = { z: lerp(1.04, 1.9, zk), x: lerp(0, ga.x - E.W / 2, zk), y: lerp(0, ga.y - 140 * ga.s - E.H / 2, zk) };
  const { M } = gym(g, tt, cam);
  passTest(g, tt, cam, { M, highlight: clamp((tt - 3.5) / 0.4) });
  if (t < rw) {   // VHS rewind look
    for (let i = 0; i < 14; i++) { const y = ((i * 173 + t * 2600) % E.H); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, y, E.W, 6 + (i % 3) * 4); }
    veil(g, '#203060', 0.18);
  }
  pill(g, t < rw ? '◀◀ REWIND' : 'WATCH THE MIDDLE', E.H * V(0.1, 0.13), t < rw ? '#ffffff' : S().ui.accent);
  const bt = local(info, t, 'beat');
  if (bt != null && t > bt) text(g, 'THUMP THUMP', E.W / 2, E.H * V(0.33, 0.3), { size: V(64, 74), color: S().ui.gold, glow: 18, stroke: 8, strokeColor: 'rgba(0,0,0,.5)', alpha: 1 - prog(t, bt + 1.2, bt + 1.6) });
} });

// g07: title card "THE INVISIBLE GORILLA"
registerShot('g07', { draw(g, t, info) {
  blurLayer(g, 10, (g) => gym(g, t, { z: 1.1 }));
  veil(g, '#0c0a14', 0.4);
  const M = mood('golden');
  gorilla(g, { x: E.W / 2, y: E.H * V(0.86, 0.72), s: V(1.5, 1.8), t: t * 2, mode: t > 0.6 ? 'beat' : 'stand', facing: 0, rim: M.rim, alpha: 0.35 + 0.15 * Math.sin(t * 2) });
  UI.titleCard(g, t, { lines: ['THE INVISIBLE', 'GORILLA'], sub: 'EXPERIMENT', dur: info.dur, y: E.H * V(0.3, 0.26) });
} });
