# Cale chaque phrase de la voix sur son moment dans l'animation.
# Usage : python sync_voice.py video.html voix.mp3 sortie.wav
import sys, re, subprocess
html, voice, out_wav = sys.argv[1:4]
FF = 'C:/Users/Admin/AppData/Local/Python/pythoncore-3.14-64/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
s = open(html, encoding='utf-8').read()

# phrases de la voix (début, fin) en secondes dans voix-noah.mp3, une par sous-titre
CLIPS = [(0.00,2.25),(2.66,3.66),(4.12,4.92),(5.32,6.62),(6.95,7.96),(8.43,9.93),(10.31,11.00),(11.40,11.89),
         (12.27,13.91),(14.23,15.95),(16.33,16.99),(17.42,18.44),(18.81,19.69),(19.99,21.10),(21.61,22.76),
         (23.16,24.88),(25.15,27.07),(27.41,29.59),(29.87,30.79),(31.17,33.40),(33.78,35.17),(35.40,36.53)]
lines = re.findall(r"\{a:\s*([0-9.]+),\s*b:\s*([0-9.]+),\s*d:\s*([0-9.]+),\s*text:", s[s.index('const LINES = ['):])
lines = [(float(a), float(b)) for a, b, _ in lines][:len(CLIPS)]
assert len(lines) == len(CLIPS), len(lines)
DUR = float(re.search(r"const DUR = ([0-9.]+);", s).group(1))

# rythme visuel souhaité (même découpage que la version sans voix)
SPEED = [[0,8.4,1],[8.4,12.6,1.15],[12.6,22.4,1.35],[22.4,32.0,1.25],[32.0,35.9,1],[35.9,41.3,1.15],[41.3,47.0,1.3],[47.0,DUR,1]]
def real_of(d):
    acc = 0
    for a, b, v in SPEED:
        if d <= b: return acc + (d - a)/v
        acc += (b - a)/v
    return acc

anchors = [(0.0, 0.0)]
prev_end = -1
starts = []
for (a, b), (vs, ve) in zip(lines, CLIPS):
    want = real_of(a)
    r = max(want, prev_end + 0.18)
    # garder la vitesse entre deux repères dans une plage raisonnable
    da = a - anchors[-1][0]
    r = max(r, anchors[-1][1] + da/1.7)
    anchors.append((a, r)); starts.append(r)
    prev_end = r + (ve - vs)
last_a, last_r = anchors[-1]
anchors.append((DUR, last_r + real_of(DUR) - real_of(last_a)))
speeds = [(anchors[i+1][0]-anchors[i][0])/(anchors[i+1][1]-anchors[i][1]) for i in range(len(anchors)-1)]
print('durée réelle', round(anchors[-1][1], 2), 's ; vitesses', min(speeds).__round__(2), '->', max(speeds).__round__(2))

# remplace la table de vitesse par les repères calés sur la voix
a = s.index('/* ============ VITESSE PAR PASSAGE ============ */'); b = s.index('/* ============ LECTURE ============ */')
s = s[:a] + '''/* ============ CALAGE SUR LA VOIX ============ */
// [temps montage, temps réel] : chaque sous-titre démarre quand la phrase est dite
const ANCHORS = ''' + '[' + ','.join(f'[{x:.3f},{y:.3f}]' for x, y in anchors) + '''];
const REAL_DUR = ANCHORS[ANCHORS.length - 1][1];
function designAt(r){
  for (let i = 0; i < ANCHORS.length - 1; i++){
    const [d0, r0] = ANCHORS[i], [d1, r1] = ANCHORS[i + 1];
    if (r <= r1) return d0 + (r - r0)*(d1 - d0)/(r1 - r0);
  }
  return DUR;
}

''' + s[b:]

# durée d'apparition des mots = durée réelle de la phrase, exprimée en temps montage
def design_at(r):
    for i in range(len(anchors)-1):
        (d0, r0), (d1, r1) = anchors[i], anchors[i+1]
        if r <= r1: return d0 + (r - r0)*(d1 - d0)/(r1 - r0)
    return DUR
idx = [0]
def fix_d(m):
    i = idx[0]; idx[0] += 1
    if i >= len(CLIPS): return m.group(0)
    a = float(m.group(1)); r = starts[i]; dur = CLIPS[i][1] - CLIPS[i][0]
    d = max(.3, design_at(r + dur*.92) - a)
    return f"{{a:{m.group(1)}, b:{m.group(2)}, d:{d:.2f}, text:"
la = s.index('const LINES = ['); lb = s.index('];', la)
s = s[:la] + re.sub(r"\{a:\s*([0-9.]+),\s*b:\s*([0-9.]+),\s*d:\s*([0-9.]+),\s*text:", fix_d, s[la:lb]) + s[lb:]
open(html, 'w', encoding='utf-8').write(s)

# piste audio : chaque phrase posée à son instant
total = anchors[-1][1]
inputs, parts = ['-i', voice], []
for i, ((vs, ve), r) in enumerate(zip(CLIPS, starts)):
    st, en = max(0, vs - .04), ve + .12
    parts.append(f"[0:a]atrim={st:.3f}:{en:.3f},asetpts=PTS-STARTPTS,afade=t=out:st={en-st-.06:.3f}:d=0.06,adelay={int(r*1000)}|{int(r*1000)}[c{i}]")
fc = ';'.join(parts) + ';' + ''.join(f'[c{i}]' for i in range(len(CLIPS))) + f'amix=inputs={len(CLIPS)}:normalize=0,apad,atrim=0:{total:.3f}[out]'
subprocess.run([FF, '-y', '-loglevel', 'error', *inputs, '-filter_complex', fc, '-map', '[out]', '-ar', '44100', '-ac', '2', out_wav], check=True)
print('ok', out_wav, [round(x, 2) for x in starts])
