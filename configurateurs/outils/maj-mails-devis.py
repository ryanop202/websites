# Calculateur de devis : met à jour les mails des prospects (24.11.2026).
# - lien démo : claude.ai/artifact → https://devis.wibzo.ch/#<langue>-<métier>-<entreprise>
# - prix décidé par Ryan le 24.11.2026 : ~350 CHF + ~20 CHF/mois (le « 48 h » non décidé est retiré)
# - signature : Ryan, Wibzo · contact@wibzo.ch (pas de numéro : pas d'appel, voir CLAUDE.md)
# - les 100 premières lignes (priorité A) passent en « Lot 1 – prêt »
# Lancer : python -I outils/maj-mails-devis.py
import re, sys, openpyxl

FICHIERS = ['demo-devis/prospects-calculateur.xlsx', 'prospects-calculateur.xlsx']
LOT1 = 100

PRIX = {
    'FR': ("Installation sur votre site, adaptée à vos tarifs : 350 CHF, puis 20 CHF par mois "
           "pour l'hébergement et les petites modifications. Vous ne payez qu'une fois que tout fonctionne."),
    'DE': ("Einbau auf Ihrer Website, an Ihre Preise angepasst: CHF 350, danach CHF 20 pro Monat "
           "für Hosting und kleine Anpassungen. Sie bezahlen erst, wenn alles funktioniert."),
}
SIGNATURE = 'Ryan\nWibzo · contact@wibzo.ch'


def nouveau_texte(texte, langue):
    texte = texte.replace('https://claude.ai/artifact/Mh7YNfggjxo9LE8GBFnwc1#', 'https://devis.wibzo.ch/#')
    if langue == 'FR':
        texte = re.sub(r"Installation sur votre site[^\n]*", PRIX['FR'], texte)
        texte = texte.replace('[Ton prénom]\n[Ton numéro]', SIGNATURE)
    else:
        texte = re.sub(r"Einbau auf Ihrer Website[^\n]*", PRIX['DE'], texte)
        texte = texte.replace('[Dein Vorname]\n[Deine Nummer]', SIGNATURE)
    if '[' in texte or 'claude.ai' in texte or '490' in texte:
        sys.exit('Texte non mis à jour :\n' + texte)
    return texte


for f in FICHIERS:
    wb = openpyxl.load_workbook(f)
    ws = wb['Prospects']
    tete = [c.value for c in ws[1]]
    c_lang, c_msg, c_lien, c_stat = (tete.index(n) + 1 for n in
                                     ('Langue', 'Message prêt à envoyer', 'Lien démo perso', 'Statut'))
    for i in range(2, ws.max_row + 1):
        lang = ws.cell(i, c_lang).value
        if not lang:
            continue
        ws.cell(i, c_msg).value = nouveau_texte(ws.cell(i, c_msg).value, lang)
        ws.cell(i, c_lien).value = ws.cell(i, c_lien).value.replace(
            'https://claude.ai/artifact/Mh7YNfggjxo9LE8GBFnwc1#', 'https://devis.wibzo.ch/#')
        if i - 1 <= LOT1 and ws.cell(i, c_stat).value == 'À envoyer':
            ws.cell(i, c_stat).value = 'Lot 1 – prêt'
    wb.save(f)
    print('OK', f)
