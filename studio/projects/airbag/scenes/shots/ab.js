// shots/ab.js: "The Rock That Invented the Airbag" (9:16). Story first, name revealed in the last line. 3D worlds + 2D inserts.
import { E, registerShot, ease, prog, clamp, lerp, glow, alpha, text, veil, rr, rng, seg, circle } from '/engine/core.js';
import { world } from '../sets/worlds.js';
import { lifeStage } from '../sets/lifesim.js';
import { person2, perform } from '../sets/cast.js';
import { roadWorld, car, interior, sensor, airbag } from '../sets/ab_props.js';
import { blueprint, scribble, scribbleCircle, tick, badge } from '../sets/diagram.js';
import { local } from '../sets/ui.js';

const W = E.W, H = E.H;
const atc = (info, t, w, fb) => { const x = local(info, t, w); return x == null || x < -0.2 || x > info.dur ? fb : x; };
const V3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const cam = (st, t, info, p0, p1, l0, l1, fov = 52, e = ease.inOut) => { const k = e(clamp(t / info.dur)); st.camera.fov = fov; st.camera.updateProjectionMatrix(); st.camera.position.set(...V3(p0, p1, k)); st.camera.lookAt(...V3(l0, l1 || l0, k)); };
const chipTop = (g, str, a = 1, col = '#ffd23a') => { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.font = '900 40px Nunito'; const w = g.measureText(str).width + 60; rr(g, W / 2 - w / 2, 150, w, 70, 35); g.fillStyle = 'rgba(10,10,20,.72)'; g.fill(); g.restore(); text(g, str, W / 2, 186, { size: 40, font: 'Nunito', weight: 900, color: col, alpha: a, spacing: 4 }); };
const stamp = (g, str, x, y, a, rot = -0.18, col = '#e8202a', size = 120) => { if (a <= 0) return; const s = 1 + 0.6 * (1 - ease.out(clamp(a))); g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha = clamp(a); g.font = `900 ${size}px Nunito`; const w = g.measureText(str).width + 50; g.strokeStyle = col; g.lineWidth = 12; rr(g, -w / 2, -size * 0.62, w, size * 1.15, 18); g.stroke(); g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, 0, 6); g.restore(); };
const shake = (st, t, t0, amp = 0.15) => { const k = clamp(1 - (t - t0) / 0.5); if (t > t0 && k > 0) { st.camera.position.x += Math.sin(t * 90) * amp * k; st.camera.position.y += Math.cos(t * 77) * amp * k; } };

const DAD = { skin: '#f0c8a8', hair3: 'sidepart', hairColor: '#3a2a20', outfit: 'shirt', top: '#e8dcc0', pants: '#4a4a52', face: { mustache: true }, faceStyle: 'pop', iris: '#3a2a1a', rim: '#ffe0a0', rimOpacity: 0.3 };
const MOM = { skin: '#f2cca8', hair3: 'bun', hairColor: '#6a3a20', outfit: 'cardigan', top: '#3a8a6a', face: { lashes: true }, faceStyle: 'pop', iris: '#4a3020', acc: ['earrings'], rim: '#ffd0e0', rimOpacity: 0.3 };
const KID = { skin: '#f2cca8', hair3: 'twobuns', hairColor: '#7a4a28', outfit: 'tee', top: '#ffd23a', faceStyle: 'pop', iris: '#4a3020', s: 0.72, rim: '#fff0a0', rimOpacity: 0.3 };

// s01 "He was driving his wife and daughter home when a huge rock appeared in the middle of the road."
registerShot('s01', { kind: '3d',
  init(T) { const Rw = roadWorld(T); const c = car(T, { s: 1.2 }); c.rotation.y = Math.PI / 2; Rw.stage.add(c); return { stage: Rw.stage, rock: Rw.rock, c }; },
  draw(s, t, info) { const rk = atc(info, t, 'rock', info.dur * 0.65), z = -t * 7; s.c.position.set(0.9, 0, z); s.c.spin(t * 7); s.c.rotation.z = Math.sin(t * 9) * 0.004;
    s.rock.position.z = z - 22; const k = ease.inOut(clamp((t - rk + 0.3) / 0.8));
    s.stage.camera.fov = 50; s.stage.camera.updateProjectionMatrix(); s.stage.camera.position.set(lerp(-3.6, 0.9, k), lerp(2.2, 2.8, k), z + lerp(7.5, 8.0, k)); s.stage.camera.lookAt(lerp(0.9, 0.5, k), 0.9, z - lerp(2, 20, k)); },
  overlay(g, t) { chipTop(g, 'PENNSYLVANIA · 1952', ease.out(prog(t, 0.2, 0.6))); } });

