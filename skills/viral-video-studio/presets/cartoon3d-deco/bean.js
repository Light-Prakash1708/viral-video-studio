// sets/bean.js: bean-head cartoon cast (Cartoon-3D route): natural skin, bean heads, plum variable-width ink (thicker on the
// shadow side), stick limbs, adults ~3.5 heads tall, no blush. Same pose API as flat.js drawChar so cards can swap renderers.
//   drawBean(g, x, feetY, s, cast, {expr, armL:[a1,a2], armR, legs:'stand'|'walk'|'none', step, tilt, lean, look, lookY, blink, t})
import { clamp, lerp, rng } from '/engine/core.js';
export const PLUM = '#241726';
const TAU = Math.PI * 2;
const ell = (g, x, y, rx, ry, r = 0) => { g.beginPath(); g.ellipse(x, y, Math.abs(rx), Math.abs(ry), r, 0, TAU); };
const inked = (g, fill, w) => { g.fillStyle = fill; g.fill(); g.save(); g.translate(w * 0.35, w * 0.45); g.lineWidth = w * 1.25; g.strokeStyle = PLUM; g.stroke(); g.restore(); g.lineWidth = w; g.strokeStyle = PLUM; g.stroke(); };
const line = (g, w, c = PLUM) => { g.lineWidth = w; g.strokeStyle = c; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(); };
function shade(hex, k) { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(clamp(k < 0 ? v * (1 + k) : v + (255 - v) * k, 0, 255)); return '#' + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1); }
const limb = (g, pts, w, col, ink) => { g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = PLUM; g.lineWidth = w + ink * 2.2; g.stroke(); g.strokeStyle = col; g.lineWidth = w; g.stroke(); };
const arm2 = (sx, sy, side, a1, a2, L1, L2) => { const ex = sx + Math.sin(a1) * L1 * side, ey = sy + Math.cos(a1) * L1, b = a1 + a2; return [[sx, sy], [ex, ey], [ex + Math.sin(b) * L2 * side, ey + Math.cos(b) * L2]]; };

// 16 expressions (eyes: dot | wide | half | arc | sad | angry | x) (mouth: line smile grin open o frown teeth smirk wavy)
const EX = { neutral: ['dot', 0, 'line'], smug: ['half', 0.15, 'smirk'], charming: ['arc', -0.05, 'grin'], talk: ['dot', 0, 'talk'], excited: ['wide', -0.25, 'open'],
  greedy: ['dollar', 0.1, 'grin'], surprised: ['wide', -0.35, 'o'], shocked: ['wide', -0.4, 'scream'], worried: ['sad', -0.4, 'wavy'], scared: ['wide', -0.45, 'teeth'],
  angry: ['angry', 0.45, 'frown-open'], sad: ['sad', -0.4, 'frown'], defeated: ['half', -0.3, 'frown'], laughing: ['arc', -0.2, 'laugh'], suspicious: ['half', 0.3, 'flat'], determined: ['angry', 0.3, 'flat'], happy: ['dot', -0.1, 'smile'], tired: ['half', -0.2, 'line'], crying: ['arc', -0.5, 'cry'], proud: ['arc', 0.1, 'smile'] };

