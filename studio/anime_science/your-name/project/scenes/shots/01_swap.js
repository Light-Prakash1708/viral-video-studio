// shots/01_swap.js: "Your Name: the body swap is (sort of) real". Anime-science series (same engine/cast as death-note).
// Official Your Name stills (kiminona.com) as short commentary "evidence" shots + original stickman explanation.
// Every label is synced to its spoken word (wordTime). No Math.random: rng(seed) + t only.
import { POSES, breathe, posesAt, walkPose, bigFace } from '/engine/rig2d.js';
import { person, closeUp, OUT, DESIGN, SC } from '../sets/people4.js';
import { E, V, measure, registerShot as _reg, ease, prog, clamp, lerp, wordTime, seg, circle, rr, glow, text, poly, rng } from '/engine/core.js';

const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
const FILES = { taki_shock: 'taki_shock.jpg', mitsuha_shock: 'mitsuha_shock.jpg', key_visual: 'key_visual.jpg', taki_phone: 'taki_phone.jpg', notebook_who: 'notebook_who.jpg', comet_tokyo: 'comet_tokyo.jpg',
  comet_clouds: 'comet_clouds.jpg', twilight_sky: 'twilight_sky.png', mitsuha_read: 'mitsuha_read.jpg', stairs: 'stairs.jpg',
  setup: 'plos_setup_l.png', pov: 'plos_pov.png', handshake: 'plos_handshake.png', knife: 'plos_knife_b.png', fig7: 'plos_fig7.png',
  brain: 'ov/brain.jpg', eye: 'ov/eye.jpg', chair: 'ov/chair.jpg', sleep: 'ov/sleep.jpg', rubber: 'ov/rubber.jpg', mannequin: 'ov/mannequin.jpg' };
const IMG = {}; for (const [k, f] of Object.entries(FILES)) IMG[k] = await loadImg(`/project/assets/${f}`);

// palette: twilight / comet (Your Name), accent = comet pink + cyan
const PINK = '#ff6fae', CYAN = '#6fe3ff', GOLD = '#ffd98a', WHITE = '#f6f4ff', NAVY = '#0b1030', VIOLET = '#3a1f6b';
const ZT = () => E.H * 0.15, GY = () => E.H * 0.66;
const pop = (t, a, b = 0.3) => ease.outBack(prog(t, a, a + b));
const RIM = { color: PINK, dir: [0.4, -0.9], w: 4 };
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
const credit = (g, a = 0.75, str = 'Your Name. © 2016 "Your Name." Production Committee') => text(g, str, E.W / 2, E.H * 0.9, { size: 22, font: 'Nunito', weight: 800, color: `rgba(255,255,255,${a})`, stroke: 4, strokeColor: 'rgba(0,0,0,.6)' });

