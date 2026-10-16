# AFC Boutique — Payerne (maquette Wibzo)

Demande : message WhatsApp du 16.10.2026, 09:29 (+41 76 583 17 69). Réponse à 09:30 : « Bonjour vous pouvez envoyer met pour le moment je pense que ferai pas suite ».
Maquette créée le 16.10.2026.

## Infos vérifiées (source + date)
- **Fiche Google Maps** « AFC BOUTIQUE » (lue le 16.10.2026) : Magasin de vêtements, Grand-Rue 58, 1530 Payerne, 076 583 17 69. Note 5,0 (1 avis, sans texte, de « Lami Beko » ; réponse du propriétaire « Merci beaucoup »). Pas de site.
  - Horaires : lundi 13:15–18:30 · mardi–vendredi 09:00–12:00 et 13:15–18:30 · samedi 09:00–16:00 · dimanche fermé.
  - Près du site de l'Abbatiale (carte Google).
- **Photos** : celles de la fiche Google, publiées par la boutique (« Photos du propriétaire », septembre 2026).
  - `img/vitrine-nuit.jpg` : la vitrine le soir (enseigne « AFC Boutique », déco d'automne).
  - `img/vitrine-jour.jpg` : la vitrine en journée.
  - Une 3e image (un apéro avec « AFC BOUTIQUE » et « PAYERNE », sûrement une story Instagram) n'est pas utilisée.
- **Pas trouvé** : search.ch, Instagram, Facebook, registre du commerce. Le nom du ou de la gérant·e est inconnu.

## Ce qui vient seulement des photos (à confirmer avec la boutique)
- Les rayons « Femme, Enfant (fille et garçon), Chaussures, Accessoires (sacs, bijoux) » sont déduits de ce qu'on voit en vitrine. Pas de rayon homme ni bébé affiché, car pas vérifié.
- Les 8 points de la vitrine décrivent seulement ce qu'on voit sur la photo. Aucun prix, aucune marque, aucune taille dispo.
- Rien n'est promis sur la mise de côté d'un article ou les échanges : à demander.

## Direction artistique
- La façade de la boutique : bandeau noir + vitrine éclairée. Crème chaud, encre presque noire, rouille des feuilles d'automne de la vitrine.
- Typos : Bodoni Moda (titres, look magazine de mode, logo « AFC » en lettres creuses comme l'enseigne) · Hanken Grotesk (texte).
- Signature : **la vitrine à toucher**. On clique sur les points de la photo pour voir un vêtement de plus près. Sur téléphone, on glisse le doigt pour longer la vitrine. Le bouton « Demander ma taille » remplit le formulaire.
- Formulaire en forme d'**étiquette de vêtement** (avec le trou) : article, pour qui, taille → message tout prêt sur le WhatsApp de la boutique.
- Badge « Ouvert maintenant / Fermé » calculé avec ses horaires (pause de midi comprise).

## Le problème réglé
Sa réponse est tiède (« je pense que je ferai pas suite »). La maquette ne parle donc pas d'« être trouvé sur Google ». Elle montre un vrai usage pour un magasin de vêtements : les gens voient la vitrine depuis chez eux et **demandent leur taille sur WhatsApp avant de se déplacer**. Ça amène des clientes en boutique.

## Captures
`captures/` : 5 captures mobile (accueil, vitrine avec un point ouvert, rayons, demande de taille, horaires) + 1 capture ordinateur.

## En ligne
https://afc-boutique-wibzo.pages.dev — Cloudflare Pages (compte de Ryan), projet `afc-boutique-wibzo`, 16.10.2026.
Mettre à jour :
- À la main : Workers & Pages → Créer → Pages → téléverser `afc-boutique-en-ligne.zip` (chemins `img/...` corrects).
- Ou par Claude : `npx wrangler pages deploy <dossier avec index.html, style.css, img/> --project-name afc-boutique-wibzo --branch main`.
