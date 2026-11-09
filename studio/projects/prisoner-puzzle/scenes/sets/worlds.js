// worlds.js: a library of ready 3D backgrounds for storyboards: 16 locations x 6 moods, each with seeded variations.
// One call builds stage + lighting + set dressing + atmosphere; you only place characters and the camera.
//   import { world, WORLDS, MOODS } from '../sets/worlds.js';
//   const W = world(T, 'classroom', { mood: 'golden', seed: 3, palette: 'warm' });   // -> { stage, spots, tick(t) }
//   person.position.set(...W.spots.hero);  W.tick(t) in draw() (rain, dust, bokeh, screens flicker)
// Storyboard rule: pick 4-6 worlds per video, give each chapter its own world + mood (the colour arc), and use
// 2-3 camera spots per world (W.cams.wide / W.cams.mid / W.cams.close) so cuts never repeat a framing.
import { rng, lerp } from '/engine/core.js';
import { lifeStage } from './lifesim.js';
import { skyTex, SKIES, lamp, rain, dust, bokeh, sprite } from './fc.js';

// ---------- moods: lighting + window sky + atmosphere ----------
export const MOODS = {
  day:    { sky: ['#6aa8e8', '#a8d0f0', '#e8f2fa'], win: ['#7ab8f0', '#bfe0f8', '#f0f6fa'], fogColor: '#c8dcec', fog: [14, 70], key: 2.6, keyColor: '#fff4e0', keyPos: [6, 10, 6], ambient: 1.6, ambientSky: '#cfe4ff', rim: '#ffe0b0', fill: '#a0d8ff', lit: 0.0 },
  golden: { sky: SKIES.golden, win: ['#ff9a5a', '#ffc880', '#ffe0a0'], fogColor: '#d89a70', fog: [12, 55], key: 2.6, keyColor: '#ffc890', keyPos: [-6, 4, -12], ambient: 1.3, ambientSky: '#b0b0d8', rim: '#ffb070', fill: '#6ac8d0', lit: 0.15 },
  dusk:   { sky: SKIES.dusk, win: SKIES.dusk, fogColor: '#3a2a5a', fog: [10, 45], key: 1.5, keyColor: '#ffb8a0', keyPos: [0, 5, -14], ambient: 1.1, ambientSky: '#8a8ad0', rim: '#ff9a7a', fill: '#5fd0d0', lit: 0.35 },
  night:  { sky: SKIES.night, win: SKIES.night, fogColor: '#0e1430', fog: [9, 50], key: 0.7, keyColor: '#9ab8ff', keyPos: [-6, 9, 4], ambient: 0.75, ambientSky: '#5a7ad0', rim: '#ff9a7a', fill: '#4ac0d0', lit: 0.7, stars: 120 },
  rain:   { sky: SKIES.rainNight, win: SKIES.rainNight, fogColor: '#0e1826', fog: [6, 32], key: 0.6, keyColor: '#a8c8ff', keyPos: [-4, 9, 3], ambient: 0.75, ambientSky: '#4a6aa0', rim: '#ffb070', fill: '#4ab8d0', lit: 0.6, rain: true },
  dream:  { sky: ['#1a1040', '#4a2a7a', '#c86aa8', '#ffc0d8'], win: ['#4a2a7a', '#c86aa8', '#ffd0e0'], fogColor: '#6a4a9a', fog: [6, 30], key: 1.2, keyColor: '#ffd0f0', keyPos: [0, 6, 2], ambient: 1.3, ambientSky: '#c0a0ff', rim: '#ff9ad8', fill: '#7ae0ff', lit: 0.3, motes: true },
};
const PAL = {
  warm:   { wall: '#c8946a', wall2: '#a8704e', floor: '#7a5038', trim: '#5a3a2a', accent: ['#e85a4a', '#f0b040', '#3f9a7a', '#4a7ad8'] },
  cool:   { wall: '#7a90a8', wall2: '#5a6e88', floor: '#4a5466', trim: '#2a3444', accent: ['#ff7a5c', '#5fd0d0', '#ffcf5a', '#8a5ad8'] },
  pastel: { wall: '#e8c8d0', wall2: '#c8d8e8', floor: '#d8c0a8', trim: '#a08080', accent: ['#ff9ab0', '#8ad0c0', '#ffd080', '#a0a0f0'] },
  retro:  { wall: '#d8b878', wall2: '#7aa890', floor: '#8a6a4a', trim: '#4a3a2a', accent: ['#e86a3a', '#2a8a8a', '#f0c040', '#a03a5a'] },
  neon:   { wall: '#2a2640', wall2: '#1a1830', floor: '#22202e', trim: '#0e0c18', accent: ['#ff3aa0', '#3af0ff', '#ffe03a', '#8a5aff'] },
  desi:   { wall: '#e0a860', wall2: '#c86a4a', floor: '#a87850', trim: '#6a3a2a', accent: ['#e0402a', '#f0b020', '#2a8a5a', '#d0408a'] },
};

