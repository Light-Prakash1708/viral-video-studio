// shots/03_end.js: Sunday, the hospital, the night, the morning after, the report, the sign, twelve years later, CTA (s38-s63).
import { E, V, registerShot, text, alpha, rr } from '/engine/core.js';
import { stationStage, P, place, hari, m7, queue, C, move, talk, ease, clamp, lerp, prog, local, person2, robot, life, blinkFace, hold, HARI, BOSE, ARJUN, MEERA, MEERA_ADULT, CUSTOMERS } from '../sets/kit.js';
import { lifeStage } from '../sets/lifesim.js';
import { jobsHud, grade, dayCard, report, hospitalRoom, CY, pourRig } from '../sets/film.js';
import { rain, SKIES, lamp, dust } from '../sets/fc.js';

const hud = (g, t, o = {}) => jobsHud(g, t, o);
// s38: Sunday dawn: M-7 arrives with the report
registerShot('s38', { kind: '3d',
  init(T) { const b = stationStage(T, 'dawn', { focus: 4, aperture: 0.002 }); b.r = m7(T, b.stage, [-4, 0, 0.8], Math.PI / 2); b.stall.setShutter(1); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.position.x = lerp(-4, -1.2, ease.out(clamp(t / info.dur))); s.r.set({ hover: t, face: 'neutral' }); move(T, s, t, info, C([-5.5, 1.4, 3.4], [-1, 1.3, -0.5]), C([-4.6, 1.4, 3.0], [-0.5, 1.3, -0.8])); },
  overlay(g, t) { hud(g, t); dayCard(g, 'Sunday', ease.out(prog(t, 0, 0.4)) * (1 - ease.in(prog(t, 2.4, 3.0)))); grade(g, { warm: 0.06, v: 0.45 }); },
});
// s39: but the stall was closed: shutter down, no steam, M-7 face drops
registerShot('s39', { kind: '3d',
  init(T) { const b = stationStage(T, 'dawn', { focus: 2.2, aperture: 0.004 }); b.r = m7(T, b.stage, [0.6, 0, 0.3], Math.PI + 0.2); b.stall.setShutter(1); b.q = queue(T, b.stage, 3, { dx: 1.2 }); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); const k = local(info, t, 'closed') ?? 0.6; s.r.set({ hover: t, face: t > k ? 'sad' : 'neutral', nod: t > k ? 0.18 : 0 }); s.q.forEach((c, i) => life(c, t, i, { expr: 'worried' }));
    move(T, s, t, info, C([2.0, 1.6, 2.0], [0.3, 1.5, -1.0]), C([1.7, 1.55, 1.6], [0.3, 1.5, -1.0])); s.stage.focusOn(s.r.userData.head); },
  overlay(g, t) { hud(g, t); grade(g, { cold: 0.06, v: 0.48 }); },
});
// hospital: night, rain on the window, live ECG
const hosp = (id, opts) => registerShot(id, { kind: '3d',
  init(T) { const st = lifeStage(T, { sky: SKIES.rainNight, fogColor: '#0e1826', fog: [6, 30], key: 0.9, keyColor: '#a8c8ff', keyPos: [3, 4, -3], ambient: 1.35, ambientSky: '#6a8ad0', rim: '#7fb0ff', fill: '#4ab8d0', focus: opts.focus ?? 2, aperture: opts.ap ?? 0.004, beauty: 0.85 });
    const H = hospitalRoom(T, st); const h = person2(T, HARI); h.position.set(-0.6, 0.86, 0.28); h.rotation.x = -1.42; h.userData.body.position.z = 0; st.add(h);
    const r = robot(T); r.position.set(0.45, 0, -0.35); r.rotation.y = -1.2; st.add(r); return { stage: st, H, h, r }; },
  draw(s, t, info, T) { s.H.ecg(info.globalT, opts.ecg ? opts.ecg(t, info) : {}); s.r.set({ hover: t, ...(opts.robot ? opts.robot(t, info) : { face: blinkFace(t, 'sad') }) }); s.h.set({ expr: opts.hari ? opts.hari(t, info) : (((t + 1) % 4) < 0.15 ? 'blink' : 'sleepy'), breathe: t * 0.7, look: [0, 0] });
    move(T, s, t, info, opts.a, opts.b); s.stage.focusOn(opts.focusOn ? opts.focusOn(s) : s.h.userData.head); },
  overlay(g, t, info, s) { hud(g, t); if (opts.over) opts.over(g, t, info, s); grade(g, { cold: 0.12, v: 0.5 }); },
});
hosp('s40', { a: C([2.4, 2.2, 2.6], [-0.4, 0.9, -1.0]), b: C([2.0, 2.0, 2.2], [-0.5, 0.95, -1.0]), focusOn: (s) => s.h.userData.head });
hosp('s41', { focus: 0.9, ap: 0.008, a: C([-0.25, 2.2, -0.6], [-0.6, 1.0, -1.35]), b: C([-0.3, 2.15, -0.7], [-0.6, 1.0, -1.35]) });
hosp('s42', { a: C([-2.0, 1.7, 2.2], [0.1, 1.2, -0.8]), b: C([-1.7, 1.65, 1.9], [0.1, 1.25, -0.8]), focusOn: (s) => s.r.userData.head, robot: (t) => ({ face: blinkFace(t, 'neutral'), nod: 0.25 }) });
hosp('s43', { focus: 0.9, ap: 0.008, a: C([-0.35, 1.45, 0.4], [0.45, 1.55, -0.35]), b: C([-0.3, 1.47, 0.3], [0.45, 1.56, -0.35]), focusOn: (s) => s.r.userData.head, robot: (t) => ({ face: 'sad', faceColor: '#8ab0ff', nod: 0.2, tilt: 0.12 }) });
hosp('s44', { focus: 0.9, ap: 0.008, a: C([-0.15, 2.2, -0.65], [-0.6, 1.0, -1.35]), b: C([-0.2, 2.15, -0.75], [-0.6, 1.0, -1.35]), hari: (t) => (t > 0.3 ? 'happy' : 'sleepy') });
hosp('s45', { a: C([1.8, 1.8, 1.2], [-0.4, 1.05, -1.1]), b: C([1.6, 1.75, 1.0], [-0.4, 1.05, -1.1]), hari: (t, info) => (talk(t, 0.1, info.dur - 0.3) || 'happy'), robot: (t) => ({ face: 'curious', turn: 0.1 }) });
hosp('s46', { focus: 0.9, ap: 0.008, a: C([-0.35, 1.45, 0.4], [0.45, 1.55, -0.35]), b: C([-0.3, 1.46, 0.35], [0.45, 1.56, -0.35]), focusOn: (s) => s.r.userData.head, robot: (t) => ({ face: blinkFace(t, 'sad'), faceColor: '#8ab0ff', nod: 0.15 }) });
hosp('s47', { focus: 0.9, ap: 0.007, a: C([0.0, 2.2, -0.55], [-0.6, 1.0, -1.35]), b: C([-0.05, 2.15, -0.65], [-0.6, 1.0, -1.35]), hari: (t, info) => (talk(t, 0.1, info.dur - 0.4) || 'smirk'), robot: (t) => ({ face: 'soft', armL: 0.3, reachL: 1.0 }) });
// s48: that night: wide, the ECG slows and goes flat in the silence; M-7's eyes dim and it bows
hosp('s48', { a: C([2.6, 1.8, 2.4], [-0.3, 1.1, -1.1]), b: C([2.2, 1.7, 2.0], [-0.3, 1.1, -1.1]), focusOn: (s) => s.r.userData.head,
  ecg: (t, info) => { const f = local(info, t, 'rest') ?? 3; return { bpm: t < f ? 52 : 40, flat: info.globalT - t + f + 0.6 }; },
  hari: (t, info) => (t > (local(info, t, 'rest') ?? 3) ? 'blink' : 'sleepy'),
  robot: (t, info) => { const f = local(info, t, 'rest') ?? 3; const k = clamp((t - f - 0.9) / 1.2); return { face: k > 0.5 ? 'blink' : 'sad', faceColor: '#6a8ad8', nod: 0.15 + 0.3 * k }; },
  over: (g, t, info) => { const f = local(info, t, 'rest') ?? 3; const k = clamp((t - f - 1.2) / 1.5); if (k > 0) { g.fillStyle = `rgba(0,0,0,${0.35 * k})`; g.fillRect(0, 0, E.W, E.H); } } });
