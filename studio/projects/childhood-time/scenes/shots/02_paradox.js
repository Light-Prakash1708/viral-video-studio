// shots/02_paradox.js: memory as the clock, the holiday paradox, the turn, and collecting firsts.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, wordTime, seg, circle, rr, glow, alpha, shade, mix, text, rng, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { meadow, beach, room, paper, leak, blob, polaroid, bigWord, calendar, jar, grass, GY } from '../sets/paint.js';
import { desat } from '../sets/silent.js';
import { stat } from '../sets/stat.js';
import { KID, ADULT, ADULT_BRIGHT } from '../cast.js';
import { thumbs } from './01_summer.js';

const linGrad2 = (g) => { const gr = g.createLinearGradient(0, 0, 0, E.H * 0.42); gr.addColorStop(0, 'rgba(20,12,24,.75)'); gr.addColorStop(1, 'rgba(20,12,24,0)'); return gr; };
const local = (info, t, word) => { const w = wordTime(word, info.globalT - t - 0.3); return w == null ? null : w - (info.globalT - t); };
const rimOf = (M, dir = [0.4, -1]) => ({ color: M.rim, dir, w: 5 });

// two horizontal bars "LIVING IT" vs "REMEMBERING IT"
function bars(g, t, a, b, o = {}) {
  const { y = E.H * V(0.3, 0.3), start = 0.3 } = o;
  [['WHILE LIVING IT', a, '#9fd0ff'], ['WHEN REMEMBERING', b, '#ffd27a']].forEach(([lab, v, col], i) => {
    const yy = y + i * V(150, 170), k = ease.out(prog(t, start + i * 0.8, start + i * 0.8 + 0.8)), w = (E.W * 0.82) * v * k;
    text(g, lab, E.W * 0.09, yy - V(44, 50), { size: V(32, 38), font: 'Nunito', weight: 900, color: '#fff3e0', align: 'left', spacing: 3, stroke: 6, strokeColor: 'rgba(0,0,0,.5)' });
    rr(g, E.W * 0.09, yy - 26, E.W * 0.82, 52, 26); g.fillStyle = 'rgba(20,14,10,.55)'; g.fill();
    if (w > 4) { rr(g, E.W * 0.09, yy - 26, w, 52, 26); g.fillStyle = col; g.fill(); glow(g, E.W * 0.09 + w, yy, 80, col, 0.5); }
  });
}

// p11: "And here's the strange part." the adult, close, warm window light
registerShot('p11', { draw(g, t, info) {
  blurLayer(g, 14, (g) => room(g, t, { z: 1.6, y: -200 }, { mood: 'interiorWarm', sky: 'golden', blinds: 0 })); veil(g, '#1a1008', 0.3);
  const M = mood('interiorWarm');
  bigFace(g, E.W / 2, E.H * V(0.6, 0.56), V(320, 340) * (1 + 0.06 * t / info.dur), { outfit: ADULT, expr: 'thinking', look: [0.5, -0.3], rimColor: '#ffd8a0', rimSide: 1, blink: (t % 2.6) > 2.5 });
  leak(g, t, { x: E.W, y: E.H * 0.3, a: 0.45 }); desat(g, 0.4); paper(g);
} });

// p12: "When you look back, your mind measures time by counting memories." two jars on a table
registerShot('p12', { draw(g, t, info) {
  blurLayer(g, 10, (g) => room(g, t, { z: 1.3, y: -120 }, { mood: 'interiorWarm', sky: 'golden', blinds: 0 })); veil(g, '#1a1008', 0.35);
  const y = E.H * V(0.72, 0.66);
  rr(g, -20, y + 10, E.W + 40, 40, 6); g.fillStyle = '#5a3e2a'; g.fill();
  jar(g, E.W * 0.3, y, V(1.4, 1.5), Math.floor(lerp(0, 110, ease.inOut(prog(t, 0.3, 1.8)))), { label: 'SUMMER AT 8', t });
  jar(g, E.W * 0.72, y, V(1.4, 1.5), Math.floor(lerp(0, 6, prog(t, 0.6, 1.8))), { label: 'A YEAR AT 30', warm: false, t });
  const c = local(info, t, 'counting') ?? 2.6;
  bigWord(g, 'MEMORIES = TIME', E.H * V(0.15, 0.17), ease.out(prog(t, c, c + 0.3)), { size: V(80, 92) });
  paper(g);
} });

