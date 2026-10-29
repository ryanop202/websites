---
name: project-configurateurs-carport
description: "Configurateurs 3D carport (offre Wibzo) dans websites/configurateurs — démo, démos clients, prospects ; à distinguer de MX Skin Studio"
metadata:
  node_type: memory
  type: project
  originSessionId: 980930e1-4e8e-4d77-8282-079e3d7dbb90
  modified: 2026-10-29T06:42:45.784Z
---

« Les configurateurs 3D » = carports bois (Three.js) dans C:\Users\dessinateur22\websites\configurateurs, PAS MX Skin Studio ([[project-mx-skin-studio]]). Notes de référence : A-LIRE.md et PROSPECTS-CONFIGURATEUR.md dans ce dossier.

Au 2026-10-29 (vérifié) :
- carport-demo/ = version maître (bois + alu) ; Abris Bois et Sirbatec tournent sur l'ancien app.js sans l'alu.
- abris-bois.wibzo.ch et sirbatec.wibzo.ch sont en ligne (contenu à leur nom). (PROSPECTS-CONFIGURATEUR.md mis à jour le 29.10.)
- Abris Bois : e-mail envoyé le 28.10 ; relance prévue le 04.11.2026. Sirbatec : RÉPONSE POSITIVE le 29.10 (Mathias Ruffieux, administrateur, m.ruffieux@sirbatec.ch), voulait un RDV mi-novembre ; Ryan ne fait ni RDV ni appel, uniquement e-mail/messages. Prix du configurateur pas encore fixé.
- SURTECH : démo alu prête dans clients/surtech (29.10), en ligne sur surtech.wibzo.ch, e-mail envoyé le 29.10, relance le 05.11.2026 ; messages dans clients/surtech/MESSAGE.md. carport-demo/app.js a maintenant la version alu terminée (clés materiau, libelles, equipements, inclus).
- Esto-Dip (Yverdon) : en ligne sur estodip.wibzo.ch, mail ENVOYÉ le 29.10 à info@estodip.ch, relance 05.11.2026. Farmwood a donné son accord le 29.10.2026 (dit par Ryan).
- Git (29.10.2026) : configurateurs est dans le repo privé websites (github.com/ryanop202/websites), choix de Ryan pour avoir tout Wibzo au même endroit. Le repo séparé github.com/ryanop202/wibzo-3d (1 commit) ne sert plus (à Ryan de le supprimer s il veut). Skills dans websites/claude-skills/. Ryan veut TOUT dessus : code, notes, outils/skills utilisés (configurateurs/outils-claude/README.md), mémoire. Après chaque séance : mettre à jour outils-claude/ si nouvel outil, commit de configurateurs/ seulement + push.

**Why:** l'utilisateur a demandé « t'en es où » et j'ai d'abord répondu sur le mauvais projet.
**How to apply:** pour « configurateurs », lire d'abord ces deux .md, puis vérifier ce qui est en ligne.
- Harvey (github.com/ethanplusai/harvey) installé le 29.10 dans C:\Users\dessinateur22\harvey, usage = trouver des prospects uniquement (discover/profile, OSM gratuit), envoi désactivé (harvey.local.yaml), jamais `harvey run`. Ryan ouvre le dashboard lui-même (token). Détails : configurateurs/outils-claude/README.md.
- MJL Rossier (Château-d'Œx) : démo en ligne mjl-rossier.wibzo.ch, mail ENVOYÉ le 29.10 à jlrossier@hotmail.com (avec proposition de refaire leur site « à prix abordable »), relance 05.11.2026. Graz SA : pas de couvert à voiture → pas de démo.
- Nicolet Charpente SA (Cheiry FR) : démo en ligne nicolet.wibzo.ch, mail ENVOYÉ le 29.10 à info@nicoletcharpente.ch, relance 05.11 (configurateur + nouveau site). GBC Entreprise (Romont) : prospect suivant, pas de démo. Nouveau : bardages[].couleur marche aussi en bois.
- GBC Entreprise (Romont) : démo en ligne gbc.wibzo.ch, mail ENVOYÉ le 29.10 à construction@gbcentreprise.ch, relance 05.11 (configurateur + nouveau site).
