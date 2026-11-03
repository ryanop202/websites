# Nouvelles entreprises de la Broye publiées dans la FOSC (sogc.ch / amtsblattportal.ch, API publique gratuite).
#
# ÉTAPE 1 — chercher (chaque semaine) :
#     py outils/fosc_broye.py chercher            (90 derniers jours par défaut)
#     py outils/fosc_broye.py chercher 14         (14 derniers jours)
#   -> outils/fosc_candidats.xlsx : toutes les nouvelles inscriptions de la Broye (tri par NPA),
#      avec « Cible ? » = oui / non / à voir (tri automatique par mots-clés, à relire).
#      Les entreprises déjà traitées (outils/fosc_traitees.txt) sont marquées « déjà traitée ».
#
# ÉTAPE 2 — vérifier à la main (avec Claude + Chrome) : site ? numéro fixe ? -> écrire le résultat
#   dans outils/fosc_traitees.txt (une ligne par entreprise, voir l'en-tête du fichier).
#
# ÉTAPE 3 — remplir l'Excel final :
#     py outils/fosc_broye.py excel
#   -> nouvelles-entreprises-broye.xlsx (Nom | Numéro | Message | Réponse).
#      Les réponses déjà notées dans la colonne Réponse sont gardées. Excel doit être fermé.
import json, sys, os, re, datetime, urllib.request, xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment

API = "https://amtsblattportal.ch/api/v1/publications"
HERE = os.path.dirname(os.path.abspath(__file__))
CANDIDATS = os.path.join(HERE, "fosc_candidats.xlsx")
TRAITEES = os.path.join(HERE, "fosc_traitees.txt")
FINAL = os.path.join(os.path.dirname(HERE), "nouvelles-entreprises-broye.xlsx")

# NPA de la Broye vaudoise (district Broye-Vully) et fribourgeoise (district de la Broye).
# Cugy VD (1053), Forel Lavaux (1072), Lully VD (1132) ne sont PAS dedans : seuls Cugy FR (1482),
# Forel FR (1475) et Lully FR (1470) le sont.
NPA_BROYE = {
    # FR — Estavayer, Cheyres, Montagny, Domdidier...
    1468, 1470, 1473, 1474, 1475, 1482, 1483, 1484, 1485, 1486, 1489,
    1527, 1528, 1529, 1532, 1533, 1541, 1542, 1544, 1563, 1564, 1565, 1566, 1567, 1568,
    1773, 1774, 1775, 1776,
    # VD — Moudon, Lucens, Payerne, Avenches, Vully...
    1509, 1510, 1512, 1513, 1514, 1515, 1521, 1522, 1523, 1524, 1525, 1526, 1530, 1534,
    1535, 1536, 1537, 1538, 1543, 1545, 1551, 1552, 1554, 1555, 1562,
    1580, 1582, 1584, 1585, 1586, 1587, 1588, 1589, 1595, 1682, 1683,
}

# Tri automatique (à relire !) sur le but de l'entreprise.
OUI = ["paysag", "jardin", "toiture", "couvert", "couvreur", "charpent", "menuis", "ébénist", "maçon", "maçonnerie",
       "construction", "génie civil", "terrassement", "façade", "crépi", "plâtr", "carrel", "peintur", "peintre",
       "électri", "sanitaire", "chauffage", "ventilation", "climatisation", "froid", "frigorif", "pompe à chaleur",
       "cuisine", "garage", "automobile", "carrosserie", "mécanique", "serrurerie", "ferblant", "étanchéité",
       "isolation", "parquet", "revêtement", "sol", "vitr", "store", "rénovation", "transformation", "bâtiment",
       "photovolta", "solaire", "démolition", "excavation", "forage", "assainissement", "agencement", "poêle",
       "cheminée", "fenêtre", "volet", "clôture", "pavage", "moto", "machine agricole", "tôlerie"]
NON = ["coiff", "barb", "beauté", "esthétique", "ongle", "onglerie", "cosmét", "maquillage", "holding",
       "participation", "immobili", "trading", "négoce", "conseil", "consulting", "fiduciaire", "gestion de fortune",
       "succursale"]


def get(url):
    return urllib.request.urlopen(url, timeout=60).read()


def lire_traitees():
    """IDE -> ligne (liste de champs) des entreprises déjà vérifiées."""
    out = {}
    if os.path.exists(TRAITEES):
        for l in open(TRAITEES, encoding="utf-8"):
            if l.strip() and not l.startswith("#"):
                p = [c.strip() for c in l.split("¦")]
                out[p[0]] = p
    return out


