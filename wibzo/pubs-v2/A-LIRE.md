# Pubs Wibzo v2 — tous commerces, Suisse romande (sans visage)

Créées le 12.10.2026. Remplacent les pubs « beauté » (supprimées à la demande de Ryan, elles restent dans l'historique git).

## Décisions
- Cible : tous les commerces et indépendants de Suisse romande (les maquettes montrent plusieurs métiers).
- Message principal : **maquette gratuite en moins de 24 h** (le « 24 h » en très grand).
- Vouvoiement, marque Wibzo, WhatsApp 076 757 43 93, « Toute la Suisse romande ».
- Photos des maquettes : générées par IA (Higgsfield, modèle Z Image, plan gratuit), sans personne, sans enseigne lisible. Commerces 100 % fictifs, marqués « Exemple de maquette ».

## Fichiers à publier

Vidéos (14,9 s, musique originale, texte + téléphone visibles dès la 1re image) :
- `Wibzo_voir-avant-de-payer_9x16.mp4` / `_4x5.mp4` — hook « Et si vous voyiez votre site AVANT de payer quoi que ce soit ? » → les métiers défilent (salon, garage, boulangerie, atelier, restaurant) → « Elle vous plaît ? On continue. Sinon, on en reste là. » → compteur 24 H → WhatsApp.
- `Wibzo_le-concurrent_9x16.mp4` / `_4x5.mp4` — hook « Pendant que vous lisez ça, votre concurrent prend vos clients. » (réservations qui tombent chez lui) → « Lui, il a un site. Le client réserve en 2 clics. » → « Vous ? Juste une fiche Google. Il va voir ailleurs. » → compteur 24 H → WhatsApp.

Affiches (1080 × 1350, fil d'actualité) :
- `Wibzo_affiche_clients-tout-seuls_4x5.png` — « Et si demain, vos clients vous trouvaient tout seuls ? »
- `Wibzo_affiche_offre-directe_4x5.png` — « Je crée la maquette de votre site. Gratuite. »

Dans le Gestionnaire de publicités : 1 pub par vidéo avec les 2 formats (« Personnaliser les médias selon le placement » : 9:16 pour Stories/Reels, 4:5 pour le fil).

## Texte sous les pubs (commun)

> Vous avez un commerce en Suisse romande mais pas encore de site ?
> Je vous prépare **gratuitement** la maquette de votre site, **en moins de 24 h**. Rien à préparer de votre côté.
> Elle vous plaît ? On continue. Sinon, on en reste là.
> 👉 Écrivez-nous sur WhatsApp : 076 757 43 93

Titre : **Maquette de site gratuite en moins de 24 h**
Description : Vous payez seulement si elle vous plaît
Bouton : Envoyer un message (WhatsApp)
Message pré-rempli : « Bonjour ! Je veux ma maquette gratuite. »

## À vérifier avant de lancer
- [ ] Budget : CLAUDE.md dit encore « pas de publicité payante » et ~100 CHF max par test.
- [ ] Les maquettes montrent réservation en ligne / commande / devis : être sûr de pouvoir les livrer.
- [ ] Tenir le délai « moins de 24 h » pour chaque demande reçue.

## Modifier ou refaire (après `npm install`)
- Aperçu animé : ouvrir `ad.html?v=1` ou `ad.html?v=2` dans Chrome. Maquettes : `kit.js` / `kit.css`.
- Vidéos : `node render.js 1 916`, `node render.js 1 45`, `node render.js 2 916`, `node render.js 2 45`, puis `node music.js 1`, `node music.js 2`, `node mix.js`
- Affiches : `node affiches.js`
