// Démo préparée pour MJL Rossier Charpente-Menuiserie Sàrl (Château-d'Œx VD), 29.10.2026. Passé sur la nouvelle base le 04.11.2026.
// Repris de mjl-rossier-charpente-menuiserie.ch (vérifié le 29.10.2026) : charpente et menuiserie, chalets en madrier,
// « chalets, hangars, cabanes de jardin ou encore couverts pour vos voitures » ; logo avec label Bois Suisse.
// Aucune photo de couvert à voiture sur leur site : style repris de leurs chalets (2 pans, épicéa naturel), à confirmer.
// ⚠️ Tous les PRIX sont FICTIFS. Aucun modèle ni dimension publiés : raccourcis = tailles courantes.

export const CONFIG = {
  entreprise: {
    nom: 'MJL Rossier',
    activite: "Charpente · Menuiserie · Château-d'Œx",
    initiales: 'MJL',
    logo: 'marque/logo-mjl-rossier.jpg', // logo repris de leur site
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Couvert à voiture en bois',
  demo: true,
  chapo: "Couverts à voiture en bois, par un charpentier du Pays-d'Enhaut. Le prix se met à jour à chaque choix.",
  libelles: { titre: 'Couvert à voiture sur mesure' },
  // Leur site ne parle ni de gouttières, ni d'éclairage, ni de borne : étape masquée
  equipements: [],
  // Vert du logo, assombri pour rester lisible en texte
  couleurs: { plan: '#1B7A38', 'plan-clair': '#E2F1E6' },
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

  // Tailles courantes (MJL Rossier ne publie pas de modèles standard)
  raccourcis: [
    { label: '1 voiture', largeur: 3.4, profondeur: 5.5, hauteur: 2.3, vehicule: 'citadine' },
    { label: '2 voitures', largeur: 6.0, profondeur: 5.6, hauteur: 2.3, vehicule: 'citadine' },
    { label: '2 voitures + local', largeur: 6.0, profondeur: 5.6, hauteur: 2.3, rangement: true, posLocal: 'arriere', vehicule: 'citadine' },
    { label: 'Utilitaire', largeur: 4.0, profondeur: 6.5, hauteur: 2.8, vehicule: 'utilitaire' },
  ],

  defauts: {
    largeur: 6.0,
    profondeur: 5.6,
    hauteur: 2.3,
    adosse: 'non',
    toit: 'deuxPans',
    couverture: 'tole',
    teinteCouverture: 'anthracite',
    bois: 'epicea',
    paroiArriere: true,
    paroiGauche: false,
    paroiDroite: false,
    bardage: 'vertical',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: false,
    led: false,
    borne: false,
    vehicule: 'suv',
  },

  toits: {
    plat: { label: 'Plat', pente: 2, couvertures: ['tole'] },
    unPan: { label: '1 pan', pente: 15, couvertures: ['tole', 'tuiles'] },
    // faitage : position du faîte sur la largeur (0,5 = au milieu)
    deuxPans: { label: '2 pans', pente: 25, faitage: 0.5, couvertures: ['tole', 'tuiles'] },
  },

  couvertures: {
    tole: {
      label: 'Tôle', epaisseur: 0.03,
      teintes: {
        anthracite: { label: 'Anthracite', couleur: '#3B3E41' },
        gris: { label: 'Gris argent', couleur: '#8D9296' },
        brun: { label: 'Brun chocolat', couleur: '#5A4134' },
      },
    },
    tuiles: {
      label: 'Tuiles terre cuite', epaisseur: 0.05,
      teintes: {
        naturel: { label: 'Rouge naturel', couleur: '#A4553A' },
        brun: { label: 'Brun vieilli', couleur: '#77503F' },
        anthracite: { label: 'Anthracite', couleur: '#46474A' },
      },
    },
  },

  bois: {
    epicea: { label: 'Épicéa naturel', couleur: '#D2AA72', facteur: 1 },
    meleze: { label: 'Mélèze', couleur: '#B5784A', facteur: 1.15 },
    gris: { label: 'Lasure gris clair', couleur: '#A6A299', facteur: 1.06 },
    brun: { label: 'Lasure brun chalet', couleur: '#7A5232', facteur: 1.06 },
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
    couvertureM2: { tuiles: 105, tole: 52 },
    paroiM2: 115,
    rangementM2: 520, // local fermé, porte comprise
    adosseFacteur: 0.88, // structure contre une façade : une rangée de poteaux en moins
    fixationMl: 55, // muralière fixée à la façade + solin
    gouttiereMl: 0,
    descente: 0,
    led: 0,
    borne: 0,
    poseTaux: 0.16,
    poseMin: 1200,
  },
  tva: 0.081,
  fourchette: 0.08, // ± autour du prix calculé
};
