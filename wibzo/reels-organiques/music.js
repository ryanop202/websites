// Musique originale + bruitages des reels organiques (synthèse, aucun sample externe).
// node music.js <1|2|3> → out/music_rN.wav. Instruments repris de ../pubs-v2/music.js.
const fs = require('fs');
const path = require('path');
const V = process.argv[2] || '1';
const CFG = require('./config');
const DUR = CFG[V] ? CFG[V].dur : { 1: 15.6, 2: 15.2, 3: 12.6 }[V];
const SR = 44100, N = Math.round(SR * DUR);
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const midi = m => 440 * Math.pow(2, (m - 69) / 12);

function add(t0, len, fn, gain = 1, pan = 0) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(len * SR);
  const gl = gain * Math.min(1, 1 - pan), gr = gain * Math.min(1, 1 + pan);
  for (let i = 0; i < n; i++) {
    const k = s0 + i; if (k < 0 || k >= N) continue;
    const v = fn(i / SR, i);
    L[k] += v * gl; R[k] += v * gr;
  }
}
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));

// --- Instruments ---
function kick(t0, g = 1) {
  let ph = 0;
  add(t0, .42, (t) => { const f = 45 + 110 * Math.exp(-t * 28); ph += 2 * Math.PI * f / SR; return Math.sin(ph) * env(t, .002, .16) * 1.1 + (t < .006 ? rnd() * .3 : 0); }, g);
}
function clap(t0, g = 1) {
  let y = 0, x1 = 0;
  add(t0, .22, (t) => { const n = rnd(); const hp = n - x1; x1 = n; y += (hp - y) * .55; const burst = t < .03 ? (Math.floor(t / .009) % 2 ? .4 : 1) : 1; return y * env(t, .001, .07) * burst; }, g * .9);
}
function hat(t0, g = .25, open = false) {
  let x1 = 0;
  add(t0, open ? .18 : .05, (t) => { const n = rnd(); const v = n - x1; x1 = n; return v * env(t, .001, open ? .06 : .015); }, g, .25);
}
function saw(ph) { return 2 * (ph - Math.floor(ph + .5)); }
function bass(t0, m, len, g = .5) {
  const f = midi(m); let ph = 0, y = 0;
  add(t0, len, (t) => { ph += f / SR; const v = saw(ph) * .6 + Math.sin(2 * Math.PI * ph) * .7; const cut = .05 + .25 * Math.exp(-t * 14); y += (v - y) * cut; return y * env(t, .004, len * .6); }, g);
}
function chord(t0, notes, len, g = .18, bright = .2) {
  notes.forEach((m, j) => [-.08, .08].forEach((det, s) => {
    const f = midi(m) * Math.pow(2, det / 12); let ph = rnd() * .5 + .5, y = 0;
    add(t0, len, (t) => { ph += f / SR; const v = saw(ph); const cut = .03 + bright * Math.exp(-t * 9); y += (v - y) * cut; return y * env(t, .005, len * .45); }, g / notes.length, s ? .35 : -.35);
  }));
}
function pluck(t0, m, g = .14, pan = 0) {
  const f = midi(m); let ph = 0;
  add(t0, .35, (t) => { ph += f / SR; return (Math.sin(2 * Math.PI * ph) + .3 * Math.sin(4 * Math.PI * ph)) * env(t, .002, .09); }, g, pan);
}

