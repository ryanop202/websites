// Rendu : node render.js <1|2|3> [stills t1,t2,...]
// Capture chaque image avec Chrome, puis assemble la vidéo avec ffmpeg (modules de ../pubs-v2).
const path = require('path');
const req = m => require(path.join(__dirname, '..', 'pubs-v2', 'node_modules', m));
const puppeteer = req('puppeteer-core');
const ffmpeg = req('ffmpeg-static');
const { spawn } = require('child_process');

const r = process.argv[2] || '1';
const stills = process.argv[3];
const DUR = { 1: 16.8, 2: 15.2, 3: 12.6 }[r];
const W = 1080, H = 1920, FPS = 30;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files', '--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  const url = 'file:///' + path.resolve(__dirname, 'reels.html').split(path.sep).join('/') + `?render&r=${r}`;
  page.on('pageerror', e => console.log('ERR', e.message));
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const el = await page.$('#f');

  if (stills) {
    for (const t of stills.split(',')) {
      await page.evaluate(x => window.render(x), +t);
      await el.screenshot({ path: path.join(__dirname, 'out', `still_r${r}_${t}.png`) });
    }
    await browser.close();
    return;
  }

  const out = path.join(__dirname, 'out', `video_r${r}.mp4`);
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'ignore', 'inherit'] });
  const N = Math.round(DUR * FPS);
  for (let i = 0; i < N; i++) {
    await page.evaluate(x => window.render(x), i / FPS);
    const buf = await el.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(res => ff.stdin.once('drain', res));
    if (i % 90 === 0) process.stdout.write(`r${r}: ${i}/${N}\n`);
  }
  ff.stdin.end();
  await new Promise(res => ff.on('close', res));
  await browser.close();
  console.log('ok', out);
})();
