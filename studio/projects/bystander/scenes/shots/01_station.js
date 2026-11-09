// shots/01_station.js: every 3D shot in the subway station.
import { E, V, registerShot, mood, ease, prog, clamp, lerp, wordTime, glow, alpha, text, S, veil } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { buildStation, setFallen, lookAtFallen, FALL_AT } from '../sets/station.js';
import { word, cctv, thought } from '../sets/cine.js';
import { stat } from '../sets/stat.js';

const local = (info, t, w) => { const x = wordTime(w, info.globalT - t - 0.3); return x == null ? null : x - (info.globalT - t); };
const F = FALL_AT;
const look = (dx = 0, dy = 0.6, dz = 0) => [F[0] + dx, dy, F[2] + dz];
const station = (o = {}) => (T) => buildStation(T, o);

// b01: "A person collapses in a crowded subway station." the train rushes past, he drops
registerShot('b01', { kind: '3d', init: station({ fov: 46 }),
  draw(s, t, info, T) {
    s.train.position.x = lerp(60, -70, prog(t, 0, 2.8));
    setFallen(s.fallen, prog(t, 1.0, 1.7)); lookAtFallen(s.crowd, ease.inOut(prog(t, 1.6, 2.6)) * 0.6);
    T.dolly(s.stage.camera, t, [[0, { pos: [F[0] + 4.5, 2.2, F[2] - 4.0], look: look(0, 1.0, 1) }], [info.dur, { pos: [F[0] + 2.6, 1.5, F[2] - 2.6], look: look(0, 0.4, 0.6) }]]);
  },
  overlay(g, t) { if (t > 1.6 && t < 1.9) veil(g, '#ffffff', 0.2 * (1 - prog(t, 1.6, 1.9))); },
});
// b02: "Dozens of people see it." low angle between legs; heads turn
registerShot('b02', { kind: '3d', init: station({ fov: 40 }),
  draw(s, t, info, T) { setFallen(s.fallen, 1); lookAtFallen(s.crowd, 0.6 + 0.4 * ease.out(prog(t, 0, 0.8))); T.dolly(s.stage.camera, t, [[0, { pos: [F[0] + 2.2, 0.5, F[2] + 2.4], look: look(-2, 1.1, -2) }], [info.dur, { pos: [F[0] + 2.0, 0.55, F[2] + 2.1], look: look(-2, 1.2, -2) }]]); },
});
// b03: "So why might nobody move?" straight-down overhead: an empty ring around him
registerShot('b03', { kind: '3d', init: station({ fov: 58, ceiling: false }),
  draw(s, t, info, T) { setFallen(s.fallen, 1); lookAtFallen(s.crowd, 1); T.dolly(s.stage.camera, t, [[0, { pos: [F[0], 9.5, F[2] + 0.01], look: [F[0], 0, F[2]] }], [info.dur, { pos: [F[0], 8.0, F[2] + 0.01], look: [F[0], 0, F[2]] }]]); },
  overlay(g, t, info) {
    const a = ease.out(prog(t, 0.3, 0.8)); g.strokeStyle = alpha('#ff5a3c', 0.8 * a); g.lineWidth = 6; g.setLineDash([18, 14]); g.beginPath(); g.arc(E.W / 2, E.H / 2, V(300, 330) * (1 + 0.03 * Math.sin(t * 3)), 0, 7); g.stroke(); g.setLineDash([]);
    const n = local(info, t, 'nobody') ?? 0.8; word(g, 'NOBODY MOVES', E.H * V(0.16, 0.17), ease.out(prog(t, n, n + 0.25)), { color: '#ff7a5a' });
  },
});
// b05: "Nobody else is panicking. So it must be fine." calm faces, the social-proof bubble
registerShot('b05', { kind: '3d', init: station({ fov: 34 }),
  draw(s, t, info, T) { setFallen(s.fallen, 1); lookAtFallen(s.crowd, 0.5); T.dolly(s.stage.camera, t, [[0, { pos: [F[0] - 5, 1.7, F[2] + 4], look: [F[0] - 2, 1.4, F[2] - 1] }], [info.dur, { pos: [F[0] - 4.2, 1.7, F[2] + 3.4], look: [F[0] - 2, 1.4, F[2] - 1] }]]); },
  overlay(g, t, info) { const f = local(info, t, 'fine') ?? 1.8; thought(g, E.W * 0.32, E.H * V(0.3, 0.32), 'EVERYONE LOOKS CALM…', ease.out(prog(t, 0.3, 0.6))); thought(g, E.W * 0.66, E.H * V(0.4, 0.42), '…SO IT MUST BE FINE', ease.out(prog(t, f - 0.4, f - 0.1))); },
});
// b07: title card: slow crane up over the frozen crowd
registerShot('b07', { kind: '3d', init: station({ fov: 50, ceiling: false }),
  draw(s, t, info, T) { setFallen(s.fallen, 1); lookAtFallen(s.crowd, 1); T.orbit(s.stage.camera, t, { target: [F[0], 0.5, F[2]], radius: 8, height: [2.2, 5], from: -0.3, to: 0.3, dur: info.dur }); },
  overlay(g, t, info) { veil(g, '#05080c', 0.25); UI.titleCard(g, t, { lines: ['THE', 'BYSTANDER EFFECT'], dur: info.dur + 0.3, y: E.H * V(0.22, 0.2) }); },
});
// b13: "But here's the twist. When researchers studied real CCTV footage of public fights," the security camera view
registerShot('b13', { kind: '3d', init: station({ fov: 62 }),
  draw(s, t, info, T) { setFallen(s.fallen, 1); lookAtFallen(s.crowd, 1); const k = ease.inOut(prog(t, 1.8, 4.6)); s.red.f.position.set(lerp(s.red.x, F[0] - 0.9, k), 0, lerp(s.red.z, F[2] + 0.5, k)); s.red.f.rotation.y = Math.atan2(-(F[2] - s.red.z), F[0] - s.red.x); s.red.f.setPose(k > 0.95 ? 'kneel' : 'stand');
    T.dolly(s.stage.camera, t, [[0, { pos: [-9, 5.4, 5.5], look: [F[0], 0.2, F[2]] }], [info.dur, { pos: [-9, 5.4, 5.5], look: [F[0], 0.2, F[2]] }]]); },
  overlay(g, t, info) { cctv(g, t); const tw = local(info, t, 'twist') ?? 0.4; word(g, 'THE TWIST', E.H * V(0.3, 0.3), ease.out(prog(t, tw - 0.1, tw + 0.2)) * (1 - prog(t, 1.5, 1.8)), { color: '#ffc15a' }); const c = local(info, t, 'cctv') ?? 2.6; word(g, 'REAL CCTV FOOTAGE', E.H * V(0.3, 0.3), ease.out(prog(t, c, c + 0.2)), { size: V(70, 80), sub: 'PUBLIC FIGHTS, REAL CITIES' }); },
});
// b14: "someone stepped in about nine times out of ten." the stat over the footage
registerShot('b14', { kind: '3d', init: station({ fov: 40 }),
  draw(s, t, info, T) { setFallen(s.fallen, 1); lookAtFallen(s.crowd, 1); s.red.f.position.set(F[0] - 0.9, 0, F[2] + 0.5); s.red.f.rotation.y = 0; s.red.f.setPose('kneel'); T.dolly(s.stage.camera, t, [[0, { pos: [-5, 3.6, 4], look: [F[0], 0.3, F[2]] }], [info.dur, { pos: [-4.4, 3.2, 3.4], look: [F[0], 0.3, F[2]] }]]); },
  overlay(g, t, info) { cctv(g, t + 5); const n = local(info, t, 'nine') ?? 1.2; stat(g, { label: 'SOMEONE STEPPED IN', value: '9 IN 10', x: E.W / 2, y: E.H * V(0.3, 0.3), size: V(150, 170), color: '#ffc15a', a: ease.out(prog(t, n - 0.1, n + 0.2)), pulse: t - n }); },
});
// b15: "Crowds often do help. The danger is those frozen first few seconds." freeze-frame, the clock
registerShot('b15', { kind: '3d', init: station({ fov: 44 }),
  draw(s, t, info, T) { setFallen(s.fallen, 1); lookAtFallen(s.crowd, 1); T.orbit(s.stage.camera, t, { target: [F[0], 0.6, F[2]], radius: 6.5, height: 2.0, from: 0.5, to: 0.75, dur: info.dur }); },
  overlay(g, t, info) {
    const fr = local(info, t, 'frozen') ?? 1.5, k = ease.out(prog(t, fr - 0.2, fr + 0.2));
    if (k > 0) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = `rgba(80,140,255,${0.45 * k})`; g.fillRect(0, 0, E.W, E.H); g.restore(); FX.drops(g, t, { count: 40, color: '#dfe8ff', rMax: 6, drift: 1 }); UI.badge(g, { str: '0:0' + Math.min(3, Math.floor(prog(t, fr, info.dur) * 4)), a: k }); }
    const h = local(info, t, 'help') ?? 0.8; word(g, 'CROWDS OFTEN DO HELP', E.H * V(0.18, 0.18), ease.out(prog(t, h - 0.3, h)) * (1 - prog(t, fr - 0.4, fr - 0.15)), { size: V(70, 80), color: '#9fe8c8' });
    word(g, 'THE FIRST FEW SECONDS', E.H * V(0.18, 0.18), k, { size: V(72, 82), color: '#bcd8ff' });
  },
});
// b17: "Point at one person." POV from the floor, his arm points
registerShot('b17', { kind: '3d', init: station({ fov: 52 }),
  draw(s, t, info, T) { setFallen(s.fallen, 1); lookAtFallen(s.crowd, 1); T.dolly(s.stage.camera, t, [[0, { pos: [F[0] + 0.3, 0.5, F[2] + 0.3], look: [s.red.x, 1.3, s.red.z] }], [info.dur, { pos: [F[0] + 0.1, 0.55, F[2] + 0.25], look: [s.red.x, 1.4, s.red.z] }]]); },
  overlay(g, t) { const k = ease.out(prog(t, 0.1, 0.5)); g.save(); g.translate(E.W * 0.55, E.H * 0.95); g.rotate(-0.55); g.fillStyle = '#0a0c10'; g.fillRect(-40, -E.H * 0.42 * k, 80, E.H * 0.42 * k); g.beginPath(); g.arc(0, -E.H * 0.42 * k, 52, 0, 7); g.fill(); g.fillRect(-16, -E.H * 0.42 * k - 150, 32, 110); g.restore(); word(g, 'POINT AT ONE PERSON', E.H * V(0.16, 0.17), ease.out(prog(t, 0.2, 0.45)), { size: V(70, 80) }); },
});
// b18: "You, in the red jacket. Call an ambulance." he is singled out, everyone else dims
registerShot('b18', { kind: '3d', init: station({ fov: 32 }),
  draw(s, t, info, T) { setFallen(s.fallen, 1); lookAtFallen(s.crowd, 1); const call = (local(info, t, 'call') ?? 1.2); s.red.f.setPose(t > call ? 'phone' : 'stand'); s.red.f.rotation.y = Math.atan2(-(F[2] - s.red.z), F[0] - s.red.x);
    T.dolly(s.stage.camera, t, [[0, { pos: [s.red.x + 3.2, 1.6, s.red.z + 3.2], look: [s.red.x, 1.2, s.red.z] }], [info.dur, { pos: [s.red.x + 2.2, 1.55, s.red.z + 2.2], look: [s.red.x, 1.25, s.red.z] }]]); },
  overlay(g, t, info) { g.save(); const gr = g.createRadialGradient(E.W * 0.5, E.H * 0.48, 80, E.W * 0.5, E.H * 0.48, E.W * 0.75); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); g.restore();
    word(g, 'YOU. RED JACKET.', E.H * V(0.15, 0.16), ease.out(prog(t, 0.1, 0.35)), { color: '#ff7a5a' }); const c = local(info, t, 'call') ?? 1.2; word(g, 'CALL AN AMBULANCE', E.H * V(0.15, 0.16) + V(150, 170), ease.out(prog(t, c - 0.05, c + 0.2)), { size: V(70, 80) }); },
});
// b19: end: he kneels beside the man; the crowd finally moves in
registerShot('b19', { kind: '3d', init: station({ fov: 44, ceiling: false }),
  draw(s, t, info, T) { setFallen(s.fallen, 1); s.red.f.position.set(F[0] - 0.9, 0, F[2] + 0.5); s.red.f.rotation.y = 0; s.red.f.setPose('kneel');
    s.crowd.forEach((c, i) => { if (c.red) return; const k = ease.inOut(prog(t, 0.4 + (i % 6) * 0.15, 2.4 + (i % 6) * 0.15)) * 0.35; c.f.position.set(lerp(c.x, F[0], k), 0, lerp(c.z, F[2], k)); c.f.setPose(k > 0.3 && i % 4 === 0 ? 'kneel' : 'stand'); }); lookAtFallen(s.crowd, 1);
    T.orbit(s.stage.camera, t, { target: [F[0], 0.6, F[2]], radius: [5, 7], height: [2.0, 3.6], from: -0.25, to: 0.15, dur: info.dur }); },
  overlay(g, t, info) { const a = ease.out(prog(t, 0.6, 1.2)); g.save(); const gr = g.createLinearGradient(0, 0, 0, E.H * 0.38); gr.addColorStop(0, 'rgba(4,6,10,.8)'); gr.addColorStop(1, 'rgba(4,6,10,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H * 0.38); g.restore();
    text(g, 'Would you have been', E.W / 2, E.H * V(0.14, 0.15), { size: V(64, 72), font: 'Playfair Display', weight: 900, italic: true, color: '#fff1dc', alpha: a, glow: 16 });
    text(g, 'the first to move?', E.W / 2, E.H * V(0.14, 0.15) + V(86, 96), { size: V(72, 80), font: 'Playfair Display', weight: 900, italic: true, color: '#ffc15a', alpha: a, glow: 16 });
    word(g, 'TELL ME IN THE COMMENTS', E.H * V(0.86, 0.8), ease.out(prog(t, 2.4, 2.8)), { size: V(48, 56) }); },
});
