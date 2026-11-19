# Démos PERSONNALISÉES (19.11.2026) pour les prospects qui ont déjà utilisé leur démo (alertes Web3Forms).
# Pour chacun : leur logo (téléchargé de leur site dans clients/<id>/marque/), tous leurs produits que le moteur sait faire,
# et leurs vrais termes (modèles, matériaux, options) relevés sur leur site le 19.11.2026. Rien d'inventé : ce qui n'est
# pas sur leur site reste générique. ⚠️ Tous les PRIX restent FICTIFS.
# Usage : py outils/demo-perso.py   puis `npx wrangler deploy` dans hebergement-demos/.
import shutil
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
CLIENTS = RACINE / 'clients'

ICONES = {
    'carport': '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>',
    'veranda': '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>',
    'pergola-bio': '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>',
    'piscine': '<path d="M3 9h18v9H3zM6 12c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M7 9V5h2M7 7h2"/>',
    'pergola': '<path d="M3 20h18M6 20V9M18 20V9M3 9h18M5 6h14M8 6v3M12 6v3M16 6v3"/>',
    'terrasse': '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>',
    'studio': '<path d="M3 20h18M5 20V10l7-5 7 5v10M10 20v-5h4v5"/>',
}

# Carport métal (repris de outils/demo-de.py, METAL)
METAL_DE = """materiau: 'alu', produit: 'Metall-Carport',
    libelles: { ...b.libelles, titre: 'Metall-Carport nach Mass', finition: 'Farbe der Konstruktion', finitionCourt: 'Farbe', finitionLigne: 'Konstruktion', hauteurAide: 'unter der Konstruktion' },
    bois: { verzinkt: { label: 'Feuerverzinkt', couleur: '#A3A8AB', facteur: 1 }, anthrazit: { label: 'Anthrazit (RAL 7016)', couleur: '#3A3D40', facteur: 1.08 }, weiss: { label: 'Weiss (RAL 9016)', couleur: '#E8E7E2', facteur: 1.08 } },
    toits: { plat: { label: 'Flachdach', pente: 2, couvertures: ['tole', 'polycarbonate'] }, unPan: { label: 'Pultdach', pente: 8, couvertures: ['tole', 'polycarbonate'] } },
    defauts: { ...b.defauts, bois: 'verzinkt', toit: 'plat', couverture: 'tole', teinteCouverture: 'anthracite' },"""

T = lambda: None  # (lisibilité)

