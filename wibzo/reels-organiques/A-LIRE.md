# Reels organiques Instagram — journée du 13.10.2026

Contenu GÉNÉRIQUE pour gagner des abonnés (pas seulement les patrons) : tutoiement, appel à s'abonner,
sans visage, musique originale (synthèse, autorisée en pub), voix Théo (ElevenLabs) quand elle a pu être générée.

## Programme du 13.10.2026

| Heure | Fichier | Concept |
|---|---|---|
| 09:00 | `../posts-instagram/post-1.png` + `post-2.png` (carrousel) | Présentation + « Comment ça marche » |
| 12:00 | `Reel2_avant-apres-salon_9x16.mp4` (10,8 s, voix) | Avant / après : fiche Google → site |
| 18:00 | `Reel3_3-raisons_9x16.mp4` (12,6 s, voix) | 3 raisons pour lesquelles tu quittes un site |
| 20:30 | `Reel1_speedrun-boulangerie_9x16.mp4` (15,6 s, voix + musique + bruitages) | Site d'une boulangerie en 15 s, « note sur 10 » |

## Textes à copier

**09:00 — carrousel**
> Wibzo crée des sites web pour les commerces et indépendants de Suisse romande 🇨🇭
> Swipe 👉 pour voir comment ça marche. Plus d'infos : lien en bio.
> #suisseromande #siteweb #commercelocal #webdesign

**12:00 — Reel 2**
> Avant / après : d'une fiche Google vide à un vrai site 💈 Tu préfères lequel ?
> Abonne-toi pour la prochaine transformation.
> (Exemple fictif, maquette Wibzo)
> #avantapres #webdesign #siteweb #coiffure #suisseromande

**18:00 — Reel 3**
> 3 raisons pour lesquelles tu quittes un site en quelques secondes 👇
> Laquelle t'énerve le plus ? Dis-le en commentaire.
> #webdesign #siteweb #astuce #ux #suisseromande

**20:30 — Reel 1**
> Site d'une boulangerie en 15 secondes 🥐 Tu lui mets combien sur 10 ?
> Dis-moi en commentaire quel commerce je fais ensuite 👇
> #webdesign #speedrun #boulangerie #siteweb #suisseromande

Pour chaque Reel : ne PAS ajouter de musique Instagram (déjà de la musique originale dedans → mettable en pub plus tard).
Cocher « Partager aussi sur Facebook » si proposé.

