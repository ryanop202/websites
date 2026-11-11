// Démo ALLEMANDE préparée pour Wahl Glas- und Metallbau AG, 11.11.2026 (outils/demo-de.py, produit « veranda »).
// Repris de wahl-ag.ch : produit « Wintergarten » trouvé sur le site (vérifié par script le 11.11.2026) (vu le 11.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/veranda.js';

const ENTREPRISE = {
  nom: "Wahl Glas- und Metallbau AG",
  activite: "Wintergärten & Verglasungen",
  initiales: "WG",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const produit = {
  ...base,
  entreprise: ENTREPRISE,
};

export const PRODUITS = {
  "veranda": { label: "Wintergarten", aide: "Verglaster Raum aus Aluminium, an die Fassade angebaut.", icone: "<path d=\"M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7\"/>", config: produit },
};

export const PRODUIT = "veranda";
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
