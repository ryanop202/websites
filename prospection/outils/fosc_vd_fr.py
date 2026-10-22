# Nouvelles entreprises VD + FR publiées dans la FOSC (rubrique HR01 = nouvelles inscriptions).
# Écrit le 22.10.2026 (voir prospection/PROMPT-fosc-vaud-fribourg.md).
# Lancer : python prospection\outils\fosc_vd_fr.py          (3 derniers mois)
#          python prospection\outils\fosc_vd_fr.py 7        (7 derniers jours, pour la relance chaque semaine)
# Résultat : prospection/outils/fosc_artisans.csv (artisans à vérifier dans Chrome)
#            prospection/outils/fosc_tous.csv     (toutes les inscriptions VD/FR avec la raison du tri)
# Les entreprises déjà dans fosc_deja_vus.txt (UID) sont ignorées : ajouter les UID une fois vérifiées.

import csv, io, json, os, re, sys, urllib.request, zipfile
from concurrent.futures import ThreadPoolExecutor
from datetime import date, timedelta
from xml.etree import ElementTree as ET

DIR = os.path.dirname(os.path.abspath(__file__))
API = "https://amtsblattportal.ch/api/v1/publications"
PLZ_URL = ("https://data.geo.admin.ch/ch.swisstopo-vd.ortschaftenverzeichnis_plz/"
           "ortschaftenverzeichnis_plz/ortschaftenverzeichnis_plz_2056.csv.zip")
CANTONS = {"VD", "FR"}

# Métiers gardés (cherchés dans le nom + le but, en minuscules, FR et DE).
ARTISANS = {
    "paysagiste": ["paysag", "jardin", "espaces verts", "garten", "élagage", "abattage d'arbres"],
    "couvreur / charpentier": ["toiture", "couverture", "couvreur", "charpent", "ferblant", "zimmer", "dach", "spengler"],
    "menuisier / ébéniste": ["menuiser", "ébénist", "schreiner", "agencement", "parquet", "fenêtres", "portes"],
    "maçon / construction": ["maçonnerie", "maçon", "génie civil", "gros œuvre", "gros-œuvre", "gros oeuvre", "bauunternehm",
                             "entreprise générale de construction", "travaux de construction", "rénovation", "transformation de bâtiments",
                             "terrassement", "démolition", "béton"],
    "façadier": ["façad", "fassade", "crépi", "isolation"],
    "carreleur": ["carrel", "plättli", "fliesen", "chape", "revêtements de sols", "sols"],
    "peintre": ["peinture", "peintre", "plâtr", "gyps", "maler"],
    "électricien": ["électric", "electric", "elektro", "installations électriques", "photovolta", "solaire"],
    "sanitaire / chauffage": ["sanitaire", "chauffage", "heizung", "plomb", "ventilation", "pompe à chaleur", "cvc", "cvse"],
    "cuisiniste": ["cuisines", "cuisiniste", "küchen"],
    "garage": ["garage", "carrosserie", "mécanique automobile", "réparation de véhicules", "réparation automobile", "pneus", "autogarage"],
    "froid / climatisation": ["climatisation", "frigorifique", "froid", "kälte", "klima"],
    "serrurier / métallier": ["serrur", "métallique", "construction métallique", "metallbau", "soudure"],
    "stores": ["stores", "volets"],
    "vitrier": ["vitrerie", "vitrier", "glaser"],
    "ramoneur": ["ramon", "kaminfeg"],
    "étanchéité": ["étanchéité"],
    "déménagement": ["déménagement", "umzug"],
}
EXCLURE = ["coiff", "barbier", "beauté", "esthéti", "ongle", "onglerie", "manucure", "cosmét", "holding", "immobili",
           "trading", "négoce", "commerce de gros", "conseil", "consulting", "beratung", "succursale", "zweigniederlassung",
           "gestion de fortune", "fiduciaire", "placement", "promotion immobil", "nettoyage", "reinigung", "conciergerie",
           "informatique", "logiciel", "software", "restaura", "café", "bar ", "kebab", "pizz",
           "architecture", "architekt", "bureau d'ingénieur", "ingénieurs", "transports de marchandises", "transport de marchandises",
           "branch", "association", "commerce de voitures", "vente de véhicules", "achat de véhicules", "miniaturiste"]


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def plz_cantons():
    """NPA -> {cantons} depuis la liste officielle swisstopo."""
    z = zipfile.ZipFile(io.BytesIO(get(PLZ_URL)))
    name = next(n for n in z.namelist() if n.endswith(".csv"))
    m = {}
    for row in csv.DictReader(io.TextIOWrapper(z.open(name), encoding="utf-8-sig"), delimiter=";"):
        m.setdefault(row["PLZ4"], set()).add(row["Kantonskürzel"])
    return m


