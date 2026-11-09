// sets/film.js: "The Last Human Job on Earth" kit: robot M-7, Platform 4 tea stall + old station, Tea-O-Mat kiosk,
// passing bullet train, hospital room with live ECG, ministry wall screen, story props, HUD + report terminal overlays.
import { E, V, ease, clamp, lerp, rng, alpha, text, rr, glow, prog } from '/engine/core.js';
import { lamp, dust, sprite, skyTex, SKIES, shaftAt, bokeh } from './fc.js';
import { person2 } from './cast.js';

export const CY = '#7fe8ff';
// extra fonts for this film (handwritten note + Hindi signage), loaded before any texture is drawn
for (const [fam, w, file] of [['Caveat', '700', 'caveat/files/caveat-latin-700-normal.woff2'], ['Noto Sans Devanagari', '900', 'noto-sans-devanagari/files/noto-sans-devanagari-devanagari-900-normal.woff2'], ['Noto Sans Devanagari', '800', 'noto-sans-devanagari/files/noto-sans-devanagari-devanagari-800-normal.woff2']]) {
  try { const ff = new FontFace(fam, `url(/node_modules/@fontsource/${file})`, { weight: w }); await ff.load(); document.fonts.add(ff); } catch (e) { console.log('font missing', fam); } }
// ---------------- the cast ----------------
export const HARI = { skin: '#e2b896', hair3: 'short', hairColor: '#f2f2f0', outfit: 'apron', top: '#a8443a', apron: '#2a3a4a', pants: '#3a3a44', glasses: true, face: { mustache: 'big' }, s: 0.97, rim: '#ffd8a0' };  // Walt
export const BOSE = { skin: '#e8c4a4', hair3: 'sidepart', hairColor: '#b8b8bc', outfit: 'cardigan', top: '#6a5a8a', pants: '#3a3a44', glasses: true, s: 1.0, rim: '#c8b8ff' };
export const ARJUN = { skin: '#a87452', hair3: 'curlymop', hairColor: '#1c1410', outfit: 'hoodie', top: '#5a6470', pants: '#2a2a32', face: { stubble: true }, s: 1.03, rim: '#a8d8ff' };
export const MEERA = { skin: '#9a6a4a', hair3: 'twobuns', hairColor: '#1a1210', outfit: 'hoodie', top: '#f0a040', pants: '#2a3a6a', acc: ['backpack'], s: 0.66, face: { lashes: true }, rim: '#ffb0c8' };
export const MEERA_ADULT = { skin: '#9a6a4a', hair3: 'braid', hairColor: '#1a1210', outfit: 'apron', top: '#d8507a', apron: '#f2e6d0', pants: '#3a3046', face: { lashes: true }, acc: ['earrings'], s: 1.0, rim: '#ffb0c8' };
export const CUSTOMERS = [
  { skin: '#d8a888', hair3: 'bun', hairColor: '#4a3a32', outfit: 'cardigan', top: '#2a8a6a' }, { skin: '#9a6a4a', hair3: 'turban', capColor: '#e07a20', outfit: 'shirt', top: '#e8e4da', face: { mustache: true } },
  { skin: '#e0b898', hair3: 'cap', capColor: '#c0392b', outfit: 'tee', top: '#3a6ac8' }, { skin: '#b07a58', hair3: 'short', hairColor: '#2a1c16', outfit: 'jacket', top: '#4a3a2a' },
  { skin: '#c89070', hair3: 'long', hairColor: '#2a1810', outfit: 'cardigan', top: '#e0a040' }, { skin: '#8a5a3a', hair3: 'buzz', hairColor: '#1a1210', outfit: 'plaid', top: '#2a6a4a' },
  { skin: '#f0c8a8', hair3: 'hijab', capColor: '#6a4a8a', outfit: 'kurta', top: '#6a4a8a' }, { skin: '#c8987a', hair3: 'beanie', capColor: '#3a3a44', outfit: 'hoodie', top: '#a03a3a' },
  { skin: '#a8704a', hair3: 'pony', hairColor: '#1c1410', outfit: 'tee', top: '#f0c030' }, { skin: '#d0a07a', hair3: 'grey', hairColor: '#d8d8dc', outfit: 'shirt', top: '#7a9ab8', glasses: true },
];
export const life = (p, t, seed, o = {}) => p.set({ breathe: t + seed, expr: o.expr ?? (((t + seed * 1.37) % 3.4) < 0.12 ? 'blink' : (p.userData.restExpr || 'neutral')), ...o });

