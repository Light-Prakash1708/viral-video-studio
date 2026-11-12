// shots/01_swap.js: "Your Name: the body swap is (sort of) real". Anime-science series (same engine/cast as death-note).
// Official Your Name stills (kiminona.com) as short commentary "evidence" shots + original stickman explanation.
// Every label is synced to its spoken word (wordTime). No Math.random: rng(seed) + t only.
import { E, V, measure, registerShot as _reg, ease, prog, clamp, lerp, wordTime, seg, circle, rr, glow, text, poly, rng } from '/engine/core.js';
import { POSES, breathe, posesAt } from '/engine/rig2d.js';
import { person, closeUp, OUT, DESIGN, SC } from '../sets/people4.js';

const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
const NAMES = ['taki_shock', 'mitsuha_shock', 'key_visual', 'taki_phone', 'notebook_who', 'comet_tokyo', 'comet_clouds', 'twilight_sky', 'mitsuha_read', 'stairs'];
const IMG = {}; for (const n of NAMES) IMG[n] = await loadImg(`/project/assets/${n}.${n === 'twilight_sky' ? 'png' : 'jpg'}`);

// palette: twilight / comet (Your Name), accent = comet pink + cyan
const PINK = '#ff6fae', CYAN = '#6fe3ff', GOLD = '#ffd98a', WHITE = '#f6f4ff', NAVY = '#0b1030', VIOLET = '#3a1f6b';
const ZT = () => E.H * 0.15, GY = () => E.H * 0.66;
const pop = (t, a, b = 0.3) => ease.outBack(prog(t, a, a + b));
const RIM = { color: PINK, dir: [0.4, -0.9], w: 4 };
OUT.VOL = { top: 'hoodie', color: '#36c2d8', legs: '#22284a', head: 'none' };         // the volunteer: cyan hoodie
DESIGN.VOL = { hair: { style: 'tuft', color: '#2a1a14' }, extras: [] };
OUT.SCI = { top: 'labcoat', legs: '#3a3a52', head: 'none', face: 'glasses' };          // the scientist
DESIGN.SCI = { hair: { style: 'bun', color: '#5a3020' }, extras: [] };
const BEAT = 60 / 139.6;

// ---------- motion wrapper on every shot: beat pulse, drift, push-in, comet sparkles, vignette
const registerShot = (id, o) => _reg(id, { draw(g, t, info) {
  const gt = info.globalT, pulse = 0.012 * Math.exp(-((gt % BEAT) / BEAT) * 6), z = 1.02 + (o.zoom ?? 0.015) * t + pulse;
  g.save(); g.translate(E.W / 2 + Math.sin(gt * 0.6) * 10, E.H * 0.45 + Math.cos(gt * 0.45) * 8); g.rotate(Math.sin(gt * 0.4) * 0.003); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.45); o.draw(g, t, info); g.restore();
  const r = rng(7); for (let i = 0; i < 22; i++) { const sp = 30 + r() * 70, x = r() * E.W + Math.sin(gt * 0.6 + i) * 24, y = E.H - ((gt * sp + r() * E.H) % (E.H * 1.1)), s = 1.5 + r() * 3.5; glow(g, x, y, s * 5, i % 3 ? CYAN : PINK, 0.12 + 0.18 * r()); circle(g, x, y, s * 0.6, 'rgba(255,255,255,.55)'); }
  const vg = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.3, E.W / 2, E.H / 2, E.H * 0.78); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,8,.55)'); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H); } });

const local = (info, t, word, d = null) => { const w = wordTime(word, info.globalT - t - 0.3); return w == null ? d : w - (info.globalT - t); };
const label = (g, str, x, y, o = {}) => { const sz = o.size || 76, w = measure(g, str, sz, 'Nunito', 900) + 70; g.save(); g.globalAlpha *= 0.75; rr(g, x - w / 2, y - sz * 0.68, w, sz * 1.36, sz * 0.4); g.fillStyle = '#070718'; g.fill(); g.restore(); text(g, str, x, y, { size: sz, font: 'Nunito', weight: 900, color: o.color || WHITE, stroke: 10, strokeColor: 'rgba(0,0,0,.75)', glow: 16, glowColor: o.glowColor || 'rgba(255,111,174,.55)' }); };
const L = (g, t, at, str, o = {}) => { const k = pop(t, at, 0.32); if (k > 0) { g.save(); g.translate(o.x ?? E.W / 2, o.y ?? ZT()); g.scale(k, k); label(g, str, 0, 0, o); g.restore(); } };
const flash = (g, t, at, d = 0.25, col = '255,255,255') => { const k = 1 - prog(t, at, at + d); if (k > 0 && t >= at) { g.fillStyle = `rgba(${col},${0.65 * k})`; g.fillRect(0, 0, E.W, E.H); } };
const shk = (t, at, d = 0.35, a = 14) => { const k = 1 - prog(t, at, at + d); return t >= at && k > 0 ? Math.sin(t * 95) * a * k : 0; };
const credit = (g, a = 0.75) => text(g, 'Your Name. © 2016 "Your Name." Production Committee', E.W / 2, E.H * 0.9, { size: 22, font: 'Nunito', weight: 800, color: `rgba(255,255,255,${a})`, stroke: 4, strokeColor: 'rgba(0,0,0,.6)' });

