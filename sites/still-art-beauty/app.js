// Tarifs et durées : page Salonkee de Still&Art Beauty (archive mars 2026), traduits de l'allemand.
var TEL = "41795314030";

var SOINS = [
  { id: "visage", fr: "Soins du visage", de: "Gesichtsbehandlungen",
    sub: { fr: "Microneedling, radiofréquence, carbon peeling, soins classiques", de: "Microneedling, Radiofrequenz, Carbon Peeling, klassische Pflege" },
    items: [
      { fr: "Soin du visage femme", de: "Gesichtspflege für Frauen", p: 155, d: 90,
        nfr: "Soin classique pour revitaliser la peau : nettoyage en profondeur, mise en forme des sourcils, massage du visage et du décolleté.",
        nde: "Klassische Gesichtspflege zur Revitalisierung der Haut: Tiefenreinigung, Brauen façonnieren, Gesichts- und Décolleté-Massage." },
      { fr: "Manfacial, soin du visage homme", de: "Manfacial (Gesichtspflege für Männer)", p: 149, d: 60,
        nfr: "Nettoyage, peeling, extraction, massage du visage, masque, soin final.",
        nde: "Reinigung, Peeling, Ausreinigung, Gesichtsmassage, Maske, Abschlusspflege." },
      { fr: "Microneedling PEN", de: "Microneedling PEN Behandlung", p: 170, d: 60 },
      { fr: "Radiofréquence", de: "Radiofrequenz Behandlung", p: 190, d: 60 },
      { fr: "Microneedling + radiofréquence, visage entier", de: "Microneedling mit Radiofrequenz, ganzes Gesicht", p: 200, d: 60 },
      { fr: "Carbon peeling", de: "Carbon Peeling Behandlung", p: 190, d: 60 },
      { fr: "Global Eye Con, soin des yeux anti-âge", de: "Global Eye Con Augenbehandlung (Antiage)", p: 75, d: 20 }
    ] },
  { id: "epil", fr: "Épilation durable", de: "Dauerhafte Haarentfernung",
    sub: { fr: "Du visage au corps entier, zone par zone", de: "Vom Gesicht bis zum ganzen Körper, Zone für Zone" },
    items: [
      { z: "full2", fr: "Corps entier, visage compris", de: "Ganzer Körper inkl. Gesicht", p: 249, d: 90 },
      { z: "full", fr: "Corps entier", de: "Ganzer Körper", p: 219, d: 75 },
      { z: "visage", fr: "Visage", de: "Gesicht", p: 59, d: 15 },
      { z: "levre", fr: "Lèvre supérieure", de: "Oberlippe", p: 39, d: 10 },
      { z: "cou", fr: "Cou", de: "Hals", p: 59, d: 15 },
      { z: "aisselles", fr: "Aisselles", de: "Achsel", p: 59, d: 20 },
      { z: "epaules", fr: "Épaules", de: "Schultern", p: 59, d: 20 },
      { z: "torse", fr: "Torse", de: "Brust", p: 59, d: 20 },
      { z: "dos", fr: "Dos complet", de: "Kompletter Rücken", p: 89, d: 40 },
      { z: "bras", fr: "Bras entiers", de: "Beide Arme", p: 89, d: 30, ex: ["hbras", "abras"] },
      { z: "hbras", fr: "Haut des bras", de: "Oberarme", p: 69, d: 15, ex: ["bras"] },
      { z: "abras", fr: "Avant-bras", de: "Unterarme", p: 69, d: 15, ex: ["bras"] },
      { z: "mains", fr: "Mains", de: "Hände", p: 49, d: 10 },
      { z: "ventre", fr: "Ventre", de: "Bauch", p: 59, d: 15 },
      { z: "ligne", fr: "Ligne du ventre", de: "Bauchstreifen", p: 39, d: 10 },
      { z: "maillot", fr: "Maillot", de: "Bikini- und Badehosenzone", p: 69, d: 20, ex: ["intime"] },
      { z: "intime", fr: "Zone intime + maillot", de: "Intimbereich + Bikini- und Badehosenzone", p: 89, d: 30, ex: ["maillot"] },
      { z: "fesses", fr: "Fessiers, sillon compris", de: "Gesäss inkl. Pofalte", p: 69, d: 30 },
      { z: "jambes", fr: "Jambes entières", de: "Ganze Beine", p: 109, d: 50, ex: ["cuisses", "mollets"] },
      { z: "cuisses", fr: "Cuisses", de: "Oberschenkel", p: 79, d: 30, ex: ["jambes"] },
      { z: "mollets", fr: "Bas des jambes", de: "Unterschenkel", p: 69, d: 30, ex: ["jambes"] },
      { z: "pieds", fr: "Pieds", de: "Füsse", p: 49, d: 10 }
    ] },
  { id: "micro", fr: "Microneedling corps", de: "Microneedling Körper",
    sub: { fr: "Cicatrices et vergetures, avec radiofréquence", de: "Narben und Dehnungsstreifen, mit Radiofrequenz" },
    items: [
      { fr: "Cicatrices, par zone", de: "Narben entfernen, pro Zone", p: 150, d: 30 },
      { fr: "Vergetures / vergetures de grossesse", de: "Dehnungsstreifen / Schwangerschaftsstreifen", p: 150, d: 30 }
    ] },
  { id: "tattoo", fr: "Détatouage", de: "Tattooentfernung",
    sub: { fr: "Du petit motif au très grand tatouage", de: "Vom kleinen Motiv bis zum sehr grossen Tattoo" },
    items: [
      { fr: "Petit", de: "Klein", p: 150, d: 15 },
      { fr: "Moyen", de: "Mittel", p: 250, d: 30 },
      { fr: "Grand", de: "Gross", p: 350, d: 45 },
      { fr: "Très grand", de: "Sehr gross", p: 450, d: 60 }
    ] },
  { id: "regard", fr: "Regard", de: "Augen & Make-up",
    sub: { fr: "Sourcils, cils, retrait de maquillage permanent", de: "Brauen, Wimpern, Entfernung Permanent Make-up" },
    items: [
      { fr: "Sourcils : forme + teinture", de: "Augenbrauen formen + färben", p: 40, d: 30 },
      { fr: "Teinture des cils", de: "Wimpern färben", p: 25, d: 20 },
      { fr: "Retrait de maquillage permanent", de: "Entfernung Permanent Make-up", p: 100, d: 30,
        nfr: "Prix exact fixé lors de l'entretien conseil.", nde: "Der genaue Preis wird im Beratungsgespräch festgelegt." }
    ] }
];

