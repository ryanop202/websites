# Fabrique la version allemande de la démo « studio de jardin » (demo-studio-de/) à partir de demo-studio/ (18.11.2026).
# Réutilise les paires de traduction-de.json (moteur commun) + les textes propres au studio ci-dessous.
# Les alertes envoyées à Ryan (« La démo est utilisée », etc.) restent en français exprès.
# Usage : py outils/traduire-studio-de.py
import json
import re
import shutil
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SRC = RACINE / 'demo-studio'
DST = RACINE / 'demo-studio-de'
PAIRES = json.loads((RACINE / 'outils' / 'traduction-de.json').read_text(encoding='utf-8'))

# Textes ajoutés au moteur depuis la traduction du 11.11 (studio, réalité augmentée, nouveau texte de demande)
EXTRA = {
    'app.js': [
        ["`Fondations et dalle · ${fmtM2(surface)}`", "`Fundament und Bodenplatte · ${fmtM2(surface)}`"],
        ["`Ossature bois isolée, plancher et plafond · ${fmtM2(surface)}`", "`Gedämmte Holzkonstruktion, Boden und Decke · ${fmtM2(surface)}`"],
        ["`Baie coulissante ${fmtM(lb)}`", "`Schiebefront ${fmtM(lb)}`"],
        ["`Fenêtres (${fenetres})`", "`Fenster (${fenetres})`"],
        ["'Électricité : tableau, prises, éclairage'", "'Elektro: Verteiler, Steckdosen, Beleuchtung'"],
        ["'Spots LED et applique extérieure'", "'LED-Spots und Aussenleuchte'"],
        ["'Climatisation réversible (chaud / froid)'", "'Klimagerät (heizen / kühlen)'"],
        ["'Livraison et montage'", "'Lieferung und Montage'"],
        ["`Bardage ${bard.label.toLowerCase()} · ${fmtM2(facades)}`", "`Fassade ${bard.label} · ${fmtM2(facades)}`"],
        ["`Toiture ${toit.label.toLowerCase()}, ${couv.label.toLowerCase()}`", "`Dach: ${toit.label}, ${couv.label}`"],
        ["`Terrasse en bois devant · ${fmtM2(st)}`", "`Holzterrasse davor · ${fmtM2(st)}`"],
        ["`Toit ${CONFIG.toits[state.toit].label.toLowerCase()}`,\n      couv.label,\n      `Bardage ${CONFIG.bardages[state.bardage].label.toLowerCase()}`,\n      `${LIB.finitionLigne} ${CONFIG.bois[state.bois].label.toLowerCase()}`,\n      state.led ? 'LED' : null,\n      state.chauffage ? 'Climatisation' : null,",
         "`${CONFIG.toits[state.toit].label}`,\n      couv.label,\n      `Fassade: ${CONFIG.bardages[state.bardage].label}`,\n      `${LIB.finitionLigne}: ${CONFIG.bois[state.bois].label}`,\n      state.led ? 'LED' : null,\n      state.chauffage ? 'Klimagerät' : null,"],
        ["`${v} sur ${CONFIG.limites.vantaux[1]}`", "`${v} von ${CONFIG.limites.vantaux[1]}`"],
        ["· hauteur intérieure ${fmtM(g.H)}`", "· Raumhöhe ${fmtM(g.H)}`"],
        ["['Toit', `${CONFIG.toits[state.toit].label}", "['Dach', `${CONFIG.toits[state.toit].label}"],
        ["['Bardage', CONFIG.bardages[state.bardage].label]", "['Fassade', CONFIG.bardages[state.bardage].label]"],
        ["['Ouvertures', `baie coulissante ${fmtM(p.lb)} + ${p.fenetres} fenêtre${p.fenetres > 1 ? 's' : ''}`]",
         "['Öffnungen', `Schiebefront ${fmtM(p.lb)} + ${p.fenetres} Fenster`]"],
        ["['électricité', state.led && 'spots LED', state.chauffage && 'climatisation réversible',\n        state.terrasseAvant && 'terrasse en bois devant',",
         "['Elektro', state.led && 'LED-Spots', state.chauffage && 'Klimagerät',\n        state.terrasseAvant && 'Holzterrasse davor',"],
        ["`Surface au sol ${fmtM2(p.surface)} · environ ${fmtM2((state.largeur - 0.34) * (state.profondeur - 0.34))} à l'intérieur · baie de ${fmtM(p.lb)}`",
         "`Grundfläche ${fmtM2(p.surface)} · innen etwa ${fmtM2((state.largeur - 0.34) * (state.profondeur - 0.34))} · Schiebefront ${fmtM(p.lb)}`"],
        ["'Climatisation réversible <small>chauffe l’hiver, rafraîchit l’été</small>'", "'Klimagerät <small>heizt im Winter, kühlt im Sommer</small>'"],
        ["'Spots LED <small>au plafond + applique extérieure</small>'", "'LED-Spots <small>an der Decke + Aussenleuchte</small>'"],
        ["`Voir ${/^[aeiouéèh]/i.test(LIB.objet) ? 'l’' : 'le '}${LIB.objet} dans votre jardin`", "`${LIB.objet} in Ihrem Garten ansehen`"],
        ["'Préparation…'", "'Wird vorbereitet…'"],
        ["`Visez le sol, puis touchez l’écran pour poser le ${LIB.objet}.`", "`Zielen Sie auf den Boden und tippen Sie, um das ${LIB.objet} zu platzieren.`"],
        ["'Faites le tour ! « Déplacer » pour le poser ailleurs.'", "'Gehen Sie darum herum! «Verschieben», um es woanders hinzustellen.'"],
        ["'Lancer la caméra'", "'Kamera starten'"],
        ["'Télécharger la fiche technique (PDF)'", "'Technisches Datenblatt herunterladen (PDF)'"],
        ["...(FICHE ? [`Fiche technique (plan coté + pièces, PDF) : ${lienFiche()}`] : []),", "...(FICHE ? [`Technisches Datenblatt (Plan + Stückliste, PDF): ${lienFiche()}`] : []),"],
    ],
    'index.html': [
        ["      Voir chez moi\n", "      Bei mir ansehen\n"],
        ["<span>Terrasse en bois devant <small>2 m de profondeur, sur toute la largeur</small></span>", "<span>Holzterrasse davor <small>2 m tief, über die ganze Breite</small></span>"],
        [">Fiche technique : plan coté + pièces (PDF)<", ">Technisches Datenblatt: Plan + Stückliste (PDF)<"],
        ['<h2 id="ra-titre">Voir dans votre jardin</h2>', '<h2 id="ra-titre">In Ihrem Garten ansehen</h2>'],
        ["Posez votre projet en taille réelle devant chez vous, avec l’appareil photo de votre téléphone. Faites-en le tour pour juger la place et le rendu.",
         "Stellen Sie Ihr Projekt in Originalgrösse vor Ihr Haus, mit der Kamera Ihres Handys. Gehen Sie darum herum, um Platz und Wirkung zu beurteilen."],
        ['id="ra-lancer">Lancer la caméra<', 'id="ra-lancer">Kamera starten<'],
        ["Scannez ce code avec l’appareil photo de votre téléphone : votre configuration s’ouvre, prête à être posée dans votre jardin.",
         "Scannen Sie diesen Code mit der Kamera Ihres Handys: Ihre Konfiguration öffnet sich und kann in Ihren Garten gestellt werden."],
        ["Ce téléphone ne permet pas la réalité augmentée dans le navigateur. Essayez avec un iPhone récent (Safari) ou un téléphone Android récent (Chrome).",
         "Dieses Handy unterstützt Augmented Reality im Browser nicht. Versuchen Sie es mit einem neueren iPhone (Safari) oder Android-Handy (Chrome)."],
        ["Calculé sur votre appareil : rien n’est envoyé. Taille réelle, à vérifier sur place avant la commande.",
         "Wird auf Ihrem Gerät berechnet: Es wird nichts gesendet. Originalgrösse, vor der Bestellung vor Ort prüfen."],
        ['data-action="tourner">↻ Tourner<', 'data-action="tourner">↻ Drehen<'],
        ['data-action="deplacer">✥ Déplacer<', 'data-action="deplacer">✥ Verschieben<'],
    ],
    'pdf.js': [
        ["'DÉMO — exemple de fiche transmise à l\\'entreprise avec la demande'", "'DEMO — Beispiel eines Datenblatts, das mit der Anfrage ans Unternehmen geht'"],
        ["'VUE DE FACE (côté entrée)'", "'FRONTANSICHT (Einfahrtsseite)'"],
        ["'LISTE DES PIÈCES (débit indicatif)'", "'STÜCKLISTE (Richtwerte)'"],
    ],
}

