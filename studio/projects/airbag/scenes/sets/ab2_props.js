// sets/ab2_props.js (v2): realistic sunny country road (painted sky dome with clouds, textured asphalt, noise rocks,
// clustered bushes + trees, telephone poles), a glossy 1950s sedan with a see-through cabin (cartoon riders show through the
// glass), a steering-wheel inflator cutaway (pellets, igniter, nitrogen gas, tearing cover flaps), a crash-test dummy.
import { rng, lerp, clamp, ease } from '/engine/core.js';
import { lifeStage } from './lifesim.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

let ENV = null;
export function envMap(T) { if (ENV) return ENV; const { THREE } = T, pm = new THREE.PMREMGenerator(T.getRenderer()); ENV = pm.fromScene(new RoomEnvironment(), 0.04).texture; return ENV; }
const shadowAll = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };

// smooth value-noise-ish displacement from random sine waves
function noiseFn(seed, n = 7) { const R = rng(seed), W = []; for (let i = 0; i < n; i++) { const a = R() * 6.28, b = Math.acos(2 * R() - 1); W.push([Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a), 1.5 + R() * 3.5 * (i / n + 0.4), R() * 6.28, 1 / (1 + i * 0.7)]); } return (x, y, z) => { let s = 0; for (const [dx, dy, dz, f, p, a] of W) s += Math.sin((x * dx + y * dy + z * dz) * f + p) * a; return s; }; }
export function rockGeo(T, seed = 1, o = {}) {
  const { THREE } = T, geo = new THREE.IcosahedronGeometry(1, o.detail ?? 4), P = geo.attributes.position, N = noiseFn(seed), N2 = noiseFn(seed + 9, 5), col = [], c = new THREE.Color(), base = new THREE.Color(o.color || '#8c8478'), moss = new THREE.Color('#6a7a3a');
  for (let i = 0; i < P.count; i++) { let x = P.getX(i), y = P.getY(i), z = P.getZ(i); const d = 1 + 0.22 * N(x, y, z) + 0.06 * N2(x * 3, y * 3, z * 3); x *= d; y *= d; z *= d; if (y < -0.35) y = -0.35 - (y + 0.35) * 0.15; P.setXYZ(i, x, y * (o.flat ?? 0.7), z);
    const v = 0.82 + 0.18 * N2(x * 4, y * 4, z * 4) * 0.5; c.copy(base).multiplyScalar(v); if (y > 0.2 && N(x * 2, 0, z * 2) > 0.5) c.lerp(moss, 0.45); col.push(c.r, c.g, c.b); }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.computeVertexNormals(); return geo;
}
export function rock(T, seed = 1, o = {}) { const m = new T.THREE.Mesh(rockGeo(T, seed, o), new T.THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 })); return shadowAll(m); }
// a leafy blob geometry (lumpy, for bushes and tree canopies)
function blobGeo(T, seed) { const { THREE } = T, geo = new THREE.IcosahedronGeometry(1, 3), P = geo.attributes.position, N = noiseFn(seed, 9); for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i), z = P.getZ(i), d = 1 + 0.16 * N(x * 1.6, y * 1.6, z * 1.6); P.setXYZ(i, x * d, y * d * 0.85, z * d); } geo.computeVertexNormals(); return geo; }
// instanced foliage: list of [x,y,z,r,colorHex]
export function foliage(T, items, seed = 3) { const { THREE } = T, geo = blobGeo(T, seed), m = new THREE.MeshStandardMaterial({ roughness: 0.85, color: '#ffffff' }), im = new THREE.InstancedMesh(geo, m, items.length), M4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), c = new THREE.Color(), R = rng(seed);
  items.forEach(([x, y, z, r, col], i) => { e.set(R() * 0.5, R() * 6.28, R() * 0.5); q.setFromEuler(e); M4.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(r, r * (0.8 + R() * 0.3), r)); im.setMatrixAt(i, M4); im.setColorAt(i, c.set(col)); });
  im.castShadow = true; im.receiveShadow = true; return im; }
