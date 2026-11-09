// shots/06_end.js: Harvard study, old friends, the taxi mirror, the CTA (f57–f66).
import { E, V, registerShot, ease, prog, clamp, lerp, rng, alpha, text, glow, circle, rr, seg, linGrad } from '/engine/core.js';
import { LOOK, faceTo, person, local, blinkAt, cam, proj, tag, roll, hud, tone, vignette, topBand, serif, bigText, cite, panel, darken, icon, lemniscate, stageFor, airport, gully, lowWall, phone3D, sprite, bokeh, lamp, dust, TAGC } from '../sets/fc.js';

const life = (p, t, seed, o = {}) => p.set({ breathe: t + seed, expr: o.expr ?? (blinkAt(t, seed) ? 'blink' : 'neutral'), ...o });
const blurAirport = (T) => { const st = stageFor(T, 'airport', { focus: 0.5, aperture: 0.025, maxblur: 0.025 }); const set = airport(T, st); return { stage: st, set }; };

registerShot('f57', { kind: '3d',
  init(T) { return blurAirport(T); },
  draw(s, t, info, T) { s.set.tick(t); cam(T, s.stage, t, info.dur, { pos: [-3, 2.2, 5], look: [0, 2.4, -10] }, { pos: [-1, 2.2, 4.4], look: [0, 2.5, -10] }, ease.linear); },
  overlay(g, t, info, s) { const hv = local(info, t, 'harvard') ?? 2.9, ei = local(info, t, 'eighty') ?? 5.06; tone(g, 'gold', 0.3); darken(g, 0.5); const a = ease.out(prog(t, 0, 0.4));
    const x = E.W / 2 - 760, y = E.H * 0.25, w = 1520, h = 560; panel(g, x, y, w, h, a, '#ffcf5a');
    serif(g, 'The longest study on happiness', E.W / 2, E.H * 0.15, { size: 52, a });
    text(g, 'HARVARD', E.W / 2, y + 62, { size: 40, font: 'Nunito', weight: 900, color: '#ffe8b0', alpha: a * ease.out(prog(t, hv - 0.2, hv + 0.2)), spacing: 10 });
    const k = ease.inOut(prog(t, 0.6, ei + 0.4)), lx = x + 130, lw = w - 260, ly = y + 300; seg(g, [[lx, ly], [lx + lw * k, ly]], 6, alpha('#ffcf5a', a)); circle(g, lx, ly, 10, '#ffcf5a'); circle(g, lx + lw * k, ly, 12, '#fff4c0');
    text(g, '1938', lx, ly + 50, { size: 32, font: 'Nunito', weight: 900, color: '#ffffff', alpha: a }); text(g, 'TODAY', lx + lw, ly + 50, { size: 32, font: 'Nunito', weight: 900, color: '#ffffff', alpha: a * k });
    for (let i = 0; i < 7; i++) { const u = i / 6; if (k < u - 0.02) continue; icon(g, lx + lw * u, ly - 70, 1.2 - 0.0 * u, i < 3 ? '#7fe8d8' : i < 5 ? '#ffcf5a' : '#e8d8c8', a); }
    const yrs = Math.round(85 * ease.out(prog(t, 1.0, ei + 0.2))); bigText(g, `${Math.min(80, yrs)}+ YEARS`, E.W / 2, y + 450, { size: 64, a: a * ease.out(prog(t, 1.0, 1.4)), color: '#ffe8b0', glowColor: 'rgba(255,200,90,.6)' });
    cite(g, 'Harvard Study of Adult Development, 1938 – today · Waldinger & Schulz, 2023', E.W / 2, y + h - 34, a); hud(g, t, { color: '#ffcf5a' }); vignette(g, 0.55); },
});
registerShot('f58', { kind: '3d',
  init(T) { return blurAirport(T); },
  draw(s, t, info, T) { s.set.tick(t + 6); cam(T, s.stage, t, info.dur, { pos: [-1, 2.2, 4.4], look: [0, 2.5, -10] }, { pos: [1.2, 2.2, 4.0], look: [0, 2.6, -10] }, ease.linear); },
  overlay(g, t, info, s) { const pe = local(info, t, 'people') ?? 2.08, ri = local(info, t, 'richest') ?? 5.22, we = local(info, t, "weren't") ?? 4.78; tone(g, 'gold', 0.3); darken(g, 0.5);
    const q = ease.outBack(prog(t, 0.05, 0.4)); g.save(); g.translate(E.W / 2, E.H * 0.14); g.scale(q, q); bigText(g, 'ITS BIGGEST FINDING?', 0, 0, { size: 72, a: clamp(q) }); g.restore();
    const a = ease.out(prog(t, pe - 0.2, pe + 0.3)); const x = E.W / 2 - 600, y = E.H * 0.27, w = 1200, h = 520; panel(g, x, y, w, h, a, '#ffcf5a');
    text(g, 'THE LONGEST, HAPPIEST LIVES', E.W / 2, y + 56, { size: 34, font: 'Nunito', weight: 900, color: '#ffe8b0', alpha: a, spacing: 4 });
    const col = (cx, label, hgt, c, k, dim) => { const bh = 300 * hgt * ease.out(k); rr(g, cx - 90, y + 430 - bh, 180, Math.max(4, bh), 20); g.save(); g.globalAlpha = a * (1 - 0.6 * dim); g.fillStyle = c; g.shadowColor = c; g.shadowBlur = 24; g.fill(); g.restore(); text(g, label, cx, y + 475, { size: 30, font: 'Nunito', weight: 900, color: '#ffffff', alpha: a * (1 - 0.5 * dim), spacing: 3 }); };
    const rk = prog(t, pe + 0.5, pe + 1.5), dim = ease.out(prog(t, we, ri + 0.3)); col(E.W / 2 - 260, 'THE RICHEST', 0.45, '#a8b0c8', rk, dim); col(E.W / 2 + 260, '?', 0.08, '#ffcf5a', rk, 0);
    if (dim > 0) seg(g, [[E.W / 2 - 400, y + 440], [E.W / 2 - 400 + 280 * dim, y + 440 - 260 * dim]], 12, '#ff4d4d');
    cite(g, 'Waldinger & Schulz, 2023', E.W / 2, y + h - 18, a); hud(g, t, { color: '#ffcf5a' }); vignette(g, 0.55); },
});
// f59: old YOU and old Kabir on a wall at golden hour, laughing; infinity above
registerShot('f59', { kind: '3d',
  init(T) { const st = stageFor(T, 'golden', { focus: 2.8, aperture: 0.005 }); const set = gully(T, st, { seed: 38 }); lowWall(T, st, -0.4, -3.2, 3, 0.5);
    const a = person(T, st, { ...LOOK.you, hair: 'grey', hoodie: '#5a8ad8' }, [-0.85, -3.2], 0, { y: 0.48, set: { sit: true } }), b = person(T, st, { ...LOOK.kabir, hoodie: '#5aa070' }, [0.05, -3.2], 0, { y: 0.48, set: { sit: true } });
    return { stage: st, set, a, b }; },
  draw(s, t, info, T) { s.set.tick(t); const la = Math.sin(t * 9) > 0; life(s.a, t, 1, { expr: la ? 'happy' : 'talk', look: [0.6, 0.1], tilt: 0.08 * Math.sin(t * 4), nod: 0.08 }); life(s.b, t, 2, { expr: la ? 'talk' : 'happy', look: [-0.6, 0.1], tilt: -0.08 * Math.sin(t * 4), nod: 0.08 });
    cam(T, s.stage, t, info.dur, { pos: [0.9, 1.5, 0.4], look: [-0.4, 1.8, -3.2] }, { pos: [0.6, 1.45, -0.1], look: [-0.4, 1.85, -3.2] }); s.stage.focusOn([-0.4, 1.5, -3.2]); s.P = proj(T, s.stage, s.b, 0.62); s.Pa = proj(T, s.stage, s.a, 0.62); },
  overlay(g, t, info, s) { const rl = local(info, t, 'relationships') ?? 1.33; tone(g, 'warm', 0.6); tag(g, s.P, 'inf', { t, s: 0.9 }); tag(g, s.Pa, 'inf', { t, s: 0.9, seed: 2 });
    topBand(g, 1, 0.26); bigText(g, 'GOOD RELATIONSHIPS', E.W / 2, E.H * 0.12, { size: 76, a: ease.out(prog(t, rl - 0.4, rl)), color: '#ffe8b0', glowColor: 'rgba(255,200,90,.7)' }); vignette(g, 0.5); },
});
// f60: YOU walks out of the airport into the city night
registerShot('f60', { kind: '3d',
  init(T) { const st = stageFor(T, 'night', { focus: 4, aperture: 0.004 }); const { THREE } = T; st.add(T.ground(80, 80, '#2a2a34', T.tiles('#2e2e3a', 20, [16, 16])));
    const term = T.box(40, 8, 1, T.mat('#1a1c2c'), 0, 4, -6); st.add(term); const glass = new THREE.Mesh(new THREE.PlaneGeometry(30, 5), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd8a8').multiplyScalar(0.55) })); glass.position.set(0, 2.6, -5.48); st.add(glass);
    for (let i = -14; i <= 14; i += 2) st.add(T.box(0.12, 5, 0.12, T.mat('#0a0a12'), i, 2.6, -5.4));
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(6, 0.8), new THREE.MeshBasicMaterial({ map: T.canvasTex(600, 80, (g, W, H) => { g.fillStyle = '#0a0a14'; g.fillRect(0, 0, W, H); g.fillStyle = '#ffcf5a'; g.font = '900 48px Nunito'; g.textAlign = 'center'; g.fillText('DEPARTURES · TERMINAL 2', W / 2, 58); }), color: new THREE.Color(0.85, 0.85, 0.85) })); sign.position.set(0, 6.2, -5.45); st.add(sign);
    const taxis = [0, 1, 2].map((i) => { const g = new THREE.Group(); g.add(T.box(1.9, 0.6, 0.9, T.mat('#e8b820', { roughness: 0.4 }), 0, 0.45, 0), T.box(1.1, 0.45, 0.85, T.mat('#202430', { roughness: 0.2 }), -0.1, 0.95, 0)); for (const dx of [-0.6, 0.6]) for (const dz of [-0.45, 0.45]) { const w = T.cyl(0.2, 0.2, 0.1, T.mat('#111'), dx, 0.2, dz); w.rotation.x = Math.PI / 2; g.add(w); }
      const hl = sprite(T, st, [0, 0, 0], 0.6, '#fff4d8', 0.6); g.userData.hl = hl; st.add(g); return g; });
    for (const x of [-8, 0, 8]) lamp(T, st, [x, 5, 2], '#ffb060', 6, 12, { r: 0.12, halo: 1.4 });
    const b = bokeh(T, st, { n: 40, area: [-30, 30, 0.5, 8, 12, 20], colors: ['#ffc070', '#ff6a5a', '#a8d0ff'], size: 1.6 }); const y = person(T, st, 'you', [0, -3], 0); return { stage: st, taxis, b, y }; },
  draw(s, t, info, T) { s.b.tick(t); s.taxis.forEach((c, i) => { const x = ((t * 7 + i * 9) % 30) - 15; c.position.set(x * (i % 2 ? -1 : 1), 0, 0.6 + i * 0.9); c.rotation.y = i % 2 ? Math.PI : 0; c.userData.hl.position.set(c.position.x + (i % 2 ? -1 : 1), 0.5, c.position.z); });
    s.y.position.z = -3 + t * 1.1; life(s.y, t, 1, { expr: 'neutral', walk: t * 6.5, look: [0, 0.1] });
    cam(T, s.stage, t, info.dur, { pos: [2.6, 1.7, 3.5], look: [0, 1.5, -2] }, { pos: [2.2, 1.7, 3.8], look: [0, 1.5, -1] }); s.stage.focusOn(s.y.userData.head); },
  overlay(g, t, info, s) { hud(g, t); vignette(g, 0.6); },
});
// taxi: YOU in the back seat, seen as the mirror sees him; 2D dashboard frame around the mirror
function taxi(T, o = {}) { const st = stageFor(T, 'taxi', { focus: o.focus ?? 1.3, aperture: o.aperture ?? 0.006 }); const { THREE } = T;
  st.add(T.box(1.8, 0.8, 0.5, T.mat('#2a2228', { roughness: 0.9 }), 0, 0.6, -0.3), T.box(1.8, 0.9, 0.2, T.mat('#2e262c', { roughness: 0.9 }), 0, 1.15, -0.55), T.box(0.1, 1.6, 2.4, T.mat('#14141a'), -0.95, 1.2, 0.4), T.box(0.1, 1.6, 2.4, T.mat('#14141a'), 0.95, 1.2, 0.4), T.box(2, 0.08, 2.4, T.mat('#101016'), 0, 2.0, 0.4));
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.6), new THREE.MeshBasicMaterial({ color: '#0a1022' })); win.position.set(0.94, 1.55, 0.2); win.rotation.y = -Math.PI / 2; st.add(win);
  const lights = bokeh(T, st, { n: 30, area: [1.3, 1.5, 1.2, 1.9, -2, 3], colors: ['#ffb060', '#ff6a5a', '#a8d0ff', '#ffd8a0'], size: 0.25, opacity: 0.5 }); const lights2 = bokeh(T, st, { n: 30, area: [-1.5, -1.3, 1.2, 1.9, -2, 3], colors: ['#ffb060', '#a8d0ff'], size: 0.25, opacity: 0.45, seed: 9 });
  const y = person(T, st, 'you', [0, -0.2], 0, { y: -0.18 }); const L = new THREE.PointLight(new THREE.Color('#ffb070'), 2.6, 4, 2); L.position.set(0.5, 1.8, 0.9); const F2 = new THREE.PointLight(new THREE.Color('#9ab8ff'), 1.4, 4, 2); F2.position.set(-0.6, 1.6, 0.8); st.add(F2); st.add(L);
  return { stage: st, lights, lights2, y, L }; }
