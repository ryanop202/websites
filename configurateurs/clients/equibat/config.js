// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as pergola_bio } from './produits/pergola-bio.js';
import { CONFIG as carport } from './produits/carport.js';

const ENTREPRISE = {
  nom: 'Equibat SA',
  activite: 'Pergolas & carports · Alle',
  initiales: 'EQ',
  logo: 'marque/logo.jpg',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'pergola-bio': { label: 'Pergola bioclimatique', aide: 'Lames alu orientables pour régler soleil et ventilation, stores en option.', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
  }))(pergola_bio) },
  'carport': { label: 'Carport alu', aide: 'Structure aluminium, toiture en panneaux autoportants en aluminium isolé.', icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    materiau: 'alu', produit: 'Carport alu',
    libelles: { ...b.libelles, titre: 'Carport alu sur mesure', finition: 'Teinte de la structure', finitionCourt: 'Teinte', finitionLigne: 'Structure' },
    bois: { anthracite: { label: 'Anthracite (RAL 7016)', couleur: '#3A3D40', facteur: 1 }, blanc: { label: 'Blanc (RAL 9016)', couleur: '#E8E7E2', facteur: 1 }, noir: { label: 'Noir (RAL 9005)', couleur: '#1E1F21', facteur: 1 }, ral: { label: 'Autre teinte RAL', couleur: '#7A6F62', facteur: 1.05 } },
    toits: { plat: { label: 'Plat', pente: 2, couvertures: ['tole'] } },
    couvertures: { ...b.couvertures, tole: { ...b.couvertures.tole, label: 'Panneaux autoportants en aluminium isolé' } },
    defauts: { ...b.defauts, bois: 'anthracite', toit: 'plat', couverture: 'tole', teinteCouverture: 'anthracite' },
  }))(carport) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Pergola bioclimatique ou carport alu : composez votre projet, le prix suit chaque choix.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'pergola-bio';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
