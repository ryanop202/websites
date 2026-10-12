// Statut ouvert / fermé et repère « maintenant » sur la règle 24 h.
// Horaires annoncés (à confirmer) : tous les jours 6h → 24h.
(function () {
  var OPEN = 6, CLOSE = 24;
  var status = document.querySelector('[data-status]');
  var marker = document.querySelector('[data-now]');
  if (!status || !marker) return;

  function update() {
    var now = new Date();
    var h = now.getHours() + now.getMinutes() / 60;
    var open = h >= OPEN && h < CLOSE;

    marker.style.left = (h / 24 * 100) + '%';
    marker.style.display = 'block';

    status.classList.toggle('is-open', open);
    status.textContent = open
      ? 'Ouvert maintenant · jusqu’à minuit'
      : 'Fermé · réouverture à 6h';
  }

  update();
  setInterval(update, 60000);
})();
