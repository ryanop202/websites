# Prépare les démos « studio de jardin » (15.11.2026), en français ou en allemand selon le prospect :
# copie de carport-demo/ (fr) ou carport-demo-de/ (de, fabriqué par outils/traduire-de.py),
# config.js au nom de l'entreprise (produit studio, alertes e-mail actives) et MESSAGE.md (mail prêt).
# Liste : JSON [[id, nom, email, site, langue ('fr'|'de'), phrase de preuve, ...], ...] (outils/assembler-studios.py) — la phrase ne cite
# que ce qui a été vu sur leur site (rien d'inventé). Tous les PRIX sont FICTIFS.
# Usage : py outils/demo-studio.py <liste.json>   puis `npx wrangler deploy` dans hebergement-demos/.
import json
import re
import shutil
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SOURCES = {'fr': RACINE / 'carport-demo', 'de': RACINE / 'carport-demo-de'}
IGNORER = shutil.ignore_patterns('.wrangler', 'config.js', 'wrangler.jsonc', 'MESSAGE.md', '*.pdf', 'produits')
ICONE = '<path d="M3 20h18M5 20V9h14v11M3 9.5 12 5l9 4.5M9 20v-6h6v6"/>'
TEXTES = {
    'fr': dict(label='Studio de jardin', aide='Bureau, atelier ou pièce en plus au fond du jardin.',
               activite='Studios & bureaux de jardin', objet='Studio de jardin'),
    'de': dict(label='Gartenstudio', aide='Büro, Atelier oder zusätzlicher Raum im Garten.',
               activite='Gartenstudios & Holzbau', objet='Gartenstudio'),
}
MAILS = {
    'fr': """Bonjour,

Je m'appelle Ryan, j'habite près de Payerne et je développe des configurateurs 3D pour les fabricants de produits sur mesure.

{phrase}

J'en ai préparé une démonstration personnalisée :

https://{id}.wibzo.ch/

Vos clients peuvent directement :
- Configurer leur studio de jardin en 3D.
- Modifier les dimensions, le bardage et les coloris.
- Ajouter des options (baie coulissante, toit végétalisé, terrasse, éclairage LED).
- Visualiser un prix indicatif.
- Vous envoyer une demande de devis détaillée.

Les prix affichés sont fictifs et seraient remplacés par vos tarifs.

L'objectif est de permettre à vos clients de visualiser leur projet avant de vous contacter, tout en vous faisant gagner du temps dans le traitement des demandes.

Est-ce qu'un outil de ce type pourrait vous intéresser pour votre entreprise ?

Meilleures salutations,

Ryan
Wibzo
contact@wibzo.ch
https://wibzo.ch""",
    'de': """Guten Tag

Mein Name ist Ryan, ich entwickle 3D-Konfiguratoren für Unternehmen, die nach Mass fertigen.

{phrase} Ich bin überzeugt, dass ein Konfigurator auf Ihrer Website Ihren Verkauf deutlich steigern und Ihre Offertanfragen stark vereinfachen kann. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:

https://{id}.wibzo.ch/

So funktioniert es:
- Ihre Kunden stellen ihr Gartenstudio selbst in 3D zusammen und sehen sofort einen Richtpreis.
- Sie erhalten eine vollständige Anfrage mit allen Massen, Optionen und einem 3D-Bild, ohne langes Hin und Her.
- Ihre Website hebt sich klar von der Konkurrenz ab.

Das ist erst eine erste Version mit fiktiven Preisen. Wenn Sie interessiert sind, gehe ich gerne weiter und passe sie an Ihre Modelle, Optionen, Farben und Preise an.

Hätten Sie Interesse, diesen Konfigurator zu nutzen?

Freundliche Grüsse
Ryan
Wibzo · contact@wibzo.ch""",
}
OBJETS = {'fr': 'Configurateur 3D pour {nom}', 'de': '3D-Demo für {nom}'}
js = lambda v: json.dumps(v, ensure_ascii=False)


def initiales(nom):
    mots = [m for m in re.split(r'[\s\-.&]+', nom) if m[:1].isalpha() and m.lower() not in ('ag', 'gmbh', 'sa', 'sàrl', 'sarl', 'und', 'et', 'ch')]
    return ''.join(m[0].upper() for m in mots[:2]) or nom[:2].upper()


for id_, nom, email, site, langue, phrase, *_ in json.loads(Path(sys.argv[1]).read_text(encoding='utf-8')):
    t = TEXTES[langue]
    dst = RACINE / 'clients' / id_
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(SOURCES[langue], dst, ignore=IGNORER)
    (dst / 'produits').mkdir()
    shutil.copy(SOURCES[langue] / 'produits' / 'studio.js', dst / 'produits' / 'studio.js')
    (dst / 'config.js').write_text(f"""// Démo « studio de jardin » ({langue}) préparée pour {nom}, 15.11.2026 (outils/demo-studio.py).
// Repris de {site} : {phrase} (vu le 15.11.2026). ⚠️ Tous les PRIX sont FICTIFS.
// Mise en ligne : `npx wrangler deploy` dans hebergement-demos/ (application unique, voir README).
import {{ CONFIG as base }} from './produits/studio.js';

const produit = {{
  ...base,
  entreprise: {{ nom: {js(nom)}, activite: {js(t['activite'])}, initiales: {js(initiales(nom))}, logo: '', email: '' }},
  // Alertes à contact@wibzo.ch (démo utilisée, PDF, demande) : clé publique, faite pour le code de la page
  suivi: {{ cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }},
}};

export const PRODUITS = {{
  studio: {{ label: {js(t['label'])}, aide: {js(t['aide'])}, icone: {js(ICONE)}, config: produit }},
}};

export const PRODUIT = 'studio';
export const CONFIG = {{ ...produit, assistant: true, couleurs: {{ plan: '#3D3A35', 'plan-clair': '#EFEBE3' }} }};
""", encoding='utf-8')
    objet = OBJETS[langue].format(nom=nom)
    (dst / 'MESSAGE.md').write_text(f"""# {nom} — premier mail ({langue}, préparé le 15.11.2026)

**À :** {email}
**Objet :** {objet}
**Démo :** https://{id_}.wibzo.ch/
**Preuve :** {site} : {phrase}

```
{MAILS[langue].format(phrase=phrase, id=id_)}
```
""", encoding='utf-8')
    print('ok', id_, langue)
