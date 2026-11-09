// shots/02_library.js: the library girl, the 50/200-hour science, time like money, Kabir's number falls (f14–f23).
import { E, V, registerShot, ease, prog, clamp, lerp, rng, alpha, text, glow, circle, rr, seg } from '/engine/core.js';
import { LOOK, faceTo, person, local, blinkAt, cam, proj, tag, roll, hud, tone, vignette, topBand, serif, bigText, cite, panel, darken, icon, chat, stageFor, canteen, library, coin, TAGC } from '../sets/fc.js';

const sitAt = (T, st, who, x, z, y = 0.2) => person(T, st, who, [x, z], 0, { y, set: { sit: true, armL: 0.25, armR: 0.25, reachL: 0.9, reachR: 0.9 } });
const life = (p, t, seed, o = {}) => p.set({ breathe: t + seed, expr: o.expr ?? (blinkAt(t, seed) ? 'blink' : 'neutral'), ...o });
const GIRL = [-0.6, -2.42];
function libSet(T, o = {}) { const st = stageFor(T, 'library', { focus: o.focus ?? 3, aperture: o.aperture ?? 0.004, maxblur: o.maxblur ?? 0.01 }); const set = library(T, st); const girl = sitAt(T, st, 'lib', GIRL[0], GIRL[1]); return { st, set, girl }; }

