// Tout ce qui change d'une promotion à l'autre.
// Source des lots : tableau de la promotion sur berra-immobilier.ch (lu le 12.11.2026).
// ⚠️ Démo : la place des lots dans les immeubles est estimée (plans non publiés).

export const PROJET = {
  nom: 'Le Clos des Forges',
  sousTitre: '46 appartements de 3.5 et 4.5 pièces',
  lieu: 'Rue des Forges 7 · 1957 Ardon (VS)',
  livraison: 'Livraison entre mai et juillet 2027',
  promoteur: 'Berra Immobilier SA',
  logo: 'img/logo-berra.png',
  contactNom: 'Cyril Bieckens',
  telephone: '079 464 11 35',
  email: 'cy@berra-immobilier.ch',
  parking: 'Places de parc en supplément : extérieure CHF 16’000.–, intérieure CHF 30’000.–, garage box CHF 40’000.–.',
  atouts: ['Orientation plein sud', 'Piscine extérieure de 124 m²', 'Carnotzets', 'Ascenseur', 'Finitions au gré du preneur'],
  totalAppartements: 46,
  // Position pour le soleil (Ardon)
  latitude: 46.21,
  longitude: 7.25,
  couleurs: { marque: '#2e3532', marqueFonce: '#1f2523', or: '#39aa71' },
};

export const NIVEAUX = ['Rez-de-jardin', '1er étage', 'Attique'];
export const NIVEAUX_COURTS = ['Rez', '1er', 'Attique'];

// Lots publiés par Berra (15 lots). statut : dispo / reserve / vendu. variante : autre typologie possible.
export const LOTS = [
  { lot: 'A1', pieces: '4.5', surface: 141, niveau: 0, prix: 795000, statut: 'dispo' },
  { lot: 'A2', pieces: '4.5', surface: 141, niveau: 1, prix: 740000, statut: 'dispo' },
  { lot: 'A4', pieces: '3.5', surface: 122, niveau: 0, prix: 640000, statut: 'dispo', variante: '4.5 pièces possible' },
  { lot: 'C4', pieces: '4.5', surface: 141, niveau: 0, prix: 770000, statut: 'dispo' },
  { lot: 'D5', pieces: '3.5', surface: 115, niveau: 1, prix: 0, statut: 'reserve', variante: '4.5 pièces possible' },
  { lot: 'E1', pieces: '3.5', surface: 120, niveau: 0, prix: 0, statut: 'reserve' },
  { lot: 'E2', pieces: '3.5', surface: 120, niveau: 1, prix: 0, statut: 'reserve' },
  { lot: 'E3', pieces: '3.5', surface: 119, niveau: 2, prix: 0, statut: 'reserve' },
  { lot: 'E4', pieces: '3.5', surface: 120, niveau: 0, prix: 620000, statut: 'dispo' },
  { lot: 'E5', pieces: '3.5', surface: 120, niveau: 1, prix: 590000, statut: 'dispo' },
  { lot: 'E6', pieces: '3.5', surface: 120, niveau: 2, prix: 600000, statut: 'dispo' },
  { lot: 'E7', pieces: '3.5', surface: 131, niveau: 0, prix: 680000, statut: 'dispo', variante: '4.5 pièces possible' },
  { lot: 'E8', pieces: '3.5', surface: 131, niveau: 1, prix: 660000, statut: 'dispo' },
  { lot: 'F1', pieces: '3.5', surface: 116, niveau: 0, prix: 630000, statut: 'dispo' },
  { lot: 'F2', pieces: '3.5', surface: 116, niveau: 1, prix: 0, statut: 'vendu' },
].map((l) => ({ ...l, expo: 'Sud' }));

// Galerie : images de l'annonce de la promotion (Berra Immobilier SA)
export const IMAGES = [
  ['pignon', 'Visualisation d’un immeuble'],
  ['facade-sud', 'Visualisation, façades sud'],
  ['vue-aerienne', 'Maquette du projet vue du ciel'],
  ['falaise', 'Visualisation, au pied des rochers'],
  ['allee', 'Visualisation, allée centrale'],
  ['parking', 'Visualisation, accès et parking'],
  ['vue-plaine', 'Le projet dans le village'],
  ['vue-drone', 'Le projet dans le village, vue aérienne'],
  ['situation', 'Situation à Ardon'],
  ['cuisine', 'Cuisine (image de l’annonce)'],
  ['salle-de-bain', 'Salle de bain (image de l’annonce)'],
  ['chantier', 'Le chantier'],
];
