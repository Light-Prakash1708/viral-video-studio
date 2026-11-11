// shots/01_hakari.js: "Hakari's Jackpot Math". Original gambler character + curse, flat-vector bust style, live HUD readouts, hard-synced counters.
import { E, V, measure, registerShot as _reg, veil, ease, prog, clamp, lerp, wordTime, seg, circle, rr, glow, text, poly, rng } from '/engine/core.js';

const BEAT = 60 / 144;
const NAVY = '#0b0e17', GOLD = '#ffcc00', MAG = '#ff3dac', CY = '#37e6ff', RED = '#ff3b4a', GREEN = '#35e08a', WHITE = '#f5f6fa', GREY = '#9aa0b4';
const pop = (t, a, b = 0.3) => ease.outBack(prog(t, a, a + b));
const fmt = n => Math.round(n).toLocaleString('en-US');
const cnt = (info, a, b, final, from = 0) => from + (final - from) * ease.out(prog(info.globalT, a, b));
const P = n => 1 - Math.pow(238 / 239, n);
const flash = (g, t, at, d = 0.25, col = '255,255,255') => { const k = 1 - prog(t, at, at + d); if (k > 0 && t >= at) { g.fillStyle = `rgba(${col},${0.6 * k})`; g.fillRect(0, 0, E.W, E.H); } };
const shake = (t, at, d = 0.4, a = 16) => { const k = 1 - prog(t, at, at + d); return t >= at && k > 0 ? Math.sin(t * 95) * a * k : 0; };

// motion layer: beat pulse, drift, push-in, gold dust, vignette on every shot
const registerShot = (id, o) => _reg(id, { draw(g, t, info) {
  const gt = info.globalT, pulse = 0.012 * Math.exp(-((gt % BEAT) / BEAT) * 6), z = 1.03 + (o.zoom ?? 0.015) * t + pulse;
  g.save(); g.translate(E.W / 2 + Math.sin(gt * 0.6) * 10, E.H * 0.5 + Math.cos(gt * 0.45) * 8); g.rotate(Math.sin(gt * 0.4) * 0.003); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.5); o.draw(g, t, info); g.restore();
  const r = rng(11); for (let i = 0; i < 22; i++) { const sp = 30 + r() * 80, x = r() * E.W + Math.sin(gt * 0.7 + i) * 30, y = E.H - ((gt * sp + r() * E.H) % (E.H * 1.1)); circle(g, x, y, 2 + r() * 3.5, `rgba(255,${200 + (i * 5) % 55},80,${0.10 + 0.25 * r()})`); }
  const vg = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.32, E.W / 2, E.H / 2, E.H * 0.78); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H); } });

// ---------- backgrounds
function bg(g, t, kind = 'casino') {
  const gr = g.createLinearGradient(0, 0, 0, E.H);
  if (kind === 'casino') { gr.addColorStop(0, '#0b0e17'); gr.addColorStop(0.55, '#1a1038'); gr.addColorStop(1, '#2a0f3c'); }
  else if (kind === 'blue') { gr.addColorStop(0, '#08111f'); gr.addColorStop(1, '#0e1e3a'); }
  else if (kind === 'red') { gr.addColorStop(0, '#14060b'); gr.addColorStop(1, '#3a0c18'); }
  else { gr.addColorStop(0, '#1a1203'); gr.addColorStop(1, '#4a3205'); }
  g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  if (kind === 'blue') { g.strokeStyle = 'rgba(80,140,255,.10)'; g.lineWidth = 2; const o = (t * 20) % 80; for (let x = -o; x < E.W; x += 80) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = -o; y < E.H; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); } }
  else if (kind === 'casino') { const R = rng(5); for (let i = 0; i < 12; i++) { const x = R() * E.W + Math.sin(t * 0.4 + i) * 30, y = R() * E.H * 0.85, r = 50 + R() * 100; glow(g, x, y, r * 2, ['#ff3dac', '#37e6ff', '#ffcc00'][i % 3], 0.10); }
    for (let i = 0; i < 18; i++) { const x = 30 + i * 60; glow(g, x, 70, 44, '#ffb030', 0.28); circle(g, x, 70, 9, (Math.floor(t * 6) + i) % 3 === 0 ? '#fff4b0' : '#ff9d2e'); }
    g.save(); g.globalAlpha = 0.5; text(g, 'PACHINKO', E.W * 0.27, 205, { size: 74, font: 'Nunito', weight: 900, color: '#ff3dac', glow: 36, glowColor: 'rgba(255,61,172,.9)' }); text(g, 'JACKPOT', E.W * 0.76, 205, { size: 74, font: 'Nunito', weight: 900, color: '#ffcc00', glow: 36, glowColor: 'rgba(255,204,0,.9)' }); g.restore();
    [[0.0, 0.64], [1.0, 0.64]].forEach(([u, v]) => { const cx = E.W * u, cy = E.H * v; for (let ring = 0; ring < 3; ring++) { const r = 170 + ring * 72, n = 26 + ring * 8; for (let k = 0; k < n; k++) { const a = k / n * 6.283 + t * (ring % 2 ? 0.4 : -0.4); circle(g, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 6, `hsla(${(k * 30 + ring * 70 + t * 60) % 360},95%,60%,.5)`); } } }); }
  else { const R = rng(5), cols = kind === 'red' ? ['255,60,80', '255,140,60'] : kind === 'gold' ? ['255,200,60', '255,240,150'] : ['255,61,172', '55,230,255', '255,204,0']; for (let i = 0; i < 16; i++) { const x = R() * E.W + Math.sin(t * 0.4 + i) * 30, y = R() * E.H * 0.85 + Math.cos(t * 0.3 + i) * 20, r = 50 + R() * 100; glow(g, x, y, r * 2, `rgb(${cols[i % cols.length]})`, 0.10); } }
}

