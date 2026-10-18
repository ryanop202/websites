// Génère les pages « ville » et « métier » de wibzo.ch dans site-v4/.
// Lancer : node build.js   (puis déployer site-v4 avec npx wrangler deploy)
// Les textes sont dans pages.js. Ne rien inventer (règle CLAUDE.md).
const fs = require("fs");
const path = require("path");
const PAGES = require("./pages.js");

const SITE = path.resolve(__dirname, "../site-v4");
const BASE = "https://wibzo.ch/";
const TEL = "+41767574393";

const allLinks = PAGES.map(p => ({ slug: p.slug, label: p.short }));

function esc(s) { return s.replace(/&(?!\w+;|#\d+;)/g, "&amp;"); }

function render(p) {
  const url = BASE + p.slug + "/";
  const jsonld = [
    {
      "@context": "https://schema.org", "@type": "Service",
      "name": p.h1.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " "),
      "serviceType": "Création de site internet",
      "provider": { "@type": "ProfessionalService", "name": "Wibzo", "url": BASE, "telephone": TEL },
      "areaServed": p.area,
      "url": url,
      "offers": { "@type": "Offer", "priceCurrency": "CHF", "price": "350", "description": "Création dès 350 CHF, maquette gratuite" }
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Wibzo", "item": BASE },
        { "@type": "ListItem", "position": 2, "name": p.short, "item": url }
      ]
    }
  ];

  const blocks = p.blocks.map(b => `
        <div class="prose__block reveal">
          <h2>${b.h2}</h2>
          ${b.html}
        </div>`).join("");

  const example = p.example ? `
    <section class="seo-ex" aria-labelledby="ex-title">
      <div class="wrap">
        <div class="trade">
          <div class="trade__text">
            <p class="eyebrow">Exemple (commerce fictif)</p>
            <h2 id="ex-title" class="seo-ex__title">${p.example.title}</h2>
            <ul>${p.example.points.map(x => `<li>${x}</li>`).join("")}</ul>
            ${p.example.links.map(l => `<a class="link" href="../realisations/${l.slug}/index.html" target="_blank" rel="noopener">Voir l’exemple ${l.name} <span aria-hidden="true">↗</span></a>`).join("\n            ")}
          </div>
          <div class="trade__media"><img src="../assets/work/${p.example.img}" width="780" height="1688" loading="lazy" alt="${p.example.alt}"></div>
        </div>
      </div>
    </section>` : "";

  const faq = p.faq.map(q => `
          <details>
            <summary>${q.q}</summary>
            <p>${q.a}</p>
          </details>`).join("");

  const others = allLinks.filter(l => l.slug !== p.slug)
    .map(l => `<li><a href="../${l.slug}/">${l.label}</a></li>`).join("");

  return `<!doctype html>
<html lang="fr-CH">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${p.title}</title>
  <meta name="description" content="${p.desc}">
  <meta name="theme-color" content="#F4F2EE">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_CH">
  <meta property="og:site_name" content="Wibzo">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${BASE}assets/work/${p.og || "chene-et-laiton-soir.jpg"}">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../assets/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
  <link rel="preload" href="../assets/fonts/inter-tight-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="../assets/fonts/newsreader-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="../css/style.css">
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
  <a class="skip" href="#contenu">Aller au contenu</a>

  <header class="top">
    <div class="wrap top__inner">
      <a href="../" class="logo" aria-label="Wibzo, accueil">Wibzo</a>
      <nav class="nav" aria-label="Navigation principale">
        <a href="../#realisations">Réalisations</a>
        <a href="../#tarifs">Tarifs</a>
        <a href="../#methode">Méthode</a>
        <a href="#questions">Questions</a>
      </nav>
      <a class="top__tel" href="tel:${TEL}">076 757 43 93</a>
      <a class="btn btn--sm wa-link" href="https://wa.me/41767574393" target="_blank" rel="noopener">Ma maquette gratuite</a>
    </div>
  </header>

  <main id="contenu">
    <section class="hero seo-hero">
      <div class="wrap">
        <nav class="crumbs" aria-label="Fil d’Ariane"><a href="../">Wibzo</a> <span aria-hidden="true">›</span> <span>${p.short}</span></nav>
        <p class="eyebrow reveal">${p.eyebrow}</p>
        <h1 class="seo-hero__title reveal">${p.h1}</h1>
        <p class="hero__lead seo-hero__lead reveal">${p.lead}</p>
        <div class="hero__actions reveal">
          <a class="btn wa-link" href="https://wa.me/41767574393" target="_blank" rel="noopener">Recevoir ma maquette gratuite</a>
          <a class="link" href="tel:${TEL}">ou appeler le 076 757 43 93</a>
        </div>
        <ul class="ticks reveal"><li>Maquette gratuite en 24&nbsp;h</li><li>Dès 350&nbsp;CHF</li><li>Sans engagement</li></ul>
      </div>
    </section>

    <section class="prose" aria-label="En détail">
      <div class="wrap prose__grid">${blocks}
      </div>
    </section>
${example}
    <section class="method" id="methode" aria-labelledby="method-title">
      <div class="wrap">
        <h2 id="method-title" class="h2 reveal">Comment ça se passe</h2>
        <ol class="steps">
          <li class="reveal"><span class="steps__n">1</span><h3>Vous écrivez</h3><p>Le nom de votre commerce, sur WhatsApp. C’est tout.</p></li>
          <li class="reveal"><span class="steps__n">2</span><h3>Vous voyez</h3><p>Votre maquette arrive en 24&nbsp;h, avec le prix exact.</p></li>
          <li class="reveal"><span class="steps__n">3</span><h3>On ajuste</h3><p>Vos remarques, vos photos, vos horaires.</p></li>
          <li class="reveal"><span class="steps__n">4</span><h3>C’est en ligne</h3><p>En général en un à deux jours.</p></li>
        </ol>
        <p class="seo-price reveal">Maquette offerte · création <b>dès 350&nbsp;CHF</b> · suivi <b>dès 30&nbsp;CHF / mois</b> (hébergement, nom de domaine, petites modifications). Prix exact par écrit avec la maquette. <a href="../#tarifs">Voir les tarifs</a></p>
      </div>
    </section>

    <section class="faq-sec" id="questions" aria-labelledby="faq-title">
      <div class="wrap faq-grid">
        <h2 id="faq-title" class="h2 reveal">Questions</h2>
        <div class="faq">${faq}
        </div>
      </div>
    </section>

    <section class="seo-more" aria-labelledby="more-title">
      <div class="wrap">
        <h2 id="more-title" class="seo-more__title">Voir aussi</h2>
        <ul class="seo-more__list">${others}<li><a href="../">Accueil Wibzo</a></li></ul>
      </div>
    </section>

    <section class="cta" id="contact" aria-labelledby="cta-title">
      <div class="wrap cta__inner">
        <h2 id="cta-title" class="cta__title reveal">Envoyez juste le nom de votre commerce.</h2>
        <div class="cta__side reveal">
          <p>Vous recevez votre maquette en 24&nbsp;h. Gratuitement.</p>
          <a class="btn btn--light btn--lg wa-link" href="https://wa.me/41767574393" target="_blank" rel="noopener">Recevoir ma maquette gratuite</a>
          <p>ou appelez le <a href="tel:${TEL}">076 757 43 93</a></p>
        </div>
      </div>
    </section>
  </main>

  <footer class="foot">
    <nav class="wrap foot__seo" aria-label="Pages">
      ${allLinks.map(l => `<a href="../${l.slug}/">${l.label}</a>`).join("\n      ")}
    </nav>
    <div class="wrap foot__inner">
      <a href="../" class="logo logo--sm" aria-label="Wibzo, accueil">Wibzo</a>
      <p>Sites web pour commerces et artisans · Payerne · <a href="tel:${TEL}">076 757 43 93</a></p>
      <nav aria-label="Liens légaux">
        <a href="../mentions-legales.html">Mentions légales</a>
        <a href="../protection-des-donnees.html">Protection des données</a>
      </nav>
    </div>
  </footer>

  <div class="sticky" id="sticky">
    <a class="btn wa-link" href="https://wa.me/41767574393" target="_blank" rel="noopener">Ma maquette gratuite</a>
    <a class="sticky__call" href="tel:${TEL}" aria-label="Appeler Wibzo">Appeler</a>
  </div>

  <script src="../js/main.js" defer></script>
</body>
</html>
`;
}

for (const p of PAGES) {
  const dir = path.join(SITE, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), render(p));
  console.log("ok", p.slug);
}

// sitemap
const today = new Date().toISOString().slice(0, 10);
const urls = [""].concat(PAGES.map(p => p.slug + "/"))
  .map(u => `  <url><loc>${BASE}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n");
fs.writeFileSync(path.join(SITE, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log("ok sitemap.xml");
