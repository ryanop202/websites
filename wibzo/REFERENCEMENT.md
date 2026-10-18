# Référencement Google (SEO) Wibzo — plan (18.10.2026)

## Ce que montre Google aujourd'hui (vérifié dans Chrome, 18.10.2026)
- « site:wibzo.ch » → **0 page connue de Google**.
- « wibzo » → wibzo.com (autre entreprise, ancienne) en 1er, puis les Reels Instagram de Wibzo.
- « créer site » → Infomaniak, Wix, Canva, Green, Squarespace, Odoo, Webador… → **impossible à battre** (géants, pas des clients pour Wibzo de toute façon : ce sont des gens qui veulent le faire eux-mêmes).
- « création site internet Payerne » → Weblook, Basic web, agence-web-payerne.ch, Studio Riviera, Tonio, hiweb, Nickel studio, L'agence point com, xcreatorweb + pubs.
- « création site web Estavayer » → Weblook, Audace, Impressions, Tolosa, creation-site-internet-fribourg.ch, Versant web…
- Ceux qui sortent devant ont **une page dédiée par ville** (« Création de site internet à Payerne »).

## Objectif réaliste
Pas « créer site » (national). Viser : **création site internet Payerne / Estavayer / Avenches / Moudon / Lucens / Broye** + « site web coiffeur / garage / restaurant Broye ». Et la fiche Google (carte) pour « web designer » près de Payerne.
Délai normal pour un site neuf : **plusieurs mois** (pas des jours). ~9 concurrents sur Payerne déjà en place.

## Étapes, dans l'ordre
1. **Brancher wibzo.ch** sur le nouveau site (après le changement DNS).
2. **Google Search Console** : ajouter wibzo.ch (vérif DNS chez Cloudflare), envoyer `sitemap.xml`, demander l'indexation de chaque page.
3. **Page d'accueil** : titre déjà bon (« Payerne, Broye »). Ajouter un texte visible « Création de site internet dans la Broye : Payerne, Estavayer, Avenches, Moudon, Lucens ».
4. **Pages par ville** (2 au début : Payerne, Estavayer). ⚠️ Google punit les pages presque identiques (« pages satellites ») → chaque page doit avoir un vrai contenu différent : exemples de commerces du coin (vérifiés), comment se passe un rendez-vous là-bas, FAQ propre. Pas de faux clients, pas de faux avis.
5. **Pages par métier** : « Site web pour coiffeur / barbier », « pour garage », « pour restaurant / café », avec la maquette correspondante (marquée exemple).
6. **Avis Google** (le plus important pour la carte) : 5 vrais avis le 1er mois.
7. **Liens vers wibzo.ch** depuis des sites sérieux : fiche Google, Facebook, Instagram (déjà), annuaires suisses (local.ch / search.ch : vérifier le prix avant), société des commerçants / commune si possible. **Jamais acheter de liens.**
8. Mention « Site : Wibzo » chez les clients : nofollow, sans mots-clés (sinon Google peut punir).
9. Tous les mois : regarder Search Console (sur quels mots on apparaît, position) et ajuster.

## Ce qui ne marche pas / interdit
- Bourrer de mots-clés, pages copiées par ville, acheter des liens/avis, mots-clés dans le nom de la fiche.
- Payer Google Ads ne fait pas monter dans les résultats normaux (c'est une zone « Sponsorisé » à part).

Sources : developers.google.com/search/docs/essentials/spam-policies · support.google.com/business/answer/7091 · résultats Google relevés dans Chrome le 18.10.2026.

## Fait le 18.10.2026 (site-v4, publié sur le Worker)
- Accueil : titre « Création de site internet à Payerne et dans la Broye », description, données structurées (horaires, zone, Instagram/Facebook), section « Création de site internet dans la Broye » + liens, liens en pied de page.
- 5 pages : /creation-site-internet-payerne/ · /creation-site-internet-estavayer/ · /site-web-coiffeur-barbier/ · /site-web-artisan-garage/ · /site-web-restaurant-cafe/ (textes dans `seo-pages/pages.js`, regénérer avec `node seo-pages/build.js`).
- sitemap.xml mis à jour (6 pages).
- Reste : brancher wibzo.ch, Search Console, avis Google.
