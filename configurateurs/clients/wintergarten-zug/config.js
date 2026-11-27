// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as veranda } from './produits/veranda.js';

const ENTREPRISE = {
  nom: "Wintergarten Zug",
  activite: 'Wintergärten & Sommergärten · Zug',
  initiales: "WZ",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'veranda': { label: 'Wintergarten / Sommergarten', aide: 'Alu-Konstruktion am Haus: beheizbarer Wintergarten oder Sommergarten.', icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Wintergarten / Sommergarten',
    libelles: { ...b.libelles, titre: 'Wintergarten oder Sommergarten', bardage: 'Ausführung', parois: 'Verglasung und Front', paroisAide: 'Die Front ist meist in vier Teile geteilt: links und rechts Festverglasung, in der Mitte zwei PSK-Türen (Parallel-Schiebe-Kipp).' },
    bardages: {
      kalt: { label: 'Sommergarten (kalt): VSG-Dach, ESG-Seiten', vitrage: true, facteur: 1 },
      warm: { label: 'Wintergarten (warm): Doppel- oder Dreifachverglasung, Profile mit Isolationseinsatz', vitrage: true, facteur: 1.35 },
    },
    defauts: { ...b.defauts, bardage: 'warm' },
  }))(veranda) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Wintergarten (warm) oder Sommergarten (kalt): wählen Sie Ausführung, Masse und Verglasung.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'veranda';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
