// shots/03_day10.js: DAY 10. Prices climb, momos double then triple, the rich hoard things: gold, land, art, sneakers.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, seg, rr, poly, circle, ring, glow, alpha, shade, mix, text, linGrad, radGrad, shake, rng, backdrop, S } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { note, ashFall, embers, calendar, dayHUD, chart, arrow, coin, goldBar, priceBoard, bokehBG, local, EMBER, GOLD, HOT } from '../sets/money.js';
import { street, interior, desk, GY } from '../sets/india.js';
import { fig, runner, people, blinkAt } from '../sets/act.js';
import { word } from '../sets/cine.js';
import { stat } from '../sets/stat.js';
import { RICH, YOU, POOR } from '../cast.js';
import { note3D, glowSprite } from '../sets/money3d.js';
import { bokeh } from '../sets/hand3d.js';

const RED = '#ff5a3c';
const tags = (g, t, n = 14, seed = 2) => { const r = rng(seed); for (let i = 0; i < n; i++) { const x = r() * E.W, sp = 80 + r() * 120, y = E.H + 60 - ((t * sp + r() * E.H) % (E.H + 120)); g.save(); g.translate(x, y); g.rotate(-0.2 + r() * 0.4); rr(g, -70, -32, 140, 64, 10); g.fillStyle = '#f2e6c8'; g.fill(); circle(g, -52, 0, 7, '#2a1a14'); text(g, '₹' + (Math.floor(r() * 9 + 1) * 100), 10, 2, { size: 30, font: 'Nunito', weight: 900, color: RED }); g.restore(); } };

// m17: "Day 10. Prices start climbing." calendar flips 1 -> 10, price tags float up behind
registerShot('m17', { draw(g, t, info) {
  const cam = { z: 1.08 + 0.04 * t, x: t * 40 };
  blurLayer(g, 9, (g) => { street(g, t, cam, { mood: 'dusk', seed: 4, autos: true }); tags(g, t, 18, 3); });
  veil(g, '#0a0604', 0.5);
  calendar(g, t, { from: 1, to: 10, flipAt: 0.15, s: 0.82, y: E.H * 0.43, sub: 'PRICES START CLIMBING', tone: '#c8361e' });
  embers(g, t, { count: 30, a: 0.5 });
} });

// m18: "Too much money is chasing too few things." a mob waving notes chases one small cart
registerShot('m18', { draw(g, t, info) {
  const cam = { x: t * 180 - 100, z: 1.04 };
  const { M } = street(g, t, cam, { mood: 'dusk', seed: 6, lamps: true });
  const gy = GY();
  layer(g, cam, 1, (g) => {
    const cx = 1300 + t * 330; // the cart with few goods
    drawFigure(g, { x: cx + 170, y: gy + 40, s: 1.1, facing: 1, pose: walkPose(t * 9, { run: true }), expr: 'scared', look: [-0.8, 0], rim: { color: M.rim, dir: [0, -1], w: 4 } });
    rr(g, cx - 120, gy - 120, 240, 80, 8); g.fillStyle = '#5a3a22'; g.fill(); circle(g, cx - 80, gy - 20, 26, '#0c0a08'); circle(g, cx + 80, gy - 20, 26, '#0c0a08');
    for (let i = 0; i < 3; i++) { rr(g, cx - 70 + i * 50, gy - 170, 40, 50, 6); g.fillStyle = ['#e8402a', '#3a8ac8', '#e8c21a'][i]; g.fill(); }
    glow(g, cx, gy - 150, 160, GOLD, 0.25); text(g, 'FEW THINGS', cx, gy - 230, { size: 30, font: 'Nunito', weight: 900, color: '#fff1dc', stroke: 6, strokeColor: 'rgba(0,0,0,.6)' });
    for (let i = 0; i < 11; i++) { const x = cx - 380 - i * 120 - (i % 2) * 40; const ph = t * 10 + i * 1.3, p = walkPose(ph, { run: true }); const fl = i % 3 === 0;
      drawFigure(g, { x, y: gy + 30 + (i % 3) * 18, s: 1.0, facing: 1, pose: fl ? { ...p, hF: [p.hF[0] + 10, -230], eF: [p.eF[0] + 6, -200] } : p, outfit: i === 2 ? YOU : {}, expr: ['angry', 'determined', 'shocked'][i % 3], rim: { color: M.rim, dir: [0, -1], w: 4 } });
      note(g, x + 24, gy + 30 - 236 + Math.sin(ph) * 10, 0.12, { rot: Math.sin(ph) * 0.6, timer: '20 DAYS', shadow: false, t }); }
  });
  word(g, 'TOO MUCH MONEY → TOO FEW THINGS', E.H * 0.13, ease.out(prog(t, 0.3, 0.6)), { size: 58, color: '#ffe0b0' });
  dayHUD(g, 10, t);
} });

