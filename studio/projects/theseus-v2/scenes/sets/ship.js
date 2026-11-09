// sets/ship.js: the Ship of Theseus as a reusable prop. Planks swap old -> new by `replaced` (0..N).
import { E, V, seg, poly, circle, rr, glow, alpha, shade, mix, linGrad } from '/engine/core.js';

export const ROWS = 4, COLS = 7, N = ROWS * COLS;
const ORDER = [9, 2, 17, 13, 5, 22, 0, 19, 11, 7, 15, 3, 20, 8, 23, 1, 14, 10, 18, 4, 21, 12, 6, 16, 26, 24, 27, 25];
export const RANK = ORDER.reduce((a, p, i) => ((a[p] = i), a), []);
export const OLD = '#3b2418', NEW = '#d9954a';

function hull(g) {
  g.beginPath(); g.moveTo(-360, -20); g.lineTo(360, -20);
  g.bezierCurveTo(345, 70, 260, 150, 150, 160); g.lineTo(-150, 160);
  g.bezierCurveTo(-260, 150, -345, 70, -360, -20); g.closePath();
}
// pf(id) -> 0..1 newness of a plank. Default from `replaced`.
export function drawShip(g, x, y, s, o = {}) {
  const { replaced = 0, wood = null, rim = '#ffc68a', sail = '#efe2c8', t = 0, plankFn = null, hideHull = false, old = OLD, fresh = NEW, ink = '#0e0b12', alphaHull = 1 } = o;
  const pf = (id) => plankFn ? plankFn(id) : wood ? (wood === 'new' ? 1 : 0) : Math.max(0, Math.min(1, replaced - RANK[id]));
  g.save(); g.translate(x, y + Math.sin(t * 1.4) * 5); g.rotate(Math.sin(t * 0.9) * 0.012); g.scale(s, s);
  // mast + yard + sail
  seg(g, [[0, -20], [0, -560]], 14, ink);
  seg(g, [[-250, -500], [250, -500]], 10, ink);
  g.beginPath(); g.moveTo(-245, -495); g.quadraticCurveTo(-200, -300, -270, -110); g.lineTo(270, -110); g.quadraticCurveTo(200, -300, 245, -495); g.closePath();
  g.fillStyle = linGrad(g, -260, 0, 260, 0, [shade(sail, -0.35), sail, shade(sail, -0.15)]); g.fill();
  g.fillStyle = alpha('#b8402f', 0.85); g.fillRect(-250, -330, 500, 34);
  seg(g, [[0, -560], [-345, -30]], 3, alpha(ink, 0.8)); seg(g, [[0, -560], [345, -30]], 3, alpha(ink, 0.8));
  poly(g, [[0, -560], [90, -535], [0, -510]], '#d64a33');
  // curled stern + prow
  seg(g, [[350, -20], [395, -110], [372, -150], [345, -128]], 18, ink);
  seg(g, [[-350, -20], [-410, -70], [-445, -60]], 16, ink);
  if (!hideHull) {
    g.save(); hull(g); g.clip();
    const pw = 730 / COLS, ph = 182 / ROWS;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const id = r * COLS + c, p = pf(id), hop = Math.sin(p * Math.PI) * 30;
      const px = -365 + c * pw + (r % 2 ? -pw / 2 : 0), py = -20 + r * ph - hop;
      for (const dx of r % 2 && c === COLS - 1 ? [0, pw] : [0]) {
        g.globalAlpha = alphaHull; g.fillStyle = mix(old, fresh, p); g.fillRect(px + dx + 2, py + 2, pw - 4, ph - 4);
        g.fillStyle = alpha(mix('#000000', '#fff2d0', p), 0.18); g.fillRect(px + dx + 2, py + 2, pw - 4, 4);
      }
      if (p > 0.05 && p < 0.95) glow(g, px + pw / 2, py + ph / 2, 90, '#ffd27a', 0.5 * Math.sin(p * Math.PI));
    }
    g.restore();
    // rail + rim light on the deck edge
    seg(g, [[-362, -22], [362, -22]], 12, ink);
    seg(g, [[-355, -30], [355, -30]], 4, rim);
    // oar ports
    for (let i = -4; i <= 4; i++) circle(g, i * 70, 10, 8, alpha(ink, 0.8));
  }
  g.restore();
}

// Sea from y down, coloured by the mood, with moving wave highlights.
export function sea(g, y, t, M, o = {}) {
  const { glowX = E.W / 2 } = o;
  g.fillStyle = linGrad(g, 0, y, 0, y + E.H, [mix(M.sky[M.sky.length - 1], M.dark, 0.45), shade(M.dark, -0.35), '#06050a']);
  g.fillRect(-E.W, y, E.W * 3, E.H * 2);
  g.fillStyle = alpha(M.key, 0.22); g.beginPath(); g.moveTo(glowX - 40, y); g.lineTo(glowX + 40, y); g.lineTo(glowX + 260, y + 700); g.lineTo(glowX - 260, y + 700); g.fill();
  for (let i = 0; i < 26; i++) {
    const yy = y + 14 + i * i * 2.2, ph = t * (0.6 + i * 0.03) + i * 1.7;
    for (let k = -3; k < 6; k++) {
      const xx = ((k * 260 + i * 97 + ph * 60) % (E.W + 600)) - 300, w = 50 + i * 6;
      g.fillStyle = alpha(M.rim, 0.22 - i * 0.006); g.fillRect(xx, yy, w, 2 + i * 0.12);
    }
  }
}
