// Démo publique (demo.wibzo.ch) : on choisit d'abord le produit, puis on avance par étapes (assistant).
// Chaque produit garde sa propre configuration dans produits/. Le choix est lu dans l'adresse : ?produit=pergola
// ⚠️ Pour une démo client : remplacer ce fichier par la config du client (comme avant), sans assistant ni produits.
import { CONFIG as carport } from './produits/carport.js';
import { CONFIG as pergola } from './produits/pergola.js';
import { CONFIG as veranda } from './produits/veranda.js';
import { CONFIG as pergolaBio } from './produits/pergola-bio.js';
import { CONFIG as terrasse } from './produits/terrasse.js';
import { CONFIG as piscine } from './produits/piscine.js';

// Cartes de l'étape « Produit » (icône dessinée en SVG, dans l'ordre d'affichage)
export const PRODUITS = {
  carport: {
    label: 'Carport', aide: 'Un abri ouvert pour une ou deux voitures, avec local de rangement en option.',
    icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: carport, exemple: '12 790',
  },
  pergola: {
    label: 'Pergola en bois', aide: 'Une structure contre la maison, sur votre terrasse, avec brise-vue en option.',
    icone: '<path d="M3 20h18M6 20V9M18 20V9M3 9h18M5 6h14M8 6v3M12 6v3M16 6v3"/>', config: pergola, exemple: '4 610',
  },
  'pergola-bio': {
    label: 'Pergola bioclimatique', aide: 'Lames alu orientables pour régler soleil et ventilation, stores en option.',
    icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: pergolaBio, exemple: '10 890',
  },
  veranda: {
    label: 'Véranda', aide: 'Une pièce vitrée en aluminium, accolée à la façade.',
    icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: veranda, exemple: '30 750',
  },
  terrasse: {
    label: 'Terrasse', aide: 'Lames bois ou composite, dalles de grès, marches et garde-corps.',
    icone: '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>', config: terrasse, exemple: '8 330',
  },
  piscine: {
    label: 'Piscine', aide: 'Bassin enterré, liner ou mosaïque, margelles et plage, volet immergé en option.',
    icone: '<path d="M3 9h18v9H3zM6 12c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M7 9V5h2M7 7h2"/>', config: piscine, exemple: '70 630',
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
// (exemple : prix TTC avec les réglages par défaut, à mettre à jour si les tarifs changent)
// Cotes et accents gris foncé dans la démo publique (au lieu du bleu des démos clients)
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
