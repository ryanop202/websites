// Démo ALLEMANDE préparée pour Josef Lehmann Holzbau AG, 11.11.2026 (outils/demo-de.py, produit « terrasse »).
// Repris de lehmann-schneisingen.ch : produit « Terrasse » trouvé sur le site (vérifié par script le 11.11.2026) (vu le 11.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/terrasse.js';

const ENTREPRISE = {
  nom: "Josef Lehmann Holzbau AG",
  activite: "Terrassen & Gartenbau",
  initiales: "JL",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const produit = {
  ...base,
  entreprise: ENTREPRISE,
};

export const PRODUITS = {
  "terrasse": { label: "Terrasse", aide: "Holz- oder WPC-Dielen, Feinsteinzeug, Stufen und Geländer.", icone: "<path d=\"M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8\"/>", config: produit },
};

export const PRODUIT = "terrasse";
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
