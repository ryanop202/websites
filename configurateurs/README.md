# Wibzo 3D — configurateurs de carports

Configurateurs 3D vendus par Wibzo à des entreprises qui fabriquent des carports / couverts à voiture sur mesure.
Le client règle son carport, le voit en 3D avec un prix indicatif, télécharge une estimation PDF et envoie une demande de devis complète.

Projet de Ryan (Wibzo, contact@wibzo.ch), commencé le 28.10.2026. Code écrit avec Claude Code.
Ce dossier fait partie du dépôt `websites` (avec les sites, la prospection et les skills dans `../claude-skills/`). Règles générales : `../CLAUDE.md`.

## Ce qu'il y a dans ce dépôt

| Dossier / fichier | Contenu |
|---|---|
| `A-LIRE.md` | Historique du projet : choix de la niche, exemple de référence, toutes les fonctions de la démo |
| `PROSPECTS-CONFIGURATEUR.md` | Entreprises ciblées, ce qui a été vérifié, qui a été contacté et quand, relances |
| `carport-demo/` | **Version maître** (bois + alu). Toute nouvelle fonction se fait ici d'abord. Publiée comme démo publique sur https://demo.wibzo.ch |
| `demo-studio/` | Démo « studio de jardin » (13.11.2026), même moteur : produit `studio` (`carport-demo/produits/studio.js` + modèle `studio` dans `produits3d.js`). Pas encore en ligne, pas d'alerte e-mail. Pour les fabricants de studios / bureaux de jardin. |
| `demo-pergola/` | 2e démo publique, pergola en bois (même moteur) : https://pergola.wibzo.ch |
| `clients/<entreprise>/` | Une démo par entreprise : copie de la version maître + son `config.js`, son logo, son `MESSAGE.md` (mails), son `wrangler.jsonc` (mise en ligne) |
| `exemples-pdf/` | Estimations PDF générées par la démo (tests du 28.10.2026) |
| `outils-claude/` | Ce qui a servi à Claude pour ce projet : skills, réglages, mémoire (voir `outils-claude/README.md`) |

## Démos en ligne (29.10.2026)

| Entreprise | Démo | Matériau |
|---|---|---|
| Abris Bois / Tout en bois (Leysin) | https://abris-bois.wibzo.ch | bois |
| Sirbatec SA (Auboranges) | https://sirbatec.wibzo.ch | bois |
| SURTECH Sàrl (Ardon) | https://surtech.wibzo.ch | alu |
| Esto-Dip SA (Yverdon-les-Bains) | https://estodip.wibzo.ch | bois |

Suivi des contacts et des relances : `PROSPECTS-CONFIGURATEUR.md`.

## Comment ça marche (sans coder)

