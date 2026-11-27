# Page « offre » à leur nom pour les prospects chauds (19.11.2026) : https://<id>.wibzo.ch/offre/
# Remplace l'appel téléphonique (Ryan ne fait pas d'appels) : ce qui est compris, prix, paiement, étapes, bouton « Je commande »
# (e-mail prérempli) et WhatsApp. Tout vient du contrat (documents-client/2-CONTRAT.md, approuvé le 13.11.2026).
# Usage : py outils/page-offre.py   puis `npx wrangler deploy` dans hebergement-demos/.
import html
from pathlib import Path
from urllib.parse import quote

RACINE = Path(__file__).resolve().parent.parent
WHATSAPP = '41767574393'  # numéro Wibzo (CLAUDE.md)

OFFRES = [
    dict(id='concept-terrasse', lang='fr', nom='Concept Terrasse Sàrl', logo='../marque/logo-concept-terrasse.svg',
         produit='terrasses', titre='Votre configurateur de terrasses en 3D, directement sur votre site',
         intro='Vos clients composent leur terrasse en 3D (dimensions, matériau, couleur, options), voient un prix indicatif et vous envoient une demande complète.',
         produits=1),
    dict(id='aqua-emotion', lang='de', nom='Aqua Emotion AG', logo='',
         produit='Einstückbecken', titre='Ihr 3D-Konfigurator für Einstückbecken, direkt auf Ihrer Website',
         intro='Ihre Kunden wählen eines Ihrer 19 Rechteckbecken, passen die Länge an, wählen Farbe und Optionen, sehen einen Richtpreis und senden Ihnen eine vollständige Anfrage.',
         produits=1),
    dict(id='sonnfix', lang='de', nom='Sonnfix GmbH', logo='../marque/logo.png',
         produit='Pavillons und Pergolen', titre='Ihr 3D-Konfigurator für Pavillons und Pergolen, direkt auf Ihrer Website',
         intro='Ihre Kunden stellen ihren Pavillon mit Lamellendach oder ihre Pergola mit Stoffbespannung in 3D zusammen, sehen einen Richtpreis und senden Ihnen eine vollständige Anfrage.',
         produits=2),
]

