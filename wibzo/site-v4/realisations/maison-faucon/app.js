// Maison Faucon — réservation de démonstration (rien n'est envoyé), statut « ouvert », carte.
(function () {
  var SVC = [
    { id: "coupe", name: "Coupe homme", desc: "Shampoing, coupe, coiffage", min: 30, price: 35 },
    { id: "combo", name: "Coupe + barbe", desc: "La formule complète", min: 45, price: 55, tag: "Le plus réservé" },
    { id: "barbe", name: "Taille de barbe", desc: "Tondeuse, contours au rasoir, huile", min: 20, price: 25 },
    { id: "rasage", name: "Rasage à l’ancienne", desc: "Serviette chaude, rasoir droit", min: 30, price: 40 },
    { id: "enfant", name: "Coupe enfant", desc: "Jusqu’à 12 ans", min: 20, price: 25 }
  ];
  // jour (0 = dimanche) -> [ouverture, fermeture] en heures
  var HOURS = { 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [9, 19], 6: [8, 15] };
  var DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  var $ = function (id) { return document.getElementById(id); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var hm = function (m) { return Math.floor(m / 60) + ":" + pad(m % 60); };
  var now = new Date();
  var state = { svc: SVC[1], day: null, time: null };

  // créneaux « déjà pris » : toujours les mêmes pour une date donnée
  function taken(date, m) {
    var s = date.getFullYear() * 1000 + date.getMonth() * 40 + date.getDate() + m * 7;
    s = Math.sin(s) * 10000;
    return s - Math.floor(s) < 0.4;
  }
  function slotsFor(date, min) {
    var h = HOURS[date.getDay()];
    if (!h) return [];
    var out = [], isToday = date.toDateString() === now.toDateString();
    var nowMin = now.getHours() * 60 + now.getMinutes() + 30;
    for (var m = h[0] * 60; m + min <= h[1] * 60; m += 30) {
      if (isToday && m < nowMin) continue;
      out.push({ m: m, taken: taken(date, m) });
    }
    return out;
  }
  function freeSlots(date, min) { return slotsFor(date, min).filter(function (s) { return !s.taken; }); }

  // jours proposés : les 6 prochains jours ouverts avec au moins un créneau libre
  var openDays = [];
  for (var i = 0; openDays.length < 6 && i < 21; i++) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (freeSlots(d, 20).length) openDays.push(d);
  }
  function dayLabel(d) {
    var diff = Math.round((d - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
    return diff === 0 ? "Auj." : diff === 1 ? "Demain" : DAYS[d.getDay()].slice(0, 3) + ".";
  }
  function longDay(d) { return DAYS[d.getDay()].replace(/^./, function (c) { return c.toUpperCase(); }) + " " + d.getDate() + " " + MONTHS[d.getMonth()]; }

  function renderSvc() {
    $("svc").innerHTML = SVC.map(function (s) {
      return '<label class="svc__item"><input type="radio" name="svc" value="' + s.id + '"' + (s === state.svc ? " checked" : "") + '>' +
        '<span class="svc__name">' + s.name + (s.tag ? ' <em>' + s.tag + '</em>' : "") + '</span>' +
        '<span class="svc__meta">' + s.min + ' min</span><span class="svc__price">' + s.price + '.–</span></label>';
    }).join("");
  }
  function renderDays() {
    $("days").innerHTML = openDays.map(function (d, i) {
      return '<button type="button" class="day" data-i="' + i + '" aria-pressed="' + (state.day === d) + '">' +
        '<span>' + dayLabel(d) + '</span><b>' + d.getDate() + '</b><small>' + MONTHS[d.getMonth()] + '</small></button>';
    }).join("");
  }
  function renderSlots() {
    var list = state.day ? slotsFor(state.day, state.svc.min) : [];
    if (!list.length) { $("slots").innerHTML = '<p class="slots__empty">Plus de place ce jour-là. Choisissez un autre jour.</p>'; return; }
    $("slots").innerHTML = list.map(function (s) {
      return '<button type="button" class="slot" data-m="' + s.m + '"' + (s.taken ? " disabled" : "") +
        ' aria-pressed="' + (state.time === s.m) + '">' + hm(s.m) + '</button>';
    }).join("");
  }
  function renderTicket() {
    $("t-svc").textContent = state.svc.name;
    $("t-dur").textContent = state.svc.min + " min";
    $("t-price").textContent = state.svc.price + ".– CHF";
    $("t-day").textContent = state.day ? longDay(state.day) : "—";
    $("t-time").textContent = state.time != null ? hm(state.time) : "—";
    var ok = state.day && state.time != null;
    $("confirm").disabled = !ok;
    $("confirm").textContent = ok ? "Confirmer le rendez-vous" : "Choisissez une heure";
  }

  $("svc").addEventListener("change", function (e) {
    state.svc = SVC.filter(function (s) { return s.id === e.target.value; })[0];
    if (state.time != null && state.day) {
      var still = slotsFor(state.day, state.svc.min).some(function (s) { return s.m === state.time && !s.taken; });
      if (!still) state.time = null;
    }
    renderSlots(); renderTicket();
  });
  $("days").addEventListener("click", function (e) {
    var b = e.target.closest(".day"); if (!b) return;
    state.day = openDays[+b.dataset.i]; state.time = null;
    renderDays(); renderSlots(); renderTicket();
  });
  $("slots").addEventListener("click", function (e) {
    var b = e.target.closest(".slot"); if (!b || b.disabled) return;
    state.time = +b.dataset.m;
    renderSlots(); renderTicket();
  });
  $("confirm").addEventListener("click", function () {
    $("d-when").textContent = longDay(state.day) + " · " + hm(state.time);
    $("d-svc").textContent = state.svc.name + " · " + state.svc.min + " min · " + state.svc.price + ".– CHF";
    $("ticket").hidden = true; $("done").hidden = false;
  });
  $("again").addEventListener("click", function () {
    $("done").hidden = true; $("ticket").hidden = false;
  });

  state.day = openDays[0] || null;
  renderSvc(); renderDays(); renderSlots(); renderTicket();

  // carte
  $("menu").innerHTML = SVC.map(function (s) {
    return '<li><div><b>' + s.name + '</b><span>' + s.desc + '</span></div><em>' + s.min + ' min</em><strong>' + s.price + '.–</strong></li>';
  }).join("");

  // statut en direct + jour surligné
  var h = HOURS[now.getDay()], m = now.getHours() * 60 + now.getMinutes(), live = $("live");
  if (h && m >= h[0] * 60 && m < h[1] * 60) {
    var f = freeSlots(now, 30)[0];
    live.classList.add("is-open");
    live.lastChild.textContent = "Ouvert jusqu’à " + h[1] + ":00" + (f ? " · prochain créneau libre à " + hm(f.m) : "");
  } else {
    for (var k = 1; k <= 7; k++) {
      var nd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (h && m < h[0] * 60 ? 0 : k));
      if (HOURS[nd.getDay()]) {
        var when = nd.toDateString() === now.toDateString() ? "aujourd’hui" : DAYS[nd.getDay()];
        live.lastChild.textContent = "Fermé · réouverture " + when + " à " + HOURS[nd.getDay()][0] + ":00 · réservez déjà en ligne";
        break;
      }
    }
  }
  document.querySelectorAll("#hours tr").forEach(function (tr) {
    if (tr.dataset.d.split(",").indexOf(String(now.getDay())) > -1) tr.classList.add("today");
  });

  // en-tête au défilement
  var nav = document.querySelector(".nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", scrollY > 10); };
  onScroll(); addEventListener("scroll", onScroll, { passive: true });
})();