// f14: library establishing: the girl alone at the lamp-lit table
registerShot('f14', { kind: '3d',
  init(T) { const h = libSet(T, { focus: 5.5, aperture: 0.002 }); return { stage: h.st, ...h }; },
  draw(s, t, info, T) { s.set.tick(t); life(s.girl, t, 1, { look: [0, -0.6], nod: 0.25, reachL: 1.0, reachR: 1.0 });
    cam(T, s.stage, t, info.dur, { pos: [2.6, 2.3, 4.2], look: [-0.4, 1.0, -2.2] }, { pos: [1.9, 2.0, 3.3], look: [-0.5, 1.05, -2.3] }); s.stage.focusOn(s.girl.userData.head); s.P = proj(T, s.stage, s.girl, 0.66); },
  overlay(g, t, info, s) { tag(g, s.P, '· · ·', { t, a: 0.55, s: 0.9, kind: 'cold' }); hud(g, t); vignette(g); },
});
// f15: closer; her number rolls to 11,000 … 30 YEARS
registerShot('f15', { kind: '3d',
  init(T) { const h = libSet(T, { focus: 2.6, aperture: 0.005 }); return { stage: h.st, ...h }; },
  draw(s, t, info, T) { s.set.tick(t + 2.5); const el = local(info, t, 'eleven') ?? 1.33; life(s.girl, t, 2, { expr: t < el + 0.5 ? (blinkAt(t, 2) ? 'blink' : 'neutral') : 'surprised', look: t < el ? [0, -0.6] : [0.3, 0.2], nod: t < el ? 0.25 : 0, reachL: 1.0, reachR: 1.0 });
    cam(T, s.stage, t, info.dur, { pos: [0.7, 1.6, 0.4], look: [-0.6, 1.72, -2.42] }, { pos: [0.45, 1.6, -0.1], look: [-0.6, 1.75, -2.42] }); s.stage.focusOn(s.girl.userData.head); s.P = proj(T, s.stage, s.girl, 0.66); },
  overlay(g, t, info, s) { const el = local(info, t, 'eleven') ?? 1.33, th = local(info, t, 'thirty') ?? 2.99, dy = local(info, t, 'days') ?? 2.6;
    if (t > el - 0.1) glow(g, s.P.x, s.P.y, 240, '#ffffff', 0.15 * ease.out(prog(t, dy, dy + 0.4)));
    tag(g, s.P, t < el - 0.1 ? '· · ·' : roll(t, el - 0.1, dy + 0.1, 0, 11000), { t, kind: t < el - 0.1 ? 'cold' : 'white', s: 1.2, pop: t - (dy + 0.1), sub: t > th ? '= 30 YEARS' : null }); hud(g, t); vignette(g); },
});
// f16: YOU says hi; she laughs
registerShot('f16', { kind: '3d',
  init(T) { const h = libSet(T, { focus: 3 }); const you = faceTo(person(T, h.st, 'you', [0.55, -1.45]), GIRL[0], GIRL[1]); return { stage: h.st, ...h, you }; },
  draw(s, t, info, T) { s.set.tick(t + 7); const hi = local(info, t, 'hi') ?? 0.57, fun = local(info, t, 'funniest') ?? 2.05; const laugh = t > fun - 0.6;
    life(s.you, t, 3, { expr: t < hi + 0.4 ? 'talk' : laugh && Math.sin(t * 9) > 0 ? 'happy' : 'happy', armR: t < hi + 1.0 ? 2.5 + 0.3 * Math.sin(t * 12) : 0.3, look: [0, 0] });
    life(s.girl, t, 4, { expr: t < hi + 0.3 ? 'surprised' : laugh ? (Math.sin(t * 10) > 0 ? 'happy' : 'love') : 'happy', look: [0.5, 0.25], tilt: laugh ? 0.12 * Math.sin(t * 7) : 0, nod: laugh ? -0.1 : 0, reachL: 1.0, reachR: laugh ? 1.6 : 1.0 });
    cam(T, s.stage, t, info.dur, { pos: [-2.3, 1.6, 0.6], look: [0, 1.5, -1.94] }, { pos: [-1.95, 1.6, 0.25], look: [0, 1.52, -1.94] }); s.stage.focusOn([0, 1.4, -1.95]); s.P = proj(T, s.stage, s.girl, 0.66); },
  overlay(g, t, info, s) { const fun = local(info, t, 'funniest') ?? 2.05; tag(g, s.P, 11000, { t, s: 1.0 }); if (t > fun - 0.5) { const k = ease.out(prog(t, fun - 0.5, fun)); text(g, 'HA HA HA', s.P.x - 40, s.P.y + 120, { size: 30, font: 'Nunito', weight: 900, color: '#ffd8ff', alpha: k * (0.6 + 0.4 * Math.sin(t * 14)), spacing: 4 }); } hud(g, t); vignette(g); },
});
// f17: "here's the strange part. It's real science." library racks out of focus, serif title
registerShot('f17', { kind: '3d',
  init(T) { const h = libSet(T, { focus: 0.6, aperture: 0.02, maxblur: 0.02 }); return { stage: h.st, ...h }; },
  draw(s, t, info, T) { s.set.tick(t + 10); s.stage.bokeh.uniforms.focus.value = lerp(3.2, 0.6, ease.inOut(prog(t, 0, 1.4))); life(s.girl, t, 1, { expr: 'happy', look: [0.2, 0] });
    cam(T, s.stage, t, info.dur, { pos: [2.0, 1.8, 1.5], look: [-0.5, 1.3, -2.2] }, { pos: [1.4, 1.9, 0.8], look: [-0.5, 1.4, -2.4] }); },
  overlay(g, t, info, s) { const sc = local(info, t, 'science') ?? 2.44; darken(g, 0.35 * ease.out(prog(t, 0.3, 1.4)));
    serif(g, 'And here’s the strange part…', E.W / 2, E.H * 0.4, { size: 54, a: ease.out(prog(t, 0.2, 0.7)) * (1 - ease.out(prog(t, sc - 0.4, sc - 0.1)) * 0.5) });
    const k = ease.outBack(prog(t, sc - 0.15, sc + 0.25)); g.save(); g.translate(E.W / 2, E.H * 0.55); g.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k); bigText(g, 'IT’S REAL SCIENCE', 0, 0, { size: 110, a: clamp(k), glowColor: 'rgba(120,230,220,.6)' }); g.restore(); hud(g, t); vignette(g); },
});
// shared hours card
function hoursCard(g, t, k1, k2, a, rows2 = true) {
  darken(g, 0.45 * a); const x = E.W / 2 - 720, y = E.H * 0.24, w = 1440, h = 560; panel(g, x, y, w, h, a, '#7fe8d8');
  serif(g, 'How long it takes to make a friend', E.W / 2, E.H * 0.15, { size: 52, a });
  const row = (ry, from, to, c1, c2, label, hrs, k, max) => { const ka = a * ease.out(prog(k, 0, 0.15)); if (ka <= 0) return;
    icon(g, x + 120, ry + 40, 1.7, c1, ka); text(g, from, x + 120, ry + 125, { size: 26, font: 'Nunito', weight: 900, color: '#cfd8f0', alpha: ka, spacing: 2 });
    icon(g, x + w - 120, ry + 40, 1.7, c2, ka * (0.35 + 0.65 * clamp(k)), { glow: 0.3 * k }); text(g, to, x + w - 120, ry + 125, { size: 26, font: 'Nunito', weight: 900, color: '#ffffff', alpha: ka, spacing: 2 });
    const bx = x + 230, bw = w - 460, by = ry + 18; rr(g, bx, by, bw, 56, 28); g.fillStyle = 'rgba(255,255,255,.08)'; g.save(); g.globalAlpha *= ka; g.fill(); g.restore();
    const f = clamp(k) * (hrs / max); rr(g, bx, by, Math.max(56, bw * f), 56, 28); g.save(); g.globalAlpha *= ka; g.fillStyle = c2; g.shadowColor = c2; g.shadowBlur = 20; g.fill(); g.restore();
    for (let i = 1; i < 10; i++) seg(g, [[bx + bw * i / 10, by + 62], [bx + bw * i / 10, by + 72]], 2, alpha('#ffffff', 0.3 * ka));
    text(g, `${Math.round(hrs * clamp(k))}${hrs > 100 && k >= 1 ? '+' : ''} hours`, bx + Math.max(34, bw * f) + (f > 0.7 ? -110 : 110), by + 28, { size: 40, font: 'Nunito', weight: 900, color: f > 0.7 ? '#10121e' : '#ffffff', alpha: ka });
    text(g, label, bx + bw / 2, ry + 120, { size: 40, font: 'Nunito', weight: 900, color: c2, alpha: ka, spacing: 4 }); };
  row(y + 90, 'STRANGER', 'CASUAL FRIEND', '#8a90a8', '#7fe8d8', 'CASUAL FRIEND', 50, k1, 220);
  if (rows2) row(y + 330, 'CASUAL FRIEND', 'CLOSE FRIEND', '#7fe8d8', '#ffcf5a', 'CLOSE FRIEND', 200, k2, 220);
  cite(g, 'Hall, 2018 · Journal of Social and Personal Relationships', E.W / 2, y + h - 30, a);
}
const cardBG = (T, kind = 'library') => { const st = stageFor(T, kind, { focus: 0.5, aperture: 0.025, maxblur: 0.025 }); const set = kind === 'library' ? library(T, st) : canteen(T, st, { clear: [[0, 0]] }); return { stage: st, set }; };
registerShot('f18', { kind: '3d',
  init(T) { return cardBG(T); },
  draw(s, t, info, T) { s.set.tick(t + 13); cam(T, s.stage, t, info.dur, { pos: [2.0, 2.0, 3.0], look: [-0.5, 1.4, -3] }, { pos: [0.8, 2.0, 2.4], look: [-0.8, 1.5, -3] }, ease.linear); },
  overlay(g, t, info, s) { const f = local(info, t, 'fifty') ?? 2.13, cf = local(info, t, 'casual') ?? 4.7; hoursCard(g, t, prog(t, f - 0.6, cf), 0, ease.out(prog(t, 0, 0.4)), false); hud(g, t); vignette(g); },
});
registerShot('f19', { kind: '3d',
  init(T) { return cardBG(T); },
  draw(s, t, info, T) { s.set.tick(t + 18); cam(T, s.stage, t, info.dur, { pos: [0.8, 2.0, 2.4], look: [-0.8, 1.5, -3] }, { pos: [-0.4, 2.0, 2.0], look: [-1.0, 1.5, -3] }, ease.linear); },
  overlay(g, t, info, s) { const tw = local(info, t, 'two') ?? 1.21, cl = local(info, t, 'close') ?? 2.71; hoursCard(g, t, 1, prog(t, tw - 0.4, cl + 0.2), 1, true); hud(g, t); vignette(g); },
});
// f20: LUCK crossed out -> TIME
registerShot('f20', { kind: '3d',
  init(T) { return cardBG(T, 'canteen'); },
  draw(s, t, info, T) { s.set.tick(t + 20); cam(T, s.stage, t, info.dur, { pos: [-2, 2.2, 5], look: [0, 1.2, -3] }, { pos: [-1.2, 2.1, 4.4], look: [0, 1.2, -3] }, ease.linear); },
  overlay(g, t, info, s) { const lu = local(info, t, 'luck') ?? 1.0, ti = local(info, t, 'time') ?? 1.94; darken(g, 0.5);
    const lx = E.W * 0.3, rx = E.W * 0.7, cy = E.H * 0.45, a1 = ease.out(prog(t, 0.1, 0.4)), dim = 1 - 0.55 * ease.out(prog(t, lu + 0.2, lu + 0.6));
    // dice
    g.save(); g.globalAlpha = a1 * dim; g.translate(lx, cy - 40); g.rotate(-0.15 + 0.05 * Math.sin(t * 2)); rr(g, -90, -90, 180, 180, 30); g.fillStyle = '#f4f0ea'; g.fill(); for (const [dx, dy] of [[-45, -45], [45, 45], [0, 0], [45, -45], [-45, 45]]) circle(g, dx, dy, 15, '#20202c'); g.restore();
    bigText(g, 'LUCK', lx, cy + 140, { size: 80, a: a1 * dim, color: '#cfd8f0', glow: 0 });
    const sk = ease.out(prog(t, lu, lu + 0.25)); if (sk > 0) seg(g, [[lx - 170, cy + 150], [lx - 170 + 340 * sk, cy + 150 - 330 * sk]], 14, '#ff4d4d');
    // clock
    const a2 = ease.outBack(prog(t, ti - 0.2, ti + 0.3)); if (a2 > 0) { g.save(); g.translate(rx, cy - 40); g.scale(a2, a2); glow(g, 0, 0, 220, '#ffcf5a', 0.35); circle(g, 0, 0, 100, '#ffcf5a'); circle(g, 0, 0, 84, '#fff4d8'); g.strokeStyle = '#2a1a10'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -60); g.moveTo(0, 0); const an = t * 2; g.lineTo(Math.sin(an) * 45, -Math.cos(an) * 45); g.stroke(); g.restore();
      bigText(g, 'TIME', rx, cy + 140, { size: 110, a: clamp(a2), color: '#ffe8a0', glowColor: 'rgba(255,200,90,.8)' }); }
    hud(g, t); vignette(g); },
});
// f21: spending time like money: clock-coins drop between friends, their numbers tick up
registerShot('f21', { kind: '3d',
  init(T) { const st = stageFor(T, 'canteen', { focus: 2.6, aperture: 0.004 }); const set = canteen(T, st, { clear: [[0, 0], [-0.9, -0.15], [0.8, -0.15], [0, 1.38]] });
    const riya = sitAt(T, st, 'riya', -0.75, -0.15), lib = sitAt(T, st, 'lib', 0.75, -0.15), you = person(T, st, 'you', [0, 1.38], Math.PI, { y: 0.2, set: { sit: true } });
    const coins = Array.from({ length: 9 }, () => coin(T, st)); return { stage: st, set, riya, lib, you, coins }; },
  draw(s, t, info, T) { s.set.tick(t + 22); const R = rng(3);
    s.coins.forEach((c, i) => { const t0 = 0.15 + i * 0.17, x = (i % 2 ? -0.5 : 0.5) * (0.4 + R() * 0.8), z = 0.3 + R() * 0.4; const k = prog(t, t0, t0 + 0.45); const y = 0.68 + (1 - ease.out(k)) * 1.6 + Math.abs(Math.sin(k * 9)) * 0.06 * (1 - k); c.position.set(x, t < t0 ? 9 : y, z); c.rotation.set(k < 1 ? t * 8 + i : 0, i, 0); });
    s.you.visible = false; life(s.riya, t, 1, { expr: t > 1.0 ? 'happy' : 'neutral', look: [0.2, -0.3] }); life(s.lib, t, 2, { expr: t > 1.2 ? 'love' : 'neutral', look: [-0.2, -0.3] }); life(s.you, t, 3, { armL: 0.6, reachL: 1.3 });
    cam(T, s.stage, t, info.dur, { pos: [0.6, 3.0, 3.1], look: [0, 0.95, 0.0] }, { pos: [0.3, 2.8, 2.7], look: [0, 1.0, 0.0] }); s.stage.focusOn([0, 0.9, 0.3]); s.Pr = proj(T, s.stage, s.riya, 0.66); s.Pl = proj(T, s.stage, s.lib, 0.66); },
  overlay(g, t, info, s) { tag(g, s.Pr, roll(t, 0.8, 1.8, 2300, 2460), { t, pop: (t * 3) % 1, s: 1.0 }); tag(g, s.Pl, roll(t, 1.0, 2.0, 11000, 11240), { t, pop: (t * 3 + 0.5) % 1, s: 1.0 });
    if (t > 0.9) text(g, '+160', s.Pr.x + 120, s.Pr.y - 50 - t * 20, { size: 30, font: 'Nunito', weight: 900, color: '#7fe8a8', alpha: 1 - prog(t, 1.8, 2.4) }); if (t > 1.1) text(g, '+240', s.Pl.x + 130, s.Pl.y - 50 - t * 20, { size: 30, font: 'Nunito', weight: 900, color: '#7fe8a8', alpha: 1 - prog(t, 2.0, 2.4) }); hud(g, t); vignette(g); },
});
// f22: Kabir alone; his number now amber
function kabirAlone(T, o = {}) { const st = stageFor(T, 'canteen', { focus: o.focus ?? 2.3, aperture: o.aperture ?? 0.005, maxblur: o.maxblur ?? 0.012 }); const set = canteen(T, st, { clear: [[0.15, -0.15]] }); const kabir = sitAt(T, st, 'kabir', 0.15, -0.15);
  const ph = T.box(0.08, 0.15, 0.012, T.mat('#14141c'), 0, -0.47, 0.06); kabir.userData.arms[1].add(ph); return { stage: st, set, kabir }; }
