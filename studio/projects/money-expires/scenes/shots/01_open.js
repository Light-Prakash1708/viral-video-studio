// shots/01_open.js: cold open. Wallet macro (3D), the 500 note's timer, the bank app, the Earth title, the first burn.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, seg, rr, circle, glow, alpha, shade, mix, text, linGrad, radGrad, shake, S } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { note, ashFall, embers, phoneApp, armIn, bokehBG, local, fmtT, EMBER, GOLD, HOT } from '../sets/money.js';
import { interior } from '../sets/india.js';
import { darkStage, bokeh, motes } from '../sets/hand3d.js';
import { wallet3D, note3D, earth3D, starfield, glowSprite } from '../sets/money3d.js';
import { YOU } from '../cast.js';

// m01: "You open your wallet, and every note has a timer." macro of a wallet opening on a dark table
registerShot('m01', { kind: '3d',
  init(T) { const st = darkStage(T, { fov: 36, key: 2.6, ambient: 1.0 }); st.scene.fog.near = 3; st.scene.fog.far = 14;
    const w = wallet3D(T, st, { open: 0, notes: [{ timer: '30 DAYS' }, { timer: '30 DAYS', value: '100', pal: 'r100' }, { timer: '30 DAYS', value: '2000', pal: 'r2000' }] });
    const bk = bokeh(T, st, 30); const mt = motes(T, st, 50, '#ffb060');
    const warm = new T.THREE.PointLight(0xff9a4a, 3, 4, 2); warm.position.set(0, 0.6, 0.4); st.add(warm);
    return { stage: st, w, bk, mt, warm }; },
  draw(s, t, info, T) { const k = ease.inOut(prog(t, 0.15, 1.5)); s.w.open(k);
    s.w.notes.forEach((n, i) => n.draw({ timer: t < 2.2 ? '30 DAYS' : fmtT(30 * 86400 - (t - 2.2) * 1 - i * 3600), t, urgent: 0 }));
    s.warm.intensity = 0.4 + 0.9 * k; s.bk.tick(t); s.mt.tick(t, 0.6, [0, 0.2, 0]);
    T.dolly(s.stage.camera, t, [[0, { pos: [0.9, 0.5, 2.5], look: [0.1, 0.12, 0] }], [info.dur, { pos: [0.35, 1.6, 1.55], look: [0.15, 0.12, -0.2] }]]); },
});

// m02: "Your 500 rupee note says 30 days." the hero note fills the frame, the timer strip glows and ticks
registerShot('m02', { draw(g, t, info) {
  bokehBG(g, t, { top: '#04080a', bot: '#1c120c', seed: 7 });
  const cam = { z: 1 + 0.08 * ease.inOut(t / info.dur), x: -20 + 40 * t / info.dur };
  const d = local(info, t, '30', 2.2);
  layer(g, cam, 1, (g) => {
    glow(g, E.W * 0.5, E.H * 0.52, 700, EMBER, 0.12);
    note(g, E.W * 0.52, E.H * 0.47, 1.85, { t, rot: -0.06 + 0.02 * Math.sin(t * 0.8), timer: t < d + 0.6 ? '30 DAYS' : fmtT(30 * 86400 - 1 - (t - d - 0.6)) });
    armIn(g, E.W * 0.27, E.H * 0.8, 0.72, -0.55, { sleeve: YOU.color, rim: '#ffb070', grip: 0.7 });
  });
  // pulse ring on the timer when "30 days" is said
  const k = prog(t, d, d + 0.9); if (k > 0 && k < 1) { const tx = E.W * 0.52 + 189 * 1.85, ty = E.H * 0.47 + 82 * 1.85; FX.rings(g, tx - 30, ty - 10, k, { count: 2, r0: 120, r1: 420, color: GOLD, a: 0.6 * (1 - k), speed: 1 }); }
  blurLayer(g, 10, (g) => { embers(g, t, { count: 26, seed: 3, a: 0.7 }); }, cam, 1.6);
  FX.dust(g, t, { count: 40, color: '#ffd8a8', a: 0.4 });
} });

// m03: "Your bank app says the same thing." phone in hand, app shows the same countdown
registerShot('m03', { draw(g, t, info) {
  const cam = { z: 1.05 + 0.05 * ease.inOut(t / info.dur), x: 30 - 30 * t / info.dur };
  blurLayer(g, 12, (g) => interior(g, t, { z: 1, x: 0 }, { kind: 'apartment', sky: 'night', winX: 380, day: 1 }), null);
  veil(g, '#04080c', 0.45);
  layer(g, cam, 1, (g) => {
    glow(g, E.W * 0.47, E.H * 0.42, 620, '#5fd8d0', 0.16);
    armIn(g, E.W * 0.86, E.H * 1.02, 0.7, -2.55, { sleeve: YOU.color, rim: '#9fe8f0', grip: 0.3 });
    phoneApp(g, E.W * 0.47, E.H * 0.47, 1.12, { t, tilt: 0.05, timer: fmtT(30 * 86400 - 2 - t).replace(/^(\d\d):(\d\d):(\d\d):(\d\d)$/, '$1d $2h $3m $4s') });
  });
  const s = local(info, t, 'same', 1.1); const k = prog(t, s, s + 0.8);
  if (k > 0 && k < 1) FX.rings(g, E.W * 0.47, E.H * 0.47 - 760 * 1.12 / 2 + 400 * 1.12, k, { count: 2, r0: 100, r1: 300, color: EMBER, a: 0.6 * (1 - k), speed: 1 });
  FX.dust(g, t, { count: 30, color: '#bff0ff', a: 0.3 });
} });

