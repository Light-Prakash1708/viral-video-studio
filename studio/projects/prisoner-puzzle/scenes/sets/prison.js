// sets/prison.js: "The Prisoner Puzzle" kit: cell-block set, three prisoners in a line facing a wall, mystery hats,
// guard with flashlight, the 60-second clock and the 2D logic cards. Vertical (9:16) framing first.
import { E, V, ease, clamp, lerp, rng, alpha, text, rr, glow, prog } from '/engine/core.js';
import { lifeStage } from './lifesim.js';
import { lamp, dust, sprite } from './fc.js';
import { person2 } from './cast.js';

export const RED = '#ff3b3b', AMBER = '#ffb43c', WHITE_HAT = '#f4f4f2', BLACK_HAT = '#16161a';
// prisoners stand on z: P3 (back) 2.4, P2 1.2, P1 (front) 0.0; the wall is at z = -1.2; everyone faces -z (toward the wall)
export const PZ = { 1: 0.0, 2: 1.2, 3: 2.4 }, WALLZ = -1.2;
const LOOKS = {
  1: { skin: '#c89070', hair3: 'buzz', hairColor: '#1a1210', outfit: 'hoodie', top: '#ff7a1a', pants: '#f06a14', rim: '#7ff0ff', faceStyle: 'pop', iris: '#4a8ad8' },
  2: { skin: '#f0c8a8', hair3: 'buzz', hairColor: '#7a4a2a', outfit: 'hoodie', top: '#ff7a1a', pants: '#f06a14', face: { freckles: true }, rim: '#7ff0ff', faceStyle: 'pop', iris: '#3aa06a' },
  3: { skin: '#9a6440', hair3: 'buzz', hairColor: '#120c0a', outfit: 'hoodie', top: '#ff7a1a', pants: '#f06a14', face: { stubble: true }, rim: '#7ff0ff', faceStyle: 'pop', iris: '#6a3a1a' },
};
// a bowler-style hat; state: 'mystery' (dark grey + glowing ?), 'white', 'black'
export function hat(T, o = {}) {
  const { THREE } = T, g = new THREE.Group();
  const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#3a3a44'), roughness: 0.45, clearcoat: 0.4 });
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.26, 32), m); crown.position.y = 0.13; crown.castShadow = true; g.add(crown);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), m); top.position.y = 0.26; top.scale.y = 0.35; g.add(top);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.025, 40), m); brim.castShadow = true; g.add(brim);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.222, 0.222, 0.05, 32), new THREE.MeshStandardMaterial({ color: '#7a1a1a', roughness: 0.6 })); band.position.y = 0.04; g.add(band);
  const qTex = T.canvasTex(256, 256, (c, W, H) => { c.clearRect(0, 0, W, H); c.fillStyle = '#ffcf5a'; c.shadowColor = '#ffcf5a'; c.shadowBlur = 30; c.font = '900 200px "Fredoka"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', W / 2, H / 2 + 10); });
  const q = new THREE.Sprite(new THREE.SpriteMaterial({ map: qTex, transparent: true, depthWrite: false })); q.scale.set(0.34, 0.34, 1); q.position.y = 0.62; g.add(q);
  g.set = (state, k = 1) => { const col = state === 'white' ? WHITE_HAT : state === 'black' ? BLACK_HAT : '#3a3a44'; m.color.set(col); m.emissive = new THREE.Color(state === 'white' ? '#3a3a3a' : '#000000'); q.visible = state === 'mystery'; q.material.opacity = k; };
  g.set(o.state || 'mystery'); return g;
}
export function prisoner(T, st, n, o = {}) {
  const p = person2(T, LOOKS[n], {}); p.position.set(o.x ?? 0, 0, o.z ?? PZ[n]); p.rotation.y = Math.PI; st.add(p);
  // number patch on the back + chest
  const tex = T.canvasTex(256, 128, (c, W, H) => { c.fillStyle = '#f4ecd8'; c.fillRect(0, 0, W, H); c.fillStyle = '#1a1410'; c.font = '900 92px "Fredoka"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('#' + n, W / 2, H / 2 + 4); });
  for (const z of [-0.168, 0.168]) { const pl = new T.THREE.Mesh(new T.THREE.PlaneGeometry(0.2, 0.1), new T.THREE.MeshBasicMaterial({ map: tex })); pl.position.set(0, 1.0, z); if (z < 0) pl.rotation.y = Math.PI; p.userData.body.add(pl); }
  const h = hat(T, { state: o.hat || 'mystery' }); h.position.y = 0.2; h.rotation.x = -0.12; p.userData.head.add(h); p.userData.hat = h;
  return p;
}
export function cellBlock(T, o = {}) {
  const { THREE } = T, mood = o.mood || 'cold';
  const st = lifeStage(T, { sky: ['#03141c', '#062430'], fogColor: '#04202a', fog: [6, 24], key: 0.9, keyColor: '#ffd8b0', keyPos: [-3, 9, 2], ambient: 0.7, ambientSky: '#8ac8d0', rim: mood === 'red' ? '#ff7a6a' : '#ffc890', rimIntensity: 1.3, fill: '#ff8ac0', focus: o.focus ?? 3, aperture: o.aperture ?? 0.003, maxblur: 0.012, beauty: o.beauty ?? 1.35 });
  { const back = new THREE.DirectionalLight(new THREE.Color(mood === 'red' ? '#ff3a5a' : '#38e8ff'), 2.6); back.position.set(-2, 4, 8); st.add(back); }  // cyan/teal from behind: outlines backs + hats, never the faces
  const conc = T.tiles('#1e3a44', 10, [6, 10]); const fl = T.ground(30, 30, '#1e3a44', conc); fl.material.roughness = 0.35; fl.material.metalness = 0.25; st.add(fl);
  const bricks = T.canvasTex(512, 512, (c, W, H) => { c.fillStyle = '#123038'; c.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 32) for (let x = (y / 32) % 2 ? -32 : 0; x < W; x += 64) { c.fillStyle = `hsl(190,${30 + ((x * 7 + y) % 12)}%,${18 + ((x * 3 + y * 5) % 8)}%)`; c.fillRect(x + 2, y + 2, 60, 28); }
    c.strokeStyle = 'rgba(230,220,200,.35)'; c.lineWidth = 4; for (let k = 0; k < 4; k++) { const bx = 180 + k * 70; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(bx + i * 10, 300); c.lineTo(bx + i * 10, 350); c.stroke(); } c.beginPath(); c.moveTo(bx - 6, 340); c.lineTo(bx + 40, 310); c.stroke(); } }, [3, 2]);
  const wall = T.box(10, 5, 0.3, T.mat('#ffffff', { map: bricks, roughness: 0.95 }), 0, 2.5, WALLZ - 0.15); st.add(wall);
  // side bars (cell fronts) + ceiling pipes
  for (const sx of [-2.2, 2.2]) for (let i = 0; i < 18; i++) st.add(T.cyl(0.025, 0.025, 3.2, T.mat('#5a5e66', { metalness: 0.8, roughness: 0.35 }), sx, 1.6, -1 + i * 0.32));
  for (const sx of [-2.2, 2.2]) for (const y of [0.1, 3.15]) st.add(T.box(0.08, 0.08, 6, T.mat('#4a4e56', { metalness: 0.8 }), sx, y, 1.7));
  st.add(T.box(6, 0.12, 0.12, T.mat('#3a3e46', { metalness: 0.7 }), 0, 3.6, 0.5)); { const pipe = T.cyl(0.06, 0.06, 7, T.mat('#4a4e56', { metalness: 0.7 }), 1.5, 3.7, 1.0); pipe.rotation.x = Math.PI / 2; st.add(pipe); }
  // hard top spotlights over each prisoner (the tension light)
  const spots = [];
  for (const n of [1, 2, 3]) { const L = new THREE.SpotLight(new THREE.Color(mood === 'red' ? '#ff5a4a' : '#ffb45a'), 30, 9, 0.42, 0.5, 1.5); L.position.set(0, 4.6, PZ[n]); L.target.position.set(0, 0, PZ[n]); L.castShadow = n === 1; st.add(L, L.target); spots.push(L);
    const cone = T.shaft(1.1, 4.4, mood === 'red' ? '#ff6a5a' : '#ffc070', 0.07); cone.position.set(0, 2.4, PZ[n]); st.add(cone); const fx = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.12, 20), T.mat('#2a2c30', { metalness: 0.6 })); fx.position.set(0, 4.65, PZ[n]); st.add(fx); }
  const d = dust(T, st, { n: 200, area: [-2, 2, 0.2, 4.2, -1, 3.5], color: '#ffd8a0', opacity: 0.5, size: 0.02 });
  // neon strip lights on both cell walls + a magenta exit glow (the viral teal/orange/magenta palette)
  for (const [sx, col] of [[-2.15, '#2ef0ff'], [2.15, '#ff3ad0']]) { st.add(T.box(0.05, 0.05, 6.5, T.mat(col, { emissive: col, emissiveIntensity: 1.0 }), sx, 3.05, 1.7)); const nl = new THREE.PointLight(new THREE.Color(col), 1.4, 4, 2); nl.position.set(sx * 0.9, 2.8, 2.6); st.add(nl); }

  return { stage: st, spots, tick: (t) => { d.tick(t); spots.forEach((L, i) => (L.intensity = 26 * (o.flicker && ((t * 7 + i * 3) % 5) < 0.12 ? 0.55 : 1))); } };
}
export function guard(T, st, pos, ry = 0) {
  const g = person2(T, { skin: '#b07a58', hair3: 'cap', capColor: '#1a2234', outfit: 'jacket', top: '#1e2a3e', pants: '#1a1e28', face: { mustache: true }, acc: ['badge'], s: 1.1, rim: '#ff5ad0', faceStyle: 'pop', iris: '#2a2a3a' }); g.position.set(...pos); g.rotation.y = ry; st.add(g);
  const fl = new T.THREE.SpotLight(new T.THREE.Color('#fff4d8'), 18, 8, 0.25, 0.4, 1.4); g.userData.hands[1].add(fl); fl.position.set(0, -0.05, 0.1); const tgt = new T.THREE.Object3D(); tgt.position.set(0, -0.6, 2); g.userData.hands[1].add(tgt); fl.target = tgt;
  return g;
}

