// sets/pushpak.js: the Pushpak Vimaan as a golden swan-peacock flying palace (our own design).
// Gold-scaled body, jewelled neck (rubies + emeralds), crowned head, huge feathered wings that beat slowly,
// a peacock tail fan, a Dravidian palace on its back (gopuram + domes, arched lit windows with passengers),
// and an ancient "helicopter" lotus-rotor spinning above the central tower.  Plus a sunset sky world.
//   import { pushpak, sunsetWorld } from '../sets/pushpak.js';
//   const P = pushpak(T, { s: 1 }); st.add(P); P.update(t);       // o.lite for small fleet copies
import { rng, lerp, clamp } from '/engine/core.js';

const texCache = {};
function scaleTex(T, key, base, edge) {
  return (texCache[key] ||= T.canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const r = 22;
    for (let row = -1; row < h / (r * 0.9) + 1; row++) for (let i = -1; i < w / (r * 1.6) + 1; i++) {
      const x = i * r * 1.6 + (row % 2) * r * 0.8, y = row * r * 0.9;
      const gr = g.createRadialGradient(x, y - r * 0.3, 2, x, y, r); gr.addColorStop(0, edge); gr.addColorStop(0.7, base); gr.addColorStop(1, 'rgba(150,90,20,.75)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI); g.fill();
      g.strokeStyle = 'rgba(120,70,10,.45)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r, 0.1, Math.PI - 0.1); g.stroke();
    }
  }, [3, 2]));
}
function windowsTex(T, lit = true) {
  return T.canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = '#e8d2a8'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c8a060'; g.fillRect(0, 0, w, 10); g.fillRect(0, h - 12, w, 12);
    const n = 8, R = rng(4);
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * (w / n), ww = w / n * 0.52, top = 26, bot = h - 20;
      g.fillStyle = '#7a5020'; g.beginPath(); g.moveTo(x - ww / 2 - 4, bot); g.lineTo(x - ww / 2 - 4, top + ww / 2); g.arc(x, top + ww / 2, ww / 2 + 4, Math.PI, 0); g.lineTo(x + ww / 2 + 4, bot); g.fill();
      const gr = g.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, lit ? '#fff2c0' : '#3a3040'); gr.addColorStop(1, lit ? '#ffa040' : '#1a1820');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x - ww / 2, bot); g.lineTo(x - ww / 2, top + ww / 2); g.arc(x, top + ww / 2, ww / 2, Math.PI, 0); g.lineTo(x + ww / 2, bot); g.fill();
      if (lit && R() < 0.75) { g.fillStyle = 'rgba(60,24,10,.85)'; const px = x + (R() - 0.5) * ww * 0.4, py = bot - 4; g.beginPath(); g.arc(px, py - 34, 7, 0, 7); g.fill(); g.beginPath(); g.moveTo(px - 10, py); g.quadraticCurveTo(px, py - 46, px + 10, py); g.fill(); }
    }
  });
}
function friezeTex(T) {
  return (texCache.frieze ||= T.canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#d8a850'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#a87428'; g.fillRect(0, 0, w, 8); g.fillRect(0, h - 10, w, 10);
    for (let i = 0; i < 4; i++) { const x = 14 + i * 62; g.fillStyle = '#7a4c18'; g.fillRect(x, 22, 40, 86); g.fillStyle = '#ffd890'; g.beginPath(); g.arc(x + 20, 40, 13, 0, 7); g.fill(); g.fillStyle = '#c89040'; g.fillRect(x + 12, 56, 16, 44); }
  }, [2, 1]));
}

