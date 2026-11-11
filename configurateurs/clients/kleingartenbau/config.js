// Démo ALLEMANDE préparée pour Kleingartenbau, 11.11.2026 (outils/demo-de.py, produit « pergola »).
// Repris de kleingartenbau.ch : produit « Holz-Pergola » trouvé sur le site (vérifié par script le 11.11.2026) (vu le 11.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/pergola.js';

const ENTREPRISE = {
  nom: "Kleingartenbau",
  activite: "Holzbau & Gartenbau",
  initiales: "K",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const produit = {
  ...base,
  entreprise: ENTREPRISE,
};

export const PRODUITS = {
  "pergola": { label: "Holz-Pergola", aide: "Eine Holzkonstruktion am Haus, auf der Terrasse, Sichtschutz optional.", icone: "<path d=\"M3 20h18M6 20V9M18 20V9M3 9h18M5 6h14M8 6v3M12 6v3M16 6v3\"/>", config: produit },
};

export const PRODUIT = "pergola";
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
