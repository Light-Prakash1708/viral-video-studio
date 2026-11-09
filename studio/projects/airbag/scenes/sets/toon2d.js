// sets/toon2d.js: 2D cartoon "card" characters placed inside 3D worlds (our own design: round heads, bold outlines,
// expressive dot eyes, poseable two-segment limbs). Redrawn every frame on a canvas texture, billboarded to the camera.
//   const c = toon(T, { hair:'side', hairCol:'#2a1a12', top:'#d8d0c0', s:1.0 }); st.add(c); c.pose(t, {expr, armL:[sh, el], armR:[sh, el], tilt, look, seated, blink}); c.face(camera)
import { clamp, lerp } from '/engine/core.js';

const INK = '#16120f';
function stroke(g, pts, w, col) { g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = w + 10; g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.stroke(); g.strokeStyle = col; g.lineWidth = w; g.stroke(); }
function blob(g, fill, path) { g.fillStyle = fill; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); path(); g.fill(); g.stroke(); }
const arm = (sx, sy, a1, a2, L1, L2) => { const ex = sx + Math.sin(a1) * L1, ey = sy + Math.cos(a1) * L1; return [[sx, sy], [ex, ey], [ex + Math.sin(a1 + a2) * L2, ey + Math.cos(a1 + a2) * L2]]; };

