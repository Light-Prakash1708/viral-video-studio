// silent.js: helpers for wordless short films (LastSoul-style). Copy into a project's scenes/sets/.
import { E, V, S, text, ease, prog, clamp, alpha, rr, glow } from '/engine/core.js';

// Desaturate everything drawn so far. k = 0 (full colour) .. 1 (grey). Draw "earned colour" accents AFTER calling it.
export function desat(g, k) { if (k <= 0) return; g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = `rgba(128,128,128,${clamp(k)})`; g.fillRect(0, 0, E.W, E.H); g.restore(); }
// Colour arc helper: grey until the turning point, then colour floods back over `dur` seconds of story time (global t).
export const colourArc = (globalT, turnAt, dur = 20) => 1 - ease.inOut(prog(globalT, turnAt, turnAt + dur));

// A small in-world line of dialogue above a head (replaces narration). Fades in/out with the shot.
export function line(g, str, x, y, t, o = {}) {
  const { at = 0, out = 99, color = '#ffffff', size = V(30, 38), bubble = true } = o;
  const a = ease.out(prog(t, at, at + 0.25)) * (1 - prog(t, out, out + 0.3)); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.font = `600 ${size}px "Nunito"`;
  const w = g.measureText(str).width + size * 1.2;
  if (bubble) { rr(g, x - w / 2, y - size * 0.95, w, size * 1.9, size * 0.95); g.fillStyle = 'rgba(70,70,76,.82)'; g.fill(); }
  text(g, str, x, y + 1, { size, font: 'Nunito', weight: 600, color });
  g.restore();
}
// Full-black title/quote card ("Big plans feel better than small steps." / quote — Author). Serif, centred, slow fade.
export function quoteCard(g, t, dur, quote, author = null) {
  g.fillStyle = '#000'; g.fillRect(0, 0, E.W, E.H);
  const a = ease.inOut(prog(t, 0.2, 1.0)) * (1 - prog(t, dur - 0.8, dur));
  const lines = quote.split('\n');
  lines.forEach((l, i) => text(g, l, E.W / 2, E.H / 2 + (i - (lines.length - 1) / 2) * V(56, 64), { size: V(44, 50), font: 'Playfair Display', weight: 400, italic: true, color: '#f2f2f2', alpha: a }));
  if (author) text(g, '— ' + author, E.W / 2, E.H / 2 + lines.length * V(40, 46) + V(30, 40), { size: V(26, 30), font: 'Playfair Display', weight: 400, color: '#a0a0a8', alpha: a });
}
// Big on-screen clock/date stamp that anchors time ("2:14 AM", "Friday, Dec 5 / Game night")
export function stamp(g, big, small, t, o = {}) {
  const { x = E.W * V(0.78, 0.5), y = E.H * V(0.16, 0.18), a = 1 } = o;
  const k = ease.out(prog(t, 0.1, 0.5)) * a;
  text(g, big, x, y, { size: V(96, 120), font: 'Nunito', weight: 300, color: '#ffffff', alpha: k });
  if (small) text(g, small, x, y + V(70, 84), { size: V(30, 36), font: 'Nunito', weight: 400, color: '#d8d8d8', alpha: k });
}
// Ending card: TITLE + one-line moral ("1 MINUTE / Just start. See where it takes you.")
export function endCard(g, t, title, moral) {
  g.fillStyle = '#000'; g.fillRect(0, 0, E.W, E.H);
  const a = ease.inOut(prog(t, 0.3, 1.2));
  text(g, title, E.W / 2, E.H / 2 - V(20, 24), { size: V(76, 88), font: 'Playfair Display', weight: 400, color: '#ffffff', alpha: a, spacing: 8 });
  text(g, moral, E.W / 2, E.H / 2 + V(50, 60), { size: V(28, 32), font: 'Playfair Display', weight: 400, color: '#b8b8c0', alpha: ease.inOut(prog(t, 1.0, 1.8)) });
}
