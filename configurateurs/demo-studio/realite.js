// « Voir chez moi » (13.11.2026) : le produit configuré, en taille réelle, dans le jardin du client.
// - iPhone / iPad : modèle exporté en USDZ dans le navigateur, ouvert dans AR Quick Look (Apple).
// - Android (Chrome) : réalité augmentée WebXR : on vise le sol, on touche l'écran pour poser.
// - Ordinateur : QR code qui ouvre la même configuration sur le téléphone.
// Rien n'est envoyé à un serveur : tout est calculé sur l'appareil du client.
import * as THREE from 'three';
import { USDZExporter } from 'three/addons/exporters/USDZExporter.js';

const estIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad récent (se dit « Mac »)

// Que peut faire cet appareil ? 'ios' | 'webxr' | 'aucun'
export async function capaciteRA() {
  const a = document.createElement('a');
  if (estIOS() && a.relList?.supports?.('ar')) return 'ios';
  try {
    if (navigator.xr && await navigator.xr.isSessionSupported('immersive-ar')) return 'webxr';
  } catch { /* navigateur sans WebXR */ }
  return 'aucun';
}

// Copie du produit seul (sans voitures, sans voiles d'ombre), centrée sur l'origine, prête pour la RA.
// Les maillages instanciés (lames de pergola) sont dépliés : AR Quick Look ne les comprend pas.
export function copieProduit(groupe, exclure = () => false) {
  const copie = new THREE.Group();
  groupe.updateMatrixWorld(true);
  const inverse = groupe.matrixWorld.clone().invert();
  const m = new THREE.Matrix4();
  const ajouter = (geo, mat, matrice, ombre) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(matrice);
    mesh.castShadow = ombre;
    mesh.receiveShadow = true;
    copie.add(mesh);
  };
  const parcourir = (o) => {
    if (!o.visible || o.userData.vehicule || exclure(o)) return;
    if (o.isMesh && !Array.isArray(o.material)) {
      const local = new THREE.Matrix4().multiplyMatrices(inverse, o.matrixWorld);
      if (o.isInstancedMesh) {
        for (let i = 0; i < o.count; i++) {
          o.getMatrixAt(i, m);
          ajouter(o.geometry, o.material, new THREE.Matrix4().multiplyMatrices(local, m), o.castShadow);
        }
      } else {
        ajouter(o.geometry, o.material, local, o.castShadow);
      }
    }
    for (const c of o.children) parcourir(c);
  };
  for (const c of groupe.children) parcourir(c);
  return copie;
}

// ---------- iPhone : USDZ + AR Quick Look ----------
export async function exporterUSDZ(copie) {
  copie.updateMatrixWorld(true);
  const donnees = await new USDZExporter().parse(copie, { quickLookCompatible: true });
  return new Blob([donnees], { type: 'model/vnd.usdz+zip' });
}

export async function ouvrirQuickLook(copie, nomFichier = 'projet') {
  const blob = await exporterUSDZ(copie);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.rel = 'ar';
  // Taille réelle fixe (pas de zoom à deux doigts qui fausserait les dimensions)
  a.href = `${url}#allowsContentScaling=0`;
  a.download = `${nomFichier}.usdz`;
  a.appendChild(document.createElement('img')); // (AR Quick Look exige une image dans le lien)
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 60000);
  return blob.size;
}

