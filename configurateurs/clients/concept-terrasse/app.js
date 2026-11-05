import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as CFG from './config.js';
import { creerPDF } from './pdf.js';
import { creerDecor } from './decor.js';
import { creerModeles } from './produits3d.js';

const { CONFIG } = CFG;
// Assistant (démo publique) : choix du produit puis une étape à la fois, prix et Retour / Suivant en bas
const ASSISTANT = Boolean(CONFIG.assistant);
const PRODUITS = CFG.PRODUITS;

const $ = (s) => document.querySelector(s);
const nf = new Intl.NumberFormat('fr-CH', { maximumFractionDigits: 0 });
const fmtM = (v) => v.toFixed(2).replace('.', ',') + ' m';
// Espace insécable normale (l'espace fine de fr-CH est presque invisible en petit)
const fmtCHF = (v) => nf.format(Math.round(v)).replace(/ /g, ' ');
const fmtM2 = (v) => v.toFixed(1).replace('.', ',') + ' m²';
const arrondi10 = (v) => Math.round(v / 10) * 10;
const arrondi50 = (v) => Math.round(v / 50) * 50;
const hasard = (min, max) => min + Math.random() * (max - min);

// Structure en aluminium thermolaqué (sinon charpente bois) : voir `materiau` dans config.js
const ALU = CONFIG.materiau === 'alu';
// Véranda : pièce vitrée contre la maison, tous les côtés libres fermés et façade avant vitrée
const VERANDA = Boolean(CONFIG.veranda);
const EQUIPEMENTS = CONFIG.equipements ?? ['gouttieres', 'led', 'borne'];
const LOCAL = CONFIG.local !== false; // local de rangement proposé
const VEHICULES = Object.values(CONFIG.vehicules).some((v) => v.fichier); // au moins un véhicule à afficher
// Maison complète + jardin autour du produit (`decor: false` dans config.js = ancien décor : façade seule)
const DECOR = CONFIG.decor !== false;
// Pergola, véranda : produit sur la terrasse, contre la façade arrière (vue plus de face)
const TERRASSE_DECOR = DECOR && CONFIG.sol === 'terrasse';
// Modèle 3D dédié (produits3d.js) : 'veranda' ou 'pergolaBio' ; sinon charpente générique (carport, pergola bois)
const MODELE = CONFIG.modele3d ?? null;
// Terrasse (04.11.2026) : plancher bois / composite / grès, marches et garde-corps (prix et textes propres)
const TERRASSE = CONFIG.type === 'terrasse';
// Côté des marches : côté libre opposé à la maison (ou devant si la terrasse est isolée)
const coteMarches = (adosse) => (adosse === 'gauche' ? 'paroiDroite' : adosse === 'droite' ? 'paroiGauche' : 'paroiAvant');
const nbMarches = (H) => (H <= (CONFIG.hauteurSansMarche ?? 0.2) ? 0 : Math.ceil(H / (CONFIG.hauteurMarche ?? 0.18)) - 1 || 1);
// Équipements possibles (chacun s'affiche seulement si l'entreprise le propose : `equipements` dans config.js)
const TOUS_EQUIPEMENTS = ['gouttieres', 'led', 'borne', 'chauffage', 'storeToit'];

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
  if (!CONFIG.implantations[state.adosse]) state.adosse = CONFIG.implantations.non ? 'non' : CONFIG.defauts.adosse;
  if (VERANDA) { state.paroiArriere = true; state.paroiGauche = true; state.paroiDroite = true; }
  if (!LOCAL) state.rangement = false;
  if (!CONFIG.toits[state.toit]) state.toit = CONFIG.defauts.toit;
  // Contre une façade, le toit descend à l'opposé de la maison : pas de 2 pans
  if (state.adosse !== 'non' && CONFIG.toits[state.toit].faitage) {
    state.toit = Object.keys(CONFIG.toits).find((id) => !CONFIG.toits[id].faitage) ?? state.toit;
  }
  // Équipements que l'entreprise ne propose pas : toujours désactivés (même via un lien)
  for (const cle of TOUS_EQUIPEMENTS) if (!EQUIPEMENTS.includes(cle)) state[cle] = false;
  if (!CONFIG.paroiAvant) state.paroiAvant = false;
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
// Alu : cadre presque à fleur des poteaux, bandeau plus haut qui cache la couverture
const OV = ALU ? 0.03 : 0.35;  // débord de toit sur les côtés
const OVZ = ALU ? 0.03 : 0.2;  // débord de toit devant / derrière
const HAUT_RIVE = ALU ? 0.27 : 0.2; // hauteur des planches de rive / du bandeau alu
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

// Terrasse : revêtement + sous-structure (plus chère quand le plancher est haut), habillage des côtés, marches, garde-corps
function prixTerrasse(g) {
  const T = CONFIG.tarifs;
  const pose = CONFIG.bois[state.bois];
  const couv = CONFIG.couvertures[state.couverture];
  const surface = g.W * g.L;
  const lignes = [];
  lignes.push([`${couv.label} · ${fmtM2(surface)}`, surface * T.revetementM2[state.couverture] * pose.facteur]);
  lignes.push([`Sous-structure, plancher à ${fmtM(g.H)}`, surface * (T.structureM2 + g.H * T.structureHauteurM2)]);
  // Côtés libres (pas contre la maison) : longueur et habillage quand le plancher est surélevé
  const cotes = { paroiArriere: g.W, paroiAvant: g.W, paroiGauche: g.L, paroiDroite: g.L };
  const libre = (cle) => !(cle === 'paroiGauche' && g.maison(-1)) && !(cle === 'paroiDroite' && g.maison(1));
  const perimetreLibre = Object.keys(cotes).filter(libre).reduce((s, c) => s + cotes[c], 0);
  if (g.H > 0.12) lignes.push([`Habillage des côtés · ${fmtM(perimetreLibre)}`, perimetreLibre * g.H * T.habillageM2]);
  const n = nbMarches(g.H);
  if (n) lignes.push([`Marches d'accès (${n})`, n * T.marche]);
  const gc = CONFIG.bardages[state.bardage];
  const ouverture = n ? (CONFIG.largeurMarches ?? 1.4) : 0;
  let longGC = 0;
  for (const cle of Object.keys(cotes)) {
    if (state[cle] && libre(cle)) longGC += cotes[cle] - (cle === coteMarches(g.adosse) ? ouverture : 0);
  }
  if (longGC > 0) lignes.push([`${LIB.paroiLigne} ${gc.label.toLowerCase()} · ${fmtM(longGC)}`, longGC * T.gardeCorpsMl * gc.facteur]);
  if (state.led) lignes.push(['Éclairage LED encastré', T.led]);
  const materiel = lignes.reduce((s, [, v]) => s + v, 0);
  lignes.push(['Livraison et pose', Math.max(T.poseMin, materiel * T.poseTaux)]);
  const ht = lignes.reduce((s, [, v]) => s + v, 0);
  const tva = ht * CONFIG.tva;
  const ttc = arrondi10(ht + tva);
  return {
    lignes, ht, tva, ttc,
    bas: arrondi50(ttc * (1 - CONFIG.fourchette)),
    haut: arrondi50(ttc * (1 + CONFIG.fourchette)),
    nbPoteaux: 0, surface, marches: n, longGC,
  };
}

