// Démo PERSONNALISÉE le 19.11.2026 (outils/demo-perso.py) : logo, produits et termes repris de leur site (lu le 19.11.2026).
// ⚠️ Tous les PRIX sont FICTIFS. Mise en ligne : `npx wrangler deploy` dans hebergement-demos/.
import { CONFIG as terrasse } from './produits/terrasse.js';

const ENTREPRISE = {
  nom: "Kayser Holzbau AG",
  activite: 'Holzbau · Terrassenböden',
  initiales: "KH",
  logo: 'marque/logo.svg',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};

export const PRODUITS = {
  'terrasse': { label: 'Terrassenboden', aide: 'Holzarten von Thermo-Esche bis Kebony, oder Fano Ultrashield.', icone: '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>', config: ((b) => ({ ...b, entreprise: ENTREPRISE,
    produit: 'Terrassenboden',
    libelles: { ...b.libelles, titre: 'Ihr Terrassenboden', couverture: 'Belag', teinte: 'Holzart' },
    couvertures: {
      bois: { ...b.couvertures.bois, label: 'Holzdielen', teintes: {
        thermoesche: { label: 'Thermo-Esche', couleur: '#5E3F2A' },
        sipo: { label: 'Sipo-Mahagoni', couleur: '#8A4A33' },
        accoya: { label: 'Accoya', couleur: '#B08A63' },
        accoyagrey: { label: 'Accoya Grey', couleur: '#8E8D88' },
        kebonyclear: { label: 'Kebony Clear', couleur: '#4F3A2B' },
        kebonychar: { label: 'Kebony Character', couleur: '#5A4231' },
        douglas: { label: 'Douglasie', couleur: '#B9875C' },
        laerche: { label: 'Lärche', couleur: '#C29A6B' },
      } },
      composite: { ...b.couvertures.composite, label: 'Fano Ultrashield' },
    },
    toits: { plat: { ...b.toits.plat, couvertures: ['bois', 'composite'] } },
    defauts: { ...b.defauts, couverture: 'bois', teinteCouverture: 'thermoesche' },
  }))(terrasse) },
};
for (const p of Object.values(PRODUITS)) p.config.chapo = 'Ihr Terrassenboden: wählen Sie die Holzart, die Masse und die Stufen.';

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'terrasse';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
