# Prépare les démos ALLEMANDES (Suisse alémanique, 11.11.2026) : copie de carport-demo-de/ + config au nom
# de l'entreprise, son logo, et le mail prêt (MESSAGE.md, en allemand).
# carport-demo-de/ est fabriqué par outils/traduire-de.py (à lancer avant si carport-demo/ a changé).
# Usage : py outils/demo-de.py <dossier des logos>   puis `npx wrangler deploy` dans clients/<id>.
# Preuves : vues sur le site de chaque entreprise le 11.11.2026 (voir « preuve »). Tous les PRIX sont FICTIFS.
import json
import shutil
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SRC = RACINE / 'carport-demo-de'
LOGOS = Path(sys.argv[1]) if len(sys.argv) > 1 else None

# Carport en métal (Texbau : acier galvanisé) : moteur « alu », coloris de la structure
METAL = {
    'materiau': 'alu',
    'produit': 'Stahl-Carport',
    'libelles': {'titre': 'Stahl-Carport nach Mass', 'finition': 'Farbe der Konstruktion', 'finitionCourt': 'Farbe',
                 'finitionLigne': 'Konstruktion', 'hauteurAide': 'unter der Konstruktion',
                 'implantationAide': 'Am Haus wird der Carport an der Fassade befestigt: eine Pfostenreihe weniger.'},
    'bois': {'verzinkt': {'label': 'Feuerverzinkt', 'couleur': '#A3A8AB', 'facteur': 1},
             'anthrazit': {'label': 'Anthrazit (RAL 7016)', 'couleur': '#3A3D40', 'facteur': 1.08},
             'weiss': {'label': 'Weiss (RAL 9016)', 'couleur': '#E8E7E2', 'facteur': 1.08}},
    'toits': {'plat': {'label': 'Flachdach', 'pente': 2, 'couvertures': ['tole', 'polycarbonate']},
              'unPan': {'label': 'Pultdach', 'pente': 8, 'couvertures': ['tole', 'polycarbonate']}},
    'defauts_extra': {'bois': 'verzinkt', 'toit': 'plat', 'couverture': 'tole', 'teinteCouverture': 'anthracite'},
}
# Toiture photovoltaïque (swisscarport.ch fait des Solarcarports)
SOLAIRE = {'label': 'Solarmodule (Photovoltaik)', 'epaisseur': 0.04, 'teintes': {'noir': {'label': 'Schwarz', 'couleur': '#1E2228'}}}

