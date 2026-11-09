// shots/02_day1.js: DAY 1 chaos and the boom: calendar, mall rush, restaurant queue, jet ski in Delhi, the economy, velocity of money.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, seg, rr, poly, circle, ring, glow, alpha, shade, mix, text, linGrad, radGrad, shake, rng, backdrop, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { note, ashFall, embers, calendar, dayHUD, chart, arrow, coin, bokehBG, local, fmtT, EMBER, GOLD, HOT, TEAL } from '../sets/money.js';
import { street, restaurant, interior, building, autoRick, car, GY } from '../sets/india.js';
import { fig, runner, bag, flyNote, people, blinkAt } from '../sets/act.js';
import { word } from '../sets/cine.js';
import { cite } from '../sets/longform.js';
import { YOU, NEIGH, ECON, POOR } from '../cast.js';
import { glowSprite } from '../sets/money3d.js';

const GREEN = '#5fe88a';
// m06: "Day 1. Total chaos." the DAY 1 card over a blurred rushing street
registerShot('m06', { draw(g, t, info) {
  const cam = { z: 1.1 + 0.05 * t, x: -t * 60 };
  blurLayer(g, 9, (g) => { street(g, t, cam, { mood: 'dusk', seed: 2, autos: true }); layer(g, cam, 1, (g) => { for (let i = 0; i < 9; i++) runner(g, ((i * 260 + t * 520) % (E.W + 600)) - 300, GY() + (i % 3) * 18, 1.0, t, { seed: i, outfit: i % 4 === 0 ? YOU : {} }); }); });
  veil(g, '#05080c', 0.5);
  const k = ease.outBack(prog(t, 0, 0.35)); calendar(g, t, { to: 1, s: 0.82 * (0.6 + 0.4 * k), a: prog(t, 0, 0.15), y: E.H * 0.43, sub: 'TOTAL CHAOS', flipAt: local(info, t, 'total', 1.0) - 0.4 });
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.45, count: 50, a: 0.12 * prog(t, 0.9, 1.2), inner: 420, color: '#ffd8a8' });
} });

// m07: "Everyone runs to spend. Malls are packed." shoppers sprint down the street into a packed mall
registerShot('m07', { draw(g, t, info) {
  const m = local(info, t, 'malls', 1.84), cam = { x: key(t, [[0, -520], [m, -80], [info.dur, 0]]), z: key(t, [[0, 1.0], [m, 1.04], [info.dur, 1.14]]) };
  const { M } = street(g, t, cam, { mood: 'dusk', mall: true, seed: 3, lamps: true });
  layer(g, cam, 0.5, (g) => { FX.crowd(g, t, { x: E.W * 0.5 - 230, y: GY() - 10, w: 460, rows: 5, rowH: 24, size: 0.9, color: shade(M.dark, -0.2), wave: 1 }); });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 10; i++) { const x = -700 + i * 190 + t * 560 - (i % 3) * 90; runner(g, x, GY() + 30 + (i % 3) * 22, 1.0 + (i % 3) * 0.08, t, { seed: i + 3, outfit: i === 4 ? YOU : i === 7 ? NEIGH : {}, bags: 1 + (i % 2), rim: M.rim }); } });
  blurLayer(g, 12, (g) => { for (let i = 0; i < 4; i++) runner(g, -400 + i * 640 + t * 700, GY() + 300, 2.1, t, { seed: i + 20, bags: 1, rim: M.rim }); }, cam, 1.7);
  dayHUD(g, 1, t);
} });

// m08: "Restaurants have three-hour waiting lists." a queue snakes down the pavement past a 3 HRS board
registerShot('m08', { draw(g, t, info) {
  const cam = { x: lerp(-260, 120, ease.inOut(t / info.dur)), z: 1.02 + 0.04 * t / info.dur };
  const { M } = restaurant(g, t, cam);
  const th = local(info, t, 'three', 0.7);
  layer(g, cam, 1, (g) => {
    const gy = GY();
    for (let i = 0; i < 15; i++) { const x = E.W * 0.5 - i * 112, slp = i === 6, ph = i === 3 || i === 10;
      fig(g, { x, y: gy + 20 + (i % 2) * 14, s: 0.95, facing: 1, outfit: i === 8 ? YOU : {}, pose: slp ? 'sad' : ph ? 'phone' : ['stand', 'crossArms', 'relaxed', 'handsOnHead'][i % 4], expr: slp ? 'sleepy' : t > th ? ['worried', 'nervous', 'sad', 'confused'][i % 4] : 'neutral', t, seed: i, rim: '#ffc078', rimDir: [1, -0.4], prop: ph ? { type: 'phone' } : null }); }
    // A-frame waiting board
    const bx = E.W * 0.84, k = ease.outBack(prog(t, th - 0.2, th + 0.2));
    poly(g, [[bx - 110, gy + 30], [bx - 70, gy - 260], [bx + 70, gy - 260], [bx + 110, gy + 30]], '#1a1410');
    rr(g, bx - 96, gy - 250, 192, 240, 10); g.fillStyle = '#16241c'; g.fill(); g.strokeStyle = '#6a4a2a'; g.lineWidth = 8; g.stroke();
    text(g, 'WAITING TIME', bx, gy - 200, { size: 26, font: 'Nunito', weight: 900, color: '#e8e4d8', spacing: 2 });
    g.save(); g.translate(bx, gy - 110); g.scale(k, k); text(g, '3 HRS', 0, 0, { size: 64, font: 'Nunito', weight: 900, color: '#ffb35a', glow: 14, glowColor: alpha(EMBER, 0.8) }); g.restore();
  });
  blurLayer(g, 12, (g) => { people(g, t, -400, E.W * 0.4, GY() + 330, 2.0, { seed: 9, step: 420 }); }, cam, 1.7);
  dayHUD(g, 1, t);
} });