// p13: "A summer full of firsts leaves hundreds of them, so it feels huge." the jar opens into an endless world
registerShot('p13', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: lerp(2.4, 1.0, ease.inOut(prog(t, 0, 2.2))) };
  const { M, GY: gy } = meadow(g, t, cam, { flowers: 220, seed: 31 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2, y: gy, s: V(1.2, 1.3), facing: 1, outfit: KID, pose: breathe(POSES.cheer, t), expr: 'joy', rim: rimOf(M) }));
  // polaroids spiral outward to fill the sky
  for (let i = 0; i < 18; i++) { const k = ease.out(prog(t, 0.2 + i * 0.07, 1.4 + i * 0.07)); if (k <= 0) continue; const a = i * 2.39, r = k * E.H * (0.25 + (i % 5) * 0.06); polaroid(g, E.W / 2 + Math.cos(a) * r, E.H * 0.42 + Math.sin(a) * r * 0.7, 0.42, Math.sin(i) * 0.4, '', Object.values(thumbs)[i % 5]); }
  const h = local(info, t, 'hundreds') ?? 1.3, hg = local(info, t, 'huge') ?? 2.7;
  stat(g, { label: 'A SUMMER OF FIRSTS', value: 'HUNDREDS', x: E.W / 2, y: E.H * V(0.13, 0.14), color: '#ffd27a', a: ease.out(prog(t, h, h + 0.25)), pulse: t - h, size: V(100, 116) });
  bigWord(g, 'FEELS HUGE', E.H * V(0.86, 0.66), ease.out(prog(t, hg, hg + 0.3)), { size: V(84, 96) });
  leak(g, t); paper(g);
} });

// p14: "A year of routine leaves only a few, so it feels like it vanished." 365 grey days fold into a sliver
registerShot('p14', { draw(g, t, info) {
  g.fillStyle = '#2e3034'; g.fillRect(0, 0, E.W, E.H);
  const fold = ease.inOut(prog(t, (local(info, t, 'vanished') ?? 2.6) - 1.0, info.dur - 0.2));
  const cols = 15, rows = 25, cw = E.W * 0.8 / cols, ch = E.H * 0.5 / rows, x0 = E.W * 0.1, y0 = E.H * V(0.28, 0.3);
  for (let i = 0; i < 365; i++) {
    const c = i % cols, r = Math.floor(i / cols), sx = x0 + c * cw, sy = y0 + r * ch * (1 - fold * 0.97);
    g.fillStyle = [17, 140, 251].includes(i) ? '#ffd27a' : '#6a6e74'; g.fillRect(sx + 1, sy + 1, cw - 3, Math.max(1, ch * (1 - fold * 0.97) - 3));
  }
  const f = local(info, t, 'few') ?? 1.6;
  stat(g, { label: 'A YEAR OF ROUTINE', value: 'ONLY A FEW', x: E.W / 2, y: E.H * V(0.13, 0.14), color: '#c8ccd2', a: ease.out(prog(t, f, f + 0.25)), pulse: t - f, size: V(96, 110) });
  bigWord(g, 'VANISHED', E.H * V(0.86, 0.68), ease.out(prog(t, info.dur - 1.0, info.dur - 0.7)), { size: V(84, 96), color: '#d8dce0' });
  paper(g, 0.3);
} });

