// shots/01_summer.js: the hook, the endless summer, the firsts, the memory jar, the grey adult loop.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, wordTime, seg, poly, circle, rr, glow, alpha, shade, mix, text, rng, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { meadow, beach, room, paper, leak, blob, polaroid, bigWord, calendar, jar, grass, GY } from '../sets/paint.js';
import { desat } from '../sets/silent.js';
import { stat } from '../sets/stat.js';
import { KID, ADULT } from '../cast.js';

export const local = (info, t, word) => { const w = wordTime(word, info.globalT - t - 0.3); return w == null ? null : w - (info.globalT - t); };
const rimOf = (M, dir = [0.4, -1]) => ({ color: M.rim, dir, w: 5 });
// tiny paintings used inside polaroids
export const thumbs = {
  sea: (g) => { g.fillStyle = '#7cc4e8'; g.fillRect(-110, -120, 220, 100); g.fillStyle = '#3a8ac8'; g.fillRect(-110, -20, 220, 60); g.fillStyle = '#f2dcae'; g.fillRect(-110, 40, 220, 60); circle(g, -10, 0, 16, '#1a1410'); circle(g, 30, -10, 30, alpha('#ffffff', 0.5)); },
  knee: (g) => { g.fillStyle = '#9fc86a'; g.fillRect(-110, -120, 220, 220); seg(g, [[-60, 40], [40, -10]], 22, '#1a1410'); rr(g, -12, 0, 36, 22, 6); g.fillStyle = '#f4d0b0'; g.fill(); seg(g, [[-6, 11], [18, 11]], 3, '#d64a33'); },
  firefly: (g) => { g.fillStyle = '#2a2a5a'; g.fillRect(-110, -120, 220, 220); rr(g, -34, -50, 68, 100, 14); g.strokeStyle = '#fff'; g.lineWidth = 4; g.stroke(); for (let i = 0; i < 4; i++) glow(g, -12 + i * 9, -10 + (i % 2) * 18, 30, '#ffe87a', 0.9); },
  sun: (g) => { g.fillStyle = '#f2b880'; g.fillRect(-110, -120, 220, 220); glow(g, 30, -40, 90, '#fff4dc', 0.9); g.fillStyle = '#7aa84a'; g.fillRect(-110, 30, 220, 70); },
  new: (g) => { g.fillStyle = '#ffd08a'; g.fillRect(-110, -120, 220, 220); glow(g, 0, 0, 120, '#ffffff', 0.7); },
};

// p01: "Why did one summer as a child feel like an entire lifetime," the summer expands
registerShot('p01', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: lerp(1.45, 1.0, ease.inOut(p)), y: lerp(-80, 0, p) };
  const { M, GY: gy, fg } = meadow(g, t, cam, { flowers: 180 });
  layer(g, cam, 1, (g) => { const x = lerp(E.W * 0.2, E.W * 0.7, ease.inOut(p)); drawFigure(g, { x, y: gy + V(10, 30), s: V(1.5, 1.6), facing: 1, outfit: KID, pose: walkPose(t * 2 * Math.PI * 1.6, { run: true }), expr: 'joy', rim: rimOf(M) }); });
  // the world blooms: butterflies / petals drift outward
  for (let i = 0; i < 26; i++) { const a = i * 2.4, r = (t * 160 + i * 60) % (E.H * 0.7); FX.sparkle(g, E.W / 2 + Math.cos(a) * r, E.H * 0.45 + Math.sin(a) * r * 0.8, 10, ['#fff4d0', '#ffb0d0', '#ffd27a'][i % 3], 0.6); }
  fg();
  leak(g, t, { x: E.W * 0.8, y: E.H * 0.15 }); paper(g);
} });