// a film still, cover-fit to the frame with a slow Ken Burns move (fx,fy = focus 0..1), soft bloom + comet tint
function still(g, name, t, dur, o = {}) {
  const im = IMG[name]; if (o.gray) { o = { tint: 0.28, ...o }; } g.fillStyle = NAVY; g.fillRect(-200, -200, E.W + 400, E.H + 400); if (!im) return;
  const { fx = 0.5, fy = 0.5, z0 = 1.0, z1 = 1.12, tint = 0.12 } = o, k = ease.inOut(clamp(t / Math.max(0.1, dur), 0, 1)), z = lerp(z0, z1, k);
  const sc = Math.max(E.W / im.width, E.H / im.height) * z, w = im.width * sc, h = im.height * sc;
  const x = clamp(E.W / 2 - fx * w + (o.dx ?? 0) * k, E.W - w, 0), y = clamp(E.H / 2 - fy * h + (o.dy ?? 0) * k, E.H - h, 0);
  g.save(); g.filter = o.gray ? 'contrast(1.12) brightness(1.05)' : 'saturate(1.12) contrast(1.05)'; g.drawImage(im, x, y, w, h); g.filter = 'none';
  g.globalCompositeOperation = 'soft-light'; g.fillStyle = `rgba(120,80,200,${tint})`; g.fillRect(0, 0, E.W, E.H); g.globalCompositeOperation = 'source-over';
  const lg = g.createLinearGradient(0, E.H * 0.55, 0, E.H); lg.addColorStop(0, 'rgba(5,6,20,0)'); lg.addColorStop(1, 'rgba(5,6,20,.7)'); g.fillStyle = lg; g.fillRect(0, 0, E.W, E.H);
  g.restore(); credit(g, 0.75, o.credit);
  return { x, y, s: sc, map: (u, v) => [x + u * w, y + v * h] };
}
// a still in a floating card (small crops look sharp this way), over a blurred copy of itself
function card(g, name, t, o = {}) {
  const im = IMG[name]; if (!im) return { map: () => [0, 0] }; const k = pop(t, o.at ?? 0, 0.35);
  g.save(); g.filter = 'blur(24px) brightness(.5)'; const s0 = Math.max(E.W / im.width, E.H / im.height) * 1.1; g.drawImage(im, E.W / 2 - im.width * s0 / 2, E.H / 2 - im.height * s0 / 2, im.width * s0, im.height * s0); g.filter = 'none'; g.restore();
  const w = E.W * (o.w ?? 0.92), h = w * im.height / im.width, cx = E.W / 2, cy = o.cy ?? E.H * 0.47, z = (0.85 + 0.15 * k) * (1 + 0.04 * t);
  g.save(); g.translate(cx, cy); g.rotate(o.rot ?? -0.015); g.scale(z, z); glow(g, 0, 0, w * 0.75, PINK, 0.25);
  g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(-w / 2 + 14, -h / 2 + 18, w, h); if (o.gray) g.filter = 'contrast(1.12)'; g.drawImage(im, -w / 2, -h / 2, w, h); g.filter = 'none'; g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 8; g.strokeRect(-w / 2, -h / 2, w, h); g.restore(); credit(g, 0.75, o.credit);
  return { map: (u, v) => [cx + z * (u - 0.5) * w, cy + z * (v - 0.5) * h] };
}
function sky(g, t, o = {}) {   // original twilight sky with a split comet
  const lg = g.createLinearGradient(0, -200, 0, E.H + 200); lg.addColorStop(0, '#070a2a'); lg.addColorStop(0.45, '#2a1d63'); lg.addColorStop(0.75, '#8a3a7a'); lg.addColorStop(1, '#ff9a6a'); g.fillStyle = lg; g.fillRect(-300, -300, E.W + 600, E.H + 600);
  const r = rng(3); for (let i = 0; i < 90; i++) { const x = r() * E.W, y = r() * E.H * 0.6, s = r() * 2.4 + 0.5; circle(g, x, y, s, `rgba(255,255,255,${0.3 + 0.5 * Math.abs(Math.sin(t * 1.3 + i))})`); }
  const cx = E.W * (0.78 - 0.04 * t), cy = E.H * (0.16 + 0.02 * t);
  for (let k = 0; k < 2; k++) { const dx = k ? -40 : 30; g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(cx, cy, cx - 520 + dx, cy - 380); gr.addColorStop(0, k ? 'rgba(255,111,174,.9)' : 'rgba(111,227,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.strokeStyle = gr; g.lineWidth = 14 - k * 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx, cy); g.quadraticCurveTo(cx - 200, cy - 80 + dx, cx - 520 + dx, cy - 380); g.stroke(); g.restore(); }
  glow(g, cx, cy, 90, WHITE, 0.9); circle(g, cx, cy, 10, '#fff');
  if (o.ground !== false) { g.fillStyle = '#0a0a1e'; g.beginPath(); g.moveTo(-300, E.H * 0.8); for (let x = -300; x <= E.W + 300; x += 60) g.lineTo(x, E.H * 0.78 - Math.sin(x * 0.006) * 40 - 30 * Math.sin(x * 0.017)); g.lineTo(E.W + 300, E.H + 300); g.lineTo(-300, E.H + 300); g.fill(); }
}

const PAPER = 'Petkova & Ehrsson (2008) PLoS ONE · CC BY 4.0';
const glowZone = (g, cx, cy, r, col, a) => { glow(g, cx, cy, r, col, a); };
function dash(g, a, b, t, k = 1, col = CYAN) { g.save(); g.globalAlpha *= k; g.setLineDash([22, 16]); g.lineDashOffset = -t * 120; g.strokeStyle = col; g.lineWidth = 7; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 220, b[0], b[1]); g.stroke(); g.setLineDash([]); g.restore(); }
function ring(g, x, y, r, k, col = PINK) { if (k <= 0) return; g.save(); g.globalAlpha = k; g.strokeStyle = col; g.lineWidth = 9; g.beginPath(); g.arc(x, y, r * (1.4 - 0.4 * k), 0, 7); g.stroke(); g.restore(); }
function bars(g, t, vals, o = {}) {   // the paper's real Fig. 7 values, animated
  const x0 = E.W * 0.17, w = 250, base = E.H * 0.6, H = 560; rr(g, E.W * 0.06, E.H * 0.16, E.W * 0.88, E.H * 0.53, 30); g.fillStyle = 'rgba(7,7,24,.85)'; g.fill();
  text(g, 'STRESS RESPONSE (skin, μS)', E.W / 2, E.H * 0.2, { size: 38, font: 'Nunito', weight: 900, color: CYAN });
  vals.forEach((v, i) => { const k = ease.out(clamp((t - v.at) / 0.6, 0, 1)), h = H * v.v / 1.1 * k, x = x0 + i * (w + 160);
    if (k <= 0) return; rr(g, x, base - h, w, h, 14); g.fillStyle = v.col; g.fill(); glow(g, x + w / 2, base - h, 140, v.col, 0.35);
    text(g, (v.v * k).toFixed(2), x + w / 2, base - h - 46, { size: 62, font: 'Nunito', weight: 900, color: WHITE });
    text(g, v.lab, x + w / 2, base + 50, { size: 36, font: 'Nunito', weight: 900, color: v.col }); });
  text(g, 'Fig. 7 · illusion condition · means', E.W / 2, E.H * 0.672, { size: 26, font: 'Nunito', weight: 800, color: 'rgba(255,255,255,.6)' });
}
// ================= stickman v3: every action acted out; the glowing orb = "where you feel you are"
Object.assign(OUT, { TAKI: { top: 'tshirt', color: '#f2f2f6', legs: '#3a3f55', head: 'none' }, MITSU: { top: 'dress', color: '#2a2f5a', legs: '#2a2f5a', head: 'none' },
  VOL: { top: 'hoodie', color: '#36c2d8', legs: '#22284a', head: 'none' }, SCI: { top: 'labcoat', legs: '#3a3a52', head: 'none', face: 'glasses' } });
Object.assign(DESIGN, { TAKI: { hair: { style: 'spiky', color: '#4a2e1e' } }, MITSU: { hair: { style: 'long', color: '#1a1420' } }, VOL: { hair: { style: 'tuft', color: '#2a1a14' } }, SCI: { hair: { style: 'bun', color: '#5a3020' } } });
const S2 = () => SC(), GYL = () => E.H * 0.66;
const P = (o) => ({ head: [3, -208], sh: [0, -174], hip: [0, -100], eF: [9, -137], hF: [13, -101], eB: [-7, -136], hB: [-9, -100], kF: [6, -50], fF: [3, 0], kB: [-6, -50], fB: [-11, 0], ...o });
const GOG = P({ eF: [26, -170], hF: [14, -205], eB: [16, -168], hB: [8, -206] });          // hands at the eyes (putting goggles on)
const CAM = P({ eF: [20, -214], hF: [6, -248], eB: [-14, -214], hB: [-4, -248] });        // hands on top of head (placing camera)
const FLINCH = P({ head: [-14, -200], sh: [-10, -168], eF: [10, -188], hF: [-4, -214], eB: [-26, -150], hB: [-40, -130], kF: [0, -50], fF: [-6, 0], kB: [-16, -48], fB: [-22, 0] });
const LIE = POSES.stand;
const hand = (o, k = 'hF') => { const p = o.pose, s = o.s, f = o.facing ?? 1; return [o.x + p[k][0] * f * s, o.y + p[k][1] * s]; };
function orb(g, x, y, r, col, t, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha *= a; glow(g, x, y, r * 3.2, col, 0.55); circle(g, x, y, r, '#fff'); glow(g, x, y, r * 1.6, col, 0.9); g.restore(); }
function trail(g, a, b, k, col) { const pts = []; for (let i = 0; i <= 12; i++) { const u = k * i / 12; pts.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) - Math.sin(u * Math.PI) * 160]); } if (pts.length > 1) seg(g, pts, 10, alpha2(col, 0.5)); return pts.at(-1); }
const alpha2 = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
function lab(g, t) { g.fillStyle = '#120d2e'; g.fillRect(-300, -300, E.W + 600, E.H + 600); rr(g, E.W * 0.12, E.H * 0.18, E.W * 0.76, E.H * 0.34, 18); const wg = g.createLinearGradient(0, E.H * 0.18, 0, E.H * 0.52); wg.addColorStop(0, '#2a1d63'); wg.addColorStop(1, '#ff8a6a'); g.fillStyle = wg; g.fill();
  seg(g, [[E.W / 2, E.H * 0.18], [E.W / 2, E.H * 0.52]], 10, '#0c0820'); seg(g, [[E.W * 0.12, E.H * 0.35], [E.W * 0.88, E.H * 0.35]], 8, '#0c0820'); g.fillStyle = '#1b1440'; g.fillRect(-300, GYL(), E.W + 600, E.H); seg(g, [[-300, GYL()], [E.W + 300, GYL()]], 4, 'rgba(255,111,174,.35)'); glow(g, E.W / 2, GYL(), 520, PINK, 0.12); }
