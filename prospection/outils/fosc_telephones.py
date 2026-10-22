# Cherche sur search.ch le numéro et le site de chaque artisan de fosc_artisans.csv.
# Écrit le 22.10.2026. Lancer après fosc_vd_fr.py : python prospection\outils\fosc_telephones.py
# Résultat : prospection/outils/fosc_telephones.csv (mobile, * = pas de publicité, fixe, site indiqué sur search.ch)
# On ne garde un numéro que si le nom de l'inscription correspond ET que le NPA est le même.

import csv, html, os, re, sys, time, unicodedata, urllib.parse, urllib.request
from collections import Counter

DIR = os.path.dirname(os.path.abspath(__file__))
GENERIQUES = {"sarl", "sa", "snc", "gmbh", "ag", "sagl", "titulaire", "garage", "entreprise", "atelier", "carrosserie",
              "peinture", "renovation", "renovations", "construction", "constructions", "services", "service", "jardin",
              "jardins", "paysage", "paysagiste", "toiture", "menuiserie", "platrerie", "sanitaire", "chauffage", "et",
              "de", "du", "des", "la", "le", "les", "fils", "group", "groupe", "swiss", "suisse", "general", "generale",
              "batiment", "bau", "technique", "tech", "pro", "carrelage", "electricite", "demenagement", "the"}


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^a-z0-9]+", " ", "".join(c for c in s if not unicodedata.combining(c))).strip()


def coeur(nom):
    n = re.sub(r"\(.*?\)", " ", nom)
    n = re.split(r"\s*[,\-–]?\s*\b(titulaire|inhaber)\b", n, flags=re.I)[0]
    return re.sub(r"\b(Sàrl|SA|SNC|GmbH|AG|Sagl|Sarl)\b\.?", " ", n).strip() or nom


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "fr"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def chercher(e):
    c = coeur(e["nom"])
    toks = [t for t in norm(c).split() if len(t) > 2 and t not in GENERIQUES]
    loc = re.sub(r"\s+(VD|FR)$", "", e["localite"])
    h = get("https://search.ch/tel/?" + urllib.parse.urlencode({"was": c, "wo": loc}))
    entrees = re.split(r'<li class="tel-(?:commercial|person)', h)[1:]
    res = {"mobile": "", "etoile": "", "fixe": "", "site": "", "trouve": "non"}
    for en in entrees:
        m = re.search(r"<h1><a[^>]*>(.*?)</a>", en, re.S)
        titre = norm(html.unescape(re.sub("<.*?>", "", m.group(1)))) if m else ""
        npa = re.search(r'class="postal-code">(\d{4})', en)
        ok_nom = all(t in titre for t in toks) if toks else norm(c) in titre
        if not (ok_nom and npa and npa.group(1) == e["npa"]):
            continue
        res["trouve"] = "oui"
        for num, etoile in re.findall(r'href="tel:\+41(\d+)"[^>]*>[^<]*</a>\s*(<span title="\*)?', en):
            num = "0" + num
            fmt = f"{num[:3]} {num[3:6]} {num[6:8]} {num[8:]}"
            if num[:3] in ("075", "076", "077", "078", "079"):
                if not res["mobile"]:
                    res["mobile"], res["etoile"] = fmt, "*" if etoile else ""
            elif not res["fixe"]:
                res["fixe"] = fmt
        w = re.search(r'class="tel-result-action sl-icon-website"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*class="tel-result-action sl-icon-website"', en)
        if w:
            res["site"] = html.unescape(w.group(1) or w.group(2))
        break
    return res


def main():
    src = os.path.join(DIR, "fosc_artisans.csv")
    rows = list(csv.DictReader(open(src, encoding="utf-8-sig"), delimiter=";"))
    out = []
    for i, e in enumerate(rows, 1):
        try:
            e.update(chercher(e))
        except Exception as ex:
            e.update({"trouve": f"erreur {ex}", "mobile": "", "etoile": "", "fixe": "", "site": ""})
        out.append(e)
        if i % 50 == 0:
            print(f"  {i}/{len(rows)}", file=sys.stderr, flush=True)
        time.sleep(0.4)
    cols = ["date", "nom", "metier", "npa", "localite", "trouve", "mobile", "etoile", "fixe", "site", "uid", "rue", "but", "id"]
    with open(os.path.join(DIR, "fosc_telephones.csv"), "w", encoding="utf-8-sig", newline="") as fh:
        w = csv.DictWriter(fh, cols, delimiter=";", extrasaction="ignore")
        w.writeheader()
        w.writerows(out)
    # Stats par mois d'inscription : combien ont un mobile et pas de site indiqué.
    tot, mob = Counter(), Counter()
    for e in out:
        mo = e["date"][:7]
        tot[mo] += 1
        if e["mobile"] and not e["site"]:
            mob[mo] += 1
    for mo in sorted(tot):
        print(f"{mo} : {mob[mo]:3d} / {tot[mo]:3d} avec mobile sans site ({100 * mob[mo] // tot[mo]} %)")


if __name__ == "__main__":
    main()
