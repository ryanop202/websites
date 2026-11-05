// Démo SURTECH Sàrl (Ardon VS) — refaite sur la nouvelle base le 04.11.2026.
// 2 produits, vérifiés sur surtech.ch le 04.11.2026 : carport alu (/carport) et pergola bioclimatique alu (/pergola :
// parois de verre coulissantes, stores Zip motorisés en toile). Chauffage retiré : pas mentionné sur leur site.
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as carport } from './produits/carport.js';
import { CONFIG as pergolaBio } from './produits/pergola-bio.js';

const ENTREPRISE = {
  nom: 'SURTECH Sàrl',
  activite: 'Carports & pergolas alu · Ardon (VS)',
  initiales: 'S',
  logo: 'marque/logo-surtech.png', // logo repris de surtech.ch
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const perso = (c, extra = {}) => ({ ...c, ...extra, entreprise: ENTREPRISE });

export const PRODUITS = {
  carport: {
    label: 'Carport aluminium', aide: 'Autoportant ou adossé, toit isolé ou photovoltaïque, box fermé en option.',
    icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: perso(carport),
  },
  'pergola-bio': {
    label: 'Pergola bioclimatique', aide: 'Lames alu orientables, parois de verre coulissantes ou stores Zip.',
    icone: '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>',
    config: perso(pergolaBio, {
      chapo: 'Profitez de votre terrasse toute l’année. Réglez votre pergola étape par étape, le prix se met à jour à chaque choix.',
      equipements: ['led'],
      libelles: { ...pergolaBio.libelles, paroisAide: 'Touchez un côté pour le fermer : store Zip ou paroi de verre coulissante.' },
      bardages: {
        screen: { label: 'Store Zip motorisé (toile)', store: true, couleur: '#4B4C4E', facteur: 1 },
        vitrage: { label: 'Parois de verre coulissantes', vitrage: true, facteur: 2.3 },
      },
    }),
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
// Bois du « S » du logo, assombri pour rester lisible en texte
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#7A4A22', 'plan-clair': '#F1E7DC' } };
