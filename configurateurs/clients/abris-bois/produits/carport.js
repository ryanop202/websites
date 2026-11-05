// Carport Abris Bois (repris de la démo du 28.10.2026, passé sur la nouvelle base le 04.11.2026).
// Modèles et dimensions repris de abrisbois.ch/carport (vérifié le 28.10.2026).
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les options de bois et de couverture (exemples).
// Pas de raccourci pour le modèle « asymétrique » : ses dimensions « (300 x 350) + 150 cm »
// ne sont pas expliquées sur leur site → à leur demander.

export const CONFIG = {
  entreprise: {
    nom: 'Abris Bois',
    activite: 'Tout en Bois Sàrl · Leysin',
    initiales: 'AB',
    logo: 'marque/logo-abris-bois-200.png', // logo repris de abrisbois.ch, réduit à 200 px
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Carport en bois',
  demo: true,
  // Notifications par e-mail à Ryan (utilisation de la démo, PDF, demandes).
  // Clé gratuite à créer sur web3forms.com avec contact@wibzo.ch, puis à coller ici.
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  chapo: 'Modèles standards ou sur mesure, fabrication suisse. Réglez votre carport, le prix se met à jour à chaque choix.',
  // Vert d'Abris Bois (#77AD1B), assombri pour rester lisible en texte
  couleurs: { plan: '#4E7A12', 'plan-clair': '#EAF2DC' },

  // [min, max, pas] en mètres (pas de 2 cm pour atteindre 3,18 et 5,18 m)
  limites: {
    largeur: [3, 7, 0.02],
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
  // Modèles du catalogue Abris Bois (dimensions publiées sur leur site)
  raccourcis: [
    { label: 'Riviera 1 place', largeur: 3.18, profondeur: 5.0, toit: 'deuxPans', vehicule: 'citadine' },
    { label: 'Riviera 2 places', largeur: 5.18, profondeur: 5.0, toit: 'deuxPans', vehicule: 'citadine' },
    { label: 'Toit 1 pan, 1 place', largeur: 3.18, profondeur: 5.0, toit: 'unPan', vehicule: 'citadine' },
  ],

  defauts: {
    largeur: 3.18,
    profondeur: 5.0,
    hauteur: 2.3,
    adosse: 'non',
    toit: 'deuxPans',
    couverture: 'tuiles',
    teinteCouverture: 'naturel',
    bois: 'epicea',
    paroiArriere: true,
    paroiGauche: false,
    paroiDroite: false,
    bardage: 'vertical',
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
    deuxPans: { label: 'Riviera', pente: 25, faitage: 0.5, couvertures: ['tuiles', 'tole'] },
    asymetrique: { label: 'Asymétrique', pente: 25, faitage: 0.36, couvertures: ['tuiles', 'tole'] },
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
    structureM2: { plat: 240, unPan: 260, deuxPans: 330, asymetrique: 345 },
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
