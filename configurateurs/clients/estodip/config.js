// Démo préparée pour Esto-Dip SA (Yverdon-les-Bains VD), 29.10.2026.
// Repris de estodip.ch (vérifié le 29.10.2026) : charpente, couverture, ferblanterie ; « Couverts à voitures,
// porches d'entrée, séparations de terrasse, balcons ». Page « Couvert à voiture » (photos) : toits plats en tôle,
// 1 pan et 2 pans en tuiles, couverts adossés, poteaux lasurés gris, local avec bardage, un couvert avec panneaux solaires.
// Logo non repris (téléchargement bloqué par leur site) : initiales aux couleurs du logo (jaune / rouge).
// ⚠️ Tous les PRIX sont FICTIFS. Aucun modèle ni dimension publiés sur leur site : raccourcis = tailles courantes.

export const CONFIG = {
  entreprise: {
    nom: 'Esto-Dip SA',
    activite: 'Charpente · Couverture · Ferblanterie',
    initiales: 'ED',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Couvert à voiture en bois',
  demo: true,
  badge: 'Démo préparée pour Esto-Dip · prix fictifs',
  chapo: 'Charpente, couverture et ferblanterie par la même équipe, à Yverdon-les-Bains. Le prix se met à jour à chaque choix.',
  libelles: { titre: 'Couvert à voiture sur mesure' },
  // LED et borne non mentionnées sur leur site ; gouttières = leur métier (ferblanterie)
  equipements: ['gouttieres'],
  // Rouge du logo, à peine assombri pour rester lisible en texte
  couleurs: { plan: '#C8001A', 'plan-clair': '#FBE4E6' },
  // Notifications par e-mail à Ryan (utilisation de la démo, PDF, demandes)
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page

  // [min, max, pas] en mètres
  limites: {
    largeur: [3, 7, 0.1],
    profondeur: [5, 8, 0.1],
    hauteur: [2.1, 2.8, 0.05],
  },
  porteeMax: 3.0, // distance max entre deux poteaux (règle technique, à valider par l'entreprise)
  profondeursLocal: [1.2, 1.8, 2.4],

  implantations: {
    non: { label: 'Isolé', aide: '4 côtés libres' },
    gauche: { label: 'Contre la maison', aide: 'façade à gauche' },
    droite: { label: 'Contre la maison', aide: 'façade à droite' },
  },
  positionsLocal: {
    arriere: { label: 'Arrière' },
    gauche: { label: 'Gauche' },
    droite: { label: 'Droite' },
  },

  // Tailles courantes (Esto-Dip ne publie pas de modèles standard)
  raccourcis: [
    { label: '1 voiture', largeur: 3.2, profondeur: 5.2, hauteur: 2.2, vehicule: 'citadine' },
    { label: '1 SUV', largeur: 3.6, profondeur: 5.6, hauteur: 2.3, vehicule: 'suv' },
    { label: '2 voitures', largeur: 6.0, profondeur: 5.6, hauteur: 2.3, vehicule: 'citadine' },
    { label: 'Utilitaire', largeur: 4.0, profondeur: 6.5, hauteur: 2.8, vehicule: 'utilitaire' },
  ],

  defauts: {
    largeur: 6.0,
    profondeur: 5.6,
    hauteur: 2.3,
    adosse: 'non',
    toit: 'plat',
    couverture: 'tole',
    teinteCouverture: 'gris',
    bois: 'gris',
    paroiArriere: true,
    paroiGauche: false,
    paroiDroite: false,
    bardage: 'horizontal',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: true,
    led: false,
    borne: false,
    vehicule: 'suv',
  },

  toits: {
    plat: { label: 'Plat', pente: 2, couvertures: ['tole', 'solaire'] },
    unPan: { label: '1 pan', pente: 15, couvertures: ['tuiles', 'tole'] },
    // faitage : position du faîte sur la largeur (0,5 = au milieu)
    deuxPans: { label: '2 pans', pente: 25, faitage: 0.5, couvertures: ['tuiles', 'tole'] },
  },

  couvertures: {
    tuiles: {
      label: 'Tuiles terre cuite', epaisseur: 0.05,
      teintes: {
        naturel: { label: 'Rouge naturel', couleur: '#A4553A' },
        brun: { label: 'Brun vieilli', couleur: '#77503F' },
        anthracite: { label: 'Anthracite', couleur: '#46474A' },
      },
    },
    tole: {
      label: 'Ferblanterie (tôle)', epaisseur: 0.03,
      teintes: {
        gris: { label: 'Gris argent', couleur: '#8D9296' },
        anthracite: { label: 'Anthracite', couleur: '#3B3E41' },
        brun: { label: 'Brun chocolat', couleur: '#5A4134' },
      },
    },
    solaire: {
      label: 'Panneaux solaires', epaisseur: 0.045,
      teintes: { noir: { label: 'Noir', couleur: '#141A24' } },
    },
  },

  bois: {
    epicea: { label: 'Épicéa naturel', couleur: '#D2AA72', facteur: 1 },
    meleze: { label: 'Mélèze', couleur: '#B5784A', facteur: 1.15 },
    gris: { label: 'Lasure gris clair', couleur: '#A6A299', facteur: 1.06 },
    anthracite: { label: 'Lasure anthracite', couleur: '#3E3D3B', facteur: 1.06 },
  },

  bardages: {
    vertical: { label: 'Lames verticales', facteur: 1 },
    horizontal: { label: 'Lames horizontales', facteur: 1.12 },
  },

  // Aperçu seulement (pas dans le prix). Modèles CC0 de RGS_Dev, voir modeles/LICENCE-vehicules-rgsdev.txt
  vehicules: {
    aucun: { label: 'Aucun' },
    citadine: { label: 'Citadine', fichier: 'modeles/Hatchback.fbx', longueur: 4.1, largeur: 1.78, ratioH: 0.92, couleur: '#5F6B75' },
    suv: { label: 'SUV', fichier: 'modeles/SUV.fbx', longueur: 4.65, largeur: 1.9, ratioH: 0.86, couleur: '#D9D7D1' },
    utilitaire: { label: 'Utilitaire', fichier: 'modeles/Van.fbx', longueur: 5.3, largeur: 2.02, ratioH: 0.98, couleur: '#ECEBE7' },
  },

  // Montants HT en CHF — FICTIFS
  tarifs: {
    structureM2: { plat: 240, unPan: 260, deuxPans: 330 },
    couvertureM2: { tuiles: 105, tole: 52, solaire: 290 },
    paroiM2: 115,
    rangementM2: 520, // local fermé, porte comprise
    adosseFacteur: 0.88, // structure contre une façade : une rangée de poteaux en moins
    fixationMl: 55, // muralière fixée à la façade + solin
    gouttiereMl: 42,
    descente: 180,
    led: 0,
    borne: 0,
    poseTaux: 0.16,
    poseMin: 1200,
  },
  tva: 0.081,
  fourchette: 0.08, // ± autour du prix calculé
};
