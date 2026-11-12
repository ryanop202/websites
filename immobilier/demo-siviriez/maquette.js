// Maquette 3D réaliste du Bourg de Siviriez : immeuble, appartements, terrain, ciel.
// Tout est construit en code, puis regroupé par matériau (peu d'appels de dessin = fluide).
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { creerTextures, alea } from './textures.js';

export const H = 3.1;          // hauteur d'étage (m)
const T = 0.3;                 // épaisseur des murs de façade
export const COUR = 6.5;       // la cour commence au sud de l'aile A
const FIN_B = 18;              // bout sud de l'aile B
// Ailes de l'immeuble en L. A : façade cour au sud. B : façade cour à l'ouest.
export const AILES = {
  A: { x0: -24, z0: -6.5, long: 36, prof: 13, axe: 'x' },
  B: { x0: 12, z0: -6.5, long: 24.5, prof: 13, axe: 'z' },
};
// Lignes de façade (le contour du L). sens = vers l'extérieur.
const LIGNES = [
  { id: 'A_sud', axe: 'x', fixe: COUR, sens: 1, de: -24, a: 12.3, cour: true },
  { id: 'A_nord', axe: 'x', fixe: -6.5, sens: -1, de: -24, a: 12 },
  { id: 'A_ouest', axe: 'z', fixe: -24, sens: -1, de: -6.5, a: COUR },
  { id: 'B_nord', axe: 'x', fixe: -6.5, sens: -1, de: 12, a: 25 },
  { id: 'B_est', axe: 'z', fixe: 25, sens: 1, de: -6.5, a: FIN_B },
  { id: 'B_sud', axe: 'x', fixe: FIN_B, sens: 1, de: 12, a: 25 },
  { id: 'B_ouest', axe: 'z', fixe: 12, sens: -1, de: COUR, a: FIN_B, cour: true },
];
const RAMPE = { x1: -23, x2: -18, z1: 14, z2: 30 };

/* ---------- Placement des lots dans les ailes (largeur selon la surface) ---------- */
export function placerLots(LOTS) {
  for (const niveau of [0, 1, 2, 3]) for (const cle of ['A', 'B']) {
    const lots = LOTS.filter((l) => l.niveau === niveau && l.aile === cle);
    const total = lots.reduce((s, l) => s + l.surface, 0);
    const aile = AILES[cle];
    let pos = 0;
    lots.forEach((l, i) => {
      const a = pos, b = pos + (aile.long * l.surface) / total; pos = b;
      l.box = aile.axe === 'x'
        ? { x1: aile.x0 + a, x2: aile.x0 + b, z1: aile.z0, z2: aile.z0 + aile.prof }
        : { x1: aile.x0, x2: aile.x0 + aile.prof, z1: aile.z0 + a, z2: aile.z0 + b };
      l.premier = i === 0; l.dernier = i === lots.length - 1;
      l.centre = new THREE.Vector3((l.box.x1 + l.box.x2) / 2, niveau * H + H / 2, (l.box.z1 + l.box.z2) / 2);
    });
  }
  for (const l of LOTS) {
    const cote = l.aile === 'B' && l.box.z2 > COUR + 2;
    l.orientation = l.niveau === 0 ? 'Nord (côté jardin)' : l.aile === 'A' ? (l.premier ? 'Sud – Ouest' : 'Sud') : cote ? 'Ouest – Est' : 'Est – Nord';
    l.exterieur = l.niveau === 0 ? 'Terrasse jardin' : l.niveau === 1 ? 'Terrasse et jardin' : 'Balcon';
  }
}

/* ---------- Point de vue depuis un lot (devant sa porte-fenêtre, à hauteur d'yeux) ---------- */
// Même calcul que les ouvertures de façade : la porte-fenêtre est l'ouverture du milieu.
export function pointDeVue(l) {
  const b = l.box;
  const id = l.aile === 'A' ? (l.niveau === 0 ? 'A_nord' : 'A_sud') : (b.z2 > COUR + 2 ? 'B_ouest' : 'B_est');
  const L = LIGNES.find((x) => x.id === id);
  const s = L.axe === 'x' ? Math.max(b.x1, L.de) : Math.max(b.z1, L.de);
  const e = L.axe === 'x' ? Math.min(b.x2, L.a) : Math.min(b.z2, L.a);
  const utile = e - s - 1.2, nb = Math.max(1, Math.round(utile / 2.8)), pas = utile / nb;
  const c = s + 0.6 + pas * (Math.floor((nb - 1) / 2) + 0.5);
  const y = l.niveau * H + 1.62, sortie = 0.45; // debout sur le seuil de la porte-fenêtre
  return L.axe === 'x'
    ? { oeil: new THREE.Vector3(c, y, L.fixe + L.sens * sortie), dir: new THREE.Vector3(0, 0, L.sens) }
    : { oeil: new THREE.Vector3(L.fixe + L.sens * sortie, y, c), dir: new THREE.Vector3(L.sens, 0, 0) };
}

/* ---------- Outils de géométrie ---------- */
// Coordonnées de texture en mètres, projetées selon la face (raccords invisibles entre morceaux)
function uvMonde(g) {
  const p = g.attributes.position, n = g.attributes.normal;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u, v;
    if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); }
    else if (ax >= az) { u = p.getZ(i); v = p.getY(i); }
    else { u = p.getX(i); v = p.getY(i); }
    uv[i * 2] = u; uv[i * 2 + 1] = v;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}

