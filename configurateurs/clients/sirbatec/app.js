import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { CONFIG } from './config.js';
import { creerPDF } from './pdf.js';

const $ = (s) => document.querySelector(s);
const nf = new Intl.NumberFormat('fr-CH', { maximumFractionDigits: 0 });
const fmtM = (v) => v.toFixed(2).replace('.', ',') + ' m';
// Espace insécable normale (l'espace fine de fr-CH est presque invisible en petit)
const fmtCHF = (v) => nf.format(Math.round(v)).replace(/ /g, ' ');
const fmtM2 = (v) => v.toFixed(1).replace('.', ',') + ' m²';
const arrondi10 = (v) => Math.round(v / 10) * 10;
const arrondi50 = (v) => Math.round(v / 50) * 50;
const hasard = (min, max) => min + Math.random() * (max - min);

// ---------- État (lu depuis le lien partagé si présent) ----------

const state = { ...CONFIG.defauts };

function lireLien() {
  const p = new URLSearchParams(location.hash.slice(1));
  for (const cle of Object.keys(state)) {
    if (!p.has(cle)) continue;
    const v = p.get(cle);
    const d = CONFIG.defauts[cle];
    if (typeof d === 'number') state[cle] = parseFloat(v);
    else if (typeof d === 'boolean') state[cle] = v === '1';
    else state[cle] = v;
  }
}

function valider() {
  for (const [cle, [min, max]] of Object.entries(CONFIG.limites)) {
    const v = state[cle];
    state[cle] = Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : CONFIG.defauts[cle];
  }
  if (!CONFIG.implantations[state.adosse]) state.adosse = 'non';
  if (!CONFIG.toits[state.toit]) state.toit = CONFIG.defauts.toit;
  // Contre une façade, le toit descend à l'opposé de la maison : pas de 2 pans
  if (state.adosse !== 'non' && CONFIG.toits[state.toit].faitage) state.toit = 'unPan';
  const permises = CONFIG.toits[state.toit].couvertures;
  if (!permises.includes(state.couverture)) state.couverture = permises[0];
  const teintes = CONFIG.couvertures[state.couverture].teintes;
  if (!teintes[state.teinteCouverture]) state.teinteCouverture = Object.keys(teintes)[0];
  if (!CONFIG.bois[state.bois]) state.bois = CONFIG.defauts.bois;
  if (!CONFIG.bardages[state.bardage]) state.bardage = CONFIG.defauts.bardage;
  if (!CONFIG.vehicules[state.vehicule]) state.vehicule = CONFIG.defauts.vehicule;
  if (!CONFIG.positionsLocal[state.posLocal]) state.posLocal = CONFIG.defauts.posLocal;
  if (!CONFIG.profondeursLocal.includes(state.profLocal)) state.profLocal = CONFIG.defauts.profLocal;
}

function ecrireLien() {
  const p = new URLSearchParams();
  for (const [cle, v] of Object.entries(state)) {
    p.set(cle, typeof v === 'boolean' ? (v ? '1' : '0') : String(v));
  }
  history.replaceState(null, '', '#' + p.toString());
}

lireLien();
valider();

// ---------- Géométrie commune (scène ET prix) ----------

const P = 0.12;   // section des poteaux
const BH = 0.2;   // hauteur des sablières
const RH = 0.14;  // hauteur des chevrons
const RW = 0.07;  // largeur des chevrons
const OV = 0.35;  // débord de toit sur les côtés
const OVZ = 0.2;  // débord de toit devant / derrière
const Y_SOL = 0.03; // dessus des pavés

// Coin fixe : le côté gauche et l'arrière ne bougent pas, le carport s'agrandit vers la droite et vers l'avant
const X_GAUCHE = -CONFIG.defauts.largeur / 2;
const Z_ARRIERE = -CONFIG.defauts.profondeur / 2;

function geometrie() {
  const Wv = state.largeur;     // largeur pour les véhicules
  const Dc = state.profondeur;  // profondeur pour les véhicules
  const H = state.hauteur;
  const S = state.rangement ? state.profLocal : 0;
  const posL = state.rangement ? state.posLocal : null;
  const lateral = posL === 'gauche' || posL === 'droite';
  const W = Wv + (lateral ? S : 0);            // largeur totale
  const L = Dc + (posL === 'arriere' ? S : 0); // profondeur totale
  const xR = W / 2 - P / 2;
  const zR = L / 2 - P / 2;
  const adosse = state.adosse;
  const cotesMaison = adosse === 'gauche' ? [-1] : adosse === 'droite' ? [1] : [];
  const maison = (s) => cotesMaison.includes(s);
  const toit = CONFIG.toits[state.toit];
  const a = THREE.MathUtils.degToRad(toit.pente);
  const t = Math.tan(a);
  const y0 = Y_SOL + H + BH;
  // Toit à 2 pans : faîtage au milieu (0,5) ou décalé (toit asymétrique), même hauteur de faîte
  const deuxPans = Boolean(toit.faitage);
  const xF = deuxPans ? -xR + 2 * xR * toit.faitage : 0;
  const hF = xR * t;
  const aG = deuxPans ? Math.atan(hF / (xF + xR)) : a;
  const aD = deuxPans ? Math.atan(hF / (xR - xF)) : a;
  // Toit à 1 pan / plat : côté haut à gauche (sens 1), ou à droite si la maison est à droite
  const sens = adosse === 'droite' ? -1 : 1;
  // Hauteur du dessus des sablières / de l'appui des chevrons à la position x
  const ySup = deuxPans
    ? (x) => y0 + hF * (x <= xF ? (x + xR) / (xF + xR) : (xR - x) / (xR - xF))
    : (x) => y0 + (xR - sens * x) * t;
  const zCloison = posL === 'arriere' ? -L / 2 + S : -L / 2;
  const xCloison = posL === 'gauche' ? -W / 2 + S : posL === 'droite' ? W / 2 - S : null;
  // Zone des véhicules
  const xMinV = posL === 'gauche' ? xCloison : -W / 2;
  const xMaxV = posL === 'droite' ? xCloison : W / 2;

  // Poteaux : portée max entre deux, un poteau de plus à la cloison du local arrière
  const zPoteaux = [];
  const segment = (z1, z2) => {
    const n = Math.max(1, Math.ceil((z2 - z1) / CONFIG.porteeMax - 1e-6));
    for (let i = 0; i <= n; i++) zPoteaux.push(z1 + (i * (z2 - z1)) / n);
  };
  if (posL === 'arriere') {
    zPoteaux.push(-zR);
    segment(zCloison, zR);
  } else {
    segment(-zR, zR);
  }
  const lignesPoteaux = [-1, 1].filter((s) => !maison(s));

  const decalage = new THREE.Vector3(X_GAUCHE + W / 2, 0, Z_ARRIERE + L / 2);
  return {
    Wv, Dc, W, L, H, S, posL, lateral, xR, zR, a, t, y0, deuxPans, xF, aG, aD, sens, ySup, zCloison, xCloison,
    xMinV, xMaxV, zPoteaux, lignesPoteaux, maison, adosse, decalage,
  };
}

// ---------- Prix ----------

function calculerPrix() {
  const g = geometrie();
  const T = CONFIG.tarifs;
  const toit = CONFIG.toits[state.toit];
  const bois = CONFIG.bois[state.bois];
  const fBardage = CONFIG.bardages[state.bardage].facteur * bois.facteur;
  const surface = g.W * g.L;
  const lignes = [];

  const fStructure = g.adosse !== 'non' ? T.adosseFacteur : 1;
  lignes.push([`Structure, toit ${toit.label} · ${fmtM2(surface)}`, surface * T.structureM2[state.toit] * bois.facteur * fStructure]);
  lignes.push([CONFIG.couvertures[state.couverture].label, surface * T.couvertureM2[state.couverture]]);
  if (g.adosse !== 'non') lignes.push(['Fixation à la façade et solin', g.L * T.fixationMl]);

  const hMur = g.H + BH;
  const localCote = (s) => g.lateral && (s < 0 ? g.posL === 'gauche' : g.posL === 'droite');
  if (state.paroiArriere && g.posL !== 'arriere') lignes.push(['Paroi arrière', g.Wv * hMur * T.paroiM2 * fBardage]);
  if (state.paroiGauche && !g.maison(-1) && !localCote(-1)) lignes.push(['Paroi gauche', g.Dc * hMur * T.paroiM2 * fBardage]);
  if (state.paroiDroite && !g.maison(1) && !localCote(1)) lignes.push(['Paroi droite', g.Dc * hMur * T.paroiM2 * fBardage]);
  if (g.S) {
    const aire = g.S * (g.lateral ? g.L : g.W);
    lignes.push([`Local de rangement · ${fmtM(g.S)} (${CONFIG.positionsLocal[g.posL].label.toLowerCase()})`, aire * T.rangementM2 * fBardage]);
  }
  if (state.gouttieres) {
    const n = g.deuxPans ? 2 : 1;
    lignes.push(['Gouttières et descentes', g.L * n * T.gouttiereMl + T.descente * n]);
  }
  if (state.led) lignes.push(['Éclairage LED', T.led]);
  if (state.borne) lignes.push(['Préparation borne de recharge', T.borne]);

  const materiel = lignes.reduce((s, [, v]) => s + v, 0);
  lignes.push(['Livraison et pose', Math.max(T.poseMin, materiel * T.poseTaux)]);

  const ht = lignes.reduce((s, [, v]) => s + v, 0);
  const tva = ht * CONFIG.tva;
  const ttc = arrondi10(ht + tva);
  return {
    lignes, ht, tva, ttc,
    bas: arrondi50(ttc * (1 - CONFIG.fourchette)),
    haut: arrondi50(ttc * (1 + CONFIG.fourchette)),
    nbPoteaux: g.zPoteaux.length * (g.lignesPoteaux.length + (g.lateral ? 1 : 0)),
    surface,
  };
}

// Prix si on changeait un ou plusieurs réglages (pour afficher l'écart à côté de chaque choix)
function prixSi(modif) {
  const sauve = { ...state };
  Object.assign(state, modif);
  valider();
  const ttc = calculerPrix().ttc;
  Object.assign(state, sauve);
  return ttc;
}

// ---------- Rendu ----------

const viewer = $('#viewer');
const cotesEl = $('#cotes');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
} catch {
  $('#erreur-3d').hidden = false;
}

const scene = new THREE.Scene();
const sceneCotes = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 300);
let controls;

