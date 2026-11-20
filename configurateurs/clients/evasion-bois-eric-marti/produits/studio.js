// Démo « studio de jardin » (bureau / atelier au fond du jardin), 13.11.2026.
// Modèle 3D dédié (produits3d.js, `studio`) : ossature bois isolée, bardage, grande baie coulissante,
// fenêtres, toit plat ou monopente avec auvent, intérieur aménagé en bureau, terrasse bois en option.
// Pour les fabricants de studios / bureaux de jardin (voir configurateurs/A-LIRE.md).
// ⚠️ Tous les PRIX sont FICTIFS (ordre de grandeur du marché, à remplacer par les tarifs du fabricant).

export const CONFIG = {
  entreprise: {
    nom: 'Votre entreprise',
    activite: 'Studios & bureaux de jardin',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Studio de jardin',
  demo: true,
  type: 'studio',
  modele3d: 'studio',
  chapo: 'Réglez votre studio de jardin étape par étape. Le prix se met à jour à chaque choix.',
  libelles: {
    titre: 'Studio de jardin sur mesure',
    objet: 'studio de jardin',
    passage: 'hauteur',
    largeur: 'Largeur',
    largeurAide: 'côté baie vitrée',
    profondeur: 'Profondeur',
    profondeurAide: '',
    hauteur: 'Hauteur intérieure',
    hauteurAide: 'sous plafond',
    implantationAide: 'Le studio est posé au fond du jardin, sur une petite dalle.',
    toiture: 'Toiture',
    finition: 'Couleur des menuiseries',
    finitionCourt: 'Menuiseries',
    finitionLigne: 'Menuiseries',
    parois: 'Façades et baie vitrée',
    paroisCourt: 'Façades',
    paroisAide: 'Choisissez le bardage. Le curseur fait coulisser la baie pour voir l’intérieur.',
    bardage: 'Bardage',
    paroiLigne: 'Bardage',
  },
  local: false,
  equipements: ['led', 'chauffage'],
  sol: 'terrasse',
  reculMaison: 8.5, // le studio est au fond du jardin, pas collé à la maison

  // [min, max, pas] en mètres
  limites: {
    largeur: [3, 6, 0.1],
    profondeur: [2.5, 4.5, 0.1],
    hauteur: [2.3, 2.6, 0.05],
    vantaux: [0, 2, 1],
  },
  porteeMax: 4,
  profondeursLocal: [1.2],

  implantations: {
    non: { label: 'Au fond du jardin', aide: 'posé sur une dalle' },
  },
  positionsLocal: { arriere: { label: 'Arrière' } },

  raccourcis: [
    { label: 'Bureau 3 × 2,5 m', largeur: 3, profondeur: 2.5, hauteur: 2.4 },
    { label: 'Studio 4 × 3 m', largeur: 4, profondeur: 3, hauteur: 2.4 },
    { label: 'Atelier 5,5 × 3,5 m', largeur: 5.5, profondeur: 3.5, hauteur: 2.5 },
  ],

  defauts: {
    largeur: 4,
    profondeur: 3,
    hauteur: 2.4,
    adosse: 'non',
    toit: 'plat',
    couverture: 'vegetal',
    teinteCouverture: 'sedum',
    bois: 'anthracite',
    paroiArriere: true,
    paroiGauche: true,
    paroiDroite: true,
    paroiAvant: false,
    bardage: 'meleze',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.2,
    gouttieres: false,
    led: true,
    borne: false,
    storeToit: false,
    chauffage: false,
    terrasseAvant: true,
    vantaux: 1,
    vehicule: 'aucun',
  },

  toits: {
    plat: { label: 'Plat', pente: 2, couvertures: ['vegetal', 'gravier', 'epdm'] },
    unPan: { label: 'Monopente avec auvent', pente: 6, couvertures: ['tole', 'epdm'] },
  },

  couvertures: {
    vegetal: { label: 'Toit végétalisé', epaisseur: 0.06, teintes: { sedum: { label: 'Sedum', couleur: '#6E8A45' } } },
    gravier: { label: 'Gravier', epaisseur: 0.05, teintes: { gris: { label: 'Gris', couleur: '#9A968E' } } },
    epdm: { label: 'Membrane EPDM', epaisseur: 0.02, teintes: { noir: { label: 'Noir', couleur: '#2A2B2D' } } },
    tole: {
      label: 'Tôle à joint debout', epaisseur: 0.02,
      teintes: {
        anthracite: { label: 'Anthracite', couleur: '#3A3D40' },
        noir: { label: 'Noir', couleur: '#1F2022' },
        zinc: { label: 'Zinc naturel', couleur: '#9AA0A3' },
      },
    },
  },

  // Couleur des menuiseries, rives et baguettes (clé « bois » du moteur)
  bois: {
    anthracite: { label: 'Gris anthracite', couleur: '#3A3D40', facteur: 1 },
    noir: { label: 'Noir', couleur: '#1E1F21', facteur: 1.02 },
    blanc: { label: 'Blanc', couleur: '#E8E7E2', facteur: 1 },
  },

  bardages: {
    meleze: { label: 'Mélèze naturel, lames horizontales', couleur: '#B9875A', sens: 'horizontal', facteur: 1.1 },
    epicea: { label: 'Épicéa naturel, lames verticales', couleur: '#D4AE7C', facteur: 1 },
    gris: { label: 'Bois pré-grisé', couleur: '#A19D95', facteur: 1.08 },
    noir: { label: 'Bois noir (brûlé)', couleur: '#2C2A28', facteur: 1.2 },
  },

  vehicules: { aucun: { label: 'Aucun' } },

  // Montants HT en CHF — FICTIFS
  tarifs: {
    fondationM2: 140,
    ossatureM2: 950,
    bardageM2: 85,
    toitureM2: { plat: 160, unPan: 150 },
    couvertureM2: { vegetal: 95, gravier: 45, epdm: 35, tole: 70 },
    baieMl: 1150,
    fenetre: 980,
    electricite: 2200,
    led: 850,
    clim: 3400,
    terrasseM2: 240,
    poseTaux: 0.14,
    poseMin: 3000,
  },
  tva: 0.081,
  fourchette: 0.1,
};
