// node render.js  -> screenshots every out/*.html to PNG (1800x1150 @1.5x)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = path.join(__dirname, 'out');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1800, height: 1150 }, deviceScaleFactor: 1.5 });
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) {
    const v = f.endsWith('_v.html'); await p.setViewportSize(v ? {width:1080,height:1920} : {width:1800,height:1150});
    await p.goto('file://' + path.join(dir, f));
    await p.screenshot({ path: path.join(dir, f.replace('.html', '.png')) });
    console.log('rendered', f);
  }
  await b.close();
})();
