// Textures dessinées dans le navigateur (aucune image à télécharger).
// Les coordonnées de texture sont en mètres : texture.repeat = 1 / taille réelle d'un motif.
import * as THREE from 'three';

let graine = 20261112;
export function alea() { graine = (graine * 16807) % 2147483647; return (graine - 1) / 2147483646; }

function toile(t) { const c = document.createElement('canvas'); c.width = c.height = t; return [c, c.getContext('2d')]; }

function fond(ctx, t, rgb) { ctx.fillStyle = `rgb(${rgb})`; ctx.fillRect(0, 0, t, t); }

// Grain fin, pixel par pixel
function grain(ctx, t, amp, couleur = false) {
  const img = ctx.getImageData(0, 0, t, t); const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (alea() - 0.5) * amp;
    d[i] += n + (couleur ? (alea() - 0.5) * amp * 0.4 : 0); d[i + 1] += n; d[i + 2] += n * (couleur ? 0.6 : 1);
  }
  ctx.putImageData(img, 0, 0);
}

// Taches douces qui se raccordent sur les bords (motif répétable sans couture)
function taches(ctx, t, nb, rMin, rMax, couleurs, alpha) {
  for (let i = 0; i < nb; i++) {
    const x = alea() * t, y = alea() * t, r = rMin + alea() * (rMax - rMin);
    const c = couleurs[Math.floor(alea() * couleurs.length)];
    for (const dx of [-t, 0, t]) for (const dy of [-t, 0, t]) {
      const g = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
      g.addColorStop(0, `rgba(${c},${alpha})`); g.addColorStop(1, `rgba(${c},0)`);
      ctx.fillStyle = g; ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
    }
  }
}

function points(ctx, t, nb, taille, couleurs) {
  for (let i = 0; i < nb; i++) {
    ctx.fillStyle = `rgba(${couleurs[Math.floor(alea() * couleurs.length)]})`;
    const s = taille * (0.5 + alea());
    ctx.fillRect(alea() * t, alea() * t, s, s);
  }
}