function head(g, R, o, p) {
  const e = EX[p.expr || 'neutral'] || EX.neutral, ink = R * 0.07, skin = o.skin || '#f0c8a0', hc = o.hairCol || '#2a1a14', t = p.t || 0, lx = (p.look || 0) * R * 0.1, ly = (p.lookY || 0) * R * 0.08;
  const HW = R * 0.92, HH = R * 1.06; // bean: taller than wide, fuller jaw
  const bean = () => { g.beginPath(); g.moveTo(0, -HH); g.bezierCurveTo(HW * 0.85, -HH, HW * 1.02, -HH * 0.35, HW, HH * 0.15); g.bezierCurveTo(HW * 0.98, HH * 0.75, HW * 0.55, HH, 0, HH); g.bezierCurveTo(-HW * 0.55, HH, -HW * 0.98, HH * 0.75, -HW, HH * 0.15); g.bezierCurveTo(-HW * 1.02, -HH * 0.35, -HW * 0.85, -HH, 0, -HH); g.closePath(); };
  if (o.hair === 'bun') { ell(g, R * 0.1, -HH * 0.95, R * 0.34, R * 0.3); inked(g, hc, ink); }
  for (const d of [-1, 1]) { ell(g, d * HW * 0.98, R * 0.1, R * 0.14, R * 0.2); inked(g, skin, ink * 0.8); }
  bean(); inked(g, skin, ink); g.save(); bean(); g.clip(); g.fillStyle = shade(skin, -0.14); g.beginPath(); g.ellipse(HW * 0.6, HH * 0.4, HW * 0.75, HH * 0.9, -0.3, 0, TAU); g.fill(); g.restore();
  if (o.stubble) { g.save(); bean(); g.clip(); g.globalAlpha = 0.18; ell(g, 0, HH * 0.62, HW * 0.8, HH * 0.4); g.fillStyle = '#3a3040'; g.fill(); g.restore(); }
  // hair
  if (o.hair === 'slick') { g.beginPath(); g.moveTo(-HW * 1.0, -HH * 0.05); g.bezierCurveTo(-HW * 1.1, -HH * 1.15, HW * 1.15, -HH * 1.2, HW * 1.0, -HH * 0.15); g.quadraticCurveTo(HW * 0.55, -HH * 0.62, -HW * 0.1, -HH * 0.58); g.quadraticCurveTo(-HW * 0.7, -HH * 0.5, -HW * 1.0, -HH * 0.05); inked(g, hc, ink); g.beginPath(); g.moveTo(-HW * 0.1, -HH * 0.95); g.quadraticCurveTo(HW * 0.4, -HH * 0.9, HW * 0.7, -HH * 0.55); line(g, ink * 0.6, shade(hc, 0.3)); }
  if (o.hair === 'messy') { g.beginPath(); const N = 11; for (let i = 0; i <= N; i++) { const a = Math.PI * (1.05 + 0.9 * i / N), r = (i % 2 ? 1.0 : 1.18) * HH; g.lineTo(Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95 - R * 0.05); } g.lineTo(HW * 0.8, -HH * 0.45); g.lineTo(HW * 0.3, -HH * 0.62); g.lineTo(-HW * 0.2, -HH * 0.5); g.lineTo(-HW * 0.7, -HH * 0.6); g.closePath(); inked(g, hc, ink); }
  if (o.hair === 'bun') { g.beginPath(); g.moveTo(-HW * 1.02, HH * 0.1); g.bezierCurveTo(-HW * 1.12, -HH * 1.15, HW * 1.12, -HH * 1.15, HW * 1.02, HH * 0.1); g.quadraticCurveTo(HW * 0.8, -HH * 0.5, 0, -HH * 0.55); g.quadraticCurveTo(-HW * 0.8, -HH * 0.5, -HW * 1.02, HH * 0.1); inked(g, hc, ink); }
  if (o.hair === 'bald') { for (const d of [-1, 1]) { g.beginPath(); g.moveTo(d * HW * 0.98, HH * 0.15); g.quadraticCurveTo(d * HW * 1.1, -HH * 0.4, d * HW * 0.8, -HH * 0.55); g.quadraticCurveTo(d * HW * 0.82, -HH * 0.15, d * HW * 0.78, HH * 0.15); g.closePath(); inked(g, hc, ink * 0.8); } }
  // eyes .26 W apart from centre each side
  const EY = -HH * 0.05, GX = HW * 0.38, blink = p.blink && !['arc'].includes(e[0]);
  for (const d of [-1, 1]) { const x = d * GX; g.save();
    if (blink) { g.beginPath(); g.moveTo(x - R * 0.14, EY); g.lineTo(x + R * 0.14, EY); line(g, ink * 1.1); g.restore(); continue; }
    switch (e[0]) {
      case 'wide': ell(g, x, EY, R * 0.2, R * 0.24); g.fillStyle = '#fff'; g.fill(); line(g, ink); ell(g, x + lx, EY + ly, R * 0.06, R * 0.07); g.fillStyle = PLUM; g.fill(); break;
      case 'half': ell(g, x + lx * 0.6, EY + R * 0.02, R * 0.09, R * 0.1); g.fillStyle = PLUM; g.fill(); g.beginPath(); g.moveTo(x - R * 0.18, EY - R * 0.03); g.lineTo(x + R * 0.18, EY - R * 0.05); line(g, ink * 1.3); break;
      case 'arc': g.beginPath(); g.arc(x, EY + R * 0.06, R * 0.13, Math.PI * 1.15, Math.PI * 1.85); line(g, ink * 1.2); break;
      case 'sad': ell(g, x + lx * 0.6, EY + R * 0.03, R * 0.08, R * 0.1); g.fillStyle = PLUM; g.fill(); break;
      case 'angry': ell(g, x + lx * 0.6, EY + R * 0.04, R * 0.08, R * 0.09); g.fillStyle = PLUM; g.fill(); break;
      case 'dollar': g.font = `900 ${R * 0.42}px Nunito`; g.fillStyle = '#2a8a3a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', x, EY + R * 0.02); break;
      default: ell(g, x + lx, EY + ly, R * 0.08, R * 0.11); g.fillStyle = PLUM; g.fill(); ell(g, x + lx - R * 0.025, EY + ly - R * 0.035, R * 0.025, R * 0.025); g.fillStyle = '#fff'; g.fill(); }
    g.restore(); }
  // brows
  for (const d of [-1, 1]) { g.save(); g.translate(d * GX, -HH * 0.4 + (e[1] < -0.3 ? -R * 0.06 : 0)); g.rotate(e[1] * d); g.beginPath(); g.moveTo(-R * 0.15, 0); g.quadraticCurveTo(0, -R * 0.05, R * 0.15, 0); line(g, ink * 1.5); g.restore(); }
  // nose: a one-stroke hook
  g.beginPath(); g.moveTo(R * 0.02, HH * 0.02); g.quadraticCurveTo(R * 0.14, HH * 0.22, R * 0.0, HH * 0.26); line(g, ink * 0.8);
  if (o.glasses) { for (const d of [-1, 1]) { ell(g, d * GX, EY, R * 0.24, R * 0.22); line(g, ink); } g.beginPath(); g.moveTo(-GX + R * 0.24, EY); g.lineTo(GX - R * 0.24, EY); line(g, ink * 0.8); }
  // mouth
  const MY = HH * 0.5, red = '#6a1a24', open = (w, h, teeth) => { ell(g, 0, MY, w, h); g.fillStyle = red; g.fill(); if (teeth) { g.save(); ell(g, 0, MY, w, h); g.clip(); g.fillStyle = '#fff'; g.fillRect(-w, MY - h, w * 2, h * 0.45); g.restore(); } ell(g, 0, MY, w, h); line(g, ink); };
  switch (e[2]) {
    case 'line': g.beginPath(); g.moveTo(-R * 0.14, MY); g.lineTo(R * 0.14, MY); line(g, ink); break;
    case 'flat': g.beginPath(); g.moveTo(-R * 0.1, MY + R * 0.01); g.lineTo(R * 0.16, MY - R * 0.01); line(g, ink); break;
    case 'smile': g.beginPath(); g.arc(0, MY - R * 0.12, R * 0.2, 0.45, Math.PI - 0.45); line(g, ink); break;
    case 'smirk': g.beginPath(); g.moveTo(-R * 0.16, MY + R * 0.02); g.quadraticCurveTo(R * 0.06, MY + R * 0.06, R * 0.22, MY - R * 0.1); line(g, ink); break;
    case 'grin': g.beginPath(); g.moveTo(-R * 0.28, MY - R * 0.06); g.quadraticCurveTo(0, MY + R * 0.3, R * 0.28, MY - R * 0.06); g.closePath(); g.fillStyle = '#fff'; g.fill(); line(g, ink); g.beginPath(); g.moveTo(-R * 0.24, MY + R * 0.02); g.quadraticCurveTo(0, MY + R * 0.1, R * 0.24, MY + R * 0.02); line(g, ink * 0.5); break;
    case 'laugh': g.beginPath(); g.moveTo(-R * 0.3, MY - R * 0.1); g.quadraticCurveTo(0, MY + R * 0.42, R * 0.3, MY - R * 0.1); g.closePath(); g.fillStyle = red; g.fill(); line(g, ink); break;
    case 'open': open(R * 0.16, R * 0.14, true); break;
    case 'o': open(R * 0.09, R * 0.11, false); break;
    case 'scream': open(R * 0.2, R * 0.22, true); break;
    case 'talk': open(R * 0.13, R * 0.03 + R * 0.1 * Math.abs(Math.sin(t * 13) * Math.sin(t * 7.3 + 1)), false); break;
    case 'frown': g.beginPath(); g.arc(0, MY + R * 0.15, R * 0.16, Math.PI + 0.5, -0.5); line(g, ink); break;
    case 'frown-open': g.beginPath(); g.moveTo(-R * 0.2, MY + R * 0.08); g.quadraticCurveTo(0, MY - R * 0.18, R * 0.2, MY + R * 0.08); g.closePath(); g.fillStyle = red; g.fill(); line(g, ink); break;
    case 'teeth': g.beginPath(); g.roundRect(-R * 0.2, MY - R * 0.07, R * 0.4, R * 0.14, R * 0.05); g.fillStyle = '#fff'; g.fill(); line(g, ink); g.beginPath(); g.moveTo(-R * 0.2, MY); g.lineTo(R * 0.2, MY); line(g, ink * 0.5); break;
    case 'wavy': g.beginPath(); g.moveTo(-R * 0.16, MY); for (let i = 1; i <= 6; i++) g.lineTo(-R * 0.16 + i * R * 0.055, MY + (i % 2 ? -1 : 1) * R * 0.03); line(g, ink); break;
    case 'cry': open(R * 0.18, R * 0.15, false); break;
  }
  if (o.mustache) { g.beginPath(); g.moveTo(-R * 0.26, MY - R * 0.08); g.quadraticCurveTo(-R * 0.12, MY - R * 0.22, 0, MY - R * 0.13); g.quadraticCurveTo(R * 0.12, MY - R * 0.22, R * 0.26, MY - R * 0.08); g.quadraticCurveTo(0, MY - R * 0.1, -R * 0.26, MY - R * 0.08); inked(g, o.mustacheCol || hc, ink * 0.6); }
  if (e[2] === 'cry' || p.tear) { g.fillStyle = '#7ac8ff'; ell(g, -GX, EY + R * 0.2 + ((t * 0.8) % 1) * R * 0.4, R * 0.05, R * 0.08); g.fill(); }
  if (p.sweat || e[0] === 'sad' && e[2] === 'wavy') { g.fillStyle = '#7ac8ff'; ell(g, HW * 0.9, -HH * 0.35 + ((t * 0.5) % 1) * R * 0.2, R * 0.07, R * 0.11); g.fill(); line(g, ink * 0.5); }
  // hats
  const hat = o.hat, c = o.hatCol || '#e8d4a0', band = o.hatBand || '#a8282a';
  if (hat === 'boater') { g.save(); g.rotate(o.hatTilt ?? -0.08); ell(g, 0, -HH * 0.74, HW * 1.5, R * 0.22); inked(g, shade(c, -0.08), ink); g.beginPath(); g.moveTo(-HW * 0.86, -HH * 0.78); g.lineTo(-HW * 0.82, -HH * 1.32); g.quadraticCurveTo(0, -HH * 1.44, HW * 0.82, -HH * 1.32); g.lineTo(HW * 0.86, -HH * 0.78); g.quadraticCurveTo(0, -HH * 0.68, -HW * 0.86, -HH * 0.78); g.closePath(); inked(g, c, ink); g.save(); g.clip(); g.fillStyle = band; g.fillRect(-R * 1.2, -HH * 1.0, R * 2.4, HH * 0.17); g.fillStyle = '#1e2a54'; g.fillRect(-R * 1.2, -HH * 0.96, R * 2.4, HH * 0.05); g.restore(); g.restore(); }
  if (hat === 'newsboy') { g.beginPath(); g.moveTo(-HW * 1.04, -HH * 0.32); g.bezierCurveTo(-HW * 1.3, -HH * 1.35, HW * 1.35, -HH * 1.4, HW * 1.1, -HH * 0.38); g.closePath(); inked(g, c, ink); g.beginPath(); g.moveTo(-HW * 0.9, -HH * 0.34); g.quadraticCurveTo(0, -HH * 0.58, HW * 1.05, -HH * 0.38); g.lineTo(HW * 1.15, -HH * 0.2); g.quadraticCurveTo(0, -HH * 0.4, -HW * 0.95, -HH * 0.18); g.closePath(); inked(g, shade(c, -0.25), ink); }
  if (hat === 'fedora') { ell(g, 0, -HH * 0.68, HW * 1.42, R * 0.24); inked(g, shade(c, -0.15), ink); g.beginPath(); g.moveTo(-HW * 0.84, -HH * 0.74); g.lineTo(-HW * 0.76, -HH * 1.28); g.quadraticCurveTo(-HW * 0.2, -HH * 1.18, 0, -HH * 1.34); g.quadraticCurveTo(HW * 0.2, -HH * 1.18, HW * 0.76, -HH * 1.28); g.lineTo(HW * 0.84, -HH * 0.74); g.closePath(); inked(g, c, ink); g.save(); g.clip(); g.fillStyle = band; g.fillRect(-R * 1.2, -HH * 0.95, R * 2.4, HH * 0.14); g.restore(); }
  if (hat === 'police') { g.beginPath(); g.moveTo(-HW, -HH * 0.52); g.lineTo(-HW * 1.12, -HH * 1.18); g.quadraticCurveTo(0, -HH * 1.4, HW * 1.12, -HH * 1.18); g.lineTo(HW, -HH * 0.52); g.closePath(); inked(g, c, ink); g.beginPath(); g.moveTo(-HW * 1.02, -HH * 0.52); g.quadraticCurveTo(0, -HH * 0.3, HW * 1.02, -HH * 0.52); g.lineTo(HW * 0.92, -HH * 0.38); g.quadraticCurveTo(0, -HH * 0.12, -HW * 0.92, -HH * 0.38); g.closePath(); inked(g, '#151517', ink); ell(g, 0, -HH * 0.9, R * 0.15, R * 0.17); inked(g, '#e8c040', ink * 0.6); }
}

