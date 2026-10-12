# Lancement Wibzo — état et prochaines étapes

Dernière mise à jour : 12.10.2026 (soir). À lire au début de chaque nouvelle session, après CLAUDE.md.

## Résumé en 5 lignes
- Wibzo = activité de Ryan : maquette de site **gratuite en moins de 24 h**, puis site payant si elle plaît (brief : ~500 CHF + 25 CHF/mois, voir `wibzo/A-COMPLETER.md`).
- Site en ligne : **https://wibzo.ch** (version `wibzo/site-v3`), hébergé sur Netlify.
- Pubs Meta prêtes : `wibzo/pubs-v2/` (2 vidéos avec voix + 2 affiches). Budget validé : **100 CHF sur 8 jours**.
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
- **Décisions pubs** : tous commerces de Suisse romande, vouvoiement, marque Wibzo, WhatsApp **076 757 43 93**, mot-clé **« MAQUETTE »** (aussi en message pré-rempli), 1 campagne / 1 ensemble / budget automatique (Advantage+), ciblage large 25–60 ans, objectif Messages WhatsApp, ne rien toucher 7 jours. CLAUDE.md mis à jour (test de 100 CHF autorisé).
- **Copie des skills Claude** dans `claude-skills/` (installation : voir `claude-skills/README.md`).

## Points bloquants / à savoir
- **Netlify n'a plus de crédits** (« production deploys paused ») : le site reste en ligne mais **on ne peut plus publier de mise à jour** jusqu'au prochain cycle de facturation. Option : déplacer le site sur Cloudflare Pages (gratuit) — Ryan doit créer le compte lui-même.
- **Mentions légales / Protection des données** du site : encore « À compléter » (nom, adresse postale avec rue, e-mail). À remplir AVANT de lancer les pubs (LCD art. 3 al. 1 let. s, à vérifier).
- **ElevenLabs** : compte gratuit bloqué (« Unusual activity… Free Tier access has been disabled ») — les nouvelles voix échouent de plus en plus. Pour changer une voix : abonnement payant.
- **Higgsfield** : plan gratuit, ~7 crédits restants ; seul le modèle `z_image` fonctionne (1 génération à la fois).
- Si les vidéos doivent être refaites : `wibzo/pubs-v2/A-LIRE.md` (calage voix : `calage_vN.json` → `out/warp_vN.json`).

## Prochaines étapes (dans l'ordre)
1. [ ] **E-mail** : créer contact@wibzo.ch dans Infomaniak (Service Mail → wibzo.ch → Créer une adresse mail → Créer une boîte mail → `contact` → utilisateur Ryan → « Créer la boîte mail »). Le bouton final ne réagissait pas en automatique : à cliquer par Ryan. Opérationnel sous 24 h.
2. [ ] **Mentions légales** : Ryan donne nom + adresse (voir avec ses parents) → Claude met à jour `wibzo/site-v3` → publier (Netlify au prochain cycle ou Cloudflare Pages).
3. [ ] **Vérifications** (CLAUDE.md) : accord de l'entreprise formatrice (activité parallèle), AVS, impôts.
4. [ ] **WhatsApp Business** sur 076 757 43 93 : valider le numéro, logo, lien wibzo.ch. Claude prépare : message d'accueil automatique pour « MAQUETTE » + réponses rapides (prix, délai, « c'est vraiment gratuit ? »).
5. [ ] **Meta** : page Facebook + Instagram Wibzo, WhatsApp relié à la page, moyen de paiement dans le Gestionnaire de publicités.
6. [ ] **Pouvoir livrer en < 24 h** : base de maquette réutilisable (1–2 h par commerce), tableau de suivi des contacts (date, maquette envoyée, réponse, vendu), limite ~3 maquettes/jour (mettre les pubs en pause si débordé).
7. [ ] **Lancer les pubs** : 100 CHF / 8 jours. Bilan : ≥ 1 client = continuer ; conversations sans client = corriger maquette/prix/relance ; presque aucune conversation = nouveaux hooks/visuels.
8. [ ] **En parallèle** : messages WhatsApp aux 206 commerces du fichier, **20–30 par jour max** (risque de blocage du numéro ; règles LCD sur la prospection à vérifier).
