// /api/busy — heures déjà prises dans l'agenda Google de Carolina (CTL Nails).
// Renvoie seulement des créneaux { "2026-10-16": [[540, 660], ...] } en minutes (heure de Zurich),
// jamais le titre ni le détail des rendez-vous.
// Le lien secret iCal de son agenda est dans la variable ICAL_URL :
//   npx wrangler pages secret put ICAL_URL --project-name ctl-nails-wibzo
// Sans ICAL_URL, la page utilise son agenda de démonstration.

const TZ = 'Europe/Zurich';
const JOURS = 21; // on regarde les 3 prochaines semaines

export async function onRequestGet({ env }) {
  if (!env.ICAL_URL) return json({ busy: null, demo: true });
  const r = await fetch(env.ICAL_URL, { cf: { cacheTtl: 120, cacheEverything: true } });
  if (!r.ok) return json({ busy: null, error: 'agenda indisponible' }, 502);
  const today = localFromUtc(Date.now()).k;
  return json({ busy: parse(await r.text(), today), updated: new Date().toISOString() });
}

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=60' }
});

// ---------- dates « locales » (jour + minutes à Zurich) ----------
const pad = n => String(n).padStart(2, '0');
const key = (y, m, d) => { const t = new Date(Date.UTC(y, m - 1, d)); return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`; };
const toUtc = k => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const addDays = (k, n) => { const [y, m, d] = k.split('-').map(Number); return key(y, m, d + n); };
const daysBetween = (a, b) => Math.round((toUtc(b) - toUtc(a)) / 864e5);
const weekday = k => new Date(toUtc(k)).getUTCDay();
const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
function localFromUtc(ms) {
  const p = Object.fromEntries(fmt.formatToParts(new Date(ms)).map(x => [x.type, x.value]));
  return { k: `${p.year}-${p.month}-${p.day}`, min: +p.hour * 60 + +p.minute };
}

// « DTSTART;TZID=Europe/Zurich:20261016T090000 » → { k: '2026-10-16', min: 540, allDay: false }
// Les heures avec TZID sont lues comme heure de Zurich (c'est le cas de son agenda).
function parseDT(line) {
  if (!line) return null;
  const v = line.slice(line.indexOf(':') + 1).trim();
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  if (!m[4]) return { k: key(+m[1], +m[2], +m[3]), min: 0, allDay: true };
  if (m[7]) return { ...localFromUtc(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])), allDay: false };
  return { k: key(+m[1], +m[2], +m[3]), min: +m[4] * 60 + +m[5], allDay: false };
}

export function parse(ics, today) {
  const end = addDays(today, JOURS);
  const busy = {};
  const add = (k, a, b) => { if (k < today || k > end || b <= a) return; (busy[k] = busy[k] || []).push([a, b]); };
  const lines = ics.replace(/\r?\n[ \t]/g, '');
  const get = (L, name) => L.filter(l => l.startsWith(name + ':') || l.startsWith(name + ';'));
  const evs = lines.split('BEGIN:VEVENT').slice(1).map(b => {
    const L = b.split('END:VEVENT')[0].split(/\r?\n/);
    return { L, uid: (get(L, 'UID')[0] || '').split(':').slice(1).join(':'), rid: parseDT(get(L, 'RECURRENCE-ID')[0]) };
  });
  // occurrences d'une série modifiées à part (elles ont leur propre VEVENT)
  const moved = new Set(evs.filter(e => e.rid).map(e => `${e.uid}|${e.rid.k}|${e.rid.min}`));

  for (const { L, uid, rid } of evs) {
    if (get(L, 'STATUS').some(l => /CANCELLED/.test(l))) continue;
    if (get(L, 'TRANSP').some(l => /TRANSPARENT/.test(l))) continue; // marqué « disponible »
    const s = parseDT(get(L, 'DTSTART')[0]);
    if (!s) continue;
    const e = parseDT(get(L, 'DTEND')[0]);
    const dur = s.allDay ? (e ? daysBetween(s.k, e.k) : 1) * 1440
      : e ? daysBetween(s.k, e.k) * 1440 + e.min - s.min : 60;

    const ex = new Set();
    get(L, 'EXDATE').forEach(l => {
      const params = l.slice(0, l.indexOf(':'));
      l.slice(l.indexOf(':') + 1).split(',').forEach(v => { const d = parseDT(params + ':' + v); if (d) ex.add(`${d.k}|${d.min}`); });
    });
    const block = k => {
      if (ex.has(`${k}|${s.min}`) || (!rid && moved.has(`${uid}|${k}|${s.min}`))) return;
      let rest = dur, day = k, from = s.min;
      while (rest > 0) { const to = Math.min(1440, from + rest); add(day, from, to); rest -= to - from; day = addDays(day, 1); from = 0; }
    };

    const rr = (get(L, 'RRULE')[0] || '').split(':').slice(1).join(':');
    if (!rr) { block(s.k); continue; }
    const R = Object.fromEntries(rr.split(';').map(x => x.split('=')));
    const interval = +(R.INTERVAL || 1), count = R.COUNT ? +R.COUNT : Infinity;
    const until = R.UNTIL ? parseDT('X:' + R.UNTIL).k : '9999-12-31';
    let n = 0;
    if (R.FREQ === 'DAILY') {
      for (let k = s.k; k <= end && k <= until && n < count; k = addDays(k, interval)) { block(k); n++; }
    } else if (R.FREQ === 'WEEKLY') {
      const names = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
      const by = (R.BYDAY ? R.BYDAY.split(',').map(d => names.indexOf(d.slice(-2))) : [weekday(s.k)])
        .sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)); // lundi d'abord
      outer: for (let wk = addDays(s.k, -((weekday(s.k) + 6) % 7)); wk <= end; wk = addDays(wk, 7 * interval)) {
        for (const wd of by) {
          const k = addDays(wk, (wd + 6) % 7);
          if (k < s.k) continue;
          if (k > until || k > end || n >= count) break outer;
          block(k); n++;
        }
      }
    } else {
      block(s.k); // répétition mensuelle ou annuelle : seule la première date est lue
    }
  }
  for (const k in busy) busy[k].sort((a, b) => a[0] - b[0]);
  return busy;
}
