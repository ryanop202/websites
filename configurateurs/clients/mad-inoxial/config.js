// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as piscine } from './produits/piscine.js';

const ENTREPRISE = {
  nom: 'MAD inoxial',
  activite: 'Piscines & spas en inox · Grolley',
  initiales: 'MI',
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'piscine': { label: 'Piscine inox', aide: 'Bassin en acier inoxydable sur mesure : escalier, margelles, plage et options.', icone: '<path d="M3 9h18v9H3zM6 12c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M7 9V5h2M7 7h2"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Piscine inox',
    libelles: { ...b.libelles, titre: 'Votre piscine en inox' },
    couvertures: { inox: { label: 'Acier inoxydable', metal: true, teintes: { brosse: { label: 'Inox brossé', couleur: '#C3C9CD', eau: '#42B9D4' }, poli: { label: 'Inox poli', couleur: '#DCE1E4', eau: '#47C2DC' } } } },
    toits: Object.fromEntries(Object.entries(b.toits).map(([id, t]) => [id, { ...t, couvertures: ['inox'] }])),
    defauts: { ...b.defauts, couverture: 'inox', teinteCouverture: 'brosse' },
  }))(piscine) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = "Composez votre piscine en acier inoxydable : pas d'hivernage, un entretien facile. Le prix suit chaque choix.";

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'piscine';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
