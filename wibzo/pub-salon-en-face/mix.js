// Mixage final : voix Théo (+7 %) + musique (baisse sous la voix) → MP4 9:16 et 4:5
const ffmpeg = require('ffmpeg-static');
const { execFileSync } = require('child_process');
const path = require('path');
const d = f => path.join(__dirname, f);

const audio = d('out/mix.m4a');
execFileSync(ffmpeg, ['-y', '-i', d('audio/voix_1.mp3'), '-i', d('out/music.wav'), '-filter_complex',
  '[0:a]atempo=1.07,aresample=44100,highpass=f=80,acompressor=threshold=0.1:ratio=3:attack=5:release=80,volume=1.6,asplit=2[v][key];' +
  '[1:a]volume=0.42[m];' +
  '[m][key]sidechaincompress=threshold=0.04:ratio=5:attack=8:release=260[md];' +
  '[v][md]amix=inputs=2:duration=longest:normalize=0,atrim=0:14.9,loudnorm=I=-14:TP=-1.5:LRA=9[out]',
  '-map', '[out]', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', audio], { stdio: 'inherit' });

for (const [fmt, name] of [['916', 'Wibzo_coiffeur_salon-en-face_9x16.mp4'], ['45', 'Wibzo_coiffeur_salon-en-face_4x5.mp4']]) {
  execFileSync(ffmpeg, ['-y', '-i', d(`out/video_${fmt}.mp4`), '-i', audio, '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'copy', '-t', '14.9', '-movflags', '+faststart', d(name)], { stdio: 'inherit' });
  console.log('ok', name);
}