// p15: "Psychologist Claudia Hammond calls this the holiday paradox." title card over a painted beach
registerShot('p15', { draw(g, t, info) {
  blurLayer(g, 8, (g) => beach(g, t, { z: 1.1 })); veil(g, '#1a1008', 0.45);
  const hp = local(info, t, 'holiday') ?? 2.0;
  text(g, 'PSYCHOLOGIST CLAUDIA HAMMOND', E.W / 2, E.H * V(0.3, 0.32), { size: V(36, 42), font: 'Nunito', weight: 900, color: '#f2d8b0', spacing: 4, alpha: ease.out(prog(t, 0.3, 0.7)), stroke: 6, strokeColor: 'rgba(0,0,0,.5)' });
  bigWord(g, 'THE HOLIDAY', E.H * V(0.42, 0.42), ease.out(prog(t, hp, hp + 0.35)), { size: V(110, 128) });
  bigWord(g, 'PARADOX', E.H * V(0.42, 0.42) + V(150, 170), ease.out(prog(t, hp + 0.3, hp + 0.65)), { size: V(130, 150), color: '#ffd27a' });
  leak(g, t, { a: 0.5 }); paper(g);
} });

// p16: "A great holiday flies by while you're living it, but in memory, it stretches out."
registerShot('p16', { draw(g, t, info) {
  const cam = { z: 1.1 + 0.05 * t / info.dur };
  const { M, GY: gy } = beach(g, t * 3, cam);   // time races
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.5, y: gy, s: V(1.4, 1.5), facing: 1, outfit: ADULT_BRIGHT, pose: breathe(POSES.cheer, t), expr: 'joy', rim: rimOf(M) }));
  const st = local(info, t, 'stretches') ?? 2.6;
  bars(g, t, 0.18, t > st ? 0.95 : 0.0, { start: 0.4 });
  leak(g, t); paper(g);
} });

// p17: "A boring week crawls while you're in it, then shrinks to almost nothing." a waiting room, a slow clock
registerShot('p17', { draw(g, t, info) {
  const cam = { z: 1.12 + 0.03 * t / info.dur };
  const { M, GY: gy } = room(g, t, cam, { mood: 'interiorCool' });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 4; i++) FX.chair(g, E.W * 0.2 + i * V(220, 200), gy, 1.6, '#3a3e44'); drawFigure(g, { x: E.W * 0.42, y: gy, s: V(1.6, 1.7), facing: 1, outfit: ADULT, pose: breathe(POSES.sitBack, t, 0.5), expr: 'sleepy', rim: rimOf(M), blink: (t % 1.8) > 1.4 }); FX.clock(g, E.W * 0.8, gy - V(380, 430), 70, t * 0.2); });
  desat(g, 0.85);
  const sh = local(info, t, 'shrinks') ?? 2.2;
  bars(g, t, 0.95, t > sh ? 0.05 : 0.0, { start: 0.3, y: E.H * V(0.14, 0.14) });
  paper(g, 0.3);
} });

// p18: "So time doesn't really speed up as you get older. Your days just start to look the same." a grid of identical days, one lights up
registerShot('p18', { draw(g, t, info) {
  g.fillStyle = '#2e3034'; g.fillRect(0, 0, E.W, E.H);
  const look = local(info, t, 'look') ?? 2.8, lit = ease.out(prog(t, look, look + 0.6));
  for (let i = 0; i < 49; i++) { const c = i % 7, r = Math.floor(i / 7), x = E.W * 0.12 + c * E.W * 0.11, y = E.H * V(0.36, 0.34) + r * E.W * 0.11; const k = ease.outBack(prog(t, i * 0.02, i * 0.02 + 0.3)); g.save(); g.translate(x + E.W * 0.045, y + E.W * 0.045); g.scale(k, k); rr(g, -E.W * 0.045, -E.W * 0.045, E.W * 0.09, E.W * 0.09, 10); g.fillStyle = i === 24 ? mix('#6a6e74', '#ffd27a', lit) : '#6a6e74'; g.fill(); g.restore(); if (i === 24 && lit > 0) glow(g, x + E.W * 0.045, y + E.W * 0.045, 220 * lit, '#ffd27a', 0.6); }
  bigWord(g, "TIME ISN'T FASTER", E.H * V(0.13, 0.14), ease.out(prog(t, 0.3, 0.6)) * (1 - prog(t, look - 0.4, look - 0.1)), { size: V(76, 88) });
  bigWord(g, 'DAYS LOOK THE SAME', E.H * V(0.13, 0.14), ease.out(prog(t, look - 0.1, look + 0.2)), { size: V(72, 84), color: '#ffd27a' });
  paper(g, 0.3);
} });

