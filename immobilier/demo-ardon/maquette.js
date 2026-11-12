// Maquette 3D du Clos des Forges (Ardon, VS) : 2 immeubles en arc (A-B-C et D-E-F) autour d'une cour.
// Forme estimée d'après la maquette aérienne de l'annonce (plans non publiés) : à reprendre avec les vrais plans.
// Tout est construit en code, puis regroupé par matériau (peu d'appels de dessin = fluide).
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { creerTextures, alea } from './textures.js';

export const H = 2.95;        // hauteur d'étage (m)
const NIV = 3;                // rez-de-jardin, 1er, attique
const T = 0.3;                // épaisseur des murs de façade
const PROF = 12.6;            // profondeur d'un immeuble
const COL = 11.5;             // largeur d'un appartement le long de la façade
const SOL = -0.3;             // niveau du terrain (le rez est sur un socle de 30 cm)
const EXT = 1.3;              // prolongement des ailes aux jonctions (pas de trou dans les coudes)

// Ailes A à F. ang : direction de la façade (0 = vers l'est). L'avant (balcons, jardins) est côté sud.
const AILES_DEF = [
  { id: 'A', x: -50, z: -14, ang: -0.35, cols: 3 },
  { id: 'B', ang: 0, cols: 3 },
  { id: 'C', ang: 0.35, cols: 2 },
  { id: 'D', x: -44, z: 22, ang: 0.26, cols: 2 },
  { id: 'E', ang: 0, cols: 3 },
  { id: 'F', ang: -0.26, cols: 2 },
];
const AILES = [];
{
  let px = 0, pz = 0;
  AILES_DEF.forEach((d, i) => {
    if (d.x !== undefined) { px = d.x; pz = d.z; }
    const L = d.cols * COL, ux = Math.cos(d.ang), uz = Math.sin(d.ang);
    const prev = AILES_DEF[i - 1], next = AILES_DEF[i + 1];
    const w = {
      ...d, L, ux, uz, nx: -uz, nz: ux,
      cx: px + ux * L / 2, cz: pz + uz * L / 2,
      jG: d.x === undefined,                           // jonction à gauche (début)
      jD: !!next && next.x === undefined,              // jonction à droite (fin)
    };
    w.eG = w.jG ? EXT : 0; w.eD = w.jD ? EXT : 0;
    AILES.push(w);
    px += ux * L; pz += uz * L;
    void prev;
  });
}
// Coordonnées locales d'une aile -> monde
const versMonde = (w, lx, lz) => new THREE.Vector3(w.cx + w.ux * lx + w.nx * lz, 0, w.cz + w.uz * lx + w.nz * lz);

// Vue de départ (utilisée par app.js)
export const VUE = { cible: new THREE.Vector3(-2, 12, -6), dir: new THREE.Vector3(-0.3, 0.3, 0.9).normalize(), distance: 118, max: 190 };

/* ---------- Appartements : 3 par colonne (rez, 1er, attique), numérotés comme chez Berra ---------- */
// Colonne k de l'aile A : A(3k+1) rez, A(3k+2) 1er, A(3k+3) attique. (Position estimée : plans non publiés.)
export const UNITES = [];
for (const w of AILES) for (let k = 0; k < w.cols; k++) for (let n = 0; n < NIV; n++) {
  const x0 = -w.L / 2 + k * COL;
  UNITES.push({ id: w.id + (3 * k + n + 1), aile: w, k, niveau: n, x0, x1: x0 + COL });
}
export function placerLots(LOTS) {
  for (const l of LOTS) {
    const u = UNITES.find((x) => x.id === l.lot);
    if (!u) { console.warn('Lot sans place dans la maquette :', l.lot); continue; }
    u.lot = l;
    const c = versMonde(u.aile, (u.x0 + u.x1) / 2, 0);
    l.unite = u;
    l.centre = new THREE.Vector3(c.x, l.niveau * H + H / 2, c.z);
    l.rot = -u.aile.ang;
    l.dim = { w: COL, d: PROF };
    l.immeuble = u.aile.id;
    l.exterieur = l.niveau === 0 ? 'Terrasse et jardin' : 'Balcon';
  }
}

// Point de vue depuis un lot : devant sa porte-fenêtre, à hauteur d'yeux
const porteX = (u) => u.x0 + COL * 0.33;
export function pointDeVue(l) {
  const u = l.unite, w = u.aile;
  const p = versMonde(w, porteX(u), PROF / 2 + 0.45);
  p.y = l.niveau * H + 1.62;
  return { oeil: p, dir: new THREE.Vector3(w.nx, 0, w.nz) };
}

/* ---------- Outils de géométrie ---------- */
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
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) g.deleteAttribute(k);
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
// Géométrie construite dans le repère d'une aile, puis placée dans le monde
function enAile(w, g) { g.rotateY(-w.ang); g.translate(w.cx, 0, w.cz); return g; }
function boiteW(w, groupe, mat, sx, sy, sz, lx, y, lz) {
  if (sx <= 0.001 || sy <= 0.001 || sz <= 0.001) return;
  const g = new THREE.BoxGeometry(sx, sy, sz); g.translate(lx, y, lz);
  ajouter(groupe, mat, uvMonde(enAile(w, g)));
}
// Boîte dans le repère d'une façade : c = position le long, off = enfoncement vers l'intérieur
function boiteF(F, groupe, mat, c, long, y, h, off, ep) {
  if (F.axe === 'x') boiteW(F.w, groupe, mat, long, h, ep, c, y, F.fixe - F.sens * off);
  else boiteW(F.w, groupe, mat, ep, h, long, F.fixe - F.sens * off, y, c);
}
// Position vers l'extérieur de la façade (balcons)
function boiteOut(F, groupe, mat, c, sa, out, y, sh, sd) {
  if (F.axe === 'x') boiteW(F.w, groupe, mat, sa, sh, sd, c, y, F.fixe + F.sens * out);
  else boiteW(F.w, groupe, mat, sd, sh, sa, F.fixe + F.sens * out, y, c);
}

