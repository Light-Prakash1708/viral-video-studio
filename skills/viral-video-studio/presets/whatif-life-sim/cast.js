// cast.js: make every character instantly recognisable, the way top life-sim channels do it:
// a unique SILHOUETTE (hair / headwear) + a unique OUTFIT pattern + one SIGNATURE PROP, then expressions do the acting.
// Works on top of lifesim.js bubble().  Copy next to lifesim.js.
//   import { person2, CAST, castLine, giveProp } from '../sets/cast.js';
//   const riya = person2(T, 'bestie', { hairColor: '#2a1a14' });   // archetype + overrides
//   const kid  = person2(T, { hair3: 'afro', outfit: 'plaid', top: '#c03a3a', prop: 'phone', face: { freckles: true } });
import { clamp, rng } from '/engine/core.js';
import { bubble } from './lifesim.js';

// ---------- archetypes: one line = one character the audience can tell apart from a wide shot ----------
export const CAST = {
  hero:     { skin: '#e8b48a', hair3: 'swoop',  hairColor: '#2a1c16', outfit: 'hoodie',  top: '#3f7fd8', rim: '#9fd8ff' },
  bestie:   { skin: '#8a5a3a', hair3: 'spiky',  hairColor: '#1a1210', outfit: 'tee',     top: '#2f9a5a', prop: 'ball', acc: ['wristband'], rim: '#9fffc0' },
  crush:    { skin: '#f0c8a8', hair3: 'long',   hairColor: '#3a2016', outfit: 'cardigan', top: '#e98ab0', face: { lashes: true, blush: true }, acc: ['earrings'], rim: '#ffb0d8' },
  nerd:     { skin: '#f2d2b0', hair3: 'bowl',   hairColor: '#5a3a22', outfit: 'uniform', top: '#e8e4da', tie: '#2a4a8a', glasses: true, prop: 'book', rim: '#c0d8ff' },
  jock:     { skin: '#c89070', hair3: 'buzz',   hairColor: '#2a1c16', outfit: 'varsity', top: '#b8323a', sleeves: '#f2efe6', rim: '#ffb080' },
  rebel:    { skin: '#e0b090', hair3: 'mohawk', hairColor: '#e0306a', outfit: 'jacket',  top: '#2a2a30', acc: ['chain', 'earrings'], face: { smirkDefault: true }, rim: '#ff80c0' },
  artsy:    { skin: '#a8704a', hair3: 'afro',   hairColor: '#1e1410', outfit: 'overalls', top: '#f2c040', pants: '#4a6aa8', acc: ['headphones'], rim: '#ffe080' },
  rich:     { skin: '#f4d8c0', hair3: 'sidepart', hairColor: '#c8a050', outfit: 'blazer', top: '#1e2a4a', tie: '#c8a050', acc: ['watch'], prop: 'coffee', rim: '#ffe0a0' },
  shy:      { skin: '#d8a888', hair3: 'curlymop', hairColor: '#e0b860', outfit: 'plaid', top: '#c23a3a', prop: 'flowers', face: { freckles: true }, rim: '#ffc0a0' },
  biker:    { skin: '#b07a58', hair3: 'helmet', capColor: '#f2f2f0', outfit: 'jacket', top: '#c8302a', rim: '#ff9080' },
  teacher:  { skin: '#e8c0a0', hair3: 'bun', hairColor: '#4a3a32', outfit: 'cardigan', top: '#6a8a6a', glasses: true, prop: 'book', s: 1.08, rim: '#d0ffd0' },
  mom:      { skin: '#c8906a', hair3: 'braid', hairColor: '#1a1210', outfit: 'kurta', top: '#d8507a', face: { bindi: true }, acc: ['earrings'], s: 1.06, rim: '#ffd0a0' },
  dad:      { skin: '#b88060', hair3: 'short', hairColor: '#2a2420', outfit: 'shirt', top: '#5a7ab0', face: { mustache: true }, acc: ['watch'], s: 1.1, rim: '#a0c8ff' },
  dadi:     { skin: '#d0a07a', hair3: 'bun', hairColor: '#d8d8dc', outfit: 'saree', top: '#e0a020', face: { bindi: true }, glasses: true, s: 0.98, rim: '#ffe0a0' },
  chef:     { skin: '#c89878', hair3: 'chefhat', outfit: 'apron', top: '#f4f4f2', apron: '#2a2a30', face: { mustache: true }, prop: 'spatula', s: 1.08, rim: '#ffe0c0' },
  doctor:   { skin: '#e8c4a0', hair3: 'pony', hairColor: '#3a2a22', outfit: 'labcoat', top: '#f4f6f8', acc: ['stethoscope'], prop: 'clipboard', rim: '#c0f0ff' },
  gamer:    { skin: '#f0c8a8', hair3: 'beanie', capColor: '#7a4ad8', hairColor: '#2a1a14', outfit: 'hoodie', top: '#2a2a3a', acc: ['headphones'], prop: 'phone', rim: '#c0a0ff' },
  elder:    { skin: '#c8987a', hair3: 'bald', hairColor: '#e8e8ea', outfit: 'kurta', top: '#f2ece0', face: { mustache: true, stubble: true }, glasses: true, prop: 'cane', s: 1.0, rim: '#ffe8c0' },
};

