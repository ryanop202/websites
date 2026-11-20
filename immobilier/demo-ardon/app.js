import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { PROJET, LOTS, NIVEAUX, NIVEAUX_COURTS, IMAGES } from './config.js';
import { construireMaquette, pointDeVue, H, VUE } from './maquette.js';

/* =========================================================
   Données et utilitaires
   ========================================================= */
const STATUTS = {
  dispo: { nom: 'À vendre', couleur: 0x2fae6a },
  reserve: { nom: 'Réservé', couleur: 0xf0a12e },
  vendu: { nom: 'Vendu', couleur: 0xd23b32 },
};
const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
const chf = (n) => 'CHF ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'") + '.–';
const piecesTxt = (p) => (p === 'Studio' ? 'Studio' : p + ' pièces');
const $ = (id) => document.getElementById(id);

/* =========================================================
   Scène 3D
   ========================================================= */
const viewer = $('viewer');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.outputColorSpace = THREE.SRGBColorSpace;
viewer.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.3, 14000);
const controls = new OrbitControls(camera, renderer.domElement);
const CIBLE = VUE.cible.clone();
controls.target.copy(CIBLE);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 14;
controls.maxDistance = VUE.max;
controls.maxPolarAngle = Math.PI * 0.485;
controls.screenSpacePanning = true;

const { niveaux, toit, bloqueurs, reglerSoleil } = construireMaquette({ scene, renderer, LOTS, mobile });

