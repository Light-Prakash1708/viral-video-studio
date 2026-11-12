// shots/01_swap.js: "Your Name: the body swap is (sort of) real". Anime-science series (same engine/cast as death-note).
// Official Your Name stills (kiminona.com) as short commentary "evidence" shots + original stickman explanation.
// Every label is synced to its spoken word (wordTime). No Math.random: rng(seed) + t only.
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
// =================================================================== SHOTS
// HOOK: the swap morning in three punches
registerShot('h1', { zoom: 0.1, draw(g, t, info) { g.translate(shk(t, 0), 0); card(g, 'taki_shock', t, { w: 1.08, cy: E.H * 0.46, rot: 0.02 }); flash(g, t, 0, 0.2); } });
registerShot('h2', { zoom: 0.1, draw(g, t, info) { g.translate(shk(t, 0), 0); card(g, 'mitsuha_shock', t, { w: 1.08, cy: E.H * 0.46, rot: -0.02 }); flash(g, t, 0, 0.2); } });
registerShot('h3', { zoom: 0.05, draw(g, t, info) { card(g, 'key_visual', t, { w: 1.0, cy: E.H * 0.46, rot: 0 }); L(g, t, 0.05, 'BODY SWAP?', { y: E.H * 0.2, size: 96 }); } });
registerShot('y2008', { zoom: 0.03, draw(g, t, info) { still(g, 'twilight_sky', t, info.dur, { fx: 0.5, fy: 0.7, z0: 1.05, z1: 1.12, tint: 0.2 }); const at = local(info, t, '2008', 0.1), k = pop(t, at, 0.4);
  if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.4); g.scale(k * 1.2, k * 1.2); text(g, '2008', 0, 0, { size: 240, font: 'Fredoka', weight: 700, color: WHITE, glow: 40, glowColor: 'rgba(255,111,174,.9)', stroke: 12, strokeColor: 'rgba(0,0,0,.5)' }); g.restore(); }
  L(g, t, local(info, t, 'scientists', 0.8), 'A REAL EXPERIMENT', { y: E.H * 0.56, size: 60, color: GOLD }); flash(g, t, at, 0.25); } });
registerShot('feel', { zoom: 0.04, draw(g, t, info) { card(g, 'setup', t, { w: 0.96, cy: E.H * 0.46, rot: 0, gray: true, credit: PAPER }); L(g, t, local(info, t, 'feel', 0.3), 'THEY FELT IT', { y: E.H * 0.14, size: 76 }); } });
// your brain can lose track: Taki <-> Mitsuha glitch
registerShot('lose', { zoom: 0.03, draw(g, t, info) { const sw = Math.floor(t * 2.6) % 2 === 0; still(g, sw ? 'taki_phone' : 'mitsuha_read', t, info.dur, { fx: sw ? 0.38 : 0.5, fy: 0.45, z0: 1.0, z1: 1.08 });
  const ph = (t * 2.6) % 1; if (ph < 0.12) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,0,120,.18)'; g.fillRect(-14, 0, E.W, E.H); g.fillStyle = 'rgba(0,200,255,.18)'; g.fillRect(14, 0, E.W, E.H); g.restore(); }
  L(g, t, local(info, t, 'track', 0.5), 'WHOSE BODY IS THIS?', { y: E.H * 0.15, size: 70 }); } });
registerShot('how', { zoom: 0.02, draw(g, t, info) { still(g, 'handshake', t, info.dur, { fx: 0.5, fy: 0.4, z0: 1.15, z1: 1.2, gray: true, credit: PAPER }); g.fillStyle = 'rgba(8,8,30,.6)'; g.fillRect(0, 0, E.W, E.H);
  L(g, t, 0.05, 'THE EXPERIMENT', { y: E.H * 0.42, size: 90, color: CYAN, glowColor: 'rgba(111,227,255,.6)' }); L(g, t, 0.3, 'Petkova & Ehrsson · 2008 · real photos', { y: E.H * 0.52, size: 34 }); } });
// two people face each other (the real photo)
registerShot('face', { zoom: 0.04, draw(g, t, info) { card(g, 'handshake', t, { w: 0.96, cy: E.H * 0.46, rot: 0, gray: true, credit: PAPER }); L(g, t, local(info, t, 'face', 0.4), 'FACE TO FACE', { y: E.H * 0.13, size: 70 }); } });
registerShot('gear', { zoom: 0.02, draw(g, t, info) { const m = card(g, 'handshake', t, { w: 0.96, cy: E.H * 0.46, rot: 0, at: -1, gray: true, credit: PAPER });
  const kg = pop(t, local(info, t, 'goggles', 0.3)), kc = pop(t, local(info, t, 'camera', 1.4)), gz = m.map(0.1, 0.075), cz = m.map(0.86, 0.165);
  ring(g, gz[0], gz[1], 90, clamp(kg, 0, 1), CYAN); ring(g, cz[0], cz[1], 90, clamp(kc, 0, 1), PINK); if (kc > 0) dash(g, cz, gz, t, clamp(kc, 0, 1));
  L(g, t, local(info, t, 'goggles', 0.3), 'GOGGLES', { y: E.H * 0.13, x: E.W * 0.3, size: 52, color: CYAN }); L(g, t, local(info, t, 'head', 2.6), 'CAMERAS ON HER HEAD', { y: E.H * 0.7, size: 50, color: PINK }); } });
