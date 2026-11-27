// Démo publique « pergola bioclimatique » (4e produit de demo.wibzo.ch), 03.11.2026.
// Modèle 3D dédié (produits3d.js) : cadre alu, lames orientables, stores screen ou vitrages par côté, LED, chauffage.
// Pour les vendeurs de stores / pergolas alu (voir PROSPECTS-CONFIGURATEUR.md, section vérandas / pergolas).
// ⚠️ Tous les PRIX sont FICTIFS.

export const CONFIG = {
  entreprise: {
    nom: 'Ihre Firma',
    activite: 'Pergolen & Sonnenschutz',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Lamellendach-Pergola',
  demo: true,
  // Notifications par e-mail à Ryan (démo publique de wibzo.ch)
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  chapo: 'Stellen Sie Ihre Pergola Schritt für Schritt zusammen. Der Preis passt sich jeder Wahl an.',
  materiau: 'alu',
  modele3d: 'pergolaBio',
  paroiAvant: true, // les 4 côtés peuvent être fermés
  libelles: {
    titre: 'Lamellendach-Pergola nach Mass',
    objet: 'Pergola',
    passage: 'Höhe',
    inverserCotes: true,
    largeur: 'Tiefe',
    largeurAide: 'ab der Fassade',
    profondeur: 'Breite',
    profondeurAide: 'entlang der Fassade',
    hauteur: 'Höhe',
    hauteurAide: 'unter den Trägern',
    implantationAide: 'Freistehend (4 Pfosten) oder an der Fassade befestigt: zwei Pfosten weniger.',
    toiture: 'Drehbare Lamellen',
    toitureCourt: 'Lamellen',
    finition: 'Farbe der Konstruktion',
    finitionCourt: 'Farbe',
    finitionLigne: 'Konstruktion',
    parois: 'Seitenabschlüsse',
    paroisCourt: 'Seiten',
    paroisAide: 'Tippen Sie auf eine Seite, um sie zu schliessen: Screen-Store oder Schiebeverglasung.',
    bardage: 'Art des Abschlusses',
    paroiLigne: 'Abschluss',
    ledAide: 'LED-Band in den Trägern, sichtbar in der Nachtansicht',
  },
  local: false,
  equipements: ['led', 'chauffage'],
  sol: 'terrasse',

  // [min, max, pas] en mètres (angle des lames en degrés)
  limites: {
    largeur: [2.5, 5, 0.1],     // avancée depuis la façade
    profondeur: [2.5, 7, 0.1],  // le long de la façade
    hauteur: [2.3, 2.8, 0.05],
    angleLames: [0, 90, 5],
  },
  porteeMax: 4.5,   // distance max entre deux poteaux (à valider par l'entreprise)
  porteeLames: 4.2, // longueur max d'une lame : au-delà, une poutre intermédiaire
  profondeursLocal: [1.2, 1.8, 2.4],

  implantations: {
    non: { label: 'Freistehend', aide: '4 Pfosten' },
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
    { label: '4 × 3 m', profondeur: 4, largeur: 3, hauteur: 2.5 },
    { label: '5 × 3.5 m', profondeur: 5, largeur: 3.5, hauteur: 2.5 },
    { label: '6 × 4 m', profondeur: 6, largeur: 4, hauteur: 2.6 },
  ],

  defauts: {
    largeur: 3.5,
    profondeur: 4.5,
    hauteur: 2.5,
    adosse: 'gauche',
    toit: 'plat',
    couverture: 'lames',
    teinteCouverture: 'alu',
    bois: 'anthracite',
    paroiArriere: false,
    paroiAvant: false,
    paroiGauche: false,
    paroiDroite: false,
    bardage: 'screen',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: false,
    led: false,
    borne: false,
    chauffage: false,
    angleLames: 45,
    vehicule: 'aucun',
  },

  toits: {
    plat: { label: 'Flach', pente: 0, couvertures: ['lames'] },
  },

  couvertures: {
    lames: {
      label: 'Drehbare Alu-Lamellen, motorisiert', epaisseur: 0, ouverte: true,
      teintes: { alu: { label: 'Farbe der Konstruktion', couleur: '#3B4045' } },
    },
  },

  // Coloris de la structure (clé « bois » du moteur) ; veinage = finition imitation bois
  bois: {
    anthracite: { label: 'Anthrazit · RAL 7016', couleur: '#3A3F44', facteur: 1 },
    blanc: { label: 'Weiss · RAL 9016', couleur: '#EDECE6', facteur: 1 },
    noir: { label: 'Schwarz · RAL 9005', couleur: '#1E1F21', facteur: 1.03 },
    chene: { label: 'Eichen-Optik', couleur: '#A27448', facteur: 1.07, veinage: true },
  },

  bardages: {
    screen: { label: 'Screen-Store', store: true, couleur: '#4B4C4E', facteur: 1 },
    vitrage: { label: 'Schiebeverglasung', vitrage: true, facteur: 2.3 },
  },

  vehicules: {
    aucun: { label: 'Keines' },
  },

  // Montants HT en CHF — FICTIFS
  tarifs: {
    structureM2: { plat: 560 },  // cadre, poteaux, lames et moteur
    couvertureM2: { lames: 0 },
    paroiM2: 165,                // store screen (× 2,3 pour le vitrage)
    rangementM2: 0,
    adosseFacteur: 0.93,         // deux poteaux en moins
    fixationMl: 60,
    gouttiereMl: 0,
    descente: 0,
    led: 1290,
    borne: 0,
    chauffage: 1190,
    poseTaux: 0.15,
    poseMin: 1600,
  },
  tva: 0.081,
  fourchette: 0.08, // ± autour du prix calculé
};