# id: (langue, logo, activité, chapo, [(produit, libellé, aide, surcharges JS avec b = config de base)], produit par défaut)
SPECS = {
    'schaewi-pool': ('de', 'marque/logo.jpg', 'Schwimmbäder & Pools', 'Wählen Sie Ihren Beckentyp, die Masse und die Poolattraktionen. Der Preis passt sich jeder Wahl an.', [
        ('piscine', 'Schwimmbecken', 'Beckentyp, Masse, Treppe, Beckenrand und Poolattraktionen.', """
    produit: 'Schwimmbecken',
    couvertures: {
      liner: { ...b.couvertures.liner, label: 'Betonpool mit Folienauskleidung' },
      mosaique: { ...b.couvertures.mosaique, label: 'Mosaikbecken' },
      inox: { label: 'Chromstahlbecken', metal: true, teintes: { brosse: { label: 'Chromstahl gebürstet', couleur: '#C3C9CD', eau: '#42B9D4' } } },
      beton: { label: 'Sicht-Betonpool', teintes: { gris: { label: 'Sichtbeton', couleur: '#A9A8A3', eau: '#2F8E9A' } } },
      coque: { label: 'Fertigbecken', teintes: { blanc: { label: 'Weiss', couleur: '#EEF1F0', eau: '#45BFDB' }, bleu: { label: 'Hellblau', couleur: '#9CC7E2', eau: '#2F96CF' }, gris: { label: 'Grau', couleur: '#8C9196', eau: '#2E7A86' } } },
    },
    toits: Object.fromEntries(Object.entries(b.toits).map(([id, t]) => [id, { ...t, couvertures: ['liner', 'mosaique', 'inox', 'beton', 'coque'] }])),
    libellesOptions: { gouttieres: ['Rollladenabdeckung', 'elektrisch, PVC oder Polycarbonat'], chauffage: ['Nackenschwall', 'Wasserattraktion'], borne: ['Gegenstromanlage', ''] },
    libelles: { ...b.libelles, titre: 'Ihr Schwimmbecken', couverture: 'Beckentyp', teinte: 'Ausführung', ledAide: 'Poolbeleuchtung in der Beckenwand' },""")], 'piscine'),

    'mad-inoxial': ('fr', '', 'Piscines & spas en inox · Grolley', "Composez votre piscine en acier inoxydable : pas d'hivernage, un entretien facile. Le prix suit chaque choix.", [
        ('piscine', 'Piscine inox', 'Bassin en acier inoxydable sur mesure : escalier, margelles, plage et options.', """
    produit: 'Piscine inox',
    libelles: { ...b.libelles, titre: 'Votre piscine en inox' },
    couvertures: { inox: { label: 'Acier inoxydable', metal: true, teintes: { brosse: { label: 'Inox brossé', couleur: '#C3C9CD', eau: '#42B9D4' }, poli: { label: 'Inox poli', couleur: '#DCE1E4', eau: '#47C2DC' } } } },
    toits: Object.fromEntries(Object.entries(b.toits).map(([id, t]) => [id, { ...t, couvertures: ['inox'] }])),
    defauts: { ...b.defauts, couverture: 'inox', teinteCouverture: 'brosse' },""")], 'piscine'),

    'wintergarten-zug': ('de', '', 'Wintergärten & Sommergärten · Zug', 'Wintergarten (warm) oder Sommergarten (kalt): wählen Sie Ausführung, Masse und Verglasung.', [
        ('veranda', 'Wintergarten / Sommergarten', 'Alu-Konstruktion am Haus: beheizbarer Wintergarten oder Sommergarten.', """
    produit: 'Wintergarten / Sommergarten',
    libelles: { ...b.libelles, titre: 'Wintergarten oder Sommergarten', bardage: 'Ausführung', parois: 'Verglasung und Front', paroisAide: 'Die Front ist meist in vier Teile geteilt: links und rechts Festverglasung, in der Mitte zwei PSK-Türen (Parallel-Schiebe-Kipp).' },
    bardages: {
      kalt: { label: 'Sommergarten (kalt): VSG-Dach, ESG-Seiten', vitrage: true, facteur: 1 },
      warm: { label: 'Wintergarten (warm): Doppel- oder Dreifachverglasung, Profile mit Isolationseinsatz', vitrage: true, facteur: 1.35 },
    },
    defauts: { ...b.defauts, bardage: 'warm' },""")], 'veranda'),

    'simelhome': ('de', 'marque/logo.avif', 'Wintergärten & Pergolen · Zug', 'Wintergarten oder Pergola nach Mass: Masse, Verglasung und Optionen wählen.', [
        ('veranda', 'Wintergarten', 'Lichtdurchfluteter Wintergarten nach Mass, an Ihr Haus angebaut.', ''),
        ('pergola-bio', 'Pergola', 'Alu-Pergola mit Lamellendach, Glas, Seitenwänden und LED.', """
    produit: 'Alu-Pergola',
    libelles: { ...b.libelles, titre: 'Pergola nach Mass' },
    bardages: { ...b.bardages, vitrage: { ...b.bardages.vitrage, label: 'Glas-Seitenwände' } },""")], 'veranda'),

    'damak': ('de', 'marque/logo.png', 'Wintergärten, Markisen & Pergolen · Oensingen', 'Wintergarten oder Alumil-Lamellendach: Schritt für Schritt zusammenstellen.', [
        ('veranda', 'Wintergarten', 'Verglaster Raum aus Aluminium, an die Fassade angebaut, Markise optional.', """
    libellesOptions: { ...(b.libellesOptions ?? {}), storeToit: ['Wintergarten-Markise', 'auf dem Glasdach'] },"""),
        ('pergola-bio', 'Pergola Lamellendach', 'Alumil-Lamellendach: drehbare Alu-Lamellen, beständig bei Wind und Schneelast.', """
    produit: 'Alumil Lamellendach',
    libelles: { ...b.libelles, titre: 'Alumil Pergola-Lamellendach' },
    couvertures: { lames: { ...b.couvertures.lames, label: 'Alumil Lamellendach, drehbare Lamellen' } },""")], 'veranda'),

    'muehlemann-bau': ('de', '', 'Metallbau · Bubendorf', 'Wintergarten, Carport oder Pergola nach Mass für Basel und die Nordwestschweiz.', [
        ('veranda', 'Wintergarten & Glasraum', 'Glasraum (unbeheizt) oder Wohnraumerweiterung (gedämmt) aus Glas und Metall.', """
    produit: 'Wintergarten / Glasraum',
    libelles: { ...b.libelles, titre: 'Wintergarten & Glasraum nach Mass', bardage: 'Ausführung' },
    bardages: {
      glasraum: { label: 'Glasraum, unbeheizt (saisonale Nutzung)', vitrage: true, facteur: 1 },
      wohnraum: { label: 'Wohnraumerweiterung, beheizt (gedämmte Konstruktion)', vitrage: true, facteur: 1.35 },
    },
    defauts: { ...b.defauts, bardage: 'glasraum' },"""),
        ('carport', 'Carport', 'Carport aus Metall, Aluminium oder Stahl, für ein oder zwei Autos.', METAL_DE),
        ('pergola-bio', 'Pergola Lamellendach', 'Pergola mit verstellbaren Lamellen für Licht und Schatten.', '')], 'veranda'),

    'kohlerseeland': ('de', 'marque/logo.webp', 'Holzbau, Schreinerei & Bedachungen · Jens', 'Massgezimmert aus einer Hand: Holzbau, Bedachung und Spenglerei. Der Preis passt sich jeder Wahl an.', [
        ('carport', 'Carport / Unterstand', 'Massgezimmerter Carport oder Unterstand, Geräteraum optional.', """
    produit: 'Carport / Unterstand',
    libelles: { ...b.libelles, titre: 'Carport / Unterstand nach Mass' },"""),
        ('terrasse', 'Terrassenboden', 'Holz- oder WPC-Dielen, Stufen und Geländer.', '')], 'carport'),

    'wisobau': ('de', 'marque/logo.png', 'Lamellendächer & Sonnenschutz · Aargau', 'Ihr Lamaxa-Lamellendach: freistehend oder am Haus, mit ZIP-Screens, Glas-Schiebeelementen, LED und Heizstrahlern.', [
        ('pergola-bio', 'Lamaxa Lamellendach', 'Drehbare Aluminiumlamellen, freistehend oder wandmontiert (Lamaxa L50, L60, L70).', """
    produit: 'Lamaxa Lamellendach',
    libelles: { ...b.libelles, titre: 'Lamaxa Lamellendach nach Mass' },
    couvertures: { lames: { ...b.couvertures.lames, label: 'Lamaxa: drehbare Alu-Lamellen (L50, L60 oder L70)' } },
    bardages: { screen: { ...b.bardages.screen, label: 'ZIP-Screen' }, vitrage: { ...b.bardages.vitrage, label: 'Glas-Schiebeelemente' } },
    libellesOptions: { chauffage: ['Heizstrahler', ''] },""")], 'pergola-bio'),

    'janitsch': ('de', 'marque/logo.svg', 'Holzbau · Ersigen', 'Carport oder Unterstand aus Holz: Masse, Dach und Holz wählen. Der Preis passt sich jeder Wahl an.', [
        ('carport', 'Carport / Unterstand', 'Holzkonstruktion für ein oder zwei Autos, Geräteraum optional.', """
    produit: 'Carport / Unterstand',
    libelles: { ...b.libelles, titre: 'Carport / Unterstand aus Holz' },""")], 'carport'),

    'holzbau-kunz': ('de', 'marque/logo.gif', 'Holzbau · Wetzikon, Zürcher Oberland', 'Ihr Carport vom Holzbauer im Zürcher Oberland: Masse, Dach und Holz wählen.', [
        ('carport', 'Carport', 'Holz-Carport für ein oder zwei Autos, Geräteraum optional.', '')], 'carport'),

    'hausholz': ('de', 'marque/logo.png', 'Dach & Holzbau · Solaranlagen', 'Holz-Carport mit Ziegel-, Blech- oder Solardach: alles aus einer Hand.', [
        ('carport', 'Carport', 'Holz-Carport, auch mit Solardach (Photovoltaik).', """
    couvertures: { ...b.couvertures, solaire: { label: 'Solarmodule (Photovoltaik)', epaisseur: 0.04, teintes: { noir: { label: 'Schwarz', couleur: '#1E2228' } } } },
    toits: { ...b.toits, plat: { ...b.toits.plat, couvertures: ['epdm', 'tole', 'solaire'] }, unPan: { ...b.toits.unPan, couvertures: ['tole', 'polycarbonate', 'solaire'] } },
    tarifs: { ...b.tarifs, couvertureM2: { ...b.tarifs.couvertureM2, solaire: 290 } },
    defauts: { ...b.defauts, toit: 'unPan', couverture: 'solaire', teinteCouverture: 'noir' },""")], 'carport'),

    'kayser-holzbau': ('de', 'marque/logo.svg', 'Holzbau · Terrassenböden', 'Ihr Terrassenboden: wählen Sie die Holzart, die Masse und die Stufen.', [
        ('terrasse', 'Terrassenboden', 'Holzarten von Thermo-Esche bis Kebony, oder Fano Ultrashield.', """
    produit: 'Terrassenboden',
    libelles: { ...b.libelles, titre: 'Ihr Terrassenboden', couverture: 'Belag', teinte: 'Holzart' },
    couvertures: {
      bois: { ...b.couvertures.bois, label: 'Holzdielen', teintes: {
        thermoesche: { label: 'Thermo-Esche', couleur: '#5E3F2A' },
        sipo: { label: 'Sipo-Mahagoni', couleur: '#8A4A33' },
        accoya: { label: 'Accoya', couleur: '#B08A63' },
        accoyagrey: { label: 'Accoya Grey', couleur: '#8E8D88' },
        kebonyclear: { label: 'Kebony Clear', couleur: '#4F3A2B' },
        kebonychar: { label: 'Kebony Character', couleur: '#5A4231' },
        douglas: { label: 'Douglasie', couleur: '#B9875C' },
        laerche: { label: 'Lärche', couleur: '#C29A6B' },
      } },
      composite: { ...b.couvertures.composite, label: 'Fano Ultrashield' },
    },
    toits: { plat: { ...b.toits.plat, couvertures: ['bois', 'composite'] } },
    defauts: { ...b.defauts, couverture: 'bois', teinteCouverture: 'thermoesche' },""")], 'terrasse'),

    'holzbau-haenggi': ('de', 'marque/logo.svg', 'Holzbau & Terrassenböden · Zwingen', 'Gartenhaus oder Terrassenboden nach Mass: Schritt für Schritt zusammenstellen.', [
        ('studio', 'Gartenhaus', 'Gartenhaus nach Mass: Masse, Dach, Fassade, Fenster und Ausstattung.', ''),
        ('terrasse', 'Terrassenboden', 'Terrassenboden aus Holz oder Holz-Kunststoff-Verbund (WPC).', """
    produit: 'Terrassenboden',
    libelles: { ...b.libelles, titre: 'Terrassenboden nach Mass' },
    couvertures: { bois: b.couvertures.bois, composite: { ...b.couvertures.composite, label: 'Holz-Kunststoff-Verbund (WPC)' } },
    toits: { plat: { ...b.toits.plat, couvertures: ['bois', 'composite'] } },
    defauts: { ...b.defauts, couverture: 'bois', teinteCouverture: 'meleze' },""")], 'studio'),

    'bull-jardin': ('fr', '', 'Paysagiste en Gruyère · La Tour-de-Trême', 'Votre terrasse par votre artisan paysagiste en Gruyère : bois ou dalles, marches et garde-corps.', [
        ('terrasse', 'Terrasse', 'Terrasse en bois ou en dalles, marches et garde-corps.', """
    toits: { plat: { label: 'Plat', pente: 0, couvertures: ['bois', 'gres'] } },
    defauts: { ...b.defauts, couverture: 'bois', teinteCouverture: 'meleze' },""")], 'terrasse'),

    'alucreations': ('fr', 'marque/logo.png', 'Vérandas & pergolas alu · Yverdon-les-Bains', 'Véranda Glass line ou Kreativ line, ou pergola Umbris : composez votre projet étape par étape.', [
        ('veranda', 'Véranda', 'Glass line (toit en pente ou vitré) ou Kreativ line (toit plat).', """
    produit: 'Véranda',
    toits: { unPan: { ...b.toits.unPan, label: 'Glass line (toit en pente)' }, plat: { ...b.toits.plat, label: 'Kreativ line (toit plat)' } },"""),
        ('pergola-bio', 'Pergola Umbris', 'Pergola bioclimatique à lames orientables, toiture jusqu’à 7 m sans poteau intermédiaire.', """
    produit: 'Pergola Umbris',
    libelles: { ...b.libelles, titre: 'Pergola bioclimatique Umbris' },
    couvertures: { lames: { ...b.couvertures.lames, label: 'Umbris : lames orientables, moteur invisible' } },
    bardages: { screen: { ...b.bardages.screen, label: 'Stores verticaux' }, vitrage: { ...b.bardages.vitrage, label: 'Panneaux vitrés coulissants' } },""")], 'veranda'),

    'aquinox': ('fr', '', 'Stores & pergolas · Saxon', 'Votre pergola bioclimatique à lames orientables : stores, portes coulissantes et LED en option.', [
        ('pergola-bio', 'Pergola bioclimatique', 'Lames orientables pour un confort toute l’année, stores, portes coulissantes et LED.', """
    bardages: { screen: { ...b.bardages.screen, label: 'Store toile' }, vitrage: { ...b.bardages.vitrage, label: 'Portes coulissantes' } },
    libellesOptions: { led: ['Système LED intégré', ''] },""")], 'pergola-bio'),

    'abcforgeron': ('fr', '', 'Vérandas & ferronnerie · Collex', 'Votre véranda ou jardin d’hiver sur mesure, de la gamme SUNPARADISE.', [
        ('veranda', 'Véranda', 'Véranda ou jardin d’hiver, toiture vitrée ou couverture de terrasse.', """
    produit: 'Véranda SUNPARADISE',
    libelles: { ...b.libelles, titre: 'Véranda & jardin d’hiver sur mesure' },""")], 'veranda'),

    'equibat': ('fr', 'marque/logo.jpg', 'Pergolas & carports · Alle', 'Pergola bioclimatique ou carport alu : composez votre projet, le prix suit chaque choix.', [
        ('pergola-bio', 'Pergola bioclimatique', 'Lames alu orientables pour régler soleil et ventilation, stores en option.', ''),
        ('carport', 'Carport alu', 'Structure aluminium, toiture en panneaux autoportants en aluminium isolé.', """
    materiau: 'alu', produit: 'Carport alu',
    libelles: { ...b.libelles, titre: 'Carport alu sur mesure', finition: 'Teinte de la structure', finitionCourt: 'Teinte', finitionLigne: 'Structure' },
    bois: { anthracite: { label: 'Anthracite (RAL 7016)', couleur: '#3A3D40', facteur: 1 }, blanc: { label: 'Blanc (RAL 9016)', couleur: '#E8E7E2', facteur: 1 }, noir: { label: 'Noir (RAL 9005)', couleur: '#1E1F21', facteur: 1 }, ral: { label: 'Autre teinte RAL', couleur: '#7A6F62', facteur: 1.05 } },
    toits: { plat: { label: 'Plat', pente: 2, couvertures: ['tole'] } },
    couvertures: { ...b.couvertures, tole: { ...b.couvertures.tole, label: 'Panneaux autoportants en aluminium isolé' } },
    defauts: { ...b.defauts, bois: 'anthracite', toit: 'plat', couverture: 'tole', teinteCouverture: 'anthracite' },""")], 'pergola-bio'),

    'atelierz': ('fr', '', 'Construction bois · Grancy', 'Couvert à voiture ou couverture de terrasse en bois : composez votre projet étape par étape.', [
        ('carport', 'Couvert à voiture', 'Couvert en bois pour une ou deux voitures, local de rangement en option.', """
    produit: 'Couvert à voiture en bois',
    libelles: { ...b.libelles, titre: 'Couvert à voiture sur mesure' },"""),
        ('pergola', 'Couverture de terrasse', 'Structure bois contre la maison ou isolée, toile ou polycarbonate.', """
    produit: 'Couverture de terrasse',
    libelles: { ...b.libelles, titre: 'Couverture de terrasse en bois' },""")], 'carport'),
    'sonnfix': ('de', 'marque/logo.png', 'Sonnen- & Wetterschutz · STOBAG', 'Lamellendach-Pavillon oder Pergola mit Stoffbespannung: Masse, Farben und Optionen wählen.', [
        ('pergola-bio', 'Pavillon Lamellendach', 'Verstellbare Aluminiumlamellen für Licht, Schatten und Belüftung, erweiterbar mit ZIP-Screens und Schiebeelementen.', """
    produit: 'Pavillon mit Lamellendach',
    libelles: { ...b.libelles, titre: 'Pavillon mit Lamellendach' },
    couvertures: { lames: { ...b.couvertures.lames, label: 'Verstellbare Alu-Lamellen, pulverbeschichtet' } },
    bardages: { screen: { ...b.bardages.screen, label: 'ZIP-Screen' }, vitrage: { ...b.bardages.vitrage, label: 'Schiebeelemente' } },
    libellesOptions: { chauffage: ['Heizung', ''] },"""),
        ('pergola', 'Pergola mit Stoffbespannung', 'Textiler Sonnenschutz mit Alu-Gestell, mit ZIP-Screens oder LED kombinierbar.', """
    materiau: 'alu', produit: 'Pergola mit Stoffbespannung',
    libelles: { ...b.libelles, titre: 'Pergola mit Stoffbespannung', finition: 'Gestellfarbe', finitionCourt: 'Gestell', finitionLigne: 'Gestell', parois: 'ZIP-Screens', paroisCourt: 'Screens', bardage: 'Seitenbeschattung' },
    bois: { anthrazit: { label: 'Anthrazit', couleur: '#3A3D40', facteur: 1 }, weiss: { label: 'Weiss', couleur: '#E8E7E2', facteur: 1 }, silber: { label: 'Silber', couleur: '#B5B8BA', facteur: 1 } },
    toits: Object.fromEntries(Object.entries(b.toits).map(([id, t]) => [id, { ...t, couvertures: ['toile'] }])),
    couvertures: { toile: { ...b.couvertures.toile, label: 'Stoffbespannung' } },
    bardages: { zip: { label: 'ZIP-Screen', store: true, couleur: '#4B4C4E', facteur: 1 } },
    defauts: { ...b.defauts, bois: 'anthrazit', bardage: 'zip', couverture: 'toile', teinteCouverture: Object.keys(b.couvertures.toile.teintes)[0] },""")], 'pergola-bio'),
}