registerShot('pov', { zoom: 0.04, draw(g, t, info) { still(g, 'pov', t, info.dur, { fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.1, gray: true, credit: PAPER }); L(g, t, 0.1, 'WHAT THE GOGGLES SHOW', { y: E.H * 0.14, size: 58, color: CYAN }); } });
// handshake + squeeze
registerShot('shake', { zoom: 0.05, draw(g, t, info) { const m = still(g, 'handshake', t, info.dur, { fx: 0.58, fy: 0.42, z0: 1.4, z1: 1.55, gray: true, credit: PAPER }), hz = m.map(0.6, 0.42);
  const s1 = local(info, t, 'squeezing', 0.9), s2 = local(info, t, 'same', 1.8); for (const s of [s1, s2]) { const k = t >= s ? 1 - clamp((t - s) / 0.6, 0, 1) : 0; ring(g, hz[0], hz[1], 200, k); ring(g, hz[0], hz[1], 300, k * 0.6); }
  L(g, t, s2, 'AT THE SAME MOMENT', { y: E.H * 0.15, size: 62 }); } });
registerShot('arm', { zoom: 0.03, draw(g, t, info) { const m = still(g, 'handshake', t, info.dur, { fx: 0.66, fy: 0.42, z0: 1.3, z1: 1.4, gray: true, credit: PAPER }), az = m.map(0.68, 0.42);
  const a = ease.inOut(clamp((t - local(info, t, 'arm', 0.8)) / 0.8, 0, 1)); g.save(); g.globalCompositeOperation = 'screen'; glow(g, az[0], az[1], 360, CYAN, 0.55 * a); g.restore();
  L(g, t, local(info, t, 'own', 1.6), '"THAT ARM IS MINE"', { y: E.H * 0.15, size: 64, color: CYAN }); } });
registerShot('felt', { zoom: 0.05, draw(g, t, info) { card(g, 'taki_phone', t, { w: 1.04, cy: E.H * 0.47 }); L(g, t, 0.1, 'NOT MY BODY... BUT IT FEELS LIKE IT', { y: E.H * 0.16, size: 44 }); } });
registerShot('self', { zoom: 0.03, draw(g, t, info) { const m = still(g, 'handshake', t, info.dur, { fx: 0.3, fy: 0.3, z0: 1.15, z1: 1.45, gray: true, credit: PAPER }); const cz = m.map(0.82, 0.07), me = m.map(0.25, 0.3);
  dash(g, cz, me, t, 1, PINK); ring(g, me[0], me[1], 230, 0.9, GOLD); const tw = local(info, t, 'own', 1.5); L(g, t, tw, 'SHAKING HANDS WITH... ME', { y: E.H * 0.8, size: 54, color: GOLD }); flash(g, t, tw, 0.3); } });
// the knife (real photo from the paper), then the real data
registerShot('knife', { zoom: 0.07, draw(g, t, info) { g.translate(shk(t, 0.2, 0.4, 10), 0); still(g, 'knife', t, info.dur, { fx: 0.4, fy: 0.75, z0: 1.05, z1: 1.25, gray: true, tint: 0.4, credit: PAPER }); g.fillStyle = 'rgba(40,0,10,.25)'; g.fillRect(0, 0, E.W, E.H);
  L(g, t, 0.2, 'THEN... A KNIFE', { y: E.H * 0.16, size: 76, color: '#ff8a8a', glowColor: 'rgba(255,60,60,.6)' }); } });
registerShot('borrowed', { zoom: 0.02, draw(g, t, info) { g.fillStyle = '#0b0820'; g.fillRect(-300, -300, E.W + 600, E.H + 600); bars(g, t, [{ v: 0.95, at: local(info, t, 'stress', 0.9), lab: 'BORROWED ARM', col: PINK }]);
  L(g, t, local(info, t, 'jumped', 1.5), 'STRESS JUMPED', { y: E.H * 0.09, size: 70, color: '#ff8a8a' }); credit(g, 0.75, PAPER); } });
