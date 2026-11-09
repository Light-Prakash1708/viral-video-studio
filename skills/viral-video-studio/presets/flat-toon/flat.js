// sets/flat.js: flat-vector cartoon kit (our own designs, Toon-style grammar): white round-faced characters with thick ink
// outlines, a 20+ expression library, keyable two-bone arms, poses; a flat 1950s sedan (side + windshield views);
// parallax flat worlds (day road, night road, POV road, city), flat props. All canvas 2D.
import { clamp, lerp, ease, rng } from '/engine/core.js';

export const INK = '#151517';
const TAU = Math.PI * 2;
const st = (g, w, c = INK) => { g.lineWidth = w; g.strokeStyle = c; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); };
const fl = (g, c) => { g.fillStyle = c; g.fill(); };
const fs = (g, c, w) => { fl(g, c); st(g, w); };
export const ell = (g, x, y, rx, ry, r = 0) => { g.beginPath(); g.ellipse(x, y, Math.abs(rx), Math.abs(ry), r, 0, TAU); };
export const rrect = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
export function shade(hex, k) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = (n >> 8) & 255, b = n & 255; const f = (v) => Math.round(clamp(k < 0 ? v * (1 + k) : v + (255 - v) * k, 0, 255)); return '#' + ((1 << 24) + (f(r) << 16) + (f(gg) << 8) + f(b)).toString(16).slice(1); }

// ---------------------------------------------------------------- faces
// expressions: neutral curious happy smug surprised shocked horrified nervous angry frustrated suspicious confused worried
// disappointed relieved laughing crying facepalm(=pose) sleep tired determined proud talk realization sad scream
const EX = {
  neutral: { eye: 'n', brow: [0, 0], mouth: 'line' }, curious: { eye: 'n', brow: [0.15, -0.25], mouth: 'o-small', tilt: 0.08 },
  happy: { eye: 'n', brow: [-0.1, -0.1], mouth: 'smile-open' }, smug: { eye: 'half', brow: [0.15, 0.05], mouth: 'smirk' },
  surprised: { eye: 'wide', brow: [-0.35, -0.35], browY: -0.12, mouth: 'o' }, shocked: { eye: 'wide', brow: [-0.3, -0.3], browY: -0.12, mouth: 'scream-s' },
  horrified: { eye: 'wide', pupil: 0.05, brow: [-0.45, -0.45], browY: -0.1, mouth: 'scream', sweat: 2 }, nervous: { eye: 'wide', brow: [-0.4, -0.4], mouth: 'teeth-wavy', sweat: 1 },
  angry: { eye: 'angry', brow: [0.5, 0.5], mouth: 'frown-open', vein: true }, frustrated: { eye: 'angry', brow: [0.45, 0.45], mouth: 'teeth' },
  suspicious: { eye: 'half', brow: [0.3, -0.2], mouth: 'flat-side' }, confused: { eye: 'n', brow: [-0.3, 0.25], mouth: 'wavy', q: true },
  worried: { eye: 'n', brow: [-0.45, -0.45], mouth: 'frown' }, disappointed: { eye: 'half', brow: [-0.25, -0.25], mouth: 'frown' },
  relieved: { eye: 'closed', brow: [-0.2, -0.2], mouth: 'smile', puff: true }, laughing: { eye: 'laugh', brow: [-0.2, -0.2], mouth: 'laugh' },
  crying: { eye: 'closed-sad', brow: [-0.5, -0.5], mouth: 'cry', tears: true }, sleep: { eye: 'sleep', brow: [0, 0], mouth: 'smile-s', zzz: true },
  tired: { eye: 'half', brow: [-0.2, -0.2], mouth: 'line', bags: true }, determined: { eye: 'angry', brow: [0.35, 0.35], mouth: 'flat-firm' },
  proud: { eye: 'closed', brow: [0.1, 0.1], mouth: 'grin' }, talk: { eye: 'n', brow: [0, 0], mouth: 'talk' },
  realization: { eye: 'wide', brow: [-0.3, -0.3], browY: -0.1, mouth: 'o', bulb: true }, sad: { eye: 'n', brow: [-0.45, -0.45], mouth: 'frown', tear1: true },
  scared: { eye: 'wide', brow: [-0.45, -0.45], mouth: 'teeth-wavy', sweat: 2 }, scream: { eye: 'wide', pupil: 0.05, brow: [-0.4, -0.4], browY: -0.12, mouth: 'scream', sweat: 2 },
};
export const EXPRESSIONS = Object.keys(EX);

