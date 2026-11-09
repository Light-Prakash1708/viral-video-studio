// sets/india.js: the worlds. Indian market street (shops, balconies, wires, autos), a mall, a restaurant,
// interiors (apartment, hospital, bank, bakery, classroom), Delhi rooftops, and the sepia 1932 Alpine town.
import { E, V, mood, layer, backdrop, rr, seg, poly, circle, ring, glow, alpha, shade, mix, linGrad, radGrad, text, ease, prog, clamp, lerp, rng, noise, S } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { EMBER, GOLD } from './money.js';

export const GY = () => E.H * V(0.8, 0.68);
const SIGNS = [['SHARMA STORES', '#d8442a'], ['CHAI', '#2a9a8a'], ['MOBILE ZONE', '#3a6ea5'], ['SWEETS', '#e0a030'], ['TAILOR', '#8a5ad6'], ['MEDICAL', '#3fb950'], ['DHABA', '#c8402a'], ['ELECTRONICS', '#2a7ac8']];

// tangled overhead wires between two x positions
export function wires(g, x0, x1, y, t, o = {}) {
  const { n = 6, sag = 60, color = 'rgba(8,8,10,.85)', seed = 2 } = o; const r = rng(seed);
  for (let i = 0; i < n; i++) { const ya = y + r() * 70, yb = y + r() * 70 - 20, s2 = sag * (0.6 + r() * 0.8); g.strokeStyle = color; g.lineWidth = 2 + r() * 2.5; g.beginPath(); g.moveTo(x0, ya); g.quadraticCurveTo((x0 + x1) / 2, Math.max(ya, yb) + s2 + Math.sin(t * 0.8 + i) * 3, x1, yb); g.stroke(); }
}
export function autoRick(g, x, y, s, o = {}) {
  const { facing = 1, color = '#e8c21a', body = '#2a7a3a', lit = true } = o;
  g.save(); g.translate(x, y); g.scale(s * facing, s);
  g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.ellipse(0, 4, 150, 14, 0, 0, 7); g.fill();
  poly(g, [[-120, -30], [100, -30], [130, -70], [128, -120], [-110, -130], [-128, -80]], body);
  poly(g, [[-112, -130], [118, -120], [100, -200], [-100, -210]], '#141210');
  rr(g, -116, -214, 232, 24, 10); g.fillStyle = color; g.fill();
  poly(g, [[60, -122], [118, -118], [104, -190], [64, -196]], 'rgba(150,200,210,.35)');
  seg(g, [[-60, -130], [-60, -30]], 6, '#141210');
  for (const wx of [-80, 96]) { circle(g, wx, -18, 26, '#0c0b0a'); circle(g, wx, -18, 10, '#5a5652'); }
  if (lit) { glow(g, 128, -80, 60, '#ffe7b0', 0.7); circle(g, 128, -80, 8, '#fff4d8'); }
  g.restore();
}
export function car(g, x, y, s, color = '#3a4a5a', o = {}) {
  const { facing = 1, lit = true } = o; g.save(); g.translate(x, y); g.scale(s * facing, s);
  g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.ellipse(0, 4, 200, 16, 0, 0, 7); g.fill();
  rr(g, -190, -84, 380, 66, 22); g.fillStyle = color; g.fill(); poly(g, [[-110, -84], [90, -84], [60, -140], [-80, -140]], shade(color, -0.25));
  poly(g, [[-96, -88], [80, -88], [54, -132], [-72, -132]], 'rgba(140,190,210,.28)');
  for (const wx of [-120, 120]) { circle(g, wx, -18, 30, '#0c0b0a'); circle(g, wx, -18, 12, '#4a4642'); }
  if (lit) { glow(g, 186, -60, 70, '#fff0c8', 0.6); glow(g, -186, -60, 50, '#ff3a2a', 0.6); }
  g.restore();
}
// a mid-rise Indian building with balconies, AC units, a shop sign and shutter at ground level
export function building(g, x, gy, w, h, M, o = {}) {
  const { seed = 1, sign = null, lit = 0.5, col = null } = o; const r = rng(seed), c = col || shade(mix(M.wall, ['#8a5a4a', '#5a6a7a', '#7a6a4a', '#6a4a5a'][seed % 4], 0.35), -0.15);
  g.fillStyle = c; g.fillRect(x, gy - h, w, h); g.fillStyle = shade(c, -0.25); g.fillRect(x, gy - h, w, 14);
  // water tank on top
  if (r() < 0.7) { rr(g, x + w * (0.2 + r() * 0.5), gy - h - 56, 50, 56, 8); g.fillStyle = '#121010'; g.fill(); }
  const floors = Math.max(2, Math.floor((h - 150) / 120));
  for (let f = 0; f < floors; f++) { const fy = gy - 180 - f * 120;
    for (let k = 0; k < 2; k++) { const wx = x + 30 + k * (w / 2), ww = w / 2 - 60; const on = r() < lit; g.fillStyle = on ? alpha(M.practical, 0.85) : shade(c, -0.45); g.fillRect(wx, fy - 70, ww, 64); if (on) glow(g, wx + ww / 2, fy - 38, 90, M.practical, 0.15);
      g.fillStyle = shade(c, -0.5); for (let b = 0; b < 5; b++) g.fillRect(wx + (b * ww) / 4 - 2, fy - 70, 4, 64); }
    // balcony rail
    g.fillStyle = shade(c, -0.35); g.fillRect(x + 14, fy, w - 28, 10); for (let b = x + 20; b < x + w - 20; b += 18) g.fillRect(b, fy - 34, 3, 34); g.fillRect(x + 14, fy - 36, w - 28, 5);
    if (r() < 0.6) { rr(g, x + w - 76, fy - 104, 50, 34, 4); g.fillStyle = '#b8b4ac'; g.fill(); } // AC unit
    if (r() < 0.5) { for (let q = 0; q < 4; q++) { g.fillStyle = ['#d8442a', '#e8c21a', '#3a8ac8', '#f2efe8'][(q + seed) % 4]; g.fillRect(x + 40 + q * 26, fy - 30, 18, 24); } } // laundry
  }
  // shop at ground
  const [name, sc] = sign || SIGNS[seed % SIGNS.length];
  g.fillStyle = shade(c, -0.55); g.fillRect(x + 12, gy - 150, w - 24, 150);
  g.fillStyle = mix('#ffd59a', M.practical, 0.5); g.fillRect(x + 24, gy - 120, w - 48, 120); glow(g, x + w / 2, gy - 60, w * 0.7, M.practical, 0.2);
  for (let i = 0; i < 6; i++) { g.fillStyle = ['#c8402a', '#3a6ea5', '#e0a030', '#3fb950'][(i + seed) % 4]; g.fillRect(x + 36 + i * ((w - 72) / 6), gy - 110 + (i % 2) * 20, (w - 90) / 6, 40); }
  rr(g, x + 8, gy - 196, w - 16, 52, 6); g.fillStyle = sc; g.fill(); g.strokeStyle = shade(sc, 0.3); g.lineWidth = 2; g.stroke();
  let fs = 30; g.font = `700 ${fs}px "Fredoka"`; const mw = g.measureText(name).width; if (mw > w - 40) fs *= (w - 40) / mw;
  text(g, name, x + w / 2, gy - 168, { size: fs, color: '#fff6e0', spacing: 2 });
  poly(g, [[x + 4, gy - 144], [x + w - 4, gy - 144], [x + w + 14, gy - 112], [x - 14, gy - 112]], shade(sc, -0.25)); // awning
}
// the big mall facade
export function mall(g, x, gy, w, h, t, M) {
  g.fillStyle = linGrad(g, 0, gy - h, 0, gy, ['#14222c', '#0c161c']); g.fillRect(x, gy - h, w, h);
  for (let i = 0; i < 10; i++) for (let j = 0; j < 6; j++) { const cx = x + 20 + i * ((w - 40) / 10), cy = gy - h + 90 + j * ((h - 240) / 6); g.fillStyle = alpha(j % 2 ? '#ffd8a0' : '#9fe0ff', 0.25 + 0.2 * ((i * 7 + j * 3) % 5) / 5); g.fillRect(cx, cy, (w - 40) / 10 - 8, (h - 240) / 6 - 8); }
  rr(g, x + w / 2 - 260, gy - h + 18, 520, 60, 12); g.fillStyle = '#0a0606'; g.fill();
  const nf = 0.8 + 0.2 * Math.sin(t * 9) * Math.sin(t * 3.1);
  text(g, 'CITY MALL', x + w / 2, gy - h + 50, { size: 46, weight: 700, color: '#ffcf8a', glow: 22, glowColor: alpha(EMBER, 0.9), spacing: 8, alpha: nf }); glow(g, x + w / 2, gy - h + 48, 380, EMBER, 0.18 * nf);
  // SALE banners
  for (const bx of [x + 60, x + w - 200]) { rr(g, bx, gy - h + 120, 140, 260, 8); g.fillStyle = '#d8281e'; g.fill(); text(g, 'SALE', bx + 70, gy - h + 200, { size: 46, weight: 700, color: '#fff2c0' }); text(g, '70%', bx + 70, gy - h + 270, { size: 50, font: 'Nunito', weight: 900, color: '#ffe080' }); text(g, 'OFF', bx + 70, gy - h + 316, { size: 30, weight: 700, color: '#fff2c0' }); }
  // entrance
  g.fillStyle = linGrad(g, 0, gy - 240, 0, gy, ['#fff0d0', '#ffc070']); g.fillRect(x + w / 2 - 220, gy - 240, 440, 240); glow(g, x + w / 2, gy - 120, 500, '#ffd59a', 0.35);
  g.fillStyle = '#0c161c'; for (let i = 0; i <= 4; i++) g.fillRect(x + w / 2 - 222 + i * 110, gy - 240, 6, 240);
}
// Indian market street. o: { mood, mall, seed, wires, autos, lamps, smog }
export function street(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), gy = GY(), seed = o.seed || 1;
  layer(g, cam, 0.08, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * (o.sunX ?? 0.68), gy - V(330, 500), 64, '#fff2d6', M.key, 6); FX.stars(g, t, { count: 40, area: [0, 0, E.W, E.H * 0.25], color: alpha('#ffffff', 0.4) }); });
  layer(g, cam, 0.2, (g) => { FX.skyline(g, { x: -E.W, y: gy - 120, w: E.W * 3, minH: 120, maxH: 420, color: shade(M.wall, -0.55), windowColor: alpha(M.practical, 0.55), lit: 0.25, seed: seed + 30 }); FX.fog(g, gy - 360, 340, mix(M.fog, EMBER, 0.25), 0.3); });
  layer(g, cam, 0.5, (g) => {
    const bw = [420, 360, 460, 380, 440, 400, 420, 380];
    let x = -E.W * 0.7; let i = 0;
    while (x < E.W * 1.7) { const w = bw[(i + seed) % bw.length], h = 520 + ((i * 97 + seed * 31) % 260);
      if (o.mall && x > E.W * 0.1 && x < E.W * 0.6 && !o._m) { mall(g, E.W * 0.18, gy, E.W * 0.64, 760, t, M); x = E.W * 0.82; o._m = 1; continue; }
      building(g, x, gy, w, h, M, { seed: seed + i, lit: 0.55 }); x += w + 6; i++; }
    o._m = 0;
    if (o.wires !== false) { wires(g, -E.W * 0.5, E.W * 0.45, gy - 520, t, { seed: seed + 3 }); wires(g, E.W * 0.45, E.W * 1.6, gy - 540, t, { seed: seed + 5 }); seg(g, [[E.W * 0.45, gy], [E.W * 0.45, gy - 600]], 12, '#0c0a0a'); }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, gy - 10, 0, gy + 400, [shade(M.floor, 0.12), shade(M.dark, -0.35)]); g.fillRect(-E.W, gy - 10, E.W * 3, E.H * 2);
    g.fillStyle = shade(M.floor, 0.25); g.fillRect(-E.W, gy - 10, E.W * 3, 10);
    for (let x = -E.W; x < E.W * 2; x += 240) { g.fillStyle = 'rgba(255,240,210,.12)'; g.fillRect(x, gy + 130, 120, 8); }
    for (let i = 0; i < 14; i++) { const x = ((i * 173 + seed * 50) % (E.W * 2)) - E.W * 0.4; g.fillStyle = alpha(i % 3 ? M.practical : EMBER, 0.08); g.fillRect(x, gy + 20 + (i % 4) * 30, 16, 140); }
    if (o.lamps !== false) { FX.lampPost(g, E.W * 0.06, gy, 560, { light: M.practical, a: 0.25 }); FX.pool(g, E.W * 0.06 + 40, gy + 30, 240, 46, M.practical, 0.3); }
    if (o.autos) { autoRick(g, E.W * 0.82, gy + 40, 0.9, { facing: -1 }); }
  });
  return { M, GY: gy, CX: E.W / 2 };
}
// restaurant front with a long queue zone
export function restaurant(g, t, cam, o = {}) {
  const M = mood('night'), gy = GY();
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.stars(g, t, { count: 60 }); });
  layer(g, cam, 0.25, (g) => FX.skyline(g, { x: -E.W, y: gy - 100, w: E.W * 3, minH: 160, maxH: 480, color: shade(M.wall, -0.5), windowColor: alpha(M.practical, 0.6), lit: 0.3, seed: 41 }));
  layer(g, cam, 0.5, (g) => {
    building(g, -E.W * 0.6, gy, 520, 600, M, { seed: 6 });
    const x = E.W * 0.52, w = E.W * 0.62, h = 640; g.fillStyle = '#2a1a16'; g.fillRect(x, gy - h, w, h);
    for (let i = 0; i < 4; i++) { const wx = x + 40 + i * (w - 80) / 4; g.fillStyle = linGrad(g, 0, gy - 420, 0, gy - 120, ['#ffd08a', '#e0803a']); g.fillRect(wx, gy - 420, (w - 80) / 4 - 30, 300); glow(g, wx + 100, gy - 270, 260, '#ffb060', 0.18); for (let k = 0; k < 3; k++) { circle(g, wx + 40 + k * 60, gy - 210, 22, 'rgba(40,20,14,.7)'); g.fillStyle = 'rgba(40,20,14,.7)'; g.fillRect(wx + 22 + k * 60, gy - 190, 36, 60); } }
    rr(g, x + w * 0.15, gy - h + 40, w * 0.7, 90, 14); g.fillStyle = '#0c0606'; g.fill();
    text(g, 'SPICE GARDEN', x + w / 2, gy - h + 86, { size: 56, weight: 700, color: '#ffd08a', glow: 20, glowColor: alpha(EMBER, 0.9), spacing: 6 }); glow(g, x + w / 2, gy - h + 86, 420, EMBER, 0.14);
    // string lights
    for (let i = 0; i < 26; i++) { const lx = x - 300 + i * 46, ly = gy - 470 + Math.sin(i * 0.5) * 18 + 30 * Math.sin((i / 26) * Math.PI); glow(g, lx, ly, 20, '#ffd59a', 0.7 + 0.3 * Math.sin(t * 3 + i)); circle(g, lx, ly, 4, '#fff2d0'); }
    g.fillStyle = '#ffe0a8'; g.fillRect(x - 20, gy - 260, 150, 260); glow(g, x + 50, gy - 130, 300, '#ffd59a', 0.3);
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, gy - 10, 0, gy + 400, [shade(M.floor, 0.1), shade(M.dark, -0.3)]); g.fillRect(-E.W, gy - 10, E.W * 3, E.H * 2); FX.pool(g, E.W * 0.6, gy + 20, 420, 60, '#ffb060', 0.25); });
  return { M, GY: gy };
}
// interiors. kind: apartment | hospital | bank | bakery | classroom | showroom | penthouse
export function interior(g, t, cam, o = {}) {
  const kind = o.kind || 'apartment', gy = GY();
  const M = mood(o.mood || ({ hospital: 'interiorCool', bank: 'interiorCool', classroom: 'interiorWarm', showroom: 'interiorWarm', penthouse: 'golden' }[kind] || 'interiorWarm'));
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, gy, [shade(M.wall, -0.45), shade(M.wall, 0.02)]); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    g.fillStyle = shade(M.wall, -0.3); g.fillRect(-E.W, gy - 40, E.W * 3, 40);
    const wx = E.W / 2 + (o.winX ?? 300), wy = gy - 720, ww = o.winW || 520, wh = 440;
    if (o.window !== false) {
      FX.windowFrame(g, { x: wx - ww / 2, y: wy, w: ww, h: wh, cols: 3, rows: 2, frame: shade(M.wall, -0.55), bar: 10, blinds: kind === 'bank' || kind === 'hospital' ? 10 : 0 }, (g, x, y, w, h) => {
        const sk = mood(o.sky || 'night'); backdrop(g, sk.sky, [x, y, w, h]);
        if (o.sky === 'dusk' || o.sky === 'golden') FX.sun(g, x + w * 0.65, y + h * 0.66, 34, '#fff0d0', sk.key, 4); else FX.moon(g, x + w * 0.7, y + h * 0.25, 22);
        FX.skyline(g, { x, y: y + h * 0.66, w, minH: 30, maxH: h * 0.45, color: '#06080c', windowColor: alpha(sk.practical || '#ffd59a', 0.8), lit: 0.4, seed: 7 });
        if (o.rain) FX.rain(g, t, { area: [x, y, w, h], count: 120, a: 0.4 });
      });
      FX.godRays(g, wx, wy + 80, { count: 5, len: 1200, color: M.key, a: 0.05, angle: Math.PI * 0.62, t });
    }
    if (kind === 'apartment') { // ceiling fan + calendar + shelf
      seg(g, [[E.W * 0.3, -E.H], [E.W * 0.3, gy - 760]], 6, '#1a1210'); g.save(); g.translate(E.W * 0.3, gy - 760); g.scale(1, 0.25); for (let k = 0; k < 3; k++) { g.save(); g.rotate(t * 9 + (k * Math.PI * 2) / 3); rr(g, 0, -14, 200, 28, 10); g.fillStyle = '#1e1612'; g.fill(); g.restore(); } g.restore();
      rr(g, E.W * 0.08, gy - 640, 150, 190, 8); g.fillStyle = '#efe6d4'; g.fill(); g.fillStyle = '#d8442a'; g.fillRect(E.W * 0.08, gy - 640, 150, 40); text(g, String(o.day ?? 1), E.W * 0.08 + 75, gy - 530, { size: 80, font: 'Nunito', weight: 900, color: '#2a1a14' });
      g.fillStyle = shade(M.wall, -0.4); g.fillRect(-E.W * 0.2, gy - 420, E.W * 0.36, 14); for (let k = 0; k < 7; k++) { g.fillStyle = ['#8a3a2a', '#3a5a7a', '#c8a050', '#4a6a3a'][k % 4]; g.fillRect(-E.W * 0.15 + k * 46, gy - 500, 34, 80); }
    }
    if (kind === 'hospital') { rr(g, E.W * 0.06, gy - 640, 380, 90, 10); g.fillStyle = '#1a3a44'; g.fill(); text(g, 'BILLING', E.W * 0.06 + 190, gy - 595, { size: 46, weight: 700, color: '#cfeef4', spacing: 8 }); circle(g, E.W * 0.06 + 40, gy - 595, 22, '#e04a3a'); seg(g, [[E.W * 0.06 + 28, gy - 595], [E.W * 0.06 + 52, gy - 595]], 7, '#fff'); seg(g, [[E.W * 0.06 + 40, gy - 607], [E.W * 0.06 + 40, gy - 583]], 7, '#fff');
      for (let k = 0; k < 3; k++) { g.fillStyle = 'rgba(200,240,255,.9)'; g.fillRect(-E.W * 0.3 + k * 700, gy - 820, 300, 12); glow(g, -E.W * 0.3 + k * 700 + 150, gy - 814, 200, '#cfeeff', 0.2); } }
    if (kind === 'bank') { rr(g, E.W * 0.05, gy - 660, 420, 100, 10); g.fillStyle = '#0e2a30'; g.fill(); text(g, 'LOANS', E.W * 0.05 + 210, gy - 610, { size: 54, weight: 700, color: '#bfeef4', spacing: 10 });
      FX.clock(g, E.W * 0.82, gy - 640, 60, t * 40, { speed: 1 }); }
    if (kind === 'bakery') { for (let s2 = 0; s2 < 3; s2++) { g.fillStyle = shade(M.wall, -0.35); g.fillRect(-E.W * 0.25, gy - 600 + s2 * 140, E.W * 0.55, 12); for (let k = 0; k < 8; k++) { g.fillStyle = '#c8823a'; g.beginPath(); g.ellipse(-E.W * 0.22 + k * 120, gy - 618 + s2 * 140, 48, 22, 0, Math.PI, 0); g.fill(); seg(g, [[-E.W * 0.22 + k * 120 - 20, gy - 628 + s2 * 140], [-E.W * 0.22 + k * 120 + 20, gy - 628 + s2 * 140]], 3, '#8a4a1a'); } }
      rr(g, E.W * 0.5 - 200, gy - 760, 400, 80, 12); g.fillStyle = '#3a1a10'; g.fill(); text(g, 'FRESH BREAD', E.W * 0.5, gy - 720, { size: 44, weight: 700, color: '#ffd08a', glow: 14, glowColor: alpha(EMBER, 0.8), spacing: 4 }); }
    if (kind === 'classroom') { rr(g, E.W * 0.02, gy - 680, 760, 400, 10); g.fillStyle = '#1e3a2a'; g.fill(); g.strokeStyle = '#6a4a2a'; g.lineWidth = 14; g.stroke(); if (o.board) o.board(g, E.W * 0.02, gy - 680, 760, 400); }
    if (kind === 'showroom') { for (let k = 0; k < 3; k++) { glow(g, E.W * (0.2 + k * 0.3), gy - 700, 300, '#ffe0b0', 0.25); seg(g, [[E.W * (0.2 + k * 0.3), -E.H], [E.W * (0.2 + k * 0.3), gy - 720]], 3, '#1a1210'); circle(g, E.W * (0.2 + k * 0.3), gy - 712, 16, '#ffe8c0'); } }
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, gy, 0, gy + 500, [shade(M.floor, 0.06), shade(M.dark, -0.3)]); g.fillRect(-E.W, gy, E.W * 3, E.H * 2);
    if (kind === 'hospital' || kind === 'bank') { FX.floorLines(g, gy, gy + 400, 'rgba(255,255,255,.04)'); }
  });
  return { M, GY: gy, CX: E.W / 2 };
}
// a desk / counter in front (depth ~1)
export function desk(g, x, gy, w, h, M, o = {}) {
  const { top = shade(M.wall, 0.05), front = shade(M.wall, -0.35) } = o;
  g.fillStyle = front; g.fillRect(x, gy - h, w, h); g.fillStyle = top; g.fillRect(x - 10, gy - h - 14, w + 20, 16); g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x - 10, gy - h - 14, w + 20, 3);
}
// Delhi rooftops (dusk/dawn): water tanks, dishes, kites, string lights, parapet
export function rooftops(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), gy = GY();
  layer(g, cam, 0.08, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * (o.sunX ?? 0.6), gy - (o.sunY ?? 260), o.sunR ?? 80, '#fff2d6', M.key, 7); });
  layer(g, cam, 0.2, (g) => { FX.godRays(g, E.W * (o.sunX ?? 0.6), gy - (o.sunY ?? 260), { count: 9, len: 1800, color: M.key, a: 0.06, t }); FX.fog(g, gy - 300, 260, M.fog, 0.25); });
  for (const [d, yo, col, sd] of [[0.3, -170, -0.55, 3], [0.45, -90, -0.45, 9], [0.62, -20, -0.38, 13]]) layer(g, cam, d, (g) => {
    const r = rng(sd); let x = -E.W * 0.8; while (x < E.W * 1.8) { const w = 220 + r() * 300, h = 120 + r() * 220; g.fillStyle = shade(M.wall, col); g.fillRect(x, gy + yo - h, w, h + 600);
      if (r() < 0.8) { rr(g, x + r() * (w - 70), gy + yo - h - 60, 64, 60, 8); g.fillStyle = shade(M.wall, col - 0.15); g.fill(); }
      if (r() < 0.4) { g.save(); g.translate(x + w * 0.7, gy + yo - h - 30); g.rotate(-0.5); g.beginPath(); g.ellipse(0, 0, 26, 16, 0, 0, 7); g.fillStyle = shade(M.wall, col - 0.1); g.fill(); g.restore(); }
      for (let k = 0; k < 3; k++) if (r() < 0.5) { const wx = x + 20 + k * w / 3; g.fillStyle = alpha(M.practical, 0.7); g.fillRect(wx, gy + yo - h + 40, 30, 40); }
      x += w + 10 + r() * 40; } });
  // kites
  layer(g, cam, 0.35, (g) => { const r = rng(4); for (let i = 0; i < (o.kites ?? 6); i++) { const kx = r() * E.W, ky = 80 + r() * 300, sw = Math.sin(t * 1.4 + i) * 0.2; g.save(); g.translate(kx + Math.sin(t * 0.7 + i) * 20, ky + Math.cos(t * 0.9 + i) * 12); g.rotate(sw); poly(g, [[0, -26], [20, 0], [0, 30], [-20, 0]], ['#d8442a', '#e8c21a', '#3a8ac8', '#3fb950', '#d84a9a'][i % 5]); seg(g, [[0, 30], [10 + Math.sin(t * 3 + i) * 8, 60], [0, 90]], 2, 'rgba(255,255,255,.4)'); g.restore(); } });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, gy, 0, gy + 400, [shade(M.floor, 0.1), shade(M.dark, -0.4)]); g.fillRect(-E.W, gy, E.W * 3, E.H * 2);
    if (o.lights !== false) for (let i = 0; i < 40; i++) { const lx = -E.W * 0.3 + i * 70, ly = gy - 420 + 60 * Math.sin((i / 40) * Math.PI * 2) ** 2; glow(g, lx, ly, 22, '#ffd59a', 0.6 + 0.4 * Math.sin(t * 2 + i)); circle(g, lx, ly, 4, '#fff2d0'); }
  });
  return { M, GY: gy };
}
// ---------- 1932: sepia Alpine town ----------
export const SEP = { sky: ['#3a2e22', '#8a7050', '#d8bc8a'], far: '#7a6448', mid: '#5a4632', wall: '#6a5440', dark: '#2a2018', light: '#f0dcae', floor: '#4a3a2a' };
export function oldtown(g, t, cam, o = {}) {
  const gy = GY(), C = SEP;
  layer(g, cam, 0.08, (g) => { backdrop(g, C.sky); glow(g, E.W * 0.7, gy - 520, 500, '#f6e2b0', 0.25); });
  layer(g, cam, 0.15, (g) => { g.fillStyle = shade(C.far, 0.15); g.beginPath(); g.moveTo(-E.W, gy); [[-E.W, gy - 300], [-300, gy - 640], [100, gy - 380], [520, gy - 720], [900, gy - 420], [1300, gy - 680], [1800, gy - 360], [2400, gy - 600], [3000, gy - 200], [3000, gy]].forEach((p) => g.lineTo(...p)); g.fill();
    g.fillStyle = 'rgba(250,240,220,.55)'; [[-300, gy - 640], [520, gy - 720], [1300, gy - 680]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x, y); g.lineTo(x - 70, y + 90); g.lineTo(x - 20, y + 70); g.lineTo(x + 20, y + 100); g.lineTo(x + 80, y + 80); g.closePath(); g.fill(); }); });
  layer(g, cam, 0.3, (g) => { FX.hills(g, { y: gy - 140, amp: 160, color: C.far, seed: 3 }); FX.fog(g, gy - 300, 260, '#d8c49a', 0.3); });
  layer(g, cam, 0.5, (g) => {
    const r = rng(5); let x = -E.W * 0.6, i = 0;
    while (x < E.W * 1.6) { const w = 260 + r() * 140, h = 300 + r() * 160, c = shade(C.wall, -0.1 + r() * 0.2);
      if (i === 4 && o.church !== false) { // church with onion dome
        g.fillStyle = shade(C.wall, 0.08); g.fillRect(x, gy - 420, 260, 420); g.fillRect(x + 80, gy - 760, 100, 360); g.beginPath(); g.ellipse(x + 130, gy - 800, 64, 70, 0, 0, 7); g.fill(); seg(g, [[x + 130, gy - 870], [x + 130, gy - 940]], 6, shade(C.wall, 0.08)); seg(g, [[x + 112, gy - 915], [x + 148, gy - 915]], 6, shade(C.wall, 0.08));
        circle(g, x + 130, gy - 640, 34, C.light); ring(g, x + 130, gy - 640, 34, 4, C.dark); seg(g, [[x + 130, gy - 640], [x + 130, gy - 662]], 3, C.dark); seg(g, [[x + 130, gy - 640], [x + 146, gy - 640]], 3, C.dark);
        x += 300; i++; continue; }
      g.fillStyle = c; g.fillRect(x, gy - h, w, h); poly(g, [[x - 20, gy - h], [x + w / 2, gy - h - 150], [x + w + 20, gy - h]], shade(c, -0.35));
      for (let fy = gy - h + 50; fy < gy - 140; fy += 110) for (let k = 0; k < 3; k++) { const on = r() < 0.4; g.fillStyle = on ? alpha(C.light, 0.85) : shade(c, -0.4); g.fillRect(x + 30 + k * (w - 60) / 3, fy, 44, 64); g.fillStyle = shade(c, -0.3); g.fillRect(x + 22 + k * (w - 60) / 3, fy + 64, 60, 8); }
      g.fillStyle = shade(c, -0.45); g.fillRect(x + w / 2 - 40, gy - 130, 80, 130);
      x += w + 20; i++; }
    if (o.sign) { rr(g, E.W * 0.36, gy - 610, 520, 70, 6); g.fillStyle = shade(C.dark, 0.1); g.fill(); text(g, o.sign, E.W * 0.36 + 260, gy - 575, { size: 40, font: 'Playfair Display', weight: 900, color: C.light, spacing: 6 }); }
  });
  layer(g, cam, 0.88, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 400, [shade(C.floor, 0.1), shade(C.dark, -0.3)]); g.fillRect(-E.W, gy, E.W * 3, E.H * 2);
    for (let yy = gy + 20; yy < E.H + 200; yy += 34) for (let xx = -E.W + ((yy / 34) % 2) * 30; xx < E.W * 2; xx += 60) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(xx, yy, 50, 4); } });
  return { C, GY: gy };
}
// sepia film look on top of the frame (k 0..1)
export function sepiaFilm(g, t, k = 1) {
  if (k <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const W = g.canvas.width, H = g.canvas.height;
  g.globalCompositeOperation = 'color'; g.fillStyle = `rgba(150,112,70,${0.9 * k})`; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'multiply'; g.fillStyle = `rgba(255,236,200,${0.5 * k})`; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'source-over'; const fl = 0.05 * k * (0.5 + 0.5 * Math.sin(t * 37) * Math.sin(t * 13)); g.fillStyle = `rgba(0,0,0,${fl})`; g.fillRect(0, 0, W, H);
  const r = rng(Math.floor(t * 12)); g.strokeStyle = `rgba(30,20,10,${0.35 * k})`; g.lineWidth = 1.5 * W / 1920;
  for (let i = 0; i < 3; i++) { const x = r() * W; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (r() - 0.5) * 30, H); g.stroke(); }
  for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '20,14,8' : '250,240,220'},${0.5 * k})`; g.beginPath(); g.arc(r() * W, r() * H, (0.8 + r() * 2.4) * W / 1920, 0, 7); g.fill(); }
  const vg = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(20,12,4,${0.6 * k})`); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  g.restore();
}