## Comment programmer (téléphone, app Instagram)
1. Mettre les fichiers sur le téléphone (WhatsApp à soi-même, Google Drive ou câble USB).
2. Instagram → **+** → Reel (ou Publication pour le carrousel) → choisir le fichier → Suivant.
3. Coller le texte → **Options avancées** (ou « Plus d'options ») → **Programmer** → choisir le 13.10 et l'heure.
4. **Programmer**. Les posts programmés se voient dans Profil → ☰ → Contenu programmé.

Autre option : relier Instagram à la page Facebook (app Facebook → page Wibzo → Paramètres → Comptes liés → Instagram)
→ Claude peut ensuite tout programmer depuis Meta Business Suite sur le PC.

## Fabrication
- Animation : `reels.html?r=1|2|3` (aperçu dans Chrome). Maquettes : `kit.js` / `kit.css` (copie de `../pubs-v2`).
- Rendu : `node render.js 1`, `2`, `3` → `out/video_rN.mp4` (utilise `../pubs-v2/node_modules`).
- Musique : `node music.js 1|2|3` → `out/music_rN.wav`. Mixage : `node mix.js`.
- Voix : `audio/voix_r2.mp3`, `audio/voix_r3.mp3` (Théo, eleven_multilingual_v2). Voix du Reel 1 : ÉCHOUÉE
  (ElevenLabs « Free Tier access has been disabled ») → Reel 1 fait sans voix (format « satisfaisant »).
- Textes voix : R2 « Ce salon de coiffure n'avait qu'une fiche Google. Pas de photos, pas de prix, pas de réservation.
  Voilà ce qu'on en a fait. Avant… Après. [démo] Et là, le client réserve tout seul, sans même appeler. [fin] Abonne-toi pour voir la prochaine transformation. »
  R3 « Trois raisons pour lesquelles tu quittes un site en quelques secondes. Un : il est trop lent. Deux : il est illisible
  sur ton téléphone. Trois : impossible de réserver en ligne. Abonne-toi, je te montre comment éviter ça. »
- Commerces 100 % fictifs (Boulangerie du Bourg, Salon Mélanie, Garage Mercier), photos IA, marqués « Exemple de maquette ».

- Reel 1 refait le 13.10.2026 : voix Théo ajoutée (`audio/voix_r1.mp3` = accroche + noms des étapes + fin, morceaux `r1_*.mp3`),
  écrans « Palette » et « Typo » remplis, textes agrandis, fin raccourcie (16,8 s → 15,6 s, téléphone plus grand).
- Zone visible Instagram (13.10.2026) : les boutons d'Instagram cachent le haut (~270 px) et le bas (~420 px) de la vidéo 1080×1920.
  Garder titres, textes « Exemple fictif » et bouton S'abonner entre y = 270 et y = 1500. Tous les Reels ont été recalés.
- Corrections du 13.10.2026 : son du Reel 2 qui s'arrêtait à 8 s (bug dans `mix.js`, corrigé) ; phrase ajoutée pendant la démo de réservation (R2) ;
  raison 3 du Reel 3 changée (« impossible de réserver en ligne »). Anciennes voix : `audio/voix_r2_v1.mp3`, `audio/voix_r3_v1.mp3`.

## Suivi (à remplir 48 h après chaque post)
| Post | Vues | Durée moy. visionnage | % après 3 s | Partages | Enregistrements | Abonnés gagnés |
|---|---|---|---|---|---|---|
| Carrousel 09:00 | | | — | | | |
| Reel 2 12:00 | | | | | | |
| Reel 3 18:00 | | | | | | |
| Reel 1 20:30 | | | | | | |

## Format « capture d'écran native » (13.10.2026, après-midi) — remplace les Reels de 18:00 et 20:30
Ryan trouvait que les Reels « faisaient trop IA » (fond fluo + grille, petit téléphone au milieu, gros mots en majuscules qui sautent, voix de narrateur).
Nouvelle version : l'écran du téléphone remplit toute la vidéo (comme un enregistrement d'écran), bulles de texte au style Instagram,
sous-titres de la voix, doigt gris pour les taps, plus de grille ni de fond fluo.
- Fichier d'animation : `natif.html?r=13` (3 raisons) et `natif.html?r=11` (speedrun boulangerie). Réglages : `config.js` (11 et 13).
- Rendu : `node render.js 13` / `node render.js 11` → `node music.js 13` / `11` → `node mix.js 13 11` (copie auto dans `../pubs-organiques/2026-10-13_mardi/`).
- Voix : **Noah – Casual & Real** (ElevenLabs, eleven_v4), ton de conversation, tutoiement. `audio/voix_r13.mp3` (accélérée x 1,1), `audio/voix_r11.mp3`.
  Prises brutes : `audio/n3_*.mp3`, `audio/n1_*.mp3`.
- 3 raisons : recherche « garage près de chez moi » → site qui charge sans fin → site d'ordinateur illisible (zoom à 2 doigts) → site sans bouton → bonne version avec bouton.
- Speedrun : aperçu du site fini → tout s'efface → « Go » → 7 étapes avec chrono → « Terminé » → note sur 10 / quel commerce après.
- Les anciennes versions restent ici : `Reel1_speedrun-boulangerie_9x16.mp4`, `Reel3_3-raisons_9x16.mp4`.
- v2 « propre » (13.10.2026, même jour) : Ryan trouvait la v1 pas propre (bulles + sous-titres + pastille par-dessus le site).
  Maintenant : fond sombre uni, UNE zone de texte en haut (petit libellé gris + phrase dite en gros), écran ENTIER en dessous (on voit le bas, 4 coins arrondis), rien par-dessus l'écran.
- Speedrun v2 (13.10.2026) : Ryan trouvait nul le jargon de graphiste (« la typo », « le tampon », « les couleurs »). Nouvelle voix, 5 étapes que le client comprend :
  le nom · une belle photo · le bouton pour commander · ce qui sort du four · les horaires. Plus d'écran « couleurs ». 13,2 s. → Ne plus parler de typo/palette dans les Reels.
