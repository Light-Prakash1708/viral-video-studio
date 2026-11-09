// shots/01_open.js: cold open, title, the automated world, Platform 4 and the stall (s01-s18).
import { E, V, registerShot, text, alpha, rr } from '/engine/core.js';
import { stationStage, P, place, hari, m7, queue, C, move, talk, ease, clamp, lerp, prog, local, person2, robot, life, blinkFace, hold, CUSTOMERS } from '../sets/kit.js';
import { world } from '../sets/worlds.js';
import { bulletTrain, jobsHud, grade, dayCard, CY, pourRig } from '../sets/film.js';
import { giveProp } from '../sets/cast.js';
import { vignette } from '../sets/fc.js';

const hud = (g, t, o = {}) => jobsHud(g, t, o);
// s01: dawn, an empty platform; push toward the one lit stall far away. HUD appears on "one".
registerShot('s01', { kind: '3d',
  init(T) { const b = stationStage(T, 'dawn', { focus: 9, aperture: 0.0012 }); b.h = hari(T, b.stage); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); life(s.h, t, 0, { look: [0, 0] }); move(T, s, t, info, C([-11, 1.5, 1.8], [0, 1.4, -1.6]), C([-6.5, 1.45, 1.4], [0, 1.4, -1.6]), ease.linear); },
  overlay(g, t, info, s) { const k = local(info, t, 'one') ?? 3; hud(g, t, { a: ease.out(prog(t, k, k + 0.6)), pulse: t - k - 0.3 }); grade(g, { v: 0.45, warm: 0.12 }); },
});
// s02: TITLE over the slow wide
registerShot('s02', { kind: '3d',
  init(T) { const b = stationStage(T, 'dawn', { focus: 9, aperture: 0.0015 }); b.h = hari(T, b.stage); return b; },
  draw(s, t, info, T) { s.S.tickAll(t + 5); life(s.h, t, 0); move(T, s, t, info, C([-9, 1.0, 2.6], [4, 2.2, -1.0]), C([-8.2, 1.0, 2.4], [4, 2.25, -1.0]), ease.linear); },
  overlay(g, t, info, s) { const a = ease.out(prog(t, 0.2, 1.0)) * (1 - ease.in(prog(t, info.dur - 0.6, info.dur)));
    g.save(); g.globalAlpha = a; const gr = g.createLinearGradient(0, E.H * 0.3, 0, E.H * 0.7); gr.addColorStop(0, 'rgba(6,6,16,0)'); gr.addColorStop(0.5, 'rgba(6,6,16,.72)'); gr.addColorStop(1, 'rgba(6,6,16,0)'); g.fillStyle = gr; g.fillRect(0, E.H * 0.3, E.W, E.H * 0.4);
    text(g, 'THE LAST HUMAN JOB', E.W / 2, E.H * 0.47, { size: V(92, 70), font: 'Playfair Display', weight: 900, color: '#f6ecd8', spacing: 8, glow: 16, glowColor: 'rgba(0,0,0,.7)' });
    text(g, 'ON EARTH', E.W / 2, E.H * 0.56, { size: V(40, 34), font: 'Nunito', weight: 900, color: '#ffd8a0', spacing: 18 }); g.restore(); hud(g, t); grade(g, { v: 0.45, warm: 0.12 }); },
});
// s03: CU Hari behind the counter, warm, glasses, pouring
registerShot('s03', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 2.0, aperture: 0.004 }); b.h = hari(T, b.stage); b.k = hold(T, b.h, 'kettle', 1); b.stall.kettle.visible = false; return b; },
  draw(s, t, info, T) { s.S.tickAll(t); const n = local(info, t, 'Walter') ?? 0.5; life(s.h, t, 0, { expr: t > n + 0.6 ? 'happy' : undefined, look: [0.1, -0.15], armR: 0.35, reachR: 0.9, nod: 0.12 });
    move(T, s, t, info, C([0.95, 1.55, 0.1], [0.12, 1.5, -2.05]), C([0.75, 1.55, -0.2], [0.12, 1.52, -2.05])); s.stage.focusOn(s.h.userData.head); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.1 }); },
});
// s04: insert: Walt pours: carafe tilts in, curved coffee stream, the mug fills, steam (side angle at counter height)
registerShot('s04', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 0.55, aperture: 0.01 }); b.h = hari(T, b.stage); b.stall.kettle.visible = false; b.stall.cups.forEach((c, i) => (c.visible = i > 5)); const at = b.stall.world(0.0, 1.06, 0.45); b.at = at; b.pour = pourRig(T, b.stage, at, { who: 'walt', t0: 0.15, fillTime: 1.3 }); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.pour.tick(t); life(s.h, t, 0, { look: [0.3, -0.6], nod: 0.3, expr: 'happy' }); const p = s.at; move(T, s, t, info, C([p[0] - 0.55, p[1] + 0.2, p[2] + 0.55], [p[0] + 0.05, p[1] + 0.17, p[2]]), C([p[0] - 0.48, p[1] + 0.2, p[2] + 0.48], [p[0] + 0.05, p[1] + 0.17, p[2]])); s.stage.focusOn([p[0], p[1] + 0.1, p[2]]); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.12 }); },
});
// ---- the automated world montage ----
const roboWorld = (id, wname, mood, setup, camA, camB, o = {}) => registerShot(id, { kind: '3d',
  init(T) { const W = world(T, wname, { mood, seed: o.seed || 5 }); const r = setup(T, W); return { stage: W.stage, W, ...r }; },
  draw(s, t, info, T) { s.W.tick(t); (s.bots || []).forEach((b, i) => b.set({ hover: t + i, face: blinkFace(t, b.userData.f || 'neutral', i) })); if (s.act) s.act(t); move(T, s, t, info, camA, camB); if (s.focus) s.stage.focusOn(s.focus); },
  overlay(g, t, info, s) { hud(g, t); if (o.over) o.over(g, t, info, s); grade(g, { v: 0.42, ...(o.grade || {}) }); },
});
roboWorld('s05', 'street', 'night', (T, W) => { const bots = []; for (let i = 0; i < 9; i++) { const b = robot(T, { s: 0.9 + (i % 3) * 0.05, glow: ['#7fe8ff', '#ffd27a', '#ff9ad0'][i % 3] }); b.position.set(-5 + i * 1.25, 0, -1.5 + (i % 3) * 1.3); b.rotation.y = i % 2 ? 1.57 : -1.57; W.stage.add(b); bots.push(b); }
  return { bots, act: (t) => bots.forEach((b, i) => (b.position.x = -6 + ((i * 1.25 + t * (i % 2 ? 0.9 : -0.9)) % 12 + 12) % 12)) }; }, C([-3.5, 1.7, 4.4], [1.5, 1.4, -2]), C([-2.8, 1.6, 4.0], [1.5, 1.4, -2]), { grade: { cold: 0.08 } });