T = {
    'fr': dict(
        offre='Offre pour', date='19 novembre 2026', demo='Votre démo', ouvrir='Ouvrir la démo en grand',
        inclus='Ce qui est compris',
        liste=['Le configurateur à vos couleurs, avec vos modèles, vos options et vos prix',
               'Les demandes envoyées à votre adresse e-mail, avec les dimensions, les options, l’image 3D et le prix indicatif',
               'L’hébergement du configurateur',
               'L’aide à l’intégration sur votre site (bouton ou lien), directement ou avec votre agence web',
               'Les modifications illimitées : prix, options, couleurs et modèles du même type de produit',
               'Le support par e-mail'],
        prix='Prix', achat='Achat', achat_aide='En une seule fois, sans frais mensuels. L’hébergement est compris.',
        mensuel='Mensuel', mensuel_prix='990 CHF', mensuel_aide='de mise en place, puis 60 CHF par mois (facturé par trimestre, 180 CHF). Minimum 15 mois, puis résiliable chaque mois.',
        recommande='Recommandé', une_fois='CHF, une fois', deux='pour les 2 produits (2 500 + 500 CHF)',
        net='Wibzo n’est pas assujetti à la TVA : les prix sont nets.',
        paiement='Vous ne payez qu’à la mise en ligne',
        paiement_txt='Rien à payer avant. Vous testez votre configurateur et demandez les changements. La facture QR arrive seulement à la mise en ligne, payable à 30 jours.',
        etapes_t='Comment ça se passe',
        etapes=['Vous cliquez sur « Je commande » ci-dessous.',
                'Vous m’envoyez vos {p} : matériaux, couleurs, options, prix indicatifs et logo.',
                'Je prépare votre version. Vous la testez et demandez les changements.',
                'Mise en ligne sur votre site, puis facture QR à 30 jours.'],
        cta='Je commande', wa='Écrire sur WhatsApp', question='Une question ? Écrivez-moi, je réponds rapidement.',
        sujet='Commande du configurateur 3D – {nom}',
        corps='Bonjour Ryan,\n\nNous souhaitons commander le configurateur 3D.\nFormule choisie : achat / mensuel (biffer ce qui ne convient pas)\n\nPersonne de contact :\nAdresse de facturation :\n\nMeilleures salutations',
        wa_txt='Bonjour Ryan, c’est {nom}. Nous avons une question sur le configurateur 3D.',
        prix_indicatifs='Les prix affichés dans la démo sont fictifs : ce sont vos prix qui seront utilisés.',
        signature='Ryan · Wibzo'),
    'de': dict(
        offre='Offerte für', date='19. November 2026', demo='Ihre Demo', ouvrir='Demo gross öffnen',
        inclus='Was inbegriffen ist',
        liste=['Der Konfigurator in Ihren Farben, mit Ihren Modellen, Optionen und Preisen',
               'Die Anfragen an Ihre E-Mail-Adresse, mit Massen, Optionen, 3D-Bild und Richtpreis',
               'Das Hosting des Konfigurators',
               'Hilfe bei der Einbindung auf Ihrer Website (Button oder Link), direkt oder mit Ihrer Webagentur',
               'Unbegrenzte Änderungen: Preise, Optionen, Farben und Modelle derselben Produktart',
               'Support per E-Mail'],
        prix='Preis', achat='Kauf', achat_aide='Einmalig, ohne monatliche Kosten. Das Hosting ist inbegriffen.',
        mensuel='Monatlich', mensuel_prix='CHF 990', mensuel_aide='Einrichtung, danach CHF 60 pro Monat (quartalsweise verrechnet, CHF 180). Mindestdauer 15 Monate, danach monatlich kündbar.',
        recommande='Empfohlen', une_fois='CHF, einmalig', deux='für beide Produkte (2’500 + 500 CHF)',
        net='Wibzo ist nicht MWST-pflichtig: Die Preise sind netto.',
        paiement='Sie bezahlen erst bei der Aufschaltung',
        paiement_txt='Vorher bezahlen Sie nichts. Sie testen Ihren Konfigurator und wünschen Änderungen. Die QR-Rechnung kommt erst bei der Aufschaltung, zahlbar innert 30 Tagen.',
        etapes_t='So läuft es ab',
        etapes=['Sie klicken unten auf «Ich bestelle».',
                'Sie senden mir Ihre Angaben zu {p}: Modelle, Masse, Farben, Optionen, Richtpreise und Logo.',
                'Ich bereite Ihre Version vor. Sie testen sie und wünschen Änderungen.',
                'Aufschaltung auf Ihrer Website, danach QR-Rechnung, zahlbar innert 30 Tagen.'],
        cta='Ich bestelle', wa='Per WhatsApp schreiben', question='Eine Frage? Schreiben Sie mir, ich antworte schnell.',
        sujet='Bestellung 3D-Konfigurator – {nom}',
        corps='Guten Tag Ryan\n\nWir möchten den 3D-Konfigurator bestellen.\nGewählte Variante: Kauf / Monatlich (Nichtzutreffendes streichen)\n\nKontaktperson:\nRechnungsadresse:\n\nFreundliche Grüsse',
        wa_txt='Guten Tag Ryan, hier ist {nom}. Wir haben eine Frage zum 3D-Konfigurator.',
        prix_indicatifs='Die Preise in der Demo sind fiktiv: Verwendet werden Ihre Preise.',
        signature='Ryan · Wibzo'),
}

