// ⚠️ À FAIRE : remplacer CAL_LINK par le vrai lien Cal.com
// Exemple : "toncompte/coupe-homme" (sans "https://cal.com/")
const CAL_LINK = "REMPLACER_PAR_TON_LIEN_CALCOM";

(function (C, A, L) {
  let p = function (a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function () {
    let cal = C.Cal;
    let ar = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      d.head.appendChild(d.createElement("script")).src = A;
      cal.loaded = true;
    }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        cal.ns[namespace] = cal.ns[namespace] || api;
        p(cal.ns[namespace], ar);
        p(cal, ["initNamespace", namespace]);
      } else {
        p(cal, ar);
      }
      return;
    }
    p(cal, ar);
  };
})(window, "https://app.cal.com/embed/embed.js", "init");

Cal("init", { origin: "https://cal.com" });

Cal("inline", {
  elementOrSelector: "#my-cal-inline",
  calLink: CAL_LINK,
  layout: "month_view",
});

Cal("ui", {
  styles: { branding: { brandColor: "#2f5fed" } },
  hideEventTypeDetails: false,
  layout: "month_view",
});
