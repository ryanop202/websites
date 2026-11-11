// Version allemande (fabriquée par outils/traduire-de.py, ne pas modifier à la main).
// Démo maître DE : carport et véranda. Pour une démo client : remplacer ce fichier par la config du client.
import { CONFIG as carport } from './produits/carport.js';
import { CONFIG as veranda } from './produits/veranda.js';

export const PRODUITS = {
  carport: {
    label: 'Carport', aide: 'Offener Unterstand für ein oder zwei Autos, Geräteraum optional.',
    icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: carport,
  },
  veranda: {
    label: 'Wintergarten', aide: 'Verglaster Raum aus Aluminium, an die Fassade angebaut.',
    icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: veranda,
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
