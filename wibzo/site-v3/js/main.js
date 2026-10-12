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

// ===== V3 : démos interactives (réservation, devis, carte) =====
(function () {
  var demos = document.getElementById('demos');
  if (!demos) return;

  // Choix exclusif dans un groupe (role="radio")
  function radioGroup(group, onPick) {
    group.addEventListener('click', function (e) {
      var b = e.target.closest('[role="radio"]');
      if (!b || b.disabled || !group.contains(b)) return;
      group.querySelectorAll('[role="radio"]').forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
      onPick(b);
    });
  }

  // --- Onglets des démos ---
  var tabs = Array.prototype.slice.call(demos.querySelectorAll('.dtab'));
  function show(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      show(n); n.focus();
    });
  });

  // --- Réservation ---
  var resa = { svc: null, price: 0, day: null, dayLabel: '', time: null };
  var daysBox = document.getElementById('resa-days');
  var slotsBox = document.getElementById('resa-slots');
  var go = document.getElementById('resa-go');
  var card = document.getElementById('resa');
  var done = document.getElementById('resa-done');
  var SLOTS = ['09:00', '09:45', '10:30', '11:15', '13:30', '14:15', '15:00', '16:30', '17:15'];
  var wd = new Intl.DateTimeFormat('fr-CH', { weekday: 'short' });
  var full = new Intl.DateTimeFormat('fr-CH', { weekday: 'long', day: 'numeric', month: 'long' });

  // Les 6 prochains jours ouvrables (sans dimanche ni lundi)
  var d = new Date(); d.setHours(12, 0, 0, 0);
  var count = 0;
  while (count < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 1) continue;
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
    b.dataset.i = count; b.dataset.label = full.format(d);
    b.innerHTML = '<small>' + wd.format(d).replace('.', '') + '</small><b>' + d.getDate() + '</b>';
    b.setAttribute('aria-label', full.format(d));
    daysBox.appendChild(b);
    count++;
  }

  function renderSlots() {
    slotsBox.innerHTML = '';
    if (resa.day === null) {
      slotsBox.innerHTML = '<p class="slots__empty">Choisissez d’abord un jour.</p>';
      return;
    }
    SLOTS.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
      b.textContent = s; b.dataset.t = s;
      if ((resa.day * 2 + i * 3) % 5 === 0) { b.disabled = true; b.setAttribute('aria-label', s + ', complet'); }
      slotsBox.appendChild(b);
    });
  }

  function updateGo() {
    if (!resa.svc) { go.disabled = true; go.textContent = 'Choisissez une prestation'; }
    else if (resa.day === null) { go.disabled = true; go.textContent = 'Choisissez un jour'; }
    else if (!resa.time) { go.disabled = true; go.textContent = 'Choisissez une heure'; }
    else { go.disabled = false; go.textContent = 'Confirmer · ' + resa.time; }
  }

  radioGroup(card.querySelector('.svc'), function (b) { resa.svc = b.dataset.svc; updateGo(); });
  radioGroup(daysBox, function (b) { resa.day = +b.dataset.i; resa.dayLabel = b.dataset.label; resa.time = null; renderSlots(); updateGo(); });
  radioGroup(slotsBox, function (b) { resa.time = b.dataset.t; updateGo(); });

  go.addEventListener('click', function () {
    document.getElementById('resa-recap').textContent = resa.svc + ', ' + resa.dayLabel + ' à ' + resa.time;
    card.hidden = true; done.hidden = false;
    done.closest('.site').scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.getElementById('resa-reset').addEventListener('click', function () {
    resa = { svc: null, price: 0, day: null, dayLabel: '', time: null };
    card.querySelectorAll('[aria-checked="true"]').forEach(function (x) { x.setAttribute('aria-checked', 'false'); });
    renderSlots(); updateGo();
    done.hidden = true; card.hidden = false;
  });
  renderSlots();

  // --- Devis automatique (prix fictifs de démonstration) ---
  var TYPES = {
    cuisine:  { unit: 'm',       min: 2,  max: 8,  val: 4,  step: 1, per: 1150 },
    escalier: { unit: 'marches', min: 8,  max: 20, val: 14, step: 1, per: 260 },
    terrasse: { unit: 'm²',      min: 10, max: 60, val: 25, step: 5, per: 145 },
    dressing: { unit: 'm',       min: 1,  max: 5,  val: 2,  step: 1, per: 950 }
  };
  var dv = { type: 'cuisine', wood: 1 };
  var size = document.getElementById('dv-size');
  var sizeOut = document.getElementById('dv-size-out');
  var pose = document.getElementById('dv-pose');
  var huile = document.getElementById('dv-huile');
  var priceEl = document.getElementById('dv-price');
  var shown = 0, target = 0, anim = null;
  var nf = new Intl.NumberFormat('fr-CH', { maximumFractionDigits: 0 });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function round(n) { return Math.round(n / 50) * 50; }
  function paint(v) { priceEl.textContent = nf.format(round(v * 0.9)) + ' – ' + nf.format(round(v * 1.1)) + ' CHF'; }
  function calc() {
    var t = TYPES[dv.type];
    sizeOut.textContent = size.value + ' ' + t.unit;
    var v = t.per * +size.value * dv.wood;
    if (pose.checked) v *= 1.18;
    if (huile.checked) v *= 1.06;
    target = v;
    if (reduce || !shown) { shown = v; paint(v); return; }
    cancelAnimationFrame(anim);
    (function tick() {
      shown += (target - shown) * 0.18;
      if (Math.abs(target - shown) < 20) shown = target;
      paint(shown);
      if (shown !== target) anim = requestAnimationFrame(tick);
    })();
  }
  radioGroup(document.getElementById('dv-type'), function (b) {
    dv.type = b.dataset.k;
    var t = TYPES[dv.type];
    size.min = t.min; size.max = t.max; size.step = t.step; size.value = t.val;
    calc();
  });
  radioGroup(document.getElementById('dv-wood'), function (b) { dv.wood = +b.dataset.m; calc(); });
  size.addEventListener('input', calc);
  pose.addEventListener('change', calc);
  huile.addEventListener('change', calc);
  calc();

  // --- Carte du restaurant (plats et prix fictifs) ---
  var MENU = {
    entrees: [
      ['Velouté de courge', 'Graines torréfiées, crème', '12.–', 1],
      ['Salade du marché', 'Légumes de saison, vinaigrette maison', '11.–', 1],
      ['Terrine du chef', 'Pain de campagne, cornichons', '15.–', 0]
    ],
    plats: [
      ['Filets de perche', 'Frites maison, sauce tartare', '34.–', 0],
      ['Risotto aux champignons', 'Parmesan, huile de noisette', '28.–', 1],
      ['Entrecôte de bœuf', 'Beurre aux herbes, légumes', '42.–', 0],
      ['Émincé de volaille', 'Sauce à la crème, rösti', '29.–', 0]
    ],
    desserts: [
      ['Meringue double crème', 'Et petits fruits', '12.–', 1],
      ['Tarte aux pommes', 'Glace vanille', '9.–', 1],
      ['Mousse au chocolat', 'Chocolat noir 70 %', '10.–', 1]
    ],
    boissons: [
      ['Vin blanc du pays', 'Le verre, 1 dl', '5.–', 0],
      ['Jus de pomme artisanal', '3 dl', '4.50', 0],
      ['Eau minérale', '5 dl', '4.–', 0],
      ['Café, thé', '', '4.–', 0]
    ]
  };
  var menu = document.getElementById('menu');
  function renderMenu(cat) {
    menu.innerHTML = MENU[cat].map(function (m) {
      return '<li><b>' + m[0] + (m[3] && (cat === 'entrees' || cat === 'plats') ? '<em>végé</em>' : '') + '</b><span>' + m[2] + '</span>' +
        (m[1] ? '<p>' + m[1] + '</p>' : '') + '</li>';
    }).join('');
  }
  var mtabs = demos.querySelector('.mtabs');
  mtabs.addEventListener('click', function (e) {
    var b = e.target.closest('[role="tab"]');
    if (!b) return;
    mtabs.querySelectorAll('[role="tab"]').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
    renderMenu(b.dataset.cat);
  });
  renderMenu('entrees');
})();
