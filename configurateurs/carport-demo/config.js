// Démo publique (demo.wibzo.ch) : on choisit d'abord le produit, puis on avance par étapes (assistant).
// Chaque produit garde sa propre configuration dans produits/. Le choix est lu dans l'adresse : ?produit=pergola
// ⚠️ Pour une démo client : remplacer ce fichier par la config du client (comme avant), sans assistant ni produits.
import { CONFIG as carport } from './produits/carport.js';
import { CONFIG as pergola } from './produits/pergola.js';
import { CONFIG as veranda } from './produits/veranda.js';

// Cartes de l'étape « Produit » (icône dessinée en SVG, dans l'ordre d'affichage)
export const PRODUITS = {
  carport: {
    label: 'Carport', aide: 'Un abri ouvert pour une ou deux voitures, avec local de rangement en option.',
    icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: carport,
  },
  pergola: {
    label: 'Pergola', aide: 'Une structure contre la maison, sur votre terrasse, avec brise-vue en option.',
    icone: '<path d="M3 20h18M6 20V9M18 20V9M3 9h18M5 6h14M8 6v3M12 6v3M16 6v3"/>', config: pergola,
  },
  veranda: {
    label: 'Véranda', aide: 'Une pièce vitrée en aluminium, accolée à la façade.',
    icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: veranda,
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true };