function textureCanvas(l, h, dessiner, couleur = true) {
  const c = document.createElement('canvas');
  c.width = l;
  c.height = h;
  dessiner(c.getContext('2d'), l, h);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  if (couleur) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Ciel : dégradé derrière la scène
scene.background = textureCanvas(4, 256, (g, l, h) => {
  const d = g.createLinearGradient(0, 0, 0, h);
  d.addColorStop(0, '#B9C6CF');
  d.addColorStop(0.55, '#DCDDD8');
  d.addColorStop(1, '#E9E4D8');
  g.fillStyle = d;
  g.fillRect(0, 0, l, h);
});
scene.fog = new THREE.Fog('#E3DFD4', 30, 90);

if (renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.autoClear = false;
  viewer.prepend(renderer.domElement);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.minDistance = 3.5;
  controls.maxDistance = 34;
  controls.addEventListener('start', () => { animCam = null; });
  // Pas d'occlusion ambiante (GTAO) : elle faisait apparaître un bloc sombre sur le sol et la paroi du fond
}

scene.add(new THREE.HemisphereLight('#F4F1EA', '#8C8A73', 0.45));
const soleil = new THREE.DirectionalLight('#FFF0D8', 2.2);
soleil.castShadow = true;
soleil.shadow.mapSize.set(2048, 2048);
Object.assign(soleil.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 50 });
soleil.shadow.bias = -0.0003;
soleil.shadow.normalBias = 0.025;
soleil.shadow.radius = 3;
scene.add(soleil, soleil.target);

// ---------- Matériaux ----------

// Veinage du bois (fibres + nœuds), teinté ensuite par la couleur choisie
const texVeinage = textureCanvas(1024, 256, (g, l, h) => {
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, l, h);
  for (let i = 0; i < 16; i++) {
    g.fillStyle = `rgba(110,70,35,${hasard(0.03, 0.08)})`;
    g.fillRect(0, hasard(0, h), l, hasard(6, 34));
  }
  for (let i = 0; i < 190; i++) {
    const y0 = hasard(0, h);
    const per = hasard(90, 260);
    const amp = hasard(0.8, 4);
    const ph = hasard(0, 6);
    g.strokeStyle = `rgba(85,52,24,${hasard(0.05, 0.2)})`;
    g.lineWidth = hasard(0.5, 1.8);
    g.beginPath();
    for (let x = 0; x <= l; x += 8) g.lineTo(x, y0 + Math.sin(x / per + ph) * amp);
    g.stroke();
  }
  for (let k = 0; k < 3; k++) {
    const cx = hasard(80, l - 80);
    const cy = hasard(30, h - 30);
    const rg = g.createRadialGradient(cx, cy, 1, cx, cy, 14);
    rg.addColorStop(0, 'rgba(70,40,18,0.65)');
    rg.addColorStop(1, 'rgba(70,40,18,0)');
    g.fillStyle = rg;
    g.beginPath();
    g.ellipse(cx, cy, 16, 8, 0, 0, Math.PI * 2);
    g.fill();
  }
});
const texVeinageV = texVeinage.clone();
texVeinageV.center.set(0.5, 0.5);
texVeinageV.rotation = Math.PI / 2;

const optBois = { roughness: 0.72, bumpScale: 0.5, envMapIntensity: 0.55 };
const matBois = new THREE.MeshStandardMaterial({ ...optBois, map: texVeinage, bumpMap: texVeinage });
const matBoisV = new THREE.MeshStandardMaterial({ ...optBois, map: texVeinageV, bumpMap: texVeinageV });
const matBoisFonce = new THREE.MeshStandardMaterial({ ...optBois, map: texVeinageV, bumpMap: texVeinageV });
const matMetal = new THREE.MeshStandardMaterial({ color: '#5A5D60', roughness: 0.35, metalness: 0.85 });
const matZinc = new THREE.MeshStandardMaterial({ color: '#8E9396', roughness: 0.32, metalness: 0.8, side: THREE.DoubleSide });
const matBeton = new THREE.MeshStandardMaterial({ color: '#A9A69E', roughness: 0.95 });
const matBordure = new THREE.MeshStandardMaterial({ color: '#BDB9B0', roughness: 0.9 });
const matLed = new THREE.MeshStandardMaterial({ color: '#FFF6E0', emissive: '#FFE7B8', emissiveIntensity: 2.2 });
const matBorne = new THREE.MeshStandardMaterial({ color: '#EDEDEA', roughness: 0.4 });
const matEcran = new THREE.MeshStandardMaterial({ color: '#1C2A33', roughness: 0.2, emissive: '#1E6F5C', emissiveIntensity: 0.6 });

// Façade de la maison (crépi) pour l'implantation « contre la maison »
const texCrepi = textureCanvas(256, 256, (g, l, h) => {
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, l, h);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = `rgba(0,0,0,${hasard(0.02, 0.07)})`;
    g.fillRect(hasard(0, l), hasard(0, h), hasard(1, 2.5), hasard(1, 2.5));
  }
});
texCrepi.repeat.set(6, 3);
const matCrepi = new THREE.MeshStandardMaterial({ color: '#E9E3D6', map: texCrepi, bumpMap: texCrepi, bumpScale: 1.5, roughness: 0.95 });
const matSocle = new THREE.MeshStandardMaterial({ color: '#8F8B84', roughness: 0.9 });
const matCadre = new THREE.MeshStandardMaterial({ color: '#F2F1EC', roughness: 0.5 });
const matVitreFenetre = new THREE.MeshStandardMaterial({ color: '#4E5A63', roughness: 0.05, metalness: 0.5, envMapIntensity: 1.2 });
const matAvantToit = new THREE.MeshStandardMaterial({ color: '#4A4440', roughness: 0.8 });