function goggles(g, [x, y, r], a = 1, dx = 0, dy = 0) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(dx, dy); rr(g, x - r * 0.15, y - r * 0.55, r * 1.25, r * 0.7, r * 0.2); g.fillStyle = '#1a1a2a'; g.fill(); rr(g, x + r * 0.05, y - r * 0.45, r * 0.95, r * 0.5, r * 0.15); g.fillStyle = CYAN; g.fill(); glow(g, x + r * 0.5, y - r * 0.2, r * 1.6, CYAN, 0.4); g.restore(); }
function camera(g, [x, y, r], a = 1, dy = 0) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(0, dy); rr(g, x - r * 0.6, y - r * 1.65, r * 1.0, r * 0.62, r * 0.12); g.fillStyle = '#222'; g.fill(); circle(g, x - r * 0.68, y - r * 1.34, r * 0.24, '#9ab'); circle(g, x - r * 0.68, y - r * 1.34, r * 0.11, '#111'); circle(g, x + r * 0.25, y - r * 1.55, r * 0.09, '#ff3b3b'); g.restore(); }
function feed(g, a, b, t, k = 1) { g.save(); g.globalAlpha *= k; g.setLineDash([22, 16]); g.lineDashOffset = -t * 160; g.strokeStyle = CYAN; g.lineWidth = 8; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 200, b[0], b[1]); g.stroke(); g.setLineDash([]); g.restore(); }
function meter(g, x, y, lvl, col, lab) { rr(g, x - 50, y - 420, 100, 420, 50); g.fillStyle = 'rgba(255,255,255,.12)'; g.fill(); const h = 400 * clamp(lvl, 0, 1); rr(g, x - 40, y - 10 - h, 80, h, 40); g.fillStyle = col; g.fill(); glow(g, x, y - 10 - h, 120, col, 0.5); text(g, lab, x, y + 50, { size: 36, font: 'Nunito', weight: 900, color: col }); }
function knife(g, x, y, ang, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(ang); poly(g, [[0, -14], [260, -4], [300, 0], [260, 4], [0, 14]], '#e8eef8'); rr(g, -150, -22, 150, 44, 12); g.fillStyle = '#3a2418'; g.fill(); glow(g, 270, 0, 70, WHITE, 0.6); g.restore(); }
function bed(g, x, y) { rr(g, x - 330, y - 40, 660, 70, 16); g.fillStyle = '#e8e4ff'; g.fill(); rr(g, x - 350, y + 20, 700, 60, 10); g.fillStyle = '#3a2a6a'; g.fill(); rr(g, x - 330, y - 60, 140, 50, 20); g.fillStyle = '#fff'; g.fill(); }
const pair = (t, vp, sp, ve = 'neutral', se = 'neutral', s = S2()) => ({ v: { who: 'VOL', x: E.W * 0.5 - 167 * s / 2.7, y: GYL(), s, facing: 1, pose: vp, expr: ve, rim: RIM, blink: (t % 3.1) > 3.0, t }, c: { who: 'SCI', x: E.W * 0.5 + 167 * s / 2.7, y: GYL(), s, facing: -1, pose: sp, expr: se, rim: RIM, blink: (t % 2.7) > 2.6, t } });

// HOOK: two quick film stills, then the stickman swap with orbs
registerShot('h1', { zoom: 0.1, draw(g, t, info) { g.translate(shk(t, 0), 0); card(g, 'taki_shock', t, { w: 1.08, cy: E.H * 0.46, rot: 0.02 }); flash(g, t, 0, 0.2); } });
registerShot('h2', { zoom: 0.1, draw(g, t, info) { g.translate(shk(t, 0), 0); card(g, 'mitsuha_shock', t, { w: 1.08, cy: E.H * 0.46, rot: -0.02 }); flash(g, t, 0, 0.2); } });
registerShot('h3', { zoom: 0.04, draw(g, t, info) { sky(g, t); const s = S2() * 0.85, k = ease.inOut(clamp((t - 0.15) / 0.55, 0, 1));
  const A = { who: 'TAKI', x: E.W * 0.33, y: GYL() + 60, s, facing: 1, pose: breathe(t > 0.7 ? POSES.handsOnHead : POSES.stand, t), expr: t > 0.7 ? 'shocked' : 'sleepy', rim: RIM, t }, B = { who: 'MITSU', x: E.W * 0.67, y: GYL() + 60, s, facing: -1, pose: breathe(t > 0.7 ? POSES.handsOnHead : POSES.stand, t + 1), expr: t > 0.7 ? 'shocked' : 'sleepy', rim: RIM, t };
  const ha = person(g, A), hb = person(g, B); const ca = [ha[0], ha[1] + ha[2] * 3.4], cb = [hb[0], hb[1] + hb[2] * 3.4];
  orb(g, lerp(ca[0], cb[0], k), lerp(ca[1], cb[1], k) - Math.sin(k * Math.PI) * 260, 22, CYAN, t); orb(g, lerp(cb[0], ca[0], k), lerp(cb[1], ca[1], k) - Math.sin(k * Math.PI) * 180, 22, PINK, t);
  L(g, t, 0.05, 'BODY SWAP?', { y: E.H * 0.16, size: 96 }); } });
