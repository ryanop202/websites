// Démo ALLEMANDE préparée pour Fünfschilling AG, 11.11.2026 (outils/demo-de.py, produit « carport »).
// Repris de fuenfschilling.ch : produit « Carport » trouvé sur le site (vérifié par script le 11.11.2026) (vu le 11.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/carport.js';

const ENTREPRISE = {
  nom: "Fünfschilling AG",
  activite: "Holzbau & Carports",
  initiales: "F",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const produit = {
  ...base,
  entreprise: ENTREPRISE,
  materiau: 'alu',
  produit: "Stahl-Carport",
  libelles: { ...base.libelles, ...{"titre": "Stahl-Carport nach Mass", "finition": "Farbe der Konstruktion", "finitionCourt": "Farbe", "finitionLigne": "Konstruktion", "hauteurAide": "unter der Konstruktion", "implantationAide": "Am Haus wird der Carport an der Fassade befestigt: eine Pfostenreihe weniger."} },
  bois: {"verzinkt": {"label": "Feuerverzinkt", "couleur": "#A3A8AB", "facteur": 1}, "anthrazit": {"label": "Anthrazit (RAL 7016)", "couleur": "#3A3D40", "facteur": 1.08}, "weiss": {"label": "Weiss (RAL 9016)", "couleur": "#E8E7E2", "facteur": 1.08}},
  toits: {"plat": {"label": "Flachdach", "pente": 2, "couvertures": ["tole", "polycarbonate"]}, "unPan": {"label": "Pultdach", "pente": 8, "couvertures": ["tole", "polycarbonate"]}},
  defauts: { ...base.defauts, ...{"bois": "verzinkt", "toit": "plat", "couverture": "tole", "teinteCouverture": "anthracite"} },
};

export const PRODUITS = {
  "carport": { label: "Carport", aide: "Offener Unterstand für ein oder zwei Autos, Geräteraum optional.", icone: "<path d=\"M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6\"/>", config: produit },
};

export const PRODUIT = "carport";
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
