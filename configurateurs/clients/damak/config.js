// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as veranda } from './produits/veranda.js';
import { CONFIG as pergola_bio } from './produits/pergola-bio.js';

const ENTREPRISE = {
  nom: "DAMAK Wintergarten-Service",
  activite: 'Wintergärten, Markisen & Pergolen · Oensingen',
  initiales: "DW",
  logo: 'marque/logo.png',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'veranda': { label: 'Wintergarten', aide: 'Verglaster Raum aus Aluminium, an die Fassade angebaut, Markise optional.', icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    libellesOptions: { ...(b.libellesOptions ?? {}), storeToit: ['Wintergarten-Markise', 'auf dem Glasdach'] },
  }))(veranda) },
  'pergola-bio': { label: 'Pergola Lamellendach', aide: 'Alumil-Lamellendach: drehbare Alu-Lamellen, beständig bei Wind und Schneelast.', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Alumil Lamellendach',
    libelles: { ...b.libelles, titre: 'Alumil Pergola-Lamellendach' },
    couvertures: { lames: { ...b.couvertures.lames, label: 'Alumil Lamellendach, drehbare Lamellen' } },
  }))(pergola_bio) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Wintergarten oder Alumil-Lamellendach: Schritt für Schritt zusammenstellen.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'veranda';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