// s49: six the next morning: the shutter rises in a golden dawn
registerShot('s49', { kind: '3d',
  init(T) { const b = stationStage(T, 'dawn', { focus: 3.2, aperture: 0.0025 }); b.r = m7(T, b.stage, P.m7counter, 0); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); const k = local(info, t, 'opened') ?? 2; s.stall.setShutter(1 - ease.inOut(clamp((t - k + 0.6) / 1.4))); s.r.set({ hover: t, face: 'neutral', armL: 1.2 * clamp((t - k + 0.6) / 1.4), armR: 1.2 * clamp((t - k + 0.6) / 1.4) });
    move(T, s, t, info, C([0.2, 1.3, 3.6], [0.1, 1.6, -1.6]), C([0.2, 1.4, 3.0], [0.1, 1.6, -1.6])); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.14 }); },
});
// s50: a robot behind the counter, holding Hari's kettle
registerShot('s50', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 2.0, aperture: 0.004 }); b.r = m7(T, b.stage, P.m7counter, 0); b.k = hold(T, b.r, 'kettle', 1); b.stall.kettle.visible = false; b.q = queue(T, b.stage, 6, { dx: 0.6 }); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t, face: blinkFace(t, 'soft'), armR: 0.4, reachR: 0.9 }); s.q.forEach((c, i) => life(c, t, i, { expr: i < 2 ? 'surprised' : undefined }));
    move(T, s, t, info, C([-1.0, 1.6, 0.6], [0.15, 1.45, -2.0]), C([-0.8, 1.58, 0.3], [0.15, 1.47, -2.0])); s.stage.focusOn(s.r.userData.head); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.12 }); },
});
// s51: M-7 pours, the same way Walt did; callouts tick green this time
registerShot('s51', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 0.55, aperture: 0.01 }); b.r = m7(T, b.stage, P.m7counter, 0); b.stall.kettle.visible = false; b.stall.cups.forEach((c, i) => (c.visible = i > 5)); const at = b.stall.world(0.0, 1.06, 0.45); b.at = at; b.pour = pourRig(T, b.stage, at, { who: 'robot', t0: 0.3, fillTime: 2.4 }); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.pour.tick(t); s.r.set({ hover: t * 0.3, face: 'soft', nod: 0.3 }); const p = s.at; move(T, s, t, info, C([p[0] - 0.55, p[1] + 0.2, p[2] + 0.55], [p[0] + 0.05, p[1] + 0.17, p[2]]), C([p[0] - 0.46, p[1] + 0.21, p[2] + 0.46], [p[0] + 0.05, p[1] + 0.17, p[2]])); s.stage.focusOn([p[0], p[1] + 0.1, p[2]]); },
  overlay(g, t, info) { hud(g, t); [['thirty', '+31% STRENGTH  ✓'], ['Four', '+4° TOO HOT  ✓']].forEach(([w, str], i) => { const k = local(info, t, w); if (k == null) return; const a = ease.out(prog(t, k, k + 0.25)); const x = E.W * 0.08, y = E.H * (0.16 + i * 0.09); rr(g, x, y, V(380, 400), V(62, 60), 14); g.fillStyle = `rgba(4,22,14,${0.8 * a})`; g.fill(); g.strokeStyle = `rgba(120,255,170,${0.8 * a})`; g.lineWidth = 2; g.stroke(); text(g, str, x + 20, y + V(32, 30), { size: V(32, 30), font: 'Nunito', weight: 900, color: '#8affb8', align: 'left', alpha: a }); }); grade(g, { warm: 0.12 }); },
});
// s52: Bose gets two biscuits, Arjun gets a cloth (two-shot at the counter)
registerShot('s52', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 2.2, aperture: 0.004 }); b.r = m7(T, b.stage, P.m7counter, 0); b.bose = place(b.stage, person2(T, BOSE), [0.35, 0, -0.45], Math.PI); b.arj = place(b.stage, person2(T, ARJUN), [-0.75, 0, -0.35], Math.PI - 0.3); b.stall.biscuits.forEach((x) => (x.visible = true)); b.cl = hold(T, b.arj, 'cloth', 1); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); const a = local(info, t, 'Arjun') ?? 1.4; s.r.set({ hover: t, face: 'soft', turn: t > a ? 0.3 : -0.2 }); life(s.bose, t, 4, { expr: 'proud' }); life(s.arj, t, 6, { expr: t > a + 0.3 ? 'happy' : 'neutral', armR: 0.3, reachR: t > a ? 1.0 : 0.3 });
    move(T, s, t, info, C([0.9, 1.62, -1.3], [-0.25, 1.45, -0.35]), C([0.85, 1.6, -1.25], [-0.25, 1.46, -0.35])); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.14 }); },
});
// s53: Meera gets her cup, with a note
registerShot('s53', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 1.7, aperture: 0.005 }); b.r = m7(T, b.stage, P.m7counter, 0); b.m = place(b.stage, person2(T, MEERA), [0.35, 0, -0.05], Math.PI); b.gl = hold(T, b.m, 'cocoa', 1); b.nt = hold(T, b.m, 'note', 0); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t, face: 'soft', nod: 0.3 }); const n = local(info, t, 'note') ?? 2; life(s.m, t, 7, { expr: t > n ? 'surprised' : 'nervous', look: [0, -0.3], armR: 0.3, reachR: 1.0, armL: 0.3, reachL: t > n ? 1.1 : 0.2, nod: 0.15 });
    move(T, s, t, info, C([1.05, 1.12, -0.8], [0.35, 1.0, -0.05]), C([0.95, 1.12, -0.82], [0.35, 1.0, -0.05])); s.stage.focusOn(s.m.userData.head); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.14 }); },
});
// s54: the note, full screen over Meera's tearful smile
registerShot('s54', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 0.8, aperture: 0.01 }); b.m = place(b.stage, person2(T, MEERA), [0.35, 0, -0.05], Math.PI); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); life(s.m, t, 7, { expr: t > 1.6 ? 'cry' : 'love', look: [0, -0.2] }); move(T, s, t, info, C([0.2, 1.12, -0.95], [0.66, 1.05, -0.05]), C([0.22, 1.11, -0.87], [0.66, 1.05, -0.05])); s.stage.focusOn(s.m.userData.head); },
  overlay(g, t, info) { hud(g, t); const a = ease.out(prog(t, 0.1, 0.6)); const w = V(640, 900), h = V(280, 340), x = E.W * 0.04, y = E.H * 0.47;
    g.save(); g.globalAlpha = a; g.translate(x + w / 2, y + h / 2); g.rotate(-0.04); g.translate(-x - w / 2, -y - h / 2); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 30; g.fillStyle = '#fff6dc'; g.fillRect(x, y, w, h); g.shadowBlur = 0;
    g.strokeStyle = 'rgba(120,150,200,.35)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(x + 30, y + i * h / 6); g.lineTo(x + w - 30, y + i * h / 6); g.stroke(); }
    const e = local(info, t, 'Test') ?? 0.3, hs = local(info, t, 'Walt') ?? 1.2;
    const write = (str, yy, t0) => { const n = Math.floor(str.length * clamp((t - t0) / (str.length * 0.05))); if (n > 0) text(g, str.slice(0, n), x + 60, yy, { size: V(66, 56), font: 'Caveat', weight: 700, color: '#2a3a7a', align: 'left' }); };
    write('Test day.', y + h * 0.36, e); write('Walt says,', y + h * 0.62, hs); write("you've got this.", y + h * 0.86, hs + 0.9); g.restore(); grade(g, { warm: 0.16 }); },
});
// s55: evening: M-7 alone on the bench, sending its one-line report
registerShot('s55', { kind: '3d',
  init(T) { const b = stationStage(T, 'evening', { focus: 3.5, aperture: 0.003 }); b.r = m7(T, b.stage, [-7.5, 0, 1.25], 0); b.tb = hold(T, b.r, 'tablet', 1); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t * 0.4, face: blinkFace(t, 'neutral'), armR: 0.4, reachR: 1.1, nod: 0.25 }); move(T, s, t, info, C([-4.5, 1.6, 4.0], [-7.5, 1.2, 1.0]), C([-5.0, 1.5, 3.6], [-7.5, 1.25, 1.0])); s.stage.focusOn(s.r.userData.head); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.12 }); },
});
// s56: the report: "Status... not closed." The HUD turns gold
registerShot('s56', { kind: '3d',
  init(T) { const b = stationStage(T, 'evening', { focus: 1.0, aperture: 0.007 }); b.r = m7(T, b.stage, [-7.5, 0, 1.25], 0); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); const n = local(info, t, 'not') ?? 2; s.r.set({ hover: t * 0.4, face: t > n + 0.2 ? 'happy' : 'neutral', faceColor: t > n + 0.2 ? '#ffd27a' : undefined, nod: 0.05 }); move(T, s, t, info, C([-7.1, 1.6, 2.15], [-7.5, 1.55, 1.25]), C([-7.15, 1.6, 2.05], [-7.5, 1.56, 1.25])); s.stage.focusOn(s.r.userData.head); },
  overlay(g, t, info) { const n = local(info, t, 'not') ?? 2, st = local(info, t, 'Status') ?? 1.3; hud(g, t, { gold: t > n, pulse: t - n, value: '1' });
    report(g, t, [{ at: 0.15, text: 'LAST HUMAN JOB ON EARTH' }, { at: st, text: 'STATUS:' }, { at: n, text: 'NOT CLOSED.', color: '#ffd27a', size: V(44, 40) }], { title: 'M-7 · FINAL REPORT', x: E.W * 0.52, y: E.H * 0.18, w: V(760, 900), h: V(280, 380), gap: V(56, 60) }); grade(g, { warm: 0.12 }); },
});
// s57: M-7 hangs the new sign: HELP WANTED. Humans only.
registerShot('s57', { kind: '3d',
  init(T) { const b = stationStage(T, 'evening', { focus: 1.8, aperture: 0.004 }); b.r = m7(T, b.stage, [-0.35, 0, -0.45], 2.4); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); const k = local(info, t, 'sign') ?? 1; s.stall.helpSign.visible = t > k; s.r.set({ hover: t, face: t > k + 0.4 ? 'happy' : 'neutral', armL: 0.3, armR: 0.3, reachR: t < k + 0.4 ? 1.2 : 0.3, look: [0.6, -0.3] });
    move(T, s, t, info, C([1.6, 1.1, 1.5], [0.5, 0.8, -0.9]), C([1.4, 1.0, 1.2], [0.5, 0.75, -0.9])); s.stage.focusOn([0.75, 0.55, -0.94]); },
  overlay(g, t) { hud(g, t, { gold: true }); grade(g, { warm: 0.14 }); },
});
// s58-s60: twelve years later: bright day, adult Meera runs the busiest stall; M-7 (older) washes cups beside her
const later = (id, opts) => registerShot(id, { kind: '3d',
  init(T) { const b = stationStage(T, 'day', { focus: opts.focus ?? 2.2, aperture: opts.ap ?? 0.004 }); b.m = place(b.stage, person2(T, MEERA_ADULT), [-0.25, 0, -2.0], 0.15); b.r = m7(T, b.stage, [0.75, 0, -2.0], -0.3, { color: '#e2ded6' }); b.cl = hold(T, b.r, 'cloth', 1);
    b.q = queue(T, b.stage, opts.n ?? 12, { dx: opts.qdx || 0 }); if (opts.kid) b.kid = place(b.stage, person2(T, MEERA, { hair3: 'spiky', top: '#f2f0ea', tie: '#2a6ac8', hairColor: '#2a1c16' }), [0.3, 0, -0.45], Math.PI); if (opts.init) opts.init(T, b); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t, face: blinkFace(t, 'soft'), armR: 0.4, reachR: 1.0 + 0.2 * Math.sin(t * 6) }); s.q.forEach((c, i) => life(c, t, i, { expr: i % 3 === 0 ? 'happy' : undefined })); opts.act(s, t, info); move(T, s, t, info, opts.a, opts.b); s.stage.focusOn(s.m.userData.head); },
  overlay(g, t, info, s) { hud(g, t, { gold: true }); if (opts.card) dayCard(g, opts.card, ease.out(prog(t, 0.2, 0.7)) * (1 - ease.in(prog(t, 3.0, 3.6)))); grade(g, { warm: 0.06, v: 0.3 }); },
});
later('s58', { card: 'Twelve years later', focus: 5, ap: 0.0018, a: C([8, 1.8, 3.2], [0.5, 1.3, -1.2]), b: C([6.8, 1.7, 2.8], [0.3, 1.3, -1.4]), act: (s, t) => life(s.m, t, 2, { expr: 'happy', armR: 0.4, reachR: 0.9 }) });
later('s59', { focus: 1.6, ap: 0.005, a: C([0.5, 1.68, -0.45], [-0.25, 1.62, -2.0]), b: C([0.4, 1.68, -0.6], [-0.25, 1.63, -2.0]), act: (s, t, info) => life(s.m, t, 2, { expr: talk(t, 1.6, 2.6) || 'happy', look: [0.3, 0.05], tilt: 0.05 }) });
later('s60', { kid: true, n: 8, qdx: 1.6, focus: 1.8, ap: 0.005, init(T, b) { b.gl = hold(T, b.m, 'glass', 1); },
  a: C([1.5, 1.75, 0.9], [-0.1, 1.35, -1.6]), b: C([1.35, 1.72, 0.7], [-0.1, 1.35, -1.6]), act: (s, t, info) => { const x = local(info, t, 'extra') ?? 2.5; life(s.m, t, 2, { expr: t > x ? 'wink' : 'happy', armR: 0.4, reachR: lerp(0.5, 1.3, ease.inOut(clamp(t / 1.5))) }); life(s.kid, t, 5, { expr: t > x + 0.3 ? 'laugh' : 'nervous', look: [0, -0.5] }); } });
