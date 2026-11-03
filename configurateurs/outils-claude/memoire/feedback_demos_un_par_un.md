---
name: feedback-demos-un-par-un
description: "Démos configurateur : une entreprise à la fois (démo → publier → message prêt), attendre le signal de Ryan, économiser les tokens"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 66a5770d-7f19-493d-9952-195ccbe7cb9f
  modified: 2026-11-03T09:15:55.544Z
---

Pour les 15 prospects du 03.11.2026 (liste dans PROSPECTS-CONFIGURATEUR.md, [[project-configurateurs-carport]]) : **une entreprise à la fois**, dans l'ordre (n° 1 David Giller, puis Robatel, Eloi Bosson…). Pour chacune : faire la démo (copie de carport-demo/, config.js comme clients/gothuey), la publier (`npx wrangler deploy`), puis donner à Ryan le mail prêt à copier. **Ne commencer qu'au signal de Ryan.**

Modèle du mail — à garder EXACTEMENT (texte final de Ryan, 03.11.2026, donné en bloc de code sans barres « > ») :
```
Bonjour,

Je m'appelle Ryan, j'habite près de Payerne et je crée des configurateurs 3D pour les entreprises qui fabriquent sur mesure.

En voyant votre rubrique « Garage et couvert » sur votre site, j'ai préparé une démo à votre nom :

Configurateur 3D — démo
https://<client>.wibzo.ch/

Vos clients dessinent leur couvert en 3D, voient un prix indicatif et vous envoient une demande de devis complète.
Ça peut vous démarquer de vos concurrents, et c'est simple et rapide à installer.

Les prix sont fictifs, je les remplacerais par les vôtres.

Seriez-vous intéressés à utiliser ce configurateur ?

Meilleures salutations,
Ryan
Wibzo · contact@wibzo.ch
```
Seule la phrase « En voyant… » change (leur vraie preuve). Ne PAS écrire de relance ni de suivi détaillé (MESSAGE.md = destinataire, objet, mail). Quand Ryan dit « prochain », le mail précédent est ENVOYÉ : le noter en une ligne dans PROSPECTS-CONFIGURATEUR.md.

**Why:** Ryan a besoin de ses tokens : « fais le travail à 100 % mais dépense pas tous mes tokens ».
**How to apply:** travail complet (démo vérifiée en ligne, message, suivi + commit), mais peu d'appels : une seule lecture du site du client, pas de recherches en plus, réponses courtes.
