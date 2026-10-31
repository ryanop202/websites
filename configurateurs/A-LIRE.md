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
- Pas encore fait : envoi réel de la demande à l'entreprise (aujourd'hui : copie à Wibzo via Web3Forms).
- ⚠️ Les démos Abris Bois et Sirbatec tournent sur l'ancien `app.js` (sans la version alu). Ne les mettre à jour que si besoin.
