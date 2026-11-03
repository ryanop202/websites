// Démo publique « véranda alu » (3e produit de demo.wibzo.ch), 03.11.2026.
// Même moteur : structure alu, toujours contre la maison, côtés libres et façade avant vitrés (veranda: true).
// ⚠️ Tous les PRIX sont FICTIFS.

export const CONFIG = {
  entreprise: {
    nom: 'Votre entreprise',
    activite: 'Vérandas & menuiserie alu',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Véranda alu',
  demo: true,
  // Notifications par e-mail à Ryan (démo publique de wibzo.ch)
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  chapo: 'Réglez votre véranda étape par étape. Le prix se met à jour à chaque choix.',
  materiau: 'alu',
  veranda: true,
  libelles: {
    titre: 'Véranda alu sur mesure',
    objet: 'véranda',
    passage: 'hauteur',
    largeurAide: 'le long de la façade',
    hauteur: 'Hauteur',
    hauteurAide: 'côté jardin',
    implantationAide: 'La véranda se fixe à la façade de la maison : choisissez le côté.',
    parois: 'Vitrage',
    paroisCourt: 'Vitrage',
    bardage: 'Type de verre',
    finition: 'Coloris de l’aluminium',
    finitionCourt: 'Coloris',
    finitionLigne: 'Structure',
  },
  local: false,
  equipements: ['gouttieres', 'led'],
  sol: 'terrasse',

  // [min, max, pas] en mètres
  limites: {
    largeur: [3, 7, 0.1],
    profondeur: [2.5, 5, 0.1],
    hauteur: [2.3, 2.8, 0.05],
  },
  porteeMax: 3.5, // distance max entre deux poteaux (règle technique, à valider par l'entreprise)
  profondeursLocal: [1.2, 1.8, 2.4],

  // Toujours contre la maison
  implantations: {
    gauche: { label: 'Contre la maison', aide: 'façade à gauche' },
    droite: { label: 'Contre la maison', aide: 'façade à droite' },
  },
  positionsLocal: {
    arriere: { label: 'Arrière' },
    gauche: { label: 'Gauche' },
    droite: { label: 'Droite' },
  },

  raccourcis: [
    { label: '3,5 × 3 m', largeur: 3.5, profondeur: 3, hauteur: 2.5 },
    { label: '4,5 × 3,5 m', largeur: 4.5, profondeur: 3.5, hauteur: 2.5 },
    { label: '6 × 4 m', largeur: 6, profondeur: 4, hauteur: 2.6 },
  ],

  defauts: {
    largeur: 4.5,
    profondeur: 3.5,
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
    vehicule: 'aucun',
  },

  toits: {
    unPan: { label: 'Incliné', pente: 8, couvertures: ['verre', 'polycarbonate', 'panneau'] },
    plat: { label: 'Plat', pente: 2, couvertures: ['panneau', 'verre'] },
  },

  couvertures: {
    verre: {
      label: 'Verre feuilleté', epaisseur: 0.02,
      teintes: { clair: { label: 'Clair', couleur: '#D6E8EE' } },
    },
    polycarbonate: {
      label: 'Polycarbonate', epaisseur: 0.02,
      teintes: {
        clair: { label: 'Transparent', couleur: '#D6E8EE' },
        opale: { label: 'Opale (laiteux)', couleur: '#F1F0EB' },
      },
    },
    panneau: {
      label: 'Panneau isolé', epaisseur: 0.06,
      teintes: {
        anthracite: { label: 'Anthracite', couleur: '#3B3E41' },
        blanc: { label: 'Blanc', couleur: '#E9E8E4' },
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

  vehicules: {
    aucun: { label: 'Aucun' },
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
    poseTaux: 0.18,
    poseMin: 2500,
  },
  tva: 0.081,
  fourchette: 0.08, // ± autour du prix calculé
};
