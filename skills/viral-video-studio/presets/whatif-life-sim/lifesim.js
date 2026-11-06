// lifesim.js: "What IF" life-sim 3D kit for GrowKaz three-kit shots.
// Soft glossy bubble-head characters (canvas-texture faces, 12 expressions), dusk-pastel stages with real depth of field,
// glowing "connection beams" (the power made visible), instanced crowds, and 2D HUD helpers (heart counter, serif labels, scoreboards).
// Copy into projects/<p>/scenes/sets/ (with cast.js + worlds.js for the v3 kit) and import in shots:  import { bubble, lifeStage, beam, crowd, hud } from '../sets/lifesim.js';
import { E, V, ease, clamp, lerp, rng, alpha, text, rr, glow } from '/engine/core.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

// ---------- faces ----------
const EXPR = ['neutral', 'happy', 'smug', 'sad', 'surprised', 'awe', 'worried', 'love', 'determined', 'blink', 'talk', 'cry',
  'angry', 'smirk', 'laugh', 'shock', 'nervous', 'wink', 'sleepy', 'cringe', 'suspicious', 'proud'];
function drawFace(g, W, H, ex, o = {}) {
  g.clearRect(0, 0, W, H); const ink = o.ink || '#2a2230', cx = W / 2, ey = H * 0.44, dx = W * 0.13, my = H * 0.66;
  g.strokeStyle = ink; g.fillStyle = ink; g.lineCap = 'round'; g.lineWidth = 9;
  const dot = (x, r = 15) => { g.beginPath(); g.ellipse(x, ey, r * 0.8, r, 0, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x + r * 0.3, ey - r * 0.35, r * 0.28, 0, 7); g.fill(); g.fillStyle = ink; };
  const arcUp = (x) => { g.beginPath(); g.arc(x, ey + 10, 20, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); };
  const lid = (x, tilt = 0) => { g.beginPath(); g.moveTo(x - 22, ey + tilt); g.lineTo(x + 22, ey - tilt); g.stroke(); g.beginPath(); g.ellipse(x, ey + 6, 12, 7, 0, 0, Math.PI); g.fill(); };
  const dotAt = (x, off, r = 15) => { g.beginPath(); g.ellipse(x + off, ey, r * 0.8, r, 0, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x + off + r * 0.3, ey - r * 0.35, r * 0.28, 0, 7); g.fill(); g.fillStyle = ink; };
  const line = (x) => { g.beginPath(); g.moveTo(x - 20, ey); g.lineTo(x + 20, ey); g.stroke(); };
  const brow = (x, k) => { k = -k; /* the face texture is mirrored on the sphere: flip so positive k = angry (inner ends down) */ g.lineWidth = 7; g.beginPath(); g.moveTo(x - 20, ey - 40 + k * (x < cx ? 1 : -1)); g.lineTo(x + 20, ey - 40 - k * (x < cx ? 1 : -1)); g.stroke(); g.lineWidth = 9; };
  const L = cx - dx, R = cx + dx;
  switch (ex) {
    case 'happy': case 'love': arcUp(L); arcUp(R); break;
    case 'smug': lid(L, 4); lid(R, 4); break;
    case 'sad': case 'cry': dot(L, 13); dot(R, 13); brow(L, -10); brow(R, -10); break;
    case 'worried': dot(L, 13); dot(R, 13); brow(L, -8); brow(R, -8); break;
    case 'surprised': case 'awe': g.lineWidth = 6; for (const x of [L, R]) { g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x, ey, 20, 0, 7); g.fill(); g.stroke(); g.fillStyle = ink; g.beginPath(); g.arc(x, ey + 2, 10, 0, 7); g.fill(); } g.lineWidth = 9; break;
    case 'determined': dot(L, 13); dot(R, 13); brow(L, 9); brow(R, 9); break;
    case 'blink': line(L); line(R); break;
    case 'angry': dotAt(L, 2, 13); dotAt(R, -2, 13); g.lineWidth = 9; brow(L, 16); brow(R, 16); break;
    case 'smirk': lid(L, 0); dot(R, 14); brow(R, -6); break;
    case 'laugh': case 'proud': arcUp(L); arcUp(R); if (ex === 'proud') { brow(L, -6); brow(R, -6); } break;
    case 'shock': g.lineWidth = 6; for (const x of [L, R]) { g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x, ey, 24, 0, 7); g.fill(); g.stroke(); g.fillStyle = ink; g.beginPath(); g.arc(x, ey, 6, 0, 7); g.fill(); } brow(L, -14); brow(R, -14); g.lineWidth = 9; break;
    case 'nervous': dotAt(L, 8, 13); dotAt(R, 8, 13); brow(L, -7); brow(R, -7); break;
    case 'wink': dot(L); arcUp(R); break;
    case 'sleepy': for (const x of [L, R]) { g.beginPath(); g.arc(x, ey - 4, 18, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); } break;
    case 'cringe': for (const x of [L, R]) { const k = x < cx ? 1 : -1; g.beginPath(); g.moveTo(x - 16 * k, ey - 14); g.lineTo(x + 14 * k, ey); g.lineTo(x - 16 * k, ey + 14); g.stroke(); } break;
    case 'suspicious': for (const x of [L, R]) { g.beginPath(); g.moveTo(x - 22, ey - 6); g.lineTo(x + 22, ey - 6); g.stroke(); g.beginPath(); g.ellipse(x - 8, ey + 2, 9, 7, 0, 0, Math.PI); g.fill(); } brow(L, 6); brow(R, -2); break;
    default: dot(L); dot(R);
  }
  if (o.lashes && !['blink', 'sleepy', 'happy', 'love', 'laugh', 'proud', 'cringe'].includes(ex)) { g.lineWidth = 5; for (const x of [L, R]) { const k = x < cx ? -1 : 1; for (const a of [0, 0.35]) { g.beginPath(); g.moveTo(x + k * 14, ey - 12 + a * 10); g.lineTo(x + k * 26, ey - 22 + a * 14); g.stroke(); } } g.lineWidth = 9; }
  if (o.bindi) { g.fillStyle = o.bindi === true ? '#d0203a' : o.bindi; g.beginPath(); g.arc(cx, ey - 46, 7, 0, 7); g.fill(); g.fillStyle = ink; }
  // mouth
  g.lineWidth = 8;
  if (['happy', 'love', 'talk'].includes(ex)) { g.beginPath(); g.moveTo(cx - 34, my - 6); g.quadraticCurveTo(cx, my + 34, cx + 34, my - 6); g.closePath(); g.fill(); g.fillStyle = '#ff8a9a'; g.beginPath(); g.ellipse(cx, my + 12, 14, 7, 0, 0, 7); g.fill(); g.fillStyle = ink; }
  else if (ex === 'smug') { g.beginPath(); g.moveTo(cx - 26, my + 2); g.quadraticCurveTo(cx + 6, my + 14, cx + 30, my - 8); g.stroke(); }
  else if (ex === 'sad' || ex === 'cry' || ex === 'worried') { g.beginPath(); g.moveTo(cx - 24, my + 10); g.quadraticCurveTo(cx, my - 8, cx + 24, my + 10); g.stroke(); }
  else if (ex === 'surprised') { g.beginPath(); g.ellipse(cx, my + 4, 14, 18, 0, 0, 7); g.fill(); }
  else if (ex === 'awe') { g.beginPath(); g.ellipse(cx, my + 4, 10, 12, 0, 0, 7); g.fill(); }
  else if (ex === 'determined') { g.beginPath(); g.moveTo(cx - 22, my + 4); g.lineTo(cx + 22, my + 2); g.stroke(); }
  else if (ex === 'angry') { g.lineWidth = 9; g.beginPath(); g.moveTo(cx - 26, my + 12); g.quadraticCurveTo(cx, my - 4, cx + 26, my + 12); g.stroke(); }
  else if (ex === 'smirk') { g.beginPath(); g.moveTo(cx - 20, my + 4); g.quadraticCurveTo(cx + 12, my + 10, cx + 34, my - 14); g.stroke(); }
  else if (ex === 'laugh') { g.beginPath(); g.moveTo(cx - 40, my - 10); g.quadraticCurveTo(cx, my + 50, cx + 40, my - 10); g.closePath(); g.fill(); g.fillStyle = '#ff8a9a'; g.beginPath(); g.ellipse(cx, my + 20, 18, 9, 0, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.fillRect(cx - 26, my - 8, 52, 7); g.fillStyle = ink; }
  else if (ex === 'proud' || ex === 'wink') { g.beginPath(); g.arc(cx, my - 18, 28, Math.PI * 0.2, Math.PI * 0.8); g.stroke(); }
  else if (ex === 'shock') { g.beginPath(); g.ellipse(cx, my + 8, 16, 24, 0, 0, 7); g.fill(); }
  else if (ex === 'nervous') { g.lineWidth = 6; g.beginPath(); for (let i = 0; i <= 8; i++) { const x = cx - 28 + i * 7, y = my + (i % 2 ? -5 : 5); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.lineWidth = 8; }
  else if (ex === 'sleepy') { g.beginPath(); g.ellipse(cx + 4, my + 2, 8, 10, 0, 0, 7); g.fill(); }
  else if (ex === 'cringe') { g.fillStyle = '#ffffff'; rr(g, cx - 32, my - 10, 64, 26, 8); g.fill(); g.strokeStyle = ink; g.lineWidth = 5; g.stroke(); for (const x of [-12, 4, 18]) { g.beginPath(); g.moveTo(cx + x - 4, my - 10); g.lineTo(cx + x - 4, my + 16); g.stroke(); } g.beginPath(); g.moveTo(cx - 32, my + 3); g.lineTo(cx + 32, my + 3); g.stroke(); g.fillStyle = ink; g.lineWidth = 8; }
  else if (ex === 'suspicious') { g.beginPath(); g.moveTo(cx - 22, my + 6); g.lineTo(cx + 24, my - 2); g.stroke(); }
  else { g.beginPath(); g.arc(cx, my - 10, 22, Math.PI * 0.2, Math.PI * 0.8); g.stroke(); }
  if (o.freckles) { g.fillStyle = 'rgba(150,80,50,.55)'; for (const [x, y] of [[-6, 0], [6, 5], [0, 12], [-12, 10], [10, -4]]) for (const sx of [L - 30, R + 30]) { g.beginPath(); g.arc(sx + x, my - 22 + y, 3.2, 0, 7); g.fill(); } g.fillStyle = ink; }
  if (o.mustache) { g.fillStyle = o.hairColor || ink; g.beginPath(); g.ellipse(cx - 18, my - 30, 22, 8, 0.25, 0, 7); g.ellipse(cx + 18, my - 30, 22, 8, -0.25, 0, 7); g.fill(); g.fillStyle = ink; }
  if (o.stubble) { g.fillStyle = 'rgba(40,30,30,.35)'; const R0 = rng(7); for (let i = 0; i < 140; i++) { const a = Math.PI * (0.1 + 0.8 * R0()), rad = 70 + R0() * 40; g.beginPath(); g.arc(cx + Math.cos(a) * rad * 1.3, my - 30 + Math.sin(a) * rad * 0.9, 2, 0, 7); g.fill(); } g.fillStyle = ink; }
  if (o.mole) { g.fillStyle = '#4a2a22'; g.beginPath(); g.arc(R + 40, my - 4, 4.5, 0, 7); g.fill(); g.fillStyle = ink; }
  if (ex === 'nervous') { g.fillStyle = '#9fd8ff'; g.beginPath(); g.ellipse(L - 46, ey - 30, 9, 14, -0.3, 0, 7); g.fill(); g.fillStyle = ink; }
  if (ex === 'angry') { g.strokeStyle = '#e0403a'; g.lineWidth = 5; const vx = R + 54, vy = ey - 56; for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(vx + a * 4, vy + b * 4); g.quadraticCurveTo(vx + a * 14, vy + b * 4, vx + a * 16, vy + b * 16); g.stroke(); } g.strokeStyle = ink; }
  if (ex === 'love' || o.blush) { g.fillStyle = 'rgba(255,120,150,.45)'; for (const x of [L - 26, R + 26]) { g.beginPath(); g.ellipse(x, my - 18, 24, 12, 0, 0, 7); g.fill(); } }
  if (ex === 'cry') { g.fillStyle = '#7fd0ff'; for (const x of [L, R]) { g.beginPath(); g.ellipse(x + 4, ey + 46, 8, 14, 0, 0, 7); g.fill(); } }
  if (ex === 'worried') { g.fillStyle = '#9fd8ff'; g.beginPath(); g.ellipse(R + 44, ey - 34, 9, 14, 0.3, 0, 7); g.fill(); }
}
// ---------- the character ----------
// look: {skin, hoodie, pants, shoes, hair: 'none'|'bob'|'pony'|'cap'|'beanie'|'bun', hairColor, capColor, s}
export function bubble(T, look = {}) {
  const { THREE } = T, root = new THREE.Group(), g = new THREE.Group(); root.add(g); g.scale.setScalar(look.s || 1);
  const skinM = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(look.skin || '#f4efe8'), roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.4, sheen: 0.4, sheenColor: new THREE.Color('#ffd8e8') });
  const cloth = (c) => new THREE.MeshStandardMaterial({ color: new THREE.Color(c), roughness: 0.85 });
  const hoodM = cloth(look.hoodie || '#4a7fd8'), pantM = cloth(look.pants || '#e8e6f0'), shoeM = cloth(look.shoes || '#f6f6fa');
  const cap = (r, len, m) => { const x = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 14), m); x.castShadow = true; return x; };
  // legs (pivot at hips)
  const legs = [-0.09, 0.09].map((x) => { const p = new THREE.Group(); p.position.set(x, 0.62, 0); const l = cap(0.045, 0.5, pantM); l.position.y = -0.29; const sh = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 10), shoeM); sh.scale.set(1, 0.6, 1.5); sh.position.set(0, -0.58, 0.04); sh.castShadow = true; p.add(l, sh); g.add(p); return p; });
  // torso (hoodie) + hood rim + pocket + strings
  const torso = cap(0.2, 0.32, hoodM); torso.scale.set(1, 1, 0.82); torso.position.y = 0.92; g.add(torso);
  const hood = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.035, 10, 24), hoodM); hood.rotation.x = Math.PI / 2 + 0.25; hood.position.set(0, 1.2, -0.06); g.add(hood);
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.02), cloth(shadeHex(look.hoodie || '#4a7fd8', -0.12))); pocket.position.set(0, 0.84, 0.17); g.add(pocket);
  for (const x of [-0.045, 0.045]) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14), cloth('#f4f4f8')); s.position.set(x, 1.1, 0.17); g.add(s); }
  // arms (pivot at shoulders)
  const arms = [-1, 1].map((sd) => { const p = new THREE.Group(); p.position.set(0.22 * sd, 1.12, 0); const a = cap(0.055, 0.3, hoodM); a.position.y = -0.2; const h = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 10), skinM); h.position.y = -0.42; h.castShadow = true; p.add(a, h); p.rotation.z = 0.12 * sd; g.add(p); return p; });
  // neck + head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.16), skinM); neck.position.y = 1.27; g.add(neck);
  const head = new THREE.Group(); head.position.y = 1.62; g.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.3, 48, 32), skinM); skull.castShadow = true; head.add(skull);
  // signature rim aura (our look: every character carries a soft coloured outline that matches their thread colour)
  if (look.rim !== false) { const rc = new THREE.Color(look.rim || '#ffb0d8'), am = new THREE.MeshBasicMaterial({ color: rc, side: THREE.BackSide, transparent: true, opacity: look.rimOpacity ?? 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
    const ha = new THREE.Mesh(skull.geometry, am); ha.scale.setScalar(1.045); head.add(ha); const ta = new THREE.Mesh(torso.geometry, am); ta.scale.set(1.06, 1.04, 0.88); ta.position.copy(torso.position); g.add(ta); root.userData.aura = am; }
  const faces = {}; const faceTex = (ex) => faces[ex + (look.blush ? 'b' : '')] ||= T.canvasTex(512, 384, (c, W, H) => drawFace(c, W, H, ex, look));
  const faceM = new THREE.MeshBasicMaterial({ map: faceTex('neutral'), transparent: true, depthWrite: false });
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.302, 48, 24, Math.PI / 2 - 0.85, 1.7, 0.95, 1.25), faceM); head.add(face);
  // hair / hats
  const hc = cloth(look.hairColor || '#3a2a22'), capC = cloth(look.capColor || '#3a9a5a');
  const dome = (m, cut = 0.5, sc = 1.06) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.3 * sc, 40, 20, 0, Math.PI * 2, 0, Math.PI * cut), m); d.castShadow = true; return d; };
  if (look.hair === 'bob') { const d = dome(hc, 0.42, 1.07); d.rotation.x = -0.55; head.add(d); const back = new THREE.Mesh(new THREE.SphereGeometry(0.31, 32, 16, Math.PI, Math.PI, 0.3, 1.6), hc); head.add(back); }
  if (look.hair === 'pony') { const d = dome(hc, 0.5, 1.06); d.rotation.x = -0.2; head.add(d); const p = cap(0.07, 0.25, hc); p.position.set(0, 0.0, -0.34); p.rotation.x = 0.5; head.add(p); }
  if (look.hair === 'bun') { const d = dome(hc, 0.5, 1.06); d.rotation.x = -0.2; head.add(d); const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 10), hc); b.position.set(0, 0.3, -0.1); head.add(b); }
  if (look.hair === 'cap') { const d = dome(capC, 0.42, 1.05); d.rotation.x = -0.15; head.add(d); const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 24, 1, false, -1, 2), capC); brim.position.set(0, 0.12, 0.2); brim.rotation.x = 0.18; head.add(brim); }
  if (look.hair === 'beanie') { const d = dome(capC, 0.5, 1.08); d.scale.y = 1.12; head.add(d); }
  if (look.hair === 'short') { const d = dome(hc, 0.4, 1.06); d.rotation.x = -0.32; head.add(d); const back = new THREE.Mesh(new THREE.SphereGeometry(0.312, 32, 16, Math.PI * 1.1, Math.PI * 0.8, 0.2, 1.3), hc); head.add(back); }
  if (look.hair === 'bowl') { const d = dome(hc, 0.47, 1.09); d.rotation.x = -0.12; head.add(d); for (let i = 0; i < 9; i++) { const a = -0.9 + i * 0.225, c = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.07 + (i % 3) * 0.03, 5), hc); c.position.set(Math.sin(a) * 0.31, 0.06 - (i % 2) * 0.015, Math.cos(a) * 0.31); c.rotation.x = Math.PI; head.add(c); } }
  if (look.hair === 'grey') { const d = dome(cloth('#d8d8de'), 0.33, 1.05); d.rotation.x = -0.45; head.add(d); }
  if (look.hair === 'cap' || look.hair === 'beanie') { const hb = new THREE.Mesh(new THREE.SphereGeometry(0.305, 32, 16, Math.PI * 1.15, Math.PI * 0.7, 0.9, 0.9), hc); head.add(hb); }
  if (look.hair === 'beanie') { const pom = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), cloth(shadeHex(look.capColor || '#3a9a5a', 0.25))); pom.position.y = 0.36; head.add(pom); const band = new THREE.Mesh(new THREE.TorusGeometry(0.305, 0.03, 8, 40), cloth(shadeHex(look.capColor || '#3a9a5a', -0.15))); band.rotation.x = Math.PI / 2; band.position.y = 0.1; head.add(band); }
  let glasses = null;
  if (look.glasses) { glasses = new THREE.Group(); const fm = new THREE.MeshStandardMaterial({ color: new THREE.Color(look.glassesColor || '#1a1a22'), roughness: 0.3, metalness: 0.4 });
    const lensM = new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.18, roughness: 0.05, depthWrite: false });
    const lenses = []; for (const x of [-0.075, 0.075]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.009, 8, 28), fm); r.position.set(x, 0.02, 0); glasses.add(r); const l = new THREE.Mesh(new THREE.CircleGeometry(0.056, 28), lensM.clone()); l.position.set(x, 0.02, -0.002); glasses.add(l); lenses.push(l); }
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.04), fm); br.rotation.z = Math.PI / 2; br.position.set(0, 0.03, 0); glasses.add(br);
    for (const x of [-1, 1]) { const arm = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, 0.26), fm); arm.position.set(x * 0.13, 0.03, -0.13); glasses.add(arm); }
    glasses.position.set(0, 0, 0.315); glasses.userData.lenses = lenses; const gp = new THREE.Group(); gp.add(glasses); head.add(gp); glasses.userData.pivot = gp; }
  const aura = root.userData.aura;
  root.userData = { head, face, arms, legs, torso, aura, glasses, body: g, hands: arms.map((a) => a.children[1]), look, hoodM, skinM };
  let cur = 'neutral';
  root.set = (o = {}) => {
    if (o.expr && o.expr !== cur) { faceM.map = faceTex(o.expr); faceM.needsUpdate = true; cur = o.expr; }
    if (o.look) { face.rotation.y = clamp(o.look[0], -1, 1) * 0.35; face.rotation.x = clamp(o.look[1] || 0, -1, 1) * -0.25; if (glasses) { glasses.userData.pivot.rotation.y = face.rotation.y; glasses.userData.pivot.rotation.x = face.rotation.x; } }
    if (o.tilt != null) head.rotation.z = o.tilt; if (o.nod != null) head.rotation.x = o.nod;
    if (o.armL != null) arms[0].rotation.z = -o.armL - 0.12; if (o.armR != null) arms[1].rotation.z = o.armR + 0.12;
    if (o.reachL != null) arms[0].rotation.x = -o.reachL; if (o.reachR != null) arms[1].rotation.x = -o.reachR;
    if (o.walk != null) { const w = Math.sin(o.walk), amp = o.stride ?? 0.5; legs[0].rotation.x = w * amp; legs[1].rotation.x = -w * amp; arms[0].rotation.x = -w * amp * 0.7; arms[1].rotation.x = w * amp * 0.7; g.position.y = Math.abs(Math.cos(o.walk)) * 0.03; }
    if (o.breathe != null) { torso.scale.y = 1 + Math.sin(o.breathe * 2) * 0.015; head.position.y = 1.62 + Math.sin(o.breathe * 2) * 0.006; }
    if (o.sit) { legs.forEach((l) => (l.rotation.x = -1.45)); g.position.y = -0.38; }
    return root;
  };
  return root;
}
function shadeHex(hex, k) { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.round(clamp(v + (k < 0 ? v * k : (255 - v) * k), 0, 255)); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(f).map((v) => v.toString(16).padStart(2, '0')).join(''); }
// ---------- stages ----------
// soft dusk-pastel room light + real depth of field. o: {sky, key, fill, rim, focus, aperture, bloom}
export function lifeStage(T, o = {}) {
  const st = T.stage({ mood: 'dusk', fov: o.fov || 34, sky: o.sky || ['#101c34', '#2e3462', '#b8646a'], fogColor: o.fogColor || '#2a2a4a', fog: o.fog || [10, 40], keyPos: o.keyPos || [-4, 7, 5], keyIntensity: o.key ?? 2.2, keyColor: o.keyColor || '#ffe2d0', ambient: o.ambient ?? 1.5, ambientSky: o.ambientSky || '#9ad0e0', bloom: o.bloom ?? 0.4, bloomThreshold: 0.86 });
  // speed: no MSAA (DOF + bloom already soften edges), half-res bloom, 1024 shadow map
  try { st.composer.renderTarget1.samples = 0; st.composer.renderTarget2.samples = 0; if (st.bloom) st.bloom.setSize(Math.round(st.composer.renderTarget1.width / 2), Math.round(st.composer.renderTarget1.height / 2)); st.sun.shadow.mapSize.set(1024, 1024); } catch (e) {}
  const { THREE } = T; const rim = new THREE.DirectionalLight(new THREE.Color(o.rim || '#ffa088'), o.rimIntensity ?? 1.6); rim.position.set(3, 4, -6); st.add(rim);
  const fill = new THREE.DirectionalLight(new THREE.Color(o.fill || '#8ab0ff'), 0.6); fill.position.set(5, 2, 4); st.add(fill);
  // beauty light (v3): soft warm front fill so faces read in dark sets; beauty:false to disable, a number to scale
  if (o.beauty !== false) { const bl = new THREE.DirectionalLight(new THREE.Color('#ffe6d2'), typeof o.beauty === 'number' ? o.beauty : 0.9); bl.position.set(1.5, 2.6, 9); st.add(bl); }
  if (o.dof !== false) { const bp = new BokehPass(st.scene, st.camera, { focus: o.focus ?? 4, aperture: o.aperture ?? 0.004, maxblur: o.maxblur ?? 0.009 }); st.composer.insertPass(bp, 1); st.bokeh = bp; st.focusOn = (obj) => { const p = new THREE.Vector3(); (Array.isArray(obj) ? p.set(...obj) : obj.isVector3 ? p.copy(obj) : obj.getWorldPosition(p)); bp.uniforms.focus.value = st.camera.position.distanceTo(p); }; }
  return st;
}
// a gym / hallway / classroom floor with painted lines; returns the floor mesh
export function gymFloor(T, st, o = {}) {
  const tex = T.canvasTex(1024, 1024, (g, W, H) => { const gr = g.createLinearGradient(0, 0, W, 0); for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#b87a4a' : '#c4875a'; g.fillRect((i * W) / 16, 0, W / 16, H); } g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 8; g.beginPath(); g.arc(W / 2, H / 2, 150, 0, 7); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.5)'; g.strokeRect(40, 40, W - 80, H - 80); });
  const m = new T.THREE.Mesh(new T.THREE.PlaneGeometry(o.w || 30, o.d || 30), new T.THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.05 })); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; st.add(m); return m;
}
export function lockers(T, st, o = {}) { const g = new T.THREE.Group(), n = o.n || 10, col = o.color || '#3f8a6a'; for (let i = 0; i < n; i++) { const L = T.box(0.55, 2.0, 0.5, T.mat(i % 2 ? col : shadeHex(col, -0.08), { roughness: 0.5, metalness: 0.3 }), i * 0.57, 1.0, 0); g.add(L); for (const y of [1.7, 1.6, 1.5]) g.add(T.box(0.3, 0.025, 0.02, T.mat(shadeHex(col, -0.35)), i * 0.57, y, 0.26)); } g.position.set(...(o.pos || [-2.5, 0, -2])); st.add(g); return g; }
// instanced crowd of bubble-heads (cheap): heads + hoodies in many colours
export function crowd(T, st, o = {}) {
  const { THREE } = T, n = o.n || 120, R = rng(o.seed || 7), cols = o.colors || ['#e05a7a', '#f0a040', '#4a7fd8', '#5ab87a', '#9a6ad8', '#e8d050', '#e8e6f0'];
  const hg = new THREE.SphereGeometry(0.3, 18, 12), bg = new THREE.CapsuleGeometry(0.2, 0.32, 4, 8);
  const heads = new THREE.InstancedMesh(hg, new THREE.MeshStandardMaterial({ color: 0xf4efe8, roughness: 0.4 }), n), bodies = new THREE.InstancedMesh(bg, new THREE.MeshStandardMaterial({ roughness: 0.85 }), n);
  const m4 = new THREE.Matrix4(), c = new THREE.Color(), area = o.area || [-6, 6, -8, -2];
  for (let i = 0; i < n; i++) { const x = lerp(area[0], area[1], R()), z = lerp(area[2], area[3], R()), y = (o.rise || 0) * (area[3] - z); m4.makeTranslation(x, y + 1.62, z); heads.setMatrixAt(i, m4); m4.makeTranslation(x, y + 0.92, z); bodies.setMatrixAt(i, m4); bodies.setColorAt(i, c.set(cols[Math.floor(R() * cols.length)])); }
  st.add(heads, bodies); return { heads, bodies };
}
// ---------- the power, made visible ----------
// a glowing beam from a to b (Vector3 or [x,y,z]); k 0..1 draws it on; returns {tube, set(k,t)}
export function beam(T, st, a, b, o = {}) {
  const { THREE } = T, A = new THREE.Vector3(...[].concat(a.toArray ? a.toArray() : a)), B = new THREE.Vector3(...[].concat(b.toArray ? b.toArray() : b));
  const mid = A.clone().lerp(B, 0.5); mid.y += o.arc ?? 0.6; const curve = new THREE.QuadraticBezierCurve3(A, mid, B);
  const col = new THREE.Color(o.color || '#ff5aa8'); const core = new THREE.MeshBasicMaterial({ color: col.clone().lerp(new THREE.Color('#ffffff'), 0.5), transparent: true }), halo = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
  const geo = new THREE.TubeGeometry(curve, 64, o.r || 0.012, 8, false), geo2 = new THREE.TubeGeometry(curve, 64, (o.r || 0.012) * 3.5, 8, false);
  const t1 = new THREE.Mesh(geo, core), t2 = new THREE.Mesh(geo2, halo); st.add(t1, t2); const total = geo.index.count, total2 = geo2.index.count;
  const spark = new THREE.Mesh(new THREE.SphereGeometry((o.r || 0.012) * 4, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); st.add(spark);
  return { curve, core: t1, halo: t2, set(k, t = 0) { k = clamp(k); geo.setDrawRange(0, Math.floor(total * k / 6) * 6); geo2.setDrawRange(0, Math.floor(total2 * k / 6) * 6); spark.visible = k > 0.01 && k < 0.999; spark.position.copy(curve.getPointAt(Math.max(0.001, k))); halo.opacity = 0.3 + 0.1 * Math.sin(t * 6); } };
}
// ---------- 2D HUD (overlay) ----------
// persistent heart / stat counter pill, top-left (the "game UI" layer that makes the hypothetical feel real)
export function hudCounter(g, value, o = {}) { const x = o.x ?? V(60, 40), y = o.y ?? V(E.H * 0.15, 150), s = o.s ?? V(1.6, 1.4), str = typeof value === 'number' ? value.toLocaleString('en-US') : value;
  g.save(); g.translate(x, y); g.scale(s, s); g.font = '800 30px "Nunito"'; const w = g.measureText(str).width + 70; rr(g, 0, 0, w, 48, 24); g.fillStyle = 'rgba(30,14,34,.72)'; g.fill(); g.strokeStyle = alpha(o.color || '#ff6aa8', 0.8); g.lineWidth = 2; g.stroke();
  heart(g, 26, 25, 11, o.color || '#ff6aa8', o.pulse || 0); text(g, str, 46, 26, { size: 30, font: 'Nunito', weight: 800, color: '#ffffff', align: 'left' }); g.restore(); }
export function heart(g, x, y, r, col, pulse = 0) { const s = r * (1 + 0.25 * Math.max(0, 1 - pulse * 3)); g.save(); g.translate(x, y); g.fillStyle = col; g.beginPath(); g.moveTo(0, s * 0.9); g.bezierCurveTo(-s * 1.6, -s * 0.2, -s * 0.6, -s * 1.4, 0, -s * 0.45); g.bezierCurveTo(s * 0.6, -s * 1.4, s * 1.6, -s * 0.2, 0, s * 0.9); g.fill(); g.restore(); }
// small serif caps label (chapter / diagram titles): "THE BRIDGE EXPERIMENT"
export function serifLabel(g, str, y, a = 1, o = {}) { text(g, str.toUpperCase(), o.x ?? E.W / 2, y, { size: o.size ?? V(40, 40), font: 'Playfair Display', weight: 700, color: o.color || '#f6ecd8', alpha: a, spacing: 3, glow: 8, glowColor: 'rgba(0,0,0,.6)' }); }
// glowing scoreboard panel with a title tag and a big number
export function scoreboard(g, title, value, x, y, a = 1, o = {}) { const w = o.w ?? V(560, 520), h = o.h ?? V(250, 240), col = o.color || '#ff5aa8'; g.save(); g.globalAlpha *= a; glow(g, x, y, w, col, 0.25);
  rr(g, x - w / 2, y - h / 2, w, h, 14); g.fillStyle = 'rgba(20,8,24,.9)'; g.fill(); g.strokeStyle = col; g.lineWidth = 4; g.shadowColor = col; g.shadowBlur = 18; g.stroke(); g.shadowBlur = 0;
  g.fillStyle = alpha(col, 0.12); for (let i = 0; i < 40; i++) for (let j = 0; j < 8; j++) { g.beginPath(); g.arc(x - w / 2 + 16 + i * (w - 32) / 39, y - h / 2 + 20 + j * (h - 40) / 7, 2.5, 0, 7); g.fill(); }
  rr(g, x - w * 0.18, y - h / 2 - 18, w * 0.36, 36, 18); g.fillStyle = col; g.fill(); text(g, title.toUpperCase(), x, y - h / 2, { size: V(26, 26), font: 'Nunito', weight: 900, color: '#ffffff', spacing: 2 });
  text(g, String(value), x, y + 6, { size: V(130, 110), font: 'Nunito', weight: 900, color: '#ffffff', glow: 16, glowColor: col }); g.restore(); }
// letterbox + soft vignette + lifted blacks (the "cinematic life-sim" grade) — call last in overlay
export function lifeGrade(g, o = {}) { const vg = g.createRadialGradient(E.W / 2, E.H / 2, Math.min(E.W, E.H) * 0.35, E.W / 2, E.H / 2, Math.max(E.W, E.H) * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(20,6,30,${o.vignette ?? 0.45})`); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H); }
export { EXPR };
