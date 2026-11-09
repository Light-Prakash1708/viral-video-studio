// sets/fc.js: "Friendship Countdown" world kit — cast, 3D locations, atmosphere, the floating day-count tags, HUD and cards.
import { E, V, ease, clamp, lerp, rng, alpha, text, rr, glow, prog, key, wordTime, mix, measure, circle, linGrad, radGrad } from '/engine/core.js';
import { bubble, lifeStage } from './lifesim.js';

// ---------------- cast (fixed for the whole video) ----------------
export const LOOK = {
  you:     { skin: '#b8866a', hoodie: '#3f7fd8', pants: '#2a3048', shoes: '#f0f0f6', hair: 'short', hairColor: '#1c1412', rim: '#9fd8ff', glasses: true },
  kabir:   { skin: '#a47458', hoodie: '#3c9a58', pants: '#3a3a44', shoes: '#e8e8ee', hair: 'cap', capColor: '#235a34', hairColor: '#120c0a', rim: '#ffc860' },
  riya:    { skin: '#c8987c', hoodie: '#ff7a5c', pants: '#e8e2ec', hair: 'pony', hairColor: '#24140e', rim: '#ffb0a0', blush: true },
  charger: { skin: '#b08468', hoodie: '#868c98', pants: '#3a3e48', hair: 'beanie', capColor: '#4a505c', rim: '#c8d4e8' },
  lib:     { skin: '#c09078', hoodie: '#8a5ad8', pants: '#2e2a40', hair: 'bun', hairColor: '#1e1210', rim: '#d8b0ff', glasses: false },
  fake:    { skin: '#b4886a', hoodie: '#f08a2a', pants: '#2a2a34', hair: 'short', hairColor: '#2a1a12', rim: '#ffb060' },
};
export const kid = (k) => ({ ...LOOK[k], s: 0.66, glasses: k === 'you' ? true : LOOK[k].glasses });
export const TAGC = { white: '#ffffff', amber: '#ffb43c', red: '#ff4d4d', gold: '#ffcf5a', inf: '#ffcf5a', cold: '#9cc8ff' };

export const faceTo = (p, x, z) => { p.rotation.y = Math.atan2(x - p.position.x, z - p.position.z); return p; };
export function person(T, st, look, pos = [0, 0], rotY = 0, o = {}) {
  const p = bubble(T, typeof look === 'string' ? LOOK[look] : look); p.position.set(pos[0], o.y || 0, pos[1]); p.rotation.y = rotY; st.add(p);
  p.set({ expr: o.expr || 'neutral', breathe: 0, ...(o.set || {}) }); return p;
}
// local time (inside the shot) of a spoken word
export const local = (info, t, w, after = 0) => { const x = wordTime(w, info.globalT - t - 0.3 + after); return x == null ? null : x - (info.globalT - t); };
export const at = (t, keys) => { let v = keys[0][1]; for (const [k, val] of keys) if (t >= k) v = val; return v; };
export const blinkAt = (t, seed = 0) => ((t + seed * 1.37) % 3.4) < 0.12;

// ---------------- camera + projection ----------------
export function cam(T, st, t, dur, from, to, e = ease.inOut) { const k = e(clamp(t / dur)); const v = { pos: from.pos.map((x, i) => lerp(x, to.pos[i], k)), look: from.look.map((x, i) => lerp(x, to.look[i], k)) }; st.camera.position.set(...v.pos); st.camera.lookAt(...v.look); if (from.fov) { st.camera.fov = lerp(from.fov, to.fov ?? from.fov, k); st.camera.updateProjectionMatrix(); } }
let _v = null;
export function proj(T, st, obj, dy = 0.6) {
  _v ||= new T.THREE.Vector3(); st.camera.updateMatrixWorld(); st.scene.updateMatrixWorld();
  if (obj.isVector3 || Array.isArray(obj)) _v.set(...(Array.isArray(obj) ? obj : obj.toArray())); else { (obj.userData?.head || obj).getWorldPosition(_v); const s = obj.userData?.body ? obj.userData.body.scale.y : 1; _v.y += dy * s; }
  const dist = st.camera.position.distanceTo(_v); _v.project(st.camera);
  return { x: (_v.x + 1) / 2 * E.W, y: (1 - _v.y) / 2 * E.H, vis: _v.z < 1 && _v.z > -1, dist, scale: 2.6 / dist };
}
export function shakeCam(st, t, amp = 0.02, f = 9) { st.camera.position.x += Math.sin(t * f) * amp; st.camera.position.y += Math.cos(t * f * 1.3) * amp * 0.7; }

// ---------------- the device: floating day-count tags ----------------
function lemniscate(g, x, y, r, lw, col, k = 1) { g.save(); g.lineWidth = lw; g.strokeStyle = col; g.lineCap = 'round'; g.beginPath(); const N = 80; for (let i = 0; i <= N * k; i++) { const a = (i / N) * Math.PI * 2, d = 1 + Math.sin(a) ** 2; const px = x + (r * Math.cos(a)) / d, py = y + (r * Math.sin(a) * Math.cos(a)) / d; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); g.restore(); }
export { lemniscate };
// P = proj() result. val: number | string | 'gold' | 'inf'.  o: {kind, s, a, t, pop (s since change), glitch, seed, sub}
export function tag(g, P, val, o = {}) {
  if (!P || !P.vis) return; const a = clamp(o.a ?? 1); if (a <= 0.01) return;
  P = { ...P, x: clamp(P.x, 140, E.W - 140), y: clamp(P.y, 120, E.H - 260) }; // keep every number pill fully on screen, clear of captions
  const t = o.t ?? 0, kind = o.kind || (val === 'gold' ? 'gold' : val === 'inf' ? 'inf' : typeof val === 'number' && val < 7 ? 'red' : 'white');
  const col = TAGC[kind] || kind, s0 = (o.s ?? 1) * clamp(P.scale, 0.28, 1.6);
  const pop = 1 + 0.35 * Math.max(0, 1 - (o.pop ?? 9) / 0.28), pulse = kind === 'red' ? 1 + 0.07 * Math.sin(t * 11) : 1, s = s0 * pop * pulse;
  const x = P.x + (o.dx || 0), y = P.y + Math.sin(t * 1.8 + (o.seed || 0)) * 5 * s0 + (o.dy || 0);
  g.save(); g.globalAlpha *= a;
  if (kind === 'gold') { glow(g, x, y, 150 * s, '#ffcf5a', 0.5); glow(g, x, y, 60 * s, '#fff2c0', 0.6);
    for (let i = 0; i < 9; i++) { const an = t * 0.6 + i * 0.7, r = (50 + 30 * Math.sin(t * 1.3 + i)) * s; circle(g, x + Math.cos(an) * r, y + Math.sin(an) * r * 0.55, (2.5 + (i % 3)) * s, alpha('#fff0b0', 0.7)); }
    g.restore(); return; }
  glow(g, x, y, 95 * s, col, kind === 'red' ? 0.32 + 0.12 * Math.sin(t * 11) : kind === 'inf' ? 0.45 : 0.22);
  if (kind === 'inf') { glow(g, x, y, 170 * s, '#ffcf5a', 0.25); const k = o.draw ?? 1;
    g.shadowColor = '#ffcf5a'; g.shadowBlur = 26 * s; lemniscate(g, x, y, 56 * s, 13 * s, '#ffe8a0', k); g.shadowBlur = 0; lemniscate(g, x, y, 56 * s, 5 * s, '#fffbe8', k);
    for (let i = 0; i < 12; i++) { const an = t * 0.5 + i * 0.52, r = (80 + 25 * Math.sin(t * 1.1 + i * 2)) * s; circle(g, x + Math.cos(an) * r, y + Math.sin(an) * r * 0.45, (2 + (i % 3)) * s, alpha('#fff0b0', 0.75)); }
    g.restore(); return; }
  const str = typeof val === 'number' ? val.toLocaleString('en-US') : String(val), size = 46 * s;
  g.font = `900 ${size}px "Nunito"`; const tw = g.measureText(str).width, w = tw + 44 * s, h = size * 1.3;
  rr(g, x - w / 2, y - h / 2, w, h, h / 2); g.fillStyle = 'rgba(10,12,30,.55)'; g.fill();
  g.strokeStyle = alpha(col, 0.9); g.lineWidth = 3 * s; g.shadowColor = col; g.shadowBlur = 16 * s; g.stroke(); g.shadowBlur = 0;
  g.beginPath(); g.moveTo(x - 9 * s, y + h / 2); g.lineTo(x, y + h / 2 + 11 * s); g.lineTo(x + 9 * s, y + h / 2); g.fillStyle = alpha(col, 0.9); g.fill();
  if (o.glitch) { const gx = o.glitch * 10 * s; text(g, str, x - gx, y + 2 * s, { size, font: 'Nunito', weight: 900, color: 'rgba(255,40,80,.7)' }); text(g, str, x + gx, y + 2 * s, { size, font: 'Nunito', weight: 900, color: 'rgba(40,220,255,.7)' }); }
  text(g, str, x, y + 2 * s, { size, font: 'Nunito', weight: 900, color: kind === 'white' ? '#ffffff' : mix(col, '#ffffff', 0.35), glow: 18 * s, glowColor: alpha(col, 0.9) });
  if (o.sub) text(g, o.sub, x, y + h * 0.95, { size: size * 0.36, font: 'Nunito', weight: 900, color: alpha('#ffffff', 0.85), spacing: 3 });
  g.restore();
}
// count helper: value that rolls from a to b between t0 and t1
export const roll = (t, t0, t1, a, b) => Math.round(lerp(a, b, ease.out(prog(t, t0, t1))));

