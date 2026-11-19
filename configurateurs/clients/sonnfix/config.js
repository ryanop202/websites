// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as pergola_bio } from './produits/pergola-bio.js';
import { CONFIG as pergola } from './produits/pergola.js';

const ENTREPRISE = {
  nom: "Sonnfix GmbH",
  activite: 'Sonnen- & Wetterschutz · STOBAG',
  initiales: "S",
  logo: 'marque/logo.png',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'pergola-bio': { label: 'Pavillon Lamellendach', aide: 'Verstellbare Aluminiumlamellen für Licht, Schatten und Belüftung, erweiterbar mit ZIP-Screens und Schiebeelementen.', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Pavillon mit Lamellendach',
    libelles: { ...b.libelles, titre: 'Pavillon mit Lamellendach' },
    couvertures: { lames: { ...b.couvertures.lames, label: 'Verstellbare Alu-Lamellen, pulverbeschichtet' } },
    bardages: { screen: { ...b.bardages.screen, label: 'ZIP-Screen' }, vitrage: { ...b.bardages.vitrage, label: 'Schiebeelemente' } },
    libellesOptions: { chauffage: ['Heizung', ''] },
  }))(pergola_bio) },
  'pergola': { label: 'Pergola mit Stoffbespannung', aide: 'Textiler Sonnenschutz mit Alu-Gestell, mit ZIP-Screens oder LED kombinierbar.', icone: '<path d="M3 20h18M6 20V9M18 20V9M3 9h18M5 6h14M8 6v3M12 6v3M16 6v3"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    materiau: 'alu', produit: 'Pergola mit Stoffbespannung',
    libelles: { ...b.libelles, titre: 'Pergola mit Stoffbespannung', finition: 'Gestellfarbe', finitionCourt: 'Gestell', finitionLigne: 'Gestell', parois: 'ZIP-Screens', paroisCourt: 'Screens', bardage: 'Seitenbeschattung' },
    bois: { anthrazit: { label: 'Anthrazit', couleur: '#3A3D40', facteur: 1 }, weiss: { label: 'Weiss', couleur: '#E8E7E2', facteur: 1 }, silber: { label: 'Silber', couleur: '#B5B8BA', facteur: 1 } },
    toits: Object.fromEntries(Object.entries(b.toits).map(([id, t]) => [id, { ...t, couvertures: ['toile'] }])),
    couvertures: { toile: { ...b.couvertures.toile, label: 'Stoffbespannung' } },
    bardages: { zip: { label: 'ZIP-Screen', store: true, couleur: '#4B4C4E', facteur: 1 } },
    defauts: { ...b.defauts, bois: 'anthrazit', bardage: 'zip', couverture: 'toile', teinteCouverture: Object.keys(b.couvertures.toile.teintes)[0] },
  }))(pergola) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Lamellendach-Pavillon oder Pergola mit Stoffbespannung: Masse, Farben und Optionen wählen.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'pergola-bio';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
