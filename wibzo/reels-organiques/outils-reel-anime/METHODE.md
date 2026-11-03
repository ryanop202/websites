# Méthode : Reel animé Wibzo (style « fils lumineux »)

Validé par Ryan le 22.10.2026 avec le Reel **déménageur** (`../demenageur-anim/`).
Inspiration : vidéo TikTok @chronotrade0 (plombier, fils violets, caméra qui suit le fil).

## Le style (à respecter)
- **Pas de visage**, pas de face caméra. Personnages plats, sans traits du visage.
- **Fond sombre** (bleu nuit), lampes en cône de lumière chaude, petit grain, vignettage.
- **Un seul grand décor** : les pièces (lieux) sont posées dans le noir comme sur une carte.
- **Fils lumineux** entre les téléphones (violet = le problème, **vert Wibzo #c6ff3d** = la solution).
- **La caméra suit le fil** d'une pièce à l'autre et dézoome parfois pour montrer toutes les pièces reliées. Pas de fondus enchaînés où deux scènes se superposent : soit on suit le fil, soit on rembobine, soit coupe nette avec un très court passage au noir.
- Le téléphone du client est affiché **en grand à côté de lui**, et les zooms se font sur les moments clés.
- **Sous-titres** mot à mot en bas, mots-clés colorés (violet, rouge, vert).
- Fin : **offre qui claque** (gros mots qui s'écrasent : GRATUITE, 24 H, 0 CHF), puis **logo W.** avec le fil vert qui tombe dans le point.

## L'histoire (structure qui marche)
1. **Accroche** : gros plan sur le téléphone du pro qui vibre, on recule et on le voit occupé. « Ce [métier] vient de perdre un gros client. Et il ne le sait même pas. »
2. **Retour en arrière** : la caméra remonte le fil jusqu'au client. Le client cherche, tombe sur « Pas de site web », appelle, messagerie.
3. **Le concurrent** a un site : formulaire en 30 secondes, et le fil part chez lui.
4. **Il rappelle, trop tard** : vue d'ensemble, puis le client ignore l'appel.
5. **« Maintenant, imagine »** : toute la vidéo se rembobine à toute vitesse, avec un éclair vert.
6. **La même scène avec SON site** : le fil vert arrive dans sa poche.
7. **La nuit** : les demandes arrivent pendant qu'il dort.
8. **Offre** : maquette gratuite, prête en 24 h, tu paies seulement si elle te plaît (pas de prix inventé, cf. CLAUDE.md).
9. **Logo** wibzo.ch.

Choisir un métier où, sans site, **on est obligé d'appeler** et où le client **n'a pas envie d'appeler** (déménageur, carrossier, paysagiste…), avec un **gros montant** en jeu.

## Étapes de travail (dans l'ordre)
1. Proposer la trame et le texte de la voix off → **Ryan valide le texte**.
2. Copier `../demenageur-anim/video.html` dans un nouveau dossier et adapter : décors, personnages, textes du téléphone, sous-titres (`LINES`), étiquettes (`TAGS`).
3. Vérifier **image par image** avec `check.js` (planche de captures et erreurs JS) :
   `node check.js ../NOUVEAU/video.html planche.png 2.0 8.8 14.5 …` (temps « montage » ; préfixe `r` = temps réel, ex. `r12.1`)
4. Aperçu sans voix : `node export.js ../NOUVEAU/video.html apercu.mp4 1 30` → Ryan valide les images.
5. **Voix** : ElevenLabs, voix **Noah - Casual & Real** (`FRY6vOtGqwamgAf39SwP`), modèle `eleven_v4`, **une seule prise** (`generations_count: 1`), texte complet d'un bloc. Écrire les nombres en lettres (« vingt-quatre heures »).
6. Repérer les pauses de la voix :
   `ffmpeg -i voix.mp3 -af silencedetect=noise=-35dB:d=0.18 -f null -`
   Puis remplir `CLIPS` dans `sync_voice.py` (début et fin de chaque phrase, une par sous-titre).
7. Caler la voix : `python sync_voice.py ../NOUVEAU/video.html voix.mp3 voix-calee.wav`
   (garder une copie de `video.html` avant, le script la modifie).
8. Export avec voix : `node export.js ../NOUVEAU/video.html avec-voix.mp4 1 30 voix-calee.wav`
9. Bruitages : adapter la liste `E` dans `sfx.py` (temps « montage »), puis
   `python sfx.py ../NOUVEAU/video.html bruitages.wav`
10. Mix final (volume Instagram) :
    `ffmpeg -i voix-calee.wav -i bruitages.wav -filter_complex "[1:a]volume=0.55,pan=stereo|c0=c0|c1=c0[s];[0:a][s]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map "[a]" mix.wav`
    `ffmpeg -i avec-voix.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest final.mp4`
11. Musique : à ajouter **dans Instagram**, son calme à environ 10-15 %.

## Outils
- `export.js` / `check.js` : Node + `puppeteer-core` (déjà installé ici, sinon `npm install`) + Chrome installé.
- ffmpeg : paquet Python `imageio-ffmpeg` (`py -m pip install --user imageio-ffmpeg`). `check.js` et `export.js` le trouvent tout seuls sur les deux ordinateurs (ou variable `FFMPEG`).
- `video.html` expose `window.renderAt(tempsRéel)`, `window.renderDesign(tempsMontage)` et `window.DUR`. Chaque image est calculée à partir du temps, sans hasard : l'export est donc identique à l'aperçu.

## Pièges déjà rencontrés
- Export : attendre que l'image soit dessinée avant la capture (déjà dans `export.js`), sinon on obtient des images qui « buggent ».
- Fil qui sort à droite d'une scène = il doit rentrer à droite dans la suivante.
- Pas de grand zoom sur un objet en arrière-plan : les mains deviennent des taches énormes.
- Fils (`vector-effect=non-scaling-stroke`) : Chrome compte les pointillés en pixels d'écran → multiplier `stroke-dasharray` par le zoom de la caméra, sinon le fil s'arrête avant son arrivée quand on zoome. Un fil très long en gros plan peut aussi disparaître (lueur trop grande) : le raccourcir.
- Animation qui démarre plus tard (temps négatif) : utiliser un modulo positif, sinon tailles négatives = erreurs.
- Choisir une activité **typique du métier** (pas tondre pour un paysagiste : tout le monde tond) et la montrer dès la 1re image.
- Aperçu en demi-résolution = Ryan trouve la qualité moins bonne : toujours montrer en 1080×1920.

## Mise à jour 23.10.2026 (Reel paysagiste)
- **Voix** : repérer les phrases avec `silencedetect`, les écrire dans `voix-clips.json` (`[[début, fin], ...]`, une par sous-titre), puis :
  `py sync_voice.py ../NOUVEAU/video.html voix.mp3 voix-calee.wav ../NOUVEAU/voix-clips.json`
  Le script lit la table `SPEED` de la page (bloc `VITESSE PAR PASSAGE`). Vitesse `Infinity` = passage coupé (saut net, la phrase suivante démarre aussitôt).
- **Bruitages** : la liste des moments va dans un fichier par vidéo (`sfx_moments.py`), puis :
  `py sfx.py ../NOUVEAU/video.html bruitages.wav ../NOUVEAU/sfx_moments.py`
  Sons dispo en plus : `engine` (moteur / plaque vibrante), `thud`, `bird`, `beep`, `pop`, `rustle`. `rdur(d0, d1)` = durée réelle d'un passage.
- **Volume** : les sons continus (moteur, vibration, sonnerie) doivent rester au moins ~8 dB sous la voix (`volumedetect` par passage). Final : environ -14 LUFS.
- Sans fichier en plus, `sync_voice.py` et `sfx.py` refont le Reel déménageur comme avant.