// s02 "He slams the brakes, yanks the wheel, and the car plunges nose first into a ditch."
registerShot('s02', { kind: '3d',
  init(T) { const Rw = roadWorld(T); const c = car(T, { s: 1.2 }); c.rotation.y = Math.PI / 2; Rw.stage.add(c); Rw.rock.position.set(0.4, 0.55, -8);
    const dust = []; for (let i = 0; i < 40; i++) { const p = new T.THREE.Mesh(new T.THREE.SphereGeometry(0.25, 8, 6), new T.THREE.MeshStandardMaterial({ color: '#c8b08a', transparent: true, opacity: 0 })); Rw.stage.add(p); dust.push(p); }
    return { stage: Rw.stage, c, dust, R: rng(4) }; },
  draw(s, t, info) { const br = atc(info, t, 'brakes', 0.3), di = atc(info, t, 'ditch', 2.2), sw = ease.inOut(prog(t, br + 0.2, di)), dp = ease.in(prog(t, di - 0.35, di));
    const z = lerp(0, -5.5, ease.out(clamp(t / di))); s.c.position.set(lerp(0.9, 5.2, sw), -1.0 * dp, z); s.c.rotation.set(0, Math.PI / 2 - 0.5 * sw, 0); s.c.rotateZ(-0.6 * dp); s.c.spin(z * -1);
    s.dust.forEach((p, i) => { const R = (i * 0.618) % 1, u = clamp((t - di) / 1.2); p.position.set(5.2 + (R - 0.5) * 3 * (0.4 + u), 0.2 + u * (1 + R * 1.5), z - 1.5 + ((i * 0.37) % 1 - 0.5) * 3); p.scale.setScalar(0.6 + u * 2); p.material.opacity = t > di ? 0.55 * (1 - u) : 0; });
    cam(s.stage, t, info, [-2.5, 1.0, 4.5], [-1.5, 1.4, 2.0], [1.5, 0.6, -3], [4.8, 0.2, -5.5], 52); shake(s.stage, t, di, 0.25); },
  overlay(g, t, info) { const di = atc(info, t, 'ditch', 2.2); const f = clamp(1 - (t - di) / 0.25); if (t > di) veil(g, '#ffffff', 0.5 * f); } });

// s03 "Without thinking, he throws his arm across his little girl. So does his wife."
registerShot('s03', { kind: '3d',
  init(T) { const st = lifeStage(T, { sky: ['#5a8ad8', '#a8c8e8', '#ffd8a0'], fog: [10, 40], fogColor: '#e8d0b0', key: 2.4, keyPos: [-6, 8, 6], ambient: 1.7, dof: false, bloom: 0.12 }); interior(T, st);
    const d = person2(T, DAD), m = person2(T, MOM), k = person2(T, KID); d.position.set(-0.6, 0.38, 0.05); m.position.set(0.62, 0.38, 0.05); k.position.set(0.02, 0.38, 0.1); [d, m, k].forEach((p) => { p.set({ sit: true }); st.add(p); }); return { stage: st, d, m, k }; },
  draw(s, t, info) { const th = atc(info, t, 'throws', 0.8), wf = atc(info, t, 'wife', info.dur - 0.7);
    perform(s.d, t, [[0, { expr: 'shock', armR: 0.2, tilt: 0.1 }], [th, { expr: 'determined', armL: 1.45, reachL: 1.45, look: [0.7, 0] }]], { seed: 1 });
    perform(s.m, t, [[0, { expr: 'shock' }], [wf - 0.1, { expr: 'worried', armR: 1.45, reachR: 1.45, look: [-0.7, 0] }]], { seed: 2 });
    perform(s.k, t, [[0, { expr: 'shock', armL: 1.2, armR: 1.2 }], [th + 0.5, { expr: 'scared', armL: 0.3, armR: 0.3, look: [0, 0.3] }]], { seed: 3 });
    cam(s.stage, t, info, [0.0, 2.1, 3.0], [0.0, 2.0, 2.6], [0, 1.0, 0], null, 66); shake(s.stage, t, 0, 0.08); } });

