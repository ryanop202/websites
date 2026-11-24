/* Wibzo — calculateur de devis : textes, zones et métiers.
   Tout ce qui change d'une entreprise à l'autre est ici (prix, étapes, textes).
   ⚠️ Prix FICTIFS (moyennes plausibles) : pour un vrai client, reprendre SES tarifs. */

window.TEXTES = {
fr: {
  demo: 'Démo · prix fictifs', calculateur: 'Calculateur de prix', navCalc: 'Calculer le prix', navTarifs: 'Tarifs', navFaq: 'Questions fréquentes',
  pour: n => `Démo préparée pour ${n}`, etape: (a, b) => `Étape ${a} sur ${b}`, a: 'à', aVilles: ['Genève', 'Lausanne', 'Fribourg', 'Neuchâtel', 'Sion'],
  retour: 'Retour', suivant: 'Suivant', voirPrix: 'Voir mon prix', aucune: 'Aucune, continuer', choisir: 'Choisissez une réponse pour continuer.',
  direct: 'Estimation en cours', zoneQ: 'Où se trouve le chantier ?', zoneAide: 'Nous intervenons dans toute la région, sans supplément de déplacement.',
  resultat: 'Votre prix estimé', resNote: 'Fourchette TTC, déplacement compris. Le montant est confirmé avant l\'intervention, jamais ajouté après coup.',
  detail: 'Détail du calcul', total: 'Total estimé', inclus: 'Compris dans le prix', offre: 'Recevoir mon offre écrite', envoyer: 'Envoyer ma demande',
  nom: 'Nom et prénom', tel: 'Téléphone', mail: 'E-mail', npa: 'NPA et localité', date: 'Date souhaitée', rappel: 'Quand vous rappeler ?', remarques: 'Remarques (accès, parking, photos…)',
  creneaux: ['Peu importe', 'Le matin', 'À midi', 'L\'après-midi', 'Le soir'], manque: 'Indiquez au moins un téléphone ou un e-mail pour recevoir l\'offre.',
  merci: 'Demande envoyée', merciP: n => `${n} a reçu votre demande avec le détail du calcul. Vous recevez une offre écrite sous 24 h ouvrables.`, ref: 'Numéro de demande',
  noteDemo: n => `Démo : une fois installé sur votre site, chaque demande arrive directement dans la boîte mail de ${n}, avec toutes les réponses du client et le prix calculé.`,
  recommencer: 'Nouvelle estimation',
  tarifsSur: 'Prix', devisLignes: ['Devis gratuit et sans engagement', 'Montant exact en 30 secondes', 'Prix confirmé avant l\'intervention'], calculer: 'Calculer mon prix',
  compSur: 'Forfait ou régie', compT: 'Prix au forfait ou tarif horaire ?',
  compP: 'Un tarif horaire annonce un taux : le total n\'est connu qu\'à la fin. Un forfait annonce directement le total. Ce calculateur affiche le total avant la commande.',
  compCols: ['', 'Tarif horaire', 'Forfait (ce calculateur)'],
  compLignes: [['Ce que vous connaissez à la commande', 'le taux', 'le total'], ['Ce qui fait varier la facture', 'le temps passé', 'rien'], ['Si le travail prend plus longtemps', 'la facture monte', 'prix inchangé'], ['Devis', 'après visite', 'en 30 s, en ligne']],
  zonesSur: 'Zones desservies', zonesT: n => `Où intervient ${n} ?`, zonesP: 'Le même tarif s\'applique dans toutes ces communes, sans supplément de déplacement.',
  faqSur: 'Questions fréquentes', faqT: 'Vos questions sur le prix',
  bas: 'Prix de démonstration, à remplacer par les tarifs de l\'entreprise lors de l\'installation.', fait: 'Calculateur réalisé par Wibzo', notreEntreprise: 'votre entreprise'
},
de: {
  demo: 'Demo · fiktive Preise', calculateur: 'Preisrechner', navCalc: 'Preis berechnen', navTarifs: 'Tarife', navFaq: 'Häufige Fragen',
  pour: n => `Demo für ${n}`, etape: (a, b) => `Schritt ${a} von ${b}`, a: 'in', aVilles: ['Zürich', 'Bern', 'Basel', 'Luzern', 'St. Gallen'],
  retour: 'Zurück', suivant: 'Weiter', voirPrix: 'Meinen Preis anzeigen', aucune: 'Keine, weiter', choisir: 'Bitte wählen Sie eine Antwort.',
  direct: 'Aktuelle Schätzung', zoneQ: 'Wo befindet sich der Auftrag?', zoneAide: 'Wir sind in der ganzen Region tätig, ohne Anfahrtszuschlag.',
  resultat: 'Ihr geschätzter Preis', resNote: 'Preisspanne inkl. MWST und Anfahrt. Der Betrag wird vor dem Einsatz bestätigt, nie nachträglich erhöht.',
  detail: 'Berechnung im Detail', total: 'Geschätztes Total', inclus: 'Im Preis inbegriffen', offre: 'Schriftliche Offerte erhalten', envoyer: 'Anfrage senden',
  nom: 'Vor- und Nachname', tel: 'Telefon', mail: 'E-Mail', npa: 'PLZ und Ort', date: 'Wunschtermin', rappel: 'Wann dürfen wir anrufen?', remarques: 'Bemerkungen (Zugang, Parkplatz, Fotos…)',
  creneaux: ['Egal', 'Morgens', 'Mittags', 'Nachmittags', 'Abends'], manque: 'Bitte geben Sie mindestens eine Telefonnummer oder E-Mail an.',
  merci: 'Anfrage gesendet', merciP: n => `${n} hat Ihre Anfrage mit der detaillierten Berechnung erhalten. Sie erhalten innert 24 Arbeitsstunden eine schriftliche Offerte.`, ref: 'Anfragenummer',
  noteDemo: n => `Demo: Auf Ihrer Website landet jede Anfrage direkt im Posteingang von ${n}, mit allen Antworten des Kunden und dem berechneten Preis.`,
  recommencer: 'Neue Schätzung',
  tarifsSur: 'Preise', devisLignes: ['Kostenlos und unverbindlich', 'Genauer Betrag in 30 Sekunden', 'Preis vor dem Einsatz bestätigt'], calculer: 'Preis berechnen',
  compSur: 'Pauschal oder Regie', compT: 'Pauschalpreis oder Stundenansatz?',
  compP: 'Ein Stundenansatz nennt einen Satz: Das Total kennt man erst am Schluss. Ein Pauschalpreis nennt direkt das Total. Dieser Rechner zeigt das Total vor der Bestellung.',
  compCols: ['', 'Stundenansatz', 'Pauschal (dieser Rechner)'],
  compLignes: [['Was Sie bei der Bestellung kennen', 'den Satz', 'das Total'], ['Was die Rechnung verändert', 'die Arbeitszeit', 'nichts'], ['Wenn die Arbeit länger dauert', 'Rechnung steigt', 'Preis bleibt'], ['Offerte', 'nach Besichtigung', 'in 30 s, online']],
  zonesSur: 'Einsatzgebiet', zonesT: n => `Wo ist ${n} tätig?`, zonesP: 'In all diesen Gemeinden gilt derselbe Tarif, ohne Anfahrtszuschlag.',
  faqSur: 'Häufige Fragen', faqT: 'Ihre Fragen zum Preis',
  bas: 'Demo-Preise, bei der Installation durch die Tarife des Betriebs ersetzt.', fait: 'Rechner von Wibzo', notreEntreprise: 'Ihr Betrieb'
}};