registerShot('y2008', { zoom: 0.03, draw(g, t, info) { sky(g, t); const at = local(info, t, '2008', 0.1), k = pop(t, at, 0.4);
  if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.4); g.scale(k, k); rr(g, -300, -260, 600, 480, 30); g.fillStyle = '#f6f4ff'; g.fill(); rr(g, -300, -260, 600, 110, 30); g.fillStyle = PINK; g.fill(); text(g, 'YEAR', 0, -205, { size: 50, font: 'Nunito', weight: 900, color: '#fff' }); text(g, '2008', 0, 30, { size: 200, font: 'Fredoka', weight: 700, color: '#1a1440' }); g.restore(); }
  L(g, t, local(info, t, 'scientists', 0.8), 'A REAL EXPERIMENT', { y: E.H * 0.64, size: 60, color: GOLD }); flash(g, t, at, 0.2); } });
registerShot('feel', { zoom: 0.03, draw(g, t, info) { lab(g, t); const p = pair(t, breathe(t > 0.6 ? POSES.think : POSES.stand, t), breathe(POSES.explain, t + 1), t > 0.6 ? 'awe' : 'neutral', 'smile'); person(g, p.v); person(g, p.c); L(g, t, local(info, t, 'feel', 0.3), 'THEY FELT IT', { y: E.H * 0.13, size: 76 }); } });
registerShot('lose', { zoom: 0.03, draw(g, t, info) { lab(g, t); const p = pair(t, breathe(POSES.shrug, t), breathe(POSES.stand, t + 1), 'confused', 'neutral'); const hv = person(g, p.v), hc = person(g, p.c);
  const c = [hv[0], hv[1] + hv[2] * 3.4], d = [hc[0], hc[1] + hc[2] * 3.4], u = 0.5 + 0.5 * Math.sin(t * 2.2); orb(g, lerp(c[0], d[0], u), lerp(c[1], d[1], u) - 120 * Math.sin(u * Math.PI), 22, CYAN, t);
  L(g, t, local(info, t, 'track', 0.5), 'WHOSE BODY?', { y: E.H * 0.13, size: 86 }); text(g, '?', hv[0] + 70, hv[1] - 160, { size: 140, font: 'Fredoka', weight: 700, color: GOLD, glow: 20, glowColor: 'rgba(255,200,80,.8)' }); } });
registerShot('how', { zoom: 0.02, draw(g, t, info) { sky(g, t); g.fillStyle = 'rgba(8,8,30,.5)'; g.fillRect(0, 0, E.W, E.H); L(g, t, 0.05, 'THE EXPERIMENT', { y: E.H * 0.42, size: 90, color: CYAN, glowColor: 'rgba(111,227,255,.6)' }); L(g, t, 0.3, 'Petkova & Ehrsson · 2008 · PLoS ONE', { y: E.H * 0.52, size: 36 }); } });
registerShot('face', { zoom: 0.02, draw(g, t, info) { lab(g, t); const k = ease.out(clamp(t / 1.1, 0, 1)), walking = k < 1, ph = t * Math.PI * 2 * 0.9;
  const p = pair(t, walking ? walkPose(ph) : breathe(POSES.stand, t), walking ? walkPose(ph + 1) : breathe(POSES.stand, t + 1)); p.v.x -= (1 - k) * 420; p.c.x += (1 - k) * 420; person(g, p.v); person(g, p.c);
  L(g, t, local(info, t, 'face', 0.4), 'FACE TO FACE', { y: E.H * 0.13, size: 76 }); } });
registerShot('gear', { zoom: 0.02, draw(g, t, info) { lab(g, t); const tg = local(info, t, 'goggles', 0.3), tc = local(info, t, 'camera', 1.4);
  const vp = posesAt(t, [[0, POSES.stand], [tg - 0.2, GOG], [tg + 0.7, POSES.stand]], 0.3), sp = posesAt(t, [[0, POSES.stand], [tc - 0.3, CAM], [tc + 0.6, POSES.stand]], 0.3);
  const p = pair(t, vp, sp, 'surprised', 'smile'); const hv = person(g, p.v), hc = person(g, p.c);
  const kg = clamp((t - tg + 0.1) / 0.4, 0, 1), kc = clamp((t - tc + 0.1) / 0.4, 0, 1); goggles(g, hv, kg > 0 ? 1 : 0, 0, (1 - ease.out(kg)) * 120); camera(g, hc, kc > 0 ? 1 : 0, -(1 - ease.out(kc)) * 140);
  if (kc >= 1) feed(g, [hc[0] - hc[2] * 0.7, hc[1] - hc[2] * 1.35], [hv[0] + hv[2] * 0.6, hv[1] - hv[2] * 0.25], t);
  L(g, t, tg, 'GOGGLES ON', { y: E.H * 0.12, size: 64, color: CYAN }); L(g, t, tc + 0.5, 'HER CAMERA = HIS EYES', { y: E.H * 0.2, size: 52, color: PINK }); } });