function calculerPrix() {
  const g = geometrie();
  if (TERRASSE) return prixTerrasse(g);
  const T = CONFIG.tarifs;
  const toit = CONFIG.toits[state.toit];
  const bois = CONFIG.bois[state.bois];
  const fBardage = CONFIG.bardages[state.bardage].facteur * bois.facteur;
  const surface = g.W * g.L;
  const lignes = [];

  const fStructure = g.adosse !== 'non' ? T.adosseFacteur : 1;
  lignes.push([`Structure, toit ${toit.label} · ${fmtM2(surface)}`, surface * T.structureM2[state.toit] * bois.facteur * fStructure]);
  if (T.couvertureM2[state.couverture]) lignes.push([CONFIG.couvertures[state.couverture].label, surface * T.couvertureM2[state.couverture]]);
  if (g.adosse !== 'non') lignes.push([CONFIG.couvertures[state.couverture].ouverte ? 'Fixation à la façade' : 'Fixation à la façade et solin', g.L * T.fixationMl]);

  const hMur = g.H + BH;
  const localCote = (s) => g.lateral && (s < 0 ? g.posL === 'gauche' : g.posL === 'droite');
  if (VERANDA) {
    // Véranda : 2 pignons vitrés (perpendiculaires à la maison) + façade côté jardin en baies coulissantes
    lignes.push(['Pignons vitrés (2 côtés)', 2 * g.W * hMur * T.paroiM2 * fBardage]);
    lignes.push(['Façade côté jardin, baies coulissantes', g.L * hMur * T.paroiM2 * fBardage + (T.porteCoulissante ?? 0)]);
  } else {
    const nom = `${LIB.paroiLigne} ${CONFIG.bardages[state.bardage].label.toLowerCase()}`;
    if (state.paroiArriere && g.posL !== 'arriere') lignes.push([`${nom} · arrière`, g.Wv * hMur * T.paroiM2 * fBardage]);
    if (state.paroiAvant) lignes.push([`${nom} · avant`, g.Wv * hMur * T.paroiM2 * fBardage]);
    if (state.paroiGauche && !g.maison(-1) && !localCote(-1)) lignes.push([`${nom} · gauche`, g.Dc * hMur * T.paroiM2 * fBardage]);
    if (state.paroiDroite && !g.maison(1) && !localCote(1)) lignes.push([`${nom} · droite`, g.Dc * hMur * T.paroiM2 * fBardage]);
  }
  if (g.S) {
    const aire = g.S * (g.lateral ? g.L : g.W);
    lignes.push([`${LIB.rangementLigne} · ${fmtM(g.S)} (${CONFIG.positionsLocal[g.posL].label.toLowerCase()})`, aire * T.rangementM2 * fBardage]);
  }
  if (state.gouttieres) {
    const n = g.deuxPans ? 2 : 1;
    lignes.push(['Gouttières et descentes', g.L * n * T.gouttiereMl + T.descente * n]);
  }
  if (state.led) lignes.push(['Éclairage LED', T.led]);
  if (state.borne) lignes.push(['Préparation borne de recharge', T.borne]);
  if (state.chauffage) lignes.push(['Chauffage infrarouge (2 radiants)', T.chauffage ?? 0]);
  if (state.storeToit) lignes.push([`Stores de toiture motorisés · ${fmtM2(surface)}`, surface * (T.storeToitM2 ?? 0)]);

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
let envJour = null;

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

// Qualité selon l'appareil : petits écrans / peu de mémoire = ombres plus légères, moins de pixels
const PETIT_APPAREIL = window.matchMedia('(max-width: 900px)').matches || (navigator.deviceMemory ?? 8) <= 4;

// Ciel : dégradé derrière la scène (le bas = couleur de la brume, l'horizon disparaît)
const HORIZON = '#E6E2D8';
const cielJour = textureCanvas(4, 512, (g, l, h) => {
  const d = g.createLinearGradient(0, 0, 0, h);
  d.addColorStop(0, '#A9BBC8');
  d.addColorStop(0.35, '#CBD3D6');
  d.addColorStop(0.62, '#E2E1DA');
  d.addColorStop(1, HORIZON);
  g.fillStyle = d;
  g.fillRect(0, 0, l, h);
});
const HORIZON_NUIT = '#2A3242';
const cielNuit = textureCanvas(4, 512, (g, l, h) => {
  const d = g.createLinearGradient(0, 0, 0, h);
  d.addColorStop(0, '#0B1322');
  d.addColorStop(0.55, '#1B2436');
  d.addColorStop(1, HORIZON_NUIT);
  g.fillStyle = d;
  g.fillRect(0, 0, l, h);
});
scene.background = cielJour;
// Avec la maison et le jardin, la brume commence plus loin (elle ne voile que le lointain)
scene.fog = DECOR ? new THREE.Fog(HORIZON, 34, 110) : new THREE.Fog(HORIZON, 22, 60);

if (renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, PETIT_APPAREIL ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // AgX : couleurs plus naturelles que ACES (le bois ne vire plus au jaune, les tuiles moins saturées)
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.autoClear = false;
  viewer.prepend(renderer.domElement);

  const pmrem = new THREE.PMREMGenerator(renderer);
  envJour = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  scene.environment = envJour;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.minDistance = 3.5;
  controls.maxDistance = DECOR ? 48 : 34;
  controls.autoRotateSpeed = 0.7;
  controls.addEventListener('start', () => { animCam = null; });
  // Pas d'occlusion ambiante (GTAO) : elle faisait apparaître un bloc sombre sur le sol et la paroi du fond
}

const ciel = new THREE.HemisphereLight('#EEF2F5', '#7D7A62', 0.3);
scene.add(ciel);
const soleil = new THREE.DirectionalLight('#FFF1DC', 3.4);
soleil.castShadow = true;
// La maison et les arbres doivent aussi porter leur ombre : zone d'ombre plus grande, carte plus fine
const ZONE_OMBRE = DECOR ? 21 : 11;
soleil.shadow.mapSize.setScalar(DECOR ? (PETIT_APPAREIL ? 2048 : 4096) : (PETIT_APPAREIL ? 1024 : 2048));
Object.assign(soleil.shadow.camera, { left: -ZONE_OMBRE, right: ZONE_OMBRE, top: ZONE_OMBRE, bottom: -ZONE_OMBRE, near: 1, far: 70 });
soleil.shadow.bias = -0.0003;
soleil.shadow.normalBias = 0.025;
soleil.shadow.radius = 3;
scene.add(soleil, soleil.target);
// ?debug dans l'adresse : accès à la scène depuis la console (réglages du rendu)
if (new URLSearchParams(location.search).has('debug')) window.__dbg = { scene, soleil, camera, renderer, THREE };

// Vue de nuit : spots LED du carport qui éclairent vraiment (nombre fixe de lumières : pas de recompilation)
let nuit = false;
let positionsLed = [];
const spots = PETIT_APPAREIL ? [] : Array.from({ length: 4 }, () => {
  const s = new THREE.SpotLight('#FFE2B8', 0, 7, 1.0, 0.6, 1.4);
  scene.add(s, s.target);
  return s;
});
function placerSpots() {
  spots.forEach((s, i) => {
    const p = positionsLed[i];
    if (p) {
      s.position.copy(p);
      s.target.position.copy(p).setY(0);
    }
    s.intensity = nuit && p ? 14 : 0;
  });
}

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
// Alu thermolaqué : mêmes pièces que la charpente, sans veinage, finition satinée
if (ALU) {
  for (const m of [matBois, matBoisV, matBoisFonce]) {
    Object.assign(m, { map: null, bumpMap: null, roughness: 0.48, metalness: 0.45, envMapIntensity: 0.8 });
  }
}
// Parois : même matériau que la charpente, sauf lames composite (alu) ou bardage avec sa propre teinte (`bardages[].couleur`)
const PAROI_PROPRE = ALU || Object.values(CONFIG.bardages).some((b) => b.couleur);
const optParoi = ALU ? { ...optBois, bumpScale: 0.25, roughness: 0.6 } : optBois;
const matParoi = PAROI_PROPRE ? new THREE.MeshStandardMaterial({ ...optParoi, map: texVeinage, bumpMap: texVeinage }) : matBois;
const matParoiV = PAROI_PROPRE ? new THREE.MeshStandardMaterial({ ...optParoi, map: texVeinageV, bumpMap: texVeinageV }) : matBoisV;
// Chaque pièce / lame reçoit une nuance et un veinage à elle (voir varierPiece) : bois ±7 %, alu presque uniforme
const VARIATION = ALU ? 0.015 : 0.07;
for (const m of new Set([matBois, matBoisV, matBoisFonce, matParoi, matParoiV])) m.vertexColors = true;
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

// Terrasse en lames de bois (2 m × 2 m par motif) : `sol: 'terrasse'` dans config.js
const texTerrasse = textureCanvas(512, 512, (g, l, h) => {
  g.fillStyle = '#5E4532';
  g.fillRect(0, 0, l, h);
  const n = 14;
  const lh = h / n;
  for (let r = 0; r < n; r++) {
    const coupe = hasard(0.25, 0.75) * l;
    for (const [x0, x1] of [[0, coupe], [coupe, l]]) {
      const v = hasard(-16, 16);
      g.fillStyle = `rgb(${158 + v},${118 + v * 0.8},${82 + v * 0.6})`;
      g.fillRect(x0 + 1, r * lh + 2, x1 - x0 - 2, lh - 4);
      for (let k = 0; k < 6; k++) {
        g.fillStyle = `rgba(80,52,30,${hasard(0.06, 0.16)})`;
        g.fillRect(x0 + 1, r * lh + hasard(3, lh - 4), x1 - x0 - 2, 1);
      }
    }
  }
});

// Gazon (2 m × 2 m par motif)
const texGazon = textureCanvas(256, 256, (g, l, h) => {
  g.fillStyle = '#6F8350';
  g.fillRect(0, 0, l, h);
  for (let i = 0; i < 6000; i++) {
    const v = hasard(-22, 22);
    g.strokeStyle = `rgba(${100 + v},${128 + v},${72 + v * 0.5},0.6)`;
    g.lineWidth = 1;
    const x = hasard(0, l);
    const y = hasard(0, h);
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + hasard(-1.5, 1.5), y - hasard(2, 5));
    g.stroke();
  }
});
texGazon.repeat.set(40, 40);
// Taches claires / sombres à grande échelle : casse la répétition du motif de gazon
const texTaches = textureCanvas(256, 256, (g, l, h) => {
  g.fillStyle = '#808080';
  g.fillRect(0, 0, l, h);
  for (let i = 0; i < 60; i++) {
    const x = hasard(0, l);
    const y = hasard(0, h);
    const r = hasard(12, 46);
    const clair = Math.random() < 0.5;
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, clair ? 'rgba(255,255,235,0.22)' : 'rgba(30,40,10,0.22)');
    rg.addColorStop(1, 'rgba(128,128,128,0)');
    g.fillStyle = rg;
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
});
texTaches.repeat.set(3, 3);
// Le gazon s'efface en douceur vers le bord (plus de ligne d'horizon nette)
const texFondu = textureCanvas(256, 256, (g, l, h) => {
  const d = g.createRadialGradient(l / 2, h / 2, l * 0.18, l / 2, h / 2, l / 2);
  d.addColorStop(0, '#ffffff');
  d.addColorStop(1, '#000000');
  g.fillStyle = d;
  g.fillRect(0, 0, l, h);
}, false);
const matSol = new THREE.MeshStandardMaterial({ map: texGazon, alphaMap: texFondu, transparent: true, depthWrite: false, roughness: 1, envMapIntensity: 0.3 });
// Pelouse plus grande avec le décor (le jardin + les champs autour), même finesse du gazon
const TAILLE_SOL = DECOR ? 170 : 80;
texGazon.repeat.set(TAILLE_SOL / 2, TAILLE_SOL / 2);
if (DECOR) matSol.color.setRGB(1.02, 1.24, 0.78); // gazon plus clair et plus vert
// Les taches multiplient la couleur du gazon (2e texture, sans toucher au matériau de base).
// Avec le décor : bandes de tonte claires / foncées de 1,6 m (discrètes)
const tonte = DECOR ? `diffuseColor.rgb *= mix(0.94, 1.045, step(0.5, fract(vAlphaMapUv.x * ${(TAILLE_SOL / 3.2).toFixed(2)})));` : '';
matSol.onBeforeCompile = (s) => {
  s.uniforms.tTaches = { value: texTaches };
  s.fragmentShader = s.fragmentShader
    .replace('#include <common>', '#include <common>\nuniform sampler2D tTaches;')
    .replace('#include <map_fragment>', `#include <map_fragment>\ndiffuseColor.rgb *= 2.0 * texture2D(tTaches, vAlphaMapUv * ${DECOR ? '6.0' : '3.0'}).rgb;\n${tonte}`);
};
const sol = new THREE.Mesh(new THREE.PlaneGeometry(TAILLE_SOL, TAILLE_SOL), matSol);
sol.renderOrder = -1;
sol.rotation.x = -Math.PI / 2;
sol.receiveShadow = true;
scene.add(sol);