// m19: "A plate of momos costs double. Then triple." the momo stall price board flips 60 -> 120 -> 180
registerShot('m19', { draw(g, t, info) {
  const db = local(info, t, 'double', 1.28), tr = local(info, t, 'triple', 2.24);
  const cam = { z: 1.0 + 0.1 * ease.inOut(t / info.dur), x: 20 };
  const sh = t > tr && t < tr + 0.4 ? shake(t, 8, 12) : [0, 0];
  blurLayer(g, 8, (g) => street(g, t, { z: 1.2, x: 200 }, { mood: 'night', seed: 9, lamps: true }));
  veil(g, '#05070a', 0.35);
  layer(g, { ...cam, x: cam.x + sh[0], y: sh[1] }, 1, (g) => {
    const gy = GY();
    rr(g, E.W * 0.08, gy - 330, E.W * 0.84, 60, 10); g.fillStyle = '#c8361e'; g.fill(); text(g, 'TASHI MOMOS · STEAMED & FRIED', E.W / 2, gy - 298, { size: 38, weight: 700, color: '#fff2d8', spacing: 4 });
    desk(g, E.W * 0.1, gy + 60, E.W * 0.8, 200, mood('interiorWarm'), { top: '#8a5a3a', front: '#3a2218' });
    for (let k = 0; k < 3; k++) { const sx = E.W * 0.6, sy = gy - 140 - k * 64; rr(g, sx - 120, sy, 240, 56, 10); g.fillStyle = mix('#c0b8a8', '#8a8478', k / 3); g.fill(); seg(g, [[sx - 120, sy + 8], [sx + 120, sy + 8]], 3, 'rgba(0,0,0,.3)'); }
    for (let k = 0; k < 6; k++) { const ph = (t * 0.5 + k / 6) % 1; g.fillStyle = radGrad(g, E.W * 0.6 + Math.sin(k + t) * 50, gy - 340 - ph * 300, 0, 60 + ph * 100, [`rgba(255,250,240,${0.25 * (1 - ph)})`, 'rgba(255,250,240,0)']); g.beginPath(); g.arc(E.W * 0.6 + Math.sin(k + t) * 50, gy - 340 - ph * 300, 60 + ph * 100, 0, 7); g.fill(); }
    fig(g, { x: E.W * 0.78, y: gy - 120, s: 1.1, facing: -1, outfit: { head: 'beanie', headColor: '#3a6ea5' }, pose: t > db ? 'shrug' : 'holdFront', expr: t > tr ? 'nervous' : 'smile', t, seed: 3, rim: '#ffc078' });
    // plate of momos
    g.save(); g.translate(E.W * 0.38, gy - 120); g.fillStyle = '#e8e4dc'; g.beginPath(); g.ellipse(0, 0, 190, 50, 0, 0, 7); g.fill(); g.fillStyle = '#c8c0b4'; g.beginPath(); g.ellipse(0, 4, 150, 34, 0, 0, 7); g.fill();
    for (let i = 0; i < 6; i++) { const mx = -100 + (i % 3) * 100 + (i > 2 ? 50 : 0) - 25, my = -24 - (i > 2 ? 34 : 0); g.fillStyle = '#f6f0e2'; g.beginPath(); g.ellipse(mx, my, 50, 34, 0, Math.PI, 0); g.lineTo(mx + 50, my + 6); g.lineTo(mx - 50, my + 6); g.fill(); seg(g, [[mx - 18, my - 26], [mx, my - 36], [mx + 18, my - 26]], 3, 'rgba(160,140,110,.6)'); }
    circle(g, 150, -10, 26, '#d8281e'); g.restore();
    priceBoard(g, E.W * 0.2, E.H * 0.3, 1.0, t, { title: 'MOMOS', prices: ['₹60', '₹120', '₹180'], at: [0, db, tr] });
  });
  const lbl = t > tr ? '×3' : t > db ? '×2' : ''; if (lbl) { const k = ease.outBack(prog(t, t > tr ? tr : db, (t > tr ? tr : db) + 0.3)); g.save(); g.translate(E.W * 0.2 + 230, E.H * 0.18); g.scale(k, k); text(g, lbl, 0, 0, { size: 90, font: 'Nunito', weight: 900, color: RED, glow: 20, glowColor: alpha(RED, 0.8), stroke: 8, strokeColor: 'rgba(0,0,0,.6)' }); g.restore(); }
  FX.dust(g, t, { count: 40, a: 0.35 });
  dayHUD(g, 10, t);
} });

