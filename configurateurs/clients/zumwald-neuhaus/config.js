// Démo studio de jardin (allemand) préparée pour Zumwald und Neuhaus AG, 18.11.2026 (outils/demo-studio.py).
// Produit vu sur zumwald-neuhaus.ch (vérifié par script le 13.11.2026). ⚠️ Tous les PRIX sont FICTIFS.
import { CONFIG as base } from './produits/studio.js';

export const CONFIG = {
  ...base,
  entreprise: { nom: "Zumwald und Neuhaus AG", activite: "Holzbau & Gartenhäuser", initiales: "ZN", logo: '', email: '' },
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  assistant: true,
  couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' },
};