// p19: "Want a longer life? Collect more firsts." the adult steps onto a new path at sunrise, colour floods back
registerShot('p19', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.12 - 0.08 * ease.inOut(p) };
  const { M, GY: gy, fg } = meadow(g, t, cam, { mood: 'golden', sunX: 0.62, seed: 41, flowers: 200 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: lerp(E.W * 0.25, E.W * 0.45, ease.inOut(p)), y: gy, s: V(1.6, 1.7), facing: 1, outfit: ADULT_BRIGHT, pose: walkPose(t * 2 * Math.PI * 0.9), expr: 'smile', rim: rimOf(M) }));
  const col = local(info, t, 'collect') ?? 0.9;
  desat(g, 0.9 * (1 - ease.inOut(prog(t, col - 0.2, col + 1.2))));
  const k = ease.outBack(prog(t, col + 0.6, col + 1.0));
  if (k > 0) polaroid(g, E.W / 2 + V(240, 180), E.H * V(0.3, 0.28), V(1.0, 1.1) * k, -0.08, 'FIRST ___', thumbs.new);
  bigWord(g, 'COLLECT MORE FIRSTS', E.H * V(0.14, 0.15), ease.out(prog(t, col, col + 0.3)), { size: V(72, 84), color: '#ffd27a' });
  fg();
  FX.godRays(g, E.W * 0.62, gy - V(520, 820), { count: 9, len: V(1800, 2200), color: M.key, a: 0.08 * (1 - (1 - p)), t });
  leak(g, t, { a: 0.5 }); paper(g);
} });

// p20: end card: the adult and the kid side by side at sunset
registerShot('p20', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.05 * t / info.dur };
  const { M, GY: gy, fg } = meadow(g, t, cam, { mood: 'dusk', sunX: 0.5, seed: 55, flowers: 120 });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W * 0.4, y: gy, s: V(1.5, 1.6), facing: 1, outfit: ADULT_BRIGHT, pose: breathe(POSES.relaxed, t), expr: 'smile', rim: rimOf(M, [0.3, -1]) });
    drawFigure(g, { x: E.W * 0.58, y: gy, s: V(1.5, 1.6), facing: -1, outfit: KID, pose: breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.wave]]), t, 1, 3), expr: 'happy', rim: rimOf(M, [-0.3, -1]) });
  });
  fg();
  const a = ease.out(prog(t, 0.4, 1.0));
  g.fillStyle = linGrad2(g); g.fillRect(0, 0, E.W, E.H * 0.42);
  text(g, 'When was the last time', E.W / 2, E.H * V(0.16, 0.17), { size: V(58, 66), font: 'Playfair Display', weight: 900, italic: true, color: '#fff3e0', alpha: a, glow: 18, glowColor: 'rgba(255,170,90,.6)', stroke: 6, strokeColor: 'rgba(0,0,0,.4)' });
  text(g, 'you did something', E.W / 2, E.H * V(0.16, 0.17) + V(76, 86), { size: V(58, 66), font: 'Playfair Display', weight: 900, italic: true, color: '#fff3e0', alpha: a, glow: 18, glowColor: 'rgba(255,170,90,.6)', stroke: 6, strokeColor: 'rgba(0,0,0,.4)' });
  text(g, 'for the first time?', E.W / 2, E.H * V(0.16, 0.17) + V(152, 172), { size: V(64, 72), font: 'Playfair Display', weight: 900, italic: true, color: '#ffd27a', alpha: a, glow: 18, glowColor: 'rgba(255,170,90,.6)', stroke: 6, strokeColor: 'rgba(0,0,0,.4)' });
  bigWord(g, 'TELL ME IN THE COMMENTS', E.H * V(0.88, 0.8), ease.out(prog(t, 2.6, 3.0)), { size: V(50, 58) });
  leak(g, t, { a: 0.45 }); paper(g);
} });
