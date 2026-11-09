// geo.js: map engine for GrowKaz shots (Mercator). Copy geo.js + world50m.js into a project's scenes/sets/.
// Usage inside a shot:
//   const view = flyTo(t, [[0, { lon: -70, lat: -30, zoom: 2.2 }], [1.5, fit(['CHL'], 1.4)]]);
//   drawWorld(g, view, { highlight: { CHL: '#e0443a' }, labels: { CHL: 'CHILE' }, t });
import { E, V, ease, prog, clamp, lerp, glow, alpha, shade, text, linGrad } from '/engine/core.js';
import { WORLD } from './world50m.js';

export const BY_ISO = Object.fromEntries(WORLD.map((c) => [c.iso, c]));
const R = Math.PI / 180;
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + clamp(lat, -85, 85) * R / 2));

// view = { lon, lat, zoom }  zoom 1 ≈ whole world across the frame width
export function project(view, lon, lat) {
  const s = (E.W / (2 * Math.PI)) * view.zoom;
  return [E.W / 2 + (lon - view.lon) * R * s, E.H / 2 - (mercY(lat) - mercY(view.lat)) * s];
}
// bounding box -> a view that fits those countries, `pad` > 1 leaves margin
export function fit(isos, pad = 1.3) {
  let a = 180, b = -180, c = 90, d = -90;
  for (const iso of isos) for (const poly of BY_ISO[iso]?.p || []) for (const [x, y] of poly[0]) { a = Math.min(a, x); b = Math.max(b, x); c = Math.min(c, y); d = Math.max(d, y); }
  const w = (b - a) * R, h = mercY(d) - mercY(c), fw = E.W / (E.W / (2 * Math.PI)), fh = E.H / (E.W / (2 * Math.PI));
  const zoom = Math.min(fw / (w * pad), fh / (h * pad));
  const latMid = Math.atan(Math.sinh((mercY(c) + mercY(d)) / 2)) / R;
  return { lon: (a + b) / 2, lat: latMid, zoom };
}
// camera keyframes [[t, view], ...] with eased, zoom-aware interpolation (log zoom)
export function flyTo(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a] = keys[i], [t1, b] = keys[i + 1];
    if (t <= t1) { const k = ease.inOut(prog(t, t0, t1)); return { lon: lerp(a.lon, b.lon, k), lat: lerp(a.lat, b.lat, k), zoom: Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom), k)) }; }
  }
  return keys[keys.length - 1][1];
}
function path(g, view, poly) {
  g.beginPath();
  for (const ring of poly) { ring.forEach(([x, y], i) => { const [px, py] = project(view, x, y); i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.closePath(); }
}
// o: { ocean:[top,bottom], land, border, highlight:{ISO:color}, pulse:{ISO:1}, dim:0..1 (darken non-highlighted), labels:{ISO:'TEXT'}, t }
export function drawWorld(g, view, o = {}) {
  const { ocean = ['#0f3a5a', '#0a2238'], land = '#c9b98e', land2 = '#9fb07a', border = 'rgba(40,30,20,.45)', highlight = {}, labels = {}, dim = 0, t = 0, borderW = 1.6 } = o;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ocean); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  // subtle graticule
  g.strokeStyle = 'rgba(255,255,255,.05)'; g.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 15) { const [x1, y1] = project(view, lon, -80), [x2, y2] = project(view, lon, 80); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
  for (let lat = -75; lat <= 75; lat += 15) { const [x1, y1] = project(view, -180, lat), [x2, y2] = project(view, 180, lat); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
  for (const c of WORLD) {
    const hl = highlight[c.iso];
    for (const poly of c.p) {
      path(g, view, poly);
      g.fillStyle = hl || linGrad(g, 0, 0, 0, E.H, [land2, land]); g.fill('evenodd');
      if (!hl && dim > 0) { g.fillStyle = alpha('#000000', 0.55 * dim); g.fill('evenodd'); }
      g.strokeStyle = border; g.lineWidth = borderW; g.stroke();
    }
  }
  // glowing outline on highlighted countries
  for (const [iso, col] of Object.entries(highlight)) {
    const c = BY_ISO[iso]; if (!c) continue;
    g.save(); g.shadowColor = col; g.shadowBlur = 24 + 10 * Math.sin(t * 4);
    for (const poly of c.p) { path(g, view, poly); g.strokeStyle = shade(col, 0.35); g.lineWidth = 4; g.stroke(); }
    g.restore();
  }
  for (const [iso, str] of Object.entries(labels)) {
    const c = BY_ISO[iso]; if (!c) continue;
    const [x, y] = project(view, c.lon, c.lat);
    text(g, str, x, y, { size: V(40, 52), font: 'Nunito', weight: 900, color: '#ffffff', stroke: 8, strokeColor: 'rgba(0,0,0,.65)', spacing: 2 });
  }
}
// great-circle-ish arc (flight / route) drawn progressively; p 0..1
export function route(g, view, a, b, p, o = {}) {
  const { color = '#ffd23f', w = 6, lift = 0.25 } = o;
  const [x1, y1] = project(view, ...a), [x2, y2] = project(view, ...b), mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * lift;
  g.strokeStyle = color; g.lineWidth = w; g.lineCap = 'round'; g.setLineDash([w * 2, w * 1.6]); g.beginPath();
  for (let i = 0; i <= 60 * p; i++) { const u = i / 60, x = (1 - u) ** 2 * x1 + 2 * (1 - u) * u * mx + u * u * x2, y = (1 - u) ** 2 * y1 + 2 * (1 - u) * u * my + u * u * y2; i ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke(); g.setLineDash([]);
}
export function pin(g, view, lon, lat, label, o = {}) {
  const { color = '#e0443a', a = 1 } = o; const [x, y] = project(view, lon, lat);
  g.save(); g.globalAlpha *= a; glow(g, x, y, 60, color, 0.6); g.fillStyle = color; g.beginPath(); g.arc(x, y, 12, 0, 7); g.fill(); g.restore();
  if (label) text(g, label, x, y - 40, { size: V(32, 40), font: 'Nunito', weight: 900, color: '#fff', stroke: 7, strokeColor: 'rgba(0,0,0,.6)', alpha: a });
}
