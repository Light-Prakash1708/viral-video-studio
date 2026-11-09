// sets/kit.js: shared stage builders, blocking and camera helpers for "The Last Human Job on Earth".
import { ease, clamp, lerp, prog } from '/engine/core.js';
import { lifeStage } from './lifesim.js';
import { SKIES, local, cam } from './fc.js';
import { person2 } from './cast.js';
import { station, robot, HARI, BOSE, ARJUN, MEERA, MEERA_ADULT, CUSTOMERS, life, blinkFace, hold } from './film.js';

export const LIGHT = {
  dawn:    { sky: ['#2a3a6a', '#7a6a9a', '#ffa070', '#ffd8a0'], fogColor: '#c89a8a', fog: [10, 60], key: 2.4, keyColor: '#ffc890', keyPos: [-8, 4, -2], ambient: 1.55, ambientSky: '#b8b8e0', rim: '#ffb070', fill: '#7ac8d8', lit: 0.25 },
  morning: { sky: SKIES.golden, fogColor: '#d8a880', fog: [12, 70], key: 2.8, keyColor: '#ffd0a0', keyPos: [-9, 6, 3], ambient: 1.7, ambientSky: '#c8c8e8', rim: '#ffc080', fill: '#8ad0e0', lit: 0.1 },
  day:     { sky: ['#6aa8e8', '#a8d0f0', '#e8f2fa'], fogColor: '#c8dcec', fog: [14, 80], key: 3.0, keyColor: '#fff2dc', keyPos: [6, 10, 6], ambient: 1.9, ambientSky: '#d8e8ff', rim: '#ffe0b0', fill: '#a0d8ff', lit: 0.0 },
  evening: { sky: SKIES.dusk, fogColor: '#5a3a6a', fog: [10, 55], key: 2.0, keyColor: '#ffa880', keyPos: [9, 3, -4], ambient: 1.45, ambientSky: '#9a8ad0', rim: '#ff9a7a', fill: '#5fd0d0', lit: 0.45 },
  night:   { sky: SKIES.night, fogColor: '#101838', fog: [9, 50], key: 0.9, keyColor: '#9ab8ff', keyPos: [-6, 9, 4], ambient: 1.25, ambientSky: '#6a8ad8', rim: '#7fb8ff', fill: '#4ac0d0', lit: 0.75 },
};
export function stationStage(T, mood = 'morning', o = {}) {
  const L = LIGHT[mood];
  const st = lifeStage(T, { ...L, key: L.key, focus: o.focus ?? 3.2, aperture: o.aperture ?? 0.0025, maxblur: o.maxblur ?? 0.01, beauty: o.beauty ?? 1.0 });
  const S = station(T, st, { sky: L.sky, lit: L.lit, bulb: mood === 'night' ? 3 : 2.2, ...o });
  return { stage: st, S, stall: S.stall };
}
// blocking (world coords; stall front faces +z)
export const P = { hari: [0.15, 0, -2.05], front: [0.3, 0, -0.42], front2: [-0.6, 0, -0.35], m7side: [2.15, 0, -0.55], m7counter: [0.15, 0, -2.0], bench: [-7.5, 0, 1.0] };
export const place = (st, ch, pos, rotY = 0) => { ch.position.set(...pos); ch.rotation.y = rotY; st.add(ch); return ch; };
export const hari = (T, st, pos = P.hari, r = 0) => place(st, person2(T, HARI), pos, r);
export const m7 = (T, st, pos = P.m7side, r = -1.9, o = {}) => place(st, robot(T, o), pos, r);
export const queue = (T, st, n = 12, o = {}) => Array.from({ length: n }, (_, i) => { const c = person2(T, CUSTOMERS[i % CUSTOMERS.length], { s: 0.94 + ((i * 37) % 10) / 100 }); return place(st, c, [0.6 + i * 0.62 + (o.dx || 0), 0, -0.15 + (i % 2) * 0.12], -Math.PI / 2); });
export const C = (pos, look, fov) => ({ pos, look, ...(fov ? { fov } : {}) });
export const move = (T, s, t, info, a, b, e = ease.inOut) => cam(T, s.stage, t, info.dur, a, b, e);
export const talk = (t, on, off) => (t > on && t < off && Math.sin(t * 17) > -0.2 ? 'talk' : null);
export { ease, clamp, lerp, prog, local, person2, robot, HARI, BOSE, ARJUN, MEERA, MEERA_ADULT, CUSTOMERS, life, blinkFace, hold };