// ---------------- robot M-7 ----------------
const FACES = {};
function robotFace(T, kind, col = CY) {
  const key = kind + col; if (FACES[key]) return FACES[key];
  FACES[key] = T.canvasTex(512, 256, (g, W, H) => {
    g.clearRect(0, 0, W, H); g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round'; g.shadowColor = col; g.shadowBlur = 24;
    const L = W * 0.33, R = W * 0.67, y = H * 0.46;
    const eye = (x, w = 62, h = 86, dy = 0) => { rr(g, x - w / 2, y - h / 2 + dy, w, h, 26); g.fill(); };
    switch (kind) {
      case 'blink': g.lineWidth = 16; for (const x of [L, R]) { g.beginPath(); g.moveTo(x - 34, y); g.lineTo(x + 34, y); g.stroke(); } break;
      case 'happy': g.lineWidth = 18; for (const x of [L, R]) { g.beginPath(); g.arc(x, y + 22, 34, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } break;
      case 'sad': g.lineWidth = 16; for (const x of [L, R]) { eye(x, 58, 50, 18); const k = x < W / 2 ? 1 : -1; g.beginPath(); g.moveTo(x - 40, y - 40 + k * 14); g.lineTo(x + 40, y - 40 - k * 14); g.stroke(); } break;
      case 'curious': eye(L, 54, 64, 8); eye(R, 72, 100, -6); break;
      case 'scan': eye(L); eye(R); g.globalAlpha = 0.5; g.fillRect(40, H * 0.78, W - 80, 10); g.globalAlpha = 1; break;
      case 'error': g.lineWidth = 16; for (const x of [L, R]) { g.beginPath(); g.moveTo(x - 30, y - 30); g.lineTo(x + 30, y + 30); g.moveTo(x + 30, y - 30); g.lineTo(x - 30, y + 30); g.stroke(); } break;
      case 'loading': for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(W / 2 - 70 + i * 70, y, 18, 0, 7); g.fill(); } break;
      case 'soft': eye(L, 62, 66, 10); eye(R, 62, 66, 10); g.globalAlpha = 0.35; g.fillStyle = '#ff9ab0'; for (const x of [L - 50, R + 50]) { g.beginPath(); g.ellipse(x, y + 52, 34, 14, 0, 0, 7); g.fill(); } g.globalAlpha = 1; break;
      default: eye(L); eye(R);
    }
  });
  return FACES[key];
}
export function robot(T, o = {}) {
  const { THREE } = T, root = new THREE.Group(), g = new THREE.Group(); root.add(g); g.scale.setScalar(o.s || 1);
  const white = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(o.color || '#eef1f4'), roughness: 0.28, clearcoat: 0.9, clearcoatRoughness: 0.2, metalness: 0.05 });
  const grey = new THREE.MeshStandardMaterial({ color: new THREE.Color('#8a929e'), roughness: 0.35, metalness: 0.7 });
  const dark = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#0c1018'), roughness: 0.08, clearcoat: 1, metalness: 0.2 });
  const glowM = new THREE.MeshBasicMaterial({ color: new THREE.Color(o.glow || CY) });
  const M = (geo, m, x = 0, y = 0, z = 0) => { const k = new THREE.Mesh(geo, m); k.position.set(x, y, z); k.castShadow = true; g.add(k); return k; };
  // hover base + glow ring
  M(new THREE.CylinderGeometry(0.2, 0.27, 0.14, 32), white, 0, 0.2, 0); const ring = M(new THREE.TorusGeometry(0.235, 0.018, 8, 40), glowM, 0, 0.12, 0); ring.rotation.x = Math.PI / 2;
  M(new THREE.CylinderGeometry(0.17, 0.2, 0.5, 32), white, 0, 0.52, 0); M(new THREE.CylinderGeometry(0.175, 0.175, 0.05, 32), grey, 0, 0.78, 0);
  // torso + chest panel
  const torso = M(new THREE.CapsuleGeometry(0.22, 0.26, 8, 24), white, 0, 1.0, 0); torso.scale.set(1, 1, 0.78);
  const chest = T.canvasTex(256, 192, (c, W, H) => { c.fillStyle = '#0c1018'; rr(c, 0, 0, W, H, 40); c.fill(); c.fillStyle = o.glow || CY; c.font = '900 64px "Nunito"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.label || 'M-7', W / 2, H * 0.42); c.globalAlpha = 0.7; for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(W / 2 - 60 + i * 30, H * 0.8, 6, 0, 7); c.fill(); } });
  const cp = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.15), new THREE.MeshBasicMaterial({ map: chest, transparent: true })); cp.position.set(0, 1.05, 0.176); g.add(cp);
  // neck + head with screen face
  M(new THREE.CylinderGeometry(0.05, 0.06, 0.12, 16), grey, 0, 1.32, 0);
  const head = new THREE.Group(); head.position.y = 1.55; g.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.24, 40, 28), white); skull.scale.set(1.18, 0.92, 1.0); skull.castShadow = true; head.add(skull);
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.242, 40, 24, Math.PI / 2 - 0.95, 1.9, 0.75, 1.5), dark); visor.scale.copy(skull.scale); head.add(visor);
  const faceM = new THREE.MeshBasicMaterial({ map: robotFace(T, 'neutral', o.glow), transparent: true, depthWrite: false });
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.245, 40, 24, Math.PI / 2 - 0.8, 1.6, 0.9, 1.2), faceM); face.scale.copy(skull.scale); head.add(face);
  for (const s of [-1, 1]) { const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 24), grey); ear.rotation.z = Math.PI / 2; ear.position.set(s * 0.285, 0, 0); head.add(ear); const er = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 6, 24), glowM); er.rotation.y = Math.PI / 2; er.position.set(s * 0.318, 0, 0); head.add(er); }
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16), grey); ant.position.set(0.1, 0.27, -0.02); head.add(ant); const tip = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 10), glowM.clone()); tip.position.set(0.1, 0.36, -0.02); head.add(tip);
  // arms (pivot at shoulders), mitten hands with fingers
  const arms = [-1, 1].map((sd) => { const p = new THREE.Group(); p.position.set(0.27 * sd, 1.18, 0); g.add(p); p.add(new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), grey));
    const up = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.32, 6, 14), white); up.position.y = -0.22; up.castShadow = true; p.add(up);
    const hand = new THREE.Group(); hand.position.y = -0.45; p.add(hand); hand.add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), grey));
    for (let f = 0; f < 3; f++) { const fi = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.05, 4, 8), grey); fi.position.set((f - 1) * 0.025, -0.06, 0.02); hand.add(fi); }
    p.rotation.z = 0.12 * sd; return p; });
  const groundGlow = sprite(T, { add: (m) => g.add(m) }, [0, 0.02, 0], [0.9, 0.9, 1], o.glow || CY, 0.25);
  root.userData = { head, face, arms, hands: arms.map((a) => a.children[2]), body: g, torso, tip, ring };
  let cur = 'neutral';
  root.set = (s = {}) => {
    if (s.face && s.face !== cur) { faceM.map = robotFace(T, s.face, s.faceColor || o.glow); faceM.needsUpdate = true; cur = s.face; }
    if (s.look) { face.rotation.y = clamp(s.look[0], -1, 1) * 0.3; face.rotation.x = -clamp(s.look[1] || 0, -1, 1) * 0.2; }
    if (s.tilt != null) head.rotation.z = s.tilt; if (s.nod != null) head.rotation.x = s.nod; if (s.turn != null) head.rotation.y = s.turn;
    if (s.armL != null) arms[0].rotation.z = -s.armL - 0.12; if (s.armR != null) arms[1].rotation.z = s.armR + 0.12;
    if (s.reachL != null) arms[0].rotation.x = -s.reachL; if (s.reachR != null) arms[1].rotation.x = -s.reachR;
    if (s.hover != null) { g.position.y = 0.04 + Math.sin(s.hover * 2.1) * 0.025; tip.material.color.set(((s.hover * 1.3) % 1) < 0.15 ? '#ffffff' : (o.glow || CY)); }
    return root;
  };
  root.set({ hover: 0 });
  return root;
}
export const blinkFace = (t, base = 'neutral', seed = 0) => (((t + seed * 1.7) % 3.1) < 0.12 ? 'blink' : base);

