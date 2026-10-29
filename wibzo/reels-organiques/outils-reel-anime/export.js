// node export.js <page.html> <out.mp4> [scale=1] [fps=30] [audio.mp3]
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');
const [,, page, out, scaleArg = '1', fpsArg = '30', audio] = process.argv;
const SCALE = +scaleArg, FPS = +fpsArg;
const FFMPEG = process.env.FFMPEG || require('child_process').execSync('python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"').toString().trim();
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });
  const tab = await browser.newPage();
  await tab.setViewport({ width: 1080, height: 1946, deviceScaleFactor: SCALE });
  await tab.goto('file:///' + path.resolve(page).replace(/\\/g, '/') + '?t=0', { waitUntil: 'networkidle0' });
  await tab.evaluate(() => document.fonts.ready);
  const dur = await tab.evaluate(() => window.DUR);
  const box = await tab.evaluate(() => { const r = document.getElementById('stage').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
  const W = Math.round(1080 * SCALE / 2) * 2, H = Math.round(1920 * SCALE / 2) * 2;
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-'];
  if (audio) args.push('-i', audio);
  args.push('-vf', `scale=${W}:${H}`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium');
  if (audio) args.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  args.push('-movflags', '+faststart', out);
  const ff = spawn(FFMPEG, args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(dur * FPS);
  for (let i = 0; i < n; i++) {
    await tab.evaluate(t => new Promise(res => { window.renderAt(t); requestAnimationFrame(() => requestAnimationFrame(res)); }), i / FPS);
    const buf = await tab.screenshot({ type: 'jpeg', quality: 92, clip: box });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) process.stdout.write(`${(i / FPS).toFixed(0)}s `);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('\nok', out);
})();
