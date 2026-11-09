// shots/ab2.js (v2): cartoon "card" cast inside realistic 3D: glossy 1950s sedan, sunny road, moonlit bedroom,
// workshop macro, inflator cutaway, crash-test lab. Cinematic: long lenses, DOF focus pulls, motivated light, handheld drift.
import { E, registerShot, ease, prog, clamp, lerp, glow, alpha, text, veil, rr, rng, seg, circle } from '/engine/core.js';
import { lifeStage } from '../sets/lifesim.js';
import { world } from '../sets/worlds.js';
import { toon } from '../sets/toon2d.js';
import { roadWorld, car, rock, dummy, wheelCutaway, envMap, foliage } from '../sets/ab2_props.js';
import { sensor, airbag } from '../sets/ab_props.js';
import { tick } from '../sets/diagram.js';
import { local } from '../sets/ui.js';

const W = E.W, H = E.H;
const atc = (info, t, w, fb) => { const x = local(info, t, w); return x == null || x < -0.2 || x > info.dur ? fb : x; };
const V3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const chipTop = (g, str, a = 1, col = '#ffd23a') => { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.font = '900 40px Nunito'; const w = g.measureText(str).width + 60; rr(g, W / 2 - w / 2, 150, w, 70, 35); g.fillStyle = 'rgba(10,10,20,.72)'; g.fill(); g.restore(); text(g, str, W / 2, 186, { size: 40, font: 'Nunito', weight: 900, color: col, alpha: a, spacing: 4 }); };
const stamp = (g, str, x, y, a, rot = -0.18, col = '#e8202a', size = 120) => { if (a <= 0) return; const s = 1 + 0.6 * (1 - ease.out(clamp(a))); g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha = clamp(a); g.font = `900 ${size}px Nunito`; const w = g.measureText(str).width + 50; g.strokeStyle = col; g.lineWidth = 12; rr(g, -w / 2, -size * 0.62, w, size * 1.15, 18); g.stroke(); g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, 0, 6); g.restore(); };
// handheld drift + impact shake
const hand = (cam, t, amp = 0.012) => { cam.position.x += Math.sin(t * 1.3) * amp + Math.sin(t * 3.1) * amp * 0.3; cam.position.y += Math.sin(t * 1.7 + 1) * amp * 0.7; };
const shake = (cam, t, t0, amp = 0.15, dur = 0.5) => { const k = clamp(1 - (t - t0) / dur); if (t > t0 && k > 0) { cam.position.x += Math.sin(t * 90) * amp * k; cam.position.y += Math.cos(t * 77) * amp * k; } };
const lens = (cam, fov) => { cam.fov = fov; cam.updateProjectionMatrix(); };
const letterbox = (g, a = 1) => { g.fillStyle = `rgba(0,0,0,${0.9 * a})`; g.fillRect(0, 0, W, 70); g.fillRect(0, H - 70, W, 70); };
const grain = (g, t, a = 0.05) => { const R = rng(Math.floor(t * 24) + 1); g.save(); g.globalAlpha = a; for (let i = 0; i < 260; i++) { g.fillStyle = R() < 0.5 ? '#000' : '#fff'; g.fillRect(R() * W, R() * H, 2, 2); } g.restore(); };
const vign = (g, a = 0.45) => { const v = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,8,${a})`); g.fillStyle = v; g.fillRect(0, 0, W, H); };
const finish = (g, t, o = {}) => { vign(g, o.v ?? 0.42); grain(g, t, o.grain ?? 0.04); };

// keyed pose animation for toon cards: [[time, pose, dur?]] -> overshooting spring blend; expr switches at the key time
const NUM = ['armL', 'armR', 'tilt', 'look', 'lookY', 'lean', 'stepL', 'stepR'];
function tk(t, K, seed = 0) {
  let cur = { armL: [0.15, 0.25], armR: [-0.15, -0.25], tilt: 0, look: 0, lookY: 0, lean: 0, ...K[0][1] };
  for (let i = 1; i < K.length; i++) { const [t0, p, d = 0.32] = K[i]; if (t < t0) break; const k = ease.outBack(clamp((t - t0) / d)); const nx = { ...cur, ...p };
    for (const f of NUM) { const a = cur[f], b = nx[f]; if (Array.isArray(b)) nx[f] = b.map((v, j) => lerp(a ? a[j] : v, v, k)); else if (typeof b === 'number') nx[f] = lerp(a ?? b, b, k); } cur = nx; }
  const br = Math.sin(t * 2.2 + seed) * 0.012; cur.lean = (cur.lean || 0) + br; cur.tilt = (cur.tilt || 0) + Math.sin(t * 1.4 + seed * 2) * 0.03; return cur;
}
const ARMS = { rest: [[0.15, 0.25], [-0.15, -0.25]], drive: [[0.3, -2.4], [-0.3, 2.4]], shock: [[0.9, 0.7], [-0.9, -0.7]], face: [[0.35, -2.7], [-0.35, 2.7]], belly: [[0.15, -1.9], [-0.15, 1.9]], wave: [[0.15, 0.25], [-2.6, 0.5]], hug: [[0.5, -2.0], [-0.5, 2.0]], lap: [[0.1, -1.0], [-0.1, 1.0]] };
const A = (n) => ({ armL: ARMS[n][0], armR: ARMS[n][1] });

const DAD = { hair: 'side', hairCol: '#3a2618', skin: '#f8dcc4', top: '#4a7ab8', bottom: '#4a4a52', mustache: true, h: 0.95, seed: 1 };
const MOM = { hair: 'bun', hairCol: '#8a3a1e', skin: '#fbe2cc', top: '#3a8a6a', dress: true, h: 0.92, seed: 2 };
const KID = { hair: 'pigtails', hairCol: '#7a4a28', skin: '#fbe2cc', top: '#ffd23a', dress: true, h: 0.7, seed: 3 };
function family(T, c) { const d = toon(T, DAD), m = toon(T, MOM), k = toon(T, KID); d.position.set(0.12, 0.6, -0.42); k.position.set(0.02, 0.76, 0.0); m.position.set(0.08, 0.62, 0.42); c.riders.add(d, k, m); return { d, m, k }; }
// car world transform at lane; car forward = -z (rotation.y = PI/2)
const place = (c, x, z, yaw = 0, pitch = 0, y = 0, roll = 0) => { c.position.set(x, y, z); c.rotation.set(0, Math.PI / 2 + yaw, 0); c.rotateZ(pitch); c.rotateX(roll); };
const camLocal = (st, c, p, l, up = true) => { const P = c.localToWorld(new st.THREE_V(...p)), L = c.localToWorld(new st.THREE_V(...l)); st.camera.position.copy(P); if (up) { const u = new st.THREE_V(0, 1, 0).applyQuaternion(c.getWorldQuaternion(new st.THREE_Q())); st.camera.up.copy(u); } st.camera.lookAt(L); };
const withV = (T, st) => { st.THREE_V = T.THREE.Vector3; st.THREE_Q = T.THREE.Quaternion; return st; };
function dustPuffs(T, st, n = 40, col = '#c8b08a') { const { THREE } = T, tex = T.canvasTex(128, 128, (c, w, h) => { const rg = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); rg.addColorStop(0, 'rgba(255,255,255,.9)'); rg.addColorStop(0.5, 'rgba(255,255,255,.35)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = rg; c.fillRect(0, 0, w, h); }); const R = rng(9), out = [];
  for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: new THREE.Color(col), transparent: true, opacity: 0, depthWrite: false })); st.add(s); out.push({ s, a: R() * 6.28, r: R(), v: 0.5 + R(), y: R() }); } return out; }
const puffAt = (P, cx, cy, cz, u, spread = 3, op = 0.6) => P.forEach((q) => { const k = clamp(u); q.s.position.set(cx + Math.cos(q.a) * spread * (0.2 + k * q.v) * q.r * 1.5, cy + 0.2 + k * (0.6 + q.y * 1.6), cz + Math.sin(q.a) * spread * (0.2 + k * q.v) * q.r); q.s.scale.setScalar(0.6 + k * 2.6 * q.v); q.s.material.opacity = u > 0 && u < 1 ? op * (1 - k) * Math.min(1, k * 8) : 0; });

// ---------- v01 "He was driving his wife and daughter home when a huge rock appeared in the middle of the road."
registerShot('v01', { kind: '3d',
  init(T) { const Rw = roadWorld(T, { seed: 5, dof: true, focus: 4, aperture: 0.0025, maxblur: 0.008 }); const c = car(T, { color: '#2f7f9a' }); Rw.stage.add(c); return { stage: withV(T, Rw.stage), rock: Rw.rock, c, F: family(T, c) }; },
  draw(s, t, info) { const st = s.stage, cam = st.camera, rk = atc(info, t, 'rock', info.dur * 0.72), v = 13, zc = -v * t; place(s.c, 1.75, zc, Math.sin(t * 0.7) * 0.01); s.c.position.y = Math.sin(t * 11) * 0.006; s.c.spin(v * t); st.followSun(1.75, zc);
    s.rock.position.set(0.7, 0.55, -v * info.dur - 9); s.rock.scale.set(1.7, 1.3, 1.4);
    const { d, m, k } = s.F; d.pose(t, tk(t, [[0, { expr: 'happy', ...A('drive'), look: 0.3 }], [1.2, { expr: 'talk', look: -0.6 }], [rk - 0.05, { expr: 'shock', look: 0, lookY: -0.3, ...A('drive'), lean: -0.05 }, 0.2]], 1));
    m.pose(t, tk(t, [[0, { expr: 'laugh', ...A('lap'), look: -0.5, tilt: 0.1 }], [rk + 0.1, { expr: 'shock', ...A('shock') }, 0.2]], 2)); k.pose(t, tk(t, [[0, { expr: 'happy', armL: [0.2, 0.3], armR: [-2.4, 0.4], look: 0.4 }], [rk + 0.15, { expr: 'scared', ...A('face') }, 0.2]], 3));
    // A: tracking ahead of the car, long lens on the windshield faces. B: crane up over the roof to the rock
    const b = ease.inOut(prog(t, rk - 0.25, rk + 0.55)); lens(cam, lerp(22, 38, b));
    const pa = [1.75 + 0.4 + Math.sin(t * 0.6) * 0.2, 1.85, zc - 5.0], pb = [2.6, 2.7, zc + 5.5]; cam.position.set(...V3(pa, pb, b)); cam.up.set(0, 1, 0);
    const la = [1.65, 1.32, zc - 0.1], lb = [0.9, 0.7, s.rock.position.z]; cam.lookAt(...V3(la, lb, b)); hand(cam, t);
    if (st.focusOn) st.focusOn(b < 0.5 ? [1.6, 1.3, zc - 0.1] : s.rock.position.toArray());
    [d, m, k].forEach((p) => p.face(cam)); },
  overlay(g, t, info) { chipTop(g, 'PENNSYLVANIA · 1952', ease.out(prog(t, 0.2, 0.6)) * (1 - prog(t, 2.6, 3.0))); finish(g, t); } });

// ---------- v02 "He slams the brakes, yanks the wheel, and the car plunges nose first into a ditch."
function v02Path(info, t, atcf) { const br = atcf('brakes', 0.35), ya = atcf('yanks', 1.1), di = atcf('ditch', 2.6), v = 13, a = 6.5;
  const z = t < br ? -v * t : -v * br - (v * Math.min(t - br, v / a) - 0.5 * a * Math.min(t - br, v / a) ** 2) * 1; const sw = ease.inOut(prog(t, ya - 0.15, di));
  const dp = ease.in(prog(t, di - 0.28, di)), bo = Math.sin(Math.PI * clamp((t - di) / 0.45)) * (1 - clamp((t - di) / 0.45)); return { br, ya, di, z: Math.min(z, 1e9), x: lerp(1.75, 6.7, sw), yaw: -0.62 * sw + 0.12 * Math.sin(Math.PI * sw), pitch: -0.42 * dp + 0.06 * bo, y: -0.78 * dp + 0.05 * bo, roll: -0.08 * dp }; }
registerShot('v02', { kind: '3d',
  init(T) { const Rw = roadWorld(T, { seed: 5 }); const c = car(T, { color: '#2f7f9a' }); Rw.stage.add(c); const P = dustPuffs(T, Rw.stage, 46), G = dustPuffs(T, Rw.stage, 30, '#e8e4dc');
    const skid = new T.THREE.InstancedMesh(new T.THREE.PlaneGeometry(0.22, 0.5), new T.THREE.MeshBasicMaterial({ color: '#1a1a1c', transparent: true, opacity: 0.55, depthWrite: false }), 240); skid.count = 0; Rw.stage.add(skid); return { stage: withV(T, Rw.stage), rock: Rw.rock, c, F: family(T, c), P, G, skid, M: new T.THREE.Matrix4(), Q: new T.THREE.Quaternion(), E: new T.THREE.Euler(), T }; },
  draw(s, t, info) { const st = s.stage, cam = st.camera, f = (w, fb) => atc(info, t, w, fb), p = v02Path(info, t, f); place(s.c, p.x, p.z, p.yaw, p.pitch, p.y, p.roll); s.c.spin(-p.z); st.followSun(p.x, p.z);
    const end = v02Path(info, info.dur, (w, fb) => atc(info, info.dur, w, fb)); s.rock.position.set(0.7, 0.42, end.z - 3.5);
    // skid marks from the brake point
    let n = 0; for (let u = p.br; u < Math.min(t, p.di - 0.05) && n < 240; u += 0.02) { const q = v02Path(info, u, f); for (const off of [-0.82, 0.82]) { const ang = Math.PI / 2 + q.yaw; s.M.compose(new s.T.THREE.Vector3(q.x + Math.cos(ang + Math.PI / 2) * off * 0 + off * Math.cos(q.yaw), 0.02, q.z + 1.45 - off * Math.sin(q.yaw)), s.Q.setFromEuler(s.E.set(-Math.PI / 2, 0, q.yaw)), new s.T.THREE.Vector3(1, 1, 1)); s.skid.setMatrixAt(n++, s.M); } } s.skid.count = n; s.skid.instanceMatrix.needsUpdate = true;
    puffAt(s.P, p.x + 1.8, -0.3, p.z - 1.0, (t - p.di) / 1.6, 3.2, 0.7); puffAt(s.G, p.x, 0.1, p.z + 2, (t - p.br - 0.2) / 1.0 * (t < p.di ? 1 : 1), 1.0, 0.25);
    const { d, m, k } = s.F; d.pose(t, tk(t, [[0, { expr: 'shock', ...A('drive') }], [p.ya, { expr: 'determined', armL: [0.9, -2.0], armR: [0.4, 2.6], lean: 0.12 }, 0.2], [p.di, { expr: 'scared', ...A('shock'), lean: 0.1 }, 0.15]], 1));
    m.pose(t, tk(t, [[0, { expr: 'shock', ...A('shock') }], [p.ya, { expr: 'scared', lean: 0.15 }, 0.2], [p.di, { expr: 'scared', ...A('face') }, 0.15]], 2)); k.pose(t, tk(t, [[0, { expr: 'scared', ...A('face') }], [p.ya + 0.2, { lean: 0.2 }], [p.di, { lean: -0.1, expr: 'shock' }, 0.15]], 3));
    // shot: 0..br+0.5 long-lens windshield close (brake stomp), then low wide from the roadside as it swerves + dives
    if (t < p.br + 0.55) { lens(cam, 18); cam.up.set(0, 1, 0); cam.position.set(p.x + 0.2, 1.85, p.z - 5.6); cam.lookAt(p.x - 0.4, 1.32, p.z); if (st.bokeh) {} }
    else { const k2 = ease.out(prog(t, p.br + 0.55, info.dur)); lens(cam, lerp(40, 34, k2)); cam.up.set(0, 1, 0); cam.position.set(lerp(-1.8, -0.4, k2), lerp(1.6, 3.2, k2), end.z - 7 + lerp(13, 10, k2)); cam.lookAt(lerp(p.x, 6.5, 0.4), 0.4, p.z - 1); }
    hand(cam, t, 0.02); shake(cam, t, p.di, 0.22, 0.6); [d, m, k].forEach((q) => q.face(cam)); },
  overlay(g, t, info) { const di = atc(info, t, 'ditch', 2.6); if (t > di) veil(g, '#ffffff', 0.45 * clamp(1 - (t - di) / 0.2)); finish(g, t); } });

// ---------- v03 "Without thinking, he throws his arm across his little girl. So does his wife." (dash-cam through the windshield)
registerShot('v03', { kind: '3d',
  init(T) { const Rw = roadWorld(T, { seed: 5, dof: true, focus: 2.4, aperture: 0.004, maxblur: 0.01 }); const c = car(T, { color: '#2f7f9a', glassOpacity: 0.12 }); Rw.stage.add(c); const F = family(T, c); F.d.position.x = 0.2; F.m.position.x = 0.15; F.k.position.set(0.0, 0.98, -0.07); F.m.position.z = 0.3; c.userData.cabin.forEach((m) => (m.visible = false));
    const lamp = new T.THREE.PointLight(new T.THREE.Color('#fff2e0'), 2.5, 4, 2); c.add(lamp); lamp.position.set(1.4, 1.6, 0); return { stage: withV(T, Rw.stage), c, F, P: dustPuffs(T, Rw.stage, 30) }; },
  draw(s, t, info) { const st = s.stage, cam = st.camera, th = atc(info, t, 'throws', 0.75), wf = atc(info, t, 'wife', info.dur - 0.9);
    const jolt = Math.exp(-t * 3) * Math.sin(t * 22) * 0.06; place(s.c, 6.7, -60, -0.5, -0.1 + jolt * 0.5, -0.25, -0.03); s.c.updateMatrixWorld(true); st.followSun(6.7, -60);
    const { d, m, k } = s.F; d.pose(t, tk(t, [[0, { expr: 'scared', ...A('drive'), lean: 0.08 }], [th, { expr: 'determined', armL: [1.58, -0.05], armR: [-0.3, 2.4], lean: -0.1, look: -0.8 }, 0.24]], 1));
    m.pose(t, tk(t, [[0, { expr: 'scared', ...A('face') }], [wf, { expr: 'worried', armR: [-1.58, 0.05], armL: [0.2, 0.3], lean: 0.1, look: 0.8 }, 0.24]], 2));
    k.pose(t, tk(t, [[0, { expr: 'shock', ...A('face') }], [th + 0.35, { expr: 'scared', ...A('face'), lookY: -0.4 }], [wf + 0.6, { expr: 'sad', look: 0, lookY: 0.5, ...A('hug') }]], 3));
    d.position.y = 0.84 + jolt; m.position.y = 0.86 + jolt * 0.8; k.position.y = 0.98 + jolt * 1.2;
    const push = ease.inOut(clamp(t / info.dur)), pan = ease.inOut(prog(t, wf - 0.45, wf + 0.1)), zz = lerp(-0.24, 0.1, pan); lens(st.camera, lerp(50, 46, push)); camLocal(st, s.c, [lerp(1.9, 1.7, push), 1.62 + Math.sin(t * 1.3) * 0.01, zz * 0.7 + Math.sin(t * 0.9) * 0.02], [0, 1.42, zz]); shake(cam, t, 0, 0.05, 0.8);
    if (st.focusOn) st.focusOn(s.c.localToWorld(new st.THREE_V(0.1, 1.3, zz)));
    puffAt(s.P, 8.5, -0.4, -61, 0.4 + t / 4, 3, 0.35); [d, m, k].forEach((q) => q.face(cam)); },
  overlay(g, t) { finish(g, t, { v: 0.5 }); } });

// ---------- v04 "Everyone's okay. But that night he can't sleep. Because what if their arms hadn't been fast enough?" moonlit bedroom
registerShot('v04', { kind: '3d',
  init(T) { const { THREE } = T; const st = withV(T, lifeStage(T, { sky: ['#06080f', '#0a1020', '#101a30'], fog: [8, 30], fogColor: '#0a1020', key: 0.0, ambient: 0.6, ambientSky: '#6a80c0', focus: 2.5, aperture: 0.004, maxblur: 0.009, bloom: 0.35, beauty: 0.12, rimIntensity: 0.3, rim: '#8aa8ff' }));
    const wall = T.mat('#3a4a6a', { roughness: 0.95 }); st.add(T.box(8, 4, 0.1, wall, 0, 2, -1.4)); st.add(T.box(0.1, 4, 6, wall, -3.2, 2, 1.4)); const fl = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ map: T.planks('#4a3428', 14, [3, 3]), roughness: 0.7 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; st.add(fl);
    // window with moon + night sky, frame, and a cold moon spot through it
    const sky = T.canvasTex(512, 640, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0a1430'); gr.addColorStop(1, '#2a3a6a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const R = rng(4); for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + R() * 0.7})`; g.fillRect(R() * w, R() * h * 0.8, 2, 2); } const rg = g.createRadialGradient(340, 170, 0, 340, 170, 160); rg.addColorStop(0, 'rgba(220,230,255,.7)'); rg.addColorStop(1, 'rgba(220,230,255,0)'); g.fillStyle = rg; g.fillRect(0, 0, w, h); g.fillStyle = '#f2f4ff'; g.beginPath(); g.arc(340, 170, 56, 0, 7); g.fill(); g.fillStyle = 'rgba(180,190,220,.5)'; g.beginPath(); g.arc(326, 160, 12, 0, 7); g.arc(356, 186, 8, 0, 7); g.fill(); g.fillStyle = '#0a0e1a'; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 20) g.lineTo(x, h * 0.82 - Math.sin(x * 0.03) * 20 - R() * 30); g.lineTo(w, h); g.fill(); });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.75), new THREE.MeshBasicMaterial({ map: sky, toneMapped: false })); win.position.set(1.2, 2.1, -1.34); st.add(win); const fr = T.mat('#e8e4dc'); for (const [w, h, x, y] of [[1.55, 0.08, 1.2, 3.0], [1.55, 0.08, 1.2, 1.2], [0.08, 1.85, 0.43, 2.1], [0.08, 1.85, 1.97, 2.1], [0.05, 1.8, 1.2, 2.1], [1.5, 0.05, 1.2, 2.1]]) st.add(T.box(w, h, 0.08, fr, x, y, -1.3));
    const curtains = []; for (const x of [0.25, 2.15]) { const cg = new THREE.PlaneGeometry(0.5, 2.3, 10, 1), P = cg.attributes.position; for (let i = 0; i < P.count; i++) P.setZ(i, Math.sin(P.getX(i) * 25) * 0.04); cg.computeVertexNormals(); const c = new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ color: '#5a6aa0', roughness: 0.9, side: THREE.DoubleSide })); c.position.set(x, 2.0, -1.2); st.add(c); curtains.push(c); }
    const moon = new THREE.SpotLight(new THREE.Color('#9ab8ff'), 60, 14, 0.42, 0.6, 1.6); moon.position.set(2.6, 3.6, -3.4); moon.target.position.set(-0.4, 0.6, 1.2); moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024); st.add(moon, moon.target);
    // bed: frame, headboard, mattress, pillows, rumpled blanket
    const wood = T.mat('#5a3a26', { roughness: 0.6 }); st.add(T.box(2.3, 0.35, 1.9, wood, -0.9, 0.25, 0.3)); st.add(T.box(0.12, 1.2, 1.95, wood, -2.06, 0.75, 0.3)); st.add(T.box(2.15, 0.22, 1.8, T.mat('#e8e4dc'), -0.9, 0.52, 0.3));
    for (const z of [-0.12, 0.72]) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 12), T.mat('#f2f0ea')); p.scale.set(0.75, 0.32, 1.1); p.position.set(-1.72, 0.72, z); p.castShadow = true; st.add(p); }
    const bg = new THREE.PlaneGeometry(1.75, 1.95, 30, 30), BP = bg.attributes.position; for (let i = 0; i < BP.count; i++) { const x = BP.getX(i), y = BP.getY(i); BP.setZ(i, 0.06 * Math.sin(x * 7 + y * 3) + 0.04 * Math.sin(y * 11) + (Math.abs(y) > 0.85 ? -0.25 * (Math.abs(y) - 0.85) * 4 : 0) + 0.12 * Math.exp(-((x + 0.1) ** 2 + (y + 0.4) ** 2) * 6)); } bg.computeVertexNormals();
    const blanket = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ color: '#6a7ab8', roughness: 0.85 })); blanket.rotation.x = -Math.PI / 2; blanket.position.set(-0.55, 0.7, 0.3); blanket.receiveShadow = true; blanket.castShadow = true; st.add(blanket);
    // nightstand + flip clock (canvas face redrawn) + glass of water
    st.add(T.box(0.5, 0.6, 0.45, wood, -2.45 + 0.1, 0.3, 1.6)); const clockC = document.createElement('canvas'); clockC.width = 256; clockC.height = 128; const ctex = new THREE.CanvasTexture(clockC); ctex.colorSpace = THREE.SRGBColorSpace;
    const clock = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.12), [T.mat('#2a2a30'), T.mat('#2a2a30'), T.mat('#2a2a30'), T.mat('#2a2a30'), new THREE.MeshBasicMaterial({ map: ctex, toneMapped: false }), T.mat('#2a2a30')]); clock.position.set(-2.35, 0.68, 1.6); clock.rotation.y = 0.5; st.add(clock); const cl = new THREE.PointLight(new THREE.Color('#ff3a2a'), 1.2, 1.5, 2); cl.position.set(-2.2, 0.75, 1.75); st.add(cl);
    // wife asleep (card lying on its side under the blanket), husband sitting up awake
    const wife = toon(T, { ...MOM, h: 1.5, top: '#e8d0e0' }); wife.position.set(-0.55, 0.62, -0.05); st.add(wife); const dad = toon(T, { ...DAD, h: 1.35, top: '#7a9ad0' }); dad.position.set(-1.35, 0.28, 0.7); st.add(dad);
    return { stage: st, wife, dad, clockC, ctex, curtains, cl }; },
  draw(s, t, info) { const st = s.stage, cam = st.camera, ok = 1.0, wi = atc(info, t, 'what', info.dur * 0.55), fa = atc(info, t, 'fast', info.dur - 0.7);
    const mins = t < ok ? 47 : 47 + Math.floor(prog(t, ok, wi) * 58), hh = 2 + Math.floor(mins / 60), mm = mins % 60; const g = s.clockC.getContext('2d'); g.fillStyle = '#100808'; g.fillRect(0, 0, 256, 128); g.fillStyle = '#ff3a2a'; g.shadowColor = '#ff2010'; g.shadowBlur = 16; g.font = '900 92px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(`${hh}:${String(mm).padStart(2, '0')}`, 128, 70); g.shadowBlur = 0; s.ctex.needsUpdate = true;
    s.curtains.forEach((c, i) => { c.rotation.y = Math.sin(t * 0.8 + i) * 0.06; });
    s.wife.pose(t, { expr: 'sleep', seated: true, ...A('hug') }); s.dad.pose(t, tk(t, [[0, { expr: 'happy', seated: true, ...A('lap') }], [ok, { expr: 'tired', look: 0.2, lookY: -0.6, ...A('lap') }, 0.6], [wi, { expr: 'worried', look: 0.6, lookY: 0, armL: [0.35, -2.6], armR: [-0.1, 1.0], sweat: true, tilt: -0.1 }, 0.5], [fa, { expr: 'scared', sweat: true }]], 4));
    const k = ease.inOut(clamp(t / info.dur)); lens(cam, lerp(36, 26, k)); cam.up.set(0, 1, 0); cam.position.set(lerp(1.4, 0.6, k), lerp(1.55, 1.42, k), lerp(4.6, 3.7, k)); cam.lookAt(lerp(-0.9, -1.3, k), lerp(0.95, 1.15, k), 0.6); hand(cam, t, 0.006); if (st.focusOn) st.focusOn([-1.35, 1.1, 0.7]);
    s.dad.face(cam); s.wife.face(cam, Math.PI / 2 - 0.08); },
  overlay(g, t, info) { const wi = atc(info, t, 'what', info.dur * 0.55); const a = ease.out(prog(t, wi - 0.1, wi + 0.4));
    if (a > 0) { const cx = W * 0.66, cy = H * 0.28; g.save(); g.globalAlpha = a * 0.92; for (const [x, y, r] of [[W * 0.42, H * 0.42, 14], [W * 0.48, H * 0.38, 24]]) circle(g, x, y, r, '#f2f4ff'); g.beginPath(); for (let i = 0; i < 9; i++) { const ang = (i / 9) * Math.PI * 2; g.arc(cx + Math.cos(ang) * 210, cy + Math.sin(ang) * 140, 95, 0, 7); } g.fillStyle = '#f2f4ff'; g.fill(); g.restore();
      // memory: the car tipping into the ditch, family without arms in front (red tint)
      const u = (t - wi) % 1.4 / 1.4; g.save(); g.globalAlpha = a; g.translate(cx, cy + 20); g.fillStyle = '#c8402a'; g.save(); g.rotate(0.35 * ease.inOut(u)); rr(g, -150, -40, 300, 70, 30); g.fill(); rr(g, -80, -85, 150, 60, 24); g.fill(); g.fillStyle = '#9ad0ff'; rr(g, -66, -76, 56, 42, 8); g.fill(); rr(g, 2, -76, 56, 42, 8); g.fill(); g.fillStyle = '#1a1a1e'; circle(g, -90, 34, 26, '#1a1a1e'); circle(g, 90, 34, 26, '#1a1a1e'); g.restore();
      g.fillStyle = '#5a7a3a'; rr(g, -200, 70, 400, 30, 10); g.fill(); text(g, '?', 170, -90, { size: 110, font: 'Nunito', weight: 900, color: '#e8202a' }); g.restore(); }
    finish(g, t, { v: 0.6, grain: 0.06 }); } });

