// Tout ce qui change d'une promotion à l'autre est ici.
// Données reprises de glauserimmo.ch (annonce « 3,5 pièces neuf | Centre du village » et tableau des lots), lues le 12.11.2026.
// ⚠️ La position des lots dans l'immeuble est INVENTÉE pour la démo : avec un vrai client, on la reprend des plans d'architecte.

export const PROJET = {
  nom: 'Le Bourg de Siviriez',
  sousTitre: '25 appartements du studio au 5.5 pièces',
  lieu: 'Centre du village · 1678 Siviriez (FR)',
  livraison: 'Livraison automne 2028',
  promoteur: 'Glauser Immobilier SA',
  logo: 'img/logo-glauser.png',
  telephone: '021 977 22 77',
  email: 'info@glauserimmo.ch',
  site: 'glauserimmo.ch',
  parking: "Place de parc intérieure en sus : CHF 30'000.–",
  couleurs: { marque: '#a3161c', marqueFonce: '#6f0f13', or: '#b08d57' },
};

// statut : 'dispo' | 'reserve' | 'vendu'
// aile : 'A' (aile longue, façade sud) ou 'B' (aile en retour, façade ouest)
// L'ordre dans chaque aile = l'ordre dans l'immeuble (depuis l'angle ouest pour A, depuis l'angle pour B)
export const LOTS = [
  // Rez inférieur (studios, côté pente)
  { lot: 1,  niveau: 0, aile: 'A', pieces: 'Studio', surface: 38,  prix: 250000, statut: 'dispo' },
  { lot: 2,  niveau: 0, aile: 'A', pieces: 'Studio', surface: 27,  prix: 185000, statut: 'reserve' },
  { lot: 3,  niveau: 0, aile: 'A', pieces: 'Studio', surface: 42,  prix: 275000, statut: 'dispo' },
  { lot: 4,  niveau: 0, aile: 'A', pieces: 'Studio', surface: 40,  prix: 260000, statut: 'vendu' },
  { lot: 5,  niveau: 0, aile: 'A', pieces: 'Studio', surface: 29,  prix: 185000, statut: 'vendu' },
  // Rez-de-chaussée
  { lot: 6,  niveau: 1, aile: 'A', pieces: '3.5', surface: 85,  prix: 540000, statut: 'reserve' },
  { lot: 7,  niveau: 1, aile: 'A', pieces: '4.5', surface: 108, prix: 640000, statut: 'dispo' },
  { lot: 8,  niveau: 1, aile: 'A', pieces: '4.5', surface: 109, prix: 630000, statut: 'dispo' },
  { lot: 9,  niveau: 1, aile: 'A', pieces: '2.5', surface: 53,  prix: 335000, statut: 'reserve' },
  { lot: 10, niveau: 1, aile: 'B', pieces: '3.5', surface: 85,  prix: 550000, statut: 'dispo' },
  { lot: 11, niveau: 1, aile: 'B', pieces: '5.5', surface: 123, prix: 795000, statut: 'dispo' },
  // 1er étage
  { lot: 12, niveau: 2, aile: 'A', pieces: '3.5', surface: 85,  prix: 505000, statut: 'dispo' },
  { lot: 13, niveau: 2, aile: 'A', pieces: '4.5', surface: 109, prix: 640000, statut: 'dispo' },
  { lot: 14, niveau: 2, aile: 'A', pieces: '4.5', surface: 109, prix: 630000, statut: 'dispo' },
  { lot: 15, niveau: 2, aile: 'A', pieces: '2.5', surface: 76,  prix: 450000, statut: 'dispo' },
  { lot: 16, niveau: 2, aile: 'B', pieces: '2.5', surface: 53,  prix: 330000, statut: 'reserve' },
  { lot: 17, niveau: 2, aile: 'B', pieces: '3.5', surface: 85,  prix: 515000, statut: 'dispo' },
  { lot: 18, niveau: 2, aile: 'B', pieces: '4.5', surface: 108, prix: 665000, statut: 'dispo' },
  // 2e étage
  { lot: 19, niveau: 3, aile: 'A', pieces: '3.5', surface: 85,  prix: 510000, statut: 'reserve' },
  { lot: 20, niveau: 3, aile: 'A', pieces: '4.5', surface: 108, prix: 645000, statut: 'dispo' },
  { lot: 21, niveau: 3, aile: 'A', pieces: '4.5', surface: 109, prix: 635000, statut: 'dispo' },
  { lot: 22, niveau: 3, aile: 'A', pieces: '2.5', surface: 76,  prix: 455000, statut: 'dispo' },
  { lot: 23, niveau: 3, aile: 'B', pieces: '2.5', surface: 53,  prix: 335000, statut: 'reserve' },
  { lot: 24, niveau: 3, aile: 'B', pieces: '3.5', surface: 85,  prix: 520000, statut: 'dispo' },
  { lot: 25, niveau: 3, aile: 'B', pieces: '4.5', surface: 108, prix: 675000, statut: 'dispo' },
];

export const NIVEAUX = ['Rez inférieur', 'Rez-de-chaussée', '1er étage', '2e étage'];
export const NIVEAUX_COURTS = ['Rez inf.', 'Rez', '1er', '2e'];