// ---------- helpers ----------
function kit(T, st, o) {
  const { THREE } = T, R = rng(o.seed || 7), P = PAL[o.palette] || PAL[o.defPal] || PAL.warm, M = MOODS[o.mood] || MOODS.dusk;
  const mat = (c, x = {}) => T.mat(c, { roughness: 0.8, ...x });
  const box = (w, h, d, c, x, y, z, m = {}) => { const b = T.box(w, h, d, typeof c === 'string' ? mat(c, m) : c, x, y, z); st.add(b); return b; };
  const cyl = (rt, rb, h, c, x, y, z, seg = 18) => { const b = T.cyl(rt, rb, h, typeof c === 'string' ? mat(c) : c, x, y, z, seg); st.add(b); return b; };
  const sph = (r, c, x, y, z) => { const b = T.sphere(r, typeof c === 'string' ? mat(c) : c, x, y, z); st.add(b); return b; };
  const pick = (a) => a[Math.floor(R() * a.length)];
  const floor = (c, tex) => { const f = T.ground(60, 60, c, tex); st.add(f); return f; };
  const win = (w, h, x, y, z, ry = 0, opt = {}) => {   // a window showing the mood's sky (and skyline / trees)
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: skyTex(T, M.win, { skyline: opt.skyline ?? 0.8, skyH: 90, lit: M.lit, trees: opt.trees, mullions: opt.mullions ?? Math.max(2, Math.round(w / 1.2)), stars: M.stars ? 40 : 0, clouds: o.mood === 'day' || o.mood === 'golden' ? 10 : 4, cloudColor: o.mood === 'day' ? '#ffffff' : '#ffb090', seed: o.seed }), fog: false }));
    m.position.set(x, y, z); m.rotation.y = ry; st.add(m); return m; };
  const poster = (x, y, z, ry, w = 0.6, h = 0.8) => { const c = pick(P.accent); const p = T.box(0.03, h, w, mat(c, { roughness: 0.6 }), x, y, z); p.rotation.y = ry; st.add(p); return p; };
  const plant = (x, z, s = 1) => { cyl(0.16 * s, 0.12 * s, 0.3 * s, '#a8603a', x, 0.15 * s, z); for (let i = 0; i < 5; i++) sph(0.16 * s, pick(['#3a8a4a', '#4aa05a', '#2a7a3a']), x + (R() - 0.5) * 0.25 * s, 0.45 * s + R() * 0.3 * s, z + (R() - 0.5) * 0.25 * s); };
  const tree = (x, z, s = 1) => { cyl(0.09 * s, 0.13 * s, 1.6 * s, '#5a3a24', x, 0.8 * s, z); for (let i = 0; i < 6; i++) sph((0.5 + R() * 0.3) * s, pick(['#2f7a3a', '#3a8a44', '#4a9a4a', '#2a6a34']), x + (R() - 0.5) * 0.9 * s, (1.8 + R() * 0.7) * s, z + (R() - 0.5) * 0.9 * s); };
  const chair = (x, z, ry = 0, c = '#6a4a3a') => { const g = new THREE.Group(); g.add(T.box(0.42, 0.05, 0.42, mat(c), 0, 0.45, 0)); g.add(T.box(0.42, 0.5, 0.05, mat(c), 0, 0.72, -0.19)); for (const [a, b] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) g.add(T.box(0.04, 0.45, 0.04, mat('#3a2a22'), a, 0.22, b)); g.position.set(x, 0, z); g.rotation.y = ry; st.add(g); return g; };
  const table = (x, z, w = 1.2, d = 0.7, c = '#8a6040', h = 0.75) => { box(w, 0.06, d, c, x, h, z); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(0.05, h, 0.05, '#3a2a22', x + a * (w / 2 - 0.06), h / 2, z + b * (d / 2 - 0.06)); };
  const screen = (w, h, x, y, z, ry = 0, color = '#7fc8ff') => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color })); m.position.set(x, y, z); m.rotation.y = ry; st.add(m); return m; };
  const bulb = (pos, color, r = 0.03, halo = 0.14) => { const b = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ color })); b.position.set(...pos); st.add(b); sprite(T, st, pos, halo, color, 0.35); return b; };
  return { THREE, R, P, M, mat, bulb, box, cyl, sph, pick, floor, win, poster, plant, tree, chair, table, screen };
}