export function drawHead(g, R, o, p) {
  const e = EX[p.expr || 'neutral'] || EX.neutral, lw = R * 0.075, lx = (p.look || 0) * R * 0.09, ly = (p.lookY || 0) * R * 0.08, t = p.t || 0;
  const skin = o.skin || '#ffffff', hc = o.hairCol || '#4a2a18';
  // back hair
  if (o.hair === 'bun') { ell(g, 0, -R * 1.02, R * 0.38, R * 0.32); fs(g, hc, lw); }
  if (o.hair === 'long' || o.hair === 'bob') { g.beginPath(); g.moveTo(-R * 1.08, R * 0.55); g.quadraticCurveTo(-R * 1.25, -R * 1.2, 0, -R * 1.12); g.quadraticCurveTo(R * 1.25, -R * 1.2, R * 1.08, R * 0.55); g.closePath(); fs(g, hc, lw); }
  if (o.hair === 'pigtails') for (const d of [-1, 1]) { ell(g, d * R * 1.08, R * 0.05, R * 0.24, R * 0.42, d * 0.5); fs(g, hc, lw); ell(g, d * R * 0.92, -R * 0.32, R * 0.1, R * 0.1); fs(g, '#e8405a', lw * 0.7); }
  // ears + head
  for (const d of [-1, 1]) { ell(g, d * R * 0.98, R * 0.08, R * 0.15, R * 0.2); fs(g, skin, lw); }
  g.beginPath(); g.moveTo(0, -R); g.bezierCurveTo(R * 0.62, -R, R * 1.0, -R * 0.62, R * 1.0, -R * 0.02); g.bezierCurveTo(R * 1.0, R * 0.62, R * 0.6, R * 0.95, 0, R * 0.95); g.bezierCurveTo(-R * 0.6, R * 0.95, -R * 1.0, R * 0.62, -R * 1.0, -R * 0.02); g.bezierCurveTo(-R * 1.0, -R * 0.62, -R * 0.62, -R, 0, -R); g.closePath(); fs(g, skin, lw);
  // soft cel shade (one flat plane, lower right)
  g.save(); g.clip(); g.beginPath(); g.ellipse(R * 0.55, R * 0.55, R * 0.9, R * 0.75, -0.5, 0, TAU); g.fillStyle = 'rgba(160,170,200,.16)'; g.fill(); g.restore();
  if (o.stubble) { g.save(); g.globalAlpha = 0.25; ell(g, 0, R * 0.55, R * 0.62, R * 0.35); fl(g, '#6a6a7a'); g.restore(); }
  // eyes
  const EY = -R * 0.05, GX = R * 0.37, blink = p.blink && !['laugh', 'closed', 'sleep', 'closed-sad'].includes(e.eye);
  for (const d of [-1, 1]) {
    const x = d * GX; g.save();
    if (blink) { g.beginPath(); g.moveTo(x - R * 0.17, EY); g.quadraticCurveTo(x, EY + R * 0.08, x + R * 0.17, EY); st(g, lw); g.restore(); continue; }
    switch (e.eye) {
      case 'wide': { ell(g, x, EY, R * 0.24, R * 0.28); fs(g, '#fff', lw); ell(g, x + lx * 0.8, EY + ly, R * (e.pupil || 0.075), R * (e.pupil || 0.075) * 1.1); fl(g, INK); break; }
      case 'half': { ell(g, x, EY, R * 0.2, R * 0.22); fs(g, '#fff', lw); g.save(); ell(g, x, EY, R * 0.2, R * 0.22); g.clip(); ell(g, x + lx, EY + R * 0.06 + ly, R * 0.1, R * 0.11); fl(g, INK); g.fillStyle = skin; g.fillRect(x - R * 0.25, EY - R * 0.3, R * 0.5, R * 0.3); g.restore(); g.beginPath(); g.moveTo(x - R * 0.22, EY); g.lineTo(x + R * 0.22, EY); st(g, lw * 1.2); if (e.bags) { g.beginPath(); g.arc(x, EY + R * 0.2, R * 0.16, 0.3, Math.PI - 0.3); st(g, lw * 0.6, '#8a8aa0'); } break; }
      case 'angry': { ell(g, x, EY + R * 0.02, R * 0.2, R * 0.2); fs(g, '#fff', lw); g.save(); ell(g, x, EY + R * 0.02, R * 0.2, R * 0.2); g.clip(); ell(g, x + lx, EY + R * 0.06 + ly, R * 0.09, R * 0.1); fl(g, INK); g.beginPath(); g.moveTo(x - R * 0.3, EY - R * 0.3 + (d < 0 ? 0 : R * 0.18)); g.lineTo(x + R * 0.3, EY - R * 0.3 + (d < 0 ? R * 0.18 : 0)); g.lineTo(x + R * 0.3, EY - R * 0.4); g.lineTo(x - R * 0.3, EY - R * 0.4); g.closePath(); fl(g, skin); g.restore(); break; }
      case 'closed': { g.beginPath(); g.arc(x, EY + R * 0.06, R * 0.16, Math.PI * 1.15, Math.PI * 1.85); st(g, lw * 1.1); break; }
      case 'laugh': { g.beginPath(); g.moveTo(x - R * 0.17, EY + R * 0.06); g.lineTo(x, EY - R * 0.08); g.lineTo(x + R * 0.17, EY + R * 0.06); st(g, lw * 1.1); break; }
      case 'sleep': { g.beginPath(); g.arc(x, EY, R * 0.15, Math.PI * 0.15, Math.PI * 0.85); st(g, lw * 1.1); break; }
      case 'closed-sad': { g.beginPath(); g.arc(x, EY + R * 0.1, R * 0.16, Math.PI * 1.2, Math.PI * 1.8); st(g, lw * 1.1); break; }
      default: { ell(g, x, EY, R * 0.19, R * 0.23); fs(g, '#fff', lw); ell(g, x + lx, EY + R * 0.02 + ly, R * 0.1, R * 0.12); fl(g, INK); ell(g, x + lx - R * 0.03, EY - R * 0.03 + ly, R * 0.03, R * 0.03); fl(g, '#fff'); }
    }
    g.restore();
  }
  // brows
  const by = -R * 0.42 + (e.browY || 0) * R; for (const d of [-1, 1]) { const a = (d < 0 ? e.brow[0] : e.brow[1]) * d, x = d * GX; g.save(); g.translate(x, by); g.rotate(a); g.beginPath(); g.moveTo(-R * 0.17, 0); g.quadraticCurveTo(0, -R * 0.05, R * 0.17, 0); st(g, lw * 1.6); g.restore(); }
  if (o.glasses) { for (const d of [-1, 1]) { ell(g, d * GX, EY, R * 0.3, R * 0.27); st(g, lw * 1.25); } g.beginPath(); g.moveTo(-GX + R * 0.3, EY - R * 0.04); g.lineTo(GX - R * 0.3, EY - R * 0.04); st(g, lw); }
  // mouth
  const MY = R * 0.45, red = '#7a1a22', tongue = '#e8606a';
  const open = (w, h, teeth = false, tng = true) => { g.save(); ell(g, 0, MY, w, h); fs(g, red, lw); g.clip(); if (tng) { ell(g, 0, MY + h * 0.75, w * 0.7, h * 0.55); fl(g, tongue); } if (teeth) { g.fillStyle = '#fff'; g.fillRect(-w, MY - h, w * 2, h * 0.38); } g.restore(); ell(g, 0, MY, w, h); st(g, lw); };
  switch (e.mouth) {
    case 'line': g.beginPath(); g.moveTo(-R * 0.16, MY); g.quadraticCurveTo(0, MY + R * 0.03, R * 0.16, MY); st(g, lw); break;
    case 'smile': g.beginPath(); g.arc(0, MY - R * 0.12, R * 0.22, 0.4, Math.PI - 0.4); st(g, lw); break;
    case 'smile-s': g.beginPath(); g.arc(0, MY - R * 0.08, R * 0.12, 0.5, Math.PI - 0.5); st(g, lw); break;
    case 'smile-open': g.save(); g.beginPath(); g.moveTo(-R * 0.26, MY - R * 0.06); g.quadraticCurveTo(0, MY + R * 0.34, R * 0.26, MY - R * 0.06); g.closePath(); fs(g, red, lw); g.clip(); ell(g, 0, MY + R * 0.2, R * 0.16, R * 0.1); fl(g, tongue); g.restore(); break;
    case 'grin': g.save(); g.beginPath(); g.moveTo(-R * 0.32, MY - R * 0.1); g.quadraticCurveTo(0, MY + R * 0.36, R * 0.32, MY - R * 0.1); g.closePath(); fs(g, '#fff', lw); g.restore(); g.beginPath(); g.moveTo(-R * 0.28, MY + R * 0.02); g.quadraticCurveTo(0, MY + R * 0.12, R * 0.28, MY + R * 0.02); st(g, lw * 0.6); break;
    case 'laugh': g.save(); g.beginPath(); g.moveTo(-R * 0.34, MY - R * 0.12); g.quadraticCurveTo(0, MY + R * 0.5, R * 0.34, MY - R * 0.12); g.closePath(); fs(g, red, lw); g.clip(); ell(g, 0, MY + R * 0.3, R * 0.2, R * 0.14); fl(g, tongue); g.fillStyle = '#fff'; g.fillRect(-R * 0.4, MY - R * 0.14, R * 0.8, R * 0.08); g.restore(); break;
    case 'smirk': g.beginPath(); g.moveTo(-R * 0.18, MY + R * 0.04); g.quadraticCurveTo(R * 0.06, MY + R * 0.06, R * 0.22, MY - R * 0.08); st(g, lw); break;
    case 'o': open(R * 0.11, R * 0.14, false, false); break;
    case 'o-small': ell(g, R * 0.04, MY, R * 0.06, R * 0.07); fs(g, red, lw * 0.8); break;
    case 'scream-s': open(R * 0.16, R * 0.18); break;
    case 'scream': open(R * 0.24, R * 0.26, true); break;
    case 'talk': { const k = 0.35 + 0.65 * Math.abs(Math.sin(t * 13) * Math.sin(t * 7.3 + 1)); open(R * 0.15, R * 0.04 + R * 0.12 * k); break; }
    case 'frown': g.beginPath(); g.arc(0, MY + R * 0.16, R * 0.18, Math.PI + 0.55, -0.55); st(g, lw); break;
    case 'frown-open': g.save(); g.beginPath(); g.moveTo(-R * 0.22, MY + R * 0.1); g.quadraticCurveTo(0, MY - R * 0.2, R * 0.22, MY + R * 0.1); g.closePath(); fs(g, red, lw); g.restore(); break;
    case 'teeth': rrect(g, -R * 0.22, MY - R * 0.08, R * 0.44, R * 0.16, R * 0.06); fs(g, '#fff', lw); g.beginPath(); g.moveTo(-R * 0.22, MY); g.lineTo(R * 0.22, MY); for (let i = -2; i <= 2; i++) { g.moveTo(i * R * 0.08, MY - R * 0.08); g.lineTo(i * R * 0.08, MY + R * 0.08); } st(g, lw * 0.5); break;
    case 'teeth-wavy': rrect(g, -R * 0.24, MY - R * 0.08, R * 0.48, R * 0.16, R * 0.07); fs(g, '#fff', lw); g.beginPath(); g.moveTo(-R * 0.22, MY); for (let i = 0; i <= 8; i++) g.lineTo(-R * 0.22 + i * R * 0.055, MY + (i % 2 ? -1 : 1) * R * 0.035); st(g, lw * 0.6); break;
    case 'wavy': g.beginPath(); g.moveTo(-R * 0.18, MY); for (let i = 1; i <= 6; i++) g.lineTo(-R * 0.18 + i * R * 0.06, MY + (i % 2 ? -1 : 1) * R * 0.03); st(g, lw); break;
    case 'flat-side': g.beginPath(); g.moveTo(-R * 0.08, MY + R * 0.02); g.lineTo(R * 0.2, MY - R * 0.01); st(g, lw); break;
    case 'flat-firm': g.beginPath(); g.moveTo(-R * 0.18, MY); g.lineTo(R * 0.18, MY); st(g, lw * 1.2); break;
    case 'cry': open(R * 0.2, R * 0.18); break;
  }
  if (o.mustache) { g.beginPath(); g.moveTo(-R * 0.3, MY - R * 0.1); g.quadraticCurveTo(-R * 0.15, MY - R * 0.26, 0, MY - R * 0.16); g.quadraticCurveTo(R * 0.15, MY - R * 0.26, R * 0.3, MY - R * 0.1); g.quadraticCurveTo(0, MY - R * 0.12, -R * 0.3, MY - R * 0.1); fs(g, o.mustacheCol || hc, lw * 0.7); }
  if (o.blush !== false) { g.save(); g.globalAlpha = 0.35; for (const d of [-1, 1]) { ell(g, d * R * 0.62, R * 0.3, R * 0.14, R * 0.08); fl(g, '#ff8a9a'); } g.restore(); }
  // front hair
  drawHair(g, R, o, lw);
  if (o.cap) { g.beginPath(); g.moveTo(-R * 1.0, -R * 0.3); g.bezierCurveTo(-R * 1.0, -R * 1.3, R * 1.0, -R * 1.3, R * 1.0, -R * 0.3); g.closePath(); fs(g, o.cap, lw); g.beginPath(); g.moveTo(-R * 1.05, -R * 0.32); g.quadraticCurveTo(0, -R * 0.5, R * 1.05, -R * 0.32); g.lineTo(R * 1.1, -R * 0.18); g.quadraticCurveTo(0, -R * 0.36, -R * 1.1, -R * 0.18); g.closePath(); fs(g, shade(o.cap, -0.25), lw); if (o.capBadge) { ell(g, 0, -R * 0.72, R * 0.14, R * 0.12); fs(g, o.capBadge, lw * 0.7); } }
  // extras
  if (e.sweat || p.sweat) { const n = e.sweat || p.sweat; for (let i = 0; i < n; i++) { const yy = -R * 0.55 + i * R * 0.42 + ((t * 0.5 + i * 0.3) % 1) * R * 0.15; g.beginPath(); g.moveTo(R * (0.98 - i * 1.9), yy); g.quadraticCurveTo(R * (1.12 - i * 1.9), yy + R * 0.22, R * (0.98 - i * 1.9), yy + R * 0.26); g.quadraticCurveTo(R * (0.84 - i * 1.9), yy + R * 0.22, R * (0.98 - i * 1.9), yy); fs(g, '#7ad0ff', lw * 0.6); } }
  if (e.tears || p.tears) for (const d of [-1, 1]) { g.save(); g.globalAlpha = 0.9; g.beginPath(); g.moveTo(d * GX - R * 0.08, EY + R * 0.12); g.quadraticCurveTo(d * GX - R * 0.14, EY + R * 0.5, d * GX - R * 0.1, EY + R * 0.75 + Math.sin(t * 8) * R * 0.04); g.lineTo(d * GX + R * 0.06, EY + R * 0.75); g.quadraticCurveTo(d * GX + R * 0.04, EY + R * 0.4, d * GX + R * 0.06, EY + R * 0.12); g.closePath(); fs(g, '#5ab8ff', lw * 0.5); g.restore(); }
  if (e.tear1 || p.tear) { const u = (t * 0.7) % 1; ell(g, -GX - R * 0.05, EY + R * 0.25 + u * R * 0.5, R * 0.06, R * 0.09); fs(g, '#5ab8ff', lw * 0.5); }
  if (e.vein) { g.save(); g.translate(R * 0.75, -R * 0.75); for (let i = 0; i < 4; i++) { g.rotate(Math.PI / 2); g.beginPath(); g.moveTo(R * 0.05, R * 0.05); g.quadraticCurveTo(R * 0.2, R * 0.04, R * 0.2, R * 0.2); st(g, lw * 1.2, '#e82a2a'); } g.restore(); }
  if (e.q) { g.save(); g.font = `900 ${R * 0.7}px Nunito`; g.fillStyle = INK; g.fillText('?', R * 0.9, -R * 0.9); g.restore(); }
  if (e.bulb || p.bulb) { g.save(); g.translate(R * 1.1, -R * 1.05); ell(g, 0, 0, R * 0.2, R * 0.22); fs(g, '#ffe14a', lw * 0.7); g.fillStyle = '#9a9aa8'; g.fillRect(-R * 0.08, R * 0.2, R * 0.16, R * 0.1); g.strokeStyle = '#ffd23a'; g.lineWidth = lw * 0.8; for (let i = 0; i < 5; i++) { const a = -Math.PI * 0.9 + i * Math.PI * 0.2; g.beginPath(); g.moveTo(Math.cos(a) * R * 0.3, Math.sin(a) * R * 0.3); g.lineTo(Math.cos(a) * R * 0.42, Math.sin(a) * R * 0.42); g.stroke(); } g.restore(); }
  if (e.puff) { g.save(); g.globalAlpha = 0.85; for (let i = 0; i < 3; i++) { ell(g, R * (0.55 + i * 0.16), R * (0.62 + i * 0.04), R * (0.09 + i * 0.03), R * (0.08 + i * 0.03)); fs(g, '#fff', lw * 0.5); } g.restore(); }
  if (e.zzz) { g.save(); g.font = `900 ${R * 0.4}px Nunito`; g.fillStyle = '#c8d8ff'; for (let i = 0; i < 3; i++) { const u = (t * 0.5 + i / 3) % 1; g.globalAlpha = Math.sin(u * Math.PI); g.fillText('z', R * (0.9 + u * 0.6), -R * (0.6 + u * 0.9)); } g.restore(); }
}
function drawHair(g, R, o, lw) {
  const hc = o.hairCol || '#4a2a18', hi = shade(hc, 0.25); const h = o.hair || 'spiky';
  if (h === 'spiky') { const R0 = rng(o.seed || 3); g.beginPath(); const N = 14; for (let i = 0; i <= N; i++) { const a = Math.PI * (1.02 + 0.96 * i / N), r = R * (i % 2 ? 1.06 : 1.3 + R0() * 0.12); g.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.98 - R * 0.05); }
    // fringe spikes falling over forehead
    const F = [[0.95, -0.25], [0.7, -0.5], [0.55, -0.22], [0.3, -0.5], [0.12, -0.25], [-0.12, -0.52], [-0.3, -0.28], [-0.5, -0.55], [-0.68, -0.32], [-0.85, -0.5], [-0.98, -0.2]];
    for (const [x, y] of F) g.lineTo(x * R, y * R); g.closePath(); fs(g, hc, lw);
    g.beginPath(); for (const [x0, y0, x1, y1] of [[-0.5, -0.85, -0.25, -0.62], [0.05, -0.92, 0.2, -0.68], [0.45, -0.82, 0.62, -0.6]]) { g.moveTo(x0 * R, y0 * R); g.lineTo(x1 * R, y1 * R); } st(g, lw * 0.8, hi); }
  if (h === 'slick') { g.beginPath(); g.moveTo(-R * 1.02, -R * 0.05); g.bezierCurveTo(-R * 1.1, -R * 1.25, R * 1.1, -R * 1.25, R * 1.02, -R * 0.1); g.quadraticCurveTo(R * 0.7, -R * 0.62, R * 0.1, -R * 0.6); g.quadraticCurveTo(-R * 0.35, -R * 0.72, -R * 0.62, -R * 0.42); g.quadraticCurveTo(-R * 0.9, -R * 0.3, -R * 1.02, -R * 0.05); fs(g, hc, lw); g.beginPath(); g.moveTo(-R * 0.2, -R * 0.98); g.quadraticCurveTo(R * 0.3, -R * 0.92, R * 0.7, -R * 0.62); st(g, lw * 0.7, hi); }
  if (h === 'bun' || h === 'long' || h === 'bob' || h === 'pigtails') { g.beginPath(); g.moveTo(-R * 1.04, R * 0.1); g.bezierCurveTo(-R * 1.15, -R * 1.2, R * 1.15, -R * 1.2, R * 1.04, R * 0.1); g.quadraticCurveTo(R * 0.85, -R * 0.45, R * 0.35, -R * 0.55); g.quadraticCurveTo(R * 0.05, -R * 0.42, -R * 0.15, -R * 0.62); g.quadraticCurveTo(-R * 0.8, -R * 0.5, -R * 1.04, R * 0.1); fs(g, hc, lw); g.beginPath(); g.moveTo(-R * 0.55, -R * 0.88); g.quadraticCurveTo(-R * 0.1, -R * 1.0, R * 0.25, -R * 0.9); st(g, lw * 0.7, hi); }
  if (h === 'bald') { for (const d of [-1, 1]) { g.beginPath(); g.moveTo(d * R * 0.98, R * 0.1); g.quadraticCurveTo(d * R * 1.12, -R * 0.4, d * R * 0.82, -R * 0.62); g.quadraticCurveTo(d * R * 0.86, -R * 0.2, d * R * 0.8, R * 0.1); g.closePath(); fs(g, hc, lw * 0.8); } g.save(); g.globalAlpha = 0.5; ell(g, -R * 0.3, -R * 0.72, R * 0.18, R * 0.08, -0.4); fl(g, '#fff'); g.restore(); }
  if (h === 'curly') { for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + 0.9 * i / 8); ell(g, Math.cos(a) * R * 0.92, Math.sin(a) * R * 0.9 - R * 0.05, R * 0.28, R * 0.26); fs(g, hc, lw); } }
}