// Post-traitement : anticrénelage + occlusion ambiante (ombres de contact) sur ordinateur
const cibleRendu = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, cibleRendu);
composer.addPass(new RenderPass(scene, camera));
let gtao = null;
if (!mobile) {
  gtao = new GTAOPass(scene, camera, 1, 1);
  gtao.updateGtaoMaterial({ radius: 0.9, distanceExponent: 1.6, thickness: 2, scale: 1.1, samples: 16 });
  gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
  gtao.blendIntensity = 0.85;
  composer.addPass(gtao);
}
composer.addPass(new OutputPass());
// Rendu « photo » : léger vignettage et contraste doux
composer.addPass(new ShaderPass({
  uniforms: { tDiffuse: { value: null } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv;
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 d = vUv - 0.5;
      float v = smoothstep(0.85, 0.25, length(d * vec2(1.15, 1.0)));
      c.rgb *= mix(0.78, 1.0, v);
      c.rgb = mix(c.rgb, c.rgb * c.rgb * (3.0 - 2.0 * c.rgb), 0.18);
      gl_FragColor = c;
    }`,
}));

/* ---- Volumes de couleur (statut) : invisibles tant qu'on ne les demande pas ---- */
for (const l of LOTS) {
  if (!l.centre) continue;
  const base = l.niveau * H, w = l.dim.w, d = l.dim.d;
  const couleur = STATUTS[l.statut].couleur;
  const vol = new THREE.Mesh(new THREE.BoxGeometry(w + 0.16, H - 0.06, d + 0.16),
    new THREE.MeshBasicMaterial({ color: couleur, transparent: true, opacity: 0, depthWrite: false }));
  vol.position.set(l.centre.x, base + H / 2, l.centre.z); vol.rotation.y = l.rot;
  vol.renderOrder = 3; vol.userData = { lot: l, sansAO: true }; vol.visible = false;
  const bord = new THREE.LineSegments(new THREE.EdgesGeometry(vol.geometry), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
  vol.add(bord);
  // Plaque au sol, pour la vue en coupe d'un étage
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.3, d - 0.3),
    new THREE.MeshBasicMaterial({ color: couleur, transparent: true, opacity: 0, depthWrite: false }));
  pl.rotation.order = 'YXZ'; pl.rotation.set(-Math.PI / 2, l.rot, 0); pl.position.set(l.centre.x, base + 0.04, l.centre.z);
  pl.renderOrder = 2; pl.userData = { sansAO: true }; pl.visible = false;
  niveaux[l.niveau].add(vol, pl);
  Object.assign(l, { vol, bord, plaque: pl });
}

/* =========================================================
   État et interface
   ========================================================= */
const etat = { niveau: -1, pieces: 'tous', dispoSeul: false, budget: 0, couleurs: false, survol: null, choix: null };
let vue = null;                                              // vue depuis un lot (balcon / terrasse)
const sol = { saison: 'automne', heure: 17.5, joue: false }; // soleil réglable
const fovVoulu = () => (vue ? (viewer.clientWidth < 600 ? 70 : 60) : viewer.clientWidth < 600 ? 44 : 36);
const filtreActif = () => etat.pieces !== 'tous' || etat.dispoSeul || etat.budget > 0;

function correspond(l) {
  if (etat.pieces !== 'tous' && l.pieces !== etat.pieces) return false;
  if (etat.dispoSeul && l.statut !== 'dispo') return false;
  if (etat.budget && l.prix > etat.budget) return false;
  return true;
}

function majVoiles() {
  if (vue) { // vue depuis un lot : immeuble réaliste, sans couleurs
    for (const l of LOTS) { l.vol.visible = false; l.plaque.visible = false; }
    $('legende').hidden = true;
    return;
  }
  const montrer = etat.couleurs || filtreActif();
  for (const l of LOTS) {
    const ok = correspond(l), coupe = etat.niveau === l.niveau;
    let ov = 0, op = 0, ob = 0;
    if (coupe) {
      op = ok ? 0.4 : 0.06;
      if (l === etat.survol) op = 0.62;
      if (l === etat.choix) op = 0.8;
    } else {
      if (montrer && ok) ov = 0.34;
      if (l === etat.survol) { ov = 0.42; ob = 0.8; }
      if (l === etat.choix) { ov = 0.55; ob = 1; }
    }
    l.vol.material.opacity = ov; l.vol.visible = ov > 0;
    l.bord.material.opacity = ob;
    l.plaque.material.opacity = op; l.plaque.visible = op > 0;
  }
  $('legende').hidden = !(montrer || etat.niveau !== -1);
  $('btn-couleurs').classList.toggle('actif', etat.couleurs);
  $('btn-couleurs').setAttribute('aria-pressed', etat.couleurs);
}

function majNiveaux() {
  niveaux.forEach((g, i) => { g.visible = etat.niveau === -1 || i <= etat.niveau; });
  toit.visible = etat.niveau === -1;
  document.querySelectorAll('.etages button').forEach((b) => b.classList.toggle('actif', Number(b.dataset.niveau) === etat.niveau));
  majEtiquettes();
}

/* ---- En-tête et contact ---- */
document.documentElement.style.setProperty('--marque', PROJET.couleurs.marque);
document.documentElement.style.setProperty('--marque-fonce', PROJET.couleurs.marqueFonce);
document.documentElement.style.setProperty('--or', PROJET.couleurs.or);
$('logo').src = PROJET.logo;
$('logo').alt = PROJET.promoteur;
$('nom').textContent = PROJET.nom;
$('sous-titre').textContent = PROJET.sousTitre;
$('lieu').textContent = `${PROJET.lieu} · ${PROJET.livraison}`;
$('contact').innerHTML = `<strong>${PROJET.promoteur}</strong> · ${PROJET.contactNom} · <a href="tel:${PROJET.telephone.replace(/\s/g, '')}">${PROJET.telephone}</a> · <a href="mailto:${PROJET.email}">${PROJET.email}</a>`;
$('f-parking').textContent = PROJET.parking;

const nb = (s) => LOTS.filter((l) => l.statut === s).length;
const NOMS_PLURIEL = { dispo: 'À vendre', reserve: 'Réservés', vendu: 'Vendus' };
$('compteurs').innerHTML = ['dispo', 'reserve', 'vendu'].map((s) =>
  `<div class="compteur"><b>${nb(s)}</b><span><i class="pt ${s}"></i>${NOMS_PLURIEL[s]}</span></div>`).join('');
$('note-lots').textContent = `${LOTS.length} lots publiés sur ${PROJET.totalAppartements} appartements · source : berra-immobilier.ch (12.11.2026)`;

/* ---- Filtres ---- */
const types = ['tous', '3.5', '4.5'];
$('filtre-pieces').innerHTML = types.map((t) =>
  `<button type="button" data-p="${t}" class="${t === 'tous' ? 'actif' : ''}">${t === 'tous' ? 'Tous' : t === 'Studio' ? 'Studio' : t + ' p.'}</button>`).join('');
$('filtre-pieces').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  etat.pieces = b.dataset.p;
  $('filtre-pieces').querySelectorAll('button').forEach((x) => x.classList.toggle('actif', x === b));
  rafraichir();
});
$('filtre-dispo').addEventListener('change', (e) => { etat.dispoSeul = e.target.checked; rafraichir(); });
$('filtre-budget').addEventListener('change', (e) => { etat.budget = Number(e.target.value); rafraichir(); });
$('btn-couleurs').addEventListener('click', () => { etat.couleurs = !etat.couleurs; majVoiles(); });

/* ---- Liste ---- */
function rafraichir() {
  const lots = LOTS.filter(correspond).filter((l) => etat.niveau === -1 || l.niveau === etat.niveau)
    .sort((a, b) => a.lot.localeCompare(b.lot, 'fr', { numeric: true }));
  $('liste').innerHTML = lots.map((l) => `
    <tr data-lot="${l.lot}" tabindex="0">
      <td><span class="lot"><i class="pt ${l.statut}"></i>${l.lot}</span></td>
      <td>${NIVEAUX_COURTS[l.niveau]}</td>
      <td>${l.pieces === 'Studio' ? 'Studio' : l.pieces}</td>
      <td>${l.surface} m²</td>
      <td class="d ${l.statut !== 'dispo' ? 'non' : ''}">${l.statut === 'dispo' ? chf(l.prix) : STATUTS[l.statut].nom}</td>
    </tr>`).join('');
  $('vide').hidden = lots.length > 0;
  majVoiles();
  majEtiquettes();
}
const lotDe = (tr) => tr && LOTS.find((l) => l.lot === tr.dataset.lot);
$('liste').addEventListener('click', (e) => choisir(lotDe(e.target.closest('tr')), true));
$('liste').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const tr = e.target.closest('tr'); if (!tr) return;
  e.preventDefault(); choisir(lotDe(tr), true);
});
$('liste').addEventListener('mouseover', (e) => survoler(lotDe(e.target.closest('tr')) || null, false));
$('liste').addEventListener('mouseleave', () => survoler(null, false));

/* ---- Étages ---- */
document.querySelector('.etages').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  quitterVue(false);
  etat.niveau = Number(b.dataset.niveau);
  cacherAide();
  majNiveaux();
  rafraichir();
  viser(etat.niveau === -1 ? CIBLE : new THREE.Vector3(CIBLE.x, etat.niveau * H + 1, CIBLE.z), null, etat.niveau !== -1);
});

/* ---- Fiche ---- */
function planSVG(l) {
  const ch = { Studio: 0, '2.5': 1, '3.5': 2, '4.5': 3, '5.5': 4 }[l.pieces];
  const W = 400, Hh = 250, bal = 34;
  const trait = 'fill="#fbf8f3" stroke="#2a2522" stroke-width="2.5"';
  const txt = (x, y, t, s = 13) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" fill="#5d544e" font-family="Instrument Sans, sans-serif">${t}</text>`;
  let s = `<svg viewBox="0 0 ${W} ${Hh + bal}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Plan schématique du lot ${l.lot}">`;
  s += `<rect x="2" y="2" width="${W - 4}" height="${Hh - 4}" ${trait}/>`;
  if (ch === 0) {
    s += `<rect x="2" y="2" width="120" height="96" ${trait}/>` + txt(62, 54, 'Bain');
    s += `<rect x="2" y="98" width="120" height="${Hh - 100}" ${trait}/>` + txt(62, 180, 'Cuisine');
    s += txt(260, 130, 'Séjour / chambre', 15) + txt(260, 150, `${l.surface} m²`, 12);
  } else {
    const sejW = ch >= 3 ? 190 : 210;
    s += txt(sejW / 2, Hh / 2 - 6, 'Séjour / cuisine', 15) + txt(sejW / 2, Hh / 2 + 14, 'ouverte', 12);
    const pieces = [];
    for (let i = 0; i < ch; i++) pieces.push(i === 0 && ch > 1 ? 'Ch. parents' : 'Chambre');
    pieces.push('Bain');
    if (ch >= 3) pieces.push('Douche / WC');
    if (pieces.length > 3 && pieces.length % 2) pieces.push('Réduit');
    const cols = pieces.length > 3 ? 2 : 1;
    const rows = Math.ceil(pieces.length / cols);
    const cw = (W - 2 - sejW) / cols, rh = (Hh - 4) / rows;
    pieces.forEach((p, i) => {
      const c = Math.floor(i / rows), r = i % rows;
      const x = sejW + c * cw, y = 2 + r * rh;
      s += `<rect x="${x}" y="${y}" width="${cw}" height="${rh}" ${trait}/>` + txt(x + cw / 2, y + rh / 2 + 4, p, p.length > 9 ? 11 : 12);
    });
  }
  if (bal) {
    s += `<rect x="20" y="${Hh}" width="${W - 140}" height="${bal - 4}" fill="#eef3e6" stroke="#2a2522" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    s += txt(20 + (W - 140) / 2, Hh + bal / 2 + 2, l.niveau === 0 ? 'Terrasse et jardin' : 'Balcon', 12);
  }
  return s + '</svg>';
}

function afficherFiche(l) {
  $('vue-liste').hidden = true;
  $('vue-fiche').hidden = false;
  $('f-titre').textContent = `Lot ${l.lot} · ${piecesTxt(l.pieces)}`;
  const b = $('f-statut');
  b.textContent = STATUTS[l.statut].nom;
  b.className = 'badge ' + l.statut;
  $('f-prix').textContent = l.statut === 'dispo' ? chf(l.prix) : `${STATUTS[l.statut].nom} – d'autres lots similaires sont disponibles`;
  const infos = [
    ['Étage', NIVEAUX[l.niveau]], ['Pièces', piecesTxt(l.pieces) + (l.variante ? ` (${l.variante})` : '')], ['Surface habitable', `${l.surface} m²`],
    ['Exposition', l.expo], ['Immeuble', l.immeuble], ['Finitions', 'Au gré du preneur'],
  ];
  $('f-infos').innerHTML = infos.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  $('f-plan').innerHTML = planSVG(l);
  $('f-interesse').textContent = l.statut === 'dispo' ? 'Je suis intéressé·e par ce lot' : 'Me prévenir si ce lot se libère';
  $('f-vue-titre').textContent = `Voir la vue depuis ${l.niveau >= 1 ? 'le balcon' : 'la terrasse'}`;
  $('panneau').scrollTop = 0;
}

function fermerFiche() {
  quitterVue(true);
  etat.choix = null;
  $('vue-fiche').hidden = true;
  $('vue-liste').hidden = false;
  history.replaceState(null, '', location.pathname + location.search);
  majVoiles();
}
$('retour').addEventListener('click', fermerFiche);

function choisir(l, depuisListe) {
  if (!l) return;
  quitterVue(false);
  etat.choix = l;
  // Depuis la liste : on ouvre l'étage du lot en coupe pour le voir tout de suite
  if (depuisListe && etat.niveau !== l.niveau) { etat.niveau = l.niveau; majNiveaux(); rafraichir(); }
  afficherFiche(l);
  majVoiles();
  history.replaceState(null, '', '#lot-' + l.lot);
  viser(l.centre, 0.8, depuisListe);
  cacherAide();
  if (window.innerWidth < 900) $('panneau').scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
}

$('f-lien').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); toast('Lien copié : vous pouvez l\'envoyer à un acheteur'); }
  catch { toast(location.href); }
});

