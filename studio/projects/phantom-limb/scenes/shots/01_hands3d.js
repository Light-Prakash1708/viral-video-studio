// shots/01_hands3d.js: 3D hand shots.
import { E, V, registerShot, ease, prog, clamp, lerp, wordTime, glow, alpha, text, veil, rr } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { hand, forearm, darkStage, motes, bokeh } from '../sets/hand3d.js';
import { word } from '../sets/cine.js';
import { stat } from '../sets/stat.js';

const local = (info, t, w, after = 0) => { const x = wordTime(w, info.globalT - t - 0.3 + after); return x == null ? null : x - (info.globalT - t); };
// a forearm lying on the table along -x, wrist at the origin, hand on top pointing +x
function armOnTable(T, st, kind, o = {}) {
  const arm = forearm(T, { stump: kind === 'stump', sleeve: o.sleeve }); arm.rotation.z = Math.PI / 2; arm.position.set(0, 0.24, 0); st.add(arm);
  let h = null; if (kind !== 'stump') { h = hand(T, kind === 'phantom' || kind === 'stump+phantom' ? 'phantom' : kind, o); h.rotation.set(-Math.PI / 2, 0, Math.PI / 2); h.position.set(0.1, 0.24, 0); st.add(h); }
  return { arm, h };
}
const sideCam = (T, cam, t, dur, from, to) => T.dolly(cam, t, [[0, from], [dur, to]]);

