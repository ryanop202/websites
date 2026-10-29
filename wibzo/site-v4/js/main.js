// Wibzo — lien WhatsApp prérempli, en-tête au défilement, onglets métier, barre mobile, photo, apparitions.
(function () {
  var WA = "https://wa.me/41767574393?text=" + encodeURIComponent("Bonjour, je souhaiterais une maquette gratuite pour mon commerce : ");
  document.querySelectorAll(".wa-link").forEach(function (a) { a.href = WA; });
  var WA3D = "https://wa.me/41767574393?text=" + encodeURIComponent("Bonjour, je souhaiterais une démo du configurateur 3D pour mon entreprise : ");
  document.querySelectorAll(".wa-3d").forEach(function (a) { a.href = WA3D; });

  // En-tête et barre fixe mobile (affichée après le hero, cachée sur le contact final)
  var top = document.querySelector(".top");
  var sticky = document.getElementById("sticky");
  var hero = document.querySelector(".hero");
  var final = document.getElementById("contact");
  function onScroll() {
    var y = window.scrollY;
    if (top) top.classList.toggle("is-scrolled", y > 8);
    if (sticky && hero && final) {
      var pastHero = y > hero.offsetTop + hero.offsetHeight - 200;
      var atFinal = final.getBoundingClientRect().top < window.innerHeight;
      sticky.classList.toggle("is-on", pastHero && !atFinal);
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Onglets « selon votre métier »
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".trades__tabs [role=tab]"));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      if (on) { panel.classList.remove("is-in-anim"); void panel.offsetWidth; panel.classList.add("is-in-anim"); }
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      select(n); n.focus();
    });
  });

  // Photo de Ryan : visible seulement si assets/ryan.jpg existe
  var fig = document.querySelector(".about__photo");
  if (fig) {
    var img = fig.querySelector("img");
    var show = function () { fig.hidden = false; fig.parentNode.classList.add("has-photo"); };
    if (img.complete && img.naturalWidth) show();
    else img.addEventListener("load", show);
  }

  // Apparitions au défilement
  if (!("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  document.querySelectorAll(".reveal").forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 60 + "ms";
    io.observe(el);
  });
})();
