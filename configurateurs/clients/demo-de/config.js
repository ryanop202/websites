// Démo PUBLIQUE en allemand (19.11.2026) : https://demo-de.wibzo.ch, liée depuis https://wibzo.ch/de/.
// Même base que carport-demo-de, avec les 6 produits. ⚠️ Tous les PRIX sont FICTIFS.
import { CONFIG as carport } from './produits/carport.js';
import { CONFIG as pergola } from './produits/pergola.js';
import { CONFIG as veranda } from './produits/veranda.js';
import { CONFIG as pergolaBio } from './produits/pergola-bio.js';
import { CONFIG as terrasse } from './produits/terrasse.js';
import { CONFIG as piscine } from './produits/piscine.js';

export const PRODUITS = {
  carport: { label: 'Carport', aide: 'Offener Unterstand für ein oder zwei Autos, Geräteraum optional.', icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: carport },
  pergola: { label: 'Holz-Pergola', aide: 'Holzkonstruktion am Haus oder freistehend, Stoff oder Polycarbonat, Sichtschutz optional.', icone: '<path d="M3 20h18M6 20V9M18 20V9M3 9h18M5 6h14M8 6v3M12 6v3M16 6v3"/>', config: pergola },
  veranda: { label: 'Wintergarten', aide: 'Verglaster Raum aus Aluminium, an die Fassade angebaut.', icone: '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>', config: veranda },
  'pergola-bio': { label: 'Lamellendach', aide: 'Drehbare Alu-Lamellen für Sonne und Lüftung, Seitenabschlüsse optional.', icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>', config: pergolaBio },
  terrasse: { label: 'Terrasse', aide: 'Holz- oder WPC-Dielen, Feinsteinzeug, Stufen und Geländer.', icone: '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>', config: terrasse },
  piscine: { label: 'Pool', aide: 'Becken nach Mass, Treppe, Beckenrand, Umrandung und Optionen.', icone: '<path d="M3 9h18v9H3zM6 12c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M7 9V5h2M7 7h2"/>', config: piscine },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
