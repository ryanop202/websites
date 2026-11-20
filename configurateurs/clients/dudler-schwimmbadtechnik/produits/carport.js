// Tout ce qui change d'une entreprise à l'autre est dans ce fichier.
// ⚠️ DÉMO : tous les prix ci-dessous sont FICTIFS. Ils servent seulement à montrer
// comment le calcul fonctionne. Pour un vrai client, on les remplace par SES tarifs.

export const CONFIG = {
  entreprise: {
    nom: 'Ihre Firma',
    activite: 'Holzbau & Carports',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Holz-Carport',
  demo: true,
  // Notifications par e-mail à Ryan (démo publique de wibzo.ch)
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
    non: { label: 'Freistehend', aide: '4 Seiten frei' },
    gauche: { label: 'Am Haus', aide: 'Fassade links' },
    droite: { label: 'Am Haus', aide: 'Fassade rechts' },
  },
  positionsLocal: {
    arriere: { label: 'Hinten' },
    gauche: { label: 'Links' },
    droite: { label: 'Rechts' },
  },

  // Raccourcis de dimensions (le client peut ensuite affiner)
  raccourcis: [
    { label: '1 Auto', largeur: 3.2, profondeur: 5.2, hauteur: 2.2, vehicule: 'citadine' },
    { label: '1 SUV', largeur: 3.6, profondeur: 5.6, hauteur: 2.3, vehicule: 'suv' },
    { label: '2 Autos', largeur: 6.0, profondeur: 5.6, hauteur: 2.3, vehicule: 'citadine' },
    { label: 'Lieferwagen', largeur: 4.0, profondeur: 6.5, hauteur: 2.8, vehicule: 'utilitaire' },
  ],

  defauts: {
    largeur: 3.5,
    profondeur: 5.5,
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
    plat: { label: 'Flachdach', pente: 2, couvertures: ['epdm', 'tole'] },
    unPan: { label: 'Pultdach', pente: 8, couvertures: ['tole', 'polycarbonate'] },
    // faitage : position du faîte sur la largeur (0,5 = au milieu)
    deuxPans: { label: 'Satteldach', pente: 25, faitage: 0.5, couvertures: ['tuiles', 'tole'] },
  },

  couvertures: {
    tuiles: {
      label: 'Tonziegel', epaisseur: 0.05,
      teintes: {
        naturel: { label: 'Naturrot', couleur: '#A4553A' },
        brun: { label: 'Altbraun', couleur: '#77503F' },
        anthracite: { label: 'Anthrazit', couleur: '#46474A' },
      },
    },
    tole: {
      label: 'Trapezblech', epaisseur: 0.03,
      teintes: {
        anthracite: { label: 'Anthrazit', couleur: '#3B3E41' },
        gris: { label: 'Silbergrau', couleur: '#8D9296' },
        brun: { label: 'Schokoladenbraun', couleur: '#5A4134' },
        rouge: { label: 'Ziegelrot', couleur: '#7A2F25' },
      },
    },
    polycarbonate: {
      label: 'Polycarbonat', epaisseur: 0.02,
      teintes: {
        clair: { label: 'Transparent', couleur: '#D6E8EE' },
        opale: { label: 'Opal (milchig)', couleur: '#F1F0EB' },
        bronze: { label: 'Bronze', couleur: '#9A7B5C' },
      },
    },
    epdm: {
      label: 'EPDM-Folie', epaisseur: 0.03,
      teintes: { noir: { label: 'Schwarz', couleur: '#2F3032' } },
    },
  },

  bois: {
    epicea: { label: 'Fichte natur', couleur: '#D2AA72', facteur: 1 },
    meleze: { label: 'Lärche', couleur: '#B5784A', facteur: 1.15 },
    gris: { label: 'Lasur hellgrau', couleur: '#A6A299', facteur: 1.06 },
    anthracite: { label: 'Lasur anthrazit', couleur: '#3E3D3B', facteur: 1.06 },
  },

  bardages: {
    vertical: { label: 'Senkrechte Latten', facteur: 1 },
    horizontal: { label: 'Waagrechte Latten', facteur: 1.12 },
  },

  // Aperçu seulement (pas dans le prix). Modèles CC0 de RGS_Dev, voir modeles/LICENCE-vehicules-rgsdev.txt
  vehicules: {
    aucun: { label: 'Keines' },
    citadine: { label: 'Kleinwagen', fichier: 'modeles/Hatchback.fbx', longueur: 4.1, largeur: 1.78, ratioH: 0.92, couleur: '#5F6B75' },
    suv: { label: 'SUV', fichier: 'modeles/SUV.fbx', longueur: 4.65, largeur: 1.9, ratioH: 0.86, couleur: '#D9D7D1' },
    utilitaire: { label: 'Lieferwagen', fichier: 'modeles/Van.fbx', longueur: 5.3, largeur: 2.02, ratioH: 0.98, couleur: '#ECEBE7' },
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