// ---------- the worlds ----------
export const WORLDS = {
  classroom: { indoor: true, pal: 'pastel', desc: 'school classroom: desk rows, blackboard, windows, posters', build(T, st, o, K) {
    K.floor(K.P.floor, T.planks(K.P.floor, 16, [8, 8])); K.box(14, 4, 0.2, K.P.wall, 0, 2, -5); K.box(0.2, 4, 14, K.P.wall2, -6, 2, 0); K.box(0.2, 4, 14, K.P.wall2, 6, 2, 0); K.box(14, 0.2, 14, '#e8e4dc', 0, 4, 0);
    K.box(4.2, 1.6, 0.06, '#24402e', 0, 2.1, -4.88); K.box(4.4, 0.1, 0.15, K.P.trim, 0, 1.25, -4.85); for (let i = 0; i < 3; i++) K.win(1.6, 1.8, 5.88, 2.2, -3 + i * 2.6, -Math.PI / 2, { trees: 0.9, skyline: 0 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const x = -3 + c * 2, z = -2.5 + r * 1.5; K.table(x, z, 0.9, 0.55, '#c89a6a'); K.chair(x, z + 0.45, Math.PI, K.pick(K.P.accent)); }
    for (let i = 0; i < 5; i++) K.poster(-5.88, 2.3, -3.5 + i * 1.6, Math.PI / 2); K.box(1.4, 0.06, 0.06, K.P.trim, -3.4, 3.1, -4.85);
    return { spots: { hero: [0, 0, 0.6], front: [0, 0, -3.8], desk: [-1, 0, -1] }, cams: { wide: { pos: [0, 2.2, 4.5], look: [0, 1.0, -3] }, mid: { pos: [2.4, 1.5, 2.0], look: [0, 1.2, -1] }, close: { pos: [0.5, 1.6, 2.0], look: [0, 1.5, 0.6] } } }; } },
  bedroom: { indoor: true, pal: 'warm', desc: 'teen bedroom: bed, desk + glowing laptop, window, fairy lights, posters', build(T, st, o, K) {
    K.floor(K.P.floor, T.planks(K.P.floor, 10, [6, 6])); K.box(8, 3.2, 0.2, K.P.wall, 0, 1.6, -3.5); K.box(0.2, 3.2, 8, K.P.wall2, -4, 1.6, 0); K.box(8, 0.2, 8, '#e8dcd0', 0, 3.2, 0);
    K.box(2.0, 0.45, 1.4, '#8a5a3a', -2.6, 0.22, -2.4); K.box(1.9, 0.18, 1.3, '#f2eee8', -2.6, 0.54, -2.4); K.box(1.0, 0.16, 1.3, K.pick(K.P.accent), -2.15, 0.66, -2.4); K.box(0.5, 0.14, 0.35, '#ffffff', -3.3, 0.7, -2.4);
    K.win(1.6, 1.4, 0.6, 1.8, -3.38, 0, { mullions: 2 }); K.table(2.2, -2.9, 1.4, 0.6, '#c8a070'); K.chair(2.2, -2.3, Math.PI);
    const lap = K.screen(0.42, 0.26, 2.2, 1.0, -3.0, 0, '#9ad0ff'); K.box(0.44, 0.02, 0.3, '#2a2a30', 2.2, 0.79, -2.85);
    for (let i = 0; i < 14; i++) K.bulb([-3.8 + i * 0.5, 2.9 - Math.sin(i * 0.7) * 0.1, -3.35], K.pick(['#ffd080', '#ff9ab0', '#9ad0ff']), 0.03, 0.12);
    for (let i = 0; i < 3; i++) K.poster(-3.88, 1.9, -1.8 + i * 1.0, Math.PI / 2, 0.5, 0.7); K.plant(3.3, -0.5, 0.9);
    lamp(T, st, [2.6, 1.3, -3.0], '#ffc880', 1.6, 3.5);
    return { spots: { hero: [0.2, 0, -0.6], bed: [-2.2, 0, -1.6], desk: [2.2, 0, -2.2] }, cams: { wide: { pos: [1.2, 1.8, 3.4], look: [-0.5, 1.0, -2.5] }, mid: { pos: [1.8, 1.4, 1.2], look: [0.2, 1.3, -0.6] }, close: { pos: [0.6, 1.6, 0.9], look: [0.2, 1.55, -0.6] } }, tick: (t) => lap.material.color.setHSL(0.58, 0.7, 0.72 + 0.04 * Math.sin(t * 3)) }; } },
  cafe: { indoor: true, pal: 'retro', desc: 'cosy cafe: counter + menu board, pendant lamps, round tables, plants, street window', build(T, st, o, K) {
    K.floor('#5a3a2a', T.tiles('#6a4a36', 12, [10, 10])); K.box(14, 3.6, 0.2, K.P.wall, 0, 1.8, -5); K.box(0.2, 3.6, 14, K.P.wall2, -6, 1.8, 0); K.box(14, 0.2, 14, '#2a2020', 0, 3.6, 0);
    K.win(6, 2.2, 5.88, 1.8, -0.5, -Math.PI / 2, { skyline: 0.85, mullions: 5 }); K.box(4, 1.0, 0.8, '#4a2a1e', -2.5, 0.5, -4.2); K.box(4.1, 0.06, 0.9, '#d8c0a0', -2.5, 1.02, -4.2);
    K.box(2.2, 1.2, 0.05, '#1a1a1a', -2.5, 2.4, -4.88); for (let i = 0; i < 5; i++) K.box(1.4 - (i % 2) * 0.4, 0.06, 0.06, '#f4efe0', -2.6, 2.75 - i * 0.18, -4.84);
    for (const [x, z] of [[0.5, -2], [2.6, -2.2], [0.8, 0.3], [3, 0.2], [-1.6, -0.6]]) { K.cyl(0.4, 0.4, 0.05, '#f0e6d8', x, 0.74, z, 24); K.cyl(0.04, 0.04, 0.72, '#2a2a2a', x, 0.36, z); K.chair(x - 0.55, z, Math.PI / 2, K.pick(K.P.accent)); K.chair(x + 0.55, z, -Math.PI / 2, K.pick(K.P.accent)); K.cyl(0.04, 0.035, 0.09, '#ffffff', x, 0.81, z); lamp(T, st, [x, 2.3, z], '#ffb860', 1.3, 3.2, { r: 0.08 }); K.cyl(0.005, 0.005, 1.2, '#202020', x, 2.95, z); }
    K.plant(-5.4, -4.4, 1.2); K.plant(5.3, -4.4, 1.0); K.plant(-5.4, 2, 1.1);
    return { spots: { hero: [0.8, 0, 0.9], counter: [-2.5, 0, -3.4], table: [2.6, 0, -1.4] }, cams: { wide: { pos: [3.5, 2.0, 4.5], look: [-1, 1, -2.5] }, mid: { pos: [2.2, 1.4, 2.6], look: [0.8, 1.2, 0.3] }, close: { pos: [1.2, 1.55, 2.2], look: [0.8, 1.5, 0.9] } } }; } },
  street: { indoor: false, pal: 'neon', desc: 'city street: shop fronts with signs, lit windows, street lamps, parked cars, wet road at night', build(T, st, o, K) {
    K.floor('#2a2a30', T.tiles('#34343c', 20, [20, 20])); K.box(60, 0.02, 6, '#1e1e24', 0, 0.011, 0, { roughness: o.mood === 'rain' ? 0.15 : 0.7, metalness: o.mood === 'rain' ? 0.4 : 0 });
    for (let i = 0; i < 8; i++) K.box(0.6, 0.02, 0.12, '#e8e0c0', -14 + i * 4, 0.025, 0);
    for (const side of [-1, 1]) { K.box(60, 0.15, 3, '#4a4a52', 0, 0.075, side * 4.5); let x = -16; while (x < 16) { const w = 3 + K.R() * 2, h = 5 + K.R() * 7, c = K.pick([K.P.wall, K.P.wall2, '#3a3448', '#4a3a3a', '#34404a']); K.box(w, h, 3, c, x + w / 2, h / 2, side * 7.5);
        for (let yy = 1.8; yy < h - 0.6; yy += 1.1) for (let xx = 0.5; xx < w - 0.4; xx += 0.9) K.box(0.5, 0.6, 0.05, K.R() < 0.55 + K.M.lit * 0.3 ? K.pick(['#ffd890', '#ffb870', '#9ad0ff']) : '#1a1a24', x + xx, yy + 1.5, side * 5.97, { emissive: K.M.lit > 0.3 ? '#ffc880' : '#000000', emissiveIntensity: 0.25 });
        const sg = K.pick(K.P.accent); K.box(w * 0.7, 0.45, 0.08, sg, x + w / 2, 3.0, side * 5.95, { emissive: sg, emissiveIntensity: K.M.lit > 0.3 ? 0.4 : 0.05 }); x += w + 0.2; } }
    for (let i = 0; i < 6; i++) { const x = -12 + i * 5, z = (i % 2 ? 1 : -1) * 3.4; K.cyl(0.05, 0.06, 4, '#2a2a30', x, 2, z); if (i % 3 !== 2) lamp(T, st, [x, 4, z * 0.88], '#ffd0a0', K.M.lit > 0.3 ? 4 : 0.6, 8); else K.bulb([x, 4, z * 0.88], '#ffd0a0', 0.09, 0.6); }
    for (let i = 0; i < 4; i++) { const x = -9 + i * 6, z = (i % 2 ? 1 : -1) * 2.2, c = K.pick(['#c83a3a', '#3a6ac8', '#e8e8e8', '#f0c040']); K.box(1.9, 0.55, 0.9, c, x, 0.45, z, { roughness: 0.3, metalness: 0.5 }); K.box(1.1, 0.42, 0.85, '#2a3a4a', x - 0.1, 0.92, z, { roughness: 0.1, metalness: 0.6 }); for (const dx of [-0.65, 0.65]) for (const dz of [-0.45, 0.45]) { const wh = K.cyl(0.18, 0.18, 0.12, '#151515', x + dx, 0.18, z + dz); wh.rotation.x = Math.PI / 2; } }
    return { spots: { hero: [0, 0, 1.2], shop: [2, 0, 3.6], corner: [-4, 0, -3.4] }, cams: { wide: { pos: [-3.5, 1.9, 4.6], look: [1.5, 1.6, -2] }, mid: { pos: [2.6, 1.5, 4], look: [0, 1.3, 1] }, close: { pos: [0.7, 1.6, 2.9], look: [0, 1.5, 1.2] } } }; } },
  park: { indoor: false, pal: 'warm', desc: 'city park: grass, trees, winding path, benches, lamp posts, pond', build(T, st, o, K) {
    K.floor('#4a8a3a', T.tiles('#4f9040', 30, [12, 12])); for (let i = 0; i < 14; i++) K.box(1.3, 0.02, 1.0, '#c8b08a', Math.sin(i * 0.5) * 2.5, 0.012, 6 - i * 1.2).rotation.y = Math.cos(i * 0.5) * 0.4;
    for (let i = 0; i < 16; i++) { const a = K.R() * 6.28, r = 4 + K.R() * 12; K.tree(Math.cos(a) * r, -Math.abs(Math.sin(a) * r) - 1, 0.9 + K.R() * 0.6); }
    for (const [x, z, ry] of [[1.6, -1, -0.5], [-2.8, -4, 0.4]]) { const g = K.box(1.5, 0.06, 0.45, '#8a5a3a', x, 0.45, z); g.rotation.y = ry; const b = K.box(1.5, 0.4, 0.05, '#8a5a3a', x - Math.sin(ry) * 0.22, 0.7, z - Math.cos(ry) * 0.22); b.rotation.y = ry; }
    const pond = new K.THREE.Mesh(new K.THREE.CircleGeometry(2.6, 40), T.mat('#4a7ab0', { roughness: 0.1, metalness: 0.5 })); pond.rotation.x = -Math.PI / 2; pond.position.set(5, 0.02, -5); st.add(pond);
    for (let i = 0; i < 3; i++) { const x = -4 + i * 4; K.cyl(0.04, 0.05, 3, '#2a2a30', x, 1.5, 1.8); lamp(T, st, [x, 3.0, 1.8], '#ffd8a0', K.M.lit > 0.3 ? 3 : 0.4, 7); }
    return { spots: { hero: [0, 0, 1], bench: [1.6, 0, -0.6], pond: [3.4, 0, -3.6] }, cams: { wide: { pos: [0, 2.4, 7], look: [0, 1.4, -4] }, mid: { pos: [2.5, 1.4, 3.2], look: [0.3, 1.2, 0.5] }, close: { pos: [0.8, 1.6, 2.6], look: [0, 1.5, 1] } } }; } },
  hospital: { indoor: true, pal: 'cool', bright: 0.85, desc: 'hospital corridor: pale walls, doors with number plates, hand rails, ceiling light panels, waiting chairs', build(T, st, o, K) {
    K.floor('#c8d4d8', T.tiles('#d4dee0', 14, [6, 14])); K.box(0.2, 3.2, 40, '#dce6e8', -2.2, 1.6, -10); K.box(0.2, 3.2, 40, '#d4e0e4', 2.2, 1.6, -10); K.box(5, 0.2, 40, '#eef2f2', 0, 3.2, -10);
    for (let i = 0; i < 8; i++) { const z = 2 - i * 3.5; for (const s of [-1, 1]) { K.box(0.06, 2.1, 1.0, i % 3 ? '#7aa0b8' : '#5a8aa8', s * 2.1, 1.05, z); K.box(0.04, 0.18, 0.36, '#2a4a6a', s * 2.08, 2.35, z); } K.box(0.9, 0.04, 0.6, '#ffffff', 0, 3.08, z - 1.6, { emissive: '#ffffff', emissiveIntensity: 0.4 }); if (i % 2 === 0) lamp(T, st, [0, 2.9, z - 1.6], '#e8f4ff', 2.2, 7, { bulb: false }); }
    for (const s of [-1, 1]) K.box(0.05, 0.05, 40, '#a8b8c0', s * 2.05, 0.95, -10); for (let i = 0; i < 4; i++) K.chair(-1.75, -1 - i * 0.55, Math.PI / 2, '#3a7ab0');
    return { spots: { hero: [0, 0, 0.5], door: [1.5, 0, -5], chairs: [-1.3, 0, -1.8] }, cams: { wide: { pos: [0.4, 1.7, 4.5], look: [0, 1.2, -12] }, mid: { pos: [1.4, 1.5, 2.6], look: [0, 1.3, 0] }, close: { pos: [0.6, 1.6, 2.0], look: [0, 1.5, 0.5] } } }; } },
  office: { indoor: true, pal: 'cool', desc: 'open office: desks with glowing monitors, glass wall with city view, plants, ceiling lights', build(T, st, o, K) {
    K.floor('#4a5060', T.tiles('#525868', 10, [10, 10])); K.win(16, 3.2, 0, 1.7, -6, 0, { skyline: 0.9, mullions: 10 }); K.box(0.2, 3.4, 14, K.P.wall, -7, 1.7, 0); K.box(16, 0.2, 14, '#e8eaee', 0, 3.4, 0);
    const scr = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const x = -4.5 + c * 3, z = -3.5 + r * 2.4; K.table(x, z, 1.6, 0.8, '#e8e4dc'); K.box(1.6, 0.5, 0.04, '#9aa8b8', x, 1.0, z - 0.42); K.box(0.6, 0.38, 0.04, '#1a1a22', x, 1.05, z - 0.2); scr.push(K.screen(0.56, 0.33, x, 1.05, z - 0.177, 0, K.pick(['#8ac8ff', '#a0f0d0', '#ffd8a0']))); K.chair(x, z + 0.5, Math.PI, '#2a2a30'); }
    for (let i = 0; i < 4; i++) K.box(2.4, 0.04, 0.5, '#ffffff', -4 + i * 3, 3.28, -1, { emissive: '#ffffff', emissiveIntensity: 0.35 }); K.plant(-6.3, -5.3, 1.4); K.plant(6.2, -5.3, 1.3);
    return { spots: { hero: [0, 0, 1.8], desk: [-1.5, 0, -0.6], window: [1, 0, -5] }, cams: { wide: { pos: [3, 2.2, 6], look: [-1, 1.1, -3] }, mid: { pos: [1.9, 1.4, 3.6], look: [0, 1.2, 1.4] }, close: { pos: [0.7, 1.6, 3.0], look: [0, 1.5, 1.8] } }, tick: (t) => scr.forEach((s, i) => s.material.color.offsetHSL(0, 0, 0.002 * Math.sin(t * 2 + i))) }; } },
  metro: { indoor: true, pal: 'cool', desc: 'metro train carriage: long seats, grab poles, windows with tunnel lights streaking past', build(T, st, o, K) {
    K.floor('#3a3e48', T.tiles('#44485a', 10, [4, 16])); for (const s of [-1, 1]) { K.box(0.2, 2.6, 24, '#d8dce4', s * 1.6, 1.3, -6); K.box(0.5, 0.45, 24, '#3a6ac8', s * 1.3, 0.25, -6); K.box(0.1, 0.5, 24, '#3a6ac8', s * 1.5, 0.7, -6); }
    K.box(3.4, 0.15, 24, '#eef0f4', 0, 2.6, -6); for (let i = 0; i < 6; i++) { K.cyl(0.02, 0.02, 2.4, '#c8ccd4', 0.7 * (i % 2 ? 1 : -1), 1.2, -i * 3, 10); K.box(0.4, 0.03, 0.9, '#ffffff', 0, 2.5, -i * 3.5, { emissive: '#ffffff', emissiveIntensity: 0.5 }); }
    const streaks = []; for (const s of [-1, 1]) for (let i = 0; i < 8; i++) { const w = K.win(1.4, 0.8, s * 1.48, 1.6, 1 - i * 3, s * -Math.PI / 2, { skyline: 0, mullions: 1 }); w.material.color.set('#1a1e2a'); } for (let i = 0; i < 10; i++) { const m = K.box(0.02, 0.04, 2, '#ffd890', (i % 2 ? 1 : -1) * 1.9, 1.6 + (i % 3) * 0.15, 0, { emissive: '#ffd890', emissiveIntensity: 0.6 }); streaks.push(m); }
    lamp(T, st, [0, 2.3, -2], '#e8f0ff', 2.5, 8, { bulb: false });
    return { spots: { hero: [0.3, 0, 0], seatL: [-1.1, 0, -2], seatR: [1.1, 0, -4] }, cams: { wide: { pos: [0.2, 1.7, 4], look: [0, 1.2, -10] }, mid: { pos: [0.9, 1.45, 2.2], look: [0.2, 1.3, 0] }, close: { pos: [0.4, 1.6, 1.4], look: [0.3, 1.5, 0] } }, tick: (t) => streaks.forEach((m, i) => { m.position.z = 6 - (((t * 14 + i * 2.7) % 24)); }) }; } },
  beach: { indoor: false, pal: 'pastel', desc: 'beach: sand, sea, palm trees, hut, lounge chairs, low sun', build(T, st, o, K) {
    K.floor('#e8cc98', T.tiles('#ecd2a0', 40, [10, 10])); const sea = new K.THREE.Mesh(new K.THREE.PlaneGeometry(200, 80), T.mat('#3a8ab8', { roughness: 0.15, metalness: 0.4 })); sea.rotation.x = -Math.PI / 2; sea.position.set(0, 0.03, -48); st.add(sea);
    K.box(200, 0.02, 2, '#f8f4ec', 0, 0.035, -8.2); for (const [x, z, s] of [[-4, -3, 1.2], [5, -4, 1.0], [-7, 1, 1.4]]) { for (let i = 0; i < 6; i++) { const seg = K.cyl(0.11 - i * 0.008, 0.12 - i * 0.008, 0.6 * s, '#8a6a44', x + i * 0.08 * s, 0.3 * s + i * 0.58 * s, z); seg.rotation.z = -0.08; } for (let i = 0; i < 7; i++) { const lf = K.box(1.6 * s, 0.04, 0.32 * s, '#3a8a3a', x + 0.5 * s + Math.cos(i * 0.9) * 0.7 * s, 3.6 * s, z + Math.sin(i * 0.9) * 0.7 * s); lf.rotation.y = -i * 0.9; lf.rotation.z = -0.35; } }
    K.box(2.4, 1.8, 2.0, '#c89a5a', 6, 0.9, 1); const roof = K.cyl(0.01, 1.9, 0.9, '#d8b070', 6, 2.25, 1, 4); roof.rotation.y = Math.PI / 4; for (const x of [1.5, 2.6]) { const l = K.box(0.6, 0.08, 1.6, K.pick(K.P.accent), x, 0.3, 0.5); l.rotation.x = -0.1; } const umb = K.cyl(0.01, 1.2, 0.4, '#e85a6a', 2.05, 2.1, 0.2, 10); K.cyl(0.02, 0.02, 2, '#f4f4f4', 2.05, 1.0, 0.2);
    return { spots: { hero: [0, 0, 1], chairs: [2, 0, 1.5], sea: [0, 0, -6.5] }, cams: { wide: { pos: [0, 2.0, 7], look: [0, 1.5, -10] }, mid: { pos: [2.2, 1.4, 3.4], look: [0, 1.2, 0.8] }, close: { pos: [0.7, 1.6, 2.6], look: [0, 1.5, 1] } } }; } },
  temple: { indoor: false, pal: 'desi', desc: 'Indian temple courtyard: carved pillars, steps, shikhara, diyas, marigold garlands, bell', build(T, st, o, K) {
    K.floor('#c8a878', T.tiles('#d0b080', 12, [10, 10])); for (let i = 0; i < 4; i++) K.box(8 - i * 0.6, 0.22, 2.2 - i * 0.3, '#d8c098', 0, 0.11 + i * 0.22, -4.5 - i * 0.15);
    K.box(6, 3.2, 3, '#e0b878', 0, 2.5, -6.2); for (let i = 0; i < 5; i++) K.cyl(1.6 - i * 0.3, 1.8 - i * 0.3, 0.9, i % 2 ? '#d8a060' : '#e8c080', 0, 4.5 + i * 0.85, -6.2, 8); K.cyl(0.12, 0.25, 0.6, '#f0c020', 0, 8.9, -6.2, 8); K.box(1.4, 2.0, 0.1, '#5a2a1a', 0, 1.9, -4.68);
    for (const x of [-3.4, -1.9, 1.9, 3.4]) { K.cyl(0.24, 0.28, 3.2, '#e8c890', x, 1.6, -3); for (let k = 0; k < 4; k++) K.cyl(0.3, 0.3, 0.08, '#c89860', x, 0.4 + k * 0.85, -3); }
    for (let i = 0; i < 22; i++) K.sph(0.07, i % 2 ? '#ff9a1a' : '#ffc020', -3.4 + i * 0.324, 3.0 - Math.sin(i / 21 * Math.PI) * 0.5, -3);
    const diyas = []; for (let i = 0; i < 12; i++) { const x = -3.3 + i * 0.6; K.cyl(0.07, 0.04, 0.05, '#a8603a', x, 0.94, -4.0); K.bulb([x, 1.0, -4.0], '#ffb040', 0.022, 0.2); }
    for (const x of [-1.8, 1.8]) diyas.push(lamp(T, st, [x, 1.1, -3.8], '#ffb040', 1.4, 4, { bulb: false }));
    K.cyl(0.01, 0.01, 0.8, '#3a2a22', 1.0, 2.8, -3.6); K.cyl(0.05, 0.12, 0.2, '#c8a040', 1.0, 2.3, -3.6); K.tree(-6, -6, 1.5); K.tree(6.5, -5, 1.3);
    return { spots: { hero: [0, 0, 0.5], steps: [0.6, 0, -3.4], pillar: [-2.6, 0, -2.4] }, cams: { wide: { pos: [0, 2.4, 7], look: [0, 3, -5] }, mid: { pos: [2.2, 1.5, 3], look: [0, 1.4, -0.5] }, close: { pos: [0.7, 1.6, 2.1], look: [0, 1.5, 0.5] } }, tick: (t) => diyas.forEach((L, i) => (L.intensity = 1.3 + 0.25 * Math.sin(t * 9 + i * 1.7))) }; } },
  stadium: { indoor: false, pal: 'cool', desc: 'stadium: pitch with lines, tiered stands with a coloured crowd, floodlights, scoreboard', build(T, st, o, K) {
    K.floor('#3a8a3a', T.tiles('#3f923f', 16, [8, 8])); for (let i = -2; i <= 2; i++) K.box(0.08, 0.02, 40, '#f4f4f4', i * 6, 0.02, -10); K.box(30, 0.02, 0.08, '#f4f4f4', 0, 0.02, -6);
    const crowd = []; for (let tier = 0; tier < 6; tier++) { const z = -18 - tier * 1.2, y = 0.6 + tier * 0.9; K.box(40, 0.9, 1.2, '#4a4e5a', 0, y - 0.45, z); for (let i = 0; i < 60; i++) { if (K.R() < 0.15) continue; const p = K.sph(0.18, K.pick(['#e84a4a', '#3a6ac8', '#f0c040', '#f4f4f4', '#3aa05a']), -19 + i * 0.64 + K.R() * 0.2, y + 0.3, z); crowd.push(p); } }
    for (const x of [-16, 16]) { K.cyl(0.25, 0.3, 14, '#6a6e78', x, 7, -16); K.box(3, 1.2, 0.3, '#e8e8f0', x, 14, -16, { emissive: '#ffffff', emissiveIntensity: 0.6 }); lamp(T, st, [x * 0.9, 13, -14], '#eef4ff', 14, 45, { bulb: false }); }
    K.box(8, 3, 0.3, '#1a1a22', 0, 8.5, -25.5); const sb = K.screen(7.4, 2.5, 0, 8.5, -25.3, 0, '#2a3a8a');
    return { spots: { hero: [0, 0, 1], centre: [0, 0, -6], line: [-6, 0, -4] }, cams: { wide: { pos: [0, 2.2, 6], look: [0, 1.8, -12] }, mid: { pos: [2.6, 1.3, 4], look: [0, 1.2, 0.5] }, close: { pos: [0.6, 1.5, 2.8], look: [0, 1.5, 1] } }, tick: (t) => crowd.forEach((p, i) => (p.position.y += Math.max(0, Math.sin(t * 6 + i)) * 0.004 - 0.002)), scoreboard: sb }; } },
  kitchen: { indoor: true, pal: 'desi', desc: 'family kitchen: counters, stove with steam, fridge, window, hanging pots, dining table', build(T, st, o, K) {
    K.floor('#a87850', T.tiles('#b08050', 10, [8, 8])); K.box(10, 3.2, 0.2, K.P.wall, 0, 1.6, -4); K.box(0.2, 3.2, 10, K.P.wall2, -5, 1.6, 0); K.box(10, 0.2, 10, '#f4ece0', 0, 3.2, 0);
    K.box(6, 0.9, 0.7, '#f2ece0', -1.5, 0.45, -3.5); K.box(6.1, 0.06, 0.75, '#4a4a52', -1.5, 0.93, -3.5); for (let i = 0; i < 5; i++) K.box(1.1, 0.6, 0.35, '#c86a4a', -4 + i * 1.25, 2.3, -3.75);
    K.box(0.9, 0.04, 0.5, '#2a2a30', 0.3, 0.97, -3.5); const pot = K.cyl(0.18, 0.16, 0.22, '#c0c4cc', 0.3, 1.1, -3.5); pot.material.metalness = 0.8; pot.material.roughness = 0.3;
    K.box(0.9, 2.0, 0.8, '#e8ecf0', 3.8, 1.0, -3.5, { roughness: 0.3 }); K.win(1.5, 1.1, -1.8, 1.9, -3.88, 0, { mullions: 2, trees: 0.85, skyline: 0 });
    for (let i = 0; i < 4; i++) { K.cyl(0.005, 0.005, 0.3, '#3a3a3a', -3.6 + i * 0.4, 2.95, -3.0); K.cyl(0.1, 0.08, 0.1, i % 2 ? '#c8a040' : '#a0a4ac', -3.6 + i * 0.4, 2.75, -3.0); }
    K.table(0.8, 0.2, 1.8, 1.0, '#8a5a3a'); K.chair(-0.3, 0.2, Math.PI / 2, '#8a5a3a'); K.chair(1.9, 0.2, -Math.PI / 2, '#8a5a3a'); lamp(T, st, [0.8, 2.4, 0.2], '#ffc880', 2, 4);
    const steam = dust(T, st, { n: 40, area: [0.1, 0.5, 1.2, 2.4, -3.7, -3.3], color: '#ffffff', size: 0.06, opacity: 0.35, rise: 0.35 });
    return { spots: { hero: [0.6, 0, 1.4], stove: [0.3, 0, -2.8], table: [0.8, 0, -0.5] }, cams: { wide: { pos: [2.6, 2.0, 4.4], look: [-0.5, 1.1, -2.5] }, mid: { pos: [1.9, 1.45, 3.0], look: [0.6, 1.2, 1.0] }, close: { pos: [1.0, 1.6, 2.5], look: [0.6, 1.5, 1.4] } }, tick: (t) => steam.tick(t) }; } },
  stage: { indoor: true, pal: 'desi', desc: 'event / wedding stage: velvet curtain, marigold strings, spotlights, rows of chairs, fairy lights', build(T, st, o, K) {
    K.floor('#3a2a34', T.tiles('#42303c', 14, [10, 10])); K.box(8, 0.6, 3, '#5a2a3a', 0, 0.3, -5); for (let i = 0; i < 24; i++) { const c = K.cyl(0.18, 0.18, 4.5, i % 2 ? '#8a1a2a' : '#a02030', -4.6 + i * 0.4, 2.85, -6.3, 10); }
    for (let s = 0; s < 6; s++) for (let i = 0; i < 16; i++) K.sph(0.06, i % 2 ? '#ff9a1a' : '#ffd020', -4.5 + s * 1.8, 4.9 - i * 0.12, -6.0);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) K.chair(-3.5 + c, -1.5 + r * 1.1, Math.PI, r % 2 ? '#e8d8c0' : '#f4ece0');
    for (const x of [-3, 0, 3]) { const L = new K.THREE.SpotLight(new K.THREE.Color('#ffe0b0'), 18, 16, 0.38, 0.5, 1.4); L.position.set(x, 6, 1); L.target.position.set(x * 0.5, 0.6, -5); st.add(L, L.target); }
    for (let i = 0; i < 30; i++) K.bulb([-6 + i * 0.4, 5.2 - Math.abs(Math.sin(i * 0.5)) * 0.3, -2], K.pick(['#ffd080', '#ffb0c0', '#ffffff']), 0.025, 0.1);
    return { spots: { hero: [0, 0.6, -4.6], aisle: [0, 0, 0.8], front: [-1.5, 0, -2.6] }, cams: { wide: { pos: [0, 2.4, 6.5], look: [0, 1.6, -5] }, mid: { pos: [1.8, 1.8, -1.6], look: [0, 1.8, -4.6] }, close: { pos: [0.6, 2.2, -2.8], look: [0, 2.1, -4.6] } } }; } },
  mall: { indoor: true, pal: 'pastel', bright: 0.62, desc: 'shopping mall atrium: glowing shop fronts on two floors, escalator, glass rail, plants, skylight', build(T, st, o, K) {
    K.floor('#e8e0d8', T.tiles('#efe8e0', 12, [10, 10])); K.box(30, 0.3, 4, '#f4f0ec', 0, 3.8, -7); K.box(30, 0.9, 0.06, '#bfe0f0', 0, 4.4, -5.0, { roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.4 });
    for (const [y, z] of [[1.75, -6.0], [5.6, -8.6]]) for (let i = 0; i < 6; i++) { const x = -12.5 + i * 5, c = K.pick(K.P.accent); K.box(4.4, 3.2, 0.1, '#e8dccc', x, y, z - 0.1, { emissive: '#fff4e0', emissiveIntensity: 0.06 }); K.box(4.4, 0.5, 0.15, c, x, y + 1.85, z, { emissive: c, emissiveIntensity: 0.3 }); }
    K.box(30, 7.6, 0.2, '#e0d8d0', 0, 3.8, -9); const esc = K.box(1.2, 0.2, 6.5, '#c8ccd4', 4, 1.9, -1.5, { metalness: 0.6, roughness: 0.3 }); esc.rotation.x = 0.6; K.box(40, 0.2, 30, '#f4f4f4', 0, 8, -5); K.win(10, 6, 0, 7.88, -4, 0, { skyline: 0, mullions: 6 }).rotation.x = Math.PI / 2;
    K.plant(-5, -1.5, 1.6); K.plant(6.8, 1, 1.5); K.plant(-8, 1.5, 1.4);
    return { spots: { hero: [0, 0, 1.5], shop: [-2.5, 0, -4.5], escalator: [3, 0, 2.2] }, cams: { wide: { pos: [0, 2.1, 7], look: [0, 1.7, -6] }, mid: { pos: [2.3, 1.5, 4.2], look: [0, 1.3, 1.2] }, close: { pos: [0.7, 1.6, 3.3], look: [0, 1.5, 1.5] } } }; } },
  rooftop: { indoor: false, pal: 'neon', desc: 'rooftop at night: water tank, railing, fairy lights, city skyline all around', build(T, st, o, K) {
    K.floor('#3a3a42', T.tiles('#42424a', 10, [8, 8])); for (const [w, d, x, z] of [[12, 0.1, 0, -4], [0.1, 8, -6, 0], [0.1, 8, 6, 0]]) { K.box(w, 1.0, d, '#5a5a62', x, 0.5, z); K.box(w, 0.06, d || 0.1, '#8a8a92', x, 1.05, z); }
    K.cyl(0.8, 0.8, 1.6, '#3a5a8a', -4.2, 2.4, -2.6); for (const dx of [-0.5, 0.5]) for (const dz of [-0.5, 0.5]) K.box(0.08, 1.6, 0.08, '#2a2a30', -4.2 + dx, 0.8, -2.6 + dz);
    for (let i = 0; i < 24; i++) K.bulb([-5.5 + i * 0.48, 2.3 - Math.sin(i / 23 * Math.PI) * 0.4, -3.9], K.pick(['#ffd080', '#ff9ab0', '#9ad0ff']), 0.03, 0.12);
    const sky = new K.THREE.Mesh(new K.THREE.CylinderGeometry(40, 40, 18, 48, 1, true), new K.THREE.MeshBasicMaterial({ map: skyTex(T, K.M.sky, { skyline: 0.72, skyH: 160, lit: Math.max(0.3, K.M.lit), stars: K.M.stars || 0, w: 2048, seed: o.seed }), side: K.THREE.BackSide, fog: false })); sky.position.y = 6; st.add(sky);
    return { spots: { hero: [0, 0, 0], rail: [1.5, 0, -3.3], tank: [-3, 0, -1.4] }, cams: { wide: { pos: [0, 1.9, 5.5], look: [0, 1.6, -6] }, mid: { pos: [2.0, 1.4, 2.6], look: [0, 1.25, -0.3] }, close: { pos: [0.6, 1.6, 1.8], look: [0, 1.5, 0] } } }; } },
  void: { indoor: true, pal: 'neon', desc: 'stylised void / memory space: dark floor, a pool of light, floating particles (emotional lows, inner thoughts)', build(T, st, o, K) {
    const f = K.floor('#0a0a14'); f.material.roughness = 0.3; f.material.metalness = 0.3; lamp(T, st, [0, 4, 0.5], K.M.rim || '#c8d8ff', 6, 8, { bulb: false });
    const disc = new K.THREE.Mesh(new K.THREE.CircleGeometry(1.4, 48), new K.THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.08 })); disc.rotation.x = -Math.PI / 2; disc.position.y = 0.01; st.add(disc);
    const d = dust(T, st, { n: 220, area: [-5, 5, 0, 4, -6, 3], color: '#c8d8ff', opacity: 0.6 });
    return { spots: { hero: [0, 0, 0], left: [-1.4, 0, -0.6], right: [1.4, 0, -0.6] }, cams: { wide: { pos: [0, 2.0, 6], look: [0, 1, 0] }, mid: { pos: [1.6, 1.4, 2.8], look: [0, 1.2, 0] }, close: { pos: [0.5, 1.6, 1.9], look: [0, 1.5, 0] } }, tick: (t) => d.tick(t) }; } },
};

