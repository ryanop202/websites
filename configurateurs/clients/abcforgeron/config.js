// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as veranda } from './produits/veranda.js';

const ENTREPRISE = {
  nom: 'ABC Forgeron Sàrl',
  activite: 'Vérandas & ferronnerie · Collex',
  initiales: 'ABC',
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'veranda': { label: 'Véranda', aide: 'Véranda ou jardin d’hiver, toiture vitrée ou couverture de terrasse.', icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Véranda SUNPARADISE',
    libelles: { ...b.libelles, titre: 'Véranda & jardin d’hiver sur mesure' },
  }))(veranda) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Votre véranda ou jardin d’hiver sur mesure, de la gamme SUNPARADISE.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'veranda';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
