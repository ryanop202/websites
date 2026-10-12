// Maquettes fictives (commerces inventés, photos générées par IA) + fiche Google seule.
var SITES = {
  coif: { name: 'Salon Mélanie', kind: 'Coiffeur', photo: 'photos/coiffure.jpg', h1: 'Coiffure &amp; couleur,<br>sur rendez-vous.', kick: 'Coiffure', cta: 'Réserver en ligne',
    bg: '#faf6f2', fg: '#2b1d1a', acc: '#b5654a', line: '#eadfd6', r: '14px', lf: 'italic 400 25px/1 Georgia,serif', hf: 'italic 400 38px/1.05 Georgia,serif',
    h2: 'Prestations', rows: [['Coupe femme', '45 min'], ['Coupe homme', '30 min'], ['Couleur', '1 h 30'], ['Balayage', '2 h']] },
  garage: { name: 'Garage Mercier', kind: 'Garage', photo: 'photos/garage.jpg', h1: 'Entretien, pneus<br>&amp; réparations.', kick: 'Toutes marques', cta: 'Prendre rendez-vous',
    bg: '#f4f6f8', fg: '#111827', acc: '#1d4ed8', line: '#dfe3e8', r: '8px', lf: '800 24px/1 B', hf: '800 40px/1 B',
    h2: 'Services', rows: [['Service annuel', 'dès 1 h'], ['Changement de pneus', '30 min'], ['Freins', '1 h'], ['Expertise', 'sur devis']] },
  boul: { name: 'Boulangerie du Bourg', kind: 'Boulangerie', photo: 'photos/boulangerie.jpg', h1: 'Pain au levain<br>&amp; pâtisseries maison.', kick: 'Depuis le matin', cta: 'Commander pour demain',
    bg: '#fbf7ef', fg: '#3a2a17', acc: '#b06a1f', line: '#ece2cf', r: '999px', lf: '700 22px/1 Georgia,serif', hf: '700 36px/1.05 Georgia,serif',
    h2: 'Nos spécialités', rows: [['Pain au levain', 'tous les jours'], ['Croissants', 'dès 6 h 30'], ['Tartes aux fruits', 'sam. & dim.'], ['Gâteaux sur commande', '48 h']] },
  menu: { name: 'Atelier du Bois', kind: 'Menuisier', photo: 'photos/menuiserie.jpg', h1: 'Menuiserie<br>sur mesure.', kick: 'Artisan', cta: 'Demander un devis',
    bg: '#f6f2ec', fg: '#2a2219', acc: '#7a4f2a', line: '#e4dacb', r: '4px', lf: '800 24px/1 D', hf: '800 42px/1 D',
    h2: 'Réalisations', rows: [['Cuisines', 'sur mesure'], ['Escaliers', 'bois massif'], ['Dressings', 'sur mesure'], ['Portes & fenêtres', 'pose']] },
  cafe: { name: 'Le Tilleul', kind: 'Restaurant', photo: 'photos/cafe.jpg', h1: 'Cuisine du marché,<br>midi &amp; soir.', kick: 'Café · Restaurant', cta: 'Réserver une table',
    bg: '#f3f5f0', fg: '#1f2a22', acc: '#2f6b4a', line: '#dde4da', r: '12px', lf: 'italic 700 26px/1 Georgia,serif', hf: 'italic 700 38px/1.05 Georgia,serif',
    h2: 'La carte', rows: [['Menu du jour', 'midi'], ['Filets de perche', 'saison'], ['Planchettes', 'apéro'], ['Desserts maison', '']] },
  inst: { name: 'Institut Sérénité', kind: 'Institut', photo: 'photos/institut.jpg', h1: 'Soins visage<br>&amp; corps.', kick: 'Bien-être', cta: 'Réserver un soin',
    bg: '#faf7f4', fg: '#3a302b', acc: '#9c7766', line: '#ece4dd', r: '999px', lf: '600 23px/1 D', hf: '600 38px/1.05 D',
    h2: 'Soins', rows: [['Soin du visage', '1 h'], ['Massage relaxant', '1 h'], ['Épilation', '30 min'], ['Beauté des mains', '45 min']] }
};

function siteHTML(key) {
  var s = SITES[key], st = '';
  ['bg', 'fg', 'acc', 'line', 'r', 'lf', 'hf'].forEach(function (k) { st += '--' + k + ':' + s[k] + ';'; });
  var h = '<div class="site" style="' + st + '">' +
    '<div class="s-head"><span class="s-logo">' + s.name + '</span><span class="s-burg"></span></div>' +
    '<div class="s-hero" style="background-image:url(' + s.photo + ')"><span class="s-kick">' + s.kick + '</span><div class="s-h1">' + s.h1 + '</div></div>' +
    '<div class="s-cta" data-cta>' + s.cta + '</div>' +
    '<div class="s-info"><span>Appeler</span><span>Itinéraire</span><span>Horaires</span></div>' +
    '<div class="s-h2">' + s.h2 + '</div>';
  s.rows.forEach(function (r) { h += '<div class="s-row">' + r[0] + '<small>' + r[1] + '</small></div>'; });
  h += '<div class="s-h2">Galerie</div><div class="s-gal">' +
    ['20% 30%', '80% 40%', '40% 85%', '75% 80%'].map(function (p) { return '<i style="background-image:url(' + s.photo + ');background-position:' + p + '"></i>'; }).join('') + '</div>' +
    '<div class="s-h2">Horaires</div><span class="s-open">Ouvert aujourd’hui</span><div class="s-hrs" style="margin-top:8px">Lun–ven · 8 h–18 h 30<br>Samedi · 8 h–16 h</div><div style="height:140px"></div></div>';
  return h;
}
function phoneHTML(id, key, opts) {
  opts = opts || {};
  return '<div class="ph' + (opts.on ? ' on' : '') + '" id="' + id + '" style="' + (opts.style || '') + '"><div class="scr"><div class="island"></div>' +
    '<div class="sb"><span>9:41</span><i>●●● ▮</i></div>' + (key === 'fiche' ? ficheHTML() : siteHTML(key)) +
    (opts.tag ? '<span class="tagx">Exemple de maquette</span>' : '') + (opts.extra || '') + '</div></div>';
}
function ficheHTML() {
  return '<div class="fiche"><div class="f-photos"><div>Aucune photo<br>du commerce</div><div><span></span><span></span></div></div>' +
    '<div class="f-body"><div class="f-name"></div><div class="f-st"><b>4,6</b><i>★★★★★</i><b>(14)</b></div><div class="f-cat">Commerce local · Suisse romande</div>' +
    '<div class="f-btns"><span>Itinéraire</span><span>Appeler</span><span class="dis">Site Web</span></div>' +
    '<div class="f-line"><u></u>Horaires non renseignés</div><div class="f-line miss"><u></u>Pas de site web</div>' +
    '<div class="f-line miss"><u></u>Pas de prestations ni de prix</div><div class="f-line miss"><u></u>Pas de réservation en ligne</div></div></div>';
}
function notifHTML(id, top, title, sub, when) {
  return '<div class="nt" id="' + id + '" style="top:' + top + 'px"><i>✓</i><div><b>' + title + '</b><small>' + sub + '</small></div><em>' + when + '</em></div>';
}
