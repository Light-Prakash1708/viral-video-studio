// sets/lanka.js: Swarna Lanka in 3D. Layered island in a moving ocean, gold-roofed palace + temples, the ten
// ministry towers (each with its own emblem light), canals, a skyport, golden vimanas rising like fireflies,
// stars, motes, torches (ancient era) and searchlights (dark era). One builder, three eras + a growth factor.
import { rng, lerp, ease, prog, clamp, shade, mix } from '/engine/core.js';

export const MINISTRIES = [
  ['MEDICINE', '#5fe8b0'], ['MUSIC', '#ff7ad0'], ['ASTRONOMY', '#7fb8ff'], ['WAR', '#ff4a3a'], ['TRADE', '#ffc15a'],
  ['LAW', '#e8e8ff'], ['SEA', '#3ad0e0'], ['HARVEST', '#a8e05a'], ['BUILDING', '#ff9a3a'], ['LEARNING', '#b08aff'],
];
export const TOWER_R = 22, PLAT_Y = 6;
export const towerPos = (i, y = 0) => { const a = (i / 10) * Math.PI * 2 + Math.PI * 0.05; return [Math.cos(a) * TOWER_R, y, Math.sin(a) * TOWER_R]; };

const SKIES = {
  '2026': ['#03041a', '#0b1040', '#22205a', '#5a3448', '#a8603a'],
  ancient: ['#060a26', '#1c2050', '#5a3a5a', '#c8703a', '#ffb060'],
  dark: ['#020306', '#080c14', '#121a24', '#1e2a32'],
  storm: ['#020408', '#0a1018', '#1a2028', '#3a3030'],
};
// an environment map so the gold metal has something warm to reflect
function envMap(T, era) {
  const R = T.getRenderer(); const pm = new T.THREE.PMREMGenerator(R);
  const tex = T.canvasTex(256, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    if (era === 'dark' || era === 'storm') { gr.addColorStop(0, '#0a0e14'); gr.addColorStop(0.5, '#3a4048'); gr.addColorStop(1, '#0a0c10'); }
    else { gr.addColorStop(0, '#0a0c30'); gr.addColorStop(0.42, '#3a2a5a'); gr.addColorStop(0.5, '#ffc070'); gr.addColorStop(0.56, '#7a4a2a'); gr.addColorStop(1, '#1a0e08'); }
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 18; i++) { g.fillStyle = 'rgba(255,220,150,.5)'; g.fillRect((i * 37) % w, h * 0.46, 6, 10); }
  });
  tex.mapping = T.THREE.EquirectangularReflectionMapping;
  const env = pm.fromEquirectangular(tex).texture; pm.dispose(); return env;
}
const winTex = (T, base, lit, seed, cols = 6, rows = 10, p = 0.5) => { const r = rng(seed); return T.canvasTex(128, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const on = r() < p; g.fillStyle = on ? (r() < 0.2 ? '#fff0d0' : lit) : shade(base, -0.3); g.fillRect(i * (w / cols) + w / cols * 0.3, j * (h / rows) + h / rows * 0.25, w / cols * 0.4, h / rows * 0.5); } g.fillStyle = lit; g.fillRect(0, 0, w, 6); }); };

