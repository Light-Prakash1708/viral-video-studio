// shots/fl.js (v3, flat-vector toon style): white round-faced cast, flat sedan, parallax flat worlds, impact reaction cards.
import { E, registerShot, ease, prog, clamp, lerp, text, veil, rr, rng, circle, seg } from '/engine/core.js';
import { local } from '../sets/ui.js';
import { INK, ell, rrect, shade, drawChar, drawHead, keys, A, ARM, carSide, carFront, wheel, roadSide, roadPOV, flatRock, dust, speedLines, burst, impactBg, skyGrad, cloudStrip, puffCloud, teardropTree, bush, townSkyline, ditchBack, ditchFront, dirtChunks } from '../sets/flat.js';
import { CAST } from '../sets/cast_flat.js';

const W = E.W, H = E.H, TAU = Math.PI * 2;
const atc = (info, t, w, fb) => { const x = local(info, t, w); return x == null || x < -0.2 || x > info.dur ? fb : x; };
// 2D camera: zoom z about world point (cx, cy) placed at screen centre
const cam = (g, z, cx, cy, rot = 0) => { g.translate(W / 2, H / 2); g.rotate(rot); g.scale(z, z); g.translate(-cx, -cy); };
const shk = (t, t0, amp = 18, dur = 0.45) => { const k = clamp(1 - (t - t0) / dur); return t > t0 && k > 0 ? [Math.sin(t * 87) * amp * k, Math.cos(t * 71) * amp * k] : [0, 0]; };
const word = (g, s, x, y, a, size = 130, col = '#ffd23a', rot = -0.08) => { if (a <= 0) return; const sc = 0.6 + 0.4 * ease.outBack(clamp(a)); g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha = clamp(a * 3); g.font = `900 ${size}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = size * 0.16; g.strokeStyle = INK; g.strokeText(s, 0, 0); g.fillStyle = col; g.fillText(s, 0, 0); g.restore(); };
const chip = (g, s, a, y = 170, col = '#ffd23a') => { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = '900 42px Nunito'; const w = g.measureText(s).width + 64; rrect(g, W / 2 - w / 2, y - 38, w, 76, 38); g.fillStyle = INK; g.fill(); g.restore(); text(g, s, W / 2, y + 2, { size: 42, font: 'Nunito', weight: 900, color: col, alpha: a, spacing: 3 }); };
const card = (g, s, x, y, a, sub) => { if (a <= 0) return; g.save(); g.globalAlpha = clamp(a); g.font = '900 44px Nunito'; const w = Math.max(g.measureText(s).width, 160) + 50; rrect(g, x - w / 2, y - 40, w, sub ? 116 : 80, 24); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); g.restore(); text(g, s, x, y, { size: 44, font: 'Nunito', weight: 900, color: INK, alpha: a }); if (sub) text(g, sub, x, y + 46, { size: 30, font: 'Nunito', weight: 800, color: '#4a5a7a', alpha: a }); };
const sideRiders = (t, ex) => (g) => { // dad at the wheel (front window), mom + kid in the back window
  drawChar(g, 92, -30, 0.42, CAST.dad, keys(t, ex.dad, 1)); drawChar(g, -60, -40, 0.36, CAST.kid, keys(t, ex.kid, 3)); drawChar(g, -118, -30, 0.4, CAST.mom, keys(t, ex.mom, 2)); };
const frontRiders = (t, P) => (g) => { // car-space seated cast: mom left, kid centre, dad right (driver)
  drawChar(g, P.momX ?? -300, 110 + (P.jm || 0), 1.3, CAST.mom, { ...P.mom, legs: 'none' }); drawChar(g, P.kidX ?? 0, 150 + (P.jk || 0), 1.12, CAST.kid, { ...P.kid, legs: 'none' }); drawChar(g, P.dadX ?? 300, 110 + (P.jd || 0), 1.35, CAST.dad, { ...P.dad, legs: 'none' }); };
const roadBehind = (t, v = 1) => (g) => { skyGrad(g, 1600, 600, ['#4ab8f4', '#bfeaff'], -520, 0); g.save(); g.translate(-800, -520); for (let i = 0; i < 3; i++) cloudStrip(g, ((i * 600 + t * 60 * v) % 1900) - 200, 80 + i * 70, 360, 36); g.fillStyle = '#9acb2a'; g.fillRect(0, 340, 1600, 200); for (let i = 0; i < 7; i++) teardropTree(g, ((i * 260 + t * 240 * v) % 1820) - 110, 360, 0.5, '#6a9a22', i); g.restore(); };

// ---------- f01 "He was driving his wife and daughter home when a huge rock appeared in the middle of the road."
registerShot('f01', { draw(g, t, info) {
  const rk = atc(info, t, 'rock', 2.36), c1 = 1.45, c2 = rk - 0.1, c3 = info.dur - 0.62;
  if (t < c1) { // wide tracking side view, slow push
    g.save(); const z = lerp(1.22, 1.32, ease.inOut(t / c1)); cam(g, z, W / 2 + 40, H * 0.56 + 120); const r = roadSide(g, W, H, t * 900, { roadY: H * 0.56, roadH: 300 });
    carSide(g, W / 2, r.roadY + 210 + Math.sin(t * 14) * 2, 1.3, { color: '#3aa0d8', spin: t * 16, riders: sideRiders(t, { dad: [[0, { expr: 'talk', ...A('wheel') }]], kid: [[0, { expr: 'laughing', ...A('cheer') }]], mom: [[0, { expr: 'laughing', ...A('belly') }]] }) });
    g.restore(); }
  else if (t < c2) { // windshield: the happy family
    const u = t - c1; g.save(); cam(g, lerp(1.4, 1.5, u / (c2 - c1)), W / 2 + 40, H * 0.47 + Math.sin(t * 13) * 3);
    skyGrad(g, W, H, ['#4ab8f4', '#bfeaff']); carFront(g, W / 2, H * 0.62, 0.78, { color: '#3aa0d8', wheelX: 300, behind: roadBehind(t, -1) }, frontRiders(t, { dad: keys(t, [[0, { expr: 'laughing', ...A('wheel') }]], 1), kid: keys(t, [[0, { expr: 'happy', armL: [0.12, 0.15], armR: [2.6, 0.5] }]], 3), mom: keys(t, [[0, { expr: 'talk', ...A('lap'), look: 0.6 }]], 2) }));
    g.restore(); }
  else if (t < c3) { // POV: the rock appears
    const u = t - c2, z = 10 + u * 22; g.save(); const zz = lerp(1, 1.25, ease.in(clamp(u / (c3 - c2)))); cam(g, zz, W / 2, H * 0.47); const P = roadPOV(g, W, H, z + t * 0);
    const d = Math.max(3.5, 40 - u * 26), [x, y] = P(-0.4, d); flatRock(g, x, y, 5 / d); g.restore(); speedLines(g, W, H, 0.5 * prog(t, c2 + 0.3, c3)); }
  else { // impact reaction close-up
    const u = t - c3; impactBg(g, W, H); g.save(); const [sx, sy] = shk(t, c3, 10, 0.6); cam(g, lerp(1.0, 1.1, u / 0.62), W / 2 + sx, H * 0.5 + sy); drawChar(g, W / 2, H * 0.86, 2.2, CAST.dad, keys(t, [[0, { expr: 'horrified', legs: 'none', ...A('head') }]], 1)); g.restore(); word(g, 'ROCK!', W / 2, H * 0.1, prog(t, c3, c3 + 0.2), 170, '#ffffff'); }
  chip(g, 'PENNSYLVANIA · 1952', ease.out(prog(t, 0.2, 0.5)) * (1 - prog(t, c1 - 0.2, c1)));
} });

// ---------- f02 "He slams the brakes, yanks the wheel, and the car plunges nose first into a ditch."
registerShot('f02', { draw(g, t, info) {
  const br = atc(info, t, 'brakes', 0.82), ya = atc(info, t, 'yanks', 1.4), di = atc(info, t, 'ditch', info.dur - 0.5);
  if (t < br) { const [sx, sy] = shk(t, 0, 14, 1.0); g.save(); cam(g, 1.5, W / 2 + 40 + sx, H * 0.47 + sy); skyGrad(g, W * 2, H * 2, ['#4ab8f4', '#bfeaff']);
    carFront(g, W / 2, H * 0.64, 0.78, { color: '#3aa0d8', wheelX: 300, behind: roadBehind(t, -2) }, frontRiders(t, { dad: keys(t, [[0, { expr: 'horrified', ...A('wheel'), lean: 0.05 }]], 1), kid: keys(t, [[0, { expr: 'scared', ...A('face') }]], 3), mom: keys(t, [[0, { expr: 'scream', ...A('shock') }]], 2) })); g.restore(); return; }
  if (t < ya) { const u = (t - br) / (ya - br), st = ease.in(clamp(u * 2.5)); g.fillStyle = '#2a2e3a'; g.fillRect(0, 0, W, H); g.fillStyle = '#3a3e4c'; g.fillRect(0, H * 0.5, W, H); rrect(g, W * 0.36, H * 0.42 + st * 60, W * 0.28, 80, 14); g.fillStyle = '#5a5e6a'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
    g.save(); g.translate(W * 0.5, lerp(H * 0.02, H * 0.36, st)); rrect(g, -70, -900, 140, 900, 30); g.fillStyle = '#1e2a44'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); ell(g, 10, 20, 150, 70); g.fillStyle = '#ffffff'; g.fill(); g.stroke(); g.restore();
    burst(g, W * 0.5, H * 0.48, 230, '#ffd23a', 14, prog(t, br + 0.18, br + 0.25) * (1 - prog(t, ya - 0.12, ya))); word(g, 'SCREECH!', W / 2, H * 0.1, prog(t, br + 0.12, br + 0.28), 130); return; }
  // wide side view: skid off the road, nose-dive into a real ditch, rear wheels in the air
  const DX = 3300, tt = t - ya, ttot = di - ya, k = clamp(tt / ttot), roadY = H * 0.42, rh = 280, fgY = roadY + rh, ditchY = fgY + 110;
  const xw = lerp(2300, DX - 60, ease.out(k)), camX = lerp(2300 - W / 2 + 120, DX - W / 2, ease.inOut(clamp(tt / (ttot + 0.4))));
  const sw = ease.inOut(clamp((tt - 0.15) / (ttot * 0.75))), dp = ease.in(prog(t, di - 0.32, di)), bo = t > di ? Math.sin((t - di) * 16) * Math.exp(-(t - di) * 5) : 0;
  const [sx, sy] = shk(t, di, 28, 0.7); g.save(); cam(g, 1.5, lerp(W / 2 - 60, W / 2 + 40, k) + sx, H * 0.5 + 40 + sy);
  roadSide(g, W, H, camX, { roadY, roadH: rh }); const dsx = DX - camX; ditchBack(g, dsx, ditchY);
  g.save(); g.strokeStyle = 'rgba(30,30,40,.6)'; g.lineWidth = 18; g.lineCap = 'round'; g.beginPath(); for (const off of [-170, 180]) { g.moveTo(2300 - camX + off, roadY + 190); g.quadraticCurveTo(lerp(2300, xw, 0.6) - camX + off, roadY + 200, xw - camX + off * Math.cos(0.3 * sw), lerp(roadY + 200, ditchY + 40, sw) + off * 0.15 * sw); } g.stroke(); g.restore();
  const cy = lerp(roadY + 200, ditchY + 30, sw) + dp * 170 + bo * 12, tilt = 0.08 * Math.sin(Math.PI * sw) * (1 - dp) + dp * 0.55 + bo * 0.04;
  dust(g, xw - camX - 260, cy - 20, (t - ya) / 1.1, 0.9, '#d8d4cc', 3);
  carSide(g, xw - camX, cy, 1.05, { color: '#3aa0d8', tilt, spin: t < di ? xw / 60 : xw / 60 + (t - di) * 25, shadow: dp < 0.2, riders: sideRiders(t, { dad: [[0, { expr: 'determined', ...A('wheel'), lean: -0.15 }], [di - 0.2, { expr: 'scream', ...A('shock') }]], kid: [[0, { expr: 'scared', ...A('face') }]], mom: [[0, { expr: 'scream', ...A('shock') }]] }) });
  ditchFront(g, dsx, ditchY); dirtChunks(g, dsx + 40, ditchY + 60, (t - di) / 1.0, 1.1); dust(g, dsx + 260, ditchY - 10, (t - di) / 1.4, 1.1, '#d8c8a8', 7);
  if (t > di + 0.5) { g.save(); g.globalAlpha = 0.6; for (let i = 0; i < 4; i++) { const u = ((t - di - 0.5) * 0.8 + i * 0.25) % 1; ell(g, dsx + 240 + u * 40, ditchY - 80 - u * 260, 30 + u * 40, 26 + u * 34); g.fillStyle = `rgba(255,255,255,${0.8 * (1 - u)})`; g.fill(); } g.restore(); }
  g.restore(); burst(g, W * 0.62, H * 0.1, 150, '#ffd23a', 12, prog(t, di, di + 0.05) * (1 - prog(t, di + 0.25, di + 0.45))); word(g, 'CRUNCH!', W / 2, H * 0.1, prog(t, di + 0.02, di + 0.2), 140, '#ffffff'); if (t > di && t < di + 0.07) veil(g, '#ffffff', 0.55);
} });

// ---------- f03 "Without thinking, he throws his arm across his little girl. So does his wife."
registerShot('f03', { draw(g, t, info) {
  const th = atc(info, t, 'throws', 1.08), wf = atc(info, t, 'wife', 3.36), jolt = Math.exp(-t * 2.5) * Math.sin(t * 20) * 14, pan = ease.inOut(prog(t, wf - 0.5, wf + 0.05));
  const dad = keys(t, [[0, { expr: 'shocked', ...A('wheel') }], [th - 0.12, { expr: 'shocked', armL: [0.4, -0.6] }, 0.12], [th, { expr: 'determined', armL: [1.62, -0.05], lean: -0.04, look: -1 }, 0.18]], 1);
  const mom = keys(t, [[0, { expr: 'scared', ...A('face') }], [wf - 0.1, { expr: 'determined', armR: [1.62, -0.05], armL: [0.12, 0.15], lean: 0.04, look: 1 }, 0.18]], 2);
  const kid = keys(t, [[0, { expr: 'scream', ...A('face') }], [th + 0.4, { expr: 'scared', ...A('face'), lookY: -0.5 }], [wf + 0.3, { expr: 'crying', armL: [0.12, 0.15], armR: [0.12, 0.15] }]], 3);
  g.save(); const [sx, sy] = shk(t, 0, 10, 1.2); cam(g, 1.7, lerp(W / 2 + 140, W / 2 - 140, pan) + sx, H * 0.46 + sy, -0.03 + jolt * 0.001); skyGrad(g, W * 2, H * 2, ['#4ab8f4', '#bfeaff']);
  carFront(g, W / 2, H * 0.64, 0.82, { color: '#3aa0d8', wheelX: 300, behind: (gg) => { roadBehind(0, 0)(gg); } }, frontRiders(t, { dad, mom, kid, jd: jolt, jm: jolt * 0.8, jk: jolt * 1.2, dadX: 290, momX: -290 }));
  // smear arcs on the throws
  for (const [t0, x0, d] of [[th, 290, -1], [wf - 0.1, -290, 1]]) { const a = prog(t, t0, t0 + 0.1) * (1 - prog(t, t0 + 0.15, t0 + 0.35)); if (a > 0) { g.save(); g.globalAlpha = a; g.translate(W / 2, H * 0.64); g.scale(0.82, 0.82); g.strokeStyle = '#ffffff'; g.lineCap = 'round'; for (let i = 0; i < 3; i++) { g.lineWidth = 16 - i * 4; g.beginPath(); g.arc(x0 + d * 30, -200, 160 + i * 34, d < 0 ? Math.PI * 0.95 : -0.35, d < 0 ? Math.PI * 1.35 : 0.05); g.stroke(); } g.restore(); } }
  g.restore();
  word(g, 'PROTECT!', W / 2, H * 0.08, prog(t, th + 0.1, th + 0.3) * (1 - prog(t, wf - 0.6, wf - 0.4)), 120, '#ffffff');
} });

// ---------- f04 "Everyone's okay. But that night he can't sleep. Because what if their arms hadn't been fast enough?"
registerShot('f04', { draw(g, t, info) {
  const ok = 1.0, wi = atc(info, t, 'what', 2.3), fa = atc(info, t, 'fast', info.dur - 0.6), night = t > ok - 0.15;
  if (!night) { // relief beside the ditched car
    g.save(); cam(g, 1.15, W / 2, H * 0.55); const r = roadSide(g, W, H, 400, { roadY: H * 0.44, roadH: 260, ditch: 900 }); carSide(g, 680, r.fgY + 120, 0.9, { color: '#3aa0d8', tilt: 0.32, shadow: false });
    drawChar(g, 260, H * 0.93, 0.95, CAST.dad, keys(t, [[0, { expr: 'relieved', ...A('lap') }]], 1)); drawChar(g, 380, H * 0.94, 0.75, CAST.kid, keys(t, [[0, { expr: 'happy', ...A('cheer') }]], 3)); drawChar(g, 520, H * 0.93, 0.92, CAST.mom, keys(t, [[0, { expr: 'relieved', ...A('lap') }]], 2)); g.restore(); return; }
  const k = ease.inOut(clamp((t - ok) / (info.dur - ok))); g.save(); cam(g, lerp(1.25, 1.7, k), lerp(W * 0.52, W * 0.56, k), lerp(H * 0.5, H * 0.52, k));
  // room
  g.fillStyle = '#1e2552'; g.fillRect(-200, -200, W + 400, H + 400); g.fillStyle = '#262e62'; for (let x = -200; x < W + 200; x += 90) g.fillRect(x, -200, 44, H * 0.72 + 200); g.fillStyle = '#3a2a3a'; g.fillRect(-200, H * 0.72, W + 400, H);
  // window + moon + beam
  const wx = W * 0.56, wy = H * 0.16; rrect(g, wx, wy, 380, 470, 10); g.fillStyle = '#141a48'; g.fill(); g.save(); g.clip(); const R = rng(3); g.fillStyle = '#fff'; for (let i = 0; i < 30; i++) g.fillRect(wx + R() * 380, wy + R() * 470, 3, 3); g.beginPath(); g.arc(wx + 250, wy + 130, 60, 0, TAU); g.arc(wx + 278, wy + 112, 56, 0, TAU, true); g.fillStyle = '#f4f0ff'; g.fill(); townSkyline(g, wx - 20, wy + 470, 420, 0.7, 9, ['#0e1236', '#121842', '#161c4a']); g.restore(); g.lineWidth = 14; g.strokeStyle = '#e8e4f4'; g.strokeRect(wx, wy, 380, 470); g.beginPath(); g.moveTo(wx + 190, wy); g.lineTo(wx + 190, wy + 470); g.moveTo(wx, wy + 235); g.lineTo(wx + 380, wy + 235); g.lineWidth = 8; g.stroke();
  for (const [x0, d] of [[wx - 60, 1], [wx + 440, -1]]) { g.fillStyle = '#5a4a9a'; g.beginPath(); g.moveTo(x0 - 40, wy - 30); g.lineTo(x0 + 40, wy - 30); g.quadraticCurveTo(x0 + 30 + d * 10 + Math.sin(t) * 6, wy + 300, x0 + 50, wy + 520); g.lineTo(x0 - 50, wy + 520); g.closePath(); g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); }
  g.save(); g.globalAlpha = 0.13; g.beginPath(); g.moveTo(wx, wy + 470); g.lineTo(wx + 380, wy + 470); g.lineTo(wx + 100, H * 0.95); g.lineTo(-100, H * 0.95); g.closePath(); g.fillStyle = '#bcd0ff'; g.fill(); g.restore();
  // bed: headboard left, wife lying, dad sitting up, blanket
  const by = H * 0.74; rrect(g, 30, by - 330, 70, 420, 20); g.fillStyle = '#6a4a3a'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
  rrect(g, 80, by - 60, 900, 120, 20); g.fillStyle = '#e8e4f0'; g.fill(); g.stroke(); rrect(g, 100, by - 120, 220, 80, 36); g.fillStyle = '#f4f2fa'; g.fill(); g.stroke();
  g.save(); g.translate(470, by - 60); g.rotate(-Math.PI / 2 + 0.04); drawChar(g, 0, 0, 0.8, CAST.mom, keys(t, [[0, { expr: 'sleep', legs: 'none', ...A('lap') }]], 2)); g.restore();
  drawChar(g, 610, by + 50, 1.15, CAST.dad, keys(t, [[0, { expr: 'tired', legs: 'none', ...A('lap'), top: 0 }], [wi, { expr: 'worried', armL: [0.12, 0.15], armR: [-0.2, -2.7], look: 0.7, lookY: -0.3 }, 0.5], [fa, { expr: 'nervous', ...A('head') }, 0.4]], 4));
  g.beginPath(); g.moveTo(80, by - 40); for (let x = 80; x <= 990; x += 30) g.lineTo(x, by - 70 - Math.sin(x * 0.02) * 14 - (x > 520 && x < 720 ? 30 : 0)); g.lineTo(990, by + 70); g.lineTo(80, by + 70); g.closePath(); g.fillStyle = '#5a6ac8'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); g.save(); g.clip(); g.fillStyle = '#4a5ab0'; for (let x = 120; x < 990; x += 120) g.fillRect(x, by - 120, 40, 200); g.restore();
  // nightstand + clock
  rrect(g, W * 0.86, by - 120, 180, 190, 10); g.fillStyle = '#6a4a3a'; g.fill(); g.stroke(); rrect(g, W * 0.875, by - 210, 150, 90, 14); g.fillStyle = '#20202a'; g.fill(); g.stroke();
  const mins = 47 + Math.floor(prog(t, ok + 0.2, wi) * 73), hh = 2 + Math.floor(mins / 60), mm = mins % 60; text(g, `${hh}:${String(mm).padStart(2, '0')}`, W * 0.875 + 75, by - 162, { size: 54, font: 'Nunito', weight: 900, color: '#ff3a2a', glow: 12, glowColor: 'rgba(255,40,30,.7)' });
  g.restore();
  // thought bubble with the replay
  const a = ease.outBack(prog(t, wi - 0.1, wi + 0.35)); if (a > 0) { const cx = W * 0.62, cy = H * 0.24; g.save(); g.translate(cx, cy); g.scale(a, a); g.fillStyle = '#ffffff'; g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); for (let i = 0; i < 10; i++) { const an = (i / 10) * TAU; g.moveTo(Math.cos(an) * 250 + 90, Math.sin(an) * 150); g.arc(Math.cos(an) * 250, Math.sin(an) * 150, 90, 0, TAU); } g.fill(); ell(g, 0, 0, 290, 180); g.fill();
    for (const [x, y, r] of [[-240, 220, 34], [-300, 300, 20]]) { ell(g, x, y, r, r); g.fill(); g.stroke(); }
    g.save(); ell(g, 0, 0, 280, 170); g.clip(); g.fillStyle = '#ffd8d8'; g.fillRect(-300, -200, 600, 400); const u = ((t - wi) % 1.5) / 1.5; g.fillStyle = '#9acb2a'; g.fillRect(-300, 70, 600, 200); carSide(g, -60 + u * 120, 80, 0.5, { color: '#c84a4a', tilt: 0.35 * ease.inOut(u), shadow: false, riders: (gg) => { drawChar(gg, -60, -40, 0.36, CAST.kid, { expr: 'scream', t, ...A('shock') }); } }); word(g, '?', 210, -60, 1, 120, '#e8302a', 0.1); g.restore(); g.restore(); }
} });

// ---------- f05 "He'd spent years in the Navy fixing torpedoes, and he remembers how they were driven by a blast of compressed air."
registerShot('f05', { draw(g, t, info) {
  const na = atc(info, t, 'navy', 1.0), bl = atc(info, t, 'blast', info.dur * 0.72), air = atc(info, t, 'air', info.dur - 0.5);
  g.fillStyle = '#1a4a8a'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; for (let x = 0; x < W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y < H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.save(); const k = ease.inOut(clamp(t / info.dur)); cam(g, lerp(1.15, 1.25, k), W * 0.45, H * 0.62);
  // deck
  g.fillStyle = '#5a6a7a'; g.fillRect(-100, H * 0.72, W + 200, H); g.fillStyle = '#4a5a6a'; for (let x = -100; x < W + 100; x += 140) g.fillRect(x, H * 0.72, 8, H);
  // torpedo on a cradle
  const fly = ease.in(prog(t, bl, bl + 1.1)), tx = W * 0.5 + fly * 1400, ty = H * 0.6;
  g.save(); g.translate(tx, ty); rrect(g, -330, -62, 560, 124, 62); g.fillStyle = '#8a98a8'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.fillStyle = '#6a7888'; g.fillRect(-150, -62, 20, 124); g.fillRect(60, -62, 20, 124); g.beginPath(); g.moveTo(230, -62); g.quadraticCurveTo(330, 0, 230, 62); g.closePath(); g.fillStyle = '#c8302a'; g.fill(); g.stroke();
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(-330, 0); g.lineTo(-410, s * 80); g.lineTo(-380, 0); g.closePath(); g.fillStyle = '#6a7888'; g.fill(); g.stroke(); }
  g.save(); g.globalAlpha = 0.5; rrect(g, -260, -36, 210, 72, 20); g.fillStyle = '#bfe8ff'; g.fill(); g.restore(); text(g, 'AIR', -155, 2, { size: 44, font: 'Nunito', weight: 900, color: '#1a4a8a' });
  if (t > bl - 0.05) { const R = rng(4); for (let i = 0; i < 12; i++) { const u = ((t - bl) * 2 + i / 12) % 1; ell(g, -420 - u * 500, (R() - 0.5) * 120, 30 + u * 60, 26 + u * 50); g.fillStyle = `rgba(255,255,255,${0.8 * (1 - u)})`; g.fill(); } }
  g.restore(); g.fillStyle = '#3a4a5a'; rrect(g, W * 0.3, ty + 60, 80, 120, 8); g.fill(); rrect(g, W * 0.6, ty + 60, 80, 120, 8); g.fill();
  drawChar(g, W * 0.24, H * 0.86, 1.45, CAST.navy, keys(t, [[0, { expr: 'happy', armL: [0.12, 0.15], armR: [2.2, 2.2] }], [na + 0.5, { expr: 'talk', ...A('point'), armR: [1.4, 0.2] }], [bl, { expr: 'surprised', ...A('shock'), lean: -0.06 }, 0.2], [air - 0.3, { expr: 'realization', armL: [0.12, 0.15], armR: [2.5, 0.5] }]], 1));
  g.restore(); chip(g, 'U.S. NAVY · 1940s', ease.out(prog(t, 0.2, 0.5)) * (1 - prog(t, 2.2, 2.5)), 170, '#bfe0ff'); card(g, 'COMPRESSED AIR', W / 2, H * 0.12, prog(t, bl + 0.1, bl + 0.4));
} });

// ---------- f06 "So he sketches a bag, folded inside the steering wheel, that bursts open the moment you crash."
registerShot('f06', { draw(g, t, info) {
  // dad at the top behind the desk, the big sheet below him in clear space; captions stay under the sheet
  const bu = atc(info, t, 'bursts', info.dur * 0.62), fo = atc(info, t, 'folded', info.dur * 0.25), st = atc(info, t, 'steering', info.dur * 0.4);
  g.fillStyle = '#2a2448'; g.fillRect(0, 0, W, H); g.save(); g.globalAlpha = 0.2; g.beginPath(); g.moveTo(W * 0.85, 0); g.lineTo(-100, H * 0.8); g.lineTo(W + 100, H * 0.8); g.closePath(); g.fillStyle = '#ffe8a0'; g.fill(); g.restore();
  drawChar(g, W * 0.5, H * 0.46, 1.15, CAST.dad, keys(t, [[0, { expr: 'determined', legs: 'none', armL: [0.2, -1.2], armR: [0.4, -0.6], lookY: 0.9 }], [bu, { expr: 'realization', armL: [0.12, 0.15], armR: [2.5, 0.5], lookY: 0 }, 0.25]], 1));
  g.fillStyle = '#7a4a2e'; g.fillRect(0, H * 0.33, W, H); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.moveTo(0, H * 0.33); g.lineTo(W, H * 0.33); g.stroke();
  const PX = W / 2, PY = H * 0.56; g.save(); g.translate(PX, PY); g.rotate(-0.02); rrect(g, -470, -360, 940, 700, 10); g.fillStyle = '#fbf6e6'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.strokeStyle = 'rgba(80,120,180,.22)'; g.lineWidth = 2; for (let y = -300; y < 340; y += 44) { g.beginPath(); g.moveTo(-450, y); g.lineTo(450, y); g.stroke(); }
  g.font = '900 56px Nunito'; g.textAlign = 'center'; g.fillStyle = '#2a2a3a'; g.globalAlpha = clamp(t / 0.6); g.fillText('SAFETY CUSHION', 0, -290); g.globalAlpha = 1;
  // 1) wheel rim + spokes, 2) folded bag in the hub, 3) the burst
  const cx = 0, cy = 10, d1 = prog(t, 0.2, Math.max(0.8, fo - 0.2)), d2 = prog(t, fo - 0.2, fo + 0.4); g.strokeStyle = '#2a2a3a'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, 200, -Math.PI / 2, -Math.PI / 2 + TAU * d1); g.stroke();
  for (const a of [Math.PI / 2, Math.PI * 1.15, -Math.PI * 0.15]) { g.beginPath(); g.moveTo(cx + Math.cos(a) * 70, cy + Math.sin(a) * 70); g.lineTo(cx + Math.cos(a) * 70 + Math.cos(a) * 130 * d1, cy + Math.sin(a) * 70 + Math.sin(a) * 130 * d1); g.stroke(); }
  g.beginPath(); g.arc(cx, cy, 70 * d1, 0, TAU); g.stroke();
  if (d2 > 0) { g.strokeStyle = '#d8302a'; g.lineWidth = 6; g.beginPath(); const n = Math.floor(8 * d2); for (let i = 0; i <= n; i++) { const x = cx - 45 + i * 11.25; g.lineTo(x, cy + (i % 2 ? -18 : 18)); } g.stroke(); text(g, 'folded bag', cx + 240, cy - 120, { size: 34, font: 'Nunito', weight: 800, color: '#d8302a', alpha: d2 }); g.beginPath(); g.moveTo(cx + 170, cy - 105); g.lineTo(cx + 55, cy - 20); g.stroke(); }
  const b = ease.outBack(prog(t, bu - 0.1, bu + 0.35)); if (b > 0) { g.setLineDash([18, 12]); g.strokeStyle = '#d8302a'; g.lineWidth = 9; g.beginPath(); g.ellipse(cx, cy - 20 * b, 330 * b, 260 * b, 0, 0, TAU); g.stroke(); g.setLineDash([]); for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; seg(g, [[cx + Math.cos(a) * 345 * b, cy - 20 + Math.sin(a) * 275 * b], [cx + Math.cos(a) * 400 * b, cy - 20 + Math.sin(a) * 315 * b]], 7, '#d8302a'); } text(g, 'CRASH → BURSTS OPEN', 0, 300, { size: 44, font: 'Nunito', weight: 900, color: '#d8302a', alpha: prog(t, bu + 0.2, bu + 0.5) }); }
  // pencil follows whatever is being drawn
  const pa = d1 < 1 ? [cx + Math.cos(-Math.PI / 2 + TAU * d1) * 200, cy + Math.sin(-Math.PI / 2 + TAU * d1) * 200] : d2 < 1 ? [cx - 45 + d2 * 90, cy + (Math.floor(d2 * 8) % 2 ? -18 : 18)] : [cx + 330 * Math.cos(t * 3), cy + 250 * Math.sin(t * 3)];
  if (t < bu + 0.2) { g.save(); g.translate(pa[0], pa[1]); g.rotate(0.7); g.fillStyle = '#ffd23a'; g.fillRect(0, -16, 250, 32); g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(0, -16, 250, 32); g.fillStyle = '#f2d2b0'; g.beginPath(); g.moveTo(0, -16); g.lineTo(-44, 0); g.lineTo(0, 16); g.closePath(); g.fill(); g.stroke(); ell(g, 250, 0, 26, 26); g.fillStyle = '#ffffff'; g.fill(); g.stroke(); g.restore(); }
  g.restore();
} });

// ---------- f08 "...and takes it to every carmaker in America. They laugh him out of the room."
// every carmaker: three different offices (fictional companies), he pitches in each; at "laugh" all three panels crack up,
// then the door slams with him outside
const OFFICES = [{ name: 'DETROIT MOTOR CO.', wall: '#e8d8b8', wall2: '#d8c8a4', desk: '#7a4a2e', ex: ['exec1', 'exec2'] }, { name: 'STARLINE AUTOS', wall: '#c8dce8', wall2: '#b4cad8', desk: '#4a4a5a', ex: ['exec3', 'exec1'] }, { name: 'BIG RIVER MOTORS', wall: '#e8c8c0', wall2: '#d8b4ac', desk: '#5a3a2e', ex: ['exec2', 'exec3'] }];
function office(g, o, t, laughAt, seed, showDad, dadPose, x0, y0, w, h, close = 1) {
  g.save(); rrect(g, x0, y0, w, h, 18); g.clip(); g.fillStyle = o.wall; g.fillRect(x0, y0, w, h); g.fillStyle = o.wall2; for (let x = x0; x < x0 + w; x += 70) g.fillRect(x, y0, 34, h * 0.7); g.fillStyle = shade(o.wall, -0.35); g.fillRect(x0, y0 + h * 0.7, w, h);
  rrect(g, x0 + w * 0.55, y0 + h * 0.08, w * 0.38, h * 0.32, 8); g.fillStyle = '#8ad0ff'; g.fill(); g.save(); g.clip(); townSkyline(g, x0 + w * 0.55, y0 + h * 0.4, w * 0.4, 0.5, seed); g.restore(); g.lineWidth = 8; g.strokeStyle = shade(o.desk, -0.2); g.strokeRect(x0 + w * 0.55, y0 + h * 0.08, w * 0.38, h * 0.32);
  text(g, o.name, x0 + w * 0.28, y0 + h * 0.13, { size: Math.min(44, w * 0.05), font: 'Nunito', weight: 900, color: shade(o.desk, -0.1), spacing: 3 });
  const s = h / 1500 * close; o.ex.forEach((n, i) => { const lt = laughAt + i * 0.1, bob = t > lt ? -Math.abs(Math.sin((t - lt) * 12 + i + seed)) * 0.12 : 0; drawChar(g, x0 + w * (close > 1 ? 0.3 + i * 0.42 : 0.6 + i * 0.22), y0 + h * (close > 1 ? 1.32 : 0.98), s * 1.25, CAST[n], keys(t, [[0, { expr: i ? 'suspicious' : 'neutral', ...A('lap'), look: -0.9 }], [lt, { expr: 'laughing', ...(i ? { armL: [0.05, -1.6], armR: [-0.2, -2.7] } : A('belly')), lean: Math.sin(t * 10 + i) * 0.05, bob }, 0.2]], seed + i)); });
  if (close <= 1) { rrect(g, x0 + w * 0.42, y0 + h * 0.74, w * 0.62, h * 0.1, 8); g.fillStyle = o.desk; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); }
  if (showDad) drawChar(g, x0 + w * 0.22, y0 + h * 0.98, s * 1.3, { ...CAST.dad, coat: true, top: '#4a5a7a', tie: '#c8302a' }, dadPose);
  g.restore(); rrect(g, x0, y0, w, h, 18); g.lineWidth = 10; g.strokeStyle = INK; g.stroke();
}
registerShot('f08', { draw(g, t, info) {
  const la = atc(info, t, 'laugh', info.dur * 0.55), ro = atc(info, t, 'room', info.dur - 0.35), every = atc(info, t, 'every', 0.4);
  g.fillStyle = '#1e2240'; g.fillRect(0, 0, W, H);
  const pitch = (i) => keys(t, [[0, { expr: 'talk', armL: [1.5, -0.4], armR: [0.12, 0.15], look: 1 }], [la, { expr: 'surprised', ...A('rest'), look: 1 }, 0.25], [la + 0.6, { expr: 'disappointed', ...A('rest'), lookY: 0.6, tilt: 0.1 }, 0.4]], 1 + i);
  if (t < la - 0.05) { // quick cuts: one office after another while he pitches
    const n = Math.min(2, Math.floor(clamp((t - every) / Math.max(0.3, (la - every) / 3)) * 3)), i = Math.max(0, n); const u = t - every - i * (la - every) / 3;
    g.save(); const z = 1 + 0.04 * u; g.translate(W / 2, H * 0.47); g.scale(z, z); g.translate(-W / 2, -H * 0.47); office(g, OFFICES[i], t, 99, 5 + i * 3, true, pitch(i), 40, 260, W - 80, 1180); g.restore();
    chip(g, `CARMAKER #${i + 1}`, 1, 170, '#ffd23a');
  } else { // all three offices laugh at once, stacked panels
    const k = ease.outBack(prog(t, la - 0.05, la + 0.3)); for (let i = 0; i < 3; i++) { const y = 150 + i * 440; g.save(); g.translate(W / 2, y + 200); g.scale(k, k); g.translate(-W / 2, -(y + 200)); office(g, OFFICES[i], t, la + i * 0.08, 5 + i * 3, false, pitch(i), 40, y, W - 80, 410, 2.6); g.restore(); }
    word(g, 'HA HA HA!', W / 2, 90, prog(t, la + 0.1, la + 0.25), 90, '#ffd23a', -0.04);
    const sl = ease.in(prog(t, ro - 0.1, ro + 0.15)); if (sl > 0) { g.fillStyle = '#6a4a2e'; g.fillRect(0, 0, W * sl * 0.5, 1460); g.fillRect(W - W * sl * 0.5, 0, W * sl * 0.5, 1460); g.lineWidth = 10; g.strokeStyle = INK; g.strokeRect(-10, -10, W * sl * 0.5 + 10, 1470); g.strokeRect(W - W * sl * 0.5, -10, W * sl * 0.5 + 10, 1470); if (sl >= 1) { drawChar(g, W / 2, 1440, 1.25, { ...CAST.dad, coat: true, top: '#4a5a7a', tie: '#c8302a' }, keys(t, [[0, { expr: 'shocked', ...A('rest') }], [ro + 0.35, { expr: 'disappointed', ...A('rest'), lookY: 0.5, tilt: 0.12 }, 0.4]], 1)); burst(g, W / 2, H * 0.12, 120, '#ffd23a', 12, 1 - prog(t, ro + 0.15, ro + 0.4)); word(g, 'SLAM!', W / 2, H * 0.12, 1, 120, '#ffffff', 0.1); } }
  }
} });

