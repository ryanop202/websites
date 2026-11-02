// Démo préparée pour Origin'Bois Sàrl (Route de Chavannes 48, 1694 Orsonnens FR), 02.11.2026.
// Repris de originbois.ch (vérifié le 02.11.2026) : « Carport » dans leurs prestations Charpente ; ébénisterie, menuiserie,
// agencement, construction bois, charpente, rénovation ; « bois Suisse ». Réglages par défaut repris de LEURS photos
// (originbois.ch/prestations/charpente/, photos 10-13) : toit plat à rive grise, structure lasurée blanche,
// parois arrière + côtés en épicéa naturel vertical (2 places) ; variante fermée en lames horizontales grises ;
// variante contre le bâtiment. ⚠️ Tous les PRIX sont FICTIFS. Couverture du toit plat, dimensions : à confirmer.

export const CONFIG = {
  entreprise: {
    nom: "Origin'Bois Sàrl",
    activite: 'Charpente · Menuiserie · Orsonnens',
    initiales: 'OB',
    logo: 'marque/logo-originbois.png', // logo repris de originbois.ch (logo de navigation, noir)
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Couvert à voiture en bois',
  demo: true,
  badge: "Démo préparée pour Origin'Bois · prix fictifs",
  chapo: 'Charpente et construction bois à Orsonnens, dans la Glâne. Le prix se met à jour à chaque choix.',
  libelles: {
    titre: 'Couvert à voiture sur mesure',
    objet: 'couvert à voiture',
    implantationAide: 'Contre la maison, le couvert se fixe à la façade : une rangée de poteaux en moins.',
  },
  // LED et borne non mentionnées sur leur site
  equipements: ['gouttieres'],
  // Site et logo en noir et blanc : cotes en brun charbon (bois)
  couleurs: { plan: '#4A3B2C', 'plan-clair': '#EEE8DF' },
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

  // Raccourcis de dimensions (le client peut ensuite affiner)
  raccourcis: [
    { label: '1 voiture', largeur: 3.2, profondeur: 5.2, hauteur: 2.2, vehicule: 'citadine' },
    { label: '1 SUV', largeur: 3.6, profondeur: 5.6, hauteur: 2.3, vehicule: 'suv' },
    { label: '2 voitures', largeur: 6.0, profondeur: 5.6, hauteur: 2.3, vehicule: 'citadine' },
    { label: 'Utilitaire', largeur: 4.0, profondeur: 6.5, hauteur: 2.8, vehicule: 'utilitaire' },
  ],

  defauts: {
    largeur: 5.8,
    profondeur: 5.6,
    hauteur: 2.4,
    adosse: 'non',
    toit: 'plat',
    couverture: 'tole',
    teinteCouverture: 'gris',
    bois: 'blanc',
    paroiArriere: true,
    paroiGauche: true,
    paroiDroite: true,
    bardage: 'epicea',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: true,
    led: false,
    borne: false,
    vehicule: 'citadine',
  },

  toits: {
    plat: { label: 'Plat', pente: 2, couvertures: ['epdm', 'tole'] },
    unPan: { label: '1 pan', pente: 8, couvertures: ['tole', 'polycarbonate'] },
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
      label: 'Tôle trapézoïdale', epaisseur: 0.03,
      teintes: {
        anthracite: { label: 'Anthracite', couleur: '#3B3E41' },
        gris: { label: 'Gris argent', couleur: '#8D9296' },
        brun: { label: 'Brun chocolat', couleur: '#5A4134' },
        rouge: { label: 'Rouge tuile', couleur: '#7A2F25' },
      },
    },
    polycarbonate: {
      label: 'Polycarbonate', epaisseur: 0.02,
      teintes: {
        clair: { label: 'Transparent', couleur: '#D6E8EE' },
        opale: { label: 'Opale (laiteux)', couleur: '#F1F0EB' },
        bronze: { label: 'Bronze', couleur: '#9A7B5C' },
      },
    },
    epdm: {
      label: 'Membrane EPDM', epaisseur: 0.03,
      teintes: { noir: { label: 'Noir', couleur: '#2F3032' } },
    },
  },

  // Teinte de la structure (poteaux, poutres, rives). Leurs couverts : lasure blanche
  bois: {
    blanc: { label: 'Lasure blanche', couleur: '#E8E6E0', facteur: 1.06 },
    epicea: { label: 'Épicéa naturel', couleur: '#D2AA72', facteur: 1 },
    meleze: { label: 'Mélèze', couleur: '#B5784A', facteur: 1.15 },
    gris: { label: 'Lasure gris clair', couleur: '#A6A299', facteur: 1.06 },
    anthracite: { label: 'Lasure anthracite', couleur: '#3E3D3B', facteur: 1.06 },
  },

  // Parois : leur couvert ouvert = épicéa naturel vertical ; leur version fermée = lames horizontales grises
  bardages: {
    epicea: { label: 'Épicéa naturel vertical', couleur: '#DCC193', sens: 'vertical', facteur: 1 },
    gris: { label: 'Lames horizontales grises', couleur: '#77756F', sens: 'horizontal', facteur: 1.12 },
    assorti: { label: 'Comme la structure', facteur: 1 },
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
    couvertureM2: { tuiles: 105, tole: 48, polycarbonate: 72, epdm: 64 },
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