// p02: "but an entire year now just disappears?" grey office, the calendar rips through 12 months
registerShot('p02', { draw(g, t, info) {
  const cam = { z: 1.15 + 0.08 * t / info.dur };
  const { M, GY: gy } = room(g, t, cam, { mood: 'interiorCool' });
  const flip = ease.in(prog(t, 0.3, info.dur - 0.2)) * 12;
  layer(g, cam, 1, (g) => {
    calendar(g, E.W / 2 + V(200, 150), gy - V(560, 700), V(1.0, 1.15), flip);
    rr(g, E.W / 2 - V(320, 280), gy - 150, V(560, 500), 20, 6); g.fillStyle = '#3a3e44'; g.fill();
    drawFigure(g, { x: E.W / 2 - V(280, 240), y: gy, s: V(1.6, 1.7), facing: 1, outfit: ADULT, pose: breathe(POSES.sit, t), expr: 'sleepy', rim: rimOf(M) });
  });
  desat(g, 0.75);
  const dis = local(info, t, 'disappears') ?? 2.0;
  bigWord(g, 'GONE.', E.H * V(0.15, 0.17), ease.out(prog(t, dis, dis + 0.3)) * (1 - prog(t, info.dur - 0.25, info.dur)));
  for (let i = 0; i < 5; i++) { const k = prog(t, 0.4 + i * 0.4, 1.4 + i * 0.4); if (k > 0 && k < 1) { g.save(); g.globalAlpha = 1 - k; rr(g, E.W / 2 + V(200, 150) - 140 + k * 400, gy - V(600, 740) - k * 300, 280, 320, 10); g.fillStyle = '#f4f0e8'; g.fill(); g.restore(); } }
  paper(g);
} });

// p03: "When you were eight, one summer had everything." the kid on a hill at golden hour, title
registerShot('p03', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.05 + 0.06 * ease.inOut(p), x: 30 * p };
  const { M, GY: gy, fg } = meadow(g, t + 3, cam, { sunX: 0.5, seed: 8 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.38, y: gy, s: V(1.4, 1.5), facing: 1, outfit: KID, pose: breathe(POSES.cheer, t), expr: 'happy', rim: rimOf(M, [0.4, -1]) }));
  fg();
  FX.godRays(g, E.W * 0.5, GY() - V(520, 820), { count: 8, len: V(1600, 2000), color: M.key, a: 0.07, t });
  const e = local(info, t, 'eight') ?? 0.4;
  bigWord(g, 'AGE 8', E.H * V(0.14, 0.15), ease.out(prog(t, e, e + 0.3)), { sub: 'ONE SUMMER. EVERYTHING.' });
  leak(g, t); paper(g);
} });

// helper for the three "firsts": a scene plus a polaroid that develops and flies to the corner
function firstShot(g, t, info, set, act, cap, thumb) {
  const p = t / info.dur, cam = { z: 1.15 + 0.08 * ease.inOut(p) };
  const { M, GY: gy } = set(g, t, cam);
  layer(g, cam, 1, (g) => act(g, gy, M));
  const k = ease.outBack(prog(t, 0.45, 0.85));
  polaroid(g, E.W / 2 + V(240, 170), E.H * V(0.22, 0.2), V(1.0, 1.1) * k, 0.08, cap, thumb, { a: clamp(k) });
  g.save(); g.globalAlpha = 0.6 * (1 - prog(t, 0.45, 0.8)); g.fillStyle = '#fff'; g.fillRect(0, 0, E.W, E.H); g.restore(); // camera flash
  leak(g, t); paper(g);
}
// p04: "The first time you swam in the sea."
registerShot('p04', { draw(g, t, info) { firstShot(g, t, info, beach, (g, gy, M) => { drawFigure(g, { x: E.W * 0.4, y: gy - 10 + Math.sin(t * 6) * 8, s: V(1.5, 1.6), facing: 1, outfit: KID, pose: posesAt(t, [[0, POSES.cheer], [0.8, POSES.jump]]), expr: 'joy', rim: rimOf(M), shadow: false }); for (let i = 0; i < 12; i++) circle(g, E.W * 0.4 + Math.cos(i) * (40 + t * 60), gy - 30 - Math.abs(Math.sin(i * 2 + t * 4)) * 60, 6, alpha('#ffffff', 0.7)); }, 'FIRST SWIM', thumbs.sea); } });
// p05: "The first scraped knee."
registerShot('p05', { draw(g, t, info) { firstShot(g, t, info, (g, t, c) => meadow(g, t, c, { flowers: 60, seed: 12 }), (g, gy, M) => { drawFigure(g, { x: E.W * 0.42, y: gy, s: V(1.5, 1.6), facing: 1, outfit: KID, pose: breathe(POSES.sit, t), expr: t > 0.5 ? 'cry' : 'shocked', rim: rimOf(M) }); seg(g, [[E.W * 0.6, gy - 30], [E.W * 0.8, gy - 70]], 10, '#3a3a3a'); circle(g, E.W * 0.6, gy - 20, 28, '#2a2a2a'); circle(g, E.W * 0.8, gy - 30, 28, '#2a2a2a'); }, 'FIRST SCRAPE', thumbs.knee); } });
// p06: "The first firefly in a jar."
registerShot('p06', { draw(g, t, info) { firstShot(g, t, info, (g, t, c) => meadow(g, t, c, { mood: 'dusk', flowers: 20, seed: 14 }), (g, gy, M) => { drawFigure(g, { x: E.W * 0.42, y: gy, s: V(1.5, 1.6), facing: 1, outfit: KID, pose: breathe(POSES.holdFront, t), expr: 'awe', rim: { color: '#ffe87a', dir: [0.6, -0.3], w: 5 } }); const jx = E.W * 0.42 + V(70, 70), jy = gy - V(230, 245); rr(g, jx - 26, jy - 40, 52, 76, 12); g.strokeStyle = '#fff'; g.lineWidth = 4; g.stroke(); glow(g, jx, jy, 220, '#ffe87a', 0.7); for (let i = 0; i < 30; i++) { const x = (i * 97 % E.W), y = gy - 100 - (i * 53 % 500) + Math.sin(t * 2 + i) * 20; glow(g, x, y, 18, '#ffe87a', 0.8 * Math.abs(Math.sin(t * 3 + i))); } }, 'FIRST FIREFLY', thumbs.firefly); } });

