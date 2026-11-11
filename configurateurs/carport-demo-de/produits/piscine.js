// Démo publique « piscine » (6e produit de demo.wibzo.ch), 05.11.2026.
// Modèle 3D dédié (produits3d.js, `piscine`) : bassin creusé dans la pelouse, eau teintée par le revêtement,
// escalier (droit, d'angle, avec banquette), margelles, plage par côté, volet immergé, spots LED, pompe à chaleur, contre-courant.
// Pour les pisciniers et paysagistes qui construisent des piscines (voir PROSPECTS-CONFIGURATEUR.md).
// On reprend les FONCTIONS des configurateurs du marché (étapes, options), jamais leur code, leurs modèles ou leur design.
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les teintes (exemples).
//
// Clés du moteur réutilisées : largeur = largeur du bassin (x), profondeur = longueur (z), hauteur = profondeur d'eau,
// toits = escalier, couvertures = revêtement du bassin (+ teintes), bois = margelles, parois* = plage de chaque côté,
// bardages = matériau de la plage, gouttieres = volet immergé, chauffage = pompe à chaleur, borne = nage à contre-courant.

export const CONFIG = {
  entreprise: {
    nom: 'Ihre Firma',
    activite: 'Pool- & Gartenbau',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Pool',
  type: 'piscine',
  modele3d: 'piscine',
  demo: true,
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  chapo: 'Gestalten Sie Ihren Pool Schritt für Schritt. Der Preis passt sich jeder Wahl an.',
  libelles: {
    titre: 'Pool nach Mass',
    objet: 'Pool',
    passage: 'Tiefe',
    largeur: 'Breite',
    largeurAide: 'des Beckens',
    profondeur: 'Länge',
    profondeurAide: 'des Beckens',
    hauteur: 'Wassertiefe',
    hauteurAide: 'flacher Boden',
    toiture: 'Becken',
    toitureCourt: 'Becken',
    forme: 'Treppe',
    couverture: 'Auskleidung',
    teinte: 'Farbe',
    finition: 'Beckenrand',
    finitionCourt: 'Beckenrand',
    finitionLigne: 'Beckenrand',
    parois: 'Poolumrandung',
    paroisCourt: 'Umrandung',
    paroisAide: 'Tippen Sie auf eine Seite, um eine 1.20 m breite Umrandung hinzuzufügen.',
    bardage: 'Material der Umrandung',
    paroiLigne: 'Umrandung',
    ledAide: 'in die Beckenwand eingelassene Spots, weisses Licht',
  },
  // Libellés des options de l'étape « Équipements » (clé du moteur → [titre, précision])
  libellesOptions: {
    gouttieres: ['Unterwasser-Rollabdeckung', 'motorisierte Sicherheitsabdeckung'],
    chauffage: ['Wärmepumpe', 'Wasser mit 28 °C von April bis Oktober'],
    borne: ['Gegenstromanlage', 'Düse 60 m³/h und Haltegriff aus Edelstahl'],
  },
  local: false,
  equipements: ['gouttieres', 'led', 'chauffage', 'borne'],
  sol: 'terrasse',
  paroiAvant: true, // les 4 côtés peuvent recevoir une plage
  margelle: 0.3,       // largeur des margelles (m)
  largeurPlage: 1.2,   // largeur de la plage de chaque côté (m)

  // [min, max, pas] en mètres
  limites: {
    largeur: [2.5, 5, 0.1],     // largeur du bassin
    profondeur: [4, 12, 0.1],   // longueur du bassin
    hauteur: [1.2, 1.8, 0.05],  // profondeur d'eau
  },
  porteeMax: 3.0,
  profondeursLocal: [1.2, 1.8, 2.4],

  implantations: {
    non: { label: 'Im Garten', aide: 'vor dem Haus' },
  },
  positionsLocal: {
    arriere: { label: 'Hinten' },
  },

  raccourcis: [
    { label: '7 × 3.5 m', largeur: 3.5, profondeur: 7, hauteur: 1.4 },
    { label: '8 × 4 m', largeur: 4, profondeur: 8, hauteur: 1.5 },
    { label: '10 × 5 m', largeur: 5, profondeur: 10, hauteur: 1.5 },
  ],

  defauts: {
    largeur: 4,
    profondeur: 8,
    hauteur: 1.5,
    adosse: 'non',
    toit: 'droit',
    couverture: 'liner',
    teinteCouverture: 'sable',
    bois: 'blanc',
    paroiArriere: true,
    paroiAvant: true,
    paroiGauche: true,
    paroiDroite: true,
    bardage: 'bois',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: false,
    led: false,
    borne: false,
    chauffage: false,
    storeToit: false,
    vehicule: 'aucun',
  },

  // Escalier (la clé « toits » est celle lue par le moteur pour ce choix)
  toits: {
    droit: { label: 'Gerade', pente: 0, couvertures: ['liner', 'membrane', 'mosaique'] },
    angle: { label: 'Eck-Treppe', pente: 0, couvertures: ['liner', 'membrane', 'mosaique'] },
    banquette: { label: 'Mit Sitzbank', pente: 0, couvertures: ['liner', 'membrane', 'mosaique'] },
  },

  // Revêtement du bassin ; « eau » = teinte de l'eau vue d'en haut avec ce revêtement
  couvertures: {
    liner: {
      label: 'Liner 0.75 mm', mosaique: false,
      teintes: {
        blanc: { label: 'Weiss', couleur: '#EEF1F0', eau: '#45BFDB' },
        sable: { label: 'Sand', couleur: '#E4D6B8', eau: '#3FB5AA' },
        bleu: { label: 'Hellblau', couleur: '#9CC7E2', eau: '#2F96CF' },
        gris: { label: 'Anthrazitgrau', couleur: '#5B6166', eau: '#2E7A86' },
      },
    },
    membrane: {
      label: 'Armierte Folie 1.5 mm', mosaique: false,
      teintes: {
        blanc: { label: 'Weiss', couleur: '#EEF1F0', eau: '#45BFDB' },
        sable: { label: 'Sand', couleur: '#E4D6B8', eau: '#3FB5AA' },
        vert: { label: 'Karibikgrün', couleur: '#8FCFC0', eau: '#2FA394' },
        gris: { label: 'Anthrazitgrau', couleur: '#5B6166', eau: '#2E7A86' },
        noir: { label: 'Schwarz', couleur: '#2C2F33', eau: '#23515A' },
      },
    },
    mosaique: {
      label: 'Glasmosaik', mosaique: true,
      teintes: {
        blanc: { label: 'Perlweiss', couleur: '#E9EEF0', eau: '#45BFDB' },
        bleu: { label: 'Lagunenblau', couleur: '#6FB4D8', eau: '#2A8FC8' },
        vert: { label: 'Smaragdgrün', couleur: '#5FAE9E', eau: '#2E9E8E' },
        noir: { label: 'Schwarz', couleur: '#2C2F33', eau: '#23515A' },
      },
    },
  },

  // Margelles en pierre reconstituée (la clé « bois » est celle lue par le moteur pour cette étape)
  bois: {
    blanc: { label: 'Kunststein weiss', couleur: '#ECE7DC', facteur: 1 },
    beige: { label: 'Kunststein beige', couleur: '#D9C8A8', facteur: 1 },
    gris: { label: 'Hellgrau', couleur: '#B9B8B2', facteur: 1.05 },
    anthracite: { label: 'Anthrazit', couleur: '#55585C', facteur: 1.1 },
  },

  // Matériau de la plage
  bardages: {
    bois: { label: 'Tropenholz', couleur: '#8E6642', lames: true, facteur: 1.15 },
    composite: { label: 'WPC', couleur: '#6E5240', lames: true, rainures: true, facteur: 1 },
    dalles: { label: 'Feinsteinplatten', couleur: '#D8D2C6', dalles: true, facteur: 0.9 },
  },

  vehicules: {
    aucun: { label: 'Keines' },
  },

  // Montants HT en CHF — FICTIFS
  tarifs: {
    terrassementM3: 85,                 // excavation et évacuation (volume du bassin + 35 cm)
    structureM2: 420,                   // bassin maçonné (fond + parois)
    revetementM2: { liner: 70, membrane: 115, mosaique: 260, beton: 115, coque: 150, inox: 520, mineral: 150 }, // (béton, coque, inox, minéral : démos clients)
    escalier: { droit: 2400, angle: 2900, banquette: 3900 },
    margelleMl: 160,
    plageM2: 230,                       // × facteur du matériau
    filtration: 7500,                   // filtration, local technique, skimmers, refoulements
    voletBase: 9500,
    voletM2: 240,
    spot: 650,                          // par spot LED
    pac: 4900,
    nage: 3600,
    miseEnService: 1500,
  },
  tva: 0.081,
  fourchette: 0.1, // ± autour du prix calculé
};
