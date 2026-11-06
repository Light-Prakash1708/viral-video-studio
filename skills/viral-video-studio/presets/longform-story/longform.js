// longform.js: on-screen grammar for 16:9 long-form story videos (GrowKaz). Copy into scenes/sets/.
import { E, V, S, text, rr, ease, prog, clamp, alpha, glow } from '/engine/core.js';
// top-right corner counter: "YEAR 12", "+75 YEARS", "POPULATION 8,546,775,469"
export function counter(g, label, value, t, o = {}) {
  const { x = E.W - V(60, 50), y = V(70, 120), a = 1, color = '#ffffff' } = o, k = ease.out(prog(t, 0, 0.3)) * a; if (k <= 0) return;
  g.save(); g.globalAlpha *= k; g.font = `900 ${V(34, 40)}px "Nunito"`; const w = Math.max(g.measureText(value).width, g.measureText(label).width * 0.7) + 48;
  rr(g, x - w, y - 34, w, label ? 92 : 64, 14); g.fillStyle = 'rgba(12,14,20,.72)'; g.fill();
  if (label) text(g, label, x - w / 2, y - 12, { size: V(18, 22), font: 'Nunito', weight: 800, color: alpha(color, 0.75), spacing: 3 });
  text(g, value, x - w / 2, y + (label ? 22 : 0), { size: V(34, 40), font: 'Nunito', weight: 900, color });
  g.restore();
}
// bottom stat pill: "≈ 10 kids per woman"
export function pill(g, str, t, o = {}) {
  const { y = E.H - V(110, 380), a = 1 } = o, k = ease.out(prog(t, 0, 0.3)) * a; if (k <= 0) return;
  g.save(); g.globalAlpha *= k; g.font = `800 ${V(30, 36)}px "Nunito"`; const w = g.measureText(str).width + 60;
  rr(g, E.W / 2 - w / 2, y - 30, w, 60, 30); g.fillStyle = 'rgba(12,14,20,.75)'; g.fill(); text(g, str, E.W / 2, y + 1, { size: V(30, 36), font: 'Nunito', weight: 800, color: '#f4f4f4' }); g.restore();
}
// tiny bottom-left source citation (always cite numbers)
export function cite(g, str, t, o = {}) { const k = ease.out(prog(t, 0, 0.4)) * (o.a ?? 1); if (k <= 0) return; text(g, str, V(40, 30), E.H - V(36, 60), { size: V(18, 22), font: 'Nunito', weight: 700, color: 'rgba(255,255,255,.55)', align: 'left', alpha: k }); }
// chapter card: big number + title, used every 1–2 minutes
export function chapter(g, n, title, t, dur) {
  const a = ease.out(prog(t, 0, 0.4)) * (1 - prog(t, dur - 0.4, dur)); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.fillStyle = 'rgba(8,10,14,.55)'; g.fillRect(0, E.H * 0.38, E.W, E.H * 0.24);
  text(g, String(n).padStart(2, '0'), E.W / 2, E.H * 0.44, { size: V(40, 48), font: 'Nunito', weight: 900, color: S().ui.gold, spacing: 6 });
  text(g, title.toUpperCase(), E.W / 2, E.H * 0.53, { size: V(72, 80), color: '#ffffff', spacing: 4 }); g.restore();
}
// keyword label that types on next to a thing ("Abandoned Sewer System")
export function keyword(g, str, x, y, t, o = {}) {
  const { color = '#ff5a4a', size = V(40, 46) } = o, n = Math.floor(clamp(prog(t, 0, 0.5)) * str.length); if (n <= 0) return;
  text(g, str.slice(0, n), x, y, { size, color, weight: 700, stroke: 8, strokeColor: 'rgba(0,0,0,.65)' });
}
