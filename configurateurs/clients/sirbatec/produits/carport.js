// Démo préparée pour Sirbatec SA (Auboranges FR), 28.10.2026. Passé sur la nouvelle base le 04.11.2026.
// Repris de sirbatec.ch (vérifié le 28.10.2026) : couverts simples et doubles, local de rangement / vélos,
// toit plat gravier ou végétalisé, tuiles, tôle thermolaquée, bois suisse certifié, livraison et pose par leur équipe.
// ⚠️ Tous les PRIX sont FICTIFS. Aucun modèle ni dimension publiés sur leur site : raccourcis = tailles courantes.

export const CONFIG = {
  entreprise: {
    nom: 'Sirbatec SA',
    activite: 'Construction bois · Auboranges',
    initiales: 'S',
    logo: 'marque/logo-sirbatec.svg', // logo repris de sirbatec.ch
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Couvert à voitures en bois',
  demo: true,
  chapo: 'Couverts sur mesure en bois suisse certifié, livrés et posés par notre équipe. Le prix se met à jour à chaque choix.',
  couleurs: { plan: '#1F2345', 'plan-clair': '#E5E7F0' },
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

  // Tailles courantes (Sirbatec ne publie pas de modèles standard)
  raccourcis: [
    { label: 'Couvert simple', largeur: 3.4, profondeur: 5.5, hauteur: 2.3, rangement: false, vehicule: 'citadine' },
    { label: 'Couvert double', largeur: 6.0, profondeur: 5.5, hauteur: 2.3, rangement: false, vehicule: 'citadine' },
    { label: 'Double + local de rangement', largeur: 6.0, profondeur: 5.5, hauteur: 2.3, rangement: true, posLocal: 'arriere', vehicule: 'citadine' },
  ],

  defauts: {
    largeur: 6.0,
    profondeur: 5.5,
    hauteur: 2.3,
    adosse: 'non',
    toit: 'plat',
    couverture: 'vegetal',
    teinteCouverture: 'sedum',
    bois: 'epicea',
    paroiArriere: true,
    paroiGauche: false,
    paroiDroite: false,
    bardage: 'vertical',
    rangement: true,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: true,
    led: false,
    borne: false,
    vehicule: 'citadine',
  },

  toits: {
    plat: { label: 'Plat', pente: 2, couvertures: ['vegetal', 'gravier'] },
    unPan: { label: '1 pan', pente: 8, couvertures: ['tole'] },
    // faitage : position du faîte sur la largeur (0,5 = au milieu)
    deuxPans: { label: '2 pans', pente: 25, faitage: 0.5, couvertures: ['tuiles', 'tole'] },
  },

  couvertures: {
    vegetal: {
      label: 'Toit végétalisé', epaisseur: 0.1,
      teintes: { sedum: { label: 'Sedum', couleur: '#7C8F45' } },
    },
    gravier: {
      label: 'Toit plat gravier', epaisseur: 0.08,
      teintes: {
        gris: { label: 'Gris', couleur: '#B9B7B1' },
        clair: { label: 'Clair', couleur: '#DAD4C6' },
      },
    },
    tuiles: {
      label: 'Tuiles', epaisseur: 0.05,
      teintes: {
        naturel: { label: 'Rouge naturel', couleur: '#A4553A' },
        brun: { label: 'Brun vieilli', couleur: '#77503F' },
        anthracite: { label: 'Anthracite', couleur: '#46474A' },
      },
    },
    tole: {
      label: 'Tôle thermolaquée', epaisseur: 0.03,
      teintes: {
        anthracite: { label: 'Anthracite', couleur: '#3B3E41' },
        gris: { label: 'Gris argent', couleur: '#8D9296' },
        brun: { label: 'Brun chocolat', couleur: '#5A4134' },
        rouge: { label: 'Rouge tuile', couleur: '#7A2F25' },
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
    couvertureM2: { vegetal: 120, gravier: 85, tuiles: 105, tole: 52 },
    paroiM2: 115,
    rangementM2: 520, // local fermé, porte comprise
    adosseFacteur: 0.88, // structure contre une façade : une rangée de poteaux en moins
    fixationMl: 55, // muralière fixée à la façade + solin
    gouttiereMl: 42,
    descente: 180,
    led: 480,
    borne: 690,
    poseTaux: 0.16,
    poseMin: 1200,
  },
  tva: 0.081,
  fourchette: 0.08, // ± autour du prix calculé
};