var UI = {
  fr: { from: "dès", none: "Aucune zone choisie.", send: "Envoyer sur WhatsApp",
        better: function (p) { return "Astuce : le forfait corps entier est à " + p + " CHF."; },
        hello: "Bonjour Tamara, ", epMsg: "j'aimerais un rendez-vous pour une épilation durable : ",
        rdvMsg: function (s, w, n) { return "Bonjour Tamara, je m'appelle " + n + ". J'aimerais un rendez-vous pour : " + s + ". Moment souhaité : " + w + ". Merci !"; },
        when: { "matin": "le matin", "apres-midi": "l'après-midi", "soir": "en fin de journée", "samedi": "le samedi" },
        total: "total indicatif" },
  de: { from: "ab", none: "Noch keine Zone gewählt.", send: "Per WhatsApp senden",
        better: function (p) { return "Tipp: Das Ganzkörper-Paket kostet " + p + " CHF."; },
        hello: "Hallo Tamara, ", epMsg: "ich möchte einen Termin für dauerhafte Haarentfernung: ",
        rdvMsg: function (s, w, n) { return "Hallo Tamara, ich heisse " + n + ". Ich möchte einen Termin für: " + s + ". Wunschzeit: " + w + ". Danke!"; },
        when: { "matin": "Vormittag", "apres-midi": "Nachmittag", "soir": "Abend", "samedi": "Samstag" },
        total: "Richtwert" }
};

var lang = "fr";
try { if (localStorage.getItem("sa-lang") === "de") lang = "de"; } catch (e) {}

function $(id) { return document.getElementById(id); }
function minPrice(f) { return Math.min.apply(null, f.items.map(function (i) { return i.p; })); }
function fmtDur(m) { return m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + (m % 60 < 10 ? "0" : "") + (m % 60) : "") : m + " min"; }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

/* Index des familles */
function renderIndex() {
  $("index").innerHTML = SOINS.map(function (f, n) {
    return '<li><a href="#tarifs" data-tab="' + f.id + '">' +
      '<span class="i-num">0' + (n + 1) + '</span>' +
      '<span class="i-name">' + esc(f[lang]) + '<small>' + esc(f.sub[lang]) + '</small></span>' +
      '<span class="i-price">' + UI[lang].from + ' ' + minPrice(f) + ' CHF</span></a></li>';
  }).join("");
}

/* Onglets tarifs */
var current = "visage";
function renderTabs() {
  $("tabs").innerHTML = SOINS.map(function (f) {
    var on = f.id === current;
    return '<button type="button" role="tab" id="tab-' + f.id + '" aria-controls="panel-' + f.id + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-tab="' + f.id + '">' + esc(f[lang]) + '</button>';
  }).join("");
  $("panels").innerHTML = SOINS.map(function (f) {
    return '<div class="panel" role="tabpanel" id="panel-' + f.id + '" aria-labelledby="tab-' + f.id + '"' + (f.id === current ? "" : " hidden") + '><ul class="price-list">' +
      f.items.map(function (i) {
        var note = i["n" + lang];
        return '<li><div class="pl-name">' + esc(i[lang]) + (note ? '<p>' + esc(note) + '</p>' : '') + '</div>' +
          '<span class="pl-dur">' + fmtDur(i.d) + '</span><span class="pl-price">' + i.p + ' CHF</span></li>';
      }).join("") + '</ul></div>';
  }).join("");
}
function selectTab(id, focus) {
  current = id;
  renderTabs();
  if (focus) $("tab-" + id).focus();
}
document.addEventListener("click", function (e) {
  var t = e.target.closest("[data-tab]");
  if (t) selectTab(t.getAttribute("data-tab"), t.getAttribute("role") === "tab");
});
$("tabs").addEventListener("keydown", function (e) {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  var ids = SOINS.map(function (f) { return f.id; });
  var i = ids.indexOf(current) + (e.key === "ArrowRight" ? 1 : -1);
  selectTab(ids[(i + ids.length) % ids.length], true);
});