# Le texte de la demande a changé : on traduit le bloc par lignes
DEMANDE = [
    ["`DEMANDE DE DEVIS — ${CONFIG.produit} (${date})`", "`OFFERTANFRAGE — ${CONFIG.produit} (${date})`"],
    ["'CLIENT',", "'KUNDE',"],
    ["`Nom : ${d.nom}`", "`Name: ${d.nom}`"],
    ["`E-mail : ${d.email}`", "`E-Mail: ${d.email}`"],
    ["`Téléphone : ${d.tel || '—'}`", "`Telefon: ${d.tel || '—'}`"],
    ["`Lieu du chantier : ${d.lieu}`", "`Ort der Baustelle: ${d.lieu}`"],
    ["'CONFIGURATION',\n    ...lignesConfig().map(([l, v]) => `${l} : ${v}`),", "'KONFIGURATION',\n    ...lignesConfig().map(([l, v]) => `${l}: ${v}`),"],
    ["`PRIX INDICATIF AFFICHÉ : ${fmtCHF(p.ttc)} CHF TTC (fourchette ${fmtCHF(p.bas)}–${fmtCHF(p.haut)})`", "`ANGEZEIGTER RICHTPREIS: ${fmtCHF(p.ttc)} CHF inkl. MWST (Spanne ${fmtCHF(p.bas)}–${fmtCHF(p.haut)})`"],
    ["`Remarque : ${d.remarque || '—'}`", "`Bemerkung: ${d.remarque || '—'}`"],
    ["`Configuration en ligne : ${location.href}`", "`Konfiguration online: ${location.href}`"],
]