const GREENS = ['#3f6e2a', '#4f8030', '#5e9238', '#36602a', '#6a9a3e', '#2f5a26'];
export function bushItems(R, x, z, s = 1) { const out = [], n = 5 + Math.floor(R() * 6); for (let i = 0; i < n; i++) { const a = R() * 6.28, d = R() * 0.7 * s, r = (0.35 + R() * 0.4) * s; out.push([x + Math.cos(a) * d, r * 0.75 + R() * 0.2 * s, z + Math.sin(a) * d, r, GREENS[Math.floor(R() * GREENS.length)]]); } return out; }
export function treeItems(R, x, z, s = 1) { const out = [], h = (3.2 + R() * 1.5) * s, n = 7 + Math.floor(R() * 5); for (let i = 0; i < n; i++) { const a = R() * 6.28, d = R() * 1.2 * s, r = (0.8 + R() * 0.6) * s; out.push([x + Math.cos(a) * d, h + (R() - 0.3) * 1.4 * s, z + Math.sin(a) * d, r, GREENS[Math.floor(R() * GREENS.length)]]); } return { items: out, h }; }

// painted sky dome: deep blue to pale horizon with soft cumulus clouds
export function skyDome(T, o = {}) {
  const { THREE } = T, R = rng(o.seed || 7), tex = T.canvasTex(2048, 1024, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h * 0.5); gr.addColorStop(0, o.top || '#2a6ad0'); gr.addColorStop(0.6, o.mid || '#6aa6e8'); gr.addColorStop(1, o.hor || '#d8e8f2'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = o.hor || '#d8e8f2'; g.fillRect(0, h * 0.5, w, h * 0.5);
    for (let c = 0; c < (o.clouds ?? 26); c++) { const cx = R() * w, cy = h * (0.16 + R() * 0.3), sc = (0.5 + R()) * (0.5 + (cy / h) * 1.2) * 70; for (let i = 0; i < 26; i++) { const x = cx + (R() - 0.5) * sc * 5, y = cy + (R() - 0.7) * sc * 0.9, r = sc * (0.4 + R() * 0.7); const rg = g.createRadialGradient(x, y - r * 0.2, r * 0.1, x, y, r); rg.addColorStop(0, 'rgba(255,255,255,.95)'); rg.addColorStop(0.6, 'rgba(250,250,255,.55)'); rg.addColorStop(1, 'rgba(240,244,255,0)'); g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
      for (let i = 0; i < 10; i++) { const x = cx + (R() - 0.5) * sc * 4.5, y = cy + sc * 0.35, r = sc * (0.4 + R() * 0.4); const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, 'rgba(170,185,210,.35)'); rg.addColorStop(1, 'rgba(170,185,210,0)'); g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } }
    if (o.sun !== false) { const sx = w * (o.sunX ?? 0.3), sy = h * (o.sunY ?? 0.22), rg = g.createRadialGradient(sx, sy, 0, sx, sy, 160); rg.addColorStop(0, 'rgba(255,252,235,1)'); rg.addColorStop(0.15, 'rgba(255,248,220,.9)'); rg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = rg; g.beginPath(); g.arc(sx, sy, 160, 0, 7); g.fill(); }
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(o.r || 260, 48, 24), new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false, toneMapped: false, depthWrite: false })); m.renderOrder = -10; return m;
}
const grassTex = (T) => T.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#6a9a40'; g.fillRect(0, 0, w, h); const R = rng(2); for (let i = 0; i < 9000; i++) { const v = R(); g.fillStyle = v < 0.4 ? 'rgba(60,100,30,.5)' : v < 0.75 ? 'rgba(140,180,80,.4)' : v < 0.98 ? 'rgba(90,130,50,.5)' : 'rgba(255,240,140,.8)'; g.fillRect(R() * w, R() * h, 2 + R() * 3, 2 + R() * 6); } }, [60, 60]);
const roadTex = (T) => T.canvasTex(256, 1024, (g, w, h) => { g.fillStyle = '#56565c'; g.fillRect(0, 0, w, h); const R = rng(6); for (let i = 0; i < 14000; i++) { const v = R(); g.fillStyle = v < 0.5 ? 'rgba(30,30,34,.35)' : 'rgba(150,150,150,.25)'; g.fillRect(R() * w, R() * h, 1 + R() * 2, 1 + R() * 2); }
  for (let i = 0; i < 6; i++) { g.strokeStyle = 'rgba(20,20,22,.35)'; g.lineWidth = 2; g.beginPath(); let x = R() * w, y = R() * h; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (R() - 0.5) * 30; y += R() * 40; g.lineTo(x, y); } g.stroke(); }
  g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(w * 0.25, 0, w * 0.1, h); g.fillRect(w * 0.65, 0, w * 0.1, h);
  g.fillStyle = '#ece6d0'; g.fillRect(6, 0, 8, h); g.fillRect(w - 14, 0, 8, h); g.fillStyle = '#e8c040'; g.fillRect(w / 2 - 5, 0, 10, h * 0.55); }, [1, 40]);