// ---------- materials / tiny helpers ----------
function mats(T) {
  const { THREE } = T;
  const cloth = (c, o = {}) => new THREE.MeshStandardMaterial({ color: new THREE.Color(c), roughness: o.r ?? 0.85, metalness: o.m ?? 0 });
  const shiny = (c) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c), roughness: 0.25, clearcoat: 0.8, metalness: 0.1 });
  const mesh = (geo, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; return o; };
  return { THREE, cloth, shiny, mesh };
}
// fabric patterns as canvas textures (plaid, stripes, polka, denim)
function pattern(T, kind, a, b) {
  const tex = T.canvasTex(256, 256, (g, W, H) => {
    g.fillStyle = a; g.fillRect(0, 0, W, H);
    if (kind === 'plaid') { g.globalAlpha = 0.45; g.fillStyle = b; for (let i = 0; i < 4; i++) { g.fillRect(i * 64 + 8, 0, 22, H); g.fillRect(0, i * 64 + 8, W, 22); } g.globalAlpha = 0.6; g.fillStyle = '#ffffff'; for (let i = 0; i < 4; i++) { g.fillRect(i * 64 + 40, 0, 3, H); g.fillRect(0, i * 64 + 40, W, 3); } }
    if (kind === 'stripes') { g.fillStyle = b; for (let i = 0; i < 8; i++) g.fillRect(0, i * 32, W, 12); }
    if (kind === 'polka') { g.fillStyle = b; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.beginPath(); g.arc(x * 32 + (y % 2) * 16, y * 32 + 16, 6, 0, 7); g.fill(); } }
    if (kind === 'denim') { const R = rng(3); g.globalAlpha = 0.18; g.strokeStyle = '#ffffff'; for (let i = 0; i < 400; i++) { const x = R() * W, y = R() * H; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6, y + 6); g.stroke(); } }
  });
  tex.wrapS = tex.wrapT = T.THREE.RepeatWrapping; tex.repeat.set(2, 2); return tex;
}

