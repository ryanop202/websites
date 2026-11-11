// Démo ALLEMANDE préparée pour Di Nicola Metallbau AG, 11.11.2026 (outils/demo-de.py, produit « pergola-bio »).
// Repris de dinicola-metallbau.ch : produit « Lamellendach » trouvé sur le site (vérifié par script le 11.11.2026) (vu le 11.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/pergola-bio.js';

const ENTREPRISE = {
  nom: "Di Nicola Metallbau AG",
  activite: "Lamellendächer & Sonnenschutz",
  initiales: "DN",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const produit = {
  ...base,
  entreprise: ENTREPRISE,
};

export const PRODUITS = {
  "pergola-bio": { label: "Lamellendach", aide: "Drehbare Alu-Lamellen für Sonne und Lüftung, Seitenabschlüsse optional.", icone: "<path d=\"M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1\"/>", config: produit },
};

export const PRODUIT = "pergola-bio";
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
