// Génération d'un PDF d'une page (A4) sans bibliothèque externe :
// polices standard du PDF (Helvetica, Courier) et image 3D en JPEG.

const A4 = { l: 595.28, h: 841.89 };
const MARGE = 42;
const ENCRE = [0.12, 0.11, 0.1];
const GRIS = [0.37, 0.35, 0.31];
const PLAN = [0.17, 0.3, 0.49];
const TRAIT = [0.83, 0.79, 0.72];

// Caractères hors Latin-1 présents dans nos textes → codes WinAnsi (cp1252)
const CP1252 = { '€': 0x80, '…': 0x85, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97, 'œ': 0x9c, 'Œ': 0x8c };

function texteWinAnsi(t) {
  let s = '';
  for (const ch of t) {
    let c = ch.codePointAt(0);
    if (ch === ' ' || ch === ' ') c = 0x20;
    else if (ch === '−') c = 0x2d;
    else if (CP1252[ch]) c = CP1252[ch];
    else if (c > 0xff || (c >= 0x80 && c < 0xa0)) c = 0x3f;
    s += c === 0x28 || c === 0x29 || c === 0x5c ? '\\' + String.fromCharCode(c) : String.fromCharCode(c);
  }
  return s;
}

// Largeur approximative (Helvetica ≈ 0,5 em en moyenne, Courier = 0,6 em)
const largeurTexte = (t, taille, police) => [...t].length * taille * (police === 'F3' ? 0.6 : police === 'F2' ? 0.56 : 0.51);

function couper(t, largeurMax, taille, police) {
  const mots = t.split(' ');
  const lignes = [];
  let ligne = '';
  for (const mot of mots) {
    const essai = ligne ? `${ligne} ${mot}` : mot;
    if (largeurTexte(essai, taille, police) > largeurMax && ligne) {
      lignes.push(ligne);
      ligne = mot;
    } else ligne = essai;
  }
  if (ligne) lignes.push(ligne);
  // Mots trop longs (liens) : coupe au caractère
  return lignes.flatMap((l) => {
    const max = Math.floor(largeurMax / (taille * (police === 'F3' ? 0.6 : 0.51)));
    if (l.length <= max) return [l];
    const morceaux = [];
    for (let i = 0; i < l.length; i += max) morceaux.push(l.slice(i, i + max));
    return morceaux;
  });
}

class Page {
  constructor() { this.ops = []; }

  // y mesuré depuis le haut de la page
  texte(x, y, t, { taille = 10, police = 'F1', couleur = ENCRE, droite = false } = {}) {
    const xr = droite ? x - largeurTexte(t, taille, police) : x;
    this.ops.push(`BT /${police} ${taille} Tf ${couleur.join(' ')} rg ${xr.toFixed(2)} ${(A4.h - y).toFixed(2)} Td (${texteWinAnsi(t)}) Tj ET`);
  }

  rect(x, y, l, h, couleur) {
    this.ops.push(`${couleur.join(' ')} rg ${x.toFixed(2)} ${(A4.h - y - h).toFixed(2)} ${l.toFixed(2)} ${h.toFixed(2)} re f`);
  }

  ligne(x1, y1, x2, y2, couleur = TRAIT, ep = 0.6) {
    this.ops.push(`${couleur.join(' ')} RG ${ep} w ${x1.toFixed(2)} ${(A4.h - y1).toFixed(2)} m ${x2.toFixed(2)} ${(A4.h - y2).toFixed(2)} l S`);
  }

  image(x, y, l, h, nom = 'Im1') {
    this.ops.push(`q ${l.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${(A4.h - y - h).toFixed(2)} cm /${nom} Do Q`);
  }
}

function octetsJpeg(dataUrl) {
  const bin = atob(dataUrl.split(',')[1]);
  const o = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) o[i] = bin.charCodeAt(i);
  return o;
}

