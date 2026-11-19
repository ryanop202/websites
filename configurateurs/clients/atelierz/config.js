// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as carport } from './produits/carport.js';
import { CONFIG as pergola } from './produits/pergola.js';

const ENTREPRISE = {
  nom: 'Atelier Z construction bois SA',
  activite: 'Construction bois · Grancy',
  initiales: 'AZ',
  logo: '',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'carport': { label: 'Couvert à voiture', aide: 'Couvert en bois pour une ou deux voitures, local de rangement en option.', icone: '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Couvert à voiture en bois',
    libelles: { ...b.libelles, titre: 'Couvert à voiture sur mesure' },
  }))(carport) },
  'pergola': { label: 'Couverture de terrasse', aide: 'Structure bois contre la maison ou isolée, toile ou polycarbonate.', icone: '<path d="M3 20h18M6 20V9M18 20V9M3 9h18M5 6h14M8 6v3M12 6v3M16 6v3"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Couverture de terrasse',
    libelles: { ...b.libelles, titre: 'Couverture de terrasse en bois' },
  }))(pergola) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Couvert à voiture ou couverture de terrasse en bois : composez votre projet étape par étape.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'carport';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
