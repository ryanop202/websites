# Lancement Wibzo — état et prochaines étapes

Dernière mise à jour : 14.10.2026. À lire au début de chaque nouvelle session, après CLAUDE.md.

## Résumé en 5 lignes
- Wibzo = activité de Ryan : maquette de site **gratuite en moins de 24 h**, puis site payant si elle plaît (brief : ~500 CHF + 25 CHF/mois, voir `wibzo/A-COMPLETER.md`).
- Site en ligne : **https://wibzo.ch** (version `wibzo/site-v3`), hébergé sur Netlify.
- Pubs Meta prêtes : `wibzo/pubs-v2/` (2 vidéos avec voix + 2 affiches). Budget validé : **100 CHF sur 7 jours**. ⚠️ Depuis le 14.10.2026 : pubs vers un **formulaire Meta** (objectif Prospects), voir `wibzo/pubs-meta-formulaire/A-LIRE.md`.
- Fichier de prospection : `prospection/prospects_sans_site.xlsx` (206 commerces de la Broye sans site, avec mobile + message + lien WhatsApp).
- Il reste : mentions légales, e-mail, WhatsApp Business, Meta, organisation pour livrer, puis lancement.

## Ce qui est FAIT
- **Domaine wibzo.ch** acheté chez Infomaniak (compte Ryan, organisation 2369255).
- **DNS (zone Infomaniak, serveurs ns11/ns12.infomaniak.ch — NE PAS passer sur Netlify DNS)** :
  - `wibzo.ch` A → `75.2.60.5` (Netlify)
  - `www` CNAME → `comfy-begonia-aed182.netlify.app`
  - Lignes e-mail intactes (MX mta-gw.infomaniak.ch, SPF, DKIM, DMARC, SRV, autoconfig/autodiscover).
- **Netlify** : projet `comfy-begonia-aed182` (équipe « idk »), domaine vérifié, HTTPS actif, www → redirige vers wibzo.ch.
- **Pubs Meta v2** (`wibzo/pubs-v2/`, voir son `A-LIRE.md`) :
  - Vidéo 1 `Wibzo_voir-avant-de-payer` : problème « Un site vous tente… mais peur de payer pour rien ? » → « Je crée gratuitement la maquette… » → « Elle vous plaît ? On continue. Sinon, on en reste là. » → 24 H → « Écrivez « maquette » sur WhatsApp ».
  - Vidéo 2 `Wibzo_le-concurrent` : « Pendant que vous lisez ça, votre concurrent prend vos clients… » → même fin.
  - Affiche `Wibzo_affiche_pas-de-site_4x5.png` (sombre) et `Wibzo_affiche_peur-de-payer_4x5.png` (claire, ticket de caisse 0 CHF).
  - Voix : Théo (ElevenLabs). Photos des maquettes : IA (Higgsfield, Z Image). Commerces fictifs, « Exemple de maquette ».
- **Décisions pubs** : tous commerces de Suisse romande, vouvoiement, marque Wibzo, WhatsApp **076 757 43 93**, mot-clé **« MAQUETTE »** (aussi en message pré-rempli), 1 campagne / 1 ensemble / budget automatique (Advantage+), ciblage large 25–60 ans, objectif Messages WhatsApp, ne rien toucher 7 jours. **Remplacé le 14.10.2026** : objectif Prospects + formulaire Meta, 25–65 ans (voir `wibzo/pubs-meta-formulaire/`). CLAUDE.md mis à jour (test de 100 CHF autorisé).
- **Copie des skills Claude** dans `claude-skills/` (installation : voir `claude-skills/README.md`).

