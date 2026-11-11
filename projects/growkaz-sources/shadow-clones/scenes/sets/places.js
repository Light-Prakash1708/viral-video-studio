// sets/places.js: original backgrounds for "Only YOU Have AI". Every one returns { GY } (the floor line).
import { E, V, layer, rr, seg, poly, circle, ring, glow, alpha, shade, mix, linGrad, radGrad, text, ease, prog, clamp, lerp, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const GYN = () => E.H * 0.7;
const CYAN = '#7fe3ff';
const sky = (g, stops) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, stops); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); };
const floor = (g, gy, c1, c2) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + E.H * 0.4, [c1, c2]); g.fillRect(-E.W, gy, E.W * 3, E.H); };

// a row of towers with lit windows. `thr`: windows right of this x are dark (the blackout wave)
function towers(g, o) {
  const { y, x0 = -E.W * 0.3, x1 = E.W * 1.3, seed = 1, minH, maxH, minW = 120, maxW = 260, color, edge, lit = 0.35, thr = 1e9, win = '#ffcf7a', t = 0 } = o;
  const r = rng(seed); let x = x0;
  while (x < x1) {
    const w = minW + r() * (maxW - minW), h = minH + r() * (maxH - minH);
    g.fillStyle = color; g.fillRect(x, y - h, w, h + 4);
    if (edge) { g.fillStyle = alpha(edge, 0.55); g.fillRect(x, y - h, 3, h); g.fillRect(x, y - h, w, 3); }
    const cols = Math.max(1, Math.floor(w / 36)), rows = Math.floor(h / 50);
    for (let c = 0; c < cols; c++) for (let k = 0; k < rows; k++) {
      const on = r() < lit, fl = r(); if (!on) continue;
      const wx = x + 12 + c * 36, wy = y - h + 18 + k * 50;
      const live = wx < thr ? 1 : 0; if (!live) { g.fillStyle = 'rgba(40,50,80,.35)'; g.fillRect(wx, wy, 18, 26); continue; }
      g.fillStyle = alpha(fl > 0.8 ? CYAN : win, 0.55 + 0.25 * Math.sin(t * 2 + fl * 40)); g.fillRect(wx, wy, 18, 26);
    }
    if (r() < 0.4) { seg(g, [[x + w / 2, y - h], [x + w / 2, y - h - 60]], 4, color); circle(g, x + w / 2, y - h - 62, 5, alpha('#ff4a4a', 0.5 + 0.5 * Math.sin(t * 3 + x))); }
    x += w + 6 + r() * 20;
  }
}

// 1. The AI city: neon-edged towers, data streams rising, a huge ring in the sky. blackout 0..1 sweeps the lights out.
export function aiCity(g, t, cam, o = {}) {
  const { blackout = 0, ring: showRing = true } = o, gy = GYN(), thr = E.W * 1.4 - E.W * 1.6 * blackout;
  layer(g, cam, 0.1, (g) => {
    sky(g, ['#060a22', '#10205a', '#3a2f86', '#8b4fa0']);
    FX.stars(g, t, { count: 120, area: [0, 0, E.W, E.H * 0.45] });
    if (showRing) { const cx = E.W * 0.74, cy = E.H * 0.27; for (let i = 0; i < 3; i++) { g.save(); g.strokeStyle = alpha(CYAN, (0.28 - i * 0.06) * (1 - blackout * 0.8)); g.lineWidth = 4; g.setLineDash([26 + i * 12, 18]); g.lineDashOffset = -t * (30 + i * 18) * (i % 2 ? -1 : 1); g.beginPath(); g.arc(cx, cy, 190 + i * 80, 0, Math.PI * 2); g.stroke(); g.restore(); } glow(g, cx, cy, 380, CYAN, 0.12 * (1 - blackout)); }
  });
  layer(g, cam, 0.3, (g) => towers(g, { y: gy - 40, seed: 3, minH: 380, maxH: 760, minW: 150, maxW: 280, color: '#0d1440', edge: '#4b7bd6', lit: 0.3, thr, t }));
  layer(g, cam, 0.55, (g) => {
    towers(g, { y: gy + 30, seed: 8, minH: 520, maxH: 1050, minW: 190, maxW: 340, color: '#080c28', edge: CYAN, lit: 0.42, thr, t });
    if (blackout < 0.7) { const r = rng(5); for (let i = 0; i < 16; i++) { const x = r() * E.W, sp = 90 + r() * 140, ph = r() * 1400, y = gy - ((t * sp + ph) % 900); seg(g, [[x, y], [x, y - 70]], 3, alpha(CYAN, 0.5 * (1 - blackout / 0.7))); } }
  });
  layer(g, cam, 0.9, (g) => {
    floor(g, gy, '#141a3c', '#05060f');
    g.fillStyle = alpha(CYAN, 0.75 * (1 - blackout * 0.7)); g.fillRect(-E.W, gy, E.W * 3, 5); glow(g, E.W / 2, gy, E.W, CYAN, 0.1 * (1 - blackout));
    for (let x = -E.W; x < E.W * 2; x += 150) seg(g, [[x, gy + 6], [x - 120, gy + E.H * 0.3]], 2, 'rgba(120,160,255,.12)');
    seg(g, [[-E.W, gy - 90], [E.W * 2, gy - 90]], 6, '#0a0e24'); for (let x = -E.W; x < E.W * 2; x += 130) seg(g, [[x, gy - 90], [x, gy]], 6, '#0a0e24');
  });
  return { GY: gy };
}