const decor = DECOR
  ? creerDecor({ textureCanvas, texPaves, matBordure, petit: PETIT_APPAREIL, X0: X_GAUCHE, Z0: Z_ARRIERE, terrasse: CONFIG.sol === 'terrasse', dalleTerrasse: !TERRASSE })
  : null;
if (decor) scene.add(decor.groupe);

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
// Panneaux photovoltaïques (module ~1,13 × 1,72 m) : cellules sombres, joints clairs, cadre fin
const texSolaire = textureCanvas(256, 384, (g, l, h) => {
  g.fillStyle = '#C9CDD2';
  g.fillRect(0, 0, l, h);
  g.fillStyle = '#10151E';
  g.fillRect(4, 4, l - 8, h - 8);
  const nx = 6;
  const ny = 10;
  const cw = (l - 8) / nx;
  const ch = (h - 8) / ny;
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const v = hasard(-4, 4);
      g.fillStyle = `rgb(${22 + v},${30 + v},${48 + v})`;
      g.fillRect(4 + i * cw + 1, 4 + j * ch + 1, cw - 2, ch - 2);
      g.fillStyle = 'rgba(190,200,215,0.18)';
      for (let k = 1; k < 4; k++) g.fillRect(4 + i * cw + (k * cw) / 4, 4 + j * ch + 1, 0.8, ch - 2);
    }
  }
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

