// Aperçu illustratif — aucun horaire officiel trouvé pour Chez G.
// Créneaux d'exemple (9h-19h) à remplacer par les vraies disponibilités.

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const OPEN_HOUR = 9;
const CLOSE_HOUR = 19;

function buildDays() {
  const days = [];
  const today = new Date();
  let cursor = new Date(today);

  while (days.length < 6) {
    if (cursor.getDay() !== 0) { // exemple : fermé le dimanche
      days.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function buildSlots() {
  const slots = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

function formatDay(date) {
  const name = dayNames[date.getDay()];
  const dayNum = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return { label: `${name} ${dayNum}/${month}`, date };
}

function initBookingCalendar() {
  const daysEl = document.getElementById("cal-days");
  const slotsEl = document.getElementById("cal-slots");
  const confirmEl = document.getElementById("cal-confirm");
  const selectedEl = document.getElementById("cal-selected");
  const requestBtn = document.getElementById("cal-request");
  const successEl = document.getElementById("cal-success");

  if (!daysEl || !slotsEl) return;

  const days = buildDays().map(formatDay);
  let activeDayIndex = 0;
  let selectedSlot = null;

  function renderDays() {
    daysEl.innerHTML = "";
    days.forEach((d, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-day" + (i === activeDayIndex ? " active" : "");
      btn.textContent = d.label;
      btn.addEventListener("click", () => {
        activeDayIndex = i;
        selectedSlot = null;
        confirmEl.hidden = true;
        successEl.hidden = true;
        renderDays();
        renderSlots();
      });
      daysEl.appendChild(btn);
    });
  }

  function renderSlots() {
    slotsEl.innerHTML = "";
    buildSlots().forEach((time) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-slot" + (time === selectedSlot ? " active" : "");
      btn.textContent = time;
      btn.addEventListener("click", () => {
        selectedSlot = time;
        successEl.hidden = true;
        renderSlots();
        confirmEl.hidden = false;
        selectedEl.textContent = `${days[activeDayIndex].label} — ${time}`;
      });
      slotsEl.appendChild(btn);
    });
  }

  if (requestBtn) {
    requestBtn.addEventListener("click", () => {
      successEl.hidden = false;
    });
  }

  renderDays();
  renderSlots();
}

document.addEventListener("DOMContentLoaded", initBookingCalendar);
