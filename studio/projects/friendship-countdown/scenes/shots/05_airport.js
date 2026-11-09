// shots/05_airport.js: three days (rain cricket, memories in the bag, the airport), 0 -> infinity (f45–f56).
import { E, V, registerShot, ease, prog, clamp, lerp, rng, alpha, text, glow, circle, rr, seg } from '/engine/core.js';
import { LOOK, faceTo, person, local, blinkAt, cam, proj, tag, roll, hud, tone, vignette, topBand, serif, bigText, lemniscate, stageFor, gully, deskRoom, airport, wickets, giveBat, ball, deliveryPos, batSwing, phone3D, momCall, sprite, dust, lamp, plane3D } from '../sets/fc.js';

const life = (p, t, seed, o = {}) => p.set({ breathe: t + seed, expr: o.expr ?? (blinkAt(t, seed) ? 'blink' : 'neutral'), ...o });
const dayLabel = (g, str, t, a = 1) => { const k = ease.outBack(prog(t, 0.05, 0.4)); if (k <= 0) return; g.save(); g.translate(E.W / 2, E.H * 0.12); g.scale(k, k); bigText(g, str, 0, 0, { size: 76, a: a * clamp(k), color: '#fff4e4', spacing: 8 }); g.restore(); };
export function backpack(T, p, col = '#2a6a3a') { const b = T.box(0.36, 0.42, 0.2, T.mat(col, { roughness: 0.8 }), 0, 0.95, -0.27); p.userData.body.add(b); return b; }

// rain gully at night
function rainGully(T, o = {}) { const st = stageFor(T, 'rain', { focus: o.focus ?? 3, aperture: o.aperture ?? 0.004 }); const set = gully(T, st, { night: true, lampsAt: [[-2.3, -1], [2.3, -9], [-2.3, -19]] });
  const fl = new T.THREE.DirectionalLight(new T.THREE.Color('#cfe0ff'), 0); fl.position.set(-3, 10, 2); st.add(fl); const fr = new T.THREE.PointLight(new T.THREE.Color('#ffc890'), 5, 8, 2); fr.position.set(1.2, 2.6, 1.8); st.add(fr); const fr2 = new T.THREE.PointLight(new T.THREE.Color('#9fc8ff'), 3, 8, 2); fr2.position.set(-1.5, 2.2, 1.0); st.add(fr2); return { st, set, fl }; }