// s04 "Everyone's okay. But that night he can't sleep. Because what if their arms hadn't been fast enough?"
registerShot('s04', { kind: '3d',
  init(T) { const Wd = world(T, 'bedroom', { mood: 'night', seed: 3 }); const d = person2(T, { ...DAD, outfit: 'stripes', top: '#7a9ad0' }); d.position.set(0.3, 0.45, 0.4); d.set({ sit: true }); Wd.stage.add(d); return { stage: Wd.stage, Wd, d }; },
  draw(s, t, info) { s.Wd.tick(t); const wi = atc(info, t, 'what', info.dur * 0.55);
    perform(s.d, t, [[0, { expr: 'happy' }], [0.9, { expr: 'worried', look: [0.3, 0.3] }], [wi, { expr: 'sad', tilt: 0.12, nod: 0.12, armL: 0.6, armR: 0.6, reachL: 0.8, reachR: 0.8 }]], { seed: 4 });
    cam(s.stage, t, info, [2.6, 1.6, 3.6], [1.3, 1.3, 2.2], [0.3, 1.1, 0.4], null, 52); },
  overlay(g, t) { text(g, '2:47 AM', W * 0.78, H * 0.16, { size: 64, font: 'Nunito', weight: 900, color: '#ff4a3a', alpha: 0.9, glow: 14, glowColor: 'rgba(255,40,30,.6)' }); } });

// s05 "He'd spent years in the Navy fixing torpedoes, and he remembers how they were driven by a blast of compressed air."
registerShot('s05', { draw(g, t, info) {
  blueprint(g); const bl = atc(info, t, 'blast', info.dur * 0.75), k = ease.inOut(prog(t, 0.2, 1.4)), cx = W * 0.5, cy = H * 0.48;
  g.save(); g.translate(cx + lerp(-200, 0, k) + ease.in(prog(t, bl, bl + 1.0)) * 900, cy); g.strokeStyle = '#e8f4ff'; g.lineWidth = 6; g.fillStyle = 'rgba(232,244,255,.08)';
  rr(g, -360, -70, 640, 140, 70); g.fill(); g.stroke(); g.beginPath(); g.moveTo(280, -70); g.quadraticCurveTo(420, 0, 280, 70); g.stroke(); for (const s of [-1, 1]) { g.beginPath(); g.moveTo(-360, 0); g.lineTo(-450, s * 90); g.lineTo(-420, 0); g.stroke(); }
  rr(g, -280, -40, 220, 80, 20); g.stroke(); text(g, 'AIR', -170, 2, { size: 40, font: 'Nunito', weight: 900, color: '#ffd23a' });
  if (t > bl - 0.1) { const a = clamp((t - bl + 0.1) / 0.3); for (let i = 0; i < 8; i++) { const ph = (t * 3 + i / 8) % 1; seg(g, [[-460 - ph * 300, (i - 3.5) * 22], [-520 - ph * 300, (i - 3.5) * 26]], 5, alpha('#ffd23a', a * (1 - ph))); } }
  g.restore(); text(g, 'U.S. NAVY · TORPEDO', W / 2, H * 0.3, { size: 46, font: 'Nunito', weight: 900, color: '#bfe0ff', spacing: 6, alpha: ease.out(prog(t, 0.1, 0.5)) });
  scribble(g, 'compressed air!', W * 0.5, H * 0.66, prog(t, bl - 0.1, bl + 0.6), { size: 72 });
} });

