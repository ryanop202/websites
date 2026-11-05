// Démo Sirbatec SA passée sur la nouvelle base le 04.11.2026 (décor réaliste, assistant par étapes).
// Un seul produit : le couvert à voitures. Réglages, logo et couleurs : produits/carport.js. ⚠️ Tous les PRIX sont FICTIFS.
// Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as carport } from './produits/carport.js';

export const PRODUITS = {
  carport: {
    label: 'Couvert à voitures', aide: 'Simple ou double, en bois suisse certifié, avec local de rangement en option.',
    icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: carport,
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true };