// ---------- live HUD readout (bottom-left), tabular digits
function hud(g, t, at, label, val, o = {}) {
  const k = ease.outBack(prog(t, at, at + 0.35)); if (k <= 0) return; const sz = o.size || 72, dw = measure(g, '0', sz, 'Nunito', 900), cw = c => /\d/.test(c) ? dw : measure(g, c, sz, 'Nunito', 900), W = s => [...s].reduce((a, c) => a + cw(c), 0);
  const fw = o.fw || val, w = Math.max(W(fw) + 64, measure(g, label, 28, 'Nunito', 900) + 64), h = sz + 78, x0 = 52 - (1 - k) * 520, y0 = o.y ?? E.H * 0.78;
  g.save(); g.globalAlpha *= 0.9; rr(g, x0, y0, w, h, 26); g.fillStyle = 'rgba(10,14,28,.92)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 3; g.stroke(); g.restore();
  text(g, label, x0 + 32 + measure(g, label, 28, 'Nunito', 900) / 2, y0 + 38, { size: 28, font: 'Nunito', weight: 900, color: GREY });
  let ex = x0 + 32 + W(fw); for (let i = val.length - 1; i >= 0; i--) { const c = val[i], w2 = cw(c); ex -= w2; text(g, c, ex + w2 / 2, y0 + 38 + sz * 0.86, { size: sz, font: 'Nunito', weight: 900, color: o.color || GOLD, glow: 10, glowColor: 'rgba(255,204,0,.35)' }); }
}
const plate = (g, t, at, str, y, o = {}) => { const k = pop(t, at, 0.35); if (k <= 0) return; const sz = o.size || 70, w = measure(g, str, sz, 'Nunito', 900) + 80; g.save(); g.translate(E.W / 2, y); g.rotate(o.rot || 0); g.scale(k, k); g.globalAlpha *= 0.9; rr(g, -w / 2, -sz * 0.7, w, sz * 1.4, sz * 0.42); g.fillStyle = o.fill || 'rgba(10,14,28,.92)'; g.fill(); g.globalAlpha = 1; if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = 5; g.stroke(); } text(g, str, 0, sz * 0.05, { size: sz, font: 'Nunito', weight: 900, color: o.color || WHITE, stroke: 8, strokeColor: 'rgba(0,0,0,.6)' }); g.restore(); };
const stamp = (g, t, at, str, y, col, o = {}) => { const k = 1 + 1.8 * (1 - ease.out(prog(t, at, at + 0.14))); if (t < at) return; g.save(); g.translate(E.W / 2 + shake(t, at + 0.1, 0.4, 14), y); g.rotate(o.rot ?? -0.12); g.scale(k, k); g.globalAlpha = clamp(prog(t, at, at + 0.08), 0, 1); const sz = o.size || 150, w = measure(g, str, sz, 'Nunito', 900) + 90; rr(g, -w / 2, -sz * 0.75, w, sz * 1.5, 26); g.fillStyle = 'rgba(10,6,14,.55)'; g.fill(); g.lineWidth = 12; g.strokeStyle = col; g.stroke(); text(g, str, 0, sz * 0.06, { size: sz, font: 'Nunito', weight: 900, color: col, stroke: 10, strokeColor: 'rgba(0,0,0,.6)' }); g.restore(); };