const flash = (t, t0) => (t > t0 && t < t0 + 0.35 ? (Math.sin((t - t0) * 60) > 0 ? 1 : 0.4) * (1 - (t - t0) / 0.35) : 0);
registerShot('f45', { kind: '3d',
  init(T) { const r = rainGully(T, { focus: 4.5, aperture: 0.003 }); wickets(T, r.st, 0, -1.0); const k = person(T, r.st, 'kabir', [0.25, -0.6], -0.3); const b = giveBat(T, k); const y = person(T, r.st, 'you', [0.0, -8.0], 0.0); const bl = ball(T, r.st); return { stage: r.st, ...r, k, y, bl, b }; },
  draw(s, t, info, T) { s.set.tick(t); const f = flash(t, 0.3); s.fl.intensity = 3 * f; const hit = 2.35, W = batSwing(t, hit);
    s.b.rotation.x = W.rx; s.b.rotation.z = W.rz;
    life(s.k, t, 1, { expr: t > hit ? 'happy' : 'determined', armR: W.arm, reachR: 1.0 - 0.4 * clamp(W.arm - 0.3), armL: W.arm * 0.85, reachL: 0.9 - 0.3 * clamp(W.arm - 0.3), look: [0, 0] });
    const ru = prog(t, 0.7, 1.55), bowlArm = t < 1.15 ? 0.4 : t < 1.6 ? 0.4 + 5.6 * ease.inOut(prog(t, 1.15, 1.6)) : 0.4 + 0.3 * Math.max(0, 1 - (t - 1.6) * 3);
    life(s.y, t, 2, { expr: t > hit + 0.2 ? 'happy' : 'determined', armR: bowlArm % 6.283, armL: t > 1.2 && t < 1.6 ? 1.6 : 0.3, walk: t > 0.7 && t < 1.55 ? t * 12 : 0, stride: 0.7 });
    s.y.position.z = -8.6 + 1.0 * ease.out(ru);
    const D = { rel: 1.6, hitT: hit, from: [0.15, 1.9, -7.5], pitch: [0.1, 0.04, -2.6], bat: [0.12, 0.6, -0.65], loft: [1.8, 6.0, -7.5] };
    const P = deliveryPos(t, D); s.bl.position.set(...P); s.bl.visible = t > 1.55; s.bl.rotation.x = t * 40; s.bl.rotation.z = t * 7;
    s.bl.trail([1, 2, 3, 4, 5, 6, 7].map((k) => deliveryPos(t - k * 0.018, D)), t > 1.6 ? (t > hit ? 1.4 : 0.8) : 0); s.bl.burst(D.bat, prog(t, hit, hit + 0.3));
    cam(T, s.stage, t, info.dur, { pos: [2.7, 1.25, 2.1], look: [-0.4, 1.2, -3.6] }, { pos: [2.3, 1.25, 1.7], look: [-0.4, 1.22, -3.6] }); s.stage.focusOn(s.k.userData.head); s.P = proj(T, s.stage, s.k, 0.66); s.f = f; },
  overlay(g, t, info, s) { if (s.f > 0) { g.save(); g.globalAlpha = 0.35 * s.f; g.fillStyle = '#dfe8ff'; g.fillRect(0, 0, E.W, E.H); g.restore(); } dayLabel(g, 'DAY 3', t); tag(g, s.P, 3, { t, s: 0.9 }); hud(g, t, { color: '#7fe8d8' }); vignette(g, 0.6); },
});
registerShot('f46', { kind: '3d',
  init(T) { const r = rainGully(T, { focus: 2.6, aperture: 0.005 }); const k = person(T, r.st, 'kabir', [0.45, -0.8], -0.35), y = person(T, r.st, 'you', [-0.45, -0.8], 0.35); return { stage: r.st, ...r, k, y }; },
  draw(s, t, info, T) { s.set.tick(t + 4); const f = flash(t, 2.2); s.fl.intensity = 2.5 * f; s.f = f; const la = Math.sin(t * 11) > 0;
    life(s.k, t, 1, { expr: la ? 'happy' : 'talk', nod: -0.25 + 0.08 * Math.sin(t * 11), tilt: 0.1 * Math.sin(t * 5), armL: 0.4, armR: 1.0 + 0.3 * Math.sin(t * 6) });
    life(s.y, t, 2, { expr: la ? 'talk' : 'happy', nod: -0.2 + 0.08 * Math.sin(t * 11 + 1), tilt: -0.1 * Math.sin(t * 5), armL: 0.9 + 0.3 * Math.sin(t * 7), armR: 0.4 });
    s.k.userData.body.rotation.z = 0.05 * Math.sin(t * 10); s.y.userData.body.rotation.z = -0.05 * Math.sin(t * 10 + 1);
    cam(T, s.stage, t, info.dur, { pos: [0.3, 1.5, 2.4], look: [0, 1.6, -0.8] }, { pos: [0.2, 1.45, 1.8], look: [0, 1.65, -0.8] }, ease.linear); s.stage.focusOn([0, 1.6, -0.8]); s.P = proj(T, s.stage, s.k, 0.66); },
  overlay(g, t, info, s) { if (s.f > 0) { g.save(); g.globalAlpha = 0.3 * s.f; g.fillStyle = '#dfe8ff'; g.fillRect(0, 0, E.W, E.H); g.restore(); } tag(g, s.P, 3, { t, s: 0.9 }); hud(g, t); vignette(g, 0.6); },
});
// paper slips with memories
const MEM = ['cricket, 2009', 'the haircut (it was NOT fine)', 'maggi at 3 a.m. before exams', 'you never let me sit alone', 'Sunday chai, forever', 'call me. every week.'];
function slips(T, st) { return MEM.map((m, i) => { const tex = T.canvasTex(320, 140, (g, W, H) => { g.fillStyle = ['#fff4d8', '#ffe8e0', '#e8f4ff'][i % 3]; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(120,160,220,.4)'; g.lineWidth = 2; for (let y = 34; y < H; y += 30) { g.beginPath(); g.moveTo(10, y); g.lineTo(W - 10, y); g.stroke(); } g.fillStyle = '#2a2a48'; g.font = '800 26px Nunito'; g.textAlign = 'center'; g.fillText(m, W / 2, 78); });
  const p = new T.THREE.Mesh(new T.THREE.PlaneGeometry(0.32, 0.14), new T.THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: T.THREE.DoubleSide })); p.castShadow = true; st.add(p); return p; }); }