/* ---- Formulaire ---- */
const dlg = $('formulaire');
$('f-interesse').addEventListener('click', () => {
  const l = etat.choix; if (!l) return;
  $('form').hidden = false; $('merci').hidden = true;
  $('form-titre').textContent = `Lot ${l.lot} · ${piecesTxt(l.pieces)} · ${l.surface} m²`;
  $('form-message').value = l.statut === 'dispo'
    ? `Bonjour,\nJe suis intéressé·e par le lot ${l.lot} (${piecesTxt(l.pieces)}, ${l.surface} m², ${NIVEAUX[l.niveau].toLowerCase()}). Merci de me recontacter pour une présentation sur site.`
    : `Bonjour,\nMerci de me prévenir si le lot ${l.lot} se libère, ou de me proposer un appartement similaire.`;
  dlg.showModal();
});
$('form-annuler').addEventListener('click', () => dlg.close());
$('form').addEventListener('submit', (e) => {
  e.preventDefault();
  $('form').hidden = true; $('merci').hidden = false;
  $('merci-lot').textContent = 'lot ' + etat.choix.lot;
});
$('merci-ok').addEventListener('click', () => dlg.close());

let toastT;
function toast(t) {
  const el = $('toast'); el.textContent = t; el.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 2600);
}
function cacherAide() { $('aide').classList.add('cache'); }

