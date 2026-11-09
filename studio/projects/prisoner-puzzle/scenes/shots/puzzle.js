// shots/puzzle.js: "The Prisoner Puzzle Nobody Solves in 60 Seconds" (9:16 Short).
import { E, V, registerShot, text, alpha, rr, ease, clamp, lerp, prog, wordTime } from '/engine/core.js';
import { cellBlock, prisoner, guard, hat, clock, hatIcon, card, cross, grade, PZ, WALLZ, RED, AMBER } from '../sets/prison.js';
import { local, cam } from '../sets/fc.js';

let TZ = null; const tz = () => (TZ ??= (wordTime("time's", 20) ?? wordTime('time', 20) ?? 38));
const C = (pos, look, fov) => ({ pos, look, ...(fov ? { fov } : {}) });
const move = (T, s, t, info, a, b, e = ease.inOut) => cam(T, s.stage, t, info.dur, a, b, e);
const blink = (t, seed) => ((t + seed * 1.37) % 3.1) < 0.12;
const act = (p, t, seed, o = {}) => p.set({ breathe: t + seed, ...o, expr: blink(t, seed) && !['laugh', 'happy', 'proud'].includes(o.expr) ? 'blink' : (o.expr || 'neutral') });
const clockOver = (g, t, info, o = {}) => { const gt = info.globalT; if (gt > tz() + 2.2) return; clock(g, gt, tz(), { a: o.a ?? 1, s: o.s ?? 1, y: o.y }); };
// the whole line-up, reused by most shots
function lineup(T, o = {}) { const B = cellBlock(T, o); const P = { 1: prisoner(T, B.stage, 1, { hat: o.h1 }), 2: prisoner(T, B.stage, 2, { hat: o.h2 }), 3: prisoner(T, B.stage, 3, { hat: o.h3 }) }; if (o.guard) B.g = guard(T, B.stage, o.guard, o.guardR ?? 0); return { ...B, P }; }