## Points bloquants / à savoir
- **Netlify n'a plus de crédits** (« production deploys paused ») : le site reste en ligne mais **on ne peut plus publier de mise à jour** jusqu'au prochain cycle de facturation. Option : déplacer le site sur Cloudflare Pages (gratuit) — Ryan doit créer le compte lui-même.
- **Mentions légales / Protection des données** du site : encore « À compléter » (nom, adresse postale avec rue, e-mail). À remplir AVANT de lancer les pubs (LCD art. 3 al. 1 let. s, à vérifier).
- **ElevenLabs** : compte gratuit bloqué (« Unusual activity… Free Tier access has been disabled ») — les nouvelles voix échouent de plus en plus. Pour changer une voix : abonnement payant.
- **Higgsfield** : plan gratuit, ~7 crédits restants ; seul le modèle `z_image` fonctionne (1 génération à la fois).
- Si les vidéos doivent être refaites : `wibzo/pubs-v2/A-LIRE.md` (calage voix : `calage_vN.json` → `out/warp_vN.json`).

## Outils prêts (12.10.2026, nuit)
- `wibzo/whatsapp-business.md` : profil, message d'accueil, message d'absence, 9 réponses rapides (/prix, /gratuit, /delai…), étiquettes. Questions encore à trancher listées en bas.
- `wibzo/suivi-wibzo.xlsx` : suivi des contacts (statuts colorés, relance J+3 en orange), stats des posts Instagram avec score, bilan automatique (coût par client pub).
- `wibzo/LIVRER-UNE-MAQUETTE.md` : méthode maquette en < 24 h + prompt à coller dans Claude. ⚠️ Hébergement des démos bloqué (Netlify sans crédits) → choisir Cloudflare Pages ou captures d'écran.
- `wibzo/pubs-organiques/` (13.10.2026) : **les posts prêts à publier, un dossier par jour**, fichiers nommés par heure + `TEXTES.md` (légendes). Calendrier : `LISEZ-MOI.md`. Fabriqué jusqu'au mercredi 14.10 inclus. ElevenLabs : abonnement Starter pris le 13.10.2026.
- `wibzo/IDEES-CONTENU.md` (13.10.2026) : **registre de toutes les idées de contenu** (déjà fait / prévu / banque d'idées + recherche). À lire avant de produire un post ou un Reel, pour ne jamais refaire la même idée.
- `wibzo/reels-organiques/PLANNING-SEMAINE.md` : 18 idées de Reels du 14 au 19.10 (7 familles d'accroches) + légendes.

## Prochaines étapes (dans l'ordre)
1. [x] **E-mail** (fait, confirmé par Ryan le 12.10.2026) : créer contact@wibzo.ch dans Infomaniak (Service Mail → wibzo.ch → Créer une adresse mail → Créer une boîte mail → `contact` → utilisateur Ryan → « Créer la boîte mail »). Le bouton final ne réagissait pas en automatique : à cliquer par Ryan. Opérationnel sous 24 h.
2. [ ] **Mentions légales** (reporté par Ryan le 12.10.2026 — reste requis avant les pubs) : Ryan donne nom + adresse (voir avec ses parents) → Claude met à jour `wibzo/site-v3` → publier (Netlify au prochain cycle ou Cloudflare Pages).
3. [x] **Vérifications** (OK selon Ryan, 12.10.2026) (CLAUDE.md) : accord de l'entreprise formatrice (activité parallèle), AVS, impôts.
4. [ ] **WhatsApp Business** sur 076 757 43 93 — **numéro professionnel obtenu (confirmé par Ryan le 13.10.2026)**, installation de WhatsApp Business en cours par Ryan. Reste : logo, lien wibzo.ch, puis coller le profil, le message d'accueil, le message d'absence et les réponses rapides déjà prêts dans `wibzo/whatsapp-business.md`.
5. [ ] **Meta** (en cours, 12.10.2026) — Page Facebook Wibzo CRÉÉE : https://www.facebook.com/profile.php?id=61595038304219 (catégorie Web Designer, site + contact@wibzo.ch, pas d'adresse, aucun ami invité, logo `wibzo/wibzo-profil-1080.png`, couverture `wibzo/wibzo-couverture.png`). Instagram @wibzo.ch créé par Ryan, photo + bio faites (sans « MAQUETTE », choix de Ryan). 6 posts prêts dans `wibzo/posts-instagram/` (voir A-LIRE.md), pas encore publiés. Bio Facebook corrigée sans « MAQUETTE » (12.10.2026, soir). Reste : lien wibzo.ch sur Instagram (seulement via l'app mobile), relier Instagram à la page Facebook (Instagram déjà passé en compte Business, catégorie Web Designer, e-mail contact@wibzo.ch, le 12.10.2026), WhatsApp (après validation), carte de paiement (Ryan). Âge : la mère de Ryan co-gère les comptes Wibzo et prend les décisions ; date de naissance de la mère mise sur Instagram (12.10.2026, en attente de mise à jour Meta). Si Meta demande une vérification d'âge, c'est elle qui la fait. Compte publicitaire + carte : à son nom. : page Facebook + Instagram Wibzo, WhatsApp relié à la page, moyen de paiement dans le Gestionnaire de publicités.
6. [ ] **Pouvoir livrer en < 24 h** : base de maquette réutilisable (1–2 h par commerce), tableau de suivi des contacts (date, maquette envoyée, réponse, vendu), limite ~3 maquettes/jour (mettre les pubs en pause si débordé).
6b. [ ] **Test organique 1 semaine AVANT les pubs** — 3 premiers Reels + carrousel prêts pour le 13.10 dans `wibzo/reels-organiques/` (voir A-LIRE.md : heures, textes, comment programmer). Programmation automatique impossible tant qu'Instagram n'est pas relié à la page Facebook. (décision de Ryan, 12.10.2026) : 2–3 Reels/jour sur Instagram, comparer surtout la durée de visionnage, puis mettre en pub les 2–3 meilleures vidéos (sans musique Instagram).
6c. [ ] **Test organique des pubs (13.10 → 16.10.2026)** : 4 vidéos « pub » postées à 12:00 (mar → ven). **Dimanche 18.10** : comparer (temps de visionnage d'abord), garder 1–2, Claude fait 2–3 débuts différents → ce sont elles qui partent en pub. Détails : `wibzo/pubs-organiques/LISEZ-MOI.md`.
7. [ ] **Lancer les pubs** : 100 CHF / 7 jours, formulaire Meta. Avant : page protection des données + test du formulaire (voir `wibzo/pubs-meta-formulaire/A-LIRE.md`). Arrêt si 40 CHF sans prospect. Exporter les prospects chaque soir. Bilan : ≥ 1 client = continuer ; conversations sans client = corriger maquette/prix/relance ; presque aucune conversation = nouveaux hooks/visuels.
8. [ ] **En parallèle** : messages WhatsApp aux 206 commerces du fichier, **20–30 par jour max** (risque de blocage du numéro ; règles LCD sur la prospection à vérifier).

## Mise à jour 15.10.2026 — démos sur Cloudflare Pages
- Compte Cloudflare créé par Ryan. Les maquettes de démo passent maintenant par **Cloudflare Pages** (gratuit), à la place de Netlify qui n'a plus de crédits.
- Première démo : Quinn Beauty → https://quinn-beauty-wibzo.pages.dev
- Méthode : Workers & Pages → Créer → Pages → téléverser un .zip du site.
- ⚠️ Le .zip fait avec « Compresser » de Windows / PowerShell 5 met des chemins `img\photo.jpg`. Cloudflare ne les comprend pas et les photos ne s'affichent pas. Il faut un zip avec des chemins `img/photo.jpg` (Claude le fait).

## Mise à jour 16.10.2026 — wibzo.ch sur Cloudflare
- `wibzo/site-v3` est en ligne sur Cloudflare (Workers, projet « wibzo ») : https://wibzo.ryanoppliger2021.workers.dev
- Pour publier une mise à jour : dans `wibzo/site-v3`, lancer `npx wrangler deploy` (config : `wrangler.jsonc`, fichiers exclus : `.assetsignore`).
- wibzo.ch pointe ENCORE sur Netlify. Pour le passer sur Cloudflare, il faut que la zone DNS wibzo.ch soit gérée par Cloudflare (changer les serveurs de noms chez Infomaniak) et recopier toutes les lignes e-mail (MX, SPF, DKIM, DMARC, SRV, autoconfig). Pas encore fait : décision de Ryan.
- 16.10.2026 : zone wibzo.ch créée chez Cloudflare (plan Free), 14 lignes recopiées et vérifiées (dont DKIM `20261012._domainkey` et SRV `_submissions._tcp`). Serveurs de noms Cloudflare : `cory.ns.cloudflare.com` et `lilith.ns.cloudflare.com`. Ordre : 1) couper DNSSEC chez Infomaniak, 2) attendre que le DS disparaisse, 3) changer les serveurs de noms, 4) relier wibzo.ch + www au Worker « wibzo ».