// m09: "Your neighbour buys a jet ski. He lives in Delhi." 3D: the jet ski strapped to a car roof, crane up to the jam
registerShot('m09', { kind: '3d',
  init(T) { const { THREE } = T; const st = T.stage({ mood: 'dusk', fov: 40, sky: ['#0c1a2a', '#3a4a50', '#c8763e', '#ffb060'], fogColor: '#8a5a40', fog: [30, 140], ambient: 2.8, ambientSky: '#e0a070', keyColor: '#ffc890', keyIntensity: 3.0, keyPos: [14, 16, 22], bloom: 0.5, bloomThreshold: 0.88 });
    st.add(T.ground(300, 300, '#2a2420')); st.add(T.box(300, 0.02, 9, T.mat('#1c1a1a'), 0, 0.01, 0));
    for (let x = -60; x < 60; x += 6) st.add(T.box(2.4, 0.03, 0.18, T.basic('#8a8070'), x, 0.03, 1.5), T.box(2.4, 0.03, 0.18, T.basic('#8a8070'), x, 0.03, -1.5));
    const r = (() => { let s = 7; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
    const carCols = ['#e8e4dc', '#2a5ac8', '#c8281e', '#f0f0ec', '#e8c21a', '#3aa07a'];
    // realistic-ish low-poly cars: extruded sedan side profile with bevels, tinted glass, lights, rims
    const glassM = new THREE.MeshStandardMaterial({ color: 0x1a2a3a, roughness: 0.08, metalness: 0.6 }), tyreM = T.mat('#111112', { roughness: 0.9 }), rimM = T.mat('#c8ccd2', { metalness: 0.85, roughness: 0.25 });
    const headM = new THREE.MeshBasicMaterial({ color: 0xfff2d0 }), tailM = new THREE.MeshBasicMaterial({ color: 0xff2a1a }), chromeM = T.mat('#9aa0a8', { metalness: 0.9, roughness: 0.3 });
    const body = new THREE.Shape(); body.moveTo(-2.05, 0.35); body.lineTo(2.05, 0.35); body.quadraticCurveTo(2.15, 0.62, 2.0, 0.78); body.lineTo(1.05, 0.9); body.quadraticCurveTo(0.55, 1.42, 0.05, 1.45); body.lineTo(-0.85, 1.45); body.quadraticCurveTo(-1.3, 1.4, -1.55, 0.95); body.lineTo(-2.0, 0.88); body.quadraticCurveTo(-2.15, 0.6, -2.05, 0.35);
    const bodyGeo = new THREE.ExtrudeGeometry(body, { depth: 1.5, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.1, bevelSegments: 4, curveSegments: 14 }); bodyGeo.translate(0, 0, -0.75);
    const win = new THREE.Shape(); win.moveTo(0.95, 0.95); win.quadraticCurveTo(0.5, 1.36, 0.05, 1.38); win.lineTo(-0.8, 1.38); win.quadraticCurveTo(-1.2, 1.33, -1.42, 0.97); win.closePath();
    const winGeo = new THREE.ExtrudeGeometry(win, { depth: 1.62, bevelEnabled: false }); winGeo.translate(0, 0, -0.81);
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 24), rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.3, 12);
    const mkCar = (x, z, col) => { const g = new THREE.Group(); const paint = T.mat(col, { roughness: 0.28, metalness: 0.35 });
      const bm = new THREE.Mesh(bodyGeo, paint); bm.castShadow = true; g.add(bm); g.add(new THREE.Mesh(winGeo, glassM));
      g.add(T.box(0.08, 0.04, 1.5, chromeM, 0.1, 0.92, 0)); // pillar line
      for (const zz of [0.55, -0.55]) { const h = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.34), headM); h.position.set(2.15, 0.66, zz); g.add(h); const tl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.38), tailM); tl.position.set(-2.16, 0.74, zz); g.add(tl); }
      g.add(T.box(0.12, 0.14, 1.7, T.mat('#1a1a1c'), 2.18, 0.42, 0), T.box(0.12, 0.14, 1.7, T.mat('#1a1a1c'), -2.18, 0.42, 0));
      for (const [wx, wz] of [[-1.3, 0.82], [1.3, 0.82], [-1.3, -0.82], [1.3, -0.82]]) { const w = new THREE.Mesh(wheelGeo, tyreM); w.rotation.x = Math.PI / 2; w.position.set(wx, 0.38, wz); g.add(w); const r2 = new THREE.Mesh(rimGeo, rimM); r2.rotation.x = Math.PI / 2; r2.position.set(wx, 0.38, wz); g.add(r2); }
      const tlight = new THREE.PointLight(0xff3020, 1.2, 4, 2); tlight.position.set(-2.4, 0.8, 0); g.add(tlight);
      g.position.set(x, 0, z); g.userData.bob = r() * 6; g.userData.x0 = x; st.add(g); cars.push(g); return g; };
    // auto-rickshaw: three wheels, green body, yellow canopy, open sides
    const mkAuto = (x, z) => { const g = new THREE.Group(); const green = T.mat('#1f7a3a', { roughness: 0.4, metalness: 0.2 }), yel = T.mat('#f0c020', { roughness: 0.5 });
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 12), green); nose.scale.set(0.9, 1.1, 1.0); nose.position.set(1.0, 0.85, 0); g.add(nose);
      g.add(T.box(1.9, 0.5, 1.3, green, -0.15, 0.6, 0), T.box(0.08, 1.0, 1.3, T.mat('#141414'), 0.35, 1.3, 0));
      const can = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 2.1, 24, 1, false, 0, Math.PI), yel); can.rotation.set(0, 0, Math.PI / 2); can.rotation.y = Math.PI / 2; can.scale.set(1, 1, 0.5); can.position.set(-0.1, 1.75, 0); g.add(can);
      for (const zz of [-0.62, 0.62]) g.add(T.box(0.05, 1.0, 0.05, T.mat('#202020'), -1.05, 1.3, zz));
      const hl = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), headM); hl.position.set(1.5, 0.95, 0); hl.rotation.y = Math.PI / 2; g.add(hl);
      for (const [wx, wz] of [[1.1, 0], [-0.85, 0.62], [-0.85, -0.62]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 18), tyreM); w.rotation.x = Math.PI / 2; w.position.set(wx, 0.28, wz); g.add(w); }
      g.position.set(x, 0, z); g.userData.bob = r() * 6; g.userData.x0 = x; st.add(g); cars.push(g); return g; };
    const cars = [];
    for (let lane = -1; lane <= 1; lane++) for (let x = -56; x < 40; x += 5.2 + r() * 1.5) { if (lane === 0 && Math.abs(x) < 4) continue; (r() < 0.3 ? mkAuto : mkCar)(x, lane * 3, carCols[Math.floor(r() * carCols.length)]); }
    const hero = mkCar(0, 0, '#d8d4cc'); hero.userData.hero = true;
    // the jet ski on the roof
    const js = new THREE.Group(); const hull = T.mat('#d8dade', { roughness: 0.45, metalness: 0.05 }), red = T.mat('#e0281e', { roughness: 0.3 }), dark = T.mat('#18181a', { roughness: 0.6 });
    // side profile of a jet ski hull (pointed bow at +x, flat stern), extruded across its width with a bevel
    const sh = new THREE.Shape(); sh.moveTo(-1.5, 0); sh.lineTo(1.0, 0); sh.quadraticCurveTo(1.7, 0.05, 1.95, 0.42); sh.lineTo(1.2, 0.5); sh.lineTo(-1.5, 0.5); sh.closePath();
    const hg = new THREE.ExtrudeGeometry(sh, { depth: 0.9, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 4, curveSegments: 16 }); hg.translate(0, 0, -0.45);
    const hm = new THREE.Mesh(hg, hull); hm.castShadow = true; js.add(hm);
    const stripe = new THREE.Mesh(hg, red); stripe.scale.set(1.002, 0.28, 1.04); stripe.position.y = 0.06; js.add(stripe);
    // nose cowl + windscreen, seat, handlebars, mirrors
    const cowl = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), red); cowl.scale.set(1.3, 0.55, 0.9); cowl.position.set(0.75, 0.55, 0); cowl.castShadow = true; js.add(cowl);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.32), new THREE.MeshStandardMaterial({ color: 0x6ab8e8, transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.3 })); scr.position.set(0.62, 0.86, 0); scr.rotation.set(0, Math.PI / 2, -0.5); js.add(scr);
    const seat = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.0, 6, 12), dark); seat.rotation.z = Math.PI / 2; seat.scale.set(1, 1, 1.3); seat.position.set(-0.4, 0.68, 0); js.add(seat);
    js.add(T.cyl(0.035, 0.035, 0.95, dark, 0.45, 0.88, 0).rotateX(Math.PI / 2)); for (const z of [-0.45, 0.45]) js.add(T.box(0.08, 0.06, 0.12, T.mat('#c8c8cc', { metalness: 0.8, roughness: 0.2 }), 0.5, 0.98, z));
    js.add(T.box(0.5, 0.06, 1.02, T.mat('#2a2a2e'), -1.1, 0.56, 0));
    // ratchet straps over the hull onto the roof bars
    for (const sx of [-0.8, 0.5]) { const strap = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.025, 6, 24, Math.PI), T.mat('#f0b020')); strap.rotation.y = Math.PI / 2; strap.position.set(sx, 0.05, 0); js.add(strap); }
    js.position.set(0, 1.78, 0); js.rotation.z = 0.04; js.scale.setScalar(0.95); st.add(js); const spot = new THREE.SpotLight(0xffe8d0, 9, 18, 0.5, 0.6, 1.4); spot.position.set(3, 8, 6); spot.target.position.set(0, 2.2, 0); st.add(spot, spot.target); const gate = new THREE.Group(); gate.add(T.box(3, 16, 3, T.mat('#8a6a50'), -6, 8, 0), T.box(3, 16, 3, T.mat('#8a6a50'), 6, 8, 0), T.box(16, 4, 3.4, T.mat('#8a6a50'), 0, 17, 0)); gate.position.set(-75, 0, 0); gate.rotation.y = Math.PI / 2; st.add(gate);
    for (const sx of [-0.7, 0.6]) st.add(T.box(0.05, 0.05, 1.7, T.mat('#2a2a2e'), sx, 1.66, 0));
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), new THREE.MeshBasicMaterial({ map: T.canvasTex(256, 140, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1210'; c.font = '900 70px Nunito'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SOLD!', w / 2, h / 2 + 4); }), side: THREE.DoubleSide }));
    tag.position.set(1.0, 2.45, 0.55); tag.rotation.y = 0.5; st.add(tag);
    const nb = T.figure3D(NEIGH, { rim: '#ffd08a', pose: 'cheer' }); nb.position.set(-0.45, 2.48, 0); nb.rotation.y = 0.9; st.add(nb);
    for (let i = 0; i < 14; i++) { const side = i % 2 ? -1 : 1; const b = T.building(7 + r() * 5, 10 + r() * 16, 6, { color: ['#4a3a34', '#3a3440', '#5a4434'][i % 3], win: '#ffc070', lit: 0.4, seed: i }); b.position.x = -50 + (i >> 1) * 13; b.position.z = side * 14; if (side < 0) b.rotation.y = Math.PI; st.add(b); }
    for (let x = -48; x < 40; x += 11) { const l = new THREE.PointLight(0xffb060, 14, 22, 2); l.position.set(x, 6, x % 2 ? 6 : -6); st.add(l); } const kl = new THREE.PointLight(0xffe0c0, 10, 10, 2); kl.position.set(3, 5, 4); st.add(kl);
    glowSprite(T, st, '#ff9a4a', 40, [-30, 10, -60], 0.25);
    return { stage: st, nb, tag, js, cars, hero }; },
  draw(s, t, info, T) { const d = local(info, t, 'delhi', 2.36); s.nb.rotation.y = 0.9 + 0.1 * Math.sin(t * 3); s.js.rotation.z = 0.04 + 0.025 * Math.sin(t * 2.6); s.js.rotation.x = 0.015 * Math.sin(t * 1.9); s.js.position.y = 1.78 + 0.02 * Math.abs(Math.sin(t * 2.6)); s.nb.position.y = 2.48 + 0.06 * Math.abs(Math.sin(t * 5.2)); s.cars.forEach((c, i) => { if (c === s.hero) return; c.position.y = 0.012 * Math.sin(t * 9 + c.userData.bob); c.position.x = c.userData.x0 + (i % 3 === 0 ? t * 0.25 : 0); }); s.tag.rotation.y = 0.5 + 0.15 * Math.sin(t * 2.2);
    T.dolly(s.stage.camera, t, [[0, { pos: [3.4, 2.7, 5.6], look: [0, 2.95, 0] }], [d - 0.3, { pos: [4.0, 3.2, 6.8], look: [0, 2.95, 0] }], [info.dur, { pos: [6.5, 7.5, 9.5], look: [-4, 1.6, -0.5] }]]); },
  overlay(g, t, info) { const d = local(info, t, 'delhi', 2.36); dayHUD(g, 1, t);
    const k = ease.outBack(prog(t, d - 0.1, d + 0.25)); if (k > 0) word(g, 'NEW DELHI', E.H * 0.14, clamp(k * 2), { size: 70, color: '#ffe0b0', sub: 'NEAREST SEA: VERY FAR AWAY', scale: k }); },
});