// ---------- 3D hair / headwear (strong silhouettes) ----------
function hair3(T, head, style, o) {
  const { THREE, cloth, mesh } = mats(T); const hc = cloth(o.hairColor || '#2a1c16', { r: 0.7 }), cc = cloth(o.capColor || '#3a9a5a');
  const S = (r, w = 24, h = 16) => new THREE.SphereGeometry(r, w, h);
  const dome = (m, cut = 0.5, sc = 1.06, rx = -0.2) => { const d = mesh(new THREE.SphereGeometry(0.3 * sc, 40, 20, 0, Math.PI * 2, 0, Math.PI * cut), m); d.rotation.x = rx; head.add(d); return d; };
  const R = rng(o.seed || 5);
  switch (style) {
    case 'afro': for (let i = 0; i < 46; i++) { const u = R() * Math.PI * 2, v = R() * 1.25, r = 0.36 + R() * 0.04; const b = mesh(S(0.1 + R() * 0.04, 12, 8), hc, Math.sin(v) * Math.cos(u) * r, 0.06 + Math.cos(v) * r * 0.95, Math.sin(v) * Math.sin(u) * r - 0.04); if (b.position.z > 0.22 && b.position.y < 0.2) continue; head.add(b); } break;
    case 'curlymop': for (let i = 0; i < 38; i++) { const u = R() * Math.PI * 2, v = R() * 1.15; const b = mesh(S(0.07 + R() * 0.03, 10, 8), hc, Math.sin(v) * Math.cos(u) * 0.31, 0.08 + Math.cos(v) * 0.3, Math.sin(v) * Math.sin(u) * 0.31); if (b.position.z > 0.2 && b.position.y < 0.18) continue; head.add(b); } break;
    case 'spiky': dome(hc, 0.42, 1.05, -0.2); for (let i = 0; i < 16; i++) { const u = (i / 16) * Math.PI * 2, v = 0.35 + (i % 3) * 0.22; const c = mesh(new THREE.ConeGeometry(0.06, 0.2, 6), hc, Math.sin(v) * Math.cos(u) * 0.3, 0.05 + Math.cos(v) * 0.3, Math.sin(v) * Math.sin(u) * 0.3 - 0.03); c.lookAt(c.position.clone().multiplyScalar(3)); c.rotateX(Math.PI / 2); head.add(c); } break;
    case 'mohawk': dome(cloth('#3a2a22'), 0.36, 1.02, -0.3); for (let i = 0; i < 9; i++) { const a = -0.9 + i * 0.25; const c = mesh(new THREE.ConeGeometry(0.05, 0.26, 6), hc, 0, Math.cos(a) * 0.32, Math.sin(a) * 0.32); c.rotation.x = a; head.add(c); } break;
    case 'buzz': dome(cloth(o.hairColor || '#2a1c16', { r: 1 }), 0.45, 1.015, -0.3); break;
    case 'bald': { const r = mesh(new THREE.TorusGeometry(0.29, 0.04, 8, 30, Math.PI * 1.2), hc, 0, -0.02, -0.02); r.rotation.set(Math.PI / 2, 0, Math.PI * -0.1 + Math.PI); head.add(r); break; }
    case 'swoop': { dome(hc, 0.46, 1.06, -0.3); const f = mesh(new THREE.CapsuleGeometry(0.08, 0.22, 6, 12), hc, 0.05, 0.24, 0.2); f.rotation.set(0.9, 0, 1.2); head.add(f); break; }
    case 'sidepart': { dome(hc, 0.44, 1.06, -0.32); const f = mesh(new THREE.CapsuleGeometry(0.07, 0.24, 6, 12), hc, -0.06, 0.26, 0.16); f.rotation.set(0.6, 0, -1.3); head.add(f); break; }
    case 'short': dome(hc, 0.42, 1.06, -0.32); break;
    case 'bowl': { dome(hc, 0.47, 1.09, -0.12); break; }
    case 'long': { dome(hc, 0.45, 1.07, -0.35); const back = mesh(new THREE.CylinderGeometry(0.305, 0.34, 0.6, 28, 1, true, Math.PI * 0.3, Math.PI * 1.4), hc, 0, -0.16, -0.03); back.material = hc.clone(); back.material.side = THREE.DoubleSide; head.add(back); break; }
    case 'pony': { dome(hc, 0.5, 1.06, -0.2); const p = mesh(new THREE.CapsuleGeometry(0.07, 0.3, 6, 12), hc, 0, -0.02, -0.36); p.rotation.x = 0.5; head.add(p); head.add(mesh(new THREE.TorusGeometry(0.05, 0.015, 6, 16), cloth('#e04a6a'), 0, 0.1, -0.31)); break; }
    case 'braid': { dome(hc, 0.5, 1.06, -0.25); for (let i = 0; i < 6; i++) head.add(mesh(S(0.065 - i * 0.004, 12, 8), hc, 0.12, -0.08 - i * 0.1, -0.24 + i * 0.03)); head.add(mesh(new THREE.TorusGeometry(0.03, 0.012, 6, 12), cloth('#f0c030'), 0.12, -0.66, -0.07)); break; }
    case 'bun': { dome(hc, 0.5, 1.06, -0.2); head.add(mesh(S(0.12, 16, 10), hc, 0, 0.3, -0.12)); break; }
    case 'twobuns': { dome(hc, 0.5, 1.06, -0.2); for (const x of [-0.2, 0.2]) head.add(mesh(S(0.1, 16, 10), hc, x, 0.26, -0.05)); break; }
    case 'cap': { dome(cc, 0.42, 1.05, -0.15); const brim = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 24, 1, false, -1, 2), cc, 0, 0.12, 0.2); brim.rotation.x = 0.18; head.add(brim); break; }
    case 'backcap': { dome(cc, 0.42, 1.05, -0.15); const brim = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 24, 1, false, -1, 2), cc, 0, 0.12, -0.2); brim.rotation.set(-0.18, Math.PI, 0); head.add(brim); break; }
    case 'beanie': { const d = dome(cc, 0.5, 1.08, 0); d.scale.y = 1.12; head.add(mesh(S(0.07, 14, 10), cloth('#f4f4f4'), 0, 0.37, 0)); const b = mesh(new THREE.TorusGeometry(0.31, 0.035, 8, 40), cc, 0, 0.1, 0); b.rotation.x = Math.PI / 2; head.add(b); break; }
    case 'helmet': { const h = mesh(new THREE.SphereGeometry(0.36, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.62), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(o.capColor || '#f2f2f0'), roughness: 0.2, clearcoat: 1 }), 0, 0, 0); h.rotation.x = -0.15; head.add(h); const stripe = mesh(new THREE.TorusGeometry(0.362, 0.025, 6, 40, Math.PI), cloth(o.top || '#c8302a'), 0, 0, 0); stripe.rotation.y = Math.PI / 2; head.add(stripe); break; }
    case 'chefhat': { head.add(mesh(new THREE.CylinderGeometry(0.27, 0.25, 0.2, 28), cloth('#ffffff'), 0, 0.3, 0)); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; head.add(mesh(S(0.14, 14, 10), cloth('#ffffff'), Math.cos(a) * 0.15, 0.48, Math.sin(a) * 0.15)); } break; }
    case 'turban': { for (let i = 0; i < 4; i++) { const t = mesh(new THREE.TorusGeometry(0.29 - i * 0.04, 0.07, 10, 32), cloth(o.capColor || '#e07a20'), 0, 0.12 + i * 0.07, -0.02); t.rotation.x = Math.PI / 2 + 0.25 - i * 0.05; head.add(t); } break; }
    case 'hijab': { const m = cloth(o.capColor || '#5a7aa8'); const h = mesh(new THREE.SphereGeometry(0.335, 40, 24, Math.PI * 0.78, Math.PI * 1.44, 0, Math.PI * 0.78), m, 0, 0, 0); h.material = m.clone(); h.material.side = THREE.DoubleSide; head.add(h); head.add(mesh(new THREE.ConeGeometry(0.3, 0.3, 28, 1, true), m, 0, -0.38, 0)); break; }
    case 'none': default: break;
  }
}