// p07: "Your brain saved all of it, because all of it was new." the memory jar fills
registerShot('p07', { draw(g, t, info) {
  blurLayer(g, 12, (g) => meadow(g, t, { z: 1.3 }, { mood: 'golden' })); veil(g, '#1a1008', 0.35);
  const n = Math.floor(lerp(3, 140, ease.inOut(prog(t, 0.2, info.dur - 0.3))));
  jar(g, E.W / 2, E.H * V(0.72, 0.66), V(2.0, 2.2), n, { t });
  for (let i = 0; i < 8; i++) { const k = prog(t, i * 0.3, i * 0.3 + 0.9); if (k <= 0 || k >= 1) continue; const sx = E.W * (i % 2 ? 0.1 : 0.9), sy = E.H * (0.3 + (i % 4) * 0.08); polaroid(g, lerp(sx, E.W / 2, ease.in(k)), lerp(sy, E.H * 0.5, ease.in(k)), lerp(0.6, 0.1, k), i * 0.4, '', Object.values(thumbs)[i % 4]); }
  stat(g, { label: 'MEMORIES SAVED', value: String(n), x: E.W / 2, y: E.H * V(0.15, 0.16), color: '#ffd27a', pulse: 9 });
  const nw = local(info, t, 'new') ?? 2.2;
  bigWord(g, 'ALL NEW', E.H * V(0.3, 0.3), ease.out(prog(t, nw, nw + 0.3)), { size: V(80, 92) });
  paper(g);
} });

// p08: "Now look at an adult year." the window: the kid's reflection becomes the adult, colour drains
registerShot('p08', { draw(g, t, info) {
  const cam = { z: 1.1 + 0.06 * t / info.dur };
  const { M, GY: gy } = room(g, t, cam, { mood: 'interiorWarm', sky: 'golden', blinds: 0 });
  const k = ease.inOut(prog(t, 0.2, 1.0));
  layer(g, cam, 1, (g) => {
    g.save(); g.globalAlpha = 1 - k; drawFigure(g, { x: E.W / 2, y: gy, s: V(1.7, 1.8), facing: 1, outfit: KID, pose: breathe(POSES.stand, t), expr: 'happy', rim: rimOf(M) }); g.restore();
    g.save(); g.globalAlpha = k; drawFigure(g, { x: E.W / 2, y: gy, s: V(1.7, 1.8), facing: 1, outfit: ADULT, pose: breathe(POSES.stand, t), expr: 'neutral', rim: rimOf(M) }); g.restore();
  });
  desat(g, 0.85 * k);
  bigWord(g, 'NOW', E.H * V(0.15, 0.17), ease.out(prog(t, 0.6, 0.9)), { sub: 'AN ADULT YEAR' });
  paper(g);
} });

