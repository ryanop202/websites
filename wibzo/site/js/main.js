// Wibzo — animations légères + barre WhatsApp mobile
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  // Titre du hero : mots qui arrivent un par un
  var title = document.querySelector('[data-words]');
  var step = 0.12, delay = 0.15, n = 0;
  if (title) {
    var label = title.textContent.replace(/\s+/g, ' ').trim();
    title.setAttribute('aria-label', label);
    Array.prototype.slice.call(title.childNodes).forEach(function (node) {
      var isEm = node.nodeType === 1;
      var text = node.textContent;
      var frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        var span = document.createElement(isEm ? 'em' : 'span');
        span.className = 'word';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = part;
        span.style.animationDelay = (delay + n++ * step) + 's';
        frag.appendChild(span);
      });
      title.replaceChild(frag, node);
    });
  }

  // Éléments du hero : apparaissent après le titre, dans l'ordre
  var heroEnd = delay + n * step;
  document.querySelectorAll('.hero .reveal').forEach(function (el, i) {
    if (el.classList.contains('badge')) { el.style.transitionDelay = '0s'; }
    else { el.style.transitionDelay = (heroEnd + i * 0.15) + 's'; }
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('is-in'); }); });
  });

  // Reste de la page : apparition au scroll
  var others = document.querySelectorAll('.reveal:not(.hero .reveal)');
  if (reduce || !('IntersectionObserver' in window)) {
    others.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sibs = e.target.parentNode.querySelectorAll(':scope > .reveal');
        var idx = Array.prototype.indexOf.call(sibs, e.target);
        e.target.style.transitionDelay = Math.min(idx, 4) * 0.08 + 's';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    others.forEach(function (el) { io.observe(el); });
  }

  // Barre fixe mobile : visible quand le bouton du hero et l'appel final ne sont pas à l'écran
  var sticky = document.getElementById('sticky');
  var heroCta = document.getElementById('hero-cta');
  var final = document.getElementById('final');
  if (sticky && heroCta && final && 'IntersectionObserver' in window) {
    var heroSeen = true, finalSeen = false;
    var update = function () { sticky.classList.toggle('is-on', !heroSeen && !finalSeen); };
    new IntersectionObserver(function (e) { heroSeen = e[0].isIntersecting || e[0].boundingClientRect.top > 0; update(); }).observe(heroCta);
    new IntersectionObserver(function (e) { finalSeen = e[0].isIntersecting; update(); }).observe(final);
  } else if (sticky) {
    sticky.classList.add('is-on');
  }
})();
