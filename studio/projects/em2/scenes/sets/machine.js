// sets/machine.js: the readable Experience Machine. A sleep pod with a glass lid, the dreamer lying inside wearing the headset,
// thick glowing cables to a server tower with travelling light pulses, plus the showroom and the plug macro.
import { mood, rng, lerp, ease, prog, clamp } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { DREAMER, DEALER } from '../cast.js';
import { stageFor, grid, shapes, headset } from './dream3d.js';

const basic = (T, c, o = 1) => new T.THREE.MeshBasicMaterial({ color: new T.THREE.Color(c), transparent: o < 1, opacity: o });
export function cleanStage(T, o = {}) {
  return stageFor(T, { mood: 'interiorCool', sky: o.sky || ['#050604', '#0e100c', '#1a1c16'], fogColor: '#050604', fog: o.fog || [12, 40], ambient: o.ambient ?? 1.6, key: o.key ?? 2.6, bloom: o.bloom ?? 0.45, fov: o.fov || 42 });
}
function screenTex(T, lines) {
  return T.canvasTex(512, 320, (g, w, h) => { g.fillStyle = '#04121c'; g.fillRect(0, 0, w, h); g.strokeStyle = '#b8ff6a'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16); g.fillStyle = '#b8ff6a'; g.font = '900 54px Nunito'; g.textAlign = 'center'; lines.forEach((l, i) => g.fillText(l, w / 2, 110 + i * 80)); g.strokeStyle = '#ff8a3a'; g.lineWidth = 5; g.beginPath(); for (let x = 30; x < w - 30; x += 6) g.lineTo(x, 270 + Math.sin(x * 0.08) * 18 * Math.sin(x * 0.013)); g.stroke(); });
}
// the pod + tower + cables. Returns handles used to animate.
export function machine(T, st, o = {}) {
  const { THREE } = T, g = new THREE.Group();
  // pod base and mattress
  g.add(T.box(2.6, 0.45, 1.1, T.mat('#c8c4b0', { roughness: 0.3, metalness: 0.4 }), 0, 0.25, 0));
  g.add(T.box(2.3, 0.1, 0.85, T.mat('#2a2c22'), 0, 0.52, 0));
  for (const z of [-0.56, 0.56]) g.add(T.box(2.6, 0.04, 0.04, basic(T, '#b8ff6a'), 0, 0.48, z));
  // the dreamer lying face-up, head toward -x
  const me = T.figure3D(DREAMER, { rim: '#b8ff6a', pose: POSES.stand }); me.rotation.z = Math.PI / 2; me.position.set(0.85, 0.62, 0); g.add(me);
  // headset on his head
  const hs = headset(T, { add: (m) => g.add(m) }); hs.position.set(-0.68, 0.66, 0); hs.rotation.set(0, Math.PI / 2, Math.PI / 2); hs.scale.setScalar(0.62);
  // glass lid (half cylinder along x) with bright edges
  const lidGeo = new THREE.CylinderGeometry(0.62, 0.62, 2.5, 32, 1, true, 0, Math.PI);
  const lid = new THREE.Mesh(lidGeo, new THREE.MeshStandardMaterial({ color: 0xd8f0c0, transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide }));
  lid.rotation.set(0, 0, Math.PI / 2); const lidG = new THREE.Group(); lidG.add(lid);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(lidGeo, 30), new THREE.LineBasicMaterial({ color: 0xb8ff6a })); edges.rotation.copy(lid.rotation); lidG.add(edges);
  lidG.position.set(0, 0.52, 0); g.add(lidG);
  // server tower with light strips + a status screen
  const tower = new THREE.Group(); tower.add(T.box(1.0, 2.8, 0.9, T.mat('#161812', { roughness: 0.4, metalness: 0.5 }), 0, 1.4, 0));
  for (let i = 0; i < 9; i++) tower.add(T.box(0.7, 0.04, 0.02, basic(T, i % 3 ? '#b8ff6a' : '#ff8a3a'), 0, 0.5 + i * 0.22, 0.46));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.53), new THREE.MeshBasicMaterial({ map: screenTex(T, ['DREAM', 'ACTIVE']) })); scr.position.set(0, 2.45, 0.46); tower.add(scr);
  tower.position.set(-2.4, 0, -0.9); g.add(tower);
  // three thick cables from the headset up and over into the tower
  const start = new THREE.Vector3(-0.85, 0.75, 0), end = new THREE.Vector3(-2.4, 2.0, -0.45), cables = [];
  [-0.12, 0, 0.12].forEach((dz, i) => {
    const curve = new THREE.CatmullRomCurve3([start.clone().add(new THREE.Vector3(0, 0, dz)), new THREE.Vector3(-1.2, 1.6 + i * 0.1, dz), new THREE.Vector3(-1.9, 2.4, -0.2 + dz), end.clone().add(new THREE.Vector3(0, i * 0.12, 0))]);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.035, 10, false), T.mat('#1c1e18', { roughness: 0.4, metalness: 0.4, emissive: new THREE.Color(i === 1 ? '#ff7a2a' : '#6aa04a'), emissiveIntensity: 0.5 }));
    g.add(tube); const pulses = []; for (let k = 0; k < 4; k++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 8), basic(T, i === 1 ? '#ffc890' : '#e0ffc0')); g.add(p); pulses.push(p); }
    cables.push({ curve, tube, pulses });
  });
  const light = new THREE.PointLight(0xb8ff6a, 4, 6, 2); light.position.set(0, 1.6, 0.6); g.add(light);
  if (o.pos) g.position.set(...o.pos); st.add(g);
  return { group: g, me, hs, lid: lidG, tower, cables, screen: scr };
}
// animate the light pulses travelling from the tower into the headset (dir -1) ; power 0..1 fades them
export function pulseCables(m, t, power = 1, dir = -1) {
  m.cables.forEach((c, i) => c.pulses.forEach((p, k) => { let u = ((t * 0.5 + k / 4 + i * 0.13) % 1); if (dir < 0) u = 1 - u; const pt = c.curve.getPointAt(u); p.position.copy(pt); p.visible = power > 0.05; p.scale.setScalar(0.6 + power * 0.8); }));
  m.cables.forEach((c) => (c.tube.material.emissiveIntensity = 0.15 + 0.9 * power));
}
// the showroom: dark glossy floor, neon arch, a pedestal with the headset, the dealer
export function showroom(T, st, o = {}) {
  grid(T, st, { opacity: 0.18 });
  const { THREE } = T;
  const arch = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.06, 12, 64, Math.PI), basic(T, '#b8ff6a')); arch.position.set(0, 0, -3.5); st.add(arch);
  const arch2 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.04, 12, 64, Math.PI), basic(T, '#ff7a2a')); arch2.position.set(0, 0, -3.8); st.add(arch2);
  st.add(T.cyl(0.45, 0.55, 1.0, T.mat('#c8c4b0', { roughness: 0.3, metalness: 0.5 }), 0.9, 0.5, 0, 32));
  st.add(T.cyl(0.47, 0.47, 0.03, basic(T, '#b8ff6a'), 0.9, 1.01, 0, 32));
  const hs = headset(T, st, { pos: [0.9, 1.55, 0] });
  const dealer = T.figure3D(DEALER, { rim: '#ffb070', pose: POSES.explain }); dealer.position.set(1.9, 0, -0.4); dealer.rotation.y = Math.PI * 0.85; st.add(dealer);
  const me = T.figure3D(DREAMER, { rim: '#b8ff6a', pose: POSES.stand }); me.position.set(-0.9, 0, 0.6); me.rotation.y = -0.15; st.add(me);
  const spot = new THREE.SpotLight(0xffffff, 60, 12, 0.5, 0.6, 1.5); spot.position.set(0.9, 6, 2); spot.target.position.set(0.9, 1, 0); st.add(spot, spot.target);
  return { hs, dealer, me };
}
// the plug macro: a big headset side with a socket, and a plug sliding in on cue (k 0..1)
export function plugRig(T, st) {
  const { THREE } = T, g = new THREE.Group();
  g.add(T.box(1.6, 0.9, 0.6, T.mat('#c8c4b0', { roughness: 0.25, metalness: 0.6 }), 0, 0, 0));
  g.add(T.box(1.62, 0.12, 0.62, basic(T, '#b8ff6a'), 0, 0.2, 0));
  const socket = T.cyl(0.16, 0.16, 0.08, T.mat('#0a0c14'), 0.82, -0.1, 0, 24); socket.rotation.z = Math.PI / 2; g.add(socket);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.025, 8, 32), basic(T, '#b8ff6a')); ring.position.set(0.86, -0.1, 0); ring.rotation.y = Math.PI / 2; g.add(ring);
  const plug = new THREE.Group(); plug.add(T.cyl(0.13, 0.13, 0.5, T.mat('#2a2c24', { metalness: 0.6, roughness: 0.3 }), 0, 0, 0, 24)); plug.add(T.cyl(0.14, 0.14, 0.06, basic(T, '#ff7a2a'), 0, -0.2, 0, 24));
  for (const dz of [-0.05, 0.05]) plug.add(T.box(0.03, 0.18, 0.03, T.mat('#d8dce4', { metalness: 0.9, roughness: 0.2 }), 0, 0.33, dz));
  const cable = T.cyl(0.05, 0.05, 3, T.mat('#1c1e18', { emissive: new THREE.Color('#6aa04a'), emissiveIntensity: 0.6 }), 0, -1.75, 0, 12); plug.add(cable);
  plug.rotation.z = Math.PI / 2; g.add(plug);
  const spark = new THREE.PointLight(0xb8ff6a, 0, 4, 2); spark.position.set(0.9, -0.1, 0.2); g.add(spark);
  st.add(g);
  return { g, plug, ring, spark, set(k) { plug.position.set(lerp(2.9, 1.18, ease.inOut(clamp(k))), -0.1, 0); const on = k >= 0.99; spark.intensity = on ? 3 : 0; ring.material.color.set(on ? '#ff7a2a' : '#b8ff6a'); } };
}
