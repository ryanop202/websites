// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as veranda } from './produits/veranda.js';
import { CONFIG as pergola_bio } from './produits/pergola-bio.js';

const ENTREPRISE = {
  nom: "Simel Home",
  activite: 'Wintergärten & Pergolen · Zug',
  initiales: "SH",
  logo: 'marque/logo.avif',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'veranda': { label: 'Wintergarten', aide: 'Lichtdurchfluteter Wintergarten nach Mass, an Ihr Haus angebaut.', icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
  }))(veranda) },
  'pergola-bio': { label: 'Pergola', aide: 'Alu-Pergola mit Lamellendach, Glas, Seitenwänden und LED.', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Alu-Pergola',
    libelles: { ...b.libelles, titre: 'Pergola nach Mass' },
    bardages: { ...b.bardages, vitrage: { ...b.bardages.vitrage, label: 'Glas-Seitenwände' } },
  }))(pergola_bio) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Wintergarten oder Pergola nach Mass: Masse, Verglasung und Optionen wählen.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'veranda';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
