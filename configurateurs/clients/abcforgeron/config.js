// Démo préparée pour ABC Forgeron Sàrl, 03.11.2026 (outils/demo-terrasse.ps1).
// Seulement leurs produits, vérifiés sur leur site. ⚠️ Tous les PRIX sont FICTIFS.
import { CONFIG as veranda } from './produits/veranda.js';

const ENTREPRISE = {
  nom: 'ABC Forgeron Sàrl',
  activite: 'Vérandas & ferronnerie · Collex',
  initiales: 'ABC',
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const perso = (c) => ({ ...c, entreprise: ENTREPRISE });

export const PRODUITS = {
  'veranda': { label: 'Véranda', aide: 'Une pièce vitrée en aluminium, accolée à la façade.', icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: perso(veranda) },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'veranda';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