// ---------------------------------------------------------------- bodies
// pose: { expr, armL:[a1,a2], armR:[a1,a2] (angles from straight down, + = outward / up), tilt, lean, look, lookY, bob,
//         legs:'stand'|'walk'|'run'|'sit'|'none', step (phase), blink, hold:'wheel' }
const arm2 = (sx, sy, side, a1, a2, L1, L2) => { const ex = sx + Math.sin(a1) * L1 * side, ey = sy + Math.cos(a1) * L1, b = a1 + a2; return [[sx, sy], [ex, ey], [ex + Math.sin(b) * L2 * side, ey + Math.cos(b) * L2]]; };
function limb(g, pts, w, col, lw) { g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = w + lw * 2; g.stroke(); g.strokeStyle = col; g.lineWidth = w; g.stroke(); }
export function drawChar(g, x, y, s, o, p = {}) {
  const R = 100 * s * (o.headScale || 1), B = 100 * s, lw = R * 0.075, t = p.t || 0, top = o.top || '#ffc81a', pants = o.pants || '#1e2a44', skin = o.skin || '#ffffff', legs = p.legs || 'stand';
  g.save(); g.translate(x, y + (p.bob || 0) * B); g.rotate(p.lean || 0);
  const hipY = -B * 1.05, shY = -B * 2.15, neckY = -B * 2.28, headY = -B * 2.28 - R * 0.86;
  // legs
  if (legs !== 'none') {
    const ph = p.step || 0; let L = [[-B * 0.22, hipY], [-B * 0.24, -B * 0.5], [-B * 0.26, -B * 0.06]], Rr = [[B * 0.22, hipY], [B * 0.24, -B * 0.5], [B * 0.26, -B * 0.06]];
    if (legs === 'walk' || legs === 'run') { const amp = legs === 'run' ? 0.7 : 0.35, a = Math.sin(ph) * amp, b = -a; const leg = (sx, a) => { const kx = sx + Math.sin(a) * B * 0.52, ky = hipY + Math.cos(a) * B * 0.52, fa = a - Math.max(0, -a) * 1.4; return [[sx, hipY], [kx, ky], [kx + Math.sin(fa) * B * 0.52, ky + Math.cos(fa) * B * 0.52]]; }; L = leg(-B * 0.15, a); Rr = leg(B * 0.15, b); }
    if (legs === 'sit') { L = [[-B * 0.22, hipY], [-B * 0.3, hipY + B * 0.3], [-B * 0.3, -B * 0.06 + B * 0.1]]; Rr = [[B * 0.22, hipY], [B * 0.3, hipY + B * 0.3], [B * 0.3, -B * 0.06 + B * 0.1]]; }
    for (const P of [L, Rr]) { limb(g, P, B * 0.26, pants, lw); const f = P[2], d = Math.sign(f[0]) || 1; ell(g, f[0] + d * B * 0.08, f[1] + B * 0.02, B * 0.2, B * 0.11); fs(g, o.shoes || '#ffffff', lw); g.beginPath(); g.moveTo(f[0] - B * 0.1 + d * B * 0.08, f[1] + B * 0.06); g.lineTo(f[0] + B * 0.26 * d, f[1] + B * 0.06); st(g, lw * 0.6); }
  }
  // arms behind torso? (only when pose says back) — arms drawn after torso by default
  const aL = p.armL || [0.12, 0.15], aR = p.armR || [0.12, 0.15];
  const AL = arm2(-B * 0.5, shY + B * 0.12, -1, aL[0], aL[1], B * 0.62, B * 0.58), AR = arm2(B * 0.5, shY + B * 0.12, 1, aR[0], aR[1], B * 0.62, B * 0.58);
  const sleeve = o.longSleeve ? top : null;
  const drawArm = (A) => { limb(g, A, B * 0.2, skin, lw); limb(g, [A[0], [lerp(A[0][0], A[1][0], o.longSleeve ? 1 : 0.55), lerp(A[0][1], A[1][1], o.longSleeve ? 1 : 0.55)]], B * 0.26, top, lw); if (sleeve) limb(g, [A[1], [lerp(A[1][0], A[2][0], 0.82), lerp(A[1][1], A[2][1], 0.82)]], B * 0.24, top, lw); ell(g, A[2][0], A[2][1], B * 0.15, B * 0.15); fs(g, skin, lw); };
  if (p.armsBehind) { drawArm(AL); drawArm(AR); }
  // torso
  g.beginPath(); g.moveTo(-B * 0.5, shY + B * 0.05); g.quadraticCurveTo(-B * 0.56, shY - B * 0.08, -B * 0.3, shY - B * 0.1); g.lineTo(B * 0.3, shY - B * 0.1); g.quadraticCurveTo(B * 0.56, shY - B * 0.08, B * 0.5, shY + B * 0.05); g.lineTo(B * 0.44, hipY + B * 0.06); g.lineTo(-B * 0.44, hipY + B * 0.06); g.closePath(); fs(g, top, lw);
  g.save(); g.clip(); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(B * 0.12, shY - B * 0.2, B * 0.5, B * 1.4); g.restore();
  if (o.coat) { g.beginPath(); g.moveTo(-B * 0.2, shY - B * 0.1); g.lineTo(0, shY + B * 0.45); g.lineTo(B * 0.2, shY - B * 0.1); g.closePath(); fs(g, o.shirt || '#f4f4f4', lw * 0.8); for (const d of [-1, 1]) { g.beginPath(); g.moveTo(d * B * 0.22, shY - B * 0.1); g.lineTo(d * B * 0.04, shY + B * 0.5); g.lineTo(d * B * 0.3, shY + B * 0.2); st(g, lw * 0.8); } g.beginPath(); g.moveTo(0, shY + B * 0.5); g.lineTo(0, hipY); st(g, lw * 0.6); }
  if (o.tie) { g.beginPath(); g.moveTo(-B * 0.06, shY - B * 0.06); g.lineTo(B * 0.06, shY - B * 0.06); g.lineTo(B * 0.09, shY + B * 0.4); g.lineTo(0, shY + B * 0.52); g.lineTo(-B * 0.09, shY + B * 0.4); g.closePath(); fs(g, o.tie, lw * 0.7); }
  if (o.labcoat) { g.beginPath(); g.moveTo(-B * 0.5, shY + B * 0.05); g.lineTo(-B * 0.5, hipY + B * 0.35); g.lineTo(-B * 0.08, hipY + B * 0.35); g.lineTo(-B * 0.15, shY - B * 0.08); g.closePath(); fs(g, '#f6f6f2', lw); g.beginPath(); g.moveTo(B * 0.5, shY + B * 0.05); g.lineTo(B * 0.5, hipY + B * 0.35); g.lineTo(B * 0.08, hipY + B * 0.35); g.lineTo(B * 0.15, shY - B * 0.08); g.closePath(); fs(g, '#f6f6f2', lw); }
  if (o.dress) { g.beginPath(); g.moveTo(-B * 0.44, hipY); g.lineTo(B * 0.44, hipY); g.lineTo(B * 0.62, hipY + B * 0.55); g.lineTo(-B * 0.62, hipY + B * 0.55); g.closePath(); fs(g, top, lw); }
  if (!o.coat && !o.labcoat) { g.beginPath(); g.moveTo(-B * 0.18, shY - B * 0.1); g.quadraticCurveTo(0, shY + B * 0.12, B * 0.18, shY - B * 0.1); st(g, lw * 0.7); }
  // neck + head
  rrect(g, -B * 0.1, neckY - B * 0.05, B * 0.2, B * 0.24, B * 0.05); fs(g, skin, lw * 0.8);
  if (!p.armsBehind && p.armsFirst) { drawArm(AL); drawArm(AR); }
  g.save(); g.translate(0, headY); g.rotate(p.tilt || 0); drawHead(g, R, o, p); g.restore();
  if (!p.armsBehind && !p.armsFirst) { drawArm(AL); drawArm(AR); }
  g.restore();
  return { hands: [AL[2], AR[2]].map(([hx, hy]) => [x + hx, y + hy]) };
}
// pose blending with overshoot: keys [[t, pose, dur?]]
const NUMK = ['armL', 'armR', 'tilt', 'lean', 'look', 'lookY', 'bob'];
export function keys(t, K, idle = 1) {
  let cur = { armL: [0.12, 0.15], armR: [0.12, 0.15], tilt: 0, lean: 0, look: 0, lookY: 0, bob: 0, ...K[0][1] };
  for (let i = 1; i < K.length; i++) { const [t0, p, d = 0.3] = K[i]; if (t < t0) break; const k = ease.outBack(clamp((t - t0) / d)), nx = { ...cur, ...p };
    for (const f of NUMK) { const a = cur[f], b = nx[f]; if (Array.isArray(b)) nx[f] = b.map((v, j) => lerp(a ? a[j] : v, v, k)); else if (typeof b === 'number') nx[f] = lerp(a ?? b, b, k); } cur = nx; }
  cur.tilt += Math.sin(t * 1.6 + idle) * 0.03 * idle; cur.bob += Math.sin(t * 2.4 + idle) * 0.012 * idle; cur.t = t; cur.blink = cur.blink ?? (((t + idle * 1.7) % 3.4) < 0.11); return cur;
}
export const ARM = { rest: [[0.12, 0.15], [0.12, 0.15]], wave: [[0.12, 0.15], [2.5, 0.6]], open: [[0.7, -1.3], [0.7, -1.3]], point: [[0.12, 0.15], [1.55, 0.05]],
  chin: [[0.12, 0.15], [-0.3, -2.5]], head: [[2.5, 1.7], [2.5, 1.7]], shock: [[1.2, 0.9], [1.2, 0.9]], belly: [[0.05, -1.6], [0.05, -1.6]], face: [[-0.1, -2.6], [-0.1, -2.6]],
  wheel: [[-0.05, -1.9], [-0.05, -1.9]], cheer: [[2.6, 0.3], [2.6, 0.3]], lap: [[-0.05, -1.2], [-0.05, -1.2]], shrug: [[0.9, -1.9], [0.9, -1.9]], facepalm: [[0.12, 0.15], [-0.2, -2.7]], fist: [[0.12, 0.15], [0.6, -2.4]] };
