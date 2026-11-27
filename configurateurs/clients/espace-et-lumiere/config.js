// Démo studio de jardin (français) préparée pour Espace & Lumière, 18.11.2026 (outils/demo-studio.py).
// Produit vu sur espace-et-lumiere.ch (vérifié par script le 13.11.2026). ⚠️ Tous les PRIX sont FICTIFS.
import { CONFIG as base } from './produits/studio.js';

export const CONFIG = {
  ...base,
  entreprise: { nom: "Espace & Lumière", activite: "Vérandas & studios de jardin", initiales: "EL", logo: '', email: '' },
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' }, // clé publique, faite pour le code de la page
  assistant: true,
  couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' },
};
