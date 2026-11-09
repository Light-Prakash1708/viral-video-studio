// sets/money3d.js: 3D versions of the device. Note planes with a live canvas texture (same 2D note() drawing,
// so timers tick and notes burn in 3D), a leather wallet, a stylised Earth (land from Natural Earth) with
// city-light emission and a particle layer of glowing notes that can burn to ash in a wave.
import { E, rng, clamp, lerp, ease, prog } from '/engine/core.js';
import { note } from './money.js';
import { WORLD } from './world50m.js';

// a banknote plane (w metres wide). n.draw({timer, burn, t, ...}) repaints the texture
export function note3D(T, o = {}) {
  const { THREE } = T, w = o.w || 1, cw = 640, ch = 320, c = document.createElement('canvas'); c.width = cw; c.height = ch;
  const ctx = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * ch / cw), new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color('#ffffff'), emissiveIntensity: o.emissive ?? 0.22, transparent: true, alphaTest: 0.02, side: THREE.DoubleSide, roughness: 0.75 }));
  m.castShadow = true; m.receiveShadow = true;
  m.draw = (p = {}) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cw, ch); ctx.save(); ctx.translate(cw / 2, ch / 2); note(ctx, 0, 0, 1.0, { shadow: false, ...o.note, ...p }); ctx.restore(); tex.needsUpdate = true; };
  m.draw({}); return m;
}
const leather = (T, base = '#3a2216') => T.canvasTex(512, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); const r = rng(9); for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,220,180'},${0.04 + r() * 0.05})`; g.fillRect(r() * w, r() * h, 2, 2); } g.strokeStyle = 'rgba(230,190,140,.55)'; g.setLineDash([10, 8]); g.lineWidth = 3; g.strokeRect(22, 22, w - 44, h - 44); });
// bifold wallet lying on a table; wallet.open(k) 0 closed .. 1 open. Notes inside: wallet.notes
export function wallet3D(T, st, o = {}) {
  const { THREE } = T, g = new THREE.Group(), W = 1.5, D = 1.0, Hh = 0.07, lt = leather(T), mat = T.mat('#ffffff', { map: lt, roughness: 0.6 });
  const inner = T.mat('#24140e', { roughness: 0.8 });
  const bottom = T.box(W, Hh, D, [mat, mat, mat, inner, mat, mat], 0, Hh / 2, 0); g.add(bottom);
  const hinge = new THREE.Group(); hinge.position.set(0, Hh, -D / 2); g.add(hinge);
  const top = T.box(W, Hh, D, [mat, mat, inner, mat, mat, mat], 0, Hh / 2, D / 2); hinge.add(top);
  // card slots on the inside of the lid
  for (let i = 0; i < 3; i++) { const s = T.box(W * 0.42, 0.012, 0.16, T.mat(['#1e3a5a', '#7a2a22', '#c8a050'][i], { roughness: 0.4 }), -W * 0.24, -0.006, 0.22 + i * 0.2); top.add(s); }
  const notes = [];
  (o.notes || [{ timer: '30 DAYS' }, { timer: '30 DAYS', value: '100', pal: 'r100' }, { timer: '30 DAYS', value: '2000', pal: 'r2000' }]).forEach((nd, i) => {
    const n = note3D(T, { w: 1.2, note: nd, emissive: o.emissive ?? 0.12 }); n.rotation.x = -Math.PI / 2 + 0.3 + i * 0.05; n.rotation.y = -0.1 * i; n.position.set(0.24 * i - 0.2, Hh + 0.05 + i * 0.045, 0.1 - i * 0.14); n.rotation.z = -0.06 * i; g.add(n); notes.push(n);
  });
  g.open = (k) => { hinge.rotation.x = -ease.inOut(clamp(k)) * 1.95 + (1 - clamp(k * 4)) * 0; notes.forEach((n, i) => (n.visible = k > 0.05)); };
  g.notes = notes; g.open(o.open ?? 1); st.add(g); return g;
}