// Pavés (2 m × 2 m par motif)
const texPaves = textureCanvas(512, 512, (g, l, h) => {
  g.fillStyle = '#6F6A62';
  g.fillRect(0, 0, l, h);
  const pl = l / 10;
  const ph = h / 20;
  for (let r = 0; r < 20; r++) {
    const dec = (r % 2) * pl / 2;
    for (let c = -1; c < 11; c++) {
      const v = hasard(-14, 14);
      g.fillStyle = `rgb(${150 + v},${145 + v},${136 + v})`;
      g.fillRect(c * pl + dec + 1.5, r * ph + 1.5, pl - 3, ph - 3);
    }
  }
  for (let i = 0; i < 2500; i++) {
    g.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},0.06)`;
    g.fillRect(hasard(0, l), hasard(0, h), 1.5, 1.5);
  }
});
const matPaves = new THREE.MeshStandardMaterial({ map: texPaves, bumpMap: texPaves, bumpScale: 1.2, roughness: 0.92 });

// Gazon (2 m × 2 m par motif)
const texGazon = textureCanvas(256, 256, (g, l, h) => {
  g.fillStyle = '#7A8160';
  g.fillRect(0, 0, l, h);
  for (let i = 0; i < 5000; i++) {
    const v = hasard(-22, 22);
    g.strokeStyle = `rgba(${108 + v},${118 + v},${80 + v * 0.5},0.55)`;
    g.lineWidth = 1;
    const x = hasard(0, l);
    const y = hasard(0, h);
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + hasard(-1.5, 1.5), y - hasard(2, 5));
    g.stroke();
  }
});
texGazon.repeat.set(90, 90);
const sol = new THREE.Mesh(
  new THREE.PlaneGeometry(180, 180),
  new THREE.MeshStandardMaterial({ map: texGazon, roughness: 1, envMapIntensity: 0.3 }),
);
sol.rotation.x = -Math.PI / 2;
sol.receiveShadow = true;
scene.add(sol);

// Tuiles : une texture par teinte (rangs de tuiles dans le sens +x = vers le bas de la pente)
const cacheTuiles = {};
function texTuiles(hex) {
  if (cacheTuiles[hex]) return cacheTuiles[hex];
  const c = new THREE.Color(hex);
  const [r0, g0, b0] = [c.r * 255, c.g * 255, c.b * 255];
  cacheTuiles[hex] = textureCanvas(512, 512, (g, l, h) => {
    const rangs = 8;
    const parRang = 12;
    const cw = l / rangs;
    const th = h / parRang;
    for (let i = 0; i < rangs; i++) {
      const dec = (i % 2) * th / 2;
      for (let j = -1; j <= parRang; j++) {
        const v = hasard(-12, 12) + (Math.random() < 0.12 ? -16 : 0);
        const base = [r0 + v, g0 + v * 0.7, b0 + v * 0.5];
        const y0 = j * th + dec;
        const d = g.createLinearGradient(0, y0, 0, y0 + th);
        d.addColorStop(0, `rgb(${base[0] - 16},${base[1] - 11},${base[2] - 9})`);
        d.addColorStop(0.5, `rgb(${base[0] + 6},${base[1] + 4},${base[2] + 3})`);
        d.addColorStop(1, `rgb(${base[0] - 18},${base[1] - 12},${base[2] - 10})`);
        g.fillStyle = d;
        g.fillRect(i * cw, y0 + 1, cw, th - 2);
      }
      const o = g.createLinearGradient(i * cw + cw * 0.75, 0, (i + 1) * cw, 0);
      o.addColorStop(0, 'rgba(25,12,8,0)');
      o.addColorStop(1, 'rgba(25,12,8,0.45)');
      g.fillStyle = o;
      g.fillRect(i * cw, 0, cw, h);
    }
  });
  return cacheTuiles[hex];
}
const texTole = textureCanvas(64, 256, (g, l, h) => {
  // Profil trapézoïdal : nervure haute, flanc, plage basse (sens de la pente = x)
  const d = g.createLinearGradient(0, 0, 0, h);
  const arrets = [[0, '#d0d0d0'], [0.16, '#ffffff'], [0.22, '#7a7a7a'], [0.3, '#bdbdbd'], [0.92, '#c8c8c8'], [1, '#d0d0d0']];
  for (const [p, c] of arrets) d.addColorStop(p, c);
  g.fillStyle = d;
  g.fillRect(0, 0, l, h);
}, false);
const texPoly = textureCanvas(64, 256, (g, l, h) => {
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, l, h);
  g.fillStyle = 'rgba(0,0,0,0.25)';
  g.fillRect(0, 0, l, 6);
});
// Toit plat : gravier (gris, teinté par la couleur choisie) et végétalisé (sedum, couleurs propres)
const texGravier = textureCanvas(256, 256, (g, l, h) => {
  g.fillStyle = '#d8d8d8';
  g.fillRect(0, 0, l, h);
  for (let i = 0; i < 6000; i++) {
    const v = hasard(150, 255);
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.beginPath();
    g.ellipse(hasard(0, l), hasard(0, h), hasard(0.8, 2.4), hasard(0.6, 1.8), hasard(0, 3), 0, Math.PI * 2);
    g.fill();
  }
}, false);
const texVegetal = textureCanvas(256, 256, (g, l, h) => {
  g.fillStyle = '#5d6b3a';
  g.fillRect(0, 0, l, h);
  const teintes = ['#7c8f45', '#9aa856', '#6a7b3c', '#8e5a3c', '#a9a35a', '#4f5e30'];
  for (let i = 0; i < 7000; i++) {
    g.fillStyle = teintes[Math.floor(Math.random() * teintes.length)];
    g.beginPath();
    g.arc(hasard(0, l), hasard(0, h), hasard(0.8, 2.2), 0, Math.PI * 2);
    g.fill();
  }
});

// ---------- Véhicules (modèles CC0 rhabillés avec des matériaux réalistes) ----------

const matVitre = new THREE.MeshPhysicalMaterial({ color: '#0D1013', roughness: 0.06, metalness: 0.1, clearcoat: 0.6, envMapIntensity: 0.7 });
const matPneu = new THREE.MeshStandardMaterial({ color: '#1B1B1B', roughness: 0.92 });
const matJante = new THREE.MeshStandardMaterial({ color: '#B9BCBF', roughness: 0.25, metalness: 0.9 });
const matFeuArriere = new THREE.MeshStandardMaterial({ color: '#7A1010', roughness: 0.3, emissive: '#3A0505' });
const matPhare = new THREE.MeshStandardMaterial({ color: '#E8ECEF', roughness: 0.1, metalness: 0.4 });
const matPlastique = new THREE.MeshStandardMaterial({ color: '#232426', roughness: 0.65 });
const matChrome = new THREE.MeshStandardMaterial({ color: '#C9CCCF', roughness: 0.2, metalness: 0.9 });
const peinture = (couleur) => new THREE.MeshPhysicalMaterial({
  color: couleur, roughness: 0.36, metalness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.12, envMapIntensity: 0.7,
});
const matPeintureSeconde = peinture('#8B2E2A');

// Ombre douce sous les véhicules (dégradé, plus sombre au centre)
const matOmbreVoiture = new THREE.MeshBasicMaterial({
  map: textureCanvas(128, 256, (g, l, h) => {
    // Ellipse qui remplit le canevas : cercle étiré ×2 en hauteur, transparent sur tous les bords
    g.setTransform(1, 0, 0, 2, 0, 0);
    const d = g.createRadialGradient(l / 2, h / 4, 4, l / 2, h / 4, l / 2);
    d.addColorStop(0, 'rgba(0,0,0,0.55)');
    d.addColorStop(0.6, 'rgba(0,0,0,0.32)');
    d.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = d;
    g.fillRect(0, 0, l, h / 2);
  }),
  transparent: true,
  depthWrite: false,
});

const modeles = {};
const chargeur = new FBXLoader();

function chargerVehicule(id) {
  const v = CONFIG.vehicules[id];
  if (!v?.fichier || id in modeles) return;
  modeles[id] = null;
  chargeur.load(v.fichier, (obj) => {
    modeles[id] = preparerModele(obj, v);
    construire();
  }, undefined, () => { modeles[id] = false; });
}

function preparerModele(obj, v) {
  const taille = new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3());
  const sz = v.longueur / taille.z;
  obj.scale.set(v.largeur / taille.x, sz * v.ratioH, sz);
  obj.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(obj);
  obj.position.set(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2);
  const matCaisse = peinture(v.couleur);
  const remplacer = (m) => {
    const n = m.name.toLowerCase();
    if (n === 'body black') return matPlastique;
    if (n === 'body white') return matChrome;
    if (n.startsWith('body')) return matCaisse;
    if (n === 'windows') return matVitre;
    if (n === 'headlights') return matPhare;
    if (n === 'rear lights') return matFeuArriere;
    if (n === 'wheels') return matJante;
    if (n === 'tires') return matPneu;
    return m;
  };
  obj.traverse((o) => {
    if (!o.isMesh) return;
    // Pas d'ombre portée (le modèle anguleux faisait un bloc noir sur le sol et la paroi) : ombre douce posée au sol à la place
    o.castShadow = false;
    o.receiveShadow = true;
    o.userData.partage = true;
    o.material = Array.isArray(o.material) ? o.material.map(remplacer) : remplacer(o.material);
  });
  const conteneur = new THREE.Group();
  conteneur.add(obj);
  const ombre = new THREE.Mesh(new THREE.PlaneGeometry(v.largeur + 0.5, v.longueur + 0.6), matOmbreVoiture);
  ombre.rotation.x = -Math.PI / 2;
  ombre.position.y = 0.006;
  ombre.renderOrder = 1;
  ombre.userData.partage = true;
  conteneur.add(ombre);
  conteneur.userData.caisse = matCaisse;
  return conteneur;
}

function placerVehicule(id, x, z, autreCouleur) {
  const modele = modeles[id];
  if (!modele) {
    chargerVehicule(id);
    return;
  }
  const v = modele.clone(true);
  if (autreCouleur) {
    v.traverse((o) => {
      if (!o.isMesh) return;
      const swap = (m) => (m === modele.userData.caisse ? matPeintureSeconde : m);
      o.material = Array.isArray(o.material) ? o.material.map(swap) : swap(o.material);
    });
  }
  // L'avant des modèles est vers +z : la voiture montre son avant côté entrée (garée en marche arrière)
  v.position.set(x, Y_SOL, z);
  groupe.add(v);
}

// ---------- Construction de la scène ----------

const groupe = new THREE.Group();
scene.add(groupe);
const groupeCotes = new THREE.Group();
sceneCotes.add(groupeCotes);
let etiquettes = [];
let cotesVisibles = true;
let temporaires = [];

function vider(obj) {
  obj.traverse((o) => {
    if (o.geometry && !o.userData.partage) o.geometry.dispose();
  });
  obj.clear();
}

function ajouter(geo, mat, x, y, z, ombre = true, parent = groupe) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = ombre;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

const boite = (w, h, d, mat, x, y, z, ombre = true) => ajouter(new THREE.BoxGeometry(w, h, d), mat, x, y, z, ombre);

// Pièce de charpente aux arêtes légèrement arrondies
function piece(w, h, d, mat, x, y, z) {
  const r = Math.min(0.01, Math.min(w, h, d) / 2 - 0.001);
  return ajouter(new RoundedBoxGeometry(w, h, d, 2, r), mat, x, y, z);
}

// Bardage à lames verticales entre deux points au sol, haut des lames donné par yHaut(x, z)
function bardageV(x1, z1, x2, z2, yHaut, porte, yDepart = Y_SOL + 0.1) {
  const long = Math.hypot(x2 - x1, z2 - z1);
  const n = Math.max(1, Math.round(long / 0.135));
  const pas = long / n;
  const dx = (x2 - x1) / long;
  const dz = (z2 - z1) / long;
  const rot = -Math.atan2(dz, dx);
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) * pas;
    const x = x1 + dx * u;
    const z = z1 + dz * u;
    let yBas = yDepart;
    if (porte && Math.abs(u - porte.u) < porte.l / 2) yBas = Math.max(yBas, Y_SOL + porte.h + 0.08);
    const yH = yHaut(x, z);
    if (yH - yBas < 0.05) continue;
    boite(pas - 0.006, yH - yBas, 0.022, matBoisV, x, (yBas + yH) / 2, z).rotation.y = rot;
    // Couvre-joint une lame sur deux
    if (i % 2 === 1) {
      const cj = boite(0.05, yH - yBas, 0.018, matBoisV, x - (dx * pas) / 2, (yBas + yH) / 2, z);
      cj.rotation.y = rot;
      cj.translateZ(0.018);
    }
  }
}

// Bardage à lames horizontales ; la partie en pente (pignon) est finie en lames verticales
function bardageH(x1, z1, x2, z2, yHaut, porte) {
  const long = Math.hypot(x2 - x1, z2 - z1);
  const dx = (x2 - x1) / long;
  const dz = (z2 - z1) / long;
  const rot = -Math.atan2(dz, dx);
  let yMin = Infinity;
  for (let i = 0; i <= 24; i++) yMin = Math.min(yMin, yHaut(x1 + (dx * long * i) / 24, z1 + (dz * long * i) / 24));
  const hl = 0.14;
  let y = Y_SOL + 0.1;
  for (; y + hl <= yMin + 0.001; y += hl + 0.008) {
    const morceaux = porte && y < Y_SOL + porte.h + 0.05
      ? [[0, porte.u - porte.l / 2], [porte.u + porte.l / 2, long]]
      : [[0, long]];
    for (const [u1, u2] of morceaux) {
      if (u2 - u1 < 0.05) continue;
      const u = (u1 + u2) / 2;
      boite(u2 - u1, hl, 0.022, matBois, x1 + dx * u, y + hl / 2, z1 + dz * u).rotation.y = rot;
    }
  }
  bardageV(x1, z1, x2, z2, yHaut, null, y);
}

function paroi(...args) {
  if (state.bardage === 'horizontal') bardageH(...args);
  else bardageV(...args);
}

function porteLocal(x, z, rotY) {
  const porte = new THREE.Group();
  ajouter(new RoundedBoxGeometry(0.86, 2.0, 0.045, 2, 0.01), matBoisFonce, 0, Y_SOL + 1.1, 0, true, porte);
  for (const yb of [0.45, 1.75]) ajouter(new THREE.BoxGeometry(0.76, 0.12, 0.02), matBoisFonce, 0, Y_SOL + yb, 0.03, true, porte);
  ajouter(new THREE.BoxGeometry(0.03, 0.2, 0.04), matMetal, 0.31, Y_SOL + 1.05, 0.05, true, porte);
  porte.position.set(x, 0, z);
  porte.rotation.y = rotY;
  groupe.add(porte);
}

// Façade de maison contre laquelle le carport est fixé (contexte, pas dans le prix)
function facade(g) {
  const s = g.maison(-1) ? -1 : 1;
  const ep = 0.35;
  const longueur = g.L + 9;
  const hauteur = 5.6;
  const zc = 1.2;
  const x = s * (g.W / 2 + ep / 2);
  boite(ep, hauteur, longueur, matCrepi, x, hauteur / 2, zc);
  boite(ep + 0.02, 0.4, longueur + 0.02, matSocle, x, 0.2, zc);
  boite(1.1, 0.18, longueur + 1.2, matAvantToit, x - s * 0.3, hauteur + 0.05, zc);
  // Fenêtres hors de la zone du carport (rez) et à l'étage
  const xf = s * (g.W / 2 - 0.005);
  const fenetre = (z, y, l, h) => {
    boite(0.05, h + 0.12, l + 0.12, matCadre, xf, y, z);
    boite(0.06, h, l, matVitreFenetre, xf - s * 0.005, y, z);
  };
  fenetre(-g.L / 2 - 2.2, 1.6, 1.2, 1.3);
  fenetre(g.L / 2 + 2.6, 1.6, 1.2, 1.3);
  for (const z of [-g.L / 4, g.L / 4]) fenetre(z, 4.4, 1.1, 1.1);
}

function construire() {
  vider(groupe);
  for (const m of temporaires) { m.map?.dispose(); m.dispose(); }
  temporaires = [];

  const g = geometrie();
  const { W, L, xR, zR, a, ySup, y0, deuxPans, xF, aG, aD, zCloison, sens } = g;
  const couv = CONFIG.couvertures[state.couverture];
  const teinteCouv = couv.teintes[state.teinteCouverture].couleur;
  groupe.position.copy(g.decalage);

  const teinte = CONFIG.bois[state.bois].couleur;
  matBois.color.set(teinte);
  matBoisV.color.set(teinte);
  matBoisFonce.color.set(teinte).multiplyScalar(0.7);

  // Base : pavés sous le carport + allée devant, bordures
  const allee = 4;
  const largP = W + 0.6;
  const longP = L + 0.6 + allee;
  const zP = allee / 2;
  const paves = boite(largP, 0.06, longP, matPaves.clone(), 0, Y_SOL - 0.03, zP, false);
  paves.material.map = texPaves.clone();
  paves.material.map.needsUpdate = true;
  paves.material.map.repeat.set(largP / 2, longP / 2);
  paves.material.bumpMap = paves.material.map;
  temporaires.push(paves.material);
  for (const s of [-1, 1]) {
    if (!g.maison(s)) boite(0.08, 0.08, longP, matBordure, s * (largP / 2 + 0.04), 0.04, zP, false);
  }
  boite(largP + 0.16, 0.08, 0.08, matBordure, 0, 0.04, -L / 2 - 0.34, false);

  if (g.adosse !== 'non') facade(g);

  // Poteaux sur plots béton + pieds en U métalliques (pas de poteaux côté façade)
  const lignes = [...g.lignesPoteaux.map((s) => s * xR)];
  // Poteaux de la cloison du local latéral, côté local (le bardage est côté voitures)
  if (g.lateral) lignes.push(g.xCloison + (g.posL === 'gauche' ? -P / 2 : P / 2));
  for (const x of lignes) {
    const haut = ySup(x) - BH;
    const bas = Y_SOL + 0.13;
    for (const z of g.zPoteaux) {
      boite(0.26, 0.05, 0.26, matBeton, x, Y_SOL + 0.025, z);
      boite(0.18, 0.01, 0.18, matMetal, x, Y_SOL + 0.055, z);
      for (const s of [-1, 1]) boite(0.006, 0.16, 0.1, matMetal, x + s * (P / 2 + 0.003), Y_SOL + 0.14, z);
      piece(P, haut - bas, P, matBoisV, x, bas + (haut - bas) / 2, z);
      // Contrefiches vers la sablière (sens de la longueur)
      for (const s of [-1, 1]) {
        if (Math.abs(z + s * 0.32) > zR) continue;
        piece(0.08, 0.6, 0.08, matBois, x, haut - 0.22, z + s * 0.2).rotation.x = s * Math.PI / 4;
      }
    }
    piece(P, BH, L + 0.3, matBois, x, ySup(x) - BH / 2, 0);
  }
  // Muralière fixée à la façade, avec équerres
  for (const s of [-1, 1]) {
    if (!g.maison(s)) continue;
    const x = s * xR;
    piece(P, BH, L + 0.3, matBois, x, ySup(x) - BH / 2, 0);
    for (let z = -L / 2 + 0.4; z < L / 2; z += 1.2) boite(0.1, 0.006, 0.08, matMetal, x + s * 0.01, ySup(x) - BH - 0.003, z);
  }

  // Fermes (2 pans) : entrait, poinçon et faîtière (au faîtage, décalé si le toit est asymétrique)
  if (deuxPans) {
    const hPoincon = ySup(xF) - BH - y0;
    for (const z of g.zPoteaux) {
      piece(2 * xR - P, BH * 0.8, 0.08, matBois, 0, y0 - BH * 0.4, z);
      piece(0.1, hPoincon, 0.08, matBoisV, xF, y0 + hPoincon / 2, z);
    }
    piece(0.1, BH, L + 0.3, matBois, xF, ySup(xF) - BH / 2, 0);
  }

  // Chevrons (pas de débord côté façade) ; chaque pan a sa propre pente
  const longZ = L + 2 * OVZ;
  const nChev = Math.max(2, Math.ceil(longZ / 0.65) + 1);
  const zChev = Array.from({ length: nChev }, (_, i) => -longZ / 2 + RW / 2 + (i * (longZ - RW)) / (nChev - 1));
  const cos = Math.cos(a);
  let pans;
  if (deuxPans) {
    const gauche = -(W / 2 + OV);
    const droite = W / 2 + OV;
    pans = [
      { cx: (gauche + xF) / 2, long: (xF - gauche) / Math.cos(aG), rot: aG, cs: Math.cos(aG), xBas: gauche },
      { cx: (xF + droite) / 2, long: (droite - xF) / Math.cos(aD), rot: -aD, cs: Math.cos(aD), xBas: droite },
    ];
  } else {
    const gauche = -(W / 2 + (g.maison(-1) ? -0.01 : OV));
    const droite = W / 2 + (g.maison(1) ? -0.01 : OV);
    const xBas = sens > 0 ? droite : gauche;
    const xHaut = sens > 0 ? gauche : droite;
    pans = [{ cx: (gauche + droite) / 2, long: (droite - gauche) / cos, rot: -a * sens, cs: cos, xBas, xHaut: g.adosse !== 'non' ? undefined : xHaut }];
  }

  for (const pan of pans) {
    for (const z of zChev) {
      piece(pan.long, RH, RW, matBois, pan.cx, ySup(pan.cx) + RH / 2 / pan.cs, z).rotation.z = pan.rot;
    }
  }

  // Couverture
  const profC = longZ + 0.06;
  const ep = couv.epaisseur;
  for (const pan of pans) {
    const mat = new THREE.MeshStandardMaterial({ color: teinteCouv, envMapIntensity: 0.7 });
    temporaires.push(mat);
    const longC = pan.long + (deuxPans ? 0.03 : 0);
    if (state.couverture === 'tuiles') {
      mat.color.set('#ffffff');
      mat.map = texTuiles(teinteCouv).clone();
      mat.map.needsUpdate = true;
      // Le dégradé de chaque rang doit descendre la pente
      mat.map.repeat.set((pan.rot > 0 ? -1 : 1) * longC / 2.6, profC / 2.6);
      mat.bumpMap = mat.map;
      mat.bumpScale = 1.5;
      mat.roughness = 0.88;
      mat.envMapIntensity = 0.45;
    } else if (state.couverture === 'tole') {
      mat.map = texTole.clone();
      mat.map.needsUpdate = true;
      mat.map.repeat.set(1, profC / 0.25);
      mat.bumpMap = mat.map;
      mat.bumpScale = 3;
      mat.roughness = 0.42;
      mat.metalness = 0.6;
    } else if (state.couverture === 'polycarbonate') {
      mat.map = texPoly.clone();
      mat.map.needsUpdate = true;
      mat.map.repeat.set(1, profC / 0.6);
      mat.transparent = true;
      mat.opacity = state.teinteCouverture === 'opale' ? 0.82 : 0.45;
      mat.roughness = 0.15;
      mat.depthWrite = false;
    } else if (state.couverture === 'gravier' || state.couverture === 'vegetal') {
      const vegetal = state.couverture === 'vegetal';
      mat.map = (vegetal ? texVegetal : texGravier).clone();
      mat.map.needsUpdate = true;
      mat.map.repeat.set(longC / 1.2, profC / 1.2);
      mat.bumpMap = mat.map;
      mat.bumpScale = vegetal ? 2.5 : 2;
      mat.roughness = 1;
      mat.envMapIntensity = 0.3;
      if (vegetal) mat.color.set('#ffffff');
    } else {
      mat.roughness = 0.95;
    }
    boite(longC, ep, profC, mat, pan.cx, ySup(pan.cx) + (RH + ep / 2) / pan.cs, 0, state.couverture !== 'polycarbonate')
      .rotation.z = pan.rot;

    // Planches de rive devant et derrière (suivent la pente)
    for (const s of [-1, 1]) {
      piece(pan.long + 0.02, 0.2, 0.024, matBois, pan.cx, ySup(pan.cx) + (RH / 2) / pan.cs, s * (profC / 2 + 0.012)).rotation.z = pan.rot;
    }
    // Planche d'égout le long des bords bas (et haut pour le toit à 1 pan isolé)
    for (const xb of [pan.xBas, pan.xHaut]) {
      if (xb === undefined) continue;
      piece(0.024, 0.2, profC + 0.05, matBois, xb, ySup(xb) + (RH / 2) / pan.cs - 0.02, 0);
    }
  }

  // Solin : bande métallique qui raccorde le toit à la façade
  for (const s of [-1, 1]) {
    if (!g.maison(s)) continue;
    const xs = s * (W / 2 - 0.06);
    const ys = ySup(xs) + (RH + ep) / cos + 0.01;
    boite(0.14, 0.008, profC, matZinc, xs, ys, 0);
    boite(0.008, 0.16, profC, matZinc, s * (W / 2 - 0.004), ys + 0.08, 0);
  }

  // Faîtage posé SUR la couverture (encastré pour ne pas flotter au-dessus de la pente)
  if (deuxPans) {
    const yFaite = ySup(xF) + (RH + ep) / Math.min(Math.cos(aG), Math.cos(aD));
    if (state.couverture === 'tuiles') {
      const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(teinteCouv).multiplyScalar(0.68), roughness: 0.85 });
      temporaires.push(mat);
      const geoF = new THREE.CylinderGeometry(0.11, 0.11, profC + 0.04, 18, 1, false, 0, Math.PI);
      geoF.rotateX(Math.PI / 2);
      geoF.rotateZ(Math.PI / 2);
      geoF.scale(1, 0.75, 1);
      ajouter(geoF, mat, xF, yFaite - 0.11 * Math.tan(Math.max(aG, aD)) + 0.005, 0);
    } else {
      // Faîtière en tôle pliée : deux ailes qui épousent chacune leur pente
      const mat = new THREE.MeshStandardMaterial({ color: teinteCouv, roughness: 0.4, metalness: 0.6 });
      temporaires.push(mat);
      const aile = 0.2;
      for (const [s, ang] of [[-1, aG], [1, aD]]) {
        boite(aile, 0.008, profC + 0.02, mat, xF + s * (aile / 2) * Math.cos(ang), yFaite + 0.012 - (aile / 2) * Math.sin(ang), 0)
          .rotation.z = -s * ang;
      }
    }
  }

  // Parois
  const xMur = xR + P / 2 + 0.012;
  const zArriere = -zR - P / 2 - 0.012;
  const zAvant = zR + P / 2 + 0.012;
  const hautCote = (x) => ySup(Math.sign(x) * xR);
  const hautPignon = (x) => ySup(Math.max(-xR, Math.min(xR, x)));
  const localCote = (s) => g.lateral && (s < 0 ? g.posL === 'gauche' : g.posL === 'droite');
  const xMurMin = g.maison(-1) ? -W / 2 : -xMur;
  const xMurMax = g.maison(1) ? W / 2 : xMur;

  if (state.paroiArriere || g.posL === 'arriere') paroi(xMurMax, zArriere, xMurMin, zArriere, hautPignon);
  else if (g.lateral) {
    // Arrière du local latéral seulement
    const [xa, xb] = g.posL === 'gauche' ? [g.xCloison, xMurMin] : [xMurMax, g.xCloison];
    paroi(xa, zArriere, xb, zArriere, hautPignon);
  }
  for (const s of [-1, 1]) {
    if (g.maison(s)) continue;
    const x = s * xMur;
    const actif = (s < 0 ? state.paroiGauche : state.paroiDroite) || localCote(s);
    const fin = actif ? zR + P / 2 : zCloison + P / 2;
    if (!actif && g.posL !== 'arriere') continue;
    if (s < 0) paroi(x, -zR - P / 2, x, fin, () => hautCote(x));
    else paroi(x, fin, x, -zR - P / 2, () => hautCote(x));
  }

  // Local de rangement arrière : cloison avec porte
  if (g.posL === 'arriere') {
    const zC = zCloison + P / 2 + 0.012;
    paroi(xMurMin, zC, xMurMax, zC, hautPignon, { u: -xMurMin, l: 0.9, h: 2.0 });
    porteLocal(0, zC + 0.01, 0);
  }
  // Local latéral : cloison côté voitures + façade avant avec porte
  if (g.lateral) {
    const s = g.posL === 'gauche' ? -1 : 1;
    const xC = g.xCloison + s * 0.012 * -1;
    const yCl = () => hautPignon(g.xCloison);
    if (s < 0) paroi(xC, zR + P / 2, xC, -zR - P / 2, yCl);
    else paroi(xC, -zR - P / 2, xC, zR + P / 2, yCl);
    const xExt = s < 0 ? xMurMin : xMurMax;
    const [xa, xb] = s < 0 ? [xExt, g.xCloison] : [g.xCloison, xExt];
    const centre = (xa + xb) / 2;
    paroi(xa, zAvant, xb, zAvant, hautPignon, { u: centre - xa, l: 0.9, h: 2.0 });
    porteLocal(centre, zAvant + 0.01, 0);
  }

  // Gouttières demi-rondes + descentes (côté bas du toit)
  if (state.gouttieres) {
    const bords = deuxPans ? [-1, 1] : [sens];
    for (const cote of bords) {
      const xe = cote * (W / 2 + OV + 0.1);
      const pan = deuxPans ? pans[cote < 0 ? 0 : 1] : pans[0];
      const ye = ySup(cote * (W / 2 + OV)) + RH / pan.cs - 0.12;
      const geoG = new THREE.CylinderGeometry(0.075, 0.075, profC, 18, 1, true, 0, Math.PI);
      geoG.rotateX(Math.PI / 2);
      geoG.rotateZ(-Math.PI / 2);
      ajouter(geoG, matZinc, xe, ye, 0);
      ajouter(new THREE.CylinderGeometry(0.045, 0.045, ye - Y_SOL, 14), matZinc, xe, Y_SOL + (ye - Y_SOL) / 2, -profC / 2 + 0.15);
      for (const zc of [-profC / 3, 0, profC / 3]) boite(0.16, 0.012, 0.02, matZinc, xe - cote * 0.07, ye + 0.07, zc);
    }
  }

  const xcV = (g.xMinV + g.xMaxV) / 2;

  // Éclairage LED : spots sous la charpente, entre les poteaux
  if (state.led) {
    const zs = g.zPoteaux.slice(1).map((z, i) => (z + g.zPoteaux[i]) / 2).filter((z) => z > zCloison);
    for (const z of zs) {
      const y = deuxPans ? ySup(xF) - BH - 0.012 : ySup(xcV) - 0.012;
      ajouter(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 20), matLed, deuxPans ? xF : xcV, y, z, false);
    }
  }

  // Borne de recharge côté gauche de la zone voitures (poteau, cloison ou façade)
  if (state.borne) {
    const z = g.zPoteaux.find((zz) => zz > zCloison + 0.5) ?? 0;
    const x = g.xMinV + (g.maison(-1) && g.posL !== 'gauche' ? 0.06 : P + 0.06);
    boite(0.1, 0.34, 0.24, matBorne, x, Y_SOL + 1.25, z);
    boite(0.012, 0.1, 0.12, matEcran, x + 0.055, Y_SOL + 1.33, z);
    ajouter(new THREE.TorusGeometry(0.07, 0.012, 8, 20), matPlastique, x + 0.06, Y_SOL + 1.12, z).rotation.y = Math.PI / 2;
  }

  // Véhicule(s) pour l'échelle
  if (state.vehicule !== 'aucun') {
    const zV = (zCloison + L / 2) / 2 + 0.1;
    const largV = CONFIG.vehicules[state.vehicule].largeur;
    const largZone = g.xMaxV - g.xMinV;
    if (largZone >= 2 * largV + 1.4) {
      placerVehicule(state.vehicule, xcV - largZone / 4, zV);
      placerVehicule('citadine', xcV + largZone / 4, zV, state.vehicule === 'citadine');
    } else {
      placerVehicule(state.vehicule, xcV, zV);
    }
  }

  // Soleil et ombres centrés sur le carport
  const centre = g.decalage.clone().setY(1);
  soleil.target.position.copy(centre);
  soleil.position.copy(centre).add(new THREE.Vector3(g.adosse === 'droite' ? -8 : 8, 14, 10));

  construireCotes(g);
}

// ---------- Cotes (signature : lecture « plan technique ») ----------

const COULEUR_PLAN = CONFIG.couleurs?.plan ?? '#2B4C7E';
const matCote = new THREE.LineBasicMaterial({ color: COULEUR_PLAN, depthTest: false, transparent: true, opacity: 0.9, toneMapped: false });

function construireCotes(g) {
  vider(groupeCotes);
  groupeCotes.position.copy(g.decalage);
  cotesEl.textContent = '';
  etiquettes = [];
  const { W, L, H, xR, zR } = g;
  const tick = 0.14;
  const points = [];
  const ligne = (a, b, sens) => {
    points.push(a, b);
    for (const p of [a, b]) {
      points.push(p.clone().add(sens.clone().multiplyScalar(tick)), p.clone().add(sens.clone().multiplyScalar(-tick)));
    }
  };
  const y = Y_SOL + 0.02;
  const zLargeur = L / 2 + OVZ + 0.6;
  // Cotes du côté libre (jamais dans la façade)
  const sProf = g.maison(1) ? -1 : 1;
  const xProf = sProf * (W / 2 + OV + 0.8);
  const sH = g.maison(-1) ? 1 : -1;
  const xH = sH * (xR + 0.45);
  const zH = zR + 0.35;
  ligne(new THREE.Vector3(-W / 2, y, zLargeur), new THREE.Vector3(W / 2, y, zLargeur), new THREE.Vector3(0, 0, 1));
  ligne(new THREE.Vector3(xProf, y, -L / 2), new THREE.Vector3(xProf, y, L / 2), new THREE.Vector3(1, 0, 0));
  ligne(new THREE.Vector3(xH, Y_SOL, zH), new THREE.Vector3(xH, Y_SOL + H, zH), new THREE.Vector3(1, 0, 0));

  groupeCotes.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), matCote));

  const etiquette = (texte, pos) => {
    const el = document.createElement('span');
    el.className = 'cote';
    el.textContent = texte;
    cotesEl.append(el);
    etiquettes.push({ el, pos: pos.add(g.decalage) });
  };
  etiquette(g.lateral ? `${fmtM(W)} (dont local ${fmtM(g.S)})` : fmtM(W), new THREE.Vector3(0, y, zLargeur));
  etiquette(g.posL === 'arriere' ? `${fmtM(L)} (dont local ${fmtM(g.S)})` : fmtM(L), new THREE.Vector3(xProf, y, 0));
  etiquette(`passage ${fmtM(H)}`, new THREE.Vector3(xH, Y_SOL + H / 2, zH));
  groupeCotes.visible = cotesVisibles;
}

const _v = new THREE.Vector3();
function placerEtiquettes() {
  if (!cotesVisibles) return;
  const w = viewer.clientWidth;
  const h = viewer.clientHeight;
  for (const { el, pos } of etiquettes) {
    _v.copy(pos).project(camera);
    const visible = _v.z < 1 && Math.abs(_v.x) < 1.1 && Math.abs(_v.y) < 1.1;
    el.style.display = visible ? '' : 'none';
    // Garder l'étiquette entière dans le cadre
    const demi = el.offsetWidth / 2 + 6;
    el.style.left = `${Math.min(w - demi, Math.max(demi, ((_v.x + 1) / 2) * w))}px`;
    el.style.top = `${((1 - _v.y) / 2) * h}px`;
  }
}

// ---------- Caméra ----------

let animCam = null;
let vueActive = 'troisQuarts';
let tailleCadree = 0;

function tailleScene() {
  const g = geometrie();
  return Math.max(g.W + 2, g.L + 1.5, 6);
}

function poseVue(nom) {
  const g = geometrie();
  const taille = tailleScene();
  const cible = g.decalage.clone().add(new THREE.Vector3(0, g.H * 0.55, 0.6));
  const etroit = viewer.clientWidth < viewer.clientHeight * 1.1;
  const recul = taille * (etroit ? 2.3 : 1.8) * (g.adosse !== 'non' ? 1.15 : 1);
  // Vue 3/4 du côté libre quand la maison est à droite
  const cote = g.adosse === 'droite' ? -1 : 1;
  let dir;
  if (nom === 'face') dir = new THREE.Vector3(0, 0.22, 1);
  else if (nom === 'dessus') dir = new THREE.Vector3(0, 1.45, 0.01);
  else dir = new THREE.Vector3(0.72 * cote, 0.42, 0.85);
  const pos = cible.clone().add(dir.normalize().multiplyScalar(recul * (nom === 'dessus' ? 1.3 : 1)));
  return { pos, cible, taille };
}

function allerVers(nom, instantane = false) {
  vueActive = nom;
  const { pos, cible, taille } = poseVue(nom);
  tailleCadree = taille;
  if (instantane || !controls) {
    camera.position.copy(pos);
    controls?.target.copy(cible);
    animCam = null;
    return;
  }
  animCam = { de: camera.position.clone(), deCible: controls.target.clone(), vers: pos, versCible: cible, t0: performance.now() };
}

// Recadrer seulement si le carport ne tient plus (ou devient minuscule) : le coin fixe reste visible pendant le réglage
function verifierCadrage() {
  const t = tailleScene();
  if (t > tailleCadree * 1.12 || t < tailleCadree * 0.72) allerVers(vueActive);
}

for (const b of document.querySelectorAll('[data-vue]')) {
  b.addEventListener('click', () => {
    document.querySelectorAll('[data-vue]').forEach((x) => x.classList.toggle('actif', x === b));
    allerVers(b.dataset.vue);
  });
}

$('#btn-cotes').addEventListener('click', (e) => {
  cotesVisibles = !cotesVisibles;
  e.currentTarget.setAttribute('aria-pressed', String(cotesVisibles));
  groupeCotes.visible = cotesVisibles;
  cotesEl.classList.toggle('cache', !cotesVisibles);
});

function redimensionner() {
  if (!renderer) return;
  const w = viewer.clientWidth;
  const h = viewer.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

new ResizeObserver(redimensionner).observe(viewer);

function rendu(avecCotes = true) {
  renderer.clear();
  renderer.render(scene, camera);
  if (avecCotes) {
    renderer.clearDepth();
    renderer.render(sceneCotes, camera);
  }
}

// Image 3D sans les cotes (leurs étiquettes sont en HTML et ne seraient pas dans l'image)
function capture() {
  if (!renderer) return null;
  rendu(false);
  const url = renderer.domElement.toDataURL('image/jpeg', 0.88);
  return { url, largeur: renderer.domElement.width, hauteur: renderer.domElement.height };
}

let premierRendu = false;

function boucle(t) {
  requestAnimationFrame(boucle);
  if (!renderer) return;
  if (animCam) {
    const k = Math.max(0, Math.min(1, (t - animCam.t0) / 700));
    const e = 1 - Math.pow(1 - k, 3);
    camera.position.lerpVectors(animCam.de, animCam.vers, e);
    controls.target.lerpVectors(animCam.deCible, animCam.versCible, e);
    if (k >= 1) animCam = null;
  }
  controls.update();
  rendu();
  placerEtiquettes();
  if (!premierRendu) {
    premierRendu = true;
    verifierFinChargement();
  }
}

// ---------- Écran de chargement ----------

const chargementEl = $('#chargement');
const debutChargement = performance.now();

function verifierFinChargement() {
  const vehiculePret = state.vehicule === 'aucun' || modeles[state.vehicule] !== null;
  const tropLong = performance.now() - debutChargement > 6000;
  if (premierRendu && (vehiculePret || tropLong)) {
    chargementEl.classList.add('fini');
    setTimeout(() => { chargementEl.hidden = true; }, 500);
  } else {
    setTimeout(verifierFinChargement, 150);
  }
}

if (!renderer) chargementEl.hidden = true;

// ---------- Panneau de réglages ----------

const ICONES_TOIT = {
  plat: '<svg viewBox="0 0 46 26"><path d="M4 9h38M8 9v15M38 9v15"/></svg>',
  unPan: '<svg viewBox="0 0 46 26"><path d="M4 5l38 6M8 6v18M38 10v14"/></svg>',
  deuxPans: '<svg viewBox="0 0 46 26"><path d="M3 13L23 3l20 10M8 11v13M38 11v13"/></svg>',
  asymetrique: '<svg viewBox="0 0 46 26"><path d="M3 12L15 3l28 10M8 9v15M38 11v13"/></svg>',
};

const ICONES_IMPLANTATION = {
  non: '<svg viewBox="0 0 46 26"><rect x="10" y="5" width="26" height="17"/></svg>',
  gauche: '<svg viewBox="0 0 46 26"><path d="M6 2v22" stroke-width="5"/><rect x="12" y="5" width="26" height="17"/></svg>',
  droite: '<svg viewBox="0 0 46 26"><rect x="8" y="5" width="26" height="17"/><path d="M40 2v22" stroke-width="5"/></svg>',
};

const groupesRadio = [];

// Groupe de boutons à choix unique ; les boutons sont créés une seule fois puis seulement mis à jour
function radios(selecteur, cle, entrees, rendu, { delta = true, desactive } = {}) {
  const conteneur = $(selecteur);
  conteneur.textContent = '';
  const boutons = entrees.map(([id, item]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'radio');
    b.innerHTML = rendu(id, item);
    b.addEventListener('click', () => {
      if (state[cle] === id) return;
      state[cle] = id;
      majTout();
    });
    conteneur.append(b);
    return [id, b];
  });
  const groupe = { selecteur, cle, boutons, delta, desactive, signature: entrees.map(([id]) => id).join('|') };
  const i = groupesRadio.findIndex((gr) => gr.selecteur === selecteur);
  if (i >= 0) groupesRadio[i] = groupe;
  else groupesRadio.push(groupe);
}

function ecrireDelta(el, d, toujoursPlus = false) {
  if (!el) return;
  el.classList.toggle('plus', d > 0 || toujoursPlus);
  el.textContent = Math.abs(d) < 5 ? (toujoursPlus ? '0' : '') : `${d < 0 ? '−' : ''}${fmtCHF(Math.abs(d))}`;
}

const pastille = (couleur) => `<span class="pastille" style="background:${couleur}"></span>`;

function construirePanneau() {
  const r = $('#raccourcis');
  CONFIG.raccourcis.forEach((rc, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = rc.label;
    b.title = `${fmtM(rc.largeur)} × ${fmtM(rc.profondeur)}`;
    b.setAttribute('aria-pressed', 'false');
    b.dataset.raccourci = i;
    b.addEventListener('click', () => {
      // Un raccourci peut fixer les dimensions, la forme du toit et le véhicule affiché
      for (const cle of ['largeur', 'profondeur', 'hauteur', 'toit', 'vehicule', 'rangement', 'posLocal']) {
        if (rc[cle] !== undefined) state[cle] = rc[cle];
      }
      majTout();
      allerVers(vueActive);
    });
    r.append(b);
  });

  radios('#implantations', 'adosse', Object.entries(CONFIG.implantations),
    (id, im) => `${ICONES_IMPLANTATION[id]}<span>${im.label}</span><small>${im.aide}</small>`, { delta: false });
  radios('#toits', 'toit', Object.entries(CONFIG.toits),
    (id, t) => `${ICONES_TOIT[id]}<span>${t.label}</span><small class="delta"></small>`,
    { desactive: (id) => Boolean(CONFIG.toits[id].faitage) && state.adosse !== 'non' });
  $('#toits').className = `segments segments-${Math.min(4, Object.keys(CONFIG.toits).length)}`;
  radios('#bois', 'bois', Object.entries(CONFIG.bois),
    (id, b) => `${pastille(b.couleur)}<span>${b.label}<em class="delta"></em></span>`);
  radios('#bardages', 'bardage', Object.entries(CONFIG.bardages),
    (id, b) => `<span>${b.label}</span><small class="delta"></small>`);
  radios('#pos-local', 'posLocal', Object.entries(CONFIG.positionsLocal),
    (id, p) => `<span>${p.label}</span><small class="delta"></small>`);
  radios('#profs-local', 'profLocal', CONFIG.profondeursLocal.map((v) => [v, v]),
    (id) => `<span>${fmtM(id)}</span><small class="delta"></small>`);
  radios('#vehicules', 'vehicule', Object.entries(CONFIG.vehicules),
    (id, v) => `<span>${v.label}</span>`, { delta: false });

  for (const b of document.querySelectorAll('[data-paroi]')) {
    b.addEventListener('click', () => {
      state[b.dataset.paroi] = !state[b.dataset.paroi];
      majTout();
    });
  }
}

// Listes qui dépendent d'autres choix : reconstruites seulement si leur contenu change
function majListesDependantes() {
  const permises = CONFIG.toits[state.toit].couvertures.map((id) => [id, CONFIG.couvertures[id]]);
  const groupeCouv = groupesRadio.find((gr) => gr.selecteur === '#couvertures');
  if (!groupeCouv || groupeCouv.signature !== permises.map(([id]) => id).join('|')) {
    radios('#couvertures', 'couverture', permises,
      (id, c) => `${pastille(Object.values(c.teintes)[0].couleur)}<span>${c.label}</span><em class="delta"></em>`);
  }
  const teintes = Object.entries(CONFIG.couvertures[state.couverture].teintes);
  const groupeTeinte = groupesRadio.find((gr) => gr.selecteur === '#teintes');
  if (!groupeTeinte || groupeTeinte.signature !== teintes.map(([id]) => id).join('|')) {
    radios('#teintes', 'teinteCouverture', teintes, () => '', { delta: false });
    for (const [id, b] of groupesRadio.find((gr) => gr.selecteur === '#teintes').boutons) {
      const t = CONFIG.couvertures[state.couverture].teintes[id];
      b.style.background = t.couleur;
      b.title = t.label;
      b.setAttribute('aria-label', t.label);
    }
  }
  $('#nom-teinte').textContent = `· ${CONFIG.couvertures[state.couverture].teintes[state.teinteCouverture].label}`;
  $('#aide-toit').hidden = state.adosse === 'non';
}

function majRadios(prixActuel) {
  for (const gr of groupesRadio) {
    for (const [id, b] of gr.boutons) {
      b.setAttribute('aria-checked', String(state[gr.cle] === id));
      const off = gr.desactive?.(id) ?? false;
      b.disabled = off;
      if (gr.delta) {
        const el = b.querySelector('.delta');
        if (off) el.textContent = '';
        else ecrireDelta(el, prixSi({ [gr.cle]: id }) - prixActuel);
      }
    }
  }
  for (const b of document.querySelectorAll('[data-raccourci]')) {
    const rc = CONFIG.raccourcis[b.dataset.raccourci];
    const actif = ['largeur', 'profondeur', 'hauteur', 'toit', 'rangement', 'posLocal'].every((cle) => rc[cle] === undefined || rc[cle] === state[cle]);
    b.setAttribute('aria-pressed', String(actif));
  }
}

function majParois() {
  const g = geometrie();
  const raisons = {
    paroiArriere: g.posL === 'arriere' ? 'Fermé par le local de rangement' : '',
    paroiGauche: g.maison(-1) ? 'Façade de la maison' : g.posL === 'gauche' ? 'Fermé par le local de rangement' : '',
    paroiDroite: g.maison(1) ? 'Façade de la maison' : g.posL === 'droite' ? 'Fermé par le local de rangement' : '',
  };
  for (const b of document.querySelectorAll('[data-paroi]')) {
    const cle = b.dataset.paroi;
    const force = raisons[cle];
    b.setAttribute('aria-pressed', String(state[cle] || Boolean(force)));
    b.disabled = Boolean(force);
    b.title = force;
    b.textContent = force === 'Façade de la maison' ? 'Maison' : { paroiArriere: 'Arrière', paroiGauche: 'Gauche', paroiDroite: 'Droite' }[cle];
  }
  $('#choix-local').hidden = !state.rangement;
  dessinerPlan(g);
}

// Petit plan vu de dessus : parois fermées en trait plein, côtés ouverts en pointillé
function dessinerPlan(g) {
  const s = Math.min(84 / g.W, 126 / g.L);
  const w = g.W * s;
  const l = g.L * s;
  const x0 = 60 - w / 2;
  const y0 = 75 - l / 2;
  const encre = '#1F1D1A';
  const ouvert = 'stroke="#8A8378" stroke-dasharray="3 3" stroke-width="1"';
  const ferme = `stroke="${encre}" stroke-width="4"`;
  const texteLocal = (x, y) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="8" font-family="JetBrains Mono, monospace" fill="${encre}">LOCAL</text>`;
  let svg = `<rect x="${x0}" y="${y0}" width="${w}" height="${l}" fill="#EAE4D6"/>`;
  // Local de rangement
  if (g.posL === 'arriere') {
    const h = g.S * s;
    svg += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#D3CAB8"/>`;
    svg += `<line x1="${x0}" y1="${y0 + h}" x2="${x0 + w}" y2="${y0 + h}" stroke="${encre}" stroke-width="2"/>`;
    svg += texteLocal(60, y0 + h / 2 + 3);
  } else if (g.lateral) {
    const lw = g.S * s;
    const lx = g.posL === 'gauche' ? x0 : x0 + w - lw;
    const xi = g.posL === 'gauche' ? lx + lw : lx;
    svg += `<rect x="${lx}" y="${y0}" width="${lw}" height="${l}" fill="#D3CAB8"/>`;
    svg += `<line x1="${xi}" y1="${y0}" x2="${xi}" y2="${y0 + l}" stroke="${encre}" stroke-width="2"/>`;
    svg += `<g transform="translate(${lx + lw / 2} ${75}) rotate(-90)">${texteLocal(0, 3)}</g>`;
  }
  const arriere = state.paroiArriere || g.posL === 'arriere';
  svg += `<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" ${arriere ? ferme : ouvert}/>`;
  for (const [cote, x, actif] of [[-1, x0, state.paroiGauche], [1, x0 + w, state.paroiDroite]]) {
    if (g.maison(cote)) {
      const xm = x + cote * 6;
      svg += `<rect x="${Math.min(x, xm)}" y="${y0 - 10}" width="6" height="${l + 20}" fill="#8F8B84"/>`;
      continue;
    }
    const fermeIci = actif || (g.lateral && (cote < 0 ? g.posL === 'gauche' : g.posL === 'droite'));
    svg += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + l}" ${fermeIci ? ferme : ouvert}/>`;
    if (!fermeIci && g.posL === 'arriere') svg += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + g.S * s}" ${ferme}/>`;
  }
  svg += `<line x1="${x0}" y1="${y0 + l}" x2="${x0 + w}" y2="${y0 + l}" stroke="${COULEUR_PLAN}" stroke-width="1" stroke-dasharray="1 3"/>`;
  const xs = g.lignesPoteaux.map((c) => (c < 0 ? x0 : x0 + w));
  for (const z of g.zPoteaux) {
    const py = y0 + (z + g.L / 2) * s;
    for (const px of xs) svg += `<rect x="${px - 2.5}" y="${py - 2.5}" width="5" height="5" fill="${encre}"/>`;
  }
  $('#plan-dessin').innerHTML = svg;
}