CLIENTS = [
    # Logo du site en blanc (fait pour fond sombre) : initiales
    dict(id='swisscarport', nom='swisscarport.ch', activite='Carports nach Mass · Attiswil', initiales='SC',
         logo=None, email='info@swisscarport.ch', site='swisscarport.ch', produit='carport', solaire=True,
         preuve='« Individuell nach Kundenwunsch geplante Carports », « Tragkonstruktion Holz oder Holz-Metall », Velo- und Geräteräume, Solarcarports',
         phrase='Auf Ihrer Website habe ich gesehen, dass Sie Carports individuell nach Kundenwunsch planen, auch als Solarcarport. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:'),
    dict(id='texbau', nom='Texbau AG', activite='Stahl-Carports nach Mass · Däniken', initiales='TX',
         logo=None, email='info@texbau.ch', site='texbau.ch', produit='carport', metal=True,
         preuve='« Wir fertigen den Carport massgeschneidert auf Ihre Fahrzeuge an. Carport mit feuerverzinktem Stahlgestell »',
         phrase='Auf Ihrer Website habe ich gesehen, dass Sie Carports mit feuerverzinktem Stahlgestell massgeschneidert anfertigen. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:'),
    dict(id='sio', nom='SIO AG', activite='Terrassendächer & Wintergärten · Olten', initiales='SIO',
         logo=None, email='info@sio-ag.ch', site='sio-ag.ch', produit='veranda',
         preuve='« Balkonverglasungen, Terrassendächer & Wintergärten aus Olten », « in der Schweiz hergestellte Massarbeit », Fachbetriebe als Partner',
         phrase='Auf Ihrer Website habe ich gesehen, dass Sie Terrassendächer und Wintergärten in der Schweiz nach Mass herstellen. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:'),
    dict(id='baumberger', nom='Baumberger Bau AG', activite='Holzbau · Gerlafingen', initiales='BB',
         logo='baumberger.png', email='info@baumberger-holzbau.ch', site='baumberger-holzbau.ch', produit='carport',
         preuve='Ratgeber « Carport Preise kalkulieren » auf baumberger-holzbau.ch',
         phrase='Auf Ihrer Website habe ich Ihren Ratgeber zu den Carport-Preisen gelesen. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:'),
    dict(id='simelhome', nom='Simel Home', activite='Bau & Sanierungen · Neuheim ZG', initiales='SH',
         logo=None, email='info@simelhome.ch', site='simelhome.ch', produit='veranda',
         preuve='« Wintergarten planen & bauen lassen », « wir planen Ihren Wintergarten nach Mass »',
         phrase='Auf Ihrer Website habe ich gesehen, dass Sie Wintergärten nach Mass planen und bauen. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:'),
    dict(id='hunziker', nom='Hans Hunziker Holzbau', activite='Holzbau · Moosleerau', initiales='HH',
         logo='hunziker.png', email='info@hanshunziker.ch', site='hanshunziker.ch', produit='carport',
         preuve='« Ihr Carport nach Wunsch, auch mit Sitzplatz oder Gartenhaus »',
         phrase='Auf Ihrer Website habe ich gesehen, dass Sie Carports nach Wunsch bauen, auch mit Sitzplatz oder Gartenhaus. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:'),
    dict(id='holzbau-ott', nom='Holzbau Ott', activite='Holzbau · Bünzen', initiales='HO',
         logo='ott.svg', email='info@holzbau-ott.ch', site='holzbau-ott.ch', produit='carport',
         preuve='« Wir bieten Ihnen massgeschneiderte Carports aus Holz »',
         phrase='Auf Ihrer Website habe ich gesehen, dass Sie massgeschneiderte Carports aus Holz anbieten. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:'),
    dict(id='doppelpunkt', nom='Doppelpunkt AG', activite='Holzbau · Malerei · Kölliken', initiales='D:',
         logo=None, email='christoph.widmer@doppelpunkt-ag.ch', site='doppelpunkt-ag.ch', produit='carport',
         preuve='« Wir bieten individuelle Carports an, die sich perfekt an Ihre baulichen Gegebenheiten anpassen »',
         phrase='Auf Ihrer Website habe ich gesehen, dass Sie individuelle Carports anbieten, angepasst an die baulichen Gegebenheiten. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:'),
    dict(id='nabholz', nom='Schreinerei Nabholz GmbH', activite='Schreinerei · Schönenwerd', initiales='SN',
         logo='nabholz.png', email='info@schreinerei-nabholz.ch', site='schreinerei-nabholz.ch', produit='carport',
         preuve='« Jeder Carport wird individuell nach Ihren Wünschen und Anforderungen geplant und gefertigt »',
         phrase='Auf Ihrer Website habe ich gesehen, dass Sie jeden Carport individuell planen und fertigen. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:'),
    dict(id='knecht', nom='Knecht GmbH', activite='Wintergärten & Sonnenschutz · Nunningen', initiales='KN',
         logo='knecht.webp', email='info@knechtgmbh.ch', site='knechtgmbh.ch', produit='veranda',
         preuve='« Es gibt keine Massbegrenzung … Jeder Wintergarten wird individuell für Sie hergestellt »',
         phrase='Auf Ihrer Website habe ich gesehen, dass Sie jeden Wintergarten individuell herstellen, ohne Massbegrenzung. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:'),
]

PRODUITS_DE = {
    'carport': ('Carport', 'Offener Unterstand für ein oder zwei Autos, Geräteraum optional.',
                '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', 'Carport'),
    'veranda': ('Wintergarten', 'Verglaster Raum aus Aluminium, an die Fassade angebaut.',
                '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', 'Wintergarten'),
}