// a film still, cover-fit to the frame with a slow Ken Burns move (fx,fy = focus 0..1), soft bloom + comet tint
function still(g, name, t, dur, o = {}) {
  const im = IMG[name]; g.fillStyle = NAVY; g.fillRect(-200, -200, E.W + 400, E.H + 400); if (!im) return;
  const { fx = 0.5, fy = 0.5, z0 = 1.0, z1 = 1.12, tint = 0.12 } = o, k = ease.inOut(clamp(t / Math.max(0.1, dur), 0, 1)), z = lerp(z0, z1, k);
  const sc = Math.max(E.W / im.width, E.H / im.height) * z, w = im.width * sc, h = im.height * sc;
  const x = clamp(E.W / 2 - fx * w + (o.dx ?? 0) * k, E.W - w, 0), y = clamp(E.H / 2 - fy * h + (o.dy ?? 0) * k, E.H - h, 0);
  g.save(); g.filter = 'saturate(1.12) contrast(1.05)'; g.drawImage(im, x, y, w, h); g.filter = 'none';
  g.globalCompositeOperation = 'soft-light'; g.fillStyle = `rgba(120,80,200,${tint})`; g.fillRect(0, 0, E.W, E.H); g.globalCompositeOperation = 'source-over';
  const lg = g.createLinearGradient(0, E.H * 0.55, 0, E.H); lg.addColorStop(0, 'rgba(5,6,20,0)'); lg.addColorStop(1, 'rgba(5,6,20,.7)'); g.fillStyle = lg; g.fillRect(0, 0, E.W, E.H);
  g.restore(); credit(g);
}
// a still in a floating card (small crops look sharp this way), over a blurred copy of itself
function card(g, name, t, o = {}) {
  const im = IMG[name]; if (!im) return; const k = pop(t, o.at ?? 0, 0.35);
  g.save(); g.filter = 'blur(24px) brightness(.5)'; const s0 = Math.max(E.W / im.width, E.H / im.height) * 1.1; g.drawImage(im, E.W / 2 - im.width * s0 / 2, E.H / 2 - im.height * s0 / 2, im.width * s0, im.height * s0); g.filter = 'none'; g.restore();
  const w = E.W * (o.w ?? 0.92), h = w * im.height / im.width, cx = E.W / 2, cy = o.cy ?? E.H * 0.47, z = (0.85 + 0.15 * k) * (1 + 0.04 * t);
  g.save(); g.translate(cx, cy); g.rotate(o.rot ?? -0.015); g.scale(z, z); glow(g, 0, 0, w * 0.75, PINK, 0.25);
  g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(-w / 2 + 14, -h / 2 + 18, w, h); g.drawImage(im, -w / 2, -h / 2, w, h); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 8; g.strokeRect(-w / 2, -h / 2, w, h); g.restore(); credit(g);
}
function sky(g, t, o = {}) {   // original twilight sky with a split comet
  const lg = g.createLinearGradient(0, -200, 0, E.H + 200); lg.addColorStop(0, '#070a2a'); lg.addColorStop(0.45, '#2a1d63'); lg.addColorStop(0.75, '#8a3a7a'); lg.addColorStop(1, '#ff9a6a'); g.fillStyle = lg; g.fillRect(-300, -300, E.W + 600, E.H + 600);
  const r = rng(3); for (let i = 0; i < 90; i++) { const x = r() * E.W, y = r() * E.H * 0.6, s = r() * 2.4 + 0.5; circle(g, x, y, s, `rgba(255,255,255,${0.3 + 0.5 * Math.abs(Math.sin(t * 1.3 + i))})`); }
  const cx = E.W * (0.78 - 0.04 * t), cy = E.H * (0.16 + 0.02 * t);
  for (let k = 0; k < 2; k++) { const dx = k ? -40 : 30; g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(cx, cy, cx - 520 + dx, cy - 380); gr.addColorStop(0, k ? 'rgba(255,111,174,.9)' : 'rgba(111,227,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.strokeStyle = gr; g.lineWidth = 14 - k * 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx, cy); g.quadraticCurveTo(cx - 200, cy - 80 + dx, cx - 520 + dx, cy - 380); g.stroke(); g.restore(); }
  glow(g, cx, cy, 90, WHITE, 0.9); circle(g, cx, cy, 10, '#fff');
  if (o.ground !== false) { g.fillStyle = '#0a0a1e'; g.beginPath(); g.moveTo(-300, E.H * 0.8); for (let x = -300; x <= E.W + 300; x += 60) g.lineTo(x, E.H * 0.78 - Math.sin(x * 0.006) * 40 - 30 * Math.sin(x * 0.017)); g.lineTo(E.W + 300, E.H + 300); g.lineTo(-300, E.H + 300); g.fill(); }
}
function lab(g, t) {   // the experiment room: dark lab, one big window of twilight
  g.fillStyle = '#120d2e'; g.fillRect(-300, -300, E.W + 600, E.H + 600);
  rr(g, E.W * 0.12, E.H * 0.18, E.W * 0.76, E.H * 0.34, 18); const wg = g.createLinearGradient(0, E.H * 0.18, 0, E.H * 0.52); wg.addColorStop(0, '#2a1d63'); wg.addColorStop(1, '#ff8a6a'); g.fillStyle = wg; g.fill();
  seg(g, [[E.W / 2, E.H * 0.18], [E.W / 2, E.H * 0.52]], 10, '#0c0820'); seg(g, [[E.W * 0.12, E.H * 0.35], [E.W * 0.88, E.H * 0.35]], 8, '#0c0820'); glow(g, E.W * 0.7, E.H * 0.28, 160, PINK, 0.35);
  g.fillStyle = '#1b1440'; g.fillRect(-300, GY(), E.W + 600, E.H); seg(g, [[-300, GY()], [E.W + 300, GY()]], 4, 'rgba(255,111,174,.35)');
  glow(g, E.W / 2, GY(), 520, PINK, 0.12);
}
const VOLX = () => E.W * 0.5 - 167, SCIX = () => E.W * 0.5 + 167;
function pair(g, t, o = {}) {   // volunteer (left, facing right) + scientist (right, facing left)
  const vp = o.vpose || breathe(POSES.stand, t), sp = o.spose || breathe(POSES.stand, t + 1.3);
  const hv = person(g, { who: 'VOL', x: VOLX(), y: GY(), s: SC(), facing: 1, pose: vp, expr: o.vexpr || 'neutral', rim: RIM, blink: (t % 3.1) > 3.0, t });
  const hs = person(g, { who: 'SCI', x: SCIX(), y: GY(), s: SC(), facing: -1, pose: sp, expr: o.sexpr || 'neutral', rim: RIM, blink: (t % 2.7) > 2.6, t });
  return { hv, hs };
}
function goggles(g, [x, y, r], a = 1) { g.save(); g.globalAlpha *= a; rr(g, x - r * 0.15, y - r * 0.55, r * 1.25, r * 0.7, r * 0.2); g.fillStyle = '#1a1a2a'; g.fill(); rr(g, x + r * 0.05, y - r * 0.45, r * 0.95, r * 0.5, r * 0.15); g.fillStyle = CYAN; g.fill(); glow(g, x + r * 0.5, y - r * 0.2, r * 1.6, CYAN, 0.4); seg(g, [[x - r * 0.9, y - r * 0.3], [x - r * 0.15, y - r * 0.25]], r * 0.12, '#1a1a2a'); g.restore(); }
function camera(g, [x, y, r], a = 1) { g.save(); g.globalAlpha *= a; rr(g, x - r * 0.55, y - r * 1.55, r * 0.9, r * 0.6, r * 0.12); g.fillStyle = '#222'; g.fill(); circle(g, x - r * 0.62, y - r * 1.25, r * 0.22, '#9ab'); circle(g, x - r * 0.62, y - r * 1.25, r * 0.1, '#111'); const blink = (Math.floor(E.fps ? 0 : 0)); circle(g, x + r * 0.2, y - r * 1.45, r * 0.08, '#ff3b3b'); g.restore(); }
function feed(g, from, to, t, a = 1) { g.save(); g.globalAlpha *= a; g.setLineDash([22, 16]); g.lineDashOffset = -t * 120; g.strokeStyle = CYAN; g.lineWidth = 7; g.beginPath(); g.moveTo(from[0], from[1]); g.quadraticCurveTo((from[0] + to[0]) / 2, Math.min(from[1], to[1]) - 260, to[0], to[1]); g.stroke(); g.setLineDash([]); g.restore(); }
function hands(g, t, sq = 0, glowArm = 0) {   // close insert: two hands clasped, squeeze pulse
  const cx = E.W / 2, cy = E.H * 0.47, s = 1 + 0.04 * sq;
  g.save(); g.translate(cx, cy); g.scale(s, s);
  seg(g, [[-E.W * 0.6, 160], [-60, 10]], 120, '#22284a'); seg(g, [[-E.W * 0.6, 160], [-60, 10]], 100, '#36c2d8');
  seg(g, [[E.W * 0.6, 140], [60, 0]], 120, '#e8e8f4'); if (glowArm > 0) { g.save(); g.globalAlpha *= glowArm; seg(g, [[E.W * 0.6, 140], [60, 0]], 104, '#36c2d8'); glow(g, 300, 70, 320, CYAN, 0.45); g.restore(); }
  rr(g, -110, -70, 220, 150, 70); g.fillStyle = '#0d0d16'; g.fill(); seg(g, [[-80, -30], [80, -30]], 10, 'rgba(255,255,255,.25)'); seg(g, [[-80, 20], [80, 20]], 10, 'rgba(255,255,255,.18)');
  g.restore();
  if (sq > 0) for (let k = 0; k < 3; k++) { g.save(); g.globalAlpha = sq * (1 - k * 0.3); g.strokeStyle = PINK; g.lineWidth = 8 - k * 2; g.beginPath(); g.arc(cx, cy, 170 + k * 70 + (1 - sq) * 80, 0, 7); g.stroke(); g.restore(); }
}
function graph(g, t, spike, o = {}) {   // skin-response (stress) trace
  const x0 = E.W * 0.1, x1 = E.W * 0.9, yb = o.y ?? E.H * 0.33, h = 230; rr(g, x0 - 30, yb - h - 70, x1 - x0 + 60, h + 130, 26); g.fillStyle = 'rgba(7,7,24,.82)'; g.fill();
  text(g, 'STRESS (SKIN RESPONSE)', E.W / 2, yb - h - 30, { size: 32, font: 'Nunito', weight: 900, color: CYAN });
  const n = 120, prg = clamp(t / (o.draw ?? 1.2), 0, 1), pts = [];
  for (let i = 0; i <= n * prg; i++) { const u = i / n, x = lerp(x0, x1, u), base = 0.12 + 0.03 * Math.sin(u * 40), bump = spike * Math.exp(-((u - 0.62) ** 2) / 0.006); pts.push([x, yb - h * (base + 0.75 * bump)]); }
  if (pts.length > 1) seg(g, pts, 7, o.col || PINK); if (pts.length > 1) glow(g, pts.at(-1)[0], pts.at(-1)[1], 60, o.col || PINK, 0.5);
}
function brainCard(g, t, o = {}) {   // blueprint: eye (see) + hand (feel) -> brain
  g.fillStyle = '#0a1440'; g.fillRect(-300, -300, E.W + 600, E.H + 600);
  g.strokeStyle = 'rgba(111,227,255,.12)'; g.lineWidth = 2; for (let x = 0; x < E.W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = 0; y < E.H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  const bx = E.W / 2, by = E.H * 0.33; g.save(); g.translate(bx, by); g.strokeStyle = CYAN; g.lineWidth = 8; g.beginPath(); g.ellipse(0, 0, 230, 165, 0, 0, 7); g.stroke(); g.beginPath(); g.moveTo(0, -165); g.bezierCurveTo(-40, -60, 40, 40, 0, 165); g.stroke();
  for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(-120 + k * 80, -40 + (k % 2) * 60, 40, 0.3, 2.6); g.stroke(); } g.restore();
  const see = o.see ?? 0, feel = o.feel ?? 0;
  // eye
  const ex = E.W * 0.22, ey = E.H * 0.58; g.save(); g.globalAlpha = 0.4 + 0.6 * see; g.strokeStyle = WHITE; g.lineWidth = 7; g.beginPath(); g.ellipse(ex, ey, 110, 60, 0, 0, 7); g.stroke(); circle(g, ex, ey, 34, CYAN); circle(g, ex, ey, 14, '#071030'); g.restore();
  text(g, 'SEE', ex, ey + 120, { size: 54, font: 'Nunito', weight: 900, color: see > 0.5 ? GOLD : 'rgba(255,255,255,.5)' });
  // hand
  const hx = E.W * 0.78, hy = E.H * 0.58; g.save(); g.globalAlpha = 0.4 + 0.6 * feel; seg(g, [[hx - 60, hy + 70], [hx, hy - 40]], 46, WHITE); for (let f = 0; f < 4; f++) seg(g, [[hx - 18 + f * 20, hy - 40], [hx - 28 + f * 22, hy - 110 + Math.abs(f - 1.5) * 18]], 18, WHITE); g.restore();
  text(g, 'FEEL', hx, hy + 120, { size: 54, font: 'Nunito', weight: 900, color: feel > 0.5 ? GOLD : 'rgba(255,255,255,.5)' });
  if (see > 0) feed(g, [ex, ey - 70], [bx - 120, by + 120], t, see); if (feel > 0) feed(g, [hx, hy - 120], [bx + 120, by + 120], t, feel);
}
function bodyGhost(g, x, y, s, a, col = CYAN) { g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = 10; g.setLineDash([18, 12]); g.beginPath(); g.arc(x, y - 222 * s, 34 * s, 0, 7); g.stroke(); g.beginPath(); g.moveTo(x, y - 188 * s); g.lineTo(x, y - 100 * s); g.moveTo(x - 50 * s, y - 160 * s); g.lineTo(x + 50 * s, y - 160 * s); g.moveTo(x, y - 100 * s); g.lineTo(x - 30 * s, y); g.moveTo(x, y - 100 * s); g.lineTo(x + 30 * s, y); g.stroke(); g.setLineDash([]); glow(g, x, y - 140 * s, 220 * s, col, 0.25); g.restore(); }
function chair(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#c8a07a'; g.fillRect(-90, -120, 180, 26); g.fillRect(-90, -330, 24, 230); g.fillRect(66, -330, 24, 230); g.fillRect(-90, -330, 180, 26); g.fillRect(-84, -94, 20, 94); g.fillRect(64, -94, 20, 94); g.restore(); }
function block(g, x, y) { rr(g, x - 110, y - 220, 220, 220, 14); g.fillStyle = '#7a7a9a'; g.fill(); }

// =================================================================== SHOTS
// HOOK (0 - 1.85): three iconic stills, punch cuts
registerShot('h1', { zoom: 0.1, draw(g, t, info) { g.translate(shk(t, 0), 0); card(g, 'taki_shock', t, { w: 1.08, cy: E.H * 0.46, rot: 0.02 }); flash(g, t, 0, 0.2); } });
registerShot('h2', { zoom: 0.1, draw(g, t, info) { g.translate(shk(t, 0), 0); card(g, 'mitsuha_shock', t, { w: 1.08, cy: E.H * 0.46, rot: -0.02 }); flash(g, t, 0, 0.2); } });
registerShot('h3', { zoom: 0.05, draw(g, t, info) { card(g, 'key_visual', t, { w: 1.0, cy: E.H * 0.46, rot: 0 }); L(g, t, 0.05, 'BODY SWAP?', { y: E.H * 0.2, size: 96 }); } });
// 2008
registerShot('y2008', { zoom: 0.03, draw(g, t, info) { sky(g, t); const k = pop(t, local(info, t, '2008', 0.1), 0.4);
  if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.42); g.scale(k * 1.2, k * 1.2); text(g, '2008', 0, 0, { size: 240, font: 'Fredoka', weight: 700, color: WHITE, glow: 40, glowColor: 'rgba(255,111,174,.9)', stroke: 12, strokeColor: 'rgba(0,0,0,.5)' }); g.restore(); }
  L(g, t, local(info, t, 'scientists', 0.8), 'REAL EXPERIMENT', { y: E.H * 0.58, size: 60, color: GOLD }); flash(g, t, local(info, t, '2008', 0.1), 0.25); } });
registerShot('feel', { zoom: 0.02, draw(g, t, info) { lab(g, t); pair(g, t, { vexpr: 'surprised', sexpr: 'smile' }); L(g, t, local(info, t, 'feel', 0.2), 'THEY FELT IT', { size: 70 }); } });
// your brain can lose track
registerShot('lose', { zoom: 0.03, draw(g, t, info) { sky(g, t, { ground: true }); const m = ease.inOut(clamp((t - 0.6) / 1.4, 0, 1));
  person(g, { who: 'VOL', x: E.W * 0.3, y: GY() + 40, s: SC() * 0.9, facing: 1, pose: breathe(POSES.stand, t), expr: 'worried', rim: RIM, t }); person(g, { who: 'SCI', x: E.W * 0.7, y: GY() + 40, s: SC() * 0.9, facing: -1, pose: breathe(POSES.stand, t + 1), expr: 'confused', rim: RIM, t });
  bodyGhost(g, lerp(E.W * 0.3, E.W * 0.7, m), GY() + 40, SC() * 0.9, 0.9); L(g, t, local(info, t, 'track', 0.5), 'WHOSE BODY?', { size: 82 }); } });
registerShot('how', { zoom: 0.02, draw(g, t, info) { brainCard(g, t, {}); g.fillStyle = 'rgba(10,20,64,.72)'; g.fillRect(0, 0, E.W, E.H); L(g, t, 0.05, 'THE EXPERIMENT', { y: E.H * 0.42, size: 90, color: CYAN, glowColor: 'rgba(111,227,255,.6)' });
  L(g, t, 0.35, 'Petkova & Ehrsson · 2008 · PLoS ONE', { y: E.H * 0.52, size: 34, color: WHITE }); } });
// two people face each other
registerShot('face', { zoom: 0.03, draw(g, t, info) { lab(g, t); pair(g, t, {}); L(g, t, local(info, t, 'face', 0.4), 'FACE TO FACE', { size: 64 }); } });
registerShot('gear', { zoom: 0.02, draw(g, t, info) { lab(g, t); const { hv, hs } = pair(g, t, { vexpr: 'surprised' }); const kg = pop(t, local(info, t, 'goggles', 0.3)), kc = pop(t, local(info, t, 'camera', 1.4));
  goggles(g, hv, clamp(kg, 0, 1)); camera(g, hs, clamp(kc, 0, 1)); if (kc > 0) feed(g, [hs[0] - hs[2] * 0.6, hs[1] - hs[2] * 1.3], [hv[0] + hv[2] * 0.5, hv[1] - hv[2] * 0.3], t, clamp(kc, 0, 1));
  L(g, t, local(info, t, 'goggles', 0.3), 'VR GOGGLES', { y: E.H * 0.13, size: 56, color: CYAN }); L(g, t, local(info, t, 'head', 2.6), 'HIS EYES = HER CAMERA', { y: E.H * 0.21, size: 50 }); } });
registerShot('pov', { zoom: 0.03, draw(g, t, info) { lab(g, t); const { hv, hs } = pair(g, t, {}); goggles(g, hv); camera(g, hs); feed(g, [hs[0] - hs[2] * 0.6, hs[1] - hs[2] * 1.3], [hv[0] + hv[2] * 0.5, hv[1] - hv[2] * 0.3], t);
  const k = pop(t, 0.15, 0.35); if (k > 0) { const w = E.W * 0.62, h = w * 0.62, x = E.W / 2, y = E.H * 0.2; g.save(); g.translate(x, y); g.scale(k, k); rr(g, -w / 2, -h / 2, w, h, 30); g.fillStyle = '#0a0a20'; g.fill(); g.save(); g.clip();
    g.fillStyle = '#2a1d63'; g.fillRect(-w / 2, -h / 2, w, h); person(g, { who: 'VOL', x: 0, y: h * 0.45, s: SC() * 0.62, facing: 1, pose: breathe(POSES.stand, t), expr: 'surprised', rim: RIM, t }); g.restore();
    g.strokeStyle = CYAN; g.lineWidth = 8; rr(g, -w / 2, -h / 2, w, h, 30); g.stroke(); text(g, 'WHAT THE GOGGLES SHOW', 0, h / 2 + 46, { size: 34, font: 'Nunito', weight: 900, color: CYAN }); g.restore(); } } });
// handshake + squeeze
registerShot('shake', { zoom: 0.04, draw(g, t, info) { g.fillStyle = '#140e33'; g.fillRect(-300, -300, E.W + 600, E.H + 600); glow(g, E.W / 2, E.H * 0.47, 600, PINK, 0.25);
  const s1 = local(info, t, 'squeezing', 0.9), s2 = local(info, t, 'same', 1.8), sq = Math.max(1 - clamp((t - s1) / 0.5, 0, 1), 0) * (t >= s1 ? 1 : 0) + Math.max(1 - clamp((t - s2) / 0.5, 0, 1), 0) * (t >= s2 ? 1 : 0);
  hands(g, t, clamp(sq, 0, 1)); L(g, t, s2, 'AT THE SAME MOMENT', { y: E.H * 0.2, size: 62 }); } });
registerShot('arm', { zoom: 0.03, draw(g, t, info) { g.fillStyle = '#140e33'; g.fillRect(-300, -300, E.W + 600, E.H + 600); const a = ease.inOut(clamp((t - local(info, t, 'arm', 0.8)) / 0.8, 0, 1)); hands(g, t, 0.3 * Math.abs(Math.sin(t * 4)), a);
  L(g, t, local(info, t, 'own', 1.6), '"THAT ARM IS MINE"', { y: E.H * 0.2, size: 64, color: CYAN }); } });
registerShot('felt', { zoom: 0.05, draw(g, t, info) { card(g, 'taki_phone', t, { w: 1.04, cy: E.H * 0.47 }); L(g, t, 0.1, 'NOT MY BODY... BUT IT FEELS LIKE IT', { y: E.H * 0.16, size: 44 }); } });
registerShot('self', { zoom: 0.02, draw(g, t, info) { g.fillStyle = '#0b0820'; g.fillRect(-300, -300, E.W + 600, E.H + 600);
  const w = E.W * 0.86, h = w * 1.2, k = pop(t, 0.05, 0.3); g.save(); g.translate(E.W / 2, E.H * 0.43); g.scale(k, k); rr(g, -w / 2, -h / 2, w, h, 60); g.fillStyle = '#2a1d63'; g.fill(); g.save(); g.clip();
  const gy = h * 0.42; glow(g, 0, -h * 0.1, w * 0.7, PINK, 0.3); person(g, { who: 'VOL', x: -60, y: gy, s: SC() * 1.25, facing: 1, pose: breathe(POSES.reach, t), expr: 'shocked', rim: RIM, t });
  hands(g, t, 0); g.restore(); g.strokeStyle = CYAN; g.lineWidth = 10; rr(g, -w / 2, -h / 2, w, h, 60); g.stroke(); g.restore();
  const tw = local(info, t, 'own', 1.5); L(g, t, tw, 'SHAKING HANDS WITH... ME', { y: E.H * 0.86, size: 54, color: GOLD }); flash(g, t, tw, 0.3); } });
// knife
registerShot('knife', { zoom: 0.06, draw(g, t, info) { g.fillStyle = '#05040f'; g.fillRect(-300, -300, E.W + 600, E.H + 600); const k = ease.out(clamp(t / 0.6, 0, 1));
  g.save(); g.translate(lerp(E.W + 300, E.W * 0.55, k), E.H * 0.45); g.rotate(-0.5); poly(g, [[-360, -26], [140, -6], [180, 0], [140, 6], [-360, 26]], '#dfe6f2'); rr(g, -540, -36, 190, 72, 18); g.fillStyle = '#2a1a14'; g.fill(); g.restore();
  glow(g, E.W * 0.55 + 120, E.H * 0.42, 80 + 40 * Math.sin(t * 9), WHITE, 0.6); L(g, t, 0.2, 'THEN... A KNIFE', { y: E.H * 0.2, size: 74, color: '#ff8a8a', glowColor: 'rgba(255,60,60,.6)' }); } });
registerShot('borrowed', { zoom: 0.03, draw(g, t, info) { g.fillStyle = '#140e33'; g.fillRect(-300, -300, E.W + 600, E.H + 600); hands(g, t, 0, 1);
  g.save(); g.translate(E.W * 0.78, E.H * 0.62); g.rotate(-1.9); poly(g, [[-200, -18], [80, -4], [110, 0], [80, 4], [-200, 18]], '#dfe6f2'); g.restore();
  graph(g, t - local(info, t, 'stress', 0.9), 1, { y: E.H * 0.3 }); L(g, t, local(info, t, 'jumped', 1.5), 'STRESS JUMPED', { y: E.H * 0.62, size: 64, color: '#ff8a8a' }); L(g, t, 0.1, 'BORROWED ARM', { y: E.H * 0.385, size: 44, color: CYAN }); } });
registerShot('real', { zoom: 0.03, draw(g, t, info) { g.fillStyle = '#140e33'; g.fillRect(-300, -300, E.W + 600, E.H + 600); hands(g, t, 0, 0);
  g.save(); g.translate(E.W * 0.22, E.H * 0.64); g.rotate(-1.25); poly(g, [[-200, -18], [80, -4], [110, 0], [80, 4], [-200, 18]], '#dfe6f2'); g.restore();
  graph(g, t - 0.2, 0.22, { y: E.H * 0.3, col: CYAN }); L(g, t, 0.1, 'THEIR REAL ARM', { y: E.H * 0.385, size: 44, color: CYAN }); L(g, t, local(info, t, 'Much', 1.6), 'MUCH LESS', { y: E.H * 0.62, size: 70, color: GOLD }); } });
registerShot('small', { zoom: 0.03, draw(g, t, info) { sky(g, t); const k = pop(t, 0.05, 0.35); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.36); g.scale(k, k); rr(g, -440, -150, 880, 300, 30); g.fillStyle = 'rgba(246,244,255,.95)'; g.fill();
  text(g, 'Petkova & Ehrsson (2008)', 0, -60, { size: 46, font: 'Nunito', weight: 900, color: '#1a1440' }); text(g, 'PLoS ONE · small samples', 0, 4, { size: 36, font: 'Nunito', weight: 800, color: '#5a4a8a' }); text(g, 'a real, published experiment', 0, 66, { size: 32, font: 'Nunito', weight: 800, color: '#5a4a8a' }); g.restore(); }
  L(g, t, local(info, t, 'Small', 0.3), 'SMALL STUDY', { y: E.H * 0.6, size: 64, color: WHITE }); L(g, t, local(info, t, 'Wild', 1.2), 'WILD RESULT', { y: E.H * 0.7, size: 82, color: GOLD }); } });
