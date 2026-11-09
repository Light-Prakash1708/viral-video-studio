// shots/09_v4.js: v4 rebuilds (user notes): Shiva Tandav dance, "No Dussehra" poster, the different story in class,
// the ten watching towers, the forbidden archive, Sita carried away in the flying chariot, and PRIDE.
import { E, registerShot, ease, prog, clamp, lerp, glow, alpha, text, veil, layer, blurLayer, rng, seg, circle, poly, linGrad, mix, rr, noise } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { drawFigure, POSES, breathe, posesAt } from '/engine/rig2d.js';
import { C, sky, ravana, flames, embers, glyphRows, mandala, treeLine, bow, arrow } from '../sets/myth.js';
import { local, topBand, headline, chip, drain } from '../sets/ui.js';

const W = E.W, H = E.H;
const atc = (info, t, w, fb) => { const x = local(info, t, w); return x == null || x < -0.2 || x > info.dur ? fb : x; };
const cine = (g, k = 1) => { const vg = g.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, W * 0.72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${0.55 * k})`); g.fillStyle = vg; g.fillRect(0, 0, W, H); };
const serif = (g, str, x, y, a, o = {}) => text(g, str, x, y, { align: o.align || 'center', size: o.size || 72, font: 'Playfair Display', weight: 900, italic: !!o.italic, color: o.color || '#fff2d8', alpha: a, glow: o.glow ?? 6, glowColor: o.glowColor || 'rgba(0,0,0,.85)', spacing: o.spacing ?? 2 });
const limb = (g, pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) g.lineTo(...pts[i]); g.stroke(); };

// ---------- a poster-style crowned head (gold face, curled moustache, tiered crown) ----------
function posterHead(g, x, y, r, o = {}) {
  const face = o.face || '#ffcc33', ink = o.ink || '#2a0e04', sneer = o.sneer ?? 0;
  g.save(); g.translate(x, y);
  // crown
  const cg = linGrad(g, 0, -r * 2.6, 0, -r * 0.6, ['#fff0a0', '#ffc93a', '#d8901a']);
  g.fillStyle = cg; g.beginPath(); g.moveTo(-r * 0.95, -r * 0.55); g.lineTo(-r * 0.9, -r * 1.1); g.quadraticCurveTo(-r * 0.6, -r * 1.25, -r * 0.55, -r * 1.6); g.quadraticCurveTo(-r * 0.25, -r * 1.7, -r * 0.2, -r * 2.2); g.lineTo(0, -r * 2.7); g.lineTo(r * 0.2, -r * 2.2); g.quadraticCurveTo(r * 0.25, -r * 1.7, r * 0.55, -r * 1.6); g.quadraticCurveTo(r * 0.6, -r * 1.25, r * 0.9, -r * 1.1); g.lineTo(r * 0.95, -r * 0.55); g.closePath(); g.fill();
  g.strokeStyle = alpha(ink, 0.6); g.lineWidth = r * 0.06; g.stroke();
  seg(g, [[-r * 0.9, -r * 1.05], [r * 0.9, -r * 1.05]], r * 0.08, alpha(ink, 0.5)); circle(g, 0, -r * 1.35, r * 0.16, o.gem || '#e0102a');
  // face
  g.fillStyle = face; g.beginPath(); g.ellipse(0, 0, r * 0.9, r * 1.05, 0, 0, 7); g.fill();
  g.fillStyle = alpha('#a86a10', 0.35); g.beginPath(); g.ellipse(r * 0.35, r * 0.1, r * 0.5, r * 0.95, 0, -1.4, 1.4); g.fill();
  // brows, eyes, tilak
  g.strokeStyle = ink; g.lineWidth = r * 0.13; g.lineCap = 'round'; g.beginPath(); g.moveTo(-r * 0.62, -r * 0.42); g.lineTo(-r * 0.15, -r * 0.25 + sneer * r * 0.05); g.moveTo(r * 0.62, -r * 0.42); g.lineTo(r * 0.15, -r * 0.25 + sneer * r * 0.05); g.stroke();
  for (const s of [-1, 1]) { g.fillStyle = '#fff8e8'; g.beginPath(); g.ellipse(s * r * 0.36, -r * 0.08, r * 0.2, r * 0.11, 0, 0, 7); g.fill(); circle(g, s * r * 0.33, -r * 0.07, r * 0.08, ink); }
  g.fillStyle = '#c8201a'; g.fillRect(-r * 0.06, -r * 0.75, r * 0.12, r * 0.38);
  // nose + curled moustache + mouth
  g.strokeStyle = alpha(ink, 0.7); g.lineWidth = r * 0.06; g.beginPath(); g.moveTo(0, -r * 0.05); g.lineTo(-r * 0.08, r * 0.3); g.lineTo(r * 0.06, r * 0.33); g.stroke();
  g.fillStyle = ink; g.beginPath(); g.moveTo(0, r * 0.45); g.bezierCurveTo(-r * 0.3, r * 0.3, -r * 0.75, r * 0.38, -r * 0.95, r * 0.12); g.bezierCurveTo(-r * 1.05, r * 0.0, -r * 1.12, r * 0.2, -r * 0.95, r * 0.3); g.bezierCurveTo(-r * 0.7, r * 0.62, -r * 0.25, r * 0.58, 0, r * 0.55);
  g.bezierCurveTo(r * 0.25, r * 0.58, r * 0.7, r * 0.62, r * 0.95, r * 0.3); g.bezierCurveTo(r * 1.12, r * 0.2, r * 1.05, r * 0.0, r * 0.95, r * 0.12); g.bezierCurveTo(r * 0.75, r * 0.38, r * 0.3, r * 0.3, 0, r * 0.45); g.fill();
  g.strokeStyle = '#9a1a10'; g.lineWidth = r * 0.08; g.beginPath(); g.moveTo(-r * 0.22, r * 0.72 - sneer * r * 0.06); g.quadraticCurveTo(0, r * 0.8 + sneer * r * 0.08, r * 0.24, r * 0.68 - sneer * r * 0.1); g.stroke();
  for (const s of [-1, 1]) circle(g, s * r * 0.92, r * 0.25, r * 0.12, '#ffd040');
  g.restore();
}
const tenHeads = (g, t, cx, cy, R0, o = {}) => { for (let i = 0; i < 10; i++) { const u = i / 9 - 0.5, main = i === 4 || i === 5; const x = cx + u * (o.spread ?? W * 0.78), y = cy + Math.abs(u) * (o.arc ?? 60) + Math.sin(t * 1.3 + i) * 4; const r = R0 * (main ? 1.12 : 1 - Math.abs(u) * 0.35);
  if (o.strings) seg(g, [[x, -20], [x, y - r * 2.6]], 3, alpha('#ffd040', 0.8)); posterHead(g, x, y, r, { sneer: o.sneer, face: o.face, gem: i % 3 ? '#e0102a' : '#10a060' }); } };
const halftone = (g, cx, cy, R, col, t = 0) => { g.fillStyle = col; for (let y = 0; y < H; y += 18) for (let x = (y / 18 % 2) * 9; x < W; x += 18) { const d = Math.hypot(x - cx, y - cy) / R; if (d > 1.15 || d < 0.45) continue; const s = 4.2 * clamp(1 - Math.abs(d - 0.85) * 2.2); if (s > 0.3) { g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); } } };

// ---------- q16 "The Shiva Tandav Stotram, still chanted today, is credited to him." Ravana's tandav between walls of fire
function tandav(g, t, x, y, s) {
  const sw = Math.sin(t * 1.6) * 0.04, skin = '#8a5434', rim = '#ffb060', ink = '#140806';
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(sw * 0.3);
  const body = (col, w0) => {
    limb(g, [[-6, -300], [-2, -150], [0, 0]], 46 + w0, col); // standing leg
    limb(g, [[16, -300], [120, -205], [20, -170]], 40 + w0, col); // tree-pose leg
    limb(g, [[-80, -515], [-128, -628], [-14, -735]], 34 + w0, col); limb(g, [[80, -515], [128, -628], [14, -735]], 34 + w0, col); // arms up, palms together
    g.fillStyle = col; g.beginPath(); g.moveTo(-58 - w0 / 2, -330); g.quadraticCurveTo(-70 - w0 / 2, -430, -92 - w0 / 2, -525); g.quadraticCurveTo(0, -560 - w0 / 2, 92 + w0 / 2, -525); g.quadraticCurveTo(70 + w0 / 2, -430, 58 + w0 / 2, -330); g.closePath(); g.fill();
    limb(g, [[0, -545], [0, -590]], 30 + w0, col); g.beginPath(); g.ellipse(0, -620, 40 + w0 / 2, 48 + w0 / 2, 0, 0, 7); g.fill(); };
  // long hair streaming in the fire wind (behind)
  const hw = Math.sin(t * 3) * 18; g.fillStyle = ink; g.beginPath(); g.moveTo(-36, -655); g.bezierCurveTo(60, -690, 160, -650 + hw, 290, -610 + hw * 1.6); g.bezierCurveTo(200, -600 + hw, 120, -590, 30, -560); g.closePath(); g.fill();
  g.save(); g.translate(-7, -5); body(rim, 10); g.restore(); body(skin, 0);
  // abdomen + chest shading
  g.strokeStyle = alpha('#3a1a0a', 0.45); g.lineWidth = 4; for (const yy of [-380, -410, -440]) { g.beginPath(); g.moveTo(-26, yy); g.lineTo(26, yy); g.stroke(); } g.beginPath(); g.moveTo(0, -470); g.lineTo(0, -350); g.stroke();
  g.beginPath(); g.moveTo(-60, -480); g.quadraticCurveTo(-30, -460, -4, -485); g.moveTo(60, -480); g.quadraticCurveTo(30, -460, 4, -485); g.stroke();
  // black dhoti + orange sash with a long fluttering tail
  g.fillStyle = '#16100e'; g.beginPath(); g.moveTo(-64, -340); g.lineTo(66, -340); g.lineTo(80, -280); g.lineTo(130, -215); g.lineTo(96, -190); g.lineTo(30, -250); g.lineTo(28, -190); g.lineTo(-40, -190); g.lineTo(-52, -260); g.closePath(); g.fill();
  const sf = (k) => Math.sin(t * 5 + k) * 22; g.fillStyle = '#e8601a'; g.beginPath(); g.moveTo(-66, -352); g.lineTo(68, -352); g.lineTo(70, -322); g.lineTo(-64, -322); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(60, -350); g.bezierCurveTo(140, -330 + sf(0), 220, -300 + sf(1), 330, -270 + sf(2)); g.lineTo(320, -232 + sf(2)); g.bezierCurveTo(210, -262 + sf(1), 130, -290 + sf(0), 56, -320); g.closePath(); g.fill();
  g.fillStyle = alpha('#ffb070', 0.5); g.fillRect(-66, -352, 134, 6);
  // face: beard, moustache, closed eyes, tripundra
  g.fillStyle = ink; g.beginPath(); g.moveTo(-36, -610); g.quadraticCurveTo(-40, -560, 0, -566); g.quadraticCurveTo(40, -560, 36, -610); g.quadraticCurveTo(0, -585, -36, -610); g.fill();
  g.fillStyle = ink; g.beginPath(); g.ellipse(0, -664, 44, 20, 0, Math.PI, 0); g.fill();
  g.strokeStyle = ink; g.lineWidth = 4; for (const s2 of [-1, 1]) { g.beginPath(); g.arc(s2 * 15, -626, 8, 0.2, Math.PI - 0.2); g.stroke(); }
  g.strokeStyle = alpha('#fff4e0', 0.9); g.lineWidth = 3; for (const yy of [-650, -644, -638]) { g.beginPath(); g.moveTo(-20, yy); g.lineTo(20, yy); g.stroke(); } circle(g, 0, -640, 3.5, '#d8201a');
  // rudraksha beads
  for (let k = 0; k < 15; k++) { const a = Math.PI * (0.15 + 0.7 * k / 14); circle(g, Math.cos(a) * 52, -545 + Math.sin(a) * 70, 5.5, '#2a1208'); }
  for (const [wx, wy] of [[-60, -700], [60, -700]]) for (let k = 0; k < 4; k++) circle(g, wx + k * (wx < 0 ? 6 : -6), wy + k * 4, 5, '#2a1208');
  g.restore();
}
registerShot('q16', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur) }, ch = atc(info, t, 'chanted', 1.9), cr = atc(info, t, 'credited', 3.4);
  layer(g, cam, 0.2, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, H, ['#0a0604', '#1a0c06', '#0c0604']); g.fillRect(-W, -H, W * 3, H * 3);
    glow(g, W / 2, H * 0.42, 620, '#ff8a3a', 0.22); mandala(g, W / 2, H * 0.4, H * 0.42 * (1 + 0.02 * Math.sin(t)), t * 0.4, { color: '#c8782a', a: 0.35 });
    // trishul + damaru + crescent behind
    g.save(); g.globalAlpha = 0.35; g.strokeStyle = '#ffb060'; g.lineWidth = 10; seg(g, [[W / 2, H * 0.92], [W / 2, H * 0.06]], 10, alpha('#ffb060', 0.35)); g.beginPath(); g.moveTo(W / 2 - 90, H * 0.2); g.quadraticCurveTo(W / 2 - 90, H * 0.08, W / 2 - 40, H * 0.06); g.moveTo(W / 2 + 90, H * 0.2); g.quadraticCurveTo(W / 2 + 90, H * 0.08, W / 2 + 40, H * 0.06); g.stroke(); g.restore(); });
  layer(g, cam, 0.6, (g) => { flames(g, t, W * 0.1, H * 0.98, W * 0.28, H * 0.75, 1, { seed: 3, n: 34 }); flames(g, t + 1, W * 0.9, H * 0.98, W * 0.28, H * 0.75, 1, { seed: 8, n: 34 }); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, H * 0.86, 0, H, ['#1a0c06', '#060302']); g.fillRect(-W, H * 0.86, W * 3, H); FX.pool(g, W / 2, H * 0.9, 300, 40, '#ffb060', 0.25); tandav(g, t, W * 0.5, H * 0.9, 0.95); });
  if (t > ch - 0.3) { g.save(); g.globalAlpha = ease.out(prog(t, ch - 0.3, ch + 0.6)) * 0.8; glyphRows(g, t, { x: W * 0.62, y: H * 0.28, w: 460, rows: 4, gap: 56, size: 26, color: '#ffd27a', seed: 4 }); glyphRows(g, t + 2, { x: W * 0.06, y: H * 0.28, w: 420, rows: 4, gap: 56, size: 26, color: '#ffd27a', seed: 9 }); g.restore(); }
  embers(g, t, { count: 80, k: 0.9, color: '#ffb050' }); cine(g, 0.7);
  topBand(g, 0.85, 0.26); headline(g, 'SHIVA TANDAV STOTRAM', E.H * 0.12, ease.out(prog(t, 0.2, 0.6)), { size: 74, spacing: 8 });
  chip(g, 'CREDITED TO RAVANA', W / 2, E.H * 0.2, ease.outBack(prog(t, cr - 0.2, cr + 0.25)), { color: C.gold, size: 34 });
} });

// ---------- q41 "There is no Dussehra here. No festival where good defeats pride." the festival poster loses its arrows
registerShot('q41', { draw(g, t, info) {
  const nd = atc(info, t, 'dussehra', 0.7), fe = atc(info, t, 'festival', 1.7), pr = atc(info, t, 'pride', 3.0), k = ease.inOut(prog(t, fe, pr + 0.2)), z = 1 + 0.04 * t;
  g.save(); g.translate(W / 2, H / 2); g.scale(z, z); g.translate(-W / 2, -H / 2);
  const bg = g.createRadialGradient(W / 2, H * 0.55, 60, W / 2, H * 0.55, W * 0.7); bg.addColorStop(0, mix('#d8202a', '#4a4a52', k)); bg.addColorStop(1, mix('#6a0a10', '#1a1a20', k)); g.fillStyle = bg; g.fillRect(-W, -H, W * 3, H * 3);
  halftone(g, W / 2, H * 0.55, H * 0.6, alpha(mix('#ff5a3a', '#7a7a86', k), 0.55));
  tenHeads(g, t, W / 2, H * 0.3, 56, { strings: true, sneer: k, spread: W * 0.8, arc: 50, face: mix('#ffcc33', '#ffd84a', k) });
  // bow + three arrows aimed at the heads; on "festival" the arrows fall away and the bow snaps
  const by = H * 0.84, drop = ease.in(prog(t, fe, fe + 1.2));
  g.save(); g.translate(W / 2, by); g.globalAlpha = 1 - 0.6 * k;
  const bc = mix('#ffcf3a', '#8a8a92', k); g.strokeStyle = bc; g.lineWidth = 20; g.lineCap = 'round';
  for (const s2 of [-1, 1]) { g.save(); g.rotate(s2 * 0.25 * k); g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(s2 * 120, -70, s2 * 260, -40, s2 * 330, 20); g.quadraticCurveTo(s2 * 380, 60, s2 * 340, 70); g.stroke(); g.restore(); }
  seg(g, [[-330, 20], [330, 20]], 3, alpha(bc, 0.8 * (1 - k)));
  g.restore();
  for (let i = -1; i <= 1; i++) { const x0 = W / 2 + i * 150, ang = -Math.PI / 2 + i * 0.12; const y0 = by - 60 + drop * 700, a = 1 - drop; if (a > 0) arrow(g, x0 + Math.cos(ang) * 260, y0 + Math.sin(ang) * 260 + drop * 80, ang + drop * 1.4 * (i || 1), { len: 300, trail: 0, color: '#ffe08a', glowC: '#ffcf3a', a, w: 7 }); }
  g.restore();
  // centre words in the empty red circle
  serif(g, 'NO DUSSEHRA', W / 2, H * 0.58, ease.out(prog(t, nd - 0.25, nd + 0.15)), { size: 120, color: '#fff2d0', glow: 18, glowColor: 'rgba(60,0,0,.8)', spacing: 8 });
  serif(g, 'Good never defeats pride.', W / 2, H * 0.68, ease.out(prog(t, pr - 0.6, pr - 0.1)), { size: 52, italic: true, color: '#ffd27a' });
  cine(g, 0.6);
} });

// ---------- q43 "Children grow up with a different story. The strong take what they want." a student reads the new epic
registerShot('q43', { draw(g, t, info) {
  const st = atc(info, t, 'strong', 2.4), k = ease.inOut(prog(t, st - 0.2, st + 0.9)), cam = { z: 1.0 + 0.05 * ease.inOut(t / info.dur), x: lerp(-10, 20, t / info.dur) }, GY = H * 0.86;
  layer(g, cam, 0.2, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, H, ['#0a1020', '#141a30', '#0a0c16']); g.fillRect(-W, -H, W * 3, H * 3);
    // classroom wall: blackboard with chalk drawing of the crowned king, a window with the towers outside
    rr(g, W * 0.06, H * 0.12, W * 0.34, H * 0.36, 8); g.fillStyle = '#16261e'; g.fill(); g.strokeStyle = '#5a3a20'; g.lineWidth = 12; g.stroke();
    g.save(); g.globalAlpha = 0.7; ravana(g, W * 0.23, H * 0.44, 0.5, { t, ink: 'rgba(0,0,0,0)', rim: '#e8f0e0', glowA: 0, crownGold: 1 }); g.restore();
    text(g, 'RAVANA THE GREAT', W * 0.23, H * 0.17, { size: 26, font: 'Nunito', weight: 900, color: alpha('#e8f0e0', 0.85), spacing: 6 });
    for (let i = 0; i < 4; i++) { g.fillStyle = '#0c1424'; g.fillRect(W * 0.5 + i * 150, H * 0.08, 130, H * 0.5); }
    g.fillStyle = '#2a3048'; g.fillRect(-W, GY - 10, W * 3, H); });
  // the open storybook (right) with the illustration that comes alive
  layer(g, cam, 0.8, (g) => { const bx = W * 0.66, by = H * 0.6; glow(g, bx, by - 120, 560, '#ffcf7a', 0.35);
    g.fillStyle = '#f2e2c0'; g.beginPath(); g.moveTo(bx - 470, by - 260); g.quadraticCurveTo(bx - 240, by - 300, bx, by - 250); g.quadraticCurveTo(bx + 240, by - 300, bx + 470, by - 260); g.lineTo(bx + 470, by + 150); g.quadraticCurveTo(bx + 240, by + 110, bx, by + 160); g.quadraticCurveTo(bx - 240, by + 110, bx - 470, by + 150); g.closePath(); g.fill();
    seg(g, [[bx, by - 250], [bx, by + 160]], 4, '#c8a878');
    // left page: the king, huge and golden
    g.save(); g.beginPath(); g.rect(bx - 460, by - 270, 455, 420); g.clip(); ravana(g, bx - 230, by + 130, 0.62 + 0.12 * k, { t, ink: '#3a1a0a', rim: C.gold, glowA: 0.3, crownGold: 1 }); g.restore();
    // right page: small people hand their gold up to him (the strong take)
    for (let i = 0; i < 5; i++) { const px = bx + 70 + i * 78, py = by + 120; drawFigure(g, { x: px, y: py, s: 0.55, facing: -1, outfit: { top: 'tshirt', color: '#6a5a4a' }, pose: k > 0.3 ? POSES.kneel : POSES.stand, expr: 'worried', rim: { color: '#ffcf7a', dir: [-1, -0.5] } });
      const u = clamp(k * 1.4 - i * 0.08); if (u > 0) { const cx = lerp(px - 20, bx - 160, u), cy = lerp(py - 60, by - 140, u) - Math.sin(u * Math.PI) * 80; circle(g, cx, cy, 11, '#ffcf3a'); glow(g, cx, cy, 30, '#ffcf3a', 0.4); } }
    text(g, k > 0.4 ? 'THE STRONG TAKE' : 'THE INVINCIBLE KING', bx + 235, by - 200, { size: 28, font: 'Playfair Display', weight: 900, color: '#5a2a10', spacing: 2 }); });
  // the student at the desk, reading
  layer(g, cam, 1.1, (g) => { const x = W * 0.25; rr(g, x - 40, GY - 150, 420, 22, 6); g.fillStyle = '#6a4020'; g.fill(); g.fillStyle = '#4a2c14'; g.fillRect(x + 340, GY - 130, 18, 130); g.fillRect(x - 20, GY - 130, 18, 130);
    drawFigure(g, { x: x + 40, y: GY, s: 1.6, facing: 1, outfit: { top: 'tshirt', color: '#2a6ad8', kid: true, head: 'none' }, pose: breathe(POSES.sit, t, 1, 2), expr: k > 0.5 ? 'scared' : 'smile', look: [1, 0.3], blink: (t % 3.4) > 3.3, rim: { color: '#ffd27a', dir: [1, -0.5] } });
    g.fillStyle = '#f2e2c0'; g.beginPath(); g.moveTo(x + 170, GY - 168); g.lineTo(x + 250, GY - 182); g.lineTo(x + 330, GY - 168); g.lineTo(x + 250, GY - 156); g.closePath(); g.fill(); glow(g, x + 250, GY - 175, 160, '#ffd27a', 0.5);
    // light beam from the little book to the big story
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, x + 250, 0, W * 0.6, 0, ['rgba(255,210,122,.25)', 'rgba(255,210,122,0)']); g.beginPath(); g.moveTo(x + 230, GY - 180); g.lineTo(x + 270, GY - 180); g.lineTo(W * 0.66, H * 0.3); g.lineTo(W * 0.5, H * 0.35); g.closePath(); g.fill(); g.restore(); });
  FX.dust(g, t, { count: 40, color: '#ffe0a0', a: 0.35 }); cine(g, 0.6);
  topBand(g, 0.8, 0.26); headline(g, 'A DIFFERENT STORY', E.H * 0.12, ease.out(prog(t, 0.3, 0.7)) * (1 - prog(t, st - 0.5, st - 0.2)), { size: 70, color: '#ffe8c0' });
  serif(g, '“The strong take what they want.”', W / 2, E.H * 0.12, ease.out(prog(t, st - 0.2, st + 0.3)), { size: 62, italic: true, color: '#fff0d8' });
} });

// ---------- q45 "The ten towers watch everything. Disagree with the king, and you don't disappear." towers with eyes
registerShot('q45', { draw(g, t, info) {
  const dg = atc(info, t, 'disagree', 2.5), snap = ease.inOut(prog(t, dg + 0.4, dg + 1.0)), cam = { z: 1.0 + 0.06 * ease.inOut(t / info.dur), x: lerp(-20, 0, t / info.dur) }, GY = H * 0.86, hx = W * 0.56;
  layer(g, cam, 0.1, (g) => { sky(g, ['#020308', '#080c18', '#121a2a'], { stars: 60, t }); FX.moon(g, W * 0.84, H * 0.12, 26, '#cfe0ff'); });
  const TW = Array.from({ length: 10 }, (_, i) => ({ x: W * (0.05 + i * 0.1), h: 520 + ((i * 37) % 5) * 40 + (i === 4 || i === 5 ? 120 : 0) }));
  layer(g, cam, 0.4, (g) => { TW.forEach((tw, i) => { const base = GY - 40; for (let k = 0; k < 7; k++) { const w = 120 * (1 - k * 0.11), y0 = base - k * tw.h / 7.5; g.fillStyle = mix('#151a26', '#0a0d14', k / 7); g.fillRect(tw.x - w / 2, y0 - tw.h / 7.5 + 6, w, tw.h / 7.5 - 6); g.fillStyle = '#2a3242'; g.fillRect(tw.x - w / 2 - 6, y0 - 6, w + 12, 6);
        for (let j = 0; j < 3; j++) { g.fillStyle = alpha('#8aa8c8', 0.25); g.fillRect(tw.x - w / 2 + 12 + j * (w - 24) / 3, y0 - tw.h / 7.5 + 18, 10, 18); } }
      // the eye at the top
      const ey = base - tw.h - 30, open = clamp(Math.sin(t * 0.8 + i) * 0.3 + 0.8 + snap * 0.3), tx = snap > 0 ? lerp(Math.sin(t * 0.7 + i * 1.3), clamp((hx - tw.x) / 400, -1, 1), snap) : Math.sin(t * 0.7 + i * 1.3);
      g.save(); g.translate(tw.x, ey); g.fillStyle = '#e8f4ff'; g.beginPath(); g.moveTo(-46, 0); g.quadraticCurveTo(0, -38 * open, 46, 0); g.quadraticCurveTo(0, 38 * open, -46, 0); g.fill(); glow(g, 0, 0, 90, '#9fd8ff', 0.35 + 0.3 * snap);
      circle(g, tx * 18, 0, 16 * open, mix('#2a8ad8', '#ff3a3a', snap)); circle(g, tx * 18, 0, 7 * open, '#020306'); g.restore(); }); });
  // searchlight beams from each eye; on "disagree" they all swing onto one person
  g.save(); g.globalCompositeOperation = 'lighter'; TW.forEach((tw, i) => { const ey = GY - 40 - tw.h - 30; const free = W * 0.5 + Math.sin(t * 0.6 + i * 1.7) * W * 0.45; const tx = lerp(free, hx, snap);
    g.fillStyle = linGrad(g, 0, ey, 0, GY, [`rgba(200,230,255,${0.02 + 0.04 * snap})`, `rgba(200,230,255,${0.08 + 0.1 * snap})`]); g.beginPath(); g.moveTo(tw.x - 10, ey); g.lineTo(tw.x + 10, ey); g.lineTo(tx + 70, GY + 10); g.lineTo(tx - 70, GY + 10); g.closePath(); g.fill(); }); g.restore();
  layer(g, cam, 1, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, H, ['#1a2028', '#06080a']); g.fillRect(-W, GY, W * 3, H);
    for (let i = 0; i < 9; i++) { const x = W * (0.12 + i * 0.1); if (Math.abs(x - hx) < 60) continue; drawFigure(g, { x: x + (x < hx ? -snap * 30 : snap * 30), y: GY, s: 1.25, facing: i % 2 ? 1 : -1, outfit: { top: 'tshirt', color: '#3a4048' }, pose: breathe(POSES.stand, t, 1, i), expr: snap > 0.5 ? 'scared' : 'neutral', look: [x < hx ? 1 : -1, 0], blink: ((t + i) % 3.3) > 3.2, rim: { color: '#8aa0b8', dir: [0, -1] } }); }
    drawFigure(g, { x: hx, y: GY, s: 1.3, facing: -1, outfit: { top: 'hoodie', color: '#3fb8a8', head: 'hood', headColor: '#3fb8a8' }, pose: breathe(posesAt(t, [[0, 'stand'], [dg + 0.1, 'pointUp']]), t, 1, 9), expr: snap > 0.6 ? 'scared' : 'determined', look: [-0.3, -1], blink: (t % 3) > 2.9, rim: { color: '#dff0ff', dir: [0, -1] } }); });
  drain(g, 0.5); cine(g, 0.6); topBand(g, 0.8, 0.24);
  headline(g, 'THE TOWERS WATCH', E.H * 0.12, ease.out(prog(t, 0.2, 0.6)) * (1 - prog(t, dg - 0.3, dg)), { size: 72, color: '#dfe8f0' });
  headline(g, 'DISAGREE WITH THE KING', E.H * 0.12, ease.out(prog(t, dg, dg + 0.3)), { size: 64, color: '#ffd8d0' });
} });

// ---------- q49 "And somewhere in the archives, there is a story nobody is allowed to tell." the forbidden archive
registerShot('q49', { draw(g, t, info) {
  const nb = atc(info, t, 'nobody', 3.0), lk = ease.out(prog(t, nb - 0.1, nb + 0.5)), z = 1 + 0.22 * ease.inOut(t / info.dur), vx = W / 2, vy = H * 0.46;
  g.save(); g.translate(vx, vy); g.scale(z, z); g.translate(-vx, -vy);
  g.fillStyle = '#060404'; g.fillRect(-W, -H, W * 3, H * 3); glow(g, vx, vy + 40, 520, '#ff9a3a', 0.18);
  // floor and ceiling converge to the vanishing point
  g.fillStyle = linGrad(g, 0, vy, 0, H * 1.2, ['#120a06', '#2a1a10']); g.beginPath(); g.moveTo(-W, H * 1.2); g.lineTo(vx - 40, vy + 40); g.lineTo(vx + 40, vy + 40); g.lineTo(W * 2, H * 1.2); g.fill();
  for (let i = -8; i <= 8; i++) seg(g, [[vx + i * 6, vy + 40], [vx + i * 260, H * 1.2]], 2, alpha('#4a2c18', 0.6));
  // shelves of palm-leaf manuscripts, left and right, receding
  for (let k = 9; k >= 0; k--) { const s = 1 / (1 + k * 0.45), d = mix('#5a3618', '#100806', 1 - s); for (const sd of [-1, 1]) { const x = vx + sd * 820 * s, w = 130 * s, h = 900 * s; g.fillStyle = mix('#2a180c', '#080404', 1 - s); g.fillRect(sd > 0 ? x : x - w, vy - h * 0.55, w, h);
      for (let r = 0; r < 7; r++) { const yy = vy - h * 0.5 + r * h * 0.14; g.fillStyle = d; g.fillRect(sd > 0 ? x : x - w, yy, w, 6 * s); for (let b = 0; b < 4; b++) { rr(g, (sd > 0 ? x : x - w) + 8 * s + b * w * 0.23, yy - 34 * s, w * 0.2, 30 * s, 6 * s); g.fillStyle = mix('#c89860', '#2a1a0c', 1 - s); g.fill(); seg(g, [[(sd > 0 ? x : x - w) + 8 * s + b * w * 0.23 + w * 0.1, yy - 34 * s], [(sd > 0 ? x : x - w) + 8 * s + b * w * 0.23 + w * 0.1, yy - 4 * s]], 2 * s, '#6a1a10'); } } } }
  g.restore();
  // the pedestal with the chained, sealed manuscript chest (foreground, centre)
  const cx = W / 2, cy = H * 0.66; FX.pool(g, cx, cy + 150, 420, 60, '#ffb050', 0.3);
  g.fillStyle = '#2a1c14'; g.beginPath(); g.moveTo(cx - 170, cy + 160); g.lineTo(cx + 170, cy + 160); g.lineTo(cx + 130, cy + 40); g.lineTo(cx - 130, cy + 40); g.fill();
  rr(g, cx - 220, cy - 80, 440, 130, 10); g.fillStyle = '#5a3218'; g.fill(); rr(g, cx - 230, cy - 100, 460, 34, 8); g.fillStyle = '#7a4a22'; g.fill();
  const glowk = 0.4 + 0.4 * Math.sin(t * 6) * (1 - lk); glow(g, cx, cy - 100, 260, '#ffd27a', glowk * 0.6); // the story tries to shine out
  for (const xx of [-120, 120]) { const tight = lk * 8; for (let j = -4; j <= 4; j++) { g.strokeStyle = mix('#6a6e76', '#ff4a2a', lk); g.lineWidth = 8; g.beginPath(); g.ellipse(cx + xx + j * 2, cy - 60 + j * 26, 14 - tight * 0.5, 9, 0.3, 0, 7); g.stroke(); } }
  circle(g, cx, cy - 20, 44, '#8a1a14'); circle(g, cx, cy - 20, 32, '#b82a1a'); posterHead(g, cx, cy - 14, 14, { face: '#ffcf8a' });
  rr(g, cx - 34, cy + 20, 68, 56, 10); g.fillStyle = mix('#8a8e96', '#c8c8d0', lk); g.fill(); g.strokeStyle = '#3a3e46'; g.lineWidth = 8; g.beginPath(); g.arc(cx, cy + 20, 22, Math.PI, 0); g.stroke();
  // escaping letters get snuffed out
  const R = rng(8); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 26; i++) { const u = ((t * 0.5 + R()) % 1), x = cx + (R() - 0.5) * 300 + Math.sin(t + i) * 20, y = cy - 120 - u * 260 * (1 - lk * 0.8); const a = Math.sin(u * Math.PI) * (1 - lk) * 0.8; if (a > 0.02) { g.fillStyle = alpha('#ffd27a', a); g.font = '700 24px Nunito'; g.fillText('ꦱꦶꦡ'.charAt(i % 3) || '•', x, y); circle(g, x, y, 3, alpha('#ffd27a', a)); } } g.restore();
  FX.dust(g, t, { count: 60, color: '#ffd8a0', a: 0.4 }); cine(g, 0.8);
  topBand(g, 0.8, 0.24); headline(g, 'THE FORBIDDEN ARCHIVE', E.H * 0.12, ease.out(prog(t, 0.3, 0.7)) * (1 - prog(t, nb - 0.5, nb - 0.2)), { size: 66 });
  headline(g, 'THE STORY NOBODY TELLS', E.H * 0.12, ease.out(prog(t, nb - 0.2, nb + 0.2)), { size: 66, color: '#ffd0b0' });
} });

// ---------- q50 "Of a woman taken from a forest, who never got to go home." Sita carried away in the flying chariot
function horse(g, x, y, s, t, ph) {
  const gal = Math.sin(t * 9 + ph), wh = '#f6f2ea', sh = '#c8c0b4', gold = '#e8b030';
  g.save(); g.translate(x, y); g.scale(s, s);
  const leg = (bx, by, a1, a2) => { limb(g, [[bx, by], [bx + Math.sin(a1) * 70, by + Math.cos(a1) * 70], [bx + Math.sin(a1) * 70 + Math.sin(a2) * 60, by + Math.cos(a1) * 70 + Math.cos(a2) * 60]], 16, sh); };
  leg(-80, 20, 0.6 + gal * 0.5, 1.4 + gal * 0.3); leg(70, 20, -0.4 - gal * 0.5, -1.2 - gal * 0.4);
  // tail
  g.fillStyle = sh; g.beginPath(); g.moveTo(110, -10); g.quadraticCurveTo(190, 10 + gal * 10, 210, 90); g.quadraticCurveTo(160, 40, 104, 10); g.fill();
  // body + neck + head
  g.fillStyle = wh; g.beginPath(); g.ellipse(0, 0, 125, 52, 0, 0, 7); g.fill();
  g.beginPath(); g.moveTo(-80, -20); g.quadraticCurveTo(-120, -90, -150, -150); g.lineTo(-110, -170); g.quadraticCurveTo(-60, -100, -40, -40); g.closePath(); g.fill();
  g.beginPath(); g.ellipse(-160, -160, 52, 24, -0.55, 0, 7); g.fill();
  circle(g, -168, -172, 5, '#1a1410'); seg(g, [[-140, -190], [-128, -215]], 9, wh); // eye + ear
  // mane
  g.fillStyle = '#e8dcc8'; for (let k = 0; k < 6; k++) { const u = k / 5, mx = lerp(-130, -60, u), my = lerp(-170, -60, u); g.beginPath(); g.moveTo(mx, my); g.quadraticCurveTo(mx + 40, my - 10 + Math.sin(t * 8 + k) * 8, mx + 60, my + 10); g.lineTo(mx + 10, my + 14); g.fill(); }
  leg(-60, 30, 0.2 - gal * 0.6, 1.0 - gal * 0.2); leg(90, 30, -0.2 + gal * 0.6, -0.8 + gal * 0.3);
  // gold harness
  seg(g, [[-40, -40], [-150, -150]], 6, gold); seg(g, [[-60, -44], [60, -50]], 8, gold); circle(g, -100, -96, 9, '#e0102a');
  g.restore();
}
function sita(g, x, y, s, t) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const fl = (k) => Math.sin(t * 6 + k) * 14;
  // orange dupatta streaming behind (to the right, toward the forest)
  g.fillStyle = '#f08a2a'; g.beginPath(); g.moveTo(-10, -150); g.bezierCurveTo(80, -170 + fl(0), 180, -130 + fl(1), 300, -150 + fl(2)); g.lineTo(290, -100 + fl(2)); g.bezierCurveTo(180, -90 + fl(1), 90, -110 + fl(0), 10, -100); g.closePath(); g.fill();
  // seated body in pink saree with green blouse
  g.fillStyle = '#e8508a'; g.beginPath(); g.moveTo(-50, 0); g.quadraticCurveTo(-60, -60, -30, -100); g.lineTo(30, -100); g.quadraticCurveTo(70, -50, 80, 0); g.closePath(); g.fill();
  g.fillStyle = '#2a9a5a'; g.beginPath(); g.moveTo(-30, -100); g.lineTo(30, -100); g.lineTo(26, -140); g.lineTo(-24, -140); g.closePath(); g.fill();
  seg(g, [[-50, -4], [80, -4]], 7, '#ffcf3a');
  // arm reaching back toward the forest
  limb(g, [[20, -128], [70, -150], [120, -175]], 13, '#e8b48a'); circle(g, 124, -178, 9, '#e8b48a'); for (let k = 0; k < 3; k++) circle(g, 100 - k * 6, -166 + k * 3, 4, '#ffcf3a');
  // head turned back, black hair, bindi, mang tikka
  g.fillStyle = '#e8b48a'; g.beginPath(); g.ellipse(4, -168, 22, 27, 0.15, 0, 7); g.fill();
  g.fillStyle = '#140c0a'; g.beginPath(); g.ellipse(-6, -180, 25, 22, 0.2, Math.PI * 0.8, Math.PI * 2.1); g.fill(); circle(g, -24, -168, 13, '#140c0a');
  circle(g, 14, -176, 3, '#d8102a'); seg(g, [[6, -196], [12, -184]], 2, '#ffcf3a'); circle(g, 12, -182, 3.5, '#ffcf3a');
  g.strokeStyle = '#140c0a'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(14, -166); g.quadraticCurveTo(20, -169, 24, -165); g.stroke(); // eye (looking back)
  g.strokeStyle = '#b8202a'; g.lineWidth = 3; g.beginPath(); g.moveTo(14, -150); g.lineTo(20, -150); g.stroke();
  g.fillStyle = '#f08a2a'; g.beginPath(); g.ellipse(-6, -186, 30, 18, 0.2, Math.PI, Math.PI * 2); g.fill(); // dupatta over the head
  g.restore();
}
registerShot('q50', { draw(g, t, info) {
  const hm = atc(info, t, 'home', 2.6), down = ease.inOut(prog(t, hm - 0.9, hm + 0.6)), u = t / info.dur;
  g.save(); g.translate(0, -down * H * 0.55);
  sky(g, ['#3a5a9a', '#7a8ac8', '#e8a0a8', '#ffd0a0'], { bottom: 1.6 }); FX.clouds(g, { y: H * 0.22, h: 160, count: 8, color: '#ffffff', a: 0.5, seed: 4 });
  g.save(); g.translate(-t * 60, 0); FX.clouds(g, { y: H * 0.62, h: 200, count: 9, color: '#fff0f0', a: 0.55, seed: 9 }); g.restore();
  // forest far below
  treeLine(g, H * 1.25, { color: '#2a5a3a', seed: 3, count: 22, h: 300 }); g.fillStyle = '#1e4a30'; g.fillRect(-W, H * 1.25, W * 3, H); treeLine(g, H * 1.45, { color: '#163a26', seed: 7, count: 16, h: 380 });
  // her empty cottage in the clearing, a single lamp
  const hx = W * 0.62, hy = H * 1.46; g.fillStyle = '#5a3a20'; g.fillRect(hx - 70, hy - 70, 140, 70); g.fillStyle = '#8a6a3a'; g.beginPath(); g.moveTo(hx - 100, hy - 66); g.lineTo(hx, hy - 140); g.lineTo(hx + 100, hy - 66); g.fill(); g.fillStyle = '#ffc060'; g.fillRect(hx - 16, hy - 46, 32, 46); glow(g, hx, hy - 20, 160, '#ffb050', 0.5);
  // the chariot flies right -> left, horses ahead, her jewels falling toward the forest
  const cx = lerp(W * 1.05, W * 0.45, ease.out(clamp(u * 1.25))), cy = H * 0.5 + Math.sin(t * 2) * 10; g.save(); g.translate(cx, cy); g.scale(1.7, 1.7); g.translate(-cx, -cy);
  for (let i = 0; i < 2; i++) horse(g, cx - 330 - i * 60, cy - 30 + i * 36, 0.72 - i * 0.04, t, i * 1.7);
  seg(g, [[cx - 240, cy - 50], [cx - 60, cy - 20]], 6, '#e8b030');
  ravana(g, cx + 10, cy + 10, 0.5, { t, ink: '#1a0c10', rim: '#ffcf6a', glowA: 0.25, crownGold: 1, staff: false });
  sita(g, cx + 90, cy + 6, 1.05, t);
  // golden chariot body + wheel
  g.fillStyle = linGrad(g, 0, cy - 60, 0, cy + 60, ['#ffe08a', '#e8a020', '#a86a10']); g.beginPath(); g.moveTo(cx - 90, cy - 30); g.lineTo(cx + 190, cy - 40); g.quadraticCurveTo(cx + 230, cy + 10, cx + 180, cy + 60); g.lineTo(cx - 70, cy + 60); g.quadraticCurveTo(cx - 110, cy + 20, cx - 90, cy - 30); g.fill();
  for (let k = 0; k < 6; k++) circle(g, cx - 50 + k * 42, cy + 10, 7, k % 2 ? '#e0102a' : '#10a060');
  const wx = cx + 40, wy = cy + 70; g.strokeStyle = '#c88a20'; g.lineWidth = 10; g.beginPath(); g.arc(wx, wy, 62, 0, 7); g.stroke(); for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 - t * 4; seg(g, [[wx, wy], [wx + Math.cos(a) * 60, wy + Math.sin(a) * 60]], 4, '#e8b030'); } circle(g, wx, wy, 14, '#ffd040');
  g.restore(); const R = rng(3); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const st = 0.4 + i * 0.12, d = t - st; if (d < 0) continue; const jx = cx + 200 + (R() - 0.5) * 60 + d * 30, jy = cy - 160 + d * d * 260; circle(g, jx, jy, 5, i % 2 ? '#ffd040' : '#ff5a8a'); glow(g, jx, jy, 24, '#ffd040', 0.4); } g.restore();
  g.restore();
  FX.dust(g, t, { count: 30, color: '#fff0d0', a: 0.35 }); cine(g, 0.5);
  topBand(g, 0.7, 0.24); headline(g, 'TAKEN FROM THE FOREST', E.H * 0.12, ease.out(prog(t, 0.2, 0.6)) * (1 - prog(t, hm - 0.6, hm - 0.3)), { size: 64, color: '#fff0e0' });
  headline(g, 'SHE NEVER WENT HOME', E.H * 0.12, ease.out(prog(t, hm - 0.3, hm + 0.1)), { size: 66, color: '#ffd8c0' });
} });

// ---------- q58 "Pride." the ten proud heads, PRIDE slams in and cracks
registerShot('q58', { draw(g, t, info) {
  const sl = ease.outBack(prog(t, 0.0, 0.25)), ck = ease.inOut(prog(t, 0.55, 0.95)), sh = t < 0.3 ? (0.3 - t) * 30 * Math.sin(t * 90) : 0;
  g.save(); g.translate(sh, 0); g.fillStyle = '#050204'; g.fillRect(-W, -H, W * 3, H * 3); g.save(); glow(g, W / 2, H * 0.5, 900, mix('#ffb040', '#ff2a1a', ck), 0.3 + 0.2 * ck); g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  tenHeads(g, t, W / 2, H * 0.27, 62, { sneer: 1, spread: W * 0.86, arc: 70, face: mix('#ffcc33', '#ffa040', ck * 0.5) });
  g.save(); g.translate(W / 2, H * 0.66); g.scale(1.5 - 0.5 * sl, 1.5 - 0.5 * sl);
  for (const sd of [-1, 1]) { g.save(); g.beginPath(); if (sd < 0) g.rect(-W, -300, W - 6, 600); else g.rect(6, -300, W, 600); g.clip(); g.translate(sd * ck * 26, ck * 10 * sd); g.rotate(sd * ck * 0.03);
    serif(g, 'PRIDE', 0, 0, sl, { size: 280, color: '#ffe08a', glow: 30, glowColor: 'rgba(255,90,20,.75)', spacing: 24, italic: false }); g.restore(); }
  if (ck > 0) { g.shadowColor = '#ff3a1a'; g.shadowBlur = 30; seg(g, [[0, -140], [-14, -60], [12, 0], [-8, 70], [6, 140]].slice(0, 1 + Math.ceil(ck * 4)), 8, '#ff6a2a'); g.shadowBlur = 0; }
  g.restore(); g.restore();
  embers(g, t, { count: 90, k: 0.4 + ck, color: '#ff8a4a', speed: 120 }); cine(g, 0.45);
} });