const DESSINS = {
  enduit: { taille: 3, t: 512, f(ctx, t) {
    fond(ctx, t, '233,221,201');
    taches(ctx, t, 60, 20, 90, ['250,242,228', '214,200,178'], 0.08);
    grain(ctx, t, 10);
  } },
  enduitInt: { taille: 3, t: 256, f(ctx, t) { fond(ctx, t, '244,241,236'); grain(ctx, t, 5); } },
  beton: { taille: 4, t: 512, f(ctx, t) {
    fond(ctx, t, '190,186,178');
    taches(ctx, t, 80, 10, 70, ['160,156,149', '208,204,196', '150,148,140'], 0.12);
    grain(ctx, t, 16);
  } },
  herbe: { taille: 7, t: 512, f(ctx, t) {
    fond(ctx, t, '122,150,74');
    taches(ctx, t, 140, 12, 70, ['92,122,56', '146,168,86', '160,160,92', '104,134,62'], 0.22);
    grain(ctx, t, 34, true);
    points(ctx, t, 2500, 1.5, ['70,98,40,.5', '150,170,95,.5']);
  } },
  enrobe: { taille: 3, t: 512, f(ctx, t) {
    fond(ctx, t, '70,71,74');
    taches(ctx, t, 50, 15, 80, ['58,59,62', '86,86,88'], 0.18);
    grain(ctx, t, 26);
    points(ctx, t, 4000, 1.4, ['150,150,150,.35', '30,30,30,.4']);
  } },
  gravier: { taille: 2, t: 512, f(ctx, t) {
    fond(ctx, t, '146,141,133');
    points(ctx, t, 12000, 2.5, ['180,175,166,.8', '110,106,100,.8', '160,150,135,.8', '95,95,95,.7']);
    grain(ctx, t, 18);
  } },
  dalles: { taille: 2, t: 512, f(ctx, t) {
    const n = 4, s = t / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = 178 + (alea() - 0.5) * 16;
      ctx.fillStyle = `rgb(${v},${v - 6},${v - 14})`; ctx.fillRect(i * s, j * s, s, s);
    }
    taches(ctx, t, 30, 10, 50, ['150,144,136', '200,195,186'], 0.15);
    grain(ctx, t, 14);
    ctx.fillStyle = 'rgba(95,90,84,.9)';
    for (let i = 0; i <= n; i++) { ctx.fillRect(i * s - 1.5, 0, 3, t); ctx.fillRect(0, i * s - 1.5, t, 3); }
  } },
  parquet: { taille: 2, t: 512, f(ctx, t) {
    const lignes = 10, h = t / lignes;
    for (let r = 0; r < lignes; r++) {
      let x = -alea() * t * 0.5;
      while (x < t) {
        const l = t * (0.3 + alea() * 0.5);
        const v = alea();
        ctx.fillStyle = `rgb(${172 + v * 30},${128 + v * 26},${84 + v * 20})`;
        ctx.fillRect(x, r * h, l, h); ctx.fillRect(x + t, r * h, l, h);
        ctx.fillStyle = 'rgba(90,60,35,.5)'; ctx.fillRect(x, r * h, 1.5, h);
        x += l;
      }
      ctx.fillStyle = 'rgba(90,60,35,.45)'; ctx.fillRect(0, r * h, t, 1.2);
    }
    for (let i = 0; i < 400; i++) { ctx.fillStyle = `rgba(110,75,45,${alea() * 0.12})`; ctx.fillRect(alea() * t, alea() * t, 30 + alea() * 80, 1); }
    grain(ctx, t, 8);
  } },
  lames: { taille: 0.6, t: 128, f(ctx, t) { // stores à lamelles
    for (let y = 0; y < t; y += 8) {
      ctx.fillStyle = '#6e5241'; ctx.fillRect(0, y, t, 8);   // stores bruns
      ctx.fillStyle = '#8d6c55'; ctx.fillRect(0, y, t, 3);
      ctx.fillStyle = '#3a2a20'; ctx.fillRect(0, y + 7, t, 1);
    }
  } },
  pv: { taille: 1, t: 256, f(ctx, t) {
    fond(ctx, t, '20,30,52');
    const n = 6, s = t / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = (alea() - 0.5) * 8;
      ctx.fillStyle = `rgb(${24 + v},${36 + v},${66 + v})`; ctx.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
    }
    ctx.fillStyle = 'rgba(170,180,200,.35)';
    for (let i = 0; i < n; i++) { ctx.fillRect(i * s + s / 2, 0, 1, t); }
  } },
  haie: { taille: 1.6, t: 256, f(ctx, t) {
    fond(ctx, t, '52,82,36');
    taches(ctx, t, 220, 3, 14, ['36,62,26', '74,108,48', '90,120,52', '28,48,20'], 0.55);
    grain(ctx, t, 30, true);
  } },
  feuillage: { taille: 2.5, t: 256, f(ctx, t) {
    fond(ctx, t, '200,200,200');
    taches(ctx, t, 260, 3, 12, ['120,120,120', '255,255,255', '160,160,160'], 0.6);
    grain(ctx, t, 40);
  } },
  tuiles: { taille: 1.2, t: 256, f(ctx, t) {
    for (let y = 0; y < t; y += 16) for (let x = (y / 16) % 2 ? -12 : 0; x < t; x += 24) {
      const v = (alea() - 0.5) * 30;
      ctx.fillStyle = `rgb(${142 + v},${70 + v * 0.5},${48 + v * 0.3})`; ctx.fillRect(x, y, 23, 15);
      ctx.fillStyle = 'rgba(60,25,15,.5)'; ctx.fillRect(x, y + 13, 23, 3);
    }
    grain(ctx, t, 14);
  } },
};

export function creerTextures(renderer) {
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const tex = {};
  for (const [nom, d] of Object.entries(DESSINS)) {
    const [c, ctx] = toile(d.t);
    d.f(ctx, d.t);
    const tx = new THREE.CanvasTexture(c);
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
    tx.repeat.set(1 / d.taille, 1 / d.taille);
    tx.anisotropy = aniso;
    tx.colorSpace = nom === 'feuillage' ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    tex[nom] = tx;
  }
  return tex;
}
