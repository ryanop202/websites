// Remet les textes sur Reel_devis-auto_raw.mp4 (l'original IMG_4379.mov n'est plus sur le PC).
// 15.10.2026 : textes plus bas (cachés par l'interface Reels) et CTA plus tôt (Ryan coupe vers 18 s).
// node textes-sur-raw.js
const path = require('path');
const { execFileSync } = require('child_process');
const NM = path.resolve(__dirname, '../../../pub-salon-en-face/node_modules');
const puppeteer = require(path.join(NM, 'puppeteer-core'));
const ffmpeg = require(path.join(NM, 'ffmpeg-static'));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const out = path.resolve(__dirname, '..');
const src = path.join(out, 'Reel_devis-auto_raw.mp4');
const T_CTA = 14.5; // « Commente MAQUETTE » à partir de 14,5 s

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.goto('file:///' + path.join(__dirname, 'textes.html').split(path.sep).join('/'));
  for (const id of ['hook', 'cta']) {
    await page.evaluate(i => { document.querySelectorAll('.f').forEach(e => e.classList.toggle('on', e.id === i)); }, id);
    await page.screenshot({ path: path.join(__dirname, id + '.png'), omitBackground: true, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  }
  await browser.close();

  const f = `[0:v][1:v]overlay=0:0:enable='lt(t,${T_CTA})'[v1];[v1][2:v]overlay=0:0:enable='gte(t,${T_CTA})'[v]`;
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src,
    '-loop', '1', '-t', '21.08', '-i', path.join(__dirname, 'hook.png'), '-loop', '1', '-t', '21.08', '-i', path.join(__dirname, 'cta.png'),
    '-filter_complex', f, '-map', '[v]', '-t', '21.08', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(out, 'Reel_devis-auto_textes.mp4')], { stdio: 'inherit' });

  for (const t of [3, 15]) execFileSync(ffmpeg, ['-y', '-v', 'error', '-ss', String(t), '-i', path.join(out, 'Reel_devis-auto_textes.mp4'),
    '-frames:v', '1', path.join(__dirname, `verif_${t}s.png`)]);
  console.log('OK');
})();