// s06 "So he sketches a bag, folded inside the steering wheel, that bursts open the moment you crash." pencil sketch on paper
registerShot('s06', { draw(g, t, info) {
  const gr = g.createRadialGradient(W / 2, H * 0.45, 100, W / 2, H * 0.45, H * 0.8); gr.addColorStop(0, '#f6efdc'); gr.addColorStop(1, '#b8a888'); g.fillStyle = gr; g.fillRect(0, 0, W, H); glow(g, W * 0.3, H * 0.15, 600, '#ffd890', 0.3);
  g.strokeStyle = 'rgba(80,110,160,.25)'; g.lineWidth = 2; for (let y = 200; y < H; y += 60) { g.beginPath(); g.moveTo(80, y); g.lineTo(W - 80, y); g.stroke(); }
  const bu = atc(info, t, 'bursts', info.dur * 0.65), cx = W / 2, cy = H * 0.5, draw = (a, b) => clamp((t - a) / (b - a));
  g.save(); g.strokeStyle = '#2a2a3a'; g.lineWidth = 7; g.lineCap = 'round'; const d1 = draw(0.2, 1.2); g.beginPath(); g.arc(cx, cy, 230, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * d1); g.stroke();
  const d2 = draw(0.8, 1.5); for (const a of [Math.PI / 2, Math.PI * 1.15, -Math.PI * 0.15]) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 230 * d2, cy + Math.sin(a) * 230 * d2); g.stroke(); }
  g.beginPath(); g.arc(cx, cy, 60 * draw(1.2, 1.6), 0, 7); g.stroke();
  const b = ease.outBack(prog(t, bu - 0.1, bu + 0.3)); if (b > 0) { g.setLineDash([16, 10]); g.strokeStyle = '#d8302a'; g.lineWidth = 8; g.beginPath(); g.ellipse(cx, cy - 40 * b, 300 * b, 260 * b, 0, 0, 7); g.stroke(); g.setLineDash([]); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; seg(g, [[cx + Math.cos(a) * 320 * b, cy - 40 + Math.sin(a) * 280 * b], [cx + Math.cos(a) * 380 * b, cy - 40 + Math.sin(a) * 330 * b]], 6, '#d8302a'); } }
  g.restore(); scribble(g, 'SAFETY CUSHION', W / 2, H * 0.2, prog(t, 0.4, 1.4), { size: 80, color: '#2a2a3a', rot: -0.05 }); scribbleCircle(g, cx, cy, 340, 320, prog(t, bu + 0.4, bu + 1.0), { color: '#d8302a' });
  // pencil
  const px = cx + Math.cos(-Math.PI / 2 + Math.PI * 2 * d1) * 230, py = cy + Math.sin(-Math.PI / 2 + Math.PI * 2 * d1) * 230; if (t < 1.7) { g.save(); g.translate(px, py); g.rotate(0.7); g.fillStyle = '#ffd23a'; g.fillRect(0, -14, 220, 28); g.fillStyle = '#f2d2b0'; g.beginPath(); g.moveTo(0, -14); g.lineTo(-40, 0); g.lineTo(0, 14); g.fill(); g.restore(); }
} });

// s07 "He patents it in 1953" patent page + stamp
registerShot('s07', { draw(g, t, info) {
  g.fillStyle = '#20242c'; g.fillRect(0, 0, W, H); const z = 1 + 0.06 * t; g.save(); g.translate(W / 2, H * 0.45); g.scale(z, z); g.rotate(-0.04);
  rr(g, -400, -580, 800, 1160, 8); g.fillStyle = '#f4ecd8'; g.fill(); text(g, 'UNITED STATES PATENT OFFICE', 0, -500, { size: 34, font: 'Playfair Display', weight: 900, color: '#2a2418' });
  text(g, 'SAFETY CUSHION ASSEMBLY', 0, -430, { size: 44, font: 'Playfair Display', weight: 900, color: '#2a2418' }); text(g, 'FOR AUTOMOTIVE VEHICLES', 0, -380, { size: 30, font: 'Playfair Display', weight: 700, color: '#2a2418' });
  g.strokeStyle = '#2a2418'; g.lineWidth = 4; g.beginPath(); g.arc(0, -60, 170, 0, 7); g.stroke(); g.beginPath(); g.ellipse(0, -100, 230, 190, 0, 0, 7); g.setLineDash([12, 8]); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#8a8270'; for (let i = 0; i < 10; i++) g.fillRect(-320, 200 + i * 34, i % 3 === 2 ? 400 : 640, 10); g.restore();
  stamp(g, 'PATENTED 1953', W / 2, H * 0.7, prog(t, 0.35, 0.65), -0.14, '#c8202a', 92); badge(g, 'No. 2,649,311', W / 2, H * 0.8, prog(t, 0.7, 1.0), { bg: '#2a2418' });
} });