// p09: "Wake up, commute, work, scroll, sleep... and repeat." clean spot-lit vignettes, one per beat
const BEATS = [0.5, 0.86, 1.28, 1.68, 2.02, 2.72];   // seconds into the shot (spliced narration)
function stage(g, t, k) {
  g.fillStyle = '#25272b'; g.fillRect(0, 0, E.W, E.H);
  const cx = E.W / 2, cy = E.H * 0.52;
  g.save(); g.globalCompositeOperation = 'screen'; const gr = g.createRadialGradient(cx, cy, 0, cx, cy, E.W * 0.75); gr.addColorStop(0, 'rgba(210,200,185,.32)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); g.restore();
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(cx, E.H * 0.66, E.W * 0.36, 34, 0, 0, 7); g.fill();
}
registerShot('p09', { draw(g, t, info) {
  let i = 0; for (let k = 0; k < BEATS.length; k++) if (t >= BEATS[k] - 0.06) i = k;
  const since = t - BEATS[i], pop = ease.outBack(clamp(since / 0.22)), cx = E.W / 2, gy = E.H * 0.66, M = mood('interiorCool');
  stage(g, t);
  const rim = { color: '#e8e4dc', dir: [0.3, -1], w: 4 };
  g.save(); g.translate(cx, gy); g.scale(0.92 + 0.08 * pop, 0.92 + 0.08 * pop); g.translate(-cx, -gy);
  if (i === 0) { FX.bed(g, { x: cx - 230, y: gy, w: 460, color: '#5a5e66', frame: '#1e2024', pillow: '#b8b8bc' }); drawFigure(g, { x: cx - 40, y: gy - 66, s: 1.5, facing: 1, outfit: ADULT, pose: POSES.sit, expr: 'sleepy', rim, shadow: false }); const sh = Math.sin(t * 60) * 6 * (since < 0.4 ? 1 : 0); FX.clock(g, cx + 170 + sh, gy - 330, 64, 6.5); }
  if (i === 1) { rr(g, cx - 380, gy - 520, 760, 330, 30); g.fillStyle = '#4a4f57'; g.fill(); for (let w = 0; w < 4; w++) { rr(g, cx - 360 + ((w * 190 - t * 500) % 760 + 760) % 760, gy - 490, 150, 120, 12); g.fillStyle = '#8a949c'; g.fill(); } seg(g, [[cx - 20, gy - 560], [cx - 20, gy - 440]], 8, '#1e2024'); drawFigure(g, { x: cx, y: gy, s: 1.65, facing: 1, outfit: ADULT, pose: { ...POSES.stand, eB: [-6, -200], hB: [-18, -240] }, expr: 'sleepy', rim }); }
  if (i === 2) { rr(g, cx - 260, gy - 175, 520, 18, 6); g.fillStyle = '#4a4e54'; g.fill(); seg(g, [[cx - 230, gy - 165], [cx - 230, gy]], 10, '#3a3e44'); seg(g, [[cx + 230, gy - 165], [cx + 230, gy]], 10, '#3a3e44'); FX.screen(g, { x: cx - 10, y: gy - 360, w: 220, h: 150, bg: '#4a5a6a', glowC: '#cfe0f0', a: 0.3 }); FX.chair(g, cx - 150, gy, 1.5, '#2a2c30'); drawFigure(g, { x: cx - 130, y: gy, s: 1.55, facing: 1, outfit: ADULT, pose: { ...POSES.sit, eF: [34, -128], hF: [62, -132] }, expr: 'sleepy', rim, shadow: false }); }
  if (i === 3) { rr(g, cx - 150, gy - 600, 300, 540, 36); g.fillStyle = '#121418'; g.fill(); g.save(); g.beginPath(); g.rect(cx - 130, gy - 570, 260, 480); g.clip(); g.fillStyle = '#2e3440'; g.fillRect(cx - 130, gy - 570, 260, 480); for (let r = 0; r < 7; r++) { rr(g, cx - 115, gy - 570 + ((r * 90 - since * 700) % 630 + 630) % 630 - 40, 230, 70, 12); g.fillStyle = '#4a5260'; g.fill(); } g.restore(); glow(g, cx, gy - 330, 360, '#bfe6ff', 0.25); seg(g, [[cx + 60, gy - 120], [cx + 200, gy + 60]], 70, '#0e0f12'); circle(g, cx + 40, gy - 150, 38, '#0e0f12'); }
  if (i === 4) { FX.bed(g, { x: cx - 260, y: gy, w: 520, color: '#3e424a', frame: '#16181c', pillow: '#9a9aa0' }); drawFigure(g, { x: cx - 20, y: gy - 56, s: 1.45, facing: 1, outfit: ADULT, pose: POSES.lie, rot: -Math.PI / 2, expr: 'sleepy', rim, shadow: false }); FX.moon(g, cx + 250, gy - 520, 44); }
  if (i === 5) { const icons = ['WAKE', 'COMMUTE', 'WORK', 'SCROLL', 'SLEEP']; const R = 230, rot = since * 2.4; g.strokeStyle = '#d8d4cc'; g.lineWidth = 14; g.beginPath(); g.arc(cx, gy - 300, R, 0, Math.PI * 1.85); g.stroke(); poly(g, [[cx + R + 30, gy - 300 - 10], [cx + R - 30, gy - 300 - 10], [cx + R, gy - 300 + 40]], '#d8d4cc');
    icons.forEach((w, j) => { const a = rot + (j / icons.length) * Math.PI * 2; const x = cx + Math.cos(a) * R, y = gy - 300 + Math.sin(a) * R; rr(g, x - 78, y - 26, 156, 52, 26); g.fillStyle = '#3a3e44'; g.fill(); text(g, w, x, y + 2, { size: 26, font: 'Nunito', weight: 900, color: '#d8d4cc', spacing: 2 }); }); }
  g.restore();
  desat(g, 0.85);
  const label = ['WAKE UP', 'COMMUTE', 'WORK', 'SCROLL', 'SLEEP', 'REPEAT'][i];
  bigWord(g, label, E.H * V(0.2, 0.2), clamp(since / 0.08 + 0.3), { scale: 0.9 + 0.1 * pop, color: i === 5 ? '#ffd27a' : '#fff3e0' });
  paper(g, 0.25);
} });

// p10: "Your brain doesn't need to save the same Tuesday twice, so it doesn't." identical Tuesdays collapse into one
registerShot('p10', { draw(g, t, info) {
  g.fillStyle = '#2a2c30'; g.fillRect(0, 0, E.W, E.H);
  const merge = ease.inOut(prog(t, (local(info, t, 'so') ?? 2.0) - 0.2, info.dur - 0.4));
  for (let i = 0; i < 12; i++) {
    const appear = ease.outBack(prog(t, i * 0.12, i * 0.12 + 0.3)); if (appear <= 0) continue;
    const gx = (i % 3 - 1) * V(300, 300), gyy = (Math.floor(i / 3) - 1.5) * V(220, 240);
    const x = E.W / 2 + gx * (1 - merge), y = E.H * 0.52 + gyy * (1 - merge);
    g.save(); g.translate(x, y); g.scale(appear * 0.95, appear * 0.95); rr(g, -120, -80, 240, 160, 14); g.fillStyle = '#c8c8cc'; g.fill(); text(g, 'TUESDAY', 0, 0, { size: 40, font: 'Nunito', weight: 900, color: '#5a5a60', spacing: 3 }); g.restore();
  }
  const tw = local(info, t, 'twice') ?? 1.6;
  bigWord(g, 'SAME DAY. SAVED ONCE.', E.H * V(0.15, 0.17), ease.out(prog(t, tw, tw + 0.3)), { size: V(68, 76) });
  jar(g, E.W / 2, E.H * V(0.92, 0.84), 0.8, merge > 0.9 ? 1 : 0, { warm: false, t });
  paper(g, 0.3);
} });
