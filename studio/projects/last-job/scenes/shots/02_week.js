// shots/02_week.js: the Ministry, M-7 arrives, "stay one week", Monday-Friday, the nightly reports (s19-s37).
import { E, V, registerShot, text, alpha, rr } from '/engine/core.js';
import { stationStage, P, place, hari, m7, queue, C, move, talk, ease, clamp, lerp, prog, local, person2, robot, life, blinkFace, hold, BOSE, ARJUN, MEERA, CUSTOMERS } from '../sets/kit.js';
import { world } from '../sets/worlds.js';
import { jobsHud, grade, dayCard, report, wallScreen, CY } from '../sets/film.js';

const hud = (g, t, o = {}) => jobsHud(g, t, o);
const LOGS = [{ at: 0.6, text: 'MONDAY     Inefficiency detected.' }, { at: 1.9, text: 'TUESDAY    Inefficiency detected.' }, { at: 3.0, text: 'WEDNESDAY  Inefficiency detected.' }, { at: 3.8, text: 'THURSDAY   Inefficiency... detected?' }];
// s19: the Ministry of Efficiency: robots at desks, a giant wall screen finds the last job
registerShot('s19', { kind: '3d',
  init(T) { const W = world(T, 'office', { mood: 'night', seed: 9 }); const bots = []; for (let i = 0; i < 6; i++) { const b = robot(T, { s: 0.9 }); b.position.set(-4.5 + (i % 3) * 3, 0, -3.0 + Math.floor(i / 3) * 2.4); W.stage.add(b); bots.push(b); }
    const scr = wallScreen(T, W.stage, [0, 2.0, -5.85], 7.5, 2.6, (g, w, h, t) => { g.fillStyle = '#04121c'; g.fillRect(0, 0, w, h); g.fillStyle = CY; g.font = '900 52px "Nunito"'; g.textAlign = 'center'; g.fillText('DEPARTMENT OF EFFICIENCY', w / 2, 80);
      g.strokeStyle = alpha(CY, 0.25); for (let x = 0; x < w; x += 40) { g.beginPath(); g.moveTo(x, 110); g.lineTo(x, h); g.stroke(); } const k = clamp(t / 1.6); g.fillStyle = '#ff6a5a'; g.beginPath(); g.arc(w * 0.62, h * 0.6, 14 + 10 * Math.sin(t * 6), 0, 7); g.fill();
      g.fillStyle = '#ffffff'; g.font = '800 40px "Nunito"'; g.fillText(k > 0.5 ? 'HUMAN JOB DETECTED: 1' : 'SCANNING…', w / 2, h - 50); });
    return { stage: W.stage, W, bots, scr }; },
  draw(s, t, info, T) { s.W.tick(t); s.scr.paint(t); s.bots.forEach((b, i) => b.set({ hover: t + i, turn: t > 1.4 ? -0.0 : 0, face: t > 1.2 + i * 0.1 ? 'curious' : 'neutral' })); move(T, s, t, info, C([0, 2.2, 4.5], [0, 1.8, -5]), C([0, 2.0, 3.4], [0, 1.9, -5])); },
  overlay(g, t) { hud(g, t, { pulse: t - 1.6 }); grade(g, { cold: 0.08 }); },
});
// s20: Unit M-7 powers on (loading -> eyes), low angle hero reveal
registerShot('s20', { kind: '3d',
  init(T) { const W = world(T, 'void', { mood: 'night' }); const r = robot(T); W.stage.add(r); return { stage: W.stage, W, r }; },
  draw(s, t, info, T) { s.W.tick(t); const on = local(info, t, 'Seven') ?? 0.8; s.r.set({ hover: t, face: t < on ? 'loading' : blinkFace(t, 'neutral'), armL: 0.1, armR: 0.1, nod: t < on ? 0.25 : 0 });
    move(T, s, t, info, C([0.8, 0.7, 2.3], [0, 1.4, 0]), C([0.5, 0.8, 1.8], [0, 1.45, 0])); s.stage.focusOn(s.r.userData.head); },
  overlay(g, t) { hud(g, t); grade(g, { cold: 0.06 }); },
});
// s21: M-7 hovers down the empty platform toward the stall
registerShot('s21', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 5, aperture: 0.002 }); b.h = hari(T, b.stage); b.r = m7(T, b.stage, [-7, 0, 0.6], Math.PI / 2); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.position.x = lerp(-7, -2.2, ease.out(clamp(t / info.dur))); s.r.set({ hover: t, face: 'scan' }); life(s.h, t, 2, { look: [-0.6, 0] }); move(T, s, t, info, C([1.2, 1.1, 3.4], [-4.5, 1.2, 0.4]), C([0.8, 1.1, 3.1], [-2.6, 1.3, 0.4])); s.stage.focusOn(s.r.userData.head); },
  overlay(g, t) { hud(g, t, { pulse: t - 0.4 }); grade(g, { warm: 0.08 }); },
});
// s22-s23: M-7 at the counter, scanning the tea (data callouts), then CU "why do they come?"
registerShot('s22', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 2.2, aperture: 0.003 }); b.h = hari(T, b.stage); b.r = m7(T, b.stage, [0.45, 0, -0.3], Math.PI); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t, face: 'scan', nod: 0.2, armR: 0.3, reachR: 0.7 }); life(s.h, t, 1, { look: [0.3, 0.1] });
    move(T, s, t, info, C([1.7, 1.55, 0.6], [0.2, 1.3, -1.2]), C([1.5, 1.5, 0.3], [0.2, 1.3, -1.2])); s.stage.focusOn(s.r.userData.head); },
  overlay(g, t, info) { hud(g, t); const keys = [['thirty', '+31% STRENGTH'], ['Four', '+4° TOO HOT'], ['charge', '$2  (machine: $0)']];
    keys.forEach(([w, str], i) => { const k = local(info, t, w); if (k == null) return; const a = ease.out(prog(t, k, k + 0.25)); const x = E.W * 0.12, y = E.H * (0.2 + i * 0.09); rr(g, x, y, V(380, 400), V(62, 60), 14); g.fillStyle = `rgba(4,14,22,${0.8 * a})`; g.fill(); g.strokeStyle = alpha(CY, 0.7 * a); g.lineWidth = 2; g.stroke(); text(g, str, x + 20, y + V(32, 30), { size: V(32, 30), font: 'Nunito', weight: 900, color: i === 2 ? '#ffd27a' : CY, align: 'left', alpha: a }); });
    grade(g, { warm: 0.06 }); },
});
registerShot('s23', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 1.1, aperture: 0.006 }); b.h = hari(T, b.stage); b.r = m7(T, b.stage, [0.45, 0, -0.3], Math.PI); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t, face: 'curious', tilt: 0.22 * ease.out(clamp(t / 0.8)) }); life(s.h, t, 1);
    move(T, s, t, info, C([1.2, 1.6, -1.65], [0.45, 1.5, -0.3]), C([1.1, 1.6, -1.5], [0.45, 1.52, -0.3])); s.stage.focusOn(s.r.userData.head); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.06 }); },
});
// s24: Hari: "Stay one week. Then you tell me." He offers a glass to the robot
registerShot('s24', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 1.6, aperture: 0.005 }); b.h = hari(T, b.stage); b.r = m7(T, b.stage, [0.45, 0, -0.3], Math.PI); b.g = hold(T, b.h, 'glass', 1); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); const tk = talk(t, 0.1, info.dur - 0.4); life(s.h, t, 1, { expr: tk || (t > info.dur - 0.5 ? 'smirk' : 'happy'), look: [0.15, 0.05], armR: 0.3, reachR: lerp(0.4, 1.2, ease.inOut(clamp(t / 1.2))) }); s.r.set({ hover: t, face: 'neutral' });
    move(T, s, t, info, C([-0.15, 1.6, 0.0], [0.15, 1.52, -2.05]), C([-0.1, 1.6, -0.25], [0.15, 1.54, -2.05])); s.stage.focusOn(s.h.userData.head); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.1 }); },
});
// s25: so M-7 stayed: wide, robot parked beside the stall as customers come and go
registerShot('s25', { kind: '3d',
  init(T) { const b = stationStage(T, 'morning', { focus: 4.2, aperture: 0.002 }); b.h = hari(T, b.stage); b.r = m7(T, b.stage); b.q = queue(T, b.stage, 5, { dx: 0.5 }); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t, face: blinkFace(t, 'scan') }); life(s.h, t, 1, { expr: 'happy' }); s.q.forEach((c, i) => life(c, t, i + 4));
    move(T, s, t, info, C([-3.6, 1.7, 4.2], [0.6, 1.2, -1]), C([-3.0, 1.65, 3.8], [0.8, 1.2, -1])); },
  overlay(g, t) { hud(g, t); grade(g, { warm: 0.1 }); },
});
// ---- the week ----
const visitor = (id, look, mood, opts) => registerShot(id, { kind: '3d',
  init(T) { const b = stationStage(T, mood, { focus: opts.focus ?? 2.2, aperture: opts.ap ?? 0.004 }); b.h = hari(T, b.stage); b.v = place(b.stage, person2(T, look), opts.vpos || P.front, opts.vr ?? Math.PI); b.r = m7(T, b.stage);
    if (opts.init) opts.init(T, b); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t, face: blinkFace(t, opts.rface || 'scan') }); opts.act(s, t, info, T); move(T, s, t, info, opts.a, opts.b); s.stage.focusOn(opts.focusOn ? opts.focusOn(s) : s.v.userData.head); },
  overlay(g, t, info, s) { hud(g, t); if (opts.card) dayCard(g, opts.card, ease.out(prog(t, 0, 0.4)) * (1 - ease.in(prog(t, 2.4, 3.0)))); if (opts.over) opts.over(g, t, info, s); grade(g, { warm: 0.1 }); },
});
visitor('s26', BOSE, 'morning', { card: 'Monday', vpos: [3.0, 0, 0.5], vr: -1.9, a: C([4.6, 1.6, 2.8], [2.0, 1.4, 0]), b: C([4.0, 1.55, 2.3], [1.5, 1.4, -0.2]),
  act(s, t, info) { const k = clamp(t / info.dur); s.v.position.set(lerp(3.2, 0.9, k), 0, lerp(0.6, -0.3, k)); life(s.v, t, 4, { expr: 'sad', walk: t * 4.5, stride: 0.3, nod: 0.15 }); life(s.h, t, 0, { look: [0.5, 0] }); } });