const tickTaxi = (s, t) => { [s.lights, s.lights2].forEach((B, j) => B.forEach((m, i) => { m.position.z = 3 - ((t * 3.2 + m.userData.seed * 2 + j) % 5); m.material.opacity = 0.35 + 0.15 * Math.sin(t * 2 + i); })); s.L.intensity = 1.2 + 0.8 * Math.max(0, Math.sin(t * 2.3)); };
const MIR = { x: E.W / 2 - 520, y: 110, w: 1040, h: 520 };
function mirrorFrame(g, t, m = MIR) { g.save(); rr(g, m.x, m.y, m.w, m.h, 70); g.rect(0, 0, E.W, E.H); g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#05060c', '#0a0c18', '#141020']); g.fill('evenodd');
  // windshield city lights below the mirror + dashboard
  g.save(); g.beginPath(); g.rect(0, m.y + m.h + 20, E.W, E.H); g.clip(); const R = rng(3); for (let i = 0; i < 40; i++) { const x = (R() * E.W + t * 80 * (0.5 + R())) % E.W, y = m.y + m.h + 60 + R() * 220; glow(g, x, y, 20 + R() * 40, ['#ffb060', '#ff6a5a', '#a8d0ff'][i % 3], 0.25); } g.restore();
  g.fillStyle = '#08080e'; g.beginPath(); g.moveTo(0, E.H * 0.9); g.quadraticCurveTo(E.W / 2, E.H * 0.82, E.W, E.H * 0.9); g.lineTo(E.W, E.H); g.lineTo(0, E.H); g.fill();
  rr(g, m.x - 14, m.y - 14, m.w + 28, m.h + 28, 80); g.strokeStyle = '#1e1e26'; g.lineWidth = 26; g.stroke(); rr(g, m.x - 2, m.y - 2, m.w + 4, m.h + 4, 70); g.strokeStyle = alpha('#c8d0ff', 0.25); g.lineWidth = 3; g.stroke();
  g.fillStyle = '#1e1e26'; g.fillRect(E.W / 2 - 18, 0, 36, m.y - 10); g.restore();
  g.save(); rr(g, m.x, m.y, m.w, m.h, 70); g.clip(); g.fillStyle = linGrad(g, m.x, m.y, m.x + m.w, m.y + m.h, ['rgba(255,255,255,.07)', 'rgba(255,255,255,0)', 'rgba(255,255,255,.04)']); g.fillRect(m.x, m.y, m.w, m.h); g.restore(); }
