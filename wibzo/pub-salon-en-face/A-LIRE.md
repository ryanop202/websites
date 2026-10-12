# Pub coiffeur « Le salon d'en face » – motion design, sans visage

Créée le 12.10.2026. Remplace la vidéo coiffeur du test (on reste à 6 pubs).

## Fichiers à publier
- `Wibzo_coiffeur_salon-en-face_9x16.mp4` : Reels / Stories (1080 × 1920)
- `Wibzo_coiffeur_salon-en-face_4x5.mp4` : fil Facebook / Instagram (1080 × 1350)
- Durée : 14,9 s (règle : plus de 15 s = exclue des Reels Facebook)

## Contenu
- Voix : Théo (ElevenLabs), texte mot pour mot du script, accélérée de 7 % pour tenir en 14,9 s.
- Musique et bruitages : composés par Claude en code (`music.js`), aucun sample externe → pas de problème de droits.
- Maquette dans la vidéo : « Salon Exemple » (fictif). Aucun nom de vrai salon.
- Texte important dans la zone visible (pas dans les 14 % du haut ni les 35 % du bas).

## Textes Meta (repris du plan)
- Texte : … Vous payez seulement si elle vous plaît. 👉 Écrivez-nous sur WhatsApp : 076 757 43 93. Salons de toute la Suisse romande.
- Titre : Maquette gratuite en 24h pour votre salon
- Description : Payez seulement si elle vous plaît
- Message pré-rempli : « Bonjour ! Je veux une maquette gratuite pour mon salon. »

## Points à vérifier avant de lancer
- [ ] Numéro : la vidéo affiche 076 757 43 93 (comme le site). Le plan mentionne aussi 079 322 77 02 → choisir le bon.
- [ ] La vidéo promet « Fiche Google » et « Réservation en ligne » : être sûr de pouvoir les livrer.

## Modifier la pub
- Animation : `ad.html` (ouvrir dans Chrome pour voir l'aperçu en boucle)
- Refaire la vidéo : `node render.js 916`, `node render.js 45`, `node music.js`, puis `node mix.js`