// ---------- v08 "...and takes it to every carmaker in America. They laugh him out of the room."
registerShot('v08', { kind: '3d',
  init(T) { const Wd = world(T, 'office', { mood: 'day', seed: 6, bright: 1.1 }); const st = withV(T, Wd.stage);
    const d = toon(T, { ...DAD, h: 1.75, top: '#5a5a62', tie: '#8a1a2a', coat: true }); d.position.set(-1.7, 0, 1.2); st.add(d);
    const ex = [0, 1, 2].map((i) => { const p = toon(T, { hair: ['bald', 'side', 'side'][i], hairCol: ['#bdbdbd', '#2a1a12', '#6a5a4a'][i], skin: ['#f6d8c0', '#e8c0a0', '#f8dcc8'][i], top: ['#1e2a4a', '#3a3a44', '#2a3a2a'][i], tie: '#c8a050', coat: true, glasses: i === 2, mustache: i === 0, h: 1.72, headR: 140, seed: 5 + i }); p.position.set(0.3 + i * 0.85, 0, 0.3 - i * 0.25); st.add(p); return p; });
    const board = T.canvasTex(512, 384, (g, w, h) => { g.fillStyle = '#f4ecd8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2a2a3a'; g.lineWidth = 6; g.beginPath(); g.arc(w / 2, h / 2 + 20, 100, 0, 7); g.stroke(); g.strokeStyle = '#d8302a'; g.setLineDash([14, 10]); g.beginPath(); g.ellipse(w / 2, h / 2, 170, 140, 0, 0, 7); g.stroke(); g.setLineDash([]); g.fillStyle = '#2a2a3a'; g.font = '900 34px Nunito'; g.textAlign = 'center'; g.fillText('SAFETY CUSHION', w / 2, 46); });
    const bd = new T.THREE.Mesh(new T.THREE.PlaneGeometry(1.0, 0.75), new T.THREE.MeshStandardMaterial({ map: board })); bd.position.set(-2.4, 1.45, 0.6); bd.rotation.y = 0.5; st.add(bd); st.add(T.box(0.04, 1.4, 0.04, T.mat('#5a3a26'), -2.4, 0.7, 0.6));
    return { stage: st, Wd, d, ex }; },
  draw(s, t, info) { s.Wd.tick(t); const st = s.stage, cam = st.camera, la = atc(info, t, 'laugh', info.dur * 0.55), ro = atc(info, t, 'room', info.dur - 0.4);
    s.d.pose(t, tk(t, [[0, { expr: 'proud', armL: [1.9, -0.4], armR: [-0.15, -0.25], look: -0.7 }], [0.9, { expr: 'talk', armL: [1.2, -0.8], armR: [-1.1, -0.9], look: 0.6 }], [la + 0.2, { expr: 'surprised', ...A('rest'), look: 0.8 }, 0.25], [ro, { expr: 'sad', ...A('rest'), lookY: 0.6, tilt: 0.12, lean: 0.04 }, 0.5]], 1));
    s.ex.forEach((p, i) => { const lt = la - 0.05 + i * 0.12, bob = t > lt ? Math.abs(Math.sin((t - lt) * 11 + i)) * 0.06 : 0; p.position.y = bob; p.pose(t, tk(t, [[0, { expr: i === 1 ? 'neutral' : 'determined', ...A('rest'), look: -0.8 }], [lt, { expr: 'laugh', ...(i === 1 ? { armL: [0.2, 0.3], armR: [-2.3, 0.6] } : A('belly')), lean: (i - 1) * 0.08 + Math.sin(t * 9 + i) * 0.05, tilt: 0.15 * (i - 1) || 0.12 }, 0.22]], 5 + i)); });
    const k = ease.inOut(clamp(t / info.dur)), wh = ease.inOut(prog(t, la - 0.3, la + 0.4)); lens(cam, 38); cam.up.set(0, 1, 0); cam.position.set(lerp(-3.2, -0.2, wh) + k * 0.2, 1.5, lerp(4.6, 4.8, k)); cam.lookAt(lerp(-1.9, 1.0, wh), 1.25, 0.6); hand(cam, t, 0.01); if (st.focusOn) st.focusOn(wh < 0.5 ? [-1.7, 1.4, 1.2] : [1.0, 1.4, 0.0]);
    [s.d, ...s.ex].forEach((q) => q.face(cam)); },
  overlay(g, t, info) { const la = atc(info, t, 'laugh', info.dur * 0.55); const R = rng(3); for (let i = 0; i < 6; i++) { const st = la + i * 0.15; const a = clamp((t - st) / 0.15) * (1 - prog(t, st + 0.9, st + 1.3)); if (a > 0) text(g, ['HA!', 'HAHA', 'HA!'][i % 3], W * (0.5 + R() * 0.42), H * (0.2 + R() * 0.18), { size: 70 + R() * 40, font: 'Nunito', weight: 900, color: '#ffd23a', alpha: a, glow: 10, glowColor: 'rgba(0,0,0,.6)' }); } finish(g, t); } });

