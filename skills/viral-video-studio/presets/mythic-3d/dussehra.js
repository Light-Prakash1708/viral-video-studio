// sets/dussehra.js: an Indian festival ground at night in 3D: the giant ten-headed effigy, a ten-storey building for scale,
// a huge crowd, string lights, floodlights; deterministic fire particles, smoke, fireworks bursts and the flying arrow.
import { rng, lerp, ease, prog, clamp } from '/engine/core.js';
import { glowSpriteMat, fast } from './lanka.js';

export function buildDussehra(T, o = {}) {
  const { THREE } = T, R = rng(31);
  const st = T.stage({ mood: 'night', fov: o.fov || 44, fog: [60, 260], fogColor: '#140c14', sky: ['#020208', '#080a1e', '#1a1226', '#3a1a1a'], keyPos: [30, 50, 40], keyIntensity: 0.8, keyColor: '#ffd0a0', ambient: 1.3, ambientSky: '#6a4a5a', bloom: 0.18, bloomThreshold: 0.94, shadowSize: 40 });
  fast(T, st); st.sun.castShadow = false; const D = { stage: st, THREE };
  st.add(T.ground(600, 600, '#2a1c16'));
  // effigy (local origin at the feet), heights in metres
  const E3 = new THREE.Group(); st.add(E3); D.effigy = E3; const mats = [];
  const M = (c, o2 = {}) => { const m = T.mat(c, { roughness: 0.8, ...o2 }); m.userData.base = new THREE.Color(c); mats.push(m); return m; };
  const skirtTex = T.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#b8302a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { g.fillStyle = '#ffc45a'; g.fillRect(0, i * 44 + 10, w, 10); g.fillStyle = '#2a6a4a'; for (let k = 0; k < 8; k++) { g.beginPath(); g.arc(k * 32 + 16, i * 44 + 32, 6, 0, 7); g.fill(); } } });
  const skirtM = M('#ffffff', { map: skirtTex });
  E3.add(T.cyl(0.25, 0.25, 4, M('#4a3420'), -1.6, 2, 0, 8), T.cyl(0.25, 0.25, 4, M('#4a3420'), 1.6, 2, 0, 8));
  const skirt = T.cyl(2.4, 4.8, 9, skirtM, 0, 8.5, 0, 24); E3.add(skirt);
  const tunicTex = T.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#1f8a4a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd25a'; for (let y = 8; y < h; y += 26) for (let x = (y / 26 % 2) * 13; x < w; x += 26) { g.beginPath(); g.arc(x, y, 3.5, 0, 7); g.fill(); } g.fillStyle = '#ffc040'; g.fillRect(w / 2 - 10, 0, 20, h); });
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.6, 5.2, 20), M('#ffffff', { map: tunicTex })); torso.scale.z = 0.62; torso.position.set(0, 15.5, 0); E3.add(torso);
  const goldM = M('#ffc84a', { metalness: 0.6, roughness: 0.35 }), redM = M('#c81e2a');
  for (const r of [1.3, 1.9]) { const nk = new THREE.Mesh(new THREE.TorusGeometry(r, 0.18, 8, 28, Math.PI), goldM); nk.position.set(0, 18.1 - r * 0.2, 1.5); nk.rotation.z = Math.PI; nk.scale.y = 1.2; E3.add(nk); }
  E3.add(T.box(4.9, 0.8, 1.9, goldM, 0, 13.1, 0.1));
  const sash = T.box(0.7, 6, 0.2, redM, 1.0, 15.3, 1.55); sash.rotation.z = 0.5; E3.add(sash);
  for (const s of [-1, 1]) { const cape = T.box(0.9, 9, 0.2, redM, s * 2.9, 13.5, -0.9); cape.rotation.z = s * 0.12; E3.add(cape); }
  const chest = T.box(2.2, 2.6, 0.2, M('#ffc45a', { metalness: 0.4 }), 0, 16, 1.35); E3.add(chest);
  for (const s of [-1, 1]) { const arm = T.cyl(0.6, 0.7, 7, M('#1f8a4a'), s * 3.6, 14.5, 0, 12); arm.rotation.z = s * 0.35; E3.add(arm); for (const y of [16.2, 12.6]) { const b = T.cyl(0.78, 0.78, 0.45, goldM, s * (3.6 + (y < 14 ? 0.55 : -0.4)), y, 0, 12); b.rotation.z = s * 0.35; E3.add(b); } }
  const shield = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.35, 28), M('#8a8f9a', { metalness: 0.7, roughness: 0.35 })); shield.rotation.x = Math.PI / 2; shield.position.set(-5.0, 12.4, 1.2); E3.add(shield);
  for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; E3.add(T.sphere(0.25, goldM, -5.0 + Math.cos(a) * 1.4, 12.4 + Math.sin(a) * 1.4, 1.45)); } E3.add(T.sphere(0.45, goldM, -5.0, 12.4, 1.45));
  const swordShape = new THREE.Shape(); swordShape.moveTo(0, 0); swordShape.quadraticCurveTo(1.4, 3.5, 0.2, 7.5); swordShape.lineTo(-0.5, 7.2); swordShape.quadraticCurveTo(0.6, 3.6, -0.6, 0.2); swordShape.lineTo(0, 0);
  const sword = new THREE.Mesh(new THREE.ExtrudeGeometry(swordShape, { depth: 0.12, bevelEnabled: false }), M('#d8dce4', { metalness: 0.8, roughness: 0.2 })); sword.position.set(5.6, 11.6, 0.8); sword.rotation.z = -0.25; E3.add(sword); E3.add(T.box(1.4, 0.35, 0.4, goldM, 5.6, 11.5, 0.85)); E3.add(T.cyl(0.18, 0.18, 1.3, M('#5a2a10'), 5.6, 10.8, 0.85, 8));
  E3.add(T.box(16, 0.5, 0.6, M('#4a3420'), 0, 18.4, 0));
  const faceTex = (k) => T.canvasTex(160, 200, (g, w, h) => { const sk = k % 2 ? '#f0b878' : '#e4a866'; g.fillStyle = sk; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1a0a04'; g.fillRect(0, 0, w, 26); // hairline
    g.save(); g.translate(0, 12); g.strokeStyle = '#1a0a04'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(26, 60); g.lineTo(66, 72); g.moveTo(134, 60); g.lineTo(94, 72); g.stroke();
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(52, 86, 17, 11, 0, 0, 7); g.ellipse(108, 86, 17, 11, 0, 0, 7); g.fill(); g.fillStyle = '#2a1206'; g.beginPath(); g.arc(54, 87, 7, 0, 7); g.arc(106, 87, 7, 0, 7); g.fill();
    g.fillStyle = '#c03018'; g.fillRect(74, 30, 12, 34); g.fillStyle = '#ffffff'; g.fillRect(70, 34, 4, 26); g.fillRect(86, 34, 4, 26); // tilak
    g.fillStyle = shadeC(sk); g.beginPath(); g.moveTo(80, 92); g.lineTo(70, 124); g.lineTo(90, 124); g.fill(); // nose
    g.fillStyle = '#140804'; g.beginPath(); g.moveTo(80, 134); g.bezierCurveTo(60, 124, 30, 128, 18, 112); g.bezierCurveTo(26, 140, 58, 150, 80, 142); g.bezierCurveTo(102, 150, 134, 140, 142, 112); g.bezierCurveTo(130, 128, 100, 124, 80, 134); g.fill(); // curled moustache
    g.fillStyle = '#a8141e'; g.beginPath(); g.ellipse(80, 154, 18, 7, 0, 0, 7); g.fill(); g.fillStyle = '#140804'; g.beginPath(); g.moveTo(54, 170); g.quadraticCurveTo(80, 196, 106, 170); g.lineTo(80, 182); g.fill(); g.restore(); });
  const shadeC = (c) => c === '#f0b878' ? '#d89a5a' : '#c88848';
  D.heads = []; const hairM = M('#1a0e08');
  for (let i = 0; i < 10; i++) { const x = (i - 4.5) * 1.62, main = i === 4 || i === 5, hh = main ? 2.4 : 2.0; const fm = M('#ffffff', { map: faceTex(i) }); const side = M(i % 2 ? '#f0b878' : '#e4a866');
    const h = new THREE.Mesh(new THREE.BoxGeometry(1.5, hh, 1.3), [side, side, side, side, fm, side]); h.position.set(x, 19.8 + (main ? 0.2 : 0), 0.2); E3.add(h); D.heads.push(h);
    E3.add(T.box(1.6, hh * 0.9, 0.5, hairM, x, 19.6, -0.55));
    for (const s of [-1, 1]) E3.add(T.sphere(0.16, goldM, x + s * 0.78, 19.5, 0.3)); // earrings
    const cy = 19.8 + hh / 2 + (main ? 0.2 : 0); const cw = main ? 0.85 : 0.72;
    E3.add(T.cyl(cw, cw * 0.95, 0.35, goldM, x, cy + 0.18, 0.2, 12)); E3.add(T.cyl(cw * 0.8, cw, 0.9, goldM, x, cy + 0.8, 0.2, 12)); E3.add(T.cyl(cw * 0.5, cw * 0.8, 0.8, goldM, x, cy + 1.6, 0.2, 12)); E3.add(T.cone(cw * 0.45, main ? 1.3 : 1.0, goldM, x, cy + 2.4 + (main ? 0.2 : 0), 0.2, 12));
    E3.add(T.sphere(0.2, M(i % 3 ? '#e0102a' : '#10a060', { metalness: 0.2, roughness: 0.15 }), x, cy + 0.85, 0.2 + cw * 0.9)); }
  D.mats = mats; D.top = 26;
  // ten-storey building for scale
  const bld = T.building(12, 31, 10, { color: '#1a1622', win: '#ffcf8a', lit: 0.35, seed: 5 }); bld.position.set(-24, 15.5, -6); st.add(bld); D.bld = { x: -24, top: 31 };
  for (let i = 0; i < 2; i++) { const b2 = T.building(10, 14 + i * 6, 8, { color: '#16121e', win: '#ffcf8a', lit: 0.3, seed: 8 + i }); b2.position.set(28 + i * 14, (14 + i * 6) / 2, -16); st.add(b2); }
  // crowd: instanced capsules in a fan in front (+z)
  const geo = new THREE.CapsuleGeometry(0.24, 0.9, 3, 6); const crowd = new THREE.InstancedMesh(geo, T.mat('#ffffff', { roughness: 0.9 }), 1400); const m4 = new THREE.Matrix4(), col = new THREE.Color();
  D.crowdBase = []; for (let i = 0; i < 1400; i++) { const a = -1.1 + R() * 2.2, d = 22 + R() * 70; const x = Math.sin(a) * d, z = Math.cos(a) * d; D.crowdBase.push([x, z, R()]); m4.makeTranslation(x, 0.85, z); crowd.setMatrixAt(i, m4); crowd.setColorAt(i, col.set(['#2a2228', '#3a2a2a', '#1e1a24', '#4a3028', '#5a2a30'][Math.floor(R() * 5)])); }
  st.add(crowd); D.crowd = crowd;
  // string lights on poles around the ground
  const lp = []; const poles = []; for (let k = 0; k < 12; k++) { const a = -1.3 + k * (2.6 / 11), d = 34; poles.push([Math.sin(a) * d, Math.cos(a) * d]); st.add(T.cyl(0.12, 0.15, 9, '#2a2018', Math.sin(a) * d, 4.5, Math.cos(a) * d, 6)); }
  for (let k = 0; k < poles.length - 1; k++) for (let j = 0; j <= 16; j++) { const u = j / 16, x = lerp(poles[k][0], poles[k + 1][0], u), z = lerp(poles[k][1], poles[k + 1][1], u), y = 9 - Math.sin(u * Math.PI) * 1.6; lp.push(x, y, z); }
  for (let j = 0; j <= 30; j++) { const u = j / 30; lp.push(lerp(-30, 30, u), 12 - Math.sin(u * Math.PI) * 3, 26); }
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3)); D.bulbs = new THREE.Points(lg, new THREE.PointsMaterial({ color: new THREE.Color('#ffcf6a'), size: 0.5, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); st.add(D.bulbs);
  // floodlights + the fire light
  const pl = (c, i, d, x, y, z) => { const l = new THREE.PointLight(new THREE.Color(c), i, d, 1.5); l.position.set(x, y, z); st.add(l); return l; };
  pl('#ffd0a0', 500, 80, 18, 14, 22); pl('#ffb070', 400, 80, -18, 12, 24); pl('#9ab0ff', 150, 80, 0, 30, -30);
  D.fireLight = pl('#ff7a2a', 0, 120, 0, 14, 6); pl('#fff0dc', 160, 60, 2, 20, 24); pl('#ffe0c0', 70, 40, -6, 24, 12);
  // fire particles (two clouds), smoke sprites
  const NP = 1800; D.NP = NP; D.fireSeeds = []; for (let i = 0; i < NP; i++) D.fireSeeds.push([R(), R(), R(), R()]);
  const mkP = (n, c, s) => { const g2 = new THREE.BufferGeometry(); g2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); const p = new THREE.Points(g2, new THREE.PointsMaterial({ color: new THREE.Color(c), size: s, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); st.add(p); return p; };
  D.fireA = mkP(NP, '#ff7a2a', 0.9); D.fireB = mkP(NP, '#ffd27a', 0.5); D.embers = mkP(500, '#ffb050', 0.25);
  D.smoke = []; const smM = new THREE.SpriteMaterial({ map: glowSpriteMat(T, '#ffffff', 1).map, color: new THREE.Color('#2a2026'), transparent: true, opacity: 0, depthWrite: false }); for (let i = 0; i < 40; i++) { const s = new THREE.Sprite(smM.clone()); st.add(s); D.smoke.push([s, R(), R()]); }
  const flT = T.canvasTex(64, 128, (g) => { const gr = g.createLinearGradient(0, 128, 0, 0); gr.addColorStop(0, 'rgba(255,240,180,1)'); gr.addColorStop(0.35, 'rgba(255,150,40,.95)'); gr.addColorStop(0.75, 'rgba(220,40,20,.7)'); gr.addColorStop(1, 'rgba(160,10,10,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(32, 2); g.bezierCurveTo(46, 40, 62, 70, 52, 104); g.quadraticCurveTo(32, 128, 12, 104); g.bezierCurveTo(2, 70, 18, 40, 32, 2); g.fill(); });
  D.flames = []; for (let i = 0; i < 46; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: flT, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); st.add(sp); const a = R() * 6.28, hy = R(); D.flames.push({ sp, a, hy, r: R(), ph: R() * 6.28 }); }
  D.fireGlow = new THREE.Sprite(glowSpriteMat(T, '#ff8a3a', 0)); D.fireGlow.scale.set(60, 60, 1); D.fireGlow.position.set(0, 14, 2); st.add(D.fireGlow);
  // fireworks
  D.bursts = []; const cols = ['#ffc45a', '#ff5a8a', '#7fe8ff', '#a8ff7a', '#ffffff', '#ff8a3a', '#c88aff', '#ffd27a'];
  for (let b = 0; b < 10; b++) { const n = 160, g2 = new THREE.BufferGeometry(); g2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); const p = new THREE.Points(g2, new THREE.PointsMaterial({ color: new THREE.Color(cols[b % cols.length]), size: 0.9, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); st.add(p);
    const dirs = []; for (let i = 0; i < n; i++) { const u = R() * 2 - 1, th = R() * 6.28, r = Math.sqrt(1 - u * u); dirs.push([r * Math.cos(th), u, r * Math.sin(th), 0.8 + R() * 0.3]); }
    D.bursts.push({ p, dirs, c: [(R() - 0.5) * 70, 40 + R() * 25, -10 - R() * 40], fl: new THREE.Sprite(glowSpriteMat(T, cols[b % cols.length], 0)) }); D.bursts[b].fl.scale.set(30, 30, 1); D.bursts[b].fl.position.set(...D.bursts[b].c); st.add(D.bursts[b].fl); }
  // the arrow
  const ar = new THREE.Group(); ar.add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2c8') }))); const sp = new THREE.Sprite(glowSpriteMat(T, '#ffd27a', 0.9)); sp.scale.set(5, 5, 1); ar.add(sp);
  const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.5, 14, 8, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb050'), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })); tr.position.y = -8; ar.add(tr);
  ar.visible = false; st.add(ar); D.arrow = ar;
  // stars
  const sg = new THREE.BufferGeometry(), sa = []; for (let i = 0; i < 900; i++) { const a = R() * 6.28, el = 0.1 + R() * 1.2; sa.push(Math.cos(a) * Math.cos(el) * 230, Math.sin(el) * 160 + 10, Math.sin(a) * Math.cos(el) * 230); } sg.setAttribute('position', new THREE.Float32BufferAttribute(sa, 3)); st.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.3, sizeAttenuation: false, transparent: true, opacity: 0.6 })));
  D.update = (t, u = {}) => updateD(D, t, u);
  updateD(D, 0, {}); return D;
}
function updateD(D, t, u) {
  const burn = u.burn ?? 0, TH = D.THREE;
  D.mats.forEach((m) => { m.color.copy(m.userData.base).lerp(new TH.Color('#3a1408'), clamp(burn * 0.8 - 0.25) * 0.6); });
  D.flames.forEach((f) => { const on = clamp(burn * 1.6 - f.hy * 0.9); const h0 = f.hy * (6 + 12 * clamp(burn * 1.2 - 0.3)) + 1, rad = h0 < 13 ? lerp(5.0, 2.8, h0 / 13) : 3.0; const fl = 1 + 0.25 * Math.sin(t * 9 + f.ph) + 0.15 * Math.sin(t * 23 + f.ph * 2);
    f.sp.position.set(Math.cos(f.a) * rad, h0 + 2.2 * fl * on, Math.sin(f.a) * rad * 0.7 + 1.0); const s = (3 + f.r * 4) * on; f.sp.scale.set(s * 0.6, s * 1.2 * fl, 1); f.sp.material.opacity = 0.7 * on; });
  D.fireLight.intensity = 260 * burn * (0.85 + 0.15 * Math.sin(t * 17)); D.fireGlow.material.opacity = 0.1 * burn;
  // fire: particles live on the effigy surface volume, rise and fade, deterministic in t
  const A = D.fireA.geometry.attributes.position.array, B = D.fireB.geometry.attributes.position.array; const active = Math.floor(D.NP * clamp(burn));
  for (let i = 0; i < D.NP; i++) { const [a, b, c, d] = D.fireSeeds[i]; if (i >= active) { A[i * 3 + 1] = -50; B[i * 3 + 1] = -50; continue; }
    const life = (t * (0.8 + d) + a) % 1, h0 = 1 + b * (6 + 14 * clamp(burn * 1.2 - 0.3)), rad = h0 < 13 ? lerp(4.6, 2.4, (h0 - 4) / 9) : 2.8; const ang = c * 6.28;
    const x = Math.cos(ang) * rad * (1 - life * 0.5) + Math.sin(t * 3 + i) * 0.4, z = Math.sin(ang) * rad * (1 - life * 0.5) + 0.4, y = h0 + life * (5 + 6 * burn);
    A[i * 3] = x; A[i * 3 + 1] = y; A[i * 3 + 2] = z; B[i * 3] = x * 0.85; B[i * 3 + 1] = y - 1; B[i * 3 + 2] = z + 0.3; }
  D.fireA.geometry.attributes.position.needsUpdate = D.fireB.geometry.attributes.position.needsUpdate = true; D.fireA.material.opacity = 0.38 * clamp(burn * 3); D.fireB.material.opacity = 0.42 * clamp(burn * 3);
  D.fireA.material.size = 0.9 + 0.4 * burn;
  const Em = D.embers.geometry.attributes.position.array; for (let i = 0; i < 500; i++) { const [a, b, c] = D.fireSeeds[i]; const life = (t * 0.25 + a) % 1; Em[i * 3] = (b - 0.5) * 14 + Math.sin(t + i) * 2 * life; Em[i * 3 + 1] = 8 + life * 50; Em[i * 3 + 2] = (c - 0.5) * 8; } D.embers.geometry.attributes.position.needsUpdate = true; D.embers.material.opacity = burn;
  D.smoke.forEach(([s, a, b], i) => { const life = (t * 0.12 + a) % 1; s.position.set((b - 0.5) * 10 + life * 8, 20 + life * 40, -2); s.scale.setScalar(8 + life * 24); s.material.opacity = 0.5 * burn * Math.sin(life * Math.PI); });
  // fireworks: u.fw = [[burstIndex, startTime], ...]
  D.bursts.forEach((b) => { b.p.material.opacity = 0; b.fl.material.opacity = 0; });
  (u.fw || []).forEach(([bi, st]) => { const b = D.bursts[bi], dt = t - st; if (!b || dt < 0 || dt > 2.6) return; const P = b.p.geometry.attributes.position.array, R = 16 * ease.out(clamp(dt / 1.0));
    b.dirs.forEach(([x, y, z, s], i) => { P[i * 3] = b.c[0] + x * R * s; P[i * 3 + 1] = b.c[1] + y * R * s - dt * dt * 2.2; P[i * 3 + 2] = b.c[2] + z * R * s; }); b.p.geometry.attributes.position.needsUpdate = true;
    b.p.material.opacity = clamp(1 - dt / 2.6) * (0.7 + 0.3 * Math.sin(dt * 30)); b.fl.material.opacity = 0.6 * clamp(1 - dt / 0.4); });
  // crowd bob (cheer)
  if (u.cheer) { const m4 = new TH.Matrix4(); D.crowdBase.forEach(([x, z, r], i) => { m4.makeTranslation(x, 0.85 + Math.max(0, Math.sin(t * 6 + r * 20)) * 0.25 * u.cheer, z); D.crowd.setMatrixAt(i, m4); }); D.crowd.instanceMatrix.needsUpdate = true; }
  D.bulbs.material.size = 0.45 + 0.08 * Math.sin(t * 4);
  // the arrow: u.arrow = progress 0..1 from the crowd to the chest
  if (u.arrow != null && u.arrow > 0 && u.arrow < 1) { const k = u.arrow, a = new TH.Vector3(4, 4, 46), b2 = new TH.Vector3(0, 15.5, 1.4); const p = a.clone().lerp(b2, k); p.y += Math.sin(k * Math.PI) * 5; D.arrow.visible = true; D.arrow.position.copy(p);
    const dir = b2.clone().sub(a).normalize(); D.arrow.quaternion.setFromUnitVectors(new TH.Vector3(0, 1, 0), dir); } else D.arrow.visible = false;
}