/* =========================================================
   Survol, clic, caméra
   ========================================================= */
const ray = new THREE.Raycaster();
const souris = new THREE.Vector2();
const bulle = $('infobulle');

function survoler(l, depuis3D, ev) {
  if (etat.survol !== l) {
    etat.survol = l;
    majVoiles();
    document.querySelectorAll('#liste tr').forEach((tr) => tr.classList.toggle('survol', !!l && tr.dataset.lot === l.lot));
  }
  if (l && depuis3D && ev) {
    const r = viewer.getBoundingClientRect();
    bulle.hidden = false;
    bulle.style.left = ev.clientX - r.left + 'px';
    bulle.style.top = ev.clientY - r.top + 'px';
    bulle.innerHTML = `<strong>Lot ${l.lot}</strong> · ${piecesTxt(l.pieces)} · ${l.surface} m²<span class="st"><i class="pt ${l.statut}"></i>${l.statut === 'dispo' ? chf(l.prix) : STATUTS[l.statut].nom}</span>`;
  } else bulle.hidden = true;
  renderer.domElement.style.cursor = l && depuis3D ? 'pointer' : '';
}

const visible = (o) => { for (let p = o.parent; p; p = p.parent) if (!p.visible) return false; return true; };
function viseSous(ev) {
  const r = renderer.domElement.getBoundingClientRect();
  souris.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(souris, camera);
  const cibles = LOTS.filter((l) => visible(l.vol)).map((l) => l.vol).concat(bloqueurs.filter(visible));
  const hit = ray.intersectObjects(cibles, false)[0];
  const l = hit && hit.object.userData.lot;
  return l && correspond(l) ? l : null;
}