const seaux = new Map();
function ajouter(groupe, mat, g) {
  g = g.index ? g.toNonIndexed() : g;
  g.clearGroups();
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
  if (!g.attributes.uv) uvMonde(g);
  const cle = groupe + '|' + mat;
  if (!seaux.has(cle)) seaux.set(cle, []);
  seaux.get(cle).push(g);
}
function boite(groupe, mat, w, h, d, x, y, z, ry = 0) {
  if (w <= 0.001 || h <= 0.001 || d <= 0.001) return;
  const g = new THREE.BoxGeometry(w, h, d);
  if (ry) g.rotateY(ry);
  g.translate(x, y, z);
  ajouter(groupe, mat, uvMonde(g));
}
// Boîte dans le repère d'une façade : c = position le long, off = enfoncement vers l'intérieur
function boiteL(groupe, mat, L, c, long, y, h, off, ep) {
  if (L.axe === 'x') boite(groupe, mat, long, h, ep, c, y, L.fixe - L.sens * off);
  else boite(groupe, mat, ep, h, long, L.fixe - L.sens * off, y, c);
}

const bruit = new SimplexNoise({ random: alea });
// Déforme une géométrie de façon organique (arbres, haies)
function bosseler(g, force, freq) {
  // Sommets fusionnés + normales lissées : surface douce, sans facettes
  g.deleteAttribute('normal'); g.deleteAttribute('uv');
  g = mergeVertices(g);
  const p = g.attributes.position;
  g.computeBoundingBox();
  const c = g.boundingBox.getCenter(new THREE.Vector3());
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const k = 1 + force * bruit.noise3d(v.x * freq, v.y * freq, v.z * freq);
    v.sub(c).multiplyScalar(k).add(c);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/* =========================================================
   Construction
   ========================================================= */
export function construireMaquette({ scene, renderer, LOTS, mobile }) {
  const tex = creerTextures(renderer);
  const M = (o) => new THREE.MeshStandardMaterial(o);
  const mats = {
    enduit: M({ map: tex.enduit, color: 0xe2d2b8, roughness: 0.93 }),
    enduitInt: M({ map: tex.enduitInt, roughness: 0.95 }),
    beton: M({ map: tex.beton, roughness: 0.92 }),
    parquet: M({ map: tex.parquet, roughness: 0.55 }),
    dalles: M({ map: tex.dalles, roughness: 0.9 }),
    herbe: M({ map: tex.herbe, roughness: 1 }),
    enrobe: M({ map: tex.enrobe, roughness: 0.92 }),
    gravier: M({ map: tex.gravier, roughness: 1 }),
    haie: M({ map: tex.haie, roughness: 1 }),
    vitre: new THREE.MeshPhysicalMaterial({ color: 0x27323b, metalness: 0.25, roughness: 0.03, transparent: true, opacity: 0.62, envMapIntensity: 1.6, side: THREE.DoubleSide }),
    cadre: M({ color: 0x34373a, roughness: 0.45, metalness: 0.35 }),
    store: M({ map: tex.lames, color: 0xffffff, roughness: 0.7, metalness: 0 }),
    pierre: M({ color: 0xd9d4cb, roughness: 0.75 }),
    metal: M({ color: 0x1d1e20, roughness: 0.4, metalness: 0.75 }),
    tole: M({ color: 0x9a9da0, roughness: 0.35, metalness: 0.8 }),
    pv: M({ map: tex.pv, roughness: 0.18, metalness: 0.5 }),
    meuble: M({ color: 0xf1eee8, roughness: 0.5 }),
    tissu: M({ color: 0x6f6b66, roughness: 0.95 }),
    drap: M({ color: 0xebe6dd, roughness: 0.9 }),
    bois: M({ color: 0x9c7450, roughness: 0.6 }),
    feuil1: M({ map: tex.feuillage, color: 0x5a8a3a, roughness: 0.9 }),
    feuil2: M({ map: tex.feuillage, color: 0x6c9640, roughness: 0.9 }),
    feuil3: M({ map: tex.feuillage, color: 0x3f6a2c, roughness: 0.95 }),
    sapin: M({ map: tex.feuillage, color: 0x2d4f2c, roughness: 0.95 }),
    tronc: M({ color: 0x5a4636, roughness: 1 }),
    toile: M({ color: 0xefe6d6, roughness: 0.9, side: THREE.DoubleSide }),
    tuiles: M({ map: tex.tuiles, roughness: 0.85 }),
    crepi: M({ color: 0xf2eee6, roughness: 0.95 }),
    ligne: M({ color: 0xededed, roughness: 0.8 }),
    sombre: M({ color: 0x1f262c, roughness: 0.15, metalness: 0.5 }),
    volet: M({ color: 0x5f7a6b, roughness: 0.8 }),
    colline: M({ map: tex.herbe, color: 0xb7c2a0, roughness: 1 }),
  };
  // Ce qui ne projette pas d'ombre (sols)
  const sansOmbre = new Set(['herbe', 'enrobe', 'dalles', 'gravier', 'parquet', 'ligne', 'colline']);

  const groupes = { n0: new THREE.Group(), n1: new THREE.Group(), n2: new THREE.Group(), n3: new THREE.Group(), toit: new THREE.Group(), site: new THREE.Group() };
  Object.values(groupes).forEach((g) => scene.add(g));
  const bloqueurs = [];

  placerLots(LOTS);

  /* ---------- Façades : murs percés de vraies fenêtres ---------- */
  function ouvertures(lot, L, n) {
    const b = lot.box;
    let s, e, touche;
    if (L.axe === 'x') { touche = Math.abs(b.z1 - L.fixe) < 0.01 || Math.abs(b.z2 - L.fixe) < 0.01; s = Math.max(b.x1, L.de); e = Math.min(b.x2, L.a); }
    else { touche = Math.abs(b.x1 - L.fixe) < 0.01 || Math.abs(b.x2 - L.fixe) < 0.01; s = Math.max(b.z1, L.de); e = Math.min(b.z2, L.a); }
    if (!touche || e - s < 2 || (L.cour && n === 0)) return [];
    const marge = 0.6, utile = e - s - 2 * marge;
    const nb = Math.max(1, Math.round(utile / 2.8)), pas = utile / nb;
    const avecPorte = L.cour || (n === 0 && L.id === 'A_nord');
    const iP = Math.floor((nb - 1) / 2);
    return Array.from({ length: nb }, (_, i) => {
      const c = s + marge + pas * (i + 0.5);
      const wMax = pas - 0.5;
      return avecPorte && i === iP
        ? { c, w: Math.min(2.2, wMax), sill: 0, top: 2.45, porte: true, balcon: L.cour && n >= 2, terrasse: L.cour && n === 1 }
        : { c, w: Math.min(L.cour ? 1.6 : 1.3, wMax), sill: 0.9, top: 2.4 };
    });
  }

  function fenetre(g, L, base, o) {
    const h = o.top - o.sill, yc = base + o.sill + h / 2, f = 0.07, off = 0.18;
    // Vitre enfoncée dans le mur (l'embrasure fait l'ombre)
    boiteL(g, 'vitre', L, o.c, o.w - 0.06, yc, h - 0.06, off, 0.02);
    // Cadre et montant central
    boiteL(g, 'cadre', L, o.c - o.w / 2 + f / 2, f, yc, h, off, 0.09);
    boiteL(g, 'cadre', L, o.c + o.w / 2 - f / 2, f, yc, h, off, 0.09);
    boiteL(g, 'cadre', L, o.c, o.w, base + o.top - f / 2, f, off, 0.09);
    boiteL(g, 'cadre', L, o.c, o.w, base + o.sill + f / 2, f, off, 0.09);
    if (o.w > 1.45) boiteL(g, 'cadre', L, o.c, f * 0.8, yc, h, off, 0.08);
    if (o.porte) boiteL(g, 'cadre', L, o.c, o.w, base + 1.05, 0.05, off, 0.06); // traverse de porte-fenêtre
    // Tablette de fenêtre
    if (o.sill > 0) boiteL(g, 'pierre', L, o.c, o.w + 0.16, base + o.sill - 0.03, 0.05, -0.05, 0.3);
    // Store à lamelles, plus ou moins baissé
    const r = alea();
    const baisse = r < 0.35 ? 0.1 : r < 0.75 ? 0.1 + alea() * 0.45 * h : r < 0.9 ? h * 0.75 : h - 0.02;
    boiteL(g, 'store', L, o.c, o.w - 0.02, base + o.top - baisse / 2, baisse, 0.07, 0.035);
  }

  function balcon(g, L, base, o) {
    const pw = 3.5, pd = 1.75;
    const pos = (along, out, y, sa, sh, sd, mat) => {
      if (L.axe === 'x') boite(g, mat, sa, sh, sd, o.c + along, y, L.fixe + L.sens * out);
      else boite(g, mat, sd, sh, sa, L.fixe + L.sens * out, y, o.c + along);
    };
    pos(0, pd / 2, base - 0.06, pw, 0.22, pd, 'beton');                  // dalle
    pos(0, pd / 2, base + 0.055, pw - 0.04, 0.01, pd - 0.04, 'dalles');  // revêtement
    pos(0, pd - 0.03, base + 1.02, pw, 0.045, 0.05, 'metal');            // main courante
    pos(0, pd - 0.03, base + 0.12, pw, 0.03, 0.03, 'metal');
    for (let a = -pw / 2 + 0.06; a <= pw / 2 - 0.05; a += 0.12) pos(a, pd - 0.03, base + 0.57, 0.022, 0.9, 0.022, 'metal');
    for (const s of [-1, 1]) {
      pos(s * (pw / 2 - 0.03), pd / 2, base + 1.02, 0.05, 0.045, pd, 'metal');
      for (let d = 0.1; d < pd - 0.05; d += 0.12) pos(s * (pw / 2 - 0.03), d, base + 0.57, 0.022, 0.9, 0.022, 'metal');
    }
    // Quelques plantes en pot
    if (alea() < 0.6) {
      const a = (alea() - 0.5) * (pw - 0.8);
      pos(a, pd - 0.35, base + 0.27, 0.4, 0.4, 0.4, 'tissu');
      const pl = bosseler(new THREE.IcosahedronGeometry(0.42, 1), 0.25, 3);
      if (L.axe === 'x') pl.translate(o.c + a, base + 0.85, L.fixe + L.sens * (pd - 0.35));
      else pl.translate(L.fixe + L.sens * (pd - 0.35), base + 0.85, o.c + a);
      ajouter(g, alea() < 0.5 ? 'feuil1' : 'feuil2', pl);
    }
  }

  // Ouvertures de chaque façade, étage par étage
  for (const n of [0, 1, 2, 3]) {
    const g = 'n' + n, base = n * H;
    for (const L of LIGNES) {
      let ouv = LOTS.filter((l) => l.niveau === n).flatMap((l) => ouvertures(l, L, n));
      if (n === 0 && L.id === 'B_est') ouv = [{ c: 9, w: 5, sill: 0, top: 2.6, garage: true }];
      ouv.sort((a, b) => a.c - b.c);
      let cur = L.de;
      const piece = (c0, c1, y0, y1) => { if (c1 - c0 > 0.01 && y1 - y0 > 0.01) boiteL(g, 'enduit', L, (c0 + c1) / 2, c1 - c0, (y0 + y1) / 2, y1 - y0, T / 2, T); };
      for (const o of ouv) {
        piece(cur, o.c - o.w / 2, base, base + H);
        piece(o.c - o.w / 2, o.c + o.w / 2, base, base + o.sill);
        piece(o.c - o.w / 2, o.c + o.w / 2, base + o.top, base + H);
        cur = o.c + o.w / 2;
        if (o.garage) { boiteL(g, 'store', L, o.c, o.w, base + o.top / 2, o.top, 0.12, 0.05); continue; }
        fenetre(g, L, base, o);
        if (o.balcon) balcon(g, L, base, o);
      }
      piece(cur, L.a, base, base + H);
    }

    /* ---------- Dalles, cloisons et aménagement intérieur ---------- */
    const solA = n === 0 ? 'parquet' : 'parquet', solB = n === 0 ? 'beton' : 'parquet';
    boite(g, solA, 36 - T, 0.3, 13 - 2 * T, (-24 + T + 12) / 2, base - 0.15, 0);
    boite(g, solB, 13 - T, 0.3, 24.5 - 2 * T, (12 + 25 - T) / 2, base - 0.15, (-6.5 + T + FIN_B - T) / 2);
    const hc = H - 0.3;
    boite(g, 'enduitInt', 0.16, hc, 13 - 2 * T, 12, base + hc / 2, 0);  // jonction des ailes
    for (const l of LOTS.filter((x) => x.niveau === n)) {
      if (!l.dernier) {
        if (l.aile === 'A') boite(g, 'enduitInt', 0.16, hc, 13 - 2 * T, l.box.x2, base + hc / 2, 0);
        else boite(g, 'enduitInt', 13 - T, hc, 0.16, (12 + 25 - T) / 2, base + hc / 2, l.box.z2);
      }
      amenager(g, l, base);
    }
  }

  // Intérieur : zone jour côté cour, chambres et bain derrière (visible en coupe)
  function amenager(g, l, base) {
    const b = l.box, A = l.aile === 'A';
    const a1 = (A ? b.x1 : b.z1) + 0.1, a2 = (A ? b.x2 : b.z2) - 0.1, la = a2 - a1;
    // d = distance depuis la façade cour, de 0.3 à 12.7
    const bx = (a, d, sa, sd, y, h, mat) => {
      if (A) boite(g, mat, sa, h, sd, a, base + y + h / 2, COUR - d);
      else boite(g, mat, sd, h, sa, 12 + d, base + y + h / 2, a);
    };
    const hc = H - 0.3;
    const ch = { Studio: 0, '2.5': 1, '3.5': 2, '4.5': 3, '5.5': 4 }[l.pieces];
    const nuit = ch === 0 ? 9.2 : 6.8;    // limite jour / nuit
    // Cloison jour/nuit avec un passage
    const porte = a1 + 1.1;
    bx((a1 + porte - 0.45) / 2, nuit, porte - 0.45 - a1, 0.12, 0, hc, 'enduitInt');
    bx((porte + 0.45 + a2) / 2, nuit, a2 - porte - 0.45, 0.12, 0, hc, 'enduitInt');
    // Cellules de la zone nuit (chambres + bain)
    const cellules = ch === 0 ? ['bain'] : [...Array(ch).fill('ch'), 'bain'];
    const poids = cellules.map((c) => (c === 'bain' ? 0.6 : 1));
    const somme = poids.reduce((s, p) => s + p, 0);
    let a = a1;
    cellules.forEach((c, i) => {
      const w = ch === 0 ? Math.min(2.4, la * 0.5) : (la * poids[i]) / somme;
      const ac = ch === 0 ? a2 - w / 2 : a + w / 2;
      const dz = (nuit + 12.7) / 2;
      if (i > 0 || ch === 0) bx(ch === 0 ? a2 - w : a, dz, 0.12, 12.7 - nuit, 0, hc, 'enduitInt');
      if (c === 'ch') {
        const lit = Math.min(1.6, w - 0.8);
        bx(ac, nuit + 1.4, lit, 2.0, 0, 0.45, 'drap');
        bx(ac, nuit + 0.5, lit, 0.15, 0, 0.9, 'bois');
        bx(ac, 12.4, Math.min(w - 0.4, 2), 0.55, 0, 2.1, 'meuble'); // armoire
      } else {
        bx(ac, 12.1, Math.min(w - 0.3, 1.7), 0.75, 0, 0.55, 'meuble'); // baignoire
        bx(ac - Math.min(w, 1.7) / 2 + 0.4, nuit + 0.5, 0.5, 0.45, 0, 0.85, 'meuble');
      }
      a += w;
    });
    // Zone jour : cuisine, table, canapé, tapis
    const lk = Math.min(3.4, nuit - 2.6);
    bx(a1 + 0.35, nuit - 0.4 - lk / 2, 0.62, lk, 0, 0.92, 'meuble');
    bx(a1 + 0.35, nuit - 0.4 - lk / 2, 0.64, lk, 0.92, 0.04, 'pierre');
    if (la > 3.5) {
      const am = (a1 + a2) / 2 + 0.6;
      bx(am, 3.3, 1.7, 0.9, 0.72, 0.05, 'bois');
      bx(am, 3.3, 0.12, 0.12, 0, 0.72, 'metal');
      bx(Math.min(am + 2, a2 - 1.4), 1.3, Math.min(2.4, la - 3), 0.9, 0, 0.42, 'tissu');
      bx(Math.min(am + 2, a2 - 1.4), 1.72, Math.min(2.4, la - 3), 0.2, 0.42, 0.42, 'tissu');
    } else {
      bx((a1 + a2) / 2, 2.6, 1.6, 2.0, 0, 0.45, 'drap'); // studio : lit dans la pièce
    }
  }

  /* ---------- Toit ---------- */
  const yT = 4 * H;
  boite('toit', 'beton', 36 - T, 0.3, 13 - 2 * T, (-24 + T + 12) / 2, yT - 0.15, 0);
  boite('toit', 'beton', 13 - T, 0.3, 24.5 - 2 * T, (12 + 25 - T) / 2, yT - 0.15, (-6.5 + T + FIN_B - T) / 2);
  for (const L of LIGNES) {
    boiteL('toit', 'enduit', L, (L.de + L.a) / 2, L.a - L.de, yT + 0.45, 0.9, T / 2, T);
    boiteL('toit', 'tole', L, (L.de + L.a) / 2, L.a - L.de + 0.06, yT + 0.92, 0.05, T / 2 - 0.03, T + 0.1);
  }
  boite('toit', 'gravier', 36 - T, 0.04, 13 - 2 * T, (-24 + T + 12) / 2, yT + 0.02, 0);
  boite('toit', 'gravier', 13 - T, 0.04, 24.5 - 2 * T, (12 + 25 - T) / 2, yT + 0.02, (-6.5 + T + FIN_B - T) / 2);
  boite('toit', 'enduit', 3.2, 2.6, 3.6, 22.4, yT + 1.3, -2.8); // sortie d'ascenseur
  boite('toit', 'tole', 3.4, 0.08, 3.8, 22.4, yT + 2.64, -2.8);
  for (const [x, z] of [[-10, -5], [3, -5.2], [20, 12]]) boite('toit', 'tole', 0.7, 0.9, 0.7, x, yT + 0.45, z);
  const toitBloc = new THREE.Mesh(new THREE.BoxGeometry(37, 1, 13.5));
  toitBloc.position.set(-6, yT + 0.4, 0); toitBloc.visible = false; groupes.toit.add(toitBloc);
  const toitBloc2 = new THREE.Mesh(new THREE.BoxGeometry(13.5, 1, 25));
  toitBloc2.position.set(18.5, yT + 0.4, 5.75); toitBloc2.visible = false; groupes.toit.add(toitBloc2);
  bloqueurs.push(toitBloc, toitBloc2);

  /* ---------- Terrain : cour au niveau du rez, jardin nord au niveau du rez inférieur ---------- */
  const solG = new THREE.PlaneGeometry(1600, 1600); solG.rotateX(-Math.PI / 2); uvMonde(solG);
  const sol = new THREE.Mesh(solG, mats.herbe); sol.receiveShadow = true; groupes.site.add(sol); bloqueurs.push(sol);
  const plateforme = (x1, x2, z1, z2) => {
    const g = new THREE.BoxGeometry(x2 - x1, H, z2 - z1); g.translate((x1 + x2) / 2, H / 2, (z1 + z2) / 2); uvMonde(g);
    const m = new THREE.Mesh(g, [mats.beton, mats.beton, mats.herbe, mats.beton, mats.beton, mats.beton]);
    m.receiveShadow = true; m.castShadow = true; groupes.site.add(m); bloqueurs.push(m);
  };
  plateforme(-400, RAMPE.x1, COUR, 400);
  plateforme(RAMPE.x2, 12, COUR, 400);
  plateforme(RAMPE.x1, RAMPE.x2, COUR, RAMPE.z1);
  plateforme(RAMPE.x1, RAMPE.x2, RAMPE.z2, 400);
  plateforme(12, 400, FIN_B, 400);
  const surCour = (x, z) => (z > COUR && x < 12 && !(x > RAMPE.x1 && x < RAMPE.x2 && z > RAMPE.z1 && z < RAMPE.z2)) || (x >= 12 && z > FIN_B);
  const yTerrain = (x, z) => (surCour(x, z) ? H : 0);

  const S = 'site', y0 = H;
  // Terrasses du rez, chemin, parking
  boite(S, 'dalles', 36, 0.06, 2.8, -6, y0 + 0.03, COUR + 1.4);
  boite(S, 'dalles', 2.8, 0.06, FIN_B - 9.3, 12 - 1.4, y0 + 0.03, (9.3 + FIN_B) / 2);
  boite(S, 'dalles', 33.2, 0.05, 1.8, -24 + 33.2 / 2, y0 + 0.025, 10.2);
  boite(S, 'dalles', 1.8, 0.05, FIN_B - 11.1, 8.3, y0 + 0.025, (11.1 + FIN_B) / 2);
  boite(S, 'enrobe', 22, 0.04, 18.5, -5, y0 + 0.02, 11.3 + 18.5 / 2);
  boite(S, 'enrobe', 31, 0.04, 6, -7.5, y0 + 0.02, 33);
  boite(S, 'enrobe', 7, 0.04, 400, 4.5, y0 + 0.02, 36 + 200);
  for (const [w, d, x, z] of [[22.3, 0.22, -5, 11.3], [0.22, 18.5, -16.1, 20.5], [0.22, 14, 6.1, 18.3]]) boite(S, 'beton', w, 0.14, d, x, y0 + 0.07, z);
  for (let i = 0; i <= 8; i++) {
    boite(S, 'ligne', 0.12, 0.012, 4.8, -16 + 0.3 + i * 2.6, y0 + 0.045, 14.2);
    boite(S, 'ligne', 0.12, 0.012, 4.8, -16 + 0.3 + i * 2.6, y0 + 0.045, 27.3);
  }
  // Séparations et haies des terrasses du rez
  for (const l of LOTS.filter((x) => x.niveau === 1)) {
    if (l.aile === 'A' && !l.dernier) boite(S, 'haie', 0.5, 1.15, 2.6, l.box.x2, y0 + 0.58, COUR + 1.4);
    if (l.aile === 'B' && !l.dernier && l.box.z2 > 9.3) boite(S, 'haie', 2.6, 1.15, 0.5, 10.6, y0 + 0.58, l.box.z2);
  }
  // Rampe du parking souterrain
  {
    const L = RAMPE.z2 - RAMPE.z1, ang = Math.atan2(H, L);
    const r = new THREE.BoxGeometry(RAMPE.x2 - RAMPE.x1, 0.2, Math.hypot(L, H));
    r.rotateX(-ang); r.translate((RAMPE.x1 + RAMPE.x2) / 2, H / 2 - 0.1, (RAMPE.z1 + RAMPE.z2) / 2);
    ajouter(S, 'enrobe', uvMonde(r));
    for (const x of [RAMPE.x1 - 0.15, RAMPE.x2 + 0.15]) {
      boite(S, 'beton', 0.3, H + 1, L, x, (H + 1) / 2, (RAMPE.z1 + RAMPE.z2) / 2);
      boite(S, 'tole', 0.36, 0.05, L, x, H + 1.02, (RAMPE.z1 + RAMPE.z2) / 2);
    }
    boite(S, 'store', 4.4, 2.5, 0.05, (RAMPE.x1 + RAMPE.x2) / 2, 1.25, RAMPE.z1 + 0.03);
    boite(S, 'beton', 5, 0.5, 0.3, (RAMPE.x1 + RAMPE.x2) / 2, 2.85, RAMPE.z1 + 0.12);
  }
  // Jardin nord des studios
  boite(S, 'dalles', 36, 0.05, 2.6, -6, 0.025, -6.5 - 1.3);
  for (const l of LOTS.filter((x) => x.niveau === 0 && !x.dernier)) boite(S, 'haie', 0.5, 1.1, 2.6, l.box.x2, 0.55, -7.8);
  // Haies (déformées pour faire naturel)
  const haie = (x, z, w, d, h = 1.2, dy = 0) => {
    const y = yTerrain(x, z) + dy;
    const g = bosseler(new THREE.BoxGeometry(w, h, d, Math.ceil(w * 1.5), 3, Math.ceil(d * 1.5)), 0.06, 0.9);
    g.translate(x, y + h / 2, z);
    ajouter(S, 'haie', uvMonde(g));
  };
  // Arbres fins en colonne (comme sur les visualisations de la promotion)
  const colonne = (x, z, dy = 0, s = 1) => {
    const y = yTerrain(x, z) + dy;
    const g = bosseler(new THREE.SphereGeometry(1, 12, 16), 0.14, 1.8);
    g.scale(0.5 * s, 1.9 * s, 0.5 * s); g.translate(x, y + 2.2 * s, z);
    ajouter(S, alea() < 0.5 ? 'feuil3' : 'haie', g);
    const t = new THREE.CylinderGeometry(0.05, 0.07, 0.6, 5); t.translate(x, y + 0.3, z); ajouter(S, 'tronc', t);
  };
  // Bacs en béton avec haie devant les terrasses du rez (aile A, puis aile B)
  for (const x of [-21, -14, -7, 0]) {
    boite(S, 'beton', 4.6, 0.55, 0.9, x, H + 0.275, 9.15);
    haie(x, 9.15, 4.2, 0.6, 0.7, 0.55);
    colonne(x - 1.6, 9.15, 0.55, 0.9 + alea() * 0.25); colonne(x + 1.6, 9.15, 0.55, 0.9 + alea() * 0.25);
  }
  boite(S, 'beton', 0.9, 0.55, 6.4, 9.6, H + 0.275, 14.6);
  haie(9.6, 14.6, 0.6, 6, 0.7, 0.55);
  colonne(9.6, 12, 0.55, 1.05); colonne(9.6, 17.2, 0.55, 0.95);
  haie(-30, 10, 0.8, 7); haie(14.5, 26, 14, 0.9, 1.6); haie(-26, -12, 0.9, 10); haie(28, 4, 0.9, 20);

  /* ---------- Arbres ---------- */
  function feuillu(x, z, s = 1) {
    const y = yTerrain(x, z);
    const t = new THREE.CylinderGeometry(0.13 * s, 0.24 * s, 3.4 * s, 7); t.translate(x, y + 1.7 * s, z);
    ajouter(S, 'tronc', t);
    // Branches principales
    for (let i = 0; i < 4; i++) {
      const b = new THREE.CylinderGeometry(0.04 * s, 0.1 * s, 2.2 * s, 5);
      b.translate(0, 1.1 * s, 0); b.rotateZ(0.5 + alea() * 0.3); b.rotateY(alea() * Math.PI * 2);
      b.translate(x, y + 2.9 * s, z); ajouter(S, 'tronc', b);
    }
    // Couronne : beaucoup de petites touffes bosselées dans un volume ovale
    const nb = 16 + Math.floor(alea() * 8), m = ['feuil1', 'feuil2', 'feuil3'][Math.floor(alea() * 3)];
    for (let i = 0; i < nb; i++) {
      const r = (0.75 + alea() * 0.6) * s;
      const ang = alea() * Math.PI * 2, rad = Math.sqrt(alea()) * 2.3 * s, hy = (alea() - 0.35) * 2.6 * s;
      const g = bosseler(new THREE.IcosahedronGeometry(r, 3), 0.32, 2.2 / s);
      g.translate(x + Math.cos(ang) * rad, y + 5 * s + hy, z + Math.sin(ang) * rad);
      ajouter(S, alea() < 0.75 ? m : 'feuil3', g);
    }
  }
  function sapin(x, z, s = 1) {
    const y = yTerrain(x, z);
    const t = new THREE.CylinderGeometry(0.1 * s, 0.2 * s, 2 * s, 6); t.translate(x, y + 1 * s, z); ajouter(S, 'tronc', t);
    for (let i = 0; i < 5; i++) {
      const g = bosseler(new THREE.ConeGeometry((2.4 - i * 0.42) * s, 2.6 * s, 9, 2), 0.12, 1.2);
      g.translate(x, y + (2 + i * 1.45) * s, z);
      ajouter(S, 'sapin', g);
    }
  }
  [[-36, 13, 1.2], [-44, 30, 1.1], [16, 34, 1.2], [27, 27, 1.4], [-46, 2, 1.3], [-6, 52, 1.2],
   [-36, -16, 1.5], [-18, -19, 1.2], [2, -17, 1.4], [19, -16, 1.3], [33, -4, 1.2], [35, 10, 1.5], [22, 46, 1.2], [-52, 46, 1.4]]
    .forEach(([x, z, s]) => feuillu(x, z, s));
  [[-42, -24, 1.3], [40, -20, 1.4], [44, 24, 1.2], [-50, 22, 1.5], [30, 52, 1.3]].forEach(([x, z, s]) => sapin(x, z, s));

  /* ---------- Village et paysage au loin ---------- */
  function maison(x, z, w, d, ry) {
    const y = yTerrain(x, z), hm = 5 + alea() * 2;
    const m = new THREE.BoxGeometry(w, hm, d); m.rotateY(ry); m.translate(x, y + hm / 2, z); ajouter(S, 'crepi', uvMonde(m));
    // Fenêtres et volets sur les façades longues
    for (const s of [-1, 1]) for (let et = 0; et < 2; et++) for (let i = 0; i < 3; i++) {
      const lx = -w / 2 + (w / 3) * (i + 0.5);
      const f = new THREE.BoxGeometry(1.1, 1.3, 0.06); f.translate(lx, 1.6 + et * 2.6, s * (d / 2 + 0.01));
      f.rotateY(ry); f.translate(x, y, z); ajouter(S, 'sombre', uvMonde(f));
      for (const v of [-1, 1]) {
        const vo = new THREE.BoxGeometry(0.5, 1.35, 0.05); vo.translate(lx + v * 0.82, 1.6 + et * 2.6, s * (d / 2 + 0.03));
        vo.rotateY(ry); vo.translate(x, y, z); ajouter(S, 'volet', uvMonde(vo));
      }
    }
    for (const s of [-1, 1]) {
      const p = new THREE.BoxGeometry(w + 0.8, 0.18, d / 2 / Math.cos(0.6) + 0.5);
      p.rotateX(s * 0.6); p.translate(0, y + hm + Math.tan(0.6) * d / 4, s * d / 4);
      p.rotateY(ry); p.translate(x, 0, z);
      ajouter(S, 'tuiles', uvMonde(p));
    }
  }
  [[-70, -38, 12, 10, 0.2], [-86, 6, 10, 9, -0.3], [-64, 48, 14, 11, 0.1], [58, -40, 11, 9, 0.5], [72, 2, 13, 10, -0.2],
   [62, 52, 10, 9, 0.3], [-20, -60, 12, 10, 0], [16, -64, 11, 9, 0.4], [-105, -30, 12, 9, 0.6], [100, -25, 13, 10, -0.4],
   [-18, 80, 12, 10, 0.1], [26, 76, 11, 9, -0.2], [-36, 102, 13, 10, 0.3], [32, 106, 12, 10, 0], [-6, 130, 12, 9, 0.2], [60, 94, 11, 9, 0.5]]
    .forEach(([x, z, w, d, r]) => maison(x, z, w, d, r));
  // Lisières de forêt au loin : beaucoup d'arbres simples, feuillus et sapins mélangés
  for (let i = 0; i < 260; i++) {
    const ang = alea() * Math.PI * 2, rr = 120 + alea() * 160;
    const x = Math.cos(ang) * rr, z = Math.sin(ang) * rr, y = yTerrain(x, z), s = 0.8 + alea() * 0.9;
    if (alea() < 0.45) {
      const g = bosseler(new THREE.ConeGeometry(2.6 * s, 9 * s, 8, 3), 0.1, 0.6);
      g.translate(x, y + 4.5 * s, z); ajouter(S, 'sapin', g);
    } else {
      for (let k = 0; k < 3; k++) {
        const r = (2.2 + alea() * 1.4) * s;
        const g = bosseler(new THREE.IcosahedronGeometry(r, 2), 0.3, 0.5);
        g.translate(x + (alea() - 0.5) * 3 * s, y + (5 + alea() * 2) * s, z + (alea() - 0.5) * 3 * s);
        ajouter(S, alea() < 0.5 ? 'feuil3' : 'feuil1', g);
      }
    }
  }
  for (const [x, z, r] of [[-420, -520, 300], [380, -560, 280], [640, 80, 260], [-640, 180, 300], [60, -720, 360], [-200, 640, 260]]) {
    const g = new THREE.SphereGeometry(r, 32, 16); g.scale(1, 0.16, 1); g.translate(x, -r * 0.04, z);
    ajouter(S, 'colline', uvMonde(g));
  }

  /* ---------- Mobilier extérieur, voitures, éclairage ---------- */
  for (const [x, z] of [[-17, 7.9], [-3, 7.9], [10.6, 14]]) {
    boite(S, 'metal', 0.06, 2.3, 0.06, x, y0 + 1.15, z);
    const c = new THREE.ConeGeometry(1.5, 0.55, 8, 1, true); c.translate(x, y0 + 2.35, z); ajouter(S, 'toile', c);
    const tb = new THREE.CylinderGeometry(0.45, 0.45, 0.04, 16); tb.translate(x, y0 + 0.74, z); ajouter(S, 'meuble', tb);
    boite(S, 'metal', 0.05, 0.72, 0.05, x, y0 + 0.37, z);
  }
  for (const [x, z] of [[-20, 11.2], [-8, 11.2], [4, 11.2], [8.3, 30]]) {
    boite(S, 'metal', 0.1, 4.2, 0.1, x, y0 + 2.1, z);
    boite(S, 'metal', 0.5, 0.1, 0.22, x, y0 + 4.2, z);
  }
  const voitures = new THREE.Group(); groupes.site.add(voitures);
  const peinture = (c) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.6, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08 });
  const vitreAuto = new THREE.MeshPhysicalMaterial({ color: 0x11161b, metalness: 0.3, roughness: 0.05, envMapIntensity: 1.5 });
  const pneu = M({ color: 0x18191b, roughness: 0.85 });
  const jante = M({ color: 0xb8bcc0, metalness: 0.9, roughness: 0.3 });
  function voiture(x, z, rot, couleur) {
    const v = new THREE.Group();
    const corps = new THREE.Mesh(new RoundedBoxGeometry(4.5, 0.78, 1.86, 4, 0.28), peinture(couleur));
    corps.position.y = 0.72;
    const cab = new THREE.Mesh(new RoundedBoxGeometry(2.55, 0.66, 1.66, 4, 0.3), vitreAuto);
    cab.position.set(-0.25, 1.33, 0);
    const toitA = new THREE.Mesh(new RoundedBoxGeometry(2.1, 0.08, 1.6, 2, 0.04), corps.material);
    toitA.position.set(-0.3, 1.66, 0);
    v.add(corps, cab, toitA);
    for (const [px, pz] of [[1.45, 0.86], [1.45, -0.86], [-1.4, 0.86], [-1.4, -0.86]]) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 20), pneu); r.rotation.x = Math.PI / 2; r.position.set(px, 0.36, pz);
      const j = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.27, 16), jante); j.rotation.x = Math.PI / 2; j.position.copy(r.position);
      v.add(r, j);
    }
    for (const s of [-1, 1]) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.42), M({ color: 0xf6f3ea, emissive: 0x333333 }));
      f.position.set(2.24, 0.82, s * 0.62); v.add(f);
      const ar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.4), M({ color: 0x8a1010, emissive: 0x220000 }));
      ar.position.set(-2.24, 0.86, s * 0.62); v.add(ar);
    }
    v.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    v.position.set(x, y0 + 0.02, z); v.rotation.y = rot;
    voitures.add(v);
  }
  voiture(-14.4, 14.2, Math.PI / 2, 0xf2f2f0);
  voiture(-9.2, 14.2, -Math.PI / 2, 0x1d2a44);
  voiture(1.2, 14.2, Math.PI / 2, 0x6b6e72);
  voiture(-4, 27.3, -Math.PI / 2, 0x111214);
  voiture(4.5, 44, Math.PI, 0x8a1c1c);

  /* ---------- Assemblage : une seule géométrie par groupe et par matériau ---------- */
  for (const [cle, liste] of seaux) {
    const [g, m] = cle.split('|');
    const geo = mergeGeometries(liste, false);
    const mesh = new THREE.Mesh(geo, mats[m]);
    mesh.castShadow = !sansOmbre.has(m) && (g !== 'site' || !['colline'].includes(m));
    mesh.receiveShadow = true;
    groupes[g].add(mesh);
  }
  seaux.clear();

  /* ---------- Ciel, soleil de fin d'après-midi et reflets ---------- */
  // Soleil de fin d'après-midi, rasant sur les façades de la cour (relief et ombres longues)
  const soleilDir = new THREE.Vector3(-0.86, 0.33, 0.38).normalize();
  const ciel = new Sky();
  ciel.scale.setScalar(2500);
  ciel.userData.sansAO = true;
  const u = ciel.material.uniforms;
  u.turbidity.value = 3.5; u.rayleigh.value = 2.2; u.mieCoefficient.value = 0.004; u.mieDirectionalG.value = 0.85;
  u.sunPosition.value.copy(soleilDir);
  scene.add(ciel);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const cielEnv = new Sky(); cielEnv.scale.setScalar(50);
  Object.keys(u).forEach((k) => { cielEnv.material.uniforms[k].value = u[k].value; });
  const sEnv = new THREE.Scene(); sEnv.add(cielEnv);
  let envCible = pmrem.fromScene(sEnv, 0.02, 0.1, 100);
  scene.environment = envCible.texture;
  scene.fog = new THREE.Fog(0xc9d3da, 110, 640);

  // Ambiance plus faible que le soleil : vraies zones d'ombre, donc du relief
  for (const [nom, m] of Object.entries(mats)) if (!['vitre', 'pv', 'sombre', 'tole', 'metal'].includes(nom)) m.envMapIntensity = 0.42;
  const soleil = new THREE.DirectionalLight(0xffdcae, 5.6);
  soleil.position.copy(soleilDir).multiplyScalar(120);
  soleil.target.position.set(0, 0, 6);
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(mobile ? 2048 : 4096, mobile ? 2048 : 4096);
  Object.assign(soleil.shadow.camera, { left: -58, right: 58, top: 58, bottom: -58, near: 20, far: 260 });
  soleil.shadow.bias = -0.00025;
  soleil.shadow.normalBias = 0.035;
  scene.add(soleil, soleil.target);
  const hemi = new THREE.HemisphereLight(0xc9d9ee, 0x5e5a40, 0.25);
  scene.add(hemi);

  // Soleil réglable (curseur « Soleil ») : ciel, couleur, force, ombres et reflets suivent
  const chaud = new THREE.Color(0xff9a52), clair = new THREE.Color(0xfff2e0), base = new THREE.Color(0xffdcae);
  const lisse = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  function reglerSoleil(dir, reflets = true) {
    const y = dir.y;
    u.sunPosition.value.copy(dir);
    soleil.position.copy(soleil.target.position).addScaledVector(dir, 120);
    // Bas sur l'horizon : orangé et plus faible. Haut : blanc chaud.
    soleil.color.copy(chaud).lerp(base, lisse(0.02, 0.33, y)).lerp(clair, lisse(0.33, 0.8, y));
    soleil.intensity = 5.6 * lisse(-0.01, 0.16, y) * (1 - 0.12 * lisse(0.45, 0.95, y));
    hemi.intensity = 0.25 * (0.55 + 0.45 * lisse(0, 0.4, y));
    if (reflets) {
      cielEnv.material.uniforms.sunPosition.value.copy(dir);
      const ancien = envCible;
      envCible = pmrem.fromScene(sEnv, 0.02, 0.1, 100);
      scene.environment = envCible.texture;
      ancien.dispose();
    }
  }

  const niveaux = [groupes.n0, groupes.n1, groupes.n2, groupes.n3];
  return { niveaux, toit: groupes.toit, bloqueurs, reglerSoleil };
}
