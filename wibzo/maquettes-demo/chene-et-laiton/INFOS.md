# Chêne & Laiton — maquette de démonstration (cuisiniste FICTIF)

Créée le 15.10.2026 pour une vidéo Instagram (Ryan filme son écran), même format que Terre de Saule.
**v2 (15.10.2026, soir)** : demande de Ryan : « l'idée est bonne mais c'est trop mid, plus réel, plusieurs formes ». La cuisine est maintenant en **vraie 3D** (three.js). L'ancienne version 2D est gardée dans `v1/`.
Commerce, adresse (Rue de l'Atelier 4, « Bourg-sur-Broye » = localité inventée), téléphone (026 000 00 05), horaires du showroom et **tous les prix** : **inventés**.
Nom vérifié le 15.10.2026 (recherche web) : aucun cuisiniste « Chêne & Laiton » trouvé.

## Le problème réglé (argument de la vidéo)
Le client n'arrive pas à imaginer sa cuisine et ne connaît pas le prix → allers-retours au showroom.
Sur le site : il **choisit la forme, entre les mesures de sa pièce**, voit sa cuisine **en 3D** (il tourne autour), le **budget s'affiche à chaque choix**, puis il **réserve le métré** avec son projet.

## Ce que fait la 3D
- **6 formes** : linéaire, en L, en U, parallèle (couloir), avec îlot, L + îlot. Chaque forme se construit meuble par meuble (animation).
- **Mesures** : largeur et profondeur de la pièce (curseurs) → la cuisine se recalcule (modules d'environ 60 cm), avec les **cotes en mètres au sol** (bouton « Cotes »).
- **Matières** : 6 façades (dont chêne), 4 plans de travail (chêne, marbre, granit, inox), 3 crédences (zellige blanc / vert / comme le plan), 4 poignées (barre laiton / noire, bouton, sans poignée = gorge).
- **Équipements** : colonnes four + frigo, LED sous les meubles hauts. Évier + robinet, plaque, four, hotte, lave-vaisselle intégré, îlot avec tabourets et suspensions, plantes, planche, fenêtre.
- **Jour / Soir** : le soir, la pièce s'assombrit, les LED et les suspensions s'allument.
- Glisser à la souris pour tourner ; après 6 s sans toucher, la vue bouge doucement toute seule.
- « Inspirations » : 4 projets dont les images sont **rendues par la 3D elle-même** ; « Ouvrir en 3D » les charge.
- Aucune photo : tout est dessiné par le code (bois, marbre, granit, inox, zellige, parquet).
- Besoin d'internet (three.js est chargé depuis jsdelivr, version 0.160.0).

## Prix FICTIFS (démo)
Par mètre de meubles : 1'450.– + meubles hauts 520.–/m. Îlot +2'400.–, colonnes +3'900.–, LED +690.–, pose 1'900.–.
Suppléments par mètre : façades (sauge/encre 160, argile 190, chêne 520, graphite 110), plan (chêne 380, marbre 1'100, granit 820, inox 690), crédence (140 / 160 / 300), poignées (70 / 45 / 55 / 130). Fourchette affichée : −6 % / +8 %.

## Direction artistique
- Ambiance : atelier haut de gamme, fiche technique d'architecte. Fond sombre (moins de blanc cramé quand on filme l'écran).
- Palette : charbon #141210 · plâtre #E8E1D6 · laiton #C9A45B · encre claire #F0EAE0.
- Typos : Archivo large (titres) · Hanken Grotesk (texte) · IBM Plex Mono (étiquettes, cotes).

## Conseils pour filmer
- Chrome plein écran (F11), zoom 100 %. **Luminosité de l'écran ~60 %.** Recharger (F5) juste avant : la cuisine se construit meuble par meuble.
- Ordre conseillé (≈ 15–20 s) :
  1. Le chargement (la cuisine pousse, la caméra arrive)
  2. Forme : En L → **L + îlot** (l'îlot et les tabourets apparaissent)
  3. Glisser le curseur **Largeur** (la cuisine s'allonge, les cotes changent)
  4. Façades : Bleu encre → Chêne ; Plan : Marbre
  5. Tourner la vue à la souris
  6. **Soir** (LED + suspensions)
  7. « Réserver le métré » → jour → heure → Confirmer (tampon)
- Texte possible : CLIENT : « Mes clients peuvent voir leur cuisine avant de l'acheter ? » / MOI : « En 3D, à leurs mesures 👀 »

## Mode vidéo (ajouté le 15.10.2026, soir)
- Bouton **« Vidéo »** sur la 3D (ou touche **V**) : plein écran + mode tournage (image plus sombre pour la caméra) + décompte 3-2-1 + démo automatique.
- Démo (après le décompte) : 0–15 s la 3D (construction → L + îlot → largeur 5,40 m → bleu encre → chêne → marbre → la caméra tourne → Soir), puis **15–20,5 s la page descend doucement jusqu'en bas** (inspirations, showroom, « Exemple fictif · maquette Wibzo »).
- Touches : **V** relancer · **T** mode tournage on/off · **Échap** sortir.

## Mode vidéo v3 (15.10.2026, nuit) : refait pour mieux rendre à la caméra
Problème vu sur le 1er Reel (`reels-organiques/chene-et-laiton/`) : site en format large filmé en vertical → il ne prenait qu'une bande au milieu, texte illisible, section claire cramée, 3D délavée.
- En mode vidéo (touche **V**), le site devient une **colonne verticale 9:16 au centre**, fond noir autour. Tailles en vh : même rendu sur tous les écrans.
- 3D en grand, en-tête caché (le haut est pris par le texte du Reel), seulement 4 réglages visibles (forme, largeur, façades, plan), **prix en gros** + bouton.
- Chaque réglage qui change **s'allume en laiton** une seconde.
- Pièce plus sombre, images « Inspirations » refaites en sombre, plus aucune section blanche.
- **Filmer** : téléphone en vertical, assez près pour que la colonne remplisse l'image (un peu de noir en haut et en bas, ça laisse la place aux textes). Bloquer l'exposition (iPhone : appui long sur l'écran → « Verrouillage AE/AF », puis glisser le soleil un peu vers le bas).

## Correctif 15.10.2026 (nuit)
- Bug signalé par Ryan : en démo, la cuisine « se construisait 2 fois d'affilée » (passage En L → L + îlot = toute la cuisine repoussait).
- Corrigé : quand on change de forme, seuls les meubles nouveaux ou modifiés poussent (îlot, tabourets, côté gauche) ; les meubles identiques restent en place.