// penthouse backdrop for the rich man
const pent = (g, t, cam) => interior(g, t, cam, { kind: 'showroom', mood: 'golden', sky: 'dusk', winW: 980, winX: 180 });
// m20: "And the rich realise something fast." giant face, sunglasses catching gold
registerShot('m20', { draw(g, t, info) {
  blurLayer(g, 14, (g) => pent(g, t, { z: 1.2, x: 0 })); veil(g, '#06080a', 0.35);
  const fs = local(info, t, 'fast', 1.27), z = 1 + 0.08 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W * 0.5, E.H * 0.62); g.scale(z, z);
  bigFace(g, 0, 0, 300, { outfit: RICH, expr: t > fs - 0.2 ? 'smirk' : 'neutral', look: [t > fs - 0.4 ? -0.3 : 0.2, 0], rimColor: '#ffc15a', rimSide: 1, blink: blinkAt(t, 3.3) });
  g.strokeStyle = '#ffc15a'; g.lineWidth = 7; rr(g, -198, -102, 180, 120, 36); g.stroke(); rr(g, 18, -102, 180, 120, 36); g.stroke(); seg(g, [[-18, -70], [18, -70]], 7, '#ffc15a');
  g.save(); g.globalCompositeOperation = 'lighter'; const sx = -200 + ((t * 300) % 500); g.fillStyle = 'rgba(255,200,90,.35)'; rr(g, sx, -100, 40, 100, 10); g.fill(); g.restore();
  g.restore();
  glow(g, E.W * 0.5 + 150, E.H * 0.54, 120, GOLD, 0.35 + 0.25 * Math.sin(t * 5));
  embers(g, t, { count: 24, a: 0.4, color: GOLD });
  dayHUD(g, 10, t);
} });

