// sets/station.js: the 3D subway station shared by every 3D shot. Platform runs along x; the tracks are at z > 3.
import { mood, rng, lerp, ease, prog, clamp } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { FALLEN, RED, COMMUTER } from '../cast.js';

export const FALL_AT = [0.5, 0, 0.6];          // where the man collapses
export function buildStation(T, o = {}) {
  const M = mood('night');
  const st = T.stage({ mood: 'night', fov: o.fov || 50, fog: [18, 70], fogColor: '#1a2630', keyPos: [3, 9, 2], keyIntensity: 3.0, keyColor: '#ffe6c0', ambient: 2.6, ambientSky: '#a8c0cc', bloom: 0.9, shadowSize: 16, sky: ['#0a1016', '#141c24'] });
  const { THREE } = T;
  // platform + tiles + yellow edge
  st.add(T.ground(80, 9, '#6a727a', T.tiles('#6a727a', 4, [40, 5])));
  st.add(T.box(80, 0.02, 0.35, '#e8b52a', 0, 0.011, 3.3));
  // tracks pit
  st.add(T.box(80, 1.4, 4.5, '#0c1014', 0, -0.72, 5.75));
  for (const z of [4.9, 6.3]) st.add(T.box(80, 0.12, 0.12, '#8a8e94', 0, 0.02 - 1.3, z));
  // back wall: white tiles with a coloured band, lightbox ads
  st.add(T.box(80, 6, 0.3, T.mat('#cfd6d8', { map: T.tiles('#cfd6d8', 6, [60, 10]) }), 0, 3, -4.2));
  st.add(T.box(80, 0.5, 0.32, '#2a6a8a', 0, 2.6, -4.18));
  for (const x of [-14, -7, 7, 14]) { const ad = T.windowPane(3.2, 1.8, { glowColor: x % 14 ? '#ffd090' : '#9fe0ff', cols: 1, rows: 1, power: 1.1, interior: true }); ad.position.set(x, 1.7, -4.02); st.add(ad); }
  // pillars + ceiling + light strips
  for (let x = -24; x <= 24; x += 6) { st.add(T.box(0.7, 6, 0.7, '#9aa4aa', x, 3, -0.6)); }
  if (o.ceiling !== false) st.add(T.box(80, 0.3, 12, '#2a323a', 0, 6, 0));
  if (o.ceiling !== false) { for (let x = -24; x <= 24; x += 6) { const l = T.box(4.2, 0.08, 0.35, T.basic('#fff4dc'), x + 3, 5.82, 1.0); st.add(l); const s = T.shaft(3.6, 5.6, '#ffe8c0', 0.05); s.position.set(x + 3, 3, 1.0); st.add(s); } }
  for (let x = -18; x <= 18; x += 6) { const pl = new THREE.PointLight(0xffe2b8, 40, 16, 1.6); pl.position.set(x + 3, 5.2, 1.0); st.add(pl); }
  // the train (parked out of view unless used)
  const train = new THREE.Group();
  train.add(T.box(40, 3.0, 2.8, '#b8c0c6', 0, 1.0, 0));
  for (let i = -9; i <= 9; i++) { const w = T.windowPane(1.4, 1.0, { glowColor: '#ffe8c0', cols: 1, rows: 1, power: 1.0, interior: true }); w.position.set(i * 2.0, 1.4, -1.42); w.rotation.y = Math.PI; train.add(w); }
  train.add(T.box(40, 0.25, 2.85, '#d64a33', 0, 0.3, 0));
  train.position.set(80, 0, 5.6); st.add(train);
  // crowd
  const R = rng(o.seed || 21), crowd = [];
  for (let i = 0; i < 24; i++) {
    let x, z; do { x = R() * 22 - 11; z = R() * 5.2 - 2.4; } while (Math.hypot(x - FALL_AT[0], z - FALL_AT[2]) < 2.1);
    const outfit = i === 7 ? RED : COMMUTER[i % COMMUTER.length];
    const f = T.figure3D(outfit, { rim: M.rim, pose: i % 3 === 0 ? POSES.phone : POSES.stand }); f.position.set(x, 0, z); f.rotation.y = R() * Math.PI * 2; st.add(f);
    crowd.push({ f, x, z, base: f.rotation.y, red: i === 7, pose: i % 3 === 0 ? POSES.phone : POSES.stand });
  }
  // the red jacket stands at a known spot
  const red = crowd.find((c) => c.red); red.x = -2.6; red.z = 1.6; red.f.position.set(red.x, 0, red.z);
  const fallen = T.figure3D(FALLEN, { rim: '#ffd8a0', pose: POSES.stand }); fallen.position.set(...FALL_AT); st.add(fallen);
  return { stage: st, crowd, fallen, train, red };
}
// the collapse: k 0 = standing, 1 = lying on the floor
export function setFallen(fallen, k) {
  const e = ease.in(clamp(k));
  fallen.setPose(k < 0.6 ? 'stand' : { ...POSES.stand, hF: [30, -150], eF: [20, -130], kB: [-14, -52], fB: [-6, 0] });
  fallen.rotation.y = 0.35;          // topple sideways toward the tracks
  fallen.rotation.x = e * (Math.PI / 2 - 0.05);
  fallen.position.y = 0.06 * e;
}
// turn heads toward the fallen man (amount 0..1)
export function lookAtFallen(crowd, amt) {
  for (const c of crowd) { const target = Math.atan2(-(FALL_AT[2] - c.z), FALL_AT[0] - c.x); let d = target - c.base; d = Math.atan2(Math.sin(d), Math.cos(d)); c.f.rotation.y = c.base + d * clamp(amt); }
}
