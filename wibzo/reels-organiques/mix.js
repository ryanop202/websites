// Mixage final : voix Théo (audio/voix_rN.mp3, si elle existe) + musique (baisse sous la voix) → MP4 9:16
// node mix.js        → les 3 reels
// node mix.js 1 2    → seulement les reels 1 et 2
const path = require('path');
const fs = require('fs');
const ffmpeg = require(path.join(__dirname, '..', 'pubs-v2', 'node_modules', 'ffmpeg-static'));
const { execFileSync } = require('child_process');
const d = f => path.join(__dirname, f);

const NAMES = { 1: 'Reel1_speedrun-boulangerie', 2: 'Reel2_avant-apres-salon', 3: 'Reel3_3-raisons' };
const DUR = { 1: 16.8, 2: 15.2, 3: 12.6 };
// Reel 2 : la voix est coupée en 2 morceaux (« … Avant… Après. » puis « Abonne-toi … »),
// le 2e est placé après la démo de réservation. [début, fin, position dans la vidéo] en secondes.
const SEG = { 2: [[0, 7.92, 0], [7.94, 9.6, 12.45]] };

const list = process.argv.slice(2).length ? process.argv.slice(2) : ['1', '2', '3'];
for (const r of list) {
  const audio = d(`out/mix_r${r}.m4a`);
  const voice = d(`audio/voix_r${r}.mp3`);
  if (fs.existsSync(voice)) {
    let vchain;
    if (SEG[r]) {
      const parts = SEG[r].map((s, i) => `[0:a]atrim=${s[0]}:${s[1]},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=${(s[1] - s[0] - 0.03).toFixed(3)}:d=0.03,adelay=${Math.round(s[2] * 1000)}:all=1[p${i}]`);
      vchain = parts.join(';') + ';' + SEG[r].map((s, i) => `[p${i}]`).join('') + `amix=inputs=${SEG[r].length}:normalize=0[vv];[vv]`;
    } else vchain = '[0:a]';
    execFileSync(ffmpeg, ['-y', '-i', voice, '-i', d(`out/music_r${r}.wav`), '-filter_complex',
      vchain + 'aresample=44100,aformat=channel_layouts=stereo,highpass=f=80,acompressor=threshold=0.1:ratio=3:attack=5:release=80,volume=1.6,asplit=2[v][key];' +
      '[1:a]volume=0.42[m];' +
      '[m][key]sidechaincompress=threshold=0.04:ratio=5:attack=8:release=260[md];' +
      `[v][md]amix=inputs=2:duration=longest:normalize=0,atrim=0:${DUR[r]},loudnorm=I=-14:TP=-1.5:LRA=9[out]`,
      '-map', '[out]', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', audio], { stdio: 'inherit' });
  } else {
    // pas de voix : musique seule, un peu plus présente
    execFileSync(ffmpeg, ['-y', '-i', d(`out/music_r${r}.wav`), '-af', `atrim=0:${DUR[r]},loudnorm=I=-14:TP=-1.5:LRA=9`,
      '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', audio], { stdio: 'inherit' });
  }
  const name = `${NAMES[r]}_9x16.mp4`;
  execFileSync(ffmpeg, ['-y', '-i', d(`out/video_r${r}.mp4`), '-i', audio, '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'copy', '-t', String(DUR[r]), '-movflags', '+faststart', d(name)], { stdio: 'inherit' });
  console.log('ok', name);
}