- v3 (13.10.2026, « mets-toi à la place de la personne qui regarde ») :
  · 18:00 devient un POV : « Tu cherches un garage. Premier site… ça charge… Deuxième : faut zoomer… Troisième… et le bouton pour réserver ? Y en a pas.
    Alors que ça : un bouton, deux clics… et c'est réservé. Et ton garage, il est dans quelle catégorie ? » → fin = vraie démo de réservation (C'est réservé ✓)
    + question qui fait commenter (au lieu de « abonne-toi »). Les résultats de recherche sont visibles dès la 1re image. 18,3 s.
    Voix : audio/p13_a.mp3 (x 1,1) → audio/voix_r13.mp3. Ancienne version « 3 trucs » : R-003b_3-raisons-natif_v2-avant-POV.mp4.
  · 20:30 : chrono plus gros (vert), le titre du site s'écrit de gauche à droite. Version précédente : R-001b_speedrun-boulangerie-natif_v2.mp4.
  · Règles retenues : pas de jargon (typo, palette, tampon), 1re image déjà pleine, histoire vécue (POV) plutôt que liste,
    fin avec une récompense visible + une question pour les commentaires.
- 20:30 du 13.10.2026 : Ryan n'aimait pas du tout le concept speedrun → remplacé par **« Devine le commerce »** (`natif.html?r=15`, config 15, 19 s) :
  détail zoomé + flou d'une vraie maquette (barbier Maison Faucon / café Tiercelin / institut Atelier Sève), compte à rebours 3-2-1, réponse = site entier,
  fin « T'en as eu combien sur 3 ? Dis-le en commentaire ». Voix audio/voix_r15.mp3 (Noah) découpée et espacée par mix.js (config.js → seg).
  Les speedruns (R-001b, et R-006 barbier de mercredi) sont à revoir avant d'être publiés.
- 20:30 du 13.10.2026 (suite) : Ryan trouve aussi le quiz nul et veut TESTER DES FORMATS VRAIMENT DIFFÉRENTS (pas des variantes) pour voir ce qui marche.
  Pas de boulangerie (peu de gens concernés). → **« Conversation coiffeur »** (`natif.html?r=17`, config 17, 17,6 s) : chat façon WhatsApp à 22h
  (« Vous auriez une place demain ? » → rien → « Allô ? » → « Bon… je vais voir ailleurs »), écran verrouillé du coiffeur en « Ne pas déranger »,
  puis site du salon : réservé en 2 clics, et le lendemain 07:30 notification « Nouveau rendez-vous ». Chute : « Ton coiffeur dormait. Son site, non. »
  Voix audio/voix_r17.mp3 (Noah). Le quiz reste ici : R-008_devine-le-commerce_9x16.mp4 (non publié).
  Formats testés le 13.10 : 12:00 pub classique · 18:00 POV enregistrement d'écran · 20:30 conversation + chute.
  · Fin refaite (demande de Ryan) : le coiffeur se réveille à 07:30 avec 6 notifications « Nouveau rendez-vous en ligne » prises pendant la nuit,
    puis son agenda du mercredi complet (« ✓ Journée complète »). Voix : début de audio/c_a.mp3 + nouvelle fin audio/cend_a.mp3 (x 1,08) → audio/voix_r17.mp3. 22,6 s.
    Message à garder : montrer au patron le BÉNÉFICE (plus de clients, journée pleine), pas seulement le problème.
- Mercredi 14.10 20:30 : **« Ton idée → ton site »** (idée de Ryan, `natif.html?r=19`, config 19, 19,9 s). Vise les gens qui veulent lancer un projet :
  note « Mes idées » → chaque idée devient un site (Brillant lavage auto · Léo guitare · Les gâteaux de Lina, tous fictifs) + notification de réservation,
  fin « Ton idée ? » + emplacement « ton site ici · maquette gratuite en 24 h ». Voix audio/voix_r19.mp3 (Noah).
  On montre ce que le site permet (être trouvé, réserver, commander) sans promettre des clients (pas de promesse trompeuse).
  Le speedrun barbier (R-006) est retiré du dossier de mercredi (concept refusé).
  · v2 (même soir, demande de Ryan) : message direct « Il te faut juste un site… et les réservations se font toutes seules » → défilé lavage/guitare/gâteaux
    → écran verrouillé qui se remplit (« pendant que tu dors / que tu bosses / en vacances : les gens réservent », 9 réservations) → « Toi, plus besoin de répondre
    au téléphone » → « Et le mieux ? Ta maquette, je te la fais gratuitement. Écris-moi ton idée. » Voix audio/i2_a.mp3 → audio/voix_r19.mp3. 20 s.