// s06: robots drove the trains: a bullet train with a robot driver flashes through Platform 4
registerShot('s06', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 6, aperture: 0.0015 }); b.tr = bulletTrain(T, b.stage); b.drv = robot(T, { s: 0.55 }); b.drv.position.set(0, 0.35, 0.3); b.tr.add(b.drv); b.drv.position.set(-3.2, 0.1, 5.7); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.tr.tick(t, 0.2, 36); s.drv.set({ hover: t }); move(T, s, t, info, C([-4, 1.2, 2.4], [2, 0.4, 5.6]), C([-3.6, 1.15, 2.2], [3, 0.4, 5.6])); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.08 }); },
});
roboWorld('s07', 'classroom', 'day', (T, W) => { const b = robot(T, { s: 1 }); b.position.set(-0.6, 0, -3.9); W.stage.add(b); const kids = []; for (let i = 0; i < 6; i++) { const k = person2(T, CUSTOMERS[i], { s: 0.64 }); k.position.set(-3 + (i % 3) * 2, 0, -1.6 + Math.floor(i / 3) * 1.5); k.rotation.y = Math.PI; W.stage.add(k); k.set({ sit: false }); kids.push(k); }
  return { bots: [b], act: (t) => b.set({ armR: 1.6 + 0.3 * Math.sin(t * 2), reachR: 0.4 }), focus: b }; }, C([1.8, 1.6, 1.8], [-0.6, 1.4, -3.9]), C([1.5, 1.55, 1.3], [-0.6, 1.45, -3.9]));
