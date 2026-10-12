// Affiches fixes : node affiches.js → 2 affiches 1080x1350 (fil d'actualité)
const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = { a: 'Wibzo_affiche_pas-de-site_4x5.png', b: 'Wibzo_affiche_peur-de-payer_4x5.png' };

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350 });
  for (const [k, name] of Object.entries(OUT)) {
    await page.goto('file:///' + path.resolve(__dirname, 'affiches.html').split(path.sep).join('/') + '?k=' + k, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await (await page.$('#f')).screenshot({ path: path.join(__dirname, 'out', name) });
    require('fs').copyFileSync(path.join(__dirname, 'out', name), path.join(__dirname, name));
    console.log('ok', name);
  }
  await browser.close();
})();