function emblemTex(T, i, col) {
  return T.canvasTex(128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.arc(64, 64, 56, 0, 7); g.stroke();
    const L = (pts) => { g.beginPath(); g.moveTo(...pts[0]); pts.slice(1).forEach((p) => g.lineTo(...p)); g.stroke(); };
    if (i === 0) { L([[64, 30], [64, 98]]); L([[30, 64], [98, 64]]); }
    else if (i === 1) { g.beginPath(); g.arc(52, 84, 14, 0, 7); g.fill(); L([[64, 84], [64, 30], [88, 40]]); }
    else if (i === 2) { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k * 2.513; L([[64, 64], [64 + Math.cos(a) * 34, 64 + Math.sin(a) * 34]]); } }
    else if (i === 3) { L([[36, 36], [92, 92]]); L([[92, 36], [36, 92]]); L([[30, 80], [48, 98]]); L([[98, 80], [80, 98]]); }
    else if (i === 4) { g.beginPath(); g.arc(64, 64, 24, 0, 7); g.stroke(); L([[64, 50], [64, 78]]); }
    else if (i === 5) { L([[64, 30], [64, 96]]); L([[34, 46], [94, 46]]); L([[34, 46], [26, 72], [42, 72], [34, 46]]); L([[94, 46], [86, 72], [102, 72], [94, 46]]); }
    else if (i === 6) { for (let k = 0; k < 2; k++) { g.beginPath(); for (let x = 28; x <= 100; x += 4) g.lineTo(x, 56 + k * 20 + Math.sin(x / 8) * 7); g.stroke(); } }
    else if (i === 7) { L([[64, 100], [64, 30]]); for (let k = 0; k < 3; k++) { L([[64, 44 + k * 16], [48, 34 + k * 16]]); L([[64, 44 + k * 16], [80, 34 + k * 16]]); } }
    else if (i === 8) { L([[32, 96], [32, 60], [64, 30], [96, 60], [96, 96]]); L([[54, 96], [54, 74], [74, 74], [74, 96]]); }
    else { L([[34, 40], [64, 50], [94, 40], [94, 90], [64, 100], [34, 90], [34, 40]]); L([[64, 50], [64, 100]]); }
  });
}
// a sleek golden flying craft inspired by the Pushpaka Vimana: hull, temple-spire canopy, swept wings, under-glow
export function vimana(T, o = {}) {
  const { THREE } = T, g = new THREE.Group(), gold = o.gold, s = o.s || 1;
  const hull = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10), gold); hull.scale.set(2.6, 0.42, 0.85); g.add(hull);
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.1, 6), gold); spire.position.set(0.3, 0.55, 0); g.add(spire);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), o.glow); tip.position.set(0.3, 1.15, 0); g.add(tip);
  for (const z of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 1.5), gold); w.position.set(-0.4, 0, z * 1.0); w.rotation.y = -z * 0.5; g.add(w);
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.12), o.glow); fin.position.set(-1.1, 0.02, z * 1.55); g.add(fin); }
  const band = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.07, 0.07), o.glow); band.position.set(0, 0.05, 0.86); g.add(band);
  const band2 = band.clone(); band2.position.z = -0.86; g.add(band2);
  if (o.sprite) { const sp = new THREE.Sprite(o.sprite); sp.scale.set(5, 5, 1); sp.position.y = -0.4; g.add(sp); }
  g.scale.setScalar(s); return g;
}
export function glowSpriteMat(T, color, opacity = 0.5) {
  const tex = T.canvasTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
  return new T.THREE.SpriteMaterial({ map: tex, color: new T.THREE.Color(color), transparent: true, opacity, depthWrite: false, blending: T.THREE.AdditiveBlending });
}

// render-cost trim for CPU (SwiftShader) renders: no MSAA on the composer targets, quarter-res bloom
export function fast(T, st) { const THREE = T.THREE, c = st.composer, w = c.renderTarget1.width, h = c.renderTarget1.height;
  c.reset(new THREE.WebGLRenderTarget(w, h, { samples: 0, type: THREE.HalfFloatType })); st.bloom.setSize(Math.round(w / 2), Math.round(h / 2)); return st; }
