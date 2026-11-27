// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as piscine } from './produits/piscine.js';

const ENTREPRISE = {
  nom: "Schäwi Pool",
  activite: 'Schwimmbäder & Pools',
  initiales: "SP",
  logo: 'marque/logo.jpg',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'piscine': { label: 'Schwimmbecken', aide: 'Beckentyp, Masse, Treppe, Beckenrand und Poolattraktionen.', icone: '<path d="M3 9h18v9H3zM6 12c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M7 9V5h2M7 7h2"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Schwimmbecken',
    couvertures: {
      liner: { ...b.couvertures.liner, label: 'Betonpool mit Folienauskleidung' },
      mosaique: { ...b.couvertures.mosaique, label: 'Mosaikbecken' },
      inox: { label: 'Chromstahlbecken', metal: true, teintes: { brosse: { label: 'Chromstahl gebürstet', couleur: '#C3C9CD', eau: '#42B9D4' } } },
      beton: { label: 'Sicht-Betonpool', teintes: { gris: { label: 'Sichtbeton', couleur: '#A9A8A3', eau: '#2F8E9A' } } },
      coque: { label: 'Fertigbecken', teintes: { blanc: { label: 'Weiss', couleur: '#EEF1F0', eau: '#45BFDB' }, bleu: { label: 'Hellblau', couleur: '#9CC7E2', eau: '#2F96CF' }, gris: { label: 'Grau', couleur: '#8C9196', eau: '#2E7A86' } } },
    },
    toits: Object.fromEntries(Object.entries(b.toits).map(([id, t]) => [id, { ...t, couvertures: ['liner', 'mosaique', 'inox', 'beton', 'coque'] }])),
    libellesOptions: { gouttieres: ['Rollladenabdeckung', 'elektrisch, PVC oder Polycarbonat'], chauffage: ['Nackenschwall', 'Wasserattraktion'], borne: ['Gegenstromanlage', ''] },
    libelles: { ...b.libelles, titre: 'Ihr Schwimmbecken', couverture: 'Beckentyp', teinte: 'Ausführung', ledAide: 'Poolbeleuchtung in der Beckenwand' },
  }))(piscine) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Wählen Sie Ihren Beckentyp, die Masse und die Poolattraktionen. Der Preis passt sich jeder Wahl an.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'piscine';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
