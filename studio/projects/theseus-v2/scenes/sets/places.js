// sets/places.js: harbor at dusk, shipyard, Athens colonnade, Hobbes' study, bedroom with mirror.
import { E, V, mood, layer, backdrop, rr, seg, poly, circle, glow, alpha, shade, mix, linGrad } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { sea } from './ship.js';

export const GY = () => E.H * V(0.8, 0.68);
export const SEA_Y = () => E.H * V(0.6, 0.5);

// Greek temple silhouette
export function temple(g, x, y, s, c) {
  g.save(); g.translate(x, y); g.scale(s, s);
  poly(g, [[-150, -150], [150, -150], [0, -215]], c); g.fillStyle = c; g.fillRect(-160, -150, 320, 18); g.fillRect(-170, -10, 340, 14);
  for (let i = 0; i < 7; i++) g.fillRect(-140 + i * 44, -132, 16, 122);
  g.restore();
}
export function acropolis(g, y, M, seed = 3) {
  const c = mix(M.sky[1], M.dark, 0.72);
  FX.hills(g, { y, amp: 70, color: c, seed, freq: 0.003 });
  temple(g, E.W * 0.32, y - 70, V(1, 0.9), c);
  for (let i = 0; i < 9; i++) { g.fillStyle = shade(c, -0.1); g.fillRect(E.W * 0.05 + i * 140, y - 40 - (i % 3) * 18, 70, 60); }
}

export function harbor(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), sy = SEA_Y();
  layer(g, cam, 0.1, (g) => {
    backdrop(g, M.sky);
    if (o.night) FX.stars(g, t, { count: 120, area: [-E.W, 0, E.W * 3, sy * 0.7] });
    FX.sun(g, E.W * 0.68, sy - V(120, 260), V(60, 70), o.night ? '#e8ecff' : '#fff3dc', o.night ? '#9fb4ff' : M.key, 5);
    FX.clouds(g, { y: sy - V(420, 820), h: 180, color: '#ffe7c7', a: 0.12, seed: 4 });
  });
  layer(g, cam, 0.3, (g) => acropolis(g, sy - 6, M));
  layer(g, cam, 0.6, (g) => sea(g, sy, t, M, { glowX: E.W * 0.68 }));
  layer(g, cam, 0.85, (g) => {   // stone pier on the left
    const py = GY() + V(40, 80);
    g.fillStyle = linGrad(g, 0, py - 60, 0, py + 400, [shade(M.wall, -0.2), shade(M.dark, -0.4)]);
    g.beginPath(); g.moveTo(-E.W, py - 40); g.lineTo(E.W * 0.22, py - 40); g.lineTo(E.W * 0.32, E.H * 2); g.lineTo(-E.W, E.H * 2); g.fill();
    seg(g, [[-E.W, py - 42], [E.W * 0.22, py - 42]], 4, alpha(M.rim, 0.45));
    for (let i = 0; i < 3; i++) { const bx = E.W * 0.05 + i * 110; g.fillStyle = shade(M.dark, -0.3); rr(g, bx, py - 90, 30, 52, 8); g.fill(); }
  });
  return { M, GY: GY(), SY: sy, CX: E.W / 2 };
}

export function shipyard(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), gy = GY();
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * 0.2, gy - V(460, 700), 60, '#fff3dc', M.key, 6); acropolis(g, gy - V(300, 420), M, 9); });
  layer(g, cam, 0.5, (g) => {     // timber shed frame
    const c = shade(M.wall, -0.45);
    for (let i = -3; i <= 3; i++) { const x = E.W / 2 + i * V(380, 300); seg(g, [[x, gy], [x, gy - V(700, 980)]], 26, c); }
    seg(g, [[-E.W, gy - V(700, 980)], [E.W * 2, gy - V(700, 980)]], 30, c);
    for (let i = -6; i <= 6; i++) seg(g, [[E.W / 2 + i * 160, gy - V(700, 980)], [E.W / 2 + i * 160 + 120, gy - V(820, 1100)]], 10, c);
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, gy, 0, gy + 500, [shade(M.floor, -0.15), shade(M.dark, -0.3)]); g.fillRect(-E.W, gy, E.W * 3, E.H * 2);
    FX.floorLines(g, gy, gy + 600, 'rgba(0,0,0,.25)', 0.08);
    FX.pool(g, E.W / 2, gy + 30, 520, 60, M.key, 0.16);
  });
  return { M, GY: gy, CX: E.W / 2 };
}

