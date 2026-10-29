// Démo préparée pour SURTECH Sàrl (Ardon VS), 29.10.2026.
// Repris de surtech.ch/carport (vérifié le 29.10.2026) : carport aluminium sur mesure, « toit isolé renforcé »,
// option panneaux photovoltaïques, box fermé intégrable, structure autoportante ou adossée,
// évacuation des eaux intégrée dans les poteaux, fermeture latérale par clôture intégrée.
// Matériaux de l'entreprise : composite/alu, aluminium thermolaqué. Réalisations en anthracite (photos du site).
// ⚠️ Tous les PRIX sont FICTIFS. Teintes, dimensions et portée entre poteaux : à confirmer avec SURTECH.

export const CONFIG = {
  entreprise: {
    nom: 'SURTECH Sàrl',
    activite: 'Carports alu · Ardon (VS)',
    initiales: 'S',
    logo: 'marque/logo-surtech.png', // logo repris de surtech.ch
    email: '', // e-mail qui reçoit les demandes (vide = démo)
  },
  produit: 'Carport aluminium',
  materiau: 'alu',
  demo: true,
  badge: 'Démo préparée pour SURTECH · prix fictifs',
  chapo: 'Structure en aluminium thermolaqué, autoportante ou adossée, évacuation des eaux intégrée dans les poteaux. Le prix se met à jour à chaque choix.',
  libelles: {
    titre: 'Carport aluminium sur mesure',
    finition: 'Coloris de la structure',
    finitionCourt: 'Coloris',
    finitionLigne: 'Structure',
    bardage: 'Fermeture : lames de clôture intégrée',
    rangement: 'Box fermé',
    rangementLigne: 'Box fermé',
    rangementCourt: 'Box',
  },
  // Pas de gouttière : l'eau descend dans les poteaux. LED et borne non mentionnées sur leur site.
  equipements: [],
  inclus: ['évacuation des eaux intégrée dans les poteaux'],
  // Bois du « S » du logo, assombri pour rester lisible en texte
  couleurs: { plan: '#7A4A22', 'plan-clair': '#F1E7DC' },
  // Notifications par e-mail à Ryan (utilisation de la démo, PDF, demandes)
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page

  // [min, max, pas] en mètres
  limites: {
    largeur: [2.8, 7, 0.1],
    profondeur: [4.5, 7, 0.1],
    hauteur: [2.1, 2.7, 0.05],
  },
  porteeMax: 5.8, // poteaux aux coins seulement jusqu'à ~6 m (comme sur leurs photos) ; distance max entre deux poteaux (règle technique, à valider par l'entreprise)
  profondeursLocal: [1.2, 1.8, 2.4],

  implantations: {
    non: { label: 'Autoportant', aide: '4 côtés libres' },
    gauche: { label: 'Adossé', aide: 'façade à gauche' },
    droite: { label: 'Adossé', aide: 'façade à droite' },
  },
  positionsLocal: {
    arriere: { label: 'Arrière' },
    gauche: { label: 'Gauche' },
    droite: { label: 'Droite' },
  },

  // Tailles courantes (SURTECH ne publie pas de dimensions)
  raccourcis: [
    { label: '1 voiture', largeur: 3.2, profondeur: 5.2, hauteur: 2.3, rangement: false, vehicule: 'citadine' },
    { label: '1 SUV', largeur: 3.6, profondeur: 5.6, hauteur: 2.3, rangement: false, vehicule: 'suv' },
    { label: '2 voitures', largeur: 5.8, profondeur: 5.4, hauteur: 2.3, rangement: false, vehicule: 'citadine' },
    { label: '1 voiture + box', largeur: 3.4, profondeur: 5.4, hauteur: 2.3, rangement: true, posLocal: 'arriere', vehicule: 'suv' },
  ],

  defauts: {
    largeur: 3.6,
    profondeur: 5.6,
    hauteur: 2.3,
    adosse: 'non',
    toit: 'plat',
    couverture: 'panneau',
    teinteCouverture: 'anthracite',
    bois: 'anthracite',
    paroiArriere: false,
    paroiGauche: false,
    paroiDroite: true,
    bardage: 'compositeBois',
    rangement: false,
    posLocal: 'arriere',
    profLocal: 1.8,
    gouttieres: false,
    led: false,
    borne: false,
    vehicule: 'suv',
  },

  toits: {
    plat: { label: 'Plat', pente: 2, couvertures: ['panneau', 'solaire'] },
  },

  couvertures: {
    panneau: {
      label: 'Toit isolé renforcé', epaisseur: 0.06,
      teintes: {
        anthracite: { label: 'Anthracite', couleur: '#3E4145' },
        gris: { label: 'Gris clair', couleur: '#A9ADB0' },
      },
    },
    solaire: {
      label: 'Panneaux photovoltaïques', epaisseur: 0.045,
      teintes: { noir: { label: 'Noir', couleur: '#141A24' } },
    },
  },

  // Ici : coloris de l'aluminium thermolaqué (la clé « bois » est celle lue par le moteur)
  bois: {
    anthracite: { label: 'Alu anthracite', couleur: '#3A3D41', facteur: 1 },
    gris: { label: 'Alu gris clair', couleur: '#A7AAAD', facteur: 1 },
    blanc: { label: 'Alu blanc', couleur: '#E9E9E6', facteur: 1 },
  },

  // Lames horizontales de clôture (composite), avec leur propre teinte
  bardages: {
    compositeBois: { label: 'Composite bois', couleur: '#8A5B38', sens: 'horizontal', facteur: 1 },
    compositeAnthracite: { label: 'Composite anthracite', couleur: '#3F4246', sens: 'horizontal', facteur: 1 },
    compositeGris: { label: 'Composite gris', couleur: '#8E8C87', sens: 'horizontal', facteur: 1 },
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
    structureM2: { plat: 360 },
    couvertureM2: { panneau: 95, solaire: 290 },
    paroiM2: 135,
    rangementM2: 540, // box fermé, porte comprise
    adosseFacteur: 0.88, // structure contre une façade : une rangée de poteaux en moins
    fixationMl: 60, // profil fixé à la façade + solin
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