function goggleView(g, t, cx, cy, w, inner) { const h = w * 0.55; g.save(); rr(g, cx - w / 2, cy - h / 2, w, h, h / 2); g.fillStyle = '#0a0a20'; g.fill(); g.clip(); inner(); g.restore(); g.strokeStyle = CYAN; g.lineWidth = 12; rr(g, cx - w / 2, cy - h / 2, w, h, h / 2); g.stroke(); }
registerShot('pov', { zoom: 0.02, draw(g, t, info) { lab(g, t); const p = pair(t, breathe(POSES.stand, t), breathe(POSES.stand, t + 1), 'surprised', 'neutral'); const hv = person(g, p.v), hc = person(g, p.c); goggles(g, hv); camera(g, hc);
  const k = pop(t, 0.1, 0.35); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.22); g.scale(k, k); goggleView(g, t, 0, 0, E.W * 0.86, () => { g.fillStyle = '#2a1d63'; g.fillRect(-E.W, -E.H, E.W * 2, E.H * 2); person(g, { who: 'VOL', x: 0, y: 330, s: S2() * 0.75, facing: 1, pose: breathe(POSES.stand, t), expr: 'surprised', rim: RIM, t }); goggles(g, headPos2(0, 330, S2() * 0.75)); });
    text(g, 'WHAT HE SEES: HIMSELF', 0, -E.W * 0.86 * 0.275 - 40, { size: 42, font: 'Nunito', weight: 900, color: CYAN }); g.restore(); } } });
const headPos2 = (x, y, s) => [x + 3 * s, y - 208 * s, 26 * s];
registerShot('shake', { zoom: 0.04, draw(g, t, info) { lab(g, t); const s = S2() * 1.15, tr = 0.2; const vp = posesAt(t, [[0, POSES.stand], [tr, POSES.reach]], 0.4), sp = posesAt(t, [[0, POSES.stand], [tr, POSES.reach]], 0.4);
  const p = pair(t, vp, sp, 'surprised', 'smile', s); p.v.x = E.W * 0.5 - 62 * s; p.c.x = E.W * 0.5 + 62 * s; const hv = person(g, p.v), hc = person(g, p.c); goggles(g, hv); camera(g, hc);
  const hp = hand(p.v), s1 = local(info, t, 'squeezing', 0.9), s2 = local(info, t, 'same', 1.8); for (const q of [s1, s2]) { const kk = t >= q ? 1 - clamp((t - q) / 0.6, 0, 1) : 0; if (kk > 0) { g.save(); g.globalAlpha = kk; g.strokeStyle = PINK; g.lineWidth = 9; g.beginPath(); g.arc(hp[0], hp[1], 80 + (1 - kk) * 120, 0, 7); g.stroke(); g.restore(); text(g, 'SQUEEZE', hp[0], hp[1] - 180, { size: 50, font: 'Nunito', weight: 900, color: PINK, alpha: kk }); } }
  L(g, t, s2, 'AT THE SAME MOMENT', { y: E.H * 0.12, size: 64 }); } });
registerShot('arm', { zoom: 0.03, draw(g, t, info) { lab(g, t); const s = S2() * 1.15, p = pair(t, POSES.reach, POSES.reach, 'awe', 'smile', s); p.v.x = E.W * 0.5 - 62 * s; p.c.x = E.W * 0.5 + 62 * s; const hv = person(g, p.v), hc = person(g, p.c); goggles(g, hv); camera(g, hc);
  const k = ease.inOut(clamp((t - local(info, t, 'arm', 0.6)) / 1.0, 0, 1)), chest = [hv[0], hv[1] + hv[2] * 3.4], arm = hand(p.c, 'eF'); const at = trail(g, chest, arm, k, CYAN); orb(g, at[0], at[1], 22, CYAN, t);
  if (k >= 1) { glow(g, arm[0], arm[1], 260, CYAN, 0.45); } L(g, t, local(info, t, 'own', 1.6), 'THAT ARM FEELS LIKE MINE', { y: E.H * 0.12, size: 56, color: CYAN }); } });
registerShot('felt', { zoom: 0.05, draw(g, t, info) { lab(g, t); g.fillStyle = 'rgba(8,6,24,.5)'; g.fillRect(0, 0, E.W, E.H); closeUp(g, E.W / 2, E.H * 0.5, V(300, 300), { who: 'VOL', expr: 'awe', blink: (t % 3) > 2.9, rimColor: PINK, rimSide: 1, t }); goggles(g, [E.W / 2, E.H * 0.5 + 100, 300], 1);
  L(g, t, 0.1, 'NOT MY BODY... BUT IT FEELS LIKE IT', { y: E.H * 0.14, size: 44 }); } });
registerShot('self', { zoom: 0.03, draw(g, t, info) { lab(g, t); g.fillStyle = 'rgba(5,5,20,.6)'; g.fillRect(0, 0, E.W, E.H); const tw = local(info, t, 'own', 1.5);
  goggleView(g, t, E.W / 2, E.H * 0.42, E.W * 0.94, () => { g.fillStyle = '#2a1d63'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); const s = S2() * 0.95; const o = { who: 'VOL', x: E.W * 0.42, y: E.H * 0.42 + 250 * s / 2.7 * 2.2, s, facing: 1, pose: POSES.reach, expr: 'shocked', rim: RIM, t }; person(g, o); goggles(g, headPos2(o.x, o.y, s)); const hp = hand(o); circle(g, hp[0] + 18, hp[1], 26 * s / 2.7, '#e8e8f4'); });
  text(g, 'HIS VIEW, THROUGH HER CAMERA', E.W / 2, E.H * 0.24, { size: 38, font: 'Nunito', weight: 900, color: CYAN }); L(g, t, tw, 'SHAKING HANDS WITH... ME', { y: E.H * 0.66, size: 56, color: GOLD }); flash(g, t, tw, 0.3); } });
registerShot('knife', { zoom: 0.05, draw(g, t, info) { lab(g, t); g.fillStyle = 'rgba(20,0,10,.45)'; g.fillRect(0, 0, E.W, E.H); const s = S2() * 1.15, fl = t > 0.9; const p = pair(t, fl ? FLINCH : POSES.reach, POSES.reach, fl ? 'scared' : 'surprised', 'neutral', s); p.v.x = E.W * 0.5 - 62 * s; p.c.x = E.W * 0.5 + 62 * s; const hv = person(g, p.v), hc = person(g, p.c); goggles(g, hv); camera(g, hc);
  const arm = hand(p.c, 'eF'), k = ease.out(clamp((t - 0.2) / 0.7, 0, 1)); knife(g, lerp(E.W + 200, arm[0] + 40, k), lerp(E.H * 0.25, arm[1] - 120, k), 2.1); L(g, t, 0.15, 'THEN... A KNIFE', { y: E.H * 0.12, size: 76, color: '#ff8a8a', glowColor: 'rgba(255,60,60,.6)' }); } });