// m04: "Every rupee on Earth now expires after 30 days." TITLE over a turning Earth ringed by glowing notes
registerShot('m04', { kind: '3d',
  init(T) { const st = T.stage({ mood: 'night', fov: 34, sky: ['#02060a', '#06121a'], fog: false, ambient: 0.5, ambientSky: '#3a6a80', keyColor: '#ffe6c8', keyIntensity: 2.8, keyPos: [-6, 3, 6], bloom: 0.55, bloomThreshold: 0.86 });
    const e = earth3D(T, st, { r: 2, night: false, atm: '#5ad0e0' }); starfield(T, st);
    const ring = new T.THREE.Group(); st.add(ring); const notes = [];
    for (let i = 0; i < 14; i++) { const n = note3D(T, { w: 0.62, note: { timer: '30 DAYS', value: ['500', '100', '2000'][i % 3], pal: ['r500', 'r100', 'r2000'][i % 3] }, emissive: 0.45 }); const a = (i / 14) * Math.PI * 2; n.position.set(Math.cos(a) * 3.0, Math.sin(a * 2) * 0.25, Math.sin(a) * 3.0); n.lookAt(0, n.position.y, 0); n.rotateY(Math.PI); ring.add(n); notes.push(n); }
    ring.rotation.z = 0.32; ring.rotation.x = 0.18;
    const rim = new T.THREE.PointLight(0xff9a4a, 6, 12, 2); rim.position.set(4, 1, -3); st.add(rim);
    glowSprite(T, st, '#ff8a3a', 9, [3, -1, -6], 0.18);
    return { stage: st, e, ring, notes }; },
  draw(s, t, info, T) { s.e.rotation.y = -1.2 + t * 0.12; s.ring.rotation.y = t * 0.35; s.notes.forEach((n, i) => i % 3 === 0 && n.draw({ timer: '30 DAYS', t }));
    T.dolly(s.stage.camera, t, [[0, { pos: [0.8, 1.7, 9.6], look: [0, 1.15, 0] }], [info.dur, { pos: [-0.4, 1.5, 8.4], look: [0, 1.05, 0] }]]); },
  overlay(g, t, info) {
    g.fillStyle = linGrad(g, 0, 0, 0, E.H * 0.42, ['rgba(2,4,8,.85)', 'rgba(2,4,8,0)']); g.fillRect(0, 0, E.W, E.H * 0.42);
    const a = ease.out(prog(t, 0.15, 0.6)), b = ease.out(prog(t, local(info, t, 'expires', 1.5) - 0.1, local(info, t, 'expires', 1.5) + 0.35));
    text(g, 'WHAT IF MONEY', E.W / 2, E.H * 0.12, { size: 92, color: '#fff1dc', spacing: 10, glow: 24, glowColor: 'rgba(255,170,90,.55)', alpha: a });
    g.save(); g.translate(E.W / 2, E.H * 0.235); const sc = 0.85 + 0.15 * ease.outBack(b); g.scale(sc, sc);
    text(g, 'EXPIRED EVERY 30 DAYS?', 0, 0, { size: 84, color: '#ffb35a', spacing: 6, glow: 30, glowColor: alpha(EMBER, 0.9), alpha: b }); g.restore();
  },
});

// m05: "When the timer hits zero the money burns. Gone." countdown to zero, ember burn, ash
registerShot('m05', { draw(g, t, info) {
  const z0 = local(info, t, 'zero', 0.9), bn = local(info, t, 'burns', 2.0), gone = local(info, t, 'gone', 2.9);
  const sh = t > bn ? shake(t, 14 * Math.exp(-(t - bn) * 4), 9) : [0, 0];
  bokehBG(g, t, { top: '#030406', bot: mix('#1c120c', '#3a1406', prog(t, z0, bn)), seed: 11, a: 1 - 0.5 * prog(t, gone, gone + 0.6) });
  const cam = { z: 1.1 + 0.1 * ease.inOut(t / info.dur), x: sh[0], y: sh[1] };
  const secs = Math.max(0, Math.ceil(3 * (1 - t / z0) - 0.001)), burn = ease.in(prog(t, z0 + 0.3, gone + 0.25)) * 0.85 + 0.15 * prog(t, z0 + 0.3, gone + 0.25);
  layer(g, cam, 1, (g) => {
    glow(g, E.W * 0.5, E.H * 0.5, 800, EMBER, 0.1 + 0.4 * burn * (1 - prog(t, gone, gone + 0.8)));
    note(g, E.W * 0.5, E.H * 0.5, 1.6, { t, rot: 0.04, timer: '00:00:00:0' + secs, urgent: clamp(t / z0), burn, seed: 5 });
  });
  if (t > z0 && t < z0 + 0.15) veil(g, '#ff5a2a', 0.25 * (1 - prog(t, z0, z0 + 0.15)), 'lighter');
  const fk = prog(t, bn, bn + 0.35); if (fk > 0 && fk < 1) veil(g, '#ffd8a0', 0.5 * (1 - fk), 'lighter');
  embers(g, t, { count: 60, seed: 9, a: clamp(burn * 1.5) * (1 - prog(t, gone + 0.3, info.dur)) });
  ashFall(g, t, { count: 90, seed: 4, a: prog(t, bn + 0.3, gone), ember: 0.15 });
} });