export function drawBean(g, x, y, s, o, p = {}) {
  const R = 100 * s, B = 100 * s, ink = R * 0.065, top = o.top || '#5a4a3a', pants = o.pants || '#2a2a34', skin = o.skin || '#f0c8a0', legs = p.legs || 'stand';
  g.save(); g.translate(x, y + (p.bob || 0) * B); g.rotate(p.lean || 0);
  // adults ~3.5 head heights: head 2.1R tall, torso 1.5B, legs 1.6B
  const hipY = -B * 1.6, shY = -B * 3.05, headY = -B * 3.05 - R * 1.12;
  if (legs !== 'none') { const ph = p.step || 0, sw = legs === 'walk' ? Math.sin(ph) * 0.35 : 0;
    const L = [[-B * 0.18, hipY], [-B * 0.2 + Math.sin(sw) * B * 0.8, -B * 0.8], [-B * 0.22 + Math.sin(sw) * B * 1.5, -B * 0.05]], Rr = [[B * 0.18, hipY], [B * 0.2 - Math.sin(sw) * B * 0.8, -B * 0.8], [B * 0.22 - Math.sin(sw) * B * 1.5, -B * 0.05]];
    for (const P of [L, Rr]) { limb(g, P, B * 0.2, pants, ink); const f = P[2], d = Math.sign(f[0]) || 1; ell(g, f[0] + d * B * 0.1, f[1], B * 0.22, B * 0.1); inked(g, o.shoes || '#2a1e1a', ink); } }
  const aL = p.armL || [0.1, 0.12], aR = p.armR || [0.1, 0.12], AL = arm2(-B * 0.42, shY + B * 0.12, -1, aL[0], aL[1], B * 0.82, B * 0.78), AR = arm2(B * 0.42, shY + B * 0.12, 1, aR[0], aR[1], B * 0.82, B * 0.78);
  const arm = (A) => { limb(g, A, B * 0.16, o.coat || o.longSleeve ? top : skin, ink); if (!o.coat && !o.longSleeve) limb(g, [A[0], [lerp(A[0][0], A[1][0], 0.6), lerp(A[0][1], A[1][1], 0.6)]], B * 0.22, top, ink); ell(g, A[2][0], A[2][1], B * 0.13, B * 0.13); inked(g, o.gloves || skin, ink * 0.8); };
  if (p.armsBehind) { arm(AL); arm(AR); }
  // torso: tapered, coat lapels / vest / tie
  g.beginPath(); g.moveTo(-B * 0.46, shY + B * 0.04); g.quadraticCurveTo(-B * 0.5, shY - B * 0.12, -B * 0.24, shY - B * 0.14); g.lineTo(B * 0.24, shY - B * 0.14); g.quadraticCurveTo(B * 0.5, shY - B * 0.12, B * 0.46, shY + B * 0.04); g.lineTo(B * 0.38, hipY + B * 0.08); g.lineTo(-B * 0.38, hipY + B * 0.08); g.closePath(); inked(g, top, ink);
  if (o.coat) { g.beginPath(); g.moveTo(-B * 0.18, shY - B * 0.14); g.lineTo(0, shY + B * 0.62); g.lineTo(B * 0.18, shY - B * 0.14); g.closePath(); g.fillStyle = o.vest || o.shirt || '#f6f4ee'; g.fill(); if (o.vest) { g.save(); g.clip(); g.fillStyle = o.shirt || '#f6f4ee'; g.beginPath(); g.moveTo(-B * 0.1, shY - B * 0.14); g.lineTo(0, shY + B * 0.18); g.lineTo(B * 0.1, shY - B * 0.14); g.fill(); g.restore(); } line(g, ink * 0.8); for (const d of [-1, 1]) { g.beginPath(); g.moveTo(d * B * 0.2, shY - B * 0.13); g.lineTo(d * B * 0.05, shY + B * 0.6); g.lineTo(d * B * 0.3, shY + B * 0.25); line(g, ink * 0.8); } }
  if (o.tie) { g.beginPath(); g.moveTo(-B * 0.05, shY - B * 0.1); g.lineTo(B * 0.05, shY - B * 0.1); g.lineTo(B * 0.07, shY + B * 0.4); g.lineTo(0, shY + B * 0.5); g.lineTo(-B * 0.07, shY + B * 0.4); g.closePath(); inked(g, o.tie, ink * 0.6); }
  if (o.dress) { g.beginPath(); g.moveTo(-B * 0.38, hipY); g.lineTo(B * 0.38, hipY); g.lineTo(B * 0.55, hipY + B * 0.7); g.lineTo(-B * 0.55, hipY + B * 0.7); g.closePath(); inked(g, top, ink); }
  if (o.pinstripe) { g.save(); g.beginPath(); g.rect(-B * 0.5, shY - B * 0.14, B, hipY - shY + B * 0.2); g.clip(); g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 2 * s; for (let xx = -B * 0.5; xx < B * 0.5; xx += B * 0.08) { g.beginPath(); g.moveTo(xx, shY - B * 0.2); g.lineTo(xx, hipY + B * 0.2); g.stroke(); } g.restore(); }
  g.beginPath(); g.roundRect(-B * 0.09, shY - B * 0.28, B * 0.18, B * 0.2, B * 0.04); inked(g, skin, ink * 0.7);
  if (p.prop === 'notepad') { const hp = AR[2]; g.beginPath(); g.roundRect(hp[0] - B * 0.2, hp[1] - B * 0.3, B * 0.34, B * 0.42, B * 0.03); inked(g, '#f4f0e0', ink * 0.6); }
  if (p.prop === 'cigar') { g.beginPath(); g.moveTo(B * 0.12, headY + R * 0.55); g.lineTo(B * 0.48, headY + R * 0.5); line(g, B * 0.07, '#6a3a1e'); }
  g.save(); g.translate(0, headY); g.rotate(p.tilt || 0); head(g, R, o, p); g.restore();
  if (!p.armsBehind) { arm(AL); arm(AR); }
  g.restore();
}
