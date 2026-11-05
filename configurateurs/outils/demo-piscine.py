# Prépare les démos « piscine » des pisciniers (05.11.2026) : copie de carport-demo/ + config à leur nom,
# leurs revêtements (vus sur leur site), leur logo, et le mail prêt (MESSAGE.md, modèle MAIL-TYPE.md).
# Usage : python outils/demo-piscine.py <dossier des logos>   puis `npx wrangler deploy` dans clients/<id>.
import json
import shutil
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SRC = RACINE / 'carport-demo'
LOGOS = Path(sys.argv[1]) if len(sys.argv) > 1 else None

# Revêtements (teintes d'exemple ; « eau » = couleur de l'eau avec ce revêtement)
T_BLANC = {'label': 'Blanc', 'couleur': '#EEF1F0', 'eau': '#45BFDB'}
T_SABLE = {'label': 'Sable', 'couleur': '#E4D6B8', 'eau': '#3FB5AA'}
T_BLEU = {'label': 'Bleu pâle', 'couleur': '#9CC7E2', 'eau': '#2F96CF'}
T_GRIS = {'label': 'Gris anthracite', 'couleur': '#5B6166', 'eau': '#2E7A86'}
T_NOIR = {'label': 'Noir', 'couleur': '#2C2F33', 'eau': '#23515A'}
BETON = {'label': 'Béton armé, membrane armée', 'teintes': {'blanc': T_BLANC, 'sable': T_SABLE, 'gris': T_GRIS, 'noir': T_NOIR}}
COQUE = {'label': 'Coque polyester', 'teintes': {'blanc': T_BLANC, 'sable': T_SABLE, 'bleu': T_BLEU, 'gris': T_GRIS}}
INOX = {'label': 'Acier inoxydable', 'metal': True, 'teintes': {
    'brosse': {'label': 'Inox brossé', 'couleur': '#C3C9CD', 'eau': '#42B9D4'},
    'poli': {'label': 'Inox poli', 'couleur': '#DCE1E4', 'eau': '#47C2DC'},
}}
MINERAL = {'label': 'Enduit minéral (100 % béton)', 'teintes': {
    'blanc': {'label': 'Blanc', 'couleur': '#EDEDEA', 'eau': '#45BFDB'},
    'perle': {'label': 'Gris perle', 'couleur': '#B9BDBF', 'eau': '#3AA6BF'},
    'sable': {'label': 'Sable', 'couleur': '#DCCDB0', 'eau': '#3FB5AA'},
    'anthracite': {'label': 'Anthracite', 'couleur': '#55595D', 'eau': '#2E7A86'},
}}
LISTE_STD = ['Configurer leur piscine en 3D.', 'Modifier les dimensions, le revêtement et les coloris.',
             'Ajouter des options (escalier, plage, volet immergé, éclairage LED).']

