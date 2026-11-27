// Lejan EG (25.11.2026) : pergola alu à toile rétractable motorisée, LED dans les profils (vue sur leurs réalisations).
// Même moteur que les carports : toit ouvert (chevrons seuls), sol en terrasse bois, pas de véhicule ni de local.
// ⚠️ Tous les PRIX sont FICTIFS.

export const CONFIG = {
  entreprise: {
    nom: 'Votre entreprise',
    activite: 'Charpente & aménagements extérieurs',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Pergola à toile rétractable',
  materiau: 'alu',
  demo: true,
  // Notifications par e-mail à Ryan (démo publique de wibzo.ch)
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  chapo: 'Réglez votre pergola à toile étape par étape. Le prix se met à jour à chaque choix.',
  libelles: {
    titre: 'Pergola alu à toile rétractable',
    objet: 'pergola',
    passage: 'hauteur',
    inverserCotes: true,
    largeur: 'Avancée',
    largeurAide: 'depuis la façade',
    profondeur: 'Largeur',
    profondeurAide: 'le long de la façade',
    hauteur: 'Hauteur',
    hauteurAide: 'sous les poutres',
    implantationAide: 'Contre la maison, la pergola se fixe à la façade : une rangée de poteaux en moins.',
    parois: 'Parois vitrées (option)',
    paroisAide: 'Ouverte par défaut. Touchez un côté pour ajouter une paroi vitrée.',
    toiture: 'Toile rétractable',
    finition: 'Coloris de l’aluminium',
    finitionCourt: 'Coloris',
    finitionLigne: 'Structure',
    ledAide: 'spots LED intégrés aux profils',
    bardage: 'Type de verre',
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
    non: { label: 'Isolée', aide: '4 côtés libres' },
    gauche: { label: 'Contre la maison', aide: 'façade à gauche' },
    droite: { label: 'Contre la maison', aide: 'façade à droite' },
  },
  positionsLocal: {
    arriere: { label: 'Arrière' },
    gauche: { label: 'Gauche' },
    droite: { label: 'Droite' },
  },

  // (raccourcis : largeur le long de la façade × avancée)
  raccourcis: [
    { label: '3 × 3 m', profondeur: 3, largeur: 3, hauteur: 2.3 },
    { label: '4 × 3,5 m', profondeur: 4, largeur: 3.5, hauteur: 2.3 },
    { label: '5 × 4 m', profondeur: 5, largeur: 4, hauteur: 2.4 },
  ],

  defauts: {
    largeur: 3.5,
    profondeur: 4.5,
    hauteur: 2.3,
    adosse: 'gauche',
    toit: 'plat',
    couverture: 'toile',
    teinteCouverture: 'ecru',
    bois: 'anthracite',
    paroiArriere: false,
    paroiGauche: false,
    paroiDroite: false,
    bardage: 'clair',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: false,
    led: true,
    borne: false,
    vehicule: 'aucun',
  },

  toits: {
    plat: { label: 'Plat', pente: 2, couvertures: ['toile'] },
    unPan: { label: 'Incliné', pente: 6, couvertures: ['toile'] },
  },

  couvertures: {
    toile: {
      label: 'Toile rétractable motorisée', epaisseur: 0.01,
      teintes: {
        ecru: { label: 'Écru', couleur: '#E6DDCB' },
        gris: { label: 'Gris clair', couleur: '#A8A6A0' },
        anthracite: { label: 'Anthracite', couleur: '#4A4B4D' },
      },
    },
  },

  // Coloris de l'aluminium (clé « bois » du moteur)
  bois: {
    anthracite: { label: 'Gris anthracite', couleur: '#3A3D40', facteur: 1 },
    blanc: { label: 'Blanc', couleur: '#E8E7E2', facteur: 1 },
    noir: { label: 'Noir sablé', couleur: '#1E1F21', facteur: 1.03 },
  },

  bardages: {
    clair: { label: 'Verre clair', vitrage: true, facteur: 1 },
    teinte: { label: 'Verre teinté', vitrage: true, verre: '#7E8C92', facteur: 1.08 },
  },

  // Pas de véhicule pour une pergola
  vehicules: {
    aucun: { label: 'Aucun' },
  },

  // Montants HT en CHF — FICTIFS
  tarifs: {
    structureM2: { plat: 330, unPan: 345 },
    couvertureM2: { toile: 140 },
    paroiM2: 380, // parois vitrées
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
