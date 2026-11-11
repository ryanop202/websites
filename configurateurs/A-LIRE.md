# Configurateurs 3D — nouvelle piste (28.10.2026)

Idée de Ryan : vendre des configurateurs 3D avec prix indicatif + demande de devis complète à des PME qui vendent sur mesure.

## Recherche de niche (28.10.2026)
| Niche | Constat | Verdict |
|---|---|---|
| Pergolas / stores | Renson a déjà un configurateur qui envoie vers ses revendeurs ; Salesqueze en a déjà 241 | ❌ déjà occupé |
| Abris de jardin | Hornbach.ch : ~500–2 000 CHF en kit | ❌ trop bon marché |
| Garde-corps | Une boutique suédoise propose déjà un configurateur avec prix en Suisse | ⚠️ moyen |
| **Carports bois sur mesure** | Hornbach.ch : 4 800–9 900 CHF (standard). Aucun configurateur trouvé chez les charpentiers suisses. ~65 charpentiers dans la Broye (local.ch) | ✅ **niche choisie** |
| Boxes chevaux / écuries | Aucun configurateur suisse trouvé ; lien avec Farmwood (équestre) | ✅ 2e choix |

- La recherche web ne prouve pas l'absence totale : à confirmer en visitant les sites des charpentiers ciblés.
- ⚠️ Le chiffre « Gartner +40 % de conversion » n'a **aucune source Gartner** (vient de pages de vendeurs). Ne pas l'utiliser.

## Exemple de référence
**Easycarport (Allemagne)** — https://www.easycarport.de/konfigurator/flachdach/ (fait par Combeenation).
Testé le 28.10.2026 : 3 curseurs (profondeur 5–9 m, largeur 2,70–6,16 m, hauteur 2,10–2,30 m), menu par étapes (Modèle / Toit / Local / Couleurs / Accessoires), prix en direct, poteaux placés automatiquement, offre PDF + sauvegarde du projet.
Points faibles : popups de pub, pas de voiture pour l'échelle, pas de cotes sur la 3D, vente de kit avec panier.
On imite les **fonctions**, jamais leur code, leurs modèles 3D, leur design ou leur marque.