// ---------- f10 "And nobody can build a sensor that knows a crash from a pothole."
registerShot('f10', { draw(g, t, info) {
  const ph = atc(info, t, 'pothole', 2.62), hit = Math.sin(Math.PI * clamp((t - ph + 0.05) / 0.22)) * (t > ph - 0.05 && t < ph + 0.17 ? 1 : 0), bk = ease.outBack(prog(t, ph, ph + 0.15));
  g.save(); const [sx, sy] = shk(t, ph, 16, 0.4); cam(g, lerp(1.7, 1.9, ease.inOut(prog(t, ph, info.dur))), W / 2 + 180 + sx, H * 0.45 + sy - hit * 40); skyGrad(g, W * 2, H * 2, ['#4ab8f4', '#bfeaff']);
  carFront(g, W / 2, H * 0.64, 0.8, { color: '#c84a3a', wheelX: 300, behind: roadBehind(t, -2) }, (gg) => {
    drawChar(gg, 300, 110 - hit * 40, 1.35, CAST.dad, keys(t, [[0, { expr: 'happy', ...A('wheel'), legs: 'none' }], [ph + 0.05, { expr: 'shocked', ...A('shock'), legs: 'none', lean: 0.1 }, 0.12]], 1));
    if (bk > 0) { gg.save(); gg.translate(300, -130); gg.scale(bk, bk); gg.fillStyle = '#ffffff'; gg.lineWidth = 9; gg.strokeStyle = INK; gg.beginPath(); for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; gg.moveTo(Math.cos(a) * 200 + 70, Math.sin(a) * 170); gg.arc(Math.cos(a) * 200, Math.sin(a) * 170, 70, 0, TAU); } gg.fill(); ell(gg, 0, 0, 230, 200); gg.fill(); gg.strokeStyle = '#c8ccd8'; gg.lineWidth = 6; for (let i = 0; i < 4; i++) { gg.beginPath(); gg.arc(-40 + i * 30, 10, 80 + i * 20, 0.4, 1.4); gg.stroke(); } gg.restore(); } });
  g.restore(); word(g, 'POOF!', W * 0.7, H * 0.08, prog(t, ph + 0.05, ph + 0.2), 140, '#ffffff', 0.1); word(g, 'POTHOLE?!', W / 2, H * 0.16, prog(t, ph + 0.2, ph + 0.4), 120);
} });

