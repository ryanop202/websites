// Démo préparée pour Lejan EG Sàrl, 03.11.2026, refaite le 25.11.2026 avec LEURS modèles,
// vus sur leurs réalisations (lejaneg.ch/nos-realisations, lu le 25.11.2026) : véranda alu à toit verre et baies coulissantes,
// pergola bioclimatique, pergola à toile rétractable, toit de terrasse en verre. Alu anthracite et LED, comme sur leurs chantiers.
// ⚠️ Tous les PRIX sont FICTIFS.
import { CONFIG as veranda } from './produits/veranda.js';
import { CONFIG as pergolaBio } from './produits/pergola-bio.js';
import { CONFIG as pergolaToile } from './produits/pergola-toile.js';
import { CONFIG as toitVerre } from './produits/toit-verre.js';

const ENTREPRISE = {
  nom: 'Lejan EG Sàrl',
  activite: 'Vérandas, pergolas & fenêtres · Monthey',
  initiales: 'LE',
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const perso = (c) => ({ ...c, entreprise: ENTREPRISE });

export const PRODUITS = {
  'veranda': { label: 'Véranda', aide: 'Pièce vitrée en alu, toit en verre et baies coulissantes.', icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: perso(veranda) },
  'pergola-bio': { label: 'Pergola bioclimatique', aide: 'Lames alu orientables, LED d’ambiance, stores en option.', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: perso(pergolaBio) },
  'pergola-toile': { label: 'Pergola à toile', aide: 'Toile rétractable motorisée sur structure alu, spots LED.', icone: '<path d="M3 20h18M5 20V9M19 20V9M3 9c3-3 15-3 18 0M7 9v-1M12 9V7.5M17 9v-1"/>', config: perso(pergolaToile) },
  'toit-verre': { label: 'Toit de terrasse en verre', aide: 'Toiture vitrée sur poteaux alu, parois vitrées en option.', icone: '<path d="M3 20h18M5 20V9M19 20V7M3 9.5L21 6.5M8 9v-1.5M13 8.2V6.8"/>', config: perso(toitVerre) },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'veranda';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