// ---------- CHARACTER: the gambler. Original vector drawing: swept-back blond waves, stubble, huge grin, black fur-collar coat over a white tee
function hand(g, x, y, s, t, flip, ph = 0) {
  g.save(); g.translate(x, y); g.scale(flip * s, s); g.rotate(-0.25); const w = Math.sin(t * 9 + ph) * 0.35 + 0.55;
  rr(g, -50, -10, 100, 92, 34); g.fillStyle = '#e6ab7a'; g.fill();
  for (let i = 0; i < 4; i++) { g.save(); g.translate(-36 + i * 24, -6); g.rotate(-w * (0.9 + i * 0.08)); rr(g, -11, -64, 22, 70, 11); g.fillStyle = '#eeb988'; g.fill(); g.restore(); }
  g.save(); g.translate(46, 20); g.rotate(0.9 - w * 0.4); rr(g, -12, -52, 24, 60, 12); g.fillStyle = '#eeb988'; g.fill(); g.restore(); g.restore();
}
function gambler(g, cx, cy, s, t, o = {}) {
  const ex = o.expr || 'smug', bt = Math.exp(-((t % BEAT) / BEAT) * 5), bob = Math.sin(t * 2.2) * 6 - bt * 8, tilt = (o.tilt || 0) + Math.sin(t * 1.1) * 0.025, lk = o.look || [0, 0];
  const SK = '#e6ab7a', HAIR = '#f2d06a', HAIRD = '#d6a53a', HAIRL = '#fff1a8';
  g.save(); g.translate(cx, cy + bob); g.rotate(tilt); g.scale(s, s);
  if (o.aura) glow(g, 0, -40, 620, o.aura, 0.5 + 0.15 * Math.sin(t * 8));
  // coat + tee
  g.fillStyle = '#101016'; g.beginPath(); g.moveTo(-460, 450); g.bezierCurveTo(-450, 300, -340, 240, -150, 205); g.lineTo(150, 205); g.bezierCurveTo(340, 240, 450, 300, 460, 450); g.closePath(); g.fill();
  poly(g, [[-135, 215], [135, 215], [108, 450], [-108, 450]], '#f2f2f4');
  g.fillStyle = SK; g.beginPath(); g.moveTo(-72, 150); g.lineTo(72, 150); g.lineTo(100, 238); g.quadraticCurveTo(0, 312, -100, 238); g.closePath(); g.fill();
  g.strokeStyle = '#8a2230'; g.lineWidth = 12; g.beginPath(); g.moveTo(-100, 240); g.quadraticCurveTo(0, 318, 100, 240); g.stroke();
  const sh = g.createLinearGradient(0, 150, 0, 300); sh.addColorStop(0, 'rgba(120,60,30,.35)'); sh.addColorStop(1, 'rgba(120,60,30,0)'); g.fillStyle = sh; g.fillRect(-80, 150, 160, 140);
  seg(g, [[-64, 258], [-24, 272]], 5, 'rgba(120,60,30,.4)'); seg(g, [[64, 258], [24, 272]], 5, 'rgba(120,60,30,.4)');
  poly(g, [[-150, 205], [-128, 218], [-104, 450], [-262, 450], [-316, 300]], '#16161d'); poly(g, [[150, 205], [128, 218], [104, 450], [262, 450], [316, 300]], '#16161d');
  // fur collar: shaggy tufts that ruffle
  [-1, 1].forEach(sd => { g.fillStyle = '#1b1b24'; g.beginPath(); g.moveTo(sd * 60, 150); g.bezierCurveTo(sd * 220, 120, sd * 360, 190, sd * 410, 340); g.lineTo(sd * 150, 270); g.closePath(); g.fill();
    for (let i = 0; i < 26; i++) { const u = i / 25, bx = sd * (90 + 305 * u), by = 175 + 150 * Math.pow(u, 1.35) - 24 * Math.sin(u * 3), L = 74 + 30 * Math.sin(i * 1.7) + 8 * Math.sin(t * 3 + i), an = -Math.PI / 2 + sd * (0.45 + 0.85 * u) + Math.sin(t * 2.5 + i) * 0.06, tx = bx + Math.cos(an) * L, ty = by + Math.sin(an) * L, px = Math.cos(an + Math.PI / 2) * 24, py = Math.sin(an + Math.PI / 2) * 24; poly(g, [[bx - px, by - py], [tx, ty], [bx + px, by + py]], i % 2 ? '#262632' : '#34343f'); } });
  // head
  const head = () => { g.beginPath(); g.moveTo(0, -235); g.bezierCurveTo(158, -235, 178, -30, 152, 100); g.bezierCurveTo(126, 214, 68, 266, 0, 266); g.bezierCurveTo(-68, 266, -126, 214, -152, 100); g.bezierCurveTo(-178, -30, -158, -235, 0, -235); g.closePath(); };
  circle(g, -156, 30, 34, '#d99a68'); circle(g, 156, 30, 34, '#d99a68'); circle(g, 158, 40, 7, '#ffcc00');
  head(); g.fillStyle = SK; g.fill();
  g.save(); head(); g.clip(); const sg = g.createLinearGradient(-160, 0, 160, 0); sg.addColorStop(0, 'rgba(255,255,255,.1)'); sg.addColorStop(0.55, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(120,50,30,.32)'); g.fillStyle = sg; g.fillRect(-200, -260, 400, 540);
  const R = rng(7); for (let i = 0; i < 160; i++) { const x = -105 + R() * 210, y = 100 + R() * 160, inM = Math.abs(x) < 70 && y > 122 && y < 200 && (ex === 'grin' || ex === 'shout'); if (!inM) circle(g, x, y, 2.1, `rgba(110,70,40,${0.18 + 0.25 * R()})`); }
  for (let i = 0; i < 40; i++) circle(g, -62 + R() * 124, 100 + R() * 22, 2, 'rgba(110,70,40,.45)');
  seg(g, [[-112, 40], [-70, 96]], 5, 'rgba(150,80,50,.28)'); seg(g, [[112, 40], [70, 96]], 5, 'rgba(150,80,50,.28)'); g.restore();
  g.strokeStyle = 'rgba(255,190,110,.7)'; g.lineWidth = 8; g.beginPath(); g.moveTo(0, -235); g.bezierCurveTo(158, -235, 178, -30, 152, 100); g.bezierCurveTo(126, 214, 68, 266, 0, 266); g.stroke();
  // hair: swept-back waves with strand lines that sway
  const sw = Math.sin(t * 1.6) * 6; g.fillStyle = HAIR; g.beginPath(); g.moveTo(-170, -60); g.bezierCurveTo(-196, -300, -70, -420, 100, -392); g.bezierCurveTo(240, -362, 222, -200, 182, -80); g.bezierCurveTo(160, -140, 100, -178, 36, -170); g.quadraticCurveTo(0, -214, -34, -170); g.bezierCurveTo(-100, -166, -150, -130, -170, -60); g.closePath(); g.fill();
  g.fillStyle = HAIRD; g.beginPath(); g.moveTo(-170, -60); g.bezierCurveTo(-190, -200, -150, -260, -96, -280); g.bezierCurveTo(-126, -190, -150, -120, -170, -60); g.fill();
  for (let i = 0; i < 7; i++) { const x0 = -110 + i * 38; g.strokeStyle = i % 2 ? HAIRL : HAIRD; g.lineWidth = 7; g.beginPath(); g.moveTo(x0 * 0.7, -170); g.bezierCurveTo(x0, -250 + sw, x0 + 30, -330 - sw * 0.6, x0 + 60 + sw, -392 + (i % 3) * 14); g.stroke(); }
  g.fillStyle = '#e7bd55'; poly(g, [[-172, -60], [-150, -20], [-146, 20], [-168, -10]], HAIRD); poly(g, [[172, -60], [150, -20], [146, 20], [168, -10]], HAIRD);
  // eyes + brows (narrow, confident)
  const bl = ((t * 0.8) % 4 < 0.1) ? 0.15 : 1, op = ({ shock: 1.25, smug: 0.5, grin: 0.5, shout: 0.45, glow: 0.62, stare: 0.7, sweat: 0.95, sad: 0.8 }[ex] ?? 0.7) * bl;
  [-1, 1].forEach(sd => { const x = sd * 74, y = -6, rx = 48, ry = Math.max(30 * op, 3.5);
    g.save(); g.translate(x, y); g.rotate(sd * -0.12); g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, 7); g.fillStyle = '#f4f0ee'; g.fill(); g.save(); g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, 7); g.clip();
    const lx = lk[0] * 14, ly = lk[1] * 8; circle(g, lx, ly, 26, ex === 'glow' ? '#ffd23a' : '#4a5070'); circle(g, lx, ly, ex === 'shock' ? 7 : 12, '#0a0a14'); circle(g, lx - 8, ly - 9, 6, '#fff'); g.restore();
    g.strokeStyle = '#2a1a1a'; g.lineWidth = 9; g.beginPath(); g.ellipse(0, 0, rx, ry, 0, Math.PI, 2 * Math.PI); g.stroke(); g.lineWidth = 3; g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, Math.PI); g.stroke(); g.restore();
    const B = { smug: sd > 0 ? [14, -6, -66] : [2, 6, -84], shock: [-8, -4, -98], grin: [16, -8, -66], shout: [20, -10, -66], sweat: [-12, 8, -76], glow: [16, -10, -66], stare: [8, -2, -70], sad: [-12, 6, -72] }[ex] || [8, -2, -70];
    seg(g, [[sd * 28, B[2] + B[0]], [sd * 76, B[2] - 10 + (B[0] + B[1]) / 4], [sd * 124, B[2] + B[1]]], 21, '#b8872a'); });
  seg(g, [[0, 14], [-16, 78], [20, 88]], 8, '#c58456'); seg(g, [[-26, 92], [-12, 96]], 5, '#8a5030'); seg(g, [[26, 94], [14, 98]], 5, '#8a5030');
  g.lineCap = 'round'; g.strokeStyle = '#2a1018'; g.lineWidth = 10;
  const mouth = (top, bot, w) => { g.beginPath(); g.moveTo(-w, top); g.quadraticCurveTo(0, bot, w, top); g.quadraticCurveTo(0, top - 18, -w, top); g.closePath(); };
  if (ex === 'grin' || ex === 'glow' || ex === 'shout') { const k = ex === 'shout' ? 1.25 : 0.88 + 0.12 * bt; mouth(128, 128 + 150 * k, 100); g.fillStyle = '#5a1020'; g.fill(); g.save(); mouth(128, 128 + 150 * k, 100); g.clip(); g.fillStyle = '#fff'; g.fillRect(-110, 112, 220, 38); g.fillRect(-90, 128 + 112 * k, 180, 30); g.fillStyle = '#e8506a'; g.beginPath(); g.ellipse(0, 128 + 138 * k, 54, 30, 0, 0, 7); g.fill(); g.restore(); mouth(128, 128 + 150 * k, 100); g.stroke(); seg(g, [[-100, 100], [-112, 150]], 6, 'rgba(150,80,50,.5)'); seg(g, [[100, 100], [112, 150]], 6, 'rgba(150,80,50,.5)'); }
  else if (ex === 'smug') { g.beginPath(); g.moveTo(-78, 144); g.quadraticCurveTo(14, 176, 94, 118); g.quadraticCurveTo(24, 234, -78, 144); g.closePath(); g.fillStyle = '#5a1020'; g.fill(); g.save(); g.clip(); g.fillStyle = '#fff'; g.fillRect(-90, 110, 200, 52); g.restore(); g.beginPath(); g.moveTo(-78, 144); g.quadraticCurveTo(14, 176, 94, 118); g.quadraticCurveTo(24, 234, -78, 144); g.stroke(); seg(g, [[96, 118], [108, 102]], 9, '#2a1018'); }
  else if (ex === 'shock') { g.beginPath(); g.ellipse(0, 176, 30, 44 + 6 * Math.sin(t * 20), 0, 0, 7); g.fillStyle = '#4a0f1f'; g.fill(); g.stroke(); }
  else if (ex === 'sweat') { rr(g, -62, 148, 124, 46, 14); g.fillStyle = '#fff'; g.fill(); g.stroke(); for (let i = -2; i <= 2; i++) seg(g, [[i * 24, 150], [i * 24, 192]], 4, '#2a1018'); }
  else { g.beginPath(); g.moveTo(-54, 164); g.quadraticCurveTo(10, 180, 70, 150); g.stroke(); seg(g, [[72, 150], [84, 138]], 9, '#2a1018'); }
  if (ex === 'sweat' || ex === 'shock') for (let i = 0; i < 2; i++) { const k = (t * 1.3 + i * 0.5) % 1; poly(g, [[140 - i * 10, -150 + k * 220], [128 - i * 10, -118 + k * 220], [152 - i * 10, -118 + k * 220]], 'rgba(120,210,255,.9)'); circle(g, 140 - i * 10, -114 + k * 220, 13, 'rgba(120,210,255,.9)'); }
  g.restore();
}