// ---------- v10 "And nobody can build a sensor that knows a crash from a pothole." the bag pops on a pothole, right in his face
registerShot('v10', { kind: '3d',
  init(T) { const Rw = roadWorld(T, { seed: 8, dof: true, focus: 5, aperture: 0.002, maxblur: 0.006 }); Rw.rock.visible = false; const c = car(T, { color: '#b8302a', roof: '#f4efe4' }); Rw.stage.add(c); const F = family(T, c); F.m.visible = false; F.k.visible = false;
    const hole = new T.THREE.Mesh(new T.THREE.CircleGeometry(0.55, 28), new T.THREE.MeshStandardMaterial({ color: '#141416', roughness: 1 })); hole.rotation.x = -Math.PI / 2; hole.scale.set(1, 0.7, 1); hole.position.set(1.3, 0.02, -26); Rw.stage.add(hole); const rim = rock(T, 33, { detail: 2, flat: 0.15, color: '#6a6a6e' }); rim.scale.set(0.7, 0.12, 0.5); rim.position.set(1.3, 0.0, -26); Rw.stage.add(rim);
    const b = airbag(T); b.scale.setScalar(0.38); b.rotation.y = Math.PI / 2; c.add(b); b.position.set(0.5, 1.22, -0.4); return { stage: withV(T, Rw.stage), c, d: F.d, b, hole }; },
  draw(s, t, info) { const st = s.stage, cam = st.camera, ph = atc(info, t, 'pothole', info.dur * 0.68), v = 9, zc = -26 + v * (ph - t) + 1.45; const hit = Math.sin(Math.PI * clamp((t - ph + 0.05) / 0.22)) * (t > ph - 0.05 && t < ph + 0.17 ? 1 : 0);
    place(s.c, 1.75, zc, 0, -0.05 * hit, 0.12 * hit, 0.03 * hit); s.c.spin(v * t); st.followSun(1.75, zc); const bk = prog(t, ph, ph + 0.12); s.b.inflate(bk); s.b.scale.setScalar(0.38 + 0.04 * Math.sin(Math.max(0, t - ph) * 30) * Math.exp(-(t - ph) * 5));
    s.d.pose(t, tk(t, [[0, { expr: 'happy', ...A('drive'), look: 0.3 }], [ph + 0.05, { expr: 'shock', ...A('shock'), lean: -0.2, tilt: -0.2 }, 0.15]], 1)); s.d.position.x = 0.12 - 0.08 * ease.out(bk);
    lens(cam, lerp(22, 18, ease.inOut(prog(t, ph, info.dur)))); cam.up.set(0, 1, 0); cam.position.set(1.75 + 0.9, 1.88, zc - 5.4); cam.lookAt(1.4, 1.3, zc); hand(cam, t, 0.015); shake(cam, t, ph, 0.08, 0.4); if (st.focusOn) st.focusOn([1.4, 1.3, zc]); s.d.face(cam); },
  overlay(g, t, info) { const ph = atc(info, t, 'pothole', info.dur * 0.68); text(g, 'POTHOLE?!', W / 2, H * 0.22, { size: 120, font: 'Nunito', weight: 900, color: '#ffd23a', alpha: ease.outBack(prog(t, ph + 0.15, ph + 0.4)), glow: 14, glowColor: 'rgba(0,0,0,.7)' }); finish(g, t); } });

