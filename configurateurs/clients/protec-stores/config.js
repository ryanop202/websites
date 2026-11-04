// Démo préparée pour Protec Stores Volets Sàrl, 03.11.2026 (outils/demo-terrasse.ps1).
// Seulement leurs produits, vérifiés sur leur site. ⚠️ Tous les PRIX sont FICTIFS.
import { CONFIG as pergolaBio } from './produits/pergola-bio.js';

const ENTREPRISE = {
  nom: 'Protec Stores Volets Sàrl',
  activite: 'Stores & pergolas · Romont',
  initiales: 'PS',
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const perso = (c) => ({ ...c, entreprise: ENTREPRISE });

export const PRODUITS = {
  'pergola-bio': { label: 'Pergola bioclimatique', aide: 'Lames alu orientables pour régler soleil et ventilation, stores en option.', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: perso(pergolaBio) },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'pergola-bio';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
