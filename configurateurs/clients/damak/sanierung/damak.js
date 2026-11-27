/* DAMAK Wintergarten-Service — Sanierungs-Rechner (démo Wibzo, 24.11.2026).
   Demandé par Darko Maksimović (mail du 20.11.2026) : le client décrit son installation EXISTANTE,
   choisit les travaux, voit un Richtpreis et envoie une demande structurée (avec photos).
   Services repris de damak.ch (lu le 24.11.2026) et de son mail : Dachersatz Glas/Polycarbonat,
   Glaswechsel, Dichtungen/Fugen, Dach- und Senkrechtmarkisen, Markisentücher, Schiebe-/Faltverglasungen,
   Sanierung/Expertise, Reinigung.
   ⚠️ Tous les PRIX sont FICTIFS. Zones = démo (à adapter). Chargé après ../../../demo-devis/metiers.js (copie locale). */

window.ENTREPRISE = { nom: 'DAMAK Wintergarten-Service', logo: '../marque/logo.png', configurateur3d: '../' };

// ---------- Textes propres à cette démo ----------
Object.assign(window.TEXTES.de, {
  demo: 'Demo · fiktive Preise', calculateur: 'Richtpreis', navCalc: 'Richtpreis berechnen', navTarifs: 'Preise', navFaq: 'Fragen',
  aVilles: ['Rothrist', 'Oensingen', 'Zofingen', 'Olten', 'Langenthal'],
  voirPrix: 'Richtpreis anzeigen', aucune: 'Keine, weiter', choisir: 'Bitte wählen Sie mindestens eine Arbeit.',
  direct: 'Aktueller Richtpreis', zoneQ: 'Wo steht Ihr Wintergarten?', zoneAide: 'Damit wir die Anfahrt und den Einsatz planen können.',
  resultat: 'Ihr Richtpreis', resNote: 'Preisspanne inkl. MWST. Die definitive Offerte folgt nach einer Besichtigung Ihrer Anlage.',
  bestand: 'Ihre Anlage', offre: 'Offerte anfragen', envoyer: 'Anfrage senden',
  remarques: 'Bemerkungen (Schaden, Hersteller, Zugang…)', photos: 'Fotos Ihrer Anlage (optional)', photosAide: 'Gesamtansicht und Schaden: so können wir die Besichtigung gezielt vorbereiten.',
  merciP: n => `${n} hat Ihre Anfrage mit allen Angaben zu Ihrer Anlage, den gewünschten Arbeiten und dem Richtpreis erhalten. Für die Besichtigung werden Sie kontaktiert.`,
  noteDemo: n => `Demo: Auf Ihrer Website landet jede Anfrage direkt im Posteingang von ${n}: Anlage (Bauart, Masse, Dach, Alter, Zustand), gewünschte Arbeiten, Richtpreis und Fotos.`,
  tarifsSur: 'Preise', devisLignes: ['Kostenlos und unverbindlich', 'Richtpreis in 2 Minuten', 'Definitive Offerte nach Besichtigung'], calculer: 'Richtpreis berechnen',
  compSur: 'Anfrage', compT: 'Vollständige Anfrage statt Telefon-Pingpong',
  compP: 'Der Kunde beschreibt seine bestehende Anlage selbst und wählt die Arbeiten aus. Sie erhalten eine strukturierte Anfrage, bevor Sie hinfahren.',
  compCols: ['', 'Per Telefon / E-Mail', 'Mit diesem Rechner'],
  compLignes: [['Angaben zur Anlage', 'oft unvollständig', 'Bauart, Masse, Dach, Alter'], ['Gewünschte Arbeiten', 'im Gespräch zu klären', 'klar ausgewählt'], ['Fotos', 'separat nachfragen', 'direkt mitgeschickt'], ['Richtpreis für den Kunden', 'erst nach Besichtigung', 'sofort online']],
  zonesSur: 'Einsatzgebiet', zonesP: 'Demo: Das Einsatzgebiet wird bei der Installation an Ihre Region angepasst.',
  faqT: 'Fragen zum Richtpreis', neu3d: 'Neuer Wintergarten oder Pergola? 3D-Konfigurator',
  bas: 'Demo-Preise, bei der Installation durch die Tarife von DAMAK ersetzt.', fait: 'Rechner von Wibzo'
});
Object.assign(window.TEXTES.fr, {
  demo: 'Démo · prix fictifs', calculateur: 'Prix indicatif', navCalc: 'Calculer le prix', navTarifs: 'Prix', navFaq: 'Questions',
  aVilles: ['Rothrist', 'Oensingen', 'Zofingue', 'Olten', 'Langenthal'],
  voirPrix: 'Voir le prix indicatif', choisir: 'Choisissez au moins un travail.',
  direct: 'Prix indicatif actuel', zoneQ: 'Où se trouve votre jardin d\'hiver ?', zoneAide: 'Pour planifier le déplacement et l\'intervention.',
  resultat: 'Votre prix indicatif', resNote: 'Fourchette TTC. L\'offre définitive suit une visite de votre installation.',
  bestand: 'Votre installation', offre: 'Demander une offre', envoyer: 'Envoyer la demande',
  remarques: 'Remarques (dégât, fabricant, accès…)', photos: 'Photos de votre installation (facultatif)', photosAide: 'Vue d\'ensemble et dégât : la visite peut être préparée à l\'avance.',
  merciP: n => `${n} a reçu votre demande avec toutes les informations sur votre installation, les travaux choisis et le prix indicatif. Vous serez contacté pour la visite.`,
  noteDemo: n => `Démo : sur votre site, chaque demande arrive directement chez ${n} : installation (construction, dimensions, toit, âge, état), travaux choisis, prix indicatif et photos.`,
  devisLignes: ['Gratuit et sans engagement', 'Prix indicatif en 2 minutes', 'Offre définitive après visite'], calculer: 'Calculer le prix',
  compSur: 'Demande', compT: 'Une demande complète au lieu d\'allers-retours',
  compP: 'Le client décrit lui-même son installation existante et choisit les travaux. Vous recevez une demande structurée avant de vous déplacer.',
  compCols: ['', 'Par téléphone / e-mail', 'Avec ce calculateur'],
  compLignes: [['Infos sur l\'installation', 'souvent incomplètes', 'construction, dimensions, toit, âge'], ['Travaux souhaités', 'à clarifier', 'choisis clairement'], ['Photos', 'à redemander', 'envoyées directement'], ['Prix indicatif pour le client', 'après la visite', 'tout de suite en ligne']],
  zonesSur: 'Zone d\'intervention', zonesP: 'Démo : la zone d\'intervention est adaptée à votre région lors de l\'installation.',
  faqT: 'Questions sur le prix indicatif', neu3d: 'Nouveau jardin d\'hiver ou pergola ? Configurateur 3D',
  bas: 'Prix de démonstration, remplacés par les tarifs de DAMAK lors de l\'installation.', fait: 'Calculateur réalisé par Wibzo'
});