// ---------- v11 "Then an engineer named Allen Breed drops a tiny steel ball into a tube, held back by a magnet. Hit a wall, and the ball flies forward and closes the circuit."
// cinematic workshop: hanging lamp, dust motes, focus pulls face -> sensor; Breed holds the tube up, drops the ball in, slams the rig into a block, fist-pumps
registerShot('v11', { kind: '3d',
  init(T) { const { THREE } = T, env = envMap(T); const st = withV(T, lifeStage(T, { sky: ['#0a0e14', '#141a24', '#1e2430'], fog: [6, 20], fogColor: '#141a24', key: 1.4, keyPos: [2, 5, 4], keyColor: '#fff2dc', ambient: 1.1, ambientSky: '#6a7a9a', focus: 1.6, aperture: 0.006, maxblur: 0.012, bloom: 0.28, beauty: 0.7, rim: '#6aa8ff', rimIntensity: 1.6 }));
    st.add(T.box(10, 5, 0.1, T.mat('#2a2e36'), 0, 2.5, -2.2)); for (let i = 0; i < 7; i++) st.add(T.box(0.04, 1.6, 0.04, T.mat('#4a3a2a'), -3 + i * 0.25, 2.2, -2.12)); st.add(T.box(2, 0.05, 0.25, T.mat('#5a4030'), -2.3, 2.95, -2.05));
    const blue = T.canvasTex(512, 384, (g, w, h) => { g.fillStyle = '#1a4a8a'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 3; g.strokeRect(60, 140, 380, 90); g.beginPath(); g.arc(130, 185, 34, 0, 7); g.stroke(); g.font = '700 26px Nunito'; g.fillStyle = '#fff'; g.fillText('BALL-IN-TUBE SENSOR', 60, 80); }); const bp = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.98), new THREE.MeshStandardMaterial({ map: blue, roughness: 0.9 })); bp.position.set(1.3, 2.1, -2.14); st.add(bp);
    const bench = T.box(3.4, 0.1, 1.6, T.mat('#6a4a34', { roughness: 0.55 }), 0, 0.96, 0); st.add(bench); st.add(T.box(3.3, 0.9, 0.06, T.mat('#4a3424'), 0, 0.45, -0.7));
    const block = T.box(0.35, 0.5, 0.6, T.mat('#5a5a5c', { roughness: 0.9 }), 0.95, 1.26, 0.1); st.add(block); const ws = T.box(0.12, 0.12, 0.12, T.mat('#c8a040', { metalness: 0.8, roughness: 0.3 }), -0.7, 1.07, 0.4); st.add(ws);
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.3, 24, 1, true), new THREE.MeshStandardMaterial({ color: '#2a4a3a', metalness: 0.5, roughness: 0.4, side: THREE.DoubleSide })); lampShade.position.set(0.1, 2.75, 0.2); st.add(lampShade); const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 10), new THREE.MeshBasicMaterial({ color: '#fff4d8' })); bulb.position.set(0.1, 2.62, 0.2); st.add(bulb); st.add(T.cyl(0.006, 0.006, 2, T.mat('#111'), 0.1, 3.8, 0.2, 4));
    const lamp = new THREE.SpotLight(new THREE.Color('#ffdcaa'), 50, 8, 0.75, 0.55, 1.5); lamp.position.set(0.1, 2.6, 0.2); lamp.target.position.set(0.1, 1.0, 0.2); lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024); st.add(lamp, lamp.target);
    const b = toon(T, { hair: 'side', hairCol: '#2a1c16', skin: '#f6d8c0', top: '#f2f2ee', tie: '#2a4a8a', coat: true, glasses: true, h: 1.78, seed: 9 }); b.position.set(-0.75, 0.0, -0.35); st.add(b);
    const rig = new THREE.Group(); st.add(rig); const S = sensor(T); S.scale.setScalar(0.2); rig.add(S); S.traverse((m) => { if (m.material && m.material.metalness > 0.5) { m.material.envMap = env; m.material.envMapIntensity = 1.4; } }); const base = T.box(0.78, 0.05, 0.22, T.mat('#3a3a40', { metalness: 0.4 }), 0, -0.1, 0); rig.add(base);
    const wire = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.008, 6, 40, Math.PI), new THREE.MeshStandardMaterial({ color: '#d8302a', emissive: new THREE.Color('#ff3a1a'), emissiveIntensity: 0 })); wire.position.set(0.37, 0.0, 0); wire.rotation.z = -Math.PI / 2; rig.add(wire);
    const bulb2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 10), new THREE.MeshStandardMaterial({ color: '#fff6d0', emissive: new THREE.Color('#ffd23a'), emissiveIntensity: 0 })); bulb2.position.set(0.37, 0.27, 0); rig.add(bulb2);
    const motes = []; const mt = T.canvasTex(32, 32, (c, w, h) => { const rg = c.createRadialGradient(16, 16, 0, 16, 16, 16); rg.addColorStop(0, 'rgba(255,240,210,1)'); rg.addColorStop(1, 'rgba(255,240,210,0)'); c.fillStyle = rg; c.fillRect(0, 0, w, h); }); const R = rng(7); for (let i = 0; i < 70; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: mt, transparent: true, opacity: 0.5, depthWrite: false })); sp.scale.setScalar(0.012 + R() * 0.02); st.add(sp); motes.push({ sp, x: (R() - 0.5) * 1.6, y: 1.1 + R() * 1.5, z: (R() - 0.5) * 1.2, s: R() }); }
    return { stage: st, b, S, rig, wire, bulb2, motes, ball: S.userData.ball }; },
  draw(s, t, info) { const st = s.stage, cam = st.camera, dr = atc(info, t, 'drops', 1.7), mg = atc(info, t, 'magnet', 3.9), hw = atc(info, t, 'wall', info.dur * 0.62), fl = atc(info, t, 'flies', hw + 0.6), cl = atc(info, t, 'circuit', info.dur - 0.5);
    // the rig: lifted to eye level (hand-held), set down on the bench, pushed into the block
    const lift = ease.inOut(prog(t, 0.3, 1.1)), down = ease.inOut(prog(t, mg + 0.3, hw - 0.5)), slam = ease.in(prog(t, hw - 0.35, hw)), rec = t > hw ? Math.exp(-(t - hw) * 9) * Math.sin((t - hw) * 40) * 0.015 : 0;
    s.rig.position.set(lerp(lerp(-0.35, -0.12, lift), lerp(0.25, 0.62, slam), down) + rec, lerp(lerp(1.08, 1.62, lift), 1.12, down), lerp(0.25, 0.15, down)); s.rig.rotation.set(0, lerp(-0.3, 0, down), lerp(lerp(0, 1.3, lift) - 0.05 * Math.sin(t * 1.5) * (1 - down), 0, down));
    // ball: dropped in (falls into the tube from above), sits by the magnet, flies at the wall hit
    const dp = ease.in(prog(t, dr, dr + 0.35)); s.S.fire(prog(t, hw, fl + 0.15)); if (t < dr + 0.35) { s.ball.position.x = lerp(2.4, -1.3, dp); s.ball.visible = t > dr - 0.05; } else s.ball.visible = true;
    const on = t > cl - 0.05 ? 1 : 0; s.wire.material.emissiveIntensity = 2 * on; s.bulb2.material.emissiveIntensity = on * (2.5 + Math.sin(t * 30) * 0.4);
    s.b.pose(t, tk(t, [[0, { expr: 'determined', ...A('rest'), look: 0.7 }], [0.3, { expr: 'talk', armL: [0.2, 0.3], armR: [-1.15, -1.2], look: 0.8, lookY: -0.4 }, 0.5], [dr - 0.15, { expr: 'surprised', armL: [-0.9, -1.3], armR: [-1.15, -1.2], look: 0.9, lookY: -0.5 }, 0.3], [mg, { expr: 'happy', armL: [0.1, 0.3] }], [mg + 0.3, { expr: 'determined', armR: [-0.9, -0.4], look: 0.9, lookY: 0.4, lean: 0.06 }, 0.5], [hw - 0.35, { armR: [-1.4, -0.1], lean: 0.14, expr: 'angry' }, 0.25], [hw + 0.05, { expr: 'shock', ...A('shock'), lean: 0 }, 0.2], [cl, { expr: 'laugh', armL: [0.2, 0.3], armR: [-2.7, 0.9], tilt: 0.12 }, 0.3]], 9));
    s.b.position.x = -0.75 + 0.18 * slam; s.b.position.y = t > cl ? Math.abs(Math.sin((t - cl) * 9)) * 0.06 : 0;
    s.motes.forEach((m, i) => m.sp.position.set(m.x + Math.sin(t * 0.3 + i) * 0.1, m.y + Math.sin(t * 0.2 + m.s * 6) * 0.08, m.z));
    // camera: medium on Breed (face in focus) -> push to the tube macro as it hits the wall -> pull back a touch for the fist pump
    const a = ease.inOut(prog(t, 0.1, mg + 0.2)), b = ease.inOut(prog(t, mg + 0.4, hw - 0.1)), c = ease.inOut(prog(t, cl + 0.2, info.dur));
    const P = V3(V3(V3([-1.6, 1.75, 2.8], [-0.4, 1.7, 1.9], a), [0.35, 1.6, 2.2], b), [0.0, 1.55, 2.1], c), L = V3(V3(V3([-0.7, 1.5, -0.3], s.rig.position.toArray().map((v, i) => v + [0, 0.05, 0][i]), a * 0.6), s.rig.position.toArray(), b), [-0.2, 1.4, 0], c);
    lens(cam, lerp(lerp(34, 30, a), 30, b) + c * 6); cam.up.set(0, 1, 0); cam.position.set(...P); cam.lookAt(...L); hand(cam, t, 0.006); shake(cam, t, hw, 0.025, 0.35);
    if (st.focusOn) st.focusOn(b < 0.5 && a < 0.55 ? [-0.75, 1.5, -0.35] : s.rig.position.toArray()); s.b.face(cam); },
  overlay(g, t, info) { const cl = atc(info, t, 'circuit', info.dur - 0.5), mg = atc(info, t, 'magnet', 3.9), hw = atc(info, t, 'wall', info.dur * 0.62); chipTop(g, 'ALLEN BREED · 1968', ease.out(prog(t, 0.3, 0.7)) * (1 - prog(t, 3.2, 3.6)));
    const lab = (s, x, y, a) => { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = '900 42px Nunito'; const w = g.measureText(s).width + 40; rr(g, x - w / 2, y - 32, w, 64, 32); g.fillStyle = 'rgba(10,10,20,.78)'; g.fill(); g.restore(); text(g, s, x, y + 2, { size: 42, font: 'Nunito', weight: 900, color: '#ffd23a', alpha: a }); };
    lab('MAGNET', W * 0.3, H * 0.62, prog(t, mg, mg + 0.3) * (1 - prog(t, hw - 0.6, hw - 0.3))); if (t > cl - 0.05) { glow(g, W * 0.6, H * 0.42, 300, '#ffd23a', 0.6 * clamp(1 - (t - cl) / 0.7)); lab('CIRCUIT CLOSED → FIRE!', W / 2, H * 0.7, prog(t, cl, cl + 0.2)); } if (t > hw && t < hw + 0.12) veil(g, '#fff', 0.25); finish(g, t, { v: 0.55 }); } });

