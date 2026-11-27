// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as veranda } from './produits/veranda.js';
import { CONFIG as pergola_bio } from './produits/pergola-bio.js';

const ENTREPRISE = {
  nom: 'AC Aluminium Créations SA',
  activite: 'Vérandas & pergolas alu · Yverdon-les-Bains',
  initiales: 'AC',
  logo: 'marque/logo.png',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'veranda': { label: 'Véranda', aide: 'Glass line (toit en pente ou vitré) ou Kreativ line (toit plat).', icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Véranda',
    toits: { unPan: { ...b.toits.unPan, label: 'Glass line (toit en pente)' }, plat: { ...b.toits.plat, label: 'Kreativ line (toit plat)' } },
  }))(veranda) },
  'pergola-bio': { label: 'Pergola Umbris', aide: 'Pergola bioclimatique à lames orientables, toiture jusqu’à 7 m sans poteau intermédiaire.', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Pergola Umbris',
    libelles: { ...b.libelles, titre: 'Pergola bioclimatique Umbris' },
    couvertures: { lames: { ...b.couvertures.lames, label: 'Umbris : lames orientables, moteur invisible' } },
    bardages: { screen: { ...b.bardages.screen, label: 'Stores verticaux' }, vitrage: { ...b.bardages.vitrage, label: 'Panneaux vitrés coulissants' } },
  }))(pergola_bio) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Véranda Glass line ou Kreativ line, ou pergola Umbris : composez votre projet étape par étape.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'veranda';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