visitor('s27', BOSE, 'morning', { focus: 0.8, ap: 0.009, init(T, b) { b.stall.biscuits.forEach((x) => (x.visible = false)); },
  a: C([0.9, 1.45, -0.35], [0.33, 1.08, -1.05]), b: C([0.75, 1.42, -0.45], [0.33, 1.08, -1.05]), focusOn: () => [0.35, 1.08, -1.05],
  act(s, t, info) { const k = local(info, t, 'two') ?? 0.6; s.stall.biscuits.forEach((x, i) => (x.visible = t > k + i * 0.25)); life(s.h, t, 0, { look: [0.2, -0.6], nod: 0.25, armL: 0.25, reachL: t > k - 0.4 && t < k + 1.2 ? 1.1 : 0.3 }); life(s.v, t, 4, { expr: 'sad' }); } });
visitor('s28', BOSE, 'morning', { focus: 1.2, ap: 0.006, rface: 'curious', init(T, b) { b.stall.biscuits.forEach((x) => (x.visible = true)); },
  a: C([-0.5, 1.6, -1.8], [0.3, 1.55, -0.42]), b: C([-0.42, 1.6, -1.7], [0.3, 1.57, -0.42]),
  act(s, t, info) { const k = local(info, t, 'Without') ?? 1.2; life(s.v, t, 4, { expr: t < k ? 'cry' : 'proud', look: [0, -0.3], nod: t < k ? 0.25 : 0.05 }); life(s.h, t, 0); } });
