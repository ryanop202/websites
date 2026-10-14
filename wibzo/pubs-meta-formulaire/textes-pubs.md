# Textes de pubs à tester (formulaire Meta)

Inspiré de la structure de Site Pro Rapide (4 lignes, peur du concurrent). Ne pas copier leurs phrases mot pour mot.

## Texte A – concurrent
Pas de site internet ?
Le commerce d'à côté en a un.

On crée votre site, vous continuez votre métier.
Maquette gratuite en 24h. Vous payez seulement si elle vous plaît.

Titre : Votre maquette de site gratuite
Bouton : En savoir plus

## Texte B – Google
Vos clients vous cherchent sur Google.
Ils trouvent votre concurrent.

Votre site pro en Suisse romande, on s'occupe de tout.
Maquette gratuite en 24h, sans engagement.

Titre : Votre site pro, créé pour vous
Bouton : En savoir plus

## Visuels à créer (dans l'ordre)
1. Avant / après fiche Google (commerce romand inventé, couleurs Wibzo)
2. Infographie : maquette site de garage sur téléphone + 3 promesses (maquette 24h, payez si ça plaît, basé en Suisse romande)
3. Vidéo selfie de Ryan 8-12 s, avec sous-titres (vrai visage local)
4. Visuel résultat : « Exemple : ce matin, 2 clients ont réservé en ligne. » (mot « Exemple » bien visible : pas encore de vrai résultat, risque LCD)

Déjà existant à réutiliser : pubs-v2/Wibzo_le-concurrent_4x5.mp4 et _9x16.mp4
⚠️ Ces vidéos finissent par « Écrivez MAQUETTE sur WhatsApp » : à refaire (fin + voix) avant de les utiliser avec le formulaire Meta.

## Affiches prêtes (14.10.2026) → `visuels/`
- `Wibzo_A-concurrent_4x5.png` / `_9x16.png` : avec le **texte A** (sombre, « Pas de site ? Le commerce d'à côté en a un. », 3 maquettes, maquette gratuite en 24 h).
- `Wibzo_B-google_4x5.png` / `_9x16.png` : avec le **texte B** (clair, « Vos clients vous cherchent sur Google », avant/après fiche Google → site, reçu 0 CHF). = visuel n°1 avant/après.
- Changements par rapport à pubs-v2 : plus de bouton WhatsApp ni de numéro (→ « Demandez votre maquette ↓ », vers le bouton Meta), moins de texte, ajout « Payez seulement si elle vous plaît » + « Suisse romande », format 9:16 en plus.
- Dans le Gestionnaire : 4:5 pour le fil, 9:16 pour Stories/Reels (« Personnaliser les médias selon le placement »).
- Refaire : `cd pubs-v2` puis `node affiches-v3.js` (source : `pubs-v2/affiches-v3.html`).
- Les anciennes affiches `pubs-v2/Wibzo_affiche_*.png` (WhatsApp) ne sont plus à utiliser.

## Quel visuel marche le mieux chez Site Pro Rapide (vérifié 14.10.2026)
Couverture Meta, même texte « concurrents », toutes démarrées le 11 juin 2026 :
- Infographie SANS personne (maquette site plombier sur écran + téléphone, 3 promesses, gros bouton orange), en 3 formats (carré, vertical, horizontal) : **147 081**
- Vidéo selfie d'un artisan dans son atelier, 8 s, sans sous-titres visibles : **50 333**
- Photo femme e-commerce + ordinateur : 11 038
- Photo homme « site lancé en 14 jours » : 10 385
- 2 autres vidéos selfie : ~4 900 chacune
→ Le gagnant n'a personne dessus. Une seule vidéo avec une personne marche bien (2e), les autres non.
→ Priorité Wibzo : une **infographie** (maquette de site de garage/salon sur écran + téléphone, 3 promesses, gros bouton), en 1:1, 4:5 et 9:16. Puis 1 vidéo selfie de Ryan de 8 s.

## Records du domaine (14.10.2026)
Voir `records-pubs-domaine.md` : meilleure image = Ugo (prix 500€ + téléphone, 1,57 M), meilleure vidéo avec personne = témoignage artisan local.fr 11 s (352 k), meilleure sans personne = animation fiche Google Simplébo 13 s (45 k).

## Affiche C – prix (14.10.2026) → `visuels/Wibzo_C-prix_1x1.png` / `_4x5.png` / `_9x16.png`
Structure de l'image record Ugo Studio (1,57 M personnes) aux couleurs Wibzo : haut clair texturé, téléphone « Garage Mercier » (exemple de maquette) coupé à gauche, « votre site internet pour seulement 500 CHF », badge « Basé en Suisse romande », bas noir « puis 25 CHF / mois » + « Hébergement, nom de domaine .ch et petites modifications inclus » + « ✓ Vous payez seulement si la maquette vous plaît », bouton « Maquette gratuite en 24 h ↓ ».
⚠️ Avant de lancer : confirmer que 500 CHF et 25 CHF/mois sont des prix FIXES (wibzo.ch dit « ~500 CHF » / « ~25 CHF/mois »). Une pub avec un prix exact engage (LCD). Mettre wibzo.ch au même prix.
Refaire seulement celle-ci : `cd pubs-v2` puis `node affiches-v3.js c`.