// ---------- Android : WebXR, poser le produit au sol ----------
export async function lancerWebXR({ renderer, camera, environnement, copie, overlay, textes, quandFini }) {
  const session = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay', 'light-estimation'],
    domOverlay: { root: overlay },
  });
  const scene = new THREE.Scene();
  scene.environment = environnement ?? null;
  scene.add(new THREE.HemisphereLight('#ffffff', '#8a8578', 1.2));
  const soleil = new THREE.DirectionalLight('#fff4e5', 2.4);
  soleil.position.set(4, 9, 3);
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(2048, 2048);
  Object.assign(soleil.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 0.5, far: 30 });
  soleil.shadow.bias = -0.0005;

  // Le produit + son ombre posée sur le vrai sol (plan invisible qui ne garde que l'ombre)
  const pose = new THREE.Group();
  pose.visible = false;
  pose.add(copie);
  const sol = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.32 }));
  sol.rotation.x = -Math.PI / 2;
  sol.position.y = 0.002;
  sol.receiveShadow = true;
  pose.add(sol);
  soleil.target = pose;
  pose.add(soleil);
  scene.add(pose);

  // Viseur : anneau posé sur le sol détecté
  const viseur = new THREE.Mesh(
    new THREE.RingGeometry(0.22, 0.28, 40).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9 }),
  );
  viseur.matrixAutoUpdate = false;
  viseur.visible = false;
  scene.add(viseur);

  const ombreAvant = renderer.shadowMap.enabled;
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local');
  await renderer.xr.setSession(session);

  const espaceVue = await session.requestReferenceSpace('viewer');
  const source = await session.requestHitTestSource({ space: espaceVue });
  let enPlacement = true;
  const aide = overlay.querySelector('[data-ra="aide"]');
  const majAide = () => { aide.textContent = enPlacement ? textes.viser : textes.pose; };
  majAide();

  const placer = () => {
    if (!enPlacement || !viseur.visible) return;
    pose.position.setFromMatrixPosition(viseur.matrix);
    // L'entrée (avant du produit, +z) face à la personne qui tient le téléphone
    const cam = renderer.xr.getCamera();
    const p = new THREE.Vector3().setFromMatrixPosition(cam.matrixWorld);
    pose.rotation.y = Math.atan2(p.x - pose.position.x, p.z - pose.position.z);
    pose.visible = true;
    enPlacement = false;
    majAide();
  };
  const manette = renderer.xr.getController(0);
  manette.addEventListener('select', placer);
  scene.add(manette);

  // Boutons de l'overlay (un appui dessus ne doit pas aussi « poser » le produit)
  const boutons = overlay.querySelector('[data-ra="boutons"]');
  const bloquer = (e) => e.preventDefault();
  boutons.addEventListener('beforexrselect', bloquer);
  const actions = {
    tourner: () => { pose.rotation.y += Math.PI / 12; },
    deplacer: () => { enPlacement = true; majAide(); },
    fermer: () => session.end(),
  };
  const clic = (e) => { const a = e.target.closest('[data-action]')?.dataset.action; if (a) actions[a](); };
  boutons.addEventListener('click', clic);

  renderer.setAnimationLoop((t, frame) => {
    if (frame) {
      const ref = renderer.xr.getReferenceSpace();
      const res = frame.getHitTestResults(source);
      if (res.length && enPlacement) {
        viseur.visible = true;
        viseur.matrix.fromArray(res[0].getPose(ref).transform.matrix);
      } else {
        viseur.visible = false;
      }
    }
    renderer.render(scene, camera);
  });

  session.addEventListener('end', () => {
    renderer.setAnimationLoop(null);
    renderer.xr.enabled = false;
    renderer.shadowMap.enabled = ombreAvant;
    source.cancel?.();
    boutons.removeEventListener('beforexrselect', bloquer);
    boutons.removeEventListener('click', clic);
    sol.geometry.dispose();
    sol.material.dispose();
    viseur.geometry.dispose();
    viseur.material.dispose();
    quandFini?.();
  });
}

// ---------- Ordinateur : QR code vers la même configuration ----------
export function dessinerQR(conteneur, texte) {
  conteneur.textContent = '';
  if (typeof window.qrcode !== 'function') {
    conteneur.textContent = texte;
    return;
  }
  const qr = window.qrcode(0, 'M');
  qr.addData(texte);
  qr.make();
  const n = qr.getModuleCount();
  const c = document.createElement('canvas');
  const px = 6;
  const marge = 4;
  c.width = c.height = (n + 2 * marge) * px;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#1c1b19';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) g.fillRect((x + marge) * px, (y + marge) * px, px, px);
  c.setAttribute('role', 'img');
  c.setAttribute('aria-label', 'QR code : ouvrir cette configuration sur le téléphone');
  conteneur.append(c);
}
