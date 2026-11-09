// shots/02_brain2d.js: 2D shots: the sleepless night, the brain's body map, the cheek touch, Ramachandran, the boundary.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, seg, poly, circle, rr, glow, alpha, shade, mix, text, rng, S, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { word } from '../sets/cine.js';
import { stat } from '../sets/stat.js';
import { PATIENT, RAMA } from '../cast.js';
import { brain, cineBG, zonePoint } from '../sets/brain.js';

const local = (info, t, w) => { const x = wordTime(w, info.globalT - t - 0.3); return x == null ? null : x - (info.globalT - t); };
const CY = '#7fe8ff';
// glowing phantom hand silhouette in 2D at (x,y), pointing right; k = 0..1 clench
function phantom2D(g, x, y, s, a = 1, col = CY, t = 0) {
  if (a <= 0) return; g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha *= a;
  glow(g, 40, 0, 160, col, 0.35); g.strokeStyle = col; g.lineWidth = 5; g.lineCap = 'round'; g.shadowColor = col; g.shadowBlur = 20;
  g.beginPath(); g.ellipse(20, 0, 46, 36, 0, 0, 7); g.stroke();
  [-24, -8, 8, 24].forEach((dy, i) => { g.beginPath(); g.moveTo(60, dy); g.lineTo(60 + [56, 66, 62, 50][i] + Math.sin(t * 3 + i) * 3, dy * 1.15); g.stroke(); });
  g.beginPath(); g.moveTo(10, -32); g.lineTo(-4, -70); g.stroke();
  g.restore();
}
// the brain side view + sensory strip with body-part zones (Penfield-style map)
const ZONES = ['TOES', 'LEG', 'TRUNK', 'ARM', 'HAND', 'FACE', 'LIPS', 'TONGUE'];
function brainMap(g, t, o = {}) {
  const { cx = E.W / 2, cy = E.H * 0.5, s = V(1.1, 1.3), lit = {}, labels = 1, zoom = 1 } = o, ui = S().ui;
  g.save(); g.translate(cx, cy); g.scale(s * zoom, s * zoom);
  g.fillStyle = '#1a2a34'; g.beginPath(); g.ellipse(0, 0, 380, 270, 0, 0, 7); g.fill(); g.strokeStyle = alpha(ui.blueprint, 0.6); g.lineWidth = 5; g.stroke();
  g.strokeStyle = alpha(ui.blueprint, 0.25); g.lineWidth = 4; for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-120 + i * 45, -20 + (i % 2) * 60, 90, 0.3 + i, 2.2 + i); g.stroke(); }
  // the strip: an arc band over the top
  ZONES.forEach((z, i) => { const a0 = -Math.PI * 0.88 + i * (Math.PI * 0.62 / ZONES.length), a1 = a0 + Math.PI * 0.62 / ZONES.length - 0.01, on = lit[z] || 0;
    g.beginPath(); g.arc(-10, 40, 300, a0, a1); g.arc(-10, 40, 230, a1, a0, true); g.closePath(); g.fillStyle = on ? mix('#2a4a5a', z === 'HAND' ? CY : '#ffd8a0', on) : '#2a4a5a'; g.fill(); g.strokeStyle = '#0a1418'; g.lineWidth = 3; g.stroke();
    if (on) { const am = (a0 + a1) / 2; glow(g, -10 + Math.cos(am) * 265, 40 + Math.sin(am) * 265, 120, z === 'HAND' ? CY : '#ffd8a0', 0.5 * on); }
    const k = ease.out(prog(t * labels, i * 0.18, i * 0.18 + 0.3)); if (k > 0) { const am = (a0 + a1) / 2, r = i % 2 ? 392 : 340; g.save(); g.translate(-10 + Math.cos(am) * r, 40 + Math.sin(am) * r); g.rotate(am + Math.PI / 2); text(g, z, 0, 0, { size: 28, font: 'Nunito', weight: 900, color: on ? '#ffffff' : '#9ab8c4', alpha: k }); g.restore(); } });
  g.restore();
}

