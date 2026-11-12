// hf_fingerprint.cjs: "did this moment change?" fingerprints of a HyperFrames page (used by hf_chunks.py).
// usage: node hf_fingerprint.cjs <index.html> <dur> <rate/s> <w> <h> <out.json>
// Seeks the page's GSAP timelines (window.__timelines) to each sample time and hashes the page STATE (the DOM with
// every inline style/attribute GSAP wrote) plus the page's CSS. Pixel hashes are not repeatable in Chromium (55 of 383
// differed between two identical runs); the DOM state is, and it changes whenever the picture's code changes.
const { chromium } = require('playwright');
const crypto = require('crypto'); const fs = require('fs'); const path = require('path');
const [file, dur, rate, w, h, out] = process.argv.slice(2);
(async () => {
  const exe = ['/opt/pw-browsers/chromium'].find(f => fs.existsSync(f));
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  await page.goto('file://' + path.resolve(file));
  await page.waitForFunction(() => window.__timelines && Object.keys(window.__timelines).length > 0, null, { timeout: 60000 });
  const css = await page.evaluate(() => [...document.querySelectorAll('style')].map(s => s.textContent).join('\n'));
  const cssHash = crypto.createHash('sha1').update(css).digest('hex');
  const n = Math.floor(+dur * +rate) + 1;
  const hashes = await page.evaluate(({ n, rate, dur }) => {
    const root = document.getElementById('root') || document.body, out = [];
    // visible-only serialisation: hidden layers (opacity 0 / display none) do not count, so a change inside a layer
    // that is not on screen at t does not mark t as changed
    const ser = el => {
      const st = el.getAttribute && el.getAttribute('style') || '';
      if (/opacity:\s*0(?![.\d])|display:\s*none/.test(st)) return '';
      let s = '<' + el.tagName + [...(el.attributes || [])].map(a => ' ' + a.name + '=' + a.value).join('') + '>';
      for (const c of el.childNodes) s += c.nodeType === 3 ? c.nodeValue : c.nodeType === 1 ? ser(c) : '';
      return s;
    };
    const h = s => { let x = 2166136261 >>> 0, y = 0x9e3779b9; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); x = Math.imul(x ^ c, 16777619) >>> 0; y = Math.imul(y ^ c, 2246822519) >>> 0; } return x.toString(16).padStart(8, '0') + y.toString(16).padStart(8, '0'); };
    for (let i = 0; i < n; i++) {
      const t = Math.min(dur - 1e-3, i / rate);
      for (const tl of Object.values(window.__timelines)) tl.seek(t, false);
      out.push(h(ser(root)));
    }
    return out;
  }, { n, rate: +rate, dur: +dur });
  fs.writeFileSync(out, JSON.stringify(hashes.map(x => cssHash.slice(0, 6) + x)));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