// --- Bruitages ---
function whoosh(t0, len = .32, g = .35) {
  let y = 0;
  add(t0, len, (t) => { const x = t / len; const cut = .02 + .5 * x * x; y += (rnd() - y) * cut; return y * Math.sin(Math.PI * x) * 1.6; }, g);
}
function riser(t0, t1, g = .3) {
  let y = 0, ph = 0; const len = t1 - t0;
  add(t0, len, (t) => { const x = t / len; y += (rnd() - y) * (.02 + .35 * x); ph += (200 + 1800 * x * x) / SR; return (y * .8 + Math.sin(2 * Math.PI * ph) * .25) * x * x; }, g);
}
function impact(t0, g = .9) {
  let ph = 0, y = 0;
  add(t0, 1.2, (t) => { const f = 38 + 60 * Math.exp(-t * 9); ph += f / SR; y += (rnd() - y) * .08; return Math.sin(2 * Math.PI * ph) * env(t, .002, .45) + y * env(t, .001, .25) * .9; }, g);
}
function pop(t0, g = .22, f0 = 900) {
  let ph = 0;
  add(t0, .09, (t) => { ph += (f0 + 900 * Math.exp(-t * 60)) / SR; return Math.sin(2 * Math.PI * ph) * env(t, .001, .025); }, g);
}
function tap(t0, g = .35) {
  let x1 = 0;
  add(t0, .05, (t) => { const n = rnd(); const v = n - x1; x1 = n; return (v * .6 + Math.sin(2 * Math.PI * 1800 * t) * .5) * env(t, .0005, .008); }, g);
}
function ding(t0, g = .22) {
  [88, 95].forEach((m, j) => { const f = midi(m); add(t0 + j * .08, .8, (t) => Math.sin(2 * Math.PI * f * t) * env(t, .002, .25), g); });
}
function buzz(t0, len, g = .2) {
  add(t0, len, (t) => { const v = Math.sign(Math.sin(2 * Math.PI * 160 * t)) * .5 + Math.sin(2 * Math.PI * 80 * t); return v * (t < .02 ? t / .02 : 1) * (len - t < .03 ? (len - t) / .03 : 1); }, g);
}
function blip(t0, g = .18) { [83, 79].forEach((m, j) => { const f = midi(m); add(t0 + j * .07, .12, (t) => Math.sign(Math.sin(2 * Math.PI * f * t)) * env(t, .001, .04), g); }); }
function tick(t0, g = .12) { add(t0, .02, (t) => Math.sin(2 * Math.PI * 3200 * t) * env(t, .0005, .004), g); }
function thud(t0, g = .8) {
  let ph = 0, y = 0;
  add(t0, .5, (t) => { ph += (60 + 140 * Math.exp(-t * 30)) / SR; y += (rnd() - y) * .15; return Math.sin(2 * Math.PI * ph) * env(t, .001, .12) + y * env(t, .001, .05); }, g);
}

function rewind(t0, len, g = .35) {
  // bande qu'on rembobine : bruit filtré + sifflement qui descend
  let y = 0, ph = 0;
  add(t0, len, (t) => { const x = t / len; y += (rnd() - y) * (.25 - .2 * x); ph += (2400 - 2000 * x) / SR; return (y * .7 + Math.sin(2 * Math.PI * ph) * .18 * (1 + Math.sin(t * 90))) * Math.sin(Math.PI * Math.min(1, x * 1.2)); }, g);
}
function beep(t0, m, len = .12, g = .2) { const f = midi(m); add(t0, len, (t) => Math.sin(2 * Math.PI * f * t) * (t < len - .01 ? 1 : (len - t) / .01) * Math.min(1, t / .003), g); }

