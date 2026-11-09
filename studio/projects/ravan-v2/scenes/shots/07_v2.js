// shots/07_v2.js: v2 additions: Ravan's hook, chapter cards, the philosophy-dialogue room, the ember ending.
import { E, V, registerShot, ease, prog, clamp, lerp, glow, alpha, text, veil } from '/engine/core.js';
import { buildDussehra } from '../sets/dussehra.js';
import { C, sky, ravana, embers, mandala, fireworks } from '../sets/myth.js';
import { at } from '../sets/ui.js';

const serifBig = (g, str, y, a, o = {}) => text(g, str, o.x ?? E.W / 2, y, { align: o.align || 'center', size: o.size || 86, font: 'Playfair Display', weight: 900, italic: o.italic ?? true, color: o.color || '#fff2d8', alpha: a, glow: o.glow ?? 6, glowColor: o.glowColor || 'rgba(0,0,0,.85)', spacing: o.spacing ?? 2 });
const cine = (g, k = 1) => { const vg = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.35, E.W / 2, E.H / 2, E.W * 0.7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${0.55 * k})`); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H); };

// v01-v02: HOOK. Ravan speaks over his own burning effigy. Slow push, fireworks, giant serif lines.
const hook = (id, lines, cam) => registerShot(id, { kind: '3d', init: (T) => buildDussehra(T, { fov: 44 }),
  draw(s, t, info, T) { const k = ease.inOut(clamp(t / info.dur)); s.update(t + 6, { burn: lerp(cam.b0, cam.b1, k), fw: [[1, 0.2], [3, 0.9], [5, 1.6], [7, 2.4], [2, 3.1]], cheer: 0.8 });
    s.stage.camera.position.set(...cam.p0.map((v, i) => lerp(v, cam.p1[i], k))); s.stage.camera.lookAt(...cam.l0.map((v, i) => lerp(v, cam.l1[i], k))); },
  overlay(g, t, info) { cine(g, 1.1); lines.forEach(([w, str, y, size, col], i) => { const a0 = at(info, t, w, 0.3 + i * 1.2); const lg = g.createLinearGradient(0, 0, E.W * 0.55, 0); lg.addColorStop(0, 'rgba(0,0,0,.55)'); lg.addColorStop(1, 'rgba(0,0,0,0)'); if (i === 0) { g.fillStyle = lg; g.fillRect(0, 0, E.W * 0.55, E.H); } const ap = ease.out(prog(t, a0 - 0.1, a0 + 0.3)); g.save(); g.translate(E.W * 0.06, E.H * (y + 0.2)); g.scale(1 + 0.08 * (1 - ap), 1 + 0.08 * (1 - ap)); text(g, str, 0, 0, { align: 'left', size: i === 0 ? size * 1.15 : Math.min(size * 1.15, 92), font: 'Nunito', weight: 900, color: col || '#fff2d8', alpha: ap, glow: 16, glowColor: 'rgba(0,0,0,.9)', spacing: 6 }); g.restore(); }); },
});
hook('v01', [['Every', 'EVERY YEAR,', 0.16, 70], ['burn', 'YOU BURN ME.', 0.27, 104, '#ffd27a']], { p0: [-17, 9, 38], p1: [-14, 10.5, 33], l0: [-9, 16, 0], l1: [-8, 17, 0], b0: 0.35, b1: 0.6 });
hook('v02', [['Ten', 'TEN HEADS.', 0.18, 84], ['Millions', 'MILLIONS CHEERING.', 0.32, 64, '#ffe0b0']], { p0: [-9, 18, 22], p1: [-11, 14, 30], l0: [-3.5, 20, 0], l1: [-6, 17.5, 0], b0: 0.4, b1: 0.6 });
// v03: "what if the arrow had missed?" Ravan's silhouette, the arrow streaks past him and misses; time freezes
registerShot('v03', { draw(g, t, info) {
  sky(g, ['#03030c', '#140c24', '#3a1a24'], { stars: 90, t }); const z = 1 + 0.04 * t; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  ravana(g, E.W * 0.5, E.H * 1.45, 1.9, { t, lit: Array(10).fill(0.15 + 0.1 * Math.sin(t * 2)), glowA: 0.2 });
  const m = at(info, t, 'missed', 1.6), k = clamp((t - m + 0.9) / 0.9), ax = lerp(-200, E.W * 0.58, ease.out(k)), ay = lerp(E.H * 0.18, E.H * 0.33, k);
  g.strokeStyle = '#fff2d0'; g.lineWidth = 5; g.beginPath(); g.moveTo(ax - 180, ay - 30); g.lineTo(ax, ay); g.stroke(); glow(g, ax, ay, 40, '#ffd27a', 0.35); g.restore();
  const f = clamp((t - m) / 0.4); if (f > 0) veil(g, '#a8d8ff', 0.18 * f);
  cine(g); serifBig(g, 'WHAT IF THE ARROW HAD MISSED?', E.H * 0.14, ease.out(prog(t, m - 0.2, m + 0.3)), { size: 64 }); } });

// chapter cards: gold mandala on indigo, chapter number + title, embers
const chapter = (id, n, title, col) => registerShot(id, { draw(g, t, info) {
  g.fillStyle = '#05040c'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H / 2, E.W * 0.5, col, 0.07); mandala(g, E.W / 2, E.H / 2, E.H * 0.42 * (1 + 0.04 * t), t, { color: col, a: ease.out(prog(t, 0, 0.6)) });
  embers(g, t, { count: 60, color: col, k: 0.8 }); const a = ease.out(prog(t, 0.15, 0.55));
  text(g, `CHAPTER ${n}`, E.W / 2, E.H * 0.42, { size: 34, font: 'Nunito', weight: 900, color: alpha(col, 0.95), spacing: 16, alpha: a });
  serifBig(g, title, E.H * 0.54, a, { size: 96, glowColor: alpha(col, 0.7) }); cine(g); } });
chapter('ch1', 'ONE', 'The City of Gold', '#ffcf5a'); chapter('ch2', 'TWO', 'The Empire', '#ff9a3a'); chapter('ch3', 'THREE', 'The Shadow', '#c8304a');

// e01: "So you burn me every year... so that you never become me." Ravan's silhouette dissolves into embers
registerShot('e01', { draw(g, t, info) {
  sky(g, ['#020206', '#120a14', '#40140c'], { stars: 50, t }); const k = ease.inOut(clamp((t - 1.0) / (info.dur - 1.0)));
  ravana(g, E.W * 0.5, E.H * 1.45, 1.9, { t, alpha: 1 - k * 0.9, lit: Array(10).fill(0.25 * (1 - k)), glowA: 0.25 * (1 - k), rim: '#ff8a3a' });
  embers(g, t, { count: 40 + Math.round(260 * k), color: '#ff9a3a', k: 0.4 + k, speed: 50 + 90 * k, area: [E.W * 0.25, 0, E.W * 0.5, E.H] });
  const n = at(info, t, 'never', 2.2); cine(g, 1.2); serifBig(g, 'SO THAT YOU', E.H * 0.13, ease.out(prog(t, n - 0.6, n - 0.2)), { size: 56, color: '#ffe0c0' });
  serifBig(g, 'NEVER BECOME ME.', E.H * 0.24, ease.out(prog(t, n, n + 0.4)), { size: 104, color: '#ffb050' }); } });
