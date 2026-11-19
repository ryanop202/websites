// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as pergola_bio } from './produits/pergola-bio.js';

const ENTREPRISE = {
  nom: "Wisobau GmbH",
  activite: 'Lamellendächer & Sonnenschutz · Aargau',
  initiales: "W",
  logo: 'marque/logo.png',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'pergola-bio': { label: 'Lamaxa Lamellendach', aide: 'Drehbare Aluminiumlamellen, freistehend oder wandmontiert (Lamaxa L50, L60, L70).', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Lamaxa Lamellendach',
    libelles: { ...b.libelles, titre: 'Lamaxa Lamellendach nach Mass' },
    couvertures: { lames: { ...b.couvertures.lames, label: 'Lamaxa: drehbare Alu-Lamellen (L50, L60 oder L70)' } },
    bardages: { screen: { ...b.bardages.screen, label: 'ZIP-Screen' }, vitrage: { ...b.bardages.vitrage, label: 'Glas-Schiebeelemente' } },
    libellesOptions: { chauffage: ['Heizstrahler', ''] },
  }))(pergola_bio) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Ihr Lamaxa-Lamellendach: freistehend oder am Haus, mit ZIP-Screens, Glas-Schiebeelementen, LED und Heizstrahlern.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'pergola-bio';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
