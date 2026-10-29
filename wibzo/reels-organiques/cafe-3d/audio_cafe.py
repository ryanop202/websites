# Voix calée + bruitages + mix final (volume Instagram) pour le Reel café.
# Usage : python audio_cafe.py   ->  voix-calee.wav, bruitages.wav, mix-final.wav
import math, random, wave, array, subprocess, imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()

# même table que ANCHORS dans index.html : [temps montage, temps réel]
ANCHORS = [(0, 0), (1.0, 1.4), (2.7, 5.2), (4.15, 7.4), (4.9, 9.0), (5.9, 11.6), (8.5, 15.4), (10, 17.6)]
LOOP = ANCHORS[-1][1]

def _tangents():
    n = len(ANCHORS)
    m = [(ANCHORS[k+1][1] - ANCHORS[k][1]) / (ANCHORS[k+1][0] - ANCHORS[k][0]) for k in range(n - 1)]
    t = [m[0]] + [(m[k-1] + m[k]) / 2 for k in range(1, n - 1)] + [m[-1]]
    for k in range(n - 1):
        a, b = t[k] / m[k], t[k+1] / m[k]
        h = a*a + b*b
        if h > 9:
            r = 3 / math.sqrt(h); t[k] = r*a*m[k]; t[k+1] = r*b*m[k]
    return t
TAN = _tangents()

def real(d):
    k = 0
    while k < len(ANCHORS) - 2 and d > ANCHORS[k+1][0]: k += 1
    (x0, y0), (x1, y1) = ANCHORS[k], ANCHORS[k+1]
    h = x1 - x0; u = (d - x0) / h
    return (2*u**3 - 3*u**2 + 1)*y0 + (u**3 - 2*u**2 + u)*h*TAN[k] + (-2*u**3 + 3*u**2)*y1 + (u**3 - u**2)*h*TAN[k+1]

# ---------- voix : (début, fin) de chaque phrase dans voix-noah.mp3 -> instant réel ----------
CLIPS = [
    ((0.00, 0.45), 1.45),    # Midi.
    ((0.90, 1.81), 2.30),    # Ton téléphone sonne…
    ((2.17, 3.49), 3.50),    # mais t'as les mains pleines.
    ((3.95, 5.78), 5.20),    # Et ces clients-là, ils partent chez le concurrent.
    ((6.19, 7.69), 7.45),    # Et si tes clients commandaient tout seuls ?
    ((7.98, 10.34), 9.05),   # Avec ton site, ils commandent et réservent en ligne.
    ((10.58, 11.70), 11.60), # Toi, tu restes tranquille.
    ((12.06, 12.48), 15.55), # Wibzo.
    ((12.83, 13.80), 16.15), # Ta maquette est offerte.
]
parts = []
for i, ((vs, ve), r) in enumerate(CLIPS):
    st, en = max(0, vs - .04), ve + .12
    parts.append(f"[0:a]atrim={st:.3f}:{en:.3f},asetpts=PTS-STARTPTS,afade=t=out:st={en-st-.06:.3f}:d=0.06,adelay={int(r*1000)}|{int(r*1000)}[c{i}]")
fc = ';'.join(parts) + ';' + ''.join(f'[c{i}]' for i in range(len(CLIPS))) + f'amix=inputs={len(CLIPS)}:normalize=0,apad,atrim=0:{LOOP:.3f}[out]'
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', 'voix-noah.mp3', '-filter_complex', fc, '-map', '[out]', '-ar', '44100', '-ac', '2', 'voix-calee.wav'], check=True)

# ---------- bruitages synthétisés ----------
SR = 44100
N = int(LOOP*SR)
buf = [0.0]*N
random.seed(7)

def add(t0, samples, gain):
    i0 = int(t0*SR)
    for i, v in enumerate(samples):
        j = i0 + i
        if 0 <= j < N: buf[j] += v*gain

def tone(dur, freqs, decay, attack=.004):
    n = int(dur*SR)
    return [sum(math.sin(2*math.pi*f*(i/SR))*w for f, w in freqs)*min(1, (i/SR)/attack)*math.exp(-(i/SR)/decay) for i in range(n)]

