// shots/01_canteen.js: cold open + rules of the power (f01–f13), the dusk college canteen.
import { E, V, registerShot, ease, prog, clamp, lerp, rng, alpha, text, glow, circle, rr } from '/engine/core.js';
import { LOOK, faceTo, person, local, at, blinkAt, cam, proj, tag, roll, hud, tone, vignette, topBand, serif, bigText, chat, stageFor, canteen, phone3D, momCall, sprite, TAGC } from '../sets/fc.js';

const seat = (T, st, who, x, z, face = 1, o = {}) => person(T, st, who, [x, z], face > 0 ? 0 : Math.PI, { y: 0.2, ...o, set: { sit: true, armL: 0.25, armR: 0.25, reachL: 0.9, reachR: 0.9, ...(o.set || {}) } });
// hero table: Kabir on the far bench (faces camera, +z), YOU on the near bench (faces -z)
const KAB = [0.15, -0.15], YOU = [-0.1, 1.38];
function heroSet(T, o = {}) {
  const st = stageFor(T, 'canteen', { focus: o.focus ?? 2, aperture: o.aperture ?? 0.004, maxblur: o.maxblur ?? 0.01, ...(o.stage || {}) });
  const set = canteen(T, st, { clear: [KAB, YOU, ...(o.clear || [])], ...(o.set || {}) });
  const kabir = seat(T, st, 'kabir', KAB[0], KAB[1], 1), you = seat(T, st, 'you', YOU[0], YOU[1], -1);
  // chai glasses + plate of samosas on the hero table
  st.add(T.cyl(0.04, 0.034, 0.1, T.mat('#e8c890', { transparent: true, opacity: 0.85, roughness: 0.1 }), 0.4, 0.7, 0.45), T.cyl(0.04, 0.034, 0.1, T.mat('#e8c890', { transparent: true, opacity: 0.85, roughness: 0.1 }), -0.35, 0.7, 0.8));
  return { st, set, kabir, you };
}
const crowdVals = (n, seed = 3) => { const R = rng(seed); return Array.from({ length: n }, () => { const r = R(); return r < 0.15 ? 2 + Math.floor(R() * 5) : r < 0.5 ? 20 + Math.floor(R() * 300) : r < 0.85 ? 400 + Math.floor(R() * 4000) : 9000 + Math.floor(R() * 9000); }); };
const life = (p, t, seed, o = {}) => p.set({ breathe: t + seed, expr: o.expr ?? (blinkAt(t, seed) ? 'blink' : 'neutral'), ...o });

