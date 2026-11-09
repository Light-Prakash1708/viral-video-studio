// shots/04_sky3d.js: the legendary Pushpaka Vimana among sunset clouds; the real Raavana-1 cubesat orbiting a 3D Earth.
import { E, V, registerShot, ease, prog, clamp, lerp, rng, text } from '/engine/core.js';
import { WORLD } from '../sets/world50m.js';
import { glowSpriteMat, fast } from '../sets/lanka.js';
import { stat } from '../sets/stat.js';
import { local, at, topBand, botBand, headline, chip } from '../sets/ui.js';

function pushpaka(T) {
  const { THREE } = T, g = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({ color: '#ffc45a', metalness: 0.85, roughness: 0.3, emissive: new THREE.Color('#4a2800'), emissiveIntensity: 0.35 });
  const glowM = new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff0c0') });
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 2.6, 0.6, 8), gold); g.add(deck);
  const under = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.6, 8), gold); under.rotation.x = Math.PI; under.position.y = -1.1; g.add(under);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 8), gold); p.position.set(Math.cos(a) * 2.6, 1.4, Math.sin(a) * 2.6); g.add(p); }
  for (let i = 0; i < 6; i++) { const r = 3.0 - i * 0.45; const tier = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.4, r, 0.7, 8), gold); tier.position.y = 2.8 + i * 0.7; g.add(tier);
    const band = new THREE.Mesh(new THREE.TorusGeometry(r - 0.05, 0.05, 6, 32), glowM); band.rotation.x = Math.PI / 2; band.position.y = 2.45 + i * 0.7; g.add(band); }
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.6, 8), gold); fin.position.y = 7.8; g.add(fin);
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, 1.6), gold); w.position.set(0, 0, s * 3.6); w.rotation.x = s * 0.25; g.add(w); }
  const sp = new THREE.Sprite(glowSpriteMat(T, '#ffb050', 0.7)); sp.scale.set(14, 14, 1); sp.position.y = -1.2; g.add(sp);
  const lamp = new THREE.PointLight(0xffc070, 60, 30, 1.6); lamp.position.y = 1.5; g.add(lamp);
  return g;
}
function cloudField(T, st, seed, o = {}) {
  const { THREE } = T, R = rng(seed), out = [];
  const m = new THREE.MeshStandardMaterial({ color: o.color || '#ffd8c0', roughness: 1, flatShading: true, emissive: new THREE.Color(o.em || '#5a2a30'), emissiveIntensity: 0.35 });
  for (let i = 0; i < 70; i++) { const c = new THREE.Group(); const n = 3 + Math.floor(R() * 4); for (let k = 0; k < n; k++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(3 + R() * 5, 1), m); s.position.set((R() - 0.5) * 14, (R() - 0.3) * 3, (R() - 0.5) * 8); s.scale.y = 0.55; c.add(s); }
    c.position.set((R() - 0.5) * 260, -14 + R() * 26 - (R() < 0.5 ? 12 : 0), -R() * 300 + 60); st.add(c); out.push(c); }
  return out;
}
// r22 "And then there's the Pushpaka Vimana." the flying chariot glides through a sea of sunset clouds
registerShot('r22', { kind: '3d', init: (T) => {
  const st = T.stage({ mood: 'golden', fov: 42, fog: [40, 260], fogColor: '#e8a070', sky: ['#1a1a4a', '#6a3a6a', '#e0805a', '#ffd090'], keyPos: [-40, 30, -80], keyIntensity: 2.6, keyColor: '#ffc080', ambient: 1.6, ambientSky: '#c8a0c0', bloom: 0.5, bloomThreshold: 0.86 });
  fast(T, st); st.sun.castShadow = false; const v = pushpaka(T); st.add(v); const cl = cloudField(T, st, 5); const sun = new T.THREE.Sprite(glowSpriteMat(T, '#ffd890', 0.7)); sun.scale.set(80, 80, 1); sun.position.set(-60, 10, -240); st.add(sun);
  return { stage: st, v, cl };
}, draw(s, t, info, T) { const z = -t * 9; s.v.position.set(0, Math.sin(t * 1.2) * 0.4, z); s.v.rotation.set(0.04 * Math.sin(t), 0.25 + t * 0.06, 0.05 * Math.sin(t * 0.8));
  const k = ease.inOut(t / info.dur); s.stage.camera.position.set(lerp(16, 10, k), lerp(4, 6.5, k), z + lerp(18, 12, k)); s.stage.camera.lookAt(0, lerp(2.5, 3.2, k), z); },
  overlay(g, t, info) { const p = at(info, t, 'pushpaka', 1.6); topBand(g, 0.7, 0.26); headline(g, 'PUSHPAKA VIMANA', E.H * 0.14, ease.out(prog(t, p - 0.2, p + 0.2)), { size: 84, sub: 'THE LEGENDARY FLYING CHARIOT' }); },
});
// Earth: equirectangular texture drawn from the Natural Earth polygons
function earthTex(T) {
  return T.canvasTex(2048, 1024, (g, w, h) => { g.fillStyle = '#0a2a4a'; g.fillRect(0, 0, w, h);
    const P = (lon, lat) => [((lon + 180) / 360) * w, ((90 - lat) / 180) * h];
    for (const c of WORLD) { const sl = c.iso === 'LKA'; g.fillStyle = sl ? '#ffc45a' : '#5a6a3a'; for (const poly of c.p) { g.beginPath(); for (const ring of poly) ring.forEach(([x, y], i) => { const [px, py] = P(x, y); i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.fill('evenodd'); } }
    g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(0, 0, w, h * 0.04); g.fillRect(0, h * 0.95, w, h * 0.05); });
}
function cubesat(T) {
  const { THREE } = T, g = new THREE.Group();
  const foil = new THREE.MeshStandardMaterial({ color: '#d8a040', metalness: 0.9, roughness: 0.35 });
  const pTex = T.canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#0a1840'; c.fillRect(0, 0, w, h); c.strokeStyle = '#4a7ad0'; c.lineWidth = 3; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32, h); c.stroke(); c.beginPath(); c.moveTo(0, i * 32); c.lineTo(w, i * 32); c.stroke(); } });
  const panel = new THREE.MeshStandardMaterial({ map: pTex, metalness: 0.6, roughness: 0.3, emissive: new THREE.Color('#0a1a50'), emissiveIntensity: 0.4 });
  g.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), foil));
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.04, 0.95), panel); p.position.set(s * 1.5, 0, 0); g.add(p); }
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), foil); ant.position.set(0.3, 1.0, 0.2); ant.rotation.z = 0.3; g.add(ant);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff5a3a') })); led.position.set(0.51, 0.3, 0.3); g.add(led);
  return g;
}
function earthStage(T) {
  const { THREE } = T; const st = T.stage({ mood: 'night', fov: 40, fog: false, sky: ['#010208', '#03061a', '#050a24'], keyPos: [40, 20, 30], keyIntensity: 3.2, keyColor: '#fff4e0', ambient: 0.5, ambientSky: '#4a6aa0', bloom: 0.5, bloomThreshold: 0.86 });
  fast(T, st); st.sun.castShadow = false;
  const earth = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 48), new THREE.MeshStandardMaterial({ map: earthTex(T), roughness: 0.85, metalness: 0.05 })); st.add(earth);
  const atm = new THREE.Sprite(glowSpriteMat(T, '#5ab0ff', 0.35)); atm.scale.set(29, 29, 1); st.add(atm);
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(13, 0.025, 6, 180), new THREE.MeshBasicMaterial({ color: new THREE.Color('#7fe8ff'), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })); orbit.rotation.x = Math.PI / 2 - 0.5; st.add(orbit);
  const sat = cubesat(T); sat.scale.setScalar(0.35); st.add(sat); const sg = new THREE.Sprite(glowSpriteMat(T, '#ffd27a', 0.5)); sg.scale.set(2, 2, 1); sat.add(sg);
  const R = rng(3), geo = new THREE.BufferGeometry(), arr = new Float32Array(2000 * 3); for (let i = 0; i < 2000; i++) { const a = R() * 6.28, b = Math.acos(2 * R() - 1), d = 200; arr.set([Math.sin(b) * Math.cos(a) * d, Math.cos(b) * d, Math.sin(b) * Math.sin(a) * d], i * 3); }
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3)); st.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.4, sizeAttenuation: false })));
  // rotate Earth so Sri Lanka (80.7E, 7.6N) faces +z
  earth.rotation.y = -Math.PI / 2 - (80.7 * Math.PI) / 180; earth.rotation.x = 0.13;
  return { stage: st, earth, orbit, sat };
}
const satPos = (s, a) => { const r = 13, q = new s.stage.scene.position.constructor(Math.cos(a) * r, 0, Math.sin(a) * r); q.applyAxisAngle(new s.stage.scene.position.constructor(1, 0, 0), -0.5); return q; };
// r28 "Fun fact in our real world, Sri Lanka's first satellite," REAL WORLD FACT over a turning Earth
registerShot('r28', { kind: '3d', init: (T) => earthStage(T),
  draw(s, t, info, T) { s.earth.rotation.y += 0.0; const a = 1.2 + t * 0.25; const p = satPos(s, a); s.sat.position.copy(p); s.sat.rotation.set(t * 0.4, t * 0.3, 0.2);
    T.dolly(s.stage.camera, t, [[0, { pos: [8, 6, 40], look: [0, 0, 0] }], [info.dur, { pos: [14, 5, 32], look: [0, 1, 0] }]]); },
  overlay(g, t, info) { topBand(g, 0.85, 0.3); chip(g, 'REAL WORLD FACT', E.W / 2, E.H * 0.08, ease.outBack(prog(t, 0.05, 0.4)), { color: '#7fe8ff', size: 34 }); const sl = at(info, t, 'satellite', 4.3); headline(g, "SRI LANKA'S FIRST SATELLITE", E.H * 0.2, ease.out(prog(t, sl - 0.6, sl)), { size: 68, color: '#e8f6ff' }); },
});
// r29 "launched in 2019, was named Raavana-1." close on the cubesat, Lanka glowing below
registerShot('r29', { kind: '3d', init: (T) => earthStage(T),
  draw(s, t, info, T) { const a = 1.55 + t * 0.05; const p = satPos(s, a); s.sat.position.copy(p); s.sat.rotation.set(0.3 + t * 0.2, t * 0.35, 0.2);
    const c = p.clone().multiplyScalar(1.32); c.y += 1.6; c.x += 2.6 - t * 0.25; s.stage.camera.position.copy(c); s.stage.camera.lookAt(p.x * 0.85, p.y * 0.85 - 0.6, p.z * 0.85); },
  overlay(g, t, info) { const y = at(info, t, '2019', 1.1), n = at(info, t, 'named', 2.5); topBand(g, 0.8, 0.28);
    headline(g, 'RAAVANA-1', E.H * 0.15, ease.out(prog(t, n - 0.1, n + 0.3)), { size: 104, sub: 'SRI LANKA · CUBESAT', color: '#ffd27a', spacing: 10, scale: 1 + 0.12 * Math.max(0, 1 - Math.abs(t - n - 0.3) / 0.3) });
    botBand(g, 0.6, 0.3); stat(g, { label: 'LAUNCHED', value: '2019', x: E.W * 0.84, y: E.H * 0.74, size: 72, color: '#7fe8ff', a: ease.out(prog(t, y - 0.2, y + 0.1)), pulse: t - y }); },
});