// draw one character into a 512 x 900 canvas (feet near y 880, head centre ~y 190)
export function drawToon(g, W, H, o, p) {
  g.clearRect(0, 0, W, H); const cx = W / 2, skin = o.skin || '#fbeee0', top = o.top || '#d8d0c0', bot = o.bottom || '#3a3a44', ex = p.expr || 'neutral';
  g.save(); g.translate(cx, 0); g.rotate(p.lean || 0); g.translate(-cx, 0);
  const sh = 400, hipY = p.seated ? 660 : 640;
  // legs
  if (!p.seated) { stroke(g, [[cx - 40, hipY], [cx - 44 + (p.stepL || 0), 760], [cx - 46, 860]], 34, bot); stroke(g, [[cx + 40, hipY], [cx + 44 + (p.stepR || 0), 760], [cx + 46, 860]], 34, bot);
    blob(g, '#2a2420', () => { g.ellipse(cx - 52, 872, 34, 16, 0, 0, 7); }); blob(g, '#2a2420', () => { g.ellipse(cx + 52, 872, 34, 16, 0, 0, 7); }); }
  else { stroke(g, [[cx - 40, hipY], [cx - 60, hipY + 40], [cx - 60, hipY + 150]], 34, bot); stroke(g, [[cx + 40, hipY], [cx + 60, hipY + 40], [cx + 60, hipY + 150]], 34, bot); }
  // arms behind/in front: compute
  const aL = p.armL || [0.15, 0.25], aR = p.armR || [-0.15, -0.25];
  const L = arm(cx - 78, sh + 20, -aL[0], -aL[1], 120, 110), R = arm(cx + 78, sh + 20, -aR[0], -aR[1], 120, 110);
  // torso (clothes) + collar
  blob(g, top, () => { g.moveTo(cx - 92, sh + 10); g.quadraticCurveTo(cx - 100, sh + 160, cx - 78, hipY + 6); g.lineTo(cx + 78, hipY + 6); g.quadraticCurveTo(cx + 100, sh + 160, cx + 92, sh + 10); g.quadraticCurveTo(cx, sh - 20, cx - 92, sh + 10); });
  if (o.tie) blob(g, o.tie, () => { g.moveTo(cx - 14, sh + 4); g.lineTo(cx + 14, sh + 4); g.lineTo(cx + 18, sh + 150); g.lineTo(cx, sh + 175); g.lineTo(cx - 18, sh + 150); g.closePath(); });
  if (o.dress) blob(g, top, () => { g.moveTo(cx - 80, hipY - 10); g.lineTo(cx + 80, hipY - 10); g.lineTo(cx + 120, hipY + 150); g.lineTo(cx - 120, hipY + 150); g.closePath(); });
  if (o.coat) { g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(cx, sh + 30); g.lineTo(cx, hipY); g.stroke(); }
  stroke(g, L, 30, top); stroke(g, R, 30, top);
  for (const A of [L, R]) blob(g, skin, () => { g.arc(A[2][0], A[2][1], 22, 0, 7); });
  // neck + head
  blob(g, skin, () => { g.rect(cx - 22, sh - 60, 44, 70); });
  g.save(); g.translate(cx, 190); g.rotate(p.tilt || 0);
  const hs = o.hair || 'side', hc = o.hairCol || '#2a1a12', R0 = (o.headR || 150);
  if (hs === 'long' || hs === 'bun' || hs === 'pigtails') blob(g, hc, () => { g.ellipse(0, 10, R0 * 1.08, R0 * 1.12, 0, 0, 7); });
  if (hs === 'pigtails') for (const d of [-1, 1]) blob(g, hc, () => { g.ellipse(d * R0 * 1.15, 30, 40, 70, d * 0.4, 0, 7); });
  for (const d of [-1, 1]) blob(g, skin, () => { g.ellipse(d * R0 * 0.97, R0 * 0.08, R0 * 0.16, R0 * 0.22, 0, 0, 7); });
  blob(g, skin, () => { g.arc(0, 0, R0, 0, 7); });
  g.save(); g.beginPath(); g.arc(0, 0, R0 - 3, 0, 7); g.clip(); const sg = g.createRadialGradient(-R0 * 0.35, -R0 * 0.45, R0 * 0.15, 0, 0, R0 * 1.05); sg.addColorStop(0, 'rgba(255,255,255,.22)'); sg.addColorStop(0.55, 'rgba(255,255,255,0)'); sg.addColorStop(1, 'rgba(150,70,40,.26)'); g.fillStyle = sg; g.fillRect(-R0, -R0, R0 * 2, R0 * 2); g.restore();
  // hair cap
  if (hs === 'side') blob(g, hc, () => { g.moveTo(-R0 * 0.98, -R0 * 0.1); g.quadraticCurveTo(-R0, -R0 * 1.1, R0 * 0.2, -R0 * 1.05); g.quadraticCurveTo(R0 * 1.02, -R0 * 0.9, R0 * 0.98, -R0 * 0.15); g.quadraticCurveTo(R0 * 0.3, -R0 * 0.75, -R0 * 0.98, -R0 * 0.1); });
  if (hs === 'long' || hs === 'bun' || hs === 'pigtails') blob(g, hc, () => { g.moveTo(-R0, -R0 * 0.05); g.quadraticCurveTo(-R0 * 0.9, -R0 * 1.15, 0, -R0 * 1.05); g.quadraticCurveTo(R0 * 0.9, -R0 * 1.15, R0, -R0 * 0.05); g.quadraticCurveTo(R0 * 0.4, -R0 * 0.62, -R0 * 0.1, -R0 * 0.55); g.quadraticCurveTo(-R0 * 0.6, -R0 * 0.5, -R0, -R0 * 0.05); });
  if (hs === 'bun') blob(g, hc, () => { g.arc(0, -R0 * 1.1, R0 * 0.32, 0, 7); });
  if (hs === 'bald') for (const d of [-1, 1]) blob(g, hc, () => { g.ellipse(d * R0 * 0.9, -R0 * 0.1, R0 * 0.18, R0 * 0.35, 0, 0, 7); });
  if (o.cap) blob(g, o.cap, () => { g.moveTo(-R0, -R0 * 0.25); g.quadraticCurveTo(0, -R0 * 1.45, R0, -R0 * 0.25); g.lineTo(R0 * 1.35, -R0 * 0.2); g.lineTo(R0 * 1.3, -R0 * 0.08); g.lineTo(-R0, -R0 * 0.12); g.closePath(); });
  // face
  const lx = (p.look || 0) * 14, ly = (p.lookY || 0) * 10, blink = p.blink;
  const eyeY = -R0 * 0.02, gap = R0 * 0.34, er = { shock: 22, scared: 20, surprised: 20, tired: 10, sad: 14, laugh: 4 }[ex] ?? 15;
  g.lineCap = 'round';
  for (const d of [-1, 1]) {
    if (blink || ex === 'laugh' || ex === 'sleep') { g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); if (ex === 'laugh') g.arc(d * gap, eyeY + 6, 14, Math.PI * 1.1, Math.PI * 1.9); else g.arc(d * gap, eyeY, 14, Math.PI * 0.1, Math.PI * 0.9); g.stroke(); continue; }
    if (er >= 18) { g.fillStyle = '#ffffff'; g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.arc(d * gap, eyeY, er + 10, 0, 7); g.fill(); g.stroke(); }
    g.fillStyle = INK; g.beginPath(); g.ellipse(d * gap + lx, eyeY + ly, er * 0.62, er * (ex === 'tired' ? 0.45 : 0.75), 0, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(d * gap + lx - 4, eyeY + ly - 5, 4, 0, 7); g.fill();
    if (ex === 'tired') { g.strokeStyle = '#9a7a8a'; g.lineWidth = 4; g.beginPath(); g.arc(d * gap, eyeY + 14, 18, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); }
  }
  // brows
  const bA = { angry: 0.35, determined: 0.25, sad: -0.35, worried: -0.4, scared: -0.45, tired: -0.15, shock: 0, surprised: 0, proud: 0.1 }[ex] ?? 0, bY = { shock: -22, surprised: -18, scared: -16 }[ex] ?? 0;
  g.strokeStyle = INK; g.lineWidth = 9; for (const d of [-1, 1]) { g.save(); g.translate(d * gap, -R0 * 0.32 + bY); g.rotate(d * bA); g.beginPath(); g.moveTo(-24, 0); g.lineTo(24, 0); g.stroke(); g.restore(); }
  // mouth
  g.lineWidth = 7; g.strokeStyle = INK; const my = R0 * 0.42; g.beginPath();
  if (ex === 'shock' || ex === 'scared') { g.fillStyle = '#5a1a1a'; g.ellipse(0, my, 22, 30, 0, 0, 7); g.fill(); g.stroke(); }
  else if (ex === 'surprised') { g.fillStyle = '#5a1a1a'; g.ellipse(0, my, 14, 16, 0, 0, 7); g.fill(); g.stroke(); }
  else if (ex === 'laugh' || ex === 'happy' || ex === 'proud') { g.fillStyle = '#5a1a1a'; g.moveTo(-40, my - 10); g.quadraticCurveTo(0, my + (ex === 'laugh' ? 50 : 30), 40, my - 10); g.closePath(); g.fill(); g.stroke(); }
  else if (ex === 'sad' || ex === 'worried' || ex === 'tired') { g.moveTo(-26, my + 10); g.quadraticCurveTo(0, my - 12, 26, my + 10); g.stroke(); }
  else if (ex === 'determined' || ex === 'angry') { g.moveTo(-26, my); g.lineTo(26, my); g.stroke(); }
  else if (ex === 'talk') { g.fillStyle = '#5a1a1a'; g.ellipse(0, my, 22, 10 + 8 * Math.abs(Math.sin((p.t || 0) * 18)), 0, 0, 7); g.fill(); g.stroke(); }
  else { g.moveTo(-20, my); g.quadraticCurveTo(0, my + 10, 20, my); g.stroke(); }
  if (o.mustache) blob(g, o.hairCol || '#2a1a12', () => { g.moveTo(-40, my - 18); g.quadraticCurveTo(0, my - 40, 40, my - 18); g.quadraticCurveTo(0, my - 26, -40, my - 18); });
  if (o.glasses) { g.strokeStyle = INK; g.lineWidth = 6; for (const d of [-1, 1]) { g.beginPath(); g.arc(d * gap, eyeY, 34, 0, 7); g.stroke(); } g.beginPath(); g.moveTo(-gap + 34, eyeY); g.lineTo(gap - 34, eyeY); g.stroke(); }
  if (ex === 'sad' && p.tear) { g.fillStyle = '#8ad0ff'; g.beginPath(); g.ellipse(-gap + 4, eyeY + 40 + ((p.t || 0) * 40) % 60, 8, 12, 0, 0, 7); g.fill(); }
  if (o.blush !== false) { g.fillStyle = 'rgba(255,120,120,.28)'; for (const d of [-1, 1]) { g.beginPath(); g.ellipse(d * R0 * 0.58, R0 * 0.28, 22, 12, 0, 0, 7); g.fill(); } }
  if (ex === 'sweat' || p.sweat) { g.fillStyle = '#8ad0ff'; g.beginPath(); g.ellipse(R0 * 0.8, -R0 * 0.4, 12, 20, 0.3, 0, 7); g.fill(); }
  g.restore(); g.restore();
}
// a billboard card in a three.js scene
export function toon(T, o = {}) {
  const { THREE } = T, Wc = 768, Hc = 900; const c = document.createElement('canvas'); c.width = Wc; c.height = Hc; const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const h = o.h || 1.7, mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.04, side: THREE.DoubleSide, depthWrite: true, toneMapped: false });
  const geo = new THREE.PlaneGeometry(h * Wc / Hc, h); geo.translate(0, h / 2, 0); const m = new THREE.Mesh(geo, mat); m.renderOrder = 2;
  const root = new THREE.Group(); root.add(m); root.userData = { g, tex, o, m, mat };
  root.pose = (t, p = {}) => { const bl = p.blink ?? (((t + (o.seed || 0) * 1.3) % 3.7) < 0.12); drawToon(g, Wc, Hc, o, { ...p, t, blink: bl && !['laugh', 'shock'].includes(p.expr) }); tex.needsUpdate = true; if (p.tint) mat.color.set(p.tint); return root; };
  const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _p = new THREE.Quaternion(), _Y = new THREE.Vector3(0, 1, 0);
  root.face = (cam, roll = 0) => { m.updateWorldMatrix(true, false); m.getWorldPosition(_v); _q.setFromAxisAngle(_Y, Math.atan2(cam.position.x - _v.x, cam.position.z - _v.z)); root.getWorldQuaternion(_p); m.quaternion.copy(_p.invert().multiply(_q)); if (roll) m.rotateZ(roll); return root; };
  root.pose(0, {}); return root;
}
