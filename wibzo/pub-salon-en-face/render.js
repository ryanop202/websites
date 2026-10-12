// Rendu de la pub : node render.js 916|45 [stills t1,t2,...]
// Capture chaque image avec Chrome, puis assemble la vidéo avec ffmpeg.
const puppeteer = require('puppeteer-core');
const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');
const path = require('path');

const fmt = process.argv[2] || '916';
const stills = process.argv[3];
const W = 1080, H = fmt === '45' ? 1350 : 1920;
const FPS = 30, DUR = 14.9;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files', '--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  const url = 'file:///' + path.resolve(__dirname, 'ad.html').replace(/\\/g, '/') + '?render&f=' + fmt;
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const el = await page.$('#f');

  if (stills) {
    for (const t of stills.split(',')) {
      await page.evaluate(x => window.render(x), +t);
      await el.screenshot({ path: path.join(__dirname, 'out', `still_${fmt}_${t}.png`) });
    }
    await browser.close();
    return;
  }

  const out = path.join(__dirname, 'out', `video_${fmt}.mp4`);
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'ignore', 'inherit'] });
  const N = Math.round(DUR * FPS);
  for (let i = 0; i < N; i++) {
    await page.evaluate(x => window.render(x), i / FPS);
    const buf = await el.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`${fmt}: ${i}/${N}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('ok', out);
})();