// 2. The loft: dawn through a big window, string lights, desk with monitors, bed, alarm clock.
export function loft(g, t, cam, o = {}) {
  const gy = GYN();
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, 0, 0, gy, ['#2a2142', '#44305a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    const wx = E.W * 0.1, wy = E.H * 0.16, ww = E.W * 0.42, wh = E.H * 0.3;
    rr(g, wx, wy, ww, wh, 14); g.fillStyle = linGrad(g, 0, wy, 0, wy + wh, ['#6a4aa8', '#ff7a8a', '#ffc27a']); g.fill();
    glow(g, wx + ww * 0.7, wy + wh * 0.82, 260, '#ffd9a0', 0.5); circle(g, wx + ww * 0.7, wy + wh * 0.82, 52, '#fff1d0');
    g.fillStyle = '#1a1430'; for (let i = 0; i < 7; i++) { const bh = 40 + (i * 37) % 70; g.fillRect(wx + 10 + i * (ww / 7), wy + wh - bh, ww / 7 - 8, bh); }
    g.strokeStyle = '#1a1226'; g.lineWidth = 10; rr(g, wx, wy, ww, wh, 14); g.stroke(); seg(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 8, '#1a1226'); seg(g, [[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 8, '#1a1226');
    // string lights
    g.strokeStyle = '#150f22'; g.lineWidth = 3; g.beginPath(); g.moveTo(-20, E.H * 0.06); g.quadraticCurveTo(E.W / 2, E.H * 0.16, E.W + 20, E.H * 0.05); g.stroke();
    for (let i = 0; i <= 12; i++) { const u = i / 12, x = lerp(-20, E.W + 20, u), y = (1 - u) * (1 - u) * E.H * 0.06 + 2 * u * (1 - u) * E.H * 0.16 + u * u * E.H * 0.05 + 12; circle(g, x, y, 9, alpha('#ffd98a', 0.7 + 0.3 * Math.sin(t * 3 + i))); glow(g, x, y, 60, '#ffcf7a', 0.25); }
    // poster
    rr(g, E.W * 0.7, E.H * 0.18, E.W * 0.2, E.H * 0.17, 8); g.fillStyle = '#1b1a36'; g.fill(); circle(g, E.W * 0.8, E.H * 0.25, 46, '#8a5ad6'); poly(g, [[E.W * 0.72, E.H * 0.33], [E.W * 0.8, E.H * 0.27], [E.W * 0.88, E.H * 0.33]], '#7fe3ff');
  });
  layer(g, cam, 0.9, (g) => {
    floor(g, gy, '#4a3438', '#140e12');
    for (let x = -E.W; x < E.W * 2; x += 120) seg(g, [[x, gy], [x - 60, gy + E.H * 0.32]], 2, 'rgba(0,0,0,.25)');
    g.fillStyle = alpha('#8a5ad6', 0.35); g.beginPath(); g.ellipse(E.W * 0.5, gy + 150, 420, 70, 0, 0, Math.PI * 2); g.fill();   // rug
    // desk + three monitors (left)
    rr(g, E.W * 0.02, gy - 150, E.W * 0.34, 18, 6); g.fillStyle = '#20182c'; g.fill(); seg(g, [[E.W * 0.05, gy - 132], [E.W * 0.05, gy]], 12, '#20182c'); seg(g, [[E.W * 0.33, gy - 132], [E.W * 0.33, gy]], 12, '#20182c');
    [0.04, 0.135, 0.23].forEach((x, i) => { rr(g, E.W * x, gy - 300, E.W * 0.085, 140, 8); g.fillStyle = '#0b0f1c'; g.fill(); rr(g, E.W * x + 6, gy - 294, E.W * 0.085 - 12, 128, 5); g.fillStyle = alpha(CYAN, 0.25 + 0.12 * Math.sin(t * 2 + i)); g.fill(); for (let k = 0; k < 4; k++) seg(g, [[E.W * x + 16, gy - 276 + k * 26], [E.W * x + 16 + 34 + (k * 17) % 30, gy - 276 + k * 26]], 5, alpha('#d6f6ff', 0.6)); });
    // bed (right)
    rr(g, E.W * 0.66, gy - 120, E.W * 0.36, 130, 18); g.fillStyle = '#2c2038'; g.fill(); rr(g, E.W * 0.68, gy - 170, E.W * 0.32, 90, 28); g.fillStyle = '#8a5ad6'; g.fill(); rr(g, E.W * 0.68, gy - 190, 150, 60, 24); g.fillStyle = '#e9e2f4'; g.fill();
    // nightstand + alarm clock
    rr(g, E.W * 0.6, gy - 130, 110, 130, 8); g.fillStyle = '#2a1e38'; g.fill(); rr(g, E.W * 0.61, gy - 200, 90, 62, 10); g.fillStyle = '#0a0a10'; g.fill(); text(g, '7:00', E.W * 0.61 + 45, gy - 169, { size: 34, font: 'Nunito', weight: 900, color: '#ff5a4a', glow: 12, glowColor: 'rgba(255,90,70,.9)' });
  });
  FX.godRays(g, E.W * 0.31, E.H * 0.42, { count: 6, len: 1500, color: '#ffc27a', a: 0.07, t });
  return { GY: gy };
}

// 3. The office wall: a giant monitor. mode 'inbox' (n emails left), 'chart' (growth line, p 0..1), 'cold' (the 11:58 PM tired office)
export function officeWall(g, t, cam, o = {}) {
  const { mode = 'inbox', n = 1248, p = 1 } = o, gy = GYN();
  layer(g, cam, 0.4, (g) => {
    const cold = mode === 'cold';
    g.fillStyle = linGrad(g, 0, 0, 0, gy, cold ? ['#0a1220', '#16222f'] : ['#0b1a2a', '#17304a']); g.fillRect(-E.W, -E.H, E.W * 3, E.H + gy);
    // ceiling light strips
    for (let i = 0; i < 4; i++) { const x = E.W * (0.1 + i * 0.25), a = cold ? 0.35 + 0.15 * Math.sin(t * 30 + i * 9) * (i === 2 ? 1 : 0) : 0.5; rr(g, x, E.H * 0.04, E.W * 0.18, 16, 8); g.fillStyle = alpha(cold ? '#bcd8ff' : '#ffffff', a); g.fill(); glow(g, x + E.W * 0.09, E.H * 0.05, 260, cold ? '#9fc2ff' : '#ffffff', 0.12); }
    // city through the glass
    g.save(); g.beginPath(); g.rect(0, E.H * 0.5, E.W, gy - E.H * 0.5); g.clip(); const r = rng(11); for (let i = 0; i < 14; i++) { const w = 70 + r() * 90, h = 60 + r() * 220, x = i * 90 - 30; g.fillStyle = '#080d1e'; g.fillRect(x, gy - 60 - h, w, h); for (let k = 0; k < 8; k++) if (r() < 0.4) { g.fillStyle = alpha(cold ? '#6a7ca0' : '#ffcf7a', 0.5); g.fillRect(x + 8 + (k % 3) * 22, gy - 54 - h + 14 + Math.floor(k / 3) * 36, 12, 18); } } g.restore();
    // the giant monitor
    const mx = E.W * 0.1, my = E.H * 0.13, mw = E.W * 0.8, mh = E.H * 0.31;
    rr(g, mx - 14, my - 14, mw + 28, mh + 28, 22); g.fillStyle = '#05070c'; g.fill(); rr(g, mx, my, mw, mh, 14); g.fillStyle = cold ? '#0b1320' : '#0d1b2c'; g.fill(); glow(g, mx + mw / 2, my + mh / 2, mw * 0.7, cold ? '#6a8ad0' : CYAN, 0.1);
    if (mode === 'inbox') {
      const rows = Math.ceil(10 * clamp(n / 1248)), rh = mh / 10;
      for (let i = 0; i < rows; i++) { const y = my + i * rh + 8; circle(g, mx + 38, y + rh / 2 - 4, 16, ['#8a5ad6', '#ff7a8a', '#7fe3ff', '#ffd98a'][i % 4]); seg(g, [[mx + 78, y + rh / 2 - 12], [mx + 78 + 240 + (i * 53) % 160, y + rh / 2 - 12]], 8, alpha('#e8f4ff', 0.85)); seg(g, [[mx + 78, y + rh / 2 + 8], [mx + 78 + 380 + (i * 71) % 220, y + rh / 2 + 8]], 6, alpha('#9fb4d0', 0.5)); }
      if (rows === 0) text(g, 'INBOX ZERO', mx + mw / 2, my + mh / 2, { size: 80, font: 'Nunito', weight: 900, color: '#7dff9a', glow: 20, glowColor: 'rgba(100,255,150,.8)' });
    }
    if (mode === 'chart') {
      seg(g, [[mx + 50, my + mh - 40], [mx + mw - 40, my + mh - 40]], 5, '#6a7ca0'); seg(g, [[mx + 50, my + 30], [mx + 50, my + mh - 40]], 5, '#6a7ca0');
      const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; if (u > p) break; pts.push([mx + 70 + u * (mw - 160), my + mh - 50 - (u * u * 0.85 + u * 0.1) * (mh - 100) + Math.sin(u * 20) * 6]); }
      if (pts.length > 1) { seg(g, pts, 10, '#7dff9a'); const l = pts[pts.length - 1]; circle(g, l[0], l[1], 14, '#e8ffee'); glow(g, l[0], l[1], 120, '#7dff9a', 0.5); }
    }
    if (mode === 'cold') { text(g, '11:58 PM', mx + mw / 2, my + mh * 0.42, { size: 120, font: 'Nunito', weight: 900, color: '#8aa4d8', glow: 14, glowColor: 'rgba(130,160,220,.6)' }); text(g, 'STILL AT THE OFFICE', mx + mw / 2, my + mh * 0.78, { size: 38, font: 'Nunito', weight: 900, color: '#5a6c90', spacing: 4 }); }
  });
  layer(g, cam, 0.9, (g) => {
    floor(g, gy, mode === 'cold' ? '#1a2230' : '#1c2a3c', '#06090f');
    seg(g, [[-E.W, gy + 4], [E.W * 2, gy + 4]], 4, alpha(mode === 'cold' ? '#6a8ad0' : CYAN, 0.35));
    [[0.05, 1], [0.95, -1]].forEach(([x, f]) => { rr(g, E.W * x - 150, gy - 130, 300, 18, 6); g.fillStyle = '#0c121c'; g.fill(); rr(g, E.W * x - 60 * f - 50, gy - 250, 100, 110, 8); g.fillStyle = '#05070c'; g.fill(); rr(g, E.W * x - 60 * f - 44, gy - 244, 88, 98, 5); g.fillStyle = alpha(CYAN, 0.18); g.fill(); });
    const pl = (x) => { rr(g, x - 26, gy - 70, 52, 70, 8); g.fillStyle = '#2a2018'; g.fill(); for (let i = 0; i < 5; i++) { g.fillStyle = '#2f7a4a'; g.beginPath(); g.ellipse(x + (i - 2) * 20, gy - 100 - (i % 2) * 24, 14, 46, (i - 2) * 0.3, 0, Math.PI * 2); g.fill(); } };
    pl(E.W * 0.9);
  });
  return { GY: gy };
}