// ---------- the builder ----------
export function world(T, name, o = {}) {
  const Wd = WORLDS[name]; if (!Wd) throw new Error(`unknown world '${name}'. Options: ${Object.keys(WORLDS).join(', ')}`);
  const mood = o.mood || (Wd.indoor ? 'dusk' : 'golden'), M = MOODS[mood];
  // brightness: viewers drop off on murky frames. Lift ambient (faces) more than key so it stays cinematic; o.bright 1 = old look
  const B = (o.bright ?? 1.35) * (Wd.bright ?? 1), dark = ['night', 'rain'].includes(mood) ? 1.25 : 1;
  const st = lifeStage(T, { sky: M.sky, fogColor: M.fogColor, fog: M.fog, key: M.key * (Wd.indoor ? 0.95 : 1.1) * B, keyColor: M.keyColor, keyPos: M.keyPos, ambient: M.ambient * (Wd.indoor ? 1.25 : 1.1) * B * dark, ambientSky: M.ambientSky, rim: M.rim, fill: M.fill, focus: o.focus ?? 3.5, aperture: o.aperture ?? 0.002, beauty: false, ...(o.stage || {}) });
  // beauty light: soft warm fill from the camera side so faces always read (animated-film trick), + a sky/ground hemi lift
  { const { THREE } = T; const fl = new THREE.DirectionalLight(new THREE.Color(o.faceLight || '#ffe6d2'), (o.faceLightIntensity ?? 1.25) * B * (dark > 1 ? 1.15 : 1)); fl.position.set(1.5, 2.6, 9); st.add(fl);
    const hemi = new THREE.HemisphereLight(new THREE.Color(M.ambientSky), new THREE.Color(M.fogColor), 0.55 * B * dark); st.add(hemi); }
  const K = kit(T, st, { ...o, mood, defPal: Wd.pal });
  const r = Wd.build(T, st, { ...o, mood }, K) || {};
  const ticks = [r.tick].filter(Boolean);
  if (M.rain && !Wd.indoor) { const rn = rain(T, st, { area: [-6, 6, 0, 7, -10, 5] }); ticks.push((t) => { rn.tick(t); rn.splash(t); }); }
  if (M.rain && Wd.indoor) ticks.push(() => {});
  if (M.motes || o.motes) { const d = dust(T, st, { n: 140, area: [-5, 5, 0, 3.5, -5, 3], color: '#ffe0f0' }); ticks.push((t) => d.tick(t)); }
  if (o.bokeh ?? (mood === 'night' || mood === 'rain' || mood === 'dusk')) { const b = bokeh(T, st, { n: 22, area: [-10, 10, 0.8, 5, -18, -10] }); ticks.push((t) => b.tick(t)); }
  return { stage: st, spots: r.spots || {}, cams: r.cams || {}, mood, name, refs: r, tick: (t) => ticks.forEach((f) => f(t)) };
}
// list for storyboards: [{name, desc, moods}]
export const worldMenu = () => Object.entries(WORLDS).map(([k, v]) => ({ name: k, desc: v.desc, indoor: v.indoor, moods: Object.keys(MOODS) }));