export const A = (n) => ({ armL: ARM[n][0], armR: ARM[n][1] });

// ---------------------------------------------------------------- flat 1950s sedan, side view. dir +1 faces right. returns window rects for riders
export function carSide(g, x, y, s, o = {}) {
  const c = o.color || '#3aa0d8', dark = shade(c, -0.25), lite = shade(c, 0.3), lw = 5 * s, dir = o.dir || 1, spin = o.spin || 0;
  g.save(); g.translate(x, y); g.scale(dir * s, s); g.rotate((o.tilt || 0) * dir);
  // shadow
  if (o.shadow !== false) { g.save(); g.globalAlpha = 0.28; ell(g, 0, 6, 330, 22); fl(g, '#20263a'); g.restore(); }
  // cabin
  g.beginPath(); g.moveTo(-170, -128); g.quadraticCurveTo(-150, -205, -60, -212); g.lineTo(70, -212); g.quadraticCurveTo(120, -208, 170, -130); g.closePath(); fs(g, o.roof || shade(c, 0.1), lw);
  // windows (front + rear), riders drawn by caller into these
  const win = [[-150, -132, -78, -200, 2, -200, 2, -132], [14, -132, 14, -200, 66, -200, 150, -132]];
  g.save(); for (const w of win) { g.beginPath(); g.moveTo(w[0], w[1]); g.quadraticCurveTo(w[0] + 20, w[3] + 6, w[2], w[3]); g.lineTo(w[4], w[5]); g.lineTo(w[6], w[7]); g.closePath(); fl(g, '#bfe8ff'); } g.restore();
  if (o.riders) { g.save(); g.beginPath(); for (const w of win) { g.moveTo(w[0], w[1]); g.quadraticCurveTo(w[0] + 20, w[3] + 6, w[2], w[3]); g.lineTo(w[4], w[5]); g.lineTo(w[6], w[7]); g.closePath(); } g.clip(); if (dir < 0) { g.scale(-1, 1); } o.riders(g); g.restore(); }
  g.save(); for (const w of win) { g.beginPath(); g.moveTo(w[0], w[1]); g.quadraticCurveTo(w[0] + 20, w[3] + 6, w[2], w[3]); g.lineTo(w[4], w[5]); g.lineTo(w[6], w[7]); g.closePath(); g.fillStyle = 'rgba(190,232,255,.22)'; g.fill(); st(g, lw); g.save(); g.clip(); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 9; g.beginPath(); g.moveTo(w[0] + 30, w[1]); g.lineTo(w[0] + 64, w[3]); g.moveTo(w[0] + 52, w[1]); g.lineTo(w[0] + 74, w[3] + 20); g.stroke(); g.restore(); } g.restore();
  g.beginPath(); g.moveTo(6, -212); g.lineTo(8, -128); st(g, 14 * 1, INK); g.beginPath(); g.moveTo(6, -210); g.lineTo(8, -130); st(g, 8, dark);
  // body
  g.beginPath(); g.moveTo(-300, -40); g.quadraticCurveTo(-312, -98, -270, -118); g.quadraticCurveTo(-200, -134, -160, -132); g.lineTo(170, -132); g.quadraticCurveTo(250, -124, 300, -100); g.quadraticCurveTo(322, -80, 318, -40); g.quadraticCurveTo(318, -12, 296, -10); g.lineTo(-290, -10); g.quadraticCurveTo(-306, -14, -300, -40); g.closePath(); fs(g, c, lw);
  g.save(); g.clip(); g.fillStyle = lite; g.beginPath(); g.moveTo(-290, -112); g.quadraticCurveTo(0, -128, 300, -96); g.lineTo(300, -86); g.quadraticCurveTo(0, -112, -290, -100); g.closePath(); g.fill(); g.fillStyle = dark; g.fillRect(-320, -46, 660, 40); g.restore();
  // chrome spear + door lines + handles
  g.beginPath(); g.moveTo(-250, -70); g.quadraticCurveTo(0, -78, 260, -66); st(g, 7, '#e8eef4'); g.beginPath(); g.moveTo(-250, -70); g.quadraticCurveTo(0, -78, 260, -66); st(g, 2, '#9aa8b8');
  g.beginPath(); g.moveTo(8, -128); g.lineTo(10, -18); g.moveTo(-150, -128); g.quadraticCurveTo(-158, -60, -140, -18); st(g, lw * 0.6, dark); for (const hx of [-120, 38]) { rrect(g, hx, -108, 34, 8, 4); fs(g, '#e8eef4', lw * 0.5); }
  // wheel arches + wheels
  for (const wx of [-190, 200]) { g.beginPath(); g.arc(wx, -10, 66, Math.PI, 0); g.closePath(); fl(g, '#1c1f2a'); wheel(g, wx, -10, 54, spin, lw); g.beginPath(); g.arc(wx, -10, 68, Math.PI * 1.02, -0.02); st(g, lw); }
  // bumpers, lights, grille
  rrect(g, 286, -46, 44, 20, 10); fs(g, '#e8eef4', lw * 0.7); rrect(g, -320, -46, 40, 20, 10); fs(g, '#e8eef4', lw * 0.7);
  ell(g, 304, -92, 14, 18); fs(g, '#fff6a8', lw * 0.7); if (o.lights) { g.save(); g.globalAlpha = 0.25; g.beginPath(); g.moveTo(310, -92); g.lineTo(700, -150); g.lineTo(700, -20); g.closePath(); fl(g, '#fff6c0'); g.restore(); }
  rrect(g, -306, -96, 14, 26, 6); fs(g, '#e8303a', lw * 0.6);
  g.restore();
}
export function wheel(g, x, y, r, spin, lw) { ell(g, x, y, r, r); fs(g, '#23252e', lw); ell(g, x, y, r * 0.62, r * 0.62); fs(g, '#e8eef4', lw * 0.6); ell(g, x, y, r * 0.42, r * 0.42); fl(g, '#c8d0dc'); g.save(); g.translate(x, y); g.rotate(spin); g.fillStyle = '#2a2e3a'; for (let i = 0; i < 5; i++) { g.rotate(TAU / 5); g.beginPath(); g.moveTo(r * 0.12, 0); g.lineTo(r * 0.52, -r * 0.13); g.lineTo(r * 0.52, r * 0.13); g.closePath(); g.fill(); } ell(g, 0, 0, r * 0.12, r * 0.12); fs(g, '#e8eef4', lw * 0.5); g.restore(); }