// Zones : démo, autour de Rothrist et Oensingen (à confirmer avec DAMAK)
window.ZONES = {
de: [
  { v: 'ag', art: 'fleuve', nom: 'Aargau', lieux: ['Rothrist', 'Zofingen', 'Aarburg', 'Oftringen', 'Aarau', 'Lenzburg'] },
  { v: 'so', art: 'chateau', nom: 'Solothurn', lieux: ['Oensingen', 'Olten', 'Solothurn', 'Balsthal', 'Grenchen'] },
  { v: 'be', art: 'pont', nom: 'Bern', lieux: ['Langenthal', 'Bern', 'Burgdorf', 'Herzogenbuchsee', 'Huttwil'] },
  { v: 'lu', art: 'lac-montagnes', nom: 'Luzern', lieux: ['Luzern', 'Sursee', 'Willisau', 'Dagmersellen', 'Reiden'] },
  { v: 'bs', art: 'tours', nom: 'Basel', lieux: ['Basel', 'Liestal', 'Sissach', 'Pratteln', 'Muttenz'] }],
fr: [
  { v: 'ag', art: 'fleuve', nom: 'Argovie', lieux: ['Rothrist', 'Zofingue', 'Aarburg', 'Oftringen', 'Aarau', 'Lenzbourg'] },
  { v: 'so', art: 'chateau', nom: 'Soleure', lieux: ['Oensingen', 'Olten', 'Soleure', 'Balsthal', 'Granges'] },
  { v: 'be', art: 'pont', nom: 'Berne', lieux: ['Langenthal', 'Berne', 'Berthoud', 'Herzogenbuchsee', 'Huttwil'] },
  { v: 'lu', art: 'lac-montagnes', nom: 'Lucerne', lieux: ['Lucerne', 'Sursee', 'Willisau', 'Dagmersellen', 'Reiden'] },
  { v: 'bs', art: 'tours', nom: 'Bâle', lieux: ['Bâle', 'Liestal', 'Sissach', 'Pratteln', 'Muttenz'] }]
};

