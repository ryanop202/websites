import sys
from urllib.parse import quote
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

src, out = sys.argv[1], sys.argv[2]
rows = [[c.strip() for c in l.split("¦")] for l in open(src, encoding="utf-8") if l.strip()]

MSG = ("Bonjour, je suis Ryan, créateur web indépendant à Forel. Je fais des sites pour les commerces de la Broye.\n\n"
       "J'ai vu {detail}, mais pas encore de site.\n\n"
       "Je peux vous préparer gratuitement une maquette de votre site, prête aujourd'hui. Rien à préparer de votre côté.\n"
       "Si elle ne vous plaît pas, on en reste là.\n\n"
       "Je vous l'envoie ?")

def fr(r):
    return r.replace(".", ",")

wb = Workbook()
ws = wb.active
ws.title = "À contacter"
ws.append(["Nom", "Métier", "Village", "Zone (1/2/3)", "Note Google", "Détail perso", "Mobile",
           "Source du numéro", "Message", "Lien WhatsApp", "Statut", "Date d'envoi", "Date de relance"])
seen = set()
for name, metier, village, rating, reviews, phone in rows:
    assert len(phone) == 10 and phone.startswith("07"), phone
    assert phone not in seen, phone
    seen.add(phone)
    n, r = int(reviews), float(rating)
    if n >= 5 and r >= 4.5:
        detail = f"vos {n} avis Google avec une note de {fr(rating)}/5"
    elif n >= 3 and r == 5:
        detail = f"vos {n} avis Google à 5/5"
    else:
        detail = f"votre fiche Google à {village}"
    msg = MSG.format(detail=detail)
    link = f"https://wa.me/41{phone[1:]}?text={quote(msg)}"
    mob = f"{phone[:3]} {phone[3:6]} {phone[6:8]} {phone[8:]}"
    ws.append([name, metier, village, 1, f"{fr(rating)} ({n} avis)", detail, mob,
               "Fiche Google Maps", msg, link, "", "", ""])

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
