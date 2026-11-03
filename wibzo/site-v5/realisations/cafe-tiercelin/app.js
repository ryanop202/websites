// Café Tiercelin — statut « ouvert » en direct, jour de l'ardoise, onglets de la carte.
(function () {
  // jour (0 = dimanche) -> [ouverture, fermeture] en minutes
  var H = { 0: [540, 840], 2: [420, 1110], 3: [420, 1110], 4: [420, 1110], 5: [420, 1110], 6: [480, 1020] };
  var DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var fmt = function (m) { var h = Math.floor(m / 60), r = m % 60; return h + " h" + (r ? " " + (r < 10 ? "0" : "") + r : ""); };
  var now = new Date(), d = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
  var open = H[d] && m >= H[d][0] && m < H[d][1], text;

  if (open) {
    text = H[d][1] - m <= 45 ? "Ferme bientôt · " + fmt(H[d][1]) : "Ouvert · jusqu’à " + fmt(H[d][1]);
  } else {
    for (var k = 0; k < 8; k++) {
      var nd = (d + k) % 7;
      if (H[nd] && (k > 0 || m < H[nd][0])) {
        text = "Fermé · ouvre " + (k === 0 ? "aujourd’hui" : k === 1 ? "demain" : DAYS[nd]) + " à " + fmt(H[nd][0]);
        break;
      }
    }
  }
  document.querySelectorAll("[data-status]").forEach(function (el) {
    el.classList.toggle("is-open", open);
    el.querySelector("span").textContent = text;
  });
  document.querySelectorAll("#hours tr").forEach(function (tr) {
    if (tr.dataset.d.split(",").indexOf(String(d)) > -1) tr.classList.add("today");
  });
  var t = document.querySelector("[data-today]");
  if (t) t.textContent = DAYS[d].replace(/^./, function (c) { return c.toUpperCase(); }) + " " + now.getDate() + "." + (now.getMonth() + 1) + ".";

  // onglets de la carte
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tabs [role=tab]"));
  function select(tab) {
    tabs.forEach(function (x) {
      var on = x === tab;
      x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (x, i) {
    x.addEventListener("click", function () { select(x); });
    x.addEventListener("keydown", function (e) {
      var s = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!s) return;
      var n = tabs[(i + s + tabs.length) % tabs.length]; select(n); n.focus();
    });
  });
  // à midi, la carte s'ouvre sur « À midi »
  if (m >= 660 && m < 840 && d !== 0) select(tabs[1]);
  else if (d === 0) select(tabs[3]);
  else if (m >= 840) select(tabs[2]);

  // ardoise : la ligne de craie se dessine quand on arrive dessus
  var slate = document.querySelector(".slate");
  if ("IntersectionObserver" in window && slate) {
    document.documentElement.classList.add("js");
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { slate.classList.add("is-in"); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(slate);
  }

  var nav = document.querySelector(".nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", scrollY > 10); };
  onScroll(); addEventListener("scroll", onScroll, { passive: true });
})();