// ---------- f11 Allen Breed: ball, tube, magnet, wall, circuit (the scientist acts it out with a toy car)
registerShot('f11', { draw(g, t, info) {
  const dr = atc(info, t, 'drops', 1.98), mg = atc(info, t, 'magnet', 5.36), hw = atc(info, t, 'wall', 6.16), fl = atc(info, t, 'flies', 7.22), cl = atc(info, t, 'circuit', 8.76);
  // world: lab wall with pegboard + bench. toy car with the sensor on top rides along the bench toward a brick wall
  const push = ease.in(prog(t, mg + 0.25, hw)), carX = lerp(560, 1180, push), focus = ease.inOut(prog(t, dr - 0.6, dr)), fol = ease.inOut(prog(t, mg + 0.2, hw)), back = ease.inOut(prog(t, cl + 0.15, cl + 0.8));
  const cx = lerp(lerp(lerp(W * 0.42, 400, focus), carX - 120, fol), carX - 150, back), cy = lerp(lerp(H * 0.6, H * 0.52, focus), H * 0.55, fol), z = lerp(lerp(lerp(1.3, 1.6, focus), 1.4, fol), 1.25, back);
  const [sx, sy] = shk(t, hw, 18, 0.5); g.save(); cam(g, z, cx + sx, cy + sy);
  g.fillStyle = '#d8e4ec'; g.fillRect(-600, -400, W + 1400, H + 800); g.fillStyle = '#c8b090'; rrect(g, -100, H * 0.12, 700, 420, 10); g.fill(); g.fillStyle = '#a8906e'; for (let x = -70; x < 590; x += 40) for (let y = H * 0.12 + 30; y < H * 0.12 + 410; y += 40) { ell(g, x, y, 5, 5); g.fill(); }
  g.lineWidth = 10; g.strokeStyle = '#6a6a7a'; g.beginPath(); g.moveTo(40, H * 0.18); g.lineTo(40, H * 0.32); g.moveTo(120, H * 0.18); g.lineTo(170, H * 0.3); g.stroke(); circle(g, 300, H * 0.22, 40, '#e8b030');
  rrect(g, 700, H * 0.1, 360, 260, 8); g.fillStyle = '#1a4a8a'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); text(g, 'SENSOR v1', 880, H * 0.1 + 60, { size: 34, font: 'Nunito', weight: 900, color: '#ffffff' });
  // Allen Breed
  const bp = keys(t, [[0, { expr: 'happy', armL: [0.12, 0.15], armR: [2.5, 0.5] }], [0.9, { expr: 'talk', ...A('open') }], [dr - 0.6, { expr: 'curious', armR: [1.2, -1.0], armL: [0.12, 0.15], look: 1, lookY: 0.4 }, 0.4], [dr + 0.1, { expr: 'smug', armR: [0.9, -0.4] }, 0.3], [mg - 0.2, { expr: 'determined', armL: [0.12, 0.15], armR: [1.45, -0.2], look: 1 }, 0.4], [hw - 0.3, { expr: 'determined', armR: [1.58, 0.0], lean: 0.12 }, 0.25], [hw + 0.05, { expr: 'surprised', ...A('shock'), lean: 0 }, 0.2], [fl, { expr: 'curious', armL: [0.12, 0.15], armR: [-0.3, -2.5], look: 1 }, 0.3], [cl, { expr: 'laughing', ...A('cheer') }, 0.25]], 9);
  const bx = carX - 300; drawChar(g, bx, H * 0.66 + 80, 1.35, CAST.breed, { ...bp, legs: 'none' });
  const benchY = H * 0.66; g.fillStyle = '#8a5a3a'; g.fillRect(-600, benchY, W + 1400, 60); g.fillStyle = '#6a4a2e'; g.fillRect(-600, benchY + 60, W + 1400, H); g.lineWidth = 7; g.strokeStyle = INK; g.beginPath(); g.moveTo(-600, benchY); g.lineTo(W + 800, benchY); g.stroke();
  // brick wall at the bench end
  const wx = 1330; g.fillStyle = '#c8603a'; g.fillRect(wx, benchY - 420, 220, 420); g.strokeStyle = '#8a3a22'; g.lineWidth = 5; for (let r = 0; r < 10; r++) for (let c2 = 0; c2 < 3; c2++) g.strokeRect(wx + c2 * 80 - (r % 2) * 40, benchY - 420 + r * 42, 80, 42); g.lineWidth = 7; g.strokeStyle = INK; g.strokeRect(wx, benchY - 420, 220, 420);
  // toy car + sensor rig
  const rec = t > hw ? Math.sin((t - hw) * 30) * Math.exp(-(t - hw) * 8) * 14 : 0; g.save(); g.translate(carX - rec, benchY - 52); rrect(g, -150, -60, 300, 90, 30); g.fillStyle = '#e8b030'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); for (const xx of [-90, 90]) wheel(g, xx, 30, 32, -carX / 32, 6);
  // tube on top
  const ty = -120; rrect(g, -140, ty - 34, 280, 68, 34); g.fillStyle = 'rgba(190,232,255,.55)'; g.fill(); g.stroke(); g.save(); g.globalAlpha = 0.7; g.strokeStyle = '#ffffff'; g.lineWidth = 6; g.beginPath(); g.moveTo(-110, ty - 20); g.lineTo(100, ty - 20); g.stroke(); g.restore();
  rrect(g, -190, ty - 46, 50, 92, 10); g.fillStyle = '#d8302a'; g.fill(); g.stroke(); g.fillStyle = '#e8eef4'; g.fillRect(-150, ty - 46, 10, 92); text(g, 'N', -165, ty + 2, { size: 30, font: 'Nunito', weight: 900, color: '#fff' });
  const on = t > cl - 0.05; for (const yy of [ty - 18, ty + 18]) { g.fillStyle = on ? '#ffe14a' : '#d8a830'; g.fillRect(132, yy - 6, 40, 12); } g.strokeStyle = on ? '#ff3a2a' : '#6a2a2a'; g.lineWidth = 6; g.beginPath(); g.moveTo(172, ty - 18); g.quadraticCurveTo(230, ty - 80, 160, ty - 150); g.stroke(); ell(g, 150, ty - 175, 30, 34); g.fillStyle = on ? '#ffe14a' : '#f4f4f0'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); if (on) burst(g, 150, ty - 175, 80, 'rgba(255,225,74,.5)', 12, 1);
  // ball: held in Breed's fingers, dropped in, snaps to magnet, flies to the contacts on impact
  const ballX = t < dr ? -40 : t < mg ? lerp(-40, -112, ease.out(prog(t, dr + 0.3, mg))) : t < fl - 0.9 + (hw - fl + 0.9) ? lerp(-112, 104, ease.in(prog(t, hw, hw + 0.25))) : 104, ballY = t < dr ? ty - 150 : t < dr + 0.3 ? lerp(ty - 150, ty, ease.in(prog(t, dr, dr + 0.3))) : ty;
  const bX = t >= hw ? lerp(-112, 104, ease.in(prog(t, hw, hw + 0.2))) : ballX; ell(g, bX, ballY, 26, 26); g.fillStyle = '#c8ccd8'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); ell(g, bX - 8, ballY - 8, 8, 8); g.fillStyle = '#fff'; g.fill();
  if (t > cl - 0.05 && t < cl + 1.2) { const k = ease.outBack(prog(t, cl, cl + 0.25)); ell(g, 0, -60 - 100 * k, 120 * k, 90 * k); g.fillStyle = '#ffffff'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); }
  g.restore();
  g.restore();
  chip(g, 'ALLEN BREED · 1968', ease.out(prog(t, 0.3, 0.6)) * (1 - prog(t, 2.6, 3.0))); card(g, 'MAGNET holds the ball', W / 2, H * 0.17, prog(t, mg, mg + 0.25) * (1 - prog(t, hw - 0.2, hw)));
  word(g, 'BAM!', W * 0.72, H * 0.08, prog(t, hw, hw + 0.15) * (1 - prog(t, hw + 0.8, hw + 1.0)), 150, '#ffffff', 0.12); card(g, 'CIRCUIT CLOSED → FIRE!', W / 2, H * 0.17, prog(t, cl, cl + 0.2));
} });

