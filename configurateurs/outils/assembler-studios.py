# Assemble la liste des prospects « studio de jardin » (15.11.2026) à partir des fiches search.ch
# (outils/chercher-searchch.py) et de la vérification des sites (outils/verifier-prospects-de.py).
# Groupe A : le site parle de cabanons / studios / Gartenhäuser → le mail le cite.
# Groupe B : charpentiers / Holzbau sans mention → le mail dit seulement qu'ils travaillent le bois.
# Exclus : fiches « pas de publicité », déjà contactés, sans e-mail, avec configurateur ou boutique.
# Usage : py outils/assembler-studios.py <deja.json> <sortie liste.json> <fiches1.json,fiches2.json> <verif1.json,verif2.json>
import json
import re
import sys
import unicodedata
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
deja = json.load(open(sys.argv[1], encoding='utf-8'))
fiches = [f for p in sys.argv[3].split(',') for f in json.load(open(p, encoding='utf-8'))]
verifs = {v['dom']: v for p in sys.argv[4].split(',') for v in json.load(open(p, encoding='utf-8'))}
METIER = r'holzbau|zimmerei|schreinerei|charpent|menuiser|bauunternehmung|dachdecker|gartenbau|gartengestaltung|chalet|elementbau'
PAS_CIBLE = r'restaurant|vermietung|architekt|heim|hauswartung|reise|zelt|golf|freizeit|traiteur|show room|baumarkt|gartencenter|immobil|ingenieur'
CHARPENTIER = r'holzbau|zimmerei|charpent'
LIBRES = r'bluewin|gmail|hotmail|gmx|outlook|yahoo|sunrise|swissonline|hispeed|icloud|green\.ch|bluemail|vtxnet|netplus|protonmail|live\.|msn\.|quickline'
FR_CANTONS = {'VD', 'GE', 'NE', 'JU'}
ids_pris = {p.name for p in (RACINE / 'clients').iterdir()}


def domaine(f):
    if f.get('site'):
        return re.sub(r'^https?://(www\.)?', '', f['site']).split('/')[0].lower()
    e = f.get('email', '')
    return e.split('@')[1].lower() if '@' in e and not re.search(LIBRES, e.split('@')[1]) else ''


def slug(nom):
    s = unicodedata.normalize('NFKD', nom).encode('ascii', 'ignore').decode().lower()
    s = re.sub(r'\b(ag|gmbh|sa|sarl|s a r l|sàrl|und|et|co|cie)\b', ' ', s)
    s = '-'.join(re.findall(r'[a-z0-9]+', s))[:28].strip('-') or 'studio'
    base, i = s, 2
    while s in ids_pris:
        s, i = f'{base}-{i}', i + 1
    ids_pris.add(s)
    return s


liste, vus = [], set()
for f in fiches:
    d = domaine(f)
    if f.get('pas_de_pub') or not d or d in vus or d in deja['doms']:
        continue
    v = verifs.get(d)
    if not v or v.get('erreur') or v.get('konfig') or v.get('shop'):
        continue
    cats = (f.get('categories') or '').lower()
    if re.search(PAS_CIBLE, cats) or not re.search(METIER, cats):
        continue
    mails = [m for m in v.get('mails', []) if d.split('.')[-2] in m] or v.get('mails', []) or ([f['email']] if f.get('email') else [])
    mails = [m for m in mails if m.lower() not in deja['mails']]
    if not mails:
        continue
    studio = 'studio' in v.get('produits', [])
    if not studio and not re.search(CHARPENTIER, cats):
        continue
    vus.add(d)
    fr = v.get('francais') and not v.get('allemand') or (not v.get('allemand') and f.get('canton') in FR_CANTONS)
    langue = 'fr' if fr else 'de'
    nom = re.sub(r'\s+', ' ', f['nom']).strip()
    if langue == 'de':
        phrase = ('Auf Ihrer Website habe ich gesehen, dass Sie Gartenhäuser bauen.' if studio else
                  'Auf Ihrer Website habe ich gesehen, dass Sie im Holzbau tätig sind. Ein Gartenstudio aus Holz würde gut zu Ihrem Angebot passen.')
    else:
        phrase = ("En découvrant vos chalets et abris de jardin sur votre site, j'ai eu une idée : vous montrer à quoi pourrait ressembler un configurateur 3D adapté à vos produits." if studio else
                  "En découvrant vos travaux de charpente sur votre site, j'ai eu une idée : vous montrer un configurateur 3D de studio de jardin à votre nom, un produit en bois qui compléterait bien votre offre.")
    liste.append([slug(nom), nom, mails[0].lower(), d, langue, phrase, 'A' if studio else 'B', f.get('lieu', ''), f.get('canton', '')])

json.dump(liste, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(liste), 'prospects :', sum(1 for x in liste if x[6] == 'A'), 'groupe A,', sum(1 for x in liste if x[6] == 'B'), 'groupe B ;',
      sum(1 for x in liste if x[4] == 'fr'), 'FR,', sum(1 for x in liste if x[4] == 'de'), 'DE')