// ---------------- 2D overlays ----------------
// the 60-second clock: compressed so it hits 0:00 exactly on "Time's up". tz = global time of "Time's up".
export function clock(g, gt, tz, o = {}) {
  const left = Math.max(0, 60 * (1 - gt / tz)), s = Math.ceil(left), urgent = left < 10;
  const x = E.W / 2, y = o.y ?? V(120, 230), a = o.a ?? 1; if (a <= 0) return;
  const pulse = urgent ? 1 + 0.08 * Math.max(0, Math.cos((left % 1) * Math.PI * 2)) : 1;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(pulse * (o.s ?? 1), pulse * (o.s ?? 1));
  rr(g, -V(150, 190), -V(58, 74), V(300, 380), V(116, 148), 28); g.fillStyle = 'rgba(8,6,10,.78)'; g.fill(); g.strokeStyle = alpha(left <= 0 ? RED : urgent ? RED : AMBER, 0.9); g.lineWidth = 4; g.stroke();
  // ring of 60 ticks
  for (let i = 0; i < 60; i++) { const on = i < s; g.fillStyle = on ? (urgent ? RED : AMBER) : 'rgba(255,255,255,.12)'; const bx = -V(132, 168) + (i % 30) * V(9, 11.4), by = (i < 30 ? -1 : 1) * V(46, 60); g.fillRect(bx, by - 2, V(6, 8), 4); }
  text(g, `0:${String(s).padStart(2, '0')}`, 0, V(6, 8), { size: V(70, 92), font: 'Fredoka', weight: 700, color: left <= 0 ? RED : '#ffffff', glow: urgent ? 22 : 8, glowColor: urgent ? RED : 'rgba(0,0,0,.6)' });
  g.restore();
}
export function hatIcon(g, x, y, s, state, a = 1) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s);
  const col = state === 'white' ? '#f4f4f2' : state === 'black' ? '#1a1a20' : '#4a4a54';
  g.fillStyle = col; g.strokeStyle = state === 'black' ? '#8a8a94' : 'rgba(0,0,0,.5)'; g.lineWidth = 4;
  rr(g, -40, -60, 80, 62, 14); g.fill(); g.stroke(); g.beginPath(); g.ellipse(0, 4, 70, 14, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#7a1a1a'; g.fillRect(-40, -14, 80, 12);
  if (state === 'mystery') text(g, '?', 0, -30, { size: 56, font: 'Fredoka', weight: 700, color: '#ffcf5a' });
  g.restore();
}
export function card(g, a, draw, o = {}) {
  if (a <= 0) return; const w = o.w ?? V(1100, 960), h = o.h ?? V(560, 700), x = (E.W - w) / 2, y = o.y ?? V(240, 150);
  g.save(); g.globalAlpha *= a; const dg = g.createLinearGradient(0, 0, 0, y + h + 120); dg.addColorStop(0, 'rgba(4,4,8,.6)'); dg.addColorStop(1, 'rgba(4,4,8,0)'); g.fillStyle = dg; g.fillRect(0, 0, E.W, y + h + 120); rr(g, x, y, w, h, 34); g.fillStyle = 'rgba(14,12,20,.94)'; g.fill(); g.strokeStyle = alpha(AMBER, 0.6); g.lineWidth = 3; g.stroke();
  draw(g, x, y, w, h); g.restore();
}
export function cross(g, x, y, r, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.strokeStyle = RED; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - r, y - r); g.lineTo(x + r, y + r); g.moveTo(x + r, y - r); g.lineTo(x - r, y + r); g.stroke(); g.restore(); }
export function grade(g, o = {}) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(0,200,220,.10)'; g.fillRect(0, 0, E.W, E.H); g.globalCompositeOperation = 'overlay'; const wg = g.createRadialGradient(E.W / 2, E.H * 0.45, 0, E.W / 2, E.H * 0.45, E.H * 0.6); wg.addColorStop(0, 'rgba(255,170,80,.16)'); wg.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = wg; g.fillRect(0, 0, E.W, E.H); g.restore(); const vg = g.createRadialGradient(E.W / 2, E.H * 0.45, Math.min(E.W, E.H) * 0.35, E.W / 2, E.H * 0.5, Math.max(E.W, E.H) * 0.72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(4,2,8,${o.v ?? 0.55})`); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H);
  if (o.red) { g.fillStyle = `rgba(255,40,30,${o.red})`; g.globalCompositeOperation = 'soft-light'; g.fillRect(0, 0, E.W, E.H); g.globalCompositeOperation = 'source-over'; } }
