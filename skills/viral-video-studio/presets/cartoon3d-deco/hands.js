// sets/hands.js: clear cartoon hands (chunky rounded fingers, readable thumb, one merged inked silhouette, soft shade side,
// knuckle + palm-crease detail). Replaces "ball" hands. Local frame: wrist at origin, fingers point along +y before rotation.
//   toonHand(g, x, y, len, ang, pose, {skin, ink, side, held, shadeK})
//   pose: 'open' | 'relaxed' | 'fist' | 'grip' | 'point' | 'wave' | {curl, spread, point}
export const PLUM = '#241726';
const POSES = { open: { curl: 0, spread: 1 }, wave: { curl: 0, spread: 1.15 }, relaxed: { curl: 0.3, spread: 0.2 }, fist: { curl: 1, spread: 0 }, grip: { curl: 0.72, spread: 0.08 }, point: { curl: 1, spread: 0, point: 1 }, hold: { curl: 0.55, spread: 0.1 } };
function shade(hex, k) { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(Math.max(0, Math.min(255, k < 0 ? v * (1 + k) : v + (255 - v) * k))); return '#' + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1); }
const lerp = (a, b, k) => a + (b - a) * k;
// returns finger polylines in unit space
function geometry(P, side) {
  const fingers = [], c = P.curl, sp = P.spread;
  const base = [[-0.19, 0.47], [-0.065, 0.51], [0.065, 0.51], [0.19, 0.47]], lens = [0.27, 0.36, 0.39, 0.35], fan = [-0.26, -0.09, 0.08, 0.24];
  for (let i = 0; i < 4; i++) {
    const ci = P.point && i === 3 ? 0 : c, a0 = fan[i] * (0.4 + sp), L = lens[i];
    // front view: curling folds the finger back over the palm -> projected length shrinks and the tip comes back up
    const l1 = L * 0.55 * Math.cos(ci * 1.25), l2 = L * 0.45 * Math.cos(Math.min(Math.PI * 0.95, ci * 2.6));
    const [bx, by] = base[i], mx = bx + Math.sin(a0) * l1, my = by + Math.cos(a0) * l1, a1 = a0 * 1.1, tx = mx + Math.sin(a1) * l2, ty = my + Math.cos(a1) * l2;
    fingers.push([[bx, by], [mx, my], [tx, ty]]);
  }
  // thumb: sticks out to the side when open, folds across the palm when gripping (angle from +y toward +x)
  const th = lerp(0.62 + sp * 0.3, -1.2, c), tb = [0.22, lerp(0.16, 0.24, c)], t1 = [tb[0] + Math.sin(th) * 0.2, tb[1] + Math.cos(th) * 0.2], th2 = th + lerp(-0.3, -0.5, c), t2 = [t1[0] + Math.sin(th2) * 0.15, t1[1] + Math.cos(th2) * 0.15];
  const thumb = [tb, t1, t2];
  return { fingers, thumb };
}
export function toonHand(g, x, y, len, ang, pose = 'relaxed', o = {}) {
  const P = typeof pose === 'string' ? (POSES[pose] || POSES.relaxed) : { curl: 0, spread: 0.3, ...pose };
  const skin = o.skin || '#f0c8a0', side = o.side || 1, u = len, ink = o.ink ?? len * 0.055, fw = 0.125; // finger width (units)
  const { fingers, thumb } = geometry(P, side);
  const M = g.getTransform(); g.save(); g.translate(x, y); g.rotate(ang); g.scale(side * u, u); g.lineCap = 'round'; g.lineJoin = 'round';
  const palm = () => { g.beginPath(); g.moveTo(-0.15, 0.0); g.quadraticCurveTo(-0.27, 0.14, -0.26, 0.38); g.quadraticCurveTo(-0.25, 0.54, -0.08, 0.55); g.lineTo(0.1, 0.55); g.quadraticCurveTo(0.27, 0.54, 0.27, 0.36); g.quadraticCurveTo(0.28, 0.14, 0.15, 0.0); g.closePath(); };
  const poly = (pts) => { g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); };
  const I = ink / u, gripFront = P.curl > 0.5; // when gripping, fingers sit in front of whatever is held
  const all = (pass) => { // pass 0: ink silhouette, pass 1: fill
    const w = pass ? 0 : I * 2;
    palm(); if (pass) { g.fillStyle = skin; g.fill(); } else { g.lineWidth = w; g.strokeStyle = PLUM; g.stroke(); }
    if (P.curl <= 0.5) { poly(thumb); g.lineWidth = fw * 1.18 + w; g.strokeStyle = pass ? skin : PLUM; g.stroke(); }
    if (!gripFront || !o.held) for (const f of fingers) { poly(f); g.lineWidth = fw + w; g.strokeStyle = pass ? skin : PLUM; g.stroke(); }
  };
  all(0); all(1);
  // shade side + soft highlight (reads as volume like the glove reference)
  g.save(); palm(); g.clip(); g.fillStyle = shade(skin, -0.16); g.beginPath(); g.ellipse(0.2, 0.32, 0.14, 0.32, 0.1, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.ellipse(-0.13, 0.24, 0.06, 0.13, 0.2, 0, Math.PI * 2); g.fill(); g.restore();
  if (o.held) { g.save(); g.setTransform(M); o.held(); g.restore(); }
  if (gripFront && o.held) { for (const f of fingers) { poly(f); g.lineWidth = fw + I * 2; g.strokeStyle = PLUM; g.stroke(); poly(f); g.lineWidth = fw; g.strokeStyle = skin; g.stroke(); } }
  if (P.curl > 0.5) { poly(thumb); g.lineWidth = fw * 1.18 + I * 2; g.strokeStyle = PLUM; g.stroke(); poly(thumb); g.lineWidth = fw * 1.18; g.strokeStyle = skin; g.stroke(); }
  // detail: knuckle creases on each finger, palm crease, thumb crease
  g.strokeStyle = PLUM; g.lineWidth = I * 0.6;
  for (const f of fingers) { const [m] = [f[1]]; const dx = f[2][0] - f[0][0], dy = f[2][1] - f[0][1], d = Math.hypot(dx, dy) || 1; if (d > 0.12) { g.beginPath(); g.moveTo(m[0] - dy / d * fw * 0.32, m[1] + dx / d * fw * 0.32); g.lineTo(m[0] + dy / d * fw * 0.32, m[1] - dx / d * fw * 0.32); g.stroke(); } }
  if (P.curl < 0.6) { g.beginPath(); g.moveTo(-0.13, 0.4); g.quadraticCurveTo(0.0, 0.34, 0.1, 0.2); g.stroke(); } else { for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-0.13 + i * 0.13, 0.46); g.lineTo(-0.13 + i * 0.13, 0.55); g.stroke(); } }
  g.restore();
}
// hand on the end of a forearm segment [elbow, wrist]
export function handOnArm(g, elbow, wrist, len, pose, o = {}) { const dx = wrist[0] - elbow[0], dy = wrist[1] - elbow[1], d = Math.hypot(dx, dy) || 1; const ang = Math.atan2(dy, dx) - Math.PI / 2; toonHand(g, wrist[0] - dx / d * len * 0.06, wrist[1] - dy / d * len * 0.06, len, ang, pose, o); }
