// sets/hand3d.js: articulated 3D hands (real ink, glowing phantom, rubber), forearm, and the experiment sets.
import { lerp, ease, clamp, mood, rng } from '/engine/core.js';

const FINGERS = [ // [x offset along palm width, length, base angle spread]
  [-0.26, 0.55, -0.10], [-0.09, 0.66, -0.03], [0.08, 0.62, 0.03], [0.24, 0.52, 0.09],
];
// make a hand pointing +y from the wrist at the origin. kind: 'real' | 'phantom' | 'rubber'
export function hand(T, kind = 'real', o = {}) {
  const { THREE } = T, g = new THREE.Group(), s = o.s || 1;
  let mat, outline = null;
  if (kind === 'phantom') mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(o.color || '#7fe8ff'), transparent: true, opacity: 0.26, depthWrite: false });
  else if (kind === 'rubber') mat = T.mat('#d8a888', { roughness: 0.55 });
  else { mat = T.mat('#0a0c10', { roughness: 0.7 }); outline = new THREE.MeshBasicMaterial({ color: new THREE.Color(o.rim || '#ffc98a'), side: THREE.BackSide }); }
  const wire = kind === 'phantom' ? new THREE.MeshBasicMaterial({ color: new THREE.Color(o.color || '#bff6ff'), wireframe: true, transparent: true, opacity: 0.35 }) : null;
  const add = (geo, parent, pos, scl = [1, 1, 1]) => { const m = new THREE.Mesh(geo, mat); m.position.set(...pos); m.scale.set(...scl); m.castShadow = kind !== 'phantom'; parent.add(m);
    if (outline) { const ol = new THREE.Mesh(geo, outline); ol.position.copy(m.position); ol.scale.set(scl[0] * 1.08, scl[1] * 1.04, scl[2] * 1.08); parent.add(ol); }
    if (wire) { const w = new THREE.Mesh(geo, wire); w.position.copy(m.position); w.scale.set(...scl); parent.add(w); } return m; };
  const sph = new THREE.SphereGeometry(1, 20, 14), cyl = new THREE.CylinderGeometry(1, 1, 1, 16);
  add(sph, g, [0, 0.38, 0], [0.31, 0.37, 0.085]);                      // palm (flat)
  const fingers = [];
  FINGERS.forEach(([x, len, spread]) => {
    let parent = new THREE.Group(); parent.position.set(x, 0.72, 0); parent.rotation.z = -spread; g.add(parent); const segs = [];
    [0.45, 0.32, 0.23].forEach((f, i) => { const seg = new THREE.Group(); seg.position.y = i === 0 ? 0 : len * [0.45, 0.32, 0.23][i - 1]; parent.add(seg); add(cyl, seg, [0, len * f / 2, 0], [0.065, len * f, 0.065]); add(sph, seg, [0, len * f, 0], [0.068, 0.068, 0.068]); segs.push(seg); parent = seg; });
    fingers.push(segs);
  });
  // thumb
  let tp = new THREE.Group(); tp.position.set(-0.32, 0.28, 0.02); tp.rotation.z = 0.9; g.add(tp); const thumb = [];
  [0.26, 0.22].forEach((l, i) => { const seg = new THREE.Group(); seg.position.y = i === 0 ? 0 : 0.26; tp.add(seg); add(cyl, seg, [0, l / 2, 0], [0.075, l, 0.075]); add(sph, seg, [0, l, 0], [0.078, 0.078, 0.078]); thumb.push(seg); tp = seg; });
  g.scale.setScalar(s);
  g.userData = { fingers, thumb };
  g.clench = (k) => { const c = ease.inOut(clamp(k)); fingers.forEach((segs) => segs.forEach((seg, i) => (seg.rotation.x = c * [1.2, 1.4, 1.1][i]))); thumb.forEach((seg) => (seg.rotation.x = c * 0.9)); };
  return g;
}
// forearm (ink with rim outline); `stump` ends it before the wrist
export function forearm(T, o = {}) {
  const { THREE } = T, g = new THREE.Group(), len = o.len || 2.2;
  const geo = new THREE.CylinderGeometry(0.2, 0.24, len, 20);
  const m = new THREE.Mesh(geo, T.mat(o.sleeve || '#e0a040', { roughness: 0.8 })); geo.scale(0.75, 1, 0.75); m.position.y = -len / 2; m.castShadow = true; g.add(m);
  const ol = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color(o.rim || '#ffc98a'), side: THREE.BackSide })); ol.position.copy(m.position); ol.scale.set(1.08, 1.0, 1.08); g.add(ol);
  if (o.stump) { const cap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), T.mat('#0a0c10')); g.add(cap); }
  return g;
}
// a dim stage: dark room, warm lamp from above, teal fill
export function darkStage(T, o = {}) {
  const st = T.stage({ mood: 'night', fov: o.fov || 38, sky: ['#04070a', '#0a1218'], fogColor: '#04070a', fog: [8, 30], keyPos: [2, 7, 4], keyIntensity: o.key ?? 3.0, keyColor: '#ffe0b0', ambient: o.ambient ?? 1.2, ambientSky: '#4a6a78', bloom: 0.45, bloomThreshold: 0.88 });
  const table = T.box(8, 0.2, 4, T.mat('#2a1e18', { roughness: 0.6 }), 0, -0.1, 0); table.receiveShadow = true; st.add(table);
  const lamp = new T.THREE.PointLight(0xffd8a0, 10, 8, 2); lamp.position.set(0.2, 2.6, 0.6); st.add(lamp);
  // cinematic: visible lamp beam + warm pool on the table + a cool back rim light
  const beam = new T.THREE.Mesh(new T.THREE.ConeGeometry(1.6, 3.2, 40, 1, true), new T.THREE.MeshBasicMaterial({ color: 0xffd8a0, transparent: true, opacity: 0.06, side: T.THREE.DoubleSide, depthWrite: false })); beam.position.set(0.2, 1.4, 0.4); st.add(beam);
  const pool = new T.THREE.Mesh(new T.THREE.CircleGeometry(1.5, 48), new T.THREE.MeshBasicMaterial({ color: 0xffc070, transparent: true, opacity: 0.16, depthWrite: false })); pool.rotation.x = -Math.PI / 2; pool.position.set(0.2, 0.005, 0.4); st.add(pool);
  const back = new T.THREE.DirectionalLight(0x7fe8ff, 1.4); back.position.set(-2, 3, -4); st.add(back);
  return st;
}
// small glowing particles drifting off (dissolve / tingle)
export function motes(T, st, n = 60, color = '#7fe8ff') {
  const { THREE } = T, geo = new THREE.BufferGeometry(), arr = new Float32Array(n * 3), seeds = [], R = rng(17);
  for (let i = 0; i < n; i++) seeds.push([R() * 1.2 - 0.6, R() * 1.4, R() * 0.6 - 0.3, R()]);
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: new THREE.Color(color), size: 0.05, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })); st.add(pts);
  pts.tick = (t, spread = 1, origin = [0, 0, 0]) => { for (let i = 0; i < n; i++) { const [x, y, z, r] = seeds[i], u = (t * 0.25 + r) % 1; arr[i * 3] = origin[0] + x * (0.5 + spread * u); arr[i * 3 + 1] = origin[1] + y + spread * u * 0.8; arr[i * 3 + 2] = origin[2] + z; } geo.attributes.position.needsUpdate = true; pts.material.opacity = 0.9 * clamp(spread); };
  return pts;
}
// soft out-of-focus lights far behind the set (cinematic depth)
export function bokeh(T, st, n = 26) {
  const { THREE } = T, R = rng(23), tex = T.canvasTex(64, 64, (g, w, h) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.6, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const out = [];
  for (let i = 0; i < n; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: new THREE.Color(R() > 0.5 ? '#ffc070' : '#7fe8ff'), transparent: true, opacity: 0.12 + R() * 0.18, depthWrite: false, blending: THREE.AdditiveBlending }));
    const sc = 0.4 + R() * 1.1; m.scale.set(sc, sc, 1); m.position.set(-7 + R() * 14, 0.6 + R() * 5, -7 - R() * 5); m.userData.seed = R() * 6; st.add(m); out.push(m); }
  out.tick = (t) => out.forEach((m) => { m.material.opacity = (0.12 + 0.1 * Math.sin(t * 0.8 + m.userData.seed)); });
  return out;
}