// ---------- CURSE (original monster)
function curse(g, cx, cy, s, t, a = 1) {
  g.save(); g.globalAlpha *= a; g.translate(cx, cy); g.scale(s, s); const w = Math.sin(t * 3) * 14; glow(g, 0, 0, 560, '#7a1fff', 0.35);
  [-1, 1].forEach(sd => { seg(g, [[sd * 250, 150], [sd * 380, 60 + w * sd], [sd * 440, -30]], 44, '#1a0a2e'); for (let k = 0; k < 3; k++) poly(g, [[sd * (430 + k * 14) - 8, -20 - k * 16], [sd * (505 + k * 14), -56 - k * 22], [sd * (440 + k * 14) + 8, -2 - k * 16]], '#f3f0e8'); });
  g.beginPath(); g.moveTo(-260, 320); g.bezierCurveTo(-330, 60 + w, -250, -260, -60, -300 + w); g.bezierCurveTo(120, -340, 300, -180, 280, 40 - w); g.bezierCurveTo(260, 200, 320, 270, 300, 320); g.closePath(); g.fillStyle = '#1a0a2e'; g.fill(); g.strokeStyle = '#7a1fff'; g.lineWidth = 9; g.stroke();
  [[-110, -120, 26], [-30, -176, 34], [76, -130, 30], [150, -56, 22], [-176, -30, 20], [10, -56, 42]].forEach(([x, y, r]) => { circle(g, x, y, r, '#ffe84a'); g.fillStyle = '#120418'; g.beginPath(); g.ellipse(x + Math.sin(t * 2) * 3, y, r * 0.26, r * 0.8, 0, 0, 7); g.fill(); });
  g.fillStyle = '#0a0212'; g.beginPath(); g.moveTo(-176, 72); g.quadraticCurveTo(0, 210 + w, 176, 72); g.quadraticCurveTo(0, 112, -176, 72); g.fill(); for (let i = 0; i < 9; i++) { const x = -152 + i * 38; poly(g, [[x, 82], [x + 20, 82], [x + 10, 128 + (i % 2) * 10]], '#f3f0e8'); }
  g.restore();
}