registerShot('f22', { kind: '3d',
  init(T) { return kabirAlone(T); },
  draw(s, t, info, T) { s.set.tick(t + 25); life(s.kabir, t, 2, { expr: blinkAt(t, 2) ? 'blink' : 'neutral', look: [0.1, -0.6], nod: 0.18, reachR: 1.2, armR: 0.3 });
    cam(T, s.stage, t, info.dur, { pos: [-1.4, 1.75, 2.0], look: [0.15, 1.7, -0.15] }, { pos: [-1.1, 1.72, 1.6], look: [0.15, 1.74, -0.15] }); s.stage.focusOn(s.kabir.userData.head); s.P = proj(T, s.stage, s.kabir, 0.66); },
  overlay(g, t, info, s) { const f = local(info, t, 'falling') ?? 1.23; tag(g, s.P, 41, { t, kind: t > f ? 'amber' : 'white', pop: t - f, dy: t > f ? 6 * Math.sin(t * 20) * (1 - prog(t, f, f + 0.5)) : 0 }); hud(g, t); vignette(g); },
});
// f23: tight on the number: 41 -> 30 -> 22
registerShot('f23', { kind: '3d',
  init(T) { return kabirAlone(T, { focus: 1.2, aperture: 0.01 }); },
  draw(s, t, info, T) { s.set.tick(t + 27); life(s.kabir, t, 3, { expr: 'neutral', look: [0.1, -0.6], nod: 0.18, reachR: 1.2, armR: 0.3 });
    cam(T, s.stage, t, info.dur, { pos: [0.3, 1.55, 1.25], look: [0.15, 2.0, -0.15] }, { pos: [0.25, 1.6, 0.95], look: [0.15, 2.05, -0.15] }, ease.linear); s.stage.focusOn([0.15, 2.1, -0.15]); s.P = proj(T, s.stage, s.kabir, 0.66); },
  overlay(g, t, info, s) { const a = local(info, t, '41') ?? 0.13, b = local(info, t, '30') ?? 1.03, c = local(info, t, '22') ?? 2.01; const v = t < b ? 41 : t < c ? 30 : 22, last = t < b ? a : t < c ? b : c;
    const fl = Math.max(0, 1 - (t - last) / 0.3); g.save(); g.globalAlpha = 0.18 * fl; g.fillStyle = '#ff4020'; g.fillRect(0, 0, E.W, E.H); g.restore();
    tag(g, s.P, v, { t, kind: v < 30 ? 'red' : 'amber', s: 1.15, pop: t - last, glitch: fl * 0.8 }); hud(g, t, { color: '#ffb43c' }); vignette(g, 0.6); },
});