## Démo : `carport-demo/`
- **Décision de Ryan (31.10.2026) : `carport-demo/` (version publiée sur demo.wibzo.ch le 31.10) est la base de chaque nouveau configurateur client.** Pour un nouveau client : copier ce dossier, puis changer `config.js` (et `decor.js` seulement si besoin). Ne plus partir des démos clients plus anciennes (Abris Bois, Sirbatec : ancien `app.js`).
- Ouvrir en local : il faut un petit serveur (les modules JS ne marchent pas en double-cliquant sur le fichier). Claude le lance.
- **Tout ce qui change par client est dans `config.js`** : nom, initiales, e-mail, dimensions min/max, toits, couvertures, bois, tarifs.
- ⚠️ Les tarifs actuels sont **FICTIFS** (badge « Démo · prix fictifs » affiché). Pour un vrai client : ses tarifs, et ses règles techniques (portée max entre poteaux, pentes, neige) validées par lui.
- Coin fixe (demande de Ryan, 28.10.2026) : l'arrière et le côté gauche ne bougent pas, le carport s'agrandit vers l'avant et vers la droite.
- Rendu réaliste (demande de Ryan : « trop dessin animé ») : éclairage d'environnement, veinage du bois, tuiles/tôle en relief, pavés + gazon, plots béton et pieds en U, contrefiches, planches de rive, gouttières demi-rondes, ombres de contact (ordinateur seulement).
- Véhicules (28.10.2026) : modèles CC0 « Free Low Poly Vehicles Pack » de RGS_Dev (itch.io), rhabillés avec nos matériaux. Citadine / SUV / Utilitaire dans `modeles/` + licence.
- Options ajoutées : raccourcis de dimensions, teinte de la couverture, plan cliquable des parois, bardage vertical/horizontal, profondeur du local (1,20 / 1,80 / 2,40 m), LED, préparation borne de recharge, choix du véhicule, écart de prix affiché à côté de chaque choix, résumé de la configuration.
- Ajouts du 28.10.2026 (après-midi) : estimation PDF téléchargeable (générée dans le navigateur, `pdf.js`, sans bibliothèque) ; implantation « contre la maison » (façade gauche/droite, pas de poteaux côté maison, muralière + solin, toit 1 pan ou plat seulement) ; local de rangement à l'arrière, à gauche ou à droite ; three.js et polices hébergés dans `vendor/` (aucune ressource externe, licences MIT et OFL incluses) ; écran de chargement ; sur mobile, vue 3D plus grande et une étape à la fois (onglets).
- Fonctions : 3D en direct (Three.js), voiture pour l'échelle, cotes bleues, 3 vues, prix TTC + fourchette + détail, lien partageable de la configuration, formulaire → récap texte + image 3D de ce que l'entreprise reçoit.
- Version **aluminium** (29.10.2026, pour SURTECH) : `materiau: 'alu'` dans `config.js` → structure alu satinée sans veinage, bandeau épais, pas de contrefiches ni pieds en U, débords minimes ; lames de fermeture composite horizontales avec leur teinte (`bardages[].couleur` + `sens`) ; couvertures « panneau » (toit isolé) et « solaire » (photovoltaïque). Réglages texte par client dans `libelles`, équipements proposés dans `equipements` (étape masquée si vide), éléments inclus dans `inclus`. Sans ces clés, la démo bois est inchangée.
- Qualité du rendu (30.10.2026, demande de Ryan après avoir vu Meridiem, configurateur-3d belge pour vérandas / pergolas / piscines / carports) : ciel et brume revus (plus de ligne d'horizon), gazon plus naturel qui s'efface vers le bord, couleurs AgX (bois moins jaune), soleil de côté (l'ombre du toit se voit sous l'abri), ombre d'ambiance sous le toit et au pied des poteaux, chaque pièce de bois / lame avec sa nuance et son veinage, carrosseries adoucies (moins de facettes), qualité 3D réduite sur mobile. Recopié dans `demo-pergola/`. Démos clients pas modifiées.
- Maison complète + jardin (30.10.2026, demande de Ryan : « comme Meridiem », d'après ses captures) : nouveau fichier `carport-demo/decor.js`. Maison à étage (crépi clair, socle en pierre, toit en ardoises, fenêtres de toit, cheminée, porte avec marquise, gouttières), allée pavée jusqu'à la rue, terrasse, pelouse tondue en bandes, haies autour de la parcelle, arbres, massifs fleuris, lavandes, bornes lumineuses, arbres et collines au loin dans la brume. Isolé : la maison est derrière le carport. Contre la maison : le carport est fixé à la façade longue. Nouveaux boutons **Nuit** (fenêtres allumées, bornes et spots LED qui éclairent) et **Tourner** (rotation automatique). `?nuit` dans l'adresse ouvre la vue de nuit. `decor: false` dans `config.js` = ancien décor (façade seule). Fait par nous (formes simples), rien de copié chez Meridiem. Démos clients et pergola pas modifiées.
- Finitions (31.10.2026) : plus d'arbre ni de buisson entre la caméra et le carport (ils sont décalés sur le côté libre, pour les 3 implantations) ; étiquettes de cotes qui ne se chevauchent plus ; « passage » masqué en vue de dessus ; nom de l'entreprise lisible en vue de nuit ; texte d'aide masqué quand la vue 3D est étroite ; ~100 avertissements three.js supprimés de la console. Publié sur demo.wibzo.ch le 31.10.2026.
- Badge « Démo préparée pour… » : passe sous le nom de l'entreprise quand la vue 3D est étroite (sinon chevauchement avec un nom long, vu sur Girard Frères le 31.10.2026).
- **Réalisme « comme Meridiem » (03.11.2026, demande de Ryan)**, dans `carport-demo/` seulement (démos clients pas modifiées) :
  - Nouveau fichier `carport-demo/produits3d.js` : modèles 3D dédiés, choisis par `modele3d` dans la config du produit.
  - **Véranda refaite** (`modele3d: 'veranda'`) : chéneau côté jardin, chevrons alu à capot tous les ~1 m, verre (ou polycarbonate / panneau isolé) entre les chevrons, profil mural + solin, baies coulissantes à cadres entre les poteaux (curseur « Baies ouvertes » : les vantaux glissent), pignons vitrés avec montants et traverse, descente d'eau, spots LED dans les chevrons, option **stores de toiture** (`storeToit`, tarif `storeToitM2`).
  - **4e produit : pergola bioclimatique alu** (`produits/pergola-bio.js`, `?produit=pergola-bio`) : cadre épais, lames orientables (curseur 0–90°, les bandes d'ombre bougent sur la terrasse), poutre intermédiaire au-delà de `porteeLames`, autoportante ou adossée, 4 côtés fermables (`paroiAvant: true`) en **store screen** ou **vitrage coulissant**, LED en bandeau, **chauffage** infrarouge (`chauffage`, tarif `chauffage`), teintes RAL + finition chêne (`bois[].veinage`).
  - Mobilier de terrasse (table + 4 chaises) pour l'échelle sous la pergola et dans la véranda (hors prix).
  - Décor : dalles grand format 100 × 50 plus chaudes, bordure foncée, plate-bande paillée avec lavandes (tiges + épis) et buis en boule le long du bord libre de la terrasse, gazon plus vert. Soleil plus de côté pour les produits contre la maison (l'ombre tombe sur la terrasse).
  - **Bug corrigé** : pour la pergola et la véranda, « Largeur · le long de la façade » réglait en fait l'avancée. Maintenant `inverserCotes: true` : curseur « Largeur (le long de la façade) » en premier, puis « Avancée (depuis la façade) » ; résumé, badge et PDF dans le même ordre. Les limites et valeurs par défaut des deux produits ont été remises dans le bon sens.
  - Prix d'exemple des cartes (TTC, réglages par défaut) : carport 12 790, pergola bois 4 610, pergola bioclimatique 10 890, véranda 30 750.
  - `?debug` dans l'adresse : `window.__dbg` (scène, soleil, caméra) pour régler le rendu depuis la console.
  - **Publié sur https://demo.wibzo.ch le 03.11.2026** (vérifié : 4 produits, aucune erreur). Pergola bioclimatique : https://demo.wibzo.ch/?produit=pergola-bio
- Pas encore fait : envoi réel de la demande à l'entreprise (aujourd'hui : copie à Wibzo via Web3Forms).
- ⚠️ La démo Sirbatec tourne sur l'ancien `app.js`. Abris Bois et SURTECH ont été passées sur la nouvelle base le 04.11.2026 (ancienne config déplacée dans `produits/carport.js`, `config.js` multi-produits avec assistant).

## Version allemande (11.11.2026) — Suisse alémanique
- `carport-demo-de/` = démo maître en allemand (carport + véranda seulement), **fabriquée par `outils/traduire-de.py`** à partir de `carport-demo/` avec les paires de `outils/traduction-de.json`. Ne pas la modifier à la main : après un changement dans `carport-demo/`, relancer le script (il s'arrête si un texte français a changé → mettre la paire à jour).
- Format suisse alémanique : 12'790 CHF, 3.50 m, « inkl./exkl. MWST », Offerte, « ss » (pas de ß). Les alertes à Ryan (« La démo est utilisée », « PDF téléchargé ») restent en français.
- `outils/demo-de.py` : 10 démos clients en allemand (swisscarport, texbau, sio, baumberger, simelhome, hunziker, holzbau-ott, doppelpunkt, nabholz, knecht) + `MESSAGE.md` en allemand. Texbau = carport acier (moteur alu, galvanisé/anthracite/blanc). swisscarport = toiture photovoltaïque en plus.
- ⚠️ **Limite Cloudflare gratuite atteinte (100 Workers)** le 11.11.2026 : 6 démos en ligne, holzbau-ott, doppelpunkt, nabholz et knecht pas publiées.
- Liste des prospects : `PROSPECTS-CONFIGURATEUR.md`, section « Prospects Suisse alémanique ».

## Prochaine niche (recherche rapide du 03.11.2026)
| Niche | Constat | Verdict |
|---|---|---|
| **Vérandas / jardins d'hiver** | local.ch « véranda » Vaud : 89 résultats (Equibat, Véranda Design Lonay, AC Aluminium Créations Yverdon, Karlen SA, Chapuis Stores…). Aucun configurateur de vendeur romand trouvé par la recherche web. Concurrence : modèles tout faits de Salesqueze (vérandas à toit vitré), Meridiem (Belgique). Moteur proche de `demo-pergola/` + version alu | ✅ **choisie pour la prochaine démo** |
| Piscines | Desjoyaux, AstralPool ont déjà des configurateurs ; logiciel pro Logyconcept3D chez les piscinistes ; moteur 3D très différent (terrain, eau, margelles) | ❌ |
| Boxes chevaux / écuries | Peu de vendeurs en Romandie, LCI Cheval (France) a déjà un configurateur ; Farmwood (employeur de Ryan) travaille dans l'équestre → risque de concurrence avec Farmwood | ⚠️ seulement avec l'accord de Farmwood |
- À faire avant la démo : ouvrir les sites d'une dizaine de vendeurs de vérandas romands pour vérifier qu'ils n'ont pas de configurateur (la recherche web ne prouve pas l'absence).
- **Produit « Terrasse » (04.11.2026)**, 5e produit de demo.wibzo.ch (`produits/terrasse.js`, `?produit=terrasse`) : `type: 'terrasse'` (prix et textes propres dans `app.js` : `prixTerrasse`), modèle 3D `terrasse` dans `produits3d.js` : lames bois (veinage) ou composite (rainures) avec 3 nuances, dalles grès cérame 120 × 60 (texture), sens de pose parallèle / perpendiculaire à la façade / avec cadre, habillage des côtés, marches automatiques dès 20 cm (marche max 18 cm, largeur 1,40 m, côté jardin), garde-corps verre / bois à barreaux / câbles inox sur les côtés choisis (ouverture au droit des marches), spots LED encastrés (vue de nuit), mobilier pour l'échelle. Le décor ne dessine pas de dallage sous une terrasse (`dalleTerrasse`). Note SIA 358 affichée dès 1 m de hauteur. Prix d'exemple : 8 330 CHF TTC. Publié et vérifié le 04.11.2026.