// ---------------- props for hands ----------------
export function hold(T, ch, name, hand = 1) {
  const { THREE } = T, p = new THREE.Group(), m = (c, o = {}) => T.mat(c, { roughness: 0.5, ...o });
  const add = (geo, mat, x = 0, y = 0, z = 0) => { const k = new THREE.Mesh(geo, mat); k.position.set(x, y, z); k.castShadow = true; p.add(k); return k; };
  if (name === 'kettle') { const gl = new THREE.MeshPhysicalMaterial({ color: '#e8f0f4', transparent: true, opacity: 0.35, roughness: 0.05 }); add(new THREE.CylinderGeometry(0.075, 0.09, 0.2, 20), gl, 0, -0.12, 0.06); add(new THREE.CylinderGeometry(0.07, 0.085, 0.11, 20), m('#3a2214'), 0, -0.16, 0.06); add(new THREE.CylinderGeometry(0.08, 0.078, 0.04, 20), m('#1a1a1e'), 0, -0.01, 0.06); const hd = add(new THREE.TorusGeometry(0.05, 0.012, 6, 16, Math.PI), m('#1a1a1e'), -0.09, -0.1, 0.06); hd.rotation.z = Math.PI / 2; }
  if (name === 'glass' || name === 'cocoa') { add(new THREE.CylinderGeometry(0.04, 0.036, 0.095, 18), m('#f4f2ee', { roughness: 0.3 }), 0, -0.06, 0.05); add(new THREE.CylinderGeometry(0.036, 0.036, 0.005, 18), m(name === 'cocoa' ? '#6a3a24' : '#3a2214'), 0, -0.014, 0.05); const hd = add(new THREE.TorusGeometry(0.022, 0.007, 6, 14), m('#f4f2ee'), 0.045, -0.06, 0.05);
    if (name === 'cocoa') for (let i = 0; i < 5; i++) add(new THREE.BoxGeometry(0.016, 0.014, 0.016), m('#ffffff'), Math.cos(i * 1.3) * 0.02, -0.006, 0.05 + Math.sin(i * 1.3) * 0.02).rotation.y = i; }
  if (name === 'cloth') { add(new THREE.BoxGeometry(0.16, 0.12, 0.02), m('#e8e0c8'), 0, -0.08, 0.05).rotation.z = 0.3; }
  if (name === 'note') { add(new THREE.PlaneGeometry(0.12, 0.09), new THREE.MeshBasicMaterial({ color: '#fff6dc', side: THREE.DoubleSide }), 0, -0.07, 0.06); }
  if (name === 'tablet') { add(new THREE.BoxGeometry(0.2, 0.14, 0.01), m('#1a1a22'), 0, -0.06, 0.07).rotation.x = -0.6; const s = add(new THREE.PlaneGeometry(0.18, 0.12), new THREE.MeshBasicMaterial({ color: CY }), 0, -0.058, 0.077); s.rotation.x = -0.6; }
  if (name === 'sign') { const tex = T.canvasTex(512, 256, (c, W, H) => { c.fillStyle = '#f4ecd8'; c.fillRect(0, 0, W, H); c.strokeStyle = '#3a2a1a'; c.lineWidth = 10; c.strokeRect(8, 8, W - 16, H - 16); c.fillStyle = '#c0392b'; c.font = '900 62px "Nunito"'; c.textAlign = 'center'; c.fillText('HELP WANTED', W / 2, 105); c.fillStyle = '#2a1a10'; c.font = '800 48px "Nunito"'; c.fillText('Humans only.', W / 2, 185); });
    add(new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }), 0, -0.1, 0.08); }
  ch.userData.hands[hand].add(p); return p;
}