// Ombre d'ambiance sous le toit : sol plus sombre au centre de l'abri, dégradé vers les bords
const matOmbreToit = new THREE.MeshBasicMaterial({
  map: textureCanvas(256, 256, (g, l, h) => {
    g.filter = 'blur(22px)';
    g.fillStyle = 'rgba(0,0,0,1)';
    g.fillRect(l * 0.16, h * 0.16, l * 0.68, h * 0.68);
  }),
  transparent: true,
  opacity: 0.32,
  depthWrite: false,
});
// Petite ombre de contact au pied de chaque poteau
const matOmbrePied = new THREE.MeshBasicMaterial({
  map: textureCanvas(64, 64, (g, l, h) => {
    const d = g.createRadialGradient(l / 2, h / 2, 2, l / 2, h / 2, l / 2);
    d.addColorStop(0, 'rgba(0,0,0,0.7)');
    d.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = d;
    g.fillRect(0, 0, l, h);
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

// Normales adoucies entre faces presque alignées (angle < seuil) : carrosserie moins « en facettes »,
// les vraies arêtes (vitres, passages de roue) restent nettes
function lisser(geo, seuilDeg) {
  const pos = geo.attributes.position;
  const idx = geo.index;
  const nbFaces = (idx ? idx.count : pos.count) / 3;
  const sommet = (f, k) => (idx ? idx.getX(f * 3 + k) : f * 3 + k);
  const cle = (i) => `${Math.round(pos.getX(i) * 1e4)},${Math.round(pos.getY(i) * 1e4)},${Math.round(pos.getZ(i) * 1e4)}`;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const nFaces = [];
  const parPoint = new Map();
  for (let f = 0; f < nbFaces; f++) {
    a.fromBufferAttribute(pos, sommet(f, 0));
    b.fromBufferAttribute(pos, sommet(f, 1));
    c.fromBufferAttribute(pos, sommet(f, 2));
    const n = new THREE.Vector3().crossVectors(c.sub(b), a.sub(b)).normalize();
    nFaces.push(n);
    for (let k = 0; k < 3; k++) {
      const ck = cle(sommet(f, k));
      if (!parPoint.has(ck)) parPoint.set(ck, []);
      parPoint.get(ck).push(f);
    }
  }
  // Géométrie non indexée : chaque coin de face reçoit sa propre normale
  const plat = idx ? geo.toNonIndexed() : geo;
  const normales = new Float32Array(nbFaces * 9);
  const cosSeuil = Math.cos(THREE.MathUtils.degToRad(seuilDeg));
  const somme = new THREE.Vector3();
  for (let f = 0; f < nbFaces; f++) {
    for (let k = 0; k < 3; k++) {
      somme.set(0, 0, 0);
      for (const g of parPoint.get(cle(sommet(f, k)))) {
        if (nFaces[g].dot(nFaces[f]) >= cosSeuil) somme.add(nFaces[g]);
      }
      somme.normalize();
      normales.set([somme.x, somme.y, somme.z], (f * 3 + k) * 3);
    }
  }
  if (idx) {
    geo.copy(plat);
  }
  geo.setAttribute('normal', new THREE.BufferAttribute(normales, 3));
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
    lisser(o.geometry, 65);
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

// Petite ombre de contact au pied d'un poteau
function ombrePied(x, z) {
  const p = ajouter(new THREE.PlaneGeometry(0.75, 0.75), matOmbrePied, x, Y_SOL + 0.005, z, false);
  p.rotation.x = -Math.PI / 2;
  p.receiveShadow = false;
  p.renderOrder = 1;
}

// Modèles dédiés (véranda, pergola bioclimatique) : voir produits3d.js
const modeles3d = creerModeles({
  state, CONFIG, Y_SOL, groupe, texVeinage, textureCanvas, matLed, ombrePied,
  ajouter: (...args) => ajouter(...args),
  led: (x, y, z) => positionsLed.push(new THREE.Vector3(x, y, z).add(groupe.position)),
});

function vider(obj) {
  obj.traverse((o) => {
    if (o.geometry && !o.userData.partage) o.geometry.dispose();
  });
  obj.clear();
}

// Nuance (couleur de sommets) + décalage du veinage propres à une pièce
function varierPiece(geo) {
  const k = 1 + hasard(-VARIATION, VARIATION);
  const n = geo.attributes.position.count;
  geo.setAttribute('color', new THREE.Float32BufferAttribute(new Array(n * 3).fill(k), 3));
  const uv = geo.attributes.uv;
  const du = Math.random();
  const dv = Math.random();
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) + du, uv.getY(i) + dv);
}

function ajouter(geo, mat, x, y, z, ombre = true, parent = groupe) {
  if (mat.vertexColors && !geo.attributes.color) varierPiece(geo);
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
    boite(pas - 0.006, yH - yBas, 0.022, matParoiV, x, (yBas + yH) / 2, z).rotation.y = rot;
    // Couvre-joint une lame sur deux (bardage bois seulement)
    if (!ALU && i % 2 === 1) {
      const cj = boite(0.05, yH - yBas, 0.018, matParoiV, x - (dx * pas) / 2, (yBas + yH) / 2, z);
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
      boite(u2 - u1, hl, 0.022, matParoi, x1 + dx * u, y + hl / 2, z1 + dz * u).rotation.y = rot;
    }
  }
  bardageV(x1, z1, x2, z2, yHaut, null, y);
}

// Vitrage entre deux points au sol : verre + montants tous les ~1 m + traverse basse (couleur de la structure)
const matVerre = new THREE.MeshStandardMaterial({ color: '#CFE2E8', transparent: true, opacity: 0.22, roughness: 0.04, metalness: 0.1, envMapIntensity: 1.6, depthWrite: false });
function vitrage(x1, z1, x2, z2, yHaut) {
  const long = Math.hypot(x2 - x1, z2 - z1);
  if (long < 0.1) return;
  const dx = (x2 - x1) / long;
  const dz = (z2 - z1) / long;
  const rot = -Math.atan2(dz, dx);
  const teinte = CONFIG.bardages[state.bardage].verre;
  matVerre.color.set(teinte ?? '#CFE2E8');
  matVerre.opacity = teinte ? 0.42 : 0.22;
  const n = Math.max(1, Math.round(long / 1.0));
  const pas = long / n;
  const yBas = Y_SOL + 0.1;
  for (let i = 0; i <= n; i++) {
    const u = i * pas;
    const x = x1 + dx * u;
    const z = z1 + dz * u;
    const yH = yHaut(x, z);
    boite(0.055, yH - Y_SOL, 0.07, matBois, x, (Y_SOL + yH) / 2, z).rotation.y = rot;
    if (i === n) break;
    const uc = u + pas / 2;
    const xc = x1 + dx * uc;
    const zc = z1 + dz * uc;
    const yHc = Math.min(yH, yHaut(x1 + dx * (u + pas), z1 + dz * (u + pas)));
    const vitre = boite(pas - 0.05, yHc - yBas, 0.012, matVerre, xc, (yBas + yHc) / 2, zc, false);
    vitre.rotation.y = rot;
    vitre.renderOrder = 2;
  }
  boite(long, 0.1, 0.075, matBois, (x1 + x2) / 2, Y_SOL + 0.05, (z1 + z2) / 2).rotation.y = rot;
}

function paroi(...args) {
  if (CONFIG.bardages[state.bardage].vitrage) { vitrage(...args); return; }
  if (state.bardage === 'horizontal' || CONFIG.bardages[state.bardage].sens === 'horizontal') bardageH(...args);
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
  if (PAROI_PROPRE) {
    const lames = CONFIG.bardages[state.bardage].couleur ?? teinte;
    matParoi.color.set(lames);
    matParoiV.color.set(lames);
  }

  // Base : pavés + allée devant (ou terrasse en lames de bois, sans allée), bordures
  // (avec le décor, l'allée pavée jusqu'à la rue est dessinée par decor.js)
  const terrasse = CONFIG.sol === 'terrasse';
  // (avec le décor, la terrasse dallée de decor.js sert de sol : pas de plancher bois en double, il scintillait)
  if (!DECOR) {
    const allee = terrasse ? 0.6 : 4;
    const largP = W + 0.6;
    const longP = L + 0.6 + allee;
    const zP = allee / 2;
    const paves = boite(largP, 0.06, longP, matPaves.clone(), 0, Y_SOL - 0.03, zP, false);
    paves.material.map = (terrasse ? texTerrasse : texPaves).clone();
    paves.material.map.needsUpdate = true;
    paves.material.map.repeat.set(largP / 2, longP / 2);
    paves.material.bumpMap = paves.material.map;
    temporaires.push(paves.material);
    for (const s of [-1, 1]) {
      if (!g.maison(s)) boite(0.08, 0.08, longP, matBordure, s * (largP / 2 + 0.04), 0.04, zP, false);
    }
    boite(largP + 0.16, 0.08, 0.08, matBordure, 0, 0.04, -L / 2 - 0.34, false);
  }

  // Ombre d'ambiance sous le toit (plus marquée quand des parois ferment l'abri)
  const fermes = [state.paroiArriere || g.posL === 'arriere', state.paroiGauche, state.paroiDroite].filter(Boolean).length;
  const ombreToit = ajouter(new THREE.PlaneGeometry(W * 1.5, L * 1.45), matOmbreToit, 0, Y_SOL + 0.004, -0.1, false);
  ombreToit.rotation.x = -Math.PI / 2;
  ombreToit.receiveShadow = false;
  ombreToit.renderOrder = 1;
  matOmbreToit.opacity = 0.26 + fermes * 0.05;

  if (decor) decor.maj(g);
  else if (g.adosse !== 'non') facade(g);

  // Produit avec son propre modèle 3D (véranda, pergola bioclimatique)
  if (MODELE) {
    positionsLed = [];
    const res = modeles3d[MODELE](g) ?? {};
    if (res.ombre !== undefined) matOmbreToit.opacity = res.ombre + fermes * 0.03;
    if (res.maxVantaux !== undefined && CONFIG.limites.vantaux) {
      CONFIG.limites.vantaux[1] = Math.max(1, res.maxVantaux);
      if (state.vantaux > res.maxVantaux) state.vantaux = res.maxVantaux;
    }
    placerSpots();
    placerSoleil(g);
    construireCotes(g);
    return;
  }

  // Poteaux sur plots béton + pieds en U métalliques (pas de poteaux côté façade)
  const lignes = [...g.lignesPoteaux.map((s) => s * xR)];
  // Poteaux de la cloison du local latéral, côté local (le bardage est côté voitures)
  if (g.lateral) lignes.push(g.xCloison + (g.posL === 'gauche' ? -P / 2 : P / 2));
  for (const x of lignes) {
    const haut = ySup(x) - BH;
    // Alu : poteau sur platine directement ; bois : pied en U qui décolle le poteau du sol
    const bas = ALU ? Y_SOL + 0.06 : Y_SOL + 0.13;
    for (const z of g.zPoteaux) {
      const pied = ajouter(new THREE.PlaneGeometry(0.75, 0.75), matOmbrePied, x, Y_SOL + 0.005, z, false);
      pied.rotation.x = -Math.PI / 2;
      pied.receiveShadow = false;
      pied.renderOrder = 1;
      boite(0.26, 0.05, 0.26, matBeton, x, Y_SOL + 0.025, z);
      boite(0.18, 0.01, 0.18, matMetal, x, Y_SOL + 0.055, z);
      if (!ALU) for (const s of [-1, 1]) boite(0.006, 0.16, 0.1, matMetal, x + s * (P / 2 + 0.003), Y_SOL + 0.14, z);
      piece(P, haut - bas, P, matBoisV, x, bas + (haut - bas) / 2, z);
      // Contrefiches vers la sablière (sens de la longueur) : charpente bois seulement
      if (ALU) continue;
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
  const nChev = Math.max(2, Math.ceil(longZ / (CONFIG.entraxeChevrons ?? 0.65)) + 1);
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
    } else if (state.couverture === 'tole' || state.couverture === 'panneau') {
      // Le panneau isolé (sandwich) a la même face nervurée que la tôle, nervures plus espacées
      const panneau = state.couverture === 'panneau';
      mat.map = texTole.clone();
      mat.map.needsUpdate = true;
      mat.map.repeat.set(1, profC / (panneau ? 0.33 : 0.25));
      mat.bumpMap = mat.map;
      mat.bumpScale = panneau ? 2.2 : 3;
      mat.roughness = panneau ? 0.5 : 0.42;
      mat.metalness = panneau ? 0.45 : 0.6;
    } else if (state.couverture === 'solaire') {
      mat.color.set('#ffffff');
      mat.map = texSolaire.clone();
      mat.map.needsUpdate = true;
      mat.map.repeat.set(longC / 1.72, profC / 1.13);
      mat.map.center.set(0.5, 0.5);
      mat.map.rotation = Math.PI / 2;
      mat.roughness = 0.12;
      mat.metalness = 0.35;
      mat.envMapIntensity = 1.1;
    } else if (state.couverture === 'polycarbonate' || state.couverture === 'verre') {
      // Verre (véranda) : sans nervures, plus transparent
      if (state.couverture === 'polycarbonate') {
        mat.map = texPoly.clone();
        mat.map.needsUpdate = true;
        mat.map.repeat.set(1, profC / 0.6);
      }
      mat.transparent = true;
      mat.opacity = state.couverture === 'verre' ? 0.28 : state.teinteCouverture === 'opale' ? 0.82 : 0.45;
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
    // Couverture « ouverte » (pergola) : seulement les chevrons, pas de plaque
    if (!couv.ouverte) {
      boite(longC, ep, profC, mat, pan.cx, ySup(pan.cx) + (RH + ep / 2) / pan.cs, 0, !['polycarbonate', 'verre'].includes(state.couverture))
        .rotation.z = pan.rot;
    }

    // Planches de rive devant et derrière (suivent la pente)
    for (const s of [-1, 1]) {
      piece(pan.long + 0.02, HAUT_RIVE, 0.024, matBois, pan.cx, ySup(pan.cx) + (RH / 2) / pan.cs + (HAUT_RIVE - 0.2) / 2, s * (profC / 2 + 0.012)).rotation.z = pan.rot;
    }
    // Planche d'égout le long des bords bas (et haut pour le toit à 1 pan isolé)
    for (const xb of [pan.xBas, pan.xHaut]) {
      if (xb === undefined) continue;
      piece(0.024, HAUT_RIVE, profC + 0.05, matBois, xb, ySup(xb) + (RH / 2) / pan.cs - 0.02 + (HAUT_RIVE - 0.2) / 2, 0);
    }
  }

  // Solin : bande métallique qui raccorde le toit à la façade (rien à raccorder si le toit est ouvert)
  for (const s of [-1, 1]) {
    if (!g.maison(s) || couv.ouverte) continue;
    const xs = s * (W / 2 - 0.06);
    const ys = ySup(xs) + (RH + ep) / cos + 0.01;
    boite(0.14, 0.008, profC, matZinc, xs, ys, 0);
    boite(0.008, 0.16, profC, matZinc, s * (W / 2 - 0.004), ys + 0.08, 0);
  }

  // Faîtage posé SUR la couverture (encastré pour ne pas flotter au-dessus de la pente)
  if (deuxPans && !couv.ouverte) {
    const yFaite = ySup(xF) + (RH + ep) / Math.min(Math.cos(aG), Math.cos(aD));
    if (state.couverture === 'tuiles') {
      const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(teinteCouv).multiplyScalar(0.62), roughness: 0.88, envMapIntensity: 0.4 });
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

  if (VERANDA) paroi(xMurMin, zAvant, xMurMax, zAvant, hautPignon);

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

  // Éclairage LED : spots sous la charpente, entre les poteaux (ils éclairent vraiment en vue de nuit)
  positionsLed = [];
  if (state.led) {
    const zs = g.zPoteaux.slice(1).map((z, i) => (z + g.zPoteaux[i]) / 2).filter((z) => z > zCloison);
    for (const z of zs) {
      const y = deuxPans ? ySup(xF) - BH - 0.012 : ySup(xcV) - 0.012;
      ajouter(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 20), matLed, deuxPans ? xF : xcV, y, z, false);
      positionsLed.push(new THREE.Vector3(deuxPans ? xF : xcV, y - 0.03, z).add(g.decalage));
    }
  }
  placerSpots();

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

  placerSoleil(g);
  construireCotes(g);
}

// Soleil et ombres centrés sur le produit
function placerSoleil(g) {
  const centre = g.decalage.clone().setY(1);
  soleil.target.position.copy(centre);
  // Isolé : soleil de côté, à l'opposé de la caméra (l'ombre du toit se voit sous l'abri et à côté).
  // Contre la maison : soleil du côté libre, sinon la façade mettrait tout le carport à l'ombre.
  const xSoleil = g.adosse === 'non' ? -10 : g.adosse === 'droite' ? -7 : 7;
  // Terrasse (pergola, véranda) contre la maison : soleil plus de côté, l'ombre des lames / chevrons tombe sur la terrasse
  if (TERRASSE_DECOR && g.adosse !== 'non') soleil.position.copy(centre).add(new THREE.Vector3(Math.sign(xSoleil) * 3, 12, 9));
  else soleil.position.copy(centre).add(new THREE.Vector3(xSoleil, 13, g.adosse === 'non' ? 5 : 9));
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
  etiquette(`${LIB.passage} ${fmtM(H)}`, new THREE.Vector3(xH, Y_SOL + H / 2, zH));
  groupeCotes.visible = cotesVisibles;
}

const _v = new THREE.Vector3();
function placerEtiquettes() {
  if (!cotesVisibles) return;
  const w = viewer.clientWidth;
  const h = viewer.clientHeight;
  const poses = [];
  etiquettes.forEach(({ el, pos }, i) => {
    _v.copy(pos).project(camera);
    // Vue de dessus : la hauteur de passage n'a pas de sens (sa ligne devient un point)
    const visible = _v.z < 1 && Math.abs(_v.x) < 1.1 && Math.abs(_v.y) < 1.1 && !(i === 2 && vueActive === 'dessus');
    el.style.display = visible ? '' : 'none';
    if (!visible) return;
    // Garder l'étiquette entière dans le cadre
    const lw = el.offsetWidth;
    const lh = el.offsetHeight;
    const demi = lw / 2 + 6;
    const x = Math.min(w - demi, Math.max(demi, ((_v.x + 1) / 2) * w));
    let y = ((1 - _v.y) / 2) * h;
    // Si elle chevauche une étiquette déjà placée : la décaler en dessous
    for (let essai = 0; essai < poses.length; essai++) {
      const autre = poses.find((p) => Math.abs(p.x - x) < (p.lw + lw) / 2 + 4 && Math.abs(p.y - y) < (p.lh + lh) / 2 + 3);
      if (!autre) break;
      y = autre.y + (autre.lh + lh) / 2 + 4;
    }
    poses.push({ x, y, lw, lh });
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  });
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
  // Avec la maison : un peu plus de recul et visée plus haute pour voir le carport devant la maison
  const cible = g.decalage.clone().add(new THREE.Vector3(DECOR && g.adosse === 'non' ? -0.6 : 0, g.H * 0.55 + (DECOR ? 0.7 : 0), DECOR && g.adosse === 'non' ? -0.4 : 0.6));
  const etroit = viewer.clientWidth < viewer.clientHeight * 1.1;
  // (terrasse + produit autoportant : moins de recul, sinon la caméra passe derrière les arbres du jardin)
  const recul = taille * (etroit ? 2.3 : 1.8)
    * (TERRASSE_DECOR ? (g.adosse !== 'non' ? 1.55 : 1.2) : DECOR ? 1.75 : g.adosse !== 'non' ? 1.15 : 1);
  // Vue 3/4 du côté libre quand la maison est à droite
  const cote = g.adosse === 'droite' ? -1 : 1;
  let dir;
  if (nom === 'face') dir = new THREE.Vector3(0, 0.22, 1);
  else if (nom === 'dessus') dir = new THREE.Vector3(0, 1.45, 0.01);
  else if (TERRASSE_DECOR && g.adosse !== 'non') dir = new THREE.Vector3(1.0 * cote, 0.34, 0.55); // terrasse : plus de face sur la façade
  else dir = new THREE.Vector3(0.72 * cote, DECOR ? 0.3 : 0.42, 0.85);
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

function appliquerAmbiance() {
  scene.background = nuit ? cielNuit : cielJour;
  scene.fog.color.set(nuit ? HORIZON_NUIT : HORIZON);
  ciel.color.set(nuit ? '#8FA6CC' : '#EEF2F5');
  ciel.groundColor.set(nuit ? '#1E2230' : '#7D7A62');
  ciel.intensity = nuit ? 0.4 : 0.3;
  soleil.color.set(nuit ? '#9DB4E6' : '#FFF1DC');
  soleil.intensity = nuit ? 0.5 : 3.4;
  scene.environment = nuit ? null : envJour;
  if (renderer) renderer.toneMappingExposure = nuit ? 1.35 : 1.15;
  decor?.ambiance(nuit);
  viewer.classList.toggle('nuit', nuit);
  placerSpots();
}

$('#btn-nuit').addEventListener('click', (e) => {
  nuit = !nuit;
  e.currentTarget.setAttribute('aria-pressed', String(nuit));
  appliquerAmbiance();
});

// ?nuit dans l'adresse : ouvre directement la vue de nuit
if (new URLSearchParams(location.search).has('nuit')) $('#btn-nuit').click();

$('#btn-tourner').addEventListener('click', (e) => {
  if (!controls) return;
  controls.autoRotate = !controls.autoRotate;
  e.currentTarget.setAttribute('aria-pressed', String(controls.autoRotate));
});

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
    b.title = INVERSER ? `${fmtM(rc.profondeur)} × ${fmtM(rc.largeur)}` : `${fmtM(rc.largeur)} × ${fmtM(rc.profondeur)}`;
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
    (id, b) => `${b.couleur ? pastille(b.couleur) : ''}<span>${b.label}</span><small class="delta"></small>`);
  $('#bardages').className = `segments segments-${Math.min(4, Object.keys(CONFIG.bardages).length)}`;
  // Une seule forme de toit : pas de choix à montrer
  const uneForme = Object.keys(CONFIG.toits).length < 2;
  $('#toits').hidden = uneForme;
  $('#toits').previousElementSibling.hidden = uneForme;
  if (LOCAL) {
    radios('#pos-local', 'posLocal', Object.entries(CONFIG.positionsLocal),
      (id, p) => `<span>${p.label}</span><small class="delta"></small>`);
    radios('#profs-local', 'profLocal', CONFIG.profondeursLocal.map((v) => [v, v]),
      (id) => `<span>${fmtM(id)}</span><small class="delta"></small>`);
  }
  if (VEHICULES) {
    radios('#vehicules', 'vehicule', Object.entries(CONFIG.vehicules),
      (id, v) => `<span>${v.label}</span>`, { delta: false });
  }

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
  // Un seul choix possible : rien à montrer (ex. verre clair seul, lames de la pergola bioclimatique)
  for (const [sel, n] of [['#couvertures', permises.length], ['#teintes', teintes.length]]) {
    $(sel).hidden = n < 2;
    $(sel).previousElementSibling.hidden = n < 2;
  }
  $('#aide-toit').hidden = state.adosse === 'non' || TERRASSE;
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
    paroiAvant: '',
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
    b.textContent = force === 'Façade de la maison' ? 'Maison' : { paroiArriere: 'Arrière', paroiAvant: 'Avant', paroiGauche: 'Gauche', paroiDroite: 'Droite' }[cle];
  }
  const choixLocal = $('#choix-local');
  if (choixLocal) choixLocal.hidden = !state.rangement;
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
  svg += state.paroiAvant
    ? `<line x1="${x0}" y1="${y0 + l}" x2="${x0 + w}" y2="${y0 + l}" ${ferme}/>`
    : `<line x1="${x0}" y1="${y0 + l}" x2="${x0 + w}" y2="${y0 + l}" stroke="${COULEUR_PLAN}" stroke-width="1" stroke-dasharray="1 3"/>`;
  const xs = g.lignesPoteaux.map((c) => (c < 0 ? x0 : x0 + w));
  for (const z of g.zPoteaux) {
    const py = y0 + (z + g.L / 2) * s;
    for (const px of xs) svg += `<rect x="${px - 2.5}" y="${py - 2.5}" width="5" height="5" fill="${encre}"/>`;
  }
  $('#plan-dessin').innerHTML = svg;
}