def chercher(jours):
    today = datetime.date.today()
    start = (today - datetime.timedelta(days=jours)).isoformat()
    ids = []
    # L'API refuse d'aller au-delà de 10'000 résultats : on découpe en tranches de 20 jours.
    # L'ordre des pages de l'API n'est pas stable (quelques fiches sautent) : on lit la liste 2 fois.
    for k in [k for _ in range(2) for k in range(0, jours + 1, 20)]:
        a = today - datetime.timedelta(days=min(jours, k + 19))
        b = today - datetime.timedelta(days=k)
        page = 0
        while True:  # le filtre canton de l'API ne marche pas : on trie avec meta.cantons
            d = json.loads(get(f"{API}?publicationStates=PUBLISHED&tenant=shab&subRubrics=HR01"
                               f"&publicationDate.start={a}&publicationDate.end={b}"
                               f"&pageRequest.size=200&pageRequest.page={page}"))
            ids += [p["meta"]["id"] for p in d["content"] if set(p["meta"].get("cantons") or []) & {"VD", "FR"}]
            page += 1
            if not d["content"] or page * 200 >= d.get("total", 0):
                break
    ids = list(dict.fromkeys(ids))
    print(f"{len(ids)} nouvelles inscriptions VD/FR depuis le {start}, lecture des fiches...")

    def fiche(i):
        x = ET.fromstring(get(f"{API}/{i}/xml"))
        f = lambda path: (x.findtext(path) or "").strip()
        c = ".//commonsNew/company/"
        return {"date": f(".//meta/publicationDate"), "nom": f(c + "name"), "ide": f(c + "uid"),
                "rue": (f(c + "address/street") + " " + f(c + "address/houseNumber")).strip(),
                "npa": f(c + "address/swissZipCode"), "localite": f(c + "address/town"),
                "but": f(".//commonsNew/purpose"), "texte": f(".//content/publicationText")}

    with ThreadPoolExecutor(8) as ex:
        fiches = list(ex.map(fiche, ids))
    traitees, rows, vus = lire_traitees(), [], set()
    for e in fiches:
        if not e["npa"].isdigit() or int(e["npa"]) not in NPA_BROYE or e["ide"] in vus:
            continue
        vus.add(e["ide"])
        txt = (e["nom"] + " " + e["but"]).lower()
        if e["ide"] in traitees:
            cible = "déjà traitée"
        elif "succursale" in e["texte"].lower() or "zweigniederlassung" in e["texte"].lower():
            cible = "non"
        elif any(w in txt for w in NON) and not any(w in txt for w in OUI):
            cible = "non"
        elif any(w in txt for w in OUI):
            cible = "oui" if not any(w in txt for w in NON) else "à voir"
        else:
            cible = "non"
        rows.append([e["date"], e["nom"], f"{e['rue']}, {e['npa']} {e['localite']}", e["localite"], e["but"],
                     e["ide"], cible, e["texte"]])
    rows.sort(key=lambda r: r[0], reverse=True)
    wb = Workbook(); ws = wb.active; ws.title = "Candidats FOSC"
    ws.append(["Date FOSC", "Nom", "Adresse", "Commune", "But (activité)", "IDE", "Cible ?"])
    for c in ws[1]: c.font = Font(bold=True); c.fill = PatternFill("solid", fgColor="F2D7C4")
    for r in rows: ws.append(r[:7])
    for col, w in zip("ABCDEFG", [11, 34, 38, 18, 90, 17, 12]):
        ws.column_dimensions[col].width = w
    ws.freeze_panes = "C2"; ws.auto_filter.ref = ws.dimensions
    wb.save(CANDIDATS)
    with open(os.path.join(HERE, "fosc_candidats.json"), "w", encoding="utf-8") as fh:
        json.dump([dict(zip(["date", "nom", "adresse", "commune", "but", "ide", "cible", "texte"], r)) for r in rows],
                  fh, ensure_ascii=False, indent=1)
    n = lambda v: sum(1 for r in rows if r[6] == v)
    print(f"{len(rows)} dans la Broye : oui={n('oui')}  à voir={n('à voir')}  non={n('non')}  "
          f"déjà traitées={n('déjà traitée')}  -> {CANDIDATS}")


def excel():
    # Garder les réponses déjà notées par Ryan
    reponses = {}
    if os.path.exists(FINAL):
        for r in load_workbook(FINAL).active.iter_rows(min_row=2, values_only=True):
            if r and r[0]:
                reponses[r[0]] = r[3]
    rows = [p for p in lire_traitees().values() if len(p) >= 6 and p[4] == "garder"]
    wb = Workbook(); ws = wb.active; ws.title = "Nouvelles entreprises"
    ws.append(["Nom", "Numéro", "Message", "Réponse"])
    for c in ws[1]: c.font = Font(bold=True); c.fill = PatternFill("solid", fgColor="F2D7C4")
    for p in rows:
        ws.append([p[1], p[3], p[5].replace("\\n", "\n"), reponses.get(p[1])])
    for row in ws.iter_rows(min_row=2):
        for c in row: c.alignment = Alignment(wrap_text=True, vertical="top")
    for col, w in zip("ABCD", [32, 16, 90, 30]):
        ws.column_dimensions[col].width = w
    ws.freeze_panes = "A2"
    wb.save(FINAL)
    print(f"{len(rows)} entreprises -> {FINAL}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "chercher"
    if cmd == "chercher":
        chercher(int(sys.argv[2]) if len(sys.argv) > 2 else 90)
    elif cmd == "excel":
        excel()
    else:
        print(__doc__ or "Commandes : chercher [jours] | excel")