registerShot('real', { zoom: 0.02, draw(g, t, info) { g.fillStyle = '#0b0820'; g.fillRect(-300, -300, E.W + 600, E.H + 600); bars(g, t, [{ v: 0.95, at: -1, lab: 'BORROWED ARM', col: PINK }, { v: 0.68, at: 0.3, lab: 'REAL ARM', col: CYAN }]);
  L(g, t, local(info, t, 'Less', 1.6), 'LESS (ABOUT 30%)', { y: E.H * 0.09, size: 66, color: GOLD }); credit(g, 0.75, PAPER); } });
registerShot('small', { zoom: 0.03, draw(g, t, info) { card(g, 'fig7', t, { w: 0.9, cy: E.H * 0.42, credit: PAPER });
  L(g, t, local(info, t, 'Small', 0.3), 'SMALL STUDY (20 PEOPLE)', { y: E.H * 0.66, size: 54, color: WHITE }); L(g, t, local(info, t, 'Wild', 1.2), 'WILD RESULT', { y: E.H * 0.15, size: 86, color: GOLD }); } });
// why: the brain guesses from what you see and feel
registerShot('why', { zoom: 0.05, draw(g, t, info) { still(g, 'brain', t, info.dur, { fx: 0.5, fy: 0.55, z0: 1.0, z1: 1.12, gray: true, tint: 0.35, credit: 'Brain model: Edeh Sophia, CC0 (Wikimedia Commons)' });
  L(g, t, 0.0, 'WHY?', { y: E.H * 0.14, size: 120, color: GOLD }); L(g, t, local(info, t, 'know', 1.2), 'YOUR BRAIN NEVER "KNOWS"', { y: E.H * 0.7, size: 52 }); } });
registerShot('guess', { zoom: 0.02, draw(g, t, info) { const sAt = local(info, t, 'see', 1.2), fAt = local(info, t, 'feel', 1.8);
  g.save(); g.beginPath(); g.rect(-300, -300, E.W + 600, E.H * 0.5 + 300); g.clip(); still(g, 'eye', t, info.dur, { fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.08, gray: true, credit: ' ' }); g.restore();
  g.save(); g.beginPath(); g.rect(-300, E.H * 0.5, E.W + 600, E.H); g.clip(); g.translate(0, E.H * 0.25); still(g, 'handshake', t, info.dur, { fx: 0.6, fy: 0.42, z0: 1.4, z1: 1.45, gray: true, credit: ' ' }); g.restore();
  seg(g, [[0, E.H * 0.5], [E.W, E.H * 0.5]], 8, 'rgba(255,255,255,.9)');
  L(g, t, sAt, 'SEE', { y: E.H * 0.42, size: 90, color: GOLD }); L(g, t, fAt, 'FEEL', { y: E.H * 0.6, size: 90, color: GOLD });
  L(g, t, local(info, t, 'guesses', 0.3), 'IT GUESSES', { y: E.H * 0.12, size: 76 }); credit(g, 0.6, 'Eye: Sheep purple, CC BY (Flickr) · ' + PAPER); } });
registerShot('match', { zoom: 0.03, draw(g, t, info) { const m = still(g, 'handshake', t, info.dur, { fx: 0.5, fy: 0.38, z0: 1.05, z1: 1.12, gray: true, credit: PAPER });
  const k = ease.inOut(clamp((t - local(info, t, 'moves', 0.9)) / 0.6, 0, 1)), a = m.map(0.25, 0.35), b = m.map(0.8, 0.35), p = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  g.save(); g.globalCompositeOperation = 'screen'; glow(g, p[0], p[1], 300, k > 0.5 ? PINK : CYAN, 0.6); g.restore();
  L(g, t, local(info, t, 'Match', 0.1), 'SEE + FEEL MATCH', { y: E.H * 0.13, size: 64 }); L(g, t, local(info, t, 'moves', 0.9), '"YOU" MOVES', { y: E.H * 0.75, size: 76, color: GOLD }); } });
registerShot('rubber', { zoom: 0.03, draw(g, t, info) { card(g, 'rubber', t, { w: 0.9, cy: E.H * 0.45, credit: 'Rubber hand illusion: Downey et al., CC BY (Wikimedia Commons)' });
  L(g, t, local(info, t, 'rubber', 0.6), 'EVEN A RUBBER HAND', { y: E.H * 0.14, size: 66 }); L(g, t, 0.4, 'Botvinick & Cohen · 1998 · Nature', { y: E.H * 0.76, size: 34, color: CYAN }); } });
registerShot('chair', { zoom: 0.04, draw(g, t, info) { still(g, 'chair', t, info.dur, { fx: 0.5, fy: 0.5, z0: 1.0, z1: 1.1, gray: true, credit: 'Chair: Horia Varlan, CC BY (Flickr)' }); const k = pop(t, local(info, t, 'chair', 0.6), 0.25);
  if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.45); g.scale(k, k); text(g, '✕', 0, 0, { size: 420, font: 'Nunito', weight: 900, color: '#ff4a6a', glow: 40, glowColor: 'rgba(255,60,90,.8)' }); g.restore(); }
  L(g, t, local(info, t, 'chair', 0.6), 'NOT A CHAIR', { y: E.H * 0.14, size: 80, color: GOLD }); } });