# Fichiers produit manquants ou restés en français dans les démos allemandes : copiés depuis la base allemande
SOURCE_PRODUITS = {'de': RACINE / 'carport-demo-de' / 'produits', 'fr': RACINE / 'carport-demo' / 'produits'}


def langue_fichier(f):
    txt = f.read_text(encoding='utf-8')
    return 'de' if any(m in txt for m in ('nach Mass', "'Freistehend'", "'Flachdach'", 'Lamellendach', 'Gartenstudio')) else 'fr'


for pid, (lang, logo, activite, chapo, produits, defaut) in SPECS.items():
    dst = CLIENTS / pid
    ancienne = (dst / 'config.js').read_text(encoding='utf-8')
    if pid == 'atelierz' and not (dst / 'produits').exists():
        # Ancienne démo (1re version) : remplacée par la base actuelle, en gardant le mail et la config Worker
        garder = {n: (dst / n).read_bytes() for n in ('MESSAGE.md', 'wrangler.jsonc') if (dst / n).exists()}
        shutil.rmtree(dst)
        shutil.copytree(RACINE / 'carport-demo', dst, ignore=shutil.ignore_patterns('.wrangler', 'config.js', 'wrangler.jsonc', 'MESSAGE.md', '*.pdf', '*.md'))
        for n, data in garder.items():
            (dst / n).write_bytes(data)
    for prod, *_ in produits:
        f = dst / 'produits' / f'{prod}.js'
        if not f.exists() or langue_fichier(f) != lang:
            shutil.copy(SOURCE_PRODUITS[lang] / f'{prod}.js', f)
    imports = '\n'.join(f"import {{ CONFIG as {p.replace('-', '_')} }} from './produits/{p}.js';" for p, *_ in produits)
    entrees = []
    for prod, label, aide, surcharges in produits:
        var = prod.replace('-', '_')
        corps = f"((b) => ({{ ...b, entreprise: ENTREPRISE,{surcharges}\n  }}))({var})"
        entrees.append(f"  '{prod}': {{ label: {label!r}, aide: {aide!r}, icone: '{ICONES[prod]}', config: {corps} }},")
    logo_js = repr(logo)
    nom = ancienne.split("nom: ", 1)[1].split(',', 1)[0].strip()
    initiales = ancienne.split("initiales: ", 1)[1].split(',', 1)[0].strip()
    (dst / 'config.js').write_text(f"""// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
{imports}

const ENTREPRISE = {{
  nom: {nom},
  activite: {activite!r},
  initiales: {initiales},
  logo: {logo_js},
  email: '', // e-mail qui reçoit les demandes (vide = démo)
}};

export const PRODUITS = {{
{chr(10).join(entrees)}
}};
for (const p of Object.values(PRODUITS)) p.config.chapo = {chapo!r};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : '{defaut}';
export const CONFIG = {{ ...PRODUITS[PRODUIT].config, assistant: true, couleurs: {{ plan: '#3D3A35', 'plan-clair': '#EFEBE3' }} }};
""", encoding='utf-8')
    print('ok', pid, [p for p, *_ in produits])
