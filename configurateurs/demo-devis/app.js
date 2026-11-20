/* Wibzo — calculateur de devis par étapes : affichage et navigation.
   Adresse : #<langue>-<métier>-<nom-de-l-entreprise>, ex. #fr-nettoyage-globe-nettoyage
   Métiers : nettoyage, cloture, peinture, demenagement, jardin. */
(() => {
const T = window.TEXTES, Z = window.ZONES, M = window.METIERS;

// ---------- Dessins (traits « plan technique ») ----------
const svg = (vb, corps, cls = '') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="${cls}">${corps}</svg>`;
const COCHE = svg('0 0 24 24', '<path d="M5 12.5l4.5 4.5L19 7.5" stroke-width="2.4"/>');
const PICTOS = {
  studio: '<rect x="5" y="4" width="14" height="17" rx="1"/><path d="M9 21v-4h6v4M9 8h2M13 8h2M9 12h2M13 12h2"/>',
  appart: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 12h8M11 4v16M15 16h3M15 8h3"/>',
  villa: '<path d="M3 11l9-7 9 7"/><path d="M5 10v11h14V10M10 21v-6h4v6"/>',
  bain: '<path d="M4 12h16v3a5 5 0 01-5 5H9a5 5 0 01-5-5z"/><path d="M6 12V5a2 2 0 012-2h1a2 2 0 012 2"/>',
  balcon: '<path d="M3 13h18M3 13v8M21 13v8M7 13v8M11 13v8M15 13v8M19 13v8M6 13V4h12v9"/>',
  cave: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  stores: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 7h16M4 11h16M4 15h16M12 15v6"/>',
  four: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><rect x="7" y="9" width="10" height="8" rx="1"/><path d="M8 6h.01M12 6h.01M16 6h.01"/>',
  brille: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"/>',
  tache: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M8 10c1-2 3-1 3 1s3 2 4 0M7 15c2-1 3 1 5 0"/>',
  eclair: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  agenda: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h2M12 14h2M16 14h.01"/>',
  horloge: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  grillage: '<path d="M3 20V6M9 20V6M15 20V6M21 20V6M3 8l18 10M3 18L21 8"/>',
  rigide: '<path d="M3 20V5M21 20V5M3 8h18M3 17h18M7 8v9M11 8v9M15 8v9M19 8v9"/>',
  bois: '<path d="M4 20V7l2-2 2 2v13M10 20V7l2-2 2 2v13M16 20V7l2-2 2 2v13M3 11h18M3 16h18"/>',
  plein: '<rect x="3" y="5" width="18" height="15" rx="1"/><path d="M3 9h18M3 13h18M3 17h18"/>',
  hauteur: '<path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4M4 21h16"/>',
  porte: '<rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="15" cy="12" r="1"/>',
  portail: '<path d="M3 21V4M21 21V4M3 7h18M3 20h18M7 7v13M11 7v13M15 7v13M3 20L21 7"/>',
  benne: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
  muret: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18M3 15h18M9 5v5M15 10v5M9 15v4"/>',
  pente: '<path d="M3 20h18L3 9z"/><path d="M7 20v-3"/>',
  rouleau: '<rect x="4" y="3" width="14" height="6" rx="1.5"/><path d="M18 6h2v5h-8v3"/><rect x="10.5" y="14" width="3" height="7" rx="1"/>',
  escalier: '<path d="M3 20h5v-4h4v-4h4V8h5"/>',
  murOk: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M8 12l3 3 5-6"/>',
  murMoyen: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M9 8l1 3-2 2 1 3"/>',
  murMauvais: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M8 7l2 4-3 3 2 4M15 6l-1 4 3 2-2 5"/>',
  plafond: '<path d="M3 5h18M6 5v3M18 5v3"/><rect x="5" y="11" width="14" height="9" rx="1"/>',
  palette: '<path d="M12 3a9 9 0 100 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 004-4c0-4.5-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>',
  canape: '<path d="M4 11V8a2 2 0 012-2h12a2 2 0 012 2v3"/><path d="M3 11h18v6H3zM5 17v2M19 17v2"/>',
  carton: '<path d="M4 8l8-4 8 4-8 4z"/><path d="M4 8v8l8 4 8-4V8"/>',
  outils: '<path d="M14 6a4 4 0 00-5 5l-6 6 3 3 6-6a4 4 0 005-5l-2 2-2-1-1-2z"/>',
  piano: '<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M7 6v7M11 6v7M15 6v7M19 6v7M3 13h18"/>',
  lift: '<path d="M4 21L14 5M8 21L18 5M6 17h6M9 12h6M12 8h5"/>',
  gazon: '<path d="M3 20h18M6 20c0-5-2-8-2-8M10 20c0-6 1-10 1-10M14 20c0-5 2-9 2-9M18 20c0-4 2-6 2-6"/>',
  haie: '<path d="M3 20h18M4 20v-8a4 4 0 014-4h8a4 4 0 014 4v8"/><path d="M8 12h.01M12 11h.01M16 13h.01"/>',
  feuille: '<path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z"/><path d="M5 19l8-8"/>',
  fleur: '<circle cx="12" cy="9" r="2.5"/><path d="M12 6.5V4M12 14v7M9.5 9H7M17 9h-2.5M8 21c0-3 4-4 4-4s4 1 4 4"/>',
  bouclier: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'
};
// Carte d'option : pictogramme agrandi sur papier quadrillé + cote bleue
function dessinOption(o) {
  if (o.photo) return `<img src="${o.photo}" alt="" loading="lazy">`;
  const p = PICTOS[o.ic] || PICTOS.appart, cote = o.cote ? `
    <g stroke="#2B4C7E" stroke-width="1"><path d="M110 168h100M110 163v10M210 163v10"/></g>
    <rect x="128" y="158" width="64" height="20" fill="#F3EFE6" stroke="none"/>
    <text x="160" y="172" text-anchor="middle" fill="#2B4C7E" stroke="none" font-family="JetBrains Mono, monospace" font-size="12">${o.cote}</text>` : '';
  return svg('0 0 320 200', `<g transform="translate(108 22) scale(4.3)" stroke-width=".45">${p}</g>${cote}`);
}
// Cartes de zone : petits paysages au trait (lac, vignes, montagnes, pont…)
function dessinZone(art) {
  const sol = '<path d="M0 168h320" stroke-width="1.2"/>';
  const lac = '<path d="M0 150c20-4 40 4 60 0s40-4 60 0 40 4 60 0 40-4 60 0 40 4 80 0M20 160c16-3 32 3 48 0M200 160c16-3 32 3 48 0" stroke="#2B4C7E" stroke-width="1"/>';
  const monts = '<path d="M0 132l48-54 30 30 44-62 52 66 30-34 56 54h60" stroke-width="1.3"/><path d="M110 58l12-12 12 14-8-2-4 4z" stroke-width="1"/>';
  const s = {
    'lac-jet': `${monts.replace('stroke-width="1.3"', 'stroke-width="1" opacity=".5"')}${lac}<path d="M160 148V40" stroke="#2B4C7E" stroke-width="2"/><path d="M160 40c-6 20-10 50-16 108M160 40c6 20 10 50 16 108" stroke="#2B4C7E" stroke-width=".8" opacity=".6"/><path d="M150 148h20"/>`,
    'vignes': `${lac.replace(/150/g, '160')}<path d="M0 118c60-40 140-62 320-70" stroke-width="1.2"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${20 + i * 46} ${116 - i * 9}c10-4 20-4 30-6" stroke-width="1"/><path d="M${24 + i * 46} ${130 - i * 9}h28" stroke-width=".7" stroke-dasharray="2 4"/>`).join('')}<path d="M232 66v-16h20v16M242 50v-8"/>`,
    'pont': `${sol}<path d="M0 120h320" stroke-width="1.3"/>${[0, 1, 2, 3].map(i => `<path d="M${30 + i * 70} 168v-28a35 22 0 0170 0v28" stroke-width="1.1"/>`).join('')}<path d="M250 120V54l14-22 14 22v66M264 32v-12M256 70h16M256 90h16"/><path d="M40 120V96h30v24M55 96V84"/>${lac.replace(/150/g, '178')}`,
    'chateau': `${lac}<path d="M60 140V86h50v54M60 86l25-26 25 26M120 140V70l18-22 18 22v70M138 48V36M130 92h16M175 140V96h70v44M175 96h70M190 96V84h10v12M220 96V84h10v12" stroke-width="1.2"/>`,
    'montagnes': `${monts}<path d="M0 168h320" stroke-width="1"/><path d="M40 168v-16l6-10 6 10v16M240 168v-22l8-12 8 12v22" stroke-width="1"/><path d="M200 168v-30h24v30M212 138v-8" stroke-width="1"/>`,
    'tours': `${lac}<path d="M110 140V60l12-18 12 18v80M150 140V60l12-18 12 18v80M122 42V30M162 42V30M100 140V96h88v44M116 76h12M156 76h12" stroke-width="1.2"/><path d="M30 140v-34h40v34M220 140v-44h50v44" stroke-width=".9" opacity=".7"/>`,
    'fleuve': `<path d="M0 132c80 10 160-10 320 6M0 150c80 10 160-10 320 6" stroke="#2B4C7E" stroke-width="1"/><path d="M90 128V64l14-20 14 20v64M130 128V64l14-20 14 20v64M80 128V90h88v38M104 44V32M144 44V32" stroke-width="1.2"/><path d="M0 132h70M190 130h130" stroke-width="1"/><path d="M200 128v-30h40v30M250 128v-22h36v22" stroke-width=".9" opacity=".7"/>`,
    'lac-montagnes': `${monts}${lac}<path d="M60 150l10-8h120l10 8M78 142v-12h104v12M90 130l8-12h64l8 12" stroke-width="1"/>`
  };
  return svg('0 0 320 200', `<g stroke-width="1.2">${s[art] || s.montagnes}</g>`);
}
// Grand dessin en fond du hero (plan d'appartement, clôture en élévation, plan de jardin)
function dessinHero(type) {
  const c = (x1, y, x2, txt) => `<g stroke-width="1"><path d="M${x1} ${y}h${x2 - x1}M${x1} ${y - 6}v12M${x2} ${y - 6}v12"/></g><text x="${(x1 + x2) / 2}" y="${y - 8}" text-anchor="middle" fill="currentColor" stroke="none" font-family="JetBrains Mono, monospace" font-size="13">${txt}</text>`;
  const plans = {
    appartement: `<g stroke-width="2"><path d="M200 120h800v420H200z"/><path d="M200 330h300M500 120v130M500 300v240M700 120v220h300M760 340v200M500 420h120"/></g>
      <g stroke-width="1"><path d="M500 250a50 50 0 0150 50M700 340a40 40 0 0040 40M260 120v-8h120v8M820 540v8h120v-8"/><rect x="560" y="160" width="100" height="60"/><rect x="230" y="370" width="140" height="70" rx="6"/><circle cx="870" cy="440" r="26"/><rect x="800" y="380" width="40" height="70"/></g>
      ${c(200, 90, 1000, '12.40 m')}<g stroke-width="1"><path d="M1030 120v420M1024 120h12M1024 540h12"/></g><text x="1050" y="335" fill="currentColor" stroke="none" font-family="JetBrains Mono, monospace" font-size="13">6.80 m</text>
      <text x="340" y="240" fill="currentColor" stroke="none" font-family="JetBrains Mono, monospace" font-size="12">SÉJOUR 28 m²</text><text x="560" y="480" fill="currentColor" stroke="none" font-family="JetBrains Mono, monospace" font-size="12">CH. 14 m²</text><text x="800" y="230" fill="currentColor" stroke="none" font-family="JetBrains Mono, monospace" font-size="12">CUISINE 11 m²</text>`,
    cloture: `<path d="M120 520h960" stroke-width="2"/>${Array.from({ length: 13 }, (_, i) => `<path d="M${140 + i * 76} 520V250" stroke-width="2"/>`).join('')}
      <g stroke-width="1">${Array.from({ length: 12 }, (_, i) => Array.from({ length: 7 }, (_, j) => `<path d="M${148 + i * 76 + j * 9} 512V262"/>`).join('')).join('')}<path d="M140 270h912M140 500h912"/></g>
      ${c(140, 220, 444, '4 × 2.50 m')}<g stroke-width="1"><path d="M1100 250v270M1094 250h12M1094 520h12"/></g><text x="1112" y="390" fill="currentColor" stroke="none" font-family="JetBrains Mono, monospace" font-size="13">1.80 m</text>`,
    jardin: `<g stroke-width="2"><path d="M180 110h840v460H180z"/><rect x="420" y="170" width="300" height="190"/></g>
      <g stroke-width="1"><path d="M180 140c40-12 80-12 120 0s80 12 120 0M180 160c40-12 80-12 120 0" stroke-dasharray="4 6"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="${210 + i * 90}" cy="540" r="18"/>`).join('')}${Array.from({ length: 4 }, (_, i) => `<circle cx="${990}" cy="${160 + i * 90}" r="20"/>`).join('')}<path d="M570 360v210M550 570h40"/><circle cx="300" cy="300" r="60"/><circle cx="300" cy="300" r="4"/></g>
      <text x="470" y="270" fill="currentColor" stroke="none" font-family="JetBrains Mono, monospace" font-size="13">MAISON</text><text x="250" y="420" fill="currentColor" stroke="none" font-family="JetBrains Mono, monospace" font-size="12">GAZON 400 m²</text><text x="760" y="510" fill="currentColor" stroke="none" font-family="JetBrains Mono, monospace" font-size="12">HAIE 30 m</text>
      ${c(180, 80, 1020, '32.00 m')}`
  };
  return svg('0 0 1200 640', plans[type] || plans.appartement);
}

// ---------- État ----------
const SUFFIXES = { sa: 'SA', ag: 'AG', gmbh: 'GmbH', sarl: 'Sàrl', sagl: 'Sagl', snc: 'SNC', kg: 'KG' };
let L = 'fr', metier = 'nettoyage', entreprise = '', etape = 0, v = {}, repondu = new Set(), zone = null, ref = '', minuteurVille = null;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const chf = n => 'CHF ' + (Math.round(n / 10) * 10).toLocaleString('de-CH');
const fourchette = t => `${chf(t * 0.92)} – ${chf(t * 1.1)}`;

function lireAdresse() {
  const h = decodeURIComponent(location.hash.replace(/^#/, '')).toLowerCase().split('-').filter(Boolean);
  if (h[0] === 'fr' || h[0] === 'de') L = h.shift();
  if (h[0] && M[h[0]]) metier = h.shift();
  entreprise = h.map(w => SUFFIXES[w] || w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
const m = () => M[metier];
// Étape 0 = zone (ajoutée à chaque métier), puis les étapes du métier
const etapes = () => [{ id: 'zone', type: 'zone' }, ...m().etapes];
function parDefaut() {
  const d = {};
  for (const e of m().etapes) {
    if (e.type === 'mesure') d[e.id] = e.val;
    if (e.type === 'options') d[e.id] = [];
    if (e.type === 'mesures') e.items.forEach(i => d[i.id] = i.val);
    if (e.type === 'cartes') d[e.id] = (e.opts.find(o => o.v === e.val) || e.opts[0]).v;
  }
  return d;
}
const lignes = val => m().calcul(val, L).filter(l => Math.abs(l[1]) > 0.5);
const total = val => lignes(val).reduce((a, l) => a + l[1], 0);
function reinitialiser() { v = parDefaut(); repondu = new Set(); etape = 0; zone = null; }
const nomAffiche = () => entreprise || T[L].notreEntreprise;
const initiales = () => (entreprise || m()[L].nom).split(/\s+/).filter(w => /^[A-Za-zÀ-ÿ]/.test(w) && !/^(SA|AG|GmbH|Sàrl|Sagl|SNC|KG|et|und|&)$/.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'W';

// ---------- Page (tout sauf la carte d'étapes) ----------
function afficherPage() {
  const t = T[L], mt = m();
  document.documentElement.lang = L;
  document.title = `${t.navCalc} · ${mt[L].nom}${entreprise ? ' · ' + entreprise : ''}`;
  $('logo').textContent = initiales();
  $('nomEntreprise').textContent = entreprise || mt[L].nom;
  $('badgeDemo').textContent = t.demo;
  $('navCalc').textContent = t.navCalc; $('navTarifs').textContent = t.navTarifs; $('navFaq').textContent = t.navFaq;
  $('choixMetier').innerHTML = Object.entries(M).map(([k, x]) => `<option value="${k}"${k === metier ? ' selected' : ''}>${x[L].nom}</option>`).join('');
  $('langue').textContent = L === 'fr' ? 'DE' : 'FR';
  $('surTitre').textContent = entreprise ? t.pour(entreprise) : mt[L].nom;
  $('titreService').textContent = `${t.calculateur} — ${mt[L].service}`;
  $('motA').textContent = t.a;
  $('sousTitre').textContent = mt[L].sous;
  $('heroPlan').innerHTML = dessinHero(mt.plan);
  lancerVilles();
  // Tarifs
  $('tarifsSur').textContent = `${t.tarifsSur} · ${mt[L].nom}`;
  $('tarifsT').textContent = mt[L].combien;
  $('tarifsP').textContent = t.resNote;
  $('tarifCarte').innerHTML = `<div class="etiquette">${mt[L].nom}</div><div class="chiffre">${mt.tarif.chiffre}<small>${mt.tarif.unite[L]}</small></div><div>${mt.tarif.sous[L]}</div>
    <ul>${t.devisLignes.map(x => `<li>${svg('0 0 24 24', '<path d="M5 12.5l4.5 4.5L19 7.5" stroke-width="2.4"/>')}${x}</li>`).join('')}</ul><a class="btn" href="#calculer" data-calc>${t.calculer}</a>`;
  const tb = mt.tableau, d = parDefaut();
  $('tableTarifs').innerHTML = `<thead><tr>${tb.cols[L].map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${tb.lignes.map(r => r.cote
    ? `<tr><td>${r.nom(L)}</td><td>${r.cote}</td><td class="num">${chf(r.de)} – ${chf(r.a)}</td></tr>`
    : `<tr><td>${r.nom(L)}</td><td class="num">${fourchette(total({ ...d, ...r.v1 }))}</td><td class="num">${fourchette(total({ ...d, ...r.v2 }))}</td></tr>`).join('')}</tbody>`;
  // Comparatif
  $('compSur').textContent = t.compSur; $('compT').textContent = t.compT; $('compP').textContent = t.compP;
  $('tableComp').innerHTML = `<thead><tr>${t.compCols.map((c, i) => `<th scope="col"${i === 2 ? ' class="nous"' : ''}>${c}</th>`).join('')}</tr></thead><tbody>${t.compLignes.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="nous"><b>${r[2]}</b></td></tr>`).join('')}</tbody>`;
  // Zones
  $('zonesSur').textContent = t.zonesSur; $('zonesT').textContent = t.zonesT(nomAffiche()); $('zonesP').textContent = t.zonesP;
  $('listeZones').innerHTML = Z[L].map(z => `<div class="zone"><h3>${z.nom}</h3><div class="lieux">${z.lieux.map(x => `<span>${x}</span>`).join('')}</div></div>`).join('');
  // FAQ + bas de page
  $('faqSur').textContent = t.faqSur; $('faqT').textContent = t.faqT;
  $('faq').innerHTML = mt.faq[L].map(([q, r]) => `<details><summary>${q}</summary><p>${r}</p></details>`).join('');
  $('basNote').textContent = t.bas; $('basWibzo').textContent = t.fait;
  // Liens internes : défiler sans toucher à l'adresse (le # porte la langue, le métier et l'entreprise)
  document.querySelectorAll('a[href^="#"]').forEach(a => a.onclick = e => { e.preventDefault(); const c = document.getElementById(a.getAttribute('href').slice(1)); if (c) c.scrollIntoView({ behavior: 'smooth' }); });
}
// Ville du titre : défile tant que la zone n'est pas choisie
function lancerVilles() {
  clearInterval(minuteurVille);
  const el = $('ville'), villes = zone ? [zone.lieux[0]] : T[L].aVilles; let i = 0;
  el.textContent = villes[0]; el.classList.remove('sort');
  if (villes.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  minuteurVille = setInterval(() => { el.classList.add('sort'); setTimeout(() => { i = (i + 1) % villes.length; el.textContent = villes[i]; el.classList.remove('sort'); }, 350); }, 2600);
}

// ---------- Carte d'étapes ----------
function enTete(n, i) {
  const t = T[L];
  return `<div class="etape-info"><span>${t.etape(i + 1, n)}</span><span class="mono">${Math.round(i / Math.max(1, n - 1) * 100)} %</span></div>
    <div class="segments">${Array.from({ length: n }, (_, k) => `<i class="${k < i ? 'fait' : k === i ? 'ici' : ''}"></i>`).join('')}</div>`;
}
function direct() {
  if (!repondu.size) return '';
  return `<div class="direct"><span>${T[L].direct}</span><strong id="directPrix">${fourchette(total(v))}</strong></div>`;
}
function majDirect() { const el = $('directPrix'); if (el) el.textContent = fourchette(total(v)); else if (repondu.size) afficherEtape(); }

function afficherEtape() {
  const t = T[L], E = etapes(), n = E.length, c = $('carte');
  if (etape >= n) return [afficherResultat, afficherFormulaire, afficherMerci][etape - n]();
  const e = E[etape];
  let titre = e.type === 'zone' ? t.zoneQ : e[L], aide = e.type === 'zone' ? t.zoneAide : e['aide' + L], corps = '', serre = false;
  if (e.type === 'zone') {
    corps = Z[L].map(z => carte({ v: z.v, titre: z.nom, sous: z.lieux.slice(0, 3).join(' · '), dessin: dessinZone(z.art), coche: zone && zone.v === z.v, radio: true })).join('');
  } else if (e.type === 'cartes') {
    serre = e.opts.length > 4;
    corps = e.opts.map(o => carte({ v: o.v, titre: o[L][0], sous: o[L][1], dessin: dessinOption(o), coche: repondu.has(e.id) && v[e.id] === o.v, radio: true })).join('');
  } else if (e.type === 'options') {
    corps = e.opts.map(o => carte({ v: o.v, titre: o[L][0], sous: o[L][1], dessin: dessinOption(o), coche: (v[e.id] || []).includes(o.v), radio: false, plus: prixOption(e, o) })).join('');
  }
  let bloc = '';
  if (e.type === 'mesure') {
    bloc = `<div class="mesure"><div class="mesure-val" id="valeur">${v[e.id]}<span>${e.unite}</span></div>
      <input type="range" id="curseur-${metier}-${e.id}" min="${e.min}" max="${e.max}" step="${e.pas}" value="${v[e.id]}" aria-label="${esc(e[L])}">
      <div class="cote"><span>${e.min} ${e.unite}</span><span>${e.max} ${e.unite}</span></div>
      <div class="puces">${e.puces.map(p => `<button type="button" class="puce" data-p="${p}" aria-pressed="${+v[e.id] === p}">${p} ${e.unite}</button>`).join('')}</div></div>`;
  } else if (e.type === 'mesures') {
    bloc = `<div class="mesure">${e.items.map(i => `<div class="sous-mesure"><label for="curseur-${metier}-${i.id}">${i[L]} <output id="sortie-${i.id}">${v[i.id]}</output></label><input type="range" id="curseur-${metier}-${i.id}" data-m="${i.id}" min="${i.min}" max="${i.max}" step="1" value="${v[i.id]}"></div>`).join('')}</div>`;
  } else {
    bloc = `<div class="choix${serre ? ' serre' : ''}" ${e.type === 'options' ? '' : `role="radiogroup" aria-label="${esc(titre)}"`}>${corps}</div>${e.type === 'zone' ? '' : ''}`;
  }
  const choisi = e.type === 'zone' ? !!zone : e.type === 'cartes' ? repondu.has(e.id) : true;
  const libSuivant = e.type === 'options' && !(v[e.id] || []).length ? t.aucune : etape === n - 1 ? t.voirPrix : t.suivant;
  c.innerHTML = `${enTete(n, etape)}<div class="entre" style="display:grid;gap:18px"><h2 class="question">${titre}</h2>${aide ? `<p class="aide">${aide}</p>` : ''}${bloc}</div>
    <div class="pied">${direct()}<div class="boutons"><button type="button" class="btn${etape === 0 ? ' invisible' : ''}" id="retour">${t.retour}</button>
    <button type="button" class="btn principal" id="suivant"${choisi ? '' : ' disabled'} title="${choisi ? '' : esc(t.choisir)}">${libSuivant}</button></div></div>`;

  c.querySelectorAll('.option').forEach(b => b.onclick = () => {
    const val = b.dataset.v;
    if (e.type === 'zone') { zone = Z[L].find(z => z.v === val); lancerVilles(); return avancerApres(); }
    if (e.type === 'cartes') {
      v[e.id] = val; repondu.add(e.id);
      const lie = m().etapes.find(x => x.depuis === e.id); if (lie) v[lie.id] = choix(e, val).m;
      return avancerApres();
    }
    const a = v[e.id] || []; v[e.id] = a.includes(val) ? a.filter(x => x !== val) : [...a, val]; repondu.add(e.id); afficherEtape();
  });
  const r = c.querySelector('input[type=range]:not([data-m])');
  if (r) r.oninput = () => { v[e.id] = +r.value; repondu.add(e.id); $('valeur').innerHTML = `${r.value}<span>${e.unite}</span>`; c.querySelectorAll('.puce').forEach(p => p.setAttribute('aria-pressed', +p.dataset.p === +r.value)); majDirect(); };
  c.querySelectorAll('.puce').forEach(p => p.onclick = () => { v[e.id] = +p.dataset.p; repondu.add(e.id); afficherEtape(); });
  c.querySelectorAll('input[data-m]').forEach(x => x.oninput = () => { v[x.dataset.m] = +x.value; repondu.add(e.id); $('sortie-' + x.dataset.m).textContent = x.value; majDirect(); });
  $('retour').onclick = () => aller(-1);
  $('suivant').onclick = () => { if (!choisi) return; if (e.type !== 'cartes' && e.type !== 'zone') repondu.add(e.id); aller(1); };
}
function carte({ v: val, titre, sous, dessin, coche, radio, plus }) {
  return `<button type="button" class="option" data-v="${val}" ${radio ? `role="radio" aria-checked="${coche}"` : `aria-pressed="${coche}"`}>
    <span class="coche">${COCHE}</span><span class="visuel">${dessin}</span>
    <span class="texte"><b>${titre}</b>${sous ? `<small>${sous}</small>` : ''}${plus ? `<span class="plus">${plus}</span>` : ''}</span></button>`;
}
// Prix ajouté par une option, avec les réponses actuelles
function prixOption(e, o) {
  const sans = { ...v, [e.id]: (v[e.id] || []).filter(x => x !== o.v) }, avec = { ...v, [e.id]: [...(v[e.id] || []).filter(x => x !== o.v), o.v] };
  const d = total(avec) - total(sans); return d > 0 ? `+ ${chf(d)}` : '';
}
function choix(e, val) { return e.opts.find(o => o.v === val) || e.opts[0]; }
function avancerApres() { afficherEtape(); setTimeout(() => aller(1), 260); }
function aller(d) {
  etape = Math.max(0, etape + d); afficherEtape();
  const c = $('calculer'); if (c.getBoundingClientRect().top < 0) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function afficherResultat() {
  const t = T[L], ls = lignes(v), tot = ls.reduce((a, l) => a + l[1], 0), n = etapes().length;
  $('carte').innerHTML = `${enTete(n + 1, n)}<div class="resultat entre">
    <div class="prix-bloc"><div class="etiquette">${t.resultat}${zone ? ` · ${zone.nom}` : ''}</div><div class="prix">${fourchette(tot)}</div><p>${t.resNote}</p></div>
    <div><div class="titre-bloc">${t.detail}</div><ul class="detail">${ls.map(l => `<li><span>${esc(l[0])}</span><span>${l[1] < 0 ? '− ' : ''}${chf(Math.abs(l[1]))}</span></li>`).join('')}<li class="total"><span>${t.total}</span><span>${chf(tot)}</span></li></ul></div>
    <div><div class="titre-bloc">${t.inclus}</div><ul class="inclus">${m().inclus[L].map(x => `<li>${svg('0 0 24 24', PICTOS.bouclier, '')}<span>${x}</span></li>`).join('')}</ul></div>
    <div class="boutons"><button type="button" class="btn" id="retour">${t.retour}</button><button type="button" class="btn principal" id="suivant">${t.offre}</button></div></div>`;
  $('retour').onclick = () => aller(-1); $('suivant').onclick = () => aller(1);
}
function afficherFormulaire() {
  const t = T[L], n = etapes().length, auj = new Date().toISOString().slice(0, 10);
  $('carte').innerHTML = `${enTete(n + 1, n)}<form class="formulaire entre" id="form" novalidate>
    <h2 class="question">${t.offre}</h2>
    <div class="ligne2"><div class="champ"><label for="fNom">${t.nom}</label><input id="fNom" autocomplete="name"></div><div class="champ"><label for="fTel">${t.tel}</label><input id="fTel" type="tel" autocomplete="tel"></div></div>
    <div class="ligne2"><div class="champ"><label for="fMail">${t.mail}</label><input id="fMail" type="email" autocomplete="email"></div><div class="champ"><label for="fNpa">${t.npa}</label><input id="fNpa" autocomplete="postal-code" value="${zone ? esc(zone.lieux[0]) : ''}"></div></div>
    <div class="ligne2"><div class="champ"><label for="fDate">${t.date}</label><input id="fDate" type="date" min="${auj}"></div><div class="champ"><label for="fRappel">${t.rappel}</label><select id="fRappel">${t.creneaux.map(x => `<option>${x}</option>`).join('')}</select></div></div>
    <div class="champ"><label for="fMsg">${t.remarques}</label><textarea id="fMsg" rows="3"></textarea></div>
    <div class="erreur" id="fErr" hidden>${t.manque}</div>
    <div class="boutons"><button type="button" class="btn" id="retour">${t.retour}</button><button type="submit" class="btn principal">${t.envoyer}</button></div></form>`;
  $('retour').onclick = () => aller(-1);
  $('form').onsubmit = e => {
    e.preventDefault();
    if (!$('fTel').value.trim() && !$('fMail').value.trim()) { $('fErr').hidden = false; return; }
    ref = metier.slice(0, 3).toUpperCase() + '-' + String(Date.now()).slice(-6); aller(1);
  };
}
function afficherMerci() {
  const t = T[L], nom = esc(nomAffiche());
  $('carte').innerHTML = `<div class="merci entre"><div class="rond">${COCHE}</div><h2 class="question">${t.merci}</h2><p style="margin:0">${t.merciP(nom)}</p>
    <div>${t.ref} : <b class="mono">${ref}</b></div><div class="note-demo">${t.noteDemo(nom)}</div>
    <div class="boutons"><span></span><button type="button" class="btn" id="encore">${t.recommencer}</button></div></div>`;
  $('encore').onclick = () => { reinitialiser(); lancerVilles(); afficherEtape(); };
}

// ---------- Démarrage ----------
$('choixMetier').onchange = e => { metier = e.target.value; reinitialiser(); afficherPage(); afficherEtape(); };
$('langue').onclick = () => { L = L === 'fr' ? 'de' : 'fr'; zone = null; afficherPage(); afficherEtape(); };
addEventListener('hashchange', () => { lireAdresse(); reinitialiser(); afficherPage(); afficherEtape(); });
lireAdresse(); reinitialiser(); afficherPage(); afficherEtape();
window.__devis = { get etat() { return { L, metier, entreprise, etape, v, zone }; } };
})();