// m21: "If money can't be stored you store things instead." burning notes out, gold, art and crates in
registerShot('m21', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.06 * t / info.dur, x: -40 + 60 * t / info.dur }, sti = local(info, t, 'store', 1.68);
  const { M } = pent(g, t, cam); const gy = GY();
  layer(g, cam, 1, (g) => {
    fig(g, { x: E.W * 0.32, y: gy + 20, s: 1.6, facing: 1, outfit: RICH, poses: [[0, 'holdFront'], [sti, 'point']], expr: t > sti ? 'smirk' : 'worried', t, seed: 2, rim: M.rim, rimDir: [1, -0.6] });
    note(g, E.W * 0.36, gy - 170, 0.28, { rot: -0.3, timer: '00:00:12', urgent: 0.6, burn: clamp(0.25 + t * 0.2), t, seed: 8, a: 1 - prog(t, sti + 0.6, sti + 1.0) });
    const items = [[E.W * 0.58, 'gold'], [E.W * 0.7, 'crate'], [E.W * 0.82, 'art'], [E.W * 0.92, 'gold']];
    items.forEach(([x, k], i) => { const a = ease.outBack(prog(t, sti + i * 0.18, sti + 0.35 + i * 0.18)); if (a <= 0) return; g.save(); g.translate(x, gy + 20); g.scale(a, a);
      if (k === 'gold') { for (let j = 0; j < 6; j++) goldBar(g, -90 + (j % 3) * 90, -(Math.floor(j / 3)) * 56, 0.48, { shine: t + j * 0.2 }); glow(g, 0, -60, 220, GOLD, 0.3); }
      if (k === 'crate') { rr(g, -100, -200, 200, 200, 8); g.fillStyle = '#7a5232'; g.fill(); seg(g, [[-100, -200], [100, 0]], 8, '#5a3a20'); seg(g, [[100, -200], [-100, 0]], 8, '#5a3a20'); text(g, 'GOODS', 0, -230, { size: 26, font: 'Nunito', weight: 900, color: '#fff1dc' }); }
      if (k === 'art') { rr(g, -110, -330, 220, 170, 6); g.fillStyle = '#c8a050'; g.fill(); g.fillStyle = linGrad(g, 0, -315, 0, -175, ['#3a5a8a', '#e8a050']); g.fillRect(-94, -314, 188, 138); circle(g, 30, -270, 22, '#fff0c0'); poly(g, [[-94, -176], [-30, -240], [30, -190], [94, -230], [94, -176]], '#2a3a2a'); seg(g, [[0, -160], [-60, 0]], 6, '#3a2a1a'); seg(g, [[0, -160], [60, 0]], 6, '#3a2a1a'); }
      g.restore(); });
  });
  word(g, 'STORE THINGS, NOT MONEY', E.H * 0.13, ease.out(prog(t, sti - 0.1, sti + 0.25)), { size: 66, color: GOLD });
  FX.dust(g, t, { count: 50, color: '#ffe0a0', a: 0.4 });
  dayHUD(g, 10, t);
} });

// m22: "Gold prices explode." the chart rockets off the top of the card
registerShot('m22', { draw(g, t, info) {
  const ex = local(info, t, 'explode', 0.79), sh = t > ex ? shake(t, 10 * Math.exp(-(t - ex) * 5), 10) : [0, 0];
  bokehBG(g, t, { top: '#060504', bot: '#2a1a08', warm: GOLD, seed: 5 });
  g.save(); g.translate(sh[0], sh[1]);
  const pts = [0.08, 0.1, 0.09, 0.13, 0.15, 0.2, 0.24, 0.36, 0.5, 0.72, 0.98, 1.4];
  const k = lerp(0.3, 1, ease.inOut(prog(t, 0, ex + 0.3)));
  g.save(); rr(g, E.W * 0.16 - 30, E.H * 0.3 - 30, E.W * 0.68 + 60, E.H * 0.5 + 60, 22); g.fillStyle = 'rgba(6,8,10,.8)'; g.fill(); g.restore();
  g.save(); g.beginPath(); g.rect(0, 0, E.W, E.H); g.clip(); const P = chart(g, E.W * 0.16, E.H * 0.3, E.W * 0.68, E.H * 0.5, pts, k, { color: GOLD, bg: false, lw: 9 }); g.restore();
  if (t > ex) { glow(g, P[0], P[1], 260, GOLD, 0.6); FX.speedLines(g, t, { cx: P[0], cy: Math.max(80, P[1]), count: 40, a: 0.2, inner: 120, color: '#ffe0a0' }); }
  for (let i = 0; i < 4; i++) goldBar(g, E.W * (0.1 + i * 0.06), E.H * 0.92, 0.6, { shine: t + i * 0.3 });
  g.restore();
  stat(g, { label: 'GOLD PRICE', value: t > ex ? '▲▲▲' : '▲', y: E.H * 0.14, color: GOLD, size: 90, pulse: t - ex });
  dayHUD(g, 10, t);
} });