STUDIO_DE = """// Studio de jardin, version allemande (fabriquée par outils/traduire-studio-de.py, ne pas modifier à la main).
// ⚠️ Tous les PRIX sont FICTIFS.
export const CONFIG = {
  entreprise: { nom: 'Ihr Unternehmen', activite: 'Gartenstudios & Gartenbüros', initiales: 'IU', email: '' },
  produit: 'Gartenstudio',
  demo: true,
  type: 'studio',
  modele3d: 'studio',
  chapo: 'Stellen Sie Ihr Gartenstudio Schritt für Schritt zusammen. Der Preis passt sich bei jeder Wahl an.',
  libelles: {
    titre: 'Gartenstudio nach Mass',
    objet: 'Gartenstudio',
    passage: 'Höhe',
    largeur: 'Breite', largeurAide: 'Seite mit Schiebefront',
    profondeur: 'Tiefe', profondeurAide: '',
    hauteur: 'Raumhöhe', hauteurAide: 'unter der Decke',
    implantationAide: 'Das Studio steht hinten im Garten, auf einer kleinen Bodenplatte.',
    toiture: 'Dach',
    finition: 'Farbe der Fenster und Türen', finitionCourt: 'Fenster', finitionLigne: 'Fenster und Türen',
    parois: 'Fassade und Schiebefront', paroisCourt: 'Fassade',
    paroisAide: 'Wählen Sie die Fassade. Mit dem Regler öffnen Sie die Schiebefront und sehen hinein.',
    bardage: 'Fassade', paroiLigne: 'Fassade',
  },
  local: false,
  equipements: ['led', 'chauffage'],
  sol: 'terrasse',
  reculMaison: 8.5,
  limites: { largeur: [3, 6, 0.1], profondeur: [2.5, 4.5, 0.1], hauteur: [2.3, 2.6, 0.05], vantaux: [0, 2, 1] },
  porteeMax: 4,
  profondeursLocal: [1.2],
  implantations: { non: { label: 'Hinten im Garten', aide: 'auf einer Bodenplatte' } },
  positionsLocal: { arriere: { label: 'Hinten' } },
  raccourcis: [
    { label: 'Büro 3 × 2,5 m', largeur: 3, profondeur: 2.5, hauteur: 2.4 },
    { label: 'Studio 4 × 3 m', largeur: 4, profondeur: 3, hauteur: 2.4 },
    { label: 'Atelier 5,5 × 3,5 m', largeur: 5.5, profondeur: 3.5, hauteur: 2.5 },
  ],
  defauts: {
    largeur: 4, profondeur: 3, hauteur: 2.4, adosse: 'non', toit: 'plat', couverture: 'vegetal', teinteCouverture: 'sedum',
    bois: 'anthracite', paroiArriere: true, paroiGauche: true, paroiDroite: true, paroiAvant: false, bardage: 'meleze',
    rangement: false, posLocal: 'arriere', profLocal: 1.2, gouttieres: false, led: true, borne: false, storeToit: false,
    chauffage: false, terrasseAvant: true, vantaux: 1, vehicule: 'aucun',
  },
  toits: {
    plat: { label: 'Flachdach', pente: 2, couvertures: ['vegetal', 'gravier', 'epdm'] },
    unPan: { label: 'Pultdach mit Vordach', pente: 6, couvertures: ['tole', 'epdm'] },
  },
  couvertures: {
    vegetal: { label: 'Begrüntes Dach', epaisseur: 0.06, teintes: { sedum: { label: 'Sedum', couleur: '#6E8A45' } } },
    gravier: { label: 'Kies', epaisseur: 0.05, teintes: { gris: { label: 'Grau', couleur: '#9A968E' } } },
    epdm: { label: 'EPDM-Folie', epaisseur: 0.02, teintes: { noir: { label: 'Schwarz', couleur: '#2A2B2D' } } },
    tole: {
      label: 'Stehfalzblech', epaisseur: 0.02,
      teintes: {
        anthracite: { label: 'Anthrazit', couleur: '#3A3D40' },
        noir: { label: 'Schwarz', couleur: '#1F2022' },
        zinc: { label: 'Zink natur', couleur: '#9AA0A3' },
      },
    },
  },
  bois: {
    anthracite: { label: 'Anthrazitgrau', couleur: '#3A3D40', facteur: 1 },
    noir: { label: 'Schwarz', couleur: '#1E1F21', facteur: 1.02 },
    blanc: { label: 'Weiss', couleur: '#E8E7E2', facteur: 1 },
  },
  bardages: {
    meleze: { label: 'Lärche natur, horizontal', couleur: '#B9875A', sens: 'horizontal', facteur: 1.1 },
    epicea: { label: 'Fichte natur, vertikal', couleur: '#D4AE7C', facteur: 1 },
    gris: { label: 'Vorvergrautes Holz', couleur: '#A19D95', facteur: 1.08 },
    noir: { label: 'Schwarzes Holz (geflammt)', couleur: '#2C2A28', facteur: 1.2 },
  },
  vehicules: { aucun: { label: 'Keines' } },
  tarifs: {
    fondationM2: 140, ossatureM2: 950, bardageM2: 85, toitureM2: { plat: 160, unPan: 150 },
    couvertureM2: { vegetal: 95, gravier: 45, epdm: 35, tole: 70 },
    baieMl: 1150, fenetre: 980, electricite: 2200, led: 850, clim: 3400, terrasseM2: 240, poseTaux: 0.14, poseMin: 3000,
  },
  tva: 0.081,
  fourchette: 0.1,
};
"""