// images : [{ nom: 'Im1', octets, largeur, hauteur }] — JPEG uniquement
function assembler(contenu, images) {
  const enc = (s) => Uint8Array.from(s, (c) => c.charCodeAt(0) & 0xff);
  const xobjets = images.map((im, i) => `/${im.nom} ${8 + i} 0 R`).join(' ');
  const objets = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4.l} ${A4.h}] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >>${images.length ? ` /XObject << ${xobjets} >>` : ''} >> /Contents 4 0 R >>`,
    `<< /Length ${contenu.length} >>\nstream\n${contenu}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>',
  ];
  const morceaux = [enc('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n')];
  let position = morceaux[0].length;
  const positions = [];
  const pousser = (o) => { morceaux.push(o); position += o.length; };

  objets.forEach((corps, i) => {
    positions.push(position);
    pousser(enc(`${i + 1} 0 obj\n${corps}\nendobj\n`));
  });
  images.forEach((im, i) => {
    positions.push(position);
    pousser(enc(`${8 + i} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${im.largeur} /Height ${im.hauteur} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${im.octets.length} >>\nstream\n`));
    pousser(im.octets);
    pousser(enc('\nendstream\nendobj\n'));
  });
  const n = positions.length + 1;
  const xref = `xref\n0 ${n}\n0000000000 65535 f \n${positions.map((p) => `${String(p).padStart(10, '0')} 00000 n \n`).join('')}`;
  const debutXref = position;
  pousser(enc(`${xref}trailer\n<< /Size ${n} /Root 1 0 R >>\nstartxref\n${debutXref}\n%%EOF`));
  return new Blob(morceaux, { type: 'application/pdf' });
}