// ---------- f12 cutaway: pellet -> burns -> nitrogen -> bag fills in 30 ms, faster than a blink
// HOW IT WORKS — side cutaway, numbered steps: 1 sensor spark → 2 pellets burn → 3 nitrogen gas → 4 bag fills (30 ms) → faster than a blink
registerShot('f12', { draw(g, t, info) {
  const pe = atc(info, t, 'pellet', 0.98), bu = atc(info, t, 'burns', 1.38), ni = atc(info, t, 'nitrogen', 2.32), fi = atc(info, t, 'fills', 3.34), th = atc(info, t, 'thirty', 3.94), bl = atc(info, t, 'blink', info.dur - 0.6);
  const step = t < pe - 0.05 ? 1 : t < ni - 0.1 ? 2 : t < fi - 0.1 ? 3 : t < bl - 0.4 ? 4 : 5;
  g.fillStyle = '#eef4fa'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(80,120,180,.12)'; g.lineWidth = 2; for (let x = 0; x < W; x += 54) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y < H; y += 54) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  // step header (top band, never over the drawing)
  const STEPS = ['', 'CRASH! SENSOR SENDS A SPARK', 'SPARK LIGHTS THE PELLETS', 'PELLETS BURN INTO NITROGEN GAS', 'GAS FILLS THE BAG IN 0.03 s', 'FASTER THAN A BLINK (0.3 s)'];
  for (let i = 1; i <= 5; i++) { const x = W / 2 + (i - 3) * 120, on = i <= step; ell(g, x, 110, 42, 42); g.fillStyle = on ? (i === step ? '#e8302a' : '#2a6ad0') : '#c8d0dc'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); text(g, String(i), x, 112, { size: 44, font: 'Nunito', weight: 900, color: '#fff' }); if (i < 5) { g.beginPath(); g.moveTo(x + 46, 110); g.lineTo(x + 74, 110); g.lineWidth = 6; g.strokeStyle = on ? '#2a6ad0' : '#c8d0dc'; g.stroke(); } }
  const hk = ease.outBack(prog(t, [0, 0, pe, ni, fi, bl - 0.4][step] - 0.05, [0, 0.3, pe + 0.25, ni + 0.25, fi + 0.25, bl - 0.15][step])); g.save(); g.translate(W / 2, 220); g.scale(hk, hk); g.font = '900 50px Nunito'; const tw = g.measureText(STEPS[step]).width + 60; rrect(g, -tw / 2, -40, tw, 80, 40); g.fillStyle = INK; g.fill(); g.restore(); text(g, STEPS[step], W / 2, 222, { size: 50, font: 'Nunito', weight: 900, color: '#ffd23a', alpha: hk });
  // the drawing: steering column from bottom-left, wheel seen side-on, hub module cut open, driver's head at right
  const zin = ease.inOut(prog(t, 0, pe)), zout = ease.inOut(prog(t, fi - 0.2, fi + 0.5)); g.save(); const z = lerp(lerp(1.15, 1.75, zin), 1.12, zout), fx = lerp(lerp(W * 0.48, W * 0.42, zin), W * 0.56, zout); cam(g, z, fx, lerp(H * 0.52, H * 0.5, zin));
  const HX = W * 0.36, HY = H * 0.52;
  g.save(); g.translate(HX, HY); g.rotate(0.45); rrect(g, -60, 40, 120, 700, 30); g.fillStyle = '#3a3a48'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.restore();
  rrect(g, HX - 40, HY - 330, 60, 660, 30); g.fillStyle = '#2a2a34'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); // wheel rim, side view
  // hub module (cut open): housing, igniter, canister with pellets + filter holes, folded bag, cover
  rrect(g, HX - 10, HY - 150, 230, 300, 24); g.fillStyle = '#5a5a6a'; g.fill(); g.stroke(); rrect(g, HX + 10, HY - 130, 190, 260, 18); g.fillStyle = '#d8dee8'; g.fill();
  const can = { x: HX + 20, y: HY - 110, w: 90, h: 220 }; rrect(g, can.x, can.y, can.w, can.h, 14); g.fillStyle = '#9aa4b4'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
  for (let i = 0; i < 6; i++) { ell(g, can.x + can.w, can.y + 25 + i * 34, 7, 7); g.fillStyle = INK; g.fill(); }
  const glow = clamp((t - bu + 0.05) / 0.2) * (1 - clamp((t - fi - 0.2) / 0.5)), R = rng(5);
  for (let i = 0; i < 12; i++) { const px = can.x + 22 + (i % 2) * 40, py = can.y + 22 + Math.floor(i / 2) * 32; rrect(g, px - 16, py - 10, 32, 20, 8); g.fillStyle = glow > 0 ? (R() < 0.5 ? '#ff8a2a' : '#ffd23a') : '#e8d890'; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke(); }
  if (glow > 0) { g.save(); g.globalAlpha = 0.45 * glow; ell(g, can.x + can.w / 2, can.y + can.h / 2, 80, 130); g.fillStyle = '#ff9a2a'; g.fill(); g.restore(); for (let i = 0; i < 6; i++) { const fy = can.y + 30 + i * 32, fl = 10 + 8 * Math.sin(t * 40 + i); g.beginPath(); g.moveTo(can.x + 10, fy); g.quadraticCurveTo(can.x + 4, fy - fl, can.x + 14, fy - fl * 1.6); g.lineWidth = 4; g.strokeStyle = '#ff5a1a'; g.stroke(); } }
  rrect(g, HX - 26, HY - 22, 40, 44, 8); g.fillStyle = '#d8302a'; g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke(); // igniter
  // wire from the crash sensor (bottom-left) to the igniter, spark pulse on step 1
  const sxp = HX - 300, syp = HY + 360; rrect(g, sxp - 80, syp - 26, 160, 52, 26); g.fillStyle = 'rgba(190,232,255,.8)'; g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke(); ell(g, sxp + 50, syp, 18, 18); g.fillStyle = '#c8ccd8'; g.fill(); g.stroke(); text(g, 'SENSOR', sxp, syp + 62, { size: 30, font: 'Nunito', weight: 900, color: '#2a3a5a' });
  g.beginPath(); g.moveTo(sxp + 80, syp); g.quadraticCurveTo(HX - 140, HY + 220, HX - 26, HY); g.lineWidth = 7; g.strokeStyle = t > 0.3 ? '#ff3a2a' : '#6a2a2a'; g.stroke();
  if (t > 0.3 && t < pe + 0.2) { const u = clamp((t - 0.3) / 0.5); const px = lerp(sxp + 80, HX - 26, u), py = lerp(syp, HY, u) - Math.sin(u * Math.PI) * 80; burst(g, px, py, 34, '#ffe14a', 8, 1); }
  // folded bag + cover; then the bag balloons toward the driver
  const k = clamp(prog(t, fi - 0.05, th + 0.5)), open = ease.out(prog(t, fi - 0.1, fi + 0.08));
  if (k < 0.05) { g.strokeStyle = '#f4f2ee'; g.lineWidth = 10; g.beginPath(); for (let i = 0; i < 9; i++) g.lineTo(HX + 140 + (i % 2) * 40, HY - 110 + i * 27); g.stroke(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(); }
  g.save(); g.translate(HX + 220, HY - 150); g.rotate(-1.4 * open); rrect(g, -12, 0, 24, 150, 8); g.fillStyle = '#4a4a5a'; g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke(); g.restore(); g.save(); g.translate(HX + 220, HY + 150); g.rotate(1.4 * open); rrect(g, -12, -150, 24, 150, 8); g.fillStyle = '#4a4a5a'; g.fill(); g.stroke(); g.restore();
  // nitrogen gas: blue puffs out of the filter holes, into the bag (arrows show the flow)
  if (t > ni - 0.25 && k < 1) { const R2 = rng(9); for (let i = 0; i < 26; i++) { const u = ((t - ni + 0.25) * 1.4 + R2()) % 1, yy = can.y + 25 + (i % 6) * 34; const px = can.x + can.w + u * lerp(90, 420, k), py = yy + (R2() - 0.5) * u * lerp(40, 360, k); g.save(); g.globalAlpha = 0.85 * Math.sin(Math.PI * u); ell(g, px, py, 14 + u * 22, 12 + u * 18); g.fillStyle = i % 3 ? '#9ad4ff' : '#ffffff'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#3a8ad8'; g.stroke(); g.restore(); }
    for (let i = 0; i < 3; i++) { const yy = HY - 60 + i * 60, ax = HX + 130 + ((t * 300) % 80); seg(g, [[ax, yy], [ax + 60, yy]], 8, '#2a6ad0'); g.beginPath(); g.moveTo(ax + 78, yy); g.lineTo(ax + 56, yy - 16); g.lineTo(ax + 56, yy + 16); g.closePath(); g.fillStyle = '#2a6ad0'; g.fill(); } }
  if (k > 0) { const s = ease.outBack(k); g.save(); g.translate(HX + 230, HY); g.scale(s, s); g.beginPath(); g.moveTo(0, -150); g.bezierCurveTo(260, -330, 520, -200, 520, 0); g.bezierCurveTo(520, 200, 260, 330, 0, 150); g.closePath(); g.fillStyle = '#ffffff'; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke(); g.strokeStyle = '#c8d0dc'; g.lineWidth = 6; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(150 + i * 70, 0, 160 - i * 25, -0.6, 0.6); g.stroke(); } g.restore(); }
  // the driver: cartoon head + torso moving forward, stopped softly by the bag
  const lean = ease.inOut(prog(t, fi, th + 0.6)) * (k > 0.6 ? 0.6 : 1); g.save(); g.translate(lerp(W * 0.9, W * 0.82, lean), H * 0.6); drawChar(g, 0, 380, 0.95, CAST.dad, { expr: k > 0.3 ? 'relieved' : step >= 2 ? 'shocked' : 'scared', legs: 'none', t, ...A('shock') }); g.restore();
  g.restore();
  // labels (pinned to parts, on clear background) + 0.030 s timer
  const lab = (s, x, y, a) => card(g, s, x, y, a);
  lab('IGNITER', W * 0.2, H * 0.32, prog(t, 0.2, 0.45) * (1 - prog(t, pe, pe + 0.2))); lab('PELLETS', W * 0.2, H * 0.32, prog(t, pe, pe + 0.2) * (1 - prog(t, ni - 0.2, ni))); lab('NITROGEN', W * 0.72, H * 0.32, prog(t, ni, ni + 0.2) * (1 - prog(t, fi, fi + 0.15))); lab('BAG', W * 0.72, H * 0.32, prog(t, fi + 0.1, fi + 0.3) * (1 - prog(t, bl - 0.75, bl - 0.5)));
  if (t > fi - 0.1 && t < bl - 0.35) { const kk = clamp(prog(t, fi - 0.05, th + 0.5) * 1.05); word(g, `0.${String(Math.round(30 * kk)).padStart(3, '0')} s`, W * 0.55, H * 0.765, 1, 100, '#e8302a', 0); }
  if (t > bl - 0.45) { const a = ease.out(prog(t, bl - 0.45, bl - 0.15)), lid = clamp((t - bl) / 0.5); g.save(); g.globalAlpha = a; g.translate(W * 0.16, H * 0.27); ell(g, 0, 0, 120, 70 * (1 - lid * 0.92)); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); circle(g, 0, 0, 44 * (1 - lid * 0.92), '#3a8ad8'); circle(g, 0, 0, 18 * (1 - lid * 0.92), INK); g.restore(); text(g, 'BLINK 0.300 s', W * 0.16, H * 0.32, { size: 40, font: 'Nunito', weight: 900, color: INK, alpha: a }); text(g, 'BAG 0.030 s', W * 0.62, H * 0.28, { size: 52, font: 'Nunito', weight: 900, color: '#e8302a', alpha: a }); text(g, '10× FASTER', W * 0.62, H * 0.33, { size: 40, font: 'Nunito', weight: 900, color: INK, alpha: a }); }
} });

