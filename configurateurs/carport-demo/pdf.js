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

// ======================================================================
// FICHE TECHNIQUE pour l'entreprise (13.11.2026) : plan coté (dessus + façade), liste des pièces, surfaces.
// d.plan : { W, L, OV, OVZ, xs, zs, P, maison: [-1|1], local, profil: [[x, y]], H, hTot, bas, hSab }
// ======================================================================
export function creerFicheTechnique(d) {
  const p = new Page();
  const plan = /^#[0-9a-f]{6}$/i.test(d.accent ?? '')
    ? [1, 3, 5].map((i) => parseInt(d.accent.slice(i, i + 2), 16) / 255)
    : PLAN;
  const largeurUtile = A4.l - 2 * MARGE;
  let y = MARGE;
  const f2 = (v) => v.toFixed(2).replace('.', ',');

  // Traits utiles : cadre, tirets, cote avec flèches et valeur
  const cadre = (x, yy, l, h, c = ENCRE, ep = 0.8) => {
    p.ligne(x, yy, x + l, yy, c, ep); p.ligne(x + l, yy, x + l, yy + h, c, ep);
    p.ligne(x + l, yy + h, x, yy + h, c, ep); p.ligne(x, yy + h, x, yy, c, ep);
  };
  const tirets = (x1, y1, x2, y2, c = GRIS) => {
    const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 6));
    for (let i = 0; i < n; i += 2) {
      const a = i / n, b = Math.min(1, (i + 1) / n);
      p.ligne(x1 + (x2 - x1) * a, y1 + (y2 - y1) * a, x1 + (x2 - x1) * b, y1 + (y2 - y1) * b, c, 0.5);
    }
  };
  const cote = (x1, y1, x2, y2, texte) => {
    p.ligne(x1, y1, x2, y2, plan, 0.6);
    const hor = Math.abs(y2 - y1) < 0.01;
    for (const [x, yy] of [[x1, y1], [x2, y2]]) {
      if (hor) p.ligne(x, yy - 4, x, yy + 4, plan, 0.6); else p.ligne(x - 4, yy, x + 4, yy, plan, 0.6);
    }
    if (hor) p.texte((x1 + x2) / 2 - largeurTexte(texte, 7.5, 'F3') / 2, y1 - 3, texte, { taille: 7.5, police: 'F3', couleur: plan });
    else p.texte(x1 + 5, (y1 + y2) / 2 + 3, texte, { taille: 7.5, police: 'F3', couleur: plan });
  };

  // En-tête
  p.texte(MARGE, y + 14, d.entreprise.nom, { taille: 13, police: 'F2' });
  p.texte(MARGE, y + 28, d.titre, { taille: 9, couleur: GRIS });
  p.texte(A4.l - MARGE, y + 12, 'FICHE TECHNIQUE', { taille: 8, police: 'F3', couleur: plan, droite: true });
  p.texte(A4.l - MARGE, y + 24, `${d.reference} · ${d.date}`, { taille: 8, police: 'F3', couleur: GRIS, droite: true });
  y += 40;
  p.ligne(MARGE, y, A4.l - MARGE, y, ENCRE, 0.8);
  y += 18;
  if (d.demo) {
    p.texte(MARGE, y, 'DÉMO — exemple de fiche transmise à l\'entreprise avec la demande', { taille: 8, police: 'F3', couleur: plan });
    y += 14;
  }

  // ---------- Plan de dessus (entrée en bas) ----------
  const P0 = d.plan;
  const boxL = largeurUtile * 0.5 - 12, boxH = 230;
  p.texte(MARGE, y + 2, 'VUE DE DESSUS', { taille: 8, police: 'F3', couleur: GRIS });
  p.texte(MARGE + boxL + 24, y + 2, 'VUE DE FACE (côté entrée)', { taille: 8, police: 'F3', couleur: GRIS });
  y += 12;
  const extW = P0.W + 2 * P0.OV, extL = P0.L + 2 * P0.OVZ;
  const ech = Math.min((boxL - 50) / extW, (boxH - 50) / extL);
  const ox = MARGE + 30 + (boxL - 50 - extW * ech) / 2 + P0.OV * ech;
  const oy = y + 22 + (boxH - 50 - extL * ech) / 2 + P0.OVZ * ech;
  const X = (x) => ox + (x + P0.W / 2) * ech;
  const Z = (z) => oy + (z + P0.L / 2) * ech;
  // Débord de toit en tirets, emprise des poteaux en trait plein
  const rx1 = P0.maison.includes(-1) ? -P0.W / 2 : -P0.W / 2 - P0.OV;
  const rx2 = P0.maison.includes(1) ? P0.W / 2 : P0.W / 2 + P0.OV;
  tirets(X(rx1), Z(-P0.L / 2 - P0.OVZ), X(rx2), Z(-P0.L / 2 - P0.OVZ));
  tirets(X(rx1), Z(P0.L / 2 + P0.OVZ), X(rx2), Z(P0.L / 2 + P0.OVZ));
  tirets(X(rx1), Z(-P0.L / 2 - P0.OVZ), X(rx1), Z(P0.L / 2 + P0.OVZ));
  tirets(X(rx2), Z(-P0.L / 2 - P0.OVZ), X(rx2), Z(P0.L / 2 + P0.OVZ));
  cadre(X(-P0.W / 2), Z(-P0.L / 2), P0.W * ech, P0.L * ech, ENCRE, 0.6);
  // Façade de la maison (hachurée)
  for (const s of P0.maison) {
    const xm = X(s * P0.W / 2);
    p.rect(s < 0 ? xm - 6 : xm, Z(-P0.L / 2) - 10, 6, P0.L * ech + 20, [0.78, 0.75, 0.7]);
    p.texte((s < 0 ? xm - 3 : xm + 3) - largeurTexte('MAISON', 6.5, 'F3') / 2, Z(-P0.L / 2) - 14, 'MAISON', { taille: 6.5, police: 'F3', couleur: GRIS });
  }
  // Local de rangement
  if (P0.local) {
    const l = P0.local;
    p.rect(X(l.x1), Z(l.z1), (l.x2 - l.x1) * ech, (l.z2 - l.z1) * ech, [0.93, 0.91, 0.87]);
    const t = 'LOCAL';
    p.texte(X((l.x1 + l.x2) / 2) - largeurTexte(t, 6.5, 'F3') / 2, Z((l.z1 + l.z2) / 2) + 2, t, { taille: 6.5, police: 'F3', couleur: GRIS });
  }
  // Sablières et poteaux
  for (const x of P0.xs) p.ligne(X(x), Z(-P0.L / 2 - 0.15), X(x), Z(P0.L / 2 + 0.15), [0.55, 0.45, 0.33], 2.2);
  const t = Math.max(3, P0.P * ech);
  for (const x of P0.xs) for (const z of P0.zs) p.rect(X(x) - t / 2, Z(z) - t / 2, t, t, ENCRE);
  // Cotes : largeur (bas), profondeur (gauche), entraxes des poteaux (droite)
  cote(X(-P0.W / 2), Z(P0.L / 2 + P0.OVZ) + 16, X(P0.W / 2), Z(P0.L / 2 + P0.OVZ) + 16, `${f2(P0.W)} m`);
  cote(X(rx1) - 18, Z(-P0.L / 2), X(rx1) - 18, Z(P0.L / 2), '');
  p.texte(X(rx1) - 30, Z(0) + 3, `${f2(P0.L)} m`, { taille: 7.5, police: 'F3', couleur: plan, droite: true });
  const xd = X(rx2) + 10;
  for (let i = 0; i < P0.zs.length - 1; i++) {
    cote(xd, Z(P0.zs[i]), xd, Z(P0.zs[i + 1]), f2(P0.zs[i + 1] - P0.zs[i]));
  }
  p.texte(X(0) - largeurTexte('ENTRÉE', 6.5, 'F3') / 2, Z(P0.L / 2 + P0.OVZ) + 30, 'ENTRÉE', { taille: 6.5, police: 'F3', couleur: GRIS });

  // ---------- Vue de face ----------
  const fx0 = MARGE + boxL + 24, fl = largeurUtile - boxL - 24;
  const prof = P0.profil;
  const xmin = Math.min(...prof.map((q) => q[0])), xmax = Math.max(...prof.map((q) => q[0]));
  const hmax = Math.max(...prof.map((q) => q[1]));
  const e2 = Math.min((fl - 150) / (xmax - xmin), (boxH - 50) / hmax);
  const sol = y + boxH - 20;
  const FX = (x) => fx0 + 75 + (x - xmin) * e2 + ((fl - 150) - (xmax - xmin) * e2) / 2;
  const FY = (h) => sol - h * e2;
  p.ligne(fx0, sol, fx0 + fl, sol, ENCRE, 0.8);
  for (let i = 0; i < prof.length - 1; i++) p.ligne(FX(prof[i][0]), FY(prof[i][1]), FX(prof[i + 1][0]), FY(prof[i + 1][1]), ENCRE, 1.1);
  for (const q of [prof[0], prof[prof.length - 1]]) p.ligne(FX(q[0]), FY(q[1]), FX(q[0]), FY(q[1] - 0.22), ENCRE, 0.8);
  for (const [x, h] of P0.poteaux) {
    const l = Math.max(2.5, P0.P * e2);
    p.rect(FX(x) - l / 2, FY(h), l, h * e2, [0.55, 0.45, 0.33]);
  }
  for (const s of P0.maison) p.rect(s < 0 ? FX(xmin) - 8 : FX(xmax) + 2, FY(hmax + 0.4), 6, (hmax + 0.4) * e2, [0.78, 0.75, 0.7]);
  // Cotes de hauteur : passage et hauteur totale
  // (passage à gauche, hauteur totale à droite : rien ne sort de la page)
  const xcG = FX(xmin) - (P0.maison.includes(-1) ? 18 : 12);
  cote(xcG, sol, xcG, FY(P0.H), '');
  p.texte(xcG - 4, FY(P0.H / 2) - 2, 'passage', { taille: 7, police: 'F3', couleur: plan, droite: true });
  p.texte(xcG - 4, FY(P0.H / 2) + 7, `${f2(P0.H)} m`, { taille: 7.5, police: 'F3', couleur: plan, droite: true });
  const xcD = FX(xmax) + 12;
  cote(xcD, sol, xcD, FY(P0.hTot), '');
  p.texte(xcD + 4, FY(P0.hTot / 2) - 2, 'total', { taille: 7, police: 'F3', couleur: plan });
  p.texte(xcD + 4, FY(P0.hTot / 2) + 7, `${f2(P0.hTot)} m`, { taille: 7.5, police: 'F3', couleur: plan });
  if (P0.pente) p.texte(FX((xmin + xmax) / 2) - 20, FY(hmax) - 8, `pente ${P0.pente}°`, { taille: 7.5, police: 'F3', couleur: plan });
  y += boxH + 14;

  // ---------- Liste des pièces ----------
  p.ligne(MARGE, y, A4.l - MARGE, y, TRAIT, 0.6);
  y += 16;
  p.texte(MARGE, y, 'LISTE DES PIÈCES (débit indicatif)', { taille: 8, police: 'F3', couleur: plan });
  y += 14;
  const cols = [MARGE, MARGE + 250, MARGE + 330, MARGE + 430];
  ['Pièce', 'Quantité', 'Longueur', 'Section'].forEach((h, i) => p.texte(cols[i], y, h, { taille: 8, police: 'F2', couleur: GRIS }));
  y += 5;
  p.ligne(MARGE, y, A4.l - MARGE, y, TRAIT, 0.5);
  y += 12;
  for (const pc of d.pieces) {
    p.texte(cols[0], y, pc.des, { taille: 9 });
    p.texte(cols[1], y, String(pc.n), { taille: 9, police: 'F3' });
    p.texte(cols[2], y, pc.long ? `${f2(pc.long)} m` : '—', { taille: 9, police: 'F3' });
    p.texte(cols[3], y, pc.sec || '—', { taille: 9, police: 'F3' });
    y += 13;
  }
  y += 6;
  // ---------- Surfaces et quantités ----------
  p.texte(MARGE, y, 'SURFACES ET QUANTITÉS', { taille: 8, police: 'F3', couleur: plan });
  y += 14;
  for (const [l, v] of d.surfaces) {
    p.texte(MARGE, y, l, { taille: 9, couleur: GRIS });
    p.texte(A4.l - MARGE, y, v, { taille: 9, police: 'F2', droite: true });
    y += 13;
  }
  y += 8;
  for (const l of couper(d.note, largeurUtile, 8, 'F1')) { p.texte(MARGE, y, l, { taille: 8, couleur: GRIS }); y += 11; }
  for (const l of couper(`Configuration en ligne : ${d.lien}`, largeurUtile, 7, 'F3')) { p.texte(MARGE, y, l, { taille: 7, police: 'F3', couleur: GRIS }); y += 9; }

  return assembler(p.ops.join('\n'), []);
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
  p.texte(A4.l - MARGE, y + 12, 'ESTIMATION INDICATIVE', { taille: 8, police: 'F3', couleur: plan, droite: true });
  p.texte(A4.l - MARGE, y + 24, `${d.reference} · ${d.date}`, { taille: 8, police: 'F3', couleur: GRIS, droite: true });
  y += 48;
  p.ligne(MARGE, y, A4.l - MARGE, y, ENCRE, 0.8);
  y += 22;

  if (d.demo) {
    p.texte(MARGE, y, 'DÉMO — document d\'exemple, prix fictifs', { taille: 8, police: 'F3', couleur: plan });
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
  p.texte(MARGE, y, 'VOTRE CONFIGURATION', { taille: 8, police: 'F3', couleur: plan });
  y += 14;
  for (const [libelle, valeur] of d.configuration) {
    const lignes = couper(valeur, largeurUtile - 120, 9, 'F1');
    p.texte(MARGE, y, libelle, { taille: 9, couleur: GRIS });
    lignes.forEach((l, i) => p.texte(MARGE + 120, y + i * 11, l, { taille: 9 }));
    y += 11 * lignes.length + 2;
  }
  y += 8;

  // Prix
  p.texte(MARGE, y, 'DÉTAIL DU PRIX (CHF)', { taille: 8, police: 'F3', couleur: plan });
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
  p.texte(MARGE + 10, y + 15, 'Prix indicatif TTC', { taille: 11, police: 'F2' });
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
    ? `Devis définitif : ${d.entreprise.email} — mentionnez la référence ${d.reference}.`
    : `Devis définitif : contactez ${d.entreprise.nom} en mentionnant la référence ${d.reference}.`;
  p.texte(MARGE, yb + 2, contact, { taille: 9, police: 'F2' });
  yb += 14;
  for (const l of couper(`Configuration en ligne : ${d.lien}`, largeurUtile, 6, 'F3').slice(0, 5)) {
    p.texte(MARGE, yb, l, { taille: 6, police: 'F3', couleur: GRIS });
    yb += 7.5;
  }

  return assembler(p.ops.join('\n'), images);
}