// ---------- SLOT MACHINE (reels spin, stop on final symbols)
function symb(g, k, x, y, r) {
  if (k === '7') text(g, '7', x, y + r * 0.38, { size: r * 2.2, font: 'Nunito', weight: 900, color: '#ff2a4a', stroke: 9, strokeColor: '#fff' });
  else if (k === 'C') { circle(g, x - r * 0.32, y + r * 0.32, r * 0.36, '#ff2a4a'); circle(g, x + r * 0.32, y + r * 0.42, r * 0.36, '#d6143a'); seg(g, [[x - r * 0.32, y], [x, y - r * 0.6], [x + r * 0.32, y + r * 0.1]], 6, '#2d8a3a'); }
  else if (k === 'D') { poly(g, [[x, y - r * 0.85], [x + r * 0.62, y], [x, y + r * 0.85], [x - r * 0.62, y]], CY); poly(g, [[x, y - r * 0.85], [x + r * 0.62, y], [x, y]], '#bff6ff'); }
  else if (k === 'B') { rr(g, x - r * 0.85, y - r * 0.38, r * 1.7, r * 0.76, 12); g.fillStyle = '#111'; g.fill(); text(g, 'BAR', x, y + r * 0.2, { size: r * 0.58, font: 'Nunito', weight: 900, color: GOLD }); }
  else if (k === '?') text(g, '?', x, y + r * 0.36, { size: r * 2, font: 'Nunito', weight: 900, color: 'rgba(255,255,255,.35)' });
}
const SYMS = ['7', 'C', 'D', 'B', '7', 'C', 'D', 'B'];
function slot(g, t, cx, cy, s, o = {}) {
  g.save(); g.translate(cx, cy); g.scale(s, s); glow(g, 0, 0, 640, MAG, 0.18);
  rr(g, -340, -430, 680, 860, 52); const gr = g.createLinearGradient(-340, -430, 340, 430); gr.addColorStop(0, '#9b2fd0'); gr.addColorStop(1, '#4a1a8a'); g.fillStyle = gr; g.fill(); g.lineWidth = 12; g.strokeStyle = GOLD; g.stroke();
  for (let i = 0; i < 14; i++) circle(g, -286 + i * 44, -388, 11, (Math.floor(t * 8) + i) % 3 === 0 ? '#fff' : GOLD);
  rr(g, -285, -270, 570, 400, 26); g.fillStyle = '#0a0a14'; g.fill();
  g.save(); rr(g, -285, -270, 570, 400, 26); g.clip(); const done = o.final && o.stopAt ? o.stopAt.map(x => o.t0 + t >= x) : [false, false, false];
  [0, 1, 2].forEach(r => { const rx = -190 + r * 190; rr(g, rx - 88, -270, 176, 400, 6); g.fillStyle = '#e9eaf5'; g.fill(); const stopped = done[r];
    if (stopped) { for (let j = -1; j <= 1; j++) symb(g, j === 0 ? o.final[r] : SYMS[(r * 3 + j + 9) % 8], rx, -70 + j * 140, 62); }
    else { const p = t * (11 + r * 3) + r * 2.1; for (let j = -2; j <= 3; j++) { const idx = ((Math.floor(p) + j) % 8 + 8) % 8, fr = p % 1; g.globalAlpha = 0.85; symb(g, SYMS[idx], rx, -70 + (j - fr) * 140, 62); g.globalAlpha = 1; } const vb = g.createLinearGradient(0, -270, 0, 130); vb.addColorStop(0, 'rgba(10,10,20,.5)'); vb.addColorStop(0.5, 'rgba(10,10,20,0)'); vb.addColorStop(1, 'rgba(10,10,20,.5)'); g.fillStyle = vb; g.fillRect(rx - 88, -270, 176, 400); } });
  g.restore(); if (done.every(Boolean)) { seg(g, [[-285, -70], [285, -70]], 8, GOLD); glow(g, 0, -70, 360, GOLD, 0.35); }
  rr(g, -285, -270, 570, 400, 26); g.lineWidth = 10; g.strokeStyle = '#14101c'; g.stroke();
  rr(g, -200, 190, 400, 130, 22); g.fillStyle = '#1b0f3a'; g.fill(); text(g, o.panel || 'JACKPOT', 0, 276, { size: 74, font: 'Nunito', weight: 900, color: GOLD });
  const pl = o.pull ? o.pull(t) : 0; seg(g, [[352, -60], [412, -60 - 200 * (1 - pl) + 160 * pl]], 18, '#cfd2e4'); circle(g, 412, -60 - 200 * (1 - pl) + 160 * pl, 34, '#ff2a4a');
  g.restore();
}

// ---------- chart of P(win) = 1 - (238/239)^n
function chart(g, t, upto, xmax, marks = []) {
  const x0 = 150, y0 = 640, w = 800, h = 560; rr(g, x0 - 70, y0 - 50, w + 120, h + 130, 30); g.fillStyle = 'rgba(8,16,34,.88)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 3; g.stroke();
  [0, 0.25, 0.5, 0.75, 1].forEach(v => { const y = y0 + h * (1 - v); seg(g, [[x0, y], [x0 + w, y]], 2, 'rgba(255,255,255,.12)'); text(g, Math.round(v * 100) + '%', x0 - 36, y + 10, { size: 28, font: 'Nunito', weight: 900, color: GREY }); });
  const ticks = xmax > 700 ? [0, 239, 550, 1100] : [0, 100, 239, 300]; ticks.forEach(n => { if (n > xmax) return; const x = x0 + w * n / xmax; seg(g, [[x, y0 + h], [x, y0 + h + 12]], 3, GREY); text(g, String(n), x, y0 + h + 52, { size: 28, font: 'Nunito', weight: 900, color: GREY }); });
  text(g, 'SPINS', x0 + w / 2, y0 + h + 100, { size: 26, font: 'Nunito', weight: 900, color: 'rgba(154,160,180,.7)' });
  const pts = []; for (let n = 0; n <= upto; n += xmax / 160) pts.push([x0 + w * n / xmax, y0 + h * (1 - P(n))]); if (pts.length > 1) { seg(g, pts, 18, 'rgba(255,204,0,.25)'); seg(g, pts, 9, GOLD); const hp = pts[pts.length - 1]; glow(g, hp[0], hp[1], 90, GOLD, 0.7); circle(g, hp[0], hp[1], 13, '#fff'); }
  marks.forEach(m => { if (upto < m.n) return; const x = x0 + w * m.n / xmax, y = y0 + h * (1 - P(m.n)), k = pop(t, m.at, 0.3); g.save(); g.globalAlpha = clamp(k, 0, 1); g.setLineDash([12, 10]); seg(g, [[x, y], [x, y0 + h]], 3, m.col); seg(g, [[x0, y], [x, y]], 3, m.col); g.setLineDash([]); circle(g, x, y, 17, m.col); g.translate(x + (m.dx ?? 30), y + (m.dy ?? -60)); g.scale(clamp(k, 0, 1.1), clamp(k, 0, 1.1)); rr(g, -4, -42, measure(g, m.txt, 56, 'Nunito', 900) + 40, 84, 24); g.fillStyle = 'rgba(8,10,22,.95)'; g.fill(); g.strokeStyle = m.col; g.lineWidth = 5; g.stroke(); text(g, m.txt, measure(g, m.txt, 56, 'Nunito', 900) / 2 + 16, 18, { size: 56, font: 'Nunito', weight: 900, color: m.col }); g.restore(); });
}
const icon = (g, x, y, r, col, fillIt = true) => { g.save(); g.fillStyle = col; g.strokeStyle = col; g.lineWidth = 5; if (fillIt) { circle(g, x, y - r * 0.5, r * 0.42, col); g.beginPath(); g.ellipse(x, y + r * 0.55, r * 0.7, r * 0.5, 0, Math.PI, 2 * Math.PI); g.fill(); } else { g.beginPath(); g.arc(x, y - r * 0.5, r * 0.42, 0, 7); g.stroke(); g.beginPath(); g.ellipse(x, y + r * 0.55, r * 0.7, r * 0.5, 0, Math.PI, 2 * Math.PI); g.stroke(); } g.restore(); };

