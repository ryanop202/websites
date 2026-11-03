// Décor autour du produit : maison complète, allée, terrasse, jardin (haies, arbres, massifs, lavandes, bornes),
// arbres lointains dans la brume. Contexte seulement : rien de tout ça n'entre dans le prix.
// Coordonnées « monde » : le coin fixe du carport (arrière gauche) est en (X0, Z0), l'entrée vers +z.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Hasard reproductible : le jardin ne « saute » pas à chaque réglage
function alea(graine) {
  let a = graine >>> 0;
  return (min = 0, max = 1) => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return min + (((t ^ (t >>> 14)) >>> 0) / 4294967296) * (max - min);
  };
}

// Fusionne des géométries (déjà placées) en une seule : une pièce = un seul appel de dessin
function fusionner(liste) {
  const parties = liste.map(({ geo, couleur }) => {
    const g = geo.index ? geo.toNonIndexed() : geo;
    const n = g.attributes.position.count;
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n * 2), 2));
    if (!g.attributes.color) {
      const c = new THREE.Color(couleur ?? '#ffffff');
      const tab = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) tab.set([c.r, c.g, c.b], i * 3);
      g.setAttribute('color', new THREE.Float32BufferAttribute(tab, 3));
    }
    return g;
  });
  const total = parties.reduce((s, g) => s + g.attributes.position.count, 0);
  const sortie = new THREE.BufferGeometry();
  for (const [nom, taille] of [['position', 3], ['normal', 3], ['uv', 2], ['color', 3]]) {
    const tab = new Float32Array(total * taille);
    let o = 0;
    for (const g of parties) {
      tab.set(g.attributes[nom].array, o);
      o += g.attributes[nom].array.length;
    }
    sortie.setAttribute(nom, new THREE.Float32BufferAttribute(tab, taille));
  }
  return sortie;
}

// Regroupe toutes les pièces d'un groupe par matériau (une maison = une dizaine d'appels de dessin au lieu de 200)
function cuire(groupe) {
  groupe.updateMatrixWorld(true);
  const inverse = groupe.matrixWorld.clone().invert();
  const parMat = new Map();
  groupe.traverse((o) => {
    if (!o.isMesh) return;
    const geo = o.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, o.matrixWorld));
    if (!parMat.has(o.material)) parMat.set(o.material, []);
    parMat.get(o.material).push({ geo, couleur: '#ffffff' });
  });
  const cuit = new THREE.Group();
  for (const [mat, liste] of parMat) {
    const m = new THREE.Mesh(fusionner(liste), mat);
    m.castShadow = true;
    m.receiveShadow = true;
    m.userData.partage = true;
    cuit.add(m);
  }
  return cuit;
}

