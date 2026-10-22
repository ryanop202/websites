# Crée prospection/nouvelles-entreprises-vaud-fribourg.xlsx (Nom | Numéro | Message | WhatsApp | SMS | Réponse)
# depuis fosc_verifies.txt. Écrit le 22.10.2026.
# Message validé par Ryan le 22.10.2026 : la vraie offre (maquette gratuite déjà prête), aucun prix,
# « vient de s'inscrire au registre du commerce » à la place de la note Google (PROCESS.md).
# Lancer : python prospection\outils\fosc_xlsx.py   (Excel doit être fermé)
# Les réponses déjà notées dans l'Excel sont gardées.

import os
from urllib.parse import quote
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Font, PatternFill

DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(DIR, "..", "nouvelles-entreprises-vaud-fribourg.xlsx")
BENEFIT = {"devis": "voir vos réalisations ou demander un devis", "rdv": "voir vos prestations ou réserver"}

INSCRIT = {"recent": "vient de s'inscrire au registre du commerce",
           "mois": "s'est inscrit au registre du commerce il y a quelques mois"}
MSG = ("Bonjour, ici Ryan de Wibzo, créateur web dans la Broye.\n\n"
       "J'ai vu {que} {inscrit}, bravo pour le lancement ! "
       "Quand un nouveau client cherche {metier} {commune}, il veut {benefit}, "
       "mais il ne trouve pas encore de site à votre nom.\n\n"
       "Je vous ai déjà préparé une maquette de votre site, gratuitement et sans engagement. "
       "Si elle ne vous plaît pas, on en reste là.\n\n"
       "Je vous l'envoie ?")


def que(nom):  # « que Atelier » -> « qu'Atelier »
    return ("qu'" if nom[0].lower() in "aeiouyéèêâî" else "que ") + nom


def a(commune):  # « à Le Bry » -> « au Bry »
    if commune.startswith("Le "):
        return "au " + commune[3:]
    if commune.startswith("Les "):
        return "aux " + commune[4:]
    return "à " + commune


rows = []
for l in open(os.path.join(DIR, "fosc_verifies.txt"), encoding="utf-8"):
    if l.strip() and not l.startswith("#"):
        nom, court, tel, metier, commune, ben, quand = [c.strip() for c in l.split("¦")][:7]
        # « 2025 » = inscrit il y a plus d'un an : on donne l'année plutôt que « il y a quelques mois ».
        inscrit = INSCRIT.get(quand, f"s'est inscrit au registre du commerce en {quand}")
        rows.append([nom, tel, MSG.format(que=que(court), inscrit=inscrit, metier=metier,
                                          commune=a(commune), benefit=BENEFIT[ben])])

old = {}
if os.path.exists(OUT):
    ws = load_workbook(OUT).active
    head = [c.value for c in ws[1]]
    col = head.index("Réponse")
    old = {r[0]: r[col] for r in ws.iter_rows(min_row=2, values_only=True) if r[0]}

wb = Workbook()
ws = wb.active
ws.title = "Prospects"
# Colonne WhatsApp ajoutée le 22.10.2026 (demande de Ryan) : lien direct avec le message déjà écrit.
# Colonne SMS ajoutée le 22.10.2026 (après le ban WhatsApp) : ouvre l'app Messages du téléphone avec le texte.
ws.append(["Nom", "Numéro", "Message", "WhatsApp", "SMS", "Réponse"])
for c in ws[1]:
    c.font = Font(bold=True, color="FFFFFF")
    c.fill = PatternFill("solid", fgColor="1F3A5F")
for nom, tel, msg in rows:
    num = "41" + tel.replace("*", "").replace(" ", "")[1:]
    ws.append([nom, tel, msg, "Ouvrir WhatsApp", "Ouvrir SMS", old.get(nom)])
    for col, url in ((4, f"https://wa.me/{num}?text={quote(msg)}"),
                     (5, f"sms:+{num}?&body={quote(msg)}")):  # « ?&body= » marche sur iPhone et Android
        lien = ws.cell(ws.max_row, col)
        lien.hyperlink = url
        lien.font = Font(color="0563C1", underline="single")
for row in ws.iter_rows(min_row=2):
    for c in row:
        c.alignment = Alignment(wrap_text=True, vertical="top")
for col, w in zip("ABCDEF", (32, 18, 80, 18, 14, 30)):
    ws.column_dimensions[col].width = w
ws.freeze_panes = "A2"
wb.save(OUT)
print(f"{len(rows)} entreprises -> {os.path.abspath(OUT)}")