// Curseurs propres à un produit (lames orientables, baies ouvertes) : retirés si le produit n'en a pas
for (const input of document.querySelectorAll('input[type="range"][data-cle]')) {
  if (!CONFIG.limites[input.dataset.cle]) input.closest('.curseur').remove();
}
const curseurs = document.querySelectorAll('input[type="range"][data-cle]');
const texteCurseur = (cle, v) => (cle === 'angleLames' ? `${Math.round(v)}°` : cle === 'vantaux' ? `${v} sur ${CONFIG.limites.vantaux[1]}` : fmtM(v));
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
    const [min, max] = CONFIG.limites[cle];
    input.max = max;
    input.value = state[cle];
    input.style.setProperty('--rempli', `${((state[cle] - min) / (max - min)) * 100}%`);
    $(`#out-${cle}`).textContent = texteCurseur(cle, state[cle]);
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
    state.paroiAvant ? 'avant' : null,
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
  if (TERRASSE) {
    return [
      ['Dimensions', `${fmtM(g.Dc)} ${LIB.profondeurAide} × ${fmtM(g.Wv)} ${LIB.largeurAide} · ${fmtM2(p.surface)}`],
      ['Hauteur du plancher', `${fmtM(g.H)}${p.marches ? ` · ${p.marches} marche${p.marches > 1 ? 's' : ''} d'accès` : ''}`],
      ['Implantation', g.adosse === 'non' ? 'Isolée (4 côtés libres)' : `Contre la maison, façade à ${g.adosse}`],
      ['Revêtement', `${couv.label}, ${couv.teintes[state.teinteCouverture].label.toLowerCase()}`],
      [LIB.finitionLigne, CONFIG.bois[state.bois].label],
      [LIB.parois, parois.length ? `${parois.join(', ')} · ${CONFIG.bardages[state.bardage].label.toLowerCase()}` : 'aucun'],
      ['Équipements', [state.led && 'éclairage LED encastré', ...(CONFIG.inclus ?? [])].filter(Boolean).join(', ') || 'aucun'],
    ];
  }
  return [
    ['Dimensions', INVERSER
      ? `${fmtM(g.Dc)} ${LIB.profondeurAide} × ${fmtM(g.Wv)} ${LIB.largeurAide} · ${LIB.passage} ${fmtM(g.H)}`
      : `${fmtM(g.Wv)} × ${fmtM(g.Dc)} ${LIB.largeurAide} · ${LIB.passage} ${fmtM(g.H)}`],
    ['Emprise totale', `${fmtM(g.W)} × ${fmtM(g.L)} · ${fmtM2(p.surface)}`],
    ['Implantation', implantation],
    ['Toit', `${CONFIG.toits[state.toit].label} (${CONFIG.toits[state.toit].pente}°) · ${couv.label}, ${couv.teintes[state.teinteCouverture].label.toLowerCase()}`],
    [LIB.finitionLigne, CONFIG.bois[state.bois].label],
    ['Parois', parois.length ? `${parois.join(', ')} · ${CONFIG.bardages[state.bardage].label.toLowerCase()}` : 'aucune'],
    [LIB.rangementLigne, g.S ? `${CONFIG.positionsLocal[g.posL].label.toLowerCase()}, ${fmtM(g.S)}, porte comprise` : 'non'],
    ...(state.angleLames !== undefined ? [['Lames orientables', `réglées à ${Math.round(state.angleLames)}° sur l'image (motorisées)`]] : []),
    ['Équipements', [state.gouttieres && 'gouttières', state.led && 'éclairage LED', state.borne && 'préparation borne de recharge',
      state.storeToit && 'stores de toiture', state.chauffage && 'chauffage infrarouge', ...(CONFIG.inclus ?? [])].filter(Boolean).join(', ') || 'aucun'],
    ['Structure', `${p.nbPoteaux} poteaux · portée max ${fmtM(CONFIG.porteeMax)}`],
  ];
}

