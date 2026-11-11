// Une seule application Cloudflare pour TOUTES les démos clients (11.11.2026).
// <nom>.wibzo.ch → affiche le dossier clients/<nom>/ (ex. texbau.wibzo.ch → clients/texbau/).
// Nouvelle démo = nouveau dossier dans clients/, puis `npx wrangler deploy` dans hebergement-demos/.
// Test sans adresse : https://wibzo-demos.<compte>.workers.dev/<nom>/
// www, demo et pergola ont leur propre application : la demande leur est transmise (voir `services` dans wrangler.jsonc).
const DOMAINE = 'wibzo.ch';
const ACCUEIL = 'https://wibzo.ch/';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Adresse de test workers.dev : le chemin contient déjà le nom du dossier
    if (url.hostname.endsWith('.workers.dev')) return env.ASSETS.fetch(request);

    const id = url.hostname.endsWith(`.${DOMAINE}`) ? url.hostname.slice(0, -DOMAINE.length - 1) : '';
    // Adresses qui ont leur propre application : la route *.wibzo.ch passe avant elles, on leur transmet la demande
    const propres = { www: env.SITE, demo: env.DEMO, pergola: env.PERGOLA };
    if (propres[id]) return propres[id].fetch(request);
    if (!/^[a-z0-9-]+$/.test(id)) return Response.redirect(ACCUEIL, 302);

    url.pathname = `/${id}${url.pathname}`;
    const reponse = await env.ASSETS.fetch(new Request(url, request));
    // Démo inconnue ou retirée : retour à l'accueil Wibzo
    if (reponse.status === 404) return Response.redirect(ACCUEIL, 302);
    // Redirection interne (ajout du « / » final) : enlever le nom du dossier du chemin
    const lieu = reponse.headers.get('location');
    if (lieu && lieu.startsWith(`/${id}/`)) {
      const r = new Response(reponse.body, reponse);
      r.headers.set('location', lieu.slice(id.length + 1));
      return r;
    }
    return reponse;
  },
};