visitor('s29', ARJUN, 'morning', { card: 'Tuesday', vpos: [2.4, 0, 0.8], vr: -2.2, focus: 3, a: C([3.8, 1.5, 3.2], [1.2, 1.3, 0]), b: C([3.4, 1.5, 2.8], [1.0, 1.3, -0.2]),
  act(s, t, info) { const k = clamp(t / info.dur); s.v.position.set(lerp(2.6, 1.0, k), 0, lerp(0.9, -0.25, k)); life(s.v, t, 6, { expr: 'sad', walk: t * 4, stride: 0.22, nod: 0.3, armL: 0.05, armR: 0.05 }); life(s.h, t, 0, { look: [0.4, 0] }); } });
visitor('s30', ARJUN, 'morning', { focus: 1.5, ap: 0.005, init(T, b) { b.cl = hold(T, b.h, 'cloth', 1); },
  a: C([2.0, 1.6, 0.7], [0.2, 1.4, -1.4]), b: C([1.85, 1.6, 0.5], [0.2, 1.42, -1.4]), focusOn: (s) => s.h.userData.head,
  act(s, t, info) { const tk = local(info, t, 'Mugs') ?? 1; life(s.h, t, 0, { expr: t > tk && t < tk + 1.8 && Math.sin(t * 17) > -0.2 ? 'talk' : 'smirk', look: [0.2, 0], armR: 0.3, reachR: lerp(0.4, 1.3, ease.inOut(clamp(t / 1.0))) }); life(s.v, t, 6, { expr: t > tk + 1.6 ? 'surprised' : 'sad' }); } });