- **Tout ce qui change d'une entreprise à l'autre est dans `config.js`** : nom, logo, couleurs, dimensions min/max, toits, couvertures, teintes, options, **tarifs**.
- `app.js` = le moteur (3D, prix, PDF, formulaire). On ne le modifie que dans `carport-demo/`, puis on le recopie dans les clients si besoin.
- ⚠️ Les démos clients n'ont pas toutes le même `app.js` : Abris Bois et Sirbatec tournent sur l'ancienne version (sans l'alu). Ça marche, il n'y a rien à faire tant qu'on ne les modifie pas.
- Les prix des démos sont **FICTIFS**. Pour un vrai client : ses tarifs et ses règles techniques (portée entre poteaux, pentes, neige), validés par lui.

### Clés utiles de `config.js`

| Clé | Rôle |
|---|---|
| `materiau: 'alu'` | Structure aluminium (sinon bois) : pas de veinage, bandeau épais, pas de contrefiches |
| `libelles` | Remplace les textes (titre, « Finition du bois », « Local de rangement »…) |
| `equipements` | Options proposées parmi `gouttieres`, `led`, `borne` (liste vide = étape masquée) |
| `inclus` | Ce qui est compris d'office (ex. « évacuation des eaux intégrée dans les poteaux ») |
| `bardages[].couleur` / `sens` | Lames de fermeture avec leur propre teinte (bois ou alu), horizontales si `sens: 'horizontal'` |
| `couvertures` | `tuiles`, `tole`, `polycarbonate`, `epdm`, `gravier`, `vegetal`, `panneau` (toit isolé), `solaire` (photovoltaïque) |
| `suivi.cleWeb3Forms` | Alertes e-mail à contact@wibzo.ch (démo utilisée, PDF téléchargé, demande envoyée) |
| `local: false` | Pas de local de rangement (option et réglages retirés) |
| `sol: 'terrasse'` | Sol en lames de bois au lieu des pavés (pergola) |
| `entraxeChevrons` | Écart entre les chevrons en mètres (0,65 par défaut) |
| `couvertures.X.ouverte: true` | Toit ouvert : seulement les chevrons, sans plaque ni solin (pergola) |
| `libelles.objet / passage / largeurAide / hauteur / hauteurAide / implantationAide / parois` | Textes du produit (« pergola », « hauteur », « Brise-vue »…) |
| `vehicules` avec seulement `aucun` | Étape « Véhicule » retirée |

## « Voir chez moi » : réalité augmentée (13.11.2026, moteur maître)

Bouton « Voir chez moi » sur la vue 3D (tous les produits sauf la piscine). Code : `realite.js`.
- **iPhone / iPad** : le modèle est exporté en USDZ dans le navigateur (`USDZExporter` de three.js) et s'ouvre dans AR Quick Look : le produit en taille réelle dans le jardin.
- **Android (Chrome)** : réalité augmentée WebXR : viser le sol, toucher pour poser, boutons Tourner / Déplacer / Fermer, ombre réelle au sol.
- **Ordinateur** : QR code (bibliothèque `vendor/qrcode/qrcode.js`, MIT) qui ouvre la même configuration sur le téléphone, fenêtre déjà ouverte (`?ra=1`).
- Sans voitures (le client a la sienne) ni voiles d'ombre. Rien n'est envoyé à un serveur. Alerte e-mail « Réalité augmentée ouverte » si la démo a une clé Web3Forms.
- Testé le 13.11.2026 sur ordinateur : fenêtre + QR code OK, fichier iPhone généré sans erreur (carport 127 pièces / 6 Mo, pergola bio 64 / 2 Mo, studio 361 / 7 Mo, ~2 s). Test sur ordinateur : ajouter `?test-ra` à l'adresse puis `await testRA()` dans la console.
- ✅ **Testé sur iPhone par Ryan le 13.11.2026 : ça marche.** ⚠️ Android pas encore testé.
- ✅ **En ligne sur la démo publique https://demo.wibzo.ch depuis le 13.11.2026** (tous les produits sauf la piscine). Les démos clients déjà en ligne (Sirbatec, etc.) ne l'ont pas encore. Adresse de test (13.11.2026) : https://studio-test.wibzo.ch (copie de `demo-studio/` dans `clients/studio-test/`, sans alerte e-mail). À retirer de `clients/` quand le test est fini.
- Fichiers ajoutés : `realite.js`, `vendor/three/examples/jsm/exporters/USDZExporter.js`, `vendor/three/examples/jsm/utils/TextureUtils.js`, `vendor/qrcode/qrcode.js`. Pour un client : recopier ces fichiers avec `app.js`, `index.html`, `style.css`.

## Fiche technique pour l'entreprise (13.11.2026, moteur maître)

Pour les charpentes (carport, pergola bois ou alu ; pas pour véranda, pergola bio, terrasse, piscine, studio) :
- Bouton « Fiche technique : plan coté + pièces (PDF) » dans l'étape Prix (et dans le récapitulatif après la demande).
- PDF d'une page : **vue de dessus cotée** (largeur, profondeur, entraxes des poteaux, débords en tirets, maison, local), **vue de face cotée** (passage, hauteur totale, pente), **liste des pièces** (poteaux, contrefiches, sablières, muralière, fermes, chevrons, rives : quantité, longueur, section) et **surfaces** (couverture, parois, local, gouttières, pieds de poteaux, volume de bois).
- Mêmes règles que la 3D (sections 12×12, 12×20, 7×14, portée max `porteeMax`, entraxe `entraxeChevrons`). Marqué « débit indicatif, à valider » : pour un vrai client, reprendre SES sections et règles.
- La **demande de devis** envoyée à l'entreprise contient maintenant la liste des pièces + un lien `?fiche=1` qui ouvre la configuration directement sur le bouton de la fiche (mis en avant).
- Code : `ficheTechnique()` / `telechargerFiche()` dans `app.js`, `creerFicheTechnique()` dans `pdf.js`. Testé le 13.11.2026 : carport 2 pans + local arrière, carport 1 pan contre la maison + local latéral, pergola bois. ✅ En ligne sur https://demo.wibzo.ch depuis le 13.11.2026.

## Ouvrir une démo sur l'ordinateur

Les fichiers ne s'ouvrent pas par double-clic (modules JavaScript). Il faut un petit serveur :

```
cd clients/surtech
py -m http.server 8765
```

puis ouvrir http://127.0.0.1:8765 dans le navigateur. (Ou demander à Claude de le lancer.)

⚠️ Si la démo a une clé Web3Forms, l'utiliser envoie des alertes à contact@wibzo.ch.

## Faire une démo pour une nouvelle entreprise

1. Vérifier sur **leur site** ce qu'ils vendent (matériaux, toits, options, photos). Ne rien inventer : ce qui n'est pas vérifié est noté « à confirmer ».
2. Copier `carport-demo/` dans `clients/<nom>/` (sans `config.js`), puis écrire son `config.js` (partir d'un client existant).
3. Logo : repris de leur site s'il est téléchargeable, sinon initiales aux couleurs de l'entreprise.
4. Tester en local (voir plus haut), sur ordinateur et mobile.
5. Mettre en ligne (étape suivante), vérifier le lien sur un téléphone.
6. Écrire le mail dans `clients/<nom>/MESSAGE.md` (premier mail + une relance), noter le contact dans `PROSPECTS-CONFIGURATEUR.md`.

## Mettre en ligne (Cloudflare)

**Depuis le 11.11.2026 : une seule application Cloudflare (`wibzo-demos`) pour toutes les démos clients** (la version gratuite est limitée à 100 applications et 100 adresses par domaine).
`<nom>.wibzo.ch` affiche automatiquement le dossier `clients/<nom>/` (ligne DNS « * » + route `*.wibzo.ch/*`, voir `hebergement-demos/`).

Nouvelle démo ou démo modifiée :

```
cd hebergement-demos
npx wrangler deploy
```

- Plus besoin de `npx wrangler deploy` dans `clients/<nom>` (les `wrangler.jsonc` des clients ne servent plus). L'adresse marche tout de suite.
- `clients/.assetsignore` empêche de publier les `.md` (mails, offres), les PDF et les `wrangler.jsonc`, et liste les démos retirées (refus).
- `wibzo.ch`, `demo.wibzo.ch` et `pergola.wibzo.ch` gardent leur propre application ; `wibzo-demos` leur transmet les demandes (`services` dans `hebergement-demos/wrangler.jsonc`). Ne pas supprimer ces 3 applications.
- Test sans adresse : https://wibzo-demos.ryanoppliger2021.workers.dev/<nom>/

## Outils et services utilisés

| Outil | À quoi il sert | Coût |
|---|---|---|
| [Three.js](https://threejs.org) r160 (dans `vendor/three/`, licence MIT) | La 3D | gratuit |
| Polices Instrument Sans + JetBrains Mono (dans `vendor/fonts/`, licence OFL) | Textes | gratuit |
| Véhicules « Free Low Poly Vehicles Pack » de RGS_Dev (itch.io, CC0) | Voitures pour l'échelle (`modeles/`) | gratuit |
| Cloudflare Workers + `wrangler` (via `npx`) | Hébergement des démos sur `*.wibzo.ch` | gratuit (offre de base) |
| [Web3Forms](https://web3forms.com) | Alertes e-mail à contact@wibzo.ch | gratuit (offre de base) |
| Python `http.server` | Tester en local | gratuit |
| Claude Code (+ extension Claude in Chrome) | Code, recherches, tests dans le navigateur | abonnement Claude |

Tout est hébergé avec la démo : aucune ressource chargée depuis un autre serveur (sauf l'envoi des alertes Web3Forms).

## Règles du projet

- **Ne jamais inventer** : prix réels, prestations, dimensions, avis, infos sur l'entreprise (voir `../CLAUDE.md`).
- On imite les **fonctions** d'autres configurateurs (ex. Easycarport), jamais leur code, leurs modèles 3D, leur design ou leur marque.
- Prospection : messages personnalisés, un par un ; une seule relance ; règles LCD à vérifier.
- Farmwood (entreprise formatrice de Ryan) a donné son accord le 29.10.2026 pour vendre à des entreprises du bois de la région.
