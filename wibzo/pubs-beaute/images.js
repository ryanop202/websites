// Images fixes : node images.js → carrousel (4 × 1080x1080) + visuel texte (1080x1350)
const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = { c1: 'Wibzo_beaute_carrousel_1-coiffure.png', c2: 'Wibzo_beaute_carrousel_2-onglerie.png', c3: 'Wibzo_beaute_carrousel_3-barbier.png', c4: 'Wibzo_beaute_carrousel_4-offre.png', img2: 'Wibzo_beaute_visuel-texte_4x5.png' };

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  for (const [k, name] of Object.entries(OUT)) {
    await page.setViewport({ width: 1080, height: k === 'img2' ? 1350 : 1080 });
    await page.goto('file:///' + path.resolve(__dirname, 'images.html').replace(/\\/g, '/') + '?k=' + k, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await (await page.$('#f')).screenshot({ path: path.join(__dirname, name) });
    console.log('ok', name);
  }
  await browser.close();
})();