registerShot('f47', { kind: '3d',
  init(T) { const st = stageFor(T, 'room', { focus: 0.9, aperture: 0.01 }); const set = deskRoom(T, st); const sl = slips(T, st); const y = person(T, st, 'you', [-0.1, -1.0], Math.PI, { y: 0.32, set: { sit: true } });
    const pen = T.cyl(0.008, 0.008, 0.16, T.mat('#2a4ad8'), 0, -0.48, 0.05); pen.rotation.x = 1.2; y.userData.arms[0].add(pen); return { stage: st, set, sl, y }; },
  draw(s, t, info, T) { s.set.tick(t); s.set.lamp.intensity = 1.6; s.sl.forEach((p, i) => { const k = ease.out(prog(t, i * 0.35, i * 0.35 + 0.3)); p.position.set(-0.45 + (i % 3) * 0.36, 0.815 + i * 0.002, -1.6 - Math.floor(i / 3) * 0.2); p.rotation.set(-Math.PI / 2, 0, (i - 2.5) * 0.08); p.scale.setScalar(Math.max(0.001, k)); });
    life(s.y, t, 1, { expr: 'happy', nod: 0.4, reachL: 1.2 + 0.08 * Math.sin(t * 14), armL: 0.2 + 0.05 * Math.sin(t * 9), reachR: 1.0 });
    cam(T, s.stage, t, info.dur, { pos: [0.95, 1.7, -0.7], look: [-0.15, 0.85, -1.7] }, { pos: [0.8, 1.6, -0.85], look: [-0.15, 0.85, -1.7] }); s.stage.focusOn([-0.1, 0.82, -1.65]); },
  overlay(g, t, info, s) { tone(g, 'warm', 0.35); dayLabel(g, 'DAY 2', t); hud(g, t); vignette(g, 0.6); },
});
registerShot('f48', { kind: '3d',
  init(T) { const st = stageFor(T, 'room', { focus: 1.1, aperture: 0.01 }); deskRoom(T, st); const sl = slips(T, st); const { THREE } = T;
    const bag = new THREE.Group(); bag.add(T.box(0.5, 0.55, 0.28, T.mat('#2a6a3a', { roughness: 0.8 }), 0, 0.28, 0)); bag.add(T.box(0.4, 0.2, 0.05, T.mat('#235a34'), 0, 0.2, 0.16)); const flap = T.box(0.5, 0.04, 0.3, T.mat('#2a6a3a'), 0, 0.57, -0.15); flap.rotation.x = -1.2; bag.add(flap);
    bag.add(T.box(0.42, 0.02, 0.2, T.mat('#0a120c'), 0, 0.555, 0)); bag.position.set(0.3, 0.0, -0.6); st.add(bag); const L = new THREE.PointLight(new THREE.Color('#ffd0a0'), 3, 4, 2); L.position.set(0.9, 1.4, 0.2); st.add(L); return { stage: st, sl, bag }; },
  draw(s, t, info, T) { s.sl.forEach((p, i) => { const t0 = 0.15 + i * 0.3, k = ease.inOut(prog(t, t0, t0 + 0.6)); p.position.set(lerp(-0.4 + i * 0.1, 0.3, k), lerp(0.9, 0.55, k) + Math.sin(k * Math.PI) * 0.35, lerp(-1.5, -0.6, k)); p.rotation.set(-Math.PI / 2 + k * 1.4, i, 0); p.visible = k < 0.98; });
    cam(T, s.stage, t, info.dur, { pos: [1.3, 1.3, 0.4], look: [0.1, 0.6, -0.9] }, { pos: [1.1, 1.2, 0.2], look: [0.2, 0.55, -0.8] }); s.stage.focusOn([0.3, 0.55, -0.6]); },
  overlay(g, t, info, s) { tone(g, 'warm', 0.35); hud(g, t); vignette(g, 0.6); },
});
// airport
const KAP = [1.1, -2.2], YAP = [0.2, -1.4];
function gate(T, o = {}) { const st = stageFor(T, 'airport', { focus: o.focus ?? 3, aperture: o.aperture ?? 0.004, maxblur: o.maxblur ?? 0.012 }); const set = airport(T, st, o.set || {});
  const k = person(T, st, 'kabir', o.kpos || KAP, o.krot ?? -2.3); backpack(T, k); const y = o.noYou ? null : person(T, st, 'you', o.ypos || YAP, o.yrot ?? 0.9); const fr = new T.THREE.PointLight(new T.THREE.Color('#ffd8c0'), 4, 9, 2); fr.position.set(-0.5, 2.6, 1.5); st.add(fr); return { stage: st, set, k, y }; }