// build the world.  o.era: '2026' | 'ancient' | 'dark' | 'storm';  o.grow 0..1 (2026 structures)
export function buildLanka(T, o = {}) {
  const { THREE } = T, era = o.era || '2026', modern = era !== 'ancient', dark = era === 'dark' || era === 'storm';
  const st = T.stage({ mood: 'night', fov: o.fov || 40, fog: o.fog || [90, 520], fogColor: dark ? '#0c1218' : era === 'ancient' ? '#3a2a40' : '#1a1638',
    sky: o.sky || SKIES[era], keyPos: era === 'ancient' ? [180, 60, -140] : [-60, 120, -80], keyIntensity: dark ? 0.9 : era === 'ancient' ? 2.2 : 1.3,
    keyColor: dark ? '#a8b8c8' : era === 'ancient' ? '#ffb070' : '#9ab0ff', ambient: dark ? 1.2 : 1.6, ambientSky: dark ? '#4a5868' : '#5a4a8a', bloom: o.bloom ?? (dark ? 0.35 : 0.55), bloomThreshold: 0.86, shadowSize: 60 });
  fast(T, st); st.sun.shadow.camera.far = 400; st.sun.castShadow = !!o.shadows;
  const env = envMap(T, era); st.scene.environment = env;
  const R = rng(o.seed || 7), L = { stage: st, era, grow: o.grow ?? 1, THREE };
  L.setGrow = (k) => setGrowImpl(L, k);
  const gold = new THREE.MeshStandardMaterial({ color: dark ? '#8a8270' : '#ffc45a', metalness: 0.9, roughness: 0.28, envMapIntensity: dark ? 0.5 : 1.2 });
  const goldDim = new THREE.MeshStandardMaterial({ color: dark ? '#6a6458' : '#d89a3a', metalness: 0.75, roughness: 0.4 });
  const stone = T.mat(dark ? '#2a2c30' : '#7a6248', { roughness: 0.75 });
  const glowGold = new THREE.MeshBasicMaterial({ color: new THREE.Color(dark ? '#8a9aa8' : '#ffd890') });
  L.gold = gold; L.glowGold = glowGold;
  // ---- ocean with moving waves
  const oc = new THREE.PlaneGeometry(900, 900, 110, 110); oc.rotateX(-Math.PI / 2);
  const ocean = new THREE.Mesh(oc, new THREE.MeshStandardMaterial({ color: dark ? '#0a1418' : era === 'ancient' ? '#0e3442' : '#05222e', metalness: era === 'ancient' ? 0.35 : 0.55, roughness: 0.25, flatShading: true, envMapIntensity: era === 'ancient' ? 0.45 : 0.8 }));
  ocean.receiveShadow = true; st.add(ocean); L.ocean = ocean; L.oceanBase = Float32Array.from(oc.attributes.position.array);
  // reflected city glow on the water + shore foam rings
  const glowMat = (c, op) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c), transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false });
  const rTex = T.canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 30, 128, 128, 128); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.55, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshBasicMaterial({ map: rTex, color: new THREE.Color(dark ? '#3a4a5a' : '#ff9a3a'), transparent: true, opacity: dark ? 0.12 : 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
  pool.rotation.x = -Math.PI / 2; pool.position.y = 0.6; st.add(pool);
  L.foam = []; for (let k = 0; k < 4; k++) { const f = new THREE.Mesh(new THREE.RingGeometry(1, 1.012, 128), glowMat('#cfeeff', 0.0)); f.rotation.x = -Math.PI / 2; f.position.y = 0.7; st.add(f); L.foam.push(f); }
  // ---- the island: layered tiers, rocky cliffs
  const mark = st.scene.children.length;
  const rock = T.mat(dark ? '#1e2024' : '#3a2a22', { flat: true, roughness: 0.95 }), green = T.mat(dark ? '#1a2020' : '#1e3226', { roughness: 0.9 }), sand = T.mat(dark ? '#3a3a38' : '#8a7050', { roughness: 0.9 });
  const tier = (r, h, y, m, seg = 40) => { const c = T.cyl(r * 0.97, r, h, m, 0, y - h / 2, 0, seg); st.add(c); return c; };
  tier(80, 2.4, 1.2, sand, 48); tier(74, 1.6, 2.6, green, 48);
  for (let i = 0; i < 26; i++) { const a = R() * 6.28, d = 52 + R() * 4; const c = T.cone(5 + R() * 4, 7 + R() * 5, rock, Math.cos(a) * d, 3.0, Math.sin(a) * d, 6); st.add(c); }
  tier(54, 3.6, 5.2, rock, 9).rotation.y = 0.3; tier(52, 0.6, 5.5, green, 40);
  for (let i = 0; i < 18; i++) { const a = R() * 6.28, d = 31 + R() * 2; st.add(T.cone(3 + R() * 2, 5 + R() * 3, rock, Math.cos(a) * d, 5.8, Math.sin(a) * d, 5)); }
  tier(33, 1.6, PLAT_Y, stone, 40);
  // ---- canals: a ring + four spokes, mirror-like water catching the gold
  const water = new THREE.MeshStandardMaterial({ color: dark ? '#0a1014' : '#081a2a', metalness: 0.95, roughness: 0.08, envMapIntensity: 1.4 });
  const canal = new THREE.Mesh(new THREE.RingGeometry(40, 44, 96), water); canal.rotation.x = -Math.PI / 2; canal.position.y = 5.82; st.add(canal);
  const canalGlow = new THREE.Mesh(new THREE.RingGeometry(43.6, 44.2, 96), glowMat(dark ? '#5a6a7a' : '#ffcf7a', 0.5)); canalGlow.rotation.x = -Math.PI / 2; canalGlow.position.y = 5.86; st.add(canalGlow);
  const canalGlow2 = new THREE.Mesh(new THREE.RingGeometry(39.8, 40.4, 96), glowMat(dark ? '#5a6a7a' : '#ffcf7a', 0.5)); canalGlow2.rotation.x = -Math.PI / 2; canalGlow2.position.y = 5.86; st.add(canalGlow2);
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; const c = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 40), water); c.rotation.x = -Math.PI / 2; c.rotation.z = -a + Math.PI / 2; c.position.set(Math.cos(a) * 54, 5.84, Math.sin(a) * 54); st.add(c); }
  // ---- city buildings (instanced): modern towers/blocks (2026) and low lamp-lit houses (ancient)
  const box = new THREE.BoxGeometry(1, 1, 1); box.translate(0, 0.5, 0);
  const modT = winTex(T, dark ? '#1a1e24' : '#1c1626', dark ? '#9aa8b4' : '#ffc060', 3, 5, 18, 0.42), oldT = winTex(T, '#3a2820', '#ffa850', 5, 2, 2, 0.5);
  const modM = new THREE.MeshStandardMaterial({ map: modT, emissiveMap: modT, emissive: new THREE.Color('#ffffff'), emissiveIntensity: dark ? 0.15 : 0.3, roughness: 0.5, metalness: 0.5 });
  const oldM = new THREE.MeshStandardMaterial({ map: oldT, emissiveMap: oldT, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.22, roughness: 0.9 });
  const spots = []; for (let i = 0; i < 1400 && spots.length < 420; i++) { const a = R() * 6.28, d = 34 + R() * 38; const x = Math.cos(a) * d, z = Math.sin(a) * d;
    if (d > 39 && d < 45) continue; if (d > 50 && d < 57) continue; let near = false; for (let k = 0; k < 4; k++) { const ca = k * Math.PI / 2 + Math.PI / 4; const da = Math.abs(Math.atan2(Math.sin(a - ca), Math.cos(a - ca))); if (da * d < 2.6) near = true; } if (near) continue;
    spots.push({ x, z, y: d < 50 ? 5.8 : 3.4, w: 1.6 + R() * 2.6, dpt: 1.6 + R() * 2.6, h: (d < 50 ? 4 : 2) + R() * R() * (d < 50 ? 18 : 9), ry: a, r: R() }); }
  L.spots = spots;
  const modI = new THREE.InstancedMesh(box, modM, spots.length), oldI = new THREE.InstancedMesh(box, oldM, spots.length);
  modI.receiveShadow = oldI.receiveShadow = true; st.add(modI, oldI); L.modI = modI; L.oldI = oldI;
  // ancient roofs (instanced pyramids)
  const roofG = new THREE.ConeGeometry(0.75, 0.7, 4); roofG.rotateY(Math.PI / 4); roofG.translate(0, 0.35, 0);
  const roofI = new THREE.InstancedMesh(roofG, goldDim, spots.length); st.add(roofI); L.roofI = roofI;
  const spG = new THREE.ConeGeometry(0.62, 1, 6); spG.translate(0, 0.5, 0); const spireI = new THREE.InstancedMesh(spG, gold, spots.length); st.add(spireI); L.spireI = spireI;
  // ---- the palace: stepped platform, hall, stacked gold shikhara, corner spires, glowing bands
  const pal = new THREE.Group(); st.add(pal); L.palace = pal;
  [[24, PLAT_Y + 0.75], [19, PLAT_Y + 2.25], [14.5, PLAT_Y + 3.75]].forEach(([w, y]) => pal.add(T.box(w, 1.5, w, stone, 0, y, 0)));
  const top = PLAT_Y + 4.5;
  pal.add(T.box(12, 5, 12, stone, 0, top + 2.5, 0));
  for (let i = 0; i < 9; i++) { const rb = 5.4 - i * 0.55, h = 2.6; const c = new THREE.Mesh(new THREE.CylinderGeometry(rb - 0.5, rb, h, 4), gold); c.rotation.y = Math.PI / 4; c.position.y = top + 5 + h / 2 + i * h; pal.add(c);
    const bnd = new THREE.Mesh(new THREE.CylinderGeometry(rb - 0.45, rb - 0.45, 0.18, 4, 1, true), glowGold); bnd.rotation.y = Math.PI / 4; bnd.position.y = top + 5 + i * h + h; pal.add(bnd); }
  const spH = top + 5 + 9 * 2.6; L.spireTop = spH;
  pal.add(T.sphere(0.9, gold, 0, spH + 0.6, 0)); const fin = T.cone(0.35, 2.4, gold, 0, spH + 2.2, 0, 8); pal.add(fin);
  for (const [x, z] of [[-7, -7], [7, -7], [-7, 7], [7, 7]]) { for (let i = 0; i < 5; i++) { const rb = 1.8 - i * 0.3; const c = new THREE.Mesh(new THREE.CylinderGeometry(rb - 0.3, rb, 1.6, 4), gold); c.rotation.y = Math.PI / 4; c.position.set(x, top + 0.8 + i * 1.6, z); pal.add(c); } pal.add(T.sphere(0.35, gold, x, top + 8.4, z)); }
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; const gate = T.box(3.4, 6, 1.2, gold, Math.cos(a) * 12.5, PLAT_Y + 3, Math.sin(a) * 12.5); gate.rotation.y = -a; pal.add(gate); const door = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 3.4), glowGold); door.position.set(Math.cos(a) * 13.15, PLAT_Y + 2, Math.sin(a) * 13.15); door.rotation.y = -a + Math.PI / 2; pal.add(door); }
  // skyport ring around the spire (2026)
  const port = new THREE.Group(); pal.add(port); L.port = port;
  const deck = new THREE.Mesh(new THREE.TorusGeometry(9, 0.9, 6, 40), goldDim); deck.rotation.x = Math.PI / 2; deck.scale.z = 0.35; deck.position.y = top + 12; port.add(deck);
  const deckGlow = new THREE.Mesh(new THREE.TorusGeometry(9, 0.12, 6, 80), glowMat('#ffe0a0', 0.9)); deckGlow.rotation.x = Math.PI / 2; deckGlow.position.y = top + 12.35; port.add(deckGlow);
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; const pad = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.2, 24), glowMat('#ffd27a', 0.8)); pad.rotation.x = -Math.PI / 2; pad.position.set(Math.cos(a) * 9, top + 12.4, Math.sin(a) * 9); port.add(pad); }
  L.portY = top + 12.4;
  // ---- the ten towers with emblem lights
  L.towers = [];
  for (let i = 0; i < 10; i++) {
    const [x, , z] = towerPos(i), a = Math.atan2(z, x), H = 30 + (i % 3) * 2.5;
    const tg = new THREE.Group(); tg.position.set(x, PLAT_Y, z); st.add(tg);
    const tt = winTex(T, dark ? '#1a1e24' : '#221a2c', dark ? '#8a98a4' : '#ffd890', 11 + i, 4, 16);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 2.2, H, 8), new THREE.MeshStandardMaterial({ map: tt, emissiveMap: tt, emissive: new THREE.Color('#ffffff'), emissiveIntensity: dark ? 0.12 : 0.3, roughness: 0.5, metalness: 0.4 }));
    body.position.y = H / 2; tg.add(body);
    for (let k = 1; k <= 4; k++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(lerp(2.2, 1.3, k * 0.22) + 0.12, 0.16, 6, 24), gold); ring.rotation.x = Math.PI / 2; ring.position.y = H * k * 0.22; tg.add(ring); }
    tg.add(T.cone(1.6, 4.5, gold, 0, H + 2.2, 0, 8)); tg.add(T.sphere(0.4, gold, 0, H + 4.8, 0));
    const [nm, col] = MINISTRIES[i];
    const emM = new THREE.MeshBasicMaterial({ map: emblemTex(T, i, '#ffffff'), color: new THREE.Color(col), transparent: true, opacity: 1, depthWrite: false, side: THREE.DoubleSide });
    const em = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), emM); em.position.set(Math.cos(a) * 1.75, H - 4, Math.sin(a) * 1.75); em.lookAt(Math.cos(a) * 10, H - 4, Math.sin(a) * 10); tg.add(em);
    const halo = new THREE.Sprite(glowSpriteMat(T, col, 0.5)); halo.scale.set(9, 9, 1); halo.position.copy(em.position); tg.add(halo);
    const crownL = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(col) })); crownL.position.y = H + 0.4; tg.add(crownL);
    const beam = T.shaft(2.4, 90, col, 0.0); beam.position.y = H + 45; tg.add(beam); const beam2 = beam.clone(); beam2.rotation.y = Math.PI / 2; tg.add(beam2);
    L.towers.push({ g: tg, H, em, emM, halo, crownL, beam, beam2, col, name: nm, a });
  }
  // ---- vimanas: a fleet that rises from the skyport
  const vGold = new THREE.MeshStandardMaterial({ color: '#ffcf6a', metalness: 0.9, roughness: 0.25, envMapIntensity: 1.3, emissive: new THREE.Color('#5a3000'), emissiveIntensity: 0.3 });
  const vGlow = new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff0c0') });
  const vSpr = glowSpriteMat(T, '#ffc060', 0.55);
  L.fleet = []; const NF = o.fleet ?? (modern ? 34 : 0);
  for (let i = 0; i < NF; i++) { const v = vimana(T, { gold: vGold, glow: vGlow, sprite: vSpr, s: 0.55 + R() * 0.35 }); st.add(v); L.fleet.push({ v, ph: R(), ang: R() * 6.28, rad: 10 + R() * 50, sp: 0.06 + R() * 0.06, h: 20 + R() * 70, dir: R() > 0.5 ? 1 : -1 }); }
  L.vGold = vGold; L.vGlow = vGlow; L.vSpr = vSpr;
  { const isl = new THREE.Group(); st.scene.children.slice(mark).forEach((c) => isl.add(c)); st.add(isl); L.island = isl; }
  // ---- torches (ancient) and city fireflies / motes
  const pts = (n, color, size, fn) => { const geo = new THREE.BufferGeometry(), arr = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const p = fn(i); arr.set(p, i * 3); } geo.setAttribute('position', new THREE.BufferAttribute(arr, 3)); const m = new THREE.Points(geo, new THREE.PointsMaterial({ color: new THREE.Color(color), size, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })); st.add(m); return m; };
  L.torches = pts(260, '#ffa040', 0.9, (i) => { const s = spots[i % spots.length]; return [s.x + 1.4, s.y + 1.6, s.z + 0.4]; });
  L.island.add(L.torches);
  L.motes = pts(500, dark ? '#9ab0c0' : '#ffd890', 0.35, () => { const a = R() * 6.28, d = 20 + R() * 120; return [Math.cos(a) * d, 4 + R() * 50, Math.sin(a) * d]; });
  L.moteBase = Float32Array.from(L.motes.geometry.attributes.position.array);
  L.stars = pts(1400, '#ffffff', 0.9, () => { const a = R() * 6.28, el = 0.08 + R() * 1.3, d = 420; return [Math.cos(a) * Math.cos(el) * d, Math.sin(el) * d * 0.7 + 20, Math.sin(a) * Math.cos(el) * d]; });
  L.stars.material.opacity = dark ? 0.25 : era === 'ancient' ? 0.5 : 0.8; L.stars.material.sizeAttenuation = false; L.stars.material.size = 1.6;
  // a big moon behind for silhouette shots
  const moon = new THREE.Sprite(glowSpriteMat(T, era === 'ancient' ? '#ffcf90' : '#dfe8ff', 0.85)); moon.scale.set(46, 46, 1); moon.material.opacity = era === 'ancient' ? 0.3 : 0.5; moon.position.set(-260, 110, -330); st.add(moon); L.moon = moon;
  const moonCore = new THREE.Mesh(new THREE.CircleGeometry(9, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(era === 'ancient' ? '#ffe2b0' : '#eef2ff'), fog: false })); moonCore.position.copy(moon.position); moonCore.lookAt(0, 0, 0); st.add(moonCore);
  // ---- searchlights (dark era)
  L.search = [];
  if (dark && o.search !== false) for (let i = 0; i < 10; i++) { const cone = new THREE.Mesh(new THREE.ConeGeometry(9, 70, 24, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color('#cfe8ff'), transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); cone.geometry.translate(0, -35, 0); const piv = new THREE.Group(); piv.add(cone); const tw = L.towers[i]; piv.position.set(tw.g.position.x, PLAT_Y + tw.H - 1, tw.g.position.z); st.add(piv); L.search.push({ piv, cone, ph: i * 0.7 }); }
  // ---- lights (budget: 5 point lights)
  const pl = (c, i, d, x, y, z) => { const l = new THREE.PointLight(new THREE.Color(c), i, d, 1.6); l.position.set(x, y, z); st.add(l); return l; };
  L.palLight = pl(dark ? '#8aa0b8' : '#ffb860', dark ? 150 : 380, 90, 0, PLAT_Y + 16, 0);
  L.ringLights = [0, 1, 2, 3].map((k) => { const a = k * Math.PI / 2; return pl(dark ? '#6a7a8a' : '#ff9a4a', dark ? 120 : 380, 70, Math.cos(a) * 45, 18, Math.sin(a) * 45); });
  L.update = (t, u = {}) => updateLanka(L, t, u);
  L.setGrow(L.grow); updateLanka(L, 0, {});
  return L;
}
// growth (time-lapse): 0 = ancient lamp-lit, 1 = Lanka 2026
function setGrowImpl(L, k) {
  L.grow = k; const TH = L.THREE, m4 = new TH.Matrix4(), q = new TH.Quaternion(), v = new TH.Vector3(), sc = new TH.Vector3(), up = new TH.Vector3(0, 1, 0);
  L.spots.forEach((s, i) => {
    const gk = clamp(k * 1.6 - s.r * 0.6); const hm = lerp(0.001, s.h, ease.out(gk));
    q.setFromAxisAngle(up, s.ry); v.set(s.x, s.y, s.z); sc.set(s.w, Math.max(0.001, hm), s.dpt); m4.compose(v, q, sc); L.modI.setMatrixAt(i, m4);
    const ok = 1 - clamp(k * 1.3 - s.r * 0.3); const oh = Math.max(0.001, 1.6 * ok);
    sc.set(1.8 * (ok > 0.01 ? 1 : 0.001), oh, 1.8 * (ok > 0.01 ? 1 : 0.001)); m4.compose(v, q, sc); L.oldI.setMatrixAt(i, m4);
    const tall = s.h > 9 ? 1 : 0.001; v.set(s.x, s.y + hm, s.z); sc.set(s.w * tall, Math.max(0.001, tall * ease.out(gk) * (2 + s.h * 0.25)), s.dpt * tall); m4.compose(v, q, sc); L.spireI.setMatrixAt(i, m4);
    v.set(s.x, s.y + oh, s.z); sc.set(2.4 * (ok > 0.01 ? 1 : 0.001), Math.max(0.001, ok), 2.4 * (ok > 0.01 ? 1 : 0.001)); m4.compose(v, q, sc); L.roofI.setMatrixAt(i, m4);
  });
  L.modI.instanceMatrix.needsUpdate = L.oldI.instanceMatrix.needsUpdate = L.roofI.instanceMatrix.needsUpdate = L.spireI.instanceMatrix.needsUpdate = true;
  L.towers.forEach((tw, i) => { const gk = ease.out(clamp(k * 1.5 - i * 0.05)); tw.g.scale.set(1, Math.max(0.001, gk), 1); tw.g.visible = gk > 0.01; });
  L.port.visible = k > 0.6; L.port.scale.setScalar(Math.max(0.001, ease.outBack(prog(k, 0.6, 1))));
  L.torches.material.opacity = 1 - clamp(k * 1.4);
  L.fleet.forEach((f, i) => (f.v.visible = k > 0.7 + (i / L.fleet.length) * 0.3));
}
function updateLanka(L, t, u) {
  if (u.grow != null && u.grow !== L.grow) setGrowImpl(L, u.grow);
  // waves
  const p = L.ocean.geometry.attributes.position, a = p.array, b = L.oceanBase;
  for (let i = 0; i < a.length; i += 3) { const x = b[i], z = b[i + 2]; a[i + 1] = 0.55 * Math.sin(x * 0.045 + t * 0.9) + 0.35 * Math.sin(z * 0.06 - t * 1.25) + 0.22 * Math.sin((x + z) * 0.11 + t * 1.7); }
  p.needsUpdate = true;
  L.foam.forEach((f, k) => { const ph = (t * 0.16 + k / L.foam.length) % 1; const r = lerp(118, 79, ease.out(ph)); f.scale.set(r, r, 1); f.material.opacity = 0.06 * Math.sin(ph * Math.PI) * (u.foam ?? 1); });
  // towers: emblem lights (u.lit: array or number 0..1)
  L.towers.forEach((tw, i) => { const lit = Array.isArray(u.lit) ? (u.lit[i] ?? 0) : (u.lit ?? 0.55); const fl = 0.85 + 0.15 * Math.sin(t * 3 + i);
    tw.emM.opacity = 0.25 + 0.75 * lit; tw.halo.material.opacity = 0.12 + 0.5 * lit * fl; tw.halo.scale.setScalar(6 + 6 * lit); tw.crownL.scale.setScalar(0.6 + lit);
    const bm = (u.beams ?? 0) * lit; tw.beam.material.opacity = 0.07 * bm; tw.beam2.material.opacity = 0.07 * bm; });
  // fleet: spiral up out of the skyport, loop
  const rise = u.rise ?? 1;
  L.fleet.forEach((f, i) => { const ph = ((t * f.sp * rise) + f.ph) % 1; const ang = f.ang + f.dir * ph * 2.4; const r = lerp(9, f.rad + 14, ease.out(ph)); const y = lerp(L.portY + 0.6, L.portY + f.h, ease.in(Math.min(1, ph * 1.15)));
    f.v.position.set(Math.cos(ang) * r, y, Math.sin(ang) * r); f.v.rotation.set(0, -ang - f.dir * Math.PI / 2, 0.2 * f.dir); f.v.rotation.z = 0.25; });
  // motes drift
  const mp = L.motes.geometry.attributes.position, ma = mp.array, mb = L.moteBase; for (let i = 0; i < ma.length; i += 3) { ma[i] = mb[i] + Math.sin(t * 0.3 + i) * 2; ma[i + 1] = mb[i + 1] + ((t * 1.2 + i * 0.37) % 12) - 6; } mp.needsUpdate = true;
  L.torches.material.size = 0.8 + 0.25 * Math.sin(t * 13);
  L.search.forEach((s) => { s.piv.rotation.set(0.9 + 0.25 * Math.sin(t * 0.9 + s.ph), t * 0.5 + s.ph * 2.2, 0, 'YXZ'); s.cone.material.opacity = (u.search ?? 1) * 0.07; });
}
