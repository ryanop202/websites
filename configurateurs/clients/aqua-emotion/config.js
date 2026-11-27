// Démo ALLEMANDE préparée pour Aqua Emotion AG, 11.11.2026 (outils/demo-de.py, produit « piscine »).
// 19.11.2026 : adaptée à leur réponse du 18.11 (bassins préfabriqués : le client choisit le MODÈLE, puis seulement la LONGUEUR,
// la largeur est fixée par le modèle). Modèles, dimensions, vues de dessus et couleurs repris de
// aqua-emotion.ch/schwimmbad-bauen/schwimmbecken-rechteckig-mit-einbautreppe/ (lu le 19.11.2026).
// Type d'escalier de chaque modèle : d'après la vue de dessus (droit / angle gauche ou droit / banquette / aucun visible).
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les teintes affichées (approximations des noms de couleurs).
// La plage de longueur (limites.profondeur) est un EXEMPLE : à définir avec Aqua Emotion.
// Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as base } from './produits/piscine.js';

const ENTREPRISE = {
  nom: "Aqua Emotion AG",
  activite: "Pool- & Schwimmbadbau",
  initiales: "AE",
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

const IMG = 'https://www.aqua-emotion.ch/wp-content/uploads/';
// [id, nom, longueur, largeur, escalier, côté de l'escalier d'angle, image]
const MODELES = [
  ['zypern', 'Zypern', 5, 2.4, 'droit', '', '2025/11/zypern.png'],
  ['sumatra', 'Sumatra', 6, 3, 'droit', '', '2025/11/sumatra.png'],
  ['kiribati', 'Kiribati', 6.4, 3.3, 'angle', 'droite', '2025/11/Kiribati.png'],
  ['java', 'Java', 6.4, 3.3, 'angle', 'gauche', '2025/11/Java.png'],
  ['samoa', 'Samoa', 7, 3.3, 'droit', '', '2025/11/Samoa.png'],
  ['palau', 'Palau', 7, 3.3, 'aucun', '', '2026/02/Design-ohne-Titel-16.png'],
  ['malta', 'Malta', 7.4, 3.3, 'banquette', '', '2025/11/Malta.png'],
  ['ibiza', 'Ibiza', 8, 3.3, 'angle', 'droite', '2025/11/Ibiza-1.png'],
  ['mykonos', 'Mykonos', 8, 3.3, 'angle', 'gauche', '2025/11/Mykonos.png'],
  ['fuerteventura', 'Fuerteventura', 8, 3.77, 'droit', '', '2025/11/Fuerteventura.png'],
  ['gomera', 'Gomera', 8, 3.77, 'angle', 'droite', '2025/11/Gomera.png'],
  ['panama', 'Panama', 8, 3.77, 'angle', 'gauche', '2025/11/Panama.png'],
  ['trinidad', 'Trinidad', 8.4, 3.3, 'banquette', '', '2025/11/Trinidad.png'],
  ['tobago', 'Tobago', 8.4, 3.3, 'banquette', '', '2025/11/Tobago.png'],
  ['aruba', 'Aruba', 9, 3.77, 'droit', '', '2025/11/Aruba.png'],
  ['guadeloupe', 'Guadeloupe', 9, 3.77, 'angle', 'droite', '2025/11/Guadeloupe.png'],
  ['martinique', 'Martinique', 9, 3.77, 'angle', 'gauche', '2025/11/Martinique.png'],
  ['bora-bora', 'Bora-Bora', 10, 4, 'banquette', '', '2025/11/Bora-Bora.png'],
  ['margarita', 'Margarita', 10.5, 4, 'droit', '', '2025/11/Margarita.png'],
].map(([id, nom, longueur, largeur, escalier, cote, img]) => ({ id, nom, longueur, largeur, escalier, cote, image: IMG + img }));

const produit = {
  ...base,
  entreprise: ENTREPRISE,
  produit: 'Einstückbecken',
  chapo: 'Wählen Sie Ihr Beckenmodell und die Länge. Der Preis passt sich jeder Wahl an.',
  libelles: { ...base.libelles, titre: 'Ihr Einstückbecken', toiture: 'Farbe', toitureCourt: 'Farbe', couverture: 'Beckenfarbe' },
  modeles: MODELES,
  limites: { ...base.limites, largeur: [2.4, 4, 0.01], profondeur: [4.5, 11, 0.1] },
  raccourcis: [],
  toits: {
    droit: { label: 'Treppe über die ganze Breite', pente: 0, couvertures: ['coque'] },
    angle: { label: 'Eck-Treppe', pente: 0, couvertures: ['coque'] },
    banquette: { label: 'Treppe mit Sitzbank', pente: 0, couvertures: ['coque'] },
    aucun: { label: 'ohne Einbautreppe', pente: 0, couvertures: ['coque'] },
  },
  couvertures: {
    coque: {
      label: 'Einstückbecken', mosaique: false,
      teintes: {
        reinweiss: { label: 'Reinweiss', couleur: '#F2F3F1', eau: '#47C2DD' },
        betongrau: { label: 'Betongrau', couleur: '#9A9B98', eau: '#2F8C99' },
        sand: { label: 'Sandfarben', couleur: '#E2D3B2', eau: '#3FB5AA' },
        azur: { label: 'Azurblau', couleur: '#7FB8DE', eau: '#2A92CF' },
        granit: { label: 'Granitgrau', couleur: '#6A6E72', eau: '#2C7782' },
        lichtgrau: { label: 'Lichtgrau', couleur: '#C9CBC8', eau: '#3BA6BC' },
        granit3d: { label: 'Granitgrau 3D', couleur: '#5E6266', eau: '#2A727D' },
      },
    },
  },
  libellesOptions: {
    gouttieres: ['Unterflur-Solarlamellen', 'vollintegrierte Lamellenabdeckung'],
    chauffage: ['Poolheizung', 'für eine längere Badesaison'],
    borne: ['Gegenstromanlage', ''],
  },
  tarifs: { ...base.tarifs, escalier: { droit: 0, angle: 0, banquette: 0, aucun: 0 } },
  defauts: { ...base.defauts, modele: 'samoa', largeur: 3.3, profondeur: 7, toit: 'droit', couverture: 'coque', teinteCouverture: 'reinweiss' },
};

export const PRODUITS = {
  "piscine": { label: "Einstückbecken", aide: "Modell wählen, Länge anpassen, Farbe und Optionen.", icone: "<path d=\"M3 9h18v9H3zM6 12c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M7 9V5h2M7 7h2\"/>", config: produit },
};

export const PRODUIT = "piscine";
export const CONFIG = { ...produit, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