// 4. Golden-hour sky deck above a sea of clouds
export function skyDeck(g, t, cam) {
  const gy = GYN();
  layer(g, cam, 0.1, (g) => {
    sky(g, ['#241a5c', '#8a3f8f', '#ff6a7a', '#ffc27a']);
    const sx = E.W * 0.72, sy = E.H * 0.5; glow(g, sx, sy, 700, '#ffd9a0', 0.55); circle(g, sx, sy, 150, '#fff1d0');
    for (let i = 0; i < 4; i++) { const y = E.H * (0.5 + i * 0.045), c = ['#ff9a8a', '#d86a9a', '#8a4a9a', '#4a3a8a'][i]; g.fillStyle = alpha(c, 0.8); for (let k = 0; k < 8; k++) { const x = ((k * 330 + t * (6 + i * 4) * (i % 2 ? -1 : 1)) % (E.W * 1.6)) - 200; g.beginPath(); g.ellipse(x, y, 260, 34 + i * 6, 0, 0, Math.PI * 2); g.fill(); } }
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, gy, 0, gy + E.H * 0.4, ['#3a2a58', '#0c0818']); g.fillRect(-E.W, gy, E.W * 3, E.H);
    g.save(); g.globalAlpha = 0.25; g.fillStyle = linGrad(g, 0, gy, 0, gy + 400, ['#ffd9a0', 'rgba(255,217,160,0)']); g.beginPath(); g.moveTo(E.W * 0.55, gy); g.lineTo(E.W * 0.9, gy); g.lineTo(E.W * 1.15, gy + 420); g.lineTo(E.W * 0.3, gy + 420); g.fill(); g.restore();
    seg(g, [[-E.W, gy - 110], [E.W * 2, gy - 110]], 8, '#1a1230'); for (let x = -E.W; x < E.W * 2; x += 160) seg(g, [[x, gy - 110], [x, gy]], 8, '#1a1230');
    seg(g, [[-E.W, gy + 3], [E.W * 2, gy + 3]], 4, alpha('#ffd9a0', 0.5));
  });
  FX.godRays(g, E.W * 0.72, E.H * 0.5, { count: 8, len: 1900, color: '#ffd9a0', a: 0.06, t });
  return { GY: gy };
}

