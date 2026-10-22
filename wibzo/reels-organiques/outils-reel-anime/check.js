// node check.js <page.html> <out.png> t1 t2 ...   -> planche de captures (6 par ligne) + erreurs JS
const puppeteer = require('puppeteer-core');
const { execFileSync } = require('child_process');
const path = require('path'), fs = require('fs');
const [,, page, out, ...times] = process.argv;
const FFMPEG = 'C:/Users/Admin/AppData/Local/Python/pythoncore-3.14-64/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const tab = await browser.newPage();
  const errs = [];
  tab.on('pageerror', e => errs.push(e.message));
  tab.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await tab.setViewport({ width: 1080, height: 1946, deviceScaleFactor: .4 });
  await tab.goto('file:///' + path.resolve(page).replace(/\\/g, '/') + '?t=0', { waitUntil: 'networkidle0' });
  await tab.evaluate(() => document.fonts.ready);
  const box = await tab.evaluate(() => { const r = document.getElementById('stage').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
  const dir = path.dirname(out), files = [];
  for (const t of times) {
    try { await tab.evaluate(t => { (String(t).startsWith("r") ? window.renderAt(+String(t).slice(1)) : (window.renderDesign || window.renderAt)(+t)); const s = document.getElementById('subs'); [...s.children].forEach(c => { c.style.opacity = 1; c.style.transform = ''; }); }, t); }
    catch (e) { errs.push(`t=${t}: ${e.message}`); }
    const f = path.join(dir, `c_${t}.png`);
    await tab.screenshot({ path: f, clip: box });
    // label
    files.push(f);
  }
  await browser.close();
  const n = files.length, rows = Math.ceil(n / 6);
  const inputs = []; files.forEach(f => inputs.push('-i', f));
  let fc = '';
  for (let r = 0; r < rows; r++) {
    const ids = []; for (let j = r*6; j < r*6 + 6; j++) ids.push(`[${Math.min(j, n-1)}]`);
    fc += ids.join('') + `hstack=6[r${r}];`;
  }
  fc += rows > 1 ? [...Array(rows).keys()].map(r => `[r${r}]`).join('') + `vstack=${rows}` : '[r0]null';
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc, out]);
  files.forEach(f => fs.unlinkSync(f));
  console.log(errs.length ? 'ERREURS:\n' + [...new Set(errs)].join('\n') : 'aucune erreur', '\n' + out);
})();