CLIENTS = [
    dict(id='piscine-essentielle', nom='Piscine Essentielle', activite='Piscines béton & coques · St-Aubin-Sauges', initiales='PE',
         logo=None, email='info@piscinessentielle.ch', site='piscinessentielle.ch',
         preuve='« construction neuve, rénovation », piscines en béton armé et en coques polyester',
         couvertures={'beton': BETON, 'coque': COQUE}, decouvrant='vos piscines en béton armé et en coque polyester',
         liste=['Configurer leur piscine en 3D.', 'Modifier les dimensions, le type de bassin et les coloris.', LISTE_STD[2]]),
    dict(id='mad-inoxial', nom='MAD inoxial', activite='Piscines & spas en inox · Grolley', initiales='MI',
         logo=None, email='info@madinoxial.com', site='madinoxial.com',
         preuve='« réalisation de piscines/SPA en acier inoxydable »',
         couvertures={'inox': INOX}, decouvrant='vos piscines en acier inoxydable',
         liste=['Configurer leur piscine en inox en 3D.', "Modifier les dimensions et la finition de l'inox.", LISTE_STD[2]]),
    dict(id='piscines-concept', nom='Piscines Concept Services', activite='Piscines sur mesure · Gland', initiales='PCS',
         logo='concept-off.png', email='info@piscines-concept-services.ch', site='piscines-concept-services.ch',
         preuve='« Conception et réalisation de piscines sur mesure »',
         couvertures=None, decouvrant='vos piscines sur mesure', liste=LISTE_STD),
    dict(id='perroud-piscines', nom='Perroud Piscines', activite='Piscines minérales en béton · Nyon', initiales='PP',
         logo='perroud-crop.png', email='perroudpiscines@etik.com', site='perroudpiscines.ch',
         preuve='« La piscine minérale 100% béton sans membrane ni carrelage »',
         couvertures={'mineral': MINERAL}, decouvrant='vos piscines minérales 100 % béton',
         liste=['Configurer leur piscine en 3D.', "Modifier les dimensions, la teinte de l'enduit et les margelles.", LISTE_STD[2]]),
    dict(id='lagon-bleu', nom='Piscines Lagon Bleu', activite='Construction & rénovation de piscines · Crans', initiales='PLB',
         logo='lagon.png', email='piscines.lagonbleu@hotmail.com', site='piscines-lagon-bleu.ch',
         preuve='« construction et rénovation de piscines à Crans »',
         couvertures=None, decouvrant='vos constructions de piscines', liste=LISTE_STD),
    dict(id='flopiscine', nom='FLO piscine', activite='Création & entretien de piscines · Saxon', initiales='FP',
         logo=None, email='info@flopiscine.ch', site='flopiscine.ch',
         preuve='« Création et entretien de piscines », « plus de 20 ans d’expérience »',
         couvertures=None, decouvrant='vos créations de piscines', liste=LISTE_STD),
    dict(id='profil-piscines', nom='Profil Piscines', activite='Piscines & jacuzzis sur mesure · Martigny', initiales='PP',
         logo='profil.jpeg', email='info@profilpiscines.ch', site='profilpiscines.ch',
         preuve='« Piscine et Jacuzzi sur mesure de qualité »',
         couvertures=None, decouvrant='vos piscines sur mesure', liste=LISTE_STD),
    dict(id='bepiscines', nom='BE Piscines', activite='Constructeur de piscines depuis 1960 · Genève', initiales='BE',
         logo='be.png', email='info@bepiscines.ch', site='bepiscines.ch',
         preuve='« Créateur et constructeur de piscine de père en fils depuis 1960 »',
         couvertures=None, decouvrant='vos piscines', liste=LISTE_STD),
    dict(id='astro-piscines', nom='Astro Piscines', activite='Constructeur de piscines depuis 1974 · Genève & Nyon', initiales='AP',
         logo='astro2.png', email='info@astro-piscines.ch', site='astro-piscines.ch',
         preuve='« Constructeur de piscine en Suisse depuis 1974 », « Piscine béton, coque polyester ou inox »',
         couvertures={'beton': BETON, 'coque': COQUE, 'inox': INOX}, decouvrant='vos piscines en béton, en coque polyester et en inox',
         liste=['Configurer leur piscine en 3D.', 'Modifier les dimensions, le type de bassin et les coloris.', LISTE_STD[2]]),
]

MAIL = """Bonjour,

Je m'appelle Ryan, j'habite près de Payerne et je développe des configurateurs 3D pour les fabricants de produits sur mesure.

En découvrant {decouvrant} sur votre site, j'ai eu une idée : vous montrer à quoi pourrait ressembler un configurateur 3D adapté à vos produits.

J'en ai préparé une démonstration personnalisée :

https://{id}.wibzo.ch/

Vos clients peuvent directement :
- {l1}
- {l2}
- {l3}
- Visualiser un prix indicatif.
- Vous envoyer une demande de devis détaillée.

Les prix affichés sont fictifs et seraient remplacés par vos tarifs.

L'objectif est de permettre à vos clients de visualiser leur projet avant de vous contacter, tout en vous faisant gagner du temps dans le traitement des demandes.

Est-ce qu'un outil de ce type pourrait vous intéresser pour votre entreprise ?

Meilleures salutations,

Ryan
Wibzo
contact@wibzo.ch
https://wibzo.ch"""