const curseurs = document.querySelectorAll('input[type="range"][data-cle]');
for (const input of curseurs) {
  const [min, max, pas] = CONFIG.limites[input.dataset.cle];
  Object.assign(input, { min, max, step: pas });
  input.addEventListener('input', () => {
    state[input.dataset.cle] = parseFloat(input.value);
    majTout({ curseur: true });
  });
  input.addEventListener('change', () => {
    majTout();
    verifierCadrage();
  });
}

const cases = document.querySelectorAll('input[type="checkbox"][data-cle]');
for (const input of cases) {
  input.addEventListener('change', () => {
    state[input.dataset.cle] = input.checked;
    majTout();
  });
}

function majCurseurs() {
  for (const input of curseurs) {
    const cle = input.dataset.cle;
    input.value = state[cle];
    const [min, max] = CONFIG.limites[cle];
    input.style.setProperty('--rempli', `${((state[cle] - min) / (max - min)) * 100}%`);
    $(`#out-${cle}`).textContent = fmtM(state[cle]);
  }
  for (const input of cases) input.checked = state[input.dataset.cle];
}

function majOptions() {
  for (const el of document.querySelectorAll('[data-delta]')) {
    const cle = el.dataset.delta;
    ecrireDelta(el, prixSi({ [cle]: true }) - prixSi({ [cle]: false }), true);
  }
}

