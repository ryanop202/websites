# Cherche des prospects dans l'annuaire search.ch (15.11.2026) : toutes les fiches pour une liste de mots-clés,
# avec catégorie, lieu, site web et e-mail de la fiche.
# ⚠️ Les fiches marquées « * » (« Wünscht keine Werbung » / « ne souhaite pas de publicité ») sont EXCLUES :
# les démarcher malgré cette mention est déloyal selon la LCD (art. 3 al. 1 let. u).
# Usage : py outils/chercher-searchch.py <sortie.json> "mot clé 1" "mot clé 2|canton" ...
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from html import unescape

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}
EXCLUS_SITES = r'search\.ch|local\.ch|google|apple|facebook|instagram|linkedin|twitter|youtube|tiktok|booking-widget|maps\.'


def lire(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
            return r.read().decode('utf-8', 'replace')
    except Exception:
        return ''


def resultats(mot):
    # « Holzbau|BE » = mot-clé + lieu ou canton (search.ch s'arrête vers 400 fiches par recherche)
    was, _, wo = mot.partition('|')
    fiches = {}
    for page in range(0, 40):
        h = lire(f'https://search.ch/tel/?was={urllib.parse.quote(was)}&wo={urllib.parse.quote(wo)}&maxnum=10&pos={page * 10 + 1}')
        blocs = re.findall(r'(?s)<div class="tel-result-content">(.*?)</article>', h)
        nouveaux = 0
        for b in blocs:
            lien = re.search(r'<h1><a href="([^"]+)"[^>]*>(.*?)</a>', b)
            if not lien or lien.group(1) in fiches:
                continue
            nouveaux += 1
            fiches[lien.group(1)] = {
                'fiche': 'https://search.ch' + lien.group(1),
                'nom': unescape(re.sub(r'<[^>]+>', '', lien.group(2))).strip(),
                'categories': unescape((re.search(r'tel-categories">(.*?)</div>', b) or [None, ''])[1]),
                'npa': (re.search(r'postal-code">(\d+)', b) or [None, ''])[1],
                'lieu': unescape((re.search(r'locality">([^<]+)', b) or [None, ''])[1]),
                'canton': (re.search(r'region">([A-Z]{2})', b) or [None, ''])[1],
                'pas_de_pub': bool(re.search(r'keine Werbung|pas de publicité|nessuna pubblicità', b)),
                'mot': mot,
            }
        if not nouveaux:
            break
        time.sleep(0.4)
    return list(fiches.values())


def details(f):
    h = lire(f['fiche'])
    if re.search(r'keine Werbung|pas de publicité|nessuna pubblicità', h):
        f['pas_de_pub'] = True
    sites = [unescape(s) for s in re.findall(r'href="(https?://[^"]+)"', h) if not re.search(EXCLUS_SITES, s)]
    f['site'] = sites[0] if sites else ''
    mails = re.findall(r'mailto:([^"?]+)', h)
    f['email'] = unescape(mails[0]) if mails else ''
    return f


if __name__ == '__main__':
    sortie, mots = sys.argv[1], sys.argv[2:]
    toutes = {}
    for mot in mots:
        for f in resultats(mot):
            toutes.setdefault(f['fiche'], f)
        print(mot, len(toutes), flush=True)
    gardees = [f for f in toutes.values() if not f['pas_de_pub']]
    with ThreadPoolExecutor(8) as ex:
        gardees = list(ex.map(details, gardees))
    gardees = [f for f in gardees if not f['pas_de_pub']]
    json.dump(gardees, open(sortie, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{len(toutes)} fiches, {len(toutes) - len(gardees)} exclues (« pas de publicité »), {len(gardees)} gardées, '
          f'{sum(1 for f in gardees if f["site"])} avec site, {sum(1 for f in gardees if f["email"])} avec e-mail')
