// Démo préparée pour Mapa Bois, 04.11.2026 (produit « terrasse »).
// Repris de mapabois.ch : « aménagement de votre terrasse bois ou cabanon de jardin » (vérifié le 04.11.2026). Seulement les revêtements vus sur leur site.
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les teintes (exemples). Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/terrasse.js';

const ENTREPRISE = {
  nom: 'Mapa Bois',
  activite: 'Menuiserie · terrasses bois · Corbières',
  initiales: 'MB',
  logo: 'marque/logo.jpg',
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