// s08 "...and takes it to every carmaker in America. They laugh him out of the room." boardroom
registerShot('s08', { kind: '3d',
  init(T) { const Wd = world(T, 'office', { mood: 'day', seed: 6, bright: 1.1 }); const d = person2(T, { ...DAD, outfit: 'blazer', top: '#5a5a62', tie: '#8a1a2a' }); d.position.set(-1.6, 0, 1.3); d.rotation.y = 0.8; Wd.stage.add(d);
    const ex = ['rich', 'dad', 'teacher'].map((n, i) => { const p = person2(T, n, { faceStyle: 'pop', outfit: 'blazer', top: ['#1e2a4a', '#3a3a44', '#2a3a2a'][i], tie: '#c8a050', prop: null, acc: [] }); p.position.set(0.2 + i * 0.9, 0, 0.4 - i * 0.2); p.rotation.y = -0.5; Wd.stage.add(p); return p; });
    return { stage: Wd.stage, Wd, d, ex }; },
  draw(s, t, info) { s.Wd.tick(t); const la = atc(info, t, 'laugh', info.dur * 0.55);
    perform(s.d, t, [[0, { expr: 'proud', armR: 0.9, reachR: 1.0 }], [la, { expr: 'sad', armR: 0.15, reachR: 0, nod: 0.15 }]], { seed: 1 });
    s.ex.forEach((p, i) => perform(p, t, [[0, { expr: 'suspicious' }], [la - 0.1 + i * 0.12, { expr: 'laugh', armL: 1.4, armR: 1.4, jump: 1, tilt: 0.15 }]], { seed: 5 + i }));
    cam(s.stage, t, info, [-3.4, 1.8, 4.4], [-2.2, 1.6, 3.6], [-0.4, 1.3, 0.6], [0.4, 1.4, 0.4], 54); },
  overlay(g, t, info) { const la = atc(info, t, 'laugh', info.dur * 0.55); const R = rng(3); for (let i = 0; i < 6; i++) { const st = la + i * 0.15; const a = clamp((t - st) / 0.2) * (1 - prog(t, st + 1.0, st + 1.4)); if (a > 0) text(g, ['HA!', 'HAHA', 'HA!'][i % 3], W * (0.45 + R() * 0.45), H * (0.2 + R() * 0.2), { size: 70 + R() * 40, font: 'Nunito', weight: 900, color: '#ffd23a', alpha: a, glow: 10, glowColor: 'rgba(0,0,0,.6)' }); } } });

// s09 "A crash is over in a tenth of a second. His air tank is way too slow." stopwatch race
registerShot('s09', { draw(g, t, info) {
  blueprint(g, { top: '#2a2a3a', bottom: '#121220' }); const sl = atc(info, t, 'slow', info.dur * 0.75);
  const cx = W / 2, cy = H * 0.36, k = clamp(t / 1.2); g.strokeStyle = '#ffffff'; g.lineWidth = 12; g.beginPath(); g.arc(cx, cy, 220, 0, 7); g.stroke(); g.fillStyle = '#ffffff'; g.fillRect(cx - 30, cy - 280, 60, 40);
  g.strokeStyle = '#ff4a3a'; g.lineWidth = 10; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(k * Math.PI * 2) * 180, cy - Math.cos(k * Math.PI * 2) * 180); g.stroke();
  text(g, (0.1 * k).toFixed(2) + ' s', cx, cy + 300, { size: 110, font: 'Nunito', weight: 900, color: '#ffd23a' }); text(g, 'CRASH', cx, cy - 330, { size: 52, font: 'Nunito', weight: 900, color: '#ff8a7a', spacing: 8 });
  const bx = W * 0.15, by = H * 0.72, bw = W * 0.7, fill = ease.out(clamp(t / 4)) * 0.35; rr(g, bx, by, bw, 70, 35); g.fillStyle = 'rgba(255,255,255,.12)'; g.fill(); rr(g, bx, by, bw * fill, 70, 35); g.fillStyle = '#4aa8ff'; g.fill(); text(g, 'AIR TANK FILLING THE BAG…', W / 2, by - 40, { size: 40, font: 'Nunito', weight: 900, color: '#bfe0ff' });
  stamp(g, 'TOO SLOW', W / 2, H * 0.85, prog(t, sl - 0.1, sl + 0.2), -0.1, '#e8202a', 96);
} });

