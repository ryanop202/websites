// Démo « studio de jardin » (de) préparée pour Meyer H. Zimmerei + Chaletbau AG, 15.11.2026 (outils/demo-studio.py).
// Repris de meyerzimmereiag.ch : Auf Ihrer Website habe ich gesehen, dass Sie im Holzbau tätig sind. Ein Gartenstudio aus Holz würde gut zu Ihrem Angebot passen. (vu le 15.11.2026). ⚠️ Tous les PRIX sont FICTIFS.
// Mise en ligne : `npx wrangler deploy` dans hebergement-demos/ (application unique, voir README).
import { CONFIG as base } from './produits/studio.js';

const produit = {
  ...base,
  entreprise: { nom: "Meyer H. Zimmerei + Chaletbau AG", activite: "Gartenstudios & Holzbau", initiales: "MH", logo: '', email: '' },
  // Alertes à contact@wibzo.ch (démo utilisée, PDF, demande) : clé publique, faite pour le code de la page
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' },
};

export const PRODUITS = {
  studio: { label: "Gartenstudio", aide: "Büro, Atelier oder zusätzlicher Raum im Garten.", icone: "<path d=\"M3 20h18M5 20V9h14v11M3 9.5 12 5l9 4.5M9 20v-6h6v6\"/>", config: produit },
};

export const PRODUIT = 'studio';
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
