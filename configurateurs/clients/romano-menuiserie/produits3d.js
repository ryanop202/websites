// Modèles 3D dédiés : véranda alu et pergola bioclimatique (03.11.2026).
// Construits pièce par pièce comme les vrais produits : profils alu, chéneau, chevrons à capot, verre entre les chevrons,
// baies coulissantes, lames orientables, stores screen. Le reste de la scène (maison, jardin, cotes, prix) vient d'app.js.
// Faits par Wibzo : on reprend les FONCTIONS d'autres configurateurs, jamais leur code, leurs modèles ou leur design.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function creerModeles(ctx) {
  const { state, CONFIG, Y_SOL, groupe, texVeinage, ajouter } = ctx;

  // ---------- Matériaux (créés une fois) ----------
  // Alu thermolaqué : satiné, légèrement métallique. La finition « bois » (veinage) est appliquée à la demande.
  const matStruct = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.3, envMapIntensity: 0.9 });
  const matJoint = new THREE.MeshStandardMaterial({ color: '#141516', roughness: 0.6 });
  const verre = (couleur, opacite) => new THREE.MeshPhysicalMaterial({
    color: couleur, roughness: 0.03, metalness: 0, transparent: true, opacity: opacite, envMapIntensity: 2.2,
    depthWrite: false, side: THREE.DoubleSide, clearcoat: 1, clearcoatRoughness: 0.03,
  });
  const matVerreToit = verre('#9FBAC0', 0.4);
  const matVerreParoi = verre('#AFC7CC', 0.28);
  const matVerreTeinte = verre('#6F7F86', 0.5);
  const matPolyClair = verre('#D6E6EA', 0.42);
  const matPolyOpale = new THREE.MeshStandardMaterial({ color: '#F1F0EB', roughness: 0.35, transparent: true, opacity: 0.86, depthWrite: false, side: THREE.DoubleSide });
  const matPanneau = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.35, envMapIntensity: 0.8 });
  const matToile = new THREE.MeshStandardMaterial({ color: '#E7DFCD', roughness: 0.95, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
  // Toile screen micro-perforée : on devine le jardin à travers
  const texScreen = ctx.textureCanvas(64, 64, (g, l, h) => {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, l, h);
    g.fillStyle = 'rgba(0,0,0,0.18)';
    for (let y = 0; y < h; y += 4) for (let x = (y / 4) % 2 * 2; x < l; x += 4) g.fillRect(x, y, 1.5, 1.5);
  });
  const matScreen = new THREE.MeshStandardMaterial({
    map: texScreen, roughness: 0.95, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false,
  });
  const matLed = ctx.matLed;
  const matRadiant = new THREE.MeshStandardMaterial({ color: '#2B2C2E', roughness: 0.45, metalness: 0.5 });
  const matGrille = new THREE.MeshStandardMaterial({ color: '#5A2A18', emissive: '#FF5A1E', emissiveIntensity: 0.7, roughness: 0.6 });
  // Mobilier (pour l'échelle, hors prix)
  const matPlateau = new THREE.MeshStandardMaterial({ color: '#C7A57A', map: texVeinage, roughness: 0.6 });
  const matPiedMeuble = new THREE.MeshStandardMaterial({ color: '#2A2C2F', roughness: 0.4, metalness: 0.6 });
  const matAssise = new THREE.MeshStandardMaterial({ color: '#D9D2C4', roughness: 0.92 });

  // Couleur / finition de la structure selon le choix « coloris »
  function majStructure() {
    const b = CONFIG.bois[state.bois];
    const veinage = Boolean(b.veinage);
    if (veinage !== Boolean(matStruct.map)) {
      matStruct.map = veinage ? texVeinage : null;
      matStruct.bumpMap = veinage ? texVeinage : null;
      matStruct.bumpScale = 0.3;
      matStruct.needsUpdate = true;
    }
    matStruct.color.set(b.couleur);
    matStruct.roughness = veinage ? 0.62 : 0.42;
    matStruct.metalness = veinage ? 0.05 : 0.3;
  }

  // ---------- Aides ----------
  const boite = (w, h, d, mat, x, y, z, ombre = true, parent = groupe) =>
    ajouter(new THREE.BoxGeometry(w, h, d), mat, x, y, z, ombre, parent);
  const profil = (w, h, d, mat, x, y, z, ombre = true, parent = groupe) => {
    const r = Math.min(0.008, Math.min(w, h, d) / 2 - 0.001);
    return ajouter(new RoundedBoxGeometry(w, h, d, 2, r), mat, x, y, z, ombre, parent);
  };
  // Repère d'un mur entre A et B (au sol) : z local de A vers B, x local = normale
  function repere(ax, az, bx, bz) {
    const grp = new THREE.Group();
    grp.position.set((ax + bx) / 2, 0, (az + bz) / 2);
    grp.rotation.y = Math.atan2(bx - ax, bz - az);
    groupe.add(grp);
    return { grp, long: Math.hypot(bx - ax, bz - az) };
  }
  // Positions régulières entre a et b, portée maximale « portee »
  function repartir(a, b, portee) {
    const n = Math.max(1, Math.ceil((b - a) / portee - 1e-6));
    return Array.from({ length: n + 1 }, (_, i) => a + (i * (b - a)) / n);
  }

  // Baie coulissante entre z1 et z2 (plan x = 0 du parent) : vantaux sur 2 rails qui se recouvrent.
  // « budget » = nombre de vantaux à ouvrir ; renvoie le nombre ouvert et le maximum possible.
  function baies(parent, z1, z2, yBas, yHaut, budget, matV = matVerreParoi) {
    const long = z2 - z1;
    if (long < 0.5) return { ouverts: 0, max: 0 };
    const n = Math.max(2, Math.round(long / 1.15));
    const rec = 0.05;
    const wl = (long + (n - 1) * rec) / n;
    const zc = (z1 + z2) / 2;
    // Rail bas (seuil plat) et rail haut
    profil(0.1, 0.03, long, matStruct, 0, yBas + 0.015, zc, true, parent);
    profil(0.1, 0.055, long, matStruct, 0, yHaut - 0.0275, zc, true, parent);
    const yb = yBas + 0.03;
    const hl = yHaut - 0.055 - yb;
    let ouverts = 0;
    for (let i = 0; i < n; i++) {
      const mobile = i % 2 === 1;
      let z = z1 + wl / 2 + i * (wl - rec);
      if (mobile && ouverts < budget) {
        z -= wl - rec - 0.04; // glisse derrière le vantail voisin
        ouverts++;
      }
      const x = mobile ? 0.024 : -0.024;
      const v = new THREE.Group();
      v.position.set(x, 0, z);
      parent.add(v);
      // Cadre : montants fins, traverse basse plus haute
      for (const s of [-1, 1]) profil(0.04, hl, 0.05, matStruct, 0, yb + hl / 2, s * (wl / 2 - 0.025), true, v);
      profil(0.04, 0.075, wl - 0.1, matStruct, 0, yb + 0.0375, 0, true, v);
      profil(0.04, 0.05, wl - 0.1, matStruct, 0, yb + hl - 0.025, 0, true, v);
      const vitre = boite(0.012, hl - 0.125, wl - 0.1, matV, 0, yb + 0.075 + (hl - 0.125) / 2, 0, false, v);
      vitre.renderOrder = 2;
      // Poignée sur le montant de rencontre des vantaux mobiles
      if (mobile) profil(0.025, 0.24, 0.02, matJoint, 0.03, yb + hl * 0.48, -wl / 2 + 0.06, true, v);
    }
    return { ouverts, max: Math.floor(n / 2) };
  }

  // Mobilier de terrasse (échelle) : table ronde + 4 chaises
  function mobilier(cx, cz, dy = 0) {
    const m = new THREE.Group();
    m.position.set(cx, dy, cz);
    groupe.add(m);
    ajouter(new THREE.CylinderGeometry(0.5, 0.5, 0.03, 40), matPlateau, 0, Y_SOL + 0.745, 0, true, m);
    ajouter(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 12), matPiedMeuble, 0, Y_SOL + 0.37, 0, true, m);
    ajouter(new THREE.CylinderGeometry(0.24, 0.26, 0.02, 30), matPiedMeuble, 0, Y_SOL + 0.01, 0, true, m);
    for (let k = 0; k < 4; k++) {
      const ang = (k * Math.PI) / 2 + Math.PI / 4;
      const c = new THREE.Group();
      c.position.set(Math.cos(ang) * 0.74, 0, Math.sin(ang) * 0.74);
      c.rotation.y = Math.atan2(-Math.cos(ang), -Math.sin(ang)); // face à la table
      m.add(c);
      ajouter(new RoundedBoxGeometry(0.44, 0.045, 0.43, 2, 0.015), matAssise, 0, Y_SOL + 0.45, 0, true, c);
      const dos = ajouter(new RoundedBoxGeometry(0.44, 0.36, 0.035, 2, 0.015), matAssise, 0, Y_SOL + 0.66, -0.21, true, c);
      dos.rotation.x = -0.12;
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          ajouter(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 8), matPiedMeuble, sx * 0.19, Y_SOL + 0.225, sz * 0.18, true, c);
        }
      }
    }
  }

  // ======================================================================
  // VÉRANDA ALU : toit vitré sur chevrons, chéneau côté jardin, baies coulissantes, pignons vitrés
  // ======================================================================
  function veranda(g) {
    majStructure();
    const { W, L, H } = g;
    const hs = g.maison(1) ? 1 : -1; // côté maison
    const fs = -hs;                    // côté jardin
    const a = g.a;
    const t = Math.tan(a);
    const cosA = Math.cos(a);
    const rot = -fs * a;
    const HC = 0.21;  // hauteur du chéneau
    const EC = 0.17;  // largeur du chéneau
    const RH = 0.105; // hauteur des chevrons sous le verre
    const PT = 0.1;   // section des poteaux
    const yL = Y_SOL + H + HC;              // dessus du chéneau = appui des chevrons
    const xF = fs * (W / 2);                // nu extérieur côté jardin
    const xM = hs * (W / 2);                // façade de la maison
    const yTop = (x) => yL + (W / 2 - fs * x) * t; // dessus des chevrons (sous le verre)
    const yU = (x) => yTop(x) - RH / cosA;         // dessous des chevrons
    const couv = state.couverture;
    const EG = couv === 'panneau' ? 0.055 : 0.024;

    // Chéneau : profil plein, bas arrondi, petit larmier en haut (il porte les chevrons et récupère l'eau)
    const forme = new THREE.Shape();
    forme.moveTo(0, 0);
    forme.lineTo(EC - 0.05, 0);
    forme.quadraticCurveTo(EC, 0, EC, 0.05);
    forme.lineTo(EC, HC - 0.035);
    forme.lineTo(EC + 0.014, HC - 0.035);
    forme.lineTo(EC + 0.014, HC);
    forme.lineTo(0, HC);
    forme.closePath();
    const geoC = new THREE.ExtrudeGeometry(forme, { depth: L + 0.03, bevelEnabled: false, curveSegments: 6 });
    geoC.translate(0, 0, -(L + 0.03) / 2);
    const cheneau = ajouter(geoC, matStruct, xF - fs * EC, Y_SOL + H, 0);
    cheneau.scale.x = fs;
    // Embouts du chéneau
    for (const s of [-1, 1]) boite(EC + 0.014, HC, 0.006, matStruct, xF - fs * (EC / 2 - 0.007), Y_SOL + H + HC / 2, s * (L / 2 + 0.018));

    // Poteaux côté jardin (portée max entre deux)
    const zP = repartir(-L / 2 + PT / 2, L / 2 - PT / 2, CONFIG.porteeMax);
    const xP = xF - fs * (PT / 2 + 0.012);
    for (const z of zP) {
      profil(PT, H, PT, matStruct, xP, Y_SOL + H / 2, z);
      boite(0.15, 0.01, 0.15, matStruct, xP, Y_SOL + 0.005, z);
      ctx.ombrePied(xP, z);
    }

    // Profil mural fixé à la façade + solin
    const yMur = yTop(xM);
    profil(0.07, 0.17, L + 0.02, matStruct, xM + fs * 0.035, yMur - 0.06, 0);
    boite(0.012, 0.13, L + 0.04, matStruct, xM + fs * 0.006, yMur + EG + 0.07, 0);
    const solin = boite(0.13, 0.01, L + 0.04, matStruct, xM + fs * 0.065, yMur + EG + 0.012, 0);
    solin.rotation.z = rot;

    // Chevrons alu tous les ~1 m, avec capot serreur au-dessus du verre
    const xA = xM + fs * 0.07;
    const xB = xF - fs * 0.03;
    const lh = Math.abs(xB - xA);
    const longR = lh / cosA;
    const cx = (xA + xB) / 2;
    const nR = Math.max(2, Math.ceil((L - 0.07) / 1.0));
    const zR = Array.from({ length: nR + 1 }, (_, i) => -L / 2 + 0.035 + (i * (L - 0.07)) / nR);
    for (const z of zR) {
      profil(longR, RH, 0.055, matStruct, cx, yTop(cx) - RH / 2 / cosA, z).rotation.z = rot;
      profil(longR + 0.02, 0.022, 0.068, matStruct, cx, yTop(cx) + (EG + 0.011) / cosA, z).rotation.z = rot;
    }

    // Remplissage du toit entre les chevrons
    let matToit = matVerreToit;
    if (couv === 'polycarbonate') matToit = state.teinteCouverture === 'opale' ? matPolyOpale : matPolyClair;
    if (couv === 'panneau') {
      matPanneau.color.set(CONFIG.couvertures.panneau.teintes[state.teinteCouverture]?.couleur ?? '#3B3E41');
      matToit = matPanneau;
    }
    const opaque = couv === 'panneau';
    for (let i = 0; i < nR; i++) {
      const zc = (zR[i] + zR[i + 1]) / 2;
      const larg = zR[i + 1] - zR[i] - 0.02;
      const p = boite(longR - 0.02, EG, larg, matToit, cx, yTop(cx) + EG / 2 / cosA, zc, opaque);
      p.rotation.z = rot;
      if (!opaque) p.renderOrder = 3;
      // Stores de toiture : toile tendue sous le verre, coffre côté maison
      if (state.storeToit && !opaque) {
        const toile = boite(longR - 0.3, 0.005, larg - 0.06, matToile, cx + fs * 0.08, yTop(cx + fs * 0.08) - RH * 0.55 / cosA, zc);
        toile.rotation.z = rot;
        const xk = xA + fs * 0.08;
        profil(0.11, 0.09, larg - 0.04, matStruct, xk, yU(xk) - 0.03, zc);
      }
    }

    // Façade côté jardin : baies coulissantes entre les poteaux (le curseur « baies ouvertes » les fait glisser)
    const face = new THREE.Group();
    face.position.set(xF - fs * 0.07, 0, 0);
    groupe.add(face);
    let budget = Math.round(state.vantaux ?? 0);
    let maxV = 0;
    for (let i = 0; i < zP.length - 1; i++) {
      const r = baies(face, zP[i] + PT / 2, zP[i + 1] - PT / 2, Y_SOL, Y_SOL + H, budget);
      budget -= r.ouverts;
      maxV += r.max;
    }

    // Pignons vitrés (côtés) : seuil, montants tous les ~1 m, traverse au niveau des baies, verre jusqu'aux chevrons
    const xa = xM + fs * 0.01;
    const xb = xP - fs * (PT / 2);
    const lp = Math.abs(xb - xa);
    for (const s of [-1, 1]) {
      const zw = s * (L / 2 - 0.035);
      profil(lp, 0.05, 0.06, matStruct, (xa + xb) / 2, Y_SOL + 0.025, zw);
      profil(lp, 0.05, 0.06, matStruct, (xa + xb) / 2, Y_SOL + H - 0.025, zw);
      const nm = Math.max(1, Math.round(lp / 0.95));
      const xs = Array.from({ length: nm + 1 }, (_, i) => xa + fs * (i * lp) / nm);
      // Montant contre la façade + montants intermédiaires (le dernier est le poteau)
      for (let i = 0; i < nm; i++) {
        const x = i === 0 ? xa + fs * 0.025 : xs[i];
        const h = yU(x) - Y_SOL;
        profil(0.05, h, 0.06, matStruct, x, Y_SOL + h / 2, zw);
      }
      for (let i = 0; i < nm; i++) {
        const x0 = xs[i] + fs * 0.025;
        const x1 = xs[i + 1] - fs * 0.025;
        const pts = [
          new THREE.Vector2(x0, Y_SOL + 0.05), new THREE.Vector2(x1, Y_SOL + 0.05),
          new THREE.Vector2(x1, yU(x1) - 0.005), new THREE.Vector2(x0, yU(x0) - 0.005),
        ];
        const vitre = ajouter(new THREE.ShapeGeometry(new THREE.Shape(pts)), matVerreParoi, 0, 0, zw, false);
        vitre.renderOrder = 2;
      }
    }

    // Descente d'eau au coin avant (côté caméra)
    if (state.gouttieres) {
      const xd = xF - fs * 0.06;
      const zd = L / 2 + 0.065;
      const hD = H + 0.02;
      ajouter(new THREE.CylinderGeometry(0.038, 0.038, hD - 0.1, 16), matStruct, xd, Y_SOL + 0.1 + (hD - 0.1) / 2, zd);
      ajouter(new THREE.CylinderGeometry(0.038, 0.038, 0.12, 16), matStruct, xd, Y_SOL + H + 0.06, zd - 0.02).rotation.x = 0.4;
      const coude = ajouter(new THREE.CylinderGeometry(0.038, 0.038, 0.16, 16), matStruct, xd + fs * 0.06, Y_SOL + 0.08, zd);
      coude.rotation.z = fs * Math.PI / 2.6;
    }

    // Éclairage LED : spots encastrés sous les chevrons (4 éclairent vraiment en vue de nuit)
    if (state.led) {
      const interieurs = zR.slice(1, -1);
      const choix = new Set([Math.floor((interieurs.length - 1) / 3), Math.ceil(((interieurs.length - 1) * 2) / 3)]);
      interieurs.forEach((z, i) => {
        for (const k of [0.3, 0.7]) {
          const x = xA + fs * lh * k;
          const y = yU(x) - 0.006;
          ajouter(new THREE.CylinderGeometry(0.03, 0.03, 0.012, 16), matLed, x, y, z, false);
          if (choix.has(i)) ctx.led(x, y - 0.03, z);
        }
      });
    }

    if (W >= 2.8 && L >= 2.8) mobilier((xM + xF) / 2 + fs * 0.15, 0.1);

    return { maxVantaux: maxV, ombre: opaque ? 0.3 : 0.1 };
  }

  // ======================================================================
  // PERGOLA BIOCLIMATIQUE : cadre alu, lames orientables, stores screen ou vitrages, LED, chauffage
  // ======================================================================
  function pergolaBio(g) {
    majStructure();
    const { W, L, H } = g;
    const hs = g.maison(-1) ? -1 : g.maison(1) ? 1 : 0;
    const PP = 0.15;  // poteaux
    const BW = 0.15;  // largeur des poutres
    const HB = 0.27;  // hauteur des poutres (gouttière intégrée)
    const yB = Y_SOL + H;   // dessous des poutres
    const yH = yB + HB;     // dessus

    // Poutres le long de z (avec une poutre intermédiaire si les lames seraient trop longues)
    const nMod = Math.max(1, Math.ceil((W - 2 * BW) / (CONFIG.porteeLames ?? 4.2)));
    const xPoutres = Array.from({ length: nMod + 1 }, (_, i) => -W / 2 + BW / 2 + (i * (W - BW)) / nMod);
    for (const x of xPoutres) profil(BW, HB, L, matStruct, x, yB + HB / 2, 0);
    for (const s of [-1, 1]) profil(W - 2 * BW + 0.002, HB, BW, matStruct, 0, yB + HB / 2, s * (L / 2 - BW / 2));
    // Rainure décorative sur le pourtour (donne le relief d'un profil extrudé)
    for (const s of [-1, 1]) {
      if (s !== hs) boite(0.004, 0.012, L + 0.002, matJoint, s * (W / 2 + 0.001), yB + HB * 0.7, 0, false);
      boite(W + 0.002, 0.012, 0.004, matJoint, 0, yB + HB * 0.7, s * (L / 2 + 0.001), false);
    }

    // Poteaux : lignes du bord (sauf côté maison) + aux extrémités des poutres intermédiaires
    const zP = repartir(-L / 2 + PP / 2, L / 2 - PP / 2, CONFIG.porteeMax);
    const poteaux = [];
    for (const s of [-1, 1]) {
      if (s === hs) continue;
      for (const z of zP) poteaux.push([s * (W / 2 - PP / 2), z]);
    }
    for (const x of xPoutres.slice(1, -1)) for (const z of [zP[0], zP[zP.length - 1]]) poteaux.push([x, z]);
    poteaux.forEach(([x, z], i) => {
      profil(PP, H, PP, matStruct, x, Y_SOL + H / 2, z);
      boite(0.22, 0.012, 0.22, matStruct, x, Y_SOL + 0.006, z);
      ctx.ombrePied(x, z);
      // Sortie d'eau au pied d'un poteau (la descente est cachée dans le poteau)
      if (i === 0) boite(0.07, 0.035, 0.05, matJoint, x + Math.sign(x || 1) * (PP / 2 + 0.02), Y_SOL + 0.05, z);
    });
    // Côté maison : pattes de fixation dans la façade
    if (hs) for (const z of repartir(-L / 2 + 0.3, L / 2 - 0.3, 1.2)) boite(0.02, 0.18, 0.12, matJoint, hs * (W / 2 + 0.01), yB + HB / 2, z);

    // Lames orientables : profil en amande, pivot au centre, réglées par le curseur (0° fermé, 90° ouvert)
    const zLames = L - 2 * BW;
    const pas = 0.2;
    const nL = Math.max(1, Math.floor((zLames - 0.02) / pas));
    const z0 = -((nL - 1) * pas) / 2;
    const span = (W - BW) / nMod - BW - 0.01;
    const forme = new THREE.Shape();
    forme.moveTo(-0.104, 0);
    forme.quadraticCurveTo(0, 0.036, 0.104, 0.004);
    forme.lineTo(0.104, -0.006);
    forme.quadraticCurveTo(0, -0.012, -0.104, -0.006);
    forme.closePath();
    const geoLame = new THREE.ExtrudeGeometry(forme, { depth: span, bevelEnabled: false, curveSegments: 10 });
    geoLame.translate(0, 0, -span / 2);
    geoLame.rotateY(Math.PI / 2); // longueur selon x, largeur selon z
    const lames = new THREE.InstancedMesh(geoLame, matStruct, nL * nMod);
    const ang = THREE.MathUtils.degToRad(state.angleLames ?? 45);
    // (inclinées vers l'arrière : face au soleil de la scène, elles dessinent des bandes d'ombre sur la terrasse)
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-ang, 0, 0));
    const m4 = new THREE.Matrix4();
    const un = new THREE.Vector3(1, 1, 1);
    let k = 0;
    for (let m = 0; m < nMod; m++) {
      const xc = (xPoutres[m] + xPoutres[m + 1]) / 2;
      for (let i = 0; i < nL; i++) lames.setMatrixAt(k++, m4.compose(new THREE.Vector3(xc, yB + HB * 0.56, z0 + i * pas), q, un));
    }
    lames.castShadow = true;
    lames.receiveShadow = true;
    groupe.add(lames);

    // Fermetures par côté (même boutons que les parois) : store screen ou vitrage coulissant
    const typeF = CONFIG.bardages[state.bardage] ?? {};
    const cotes = [
      { cle: 'paroiArriere', a: [-W / 2, -L / 2], b: [W / 2, -L / 2], sens: 0 },
      { cle: 'paroiAvant', a: [W / 2, L / 2], b: [-W / 2, L / 2], sens: 0 },
      { cle: 'paroiGauche', a: [-W / 2, L / 2], b: [-W / 2, -L / 2], sens: -1 },
      { cle: 'paroiDroite', a: [W / 2, -L / 2], b: [W / 2, L / 2], sens: 1 },
    ];
    for (const c of cotes) {
      if (!state[c.cle] || (c.sens && c.sens === hs)) continue;
      const { grp, long } = repere(c.a[0], c.a[1], c.b[0], c.b[1]);
      // Bord intérieur des poteaux, sous l'axe de la poutre
      grp.translateX(-BW / 2);
      const bornes = c.sens ? zP.map((z) => (c.sens > 0 ? z : -z)).sort((u, v) => u - v) : [-long / 2 + PP / 2, long / 2 - PP / 2];
      for (let i = 0; i < bornes.length - 1; i++) {
        const z1 = bornes[i] + PP / 2;
        const z2 = bornes[i + 1] - PP / 2;
        const lg = z2 - z1;
        const zc = (z1 + z2) / 2;
        if (typeF.store) {
          profil(0.11, 0.12, lg, matStruct, 0, yB - 0.06, zc, true, grp);
          const toile = boite(0.004, yB - 0.12 - (Y_SOL + 0.05), lg - 0.06, matScreen, 0, (yB - 0.12 + Y_SOL + 0.05) / 2, zc, true, grp);
          toile.material.color.set(typeF.couleur ?? '#4B4C4E');
          toile.renderOrder = 2;
          texScreen.repeat.set(lg * 12, H * 12);
          profil(0.03, 0.05, lg - 0.04, matStruct, 0, Y_SOL + 0.05, zc, true, grp);
          for (const s of [-1, 1]) profil(0.04, yB - 0.12 - Y_SOL, 0.03, matStruct, 0, (yB - 0.12 + Y_SOL) / 2, zc + s * (lg / 2 - 0.015), true, grp);
        } else if (typeF.vitrage) {
          baies(grp, z1, z2, Y_SOL, yB, 0, typeF.verre ? matVerreTeinte : matVerreParoi);
        }
      }
    }

    // LED : bandeau sous le bord intérieur des poutres + 4 spots qui éclairent la terrasse la nuit
    if (state.led) {
      for (const s of [-1, 1]) {
        boite(0.02, 0.008, L - 2 * BW, matLed, s * (W / 2 - BW - 0.02), yB - 0.004, 0, false);
        boite(W - 2 * BW, 0.008, 0.02, matLed, 0, yB - 0.004, s * (L / 2 - BW - 0.02), false);
      }
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) ctx.led(sx * W / 4, yB - 0.03, sz * L / 4);
    }

    // Chauffage : deux radiants infrarouges sous les poutres avant et arrière, inclinés vers le centre
    if (state.chauffage) {
      for (const s of [-1, 1]) {
        const r = new THREE.Group();
        r.position.set(0, yB - 0.09, s * (L / 2 - BW - 0.09));
        r.rotation.x = s * 0.55;
        groupe.add(r);
        profil(0.78, 0.07, 0.13, matRadiant, 0, 0, 0, true, r);
        boite(0.7, 0.012, 0.09, matGrille, 0, -0.036, 0, false, r);
        boite(0.03, 0.12, 0.03, matRadiant, 0, 0.07, 0, true, r);
      }
    }

    if (W >= 2.8 && L >= 2.8) mobilier(hs ? -hs * 0.2 : 0, 0.1);

    return { ombre: 0.18 };
  }

  // ======================================================================
  // TERRASSE (04.11.2026) : plancher en lames (bois, composite) ou dalles de grès sur plots,
  // habillage des côtés, marches d'accès côté jardin, garde-corps (verre, bois, câbles inox), spots LED encastrés.
  // ======================================================================
  // Lames : veinage dans le sens de la longueur (texture tournée pour les lames posées selon z)
  const texVeinageZ = texVeinage.clone();
  texVeinageZ.center.set(0.5, 0.5);
  texVeinageZ.rotation = Math.PI / 2;
  texVeinageZ.needsUpdate = true;
  // Composite : fines rainures brossées le long de la lame
  const rainures = (tourne) => {
    const t = ctx.textureCanvas(256, 64, (g, l, h) => {
      g.fillStyle = '#d8d8d8';
      g.fillRect(0, 0, l, h);
      for (let y = 0; y < h; y += 4) {
        g.fillStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.08})`;
        g.fillRect(0, y, l, 1.4);
      }
      for (let i = 0; i < 400; i++) {
        g.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
        g.fillRect(Math.random() * l, Math.random() * h, 6 + Math.random() * 20, 1);
      }
    });
    if (tourne) { t.center.set(0.5, 0.5); t.rotation = Math.PI / 2; t.needsUpdate = true; }
    return t;
  };
  const texRainuresX = rainures(false);
  const texRainuresZ = rainures(true);
  // Grès cérame : dalles 120 × 60 cm, joints fins, légère nuance d'une dalle à l'autre (motif de 2,4 × 2,4 m)
  const texDalles = ctx.textureCanvas(512, 512, (g, l, h) => {
    const nx = 2;
    const nz = 4;
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < nz; j++) {
        const v = 222 + Math.floor(Math.random() * 22);
        g.fillStyle = `rgb(${v},${v},${v - 2})`;
        g.fillRect((i * l) / nx, (j * h) / nz, l / nx, h / nz);
        for (let k = 0; k < 900; k++) {
          const c = v + (Math.random() - 0.5) * 26;
          g.fillStyle = `rgba(${c},${c},${c},0.35)`;
          g.fillRect((i * l) / nx + Math.random() * (l / nx), (j * h) / nz + Math.random() * (h / nz), 2, 2);
        }
      }
    }
    g.fillStyle = 'rgba(70,70,70,0.75)';
    for (let i = 0; i <= nx; i++) g.fillRect((i * l) / nx - 1, 0, 2, h);
    for (let j = 0; j <= nz; j++) g.fillRect(0, (j * h) / nz - 1, l, 2);
  });
  texDalles.wrapS = THREE.RepeatWrapping;
  texDalles.wrapT = THREE.RepeatWrapping;
  const matLame = [0, 1, 2].map(() => new THREE.MeshStandardMaterial({ roughness: 0.7, envMapIntensity: 0.55 }));
  const matLameZ = [0, 1, 2].map(() => new THREE.MeshStandardMaterial({ roughness: 0.7, envMapIntensity: 0.55 }));
  const matDalle = new THREE.MeshStandardMaterial({ map: texDalles, roughness: 0.55, envMapIntensity: 0.6 });
  const matHabillage = new THREE.MeshStandardMaterial({ color: '#4A4D50', roughness: 0.5, metalness: 0.3 });
  const matPlot = new THREE.MeshStandardMaterial({ color: '#3B3C3E', roughness: 0.8 });
  const matInox = new THREE.MeshStandardMaterial({ color: '#C9CDD0', roughness: 0.22, metalness: 0.95 });
  const matGCbois = new THREE.MeshStandardMaterial({ map: texVeinage, bumpMap: texVeinage, bumpScale: 0.4, roughness: 0.7 });
  const matGCboisZ = new THREE.MeshStandardMaterial({ map: texVeinageZ, bumpMap: texVeinageZ, bumpScale: 0.4, roughness: 0.7 });
  const matAluGC = new THREE.MeshStandardMaterial({ color: '#3A3D41', roughness: 0.4, metalness: 0.35 });

  function terrasse(g) {
    const { W, L, H } = g;
    const couv = CONFIG.couvertures[state.couverture];
    const teinte = couv.teintes[state.teinteCouverture].couleur;
    const pose = CONFIG.bois[state.bois];
    const dalles = couv.type === 'dalles';
    const ep = couv.epaisseur ?? 0.025;
    const yTop = Y_SOL + H;
    // Sens « parallèle à la façade » : selon x si la maison est derrière (isolée), selon z si elle est sur le côté
    const facadeZ = g.adosse !== 'non';
    const selonZ = pose.sens === 'perpendiculaire' ? !facadeZ : facadeZ;

    // Teinte des lames (3 nuances pour un rendu naturel)
    const veinage = couv.veinage !== false && !couv.rainures;
    [matLame, matLameZ].forEach((liste, iz) => liste.forEach((m, k) => {
      const tex = couv.rainures ? (iz ? texRainuresZ : texRainuresX) : (iz ? texVeinageZ : texVeinage);
      m.map = tex;
      m.bumpMap = tex;
      m.bumpScale = couv.rainures ? 0.6 : 0.45;
      m.roughness = couv.rainures ? 0.62 : 0.72;
      m.color.set(teinte).multiplyScalar([1, 0.93, 1.06][k]);
      m.needsUpdate = true;
    }));
    const matHab = dalles ? matHabillage : matLameZ[0];
    const matHabX = dalles ? matHabillage : matLame[0];

    // ----- Revêtement -----
    if (dalles) {
      const t = texDalles;
      t.center.set(0.5, 0.5);
      t.rotation = selonZ ? Math.PI / 2 : 0;
      t.repeat.set(selonZ ? L / 2.4 : W / 2.4, selonZ ? W / 2.4 : L / 2.4);
      t.needsUpdate = true;
      matDalle.color.set(teinte);
      boite(W, ep, L, matDalle, 0, yTop - ep / 2, 0);
      // Plots sous les dalles (visibles seulement si le plancher est haut et sans habillage du côté maison)
    } else {
      const lw = couv.largeurLame ?? 0.14;
      const jeu = 0.006;
      const cadre = Boolean(pose.cadre);
      const bord = cadre ? lw + jeu : 0;
      // Cadre périphérique : une lame posée tout autour, perpendiculaire aux autres
      if (cadre) {
        for (const s of [-1, 1]) {
          boite(W, ep, lw, matLame[1], 0, yTop - ep / 2, s * (L / 2 - lw / 2));
          boite(lw, ep, L - 2 * lw - 2 * jeu, matLameZ[1], s * (W / 2 - lw / 2), yTop - ep / 2, 0);
        }
      }
      const largeurZone = selonZ ? W - 2 * bord : L - 2 * bord;
      const longueur = selonZ ? L - 2 * bord : W - 2 * bord;
      const n = Math.max(1, Math.floor((largeurZone + jeu) / (lw + jeu)));
      const lwr = (largeurZone - (n - 1) * jeu) / n;
      for (let i = 0; i < n; i++) {
        const c = -largeurZone / 2 + lwr / 2 + i * (lwr + jeu);
        const k = (i * 7) % 3;
        if (selonZ) boite(lwr, ep, longueur, matLameZ[k], c, yTop - ep / 2, 0);
        else boite(longueur, ep, lwr, matLame[k], 0, yTop - ep / 2, c);
      }
      // Lambourdes sombres entre les lames (on les devine dans les joints)
      boite(W - 0.02, 0.04, L - 0.02, matPlot, 0, yTop - ep - 0.02, 0, false);
    }

    // ----- Côtés : habillage (plancher surélevé) ou simple bordure -----
    const hHab = Math.max(0.02, H - ep);
    const libre = (cle) => !(cle === 'paroiGauche' && g.maison(-1)) && !(cle === 'paroiDroite' && g.maison(1));
    if (libre('paroiGauche')) boite(0.022, hHab, L, matHab, -W / 2 + 0.011, Y_SOL + hHab / 2, 0);
    if (libre('paroiDroite')) boite(0.022, hHab, L, matHab, W / 2 - 0.011, Y_SOL + hHab / 2, 0);
    boite(W, hHab, 0.022, matHabX, 0, Y_SOL + hHab / 2, L / 2 - 0.011);
    boite(W, hHab, 0.022, matHabX, 0, Y_SOL + hHab / 2, -L / 2 + 0.011);
    // Ombre de contact au pied de la terrasse
    for (const [x, z] of [[-W / 3, -L / 3], [W / 3, L / 3], [-W / 3, L / 3], [W / 3, -L / 3]]) ctx.ombrePied(x, z);

    // ----- Marches d'accès côté jardin -----
    const cote = g.adosse === 'gauche' ? 'paroiDroite' : g.adosse === 'droite' ? 'paroiGauche' : 'paroiAvant';
    const nM = H <= (CONFIG.hauteurSansMarche ?? 0.2) ? 0 : Math.ceil(H / (CONFIG.hauteurMarche ?? 0.18)) - 1 || 1;
    const wm = Math.min(CONFIG.largeurMarches ?? 1.4, (cote === 'paroiAvant' ? W : L) - 0.2);
    const giron = 0.32;
    // Repère des marches : u = le long du bord, v = vers l'extérieur
    const placer = (u, v) => (cote === 'paroiAvant' ? [u, L / 2 + v] : cote === 'paroiDroite' ? [W / 2 + v, u] : [-W / 2 - v, u]);
    const leds = [];
    for (let i = 1; i <= nM; i++) {
      const yM = yTop - (i * H) / (nM + 1);
      const [x, z] = placer(0, (i - 0.5) * giron);
      const surZ = cote === 'paroiAvant';
      const [w, d] = surZ ? [wm, giron] : [giron, wm];
      boite(w, yM - Y_SOL - ep, d, surZ ? matHabX : matHab, x, Y_SOL + (yM - Y_SOL - ep) / 2, z);
      if (dalles) boite(w + 0.02, ep, d + 0.02, matDalle, x, yM - ep / 2, z);
      else boite(w + 0.02, ep, d + 0.02, surZ ? matLame[2] : matLameZ[2], x, yM - ep / 2, z);
      if (state.led) {
        const [xl, zl] = placer(0, (i - 1) * giron + 0.01);
        const strip = surZ ? [wm * 0.8, 0.012, 0.01] : [0.01, 0.012, wm * 0.8];
        boite(...strip, ctx.matLed, xl, yM + (H / (nM + 1)) * 0.55, zl, false);
        leds.push([xl, yM, zl]);
      }
    }

    // ----- Garde-corps -----
    const gc = CONFIG.bardages[state.bardage];
    const hGC = CONFIG.hauteurGardeCorps ?? 1.0;
    if (gc.barreaux && gc.couleur) { matGCbois.color.set(gc.couleur); matGCboisZ.color.set(gc.couleur); }
    const segments = [];
    const ajoutSeg = (cle, ax, az, bx, bz) => {
      if (!state[cle] || !libre(cle)) return;
      if (cle === cote && nM) {
        // Ouverture au droit des marches
        const mx = (ax + bx) / 2;
        const mz = (az + bz) / 2;
        const dx = (bx - ax) / Math.hypot(bx - ax, bz - az);
        const dz = (bz - az) / Math.hypot(bx - ax, bz - az);
        segments.push([ax, az, mx - (dx * wm) / 2, mz - (dz * wm) / 2]);
        segments.push([mx + (dx * wm) / 2, mz + (dz * wm) / 2, bx, bz]);
      } else segments.push([ax, az, bx, bz]);
    };
    const r = 0.04; // retrait du bord
    ajoutSeg('paroiArriere', -W / 2 + r, -L / 2 + r, W / 2 - r, -L / 2 + r);
    ajoutSeg('paroiAvant', -W / 2 + r, L / 2 - r, W / 2 - r, L / 2 - r);
    ajoutSeg('paroiGauche', -W / 2 + r, -L / 2 + r, -W / 2 + r, L / 2 - r);
    ajoutSeg('paroiDroite', W / 2 - r, -L / 2 + r, W / 2 - r, L / 2 - r);
    for (const [ax, az, bx, bz] of segments) {
      const { grp, long } = repere(ax, az, bx, bz);
      if (long < 0.15) continue;
      const zs = repartir(-long / 2, long / 2, gc.vitrage ? 1.5 : gc.cables ? 1.3 : 1.5);
      if (gc.vitrage) {
        // Verre feuilleté entre poteaux alu, main courante fine
        for (const z of zs) profil(0.05, hGC, 0.05, matAluGC, 0, yTop + hGC / 2, z, true, grp);
        for (let i = 0; i < zs.length - 1; i++) {
          const lv = zs[i + 1] - zs[i] - 0.07;
          const v = boite(0.012, hGC - 0.12, lv, matVerreParoi, 0, yTop + 0.06 + (hGC - 0.12) / 2, (zs[i] + zs[i + 1]) / 2, false, grp);
          v.renderOrder = 2;
        }
        profil(0.06, 0.035, long + 0.05, matAluGC, 0, yTop + hGC, 0, true, grp);
      } else if (gc.cables) {
        // Poteaux inox, main courante ronde et 6 câbles tendus
        for (const z of zs) ajouter(new THREE.CylinderGeometry(0.021, 0.021, hGC, 14), matInox, 0, yTop + hGC / 2, z, true, grp);
        const tube = ajouter(new THREE.CylinderGeometry(0.021, 0.021, long + 0.04, 14), matInox, 0, yTop + hGC, 0, true, grp);
        tube.rotation.x = Math.PI / 2;
        for (let k = 1; k <= 6; k++) {
          const c = ajouter(new THREE.CylinderGeometry(0.0035, 0.0035, long, 6), matInox, 0, yTop + k * (hGC - 0.05) / 7, 0, false, grp);
          c.rotation.x = Math.PI / 2;
        }
      } else {
        // Bois : poteaux, main courante, lisse basse et barreaux tous les 12 cm
        for (const z of zs) boite(0.09, hGC, 0.09, matGCbois, 0, yTop + hGC / 2, z, true, grp);
        boite(0.14, 0.045, long + 0.06, matGCboisZ, 0, yTop + hGC + 0.0225, 0, true, grp);
        boite(0.07, 0.045, long, matGCboisZ, 0, yTop + 0.1, 0, true, grp);
        boite(0.07, 0.045, long, matGCboisZ, 0, yTop + hGC - 0.07, 0, true, grp);
        const nb = Math.floor(long / 0.12);
        for (let i = 1; i < nb; i++) {
          const z = -long / 2 + (i * long) / nb;
          if (zs.some((zp) => Math.abs(zp - z) < 0.07)) continue;
          boite(0.035, hGC - 0.2, 0.035, matGCbois, 0, yTop + 0.1 + (hGC - 0.2) / 2, z, false, grp);
        }
      }
    }

    // ----- Spots LED encastrés le long des bords libres -----
    if (state.led) {
      const pas = 1.4;
      const spot = (x, z) => {
        ajouter(new THREE.CylinderGeometry(0.03, 0.03, 0.006, 16), ctx.matLed, x, yTop + 0.002, z, false);
        leds.push([x, yTop, z]);
      };
      for (const z of repartir(-L / 2 + 0.4, L / 2 - 0.4, pas)) {
        if (libre('paroiGauche')) spot(-W / 2 + 0.15, z);
        if (libre('paroiDroite')) spot(W / 2 - 0.15, z);
      }
      for (const x of repartir(-W / 2 + 0.4, W / 2 - 0.4, pas)) spot(x, L / 2 - 0.15);
      // Quelques points pour les lumières de la vue de nuit
      const pas2 = Math.max(1, Math.floor(leds.length / 4));
      for (let i = 0; i < leds.length; i += pas2) ctx.led(leds[i][0], leds[i][1] + 0.3, leds[i][2]);
    }

    // Mobilier (échelle), un peu en retrait de la maison
    if (W >= 2.6 && L >= 2.6) {
      const dx = g.maison(-1) ? 0.3 : g.maison(1) ? -0.3 : 0;
      const dz = g.adosse === 'non' ? -0.2 : 0;
      mobilier(dx, dz, H);
    }
    return { ombre: 0 };
  }

  return { veranda, pergolaBio, terrasse };
}