// ---------- v12 "Swap the air for a pellet that burns into a cloud of nitrogen, and the bag fills in thirty milliseconds. Faster than you can blink."
registerShot('v12', { kind: '3d',
  init(T) { const { THREE } = T; const st = withV(T, lifeStage(T, { sky: ['#0a0c12', '#12161e', '#1a1e28'], fog: [8, 30], fogColor: '#12161e', key: 3.2, keyPos: [3, 5, 6], keyColor: '#fff4e8', ambient: 1.5, ambientSky: '#8aa0c8', focus: 4, aperture: 0.002, maxblur: 0.006, bloom: 0.18, rim: '#5aa0ff', rimIntensity: 2.2, beauty: 0.5 }));
    const wc = wheelCutaway(T); st.add(wc); const col = T.cyl(0.12, 0.16, 2.0, T.mat('#2a2a30', { roughness: 0.5 }), 0, 0, -1.1); col.rotation.x = Math.PI / 2; st.add(col);
    const dash = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 1.4), new THREE.MeshStandardMaterial({ color: '#1e1e22', roughness: 0.7 })); dash.position.set(0, -1.4, -1.6); st.add(dash); return { stage: st, wc }; },
  draw(s, t, info) { const st = s.stage, cam = st.camera, pe = atc(info, t, 'pellet', 0.6), bu = atc(info, t, 'burns', 1.1), ni = atc(info, t, 'nitrogen', 1.9), fi = atc(info, t, 'fills', 2.7), th = atc(info, t, 'thirty', 3.1), bl = atc(info, t, 'blink', info.dur - 0.5);
    const P = { ign: prog(t, bu - 0.1, bu + 0.3), gas: prog(t, bu + 0.1, fi), open: prog(t, fi - 0.15, fi + 0.25), fill: prog(t, fi - 0.05, th + 0.8), powder: prog(t, th + 0.4, info.dur) }; s.wc.fire(t, P);
    s.wc.userData.pellets.forEach((p, i) => { const pop = ease.outBack(prog(t, pe + i * 0.008, pe + 0.2 + i * 0.008)); p.scale.setScalar(t < pe ? 1 : lerp(1, 1.15, Math.sin(Math.PI * clamp(pop)))); });
    // camera: 3/4 macro into the cutaway, then pull back + rise as the bag explodes toward lens
    const a = ease.inOut(prog(t, 0, ni)), b = ease.out(prog(t, fi - 0.2, th + 1.2)); lens(cam, lerp(lerp(34, 26, a), 40, b)); cam.up.set(0, 1, 0);
    cam.position.set(...V3(V3([3.0, 1.6, 4.8], [0.85, 0.5, 1.5], a), [2.2, 1.0, 5.2], b)); cam.lookAt(...V3([0.05, 0, 0], [0, 0, 0.6], b)); hand(cam, t, 0.004); shake(cam, t, fi, 0.05, 0.4); if (st.focusOn) st.focusOn([0, 0, lerp(0.05, 0.7, b)]); },
  overlay(g, t, info) { const pe = atc(info, t, 'pellet', 0.6), ni = atc(info, t, 'nitrogen', 1.9), fi = atc(info, t, 'fills', 2.7), bl = atc(info, t, 'blink', info.dur - 0.5), th = atc(info, t, 'thirty', 3.1);
    const lab = (s, sub, x, y, lx, ly, a) => { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = '#ffd23a'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y + 30); g.lineTo(lx, ly); g.stroke(); circle(g, lx, ly, 9, '#ffd23a'); g.font = '900 44px Nunito'; const w = Math.max(g.measureText(s).width, 200) + 44; rr(g, x - w / 2, y - 40, w, sub ? 112 : 76, 22); g.fillStyle = 'rgba(8,10,18,.82)'; g.fill(); g.restore(); text(g, s, x, y - 2, { size: 44, font: 'Nunito', weight: 900, color: '#ffd23a', alpha: a }); if (sub) text(g, sub, x, y + 44, { size: 30, font: 'Nunito', weight: 800, color: '#cfe0ff', alpha: a }); };
    lab('PELLETS', 'sodium azide', W * 0.3, H * 0.27, W * 0.47, H * 0.47, prog(t, pe, pe + 0.25) * (1 - prog(t, fi - 0.3, fi)));
    lab('NITROGEN GAS', 'N₂  —  the air you breathe', W * 0.66, H * 0.7, W * 0.56, H * 0.52, prog(t, ni, ni + 0.25) * (1 - prog(t, fi - 0.1, fi + 0.1)));
    if (t > fi - 0.1) { const k = clamp(prog(t, fi - 0.05, th + 0.8) * 1.05); text(g, `0.${String(Math.round(30 * k)).padStart(3, '0')} s`, W / 2, H * 0.18, { size: 130, font: 'Nunito', weight: 900, color: '#ffd23a', glow: 14, glowColor: 'rgba(0,0,0,.7)', alpha: prog(t, fi - 0.1, fi + 0.1) }); }
    chipTop(g, 'SLOW MOTION ×1000', ease.out(prog(t, 0.1, 0.4)) * (1 - prog(t, pe + 0.2, pe + 0.5)), '#bfe0ff');
    if (t > bl - 0.4) { const a = ease.out(prog(t, bl - 0.4, bl)); const lid = clamp((t - bl) / 0.6); g.save(); g.globalAlpha = a; g.translate(W / 2, H * 0.8); g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(0, 0, 150, 80 * (1 - lid * 0.9), 0, 0, 7); g.fill(); circle(g, 0, 0, 55 * (1 - lid * 0.9), '#3a6aa8'); circle(g, 0, 0, 25 * (1 - lid * 0.9), '#0a0a12'); g.restore(); text(g, 'BLINK = 0.300 s', W / 2, H * 0.89, { size: 46, font: 'Nunito', weight: 900, color: '#ffffff', alpha: a }); }
    finish(g, t, { v: 0.5 }); } });