// s61: machines can do almost anything: crane up over the busy stall and the robot city beyond
registerShot('s61', { kind: '3d',
  init(T) { const b = stationStage(T, 'day', { focus: 8, aperture: 0.0012 }); b.m = place(b.stage, person2(T, MEERA_ADULT), [-0.25, 0, -2.0], 0.15); b.r = m7(T, b.stage, [0.75, 0, -2.0], -0.3, { color: '#e2ded6' }); b.q = queue(T, b.stage, 12); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t }); life(s.m, t, 2, { expr: 'happy' }); s.q.forEach((c, i) => life(c, t, i)); move(T, s, t, info, C([2.5, 2.0, 5.5], [0.5, 1.2, -1.2]), C([3.5, 6.5, 9.5], [0.5, 1.0, -1.2])); },
  overlay(g, t) { hud(g, t, { gold: true }); grade(g, { warm: 0.08, v: 0.32 }); },
});
// s62: but somebody still has to remember your name: CU the 1999 photo of Hari on the shelf, M-7's glow beside it
registerShot('s62', { kind: '3d',
  init(T) { const b = stationStage(T, 'evening', { focus: 0.75, aperture: 0.004 }); b.r = m7(T, b.stage, [0.35, 0, -2.05], 0.5, { color: '#e2ded6' });
    const p = b.stall.world(0.9, 2.33, -0.69); b.mug = T.cyl(0.04, 0.036, 0.095, T.mat('#f4f2ee', { roughness: 0.3 }), p[0] - 0.3, 2.13, p[2] + 0.06); b.stage.add(b.mug); b.stage.add(T.cyl(0.036, 0.036, 0.004, T.mat('#3a2214'), p[0] - 0.3, 2.18, p[2] + 0.06));
    b.lampP = lamp(T, b.stage, [p[0] - 0.1, p[1] + 0.25, p[2] + 0.45], '#ffd8a0', 1.6, 1.6, { bulb: false }); b.p = p; b.steam = dust(T, b.stage, { n: 30, area: [p[0] - 0.34, p[0] - 0.26, 2.2, 2.6, p[2] + 0.03, p[2] + 0.09], color: '#ffffff', size: 0.03, opacity: 0.35, rise: 0.25 }); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.steam.tick(t); s.r.set({ hover: t * 0.3, face: 'soft', turn: -0.4 }); const p = s.p; move(T, s, t, info, C([p[0] - 0.12, p[1] - 0.02, p[2] + 1.05], [p[0] - 0.06, p[1] - 0.02, p[2]]), C([p[0] - 0.08, p[1] - 0.01, p[2] + 0.78], [p[0] - 0.04, p[1] - 0.01, p[2]])); s.stage.focusOn(p); },
  overlay(g, t) { hud(g, t, { gold: true }); grade(g, { warm: 0.16, v: 0.4 }); },
});
// s63: CTA over the golden wide platform
registerShot('s63', { kind: '3d',
  init(T) { const b = stationStage(T, 'evening', { focus: 7, aperture: 0.0015 }); b.m = place(b.stage, person2(T, MEERA_ADULT), [-0.25, 0, -2.0], 0.15); b.r = m7(T, b.stage, [0.75, 0, -2.0], -0.3, { color: '#e2ded6' }); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t }); life(s.m, t, 2, { expr: 'happy' }); move(T, s, t, info, C([-6, 1.8, 4.5], [0, 1.6, -1.6]), C([-8.5, 2.4, 5.5], [0, 1.6, -1.6]), ease.linear); },
  overlay(g, t, info) { hud(g, t, { gold: true }); const a = ease.out(prog(t, 0.3, 1.0)); g.save(); g.globalAlpha = a; const gr = g.createLinearGradient(0, 0, 0, E.H * 0.34); gr.addColorStop(0, 'rgba(6,6,16,.88)'); gr.addColorStop(1, 'rgba(6,6,16,0)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H * 0.34);
    text(g, 'Which job would you never give to a machine?', E.W / 2, E.H * 0.15, { size: V(48, 44), font: 'Playfair Display', weight: 900, italic: true, color: '#f6ecd8', glow: 12, glowColor: 'rgba(0,0,0,.7)' }); text(g, 'Tell us in the comments', E.W / 2, E.H * 0.23, { size: V(26, 26), font: 'Nunito', weight: 900, color: '#ffd8a0', spacing: 5 }); g.restore(); grade(g, { warm: 0.12, v: 0.4 }); },
});
