// Capture d'une maquette (../maquettes-demo/<nom>/index.html) en entier, à la taille de l'écran du téléphone des Reels.
// node shoot.js <nom> [variante]  → maquettes/<nom>[_variante].png  (largeur 378 px, x3 pour rester net au zoom)
const path = require('path');
const fs = require('fs');
const puppeteer = require(path.join(__dirname, '..', 'pubs-v2', 'node_modules', 'puppeteer-core'));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [name, variant] = process.argv.slice(2);

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files', '--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 378, height: 742, deviceScaleFactor: 3 });
  const file = path.resolve(__dirname, '..', 'maquettes-demo', name, 'index.html');
  await page.goto('file:///' + file.split(path.sep).join('/') + (variant ? '?v=' + variant : ''), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.join(__dirname, 'maquettes'), { recursive: true });
  const out = path.join(__dirname, 'maquettes', name + (variant ? '_' + variant : '') + '.png');
  await page.screenshot({ path: out, fullPage: true });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  // positions (px CSS) des éléments marqués data-pos ou des sections, pour caler l'animation du Reel
  const pos = await page.evaluate(() => {
    const o = {};
    document.querySelectorAll('section, .addr, .addr-vague, .map, .btn, .quick, h1').forEach(e => {
      const r = e.getBoundingClientRect(); if (!r.height) return;
      o[(e.id || e.className || e.tagName).toString().split(' ')[0]] = { y: Math.round(r.top + scrollY), h: Math.round(r.height), x: Math.round(r.left), w: Math.round(r.width) };
    });
    return o;
  });
  fs.writeFileSync(out.replace('.png', '.json'), JSON.stringify({ h, pos }, null, 1));
  console.log('ok', out, 'hauteur', h);
  await browser.close();
})();
