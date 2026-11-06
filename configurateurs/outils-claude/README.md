# Outils Claude utilisés pour Wibzo 3D

Tout ce que Claude Code a utilisé pour créer les configurateurs (séances du 28.10.2026 et du 29.10.2026).

## Skills (compétences installées dans Claude Code)

| Skill | Utilisé pour | Où il est |
|---|---|---|
| **ckw-design** (Conner K. Ward, licence MIT) | Direction artistique de la démo : « papier / plan technique », cotes bleues, polices Instrument Sans + JetBrains Mono | Copie complète dans `websites/claude-skills/ckw-design/` — original : https://github.com/connerkward/ckw-design-skill |
| **update-config** (fourni avec Claude Code) | Autoriser Claude à lancer `npx wrangler deploy` sans redemander (voir « Réglages » plus bas) | intégré à Claude Code, rien à copier |
| **claude-in-chrome** (fourni avec Claude Code) | Piloter Chrome : tester les démos, regarder les sites des prospects | intégré à Claude Code + extension Chrome « Claude in Chrome » |

Pour réinstaller ckw-design sur un autre ordinateur : copier `websites/claude-skills/ckw-design/` dans `C:\Users\<nom>\.claude\skills\`.

## Outils de Claude Code utilisés

- **WebSearch / WebFetch** : recherche de la niche, des prospects, vérification de leurs sites (aucune info inventée).
- **Claude in Chrome** : tests des démos (ordinateur et mobile), photos des réalisations des prospects.
- **Bash / PowerShell** : serveur local (`py -m http.server`), mise en ligne (`npx wrangler deploy`), Git.

## Harvey (trouver des prospects) — installé le 29.10.2026

- Agent de prospection open source (MIT) : https://github.com/ethanplusai/harvey — installé dans `C:\Users\dessinateur22\harvey` (pas dans ce dépôt).
- Utilisé **seulement pour trouver des entreprises** (`harvey discover`, gratuit via OpenStreetMap) et lire leurs sites. **Aucun envoi** : e-mail et LinkedIn désactivés dans `harvey.local.yaml`, aucune boîte mail branchée. Ne jamais lancer `harvey run` (boucle automatique).
- Réglages Wibzo : `harvey.local.yaml` (cible charpentiers/menuisiers autour de Payerne, Yverdon, Moudon, Fribourg, Bulle, Lausanne, avec coordonnées fixées à la main : Nominatim plaçait Bulle en France).
- Modification locale du code : `harvey/collectors/discover.py`, catégories OpenStreetMap « charpent » / « carpent » / « menuis » ajoutées.
- Tableau de bord : dans PowerShell, `cd C:\Users\dessinateur22\harvey` puis `.venv\Scripts\harvey dashboard`, ouvrir le lien affiché.
- Limite : OpenStreetMap recense peu d'artisans en Suisse (45 trouvés au 29.10.2026, dont 25 sans site web), et ses serveurs gratuits saturent souvent (relancer `harvey discover` plus tard).

## Vidéos (reel Instagram, 06.11.2026)

- **Playwright** (Python, `pip install playwright`) avec le Chrome installé (`channel="chrome"`) : filme la démo et rend l'animation image par image (horloge virtuelle, donc fluide à 30 i/s).
- **imageio-ffmpeg** (`pip install imageio-ffmpeg`) : fournit ffmpeg pour le montage (images + voix → MP4).
- **ElevenLabs** (connecteur claude.ai) : voix off française, voix « Thierry » (léger accent suisse), modèle eleven_v4. Coûte des crédits ElevenLabs (518 crédits pour 2 prises de 12 s).
- Skill **frontend-design** : direction artistique du motion design.
- Tout est dans `configurateurs/marketing/reel-apporteur/` (README avec les étapes pour refaire la vidéo).

## Réglages (`C:\Users\<nom>\.claude\settings.json`)

Ajouté le 28.10.2026 à la demande de Ryan, pour que la mise en ligne des démos ne demande pas de confirmation :

```json
{
  "permissions": {
    "allow": [
      "Bash(npx wrangler deploy*)",
      "Bash(npx --yes wrangler deploy*)"
    ]
  }
}
```

## Mémoire de Claude

`memoire/project_configurateurs_carport.md` : copie (29.10.2026) de la note que Claude garde entre les séances
(original : `C:\Users\dessinateur22\.claude\projects\C--Users-dessinateur22\memory\`). Elle peut évoluer : l'original fait foi.

## Règles

`websites/CLAUDE.md` : les règles générales de Wibzo que Claude suit (ne rien inventer, style, communication).
