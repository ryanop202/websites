// Démo « studio de jardin » (13.11.2026) : même moteur que les carports, produit `studio` (voir produits/studio.js).
// Pour les fabricants de studios / bureaux de jardin. ⚠️ Tous les PRIX sont FICTIFS.
// Pas d'alerte e-mail (pas de clé Web3Forms) tant que la démo n'est pas en ligne.
import { CONFIG as studio } from './produits/studio.js';

export const CONFIG = { ...studio, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