// persistent HUD: the "friendship days" lens, top-left
export function hud(g, t, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0) return; const col = o.color || '#7fe8d8', x = V(70, 60), y = V(64, 90);
  g.save(); g.globalAlpha *= a; rr(g, x - 34, y - 30, 330, 60, 30); g.fillStyle = 'rgba(8,10,28,.5)'; g.fill(); g.strokeStyle = alpha(col, 0.45); g.lineWidth = 2; g.stroke();
  glow(g, x, y, 34, col, 0.35); g.strokeStyle = col; g.lineWidth = 3.5; g.beginPath(); g.ellipse(x, y, 19, 13, 0, 0, 7); g.stroke();
  circle(g, x, y, 7 + Math.sin(t * 3) * 0.8, col); circle(g, x + 2.5, y - 2.5, 2.2, '#ffffff');
  g.strokeStyle = alpha(col, 0.6); g.lineWidth = 2; g.beginPath(); g.arc(x, y, 25, -0.6 + t * 1.5, 0.9 + t * 1.5); g.stroke();
  text(g, o.label || 'FRIENDSHIP DAYS', x + 38, y - 7, { size: 21, font: 'Nunito', weight: 900, color: '#eef4ff', align: 'left', spacing: 3 });
  const on = Math.floor(t * 1.6) % 2 === 0; circle(g, x + 44, y + 13, 4, on ? col : alpha(col, 0.35));
  text(g, o.sub || 'LENS ACTIVE', x + 54, y + 14, { size: 14, font: 'Nunito', weight: 800, color: alpha('#cfe0ff', 0.8), align: 'left', spacing: 3 });
  g.restore();
}
// colour arc overlays
export function tone(g, kind, k = 1) {
  if (k <= 0) return; g.save();
  if (kind === 'warm') { g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha('#ffa040', 0.55 * k); g.fillRect(0, 0, E.W, E.H); g.globalCompositeOperation = 'multiply'; g.fillStyle = alpha('#ffe0b0', 0.25 * k); g.fillRect(0, 0, E.W, E.H);
    g.globalCompositeOperation = 'source-over'; const vg = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.3, E.W / 2, E.H / 2, E.W * 0.65); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, alpha('#3a1a08', 0.55 * k)); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H);
    // faint film dust
    const R = rng(Math.floor(E.fps * 0) + 3); for (let i = 0; i < 14; i++) { const x = R() * E.W, y = R() * E.H; if ((Math.floor(x + y) % 3) === 0) circle(g, x, y, 1.5, alpha('#fff0d0', 0.15 * k)); } }
  if (kind === 'cold') { g.globalCompositeOperation = 'saturation'; g.fillStyle = alpha('#808080', 0.45 * k); g.fillRect(0, 0, E.W, E.H); g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha('#2a5ad8', 0.6 * k); g.fillRect(0, 0, E.W, E.H); }
  if (kind === 'gold') { g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha('#ffc860', 0.4 * k); g.fillRect(0, 0, E.W, E.H); }
  g.restore();
}
export function vignette(g, v = 0.45) { const vg = g.createRadialGradient(E.W / 2, E.H / 2, Math.min(E.W, E.H) * 0.35, E.W / 2, E.H / 2, Math.max(E.W, E.H) * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(20,6,30,${v})`); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H); }
// top-band title, with its own darkened gradient so it never sits on the action
export function topBand(g, a = 1, h = 0.26) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.fillStyle = linGrad(g, 0, 0, 0, E.H * h, ['rgba(6,6,20,.72)', 'rgba(6,6,20,.35)', 'rgba(6,6,20,0)']); g.fillRect(0, 0, E.W, E.H * h); g.restore(); }
export function serif(g, str, x, y, o = {}) { text(g, str, x, y, { size: o.size || 44, font: 'Playfair Display', weight: 900, italic: true, color: o.color || '#f6ecd8', alpha: o.a ?? 1, spacing: o.spacing ?? 1, glow: 10, glowColor: 'rgba(0,0,0,.7)', align: o.align || 'center' }); }
export function bigText(g, str, x, y, o = {}) { let size = o.size || 84; g.save(); g.font = `700 ${size}px "Fredoka"`; const mw = g.measureText(str).width, max = o.max || E.W * 0.86; if (mw > max) size *= max / mw; g.restore();
  text(g, str, x, y, { size, font: 'Fredoka', weight: 700, color: o.color || '#fff4e4', alpha: o.a ?? 1, spacing: o.spacing ?? 2, glow: o.glow ?? 18, glowColor: o.glowColor || 'rgba(255,140,90,.55)', stroke: o.stroke || 0, strokeColor: 'rgba(0,0,0,.5)', align: o.align || 'center' }); }
export function cite(g, str, x, y, a = 1, align = 'center') { text(g, str, x, y, { size: 22, font: 'Nunito', weight: 800, color: '#b8c4e8', alpha: a * 0.9, spacing: 2, align }); }
// glass card panel
export function panel(g, x, y, w, h, a = 1, col = '#ff9a7a') { if (a <= 0) return; g.save(); g.globalAlpha *= a; rr(g, x, y, w, h, 26); g.fillStyle = 'rgba(12,12,34,.8)'; g.fill(); g.strokeStyle = alpha(col, 0.5); g.lineWidth = 2.5; g.stroke();
  rr(g, x, y, w, h, 26); g.save(); g.clip(); g.fillStyle = linGrad(g, 0, y, 0, y + h * 0.4, ['rgba(255,255,255,.06)', 'rgba(255,255,255,0)']); g.fillRect(x, y, w, h); g.restore(); g.restore(); }
export function darken(g, a = 0.4) { g.fillStyle = `rgba(8,6,24,${a})`; g.fillRect(0, 0, E.W, E.H); }
// little flat person icon for diagrams
export function icon(g, x, y, s, col, a = 1, o = {}) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s); glow(g, 0, -10, 60, col, o.glow ?? 0.18); g.fillStyle = col; g.beginPath(); g.arc(0, -36, 17, 0, 7); g.fill(); rr(g, -22, -16, 44, 46, 18); g.fill(); g.restore(); }
// chat bubble (2D)
export function chat(g, x, y, str, a = 1, o = {}) { if (a <= 0) return; const size = o.size || 30; g.save(); g.globalAlpha *= a; g.font = `800 ${size}px "Nunito"`; const w = g.measureText(str).width + size * 1.4, h = size * 1.9; const L = o.left;
  rr(g, x - w / 2, y - h / 2, w, h, h / 2.2); g.fillStyle = o.bg || 'rgba(245,247,255,.95)'; g.fill(); g.beginPath(); const tx = L ? x - w * 0.3 : x + w * 0.3; g.moveTo(tx - 10, y + h / 2 - 2); g.lineTo(tx + (L ? -16 : 16), y + h / 2 + 16); g.lineTo(tx + 12, y + h / 2 - 2); g.fill();
  text(g, str, x, y + 1, { size, font: 'Nunito', weight: 800, color: o.color || '#20202c' }); g.restore(); }

// ---------------- atmosphere (3D) ----------------
let _soft = null;
const softTex = (T) => (_soft ||= T.canvasTex(64, 64, (g, w, h) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.55, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }));
export function bokeh(T, st, o = {}) {
  const { THREE } = T, R = rng(o.seed || 23), n = o.n || 26, A = o.area || [-8, 8, 0.6, 5, -14, -8], cols = o.colors || ['#ffc070', '#ff8a9a', '#7fe8ff'], out = [];
  for (let i = 0; i < n; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex(T), color: new THREE.Color(cols[Math.floor(R() * cols.length)]), transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    const sc = (o.size || 0.7) * (0.5 + R()); m.scale.set(sc, sc, 1); m.position.set(lerp(A[0], A[1], R()), lerp(A[2], A[3], R()), lerp(A[4], A[5], R())); m.userData.seed = R() * 6; m.userData.base = m.position.clone(); st.add(m); out.push(m); }
  const op = o.opacity ?? 0.22; out.tick = (t, drift = 0) => out.forEach((m) => { m.material.opacity = op * (0.65 + 0.35 * Math.sin(t * 0.9 + m.userData.seed)); if (drift) m.position.x = m.userData.base.x + ((t * drift + m.userData.seed * 3) % 16) - 8; });
  out.tick(0); return out;
}
export function dust(T, st, o = {}) {
  const { THREE } = T, n = o.n || 160, R = rng(o.seed || 5), A = o.area || [-4, 4, 0, 3.5, -4, 2], geo = new THREE.BufferGeometry(), arr = new Float32Array(n * 3), seeds = [];
  for (let i = 0; i < n; i++) seeds.push([lerp(A[0], A[1], R()), lerp(A[2], A[3], R()), lerp(A[4], A[5], R()), R() * 6]);
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: new THREE.Color(o.color || '#ffe0b0'), size: o.size || 0.025, map: softTex(T), transparent: true, opacity: o.opacity ?? 0.7, blending: THREE.AdditiveBlending, depthWrite: false })); st.add(pts);
  pts.tick = (t) => { for (let i = 0; i < n; i++) { const [x, y, z, s] = seeds[i]; arr[i * 3] = x + Math.sin(t * 0.3 + s) * 0.25; arr[i * 3 + 1] = A[2] + ((y - A[2] + t * (o.rise ?? 0.05) + Math.sin(t * 0.5 + s) * 0.1) % (A[3] - A[2] || 1)); arr[i * 3 + 2] = z + Math.cos(t * 0.25 + s) * 0.2; } geo.attributes.position.needsUpdate = true; };
  pts.tick(0); return pts;
}
export function rain(T, st, o = {}) {
  const { THREE } = T, n = o.n || 1400, R = rng(9), A = o.area || [-5, 5, 0, 7, -12, 4], len = o.len || 0.35, geo = new THREE.BufferGeometry(), arr = new Float32Array(n * 6), seeds = [];
  for (let i = 0; i < n; i++) seeds.push([lerp(A[0], A[1], R()), R(), lerp(A[4], A[5], R()), 7 + R() * 3]);
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const ls = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: new THREE.Color(o.color || '#b0ccff'), transparent: true, opacity: o.opacity ?? 0.45, depthWrite: false, blending: THREE.AdditiveBlending })); st.add(ls);
  const H = A[3] - A[2];
  ls.tick = (t) => { for (let i = 0; i < n; i++) { const [x, y, z, v] = seeds[i]; const yy = A[2] + (((y * H - t * v) % H) + H) % H; arr[i * 6] = x; arr[i * 6 + 1] = yy; arr[i * 6 + 2] = z; arr[i * 6 + 3] = x - 0.03; arr[i * 6 + 4] = yy + len; arr[i * 6 + 5] = z; } geo.attributes.position.needsUpdate = true; };
  ls.tick(0);
  // splash rings on the ground
  const rings = [], rm = new THREE.MeshBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending });
  for (let i = 0; i < (o.splashes ?? 60); i++) { const m = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.045, 20), rm.clone()); m.rotation.x = -Math.PI / 2; m.userData = { x: lerp(A[0] * 0.8, A[1] * 0.8, R()), z: lerp(A[4] * 0.5, A[5], R()), ph: R() }; m.position.set(m.userData.x, 0.02, m.userData.z); st.add(m); rings.push(m); }
  ls.splash = (t) => rings.forEach((m) => { const u = (t * 1.6 + m.userData.ph) % 1; m.scale.setScalar(1 + u * 5); m.material.opacity = 0.45 * (1 - u); });
  return ls;
}
export function sprite(T, st, pos, size, color, op = 0.3) { const m = new T.THREE.Sprite(new T.THREE.SpriteMaterial({ map: softTex(T), color: new T.THREE.Color(color), transparent: true, opacity: op, depthWrite: false, blending: T.THREE.AdditiveBlending })); m.position.set(...pos); m.scale.set(...(Array.isArray(size) ? size : [size, size, 1])); st.add(m); return m; }
export function lamp(T, st, pos, color = '#ffc880', power = 5, dist = 7, o = {}) { const L = new T.THREE.PointLight(new T.THREE.Color(color), power, dist, 2); L.position.set(...pos); st.add(L);
  if (o.bulb !== false) { const b = new T.THREE.Mesh(new T.THREE.SphereGeometry(o.r || 0.09, 14, 10), new T.THREE.MeshBasicMaterial({ color: new T.THREE.Color(color).multiplyScalar(o.bright ?? 1) })); b.position.set(...pos); st.add(b); sprite(T, st, pos, o.halo || 0.9, color, 0.35); }
  return L; }
export function shaftAt(T, st, pos, rot, w, len, color = '#ffcf8a', op = 0.06) { const m = T.shaft(w, len, color, op); m.position.set(...pos); m.rotation.set(...rot); st.add(m); return m; }

// ---------------- textures ----------------
export function skyTex(T, stops, o = {}) {
  return T.canvasTex(o.w || 1024, o.h || 512, (g, W, H) => { g.fillStyle = linGrad(g, 0, 0, 0, H, stops); g.fillRect(0, 0, W, H); const R = rng(o.seed || 4);
    if (o.stars) for (let i = 0; i < o.stars; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + R() * 0.6})`; g.fillRect(R() * W, R() * H * 0.55, 1.5 + R() * 1.5, 1.5 + R() * 1.5); }
    if (o.sun) { const [sx, sy, sr, sc] = o.sun; const gr = g.createRadialGradient(sx * W, sy * H, 0, sx * W, sy * H, sr * W * 4); gr.addColorStop(0, sc); gr.addColorStop(0.15, alpha(sc, 0.6)); gr.addColorStop(1, alpha(sc, 0)); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#fff4d8'; g.beginPath(); g.arc(sx * W, sy * H, sr * W, 0, 7); g.fill(); }
    if (o.clouds) for (let i = 0; i < o.clouds; i++) { const cx = R() * W, cy = H * (0.2 + R() * 0.45), cw = 80 + R() * 220; g.fillStyle = alpha(o.cloudColor || '#ffb090', 0.18 + R() * 0.2); g.beginPath(); g.ellipse(cx, cy, cw, 6 + R() * 10, 0, 0, 7); g.fill(); }
    if (o.skyline) { const base = H * o.skyline; let x = 0; while (x < W) { const bw = 20 + R() * 60, bh = 20 + R() * (o.skyH || 120); g.fillStyle = o.skyColor || '#1a1636'; g.fillRect(x, base - bh, bw, bh + H); if (o.lit) for (let yy = base - bh + 6; yy < base - 4; yy += 9) for (let xx = x + 4; xx < x + bw - 4; xx += 8) if (R() < o.lit) { g.fillStyle = R() < 0.7 ? '#ffcf8a' : '#cfe8ff'; g.fillRect(xx, yy, 3, 4); } x += bw + R() * 6; } }
    if (o.trees) { const base = H * o.trees; g.fillStyle = o.treeColor || '#141028'; for (let i = 0; i < 30; i++) { const cx = R() * W, r = 20 + R() * 40; g.beginPath(); g.arc(cx, base - r * 0.6, r, 0, 7); g.fill(); } g.fillRect(0, base - 6, W, H); }
    if (o.mullions) { g.fillStyle = o.frame || '#0e0c1c'; for (let i = 0; i <= o.mullions; i++) g.fillRect((i * W) / o.mullions - 6, 0, 12, H); g.fillRect(0, H * 0.32, W, 10); g.fillRect(0, 0, W, 14); g.fillRect(0, H - 14, W, 14); }
  });
}
export function booksTex(T, seed = 3, o = {}) { return T.canvasTex(512, 512, (g, W, H) => { const R = rng(seed); g.fillStyle = '#1c1420'; g.fillRect(0, 0, W, H); const cols = o.cols || ['#7a2a3a', '#2a4a7a', '#3a6a4a', '#8a6a2a', '#5a3a6a', '#a04a2a', '#2a5a5a', '#c89a5a', '#4a2a2a'];
  for (let row = 0; row < 5; row++) { const y0 = row * (H / 5) + 10, hh = H / 5 - 22; let x = 6; while (x < W - 10) { const bw = 10 + R() * 18, bh = hh * (0.7 + R() * 0.3); g.fillStyle = cols[Math.floor(R() * cols.length)]; g.fillRect(x, y0 + hh - bh, bw, bh); g.fillStyle = 'rgba(255,230,180,.35)'; g.fillRect(x + 2, y0 + hh - bh + 8, bw - 4, 2); g.fillRect(x + 2, y0 + hh - 10, bw - 4, 2); x += bw + 1.5; if (R() < 0.05) x += 16; }
    g.fillStyle = '#3a2418'; g.fillRect(0, y0 + hh, W, 12); } }); }