export function colonnade(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), gy = GY();
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * 0.5, gy - V(380, 620), 70, '#fff3dc', M.key, 6); acropolis(g, gy - V(220, 360), M, 5); });
  layer(g, cam, 0.55, (g) => {
    const c = shade(M.wall, -0.35), top = gy - V(640, 900);
    g.fillStyle = c; g.fillRect(-E.W, top - 70, E.W * 3, 70); poly(g, [[-E.W, top - 70], [E.W * 2, top - 70], [E.W / 2, top - 200]], shade(c, -0.15));
    for (let i = -4; i <= 4; i++) { const x = E.W / 2 + i * V(300, 250); g.fillStyle = linGrad(g, x - 34, 0, x + 34, 0, [shade(c, -0.25), shade(c, 0.12), shade(c, -0.3)]); g.fillRect(x - 34, top, 68, gy - top); FX.godRays(g, x + V(150, 125), top + 40, { count: 1, len: gy - top, color: M.key, a: 0.05 }); }
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 500, [shade(M.floor, 0.05), shade(M.dark, -0.3)]); g.fillRect(-E.W, gy, E.W * 3, E.H * 2); FX.floorLines(g, gy, gy + 600, 'rgba(0,0,0,.2)', 0.1); });
  return { M, GY: gy, CX: E.W / 2 };
}

export function study(g, t, cam, o = {}) {
  const M = mood('night'), gy = GY(), wall = shade(M.wall, -0.35);
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, 0, 0, gy, [shade(wall, -0.3), wall]); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 2 + gy);
    const wx = E.W / 2 + V(260, 120), wy = gy - V(760, 1000), ww = V(360, 340), wh = V(460, 520);
    FX.windowFrame(g, { x: wx - ww / 2, y: wy, w: ww, h: wh, cols: 2, rows: 3, frame: shade(wall, -0.5), bar: 10 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]); FX.moon(g, x + w * 0.6, y + h * 0.3, 40); FX.stars(g, 0, { count: 30, area: [x, y, w, h] });
    });
    FX.godRays(g, wx, wy + 40, { count: 5, len: V(900, 1200), color: '#bcd0ff', a: 0.06 });
    for (let i = 0; i < 5; i++) { g.fillStyle = shade(['#5a2a2a', '#2a3a5a', '#4a4a2a'][i % 3], -0.3); g.fillRect(E.W / 2 - V(620, 480) + i * 40, gy - V(560, 720), 32, 120 + (i % 2) * 20); }
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 400, [shade(M.floor, -0.25), '#08070c']); g.fillRect(-E.W, gy, E.W * 3, E.H * 2); });
  return { M, GY: gy, CX: E.W / 2 };
}

export function bedroom(g, t, cam, o = {}) {
  const M = mood('night'), gy = GY(), wall = shade(M.wall, -0.3);
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, 0, 0, gy, [shade(wall, -0.4), wall]); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 2 + gy);
    const wx = E.W / 2 - V(560, 420);
    FX.windowFrame(g, { x: wx - 160, y: gy - V(780, 1000), w: 320, h: 440, cols: 2, rows: 2, frame: shade(wall, -0.5), bar: 9 }, (g, x, y, w, h) => {
      backdrop(g, M.sky, [x, y, w, h]); FX.skyline(g, { x, y: y + h * 0.55, w, minH: 40, maxH: h * 0.45, color: '#0c0e1a', windowColor: alpha(M.practical, 0.8), lit: 0.4, seed: 3 });
    });
    glow(g, E.W / 2 + V(420, 300), gy - V(300, 420), 260, M.practical, 0.25);
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 400, [shade(M.floor, -0.2), '#08070c']); g.fillRect(-E.W, gy, E.W * 3, E.H * 2); });
  return { M, GY: gy, CX: E.W / 2 };
}