if DST.exists():
    for p in DST.iterdir():
        shutil.rmtree(p) if p.is_dir() else p.unlink()
shutil.copytree(SRC, DST, ignore=shutil.ignore_patterns('.wrangler', 'wrangler.jsonc', '*.pdf'), dirs_exist_ok=True)

manque = []
for fichier in ('app.js', 'pdf.js', 'index.html'):
    chemin = DST / fichier
    t = chemin.read_text(encoding='utf-8')
    paires = list(PAIRES.get(fichier, [])) + EXTRA.get(fichier, []) + (DEMANDE if fichier == 'app.js' else [])
    for fr, de in paires:
        if fr in t:
            t = t.replace(fr, de)
        elif fr in [x[0] for x in EXTRA.get(fichier, []) + DEMANDE]:
            manque.append(f'{fichier}: {fr[:80]!r}')
    for fr, de in PAIRES.get('_tout', []):
        t = t.replace(fr, de)
    chemin.write_text(t, encoding='utf-8')

(DST / 'produits' / 'studio.js').write_text(STUDIO_DE, encoding='utf-8')
(DST / 'config.js').write_text("""// Démo studio de jardin, version allemande (outils/traduire-studio-de.py). ⚠️ PRIX FICTIFS.
import { CONFIG as studio } from './produits/studio.js';

export const CONFIG = { ...studio, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
""", encoding='utf-8')
html = (DST / 'index.html').read_text(encoding='utf-8').replace('<html lang="fr">', '<html lang="de">')
(DST / 'index.html').write_text(html, encoding='utf-8')

if manque:
    print('⚠️  textes studio introuvables :')
    print('\n'.join(manque))
print('ok : demo-studio-de/ prête')
