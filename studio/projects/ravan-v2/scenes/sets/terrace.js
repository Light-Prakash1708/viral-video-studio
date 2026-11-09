// sets/terrace.js: the storytelling terrace. A grandfather (the storyteller) and a curious kid (the asker) sit on a
// carved stone terrace by a brass diya, with golden Lanka glowing across the water behind them. Replaces the clay room.
//   const S = storyTerrace(T, { era: 'dusk' | 'dark' }); S.kid, S.dadu, S.cam(local [x,y,z], look) , S.update(t)
import { lerp, clamp } from '/engine/core.js';
import { buildLanka } from './lanka.js';
import { person2, castLine } from './cast.js';

export function storyTerrace(T, o = {}) {
  const { THREE } = T;
  const L = buildLanka(T, { era: o.era || 'dusk', fov: o.fov || 34, fleet: o.fleet ?? 10, fog: o.era === 'dark' ? [120, 520] : [140, 620] });
  const st = L.stage, SC = 3, root = new THREE.Group(); root.position.set(0, 3.6, 172); root.scale.setScalar(SC); st.add(root);
  const stoneM = T.mat(o.era === 'dark' ? '#5a5a62' : '#c89a6a', { roughness: 0.8 }), darkStone = T.mat(o.era === 'dark' ? '#3a3a42' : '#8a6040', { roughness: 0.85 });
  const brass = new THREE.MeshStandardMaterial({ color: '#e0a840', metalness: 0.85, roughness: 0.3 });
  // floor with an inlaid rug
  root.add(T.box(9, 0.3, 6, stoneM, 0, -0.15, 0));
  const rugT = T.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#8a1a2a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e8b040'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28); g.lineWidth = 4; g.strokeRect(34, 34, w - 68, h - 68);
    g.fillStyle = '#e8b040'; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.beginPath(); g.ellipse(128 + Math.cos(a) * 46, 128 + Math.sin(a) * 46, 22, 9, a, 0, 7); g.fill(); } g.beginPath(); g.arc(128, 128, 18, 0, 7); g.fill(); });
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.4), new THREE.MeshStandardMaterial({ map: rugT, roughness: 0.95 })); rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.006, 0.3); root.add(rug);
  // low balustrade at the back with small lamps (kept low so Lanka stays visible)
  for (let i = -8; i <= 8; i++) root.add(T.cyl(0.06, 0.07, 0.42, stoneM, i * 0.5, 0.21, -2.6, 8));
  root.add(T.box(9, 0.1, 0.24, darkStone, 0, 0.47, -2.6));
  const lampPts = []; for (let i = -8; i <= 8; i += 2) lampPts.push(i * 0.5, 0.58, -2.6);
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lampPts, 3));
  root.add(new THREE.Points(lg, new THREE.PointsMaterial({ color: new THREE.Color('#ffc060'), size: 0.12, transparent: true, opacity: 0.95 })));
  // carved pillars + scalloped arch framing the view (edges of frame)
  for (const x of [-3.9, 3.9]) { root.add(T.box(0.5, 0.3, 0.5, darkStone, x, 0.15, -1.2)); root.add(T.cyl(0.17, 0.2, 3.6, stoneM, x, 2.0, -1.2, 12)); for (const y of [0.6, 1.4, 2.6, 3.5]) root.add(T.cyl(0.24, 0.24, 0.1, brass, x, y, -1.2, 12)); }
  for (let i = 0; i < 9; i++) { const u = i / 8, x = lerp(-3.9, 3.9, u), y = 3.75 + 0.35 * Math.sin(u * Math.PI); const lobe = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.07, 8, 16, Math.PI), stoneM); lobe.position.set(x, y, -1.2); lobe.rotation.z = Math.PI; root.add(lobe); }
  root.add(T.box(8.4, 0.3, 0.3, darkStone, 0, 4.25, -1.2));
  // marigold garlands hanging from the arch
  const mg = new THREE.SphereGeometry(0.05, 6, 5), mgM = [T.mat('#ff9a10'), T.mat('#ffcf20')];
  for (const sx of [-1, 1]) for (let i = 0; i < 18; i++) { const u = i / 17; const b = new THREE.Mesh(mg, mgM[i % 2]); b.position.set(sx * lerp(3.7, 2.2, u), 4.05 - Math.sin(u * Math.PI) * 0.7, -1.15); root.add(b); }
  // brass diya with a living flame and a warm light
  const diya = new THREE.Group(); diya.position.set(0, 0, 0.35); root.add(diya);
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), brass); bowl.position.y = 0.12; diya.add(bowl); diya.add(T.cyl(0.06, 0.09, 0.08, brass, 0, 0.04, 0, 12));
  const ft = T.canvasTex(64, 128, (g) => { const gr = g.createRadialGradient(32, 84, 2, 32, 76, 40); gr.addColorStop(0, 'rgba(255,255,230,1)'); gr.addColorStop(0.35, 'rgba(255,190,80,.9)'); gr.addColorStop(1, 'rgba(255,120,30,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(32, 8); g.quadraticCurveTo(58, 80, 32, 120); g.quadraticCurveTo(6, 80, 32, 8); g.fill(); });
  const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: ft, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); flame.scale.set(0.12, 0.24, 1); flame.position.y = 0.26; diya.add(flame);
  const pl = new THREE.PointLight(new THREE.Color('#ffb060'), 26, 12, 1.4); pl.position.set(0, 0.5 * SC, 0); diya.add(pl);
  // key/fill for faces (directional: independent of the 3x scale)
  const fill = new THREE.DirectionalLight(new THREE.Color(o.era === 'dark' ? '#c8d8ff' : '#ffe2c8'), o.era === 'dark' ? 0.9 : 1.25); fill.position.set(20, 30, 260); fill.target.position.set(0, 4, 172); st.add(fill, fill.target);
  // the cast
  const kid = person2(T, { skin: '#c8906a', hair3: 'swoop', hairColor: '#1a1210', outfit: 'tee', top: '#ff8a2a', pants: '#2a3a6a', faceStyle: 'pop', iris: '#5a3a22', rim: '#ffd0a0', rimOpacity: 0.35, s: 0.86 });
  const dadu = person2(T, 'elder', { faceStyle: 'pop', iris: '#4a3020', prop: 'none', rimOpacity: 0.3, top: '#f4ecdc', s: 1.02 });
  // a shawl for the storyteller
  const stoleM = T.mat('#e07a20'); const shawl = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.022, 8, 24), stoleM); shawl.rotation.x = Math.PI / 2 + 0.2; shawl.position.set(0, 1.19, 0.01); dadu.userData.body.add(shawl);
  for (const x of [-0.09, 0.09]) { const b = T.box(0.06, 0.42, 0.02, stoleM, x, 0.98, 0.18); b.rotation.z = x * 0.6; dadu.userData.body.add(b); }
  kid.position.set(-0.95, 0, 0.45); kid.rotation.y = 0.38; dadu.position.set(0.95, 0, 0.3); dadu.rotation.y = -0.38;
  kid.set({ sit: true }); dadu.set({ sit: true }); root.add(kid, dadu);
  // cushions
  for (const [x, z] of [[-0.95, 0.45], [0.95, 0.3]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.12, 20), T.mat(x < 0 ? '#2a6a8a' : '#c8902a')); c.position.set(x, 0.06, z); root.add(c); }
  if (L.moon) L.moon.visible = false;
  const S = { stage: st, L, root, kid, dadu, flame, pl, SC };
  // camera in terrace-local units
  S.cam = (pos, look) => { const v = new THREE.Vector3(...pos).multiplyScalar(SC).add(root.position), w = new THREE.Vector3(...look).multiplyScalar(SC).add(root.position); st.camera.position.copy(v); st.camera.lookAt(w); };
  S.update = (t, u = {}) => { L.update(t + 30, { lit: u.lit ?? 0.7, beams: u.beams ?? 0.3, rise: 0.5 }); const f = 1 + 0.12 * Math.sin(t * 17) + 0.08 * Math.sin(t * 29); flame.scale.set(0.12 * f, 0.24 * (2 - f), 1); pl.intensity = 26 * f; };
  // acting: who speaks (kid lines are the asker), expressions, talking mouth, glances
  S.act = (t, k) => {
    const talking = t > (k.talk0 ?? 0.05) && t < (k.talk1 ?? 0);
    const kx = talking && Math.floor(t * 8.5) % 2 === 0 ? 'talk' : (t < (k.kidSwitch ?? 99) ? k.kid : (k.kid2 || k.kid));
    castLine(kid, t, [[0, kx]], { blinkSeed: 2, pose: { breathe: t, look: k.kidLook || [0.75, 0.05], tilt: k.kidTilt ?? 0.08, nod: talking ? 0.04 * Math.sin(t * 9) : -0.04, armL: k.kidArm ?? 0.15, armR: talking ? 0.35 + 0.2 * Math.sin(t * 5) : 0.15, reachR: talking ? 0.5 : 0.1 } });
    const dt = t > (k.daduSwitch ?? 99) ? (k.dadu2 || k.dadu) : k.dadu;
    castLine(dadu, t, [[0, dt]], { blinkSeed: 5, pose: { breathe: t + 1, look: k.daduLook || [-0.75, 0], tilt: -0.05, nod: k.daduNod ? 0.08 * Math.max(0, Math.sin(t * 3)) : 0, armL: k.daduGesture ? 0.4 + 0.15 * Math.sin(t * 2.2) : 0.12, reachL: k.daduGesture ? 0.7 : 0.1, armR: 0.12 } });
  };
  return S;
}
