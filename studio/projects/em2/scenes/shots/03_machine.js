// shots/03_machine.js: the new, readable machine shots + new 2D beats.
import { E, V, registerShot, mood, ease, prog, clamp, lerp, wordTime, glow, alpha, text, S, veil, rr, backdrop, circle, rng, seg } from '/engine/core.js';
import { POSES, drawFigure, bigFace, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { cleanStage, machine, pulseCables, showroom, plugRig } from '../sets/machine.js';
import { grid, shapes, spinShapes, island, animHeadset, person } from '../sets/dream3d.js';
import { word } from '../sets/cine.js';
import { stat } from '../sets/stat.js';
import { DREAMER, DEALER, NOZICK, FRIEND } from '../cast.js';

const local = (info, t, w) => { const x = wordTime(w, info.globalT - t - 0.3); return x == null ? null : x - (info.globalT - t); };
const voidBg = (g, t) => { backdrop(g, ['#050604', '#121410', '#1e1e16']); const R = rng(3); for (let i = 0; i < 70; i++) circle(g, R() * E.W, R() * E.H, R() * 2.2, alpha('#ffffff', 0.5 * R())); };
const rimC = (c = '#b8ff6a', d = [0.4, -1]) => ({ color: c, dir: d, w: 5 });

// n01: "Imagine your dream life." the dealer presents the glowing headset on a pedestal
registerShot('n01', { kind: '3d', init: (T) => { const st = cleanStage(T, { ambient: 1.8, key: 2.6 }); const r = showroom(T, st); const sh = shapes(T, st, { count: 12, seed: 2 }); return { stage: st, ...r, sh }; },
  draw(s, t, info, T) { animHeadset(s.hs, t); spinShapes(s.sh, t); s.dealer.setPose(t > 0.3 ? { ...POSES.explain, eF: [40, -160], hF: [72, -170] } : 'explain'); T.dolly(s.stage.camera, t, [[0, { pos: [0.3, 1.8, 8.0], look: [0.6, 1.2, 0] }], [info.dur, { pos: [0.4, 1.75, 6.6], look: [0.6, 1.25, 0] }]]); },
  overlay(g, t) { word(g, 'YOUR DREAM LIFE', E.H * V(0.16, 0.16), ease.out(prog(t, 0.1, 0.35)), { color: '#ffffff' }); },
});
// n04: "Would you plug in?" macro: the plug stops just short of the socket
registerShot('n04', { kind: '3d', init: (T) => { const st = cleanStage(T, { fov: 34, ambient: 1.8, key: 3.0 }); const p = plugRig(T, st); const sh = shapes(T, st, { count: 8, seed: 9 }); return { stage: st, p, sh }; },
  draw(s, t, info, T) { s.p.set(0.82 * ease.out(prog(t, 0, 0.7))); spinShapes(s.sh, t); T.dolly(s.stage.camera, t, [[0, { pos: [1.6, 0.7, 4.4], look: [1.4, -0.1, 0] }], [info.dur, { pos: [1.5, 0.6, 3.8], look: [1.4, -0.1, 0] }]]); },
  overlay(g, t) { word(g, 'WOULD YOU PLUG IN?', E.H * V(0.16, 0.16), ease.out(prog(t, 0.05, 0.3)), { color: '#b8ff6a' }); },
});
// n06: "You lie in a tank." side view of the pod, the lid lowers into place
registerShot('n06', { kind: '3d', init: (T) => { const st = cleanStage(T); grid(T, st, { opacity: 0.2 }); const m = machine(T, st); return { stage: st, m }; },
  draw(s, t, info, T) { const k = ease.inOut(prog(t, 0.1, 0.9)); s.m.lid.rotation.x = lerp(-1.3, 0, k); s.m.lid.position.y = 0.52 + 0.3 * (1 - k); pulseCables(s.m, t, 0); T.dolly(s.stage.camera, t, [[0, { pos: [0.6, 2.4, 4.6], look: [-0.4, 0.7, 0] }], [info.dur, { pos: [0.4, 2.1, 3.9], look: [-0.4, 0.7, 0] }]]); },
  overlay(g, t) { word(g, 'YOU LIE IN A TANK', E.H * V(0.16, 0.16), ease.out(prog(t, 0.05, 0.3)), { color: '#ffffff' }); },
});
// n07: "Wires go into your brain." the plug clicks in, spark
registerShot('n07', { kind: '3d', init: (T) => { const st = cleanStage(T, { fov: 34, ambient: 1.8, key: 3.0 }); const p = plugRig(T, st); return { stage: st, p }; },
  draw(s, t, info, T) { s.p.set(0.82 + 0.18 * ease.in(prog(t, 0.1, 0.45))); T.dolly(s.stage.camera, t, [[0, { pos: [1.5, 0.6, 4.0], look: [1.2, -0.1, 0] }], [info.dur, { pos: [1.4, 0.55, 3.5], look: [1.15, -0.1, 0] }]]); },
  overlay(g, t) { if (t > 0.45 && t < 0.7) veil(g, '#e0ffc0', 0.15 * (1 - prog(t, 0.45, 0.7))); word(g, 'CLICK.', E.H * V(0.16, 0.16), ease.outBack(prog(t, 0.45, 0.65)), { color: '#ff8a3a' }); word(g, 'WIRES INTO YOUR BRAIN', E.H * V(0.86, 0.66), ease.out(prog(t, 0.6, 0.85)), { size: V(64, 72) }); },
});
// n08: "And it feeds you any life you want." the whole machine powers up; hologram life menu
registerShot('n08', { kind: '3d', init: (T) => { const st = cleanStage(T, { ambient: 1.5 }); grid(T, st, { opacity: 0.2 }); const m = machine(T, st); const sh = shapes(T, st, { count: 10, seed: 4 }); return { stage: st, m, sh }; },
  draw(s, t, info, T) { pulseCables(s.m, t, ease.out(prog(t, 0, 0.6))); spinShapes(s.sh, t); T.orbit(s.stage.camera, t, { target: [-0.8, 1.0, -0.2], radius: [5.2, 4.4], height: [2.6, 2.3], from: 0.35, to: 0.05, dur: info.dur }); },
  overlay(g, t) { const items = ['FAMOUS AUTHOR', 'TRUE LOVE', 'CHAMPION', 'BILLIONAIRE', 'ASTRONAUT']; const x = E.W / 2, y0 = E.H * V(0.22, 0.2);
    rr(g, x - V(300, 330), y0 - V(80, 90), V(600, 660), V(560, 620), 30); g.fillStyle = 'rgba(10,40,60,.55)'; g.fill(); g.strokeStyle = 'rgba(127,240,255,.8)'; g.lineWidth = 4; g.stroke();
    text(g, 'CHOOSE YOUR LIFE', x, y0 - V(30, 34), { size: V(40, 46), font: 'Nunito', weight: 900, color: '#e0ffc0', spacing: 4 });
    items.forEach((it, i) => { const k = ease.out(prog(t, 0.15 + i * 0.15, 0.4 + i * 0.15)), sel = Math.floor(t * 3) % 5 === i; rr(g, x - V(250, 280), y0 + V(40, 44) + i * V(92, 104), V(500, 560), V(72, 82), 36); g.fillStyle = alpha(sel ? '#ff7a2a' : '#6aa04a', 0.35 * k); g.fill(); text(g, it, x, y0 + V(76, 85) + i * V(92, 104), { size: V(36, 42), font: 'Nunito', weight: 900, color: '#ffffff', alpha: k, spacing: 3 }); }); },
});
// a dream bubble above the pod; camera pulls out of the dream to reveal the machine
function bubbleReveal(kind) {
  return { kind: '3d', init: (T) => { const st = cleanStage(T, { ambient: 1.4, fog: [20, 80] }); grid(T, st, { opacity: 0.2 }); const m = machine(T, st);
      const world = new T.THREE.Group(), tmp = { add: (...o) => { o.forEach((x) => world.add(x)); return o[0]; } };
      if (kind === 'dream') { island(T, tmp, 0, 0, 0, 4, { trees: false }); island(T, tmp, -7, 3, -6, 2.5); person(T, tmp, DREAMER, 0.3, 0.6, 'cheer', -0.4, '#ffffff'); }
      else { tmp.add(T.box(6, 0.2, 6, T.mat('#6a4a38'), 0, 0, 0), T.box(6, 3, 0.2, T.mat('#a87e5a'), 0, 1.5, -3), T.box(1.8, 0.5, 0.8, T.mat('#4a3a6a'), 0, 0.35, -1.6)); const p = person(T, tmp, DREAMER, -0.3, -1.2, 'sit', 0.4, '#ffd8a0'); p.position.y = 0.6; const lamp = new T.THREE.PointLight(0xffd8a0, 4, 6, 2); lamp.position.set(1, 2.5, 0); world.add(lamp); }
      const skyM = new T.THREE.Mesh(new T.THREE.SphereGeometry(kind === 'dream' ? 14 : 8, 32, 24), new T.THREE.MeshBasicMaterial({ color: kind === 'dream' ? 0xb8a878 : 0xffd8a0, side: T.THREE.BackSide, transparent: true, opacity: 0.25 })); world.add(skyM);
      const shell = new T.THREE.Mesh(new T.THREE.SphereGeometry(kind === 'dream' ? 14 : 8, 32, 24), new T.THREE.MeshBasicMaterial({ color: 0xb8ff6a, wireframe: true, transparent: true, opacity: 0.25 })); world.add(shell);
      world.scale.setScalar(kind === 'dream' ? 0.075 : 0.13); world.position.set(-0.4, 2.15, 0); st.add(world);
      const beam = T.cyl(0.02, 0.25, 1.4, new T.THREE.MeshBasicMaterial({ color: 0xb8ff6a, transparent: true, opacity: 0.25 }), -0.68, 1.4, 0); st.add(beam);
      return { stage: st, m, world }; },
    draw(s, t, info, T) { pulseCables(s.m, t, 1); s.world.rotation.y = t * 0.25; const start = kind === 'dream' ? 0.3 : 1.2, k = ease.inOut(prog(t, start, info.dur - 0.3)); const r = lerp(0.35, 6.2, k), h = lerp(2.2, 2.9, k); s.stage.camera.position.set(-0.4 + Math.sin(0.5) * r, h, Math.cos(0.5) * r); s.stage.camera.lookAt(-0.4, lerp(2.15, 1.3, k), 0); s.stage.camera.fov = lerp(70, 44, k); s.stage.camera.updateProjectionMatrix(); },
    overlay(g, t, info) { if (kind === 'dream') { const n = local(info, t, 'never') ?? 2.0; word(g, 'FEELS 100% REAL', E.H * V(0.16, 0.16), ease.out(prog(t, 0.1, 0.35)) * (1 - prog(t, n - 0.4, n - 0.1)), { color: '#ffffff' }); word(g, "YOU'D NEVER KNOW", E.H * V(0.16, 0.16), ease.out(prog(t, n - 0.1, n + 0.2)), { color: '#b8ff6a' }); }
      else { const tw = local(info, t, 'twist') ?? 0.3; word(g, 'THE TWIST', E.H * V(0.16, 0.16), ease.out(prog(t, tw, tw + 0.2)) * (1 - prog(t, 1.3, 1.6)), { color: '#ff8a3a' }); const r2 = local(info, t, 'already') ?? 4.0; word(g, 'YOUR LIFE = THE MACHINE', E.H * V(0.16, 0.16), ease.out(prog(t, r2 - 0.5, r2 - 0.2)), { color: '#b8ff6a' }); } },
  };
}
registerShot('n12', bubbleReveal('dream'));
registerShot('n19', bubbleReveal('room'));
// n20: "Would they unplug, and wake up to a world they've never seen?" a hand grips the plug; a door of light waits
registerShot('n20', { kind: '3d', init: (T) => { const st = cleanStage(T, { fov: 36, ambient: 1.6, key: 2.6 }); const p = plugRig(T, st); const door = T.box(1.6, 3.0, 0.1, new T.THREE.MeshBasicMaterial({ color: 0xf0f8ff }), -1.5, 0.6, -6); st.add(door);
    const hand = new T.THREE.Group(), skin = T.mat('#10121c', { roughness: 0.5 }); hand.add(T.sphere(0.2, skin, 0, 0, 0)); for (let i = 0; i < 4; i++) { const f = T.cyl(0.045, 0.045, 0.22, skin, -0.05 + i * 0.0, 0.12, -0.12 + i * 0.08, 10); f.rotation.x = Math.PI / 2; hand.add(f); } hand.add(T.cyl(0.11, 0.13, 1.6, skin, 0, -0.85, 0, 12)); st.add(hand); return { stage: st, p, hand }; },
  draw(s, t, info, T) { const pull = 0.85 + 0.15 * (1 - ease.inOut(prog(t, 0.8, 2.0))) - 0.03 * Math.sin(t * 6) * prog(t, 2.0, 3.0); s.p.set(pull); s.hand.position.set(s.p.plug.position.x + 0.15, -0.05, 0.25); s.hand.rotation.z = -0.4;
    T.dolly(s.stage.camera, t, [[0, { pos: [1.9, 0.7, 3.0], look: [1.0, -0.1, -2] }], [info.dur, { pos: [1.7, 0.6, 2.4], look: [0.9, -0.1, -3] }]]); },
  overlay(g, t, info) { const u = local(info, t, 'unplug') ?? 0.4; word(g, 'UNPLUG?', E.H * V(0.16, 0.16), ease.out(prog(t, u - 0.1, u + 0.2)), { color: '#ffffff' }); const n = local(info, t, 'never') ?? 2.0; word(g, 'A WORLD YOU’VE NEVER SEEN', E.H * V(0.86, 0.66), ease.out(prog(t, n - 0.2, n + 0.1)), { size: V(58, 66), color: '#d8f0c0' }); },
});
// n21: "Many chose to stay." the plug is pushed back in; the machine hums back to life
registerShot('n21', { kind: '3d', init: (T) => { const st = cleanStage(T); grid(T, st, { opacity: 0.2 }); const m = machine(T, st); return { stage: st, m }; },
  draw(s, t, info, T) { pulseCables(s.m, t, ease.out(prog(t, 0.2, 0.8))); T.dolly(s.stage.camera, t, [[0, { pos: [-0.2, 1.8, 3.2], look: [-0.9, 0.9, 0] }], [info.dur, { pos: [-0.4, 1.7, 2.7], look: [-0.9, 0.9, 0] }]]); },
  overlay(g, t) { word(g, 'MANY CHOSE TO STAY', E.H * V(0.16, 0.16), ease.out(prog(t, 0.1, 0.35)), { color: '#b8ff6a' }); },
});
// n23: end: the dealer offers the headset straight to you
registerShot('n23', { kind: '3d', init: (T) => { const st = cleanStage(T, { ambient: 1.8, key: 2.6 }); const r = showroom(T, st); const sh = shapes(T, st, { count: 12, seed: 6 }); return { stage: st, ...r, sh }; },
  draw(s, t, info, T) { animHeadset(s.hs, t + 3); spinShapes(s.sh, t); s.me.visible = false; s.dealer.setPose({ ...POSES.explain, eF: [40, -160], hF: [72, -170] }); T.dolly(s.stage.camera, t, [[0, { pos: [0.6, 1.7, 7.4], look: [1.2, 1.25, 0] }], [info.dur, { pos: [0.7, 1.7, 6.2], look: [1.2, 1.3, 0] }]]); },
  overlay(g, t) { const a = ease.out(prog(t, 0.2, 0.7)); g.save(); const gr = g.createLinearGradient(0, 0, 0, E.H * 0.36); gr.addColorStop(0, 'rgba(4,3,14,.85)'); gr.addColorStop(1, 'rgba(4,3,14,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H * 0.36); g.restore();
    text(g, 'Would you', E.W / 2, E.H * V(0.12, 0.13), { size: V(70, 80), font: 'Playfair Display', weight: 900, italic: true, color: '#f4f0ff', alpha: a, glow: 16 });
    text(g, 'plug in?', E.W / 2, E.H * V(0.12, 0.13) + V(96, 108), { size: V(96, 106), font: 'Playfair Display', weight: 900, italic: true, color: '#b8ff6a', alpha: a, glow: 20 });
    [['YES', '#b8ff6a', -0.2], ['NO', '#ff8a3a', 0.2]].forEach(([l, c, dx], i) => { const k = ease.outBack(prog(t, 1.0 + i * 0.15, 1.3 + i * 0.15)); if (k <= 0) return; g.save(); g.translate(E.W / 2 + dx * E.W, E.H * V(0.86, 0.68)); g.scale(k, k); rr(g, -V(130, 140), -V(50, 54), V(260, 280), V(100, 108), 50); g.fillStyle = alpha(c, 0.3); g.fill(); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); text(g, l, 0, 2, { size: V(50, 56), font: 'Nunito', weight: 900, color: '#ffffff', spacing: 4 }); g.restore(); });
    text(g, 'COMMENT YOUR ANSWER', E.W / 2, E.H * V(0.86, 0.68) + V(110, 120), { size: V(34, 40), font: 'Nunito', weight: 900, color: '#e8f0ff', spacing: 4, alpha: ease.out(prog(t, 1.4, 1.8)) }); },
});

// ---------- new 2D beats ----------
// n05: "In 1974, philosopher Robert Nozick dreamed up the Experience Machine."
registerShot('n05', { draw(g, t, info) {
  voidBg(g, t); const gy = E.H * V(0.8, 0.66);
  glow(g, E.W * 0.4, gy - 300, 500, '#ffd8a0', 0.25);
  rr(g, E.W * 0.45, gy - 150, 340, 18, 6); g.fillStyle = '#2a2236'; g.fill(); rr(g, E.W * 0.58, gy - 196, 100, 46, 6); g.fillStyle = '#f4f0e6'; g.fill(); text(g, '1974', E.W * 0.58 + 50, gy - 172, { size: 22, font: 'Nunito', weight: 900, color: '#3a3040' });
  drawFigure(g, { x: E.W * 0.33, y: gy, s: V(2.0, 2.2), facing: 1, outfit: NOZICK, pose: breathe(t > 1.6 ? POSES.pointUp : POSES.think, t), expr: t > 1.6 ? 'smirk' : 'thinking', rim: rimC('#ffd8a0') });
  if (t > 1.6) FX.sparkle(g, E.W * 0.33 + V(40, 40), gy - V(420, 440), 40 * ease.outBack(prog(t, 1.6, 2.0)), '#ffe9a8');
  const n = local(info, t, 'robert') ?? 0.9; stat(g, { label: 'PHILOSOPHER ROBERT NOZICK', value: '1974', x: E.W / 2, y: E.H * V(0.14, 0.15), size: V(120, 136), color: '#ffd8a0', a: ease.out(prog(t, n - 0.2, n + 0.1)), pulse: t - n });
  const m = local(info, t, 'experience') ?? 3.4; word(g, 'THE EXPERIENCE MACHINE', E.H * V(0.33, 0.33), ease.out(prog(t, m - 0.2, m + 0.1)), { color: '#b8ff6a' });
} });
// n13: "So here's the question. Would you plug in, for life?" his face, torn
registerShot('n13', { draw(g, t, info) {
  voidBg(g, t); glow(g, E.W * 0.75, E.H * 0.5, 700, '#b8ff6a', 0.2); glow(g, E.W * 0.25, E.H * 0.5, 700, '#ff7a2a', 0.18);
  bigFace(g, E.W / 2, E.H * V(0.62, 0.58), V(300, 320) * (1 + 0.05 * t / info.dur), { outfit: DREAMER, expr: 'thinking', look: [Math.sin(t * 2.4) > 0 ? 0.8 : -0.8, -0.1], rimColor: '#b8ff6a', rimSide: 1, blink: (t % 2.4) > 2.3 });
  word(g, 'FOR LIFE?', E.H * V(0.15, 0.16), ease.out(prog(t, (local(info, t, 'life') ?? 1.9) - 0.2, (local(info, t, 'life') ?? 1.9) + 0.1)), { color: '#ffffff', size: V(100, 112) });
} });
// n14: "Most people say no. Which is weird." a crowd holds up NO signs
registerShot('n14', { draw(g, t, info) {
  voidBg(g, t); const gy = E.H * V(0.82, 0.7), M = mood('night');
  for (let i = 0; i < 9; i++) { const x = E.W * (0.08 + i * 0.105), y = gy + (i % 2) * 50, no = i !== 4, k = ease.outBack(prog(t, 0.1 + i * 0.07, 0.4 + i * 0.07));
    drawFigure(g, { x, y, s: V(0.95, 1.0), facing: i < 4 ? 1 : -1, outfit: i === 4 ? DREAMER : FRIEND[i % 3], pose: no ? { ...POSES.stand, eF: [20, -200], hF: [22, -240] } : POSES.think, expr: no ? 'determined' : 'confused', rim: rimC('#ffb070') });
    if (no && k > 0) { g.save(); g.translate(x + 5, y - V(270, 285)); g.scale(k, k); rr(g, -46, -30, 92, 60, 10); g.fillStyle = '#ff7a2a'; g.fill(); text(g, 'NO', 0, 2, { size: 34, font: 'Nunito', weight: 900, color: '#ffffff' }); g.restore(); } }
  word(g, 'MOST PEOPLE SAY NO', E.H * V(0.15, 0.16), ease.out(prog(t, 0.05, 0.3)), { color: '#ff8a3a' });
  const w = local(info, t, 'weird') ?? 1.6; word(g, 'WEIRD, RIGHT?', E.H * V(0.15, 0.16) + V(150, 160), ease.out(prog(t, w - 0.1, w + 0.15)), { size: V(70, 80) });
} });
