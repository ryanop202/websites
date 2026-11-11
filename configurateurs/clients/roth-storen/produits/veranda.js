// Démo publique « véranda alu » (3e produit de demo.wibzo.ch), 03.11.2026.
// Même moteur : structure alu, toujours contre la maison, côtés libres et façade avant vitrés (veranda: true).
// ⚠️ Tous les PRIX sont FICTIFS.

export const CONFIG = {
  entreprise: {
    nom: 'Ihre Firma',
    activite: 'Wintergärten & Alu-Bau',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Alu-Wintergarten',
  demo: true,
  // Notifications par e-mail à Ryan (démo publique de wibzo.ch)
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  chapo: 'Stellen Sie Ihren Wintergarten Schritt für Schritt zusammen. Der Preis passt sich jeder Wahl an.',
  materiau: 'alu',
  veranda: true,
  // Modèle 3D dédié (produits3d.js, 03.11.2026) : toit vitré sur chevrons, chéneau, baies coulissantes, pignons vitrés
  modele3d: 'veranda',
  libelles: {
    titre: 'Alu-Wintergarten nach Mass',
    objet: 'Wintergarten',
    passage: 'Höhe',
    inverserCotes: true,
    largeur: 'Tiefe',
    largeurAide: 'ab der Fassade',
    profondeur: 'Breite',
    profondeurAide: 'entlang der Fassade',
    hauteur: 'Höhe',
    hauteurAide: 'unter der Rinne, gartenseitig',
    implantationAide: 'Der Wintergarten wird an der Hausfassade befestigt: Wählen Sie die Seite.',
    parois: 'Verglasung und Schiebeelemente',
    paroisCourt: 'Verglasung',
    paroisAide: 'Verglaste Seitenwände, Schiebeelemente zum Garten.',
    bardage: 'Glasart',
    finition: 'Farbe des Aluminiums',
    finitionCourt: 'Farbe',
    finitionLigne: 'Konstruktion',
    ledAide: 'in die Sparren eingelassene Spots',
  },
  local: false,
  equipements: ['gouttieres', 'led', 'storeToit'],
  sol: 'terrasse',

  // [min, max, pas] en mètres
  limites: {
    largeur: [2.5, 5, 0.1],    // avancée depuis la façade
    profondeur: [3, 7, 0.1],   // le long de la façade
    hauteur: [2.3, 2.8, 0.05],
    vantaux: [0, 4, 1],        // baies ouvertes sur l'image (le maximum suit la taille)
  },
  porteeMax: 3.5, // distance max entre deux poteaux (règle technique, à valider par l'entreprise)
  profondeursLocal: [1.2, 1.8, 2.4],

  // Toujours contre la maison
  implantations: {
    gauche: { label: 'Am Haus', aide: 'Fassade links' },
    droite: { label: 'Am Haus', aide: 'Fassade rechts' },
  },
  positionsLocal: {
    arriere: { label: 'Hinten' },
    gauche: { label: 'Links' },
    droite: { label: 'Rechts' },
  },

  // (raccourcis : largeur le long de la façade × avancée)
  raccourcis: [
    { label: '3.5 × 3 m', profondeur: 3.5, largeur: 3, hauteur: 2.5 },
    { label: '4.5 × 3.5 m', profondeur: 4.5, largeur: 3.5, hauteur: 2.5 },
    { label: '6 × 4 m', profondeur: 6, largeur: 4, hauteur: 2.6 },
  ],

  defauts: {
    largeur: 3.5,
    profondeur: 4.5,
    hauteur: 2.5,
    adosse: 'gauche',
    toit: 'unPan',
    couverture: 'verre',
    teinteCouverture: 'clair',
    bois: 'anthracite',
    paroiArriere: true,
    paroiGauche: true,
    paroiDroite: true,
    bardage: 'clair',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: true,
    led: false,
    borne: false,
    storeToit: false,
    vantaux: 0,
    vehicule: 'aucun',
  },

  toits: {
    unPan: { label: 'Geneigt', pente: 8, couvertures: ['verre', 'polycarbonate', 'panneau'] },
    plat: { label: 'Flach', pente: 2, couvertures: ['panneau', 'verre'] },
  },

  couvertures: {
    verre: {
      label: 'Verbundglas', epaisseur: 0.02,
      teintes: { clair: { label: 'Klar', couleur: '#D6E8EE' } },
    },
    polycarbonate: {
      label: 'Polycarbonat', epaisseur: 0.02,
      teintes: {
        clair: { label: 'Transparent', couleur: '#D6E8EE' },
        opale: { label: 'Opal (milchig)', couleur: '#F1F0EB' },
      },
    },
    panneau: {
      label: 'Isolierpaneel', epaisseur: 0.06,
      teintes: {
        anthracite: { label: 'Anthrazit', couleur: '#3B3E41' },
        blanc: { label: 'Weiss', couleur: '#E9E8E4' },
      },
    },
  },

  // Coloris de l'aluminium (clé « bois » du moteur)
  bois: {
    anthracite: { label: 'Anthrazitgrau', couleur: '#3A3D40', facteur: 1 },
    blanc: { label: 'Weiss', couleur: '#E8E7E2', facteur: 1 },
    noir: { label: 'Schwarz matt', couleur: '#1E1F21', facteur: 1.03 },
  },

  bardages: {
    clair: { label: 'Klarglas', vitrage: true, facteur: 1 },
    teinte: { label: 'Getöntes Glas', vitrage: true, verre: '#7E8C92', facteur: 1.08 },
  },

  vehicules: {
    aucun: { label: 'Keines' },
  },

  // Montants HT en CHF — FICTIFS
  tarifs: {
    structureM2: { plat: 420, unPan: 440 },
    couvertureM2: { verre: 180, polycarbonate: 95, panneau: 120 },
    paroiM2: 380, // parois vitrées
    porteCoulissante: 1800,
    rangementM2: 0,
    adosseFacteur: 1,
    fixationMl: 80, // fixation à la façade et solin
    gouttiereMl: 45,
    descente: 180,
    led: 650,
    borne: 0,
    storeToitM2: 115,
    poseTaux: 0.18,
    poseMin: 2500,
  },
  tva: 0.081,
  fourchette: 0.08, // ± autour du prix calculé
};