MAIL = """Guten Tag

Ich heisse Ryan, wohne in der Nähe von Payerne und entwickle 3D-Konfiguratoren für Unternehmen, die nach Mass fertigen.

{phrase}

3D-Konfigurator — Demo
https://{id}.wibzo.ch/

Ihre Kunden stellen ihren {objet} in 3D zusammen, sehen einen Richtpreis und senden Ihnen eine vollständige Offertanfrage.
Das kann Sie von der Konkurrenz abheben, und die Einbindung auf Ihrer Website ist einfach und schnell.

Das ist erst eine erste Version mit fiktiven Preisen. Wenn Sie interessiert sind, gehe ich gerne weiter und passe sie an Ihre Modelle, Optionen, Farben und Preise an.

Hätten Sie Interesse, diesen Konfigurator zu nutzen?

Freundliche Grüsse
Ryan
Wibzo · contact@wibzo.ch"""

IGNORER = shutil.ignore_patterns('.wrangler', 'config.js', 'wrangler.jsonc', 'MESSAGE.md', '*.pdf')
js = lambda v: json.dumps(v, ensure_ascii=False)

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
    label, aide, icone, objet = PRODUITS_DE[c['produit']]
    extra = ''
    if c.get('metal'):
        extra = f"""
  materiau: 'alu',
  produit: {js(METAL['produit'])},
  libelles: {{ ...base.libelles, ...{js(METAL['libelles'])} }},
  bois: {js(METAL['bois'])},
  toits: {js(METAL['toits'])},
  defauts: {{ ...base.defauts, ...{js(METAL['defauts_extra'])} }},"""
    if c.get('solaire'):
        extra = f"""
  couvertures: {{ ...base.couvertures, solaire: {js(SOLAIRE)} }},
  toits: {{ ...base.toits, plat: {{ ...base.toits.plat, couvertures: ['epdm', 'tole', 'solaire'] }}, unPan: {{ ...base.toits.unPan, couvertures: ['tole', 'polycarbonate', 'solaire'] }} }},
  tarifs: {{ ...base.tarifs, couvertureM2: {{ ...base.tarifs.couvertureM2, solaire: 290 }} }},"""
    (dst / 'config.js').write_text(f"""// Démo ALLEMANDE préparée pour {c['nom']}, 11.11.2026 (outils/demo-de.py, produit « {c['produit']} »).
// Repris de {c['site']} : {c['preuve']} (vu le 11.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import {{ CONFIG as base }} from './produits/{c['produit']}.js';

const ENTREPRISE = {{
  nom: {js(c['nom'])},
  activite: {js(c['activite'])},
  initiales: {js(c['initiales'])},
  logo: {logo},
  email: '', // e-mail qui reçoit les demandes (vide = démo)
}};
const produit = {{
  ...base,
  entreprise: ENTREPRISE,{extra}
}};

export const PRODUITS = {{
  {c['produit']}: {{ label: {js(label)}, aide: {js(aide)}, icone: {js(icone)}, config: produit }},
}};

export const PRODUIT = {js(c['produit'])};
export const CONFIG = {{ ...produit, assistant: true, couleurs: {{ plan: '#3D3A35', 'plan-clair': '#EFEBE3' }} }};
""", encoding='utf-8')
    (dst / 'wrangler.jsonc').write_text(f"""{{
  // Démo {c['nom']} (allemand) : https://{c['id']}.wibzo.ch — mise à jour : `npx wrangler deploy` dans ce dossier
  "name": "{c['id']}-3d-configurateur",
  "compatibility_date": "2026-10-23",
  "workers_dev": false,
  "routes": [{{ "pattern": "{c['id']}.wibzo.ch", "custom_domain": true }}],
  "assets": {{ "directory": "." }}
}}
""", encoding='utf-8')
    mail = MAIL.format(phrase=c['phrase'], id=c['id'], objet=objet)
    (dst / 'MESSAGE.md').write_text(f"""# {c['nom']} — prise de contact en allemand (préparé le 11.11.2026)

**À :** {c['email']}
**Objet :** 3D-Demo für {c['nom']}
**Démo :** https://{c['id']}.wibzo.ch/
**Preuve :** {c['site']} : {c['preuve']}

```
{mail}
```
""", encoding='utf-8')
    print('ok', c['id'])