// s10 "And nobody can build a sensor that knows a crash from a pothole." the pothole gag
registerShot('s10', { kind: '3d',
  init(T) { const Rw = roadWorld(T, { seed: 8 }); const c = car(T, { s: 1.2, color: '#c8302a' }); c.rotation.y = Math.PI / 2; Rw.stage.add(c); const hole = new T.THREE.Mesh(new T.THREE.CircleGeometry(0.6, 20), T.mat('#1a1a1e')); hole.rotation.x = -Math.PI / 2; hole.position.set(0.9, 0.03, -6); Rw.stage.add(hole);
    const b = airbag(T); b.scale.setScalar(0.9); Rw.stage.add(b); Rw.rock.visible = false; return { stage: Rw.stage, c, b }; },
  draw(s, t, info) { const ph = atc(info, t, 'pothole', info.dur * 0.7), z = lerp(0, -9, clamp(t / info.dur)); s.c.position.set(0.9, Math.abs(Math.sin(Math.PI * clamp((t - ph + 0.3) / 0.25))) * 0.25, z); s.c.spin(-z); s.c.rotation.z = -0.08 * Math.sin(Math.PI * clamp((t - ph + 0.3) / 0.25));
    s.b.position.set(1.1, 1.2, z + 0.2); s.b.rotation.y = Math.PI / 2; s.b.inflate(prog(t, ph - 0.05, ph + 0.15));
    cam(s.stage, t, info, [5.5, 2.2, z + 5.5], [4.8, 2.0, z + 4.6], [0.9, 0.9, z - 1], [0.9, 1.1, z], 52); },
  overlay(g, t, info) { const ph = atc(info, t, 'pothole', info.dur * 0.7); text(g, '?!', W * 0.7, H * 0.25, { size: 160, font: 'Nunito', weight: 900, color: '#ffd23a', alpha: prog(t, ph + 0.15, ph + 0.35), glow: 14, glowColor: 'rgba(0,0,0,.6)' }); } });

// s11 "Then an engineer named Allen Breed drops a tiny steel ball into a tube, held back by a magnet. Hit a wall, and the ball flies forward and closes the circuit."
registerShot('s11', { kind: '3d',
  init(T) { const st = lifeStage(T, { sky: ['#0e1a26', '#1a2a3a', '#2a3a4a'], fog: [6, 30], fogColor: '#1a2a3a', key: 2.8, keyPos: [2, 5, 4], keyColor: '#fff2dc', ambient: 1.3, focus: 1.6, aperture: 0.006, maxblur: 0.01, bloom: 0.2 });
    st.add(T.box(3.2, 0.08, 1.6, T.mat('#5a4030', { roughness: 0.6 }), 0, 0.96, 0)); const b = person2(T, 'doctor', { faceStyle: 'pop', hair3: 'short', hairColor: '#2a1c16', glasses: true, prop: null }); b.position.set(-0.9, 0, -0.9); b.rotation.y = 0.4; st.add(b);
    const S = sensor(T); S.scale.setScalar(0.42); S.position.set(0.15, 1.92, 0.1); S.rotation.set(0, -0.2, 1.25); st.add(S); const lamp = new T.THREE.PointLight(new T.THREE.Color('#ffd8a0'), 6, 6, 1.5); lamp.position.set(0.4, 2.2, 0.8); st.add(lamp); return { stage: st, b, S }; },
  draw(s, t, info) { const hw = atc(info, t, 'wall', info.dur * 0.62), cl = atc(info, t, 'circuit', info.dur - 0.5);
    s.S.fire(prog(t, hw + 0.05, cl - 0.1)); perform(s.b, t, [[0, { expr: 'determined', armR: 0.8, reachR: 1.1, look: [0.6, -0.3] }], [cl, { expr: 'proud', armR: 1.6, reachR: 0.3 }]], { seed: 9 });
    const k = ease.inOut(prog(t, 0.2, hw)); s.stage.camera.fov = lerp(50, 44, k); s.stage.camera.updateProjectionMatrix(); s.stage.camera.position.set(...V3([-0.6, 1.9, 3.4], [0.25, 1.95, 2.35], k)); s.stage.camera.lookAt(...V3([-0.5, 1.4, -0.4], [0.15, 1.9, 0.1], k)); if (s.stage.focusOn) s.stage.focusOn(k < 0.5 ? s.b.userData.head : [0.15, 1.9, 0.1]); shake(s.stage, t, hw, 0.03); },
  overlay(g, t, info) { const cl = atc(info, t, 'circuit', info.dur - 0.5); chipTop(g, 'ALLEN BREED · 1968', ease.out(prog(t, 0.3, 0.7))); if (t > cl - 0.05) { glow(g, W * 0.72, H * 0.5, 260, '#ffd23a', 0.7 * clamp(1 - (t - cl) / 0.6)); tick(g, W / 2, H * 0.72, prog(t, cl, cl + 0.3)); } } });