registerShot('f49', { kind: '3d',
  init(T) { const r = gate(T, { focus: 7, aperture: 0.002 }); r.case = T.box(0.42, 0.65, 0.26, T.mat('#c84a3a', { roughness: 0.4 }), 1.6, 0.34, -2.0); r.stage.add(r.case); return r; },
  draw(s, t, info, T) { s.set.tick(t); life(s.k, t, 1, { look: [0.3, 0.2] }); life(s.y, t, 2, { look: [-0.3, 0.2] });
    cam(T, s.stage, t, info.dur, { pos: [-4.5, 2.6, 7.5], look: [0.8, 2.2, -6] }, { pos: [-3.6, 2.3, 6.4], look: [0.8, 2.0, -6] }); s.stage.focusOn(s.k.userData.head); s.P = proj(T, s.stage, s.k, 0.66); },
  overlay(g, t, info, s) { dayLabel(g, 'DAY 1', t); tag(g, s.P, 1, { t, s: 1.4 }); hud(g, t); vignette(g, 0.55); },
});
let _crack = null;
registerShot('f50', { kind: '3d',
  init(T) { const r = gate(T, { focus: 2.4, aperture: 0.005, kpos: [0.42, -1.8], krot: -Math.PI / 2, ypos: [-0.12, -1.8], yrot: Math.PI / 2 });
    _crack ||= T.canvasTex(128, 128, (g) => { g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 3; const R = rng(7); for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(70, 56); let x = 70, y = 56; const a = i * 0.7 + R(); for (let k = 0; k < 4; k++) { x += Math.cos(a + (R() - 0.5)) * 18; y += Math.sin(a + (R() - 0.5)) * 18; g.lineTo(x, y); } g.stroke(); } }); return r; },
  draw(s, t, info, T) { s.set.tick(t + 2); const br = local(info, t, 'break') ?? 1.98, gl = local(info, t, 'glasses') ?? 1.58, hk = ease.out(prog(t, 0.2, 0.8)), sq = t > 0.9 ? 1 + 0.03 * Math.sin(t * 9) : 1;
    s.k.position.x = lerp(0.75, 0.42, hk); s.y.position.x = lerp(-0.45, -0.12, hk);
    life(s.k, t, 1, { expr: t > 0.8 ? 'happy' : 'sad', armL: 0.35, armR: 0.35, reachL: 1.5 * hk, reachR: 1.5 * hk, tilt: 0.15 * hk });
    life(s.y, t, 2, { expr: t > gl ? (t > br + 0.3 ? 'happy' : 'surprised') : 'blink', armL: 0.35, armR: 0.35, reachL: 1.5 * hk, reachR: 1.5 * hk, tilt: -0.15 * hk }); s.k.userData.body.scale.set(1 / sq, sq, 1 / sq);
    const G = s.y.userData.glasses; if (G && t > gl) { G.rotation.z = 0.28 * ease.outBack(prog(t, gl, gl + 0.25)); G.position.y = -0.04 * ease.out(prog(t, gl, gl + 0.25)); G.userData.lenses.forEach((l, i) => { if (!l.userData.c && (i === 0 || t > br)) { l.material.map = _crack; l.material.opacity = 0.75; l.material.color.set('#ffffff'); l.material.needsUpdate = true; l.userData.c = 1; } }); }
    cam(T, s.stage, t, info.dur, { pos: [0.15, 1.75, 1.2], look: [0.15, 1.6, -1.8] }, { pos: [-0.3, 1.7, 0.85], look: [0.0, 1.62, -1.8] }); s.stage.focusOn([0, 1.6, -1.8]); if (t > gl && t < gl + 0.3) { s.stage.camera.position.x += Math.sin(t * 80) * 0.02; } s.Py = proj(T, s.stage, s.y, 0.02); s.P = proj(T, s.stage, s.k, 0.66); },
  overlay(g, t, info, s) { const gl = local(info, t, 'glasses') ?? 1.58; if (t > gl && t < gl + 0.25) { g.save(); g.globalAlpha = 0.25 * (1 - prog(t, gl, gl + 0.25)); g.fillStyle = '#fff'; g.fillRect(0, 0, E.W, E.H); g.restore(); }
    tag(g, s.P, 1, { t, s: 0.9 }); hud(g, t); vignette(g, 0.55); },
});
// f51: OTS: his number flickers 1 ... 0
registerShot('f51', { kind: '3d',
  init(T) { return gate(T, { focus: 3.0, aperture: 0.006, kpos: [0.9, -3.4], krot: 0.2, ypos: [-0.3, -0.8], yrot: Math.PI - 0.4 }); },
  draw(s, t, info, T) { s.set.tick(t + 5); life(s.k, t, 1, { expr: 'sad', look: [0, 0.1], armR: 0.3 }); life(s.y, t, 2, { expr: 'sad' });
    cam(T, s.stage, t, info.dur, { pos: [0.5, 1.85, 0.4], look: [0.9, 2.0, -3.4] }, { pos: [0.45, 1.85, 0.1], look: [0.9, 2.05, -3.4] }); s.stage.focusOn(s.k.userData.head); s.P = proj(T, s.stage, s.k, 0.66); },
  overlay(g, t, info, s) { const fl = local(info, t, 'flickers') ?? 1.49, z = local(info, t, '0') ?? 2.13; const on = t < fl ? 1 : t < z ? (Math.sin(t * 47) * Math.sin(t * 13) > -0.2 ? 1 : 0.15) : 1;
    tag(g, s.P, t < z ? 1 : 0, { t, a: on, s: 1.3, glitch: t > fl && t < z ? 0.6 : 0, pop: t - z, kind: 'red' }); if (t > z) { g.save(); g.globalAlpha = 0.25 * Math.max(0, 1 - (t - z) / 0.5); g.fillStyle = '#fff'; g.fillRect(0, 0, E.W, E.H); g.restore(); } hud(g, t, { color: '#ff7a7a' }); vignette(g, 0.6); },
});
// f52: the 0 shatters into gold sparks that swirl into a new shape
registerShot('f52', { kind: '3d',
  init(T) { return gate(T, { focus: 2.6, aperture: 0.006, kpos: [0.6, -2.6], krot: 0.1, noYou: true }); },
  draw(s, t, info, T) { s.set.tick(t + 8); life(s.k, t, 1, { expr: t > 2.0 ? 'awe' : 'surprised', look: [0, 0.8], nod: -0.2 });
    cam(T, s.stage, t, info.dur, { pos: [0.3, 1.65, 0.4], look: [0.6, 2.1, -2.6] }, { pos: [0.4, 1.6, 0.0], look: [0.6, 2.25, -2.6] }, ease.linear); s.stage.focusOn(s.k.userData.head); s.P = proj(T, s.stage, s.k, 0.75); },
  overlay(g, t, info, s) { const ch = local(info, t, 'changes') ?? 0.4, sy = local(info, t, 'symbol') ?? 2.37; const R = rng(5);
    if (t < ch + 0.15) tag(g, s.P, 0, { t, kind: 'red', s: 1.2, glitch: 0.4 });
    const k = ease.inOut(prog(t, ch, sy + 1.2)), S = 1.1 * clamp(s.P.scale, 0.3, 1.6);
    for (let i = 0; i < 90; i++) { const a0 = R() * 7, r0 = 20 + R() * 260, an = (i / 90) * Math.PI * 2, d = 1 + Math.sin(an) ** 2; const tx = s.P.x + (56 * S * Math.cos(an)) / d, ty = s.P.y + (56 * S * Math.sin(an) * Math.cos(an)) / d;
      const sx = s.P.x + Math.cos(a0 + t * 2) * r0 * (1 - k * 0.2), sy2 = s.P.y + Math.sin(a0 + t * 2) * r0 * 0.6; const x = lerp(sx, tx, k), y = lerp(sy2, ty, k); if (t > ch) circle(g, x, y, 3 + 2 * (1 - k), alpha(i % 3 ? '#ffcf5a' : '#fff4c0', 0.9)); }
    glow(g, s.P.x, s.P.y, 220 * k, '#ffcf5a', 0.35 * k); if (k > 0.6) lemniscate(g, s.P.x, s.P.y, 56 * S, 6 * S, alpha('#fff4c0', (k - 0.6) * 2), 1);
    tone(g, 'gold', 0.4 * k); hud(g, t); vignette(g, 0.55); },
});
// f53: gold infinity above Kabir; warm light floods the gate
registerShot('f53', { kind: '3d',
  init(T) { const r = gate(T, { focus: 2.8, aperture: 0.005, kpos: [0.6, -2.6], krot: 0.25, ypos: [-0.5, -1.3], yrot: 2.6 }); r.gl = lamp(T, r.stage, [0.6, 2.6, -2.4], '#ffcf5a', 0, 6, { bulb: false }); return r; },
  draw(s, t, info, T) { s.set.tick(t + 12); s.gl.intensity = 6 * ease.out(prog(t, 0, 1.5)); life(s.k, t, 1, { expr: 'happy', look: [-0.4, 0.2] }); life(s.y, t, 2, { expr: 'awe', look: [0.3, 0.6] });
    cam(T, s.stage, t, info.dur, { pos: [-1.4, 1.5, 1.5], look: [0.4, 2.1, -2.6] }, { pos: [-1.1, 1.45, 1.0], look: [0.45, 2.2, -2.6] }); s.stage.focusOn(s.k.userData.head); s.P = proj(T, s.stage, s.k, 0.72); },
  overlay(g, t, info, s) { const go = local(info, t, 'gold') ?? 1.95; tag(g, s.P, 'inf', { t, s: 1.3 + 0.15 * ease.out(prog(t, go - 0.2, go + 0.3)), pop: t - go }); tone(g, 'gold', 0.6); hud(g, t, { color: '#ffcf5a' }); vignette(g, 0.5); },
});
// f54: the same light as your mom's
registerShot('f54', { kind: '3d',
  init(T) { const st = stageFor(T, 'airport', { focus: 0.8, aperture: 0.012, maxblur: 0.016 }); const set = airport(T, st); const ph = phone3D(T, momCall); ph.scale.setScalar(0.6); ph.position.set(0, 1.4, 0.0); ph.rotation.set(-0.1, 0.1, 0); st.add(ph);
    const halo = sprite(T, st, [0, 1.62, -0.02], 0.45, '#ffcf5a', 0.4); return { stage: st, set, ph, halo }; },
  draw(s, t, info, T) { s.set.tick(t + 15); s.ph.rotation.z = 0.03 * Math.sin(t); cam(T, s.stage, t, info.dur, { pos: [0.15, 1.5, 0.95], look: [0, 1.42, 0] }, { pos: [0.1, 1.47, 0.78], look: [0, 1.44, 0] }); s.stage.focusOn(s.ph); s.P = proj(T, s.stage, [0, 1.56, 0.0]); },
  overlay(g, t, info, s) { tag(g, s.P, 'gold', { t, s: 1.3 }); tone(g, 'gold', 0.5); hud(g, t, { color: '#ffcf5a' }); vignette(g, 0.55); },
});
// f55: Kabir walks to the gate and turns back to wave
registerShot('f55', { kind: '3d',
  init(T) { return gate(T, { focus: 4, aperture: 0.004, kpos: [1.6, -4], krot: Math.PI, ypos: [-1.7, 0.5], yrot: Math.PI - 0.6 }); },
  draw(s, t, info, T) { s.set.tick(t + 17); const w = prog(t, 0, 1.0); s.k.position.z = -4 - w * 1.2; const turn = ease.inOut(prog(t, 1.0, 1.4)); s.k.rotation.y = lerp(Math.PI, 0.2, turn);
    life(s.k, t, 1, { expr: turn > 0.5 ? 'happy' : 'neutral', walk: t < 1.0 ? t * 7 : 0, armR: turn > 0.5 ? 2.6 + 0.25 * Math.sin(t * 12) : 0.2 }); life(s.y, t, 2, { expr: 'happy', armL: 2.2 + 0.2 * Math.sin(t * 10) });
    cam(T, s.stage, t, info.dur, { pos: [-1.2, 1.9, 1.6], look: [1.4, 1.9, -5] }, { pos: [-1.0, 1.9, 1.2], look: [1.5, 2.0, -5.2] }); s.stage.focusOn(s.k.userData.head); s.P = proj(T, s.stage, s.k, 0.72); },
  overlay(g, t, info, s) { tag(g, s.P, 'inf', { t, s: 1.1 }); tone(g, 'gold', 0.35); hud(g, t, { color: '#ffcf5a' }); vignette(g, 0.5); },
});
// f56: plane takes off past the glass wall; two clocks
registerShot('f56', { kind: '3d',
  init(T) { const r = gate(T, { focus: 6, aperture: 0.002, noYou: true, kpos: [40, 40] }); r.y = person(T, r.stage, 'you', [-0.8, -9.5], Math.PI); const p = plane3D(T, { color: '#1a1830', lights: true }); p.scale.setScalar(1.8); r.stage.add(p); r.p = p; r.set.plane.visible = false; return r; },
  draw(s, t, info, T) { s.set.tick(t + 20); const k = t / info.dur; s.p.position.set(lerp(-26, 20, k), 1.2 + Math.max(0, k - 0.25) * 18, -26); s.p.rotation.set(0, 0, Math.min(0.25, Math.max(0, k - 0.2) * 0.6)); life(s.y, t, 1, { armR: 2.2 + 0.2 * Math.sin(t * 8) });
    cam(T, s.stage, t, info.dur, { pos: [-2.6, 1.4, -4.0], look: [0, 3, -20] }, { pos: [-2.2, 1.3, -4.6], look: [4, 4.5, -20] }); s.stage.focusOn([0, 3, -20]); s.P = proj(T, s.stage, s.p.position, 0); },
  overlay(g, t, info, s) { const tz = local(info, t, 'time') ?? 1.37, a = ease.out(prog(t, tz - 0.5, tz)); tag(g, { ...s.P, y: s.P.y - 70, scale: 0.8 }, 'inf', { t, s: 0.7 });
    const clock = (x, city, time) => { g.save(); g.globalAlpha = a; rr(g, x - 170, E.H * 0.07, 340, 110, 24); g.fillStyle = 'rgba(8,10,28,.6)'; g.fill(); g.strokeStyle = alpha('#ffcf5a', 0.6); g.lineWidth = 2; g.stroke(); g.restore();
      text(g, city, x, E.H * 0.07 + 32, { size: 24, font: 'Nunito', weight: 900, color: '#ffe8b0', alpha: a, spacing: 4 }); text(g, time, x, E.H * 0.07 + 76, { size: 46, font: 'Nunito', weight: 900, color: '#ffffff', alpha: a }); };
    clock(E.W * 0.34, 'MUMBAI', '9:40 PM'); clock(E.W * 0.66, 'TORONTO', '12:10 PM'); tone(g, 'gold', 0.25); hud(g, t, { color: '#ffcf5a' }); vignette(g, 0.5); },
});