// ---------------- Platform 4: old station + Hari's tea stall ----------------
export function signTex(T, lines, o = {}) { return T.canvasTex(o.w || 1024, o.h || 384, (g, W, H) => { g.fillStyle = o.bg || '#f2c640'; g.fillRect(0, 0, W, H); g.strokeStyle = o.border || '#1a1410'; g.lineWidth = 14; g.strokeRect(10, 10, W - 20, H - 20);
  lines.forEach(([str, size, col, y, font], i) => { g.fillStyle = col || '#1a1410'; g.font = `900 ${size}px "${font || 'Nunito'}", "Nunito"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, W / 2, y * H); }); }); }
export function station(T, st, o = {}) {
  const { THREE } = T, R = rng(o.seed || 4), out = { tick: [] };
  const mat = (c, x = {}) => T.mat(c, { roughness: 0.85, ...x });
  const B = (w, h, d, c, x, y, z, x2) => { const b = T.box(w, h, d, typeof c === 'string' ? mat(c, x2) : c, x, y, z); st.add(b); return b; };
  // platform (top at y=0), edge, yellow line, tracks below
  const pf = B(40, 1.0, 6.4, mat('#9a948a'), 0, -0.5, 0.0); pf.material.map = T.tiles('#a29c90', 20, [20, 4]); pf.material.needsUpdate = true;
  B(40, 0.02, 0.18, '#f0c030', 0, 0.011, 2.95); B(40, 0.25, 0.3, '#6a645c', 0, -0.12, 3.1);
  B(60, 0.1, 6, '#4a4038', 0, -1.05, 5.8); for (const z of [5.0, 6.4]) B(60, 0.08, 0.08, mat('#9aa0a8', { metalness: 0.8, roughness: 0.3 }), 0, -0.95, z);
  for (let i = 0; i < 50; i++) B(0.25, 0.06, 2.0, '#5a4a3a', -30 + i * 1.2, -0.99, 5.7);
  // station wall with arches, windows, posters, clock, PLATFORM 4 board
  B(40, 5.2, 0.4, mat('#c8784a'), 0, 2.6, -3.2); B(40, 0.35, 0.5, '#e8dcc0', 0, 5.1, -3.0); B(40, 0.6, 0.5, '#e8dcc0', 0, 0.3, -3.0);
  for (let i = -4; i <= 4; i++) { if (i === 0) continue; const x = i * 4; B(1.8, 2.6, 0.1, '#2a2a34', x, 2.4, -2.98); B(2.0, 0.2, 0.15, '#e8dcc0', x, 3.8, -2.95); }
  const pfSign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.9), new THREE.MeshBasicMaterial({ map: signTex(T, [['TRACK 4', 170, '#1a1410', 0.45], ['DEPARTURES  ·  NO SERVICE', 56, '#1a1410', 0.82]]) }));
  pfSign.position.set(-4.6, 3.3, 1.2); st.add(pfSign); B(0.04, 0.8, 0.04, '#2a2a30', -5.6, 4.2, 1.2); B(0.04, 0.8, 0.04, '#2a2a30', -3.6, 4.2, 1.2);
  const clockTex = T.canvasTex(256, 256, (g, W, H) => { g.fillStyle = '#f4efe0'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = '#1a1410'; g.lineWidth = 10; g.stroke(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.lineWidth = 6; g.beginPath(); g.moveTo(128 + Math.sin(a) * 100, 128 - Math.cos(a) * 100); g.lineTo(128 + Math.sin(a) * 86, 128 - Math.cos(a) * 86); g.stroke(); } g.lineWidth = 9; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 50); g.stroke(); g.lineWidth = 12; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 196); g.stroke(); });
  const clock = new THREE.Mesh(new THREE.CircleGeometry(0.45, 32), new THREE.MeshBasicMaterial({ map: clockTex })); clock.position.set(3.2, 3.4, -2.97); st.add(clock);
  for (let i = 0; i < 5; i++) { const c = ['#c0392b', '#2a6ac8', '#f0c030', '#2a8a5a', '#8a3a8a'][i]; B(0.7, 1.0, 0.04, c, 6 + i * 1.1 - 2, 2.2 + (i % 2) * 0.15, -2.97); }
  // canopy roof on iron columns
  B(40, 0.18, 6.6, mat('#5a6a5a', { metalness: 0.3 }), 0, 4.75, -0.2); for (let i = -4; i <= 4; i++) { const x = i * 4 + 2; B(0.14, 4.7, 0.14, mat('#2f5a4a', { metalness: 0.5, roughness: 0.5 }), x, 2.35, 2.2); B(0.5, 0.12, 0.5, '#2f5a4a', x, 4.6, 2.2); }
  // benches, bins, a weighing machine, scattered leaves
  for (const x of [-7.5, 7.5]) { B(1.6, 0.06, 0.45, '#7a5030', x, 0.45, 1.0); B(1.6, 0.45, 0.06, '#7a5030', x, 0.7, 0.78); for (const dx of [-0.7, 0.7]) B(0.06, 0.45, 0.4, '#2a2a30', x + dx, 0.22, 1.0); }
  B(0.5, 1.6, 0.4, '#c0392b', 9.5, 0.8, -2.5); B(0.4, 0.4, 0.05, '#f4efe0', 9.5, 1.2, -2.28);
  for (let i = 0; i < 40; i++) { const l = B(0.08, 0.005, 0.05, R() < 0.5 ? '#b88a4a' : '#8a6a3a', -12 + R() * 24, 0.004, -2 + R() * 4.6); l.rotation.y = R() * 6; }
  // across the tracks: fence, street, the Tea-O-Mat glowing
  B(60, 1.2, 0.05, mat('#3a3a40', { metalness: 0.6 }), 0, -0.4, 8.2); B(60, 0.05, 8, '#3a3a44', 0, -1.0, 12);
  out.kiosk = teaomat(T, st, [3.2, -1.0, 9.4], Math.PI);
  // city far behind (opposite side), soft
  const sky = new THREE.Mesh(new THREE.CylinderGeometry(45, 45, 30, 48, 1, true, -Math.PI * 0.2, Math.PI * 1.4), new THREE.MeshBasicMaterial({ map: skyTex(T, o.sky || SKIES.golden, { skyline: 0.7, skyH: 120, lit: o.lit ?? 0.2, w: 2048, seed: 3 }), side: THREE.BackSide, fog: false })); sky.position.set(0, 8, 0); sky.rotation.y = Math.PI; st.add(sky);
  // morning light shafts + dust
  for (let i = 0; i < 4; i++) shaftAt(T, st, [-3 + i * 2.4, 2.6, 0.5], [0, 0, 0.5], 1.1, 5, '#ffd8a0', 0.035);
  const d = dust(T, st, { n: 160, area: [-6, 6, 0.2, 4, -2.5, 3], color: '#ffe0b0', opacity: 0.55 }); out.tick.push((t) => d.tick(t));
  out.stall = teaStall(T, st, o);
  out.tickAll = (t) => { out.tick.forEach((f) => f(t)); out.stall.tick(t); out.kiosk.tick(t); };
  return out;
}
export function teaStall(T, st, o = {}) {
  const { THREE } = T, out = { cups: [] }, wood = T.mat('#8a5a34', { roughness: 0.8 }); wood.map = T.planks('#8a5a34', 8, [2, 1]);
  const G = new THREE.Group(); G.position.set(...(o.stallPos || [0, 0, -1.6])); st.add(G);
  const B = (w, h, d, m, x, y, z) => { const b = T.box(w, h, d, typeof m === 'string' ? T.mat(m, { roughness: 0.8 }) : m, x, y, z); G.add(b); return b; };
  B(2.6, 2.6, 0.1, T.mat('#3a7a9a', { roughness: 0.9 }), 0, 1.3, -0.75); for (const s of [-1, 1]) B(0.1, 2.6, 1.5, T.mat('#357090'), s * 1.3, 1.3, 0);
  B(2.4, 1.0, 0.6, wood, 0, 0.5, 0.35); B(2.5, 0.06, 0.7, T.mat('#c0c4cc', { metalness: 0.7, roughness: 0.35 }), 0, 1.03, 0.35);
  const roof = B(3.0, 0.05, 1.9, T.mat('#9a6a4a', { metalness: 0.4, roughness: 0.7 }), 0, 2.72, 0.15); roof.rotation.x = -0.12;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.62), new THREE.MeshBasicMaterial({ map: signTex(T, [["WALT'S COFFEE", 132, '#7a1a10', 0.4], ['SINCE 1999', 66, '#1a1410', 0.8]], { bg: '#f4e2b0', border: '#7a1a10' }) }));
  sign.position.set(0, 2.42, 1.08); sign.rotation.x = -0.05; G.add(sign); out.sign = sign;
  // shelves behind with jars, kulhads, a framed photo, a radio
  B(2.2, 0.04, 0.25, wood, 0, 1.6, -0.62); B(2.2, 0.04, 0.25, wood, 0, 2.05, -0.62);
  for (let i = 0; i < 6; i++) { const j = T.cyl(0.08, 0.08, 0.2, new THREE.MeshPhysicalMaterial({ color: '#f4f0e8', transparent: true, opacity: 0.45, roughness: 0.05 }), -0.9 + i * 0.36, 1.72, -0.6); G.add(j); G.add(T.cyl(0.07, 0.07, 0.14, T.mat(['#d8a050', '#c8783a', '#e8c070'][i % 3]), -0.9 + i * 0.36, 1.69, -0.6)); G.add(T.cyl(0.085, 0.085, 0.03, T.mat('#c0392b'), -0.9 + i * 0.36, 1.84, -0.6)); }
  for (let i = 0; i < 10; i++) G.add(T.cyl(0.04, 0.03, 0.08, T.mat('#a8603a'), -0.95 + i * 0.21, 2.11, -0.6));
  const photo = T.canvasTex(512, 640, (g) => { // Walt's portrait, 1999 (same design language as the 3D character)
    g.fillStyle = '#efe4cc'; g.fillRect(0, 0, 512, 640); const bg = g.createLinearGradient(0, 40, 0, 520); bg.addColorStop(0, '#f2b27a'); bg.addColorStop(1, '#c86a4a'); g.fillStyle = bg; g.fillRect(36, 36, 440, 480);
    g.fillStyle = '#a8443a'; g.beginPath(); g.ellipse(256, 560, 170, 150, 0, Math.PI, 0); g.fill(); g.fillStyle = '#2a3a4a'; g.fillRect(186, 430, 140, 90); g.fillStyle = '#e2b896'; g.fillRect(238, 380, 36, 50);
    g.fillStyle = '#e2b896'; g.beginPath(); g.arc(256, 260, 150, 0, 7); g.fill(); g.fillStyle = '#f4f2ee'; g.beginPath(); g.arc(256, 248, 156, Math.PI * 1.05, Math.PI * 1.95); g.lineTo(256, 160); g.fill();
    g.fillStyle = '#2a2230'; for (const x of [200, 312]) { g.beginPath(); g.arc(x, 262, 10, 0, 7); g.fill(); } g.strokeStyle = '#1a1a22'; g.lineWidth = 9; for (const x of [200, 312]) { g.beginPath(); g.arc(x, 262, 38, 0, 7); g.stroke(); } g.beginPath(); g.moveTo(238, 258); g.lineTo(274, 258); g.stroke();
    g.fillStyle = '#f4f2ee'; g.beginPath(); g.ellipse(226, 322, 38, 15, 0.25, 0, 7); g.ellipse(286, 322, 38, 15, -0.25, 0, 7); g.fill(); g.strokeStyle = '#2a2230'; g.lineWidth = 7; g.beginPath(); g.arc(256, 330, 34, 0.25 * Math.PI, 0.75 * Math.PI); g.stroke();
    g.fillStyle = 'rgba(255,140,150,.35)'; for (const x of [178, 334]) { g.beginPath(); g.ellipse(x, 310, 22, 11, 0, 0, 7); g.fill(); }
    g.fillStyle = '#4a3a2a'; g.font = '700 46px "Caveat"'; g.textAlign = 'center'; g.fillText('Walt · 1999', 256, 590); });
  const ph = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.4), new THREE.MeshBasicMaterial({ map: photo })); ph.position.set(0.9, 2.33, -0.69); G.add(ph); G.add(T.box(0.36, 0.44, 0.02, T.mat('#5a3a24'), 0.9, 2.33, -0.705)); out.photo = ph;
  // stove + kettle with steam, glass row, biscuit jar, plate
  const fire = sprite(T, { add: (m) => G.add(m) }, [-0.65, 1.45, 0.38], 0.06, '#ff4a3a', 0.6);
  G.add(T.box(0.4, 0.55, 0.35, T.mat('#2a2a30', { metalness: 0.5, roughness: 0.4 }), -0.8, 1.33, 0.2)); G.add(T.box(0.42, 0.06, 0.37, T.mat('#c8ccd4', { metalness: 0.8 }), -0.8, 1.62, 0.2)); const kettle = new THREE.Group(); kettle.position.set(-0.8, 1.17, 0.34); G.add(kettle); kettle.add(new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.2, 20), new THREE.MeshPhysicalMaterial({ color: '#e8f0f4', transparent: true, opacity: 0.35, roughness: 0.05 }))); const cf = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.11, 20), T.mat('#3a2214')); cf.position.y = -0.04; kettle.add(cf); out.kettle = kettle;
  const steam = dust(T, { add: (m) => G.add(m) }, { n: 60, area: [-0.95, -0.65, 1.3, 2.2, 0.25, 0.45], color: '#ffffff', size: 0.07, opacity: 0.4, rise: 0.45 });
  const teaM = T.mat('#f4f2ee', { roughness: 0.3 });
  for (let i = 0; i < 12; i++) { const c = T.cyl(0.038, 0.034, 0.09, teaM, -0.35 + (i % 6) * 0.13, 1.1, 0.25 + Math.floor(i / 6) * 0.14); G.add(c); G.add(T.cyl(0.035, 0.035, 0.004, T.mat('#3a2214'), c.position.x, 1.145, c.position.z)); out.cups.push(c); }
  out.jar = T.cyl(0.1, 0.1, 0.22, new THREE.MeshPhysicalMaterial({ color: '#f4f0e8', transparent: true, opacity: 0.4, roughness: 0.05 }), 0.75, 1.17, 0.3); G.add(out.jar); G.add(T.cyl(0.09, 0.09, 0.14, T.mat('#d8a050'), 0.75, 1.13, 0.3));
  out.plate = T.cyl(0.11, 0.09, 0.015, T.mat('#f4f4f0'), 0.35, 1.07, 0.55); G.add(out.plate);
  out.biscuits = [0, 1].map((i) => { const b = T.cyl(0.035, 0.035, 0.012, T.mat('#d8a050'), 0.32 + i * 0.06, 1.085, 0.55); b.visible = false; G.add(b); return b; });
  const bulb = lamp(T, { add: (m) => G.add(m) }, [0.3, 2.3, 0.4], '#ffc070', o.bulb ?? 2.2, 4.5, { r: 0.06, halo: 0.6 }); G.add(T.cyl(0.004, 0.004, 0.35, T.mat('#202020'), 0.3, 2.5, 0.4));
  // the "Help wanted" sign that M-7 hangs (hidden until the end)
  const hw = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), new THREE.MeshBasicMaterial({ map: T.canvasTex(512, 256, (c, W, H) => { c.fillStyle = '#f4ecd8'; c.fillRect(0, 0, W, H); c.strokeStyle = '#3a2a1a'; c.lineWidth = 10; c.strokeRect(8, 8, W - 16, H - 16); c.fillStyle = '#c0392b'; c.font = '900 64px "Nunito"'; c.textAlign = 'center'; c.fillText('HELP WANTED', W / 2, 108); c.fillStyle = '#2a1a10'; c.font = '800 50px "Nunito"'; c.fillText('Humans only.', W / 2, 190); }) }));
  hw.position.set(0.75, 0.55, 0.66); hw.visible = false; G.add(hw); out.helpSign = hw;
  // roll-up shutter (k = 1 closed, 0 open) for "the stall was closed" / "the stall opened"
  const shTex = T.canvasTex(256, 256, (c, W, H) => { c.fillStyle = '#8a929a'; c.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 16) { c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(0, y, W, 4); c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(0, y + 6, W, 3); } }, [1, 4]);
  const sh = T.box(2.5, 1.6, 0.04, T.mat('#ffffff', { map: shTex, metalness: 0.5, roughness: 0.5 }), 0, 1.85, 0.68); G.add(sh); G.add(T.box(2.6, 0.18, 0.2, T.mat('#6a7078', { metalness: 0.6 }), 0, 2.62, 0.66));
  out.setShutter = (k) => { k = clamp(k, 0, 1); sh.visible = k > 0.01; sh.scale.y = Math.max(0.01, k); sh.position.y = 2.65 - 0.8 * k; };
  out.setShutter(0);
  out.G = G; out.tick = (t) => { steam.tick(t); fire.material.opacity = 0.6; };
  out.world = (x, y, z) => [x + G.position.x, y + G.position.y, z + G.position.z];
  return out;
}
export function teaomat(T, st, pos, ry = 0) {
  const { THREE } = T, G = new THREE.Group(); G.position.set(...pos); G.rotation.y = ry; st.add(G);
  G.add(T.box(1.3, 2.3, 0.9, new THREE.MeshPhysicalMaterial({ color: '#f4f6f8', roughness: 0.2, clearcoat: 1 }), 0, 1.15, 0));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.9), new THREE.MeshBasicMaterial({ map: T.canvasTex(512, 460, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0a2a3a'); gr.addColorStop(1, '#04121c'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = CY; g.font = '900 64px "Nunito"'; g.textAlign = 'center'; g.fillText('BREW-O-MAT', W / 2, 90); g.font = '800 40px "Nunito"'; g.fillStyle = '#ffffff'; g.fillText('PERFECT COFFEE', W / 2, 200); g.fillText('3 SECONDS', W / 2, 260); g.fillStyle = '#7fffb0'; g.fillText('FREE', W / 2, 330); g.strokeStyle = CY; g.lineWidth = 6; g.strokeRect(14, 14, W - 28, H - 28); }) }));
  scr.position.set(0, 1.55, 0.452); G.add(scr); G.add(T.box(0.5, 0.3, 0.2, T.mat('#1a1a22'), 0, 0.75, 0.45));
  const L = lamp(T, { add: (m) => G.add(m) }, [0, 1.6, 1.0], CY, 2.2, 5, { bulb: false });
  return { G, tick: (t) => (L.intensity = 2.0 + 0.3 * Math.sin(t * 2)) };
}
export function bulletTrain(T, st, z = 5.7) {
  const { THREE } = T, G = new THREE.Group(); st.add(G);
  const body = new THREE.MeshPhysicalMaterial({ color: '#f2f4f6', roughness: 0.2, clearcoat: 1, metalness: 0.1 });
  for (let i = 0; i < 5; i++) { const c = T.box(9, 1.8, 2.2, body, i * 9.4, 0, z); G.add(c); G.add(T.box(9, 0.35, 2.22, T.mat(CY, { emissive: CY, emissiveIntensity: 0.4 }), i * 9.4, 0.2, z)); for (let w = 0; w < 6; w++) G.add(T.box(1.0, 0.5, 2.24, T.mat('#1a2a3a', { roughness: 0.1, metalness: 0.5 }), i * 9.4 - 3.6 + w * 1.45, 0.55, z)); }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 16), body); nose.scale.set(3, 0.82, 1); nose.position.set(-4.6, -0.05, z); G.add(nose);
  G.position.y = -0.1; G.tick = (t, t0 = 0, speed = 40) => { G.position.x = -60 + (t - t0) * speed; }; return G;
}
// ---------------- hospital room at night ----------------
export function hospitalRoom(T, st, o = {}) {
  const { THREE } = T, out = {};
  const B = (w, h, d, c, x, y, z, m = {}) => { const b = T.box(w, h, d, typeof c === 'string' ? T.mat(c, { roughness: 0.8, ...m }) : c, x, y, z); st.add(b); return b; };
  st.add(T.ground(30, 30, '#8a98a0', T.tiles('#94a2aa', 12, [8, 8]))); B(10, 3.2, 0.2, '#7a90a0', 0, 1.6, -3); B(0.2, 3.2, 10, '#72889a', -4, 1.6, 0); B(10, 0.2, 10, '#5a6a78', 0, 3.2, 0);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), new THREE.MeshBasicMaterial({ map: skyTex(T, SKIES.rainNight, { skyline: 0.75, skyH: 110, lit: 0.6, mullions: 2, seed: 8 }), fog: false })); win.position.set(1.6, 1.8, -2.88); st.add(win);
  // bed
  B(1.0, 0.5, 2.1, T.mat('#c8ccd4', { metalness: 0.6, roughness: 0.4 }), -0.6, 0.35, -0.6); B(0.95, 0.18, 2.0, '#f2f4f6', -0.6, 0.68, -0.6); B(0.98, 0.12, 1.3, '#6a8ab8', -0.6, 0.8, -0.25); B(0.7, 0.14, 0.4, '#ffffff', -0.6, 0.84, -1.38); B(1.0, 0.7, 0.06, T.mat('#c8ccd4', { metalness: 0.6 }), -0.6, 0.75, -1.65);
  // ECG monitor (canvas redrawn each frame from t)
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 300; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  B(0.6, 0.42, 0.1, '#2a2e36', 0.55, 1.55, -1.55); const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.36), new THREE.MeshBasicMaterial({ map: tex })); scr.position.set(0.55, 1.55, -1.497); st.add(scr); B(0.04, 1.3, 0.04, '#9aa0a8', 0.55, 0.65, -1.55);
  out.ecg = (t, o2 = {}) => { const g = cv.getContext('2d'), W = 512, H = 300, flat = o2.flat ?? 0, bpm = o2.bpm ?? 62; g.fillStyle = '#04120c'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(80,255,160,.15)'; g.lineWidth = 1; for (let x = 0; x < W; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    g.strokeStyle = '#5affa0'; g.lineWidth = 4; g.shadowColor = '#5affa0'; g.shadowBlur = 10; g.beginPath(); const per = 60 / bpm;
    for (let x = 0; x < W; x++) { const tt = t - (W - x) / W * 3.0, ph = ((tt % per) + per) % per / per; let y = 0; if (ph > 0.3 && ph < 0.34) y = -0.18; else if (ph > 0.38 && ph < 0.42) y = 1; else if (ph > 0.42 && ph < 0.46) y = -0.35; else if (ph > 0.6 && ph < 0.7) y = 0.12; const amp = 1 - clamp((tt - flat) * 3, 0, 1) * (flat ? 1 : 0); y *= flat ? amp : 1; x ? g.lineTo(x, H * 0.55 - y * 110) : g.moveTo(x, H * 0.55 - y * 110); }
    g.stroke(); g.shadowBlur = 0; g.fillStyle = '#5affa0'; g.font = '800 40px "Nunito"'; g.fillText(flat && t > flat + 0.4 ? '--' : String(bpm), 420, 60); tex.needsUpdate = true; };
  out.ecg(0);
  // IV stand, side table with a kulhad + glasses, curtain
  B(0.03, 1.9, 0.03, '#c8ccd4', -1.4, 0.95, -1.4, { metalness: 0.7 }); B(0.16, 0.22, 0.06, '#e8f4ff', -1.4, 1.75, -1.4, { transparent: true, opacity: 0.6 });
  B(0.5, 0.6, 0.45, '#c8b8a0', 0.4, 0.3, -0.7); st.add(T.cyl(0.04, 0.03, 0.08, T.mat('#a8603a'), 0.35, 0.64, -0.7));
  const cur = B(0.05, 2.6, 2.2, '#9ab8b0', -2.8, 1.4, 0.2); out.lamp = lamp(T, st, [0.6, 2.4, -0.4], '#ffd8b0', o.lamp ?? 2.4, 5, { r: 0.05 });
  const rainLight = lamp(T, st, [1.6, 1.8, -2.2], '#8ab0ff', 1.4, 5, { bulb: false });
  out.bedHead = [-0.6, 0.95, -1.25];
  return out;
}
// ---------------- ministry wall screen ----------------
export function wallScreen(T, st, pos, w, h, draw) {
  const { THREE } = T, cv = document.createElement('canvas'); cv.width = 1024; cv.height = Math.round(1024 * h / w); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, fog: false })); m.position.set(...pos); st.add(m);
  m.paint = (t) => { draw(cv.getContext('2d'), cv.width, cv.height, t); tex.needsUpdate = true; }; m.paint(0); return m;
}

// ---------------- 2D overlays ----------------
// persistent counter: HUMAN JOBS ON EARTH
export function jobsHud(g, t, o = {}) {
  const x = V(44, 36), y = V(40, 40), a = o.a ?? 1; if (a <= 0) return; const val = o.value ?? '1', col = o.gold ? '#ffd27a' : '#ffffff';
  g.save(); g.globalAlpha *= a; rr(g, x, y, V(330, 300), V(78, 72), 16); g.fillStyle = 'rgba(8,10,20,.55)'; g.fill(); g.strokeStyle = alpha(o.gold ? '#ffd27a' : CY, 0.55); g.lineWidth = 2; g.stroke();
  text(g, 'HUMAN JOBS ON EARTH', x + V(20, 18), y + V(24, 22), { size: V(17, 16), font: 'Nunito', weight: 900, color: '#b8c8e0', align: 'left', spacing: 2 });
  const pulse = o.pulse != null ? Math.max(0, 1 - Math.abs(o.pulse) * 2.5) : 0;
  text(g, String(val), x + V(20, 18), y + V(54, 50), { size: V(34, 30) * (1 + pulse * 0.25), font: 'Fredoka', weight: 700, color: col, align: 'left', glow: o.gold ? 18 : 6, glowColor: o.gold ? '#ffb030' : 'rgba(0,0,0,.6)' });
  g.restore();
}
// M-7 report terminal (log lines appear over time)
export function report(g, t, lines, o = {}) {
  const W = o.w ?? V(720, 900), H = o.h ?? V(300, 420), x = o.x ?? (E.W - W) / 2, y = o.y ?? E.H * 0.16, a = o.a ?? 1; if (a <= 0) return;
  g.save(); g.globalAlpha *= a; rr(g, x, y, W, H, 22); g.fillStyle = 'rgba(4,14,22,.88)'; g.fill(); g.strokeStyle = alpha(CY, 0.7); g.lineWidth = 2.5; g.stroke();
  text(g, o.title || 'M-7 · FIELD REPORT', x + 30, y + 40, { size: V(22, 22), font: 'Nunito', weight: 900, color: CY, align: 'left', spacing: 3 });
  g.fillStyle = alpha(CY, 0.3); g.fillRect(x + 30, y + 60, W - 60, 2);
  lines.forEach((L, i) => { const k = clamp((t - L.at) / 0.25); if (k <= 0) return; const s = L.text.slice(0, Math.floor(L.text.length * clamp((t - L.at) / Math.max(0.3, L.text.length * 0.035)))) + (((t * 2) % 1) < 0.5 && t - L.at < L.text.length * 0.035 + 0.6 ? '▌' : '');
    text(g, s, x + 30, y + 100 + i * (o.gap ?? V(48, 52)), { size: L.size ?? V(32, 32), font: 'Nunito', weight: 800, color: L.color || '#e8f4ff', align: 'left', alpha: k }); });
  g.restore();
}
export function dayCard(g, str, a = 1, y = E.H * 0.13) { if (a <= 0) return; g.save(); g.globalAlpha *= a; const gr = g.createLinearGradient(0, 0, 0, E.H * 0.26); gr.addColorStop(0, 'rgba(6,6,16,.6)'); gr.addColorStop(1, 'rgba(6,6,16,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H * 0.26);
  text(g, str, E.W / 2, y, { size: V(56, 56), font: 'Playfair Display', weight: 900, italic: true, color: '#f6ecd8', spacing: 6, glow: 12, glowColor: 'rgba(0,0,0,.7)' }); g.restore(); }
export function grade(g, o = {}) { const vg = g.createRadialGradient(E.W / 2, E.H / 2, Math.min(E.W, E.H) * 0.4, E.W / 2, E.H / 2, Math.max(E.W, E.H) * 0.78); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(10,6,18,${o.v ?? 0.38})`); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H);
  if (o.warm) { g.fillStyle = `rgba(255,170,80,${o.warm})`; g.globalCompositeOperation = 'soft-light'; g.fillRect(0, 0, E.W, E.H); g.globalCompositeOperation = 'source-over'; }
  if (o.cold) { g.fillStyle = `rgba(80,140,255,${o.cold})`; g.globalCompositeOperation = 'soft-light'; g.fillRect(0, 0, E.W, E.H); g.globalCompositeOperation = 'source-over'; } }
export { person2 };

// ---------------- the pour (insert close-up): carafe tilts in, curved stream, mug fills, steam ----------------
// at = mug base position (world). who: 'walt' (skin hand + red sleeve) | 'robot' (grey mitten + white arm). t0 = when the pour starts.
export function pourRig(T, st, at, o = {}) {
  const { THREE } = T, out = {}, who = o.who || 'walt', t0 = o.t0 ?? 0.2;
  const mugM = T.mat('#f4f2ee', { roughness: 0.28 }), cof = new THREE.MeshPhysicalMaterial({ color: '#3a2214', roughness: 0.15, clearcoat: 0.8 });
  const mug = new THREE.Group(); mug.position.set(...at); st.add(mug);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.1, 32, 1, true), mugM); wall.position.y = 0.05; wall.material.side = THREE.DoubleSide; mug.add(wall);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.008, 32), mugM); base.position.y = 0.004; mug.add(base);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.004, 8, 40), mugM); rim.rotation.x = Math.PI / 2; rim.position.y = 0.1; mug.add(rim);
  const hd = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.007, 8, 20), mugM); hd.position.set(0.052, 0.055, 0); mug.add(hd);
  const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.004, 32), cof); mug.add(fill);
  const crema = new THREE.Mesh(new THREE.RingGeometry(0.0, 0.041, 32), new THREE.MeshBasicMaterial({ color: '#7a4a2a', transparent: true, opacity: 0.5 })); crema.rotation.x = -Math.PI / 2; mug.add(crema);
  // carafe pivots around its handle; spout on the -x side
  const piv = new THREE.Group(); st.add(piv); const car = new THREE.Group(); piv.add(car);
  const glass = new THREE.MeshPhysicalMaterial({ color: '#e8f0f4', transparent: true, opacity: 0.32, roughness: 0.04, depthWrite: false });
  car.add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.19, 28), glass)); const cin = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.08, 0.1, 28), cof); cin.position.y = -0.04; car.add(cin);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.072, 0.035, 28), T.mat('#1a1a1e', { roughness: 0.4 })); lid.position.y = 0.11; car.add(lid);
  const sp = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.05, 12), glass); sp.position.set(-0.085, 0.08, 0); sp.rotation.z = Math.PI / 2; car.add(sp);
  const hnd = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.011, 8, 20, Math.PI), T.mat('#1a1a1e')); hnd.position.set(0.09, 0.02, 0); hnd.rotation.z = -Math.PI / 2; car.add(hnd);
  // the hand + sleeve holding it
  const skin = who === 'robot' ? T.mat('#8a929e', { metalness: 0.7, roughness: 0.35 }) : T.mat(o.skin || '#e2b896', { roughness: 0.5 });
  const fist = new THREE.Mesh(new THREE.SphereGeometry(0.045, 18, 14), skin); fist.position.set(0.14, 0.02, 0); car.add(fist);
  const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.32, 6, 14), who === 'robot' ? new THREE.MeshPhysicalMaterial({ color: '#eef1f4', roughness: 0.28, clearcoat: 0.9 }) : T.mat(o.sleeve || '#a8443a')); sleeve.position.set(0.32, 0.08, 0.02); sleeve.rotation.z = Math.PI / 2 + 0.35; car.add(sleeve);
  if (who === 'walt') { const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 18), T.mat('#e8dcc4')); cuff.position.set(0.19, 0.04, 0.0); cuff.rotation.z = Math.PI / 2 + 0.35; car.add(cuff); }
  // curved stream from the spout tip into the mug (rebuilt each frame from the spout's world position)
  const streamM = new THREE.MeshPhysicalMaterial({ color: '#4a2a16', roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.95 });
  let stream = null; const tipW = new THREE.Vector3();
  const steam = dust(T, st, { n: 40, area: [at[0] - 0.04, at[0] + 0.04, at[1] + 0.1, at[1] + 0.5, at[2] - 0.04, at[2] + 0.04], color: '#ffffff', size: 0.035, opacity: 0.3, rise: 0.18 });
  const splash = new THREE.Mesh(new THREE.RingGeometry(0.008, 0.014, 24), new THREE.MeshBasicMaterial({ color: '#c89a6a', transparent: true, opacity: 0.6 })); splash.rotation.x = -Math.PI / 2; mug.add(splash);
  out.tick = (t) => {
    const k = clamp((t - t0) / 0.45), tilt = ease.inOut(k) * 1.15, pour = clamp((t - t0 - 0.35) / 0.15), level = clamp((t - t0 - 0.45) / (o.fillTime ?? 1.6));
    const enter = ease.out(clamp((t - t0 + 0.6) / 0.6));
    piv.position.set(at[0] + 0.12 + (1 - enter) * 0.25, at[1] + 0.27 + (1 - enter) * 0.12, at[2]); piv.rotation.z = tilt; car.position.set(0, 0, 0);
    const lv = 0.008 + 0.075 * ease.out(level); fill.position.y = lv; crema.position.y = lv + 0.0025; crema.material.opacity = 0.25 + 0.35 * Math.sin(t * 9) ** 2; cin.scale.y = 1 - 0.5 * level;
    sp.updateWorldMatrix(true, false); tipW.set(0, -0.025, 0); sp.localToWorld(tipW);
    if (stream) { stream.parent && stream.parent.remove(stream); stream.geometry.dispose(); stream = null; }
    if (pour > 0 && level < 1) { const end = new THREE.Vector3(at[0] + 0.005, at[1] + lv, at[2]); const mid = new THREE.Vector3((tipW.x * 0.6 + end.x * 0.4) - 0.01, (tipW.y + end.y) / 2 + 0.01, at[2]);
      const pts = [tipW.clone(), mid, end]; const curve = new THREE.CatmullRomCurve3(pts); const r = 0.006 + 0.002 * Math.sin(t * 40);
      stream = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, r, 8, false), streamM); st.add(stream);
      const sk = (t * 3) % 1; splash.visible = true; splash.position.y = lv + 0.003; splash.scale.setScalar(1 + sk * 2.5); splash.material.opacity = 0.6 * (1 - sk); } else splash.visible = false;
    steam.tick(t); steam.visible = level > 0.3;
  };
  out.mug = mug; out.tick(0); return out;
}