IGNORER = shutil.ignore_patterns('.wrangler', 'config.js', 'wrangler.jsonc', 'MESSAGE.md', '*.pdf')

for c in CLIENTS:
    dst = RACINE / 'clients' / c['id']
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(SRC, dst, ignore=IGNORER)
    logo = "''"
    if c['logo'] and LOGOS:
        (dst / 'marque').mkdir(exist_ok=True)
        ext = Path(c['logo']).suffix
        shutil.copy(LOGOS / c['logo'], dst / 'marque' / f'logo{ext}')
        logo = f"'marque/logo{ext}'"
    surcharge = ''
    if c['couvertures']:
        cles = list(c['couvertures'])
        premier = c['couvertures'][cles[0]]
        surcharge = f"""
  couvertures: {json.dumps(c['couvertures'], ensure_ascii=False, indent=2)},
  toits: Object.fromEntries(Object.entries(base.toits).map(([id, t]) => [id, {{ ...t, couvertures: {json.dumps(cles)} }}])),
  defauts: {{ ...base.defauts, couverture: '{cles[0]}', teinteCouverture: '{list(premier['teintes'])[0]}' }},"""
    nom_js = c['nom'].replace("'", "\\'")
    act_js = c['activite'].replace("'", "\\'")
    (dst / 'config.js').write_text(f"""// Démo préparée pour {c['nom']}, 05.11.2026 (outils/demo-piscine.py, produit « piscine »).
// Repris de {c['site']} : {c['preuve']} (vérifié le 05.11.2026). Seulement leurs revêtements quand le site les nomme.
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les teintes (exemples). Mise en ligne : `npx wrangler deploy` dans ce dossier.
import {{ CONFIG as base }} from './produits/piscine.js';

const ENTREPRISE = {{
  nom: '{nom_js}',
  activite: '{act_js}',
  initiales: '{c['initiales']}',
  logo: {logo},
  email: '', // e-mail qui reçoit les demandes (vide = démo)
}};
const piscine = {{
  ...base,
  entreprise: ENTREPRISE,{surcharge}
}};

export const PRODUITS = {{
  piscine: {{
    label: 'Piscine', aide: 'Bassin sur mesure, escalier, margelles, plage et options.',
    icone: '<path d="M3 9h18v9H3zM6 12c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M7 9V5h2M7 7h2"/>', config: piscine,
  }},
}};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'piscine';
export const CONFIG = {{ ...PRODUITS[PRODUIT].config, assistant: true, couleurs: {{ plan: '#3D3A35', 'plan-clair': '#EFEBE3' }} }};
""", encoding='utf-8')
    (dst / 'wrangler.jsonc').write_text(f"""{{
  // Démo {c['nom']} : https://{c['id']}.wibzo.ch — mise à jour : `npx wrangler deploy` dans ce dossier
  "name": "{c['id']}-3d-configurateur",
  "compatibility_date": "2026-10-23",
  "workers_dev": false,
  "routes": [{{ "pattern": "{c['id']}.wibzo.ch", "custom_domain": true }}],
  "assets": {{ "directory": "." }}
}}
""", encoding='utf-8')
    l1, l2, l3 = c['liste']
    mail = MAIL.format(decouvrant=c['decouvrant'], id=c['id'], l1=l1, l2=l2, l3=l3)
    (dst / 'MESSAGE.md').write_text(f"""# {c['nom']} — prise de contact (préparé le 05.11.2026, modèle MAIL-TYPE.md)

**À :** {c['email']}
**Objet :** Démo 3D préparée pour {c['nom']}
**Démo :** https://{c['id']}.wibzo.ch/
**Preuve :** {c['site']} : {c['preuve']}

```
{mail}
```
""", encoding='utf-8')
    print('ok', c['id'])
