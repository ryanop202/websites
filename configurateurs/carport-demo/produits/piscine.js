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
    nom: 'Votre entreprise',
    activite: 'Piscines & aménagements extérieurs',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Piscine',
  type: 'piscine',
  modele3d: 'piscine',
  demo: true,
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  chapo: 'Dessinez votre piscine étape par étape. Le prix se met à jour à chaque choix.',
  libelles: {
    titre: 'Piscine sur mesure',
    objet: 'piscine',
    passage: 'profondeur',
    largeur: 'Largeur',
    largeurAide: 'du bassin',
    profondeur: 'Longueur',
    profondeurAide: 'du bassin',
    hauteur: "Profondeur d'eau",
    hauteurAide: 'fond plat',
    toiture: 'Bassin',
    toitureCourt: 'Bassin',
    forme: 'Escalier',
    couverture: 'Revêtement',
    teinte: 'Couleur',
    finition: 'Margelles',
    finitionCourt: 'Margelles',
    finitionLigne: 'Margelles',
    parois: 'Plage',
    paroisCourt: 'Plage',
    paroisAide: 'Touchez un côté pour ajouter une plage de 1,20 m autour du bassin.',
    bardage: 'Matériau de la plage',
    paroiLigne: 'Plage',
    ledAide: 'spots encastrés dans la paroi, lumière blanche',
  },
  // Libellés des options de l'étape « Équipements » (clé du moteur → [titre, précision])
  libellesOptions: {
    gouttieres: ['Volet roulant immergé', 'couverture de sécurité motorisée'],
    chauffage: ['Pompe à chaleur', "eau à 28 °C d'avril à octobre"],
    borne: ['Nage à contre-courant', 'buse 60 m³/h et main courante inox'],
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
    non: { label: 'Dans le jardin', aide: 'devant la maison' },
  },
  positionsLocal: {
    arriere: { label: 'Arrière' },
  },

  raccourcis: [
    { label: '7 × 3,5 m', largeur: 3.5, profondeur: 7, hauteur: 1.4 },
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
    droit: { label: 'Droit', pente: 0, couvertures: ['liner', 'membrane', 'mosaique'] },
    angle: { label: "D'angle", pente: 0, couvertures: ['liner', 'membrane', 'mosaique'] },
    banquette: { label: 'Avec banquette', pente: 0, couvertures: ['liner', 'membrane', 'mosaique'] },
  },

  // Revêtement du bassin ; « eau » = teinte de l'eau vue d'en haut avec ce revêtement
  couvertures: {
    liner: {
      label: 'Liner 75/100e', mosaique: false,
      teintes: {
        blanc: { label: 'Blanc', couleur: '#EEF1F0', eau: '#45BFDB' },
        sable: { label: 'Sable', couleur: '#E4D6B8', eau: '#3FB5AA' },
        bleu: { label: 'Bleu pâle', couleur: '#9CC7E2', eau: '#2F96CF' },
        gris: { label: 'Gris anthracite', couleur: '#5B6166', eau: '#2E7A86' },
      },
    },
    membrane: {
      label: 'Membrane armée 150/100e', mosaique: false,
      teintes: {
        blanc: { label: 'Blanc', couleur: '#EEF1F0', eau: '#45BFDB' },
        sable: { label: 'Sable', couleur: '#E4D6B8', eau: '#3FB5AA' },
        vert: { label: 'Vert caraïbe', couleur: '#8FCFC0', eau: '#2FA394' },
        gris: { label: 'Gris anthracite', couleur: '#5B6166', eau: '#2E7A86' },
        noir: { label: 'Noir', couleur: '#2C2F33', eau: '#23515A' },
      },
    },
    mosaique: {
      label: 'Mosaïque de verre', mosaique: true,
      teintes: {
        blanc: { label: 'Blanc nacré', couleur: '#E9EEF0', eau: '#45BFDB' },
        bleu: { label: 'Bleu lagon', couleur: '#6FB4D8', eau: '#2A8FC8' },
        vert: { label: 'Vert émeraude', couleur: '#5FAE9E', eau: '#2E9E8E' },
        noir: { label: 'Noir', couleur: '#2C2F33', eau: '#23515A' },
      },
    },
  },

  // Margelles en pierre reconstituée (la clé « bois » est celle lue par le moteur pour cette étape)
  bois: {
    blanc: { label: 'Pierre blanche', couleur: '#ECE7DC', facteur: 1 },
    beige: { label: 'Pierre beige', couleur: '#D9C8A8', facteur: 1 },
    gris: { label: 'Gris clair', couleur: '#B9B8B2', facteur: 1.05 },
    anthracite: { label: 'Anthracite', couleur: '#55585C', facteur: 1.1 },
  },

  // Matériau de la plage
  bardages: {
    bois: { label: 'Bois exotique', couleur: '#8E6642', lames: true, facteur: 1.15 },
    composite: { label: 'Composite', couleur: '#6E5240', lames: true, rainures: true, facteur: 1 },
    dalles: { label: 'Dalles grès', couleur: '#D8D2C6', dalles: true, facteur: 0.9 },
  },

  vehicules: {
    aucun: { label: 'Aucun' },
  },

  // Montants HT en CHF — FICTIFS
  tarifs: {
    terrassementM3: 85,                 // excavation et évacuation (volume du bassin + 35 cm)
    structureM2: 420,                   // bassin maçonné (fond + parois)
    revetementM2: { liner: 70, membrane: 115, mosaique: 260 },
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