// m10: "And here's the weird part. For a while the economy looks amazing." giant market screen goes green
registerShot('m10', { draw(g, t, info) {
  const am = local(info, t, 'amazing', 3.4), wd = local(info, t, 'weird', 0.6), ec = local(info, t, 'economy', 2.7);
  const cam = { z: key(t, [[0, 1.18], [ec, 1.06], [info.dur, 1.0]]), x: key(t, [[0, -200], [ec, -60], [info.dur, 0]]) };
  const { M } = street(g, t, cam, { mood: 'golden', seed: 5, wires: false, lamps: false });
  layer(g, cam, 0.55, (g) => {
    const bx = E.W * 0.34, by = 170, bw = 1000, bh = 520; rr(g, bx - 20, by - 20, bw + 40, bh + 40, 16); g.fillStyle = '#0a0c0e'; g.fill();
    rr(g, bx, by, bw, bh, 8); g.fillStyle = '#04120c'; g.fill(); glow(g, bx + bw / 2, by + bh / 2, 800, GREEN, 0.12 + 0.12 * prog(t, ec, am));
    const k = ease.inOut(prog(t, ec - 0.3, am + 0.4)), pts = [0.2, 0.18, 0.28, 0.25, 0.38, 0.36, 0.5, 0.48, 0.62, 0.7, 0.78, 0.9];
    chart(g, bx + 70, by + 150, bw - 140, bh - 200, pts, k, { color: GREEN, bg: false });
    text(g, 'ECONOMY', bx + 60, by + 72, { size: 56, font: 'Nunito', weight: 900, color: '#e8ffe8', align: 'left', spacing: 4 });
    text(g, k > 0.6 ? '▲ BOOM' : '▲', bx + bw - 60, by + 72, { size: 60, font: 'Nunito', weight: 900, color: GREEN, align: 'right', glow: 20, glowColor: alpha(GREEN, 0.8) });
    for (let i = 0; i < 26; i++) { const tx = bx + ((i * 97 + t * 220) % bw); text(g, ['SALES ▲', 'JOBS ▲', 'SHOPS ▲', 'ORDERS ▲'][i % 4], tx, by + bh - 24, { size: 22, font: 'Nunito', weight: 900, color: alpha(GREEN, 0.7) }); }
  });
  layer(g, cam, 1, (g) => {
    const ex = t < wd ? 'neutral' : t < ec ? 'thinking' : t < am ? 'surprised' : 'joy';
    fig(g, { x: E.W * 0.17, y: GY() + 40, s: 1.55, facing: 1, outfit: YOU, poses: [[0, 'stand'], [am - 0.1, 'cheer']], expr: ex, look: [0.6, -0.7], t, seed: 2, rim: M.rim, rimDir: [1, -0.5] });
    people(g, t, E.W * 0.3, E.W * 1.1, GY() + 50, 1.0, { seed: 4, step: 150, cheer: t > am ? 0.7 : 0, exprs: ['joy', 'happy', 'surprised'] });
    for (let i = 0; i < 5; i++) { const a = prog(t, am - 0.2 + i * 0.12, am + 0.3 + i * 0.12); arrow(g, E.W * (0.36 + i * 0.12) + cam.x * 0.0, E.H * 0.62 - a * 260, 0.8, GREEN, -1, a * (1 - prog(t, am + 0.6 + i * 0.1, am + 1.0 + i * 0.1))); }
  });
  if (t > am) { const r = rng(3); for (let i = 0; i < 80; i++) { const x = r() * E.W, sp = 200 + r() * 300, y = -40 + ((t - am) * sp + r() * 200) % (E.H + 80); g.save(); g.translate(x + Math.sin(t * 3 + i) * 20, y); g.rotate(t * 4 + i); g.fillStyle = [GREEN, GOLD, '#ffffff', EMBER][i % 4]; g.fillRect(-6, -3, 12, 6); g.restore(); } }
  dayHUD(g, 1, t);
} });

