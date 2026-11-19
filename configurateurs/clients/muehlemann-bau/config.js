// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as veranda } from './produits/veranda.js';
import { CONFIG as carport } from './produits/carport.js';
import { CONFIG as pergola_bio } from './produits/pergola-bio.js';

const ENTREPRISE = {
  nom: "Mühlemann Bau GmbH",
  activite: 'Metallbau · Bubendorf',
  initiales: "MB",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'veranda': { label: 'Wintergarten & Glasraum', aide: 'Glasraum (unbeheizt) oder Wohnraumerweiterung (gedämmt) aus Glas und Metall.', icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Wintergarten / Glasraum',
    libelles: { ...b.libelles, titre: 'Wintergarten & Glasraum nach Mass', bardage: 'Ausführung' },
    bardages: {
      glasraum: { label: 'Glasraum, unbeheizt (saisonale Nutzung)', vitrage: true, facteur: 1 },
      wohnraum: { label: 'Wohnraumerweiterung, beheizt (gedämmte Konstruktion)', vitrage: true, facteur: 1.35 },
    },
    defauts: { ...b.defauts, bardage: 'glasraum' },
  }))(veranda) },
  'carport': { label: 'Carport', aide: 'Carport aus Metall, Aluminium oder Stahl, für ein oder zwei Autos.', icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,materiau: 'alu', produit: 'Metall-Carport',
    libelles: { ...b.libelles, titre: 'Metall-Carport nach Mass', finition: 'Farbe der Konstruktion', finitionCourt: 'Farbe', finitionLigne: 'Konstruktion', hauteurAide: 'unter der Konstruktion' },
    bois: { verzinkt: { label: 'Feuerverzinkt', couleur: '#A3A8AB', facteur: 1 }, anthrazit: { label: 'Anthrazit (RAL 7016)', couleur: '#3A3D40', facteur: 1.08 }, weiss: { label: 'Weiss (RAL 9016)', couleur: '#E8E7E2', facteur: 1.08 } },
    toits: { plat: { label: 'Flachdach', pente: 2, couvertures: ['tole', 'polycarbonate'] }, unPan: { label: 'Pultdach', pente: 8, couvertures: ['tole', 'polycarbonate'] } },
    defauts: { ...b.defauts, bois: 'verzinkt', toit: 'plat', couverture: 'tole', teinteCouverture: 'anthracite' },
  }))(carport) },
  'pergola-bio': { label: 'Pergola Lamellendach', aide: 'Pergola mit verstellbaren Lamellen für Licht und Schatten.', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
  }))(pergola_bio) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Wintergarten, Carport oder Pergola nach Mass für Basel und die Nordwestschweiz.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'veranda';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