// 5. Night plaza with the hero's own tower rising (h 0..1)
export function risingTower(g, t, cam, o = {}) {
  const { h = 1 } = o, gy = GYN();
  layer(g, cam, 0.15, (g) => { sky(g, ['#0a0e30', '#1c2c72', '#6a3f98']); FX.stars(g, t, { count: 90, area: [0, 0, E.W, E.H * 0.4] }); });
  layer(g, cam, 0.4, (g) => towers(g, { y: gy - 20, seed: 21, minH: 300, maxH: 700, color: '#0c1238', edge: '#4b7bd6', lit: 0.35, t }));
  layer(g, cam, 0.8, (g) => {
    const tw = 230, th = lerp(160, 1180, ease.out(h)), tx = E.W * 0.68, ty = gy + 20;
    g.fillStyle = linGrad(g, tx, ty - th, tx + tw, ty, ['#6a8ad0', '#243a7a']); g.fillRect(tx, ty - th, tw, th);
    g.fillStyle = alpha('#d6f6ff', 0.25); g.fillRect(tx + 8, ty - th, 18, th); g.fillStyle = alpha('#05070c', 0.35); g.fillRect(tx + tw - 40, ty - th, 40, th);
    const rows = Math.floor(th / 54); for (let k = 0; k < rows; k++) for (let c = 0; c < 4; c++) { if (((k * 7 + c * 3) % 5) < 3) { g.fillStyle = alpha('#fff0b8', 0.55); g.fillRect(tx + 22 + c * 50, ty - th + 26 + k * 54, 30, 30); } }
    rr(g, tx + tw / 2 - 70, ty - th - 64, 140, 64, 14); g.fillStyle = '#05070c'; g.fill(); text(g, 'AI', tx + tw / 2, ty - th - 28, { size: 56, font: 'Nunito', weight: 900, color: CYAN, glow: 18, glowColor: 'rgba(80,210,255,.9)' }); glow(g, tx + tw / 2, ty - th - 30, 240, CYAN, 0.25);
    seg(g, [[tx + tw / 2, ty - th - 64], [tx + tw / 2, ty - th - 140]], 5, '#222a4a'); circle(g, tx + tw / 2, ty - th - 142, 7, '#ff4a4a');
  });
  layer(g, cam, 0.95, (g) => { floor(g, gy, '#171d40', '#05060f'); seg(g, [[-E.W, gy + 4], [E.W * 2, gy + 4]], 4, alpha(CYAN, 0.45)); });
  return { GY: gy };
}

