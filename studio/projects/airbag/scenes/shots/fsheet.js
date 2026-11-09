import { E, registerShot } from '/engine/core.js';
import { drawChar, drawHead, keys, A, EXPRESSIONS, carSide, roadSide, carFront } from '../sets/flat.js';
import { CAST } from '../sets/cast_flat.js';
registerShot('fsheet', { draw(g, t) {
  const W = E.W, H = E.H; roadSide(g, W, H, t * 200, { roadY: H * 0.78, roadH: 200 });
  const names = ['dad', 'mom', 'kid', 'breed', 'exec1', 'old'];
  names.forEach((n, i) => drawChar(g, 110 + (i % 3) * 330, 640 + Math.floor(i / 3) * 620, n === 'kid' ? 0.95 : 1.15, CAST[n], keys(t, [[0, { expr: ['happy', 'talk', 'laughing', 'curious', 'laughing', 'sad'][i], ...A(['wave', 'open', 'cheer', 'chin', 'belly', 'rest'][i]) }]], i)));
  const ex = EXPRESSIONS; ex.forEach((e, i) => { g.save(); g.translate(70 + (i % 9) * 118, 1360 + Math.floor(i / 9) * 130); drawHead(g, 46, CAST.dad, { expr: e, t }); g.restore(); });
  carSide(g, 540, 1880, 0.9, { color: '#3aa0d8', spin: t * 5 });
} });