visitor('s31', ARJUN, 'day', { vpos: [0.85, 0, -1.95], vr: 0, focus: 1.9, rface: 'curious', init(T, b) { b.cl = hold(T, b.v, 'cloth', 1); b.gl = hold(T, b.v, 'glass', 0); },
  a: C([-0.1, 1.62, -0.2], [0.85, 1.4, -1.95]), b: C([0.0, 1.62, -0.4], [0.85, 1.42, -1.95]),
  act(s, t, info) { const k = local(info, t, 'smiled') ?? 2; life(s.v, t, 6, { expr: t > k ? 'happy' : 'neutral', look: [0, -0.4], armR: 0.3, reachR: 1.0 + 0.25 * Math.sin(t * 7), armL: 0.3, reachL: 1.0 }); life(s.h, t, 0, { look: [0.6, 0], expr: t > k + 0.5 ? 'proud' : undefined }); s.h.position.x = -0.35; } });
visitor('s32', MEERA, 'morning', { card: 'Wednesday', vpos: [0.35, 0, -0.05], focus: 1.2, ap: 0.005, a: C([1.05, 1.12, -0.8], [0.35, 1.04, -0.05]), b: C([0.95, 1.12, -0.82], [0.35, 1.05, -0.05]),
  act(s, t, info) { const k = local(info, t, 'math') ?? 2; life(s.v, t, 7, { expr: t > k ? 'nervous' : 'neutral', look: [0, -0.5] }); life(s.h, t, 0, { look: [0.1, -0.5] }); } });
visitor('s33', MEERA, 'morning', { vpos: [0.35, 0, -0.05], focus: 0.8, ap: 0.008, a: C([0.2, 1.12, -0.9], [0.35, 1.06, -0.05]), b: C([0.22, 1.11, -0.82], [0.35, 1.06, -0.05]),
  act(s, t, info) { life(s.v, t, 7, { expr: talk(t, 0.05, info.dur - 0.3) || 'love', look: [0, -0.5], tilt: 0.1 }); life(s.h, t, 0); } });