// s12 "Swap the air for a pellet that burns into a cloud of nitrogen, and the bag fills in thirty milliseconds. Faster than you can blink."
registerShot('s12', { kind: '3d',
  init(T) { const st = lifeStage(T, { sky: ['#1a1a2a', '#2a2a40', '#3a3a52'], fog: [8, 30], fogColor: '#2a2a3a', key: 2.6, keyPos: [3, 6, 6], ambient: 1.4, dof: false, bloom: 0.15 });
    const wh = new T.THREE.Mesh(new T.THREE.TorusGeometry(0.7, 0.08, 12, 48), T.mat('#2a2a30')); st.add(wh); const hub = new T.THREE.Mesh(new T.THREE.CylinderGeometry(0.32, 0.32, 0.16, 32), T.mat('#3a3a42')); hub.rotation.x = Math.PI / 2; st.add(hub);
    const b = airbag(T); st.add(b); const flame = new T.THREE.Mesh(new T.THREE.SphereGeometry(0.2, 12, 8), new T.THREE.MeshBasicMaterial({ color: '#ffb040' })); flame.position.z = 0.1; st.add(flame); return { stage: st, b, flame }; },
  draw(s, t, info) { const ni = atc(info, t, 'nitrogen', info.dur * 0.35), fi = atc(info, t, 'fills', info.dur * 0.55); const k = prog(t, fi - 0.2, fi + 1.6);
    s.flame.visible = t > ni - 0.2 && t < fi + 0.1; s.flame.scale.setScalar(1 + 0.3 * Math.sin(t * 40)); s.b.inflate(k * 1.05);
    cam(s.stage, t, info, [1.6, 0.7, 4.4], [0.9, 0.4, 3.9], [0, 0, 0], [0, 0, 0.6], 50); },
  overlay(g, t, info) { const fi = atc(info, t, 'fills', info.dur * 0.55), bl = atc(info, t, 'blink', info.dur - 0.4); const k = clamp(prog(t, fi - 0.2, fi + 1.6) * 1.05);
    text(g, `0.${String(Math.round(30 * k)).padStart(3, '0')} s`, W / 2, H * 0.2, { size: 130, font: 'Nunito', weight: 900, color: '#ffd23a', glow: 14, glowColor: 'rgba(0,0,0,.6)' }); chipTop(g, 'SLOW MOTION ×1000', ease.out(prog(t, 0.1, 0.4)), '#bfe0ff');
    if (t > bl - 0.4) { const a = ease.out(prog(t, bl - 0.4, bl)); const lid = clamp((t - bl) / 0.6); g.save(); g.globalAlpha = a; g.translate(W / 2, H * 0.8); g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(0, 0, 150, 80 * (1 - lid * 0.9), 0, 0, 7); g.fill(); circle(g, 0, 0, 55 * (1 - lid * 0.9), '#3a6aa8'); circle(g, 0, 0, 25 * (1 - lid * 0.9), '#0a0a12'); g.restore(); text(g, 'BLINK = 0.300 s', W / 2, H * 0.89, { size: 46, font: 'Nunito', weight: 900, color: '#ffffff', alpha: a }); } } });