// windshield view: front of the car filling the frame; riders(g) draws people (in car space); returns nothing.
// cx = centre x, y0 = beltline y, s = scale (1 -> car ~1500 px wide)
export function carFront(g, cx, y0, s, o = {}, riders) {
  const c = o.color || '#3aa0d8', dark = shade(c, -0.28), lite = shade(c, 0.28), lw = 7 * s;
  g.save(); g.translate(cx, y0); g.scale(s, s);
  // interior back (seat) + rear window w/ sky
  rrect(g, -640, -520, 1280, 520, 60); fl(g, o.sky || '#9adcff');
  if (o.behind) { g.save(); rrect(g, -640, -520, 1280, 520, 60); g.clip(); o.behind(g); g.restore(); }
  rrect(g, -600, -260, 1200, 300, 40); fs(g, o.seat || '#c8403a', lw); g.save(); rrect(g, -600, -260, 1200, 300, 40); g.clip(); g.fillStyle = shade(o.seat || '#c8403a', -0.15); for (let i = -5; i <= 5; i++) g.fillRect(i * 110 - 4, -260, 8, 300); g.restore();
  if (riders) riders(g);
  // dashboard + steering wheel
  g.beginPath(); g.moveTo(-760, -10); g.quadraticCurveTo(0, -70, 760, -10); g.lineTo(760, 90); g.lineTo(-760, 90); g.closePath(); fs(g, dark, lw);
  if (o.wheelX != null) { const wx = o.wheelX; g.beginPath(); g.ellipse(wx, -70, 150, 60, 0, 0, TAU); st(g, 26, INK); g.beginPath(); g.ellipse(wx, -70, 150, 60, 0, 0, TAU); st(g, 14, '#f2ece0'); g.beginPath(); g.moveTo(wx - 150, -70); g.lineTo(wx + 150, -70); g.moveTo(wx, -70); g.lineTo(wx, -10); st(g, 10, '#f2ece0'); ell(g, wx, -70, 30, 16); fs(g, '#d8d0c0', lw * 0.6); }
  // windshield glass tint + glare (over riders)
  g.save(); g.beginPath(); g.moveTo(-560, -10); g.lineTo(-480, -500); g.lineTo(480, -500); g.lineTo(560, -10); g.closePath(); g.clip(); g.fillStyle = 'rgba(180,225,255,.12)'; g.fillRect(-700, -600, 1400, 700); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 34; g.beginPath(); g.moveTo(180, -500); g.lineTo(-40, -10); g.stroke(); g.lineWidth = 14; g.beginPath(); g.moveTo(280, -500); g.lineTo(70, -10); g.stroke(); g.restore();
  // frame: pillars + roof
  g.beginPath(); g.moveTo(-760, 0); g.lineTo(-560, -10); g.lineTo(-480, -500); g.lineTo(480, -500); g.lineTo(560, -10); g.lineTo(760, 0); g.lineTo(760, -560); g.lineTo(-760, -560); g.closePath(); g.fillStyle = c; g.fill('evenodd');
  g.beginPath(); g.moveTo(-560, -10); g.lineTo(-480, -500); g.lineTo(480, -500); g.lineTo(560, -10); st(g, lw * 1.4); g.beginPath(); g.moveTo(-760, -500); g.lineTo(760, -500); st(g, lw);
  g.fillStyle = o.roof || shade(c, 0.15); g.fillRect(-760, -620, 1520, 110); g.beginPath(); g.moveTo(-760, -510); g.lineTo(760, -510); st(g, lw);
  // hood
  g.beginPath(); g.moveTo(-760, 0); g.quadraticCurveTo(0, -30, 760, 0); g.lineTo(820, 600); g.lineTo(-820, 600); g.closePath(); fs(g, c, lw);
  g.save(); g.clip(); g.fillStyle = lite; g.beginPath(); g.moveTo(-300, -10); g.quadraticCurveTo(0, -20, 300, -10); g.lineTo(200, 600); g.lineTo(-200, 600); g.closePath(); g.globalAlpha = 0.45; g.fill(); g.globalAlpha = 1; g.strokeStyle = shade(c, -0.15); g.lineWidth = 6; g.beginPath(); g.moveTo(-60, 0); g.lineTo(-90, 600); g.moveTo(60, 0); g.lineTo(90, 600); g.stroke(); g.restore();
  // hood ornament
  g.beginPath(); g.moveTo(0, 40); g.lineTo(-14, 90); g.lineTo(14, 90); g.closePath(); fs(g, '#e8eef4', lw * 0.6);
  g.restore();
}

