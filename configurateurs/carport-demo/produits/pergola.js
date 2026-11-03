// Démo publique « pergola en bois » (2e exemple de wibzo.ch), 29.10.2026.
// Même moteur que les carports : toit ouvert (chevrons seuls), sol en terrasse bois, pas de véhicule ni de local.
// ⚠️ Tous les PRIX sont FICTIFS.

export const CONFIG = {
  entreprise: {
    nom: 'Votre entreprise',
    activite: 'Charpente & aménagements extérieurs',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Pergola en bois',
  demo: true,
  // Notifications par e-mail à Ryan (démo publique de wibzo.ch)
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  chapo: 'Réglez votre pergola étape par étape. Le prix se met à jour à chaque choix.',
  libelles: {
    titre: 'Pergola en bois sur mesure',
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
    parois: 'Brise-vue',
    bardage: 'Type de brise-vue',
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
    plat: { label: 'Plat', pente: 2, couvertures: ['ouverte', 'toile', 'polycarbonate'] },
    unPan: { label: 'Incliné', pente: 6, couvertures: ['ouverte', 'toile', 'polycarbonate'] },
  },

  couvertures: {
    ouverte: {
      label: 'Ouverte (chevrons)', epaisseur: 0, ouverte: true,
      teintes: { bois: { label: 'Bois', couleur: '#D2AA72' } },
    },
    toile: {
      label: "Toile d'ombrage", epaisseur: 0.01,
      teintes: {
        ecru: { label: 'Écru', couleur: '#E6DDCB' },
        gris: { label: 'Gris clair', couleur: '#A8A6A0' },
        anthracite: { label: 'Anthracite', couleur: '#4A4B4D' },
      },
    },
    polycarbonate: {
      label: 'Polycarbonate', epaisseur: 0.02,
      teintes: {
        clair: { label: 'Transparent', couleur: '#D6E8EE' },
        opale: { label: 'Opale (laiteux)', couleur: '#F1F0EB' },
      },
    },
  },

  bois: {
    epicea: { label: 'Épicéa naturel', couleur: '#D2AA72', facteur: 1 },
    meleze: { label: 'Mélèze', couleur: '#B5784A', facteur: 1.15 },
    gris: { label: 'Lasure gris clair', couleur: '#A6A299', facteur: 1.06 },
    anthracite: { label: 'Lasure anthracite', couleur: '#3E3D3B', facteur: 1.06 },
  },

  bardages: {
    horizontal: { label: 'Lames horizontales', sens: 'horizontal', facteur: 1 },
    vertical: { label: 'Lames verticales', facteur: 1 },
  },

  // Pas de véhicule pour une pergola
  vehicules: {
    aucun: { label: 'Aucun' },
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
