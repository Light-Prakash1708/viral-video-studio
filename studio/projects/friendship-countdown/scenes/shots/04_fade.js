// shots/04_fade.js: numbers shrinking, the Dutch study, the fade, the rooftop reveal (f32–f44).
import { E, V, registerShot, ease, prog, clamp, lerp, rng, alpha, text, glow, circle, rr, seg } from '/engine/core.js';
import { LOOK, faceTo, person, local, blinkAt, cam, proj, tag, roll, hud, tone, vignette, topBand, serif, bigText, cite, panel, darken, icon, chat, stageFor, canteen, rooftop, voidSet, spotPool, dust, plane3D, sprite, skyTex, SKIES, bokeh } from '../sets/fc.js';

const life = (p, t, seed, o = {}) => p.set({ breathe: t + seed, expr: o.expr ?? (blinkAt(t, seed) ? 'blink' : 'neutral'), ...o });
const crowdVals = (n, seed = 3) => { const R = rng(seed); return Array.from({ length: n }, () => 30 + Math.floor(R() * 3000)); };

// f32: cold blue wide: every number ticks down
registerShot('f32', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 6, aperture: 0.0015, maxblur: 0.006 }); const set = canteen(T, st, { clear: [[0.15, -0.15], [-0.1, 1.38]] });
    const you = person(T, st, 'you', [-0.1, 1.38], Math.PI, { y: 0.2, set: { sit: true } }); return { stage: st, set, you, vals: crowdVals(set.heads.length, 12) }; },
  draw(s, t, info, T) { s.set.tick(t + 40); life(s.you, t, 1, { look: [0, 0.6], nod: -0.2 });
    cam(T, s.stage, t, info.dur, { pos: [4.6, 3.0, 6.6], look: [0, 1.0, -2.5] }, { pos: [3.4, 3.3, 6.9], look: [0, 0.9, -2.8] }); s.stage.focusOn([0, 1.2, -1.5]); s.PH = s.set.heads.map((h) => proj(T, s.stage, [h[0], h[1] + 0.55, h[2]])); },
  overlay(g, t, info, s) { const sh = local(info, t, 'shrinking') ?? 3.5; tone(g, 'cold', ease.out(prog(t, 0, 1.2)));
    s.PH.forEach((P, i) => { const v0 = s.vals[i], v = Math.max(1, Math.round(v0 * (1 - 0.6 * ease.inOut(prog(t, 0.6 + (i % 7) * 0.05, sh + 0.4))))); tag(g, P, v, { t, seed: i, kind: v < 7 ? 'red' : v < 100 ? 'amber' : 'cold', pop: ((t * 2 + i * 0.13) % 1) }); });
    hud(g, t, { color: '#9cc8ff' }); vignette(g, 0.6); },
});
// f33: Riya talks; YOU stares up at the numbers, not listening
registerShot('f33', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 2.4, aperture: 0.005 }); const set = canteen(T, st, { clear: [[1.4, 2.2], [0.2, 2.4]] });
    const r = faceTo(person(T, st, 'riya', [1.3, 2.3]), 0.1, 2.5), y = faceTo(person(T, st, 'you', [0.1, 2.5]), 1.3, 2.3); y.rotation.y += 0.4; return { stage: st, set, r, y }; },
  draw(s, t, info, T) { s.set.tick(t + 44); const tk = Math.sin(t * 15) > 0; life(s.r, t, 1, { expr: t > 3.2 ? 'sad' : tk ? 'talk' : 'happy', look: [0, 0], armR: 0.3 + 0.3 * Math.abs(Math.sin(t * 2)), tilt: 0.05 * Math.sin(t * 3) });
    life(s.y, t, 2, { expr: 'neutral', look: [0.3, 1.0], nod: -0.25 });
    cam(T, s.stage, t, info.dur, { pos: [-1.1, 1.65, 5.3], look: [0.7, 1.75, 2.4] }, { pos: [-0.8, 1.65, 4.9], look: [0.7, 1.8, 2.4] }); s.stage.focusOn(s.y.userData.head); s.P = proj(T, s.stage, s.r, 0.66); s.Py = proj(T, s.stage, s.y, 0.66); },
  overlay(g, t, info, s) { tone(g, 'cold', 1); const v = roll(t, 0.3, info.dur, 2460, 1980);
    const li = local(info, t, 'listening') ?? 3.6; [0.4, 1.3, 2.2, 3.1].forEach((t0, i) => { const k = prog(t, t0, t0 + 1.6); if (k > 0 && k < 1) chat(g, s.P.x + 200 + i * 10, s.P.y + 150 - 140 * k, ['so then I told them…', 'are you even…', 'hello?', '…'][i], (1 - k) * 0.9 * (t > li && i < 3 ? 0.4 : 1), { left: true, size: 26, bg: 'rgba(220,228,245,.85)' }); });
    tag(g, s.P, v, { t, kind: 'cold', pop: (t * 3) % 1 }); hud(g, t, { color: '#9cc8ff' }); vignette(g, 0.6); },
});
// f34: Dutch study card
registerShot('f34', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 0.5, aperture: 0.025, maxblur: 0.025 }); const set = canteen(T, st, { clear: [[0, 0]] }); return { stage: st, set }; },
  draw(s, t, info, T) { s.set.tick(t + 50); cam(T, s.stage, t, info.dur, { pos: [3, 2.2, 5], look: [0, 1.2, -3] }, { pos: [1.5, 2.1, 4.5], look: [0, 1.2, -3] }, ease.linear); },
  overlay(g, t, info, s) { const hf = local(info, t, 'half') ?? 2.73, sv = local(info, t, 'seven') ?? 4.77; tone(g, 'cold', 0.8); darken(g, 0.45);
    const a = ease.out(prog(t, 0, 0.4)), x = E.W / 2 - 760, y = E.H * 0.25, w = 1520, h = 560; panel(g, x, y, w, h, a, '#9cc8ff');
    serif(g, 'A Dutch study of close friendships', E.W / 2, E.H * 0.15, { size: 52, a });
    const yr = Math.min(7, Math.floor(lerp(0, 7, prog(t, 1.2, sv + 0.3)))); text(g, `YEAR ${yr}`, E.W / 2, y + 70, { size: 44, font: 'Nunito', weight: 900, color: '#ffffff', alpha: a, spacing: 6 });
    rr(g, x + 120, y + 112, w - 240, 10, 5); g.fillStyle = alpha('#9cc8ff', 0.25 * a); g.fill(); rr(g, x + 120, y + 112, (w - 240) * yr / 7, 10, 5); g.fillStyle = alpha('#9cc8ff', 0.9 * a); g.fill();
    const lose = [1, 3, 4, 7, 8]; for (let i = 0; i < 10; i++) { const k = lose.includes(i) ? ease.inOut(prog(t, hf - 0.2 + i * 0.06, hf + 0.8 + i * 0.06)) : 0; const cx = x + 190 + i * ((w - 380) / 9);
      icon(g, cx, y + 300 + k * 30, 1.8, k > 0.5 ? '#5a6078' : '#7fe8d8', a * (1 - 0.75 * k)); }
    const kk = ease.out(prog(t, hf + 0.4, hf + 0.9)); bigText(g, 'ABOUT HALF REPLACED IN 7 YEARS', E.W / 2, y + 450, { size: 54, a: a * kk, color: '#cfe0ff', glowColor: 'rgba(120,170,255,.6)' });
    cite(g, 'Mollenhorst, 2009 · Utrecht University', E.W / 2, y + h - 34, a); hud(g, t, { color: '#9cc8ff' }); vignette(g, 0.6); },
});
// f35: void: two friends under separate spotlights; the gap stretches; chat dots fade
registerShot('f35', { kind: '3d',
  init(T) { const st = stageFor(T, 'void', { focus: 5, aperture: 0.003 }); const set = voidSet(T, st); const sA = spotPool(T, st, -0.8, 0, '#9fc8ff'), sB = spotPool(T, st, 0.8, 0, '#ffd0a0');
    const a = person(T, st, 'you', [-0.8, 0], 0.5), b = person(T, st, { ...LOOK.riya, rim: '#c8d4e8' }, [0.8, 0], -0.5); return { stage: st, set, a, b, sA, sB }; },
  draw(s, t, info, T) { s.set.tick(t); const k = ease.inOut(prog(t, 0.2, info.dur)), xa = -0.8 - 1.6 * k, xb = 0.8 + 1.6 * k;
    s.a.position.x = xa; s.b.position.x = xb; s.sA.cone.position.x = s.sA.pool.position.x = s.sA.light.position.x = s.sA.light.target.position.x = xa; s.sB.cone.position.x = s.sB.pool.position.x = s.sB.light.position.x = s.sB.light.target.position.x = xb;
    life(s.a, t, 1, { expr: 'sad', look: [0.4, -0.3] }); life(s.b, t, 2, { expr: 'sad', look: [-0.4, -0.3] });
    cam(T, s.stage, t, info.dur, { pos: [0, 2.2, 6.0], look: [0, 1.3, 0] }, { pos: [0, 2.8, 7.6], look: [0, 1.2, 0] }); s.stage.focusOn([0, 1.3, 0]); s.Pa = proj(T, s.stage, s.a, 0.1); s.Pb = proj(T, s.stage, s.b, 0.1); },
  overlay(g, t, info, s) { const si = local(info, t, 'silence') ?? 2.34; const mx = (s.Pa.x + s.Pb.x) / 2, my = s.Pa.y - 40; const fa = 1 - ease.out(prog(t, si, si + 0.8));
    for (let i = 0; i < 3; i++) circle(g, mx - 40 + i * 40, my, 10, alpha('#ffffff', fa * (0.4 + 0.6 * Math.max(0, Math.sin(t * 6 - i)))));
    tag(g, s.Pb, roll(t, 0, info.dur, 900, 610), { t, kind: 'cold', s: 0.9, dy: -60 }); hud(g, t, { color: '#9cc8ff' }); vignette(g, 0.7); },
});
// f36: "they fade": the number dims and drifts away as motes; the friend fades into the dark
registerShot('f36', { kind: '3d',
  init(T) { const st = stageFor(T, 'void', { focus: 3.4, aperture: 0.004 }); const set = voidSet(T, st); const sp = spotPool(T, st, 0, 0, '#c8d4ff', 0.1); const b = person(T, st, { ...LOOK.riya, rim: '#c8d4e8' }, [0, 0], -0.3);
    const m = dust(T, st, { n: 120, area: [-0.8, 0.8, 1.9, 3.4, -0.4, 0.4], color: '#cfe0ff', size: 0.04, opacity: 0.0, rise: 0.25 }); return { stage: st, set, b, sp, m }; },
  draw(s, t, info, T) { s.set.tick(t); const fd = local(info, t, 'fade') ?? 2.09, k = ease.inOut(prog(t, fd - 0.3, info.dur)); s.m.tick(t); s.m.material.opacity = 0.8 * k;
    s.sp.light.intensity = 18 * (1 - 0.8 * k); s.sp.cone.material.opacity = 0.05 * (1 - k); s.sp.pool.material.opacity = 0.1 * (1 - k); if (s.b.userData.aura) s.b.userData.aura.opacity = 0.55 * (1 - k);
    life(s.b, t, 1, { expr: 'sad', look: [0, -0.4], nod: 0.2 });
    cam(T, s.stage, t, info.dur, { pos: [0.6, 1.9, 3.6], look: [0, 1.8, 0] }, { pos: [0.4, 2.0, 3.0], look: [0, 1.95, 0] }); s.stage.focusOn(s.b.userData.head); s.P = proj(T, s.stage, s.b, 0.66); },
  overlay(g, t, info, s) { const fd = local(info, t, 'fade') ?? 2.09, ex = local(info, t, 'explode') ?? 0.85, k = ease.inOut(prog(t, fd - 0.3, info.dur));
    if (t > ex && t < ex + 0.5) glow(g, s.P.x, s.P.y, 120, '#ff6a4a', 0.15 * Math.sin(prog(t, ex, ex + 0.5) * Math.PI));
    tag(g, s.P, Math.max(1, Math.round(610 * (1 - k))), { t, kind: 'cold', a: 1 - k, dy: -k * 60, s: 1.0 - 0.3 * k }); hud(g, t, { color: '#9cc8ff', a: 1 - 0.5 * k }); vignette(g, 0.75); },
});