- Mercredi 14.10 20:30 : **« Tape ton nom sur Google »** (script B de `messaging-architecture.md`, `natif.html?r=21`, config 21, 17,4 s).
  Fiche Google vide (pas de prix / horaires / réservation en rouge) → le client fait défiler et réserve chez « Studio Coupe » (fictif) →
  « voilà ce qu'il pourrait voir » : site Salon Mélanie, réservé en 2 clics → conversation Wibzo « Ta maquette, gratuite, en 24 h » + le client envoie MAQUETTE.
  Voix audio/g_a.mp3 → audio/voix_r21.mp3. Le Reel café (R-007, ancien style) est retiré du dossier de mercredi.
- Jeudi 15.10 12:00 = **PUB 3/4 « Toujours gratuite »** (`natif.html?r=23`, config 23, 18,9 s). Idée de Ryan d'après une pub d'opticien
  (« le test est gratuit, toujours gratuit ») — phrase à nous : « Chez Wibzo, la maquette est gratuite. Toujours gratuite. »
  Voix de femme **Clémence – Advertising** (ElevenLabs, eleven_v4), vouvoiement, audio/f_a.mp3 x 1,12 → audio/voix_r23.mp3.
  Fiche Google vide → le client va chez « Studio Coupe » → site Salon Mélanie → carte « Votre maquette 0.– CHF · Toujours gratuite » → 2 choix → carte de fin Wibzo + WhatsApp.
  ⚠️ Version 4:5 (pour la pub Meta) pas encore faite.
  · v3 coiffeur (13.10.2026, Ryan : « le début est trop ennuyant ») : accroche « on montre la fin d'abord » — 07:30, notifications + agenda complet,
    « Ce coiffeur a dormi toute la nuit… et sa journée s'est remplie toute seule. Rembobinons. » → retour en arrière flou vers 22:04 → histoire inchangée.
    Voix : audio/h17.mp3 (x 1,15) + ancienne voix audio/voix_r17_v2.mp3 (x 1,05) → audio/voix_r17.mp3. 26,2 s. Code : r17() = accroche, r17core() = histoire.
- 20:30 du 13.10 (dernière version) : Ryan n'aimait pas la conversation coiffeur → **« Ce coiffeur a des clients toute la journée »**
  (`natif.html?r=25`, config 25, 13 s) : agenda en accéléré 08:00→18:00 + « Appels décrochés : 0 » + « ✓ Journée complète » → « Son secret ? Un site où ses
  clients réservent tout seuls » (réservation en 2 clics) → carte Wibzo « Ta maquette est gratuite · écris MAQUETTE ». Voix audio/k_a.mp3 → audio/voix_r25.mp3.
  La conversation coiffeur (R-009) reste dans l'atelier, non publiée.
- **« Où sont passés tes clients ? »** (13.10.2026 soir, `natif.html?r=27`, config 27, 36,5 s) : style explainer « laptop dans une pièce violette » copié de la vidéo
  de référence de Ryan (TikTok « Claude cooked »). Boule orange 30 → 18 clients, 3 monstres (fiche Google vide −4, téléphone −5, message de 22 h −3), « ailleurs. »,
  site → +12, carte orange « Ta maquette, gratuite ». Script PAS + aversion à la perte + ennemi extérieur, chiffres présentés comme exemple (« Imagine… »).
  Voix de femme **Sara – Warm** (proche de la voix de référence, ~206 Hz), 1 seule version (649 crédits), audio/s27.mp3 x 1,12 → audio/voix_r27.mp3. Créneau pas encore choisi.
  · v2 (même soir) : Ryan trouvait la v1 « moche, ressemble pas du tout ». Refaite en **plein écran** dans `explainer.html` (config 27 → file explainer.html),
    au plus près de la référence : fond gris clair + billes orange brillantes, boule 3D (reflet) qui rebondit, FOND et coule (flaque), yeux + « (soupir) »,
    « ? » en billes + texte en arc, monstres brillants (blob violet « fiche Google vide », téléphone bleu « appel manqué », bulle rose endormie « message de 22 h »)
    qui croquent la boule en Pac-Man avec traînées de vitesse, nuit étoilée + horloge lumineuse + brume + « ailleurs. » en serif italique orange,
    téléphone 3D avec le site + pastilles noires, fin orange + billes blanches + pilule « Écris MAQUETTE » avec étincelles. Même voix (0 crédit en plus).
