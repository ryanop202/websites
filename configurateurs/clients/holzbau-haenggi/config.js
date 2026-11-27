// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as studio } from './produits/studio.js';
import { CONFIG as terrasse } from './produits/terrasse.js';

const ENTREPRISE = {
  nom: "Holzbau Hänggi",
  activite: 'Holzbau & Terrassenböden · Zwingen',
  initiales: "HH",
  logo: 'marque/logo.svg',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'studio': { label: 'Gartenhaus', aide: 'Gartenhaus nach Mass: Masse, Dach, Fassade, Fenster und Ausstattung.', icone: '<path d="M3 20h18M5 20V10l7-5 7 5v10M10 20v-5h4v5"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
  }))(studio) },
  'terrasse': { label: 'Terrassenboden', aide: 'Terrassenboden aus Holz oder Holz-Kunststoff-Verbund (WPC).', icone: '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Terrassenboden',
    libelles: { ...b.libelles, titre: 'Terrassenboden nach Mass' },
    couvertures: { bois: b.couvertures.bois, composite: { ...b.couvertures.composite, label: 'Holz-Kunststoff-Verbund (WPC)' } },
    toits: { plat: { ...b.toits.plat, couvertures: ['bois', 'composite'] } },
    defauts: { ...b.defauts, couverture: 'bois', teinteCouverture: 'meleze' },
  }))(terrasse) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Gartenhaus oder Terrassenboden nach Mass: Schritt für Schritt zusammenstellen.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'studio';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