// ---------------- stages per location ----------------
export const SKIES = {
  dusk: ['#141634', '#2c2a62', '#6a3e7a', '#d0687a', '#ffb07a'],
  night: ['#04060f', '#0a1030', '#1a1e48', '#2e2a5a'],
  golden: ['#2a3a6a', '#7a6a8a', '#ff9a5a', '#ffd890'],
  rainNight: ['#05080e', '#0c1420', '#162434'],
};
export function stageFor(T, kind, o = {}) {
  const P = {
    canteen: { sky: ['#0e1024', '#1a1838'], fogColor: '#1e1a3c', fog: [9, 34], key: 1.6, keyColor: '#ffd8b8', ambient: 1.25, ambientSky: '#8ab8d8', rim: '#ff9a7a', fill: '#5fd0d0' },
    library: { sky: ['#0a0c1c', '#141838'], fogColor: '#16162e', fog: [7, 26], key: 1.2, keyColor: '#ffd8a8', ambient: 1.0, ambientSky: '#7aa8d0', rim: '#ffa080', fill: '#5fc8d0' },
    golden: { sky: SKIES.golden, fogColor: '#c88a6a', fog: [10, 48], key: 2.6, keyColor: '#ffc890', keyPos: [0, 4, -20], ambient: 1.3, ambientSky: '#a8b0d8', rim: '#ffb070', fill: '#6ac8d0' },
    night: { sky: SKIES.night, fogColor: '#0e1430', fog: [10, 60], key: 0.7, keyColor: '#9ab8ff', keyPos: [-6, 9, 4], ambient: 0.75, ambientSky: '#5a7ad0', rim: '#ff9a7a', fill: '#4ac0d0' },
    rain: { sky: SKIES.rainNight, fogColor: '#0e1826', fog: [6, 34], key: 0.6, keyColor: '#a8c8ff', keyPos: [-4, 9, 3], ambient: 0.7, ambientSky: '#4a6aa0', rim: '#ffb070', fill: '#4ab8d0' },
    room: { sky: ['#06070f', '#0c0e1e'], fogColor: '#0c0c1c', fog: [6, 22], key: 0.5, keyColor: '#ffd0a0', ambient: 0.7, ambientSky: '#5a7ab0', rim: '#ff9a6a', fill: '#4ab0c8' },
    airport: { sky: ['#101430', '#242050'], fogColor: '#2a2652', fog: [12, 60], key: 1.6, keyColor: '#ffd8c0', keyPos: [3, 8, -10], ambient: 1.2, ambientSky: '#8ab0e0', rim: '#ff9a70', fill: '#5fd0d8' },
    void: { sky: ['#04040c', '#0a0a1a'], fogColor: '#06060e', fog: [6, 20], key: 0.9, keyColor: '#c8d8ff', keyPos: [0, 8, 2], ambient: 0.35, ambientSky: '#4a5a90', rim: '#7fb0ff', fill: '#3a5aa0' },
    sky: { sky: SKIES.dusk, fogColor: '#6a4a7a', fog: [60, 400], key: 1.4, keyColor: '#ffb08a', keyPos: [0, 2, -30], ambient: 1.0, ambientSky: '#8a8ad0', rim: '#ff9a7a', fill: '#5ac0d0' },
    taxi: { sky: ['#04050c', '#0a0c1a'], fogColor: '#0a0c18', fog: [4, 20], key: 0.4, keyColor: '#ffc890', ambient: 0.65, ambientSky: '#5a6ab0', rim: '#ff8a6a', fill: '#4ac8d8' },
    card: { sky: ['#0e1024', '#1a1838'], fogColor: '#1e1a3c', fog: [9, 34], key: 1.4, ambient: 1.2, ambientSky: '#8ab8d8', rim: '#ff9a7a', fill: '#5fd0d0' },
  }[kind];
  return lifeStage(T, { ...P, ...o });
}