// the country road. returns { stage, rock, R }
export function roadWorld(T, o = {}) {
  const { THREE } = T, R = rng(o.seed || 5);
  const st = lifeStage(T, { sky: ['#2a6ad0', '#6aa6e8', '#d8e8f2'], fog: o.fog || [40, 230], fogColor: '#c8dcec', key: o.key ?? 3.2, keyPos: o.keyPos || [-14, 22, 10], keyColor: '#fff0dc', ambient: o.ambient ?? 1.25, ambientSky: '#bcd4f0', dof: o.dof ?? false, focus: o.focus, aperture: o.aperture, maxblur: o.maxblur, bloom: 0.08, beauty: 0.5, rimIntensity: 0.6, rim: '#fff0d8' });
  st.sun.shadow.camera.left = -30; st.sun.shadow.camera.right = 30; st.sun.shadow.camera.top = 30; st.sun.shadow.camera.bottom = -30; st.sun.shadow.camera.far = 120; st.sun.shadow.mapSize.set(2048, 2048); st.sun.shadow.camera.updateProjectionMatrix();
  st.followSun = (x, z) => { st.sun.position.set(x - 14, 22, z + 10); st.sun.target.position.set(x, 0, z); };
  const add = (m) => { st.add(m); return m; };
  add(skyDome(T, { seed: o.seed || 7 }));
  for (const [x0, x1] of [[-300, 5.2], [9.2, 300]]) { const gp = add(new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, 600), new THREE.MeshStandardMaterial({ map: grassTex(T), roughness: 1 }))); gp.rotation.x = -Math.PI / 2; gp.position.x = (x0 + x1) / 2; gp.receiveShadow = true; }
  const road = add(new THREE.Mesh(new THREE.PlaneGeometry(7, 600), new THREE.MeshStandardMaterial({ map: roadTex(T), roughness: 0.92 }))); road.rotation.x = -Math.PI / 2; road.position.y = 0.012; road.receiveShadow = true; road.material.map.repeat.set(1, 80);
  for (const s of [-1, 1]) { const sh = add(new THREE.Mesh(new THREE.PlaneGeometry(1.4, 600), T.mat('#9a8e74', { roughness: 1 }))); sh.rotation.x = -Math.PI / 2; sh.position.set(s * 4.2, 0.008, 0); sh.receiveShadow = true; }
  // ditch on the right
  const dg = new THREE.PlaneGeometry(4, 600, 16, 1); { const P = dg.attributes.position; for (let i = 0; i < P.count; i++) { const x = P.getX(i); P.setZ(i, -1.1 * Math.cos(clamp((x + 2) / 4) * Math.PI - Math.PI / 2) ** 2 * 1); } dg.computeVertexNormals(); }
  const ditch = add(new THREE.Mesh(dg, new THREE.MeshStandardMaterial({ map: grassTex(T), color: '#c8d8b0', roughness: 1 }))); ditch.rotation.x = -Math.PI / 2; ditch.position.set(7.2, 0.02, 0); ditch.receiveShadow = true;
  const range = o.range || [-220, 120], items = [], trunks = [];
  for (let z = range[0]; z < range[1]; z += 2.2) { for (const side of [-1, 1]) { if (R() < 0.55) items.push(...bushItems(R, side * (5.6 + R() * 3 + (side > 0 ? 4 : 0)), z + R() * 2, 0.8 + R() * 0.7)); } }
  for (let i = 0; i < 110; i++) { const side = R() < 0.5 ? -1 : 1, x = side * (13 + R() * 50), z = range[0] + R() * (range[1] - range[0]), s = 0.9 + R() * 0.9, tr = treeItems(R, x, z, s); items.push(...tr.items); trunks.push([x, z, s, tr.h]); }
  add(foliage(T, items, 11)); const tm = T.mat('#5a4230', { roughness: 0.95 });
  for (const [x, z, s, h] of trunks) { const t = add(T.cyl(0.14 * s, 0.26 * s, h, tm, x, h / 2, z, 7)); t.castShadow = true; }
  // distant hills
  for (let i = 0; i < 9; i++) { const h = add(new THREE.Mesh(new THREE.SphereGeometry(40 + R() * 40, 24, 12), T.mat(['#5a8a4a', '#4a7a46', '#6a9a56'][i % 3], { roughness: 1 }))); h.scale.y = 0.25; h.position.set((R() - 0.5) * 300, -4, range[0] - 60 - R() * 80); }
  // telephone poles + wires on the left
  const pm = T.mat('#6a5238', { roughness: 0.9 }), poleZ = []; for (let z = range[0]; z < range[1]; z += 22) { add(T.cyl(0.12, 0.15, 7.5, pm, -6.4, 3.75, z, 8)); add(T.box(1.8, 0.12, 0.12, pm, -6.4, 7.0, z)); poleZ.push(z); }
  const wm = new THREE.LineBasicMaterial({ color: '#2a2a2a' }); for (const dx of [-0.75, 0.75]) { const pts = []; for (let i = 0; i < poleZ.length - 1; i++) for (let k = 0; k <= 8; k++) { const u = k / 8; pts.push(new THREE.Vector3(-6.4 + dx, 7.05 - Math.sin(u * Math.PI) * 0.5, lerp(poleZ[i], poleZ[i + 1], u))); } add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wm)); }
  // wooden fence on the left
  for (let z = range[0]; z < range[1]; z += 3) add(T.cyl(0.06, 0.07, 1.1, pm, -5.0, 0.55, z, 6)); for (const y of [0.55, 0.95]) add(T.box(0.05, 0.1, range[1] - range[0], pm, -5.0, y, (range[0] + range[1]) / 2));
  // roadside stones
  for (let i = 0; i < 40; i++) { const r = add(rock(T, 20 + i, { detail: 2 })); const s = 0.15 + R() * 0.35; r.scale.setScalar(s); r.position.set((R() < 0.5 ? -1 : 1) * (4.4 + R() * 2), s * 0.2, range[0] + R() * (range[1] - range[0])); r.rotation.y = R() * 6; }
  const hero = add(rock(T, o.rockSeed || 4, { color: '#8e867a' })); hero.scale.set(1.2, 0.95, 1.0); hero.position.set(0.6, 0.45, -30);
  return { stage: st, rock: hero, R };
}

