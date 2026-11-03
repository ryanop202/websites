# Bruitages du Reel paysagiste (temps montage de video.html).
# Lu par : python ../outils-reel-anime/sfx.py video.html bruitages.wav sfx_moments.py
# Passage 16.0-23.1 coupé (V9) : rien n'est placé dedans.

# --- chantier de Dumont : moteur de la mini-pelle, la terre, le téléphone qui vibre
E += [(0.0, engine(rdur(0, 6.0)), .045)]                     # accroche, jusqu'au départ vers Marc
E += [(12.5, engine(rdur(12.5, 16.0) + .3), .045)]           # retour dans la cabine
for d in [1.1, 13.1]: E.append((d, thud(), .10))           # le godet mord la terre
for d in [3.35, 15.35]: E.append((d, thud(), .16))         # la terre tombe sur le tas
E += [(.25, buzz(rdur(.25, 5.3)), .055)]                      # ça vibre dans sa poche… il n'entend rien
E += [(5.3, noise_sweep(rdur(5.3, 6.4), 2400, 500), .26)]    # on remonte le fil jusqu'à Marc

# --- chez Marc : le matin, sa recherche, l'appel
for k, d in enumerate([6.6, 7.0, 7.25, 9.6]): E.append((d, bird(), .07 if k % 2 else .09))
for k in range(6): E.append((7.88 + k*.08, click(), .18))   # il tape « paysagiste »
E += [(11.0, click(), .35), (11.25, ringback(rdur(11.25, 14.9)), .03)]
E += [(11.35, noise_sweep(rdur(11.35, 12.75), 500, 2400), .28)]  # le fil file jusqu'à la poche
E += [(12.2, buzz(rdur(12.2, 14.9)), .055)]
E += [(14.9, beep(), .16), (15.1, low_bloop(), .22)]         # messagerie, appel manqué

# --- le concurrent : son site, 40 secondes, envoyé
E += [(23.1, noise_sweep(rdur(23.1, 24.1), 900, 2600), .24)]  # retour chez Marc
for d in [25.0, 25.75, 26.35, 27.75]: E.append((d, click(), .33))
for d in [26.75, 27.0, 27.25]: E.append((d, pop(), .12))     # les 3 photos
k = 0
while 25.1 + k*.25 < 27.95: E.append((25.1 + k*.25, tick(), .14)); k += 1   # le chrono
E += [(27.9, chirp(), .18)]
E += [(28.4, noise_sweep(rdur(28.4, 29.7), 500, 2800, 'rise'), .28)]  # la demande part, en vert
E += [(29.0, engine(rdur(29.0, 33.3), f0=46, rough=.6, fade=.3), .03)]  # plaque vibrante du concurrent
E += [(30.9, ding(), .22), (31.5, ding(), .16)]               # nouvelle demande, visite confirmée

# --- midi : il voit l'appel manqué, il rappelle, trop tard
E += [(33.3, noise_sweep(rdur(33.3, 34.3), 2600, 700, 'fall'), .22)]
E += [(33.85, rustle(.35), .08), (34.4, low_bloop(), .2)]
E += [(35.1, ringback(rdur(35.1, 38.05)), .035)]
E += [(35.6, noise_sweep(rdur(35.6, 37.0), 600, 2200), .26)]
E += [(37.3, buzz(rdur(37.3, 38.05)), .10), (38.05, click(), .3), (38.12, low_bloop(), .24)]

# --- phrase à retenir
E += [(39.25, impact(), .24), (39.8, noise_sweep(.3, 1500, 4000, 'rise'), .12)]
E += [(40.55, impact(), .30), (40.55, shimmer(), .12)]

# --- l'offre : mots qui claquent, commentaire, tampon, logo
E += [(42.15, impact(), .2), (42.8, noise_sweep(.25, 800, 2400, 'rise'), .14), (43.0, impact(), .34)]
E += [(43.4, pop(), .14)]
for k in range(8): E.append((43.55 + k*.05, click(), .2))   # « MAQUETTE » tapé
E += [(44.05, pop(), .16)]                                    # le cœur
E += [(45.0, impact(), .38), (45.0, shimmer(), .1)]           # tampon GRATUITE
E += [(45.35, tone(.8, [(784, .4), (1568, .25)], .2), .2)]    # wibzo.ch