// q01: HOOK: five hats on a steel table under one hard light; text pops "3 PRISONERS · 5 HATS"
registerShot('q01', { kind: '3d',
  init(T) { const B = cellBlock(T, { focus: 1.4, aperture: 0.006 }); const st = B.stage; st.add(T.box(1.6, 0.06, 0.8, T.mat('#7a7e86', { metalness: 0.7, roughness: 0.35 }), 0, 0.9, 0.9)); for (const [x, z] of [[-0.6, 0.8], [0.6, 0.8], [-0.6, 1.0], [0.6, 1.0]]) st.add(T.cyl(0.03, 0.03, 0.9, T.mat('#4a4e56', { metalness: 0.7 }), x, 0.45, z));
    const hats = ['white', 'white', 'white', 'black', 'black'].map((s, i) => { const h = hat(T, { state: s }); h.position.set(-0.56 + i * 0.28, 0.93, 0.9 + (i % 2) * 0.12); h.scale.setScalar(0.62); st.add(h); return h; }); return { ...B, hats }; },
  draw(s, t, info, T) { s.tick(t); s.hats.forEach((h, i) => (h.position.y = 0.93 + Math.max(0, 0.25 * (1 - ease.out(clamp((t - 0.25 - i * 0.12) / 0.35)))))); move(T, s, t, info, C([0.0, 2.1, 3.9], [0, 1.05, 0.9]), C([0.0, 1.95, 3.4], [0, 1.0, 0.9])); s.stage.focusOn([0, 1.0, 0.9]); },
  overlay(g, t, info) { const a = ease.out(prog(t, 0.05, 0.3)); text(g, '3 PRISONERS', E.W / 2, V(250, 470), { size: V(70, 104), font: 'Fredoka', weight: 700, color: '#ffffff', alpha: a, glow: 18, glowColor: 'rgba(0,0,0,.8)' });
    const b = ease.out(prog(t, 0.7, 1.0)); text(g, '5 HATS', E.W / 2, V(340, 600), { size: V(70, 104), font: 'Fredoka', weight: 700, color: AMBER, alpha: b, glow: 18, glowColor: 'rgba(0,0,0,.8)' });
    const c = ease.out(prog(t, local(info, t, 'Three', 0.6) ?? 1.6, (local(info, t, 'Three', 0.6) ?? 1.6) + 0.3)); text(g, '3 WHITE  ·  2 BLACK', E.W / 2, V(420, 715), { size: V(36, 50), font: 'Nunito', weight: 900, color: '#e8e8f0', alpha: c, spacing: 4 }); clockOver(g, t, info); grade(g); },
});
// q02: walk free (door opens to light) / or don't (slams, red)
registerShot('q02', { kind: '3d',
  init(T) { const B = cellBlock(T, { focus: 3, aperture: 0.002 }); const st = B.stage; const { THREE } = T;
    const door = T.box(1.4, 2.6, 0.12, T.mat('#5a5e66', { metalness: 0.8, roughness: 0.4 }), 0, 1.3, WALLZ + 0.05); st.add(door); for (let i = 0; i < 6; i++) st.add(T.box(0.04, 2.5, 0.04, T.mat('#2a2c30'), -0.5 + i * 0.2, 1.3, WALLZ + 0.14));
    const out = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 2.56), new THREE.MeshBasicMaterial({ color: '#fff4d8' })); out.position.set(0, 1.3, WALLZ - 0.02); st.add(out);
    const p = prisoner(T, st, 1, {}); p.position.set(0, 0, 1.6); return { ...B, door, out, p }; },
  draw(s, t, info, T) { s.tick(t); const w = local(info, t, 'wrong') ?? 1.8; const open = t < w ? ease.out(clamp((t - 0.2) / 0.8)) : 1 - ease.in(clamp((t - w) / 0.18)); s.door.position.x = open * 1.35; s.door.rotation.y = 0; s.out.material.color.set(t < w ? '#fff4d8' : '#ff3b2a');
    act(s.p, t, 1, { expr: t < w ? 'awe' : 'shock' }); move(T, s, t, info, C([0.7, 2.3, 6.4], [0, 1.4, WALLZ]), C([0.6, 2.2, 5.6], [0, 1.4, WALLZ])); },
  overlay(g, t, info) { const w = local(info, t, 'wrong') ?? 1.8; const f = clamp(1 - (t - w) / 0.25); if (t > w && f > 0) { g.fillStyle = `rgba(255,40,30,${0.35 * f})`; g.fillRect(0, 0, E.W, E.H); } clockOver(g, t, info); grade(g, { red: t > w ? 0.25 : 0 }); },
});
// q03: the guard lines them up, facing the wall; flashlight sweeps
registerShot('q03', { kind: '3d',
  init(T) { return lineup(T, { guard: [1.3, 0, 1.0], guardR: -1.6, focus: 3.5, aperture: 0.002 }); },
  draw(s, t, info, T) { s.tick(t); [1, 2, 3].forEach((n) => act(s.P[n], t, n, { expr: n === 1 ? 'nervous' : 'worried' })); s.g.set({ armR: 0.6 + 0.2 * Math.sin(t * 1.5), reachR: 1.0, expr: 'suspicious' }); move(T, s, t, info, C([1.6, 3.0, 7.0], [0, 1.3, 0.8], 45), C([1.3, 2.8, 6.3], [0, 1.3, 0.8], 45)); },
  overlay(g, t, info) { clockOver(g, t, info); grade(g); },
});
// q04: a hat lowers onto a head (insert from above-front)
registerShot('q04', { kind: '3d',
  init(T) { return lineup(T, { focus: 1.2, aperture: 0.006 }); },
  draw(s, t, info, T) { s.tick(t); const h = s.P[1].userData.hat; h.position.y = 0.2 + 0.7 * (1 - ease.out(clamp((t - 0.1) / 0.6))); [1, 2, 3].forEach((n) => act(s.P[n], t, n, { expr: 'worried', look: [0, 0.4] })); move(T, s, t, info, C([0.25, 2.0, -1.1], [0, 2.2, 0.3], 72), C([0.2, 1.95, -1.05], [0, 2.2, 0.3], 72)); s.stage.focusOn(s.P[1].userData.head); },
  overlay(g, t, info) { clockOver(g, t, info); grade(g); },
});
// q05: prisoner three's POV: over his shoulder, two mystery hats ahead
registerShot('q05', { kind: '3d',
  init(T) { return lineup(T, { focus: 1.6, aperture: 0.004 }); },
  draw(s, t, info, T) { s.tick(t); [1, 2].forEach((n) => act(s.P[n], t, n, { expr: 'worried' })); act(s.P[3], t, 3, { expr: 'suspicious' }); move(T, s, t, info, C([0.6, 2.55, PZ[3] + 1.5], [0, 1.7, PZ[1]], 42), C([0.5, 2.5, PZ[3] + 1.3], [0, 1.7, PZ[1]], 42)); s.stage.focusOn(s.P[2].userData.head); },
  overlay(g, t, info) { const a = ease.out(prog(t, 0.3, 0.6)); text(g, 'PRISONER #3 SEES 2 HATS', E.W / 2, V(250, 470), { size: V(34, 46), font: 'Nunito', weight: 900, color: '#ffffff', alpha: a, spacing: 2, glow: 12, glowColor: 'rgba(0,0,0,.8)' }); clockOver(g, t, info); grade(g); },
});
// q06: CU prisoner three, jaw tight: silent
registerShot('q06', { kind: '3d',
  init(T) { return lineup(T, { focus: 1.0, aperture: 0.008 }); },
  draw(s, t, info, T) { s.tick(t); act(s.P[3], t, 3, { expr: 'determined', look: [0.15, 0] }); move(T, s, t, info, C([0.4, 1.8, PZ[3] - 1.1], [0, 1.75, PZ[3]], 56), C([0.35, 1.8, PZ[3] - 1.0], [0, 1.76, PZ[3]], 50)); s.stage.focusOn(s.P[3].userData.head); },
  overlay(g, t, info) { const a = ease.out(prog(t, 0.4, 0.7)); text(g, '…SILENT', E.W / 2, V(250, 470), { size: V(48, 64), font: 'Fredoka', weight: 700, color: AMBER, alpha: a, glow: 14, glowColor: 'rgba(0,0,0,.8)' }); clockOver(g, t, info); grade(g); },
});
// q07: prisoner two's POV + CU sweating
registerShot('q07', { kind: '3d',
  init(T) { return lineup(T, { focus: 1.2, aperture: 0.005 }); },
  draw(s, t, info, T) { s.tick(t); act(s.P[1], t, 1, { expr: 'worried' }); act(s.P[2], t, 2, { expr: 'nervous' }); const k = t < info.dur * 0.55; move(T, s, t, info, k ? C([0.55, 2.5, PZ[2] + 1.4], [0, 1.7, PZ[1]], 42) : C([0.4, 1.8, PZ[2] - 1.0], [0, 1.75, PZ[2]], 50), k ? C([0.5, 2.45, PZ[2] + 1.25], [0, 1.7, PZ[1]], 42) : C([0.35, 1.8, PZ[2] - 0.9], [0, 1.76, PZ[2]], 50)); s.stage.focusOn(k ? s.P[1].userData.head : s.P[2].userData.head); },
  overlay(g, t, info) { const k = t < info.dur * 0.55; const a = ease.out(prog(t, 0.3, 0.6)); text(g, k ? 'PRISONER #2 SEES 1 HAT' : '…SILENT TOO', E.W / 2, V(250, 470), { size: V(34, 50), font: k ? 'Nunito' : 'Fredoka', weight: 900, color: k ? '#ffffff' : AMBER, alpha: a, spacing: k ? 2 : 0, glow: 12, glowColor: 'rgba(0,0,0,.8)' }); clockOver(g, t, info); grade(g); },
});
// q08: prisoner one: nothing but the wall (camera between wall and his face)
registerShot('q08', { kind: '3d',
  init(T) { return lineup(T, { focus: 0.9, aperture: 0.008 }); },
  draw(s, t, info, T) { s.tick(t); s.P[1].userData.hat.set('mystery', 0); act(s.P[1], t, 1, { expr: 'nervous', look: [0, 0] }); move(T, s, t, info, C([0.0, 1.75, -1.05], [0, 2.02, 0], 74), C([0.0, 1.75, -1.0], [0, 2.02, 0], 74)); s.stage.focusOn(s.P[1].userData.head); },
  overlay(g, t, info) { const a = ease.out(prog(t, 0.3, 0.6)); text(g, 'PRISONER #1 SEES… NOTHING', E.W / 2, V(250, 470), { size: V(34, 46), font: 'Nunito', weight: 900, color: '#ffffff', alpha: a, spacing: 2, glow: 12, glowColor: 'rgba(0,0,0,.8)' }); clockOver(g, t, info); grade(g); },
});
// q09: and yet he answers: the spotlight snaps on him, low angle, his eyes open
registerShot('q09', { kind: '3d',
  init(T) { return lineup(T, { focus: 1.4, aperture: 0.005, flicker: true }); },
  draw(s, t, info, T) { s.tick(t); const r = local(info, t, 'right') ?? 2; act(s.P[1], t, 1, { expr: t > r ? 'smirk' : 'determined' }); act(s.P[2], t, 2, { expr: 'surprised' }); act(s.P[3], t, 3, { expr: 'surprised' }); move(T, s, t, info, C([-0.7, 0.9, -1.05], [0, 2.05, 0.6], 66), C([-0.6, 1.0, -1.0], [0, 2.05, 0.6], 66)); s.stage.focusOn(s.P[1].userData.head); },
  overlay(g, t, info) { clockOver(g, t, info); grade(g); },
});
// q10: THE QUESTION + think time: big clock centre, P1 with a ? hat, WHITE or BLACK
registerShot('q10', { kind: '3d',
  init(T) { return lineup(T, { focus: 1.3, aperture: 0.007, mood: 'red', flicker: true }); },
  draw(s, t, info, T) { s.tick(t); s.P[1].userData.hat.set('mystery', 0); act(s.P[1], t, 1, { expr: 'nervous' }); move(T, s, t, info, C([0.0, 1.8, -1.1], [0, 2.12, 0.3], 76), C([0.0, 1.8, -1.05], [0, 2.12, 0.3], 76)); s.stage.focusOn(s.P[1].userData.hat); },
  overlay(g, t, info) { const a = ease.out(prog(t, 0.1, 0.4)); text(g, 'WHAT COLOR IS HIS HAT?', E.W / 2, V(250, 470), { size: V(42, 60), font: 'Fredoka', weight: 700, color: '#ffffff', alpha: a, glow: 16, glowColor: 'rgba(0,0,0,.85)' });
    hatIcon(g, E.W / 2 - V(170, 190), V(860, 640), V(1.2, 1.3), 'white', a); hatIcon(g, E.W / 2 + V(170, 190), V(860, 640), V(1.2, 1.3), 'black', a); text(g, 'OR', E.W / 2, V(850, 628), { size: V(40, 52), font: 'Fredoka', weight: 700, color: AMBER, alpha: a });
    clock(g, info.globalT, tz(), { y: V(150, 300), s: V(1.0, 1.25) }); grade(g, { red: 0.12 + 0.08 * Math.sin(t * 6) }); },
});
// q11: time's up: the hat turns WHITE in a flash; he walks free
registerShot('q11', { kind: '3d',
  init(T) { return lineup(T, { focus: 1.2, aperture: 0.006 }); },
  draw(s, t, info, T) { s.tick(t); const w = local(info, t, 'white') ?? 1.2; s.P[1].userData.hat.set(t > w ? 'white' : 'mystery'); act(s.P[1], t, 1, { expr: t > w + 0.2 ? 'proud' : 'nervous' }); move(T, s, t, info, C([0.35, 1.8, -1.1], [0, 2.12, 0.2], 74), C([0.3, 1.8, -1.05], [0, 2.12, 0.2], 74)); s.stage.focusOn(s.P[1].userData.hat); },
  overlay(g, t, info) { const w = local(info, t, 'white') ?? 1.2; if (t < w) clockOver(g, t, info); if (t > w) { const f = clamp(1 - (t - w) / 0.35); g.fillStyle = `rgba(255,255,255,${0.75 * f})`; g.fillRect(0, 0, E.W, E.H); const a = ease.out(prog(t, w, w + 0.3)); text(g, 'WHITE', E.W / 2, V(300, 300), { size: V(110, 150), font: 'Fredoka', weight: 700, color: '#ffffff', alpha: a, glow: 24, glowColor: 'rgba(255,255,255,.6)' }); } grade(g); },
});
// q12: logic card 1: prisoner three's silence
registerShot('q12', { kind: '3d',
  init(T) { return lineup(T, { focus: 3, aperture: 0.01, h1: 'white' }); },
  draw(s, t, info, T) { s.tick(t); [1, 2, 3].forEach((n) => act(s.P[n], t, n)); move(T, s, t, info, C([1.5, 2.2, 6.5], [0, 2.5, 1], 45), C([1.3, 2.1, 6.0], [0, 2.5, 1], 45)); },
  overlay(g, t, info) { const sl = local(info, t, 'stayed') ?? 2.4, so = local(info, t, 'least') ?? 3.4;
    card(g, ease.out(prog(t, 0, 0.3)), (g, x, y, w, h) => { text(g, 'IF #3 SAW…', x + w / 2, y + V(70, 90), { size: V(40, 54), font: 'Fredoka', weight: 700, color: '#ffffff' });
      hatIcon(g, x + w / 2 - V(110, 130), y + V(220, 280), V(1.2, 1.5), 'black'); hatIcon(g, x + w / 2 + V(110, 130), y + V(220, 280), V(1.2, 1.5), 'black');
      text(g, '…he’d KNOW his was white', x + w / 2, y + V(330, 420), { size: V(34, 44), font: 'Nunito', weight: 900, color: AMBER });
      const k = ease.out(prog(t, sl, sl + 0.3)); cross(g, x + w / 2, y + V(200, 255), V(150, 190), k); text(g, 'HE STAYED SILENT', x + w / 2, y + V(410, 530), { size: V(36, 48), font: 'Fredoka', weight: 700, color: RED, alpha: k });
      const m = ease.out(prog(t, so, so + 0.3)); text(g, '→ at least one WHITE in front', x + w / 2, y + V(490, 650), { size: V(32, 42), font: 'Nunito', weight: 900, color: '#ffffff', alpha: m }); }); },
});
// q13: logic card 2: prisoner two's silence
registerShot('q13', { kind: '3d',
  init(T) { return lineup(T, { focus: 3, aperture: 0.01, h1: 'white' }); },
  draw(s, t, info, T) { s.tick(t); [1, 2, 3].forEach((n) => act(s.P[n], t, n)); move(T, s, t, info, C([-1.5, 2.2, 6.5], [0, 2.5, 1], 45), C([-1.3, 2.1, 6.0], [0, 2.5, 1], 45)); },
  overlay(g, t, info) { const sl = local(info, t, 'But') ?? 3.0;
    card(g, ease.out(prog(t, 0, 0.3)), (g, x, y, w, h) => { text(g, '#2 KNOWS THAT TOO', x + w / 2, y + V(70, 90), { size: V(40, 54), font: 'Fredoka', weight: 700, color: '#ffffff' });
      text(g, 'IF #1 =', x + w / 2 - V(120, 140), y + V(210, 270), { size: V(38, 50), font: 'Nunito', weight: 900, color: '#e8e8f0' }); hatIcon(g, x + w / 2 + V(80, 100), y + V(225, 290), V(1.1, 1.4), 'black');
      text(g, '…#2 would know he’s white', x + w / 2, y + V(330, 420), { size: V(34, 44), font: 'Nunito', weight: 900, color: AMBER });
      const k = ease.out(prog(t, sl, sl + 0.3)); cross(g, x + w / 2 + V(80, 100), y + V(205, 265), V(70, 90), k); text(g, 'HE STAYED SILENT TOO', x + w / 2, y + V(420, 540), { size: V(36, 46), font: 'Fredoka', weight: 700, color: RED, alpha: k }); }); },
});
// q14: so his hat is white: the door opens, light floods, he walks out
registerShot('q14', { kind: '3d',
  init(T) { const B = lineup(T, { focus: 2.5, aperture: 0.004, h1: 'white' }); const { THREE } = T; const out = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 2.56), new THREE.MeshBasicMaterial({ color: '#fff4d8' })); out.position.set(0, 1.3, WALLZ - 0.02); B.stage.add(out); B.door = T.box(1.4, 2.6, 0.12, T.mat('#5a5e66', { metalness: 0.8 }), 0, 1.3, WALLZ + 0.05); B.stage.add(B.door); B.L = new THREE.PointLight('#fff0d0', 0, 8, 2); B.L.position.set(0, 1.5, WALLZ + 0.5); B.stage.add(B.L); return B; },
  draw(s, t, info, T) { s.tick(t); const w = local(info, t, 'white') ?? 1.6; const o = ease.inOut(clamp((t - w) / 0.8)); s.door.position.x = o * 1.35; s.L.intensity = 6 * o; act(s.P[1], t, 1, { expr: 'happy', walk: t > w + 0.6 ? t * 5 : undefined, stride: 0.35 }); if (t > w + 0.6) s.P[1].position.z = -Math.min(1.0, (t - w - 0.6) * 0.6);
    [2, 3].forEach((n) => act(s.P[n], t, n, { expr: 'shock' })); move(T, s, t, info, C([-1.3, 2.6, 4.6], [0, 1.2, WALLZ], 42), C([-1.1, 2.4, 4.0], [0, 1.2, WALLZ], 42)); },
  overlay(g, t) { grade(g, { v: 0.45 }); },
});
// q15: END: the silence was the clue + comment CTA (clock frozen at 0:00)
registerShot('q15', { kind: '3d',
  init(T) { return lineup(T, { focus: 3.5, aperture: 0.003, h1: 'white', h2: 'black', h3: 'white' }); },
  draw(s, t, info, T) { s.tick(t); [1, 2, 3].forEach((n) => act(s.P[n], t, n, { expr: n === 1 ? 'proud' : 'neutral' })); move(T, s, t, info, C([1.4, 3.0, 6.8], [0, 1.4, 0.8], 45), C([1.8, 3.5, 7.8], [0, 1.4, 0.8], 45), ease.linear); },
  overlay(g, t, info) { const a = ease.out(prog(t, 0.1, 0.4)); text(g, 'THE SILENCE', E.W / 2, V(250, 470), { size: V(72, 100), font: 'Fredoka', weight: 700, color: '#ffffff', alpha: a, glow: 18, glowColor: 'rgba(0,0,0,.85)' }); text(g, 'WAS THE CLUE', E.W / 2, V(340, 590), { size: V(72, 100), font: 'Fredoka', weight: 700, color: AMBER, alpha: a, glow: 18, glowColor: 'rgba(0,0,0,.85)' });
    const c = local(info, t, 'Comment') ?? 1.6; const b = ease.out(prog(t, c, c + 0.3)); text(g, 'Did you beat the clock? 👇', E.W / 2, V(430, 720), { size: V(40, 52), font: 'Nunito', weight: 900, color: '#ffffff', alpha: b }); grade(g); },
});
