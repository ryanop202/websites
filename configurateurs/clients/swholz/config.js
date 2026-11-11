// Démo ALLEMANDE préparée pour Schwitter & Wieland, 11.11.2026 (outils/demo-de.py, produit « carport »).
// Repris de swholz.ch : produit « Carport » trouvé sur le site (vérifié par script le 11.11.2026) (vu le 11.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/carport.js';

const ENTREPRISE = {
  nom: "Schwitter & Wieland",
  activite: "Holzbau & Carports",
  initiales: "SW",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const produit = {
  ...base,
  entreprise: ENTREPRISE,
};

export const PRODUITS = {
  "carport": { label: "Carport", aide: "Offener Unterstand für ein oder zwei Autos, Geräteraum optional.", icone: "<path d=\"M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6\"/>", config: produit },
};

export const PRODUIT = "carport";
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
