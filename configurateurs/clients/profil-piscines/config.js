// Démo préparée pour Profil Piscines, 05.11.2026 (outils/demo-piscine.py, produit « piscine »).
// Repris de profilpiscines.ch : « Piscine et Jacuzzi sur mesure de qualité » (vérifié le 05.11.2026). Seulement leurs revêtements quand le site les nomme.
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les teintes (exemples). Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/piscine.js';

const ENTREPRISE = {
  nom: 'Profil Piscines',
  activite: 'Piscines & jacuzzis sur mesure · Martigny',
  initiales: 'PP',
  logo: 'marque/logo.jpeg',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const piscine = {
  ...base,
  entreprise: ENTREPRISE,
};

export const PRODUITS = {
  piscine: {
    label: 'Piscine', aide: 'Bassin sur mesure, escalier, margelles, plage et options.',
    icone: '<path d="M3 9h18v9H3zM6 12c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M7 9V5h2M7 7h2"/>', config: piscine,
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'piscine';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
