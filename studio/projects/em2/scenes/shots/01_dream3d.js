// shots/01_dream3d.js: the 3D shots.
import { E, V, registerShot, mood, ease, prog, clamp, lerp, wordTime, glow, alpha, text, S, veil, rr } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { stageFor, grid, shapes, spinShapes, island, headset, animHeadset, tank, person, DREAMER, LOVE, FRIEND } from '../sets/dream3d.js';
import { word } from '../sets/cine.js';
import { stat } from '../sets/stat.js';

const local = (info, t, w) => { const x = wordTime(w, info.globalT - t - 0.3); return x == null ? null : x - (info.globalT - t); };
const glitch = (g, t, k) => { if (k <= 0) return; for (let i = 0; i < 10; i++) { const y = ((i * 197 + Math.floor(t * 24) * 83) % E.H); g.drawImage(g.canvas, 0, y, g.canvas.width, 24, (Math.sin(i + t * 40) * 60) * k, y, g.canvas.width, 24); } g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(255,60,180,${0.12 * k})`; g.fillRect(8 * k, 0, E.W, E.H); g.fillStyle = `rgba(60,240,255,${0.12 * k})`; g.fillRect(-8 * k, 0, E.W, E.H); g.restore(); };

// the dream world: islands in a pastel sky
function dreamWorld(T, o = {}) {
  const st = stageFor(T, { mood: 'golden', sky: ['#5a6a5a', '#b8a878', '#f0d8a0'], fogColor: '#d8ccaa', fog: [30, 120], ambient: 1.6, key: 2.2, bloom: 0.5 });
  const isl = [island(T, st, 0, 0, 0, 4, { trees: false }), island(T, st, -9, 3, -10, 3), island(T, st, 10, 5, -14, 3.5), island(T, st, -4, 8, -24, 4), island(T, st, 14, -2, -6, 2.4)];
  const sh = shapes(T, st, { count: 20, colors: ['#ffffff', '#ffd0f0', '#d8f0c0', '#fff0c8'] });
  const me = person(T, st, DREAMER, 0.3, 0.6, o.pose || 'cheer', -0.4, '#ffffff');
  return { stage: st, isl, sh, me };
}

// e01: "You can live your dream life. Forever."
registerShot('n02', { kind: '3d', init: (T) => dreamWorld(T),
  draw(s, t, info, T) { spinShapes(s.sh, t); s.isl.forEach((g, i) => (g.position.y += Math.sin(t * 0.8 + i) * 0.003)); T.orbit(s.stage.camera, t, { target: [0, 1.4, 0], radius: [7, 12], height: [2.4, 5], from: -0.6, to: 0.25, dur: info.dur }); },
  overlay(g, t, info) { const f = local(info, t, 'forever') ?? 2.0; word(g, 'FOREVER. PERFECT.', E.H * V(0.16, 0.16), ease.out(prog(t, 0.1, 0.35)), { color: '#ffffff' }); },
});
// e02: "But none of it is real." the world glitches into wireframe
registerShot('n03', { kind: '3d', init: (T) => dreamWorld(T),
  draw(s, t, info, T) { spinShapes(s.sh, t + 3); const k = t > 0.35; s.stage.scene.traverse((o) => { if (o.material && 'wireframe' in o.material) o.material.wireframe = k; });  T.orbit(s.stage.camera, t, { target: [0, 1.4, 0], radius: 11, height: 4.5, from: 0.25, to: 0.35, dur: info.dur }); },
  overlay(g, t, info) { glitch(g, t, 1 - prog(t, 0.3, 0.9) + (t < 0.35 ? 0 : 0.2)); word(g, 'COMPLETELY FAKE', E.H * V(0.16, 0.16), ease.out(prog(t, 0.4, 0.7)), { color: '#ff8a3a', size: V(80, 92) }); },
});
// a dark room with the dreamer seated and the headset floating in front of him
function room(T, o = {}) {
  const st = stageFor(T, { mood: 'interiorCool', sky: ['#05060f', '#0a0c20'], fogColor: '#05060f', fog: [6, 30], ambient: 1.2, key: 1.4, bloom: 0.7 });
  grid(T, st, { opacity: 0.25 });
  st.add(T.box(1.2, 0.5, 1.2, T.mat('#1a1e38'), 0, 0.25, 0), T.box(1.2, 1.4, 0.2, T.mat('#1a1e38'), -0.55, 1.0, 0));
  const me = person(T, st, DREAMER, -0.2, 0, o.pose || 'sit', 0, '#b8ff6a'); me.position.y = 0.5;
  const hs = headset(T, st, { pos: [1.3, 1.65, 0] });
  const sh = shapes(T, st, { count: 10, seed: 8 });
  return { stage: st, me, hs, sh };
}
// e03: "Would you plug in?"
registerShot('old_e03', { kind: '3d', init: (T) => room(T),
  draw(s, t, info, T) { animHeadset(s.hs, t); spinShapes(s.sh, t); T.dolly(s.stage.camera, t, [[0, { pos: [3.6, 1.8, 3.2], look: [0.6, 1.4, 0] }], [info.dur, { pos: [3.0, 1.75, 2.4], look: [0.8, 1.45, 0] }]]); },
  overlay(g, t) { word(g, 'WOULD YOU PLUG IN?', E.H * V(0.16, 0.16), ease.out(prog(t, 0.3, 0.6)), { color: '#b8ff6a' }); },
});
// e04: "In 1974, the philosopher Robert Nozick imagined a machine." title over the slowly turning headset
registerShot('old_e04', { kind: '3d', init: (T) => room(T),
  draw(s, t, info, T) { animHeadset(s.hs, t + 2); spinShapes(s.sh, t); T.orbit(s.stage.camera, t, { target: [0.8, 1.5, 0], radius: [4.0, 3.2], height: [2.0, 1.8], from: -0.3, to: 0.4, dur: info.dur }); },
  overlay(g, t, info) { UI.titleCard(g, t, { lines: ['THE', 'EXPERIENCE MACHINE'], dur: info.dur + 0.3, y: E.H * V(0.18, 0.17) }); const n = local(info, t, 'robert') ?? 1.8; stat(g, { label: 'PHILOSOPHER ROBERT NOZICK', value: '1974', x: E.W / 2, y: E.H * V(0.86, 0.66), size: V(110, 120), color: '#b8ff6a', a: ease.out(prog(t, n - 0.2, n + 0.1)), pulse: t - n }); },
});
// e05: "Scientists wire up your brain, and you float in a tank, while you experience anything you want."
registerShot('old_e05', { kind: '3d', init: (T) => { const st = stageFor(T, { fog: [10, 50], ambient: 1.3, bloom: 0.6 }); grid(T, st); const tk = tank(T, st); const sh = shapes(T, st, { count: 18 }); for (const x of [-4, 4]) tank(T, st, { pos: [x, 0, -4] }); return { stage: st, tk, sh }; },
  draw(s, t, info, T) { spinShapes(s.sh, t); s.tk.userData.person.position.y = 1.1 + Math.sin(t * 1.2) * 0.08; s.tk.userData.person.rotation.y = t * 0.15; T.orbit(s.stage.camera, t, { target: [0, 2.4, 0], radius: [6.5, 4.8], height: [2.8, 2.4], from: -0.5, to: 0.2, dur: info.dur }); },
  overlay(g, t, info) { const w = local(info, t, 'tank') ?? 2.0; word(g, 'WIRED. FLOATING. DREAMING.', E.H * V(0.16, 0.16), ease.out(prog(t, w - 0.2, w + 0.1)), { size: V(64, 72), color: '#d8f0c0' }); },
});
// three dream vignettes on islands
function vignette(kind) {
  return { kind: '3d', init: (T) => { const st = stageFor(T, { mood: 'dusk', sky: ['#2a2a1e', '#8a6a3a', '#e0a060'], fogColor: '#a8885a', fog: [20, 90], ambient: 1.6, key: 2.2, bloom: 0.5 }); island(T, st, 0, 0, 0, 4, { trees: false }); const sh = shapes(T, st, { count: 16, seed: 3 }); const o = { stage: st, sh };
      if (kind === 'novel') { st.add(T.box(1.4, 0.08, 0.8, T.mat('#5a3a2a'), 0.6, 1.15, 0), T.box(0.08, 0.9, 0.08, '#3a2a1a', 0.0, 0.7, -0.3), T.box(0.08, 0.9, 0.08, '#3a2a1a', 1.2, 0.7, -0.3)); o.me = person(T, st, DREAMER, -0.3, 0, 'sit', 0); o.me.position.y = 0.55; o.pages = []; for (let i = 0; i < 8; i++) { const p = T.box(0.3, 0.42, 0.01, T.basic('#fff8ec'), 0.6, 1.3, 0); st.add(p); o.pages.push(p); } }
      if (kind === 'love') { o.me = person(T, st, DREAMER, -0.45, 0, 'stand', 0); o.her = person(T, st, LOVE, 0.45, 0, 'stand', Math.PI); const heart = T.sphere(0.3, T.mat('#ff7a2a', { emissive: new T.THREE.Color('#ff7a2a'), emissiveIntensity: 0.5 }), 0, 2.6, 0); st.add(heart); o.heart = heart; }
      if (kind === 'game') { o.me = person(T, st, DREAMER, 0, 0, 'cheer', -0.3); const cup = T.cyl(0.25, 0.12, 0.45, T.mat('#ffd24a', { metalness: 0.8, roughness: 0.2, emissive: new T.THREE.Color('#aa8000'), emissiveIntensity: 0.4 }), 0.0, 2.55, 0.1); st.add(cup); o.cup = cup; o.crowd = []; for (let i = 0; i < 10; i++) { const f = person(T, st, FRIEND[i % 3], Math.cos(i / 10 * 6.28) * 2.6, Math.sin(i / 10 * 6.28) * 2.6, 'cheer', -i / 10 * 6.28 + Math.PI); o.crowd.push(f); } }
      return o; },
    draw(s, t, info, T) { spinShapes(s.sh, t); if (s.pages) s.pages.forEach((p, i) => { const k = ((t * 0.7 + i / 8) % 1); p.position.set(0.6 + k * 1.5, 1.3 + k * 2.2, Math.sin(i) * k); p.rotation.set(k * 3, k * 5 + i, 0); }); if (s.heart) { s.heart.scale.setScalar(1 + 0.15 * Math.abs(Math.sin(t * 5))); } if (s.cup) s.cup.rotation.y = t * 1.5;
      T.orbit(s.stage.camera, t, { target: [0.2, 1.4, 0], radius: [6.0, 5.0], height: [2.4, 2.1], from: -0.4, to: 0.1, dur: info.dur }); },
    overlay(g, t) { const label = { novel: 'WRITE A BESTSELLER', love: 'FALL IN LOVE', game: 'WIN THE BIG GAME' }[kind]; word(g, label, E.H * V(0.16, 0.16), ease.out(prog(t, 0.1, 0.35)), { color: '#ffffff', size: V(80, 90) }); if (kind === 'game') for (let i = 0; i < 30; i++) FX.sparkle(g, (i * 137) % E.W, ((i * 211 + t * 500) % (E.H * 0.7)), 14, ['#ffd24a', '#ff8a3a', '#b8ff6a'][i % 3], 0.8); },
  };
}
registerShot('n09', vignette('novel'));
registerShot('n10', vignette('love'));
registerShot('n11', vignette('game'));
// e09: "Every second feels completely real. And you'll never know you're inside the machine." pull back: the world is inside a glass orb in the tank room
registerShot('old_e09', { kind: '3d', init: (T) => { const st = stageFor(T, { fog: [30, 200], ambient: 1.4, bloom: 0.6 }); const world = new T.THREE.Group(); const tmp = { add: (...o) => { o.forEach((x) => world.add(x)); return o[0]; } }; island(T, tmp, 0, 0, 0, 4); island(T, tmp, -7, 3, -6, 2.5); island(T, tmp, 6, 4, -8, 2.8); person(T, tmp, DREAMER, 0.3, 0.6, 'cheer', -0.4, '#ffffff'); const sky = new T.THREE.Mesh(new T.THREE.SphereGeometry(16, 32, 24), new T.THREE.MeshBasicMaterial({ color: 0xd8b0f0, side: T.THREE.BackSide, transparent: true, opacity: 0.12 })); world.add(sky); world.scale.setScalar(0.12); world.position.set(0, 2.4, 0); st.add(world); tank(T, st); grid(T, st); const sh = shapes(T, st, { count: 14 }); for (const x of [-5, 5, -10, 10]) tank(T, st, { pos: [x, 0, -6] }); return { stage: st, world, sh }; },
  draw(s, t, info, T) { spinShapes(s.sh, t); s.world.rotation.y = t * 0.2; const k = ease.inOut(prog(t, 0.2, info.dur - 0.3)); const r = lerp(2.6, 12, k), h = lerp(2.6, 5, k); s.stage.camera.position.set(Math.sin(0.3) * r, h, Math.cos(0.3) * r); s.stage.camera.lookAt(0, lerp(2.4, 2.2, k), 0); s.stage.camera.fov = lerp(60, 42, k); s.stage.camera.updateProjectionMatrix(); },
  overlay(g, t, info) { const n = local(info, t, 'never') ?? 2.4; word(g, 'FEELS 100% REAL', E.H * V(0.16, 0.16), ease.out(prog(t, 0.2, 0.5)) * (1 - prog(t, n - 0.4, n - 0.1)), { color: '#ffffff' }); word(g, "YOU'D NEVER KNOW", E.H * V(0.16, 0.16), ease.out(prog(t, n - 0.1, n + 0.2)), { color: '#b8ff6a' }); },
});
// e10: "So, would you plug in, for life?" the choice: two glowing buttons
registerShot('old_e10', { kind: '3d', init: (T) => room(T),
  draw(s, t, info, T) { animHeadset(s.hs, t + 5); spinShapes(s.sh, t); T.dolly(s.stage.camera, t, [[0, { pos: [3.8, 1.9, 4.2], look: [0.5, 1.3, 0] }], [info.dur, { pos: [3.3, 1.85, 3.6], look: [0.5, 1.3, 0] }]]); },
  overlay(g, t, info) { word(g, 'FOR LIFE?', E.H * V(0.16, 0.16), ease.out(prog(t, 0.6, 0.9)), { color: '#ffffff' }); [['PLUG IN', '#b8ff6a', -0.22], ['STAY REAL', '#ff8a3a', 0.22]].forEach(([l, c, dx], i) => { const k = ease.outBack(prog(t, 0.9 + i * 0.2, 1.2 + i * 0.2)); if (k <= 0) return; g.save(); g.translate(E.W / 2 + dx * E.W, E.H * V(0.86, 0.6)); g.scale(k, k); rr(g, -V(170, 190), -V(48, 54), V(340, 380), V(96, 108), 48); g.fillStyle = alpha(c, 0.25); g.fill(); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); glow(g, 0, 0, 220, c, 0.3 * (1 + Math.sin(t * 4))); text(g, l, 0, 2, { size: V(42, 48), font: 'Nunito', weight: 900, color: '#ffffff', spacing: 3 }); g.restore(); }); },
});
// e11: "Most people say no. And that's strange." he pushes the headset away
registerShot('old_e11', { kind: '3d', init: (T) => room(T, { pose: 'stand' }),
  draw(s, t, info, T) { s.me.position.y = 0.0; s.me.position.x = -0.3; s.me.setPose(t > 0.4 ? { ...POSES.stand, eF: [40, -150], hF: [70, -150] } : 'stand'); animHeadset(s.hs, t + 8); s.hs.position.x = 1.3 + ease.out(prog(t, 0.5, 1.4)) * 1.2; spinShapes(s.sh, t); T.dolly(s.stage.camera, t, [[0, { pos: [1.0, 1.6, 4.2], look: [0.4, 1.4, 0] }], [info.dur, { pos: [0.8, 1.6, 3.6], look: [0.5, 1.4, 0] }]]); },
  overlay(g, t, info) { word(g, 'MOST PEOPLE SAY NO', E.H * V(0.16, 0.16), ease.out(prog(t, 0.1, 0.4)), { color: '#ff8a3a' }); const s2 = local(info, t, 'strange') ?? 2.2; word(g, '…WHY?', E.H * V(0.16, 0.16) + V(150, 160), ease.out(prog(t, s2 - 0.1, s2 + 0.2)), { size: V(70, 80) }); },
});
// e16: "But here's the twist. In a later study, people were told that their life, right now, was already the machine."
registerShot('old_e16', { kind: '3d', init: (T) => { const st = stageFor(T, { fog: [30, 200], ambient: 1.4, bloom: 0.6 }); const world = new T.THREE.Group(); const tmp = { add: (...o) => { o.forEach((x) => world.add(x)); return o[0]; } };
    tmp.add(T.box(6, 0.2, 6, T.mat('#6a4a38'), 0, 0, 0), T.box(6, 3, 0.2, T.mat('#a87e5a'), 0, 1.5, -3), T.box(1.8, 0.5, 0.8, T.mat('#4a3a6a'), 0, 0.35, -1.6)); person(T, tmp, DREAMER, -0.3, -1.2, 'sit', 0.4, '#ffd8a0').position.y = 0.6; const lamp = new T.THREE.PointLight(0xffd8a0, 4, 6, 2); lamp.position.set(1, 2.5, 0); world.add(lamp); const sky = new T.THREE.Mesh(new T.THREE.SphereGeometry(9, 32, 24), new T.THREE.MeshBasicMaterial({ color: 0xffd8a0, side: T.THREE.BackSide, transparent: true, opacity: 0.18 })); world.add(sky);
    world.scale.setScalar(0.2); world.position.set(0, 2.0, 0); st.add(world); tank(T, st); grid(T, st); const sh = shapes(T, st, { count: 14 }); for (const x of [-5, 5, -10, 10, -15, 15]) tank(T, st, { pos: [x, 0, -6] }); return { stage: st, world, sh }; },
  draw(s, t, info, T) { spinShapes(s.sh, t); const k = ease.inOut(prog(t, 1.0, info.dur - 0.3)); const r = lerp(2.6, 14, k), h = lerp(2.2, 5.5, k); s.stage.camera.position.set(Math.sin(-0.4) * r, h, Math.cos(-0.4) * r); s.stage.camera.lookAt(0, 2.0, 0); s.stage.camera.fov = lerp(62, 44, k); s.stage.camera.updateProjectionMatrix(); },
  overlay(g, t, info) { const tw = local(info, t, 'twist') ?? 0.3; glitch(g, t, 1 - prog(t, tw, tw + 0.5)); word(g, 'THE TWIST', E.H * V(0.16, 0.16), ease.out(prog(t, tw, tw + 0.25)) * (1 - prog(t, 1.6, 1.9)), { color: '#ff8a3a' }); const r2 = local(info, t, 'already') ?? 4.6; word(g, 'YOUR LIFE IS ALREADY THE MACHINE', E.H * V(0.16, 0.16), ease.out(prog(t, r2 - 0.4, r2 - 0.1)), { size: V(58, 66), color: '#b8ff6a' }); },
});
// e17: "Would they unplug, and wake up to a reality they'd never seen?" the cable and a dark unknown door
registerShot('old_e17', { kind: '3d', init: (T) => { const st = stageFor(T, { mood: 'night', sky: ['#020208', '#06061a'], fogColor: '#020208', fog: [6, 26], ambient: 0.9, key: 0.9, bloom: 0.7 }); grid(T, st, { opacity: 0.2 }); const door = T.box(1.4, 2.6, 0.1, T.basic('#e8f4ff'), 0, 1.3, -5); st.add(door); const dl = new T.THREE.PointLight(0xe8f4ff, 6, 10, 2); dl.position.set(0, 1.5, -4.5); st.add(dl); const me = person(T, st, DREAMER, 0, 0, 'stand', Math.PI / 2, '#e8f4ff'); const cable = T.cyl(0.04, 0.04, 6, T.basic('#b8ff6a'), 0, 4.6, 0.1); st.add(cable); return { stage: st, me, cable, door }; },
  draw(s, t, info, T) { s.me.setPose(t > 1.5 ? { ...POSES.stand, eF: [24, -196], hF: [16, -236] } : 'stand'); T.dolly(s.stage.camera, t, [[0, { pos: [1.2, 1.6, 5.2], look: [0, 1.3, -3] }], [info.dur, { pos: [0.8, 1.5, 4.2], look: [0, 1.3, -4] }]]); },
  overlay(g, t, info) { const u = local(info, t, 'unplug') ?? 0.6; word(g, 'UNPLUG?', E.H * V(0.16, 0.16), ease.out(prog(t, u - 0.1, u + 0.2)), { color: '#ffffff' }); const n = local(info, t, 'never') ?? 2.6; word(g, 'TO A REALITY YOU’VE NEVER SEEN', E.H * V(0.16, 0.16) + V(150, 160), ease.out(prog(t, n - 0.2, n + 0.1)), { size: V(52, 60), color: '#d8f0c0' }); },
});
// e18: "Many chose to stay." he turns away from the door and sits back down
registerShot('old_e18', { kind: '3d', init: (T) => room(T),
  draw(s, t, info, T) { animHeadset(s.hs, t + 11); s.hs.position.set(lerp(1.3, -0.15, ease.inOut(prog(t, 0.2, 1.2))), lerp(1.65, 1.95, ease.inOut(prog(t, 0.2, 1.2))), 0); spinShapes(s.sh, t); T.dolly(s.stage.camera, t, [[0, { pos: [2.6, 1.8, 2.8], look: [0, 1.5, 0] }], [info.dur, { pos: [2.2, 1.8, 2.3], look: [0, 1.6, 0] }]]); },
  overlay(g, t) { word(g, 'MANY CHOSE TO STAY', E.H * V(0.16, 0.16), ease.out(prog(t, 0.4, 0.7)), { color: '#b8ff6a' }); },
});
// e20: end: the headset glows in the dark
registerShot('old_e20', { kind: '3d', init: (T) => room(T),
  draw(s, t, info, T) { animHeadset(s.hs, t + 14); spinShapes(s.sh, t); T.orbit(s.stage.camera, t, { target: [0.6, 1.4, 0], radius: [4.2, 5.2], height: [1.9, 2.3], from: 0.2, to: 0.8, dur: info.dur }); },
  overlay(g, t) { const a = ease.out(prog(t, 0.3, 0.9)); g.save(); const gr = g.createLinearGradient(0, 0, 0, E.H * 0.38); gr.addColorStop(0, 'rgba(4,3,14,.8)'); gr.addColorStop(1, 'rgba(4,3,14,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H * 0.38); g.restore();
    text(g, 'Would you', E.W / 2, E.H * V(0.13, 0.14), { size: V(70, 80), font: 'Playfair Display', weight: 900, italic: true, color: '#f4f0ff', alpha: a, glow: 18, glowColor: 'rgba(127,240,255,.7)' });
    text(g, 'plug in?', E.W / 2, E.H * V(0.13, 0.14) + V(96, 108), { size: V(90, 100), font: 'Playfair Display', weight: 900, italic: true, color: '#b8ff6a', alpha: a, glow: 22, glowColor: 'rgba(127,240,255,.8)' });
    word(g, 'TELL ME IN THE COMMENTS', E.H * V(0.86, 0.8), ease.out(prog(t, 1.4, 1.8)), { size: V(48, 56) }); },
});