// Zones : la première étape de chaque calculateur. `art` = dessin de la carte (voir dessins dans app.js).
window.ZONES = {
fr: [
  { v: 'ge', art: 'lac-jet', nom: 'Genève', lieux: ['Genève', 'Carouge', 'Vernier', 'Lancy', 'Meyrin', 'Onex', 'Thônex', 'Versoix'] },
  { v: 'vd', art: 'vignes', nom: 'Vaud', lieux: ['Lausanne', 'Nyon', 'Yverdon-les-Bains', 'Morges', 'Vevey', 'Renens', 'Pully', 'Montreux'] },
  { v: 'fr', art: 'pont', nom: 'Fribourg', lieux: ['Fribourg', 'Bulle', 'Morat', 'Villars-sur-Glâne', 'Marly', 'Estavayer-le-Lac'] },
  { v: 'ne', art: 'chateau', nom: 'Neuchâtel', lieux: ['Neuchâtel', 'La Chaux-de-Fonds', 'Le Locle', 'Peseux', 'Marin-Epagnier'] },
  { v: 'vs', art: 'montagnes', nom: 'Valais', lieux: ['Sion', 'Sierre', 'Martigny', 'Monthey', 'Conthey', 'Savièse'] }],
de: [
  { v: 'zh', art: 'tours', nom: 'Zürich', lieux: ['Zürich', 'Winterthur', 'Uster', 'Dübendorf', 'Dietikon', 'Wetzikon'] },
  { v: 'be', art: 'pont', nom: 'Bern', lieux: ['Bern', 'Biel', 'Thun', 'Köniz', 'Ostermundigen', 'Burgdorf'] },
  { v: 'bs', art: 'fleuve', nom: 'Basel', lieux: ['Basel', 'Riehen', 'Allschwil', 'Reinach', 'Muttenz', 'Liestal'] },
  { v: 'lu', art: 'lac-montagnes', nom: 'Zentralschweiz', lieux: ['Luzern', 'Zug', 'Kriens', 'Emmen', 'Cham', 'Schwyz'] },
  { v: 'sg', art: 'montagnes', nom: 'Ostschweiz', lieux: ['St. Gallen', 'Gossau', 'Wil', 'Rorschach', 'Herisau', 'Appenzell'] }]
};

/* Types d'étapes : cartes (un choix, passe à la suite), options (plusieurs choix), mesure (un curseur), mesures (plusieurs curseurs).
   `ic` = pictogramme dessiné sur la carte, `cote` = cote affichée sous le dessin. */