registerShot('borrowed', { zoom: 0.03, draw(g, t, info) { lab(g, t); const s = S2() * 0.9, ts = local(info, t, 'stress', 0.9), fl = t > ts - 0.2; const p = pair(t, fl ? FLINCH : POSES.reach, POSES.reach, fl ? 'scared' : 'worried', 'neutral', s); p.v.x = E.W * 0.36 - 62 * s; p.c.x = E.W * 0.36 + 62 * s; const hv = person(g, p.v), hc = person(g, p.c); goggles(g, hv); camera(g, hc);
  const arm = hand(p.c, 'eF'); glow(g, arm[0], arm[1], 200, CYAN, 0.4); knife(g, arm[0] + 30, arm[1] - 90, 2.1); meter(g, E.W * 0.86, GYL() - 40, ease.out(clamp((t - ts) / 0.6, 0, 1)) * 0.95, '#ff5a7a', 'STRESS');
  L(g, t, local(info, t, 'jumped', 1.4), 'BORROWED ARM: STRESS JUMPED', { y: E.H * 0.12, size: 50, color: '#ff8a8a' }); } });
registerShot('real', { zoom: 0.03, draw(g, t, info) { lab(g, t); const s = S2() * 0.9, fl = t > 0.6; const p = pair(t, fl ? posesAt(t, [[0, POSES.reach], [0.6, POSES.stand]]) : POSES.reach, POSES.reach, fl ? 'nervous' : 'worried', 'neutral', s); p.v.x = E.W * 0.36 - 62 * s; p.c.x = E.W * 0.36 + 62 * s; const hv = person(g, p.v), hc = person(g, p.c); goggles(g, hv); camera(g, hc);
  const arm = hand(p.v, 'eB'); knife(g, arm[0] - 20, arm[1] - 100, 1.9); meter(g, E.W * 0.86, GYL() - 40, ease.out(clamp((t - 0.4) / 0.6, 0, 1)) * 0.68, CYAN, 'STRESS');
  L(g, t, local(info, t, 'Less', 1.5), 'HIS REAL ARM: LESS (~30%)', { y: E.H * 0.12, size: 50, color: GOLD }); } });
registerShot('small', { zoom: 0.02, draw(g, t, info) { sky(g, t); meter(g, E.W * 0.33, E.H * 0.62, 0.95, '#ff5a7a', 'BORROWED 0.95'); meter(g, E.W * 0.67, E.H * 0.62, 0.68, CYAN, 'REAL 0.68');
  L(g, t, local(info, t, 'Small', 0.3), 'SMALL STUDY (20 PEOPLE)', { y: E.H * 0.73, size: 50 }); L(g, t, local(info, t, 'Wild', 1.2), 'WILD RESULT', { y: E.H * 0.13, size: 90, color: GOLD }); credit(g, 0.75, 'Data: Petkova & Ehrsson (2008), PLoS ONE, Fig. 7'); } });
registerShot('why', { zoom: 0.05, draw(g, t, info) { lab(g, t); g.fillStyle = 'rgba(8,6,24,.55)'; g.fillRect(0, 0, E.W, E.H); closeUp(g, E.W / 2, E.H * 0.5, V(300, 300), { who: 'VOL', expr: 'confused', blink: (t % 3) > 2.9, rimColor: PINK, rimSide: 1, t });
  L(g, t, 0.0, 'WHY?', { y: E.H * 0.14, size: 120, color: GOLD }); L(g, t, local(info, t, 'know', 1.2), 'YOUR BRAIN NEVER "KNOWS"', { y: E.H * 0.82, size: 50 }); } });
function brain(g, x, y, r, t, lit = 0) { g.save(); g.translate(x, y); const c = lit > 0 ? `rgb(255,${180 - 60 * lit},${200 - 40 * lit})` : '#ff9ac0'; g.fillStyle = c; g.beginPath(); g.ellipse(0, 0, r, r * 0.75, 0, 0, 7); g.fill(); g.strokeStyle = '#7a2a5a'; g.lineWidth = r * 0.05;
  g.beginPath(); g.moveTo(0, -r * 0.72); g.bezierCurveTo(-r * 0.15, -r * 0.2, r * 0.15, r * 0.2, 0, r * 0.72); g.stroke(); for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(-r * 0.55 + (k % 3) * r * 0.55, -r * 0.25 + Math.floor(k / 3) * r * 0.45, r * 0.22, 0.4, 2.6); g.stroke(); } if (lit > 0) glow(g, 0, 0, r * 2, PINK, 0.5 * lit); g.restore(); }
registerShot('guess', { zoom: 0.02, draw(g, t, info) { sky(g, t); g.fillStyle = 'rgba(8,8,30,.55)'; g.fillRect(0, 0, E.W, E.H); const ts = local(info, t, 'see', 1.2), tf = local(info, t, 'feel', 1.8), tm = local(info, t, 'same', 2.4);
  const B = [E.W / 2, E.H * 0.3], EY = [E.W * 0.2, E.H * 0.6], HD = [E.W * 0.8, E.H * 0.6]; brain(g, B[0], B[1], 190, t, clamp((t - tm) / 0.3, 0, 1));
  g.save(); g.strokeStyle = WHITE; g.lineWidth = 9; g.beginPath(); g.ellipse(EY[0], EY[1], 110, 62, 0, 0, 7); g.stroke(); circle(g, EY[0], EY[1], 34, CYAN); circle(g, EY[0], EY[1], 14, '#071030'); g.restore();
  seg(g, [[HD[0] - 50, HD[1] + 70], [HD[0], HD[1] - 30]], 46, WHITE); for (let f = 0; f < 4; f++) seg(g, [[HD[0] - 18 + f * 20, HD[1] - 30], [HD[0] - 28 + f * 22, HD[1] - 100 + Math.abs(f - 1.5) * 18]], 18, WHITE);
  for (const [P0, tt, col] of [[EY, ts, CYAN], [HD, tf, GOLD]]) { const k = clamp((t - tt) / 0.7, 0, 1); if (t >= tt) { const x = lerp(P0[0], B[0], k), y = lerp(P0[1] - 80, B[1] + 120, k); seg(g, [[P0[0], P0[1] - 80], [x, y]], 6, alpha2(col, 0.5)); orb(g, x, y, 18, col, t); } }
  text(g, 'SEE', EY[0], EY[1] + 120, { size: 56, font: 'Nunito', weight: 900, color: t > ts ? CYAN : 'rgba(255,255,255,.4)' }); text(g, 'FEEL', HD[0], HD[1] + 120, { size: 56, font: 'Nunito', weight: 900, color: t > tf ? GOLD : 'rgba(255,255,255,.4)' });
  L(g, t, local(info, t, 'guesses', 0.3), 'IT GUESSES', { y: E.H * 0.1, size: 76 }); L(g, t, tm, 'SAME MOMENT = "THIS IS ME"', { y: E.H * 0.82, size: 50, color: GOLD }); } });
