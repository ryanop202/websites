# Pubs Wibzo v2 — tous commerces, Suisse romande (sans visage)

Créées le 12.10.2026. Remplacent les pubs « beauté » (supprimées à la demande de Ryan, elles restent dans l'historique git).

## Décisions
- Cible : tous les commerces et indépendants de Suisse romande (les maquettes montrent plusieurs métiers).
- Message principal : **maquette gratuite en moins de 24 h** (le « 24 h » en très grand).
- Vouvoiement, marque Wibzo, WhatsApp 076 757 43 93, « Toute la Suisse romande ».
- Photos des maquettes : générées par IA (Higgsfield, modèle Z Image, plan gratuit), sans personne, sans enseigne lisible. Commerces 100 % fictifs, marqués « Exemple de maquette ».

## Fichiers à publier

Vidéos (14,9 s, voix Théo d'ElevenLabs + musique originale qui baisse sous la voix, texte + téléphone visibles dès la 1re image) :
- Voix vidéo 1 : « Un site, ça vous tente… mais vous avez peur de payer pour rien ? Je crée gratuitement la maquette de votre site. Elle vous plaît ? On continue. Sinon, on en reste là. Et tout ça, en moins de vingt-quatre heures. Écrivez « maquette » sur WhatsApp pour recevoir la vôtre ! »
- Voix vidéo 2 : « Pendant que vous lisez ça, votre concurrent prend vos clients. Lui, il a un site : le client réserve en deux clics. Vous ? Juste une fiche Google. Il va voir ailleurs. Je crée la maquette de votre site gratuitement, en moins de vingt-quatre heures. Écrivez « maquette » sur WhatsApp pour recevoir la vôtre ! » (dernière phrase générée à part et collée, voix accélérée de 9 %)
- Fichiers voix : `audio/voix_v1.mp3`, `audio/voix_v2.mp3`. Calage animation/musique sur la voix : `out/warp_vN.json` (copie dans `calage_vN.json`).
- `Wibzo_voir-avant-de-payer_9x16.mp4` / `_4x5.mp4` — problème « Un site vous tente… mais peur de payer pour rien ? » (tampon CHF ???) → « Je crée GRATUITEMENT la maquette de votre… » + les métiers défilent (salon, garage, boulangerie, atelier, restaurant) → « Elle vous plaît ? On continue. Sinon, on en reste là. » → compteur 24 H → « Écrivez « MAQUETTE » sur WhatsApp ».
- `Wibzo_le-concurrent_9x16.mp4` / `_4x5.mp4` — hook « Pendant que vous lisez ça, votre concurrent prend vos clients. » (réservations qui tombent chez lui) → « Lui, il a un site. Le client réserve en 2 clics. » → « Vous ? Juste une fiche Google. Il va voir ailleurs. » → compteur 24 H → « Écrivez « MAQUETTE » sur WhatsApp ».

Affiches (1080 × 1350, fil d'actualité) :
- `Wibzo_affiche_pas-de-site_4x5.png` — problème « Pas de site ? Vos clients vont chez le concurrent. » → « La solution : MAQUETTE GRATUITE de votre site en 24 H ».
- `Wibzo_affiche_peur-de-payer_4x5.png` — problème « Peur de payer un site pour rien ? Voyez-le d'abord. » → tampon MAQUETTE GRATUITE, prête en moins de 24 H.
- Bas des 2 affiches : « Écrivez MAQUETTE au 076 757 43 93 ».

Dans le Gestionnaire de publicités : 1 pub par vidéo avec les 2 formats (« Personnaliser les médias selon le placement » : 9:16 pour Stories/Reels, 4:5 pour le fil).

## Texte sous les pubs (commun)

> Vous avez un commerce en Suisse romande mais pas encore de site ?
> Je vous prépare **gratuitement** la maquette de votre site, **en moins de 24 h**. Rien à préparer de votre côté.
> Elle vous plaît ? On continue. Sinon, on en reste là.
> 👉 Écrivez « MAQUETTE » sur WhatsApp au 076 757 43 93 pour recevoir la vôtre.

Titre : **Maquette de site gratuite en moins de 24 h**
Description : Vous payez seulement si elle vous plaît
Bouton : Envoyer un message (WhatsApp)
Message pré-rempli : « MAQUETTE » (même mot-clé que dans les pubs : facile de savoir d'où vient le contact)

## Budget du test (décidé le 12.10.2026)
- 100 CHF sur 8 jours = 12,50 CHF/jour, budget automatique (Advantage+), 1 ensemble de pubs avec les 4 pubs.
- Ciblage large : Suisse romande, 25–60 ans, sans intérêts. Objectif : Messages → WhatsApp.
- Ne rien modifier pendant 7 jours.
- Bilan après 8 jours : ≥ 1 client = rentable, on continue · conversations sans client = corriger la maquette / le prix / la relance · presque aucune conversation = nouveaux hooks/visuels.

## À vérifier avant de lancer
- [ ] ElevenLabs : le compte gratuit a été bloqué pendant la génération (« Unusual activity… Free Tier access has been disabled »). Pour refaire une voix, il faudra un abonnement payant (ou vérifier le compte).
- [ ] Les maquettes montrent réservation en ligne / commande / devis : être sûr de pouvoir les livrer.
- [ ] Tenir le délai « moins de 24 h » pour chaque demande reçue.

## Modifier ou refaire (après `npm install`)
- Aperçu animé : ouvrir `ad.html?v=1` ou `ad.html?v=2` dans Chrome. Maquettes : `kit.js` / `kit.css`.
- Calage : copier `calage_vN.json` dans `out/warp_vN.json` avant le rendu.
- Vidéos : `node render.js 1 916`, `node render.js 1 45`, `node render.js 2 916`, `node render.js 2 45`, puis `node music.js 1`, `node music.js 2`, `node mix.js`
- Affiches : `node affiches.js`
