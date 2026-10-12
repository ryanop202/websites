// Musique originale + bruitages de la pub (synthèse, aucun sample externe).
// 128 BPM, la mineur, drop sur « Wibzo » (7,48 s). Sortie : out/music.wav
const fs = require('fs');
const path = require('path');

const SR = 44100, DUR = 14.9, N = Math.round(SR * DUR);
const L = new Float32Array(N), R = new Float32Array(N);
// Recalage sur la voix : out/warp_vN.json = [[temps design, temps réel], ...]
const V = process.argv[2] || '1';
let KN = [[0, 0], [14.9, 14.9]];
try { KN = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', `warp_v${V}.json`), 'utf8')); } catch (e) {}
const W = x => { for (let i = 0; i < KN.length - 1; i++) { const [d0, r0] = KN[i], [d1, r1] = KN[i + 1]; if (x <= d1 || i === KN.length - 2) return r0 + (x - d0) * (r1 - r0) / (d1 - d0); } return x; };
const BEAT = 60 / 128, DROP = W(7.48);
const GAP0 = DROP - .26; // silence juste avant le drop
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

// --- Partie 1 (0 → 7,22 s) : tension, filtrée ---
const am = [57, 60, 64, 69], arp = [69, 72, 76, 72, 69, 76, 72, 79];
for (let b = 0; b * BEAT < GAP0; b++) {
  const t = b * BEAT;
  kick(t, .45);
  hat(t + BEAT / 2, .12);
  bass(t + BEAT / 2, 45, BEAT * .45, .32);
  for (let s = 0; s < 2; s++) { const tt = t + s * BEAT / 2; if (tt < GAP0) pluck(tt, arp[(b * 2 + s) % 8], t > DROP - 2 ? .07 : .1, s ? .3 : -.3); }
}
chord(0, am, DROP * .33, .1, .05);
chord(DROP * .33, [53, 57, 60, 65], DROP * .33, .09, .05);
chord(DROP * .66, [52, 55, 59, 64], DROP * .34 - .26, .08, .03);
riser(DROP - 1.58, GAP0, .32);

// --- Drop (7,48 → fin) ---
const prog = [[57, 60, 64, 69, 45], [53, 57, 60, 65, 41], [48, 52, 55, 60, 48], [55, 59, 62, 67, 43]];
for (let b = 0; DROP + b * BEAT < DUR; b++) {
  const t = DROP + b * BEAT, c = prog[Math.floor(b / 4) % 4];
  kick(t, .95);
  if (b % 2 === 1) clap(t, .5);
  hat(t + BEAT / 2, .22, b % 4 === 3);
  hat(t + BEAT / 4, .08); hat(t + 3 * BEAT / 4, .08);
  bass(t + BEAT / 2, c[4], BEAT * .48, .5);
  chord(t + BEAT / 2, c.slice(0, 4), BEAT * .42, .2, .22);
}

// --- Bruitages calés sur l'image (node music.js 1|2), en temps « design » recalés par W ---
impact(DROP, 1.0);
const wrapT = f => (t0, ...a) => f(W(t0), ...a);
pop = wrapT(pop); whoosh = wrapT(whoosh); thud = wrapT(thud); tap = wrapT(tap); ding = wrapT(ding); tick = wrapT(tick); blip = wrapT(blip);
if (V === '1') {
  pop(0, .14, 700); pop(.25, .14, 800); pop(.55, .22, 500); thud(.55, .4); pop(.95, .14); pop(1.2, .16, 900);
  whoosh(2.6, .25, .3); pop(2.75, .14); pop(3.0, .14);
  [3.25, 3.7, 4.15, 4.6, 5.0].forEach((t, i) => { whoosh(t - .08, .14, .18); pop(t, .18, 700 + i * 120); });
  whoosh(5.35, .22, .3); pop(5.45, .14); ding(5.85, .16); pop(6.35, .14); pop(6.6, .14);
  thud(6.9, .8);
} else {
  pop(0, .14, 700); pop(.35, .16, 800); pop(.8, .22, 500); thud(.8, .45);
  [1.3, 1.8, 2.3].forEach(t => { blip(t); ding(t + .05, .12); });
  whoosh(2.7, .25, .3); pop(2.85, .14); pop(3.25, .14); pop(3.6, .18, 1100);
  tap(4.1); pop(4.1, .16, 1200); tap(4.75); ding(4.8, .2);
  whoosh(5.2, .22, .3); pop(5.35, .14); pop(5.65, .14); thud(6.1, .5);
  whoosh(6.7, .35, .4);
}
pop(7.75, .22, 1100);
pop(8.45, .14, 800);
for (let i = 0; i < 20; i++) tick(9.0 + i * .04, .1);
thud(9.85, .9); ding(9.9, .18);
whoosh(11.75, .22, .28);
pop(11.95, .16, 900); pop(12.05, .14); pop(12.35, .14); pop(12.6, .22, 1200);
pop(13.2, .2, 700); pop(13.45, .16, 900); tap(13.95); ding(14.0, .16);

// --- Sortie : fondu et normalisation ---
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const g = t > DUR - .35 ? (DUR - t) / .35 : 1;
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
fs.writeFileSync(path.join(__dirname, 'out', `music_v${V}.wav`), buf);
console.log('music.wav ok, peak', peak.toFixed(2));
