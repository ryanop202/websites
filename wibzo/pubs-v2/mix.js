// Assemble image + musique (pas de voix) → MP4 finaux 9:16 et 4:5 pour les 2 vidéos
const ffmpeg = require('ffmpeg-static');
const { execFileSync } = require('child_process');
const path = require('path');
const d = f => path.join(__dirname, f);

const NAMES = { 1: 'Wibzo_voir-avant-de-payer', 2: 'Wibzo_le-concurrent' };
for (const v of ['1', '2']) {
  const audio = d(`out/mix_v${v}.m4a`);
  execFileSync(ffmpeg, ['-y', '-i', d(`out/music_v${v}.wav`), '-af', 'volume=0.8,atrim=0:14.9,loudnorm=I=-14:TP=-1.5:LRA=9',
    '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', audio], { stdio: 'inherit' });
  for (const [fmt, suf] of [['916', '9x16'], ['45', '4x5']]) {
    const name = `${NAMES[v]}_${suf}.mp4`;
    execFileSync(ffmpeg, ['-y', '-i', d(`out/video_v${v}_${fmt}.mp4`), '-i', audio, '-map', '0:v', '-map', '1:a',
      '-c:v', 'copy', '-c:a', 'copy', '-t', '14.9', '-movflags', '+faststart', d(name)], { stdio: 'inherit' });
    console.log('ok', name);
  }
}
