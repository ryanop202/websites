# Reels organiques Instagram — journée du 13.10.2026

Contenu GÉNÉRIQUE pour gagner des abonnés (pas seulement les patrons) : tutoiement, appel à s'abonner,
sans visage, musique originale (synthèse, autorisée en pub), voix Théo (ElevenLabs) quand elle a pu être générée.

## Programme du 13.10.2026

| Heure | Fichier | Concept |
|---|---|---|
| 09:00 | `../posts-instagram/post-1.png` + `post-2.png` (carrousel) | Présentation + « Comment ça marche » |
| 12:00 | `Reel2_avant-apres-salon_9x16.mp4` (10,8 s, voix) | Avant / après : fiche Google → site |
| 18:00 | `Reel3_3-raisons_9x16.mp4` (12,6 s, voix) | 3 raisons pour lesquelles tu quittes un site |
| 20:30 | `Reel1_speedrun-boulangerie_9x16.mp4` (14 s, musique + bruitages, sans voix) | Site d'une boulangerie en 15 s, « note sur 10 » |

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
  Voilà ce qu'on en a fait. Avant… Après. Abonne-toi pour voir la prochaine transformation. »
  R3 « Trois raisons pour lesquelles tu quittes un site en quelques secondes. Un : il est trop lent. Deux : il est illisible
  sur ton téléphone. Trois : impossible de trouver le numéro. Abonne-toi, je te montre comment éviter ça. »
- Commerces 100 % fictifs (Boulangerie du Bourg, Salon Mélanie, Garage Mercier), photos IA, marqués « Exemple de maquette ».

## Suivi (à remplir 48 h après chaque post)
| Post | Vues | Durée moy. visionnage | % après 3 s | Partages | Enregistrements | Abonnés gagnés |
|---|---|---|---|---|---|---|
| Carrousel 09:00 | | | — | | | |
| Reel 2 12:00 | | | | | | |
| Reel 3 18:00 | | | | | | |
| Reel 1 20:30 | | | | | | |
