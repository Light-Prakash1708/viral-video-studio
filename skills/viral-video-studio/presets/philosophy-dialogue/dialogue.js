// dialogue.js: "philosophy dialogue" Shorts kit (9:16). Two faceless clay figures talk in a soft minimal room with a portal
// window; the ideas are shown as etched white-ink line art on black; captions fade in word by word with a speaker marker.
// Copy into projects/<p>/scenes/sets/. Uses lifesim.js (lifeStage) for the 3D room.
//   import { clayRoom, clayFigure, inkBG, inkRings, inkSphere, inkWaves, inkStars, inkCircle, inkLabel, morph, dialogueCaption, PAL } from '../sets/dialogue.js';
import { E, V, ease, clamp, lerp, rng, alpha, text, rr, prog } from '/engine/core.js';
import { lifeStage } from './lifesim.js';

export const PAL = { accent: '#e8452c', paper: '#f2efe9', ink: '#f4f2ee', black: '#07070a', sky: ['#7fa8e0', '#b8d0f0', '#e8f0f8'], warm: '#ffd9b0' };

// ---------- 3D: the soft clay world ----------
// a matte white room, a big round portal window (sky | space | earth | dawn), soft key + bounce light; returns { stage, portal, setPortal }
export function clayRoom(T, o = {}) {
  const { THREE } = T;
  const st = lifeStage(T, { sky: ['#e9e6e1', '#f4f2ee'], fogColor: '#ecebe8', fog: [8, 30], key: 1.4, keyColor: '#fff6ea', keyPos: [3, 7, 5], ambient: 1.25, ambientSky: '#e8eef8', rim: '#cfe0ff', rimIntensity: 0.6, fill: '#ffe8d8', focus: o.focus ?? 3, aperture: o.aperture ?? 0.004, maxblur: 0.012, beauty: 0.6 });
  const clay = (c = '#f1efeb') => new THREE.MeshStandardMaterial({ color: new THREE.Color(c), roughness: 0.92, metalness: 0 });
  st.add(T.ground(40, 40, '#efede9')); const back = T.box(14, 7, 0.4, clay('#f3f1ed'), 0, 3.5, -2.6); st.add(back);
  // round portal: a thick ring + the view behind it (canvas texture swapped per scene)
  const R = o.portalR ?? 1.35, py = o.portalY ?? 2.3, px = o.portalX ?? 0.6;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.12, 0.22, 24, 80), clay('#f6f4f0')); ring.position.set(px, py, -2.35); ring.castShadow = true; st.add(ring);
  const views = {};
  const viewTex = (kind) => views[kind] ||= T.canvasTex(1024, 1024, (g, W, H) => {
    if (kind === 'sky') { const gr = g.createLinearGradient(0, 0, 0, H); PAL.sky.forEach((c, i) => gr.addColorStop(i / 2, c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(200 + i * 140, 700 + (i % 2) * 60, 160, 40, 0, 0, 7); g.fill(); } }
    else if (kind === 'dawn') { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#8a9ad8'); gr.addColorStop(0.6, '#f0b8a8'); gr.addColorStop(1, '#ffe2b0'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#fff2d0'; g.beginPath(); g.arc(W / 2, H * 0.62, 90, 0, 7); g.fill(); }
    else { g.fillStyle = '#020306'; g.fillRect(0, 0, W, H); const r = rng(4); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.7})`; g.fillRect(r() * W, r() * H, 1.6, 1.6); }
      if (kind === 'earth') { const cx = W / 2, cy = H / 2, rr2 = 330; const gr = g.createRadialGradient(cx - 110, cy - 120, 30, cx, cy, rr2); gr.addColorStop(0, '#6aa8e8'); gr.addColorStop(0.7, '#1e4a9a'); gr.addColorStop(1, '#0a1a40'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rr2, 0, 7); g.fill();
        g.fillStyle = 'rgba(70,130,60,.85)'; for (let i = 0; i < 9; i++) { g.beginPath(); g.ellipse(cx - 160 + r() * 300, cy - 160 + r() * 300, 40 + r() * 90, 25 + r() * 60, r() * 3, 0, 7); g.fill(); } g.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 14; i++) { g.beginPath(); g.ellipse(cx - 260 + r() * 520, cy - 260 + r() * 520, 60 + r() * 80, 8 + r() * 10, r() * 3, 0, 7); g.fill(); }
        g.strokeStyle = 'rgba(140,190,255,.6)'; g.lineWidth = 10; g.beginPath(); g.arc(cx, cy, rr2 + 4, 0, 7); g.stroke(); } } });
  const portal = new THREE.Mesh(new THREE.CircleGeometry(R + 0.02, 64), new THREE.MeshBasicMaterial({ map: viewTex(o.view || 'sky'), fog: false })); portal.position.set(px, py, -2.38); st.add(portal);
  // a little furniture: a low round table + a potted plant (the only green in the white world)
  st.add(T.cyl(0.42, 0.42, 0.06, clay(), -0.2, 0.52, -0.7, 40)); st.add(T.cyl(0.06, 0.06, 0.5, clay(), -0.2, 0.26, -0.7));
  const pot = T.cyl(0.11, 0.09, 0.18, clay('#e8e4de'), -0.32, 0.64, -0.75); st.add(pot); for (let i = 0; i < 7; i++) { const lf = T.sphere(0.07 + (i % 3) * 0.015, T.mat('#5aa04a', { roughness: 0.8 }), -0.32 + Math.sin(i * 2.4) * 0.09, 0.82 + (i % 3) * 0.05, -0.75 + Math.cos(i * 2.4) * 0.09); lf.scale.y = 0.6; st.add(lf); }
  return { stage: st, portal, setPortal: (k) => { portal.material.map = viewTex(k); portal.material.needsUpdate = true; } };
}
// faceless blocky clay figure; glyph: true draws the accent starburst on the face (marks the guide / current speaker)
export function clayFigure(T, o = {}) {
  const { THREE } = T, g = new THREE.Group(), body = new THREE.Group(); g.add(body); body.scale.setScalar(o.s || 1);
  const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(o.color || '#f4f2ee'), roughness: 0.9 });
  const B = (w, h, d, x, y, z, r = 0) => { const k = new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 2, 2, 2), m); k.position.set(x, y, z); k.rotation.z = r; k.castShadow = true; k.receiveShadow = true; body.add(k); return k; };
  const legs = [-0.11, 0.11].map((x) => { const p = new THREE.Group(); p.position.set(x, 0.78, 0); body.add(p); const l = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.76, 0.2), m); l.position.y = -0.38; l.castShadow = true; p.add(l); const f = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.08, 0.28), m); f.position.set(0, -0.74, 0.04); p.add(f); return p; });
  const torso = B(0.5, 0.62, 0.3, 0, 1.1, 0); const hips = B(0.46, 0.14, 0.28, 0, 0.8, 0); B(0.16, 0.1, 0.16, 0, 1.46, 0);
  const arms = [-1, 1].map((sd) => { const p = new THREE.Group(); p.position.set(sd * 0.32, 1.36, 0); body.add(p); const a = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.6, 0.16), m); a.position.y = -0.3; a.castShadow = true; p.add(a); p.rotation.z = sd * 0.06; return p; });
  // the head: a tall tapered block (wider top), slightly bevelled
  const head = new THREE.Group(); head.position.y = 1.78; body.add(head);
  const hg = new THREE.BoxGeometry(0.42, 0.52, 0.4, 2, 2, 2); const pos = hg.attributes.position; for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); const k = y > 0 ? 1.08 : 0.86; pos.setX(i, pos.getX(i) * k); pos.setZ(i, pos.getZ(i) * (y > 0 ? 1.0 : 0.9)); } hg.computeVertexNormals();
  const hm = new THREE.Mesh(hg, m); hm.castShadow = true; head.add(hm);
  const glyphTex = T.canvasTex(256, 256, (c, W, H) => { c.clearRect(0, 0, W, H); c.strokeStyle = PAL.accent; c.lineCap = 'round'; c.lineWidth = 9; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; c.beginPath(); c.moveTo(W / 2 + Math.cos(a) * 14, H / 2 + Math.sin(a) * 14); c.lineTo(W / 2 + Math.cos(a) * 92, H / 2 + Math.sin(a) * 92); c.stroke(); } });
  const glyph = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: glyphTex, transparent: true, depthWrite: false })); glyph.position.set(0, 0.02, 0.205); head.add(glyph); glyph.visible = !!o.glyph;
  g.userData = { head, arms, legs, torso, glyph, body };
  g.set = (s = {}) => { if (s.glyph != null) glyph.visible = s.glyph; if (s.pulse != null) { const k = 1 + 0.12 * Math.max(0, Math.sin(s.pulse * 8)); glyph.scale.setScalar(k); glyph.rotation.z = s.pulse * 0.4; }
    if (s.tilt != null) head.rotation.z = s.tilt; if (s.nod != null) head.rotation.x = s.nod; if (s.turn != null) head.rotation.y = s.turn;
    if (s.armL != null) arms[0].rotation.z = -s.armL - 0.06; if (s.armR != null) arms[1].rotation.z = s.armR + 0.06; if (s.reachR != null) arms[1].rotation.x = -s.reachR; if (s.reachL != null) arms[0].rotation.x = -s.reachL;
    if (s.sit) { legs.forEach((l) => (l.rotation.x = -1.45)); body.position.y = -0.36; } if (s.breathe != null) torso.scale.y = 1 + Math.sin(s.breathe * 1.6) * 0.012; return g; };
  return g;
}

// ---------- 2D: etched white-ink worlds on black ----------
export function inkBG(g, t, o = {}) { g.fillStyle = o.bg || PAL.black; g.fillRect(0, 0, E.W, E.H); inkStars(g, t, { n: o.stars ?? 120, a: o.starA ?? 0.5 }); }
export function inkStars(g, t, o = {}) { const R = rng(o.seed || 9); for (let i = 0; i < (o.n || 120); i++) { const x = R() * E.W, y = R() * E.H, tw = 0.5 + 0.5 * Math.sin(t * (0.6 + R()) + i); g.fillStyle = `rgba(255,255,255,${(o.a ?? 0.5) * (0.25 + 0.75 * tw) * R()})`; g.fillRect(x, y, 1.5 + R() * 1.5, 1.5 + R() * 1.5); } }
// concentric echo rings (bat / sound / signal); accent dot at the source
export function inkRings(g, t, x, y, o = {}) { const n = o.n || 7, sp = o.speed ?? 0.35, max = o.r || V(320, 380); g.save(); g.lineWidth = o.w || 2; for (let i = 0; i < n; i++) { const k = ((t * sp + i / n) % 1); g.strokeStyle = `rgba(244,242,238,${(o.a ?? 0.85) * (1 - k)})`; g.beginPath(); g.arc(x, y, 8 + k * max, 0, 7); g.stroke(); } g.fillStyle = PAL.accent; g.beginPath(); g.arc(x, y, o.dot ?? 7, 0, 7); g.fill(); g.restore(); }
// a sphere of points that slowly rotates (atom / planet / "everything is the same pieces"); disperse 0..1 scatters it into dust
export function inkSphere(g, t, x, y, r, o = {}) { const n = o.n || 900, R = rng(o.seed || 3), rot = t * (o.spin ?? 0.25), dis = o.disperse || 0; g.save();
  for (let i = 0; i < n; i++) { const u = R() * 2 - 1, th = R() * Math.PI * 2, s = Math.sqrt(1 - u * u); let px = s * Math.cos(th + rot), pz = s * Math.sin(th + rot), py = u; const jx = (R() - 0.5) * 2, jy = (R() - 0.5) * 2; px += jx * dis * 2.5; py += jy * dis * 2.5;
    const depth = (pz + 1) / 2; g.fillStyle = `rgba(244,242,238,${(0.15 + 0.85 * depth) * (o.a ?? 1)})`; const sz = 1 + depth * (o.size ?? 2.2); g.fillRect(x + px * r, y + py * r, sz, sz); }
  if (o.ring) { g.strokeStyle = alpha(PAL.accent, 0.9); g.lineWidth = 5; g.beginPath(); g.arc(x, y, r * 1.12, 0, 7); g.stroke(); } g.restore(); }
// a wireframe "ocean of energy": stacked wavy lines in perspective
export function inkWaves(g, t, o = {}) { const rows = o.rows || 46, top = o.top ?? E.H * 0.42, bot = o.bot ?? E.H * 1.02, amp = o.amp ?? 30; g.save(); g.lineWidth = 1.6;
  for (let r = 0; r < rows; r++) { const k = r / (rows - 1), y0 = lerp(top, bot, k * k), a = 0.15 + 0.75 * k; g.strokeStyle = `rgba(244,242,238,${a * (o.a ?? 1)})`; g.beginPath();
    for (let x = -20; x <= E.W + 20; x += 12) { const y = y0 + Math.sin(x * 0.012 + t * 1.2 + r * 0.45) * amp * (0.3 + k) + Math.sin(x * 0.031 - t * 0.8 + r) * amp * 0.35 * k; x < 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); } g.restore(); }
// an engraved circular vignette (ring + inner hatching) that frames an icon drawn by fn(g, x, y, r)
export function inkCircle(g, x, y, r, fn, o = {}) { g.save(); g.globalAlpha *= o.a ?? 1; g.strokeStyle = PAL.ink; g.lineWidth = 3; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.globalAlpha *= 0.35; g.lineWidth = 1; for (let k = 1; k < 4; k++) { g.beginPath(); g.arc(x, y, r - k * 7, -0.4, 1.4); g.stroke(); } g.globalAlpha /= 0.35; g.beginPath(); g.arc(x, y, r - 2, 0, 7); g.clip(); fn && fn(g, x, y, r); g.restore(); }
// small caps label in the ink style ("TABLE", "HAND", "EARTH")
export function inkLabel(g, str, x, y, a = 1) { text(g, str, x, y, { size: V(30, 36), font: 'Nunito', weight: 900, color: PAL.ink, alpha: a, spacing: 4 }); }
// cross-dissolve helper: returns 0..1 for a morph window [t0, t0+d]
export const morph = (t, t0, d = 0.8) => ease.inOut(clamp((t - t0) / d));

// ---------- captions: word-by-word fade, speaker marker ----------
// words: [{w, t}] in shot-local seconds (from timeline/words.json); speaker: 'guide' (accent dot) | 'asker' (no dot)
// dark: true on black ink scenes (white text), false on the paper/clay scenes (charcoal text)
export function dialogueCaption(g, t, words, o = {}) {
  const shown = words.filter((w) => t >= w.t - 0.05); if (!shown.length) return; const y = o.y ?? V(E.H * 0.82, E.H * 0.6), size = o.size ?? V(40, 46);
  const col = o.dark ? '#f4f2ee' : '#2a2a30'; g.save(); g.font = `800 ${size}px "Nunito"`; const lines = []; let cur = '';
  for (const w of words) { const test = cur ? cur + ' ' + w.w : w.w; if (g.measureText(test).width > (o.max ?? V(1100, 760)) && cur) { lines.push(cur); cur = w.w; } else cur = test; } if (cur) lines.push(cur);
  let wi = 0; lines.forEach((ln, li) => { const parts = ln.split(' '); const lw = g.measureText(ln).width; let x = E.W / 2 - lw / 2; const ly = y + li * size * 1.3;
    if (li === 0 && o.speaker === 'guide') { g.fillStyle = PAL.accent; g.beginPath(); g.arc(x - size * 0.55, ly - size * 0.05, size * 0.16, 0, 7); g.fill(); }
    parts.forEach((p) => { const w = words[wi++]; const a = w ? clamp((t - w.t + 0.05) / 0.25) : 1; g.fillStyle = col; g.globalAlpha = 0.25 + 0.75 * a; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(p, x, ly); x += g.measureText(p + ' ').width; }); });
  g.restore();
}