// why: brain guesses
registerShot('why', { zoom: 0.05, draw(g, t, info) { lab(g, t); g.fillStyle = 'rgba(8,6,24,.55)'; g.fillRect(0, 0, E.W, E.H); closeUp(g, E.W / 2, E.H * 0.47, V(300, 300), { who: 'VOL', expr: t < 0.8 ? 'confused' : 'thinking', blink: (t % 3) > 2.9, rimColor: PINK, rimSide: 1, t });
  L(g, t, 0.0, 'WHY?', { y: E.H * 0.15, size: 110, color: GOLD }); L(g, t, local(info, t, 'know', 1.2), 'YOUR BRAIN NEVER "KNOWS"', { y: E.H * 0.8, size: 50 }); } });
registerShot('guess', { zoom: 0.02, draw(g, t, info) { const s = clamp((t - local(info, t, 'see', 1.2)) / 0.3, 0, 1), f = clamp((t - local(info, t, 'feel', 1.8)) / 0.3, 0, 1); brainCard(g, t, { see: s, feel: f });
  L(g, t, local(info, t, 'guesses', 0.3), 'IT GUESSES', { y: E.H * 0.1, size: 76, color: GOLD }); L(g, t, local(info, t, 'same', 2.4), 'SAME MOMENT = MINE', { y: E.H * 0.8, size: 56, color: CYAN }); } });