// s13 "But by the time cars finally got them, his patent had expired, and he never made a cent." old man by the window
registerShot('s13', { kind: '3d',
  init(T) { const Wd = world(T, 'bedroom', { mood: 'golden', seed: 5 }); const d = person2(T, { ...DAD, hair3: 'bald', hairColor: '#e8e8ea', outfit: 'cardigan', top: '#8a6a4a', glasses: true, face: { mustache: true, stubble: true } }); d.position.set(0.2, 0.45, 0.5); d.set({ sit: true }); Wd.stage.add(d);
    const np = T.canvasTex(256, 320, (g, w, h) => { g.fillStyle = '#f2ead6'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1612'; g.font = '900 30px Georgia'; g.textAlign = 'center'; g.fillText('AIRBAGS', w / 2, 60); g.fillText('IN NEW CARS', w / 2, 96); g.fillStyle = '#8a8478'; for (let i = 0; i < 8; i++) g.fillRect(24, 130 + i * 22, 208, 8); });
    const p = new T.THREE.Mesh(new T.THREE.PlaneGeometry(0.45, 0.56), new T.THREE.MeshStandardMaterial({ map: np, side: T.THREE.DoubleSide })); p.position.set(0.32, 1.05, 0.85); p.rotation.set(-0.3, 0.1, 0); Wd.stage.add(p); return { stage: Wd.stage, Wd, d }; },
  draw(s, t, info) { s.Wd.tick(t); const ce = atc(info, t, 'cent', info.dur - 0.6); perform(s.d, t, [[0, { expr: 'neutral', armL: 0.7, reachL: 1.0, armR: 0.7, reachR: 1.0, look: [0.1, -0.5] }], [ce - 0.4, { expr: 'sad', armL: 0.7, reachL: 1.0, armR: 0.7, reachR: 1.0, nod: 0.1 }]], { seed: 2 });
    cam(s.stage, t, info, [2.2, 1.7, 4.2], [1.5, 1.5, 3.4], [0.2, 1.0, 0.5], null, 52); if (s.stage.focusOn) s.stage.focusOn([0.2, 1.1, 0.5]); },
  overlay(g, t, info) { const ex = atc(info, t, 'expired', info.dur * 0.6); stamp(g, 'PATENT EXPIRED', W / 2, H * 0.2, prog(t, ex - 0.05, ex + 0.25), -0.12, '#e8202a', 84); text(g, '$0', W / 2, H * 0.3, { size: 110, font: 'Nunito', weight: 900, color: '#ffd23a', alpha: prog(t, ex + 0.8, ex + 1.1), glow: 12, glowColor: 'rgba(0,0,0,.7)' }); } });

// s14 "And that's how the airbag was invented." crash test: barrier, bag fills, title
registerShot('s14', { kind: '3d',
  init(T) { const st = lifeStage(T, { sky: ['#e8e8ec', '#f4f4f6', '#ffffff'], fog: [20, 80], fogColor: '#f0f0f2', key: 2.6, keyPos: [4, 10, 6], ambient: 1.8, dof: false, bloom: 0.12 });
    const fl = new T.THREE.Mesh(new T.THREE.PlaneGeometry(80, 80), new T.THREE.MeshStandardMaterial({ map: T.tiles('#f4f4f4', 12, [8, 8]) })); fl.rotation.x = -Math.PI / 2; st.add(fl);
    const bar = T.box(0.6, 1.6, 4, T.mat('#ffd23a'), 3.2, 0.8, 0); st.add(bar); for (let i = 0; i < 4; i++) st.add(T.box(0.62, 0.3, 4.02, T.mat('#1a1a1e'), 3.2, 0.3 + i * 0.4, 0));
    const c = car(T, { s: 1.2, color: '#e8e8ec' }); st.add(c); const b = airbag(T); b.scale.setScalar(0.45); st.add(b); return { stage: st, c, b }; },
  draw(s, t, info) { const hit = 0.9, x = t < hit ? lerp(-6, 0.9, t / hit) : 0.9 + 0.15 * ease.out(clamp((t - hit) / 0.3)); s.c.position.set(x, 0, 0); s.c.spin(x); s.c.rotation.z = t > hit ? -0.03 * Math.sin(Math.PI * clamp((t - hit) / 0.4)) : 0;
    s.b.position.set(x + 0.2, 1.0, 0); s.b.rotation.y = Math.PI / 2; s.b.inflate(prog(t, hit, hit + 0.25));
    cam(s.stage, t, info, [-1.5, 1.4, 5.5], [-0.6, 1.6, 6.5], [0.5, 0.9, 0], null, 50); shake(s.stage, t, hit, 0.12); },
  overlay(g, t, info) { const ai = atc(info, t, 'airbag', info.dur * 0.5); const a = ease.outBack(prog(t, ai - 0.1, ai + 0.3)); g.save(); g.translate(W / 2, H * 0.22); g.scale(a, a); text(g, 'AIRBAG', 0, 0, { size: 190, font: 'Nunito', weight: 900, color: '#e8202a', glow: 16, glowColor: 'rgba(255,255,255,.9)', spacing: 10 }); g.restore();
    text(g, '1952 → today', W / 2, H * 0.31, { size: 50, font: 'Nunito', weight: 900, color: '#2a2a3a', alpha: prog(t, ai + 0.4, ai + 0.8) }); veil(g, '#000', ease.in(prog(t, info.dur - 0.5, info.dur)) * 0.5); } });