// ---------- outfits ----------
function outfit(T, ch, o) {
  const { THREE, cloth, mesh } = mats(T); const ud = ch.userData, g = ud.body, torso = ud.torso, top = o.top || '#4a7fd8';
  const setTop = (m) => { torso.material = m; ud.arms.forEach((a) => (a.children[0].material = m)); };
  const kind = o.outfit || 'hoodie';
  // hide the default hoodie details (hood ring, pocket, strings) for non-hoodie outfits
  if (kind !== 'hoodie') g.children.forEach((c) => { if (c !== torso && c.geometry && (c.geometry.type === 'TorusGeometry' || c.geometry.type === 'BoxGeometry' || (c.geometry.type === 'CylinderGeometry' && c.position.y > 1.05 && c.position.y < 1.2))) c.visible = false; });
  const front = (geo, m, y, z = 0.165) => { const x = mesh(geo, m, 0, y, z); g.add(x); return x; };
  if (kind === 'plaid' || kind === 'stripes' || kind === 'polka') { const m = cloth('#ffffff'); m.map = pattern(T, kind, top, o.pattern2 || '#1a1a22'); setTop(m); front(new THREE.BoxGeometry(0.02, 0.4, 0.01), cloth('#f4f4f4'), 0.95, 0.172); }
  else setTop(cloth(top));
  if (kind === 'tee') { const n = mesh(new THREE.TorusGeometry(0.08, 0.018, 8, 20), cloth('#ffffff'), 0, 1.2, 0.02); n.rotation.x = Math.PI / 2 + 0.3; g.add(n); ud.arms.forEach((a) => { a.children[0].scale.y = 0.55; a.children[0].position.y = -0.12; const fore = mesh(new THREE.CapsuleGeometry(0.045, 0.16, 6, 12), ud.skinM, 0, -0.32, 0); a.add(fore); }); }
  if (kind === 'uniform' || kind === 'shirt' || kind === 'blazer') { const c = cloth(kind === 'blazer' ? '#f4f4f4' : top); for (const s of [-1, 1]) { const col = mesh(new THREE.BoxGeometry(0.1, 0.05, 0.02), c, s * 0.06, 1.2, 0.14); col.rotation.z = s * 0.5; g.add(col); } }
  if (o.tie) { front(new THREE.BoxGeometry(0.05, 0.26, 0.015), cloth(o.tie), 1.04, 0.175); front(new THREE.BoxGeometry(0.06, 0.05, 0.02), cloth(o.tie), 1.18, 0.17); }
  if (kind === 'blazer' || kind === 'jacket' || kind === 'varsity' || kind === 'labcoat' || kind === 'cardigan') {
    for (const s of [-1, 1]) { const lap = mesh(new THREE.BoxGeometry(kind === 'varsity' ? 0.035 : 0.09, 0.36, 0.02), cloth(kind === 'varsity' ? (o.sleeves || '#f2efe6') : shade(top, -0.18)), s * 0.07, 0.98, 0.17); lap.rotation.z = s * 0.12; g.add(lap); }
    if (kind === 'varsity') { ud.arms.forEach((a) => (a.children[0].material = cloth(o.sleeves || '#f2efe6'))); const letter = T.canvasTex(128, 128, (c) => { c.fillStyle = o.sleeves || '#f2efe6'; c.font = '900 110px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.letter || 'K', 64, 70); }); const L = mesh(new THREE.PlaneGeometry(0.1, 0.1), new THREE.MeshBasicMaterial({ map: letter, transparent: true }), -0.09, 1.02, 0.175); g.add(L); }
    if (kind === 'labcoat') { const coat = mesh(new THREE.CylinderGeometry(0.22, 0.27, 0.42, 24, 1, true), cloth(top), 0, 0.55, 0); coat.material = cloth(top); coat.material.side = THREE.DoubleSide; g.add(coat); }
    if (kind === 'jacket') for (const y of [1.08, 0.98, 0.88]) front(new THREE.SphereGeometry(0.012, 8, 6), cloth('#c8c8d0', { m: 0.8, r: 0.3 }), y, 0.178);
  }
  if (kind === 'overalls') { setTop(cloth(o.shirt || '#ffffff')); front(new THREE.BoxGeometry(0.28, 0.24, 0.02), cloth(o.pants || '#4a6aa8'), 0.82, 0.168); for (const s of [-1, 1]) { const st = mesh(new THREE.BoxGeometry(0.035, 0.3, 0.02), cloth(o.pants || '#4a6aa8'), s * 0.1, 1.05, 0.165); st.rotation.z = s * -0.08; g.add(st); } }
  if (kind === 'apron') { front(new THREE.BoxGeometry(0.3, 0.55, 0.015), cloth(o.apron || '#2a2a30'), 0.72, 0.17); }
  if (kind === 'kurta') { const k = mesh(new THREE.CylinderGeometry(0.21, 0.28, 0.4, 24, 1, true), cloth(top), 0, 0.56, 0); k.material = cloth(top); k.material.side = THREE.DoubleSide; g.add(k); front(new THREE.BoxGeometry(0.03, 0.2, 0.01), cloth(shade(top, 0.35)), 1.1, 0.172); }
  if (kind === 'saree') { const sk = mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.6, 24, 1, true), cloth(top), 0, 0.42, 0); sk.material = cloth(top); sk.material.side = THREE.DoubleSide; g.add(sk); const pallu = mesh(new THREE.BoxGeometry(0.1, 0.62, 0.02), cloth(shade(top, -0.25)), 0.06, 0.98, 0.17); pallu.rotation.z = -0.55; g.add(pallu); ud.legs.forEach((l) => (l.children[0].visible = false)); }
  const PANTS = ['#2a3a5a', '#3a3a44', '#4a5a7a', '#5a4a3a', '#2a2a30', '#6a6a72'];
  const pc = o.pants || PANTS[Math.abs([...(o.top || 'x')].reduce((h, ch) => h * 31 + ch.charCodeAt(0), 7)) % PANTS.length];
  ud.legs.forEach((l) => (l.children[0].material = cloth(pc)));
  if (o.shoes) ud.legs.forEach((l) => (l.children[1].material = cloth(o.shoes)));
}

// ---------- accessories ----------
function accessories(T, ch, list = []) {
  const { THREE, cloth, mesh } = mats(T); const ud = ch.userData, head = ud.head, g = ud.body;
  for (const a of list) {
    if (a === 'headphones') { const b = mesh(new THREE.TorusGeometry(0.33, 0.025, 8, 30, Math.PI), cloth('#202028', { r: 0.4 }), 0, 0.02, 0); head.add(b); for (const s of [-1, 1]) { const c = mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 20), cloth('#e04a6a', { r: 0.4 }), s * 0.31, 0, 0); c.rotation.z = Math.PI / 2; head.add(c); } }
    if (a === 'earrings') for (const s of [-1, 1]) head.add(mesh(new THREE.TorusGeometry(0.025, 0.006, 6, 16), cloth('#f0c040', { m: 0.9, r: 0.2 }), s * 0.3, -0.1, 0.02));
    if (a === 'chain') { const c = mesh(new THREE.TorusGeometry(0.12, 0.008, 6, 30), cloth('#e8c040', { m: 0.9, r: 0.2 }), 0, 1.16, 0.06); c.rotation.x = Math.PI / 2 + 0.6; g.add(c); }
    if (a === 'scarf') { const s = mesh(new THREE.TorusGeometry(0.1, 0.045, 10, 24), cloth('#d84a3a'), 0, 1.24, 0); s.rotation.x = Math.PI / 2; g.add(s); g.add(mesh(new THREE.BoxGeometry(0.07, 0.24, 0.03), cloth('#d84a3a'), 0.07, 1.08, 0.17)); }
    if (a === 'backpack') { g.add(mesh(new THREE.BoxGeometry(0.3, 0.36, 0.14), cloth('#e0a030'), 0, 0.95, -0.24)); for (const s of [-1, 1]) g.add(mesh(new THREE.BoxGeometry(0.035, 0.36, 0.02), cloth('#a07020'), s * 0.12, 1.0, 0.16)); }
    if (a === 'watch') ud.hands[0].parent.add(mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.035, 16), cloth('#c8a040', { m: 0.9, r: 0.3 }), 0, -0.35, 0));
    if (a === 'wristband') ud.hands[1].parent.add(mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.05, 16), cloth('#f2f2f2'), 0, -0.35, 0));
    if (a === 'stethoscope') { const s = mesh(new THREE.TorusGeometry(0.12, 0.01, 6, 24, Math.PI * 1.3), cloth('#202028'), 0, 1.12, 0.1); s.rotation.set(0.5, 0, Math.PI * 1.15); g.add(s); }
    if (a === 'badge') { const q = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16), cloth('#f0c040', { m: 0.8 }), -0.1, 1.05, 0.172); q.rotation.x = Math.PI / 2; g.add(q); }
  }
}

