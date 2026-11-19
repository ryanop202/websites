// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as pergola_bio } from './produits/pergola-bio.js';

const ENTREPRISE = {
  nom: 'Aquinox Sàrl',
  activite: 'Stores & pergolas · Saxon',
  initiales: 'AQ',
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'pergola-bio': { label: 'Pergola bioclimatique', aide: 'Lames orientables pour un confort toute l’année, stores, portes coulissantes et LED.', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    bardages: { screen: { ...b.bardages.screen, label: 'Store toile' }, vitrage: { ...b.bardages.vitrage, label: 'Portes coulissantes' } },
    libellesOptions: { led: ['Système LED intégré', ''] },
  }))(pergola_bio) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Votre pergola bioclimatique à lames orientables : stores, portes coulissantes et LED en option.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'pergola-bio';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
