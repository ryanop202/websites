// Démo publique « terrasse » (5e produit de demo.wibzo.ch), 04.11.2026.
// Modèle 3D dédié (produits3d.js, `terrasse`) : lames bois ou composite, dalles de grès cérame, marches, garde-corps, LED.
// Pour les paysagistes, menuisiers et charpentiers qui posent des terrasses (voir PROSPECTS-CONFIGURATEUR.md, « terrasses »).
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les teintes (exemples).

export const CONFIG = {
  entreprise: {
    nom: 'Ihre Firma',
    activite: 'Terrassen & Gartenbau',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Terrasse',
  type: 'terrasse',
  modele3d: 'terrasse',
  demo: true,
  // Notifications par e-mail à Ryan (démo publique de wibzo.ch)
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  chapo: 'Gestalten Sie Ihre Terrasse Schritt für Schritt. Der Preis passt sich jeder Wahl an.',
  libelles: {
    titre: 'Terrasse nach Mass',
    objet: 'Terrasse',
    passage: 'Boden',
    inverserCotes: true,
    largeur: 'Tiefe',
    largeurAide: 'ab der Fassade',
    profondeur: 'Breite',
    profondeurAide: 'entlang der Fassade',
    hauteur: 'Bodenhöhe',
    hauteurAide: 'über dem Gelände',
    implantationAide: 'Am Haus beginnt die Terrasse an der Fassade. Freistehend liegt sie im Garten.',
    toiture: 'Belag',
    toitureCourt: 'Belag',
    couverture: 'Material',
    teinte: 'Farbe',
    finition: 'Verlegerichtung',
    finitionCourt: 'Verlegung',
    finitionLigne: 'Verlegung',
    parois: 'Geländer',
    paroisCourt: 'Geländer',
    paroisAide: 'Tippen Sie auf eine Seite, um ein Geländer hinzuzufügen. Der Zugang zu den Stufen bleibt frei.',
    bardage: 'Art des Geländers',
    paroiLigne: 'Geländer',
    ledAide: 'in Boden und Stufen eingelassene Spots',
  },
  local: false,
  equipements: ['led'],
  sol: 'terrasse',
  paroiAvant: true, // les 4 côtés peuvent recevoir un garde-corps
  hauteurMarche: 0.18,     // hauteur max d'une marche (m)
  hauteurSansMarche: 0.2,  // en dessous : pas de marche
  largeurMarches: 1.4,
  hauteurGardeCorps: 1.0,
  noteGardeCorps: 'Geländer empfohlen (Norm SIA 358)',

  // [min, max, pas] en mètres
  limites: {
    largeur: [1.5, 6, 0.1],     // avancée depuis la façade
    profondeur: [2, 10, 0.1],   // le long de la façade
    hauteur: [0.05, 1.5, 0.05], // hauteur du plancher
  },
  porteeMax: 3.0,
  profondeursLocal: [1.2, 1.8, 2.4],

  implantations: {
    non: { label: 'Freistehend', aide: 'im Garten' },
    gauche: { label: 'Am Haus', aide: 'Fassade links' },
    droite: { label: 'Am Haus', aide: 'Fassade rechts' },
  },
  positionsLocal: {
    arriere: { label: 'Hinten' },
    gauche: { label: 'Links' },
    droite: { label: 'Rechts' },
  },

  // (raccourcis : largeur le long de la façade × avancée)
  raccourcis: [
    { label: '4 × 3 m', profondeur: 4, largeur: 3, hauteur: 0.15 },
    { label: '6 × 4 m', profondeur: 6, largeur: 4, hauteur: 0.4 },
    { label: '8 × 4.5 m', profondeur: 8, largeur: 4.5, hauteur: 0.8 },
  ],

  defauts: {
    largeur: 3.5,
    profondeur: 5.5,
    hauteur: 0.4,
    adosse: 'gauche',
    toit: 'plat',
    couverture: 'composite',
    teinteCouverture: 'gris',
    bois: 'parallele',
    paroiArriere: false,
    paroiAvant: false,
    paroiGauche: false,
    paroiDroite: false,
    bardage: 'verre',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: false,
    led: false,
    borne: false,
    chauffage: false,
    storeToit: false,
    vehicule: 'aucun',
  },

  toits: {
    plat: { label: 'Flach', pente: 0, couvertures: ['bois', 'composite', 'gres'] },
  },

  couvertures: {
    bois: {
      label: 'Holzdielen', type: 'lames', epaisseur: 0.025,
      teintes: {
        meleze: { label: 'Lärche natur', couleur: '#BE8E5C' },
        douglas: { label: 'Douglas', couleur: '#C79A68' },
        thermo: { label: 'Thermo-Esche', couleur: '#7B5235' },
        grise: { label: 'Vergrautes Holz', couleur: '#A39C91' },
      },
    },
    composite: {
      label: 'WPC-Dielen', type: 'lames', rainures: true, epaisseur: 0.025,
      teintes: {
        gris: { label: 'Hellgrau', couleur: '#A3A29D' },
        anthracite: { label: 'Anthrazit', couleur: '#4B4C4E' },
        brun: { label: 'Braun', couleur: '#6E5240' },
        teck: { label: 'Teak', couleur: '#A27A55' },
      },
    },
    gres: {
      label: 'Feinsteinzeug-Platten 120 × 60', type: 'dalles', epaisseur: 0.02,
      teintes: {
        beton: { label: 'Betongrau', couleur: '#BDBAB3' },
        beige: { label: 'Steinbeige', couleur: '#DCCFB8' },
        anthracite: { label: 'Anthrazit', couleur: '#626365' },
        bois: { label: 'Holzoptik', couleur: '#AD8A64' },
      },
    },
  },

  // Sens de pose (la clé « bois » est celle lue par le moteur pour cette étape)
  bois: {
    parallele: { label: 'Parallel zur Fassade', couleur: '#B8A68C', facteur: 1, sens: 'parallele' },
    perpendiculaire: { label: 'Quer zur Fassade', couleur: '#A8957A', facteur: 1.03, sens: 'perpendiculaire' },
    cadre: { label: 'Mit umlaufendem Rahmen', couleur: '#8F7C62', facteur: 1.1, sens: 'parallele', cadre: true },
  },

  // Types de garde-corps
  bardages: {
    verre: { label: 'Glas', vitrage: true, facteur: 1.9 },
    bois: { label: 'Holz mit Stäben', barreaux: true, couleur: '#A27448', facteur: 1 },
    cables: { label: 'Edelstahlseile', cables: true, facteur: 1.45 },
  },

  vehicules: {
    aucun: { label: 'Keines' },
  },

  // Montants HT en CHF — FICTIFS
  tarifs: {
    revetementM2: { bois: 125, composite: 140, gres: 150 },
    structureM2: 60,          // lambourdes / plots, plancher au ras du sol
    structureHauteurM2: 80,   // supplément par m² et par mètre de hauteur du plancher
    habillageM2: 140,         // habillage des côtés libres (plancher surélevé)
    marche: 380,              // par marche (largeur 1,40 m)
    gardeCorpsMl: 260,        // par mètre (× facteur du type)
    led: 890,
    poseTaux: 0.3,
    poseMin: 1500,
  },
  tva: 0.081,
  fourchette: 0.1, // ± autour du prix calculé
};