CSS = """
@font-face { font-family: 'Instrument Sans'; font-weight: 400 700; font-display: swap; src: url('../vendor/fonts/instrument-sans-latin.woff2') format('woff2'); }
@font-face { font-family: 'Newsreader'; font-weight: 300 700; font-display: swap; src: url('../vendor/fonts/newsreader-latin-wght-normal.woff2') format('woff2'); }
:root { --papier: #F6F2EA; --carte: #FFFFFF; --encre: #1F1D1A; --encre-2: #5E584E; --trait: #E2DBCD; --accent: #A9521E; --accent-fonce: #8E4316; --vert: #2F6B3A; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--papier); color: var(--encre); font: 16px/1.55 'Instrument Sans', system-ui, sans-serif; }
.page { max-width: 980px; margin: 0 auto; padding: 0 16px 64px; }
header.haut { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 0; border-bottom: 1px solid var(--trait); }
.client { display: flex; align-items: center; gap: 14px; min-width: 0; }
.client img { max-height: 44px; max-width: 160px; object-fit: contain; }
.client small { display: block; color: var(--encre-2); font-size: 13px; }
.client strong { display: block; font-size: 16px; overflow-wrap: anywhere; }
.wibzo { font-size: 13px; color: var(--encre-2); text-align: right; white-space: nowrap; }
.wibzo b { color: var(--encre); }
h1, h2 { font-family: 'Newsreader', Georgia, serif; font-weight: 500; letter-spacing: -0.01em; }
h1 { font-size: clamp(30px, 5vw, 46px); line-height: 1.08; margin: 40px 0 14px; max-width: 760px; }
.intro { font-size: 18px; color: var(--encre-2); max-width: 680px; margin: 0 0 28px; }
h2 { font-size: 28px; margin: 52px 0 16px; }
.demo { background: var(--carte); border: 1px solid var(--trait); border-radius: 6px; overflow: hidden; }
.demo iframe { display: block; width: 100%; height: 560px; border: 0; }
.demo a { display: block; padding: 12px 16px; border-top: 1px solid var(--trait); color: var(--accent-fonce); font-weight: 600; text-decoration: none; }
.demo a:hover { text-decoration: underline; }
.note { font-size: 13px; color: var(--encre-2); margin: 8px 0 0; }
ul.inclus { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 28px; }
ul.inclus li { position: relative; padding-left: 26px; }
ul.inclus li::before { content: ''; position: absolute; left: 2px; top: 7px; width: 12px; height: 7px; border-left: 2px solid var(--vert); border-bottom: 2px solid var(--vert); transform: rotate(-45deg); }
.prix { display: grid; grid-template-columns: 1.15fr 1fr; gap: 14px; }
.formule { background: var(--carte); border: 1px solid var(--trait); border-radius: 6px; padding: 22px; }
.formule.mise { border-color: var(--encre); box-shadow: 0 0 0 1px var(--encre); }
.formule h3 { margin: 0 0 6px; font-size: 14px; text-transform: uppercase; letter-spacing: .08em; color: var(--encre-2); display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.formule h3 span { text-transform: none; letter-spacing: 0; background: var(--encre); color: #fff; font-size: 12px; padding: 2px 8px; border-radius: 3px; }
.montant { font-family: 'Newsreader', Georgia, serif; font-size: 44px; line-height: 1.1; }
.montant small { font-family: 'Instrument Sans', sans-serif; font-size: 15px; color: var(--encre-2); }
.formule p { margin: 8px 0 0; color: var(--encre-2); }
.bandeau { margin-top: 14px; background: #EAF1E7; border: 1px solid #CADBC4; border-radius: 6px; padding: 18px 20px; }
.bandeau strong { display: block; font-size: 17px; margin-bottom: 4px; }
ol.etapes { list-style: none; counter-reset: e; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
ol.etapes li { counter-increment: e; background: var(--carte); border: 1px solid var(--trait); border-radius: 6px; padding: 16px; }
ol.etapes li::before { content: counter(e, decimal-leading-zero); display: block; font-family: 'Newsreader', Georgia, serif; font-size: 26px; color: var(--accent); margin-bottom: 6px; }
.action { margin-top: 52px; background: var(--encre); color: #F6F2EA; border-radius: 6px; padding: 30px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.action p { margin: 0; font-size: 17px; max-width: 420px; }
.boutons { display: flex; gap: 10px; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 22px; border-radius: 4px; font-weight: 600; text-decoration: none; font-size: 16px; }
.btn.plein { background: var(--accent); color: #fff; }
.btn.plein:hover { background: var(--accent-fonce); }
.btn.ligne { border: 1px solid #8C857A; color: #F6F2EA; }
.btn.ligne:hover { border-color: #F6F2EA; }
.btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
footer { margin-top: 28px; font-size: 13px; color: var(--encre-2); }
footer a { color: inherit; }
@media (max-width: 760px) {
  header.haut { flex-wrap: wrap; }
  .wibzo { text-align: left; }
  .demo iframe { height: 440px; }
  ul.inclus, .prix { grid-template-columns: 1fr; }
  ol.etapes { grid-template-columns: 1fr 1fr; }
  .action { padding: 22px; }
  .boutons, .btn { width: 100%; }
}
@media (max-width: 420px) { ol.etapes { grid-template-columns: 1fr; } }
"""