registerShot('match', { zoom: 0.03, draw(g, t, info) { sky(g, t); const m = ease.inOut(clamp((t - local(info, t, 'moves', 0.9)) / 0.6, 0, 1));
  person(g, { who: 'VOL', x: E.W * 0.3, y: GY() + 40, s: SC() * 0.9, facing: 1, pose: breathe(POSES.stand, t), expr: 'neutral', rim: RIM, t }); person(g, { who: 'SCI', x: E.W * 0.7, y: GY() + 40, s: SC() * 0.9, facing: -1, pose: breathe(POSES.stand, t + 1), expr: 'neutral', rim: RIM, t });
  bodyGhost(g, lerp(E.W * 0.3, E.W * 0.7, m), GY() + 40, SC() * 0.9, 1, m > 0.5 ? PINK : CYAN); L(g, t, local(info, t, 'Match', 0.1), 'SEE + FEEL MATCH', { size: 64 }); L(g, t, local(info, t, 'moves', 0.9), '"YOU" MOVES', { y: E.H * 0.24, size: 70, color: GOLD }); } });
registerShot('rubber', { zoom: 0.03, draw(g, t, info) { g.fillStyle = '#140e33'; g.fillRect(-300, -300, E.W + 600, E.H + 600); const gy = E.H * 0.55;
  rr(g, -100, gy, E.W + 200, 60, 10); g.fillStyle = '#3a2a5a'; g.fill(); rr(g, E.W * 0.47, gy - 360, 30, 360, 6); g.fillStyle = '#22184a'; g.fill();
  rr(g, E.W * 0.12, gy - 70, 320, 80, 40); g.fillStyle = '#ffb3c8'; g.fill(); rr(g, E.W * 0.6, gy - 70, 320, 80, 40); g.fillStyle = '#c89a7a'; g.fill();
  for (const [x, ph] of [[E.W * 0.25, 0], [E.W * 0.75, 0]]) { const y = gy - 120 + Math.sin(t * 6 + ph) * 40; seg(g, [[x - 20, y - 120], [x, y]], 26, '#e8d0a0'); rr(g, x - 30, y - 10, 60, 40, 8); g.fillStyle = '#f2c21a'; g.fill(); }
  text(g, 'RUBBER HAND', E.W * 0.25, gy + 110, { size: 40, font: 'Nunito', weight: 900, color: PINK }); text(g, 'REAL HAND (hidden)', E.W * 0.75, gy + 110, { size: 36, font: 'Nunito', weight: 900, color: 'rgba(255,255,255,.6)' });
  L(g, t, local(info, t, 'rubber', 0.6), 'EVEN A RUBBER HAND', { y: E.H * 0.16, size: 64 }); L(g, t, 0.4, 'Botvinick & Cohen · 1998 · Nature', { y: E.H * 0.8, size: 32, color: CYAN }); } });
