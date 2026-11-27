// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as carport } from './produits/carport.js';

const ENTREPRISE = {
  nom: "Haussener Dach & Holzbau AG",
  activite: 'Dach & Holzbau · Solaranlagen',
  initiales: "HD",
  logo: 'marque/logo.png',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'carport': { label: 'Carport', aide: 'Holz-Carport, auch mit Solardach (Photovoltaik).', icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    couvertures: { ...b.couvertures, solaire: { label: 'Solarmodule (Photovoltaik)', epaisseur: 0.04, teintes: { noir: { label: 'Schwarz', couleur: '#1E2228' } } } },
    toits: { ...b.toits, plat: { ...b.toits.plat, couvertures: ['epdm', 'tole', 'solaire'] }, unPan: { ...b.toits.unPan, couvertures: ['tole', 'polycarbonate', 'solaire'] } },
    tarifs: { ...b.tarifs, couvertureM2: { ...b.tarifs.couvertureM2, solaire: 290 } },
    defauts: { ...b.defauts, toit: 'unPan', couverture: 'solaire', teinteCouverture: 'noir' },
  }))(carport) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Holz-Carport mit Ziegel-, Blech- oder Solardach: alles aus einer Hand.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
