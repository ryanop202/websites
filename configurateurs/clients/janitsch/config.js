// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as carport } from './produits/carport.js';

const ENTREPRISE = {
  nom: "janitsch Holzbau AG",
  activite: 'Holzbau · Ersigen',
  initiales: "JH",
  logo: 'marque/logo.svg',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'carport': { label: 'Carport / Unterstand', aide: 'Holzkonstruktion für ein oder zwei Autos, Geräteraum optional.', icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Carport / Unterstand',
    libelles: { ...b.libelles, titre: 'Carport / Unterstand aus Holz' },
  }))(carport) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Carport oder Unterstand aus Holz: Masse, Dach und Holz wählen. Der Preis passt sich jeder Wahl an.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