// ---------- Earth ----------
const DEG = Math.PI / 180;
export const ll2v = (THREE, lon, lat, r) => new THREE.Vector3(r * Math.cos(lat * DEG) * Math.sin(lon * DEG), r * Math.sin(lat * DEG), r * Math.cos(lat * DEG) * Math.cos(lon * DEG));
let LAND = null; // cached land sample points [lon, lat]
function landCanvas(w, h, ocean, land, coast) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.fillStyle = ocean; g.fillRect(0, 0, w, h);
  for (const ct of WORLD) for (const poly of ct.p) { g.beginPath(); for (const ringp of poly) ringp.forEach(([x, y], i) => { const px = ((x + 180) / 360) * w, py = ((90 - y) / 180) * h; i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.fillStyle = land; g.fill('evenodd'); if (coast) { g.strokeStyle = coast; g.lineWidth = 1.2; g.stroke(); } }
  return c;
}
function landPoints(n = 14000) {
  if (LAND) return LAND; const w = 1024, h = 512, c = landCanvas(w, h, '#000', '#fff'), d = c.getContext('2d').getImageData(0, 0, w, h).data, r = rng(77), pts = [];
  let tries = 0; while (pts.length < n && tries < n * 12) { tries++; const lon = r() * 360 - 180, lat = Math.asin(r() * 2 - 1) / DEG; if (lat < -58) continue; const px = Math.floor(((lon + 180) / 360) * w), py = Math.floor(((90 - lat) / 180) * h); if (d[(py * w + px) * 4] > 128) pts.push([lon, lat, r()]); }
  return (LAND = pts);
}
// earth3D(T, st, { night, r }) -> group with .pts (Points of glowing notes) and .burn(t, waveLon, glowK)
export function earth3D(T, st, o = {}) {
  const { THREE } = T, R = o.r || 2, g = new THREE.Group(), night = !!o.night;
  const W = 2048, H = 1024;
  const day = landCanvas(W, H, night ? '#04121c' : '#0b3346', night ? '#141e1e' : '#2e5a48', night ? 'rgba(90,140,150,.35)' : 'rgba(170,220,200,.45)');
  const lights = document.createElement('canvas'); lights.width = W; lights.height = H; const lg = lights.getContext('2d'); lg.fillStyle = '#000'; lg.fillRect(0, 0, W, H);
  for (const [lon, lat, k] of landPoints()) { const px = ((lon + 180) / 360) * W, py = ((90 - lat) / 180) * H; lg.fillStyle = `rgba(255,${150 + k * 80 | 0},${60 + k * 40 | 0},${0.35 + k * 0.5})`; lg.fillRect(px, py, 2 + k * 2, 2 + k * 2); }
  const tD = new THREE.CanvasTexture(day), tL = new THREE.CanvasTexture(lights); tD.colorSpace = tL.colorSpace = THREE.SRGBColorSpace; tD.anisotropy = 4;
  const sph = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), new THREE.MeshStandardMaterial({ map: tD, emissiveMap: tL, emissive: new THREE.Color(night ? '#ffffff' : '#000000'), emissiveIntensity: night ? 0.35 : 0, roughness: 0.85, metalness: 0 }));
  g.add(sph);
  // atmosphere rim
  const atm = new THREE.Mesh(new THREE.SphereGeometry(R * 1.06, 64, 48), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
    uniforms: { c: { value: new THREE.Color(o.atm || (night ? '#2a8aa0' : '#5ad0e0')) }, k: { value: o.atmK ?? 0.9 } },
    vertexShader: 'varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vP=mv.xyz; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; uniform float k; varying vec3 vN; varying vec3 vP; void main(){ float f=pow(clamp(1.0-abs(dot(normalize(-vP),vN)),0.,1.),2.2); gl_FragColor=vec4(c*f*k*1.6, f*k); }' }));
  g.add(atm); g.atm = atm;
  // glowing-note particles
  const P = landPoints(), n = P.length, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  P.forEach(([lon, lat], i) => { const v = ll2v(THREE, lon, lat, R * 1.012); pos.set([v.x, v.y, v.z], i * 3); });
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const dot = T.canvasTex(64, 64, (c, w, h) => { const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: o.ptSize || 0.07, map: dot, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
  pts.visible = !!o.notes; g.add(pts); g.pts = pts;
  const base = pos.slice();
  // glowK 0..1 brightness of the orange notes; wave: longitude of the burn front (deg) sweeping +; spanDone: degrees swept so far
  g.burn = (t, glowK, swept, waveLon0 = -180) => {
    for (let i = 0; i < n; i++) { const [lon, lat, k] = P[i]; let d = swept - (((lon - waveLon0) % 360) + 360) % 360; // >0: front has passed by d degrees
      let r = 1, gg = 0.55, b = 0.18, out = 0, fl = 0.75 + 0.25 * Math.sin(t * 7 + k * 40);
      if (d < 0) { const a = glowK * fl * 1.5; col[i * 3] = r * a; col[i * 3 + 1] = gg * a; col[i * 3 + 2] = b * a; }
      else { const hot = Math.exp(-d / 10), ashk = clamp(1 - d / 140); out = d * 0.004 * (0.5 + k); const a = glowK * (hot * 3.0 + 0.18 * ashk);
        col[i * 3] = (1 * hot + 0.32 * (1 - hot)) * a; col[i * 3 + 1] = (0.85 * hot + 0.3 * (1 - hot)) * a; col[i * 3 + 2] = (0.5 * hot + 0.28 * (1 - hot)) * a; }
      const s = 1 + out; pos[i * 3] = base[i * 3] * s; pos[i * 3 + 1] = base[i * 3 + 1] * s + out * 0.6; pos[i * 3 + 2] = base[i * 3 + 2] * s; }
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
  };
  st.add(g); return g;
}
export function starfield(T, st, n = 1200, r = 80) {
  const { THREE } = T, R = rng(31), pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const u = R() * 2 - 1, a = R() * Math.PI * 2, s = Math.sqrt(1 - u * u); pos.set([r * s * Math.cos(a), r * u, r * s * Math.sin(a)], i * 3); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xcfe0ff, size: 0.18, transparent: true, opacity: 0.7, depthWrite: false })); st.add(p); return p;
}
// soft glow sprite
export function glowSprite(T, st, color, scale, pos, opacity = 0.4) {
  const { THREE } = T, tex = T.canvasTex(128, 128, (c, w, h) => { const gr = c.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: new THREE.Color(color), transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.set(scale, scale, 1); s.position.set(...pos); st.add(s); return s;
}