// ---- 1950s sedan (length ~4.9 m, forward = +x). cabin is open glass so riders show. .spin(dist), .riders group, .glass
export function car(T, o = {}) {
  const { THREE } = T, g = new THREE.Group(), env = envMap(T);
  const paint = new THREE.MeshPhysicalMaterial({ color: o.color || '#2f7f9a', roughness: 0.42, metalness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.2, envMap: env, envMapIntensity: 0.3 });
  const roofPaint = new THREE.MeshPhysicalMaterial({ color: o.roof || '#f2eee2', roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1, envMap: env, envMapIntensity: 0.3 });
  const chrome = new THREE.MeshStandardMaterial({ color: '#f4f4f8', metalness: 1, roughness: 0.12, envMap: env, envMapIntensity: 1.6 });
  const dark = new THREE.MeshStandardMaterial({ color: '#141416', roughness: 0.8 });
  const glass = new THREE.MeshPhysicalMaterial({ color: '#7a9ab0', roughness: 0.05, metalness: 0, transparent: true, opacity: o.glassOpacity ?? 0.12, envMap: env, envMapIntensity: 0.08, depthWrite: false, side: THREE.DoubleSide });
  const bevel = { depth: 1.66, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.12, bevelSegments: 5, curveSegments: 28 };
  const S = new THREE.Shape(); S.moveTo(-2.3, 0.3); S.lineTo(-1.95, 0.3); S.absarc(-1.45, 0.38, 0.5, Math.PI, 0, true); S.lineTo(0.95, 0.3); S.absarc(1.45, 0.38, 0.5, Math.PI, 0, true); S.lineTo(2.3, 0.3);
  S.quadraticCurveTo(2.48, 0.34, 2.46, 0.62); S.quadraticCurveTo(2.42, 0.9, 2.1, 0.94); S.quadraticCurveTo(1.2, 1.02, 0.7, 1.02); S.lineTo(-1.25, 1.02); S.quadraticCurveTo(-2.0, 1.02, -2.32, 0.94); S.quadraticCurveTo(-2.5, 0.84, -2.44, 0.55); S.quadraticCurveTo(-2.42, 0.32, -2.3, 0.3);
  const bg = new THREE.ExtrudeGeometry(S, bevel); bg.translate(0, 0, -0.83); const body = new THREE.Mesh(bg, paint); g.add(body);
  // wheel wells (dark) so arches read
  for (const x of [-1.45, 1.45]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.9, 24, 1, false, 0, Math.PI), dark); w.rotation.x = Math.PI / 2; w.rotation.y = Math.PI / 2; w.position.set(x, 0.38, 0); w.rotation.set(Math.PI / 2, 0, -Math.PI / 2); g.add(w); }
  // cabin: roof + pillars + glass
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.07, 1.62, 1, 1, 1), roofPaint); roof.position.set(-0.35, 1.56, 0); g.add(roof); const cabin = [roof];
  const rb = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 1.55, 4, 8), roofPaint); rb.rotation.x = Math.PI / 2; for (const x of [0.3, -1.0]) { const c = rb.clone(); c.position.set(x, 1.55, 0); g.add(c); cabin.push(c); }
  const pillar = (a, b, z) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), L = A.distanceTo(B), m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, L, 8), roofPaint); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); m.position.z = z; g.add(m); cabin.push(m); };
  for (const z of [-0.8, 0.8]) { pillar([0.85, 1.05, 0], [0.3, 1.55, 0], z); pillar([-0.35, 1.05, 0], [-0.35, 1.55, 0], z); pillar([-1.35, 1.05, 0], [-1.0, 1.55, 0], z); }
  const pane = (pts, z) => { const sh = new THREE.Shape(); sh.moveTo(...pts[0]); pts.slice(1).forEach((p) => sh.lineTo(...p)); const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), glass); m.position.z = z; m.renderOrder = 5; g.add(m); return m; };
  const panes = []; for (const z of [-0.81, 0.81]) { panes.push(pane([[0.82, 1.06], [0.3, 1.53], [-0.33, 1.53], [-0.33, 1.06]], z), pane([[-0.37, 1.06], [-0.37, 1.53], [-1.0, 1.53], [-1.32, 1.06]], z)); }
  const ws = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 1.56), glass); ws.position.set(0.57, 1.3, 0); ws.rotation.set(0, Math.PI / 2, 0); ws.rotateX(-0.78); ws.renderOrder = 5; g.add(ws); panes.push(ws);
  const rw = ws.clone(); rw.position.set(-1.17, 1.3, 0); rw.rotation.set(0, -Math.PI / 2, 0); rw.rotateX(-0.6); g.add(rw); panes.push(rw);
  // interior floor + bench seats + dash (seen through glass)
  const seatM = new THREE.MeshStandardMaterial({ color: o.seat || '#a83a2e', roughness: 0.6 });
  for (const x of [-0.25, -1.1]) { const sb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 1.5), seatM); sb.position.set(x, 1.15, 0); g.add(sb); }
  const dashT = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 1.55), paint); dashT.position.set(0.74, 0.97, 0); g.add(dashT);
  const swheel = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.022, 8, 28), new THREE.MeshStandardMaterial({ color: '#f2ece0', roughness: 0.4 })); swheel.position.set(0.55, 1.08, -0.4); swheel.rotation.y = Math.PI / 2; swheel.rotateX(0.95); g.add(swheel);
  // chrome: bumpers, grille, side spear, headlights, tail lights, hood ornament, hubcaps
  for (const x of [2.55, -2.56]) { const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 1.65, 6, 16), chrome); b.rotation.x = Math.PI / 2; b.position.set(x, 0.42, 0); g.add(b); for (const z of [-0.45, 0.45]) { const gd = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), chrome); gd.position.set(x + Math.sign(x) * 0.08, 0.5, z); g.add(gd); } }
  const gr = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 1.1), dark); gr.position.set(2.5, 0.64, 0); g.add(gr); for (let i = 0; i < 4; i++) { const bar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.025, 1.12), chrome); bar.position.set(2.53, 0.55 + i * 0.06, 0); g.add(bar); }
  for (const z of [-0.69, 0.69]) { const hl = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 12, 0, Math.PI), new THREE.MeshStandardMaterial({ color: '#fffaf0', emissive: new THREE.Color('#fff4d0'), emissiveIntensity: 0.6, roughness: 0.05 })); hl.rotation.y = Math.PI / 2; hl.position.set(2.42, 0.76, z); hl.scale.z = 0.5; g.add(hl); const ring = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.022, 8, 24), chrome); ring.rotation.y = Math.PI / 2; ring.position.set(2.43, 0.76, z); g.add(ring);
    const tl = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.14, 4, 8), new THREE.MeshStandardMaterial({ color: '#c81a1a', emissive: new THREE.Color('#ff2010'), emissiveIntensity: 0.4 })); tl.position.set(-2.5, 0.72, z); g.add(tl);
    const spear = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 3.6, 4, 8), chrome); spear.rotation.z = Math.PI / 2; spear.position.set(0.1, 0.72, z * 1.36); g.add(spear);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.03), chrome); handle.position.set(-0.25, 0.92, z * 1.37); g.add(handle);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.62, 0.01), dark); seam.position.set(0.85, 0.66, z * 1.37); g.add(seam); const seam2 = seam.clone(); seam2.position.x = -0.35; g.add(seam2); }
  const orn = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 8), chrome); orn.rotation.z = -Math.PI / 2 - 0.3; orn.position.set(2.05, 1.03, 0); g.add(orn);
  // wheels: black tyre + whitewall + chrome hubcap
  const tyreM = new THREE.MeshStandardMaterial({ color: '#18181a', roughness: 0.85 }), wwM = new THREE.MeshStandardMaterial({ color: '#f2f0ea', roughness: 0.6 }); const wheels = [];
  for (const x of [-1.45, 1.45]) for (const z of [-0.82, 0.82]) { const w = new THREE.Group(), tyre = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.1, 14, 36), tyreM); w.add(tyre); const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32), tyreM); fill.rotation.x = Math.PI / 2; w.add(fill);
    const side = Math.sign(z), ww = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.31, 36), wwM); ww.position.z = side * 0.105; if (side < 0) ww.rotation.y = Math.PI; w.add(ww);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), chrome); cap.rotation.x = side * Math.PI / 2; cap.scale.y = 0.35; cap.position.z = side * 0.1; w.add(cap); const knob = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.02), dark); knob.position.z = side * 0.17; w.add(knob);
    w.position.set(x, 0.39, z); g.add(w); wheels.push(w); }
  const under = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.12, 1.6), dark); under.position.y = 0.33; g.add(under);
  shadowAll(g); panes.forEach((p) => { p.castShadow = false; });
  const riders = new THREE.Group(); g.add(riders);
  g.userData = { wheels, paint, glass, panes, body, cabin: cabin.concat(panes) }; g.riders = riders; g.spin = (d) => wheels.forEach((w) => (w.rotation.z = -d / 0.39)); g.scale.setScalar(o.s || 1); return g;
}