def noise_sweep(dur, f0, f1, shape='bell'):   # whoosh
    n = int(dur*SR); out = []; lp = 0; lp2 = 0
    for i in range(n):
        p = i/n
        f = f0*(f1/f0)**p
        a = 1 - math.exp(-2*math.pi*f/SR)
        lp += a*(random.uniform(-1, 1) - lp); lp2 += a*(lp - lp2)
        e = math.sin(math.pi*p)**1.5 if shape == 'bell' else (p**2 if shape == 'rise' else (1-p)**2)
        out.append((lp - lp2*.6)*e*3)
    return out

def ring(dur):        # sonnerie de téléphone fixe (trille)
    n = int(dur*SR); out = []
    for i in range(n):
        t = i/SR
        trill = 1 if (t*25) % 1 < .5 else .25
        x = .6*math.sin(2*math.pi*1150*t) + .4*math.sin(2*math.pi*1450*t)
        out.append(x*trill*min(1, t/.01)*min(1, (dur - t)/.03))
    return out

def pop():   return tone(.12, [(880, .5), (1320, .25)], .03, .002)
def ding():  return tone(.9, [(1318.5, .6), (1975.5, .35), (2637, .12)], .22)
def shimmer(): return tone(1.4, [(1046.5, .3), (1568, .25), (2093, .2), (3136, .1)], .45, .01)
def impact():
    n = int(1.1*SR); out = []; lp = 0
    for i in range(n):
        t = i/SR
        lp += .08*(random.uniform(-1, 1) - lp)
        out.append(math.sin(2*math.pi*(52 + 40*math.exp(-t/.05))*t)*math.exp(-t/.28)*1.2 + lp*math.exp(-t/.06)*2.5)
    return out
def vroom(dur):       # petit scooter qui part
    n = int(dur*SR); out = []; ph = 0
    for i in range(n):
        p = i/n
        ph += 2*math.pi*(70 + 90*p)/SR
        x = math.tanh(2.2*math.sin(ph) + .6*math.sin(2.03*ph))
        out.append(x*math.sin(math.pi*p)**1.2)
    return out

E = []   # (temps montage, son, gain)
E += [(0.15, noise_sweep(.9, 400, 2200, 'rise'), .22), (0.85, impact(), .18)]          # le quartier monte
for i in range(7):                                                                        # sonneries + appels manqués
    t = 1.3 + i*.37
    E += [(t - .02, ring(.3), .10), (t + .05, pop(), .16)]
E += [(3.95, noise_sweep(.7, 500, 2600, 'rise'), .26), (4.0, shimmer(), .18), (4.0, impact(), .26)]  # anneau orange
for i in range(7):                                                                        # commandes en ligne
    t = 5.2 + i*.5
    E += [(t - .45, noise_sweep(.45, 900, 2600, 'rise'), .10), (t, ding(), .15)]
for dep in (5.0, 7.0): E.append((dep + 1.4, vroom(1.0), .10))                            # scooters
E += [(8.5, impact(), .30), (8.55, shimmer(), .16)]                                      # logo Wibzo
E += [(9.3, noise_sweep(.8, 2200, 400, 'fall'), .18)]                                    # tout redescend

for d, snd, g in E: add(real(d), snd, g)
peak = max(1e-9, max(abs(v) for v in buf))
scale = min(1.0, .9/peak)
data = array.array('h', (int(max(-1, min(1, v*scale))*32767) for v in buf))
with wave.open('bruitages.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())

# ---------- mix final (volume Instagram) ----------
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', 'voix-calee.wav', '-i', 'bruitages.wav', '-filter_complex',
                '[1:a]volume=0.55,pan=stereo|c0=c0|c1=c0[s];[0:a][s]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,atrim=0:%.3f[a]' % LOOP,
                '-map', '[a]', '-ar', '44100', 'mix-final.wav'], check=True)
print('ok  durée', LOOP, 's,', len(E), 'bruitages')
