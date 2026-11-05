// Démo préparée pour Romano Menuiserie, 04.11.2026 (produit « terrasse »).
// Repris de romano-menuiserie.ch : « Agencement extérieur : terrasse » (vérifié le 04.11.2026). Seulement les revêtements vus sur leur site.
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les teintes (exemples). Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/terrasse.js';

const ENTREPRISE = {
  nom: 'Romano Menuiserie',
  activite: 'Menuiserie · La Chaux-de-Fonds',
  initiales: 'RM',
  logo: 'marque/logo.png',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const perso = (c) => ({ ...c, entreprise: ENTREPRISE });
const terrasse = {
  ...base,
  toits: { plat: { label: 'Plat', pente: 0, couvertures: ['bois'] } },
  defauts: { ...base.defauts, couverture: 'bois', teinteCouverture: 'meleze' },
};

export const PRODUITS = {
  terrasse: {
    label: 'Terrasse', aide: 'Lames bois, marches et garde-corps.',
    icone: '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>', config: perso(terrasse),
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'terrasse';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