## 18.10.2026 — nouveau site site-v4 (avec les 5 maquettes)
- `wibzo/site-v4` publié sur le Worker « wibzo » (remplace site-v3 sur https://wibzo.ryanoppliger2021.workers.dev). Mise à jour : `npx wrangler deploy` dans `wibzo/site-v4`.
- Prix affichés : création dès 350 CHF, 30 CHF/mois, maquette offerte.
- wibzo.ch montre ENCORE l'ancien site (Netlify) : changement des serveurs de noms chez Infomaniak pas encore fait (vérifié le 18.10 : ns11/ns12.infomaniak.ch).

## ⚠️ 16.10.2026 — WhatsApp bloqué 24 h (trop de messages)
- ~70 messages à des inconnus en 3 jours (dont ~21 le 16.10) → WhatsApp a restreint le numéro 076 757 43 93 pendant 24 h.
- Nouvelle limite : **10 à 15 nouveaux contacts par jour max**, espacés (pas en rafale), uniquement des messages personnalisés. Un 2e blocage peut devenir définitif.
- Pendant un blocage : ne pas utiliser d'autre numéro ou d'outil pour contourner. Appels / SMS / visites à la place.

## 18.10.2026 (soir) — DNS wibzo.ch
- DNSSEC retiré au registre : wibzo.ch remarche (encore l'ancien site Netlify).
- Serveurs DNS changés chez Infomaniak (par Ryan) → `cory.ns.cloudflare.com` + `lilith.ns.cloudflare.com`. En attente du registre .ch (quelques heures, max ~24 h).
- Zone Cloudflare vérifiée avant : MX, SPF, DMARC, autodiscover et les 6 SRV mail = identiques à Infomaniak.
- Prochaine étape : quand la zone Cloudflare est « Active », brancher wibzo.ch + www sur le Worker « wibzo » (site-v4), puis tester site + e-mails.

## 19.10.2026 — wibzo.ch sur Cloudflare (site-v4)
- Lignes Netlify supprimées par Ryan dans la zone Cloudflare (A wibzo.ch → 75.2.60.5, CNAME www → netlify).
- `wibzo/site-v4/wrangler.jsonc` : wibzo.ch + www.wibzo.ch ajoutés comme domaines personnalisés du Worker « wibzo ».
- wibzo.ch et www.wibzo.ch affichent site-v4 (vérifié). MX + SPF intacts. Netlify n'est plus utilisé.
- Mise à jour du site : `npx wrangler deploy` dans `wibzo/site-v4`.

## 19.10.2026 — Stripe (abonnement 50 CHF/mois)
- Compte Stripe « wibzo » créé par Ryan. **Identité / IBAN pas encore vérifiés** → seulement en mode TEST pour l'instant.
- Fait en mode test : produit « Site Wibzo – abonnement mensuel » 50 CHF/mois ; lien de paiement https://buy.stripe.com/test_cNibJ2g0I8XAeMFdCTd7q00 (sans TVA, Managed Payments désactivé, nom + commerce demandés) ; portail client (annulation à la fin du mois payé) billing.stripe.com/p/login/test_cNibJ2g0I8XAeMFdCTd7q00 ; logo W. + couleurs du site (#151513 / #B4612F).
- Choix : taxes « gérées manuellement » (pas de TVA, < 100 000 CHF/an), Radar Lite (gratuit), PAS de Managed Payments (+3,5 %).
- Frais : 2,9 % + 0,30 CHF par paiement (carte suisse) + ~0,7 % Billing ≈ 2,10 CHF/mois par client.
- Après la vérification : recréer produit + lien + portail en mode réel, activer l'e-mail « paiement réussi » (Préférences de communication → Transactions) et les reçus clients.
