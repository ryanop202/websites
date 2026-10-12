// Musique originale + bruitages des reels organiques (synthèse, aucun sample externe).
// node music.js <1|2|3> → out/music_rN.wav. Instruments repris de ../pubs-v2/music.js.
const fs = require('fs');
const path = require('path');
const V = process.argv[2] || '1';
const DUR = { 1: 14, 2: 10.8, 3: 12.6 }[V];
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

if (V === '1') {
  // R1 : groove léger et « satisfaisant », la majeur, 118 BPM ; drop quand le site est fini (8,6 s)
  const BEAT = 60 / 118, DROP = 8.6;
  const prog = [[57, 61, 64, 69, 45], [54, 57, 61, 66, 42], [50, 54, 57, 62, 38], [52, 56, 59, 64, 40]];
  const arp = [69, 73, 76, 81, 76, 73];
  for (let b = 0; b * BEAT < DUR; b++) {
    const t = b * BEAT, c = prog[Math.floor(b / 4) % 4], after = t >= DROP;
    if (t > DROP - .3 && t < DROP) continue;
    kick(t, after ? .9 : .55);
    if (b % 2 === 1) clap(t, after ? .45 : .25);
    hat(t + BEAT / 2, after ? .2 : .13);
    bass(t + BEAT / 2, c[4], BEAT * .45, after ? .48 : .32);
    if (b % 2 === 0) chord(t, c.slice(0, 4), BEAT * 1.8, after ? .2 : .12, after ? .22 : .08);
    for (let s = 0; s < 2; s++) pluck(t + s * BEAT / 2, arp[(b * 2 + s) % 6], .08, s ? .3 : -.3);
  }
  riser(DROP - 1.4, DROP - .3, .28); impact(DROP, .9);
  [.15, 1.5, 2.2, 2.5, 3.3, 4.0, 4.7, 4.9, 5.1, 5.3, 5.5, 6.3, 6.5, 6.65, 6.8, 6.95, 7.6, 7.8, 8.0].forEach((t, i) => pop(t, .2, 600 + (i % 6) * 110));
  [1.5, 5.8, 7.2, 8.6].forEach(t => whoosh(t - .1, .25, .25));
  ding(8.65, .2);
  pop(9.9, .2, 900); pop(10.15, .2, 1100); pop(10.3, .2, 800);
  for (let i = 0; i < 10; i++) tick(10.8 + i * .1, .14);
  thud(11.85, .6); pop(12.4, .22, 1200); tap(13.2); ding(13.25, .14);
} else if (V === '2') {
  // R2 : calme et doux (ré mineur, 96 BPM) puis éclaircie sur « Après » (7,5 s)
  const BEAT = 60 / 96, DROP = 7.5;
  const pre = [[50, 53, 57, 62], [46, 50, 53, 58], [48, 52, 55, 60], [45, 49, 52, 57]];
  const post = [[53, 57, 60, 65, 41], [48, 52, 55, 60, 48], [50, 53, 57, 62, 38], [46, 50, 53, 58, 46]];
  for (let b = 0; b * BEAT < DROP - .2; b++) {
    const t = b * BEAT;
    if (b % 2 === 0) chord(t, pre[Math.floor(b / 2) % 4], BEAT * 2, .14, .04);
    hat(t + BEAT / 2, .07);
    if (b % 2 === 0) kick(t, .35);
  }
  riser(DROP - 1.2, DROP - .05, .3); impact(DROP, .75);
  for (let b = 0; DROP + b * BEAT < DUR; b++) {
    const t = DROP + b * BEAT, c = post[Math.floor(b / 2) % 4];
    kick(t, .8); if (b % 2 === 1) clap(t, .4);
    hat(t + BEAT / 2, .18); bass(t + BEAT / 2, c[4], BEAT * .45, .45);
    chord(t, c.slice(0, 4), BEAT * .9, .18, .2);
    pluck(t + BEAT / 4, c[3] + 12, .07, .3); pluck(t + 3 * BEAT / 4, c[2] + 12, .07, -.3);
  }
  pop(0, .14, 700); thud(.9, .5);
  [2.4, 3.85, 4.94].forEach(t => { thud(t, .75); buzz(t, .12, .08); });
  whoosh(6.0, .2, .3); pop(6.13, .16); pop(6.45, .2, 1100);
  pop(6.83, .18, 600); whoosh(7.45, .6, .35); ding(7.55, .2);
  pop(8.7, .2, 1200); tap(9.6); ding(9.65, .14);
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
