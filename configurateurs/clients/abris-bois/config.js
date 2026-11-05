// Démo Abris Bois - Tout en Bois Sàrl (Leysin) — refaite sur la nouvelle base le 04.11.2026.
// 2 produits, vérifiés sur leurs sites : carports (abrisbois.ch/carport) et pergolas sur mesure (touten-bois.ch/pergolas).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as carport } from './produits/carport.js';
import { CONFIG as pergola } from './produits/pergola.js';

const ENTREPRISE = {
  nom: 'Abris Bois',
  activite: 'Tout en Bois Sàrl · Leysin',
  initiales: 'AB',
  logo: 'marque/logo-abris-bois-200.png', // logo repris de abrisbois.ch
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const perso = (c, extra = {}) => ({ ...c, ...extra, entreprise: ENTREPRISE });

export const PRODUITS = {
  carport: {
    label: 'Carport', aide: 'Modèles Riviera 1 ou 2 places, toit 1 pan ou sur mesure, avec local de rangement en option.',
    icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: perso(carport),
  },
  pergola: {
    label: 'Pergola en bois', aide: 'Fabriquée sur mesure, contre la maison ou isolée, avec brise-vue en option.',
    icone: '<path d="M3 20h18M6 20V9M18 20V9M3 9h18M5 6h14M8 6v3M12 6v3M16 6v3"/>',
    config: perso(pergola, {
      chapo: 'Pergolas en bois fabriquées sur mesure à Leysin. Réglez la vôtre étape par étape, le prix se met à jour à chaque choix.',
    }),
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
// Vert d'Abris Bois (#77AD1B), assombri pour rester lisible en texte
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#4E7A12', 'plan-clair': '#EAF2DC' } };
