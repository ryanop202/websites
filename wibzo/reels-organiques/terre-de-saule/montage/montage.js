// Montage du Reel Terre de Saule (15.10.2026).
// node montage.js "C:/Users/ryan/Downloads/IMG_4379.mov"
// Sort 2 vidéos dans ../ : Reel_devis-auto_textes.mp4 (hook + CTA) et Reel_devis-auto_raw.mp4 (sans texte).
// Vidéo entière, sans coupe (demande de Ryan) + image figée à la fin pour lire le CTA.
const path = require('path');
const { execFileSync } = require('child_process');
const NM = path.resolve(__dirname, '../../../pub-salon-en-face/node_modules');
const puppeteer = require(path.join(NM, 'puppeteer-core'));
const ffmpeg = require(path.join(NM, 'ffmpeg-static'));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const src = process.argv[2] || 'C:/Users/ryan/Downloads/IMG_4379.mov';
const out = path.resolve(__dirname, '..');

const DUR = 18.68;     // durée de la vidéo d'origine
const ZOOM_OUT = 10.5; // à partir d'ici l'écran est filmé de loin et le blanc est cramé -> on l'assombrit un peu
const T_CTA = 17.0;    // « Parlons de votre terrain » : le CTA remplace le hook
const HOLD = 2.4;      // image figée à la fin pour lire le CTA
const TOTAL = DUR + HOLD;

(async () => {
  // 1. textes -> PNG transparents
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.goto('file:///' + path.join(__dirname, 'textes.html').replace(/\\/g, '/'));
  for (const id of ['hook', 'cta']) {
    await page.evaluate(i => { document.querySelectorAll('.f').forEach(e => e.classList.toggle('on', e.id === i)); }, id);
    await page.screenshot({ path: path.join(__dirname, id + '.png'), omitBackground: true, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  }
  await browser.close();

  // 2. vidéo entière + étalonnage léger
  const base =
    `[0:v]trim=0:${ZOOM_OUT},setpts=PTS-STARTPTS,eq=contrast=1.05:saturation=1.12[a];` +
    `[0:v]trim=${ZOOM_OUT},setpts=PTS-STARTPTS,eq=gamma=0.85:contrast=1.05:saturation=1.12,tpad=stop_mode=clone:stop_duration=${HOLD}[b];` +
    `[a][b]concat=n=2:v=1:a=0,fps=30,scale=1080:1920,setsar=1[base]`;
  const enc = ['-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];

  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src, '-filter_complex', base, '-map', '[base]', '-t', String(TOTAL), ...enc,
    path.join(out, 'Reel_devis-auto_raw.mp4')], { stdio: 'inherit' });

  const txt = base +
    `;[base][1:v]overlay=0:0:enable='lt(t,${T_CTA})'[v1]` +
    `;[v1][2:v]overlay=0:0:enable='gte(t,${T_CTA})'[v]`;
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src,
    ...['hook', 'cta'].flatMap(id => ['-loop', '1', '-t', String(TOTAL), '-i', path.join(__dirname, id + '.png')]),
    '-filter_complex', txt, '-map', '[v]', '-t', String(TOTAL), ...enc,
    path.join(out, 'Reel_devis-auto_textes.mp4')], { stdio: 'inherit' });

  console.log('OK, durée', TOTAL.toFixed(1), 's ->', out);
})();