export function creerPDF(d) {
  const p = new Page();
  const largeurUtile = A4.l - 2 * MARGE;
  let y = MARGE;
  // Couleur d'accent de l'entreprise (#rrggbb), sinon le bleu « plan » par défaut
  const plan = /^#[0-9a-f]{6}$/i.test(d.accent ?? '')
    ? [1, 3, 5].map((i) => parseInt(d.accent.slice(i, i + 2), 16) / 255)
    : PLAN;

  const images = [];

  // En-tête : logo (ou initiales), entreprise, référence
  const ratioLogo = d.logo ? d.logo.largeur / d.logo.hauteur : 1;
  if (d.logo) images.push({ nom: 'Im2', octets: octetsJpeg(d.logo.url), largeur: d.logo.largeur, hauteur: d.logo.hauteur });
  if (d.logo && ratioLogo > 2) {
    // Logo horizontal : il contient déjà le nom, l'activité passe dessous
    const h = 22;
    p.image(MARGE, y + 2, h * ratioLogo, h, 'Im2');
    p.texte(MARGE, y + 38, d.entreprise.activite, { taille: 9, couleur: GRIS });
  } else {
    if (d.logo) {
      const h = 40;
      const l = h * ratioLogo;
      p.image(MARGE + (34 - l) / 2, y - 3, l, h, 'Im2');
    } else {
      p.rect(MARGE, y, 34, 34, ENCRE);
      p.texte(MARGE + 17 - largeurTexte(d.entreprise.initiales, 12, 'F2') / 2, y + 22, d.entreprise.initiales, { taille: 12, police: 'F2', couleur: [0.95, 0.94, 0.9] });
    }
    p.texte(MARGE + 46, y + 15, d.entreprise.nom, { taille: 13, police: 'F2' });
    p.texte(MARGE + 46, y + 29, d.entreprise.activite, { taille: 9, couleur: GRIS });
  }
  p.texte(A4.l - MARGE, y + 12, 'RICHTPREIS-SCHÄTZUNG', { taille: 8, police: 'F3', couleur: plan, droite: true });
  p.texte(A4.l - MARGE, y + 24, `${d.reference} · ${d.date}`, { taille: 8, police: 'F3', couleur: GRIS, droite: true });
  y += 48;
  p.ligne(MARGE, y, A4.l - MARGE, y, ENCRE, 0.8);
  y += 22;

  if (d.demo) {
    p.texte(MARGE, y, 'DEMO — Beispieldokument, fiktive Preise', { taille: 8, police: 'F3', couleur: plan });
    y += 16;
  }
  p.texte(MARGE, y + 8, d.titre, { taille: 20, police: 'F2' });
  y += 24;

  // Image 3D
  if (d.image) {
    images.push({ nom: 'Im1', octets: octetsJpeg(d.image.url), largeur: d.image.largeur, hauteur: d.image.hauteur });
    const ratio = d.image.largeur / d.image.hauteur;
    let l = largeurUtile;
    let h = l / ratio;
    if (h > 210) { h = 210; l = h * ratio; }
    p.image(MARGE + (largeurUtile - l) / 2, y, l, h);
    y += h + 18;
  }

  // Configuration
  p.texte(MARGE, y, 'IHRE KONFIGURATION', { taille: 8, police: 'F3', couleur: plan });
  y += 14;
  for (const [libelle, valeur] of d.configuration) {
    const lignes = couper(valeur, largeurUtile - 120, 9, 'F1');
    p.texte(MARGE, y, libelle, { taille: 9, couleur: GRIS });
    lignes.forEach((l, i) => p.texte(MARGE + 120, y + i * 11, l, { taille: 9 }));
    y += 11 * lignes.length + 2;
  }
  y += 8;

  // Prix
  p.texte(MARGE, y, 'PREISDETAILS (CHF)', { taille: 8, police: 'F3', couleur: plan });
  y += 14;
  for (const [libelle, montant] of d.prix) {
    p.texte(MARGE, y, libelle, { taille: 9 });
    p.texte(A4.l - MARGE, y, montant, { taille: 9, police: 'F3', droite: true });
    y += 12;
  }
  p.ligne(MARGE, y - 6, A4.l - MARGE, y - 6);
  y += 6;
  for (const [libelle, montant] of d.totaux) {
    p.texte(MARGE, y, libelle, { taille: 9, couleur: GRIS });
    p.texte(A4.l - MARGE, y, montant, { taille: 9, police: 'F3', couleur: GRIS, droite: true });
    y += 12;
  }
  y += 6;
  p.rect(MARGE, y - 4, largeurUtile, 30, [0.92, 0.89, 0.84]);
  p.texte(MARGE + 10, y + 15, 'Richtpreis inkl. MWST', { taille: 11, police: 'F2' });
  p.texte(A4.l - MARGE - 10, y + 16, d.total, { taille: 15, police: 'F2', droite: true });
  y += 42;
  for (const l of couper(d.fourchette, largeurUtile, 9, 'F1')) {
    p.texte(MARGE, y, l, { taille: 9, couleur: GRIS });
    y += 12;
  }
  for (const l of couper(d.avertissement, largeurUtile, 8, 'F1')) {
    p.texte(MARGE, y, l, { taille: 8, couleur: GRIS });
    y += 10;
  }

  // Pied de page : comment obtenir le devis définitif + lien de la configuration
  let yb = A4.h - MARGE - 38;
  p.ligne(MARGE, yb - 10, A4.l - MARGE, yb - 10);
  const contact = d.entreprise.email
    ? `Definitive Offerte: ${d.entreprise.email} — bitte Referenz ${d.reference} angeben.`
    : `Definitive Offerte: Kontaktieren Sie ${d.entreprise.nom} mit der Referenz ${d.reference}.`;
  p.texte(MARGE, yb + 2, contact, { taille: 9, police: 'F2' });
  yb += 14;
  for (const l of couper(`Konfiguration online: ${d.lien}`, largeurUtile, 6, 'F3').slice(0, 5)) {
    p.texte(MARGE, yb, l, { taille: 6, police: 'F3', couleur: GRIS });
    yb += 7.5;
  }

  return assembler(p.ops.join('\n'), images);
}