// Pictogrammes propres (24×24, traits)
window.PICTOS_EXTRA = {
  wg: '<path d="M3 21V11l9-6 9 4v12M3 21h18M3 11h18M8 21V11M13 21V11M18 21V11"/>',
  wgHolz: '<path d="M3 21V11l9-6 9 4v12M3 21h18M3 11h18M8 21V11M13 21V11M18 21V11"/><path d="M4.5 14h2M9.5 16h2M14.5 13h2" stroke-dasharray="1 1.5"/>',
  wgMix: '<path d="M3 21V11l9-6 9 4v12M3 21h18M3 11h18M8 21V11M13 21V11M18 21V11"/><path d="M3 12.5h18"/>',
  dachGlas: '<path d="M2 15l10-8 10 8"/><path d="M5 12.6l4 2.4M9 9.4l5 3.6M14 9.4l3 2.2"/><path d="M4 15v5h16v-5"/>',
  dachPoly: '<path d="M2 15l10-8 10 8"/><path d="M4.5 13l7.5-6 7.5 6M7 13.5V11M10 13.5V9M14 13.5V9M17 13.5V11"/><path d="M4 15v5h16v-5"/>',
  frage: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 015 .5c0 1.8-2.5 2-2.5 4M12 17h.01"/>',
  dach: '<path d="M2 12l10-7 10 7"/><path d="M5 10v10h14V10"/><path d="M8 7l3 3M14 6l4 3" stroke-dasharray="2 1.5"/>',
  glas: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 3l3 6-3 4 4 8M11 9l5 1"/>',
  dicht: '<path d="M12 3c3 4 6 7 6 11a6 6 0 01-12 0c0-4 3-7 6-11z"/><path d="M9 14a3 3 0 003 3"/>',
  markise: '<path d="M3 5h18M3 5l3 9h12l3-9M6 14v2M10 14v2M14 14v2M18 14v2"/><path d="M3 21h18"/>',
  senkrecht: '<rect x="5" y="3" width="14" height="4" rx="1"/><path d="M6 7v12h12V7M6 19h12M9 7v12M12 7v12M15 7v12" stroke-dasharray="0"/>',
  tuch: '<rect x="4" y="3" width="16" height="4" rx="2"/><path d="M5 7l1 13h12l1-13M8 10l8 7M16 10l-8 7" opacity=".6"/>',
  schiebe: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M9 4v16M15 4v16M3 20h18M10 12h3M7 12l-2-1.5v3z"/>',
  falt: '<path d="M3 20V4M3 4l4 2v14M7 6l4-2v16M11 4l4 2v14M15 6l4-2v16M3 20h18"/>',
  lupe: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l6 6M8 10.5h5M10.5 8v5"/>',
  eponge: '<rect x="4" y="9" width="16" height="10" rx="2"/><path d="M7 9V6M12 9V4M17 9V6M8 14h.01M12 13h.01M16 15h.01"/>',
  goutte: '<path d="M12 3c3 4 6 7 6 11a6 6 0 01-12 0c0-4 3-7 6-11z"/>',
  gouttes: '<path d="M8 3c2 3 4 5 4 8a4 4 0 01-8 0c0-3 2-5 4-8zM17 10c1.5 2 3 3.5 3 5.5a3 3 0 01-6 0c0-2 1.5-3.5 3-5.5z"/>',
  ok: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9"/>',
  manivelle: '<circle cx="12" cy="12" r="3"/><path d="M12 9V4h5M15 12h5"/>',
  moteur: '<rect x="4" y="8" width="12" height="8" rx="1.5"/><path d="M16 12h4M8 8V5M12 8V5"/>',
  telecommande: '<rect x="8" y="3" width="8" height="18" rx="2"/><circle cx="12" cy="8" r="1.5"/><path d="M10.5 13h3M10.5 16h3"/>'
};