// p02: "And then, every night, feeling it." awake in bed at 3 AM, the phantom glows at the end of the arm
registerShot('p02', { draw(g, t, info) {
  const cam = { z: 1.32 + 0.06 * t / info.dur, x: 60 }; const M = mood('night'), gy = E.H * V(0.8, 0.68);
  layer(g, cam, 0.5, (g) => { backdrop(g, ['#04070c', '#0c1620', '#16242e']); FX.windowFrame(g, { x: E.W * 0.62, y: gy - V(720, 900), w: 260, h: 340, cols: 2, rows: 2, frame: '#0a1016', bar: 8 }, (g, x, y, w, h) => { backdrop(g, M.sky, [x, y, w, h]); FX.moon(g, x + w * 0.6, y + h * 0.3, 30); }); FX.clock(g, E.W * 0.25, gy - V(700, 860), 60, 3.2, { speed: 0 }); });
  layer(g, cam, 1, (g) => { FX.bed(g, { x: E.W * 0.12, y: gy + 20, w: E.W * 0.7, color: '#2a3a4a', frame: '#0e1418', pillow: '#8a9aa8' }); drawFigure(g, { x: E.W * 0.38, y: gy - 60, s: V(1.5, 1.6), facing: 1, outfit: PATIENT, pose: { ...POSES.lie }, rot: -Math.PI / 2, expr: t > 1.0 ? 'worried' : 'sad', look: [0.7 + 0.2 * Math.sin(t * 1.3), -0.6], blink: (t % 2.2) > 2.0, rim: { color: '#9fc8e0', dir: [1, -0.5], w: 4 }, shadow: false });
    phantom2D(g, E.W * 0.62, gy - V(110, 120), V(1.0, 1.1), 0.5 + 0.4 * Math.sin(t * 2.4), CY, t); });
  word(g, '3 AM. EVERY NIGHT.', E.H * V(0.16, 0.16), ease.out(prog(t, 0.2, 0.5)), { size: V(66, 74), color: '#bff6ff' });
} });
// p06: "Your brain keeps a map of your body, a strip of tissue where every part of you has its own address."
const BY = () => E.H * V(0.55, 0.5);
registerShot('p06', { draw(g, t, info) {
  cineBG(g, t); const a = local(info, t, 'address') ?? 4.0, st = local(info, t, 'strip') ?? 2.0;
  const z = lerp(0.92, 1.0, ease.out(prog(t, 0, info.dur))); brain(g, t, { cy: BY(), zoom: z, reveal: ease.inOut(prog(t, st - 0.4, st + 1.0)), labels: prog(t, st, a + 0.4) });
  word(g, 'YOUR BRAIN’S BODY MAP', E.H * V(0.15, 0.16), ease.out(prog(t, 0.2, 0.5)), { color: '#bff6ff', size: V(70, 80) });
  word(g, 'EVERY PART HAS AN ADDRESS', E.H * V(0.86, 0.27), ease.out(prog(t, a - 0.3, a)), { size: V(52, 60), color: '#ffd8a0' });
} });
// p07: "When the hand is gone, the map doesn't get the memo." the HAND zone stays lit; a memo flies to it and bounces back
registerShot('p07', { draw(g, t, info) {
  cineBG(g, t + 5); brain(g, t, { cy: BY(), lit: { HAND: 0.55 + 0.25 * Math.sin(t * 3) } });
  const [hx, hy] = zonePoint('HAND', { cy: BY() }); const k = prog(t, 0.5, 2.0), u = Math.sin(k * Math.PI), x = lerp(E.W * 1.08, hx + 70, ease.out(u)), y = lerp(E.H * 0.3, hy, ease.out(u));
  if (k > 0 && k < 1) { g.save(); g.translate(x, y); g.rotate(0.3 * (1 - u)); rr(g, -62, -40, 124, 80, 8); g.fillStyle = '#f4f0e6'; g.fill(); seg(g, [[-62, -40], [0, 6], [62, -40]], 4, '#a8a090'); g.restore(); }
  if (k > 0.5) text(g, 'RETURN TO SENDER', E.W * 0.72, E.H * V(0.3, 0.29), { size: V(30, 36), font: 'Nunito', weight: 900, color: '#ff7a5a', alpha: 1 - prog(t, 2.0, 2.5) });
  word(g, "THE MAP DIDN'T GET THE MEMO", E.H * V(0.15, 0.16), ease.out(prog(t, 0.1, 0.4)), { size: V(58, 66), color: '#bff6ff' });
} });
// p08: "The hand's address is still there, still firing." the hand zone pulses, signal rings + a small trace under the title
registerShot('p08', { draw(g, t, info) {
  cineBG(g, t + 9); const fire = Math.abs(Math.sin(t * 6)); brain(g, t, { cy: BY(), lit: { HAND: 0.65 + 0.35 * fire }, zoom: lerp(1, 1.06, prog(t, 0, info.dur)) });
  const [hx, hy] = zonePoint('HAND', { cy: BY(), zoom: lerp(1, 1.06, prog(t, 0, info.dur)) }); FX.rings(g, hx, hy, (t * 1.2) % 1.4, { count: 3, r0: 30, r1: 210, color: CY, a: 0.7 });
  const y0 = E.H * V(0.3, 0.27), x0 = E.W * 0.15, w = E.W * 0.7; g.save(); g.strokeStyle = CY; g.lineWidth = 5; g.shadowColor = CY; g.shadowBlur = 14; g.beginPath();
  for (let x = 0; x <= w; x += 4) { const ph = (x / w) * 10 - t * 3, spike = (Math.sin(ph * 2.3) > 0.93) ? -70 : 0; g.lineTo(x0 + x, y0 + spike + Math.sin(ph * 9) * 4); } g.stroke(); g.restore();
  word(g, 'STILL FIRING', E.H * V(0.15, 0.16), ease.out(prog(t, 0.2, 0.5)), { color: CY });
} });
// p09: "Even stranger, the face sits right next to the hand on that map." push in on the HAND / FACE neighbours
registerShot('p09', { draw(g, t, info) {
  cineBG(g, t + 12); const k = ease.inOut(prog(t, 0.2, 1.8)), z = lerp(1, 1.35, k);
  const [px, py] = zonePoint('HAND', { cx: 0, cy: 0 }), [fx, fy] = zonePoint('FACE', { cx: 0, cy: 0 }), mx = (px + fx) / 2, my = (py + fy) / 2;
  const cx = E.W / 2 - mx * z * k, cy = BY() - my * z * k + E.H * 0.03 * k;
  brain(g, t, { cx, cy, zoom: z, lit: { HAND: 0.9, FACE: clamp(prog(t, 0.6, 1.2)) } });
  word(g, 'FACE ↔ HAND', E.H * V(0.15, 0.16), ease.out(prog(t, 1.0, 1.3)), { color: '#ffd8a0', size: V(100, 112) }); word(g, 'NEXT-DOOR NEIGHBOURS', E.H * V(0.86, 0.27), ease.out(prog(t, 1.6, 1.9)), { size: V(54, 62) });
} });
// p10: "So in some patients, touching their cheek, makes them feel their missing fingers."
registerShot('p10', { draw(g, t, info) {
  backdrop(g, ['#04070c', '#0c1620', '#1a2a34']); glow(g, E.W * 0.7, E.H * 0.4, 700, '#ffd8a0', 0.18);
  const ch = local(info, t, 'cheek') ?? 1.6, fe = local(info, t, 'feel') ?? 2.6;
  bigFace(g, E.W / 2 - V(80, 60), E.H * V(0.58, 0.54), V(300, 320), { outfit: PATIENT, expr: t > fe + 0.6 ? 'awe' : t > fe ? 'surprised' : t > ch ? 'nervous' : 'neutral', look: t > fe ? [-0.9, 0.5] : [0.8, 0], rimColor: '#ffd8a0', rimSide: 1, blink: (t % 2.8) > 2.7, tilt: t > fe ? -0.06 * ease.out(prog(t, fe, fe + 0.4)) : 0.02 * Math.sin(t) });
  const tx = lerp(E.W * 1.05, E.W / 2 + V(170, 170), ease.inOut(prog(t, ch - 0.8, ch))); seg(g, [[tx, E.H * V(0.62, 0.58)], [E.W * 1.2, E.H * V(0.72, 0.68)]], 12, '#e8e0d0'); circle(g, tx, E.H * V(0.62, 0.58), 22, '#ffffff');
  if (t > ch) FX.rings(g, E.W / 2 + V(170, 170), E.H * V(0.62, 0.58), t - ch, { count: 3, r0: 20, r1: 120, color: '#ffd8a0', a: 0.6 });
  phantom2D(g, E.W * 0.14, E.H * V(0.86, 0.82), V(1.2, 1.3), ease.out(prog(t, fe - 0.3, fe + 0.2)), CY, t);
  word(g, 'TOUCH THE CHEEK…', E.H * V(0.14, 0.15), ease.out(prog(t, ch - 0.3, ch)), { color: '#ffd8a0', size: V(62, 70) }); word(g, '…FEEL THE MISSING FINGERS', E.H * V(0.14, 0.15) + V(130, 140), ease.out(prog(t, fe - 0.2, fe + 0.1)), { color: CY, size: V(52, 60) });
} });
// p11: "In the nineteen nineties, neuroscientist V. S. Ramachandran tried something simple."
registerShot('p11', { draw(g, t, info) {
  backdrop(g, ['#06090c', '#121c22', '#1e2a30']); const gy = E.H * V(0.8, 0.68); glow(g, E.W * 0.4, gy - 300, 520, '#ffd8a0', 0.25);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, gy, E.W, E.H);
  drawFigure(g, { x: E.W * 0.4, y: gy, s: V(1.9, 2.1), facing: 1, outfit: RAMA, pose: breathe(t > 3.0 ? POSES.explain : POSES.think, t), expr: t > 3.0 ? 'smile' : 'thinking', blink: (t % 2.4) > 2.3, look: t > 3.0 ? [1, 0] : [0.3, -0.6], rim: { color: '#ffd8a0', dir: [0.5, -1], w: 5 } });
  rr(g, E.W * 0.58, gy - 120, 220, 120, 8); g.fillStyle = '#3a2a20'; g.fill(); seg(g, [[E.W * 0.58 + 110, gy - 120], [E.W * 0.58 + 110, gy - 20]], 4, '#dfeef4');
  stat(g, { label: 'NEUROSCIENTIST V. S. RAMACHANDRAN', value: '1990s', x: E.W / 2, y: E.H * V(0.15, 0.16), size: V(120, 136), color: '#ffd8a0', a: ease.out(prog(t, 0.1, 0.4)), pulse: t });
  const sp = local(info, t, 'simple') ?? 4.6; word(g, 'SOMETHING SIMPLE', E.H * V(0.86, 0.3), ease.out(prog(t, sp - 0.3, sp)), { size: V(60, 68) });
} });
// p14: "Now flip it around." a whip flip
registerShot('p14', { draw(g, t, info) {
  backdrop(g, ['#04070c', '#0e1820', '#1a2a34']); const k = ease.inOut(prog(t, 0.1, 0.8));
  g.save(); g.translate(E.W / 2, E.H * 0.48); g.scale(Math.cos(k * Math.PI), 1); phantom2D(g, -80, 0, V(1.8, 2.0), 1, k < 0.5 ? CY : '#ffd8a0', t); g.restore();
  word(g, 'NOW FLIP IT', E.H * V(0.16, 0.16), ease.out(prog(t, 0.05, 0.3)), { color: '#ffffff', size: V(96, 106) });
} });
// p17: "So where does your body actually end? Maybe not at your skin." the body's glow spills past the skin
registerShot('p17', { draw(g, t, info) {
  backdrop(g, ['#03050a', '#0a1218', '#14202a']); const gy = E.H * V(0.8, 0.7), k = ease.inOut(prog(t, 0.6, info.dur));
  for (let i = 0; i < 4; i++) { const r = V(260, 300) * (1 + i * 0.35 * (0.3 + k)) + ((t * 60) % 80); g.strokeStyle = alpha(CY, (0.35 - i * 0.07) * (0.4 + k)); g.lineWidth = 4; g.beginPath(); g.ellipse(E.W / 2, gy - V(260, 300), r * 0.62, r, 0, 0, 7); g.stroke(); }
  glow(g, E.W / 2, gy - V(300, 340), 520 * (0.6 + k), CY, 0.22 + 0.2 * k); drawFigure(g, { x: E.W / 2, y: gy, s: V(2.4, 2.7), facing: 1, outfit: PATIENT, pose: breathe(POSES.relaxed, t), expr: t > (local(info, t, 'skin') ?? 2.6) ? 'awe' : 'thinking', look: [0.2, -0.5], blink: (t % 2.6) > 2.5, rim: { color: CY, dir: [0, -1], w: 6 } });
  word(g, 'WHERE DOES YOUR BODY END?', E.H * V(0.15, 0.16), ease.out(prog(t, 0.1, 0.4)), { size: V(60, 68), color: '#ffffff' }); const sk = local(info, t, 'skin') ?? 2.6; word(g, 'NOT AT YOUR SKIN?', E.H * V(0.15, 0.16) + V(130, 140), ease.out(prog(t, sk - 0.3, sk)), { size: V(58, 66), color: CY });
} });
// p18: "Maybe wherever your brain decides." the whole map lights up
registerShot('p18', { draw(g, t, info) {
  cineBG(g, t + 20); const k = ease.inOut(prog(t, 0.2, 1.4)); brain(g, t, { cy: E.H * V(0.5, 0.5), zoom: lerp(1.05, 0.95, ease.inOut(prog(t, 0, info.dur))), lit: Object.fromEntries(['TOES', 'LEG', 'TRUNK', 'ARM', 'HAND', 'FACE', 'LIPS', 'TONGUE'].map((z, i) => [z, clamp(k * 2 - i * 0.12)])) });
  word(g, 'WHEREVER YOUR BRAIN DECIDES', E.H * V(0.86, 0.22), ease.out(prog(t, 0.4, 0.7)), { size: V(56, 64), color: '#ffd8a0' });
} });
