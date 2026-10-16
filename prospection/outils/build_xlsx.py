import re
import sys
from urllib.parse import quote
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

src, out = sys.argv[1], sys.argv[2]
rows = [[c.strip() for c in l.split("¦")] for l in open(src, encoding="utf-8") if l.strip()]

# Message validé par Ryan le 14.10.2026 : son texte raccourci + 1 phrase « bénéfice » selon le métier, sans « Forel », maquette « en 24 h ».
MSG = ("Bonjour, je suis Ryan, créateur web dans la région.\n\n"
       "J'ai vu {detail}, mais pas encore de site. {benefit}\n\n"
       "Je peux vous préparer une maquette gratuite en 24 h, sans rien à faire de votre côté. "
       "Si elle ne vous plaît pas, on en reste là.\n\n"
       "Je vous l'envoie ?")

# Nouveau message (14.10.2026, après recherche Instagram) pour tous les commerces pas encore « Envoyé ».
# Les messages déjà envoyés gardent MSG ci-dessus. Voir PROCESS.md.
# ATTENTION (15.10.2026) : le message actuel est écrit par maj_messages.ps1 (à relancer après ce script).
MSG_V2 = ("Bonjour, ici Ryan de Wibzo, je crée des sites pour les commerces de la région.\n\n"
          "{line} Mais quand un nouveau client vous cherche sur Google, il ne trouve pas de site pour {benefit}, "
          "et il risque d'aller ailleurs.\n\n"
          "Je peux vous préparer la maquette de votre site, gratuitement, en 24 h. "
          "Si elle ne vous plaît pas, on en reste là.\n\n"
          "Je vous la prépare ?")
BENEFIT_V2 = {
    "rdv": "voir vos prestations et réserver",
    "devis": "voir vos réalisations et demander un devis",
    "resto": "voir votre carte et vos horaires",
    "shop": "voir vos produits et vos horaires",
}

BENEFIT = {
    "rdv": "Avec un site, vos clients pourraient voir vos prestations et réserver directement, même quand vous travaillez.",
    "devis": "Avec un site, vos clients pourraient voir vos réalisations et vous demander un devis directement.",
    "resto": "Avec un site, vos clients pourraient voir votre carte, vos horaires et vous contacter directement.",
    "shop": "Avec un site, vos clients pourraient voir vos produits, vos horaires et vous trouver facilement.",
}
KEYS = [
    ("resto", ["pizz", "kebab", "restaurant", "traiteur", "sandwich", "dessert", "boucherie", "charcuterie"]),
    ("rdv", ["coiff", "barbier", "beauté", "massa", "masso", "massage", "manucure", "tatouage", "ostéo", "podolog", "physio",
             "toiletteur", "drainage", "soin des pieds", "auto-école", "coach", "danse", "musique", "bien-être",
             "garage", "réparation automobile", "mécanique automobile", "carrosserie", "pension pour chiens",
             "équestre", "maison d'hôtes"]),
    ("devis", ["paysagiste", "charpentier", "peintre", "cvc", "carreleur", "assainissement", "entrepreneur", "serrurier",
               "menuisier", "couvreur", "nettoyage", "scierie", "stores", "rideaux", "couturier", "informatique",
               "ordinateur", "fiscal", "location d'outils"]),
]
def statut(phone):
    stt, dt = ST.get(phone, ("", ""))
    rel = ""
    if dt and stt.startswith("Envoyé"):
        d = datetime.datetime.strptime(dt, "%d.%m.%Y") + datetime.timedelta(days=3)
        rel = d.strftime("%d.%m.%Y")
    return [stt, dt, rel]

def kind(metier):
    m = metier.lower()
    for k, words in KEYS:
        if any(w in m for w in words):
            return k
    return "shop"

def fr(r):
    return r.replace(".", ",")

wb = Workbook()
ws = wb.active
ws.title = "À contacter"
ws.append(["Nom", "Métier", "Village", "Zone (1/2/3)", "Note Google", "Détail perso", "Mobile",
           "Source du numéro", "Message", "Lien WhatsApp", "Statut", "Date d'envoi", "Date de relance"])
seen = set()
# statuts déjà connus (outils/statuts.txt), pour ne jamais les perdre en régénérant
import os, datetime
ST = {}
stp = os.path.join(os.path.dirname(src), "statuts.txt")
if os.path.exists(stp):
    for l in open(stp, encoding="utf-8"):
        if l.strip() and not l.startswith("#"):
            ph, stt, dt = ([c.strip() for c in l.split("¦")] + ["", ""])[:3]
            ST[ph] = (stt, dt)
for name, metier, village, rating, reviews, phone in rows:
    assert len(phone) == 10 and phone.startswith("07"), phone
    assert phone not in seen, phone
    seen.add(phone)
    n, r = int(reviews), float(rating)
    if n >= 5 and r >= 4.5:
        detail = f"vos {n} avis Google à {fr(rating)}/5"
    elif n >= 3 and r == 5:
        detail = f"vos {n} avis Google à 5/5"
    else:
        detail = f"votre fiche Google à {village}"
    if ST.get(phone, ("", ""))[0].startswith("Envoyé"):
        msg = MSG.format(detail=detail, benefit=BENEFIT[kind(metier)])
    else:
        short = re.sub(r"\s*\(.*\)\s*$", "", name).strip()
        if (n >= 5 and r >= 4.5) or (n >= 3 and r == 5):
            line = f"J'ai vu que {short} a {n} avis à {fr(rating)}/5 sur Google, vos clients sont visiblement contents."
        else:
            line = f"J'ai vu la fiche Google de {short} à {village}."
        msg = MSG_V2.format(line=line, benefit=BENEFIT_V2[kind(metier)])
    link = f"https://wa.me/41{phone[1:]}?text={quote(msg)}"
    mob = f"{phone[:3]} {phone[3:6]} {phone[6:8]} {phone[8:]}"
    ws.append([name, metier, village, 1, f"{fr(rating)} ({n} avis)", detail, mob,
               "Fiche Google Maps", msg, link] + statut(phone))

HEAD = Font(name="Arial", bold=True, color="FFFFFF")
FILL = PatternFill("solid", start_color="1F4E78")
for i, w in enumerate([32, 24, 20, 8, 14, 40, 15, 18, 60, 18, 12, 14, 16], 1):
    ws.column_dimensions[get_column_letter(i)].width = w
for c in ws[1]:
    c.font, c.fill = HEAD, FILL
    c.alignment = Alignment(vertical="center", wrap_text=True)
for row in ws.iter_rows(min_row=2):
    for c in row:
        c.font = Font(name="Arial", size=10)
        c.alignment = Alignment(vertical="top", wrap_text=True)
    link = row[9]
    link.hyperlink = link.value
    link.value = "Ouvrir WhatsApp"
    link.font = Font(name="Arial", size=10, color="0563C1", underline="single")
ws.freeze_panes = "A2"
ws.auto_filter.ref = ws.dimensions
wb.save(out)
print(len(seen), "commerces ->", out)
