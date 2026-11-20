// Démo « studio de jardin » (bureau / atelier au fond du jardin), 13.11.2026.
// Modèle 3D dédié (produits3d.js, `studio`) : ossature bois isolée, bardage, grande baie coulissante,
// fenêtres, toit plat ou monopente avec auvent, intérieur aménagé en bureau, terrasse bois en option.
// Pour les fabricants de studios / bureaux de jardin (voir configurateurs/A-LIRE.md).
// ⚠️ Tous les PRIX sont FICTIFS (ordre de grandeur du marché, à remplacer par les tarifs du fabricant).

export const CONFIG = {
  entreprise: {
    nom: 'Ihre Firma',
    activite: 'Gartenstudios & Gartenbüros',
    initiales: 'VE',
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Gartenstudio',
  demo: true,
  type: 'studio',
  modele3d: 'studio',
  chapo: 'Stellen Sie Ihr Gartenstudio Schritt für Schritt zusammen. Der Preis wird bei jeder Wahl aktualisiert.',
  libelles: {
    titre: 'Gartenstudio nach Mass',
    objet: 'Gartenstudio',
    passage: 'Höhe',
    largeur: 'Breite',
    largeurAide: 'Seite Glasfront',
    profondeur: 'Tiefe',
    profondeurAide: '',
    hauteur: 'Innenhöhe',
    hauteurAide: 'unter der Decke',
    implantationAide: 'Das Studio steht im Garten, auf einer kleinen Bodenplatte.',
    toiture: 'Dach',
    finition: 'Farbe der Fenster und Türen',
    finitionCourt: 'Fenster',
    finitionLigne: 'Fenster und Türen',
    parois: 'Fassaden und Glasfront',
    paroisCourt: 'Fassaden',
    paroisAide: 'Wählen Sie die Verkleidung. Mit dem Regler schieben Sie die Glasfront auf und sehen ins Innere.',
    bardage: 'Fassadenverkleidung',
    paroiLigne: 'Verkleidung',
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
    non: { label: 'Im Garten', aide: 'auf einer Bodenplatte' },
  },
  positionsLocal: { arriere: { label: 'Hinten' } },

  raccourcis: [
    { label: 'Büro 3 × 2,5 m', largeur: 3, profondeur: 2.5, hauteur: 2.4 },
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
    plat: { label: 'Flachdach', pente: 2, couvertures: ['vegetal', 'gravier', 'epdm'] },
    unPan: { label: 'Pultdach mit Vordach', pente: 6, couvertures: ['tole', 'epdm'] },
  },

  couvertures: {
    vegetal: { label: 'Begrüntes Dach', epaisseur: 0.06, teintes: { sedum: { label: 'Sedum', couleur: '#6E8A45' } } },
    gravier: { label: 'Kies', epaisseur: 0.05, teintes: { gris: { label: 'Grau', couleur: '#9A968E' } } },
    epdm: { label: 'EPDM-Abdichtung', epaisseur: 0.02, teintes: { noir: { label: 'Schwarz', couleur: '#2A2B2D' } } },
    tole: {
      label: 'Stehfalzblech', epaisseur: 0.02,
      teintes: {
        anthracite: { label: 'Anthrazit', couleur: '#3A3D40' },
        noir: { label: 'Schwarz', couleur: '#1F2022' },
        zinc: { label: 'Zink natur', couleur: '#9AA0A3' },
      },
    },
  },

  // Couleur des menuiseries, rives et baguettes (clé « bois » du moteur)
  bois: {
    anthracite: { label: 'Anthrazitgrau', couleur: '#3A3D40', facteur: 1 },
    noir: { label: 'Schwarz', couleur: '#1E1F21', facteur: 1.02 },
    blanc: { label: 'Weiss', couleur: '#E8E7E2', facteur: 1 },
  },

  bardages: {
    meleze: { label: 'Lärche natur, horizontal', couleur: '#B9875A', sens: 'horizontal', facteur: 1.1 },
    epicea: { label: 'Fichte natur, vertikal', couleur: '#D4AE7C', facteur: 1 },
    gris: { label: 'Vorvergrautes Holz', couleur: '#A19D95', facteur: 1.08 },
    noir: { label: 'Schwarzes Holz (geflammt)', couleur: '#2C2A28', facteur: 1.2 },
  },

  vehicules: { aucun: { label: 'Keines' } },

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
