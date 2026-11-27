# Démos « studio de jardin » à leur nom pour les prospects (18.11.2026) : copie de demo-studio/ (FR) ou demo-studio-de/ (DE)
# dans clients/<id>/, config.js au nom de l'entreprise (initiales, alerte Web3Forms) et MESSAGE.md (mail prêt).
# Avant : py outils/traduire-studio-de.py (version allemande). Après : `npx wrangler deploy` dans hebergement-demos/.
# Usage : py outils/demo-studio.py outils/prospects-studio.json
import json
import re
import shutil
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
CLE = '73b06b18-08c3-4c83-9ca8-42288a70dd2b'  # clé Web3Forms publique (alertes « La démo est utilisée »)
LISTE = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))

MAIL_DE = """Guten Tag

Mein Name ist Ryan, ich entwickle 3D-Konfiguratoren für Unternehmen, die nach Mass fertigen.

{phrase} Ich bin überzeugt, dass ein Konfigurator auf Ihrer Website Ihren Verkauf deutlich steigern und Ihre Offertanfragen stark vereinfachen kann. Deshalb habe ich eine Demo auf Ihren Namen vorbereitet:

https://{id}.wibzo.ch/

So funktioniert es:
- Ihre Kunden stellen ihr Gartenhaus selbst in 3D zusammen: Masse, Dach, Fassade, Fenster und Ausstattung. Sie sehen sofort einen Richtpreis.
- Sie erhalten eine vollständige Anfrage mit allen Massen, Optionen und einem 3D-Bild, ohne langes Hin und Her.
- Ihre Website hebt sich klar von der Konkurrenz ab.

Das ist erst eine erste Version mit fiktiven Preisen. Wenn Sie interessiert sind, gehe ich gerne weiter und passe sie an Ihre Modelle, Optionen, Farben und Preise an.

Hätten Sie Interesse, diesen Konfigurator zu nutzen?

Freundliche Grüsse
Ryan
Wibzo · contact@wibzo.ch

Falls Sie keine weiteren Nachrichten von mir wünschen, genügt eine kurze Antwort."""

MAIL_FR = """Bonjour,

Je m'appelle Ryan, je développe des configurateurs 3D pour les entreprises qui fabriquent sur mesure.

{phrase} Je suis convaincu qu'un configurateur sur votre site peut nettement augmenter vos ventes et beaucoup simplifier vos demandes de devis. J'ai donc préparé une démo à votre nom :

https://{id}.wibzo.ch/

Comment ça marche :
- Vos clients composent eux-mêmes leur studio de jardin en 3D : dimensions, toit, bardage, fenêtres et équipements. Ils voient tout de suite un prix indicatif.
- Vous recevez une demande complète avec toutes les dimensions, les options et une image 3D, sans aller-retour.
- Votre site se démarque clairement de la concurrence.

C'est une première version avec des prix fictifs. Si cela vous intéresse, je vais volontiers plus loin et l'adapte à vos modèles, options, couleurs et prix.

Est-ce qu'un configurateur de ce type vous intéresserait ?

Meilleures salutations
Ryan
Wibzo · contact@wibzo.ch

Si vous ne souhaitez plus recevoir de message de ma part, une courte réponse suffit."""


def initiales(nom):
    mots = [m for m in re.split(r'[\s&+\-–.]+', re.sub(r'\b(AG|GmbH|SA|Sàrl|S\.A\.|und|et|de|des|du)\b', ' ', nom)) if m]
    return (''.join(m[0] for m in mots[:2]) or nom[:2]).upper()


js = lambda s: json.dumps(s, ensure_ascii=False)
mails = []
for p in LISTE:
    pid, nom, email, site, lang, activite, phrase = p
    src = RACINE / ('demo-studio-de' if lang == 'de' else 'demo-studio')
    dst = RACINE / 'clients' / pid
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns('config.js', '.wrangler', 'wrangler.jsonc', '*.pdf'))
    (dst / 'config.js').write_text(f"""// Démo studio de jardin ({'allemand' if lang == 'de' else 'français'}) préparée pour {nom}, 18.11.2026 (outils/demo-studio.py).
// Produit vu sur {site} (vérifié par script le 13.11.2026). ⚠️ Tous les PRIX sont FICTIFS.
import {{ CONFIG as base }} from './produits/studio.js';

export const CONFIG = {{
  ...base,
  entreprise: {{ nom: {js(nom)}, activite: {js(activite)}, initiales: {js(initiales(nom))}, logo: '', email: '' }},
  suivi: {{ cleWeb3Forms: '{CLE}' }}, // clé publique, faite pour le code de la page
  assistant: true,
  couleurs: {{ plan: '#3D3A35', 'plan-clair': '#EFEBE3' }},
}};
""", encoding='utf-8')
    corps = (MAIL_DE if lang == 'de' else MAIL_FR).format(phrase=phrase, id=pid)
    objet = f'3D-Demo für {nom}' if lang == 'de' else f'Démo 3D préparée pour {nom}'
    (dst / 'MESSAGE.md').write_text(f'# {nom} — prise de contact (18.11.2026, démo studio)\n\n**À :** {email}\n**Objet :** {objet}\n'
                                     f'**Démo :** https://{pid}.wibzo.ch/\n**Site :** {site}\n\n```\n{corps}\n```\n', encoding='utf-8')
    mails.append(dict(id=pid, nom=nom, email=email, lang=lang, objet=objet, corps=corps))

(RACINE / 'outils' / 'mails-studio.json').write_text(json.dumps(mails, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'{len(mails)} démos studio prêtes dans clients/ + outils/mails-studio.json')