def liste(start, stop):
    # L'API refuse les pages trop loin (erreur 400) : on demande semaine par semaine.
    out, d = [], start
    while d <= stop:
        fin = min(d + timedelta(days=6), stop)
        page = 0
        while True:
            url = (f"{API}?publicationStates=PUBLISHED&tenant=shab&subRubrics=HR01"
                   f"&publicationDate.start={d}&publicationDate.end={fin}"
                   f"&pageRequest.size=200&pageRequest.page={page}")
            j = json.loads(get(url))
            out += j["content"]
            if (page + 1) * 200 >= j["total"] or not j["content"]:
                break
            page += 1
        print(f"  {d} -> {fin}: {len(out)}", file=sys.stderr)
        d = fin + timedelta(days=1)
    return out


def detail(pid):
    x = ET.fromstring(get(f"{API}/{pid}/xml"))
    t = lambda p: (x.findtext(p) or "").strip()
    c = "content/commonsNew/company/"
    return {
        "id": pid, "date": t("meta/publicationDate"),
        "nom": t(c + "name"), "uid": t(c + "uid"), "siege": t(c + "seat"),
        "rue": f"{t(c + 'address/street')} {t(c + 'address/houseNumber')}".strip(),
        "npa": t(c + "address/swissZipCode"), "localite": t(c + "address/town"),
        "but": t("content/commonsNew/purpose"),
    }


def metier(e):
    # Seulement la 1re phrase du but (l'activité) : la suite est souvent la même pour toutes les sociétés
    # (« peut créer des succursales, acquérir des immeubles… ») et ferait tout exclure.
    txt = f"{e['nom']} {re.split(r'\.\s', e['but'])[0]}".lower()
    # Clause légale fréquente (LFAIE) qui contient « immeubles » : on l'enlève.
    txt = re.sub(r"\([^)]*(lfaie|étranger)[^)]*\)|à l'exception des opérations prohibées[^:;]*", "", txt)

    def premier(mots):
        best = None
        for m, liste_mots in mots.items():
            for w in liste_mots:
                i = txt.find(w)
                if i >= 0 and (best is None or i < best[0]):
                    best = (i, m, w)
        return best

    # Le but commence par l'activité principale : c'est le mot trouvé le plus tôt qui décide.
    art = premier(ARTISANS)
    exc = premier({w: [w] for w in EXCLURE})
    if exc and (not art or exc[0] < art[0]):
        return None, f"exclu ({exc[2]})"
    return (art[1], "artisan") if art else (None, "pas un métier ciblé")


def main():
    jours = int(sys.argv[1]) if len(sys.argv) > 1 else 90
    start = date.today() - timedelta(days=jours)
    # 2e nombre (optionnel) : s'arrêter il y a X jours. Ex. « 180 120 » = inscriptions d'il y a 4 à 6 mois.
    fin_jours = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    vus = set()
    f = os.path.join(DIR, "fosc_deja_vus.txt")
    if os.path.exists(f):
        vus = {l.strip() for l in open(f, encoding="utf-8") if l.strip() and not l.startswith("#")}

    print(f"Liste FOSC depuis le {start}…", file=sys.stderr)
    pubs = liste(start, date.today() - timedelta(days=fin_jours))
    # Pré-tri sur le canton du registre (le filtre canton de l'API ne marche pas), puis contrôle par NPA.
    ids = [p["meta"]["id"] for p in pubs if CANTONS & set(p["meta"].get("cantons") or [])]
    print(f"{len(pubs)} inscriptions en Suisse, {len(ids)} au registre VD/FR. Lecture des fiches…", file=sys.stderr)
    with ThreadPoolExecutor(8) as ex:
        fiches = list(ex.map(detail, ids))

    plz = plz_cantons()
    tous, artisans = [], []
    for e in fiches:
        cant = plz.get(e["npa"], set())
        if not (cant & CANTONS):
            e["metier"], e["tri"] = "", f"NPA {e['npa']} hors VD/FR ({','.join(sorted(cant)) or '?'})"
        elif e["uid"] in vus or e["uid"] in {a["uid"] for a in artisans}:
            e["metier"], e["tri"] = "", "déjà vu / doublon"
        else:
            m, e["tri"] = metier(e)
            e["metier"] = m or ""
            if m:
                artisans.append(e)
        tous.append(e)

    cols = ["date", "nom", "metier", "rue", "npa", "localite", "uid", "tri", "but", "id"]
    for name, rows in (("fosc_tous.csv", tous), ("fosc_artisans.csv", artisans)):
        with open(os.path.join(DIR, name), "w", encoding="utf-8-sig", newline="") as fh:
            w = csv.DictWriter(fh, cols, delimiter=";", extrasaction="ignore")
            w.writeheader()
            w.writerows(sorted(rows, key=lambda r: r["date"], reverse=True))
    hors = sum(1 for e in tous if e["tri"].startswith("NPA"))
    print(f"VD/FR (NPA vérifié) : {len(tous) - hors}  |  hors zone : {hors}  |  artisans à vérifier : {len(artisans)}")


if __name__ == "__main__":
    main()