registerShot('match', { zoom: 0.03, draw(g, t, info) { lab(g, t); const p = pair(t, breathe(POSES.stand, t), breathe(POSES.stand, t + 1), 'awe', 'smile'); const hv = person(g, p.v), hc = person(g, p.c); goggles(g, hv); camera(g, hc);
  const k = ease.inOut(clamp((t - local(info, t, 'moves', 0.9)) / 0.7, 0, 1)), a = [hv[0], hv[1] + hv[2] * 3.4], b = [hc[0], hc[1] + hc[2] * 3.4]; const at = trail(g, a, b, k, CYAN); orb(g, at[0], at[1], 24, CYAN, t);
  L(g, t, local(info, t, 'Match', 0.1), 'SEE + FEEL MATCH...', { y: E.H * 0.12, size: 64 }); L(g, t, local(info, t, 'moves', 0.9), '...AND "YOU" MOVES', { y: E.H * 0.2, size: 64, color: GOLD }); } });
registerShot('rubber', { zoom: 0.03, draw(g, t, info) { lab(g, t); const gy = GYL() - 300, s = S2() * 0.95;
  rr(g, E.W * 0.12, gy, E.W * 0.76, 40, 10); g.fillStyle = '#5a3a2a'; g.fill(); rr(g, E.W * 0.55, gy - 260, 24, 260, 6); g.fillStyle = '#22184a'; g.fill();
  rr(g, E.W * 0.26, gy - 50, 230, 60, 30); g.fillStyle = '#ffb3c8'; g.fill(); rr(g, E.W * 0.62, gy - 50, 230, 60, 30); g.fillStyle = 'rgba(200,154,122,.5)'; g.fill();
  for (const x of [E.W * 0.36, E.W * 0.72]) { const y = gy - 120 + Math.sin(t * 7) * 40; seg(g, [[x - 20, y - 120], [x, y]], 22, '#e8d0a0'); rr(g, x - 28, y - 10, 56, 36, 8); g.fillStyle = '#f2c21a'; g.fill(); }
  const k = ease.inOut(clamp((t - 0.9) / 0.6, 0, 1)); orb(g, lerp(E.W * 0.72, E.W * 0.36, k), lerp(gy - 30, gy - 30, k) - Math.sin(k * Math.PI) * 200, 20, CYAN, t);
  text(g, 'RUBBER HAND', E.W * 0.36, gy + 80, { size: 34, font: 'Nunito', weight: 900, color: PINK }); text(g, 'REAL (hidden)', E.W * 0.72, gy + 80, { size: 34, font: 'Nunito', weight: 900, color: 'rgba(255,255,255,.6)' });
  L(g, t, local(info, t, 'rubber', 0.6), 'EVEN A RUBBER HAND', { y: E.H * 0.12, size: 66 }); L(g, t, 0.3, 'Botvinick & Cohen · 1998', { y: E.H * 0.2, size: 34, color: CYAN }); } });