/* Composer l'épilation */
var EPIL = SOINS[1].items;
var picked = {};
function renderZones() {
  $("zones").innerHTML = EPIL.filter(function (i) { return i.z.indexOf("full") !== 0; }).map(function (i) {
    return '<button type="button" class="zone" data-z="' + i.z + '" aria-pressed="' + !!picked[i.z] + '">' +
      '<span>' + esc(i[lang]) + '</span><small>' + i.p + ' CHF · ' + i.d + ' min</small></button>';
  }).join("");
}
function updateTicket() {
  var sel = EPIL.filter(function (i) { return picked[i.z]; });
  var sum = sel.reduce(function (a, i) { return a + i.p; }, 0);
  var dur = sel.reduce(function (a, i) { return a + i.d; }, 0);
  $("t-list").textContent = sel.length ? sel.map(function (i) { return i[lang]; }).join(", ") : UI[lang].none;
  $("t-sum").textContent = sum + " CHF";
  $("t-dur").textContent = fmtDur(dur);
  var full = EPIL[1].p;
  $("t-hint").hidden = sum <= full;
  $("t-hint").textContent = UI[lang].better(full);
  var send = $("t-send");
  if (sel.length) {
    var msg = UI[lang].hello + UI[lang].epMsg +
      sel.map(function (i) { return i[lang]; }).join(", ") + " (" + UI[lang].total + " " + sum + " CHF).";
    send.href = "https://wa.me/" + TEL + "?text=" + encodeURIComponent(msg);
    send.removeAttribute("aria-disabled");
  } else {
    send.href = "#epilation";
    send.setAttribute("aria-disabled", "true");
  }
}
$("zones").addEventListener("click", function (e) {
  var b = e.target.closest(".zone");
  if (!b) return;
  var z = b.getAttribute("data-z");
  picked[z] = !picked[z];
  if (picked[z]) {
    var item = EPIL.filter(function (i) { return i.z === z; })[0];
    (item.ex || []).forEach(function (x) { picked[x] = false; });
  }
  renderZones();
  updateTicket();
  var again = document.querySelector('.zone[data-z="' + z + '"]');
  if (again) again.focus();
});
$("t-send").addEventListener("click", function (e) {
  if (this.getAttribute("aria-disabled")) e.preventDefault();
});

/* Détatouage */
function renderSizes() {
  var sizes = SOINS[3].items;
  $("sizes").innerHTML = sizes.map(function (i, n) {
    return '<li style="--s:' + (n + 1) + '"><span class="dot" aria-hidden="true"></span>' +
      '<span class="sz-name">' + esc(i[lang]) + '</span><span class="sz-meta">' + i.d + ' min</span>' +
      '<strong>' + i.p + ' CHF</strong></li>';
  }).join("");
}

/* Formulaire rendez-vous → WhatsApp */
function renderSelect() {
  var keep = $("f-soin").value;
  $("f-soin").innerHTML = SOINS.map(function (f) {
    return '<optgroup label="' + esc(f[lang]) + '">' + f.items.map(function (i) {
      var label = f.id === "tattoo" ? f[lang] + " — " + i[lang] : i[lang];
      return '<option>' + esc(label) + '</option>';
    }).join("") + '</optgroup>';
  }).join("");
  if (keep) $("f-soin").selectedIndex = Math.max(0, Array.prototype.map.call($("f-soin").options, function (o) { return o.text; }).indexOf(keep));
}
$("rdv-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var name = $("f-name").value.trim();
  var when = document.querySelector('input[name="when"]:checked').value;
  var msg = UI[lang].rdvMsg($("f-soin").value, UI[lang].when[when], name);
  window.open("https://wa.me/" + TEL + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
});

/* Langue */
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-de]").forEach(function (el) {
    if (!el.hasAttribute("data-fr")) el.setAttribute("data-fr", el.innerHTML);
    el.innerHTML = el.getAttribute("data-" + lang);
  });
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang);
  });
  renderIndex(); renderTabs(); renderZones(); renderSizes(); renderSelect(); updateTicket();
}
document.querySelectorAll(".lang button").forEach(function (b) {
  b.addEventListener("click", function () {
    lang = b.getAttribute("data-lang");
    try { localStorage.setItem("sa-lang", lang); } catch (e) {}
    applyLang();
  });
});

applyLang();