// m11: "Economists have a name for this." economist at the blackboard writes MV = PQ
registerShot('m11', { draw(g, t, info) {
  const cam = { z: 1.04 + 0.05 * t / info.dur, x: -40 + 40 * t / info.dur }, nm = local(info, t, 'name', 1.27);
  const { M } = interior(g, t, cam, { kind: 'classroom', sky: 'dusk', winX: 560, winW: 380, board: (g, x, y, w, h) => {
    const k = prog(t, 0.3, nm + 0.3); g.save(); g.beginPath(); g.rect(x, y, w * k + 10, h); g.clip();
    text(g, 'MV = PQ', x + w / 2, y + 150, { size: 120, font: 'Nunito', weight: 900, color: 'rgba(240,240,230,.9)' }); g.restore();
    const q = ease.outBack(prog(t, nm, nm + 0.3)); if (q > 0) { g.save(); g.translate(x + w / 2, y + 300); g.scale(q, q); text(g, 'NAME?', 0, 0, { size: 64, font: 'Nunito', weight: 900, color: '#ffd27a' }); g.restore(); }
    for (let i = 0; i < 4; i++) seg(g, [[x + 60 + i * 30, y + h - 40 - i * 12], [x + 140 + i * 30, y + h - 50 - i * 12]], 3, 'rgba(240,240,230,.25)'); } });
  layer(g, cam, 1, (g) => { fig(g, { x: E.W * 0.52, y: GY() + 10, s: 1.5, facing: -1, outfit: ECON, poses: [[0, 'point'], [nm, 'explain']], expr: t > nm ? 'smile' : 'thinking', t, seed: 4, rim: M.rim, rimDir: [1, -0.6], prop: { type: 'pointer' } }); });
  blurLayer(g, 12, (g) => { for (let i = 0; i < 3; i++) { circle(g, 220 + i * 640, GY() + 260, 120, '#06080a'); g.fillStyle = '#06080a'; g.fillRect(100 + i * 640, GY() + 260, 240, 400); } }, cam, 1.7);
  FX.dust(g, t, { count: 50, color: '#ffe0b8', a: 0.4 });
  dayHUD(g, 1, t);
} });

