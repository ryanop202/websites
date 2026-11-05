// Démo préparée pour Xtreme Charpente, 04.11.2026 (produit « terrasse » + pergola bois).
// Repris de xtremecharpente.ch : « charpentes, pergolas, escaliers et terrasses » (vérifié le 04.11.2026). Seulement les revêtements vus sur leur site.
// ⚠️ Tous les PRIX sont FICTIFS, ainsi que les teintes (exemples). Mise en ligne : `npx wrangler deploy` dans ce dossier.
import { CONFIG as base } from './produits/terrasse.js';
import { CONFIG as pergola } from './produits/pergola.js';

const ENTREPRISE = {
  nom: 'Xtreme Charpente',
  activite: 'Charpente · terrasses · pergolas · Orbe',
  initiales: 'XC',
  logo: 'marque/logo.png',
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const perso = (c) => ({ ...c, entreprise: ENTREPRISE });
const terrasse = {
  ...base,
  toits: { plat: { label: 'Plat', pente: 0, couvertures: ['bois', 'composite'] } },
  defauts: { ...base.defauts, couverture: 'bois', teinteCouverture: 'meleze' },
};

export const PRODUITS = {
  terrasse: {
    label: 'Terrasse', aide: 'Lames bois, composite, marches et garde-corps.',
    icone: '<path d="M2 15h20M4 15v5M20 15v5M4 18h16M6 12h12M8 9h8"/>', config: perso(terrasse),
  },
  pergola: {
    label: 'Pergola en bois', aide: 'Contre la maison ou isolée, avec brise-vue en option.',
    icone: '<path d="M3 20h18M6 20V9M18 20V9M3 9h18M5 6h14M8 6v3M12 6v3M16 6v3"/>', config: perso(pergola),
  },
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : 'terrasse';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
