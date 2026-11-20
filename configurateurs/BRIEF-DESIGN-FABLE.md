# Brief pour Fable — rendre les démos les plus belles jamais vues (15.11.2026)

À copier en entier dans une nouvelle session Claude Code (modèle Fable), dossier `C:\Users\ryan\websites`.

---

```
Tu travailles pour Ryan (Wibzo). Il vend des configurateurs 3D à des artisans suisses (carports, pergolas, vérandas, piscines, terrasses, studios de jardin). Il ne sait pas coder : réponds-lui en français, avec des mots simples, en messages courts. Il veut économiser ses tokens : pas de recherches inutiles, pas de relectures en boucle, pas de longs rapports.

OBJECTIF
Que la démo maître `configurateurs/carport-demo/` devienne le configurateur produit le plus beau qu'un artisan ou un client ait jamais vu : une scène 3D d'un réalisme et d'une élégance qui coupent le souffle, et une interface autour qui fait « produit haut de gamme ». La beauté doit servir la vente : le client doit avoir envie de son projet, et l'artisan doit se dire « je veux ça sur mon site ».

À LIRE D'ABORD (et rien d'autre avant d'avoir un plan)
- `CLAUDE.md` (règles du projet, surtout « ne rien inventer »)
- `configurateurs/README.md` (fonctionnement, clés de config.js, mise en ligne)
- `configurateurs/A-LIRE.md` (historique de tout ce qui a déjà été fait sur le rendu)
Fichiers du moteur : `carport-demo/app.js` (moteur, prix, PDF, formulaire), `produits3d.js` (modèles 3D par produit), `decor.js` (maison, jardin, ciel), `realite.js` (« Voir chez moi »), `style.css`, `index.html`, `pdf.js`, `produits/*.js` (7 produits : carport, pergola, pergola-bio, veranda, piscine, terrasse, studio). three.js r160 est dans `vendor/`.

MÉTHODE
1. Audit : lance un petit serveur local sur `carport-demo/` (les modules JS ne marchent pas en double-clic) et fais des captures de chaque produit, en vue 3D, de jour et de nuit, sur ordinateur et sur mobile (375 px). Avant de toucher à la démo dans le navigateur, mets `sessionStorage.setItem('demo-signalee','1')` : sinon chaque test envoie une fausse alerte e-mail à Ryan.
2. Plan : donne à Ryan, en 10 lignes maximum, les améliorations classées de la plus visible à la moins visible, avec une capture « avant » des 2 ou 3 points les plus faibles. Attends son OK avant de coder.
3. Travail par lots, du plus grand impact au plus petit. Après chaque lot : captures avant / après, console sans erreur, les 7 produits vérifiés. Si un lot n'améliore pas clairement l'image, annule-le.
4. Fin : captures finales (ordinateur + mobile, jour + nuit) des 7 produits, liste courte des changements, ce qui reste à faire, note dans `A-LIRE.md` (section datée) et `README.md` si une clé de config change, commit.

PISTES (à juger toi-même, rien d'obligatoire)
- Lumière : environnement et ciel plus riches, ombres douces et justes, occlusion ambiante (GTAO est déjà dans `clients/siviriez/vendor/` en r160), lumière rasante type fin de journée, vraie ambiance de nuit.
- Matières PBR crédibles : bois (veinage, rugosité, normal map), alu thermolaqué, verre (reflets, transmission), tuiles, tôle, eau de piscine, végétation, sols. Textures générées dans le code ou CC0 avec leur licence dans `vendor/`.
- Décor et mise en scène : jardin plus vivant, profondeur, cadrages de caméra soignés, transitions fluides, petite animation d'arrivée, retour visuel quand une option change.
- Interface : typographie, espacements, hiérarchie, micro-interactions, écran de chargement, rendu sur mobile. Rester sobre et haut de gamme, pas « template IA ».

CONTRAINTES (ne pas casser)
- Tout reste local : aucune ressource chargée depuis un autre serveur (pas de CDN, pas de Google Fonts en ligne). Licences libres seulement (MIT, CC0, OFL), fichier de licence à côté.
- Toutes les fonctions doivent marcher comme avant : prix et détail, PDF d'estimation, formulaire de devis + image 3D, lien partageable, vues 3D/Face/Dessus, cotes, Nuit, Tourner, mode mobile en onglets, « Voir chez moi » (l'export USDZ iPhone doit rester valide : test avec `?test-ra` puis `await testRA()` dans la console), fiche technique PDF des carports/pergolas, version alu (`materiau: 'alu'`), toutes les clés de `config.js` listées dans le README.
- Performance : fluide sur ordinateur, utilisable sur un téléphone moyen (garder et améliorer la qualité réduite `PETIT_APPAREIL`), chargement rapide. Mesure les FPS avant / après.
- Textes français de l'interface : la version allemande `carport-demo-de/` est fabriquée par remplacement exact de textes (`outils/traduction-de.json`, script `outils/traduire-de.py`). Si tu changes un texte affiché, mets à jour la paire FR → DE, relance `py outils/traduire-de.py` et vérifie qu'il ne signale aucun texte introuvable.
- Ne rien copier chez les concurrents (Meridiem, Easycarport, etc.) : ni code, ni modèles 3D, ni design, ni marque.
- Travaille sur une branche git `design/demo-maitre`. Ne touche PAS à `clients/` (≈ 250 démos de prospects), à `hebergement-demos/` ni à la mise en ligne : Ryan décide ensuite quand publier et recopier le moteur dans les démos clients.
```