export function pushpak(T, o = {}) {
  const { THREE } = T, root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const lite = !!o.lite, seg = lite ? 10 : 28;
  const gold = new THREE.MeshStandardMaterial({ color: '#ffe0a0', metalness: 0.8, roughness: 0.32, map: lite ? null : scaleTex(T, 'gold', '#f8cc68', '#fff8dc'), envMapIntensity: 1.25, emissive: new THREE.Color('#2a1800'), emissiveIntensity: 0.25 });
  const goldPlain = new THREE.MeshStandardMaterial({ color: '#ffd070', metalness: 0.9, roughness: 0.25, envMapIntensity: 1.3, emissive: new THREE.Color('#3a2000'), emissiveIntensity: 0.3 });
  const featherA = new THREE.MeshStandardMaterial({ color: '#ffd468', metalness: 0.75, roughness: 0.35, side: THREE.DoubleSide, emissive: new THREE.Color('#402400'), emissiveIntensity: 0.4 });
  const featherB = new THREE.MeshStandardMaterial({ color: '#e8a030', metalness: 0.8, roughness: 0.35, side: THREE.DoubleSide, emissive: new THREE.Color('#301800'), emissiveIntensity: 0.4 });
  const ruby = new THREE.MeshPhysicalMaterial({ color: '#e0102a', roughness: 0.08, metalness: 0.1, clearcoat: 1, emissive: new THREE.Color('#600010'), emissiveIntensity: 0.6 });
  const emerald = new THREE.MeshPhysicalMaterial({ color: '#10c070', roughness: 0.08, metalness: 0.1, clearcoat: 1, emissive: new THREE.Color('#004a24'), emissiveIntensity: 0.6 });
  const sapphire = new THREE.MeshPhysicalMaterial({ color: '#2050e0', roughness: 0.1, clearcoat: 1, emissive: new THREE.Color('#081860'), emissiveIntensity: 0.5 });
  const ivory = new THREE.MeshStandardMaterial({ color: '#f0dcb4', roughness: 0.6, metalness: 0.1 });
  const M = (geo, m, x = 0, y = 0, z = 0, p = body) => { const k = new THREE.Mesh(geo, m); k.position.set(x, y, z); p.add(k); return k; };
  // ---- swan body (forward = +x)
  const hull = M(new THREE.SphereGeometry(1, seg + 4, seg / 2 + 4), gold); hull.scale.set(4.6, 1.5, 2.3);
  const breast = M(new THREE.SphereGeometry(1, seg, seg / 2), gold, 2.6, 0.35, 0); breast.scale.set(2.2, 1.55, 1.9);
  // jewel belt along the flanks
  const gemG = new THREE.SphereGeometry(0.14, 10, 8), bigGem = new THREE.OctahedronGeometry(0.55, 0);
  if (!lite) for (const z of [-1, 1]) for (let i = 0; i < 9; i++) { const x = -3.4 + i * 0.85, ang = Math.acos(clamp(x / 4.7, -1, 1)); const r = Math.sin(ang); M(gemG, i % 2 ? emerald : ruby, x, -0.05, z * 2.3 * r * 1.0); }
  { const g = M(bigGem, emerald, 4.55, 0.5, 0); g.scale.set(0.5, 1, 0.8); }
  // ---- neck: a chain of shrinking gold rings with jewel collars, curving up and forward
  const neckPts = [[3.4, 0.9], [4.6, 2.0], [4.9, 3.6], [4.6, 5.0], [5.0, 6.1], [5.8, 6.6]];
  const curve = new THREE.CatmullRomCurve3(neckPts.map(([x, y]) => new THREE.Vector3(x, y, 0)));
  const NS = lite ? 9 : 22; const nGeo = new THREE.SphereGeometry(1, seg, seg / 2);
  for (let i = 0; i <= NS; i++) { const u = i / NS, p = curve.getPoint(u), r = lerp(1.05, 0.42, u); M(nGeo, gold, p.x, p.y, p.z).scale.set(r, r, r * 0.92);
    if (!lite && i % 5 === 3) { const tg = curve.getTangent(u); const ring = M(new THREE.TorusGeometry(r * 0.98, 0.09, 8, 24), goldPlain, p.x, p.y, 0); ring.lookAt(p.x + tg.x, p.y + tg.y, 0); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const q = new THREE.Vector3(0, Math.cos(a) * r, Math.sin(a) * r); M(gemG, k % 2 ? ruby : emerald, p.x + q.x, p.y + q.y, q.z).scale.setScalar(0.7); } } }
  // ---- head, beak, ruby eyes, peacock crest crown
  const hp = curve.getPoint(1); const head = new THREE.Group(); head.position.copy(hp); body.add(head);
  M(new THREE.SphereGeometry(0.62, seg, seg / 2), gold, 0, 0, 0, head).scale.set(1.25, 0.95, 0.9);
  const beak = M(new THREE.ConeGeometry(0.28, 1.3, 10), goldPlain, 1.15, -0.12, 0, head); beak.rotation.z = -Math.PI / 2 - 0.12;
  for (const z of [-1, 1]) M(new THREE.SphereGeometry(0.13, 12, 8), ruby, 0.35, 0.15, z * 0.5, head);
  for (let k = 0; k < 5; k++) { const a = -0.55 + k * 0.28; const c = M(new THREE.CylinderGeometry(0.03, 0.05, 1.1, 6), goldPlain, -0.1 + Math.sin(a) * 0.4, 0.55 + Math.cos(a) * 0.45, (k - 2) * 0.12, head); c.rotation.z = -a - 0.3; const tp = new THREE.Vector3(0, 0.55, 0).applyEuler(c.rotation).add(c.position); M(new THREE.SphereGeometry(0.11, 10, 8), k === 2 ? ruby : emerald, tp.x, tp.y, tp.z, head); }
  // ---- wings: three rows of long feathers fanned from the shoulder; pivot groups so they can beat
  const featherGeo = new THREE.SphereGeometry(1, lite ? 8 : 14, lite ? 4 : 6); featherGeo.scale(0.95, 0.06, 1); featherGeo.translate(0, 0, 1);
  const wings = [];
  for (const sd of [-1, 1]) {
    const piv = new THREE.Group(); piv.position.set(0.6, 1.0, sd * 1.7); body.add(piv); const inner = new THREE.Group(); piv.add(inner);
    const rows = lite ? [[7, 3.4, 0]] : [[14, 4.4, 0], [11, 3.0, 0.1], [8, 1.8, 0.2]];
    rows.forEach(([n, len, dy], ri) => { for (let i = 0; i < n; i++) { const u = i / (n - 1); const f = new THREE.Mesh(featherGeo, (i + ri) % 2 ? featherA : featherB); f.scale.set(1, 1, len * lerp(0.75, 1.15, Math.sin(u * Math.PI * 0.9))); f.position.set(lerp(0.6, -2.4, u), dy, 0); f.rotation.y = -sd * lerp(0.15, 1.05, u) + (sd < 0 ? Math.PI : 0); f.rotation.x = 0; inner.add(f);
      if (ri === 0 && !lite && i % 4 === 1) { const tip = new THREE.Vector3(0, 0, len * 1.95 * lerp(0.75, 1.15, Math.sin(u * Math.PI * 0.9))).applyEuler(f.rotation).add(f.position); const e = new THREE.Mesh(gemG, i % 4 ? emerald : sapphire); e.scale.set(1, 0.35, 1); e.position.copy(tip); e.position.y += 0.05; inner.add(e); } } });
    wings.push({ piv, inner, sd });
  }
  // ---- peacock tail fan with jewel eyes
  const tail = new THREE.Group(); tail.position.set(-4.0, 0.9, 0); body.add(tail);
  const NT = lite ? 7 : 15; const tGeo = new THREE.SphereGeometry(1, lite ? 8 : 12, 5); tGeo.scale(0.8, 0.05, 1); tGeo.translate(0, 0, 1);
  for (let i = 0; i < NT; i++) { const u = i / (NT - 1), a = lerp(-1.2, 1.2, u); const piv = new THREE.Group(); piv.rotation.set(0, -Math.PI / 2, 0); piv.rotateOnAxis(new THREE.Vector3(1, 0, 0), -0.55 - Math.cos(a) * 0.35); const f = new THREE.Mesh(tGeo, i % 2 ? featherA : featherB); f.scale.set(1, 1, 2.8 - Math.abs(a) * 0.5); f.rotation.y = a * 0.7; piv.add(f);
    if (!lite) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 8), emerald); eye.scale.set(1, 0.12, 1); eye.position.set(Math.sin(a * 0.7) * 4.6, 0.04, Math.cos(a * 0.7) * 4.6 * (1 - Math.abs(a) * 0.12)); piv.add(eye); const pup = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), sapphire); pup.scale.set(1, 0.2, 1); pup.position.copy(eye.position); pup.position.y += 0.03; piv.add(pup); }
    tail.add(piv); }
  // ---- the palace on its back
  const pal = new THREE.Group(); pal.position.set(-0.4, 1.35, 0); body.add(pal);
  M(new THREE.BoxGeometry(5.6, 0.3, 2.9), goldPlain, 0, 0, 0, pal);
  const wt = lite ? null : windowsTex(T);
  const hallM = lite ? ivory : new THREE.MeshStandardMaterial({ map: wt, emissiveMap: wt, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.55, roughness: 0.6 });
  const hall = M(new THREE.CylinderGeometry(1.6, 1.6, 1.35, lite ? 8 : 24, 1, true), hallM, 0, 0.82, 0, pal); hall.scale.set(1.55, 1, 0.82);
  M(new THREE.CylinderGeometry(1.75, 1.75, 0.16, lite ? 8 : 24), goldPlain, 0, 1.56, 0, pal).scale.set(1.55, 1, 0.82);
  if (!lite) for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; M(new THREE.CylinderGeometry(0.06, 0.06, 1.35, 6), goldPlain, Math.cos(a) * 2.55, 0.82, Math.sin(a) * 1.36, pal); }
  // central gopuram: carved tiers + barrel vault + kalasha
  const fz = lite ? goldPlain : new THREE.MeshStandardMaterial({ map: friezeTex(T), metalness: 0.55, roughness: 0.45, emissive: new THREE.Color('#2a1600'), emissiveIntensity: 0.4 });
  let y = 1.64; for (let i = 0; i < 4; i++) { const w = 1.7 - i * 0.32, d = 1.25 - i * 0.22, h = 0.55; M(new THREE.BoxGeometry(w, h, d), fz, 0, y + h / 2, 0, pal); M(new THREE.BoxGeometry(w + 0.16, 0.08, d + 0.16), goldPlain, 0, y + h, 0, pal); y += h + 0.04; }
  const vault = M(new THREE.CylinderGeometry(0.34, 0.34, 0.75, 16, 1, false, 0, Math.PI), goldPlain, 0, y, 0, pal); vault.rotation.set(0, 0, Math.PI / 2); vault.rotation.y = Math.PI / 2; vault.rotation.order = 'YZX';
  const kal = M(new THREE.SphereGeometry(0.16, 12, 8), goldPlain, 0, y + 0.42, 0, pal); M(new THREE.ConeGeometry(0.07, 0.3, 8), goldPlain, 0, y + 0.66, 0, pal);
  const topY = y + 0.8;
  // side domes + corner chhatris
  for (const x of [-1.9, 1.9]) { M(new THREE.SphereGeometry(0.62, lite ? 8 : 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), goldPlain, x, 1.64, 0, pal); M(new THREE.ConeGeometry(0.08, 0.5, 8), goldPlain, x, 2.5, 0, pal); M(new THREE.SphereGeometry(0.09, 8, 6), ruby, x, 2.28, 0, pal); }
  if (!lite) for (const [x, z] of [[-2.5, -1.25], [2.5, -1.25], [-2.5, 1.25], [2.5, 1.25]]) { for (const dx of [-0.16, 0.16]) for (const dz of [-0.16, 0.16]) M(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 5), goldPlain, x + dx, 0.45, z + dz, pal); M(new THREE.SphereGeometry(0.28, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), goldPlain, x, 0.75, z, pal); }
  // ---- the lotus rotor (the "ancient helicopter"): mast, lotus hub, 8 long petal blades + spin blur disc
  const rotor = new THREE.Group(); rotor.position.set(0, topY + 0.55, 0); pal.add(rotor);
  M(new THREE.CylinderGeometry(0.07, 0.09, 0.9, 8), goldPlain, 0, topY + 0.1, 0, pal);
  const hub = new THREE.Group(); rotor.add(hub);
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; const p = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), k % 2 ? featherA : goldPlain); p.scale.set(0.5, 1.1, 0.25); p.position.set(Math.cos(a) * 0.2, 0.12, Math.sin(a) * 0.2); p.rotation.set(0, -a, -0.5); p.rotation.order = 'YXZ'; hub.add(p); }
  hub.add(new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), ruby));
  const NB = lite ? 4 : 8; const bladeGeo = new THREE.SphereGeometry(1, 12, 4); bladeGeo.scale(3.4, 0.04, 0.42); bladeGeo.translate(3.4, 0, 0);
  for (let k = 0; k < NB; k++) { const b = new THREE.Mesh(bladeGeo, k % 2 ? featherA : goldPlain); b.rotation.y = k / NB * Math.PI * 2; b.rotation.z = 0.03; hub.add(b);  }
  const discTex = T.canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, 'rgba(255,220,140,.0)'); gr.addColorStop(0.3, 'rgba(255,220,140,.22)'); gr.addColorStop(0.9, 'rgba(255,210,120,.3)'); gr.addColorStop(1, 'rgba(255,210,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
  const disc = new THREE.Mesh(new THREE.CircleGeometry(6.9, 48), new THREE.MeshBasicMaterial({ map: discTex, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide })); disc.rotation.x = -Math.PI / 2; rotor.add(disc);
  // soft warm under-glow (subtle: no blown bloom)
  if (o.glow !== false) { const gt = T.canvasTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,200,120,.9)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, transparent: true, opacity: 0.28, depthWrite: false, blending: THREE.AdditiveBlending })); sp.scale.set(9, 4, 1); sp.position.set(0, -1.2, 0); body.add(sp); }
  body.traverse((m) => { if (m.isMesh) { m.castShadow = !lite; } });
  root.scale.setScalar(o.s || 1);
  root.userData = { wings, rotor: hub, disc, tail, head, body };
  // t: time, o: {flap 0..1, spin}
  root.update = (t, u = {}) => {
    const fl = u.flap ?? 1, ph = t * (u.flapSpeed ?? 1.4);
    wings.forEach(({ piv, inner, sd }) => { piv.rotation.x = -sd * ((u.base ?? 0.42) + 0.26 * fl * Math.sin(ph)); inner.rotation.x = -sd * 0.16 * fl * Math.sin(ph - 0.6); });
    hub.rotation.y = -t * (u.spin ?? 9); disc.material.opacity = 0.4 + 0.1 * Math.sin(t * 20);
    body.position.y = 0.25 * Math.sin(ph + 1.2) * fl; body.rotation.z = 0.03 * Math.sin(t * 0.7); head.rotation.z = 0.06 * Math.sin(t * 0.9);
    tail.rotation.y = 0.05 * Math.sin(t * 0.8);
  };
  root.update(0);
  return root;
}

