// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as terrasse } from './produits/terrasse.js';

const ENTREPRISE = {
  nom: 'Bull-Jardin SA',
  activite: 'Paysagiste en Gruyère · La Tour-de-Trême',
  initiales: 'BJ',
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'terrasse': { label: 'Terrasse', aide: 'Terrasse en bois ou en dalles, marches et garde-corps.', icone: '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    toits: { plat: { label: 'Plat', pente: 0, couvertures: ['bois', 'gres'] } },
    defauts: { ...b.defauts, couverture: 'bois', teinteCouverture: 'meleze' },
  }))(terrasse) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Votre terrasse par votre artisan paysagiste en Gruyère : bois ou dalles, marches et garde-corps.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'terrasse';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
