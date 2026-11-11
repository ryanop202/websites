// Démo ALLEMANDE préparée pour swisscarport.ch, 11.11.2026 (outils/demo-de.py, produit « carport »).
// Repris de swisscarport.ch : « Individuell nach Kundenwunsch geplante Carports », « Tragkonstruktion Holz oder Holz-Metall », Velo- und Geräteräume, Solarcarports (vu le 11.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/carport.js';

const ENTREPRISE = {
  nom: "swisscarport.ch",
  activite: "Carports nach Mass · Attiswil",
  initiales: "SC",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const produit = {
  ...base,
  entreprise: ENTREPRISE,
  couvertures: { ...base.couvertures, solaire: {"label": "Solarmodule (Photovoltaik)", "epaisseur": 0.04, "teintes": {"noir": {"label": "Schwarz", "couleur": "#1E2228"}}} },
  toits: { ...base.toits, plat: { ...base.toits.plat, couvertures: ['epdm', 'tole', 'solaire'] }, unPan: { ...base.toits.unPan, couvertures: ['tole', 'polycarbonate', 'solaire'] } },
  tarifs: { ...base.tarifs, couvertureM2: { ...base.tarifs.couvertureM2, solaire: 290 } },
};

export const PRODUITS = {
  carport: { label: "Carport", aide: "Offener Unterstand für ein oder zwei Autos, Geräteraum optional.", icone: "<path d=\"M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6\"/>", config: produit },
};

export const PRODUIT = "carport";
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
