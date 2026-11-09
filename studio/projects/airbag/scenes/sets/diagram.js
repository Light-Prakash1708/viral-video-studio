// diagram.js: map-and-diagram explainer kit (civics / economics / "how X works" videos). Measured on a 114 s civics Short
// ("The Difference Between the House and Senate"): 0 hard cuts, everything zooms or swipes; blueprint background,
// cut-out landmark icons, an org chart that builds, isotype people grids that count, a parliament hemicycle,
// handwritten annotations with circles, approval ticks. Copy next to geo.js; import in 2D shots:
//   import { blueprint, isotype, hemicycle, orgNode, orgLink, scribble, scribbleCircle, tick, swipe, countUp, badge } from '../sets/diagram.js';
import { E, ease, prog, clamp, lerp, alpha, text, rr, circle, seg, glow } from '/engine/core.js';

// blueprint backdrop: deep blue gradient + fine grid + soft vignette
export function blueprint(g, o = {}) {
  const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, o.top || '#1a5ab8'); gr.addColorStop(1, o.bottom || '#0e3a88'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 1; const s = o.grid || 40;
  for (let x = 0; x < E.W; x += s) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = 0; y < E.H; y += s) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  const vg = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.3, E.W / 2, E.H / 2, E.H * 0.8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,10,40,.45)'); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H);
}
// one pictogram person (head + rounded body), x,y = feet
export function person(g, x, y, h, col = '#ffffff') {
  const r = h * 0.17; g.fillStyle = col; g.beginPath(); g.arc(x, y - h + r, r, 0, 7); g.fill();
  rr(g, x - h * 0.2, y - h + r * 2.3, h * 0.4, h * 0.42, h * 0.12); g.fill(); g.fillRect(x - h * 0.15, y - h * 0.35, h * 0.12, h * 0.35); g.fillRect(x + h * 0.03, y - h * 0.35, h * 0.12, h * 0.35);
}
// isotype grid: n figures in `cols` columns that pop in one by one (k 0..1); o.colors: array or fn(i) for party colours
export function isotype(g, x, y, n, cols, o = {}) {
  const { size = 34, gap = 6, k = 1, color = '#ffffff' } = o, shown = Math.floor(n * clamp(k)); const w = cols * (size * 0.5 + gap);
  for (let i = 0; i < shown; i++) { const c = i % cols, r = Math.floor(i / cols), pop = i === shown - 1 ? 1 + 0.3 * (1 - (n * k - i)) : 1;
    const col = typeof o.colors === 'function' ? o.colors(i) : Array.isArray(o.colors) ? o.colors[i % o.colors.length] : color;
    g.save(); g.translate(x - w / 2 + c * (size * 0.5 + gap) + size * 0.25, y + r * (size + gap)); g.scale(pop, pop); person(g, 0, size, size, col); g.restore(); }
}
// a big number that counts up with a pop (value at k=1)
export function countUp(g, value, x, y, k, o = {}) {
  const v = Math.round(value * ease.out(clamp(k))); const pop = 1 + 0.15 * Math.max(0, 1 - Math.abs(k - 1) * 6);
  g.save(); g.translate(x, y); g.scale(pop, pop); text(g, v.toLocaleString('en-US'), 0, 0, { size: o.size || 120, font: 'Nunito', weight: 900, color: o.color || '#ffd23a', glow: 10, glowColor: 'rgba(0,0,0,.5)' }); g.restore();
}
// parliament hemicycle: seats = [{n, color}], fills seat by seat with k; returns nothing
export function hemicycle(g, cx, cy, R, seats, o = {}) {
  const total = seats.reduce((a, s) => a + s.n, 0), rows = o.rows || Math.max(4, Math.round(Math.sqrt(total / 4))), k = clamp(o.k ?? 1), dots = [];
  for (let r = 0; r < rows; r++) { const rr2 = R * (0.45 + 0.55 * r / Math.max(1, rows - 1)), m = Math.round(total * rr2 / (R * rows * 0.72)); for (let j = 0; j < m; j++) { const a = Math.PI + Math.PI * (j + 0.5) / m; dots.push({ a, x: cx + Math.cos(a) * rr2, y: cy + Math.sin(a) * rr2 }); } }
  dots.sort((p, q) => p.a - q.a); const n = Math.min(dots.length, total), show = Math.floor(n * k), dr = R / rows * 0.32;
  let si = 0, acc = seats[0].n; for (let i = 0; i < show; i++) { while (i >= acc && si < seats.length - 1) { si++; acc += seats[si].n; } circle(g, dots[i].x, dots[i].y, dr, seats[si].color); }
  if (o.label) text(g, o.label, cx, cy + dr * 4, { size: o.labelSize || 44, font: 'Nunito', weight: 900, color: '#ffffff' });
}
// org-chart node: optional icon fn, title in an orange label, pops in with k
export function orgNode(g, x, y, title, k, o = {}) {
  if (k <= 0) return; const s = ease.outBack(clamp(k)); g.save(); g.translate(x, y); g.scale(s, s);
  if (o.icon) o.icon(g, 0, -60); const w = Math.max(160, title.length * (o.size || 30) * 0.62 + 40);
  rr(g, -w / 2, -24, w, 52, 6); g.fillStyle = o.color || '#ee7a1a'; g.fill(); text(g, title.toUpperCase(), 0, 2, { size: o.size || 30, font: 'Nunito', weight: 900, color: '#ffffff' }); g.restore();
}
// connector line drawn progressively (elbow: down, across, down)
export function orgLink(g, x1, y1, x2, y2, k, col = '#ffffff') {
  if (k <= 0) return; const my = (y1 + y2) / 2, pts = [[x1, y1], [x1, my], [x2, my], [x2, y2]]; let L = 0; const segs = []; for (let i = 1; i < 4; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); L += d; }
  let rem = L * clamp(k); const out = [pts[0]]; for (let i = 1; i < 4 && rem > 0; i++) { const d = segs[i - 1], u = Math.min(1, rem / d); out.push([lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)]); rem -= d; } seg(g, out, 4, col);
}
// handwritten annotation (yellow script) that writes on left to right, plus a hand-drawn circle around a region
export function scribble(g, str, x, y, k, o = {}) {
  if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.12); g.font = `italic 700 ${o.size || 54}px 'Caveat', 'Comic Sans MS', cursive`; const w = g.measureText(str).width;
  g.beginPath(); g.rect(-w / 2 - 10, -80, (w + 20) * clamp(k), 160); g.clip(); g.fillStyle = o.color || '#ffe23a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, 0, 0); g.restore();
}
export function scribbleCircle(g, x, y, rx, ry, k, o = {}) {
  if (k <= 0) return; g.save(); g.strokeStyle = o.color || '#ffe23a'; g.lineWidth = o.w || 6; g.lineCap = 'round'; g.beginPath(); const N = 60, end = Math.floor(N * 1.08 * clamp(k));
  for (let i = 0; i <= end; i++) { const a = -Math.PI * 0.6 + i / N * Math.PI * 2, wob = 1 + 0.04 * Math.sin(i * 0.7); const px = x + Math.cos(a) * rx * wob, py = y + Math.sin(a) * ry * wob; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); g.restore();
}
// glowing approval tick in a rounded box
export function tick(g, x, y, k, o = {}) {
  if (k <= 0) return; const s = ease.outBack(clamp(k)) * (o.size || 1); g.save(); g.translate(x, y); g.scale(s, s); glow(g, 0, 0, 90, '#3aff6a', 0.5); rr(g, -40, -40, 80, 80, 14); g.fillStyle = '#0e2a1a'; g.fill(); g.strokeStyle = '#3aff6a'; g.lineWidth = 6; g.stroke();
  g.strokeStyle = '#3aff6a'; g.lineWidth = 12; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-20, 0); g.lineTo(-5, 16); g.lineTo(22, -18); g.stroke(); g.restore();
}
// small label badge (e.g. "435", "6 years")
export function badge(g, str, x, y, k, o = {}) { if (k <= 0) return; const s = ease.outBack(clamp(k)); g.save(); g.translate(x, y); g.scale(s, s); g.font = `900 ${o.size || 34}px Nunito`; const w = g.measureText(str).width + 30; rr(g, -w / 2, -28, w, 56, 28); g.fillStyle = o.bg || '#e8202a'; g.fill(); text(g, str, 0, 2, { size: o.size || 34, font: 'Nunito', weight: 900, color: '#ffffff' }); g.restore(); }
// diagonal swipe transition between two draw functions (k 0..1): from A to B with a white edge
export function swipe(g, k, drawA, drawB, o = {}) {
  const kk = ease.inOut(clamp(k)), ang = o.angle ?? 0.35, x = lerp(-E.W * 0.6, E.W * 1.6, kk);
  drawA(g); if (kk <= 0) return; g.save(); g.beginPath(); g.moveTo(x - E.H * Math.tan(ang), 0); g.lineTo(x, E.H); g.lineTo(-E.W, E.H); g.lineTo(-E.W, 0); g.closePath(); g.clip(); drawB(g); g.restore();
  g.save(); g.strokeStyle = '#ffffff'; g.lineWidth = 10; g.beginPath(); g.moveTo(x - E.H * Math.tan(ang), 0); g.lineTo(x, E.H); g.stroke(); g.restore();
}
