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
