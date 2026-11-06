// sets/brain.js: a recognisable side-view brain (frontal lobe left) with the touch strip (Penfield map) and a cinematic backdrop.
import { E, V, ease, prog, clamp, lerp, glow, alpha, mix, text, rng, rr } from '/engine/core.js';

const CY = '#7fe8ff', AMB = '#ffd8a0';
// deep cinematic background: navy-teal gradient, soft nebula glows, drifting bokeh, vignette
export function cineBG(g, t, o = {}) {
  const { tint = CY, warm = AMB } = o, W = E.W, H = E.H;
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#03060c'); gr.addColorStop(0.5, '#071722'); gr.addColorStop(1, '#0b0a14'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  glow(g, W * (0.25 + 0.04 * Math.sin(t * 0.3)), H * 0.3, W * 0.9, tint, 0.13);
  glow(g, W * (0.8 - 0.04 * Math.sin(t * 0.25)), H * 0.72, W * 0.8, warm, 0.09);
  const R = rng(5); for (let i = 0; i < 38; i++) { const x = R() * W, y0 = R() * H, sp = 6 + R() * 18, r = 3 + R() * 16, y = (y0 - t * sp + H * 2) % H, a = 0.05 + R() * 0.18;
    g.fillStyle = alpha(R() > 0.7 ? warm : tint, a * (0.6 + 0.4 * Math.sin(t * 1.3 + i))); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  const vg = g.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, H * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.75)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
}
// brain outline (local coords, ~760 x 520)
function outline(g) {
  g.beginPath(); g.moveTo(-350, 40);
  g.bezierCurveTo(-385, -150, -225, -285, -20, -282); g.bezierCurveTo(200, -286, 365, -175, 372, -25);
  g.bezierCurveTo(378, 70, 320, 122, 238, 128); g.bezierCurveTo(165, 138, 125, 192, 40, 200);
  g.bezierCurveTo(-60, 214, -150, 190, -205, 150); g.bezierCurveTo(-268, 150, -335, 118, -350, 40); g.closePath();
}
// central sulcus as a quadratic: top -> lateral fissure; the touch strip runs just behind it
const CS = [[38, -280], [66, -120], [-26, 74]];
const qb = (u, P) => [(1 - u) ** 2 * P[0][0] + 2 * (1 - u) * u * P[1][0] + u * u * P[2][0], (1 - u) ** 2 * P[0][1] + 2 * (1 - u) * u * P[1][1] + u * u * P[2][1]];
const stripPt = (u) => { const [x, y] = qb(u, CS); return [x + 46, y - 4]; };
export const ZONES = [['TOES', 0.8], ['LEG', 1.1], ['TRUNK', 1], ['ARM', 1.1], ['HAND', 2.0], ['FACE', 1.7], ['LIPS', 1.1], ['TONGUE', 0.9]];
const TOT = ZONES.reduce((s, z) => s + z[1], 0);
const zoneU = (() => { let a = 0.02; return ZONES.map(([n, w]) => { const u0 = a, u1 = a + (w / TOT) * 0.93; a = u1; return [n, u0, u1]; }); })();
// returns screen-space point of a zone centre (for arrows/zoom)
export function zonePoint(name, o = {}) { const { cx = E.W / 2, cy = E.H * 0.5, s = V(1.0, 1.25), zoom = 1 } = o; const z = zoneU.find((q) => q[0] === name); const [x, y] = stripPt((z[1] + z[2]) / 2); return [cx + x * s * zoom, cy + y * s * zoom]; }
// draw the brain. lit: {ZONE: 0..1}; labels: 0..1 reveal; t for shimmer
export function brain(g, t, o = {}) {
  const { cx = E.W / 2, cy = E.H * 0.5, s = V(1.0, 1.25), lit = {}, labels = 1, zoom = 1, reveal = 1 } = o;
  g.save(); g.translate(cx, cy); g.scale(s * zoom, s * zoom);
  // halo + shadow
  glow(g, 0, -40, 520, CY, 0.12); g.save(); g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.ellipse(20, 300, 330, 34, 0, 0, 7); g.fill(); g.restore();
  // cerebellum + brainstem (behind)
  g.save(); g.fillStyle = '#8a5a68'; g.beginPath(); g.moveTo(130, 160); g.bezierCurveTo(140, 230, 150, 290, 175, 330); g.lineTo(215, 330); g.bezierCurveTo(200, 280, 205, 220, 210, 160); g.closePath(); g.fill();
  const cg = g.createRadialGradient(250, 160, 10, 250, 170, 130); cg.addColorStop(0, '#d79aa6'); cg.addColorStop(1, '#7a4656'); g.fillStyle = cg; g.beginPath(); g.ellipse(255, 172, 118, 64, -0.12, 0, 7); g.fill();
  g.strokeStyle = 'rgba(70,30,44,.7)'; g.lineWidth = 4; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(255, 172 + i * 4, 110 - i * 14, 56 - i * 9, -0.12, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); } g.restore();
  // cerebrum
  outline(g); const bg = g.createRadialGradient(-80, -140, 40, 0, 0, 420); bg.addColorStop(0, '#f0bcc4'); bg.addColorStop(0.55, '#c98794'); bg.addColorStop(1, '#7a4456'); g.fillStyle = bg; g.fill();
  g.save(); outline(g); g.clip();
  // gyri: deterministic wavy folds
  const R = rng(11); g.lineCap = 'round';
  for (let i = 0; i < 34; i++) { let x = -360 + R() * 720, y = -270 + R() * 460, ang = R() * 6.28; g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 7; k++) { ang += (R() - 0.5) * 1.6; const nx = x + Math.cos(ang) * 46, ny = y + Math.sin(ang) * 46; g.quadraticCurveTo((x + nx) / 2 + (R() - 0.5) * 40, (y + ny) / 2 + (R() - 0.5) * 40, nx, ny); x = nx; y = ny; }
    g.strokeStyle = 'rgba(110,46,66,.42)'; g.lineWidth = 16; g.stroke(); g.strokeStyle = 'rgba(255,225,230,.22)'; g.lineWidth = 5; g.translate(-3, -3); g.stroke(); g.translate(3, 3); }
  // lateral (Sylvian) fissure
  g.strokeStyle = 'rgba(60,20,36,.9)'; g.lineWidth = 10; g.beginPath(); g.moveTo(-190, 118); g.bezierCurveTo(-90, 70, 30, 60, 150, 6); g.stroke();
  // central sulcus
  g.lineWidth = 9; g.beginPath(); g.moveTo(...CS[0]); g.quadraticCurveTo(...CS[1], ...CS[2]); g.stroke();
  // touch strip (post-central gyrus)
  zoneU.forEach(([n, u0, u1], i) => { const on = clamp(lit[n] || 0), col = n === 'HAND' ? CY : n === 'FACE' || n === 'LIPS' ? AMB : '#9fe0c8';
    const vis = clamp(reveal * 9 - i); if (vis <= 0) return; g.beginPath(); for (let k = 0; k <= 10; k++) { const p = stripPt(lerp(u0 + 0.004, u1 - 0.004, k / 10)); k ? g.lineTo(...p) : g.moveTo(...p); }
    g.lineWidth = 72; g.lineCap = 'butt'; g.strokeStyle = alpha(mix('#3f7a8a', col, 0.3 + on * 0.7), (0.85 + on * 0.15) * vis); g.stroke();
    if (on > 0.02) { const [x, y] = stripPt((u0 + u1) / 2); glow(g, x, y, 110, col, 0.32 * on); for (let q = 0; q < 6; q++) { const ph = (t * 1.6 + q / 6) % 1, p = stripPt(lerp(u0, u1, (q * 0.37 + t * 0.6) % 1)); g.fillStyle = alpha('#ffffff', 0.8 * on * Math.sin(ph * Math.PI)); g.beginPath(); g.arc(p[0] + Math.sin(q * 3 + t * 4) * 14, p[1], 5, 0, 7); g.fill(); } } });
  // strip borders
  g.lineCap = 'round'; g.strokeStyle = 'rgba(10,20,26,.8)'; g.lineWidth = 4; zoneU.forEach(([, u0], i) => { if (!i || clamp(reveal * 9 - i) <= 0) return; const p = stripPt(u0), q = qb(u0, CS); const dx = p[0] - q[0], dy = p[1] - q[1]; g.beginPath(); g.moveTo(p[0] - dx * 0.7, p[1] - dy * 0.7); g.lineTo(p[0] + dx * 0.7, p[1] + dy * 0.7); g.stroke(); });
  g.restore();
  // rim light on the brain
  outline(g); g.strokeStyle = alpha(CY, 0.55); g.lineWidth = 5; g.shadowColor = CY; g.shadowBlur = 24; g.stroke(); g.shadowBlur = 0;
  // labels: a clean column inside the parietal lobe with leader lines to each zone
  zoneU.forEach(([n, u0, u1], i) => { const k = ease.out(prog(labels * 9, i * 0.6, i * 0.6 + 1)); if (k <= 0) return; const on = clamp(lit[n] || 0); const [px, py] = stripPt((u0 + u1) / 2);
    const lx = 150, ly = -238 + i * 50; g.globalAlpha = k; g.strokeStyle = alpha('#ffffff', 0.55); g.lineWidth = 2.5; g.beginPath(); g.moveTo(px + 30, py); g.lineTo(lx - 12, ly); g.stroke();
    const col = on > 0.3 ? (n === 'HAND' ? CY : AMB) : '#e8f2f6'; g.font = '900 34px "Nunito"'; const w = g.measureText(n).width + 24; rr(g, lx - 12, ly - 22, w, 44, 22); g.fillStyle = on > 0.3 ? 'rgba(4,14,20,.92)' : 'rgba(4,10,16,.72)'; g.fill(); if (on > 0.3) { g.strokeStyle = col; g.lineWidth = 2.5; g.stroke(); }
    text(g, n, lx, ly + 1, { size: 34, font: 'Nunito', weight: 900, color: col, align: 'left', base: 'middle' }); g.globalAlpha = 1; });
  g.restore();
}
