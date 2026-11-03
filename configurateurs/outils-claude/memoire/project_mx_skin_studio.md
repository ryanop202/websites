---
name: project-mx-skin-studio
description: MX Skin Studio — configurateur web de tenues MX Simulator dans C:\Users\dessinateur22\mx-skin-studio ; état et blocages
metadata:
  node_type: memory
  type: project
  originSessionId: a9f8b48f-bee2-4720-bef8-6aa2a1eb55d0
  modified: 2026-10-27T10:48:52.547Z
---

Projet commercial de l'utilisateur : site qui applique nom/numéro sur des templates de tenues MX Simulator (React+Vite+TS, moteur Canvas dans src/engine, tests vitest + @napi-rs/canvas, design « plaque numéro » jaune sur graphite).

Au 2026-10-27 :
- PSD « 2023 Alpinestar Public PSD » (Supertech, Techstar ; 2048×4096, sans flocage) préparés via `npm run bake`. Fonctionnent dans le site, export ZIP.
- Ces PSD visent très probablement le modèle **JRE v2** (payant, auteur « JRE ») — pas le rider_body officiel. L'utilisateur n'a pas de .jm. Ne pas recréer/copier ce modèle (droits).
- Nommage corrigé : skin rider_body-MODELE-SKIN.png ; _norm/_spec au nom du MODÈLE (rider_body-MODELE_norm.png), d'après forum t=57380.
- Vue 3D Three.js (src/app/Rider3D.tsx) + lecteur .jm (src/engine/jm.ts) validés sur le rider_body.jm officiel 2008 (téléchargé dans sources/models/, template démo `mxs-officiel-2008`, pilote en T-pose regardant −Z). La maquette 2D a été supprimée (l'utilisateur la trouvait horrible).

- L'utilisateur ne veut rien acheter pour l'instant (phase de test). Solution en place : « aperçu adapté » qui transfère la texture Alpinestars sur le pilote officiel 2008 (src/engine/remap.ts + public/templates/alpinestars-*/remap-officiel-2008.json ; mains et bottes gardent la texture d'origine).

- Scène « sur la moto » : fichiers officiels mxsimulator.com/models (yz250f_clean.blend, yz250f.ppm, rider.blend, wheels2.zip) lus sans Blender (scripts/lib/blend.mjs, images.mjs) → public/models/mxs-yz250f/scene.json ; pose de roulage par IK (pose.ts). Casque/bottes peints (riderhead.png non publié ; pas de logos Fox/Alpinestars). Ne jamais extraire les .saf de créateurs tiers (protection voulue par la communauté).
- Plus de numéros sur les manches (demande explicite de l'utilisateur).

Bloquants : modèle JRE v2 (achat) ; aucun test en jeu (MXS absent de ce PC de travail) ; droits Alpinestars/auteurs non établis (exclus du build prod).

**Why:** l'utilisateur exige qu'on n'invente jamais formats, noms de modèle ou résultats de tests.
**How to apply:** prochaine étape = l'utilisateur achète JRE v2 ou on crée un modèle/template original ; puis test en jeu via docs/TEST-MX-SIMULATOR.md. Voir [[user-profile]].