// ---------- props (held in a hand; hand 1 = right) ----------
export function giveProp(T, ch, name, hand = 1) {
  const { THREE, cloth, shiny, mesh } = mats(T); const p = new THREE.Group(); const H = ch.userData.hands[hand];
  switch (name) {
    case 'phone': { p.add(mesh(new THREE.BoxGeometry(0.07, 0.14, 0.012), shiny('#18181e'))); const scr = mesh(new THREE.PlaneGeometry(0.062, 0.128), new THREE.MeshBasicMaterial({ color: '#7fc8ff' }), 0, 0, 0.007); p.add(scr); p.userData.screen = scr; p.rotation.x = -0.5; break; }
    case 'book': { p.add(mesh(new THREE.BoxGeometry(0.16, 0.22, 0.04), cloth('#c0392b'))); p.add(mesh(new THREE.BoxGeometry(0.15, 0.21, 0.035), cloth('#f4efe0'), 0.008, 0, 0)); break; }
    case 'flowers': { for (let i = 0; i < 5; i++) { const a = i * 1.26; const st = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.25), cloth('#3a8a3a'), Math.cos(a) * 0.02, 0.1, Math.sin(a) * 0.02); p.add(st); p.add(mesh(new THREE.SphereGeometry(0.035, 10, 8), cloth(['#e84a6a', '#f0c030', '#f4f4f4', '#e84a6a', '#c060e0'][i]), Math.cos(a) * 0.05, 0.24, Math.sin(a) * 0.05)); } { const q = mesh(new THREE.ConeGeometry(0.06, 0.14, 12, 1, true), cloth('#f2e6c8'), 0, 0.02, 0); q.rotation.x = Math.PI; p.add(q); } break; }
    case 'coffee': { p.add(mesh(new THREE.CylinderGeometry(0.04, 0.032, 0.11, 16), cloth('#f4f0e8'))); p.add(mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.02, 16), cloth('#3a2a22'), 0, 0.06, 0)); p.add(mesh(new THREE.CylinderGeometry(0.041, 0.035, 0.04, 16), cloth('#8a5a3a'), 0, 0.0, 0)); break; }
    case 'ball': p.add(mesh(new THREE.SphereGeometry(0.11, 24, 16), cloth('#e07a30'))); p.position.x = 0.06; break;
    case 'cake': { p.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 24), cloth('#f4c8d8'))); p.add(mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.02, 24), cloth('#ffffff'), 0, 0.055, 0)); p.add(mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.06), cloth('#4a9ad8'), 0, 0.1, 0)); p.add(mesh(new THREE.SphereGeometry(0.01, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffd060' }), 0, 0.14, 0)); p.position.z = 0.1; break; }
    case 'umbrella': { p.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.9), cloth('#202028'), 0, 0.4, 0)); const c = mesh(new THREE.ConeGeometry(0.55, 0.22, 12, 1, true), cloth('#d83a4a'), 0, 0.85, 0); c.material.side = THREE.DoubleSide; p.add(c); break; }
    case 'guitar': { { const q = mesh(new THREE.SphereGeometry(0.13, 20, 14), cloth('#c07a3a'), 0, -0.05, 0); q.scale.z = 0.35; p.add(q); } p.add(mesh(new THREE.BoxGeometry(0.04, 0.4, 0.02), cloth('#4a2a1a'), 0, 0.22, 0)); p.rotation.z = 0.9; break; }
    case 'mic': { p.add(mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.14, 12), cloth('#202028'))); p.add(mesh(new THREE.SphereGeometry(0.03, 14, 10), cloth('#c8c8d0', { m: 0.7, r: 0.3 }), 0, 0.09, 0)); break; }
    case 'bag': { p.add(mesh(new THREE.BoxGeometry(0.22, 0.18, 0.08), cloth('#6a3a8a'), 0, -0.14, 0)); p.add(mesh(new THREE.TorusGeometry(0.06, 0.008, 6, 16, Math.PI), cloth('#4a2a6a'), 0, -0.05, 0)); break; }
    case 'clipboard': { p.add(mesh(new THREE.BoxGeometry(0.17, 0.23, 0.01), cloth('#8a6a4a'))); p.add(mesh(new THREE.PlaneGeometry(0.15, 0.19), cloth('#ffffff'), 0, -0.01, 0.006)); break; }
    case 'spatula': { p.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22), cloth('#202028'), 0, 0.1, 0)); p.add(mesh(new THREE.BoxGeometry(0.07, 0.08, 0.006), cloth('#c8c8d0', { m: 0.8 }), 0, 0.24, 0)); break; }
    case 'cane': { p.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.85), cloth('#6a4a2a'), 0, -0.38, 0)); break; }
    case 'icecream': { { const q = mesh(new THREE.ConeGeometry(0.035, 0.11, 14), cloth('#d8a060'), 0, 0, 0); q.rotation.x = Math.PI; p.add(q); } p.add(mesh(new THREE.SphereGeometry(0.04, 14, 10), cloth('#f4b8d0'), 0, 0.07, 0)); break; }
    case 'sign': { p.add(mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.6), cloth('#8a6a4a'), 0, 0.25, 0)); const t = T.canvasTex(256, 160, (c) => { c.fillStyle = '#f4efe0'; c.fillRect(0, 0, 256, 160); c.fillStyle = '#c0392b'; c.font = '900 64px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(ch.userData.signText || 'YES!', 128, 82); }); p.add(mesh(new THREE.PlaneGeometry(0.4, 0.25), new THREE.MeshBasicMaterial({ map: t }), 0, 0.62, 0.012)); break; }
    default: break;
  }
  H.add(p); p.position.y += -0.02; ch.userData.prop = p; return p;
}

