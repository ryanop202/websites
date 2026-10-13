// Maquettes v2 pour les Reels 1 et 2 (commerces 100 % fictifs, photos IA, prix/horaires d'exemple).
var ZIG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='12'%3E%3Cpolygon points='0,12 8,0 16,12' fill='black'/%3E%3C/svg%3E\")";

function stampSVG(txt, center) {
  return '<svg viewBox="0 0 120 120"><defs><path id="stc" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/></defs>' +
    '<circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" stroke-width="2.5"/>' +
    '<circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
    '<text font-family="HG" font-weight="800" font-size="12" fill="currentColor"><textPath href="#stc" textLength="284" lengthAdjust="spacing">' + txt + '</textPath></text>' +
    '<text x="60" y="58" text-anchor="middle" font-family="YS" font-size="19" fill="currentColor">' + center[0] + '</text>' +
    '<text x="60" y="76" text-anchor="middle" font-family="HG" font-weight="800" font-size="7" letter-spacing="1" fill="currentColor">' + center[1] + '</text></svg>';
}

// ---------- Boulangerie du Bourg ----------
function siteBoul() {
  var P = 'photos/boulangerie.jpg';
  return '<div class="site bq" style="--zigm:' + ZIG.replace(/"/g, '&quot;') + '">' +
    '<div class="bq-head el" data-k="head"><div class="bq-mark">Boulangerie<b>du Bourg</b></div><span class="bq-menu">Menu</span></div>' +
    '<div class="bq-eye el" data-k="eye">Boulangerie · Pâtisserie</div>' +
    '<h1 class="bq-h1 el" data-k="h1">Le pain sort<br>du four à <em>6 h 30</em>.</h1>' +
    '<div class="bq-photo el" data-k="photo" style="background-image:url(' + P + ')">' +
      '<div class="bq-stamp el" data-k="stamp">' + stampSVG('FAIT MAISON · CHAQUE MATIN · ', ['Bourg', 'BOULANGERIE']) + '</div></div>' +
    '<div class="bq-ctas el" data-k="cta"><span class="bq-btn">Commander pour demain <i>→</i></span><div class="bq-links"><span>Appeler</span><span>Itinéraire</span></div></div>' +
    '<div class="bq-kraft el" data-k="kraft">' +
      '<div class="bq-h2"><small>Chaque jour</small>Sorties du four</div>' +
      '<div class="bq-hand">encore chaud !</div>' +
      '<div class="bq-four">' +
        '<div class="bq-f now el" data-k="f1"><b>6 h 30</b><span>Croissants au beurre<small>et pains au chocolat</small></span></div>' +
        '<div class="bq-f el" data-k="f2"><b>7 h 00</b><span>Pain au levain<small>miche, bis, seigle</small></span></div>' +
        '<div class="bq-f el" data-k="f3"><b>11 h 00</b><span>Tartelettes du jour<small>selon les fruits</small></span></div>' +
        '<div class="bq-f el" data-k="f4"><b>16 h 30</b><span>Deuxième fournée<small>pour le soir</small></span></div>' +
      '</div></div>' +
    '<div class="bq-comptoir el" data-k="comptoir"><div class="bq-h2"><small>Sur le comptoir</small>Fait ici, ce matin</div>' +
      '<div class="bq-grid">' +
        '<figure class="el" data-k="g1" style="background-image:url(' + P + ');background-position:12% 6%;background-size:330%"><figcaption>Croissants</figcaption></figure>' +
        '<figure class="el" data-k="g2" style="background-image:url(' + P + ');background-position:58% 60%;background-size:360%"><figcaption>Tartelettes</figcaption></figure>' +
        '<figure class="el" data-k="g3" style="background-image:url(' + P + ');background-position:88% 22%;background-size:380%"><figcaption>Viennoiseries</figcaption></figure>' +
      '</div></div>' +
    '<div class="bq-cmd el" data-k="cmd"><b>Commande la veille, c\'est prêt le matin.</b><p>Choisis en ligne, on te le met de côté au comptoir.</p></div>' +
    '<div class="bq-hours el" data-k="hours"><div class="bq-h2"><small>Horaires</small>Passe nous voir</div>' +
      '<div class="bq-open">Ouvert ce matin</div>' +
      '<div style="margin-top:14px"><div class="bq-hrow"><span>Mardi – vendredi</span><b>6 h 30 – 18 h 30</b></div><div class="bq-hrow"><span>Samedi</span><b>6 h 30 – 16 h</b></div><div class="bq-hrow"><span>Dimanche</span><b>7 h – 12 h</b></div></div></div>' +
  '</div>';
}

// ---------- Salon Mélanie ----------
var SM_PREST = [['Coupe femme', 'shampoing, coupe, brushing', '45 min', '65.–'], ['Coupe homme', 'coupe & finitions', '30 min', '38.–'], ['Couleur', 'racines ou complète', '1 h 30', 'dès 95.–'], ['Balayage', 'éclaircissement naturel', '2 h', 'dès 140.–']];
function siteSalon() {
  var P = 'photos/coiffure.jpg';
  var h = '<div class="site sm">' +
    '<div class="sm-head"><span class="sm-mark">Mélanie<small>coiffure</small></span><span class="sm-menu"><i></i><i></i><i></i></span></div>' +
    '<div class="sm-hero"><div class="sm-mirror"><div style="background-image:url(' + P + ')"></div></div>' +
      '<h1 class="sm-h1"><span>Coupe,</span><span>couleur</span><span><i class="amp">&amp;</i> balayage.</span></h1>' +
      '<p class="sm-lead">Sur rendez-vous, du mardi<br>au samedi.</p></div>' +
    '<div class="sm-cta" id="smcta">Réserver un créneau <i>→</i></div>' +
    '<div class="sm-sec"><div class="sm-h2">Prestations <small>Tarifs</small></div><div class="sm-list">';
  SM_PREST.forEach(function (p, i) { h += '<div class="sm-it"><em>0' + (i + 1) + '</em><b>' + p[0] + '<small>' + p[2] + ' · ' + p[1] + '</small></b><span>' + p[3] + '</span></div>'; });
  h += '</div></div><div class="sm-sec"><div class="sm-h2">Le salon <small>Photos</small></div><div class="sm-arch">' +
    '<div style="background-image:url(' + P + ');background-position:6% 30%"></div><div style="background-image:url(' + P + ');background-position:96% 45%"></div></div></div>' +
    '<div class="sm-foot"><span style="font:italic 500 26px/1 BM">Mélanie</span><br>Mar – ven · 9 h – 18 h 30<br>Samedi · 8 h – 14 h</div></div>';
  return h;
}
function bookingSheet() {
  var o = '';
  SM_PREST.forEach(function (p, i) { o += '<div class="sm-opt" id="op' + i + '"><u></u><b>' + p[0] + '<small>' + p[2] + '</small></b><span>' + p[3] + '</span></div>'; });
  var days = [['Mer', '14'], ['Jeu', '15'], ['Ven', '16'], ['Sam', '17']];
  var d = days.map(function (x, i) { return '<div class="sm-day" id="dy' + i + '"><small>' + x[0] + '</small><b>' + x[1] + '</b></div>'; }).join('');
  var slots = [['9:00', 1], ['10:30', 0], ['11:15', 1], ['14:00', 0], ['15:30', 0], ['17:00', 1]];
  var s = slots.map(function (x, i) { return '<div class="sm-slot' + (x[1] ? ' off' : '') + '" id="sl' + i + '">' + x[0] + '</div>'; }).join('');
  return '<div class="sm-sheet" id="sheet"><div class="sm-grab"></div><div class="sm-steps"><i class="on" id="st0"></i><i id="st1"></i><i id="st2"></i></div>' +
    '<div class="sm-pane" id="paneA"><div class="sm-q"><small>Étape 1 sur 3</small>Quelle prestation&nbsp;?</div>' + o + '</div>' +
    '<div class="sm-pane" id="paneB" style="opacity:0"><div class="sm-q"><small>Étape 2 sur 3</small>Quel jour&nbsp;?</div><div class="sm-days">' + d + '</div>' +
      '<div class="sm-sl">Créneaux libres · octobre</div><div class="sm-slots">' + s + '</div></div>' +
    '<div class="sm-go" id="go">Confirmer</div>' +
    '<div class="sm-ok" id="ok"><div class="sm-ring"><div>✓</div></div><h4>C\'est réservé.</h4><p>Confirmation envoyée par e-mail.</p>' +
      '<div class="sm-recap"><div><span>Prestation</span><b>Coupe femme</b></div><div><span>Date</span><b>Jeudi 15 octobre</b></div><div><span>Heure</span><b>14:00</b></div></div></div>' +
  '</div>';
}

// Téléphone v2 (même coque que kit.css, contenu nouveau)
function phone2(id, inner, opts) {
  opts = opts || {};
  return '<div class="ph' + (opts.on ? ' on' : '') + '" id="' + id + '" style="' + (opts.style || '') + '"><div class="scr"><div class="island"></div>' +
    '<div class="sb" style="background:' + (opts.sb || 'rgba(255,255,255,.97)') + '"><span>9:41</span><i>●●● ▮</i></div>' + inner +
    (opts.tag ? '<span class="tagx">' + opts.tag + '</span>' : '') + (opts.extra || '') + '</div></div>';
}

// Fiche Google seule (sans logo, sans note ni avis inventés)
function ficheHTML2() {
  return '<div class="fiche fi2"><div class="f-photos"><div>Aucune photo<br>du salon</div><div><span></span><span></span></div></div>' +
    '<div class="f-body"><div class="f-name2">Salon Mélanie</div><div class="f-cat">Salon de coiffure</div>' +
    '<div class="f-btns"><span>Itinéraire</span><span>Appeler</span><span class="dis">Site Web</span></div>' +
    '<div class="f-line"><u></u>Horaires non renseignés</div><div class="f-line miss"><u></u>Pas de site web</div>' +
    '<div class="f-line miss"><u></u>Pas de prestations ni de prix</div><div class="f-line miss"><u></u>Pas de réservation en ligne</div></div></div>';
}