// canteen: long room, dusk windows at the back, pendant lamps, tables, menu board, seated crowd
export function canteen(T, st, o = {}) {
  const { THREE } = T, R = rng(o.seed || 11), out = { lamps: [], heads: [] };
  const floor = T.ground(40, 40, '#3a3348', T.tiles('#4a4258', 10, [10, 10])); floor.material.roughness = 0.45; st.add(floor);
  if (o.ceiling !== false) st.add(T.box(40, 0.3, 40, T.mat('#1a1630'), 0, 4.4, 0));
  // back wall with a long dusk window
  st.add(T.box(30, 4.6, 0.3, T.mat('#2e2840'), 0, 2.2, -10.2));
  const win = new THREE.Mesh(new THREE.PlaneGeometry(22, 3.0), new THREE.MeshBasicMaterial({ map: skyTex(T, SKIES.dusk, { skyline: 0.82, skyH: 90, lit: 0.12, trees: 0.95, mullions: 10, sun: [0.62, 0.78, 0.018, '#ffd0a0'], clouds: 14 }), color: new THREE.Color(0.85, 0.85, 0.85), fog: false }));
  win.position.set(0, 2.2, -10.0); st.add(win);
  // side walls with posters / notice board
  st.add(T.box(0.3, 4.6, 30, T.mat('#2a2438'), -9, 2.2, -2)); st.add(T.box(0.3, 4.6, 30, T.mat('#2a2438'), 9, 2.2, -2));
  const posters = ['#ff7a5c', '#5fd0d0', '#ffcf5a', '#8a5ad8', '#3f7fd8'];
  for (let i = 0; i < 6; i++) { const p = T.box(0.04, 0.9 + R() * 0.4, 0.7, T.mat(posters[i % 5], { roughness: 0.6 }), -8.83, 2.1 + R() * 0.4, -7 + i * 2.2); st.add(p); const p2 = T.box(0.04, 0.8, 0.6, T.mat(posters[(i + 2) % 5], { roughness: 0.6 }), 8.83, 2.2, -7.5 + i * 2.4); st.add(p2); }
  // serving counter + menu board at left back
  st.add(T.box(5, 1.05, 1.0, T.mat('#5a3a2a', { roughness: 0.5 }), -5.5, 0.52, -8.2)); st.add(T.box(5.2, 0.06, 1.1, T.mat('#c8c0b8', { roughness: 0.3, metalness: 0.4 }), -5.5, 1.07, -8.2));
  const menu = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.3), new THREE.MeshBasicMaterial({ map: T.canvasTex(512, 210, (g, W, H) => { g.fillStyle = '#1a2a22'; g.fillRect(0, 0, W, H); g.strokeStyle = '#c8a060'; g.lineWidth = 8; g.strokeRect(4, 4, W - 8, H - 8); g.fillStyle = '#ffe8c0'; g.font = '700 40px Fredoka'; g.textAlign = 'center'; g.fillText('CANTEEN', W / 2, 52); g.font = '800 26px Nunito'; g.textAlign = 'left'; ['CHAI ........ 10', 'SAMOSA ...... 15', 'MAGGI ....... 40', 'COLD COFFEE . 35'].forEach((s, i) => g.fillText(s, 40 + (i % 2) * 240, 110 + Math.floor(i / 2) * 50)); }), color: new THREE.Color(0.8, 0.8, 0.8) }));
  menu.position.set(-5.5, 2.6, -10.0); st.add(menu);
  for (let i = 0; i < 5; i++) { st.add(T.cyl(0.08, 0.08, 0.28, T.mat('#c8c8d0', { metalness: 0.7, roughness: 0.3 }), -7.2 + i * 0.5, 1.24, -8.1)); }
  st.add(T.cyl(0.3, 0.3, 0.6, T.mat('#b8b8c0', { metalness: 0.8, roughness: 0.25 }), -3.6, 1.4, -8.2));       // chai urn
  // tables + benches (rows across x); the hero table at (0, 0.6) has no crowd
  const rows = o.rows || [[-3.4, -6.2], [3.4, -6.2], [-3.4, -3.0], [3.4, -3.0], [-3.6, 3.6], [3.6, 3.6], [-3.6, 6.6], [3.6, 6.6]];
  const tableM = T.mat('#8a5a3a', { roughness: 0.45 }), legM = T.mat('#2a2a30', { metalness: 0.6, roughness: 0.4 }), steel = T.mat('#d0d0d8', { metalness: 0.8, roughness: 0.25 });
  const table = (x, z, items = true) => { st.add(T.box(3.2, 0.06, 1.0, tableM, x, 0.62, z)); for (const dx of [-1.4, 1.4]) st.add(T.box(0.06, 0.6, 0.8, legM, x + dx, 0.3, z));
    for (const dz of [-0.75, 0.75]) st.add(T.box(3.2, 0.05, 0.32, tableM, x, 0.4, z + dz));
    if (items) for (let k = 0; k < 4; k++) { if (R() < 0.6) st.add(T.cyl(0.045, 0.04, 0.11, steel, x - 1.2 + k * 0.8 + R() * 0.2, 0.705, z + (R() - 0.5) * 0.5)); if (R() < 0.5) st.add(T.cyl(0.16, 0.14, 0.02, steel, x - 1.1 + k * 0.75, 0.66, z + (R() - 0.5) * 0.4)); } };
  rows.forEach(([x, z]) => table(x, z)); if (o.hero !== false) table(0, 0.6, o.heroItems !== false);
  // front wall (for reverse shots): warm corridor doorways
  st.add(T.box(30, 4.6, 0.3, T.mat('#2e2840'), 0, 2.2, 9.6));
  for (const x of [-5, 0, 5]) { const d = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffc890').multiplyScalar(0.7) })); d.position.set(x, 1.3, 9.44); d.rotation.y = Math.PI; st.add(d); }
  for (let i = 0; i < 4; i++) { const p = T.box(0.8, 1.0, 0.04, T.mat(posters[i % 5], { roughness: 0.6 }), -7 + i * 4.6 + 1.2, 2.4, 9.42); st.add(p); }
  // pendant lamps
  const lampAt = o.lamps || [[-3.4, -6.2], [3.4, -6.2], [-3.4, -3.0], [3.4, -3.0], [0, 0.6], [-3.6, 3.6], [3.6, 3.6]];
  lampAt.forEach(([x, z], i) => { st.add(T.cyl(0.006, 0.006, 1.2, T.mat('#111'), x, 3.8, z)); const sh = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.26, 24, 1, true), T.mat('#e8d0a0', { side: THREE.DoubleSide, roughness: 0.6 })); sh.position.set(x, 3.08, z); st.add(sh);
    out.lamps.push(lamp(T, st, [x, 2.94, z], '#ffc888', i === 4 ? 3.2 : 4.2, 7, { r: 0.07, halo: 0.7 })); shaftAt(T, st, [x, 1.9, z], [0, 0, 0], 1.4, 2.2, '#ffd8a0', 0.035); });
  // plants
  for (const [x, z] of [[-8, -9], [8, -9], [8, 2]]) { st.add(T.cyl(0.25, 0.2, 0.5, T.mat('#6a3a2a'), x, 0.25, z)); for (let k = 0; k < 4; k++) st.add(T.sphere(0.3 + R() * 0.15, T.mat('#2a5a3a', { flat: true }), x + (R() - 0.5) * 0.4, 0.75 + k * 0.22, z + (R() - 0.5) * 0.4)); }
  // seated crowd (instanced) at the far tables
  if (o.crowd !== false) { const seats = []; const clear = o.clear || []; for (const [x, z] of rows) for (const dz of [-0.9, 0.9]) for (let k = 0; k < 4; k++) if (R() < (o.density ?? 0.62)) { const sx = x - 1.2 + k * 0.8 + (R() - 0.5) * 0.15, sz = z + dz; if (!clear.some(([cx, cz]) => Math.hypot(cx - sx, cz - sz) < 0.7)) seats.push([sx, sz]); }
    const extra = (o.extraSeats || []); seats.push(...extra);
    const n = seats.length, hg = new THREE.SphereGeometry(0.3, 18, 12), bg = new THREE.CapsuleGeometry(0.2, 0.3, 4, 8);
    const heads = new THREE.InstancedMesh(hg, new THREE.MeshStandardMaterial({ roughness: 0.4 }), n), bodies = new THREE.InstancedMesh(bg, new THREE.MeshStandardMaterial({ roughness: 0.85 }), n);
    const m4 = new THREE.Matrix4(), c = new THREE.Color(), skins = ['#b8866a', '#a47458', '#c8987c', '#9c7058', '#ccA488'], cols = ['#e05a7a', '#f0a040', '#4a7fd8', '#5ab87a', '#9a6ad8', '#e8d050', '#e8e6f0', '#3ab0b0'];
    seats.forEach(([x, z], i) => { m4.makeTranslation(x, 1.42, z); heads.setMatrixAt(i, m4); heads.setColorAt(i, c.set(skins[i % 5])); m4.makeTranslation(x, 0.84, z); bodies.setMatrixAt(i, m4); bodies.setColorAt(i, c.set(cols[Math.floor(R() * cols.length)])); out.heads.push([x, 1.42, z]); });
    heads.castShadow = bodies.castShadow = true; st.add(heads, bodies); }
  out.bokeh = bokeh(T, st, { n: 22, area: [-9, 9, 1.2, 3.6, -9.6, -9.0], colors: ['#ffc070', '#ff9a8a', '#ffd8a0'], size: 0.9, opacity: 0.25 });
  out.dust = dust(T, st, { n: 140, area: [-6, 6, 0.4, 3.6, -7, 3], color: '#ffe0c0', size: 0.022, opacity: 0.55 });
  out.tick = (t) => { out.bokeh.tick(t); out.dust.tick(t); };
  return out;
}