// p01: "Imagine losing your hand." a real hand under a lamp dissolves into light
registerShot('p01', { kind: '3d', init: (T) => { const st = darkStage(T); const r = armOnTable(T, st, 'real'); const m = motes(T, st, 80, '#ffd8a0'); return { stage: st, ...r, m }; },
  draw(s, t, info, T) { const k = ease.in(prog(t, 0.6, info.dur)); s.h.scale.setScalar(1 - k * 0.98); s.h.position.x = 0.1 - k * 0.2; s.m.tick(t, k * 1.4, [-0.6, 0.24, 0]); sideCam(T, s.stage.camera, t, info.dur, { pos: [1.0, 2.6, 4.4], look: [-0.3, 0.25, 0] }, { pos: [0.9, 2.3, 3.7], look: [-0.35, 0.25, 0] }); },
  overlay(g, t) { word(g, 'IMAGINE LOSING YOUR HAND', E.H * V(0.16, 0.16), ease.out(prog(t, 0.05, 0.3)), { size: V(66, 74) }); },
});
// p03: "Your fingers clench. It itches. It hurts." the glowing phantom hand clenches, prickles, flares red
registerShot('p03', { kind: '3d', init: (T) => { const st = darkStage(T, { ambient: 0.9 }); const r = armOnTable(T, st, 'phantom'); r.arm.visible = true; const m = motes(T, st, 70, '#7fe8ff'); return { stage: st, ...r, m }; },
  draw(s, t, info, T) { const it = local(info, t, 'itches') ?? 1.0, hu = local(info, t, 'hurts') ?? 2.1; s.h.clench(t < it ? ease.inOut(prog(t, 0.05, 0.6)) : t < hu ? 0.35 + 0.1 * Math.sin(t * 30) : 0.9 + 0.1 * Math.sin(t * 40));
    s.h.children.forEach((c) => { if (c.material && c.material.color && c.material.blending) c.material.color.set(t > hu ? '#ff6a4a' : '#7fe8ff'); });
    s.m.tick(t, t > it ? 1 : 0.2, [-0.6, 0.24, 0]); sideCam(T, s.stage.camera, t, info.dur, { pos: [0.9, 1.9, 3.3], look: [-0.45, 0.25, 0] }, { pos: [0.85, 1.7, 2.7], look: [-0.5, 0.25, 0] }); },
  overlay(g, t, info) { const it = local(info, t, 'itches') ?? 1.0, hu = local(info, t, 'hurts') ?? 2.1; const lab = t < it ? 'CLENCH' : t < hu ? 'ITCH' : 'PAIN'; word(g, lab, E.H * V(0.16, 0.16), 1, { color: t < hu ? '#bff6ff' : '#ff7a5a', scale: 1 + 0.1 * Math.max(0, 1 - (t - (t < it ? 0 : t < hu ? it : hu)) / 0.2) }); if (t > hu) veil(g, '#ff2a10', 0.12 * Math.abs(Math.sin(t * 9))); },
});
// p04: "But there's nothing there." pull back: the phantom fades, only the stump remains
registerShot('p04', { kind: '3d', init: (T) => { const st = darkStage(T); const r = armOnTable(T, st, 'stump'); const ph = hand(T, 'phantom'); ph.rotation.set(-Math.PI / 2, 0, Math.PI / 2); ph.position.set(0.1, 0.24, 0); st.add(ph); return { stage: st, ...r, ph }; },
  draw(s, t, info, T) { const k = ease.inOut(prog(t, 0.1, 0.9)); s.ph.children.forEach((c) => { if (c.material) c.material.opacity = (c.material.wireframe ? 0.35 : 0.26) * (1 - k); }); sideCam(T, s.stage.camera, t, info.dur, { pos: [0.8, 1.8, 3.0], look: [-0.3, 0.25, 0] }, { pos: [0.2, 3.0, 5.2], look: [0.1, 0.2, 0] }); },
  overlay(g, t) { word(g, "NOTHING'S THERE", E.H * V(0.16, 0.16), ease.out(prog(t, 0.3, 0.6)), { color: '#ffffff' }); },
});
// p05: "This is phantom limb, and most people who lose a limb experience it." title over the slowly turning phantom
registerShot('p05', { kind: '3d', init: (T) => { const st = darkStage(T, { ambient: 0.8 }); const ph = hand(T, 'phantom', { s: 1.0 }); ph.position.set(0, 0.6, 0); st.add(ph); const m = motes(T, st, 90); return { stage: st, ph, m }; },
  draw(s, t, info, T) { s.ph.rotation.y = t * 0.5; s.ph.clench(0.2 + 0.15 * Math.sin(t)); s.m.tick(t, 1, [0, 0.4, 0]); T.orbit(s.stage.camera, t, { target: [0, 1.1, 0], radius: [4.6, 3.8], height: [1.6, 1.4], from: -0.3, to: 0.3, dur: info.dur }); },
  overlay(g, t, info) { UI.titleCard(g, t, { lines: ['PHANTOM LIMB'], dur: info.dur + 0.3, y: E.H * V(0.2, 0.125) }); const m = local(info, t, 'most') ?? 1.6; stat(g, { label: 'AFTER AN AMPUTATION', value: 'MOST FEEL IT', x: E.W / 2, y: E.H * V(0.86, 0.69), size: V(96, 108), color: '#bff6ff', a: ease.out(prog(t, m - 0.2, m + 0.1)), pulse: t - m }); },
});
// mirror box: a box with a vertical mirror; the good hand on one side, its reflection where the missing hand would be
function mirrorBox(T) {
  const st = darkStage(T, { fov: 42 }); const { THREE } = T;
  st.add(T.box(2.6, 0.9, 1.6, T.mat('#3a2a20', { roughness: 0.7 }), 0, 0.45, -0.1));
  const mirror = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.85), new THREE.MeshStandardMaterial({ color: 0xdfeef4, metalness: 1, roughness: 0.06 })); mirror.position.set(0, 0.88, 0.0); mirror.rotation.y = Math.PI / 2; mirror.rotation.x = 0; st.add(mirror);
  const frame = T.box(0.06, 0.95, 1.6, T.mat('#c8b080', { metalness: 0.6, roughness: 0.3 }), 0, 0.9, 0); st.add(frame);
  const good = hand(T, 'real'); good.rotation.set(-Math.PI / 2, 0, 0); good.position.set(0.75, 0.94, 0.55); st.add(good);
  const arm = forearm(T, {}); arm.rotation.x = -Math.PI / 2; arm.position.set(0.75, 0.94, 0.55); st.add(arm);
  const refl = hand(T, 'real', { rim: '#7fe8ff' }); refl.rotation.set(-Math.PI / 2, 0, 0); refl.scale.x = -1; refl.position.set(-0.75, 0.94, 0.55); st.add(refl);
  const arm2 = forearm(T, { rim: '#7fe8ff' }); arm2.rotation.x = -Math.PI / 2; arm2.position.set(-0.75, 0.94, 0.55); st.add(arm2);
  return { stage: st, good, refl };
}
// p12: "A box, with a mirror."
registerShot('p12', { kind: '3d', init: (T) => mirrorBox(T),
  draw(s, t, info, T) { T.dolly(s.stage.camera, t, [[0, { pos: [0.2, 4.8, 4.2], look: [0, 0.7, 0.2] }], [info.dur, { pos: [0.1, 4.3, 3.7], look: [0, 0.7, 0.2] }]]); },
  overlay(g, t) { word(g, 'A BOX + A MIRROR', E.H * V(0.16, 0.16), ease.out(prog(t, 0.05, 0.3)), { color: '#ffd8a0' }); },
});
// p13: "Patients watched the reflection of their good hand, and for some, the pain began to ease."
registerShot('p13', { kind: '3d', init: (T) => mirrorBox(T),
  draw(s, t, info, T) { const c = 0.5 + 0.5 * Math.sin(t * 2.2); s.good.clench(c); s.refl.clench(c); T.dolly(s.stage.camera, t, [[0, { pos: [2.8, 3.2, 4.0], look: [0, 0.8, 0.3] }], [info.dur, { pos: [2.3, 2.9, 3.4], look: [0, 0.8, 0.3] }]]); },
  overlay(g, t, info) { const e = local(info, t, 'ease') ?? 4.6, k = ease.inOut(prog(t, e - 1.6, e + 0.4)); const mx = E.W * 0.12, mw = E.W * 0.76, my = E.H * V(0.86, 0.27);
    text(g, 'PHANTOM PAIN', mx, my - V(50, 56), { size: V(32, 38), font: 'Nunito', weight: 900, color: '#ffe0c0', align: 'left', spacing: 3 });
    rr(g, mx, my - 26, mw, 52, 26); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill(); rr(g, mx, my - 26, mw * lerp(0.92, 0.35, k), 52, 26); g.fillStyle = k > 0.5 ? '#7fe8ff' : '#ff6a4a'; g.fill();
    const sw = ease.out(prog(t, e - 0.3, e)); word(g, 'THE BRAIN SEES A HAND', E.H * V(0.16, 0.16), ease.out(prog(t, 0.3, 0.6)) * (1 - sw), { size: V(62, 70), color: '#bff6ff' }); word(g, 'FOR SOME, PAIN EASED', E.H * V(0.16, 0.16), sw, { size: V(62, 70), color: '#ffd8a0' }); },
});
// the rubber hand set: real hand hidden behind a screen, rubber hand in view, a brush strokes both
function rubberSet(T) {
  const st = darkStage(T, { fov: 44 }); const { THREE } = T;
  const screen = T.box(0.06, 1.4, 1.6, T.mat('#5a4a3a', { roughness: 0.8 }), 0.15, 0.7, 0.1); st.add(screen);
  const real = hand(T, 'real'); real.rotation.set(-Math.PI / 2, 0, 0); real.position.set(0.9, 0.05, 0.6); st.add(real); const ra = forearm(T, { sleeve: '#3a8a9a' }); ra.rotation.x = -Math.PI / 2; ra.position.set(0.9, 0.05, 0.6); st.add(ra);
  const rub = hand(T, 'rubber'); rub.rotation.set(-Math.PI / 2, 0, 0); rub.position.set(-0.45, 0.05, 0.6); st.add(rub);
  const brush = (x) => { const b = new THREE.Group(); b.add(T.cyl(0.03, 0.03, 0.9, T.mat('#c8a060'), 0, 0.45, 0, 10)); b.add(T.cyl(0.06, 0.03, 0.18, T.mat('#2a2018'), 0, -0.05, 0, 10)); b.position.set(x, 0.3, 0.6); b.rotation.z = 0.4; st.add(b); return b; };
  return { stage: st, real, rub, b1: brush(0.9), b2: brush(-0.45) };
}
const strokeBrushes = (s, t) => { const u = Math.sin(t * 3.2); for (const [b, x] of [[s.b1, 0.9], [s.b2, -0.45]]) { b.position.set(x + 0.05, 0.3 + Math.max(0, -u) * 0.05, 0.6 + u * 0.35); } };
// p15: "people watched a fake hand being stroked, while their real hand was hidden."
registerShot('p15', { kind: '3d', init: (T) => rubberSet(T),
  draw(s, t, info, T) { strokeBrushes(s, t); T.dolly(s.stage.camera, t, [[0, { pos: [-0.3, 3.6, 4.2], look: [0.2, 0.1, 0.4] }], [info.dur, { pos: [-0.4, 3.2, 3.6], look: [0.15, 0.1, 0.4] }]]); },
  overlay(g, t, info) { word(g, 'THE RUBBER HAND', E.H * V(0.16, 0.16), ease.out(prog(t, 0.1, 0.4)), { color: '#ffd8a0' }); const hd = local(info, t, 'hidden') ?? 4.4; word(g, 'REAL HAND HIDDEN', E.H * V(0.86, 0.255), ease.out(prog(t, hd - 0.2, hd + 0.1)), { size: V(60, 68), color: '#bff6ff' }); },
});
// p16: "Within minutes, many felt the rubber hand was theirs." a glow travels from the body into the rubber hand
registerShot('p16', { kind: '3d', init: (T) => { const r = rubberSet(T); const g2 = hand(T, 'phantom', { color: '#ffd8a0' }); g2.rotation.set(-Math.PI / 2, 0, 0); g2.position.set(-0.45, 0.06, 0.6); g2.scale.setScalar(1.04); r.stage.add(g2); r.glowHand = g2; return r; },
  draw(s, t, info, T) { strokeBrushes(s, t); const k = ease.inOut(prog(t, 0.4, 1.8)); s.glowHand.children.forEach((c) => { if (c.material) c.material.opacity = (c.material.wireframe ? 0.25 : 0.28) * k; }); T.dolly(s.stage.camera, t, [[0, { pos: [-1.0, 2.2, 3.0], look: [-0.3, 0.1, 0.5] }], [info.dur, { pos: [-0.9, 1.9, 2.5], look: [-0.35, 0.1, 0.5] }]]); },
  overlay(g, t) { word(g, '"THAT\'S MY HAND."', E.H * V(0.16, 0.16), ease.out(prog(t, 1.2, 1.5)), { color: '#ffd8a0' }); word(g, 'WITHIN MINUTES', E.H * V(0.86, 0.255), ease.out(prog(t, 0.1, 0.4)), { size: V(56, 64) }); },
});
// p19: end: the empty sleeve on the table, the phantom hand glowing where the hand should be, slowly opening, then rising away as light
registerShot('p19', { kind: '3d', init: (T) => { const st = darkStage(T, { ambient: 0.9 }); const r = armOnTable(T, st, 'stump'); const ph = hand(T, 'phantom'); ph.rotation.set(-Math.PI / 2, 0, Math.PI / 2); ph.position.set(0.1, 0.24, 0); st.add(ph); const m = motes(T, st, 110, '#9ff0ff'); const b = bokeh(T, st); return { stage: st, ...r, ph, m, b }; },
  draw(s, t, info, T) { const d = info.dur, open = ease.inOut(prog(t, 0.2, 2.2)), lift = ease.in(prog(t, d - 2.2, d));
    s.ph.clench(0.55 * (1 - open) + 0.05 * Math.sin(t * 1.6)); s.ph.userData.thumb[0].rotation.z = -0.55; s.ph.position.y = 0.24 + lift * 0.5; s.ph.rotation.x = -Math.PI / 2 + lift * 0.5;
    const pulse = 0.75 + 0.25 * Math.sin(t * 2.2); s.ph.children.forEach((c) => { if (c.material) c.material.opacity = (c.material.wireframe ? 0.38 : 0.3) * pulse * (1 - lift * 0.85); });
    s.m.tick(t, 0.5 + lift * 1.6, [-0.5, 0.24, 0]); s.b.tick(t);
    T.dolly(s.stage.camera, t, [[0, { pos: [-2.3, 1.7, 3.1], look: [-0.5, 0.3, 0] }], [d * 0.6, { pos: [-2.6, 2.0, 3.6], look: [-0.5, 0.4, 0] }], [d, { pos: [-2.9, 2.6, 4.3], look: [-0.5, 0.65, 0] }]]); },
  overlay(g, t, info) { const a = ease.out(prog(t, 0.3, 0.9)); g.save(); const gr = g.createLinearGradient(0, 0, 0, E.H * 0.34); gr.addColorStop(0, 'rgba(2,4,8,.9)'); gr.addColorStop(1, 'rgba(2,4,8,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H * 0.34);
    const gb = g.createLinearGradient(0, E.H * 0.7, 0, E.H); gb.addColorStop(0, 'rgba(2,4,8,0)'); gb.addColorStop(1, 'rgba(2,4,8,.85)'); g.fillStyle = gb; g.fillRect(0, E.H * 0.7, E.W, E.H * 0.3); g.restore();
    text(g, 'Ever felt something', E.W / 2, E.H * V(0.12, 0.12), { size: V(64, 72), font: 'Playfair Display', weight: 900, italic: true, color: '#f0f6ff', alpha: a, glow: 14 });
    text(g, "that wasn't there?", E.W / 2, E.H * V(0.12, 0.12) + V(90, 100), { size: V(74, 82), font: 'Playfair Display', weight: 900, italic: true, color: '#7fe8ff', alpha: a, glow: 20 });
    word(g, 'TELL ME IN THE COMMENTS', E.H * V(0.86, 0.82), ease.out(prog(t, 2.2, 2.6)), { size: V(48, 56) }); veil(g, '#000000', ease.in(prog(t, info.dur - 0.5, info.dur)) * 0.9); },
});
