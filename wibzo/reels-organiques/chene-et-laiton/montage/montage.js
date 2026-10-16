// Montage du Reel Chêne & Laiton 3D (15.10.2026).
// node montage.js "C:/Users/ryan/Downloads/IMG_4391.mov"
// Sort 2 vidéos dans ../ : Reel_cuisine-3d_textes.mp4 (accroche + CTA) et Reel_cuisine-3d_raw.mp4 (sans texte).
// Étalonnage : noirs plus profonds, blancs adoucis (surtout 15,6–18,4 s, la section claire du site), couleurs un peu plus vives, netteté.
const path = require('path');
const { execFileSync } = require('child_process');
const NM = path.resolve(__dirname, '../../../pub-salon-en-face/node_modules');
const puppeteer = require(path.join(NM, 'puppeteer-core'));
const ffmpeg = require(path.join(NM, 'ffmpeg-static'));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const src = process.argv[2] || 'C:/Users/ryan/Downloads/IMG_4391.mov';
const out = path.resolve(__dirname, '..');
const DUR = 20.3, HOLD = 1.8, TOTAL = DUR + HOLD;
const T_CTA = 14.6; // l'appel à l'action arrive quand la page commence à défiler

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.goto('file:///' + path.join(__dirname, 'textes.html').split(path.sep).join('/'));
  for (const id of ['hook', 'cta']) {
    await page.evaluate(i => { document.querySelectorAll('.f').forEach(e => e.classList.toggle('on', e.id === i)); }, id);
    await page.screenshot({ path: path.join(__dirname, id + '.png'), omitBackground: true, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  }
  await browser.close();

  const grade =
    `[0:v]fps=30,scale=1080:1920,setsar=1,` +
    `hqdn3d=1.5:1.5:4:4,` +
    `curves=all='0/0 0.07/0 0.5/0.53 0.82/0.8 1/0.9',` +
    `curves=all='0/0 0.5/0.47 0.8/0.66 1/0.74':enable='between(t,15.6,18.4)',` +
    `eq=saturation=1.18:contrast=1.04,` +
    `unsharp=5:5:0.7:5:5:0,` +
    `tpad=stop_mode=clone:stop_duration=${HOLD}[base]`;
  const enc = ['-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];

  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src, '-filter_complex', grade, '-map', '[base]', '-t', String(TOTAL), ...enc,
    path.join(out, 'Reel_cuisine-3d_raw.mp4')], { stdio: 'inherit' });

  const txt = grade +
    `;[base][1:v]overlay=0:0:enable='lt(t,${T_CTA})'[v1]` +
    `;[v1][2:v]overlay=0:0:enable='gte(t,${T_CTA})'[v]`;
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src,
    ...['hook', 'cta'].flatMap(id => ['-loop', '1', '-t', String(TOTAL), '-i', path.join(__dirname, id + '.png')]),
    '-filter_complex', txt, '-map', '[v]', '-t', String(TOTAL), ...enc,
    path.join(out, 'Reel_cuisine-3d_textes.mp4')], { stdio: 'inherit' });

  for (const t of [3, 9, 13, 17, 21]) execFileSync(ffmpeg, ['-y', '-v', 'error', '-ss', String(t), '-i', path.join(out, 'Reel_cuisine-3d_textes.mp4'),
    '-frames:v', '1', '-vf', 'scale=-2:900', path.join(__dirname, `verif_${t}s.jpg`)]);
  console.log('OK, durée', TOTAL.toFixed(1), 's ->', out);
})();
