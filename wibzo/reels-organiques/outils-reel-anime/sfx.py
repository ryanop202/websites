# Bruitages synthétisés (sans fichier externe), placés sur les moments de l'animation.
# Usage : python sfx.py video.html sortie_sfx.wav
import sys, re, math, random, wave, array
html, out = sys.argv[1:3]
s = open(html, encoding='utf-8').read()
ANCH = [tuple(map(float, p)) for p in re.findall(r"\[([0-9.]+),([0-9.]+)\]", re.search(r"const ANCHORS = \[(.*?)\];", s).group(1))]
def real(d):
    for (d0, r0), (d1, r1) in zip(ANCH, ANCH[1:]):
        if d <= d1: return r0 + (d - d0)*(r1 - r0)/(d1 - d0)
    return ANCH[-1][1]
SR = 44100
N = int((ANCH[-1][1] + .5)*SR)
buf = [0.0]*N
random.seed(7)

def add(t0, samples, gain):
    i0 = int(t0*SR)
    for i, v in enumerate(samples):
        j = i0 + i
        if 0 <= j < N: buf[j] += v*gain

def env(i, n, a=.005, r=.05):
    t = i/SR; T = n/SR
    return min(1, t/a if a else 1) * min(1, (T - t)/r if r else 1)

def buzz(dur):                      # vibration de téléphone
    n = int(dur*SR); out = []
    for i in range(n):
        t = i/SR
        on = 1 if (t % .55) < .38 else 0
        x = math.sin(2*math.pi*170*t) + .5*math.sin(2*math.pi*340*t + .3)
        x = math.tanh(1.6*x)*(.7 + .3*math.sin(2*math.pi*31*t))
        out.append(x*on*env(i, n, .01, .03))
    return out

def noise_sweep(dur, f0, f1, shape='bell'):   # whoosh : bruit filtré qui glisse
    n = int(dur*SR); out = []; lp = 0; lp2 = 0
    for i in range(n):
        p = i/n
        f = f0*(f1/f0)**p
        a = 1 - math.exp(-2*math.pi*f/SR)
        lp += a*(random.uniform(-1, 1) - lp); lp2 += a*(lp - lp2)
        e = math.sin(math.pi*p)**1.5 if shape == 'bell' else (p**2 if shape == 'rise' else (1-p)**2)
        out.append((lp - lp2*.6)*e*3)
    return out

def tone(dur, freqs, decay, attack=.004):
    n = int(dur*SR); out = []
    for i in range(n):
        t = i/SR
        x = sum(math.sin(2*math.pi*f*t)*w for f, w in freqs)
        out.append(x*min(1, t/attack)*math.exp(-t/decay))
    return out

def ding():  return tone(.9, [(1318.5, .6), (1975.5, .35), (2637, .12)], .22)
def click(): return tone(.06, [(2400, .5), (3600, .2)], .012, .001)
def chirp(): # confirmation (envoyé)
    n = int(.35*SR); return [math.sin(2*math.pi*(700*(i/SR) + 1400*(i/SR)**2/.35*.5))*math.exp(-(i/SR)/.12)*min(1, i/80) for i in range(n)]
def impact():
    n = int(1.1*SR); out = []; lp = 0
    for i in range(n):
        t = i/SR
        lp += .08*(random.uniform(-1, 1) - lp)
        out.append(math.sin(2*math.pi*(52 + 40*math.exp(-t/.05))*t)*math.exp(-t/.28)*1.2 + lp*math.exp(-t/.06)*2.5)
    return out
def ringback(dur):
    n = int(dur*SR); return [(math.sin(2*math.pi*440*(i/SR)) + math.sin(2*math.pi*480*(i/SR)))*.5*(1 if (i/SR) % 1.6 < .9 else 0)*env(i, n, .02, .05) for i in range(n)]
def low_bloop():
    n = int(.5*SR); return [math.sin(2*math.pi*(420*math.exp(-(i/SR)*3))*(i/SR))*math.exp(-(i/SR)/.15) for i in range(n)]
def rewind(dur):
    n = int(dur*SR); out = []; lp = 0; ph = 0
    for i in range(n):
        p = i/n
        f = 300 + 2200*p**1.4 + 120*math.sin(2*math.pi*9*p*dur)
        ph += 2*math.pi*f/SR
        lp += .3*(random.uniform(-1, 1) - lp)
        out.append((.35*math.sin(ph) + .6*lp)*min(1, p*8)*(1 - p**6))
    return out
def tick(): return tone(.03, [(3200, .5)], .006, .0005)
def shimmer():
    return tone(1.4, [(1046.5, .3), (1568, .25), (2093, .2), (3136, .1)], .45, .01)

E = []   # (temps montage, son, gain)
# ouverture : vibration, appel manqué
E += [(.25, buzz(4.3), .16), (4.6, low_bloop(), .22)]
# remonter le fil (deux minutes plus tôt)
E += [(8.45, noise_sweep(1.8, 2400, 500), .30)]
# téléphone de Julie : clics, sonnerie, messagerie, envoi
for t in [3.0, 6.95, 7.85, 8.4, 8.95, 9.55]: E.append((12.6 + t, click(), .35))
E += [(12.6 + 3.3, ringback(1.3), .07), (12.6 + 4.6, low_bloop(), .22), (12.6 + 9.7, chirp(), .16)]
# le fil part chez le concurrent, nouvelle demande
E += [(22.45, noise_sweep(1.7, 500, 2600), .30), (24.1, ding(), .20)]
# on prend du recul, il rappelle, ça sonne chez Julie
E += [(26.0, noise_sweep(1.0, 900, 300, 'fall'), .20), (27.0, noise_sweep(1.3, 600, 2000), .24), (28.8 + .3, buzz(1.9), .10)]
# maintenant, imagine : rembobinage puis éclat
E += [(32.0, rewind(1.5), .22), (33.5, shimmer(), .16), (33.5, impact(), .25)]
# site de Martin : clic, envoi, le fil vert file jusqu'à sa poche, ding
E += [(35.9 + .65, click(), .35), (35.9 + .8, chirp(), .16), (35.9 + 1.0, noise_sweep(1.6, 500, 2600), .30), (38.5 + .1, buzz(1.4), .12), (38.65, ding(), .22)]
# la nuit : trois demandes
for h in [.9, 2.3, 3.7]: E += [(41.3 + h - .55, noise_sweep(.55, 800, 2600, 'rise'), .14), (41.3 + h, ding(), .17)]
# l'offre : impacts, compteur, demandes
E += [(47.0 + .95, impact(), .32), (47.0 + 2.8, impact(), .18), (47.0 + 6.25, impact(), .36)]
for k in range(12): E.append((47.0 + 2.05 + k*.055, tick(), .25))
for h in [4.25, 4.6, 4.95]: E.append((47.0 + h, ding(), .12))
# logo : le fil tombe dans le point
E += [(54.65, noise_sweep(.6, 600, 2400, 'rise'), .22), (55.4 + .62, tone(.8, [(784, .4), (1568, .25)], .2), .22)]

for d, snd, g in E: add(real(d), snd, g)
peak = max(1e-9, max(abs(v) for v in buf))
scale = min(1.0, .9/peak)
data = array.array('h', (int(max(-1, min(1, v*scale))*32767) for v in buf))
with wave.open(out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
print('ok', out, 'pic', round(peak, 2), 'échelle', round(scale, 2), len(E), 'sons')