// library: receding shelves, tall window with light shafts, reading table with a green lamp
export function library(T, st, o = {}) {
  const { THREE } = T, R = rng(o.seed || 21), out = {};
  const floor = T.ground(40, 40, '#3a2a24', T.planks('#4a3226', 22, [6, 6])); floor.material.roughness = 0.5; st.add(floor);
  st.add(T.box(40, 0.3, 40, T.mat('#120e18'), 0, 5.2, 0));
  st.add(T.box(24, 6, 0.3, T.mat('#2a2030'), 0, 3, -9));
  // tall arched-ish windows in the back wall
  for (const x of [-3.2, 0, 3.2]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 3.6), new THREE.MeshBasicMaterial({ map: skyTex(T, SKIES.dusk, { w: 256, h: 512, trees: 0.9, mullions: 2, stars: 40 }), color: new THREE.Color(0.8, 0.8, 0.85), fog: false })); w.position.set(x, 2.7, -8.83); st.add(w);
    shaftAt(T, st, [x + 0.9, 1.6, -6.0], [-0.5, 0, 0.35], 1.7, 6.5, '#ffc8a0', 0.05); }
  // shelves: rows on both sides
  const bm = [0, 1, 2, 3].map((k) => new THREE.MeshStandardMaterial({ map: booksTex(T, 5 + k), roughness: 0.8 }));
  const wood = T.mat('#3a2418', { roughness: 0.7 });
  const shelf = (x, z, rot) => { const g = new THREE.Group(); g.add(T.box(3.0, 3.2, 0.5, wood, 0, 1.6, 0)); const face = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 3.0), bm[Math.floor(R() * 4)]); face.position.set(0, 1.6, 0.26); g.add(face); const back = face.clone(); back.position.z = -0.26; back.rotation.y = Math.PI; g.add(back); g.position.set(x, 0, z); g.rotation.y = rot; st.add(g); };
  for (let i = 0; i < 4; i++) { shelf(-4.6, -6.5 + i * 2.6, Math.PI / 2); shelf(4.6, -6.5 + i * 2.6, -Math.PI / 2); }
  for (const x of [-7.5, 7.5]) for (let i = 0; i < 3; i++) shelf(x, -7.5 + i * 3.1, x < 0 ? Math.PI / 2 : -Math.PI / 2);
  // reading table + green lamp
  const tx = o.table?.[0] ?? 0, tz = o.table?.[1] ?? -1.5;
  st.add(T.box(2.6, 0.07, 1.2, T.mat('#5a3424', { roughness: 0.35 }), tx, 0.64, tz)); for (const dx of [-1.15, 1.15]) for (const dz of [-0.5, 0.5]) st.add(T.box(0.07, 0.62, 0.07, wood, tx + dx, 0.31, tz + dz));
  st.add(T.cyl(0.05, 0.08, 0.04, T.mat('#c8a050', { metalness: 0.8, roughness: 0.3 }), tx + 0.7, 0.69, tz - 0.25)); st.add(T.cyl(0.012, 0.012, 0.36, T.mat('#c8a050', { metalness: 0.8 }), tx + 0.7, 0.86, tz - 0.25));
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 0.14, 20, 1, true, 0, Math.PI), new THREE.MeshStandardMaterial({ color: '#1a6a3a', emissive: '#0a3a1a', emissiveIntensity: 0.3, side: THREE.DoubleSide, roughness: 0.4 })); shade.position.set(tx + 0.7, 1.06, tz - 0.25); shade.rotation.y = Math.PI / 2; st.add(shade);
  out.lamp = lamp(T, st, [tx + 0.7, 0.99, tz - 0.2], '#ffd890', 3.2, 4.5, { r: 0.04, halo: 0.5 });
  // books / papers on table
  for (let k = 0; k < 4; k++) st.add(T.box(0.32, 0.05, 0.24, T.mat(['#7a2a3a', '#2a4a7a', '#c89a5a', '#3a6a4a'][k], { roughness: 0.7 }), tx - 0.9 + (k % 2) * 0.12, 0.70 + Math.floor(k / 2) * 0.05 + (k % 2) * 0.05, tz - 0.3));
  const open = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.34), T.mat('#efe6d0', { roughness: 0.9 })); open.rotation.x = -Math.PI / 2; open.position.set(tx + 0.1, 0.68, tz + 0.15); st.add(open);
  // chairs
  for (const dx of [-0.6, 0.6]) for (const dz of [-0.9, 0.9]) { st.add(T.box(0.45, 0.05, 0.45, wood, tx + dx, 0.47, tz + dz)); st.add(T.box(0.45, 0.6, 0.05, wood, tx + dx, 0.78, tz + dz + Math.sign(dz) * 0.22)); }
  lamp(T, st, [-2.5, 4.2, -5], '#ffd8a8', 2.2, 8, { r: 0.12, halo: 1.2 }); lamp(T, st, [2.5, 4.2, -2], '#ffd8a8', 2.0, 8, { r: 0.12, halo: 1.2 });
  out.dust = dust(T, st, { n: 220, area: [-3.5, 3.5, 0.3, 4.2, -7, 1.5], color: '#ffe0b8', size: 0.02, opacity: 0.7, rise: 0.03 });
  out.bokeh = bokeh(T, st, { n: 14, area: [-4, 4, 1.5, 4.5, -8.5, -8], colors: ['#ffd8a0', '#a8c8ff'], size: 0.6 });
  out.tick = (t) => { out.dust.tick(t); out.bokeh.tick(t); };
  return out;
}

// the gully (Indian lane): two rows of houses, balconies, laundry lines, wires, water tanks, street lamps
export function gully(T, st, o = {}) {
  const { THREE } = T, R = rng(o.seed || 31), night = !!o.night, out = { lamps: [] };
  const ground = T.ground(10, 80, night ? '#20242c' : '#7a6050', T.tiles(night ? '#2a2c34' : '#8a6a54', 14, [3, 24])); ground.position.z = -25; ground.material.roughness = night ? 0.2 : 0.85; ground.material.metalness = night ? 0.3 : 0; st.add(ground);
  const walls = night ? ['#3a4a5a', '#4a3a4a', '#2e4a48', '#4a4436', '#3a3a5a'] : ['#e8a87a', '#f0c890', '#c8d8a0', '#a8c8d8', '#f0a0a0', '#e8d0a8', '#d8b0d8'];
  for (const side of [-1, 1]) { let z = 6; let i = 0; while (z > -46) { const w = 3 + R() * 2.5, h = 4 + R() * 5, d = 4, x = side * (2.6 + d / 2), col = walls[Math.floor(R() * walls.length)];
      const hm = T.mat(col, { roughness: 0.95 }); st.add(T.box(d, h, w, hm, x, h / 2, z - w / 2));
      const fx = side * 2.6;   // facade plane x
      for (let fl = 0; fl < Math.floor(h / 2.2); fl++) { const wy = 1.4 + fl * 2.2; for (const wz of [z - w * 0.28, z - w * 0.72]) { const lit = night ? R() < 0.55 : R() < 0.1; const wm = lit ? new THREE.MeshBasicMaterial({ color: new THREE.Color(R() < 0.75 ? '#ffc070' : '#a8d0ff').multiplyScalar(night ? 0.75 : 0.6) }) : T.mat('#1a1a24', { roughness: 0.3 });
          const wn = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.0), wm); wn.position.set(fx - side * 0.01, wy, wz); wn.rotation.y = -side * Math.PI / 2; st.add(wn);
          st.add(T.box(0.08, 0.06, 0.9, T.mat('#2a2a30'), fx - side * 0.04, wy - 0.55, wz)); }
        if (fl > 0 && R() < 0.5) { st.add(T.box(0.7, 0.08, w * 0.6, T.mat('#8a8a90', { metalness: 0.3 }), fx - side * 0.35, 2.2 * fl + 0.2, z - w / 2)); st.add(T.box(0.04, 0.6, w * 0.6, T.mat('#2a2a30', { metalness: 0.5 }), fx - side * 0.68, 2.2 * fl + 0.5, z - w / 2)); }
        if (R() < 0.25) st.add(T.box(0.35, 0.4, 0.7, T.mat('#d8d8d0'), fx - side * 0.18, 2.6 + fl * 2.2, z - w * 0.5)); }
      // door
      st.add(T.box(0.06, 2.0, 1.0, T.mat(['#6a3a2a', '#2a4a6a', '#5a2a3a'][i % 3]), fx - side * 0.03, 1.0, z - w * 0.5));
      if (R() < 0.5) st.add(T.cyl(0.4, 0.4, 0.8, T.mat('#2a2a2a', { roughness: 0.6 }), x, h + 0.4, z - w / 2));   // water tank
      z -= w + 0.05; i++; } }
  // wires and laundry lines across the lane
  const wireM = new THREE.MeshBasicMaterial({ color: night ? '#05060a' : '#2a2026' });
  for (let k = 0; k < 9; k++) { const z = 3 - k * 5 - R() * 2, y = 4.5 + R() * 2; const c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-2.6, y, z), new THREE.Vector3(0, y - 0.6, z + (R() - 0.5) * 2), new THREE.Vector3(2.6, y + (R() - 0.5), z + (R() - 0.5) * 1.5)); st.add(new THREE.Mesh(new THREE.TubeGeometry(c, 20, 0.012, 4), wireM));
    if (k % 2 === 0) { const ly = 3.2 + R() * 0.6, lz = z + 1.5; const lc = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-2.6, ly, lz), new THREE.Vector3(0, ly - 0.35, lz), new THREE.Vector3(2.6, ly, lz)); st.add(new THREE.Mesh(new THREE.TubeGeometry(lc, 20, 0.008, 4), wireM));
      for (let q = 0; q < 6; q++) { const u = 0.12 + q * 0.14, p = lc.getPoint(u); const cl = new THREE.Mesh(new THREE.PlaneGeometry(0.35 + R() * 0.2, 0.5 + R() * 0.3), T.mat(['#ff7a5c', '#ffcf5a', '#5fd0d0', '#e8e6f0', '#8a5ad8', '#3f7fd8'][Math.floor(R() * 6)], { side: THREE.DoubleSide, roughness: 0.9 })); cl.position.set(p.x, p.y - 0.3, p.z); cl.rotation.y = (R() - 0.5) * 0.4; st.add(cl); } } }
  // street lamps
  for (const [x, z] of (o.lampsAt || [[-2.3, -2], [2.3, -12], [-2.3, -22]])) { st.add(T.cyl(0.05, 0.06, 4.2, T.mat('#2a2a30', { metalness: 0.5 }), x, 2.1, z)); st.add(T.box(0.6, 0.05, 0.05, T.mat('#2a2a30'), x - Math.sign(x) * 0.3, 4.2, z));
    out.lamps.push(lamp(T, st, [x - Math.sign(x) * 0.55, 4.05, z], night ? '#ffb060' : '#ffd8a0', night ? 8 : 1.5, 10, { r: 0.1, halo: 1.4, bright: night ? 1 : 0.6 }));
    if (night) { shaftAt(T, st, [x - Math.sign(x) * 0.55, 2.0, z], [0, 0, 0], 2.0, 4.0, '#ffb060', 0.06); const pud = sprite(T, st, [x - Math.sign(x) * 0.55, 0.03, z + 0.6], [0.9, 2.4, 1], '#ffb060', 0.3); } }
  // a few parked scooters (simple)
  for (const [x, z] of [[1.9, -6], [-1.9, -15]]) { st.add(T.box(0.35, 0.45, 1.3, T.mat(night ? '#5a2a3a' : '#c84a3a', { roughness: 0.4, metalness: 0.2 }), x, 0.45, z)); for (const dz of [-0.5, 0.5]) { const wh = T.cyl(0.2, 0.2, 0.1, T.mat('#111'), x, 0.2, z + dz, 16); wh.rotation.z = Math.PI / 2; st.add(wh); } }
  if (night) { // puddles: glossy dark patches with lamp reflections
    for (let k = 0; k < 7; k++) { const p = new THREE.Mesh(new THREE.CircleGeometry(0.6 + R() * 0.7, 28), new THREE.MeshStandardMaterial({ color: '#0a0e16', roughness: 0.04, metalness: 0.95 })); p.rotation.x = -Math.PI / 2; p.scale.set(1, 0.6 + R() * 0.5, 1); p.position.set((R() - 0.5) * 3.4, 0.012, 2 - k * 3.2); st.add(p); }
    out.rain = rain(T, st, { area: [-3, 3, 0, 7, -16, 5] }); out.bokeh = bokeh(T, st, { n: 20, area: [-2.5, 2.5, 1, 6, -40, -24], colors: ['#ffb060', '#a8c8ff', '#ff8a6a'], size: 1.2, opacity: 0.25 }); }
  else { out.bokeh = bokeh(T, st, { n: 14, area: [-2.5, 2.5, 1, 6, -40, -26], colors: ['#ffd8a0', '#ffb070'], size: 1.4, opacity: 0.18 });
    shaftAt(T, st, [0, 3, -16], [-0.15, 0, 0], 5, 22, '#ffc890', 0.06); shaftAt(T, st, [1, 3.5, -10], [-0.2, 0.2, 0.15], 2.5, 18, '#ffd8a8', 0.045);
    out.dust = dust(T, st, { n: 200, area: [-2.4, 2.4, 0.2, 4, -10, 4], color: '#ffd8a0', size: 0.03, opacity: 0.7 }); }
  out.tick = (t) => { out.bokeh?.tick(t); out.dust?.tick(t); out.rain?.tick(t); out.rain?.splash(t); };
  return out;
}
// cricket kit: wickets + bat in a hand + ball
export function wickets(T, st, x, z) { const g = new T.THREE.Group(); for (const dx of [-0.11, 0, 0.11]) g.add(T.cyl(0.018, 0.018, 0.72, T.mat('#e8d8b0'), dx, 0.36, 0)); g.add(T.box(0.26, 0.02, 0.02, T.mat('#e8d8b0'), 0, 0.73, 0)); g.position.set(x, 0, z); st.add(g); return g; }
// a real cricket bat: willow blade (extruded, bevelled, with a spine), shoulders, handle with a rubber grip; returns the WRIST pivot
export function giveBat(T, p) { const { THREE } = T; const wrist = new THREE.Group(); wrist.position.y = -0.42; p.userData.arms[1].children[0].parent.add(wrist);
  const willow = T.mat('#e6cc94', { roughness: 0.55 }), edge = T.mat('#d4b27a', { roughness: 0.6 });
  const sh = new THREE.Shape(); sh.moveTo(-0.055, 0); sh.lineTo(0.055, 0); sh.lineTo(0.058, -0.5); sh.quadraticCurveTo(0.058, -0.56, 0.0, -0.565); sh.quadraticCurveTo(-0.058, -0.56, -0.058, -0.5); sh.closePath();
  const bladeGeo = new THREE.ExtrudeGeometry(sh, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 10 }); bladeGeo.translate(0, 0, -0.011);
  const blade = new THREE.Mesh(bladeGeo, willow); blade.position.y = -0.2; blade.castShadow = true; wrist.add(blade);
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.022, 0.42, 12, 1, false, 0, Math.PI), edge); spine.rotation.y = Math.PI / 2; spine.scale.z = 0.6; spine.position.set(0, -0.48, -0.012); wrist.add(spine);
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.05, 14), willow); shoulder.scale.z = 0.45; shoulder.position.y = -0.18; wrist.add(shoulder);
  wrist.add(T.cyl(0.016, 0.016, 0.2, T.mat('#c8b080'), 0, -0.07, 0, 12));
  const grip = T.cyl(0.021, 0.021, 0.17, T.mat('#1c1c22', { roughness: 0.9 }), 0, -0.05, 0, 14); wrist.add(grip);
  for (let k = 0; k < 4; k++) wrist.add(T.cyl(0.0215, 0.0215, 0.012, T.mat('#b8282a'), 0, 0.02 - k * 0.045, 0, 14));
  const sticker = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.12), new THREE.MeshBasicMaterial({ map: T.canvasTex(64, 112, (c, w, h) => { c.fillStyle = '#1a2a6a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f0c020'; c.fillRect(6, 8, w - 12, 10); c.fillRect(6, h - 18, w - 12, 10); c.beginPath(); c.arc(w / 2, h / 2, 16, 0, 7); c.fill(); }) })); sticker.position.set(0, -0.3, 0.018); wrist.add(sticker);
  return wrist; }