// ---------- f13 "But by the time cars finally got them, his patent had expired, and he never made a cent."
registerShot('f13', { draw(g, t, info) {
  const ex = atc(info, t, 'expired', info.dur * 0.5), ce = atc(info, t, 'cent', info.dur - 0.6), k = ease.inOut(clamp(t / info.dur));
  g.save(); cam(g, lerp(1.1, 1.3, k), W / 2, lerp(H * 0.6, H * 0.58, k));
  skyGrad(g, W, H, ['#f8c890', '#f0a870']); g.fillStyle = '#e8a878'; for (let x = 0; x < W; x += 120) g.fillRect(x, 0, 60, H); g.fillStyle = '#7a4a3a'; g.fillRect(0, H * 0.74, W, H);
  rrect(g, W * 0.06, H * 0.12, 360, 440, 10); g.fillStyle = '#ffb870'; g.fill(); g.save(); g.clip(); skyGrad(g, W, H, ['#ff9a5a', '#ffd890'], H * 0.12, H * 0.12 + 440); g.beginPath(); g.arc(W * 0.06 + 180, H * 0.12 + 330, 80, 0, TAU); g.fillStyle = '#fff2c0'; g.fill(); townSkyline(g, W * 0.06, H * 0.12 + 440, 380, 0.6, 3, ['#c8704a', '#b8603a']); g.restore(); g.lineWidth = 14; g.strokeStyle = '#f4e8d8'; g.strokeRect(W * 0.06, H * 0.12, 360, 440);
  // framed family photo on the wall
  g.save(); g.translate(W * 0.7, H * 0.18); g.rotate(0.04); rrect(g, -120, -90, 240, 180, 8); g.fillStyle = '#6a4a2e'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); rrect(g, -100, -72, 200, 144, 4); g.fillStyle = '#bfe8ff'; g.fill(); g.save(); g.clip(); drawChar(g, -45, 120, 0.3, CAST.dad, { expr: 'happy' }); drawChar(g, 5, 110, 0.24, CAST.kid, { expr: 'happy' }); drawChar(g, 50, 120, 0.29, CAST.mom, { expr: 'happy' }); g.restore(); g.restore();
  // armchair
  rrect(g, W * 0.26, H * 0.4, 560, 420, 80); g.fillStyle = '#9a2a3a'; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  drawChar(g, W * 0.52, H * 0.84, 1.5, CAST.old, keys(t, [[0, { expr: 'neutral', legs: 'sit', armL: [-0.1, -1.7], armR: [-0.1, -1.7], lookY: 0.6 }], [ex, { expr: 'sad', lookY: 0.6 }, 0.6], [ce - 0.3, { expr: 'crying', armL: [0.12, 0.15], armR: [-0.2, -2.6] }, 0.5]], 4));
  for (const x of [W * 0.2, W * 0.78]) { rrect(g, x, H * 0.55, 140, 330, 60); g.fillStyle = '#8a2232'; g.fill(); g.stroke(); }
  // newspaper (lowered at the end)
  const lo = ease.inOut(prog(t, ce - 0.4, ce + 0.2)); g.save(); g.translate(W * 0.52, lerp(H * 0.72, H * 0.8, lo)); g.rotate(-0.05 + lo * 0.2); rrect(g, -190, -130, 380, 250, 6); g.fillStyle = '#f4ecd8'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); text(g, 'AIRBAGS', 0, -80, { size: 56, font: 'Playfair Display', weight: 900, color: '#1a1612' }); text(g, 'NOW IN NEW CARS', 0, -36, { size: 28, font: 'Playfair Display', weight: 700, color: '#1a1612' }); g.fillStyle = '#9a9488'; for (let i = 0; i < 5; i++) g.fillRect(-160, -6 + i * 22, i % 2 ? 200 : 320, 9); g.restore();
  g.restore();
  const st = prog(t, ex - 0.05, ex + 0.25); if (st > 0) { const s = 1 + 0.6 * (1 - ease.out(st)); g.save(); g.translate(W * 0.42, H * 0.1); g.rotate(-0.08); g.scale(s, s); g.globalAlpha = st; g.font = '900 84px Nunito'; const w = g.measureText('PATENT EXPIRED').width + 50; g.strokeStyle = '#d8202a'; g.lineWidth = 12; rrect(g, -w / 2, -56, w, 104, 16); g.stroke(); g.fillStyle = '#d8202a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PATENT EXPIRED', 0, 4); g.restore(); }
  word(g, '$0', W * 0.84, H * 0.12, prog(t, ex + 0.8, ex + 1.0), 150, '#ffd23a', 0.1);
} });

