// sets/dream3d.js: Three.js builders for the Experience Machine: neon void, floating dream islands,
// the glowing headset, the life-support tank, and the "world in a glass sphere".
import { mood, rng, lerp, ease, prog, clamp } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { DREAMER, LOVE, FRIEND } from '../cast.js';

const glowMat = (T, c, o = 1) => new T.THREE.MeshBasicMaterial({ color: new T.THREE.Color(c), transparent: o < 1, opacity: o });
export function stageFor(T, o = {}) {
  return T.stage({ mood: o.mood || 'night', fov: o.fov || 45, fog: o.fog || [14, 80], fogColor: o.fogColor || '#140c34', keyPos: [4, 10, 6], keyIntensity: o.key ?? 2.0, keyColor: '#e8e4ff', ambient: o.ambient ?? 1.5, ambientSky: '#9a8ae0', bloom: o.bloom ?? 0.55, bloomThreshold: 0.88, sky: o.sky || ['#06041a', '#1a0e44', '#4a1e7a'] });
}
// neon grid floor
export function grid(T, st, o = {}) {
  const tex = T.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#0a0620'; g.fillRect(0, 0, w, h); g.strokeStyle = o.color || '#7ff0ff'; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * w / 8, 0); g.lineTo(i * w / 8, h); g.stroke(); g.beginPath(); g.moveTo(0, i * h / 8); g.lineTo(w, i * h / 8); g.stroke(); } });
  tex.wrapS = tex.wrapT = T.THREE.RepeatWrapping; tex.repeat.set(30, 30);
  const m = new T.THREE.Mesh(new T.THREE.PlaneGeometry(240, 240), new T.THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: o.opacity ?? 0.55 })); m.rotation.x = -Math.PI / 2; m.position.y = o.y ?? 0; st.add(m); return m;
}
// a drifting field of glowing shapes + star points
export function shapes(T, st, o = {}) {
  const R = rng(o.seed || 5), out = [], cols = o.colors || ['#7ff0ff', '#ff7ab4', '#b890ff', '#fff0c8'];
  for (let i = 0; i < (o.count || 26); i++) {
    const geo = [new T.THREE.IcosahedronGeometry(0.5 + R() * 0.8, 0), new T.THREE.TorusGeometry(0.6 + R() * 0.6, 0.08, 8, 32), new T.THREE.OctahedronGeometry(0.4 + R() * 0.6, 0)][i % 3];
    const m = new T.THREE.Mesh(geo, i % 3 === 1 ? glowMat(T, cols[i % cols.length]) : T.mat(cols[i % cols.length], { emissive: new T.THREE.Color(cols[i % cols.length]), emissiveIntensity: 0.3, roughness: 0.3, flat: true }));
    m.position.set(R() * 40 - 20, 2 + R() * 16, -R() * 30 - 4); st.add(m); out.push({ m, spin: 0.2 + R() * 0.6, bob: R() * 6 });
  }
  const pts = new T.THREE.BufferGeometry(), arr = new Float32Array(900 * 3); for (let i = 0; i < 900; i++) { arr[i * 3] = R() * 160 - 80; arr[i * 3 + 1] = R() * 60; arr[i * 3 + 2] = -R() * 120 + 20; }
  pts.setAttribute('position', new T.THREE.BufferAttribute(arr, 3)); st.add(new T.THREE.Points(pts, new T.THREE.PointsMaterial({ color: 0xffffff, size: 0.12 })));
  return out;
}
export const spinShapes = (list, t) => list.forEach((s) => { s.m.rotation.x = t * s.spin; s.m.rotation.y = t * s.spin * 0.7; s.m.position.y += Math.sin(t + s.bob) * 0.004; });
// a floating island: rocky cone underneath, grassy disc on top
export function island(T, st, x, y, z, r = 3, o = {}) {
  const g = new T.THREE.Group();
  const top = T.cyl(r, r * 0.95, 0.5, T.mat(o.grass || '#7ae0c0', { roughness: 0.8 }), 0, 0, 0, 24); g.add(top);
  const rock = T.cone(r * 0.95, r * 1.8, T.mat('#4a3a6a', { flat: true }), 0, -r * 0.9 - 0.25, 0, 9); rock.rotation.x = Math.PI; g.add(rock);
  if (o.trees !== false) { const R = rng((x * 7 + z) | 0); for (let i = 0; i < 3; i++) { const a = R() * 6.28, d = r * (0.7 + 0.2 * R()); const tr = T.sphere(0.5 + R() * 0.4, T.mat(['#ff9ad0', '#9fe0ff', '#c8a8ff'][i % 3], { emissive: new T.THREE.Color(['#ff9ad0', '#9fe0ff', '#c8a8ff'][i % 3]), emissiveIntensity: 0.05 }), Math.cos(a) * d, 1.2, Math.sin(a) * d); g.add(tr, T.cyl(0.06, 0.08, 0.9, '#3a2a4a', Math.cos(a) * d, 0.55, Math.sin(a) * d)); } }
  g.position.set(x, y, z); st.add(g); return g;
}
// the glowing headset (visor band + rings)
export function headset(T, st, o = {}) {
  const g = new T.THREE.Group();
  const band = new T.THREE.Mesh(new T.THREE.TorusGeometry(0.32, 0.05, 12, 48, Math.PI * 1.3), T.mat('#e8ecff', { roughness: 0.25, metalness: 0.6 })); band.rotation.z = -Math.PI * 0.15; g.add(band);
  const visor = T.box(0.62, 0.18, 0.22, glowMat(T, '#2a9ab8'), 0, -0.02, 0.28); g.add(visor);
  for (let i = 0; i < 3; i++) { const ring = new T.THREE.Mesh(new T.THREE.TorusGeometry(0.55 + i * 0.22, 0.012, 6, 64), glowMat(T, i % 2 ? '#c04a8a' : '#3ab8d0', 0.55)); g.add(ring); g.userData['r' + i] = ring; }
  const light = new T.THREE.PointLight(0x7ff0ff, 3, 5, 2); g.add(light);
  if (o.pos) g.position.set(...o.pos); st.add(g); return g;
}
export const animHeadset = (h, t) => { h.rotation.y = t * 0.6; for (let i = 0; i < 3; i++) { const r = h.userData['r' + i]; r.rotation.x = t * (0.8 + i * 0.4); r.rotation.y = t * (0.5 + i * 0.3); } h.position.y += Math.sin(t * 2) * 0.002; };
// life-support tank with a floating person and cables
export function tank(T, st, o = {}) {
  const g = new T.THREE.Group(), M = mood('night');
  g.add(T.cyl(1.4, 1.5, 0.4, T.mat('#2a2e4a', { metalness: 0.6, roughness: 0.4 }), 0, 0.2, 0, 32));
  g.add(T.cyl(1.4, 1.4, 0.4, T.mat('#2a2e4a', { metalness: 0.6, roughness: 0.4 }), 0, 4.6, 0, 32));
  const fluid = new T.THREE.Mesh(new T.THREE.CylinderGeometry(1.25, 1.25, 4, 32, 1, true), new T.THREE.MeshBasicMaterial({ color: 0x4ad8ff, transparent: true, opacity: 0.22, side: T.THREE.DoubleSide })); fluid.position.y = 2.4; g.add(fluid);
  const glass = new T.THREE.Mesh(new T.THREE.CylinderGeometry(1.3, 1.3, 4, 32, 1, true), new T.THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.2, side: T.THREE.DoubleSide })); glass.position.y = 2.4; g.add(glass);
  const p = T.figure3D(DREAMER, { rim: '#7ff0ff', pose: { ...POSES.relaxed } }); p.position.set(0, 1.1, 0); g.add(p);
  for (let i = 0; i < 5; i++) { const c = T.cyl(0.03, 0.03, 2.2, glowMat(T, i % 2 ? '#ff7ab4' : '#7ff0ff'), Math.cos(i) * 0.4, 3.9, Math.sin(i) * 0.4); c.rotation.z = (i - 2) * 0.2; g.add(c); }
  const light = new T.THREE.PointLight(0x4ad8ff, 5, 7, 2); light.position.y = 2.5; g.add(light);
  if (o.pos) g.position.set(...o.pos); st.add(g); g.userData.person = p; return g;
}
// people for the vignettes
export const person = (T, st, outfit, x, z, pose = 'stand', ry = 0, rim = '#ffe0f0') => { const f = T.figure3D(outfit, { rim, pose }); f.position.set(x, 0.25, z); f.rotation.y = ry; st.add(f); return f; };
export { DREAMER, LOVE, FRIEND };
