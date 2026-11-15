// Démo « studio de jardin » (fr) préparée pour Buchs Frères SA, 15.11.2026 (outils/demo-studio.py).
// Repris de buchs-freres.ch : En découvrant vos travaux de charpente sur votre site, j'ai eu une idée : vous montrer un configurateur 3D de studio de jardin à votre nom, un produit en bois qui compléterait bien votre offre. (vu le 15.11.2026). ⚠️ Tous les PRIX sont FICTIFS.
// Mise en ligne : `npx wrangler deploy` dans hebergement-demos/ (application unique, voir README).
import { CONFIG as base } from './produits/studio.js';

const produit = {
  ...base,
  entreprise: { nom: "Buchs Frères SA", activite: "Studios & bureaux de jardin", initiales: "BF", logo: '', email: '' },
  // Alertes à contact@wibzo.ch (démo utilisée, PDF, demande) : clé publique, faite pour le code de la page
  suivi: { cleWeb3Forms: '73b06b18-08c3-4c83-9ca8-42288a70dd2b' },
};

export const PRODUITS = {
  studio: { label: "Studio de jardin", aide: "Bureau, atelier ou pièce en plus au fond du jardin.", icone: "<path d=\"M3 20h18M5 20V9h14v11M3 9.5 12 5l9 4.5M9 20v-6h6v6\"/>", config: produit },
};

export const PRODUIT = 'studio';
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