// ---------- f14 "And that's how the airbag was invented." flat crash test, slow motion, title
registerShot('f14', { draw(g, t, info) {
  const hit = 0.55, slow = 0.22, tt = t < hit ? t : hit + (t - hit) * slow, crush = ease.out(clamp((tt - hit) / 0.08)), ai = atc(info, t, 'airbag', 1.02);
  g.fillStyle = '#2a2e3a'; g.fillRect(0, 0, W, H); g.fillStyle = '#3a3e4c'; for (let x = 0; x < W; x += 160) g.fillRect(x, 0, 80, H * 0.66); g.fillStyle = '#ffffff'; for (let i = 0; i < 6; i++) { g.save(); g.globalAlpha = 0.9; rrect(g, 60 + i * 180, 60, 120, 24, 12); g.fill(); g.restore(); }
  g.fillStyle = '#5a5e6a'; g.fillRect(0, H * 0.66, W, H); g.fillStyle = '#ffd23a'; for (let x = -200; x < W; x += 160) { g.beginPath(); g.moveTo(x, H * 0.7); g.lineTo(x + 80, H * 0.7); g.lineTo(x + 40, H * 0.73); g.fill(); }
  const [sx, sy] = shk(t, hit, 20, 0.6); g.save(); cam(g, lerp(1.35, 2.0, ease.inOut(prog(t, hit, hit + 1.2))), lerp(W * 0.55, W * 0.7, ease.inOut(prog(t, hit, hit + 1.2))) + sx, H * 0.58 + sy);
  // barrier
  const bx = W * 0.9; for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#1a1a1e' : '#ffd23a'; g.fillRect(bx, H * 0.66 - (i + 1) * 60, 240, 60); } g.lineWidth = 8; g.strokeStyle = INK; g.strokeRect(bx, H * 0.66 - 480, 240, 480);
  const x = tt < hit ? lerp(-500, bx - 310, tt / hit) : bx - 310 + 30 * crush;
  g.save(); g.translate(x, 0); g.scale(1 - 0.08 * crush, 1); carSide(g, 0, H * 0.66, 1.0, { color: '#e8e8ee', roof: '#d8dce4', spin: x / 54, riders: (gg) => {
    const lean = ease.inOut(prog(tt, hit + 0.02, hit + 0.12)); gg.save(); gg.translate(70 + lean * 30, -150); gg.rotate(lean * 0.35); ell(gg, 0, 0, 34, 38); gg.fillStyle = '#f2c41a'; gg.fill(); gg.lineWidth = 5; gg.strokeStyle = INK; gg.stroke(); gg.beginPath(); gg.moveTo(0, 0); gg.arc(0, 0, 30, 0, Math.PI / 2); gg.closePath(); gg.fillStyle = INK; gg.fill(); gg.beginPath(); gg.moveTo(0, 0); gg.arc(0, 0, 30, Math.PI, Math.PI * 1.5); gg.closePath(); gg.fill(); gg.restore();
    const bk = ease.outBack(prog(tt, hit + 0.015, hit + 0.05)); if (bk > 0) { ell(gg, 140, -150, 70 * bk, 60 * bk); gg.fillStyle = '#ffffff'; gg.fill(); gg.lineWidth = 6; gg.strokeStyle = INK; gg.stroke(); } } });
  g.restore();
  const R = rng(4); if (tt > hit) { const u = (tt - hit) * 3; for (let i = 0; i < 18; i++) { g.save(); g.translate(bx - 20 - u * R() * 300, H * 0.5 - u * R() * 260 + u * u * 80); g.rotate(u * 8 * R()); g.fillStyle = i % 2 ? '#bfe8ff' : '#e8e8ee'; g.fillRect(-10, -6, 20, 12); g.restore(); } burst(g, bx, H * 0.56, 160, '#ffffff', 12, 1 - prog(t, hit, hit + 0.4)); }
  g.restore();
  chip(g, t < hit ? 'CRASH TEST · 50 km/h' : 'HIGH-SPEED CAMERA', 1, 150, '#ffffff');
  const a = ease.outBack(prog(t, ai - 0.1, ai + 0.3)); if (a > 0) { g.save(); g.translate(W / 2, H * 0.24); g.scale(a, a); word(g, 'AIRBAG', 0, 0, 1, 200, '#e8302a', -0.04); g.restore(); }
  text(g, 'invented by a dad · 1952', W / 2, H * 0.33, { size: 48, font: 'Nunito', weight: 900, color: '#ffffff', alpha: prog(t, ai + 0.4, ai + 0.8) }); veil(g, '#000', ease.in(prog(t, info.dur - 0.45, info.dur)) * 0.6);
} });