registerShot('chair', { zoom: 0.03, draw(g, t, info) { lab(g, t); chair(g, E.W * 0.62, GY(), 1.4); const j = clamp((t - 0.2) / 0.5, 0, 1), b = t > 0.7 ? Math.abs(Math.sin((t - 0.7) * 9)) * Math.exp(-(t - 0.7) * 3) : 0;
  bodyGhost(g, lerp(E.W * 0.25, E.W * 0.55, ease.out(j)) - b * 120, GY(), SC() * 0.9, 0.9); const k = pop(t, local(info, t, 'chair', 0.6), 0.25); if (k > 0) { g.save(); g.translate(E.W * 0.62, E.H * 0.4); g.scale(k, k); text(g, '✕', 0, 0, { size: 300, font: 'Nunito', weight: 900, color: '#ff4a6a', glow: 30, glowColor: 'rgba(255,60,90,.8)' }); g.restore(); }
  L(g, t, local(info, t, 'chair', 0.6), 'NOT A CHAIR', { y: E.H * 0.14, size: 78, color: GOLD }); } });
registerShot('shape', { zoom: 0.02, draw(g, t, info) { lab(g, t); const y = GY();
  chair(g, E.W * 0.18, y, 0.8); block(g, E.W * 0.5, y); person(g, { who: 'SCI', x: E.W * 0.82, y, s: SC() * 0.62, facing: -1, pose: breathe(POSES.stand, t), expr: 'smile', rim: RIM, t });
  const k1 = pop(t, 0.3, 0.25), k2 = pop(t, 0.6, 0.25), k3 = pop(t, local(info, t, 'body', 1.6), 0.3);
  if (k1 > 0) text(g, '✕', E.W * 0.18, y - 420, { size: 120 * k1, font: 'Nunito', weight: 900, color: '#ff4a6a' }); if (k2 > 0) text(g, '✕', E.W * 0.5, y - 340, { size: 120 * k2, font: 'Nunito', weight: 900, color: '#ff4a6a' });
  if (k3 > 0) { text(g, '✓', E.W * 0.82, y - 600, { size: 140 * k3, font: 'Nunito', weight: 900, color: '#6aff9a', glow: 24, glowColor: 'rgba(80,255,140,.8)' }); glow(g, E.W * 0.82, y - 300, 300, CYAN, 0.3 * k3); }
  L(g, t, local(info, t, 'shaped', 1.0), 'ONLY BODY-SHAPED THINGS', { y: E.H * 0.14, size: 58 }); } });
