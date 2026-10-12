# Pubs Wibzo — secteur beauté (4 pubs, sans visage)

Créées le 12.10.2026. Plan et hooks : voir `../../prospection/README.md` et `../../prospection/scripts-videos.md`.

## Fichiers à publier

Vidéos (14,9 s, musique originale, pas de voix) :
- `Wibzo_beaute_meme-talent_9x16.mp4` / `_4x5.mp4` — hook « Même talent. Même quartier. Une seule a un site. »
- `Wibzo_beaute_jai-cherche_9x16.mp4` / `_4x5.mp4` — hook « J'ai cherché « onglerie Payerne » sur Google. »

Images :
- Carrousel (4 cartes 1080×1080, dans cet ordre) : `Wibzo_beaute_carrousel_1-coiffure.png`, `_2-onglerie.png`, `_3-barbier.png`, `_4-offre.png`
- Visuel texte (1080×1350) : `Wibzo_beaute_visuel-texte_4x5.png`

## Règles respectées
- Aucun visage, aucune voix.
- Salons fictifs : Salon Mélanie, Studio Nacre, Barber Le 21, avec la mention « Exemple de maquette ».
- Fausses fiches et résultats de recherche : noms et notes floutés, aucune note ni aucun avis inventé.
- Pas de numéro à l'écran (le bouton WhatsApp de la pub fait le lien) : le choix 076 757 43 93 / 079 322 77 02 n'est pas encore tranché.
- Texte dans la zone visible (ni dans les 14 % du haut, ni dans les 35 % du bas pour le format 9:16).

## Points à vérifier avant de lancer
- [ ] La vidéo 2 dit « J'ai cherché sur Google » mais montre une recherche stylisée (pas une vraie capture Google). Option plus authentique : enregistrer ton écran avec une vraie recherche et flouter les noms.
- [ ] La maquette montre « Réservation en ligne » : être sûr de pouvoir la livrer (Cal.com ou autre).
- [ ] « Prêt en 24 h » : le site Wibzo dit « en général 1 à 2 jours » pour la mise en ligne. La maquette, elle, en 24 h, c'est OK ?
- [ ] Budget : CLAUDE.md dit encore « pas de publicité payante » et environ 100 CHF max par test.

## Modifier ou refaire
- Animation : `ad.html?v=1` ou `ad.html?v=2` (à ouvrir dans Chrome pour l'aperçu en boucle)
- Images : `images.html?k=c1|c2|c3|c4|img2`
- Après `npm install` :
  - vidéos : `node render.js 1 916`, `node render.js 1 45`, `node render.js 2 916`, `node render.js 2 45`
  - musique : `node music.js 1`, `node music.js 2`
  - assemblage : `node mix.js`
  - images : `node images.js`