// ---------- velocity of money diagram ----------
const LC = () => [E.W * 0.4, E.H * 0.6], LRX = 380, LRY = 220;
const lp = (u) => { const [cx, cy] = LC(), a = u * Math.PI * 2 - Math.PI / 2; return [cx + Math.cos(a) * LRX, cy + Math.sin(a) * LRY]; };
function meter(g, v, t, label, col) {
  const cx = E.W * 0.82, cy = E.H * 0.66, R = 170; rr(g, cx - 220, cy - 230, 440, 330, 24); g.fillStyle = 'rgba(6,10,14,.75)'; g.fill();
  for (let i = 0; i <= 20; i++) { const a = Math.PI + (i / 20) * Math.PI; seg(g, [[cx + Math.cos(a) * (R - 10), cy + Math.sin(a) * (R - 10)], [cx + Math.cos(a) * (R - (i % 5 ? 26 : 44)), cy + Math.sin(a) * (R - (i % 5 ? 26 : 44))]], i % 5 ? 3 : 5, mix('#5fa8e8', '#ff8a2a', i / 20)); }
  g.lineWidth = 14; g.lineCap = 'round'; g.strokeStyle = linGrad(g, cx - R, 0, cx + R, 0, ['#4a8ad8', '#ffc15a', '#ff5a2a']); g.beginPath(); g.arc(cx, cy, R, Math.PI, Math.PI * 2); g.stroke();
  const a = Math.PI + clamp(v) * Math.PI + Math.sin(t * 30) * 0.02 * v; seg(g, [[cx, cy], [cx + Math.cos(a) * (R - 30), cy + Math.sin(a) * (R - 30)]], 8, '#fff4e0'); circle(g, cx, cy, 16, '#fff4e0');
  text(g, 'SPEED OF MONEY', cx, cy - R - 28, { size: 24, font: 'Nunito', weight: 900, color: '#c8d4dc', spacing: 3 });
  text(g, label, cx, cy + 60, { size: 58, font: 'Nunito', weight: 900, color: col, glow: 18, glowColor: alpha(col, 0.7) });
}
function loopDiagram(g, t, o) {
  const { mode, cool = 0 } = o; bokehBG(g, t, { top: mix('#05090c', '#060a14', cool), bot: mix('#1a120c', '#0a1420', cool), seed: 21, warm: mix(EMBER, '#4a8ad8', cool) });
  g.strokeStyle = 'rgba(127,216,232,.06)'; g.lineWidth = 1; for (let x = 0; x < E.W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = 0; y < E.H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  const [cx, cy] = LC(); g.save(); g.setLineDash([18, 16]); g.lineDashOffset = -t * (mode === 'fast' ? 300 : mode === 'slow' ? 4 : 60); g.strokeStyle = alpha(mix(GOLD, '#7fb8e8', cool), 0.55); g.lineWidth = 5; g.beginPath(); g.ellipse(cx, cy, LRX, LRY, 0, 0, 7); g.stroke(); g.restore();
  glow(g, cx, cy, 420, mix(EMBER, '#4a8ad8', cool), 0.1);
  for (let i = 0; i < 6; i++) { const [x, y] = lp(i / 6), nx = lp((i + 1) / 6)[0];
    const pose = mode === 'slow' ? (i === 0 ? 'holdFront' : ['shrug', 'sad', 'crossArms'][i % 3]) : mode === 'fast' ? posesAt(t * 2 + i, [[0, 'reach'], [0.3, 'cheer'], [0.6, 'reach']]) : 'reach';
    fig(g, { x, y: y + 80, s: 0.62, facing: nx >= x ? 1 : -1, outfit: i === 0 ? YOU : {}, pose, expr: mode === 'slow' ? (i === 0 ? 'nervous' : 'sad') : mode === 'fast' ? 'joy' : 'smile', t, seed: i, rim: mix('#ffc078', '#9fc8f0', cool), shadow: false }); }
}
// m12: "The velocity of money. It's how fast money moves from hand to hand."
registerShot('m12', { draw(g, t, info) {
  loopDiagram(g, t, { mode: 'normal' }); const hh = local(info, t, 'hand', 2.9);
  const u = (t * 0.28) % 1, seg6 = Math.floor(u * 6), f = u * 6 - seg6, a = lp(seg6 / 6), b = lp((seg6 + 1) / 6), x = lerp(a[0], b[0], f), y = lerp(a[1], b[1], f) - Math.sin(f * Math.PI) * 70;
  glow(g, x, y, 90, GOLD, 0.6); coin(g, x, y, 30, { spin: t * 8 });
  meter(g, 0.5, t, 'NORMAL', '#ffd27a');
  word(g, 'VELOCITY OF MONEY', E.H * 0.13, ease.out(prog(t, 0.1, 0.4)), { size: 80, color: '#ffe0b0' });
  cite(g, 'Velocity of money: how many times each rupee is spent in a given period', prog(t, hh - 1, hh) * 4);
  dayHUD(g, 1, t);
} });
// m13: "When people hold on to cash, the economy slows down."
registerShot('m13', { draw(g, t, info) {
  const hold = local(info, t, 'hold', 0.5), sl = local(info, t, 'slows', 2.2), cool = ease.inOut(prog(t, hold, sl + 0.5));
  loopDiagram(g, t, { mode: t > hold ? 'slow' : 'normal', cool });
  const [x, y] = lp(0.02); glow(g, x + 10, y + 10, 90, GOLD, 0.4); coin(g, x + 16, y + 0, 30, { spin: 0.3 }); ring(g, x + 16, y, 52, 4, alpha('#9fc8f0', 0.5 + 0.3 * Math.sin(t * 6)));
  meter(g, lerp(0.5, 0.08, cool), t, 'SLOW', mix('#ffd27a', '#7fb8f0', cool));
  word(g, 'HOLD CASH = SLOW ECONOMY', E.H * 0.13, ease.out(prog(t, 0.2, 0.5)), { size: 64, color: mix('#ffe0b0', '#bfe0ff', cool) });
  dayHUD(g, 1, t);
} });
// m14: "When money has to move it races."
registerShot('m14', { draw(g, t, info) {
  const mv = local(info, t, 'move', 0.8), sp = key(t, [[0, 0.1], [mv, 0.6], [info.dur, 1.3]]);
  loopDiagram(g, t, { mode: t > mv - 0.2 ? 'fast' : 'slow', cool: 1 - prog(t, 0, mv) });
  const ph = t * sp; for (let c = 0; c < 9; c++) { const u = (ph + c / 9) % 1; for (let k = 5; k >= 0; k--) { const [x, y] = lp((u - k * 0.012 * sp + 1) % 1); if (k) circle(g, x, y, 20 - k * 2.5, alpha(EMBER, 0.25 * (1 - k / 6) * clamp(sp))); else { glow(g, x, y, 70, GOLD, 0.5); coin(g, x, y, 26, { spin: t * 14 + c }); } } }
  meter(g, clamp(0.08 + sp * 0.75), t, 'FAST', '#ffb35a');
  word(g, 'MONEY THAT MUST MOVE, RACES', E.H * 0.13, ease.out(prog(t, mv - 0.3, mv)), { size: 64, color: '#ffe0b0' });
  if (t > mv) FX.speedLines(g, t, { cx: LC()[0], cy: LC()[1], count: 40, a: 0.12, inner: 460, color: '#ffd8a8' });
  dayHUD(g, 1, t);
} });

// m15: "Shops sell out. Factories hire more workers." pan from a SOLD OUT shop to a factory gate NOW HIRING
registerShot('m15', { draw(g, t, info) {
  const so = local(info, t, 'sell', 0.53), hi = local(info, t, 'hire', 1.85), cam = { x: key(t, [[0, -120], [so + 0.5, 0], [hi - 0.2, 1500], [info.dur, 1620]]), z: 1.0 + 0.04 * t / info.dur };
  const M = mood('golden'), gy = GY();
  layer(g, cam, 0.08, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * 0.9, gy - 380, 70, '#fff2d6', M.key, 6); });
  layer(g, cam, 0.22, (g) => FX.skyline(g, { x: -E.W, y: gy - 120, w: E.W * 4, minH: 120, maxH: 380, color: shade(M.wall, -0.55), windowColor: alpha(M.practical, 0.5), lit: 0.2, seed: 8 }));
  layer(g, cam, 0.5, (g) => {
    building(g, -260, gy, 420, 640, M, { seed: 2 });
    // the shop with an empty window
    const sx = 220, sw = 760; g.fillStyle = '#3a2a22'; g.fillRect(sx, gy - 620, sw, 620); rr(g, sx + 30, gy - 600, sw - 60, 80, 8); g.fillStyle = '#c8402a'; g.fill(); text(g, 'GUPTA GENERAL STORE', sx + sw / 2, gy - 560, { size: 42, weight: 700, color: '#fff2d8', spacing: 3 });
    g.fillStyle = '#e8c890'; g.fillRect(sx + 50, gy - 480, sw - 100, 380); glow(g, sx + sw / 2, gy - 290, 500, '#ffd59a', 0.2);
    for (let r2 = 0; r2 < 3; r2++) { g.fillStyle = '#5a3a22'; g.fillRect(sx + 50, gy - 380 + r2 * 110, sw - 100, 10); }
    const k = ease.outBack(prog(t, so, so + 0.25)); if (k > 0) { g.save(); g.translate(sx + sw / 2, gy - 300); g.rotate(-0.12); g.scale(k * 1.0, k * 1.0); rr(g, -300, -60, 600, 120, 12); g.fillStyle = '#d8281e'; g.fill(); g.strokeStyle = '#fff2d8'; g.lineWidth = 6; g.stroke(); text(g, 'SOLD OUT', 0, 4, { size: 86, weight: 700, color: '#fff2d8', spacing: 8 }); g.restore(); }
    // factory
    const fx = 1350, fw = 1100; g.fillStyle = '#4a2e26'; g.fillRect(fx, gy - 520, fw, 520); for (let i = 0; i < 5; i++) poly(g, [[fx + i * 220, gy - 520], [fx + i * 220 + 220, gy - 520], [fx + i * 220 + 220, gy - 640]], '#3a221c');
    for (const cxx of [fx + 160, fx + 420]) { g.fillStyle = '#2a1a16'; g.fillRect(cxx, gy - 900, 70, 400); for (let k2 = 0; k2 < 6; k2++) { const ph = (t * 0.25 + k2 / 6) % 1; g.fillStyle = radGrad(g, cxx + 35 + ph * 160, gy - 920 - ph * 260, 0, 60 + ph * 120, [`rgba(200,180,160,${0.3 * (1 - ph)})`, 'rgba(200,180,160,0)']); g.beginPath(); g.arc(cxx + 35 + ph * 160, gy - 920 - ph * 260, 60 + ph * 120, 0, 7); g.fill(); } }
    for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) { g.fillStyle = alpha(M.practical, 0.75); g.fillRect(fx + 40 + i * 130, gy - 460 + j * 130, 80, 90); }
    g.fillStyle = '#1a1210'; g.fillRect(fx + fw / 2 - 220, gy - 260, 440, 260); g.fillStyle = linGrad(g, 0, gy - 250, 0, gy, ['#ffe0a8', '#ffb060']); g.fillRect(fx + fw / 2 - 200, gy - 240, 400, 240);
    const h2 = ease.outBack(prog(t, hi - 0.1, hi + 0.2)); if (h2 > 0) { g.save(); g.translate(fx + fw / 2, gy - 330); g.scale(h2, h2); rr(g, -260, -50, 520, 100, 14); g.fillStyle = '#0a1a10'; g.fill(); g.strokeStyle = GREEN; g.lineWidth = 5; g.stroke(); text(g, 'NOW HIRING', 0, 3, { size: 64, weight: 700, color: GREEN, glow: 22, glowColor: alpha(GREEN, 0.8), spacing: 6 }); g.restore(); }
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, gy - 10, 0, gy + 400, [shade(M.floor, 0.12), shade(M.dark, -0.35)]); g.fillRect(-E.W, gy - 10, E.W * 5, E.H * 2); });
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 3; i++) fig(g, { x: 430 + i * 180, y: gy + 40, s: 1.0, facing: i % 2 ? -1 : 1, pose: ['shrug', 'handsOnHead', 'shrug'][i], expr: t > so ? 'shocked' : 'neutral', t, seed: i, rim: M.rim });
    for (let i = 0; i < 6; i++) { const x = 2350 + i * 150 + t * 150; drawFigure(g, { x, y: gy + 40 + (i % 2) * 16, s: 1.0, facing: -1, pose: walkPose(t * 5.6 + i, {}), outfit: { head: 'cap', headColor: '#e8c21a' }, expr: 'happy', rim: { color: M.rim, dir: [1, -0.4], w: 4 } }); }
  });
  dayHUD(g, 1, t);
} });

