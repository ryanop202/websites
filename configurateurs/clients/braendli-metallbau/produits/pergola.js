// Démo publique « pergola en bois » (2e exemple de wibzo.ch), 29.10.2026.
// Même moteur que les carports : toit ouvert (chevrons seuls), sol en terrasse bois, pas de véhicule ni de local.
// ⚠️ Tous les PRIX sont FICTIFS.

export const CONFIG = {
  entreprise: {
    nom: 'Ihre Firma',
    activite: 'Holzbau & Gartenbau',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Holz-Pergola',
  demo: true,
  // Notifications par e-mail à Ryan (démo publique de wibzo.ch)
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  chapo: 'Stellen Sie Ihre Pergola Schritt für Schritt zusammen. Der Preis passt sich jeder Wahl an.',
  libelles: {
    titre: 'Holz-Pergola nach Mass',
    objet: 'Pergola',
    passage: 'Höhe',
    inverserCotes: true,
    largeur: 'Tiefe',
    largeurAide: 'ab der Fassade',
    profondeur: 'Breite',
    profondeurAide: 'entlang der Fassade',
    hauteur: 'Höhe',
    hauteurAide: 'unter den Balken',
    implantationAide: 'Am Haus wird die Pergola an der Fassade befestigt: eine Pfostenreihe weniger.',
    parois: 'Sichtschutz',
    bardage: 'Art des Sichtschutzes',
  },
  local: false, // pas de local de rangement
  equipements: ['led'],
  sol: 'terrasse', // terrasse en lames de bois au lieu des pavés
  entraxeChevrons: 0.5,

  // [min, max, pas] en mètres
  limites: {
    largeur: [2.5, 5, 0.1],    // avancée depuis la façade
    profondeur: [2.5, 6, 0.1], // le long de la façade
    hauteur: [2.2, 2.6, 0.05],
  },
  porteeMax: 3.0, // distance max entre deux poteaux (règle technique, à valider par l'entreprise)
  profondeursLocal: [1.2, 1.8, 2.4],

  implantations: {
    non: { label: 'Freistehend', aide: '4 Seiten frei' },
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
    { label: '3 × 3 m', profondeur: 3, largeur: 3, hauteur: 2.3 },
    { label: '4 × 3.5 m', profondeur: 4, largeur: 3.5, hauteur: 2.3 },
    { label: '5 × 4 m', profondeur: 5, largeur: 4, hauteur: 2.4 },
  ],

  defauts: {
    largeur: 3.5,
    profondeur: 4.5,
    hauteur: 2.3,
    adosse: 'gauche',
    toit: 'plat',
    couverture: 'ouverte',
    teinteCouverture: 'bois',
    bois: 'epicea',
    paroiArriere: false,
    paroiGauche: false,
    paroiDroite: false,
    bardage: 'horizontal',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: false,
    led: true,
    borne: false,
    vehicule: 'aucun',
  },

  toits: {
    plat: { label: 'Flach', pente: 2, couvertures: ['ouverte', 'toile', 'polycarbonate'] },
    unPan: { label: 'Geneigt', pente: 6, couvertures: ['ouverte', 'toile', 'polycarbonate'] },
  },

  couvertures: {
    ouverte: {
      label: 'Offen (nur Sparren)', epaisseur: 0, ouverte: true,
      teintes: { bois: { label: 'Holz', couleur: '#D2AA72' } },
    },
    toile: {
      label: 'Sonnensegel', epaisseur: 0.01,
      teintes: {
        ecru: { label: 'Naturweiss', couleur: '#E6DDCB' },
        gris: { label: 'Hellgrau', couleur: '#A8A6A0' },
        anthracite: { label: 'Anthrazit', couleur: '#4A4B4D' },
      },
    },
    polycarbonate: {
      label: 'Polycarbonat', epaisseur: 0.02,
      teintes: {
        clair: { label: 'Transparent', couleur: '#D6E8EE' },
        opale: { label: 'Opal (milchig)', couleur: '#F1F0EB' },
      },
    },
  },

  bois: {
    epicea: { label: 'Fichte natur', couleur: '#D2AA72', facteur: 1 },
    meleze: { label: 'Lärche', couleur: '#B5784A', facteur: 1.15 },
    gris: { label: 'Lasur hellgrau', couleur: '#A6A299', facteur: 1.06 },
    anthracite: { label: 'Lasur anthrazit', couleur: '#3E3D3B', facteur: 1.06 },
  },

  bardages: {
    horizontal: { label: 'Waagrechte Latten', sens: 'horizontal', facteur: 1 },
    vertical: { label: 'Senkrechte Latten', facteur: 1 },
  },

  // Pas de véhicule pour une pergola
  vehicules: {
    aucun: { label: 'Keines' },
  },

  // Montants HT en CHF — FICTIFS
  tarifs: {
    structureM2: { plat: 190, unPan: 205 },
    couvertureM2: { ouverte: 0, toile: 45, polycarbonate: 72 },
    paroiM2: 95,
    rangementM2: 0,
    adosseFacteur: 0.88, // structure contre une façade : une rangée de poteaux en moins
    fixationMl: 55, // muralière fixée à la façade
    gouttiereMl: 0,
    descente: 0,
    led: 480,
    borne: 0,
    poseTaux: 0.16,
    poseMin: 900,
  },
  tva: 0.081,
  fourchette: 0.08, // ± autour du prix calculé
};
