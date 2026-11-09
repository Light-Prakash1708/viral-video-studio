// shots/08_v3.js: v3 rebuilds. Storytelling terrace (3D grandfather + kid) replaces the clay room; the Pushpak Vimaan as a
// golden swan-palace with a lotus rotor (sunset flight + over Lanka); a golden-hour finale with the Pushpak and YES / NO.
import { E, registerShot, ease, prog, clamp, lerp, glow, alpha, text, veil, rr } from '/engine/core.js';
import { storyTerrace } from '../sets/terrace.js';
import { pushpak, sunsetWorld } from '../sets/pushpak.js';
import { buildLanka } from '../sets/lanka.js';
import { local, topBand, headline } from '../sets/ui.js';
import { stat } from '../sets/stat.js';

const atc = (info, t, w, fb) => { const x = local(info, t, w); return x == null || x < -0.2 || x > info.dur ? fb : x; };
const cine = (g, k = 1) => { const vg = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.4, E.W / 2, E.H / 2, E.W * 0.72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${0.5 * k})`); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H); };
const serif = (g, str, x, y, a, o = {}) => text(g, str, x, y, { align: o.align || 'center', size: o.size || 72, font: 'Playfair Display', weight: 900, italic: true, color: o.color || '#fff2d8', alpha: a, glow: 6, glowColor: 'rgba(0,0,0,.85)', spacing: 2 });
const V3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));

// ---- d01-d05: the storytelling terrace. The kid asks (ASKER lines), grandfather listens and reacts.
const terrace = (id, o) => registerShot(id, { kind: '3d',
  init: (T) => storyTerrace(T, { era: o.era || 'dusk' }),
  draw(s, t, info) { const k = ease.inOut(clamp(t / info.dur)); s.update(t + (o.seed || 0)); const end = atc(info, t, o.last, o.fb ?? info.dur * 0.7) + 0.35;
    s.act(t, { ...o.act, talk0: 0.08, talk1: end, kidSwitch: end + 0.15, daduSwitch: o.act.daduSwitch ?? end + 0.2 });
    s.cam(V3(o.c0, o.c1, k), V3(o.l0, o.l1 || o.l0, k)); },
  overlay(g) { cine(g, 0.7); },
});
terrace('d01', { last: 'won', fb: 1.2, c0: [0.2, 1.2, 4.1], c1: [0, 1.12, 3.5], l0: [0, 0.95, -1], act: { kid: 'shock', kid2: 'surprised', dadu: 'smug', daduNod: true } });
terrace('d02', { last: 'villain', fb: 2.4, c0: [0.55, 1.25, 4.1], c1: [0.4, 1.2, 3.7], l0: [-0.25, 1.0, -1], act: { kid: 'suspicious', kid2: 'suspicious', dadu: 'happy', daduGesture: true, daduSwitch: 0 } });
terrace('d03', { last: 'amazing', fb: 1.8, seed: 9, c0: [-0.5, 1.3, 4.3], c1: [-0.1, 1.2, 3.6], l0: [0.1, 1.0, -1], act: { kid: 'awe', kid2: 'happy', dadu: 'proud', daduNod: true } });
terrace('d04', { era: 'dark', last: 'catch', fb: 1.6, c0: [0, 1.25, 4.3], c1: [0.25, 1.15, 3.7], l0: [0, 0.95, -1], act: { kid: 'worried', dadu: 'sad' } });
terrace('d05', { era: 'dark', last: 'bad', fb: 1.6, seed: 4, c0: [-1.6, 1.2, 3.1], c1: [-1.35, 1.15, 2.7], l0: [0.8, 1.0, 0], act: { kid: 'nervous', dadu: 'determined', daduSwitch: 0 } });

// ---- p21 "And then, the Pushpak Vimaan. In the epic, a flying chariot that moves by thought." sunset flight over temples
registerShot('p21', { kind: '3d',
  init(T) { const W = sunsetWorld(T); const p = pushpak(T, { s: 1 }); W.stage.add(p);
    const rings = []; for (let i = 0; i < 3; i++) { const r = new T.THREE.Mesh(new T.THREE.TorusGeometry(1, 0.05, 6, 64), new T.THREE.MeshBasicMaterial({ color: new T.THREE.Color('#ffe6a8'), transparent: true, opacity: 0, depthWrite: false })); W.stage.add(r); rings.push(r); }
    return { stage: W.stage, W, p, rings }; },
  draw(s, t, info) { const k = ease.inOut(clamp(t / info.dur)), x = t * 6; s.W.update(t, 1.4); s.p.update(t, { flap: 1, spin: 10 }); s.p.position.set(x, 0, 0); s.p.rotation.set(0, 0, 0.04 * Math.sin(t * 0.8));
    const a = lerp(0.95, 0.35, k), r = lerp(27, 22, k); s.stage.camera.position.set(x + Math.sin(a) * r, lerp(3, 6, k), Math.cos(a) * r); s.stage.camera.lookAt(x + 1.5, lerp(4.4, 4.0, k), 0);
    const th = atc(info, t, 'thought', info.dur * 0.75); s.rings.forEach((rg, i) => { const ph = clamp((t - th + 0.2 - i * 0.35) / 1.6); rg.position.set(x - 0.4, 4.6, 0); rg.rotation.x = Math.PI / 2; rg.scale.setScalar(0.5 + ph * 14); rg.material.opacity = ph > 0 && ph < 1 ? 0.5 * (1 - ph) : 0; }); },
  overlay(g, t, info) { const pv = atc(info, t, 'pushpak', 0.2), th = atc(info, t, 'thought', info.dur * 0.75); topBand(g, 0.75, 0.26);
    const a1 = ease.out(prog(t, pv - 0.1, pv + 0.35)) * (1 - prog(t, th - 0.9, th - 0.5)); headline(g, 'PUSHPAK VIMAAN', E.H * 0.13, a1, { size: 84, spacing: 10 });
    headline(g, 'MOVES BY THOUGHT', E.H * 0.13, ease.out(prog(t, th - 0.4, th)), { size: 76, sub: 'A FLYING PALACE THAT', spacing: 8 }); cine(g, 0.6); },
});

// ---- p23 "In this world, Lankan engineers spend two thousand years rebuilding it." the Pushpak sails over golden Lanka
registerShot('p23', { kind: '3d',
  init(T) { const L = buildLanka(T, { era: 'dusk', fov: 42, fleet: 8 }); const p = pushpak(T, { s: 2.4 }); L.stage.add(p); L.big = p; return L; },
  draw(s, t, info) { const k = ease.inOut(clamp(t / info.dur)); s.update(t + 10, { lit: 0.7, beams: 0.4, rise: 0.6 });
    const A = [130, 44, 120], B = [60, 42, 60], P = V3(A, B, t / info.dur), fx = B[0] - A[0], fz = B[2] - A[2], fl = Math.hypot(fx, fz), F = [fx / fl, fz / fl], Sd = [-F[1], F[0]];
    s.big.position.set(...P); s.big.rotation.y = Math.atan2(-F[1], F[0]); s.big.update(t, { flap: 0.45, base: 0.24, flapSpeed: 1.1, spin: 9 });
    const r = lerp(46, 40, k); s.stage.camera.position.set(P[0] - Sd[0] * r - F[0] * 34, P[1] + 12, P[2] - Sd[1] * r - F[1] * 34); s.stage.camera.lookAt(P[0] + F[0] * 26, P[1] - 4, P[2] + F[1] * 26); },
  overlay(g, t, info) { const tw = atc(info, t, 'two', 1.5); topBand(g, 0.8, 0.3); const n = Math.round(lerp(0, 2000, ease.inOut(prog(t, tw - 0.2, tw + 1.4))));
    stat(g, { label: 'YEARS OF REBUILDING', value: n.toLocaleString('en-US'), x: E.W / 2, y: E.H * 0.15, size: 88, a: ease.out(prog(t, tw - 0.4, tw)), color: '#ffe0a0', pulse: 9 }); cine(g, 0.6); },
});

// ---- g69 "So tell me. If Ravana had won, would you live in his golden Lanka?" golden hour, the Pushpak glides past the city
registerShot('g69', { kind: '3d',
  init(T) { const L = buildLanka(T, { era: 'dusk', fov: 38, fleet: 14 }); const p = pushpak(T, { s: 2.0 }); L.stage.add(p); L.big = p; return L; },
  draw(s, t, info) { const k = ease.inOut(clamp(t / info.dur)); s.update(t + 40, { lit: 0.85, beams: 0.5, rise: 0.6 });
    const P = V3([74, 28, 118], [44, 30, 131], t / info.dur); s.big.position.set(...P); s.big.rotation.y = Math.atan2(-0.4, -0.92); s.big.update(t + 3, { flap: 0.35, base: 0.14, flapSpeed: 1.1 });
    s.stage.camera.position.set(...V3([96, 26, 190], [86, 30, 176], k)); s.stage.camera.lookAt(...V3([30, 30, 40], [26, 32, 40], k)); },
  overlay(g, t, info) { const lv = atc(info, t, 'live', info.dur * 0.6); topBand(g, 0.95, 0.36);
    serif(g, 'If Ravana had won…', E.W / 2, E.H * 0.11, ease.out(prog(t, 0.25, 0.8)), { size: 66, color: '#f6ecd8' });
    serif(g, 'would you live in his golden Lanka?', E.W / 2, E.H * 0.21, ease.out(prog(t, lv - 0.25, lv + 0.3)), { size: 62, color: '#ffd27a' }); cine(g, 0.55); },
});

// ---- g70 "Comment yes, or no." the Pushpak flies into the sunset over the city; YES / NO above, title, fade
registerShot('g70', { kind: '3d',
  init(T) { const L = buildLanka(T, { era: 'dusk', fov: 40, fleet: 14 }); const p = pushpak(T, { s: 2.0 }); L.stage.add(p); L.big = p; return L; },
  draw(s, t, info) { const k = ease.inOut(clamp(t / info.dur)); s.update(t + 46, { lit: 0.85, beams: 0.5, rise: 0.6 });
    const A = [44, 30, 131], B = [-70, 22, 30], P = V3(A, B, ease.in(clamp(t / info.dur))); s.big.position.set(...P); s.big.rotation.y = Math.atan2(-(B[2] - A[2]), B[0] - A[0]); s.big.update(t + 7, { flap: 0.5, base: 0.18, flapSpeed: 1.2 });
    s.stage.camera.position.set(...V3([86, 30, 176], [150, 70, 250], k)); s.stage.camera.lookAt(...V3([26, 32, 40], [0, 24, 0], k)); },
  overlay(g, t, info) { const ys = atc(info, t, 'yes', 0.9), no = atc(info, t, 'no', 1.6); topBand(g, 0.9, 0.5);
    serif(g, 'Comment below', E.W / 2, E.H * 0.1, ease.out(prog(t, 0.1, 0.5)), { size: 54, color: '#fff0d8' });
    const btn = (x, str, col, st) => { const kk = ease.outBack(prog(t, st - 0.15, st + 0.3)), pulse = 1 + 0.04 * Math.sin((t - st) * 5) * (t > st ? 1 : 0); if (kk <= 0) return; g.save(); g.translate(x, E.H * 0.25); g.scale(kk * pulse, kk * pulse);
      rr(g, -170, -62, 340, 124, 62); g.fillStyle = 'rgba(10,8,20,.72)'; g.fill(); g.strokeStyle = col; g.lineWidth = 5; g.stroke(); text(g, str, 0, 4, { size: 72, color: col, glow: 8, glowColor: 'rgba(0,0,0,.6)', spacing: 8 }); g.restore(); };
    btn(E.W * 0.36, 'YES', '#ffd27a', ys); btn(E.W * 0.64, 'NO', '#ff8a6a', no);
    text(g, 'WHAT IF RAVANA HAD WON?', E.W / 2, E.H * 0.37, { size: 30, font: 'Nunito', weight: 900, color: '#fff0d8', spacing: 12, alpha: ease.out(prog(t, 2.6, 3.2)) });
    cine(g, 0.55); veil(g, '#000', ease.in(prog(t, info.dur - 0.9, info.dur)) * 0.7); },
});