// m23: "Land, houses, paintings, even rare sneakers" 3D vault dolly past each hoard
registerShot('m23', { kind: '3d',
  init(T) { const { THREE } = T; const st = T.stage({ mood: 'night', fov: 38, sky: ['#030406', '#0a0c10'], fogColor: '#05060a', fog: [10, 34], ambient: 2.2, ambientSky: '#6a5a40', keyColor: '#ffd8a0', keyIntensity: 1.6, keyPos: [4, 9, 8], bloom: 0.55, bloomThreshold: 0.86 });
    st.add(T.ground(80, 40, '#2a2420', T.tiles('#2a2420', 8, [12, 6]))); st.add(T.box(60, 10, 0.4, T.mat('#2a1e18'), 0, 5, -4));
    for (let x = -10; x <= 16; x += 4) { const p = new THREE.PointLight(0xffd090, 9, 9, 2); p.position.set(x, 4.2, 0.5); st.add(p); st.add(T.shaft(1.6, 4.2, '#ffd090', 0.05)).position.set(x, 2.1, -0.2); }
    // LAND: plot with grass + fence + sign
    const land = new THREE.Group(); land.add(T.box(2.6, 0.3, 2.0, T.mat('#5a4030'), 0, 0.15, 0), T.box(2.4, 0.06, 1.8, T.mat('#4a7a3a'), 0, 0.33, 0)); for (let i = 0; i < 9; i++) land.add(T.box(0.06, 0.4, 0.06, T.mat('#c8a070'), -1.2 + i * 0.3, 0.5, 0.9)); land.add(T.box(2.5, 0.05, 0.05, T.mat('#c8a070'), 0, 0.6, 0.9)); land.add(T.box(0.8, 0.5, 0.05, T.basic('#e8dcc0'), 0.6, 1.1, 0.2), T.box(0.06, 0.8, 0.06, T.mat('#5a3a22'), 0.6, 0.7, 0.18)); land.position.set(-8, 0, 0); st.add(land);
    // HOUSES: little house models on plinths
    for (let i = 0; i < 2; i++) { const h = new THREE.Group(); h.add(T.box(1.2, 0.9, 1.0, T.mat(i ? '#e8d8b8' : '#d8b890'), 0, 0.45, 0), T.cone(0.95, 0.7, T.mat('#8a3a2a'), 0, 1.25, 0, 4).rotateY(Math.PI / 4), T.box(0.3, 0.3, 0.02, T.basic('#ffd890'), 0.25, 0.5, 0.51)); h.position.set(-4.2 + i * 1.6, 0.6, i * 0.3); st.add(T.box(1.5, 0.6, 1.3, T.mat('#1a1410'), -4.2 + i * 1.6, 0.3, i * 0.3), h); }
    // PAINTINGS on the back wall
    for (let i = 0; i < 3; i++) { const tex = T.canvasTex(256, 200, (c, w, h) => { c.fillStyle = '#c8a050'; c.fillRect(0, 0, w, h); const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, ['#2a4a7a', '#7a2a4a', '#2a6a5a'][i]); gr.addColorStop(1, ['#e8a050', '#f0c070', '#e8d890'][i]); c.fillStyle = gr; c.fillRect(14, 14, w - 28, h - 28); c.fillStyle = 'rgba(20,20,30,.8)'; c.beginPath(); c.moveTo(14, h - 14); c.lineTo(w * 0.4, h * 0.45); c.lineTo(w * 0.7, h * 0.7); c.lineTo(w - 14, h * 0.5); c.lineTo(w - 14, h - 14); c.fill(); c.fillStyle = '#fff0c0'; c.beginPath(); c.arc(w * 0.7, h * 0.3, 16, 0, 7); c.fill(); });
      const p = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.98), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, emissiveMap: tex, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.15 })); p.position.set(-0.6 + i * 1.8, 1.75, -3.78); st.add(p); }
    // gold bars stack in the middle
    const gm = T.mat('#ffc040', { roughness: 0.35, metalness: 0.25, emissive: new THREE.Color('#a86a10'), emissiveIntensity: 0.35 });
    for (let j = 0; j < 4; j++) for (let i = 0; i < 6 - j; i++) for (let k = 0; k < 2; k++) st.add(T.box(0.5, 0.18, 0.24, gm, 0.6 + i * 0.52 + j * 0.26, 0.09 + j * 0.18, 0.3 + k * 0.28));
    // SNEAKERS on pedestals in glass boxes
    const sneakers = [];
    const mkSneaker = (upperCol, accent, sole, mark) => { const g = new THREE.Group();
      // midsole: side profile with toe spring + heel rise, extruded and bevelled
      const ms = new THREE.Shape(); ms.moveTo(-0.5, 0.02); ms.lineTo(0.38, 0.02); ms.quadraticCurveTo(0.55, 0.04, 0.56, 0.12); ms.lineTo(0.5, 0.15); ms.lineTo(-0.48, 0.17); ms.quadraticCurveTo(-0.56, 0.12, -0.5, 0.02);
      const msG = new THREE.ExtrudeGeometry(ms, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 3, curveSegments: 12 }); msG.translate(0, 0, -0.15);
      const mid = new THREE.Mesh(msG, T.mat(sole, { roughness: 0.55 })); mid.castShadow = true; mid.scale.y = 0.75; g.add(mid);
      const out = new THREE.Mesh(msG, T.mat('#1c1c1e', { roughness: 0.9 })); out.scale.set(1.01, 0.25, 1.04); out.position.y = -0.005; g.add(out);
      // upper: rounded toe box, low throat, collar and heel counter
      const up = new THREE.Shape(); up.moveTo(-0.47, 0.15); up.lineTo(0.48, 0.14); up.quadraticCurveTo(0.56, 0.2, 0.42, 0.3); up.quadraticCurveTo(0.12, 0.36, -0.08, 0.46); up.lineTo(-0.28, 0.5); up.quadraticCurveTo(-0.48, 0.5, -0.5, 0.36); up.closePath();
      const upG = new THREE.ExtrudeGeometry(up, { depth: 0.24, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.035, bevelSegments: 4, curveSegments: 16 }); upG.translate(0, 0, -0.12);
      const upper = new THREE.Mesh(upG, T.mat(upperCol, { roughness: 0.6 })); upper.castShadow = true; g.add(upper);
      // collar opening (dark) + tongue + heel tab
      const coll = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.05, 20), T.mat('#141416')); coll.scale.set(1.3, 1, 0.8); coll.position.set(-0.25, 0.5, 0); coll.rotation.z = -0.15; g.add(coll);
      const tongue = T.box(0.16, 0.05, 0.16, T.mat(upperCol), -0.08, 0.5, 0); tongue.rotation.z = -0.5; g.add(tongue);
      g.add(T.box(0.05, 0.16, 0.12, T.mat(accent), -0.53, 0.38, 0));
      // toe cap overlay
      const toe = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), T.mat(shade(upperCol, -0.08), { roughness: 0.5 })); toe.scale.set(1.2, 0.7, 0.95); toe.position.set(0.38, 0.16, 0); g.add(toe);
      // laces across the throat
      for (let k = 0; k < 4; k++) { const lx = 0.18 - k * 0.09, ly = 0.33 + k * 0.035; const lc = T.cyl(0.012, 0.012, 0.27, T.mat('#f4f4f2'), lx, ly, 0, 8); lc.rotation.x = Math.PI / 2; g.add(lc); }
      // our own side mark on both sides (canvas decal) — a generic hype-brand graphic, no real logos
      const dec = T.canvasTex(256, 128, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = accent; c.strokeStyle = accent; c.lineCap = 'round';
        if (mark === 'arc') { c.lineWidth = 14; c.beginPath(); c.ellipse(128, 64, 70, 40, 0, 0, 7); c.stroke(); c.beginPath(); c.arc(128, 64, 14, 0, 7); c.fill(); }
        else if (mark === 'bolt') { c.beginPath(); c.moveTo(40, 100); c.lineTo(130, 40); c.lineTo(120, 70); c.lineTo(220, 30); c.lineTo(130, 100); c.lineTo(140, 72); c.closePath(); c.fill(); }
        else { c.beginPath(); for (let q = 0; q < 10; q++) { const a = -Math.PI / 2 + q * Math.PI / 5, r = q % 2 ? 22 : 52; c.lineTo(128 + Math.cos(a) * r, 66 + Math.sin(a) * r); } c.closePath(); c.fill(); c.fillRect(20, 100, 216, 10); } });
      for (const zs of [1, -1]) { const d = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.31), new THREE.MeshBasicMaterial({ map: dec, transparent: true, side: THREE.DoubleSide, depthTest: true, polygonOffset: true, polygonOffsetFactor: -2 })); d.position.set(0.0, 0.31, zs * 0.205); if (zs < 0) d.rotation.y = Math.PI; g.add(d); }
      return g; };
    const looks = [['#f4f2ee', '#d8281e', '#ffffff', 'arc'], ['#3a3a44', '#f0c020', '#f4f0e8', 'bolt'], ['#2a6ad8', '#ffffff', '#f4f4f0', 'bars']];
    for (let i = 0; i < 3; i++) { const x = 9 + i * 1.8;
      const ped = T.cyl(0.42, 0.46, 1.0, T.mat('#16120e', { roughness: 0.4, metalness: 0.3 }), x, 0.5, 0, 32); st.add(ped); st.add(T.cyl(0.43, 0.43, 0.02, new THREE.MeshBasicMaterial({ color: 0xffd070 }), x, 1.0, 0, 32));
      const sn = mkSneaker(...looks[i]); sn.scale.setScalar(1.25); sn.position.set(x, 1.02, 0); sn.rotation.y = 0.5; st.add(sn); sneakers.push(sn);
      const gl = T.box(1.0, 0.95, 1.0, new THREE.MeshStandardMaterial({ color: '#bfe8ff', transparent: true, opacity: 0.08, roughness: 0.05, metalness: 0.2, depthWrite: false }), x, 1.5, 0); st.add(gl);
      const ed = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.0, 0.95, 1.0)), new THREE.LineBasicMaterial({ color: 0xd8f0ff, transparent: true, opacity: 0.5 })); ed.position.set(x, 1.5, 0); st.add(ed);
      const sp = new THREE.SpotLight(0xfff0d8, 2.2, 4, 0.5, 0.6, 1.5); sp.position.set(x + 0.3, 2.9, 1.2); sp.target.position.set(x, 1.1, 0); st.add(sp, sp.target); const fl = new THREE.PointLight(0xd8e8ff, 2.5, 4, 2); fl.position.set(x - 0.8, 1.6, 1.6); st.add(fl); }
    return { stage: st, sneakers }; },
  draw(s, t, info, T) { const w = [local(info, t, 'land', 0.13), local(info, t, 'houses', 0.59), local(info, t, 'paintings', 1.05), local(info, t, 'sneakers', 2.21)], xs = [-8, -3.4, 1.4, 10.8];
    const x = key(t, [[0, xs[0] - 1], [w[0] + 0.25, xs[0]], [w[1] + 0.25, xs[1]], [w[2] + 0.25, xs[2]], [w[3] - 0.3, xs[2] + 3], [w[3] + 0.3, xs[3]], [info.dur, xs[3] + 0.4]]);
    const zk = clamp((x - 7) / 3.8); s.stage.camera.position.set(x + 0.6, lerp(2.0, 1.75, zk), lerp(5.4, 4.3, zk)); s.stage.camera.lookAt(x, lerp(1.25, 1.2, zk), 0); (s.sneakers || []).forEach((sn, i) => (sn.rotation.y = -0.35 + 0.3 * Math.sin(t * 0.9 + i))); },
  overlay(g, t, info) { const w = [['LAND', 'land', 0.13], ['HOUSES', 'houses', 0.59], ['PAINTINGS', 'paintings', 1.05], ['RARE SNEAKERS', 'sneakers', 2.21]].map(([a, b, c]) => [a, local(info, t, b, c)]);
    let cur = null; w.forEach(([s2, at]) => { if (t >= at - 0.05) cur = [s2, at]; }); if (cur) word(g, cur[0], E.H * 0.13, 1, { size: 76, color: GOLD, scale: 0.85 + 0.15 * ease.outBack(prog(t, cur[1] - 0.05, cur[1] + 0.2)) });
    dayHUD(g, 10, t); },
});

