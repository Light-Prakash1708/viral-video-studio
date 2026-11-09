import { registerShot, text, E } from '/engine/core.js';
import { world } from '../sets/worlds.js';
import { person2 } from '../sets/cast.js';
const X = ['sad', 'cry', 'worried', 'angry', 'nervous', 'proud'];
registerShot('F', { kind: '3d', init: (T) => { const W = world(T, 'classroom', { mood: 'day' }); const cs = X.map((e, i) => { const c = person2(T, 'hero'); c.position.set((i - 2.5) * 0.85, 0, 0.8); W.stage.add(c); return c; }); return { stage: W.stage, W, cs }; },
  draw(s, t, info, T) { s.cs.forEach((c, i) => c.set({ expr: X[i] })); s.stage.camera.position.set(0, 1.55, 4.0); s.stage.camera.lookAt(0, 1.5, 0); }, overlay(g) { X.forEach((e, i) => text(g, e, E.W / 2 + (i - 2.5) * 300, 900, { size: 40, font: 'Nunito', weight: 900, color: '#fff' })); } });