// ---------------------------------------------------------------- flat worlds
export const SKY_DAY = ['#4ab8f4', '#8ad8ff', '#d4f2ff'];
export function skyGrad(g, W, H, cols, y0 = 0, y1 = H) { const gr = g.createLinearGradient(0, y0, 0, y1); cols.forEach((c, i) => gr.addColorStop(i / (cols.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
export function cloudStrip(g, x, y, w, h, col = 'rgba(255,255,255,.75)') { g.fillStyle = col; rrect(g, x, y, w, h, h / 2); g.fill(); rrect(g, x + w * 0.2, y - h * 0.6, w * 0.45, h, h / 2); g.fill(); }
export function puffCloud(g, x, y, s, col = '#ffffff') { g.fillStyle = col; for (const [dx, dy, r] of [[-60, 10, 42], [-20, -18, 55], [35, -8, 48], [75, 12, 36], [0, 18, 50]]) { ell(g, x + dx * s, y + dy * s, r * s, r * s); g.fill(); } }
export function teardropTree(g, x, y, s, col = '#6a9a2a', seed = 1) {
  const lw = 4 * s, dk = shade(col, -0.2), R0 = rng(seed);
  g.beginPath(); g.moveTo(x, y - 300 * s); g.bezierCurveTo(x + 110 * s, y - 160 * s, x + 95 * s, y - 40 * s, x, y - 40 * s); g.bezierCurveTo(x - 95 * s, y - 40 * s, x - 110 * s, y - 160 * s, x, y - 300 * s); g.fillStyle = col; g.fill();
  g.save(); g.clip(); g.fillStyle = dk; g.fillRect(x, y - 320 * s, 120 * s, 300 * s); g.restore();
  g.strokeStyle = '#6a3a1a'; g.lineCap = 'round'; g.lineWidth = 14 * s; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 250 * s); g.stroke(); g.lineWidth = 6 * s; g.beginPath(); for (let i = 0; i < 4; i++) { const yy = y - (90 + i * 40) * s, d = i % 2 ? 1 : -1; g.moveTo(x, yy); g.lineTo(x + d * (40 - i * 5) * s, yy - 36 * s); } g.stroke();
  g.fillStyle = dk; for (let i = 0; i < 7; i++) { ell(g, x + (R0() - 0.5) * 110 * s, y - (70 + R0() * 190) * s, 9 * s, 16 * s); g.fill(); }
}
export function roundTree(g, x, y, s, col = '#7aaa2a') { g.fillStyle = '#6a3a1a'; g.fillRect(x - 8 * s, y - 120 * s, 16 * s, 120 * s); g.fillStyle = col; for (const [dx, dy, r] of [[0, -170, 70], [-50, -130, 50], [50, -130, 52], [0, -110, 60]]) { ell(g, x + dx * s, y + dy * s, r * s, r * s); g.fill(); } g.fillStyle = shade(col, -0.18); ell(g, x + 30 * s, y - 120 * s, 50 * s, 40 * s); g.fill(); }
export function bush(g, x, y, s, col = '#5a8a1e') { g.fillStyle = col; g.beginPath(); for (const [dx, r] of [[-70, 34], [-30, 48], [20, 56], [70, 40], [105, 28]]) { g.moveTo(x + dx * s + r * s, y); g.arc(x + dx * s, y, r * s, Math.PI, 0); } g.fill(); g.fillStyle = shade(col, 0.15); for (const [dx, r] of [[-30, 20], [20, 26]]) { ell(g, x + dx * s - 8 * s, y - r * s * 1.2, r * s * 0.5, r * s * 0.35); g.fill(); } }
export function townSkyline(g, x0, base, W, s, seed = 4, cols = ['#a8b8c8', '#c8d6e2', '#dfe8f0']) { const R = rng(seed); let x = x0; while (x < x0 + W) { const w = (50 + R() * 90) * s, h = (80 + R() * 220) * s, c = cols[Math.floor(R() * cols.length)]; g.fillStyle = c; g.fillRect(x, base - h, w, h); g.fillStyle = shade(c, 0.35); for (let yy = base - h + 14 * s; yy < base - 20 * s; yy += 26 * s) for (let xx = x + 10 * s; xx < x + w - 14 * s; xx += 22 * s) g.fillRect(xx, yy, 10 * s, 14 * s); if (R() < 0.3) { g.fillStyle = c; g.beginPath(); g.moveTo(x, base - h); g.lineTo(x + w / 2, base - h - 40 * s); g.lineTo(x + w, base - h); g.fill(); } x += w + 6 * s; } }
export function hills(g, W, base, cols = ['#9acb3a', '#7ab030']) { cols.forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, base); for (let x = 0; x <= W; x += 20) g.lineTo(x, base - 40 - i * -30 - Math.sin(x * 0.004 + i * 2) * 50 - Math.sin(x * 0.011 + i) * 18); g.lineTo(W, base + 10); g.lineTo(0, base + 10); g.fill(); }); }

