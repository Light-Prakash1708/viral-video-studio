// shots/03_flash.js: memories (golden gully, exam night, haircut) and "you try everything" (f24–f31).
import { E, V, registerShot, ease, prog, clamp, lerp, rng, alpha, text, glow, circle, rr, seg } from '/engine/core.js';
import { LOOK, kid, faceTo, person, local, blinkAt, cam, proj, tag, roll, hud, tone, vignette, serif, chat, stageFor, canteen, gully, deskRoom, lowWall, signBoard, wickets, giveBat, ball, deliveryPos, batSwing, phone3D, lamp, sprite, dust } from '../sets/fc.js';

const life = (p, t, seed, o = {}) => p.set({ breathe: t + seed, expr: o.expr ?? (blinkAt(t, seed) ? 'blink' : 'neutral'), ...o });
const memoryLabel = (g, str, t) => serif(g, str, E.W / 2, E.H * 0.1, { size: 40, a: 0.85 * ease.out(prog(t, 0.1, 0.5)), color: '#fff0d8' });

// f24: age seven: kid YOU and kid Kabir on a gully wall, golden hour
registerShot('f24', { kind: '3d',
  init(T) { const st = stageFor(T, 'golden', { focus: 2.6, aperture: 0.005 }); const set = gully(T, st); lowWall(T, st, -0.6, -4.0, 3.2, 0.6);
    const a = person(T, st, kid('you'), [-1.0, -4.0], 0, { y: 0.59, set: { sit: true } }), b = person(T, st, kid('kabir'), [-0.2, -4.0], 0, { y: 0.59, set: { sit: true } }); return { stage: st, set, a, b }; },
  draw(s, t, info, T) { s.set.tick(t); const sw = Math.sin(t * 3);
    life(s.a, t, 1, { expr: Math.sin(t * 5) > 0 ? 'happy' : 'talk', look: [0.6, 0.1], armL: 0.3 }); life(s.b, t, 2, { expr: 'happy', look: [-0.5, 0.1], armR: 0.4 + 0.3 * Math.max(0, sw) });
    s.a.userData.legs.forEach((l, i) => l.rotation.x = -1.2 + 0.25 * Math.sin(t * 4 + i * 2)); s.b.userData.legs.forEach((l, i) => l.rotation.x = -1.2 + 0.25 * Math.sin(t * 4.4 + i * 2 + 1));
    cam(T, s.stage, t, info.dur, { pos: [0.6, 1.0, -0.6], look: [-0.6, 1.15, -4.0] }, { pos: [0.3, 1.05, -1.2], look: [-0.6, 1.2, -4.0] }); s.stage.focusOn([-0.6, 1.0, -4.0]); },
  overlay(g, t, info, s) { tone(g, 'warm', 1); memoryLabel(g, 'age seven', t); vignette(g, 0.55); },
});
// f25: kids' cricket in the gully: bat swing, ball flies
registerShot('f25', { kind: '3d',
  init(T) { const st = stageFor(T, 'golden', { focus: 2.4, aperture: 0.004 }); const set = gully(T, st, { seed: 33 }); wickets(T, st, 0, -1.2);
    const bat = person(T, st, kid('kabir'), [0.25, -0.75], -0.4); const b = giveBat(T, bat); const bowl = person(T, st, kid('you'), [0.2, -9], 0.05); const bl = ball(T, st); return { stage: st, set, bat, b, bowl, bl }; },
  draw(s, t, info, T) { s.set.tick(t + 2); const hit = 0.72, W = batSwing(t, hit);
    s.b.rotation.x = W.rx; s.b.rotation.z = W.rz;
    s.bat.set({ breathe: t, expr: t > hit ? 'happy' : 'determined', look: [-0.3, 0], armR: W.arm, reachR: 1.0 - 0.4 * clamp(W.arm - 0.3), armL: W.arm * 0.85, reachL: 0.9 - 0.3 * clamp(W.arm - 0.3) });
    s.bowl.set({ breathe: t, expr: t > hit + 0.3 ? 'surprised' : 'determined', armR: 0.6 + 0.3 * Math.sin(t * 3), walk: 0, nod: -0.15 });
    const D = { rel: -0.55, hitT: hit, from: [0.2, 1.7, -8.4], pitch: [0.16, 0.04, -3.0], bat: [0.18, 0.6, -0.72], loft: [-1.4, 5.5, -7.0] };
    const P = deliveryPos(t, D); s.bl.position.set(...P); s.bl.rotation.x = t * 38; s.bl.rotation.z = t * 9;
    s.bl.trail([1, 2, 3, 4, 5, 6, 7].map((k) => deliveryPos(t - k * 0.018, D)), t > hit ? 1.4 : 0.8); s.bl.burst(D.bat, prog(t, hit, hit + 0.28));
    cam(T, s.stage, t, info.dur, { pos: [1.5, 0.75, 1.6], look: [0.0, 0.95, -2.5] }, { pos: [1.2, 0.8, 1.2], look: [0.0, 1.1, -3.5] }); s.stage.focusOn(s.bat.userData.head); },
  overlay(g, t, info, s) { tone(g, 'warm', 1); memoryLabel(g, 'cricket in the gully', t); vignette(g, 0.55); },
});
// f26: exam nights: desk lamp, two teens over books
registerShot('f26', { kind: '3d',
  init(T) { const st = stageFor(T, 'room', { focus: 1.6, aperture: 0.006 }); const set = deskRoom(T, st);
    const a = person(T, st, 'you', [-0.3, -1.05], Math.PI, { y: 0.32, set: { sit: true } }), b = person(T, st, 'kabir', [0.5, -1.1], Math.PI - 0.2, { y: 0.32, set: { sit: true } }); return { stage: st, set, a, b }; },
  draw(s, t, info, T) { s.set.tick(t); life(s.a, t, 1, { expr: blinkAt(t, 1) ? 'blink' : 'worried', nod: 0.35, reachL: 1.3, reachR: 1.1, armL: 0.3 }); life(s.b, t, 2, { expr: t > 0.6 ? 'happy' : 'talk', look: [0.6, 0], nod: 0.15, armR: 0.5, reachR: 1.0 });
    cam(T, s.stage, t, info.dur, { pos: [-1.1, 1.95, -2.3], look: [0.1, 1.3, -0.9], fov: 58 }, { pos: [-0.9, 1.9, -2.25], look: [0.15, 1.3, -0.95], fov: 54 }, ease.linear); s.stage.focusOn(s.b.userData.head); },
  overlay(g, t, info, s) { tone(g, 'warm', 0.8); memoryLabel(g, 'exam nights', t); vignette(g, 0.55); },
});
// f27: the worst haircut; Kabir: "looks fine!"
registerShot('f27', { kind: '3d',
  init(T) { const st = stageFor(T, 'golden', { focus: 2.4, aperture: 0.005 }); const set = gully(T, st, { seed: 35 }); signBoard(T, st, 'NEW STYLE SALOON', [-2.55, 2.9, -2.6], Math.PI / 2);
    const a = faceTo(person(T, st, { ...LOOK.you, hair: 'bowl' }, [-0.5, -2.4]), 1.4, 1.5), b = faceTo(person(T, st, 'kabir', [0.6, -2.2]), 1.0, 1.5); return { stage: st, set, a, b }; },
  draw(s, t, info, T) { s.set.tick(t + 4); const sa = local(info, t, 'said') ?? 2.39;
    life(s.a, t, 1, { expr: t < sa ? 'worried' : 'happy', look: [0.2, 0.3], armL: t < 1.8 ? 2.6 : 0.3, reachL: t < 1.8 ? 0.4 : 0, tilt: -0.08 });
    life(s.b, t, 2, { expr: t > sa - 0.3 ? 'happy' : 'smug', look: [-0.3, 0], armR: t > sa - 0.3 ? 2.2 : 0.3, reachR: t > sa - 0.3 ? 0.6 : 0 });
    cam(T, s.stage, t, info.dur, { pos: [1.4, 1.65, 1.4], look: [0, 1.65, -2.3] }, { pos: [1.1, 1.62, 0.9], look: [0, 1.68, -2.3] }); s.stage.focusOn([0, 1.6, -2.3]); s.Pa = proj(T, s.stage, s.a, 0.5); s.Pb = proj(T, s.stage, s.b, 0.5); },
  overlay(g, t, info, s) { const sa = local(info, t, 'said') ?? 2.39; tone(g, 'warm', 1); memoryLabel(g, 'the worst haircut of your life', t);
    chat(g, s.Pb.x + 170, s.Pb.y - 70, 'looks fine, bro!', ease.outBack(prog(t, sa - 0.2, sa + 0.1)), { left: true, size: 32 }); vignette(g, 0.55); },
});
// f28: back to now: Kabir at the canteen window, amber 22; YOU blurred in the foreground (rack focus)
registerShot('f28', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 1.2, aperture: 0.006, maxblur: 0.014 }); const set = canteen(T, st, { clear: [[0, -6]] });
    const k = person(T, st, 'kabir', [1.3, -8.4], Math.PI - 0.25), y = faceTo(person(T, st, 'you', [-0.4, -5.6]), 1.3, -8.4); return { stage: st, set, k, y }; },
  draw(s, t, info, T) { s.set.tick(t + 30); life(s.k, t, 1, { look: [0, 0.1] }); life(s.y, t, 2, { expr: 'worried' });
    cam(T, s.stage, t, info.dur, { pos: [-0.2, 1.72, -4.1], look: [1.25, 1.85, -8.4] }, { pos: [-0.1, 1.72, -4.4], look: [1.3, 1.88, -8.4] }); s.stage.bokeh.uniforms.focus.value = lerp(1.3, 4.4, ease.inOut(prog(t, 0.6, 1.6))); s.P = proj(T, s.stage, s.k, 0.66); },
  overlay(g, t, info, s) { const d = local(info, t, '22') ?? 1.75; tag(g, s.P, 22, { t, kind: 'amber', pop: t - d, s: 1.1 }); hud(g, t, { color: '#ffb43c' }); vignette(g, 0.55); },
});
// f29: free food: YOU slides a plate of samosas across; 22 does not move
registerShot('f29', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 2.2, aperture: 0.005 }); const set = canteen(T, st, { clear: [[0.15, -0.15], [-0.1, 1.38]] });
    const k = person(T, st, 'kabir', [0.15, -0.15], 0, { y: 0.2, set: { sit: true, reachL: 0.9, reachR: 0.9 } }), y = person(T, st, 'you', [-0.6, 1.38], Math.PI, { y: 0.2, set: { sit: true } });
    const plate = new T.THREE.Group(); plate.add(T.cyl(0.22, 0.18, 0.025, T.mat('#d8d8e0', { metalness: 0.7, roughness: 0.25 }))); for (let i = 0; i < 4; i++) { const c = T.cone(0.07, 0.09, T.mat('#d89a40', { roughness: 0.7 }), Math.cos(i * 1.6) * 0.09, 0.05, Math.sin(i * 1.6) * 0.09, 3); c.rotation.x = Math.PI / 2; c.rotation.z = i; plate.add(c); } st.add(plate);
    return { stage: st, set, k, y, plate }; },
  draw(s, t, info, T) { s.set.tick(t + 33); const k = ease.out(prog(t, 0.4, 1.2)); s.plate.position.set(lerp(-0.5, 0.1, k), 0.66, lerp(1.0, 0.25, k));
    life(s.y, t, 1, { expr: 'happy', armR: 0.5, reachR: 1.3 * (1 - prog(t, 1.2, 1.6)) }); life(s.k, t, 2, { expr: t > 1.3 ? 'happy' : 'neutral', look: [-0.1, -0.4], nod: 0.1 });
    cam(T, s.stage, t, info.dur, { pos: [1.9, 2.0, 2.4], look: [0, 1.05, 0.4] }, { pos: [1.6, 1.95, 2.1], look: [0, 1.1, 0.4] }); s.stage.focusOn(s.k.userData.head); s.P = proj(T, s.stage, s.k, 0.66); },
  overlay(g, t, info, s) { tag(g, s.P, 22, { t, kind: 'amber', s: 1.1 }); hud(g, t, { color: '#ffb43c' }); vignette(g); },
});
// f30: movie night: sofa, TV glow flickering
registerShot('f30', { kind: '3d',
  init(T) { const st = stageFor(T, 'room', { focus: 2.4, aperture: 0.005 }); deskRoom(T, st); const { THREE } = T;
    const sofaM = T.mat('#5a2a3a', { roughness: 0.9 }); st.add(T.box(2.4, 0.45, 0.9, sofaM, 0, 0.22, 0.0), T.box(2.4, 0.6, 0.25, sofaM, 0, 0.6, -0.4), T.box(0.25, 0.65, 0.9, sofaM, -1.2, 0.33, 0), T.box(0.25, 0.65, 0.9, sofaM, 1.2, 0.33, 0));
    const a = person(T, st, 'you', [-0.45, 0.05], 0, { y: 0.2, set: { sit: true } }), b = person(T, st, 'kabir', [0.45, 0.05], 0, { y: 0.2, set: { sit: true } });
    const tv = new THREE.PointLight(new THREE.Color('#7fb8ff'), 6, 6, 2); tv.position.set(0, 1.0, 2.2); st.add(tv);
    const bowl = T.cyl(0.18, 0.12, 0.12, T.mat('#c83a3a'), 0, 0.52, 0.1); st.add(bowl); for (let i = 0; i < 12; i++) st.add(T.sphere(0.035, T.mat('#fff4d8'), Math.cos(i) * 0.1, 0.6, 0.1 + Math.sin(i) * 0.1));
    return { stage: st, a, b, tv }; },
  draw(s, t, info, T) { s.tv.intensity = 5 + 2.5 * Math.sin(t * 13) * Math.sin(t * 5.3); s.tv.color.setHSL(0.6 + 0.05 * Math.sin(t * 3), 0.6, 0.7);
    life(s.a, t, 1, { expr: 'happy', look: [0.5, 0.1] }); life(s.b, t, 2, { expr: blinkAt(t, 2) ? 'blink' : 'neutral', look: [0, 0.1] });
    cam(T, s.stage, t, info.dur, { pos: [1.0, 1.35, 3.2], look: [0, 1.4, 0] }, { pos: [0.8, 1.35, 2.85], look: [0, 1.45, 0] }); s.stage.focusOn(s.b.userData.head); s.P = proj(T, s.stage, s.b, 0.66); },
  overlay(g, t, info, s) { tag(g, s.P, 22, { t, kind: 'amber' }); hud(g, t, { color: '#ffb43c' }); vignette(g, 0.6); },
});
// f31: 2 a.m. memes in the dark; buzz; 22 frozen
function memes(g, W, H) { g.fillStyle = '#0e1220'; g.fillRect(0, 0, W, H); g.fillStyle = '#1a2238'; g.fillRect(0, 0, W, 80); g.fillStyle = '#3c9a58'; g.beginPath(); g.arc(44, 40, 22, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '900 26px Nunito'; g.fillText('Kabir', 80, 36); g.font = '800 16px Nunito'; g.fillStyle = '#8a9ac0'; g.fillText('last seen 11:40 pm', 80, 60);
  g.font = '800 20px Nunito'; g.textAlign = 'center'; g.fillStyle = '#5a6a90'; g.fillText('2:04 AM', W / 2, 112);
  const bub = (y, h, c) => { g.fillStyle = c; g.beginPath(); g.roundRect(W - 250, y, 230, h, 16); g.fill(); };
  bub(130, 150, '#2a6ad8'); g.fillStyle = '#ffcf5a'; g.fillRect(W - 238, 142, 206, 100); g.fillStyle = '#20202c'; g.font = '900 22px Nunito'; g.fillText('WHEN THE', W - 135, 180); g.fillText('TEACHER SAYS', W - 135, 206); g.fillStyle = '#fff'; g.font = '800 16px Nunito'; g.fillText('remember this?? lol', W - 135, 268);
  bub(300, 140, '#2a6ad8'); g.fillStyle = '#ff7a5c'; g.fillRect(W - 238, 312, 206, 90); g.fillStyle = '#fff'; g.font = '900 30px Nunito'; g.fillText('2016 vibes', W - 135, 365); g.font = '800 16px Nunito'; g.fillText('bro wake up', W - 135, 425);
  bub(460, 60, '#2a6ad8'); g.fillStyle = '#fff'; g.font = '800 20px Nunito'; g.fillText('hello??', W - 135, 497);
  g.fillStyle = '#8a9ac0'; g.font = '800 14px Nunito'; g.textAlign = 'right'; g.fillText('delivered', W - 22, 540); }
registerShot('f31', { kind: '3d',
  init(T) { const st = stageFor(T, 'room', { focus: 1.0, aperture: 0.01, ambient: 0.35 }); deskRoom(T, st); const ph = phone3D(T, memes, { bright: 0.95 }); ph.scale.setScalar(0.7); ph.position.set(0, 1.2, -0.6); ph.rotation.set(-0.15, 0, 0); st.add(ph);
    const L = new T.THREE.PointLight(new T.THREE.Color('#7fa8ff'), 3, 3, 2); L.position.set(0, 1.25, -0.3); st.add(L); return { stage: st, ph }; },
  draw(s, t, info, T) { const bz = Math.max(0, 1 - ((t - 0.1) % 1.0) / 0.25) * (t > 0.1 && t < 1.2 ? 1 : 0); s.ph.position.x = Math.sin(t * 90) * 0.006 * bz; s.ph.rotation.z = Math.sin(t * 70) * 0.03 * bz;
    cam(T, s.stage, t, info.dur, { pos: [0.15, 1.35, 0.35], look: [0, 1.2, -0.6] }, { pos: [0.08, 1.3, 0.15], look: [0, 1.2, -0.6] }, ease.linear); s.stage.focusOn(s.ph); s.P = proj(T, s.stage, [0, 1.52, -0.6]); },
  overlay(g, t, info, s) { const mv = local(info, t, 'move') ?? 2.2; tag(g, s.P, 22, { t, kind: 'amber', s: 0.9, dy: -20, glitch: t > mv ? 0.3 * Math.abs(Math.sin(t * 20)) : 0 }); hud(g, t, { color: '#ffb43c' }); vignette(g, 0.65); },
});