window.METIERS = {

nettoyage: {
  plan: 'appartement',
  fr: { nom: 'Nettoyage fin de bail', service: 'nettoyage de fin de bail', combien: 'Combien coûte un nettoyage de fin de bail ?',  sous: 'Avec garantie de remise de l\'appartement à la régie. Prix au m², connu avant l\'intervention.' },
  de: { nom: 'Endreinigung', service: 'Endreinigung', combien: 'Was kostet eine Endreinigung?',  sous: 'Mit Abnahmegarantie bei der Wohnungsübergabe. Preis pro m², vor dem Einsatz bekannt.' },
  tarif: { chiffre: '10', unite: { fr: 'CHF/m²', de: 'CHF/m²' }, sous: { fr: 'Tout compris, quelle que soit la surface', de: 'Alles inklusive, unabhängig von der Fläche' } },
  etapes: [
    { id: 'type', type: 'cartes', val: '3', fr: 'Quel logement ?', de: 'Welche Wohnung?', opts: [
      { v: '1', m: 32, ic: 'studio', cote: '25–40 m²', fr: ['Studio', '1 – 1.5 pièce'], de: ['Studio', '1 – 1.5 Zimmer'] },
      { v: '2', m: 48, ic: 'appart', cote: '40–55 m²', fr: ['2 pièces', '2 – 2.5 pièces'], de: ['2 Zimmer', '2 – 2.5 Zimmer'] },
      { v: '3', m: 68, ic: 'appart', cote: '55–80 m²', fr: ['3 pièces', '3 – 3.5 pièces'], de: ['3 Zimmer', '3 – 3.5 Zimmer'] },
      { v: '4', m: 92, ic: 'appart', cote: '80–110 m²', fr: ['4 pièces', '4 – 4.5 pièces'], de: ['4 Zimmer', '4 – 4.5 Zimmer'] },
      { v: '5', m: 125, ic: 'appart', cote: '110–150 m²', fr: ['5 pièces et +', '5 pièces ou plus'], de: ['5+ Zimmer', '5 Zimmer oder mehr'] },
      { v: 'villa', m: 160, ic: 'villa', cote: '150 m² +', fr: ['Maison / villa', 'Sur plusieurs niveaux'], de: ['Haus / Villa', 'Mehrere Etagen'] }] },
    { id: 'm2', type: 'mesure', min: 20, max: 300, pas: 1, val: 68, unite: 'm²', depuis: 'type', fr: 'Quelle surface exactement ?', de: 'Welche Fläche genau?',
      aidefr: 'Elle figure sur votre bail. Nous l\'avons préremplie selon votre logement.', aidede: 'Sie steht im Mietvertrag. Wir haben sie passend vorausgefüllt.', puces: [35, 50, 70, 90, 110, 140] },
    { id: 'sdb', type: 'cartes', val: '1', fr: 'Combien de salles d\'eau ?', de: 'Wie viele Nasszellen?', aidefr: 'Salles de bain, douches et WC séparés.', aidede: 'Badezimmer, Duschen und separate WCs.', opts: [
      { v: '1', p: 0, ic: 'bain', cote: '×1', fr: ['Une', 'Salle de bain avec WC'], de: ['Eine', 'Bad mit WC'] },
      { v: '2', p: 110, ic: 'bain', cote: '×2', fr: ['Deux', 'Salle de bain + WC séparé'], de: ['Zwei', 'Bad + separates WC'] },
      { v: '3', p: 220, ic: 'bain', cote: '×3', fr: ['Trois ou plus', ''], de: ['Drei oder mehr', ''] }] },
    { id: 'ext', type: 'options', fr: 'À inclure aussi ?', de: 'Ebenfalls inbegriffen?', opts: [
      { v: 'balcon', p: 90, ic: 'balcon', fr: ['Balcon / terrasse', 'Sol, garde-corps, vitres'], de: ['Balkon / Terrasse', 'Boden, Geländer, Fenster'] },
      { v: 'cave', p: 70, ic: 'cave', fr: ['Cave / galetas', 'Balayage et dépoussiérage'], de: ['Keller / Estrich', 'Wischen und Abstauben'] },
      { v: 'stores', p: 140, ic: 'stores', fr: ['Stores et volets', 'Lames une par une'], de: ['Storen und Läden', 'Lamelle für Lamelle'] },
      { v: 'four', p: 60, ic: 'four', fr: ['Four très encrassé', 'Dégraissage intensif'], de: ['Stark verschmutzter Ofen', 'Intensiv entfetten'] }] },
    { id: 'etat', type: 'cartes', val: 'normal', fr: 'Dans quel état est le logement ?', de: 'In welchem Zustand ist die Wohnung?', opts: [
      { v: 'bon', k: 0.95, ic: 'brille', cote: '−5 %', fr: ['Bien entretenu', 'Nettoyé régulièrement'], de: ['Gut gepflegt', 'Regelmässig gereinigt'] },
      { v: 'normal', k: 1, ic: 'appart', cote: '±0', fr: ['Normal', 'Usure habituelle'], de: ['Normal', 'Übliche Abnutzung'] },
      { v: 'sale', k: 1.2, ic: 'tache', cote: '+20 %', fr: ['Très sale', 'Calcaire, graisse, fumée'], de: ['Stark verschmutzt', 'Kalk, Fett, Rauch'] }] },
    { id: 'quand', type: 'cartes', val: 'normal', fr: 'Quand a lieu l\'état des lieux ?', de: 'Wann ist die Wohnungsabnahme?', opts: [
      { v: 'urgent', k: 1.15, ic: 'eclair', cote: '< 7 j', fr: ['Dans moins de 7 jours', 'Intervention express +15 %'], de: ['In weniger als 7 Tagen', 'Express +15 %'] },
      { v: 'normal', k: 1, ic: 'agenda', cote: '1–4 sem.', fr: ['Dans 1 à 4 semaines', 'Le plus courant'], de: ['In 1 bis 4 Wochen', 'Am häufigsten'] },
      { v: 'tard', k: 0.95, ic: 'horloge', cote: '> 1 mois', fr: ['Dans plus d\'un mois', 'Réservation anticipée −5 %'], de: ['In über einem Monat', 'Frühbucher −5 %'] }] }],
  calcul(v, L) {
    const out = [[L === 'de' ? `Endreinigung ${v.m2} m² · CHF 10/m²` : `Nettoyage ${v.m2} m² · 10 CHF/m²`, v.m2 * 10]];
    const s = choix(this, 'sdb', v.sdb).p; if (s) out.push([L === 'de' ? 'Zusätzliche Nasszellen' : 'Salles d\'eau supplémentaires', s]);
    ajouts(this, v, out, L, {});
    facteur(out, choix(this, 'etat', v.etat).k, L, ['Zustand: stark verschmutzt', 'Logement très sale'], ['Gut gepflegt', 'Logement bien entretenu']);
    facteur(out, choix(this, 'quand', v.quand).k, L, ['Express-Zuschlag', 'Supplément express'], ['Frühbucher-Rabatt', 'Réservation anticipée']);
    return out;
  },
  inclus: { fr: ['Garantie de remise à la régie', 'Retouche gratuite en cas de refus', 'Produits et matériel fournis', 'Contrôle avec vous avant notre départ'], de: ['Abnahmegarantie', 'Gratis-Nachreinigung bei Beanstandung', 'Reinigungsmittel und Material', 'Kontrolle mit Ihnen vor Abschluss'] },
  tableau: { cols: { fr: ['Logement', 'Surface indicative', 'Prix indicatif'], de: ['Wohnung', 'Richtfläche', 'Richtpreis'] },
    lignes: [['1', 25, 40], ['2', 40, 55], ['3', 55, 80], ['4', 80, 110], ['5', 110, 150]].map(([k, a, b]) => ({ nom: L => choix(METIERS.nettoyage, 'type', k)[L][0], cote: `${a} – ${b} m²`, de: a * 10, a: b * 10 })) },
  faq: { fr: [['Que se passe-t-il si la régie refuse l\'appartement ?', 'Nous revenons gratuitement corriger les points relevés lors de l\'état des lieux. C\'est le principe de la garantie de remise.'], ['C\'est la surface ou le nombre de pièces qui compte ?', 'La surface. Le nombre de pièces sert seulement à préremplir une surface habituelle : vous pouvez la corriger à l\'étape suivante.'], ['Faut-il être présent ?', 'Non. Vous nous laissez les clés, et nous faisons le contrôle avec vous ou avec la gérance avant de partir.']],
         de: [['Was passiert, wenn die Verwaltung nicht abnimmt?', 'Wir kommen kostenlos zurück und beheben die Mängel. Das ist das Prinzip der Abnahmegarantie.'], ['Zählt die Fläche oder die Zimmerzahl?', 'Die Fläche. Die Zimmerzahl füllt nur eine übliche Fläche vor: Sie können sie im nächsten Schritt korrigieren.'], ['Muss ich anwesend sein?', 'Nein. Sie geben uns die Schlüssel, und wir machen die Kontrolle mit Ihnen oder der Verwaltung vor Abschluss.']] }
},

cloture: {
  plan: 'cloture',
  fr: { nom: 'Clôtures', service: 'pose de clôture', combien: 'Combien coûte la pose d\'une clôture ?',  sous: 'Matériel, pose et déplacement compris. Cinq questions, sans inscription.' },
  de: { nom: 'Zaunbau', service: 'Zaunmontage', combien: 'Was kostet ein neuer Zaun?',  sous: 'Material, Montage und Anfahrt inklusive. Fünf Fragen, ohne Anmeldung.' },
  tarif: { chiffre: '48', unite: { fr: 'CHF/m dès', de: 'CHF/m ab' }, sous: { fr: 'Grillage posé, selon le type et la hauteur', de: 'Maschendraht montiert, je nach Typ und Höhe' } },
  etapes: [
    { id: 'type', type: 'cartes', val: 'rigide', fr: 'Quel type de clôture ?', de: 'Welcher Zauntyp?', opts: [
      { v: 'grillage', p: 48, ic: 'grillage', cote: '48 CHF/m', fr: ['Grillage souple', 'Le plus économique'], de: ['Maschendraht', 'Am günstigsten'] },
      { v: 'rigide', p: 92, ic: 'rigide', cote: '92 CHF/m', fr: ['Panneaux rigides', 'Le plus demandé'], de: ['Doppelstabmatten', 'Am beliebtesten'] },
      { v: 'bois', p: 145, ic: 'bois', cote: '145 CHF/m', fr: ['Bois', 'Aspect naturel'], de: ['Holz', 'Natürlicher Look'] },
      { v: 'composite', p: 195, ic: 'plein', cote: '195 CHF/m', fr: ['Occultant / composite', 'Brise-vue, sans entretien'], de: ['Sichtschutz / WPC', 'Pflegeleicht'] }] },
    { id: 'long', type: 'mesure', min: 5, max: 200, pas: 1, val: 30, unite: 'm', fr: 'Quelle longueur ?', de: 'Welche Länge?', aidefr: 'Mesurez le tracé à poser. Une estimation suffit.', aidede: 'Messen Sie die Strecke. Eine Schätzung reicht.', puces: [10, 20, 30, 50, 80, 120] },
    { id: 'haut', type: 'cartes', val: '1.2', fr: 'Quelle hauteur ?', de: 'Welche Höhe?', opts: [
      { v: '1.0', k: 0.9, ic: 'hauteur', cote: '1.00 m', fr: ['1.0 m', 'Délimiter'], de: ['1.0 m', 'Abgrenzen'] },
      { v: '1.2', k: 1, ic: 'hauteur', cote: '1.20 m', fr: ['1.2 m', 'Standard jardin'], de: ['1.2 m', 'Standard Garten'] },
      { v: '1.5', k: 1.15, ic: 'hauteur', cote: '1.50 m', fr: ['1.5 m', 'Plus de sécurité'], de: ['1.5 m', 'Mehr Sicherheit'] },
      { v: '1.8', k: 1.32, ic: 'hauteur', cote: '1.80 m', fr: ['1.8 m', 'Intimité complète'], de: ['1.8 m', 'Volle Privatsphäre'] }] },
    { id: 'portes', type: 'options', fr: 'Portillon ou portail ?', de: 'Gartentür oder Tor?', opts: [
      { v: 'portillon', p: 950, ic: 'porte', fr: ['Portillon', 'Passage piéton ~1 m'], de: ['Gartentür', 'Durchgang ~1 m'] },
      { v: 'portail', p: 2900, ic: 'portail', fr: ['Portail battant', 'Accès voiture ~3.5 m'], de: ['Flügeltor', 'Zufahrt ~3.5 m'] },
      { v: 'coulissant', p: 5200, ic: 'portail', fr: ['Portail coulissant motorisé', 'Avec télécommandes'], de: ['Motorisiertes Schiebetor', 'Mit Fernbedienungen'] }] },
    { id: 'terrain', type: 'options', fr: 'Le terrain et l\'existant', de: 'Gelände und Bestand', opts: [
      { v: 'demont', pm: 16, ic: 'benne', fr: ['Ancienne clôture à enlever', 'Démontage et évacuation'], de: ['Alten Zaun entfernen', 'Demontage und Entsorgung'] },
      { v: 'muret', pm: 22, ic: 'muret', fr: ['Pose sur muret ou béton', 'Fixations chimiques'], de: ['Montage auf Mauer / Beton', 'Chemische Verankerung'] },
      { v: 'pente', pct: 0.12, ic: 'pente', fr: ['Terrain en pente', 'Pose en escalier'], de: ['Hanglage', 'Treppenförmige Montage'] }] }],
  calcul(v, L) {
    const o = choix(this, 'type', v.type), base = v.long * o.p * choix(this, 'haut', v.haut).k;
    const out = [[`${o[L][0]} · ${v.long} m × ${v.haut} m`, base]];
    ajouts(this, v, out, L, { metres: v.long, base });
    out.push([L === 'de' ? 'Anfahrt & Einrichtung' : 'Déplacement & installation', 180]); return out;
  },
  inclus: { fr: ['Poteaux, fixations et accessoires', 'Pose par une équipe qualifiée', 'Nettoyage du chantier', 'Garantie 2 ans sur la pose'], de: ['Pfosten, Befestigungen und Zubehör', 'Montage durch Fachteam', 'Baustellenreinigung', '2 Jahre Garantie auf Montage'] },
  tableau: { cols: { fr: ['Clôture (1.2 m)', '20 m', '50 m'], de: ['Zaun (1.2 m)', '20 m', '50 m'] },
    lignes: ['grillage', 'rigide', 'bois', 'composite'].map(k => ({ nom: L => choix(METIERS.cloture, 'type', k)[L][0], v1: { type: k, long: 20 }, v2: { type: k, long: 50 } })) },
  faq: { fr: [['Le prix comprend-il la pose ?', 'Oui : matériel, pose, déplacement et nettoyage du chantier. Une contrainte particulière (rocher, accès impossible) est annoncée avant le début des travaux.'], ['Faut-il une autorisation ?', 'Au-delà d\'une certaine hauteur ou en limite de propriété, certaines communes demandent une annonce. L\'offre écrite précise la règle de votre commune.']],
         de: [['Ist die Montage inbegriffen?', 'Ja: Material, Montage, Anfahrt und Baustellenreinigung. Besondere Bedingungen (Fels, kein Zugang) werden vor Arbeitsbeginn angekündigt.'], ['Braucht es eine Bewilligung?', 'Ab einer gewissen Höhe oder an der Grundstücksgrenze verlangen manche Gemeinden eine Meldung. Die Offerte nennt die Regel Ihrer Gemeinde.']] }
},

peinture: {
  plan: 'appartement',
  fr: { nom: 'Peinture', service: 'travaux de peinture', combien: 'Combien coûtent des travaux de peinture ?',  sous: 'Surface, état des murs, options : estimation immédiate, sans visite.' },
  de: { nom: 'Malerarbeiten', service: 'Malerarbeiten', combien: 'Was kosten Malerarbeiten?',  sous: 'Fläche, Zustand, Optionen: sofortige Schätzung ohne Besichtigung.' },
  tarif: { chiffre: '23', unite: { fr: 'CHF/m² de mur', de: 'CHF/m² Wand' }, sous: { fr: 'Deux couches, murs en bon état', de: 'Zwei Anstriche, Wände in gutem Zustand' } },
  etapes: [
    { id: 'quoi', type: 'cartes', val: 'tout', fr: 'Que faut-il peindre ?', de: 'Was soll gestrichen werden?', opts: [
      { v: 'tout', k: 1, ic: 'appart', cote: 'logement', fr: ['Tout le logement', 'Avant ou après un déménagement'], de: ['Ganze Wohnung', 'Vor oder nach dem Umzug'] },
      { v: 'pieces', k: 1.12, ic: 'rouleau', cote: 'pièces', fr: ['Quelques pièces', 'Salon, chambres, couloir…'], de: ['Einzelne Räume', 'Wohnzimmer, Zimmer, Gang…'] },
      { v: 'escalier', k: 1.3, ic: 'escalier', cote: 'cage', fr: ['Cage d\'escalier', 'Immeuble ou maison'], de: ['Treppenhaus', 'Mehrfamilien- oder Einfamilienhaus'] }] },
    { id: 'm2', type: 'mesure', min: 10, max: 300, pas: 5, val: 80, unite: 'm²', fr: 'Quelle surface au sol ?', de: 'Wie gross ist die Bodenfläche?', aidefr: 'La surface habitable des pièces concernées. Nous en déduisons la surface des murs.', aidede: 'Die Wohnfläche der betroffenen Räume. Daraus berechnen wir die Wandfläche.', puces: [20, 40, 60, 80, 100, 140] },
    { id: 'etat', type: 'cartes', val: 'bon', fr: 'Dans quel état sont les murs ?', de: 'In welchem Zustand sind die Wände?', opts: [
      { v: 'bon', p: 1, ic: 'murOk', cote: '±0', fr: ['Bon état', 'Simple rafraîchissement'], de: ['Guter Zustand', 'Auffrischen'] },
      { v: 'moyen', p: 1.2, ic: 'murMoyen', cote: '+20 %', fr: ['Petits défauts', 'Trous de chevilles, fissures fines'], de: ['Kleine Mängel', 'Dübellöcher, feine Risse'] },
      { v: 'mauvais', p: 1.45, ic: 'murMauvais', cote: '+45 %', fr: ['À reprendre', 'Enduit, grosses fissures'], de: ['Stark beschädigt', 'Spachteln, grosse Risse'] }] },
    { id: 'hp', type: 'cartes', val: '2.5', fr: 'Hauteur sous plafond ?', de: 'Raumhöhe?', opts: [
      { v: '2.5', k: 1, ic: 'hauteur', cote: '≤ 2.50 m', fr: ['Jusqu\'à 2.5 m', 'Construction récente'], de: ['Bis 2.5 m', 'Neubau'] },
      { v: '3', k: 1.15, ic: 'hauteur', cote: '≈ 3.00 m', fr: ['Environ 3 m', 'Années 50 à 80'], de: ['Etwa 3 m', '50er bis 80er Jahre'] },
      { v: '3.5', k: 1.35, ic: 'hauteur', cote: '> 3.00 m', fr: ['Plus de 3 m', 'Ancien, moulures'], de: ['Über 3 m', 'Altbau, Stuck'] }] },
    { id: 'opt', type: 'options', fr: 'Options', de: 'Optionen', opts: [
      { v: 'plafond', pm2: 19, ic: 'plafond', fr: ['Plafonds', 'En plus des murs'], de: ['Decken', 'Zusätzlich zu den Wänden'] },
      { v: 'fonce', pct: 0.12, ic: 'palette', fr: ['Couleur foncée ou vive', 'Une couche de plus'], de: ['Dunkle / kräftige Farbe', 'Ein Anstrich mehr'] },
      { v: 'boiseries', pm2: 6, ic: 'porte', fr: ['Portes et boiseries', 'Laque'], de: ['Türen und Holzwerk', 'Lackarbeiten'] },
      { v: 'meubles', pm2: 4, ic: 'canape', fr: ['Logement meublé', 'Protection des meubles'], de: ['Möblierte Wohnung', 'Möbel schützen'] }] }],
  calcul(v, L) {
    const k = choix(this, 'hp', v.hp).k * choix(this, 'quoi', v.quoi).k, murs = v.m2 * 2.6 * k, base = murs * 23 * choix(this, 'etat', v.etat).p;
    const out = [[L === 'de' ? `Wände · ca. ${Math.round(murs)} m²` : `Murs · env. ${Math.round(murs)} m²`, base], [L === 'de' ? 'Abdecken & Material' : 'Bâches, protections & matériel', 90 + v.m2 * 1.5]];
    ajouts(this, v, out, L, { m2: v.m2, base }); return out;
  },
  inclus: { fr: ['Peinture de qualité professionnelle', 'Rebouchage des petits trous', 'Protection des sols', 'Nettoyage en fin de chantier'], de: ['Profi-Farbe', 'Kleine Löcher verspachteln', 'Bodenschutz', 'Reinigung nach Abschluss'] },
  tableau: { cols: { fr: ['Logement', 'Murs seuls', 'Murs + plafonds'], de: ['Wohnung', 'Nur Wände', 'Wände + Decken'] },
    lignes: [[40, 'Studio', 'Studio'], [65, '3 pièces', '3 Zimmer'], [90, '4 pièces', '4 Zimmer'], [120, '5 pièces', '5 Zimmer']].map(([m, f, d]) => ({ nom: L => `${L === 'de' ? d : f} · ${m} m²`, v1: { m2: m }, v2: { m2: m, opt: ['plafond'] } })) },
  faq: { fr: [['Pourquoi un prix au m² de sol ?', 'C\'est la surface que vous connaissez. Nous en déduisons la surface de murs selon la hauteur sous plafond : vous n\'avez rien à mesurer.'], ['Le prix peut-il changer ?', 'Il est confirmé après un bref échange ou une visite. S\'il change, c\'est avant le début des travaux, jamais après.']],
         de: [['Warum ein Preis pro m² Bodenfläche?', 'Diese Fläche kennen Sie. Wir berechnen daraus die Wandfläche je nach Raumhöhe: Sie müssen nichts ausmessen.'], ['Kann sich der Preis ändern?', 'Er wird nach einem kurzen Gespräch oder einer Besichtigung bestätigt. Falls er sich ändert, dann vor Arbeitsbeginn.']] }
},

demenagement: {
  plan: 'appartement',
  fr: { nom: 'Déménagement', service: 'déménagement', combien: 'Combien coûte un déménagement ?',  sous: 'Logement, distance, étages : votre prix en moins d\'une minute.' },
  de: { nom: 'Umzug', service: 'Umzug', combien: 'Was kostet ein Umzug?',  sous: 'Wohnung, Distanz, Stockwerke: Ihr Preis in weniger als einer Minute.' },
  tarif: { chiffre: '740', unite: { fr: 'CHF dès', de: 'CHF ab' }, sous: { fr: 'Studio, même ville, équipe et camion', de: 'Studio, gleiche Stadt, Team und LKW' } },
  etapes: [
    { id: 'p', type: 'cartes', val: '3.5', fr: 'Quelle taille de logement ?', de: 'Wie gross ist die Wohnung?', opts: [
      { v: '1.5', n: 1.5, ic: 'studio', cote: '≈ 15 m³', fr: ['Studio', '1 – 1.5 pièce'], de: ['Studio', '1 – 1.5 Zimmer'] },
      { v: '2.5', n: 2.5, ic: 'appart', cote: '≈ 25 m³', fr: ['2 pièces', '2 – 2.5 pièces'], de: ['2 Zimmer', '2 – 2.5 Zimmer'] },
      { v: '3.5', n: 3.5, ic: 'appart', cote: '≈ 35 m³', fr: ['3 pièces', '3 – 3.5 pièces'], de: ['3 Zimmer', '3 – 3.5 Zimmer'] },
      { v: '4.5', n: 4.5, ic: 'appart', cote: '≈ 45 m³', fr: ['4 pièces', '4 – 4.5 pièces'], de: ['4 Zimmer', '4 – 4.5 Zimmer'] },
      { v: '5.5', n: 5.5, ic: 'appart', cote: '≈ 55 m³', fr: ['5 pièces et +', ''], de: ['5+ Zimmer', ''] },
      { v: 'villa', n: 7, ic: 'villa', cote: '≈ 70 m³', fr: ['Maison / villa', ''], de: ['Haus / Villa', ''] }] },
    { id: 'km', type: 'mesure', min: 1, max: 400, pas: 1, val: 15, unite: 'km', fr: 'Quelle distance entre les deux adresses ?', de: 'Wie weit liegen die Adressen auseinander?', aidefr: 'Une estimation suffit.', aidede: 'Eine Schätzung reicht.', puces: [5, 15, 30, 60, 120, 250] },
    { id: 'etages', type: 'mesures', fr: 'Étages sans ascenseur', de: 'Stockwerke ohne Lift', aidefr: 'Mettez 0 s\'il y a un ascenseur ou si c\'est au rez.', aidede: '0 wählen, wenn es einen Lift gibt oder im Parterre.', items: [
      { id: 'e1', min: 0, max: 6, val: 2, fr: 'Au départ', de: 'Beim Auszug' }, { id: 'e2', min: 0, max: 6, val: 0, fr: 'À l\'arrivée', de: 'Beim Einzug' }] },
    { id: 'serv', type: 'options', fr: 'Services en plus', de: 'Zusätzliche Services', opts: [
      { v: 'emb', pp: 140, ic: 'carton', fr: ['Emballage par nos soins', 'Cartons et matériel fournis'], de: ['Einpacken durch uns', 'Kartons inklusive'] },
      { v: 'mont', pp: 70, ic: 'outils', fr: ['Démontage / remontage', 'Lits, armoires, tables'], de: ['Ab- und Aufbau', 'Betten, Schränke, Tische'] },
      { v: 'piano', p: 450, ic: 'piano', fr: ['Piano', 'Transport spécialisé'], de: ['Klavier', 'Spezialtransport'] },
      { v: 'lift', p: 380, ic: 'lift', fr: ['Monte-meubles', 'Par la fenêtre ou le balcon'], de: ['Möbellift', 'Über Fenster oder Balkon'] },
      { v: 'net', pp: 180, ic: 'brille', fr: ['Nettoyage de fin de bail', 'Avec garantie de remise'], de: ['Endreinigung', 'Mit Abnahmegarantie'] }] },
    { id: 'quand', type: 'cartes', val: 'semaine', fr: 'Quelle date ?', de: 'Welches Datum?', opts: [
      { v: 'fin', k: 1.12, ic: 'agenda', cote: '+12 %', fr: ['Fin de mois', 'Jours les plus demandés'], de: ['Monatsende', 'Gefragteste Tage'] },
      { v: 'semaine', k: 1, ic: 'agenda', cote: '±0', fr: ['En semaine, mi-mois', 'Le plus avantageux'], de: ['Unter der Woche, Monatsmitte', 'Am günstigsten'] },
      { v: 'flex', k: 0.93, ic: 'horloge', cote: '−7 %', fr: ['Je suis flexible', 'Nous proposons la date'], de: ['Ich bin flexibel', 'Wir schlagen das Datum vor'] }] }],
  calcul(v, L) {
    const o = choix(this, 'p', v.p), n = o.n;
    const out = [[L === 'de' ? `Team & LKW · ${o.de[0]}` : `Équipe & camion · ${o.fr[0]}`, 380 + n * 360], [L === 'de' ? `Fahrt ${v.km} km` : `Trajet ${v.km} km`, v.km * 3.2]];
    const e = (v.e1 || 0) + (v.e2 || 0); if (e) out.push([L === 'de' ? `${e} Stockwerke ohne Lift` : `${e} étage${e > 1 ? 's' : ''} sans ascenseur`, e * n * 28]);
    ajouts(this, v, out, L, { pieces: n });
    facteur(out, choix(this, 'quand', v.quand).k, L, ['Monatsende', 'Fin de mois'], ['Flexibles Datum', 'Date flexible']); return out;
  },
  inclus: { fr: ['Équipe de déménageurs formés', 'Camion équipé, sangles et couvertures', 'Assurance des biens transportés', 'Protection des sols et cages d\'escalier'], de: ['Geschultes Umzugsteam', 'Ausgerüsteter LKW, Gurte und Decken', 'Transportversicherung', 'Schutz von Böden und Treppenhäusern'] },
  tableau: { cols: { fr: ['Logement', 'Même ville', '≈ 50 km'], de: ['Wohnung', 'Gleiche Stadt', '≈ 50 km'] },
    lignes: ['1.5', '2.5', '3.5', '4.5', '5.5'].map(k => ({ nom: L => choix(METIERS.demenagement, 'p', k)[L][0], v1: { p: k, km: 8, e1: 1, e2: 1 }, v2: { p: k, km: 50, e1: 1, e2: 1 } })) },
  faq: { fr: [['Le prix est-il garanti ?', 'Il est confirmé après une courte visite. Une fois confirmé, il ne change plus, même si le déménagement prend plus de temps.'], ['Pourquoi la fin de mois coûte plus cher ?', 'La plupart des baux se terminent en fin de mois : ces jours sont réservés en premier. Être flexible fait économiser.']],
         de: [['Ist der Preis garantiert?', 'Er wird nach einer kurzen Besichtigung bestätigt. Danach ändert er sich nicht mehr, auch wenn der Umzug länger dauert.'], ['Warum ist das Monatsende teurer?', 'Die meisten Mietverträge enden am Monatsende: Diese Tage sind zuerst ausgebucht. Wer flexibel ist, spart.']] }
},

jardin: {
  plan: 'jardin',
  fr: { nom: 'Entretien de jardin', service: 'entretien de jardin', combien: 'Combien coûte l\'entretien d\'un jardin ?',  sous: 'Gazon, haies, fréquence : votre tarif pour la saison d\'avril à octobre.' },
  de: { nom: 'Gartenunterhalt', service: 'Gartenunterhalt', combien: 'Was kostet Gartenunterhalt?',  sous: 'Rasen, Hecken, Häufigkeit: Ihr Saisonpreis von April bis Oktober.' },
  tarif: { chiffre: '13', unite: { fr: 'CHF/m de haie', de: 'CHF/m Hecke' }, sous: { fr: 'Taille, ramassage et finitions compris', de: 'Schnitt, Zusammenräumen und Abschluss inklusive' } },
  etapes: [
    { id: 'gazon', type: 'mesure', min: 0, max: 3000, pas: 25, val: 400, unite: 'm²', fr: 'Quelle surface de gazon ?', de: 'Wie gross ist die Rasenfläche?', aidefr: 'Mettez 0 s\'il n\'y a pas de gazon à tondre.', aidede: '0 wählen, wenn es keinen Rasen gibt.', puces: [0, 100, 250, 500, 1000, 2000] },
    { id: 'freq', type: 'cartes', val: 'std', fr: 'À quelle fréquence tondre ?', de: 'Wie oft mähen?', opts: [
      { v: 'eco', n: 10, ic: 'gazon', cote: '×10', fr: ['Toutes les 3 semaines', '≈ 10 passages par saison'], de: ['Alle 3 Wochen', '≈ 10 Einsätze pro Saison'] },
      { v: 'std', n: 15, ic: 'gazon', cote: '×15', fr: ['Toutes les 2 semaines', '≈ 15 passages, le plus courant'], de: ['Alle 2 Wochen', '≈ 15 Einsätze, am häufigsten'] },
      { v: 'prem', n: 28, ic: 'gazon', cote: '×28', fr: ['Chaque semaine', '≈ 28 passages, gazon impeccable'], de: ['Wöchentlich', '≈ 28 Einsätze, perfekter Rasen'] }] },
    { id: 'haie', type: 'mesure', min: 0, max: 300, pas: 5, val: 30, unite: 'm', fr: 'Quelle longueur de haies ?', de: 'Wie lang sind die Hecken?', aidefr: 'Longueur totale. 0 s\'il n\'y en a pas.', aidede: 'Gesamtlänge. 0, wenn keine.', puces: [0, 10, 25, 50, 100, 200] },
    { id: 'tailles', type: 'cartes', val: '1', fr: 'Combien de tailles par an ?', de: 'Wie oft pro Jahr schneiden?', opts: [
      { v: '1', n: 1, ic: 'haie', cote: '×1', fr: ['Une fois', 'En fin d\'été'], de: ['Einmal', 'Ende Sommer'] },
      { v: '2', n: 2, ic: 'haie', cote: '×2', fr: ['Deux fois', 'Printemps et automne'], de: ['Zweimal', 'Frühling und Herbst'] }] },
    { id: 'plus', type: 'options', fr: 'En plus', de: 'Zusätzlich', opts: [
      { v: 'feuilles', p: 280, ic: 'feuille', fr: ['Ramassage des feuilles', 'En automne'], de: ['Laub räumen', 'Im Herbst'] },
      { v: 'massifs', p: 350, ic: 'fleur', fr: ['Désherbage des massifs', '3 passages'], de: ['Beete jäten', '3 Einsätze'] },
      { v: 'evac', p: 160, ic: 'benne', fr: ['Évacuation des déchets verts', ''], de: ['Grüngut entsorgen', ''] },
      { v: 'scarif', p: 240, ic: 'gazon', fr: ['Scarification + engrais', 'Au printemps'], de: ['Vertikutieren + Dünger', 'Im Frühling'] }] }],
  calcul(v, L) {
    const f = choix(this, 'freq', v.freq).n, t = choix(this, 'tailles', v.tailles).n, out = [];
    if (v.gazon) out.push([L === 'de' ? `Rasen ${v.gazon} m² · ${f} Einsätze` : `Gazon ${v.gazon} m² · ${f} passages`, f * (45 + v.gazon * 0.11)]);
    if (v.haie) out.push([L === 'de' ? `Hecke ${v.haie} m · ${t}× pro Jahr` : `Haie ${v.haie} m · ${t}× par an`, v.haie * 13 * t]);
    ajouts(this, v, out, L, {}); return out;
  },
  inclus: { fr: ['Matériel professionnel', 'Bordures et finitions', 'Équipe assurée', 'Le même jardinier toute la saison'], de: ['Profi-Geräte', 'Kanten und Abschluss', 'Versichertes Team', 'Derselbe Gärtner die ganze Saison'] },
  tableau: { cols: { fr: ['Jardin', 'Gazon tous les 15 jours', '+ haie 30 m, 1×/an'], de: ['Garten', 'Rasen alle 2 Wochen', '+ Hecke 30 m, 1×/Jahr'] },
    lignes: [[200, 'Petit', 'Klein'], [500, 'Moyen', 'Mittel'], [1000, 'Grand', 'Gross'], [2000, 'Très grand', 'Sehr gross']].map(([m, f, d]) => ({ nom: L => `${L === 'de' ? d : f} · ${m} m²`, v1: { gazon: m, haie: 0 }, v2: { gazon: m, haie: 30 } })) },
  faq: { fr: [['Le prix est-il pour toute la saison ?', 'Oui, d\'avril à octobre, selon la fréquence choisie. Le paiement par mois est possible.'], ['Les déchets verts sont-ils emportés ?', 'Sur demande : cochez l\'option évacuation. Sinon ils restent au compost.']],
         de: [['Gilt der Preis für die ganze Saison?', 'Ja, von April bis Oktober, je nach Häufigkeit. Monatliche Zahlung ist möglich.'], ['Wird das Grüngut mitgenommen?', 'Auf Wunsch: Option Entsorgung wählen. Sonst bleibt es auf dem Kompost.']] }
}
};

// ---------- Aides de calcul (partagées) ----------
function choix(m, id, v) { const e = m.etapes.find(e => e.id === id); return e.opts.find(o => o.v === v) || e.opts[0]; }
function ajouts(m, v, out, L, c) {
  for (const e of m.etapes) {
    if (e.type !== 'options') continue;
    for (const o of e.opts) {
      if (!(v[e.id] || []).includes(o.v)) continue;
      let a = o.p ?? 0;
      if (o.pm) a = o.pm * (c.metres || 0); if (o.pm2) a = o.pm2 * (c.m2 || 0); if (o.pct) a = o.pct * (c.base || 0); if (o.pp) a = o.pp * (c.pieces || 0);
      if (a > 0) out.push([o[L][0], a]);
    }
  }
}
// Applique un pourcentage (urgence, rabais…) au sous-total et l'affiche comme une ligne
function facteur(out, k, L, plus, moins) {
  if (!k || k === 1) return;
  const s = out.reduce((a, l) => a + l[1], 0), pct = Math.round((k - 1) * 100), lib = k > 1 ? plus : moins;
  out.push([`${L === 'de' ? lib[0] : lib[1]} ${pct > 0 ? '+' : '−'}${Math.abs(pct)} %`, s * (k - 1)]);
}