visitor('s34', MEERA, 'morning', { vpos: [0.35, 0, -0.05], focus: 1.4, ap: 0.005, rface: 'curious', init(T, b) { b.k = hold(T, b.h, 'kettle', 1); b.stall.kettle.visible = false; },
  a: C([-0.5, 1.6, -0.1], [0.15, 1.52, -2.05]), b: C([-0.45, 1.6, -0.3], [0.15, 1.54, -2.05]), focusOn: (s) => s.h.userData.head,
  act(s, t, info) { const al = local(info, t, 'Always') ?? 0.9; life(s.h, t, 0, { expr: t < al + 0.6 && t > 0.05 && Math.sin(t * 17) > -0.2 ? 'talk' : 'wink', look: [0.2, -0.4], armR: 0.5, reachR: 1.1 }); life(s.v, t, 7, { expr: 'happy' }); } });
// s35-s37: every night, M-7 writes its report (night station, glowing robot alone; terminal overlay)
const night = (id, opts) => registerShot(id, { kind: '3d',
  init(T) { const b = stationStage(T, 'night', { focus: 2.4, aperture: 0.004 }); b.r = m7(T, b.stage, [1.2, 0, 0.6], -2.6); b.stall.setShutter(1); b.tb = hold(T, b.r, 'tablet', 1); return b; },
  draw(s, t, info, T) { s.S.tickAll(t); s.r.set({ hover: t, face: opts.face(t, info), armR: 0.4, reachR: 1.1, nod: 0.25, tilt: opts.tilt ? opts.tilt(t, info) : 0 }); move(T, s, t, info, opts.a, opts.b); s.stage.focusOn(s.r.userData.head); },
  overlay(g, t, info, s) { hud(g, t); opts.over(g, t, info); grade(g, { cold: 0.1, v: 0.45 }); },
});
night('s35', { face: (t) => blinkFace(t, 'neutral'), a: C([-1.5, 1.4, 3.0], [1.2, 1.3, 0.6]), b: C([-1.0, 1.4, 2.6], [1.2, 1.3, 0.6]), over: (g, t, info) => report(g, t, [], { a: ease.out(prog(t, info.dur - 1.0, info.dur - 0.4)), x: E.W * 0.52, w: V(780, 900) }) });
night('s36', { face: (t) => blinkFace(t, 'scan'), a: C([2.6, 1.55, 2.2], [1.2, 1.4, 0.6]), b: C([2.4, 1.55, 1.9], [1.2, 1.42, 0.6]),
  over: (g, t, info) => { const m = local(info, t, 'Monday') ?? 0.3, tu = local(info, t, 'Tuesday') ?? 2; report(g, t, [{ at: m, text: 'MONDAY      Inefficiency detected.' }, { at: tu, text: 'TUESDAY     Inefficiency detected.' }, { at: tu + 1.3, text: 'WEDNESDAY   Inefficiency detected.' }], { x: E.W * 0.06, w: V(860, 900) }); } });
night('s37', { face: (t, info) => (t > (local(info, t, 'Pattern') ?? 2) ? 'curious' : 'scan'), tilt: (t, info) => (t > (local(info, t, 'Pattern') ?? 2) ? 0.2 : 0), a: C([1.9, 1.6, 0.0], [1.2, 1.55, 0.6]), b: C([1.8, 1.6, -0.1], [1.2, 1.57, 0.6]),
  over: (g, t, info) => { const p = local(info, t, 'Pattern') ?? 2; report(g, t + 5, [{ at: 0, text: 'MONDAY      Inefficiency detected.' }, { at: 0, text: 'TUESDAY     Inefficiency detected.' }, { at: 0, text: 'THURSDAY    Inefficiency... detected?' }, { at: p + 5, text: 'FRIDAY      PATTERN UNKNOWN.', color: '#ffd27a', size: V(36, 34) }], { x: E.W * 0.04, w: V(820, 900), h: V(330, 440) }); } });