// ---- crash-test dummy (3D, yellow/black targets). parts: head, torso, armL, armR. pose via .lean(k)
export function dummy(T) {
  const { THREE } = T, g = new THREE.Group(), y = new THREE.MeshStandardMaterial({ color: '#f2c41a', roughness: 0.45 }), k = new THREE.MeshStandardMaterial({ color: '#1a1a1e', roughness: 0.5 });
  const tgt = T.canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#f2c41a'; c.fillRect(0, 0, w, h); c.fillStyle = '#111'; c.beginPath(); c.moveTo(w / 2, h / 2); c.arc(w / 2, h / 2, 54, 0, Math.PI / 2); c.lineTo(w / 2, h / 2); c.arc(w / 2, h / 2, 54, Math.PI, Math.PI * 1.5); c.fill(); c.strokeStyle = '#111'; c.lineWidth = 6; c.beginPath(); c.arc(w / 2, h / 2, 54, 0, 7); c.stroke(); });
  const hip = new THREE.Group(); g.add(hip); const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.3, 6, 16), y); torso.position.y = 0.3; hip.add(torso);
  const neck = new THREE.Group(); neck.position.y = 0.58; hip.add(neck); const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 28, 18), new THREE.MeshStandardMaterial({ color: '#f2c41a', roughness: 0.4, map: tgt })); head.position.y = 0.14; head.rotation.y = Math.PI / 2; head.scale.set(0.92, 1.08, 0.95); neck.add(head);
  { const nk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 10), k); nk.position.y = 0.02; neck.add(nk); }
  const arms = []; for (const z of [-0.22, 0.22]) { const a = new THREE.Group(); a.position.set(0, 0.5, z); hip.add(a); const up = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.22, 4, 10), y); up.position.y = -0.14; a.add(up); const lo = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.22, 4, 10), y); lo.position.set(0.14, -0.28, 0); lo.rotation.z = Math.PI / 2.4; a.add(lo); arms.push(a); }
  const legs = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.38, 4, 10), y); legs.rotation.z = Math.PI / 2; legs.position.set(0.28, 0.02, 0); g.add(legs); const legs2 = legs.clone(); legs2.position.z = 0.15; legs.position.z = -0.15; g.add(legs2);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.07, 20), new THREE.MeshStandardMaterial({ map: tgt })); disc.position.set(0, 0.32, 0.175); hip.add(disc); const disc2 = disc.clone(); disc2.position.z = -0.175; disc2.rotation.y = Math.PI; hip.add(disc2);
  shadowAll(g); g.lean = (kk, whip = 0) => { hip.rotation.z = -0.55 * kk; neck.rotation.z = -0.5 * whip; arms.forEach((a) => (a.rotation.z = -1.2 * kk)); }; g.userData = { head, hip, neck }; return g;
}

