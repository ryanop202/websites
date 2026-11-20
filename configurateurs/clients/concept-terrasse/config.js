// Démo préparée pour Concept Terrasse Sàrl (Combremont-le-Petit), 04.11.2026, PERSONNALISÉE le 20.11.2026.
// Gamme reprise de concept-terrasse.ch/prestations (lu le 20.11.2026) :
// - bois européen : frêne thermo-traité, mélèze, pin autoclavé vert
// - bois exotique : ipé, moabi, bambou
// - bois Accoya : naturel, gris teinté dans la masse
// - composite WPC Megawood® : Classic, Signum, Premium, Premium Plus
// - grès cérame extérieur 20 mm, pose flottante sur rail aluminium et plots réglables (formats 60×60 à 120×60)
// Vert du site (#83BE65) et du logo (#65B845). Logo repris de leur site.
// ⚠️ Tous les PRIX sont FICTIFS. Les teintes affichées sont des approximations des essences.
// Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as base } from './produits/terrasse.js';

const ENTREPRISE = {
  nom: 'Concept Terrasse Sàrl',
  activite: 'Terrasses · Combremont-le-Petit',
  initiales: 'CT',
  logo: 'marque/logo-concept-terrasse.svg',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

const terrasse = {
  ...base,
  entreprise: ENTREPRISE,
  produit: 'Terrasse Concept Terrasse',
  chapo: 'Bois européen, exotique, Accoya, composite Megawood® ou grès cérame : dessinez votre terrasse, le prix se met à jour à chaque choix.',
  libelles: {
    ...base.libelles,
    titre: 'Votre terrasse sur mesure',
    toiture: 'Matériau',
    toitureCourt: 'Matériau',
    couverture: 'Gamme',
    teinte: 'Essence / modèle',
    hauteurAide: 'sur plots réglables',
  },
  toits: { plat: { label: 'Plat', pente: 0, couvertures: ['europeen', 'exotique', 'accoya', 'megawood', 'gres'] } },
  couvertures: {
    europeen: {
      label: 'Bois européen', type: 'lames', epaisseur: 0.026,
      teintes: {
        frene: { label: 'Frêne thermo-traité', couleur: '#6E4B32' },
        meleze: { label: 'Mélèze', couleur: '#BE8E5C' },
        pin: { label: 'Pin autoclavé vert', couleur: '#A89A6A' },
      },
    },
    exotique: {
      label: 'Bois exotique', type: 'lames', epaisseur: 0.021,
      teintes: {
        ipe: { label: 'Ipé', couleur: '#6F4630' },
        moabi: { label: 'Moabi', couleur: '#8A4B37' },
        bambou: { label: 'Bambou', couleur: '#8C5E3C' },
      },
    },
    accoya: {
      label: 'Bois Accoya', type: 'lames', epaisseur: 0.025,
      teintes: {
        naturel: { label: 'Accoya naturel', couleur: '#D4B48A' },
        gris: { label: 'Accoya gris teinté dans la masse', couleur: '#8F8D88' },
      },
    },
    megawood: {
      label: 'Composite WPC Megawood®', type: 'lames', rainures: true, epaisseur: 0.025,
      teintes: {
        classic: { label: 'Megawood Classic', couleur: '#7A5B44' },
        signum: { label: 'Megawood Signum', couleur: '#5E5650' },
        premium: { label: 'Megawood Premium', couleur: '#8A6A50' },
        premiumplus: { label: 'Megawood Premium Plus', couleur: '#6B5A4C' },
      },
    },
    gres: {
      label: 'Grès cérame 20 mm sur plots', type: 'dalles', epaisseur: 0.02,
      teintes: {
        beton: { label: 'Gris béton', couleur: '#BDBAB3' },
        beige: { label: 'Beige pierre', couleur: '#DCCFB8' },
        anthracite: { label: 'Anthracite', couleur: '#626365' },
        bois: { label: 'Effet bois', couleur: '#AD8A64' },
      },
    },
  },
  // Formes vues dans leurs réalisations (concept-terrasse.ch/realisations, 20.11.2026) : coins coupés, arrondis, L, spas encastrés
  formes: {
    rect: { label: 'Rectangulaire' },
    coin: { label: 'Coin coupé' },
    arrondi: { label: 'Coin arrondi' },
    L: { label: 'En L' },
  },
  spas: {
    non: { label: 'Sans spa' },
    oui: { label: 'Entourage de spa encastré' },
  },
  defauts: { ...base.defauts, couverture: 'exotique', teinteCouverture: 'ipe', forme: 'rect', spa: 'non' },
  tarifs: {
    ...base.tarifs,
    revetementM2: { europeen: 120, exotique: 175, accoya: 190, megawood: 150, gres: 150 },
    decoupe: { coin: 380, arrondi: 690, L: 420 }, // FICTIF : coupes et lames de bordure
    entourageSpa: 1950, // FICTIF : entourage du spa (le spa lui-même n'est pas compris)
  },
};

export const PRODUITS = {
  terrasse: {
    label: 'Terrasse', aide: 'Bois européen, exotique, Accoya, composite Megawood® ou grès cérame 20 mm, marches et garde-corps.',
    icone: '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>', config: terrasse,
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'terrasse';
// Vert du logo (#65B845), assombri pour rester lisible en texte
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3F7F28', 'plan-clair': '#E6F2DF', accent: '#3F7F28', 'accent-fonce': '#2F6420' } };