function paroisFermees(g) {
  return [
    state.paroiArriere || g.posL === 'arriere' ? 'arrière' : null,
    g.maison(-1) ? null : state.paroiGauche || g.posL === 'gauche' ? 'gauche' : null,
    g.maison(1) ? null : state.paroiDroite || g.posL === 'droite' ? 'droite' : null,
  ].filter(Boolean);
}

// Lignes « libellé : valeur » de la configuration (résumé, demande, PDF)
function lignesConfig() {
  const g = geometrie();
  const p = prixCourant ?? calculerPrix();
  const couv = CONFIG.couvertures[state.couverture];
  const parois = paroisFermees(g);
  const implantation = g.adosse === 'non' ? 'Isolé (4 côtés libres)' : `Contre la maison, façade à ${g.adosse}`;
  return [
    ['Dimensions', `${fmtM(g.Wv)} × ${fmtM(g.Dc)} pour les véhicules · passage ${fmtM(g.H)}`],
    ['Emprise totale', `${fmtM(g.W)} × ${fmtM(g.L)} · ${fmtM2(p.surface)}`],
    ['Implantation', implantation],
    ['Toit', `${CONFIG.toits[state.toit].label} (${CONFIG.toits[state.toit].pente}°) · ${couv.label}, ${couv.teintes[state.teinteCouverture].label.toLowerCase()}`],
    ['Bois', CONFIG.bois[state.bois].label],
    ['Parois', parois.length ? `${parois.join(', ')} · ${CONFIG.bardages[state.bardage].label.toLowerCase()}` : 'aucune'],
    ['Local de rangement', g.S ? `${CONFIG.positionsLocal[g.posL].label.toLowerCase()}, ${fmtM(g.S)}, porte comprise` : 'non'],
    ['Équipements', [state.gouttieres && 'gouttières', state.led && 'éclairage LED', state.borne && 'préparation borne de recharge'].filter(Boolean).join(', ') || 'aucun'],
    ['Structure', `${p.nbPoteaux} poteaux · portée max ${fmtM(CONFIG.porteeMax)}`],
  ];
}