for o in OFFRES:
    t = T[o['lang']]
    e = lambda s: html.escape(s, quote=True)
    nom = o['nom']
    mail = f"mailto:contact@wibzo.ch?subject={quote(t['sujet'].format(nom=nom))}&body={quote(t['corps'])}"
    wa = f"https://wa.me/{WHATSAPP}?text={quote(t['wa_txt'].format(nom=nom))}"
    achat = '3 000' if o['produits'] == 2 and o['lang'] == 'fr' else ('3’000' if o['produits'] == 2 else ('2 500' if o['lang'] == 'fr' else '2’500'))
    deux = f"<p>{e(t['deux'])}</p>" if o['produits'] == 2 else ''
    logo = f'<img src="{e(o["logo"])}" alt="{e(nom)}">' if o['logo'] else ''
    page = f"""<!doctype html>
<html lang="{o['lang']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{e(t['offre'])} {e(nom)} · Wibzo</title>
<style>{CSS}</style>
</head>
<body>
<div class="page">
  <header class="haut">
    <div class="client">{logo}<div><small>{e(t['offre'])}</small><strong>{e(nom)}</strong></div></div>
    <div class="wibzo"><b>Wibzo</b> · {e(t['date'])}</div>
  </header>

  <h1>{e(o['titre'])}</h1>
  <p class="intro">{e(o['intro'])}</p>

  <section class="demo" aria-label="{e(t['demo'])}">
    <iframe src="../" title="{e(t['demo'])}" loading="lazy"></iframe>
    <a href="../" target="_blank" rel="noopener">{e(t['ouvrir'])} →</a>
  </section>
  <p class="note">{e(t['prix_indicatifs'])}</p>

  <h2>{e(t['inclus'])}</h2>
  <ul class="inclus">{''.join(f'<li>{e(x)}</li>' for x in t['liste'])}</ul>

  <h2>{e(t['prix'])}</h2>
  <div class="prix">
    <div class="formule mise"><h3>{e(t['achat'])} <span>{e(t['recommande'])}</span></h3>
      <div class="montant">{achat} <small>{e(t['une_fois'])}</small></div>{deux}<p>{e(t['achat_aide'])}</p></div>
    <div class="formule"><h3>{e(t['mensuel'])}</h3>
      <div class="montant">{e(t['mensuel_prix'])}</div><p>{e(t['mensuel_aide'])}</p></div>
  </div>
  <p class="note">{e(t['net'])}</p>
  <div class="bandeau"><strong>{e(t['paiement'])}</strong>{e(t['paiement_txt'])}</div>

  <h2>{e(t['etapes_t'])}</h2>
  <ol class="etapes">{''.join(f'<li>{e(x.format(p=o["produit"]))}</li>' for x in t['etapes'])}</ol>

  <div class="action">
    <p>{e(t['question'])}</p>
    <div class="boutons">
      <a class="btn plein" href="{e(mail)}">{e(t['cta'])}</a>
      <a class="btn ligne" href="{e(wa)}" target="_blank" rel="noopener">{e(t['wa'])}</a>
    </div>
  </div>
  <footer>{e(t['signature'])} · <a href="mailto:contact@wibzo.ch">contact@wibzo.ch</a></footer>
</div>
</body>
</html>
"""
    dst = RACINE / 'clients' / o['id'] / 'offre'
    dst.mkdir(exist_ok=True)
    (dst / 'index.html').write_text(page, encoding='utf-8')
    print('ok', o['id'])
