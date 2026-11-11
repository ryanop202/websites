# Vérifie une liste de sites (prospects Suisse alémanique) : e-mail, configurateur/calculateur déjà présent,
# boutique en ligne, produits vendus, nom et lieu. Résultat dans un fichier JSON (11.11.2026).
# Usage : py outils/verifier-prospects-de.py <fichier des domaines (un par ligne)> <sortie.json>
import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from html import unescape

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}
PRODUITS = {
    'carport': r'carport|autounterstand|unterstand f(?:ü|u)r',
    'veranda': r'wintergarten|winterg(?:ä|a)rten|sommergarten',
    'pergola-bio': r'lamellendach|lamellend(?:ä|a)cher|bioklimatisch',
    'piscine': r'swimmingpool|schwimmbad|poolbau|\bpools?\b',
}
KONFIG = r'konfigurator|konfigurieren sie|preisrechner|kostenrechner|offertenrechner|online[- ]rechner|jetzt berechnen|preis berechnen|offerte berechnen'
SHOP = r'warenkorb|in den korb|add to cart|zur kasse'
MAIL = re.compile(r'[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.(?:ch|com|swiss|net|info)\b', re.I)


def lire(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=15) as r:
            return r.read(800_000).decode(r.headers.get_content_charset() or 'utf-8', 'replace'), r.geturl()
    except Exception:
        return '', ''


def texte(html):
    html = re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>', ' ', html)
    return unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html)))


def verifier(dom):
    html, url = lire(f'https://{dom}/') or ('', '')
    if not html:
        html, url = lire(f'https://www.{dom}/')
    if not html:
        return {'dom': dom, 'erreur': 'site injoignable'}
    t = texte(html)
    pages = html
    mails = [m for m in MAIL.findall(html) if not re.search(r'example|sentry|wix|\.png|\.jpg|domain\.|email\.', m, re.I)]
    if not mails:  # page contact / impressum
        for chemin in ('kontakt', 'impressum', 'kontakt/', 'contact'):
            h2, _ = lire(f'https://{dom}/{chemin}')
            if h2:
                pages += h2
                mails = [m for m in MAIL.findall(h2) if not re.search(r'example|sentry|wix|\.png|\.jpg', m, re.I)]
                if mails:
                    break
    titre = re.search(r'(?is)<title[^>]*>(.*?)</title>', html)
    site = re.search(r'property=["\']og:site_name["\'][^>]*content=["\']([^"\']+)', html)
    lieu = re.search(r'\b([1-9]\d{3})\s+([A-ZÄÖÜ][a-zäöüé]+(?:[ -][A-ZÄÖÜ]?[a-zäöüé.]+)?)', t)
    return {
        'dom': dom,
        'titre': unescape(titre.group(1).strip())[:120] if titre else '',
        'nom_site': unescape(site.group(1)) if site else '',
        'mails': sorted(set(m.lower() for m in mails))[:4],
        # Produit cité sur la page d'accueil ou dans un lien du menu (ex. /carport, /wintergarten)
        'produits': [p for p, rx in PRODUITS.items() if re.search(rx, t + ' ' + ' '.join(re.findall(r'href=["\']([^"\']+)', html)), re.I)],
        'konfig': sorted(set(m.lower() for m in re.findall(KONFIG, texte(pages), re.I)))[:3],
        'shop': bool(re.search(SHOP, t, re.I)),
        'allemand': len(re.findall(r'\b(und|der|die|das|wir|Ihr)\b', t)) > 15,
        'lieu': f'{lieu.group(1)} {lieu.group(2)}' if lieu else '',
    }


doms = [l.strip() for l in open(sys.argv[1], encoding='utf-8') if l.strip()]
with ThreadPoolExecutor(12) as ex:
    res = list(ex.map(verifier, doms))
json.dump(res, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
ok = [r for r in res if r.get('mails') and r.get('produits') and not r.get('konfig') and not r.get('shop') and r.get('allemand')]
print(f'{len(res)} sites, {len(ok)} candidats valables')