const YH = () => [0, -0.18 + 1.62, -0.2];
registerShot('f61', { kind: '3d',
  init(T) { return taxi(T); },
  draw(s, t, info, T) { tickTaxi(s, t); const ch = local(info, t, 'check') ?? 0.27; life(s.y, t, 1, { expr: t < ch + 0.4 ? 'sad' : 'neutral', look: t < ch + 0.3 ? [0.6, -0.3] : [0, 0.25] });
    cam(T, s.stage, t, info.dur, { pos: [0.05, 1.55, 2.0], look: [0, 1.22, -0.2] }, { pos: [0.04, 1.55, 1.8], look: [0, 1.24, -0.2] }, ease.linear); s.stage.focusOn(YH()); },
  overlay(g, t, info, s) { mirrorFrame(g, t); hud(g, t); },
});
registerShot('f62', { kind: '3d',
  init(T) { return taxi(T); },
  draw(s, t, info, T) { tickTaxi(s, t + 2); const nu = local(info, t, 'number') ?? 0.48; life(s.y, t, 1, { expr: t > nu + 0.2 ? 'surprised' : 'neutral', look: [0, t > nu + 0.5 ? 0.9 : 0.25], nod: t > nu + 0.5 ? -0.2 : 0 });
    cam(T, s.stage, t, info.dur, { pos: [0.04, 1.66, 3.1], look: [0, 1.36, -0.2] }, { pos: [0.03, 1.66, 2.8], look: [0, 1.38, -0.2] }); s.stage.focusOn(YH()); s.P = proj(T, s.stage, s.y, 0.62); },
  overlay(g, t, info, s) { const nu = local(info, t, 'number') ?? 0.48; const k = ease.inOut(prog(t, 0, info.dur)); const fy = MIR.y - 40 * k; mirrorFrame(g, t, { x: MIR.x - 120 * k, y: fy, w: MIR.w + 240 * k, h: MIR.h + 80 * k }); tag(g, { ...s.P, y: Math.max(s.P.y, fy + 95) }, 18262, { t, a: ease.out(prog(t, nu, nu + 0.4)), pop: t - nu - 0.3, s: 1.25 }); hud(g, t); },
});
registerShot('f63', { kind: '3d',
  init(T) { return taxi(T, { focus: 0.9, aperture: 0.012 }); },
  draw(s, t, info, T) { tickTaxi(s, t + 4); life(s.y, t, 1, { expr: 'awe', look: [0, 0.9], nod: -0.2 });
    cam(T, s.stage, t, info.dur, { pos: [0.12, 1.5, 1.7], look: [0, 1.8, -0.2] }, { pos: [0.08, 1.52, 1.45], look: [0, 1.82, -0.2] }, ease.linear); s.stage.focusOn(YH()); s.P = proj(T, s.stage, s.y, 0.62); },
  overlay(g, t, info, s) { const no = local(info, t, 'not') ?? 0.38; const v = 18262 - Math.floor(t * 0.6); tag(g, s.P, v, { t, s: 1.25, sub: t > no ? 'DAYS LEFT TO CALL' : null, pop: t - no }); hud(g, t); vignette(g, 0.6); },
});
function contacts(g, W, H) { g.fillStyle = '#0e1220'; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.font = '900 34px Nunito'; g.fillText('Contacts', 24, 60); g.fillStyle = '#5a6a90'; g.font = '800 16px Nunito'; g.fillText('favourites', 24, 92);
  [['Mom', '#ffcf5a', 'gold'], ['Kabir', '#3c9a58', 'inf'], ['Riya', '#ff7a5c', '2,460'], ['Ananya (library)', '#8a5ad8', '11,240'], ['Dadi', '#e8a060', '?']].forEach(([n, c, v], i) => { const y = 130 + i * 100; g.fillStyle = i === 1 ? 'rgba(255,207,90,.12)' : 'rgba(255,255,255,.04)'; g.fillRect(12, y, W - 24, 86); g.fillStyle = c; g.beginPath(); g.arc(56, y + 43, 28, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '900 26px Nunito'; g.fillText(n, 100, y + 40); g.fillStyle = '#ffcf5a'; g.font = '900 18px Nunito'; g.fillText(v === 'inf' ? 'infinity' : v === 'gold' ? 'gold' : v + ' days', 100, y + 66);
    g.fillStyle = '#3ac87a'; g.beginPath(); g.arc(W - 50, y + 43, 22, 0, 7); g.fill(); g.fillStyle = '#fff'; g.fillRect(W - 58, y + 36, 16, 14); }); }
registerShot('f64', { kind: '3d',
  init(T) { const r = taxi(T, { focus: 0.7, aperture: 0.012 }); const ph = phone3D(T, contacts); ph.scale.setScalar(0.55); ph.position.set(0.05, 1.25, 0.45); ph.rotation.set(-0.45, 0, 0); r.stage.add(ph); r.ph = ph; return r; },
  draw(s, t, info, T) { tickTaxi(s, t + 6); life(s.y, t, 1, { expr: 'determined', look: [0, -0.8], nod: 0.25 }); s.ph.position.y = 1.25 + 0.01 * Math.sin(t * 2);
    cam(T, s.stage, t, info.dur, { pos: [0.35, 1.75, 1.3], look: [0.05, 1.25, 0.45] }, { pos: [0.28, 1.65, 1.1], look: [0.05, 1.25, 0.45] }); s.stage.focusOn(s.ph); s.Pc = proj(T, s.stage, [0.15, 1.27, 0.48]); },
  overlay(g, t, info, s) { const ca = local(info, t, 'call') ?? 2.58; const k = ease.inOut(prog(t, 1.0, ca)); circle(g, lerp(s.Pc.x + 260, s.Pc.x + 40, k), lerp(s.Pc.y + 300, s.Pc.y + 20, k), 26, 'rgba(180,140,120,.75)');
    if (t > ca) glow(g, s.Pc.x + 40, s.Pc.y + 20, 90, '#3ac87a', 0.4 * Math.max(0, 1 - (t - ca) / 0.6)); hud(g, t); vignette(g, 0.6); },
});
// f65: CTA card: the cast with "?" numbers
registerShot('f65', { kind: '3d',
  init(T) { const st = stageFor(T, 'night', { focus: 0.5, aperture: 0.025, maxblur: 0.025 }); const set = (T.ground && null); const b = bokeh(T, st, { n: 60, area: [-12, 12, -2, 6, -14, -6], colors: ['#ffb060', '#ff6a5a', '#a8d0ff', '#ffd8a0'], size: 2.0, opacity: 0.35 }); return { stage: st, b }; },
  draw(s, t, info, T) { s.b.tick(t, 0.6); cam(T, s.stage, t, info.dur, { pos: [0, 1.5, 4], look: [0, 1.5, -10] }, { pos: [0.6, 1.5, 3.6], look: [0, 1.5, -10] }, ease.linear); },
  overlay(g, t, info, s) { darken(g, 0.3); const ch = local(info, t, 'check') ?? 2.95;
    topBand(g, 1, 0.3); bigText(g, 'WHOSE NUMBER WOULD', E.W / 2, E.H * 0.1, { size: 74, a: ease.out(prog(t, 0.6, 1.0)) }); bigText(g, 'YOU CHECK FIRST?', E.W / 2, E.H * 0.2, { size: 92, a: ease.out(prog(t, ch - 0.6, ch - 0.2)), color: '#ffe8b0', glowColor: 'rgba(255,200,90,.7)' });
    const cast = [['MOM', '#c83a5a', '#b07850'], ['BEST FRIEND', '#3c9a58', '#a47458'], ['CLASSMATE', '#ff7a5c', '#c8987c'], ['OLD FRIEND', '#8a5ad8', '#c09078'], ['YOU', '#3f7fd8', '#b8866a']];
    cast.forEach(([n, hood, skin], i) => { const x = E.W / 2 + (i - 2) * 330, y = E.H * 0.6, a = ease.outBack(prog(t, 1.0 + i * 0.25, 1.4 + i * 0.25)); if (a <= 0) return; g.save(); g.translate(x, y); g.scale(a, a);
      glow(g, 0, 0, 170, hood, 0.25); rr(g, -95, 40, 190, 150, 70); g.fillStyle = hood; g.fill(); circle(g, 0, -10, 92, skin); g.strokeStyle = alpha(hood, 0.9); g.lineWidth = 6; g.beginPath(); g.arc(0, -10, 96, 0, 7); g.stroke();
      g.strokeStyle = '#2a2230'; g.lineWidth = 7; g.lineCap = 'round'; for (const dx of [-30, 30]) { g.beginPath(); g.arc(dx, -16, 11, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } g.beginPath(); g.arc(0, 8, 24, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke(); g.restore();
      text(g, n, x, y + 225, { size: 26, font: 'Nunito', weight: 900, color: '#ffffff', alpha: clamp(a), spacing: 3 }); tag(g, { x, y: y - 170, vis: true, scale: 1.0 }, '?', { t, seed: i, a: clamp(a), kind: i === 0 ? 'gold' : 'white', pop: t - 1.2 - i * 0.25 }); });
    const co = local(info, t, 'comments') ?? 4.73; vignette(g, 0.5); },
});
// f66: end: calling KABIR, gold infinity, "call them."
function calling(g, W, H) { g.fillStyle = linGrad(g, 0, 0, 0, H, ['#1a2a1e', '#0e1220']); g.fillRect(0, 0, W, H); g.fillStyle = '#3c9a58'; g.beginPath(); g.arc(W / 2, 230, 80, 0, 7); g.fill(); g.fillStyle = '#a47458'; g.beginPath(); g.arc(W / 2, 222, 60, 0, 7); g.fill(); g.fillStyle = '#235a34'; g.beginPath(); g.arc(W / 2, 205, 62, Math.PI, 0); g.fill();
  g.fillStyle = '#fff'; g.font = '900 40px Nunito'; g.textAlign = 'center'; g.fillText('Kabir', W / 2, 370); g.font = '800 22px Nunito'; g.fillStyle = '#9ab8a0'; g.fillText('calling Toronto…', W / 2, 408); g.fillStyle = '#e83a3a'; g.beginPath(); g.arc(W / 2, H - 80, 34, 0, 7); g.fill(); }
registerShot('f66', { kind: '3d',
  init(T) { const r = taxi(T, { focus: 0.6, aperture: 0.014, maxblur: 0.02 }); const ph = phone3D(T, calling); ph.scale.setScalar(0.6); ph.position.set(0.0, 1.45, 0.75); ph.rotation.set(-0.05, 0, 0); r.stage.add(ph); r.ph = ph; return r; },
  draw(s, t, info, T) { tickTaxi(s, t + 9); life(s.y, t, 1, { expr: 'happy' }); s.ph.rotation.z = 0.02 * Math.sin(t * 1.4);
    cam(T, s.stage, t, info.dur, { pos: [0.0, 1.5, 1.45], look: [0, 1.45, 0.75] }, { pos: [0.0, 1.5, 1.7], look: [0, 1.45, 0.75] }); s.stage.focusOn(s.ph); s.P = proj(T, s.stage, [0, 1.72, 0.75]); },
  overlay(g, t, info, s) { const ca = local(info, t, 'call') ?? 2.29; const rp = (t * 1.2) % 1; g.save(); g.globalAlpha = 0.5 * (1 - rp); g.strokeStyle = '#7fe8a8'; g.lineWidth = 4; g.beginPath(); g.arc(s.P.x, s.P.y + 120, 80 + 120 * rp, 0, 7); g.stroke(); g.restore();
    tag(g, { ...s.P, y: s.P.y - 30 }, 'inf', { t, s: 1.0, a: ease.out(prog(t, 0.6, 1.2)) });
    const k = ease.out(prog(t, ca - 0.3, ca + 0.3)); g.fillStyle = `rgba(6,6,20,${0.45 * k})`; g.fillRect(0, E.H * 0.72, E.W, E.H * 0.28);
    bigText(g, 'call them.', E.W / 2, E.H * 0.83, { size: 110, a: k, color: '#ffe8b0', glowColor: 'rgba(255,200,90,.8)' }); tone(g, 'gold', 0.3 * k); vignette(g, 0.55); },
});