// 6. Chat world: a giant glass phone UI behind the hero. msgs: [{at, who:'me'|'ai', str}] (times in shot seconds)
export function chatWorld(g, t, cam, o = {}) {
  const { msgs = [] } = o, gy = GYN();
  layer(g, cam, 0.15, (g) => { sky(g, ['#120a2e', '#2a1a5a', '#4a2a82']); const r = rng(3); for (let i = 0; i < 26; i++) { const x = r() * E.W, y = r() * E.H * 0.7, rad = 16 + r() * 50; circle(g, x + 30 * Math.sin(t * 0.4 + i), y, rad, alpha(i % 2 ? CYAN : '#b88cff', 0.07)); } });
  layer(g, cam, 0.5, (g) => {
    const px = E.W * 0.07, py = E.H * 0.215, pw = E.W * 0.86, ph = E.H * 0.37;
    rr(g, px, py, pw, ph, 46); g.fillStyle = alpha('#0a0a1e', 0.72); g.fill(); g.strokeStyle = alpha(CYAN, 0.6); g.lineWidth = 5; g.stroke(); glow(g, px + pw / 2, py + ph / 2, pw * 0.7, CYAN, 0.1);
    let y = py + 40;
    msgs.forEach((m) => {
      const k = ease.outBack(prog(t, m.at, m.at + 0.3)); if (k <= 0) return;
      const me = m.who === 'me', w = Math.min(pw * 0.78, 40 + m.str.length * 27), h = 92;
      g.save(); g.translate(me ? px + pw - 30 - w / 2 : px + 30 + w / 2, y + h / 2); g.scale(k, k);
      rr(g, -w / 2, -h / 2, w, h, 40); g.fillStyle = me ? '#f3eefc' : '#1d6f86'; g.fill();
      if (!me) { g.strokeStyle = CYAN; g.lineWidth = 3; g.stroke(); }
      text(g, m.str, 0, 5, { size: 46, font: 'Nunito', weight: 900, color: me ? '#1a1430' : '#eaffff' });
      g.restore(); y += h + 26;
    });
    const tm = msgs.find((m) => m.who === 'ai' && m.typing != null);
    if (tm && t > tm.typing && t < tm.at) { for (let i = 0; i < 3; i++) circle(g, px + 70 + i * 36, y + 40 + 8 * Math.sin(t * 10 + i), 11, alpha(CYAN, 0.9)); }
  });
  layer(g, cam, 0.95, (g) => { floor(g, gy, '#241a4a', '#07040f'); seg(g, [[-E.W, gy + 3], [E.W * 2, gy + 3]], 4, alpha(CYAN, 0.4)); });
  return { GY: gy };
}