// f01: cold open: CU Kabir with a white 41 above his cap
registerShot('f01', { kind: '3d',
  init(T) { const h = heroSet(T, { focus: 1.7 }); return { stage: h.st, ...h }; },
  draw(s, t, info, T) { s.set.tick(t); const talk = t > 0.4 && t < 1.8 && Math.sin(t * 16) > 0;
    life(s.kabir, t, 0, { expr: t < 0.4 ? 'neutral' : talk ? 'talk' : blinkAt(t, 1) ? 'blink' : 'happy', look: [0.1, 0.05], tilt: 0.04 * Math.sin(t * 1.3) }); life(s.you, t, 2);
    cam(T, s.stage, t, info.dur, { pos: [0.6, 1.62, 2.25], look: [0.15, 1.74, -0.15] }, { pos: [0.45, 1.62, 1.9], look: [0.15, 1.76, -0.15] }, ease.linear); s.stage.focusOn(s.kabir.userData.head); s.P = proj(T, s.stage, s.kabir, 0.66); },
  overlay(g, t, info, s) { tag(g, s.P, 41, { t, pop: t - (local(info, t, '41') ?? 1.5), a: ease.out(prog(t, 0, 0.3)) }); vignette(g); },
});
// f02: low angle push up from his face to the number
registerShot('f02', { kind: '3d',
  init(T) { const h = heroSet(T, { focus: 1.4 }); return { stage: h.st, ...h }; },
  draw(s, t, info, T) { s.set.tick(t + 2.3); life(s.kabir, t, 3, { expr: blinkAt(t, 3) ? 'blink' : 'happy', look: [-0.1, 0.3], nod: -0.08 });
    cam(T, s.stage, t, info.dur, { pos: [0.8, 1.0, 1.95], look: [0.12, 1.5, -0.15] }, { pos: [0.55, 1.1, 1.6], look: [0.12, 1.95, -0.15] }); s.stage.focusOn(s.kabir.userData.head); s.P = proj(T, s.stage, s.kabir, 0.66); },
  overlay(g, t, info, s) { tag(g, s.P, 41, { t, pop: t - 1.62 }); vignette(g); },
});
// f03: OTS from YOU; the number grows on each word: SMALL / WHITE / GLOWING / FORTY-ONE
registerShot('f03', { kind: '3d',
  init(T) { const h = heroSet(T, { focus: 1.9, aperture: 0.006 }); return { stage: h.st, ...h }; },
  draw(s, t, info, T) { s.set.tick(t + 5); life(s.kabir, t, 4, { expr: blinkAt(t, 4) ? 'blink' : t > 2.2 ? 'smug' : 'happy', look: [0.15, 0.05] }); life(s.you, t, 5, { look: [0, 0.2] });
    cam(T, s.stage, t, info.dur, { pos: [-0.62, 1.72, 2.95], look: [0.2, 1.72, -0.15] }, { pos: [-0.5, 1.7, 2.6], look: [0.18, 1.8, -0.15] }); s.stage.focusOn(s.kabir.userData.head); s.P = proj(T, s.stage, s.kabir, 0.66); },
  overlay(g, t, info, s) { const sm = local(info, t, 'small') ?? 0.15, wh = local(info, t, 'white') ?? 0.87, gl = local(info, t, 'glowing') ?? 1.81, fo = local(info, t, 'forty') ?? 2.15;
    const sc = t < wh ? 0.8 : t < gl ? 0.95 : t < fo ? 1.15 : 1.35, last = t < sm ? -9 : t < wh ? sm : t < gl ? wh : t < fo ? gl : fo;
    if (t > gl) glow(g, s.P.x, s.P.y, 260 * ease.out(prog(t, gl, gl + 0.6)), '#ffffff', 0.18);
    tag(g, s.P, 41, { t, s: sc, pop: t - last });
    const lab = t < sm ? null : t < wh ? 'SMALL' : t < gl ? 'WHITE' : t < fo ? 'GLOWING' : null;
    if (lab) { const x = s.P.x + 210, y = s.P.y - 40, a = ease.out(prog(t, last, last + 0.15)); g.save(); g.globalAlpha = a; g.strokeStyle = alpha('#ffffff', 0.6); g.lineWidth = 2; g.beginPath(); g.moveTo(s.P.x + 70, s.P.y - 10); g.lineTo(x - 70, y + 6); g.lineTo(x - 10, y + 6); g.stroke(); g.restore(); text(g, lab, x + 50, y - 8, { size: 34, font: 'Nunito', weight: 900, color: '#ffffff', alpha: a, spacing: 6, glow: 12, glowColor: 'rgba(160,220,255,.7)' }); }
    vignette(g); },
});
// f04: CU YOU blinking, glasses glint
registerShot('f04', { kind: '3d',
  init(T) { const h = heroSet(T, { focus: 1.3 }); return { stage: h.st, ...h }; },
  draw(s, t, info, T) { s.set.tick(t + 9); const b1 = local(info, t, 'blink') ?? 0.2; const bl = (t > b1 && t < b1 + 0.14) || (t > b1 + 0.45 && t < b1 + 0.57);
    life(s.you, t, 6, { expr: bl ? 'blink' : t > 1.1 ? 'surprised' : 'neutral', look: [0.05, 0.35], nod: -0.1 }); s.kabir.visible = false;
    cam(T, s.stage, t, info.dur, { pos: [0.4, 1.55, -0.75], look: [-0.1, 1.55, 1.38] }, { pos: [0.32, 1.55, -0.5], look: [-0.1, 1.56, 1.38] }, ease.linear); s.stage.focusOn(s.you.userData.head);
    s.Py = proj(T, s.stage, s.you, 0.02); s.Pk = proj(T, s.stage, s.kabir, 0.66); },
  overlay(g, t, info, s) { // glint of the number in the glasses
    const a = 0.5 + 0.2 * Math.sin(t * 3); for (const dx of [-26, 26]) glow(g, s.Py.x + dx * s.Py.scale * 1.7, s.Py.y - 8, 26 * s.Py.scale, '#ffffff', 0.25 * a);
    vignette(g); },
});
// f05: wide canteen; numbers pop on above every head on "Everyone"
registerShot('f05', { kind: '3d',
  init(T) { const h = heroSet(T, { focus: 7, aperture: 0.0015, maxblur: 0.006 }); h.vals = crowdVals(h.set.heads.length, 5); return { stage: h.st, ...h }; },
  draw(s, t, info, T) { s.set.tick(t + 12); life(s.kabir, t, 1, { expr: 'happy', look: [-0.5, 0.1] }); life(s.you, t, 2, { look: [-0.8, 0.3] });
    cam(T, s.stage, t, info.dur, { pos: [-5.2, 2.7, 6.2], look: [0.5, 1.0, -3.0] }, { pos: [-3.6, 2.5, 6.6], look: [1.2, 1.0, -3.2] }); s.stage.focusOn([0, 1.2, -1.5]);
    s.Pk = proj(T, s.stage, s.kabir, 0.66); s.PH = s.set.heads.map((h) => proj(T, s.stage, [h[0], h[1] + 0.55, h[2]])); },
  overlay(g, t, info, s) { const ev = local(info, t, 'everyone') ?? 2.34;
    s.PH.forEach((P, i) => { const ti = ev + (i % 9) * 0.06 + (i * 0.013); if (t > ti && P.dist > 1.5) tag(g, P, s.vals[i], { t, seed: i, s: 0.9, pop: t - ti, a: ease.out(prog(t, ti, ti + 0.15)), kind: s.vals[i] < 7 ? 'red' : s.vals[i] < 100 ? 'amber' : 'white' }); });
    tag(g, s.Pk, 41, { t, s: 1.1 }); vignette(g); },
});
// f06: Riya with friends; her tag rolls up to 2,300
registerShot('f06', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 2.3, aperture: 0.005 }); const set = canteen(T, st, { clear: [[-3.6, -3.9], [-2.9, -3.9], [-4.3, -3.9], [-3.6, -2.1]] });
    const riya = seat(T, st, 'riya', -3.6, -3.9, 1), f1 = seat(T, st, { hoodie: '#5ab87a', hair: 'bob', hairColor: '#2a1a12', skin: '#c08860', rim: '#a0ffd0' }, -2.85, -3.9, 1), f2 = seat(T, st, { hoodie: '#e8d050', hair: 'none', skin: '#b07850', rim: '#ffe890' }, -4.35, -3.9, 1);
    f1.rotation.y = -0.5; f2.rotation.y = 0.5; return { stage: st, set, riya, f1, f2 }; },
  draw(s, t, info, T) { s.set.tick(t + 15); const laugh = Math.sin(t * 9) > 0;
    life(s.riya, t, 1, { expr: t < 0.8 ? 'talk' : laugh ? 'happy' : 'love', tilt: 0.08 * Math.sin(t * 4), look: [0.3, 0] }); life(s.f1, t, 2, { expr: 'happy', look: [-0.6, 0] }); life(s.f2, t, 3, { expr: laugh ? 'happy' : 'talk', look: [0.6, 0] });
    cam(T, s.stage, t, info.dur, { pos: [-2.4, 1.65, -0.9], look: [-3.6, 1.72, -3.9] }, { pos: [-2.75, 1.65, -1.25], look: [-3.6, 1.76, -3.9] }); s.stage.focusOn(s.riya.userData.head); s.P = proj(T, s.stage, s.riya, 0.66); s.P1 = proj(T, s.stage, s.f1, 0.66); s.P2 = proj(T, s.stage, s.f2, 0.66); },
  overlay(g, t, info, s) { const n = local(info, t, '2,300') ?? 2.46; tag(g, s.P1, 640, { t, s: 0.75, a: 0.75 }); tag(g, s.P2, 95, { t, s: 0.75, a: 0.75, kind: 'amber' });
    tag(g, s.P, roll(t, n - 1.0, n + 0.1, 0, 2300), { t, pop: t - n, a: ease.out(prog(t, 0.1, 0.4)) });
    text(g, 'RIYA', s.P.x, s.P.y + 230 * s.P.scale * 0.5 + 120, { size: 22, font: 'Nunito', weight: 900, color: alpha('#ffd8cc', 0.0), spacing: 4 }); vignette(g); },
});
// f07: the guy who borrowed your charger once: red 3
registerShot('f07', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 2.1, aperture: 0.005 }); const set = canteen(T, st, { clear: [[6.6, -1.2]] });
    const g = faceTo(person(T, st, 'charger', [7.6, -1.0]), 5.4, 0.2); const ph = T.box(0.08, 0.15, 0.012, T.mat('#14141c', { metalness: 0.5, roughness: 0.3 }), 0, -0.47, 0.06); g.userData.arms[1].add(ph);
    const sock = T.box(0.03, 0.12, 0.12, T.mat('#e8e8f0'), 8.84, 0.6, -0.6); st.add(sock);
    const curve = new T.THREE.CatmullRomCurve3([new T.THREE.Vector3(8.82, 0.6, -0.6), new T.THREE.Vector3(8.5, 0.15, -0.7), new T.THREE.Vector3(7.9, 0.4, -0.9), new T.THREE.Vector3(7.45, 0.75, -1.0)]);
    st.add(new T.THREE.Mesh(new T.THREE.TubeGeometry(curve, 30, 0.008, 6), T.mat('#f4f4f8'))); return { stage: st, set, g }; },
  draw(s, t, info, T) { s.set.tick(t + 18); const th = local(info, t, '3') ?? 2.17;
    life(s.g, t, 1, { expr: t < th ? (blinkAt(t, 2) ? 'blink' : 'smug') : 'worried', look: t < th ? [0.2, -0.4] : [0, 0.1], armR: 0.3, reachR: 1.1, nod: t < th ? 0.12 : 0 });
    cam(T, s.stage, t, info.dur, { pos: [5.4, 1.75, 0.9], look: [7.6, 1.75, -1.0] }, { pos: [5.75, 1.75, 0.6], look: [7.6, 1.8, -1.0] }); s.stage.focusOn(s.g.userData.head); s.P = proj(T, s.stage, s.g, 0.7); },
  overlay(g, t, info, s) { const th = local(info, t, '3') ?? 2.17; if (t > th - 0.05) tag(g, s.P, 3, { t, pop: t - th, s: 1.5 }); vignette(g); },
});
// f08: Mom on a video call: no number, a warm gold light
registerShot('f08', { kind: '3d',
  init(T) { const h = heroSet(T, { focus: 0.55, aperture: 0.012, maxblur: 0.014 }); const ph = phone3D(T, momCall); ph.scale.setScalar(0.6); ph.position.set(0.12, 1.3, 0.92); ph.rotation.set(-0.25, -0.15, 0); h.st.add(ph);
    const halo = sprite(T, h.st, [0.12, 1.55, 0.9], 0.4, '#ffcf5a', 0.0); return { stage: h.st, ...h, ph, halo }; },
  draw(s, t, info, T) { s.set.tick(t + 22); const gl = local(info, t, 'gold') ?? 4.08; s.halo.material.opacity = 0.15 + 0.45 * ease.out(prog(t, gl - 0.6, gl + 0.4));
    s.ph.rotation.z = 0.03 * Math.sin(t * 0.9); life(s.kabir, t, 2, { expr: 'happy', look: [0, 0.3] });
    s.you.visible = false; cam(T, s.stage, t, info.dur, { pos: [-0.05, 1.5, 1.85], look: [0.1, 1.38, 0.92] }, { pos: [0.0, 1.47, 1.6], look: [0.11, 1.4, 0.92] }); s.stage.focusOn(s.ph); s.P = proj(T, s.stage, [0.12, 1.5, 0.9]); },
  overlay(g, t, info, s) { const no = local(info, t, 'no') ?? 1.88, gl = local(info, t, 'gold') ?? 4.08;
    // "no number": an empty pill flickers and dissolves, then the gold light blooms
    if (t > no && t < no + 1.4) { const k = prog(t, no, no + 1.4); tag(g, s.P, '- -', { t, a: (1 - k) * (0.6 + 0.4 * Math.sin(t * 40)), s: 0.9, kind: 'cold', dy: -10 }); }
    tag(g, s.P, 'gold', { t, s: 0.6 + 0.9 * ease.out(prog(t, gl - 0.8, gl + 0.5)), dy: -10 }); tone(g, 'gold', 0.4 * ease.out(prog(t, gl - 0.5, gl + 0.6))); vignette(g); },
});
// f09: CU YOU: slowly, you understand (awe), numbers reflected in the glasses
registerShot('f09', { kind: '3d',
  init(T) { const h = heroSet(T, { focus: 1.2 }); return { stage: h.st, ...h }; },
  draw(s, t, info, T) { s.set.tick(t + 27); life(s.you, t, 5, { expr: t < 0.7 ? 'surprised' : 'awe', look: [-0.25, 0.45], nod: -0.15, tilt: 0.05 });
    s.kabir.visible = false; cam(T, s.stage, t, info.dur, { pos: [-0.95, 1.45, -0.45], look: [-0.1, 1.55, 1.38] }, { pos: [-0.8, 1.47, -0.2], look: [-0.1, 1.56, 1.38] }, ease.linear); s.stage.focusOn(s.you.userData.head); s.Py = proj(T, s.stage, s.you, 0.02); },
  overlay(g, t, info, s) { const R = rng(4); for (const dx of [-26, 26]) for (let i = 0; i < 4; i++) glow(g, s.Py.x + dx * s.Py.scale * 1.7 + (R() - 0.5) * 30, s.Py.y - 8 + (R() - 0.5) * 20, 14 * s.Py.scale, ['#ffffff', '#ffb43c', '#ffcf5a'][i % 3], 0.35); vignette(g); },
});
// f10: title moment: crane up over the canteen
registerShot('f10', { kind: '3d',
  init(T) { const h = heroSet(T, { focus: 8, aperture: 0.001, maxblur: 0.005, set: { ceiling: false } }); h.vals = crowdVals(h.set.heads.length, 9); return { stage: h.st, ...h }; },
  draw(s, t, info, T) { s.set.tick(t + 28); life(s.kabir, t, 1, { expr: 'happy' }); life(s.you, t, 2);
    cam(T, s.stage, t, info.dur, { pos: [0.4, 2.3, 7.4], look: [0, 0.9, -2.0] }, { pos: [0.0, 4.1, 8.6], look: [0, 0.4, -2.6] }); s.stage.focusOn([0, 1, -1]);
    s.Pk = proj(T, s.stage, s.kabir, 0.66); s.PH = s.set.heads.map((h) => proj(T, s.stage, [h[0], h[1] + 0.55, h[2]])); },
  overlay(g, t, info, s) { s.PH.forEach((P, i) => { if (P.y > E.H * 0.3) tag(g, P, s.vals[i], { t, seed: i, s: 1.0, kind: s.vals[i] < 7 ? 'red' : s.vals[i] < 100 ? 'amber' : 'white', a: 0.95 }); }); tag(g, s.Pk, 41, { t, s: 1.2 });
    const d = local(info, t, 'days') ?? 1.89; topBand(g, 1, 0.34);
    serif(g, 'Every number is…', E.W / 2, E.H * 0.1, { size: 46, a: ease.out(prog(t, 0.05, 0.4)) });
    bigText(g, 'HOW MANY DAYS THAT FRIENDSHIP HAS LEFT', E.W / 2, E.H * 0.19, { size: 72, a: ease.out(prog(t, d - 0.25, d + 0.1)), color: '#fff4e4' }); vignette(g); },
});
// f11: low-angle hero shot of YOU; the HUD boots up
registerShot('f11', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 2.2, aperture: 0.005 }); const set = canteen(T, st, { clear: [[1, 2.2]] }); const you = person(T, st, 'you', [1.0, 2.3], 0.25); return { stage: st, set, you }; },
  draw(s, t, info, T) { s.set.tick(t + 32); life(s.you, t, 3, { expr: t < 0.9 ? 'determined' : 'smug', look: [0.1, -0.1], armL: 0.2, armR: 0.2 + 0.4 * ease.out(prog(t, 1.0, 1.5)), reachR: 0.5 * ease.out(prog(t, 1.0, 1.5)) });
    cam(T, s.stage, t, info.dur, { pos: [1.7, 0.75, 4.4], look: [1.0, 1.65, 2.3] }, { pos: [1.5, 0.85, 4.0], look: [1.0, 1.7, 2.3] }); s.stage.focusOn(s.you.userData.head); },
  overlay(g, t, info, s) { const k = prog(t, 0.8, 1.4); hud(g, t, { a: k < 1 ? (Math.sin(t * 60) > 0 ? k : k * 0.3) : 1 }); vignette(g); },
});
// f12: fake friend texting "bro send notes?": amber 12
registerShot('f12', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 2.0, aperture: 0.005 }); const set = canteen(T, st, { clear: [[-1.6, 3.2]] }); const f = faceTo(person(T, st, 'fake', [-1.6, 3.2]), 0.2, 6.0);
    const ph = T.box(0.08, 0.15, 0.012, T.mat('#14141c'), 0, -0.47, 0.06); f.userData.arms[1].add(ph); return { stage: st, set, f }; },
  draw(s, t, info, T) { s.set.tick(t + 34); const tw = local(info, t, 'twelve') ?? 2.67;
    life(s.f, t, 1, { expr: blinkAt(t, 1) ? 'blink' : 'smug', look: [0.2, -0.3], nod: 0.1, armR: 0.35, reachR: 1.2, tilt: 0.06 });
    cam(T, s.stage, t, info.dur, { pos: [-0.1, 1.75, 6.0], look: [-1.6, 1.8, 3.2] }, { pos: [-0.4, 1.75, 5.6], look: [-1.6, 1.82, 3.2] }); s.stage.focusOn(s.f.userData.head); s.P = proj(T, s.stage, s.f, 0.66); s.Ph = proj(T, s.stage, s.f.userData.arms[1], -0.5); },
  overlay(g, t, info, s) { const tw = local(info, t, 'twelve') ?? 2.67, tx = local(info, t, 'texts') ?? 1.4;
    chat(g, s.P.x + 330, s.P.y + 180, 'bro... send notes?', ease.out(prog(t, tx - 0.1, tx + 0.15)), { left: true, size: 30 }); chat(g, s.P.x + 330, s.P.y + 270, 'urgent!!', ease.out(prog(t, tx + 0.5, tx + 0.7)), { left: true, size: 26, bg: 'rgba(255,200,150,.95)' });
    if (t > tw - 0.05) tag(g, s.P, 12, { t, pop: t - tw, kind: 'amber', sub: 'DAYS' }); hud(g, t); vignette(g); },
});
// f13: YOU ignores the text; he walks off into the corridor, his tag counts down and pops
registerShot('f13', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 4, aperture: 0.003 }); const set = canteen(T, st, { clear: [[-1.6, 3.2]] }); const f = person(T, st, 'fake', [-1.2, 3.0], Math.PI); const you = person(T, st, 'you', [1.3, 1.6], -0.6);
    const ph = T.box(0.08, 0.15, 0.012, T.mat('#14141c'), 0, -0.47, 0.06); you.userData.arms[1].add(ph); return { stage: st, set, f, you }; },
  draw(s, t, info, T) { s.set.tick(t + 38); const dis = local(info, t, 'disappears') ?? 3.06, w = t * 6.5;
    s.f.position.set(-1.2 - t * 0.25, 0, 3.0 + t * 0.85); const k = 1 - ease.in(prog(t, dis, dis + 0.25)); s.f.scale.setScalar(Math.max(0.001, k)); s.f.visible = k > 0.01;
    life(s.f, t, 2, { expr: 'smug', walk: w, stride: 0.5 }); life(s.you, t, 3, { expr: t < 1.2 ? 'neutral' : 'smug', look: [-0.5, 0.2], armR: 0.3, reachR: 1.1 - 0.9 * ease.inOut(prog(t, 0.6, 1.1)) });
    cam(T, s.stage, t, info.dur, { pos: [2.4, 1.7, -0.9], look: [-0.6, 1.3, 3.6] }, { pos: [2.1, 1.75, -0.6], look: [-1.4, 1.3, 5.2] }); s.stage.focusOn(s.f.visible ? s.f.userData.head : [-2, 1.4, 6]); s.P = proj(T, s.stage, s.f, 0.66); s.Pf = proj(T, s.stage, [s.f.position.x, 1.0, s.f.position.z]); },
  overlay(g, t, info, s) { const dis = local(info, t, 'disappears') ?? 3.06, v = roll(t, 0.6, dis, 12, 0);
    if (t < dis) tag(g, s.P, v, { t, kind: v < 7 ? 'red' : 'amber', pop: (t * 4) % 1 });
    if (t > dis) { const k = prog(t, dis, dis + 0.8); for (let i = 0; i < 18; i++) { const a = i * 0.35, r = 30 + 160 * ease.out(k); circle(g, s.Pf.x + Math.cos(a) * r, s.Pf.y - 120 + Math.sin(a) * r * 0.7, 5 * (1 - k), alpha('#ffb060', 1 - k)); } glow(g, s.Pf.x, s.Pf.y - 120, 120 * (1 - k), '#ffb060', 0.4 * (1 - k)); }
    hud(g, t); vignette(g); },
});
