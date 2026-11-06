# Reel Instagram « apporteur d'affaires » (06.11.2026)

Reel de 13 s (1080 × 1920) pour recruter des apporteurs d'affaires : 250 CHF par entreprise présentée qui signe et paie.
Mot-clé en DM : **PARTENAIRE** → réponse automatique (`reponse-automatique-DM.txt`, à mettre dans Meta Business Suite → Boîte de réception → Automatisations → Mots-clés).

## Fichiers

- `reel-apporteur.mp4` : la vidéo finale (motion design).
- `voix-off.mp3` : voix off ElevenLabs (voix « Thierry », léger accent suisse, modèle eleven_v4).
  Texte : « Deux cent cinquante francs. Juste pour une mise en contact. Tu connais quelqu'un qui aurait besoin d'un configurateur 3D comme ça ? Tu me le présentes, il signe... et toi, tu touches deux cent cinquante francs. Écris PARTENAIRE en message. »
- `motion.html` : l'animation (HTML/CSS/JS, police Archivo). `render(t)` dessine l'image à l'instant t ; les temps sont calés sur la voix.
- `enregistrer-demo.py` : filme la vraie démo (véranda, piscine, pergola) image par image, en vue mobile 1080 × 1920.
- `rendre-motion.py` : rend `motion.html` en 390 images (13 s à 30 i/s).

## Refaire la vidéo

Prérequis : `pip install playwright imageio-ffmpeg` (utilise le Chrome installé, `channel="chrome"`).

1. Servir la démo : dans `configurateurs/carport-demo`, `python -m http.server 8765`.
2. Dans un dossier de travail (hors dépôt, les images sont lourdes) : `python enregistrer-demo.py <dossier>`
   → crée `veranda/`, `piscine/`, `pergola/` (images JPG). La rotation est accélérée à la volée (app.js n'est pas modifié) et Web3Forms est bloqué (pas d'alerte « démo utilisée »).
3. Copier `motion.html`, `rendre-motion.py` et `voix-off.mp3` dans ce dossier, le servir : `python -m http.server 8766`.
4. `python rendre-motion.py keys 0.1,2.4,4.9,9.6` pour vérifier quelques images, puis `python rendre-motion.py all` → `mf/`.
5. Montage (ffmpeg fourni par imageio-ffmpeg) :
   ```
   ffmpeg -framerate 30 -i mf/%05d.jpg -i voix-off.mp3 -filter_complex "[0]scale=out_range=tv,format=yuv420p[v];[1]adelay=100|100,apad,atrim=0:13[a]" -map "[v]" -map "[a]" -t 13 -c:v libx264 -crf 17 -preset slow -c:a aac -b:a 192k -movflags +faststart reel-apporteur.mp4
   ```

Astuce technique : pour une vidéo fluide, `requestAnimationFrame` et `performance.now` sont remplacés par une horloge virtuelle (`__step`) : chaque image est calculée puis capturée, sans saccade même en rendu logiciel.