// ---- steering wheel + inflator cutaway. .fire(t) with phases {ignite, gas, open, fill} (0..1 each)
export function wheelCutaway(T, o = {}) {
  const { THREE } = T, g = new THREE.Group(), env = envMap(T);
  const leather = new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 0.55, envMap: env, envMapIntensity: 0.5 });
  const plastic = new THREE.MeshStandardMaterial({ color: '#3a3a40', roughness: 0.5, envMap: env, envMapIntensity: 0.4, side: THREE.DoubleSide });
  const steel = new THREE.MeshStandardMaterial({ color: '#c8ccd4', metalness: 1, roughness: 0.28, envMap: env, envMapIntensity: 1.3, side: THREE.DoubleSide });
  const cut = new THREE.MeshStandardMaterial({ color: '#e8402a', roughness: 0.6, side: THREE.DoubleSide });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.11, 20, 96), leather); g.add(rim);
  for (const a of [Math.PI * 0.5 + 0.0, Math.PI * 1.15, Math.PI * 1.85]) { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.16, 0.08), plastic); sp.position.set(Math.cos(a) * 0.78, Math.sin(a) * 0.78, -0.05); sp.rotation.z = a; g.add(sp); }
  // hub housing: open cylinder with the front-right quarter removed (cutaway)
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.52, 0.42, 48, 1, true, Math.PI * 0.75, Math.PI * 1.5), plastic); hub.rotation.x = Math.PI / 2; hub.position.z = 0.05; g.add(hub);
  const back = new THREE.Mesh(new THREE.CircleGeometry(0.52, 48), plastic); back.position.z = -0.16; g.add(back);
  // cover flaps (two halves tear along the middle seam, hinged top + bottom)
  const flaps = []; for (const s of [1, -1]) { const hinge = new THREE.Group(); hinge.position.set(0, s * 0.5, 0.27); g.add(hinge); const fl = new THREE.Mesh(new THREE.CircleGeometry(0.5, 40, s > 0 ? Math.PI : 0, Math.PI), new THREE.MeshStandardMaterial({ color: '#34343a', roughness: 0.45, envMap: env, envMapIntensity: 0.6, side: THREE.DoubleSide, transparent: true, opacity: 0.18, depthWrite: false })); fl.position.y = -s * 0.5; hinge.add(fl); flaps.push(hinge); }
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.12, 32), steel); logo.position.set(0, 0.22, 0.275); flaps[0].add(logo); logo.position.set(0, -0.28, 0.005);
  // inflator canister (cut open) with pellets + igniter
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.22, 40, 1, true, Math.PI * 0.75, Math.PI * 1.5), steel); can.rotation.x = Math.PI / 2; can.position.z = -0.03; g.add(can);
  const holes = []; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const h = new THREE.Mesh(new THREE.CircleGeometry(0.025, 10), new THREE.MeshBasicMaterial({ color: '#0a0a0a', side: THREE.DoubleSide })); h.position.set(Math.cos(a) * 0.262, Math.sin(a) * 0.262, 0.03); h.lookAt(Math.cos(a) * 2, Math.sin(a) * 2, 0.03); g.add(h); holes.push(h); }
  const pelletM = new THREE.MeshStandardMaterial({ color: '#d8cc9a', roughness: 0.7, emissive: new THREE.Color('#ff7a1a'), emissiveIntensity: 0 }); const pellets = [];
  const R = rng(5); for (let i = 0; i < 46; i++) { const a = R() * Math.PI * 2, r = 0.05 + R() * 0.17, p = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.022, 14), pelletM); p.position.set(Math.cos(a) * r, Math.sin(a) * r, -0.1 + R() * 0.14); p.rotation.set(R() * 3, R() * 3, R() * 3); g.add(p); pellets.push(p); }
  const ign = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.16, 16), new THREE.MeshStandardMaterial({ color: '#b87a3a', metalness: 0.8, roughness: 0.3, envMap: env })); ign.rotation.x = Math.PI / 2; ign.position.z = -0.02; g.add(ign);
  const fire = new THREE.PointLight(new THREE.Color('#ff8a2a'), 0, 3, 2); fire.position.set(0, 0, 0.1); g.add(fire);
  // folded bag (pleated disc) under the cover
  const fold = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.07, 48, 1), new THREE.MeshStandardMaterial({ color: '#efe9da', roughness: 0.8, transparent: true, opacity: 0.22, depthWrite: false })); fold.rotation.x = Math.PI / 2; fold.position.z = 0.15; g.add(fold);
  // the bag
  const geo = new THREE.SphereGeometry(1, 72, 48), base = Float32Array.from(geo.attributes.position.array), N = noiseFn(12, 9);
  const bag = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: '#f4f1e8', roughness: 0.75, sheen: 0.8, sheenRoughness: 0.5, sheenColor: new THREE.Color('#ffffff') })); g.add(bag); bag.castShadow = true;
  const inflate = (k) => { const e = clamp(k), p = geo.attributes.position.array; for (let i = 0; i < p.length; i += 3) { const x = base[i], y = base[i + 1], z = base[i + 2]; const wr = (1 - e) * 0.35 + 0.05; const w = 1 + wr * 0.5 * N(x * 2.5, y * 2.5, z * 2.5) + 0.015 * Math.sin(x * 22 + y * 9); p[i] = x * w; p[i + 1] = y * w * 0.92; p[i + 2] = z * w * 0.62; } geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
    const s = lerp(0.3, 1.0, ease.out(e)); bag.scale.set(s * 1.0, s * 1.0, Math.max(0.05, ease.out(e))); bag.position.z = 0.25 + 0.55 * ease.out(e); bag.visible = e > 0.01; fold.visible = e < 0.05; };
  // nitrogen gas: soft sprites that stream from the holes, then fill the bag; and a talc powder puff
  const puffTex = T.canvasTex(128, 128, (c, w, h) => { const rg = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.4, 'rgba(255,255,255,.5)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = rg; c.fillRect(0, 0, w, h); });
  const gas = []; for (let i = 0; i < 90; i++) { const sm = new THREE.SpriteMaterial({ map: puffTex, color: new THREE.Color(i % 3 ? '#cfe6ff' : '#ffffff'), transparent: true, opacity: 0, depthWrite: false }); const s = new THREE.Sprite(sm); g.add(s); gas.push({ s, a: R() * Math.PI * 2, sp: 0.6 + R() * 0.8, ph: R(), z: R() }); }
  const powder = []; for (let i = 0; i < 40; i++) { const sm = new THREE.SpriteMaterial({ map: puffTex, color: new THREE.Color('#f4f2ee'), transparent: true, opacity: 0, depthWrite: false }); const s = new THREE.Sprite(sm); g.add(s); powder.push({ s, a: R() * Math.PI * 2, r: 0.9 + R() * 0.8, y: (R() - 0.5) * 1.6, z: 0.4 + R() * 1.0 }); }
  g.fire = (t, P) => { // P: {ign, gas, open, fill, powder} as 0..1 phase values
    const gl = clamp(P.ign * 3) * (1 - clamp(P.fill)); pelletM.emissiveIntensity = 0.8 * gl * (0.8 + 0.2 * Math.sin(t * 60)); fire.intensity = 4 * gl;
    gas.forEach((q, i) => { const u = (P.gas * 1.6 + q.ph) % 1, on = P.gas > 0 && P.fill < 1; const inBag = P.fill > 0; let r, z; if (!inBag) { r = 0.26 + u * 0.35; z = 0.0 + u * 0.15; } else { r = 0.2 + q.z * 0.9 * ease.out(P.fill); z = 0.35 + q.ph * 0.9 * ease.out(P.fill); }
      q.s.position.set(Math.cos(q.a + t * q.sp) * r, Math.sin(q.a + t * q.sp) * r, z); q.s.scale.setScalar(0.1 + u * 0.22 + 0.25 * P.fill); q.s.material.opacity = on ? (inBag ? 0.15 * (1 - P.fill) : 0.32 * Math.sin(u * Math.PI)) : 0; });
    flaps.forEach((h, i) => { h.children[0].material.opacity = lerp(0.18, 1, clamp(P.open * 4)); h.children[0].material.depthWrite = P.open > 0.2; h.rotation.x = (i ? 1 : -1) * 1.75 * ease.out(clamp(P.open)); }); inflate(P.fill);
    powder.forEach((q) => { const u = clamp(P.powder); q.s.position.set(Math.cos(q.a) * q.r * (0.6 + u), q.y * (0.6 + u) + u * 0.3, q.z + u * 0.4); q.s.scale.setScalar(0.4 + u * 1.2); q.s.material.opacity = 0.35 * Math.sin(Math.PI * u); }); };
  g.userData = { pellets, ign, bag, flaps, can }; g.fire(0, { ign: 0, gas: 0, open: 0, fill: 0, powder: 0 }); return g;
}