// 7. Night food street: pasta bar (left, warm) and pizzeria (right, red), wet road
export function foodStreet(g, t, cam) {
  const gy = GYN();
  layer(g, cam, 0.15, (g) => { sky(g, ['#05070f', '#0f1530', '#1c1f4a']); });
  layer(g, cam, 0.6, (g) => {
    const shop = (x, w, body, neon, label, icon) => {
      g.fillStyle = body; g.fillRect(x, gy - 760, w, 780);
      for (let i = 0; i < 7; i++) { g.fillStyle = i % 2 ? alpha(neon, 0.9) : '#f2e8d8'; g.fillRect(x + i * (w / 7), gy - 470, w / 7, 70); }   // awning
      rr(g, x + 40, gy - 380, w - 80, 330, 18); g.fillStyle = alpha(neon, 0.18); g.fill(); g.strokeStyle = alpha(neon, 0.9); g.lineWidth = 6; g.stroke(); glow(g, x + w / 2, gy - 220, w * 0.8, neon, 0.3);
      icon(g, x + w / 2, gy - 215);
      rr(g, x + w / 2 - 150, gy - 640, 300, 110, 20); g.fillStyle = '#05070c'; g.fill(); text(g, label, x + w / 2, gy - 584, { size: 80, font: 'Nunito', weight: 900, color: neon, glow: 24, glowColor: alpha(neon, 0.9), alpha: 0.8 + 0.2 * Math.sin(t * 9) });
    };
    shop(-E.W * 0.02, E.W * 0.46, '#3a2a1c', '#ffb347', 'PASTA', (g, x, y) => {   // a steaming bowl of spaghetti
      g.fillStyle = '#f2e8d8'; g.beginPath(); g.arc(x, y, 120, 0, Math.PI); g.fill();
      g.strokeStyle = '#ffd36a'; g.lineWidth = 11; g.lineCap = 'round'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x - 70 + i * 28, y - 2, 34 + (i % 2) * 12, Math.PI, Math.PI * 2); g.stroke(); }
      circle(g, x - 30, y - 28, 22, '#d64a33'); circle(g, x + 36, y - 22, 18, '#d64a33');
      for (let i = 0; i < 3; i++) { g.strokeStyle = alpha('#ffffff', 0.35 - i * 0.08); g.lineWidth = 8; g.beginPath(); const sx = x - 50 + i * 50, s = (t * 40 + i * 30) % 80; g.moveTo(sx, y - 70 - s); g.quadraticCurveTo(sx + 16, y - 100 - s, sx, y - 130 - s); g.stroke(); }
    });
    shop(E.W * 0.56, E.W * 0.46, '#3a1c22', '#ff6b6b', 'PIZZA', (g, x, y) => {   // a pizza slice with pepperoni
      poly(g, [[x - 110, y - 90], [x + 110, y - 90], [x, y + 120]], '#f2c36a'); g.fillStyle = '#e8a23a'; g.fillRect(x - 118, y - 108, 236, 26);
      [[x - 40, y - 40], [x + 36, y - 30], [x - 6, y + 30]].forEach(([a, b]) => circle(g, a, b, 22, '#c33a3a')); circle(g, x + 30, y + 4, 8, '#2f7a4a');
      for (let i = 0; i < 3; i++) { g.strokeStyle = alpha('#ffffff', 0.3 - i * 0.07); g.lineWidth = 8; g.beginPath(); const sx = x - 50 + i * 50, s = (t * 40 + i * 30) % 80; g.moveTo(sx, y - 130 - s); g.quadraticCurveTo(sx + 16, y - 160 - s, sx, y - 190 - s); g.stroke(); }
    });
  });
  layer(g, cam, 0.9, (g) => {
    floor(g, gy, '#1a1c34', '#05060f');
    const r = rng(2); for (let i = 0; i < 20; i++) { const x = r() * E.W, c = i % 2 ? '#ffb347' : '#ff6b6b'; g.fillStyle = alpha(c, 0.1); g.fillRect(x, gy + 10, 16, 200 + r() * 160); }
  });
  return { GY: gy };
}

