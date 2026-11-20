# Wibzo — sélecteur d'appartements 3D (promotions immobilières)

Nouvelle offre commencée le 12.11.2026 : pour un promoteur ou une agence qui vend une promotion **sur plans**.
L'acheteur tourne l'immeuble en 3D, clique sur un appartement et voit tout de suite s'il est libre, sa surface, son prix et un plan. Il envoie ensuite une demande pour **ce lot précis**.

Pourquoi c'est intéressant : un appartement vaut 300'000 à 1.5M CHF. Si l'outil aide à vendre un seul lot plus vite, il est remboursé plusieurs fois.
Pour Ryan : c'est le même travail que les configurateurs (Three.js), sans calcul de prix ni règles techniques.

## Contenu

| Dossier / fichier | Contenu |
|---|---|
| `demo-siviriez/` | 1re démo : « Le Bourg de Siviriez » de Glauser Immobilier SA (25 lots). Prospect : `PROSPECTS-IMMOBILIER.md` |
| `demo-ardon/` | 2e démo : « Le Clos des Forges » (Ardon) pour Berra Immobilier SA. Maquette à ailes tournées (`AILES_DEF` en haut de `maquette.js`), lots en lettres (A1…F2), falaise et montagnes. |
| `PROSPECTS-IMMOBILIER.md` | Promotions repérées, ce qui a été vérifié, le mail à envoyer |

## ⚠️ Avant de faire une démo pour un prospect (leçon de Siviriez, 12.11.2026)

1. Chercher le nom du projet sur Google : trouver **tous** les sites qui le vendent (site officiel du projet, chaque agence, le constructeur).
2. Sur **chacun**, vérifier qu'il n'y a pas déjà un sélecteur (image cliquable, plan interactif, page « 3D », « visite virtuelle », liste filtrable). S'il y en a un → écarter.
3. Prendre les données (statuts, orientation, surfaces, date de livraison) de la source la plus officielle. Si les sites ne sont pas d'accord : ne pas écrire de chiffre dans le mail.
4. Trouver le décideur avec son nom et son e-mail (promoteur ou agence qui commercialise tout le projet), pas une adresse info@ au hasard.
5. Ne rien inventer qui est publié ailleurs (ex. orientation des lots).

## Comment marche la démo (sans coder)

- **Tout ce qui change d'une promotion à l'autre est dans `config.js`** : nom, logo, couleurs, contact, et la liste des lots (numéro, étage, aile, pièces, surface, prix, statut `dispo` / `reserve` / `vendu`).
- Changer un statut (lot vendu, réservé) = changer un mot dans `config.js`. Les compteurs, la liste et les couleurs en 3D suivent tout seuls.
- `maquette.js` = la maquette 3D réaliste (12.11.2026) : façades avec de vraies fenêtres enfoncées, stores, balcons, intérieurs meublés (visibles en coupe), toit avec panneaux solaires, cour, parking, rampe de garage, voitures, arbres, village et collines, ciel et soleil de fin d'après-midi. La forme de l'immeuble est dans `AILES` et `LIGNES` en haut du fichier.
- `textures.js` = les textures (crépi, herbe, enrobé, parquet…) dessinées par le code : aucune image à télécharger.
- `app.js` = l'interface (clic, étages en coupe, filtres, fiche, formulaire), le rendu « photo » (occlusion ambiante sur ordinateur, vignettage) et l'arrivée cinématique de la caméra.
- Bouton « Disponibilités » : colore les lots en vert / orange / rouge. Par défaut l'immeuble reste réaliste (couleurs seulement au survol, avec un filtre, ou en vue d'étage).
- Ajouts du 12.11.2026 (après la 1re mise en ligne) :
  - **Fiche du lot** : bouton « Voir la vue depuis le balcon / la terrasse » (caméra à hauteur d'yeux devant la porte-fenêtre du lot, on glisse pour regarder autour), **galerie** de 8 visualisations avec plein écran, bouton **Fiche PDF** (impression du navigateur : vue 3D du lot en vert, infos, plan, 2 images, contact).
  - **Bouton « Soleil »** : 21 juin / 21 sept. / 21 déc. + heure (lecture automatique de la journée). Position réelle du soleil à Siviriez, mais l'orientation de la maquette est inventée → affiché « indicatif ».
  - 3D rapprochée des visualisations de Glauser : stores bruns, pas de panneaux solaires (on ne les voit pas sur leurs images), bacs en béton avec haies et arbres fins devant les terrasses.
- ⚠️ Images de `img/galerie/` = visualisations de Glauser Immobilier SA, reprises de leur annonce (glauserimmo.ch) **pour la démo qu'on leur montre**. Pour un autre prospect : utiliser SES images. Les légendes disent qu'elles ne montrent pas forcément le lot choisi.
- ⚠️ La forme de l'immeuble imite leurs visualisations (immeuble en L, parking au centre, rampe devant à gauche), mais sans les plans : proportions, fenêtres et place des lots ne sont pas exactes. Les visualisations de Glauser font foi.
- `vendor/three/` : three.js r160 (+ modules officiels Sky, post-traitement, BufferGeometryUtils). ⚠️ `GTAOPass.js` est modifié d'une ligne (marquée « Wibzo ») pour ignorer les volumes de couleur.
- ⚠️ Démo : la **position** des lots dans l'immeuble et les plans sont inventés (indiqué en bas de page). Pour un vrai client : reprendre les plans d'architecte (position de chaque lot, vrais plans en image).
- ⚠️ Le formulaire n'envoie rien dans la démo. Pour un vrai client : le brancher comme dans les configurateurs (Web3Forms vers l'e-mail du vendeur).

Tester en local (dans `demo-siviriez/`) :

```bash
python -m http.server 8731
```

puis ouvrir http://localhost:8731/

## Mise en ligne (faite le 12.11.2026 : https://siviriez.wibzo.ch)

Même système que les démos de configurateurs (`configurateurs/hebergement-demos/`) :
1. copier `demo-siviriez/` dans `configurateurs/clients/siviriez/` ;
2. `npx wrangler deploy` dans `configurateurs/hebergement-demos/` ;
3. la démo est sur https://siviriez.wibzo.ch

⚠️ Après une modification dans `demo-siviriez/`, recopier les fichiers changés dans `configurateurs/clients/siviriez/` puis refaire `npx wrangler deploy`. Sinon le site en ligne ne change pas.

## Prix (idée à tester, pas encore proposé)

Un seul paiement par promotion : **2'500 à 4'000 CHF** selon le nombre de lots, hébergement et mises à jour des statuts compris jusqu'à la fin de la vente.
À comparer : les agences de visualisation vendent ce genre d'outil bien plus cher, en plus des images 3D.