// red leather ball with a white stitched seam; spins in flight; .trail(points) draws a fading motion trail; .burst(k) impact sparks
export function ball(T, st) { const { THREE } = T;
  const tex = T.canvasTex(256, 128, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#d8302e'); gr.addColorStop(0.5, '#b01e22'); gr.addColorStop(1, '#8a1418'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.fillStyle = '#f4ece0'; c.fillRect(0, h / 2 - 5, w, 10); c.strokeStyle = '#7a1a18'; c.lineWidth = 2; for (let x = 2; x < w; x += 8) { c.beginPath(); c.moveTo(x, h / 2 - 9); c.lineTo(x + 4, h / 2 - 5); c.moveTo(x, h / 2 + 9); c.lineTo(x + 4, h / 2 + 5); c.stroke(); } });
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.046, 28, 18), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.05, emissive: new THREE.Color('#ff4a3a'), emissiveIntensity: 0.25 })); b.castShadow = true; st.add(b);
  const ghosts = []; for (let i = 0; i < 7; i++) { const gm = new THREE.Mesh(new THREE.SphereGeometry(0.034 * (1 - i * 0.09), 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd0b0, transparent: true, opacity: 0, depthWrite: false })); st.add(gm); ghosts.push(gm); }
  const sparkGeo = new THREE.BufferGeometry(), sp = new Float32Array(24 * 3), dirs = []; const R = rng(5); for (let i = 0; i < 24; i++) dirs.push([R() - 0.5, R() * 0.8, R() - 0.5]); sparkGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xfff0c0, size: 0.022, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); st.add(sparks);
  const flash = new THREE.PointLight(0xfff0d0, 0, 3, 2); st.add(flash);
  b.trail = (pts, speed = 1) => ghosts.forEach((gm, i) => { const q = pts[i]; if (!q) { gm.material.opacity = 0; return; } gm.position.set(...q); gm.material.opacity = 0.45 * (1 - i / ghosts.length) * Math.min(1, speed); });
  b.burst = (at, k) => { const on = k > 0 && k < 1; sparks.material.opacity = on ? 0.95 * (1 - k) : 0; flash.intensity = on ? 0.9 * (1 - k) : 0; flash.position.set(at[0] + 0.3, at[1] + 0.2, at[2] - 0.3);
    for (let i = 0; i < 24; i++) { const d = dirs[i]; sp[i * 3] = at[0] + d[0] * k * 0.9; sp[i * 3 + 1] = at[1] + d[1] * k * 0.9 - k * k * 0.3; sp[i * 3 + 2] = at[2] + d[2] * k * 0.9; } sparkGeo.attributes.position.needsUpdate = true; };
  return b; }
// a real delivery: release from the bowler's hand, pitch (bounce) once, rise into the bat at hitT, then lofted away. Returns [x,y,z].
export function deliveryPos(t, o) { const { rel = 0.0, hitT, from = [0.2, 1.95, -8.4], pitch = [0.16, 0.04, -2.7], bat = [0.12, 0.58, -0.78], loft = [-1.6, 5.2, -6.5] } = o;
  const tp = rel + (hitT - rel) * 0.72;
  if (t <= rel) return from;
  if (t < tp) { const u = (t - rel) / (tp - rel); return [lerp(from[0], pitch[0], u), lerp(from[1], pitch[1], u) + Math.sin(u * Math.PI) * 0.35 * (1 - u), lerp(from[2], pitch[2], u)]; }
  if (t < hitT) { const u = (t - tp) / (hitT - tp); return [lerp(pitch[0], bat[0], u), lerp(pitch[1], bat[1], u) + Math.sin(u * Math.PI) * 0.12, lerp(pitch[2], bat[2], u)]; }
  const d = t - hitT; return [bat[0] + loft[0] * d, bat[1] + loft[1] * d - 4.9 * d * d, bat[2] + loft[2] * d]; }
// swing curve for the bat wrist: back-lift -> through the ball at hitT -> high follow-through
export function batSwing(t, hitT) { const back = ease.inOut(prog(t, hitT - 0.9, hitT - 0.3)), through = ease.in(prog(t, hitT - 0.3, hitT)), follow = ease.out(prog(t, hitT, hitT + 0.35));
  return { rx: -0.2 - 1.6 * back + 2.6 * through + 0.9 * follow, rz: 0.25 * back - 0.5 * through - 0.3 * follow, arm: 0.3 + 1.2 * back - 0.6 * through + 1.4 * follow }; }

// a small bedroom-study: desk, lamp, books, window with a night city, posters
export function deskRoom(T, st, o = {}) {
  const { THREE } = T, out = {};
  st.add(T.ground(20, 20, '#2a2228', T.planks('#3a2a26', 14, [4, 4])));
  st.add(T.box(12, 4, 0.2, T.mat('#2e3048'), 0, 2, -2.6)); st.add(T.box(0.2, 4, 10, T.mat('#2a2c44'), -3.5, 2, 0));
  const w = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.4), new THREE.MeshBasicMaterial({ map: skyTex(T, SKIES.night, { w: 512, h: 400, stars: 80, skyline: 0.9, skyH: 160, lit: 0.25, mullions: 2 }), color: new THREE.Color(0.85, 0.85, 0.9) })); w.position.set(1.3, 2.1, -2.48); st.add(w);
  // desk
  const wood = T.mat('#6a4430', { roughness: 0.5 }); st.add(T.box(2.4, 0.06, 1.0, wood, 0, 0.78, -1.9)); for (const dx of [-1.1, 1.1]) st.add(T.box(0.06, 0.76, 0.9, wood, dx, 0.38, -1.9));
  // lamp
  st.add(T.cyl(0.1, 0.12, 0.03, T.mat('#2a2a30', { metalness: 0.6 }), -0.75, 0.83, -2.1)); const arm = T.cyl(0.012, 0.012, 0.5, T.mat('#2a2a30', { metalness: 0.6 }), -0.75, 1.07, -2.1); arm.rotation.z = 0.3; st.add(arm);
  const hd = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.18, 20, 1, true), T.mat('#e8a040', { side: THREE.DoubleSide, roughness: 0.4 })); hd.position.set(-0.6, 1.32, -2.0); hd.rotation.z = -0.5; st.add(hd);
  out.lamp = lamp(T, st, [-0.55, 1.24, -1.95], '#ffc878', 4.0, 4, { r: 0.04, halo: 0.6 });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.3, 32, 1, true), new THREE.MeshBasicMaterial({ color: '#ffc878', transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })); cone.position.set(-0.35, 0.85, -1.85); cone.rotation.z = -0.35; st.add(cone);
  // books, notes, mugs
  const cols = ['#7a2a3a', '#2a4a7a', '#c89a5a', '#3a6a4a', '#5a3a6a'];
  for (let k = 0; k < 6; k++) st.add(T.box(0.34, 0.06, 0.25, T.mat(cols[k % 5], { roughness: 0.7 }), 0.85, 0.84 + k * 0.06, -2.15));
  for (let k = 0; k < 5; k++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.32), T.mat('#f2ecdc')); p.rotation.x = -Math.PI / 2; p.rotation.z = (k - 2) * 0.3; p.position.set(-0.2 + k * 0.17, 0.815 + k * 0.001, -1.75 + (k % 2) * 0.1); st.add(p); }
  st.add(T.cyl(0.05, 0.045, 0.1, T.mat('#e8e8f0'), 0.45, 0.86, -1.65));
  // posters + clock
  for (const [x, y, c] of [[-1.6, 2.4, '#ff7a5c'], [-0.4, 2.6, '#5fd0d0'], [2.6, 2.4, '#ffcf5a']]) st.add(T.box(0.7, 0.9, 0.03, T.mat(c, { roughness: 0.7 }), x, y, -2.48));
  const clk = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), new THREE.MeshBasicMaterial({ map: T.canvasTex(128, 128, (g) => { g.fillStyle = '#f0e8d8'; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.strokeStyle = '#222'; g.lineWidth = 6; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 22); g.moveTo(64, 64); g.lineTo(90, 70); g.stroke(); }), color: new THREE.Color(0.7, 0.7, 0.7) })); clk.position.set(0.2, 3.1, -2.48); st.add(clk);
  out.dust = dust(T, st, { n: 90, area: [-1.2, 0.6, 0.8, 1.8, -2.3, -1.2], color: '#ffd8a0', size: 0.012, opacity: 0.7, rise: 0.02 });
  out.tick = (t) => out.dust.tick(t);
  return out;
}