// 8. Red perspective grid with falling numerals (the reveal)
export function gridVoid(g, t, cam) {
  const hz = E.H * 0.62;
  g.fillStyle = '#05060a'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  glow(g, E.W / 2, hz, 1100, '#ff2a1a', 0.22);
  for (let i = -14; i <= 14; i++) seg(g, [[E.W / 2 + i * 10, hz], [E.W / 2 + i * E.W * 0.16, E.H]], 2, alpha('#ff4a3a', 0.35));
  for (let k = 0; k < 14; k++) { const u = ((k + (t * 0.5) % 1) / 14), y = hz + (E.H - hz) * u * u; seg(g, [[0, y], [E.W, y]], 2, alpha('#ff4a3a', 0.12 + 0.3 * u)); }
  const r = rng(4); for (let c = 0; c < 12; c++) { const x = r() * E.W, sp = 90 + r() * 140, ph = r() * E.H; for (let k = 0; k < 4; k++) { const y = ((t * sp + ph + k * 120) % (E.H + 300)) - 150; text(g, '364', x, y, { size: 44, font: 'Nunito', weight: 900, color: '#ff4a3a', alpha: (0.1 + 0.08 * k) * 0.8 }); } }
  return { GY: E.H * 0.8 };
}

// 9. The unlit bulbs: a void of hanging bulbs, most of them dark. lit 0..1 = share glowing
export function bulbVoid(g, t, cam, o = {}) {
  const { lit = 0.08 } = o, gy = E.H * 0.84;
  sky(g, ['#05070f', '#0c1226', '#141b36']);
  const r = rng(9);
  for (let i = 0; i < 34; i++) {
    const x = r() * E.W, len = E.H * (0.08 + r() * 0.5), br = 22 + r() * 28, on = r() < lit, fl = on ? 0.5 + 0.5 * Math.abs(Math.sin(t * 5 + i)) : 0;
    const sw = 12 * Math.sin(t * 0.8 + i), bx = x + sw, by = len;
    seg(g, [[x, -20], [bx, by]], 3, '#1c2438');
    g.fillStyle = on ? alpha('#fff3b0', 0.4 + 0.5 * fl) : 'rgba(120,140,190,.12)'; g.beginPath(); g.arc(bx, by + br, br, 0, Math.PI * 2); g.fill();
    g.strokeStyle = on ? alpha('#ffe9a0', 0.9) : 'rgba(150,170,220,.28)'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#1c2438'; g.fillRect(bx - br * 0.35, by - br * 0.1, br * 0.7, br * 0.45);
    if (on) glow(g, bx, by + br, br * 4, '#ffe08a', 0.35 * fl);
  }
  g.fillStyle = linGrad(g, 0, gy, 0, E.H, ['#1a2038', '#05060d']); g.fillRect(-E.W, gy, E.W * 3, E.H);
  g.fillStyle = alpha('#8a7aff', 0.12); g.beginPath(); g.ellipse(E.W / 2, gy + 4, 420, 40, 0, 0, Math.PI * 2); g.fill();
  return { GY: gy };
}