let appui = null, attente = false, dernierEv = null;
renderer.domElement.addEventListener('pointermove', (ev) => {
  if (ev.pointerType === 'touch' || vue) return;
  dernierEv = ev;
  if (attente) return;
  attente = true;
  requestAnimationFrame(() => { attente = false; survoler(viseSous(dernierEv), true, dernierEv); });
});
renderer.domElement.addEventListener('pointerleave', () => survoler(null, true));
renderer.domElement.addEventListener('pointerdown', (ev) => { appui = { x: ev.clientX, y: ev.clientY }; });
renderer.domElement.addEventListener('pointerup', (ev) => {
  if (vue || !appui || Math.hypot(ev.clientX - appui.x, ev.clientY - appui.y) > 6) return;
  const l = viseSous(ev);
  if (l) choisir(l, false);
});

// Déplacement doux de la caméra
let anim = null;
const DIR_PLAN = new THREE.Vector3(-0.38, 0.84, 0.55).normalize();
function viser(point, zoom, vuePlan) {
  let decal = camera.position.clone().sub(controls.target);
  if (decal.length() < 5) decal = DIR_DEPART.clone().multiplyScalar(45); // on sort d'une vue depuis un lot
  if (vuePlan && decal.clone().normalize().y < 0.75) decal = DIR_PLAN.clone().multiplyScalar(Math.max(decal.length(), 48));
  if (zoom) decal.setLength(Math.max(controls.minDistance + 8, decal.length() * zoom));
  anim = { t: 0, duree: 1, de: controls.target.clone(), a: point.clone(), deCam: camera.position.clone(), aCam: point.clone().add(decal) };
}
controls.addEventListener('start', () => {
  if (anim && anim.fin) anim.fin();
  anim = null; aBouge = true; cacherAide();
});