// ---------- Le calculateur ----------
const a = (v, x) => (v.arbeiten || []).includes(x);
const dachM2 = v => Math.round(v.breite * v.tiefe * 1.06 * 10) / 10; // pente du toit : +6 %
window.METIERS = {
damak: {
  plan: 'wintergarten',
  de: { nom: 'Wintergarten-Sanierung', service: 'Wintergarten-Sanierung', combien: 'Was kostet die Sanierung eines Wintergartens?', sous: 'Bestehende Anlage beschreiben, Arbeiten wählen, Richtpreis sehen: Dachersatz, Glaswechsel, Markisen, Verglasungen.' },
  fr: { nom: 'Rénovation de jardin d\'hiver', service: 'rénovation de jardin d\'hiver', combien: 'Combien coûte la rénovation d\'un jardin d\'hiver ?', sous: 'Décrivez votre installation, choisissez les travaux et voyez un prix indicatif : toit, vitrages, stores, vitrages coulissants.' },
  tarif: { chiffre: '180', unite: { de: 'CHF/m² ab', fr: 'CHF/m² dès' }, sous: { de: 'Dachersatz Polycarbonat, montiert', fr: 'Remplacement du toit en polycarbonate, posé' } },
  etapes: [
    { id: 'bauart', kurz: { de: 'Bauart', fr: 'Construction' }, type: 'cartes', recap: true, val: 'alu', de: 'Woraus ist Ihr Wintergarten gebaut?', fr: 'En quoi est construit votre jardin d\'hiver ?', opts: [
      { v: 'alu', k: 1, ic: 'wg', cote: 'Alu', de: ['Aluminium', 'Am häufigsten'], fr: ['Aluminium', 'Le plus courant'] },
      { v: 'holz', k: 1.12, ic: 'wgHolz', cote: 'Holz', de: ['Holz', 'Mehr Aufwand bei Dichtungen'], fr: ['Bois', 'Joints plus délicats'] },
      { v: 'holzalu', k: 1.06, ic: 'wgMix', cote: 'Holz-Alu', de: ['Holz-Aluminium', 'Innen Holz, aussen Alu'], fr: ['Bois-aluminium', 'Bois dedans, alu dehors'] },
      { v: 'kunststoff', k: 0.96, ic: 'wg', cote: 'PVC', de: ['Kunststoff', 'PVC-Profile'], fr: ['PVC', 'Profilés plastique'] }] },
    { id: 'masse', kurz: { de: 'Masse (B × T)', fr: 'Dimensions (l × p)' }, type: 'mesures', recap: true, de: 'Wie gross ist der Wintergarten?', fr: 'Quelles sont les dimensions ?',
      aidede: 'Aussenmasse ungefähr: eine Schätzung reicht für den Richtpreis.', aidefr: 'Dimensions extérieures approximatives : une estimation suffit.',
      items: [{ id: 'breite', min: 2, max: 10, val: 4, de: 'Breite (entlang der Fassade), m', fr: 'Largeur (le long de la façade), m' },
              { id: 'tiefe', min: 2, max: 6, val: 3, de: 'Tiefe, m', fr: 'Profondeur, m' }] },
    { id: 'dachIst', kurz: { de: 'Dach heute', fr: 'Toit actuel' }, type: 'cartes', recap: true, val: 'glas', de: 'Welches Dach hat er heute?', fr: 'Quel toit a-t-il aujourd\'hui ?', opts: [
      { v: 'glas', ic: 'dachGlas', cote: 'Glas', de: ['Glasdach', 'Isolier- oder Sicherheitsglas'], fr: ['Toit en verre', 'Verre isolant ou de sécurité'] },
      { v: 'poly', ic: 'dachPoly', cote: 'Stegplatten', de: ['Polycarbonat', 'Stegplatten'], fr: ['Polycarbonate', 'Plaques alvéolaires'] },
      { v: 'weiss', ic: 'frage', cote: '?', de: ['Weiss nicht', 'Wir sehen es bei der Besichtigung'], fr: ['Je ne sais pas', 'Nous le verrons sur place'] }] },
    { id: 'alter', kurz: { de: 'Alter', fr: 'Âge' }, type: 'cartes', recap: true, val: 'mittel', de: 'Wie alt ist die Anlage?', fr: 'Quel âge a l\'installation ?', opts: [
      { v: 'jung', ic: 'horloge', cote: '< 10 J.', de: ['Unter 10 Jahre', ''], fr: ['Moins de 10 ans', ''] },
      { v: 'mittel', ic: 'horloge', cote: '10–20 J.', de: ['10 bis 20 Jahre', 'Dichtungen oft am Ende'], fr: ['10 à 20 ans', 'Joints souvent usés'] },
      { v: 'alt', ic: 'horloge', cote: '> 20 J.', de: ['Über 20 Jahre', 'Sanierung lohnt sich oft'], fr: ['Plus de 20 ans', 'Rénovation souvent rentable'] }] },
    { id: 'zustand', kurz: { de: 'Zustand', fr: 'État' }, type: 'cartes', recap: true, val: 'ok', de: 'Gibt es ein Problem?', fr: 'Y a-t-il un problème ?', opts: [
      { v: 'ok', ic: 'ok', cote: 'dicht', de: ['Alles dicht', 'Modernisieren oder vorbeugen'], fr: ['Tout est étanche', 'Moderniser ou prévenir'] },
      { v: 'beschlag', ic: 'goutte', cote: 'trüb', de: ['Beschlagene / trübe Scheiben', 'Kondenswasser im Glas'], fr: ['Vitres embuées / ternes', 'Condensation dans le verre'] },
      { v: 'undicht', ic: 'gouttes', cote: 'undicht', de: ['Es tropft / ist undicht', 'Wasser tritt ein'], fr: ['Ça goutte / fuit', 'L\'eau entre'] },
      { v: 'bruch', ic: 'glas', cote: 'Bruch', de: ['Glasbruch / Schaden', 'Riss, Sturm, Hagel'], fr: ['Bris de verre / dégât', 'Fissure, tempête, grêle'] }] },
    { id: 'arbeiten', type: 'options', requis: true, de: 'Welche Arbeiten wünschen Sie?', fr: 'Quels travaux souhaitez-vous ?', aidede: 'Mehrere Antworten möglich.', aidefr: 'Plusieurs réponses possibles.', opts: [
      { v: 'dach', ic: 'dach', de: ['Dach ersetzen', 'Glas oder Polycarbonat'], fr: ['Remplacer le toit', 'Verre ou polycarbonate'] },
      { v: 'glas', ic: 'glas', de: ['Glaswechsel', 'Einzelne Scheiben ersetzen'], fr: ['Changer des vitres', 'Vitres une par une'] },
      { v: 'dicht', ic: 'dicht', de: ['Dichtungen & Fugen', 'Gummi, Silikon, Abdichtung'], fr: ['Joints & étanchéité', 'Caoutchouc, silicone, bandes'] },
      { v: 'markise', ic: 'markise', de: ['Markisen', 'Dach- oder Senkrechtmarkise, neu'], fr: ['Stores', 'Store de toit ou vertical, neuf'] },
      { v: 'tuch', ic: 'tuch', de: ['Markisentuch ersetzen', 'Bestehende Markise'], fr: ['Changer la toile', 'Store existant'] },
      { v: 'schiebe', ic: 'schiebe', de: ['Schiebe- / Faltverglasung', 'Neu oder Ersatz'], fr: ['Vitrage coulissant / pliant', 'Neuf ou remplacement'] },
      { v: 'reinigung', ic: 'eponge', de: ['Reinigung', 'Glas, Profile, Lamellen'], fr: ['Nettoyage', 'Verre, profilés, lamelles'] },
      { v: 'check', ic: 'lupe', de: ['Sanierungs-Check vor Ort', 'Konstruktion, Rost, Wasserablauf'], fr: ['Contrôle sur place', 'Structure, rouille, écoulement'] }] },
    { id: 'dachNeu', si: v => a(v, 'dach'), type: 'cartes', val: 'vsg', de: 'Welches neue Dach?', fr: 'Quel nouveau toit ?', opts: [
      { v: 'vsg', p: 420, ic: 'dachGlas', cote: '420/m²', de: ['Isolierglas VSG', 'Klar, Sicherheitsglas'], fr: ['Verre isolant VSG', 'Clair, verre de sécurité'] },
      { v: 'sonne', p: 520, ic: 'dachGlas', cote: '520/m²', de: ['Sonnenschutzglas', 'Weniger Hitze im Sommer'], fr: ['Verre anti-chaleur', 'Moins de chaleur en été'] },
      { v: 'poly16', p: 180, ic: 'dachPoly', cote: '180/m²', de: ['Polycarbonat 16 mm', 'Leicht, günstig'], fr: ['Polycarbonate 16 mm', 'Léger, économique'] },
      { v: 'poly32', p: 240, ic: 'dachPoly', cote: '240/m²', de: ['Polycarbonat 32 mm', 'Bessere Dämmung'], fr: ['Polycarbonate 32 mm', 'Meilleure isolation'] }] },
    { id: 'scheiben', si: v => a(v, 'glas'), type: 'mesures', de: 'Wie viele Scheiben?', fr: 'Combien de vitres ?', aidede: 'Ungefähre Anzahl genügt.', aidefr: 'Un nombre approximatif suffit.',
      items: [{ id: 'nDach', min: 0, max: 20, val: 1, de: 'Dachscheiben', fr: 'Vitres du toit' }, { id: 'nWand', min: 0, max: 20, val: 1, de: 'Wandscheiben', fr: 'Vitres des parois' }] },
    { id: 'markisen', si: v => a(v, 'markise'), type: 'mesures', de: 'Welche Markisen?', fr: 'Quels stores ?', aidede: 'Dachmarkise auf dem Glasdach, Senkrechtmarkisen an den Seiten.', aidefr: 'Store de toit sur le vitrage, stores verticaux sur les côtés.',
      items: [{ id: 'nDachM', min: 0, max: 3, val: 1, de: 'Dachmarkisen', fr: 'Stores de toit' }, { id: 'nSenk', min: 0, max: 8, val: 2, de: 'Senkrechtmarkisen', fr: 'Stores verticaux' }] },
    { id: 'antrieb', si: v => a(v, 'markise'), type: 'cartes', val: 'motor', de: 'Welcher Antrieb?', fr: 'Quelle commande ?', opts: [
      { v: 'kurbel', p: 0, ic: 'manivelle', cote: '+0', de: ['Kurbel', 'Von Hand'], fr: ['Manivelle', 'À la main'] },
      { v: 'motor', p: 650, ic: 'moteur', cote: '+650/Stk', de: ['Motor mit Schalter', 'Am häufigsten'], fr: ['Moteur + interrupteur', 'Le plus courant'] },
      { v: 'funk', p: 950, ic: 'telecommande', cote: '+950/Stk', de: ['Funk + Wind-/Sonnensensor', 'Fährt automatisch ein'], fr: ['Radio + capteur vent/soleil', 'Se rentre tout seul'] }] },
    { id: 'tuecher', si: v => a(v, 'tuch'), type: 'mesure', min: 1, max: 6, pas: 1, val: 1, unite: 'Stk', de: 'Wie viele Markisentücher?', fr: 'Combien de toiles ?', aidede: 'Pro bestehende Markise ein Tuch.', aidefr: 'Une toile par store existant.', puces: [1, 2, 3, 4] },
    { id: 'system', si: v => a(v, 'schiebe'), type: 'cartes', val: 'schiebe', de: 'Welche Verglasung?', fr: 'Quel vitrage ?', opts: [
      { v: 'schiebe', p: 680, ic: 'schiebe', cote: '680/m', de: ['Schiebeverglasung', 'Mit Rahmen'], fr: ['Vitrage coulissant', 'Avec cadre'] },
      { v: 'falt', p: 890, ic: 'falt', cote: '890/m', de: ['Faltverglasung', 'Ganz zu öffnen'], fr: ['Vitrage pliant', 'S\'ouvre entièrement'] },
      { v: 'rahmenlos', p: 1050, ic: 'schiebe', cote: '1050/m', de: ['Rahmenlose Glas-Schiebewand', 'Freie Sicht'], fr: ['Paroi vitrée sans cadre', 'Vue dégagée'] }] },
    { id: 'oeffnung', si: v => a(v, 'schiebe'), type: 'mesure', min: 2, max: 12, pas: 0.5, val: 4, unite: 'm', de: 'Wie breit ist die Öffnung?', fr: 'Quelle largeur d\'ouverture ?', aidede: 'Gesamte Breite der zu verglasenden Seiten.', aidefr: 'Largeur totale des côtés à vitrer.', puces: [3, 4, 6, 8] }],
  calcul(v, L) {
    const de = L === 'de', out = [], m2 = dachM2(v), k = choix(this, 'bauart', v.bauart).k;
    if (a(v, 'dach')) {
      const o = choix(this, 'dachNeu', v.dachNeu);
      out.push([`${o[L][0]} · ${m2} m²`, m2 * o.p * k]);
      out.push([de ? 'Demontage & Entsorgung altes Dach' : 'Démontage & évacuation de l\'ancien toit', m2 * 45]);
    }
    if (a(v, 'glas')) {
      if (v.nDach) out.push([de ? `Glaswechsel Dach · ${v.nDach} Stk` : `Vitres du toit · ${v.nDach}`, v.nDach * 480]);
      if (v.nWand) out.push([de ? `Glaswechsel Wand · ${v.nWand} Stk` : `Vitres des parois · ${v.nWand}`, v.nWand * 360]);
    }
    if (a(v, 'dicht') && !a(v, 'dach')) out.push([de ? `Dichtungen & Fugen erneuern · ${m2} m²` : `Joints & étanchéité · ${m2} m²`, m2 * 38 * k]);
    if (a(v, 'markise')) {
      const mot = choix(this, 'antrieb', v.antrieb).p, n = (v.nDachM || 0) + (v.nSenk || 0);
      if (v.nDachM) out.push([de ? `Dachmarkise · ${v.nDachM} Stk` : `Store de toit · ${v.nDachM}`, v.nDachM * (1900 + m2 * 110)]);
      if (v.nSenk) out.push([de ? `Senkrechtmarkise · ${v.nSenk} Stk` : `Store vertical · ${v.nSenk}`, v.nSenk * 1450]);
      if (mot && n) out.push([`${choix(this, 'antrieb', v.antrieb)[L][0]} · ${n}×`, n * mot]);
    }
    if (a(v, 'tuch')) out.push([de ? `Markisentuch ersetzen · ${v.tuecher} Stk` : `Toile de store · ${v.tuecher}`, v.tuecher * 720]);
    if (a(v, 'schiebe')) { const o = choix(this, 'system', v.system); out.push([`${o[L][0]} · ${v.oeffnung} m`, v.oeffnung * o.p]); }
    if (a(v, 'reinigung')) out.push([de ? `Reinigung komplett · ${m2} m² Dach` : `Nettoyage complet · ${m2} m² de toit`, Math.max(280, m2 * 16)]);
    if (a(v, 'check')) out.push([de ? 'Sanierungs-Check mit Bericht' : 'Contrôle sur place avec rapport', 350]);
    if (out.length) out.push([de ? 'Anfahrt & Einrichtung' : 'Déplacement & installation', 190]);
    return out;
  },
  inclus: { de: ['Material und Montage', 'Demontage und Entsorgung des Altmaterials', 'Kontrolle der Abdichtung nach Abschluss', 'Dieselbe Ansprechperson von A bis Z'], fr: ['Matériel et pose', 'Démontage et évacuation de l\'ancien matériel', 'Contrôle de l\'étanchéité à la fin', 'Le même interlocuteur du début à la fin'] },
  tableau: { cols: { de: ['Dachersatz', '3 × 3 m', '4 × 4 m'], fr: ['Remplacement du toit', '3 × 3 m', '4 × 4 m'] },
    lignes: ['poly16', 'poly32', 'vsg', 'sonne'].map(x => ({ nom: L => choix(METIERS.damak, 'dachNeu', x)[L][0], v1: { arbeiten: ['dach'], dachNeu: x, breite: 3, tiefe: 3 }, v2: { arbeiten: ['dach'], dachNeu: x, breite: 4, tiefe: 4 } })) },
  faq: { de: [['Ist der Richtpreis verbindlich?', 'Nein. Er zeigt die Grössenordnung. Die definitive Offerte folgt nach der Besichtigung Ihrer Anlage.'], ['Mein Wintergarten ist von einem anderen Hersteller. Geht das?', 'Ja, der Rechner ist für bestehende Anlagen gedacht. Geben Sie den Hersteller in den Bemerkungen an, wenn Sie ihn kennen.'], ['Warum Fotos?', 'Mit Fotos der Anlage und des Schadens kann die Besichtigung gezielt vorbereitet werden.']],
         fr: [['Le prix indicatif est-il définitif ?', 'Non. Il donne l\'ordre de grandeur. L\'offre définitive suit la visite de votre installation.'], ['Mon jardin d\'hiver vient d\'un autre fabricant. Est-ce possible ?', 'Oui, le calculateur est fait pour les installations existantes. Indiquez le fabricant dans les remarques si vous le connaissez.'], ['Pourquoi des photos ?', 'Avec des photos de l\'installation et du dégât, la visite peut être préparée à l\'avance.']] }
}
};