// ============ SHOTS ============
// s01 hook: gambler + odds readout (1 in 239 counts up on the spoken "239")
registerShot('s01', { zoom: 0.025, draw(g, t, info) {
  bg(g, t); slot(g, t, E.W * 0.9, E.H * 0.6, 0.46, { t0: 0 }); gambler(g, E.W * 0.4, E.H * 0.56, 1.15, t, { expr: 'smug', look: [0.5, 0.1], tilt: -0.03 });
  hud(g, t, 1.5, 'JACKPOT ODDS', '1 in ' + Math.round(cnt(info, 1.72, 2.4, 239)), { fw: '1 in 239' }); flash(g, t, 0, 0.25, '255,61,172');
} });
// s02 reels spin, spin counter climbs
registerShot('s02', { zoom: 0.03, draw(g, t, info) {
  bg(g, t); slot(g, t, E.W / 2, E.H * 0.5, 0.95, { t0: 0, pull: tt => ease.inOut(Math.min(1, Math.max(0, 1 - Math.abs(tt - 0.4) / 0.4))) }); hud(g, t, 0.05, 'SPINS', fmt(cnt(info, 2.6, 4.0, 90)), { fw: '239' });
} });
// s03 counter reaches 239 on the word
registerShot('s03', { zoom: 0.03, draw(g, t, info) {
  bg(g, t); slot(g, t, E.W / 2, E.H * 0.5, 0.95, { t0: 0 }); hud(g, t, 0, 'SPINS', fmt(cnt(info, 4.0, 5.28, 239, 90)), { fw: '239' }); plate(g, t, 1.3, '239 SPINS', 500, { color: GOLD, size: 66 });
} });
// s04 the false belief: guaranteed
registerShot('s04', { zoom: 0.02, draw(g, t, info) {
  bg(g, t); gambler(g, E.W / 2, E.H * 0.55, 1.22, t, { expr: 'smug', look: [0.3, -0.2], tilt: 0.03 }); hand(g, E.W * 0.13, E.H * 0.66, 0.95, t, 1); hand(g, E.W * 0.87, E.H * 0.66, 0.95, t, -1, 1.7); hud(g, t, 0.1, 'WIN CHANCE', Math.round(cnt(info, 6.3, 7.2, 100)) + '%', { fw: '100%', color: GREEN });
  stamp(g, t, 0.64, 'GUARANTEED', E.H * 0.7, GREEN, { size: 96, rot: -0.1 }); const q = pop(t, 1.2, 0.3); if (q > 0) { g.save(); g.translate(E.W * 0.82, E.H * 0.45); g.scale(q, q); text(g, '?', 0, 0, { size: 220, font: 'Nunito', weight: 900, color: GOLD, stroke: 14, strokeColor: 'rgba(0,0,0,.6)' }); g.restore(); }
} });
// s05 WRONG
registerShot('s05', { zoom: 0.06, draw(g, t, info) {
  bg(g, t, 'red'); g.save(); g.translate(shake(t, 0, 0.6, 20), 0); gambler(g, E.W / 2, E.H * 0.55, 1.28, t, { expr: 'shock', look: [0, 0] }); g.restore(); stamp(g, t, 0.05, 'WRONG', E.H * 0.68, RED, { size: 190, rot: -0.1 }); flash(g, t, 0, 0.3, '255,40,60');
} });
// s06 spins have no memory: coin flips, history fades
registerShot('s06', { zoom: 0.02, draw(g, t, info) {
  bg(g, t, 'blue'); const n = Math.floor(t / 0.36), R = i => rng(i * 7 + 3)() > 0.5;
  for (let i = 0; i < 6; i++) { const idx = n - i; if (idx < 0) continue; const age = i + (t / 0.36 % 1), x = E.W * 0.8 - age * 170, a = clamp(1 - age / 5.2, 0, 1), flip = i === 0 ? Math.abs(Math.cos((t / 0.36 % 1) * 6.28)) : 1; g.save(); g.globalAlpha = a; g.translate(x, E.H * 0.5); g.scale(1, Math.max(0.1, flip)); g.scale(1.25, 1.25); circle(g, 0, 0, 62, GOLD); circle(g, 0, 0, 48, '#ffe27a'); text(g, R(idx) ? 'H' : 'T', 0, 22, { size: 70, font: 'Nunito', weight: 900, color: '#8a6200' }); g.restore(); }
  text(g, '?', E.W * 0.1, E.H * 0.5 + 40, { size: 150, font: 'Nunito', weight: 900, color: 'rgba(255,255,255,.3)' }); hud(g, t, 0.1, 'MEMORY OF PAST SPINS', '0', { fw: '0', color: RED }); plate(g, t, 0.5, 'EVERY SPIN IS NEW', 700, { size: 68, color: CY }); plate(g, t, 1.1, 'THE PAST DOESN\'T COUNT', 1500, { size: 52, color: WHITE });
} });
// s07 the curve: 63.2% at 239 spins (rolls up on "sixty-three percent")
registerShot('s07', { zoom: 0.015, draw(g, t, info) {
  bg(g, t, 'blue'); const up = 239 * ease.out(prog(info.globalT, 11.1, 12.9)); chart(g, t, up, 300, [{ n: 239, at: 12.9 - 11.0, col: GOLD, txt: '63%', dx: -250, dy: -120 }]);
  hud(g, t, 0.2, 'CHANCE BY SPIN 239', cnt(info, 12.5, 13.5, 63.2).toFixed(1) + '%', { fw: '63.2%' });
} });
// s08 100 gamblers: 63 win, 37 empty-handed
registerShot('s08', { zoom: 0.015, draw(g, t, info) {
  bg(g, t, 'blue'); const x0 = 120, y0 = 640, pit = 84; for (let i = 0; i < 100; i++) { const c = i % 10, r = Math.floor(i / 10), x = x0 + c * pit, y = y0 + r * pit * 0.88; if (i < 63) { const k = pop(info.globalT, 14.7 + i * 0.016, 0.25); if (k > 0) { g.save(); g.translate(x, y); g.scale(k, k); icon(g, 0, 0, 36, GOLD); g.restore(); } else icon(g, x, y, 36, 'rgba(255,255,255,.12)'); } else { const on = info.globalT > 16.0, f = on ? 0.5 + 0.5 * Math.sin(info.globalT * 7 + i) : 0; icon(g, x, y, 36, on ? `rgba(255,59,74,${0.55 + 0.45 * f})` : 'rgba(255,255,255,.12)', false); } }
  hud(g, t, 1.4, 'EMPTY-HANDED', Math.round(cnt(info, 16.0, 17.3, 37)) + '%', { fw: '37%', color: RED, y: E.H * 0.8 }); plate(g, t, 1.4, '1 IN 3', 500, { color: RED, size: 74 });
} });
// s09 550 spins for 90%
registerShot('s09', { zoom: 0.015, draw(g, t, info) {
  bg(g, t, 'blue'); const up = 550 * ease.out(prog(info.globalT, 18.2, 20.2)); chart(g, t, up, 1100, [{ n: 239, at: 0.0, col: GOLD, txt: '63%', dx: 20, dy: 110 }, { n: 550, at: 20.2 - 18.1, col: GREEN, txt: '90%', dx: -230, dy: -100 }]);
  hud(g, t, 0.1, 'SPINS FOR 90%', fmt(cnt(info, 19.5, 20.5, 550)), { fw: '550', color: GREEN });
} });
// s10 one spin a second: stopwatch ticking in whole seconds
registerShot('s10', { zoom: 0.02, draw(g, t, info) {
  bg(g, t); const cx = E.W / 2, cy = E.H * 0.47, sec = Math.floor(t * 1.0 + 0.2), hh = -Math.PI / 2 + (sec % 60) / 60 * 6.283; slot(g, t, E.W * 0.84, E.H * 0.72, 0.36, { t0: 0 });
  circle(g, cx, cy, 285, '#0c1020'); g.lineWidth = 26; g.strokeStyle = 'rgba(255,255,255,.1)'; g.beginPath(); g.arc(cx, cy, 258, 0, 7); g.stroke(); g.strokeStyle = GOLD; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, 258, -Math.PI / 2, hh); g.stroke();
  for (let i = 0; i < 60; i++) { const a = i / 60 * 6.283 - Math.PI / 2; seg(g, [[cx + Math.cos(a) * 290, cy + Math.sin(a) * 290], [cx + Math.cos(a) * (i % 5 ? 305 : 322), cy + Math.sin(a) * (i % 5 ? 305 : 322)]], i % 5 ? 3 : 6, '#aab'); }
  seg(g, [[cx, cy], [cx + Math.cos(hh) * 215, cy + Math.sin(hh) * 215]], 9, '#fff'); circle(g, cx, cy, 16, GOLD); text(g, '1', cx, cy + 150, { size: 120, font: 'Nunito', weight: 900, color: GOLD }); text(g, 'SPIN / SEC', cx, cy + 205, { size: 40, font: 'Nunito', weight: 900, color: GREY }); hud(g, t, 0.2, 'SPEED', '1 /sec', { fw: '1 /sec' });
} });
// s11 nine minutes, with a curse trying to kill him
registerShot('s11', { zoom: 0.03, draw(g, t, info) {
  bg(g, t, 'red'); const hit = info.globalT > 25.9, sk = hit ? shake(t, 25.9 - 23.7, 0.5, 16) : 0; g.save(); g.translate(sk, 0); curse(g, E.W / 2, E.H * 0.43, 0.95, t, 1); gambler(g, E.W * 0.66, E.H * 0.84, 0.95, t, { expr: 'sweat', look: [-0.5, -0.8] }); g.restore();
  const s = Math.round(cnt(info, 23.8, 24.9, 550)); hud(g, t, 0.1, 'TIME SPINNING', `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`, { fw: '9:10', y: E.H * 0.6 }); if (hit) flash(g, t, 25.9 - 23.7, 0.3, '255,40,60');
} });
// s12 the prize: last reel crawls to 7
registerShot('s12', { zoom: 0.05, draw(g, t, info) {
  bg(g, t, 'gold'); slot(g, t, E.W / 2, E.H * 0.5, 1.0, { t0: info.globalT - t, final: ['7', '7', '7'], stopAt: [27.0, 27.5, 28.17], pull: () => 1, panel: 'NEXT SPIN' }); hud(g, t, 0.1, 'ODDS', '1 in 239', { fw: '1 in 239' }); const k = (t * 3) % 1; glow(g, E.W * 0.5, E.H * 0.43, 300 + 80 * k, GOLD, 0.15 + 0.2 * (t / 1.7));
} });
// s13 JACKPOT 777: aura, 4:11 timer, perks
registerShot('s13', { zoom: 0.03, draw(g, t, info) {
  bg(g, t, 'gold'); rays(g, E.W / 2, E.H * 0.5, 250, 1100, t, 0.3, 60); gambler(g, E.W / 2, E.H * 0.6, 1.12, t, { expr: 'glow', aura: GOLD, look: [0, -0.2] });
  plate(g, t, 0.15, '7  7  7  JACKPOT', 575, { color: GOLD, size: 66, stroke: GOLD }); const s = Math.round(cnt(info, 29.0, 30.2, 251)); hud(g, t, 0.3, 'JACKPOT LASTS', `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`, { fw: '4:11', color: GOLD });
  const a = pop(t, 1.0, 0.3), b = pop(t, 1.4, 0.3); [[a, 'INFINITE ENERGY', E.W * 0.3, E.H * 0.7], [b, 'AUTO-HEAL', E.W * 0.7, E.H * 0.75]].forEach(([k, s2, x, y]) => { if (k > 0) { g.save(); g.translate(x, y); g.scale(k, k); g.rotate(-0.05); const w = measure(g, s2, 42, 'Nunito', 900) + 56; rr(g, -w / 2, -34, w, 68, 34); g.fillStyle = 'rgba(10,14,28,.92)'; g.fill(); g.lineWidth = 4; g.strokeStyle = CY; g.stroke(); text(g, s2, 0, 14, { size: 42, font: 'Nunito', weight: 900, color: CY }); g.restore(); } });
  flash(g, t, 0, 0.35);
} });
function rays(g, cx, cy, r0, r1, t, a = 0.5, n = 56) { for (let i = 0; i < n; i++) { const an = i / n * Math.PI * 2 + t * 0.06, len = r1 * (i % 2 ? 0.8 : 1); seg(g, [[cx + Math.cos(an) * r0, cy + Math.sin(an) * r0], [cx + Math.cos(an) * len, cy + Math.sin(an) * len]], i % 2 ? 3 : 6, `rgba(255,220,100,${a})`); } }
// s14 4 x 60 + 11 = 251
registerShot('s14', { zoom: 0.02, draw(g, t, info) {
  bg(g, t, 'blue'); [['4 min × 60', 0.1, 0.4, WHITE], ['= 240 s', 0.5, 0.52, WHITE], ['+ 11 s', 0.9, 0.64, CY]].forEach(([s2, at, y, c], i) => { const k = ease.outBack(prog(t, at, at + 0.3)); if (k > 0) { g.save(); g.translate(E.W / 2 + (1 - k) * 420 * (i % 2 ? 1 : -1), E.H * (y - 0.1)); const w = measure(g, s2, 84, 'Nunito', 900) + 80; rr(g, -w / 2, -60, w, 120, 36); g.fillStyle = 'rgba(8,16,34,.92)'; g.fill(); text(g, s2, 0, 30, { size: 84, font: 'Nunito', weight: 900, color: c }); g.restore(); } });
  const k = pop(t, 1.4, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.62); g.scale(k, k); text(g, fmt(cnt(info, 31.2, 32.3, 251)), 0, 0, { size: 230, font: 'Nunito', weight: 900, color: GOLD, glow: 40, glowColor: 'rgba(255,204,0,.6)', stroke: 16, strokeColor: 'rgba(0,0,0,.6)' }); text(g, 'SECONDS', 0, 100, { size: 60, font: 'Nunito', weight: 900, color: WHITE }); g.restore(); }
} });
// s15 average wait 239 vs jackpot 251: nearly equal
registerShot('s15', { zoom: 0.015, draw(g, t, info) {
  bg(g, t, 'blue'); const a = ease.out(prog(info.globalT, 33.45, 34.5)), b = ease.out(prog(info.globalT, 33.9, 35.0)), x0 = 120, W = 840;
  [['AVERAGE WAIT', '239 spins', 239 * a, CY, 0.4], ['JACKPOT LASTS', '251 sec', 251 * b, GOLD, 0.58]].forEach(([lab, u, v, c, y]) => { text(g, lab, x0, E.H * y - 60, { size: 40, font: 'Nunito', weight: 900, color: GREY, align: 'left' }); rr(g, x0, E.H * y - 30, W, 90, 24); g.fillStyle = 'rgba(255,255,255,.07)'; g.fill(); rr(g, x0, E.H * y - 30, Math.max(10, W * v / 260), 90, 24); g.fillStyle = c; g.fill(); text(g, fmt(v) + ' ' + u.split(' ')[1], x0 + Math.max(10, W * v / 260) - 40, E.H * y + 38, { size: 54, font: 'Nunito', weight: 900, color: '#0b0e17', align: 'right' }); });
  const k = pop(t, 35.3 - 33.3, 0.35); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.495); g.scale(k, k); circle(g, 0, 0, 62, '#0b0e17'); g.lineWidth = 6; g.strokeStyle = WHITE; g.stroke(); text(g, '≈', 0, 26, { size: 100, font: 'Nunito', weight: 900, color: WHITE }); g.restore(); }
} });
// s16 reward lasts as long as the gamble: two rings locked together
registerShot('s16', { zoom: 0.02, draw(g, t, info) {
  bg(g, t, 'gold'); const cx = E.W / 2, cy = E.H * 0.5, sp = 130 * (1 - 0.25 * Math.exp(-t * 2)), r = 210;
  [[-1, CY, 'GAMBLE'], [1, GOLD, 'REWARD']].forEach(([sd, c, lab]) => { g.lineWidth = 34; g.strokeStyle = c; g.beginPath(); g.arc(cx + sd * sp, cy, r, 0, 7); g.stroke(); glow(g, cx + sd * sp, cy, 260, c, 0.18); text(g, lab, cx + sd * (sp + 60), cy - r - 60, { size: 58, font: 'Nunito', weight: 900, color: c, stroke: 8, strokeColor: 'rgba(0,0,0,.6)' }); });
  const k = pop(t, 0.4, 0.35); if (k > 0) { g.save(); g.translate(cx, cy + r + 130); g.scale(k, k); text(g, '=', 0, 0, { size: 170, font: 'Nunito', weight: 900, color: WHITE, stroke: 14, strokeColor: 'rgba(0,0,0,.6)' }); g.restore(); }
  const pl = Math.max(0, 1 - Math.abs(info.globalT - 38.6) / 0.3); if (pl > 0) glow(g, cx, cy, 700, '#fff', 0.35 * pl);
} });
// s17 the machine forgets: aura fades, smile drops, memory wiped
registerShot('s17', { zoom: 0.02, draw(g, t, info) {
  bg(g, t, 'gold'); const k = prog(info.globalT, 40.2, 41.6), wipe = E.H * k; g.save(); if (k > 0) { g.beginPath(); g.rect(0, wipe, E.W, E.H); g.clip(); } gambler(g, E.W / 2, E.H * 0.57, 1.14, t, { expr: k > 0.4 ? 'stare' : 'glow', aura: k < 0.7 ? GOLD : null }); g.restore();
  if (k > 0 && k < 1) { rr(g, 0, wipe - 14, E.W, 28, 10); g.fillStyle = CY; g.fill(); glow(g, E.W / 2, wipe, 500, CY, 0.4); const R = rng(4); for (let i = 0; i < 30; i++) g.fillRect(R() * E.W, wipe - 4 + R() * 60, 20 + R() * 100, 5); }
  hud(g, t, 0.1, 'MEMORY OF THE JACKPOT', k > 0.5 ? 'ERASED' : 'KEPT', { fw: 'ERASED', color: k > 0.5 ? RED : GREEN, size: 60 }); flash(g, t, 41.55 - 39.3, 0.25, '55,230,255');
} });
// s18 back to 1 in 239
registerShot('s18', { zoom: 0.04, draw(g, t, info) {
  bg(g, t, 'casino'); slot(g, t, E.W / 2, E.H * 0.5, 0.95, { t0: 0 }); stamp(g, t, 0.35, '1 IN 239', E.H * 0.5, RED, { size: 160, rot: -0.1 }); hud(g, t, 0.1, 'ODDS RESET', '1 in 239', { fw: '1 in 239', color: RED }); flash(g, t, 0.33, 0.25, '255,40,60');
} });
// s19 the question + CTA
registerShot('s19', { zoom: 0.04, draw(g, t, info) {
  bg(g, t); gambler(g, E.W / 2, E.H * 0.56, 1.18, t, { expr: 'stare', look: [0, 0.1] }); const fl = Math.abs(Math.cos(t * 7)); g.save(); g.translate(E.W * 0.82, E.H * 0.4 + Math.sin(t * 3) * 20); g.scale(1, Math.max(0.12, fl)); circle(g, 0, 0, 62, GOLD); circle(g, 0, 0, 48, '#ffe27a'); text(g, '63%', 0, 14, { size: 40, font: 'Nunito', weight: 900, color: '#8a6200' }); g.restore();
  plate(g, t, 0.15, 'BET YOUR LIFE ON 63%?', 505, { size: 56, color: GOLD });
  const k = pop(t, 1.4, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.86); g.scale(k, k); const s2 = 'FOLLOW TOON THEORY', w = measure(g, s2, 54, 'Nunito', 900) + 90; rr(g, -w / 2, -48, w, 96, 48); g.fillStyle = GOLD; g.fill(); text(g, s2, 0, 18, { size: 54, font: 'Nunito', weight: 900, color: '#14101c' }); g.restore(); }
} });
