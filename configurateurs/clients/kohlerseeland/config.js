// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as carport } from './produits/carport.js';
import { CONFIG as terrasse } from './produits/terrasse.js';

const ENTREPRISE = {
  nom: "Kohler Seeland AG",
  activite: 'Holzbau, Schreinerei & Bedachungen · Jens',
  initiales: "KS",
  logo: 'marque/logo.webp',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'carport': { label: 'Carport / Unterstand', aide: 'Massgezimmerter Carport oder Unterstand, Geräteraum optional.', icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Carport / Unterstand',
    libelles: { ...b.libelles, titre: 'Carport / Unterstand nach Mass' },
  }))(carport) },
  'terrasse': { label: 'Terrassenboden', aide: 'Holz- oder WPC-Dielen, Stufen und Geländer.', icone: '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
  }))(terrasse) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Massgezimmert aus einer Hand: Holzbau, Bedachung und Spenglerei. Der Preis passt sich jeder Wahl an.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