// ---------- v13 "But by the time cars finally got them, his patent had expired, and he never made a cent." old man, golden window light
registerShot('v13', { kind: '3d',
  init(T) { const Wd = world(T, 'bedroom', { mood: 'golden', seed: 5 }); const st = withV(T, Wd.stage); const d = toon(T, { ...DAD, hair: 'bald', hairCol: '#e8e8ea', top: '#8a6a4a', glasses: true, h: 1.5, seed: 4 }); d.position.set(0.2, 0.05, 0.5); st.add(d); const ch = T.mat('#7a2a2a', { roughness: 0.8 }); st.add(T.box(1.0, 0.45, 0.8, ch, 0.2, 0.25, 0.35)); st.add(T.box(1.0, 1.0, 0.2, ch, 0.2, 0.75, 0.0)); for (const x of [-0.32, 0.72]) st.add(T.box(0.18, 0.62, 0.8, ch, x, 0.4, 0.35));
    const np = T.canvasTex(256, 320, (g, w, h) => { g.fillStyle = '#f2ead6'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1612'; g.font = '900 34px Georgia'; g.textAlign = 'center'; g.fillText('AIRBAGS', w / 2, 60); g.font = '700 22px Georgia'; g.fillText('NOW IN NEW CARS', w / 2, 92); g.fillStyle = '#8a8478'; for (let i = 0; i < 8; i++) g.fillRect(24, 120 + i * 22, i % 3 ? 208 : 120, 8); g.strokeStyle = '#1a1612'; g.lineWidth = 3; g.strokeRect(140, 118, 92, 70); });
    const p = new T.THREE.Mesh(new T.THREE.PlaneGeometry(0.42, 0.52), new T.THREE.MeshStandardMaterial({ map: np, side: T.THREE.DoubleSide })); p.position.set(0.25, 0.95, 0.85); st.add(p); return { stage: st, Wd, d, p }; },
  draw(s, t, info) { s.Wd.tick(t); const st = s.stage, cam = st.camera, ex = atc(info, t, 'expired', info.dur * 0.55), ce = atc(info, t, 'cent', info.dur - 0.6);
    s.d.pose(t, tk(t, [[0, { expr: 'neutral', seated: true, armL: [0.5, -1.6], armR: [-0.5, 1.6], lookY: 0.5 }], [ex, { expr: 'sad', lookY: 0.5 }, 0.5], [ce - 0.3, { expr: 'sad', tear: true, tilt: 0.1, lookY: 0.2, look: 0.5, armL: [0.1, -0.6], armR: [-0.1, 0.6] }, 0.6]], 4));
    s.p.rotation.set(-0.35, 0.05, 0); s.p.position.y = t > ce - 0.3 ? lerp(0.95, 0.7, ease.inOut(prog(t, ce - 0.3, ce + 0.3))) : 0.95;
    const k = ease.inOut(clamp(t / info.dur)); lens(cam, lerp(34, 28, k)); cam.up.set(0, 1, 0); cam.position.set(lerp(2.0, 1.2, k), lerp(1.45, 1.35, k), lerp(4.0, 3.2, k)); cam.lookAt(0.2, 1.05, 0.5); hand(cam, t, 0.006); if (st.focusOn) st.focusOn([0.2, 1.1, 0.6]); s.d.face(cam); },
  overlay(g, t, info) { const ex = atc(info, t, 'expired', info.dur * 0.55); stamp(g, 'PATENT EXPIRED', W / 2, H * 0.82, prog(t, ex - 0.05, ex + 0.25), -0.12, '#e8202a', 84); text(g, '$0', W / 2, H * 0.91, { size: 110, font: 'Nunito', weight: 900, color: '#ffd23a', alpha: prog(t, ex + 0.8, ex + 1.1), glow: 12, glowColor: 'rgba(0,0,0,.7)' }); finish(g, t, { v: 0.55 }); } });

// ---------- v14 "And that's how the airbag was invented." crash-test lab, slow motion: dummy into the bag
registerShot('v14', { kind: '3d',
  init(T) { const { THREE } = T; const st = withV(T, lifeStage(T, { sky: ['#1a1c22', '#24262e', '#2e3038'], fog: [14, 50], fogColor: '#24262e', key: 2.0, keyPos: [-3, 9, 6], keyColor: '#f4f6ff', ambient: 0.8, ambientSky: '#c8d0e0', dof: false, bloom: 0.25, beauty: 0.6, rim: '#ffffff', rimIntensity: 1.5 }));
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ map: T.tiles('#5a5c62', 12, [10, 10]), roughness: 0.5, metalness: 0.1 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; st.add(fl);
    for (let x = -12; x < 4; x += 1.2) { const m = T.box(0.6, 0.01, 0.1, T.mat('#f2f2f2'), x, 0.005, 1.4); st.add(m); const m2 = m.clone(); m2.position.z = -1.4; st.add(m2); }
    const bar = new THREE.Group(); st.add(bar); bar.position.set(3.25, 0, 0); for (let i = 0; i < 6; i++) bar.add(T.box(0.7, 0.32, 4.4, T.mat(i % 2 ? '#1a1a1e' : '#f2c41a', { roughness: 0.6 }), 0, 0.16 + i * 0.32, 0)); bar.add(T.box(0.08, 1.95, 4.4, T.mat('#9a9aa0', { metalness: 0.6, roughness: 0.4 }), -0.38, 0.97, 0));
    st.add(T.box(30, 8, 0.2, T.mat('#2e3038'), 0, 4, 6)); for (let i = 0; i < 8; i++) { const L = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.3), new THREE.MeshBasicMaterial({ color: '#ffffff' })); L.position.set(-8 + i * 2.2, 5.5, 0); st.add(L); }
    const c = car(T, { color: '#b8bec8', roof: '#d8dce2', seat: '#3a3a42', glassOpacity: 0.08 }); st.add(c); const D = dummy(T); D.position.set(0.0, 0.85, -0.4); c.add(D);
    const b = airbag(T); b.scale.setScalar(0.42); b.rotation.y = -Math.PI / 2; b.position.set(0.5, 1.22, -0.4); c.add(b);
    const debris = []; const R = rng(4); for (let i = 0; i < 30; i++) { const m = T.box(0.04 + R() * 0.06, 0.02, 0.04 + R() * 0.06, T.mat(i % 3 ? '#c8d8e8' : '#e8e8ec', { metalness: 0.5, roughness: 0.2 }), 0, -5, 0); st.add(m); debris.push({ m, v: [-(0.5 + R() * 2), 1 + R() * 2.5, (R() - 0.5) * 4], r: R() }); }
    return { stage: st, c, D, b, debris }; },
  draw(s, t, info) { const st = s.stage, cam = st.camera, hit = 0.55, slow = 0.22;
    // real time until impact, then slow motion (x0.22); car crumples 0.5 m and rebounds
    const tt = t < hit ? t : hit + (t - hit) * slow, crush = ease.out(clamp((tt - hit) / 0.08)), x = tt < hit ? lerp(-9, 0.12, tt / hit) : 0.12 + 0.35 * crush - 0.08 * clamp((tt - hit - 0.08) / 0.2);
    s.c.position.set(x, 0, 0); s.c.rotation.set(0, 0, 0); s.c.rotateZ(-0.03 * Math.sin(Math.PI * clamp((tt - hit) / 0.25))); s.c.spin(x); s.c.scale.set(1 - 0.05 * crush, 1, 1);
    const bk = prog(tt, hit + 0.015, hit + 0.045); s.b.inflate(bk); const lean = ease.inOut(prog(tt, hit + 0.02, hit + 0.1)); s.D.lean(lean * 0.9, lean * 0.6 - 0.3 * prog(tt, hit + 0.1, hit + 0.2)); s.D.position.x = 0.12 * lean;
    s.debris.forEach((q) => { const u = Math.max(0, tt - hit) * 3.2; q.m.position.set(2.5 + q.v[0] * u * 0.4, 0.6 + q.v[1] * u * 0.5 - 4.9 * u * u * 0.1, q.v[2] * u * 0.4); q.m.rotation.set(u * 9 * q.r, u * 7, u * 5); q.m.visible = tt > hit; });
    lens(cam, lerp(34, 28, ease.inOut(clamp(t / info.dur)))); cam.up.set(0, 1, 0); cam.position.set(lerp(-1.4, 0.2, ease.out(clamp(t / info.dur))), 1.35, -4.2); cam.lookAt(0.6, 1.1, 0); hand(cam, t, 0.005); shake(cam, t, hit, 0.06, 0.5); },
  overlay(g, t, info) { const hit = 0.55, ai = atc(info, t, 'airbag', info.dur * 0.5); if (t > hit && t < hit + 0.1) veil(g, '#fff', 0.5);
    text(g, t < hit ? '50 km/h' : 'HIGH-SPEED CAMERA', W * 0.5, H * 0.1, { size: 40, font: 'Nunito', weight: 900, color: '#ffffff', alpha: 0.8, spacing: 4 });
    const a = ease.outBack(prog(t, ai - 0.1, ai + 0.3)); g.save(); g.translate(W / 2, H * 0.24); g.scale(a, a); text(g, 'AIRBAG', 0, 0, { size: 190, font: 'Nunito', weight: 900, color: '#e8202a', glow: 16, glowColor: 'rgba(255,255,255,.9)', spacing: 10 }); g.restore();
    text(g, 'invented by a dad · 1952', W / 2, H * 0.33, { size: 46, font: 'Nunito', weight: 900, color: '#ffffff', alpha: prog(t, ai + 0.4, ai + 0.8), glow: 8, glowColor: 'rgba(0,0,0,.8)' }); finish(g, t); veil(g, '#000', ease.in(prog(t, info.dur - 0.5, info.dur)) * 0.6); } });