function resume() {
  const g = geometrie();
  const couv = CONFIG.couvertures[state.couverture];
  const parois = paroisFermees(g);
  return [
    `${fmtM(state.largeur)} × ${fmtM(state.profondeur)}`,
    g.adosse !== 'non' ? `Contre la maison (${g.adosse})` : null,
    `Toit ${CONFIG.toits[state.toit].label}`,
    `${couv.label} ${couv.teintes[state.teinteCouverture].label.toLowerCase()}`,
    CONFIG.bois[state.bois].label,
    parois.length ? `Parois : ${parois.join(', ')}` : 'Sans paroi',
    parois.length ? CONFIG.bardages[state.bardage].label : null,
    g.S ? `Local ${CONFIG.positionsLocal[g.posL].label.toLowerCase()} ${fmtM(g.S)}` : null,
    state.gouttieres ? 'Gouttières' : null,
    state.led ? 'LED' : null,
    state.borne ? 'Borne' : null,
  ].filter(Boolean);
}

let prixCourant;

function majPrix() {
  const p = calculerPrix();
  prixCourant = p;
  $('#total').textContent = fmtCHF(p.ttc);
  $('#total-mobile').textContent = fmtCHF(p.ttc);
  $('#fourchette').textContent = `Fourchette réaliste : ${fmtCHF(p.bas)} à ${fmtCHF(p.haut)} CHF selon le terrain et l'accès.`;
  const ul = $('#resume');
  ul.textContent = '';
  for (const t of resume()) {
    const li = document.createElement('li');
    li.textContent = t;
    ul.append(li);
  }
  const dl = $('#lignes');
  dl.textContent = '';
  const ajout = (titre, valeur, classe) => {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = titre;
    dd.textContent = valeur;
    if (classe) { dt.className = classe; dd.className = classe; }
    dl.append(dt, dd);
  };
  for (const [titre, v] of p.lignes) ajout(titre, fmtCHF(v));
  const sep = document.createElement('div');
  sep.className = 'sep';
  dl.append(sep);
  ajout('Total HT', fmtCHF(p.ht), 'fort');
  ajout(`TVA ${(CONFIG.tva * 100).toFixed(1).replace('.', ',')} %`, fmtCHF(p.tva));
  ajout('Total TTC', fmtCHF(p.ttc), 'fort');

  $('#note-technique').textContent =
    `${p.nbPoteaux} poteaux · portée max ${fmtM(CONFIG.porteeMax)} · surface couverte ${fmtM2(p.surface)}`;
  return p.ttc;
}