// side-on country road world, parallax by camera x (cx). roadY = top edge of road
export function roadSide(g, W, H, cx, o = {}) {
  const night = o.night, roadY = o.roadY ?? H * 0.62, rh = o.roadH ?? 260;
  g.fillStyle = night ? '#141a48' : SKY_DAY[0]; g.fillRect(-W, -H, W * 3, H * 2); skyGrad(g, W, H, night ? ['#141a48', '#2a2e6a', '#4a3e7a'] : SKY_DAY, 0, roadY);
  if (night) { const R = rng(2); g.fillStyle = '#fff'; for (let i = 0; i < 80; i++) { g.globalAlpha = 0.4 + R() * 0.6; g.fillRect(R() * W, R() * roadY * 0.7, 3, 3); } g.globalAlpha = 1; g.beginPath(); g.arc(W * 0.7, H * 0.12, 54, 0, TAU); g.arc(W * 0.7 + 26, H * 0.12 - 12, 50, 0, TAU, true); fl(g, '#f4f0ff'); }
  else { for (let i = 0; i < 5; i++) { const xx = ((i * 520 - cx * 0.05) % (W + 800) + W + 800) % (W + 800) - 400; cloudStrip(g, xx, 120 + (i % 3) * 120, 420, 46); } }
  // far layer: town + hills (0.15)
  g.save(); g.translate(-((cx * 0.15) % 2400), 0); for (let k = 0; k < 3; k++) { if (o.city) townSkyline(g, k * 2400, roadY - 40, 2400, 1.2, 4, night ? ['#2a3266', '#323a74', '#3a427e'] : undefined); } g.restore();
  hills(g, W, roadY - 10, night ? ['#2a4a5a', '#24404e'] : ['#a8d84a', '#8cc23a']);
  // mid layer: trees + bushes (0.5)
  const mid = cx * 0.5; for (let i = -2; i < 14; i++) { const base = Math.floor(mid / 300) * 300 + i * 300, xx = base - mid; const R = rng(Math.abs(Math.floor(base / 300)) + 7); const s = 0.8 + R() * 0.5; const col = night ? '#2a5a5a' : ['#6a9a22', '#7aaa2a', '#5a8a1e'][Math.floor(R() * 3)]; if (R() < 0.6) teardropTree(g, xx, roadY - 6, s, col, i + 3); else roundTree(g, xx, roadY - 6, s * 0.9, col); }
  for (let i = -2; i < 14; i++) { const base = Math.floor(cx * 0.8 / 260) * 260 + i * 260, xx = base - cx * 0.8; bush(g, xx + 60, roadY + 2, 0.9, night ? '#1e4a4a' : '#5a8a1e'); }
  // road
  g.fillStyle = night ? '#3a3a5a' : '#a6b2c8'; g.fillRect(0, roadY, W, rh); g.fillStyle = night ? '#e8e8f8' : '#ffffff'; g.fillRect(0, roadY + 18, W, 10); g.fillRect(0, roadY + rh - 26, W, 10);
  for (let i = -1; i < 20; i++) { const xx = i * 120 - (cx % 120); g.fillRect(xx, roadY + rh / 2 - 4, 60, 8); }
  // lamps for night
  if (night) for (let i = -1; i < 6; i++) { const base = Math.floor(cx * 0.9 / 600) * 600 + i * 600, xx = base - cx * 0.9; g.fillStyle = '#2a2230'; g.fillRect(xx - 5, roadY - 360, 10, 360); g.fillRect(xx - 5, roadY - 360, 70, 10); g.fillStyle = '#ffd86a'; g.fillRect(xx + 30, roadY - 352, 40, 8); g.save(); g.globalAlpha = 0.18; g.beginPath(); g.moveTo(xx + 34, roadY - 348); g.lineTo(xx + 66, roadY - 348); g.lineTo(xx + 170, roadY + 40); g.lineTo(xx - 70, roadY + 40); g.closePath(); fl(g, '#ffe8a0'); g.restore(); }
  // foreground grass
  const fgY = roadY + rh; g.fillStyle = night ? '#24504a' : '#9acb2a'; g.fillRect(-W, fgY, W * 3, H * 2);
  if (o.ditch) { const dx = o.ditch - cx; g.fillStyle = night ? '#1a3a36' : '#6a9a1e'; g.beginPath(); g.moveTo(dx - 500, fgY); g.quadraticCurveTo(dx, fgY + 260, dx + 500, fgY); g.closePath(); g.fill(); }
  for (let i = -2; i < 10; i++) { const base = Math.floor(cx * 1.3 / 420) * 420 + i * 420, xx = base - cx * 1.3; bush(g, xx, fgY + 140, 1.3, night ? '#1a4040' : '#6a9a1e'); }
  return { roadY, rh, fgY };
}
// POV road (driver view), perspective with motion. z = distance travelled
export function roadPOV(g, W, H, z, o = {}) {
  const hy = o.horizon ?? H * 0.42, night = o.night;
  skyGrad(g, W, H, night ? ['#141a48', '#2a2e6a', '#4a3e7a'] : SKY_DAY, 0, hy);
  if (!night) { cloudStrip(g, W * 0.05, hy * 0.35, 380, 40); cloudStrip(g, W * 0.55, hy * 0.55, 460, 44); puffCloud(g, W * 0.75, hy * 0.25, 1.1); }
  else { g.beginPath(); g.arc(W * 0.62, H * 0.1, 46, 0, TAU); g.arc(W * 0.62 + 22, H * 0.1 - 10, 42, 0, TAU, true); fl(g, '#f4f0ff'); }
  hills(g, W, hy + 6, night ? ['#2a4a5a', '#24404e'] : ['#a8d84a', '#8cc23a']);
  g.fillStyle = night ? '#24504a' : '#9acb2a'; g.fillRect(0, hy, W, H - hy);
  g.fillRect(-W, hy, W * 3, H * 2); const P = (x, d) => { const k = 700 / Math.max(d, 0.5); return [W / 2 + x * k, hy + 1.5 * k]; };
  // road trapezoid
  const [a, b] = [P(-3.6, 400), P(3.6, 400)], [c2, d2] = [P(3.6, 0.9), P(-3.6, 0.9)]; g.fillStyle = night ? '#3a3a5a' : '#a6b2c8'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...c2); g.lineTo(...d2); g.closePath(); g.fill();
  g.fillStyle = '#fff'; for (const sx of [-3.4, 3.2]) { const p1 = P(sx, 400), p2 = P(sx + 0.15, 400), p3 = P(sx + 0.15, 0.9), p4 = P(sx, 0.9); g.beginPath(); g.moveTo(...p1); g.lineTo(...p2); g.lineTo(...p3); g.lineTo(...p4); g.fill(); }
  for (let i = 0; i < 40; i++) { const d0 = 1 + i * 8 - (z % 8); if (d0 < 0.9) continue; const d1 = d0 + 4; const p1 = P(-0.12, d1), p2 = P(0.12, d1), p3 = P(0.12, d0), p4 = P(-0.12, d0); g.fillStyle = '#ffd23a'; g.beginPath(); g.moveTo(...p1); g.lineTo(...p2); g.lineTo(...p3); g.lineTo(...p4); g.fill(); }
  // roadside trees approaching (sorted far to near)
  const items = []; for (let i = 0; i < 26; i++) { const d = 4 + i * 12 - (z % 12); if (d < 3) continue; items.push([d, i]); }
  items.sort((p, q) => q[0] - p[0]); for (const [d, i] of items) for (const side of [-1, 1]) { const [x, y] = P(side * (7 + ((i * 7) % 5)), d), s = 18 / d; if (s > 5) continue; if ((i + (side > 0 ? 1 : 0)) % 3 === 0) bush(g, x, y, s * 1.4, night ? '#1e4a4a' : '#5a8a1e'); else teardropTree(g, x, y, s, night ? '#2a5a5a' : '#6a9a22', i); }
  return P;
}
// a flat rock with facets
export function flatRock(g, x, y, s) { const lw = 6 * s; g.beginPath(); g.moveTo(x - 120 * s, y); g.lineTo(x - 100 * s, y - 70 * s); g.lineTo(x - 30 * s, y - 115 * s); g.lineTo(x + 60 * s, y - 100 * s); g.lineTo(x + 120 * s, y - 40 * s); g.lineTo(x + 125 * s, y); g.closePath(); fs(g, '#9a948c', lw); g.beginPath(); g.moveTo(x - 30 * s, y - 115 * s); g.lineTo(x - 10 * s, y - 40 * s); g.lineTo(x + 120 * s, y - 40 * s); g.lineTo(x + 60 * s, y - 100 * s); g.closePath(); fl(g, '#b8b2a8'); g.beginPath(); g.moveTo(x - 10 * s, y - 40 * s); g.lineTo(x - 30 * s, y); st(g, lw * 0.6, '#6a645c'); g.save(); g.globalAlpha = 0.25; ell(g, x, y + 4 * s, 130 * s, 14 * s); fl(g, '#20263a'); g.restore(); }
// soft dust puffs
export function dust(g, x, y, u, s = 1, col = '#e8dcc0', seed = 2) { if (u <= 0 || u >= 1) return; const R = rng(seed); g.save(); for (let i = 0; i < 12; i++) { const a = R() * Math.PI - Math.PI, d = (40 + R() * 160) * s * ease.out(u), r = (30 + R() * 50) * s * (0.6 + u); g.globalAlpha = 0.75 * (1 - u); ell(g, x + Math.cos(a) * d * 1.5, y + Math.sin(a) * d * 0.6, r, r * 0.8); fs(g, col, 4 * s); } g.restore(); }
export function speedLines(g, W, H, a, col = 'rgba(255,255,255,.7)', seed = 5) { if (a <= 0) return; const R = rng(seed); g.save(); g.globalAlpha = a; g.strokeStyle = col; for (let i = 0; i < 40; i++) { const ang = R() * TAU, r0 = 300 + R() * 200; g.lineWidth = 2 + R() * 6; g.beginPath(); g.moveTo(W / 2 + Math.cos(ang) * r0, H / 2 + Math.sin(ang) * r0); g.lineTo(W / 2 + Math.cos(ang) * 1400, H / 2 + Math.sin(ang) * 1400); g.stroke(); } g.restore(); }
export function burst(g, x, y, r, col = '#ffd23a', n = 14, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.beginPath(); for (let i = 0; i < n * 2; i++) { const ang = (i / (n * 2)) * TAU, rr2 = i % 2 ? r * 0.55 : r; g.lineTo(x + Math.cos(ang) * rr2, y + Math.sin(ang) * rr2); } g.closePath(); fs(g, col, 6); g.restore(); }
export function impactBg(g, W, H, col1 = '#e8302a', col2 = '#ff8a3a') { g.fillStyle = col1; g.fillRect(0, 0, W, H); g.fillStyle = col2; for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU; g.beginPath(); g.moveTo(W / 2, H / 2); g.lineTo(W / 2 + Math.cos(a) * 2000, H / 2 + Math.sin(a) * 2000); g.lineTo(W / 2 + Math.cos(a + 0.12) * 2000, H / 2 + Math.sin(a + 0.12) * 2000); g.fill(); } }
