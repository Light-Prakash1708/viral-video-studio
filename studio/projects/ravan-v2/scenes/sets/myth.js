// sets/myth.js: 2D painted-silhouette kit for the Ravana film. Regal ten-crowned silhouette (rim-lit gold),
// glowing arrow, bow, effigy, flames, embers, fireworks, Kailash, glyph ornament lines, mandala, palace skylines.
import { E, V, rng, noise, clamp, lerp, ease, prog, glow, alpha, shade, mix, linGrad, radGrad, circle, seg, poly, rr, text } from '/engine/core.js';

export const C = { gold: '#ffc45a', goldL: '#ffe2a0', saff: '#ff9a2a', fire: '#ff6a1a', indigo: '#0b0f3a', teal: '#1a6a78', cream: '#fff1d8', ink: '#05060c' };

// full-stage sky gradient (+ optional stars / horizon glow)
export function sky(g, cols, o = {}) {
  g.fillStyle = linGrad(g, 0, -E.H * 0.2, 0, E.H * (o.bottom ?? 1), cols); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  if (o.stars) { const r = rng(o.seed || 9); for (let i = 0; i < o.stars; i++) { const x = r() * E.W * 1.4 - E.W * 0.2, y = r() * E.H * (o.starH ?? 0.6), s = r(); circle(g, x, y, 0.6 + s * 1.7, alpha('#ffffff', (0.2 + 0.6 * s) * (0.7 + 0.3 * Math.sin((o.t || 0) * 2 + i)))); } }
  if (o.horizon) glow(g, E.W * (o.hx ?? 0.5), E.H * o.horizon, E.W * 0.8, o.hcol || C.saff, o.ha ?? 0.35);
}
// ---- Ravana: a regal silhouette. x,y = feet; o: { rim, dir:[dx,dy], lit:[10], kneel, t, staff, glowA, crownGold }
const HEADS = (() => { const out = [{ x: 0, y: -402, r: 31, main: true }]; for (let i = 1; i <= 4; i++) out.push({ x: -50 * i, y: -398 + i * i * 2.2, r: 27 - i * 0.6 }); for (let i = 1; i <= 5; i++) out.push({ x: 50 * i, y: -398 + i * i * 2.2, r: 27 - i * 0.6 }); return out; })();
export const headXY = (i) => [HEADS[i].x + 0, HEADS[i].y];
function crownPath(g, h) {
  const r = h.r, tall = h.main ? 3.1 : 2.4; g.moveTo(h.x - r * 0.95, h.y - r * 0.35);
  g.lineTo(h.x - r * 0.85, h.y - r * 1.05); g.lineTo(h.x - r * 0.55, h.y - r * 1.25); g.lineTo(h.x - r * 0.35, h.y - r * tall * 0.78); g.lineTo(h.x, h.y - r * tall);
  g.lineTo(h.x + r * 0.35, h.y - r * tall * 0.78); g.lineTo(h.x + r * 0.55, h.y - r * 1.25); g.lineTo(h.x + r * 0.85, h.y - r * 1.05); g.lineTo(h.x + r * 0.95, h.y - r * 0.35); g.closePath();
}
function ravanaShape(g, t, o, fill) {
  const w = Math.sin(t * 1.3) * 6; g.fillStyle = fill;
  const P = (fn) => { g.beginPath(); fn(); g.fill(); };
  // cape (flares, gentle wind)
  P(() => { g.moveTo(-96, -352); g.bezierCurveTo(-140, -250, -175, -120, -205 - w, 0); g.lineTo(-120, -8 + w * 0.5); g.lineTo(-40, 4); g.lineTo(40, -4); g.lineTo(130, 6 - w * 0.5); g.lineTo(200 + w, 0); g.bezierCurveTo(170, -120, 140, -250, 96, -352); g.closePath(); });
  // torso + shoulders (broad, armoured pauldrons)
  P(() => { g.moveTo(-112, -350); g.quadraticCurveTo(-120, -382, -78, -386); g.lineTo(78, -386); g.quadraticCurveTo(120, -382, 112, -350); g.lineTo(70, -200); g.lineTo(-70, -200); g.closePath(); });
  P(() => { g.moveTo(-58, -205); g.lineTo(-62, -10); g.lineTo(-92, 0); g.lineTo(-24, 0); g.lineTo(-18, -190); g.lineTo(18, -190); g.lineTo(24, 0); g.lineTo(92, 0); g.lineTo(62, -10); g.lineTo(58, -205); g.closePath(); });
  P(() => { g.moveTo(-110, -360); g.lineTo(-138, -250); g.lineTo(-128, -170); g.lineTo(-108, -172); g.lineTo(-112, -250); g.lineTo(-86, -330); g.closePath(); });
  P(() => { g.moveTo(110, -360); g.lineTo(150, -280); g.lineTo(158, -230); g.lineTo(140, -226); g.lineTo(128, -276); g.lineTo(88, -330); g.closePath(); });
  for (const h of HEADS) { P(() => g.arc(h.x, h.y, h.r, 0, Math.PI * 2)); P(() => g.rect(h.x - h.r * 0.42, h.y, h.r * 0.84, -h.y - 380)); P(() => crownPath(g, h)); }
  P(() => { g.moveTo(-250, -384); g.quadraticCurveTo(0, -360, 250, -384); g.lineTo(250, -372); g.quadraticCurveTo(0, -340, -250, -372); g.closePath(); });
  if (o.staff !== false) { P(() => g.rect(146, -560, 9, 560)); P(() => { g.moveTo(150, -610); g.lineTo(168, -560); g.lineTo(150, -548); g.lineTo(132, -560); g.closePath(); }); }
  P(() => { g.moveTo(-122, -175); g.lineTo(-114, -175); g.lineTo(-112, -30); g.lineTo(-118, -10); g.lineTo(-124, -30); g.closePath(); });
}
export function ravana(g, x, y, s, o = {}) {
  const { t = 0, rim = C.gold, dir = [-0.7, -0.6], rw = 5, alpha: a = 1, lit = null, glowA = 0.35, ink = C.ink, crownGold = 0.7 } = o;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s * (1 - 0.18 * (o.kneel || 0)));
  if (glowA > 0) glow(g, 0, -330, 520, rim, glowA * 0.5);
  // rim: silhouette offset toward the light, then the ink body on top
  g.save(); g.translate(dir[0] * rw / s * 1.6, dir[1] * rw / s * 1.6); ravanaShape(g, t, o, rim); g.restore();
  ravanaShape(g, t, o, ink);
  // regalia: gold crown filigree and jewels, a breastplate glint
  g.save(); g.globalAlpha *= crownGold;
  HEADS.forEach((h, i) => { g.beginPath(); crownPath(g, h); g.strokeStyle = alpha(rim, 0.55); g.lineWidth = 2.2 / s; g.stroke();
    const L = lit ? (lit[i] ?? 0) : 0; seg(g, [[h.x - h.r * 0.9, h.y - h.r * 0.42], [h.x + h.r * 0.9, h.y - h.r * 0.42]], 3.5 / s, alpha(rim, 0.7 + 0.3 * L));
    circle(g, h.x, h.y - h.r * (h.main ? 1.7 : 1.35), (h.main ? 5 : 3.5) * (1 + L), alpha(mix(rim, '#ffffff', 0.4), 0.8 + 0.2 * L));
    if (L > 0) { glow(g, h.x, h.y - h.r * 0.6, h.r * 4.2, rim, 0.55 * L); g.beginPath(); crownPath(g, h); g.fillStyle = alpha(rim, 0.55 * L); g.fill(); } });
  g.beginPath(); g.moveTo(-60, -330); g.quadraticCurveTo(0, -300, 60, -330); g.strokeStyle = alpha(rim, 0.45); g.lineWidth = 3 / s; g.stroke();
  g.restore(); g.restore();
}
// ---- glowing arrow (tip at x,y, pointing along ang); trail streak behind it
export function arrow(g, x, y, ang, o = {}) {
  const { len = 260, color = '#fff2c8', glowC = C.gold, a = 1, trail = 600, w = 6 } = o; if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(ang);
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, -trail - len, 0, -len * 0.3, 0, [alpha(glowC, 0), alpha(glowC, 0.55)]); g.beginPath(); g.moveTo(-trail - len, 0); g.lineTo(-len * 0.3, -w * 2.4); g.lineTo(-len * 0.3, w * 2.4); g.closePath(); g.fill(); g.restore();
  glow(g, -len * 0.4, 0, len * 0.9, glowC, 0.35); glow(g, 0, 0, 70, '#ffffff', 0.6);
  seg(g, [[-len, 0], [-14, 0]], w, color);
  poly(g, [[16, 0], [-22, -14], [-14, 0], [-22, 14]], '#ffffff');
  for (const sgn of [-1, 1]) poly(g, [[-len + 4, 0], [-len - 30, sgn * 18], [-len - 8, sgn * 2]], alpha(color, 0.9));
  g.restore();
}
// ---- bow silhouette held upright, rim-lit
export function bow(g, x, y, s, o = {}) {
  const { rim = C.goldL, a = 1, draw = 0 } = o; g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s);
  const B = (off) => { g.beginPath(); g.moveTo(0 + off, -300); g.bezierCurveTo(150 + off, -220, 150 + off, 220, 0 + off, 300); g.lineWidth = 22; g.lineCap = 'round'; g.stroke(); };
  g.strokeStyle = rim; B(-5); g.strokeStyle = C.ink; B(0);
  seg(g, [[0, -300], [-draw * 120, 0], [0, 300]], 3, alpha(C.goldL, 0.8));
  g.restore();
}
// ---- flames: layered noisy tongues rising from a base (cx, base y, width, height, k 0..1)
export function flames(g, t, cx, by, w, h, k = 1, o = {}) {
  if (k <= 0) return; const { seed = 3, n = 26 } = o; const r = rng(seed);
  g.save(); g.globalCompositeOperation = 'lighter';
  glow(g, cx, by - h * 0.4, Math.max(w, h) * 0.9, '#ff6a1a', 0.35 * k);
  for (let i = 0; i < n; i++) {
    const u = r(), x0 = cx + (u - 0.5) * w, hh = h * k * (0.45 + 0.55 * r()) * (0.8 + 0.25 * noise(t * 2.2 + i, seed)), ww = w * (0.08 + 0.1 * r());
    const sway = noise(t * 1.6 + i * 3, seed + 1) * ww * 0.9, col = [C.fire, '#ff8a2a', '#ffb24a', '#ffd88a'][i % 4];
    g.fillStyle = linGrad(g, 0, by, 0, by - hh, [alpha(col, 0.75), alpha(col, 0.35), alpha(col, 0)]);
    g.beginPath(); g.moveTo(x0 - ww, by); g.quadraticCurveTo(x0 - ww * 0.8 + sway * 0.5, by - hh * 0.5, x0 + sway, by - hh); g.quadraticCurveTo(x0 + ww * 0.8 + sway * 0.5, by - hh * 0.5, x0 + ww, by); g.closePath(); g.fill();
  }
  g.restore();
}
// ---- embers rising (area [x,y,w,h]); k = amount
export function embers(g, t, o = {}) {
  const { seed = 5, count = 90, area = [0, 0, E.W, E.H], k = 1, color = '#ffb050', speed = 60, size = 3 } = o; if (k <= 0) return; const r = rng(seed);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < count; i++) { const sp = speed * (0.5 + r()), ph = r() * 6.28, life = (t * sp / area[3] + r()) % 1, x = area[0] + r() * area[2] + Math.sin(t * 1.3 + ph) * 30 + life * 60 * (r() - 0.3), y = area[1] + area[3] * (1 - life);
    const s = size * (0.5 + r()) * (1 - life * 0.6), al = k * Math.sin(life * Math.PI) * (0.6 + 0.4 * Math.sin(t * 9 + ph));
    glow(g, x, y, s * 4, color, al * 0.5); circle(g, x, y, s * 0.6, alpha('#fff0c8', al)); }
  g.restore();
}
// ---- fireworks: burst list [{x,y,at,col,r}] at shot time t
export function fireworks(g, t, bursts) {
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [bi, b] of bursts.entries()) { const dt = t - b.at; if (dt < -0.6 || dt > 2.4) continue;
    if (dt < 0) { const k = 1 + dt / 0.6; const yy = lerp(E.H * 1.05, b.y, ease.out(k)); circle(g, b.x, yy, 3, '#fff0c8'); seg(g, [[b.x, yy], [b.x, yy + 60]], 2, alpha(b.col, 0.5)); continue; }
    const r = rng(bi * 7 + 3), n = 54, R = (b.r || 220) * ease.out(clamp(dt / 1.1)), fade = clamp(1 - dt / 2.4);
    if (dt < 0.25) glow(g, b.x, b.y, 260, b.col, 0.5 * (1 - dt / 0.25));
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + r() * 0.1, rr2 = R * (0.75 + 0.25 * r()), x = b.x + Math.cos(a) * rr2, y = b.y + Math.sin(a) * rr2 + dt * dt * 40;
      const x2 = b.x + Math.cos(a) * rr2 * 0.82, y2 = b.y + Math.sin(a) * rr2 * 0.82 + dt * dt * 38; seg(g, [[x2, y2], [x, y]], 2.4, alpha(b.col, fade * 0.8)); circle(g, x, y, 2.6, alpha('#fff4dc', fade)); }
  }
  g.restore();
}
// ---- Mount Kailash silhouette with snow ridges (moonlit). x,y = base centre
export function kailash(g, x, y, s, o = {}) {
  const { rim = '#cfe0ff', snow = '#dfe8ff', lift = 0 } = o; g.save(); g.translate(x, y - lift); g.scale(s, s);
  const P = [[-760, 0], [-430, -240], [-300, -300], [-160, -470], [0, -560], [150, -480], [290, -330], [430, -250], [760, 0]];
  g.fillStyle = linGrad(g, 0, -560, 0, 0, ['#2a3050', '#10142a']); g.beginPath(); P.forEach((p, i) => (i ? g.lineTo(...p) : g.moveTo(...p))); g.closePath(); g.fill();
  // snow cap + ridge lines (Kailash's famous faceted pyramid)
  g.fillStyle = alpha(snow, 0.85); g.beginPath(); g.moveTo(-160, -470); g.lineTo(0, -560); g.lineTo(150, -480); g.lineTo(90, -430); g.lineTo(40, -470); g.lineTo(0, -420); g.lineTo(-60, -460); g.lineTo(-110, -420); g.closePath(); g.fill();
  for (let i = 0; i < 6; i++) seg(g, [[-20 + i * 8, -540 + i * 18], [-60 + i * 30, -300 + i * 30]], 3, alpha(snow, 0.25));
  g.strokeStyle = alpha(rim, 0.7); g.lineWidth = 3; g.beginPath(); P.slice(1, -1).forEach((p, i) => (i ? g.lineTo(...p) : g.moveTo(...p))); g.stroke();
  g.restore();
}
// ---- abstract Sanskrit-style glyph ornament rows (not real text): top bar + hanging loops, writing on with p
export function glyphRows(g, t, o = {}) {
  const { x = E.W * 0.12, y = E.H * 0.3, w = E.W * 0.76, rows = 4, gap = 120, p = 1, color = C.gold, seed = 11, size = 46 } = o; const r = rng(seed);
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  for (let j = 0; j < rows; j++) { const yy = y + j * gap, rp = clamp(p * rows - j); if (rp <= 0) break; const xe = x + w * rp;
    g.save(); g.shadowColor = alpha(color, 0.9); g.shadowBlur = 16; g.strokeStyle = alpha(color, 0.95); g.lineWidth = 4.5;
    let xx = x; g.beginPath();
    while (xx < x + w - size) { const cw = size * (0.8 + r() * 0.9); if (xx + cw > xe) break;
      g.moveTo(xx, yy); g.lineTo(xx + cw, yy);                       // shirorekha-like top bar
      const v = Math.floor(r() * 4), mx = xx + cw * (0.3 + r() * 0.4);
      g.moveTo(mx, yy); if (v === 0) { g.lineTo(mx, yy + size); } else if (v === 1) { g.moveTo(xx + cw * 0.2, yy); g.bezierCurveTo(xx - cw * 0.1, yy + size * 0.6, xx + cw * 0.9, yy + size * 0.5, xx + cw * 0.5, yy + size * 0.95); }
      else if (v === 2) { g.arc(mx, yy + size * 0.45, size * 0.28, -Math.PI / 2, Math.PI * 1.3); g.moveTo(xx + cw * 0.85, yy); g.lineTo(xx + cw * 0.85, yy + size); } else { g.moveTo(xx + cw * 0.15, yy + size * 0.3); g.quadraticCurveTo(xx + cw * 0.6, yy + size * 0.1, xx + cw * 0.5, yy + size * 0.6); g.quadraticCurveTo(xx + cw * 0.3, yy + size, xx + cw * 0.8, yy + size * 0.9); g.moveTo(xx + cw * 0.85, yy); g.lineTo(xx + cw * 0.85, yy + size); }
      if (r() < 0.25) { g.moveTo(mx + 6, yy - size * 0.35); g.quadraticCurveTo(mx + size * 0.4, yy - size * 0.6, mx + size * 0.2, yy - 4); }
      xx += cw + size * 0.12 + (r() < 0.18 ? size * 0.5 : 0); }
    g.stroke(); g.restore();
    glow(g, xe, yy + size * 0.3, 60, '#ffffff', rp < 1 ? 0.5 : 0);
  }
  g.restore();
}
// ---- mandala ornament (rotating rings of petals and dots)
export function mandala(g, x, y, R, t, o = {}) {
  const { color = C.gold, a = 1, rings = 5 } = o; if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y);
  for (let k = 0; k < rings; k++) { const rr2 = R * (0.25 + k * 0.17), n = 8 + k * 4; g.save(); g.rotate(t * (k % 2 ? -0.08 : 0.1) * (1 + k * 0.2));
    g.strokeStyle = alpha(color, 0.5 - k * 0.06); g.lineWidth = 2.5; g.beginPath(); g.arc(0, 0, rr2, 0, 7); g.stroke();
    for (let i = 0; i < n; i++) { g.rotate((Math.PI * 2) / n); g.beginPath(); g.moveTo(rr2, 0); g.quadraticCurveTo(rr2 + R * 0.08, -R * 0.05, rr2 + R * 0.14, 0); g.quadraticCurveTo(rr2 + R * 0.08, R * 0.05, rr2, 0); g.stroke(); circle(g, rr2 + R * 0.17, 0, 2.5, alpha(color, 0.6)); }
    g.restore(); }
  g.restore();
}
// ---- ancient palace / temple skyline silhouette (shikharas and gopurams). baseline y
export function palaceSkyline(g, y, o = {}) {
  const { color = '#0a0a14', seed = 4, x0 = -E.W * 0.2, x1 = E.W * 1.2, scale = 1, rim = null, lamps = 0, t = 0 } = o; const r = rng(seed);
  let x = x0; const lampPts = [];
  g.fillStyle = color; g.beginPath(); g.moveTo(x0, y + 400);
  while (x < x1) { const w = (60 + r() * 130) * scale, h = (60 + r() * 220) * scale, kind = r();
    g.lineTo(x, y);
    if (kind < 0.45) { const tiers = 3 + Math.floor(r() * 4); for (let i = 0; i < tiers; i++) { const k = i / tiers, k2 = (i + 1) / tiers; g.lineTo(x + w * 0.08 * (i + 1) / tiers * 3, y - h * k - 6); g.lineTo(x + w * 0.08 * (i + 1) / tiers * 3, y - h * k2); }
      g.lineTo(x + w * 0.5, y - h - 26 * scale); g.lineTo(x + w * (1 - 0.24), y - h); for (let i = tiers - 1; i >= 0; i--) { const k = i / tiers; g.lineTo(x + w * (1 - 0.08 * (i + 1) / tiers * 3), y - h * k - 6); } }
    else if (kind < 0.8) { g.lineTo(x, y - h * 0.5); g.quadraticCurveTo(x + w * 0.5, y - h * 1.1, x + w, y - h * 0.5); }
    else { g.lineTo(x, y - h * 0.3); g.lineTo(x + w, y - h * 0.3); }
    if (lamps && r() < 0.8) lampPts.push([x + w * 0.5, y - h * 0.25]);
    g.lineTo(x + w, y); x += w + r() * 20 * scale; }
  g.lineTo(x1, y + 400); g.closePath(); g.fill();
  if (rim) { g.strokeStyle = rim; g.lineWidth = 2; g.stroke(); }
  for (const [i, [lx, ly]] of lampPts.entries()) { const f = 0.7 + 0.3 * Math.sin(t * 7 + i * 2); glow(g, lx, ly, 26 * scale, '#ffa040', 0.7 * lamps * f); circle(g, lx, ly, 2.5 * scale, alpha('#ffe0a0', lamps)); }
}
// ---- the Dussehra effigy in 2D: patterned skirt, torso, arms, ten painted heads, crown. x,y = feet
export function effigy(g, x, y, s, o = {}) {
  const { burn = 0, t = 0, xray = 0 } = o; g.save(); g.translate(x, y); g.scale(s, s);
  const dim = 1 - burn * 0.6;
  // bamboo frame legs
  seg(g, [[-60, 0], [-40, -180]], 12, '#3a2a18'); seg(g, [[60, 0], [40, -180]], 12, '#3a2a18');
  // skirt with bands
  const sk = [[-150, -170], [150, -170], [70, -420], [-70, -420]]; poly(g, sk, mix('#b8402a', '#200808', 1 - dim));
  for (let i = 0; i < 5; i++) { const k = i / 5; const yy = lerp(-180, -410, k), hw = lerp(146, 72, k); seg(g, [[-hw, yy], [hw, yy]], 9, alpha(mix('#ffc45a', '#3a1a08', 1 - dim), 0.9)); }
  for (let i = -3; i <= 3; i++) seg(g, [[i * 40, -175], [i * 18, -415]], 3, alpha('#1a0a04', 0.35));
  // torso + arms
  poly(g, [[-80, -420], [80, -420], [95, -560], [-95, -560]], mix('#2a6a4a', '#081408', 1 - dim));
  seg(g, [[-95, -550], [-170, -440], [-190, -330]], 26, mix('#2a6a4a', '#081408', 1 - dim)); seg(g, [[95, -550], [170, -440], [190, -330]], 26, mix('#2a6a4a', '#081408', 1 - dim));
  poly(g, [[-30, -470], [30, -470], [0, -540]], alpha('#ffc45a', 0.7 * dim));
  // ten heads on a beam + crown
  seg(g, [[-250, -575], [250, -575]], 10, '#3a2a18');
  for (let i = -4; i <= 5; i++) { const hx = (i - 0.5) * 50, main = i === 0 || i === 1 ? 0 : 1, hh = main ? 58 : 70, hy = -600 - (main ? 0 : 6);
    rr(g, hx - 22, hy - hh / 2 - 6, 44, hh, 10); g.fillStyle = mix(i % 2 ? '#e8b070' : '#d8a060', '#1a0a04', 1 - dim); g.fill();
    seg(g, [[hx - 12, hy - 8], [hx - 3, hy - 6]], 4, '#1a0a04'); seg(g, [[hx + 3, hy - 6], [hx + 12, hy - 8]], 4, '#1a0a04');
    seg(g, [[hx - 12, hy + 10], [hx, hy + 6], [hx + 12, hy + 10]], 4, '#1a0a04'); circle(g, hx, hy - 16, 3, '#c8202a');
    poly(g, [[hx - 22, hy - hh / 2 - 4], [hx + 22, hy - hh / 2 - 4], [hx + 12, hy - hh / 2 - 34], [hx, hy - hh / 2 - 46], [hx - 12, hy - hh / 2 - 34]], mix('#ffc45a', '#2a1a08', 1 - dim)); }
  // x-ray: fireworks packed inside
  if (xray > 0) { g.save(); g.globalAlpha *= xray; poly(g, [[-150, -170], [150, -170], [95, -560], [-95, -560]], 'rgba(10,30,60,.82)');
    const r = rng(4); for (let i = 0; i < 26; i++) { const fx = (r() - 0.5) * 200 * (1 - (i / 26) * 0.4), fy = -190 - r() * 360; rr(g, fx - 7, fy - 22, 14, 44, 4); g.fillStyle = ['#ff4a3a', '#ffc45a', '#5fe8b0', '#7fb8ff'][i % 4]; g.fill(); seg(g, [[fx, fy - 22], [fx + 6, fy - 34]], 2, '#fff0c8'); glow(g, fx, fy, 40, '#ffb050', 0.25 * (0.6 + 0.4 * Math.sin(t * 8 + i))); }
    g.strokeStyle = 'rgba(160,220,255,.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-150, -170); g.lineTo(150, -170); g.lineTo(95, -560); g.lineTo(-95, -560); g.closePath(); g.stroke(); g.restore(); }
  g.restore();
  if (burn > 0) { flames(g, t, x, y - 160 * s, 360 * s, 720 * s, burn, { seed: 7, n: 34 }); }
}
// ---- standing human silhouettes (crowd heads & shoulders) along a baseline
export function crowdSil(g, t, y, o = {}) {
  const { seed = 3, count = 60, color = '#05060a', scale = 1, rim = null, cheer = 0, x0 = -40, x1 = E.W + 40 } = o; const r = rng(seed);
  for (let i = 0; i < count; i++) { const x = lerp(x0, x1, (i + r() * 0.8) / count), s = scale * (0.85 + r() * 0.35), bob = cheer * Math.max(0, Math.sin(t * 5 + i)) * 8 * s, hy = y - 120 * s - bob;
    if (rim) { circle(g, x - 2, hy - 2, 24 * s, rim); }
    g.fillStyle = color; g.beginPath(); g.ellipse(x, y - 30 * s - bob * 0.5, 46 * s, 90 * s, 0, Math.PI, 0); g.fill(); g.fillRect(x - 46 * s, y - 30 * s - bob * 0.5, 92 * s, 60 * s); circle(g, x, hy, 24 * s, color);
    if (cheer > 0.4 && r() < 0.35) seg(g, [[x + 30 * s, y - 90 * s - bob], [x + 52 * s, y - 190 * s - bob]], 14 * s, color); }
}
// ---- a forest of tree silhouettes (layer), for the clearing
export function treeLine(g, y, o = {}) {
  const { color = '#06100c', seed = 2, count = 14, h = 520, x0 = -E.W * 0.3, x1 = E.W * 1.3 } = o; const r = rng(seed); g.fillStyle = color;
  for (let i = 0; i < count; i++) { const x = lerp(x0, x1, (i + r() * 0.6) / count), th = h * (0.7 + r() * 0.5), tw = 18 + r() * 20; g.fillRect(x - tw / 2, y - th, tw, th + 200);
    for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(x + (r() - 0.5) * 200, y - th + (r() - 0.2) * 160, 90 + r() * 110, 60 + r() * 70, 0, 0, 7); g.fill(); } }
}