let derniereForme = '';
let demarre = false; // les réglages du chargement ne comptent pas comme une utilisation

function majTout({ curseur = false } = {}) {
  valider();
  majListesDependantes();
  majCurseurs();
  const ttc = majPrix();
  // Pendant qu'on glisse un curseur, on ne recalcule pas tous les écarts de prix (fluidité)
  if (!curseur) {
    majRadios(ttc);
    majOptions();
  }
  majParois();
  construire();
  ecrireLien();
  if (!curseur && demarre) compterReglage();
  // Recadrer quand la forme générale change (toit, maison à gauche/droite)
  const forme = `${state.toit}|${state.adosse}`;
  if (forme !== derniereForme && derniereForme) allerVers(vueActive);
  else if (!curseur) verifierCadrage();
  derniereForme = forme;
}

// ---------- Étapes sur mobile (onglets) ----------

const panel = $('#panel');
const etapes = [...document.querySelectorAll('.etape')];
const onglets = $('#onglets');
const modeMobile = window.matchMedia('(max-width: 900px)');

function allerEtape(i) {
  etapes.forEach((e, j) => e.classList.toggle('active', j === i));
  [...onglets.children].forEach((b, j) => {
    if (j === i) b.setAttribute('aria-current', 'step');
    else b.removeAttribute('aria-current');
  });
  const b = onglets.children[i];
  onglets.scrollTo({ left: b.offsetLeft - onglets.clientWidth / 2 + b.offsetWidth / 2, behavior: 'smooth' });
  if (modeMobile.matches) window.scrollTo({ top: 0, behavior: 'smooth' });
}