// m24: "anything that won't burn becomes the new bank." a note burns beside a gold bar that just shines
registerShot('m24', { draw(g, t, info) {
  const nb = local(info, t, 'bank', 1.87), cam = { z: 1.0 + 0.08 * ease.inOut(t / info.dur) };
  bokehBG(g, t, { top: '#050404', bot: '#20100a', seed: 15 });
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, E.H * 0.62, 0, E.H, ['#3a0c10', '#14040a']); g.fillRect(-200, E.H * 0.62, E.W + 400, E.H);
    glow(g, E.W * 0.3, E.H * 0.55, 400, EMBER, 0.3); note(g, E.W * 0.3, E.H * 0.55, 0.75, { rot: -0.08, timer: '00:00:00', urgent: 1, burn: clamp(0.15 + t * 0.32), t, seed: 3 });
    glow(g, E.W * 0.7, E.H * 0.6, 420, GOLD, 0.28 + 0.1 * Math.sin(t * 3)); for (let j = 0; j < 3; j++) goldBar(g, E.W * 0.7 - 100 + j * 100, E.H * 0.66, 0.95, { shine: t * 0.8 + j * 0.3 }); goldBar(g, E.W * 0.7 - 50, E.H * 0.66 - 56, 0.95, { shine: t * 0.8 + 0.5 }); goldBar(g, E.W * 0.7 + 50, E.H * 0.66 - 56, 0.95, { shine: t * 0.8 + 0.9 });
    FX.sparkle(g, E.W * 0.74, E.H * 0.5, 30 + 10 * Math.sin(t * 6), '#fff4d0', 0.9);
  });
  text(g, "WON'T BURN", E.W * 0.7, E.H * 0.78, { size: 34, font: 'Nunito', weight: 900, color: '#ffe0a0', spacing: 4, alpha: ease.out(prog(t, 0.6, 0.9)) });
  text(g, 'BURNS', E.W * 0.3, E.H * 0.78, { size: 34, font: 'Nunito', weight: 900, color: RED, spacing: 4, alpha: ease.out(prog(t, 0.3, 0.6)) });
  word(g, 'THE NEW BANK', E.H * 0.13, ease.out(prog(t, nb - 0.15, nb + 0.15)), { size: 84, color: GOLD, scale: 0.9 + 0.1 * ease.outBack(prog(t, nb - 0.15, nb + 0.2)) });
  embers(g, t, { count: 40, a: 0.7, area: [E.W * 0.1, 0, E.W * 0.4, E.H * 0.7] });
  dayHUD(g, 10, t);
} });