// m16: "Everybody has a job, because everybody has to spend." payday -> instantly spent; notes fly hand to hand
registerShot('m16', { draw(g, t, info) {
  const cam = { z: 1.06 - 0.06 * t / info.dur, x: 60 - 120 * t / info.dur }, sp = local(info, t, 'spend', 2.74);
  const { M } = street(g, t, cam, { mood: 'golden', seed: 7, autos: true, sunX: 0.3 });
  const gy = GY();
  layer(g, cam, 1, (g) => {
    // fruit cart
    const cx = E.W * 0.7; rr(g, cx - 200, gy - 180, 400, 110, 10); g.fillStyle = '#5a3a22'; g.fill(); for (let i = 0; i < 14; i++) circle(g, cx - 170 + (i % 7) * 56, gy - 196 - Math.floor(i / 7) * 34, 24, ['#e8402a', '#ffb02a', '#7ac83a', '#e8c21a'][i % 4]); circle(g, cx - 130, gy - 40, 40, '#1a1210'); circle(g, cx + 130, gy - 40, 40, '#1a1210');
    seg(g, [[cx - 200, gy - 320], [cx + 200, gy - 320]], 10, '#d8442a'); seg(g, [[cx - 190, gy - 320], [cx - 190, gy - 180]], 6, '#1a1210'); seg(g, [[cx + 190, gy - 320], [cx + 190, gy - 180]], 6, '#1a1210');
    fig(g, { x: E.W * 0.12, y: gy + 30, s: 1.3, facing: 1, outfit: { top: 'suit', color: '#2a2a3a' }, pose: 'holdFront', expr: 'smile', t, seed: 1, rim: M.rim });
    const pay = t < 1.2 ? 'reach' : 'cheer'; fig(g, { x: E.W * 0.38, y: gy + 40, s: 1.3, facing: t < 1.2 ? -1 : 1, outfit: { head: 'cap', headColor: '#e8c21a' }, pose: posesAt(t, [[0, 'reach'], [1.2, 'reach'], [1.6, 'point']]), expr: t < 1.0 ? 'happy' : 'joy', t, seed: 3, rim: M.rim });
    fig(g, { x: E.W * 0.82, y: gy + 30, s: 1.25, facing: -1, outfit: POOR, pose: 'reach', expr: 'joy', t, seed: 5, rim: M.rim });
    flyNote(g, [E.W * 0.17, gy - 150], [E.W * 0.36, gy - 160], prog(t, 0.2, 0.9), 0.2, { timer: '30 DAYS', t });
    flyNote(g, [E.W * 0.4, gy - 160], [E.W * 0.8, gy - 170], prog(t, 1.5, 2.3), 0.2, { timer: '30 DAYS', t, h: 220 });
    for (let i = 0; i < 4; i++) flyNote(g, [E.W * (0.1 + i * 0.25), gy - 380], [E.W * (0.3 + i * 0.25), gy - 420], ((t * 0.6 + i * 0.27) % 1), 0.12, { timer: '29 DAYS', t, h: 120, pal: i % 2 ? 'r100' : 'r500', value: i % 2 ? '100' : '500' });
    if (t > 1.4) { const k = prog(t, 1.4, 2.4); text(g, '+₹500', E.W * 0.82, gy - 380 - k * 80, { size: 54, font: 'Nunito', weight: 900, color: GREEN, alpha: 1 - k, stroke: 6, strokeColor: 'rgba(0,0,0,.5)' }); }
  });
  blurLayer(g, 12, (g) => people(g, t, -300, E.W + 300, gy + 320, 2.2, { seed: 13, step: 380, cheer: 0.5 }), cam, 1.7);
  dayHUD(g, 1, t);
} });
