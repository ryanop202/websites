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

// ===== V2 : scène 3D, bande métiers, étapes en flux =====
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage = document.querySelector('.stage');
  var hero = document.querySelector('.hero');
  var band = document.getElementById('band');
  var steps = document.getElementById('steps');
  var stepItems = steps ? steps.querySelectorAll('.step') : [];

  // Étapes : sans animation, tout est allumé
  if (reduce) {
    stepItems.forEach(function (s) { s.classList.add('is-on'); });
    if (steps) steps.style.setProperty('--p', 1);
    return;
  }

  // Inclinaison à la souris (ordinateur)
  var tx = 0, ty = 0, cx = 0, cy = 0;
  if (hero && stage && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; });
  }
  // Une fois déployés, on coupe la transition pour suivre le scroll en direct
  if (stage) setTimeout(function () { stage.classList.add('is-live'); }, 2600);

  var bandX = 0, dir = 1, lastY = window.scrollY, speed = 0, t0 = performance.now();

  function frame(now) {
    var dt = Math.min(now - t0, 50); t0 = now;
    var y = window.scrollY, vh = window.innerHeight;

    // Scène 3D : souris + scroll + léger balancement automatique (mobile)
    if (stage) {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      var sway = Math.sin(now / 2600) * 6;
      var s = Math.min(Math.max(y / (vh * 0.9), 0), 1);
      stage.style.setProperty('--ry', (cx * 16 + sway) + 'deg');
      stage.style.setProperty('--rx', (-cy * 10) + 'deg');
      stage.style.setProperty('--s', s.toFixed(3));
    }

    // Bande : défile toute seule, accélère quand on scrolle
    if (band) {
      var dy = y - lastY;
      speed += (Math.abs(dy) * 0.6 - speed) * 0.1;
      if (dy) dir = dy < 0 ? -1 : 1;
      bandX -= (0.04 + speed * 0.02) * dt * dir;
      var half = band.scrollWidth / 2;
      if (bandX <= -half) bandX += half;
      if (bandX > 0) bandX -= half;
      band.style.setProperty('--bx', bandX.toFixed(1) + 'px');
    }
    lastY = y;

    // Étapes : la ligne se remplit au fil du scroll
    if (steps) {
      var r = steps.getBoundingClientRect();
      var p = (vh * 0.65 - r.top) / r.height;
      p = Math.min(Math.max(p, 0), 1);
      steps.style.setProperty('--p', p.toFixed(3));
      stepItems.forEach(function (it, i) {
        it.classList.toggle('is-on', p >= (i === 0 ? 0.02 : i / (stepItems.length - 1) - 0.02));
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