// ---------- the public builder ----------
// person2(T, archetypeName | look, overrides): bubble() + 3D hair + outfit + face features + accessories + prop
export function person2(T, a = 'hero', over = {}) {
  const base = typeof a === 'string' ? CAST[a] || CAST.hero : a; const L = { ...base, ...over, face: { ...(base.face || {}), ...(over.face || {}) } };
  const ch = bubble(T, { skin: L.skin, hoodie: L.top, pants: L.pants, shoes: L.shoes, hair: 'none', hairColor: L.hairColor, glasses: L.glasses, glassesColor: L.glassesColor, rim: L.rim, rimOpacity: L.rimOpacity, blush: L.face.blush, s: L.s,
    lashes: L.face.lashes, freckles: L.face.freckles, mustache: L.face.mustache, stubble: L.face.stubble, bindi: L.face.bindi, mole: L.face.mole });
  hair3(T, ch.userData.head, L.hair3 || 'short', L); outfit(T, ch, L); accessories(T, ch, L.acc || []);
  if (L.prop) giveProp(T, ch, L.prop, L.propHand ?? 1);
  ch.userData.cast = L; ch.userData.restExpr = L.face.smirkDefault ? 'smirk' : 'neutral';
  return ch;
}
// a whole distinct cast from archetype names, e.g. cast(T, ['hero','bestie','crush','nerd'])
export const cast = (T, names, overrides = {}) => names.map((n) => person2(T, n, overrides[n] || {}));

// ---------- acting helper: expression timeline from word timings ----------
// castLine(ch, t, [[0, 'neutral'], [1.2, 'shock'], [1.8, 'laugh']], {blinkSeed}) -> sets expr with natural blinks
export function castLine(ch, t, keys, o = {}) {
  let ex = keys[0][1]; for (const [k, e] of keys) if (t >= k) ex = e;
  const R = (o.blinkSeed ?? 3) * 1.7, ph = (t + R) % 3.4; if (ph < 0.12 && !['laugh', 'happy', 'blink', 'sleepy', 'cringe'].includes(ex)) ex = 'blink';
  ch.set({ expr: ex, ...(o.pose || {}) }); return ex;
}
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.round(clamp(v + (k < 0 ? v * k : (255 - v) * k), 0, 255)); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(f).map((v) => v.toString(16).padStart(2, '0')).join(''); }