// rooftop at night above the city
export function rooftop(T, st, o = {}) {
  const { THREE } = T, R = rng(o.seed || 41), out = {};
  st.add(T.ground(30, 30, '#2a2a34', T.tiles('#30303a', 12, [6, 6])));
  st.add(T.box(14, 0.9, 0.3, T.mat('#4a4a58', { roughness: 0.9 }), 0, 0.45, -2.2));     // ledge
  st.add(T.box(0.3, 0.9, 10, T.mat('#4a4a58'), -6, 0.45, 2));
  st.add(T.cyl(0.7, 0.7, 1.5, T.mat('#2a2a2a', { roughness: 0.5 }), -4.2, 2.1, 1.5)); for (const dx of [-0.5, 0.5]) st.add(T.box(0.06, 1.4, 0.06, T.mat('#3a3a40'), -4.2 + dx, 0.7, 1.5));
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 10, 0, Math.PI * 2, 0, 0.9), T.mat('#c8c8d0', { side: THREE.DoubleSide })); dish.position.set(4.2, 1.2, 0.8); dish.rotation.x = -1.0; st.add(dish);
  // city below/far: buildings with lit windows
  for (let i = 0; i < 46; i++) { const w = 2 + R() * 4, h = 4 + R() * 26, d = 3 + R() * 4; const b = T.building(w, h, d, { color: ['#1a1a34', '#22203e', '#1a2236'][i % 3], win: R() < 0.7 ? '#ffc070' : '#a8d0ff', lit: 0.3 + R() * 0.4, seed: i + 3 }); b.position.set(-60 + R() * 120, -18 + h / 2 - h / 2, -22 - R() * 60); b.position.y = -14; st.add(b); }
  // sky with stars + moon
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(400, 160), new THREE.MeshBasicMaterial({ map: skyTex(T, ['#04060f', '#0c1236', '#2a2a5e', '#6a3a6a'], { stars: 260, h: 1024 }), fog: false })); sky.position.set(0, 30, -120); st.add(sky);
  sprite(T, st, [26, 34, -110], 6, '#fff0d0', 0.85); sprite(T, st, [26, 34, -110], 26, '#a8b8ff', 0.18);
  // string lights along the ledge
  const pts = []; for (let k = 0; k < 22; k++) { const x = -6 + k * 0.57, y = 2.0 - Math.sin((k / 21) * Math.PI) * 0.35; pts.push(new THREE.Vector3(x, y, -2.0)); const b = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), new THREE.MeshBasicMaterial({ color: k % 3 ? '#ffc878' : '#ff9a7a' })); b.position.set(x, y - 0.06, -2.0); st.add(b); }
  st.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.005, 4), new THREE.MeshBasicMaterial({ color: '#0a0a10' })));
  for (let k = 0; k < 3; k++) lamp(T, st, [-4 + k * 4, 2.8, -3.2], '#ffc070', 0.9, 5, { bulb: false });
  out.bokeh = bokeh(T, st, { n: 40, area: [-30, 30, -6, 10, -40, -26], colors: ['#ffc070', '#a8d0ff', '#ff7a5c', '#ffd8a0'], size: 2.2, opacity: 0.22 });
  out.tick = (t) => out.bokeh.tick(t);
  return out;
}

// airport gate: glossy floor, glass wall with dusk + plane outside, seats, departures board, ceiling light strips
export function airport(T, st, o = {}) {
  const { THREE } = T, R = rng(o.seed || 51), out = {};
  const floor = T.ground(60, 60, '#2a2a3a', T.tiles('#34344a', 16, [12, 12])); floor.material.roughness = 0.18; floor.material.metalness = 0.25; st.add(floor);
  st.add(T.box(60, 0.3, 60, T.mat('#1a1a2c'), 0, 7.2, 0));
  for (let k = 0; k < 7; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color('#e8f0ff').multiplyScalar(0.8) })); s.position.set(-12 + k * 4, 7.0, -4); st.add(s); }
  // glass wall at the back (dusk outside)
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(60, 7), new THREE.MeshBasicMaterial({ map: skyTex(T, SKIES.dusk, { w: 2048, h: 256, sun: [0.55, 0.92, 0.008, '#ffd0a0'], clouds: 26, skyline: 0.97, skyH: 14, lit: 0.1, mullions: 24 }), color: new THREE.Color(0.85, 0.85, 0.85), fog: false })); glass.position.set(0, 3.5, -16); st.add(glass);
  // plane parked outside (silhouette)
  const pl = plane3D(T, { color: '#1a1830' }); pl.position.set(o.planeX ?? 6, 2.2, -24); pl.rotation.y = -0.3; pl.scale.setScalar(1.6); st.add(pl); out.plane = pl;
  for (let k = 0; k < 14; k++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: k % 2 ? '#7fd0ff' : '#ffcf5a' })); l.position.set(-30 + k * 4.6, 0.1, -21); st.add(l); }
  // pillars
  for (const x of [-10, 10]) st.add(T.box(0.8, 7, 0.8, T.mat('#3a3a50', { roughness: 0.5 }), x, 3.5, -6));
  // gate sign + departure board
  const board = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.4), new THREE.MeshBasicMaterial({ map: T.canvasTex(768, 256, (g, W, H) => { g.fillStyle = '#06080e'; g.fillRect(0, 0, W, H); g.font = '900 34px Nunito'; g.fillStyle = '#ffcf5a'; g.fillText('DEPARTURES', 24, 44); g.font = '800 28px Nunito';
    [['AC 873', 'TORONTO', 'BOARDING', '#5fe8a8'], ['AI 191', 'NEWARK', 'ON TIME', '#e8f0ff'], ['EK 507', 'DUBAI', 'ON TIME', '#e8f0ff'], ['LH 761', 'FRANKFURT', 'DELAYED', '#ff7a5c']].forEach(([f, c, s, col], i) => { g.fillStyle = '#e8f0ff'; g.fillText(f, 24, 92 + i * 42); g.fillText(c, 190, 92 + i * 42); g.fillStyle = col; g.fillText(s, 520, 92 + i * 42); }); }), color: new THREE.Color(0.85, 0.85, 0.85) }));
  board.position.set(o.boardX ?? -5, 4.6, -8); st.add(board); st.add(T.box(4.4, 1.6, 0.1, T.mat('#14141c'), board.position.x, 4.6, -8.07));
  const gate = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.7), new THREE.MeshBasicMaterial({ map: T.canvasTex(256, 100, (g, W, H) => { g.fillStyle = '#ffcf3a'; g.fillRect(0, 0, W, H); g.fillStyle = '#14141c'; g.font = '900 52px Nunito'; g.textAlign = 'center'; g.fillText('GATE 21', W / 2, 70); }), color: new THREE.Color(0.8, 0.8, 0.8) }));
  gate.position.set(o.gateX ?? 3, 4.2, -9); st.add(gate);
  // seat rows
  const seatM = T.mat('#3a5a8a', { roughness: 0.5 }), metal = T.mat('#8a8a98', { metalness: 0.7, roughness: 0.3 });
  for (const [x, z] of (o.seats || [[-6, -3], [-6, -5], [6, -4.5], [-6, 1], [7, 0.5]])) { st.add(T.box(4, 0.06, 0.5, metal, x, 0.44, z)); for (let k = 0; k < 6; k++) { st.add(T.box(0.55, 0.08, 0.5, seatM, x - 1.6 + k * 0.64, 0.5, z)); st.add(T.box(0.55, 0.5, 0.06, seatM, x - 1.6 + k * 0.64, 0.78, z - 0.24)); } }
  // distant standing travellers (instanced)
  const n = 40, hg = new THREE.SphereGeometry(0.3, 16, 10), bg = new THREE.CapsuleGeometry(0.2, 0.34, 4, 8);
  const heads = new THREE.InstancedMesh(hg, new THREE.MeshStandardMaterial({ roughness: 0.4 }), n), bodies = new THREE.InstancedMesh(bg, new THREE.MeshStandardMaterial({ roughness: 0.85 }), n);
  const m4 = new THREE.Matrix4(), c = new THREE.Color(); const cols = ['#e05a7a', '#f0a040', '#4a7fd8', '#5ab87a', '#9a6ad8', '#e8e6f0', '#3a3a48'];
  for (let i = 0; i < n; i++) { const x = -14 + R() * 28, z = -9 - R() * 5; if (Math.abs(x - (o.clearX ?? 0)) < 2.5) continue; m4.makeTranslation(x, 1.62, z); heads.setMatrixAt(i, m4); heads.setColorAt(i, c.set(['#c68a62', '#b07850', '#d49a74', '#e8c0a0'][i % 4])); m4.makeTranslation(x, 0.95, z); bodies.setMatrixAt(i, m4); bodies.setColorAt(i, c.set(cols[Math.floor(R() * cols.length)])); }
  st.add(heads, bodies);
  // suitcases
  for (const [x, z, col] of [[-3.5, -2, '#c84a3a'], [4.5, -1.2, '#3a6a8a']]) { st.add(T.box(0.4, 0.6, 0.25, T.mat(col, { roughness: 0.4 }), x, 0.32, z)); }
  lamp(T, st, [-6, 6.4, -2], '#e8f0ff', 3, 14, { bulb: false }); lamp(T, st, [6, 6.4, -2], '#e8f0ff', 3, 14, { bulb: false });
  out.bokeh = bokeh(T, st, { n: 26, area: [-20, 20, 0.5, 5, -15.5, -15], colors: ['#ffc070', '#7fd0ff', '#ff8a8a'], size: 1.0, opacity: 0.25 });
  out.dust = dust(T, st, { n: 100, area: [-6, 6, 0.5, 5, -8, 3], color: '#ffe8d0', size: 0.02, opacity: 0.4 });
  out.tick = (t) => { out.bokeh.tick(t); out.dust.tick(t); };
  return out;
}
// a jet airliner (low poly), nose along +x
export function plane3D(T, o = {}) { const { THREE } = T, g = new THREE.Group(), m = T.mat(o.color || '#e8eaf0', { roughness: 0.4, metalness: 0.2 }), d = T.mat(o.trim || o.color || '#2a3a6a');
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 7, 8, 20), m); body.rotation.z = Math.PI / 2; g.add(body);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 9), m); wing.position.set(-0.4, -0.2, 0); g.add(wing); const wing2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 3.4), m); wing2.position.set(-3.9, 0.2, 0); g.add(wing2);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 0.1), d); fin.position.set(-3.9, 1.2, 0); fin.rotation.z = 0.35; g.add(fin);
  for (const z of [-2, 2]) { const e = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.0, 14), d); e.rotation.z = Math.PI / 2; e.position.set(0.1, -0.55, z); g.add(e); }
  if (o.lights) { for (const [z, c] of [[-4.5, '#ff3a3a'], [4.5, '#3aff7a']]) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshBasicMaterial({ color: c })); b.position.set(-0.4, -0.15, z); g.add(b); } }
  return g; }