// ---------------- rooftop ----------------
const KZ = -2.2, KX = 0.45, YX = -0.45, LEDGE_Y = 0.68;
function roof(T, o = {}) { const st = stageFor(T, 'night', { focus: o.focus ?? 3, aperture: o.aperture ?? 0.004, maxblur: o.maxblur ?? 0.012 }); const set = rooftop(T, st);
  const k = person(T, st, 'kabir', [KX, KZ], -0.15, { y: LEDGE_Y, set: { sit: true } }); const y = o.youStand ? null : person(T, st, 'you', [YX, KZ], 0.15, { y: LEDGE_Y, set: { sit: true } });
  const moonL = new T.THREE.DirectionalLight(new T.THREE.Color('#a8b8ff'), 0.6); moonL.position.set(4, 6, 6); st.add(moonL);
  return { stage: st, set, k, y }; }
const KH = [KX, LEDGE_Y - 0.38 + 1.62, KZ], YH = [YX, LEDGE_Y - 0.38 + 1.62, KZ];
registerShot('f37', { kind: '3d',
  init(T) { return roof(T, { focus: 4.5, aperture: 0.003 }); },
  draw(s, t, info, T) { s.set.tick(t); life(s.k, t, 1, { look: [-0.3, -0.3], nod: 0.15 }); life(s.y, t, 2, { expr: 'happy', look: [0.6, 0] });
    cam(T, s.stage, t, info.dur, { pos: [2.4, 2.4, 3.2], look: [0, 1.5, KZ] }, { pos: [1.8, 2.2, 2.6], look: [0, 1.6, KZ] }); s.stage.focusOn(KH); s.P = proj(T, s.stage, s.k, 0.66); },
  overlay(g, t, info, s) { const d3 = local(info, t, '3,') ?? 0.6; serif(g, 'day 3', E.W / 2, E.H * 0.1, { size: 44, a: ease.out(prog(t, d3, d3 + 0.4)) }); tag(g, s.P, 3, { t, pop: t - d3, s: 1.6 }); hud(g, t, { color: '#ff7a7a' }); vignette(g, 0.6); },
});
registerShot('f38', { kind: '3d',
  init(T) { return roof(T, { focus: 2.0, aperture: 0.006 }); },
  draw(s, t, info, T) { s.set.tick(t + 3); life(s.k, t, 1, { expr: t > 0.15 && t < 3.0 && Math.sin(t * 15) > -0.2 ? 'talk' : 'sad', look: [-0.35, -0.1], nod: 0.05 }); life(s.y, t, 2);
    cam(T, s.stage, t, info.dur, { pos: [0.05, 2.05, -0.1], look: [KX, 2.2, KZ] }, { pos: [0.12, 2.05, -0.35], look: [KX, 2.22, KZ] }, ease.linear); s.stage.focusOn(KH); s.P = proj(T, s.stage, s.k, 0.66); },
  overlay(g, t, info, s) { tag(g, s.P, 3, { t, s: 0.9 }); hud(g, t, { color: '#ff7a7a' }); vignette(g, 0.65); },
});
registerShot('f39', { kind: '3d',
  init(T) { return roof(T, { focus: 2.0, aperture: 0.006 }); },
  draw(s, t, info, T) { s.set.tick(t + 6); life(s.y, t, 2, { expr: t < 0.8 ? 'surprised' : 'sad', look: [0.4, -0.1] }); life(s.k, t, 1, { expr: 'sad' });
    cam(T, s.stage, t, info.dur, { pos: [0.1, 2.0, -0.25], look: [YX, 1.95, KZ] }, { pos: [0.02, 2.0, -0.45], look: [YX, 1.97, KZ] }, ease.linear); s.stage.focusOn(YH); },
  overlay(g, t, info, s) { hud(g, t, { color: '#ff7a7a' }); vignette(g, 0.65); },
});
registerShot('f40', { kind: '3d',
  init(T) { return roof(T, { focus: 1.2, aperture: 0.01 }); },
  draw(s, t, info, T) { s.set.tick(t + 8); life(s.k, t, 1, { expr: 'sad', look: [0, -0.3] });
    cam(T, s.stage, t, info.dur, { pos: [0.6, 1.9, -0.6], look: [KX, 2.3, KZ] }, { pos: [0.55, 1.95, -0.85], look: [KX, 2.35, KZ] }, ease.linear); s.stage.focusOn([KX, 2.6, KZ]); s.P = proj(T, s.stage, s.k, 0.66); },
  overlay(g, t, info, s) { const fi = local(info, t, 'fight') ?? 1.67; const gl = (t < 0.5 || (t > 1.2 && t < 1.45)) ? Math.abs(Math.sin(t * 40)) : 0;
    tag(g, s.P, 3, { t, s: 1.15, glitch: gl }); serif(g, 'Not a fight.', E.W / 2, E.H * 0.1, { size: 50, a: ease.out(prog(t, fi - 0.5, fi - 0.2)) }); hud(g, t, { color: '#ff7a7a' }); vignette(g, 0.7); },
});
// f41: a flight: plane silhouette across a dusk sky
registerShot('f41', { kind: '3d',
  init(T) { const st = stageFor(T, 'sky', { dof: false, fog: [80, 600] }); const { THREE } = T;
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(900, 360), new THREE.MeshBasicMaterial({ map: skyTex(T, ['#141634', '#2c2a62', '#6a3e7a', '#d0687a', '#ffb07a', '#ffd8a0'], { h: 1024, sun: [0.62, 0.86, 0.02, '#ffd0a0'], clouds: 24, stars: 60, skyline: 0.985, skyH: 30, lit: 0.2 }), fog: false })); sky.position.set(0, 40, -300); st.add(sky);
    const p = plane3D(T, { color: '#120f22', lights: true }); p.scale.setScalar(2); st.add(p);
    const trail = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.08, 1, 10), new THREE.MeshBasicMaterial({ color: '#ffe8e0', transparent: true, opacity: 0.35, depthWrite: false })); trail.rotation.z = Math.PI / 2; st.add(trail);
    const clouds = [0, 1, 2, 3, 4].map((i) => sprite(T, st, [-60 + i * 30, 6 + (i % 2) * 6, -60 - i * 8], [40, 6, 1], '#ff9a8a', 0.12)); return { stage: st, p, trail, clouds }; },
  draw(s, t, info, T) { const x = lerp(-55, 45, t / info.dur), y = 18 + t * 1.2; s.p.position.set(x, y, -70); s.p.rotation.set(0.05, 0, 0.08);
    const len = Math.max(1, x + 70); s.trail.scale.set(1, len, 1); s.trail.position.set(x - 8 - len / 2, y + 0.2, -70);
    s.clouds.forEach((c, i) => (c.position.x = -60 + i * 30 + t * 2));
    cam(T, s.stage, t, info.dur, { pos: [0, 2, 10], look: [-10, 14, -70] }, { pos: [0, 2, 10], look: [12, 16, -70] }); },
  overlay(g, t, info, s) { const fl = local(info, t, 'flight') ?? 0.25, th = local(info, t, 'three') ?? 1.37; topBand(g, 1, 0.3);
    serif(g, 'A flight.', E.W / 2, E.H * 0.1, { size: 54, a: ease.out(prog(t, fl - 0.1, fl + 0.3)) });
    const k = ease.outBack(prog(t, th - 0.1, th + 0.3)); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.2); g.scale(k, k); bigText(g, '3 DAYS', 0, 0, { size: 96, color: '#ffd0c0', glowColor: 'rgba(255,90,90,.7)' }); g.restore(); }
    hud(g, t, { color: '#ff7a7a' }); vignette(g, 0.5); },
});
registerShot('f42', { kind: '3d',
  init(T) { return roof(T, { focus: 1.9, aperture: 0.006 }); },
  draw(s, t, info, T) { s.set.tick(t + 10); const an = local(info, t, 'angry') ?? 0.65, ac = local(info, t, 'act') ?? 1.81;
    life(s.y, t, 1, { expr: t < ac ? 'determined' : blinkAt(t, 1) ? 'blink' : 'smug', look: t < ac ? [0.4, 0] : [-0.8, 0.3], armL: t > ac ? 0.9 : 0.25, armR: t > ac ? 0.9 : 0.25, tilt: t > ac ? 0.1 : 0 }); life(s.k, t, 2, { expr: 'sad' });
    s.y.userData.body.position.x = t < ac ? 0.02 * Math.sin(t * 30) * (t > an ? 1 : 0) : 0;
    cam(T, s.stage, t, info.dur, { pos: [-1.0, 1.95, -0.4], look: [YX, 2.0, KZ] }, { pos: [-0.85, 1.95, -0.6], look: [YX, 2.0, KZ] }, ease.linear); s.stage.focusOn(YH); },
  overlay(g, t, info, s) { const an = local(info, t, 'angry') ?? 0.65, ac = local(info, t, 'act') ?? 1.81; if (t > an && t < ac) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,60,40,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore(); } hud(g, t, { color: '#ff7a7a' }); vignette(g, 0.65); },
});
registerShot('f43', { kind: '3d',
  init(T) { const r = roof(T, { focus: 3.4, aperture: 0.004, youStand: true }); r.y = person(T, r.stage, 'you', [-1.1, -1.4], 0.4); return r; },
  draw(s, t, info, T) { s.set.tick(t + 13); const nv = local(info, t, 'never') ?? 2.23; life(s.y, t, 1, { expr: 'determined', look: [0.5, 0], armL: 0.15, armR: 0.15 }); life(s.k, t, 2, { expr: 'sad', look: [-0.3, -0.3] });
    cam(T, s.stage, t, info.dur, { pos: [-3.0, 1.2, 1.6], look: [-0.4, 1.6, KZ] }, { pos: [-2.5, 1.0, 1.1], look: [-0.4, 1.7, KZ] }); s.stage.focusOn(s.y.userData.head); s.P = proj(T, s.stage, s.k, 0.66); },
  overlay(g, t, info, s) { const nv = local(info, t, 'never') ?? 2.23; tag(g, s.P, 3, { t, a: 1 - 0.6 * ease.out(prog(t, nv, nv + 0.6)), s: 0.9 }); hud(g, t, { color: '#ff7a7a' }); vignette(g, 0.6); },
});
registerShot('f44', { kind: '3d',
  init(T) { const r = roof(T, { focus: 2.4, aperture: 0.005, youStand: true }); r.y = person(T, r.stage, 'you', [-0.35, -1.5], 0.3); return r; },
  draw(s, t, info, T) { s.set.tick(t + 16); const k = ease.out(prog(t, 0.0, 0.5)); s.y.position.set(lerp(-0.9, -0.2, k), 0, lerp(-1.0, -1.6, k));
    life(s.y, t, 1, { expr: 'determined', look: [0.5, -0.3], armR: 0.3 + 1.0 * ease.out(prog(t, 0.3, 0.7)), reachR: 0.8 * ease.out(prog(t, 0.3, 0.7)), walk: t < 0.5 ? t * 9 : 0 });
    life(s.k, t, 2, { expr: t > 0.6 ? 'happy' : 'surprised', look: [-0.7, 0.2] });
    cam(T, s.stage, t, info.dur, { pos: [0.9, 0.7, 1.4], look: [0.0, 1.8, KZ] }, { pos: [0.75, 0.75, 1.1], look: [0.0, 1.85, KZ] }); s.stage.focusOn([0, 1.8, -1.9]); },
  overlay(g, t, info, s) { hud(g, t, { color: '#ff7a7a' }); vignette(g, 0.6); },
});