etapes.forEach((e, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.innerHTML = `<span>${String(i + 1).padStart(2, '0')}</span>${e.dataset.court}`;
  b.addEventListener('click', () => allerEtape(i));
  onglets.append(b);
  if (i < etapes.length - 1) {
    const suivant = document.createElement('button');
    suivant.type = 'button';
    suivant.className = 'suivant';
    suivant.textContent = `Étape suivante : ${etapes[i + 1].dataset.court} →`;
    suivant.addEventListener('click', () => allerEtape(i + 1));
    e.append(suivant);
  }
});

function majModeMobile() {
  panel.classList.toggle('par-etapes', modeMobile.matches);
  redimensionner();
}

modeMobile.addEventListener('change', majModeMobile);
majModeMobile();
allerEtape(0);

// ---------- Marque et textes ----------

$('#marque-nom').textContent = CONFIG.entreprise.nom;
$('#marque-activite').textContent = CONFIG.entreprise.activite;
$('#marque-logo').textContent = CONFIG.entreprise.initiales;

// Logo de l'entreprise (sinon : initiales). Préparé aussi en JPEG sur fond blanc pour le PDF.
let logoPDF = null;
if (CONFIG.entreprise.logo) {
  const img = new Image();
  img.alt = CONFIG.entreprise.nom;
  img.onload = () => {
    $('#marque-logo').textContent = '';
    $('#marque-logo').classList.add('avec-image');
    $('#marque-logo').append(img);
    // Logo horizontal qui contient déjà le nom : on n'affiche plus le texte à côté
    const large = img.naturalWidth / img.naturalHeight > 2;
    $('.marque').classList.toggle('logo-large', large);
    // Agrandi pour rester net dans le PDF (utile pour les logos SVG)
    const echelle = Math.max(1, 800 / img.naturalWidth);
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * echelle);
    c.height = Math.round(img.naturalHeight * echelle);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    logoPDF = { url: c.toDataURL('image/jpeg', 0.92), largeur: c.width, hauteur: c.height };
  };
  img.src = CONFIG.entreprise.logo;
}
$('#badge-demo').hidden = !CONFIG.demo;
if (CONFIG.badge) $('#badge-demo').textContent = CONFIG.badge;
if (CONFIG.chapo) $('.chapo').textContent = CONFIG.chapo;
if (CONFIG.entreprise.nom !== 'Votre entreprise') document.title = `Configurateur carport — ${CONFIG.entreprise.nom}`;
// Couleurs de l'entreprise (variables CSS)
for (const [nom, valeur] of Object.entries(CONFIG.couleurs ?? {})) document.documentElement.style.setProperty(`--${nom}`, valeur);

// ---------- Notifications à Wibzo (e-mail via Web3Forms) ----------
// Sans clé dans config.js, rien n'est envoyé. Aucune donnée personnelle sauf ce que le visiteur tape dans le formulaire.

async function signaler(sujet, message, extra = {}) {
  const cle = CONFIG.suivi?.cleWeb3Forms;
  if (!cle) return false;
  try {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: cle, subject: `[${CONFIG.entreprise.nom}] ${sujet}`, from_name: 'Configurateur 3D', message, ...extra }),
      keepalive: true,
    });
    return r.ok;
  } catch {
    return false;
  }
}

// Une seule alerte « démo utilisée » par visite, après quelques vrais réglages (évite les robots et les aperçus de lien)
let reglages = 0;
let utilisationSignalee = false;
function compterReglage() {
  reglages += 1;
  if (utilisationSignalee || reglages < 3) return;
  try {
    if (sessionStorage.getItem('demo-signalee')) { utilisationSignalee = true; return; }
    sessionStorage.setItem('demo-signalee', '1');
  } catch { /* stockage indisponible : on signale quand même une fois */ }
  utilisationSignalee = true;
  signaler('La démo est utilisée', ['Quelqu\'un configure un carport en ce moment.', '', ...lignesConfig().map(([l, v]) => `${l} : ${v}`), '', `Lien : ${location.href}`].join('\n'));
}

if (CONFIG.suivi?.cleWeb3Forms) $('#mention-suivi').hidden = false;

// ---------- Estimation PDF ----------

// Bandeau large au centre de l'image 3D (tient sur la page A4 avec tout le texte)
function bandeau(img, ratio = 2.45) {
  if (!img) return null;
  const c = document.createElement('canvas');
  const l = img.largeur;
  const h = Math.min(img.hauteur, Math.round(l / ratio));
  c.width = l;
  c.height = h;
  c.getContext('2d').drawImage(renderer.domElement, 0, (img.hauteur - h) / 2, l, h, 0, 0, l, h);
  return { url: c.toDataURL('image/jpeg', 0.88), largeur: l, hauteur: h };
}

function telechargerPDF() {
  const img = bandeau(capture());
  const p = prixCourant;
  const maintenant = new Date();
  const date = maintenant.toLocaleDateString('fr-CH');
  const ref = `EST-${maintenant.toISOString().slice(2, 10).replace(/-/g, '')}-${String(maintenant.getHours()).padStart(2, '0')}${String(maintenant.getMinutes()).padStart(2, '0')}`;
  const blob = creerPDF({
    entreprise: CONFIG.entreprise,
    demo: CONFIG.demo,
    titre: `${CONFIG.produit} sur mesure`,
    date,
    reference: ref,
    image: img,
    logo: logoPDF,
    accent: COULEUR_PLAN,
    configuration: lignesConfig(),
    prix: p.lignes.map(([t, v]) => [t, fmtCHF(v)]),
    totaux: [
      ['Total HT', fmtCHF(p.ht)],
      [`TVA ${(CONFIG.tva * 100).toFixed(1).replace('.', ',')} %`, fmtCHF(p.tva)],
    ],
    total: `${fmtCHF(p.ttc)} CHF`,
    fourchette: `Fourchette réaliste : ${fmtCHF(p.bas)} à ${fmtCHF(p.haut)} CHF TTC selon le terrain et l'accès.`,
    avertissement: $('#avertissement').textContent,
    lien: location.href,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `estimation-carport-${ref}.pdf`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  signaler(`PDF téléchargé (${ref})`, [...lignesConfig().map(([l, v]) => `${l} : ${v}`), '', `Prix affiché : ${fmtCHF(p.ttc)} CHF TTC`, `Lien : ${location.href}`].join('\n'));
}

$('#btn-pdf').addEventListener('click', telechargerPDF);
$('#btn-pdf-recap').addEventListener('click', telechargerPDF);

// ---------- Demande de devis ----------

const dialogue = $('#dialogue');
const form = $('#form-devis');
const recap = $('#recap');

function ouvrirDevis() {
  form.hidden = false;
  recap.hidden = true;
  dialogue.showModal();
}

$('#btn-devis').addEventListener('click', ouvrirDevis);
$('#btn-devis-mobile').addEventListener('click', ouvrirDevis);
for (const b of document.querySelectorAll('[data-fermer]')) b.addEventListener('click', () => dialogue.close());

function texteDemande(d) {
  const p = prixCourant;
  const date = new Date().toLocaleDateString('fr-CH');
  return [
    `DEMANDE DE DEVIS — ${CONFIG.produit} (${date})`,
    '',
    'CLIENT',
    `Nom : ${d.nom}`,
    `E-mail : ${d.email}`,
    `Téléphone : ${d.tel || '—'}`,
    `Lieu du chantier : ${d.lieu}`,
    '',
    'CONFIGURATION',
    ...lignesConfig().map(([l, v]) => `${l} : ${v}`),
    '',
    `PRIX INDICATIF AFFICHÉ : ${fmtCHF(p.ttc)} CHF TTC (fourchette ${fmtCHF(p.bas)}–${fmtCHF(p.haut)})`,
    '',
    `Remarque : ${d.remarque || '—'}`,
    '',
    `Configuration en ligne : ${location.href}`,
  ].join('\n');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const d = Object.fromEntries(new FormData(form));
  const texte = texteDemande(d);
  $('#recap-texte').textContent = texte;
  const img = capture();
  $('#recap-image').hidden = !img;
  if (img) $('#recap-image').src = img.url;
  // Copie de la demande à Wibzo (on peut répondre directement au visiteur)
  signaler(`Demande de devis de ${d.nom}`, texte, { replyto: d.email });
  const mail = $('#btn-mail');
  if (CONFIG.entreprise.email) {
    mail.hidden = false;
    mail.href = `mailto:${CONFIG.entreprise.email}?subject=${encodeURIComponent('Demande de devis carport')}&body=${encodeURIComponent(texte)}`;
    $('#recap-intro').textContent = "Voici exactement ce que l'entreprise reçoit :";
  } else {
    mail.hidden = true;
    $('#recap-intro').textContent = CONFIG.suivi?.cleWeb3Forms
      ? "Démo : la demande a été transmise à Wibzo. Sur le vrai site, l'entreprise reçoit exactement ceci :"
      : "Démo : rien n'a été envoyé. Sur le vrai site, l'entreprise reçoit exactement ceci :";
  }
  form.hidden = true;
  recap.hidden = false;
});

async function copier(texte, bouton, ok) {
  const avant = bouton.textContent;
  try {
    await navigator.clipboard.writeText(texte);
    bouton.textContent = ok;
  } catch {
    bouton.textContent = 'Copie impossible';
  }
  setTimeout(() => { bouton.textContent = avant; }, 1800);
}

$('#btn-copier').addEventListener('click', (e) => copier($('#recap-texte').textContent, e.currentTarget, 'Texte copié'));
$('#btn-lien').addEventListener('click', (e) => copier(location.href, e.currentTarget, 'Lien copié'));

// ---------- Démarrage ----------

construirePanneau();
redimensionner();
majTout();
demarre = true;
allerVers('troisQuarts', true);
for (const id of Object.keys(CONFIG.vehicules)) chargerVehicule(id);
requestAnimationFrame(boucle);
