// Démo préparée pour Astro Piscines, 05.11.2026 (outils/demo-piscine.py, produit « piscine »).
// Repris de astro-piscines.ch : « Constructeur de piscine en Suisse depuis 1974 », « Piscine béton, coque polyester ou inox » (vérifié le 05.11.2026). Seulement leurs revêtements quand le site les nomme.
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les teintes (exemples). Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/piscine.js';

const ENTREPRISE = {
  nom: 'Astro Piscines',
  activite: 'Constructeur de piscines depuis 1974 · Genève & Nyon',
  initiales: 'AP',
  logo: 'marque/logo.png',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const piscine = {
  ...base,
  entreprise: ENTREPRISE,
  couvertures: {
  "beton": {
    "label": "Béton armé, membrane armée",
    "teintes": {
      "blanc": {
        "label": "Blanc",
        "couleur": "#EEF1F0",
        "eau": "#45BFDB"
      },
      "sable": {
        "label": "Sable",
        "couleur": "#E4D6B8",
        "eau": "#3FB5AA"
      },
      "gris": {
        "label": "Gris anthracite",
        "couleur": "#5B6166",
        "eau": "#2E7A86"
      },
      "noir": {
        "label": "Noir",
        "couleur": "#2C2F33",
        "eau": "#23515A"
      }
    }
  },
  "coque": {
    "label": "Coque polyester",
    "teintes": {
      "blanc": {
        "label": "Blanc",
        "couleur": "#EEF1F0",
        "eau": "#45BFDB"
      },
      "sable": {
        "label": "Sable",
        "couleur": "#E4D6B8",
        "eau": "#3FB5AA"
      },
      "bleu": {
        "label": "Bleu pâle",
        "couleur": "#9CC7E2",
        "eau": "#2F96CF"
      },
      "gris": {
        "label": "Gris anthracite",
        "couleur": "#5B6166",
        "eau": "#2E7A86"
      }
    }
  },
  "inox": {
    "label": "Acier inoxydable",
    "metal": true,
    "teintes": {
      "brosse": {
        "label": "Inox brossé",
        "couleur": "#C3C9CD",
        "eau": "#42B9D4"
      },
      "poli": {
        "label": "Inox poli",
        "couleur": "#DCE1E4",
        "eau": "#47C2DC"
      }
    }
  }
},
  toits: Object.fromEntries(Object.entries(base.toits).map(([id, t]) => [id, { ...t, couvertures: ["beton", "coque", "inox"] }])),
  defauts: { ...base.defauts, couverture: 'beton', teinteCouverture: 'blanc' },
};

export const PRODUITS = {
  piscine: {
    label: 'Piscine', aide: 'Bassin sur mesure, escalier, margelles, plage et options.',
    icone: '<path d="M3 9h18v9H3zM6 12c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M7 9V5h2M7 7h2"/>', config: piscine,
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'piscine';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