roboWorld('s08', 'hospital', 'day', (T, W) => { const b = robot(T, { glow: '#9affc8' }); b.position.set(0.3, 0, -1.6); b.rotation.y = 0.3; W.stage.add(b); giveProp(T, b, 'clipboard', 0); return { bots: [b], act: (t) => b.set({ armL: 0.4, reachL: 1.1, face: 'scan' }), focus: b }; }, C([1.4, 1.6, 1.4], [0.2, 1.45, -1.6]), C([1.1, 1.58, 1.0], [0.2, 1.48, -1.6]));
roboWorld('s09', 'stage', 'night', (T, W) => { const b = robot(T, { glow: '#ff9ad0' }); b.position.set(0, 0.6, -4.6); W.stage.add(b); giveProp(T, b, 'guitar', 1); return { bots: [b], act: (t) => b.set({ armR: 0.5, reachR: 0.9 + 0.15 * Math.sin(t * 9), face: 'happy', tilt: 0.12 * Math.sin(t * 3) }), focus: b }; }, C([0, 1.9, -0.2], [0, 1.7, -4.6]), C([0.4, 1.85, -1.4], [0, 1.75, -4.6]));
roboWorld('s10', 'kitchen', 'golden', (T, W) => { const b = robot(T, { glow: '#ffd27a' }); b.position.set(0.3, 0, -2.75); b.rotation.y = 0; W.stage.add(b); giveProp(T, b, 'spatula', 1); return { bots: [b], act: (t) => b.set({ armR: 0.5, reachR: 1.1 + 0.25 * Math.sin(t * 6), face: 'neutral' }), focus: b }; }, C([1.9, 1.6, 0.6], [0.3, 1.3, -2.8]), C([1.5, 1.55, 0.2], [0.3, 1.35, -2.8]));
// s11: eight billion people, and not one of them had to work: crane up from a bored guy on his phone to a park packed with idle people
registerShot('s11', { kind: '3d',
  init(T) { const { THREE } = T; const W = world(T, 'park', { mood: 'golden', seed: 5, focus: 2.2, aperture: 0.0018 }); const st = W.stage;
    // hero foreground people: lying, sitting, scrolling
    const fg = []; const poses = [[0.0, 0.3, 'lie'], [1.1, -0.4, 'sit'], [-1.2, -0.6, 'sit'], [0.7, 1.2, 'lie'], [-0.6, 1.4, 'stand'], [2.0, 0.6, 'lie'], [-2.1, 0.5, 'sit'], [1.7, -1.6, 'stand']];
    poses.forEach(([x, z, pose], i) => { const p = person2(T, CUSTOMERS[i % CUSTOMERS.length]); p.position.set(x, pose === 'lie' ? 0.16 : 0, z); p.rotation.y = 0.6 * Math.sin(i * 2.1); if (pose === 'lie') { p.rotation.x = -1.45; p.position.z += 0.8; } st.add(p); giveProp(T, p, 'phone', 1); p.userData.pose = pose; fg.push(p); });
    // the masses: 900 instanced people, varied skin / clothes, standing, sitting or lying, each with a glowing phone
    const n = 900, R = ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);
    const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.3, 14, 10), new THREE.MeshStandardMaterial({ roughness: 0.45 }), n);
    const bodies = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.2, 0.32, 4, 8), new THREE.MeshStandardMaterial({ roughness: 0.85 }), n);
    const phones = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.09, 0.15), new THREE.MeshBasicMaterial({ color: '#9ad8ff' }), n);
    const SK = ['#f0c8a8', '#e2b896', '#c89070', '#a8704a', '#8a5a3a', '#6a4430'], CL = ['#e05a7a', '#f0a040', '#4a7fd8', '#5ab87a', '#9a6ad8', '#e8d050', '#e8e6f0', '#3a3a44', '#c0392b', '#2a8a8a'];
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), c = new THREE.Color(), v = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < n; i++) { const r = 3 + Math.sqrt(R()) * 30, a = -Math.PI * 0.95 + R() * Math.PI * 0.9 - Math.PI * 0.05, x = Math.cos(a) * r, z = Math.sin(a) * r - 1, k = R(), pose = k < 0.35 ? 'lie' : k < 0.7 ? 'sit' : 'stand';
      const ry = R() * 6.28; e.set(pose === 'lie' ? -1.45 : 0, ry, 0); q.setFromEuler(e);
      const hy = pose === 'lie' ? 0.25 : pose === 'sit' ? 1.15 : 1.62, by = pose === 'lie' ? 0.22 : pose === 'sit' ? 0.55 : 0.92;
      const off = pose === 'lie' ? new THREE.Vector3(0, 0, -1.2).applyEuler(new THREE.Euler(0, ry, 0)) : new THREE.Vector3();
      m4.compose(v.set(x + off.x, hy, z + off.z), q, one); heads.setMatrixAt(i, m4); heads.setColorAt(i, c.set(SK[Math.floor(R() * SK.length)]));
      m4.compose(v.set(x + off.x * 0.45, by, z + off.z * 0.45), q, one); bodies.setMatrixAt(i, m4); bodies.setColorAt(i, c.set(CL[Math.floor(R() * CL.length)]));
      const pf = new THREE.Vector3(0, 0, 0.32).applyEuler(new THREE.Euler(0, ry, 0)); m4.compose(v.set(x + off.x + pf.x, hy - (pose === 'lie' ? -0.3 : 0.18), z + off.z + pf.z), q, one); phones.setMatrixAt(i, m4); }
    st.add(heads, bodies, phones); return { stage: st, W, fg }; },
  draw(s, t, info, T) { s.W.tick(t); s.fg.forEach((p, i) => p.set({ expr: ((t + i) % 3.2) < 0.15 ? 'blink' : i % 3 ? 'sleepy' : 'neutral', armR: 0.35, reachR: p.userData.pose === 'stand' ? 1.2 : 1.0, nod: p.userData.pose === 'stand' ? 0.35 : 0.15, sit: p.userData.pose === 'sit', breathe: t + i }));
    const k = ease.inOut(clamp(t / info.dur)); s.stage.camera.position.set(lerp(0.6, 0, k), lerp(1.2, 9.5, k), lerp(2.6, 9.0, k)); s.stage.camera.lookAt(lerp(0.0, 0, k), lerp(0.5, 0, k), lerp(0.4, -6, k)); s.stage.focusOn(k < 0.4 ? s.fg[0].userData.head : [0, 0.5, -6]); },
  overlay(g, t, info) { hud(g, t); const k = local(info, t, 'Eight') ?? 0.2; const a = ease.out(prog(t, k, k + 0.4)); if (a > 0) { const n = Math.round(8e9 * ease.out(prog(t, k, k + 1.6)));
      g.save(); g.globalAlpha = a; const gr = g.createLinearGradient(0, 0, 0, E.H * 0.32); gr.addColorStop(0, 'rgba(6,6,16,.55)'); gr.addColorStop(1, 'rgba(6,6,16,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H * 0.32); g.restore();
      text(g, n.toLocaleString('en-US'), E.W / 2, E.H * 0.15, { size: V(88, 66), font: 'Fredoka', weight: 700, color: '#ffffff', alpha: a, glow: 16, glowColor: 'rgba(0,0,0,.6)' });
      const j = local(info, t, 'not') ?? 1.6; const b = ease.out(prog(t, j, j + 0.3)); text(g, 'PEOPLE', E.W / 2 - V(120, 100), E.H * 0.235, { size: V(30, 26), font: 'Nunito', weight: 900, color: '#ffe8c0', alpha: a, spacing: 8 }); text(g, '0 JOBS', E.W / 2 + V(120, 100), E.H * 0.235, { size: V(30, 26), font: 'Nunito', weight: 900, color: '#ff8a7a', alpha: b, spacing: 8 }); }
    grade(g, { v: 0.4, warm: 0.08 }); },
});
// s12: the government paid everyone: phone notification over a bedroom
roboWorld('s12', 'bedroom', 'dusk', (T, W) => { const p = person2(T, CUSTOMERS[3]); p.position.set(-2.4, 0.6, -2.0); p.rotation.y = 0.5; W.stage.add(p); giveProp(T, p, 'phone', 1); return { act: (t) => p.set({ sit: true, expr: 'neutral', armR: 0.4, reachR: 1.3, nod: 0.3, breathe: t }), focus: p }; }, C([0.2, 1.7, 1.2], [-2.2, 1.2, -2.2]), C([-0.2, 1.65, 0.7], [-2.2, 1.2, -2.2]),
  { over: (g, t, info) => { const a = ease.out(prog(t, 0.3, 0.8)); if (a <= 0) return; const x = E.W * 0.62, y = E.H * 0.2, w = V(560, 860), h = V(150, 160); g.save(); g.globalAlpha = a; g.translate(0, (1 - a) * -30); rr(g, x, y, w, h, 28); g.fillStyle = 'rgba(250,250,255,.94)'; g.fill();
    text(g, 'GOV · UNIVERSAL INCOME', x + 30, y + 42, { size: V(22, 22), font: 'Nunito', weight: 900, color: '#5a6a8a', align: 'left', spacing: 2 }); text(g, '$4,200 deposited', x + 30, y + 92, { size: V(40, 40), font: 'Nunito', weight: 900, color: '#1a2a3a', align: 'left' }); text(g, 'No work required. Enjoy your day.', x + 30, y + 128, { size: V(22, 22), font: 'Nunito', weight: 700, color: '#5a6a8a', align: 'left' }); g.restore(); } });
