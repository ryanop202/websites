// Affiches v3 (formulaire Meta) : node affiches-v3.js → 4 PNG dans ../pubs-meta-formulaire/visuels/
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const DEST = path.resolve(__dirname, '../pubs-meta-formulaire/visuels');
const JOBS = [
  ['a', '45', 'Wibzo_A-concurrent_4x5.png'], ['a', '916', 'Wibzo_A-concurrent_9x16.png'],
  ['b', '45', 'Wibzo_B-google_4x5.png'], ['b', '916', 'Wibzo_B-google_9x16.png'],
  ['c', '11', 'Wibzo_C-prix_1x1.png'], ['c', '45', 'Wibzo_C-prix_4x5.png'], ['c', '916', 'Wibzo_C-prix_9x16.png'],
];
const ONLY = process.argv[2]; // ex. node affiches-v3.js c → seulement l'affiche C

(async () => {
  fs.mkdirSync(DEST, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  for (const [k, f, name] of JOBS) {
    if (ONLY && k !== ONLY) continue;
    await page.setViewport({ width: 1080, height: f === '916' ? 1920 : f === '11' ? 1080 : 1350 });
    await page.goto('file:///' + path.resolve(__dirname, 'affiches-v3.html').split(path.sep).join('/') + '?k=' + k + '&f=' + f, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await (await page.$('#f')).screenshot({ path: path.join(DEST, name) });
    console.log('ok', name);
  }
  await browser.close();
})();
