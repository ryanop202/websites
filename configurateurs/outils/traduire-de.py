# Fabrique la version allemande de la démo (carport-demo-de/) à partir de carport-demo/ (11.11.2026).
# Les textes sont dans outils/traduction-de.json (paires « français exact → allemand »).
# Après une modification de carport-demo/ : relancer ce script. S'il dit qu'un texte français est introuvable,
# c'est que le texte a changé dans carport-demo/ : mettre la paire à jour dans traduction-de.json.
# Seulement carport et véranda (les produits vendus en Suisse alémanique pour l'instant).
# Usage : py outils/traduire-de.py
import json
import shutil
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SRC = RACINE / 'carport-demo'
DST = RACINE / 'carport-demo-de'
PAIRES = json.loads((RACINE / 'outils' / 'traduction-de.json').read_text(encoding='utf-8'))

# On vide le dossier sans le supprimer (un serveur de test peut l'avoir ouvert)
if DST.exists():
    for p in DST.iterdir():
        shutil.rmtree(p) if p.is_dir() else p.unlink()
shutil.copytree(SRC, DST, ignore=shutil.ignore_patterns('.wrangler', 'wrangler.jsonc', 'config.js', '*.pdf'), dirs_exist_ok=True)

erreurs = []
tout = PAIRES.get('_tout', [])
tout_vus = set()
for fichier, paires in PAIRES.items():
    if fichier.startswith('_'):
        continue
    chemin = DST / fichier
    texte = chemin.read_text(encoding='utf-8')
    for fr, de in paires:
        n = texte.count(fr)
        if n == 0:
            erreurs.append(f'{fichier} : introuvable → {fr[:90]!r}')
        texte = texte.replace(fr, de)
    for fr, de in tout:
        if fr in texte:
            tout_vus.add(fr)
            texte = texte.replace(fr, de)
    chemin.write_text(texte, encoding='utf-8')
for fr, _ in tout:
    if fr not in tout_vus:
        erreurs.append(f'_tout : introuvable → {fr!r}')

# Démo maître allemande : seulement carport et véranda
(DST / 'config.js').write_text("""// Version allemande (fabriquée par outils/traduire-de.py, ne pas modifier à la main).
// Démo maître DE : carport et véranda. Pour une démo client : remplacer ce fichier par la config du client.
import { CONFIG as carport } from './produits/carport.js';
import { CONFIG as veranda } from './produits/veranda.js';

export const PRODUITS = {
  carport: {
    label: 'Carport', aide: 'Offener Unterstand für ein oder zwei Autos, Geräteraum optional.',
    icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: carport,
  },
  veranda: {
    label: 'Wintergarten', aide: 'Verglaster Raum aus Aluminium, an die Fassade angebaut.',
    icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: veranda,
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
""", encoding='utf-8')

if erreurs:
    print('⚠️  Textes français introuvables (traduction à mettre à jour) :')
    print('\n'.join(erreurs))
    sys.exit(1)
print('ok : carport-demo-de/ prête')
