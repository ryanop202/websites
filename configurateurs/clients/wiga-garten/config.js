// Démo ALLEMANDE préparée pour Wiga Gartenpflege & Gestaltung, 11.11.2026 (outils/demo-de.py, produit « piscine »).
// Repris de wiga.ch : produit « Pool » trouvé sur le site (vérifié par script le 11.11.2026) (vu le 11.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/piscine.js';

const ENTREPRISE = {
  nom: "Wiga Gartenpflege & Gestaltung",
  activite: "Pool- & Schwimmbadbau",
  initiales: "WG",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const produit = {
  ...base,
  entreprise: ENTREPRISE,
};

export const PRODUITS = {
  "piscine": { label: "Pool", aide: "Becken nach Mass, Treppe, Beckenrand, Umrandung und Optionen.", icone: "<path d=\"M3 9h18v9H3zM6 12c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M7 9V5h2M7 7h2\"/>", config: produit },
};

export const PRODUIT = "piscine";
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
