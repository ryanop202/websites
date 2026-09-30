// Aperçu visuel de réservation — démo, pas connecté à un vrai agenda.
// Sur le site réel, ce module sera remplacé par un agenda connecté (Cal.com).
// Prix confirmés (Salonkee). Durées : estimées, à confirmer avec Natacha.

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

const SERVICES = [
  { name: "Coupe homme", price: "39 CHF", duration: 30 },
  { name: "Coupe sans séchage", price: "45 CHF", duration: 30 },
  { name: "Coupe & séchage", price: "dès 58 CHF", duration: 45 },
  { name: "Coupe & brushing", price: "dès 65 CHF", duration: 60 },
  { name: "Coloration", price: "dès 58 CHF", duration: 90 },
  { name: "Mèches", price: "dès 85 CHF", duration: 120 },
];

// Horaires réels (source Salonkee) : fermé lundi et dimanche,
// mardi-vendredi 8h-18h30, samedi 8h-15h.
function hoursForDay(dayOfWeek) {
  if (dayOfWeek === 0 || dayOfWeek === 1) return null; // fermé
  if (dayOfWeek === 6) return { open: 8, close: 15 };
  return { open: 8, close: 18.5 };
}

function buildDays() {
  const days = [];
  const today = new Date();
  let cursor = new Date(today);

  while (days.length < 6) {
    if (hoursForDay(cursor.getDay()) !== null) {
      days.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function minutesToLabel(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function buildSlots(dayOfWeek, durationMinutes) {
  const hours = hoursForDay(dayOfWeek);
  if (!hours) return [];
  const openMin = hours.open * 60;
  const closeMin = hours.close * 60;
  const slots = [];
  for (let start = openMin; start + durationMinutes <= closeMin; start += durationMinutes) {
    slots.push({ start: minutesToLabel(start), end: minutesToLabel(start + durationMinutes) });
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
  const serviceSelectEl = document.getElementById("service-select");
  const stepDayEl = document.getElementById("step-day");
  const stepTimeEl = document.getElementById("step-time");
  const daysEl = document.getElementById("cal-days");
  const slotsEl = document.getElementById("cal-slots");
  const confirmEl = document.getElementById("cal-confirm");
  const serviceLabelEl = document.getElementById("cal-service-label");
  const selectedEl = document.getElementById("cal-selected");
  const priceEl = document.getElementById("cal-price");
  const requestBtn = document.getElementById("cal-request");
  const successEl = document.getElementById("cal-success");

  if (!serviceSelectEl || !daysEl || !slotsEl) return;

  const days = buildDays().map(formatDay);
  let selectedService = null;
  let activeDayIndex = 0;
  let selectedSlot = null;

  function renderServices() {
    serviceSelectEl.innerHTML = "";
    SERVICES.forEach((service) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "service-option" + (service === selectedService ? " active" : "");
      btn.innerHTML = `<span>${service.name}</span><strong>${service.price}</strong>`;
      btn.addEventListener("click", () => {
        selectedService = service;
        selectedSlot = null;
        confirmEl.hidden = true;
        successEl.hidden = true;
        renderServices();
        stepDayEl.hidden = false;
        stepTimeEl.hidden = true;
        renderDays();
      });
      serviceSelectEl.appendChild(btn);
    });
  }

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
        stepTimeEl.hidden = false;
        renderSlots();
      });
      daysEl.appendChild(btn);
    });
  }

  function renderSlots() {
    slotsEl.innerHTML = "";
    const dayOfWeek = days[activeDayIndex].date.getDay();
    buildSlots(dayOfWeek, selectedService.duration).forEach((slot) => {
      const label = `${slot.start}–${slot.end}`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-slot" + (slot.start === selectedSlot ? " active" : "");
      btn.textContent = label;
      btn.addEventListener("click", () => {
        selectedSlot = slot.start;
        successEl.hidden = true;
        renderSlots();
        confirmEl.hidden = false;
        serviceLabelEl.textContent = `${selectedService.name} (${selectedService.duration} min, durée estimée)`;
        selectedEl.textContent = `${days[activeDayIndex].label} — ${label}`;
        priceEl.textContent = selectedService.price;
      });
      slotsEl.appendChild(btn);
    });
  }

  if (requestBtn) {
    requestBtn.addEventListener("click", () => {
      successEl.hidden = false;
    });
  }

  renderServices();
}

document.addEventListener("DOMContentLoaded", initBookingCalendar);