export function creerDecor({ textureCanvas, texPaves, matBordure, petit, X0, Z0, terrasse = false }) {
  const racine = new THREE.Group();
  const dyn = new THREE.Group(); // reconstruit à chaque réglage
  racine.add(dyn);
  const detail = petit ? 1 : 2;
  const Z_ROUTE = Z0 + 18.5; // limite avant de la parcelle (l'allée va jusque-là)

  // ---------- Matériaux ----------
  const texCrepi = textureCanvas(256, 256, (g, l, h) => {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, l, h);
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = `rgba(0,0,0,${0.02 + Math.random() * 0.05})`;
      g.fillRect(Math.random() * l, Math.random() * h, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5);
    }
  });
  texCrepi.repeat.set(5, 3);
  const matCrepi = new THREE.MeshStandardMaterial({ color: '#EADFC9', map: texCrepi, bumpMap: texCrepi, bumpScale: 1.2, roughness: 0.95 });
  const texCrepiP = texCrepi.clone();
  texCrepiP.repeat.set(0.45, 0.45);
  const matCrepiPignon = new THREE.MeshStandardMaterial({ color: '#EADFC9', map: texCrepiP, bumpMap: texCrepiP, bumpScale: 1.2, roughness: 0.95 });

  // Socle en pierre (moellons gris foncés)
  const texSocle = textureCanvas(512, 128, (g, l, h) => {
    g.fillStyle = '#3E4044';
    g.fillRect(0, 0, l, h);
    const rangs = 3;
    const rh = h / rangs;
    for (let r = 0; r < rangs; r++) {
      let x = -Math.random() * 40;
      while (x < l) {
        const lp = 36 + Math.random() * 40;
        const v = Math.random() * 26 - 13;
        g.fillStyle = `rgb(${96 + v},${99 + v},${104 + v})`;
        g.fillRect(x + 2, r * rh + 2, lp - 4, rh - 4);
        x += lp;
      }
    }
  });
  texSocle.repeat.set(4, 1);
  const matSocle = new THREE.MeshStandardMaterial({ color: '#8A909A', map: texSocle, bumpMap: texSocle, bumpScale: 1.5, roughness: 0.9 });
  const matCordon = new THREE.MeshStandardMaterial({ color: '#7F8388', roughness: 0.7 });

  // Ardoises (rangs parallèles au faîte)
  const texArdoise = textureCanvas(512, 512, (g, l, h) => {
    const rangs = 16;
    const rh = h / rangs;
    const pl = l / 10;
    for (let r = 0; r < rangs; r++) {
      const dec = (r % 2) * pl / 2;
      for (let c = -1; c <= 10; c++) {
        const v = Math.random() * 16 - 8;
        const d = g.createLinearGradient(0, r * rh, 0, (r + 1) * rh);
        d.addColorStop(0, `rgb(${66 + v},${70 + v},${78 + v})`);
        d.addColorStop(1, `rgb(${50 + v},${53 + v},${60 + v})`);
        g.fillStyle = d;
        g.fillRect(c * pl + dec + 1, r * rh, pl - 2, rh - 1.5);
      }
      g.fillStyle = 'rgba(15,16,20,0.55)';
      g.fillRect(0, (r + 1) * rh - 1.5, l, 1.5);
    }
  });
  const matArdoise = new THREE.MeshStandardMaterial({ color: '#7A808C', map: texArdoise, bumpMap: texArdoise, bumpScale: 1.2, roughness: 0.75, envMapIntensity: 0.6 });
  const matRive = new THREE.MeshStandardMaterial({ color: '#2F3337', roughness: 0.6 });
  const matZinc = new THREE.MeshStandardMaterial({ color: '#7D8287', roughness: 0.35, metalness: 0.7, side: THREE.DoubleSide });
  const matMenuiserie = new THREE.MeshStandardMaterial({ color: '#2C3034', roughness: 0.45 });
  const matVitre = new THREE.MeshStandardMaterial({ color: '#1C2127', roughness: 0.06, metalness: 0.5, envMapIntensity: 1.0 });
  // Vitres « allumées » la nuit (même aspect de jour)
  const matVitreLum = matVitre.clone();
  matVitreLum.emissive = new THREE.Color('#FFC27A');
  matVitreLum.emissiveIntensity = 0;
  const matAppui = new THREE.MeshStandardMaterial({ color: '#A9A59C', roughness: 0.8 });
  const matPorte = new THREE.MeshStandardMaterial({ color: '#8A4A2A', roughness: 0.55 });
  const matMarquise = new THREE.MeshStandardMaterial({ color: '#9FB0B8', roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.55 });
  const matPot = new THREE.MeshStandardMaterial({ color: '#9C4A30', roughness: 0.85 });

  // Dalles claires de la terrasse
  const texDalles = textureCanvas(512, 512, (g, l, h) => {
    g.fillStyle = '#B8B1A3';
    g.fillRect(0, 0, l, h);
    const n = 5;
    const c = l / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n * 2; j++) {
        const v = Math.random() * 14 - 7;
        g.fillStyle = `rgb(${222 + v},${215 + v},${200 + v})`;
        g.fillRect(i * c + 1.5 + (j % 2) * c / 2, j * c / 2 + 1.5, c - 3, c / 2 - 3);
        g.fillRect(i * c + 1.5 + (j % 2) * c / 2 - l, j * c / 2 + 1.5, c - 3, c / 2 - 3);
      }
    }
  });
  const matDalles = new THREE.MeshStandardMaterial({ map: texDalles, bumpMap: texDalles, bumpScale: 0.8, roughness: 0.85 });
  const matAllee = new THREE.MeshStandardMaterial({ map: texPaves, bumpMap: texPaves, bumpScale: 1.2, roughness: 0.92 });

  const matVegetal = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, envMapIntensity: 0.35 });
  const texFeuilles = textureCanvas(256, 256, (g, l, h) => {
    g.fillStyle = '#b8b8b8';
    g.fillRect(0, 0, l, h);
    for (let i = 0; i < 2600; i++) {
      const v = 120 + Math.random() * 135;
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.beginPath();
      g.ellipse(Math.random() * l, Math.random() * h, 2 + Math.random() * 4, 1.5 + Math.random() * 2.5, Math.random() * 3, 0, Math.PI * 2);
      g.fill();
    }
  });
  const matHaie = new THREE.MeshStandardMaterial({ color: '#5E8A3C', map: texFeuilles, bumpMap: texFeuilles, bumpScale: 2.5, roughness: 0.95, envMapIntensity: 0.35 });
  const matPaillis = new THREE.MeshStandardMaterial({ color: '#4A3A2D', roughness: 1 });
  const matLavande = new THREE.MeshStandardMaterial({ color: '#8C7BC4', roughness: 0.9 });
  const matTouffe = new THREE.MeshStandardMaterial({ color: '#6E8A5A', roughness: 0.95 });
  const matBorne = new THREE.MeshStandardMaterial({ color: '#1F2124', roughness: 0.5, metalness: 0.4 });
  const matBorneLum = new THREE.MeshStandardMaterial({ color: '#F4EEE2', emissive: '#FFD49A', emissiveIntensity: 0 });

  // ---------- Végétation (formes arrondies, couleurs par sommet) ----------
  const VERTS = ['#4E7A34', '#5C8A3A', '#466F2E', '#69944A'];

  function boules(rng, centres, teinte, sombreBas = 0.78) {
    const parts = [];
    let yMin = Infinity;
    let yMax = -Infinity;
    for (const [x, y, z, r] of centres) { yMin = Math.min(yMin, y - r); yMax = Math.max(yMax, y + r); }
    const base = new THREE.Color(teinte);
    for (const [x, y, z, r] of centres) {
      const geo = new THREE.IcosahedronGeometry(r, detail); // déjà non indexée
      const pos = geo.attributes.position;
      // Bosses : même déplacement pour les sommets qui se touchent (pas de trous)
      const bosses = new Map();
      for (let i = 0; i < pos.count; i++) {
        const cle = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
        if (!bosses.has(cle)) bosses.set(cle, 1 + rng(-0.07, 0.07));
        const k = bosses.get(cle);
        pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k * 0.92, pos.getZ(i) * k);
      }
      // Normales de sphère (rendu doux, pas de facettes)
      const nor = geo.attributes.normal;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).normalize();
        nor.setXYZ(i, v.x, v.y, v.z);
      }
      geo.translate(x, y, z);
      const nuance = rng(0.92, 1.08);
      const tab = new Float32Array(pos.count * 3);
      const c = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const t = (geo.attributes.position.getY(i) - yMin) / Math.max(0.01, yMax - yMin);
        c.copy(base).multiplyScalar(nuance * (sombreBas + (1.12 - sombreBas) * t));
        tab.set([c.r, c.g, c.b], i * 3);
      }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(tab, 3));
      parts.push({ geo });
    }
    return parts;
  }

  function geoArbre(rng, s) {
    const parts = [];
    const ht = 2.1 * s;
    const tronc = new THREE.CylinderGeometry(0.09 * s, 0.16 * s, ht, 8);
    tronc.translate(0, ht / 2, 0);
    parts.push({ geo: tronc, couleur: '#5E4130' });
    // Deux branches qui partent dans le houppier
    for (const sg of [-1, 1]) {
      const b = new THREE.CylinderGeometry(0.04 * s, 0.07 * s, 1.1 * s, 6);
      b.rotateZ(sg * 0.6);
      b.translate(sg * 0.3 * s, ht + 0.3 * s, 0);
      parts.push({ geo: b, couleur: '#5E4130' });
    }
    const centres = [];
    const n = 7 + Math.floor(rng(0, 4));
    for (let i = 0; i < n; i++) {
      const ang = rng(0, Math.PI * 2);
      const d = rng(0.2, 1.0) * s;
      centres.push([Math.cos(ang) * d, ht + 1.0 * s + rng(-0.35, 0.75) * s, Math.sin(ang) * d, rng(0.65, 1.0) * s]);
    }
    centres.push([0, ht + 1.5 * s, 0, 1.0 * s]);
    parts.push(...boules(rng, centres, VERTS[Math.floor(rng(0, VERTS.length))]));
    return fusionner(parts);
  }

  function geoBuisson(rng, s, fleurs) {
    const centres = [];
    const n = 3 + Math.floor(rng(0, 3));
    for (let i = 0; i < n; i++) {
      const r = rng(0.28, 0.45) * s;
      centres.push([rng(-0.4, 0.4) * s, r * 0.85, rng(-0.3, 0.3) * s, r]);
    }
    const parts = boules(rng, centres, '#4F7A36', 0.7);
    if (fleurs) {
      const couleurs = ['#F2EEF4', '#E8A9C9', '#CDB8EA'];
      for (let i = 0; i < 22; i++) {
        const [cx, cy, cz, r] = centres[Math.floor(rng(0, centres.length))];
        const dir = new THREE.Vector3(rng(-1, 1), rng(0.1, 1), rng(-1, 1)).normalize();
        const f = new THREE.IcosahedronGeometry(0.075 * s, 0);
        f.translate(cx + dir.x * r, cy + dir.y * r * 0.92, cz + dir.z * r);
        parts.push({ geo: f, couleur: couleurs[Math.floor(rng(0, couleurs.length))] });
      }
    }
    return fusionner(parts);
  }

  // Prototypes partagés (créés une fois)
  const rngProto = alea(7);
  const protoArbres = Array.from({ length: 4 }, (_, i) => geoArbre(rngProto, 1 + i * 0.12));
  const protoBuissons = [geoBuisson(rngProto, 1, true), geoBuisson(rngProto, 1.1, true), geoBuisson(rngProto, 0.9, false)];
  const geoLavande = new THREE.ConeGeometry(0.035, 0.3, 5);
  geoLavande.translate(0, 0.38, 0);
  const geoTouffe = new THREE.SphereGeometry(0.17, 8, 6);
  geoTouffe.scale(1, 0.75, 1);
  geoTouffe.translate(0, 0.12, 0);
  for (const geo of [...protoArbres, ...protoBuissons, geoLavande, geoTouffe]) geo.userData.partage = true;

  function poser(geo, mat, x, y, z, rotY = 0, ombre = true, parent = dyn) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.y = rotY;
    m.castShadow = ombre;
    m.receiveShadow = true;
    m.userData.partage = geo.userData.partage;
    parent.add(m);
    return m;
  }

  // ---------- Arbres lointains dans la brume (une seule fois) ----------
  {
    const rng = alea(42);
    const parts = [];
    const n = petit ? 26 : 46;
    for (let i = 0; i < n; i++) {
      const ang = rng(0, Math.PI * 2);
      const d = rng(40, 62);
      const geo = protoArbres[i % protoArbres.length].clone();
      const s = rng(1.4, 2.5);
      geo.scale(s, s * rng(0.9, 1.2), s);
      geo.rotateY(rng(0, 6));
      geo.translate(Math.cos(ang) * d, 0, Math.sin(ang) * d);
      parts.push({ geo });
    }
    // Collines douces au loin
    for (let i = 0; i < 7; i++) {
      const ang = (i / 7) * Math.PI * 2 + rng(-0.2, 0.2);
      const geo = new THREE.SphereGeometry(1, 24, 12);
      geo.scale(rng(30, 42), rng(3, 5.5), rng(16, 22));
      geo.rotateY(-ang);
      geo.translate(Math.cos(ang) * 100, -1, Math.sin(ang) * 100);
      parts.push({ geo, couleur: '#7E9A5E' });
    }
    const fond = new THREE.Mesh(fusionner(parts), matVegetal);
    fond.userData.partage = true;
    racine.add(fond);
  }

  // ---------- Maison (construite une fois, puis cuite) ----------
  // Repère de la maison : façade principale vers +z, faîte le long de x, sol à y = 0
  const LM = 12;     // longueur (façade principale)
  const PM = 9;      // profondeur (pignons)
  const HM = 5.7;    // hauteur des murs
  const PENTE = THREE.MathUtils.degToRad(40);
  const DEB = 0.4;   // débord du toit

  function construireMaison() {
    const m = new THREE.Group();
    const rng = alea(11);
    const box = (w, h, d, mat, x, y, z, parent = m) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      b.position.set(x, y, z);
      parent.add(b);
      return b;
    };

    box(LM, HM, PM, matCrepi, 0, HM / 2, 0);
    box(LM + 0.06, 0.55, PM + 0.06, matSocle, 0, 0.275, 0);
    box(LM + 0.08, 0.14, PM + 0.08, matCordon, 0, 2.95, 0);

    // Pignons : prisme triangulaire sur toute la longueur
    const monte = (PM / 2) * Math.tan(PENTE);
    const forme = new THREE.Shape([new THREE.Vector2(-PM / 2, 0), new THREE.Vector2(PM / 2, 0), new THREE.Vector2(0, monte)]);
    const pignon = new THREE.ExtrudeGeometry(forme, { depth: LM, bevelEnabled: false });
    pignon.rotateY(Math.PI / 2);
    pignon.translate(-LM / 2, HM, 0);
    m.add(new THREE.Mesh(pignon, matCrepiPignon));

    // Toit : deux pans d'ardoises, rives, faîtière, gouttières et descentes
    const longPan = (PM / 2 + DEB) / Math.cos(PENTE);
    const ep = 0.14;
    const yFaite = HM + monte;
    for (const s of [1, -1]) {
      const pan = new THREE.Group();
      const cz = s * (PM / 2 + DEB) / 2;
      const cy = yFaite - ((PM / 2 + DEB) / 2) * Math.tan(PENTE);
      pan.position.set(0, cy, cz);
      pan.rotation.x = s * PENTE;
      pan.translateY(ep / 2 + 0.02);
      m.add(pan);
      const dalle = new THREE.Mesh(new THREE.BoxGeometry(LM + 0.6, ep, longPan), matArdoise);
      const uv = dalle.geometry.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (LM + 0.6) / 2.4, uv.getY(i) * longPan / 2.4);
      pan.add(dalle);
      // Rives sombres sur les bords des pignons
      for (const sx of [-1, 1]) box(0.06, 0.22, longPan + 0.02, matRive, sx * (LM / 2 + 0.31), 0.03, 0, pan);
      // Fenêtres de toit (pan avant seulement)
      if (s === 1) {
        for (const x of [-1.9, 1.9]) {
          box(0.82, 0.08, 1.05, matMenuiserie, x, ep / 2 + 0.04, -0.5, pan);
          box(0.68, 0.02, 0.9, matVitre, x, ep / 2 + 0.085, -0.5, pan);
        }
      }
      // Gouttière demi-ronde au bas du pan
      const zEg = s * (PM / 2 + DEB);
      const yEg = yFaite - (PM / 2 + DEB) * Math.tan(PENTE);
      const gout = new THREE.CylinderGeometry(0.08, 0.08, LM + 0.6, 14, 1, true, 0, Math.PI);
      gout.rotateZ(Math.PI / 2);
      gout.rotateX(Math.PI);
      const goutM = new THREE.Mesh(gout, matZinc);
      goutM.position.set(0, yEg - 0.06, zEg + s * 0.06);
      m.add(goutM);
      for (const sx of [-1, 1]) {
        const hDesc = yEg - 0.1;
        const desc = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, hDesc, 10), matZinc);
        desc.position.set(sx * (LM / 2 - 0.25), hDesc / 2, s * (PM / 2 + 0.08));
        m.add(desc);
        // Coude vers la gouttière
        box(0.09, 0.09, DEB, matZinc, sx * (LM / 2 - 0.25), yEg - 0.12, s * (PM / 2 + DEB / 2));
      }
    }
    box(LM + 0.66, 0.16, 0.34, matRive, 0, yFaite + ep + 0.04, 0);

    // Cheminée avec deux pots
    const xCh = -3.4;
    box(0.75, 2.6, 0.62, matCrepi, xCh, yFaite - 0.4, -0.45);
    box(0.85, 0.1, 0.72, matCordon, xCh, yFaite + 0.92, -0.45);
    for (const dx of [-0.17, 0.17]) {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.38, 10), matPot);
      pot.position.set(xCh + dx, yFaite + 1.16, -0.45);
      m.add(pot);
    }

    // Ouvertures. Face : 'avant' | 'arriere' | 'droite' | 'gauche' ; u = position le long de la façade
    function ouverture(face, u, yBas, w, h, type = 'fenetre') {
      const o = new THREE.Group();
      const [x, z, rot] = {
        avant: [u, PM / 2, 0],
        arriere: [-u, -PM / 2, Math.PI],
        droite: [LM / 2, -u, Math.PI / 2],
        gauche: [-LM / 2, u, -Math.PI / 2],
      }[face];
      o.position.set(x, yBas, z);
      o.rotation.y = rot;
      m.add(o);
      const cadre = 0.07;
      // Tableau sombre (donne de la profondeur)
      box(w + 0.02, h + 0.02, 0.02, matMenuiserie, 0, h / 2, 0.01, o);
      if (type === 'porte') {
        box(w - 2 * cadre, h - cadre, 0.04, matPorte, 0, (h - cadre) / 2, 0.03, o);
        box(0.16, h * 0.55, 0.02, matVitre, w * 0.22, h * 0.5, 0.055, o);
        box(0.03, 0.3, 0.05, matCordon, -w * 0.32, h * 0.47, 0.07, o);
        // Marquise vitrée + tirants
        box(w + 0.6, 0.04, 0.85, matMarquise, 0, h + 0.28, 0.43, o);
        box(w + 0.6, 0.06, 0.05, matMenuiserie, 0, h + 0.28, 0.85, o);
        for (const sx of [-1, 1]) {
          const t = box(0.02, 0.02, 1.0, matMenuiserie, sx * (w / 2 + 0.2), h + 0.6, 0.45, o);
          t.rotation.x = -0.65;
        }
        // Marche
        box(w + 0.7, 0.16, 0.55, matAppui, 0, -yBas + 0.08, 0.28, o);
      } else {
        box(w - 2 * cadre, h - 2 * cadre, 0.02, rng() < 0.55 ? matVitreLum : matVitre, 0, h / 2, 0.035, o);
      }
      for (const [bw, bh, bx, by] of [[w, cadre, 0, cadre / 2], [w, cadre, 0, h - cadre / 2], [cadre, h, -w / 2 + cadre / 2, h / 2], [cadre, h, w / 2 - cadre / 2, h / 2]]) {
        box(bw, bh, 0.06, matMenuiserie, bx, by, 0.05, o);
      }
      // Montant central (fenêtres à deux battants, portes-fenêtres)
      if (type !== 'porte' && w > 0.8) box(0.06, h, 0.06, matMenuiserie, 0, h / 2, 0.05, o);
      if (type === 'fenetre') box(w + 0.12, 0.05, 0.14, matAppui, 0, -0.025, 0.07, o);
    }

    // Façade principale
    ouverture('avant', -4.3, 0.95, 1.2, 1.35);
    ouverture('avant', -1.5, 0.12, 1.9, 2.2, 'baie');
    ouverture('avant', 1.4, 0.16, 1.0, 2.15, 'porte');
    ouverture('avant', 4.2, 0.95, 1.2, 1.35);
    for (const u of [-4.3, -1.5, 1.4, 4.2]) ouverture('avant', u, 3.7, 1.1, 1.3);
    // Arrière
    ouverture('arriere', -4, 0.95, 1.2, 1.35);
    ouverture('arriere', 0, 0.12, 2.4, 2.2, 'baie');
    ouverture('arriere', 4, 0.95, 1.2, 1.35);
    for (const [u, w] of [[-4, 1.1], [0, 0.7], [4, 1.1]]) ouverture('arriere', u, 3.7, w, 1.3);
    // Pignons
    for (const face of ['droite', 'gauche']) {
      ouverture(face, -2, 0.95, 1.0, 1.35);
      ouverture(face, 2, 3.7, 1.0, 1.3);
      ouverture(face, 0, 6.5, 0.6, 0.85);
    }

    return cuire(m);
  }
  const maison = construireMaison();
  racine.add(maison);

  // ---------- Sols (UV en coordonnées monde : le motif ne glisse pas quand on règle) ----------
  function dalle(x1, z1, x2, z2, mat, y, tailleMotif = 2) {
    const geo = new THREE.PlaneGeometry(x2 - x1, z2 - z1);
    geo.rotateX(-Math.PI / 2);
    geo.translate((x1 + x2) / 2, y, (z1 + z2) / 2);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / tailleMotif, -pos.getZ(i) / tailleMotif);
    const m = new THREE.Mesh(geo, mat);
    m.receiveShadow = true;
    dyn.add(m);
    return m;
  }
  function bordure(x1, z1, x2, z2) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.08, x2 - x1), 0.07, Math.max(0.08, z2 - z1)), matBordure);
    b.position.set((x1 + x2) / 2, 0.035, (z1 + z2) / 2);
    b.receiveShadow = true;
    dyn.add(b);
  }
  function haie(x1, z1, x2, z2) {
    const l = Math.hypot(x2 - x1, z2 - z1);
    if (l < 0.5) return;
    const geo = new RoundedBoxGeometry(l, 1.3, 1.0, 2, 0.34);
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * l / 1.6, uv.getY(i));
    const h = poser(geo, matHaie, (x1 + x2) / 2, 0.64, (z1 + z2) / 2, -Math.atan2(z2 - z1, x2 - x1));
    h.userData.partage = false;
  }
  function massif(x, z, rx, rz, nb, rng) {
    const geo = new THREE.CylinderGeometry(1, 1, 0.05, 28);
    geo.scale(rx, 1, rz);
    const p = poser(geo, matPaillis, x, 0.025, z, 0, false);
    p.userData.partage = false;
    for (let i = 0; i < nb; i++) {
      const t = nb === 1 ? 0.5 : i / (nb - 1);
      const px = x + (t - 0.5) * 2 * rx * 0.7 + rng(-0.1, 0.1);
      const pz = z + rng(-0.25, 0.25) * rz;
      poser(protoBuissons[i % protoBuissons.length], matVegetal, px, 0.04, pz, rng(0, 6));
    }
  }
  function lavandes(x, z1, z2, rng) {
    const n = Math.max(0, Math.floor((z2 - z1) / 0.32));
    if (n === 0) return;
    const p = poser(new THREE.BoxGeometry(0.8, 0.05, z2 - z1), matPaillis, x, 0.025, (z1 + z2) / 2, 0, false);
    p.userData.partage = false;
    const brins = new THREE.InstancedMesh(geoLavande, matLavande, n * 9);
    const touffes = new THREE.InstancedMesh(geoTouffe, matTouffe, n);
    const mat4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    let k = 0;
    for (let i = 0; i < n; i++) {
      const cx = x + rng(-0.15, 0.15);
      const cz = z1 + (i + 0.5) * (z2 - z1) / n;
      touffes.setMatrixAt(i, mat4.compose(new THREE.Vector3(cx, 0, cz), q.identity(), new THREE.Vector3(1, 1, 1)));
      for (let j = 0; j < 9; j++) {
        e.set(rng(-0.35, 0.35), 0, rng(-0.35, 0.35));
        brins.setMatrixAt(k++, mat4.compose(new THREE.Vector3(cx + rng(-0.12, 0.12), 0, cz + rng(-0.12, 0.12)), q.setFromEuler(e), new THREE.Vector3(1, rng(0.8, 1.25), 1)));
      }
    }
    for (const im of [brins, touffes]) {
      im.castShadow = true;
      im.receiveShadow = true;
      im.userData.partage = true;
      dyn.add(im);
    }
  }

  // Bornes lumineuses (et leurs lumières la nuit : nombre fixe, pour ne pas recompiler les matériaux)
  const geoBorne = new THREE.CylinderGeometry(0.06, 0.07, 0.62, 12);
  geoBorne.translate(0, 0.31, 0);
  const geoTete = new THREE.CylinderGeometry(0.065, 0.065, 0.1, 12);
  geoTete.translate(0, 0.55, 0);
  geoBorne.userData.partage = geoTete.userData.partage = true;
  const lumieresBornes = petit ? [] : Array.from({ length: 4 }, () => {
    const l = new THREE.PointLight('#FFC98A', 0, 4.5, 1.6);
    racine.add(l);
    return l;
  });
  let nuit = false;
  let nbBornes = 0;
  const allumerBornes = () => lumieresBornes.forEach((l, i) => { l.intensity = nuit && i < nbBornes ? 2.2 : 0; });

  // ---------- Mise à jour selon le carport ----------
  function maj(g) {
    dyn.traverse((o) => {
      if (o.geometry && !o.userData.partage) o.geometry.dispose();
      if (o.isInstancedMesh) o.dispose();
    });
    dyn.clear();
    const rng = alea(3);
    const { W, L, adosse } = g;
    const xC1 = X0;
    const xC2 = X0 + W;

    // Maison : derrière le carport (isolé) ou carport contre sa façade longue (adossé)
    let maisonX;
    let maisonZ;
    let zArriereAllee;
    if (adosse === 'non') {
      maison.rotation.y = 0;
      maisonX = X0 - 3.0;
      maisonZ = Z0 - 3.2 - PM / 2;
      zArriereAllee = Z0 - 3.2;
    } else {
      const s = adosse === 'gauche' ? -1 : 1;
      // Terrasse (pergola, véranda) : contre la façade arrière, centré sur la grande baie vitrée (pas devant la porte d'entrée)
      maison.rotation.y = -s * Math.PI / 2 + (terrasse ? Math.PI : 0);
      maisonX = (s < 0 ? xC1 : xC2) + s * PM / 2;
      maisonZ = terrasse ? Z0 + L / 2 : Z0 - 0.8 + LM / 2;
      zArriereAllee = Z0 - 0.8;
    }
    maison.position.set(maisonX, 0, maisonZ);

    // Allée pavée du fond jusqu'à la rue
    // (terrasse : grandes dalles claires autour du produit, puis un chemin étroit vers la rue)
    let xA1 = adosse === 'gauche' ? xC1 : xC1 - (adosse === 'droite' ? 2.2 : 0.6);
    let xA2 = adosse === 'droite' ? xC2 : xC2 + 2.2;
    let zDebut = Z0 + L + 1.2;
    if (terrasse) {
      const zFinT = Z0 + L + 2.4;
      dalle(xA1, zArriereAllee, xA2, zFinT, matDalles, 0.03, 3);
      if (adosse !== 'gauche') bordure(xA1 - 0.08, zArriereAllee, xA1, zFinT + 0.08);
      if (adosse !== 'droite') bordure(xA2, zArriereAllee, xA2 + 0.08, zFinT + 0.08);
      bordure(xA1, zFinT, xA2, zFinT + 0.08);
      // Chemin vers la rue, côté libre (à l'opposé de la maison)
      const sC = adosse === 'droite' ? -1 : 1;
      const xBord = sC > 0 ? xA2 : xA1;
      xA1 = sC > 0 ? xBord - 1.3 : xBord;
      xA2 = sC > 0 ? xBord : xBord + 1.3;
      dalle(xA1, zFinT + 0.08, xA2, Z_ROUTE, matAllee, 0.025);
      bordure(xA1 - 0.08, zFinT + 0.08, xA1, Z_ROUTE);
      bordure(xA2, zFinT + 0.08, xA2 + 0.08, Z_ROUTE);
      zDebut = zFinT + 1.0;
    } else {
      dalle(xA1, zArriereAllee, xA2, Z_ROUTE, matAllee, 0.025);
      if (adosse !== 'gauche') bordure(xA1 - 0.08, zArriereAllee, xA1, Z_ROUTE);
      if (adosse !== 'droite') bordure(xA2, zArriereAllee, xA2 + 0.08, Z_ROUTE);
    }

    // Côté libre de l'allée (lavandes + bornes) : à l'opposé de la maison
    const sLibre = adosse === 'droite' ? -1 : 1;
    const xLibre = sLibre > 0 ? xA2 : xA1;
    lavandes(xLibre + sLibre * 0.55, zDebut, Z_ROUTE - 1.2, rng);
    const bornes = [];
    for (let z = zDebut + 0.4; z < Z_ROUTE - 1 && bornes.length < 4; z += 3.4) bornes.push([xLibre + sLibre * 0.2, z]);
    // Deux bornes près de la maison
    if (adosse === 'non') bornes.push([X0 - 9.8, Z0 - 2.6], [X0 - 1.2, Z0 - 2.6]);
    bornes.forEach(([x, z], i) => {
      poser(geoBorne, matBorne, x, 0, z);
      poser(geoTete, matBorneLum, x, 0, z, 0, false);
      if (lumieresBornes[i]) lumieresBornes[i].position.set(x, 0.75, z);
    });
    nbBornes = bornes.length;
    allumerBornes();

    // Terrasse devant la maison (isolé) et massifs fleuris
    if (adosse === 'non') {
      const xT1 = maisonX - LM / 2 + 0.2;
      // (terrasse : la grande terrasse dallée est déjà dessinée plus haut)
      if (!terrasse) {
        dalle(xT1, zArriereAllee, xA1, zArriereAllee + 2.8, matDalles, 0.03, 3);
        bordure(xT1, zArriereAllee + 2.8, xA1, zArriereAllee + 2.88);
      }
      massif(xT1 + 1.5, zArriereAllee + 3.6, 1.4, 0.55, 3, rng);
      massif(xT1 + 5.2, zArriereAllee + 3.6, 1.2, 0.5, 2, rng);
    } else {
      // Massifs devant le pignon côté rue
      const zP = maisonZ + LM / 2 + 1.0;
      const s = adosse === 'gauche' ? -1 : 1;
      const x0 = maisonX - s * PM / 2;
      massif(x0 + s * 2.3, zP, 1.4, 0.55, 3, rng);
      massif(x0 + s * 6.4, zP, 1.2, 0.5, 2, rng);
    }

    // Arbres (positions choisies hors de la maison et de l'allée, pour chaque implantation)
    const arbres = {
      non: [[-13, 3, 1.1], [-12.8, -14, 1.3], [13.5, -6, 1.2], [14, 8, 1.0], [-6, 12, 0.9], [4, -16.5, 1.2]],
      gauche: [[-13, -8, 1.2], [-8, 12.5, 0.9], [13.5, -6, 1.2], [14, 8, 1.0], [4, -14, 1.2], [-14.5, 4, 1.1]],
      droite: [[-15, 9, 1.0], [-12, -4, 1.2], [-6, -12, 1.1], [5, -12, 1.2], [16.5, -10, 1.2], [12, 13, 0.9]],
    }[adosse];
    // Axe de la vue 3/4 (même direction que la caméra d'app.js) : rien de haut entre la caméra et le carport.
    // Un arbre dans ce couloir est tourné autour du carport vers le côté libre, à la même distance.
    const cote = adosse === 'droite' ? -1 : 1;
    const cx = X0 + W / 2;
    const cz = Z0 + L / 2;
    const aCam = Math.atan2(0.72 * cote, 0.85);
    const horsCouloir = (x, z) => {
      const d = Math.hypot(x - cx, z - cz);
      let ecart = Math.atan2(x - cx, z - cz) - aCam;
      ecart = Math.atan2(Math.sin(ecart), Math.cos(ecart));
      if (Math.abs(ecart) > 0.75) return [x, z];
      const a = aCam + cote * 0.85;
      const nx = cx + Math.sin(a) * d;
      const nz = cz + Math.cos(a) * d;
      return [Math.max(-17.5, Math.min(17.5, nx)), Math.max(-18, Math.min(Z_ROUTE - 1, nz))];
    };
    arbres.forEach(([x0, z0, s], i) => {
      const [x, z] = horsCouloir(x0, z0);
      const a = poser(protoArbres[i % protoArbres.length], matVegetal, x, 0, z, rng(0, 6));
      a.scale.setScalar(s);
    });
    // Quelques buissons isolés dans la pelouse
    // (côté caméra laissé dégagé : la vue 3/4 se fait du côté libre)
    const buissons = adosse === 'droite' ? [[-15.5, -10], [-16, 4]] : [[-10, 8], [11, 2], [-15.5, -10]];
    for (const [x0, z0] of buissons) {
      const [x, z] = horsCouloir(x0, z0);
      poser(protoBuissons[2], matVegetal, x, 0, z, rng(0, 6)).scale.setScalar(1.3);
    }

    // Haies autour de la parcelle (ouverte devant l'allée)
    const B = 19.5;
    const zFond = -20;
    const zAvant = Z_ROUTE + 0.6;
    haie(-B, zFond, B, zFond);
    haie(-B, zFond, -B, zAvant);
    haie(B, zFond, B, zAvant);
    haie(-B, zAvant, xA1 - 0.6, zAvant);
    haie(xA2 + 0.6, zAvant, B, zAvant);
  }

  function ambiance(estNuit) {
    nuit = estNuit;
    matVitreLum.emissiveIntensity = nuit ? 1.8 : 0;
    matBorneLum.emissiveIntensity = nuit ? 3 : 0;
    allumerBornes();
  }

  return { groupe: racine, maj, ambiance, hauteurMaison: HM + (PM / 2) * Math.tan(PENTE) };
}