// 10. Soft bokeh / code nebula behind a close-up. tint: 'cyan' | 'gold' | 'dark'
export function bokeh(g, t, o = {}) {
  const { tint = 'cyan' } = o, P = { cyan: ['#050a1e', '#10265a', CYAN], gold: ['#1a1030', '#4a2a50', '#ffcf7a'], dark: ['#04060c', '#0a1020', '#6a7ca0'] }[tint];
  sky(g, [P[0], P[1]]); const r = rng(6);
  for (let i = 0; i < 34; i++) { const x = r() * E.W + 40 * Math.sin(t * 0.3 + i), y = ((r() * E.H * 1.2 - t * (8 + r() * 14)) % (E.H * 1.2) + E.H * 1.2) % (E.H * 1.2) - 40, rad = 22 + r() * 80; circle(g, x, y, rad, alpha(P[2], 0.05 + 0.07 * r())); }
  const code = ['0', '1', '{', '}', 'AI', '=>']; for (let c = 0; c < 10; c++) { const x = (c + 0.5) * (E.W / 10); for (let k = 0; k < 5; k++) { const y = ((t * 50 + c * 97 + k * 180) % (E.H + 200)) - 100; text(g, code[(c + k) % code.length], x, y, { size: 34, font: 'Nunito', weight: 900, color: P[2], alpha: tint === 'dark' ? 0.05 : 0.1 }); } }
}