// s13: nobody was needed: one figure in the void
roboWorld('s13', 'void', 'night', (T, W) => { const p = person2(T, CUSTOMERS[7]); p.position.set(0, 0, 0); W.stage.add(p); return { act: (t) => p.set({ expr: 'sad', nod: 0.25, breathe: t * 0.6 }), focus: p }; }, C([0, 1.6, 5.5], [0, 1.0, 0]), C([0, 1.5, 4.6], [0, 1.05, 0]), { grade: { cold: 0.1 } });
// s14: "Except for one small stall": crane down the station to the stall
registerShot('s14', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 6, aperture: 0.0015 }); b.h = hari(T, b.stage); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); life(s.h, t, 1); move(T, s, t, info, C([-6, 4.2, 4.5], [0, 1.6, -1.6]), C([-3.6, 1.8, 3.4], [0, 1.4, -1.6])); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.1 }); },
});
// s15: "the trains no longer stopped at": the bullet train blasts past; Hari keeps pouring
registerShot('s15', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 3.2, aperture: 0.0025 }); b.h = hari(T, b.stage); b.tr = bulletTrain(T, b.stage); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.tr.tick(t, 0.6, 46); life(s.h, t, 2, { look: [0.6, 0], expr: t > 1.4 ? 'smirk' : undefined }); move(T, s, t, info, C([2.6, 1.3, 2.4], [0, 1.4, -1.8]), C([2.3, 1.3, 2.0], [0, 1.4, -1.8])); s.stage.focusOn(s.h.userData.head); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.1 }); },
});
// s16: the sign: tilt down from HARI CHAI to Hari
registerShot('s16', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 2.4, aperture: 0.003 }); b.h = hari(T, b.stage); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); life(s.h, t, 3, { expr: t > 1.6 ? 'happy' : undefined }); move(T, s, t, info, C([0.1, 2.6, 1.3], [0, 2.45, -0.5]), C([0.2, 1.75, 1.1], [0.1, 1.6, -2.0])); s.stage.focusOn(t < 1.2 ? [0, 2.42, -0.52] : s.h.userData.head); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.1 }); },
});
// s17: across the street, the Tea-O-Mat: perfect, 3 seconds, free
registerShot('s17', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 5, aperture: 0.002 }); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); move(T, s, t, info, C([1.5, 0.6, 4.2], [3.2, 0.6, 9.4]), C([2.2, 0.5, 6.0], [3.2, 0.5, 9.4])); s.stage.focusOn([3.2, 0.5, 9.0]); },
  overlay(g, t, info) { hud(g, t); const k = local(info, t, 'three') ?? 1; const a = ease.out(prog(t, k, k + 0.3)); if (a > 0) { text(g, '0:03', E.W * 0.78, E.H * 0.2, { size: V(64, 54), font: 'Fredoka', weight: 700, color: CY, alpha: a, glow: 14, glowColor: CY }); } grade(g, { cold: 0.06 }); },
});
// s18: and still, at six, twelve people in line for Hari
registerShot('s18', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 4.5, aperture: 0.0018 }); b.h = hari(T, b.stage); b.q = queue(T, b.stage, 12); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); life(s.h, t, 0, { expr: 'happy', armR: 0.3, reachR: 0.8 }); s.q.forEach((c, i) => life(c, t, i + 3, { look: [0, 0], expr: i % 4 === 0 ? 'happy' : undefined }));
    move(T, s, t, info, C([8.5, 1.5, 2.6], [1.5, 1.2, -0.6]), C([7.4, 1.45, 2.3], [1.0, 1.2, -0.8])); },
  overlay(g, t, info) { hud(g, t); const k = local(info, t, 'twelve') ?? 2; const a = ease.out(prog(t, k, k + 0.3)); if (a > 0) text(g, '6:00 AM  ·  12 PEOPLE', E.W / 2, E.H * 0.14, { size: V(36, 30), font: 'Nunito', weight: 900, color: '#ffe8c0', alpha: a, spacing: 5, glow: 10, glowColor: 'rgba(0,0,0,.6)' }); grade(g, { warm: 0.12 }); },
});