function resume() {
  const g = geometrie();
  const couv = CONFIG.couvertures[state.couverture];
  const parois = paroisFermees(g);
  if (TERRASSE) {
    const n = nbMarches(g.H);
    return [
      dimsTexte(),
      `Plancher à ${fmtM(g.H)}`,
      g.adosse !== 'non' ? `Contre la maison (${g.adosse})` : null,
      `${couv.label} ${couv.teintes[state.teinteCouverture].label.toLowerCase()}`,
      CONFIG.bois[state.bois].label,
      n ? `${n} marche${n > 1 ? 's' : ''}` : null,
      parois.length ? `${LIB.parois} : ${parois.join(', ')}` : `Sans ${LIB.parois.toLowerCase()}`,
      parois.length ? CONFIG.bardages[state.bardage].label : null,
      state.led ? 'LED' : null,
    ].filter(Boolean);
  }
  return [
    dimsTexte(),
    g.adosse !== 'non' ? `Contre la maison (${g.adosse})` : null,
    `Toit ${CONFIG.toits[state.toit].label}`,
    `${couv.label} ${couv.teintes[state.teinteCouverture].label.toLowerCase()}`,
    CONFIG.bois[state.bois].label,
    parois.length ? `Parois : ${parois.join(', ')}` : 'Sans paroi',
    parois.length ? CONFIG.bardages[state.bardage].label : null,
    g.S ? `${LIB.rangementCourt} ${CONFIG.positionsLocal[g.posL].label.toLowerCase()} ${fmtM(g.S)}` : null,
    state.gouttieres ? 'Gouttières' : null,
    state.led ? 'LED' : null,
    state.borne ? 'Borne' : null,
    state.storeToit ? 'Stores de toiture' : null,
    state.chauffage ? 'Chauffage' : null,
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

  $('#note-technique').textContent = TERRASSE
    ? `Surface ${fmtM2(p.surface)}${p.marches ? ` · ${p.marches} marche${p.marches > 1 ? 's' : ''} d'accès` : ''}${CONFIG.noteGardeCorps && state.hauteur >= (CONFIG.hauteurGardeCorps ?? 1) ? ` · ${CONFIG.noteGardeCorps}` : ''}`
    : `${p.nbPoteaux} poteaux · portée max ${fmtM(CONFIG.porteeMax)} · surface couverte ${fmtM2(p.surface)}`;
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
  majCurseurs(); // le nombre de baies dépend de la taille construite
  ecrireLien();
  if (!curseur && demarre) compterReglage();
  // Recadrer quand la forme générale change (toit, maison à gauche/droite)
  const forme = `${state.toit}|${state.adosse}`;
  if (forme !== derniereForme && derniereForme) allerVers(vueActive);
  else if (!curseur) verifierCadrage();
  derniereForme = forme;
}

// ---------- Textes propres au produit (bois ou alu) ----------
// Lu avant la création des onglets : une étape retirée ici n'apparaît nulle part

const LIB = {
  titre: 'Carport en bois sur mesure',
  finition: 'Finition du bois',
  finitionCourt: 'Bois',
  finitionLigne: 'Bois',
  bardage: 'Type de bardage',
  rangement: 'Local de rangement fermé',
  rangementLigne: 'Local de rangement',
  rangementCourt: 'Local',
  objet: 'carport', // dans les phrases, le nom du PDF et l'objet de l'e-mail
  passage: 'passage', // étiquette de la cote de hauteur
  largeurAide: 'pour les véhicules',
  hauteur: 'Hauteur de passage',
  hauteurAide: 'sous la charpente',
  implantationAide: 'Contre la maison, le carport se fixe à la façade : une rangée de poteaux en moins.',
  parois: 'Parois et rangement',
  paroiLigne: 'Paroi', // début des lignes du détail du prix
  largeur: 'Largeur',
  profondeur: 'Profondeur',
  profondeurAide: '',
  toiture: 'Toiture',
  toitureCourt: 'Toit',
  ...CONFIG.libelles,
};
// Produits contre la façade (pergola, véranda) : « largeur » = le long de la façade (axe z du moteur),
// « avancée » = depuis la façade (axe x). Les deux curseurs sont alors inversés à l'écran.
const INVERSER = Boolean(LIB.inverserCotes);
const dimsTexte = () => (INVERSER
  ? `${fmtM(state.profondeur)} × ${fmtM(state.largeur)}`
  : `${fmtM(state.largeur)} × ${fmtM(state.profondeur)}`);
$('.intro h1').textContent = LIB.titre;
$('label[for="largeur"]').firstChild.textContent = `${LIB.largeur} `;
$('label[for="largeur"] small').textContent = LIB.largeurAide;
$('label[for="profondeur"]').firstChild.textContent = `${LIB.profondeur} `;
$('label[for="profondeur"] small').textContent = LIB.profondeurAide;
if (INVERSER) {
  const blocL = $('#largeur').closest('.curseur');
  blocL.before($('#profondeur').closest('.curseur'));
}
{
  const etapeToit = $('#toits').closest('.etape');
  etapeToit.dataset.court = LIB.toitureCourt;
  etapeToit.querySelector('h2').lastChild.textContent = LIB.toiture;
}
if (LIB.ledAide) $('[data-cle="led"]')?.closest('.option').querySelector('small').replaceChildren(LIB.ledAide);
// Paroi avant fermable (pergola bioclimatique : 4 côtés) ; sinon l'entrée reste ouverte
if (CONFIG.paroiAvant) $('.plan-entree').remove();
else $('[data-paroi="paroiAvant"]').remove();
// Curseur « baies ouvertes » : seulement pour la véranda (avec son plan masqué)
$('label[for="hauteur"]').firstChild.textContent = `${LIB.hauteur} `;
$('label[for="hauteur"] small').textContent = LIB.hauteurAide;
$('#implantations').previousElementSibling.textContent = LIB.implantationAide;
$('#viewer').setAttribute('aria-label', `Aperçu 3D : ${LIB.objet}`);
const etapeParois = $('#bardages').closest('.etape');
etapeParois.querySelector('h2').lastChild.textContent = LIB.parois;
if (LIB.paroisCourt) etapeParois.dataset.court = LIB.paroisCourt;
if (LIB.paroisAide) etapeParois.querySelector('.aide-etape').textContent = LIB.paroisAide;
if (VERANDA) {
  etapeParois.dataset.court = LIB.paroisCourt ?? 'Vitrage';
  etapeParois.querySelector('.aide-etape').textContent = LIB.paroisAide ?? 'Les côtés libres sont vitrés, avec une porte coulissante en façade.';
  $('#plan').style.display = 'none';
}
// Pas de local de rangement pour ce produit : option retirée
if (!LOCAL) {
  $('[data-cle="rangement"]').closest('.option').remove();
  $('#choix-local').remove();
}
// Aucun véhicule à afficher : étape retirée
if (!VEHICULES) [...document.querySelectorAll('.etape')].find((e) => e.dataset.court === 'Véhicule')?.remove();
const etapeFinition = $('#bois').closest('.etape');
etapeFinition.dataset.court = LIB.finitionCourt;
etapeFinition.querySelector('h2').lastChild.textContent = LIB.finition;
$('#bois').setAttribute('aria-label', LIB.finition);
$('#bardages').previousElementSibling.textContent = LIB.bardage;
if (LIB.couverture) $('#couvertures').previousElementSibling.textContent = LIB.couverture;
if (LIB.teinte) $('#teintes').previousElementSibling.firstChild.textContent = `${LIB.teinte} `;
$('#bardages').setAttribute('aria-label', LIB.bardage);
const optLocal = $('[data-cle="rangement"]')?.closest('.option');
if (optLocal) optLocal.querySelector('span').firstChild.textContent = `${LIB.rangement} `;
for (const input of document.querySelectorAll('input[type="checkbox"][data-cle]')) {
  if (TOUS_EQUIPEMENTS.includes(input.dataset.cle) && !EQUIPEMENTS.includes(input.dataset.cle)) input.closest('.option').remove();
}
const etapeEquip = [...document.querySelectorAll('.etape')].find((e) => e.dataset.court === 'Équipements');
if (etapeEquip && !etapeEquip.querySelector('.option')) etapeEquip.remove();
// Étape « Produit » en tête (assistant) : changer de produit recharge la page avec ?produit=…
if (ASSISTANT && PRODUITS) {
  const s = document.createElement('section');
  s.className = 'etape etape-produit';
  s.dataset.court = 'Produit';
  s.innerHTML = '<h2><span>01</span>Choisissez votre projet</h2><p class="aide-etape">Le modèle se construit devant la maison, le prix suit chaque réglage.</p><div class="produits" role="radiogroup" aria-label="Produit"></div>';
  for (const [cle, p] of Object.entries(PRODUITS)) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'carte-produit';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(cle === CFG.PRODUIT));
    b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${p.icone}</svg><span><strong>${p.label}</strong><small>${p.aide}</small>${p.exemple ? `<em class="exemple">Exemple : <b>${p.exemple}</b> CHF TTC</em>` : ''}</span>`;
    b.addEventListener('click', () => {
      if (cle === CFG.PRODUIT) { allerEtape(1); return; }
      try { sessionStorage.setItem('etape', '1'); } catch (e) { /* stockage bloqué : on repart de l'étape 1 */ }
      location.href = `?produit=${cle}`;
    });
    s.querySelector('.produits').append(b);
  }
  $('#onglets').after(s);
}

// Numéros des étapes recalculés (01, 02…)
document.querySelectorAll('.etape h2 span').forEach((s, i) => { s.textContent = String(i + 1).padStart(2, '0'); });

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
  majPied(i);
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
  panel.classList.toggle('par-etapes', modeMobile.matches || ASSISTANT);
  redimensionner();
}

modeMobile.addEventListener('change', majModeMobile);
majModeMobile();

// Pied de l'assistant : total estimé, Retour / Suivant (dernière étape : demande de devis)
let etapeCourante = 0;
if (ASSISTANT) {
  panel.classList.add('assistant');
  document.body.classList.add('avec-assistant');
  const pied = document.createElement('footer');
  pied.className = 'pied-assistant';
  pied.innerHTML = '<p class="pied-total"><small>Total estimé</small><span><b id="total-pied">—</b> CHF TTC</span><small>Prix indicatif · démonstration, prix fictifs</small></p><div class="pied-boutons"><button type="button" class="pied-retour" id="btn-retour">‹ Retour</button><button type="button" class="cta pied-suivant" id="btn-suivant"></button></div>';
  panel.append(pied);

  // Barres du haut et du bas (démo Wibzo)
  const logo = '<img src="https://wibzo.ch/assets/favicon.svg" alt="">';
  const haut = document.createElement('header');
  haut.className = 'barre-haut';
  haut.innerHTML = `<a href="https://wibzo.ch">${logo}Wibzo</a><span class="sep-v"></span><span>Une démo Wibzo</span><a class="lien-site" href="https://wibzo.ch">wibzo.ch ↗</a>`;
  const bas = document.createElement('footer');
  bas.className = 'barre-bas';
  bas.innerHTML = `<b>${logo}Wibzo</b><span>Configurateur réalisé par Wibzo · <a href="https://wibzo.ch">wibzo.ch</a></span><span class="droite">Démonstration : marque, prix et modèles fictifs</span>`;
  document.body.prepend(haut);
  $('.app').after(bas);

  [...$('#onglets').children].forEach((b, i) => { const n = b.querySelector('span'); if (n) n.textContent = i + 1; });
  // « Étape n sur N » au-dessus de chaque titre
  etapes.forEach((e, i) => e.querySelector('h2')?.setAttribute('data-numero', `Étape ${i + 1} sur ${etapes.length}`));

  // Étiquette du produit en haut de la vue 3D : nom + dimensions
  const nomProduit = PRODUITS?.[CFG.PRODUIT]?.label ?? LIB.objet;
  const majEtiquette = () => {
    $('#badge-demo').innerHTML = `${nomProduit} <span>· ${dimsTexte()}</span>`;
  };
  majEtiquette();
  new MutationObserver(majEtiquette).observe($('#total'), { childList: true, characterData: true, subtree: true });
  new MutationObserver(() => { $('#total-pied').textContent = $('#total').textContent; })
    .observe($('#total'), { childList: true, characterData: true, subtree: true });
  $('#btn-retour').addEventListener('click', () => allerEtape(Math.max(0, etapeCourante - 1)));
  $('#btn-suivant').addEventListener('click', () => {
    if (etapeCourante < etapes.length - 1) allerEtape(etapeCourante + 1);
    else $('#btn-devis').click();
  });
}
function majPied(i) {
  if (!ASSISTANT) return;
  etapeCourante = i;
  $('#btn-retour').disabled = i === 0;
  const produit = PRODUITS?.[CFG.PRODUIT]?.label.toLowerCase();
  $('#btn-suivant').textContent = i === 0 && produit ? `Configurer : ${produit} ›`
    : i < etapes.length - 1 ? 'Suivant ›' : 'Recevoir mon devis';
  panel.querySelector('.etape.active')?.scrollTo({ top: 0 });
}
let etapeDepart = 0;
try { etapeDepart = Number(sessionStorage.getItem('etape')) || 0; sessionStorage.removeItem('etape'); } catch (e) { /* pas de stockage */ }
allerEtape(Math.min(etapeDepart, etapes.length - 1));

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
document.title = `Configurateur ${LIB.objet} — ${CONFIG.entreprise.nom === 'Votre entreprise' ? 'démo' : CONFIG.entreprise.nom}`;
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
  signaler('La démo est utilisée', [`Quelqu'un configure un ${LIB.objet} en ce moment.`, '', ...lignesConfig().map(([l, v]) => `${l} : ${v}`), '', `Lien : ${location.href}`].join('\n'));
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
  a.download = `estimation-${LIB.objet.replace(/\s+/g, '-')}-${ref}.pdf`;
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
    mail.href = `mailto:${CONFIG.entreprise.email}?subject=${encodeURIComponent(`Demande de devis ${LIB.objet}`)}&body=${encodeURIComponent(texte)}`;
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