/* ---- Étiquettes des lots (vue en coupe) ---- */
const etiquettes = $('etiquettes');
function majEtiquettes() {
  etiquettes.innerHTML = '';
  if (etat.niveau === -1) return;
  for (const l of LOTS.filter((x) => x.niveau === etat.niveau)) {
    const el = document.createElement('div');
    el.className = `etiquette ${l.statut} ${correspond(l) ? '' : 'estompe'}`;
    el.innerHTML = `<b>${l.lot}</b> ${l.pieces === 'Studio' ? 'Studio' : l.pieces + ' p.'}`;
    l.etiquette = el;
    etiquettes.appendChild(el);
  }
}
const v = new THREE.Vector3();
function placerEtiquettes() {
  if (etat.niveau === -1) return;
  const w = viewer.clientWidth, h = viewer.clientHeight;
  for (const l of LOTS) {
    if (l.niveau !== etat.niveau || !l.etiquette) continue;
    v.copy(l.centre); v.y = l.niveau * H + 1.2;
    v.project(camera);
    l.etiquette.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, -50%)`;
  }
}

/* ---- Taille, introduction et boucle ---- */
const DIR_DEPART = VUE.dir.clone();
let aBouge = false;
function distanceDepart() { return Math.min(VUE.max, VUE.distance / Math.min(1, camera.aspect / 1.35)); }
function taille() {
  const w = viewer.clientWidth, h = viewer.clientHeight;
  renderer.setSize(w, h, false);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(w, h);
  camera.aspect = w / h;
  if (!anim || anim.fovA === undefined) camera.fov = fovVoulu();
  camera.updateProjectionMatrix();
  if (!aBouge && !anim) camera.position.copy(CIBLE).addScaledVector(DIR_DEPART, distanceDepart());
}
new ResizeObserver(taille).observe(viewer);
taille();

// Arrivée cinématique : la caméra tourne autour de l'immeuble avant de se poser
function intro() {
  const fin = CIBLE.clone().addScaledVector(DIR_DEPART, distanceDepart());
  const depart = new THREE.Vector3().copy(DIR_DEPART).applyAxisAngle(new THREE.Vector3(0, 1, 0), -1.1);
  depart.y = 0.16; depart.normalize();
  camera.position.copy(CIBLE).addScaledVector(depart, distanceDepart() * 1.7);
  anim = { t: 0, duree: 4.2, orbite: true, de: CIBLE.clone(), a: CIBLE.clone(), deCam: camera.position.clone(), aCam: fin };
}

const horloge = new THREE.Clock();
const sph1 = new THREE.Spherical(), sph2 = new THREE.Spherical();
function boucle() {
  // Temps réel (max 0.5 s par image) : l'arrivée dure ~4 s même sur un appareil lent
  const dt = Math.min(0.5, horloge.getDelta());
  if (anim) {
    anim.t = Math.min(1, anim.t + (reduit ? 1 : dt / anim.duree));
    const k = anim.orbite ? (anim.t < 0.5 ? 4 * anim.t ** 3 : 1 - (-2 * anim.t + 2) ** 3 / 2) : 1 - Math.pow(1 - anim.t, 3);
    controls.target.lerpVectors(anim.de, anim.a, k);
    if (anim.orbite) {
      // Interpolation en orbite (angle + distance), plus naturelle qu'une ligne droite
      sph1.setFromVector3(anim.deCam.clone().sub(CIBLE)); sph2.setFromVector3(anim.aCam.clone().sub(CIBLE));
      const s = new THREE.Spherical(sph1.radius + (sph2.radius - sph1.radius) * k, sph1.phi + (sph2.phi - sph1.phi) * k, sph1.theta + (sph2.theta - sph1.theta) * k);
      camera.position.setFromSpherical(s).add(CIBLE);
    } else camera.position.lerpVectors(anim.deCam, anim.aCam, k);
    if (anim.fovA !== undefined) { camera.fov = anim.fovDe + (anim.fovA - anim.fovDe) * k; camera.updateProjectionMatrix(); }
    if (anim.t >= 1) { const fin = anim.fin; anim = null; if (fin) fin(); }
  }
  if (sol.joue) avancerSoleil(dt);
  controls.update();
  placerEtiquettes();
  composer.render();
  requestAnimationFrame(boucle);
}

/* =========================================================
   Soleil : saison + heure, position réelle du soleil sur le projet (latitude dans config.js)
   ========================================================= */
const SAISONS = {
  ete: { jour: 172, tz: 2, min: 6, max: 21 },        // 21 juin (heure d'été)
  automne: { jour: 264, tz: 2, min: 7.75, max: 19 }, // 21 septembre
  hiver: { jour: 355, tz: 1, min: 8.75, max: 16.5 },  // 21 décembre
};
const LAT = PROJET.latitude * Math.PI / 180, LON = PROJET.longitude;
function dirSoleil(s, h) {
  const r = Math.PI / 180;
  const decl = 23.44 * r * Math.sin(2 * Math.PI * (284 + s.jour) / 365);
  const B = 2 * Math.PI * (s.jour - 81) / 364;
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const ha = 15 * r * (h - s.tz + LON / 15 + eot / 60 - 12);
  const se = Math.sin(LAT) * Math.sin(decl) + Math.cos(LAT) * Math.cos(decl) * Math.cos(ha);
  const e = Math.asin(se);
  let A = Math.acos(Math.min(1, Math.max(-1, (Math.sin(decl) - se * Math.sin(LAT)) / (Math.cos(e) * Math.cos(LAT)))));
  if (ha > 0) A = 2 * Math.PI - A;
  // Maquette : nord = -z, est = +x
  return new THREE.Vector3(Math.sin(A) * Math.cos(e), Math.max(se, 0.015), -Math.cos(A) * Math.cos(e)).normalize();
}
const hTxt = (h) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
let dernierReflet = 0;
function appliquerSoleil(final) {
  const t = performance.now();
  const reflets = final || t - dernierReflet > 280; // les reflets du ciel coûtent cher : pas à chaque image
  if (reflets) dernierReflet = t;
  reglerSoleil(dirSoleil(SAISONS[sol.saison], sol.heure), reflets);
  $('soleil-txt').textContent = hTxt(sol.heure);
  $('soleil-heure').value = sol.heure;
}
function jouerSoleil(oui) {
  sol.joue = oui;
  $('soleil-jouer').classList.toggle('actif', oui);
  $('soleil-jouer').setAttribute('aria-label', oui ? 'Arrêter' : 'Faire défiler la journée');
  if (!oui) appliquerSoleil(true);
}
function avancerSoleil(dt) {
  const s = SAISONS[sol.saison];
  sol.heure = Math.min(s.max, sol.heure + dt * 1.1); // ~1 h par seconde
  appliquerSoleil(false);
  if (sol.heure >= s.max) jouerSoleil(false);
}
function ouvrirSoleil(oui) {
  $('soleil').hidden = !oui;
  $('btn-soleil').setAttribute('aria-expanded', oui);
}
$('btn-soleil').addEventListener('click', () => ouvrirSoleil($('soleil').hidden));
$('soleil-heure').addEventListener('input', (e) => {
  const h = Number(e.target.value); // lire avant d'arrêter la lecture (qui remet le curseur à jour)
  if (sol.joue) jouerSoleil(false);
  sol.heure = h; appliquerSoleil(false);
});
$('soleil-heure').addEventListener('change', () => appliquerSoleil(true));
$('soleil-jouer').addEventListener('click', () => {
  const s = SAISONS[sol.saison];
  if (!sol.joue && sol.heure >= s.max - 0.1) sol.heure = s.min;
  jouerSoleil(!sol.joue);
});
document.querySelector('.saisons').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  sol.saison = b.dataset.saison;
  const s = SAISONS[sol.saison];
  document.querySelectorAll('.saisons button').forEach((x) => x.classList.toggle('actif', x === b));
  Object.assign($('soleil-heure'), { min: s.min, max: s.max });
  sol.heure = Math.min(s.max, Math.max(s.min, sol.heure));
  appliquerSoleil(true);
});

/* =========================================================
   Vue depuis un lot : à hauteur d'yeux, sur son balcon / sa terrasse
   ========================================================= */
const appEl = document.querySelector('.app');
function entrerVue(l) {
  if (!vue) vue = { min: controls.minDistance, max: controls.maxDistance, pol: controls.maxPolarAngle };
  vue.lot = l;
  aBouge = true;
  bulle.hidden = true; survoler(null, false);
  if (etat.niveau !== -1) { etat.niveau = -1; majNiveaux(); rafraichir(); }
  const { oeil, dir } = pointDeVue(l);
  const cible = oeil.clone().addScaledVector(dir, 0.6); cible.y -= 0.1; // un peu vers le bas : on voit la rambarde
  // Pendant le trajet : pas de limite de distance. À l'arrivée : on regarde autour de soi.
  Object.assign(controls, { minDistance: 0.01, maxDistance: 400, maxPolarAngle: Math.PI * 0.72, enableZoom: false, enablePan: false });
  camera.near = 0.06; camera.updateProjectionMatrix();
  anim = {
    t: 0, duree: reduit ? 0.01 : 1.9, de: controls.target.clone(), a: cible, deCam: camera.position.clone(), aCam: oeil,
    fovDe: camera.fov, fovA: fovVoulu(),
    fin: () => Object.assign(controls, { maxDistance: 1, rotateSpeed: -0.45 }),
  };
  appEl.classList.add('en-vue');
  $('bandeau-txt').textContent = `Vue depuis le lot ${l.lot} · ${NIVEAUX[l.niveau]} · glissez pour regarder autour`;
  $('bandeau-vue').hidden = false;
  if (!mobile) ouvrirSoleil(true); // sur téléphone il cacherait la vue
  majVoiles();
  if (window.innerWidth < 900) viewer.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
}
function quitterVue(revenir) {
  if (!vue) return;
  const l = vue.lot, sauve = vue;
  vue = null;
  appEl.classList.remove('en-vue');
  $('bandeau-vue').hidden = true;
  const normal = () => Object.assign(controls, { minDistance: sauve.min, maxDistance: sauve.max, maxPolarAngle: sauve.pol, enableZoom: true, enablePan: true, rotateSpeed: 1 });
  camera.near = 0.3;
  if (revenir) {
    Object.assign(controls, { maxDistance: 400, rotateSpeed: 1 });
    const a = l.centre.clone();
    anim = { t: 0, duree: reduit ? 0.01 : 1.4, de: controls.target.clone(), a, deCam: camera.position.clone(), aCam: a.clone().addScaledVector(DIR_DEPART, 42), fovDe: camera.fov, fovA: fovVoulu(), fin: normal };
  } else {
    normal();
    camera.fov = fovVoulu();
  }
  camera.updateProjectionMatrix();
  majVoiles();
}
$('f-vue').addEventListener('click', () => { if (etat.choix) entrerVue(etat.choix); });
$('quitter-vue').addEventListener('click', () => quitterVue(true));

/* =========================================================
   Galerie : images de l’annonce (liste dans config.js)
   ========================================================= */
// IMAGES vient de config.js
const vis = $('visionneuse');
let gi = 0;
$('g-minis').innerHTML = IMAGES.map(([f, t], i) =>
  `<button type="button" data-i="${i}" aria-label="Image ${i + 1} : ${t}"><img src="img/galerie/${f}-mini.jpg" alt="" width="64" height="36" loading="lazy"></button>`).join('');
function montrerImage(i) {
  gi = (i + IMAGES.length) % IMAGES.length;
  const [f, t] = IMAGES[gi];
  $('g-img').src = `img/galerie/${f}.jpg`; $('g-img').alt = t;
  $('g-compte').textContent = `${gi + 1} / ${IMAGES.length}`;
  $('g-minis').querySelectorAll('button').forEach((b, k) => b.classList.toggle('actif', k === gi));
  if (vis.open) {
    $('v-img').src = `img/galerie/${f}.jpg`; $('v-img').alt = t;
    $('v-legende').textContent = `${t} · ${gi + 1} / ${IMAGES.length}`;
    new Image().src = `img/galerie/${IMAGES[(gi + 1) % IMAGES.length][0]}.jpg`; // précharge la suivante
  }
}
$('g-minis').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) montrerImage(Number(b.dataset.i)); });
$('g-grande').addEventListener('click', () => { vis.showModal(); montrerImage(gi); });
$('v-prec').addEventListener('click', () => montrerImage(gi - 1));
$('v-suiv').addEventListener('click', () => montrerImage(gi + 1));
$('v-fermer').addEventListener('click', () => vis.close());
vis.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') montrerImage(gi - 1);
  if (e.key === 'ArrowRight') montrerImage(gi + 1);
});
let glisse = null;
$('v-img').addEventListener('pointerdown', (e) => { glisse = e.clientX; });
$('v-img').addEventListener('pointerup', (e) => {
  if (glisse === null) return;
  const dx = e.clientX - glisse; glisse = null;
  if (Math.abs(dx) > 40) montrerImage(gi + (dx < 0 ? 1 : -1));
});
montrerImage(0);

/* =========================================================
   Fiche PDF du lot (impression du navigateur → « Enregistrer en PDF »)
   ========================================================= */
$('f-pdf').addEventListener('click', async () => {
  const l = etat.choix; if (!l) return;
  // Prise de vue cadrée sur la façade du lot (puis la caméra revient où elle était)
  const pos = camera.position.clone(), cib = controls.target.clone(), fov = camera.fov, near = camera.near;
  const { dir } = pointDeVue(l);
  camera.position.copy(l.centre).addScaledVector(dir, 36).add(new THREE.Vector3(-dir.z * 12, 13, dir.x * 12));
  // Format paysage 16:9 et immeuble entier (même si un étage est affiché en coupe)
  renderer.setSize(1600, 900, false); composer.setSize(1600, 900);
  camera.aspect = 16 / 9; camera.lookAt(l.centre); camera.fov = 36; camera.near = 0.3; camera.updateProjectionMatrix();
  niveaux.forEach((g) => { g.visible = true; }); toit.visible = true;
  const vol = l.vol.visible, op = l.vol.material.opacity, ob = l.bord.material.opacity, pl = l.plaque.visible;
  l.vol.visible = true; l.vol.material.opacity = 0.55; l.bord.material.opacity = 1; l.plaque.visible = false;
  composer.render();
  const image3D = renderer.domElement.toDataURL('image/jpeg', 0.9);
  l.vol.visible = vol; l.vol.material.opacity = op; l.bord.material.opacity = ob; l.plaque.visible = pl;
  majNiveaux();
  camera.position.copy(pos); controls.target.copy(cib); camera.fov = fov; camera.near = near;
  camera.lookAt(cib);
  aBouge = true; // sinon taille() remettrait la caméra au départ
  taille();
  $('impression').innerHTML = `
    <header class="p-tete">
      <div><img src="${PROJET.logo}" alt=""><h1>${PROJET.nom}</h1></div>
      <p>${PROJET.sousTitre}<br>${PROJET.lieu}<br>${PROJET.livraison}</p>
    </header>
    <div class="p-lot"><h2>Lot ${l.lot} · ${piecesTxt(l.pieces)}</h2><b>${l.statut === 'dispo' ? chf(l.prix) : STATUTS[l.statut].nom}</b></div>
    <img class="p-vue" src="${image3D}" alt="">
    <div class="p-grille">
      <dl class="p-infos">${$('f-infos').innerHTML}</dl>
      <div class="p-plan">${planSVG(l)}</div>
    </div>
    <div class="p-images"><img src="img/galerie/${IMAGES[0][0]}.jpg" alt=""><img src="img/galerie/${IMAGES[2][0]}.jpg" alt=""></div>
    <p class="p-pied"><strong>${PROJET.promoteur}</strong> · ${PROJET.contactNom} · ${PROJET.telephone} · ${PROJET.email}<br>${PROJET.parking}<br>
    Visualisations de la promotion, pas forcément ce lot · plan schématique et position du lot indicatifs.</p>`;
  await Promise.all([...$('impression').querySelectorAll('img')].map((i) => i.decode().catch(() => {})));
  const titre = document.title;
  document.title = `${PROJET.nom} - lot ${l.lot}`; // nom proposé pour le fichier PDF
  window.print();
  document.title = titre;
});

/* ---- Démarrage ---- */
appliquerSoleil(true);
majNiveaux();
rafraichir();
const m = location.hash.match(/^#lot-([A-Z]\d+)$/);
if (m) choisir(LOTS.find((l) => l.lot === m[1]), true);
else if (!reduit) intro();
composer.render();
requestAnimationFrame(() => { $('chargement').classList.add('fini'); boucle(); });