registerShot('shape', { zoom: 0.03, draw(g, t, info) { still(g, 'mannequin', t, info.dur, { fx: 0.5, fy: 0.4, z0: 1.0, z1: 1.1, gray: true, credit: 'Mannequin photo: CC BY (Flickr, via Openverse)' }); const k = pop(t, local(info, t, 'body', 1.6), 0.3);
  if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.42); g.scale(k, k); text(g, '✓', 0, 0, { size: 380, font: 'Nunito', weight: 900, color: '#6aff9a', glow: 40, glowColor: 'rgba(80,255,140,.8)' }); g.restore(); }
  L(g, t, local(info, t, 'shaped', 1.0), 'ONLY BODY-SHAPED THINGS', { y: E.H * 0.14, size: 58 }); } });
// names / dreams (emotional)
registerShot('names', { zoom: 0.04, draw(g, t, info) { card(g, 'notebook_who', t, { w: 0.94, cy: E.H * 0.42 }); L(g, t, 0.35, '"WHO ARE YOU?"', { y: E.H * 0.66, size: 70, color: GOLD }); } });
registerShot('forget', { zoom: 0.05, draw(g, t, info) { card(g, 'comet_tokyo', t, { w: 1.02, cy: E.H * 0.46, rot: 0.01 }); L(g, t, local(info, t, 'forget', 0.4), 'THEY FORGET EACH OTHER', { y: E.H * 0.16, size: 56 }); } });
registerShot('realtoo', { zoom: 0.05, draw(g, t, info) { card(g, 'comet_clouds', t, { w: 1.02, cy: E.H * 0.46, rot: -0.01 }); L(g, t, 0.15, "THAT'S REAL TOO", { y: E.H * 0.2, size: 86, color: GOLD }); flash(g, t, 0.1, 0.3, '255,180,220'); } });
registerShot('dream', { zoom: 0.03, draw(g, t, info) { still(g, 'sleep', t, info.dur, { fx: 0.55, fy: 0.5, z0: 1.0, z1: 1.08, gray: true, tint: 0.3, credit: 'Photo: simpleinsomnia, CC BY (Flickr)' });
  const fade = clamp((t - local(info, t, 'fade', 0.9)) / 1.2, 0, 1), r = rng(5); g.save(); g.globalAlpha = 1 - fade * 0.9; rr(g, E.W * 0.2, E.H * 0.16, E.W * 0.6, E.H * 0.2, 120); g.fillStyle = 'rgba(246,244,255,.9)'; g.fill();
  text(g, 'TAKI', E.W * 0.5, E.H * 0.23, { size: 74, font: 'Fredoka', weight: 700, color: '#2a1d63' }); text(g, 'MITSUHA', E.W * 0.5, E.H * 0.31, { size: 74, font: 'Fredoka', weight: 700, color: '#8a2a6a' }); g.restore();
  for (let i = 0; i < 70; i++) { const x = E.W * (0.25 + 0.5 * r()), y0 = E.H * (0.18 + 0.18 * r()), y = y0 - fade * (120 + 400 * r()); circle(g, x, y, 3 + 5 * r(), `rgba(255,${180 + 60 * r()},230,${fade * (1 - fade) * 2})`); }
  L(g, t, local(info, t, 'minutes', 1.1), 'MOST DREAMS FADE IN MINUTES', { y: E.H * 0.66, size: 50, color: GOLD }); } });
registerShot('so', { zoom: 0.03, draw(g, t, info) { still(g, 'twilight_sky', t, info.dur, { fx: 0.5, fy: 0.75, z0: 1.0, z1: 1.06, tint: 0.2 }); } });
registerShot('end', { zoom: 0.025, draw(g, t, info) { card(g, 'stairs', t, { w: 1.0, cy: E.H * 0.5, rot: 0 });
  const k = pop(t, 0.15, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.2); g.scale(k, k); text(g, 'Whose body', 0, -50, { size: 96, font: 'Playfair Display', weight: 900, italic: true, color: WHITE, glow: 30, glowColor: 'rgba(255,111,174,.8)', stroke: 8, strokeColor: 'rgba(0,0,0,.4)' });
    text(g, 'are you in?', 0, 60, { size: 96, font: 'Playfair Display', weight: 900, italic: true, color: GOLD, glow: 30, glowColor: 'rgba(255,111,174,.8)', stroke: 8, strokeColor: 'rgba(0,0,0,.4)' }); g.restore(); }
  L(g, t, Math.max(0.8, info.dur - 1.7), 'COMMENT: who would you swap with?', { y: E.H * 0.78, size: 40, color: WHITE }); } });
