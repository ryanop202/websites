// Démo préparée pour Concept Terrasse Sàrl (Combremont-le-Petit, Yverdon), 04.11.2026.
// Repris de concept-terrasse.ch (vérifié le 04.11.2026) : terrasses en bois européen, bois exotique, bois Accoya,
// bois composite WPC et grès cérame ; entourages de spas et de piscines. Logo repris de leur site.
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les teintes (exemples). Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/terrasse.js';

const ENTREPRISE = {
  nom: 'Concept Terrasse Sàrl',
  activite: 'Terrasses & aménagements extérieurs · Combremont',
  initiales: 'CT',
  logo: 'marque/logo-concept-terrasse.svg',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

const terrasse = {
  ...base,
  entreprise: ENTREPRISE,
  chapo: 'Votre terrasse sur mesure en bois, composite ou grès cérame. Dessinez-la étape par étape, le prix se met à jour à chaque choix.',
  toits: { plat: { label: 'Plat', pente: 0, couvertures: ['europeen', 'exotique', 'accoya', 'composite', 'gres'] } },
  couvertures: {
    europeen: {
      label: 'Bois européen', type: 'lames', epaisseur: 0.025,
      teintes: {
        meleze: { label: 'Mélèze', couleur: '#BE8E5C' },
        douglas: { label: 'Douglas', couleur: '#C79A68' },
        grise: { label: 'Bois grisé', couleur: '#A39C91' },
      },
    },
    exotique: {
      label: 'Bois exotique', type: 'lames', epaisseur: 0.021,
      teintes: {
        ipe: { label: 'Ipé', couleur: '#7A4E31' },
        cumaru: { label: 'Cumaru', couleur: '#9A6A42' },
      },
    },
    accoya: {
      label: 'Bois Accoya', type: 'lames', epaisseur: 0.025,
      teintes: { naturel: { label: 'Naturel', couleur: '#D4B48A' } },
    },
    composite: {
      label: 'Bois composite WPC', type: 'lames', rainures: true, epaisseur: 0.025,
      teintes: {
        gris: { label: 'Gris clair', couleur: '#A3A29D' },
        anthracite: { label: 'Anthracite', couleur: '#4B4C4E' },
        brun: { label: 'Brun', couleur: '#6E5240' },
        teck: { label: 'Teck', couleur: '#A27A55' },
      },
    },
    gres: {
      label: 'Grès cérame', type: 'dalles', epaisseur: 0.02,
      teintes: {
        beton: { label: 'Gris béton', couleur: '#BDBAB3' },
        beige: { label: 'Beige pierre', couleur: '#DCCFB8' },
        anthracite: { label: 'Anthracite', couleur: '#626365' },
        bois: { label: 'Effet bois', couleur: '#AD8A64' },
      },
    },
  },
  defauts: { ...base.defauts, couverture: 'europeen', teinteCouverture: 'meleze' },
  tarifs: {
    ...base.tarifs,
    revetementM2: { europeen: 120, exotique: 175, accoya: 190, composite: 140, gres: 150 },
  },
};

export const PRODUITS = {
  terrasse: {
    label: 'Terrasse', aide: 'Bois européen, exotique, Accoya, composite ou grès cérame, marches et garde-corps.',
    icone: '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>', config: terrasse,
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'terrasse';
// Vert du logo (#65B845), assombri pour rester lisible en texte
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3F7F28', 'plan-clair': '#E6F2DF' } };