// names / dreams (emotional)
registerShot('names', { zoom: 0.04, draw(g, t, info) { card(g, 'notebook_who', t, { w: 0.94, cy: E.H * 0.42 }); L(g, t, 0.35, '"WHO ARE YOU?"', { y: E.H * 0.66, size: 70, color: GOLD }); } });
registerShot('forget', { zoom: 0.05, draw(g, t, info) { card(g, 'comet_tokyo', t, { w: 1.02, cy: E.H * 0.46, rot: 0.01 }); L(g, t, local(info, t, 'forget', 0.4), 'THEY FORGET EACH OTHER', { y: E.H * 0.16, size: 56 }); } });
registerShot('realtoo', { zoom: 0.05, draw(g, t, info) { card(g, 'comet_clouds', t, { w: 1.02, cy: E.H * 0.46, rot: -0.01 }); L(g, t, 0.15, "THAT'S REAL TOO", { y: E.H * 0.42, size: 86, color: GOLD }); flash(g, t, 0.1, 0.3, '255,180,220'); } });
registerShot('dream', { zoom: 0.03, draw(g, t, info) { sky(g, t, { ground: false }); g.fillStyle = 'rgba(5,6,24,.35)'; g.fillRect(0, 0, E.W, E.H);
  const by = E.H * 0.66; rr(g, E.W * 0.12, by - 60, E.W * 0.76, 90, 20); g.fillStyle = '#e8e4ff'; g.fill(); rr(g, E.W * 0.1, by + 20, E.W * 0.8, 70, 14); g.fillStyle = '#3a2a6a'; g.fill();
  g.save(); g.translate(E.W * 0.28, by - 46); g.rotate(1.5708); person(g, { who: 'VOL', x: 0, y: 0, s: SC() * 0.62, facing: 1, pose: POSES.stand, expr: 'sleepy', rim: RIM, t }); g.restore(); text(g, 'z z z', E.W * 0.7, by - 160 - Math.sin(t * 2) * 10, { size: 48, font: 'Fredoka', weight: 700, color: 'rgba(255,255,255,.7)' });
  const fade = clamp((t - local(info, t, 'fade', 0.9)) / 1.2, 0, 1), r = rng(5); g.save(); g.globalAlpha = 1 - fade * 0.85; rr(g, E.W * 0.22, E.H * 0.2, E.W * 0.56, E.H * 0.26, 140); g.fillStyle = 'rgba(246,244,255,.92)'; g.fill();
  text(g, 'TAKI', E.W * 0.5, E.H * 0.29, { size: 74, font: 'Fredoka', weight: 700, color: '#2a1d63' }); text(g, 'MITSUHA', E.W * 0.5, E.H * 0.37, { size: 74, font: 'Fredoka', weight: 700, color: '#8a2a6a' }); g.restore();
  for (let i = 0; i < 70; i++) { const x = E.W * (0.25 + 0.5 * r()), y0 = E.H * (0.22 + 0.22 * r()), y = y0 - fade * (120 + 400 * r()); circle(g, x, y, 3 + 5 * r(), `rgba(255,${180 + 60 * r()},230,${fade * (1 - fade) * 2})`); }
  L(g, t, local(info, t, 'minutes', 1.1), 'MOST DREAMS FADE IN MINUTES', { y: E.H * 0.82, size: 50, color: GOLD }); } });
registerShot('so', { zoom: 0.03, draw(g, t, info) { still(g, 'twilight_sky', t, info.dur, { fx: 0.5, fy: 0.75, z0: 1.0, z1: 1.06, tint: 0.2 }); } });
registerShot('end', { zoom: 0.025, draw(g, t, info) { card(g, 'key_visual', t, { w: 1.0, cy: E.H * 0.5, rot: 0 });
  const k = pop(t, 0.15, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.2); g.scale(k, k); text(g, 'Whose body', 0, -50, { size: 96, font: 'Playfair Display', weight: 900, italic: true, color: WHITE, glow: 30, glowColor: 'rgba(255,111,174,.8)', stroke: 8, strokeColor: 'rgba(0,0,0,.4)' });
    text(g, 'are you in?', 0, 60, { size: 96, font: 'Playfair Display', weight: 900, italic: true, color: GOLD, glow: 30, glowColor: 'rgba(255,111,174,.8)', stroke: 8, strokeColor: 'rgba(0,0,0,.4)' }); g.restore(); }
  L(g, t, Math.max(0.8, info.dur - 1.7), 'COMMENT: who would you swap with?', { y: E.H * 0.78, size: 40, color: WHITE }); } });