// ---- a sunset sky world: warm gradient, low sun, layered clouds, ocean + coast with temple silhouettes far below
export function sunsetWorld(T, o = {}) {
  const { THREE } = T;
  const st = T.stage({ mood: 'dusk', fov: o.fov || 38, fog: o.fog || [120, 480], fogColor: '#e08a6a', sky: o.sky || ['#2a2a6a', '#6a3a7a', '#c8566a', '#ff8a4a', '#ffc070'],
    keyPos: [-200, 40, -260], keyIntensity: 2.6, keyColor: '#ffb070', ambient: 1.9, ambientSky: '#ffc8a8', bloom: 0.16, bloomThreshold: 0.94, shadowSize: 30 });
  try { st.composer.renderTarget1.samples = 0; st.composer.renderTarget2.samples = 0; st.bloom.setSize(Math.round(st.composer.renderTarget1.width / 2), Math.round(st.composer.renderTarget1.height / 2)); } catch (e) {}
  const pm = new THREE.PMREMGenerator(T.getRenderer()); const et = T.canvasTex(256, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#4a3a8a'); gr.addColorStop(0.45, '#ff9a5a'); gr.addColorStop(0.52, '#ffe0a0'); gr.addColorStop(0.6, '#8a4a3a'); gr.addColorStop(1, '#2a1a14'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); et.mapping = THREE.EquirectangularReflectionMapping; st.scene.environment = pm.fromEquirectangular(et).texture; pm.dispose();
  const fill = new THREE.DirectionalLight(new THREE.Color('#ffe2c8'), 1.1); fill.position.set(60, 30, 120); st.add(fill);
  // sun disc + halo
  const sunM = new THREE.Mesh(new THREE.CircleGeometry(16, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2c8'), fog: false })); sunM.position.set(-200, 22, -400); sunM.lookAt(0, 0, 0); st.add(sunM);
  const ht = T.canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,220,160,.8)'); gr.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: ht, transparent: true, opacity: 0.6, depthWrite: false, fog: false })); halo.scale.set(130, 130, 1); halo.position.copy(sunM.position); st.add(halo);
  // ocean + land far below
  const R = rng(o.seed || 3), base = o.groundY ?? -60;
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshStandardMaterial({ color: '#6a4a6a', metalness: 0.6, roughness: 0.3 })); sea.rotation.x = -Math.PI / 2; sea.position.y = base; st.add(sea);
  const land = new THREE.Mesh(new THREE.CircleGeometry(260, 48), T.mat('#5a4a3a', { roughness: 0.95 })); land.rotation.x = -Math.PI / 2; land.position.set(40, base + 0.5, 60); st.add(land);
  // temples: gopuram silhouettes scattered on the land (instanced tiers)
  const tierG = new THREE.BoxGeometry(1, 1, 1); tierG.translate(0, 0.5, 0); const tm = T.mat('#8a5a3a', { roughness: 0.8 }); const N = 70, TI = 4;
  const inst = new THREE.InstancedMesh(tierG, tm, N * TI); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3(); let k = 0;
  for (let i = 0; i < N; i++) { const a = R() * 6.28, d = 20 + R() * 220, x = 40 + Math.cos(a) * d, z = 60 + Math.sin(a) * d, s = 3 + R() * 5; let yy = base + 0.5; q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), R() * 3);
    for (let j = 0; j < TI; j++) { const w = s * (1 - j * 0.2), h = s * 0.55; v.set(x, yy, z); sc.set(w * 1.4, h, w); m4.compose(v, q, sc); inst.setMatrixAt(k++, m4); yy += h; } }
  st.add(inst);
  const lamps = new THREE.BufferGeometry(), la = new Float32Array(600 * 3); for (let i = 0; i < 600; i++) { const a = R() * 6.28, d = R() * 240; la.set([40 + Math.cos(a) * d, base + 1, 60 + Math.sin(a) * d], i * 3); } lamps.setAttribute('position', new THREE.BufferAttribute(la, 3));
  st.add(new THREE.Points(lamps, new THREE.PointsMaterial({ color: new THREE.Color('#ffc070'), size: 1.4, transparent: true, opacity: 0.8 })));
  // clouds: soft sprites in layers (some above, some below the flight line)
  const ct = T.canvasTex(256, 128, (g, w, h) => { for (let i = 0; i < 14; i++) { const r = 22 + Math.random() * 18, x = 30 + r + Math.random() * (196 - 2 * r), y = 64 + (Math.random() - 0.5) * (40 - r); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); } });
  const clouds = []; for (let i = 0; i < (o.clouds ?? 46); i++) { const tint = new THREE.Color().setHSL(0.04 + R() * 0.06, 0.8, 0.72 + R() * 0.12); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ct, color: tint, transparent: true, opacity: 0.55 + R() * 0.3, depthWrite: false })); const s = 30 + R() * 50; sp.scale.set(s * 2, s, 1); sp.position.set((R() - 0.5) * 700, -30 + R() * 50 * (R() < 0.6 ? -1 : 1), -60 - R() * 360); st.add(sp); clouds.push({ sp, x0: sp.position.x, sp0: 2 + R() * 4 }); }
  return { stage: st, clouds, sun: sunM, update: (t, speed = 1) => clouds.forEach((c) => { c.sp.position.x = ((c.x0 - t * c.sp0 * speed * 3 + 350) % 700 + 700) % 700 - 350; }) };
}