const bruit = new SimplexNoise({ random: alea });
function bosseler(g, force, freq) {
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
    enduit: M({ map: tex.enduitInt, color: 0xffffff, roughness: 0.93 }),
    enduitInt: M({ map: tex.enduitInt, roughness: 0.95 }),
    beton: M({ map: tex.beton, roughness: 0.92 }),
    parquet: M({ map: tex.parquet, roughness: 0.55 }),
    dalles: M({ map: tex.dalles, roughness: 0.9 }),
    herbe: M({ map: tex.herbe, roughness: 1 }),
    enrobe: M({ map: tex.enrobe, roughness: 0.92 }),
    gravier: M({ map: tex.gravier, roughness: 1 }),
    haie: M({ map: tex.haie, roughness: 1 }),
    vitre: new THREE.MeshPhysicalMaterial({ color: 0x27323b, metalness: 0.25, roughness: 0.03, transparent: true, opacity: 0.62, envMapIntensity: 1.6, side: THREE.DoubleSide }),
    verre: new THREE.MeshPhysicalMaterial({ color: 0xbfd2d8, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.16, envMapIntensity: 0.7, side: THREE.DoubleSide, depthWrite: false }),
    cadre: M({ color: 0x3a3d40, roughness: 0.45, metalness: 0.35 }),
    store: M({ map: tex.lames, color: 0xcfcfcf, roughness: 0.7 }),
    pierre: M({ color: 0xd9d6cf, roughness: 0.75 }),
    metal: M({ color: 0x2b2d30, roughness: 0.4, metalness: 0.7 }),
    tole: M({ color: 0x55595e, roughness: 0.4, metalness: 0.7 }),
    ardoise: M({ map: tex.ardoise, roughness: 0.75, side: THREE.DoubleSide }),
    meuble: M({ color: 0xf1eee8, roughness: 0.5 }),
    tissu: M({ color: 0x6f6b66, roughness: 0.95 }),
    drap: M({ color: 0xebe6dd, roughness: 0.9 }),
    bois: M({ color: 0x9c7450, roughness: 0.6 }),
    feuil1: M({ map: tex.feuillage, color: 0x5a8a3a, roughness: 0.9 }),
    feuil2: M({ map: tex.feuillage, color: 0x6c9640, roughness: 0.9 }),
    feuil3: M({ map: tex.feuillage, color: 0x3f6a2c, roughness: 0.95 }),
    sapin: M({ map: tex.feuillage, color: 0x2d4a2a, roughness: 0.95 }),
    tronc: M({ color: 0x5a4636, roughness: 1 }),
    tuiles: M({ map: tex.tuiles, roughness: 0.85 }),
    crepi: M({ color: 0xece5d8, roughness: 0.95 }),
    ligne: M({ color: 0xededed, roughness: 0.8 }),
    volet: M({ color: 0x7a5a3c, roughness: 0.8 }),
    roche: M({ map: tex.roche, roughness: 0.95 }),
    vigne: M({ map: tex.vigne, roughness: 1 }),
    murSec: M({ map: tex.beton, color: 0xb9ad97, roughness: 1 }),
    eau: new THREE.MeshPhysicalMaterial({ color: 0x2f8fb0, roughness: 0.04, metalness: 0.1, transmission: 0, envMapIntensity: 1.5 }),
    montagne: M({ vertexColors: true, roughness: 1, side: THREE.DoubleSide }),
    toile: M({ color: 0xf2efe8, roughness: 0.9, side: THREE.DoubleSide }),
  };
  const sansOmbre = new Set(['herbe', 'enrobe', 'dalles', 'gravier', 'parquet', 'ligne', 'vigne', 'eau', 'montagne']);

  const groupes = { n0: new THREE.Group(), n1: new THREE.Group(), n2: new THREE.Group(), toit: new THREE.Group(), site: new THREE.Group() };
  Object.values(groupes).forEach((g) => scene.add(g));
  const bloqueurs = [];

  placerLots(LOTS);

  /* ---------- Façades des ailes ---------- */
  const faces = (w) => {
    const de = -w.L / 2 - w.eG, a = w.L / 2 + w.eD;
    const f = [
      { w, id: 'av', axe: 'x', fixe: PROF / 2, sens: 1, de, a },
      { w, id: 'ar', axe: 'x', fixe: -PROF / 2, sens: -1, de, a },
    ];
    if (!w.jG) f.push({ w, id: 'g', axe: 'z', fixe: -w.L / 2, sens: -1, de: -PROF / 2, a: PROF / 2 });
    if (!w.jD) f.push({ w, id: 'd', axe: 'z', fixe: w.L / 2, sens: 1, de: -PROF / 2, a: PROF / 2 });
    return f;
  };
  function ouvertures(F, n) {
    const w = F.w, o = [];
    if (F.id === 'av') for (let k = 0; k < w.cols; k++) {
      const x0 = -w.L / 2 + k * COL;
      o.push({ c: x0 + COL * 0.33, w: 2.6, sill: 0, top: 2.35, porte: true, balcon: n >= 1, terrasse: n === 0 });
      o.push({ c: x0 + COL * 0.74, w: 1.9, sill: 0.55, top: 2.35 });
    }
    if (F.id === 'ar') for (let k = 0; k < w.cols; k++) {
      const x0 = -w.L / 2 + k * COL;
      o.push({ c: x0 + COL * 0.18, w: 1.3, sill: 0.95, top: 2.3 });
      o.push({ c: x0 + COL * 0.5, w: 0.75, sill: 1.4, top: 2.3 });
      o.push({ c: x0 + COL * 0.82, w: 1.3, sill: 0.95, top: 2.3 });
    }
    if (F.id === 'g' || F.id === 'd') for (const c of [-3.2, 3.2]) o.push({ c, w: 1.3, sill: 0.95, top: 2.3 });
    return o;
  }
  function fenetre(g, F, base, o) {
    const h = o.top - o.sill, yc = base + o.sill + h / 2, f = 0.07, off = 0.18;
    boiteF(F, g, 'vitre', o.c, o.w - 0.06, yc, h - 0.06, off, 0.02);
    boiteF(F, g, 'cadre', o.c - o.w / 2 + f / 2, f, yc, h, off, 0.09);
    boiteF(F, g, 'cadre', o.c + o.w / 2 - f / 2, f, yc, h, off, 0.09);
    boiteF(F, g, 'cadre', o.c, o.w, base + o.top - f / 2, f, off, 0.09);
    boiteF(F, g, 'cadre', o.c, o.w, base + o.sill + f / 2, f, off, 0.09);
    if (o.w > 1.45) boiteF(F, g, 'cadre', o.c, f * 0.8, yc, h, off, 0.08);
    if (o.sill > 0) boiteF(F, g, 'pierre', o.c, o.w + 0.16, base + o.sill - 0.03, 0.05, -0.05, 0.3);
    const r = alea();
    const baisse = r < 0.4 ? 0.1 : r < 0.8 ? 0.1 + alea() * 0.45 * h : h * 0.8;
    boiteF(F, g, 'store', o.c, o.w - 0.02, base + o.top - baisse / 2, baisse, 0.07, 0.035);
  }
  function balcon(g, F, base, o) {
    const pw = 5.4, pd = 2.2, c = o.c + 0.9;
    boiteOut(F, g, 'beton', c, pw, pd / 2, base - 0.08, 0.24, pd);
    boiteOut(F, g, 'dalles', c, pw - 0.06, pd / 2, base + 0.05, 0.01, pd - 0.06);
    // Garde-corps vitré, main courante en métal
    boiteOut(F, g, 'verre', c, pw - 0.1, pd - 0.06, base + 0.55, 0.95, 0.02);
    boiteOut(F, g, 'metal', c, pw, pd - 0.06, base + 1.05, 0.05, 0.06);
    for (const s of [-1, 1]) {
      boiteOut(F, g, 'verre', c + s * (pw / 2 - 0.04), 0.02, pd / 2, base + 0.55, 0.95, pd - 0.1);
      boiteOut(F, g, 'metal', c + s * (pw / 2 - 0.03), 0.06, pd / 2, base + 1.05, 0.05, pd);
      boiteOut(F, g, 'metal', c + s * (pw / 2 - 0.03), 0.05, pd - 0.06, base + 0.55, 1.0, 0.05);
    }
    if (alea() < 0.55) { // mobilier de balcon
      boiteOut(F, g, 'bois', c - 1.2, 0.9, 1.2, base + 0.7, 0.05, 0.9);
      boiteOut(F, g, 'metal', c - 1.2, 0.06, 1.2, base + 0.36, 0.68, 0.06);
      if (alea() < 0.6) {
        const pl = bosseler(new THREE.IcosahedronGeometry(0.45, 1), 0.25, 3);
        const p = versMonde(F.w, c + 2.1, PROF / 2 + pd - 0.4);
        boiteW(F.w, g, 'tissu', 0.42, 0.42, 0.42, c + 2.1, base + 0.27, PROF / 2 + pd - 0.4);
        pl.translate(p.x, base + 0.85, p.z); ajouter(g, alea() < 0.5 ? 'feuil1' : 'feuil2', pl);
      }
    }
  }

  for (const w of AILES) {
    const Ltot = w.L + w.eG + w.eD, mid = (w.eD - w.eG) / 2;
    for (let n = 0; n < NIV; n++) {
      const g = 'n' + n, base = n * H;
      for (const F of faces(w)) {
        const ouv = ouvertures(F, n).sort((a, b) => a.c - b.c);
        let cur = F.de;
        const piece = (c0, c1, y0, y1) => { if (c1 - c0 > 0.01 && y1 - y0 > 0.01) boiteF(F, g, 'enduit', (c0 + c1) / 2, c1 - c0, (y0 + y1) / 2, y1 - y0, T / 2, T); };
        for (const o of ouv) {
          piece(cur, o.c - o.w / 2, base, base + H);
          piece(o.c - o.w / 2, o.c + o.w / 2, base, base + o.sill);
          piece(o.c - o.w / 2, o.c + o.w / 2, base + o.top, base + H);
          cur = o.c + o.w / 2;
          fenetre(g, F, base, o);
          if (o.balcon) balcon(g, F, base, o);
        }
        piece(cur, F.a, base, base + H);
        // Bandeau entre les étages
        boiteF(F, g, 'pierre', (F.de + F.a) / 2, F.a - F.de, base + H - 0.06, 0.12, -0.02, 0.06);
      }
      // Dalle, cloisons entre appartements, aménagement
      boiteW(w, g, 'parquet', Ltot - 2 * T, 0.3, PROF - 2 * T, mid, base - 0.15, 0);
      const hc = H - 0.3;
      for (let k = 1; k < w.cols; k++) boiteW(w, g, 'enduitInt', 0.18, hc, PROF - 2 * T, -w.L / 2 + k * COL, base + hc / 2, 0);
      boiteW(w, g, 'enduitInt', Ltot - 2 * T, hc, 0.14, mid, base + hc / 2, -PROF / 2 + T + 1.6); // couloir / cage d'escalier
      for (const u of UNITES.filter((x) => x.aile === w && x.niveau === n)) {
        amenager(g, u, base);
        if (!u.lot) { // lot non publié : bloque le clic sans rien afficher
          const b = new THREE.Mesh(new THREE.BoxGeometry(COL, H, PROF));
          const c = versMonde(w, (u.x0 + u.x1) / 2, 0);
          b.position.set(c.x, base + H / 2, c.z); b.rotation.y = -w.ang; b.visible = false;
          groupes[g].add(b); bloqueurs.push(b);
        }
      }
    }
    // Socle en béton sous le rez
    for (const F of faces(w)) boiteF(F, 'n0', 'beton', (F.de + F.a) / 2, F.a - F.de, SOL / 2 - 0.05, -SOL + 0.1, 0.02, T + 0.04);
  }

  // Intérieur : séjour côté sud (balcon), chambres et bains côté nord
  function amenager(g, u, base) {
    const w = u.aile, a1 = u.x0 + 0.15, a2 = u.x1 - 0.15, la = a2 - a1;
    const dmax = PROF - 2 * T;
    const bx = (a, d, sa, sd, y, h, mat) => boiteW(w, g, mat, sa, h, sd, a, base + y + h / 2, PROF / 2 - T - d);
    const hc = H - 0.3;
    const p = u.lot ? u.lot.pieces : (alea() < 0.5 ? '3.5' : '4.5');
    const ch = p === '4.5' ? 3 : 2;
    const nuit = 6.4;
    const porte = a1 + 1.2;
    bx((a1 + porte - 0.45) / 2, nuit, porte - 0.45 - a1, 0.12, 0, hc, 'enduitInt');
    bx((porte + 0.45 + a2) / 2, nuit, a2 - porte - 0.45, 0.12, 0, hc, 'enduitInt');
    const cellules = [...Array(ch).fill('ch'), 'bain'];
    const poids = cellules.map((c) => (c === 'bain' ? 0.6 : 1));
    const somme = poids.reduce((s, x) => s + x, 0);
    let a = a1;
    const fond = dmax - 1.75; // couloir commun derrière
    cellules.forEach((c, i) => {
      const lw = (la * poids[i]) / somme, ac = a + lw / 2;
      if (i > 0) bx(a, (nuit + fond) / 2, 0.12, fond - nuit, 0, hc, 'enduitInt');
      if (c === 'ch') {
        const lit = Math.min(1.6, lw - 0.8);
        bx(ac, nuit + 1.4, lit, 2.0, 0, 0.45, 'drap');
        bx(ac, nuit + 0.45, lit, 0.15, 0, 0.9, 'bois');
        bx(ac, fond - 0.35, Math.min(lw - 0.4, 2), 0.55, 0, 2.1, 'meuble');
      } else {
        bx(ac, fond - 0.45, Math.min(lw - 0.3, 1.7), 0.75, 0, 0.55, 'meuble');
        bx(ac - Math.min(lw, 1.7) / 2 + 0.4, nuit + 0.5, 0.5, 0.45, 0, 0.85, 'meuble');
      }
      a += lw;
    });
    // Cuisine, table, canapé
    const lk = 3.4;
    bx(a1 + 0.35 + 1.2, nuit - 0.4 - lk / 2, 0.62, lk, 0, 0.92, 'meuble');
    bx(a1 + 0.35 + 1.2, nuit - 0.4 - lk / 2, 0.64, lk, 0.92, 0.04, 'pierre');
    const am = (a1 + a2) / 2 + 0.4;
    bx(am, 3.4, 1.9, 0.95, 0.72, 0.05, 'bois');
    bx(am, 3.4, 0.12, 0.12, 0, 0.72, 'metal');
    bx(Math.min(am + 2.6, a2 - 1.4), 1.3, Math.min(2.6, la - 4), 0.9, 0, 0.42, 'tissu');
    bx(Math.min(am + 2.6, a2 - 1.4), 1.72, Math.min(2.6, la - 4), 0.2, 0.42, 0.42, 'tissu');
  }

  /* ---------- Toits à deux pans en ardoise ---------- */
  const pente = 0.4, ov = 0.7, yT = NIV * H;
  const hd = PROF / 2 + ov;
  const yFaitage = yT + 0.25 + (PROF / 2) * Math.tan(pente);
  for (const w of AILES) {
    const Lr = w.L + w.eG + w.eD + (w.jG ? 0 : ov) + (w.jD ? 0 : ov);
    const mid = ((w.eD + (w.jD ? 0 : ov)) - (w.eG + (w.jG ? 0 : ov))) / 2;
    for (const s of [-1, 1]) {
      const g = new THREE.BoxGeometry(Lr, 0.22, hd / Math.cos(pente));
      g.rotateX(s * pente); g.translate(mid, yFaitage - (hd / 2) * Math.tan(pente), s * hd / 2);
      ajouter('toit', 'ardoise', uvMonde(enAile(w, g)));
      // Bord de toit (avant-toit) en tôle
      boiteW(w, 'toit', 'tole', Lr, 0.18, 0.06, mid, yFaitage - hd * Math.tan(pente) - 0.05, s * (hd + 0.02));
    }
    boiteW(w, 'toit', 'tole', Lr, 0.12, 0.34, mid, yFaitage + 0.08, 0); // faîtage
    // Fermeture sous le toit (hauteur entre plafond de l'attique et toit)
    boiteW(w, 'toit', 'enduit', w.L + w.eG + w.eD - 2 * T, 0.25, PROF - 2 * T, mid * 0, yT + 0.12, 0);
    // Pignons triangulaires aux bouts libres
    for (const [libre, sx] of [[!w.jG, -1], [!w.jD, 1]]) {
      if (!libre) continue;
      const forme = new THREE.Shape();
      forme.moveTo(-PROF / 2, 0); forme.lineTo(PROF / 2, 0); forme.lineTo(0, yFaitage - yT); forme.closePath();
      const gg = new THREE.ExtrudeGeometry(forme, { depth: T, bevelEnabled: false });
      gg.rotateY(Math.PI / 2); gg.translate(sx * w.L / 2 - (sx > 0 ? T : 0), yT, 0);
      ajouter('toit', 'enduit', uvMonde(enAile(w, gg)));
    }
    // Fenêtres de toit et ventilations
    for (let k = 0; k < w.cols; k++) {
      const x = -w.L / 2 + k * COL + COL * 0.5;
      const v = new THREE.BoxGeometry(0.9, 0.08, 1.3);
      v.rotateX(-pente); v.translate(x, yFaitage - hd * 0.45 * Math.tan(pente) + 0.14, -hd * 0.45);
      ajouter('toit', 'vitre', uvMonde(enAile(w, v)));
      if (k % 2 === 0) boiteW(w, 'toit', 'enduit', 0.6, 1.0, 0.6, x + 3, yFaitage - 0.2, -1.2);
    }
    // Bloc invisible pour le clic (on ne vise pas à travers le toit)
    const bloc = new THREE.Mesh(new THREE.BoxGeometry(w.L + w.eG + w.eD, yFaitage - yT + 0.5, PROF + 1));
    bloc.position.set(w.cx + w.ux * mid, yT + (yFaitage - yT) / 2, w.cz + w.uz * mid); bloc.rotation.y = -w.ang; bloc.visible = false;
    groupes.toit.add(bloc); bloqueurs.push(bloc);
  }

  /* ---------- Terrain, cour, rampe du garage, piscine ---------- */
  const S = 'site', y0 = SOL;
  const RAMPE = { x1: -6, x2: 0, z1: 8.5, z2: 20.2 };
  const solMesh = (x1, x2, z1, z2) => {
    const g = new THREE.PlaneGeometry(x2 - x1, z2 - z1); g.rotateX(-Math.PI / 2); g.translate((x1 + x2) / 2, y0, (z1 + z2) / 2); uvMonde(g);
    const m = new THREE.Mesh(g, mats.herbe); m.receiveShadow = true; groupes.site.add(m); bloqueurs.push(m);
  };
  const R = 2500;
  solMesh(-R, RAMPE.x1, -R, R); solMesh(RAMPE.x2, R, -R, R);
  solMesh(RAMPE.x1, RAMPE.x2, -R, RAMPE.z1); solMesh(RAMPE.x1, RAMPE.x2, RAMPE.z2, R);
  const yTerrain = () => y0;

  // Rampe vers le parking souterrain
  {
    const L = RAMPE.z2 - RAMPE.z1, prof = 3.0, ang = Math.atan2(prof, L);
    const r = new THREE.BoxGeometry(RAMPE.x2 - RAMPE.x1, 0.2, Math.hypot(L, prof));
    r.rotateX(ang); r.translate((RAMPE.x1 + RAMPE.x2) / 2, y0 - prof / 2 - 0.1, (RAMPE.z1 + RAMPE.z2) / 2);
    ajouter(S, 'enrobe', uvMonde(r));
    for (const x of [RAMPE.x1 - 0.15, RAMPE.x2 + 0.15]) {
      boite(S, 'beton', 0.3, prof + 1.1, L, x, y0 - prof / 2 + 0.55, (RAMPE.z1 + RAMPE.z2) / 2);
      boite(S, 'tole', 0.36, 0.05, L, x, y0 + 1.12, (RAMPE.z1 + RAMPE.z2) / 2);
    }
    boite(S, 'store', 5.2, 2.5, 0.05, (RAMPE.x1 + RAMPE.x2) / 2, y0 - prof + 1.25, RAMPE.z2 - 0.02);
    boite(S, 'beton', 6.4, prof + 1.1 - 2.5, 0.3, (RAMPE.x1 + RAMPE.x2) / 2, y0 - prof + 2.5 + (prof + 1.1 - 2.5) / 2, RAMPE.z2 + 0.12);
  }

  // Allée centrale, parkings, bordures
  boite(S, 'enrobe', 98, 0.04, 6, 15, y0 + 0.02, 0);
  boite(S, 'enrobe', RAMPE.x2 - RAMPE.x1, 0.04, RAMPE.z1 - 3, (RAMPE.x1 + RAMPE.x2) / 2, y0 + 0.02, (3 + RAMPE.z1) / 2);
  boite(S, 'enrobe', 8, 0.04, 600, 68, y0 + 0.02, 0); // route d'accès
  boite(S, 'beton', 98, 0.12, 0.22, 15, y0 + 0.06, -3.1);
  boite(S, 'beton', 98, 0.12, 0.22, 15, y0 + 0.06, 3.1);
  for (const [xa, xb, zc] of [[-30, -8, -5.6], [8, 38, -5.6], [8, 46, 5.6], [-34, -10, 5.6]]) {
    boite(S, 'enrobe', xb - xa, 0.04, 5, (xa + xb) / 2, y0 + 0.025, zc);
    for (let x = xa; x <= xb + 0.01; x += 2.6) boite(S, 'ligne', 0.12, 0.012, 4.8, x, y0 + 0.05, zc);
  }

  // Jardins privatifs et terrasses du rez (côté sud de chaque aile)
  for (const w of AILES) for (let k = 0; k < w.cols; k++) {
    const x0 = -w.L / 2 + k * COL;
    boiteW(w, S, 'dalles', COL - 1.2, 0.06, 3, x0 + COL / 2, y0 + 0.03, PROF / 2 + 1.5);
    if (k > 0 || w.jG) {
      const hg = bosseler(new THREE.BoxGeometry(0.6, 1.2, 8, 2, 3, 12), 0.06, 0.9);
      hg.translate(x0, y0 + 0.6, PROF / 2 + 4.2); ajouter(S, 'haie', uvMonde(enAile(w, hg)));
    }
    // Haie de fond de jardin (avec passage)
    const hf = bosseler(new THREE.BoxGeometry(COL - 2.2, 1.1, 0.6, 12, 3, 2), 0.06, 0.9);
    hf.translate(x0 + COL / 2 - 0.8, y0 + 0.55, PROF / 2 + 8.2); ajouter(S, 'haie', uvMonde(enAile(w, hf)));
    // Chemin vers l'entrée (côté nord) pour l'immeuble sud, sur la cour
    if ('DEF'.includes(w.id) && k === 1) boiteW(w, S, 'dalles', 1.8, 0.05, 6, x0, y0 + 0.025, -PROF / 2 - 3);
    if ('ABC'.includes(w.id) && k === 1) boiteW(w, S, 'dalles', 1.8, 0.05, 9, x0, y0 + 0.025, -PROF / 2 - 4.5);
  }
  // Marquise d'entrée côté nord
  for (const w of AILES) {
    const x = -w.L / 2 + COL;
    boiteW(w, 'n0', 'beton', 3.2, 0.18, 1.8, x, 2.6, -PROF / 2 - 0.9);
    boiteW(w, 'n0', 'vitre', 1.6, 2.3, 0.06, x, 1.15, -PROF / 2 + 0.05);
  }

  // Piscine extérieure de 124 m² (8 x 15.5 m)
  {
    const px = -60, pz = 3;
    boite(S, 'dalles', 13, 0.06, 21, px, y0 + 0.03, pz);
    boite(S, 'pierre', 8.4, 0.25, 0.2, px, y0 + 0.1, pz - 7.85); boite(S, 'pierre', 8.4, 0.25, 0.2, px, y0 + 0.1, pz + 7.85);
    boite(S, 'pierre', 0.2, 0.25, 15.5, px - 4.1, y0 + 0.1, pz); boite(S, 'pierre', 0.2, 0.25, 15.5, px + 4.1, y0 + 0.1, pz);
    const eau = new THREE.PlaneGeometry(8, 15.5); eau.rotateX(-Math.PI / 2); eau.translate(px, y0 + 0.08, pz); ajouter(S, 'eau', eau);
    for (let i = 0; i < 4; i++) { // transats
      boite(S, 'toile', 0.7, 0.12, 1.9, px + 5.4, y0 + 0.35, pz - 6 + i * 2.6);
      boite(S, 'metal', 0.66, 0.3, 0.05, px + 5.4, y0 + 0.17, pz - 6 + i * 2.6 + 0.8);
    }
    // Clôture basse de la piscine
    for (const [w2, d2, x, z] of [[13, 0.05, px, pz - 10.5], [13, 0.05, px, pz + 10.5], [0.05, 21, px - 6.5, pz], [0.05, 21, px + 6.5, pz]]) boite(S, 'verre', w2, 1.1, d2, x, y0 + 0.55, z);
  }

  /* ---------- Végétation ---------- */
  function feuillu(x, z, s = 1) {
    const y = yTerrain(x, z);
    const t = new THREE.CylinderGeometry(0.13 * s, 0.24 * s, 3.4 * s, 7); t.translate(x, y + 1.7 * s, z);
    ajouter(S, 'tronc', t);
    for (let i = 0; i < 4; i++) {
      const b = new THREE.CylinderGeometry(0.04 * s, 0.1 * s, 2.2 * s, 5);
      b.translate(0, 1.1 * s, 0); b.rotateZ(0.5 + alea() * 0.3); b.rotateY(alea() * Math.PI * 2);
      b.translate(x, y + 2.9 * s, z); ajouter(S, 'tronc', b);
    }
    const nb = 16 + Math.floor(alea() * 8), m = ['feuil1', 'feuil2', 'feuil3'][Math.floor(alea() * 3)];
    for (let i = 0; i < nb; i++) {
      const r = (0.75 + alea() * 0.6) * s;
      const ang = alea() * Math.PI * 2, rad = Math.sqrt(alea()) * 2.3 * s, hy = (alea() - 0.35) * 2.6 * s;
      const g = bosseler(new THREE.IcosahedronGeometry(r, 3), 0.32, 2.2 / s);
      g.translate(x + Math.cos(ang) * rad, y + 5 * s + hy, z + Math.sin(ang) * rad);
      ajouter(S, alea() < 0.75 ? m : 'feuil3', g);
    }
  }
  function sapin(x, z, s = 1, y = yTerrain(x, z), grp = S) {
    const t = new THREE.CylinderGeometry(0.1 * s, 0.2 * s, 2 * s, 6); t.translate(x, y + 1 * s, z); ajouter(grp, 'tronc', t);
    for (let i = 0; i < 5; i++) {
      const g = bosseler(new THREE.ConeGeometry((2.2 - i * 0.38) * s, 2.6 * s, 9, 2), 0.12, 1.2);
      g.translate(x, y + (2 + i * 1.45) * s, z); ajouter(grp, 'sapin', g);
    }
  }
  const colonne = (x, z, s = 1) => {
    const g = bosseler(new THREE.SphereGeometry(1, 12, 16), 0.14, 1.8);
    g.scale(0.55 * s, 2.1 * s, 0.55 * s); g.translate(x, y0 + 2.3 * s, z); ajouter(S, 'feuil3', g);
  };
  [[-36, 12, 1.1], [-14, 13, 1.0], [16, 12.5, 1.2], [38, 13, 1.0], [-42, -7, 1.2], [54, -6, 1.1], [-70, -20, 1.3], [-74, 24, 1.2], [60, -30, 1.4], [62, 34, 1.3]]
    .forEach(([x, z, s]) => feuillu(x, z, s));
  for (let i = 0; i < 6; i++) { colonne(-67.5, -6 + i * 3, 0.9 + alea() * 0.3); }

  /* ---------- Village d'Ardon autour ---------- */
  function maison(x, z, w, d, ry, toit) {
    const y = yTerrain(x, z), hm = 6 + alea() * 3;
    const m = new THREE.BoxGeometry(w, hm, d); m.rotateY(ry); m.translate(x, y + hm / 2, z); ajouter(S, 'crepi', uvMonde(m));
    for (let e = 0; e < 2; e++) for (let i = 0; i < Math.floor(w / 3); i++) for (const s of [-1, 1]) {
      const fx = -w / 2 + 1.5 + i * 3, fy = y + 1.6 + e * 2.9;
      const f = new THREE.BoxGeometry(0.9, 1.3, 0.08); f.translate(fx, fy, s * (d / 2 + 0.02)); f.rotateY(ry); f.translate(x, 0, z); ajouter(S, 'cadre', f);
      const v = new THREE.BoxGeometry(0.42, 1.35, 0.06); v.translate(fx - 0.68, fy, s * (d / 2 + 0.05)); v.rotateY(ry); v.translate(x, 0, z); ajouter(S, 'volet', v);
    }
    for (const s of [-1, 1]) {
      const p = new THREE.BoxGeometry(w + 0.8, 0.18, d / 2 / Math.cos(0.55) + 0.6);
      p.rotateX(s * 0.55); p.translate(0, y + hm + Math.tan(0.55) * d / 4, s * d / 4);
      p.rotateY(ry); p.translate(x, 0, z);
      ajouter(S, toit, uvMonde(p));
    }
  }
  const maisons = [[-28, -52, 14, 10, 0.05], [2, -56, 12, 10, -0.08], [32, -50, 16, 11, 0.1], [-62, -46, 12, 9, 0.2], [66, -42, 12, 10, -0.15],
    [-100, 8, 12, 9, 1.5], [-96, -26, 11, 9, 1.4], [104, 6, 13, 10, 1.6], [100, 40, 12, 9, 1.5], [-34, 68, 12, 10, 0.1], [14, 72, 13, 10, -0.05],
    [58, 64, 11, 9, 0.2], [-74, 58, 12, 10, 0.3], [-58, -82, 14, 10, 0], [-12, -90, 12, 9, 0.1], [36, -86, 13, 10, -0.1], [84, -76, 12, 10, 0.2],
    [-130, -60, 12, 10, 0.3], [140, -40, 13, 10, -0.2], [-150, 40, 12, 9, 0.1], [150, 60, 12, 10, 0], [-20, 120, 14, 10, 0.15], [44, 128, 12, 10, -0.1]];
  maisons.forEach(([x, z, w, d, r], i) => maison(x, z, w, d, r, i % 3 === 0 ? 'ardoise' : 'tuiles'));

  // Vignes : plaine au sud et coteau au pied des rochers
  const vignes = (x1, x2, z1, z2, y = y0 + 0.06) => { const g = new THREE.PlaneGeometry(x2 - x1, z2 - z1); g.rotateX(-Math.PI / 2); g.translate((x1 + x2) / 2, y, (z1 + z2) / 2); uvMonde(g); ajouter(S, 'vigne', g); };
  vignes(-420, -110, 90, 420); vignes(110, 460, 100, 420); vignes(-90, 90, 160, 460);
  // Coteau en terrasses (murs de pierre) jusqu'aux rochers
  for (let i = 0; i < 9; i++) {
    const z = -120 - i * 9, y = y0 + i * 2.6;
    const g = new THREE.BoxGeometry(900, 0.9, 0.5); g.translate(0, y + 2.2, z); ajouter(S, 'murSec', uvMonde(g));
    const v = new THREE.PlaneGeometry(900, 9.4, 1, 1); v.rotateX(-Math.PI / 2 + 0.28); v.translate(0, y + 1.3, z - 4.5); uvMonde(v); ajouter(S, 'vigne', v);
  }

  /* ---------- Les rochers d'Ardon au nord, montagnes au loin ---------- */
  {
    const larg = 2600, haut = 620, sx = 220, sy = 70;
    const g = new THREE.PlaneGeometry(larg, haut, sx, sy);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), v = (p.getY(i) + haut / 2) / haut; // 0 en bas, 1 en haut
      const crete = 0.75 + 0.25 * bruit.noise(x * 0.0018, 3.1) + 0.12 * bruit.noise(x * 0.008, 7.7);
      const y = v * haut * crete;
      const recul = Math.pow(v, 1.6) * 520 + 40 * bruit.noise(x * 0.01, v * 4) + 14 * bruit.noise(x * 0.05, v * 20);
      const surplomb = 26 * Math.max(0, bruit.noise(x * 0.004, v * 2.5)) * Math.sin(v * Math.PI);
      p.setXYZ(i, x, y + y0 + 23, -205 - recul + surplomb);
    }
    g.computeVertexNormals();
    ajouter(S, 'roche', uvMonde(g));
    // Pins accrochés aux rochers
    for (let i = 0; i < 70; i++) {
      const x = (alea() - 0.5) * 1400, v = 0.05 + alea() * 0.5;
      const y = v * haut * 0.85 + y0 + 23, z = -205 - Math.pow(v, 1.6) * 520 + 8;
      sapin(x, z, 1.2 + alea() * 1.2, y - 2);
    }
  }
  // Montagnes de l'autre côté de la vallée (enneigées)
  {
    const g = new THREE.PlaneGeometry(14000, 3000, 180, 30);
    const p = g.attributes.position;
    const col = new Float32Array(p.count * 3), c = new THREE.Color();
    const roc = new THREE.Color(0x5d6a5e), neige = new THREE.Color(0xf2f5f8), foret = new THREE.Color(0x2e4430);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), v = (p.getY(i) + 1500) / 3000;
      const crete = 0.6 + 0.3 * (bruit.noise(x * 0.00022, 1.3) * 0.5 + 0.5) + 0.1 * bruit.noise(x * 0.0008, 4.2);
      const y = v * 3300 * crete + 60 * bruit.noise(x * 0.002, v * 6) * v;
      p.setXYZ(i, x, y - 30, 4200 + Math.pow(v, 1.4) * 1800);
      const alt = y;
      if (alt > 1750 + 200 * bruit.noise(x * 0.003, 2)) c.copy(neige);
      else if (alt > 1000) c.copy(roc).lerp(neige, Math.max(0, (alt - 1450) / 400));
      else c.copy(foret).lerp(roc, alt / 900);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    ajouter(S, 'montagne', g);
  }

  /* ---------- Éclairage extérieur, voitures ---------- */
  for (const x of [-26, -6, 14, 34, 54]) {
    boite(S, 'metal', 0.1, 4.2, 0.1, x, y0 + 2.1, 3.6);
    boite(S, 'metal', 0.5, 0.1, 0.22, x, y0 + 4.2, 3.6);
  }
  const voitures = new THREE.Group(); groupes.site.add(voitures);
  const peinture = (c) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.6, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08 });
  const vitreAuto = new THREE.MeshPhysicalMaterial({ color: 0x11161b, metalness: 0.3, roughness: 0.05, envMapIntensity: 1.5 });
  const pneu = M({ color: 0x18191b, roughness: 0.85 });
  const jante = M({ color: 0xb8bcc0, metalness: 0.9, roughness: 0.3 });
  function voiture(x, z, rot, couleur) {
    const v = new THREE.Group();
    const corps = new THREE.Mesh(new RoundedBoxGeometry(4.5, 0.78, 1.86, 4, 0.28), peinture(couleur)); corps.position.y = 0.72;
    const cab = new THREE.Mesh(new RoundedBoxGeometry(2.55, 0.66, 1.66, 4, 0.3), vitreAuto); cab.position.set(-0.25, 1.33, 0);
    const toitA = new THREE.Mesh(new RoundedBoxGeometry(2.1, 0.08, 1.6, 2, 0.04), corps.material); toitA.position.set(-0.3, 1.66, 0);
    v.add(corps, cab, toitA);
    for (const [px, pz] of [[1.45, 0.86], [1.45, -0.86], [-1.4, 0.86], [-1.4, -0.86]]) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 20), pneu); r.rotation.x = Math.PI / 2; r.position.set(px, 0.36, pz);
      const j = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.27, 16), jante); j.rotation.x = Math.PI / 2; j.position.copy(r.position);
      v.add(r, j);
    }
    v.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    v.position.set(x, y0 + 0.02, z); v.rotation.y = rot;
    voitures.add(v);
  }
  voiture(-24.3, -5.6, Math.PI / 2, 0xf2f2f0);
  voiture(-16.5, -5.6, -Math.PI / 2, 0x1d2a44);
  voiture(14.2, -5.6, Math.PI / 2, 0x6b6e72);
  voiture(22, -5.6, Math.PI / 2, 0x8a1c1c);
  voiture(19.4, 5.6, -Math.PI / 2, 0x111214);
  voiture(32.4, 5.6, -Math.PI / 2, 0xd9d9d6);
  voiture(68, 40, 0, 0x2b4a6b);

  /* ---------- Assemblage : une seule géométrie par groupe et par matériau ---------- */
  for (const [cle, liste] of seaux) {
    const [g, m] = cle.split('|');
    const geo = mergeGeometries(liste, false);
    const mesh = new THREE.Mesh(geo, mats[m]);
    mesh.castShadow = !sansOmbre.has(m) && m !== 'roche';
    mesh.receiveShadow = true;
    if (m === 'verre') mesh.renderOrder = 1;
    if (m === 'montagne' || m === 'roche') mesh.userData.sansAO = true;
    groupes[g].add(mesh);
  }
  seaux.clear();

  /* ---------- Ciel, soleil et reflets ---------- */
  const soleilDir = new THREE.Vector3(-0.86, 0.33, 0.38).normalize();
  const ciel = new Sky();
  ciel.scale.setScalar(9000);
  ciel.userData.sansAO = true;
  const u = ciel.material.uniforms;
  u.turbidity.value = 3; u.rayleigh.value = 1.8; u.mieCoefficient.value = 0.004; u.mieDirectionalG.value = 0.85;
  u.sunPosition.value.copy(soleilDir);
  scene.add(ciel);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const cielEnv = new Sky(); cielEnv.scale.setScalar(50);
  Object.keys(u).forEach((k) => { cielEnv.material.uniforms[k].value = u[k].value; });
  const sEnv = new THREE.Scene(); sEnv.add(cielEnv);
  let envCible = pmrem.fromScene(sEnv, 0.02, 0.1, 100);
  scene.environment = envCible.texture;
  scene.fog = new THREE.Fog(0xc8d3dc, 260, 7000);

  for (const [nom, m] of Object.entries(mats)) if (!['vitre', 'verre', 'sombre', 'tole', 'metal', 'eau'].includes(nom)) m.envMapIntensity = 0.42;
  const soleil = new THREE.DirectionalLight(0xffdcae, 5.6);
  soleil.target.position.set(0, 0, 0);
  soleil.position.copy(soleilDir).multiplyScalar(160);
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(mobile ? 2048 : 4096, mobile ? 2048 : 4096);
  Object.assign(soleil.shadow.camera, { left: -85, right: 85, top: 85, bottom: -85, near: 20, far: 380 });
  soleil.shadow.bias = -0.00025;
  soleil.shadow.normalBias = 0.04;
  scene.add(soleil, soleil.target);
  const hemi = new THREE.HemisphereLight(0xc9d9ee, 0x5e5a40, 0.25);
  scene.add(hemi);

  const chaud = new THREE.Color(0xff9a52), clair = new THREE.Color(0xfff2e0), base = new THREE.Color(0xffdcae);
  const lisse = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  function reglerSoleil(dir, reflets = true) {
    const y = dir.y;
    u.sunPosition.value.copy(dir);
    soleil.position.copy(soleil.target.position).addScaledVector(dir, 160);
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

  return { niveaux: [groupes.n0, groupes.n1, groupes.n2], toit: groupes.toit, bloqueurs, reglerSoleil };
}