function chairD(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#c8a07a'; g.fillRect(-90, -120, 180, 26); g.fillRect(-90, -330, 24, 230); g.fillRect(66, -330, 24, 230); g.fillRect(-90, -330, 180, 26); g.fillRect(-84, -94, 20, 94); g.fillRect(64, -94, 20, 94); g.restore(); }
registerShot('chair', { zoom: 0.03, draw(g, t, info) { lab(g, t); const hv = person(g, { who: 'VOL', x: E.W * 0.28, y: GYL(), s: S2() * 0.9, facing: 1, pose: breathe(POSES.point, t), expr: 'determined', rim: RIM, t }); chairD(g, E.W * 0.72, GYL(), 1.5);
  const tc = local(info, t, 'chair', 0.6), k = clamp((t - 0.1) / 0.5, 0, 1), b = t > tc ? Math.exp(-(t - tc) * 4) * Math.abs(Math.sin((t - tc) * 12)) : 0, x = lerp(hv[0], E.W * 0.68, ease.out(k)) - b * 200, y = lerp(hv[1] + hv[2] * 3.4, GYL() - 260, k);
  orb(g, x, y, 22, CYAN, t); const kx = pop(t, tc, 0.25); if (kx > 0) text(g, '✕', E.W * 0.72, GYL() - 420, { size: 220 * kx, font: 'Nunito', weight: 900, color: '#ff4a6a', glow: 30, glowColor: 'rgba(255,60,90,.8)' });
  L(g, t, tc, 'NOT A CHAIR', { y: E.H * 0.12, size: 80, color: GOLD }); } });
registerShot('shape', { zoom: 0.02, draw(g, t, info) { lab(g, t); const y = GYL(); rr(g, E.W * 0.24 - 110, y - 220, 220, 220, 14); g.fillStyle = '#7a7a9a'; g.fill();
  person(g, { who: { top: 'none', legs: '#e8dcd0' }, x: E.W * 0.74, y, s: S2() * 0.8, facing: -1, pose: POSES.stand, expr: 'neutral', rim: RIM, ink: '#e8dcd0', inkFar: '#c8bcb0', t });
  const tb = local(info, t, 'body', 1.6), kb = pop(t, 0.4, 0.25), ko = ease.inOut(clamp((t - tb + 0.4) / 0.5, 0, 1));
  if (kb > 0) text(g, '✕', E.W * 0.24, y - 330, { size: 150 * kb, font: 'Nunito', weight: 900, color: '#ff4a6a' }); orb(g, lerp(E.W * 0.5, E.W * 0.74, ko), lerp(E.H * 0.3, y - 420, ko), 22, CYAN, t);
  if (ko >= 1) text(g, '✓', E.W * 0.74, y - 760, { size: 160, font: 'Nunito', weight: 900, color: '#6aff9a', glow: 24, glowColor: 'rgba(80,255,140,.8)' });
  text(g, 'BOX', E.W * 0.24, y + 60, { size: 40, font: 'Nunito', weight: 900, color: 'rgba(255,255,255,.7)' }); text(g, 'MANNEQUIN', E.W * 0.74, y + 60, { size: 40, font: 'Nunito', weight: 900, color: 'rgba(255,255,255,.7)' });
  L(g, t, local(info, t, 'shaped', 1.0), 'ONLY BODY-SHAPED THINGS', { y: E.H * 0.12, size: 58 }); } });
registerShot('names', { zoom: 0.04, draw(g, t, info) { card(g, 'notebook_who', t, { w: 0.94, cy: E.H * 0.42 }); L(g, t, 0.35, '"WHO ARE YOU?"', { y: E.H * 0.66, size: 70, color: GOLD }); } });
registerShot('forget', { zoom: 0.05, draw(g, t, info) { card(g, 'comet_tokyo', t, { w: 1.02, cy: E.H * 0.46, rot: 0.01 }); L(g, t, local(info, t, 'forget', 0.4), 'THEY FORGET EACH OTHER', { y: E.H * 0.16, size: 56 }); } });
registerShot('realtoo', { zoom: 0.05, draw(g, t, info) { card(g, 'comet_clouds', t, { w: 1.02, cy: E.H * 0.46, rot: -0.01 }); L(g, t, 0.15, "THAT'S REAL TOO", { y: E.H * 0.2, size: 86, color: GOLD }); flash(g, t, 0.1, 0.3, '255,180,220'); } });
registerShot('dream', { zoom: 0.03, draw(g, t, info) { sky(g, t, { ground: false }); g.fillStyle = 'rgba(5,6,24,.35)'; g.fillRect(0, 0, E.W, E.H); const by = E.H * 0.68, tf = local(info, t, 'fade', 0.9), woke = t > tf + 1.0; bed(g, E.W / 2, by);
  if (!woke) { g.save(); g.translate(E.W * 0.34, by - 60); g.rotate(1.5708); person(g, { who: 'VOL', x: 0, y: 0, s: S2() * 0.62, facing: 1, pose: POSES.stand, expr: 'sleepy', rim: RIM, shadow: false, t }); g.restore(); }
  else person(g, { who: 'VOL', x: E.W * 0.5, y: by - 30, s: S2() * 0.7, facing: 1, pose: breathe(POSES.think, t), expr: 'confused', rim: RIM, t });
  const fade = clamp((t - tf) / 1.0, 0, 1), r = rng(5); g.save(); g.globalAlpha = 1 - fade; rr(g, E.W * 0.18, E.H * 0.14, E.W * 0.64, E.H * 0.3, 120); g.fillStyle = 'rgba(246,244,255,.92)'; g.fill(); g.save(); g.beginPath(); g.rect(E.W * 0.18, E.H * 0.14, E.W * 0.64, E.H * 0.3); g.clip();
  person(g, { who: 'TAKI', x: E.W * 0.38, y: E.H * 0.4, s: S2() * 0.42, facing: 1, pose: breathe(POSES.wave, t), expr: 'smile', rim: RIM, t }); person(g, { who: 'MITSU', x: E.W * 0.62, y: E.H * 0.4, s: S2() * 0.42, facing: -1, pose: breathe(POSES.wave, t + 1), expr: 'smile', rim: RIM, t }); g.restore();
  text(g, 'TAKI  ♥  MITSUHA', E.W * 0.5, E.H * 0.17, { size: 50, font: 'Fredoka', weight: 700, color: '#8a2a6a' }); g.restore();
  for (let i = 0; i < 70; i++) { const x = E.W * (0.2 + 0.6 * r()), y0 = E.H * (0.15 + 0.28 * r()), y = y0 - fade * (120 + 400 * r()); circle(g, x, y, 3 + 5 * r(), `rgba(255,${180 + 60 * r()},230,${fade * (1 - fade) * 2})`); }
  L(g, t, local(info, t, 'minutes', 1.1), 'MOST DREAMS FADE IN MINUTES', { y: E.H * 0.84, size: 48, color: GOLD }); } });
registerShot('so', { zoom: 0.03, draw(g, t, info) { still(g, 'twilight_sky', t, info.dur, { fx: 0.5, fy: 0.75, z0: 1.0, z1: 1.06, tint: 0.2 }); } });
registerShot('end', { zoom: 0.025, draw(g, t, info) { card(g, 'stairs', t, { w: 1.0, cy: E.H * 0.5, rot: 0 });
  const k = pop(t, 0.15, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.2); g.scale(k, k); text(g, 'Whose body', 0, -50, { size: 96, font: 'Playfair Display', weight: 900, italic: true, color: WHITE, glow: 30, glowColor: 'rgba(255,111,174,.8)', stroke: 8, strokeColor: 'rgba(0,0,0,.4)' });
    text(g, 'are you in?', 0, 60, { size: 96, font: 'Playfair Display', weight: 900, italic: true, color: GOLD, glow: 30, glowColor: 'rgba(255,111,174,.8)', stroke: 8, strokeColor: 'rgba(0,0,0,.4)' }); g.restore(); }
  L(g, t, Math.max(0.8, info.dur - 1.7), 'COMMENT: who would you swap with?', { y: E.H * 0.78, size: 40, color: WHITE }); } });
