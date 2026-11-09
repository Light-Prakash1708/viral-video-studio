// sets/ab_props.js: props + places for the airbag Short: a 1950s country road with a rock and a ditch, a vintage car
// (exterior + open interior with bench seat, dash and steering wheel), the ball-in-tube crash sensor, an inflating bag.
import { rng, lerp, clamp, ease } from '/engine/core.js';
import { lifeStage } from './lifesim.js';

// golden-hour country road: grass, asphalt road with centre dashes, trees, fence posts, a rock, a ditch on the right
export function roadWorld(T, o = {}) {
  const { THREE } = T, R = rng(o.seed || 5);
  const st = lifeStage(T, { sky: o.sky || ['#5a8ad8', '#a8c8e8', '#ffd8a0'], fog: [30, 140], fogColor: o.fogColor || '#e8d0b0', key: o.key ?? 2.6, keyPos: o.keyPos || [-20, 14, -30], keyColor: o.keyColor || '#ffd8a8', ambient: o.ambient ?? 1.7, ambientSky: '#c8d8f0', dof: false, bloom: 0.12 });
  const add = (m) => { st.add(m); return m; };
  const grass = add(new THREE.Mesh(new THREE.PlaneGeometry(400, 400), T.mat(o.grass || '#7aa84a'))); grass.rotation.x = -Math.PI / 2;
  const road = add(new THREE.Mesh(new THREE.PlaneGeometry(6, 400), T.mat('#4a4a50', { roughness: 0.9 }))); road.rotation.x = -Math.PI / 2; road.position.y = 0.01;
  for (let z = -200; z < 200; z += 6) { const d = add(new THREE.Mesh(new THREE.PlaneGeometry(0.18, 2.6), T.mat('#f2e2a0'))); d.rotation.x = -Math.PI / 2; d.position.set(0, 0.02, z); }
  const ditch = add(new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 400, 16, 1, true, Math.PI * 0.5, Math.PI), T.mat('#5a7a3a', { side: THREE.DoubleSide }))); ditch.rotation.x = Math.PI / 2; ditch.position.set(5.6, 0.0, 0); ditch.scale.set(1, 1, 0.35);
  const trunk = T.mat('#6a4a2e'), leaf = T.mat('#3a7a3a', { flat: true }), leaf2 = T.mat('#5a9a3a', { flat: true });
  for (let i = 0; i < 70; i++) { const side = R() < 0.5 ? -1 : 1, x = side * (9 + R() * 40), z = -180 + R() * 360, s = 1 + R() * 1.6; add(T.cyl(0.18 * s, 0.25 * s, 2.2 * s, trunk, x, 1.1 * s, z, 6)); const c = add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.4 * s, 0), R() < 0.5 ? leaf : leaf2)); c.position.set(x, 2.8 * s, z); }
  for (let z = -150; z < 150; z += 4) { add(T.cyl(0.06, 0.06, 1.0, T.mat('#8a6a44'), -4.2, 0.5, z, 5)); }
  add(T.box(0.05, 0.08, 300, T.mat('#8a6a44'), -4.2, 0.85, 0));
  const rock = add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 0), T.mat('#8a8278', { flat: true }))); rock.position.set(0.4, 0.55, -30); rock.scale.set(1.3, 0.8, 1);
  return { stage: st, rock };
}
// vintage 1950s car; .wheels to spin; interior bench + dash + wheel when o.interior
export function car(T, o = {}) {
  const { THREE } = T, g = new THREE.Group(), b = new THREE.MeshPhysicalMaterial({ color: o.color || '#2a6a8a', roughness: 0.25, clearcoat: 1 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 2.2, 6, 16), b); body.rotation.z = Math.PI / 2; body.position.y = 0.55; body.scale.set(1, 1, 1.25); g.add(body);
  const cab = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), b); cab.scale.set(1.2, 0.8, 0.85); cab.position.set(-0.2, 0.85, 0); g.add(cab);
  const glass = new THREE.MeshStandardMaterial({ color: '#9ac8e8', roughness: 0.05, metalness: 0.4, transparent: true, opacity: 0.55 });
  const ws = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.42), glass); ws.position.set(0.45, 1.1, 0); ws.rotation.y = Math.PI / 2; ws.rotation.x = 0; ws.rotation.z = 0.5; g.add(ws);
  const chrome = new THREE.MeshStandardMaterial({ color: '#e8e8f0', metalness: 0.9, roughness: 0.2 }); const bump = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 1.2), chrome); bump.position.set(1.68, 0.35, 0); g.add(bump); const bump2 = bump.clone(); bump2.position.x = -1.68; g.add(bump2);
  const wm = new THREE.MeshStandardMaterial({ color: '#1a1a1e' }), hub = new THREE.MeshStandardMaterial({ color: '#f4f4f0' }); const wheels = [];
  for (const [x, z] of [[-0.9, 0.52], [0.9, 0.52], [-0.9, -0.52], [0.9, -0.52]]) { const w = new THREE.Group(); const t = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 18), wm); t.rotation.x = Math.PI / 2; w.add(t); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.19, 12), hub); h.rotation.x = Math.PI / 2; w.add(h); const sp = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.2), wm); w.add(sp); w.position.set(x, 0.28, z); g.add(w); wheels.push(w); }
  const hl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshBasicMaterial({ color: '#fff4c0' })); hl.position.set(1.62, 0.6, 0.3); g.add(hl); const hl2 = hl.clone(); hl2.position.z = -0.3; g.add(hl2);
  g.userData.wheels = wheels; g.spin = (d) => wheels.forEach((w) => (w.rotation.z = -d / 0.28)); g.scale.setScalar(o.s || 1); return g;
}
// open car interior for the "arms across" shot: bench seat, dashboard, steering wheel (camera sits at the windshield looking back)
export function interior(T, st, o = {}) {
  const { THREE } = T, g = new THREE.Group(); st.add(g);
  const seat = T.mat(o.seat || '#a8302a', { roughness: 0.7 }); g.add(T.box(2.4, 0.35, 0.8, seat, 0, 0.45, 0)); g.add(T.box(2.4, 0.9, 0.2, seat, 0, 0.95, -0.4));
  const dash = T.mat(o.dash || '#2a6a8a'); g.add(T.box(2.6, 0.5, 0.4, dash, 0, 0.95, 1.5)); g.add(T.box(2.6, 0.06, 0.5, T.mat('#e8e8f0', { metalness: 0.8, roughness: 0.2 }), 0, 1.22, 1.5));
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 10, 32), T.mat('#f2ece0')); wheel.position.set(-0.6, 1.15, 1.15); wheel.rotation.x = -0.6; g.add(wheel);
  const hubm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16), T.mat('#c8c8d0', { metalness: 0.8 })); hubm.rotation.x = Math.PI / 2 - 0.6; hubm.position.copy(wheel.position); g.add(hubm);
  for (const x of [-1.25, 1.25]) g.add(T.box(0.1, 1.4, 2.4, T.mat(o.dash || '#2a6a8a'), x, 0.7, 0.5));
  return { g, wheel };
}
// the ball-in-tube crash sensor (Allen Breed): glass tube, steel ball held by a magnet, gold contacts; .fire(k)
export function sensor(T) {
  const { THREE } = T, g = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 3.2, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: '#9ad0ff', transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.1, depthWrite: false, side: THREE.DoubleSide })); tube.rotation.z = Math.PI / 2; g.add(tube);
  for (const x of [-1.6, 1.6]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 8, 32), new THREE.MeshStandardMaterial({ color: '#c8c8d0', metalness: 0.8 })); r.rotation.y = Math.PI / 2; r.position.x = x; g.add(r); }
  const mag = new THREE.Group(); const mm = new THREE.MeshStandardMaterial({ color: '#d8302a' }); const u1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.7, 0.5), mm); mag.add(u1); const tip = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.2, 0.51), new THREE.MeshStandardMaterial({ color: '#e8e8f0', metalness: 0.7 })); tip.position.y = 0.35; mag.add(tip); mag.position.set(-1.85, 0, 0); g.add(mag);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 20), new THREE.MeshStandardMaterial({ color: '#d8dce4', metalness: 1, roughness: 0.12 })); ball.position.x = -1.3; g.add(ball);
  const cm = new THREE.MeshStandardMaterial({ color: '#ffc83a', metalness: 0.9, roughness: 0.2, emissive: new THREE.Color('#ff9a1a'), emissiveIntensity: 0 });
  for (const y of [0.18, -0.18]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.2), cm); c.position.set(1.85, y, 0); g.add(c); }
  g.fire = (k) => { const e = ease.in(clamp(k)); ball.position.x = lerp(-1.3, 1.32, e); ball.rotation.z = -e * 9; cm.emissiveIntensity = k >= 1 ? 1.5 : 0; };
  g.userData = { ball, contacts: cm }; return g;
}
// the bag: a wrinkled fabric balloon that bursts out of a hub; .inflate(k)
export function airbag(T) {
  const { THREE } = T, geo = new THREE.SphereGeometry(1, 64, 40), base = Float32Array.from(geo.attributes.position.array), R = rng(3), jit = new Float32Array(base.length / 3).map(() => R());
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: '#f6f4ee', roughness: 0.7, sheen: 0.6, sheenColor: new THREE.Color('#ffffff') })); const g = new THREE.Group(); g.add(m);
  g.inflate = (k) => { const e = clamp(k), p = geo.attributes.position.array; for (let i = 0; i < p.length; i += 3) { const x = base[i], y = base[i + 1]; const w = 1 - 0.12 * (1 - e) * jit[i / 3] - 0.025 * Math.sin(x * 9 + y * 4) - 0.02 * Math.sin(y * 13 - x * 3); p[i] = base[i] * w; p[i + 1] = base[i + 1] * w; p[i + 2] = base[i + 2] * w * 0.75; } geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
    const s = Math.max(0.02, ease.out(e)); m.scale.set(s, s, s); m.position.z = 0.55 * s; g.visible = e > 0.001; };
  g.inflate(0); return g;
}