// a phone (3D) with a canvas screen; draw(g, W, H) paints the screen once
export function phone3D(T, draw, o = {}) { const { THREE } = T, g = new THREE.Group(); g.add(T.box(0.36, 0.72, 0.03, T.mat('#14141c', { roughness: 0.3, metalness: 0.5 }), 0, 0, 0));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.68), new THREE.MeshBasicMaterial({ map: T.canvasTex(330, 680, draw), color: new THREE.Color(o.bright ?? 0.88, o.bright ?? 0.88, o.bright ?? 0.88) })); scr.position.z = 0.017; g.add(scr); g.userData.screen = scr; return g; }
// mom on a video call (2D painter for the phone screen)
export function momCall(g, W, H) {
  g.fillStyle = linGrad(g, 0, 0, 0, H, ['#5a3a2a', '#c8844a', '#ffd08a']); g.fillRect(0, 0, W, H);
  const gr = g.createRadialGradient(W / 2, H * 0.42, 10, W / 2, H * 0.42, W * 0.8); gr.addColorStop(0, 'rgba(255,240,190,.75)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // kitchen shelf behind
  g.fillStyle = 'rgba(80,40,20,.5)'; g.fillRect(0, H * 0.2, W, 10); for (let i = 0; i < 6; i++) { g.fillStyle = ['#c8b8a0', '#a85a3a', '#e8d0a0'][i % 3]; g.fillRect(20 + i * 50, H * 0.2 - 30 - (i % 2) * 10, 26, 30 + (i % 2) * 10); }
  // mom: shoulders (saree), head, bun, bindi, warm smile
  g.fillStyle = '#c83a5a'; g.beginPath(); g.ellipse(W / 2, H * 0.86, W * 0.42, H * 0.2, 0, Math.PI, 0); g.fill(); g.fillRect(W * 0.08, H * 0.86, W * 0.84, H); g.fillStyle = '#ffcf5a'; g.fillRect(W * 0.1, H * 0.8, W * 0.8, 8);
  g.fillStyle = '#b07850'; g.fillRect(W / 2 - 22, H * 0.56, 44, 60);
  g.beginPath(); g.arc(W / 2, H * 0.44, W * 0.27, 0, 7); g.fill();
  g.fillStyle = '#2a1a14'; g.beginPath(); g.arc(W / 2, H * 0.40, W * 0.28, Math.PI * 1.02, Math.PI * 1.98); g.fill(); g.beginPath(); g.arc(W / 2, H * 0.24, W * 0.1, 0, 7); g.fill();
  g.fillStyle = '#d8d0d0'; g.fillRect(W / 2 - 3, H * 0.29, 6, 26);
  g.strokeStyle = '#2a1a14'; g.lineWidth = 7; g.lineCap = 'round'; for (const dx of [-0.1, 0.1]) { g.beginPath(); g.arc(W / 2 + dx * W, H * 0.45, 14, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }
  g.beginPath(); g.arc(W / 2, H * 0.49, 30, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); g.fillStyle = '#c8283a'; g.beginPath(); g.arc(W / 2, H * 0.385, 6, 0, 7); g.fill();
  g.fillStyle = 'rgba(255,120,120,.35)'; for (const dx of [-0.17, 0.17]) { g.beginPath(); g.ellipse(W / 2 + dx * W, H * 0.5, 18, 10, 0, 0, 7); g.fill(); }
  // call UI
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, W, 74); g.fillStyle = '#fff'; g.font = '900 30px Nunito'; g.textAlign = 'center'; g.fillText('Mom', W / 2, 38); g.font = '800 18px Nunito'; g.fillText('video call  04:12', W / 2, 62);
  g.fillStyle = '#e83a3a'; g.beginPath(); g.arc(W / 2, H - 60, 30, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.arc(W / 2 - 90, H - 60, 24, 0, 7); g.fill(); g.beginPath(); g.arc(W / 2 + 90, H - 60, 24, 0, 7); g.fill();
  g.fillStyle = '#20141c'; g.fillRect(W - 100, 90, 80, 110); g.fillStyle = '#3f7fd8'; g.beginPath(); g.arc(W - 60, 170, 26, Math.PI, 0); g.fill(); g.fillStyle = '#c68a62'; g.beginPath(); g.arc(W - 60, 130, 20, 0, 7); g.fill();
}
// void stage pieces: dark reflective floor + overhead spot pools
export function voidSet(T, st, o = {}) { const { THREE } = T, out = {}; const fl = T.ground(60, 60, '#0c0c18'); fl.material.roughness = 0.15; fl.material.metalness = 0.6; st.add(fl);
  out.dust = dust(T, st, { n: 200, area: [-6, 6, 0, 4, -6, 3], color: o.dustColor || '#9fc8ff', size: 0.02, opacity: 0.5, rise: 0.02 }); out.tick = (t) => out.dust.tick(t); return out; }
export function spotPool(T, st, x, z, color = '#c8d8ff', op = 0.12) { const { THREE } = T; const c = new THREE.Mesh(new THREE.ConeGeometry(1.1, 5, 32, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op * 0.5, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })); c.position.set(x, 2.5, z); st.add(c);
  const p = new THREE.Mesh(new THREE.CircleGeometry(1.1, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false })); p.rotation.x = -Math.PI / 2; p.position.set(x, 0.01, z); st.add(p); const L = new THREE.SpotLight(new THREE.Color(color), 18, 9, 0.35, 0.6, 2); L.position.set(x, 5, z); L.target.position.set(x, 0, z); st.add(L, L.target); return { cone: c, pool: p, light: L }; }

// gold clock-coin ("time like money")
let _coinTex = null;
export function coin(T, st) { _coinTex ||= T.canvasTex(128, 128, (g) => { g.fillStyle = '#ffcf5a'; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.strokeStyle = '#a8701a'; g.lineWidth = 7; g.beginPath(); g.arc(64, 64, 50, 0, 7); g.stroke(); g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 30); g.moveTo(64, 64); g.lineTo(88, 74); g.stroke(); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.fillStyle = '#a8701a'; g.fillRect(64 + Math.cos(a) * 42 - 3, 64 + Math.sin(a) * 42 - 3, 6, 6); } });
  const m = new T.THREE.Mesh(new T.THREE.CylinderGeometry(0.11, 0.11, 0.025, 28), [new T.THREE.MeshStandardMaterial({ color: '#d8a030', metalness: 0.8, roughness: 0.3 }), new T.THREE.MeshStandardMaterial({ map: _coinTex, metalness: 0.5, roughness: 0.35, emissive: '#ffb040', emissiveIntensity: 0.25 }), new T.THREE.MeshStandardMaterial({ map: _coinTex, metalness: 0.5, roughness: 0.35 })]); m.castShadow = true; st.add(m); return m; }
// low boundary wall
export function lowWall(T, st, x, z, w = 3, h = 0.6, rot = 0, col = '#c88a6a') { const b = T.box(w, h, 0.3, T.mat(col, { roughness: 0.95 }), x, h / 2, z); b.rotation.y = rot; st.add(b); const c = T.box(w + 0.06, 0.06, 0.36, T.mat('#e8d8c0'), x, h + 0.03, z); c.rotation.y = rot; st.add(c); return b; }
export function signBoard(T, st, str, pos, rot = 0, o = {}) { const m = new T.THREE.Mesh(new T.THREE.PlaneGeometry(o.w || 2.2, o.h || 0.6), new T.THREE.MeshBasicMaterial({ map: T.canvasTex(512, 140, (g, W, H) => { g.fillStyle = o.bg || '#1a3a6a'; g.fillRect(0, 0, W, H); g.strokeStyle = '#ffcf5a'; g.lineWidth = 8; g.strokeRect(6, 6, W - 12, H - 12); g.fillStyle = o.fg || '#ffe8b0'; g.font = '700 64px Fredoka'; g.textAlign = 'center'; g.fillText(str, W / 2, 94); }), color: new T.THREE.Color(0.8, 0.8, 0.8) })); m.position.set(...pos); m.rotation.y = rot; st.add(m); return m; }