if (CFG[V] && CFG[V].music) {
  // Musique générique série 2 : calme jusqu'à « drop », puis groove. Bruitages listés dans config.js.
  const M = CFG[V].music, BEAT = 60 / (M.bpm || 104), DROP = M.drop == null ? 0 : M.drop;
  const MIN = [[57, 60, 64, 69, 45], [53, 57, 60, 65, 41], [55, 59, 62, 67, 43], [52, 55, 59, 64, 40]];
  const MAJ = [[60, 64, 67, 72, 48], [57, 60, 64, 69, 45], [53, 57, 60, 65, 41], [55, 59, 62, 67, 43]];
  const pre = M.pre === 'maj' ? MAJ : MIN, post = M.post === 'min' ? MIN : MAJ;
  for (let b = 0; b * BEAT < DROP - .05; b++) {
    const t = b * BEAT, c = pre[Math.floor(b / 2) % 4];
    if (b % 2 === 0) chord(t, c.slice(0, 3), BEAT * 2, .12, .05);
    hat(t + BEAT / 2, .07); if (b % 2 === 0) kick(t, .4);
  }
  for (let b = 0; DROP + b * BEAT < DUR; b++) {
    const t = DROP + b * BEAT, c = post[Math.floor(b / 2) % 4];
    kick(t, .72); if (b % 2 === 1) clap(t, .34);
    hat(t + BEAT / 2, .15); bass(t + BEAT / 2, c[4], BEAT * .45, .4);
    chord(t, c.slice(0, 4), BEAT * .9, .14, .16);
    if (M.pluck !== false) pluck(t + BEAT / 4, c[3] + 12, .05, b % 2 ? .3 : -.3);
  }
  const FX = { pop: t => pop(t, .18, 900), tap: t => tap(t, .45), ding: t => ding(t, .2), whoosh: t => whoosh(t, .4, .3),
    impact: t => impact(t, .75), buzz: t => buzz(t, .16, .12), tick: t => tick(t, .2), thud: t => thud(t, .6), blip: t => blip(t, .1) };
  (M.sfx || []).forEach(s => { if (s[0] === 'riser') riser(s[1], s[2], .28); else if (s[0] === 'beep') beep(s[1], s[2] || 81, .16, .22); else FX[s[0]](s[1]); });
} else if (V === '1') {
  // R1 v2 : nerveux (la mineur → do majeur au final), 132 BPM. Crochet 0–1,05 / rembobinage 1,05–1,55 / course 1,55–11 / final.
  const BEAT = 60 / 132, GO = 1.55, END = 11.0;
  const prog = [[57, 60, 64, 69, 45], [53, 57, 60, 65, 41], [55, 59, 62, 67, 43], [52, 55, 59, 64, 40]];
  const fin = [[60, 64, 67, 72, 48], [57, 60, 64, 69, 45], [53, 57, 60, 65, 41], [55, 59, 62, 67, 43]];
  // crochet : ça démarre fort dès la 1re image
  impact(0, .7); for (let b = 0; b * BEAT < 1.0; b++) { const t = b * BEAT; kick(t, .8); hat(t + BEAT / 2, .16); bass(t + BEAT / 2, 45, BEAT * .45, .4); if (b % 2 === 1) clap(t, .4); }
  chord(0, [57, 60, 64, 69], 1.0, .14, .2);
  pop(.22, .2, 900); pop(.36, .22, 1100);
  rewind(1.05, .5, .4);
  // course
  impact(GO, .85); beep(GO, 93, .18, .22);
  for (let b = 0; GO + b * BEAT < END - .05; b++) {
    const t = GO + b * BEAT, c = prog[Math.floor(b / 4) % 4], hot = t > 9.5;
    kick(t, .75); if (b % 2 === 1) clap(t, .42);
    hat(t + BEAT / 2, .17); hat(t + BEAT / 4, .07); hat(t + 3 * BEAT / 4, .07);
    bass(t + BEAT / 2, c[4], BEAT * .42, .44); bass(t + 3 * BEAT / 4, c[4] + 12, BEAT * .2, .2);
    if (b % 2 === 0) chord(t, c.slice(0, 4), BEAT * 1.6, .13, hot ? .25 : .15);
    tick(t, hot ? .2 : .13); tick(t + BEAT / 2, hot ? .14 : .08);
  }
  riser(9.4, END - .05, .3);
  [1.75, 2.85, 3.95, 4.85, 5.85, 6.85, 8.1, 9.3].forEach(t => { thud(t, .55); whoosh(t - .12, .18, .2); });
  [1.85, 1.97, 2.09, 2.21, 2.9, 2.95, 3.02, 3.1, 4.0, 5.12, 5.95, 6.4, 7.2, 7.38, 7.56, 7.74, 8.3, 8.45, 8.6, 8.75, 8.95, 9.5].forEach((t, i) => pop(t, .17, 600 + (i % 7) * 120));
  impact(4.95, .6); tap(6.35, .4);
  [6.85, 8.1, 9.3].forEach(t => whoosh(t, .4, .22)); whoosh(10.45, .5, .3);
  // terminé
  impact(END, 1.0); ding(END + .03, .24);
  for (let b = 0; END + .3 + b * BEAT < DUR; b++) {
    const t = END + .3 + b * BEAT, c = fin[Math.floor(b / 4) % 4];
    if (b % 2 === 0) kick(t, .6); if (b % 4 === 2) clap(t, .3);
    hat(t + BEAT / 2, .1); if (b % 2 === 0) bass(t, c[4], BEAT * .9, .35);
    if (b % 4 === 0) chord(t, c.slice(0, 4), BEAT * 3.6, .14, .1);
    pluck(t + BEAT / 2, c[(b % 3) + 1] + 12, .06, b % 2 ? .3 : -.3);
  }
  // fin raccourcie (13.10.2026), calée sur la voix
  pop(11.64, .18, 900); pop(11.95, .2, 1100); pop(12.25, .18, 800);
  for (let i = 0; i < 10; i++) tick(11.85 + i * .04, .14);
  pop(13.0, .18, 900); pop(13.9, .2, 1100); pop(14.4, .18, 800);
  for (let i = 0; i < 5; i++) pop(13.3 + i * .1, .14, 700 + i * 120);
  pop(14.3, .22, 1200); tap(14.9); ding(14.95, .12);
} else if (V === '2') {
  // R2 v2 : calme (ré mineur, 96 BPM) jusqu'à « Après » (7,56 s), puis groove clair pendant la réservation
  const BEAT = 60 / 96, DROP = 7.56;
  const pre = [[50, 53, 57, 62], [46, 50, 53, 58], [48, 52, 55, 60], [45, 49, 52, 57]];
  const post = [[53, 57, 60, 65, 41], [48, 52, 55, 60, 48], [50, 53, 57, 62, 38], [46, 50, 53, 58, 46]];
  for (let b = 0; b * BEAT < DROP - .2; b++) {
    const t = b * BEAT;
    if (b % 2 === 0) chord(t, pre[Math.floor(b / 2) % 4], BEAT * 2, .14, .04);
    hat(t + BEAT / 2, .07); if (b % 2 === 0) kick(t, .35);
  }
  tap(.4, .4); buzz(.45, .1, .09); buzz(.6, .1, .09); pop(.52, .14, 500);
  [2.4, 3.85, 4.94].forEach(t => { thud(t, .75); buzz(t, .12, .08); });
  whoosh(6.0, .2, .3); pop(6.1, .16); pop(6.4, .2, 1100);
  pop(6.83, .18, 600); riser(DROP - 1.2, DROP - .05, .3); impact(DROP, .75); whoosh(DROP - .05, .55, .35); ding(DROP + .05, .18);
  for (let b = 0; DROP + b * BEAT < DUR; b++) {
    const t = DROP + b * BEAT, c = post[Math.floor(b / 2) % 4];
    kick(t, .75); if (b % 2 === 1) clap(t, .36);
    hat(t + BEAT / 2, .16); bass(t + BEAT / 2, c[4], BEAT * .45, .42);
    chord(t, c.slice(0, 4), BEAT * .9, .16, .18);
    pluck(t + BEAT / 4, c[3] + 12, .06, .3); pluck(t + 3 * BEAT / 4, c[2] + 12, .06, -.3);
  }
  pop(8.3, .14, 800); pop(8.5, .16, 1000);
  [8.75, 9.55, 10.45, 10.95, 11.45].forEach((t, i) => { tap(t, .45); pop(t + .02, .14, 900 + i * 110); });
  whoosh(8.88, .35, .28); whoosh(9.95, .3, .22);
  impact(11.6, .55); ding(11.62, .24);
  pop(11.7, .16, 900); pop(11.95, .18, 1100);
  pop(12.6, .2, 1200); tap(13.9, .3);
} else {
  // R3 : énergique (mi mineur, 128 BPM), un coup sec à chaque raison
  const BEAT = 60 / 128;
  const prog = [[52, 55, 59, 64, 40], [48, 52, 55, 60, 36], [50, 55, 59, 62, 38], [47, 50, 54, 59, 35]];
  for (let b = 0; b * BEAT < DUR; b++) {
    const t = b * BEAT, c = prog[Math.floor(b / 4) % 4], loud = t > 3.2;
    kick(t, loud ? .85 : .5);
    if (b % 2 === 1) clap(t, loud ? .45 : .25);
    hat(t + BEAT / 2, .18, b % 4 === 3); hat(t + BEAT / 4, .07); hat(t + 3 * BEAT / 4, .07);
    bass(t + BEAT / 2, c[4], BEAT * .45, loud ? .48 : .3);
    if (b % 2 === 0) chord(t + BEAT / 2, c.slice(0, 4), BEAT * .8, loud ? .16 : .1, .18);
  }
  pop(0, .14, 700); pop(.45, .14, 800); pop(.95, .14, 900); pop(1.25, .14, 1000); pop(1.6, .22, 1200);
  riser(1.9, 3.25, .25);
  [3.31, 4.85, 7.39].forEach(t => { impact(t, .7); whoosh(t - .15, .2, .3); });
  for (let i = 0; i < 6; i++) blip(3.6 + i * .2, .08);
  [5.6, 6.4].forEach(t => buzz(t, .15, .1));
  whoosh(7.5, .4, .25); whoosh(8.9, .4, .25); pop(8.2, .22, 500);
  impact(9.5, .8); pop(9.56, .2, 1100); pop(10.3, .16); pop(11.0, .22, 1200); tap(11.8); ding(11.85, .14);
}

// --- Sortie : fondu et normalisation ---
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR, g = t > DUR - .4 ? (DUR - t) / .4 : 1;
  L[i] = Math.tanh(L[i] * 1.1) * g; R[i] = Math.tanh(R[i] * 1.1) * g;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
const k = .89 / peak;
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * k)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * k)) * 32767), 46 + i * 4);
}
fs.writeFileSync(path.join(__dirname, 'out', `music_r${V}.wav`), buf);
console.log(`music_r${V}.wav ok, peak`, peak.toFixed(2));
