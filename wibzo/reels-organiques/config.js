// Réglages des Reels de la série 2 (vraies maquettes, serie2.html).
// id = numéro utilisé par render.js / music.js / mix.js · dur = durée (s) · name = fichier dans l'atelier ·
// pub = où le fichier fini est copié dans ../pubs-organiques/ (jour + heure de publication).
module.exports = {
  7:  { code: 'R-007', dur: 16.2, name: 'R-007_cafe-detail',            pub: '2026-10-14_mercredi/18h00_reel_cafe-detail.mp4' },
  8:  { code: 'I-001', dur: 11.0, name: 'I-001_envoie-ca-institut',     pub: '2026-10-15_jeudi/18h00_reel_envoie-ca-institut.mp4',
        music: { bpm: 100, pre: 'min', post: 'maj', drop: 6.7, sfx: [['pop', .2], ['pop', .9], ['buzz', 2.9], ['thud', 3.2], ['tap', 5.3], ['whoosh', 5.45],
          ['riser', 5.6, 6.68], ['impact', 6.7], ['ding', 7.6], ['pop', 8.6], ['whoosh', 8.9], ['ding', 9.6]] } },
  9:  { code: 'R-006', dur: 15.4, name: 'R-006_speedrun2-barbier',      pub: '2026-10-14_mercredi/20h30_reel_speedrun2-barbier.mp4',
        music: { bpm: 132, pre: 'min', post: 'min', drop: 2.4, sfx: [['pop', .1], ['pop', .94], ['riser', 1.3, 2.38], ['impact', 2.4], ['beep', 2.4, 93],
          ['thud', 2.9], ['thud', 3.9], ['thud', 4.9], ['thud', 5.9], ['thud', 6.9], ['tap', 7.3], ['thud', 8.0], ['thud', 9.0], ['riser', 8.6, 9.98],
          ['impact', 10.0], ['ding', 10.03], ['tick', 11.1], ['tick', 11.15], ['tick', 11.2], ['tick', 11.25], ['tick', 11.3], ['pop', 12.66], ['pop', 12.76], ['pop', 12.86], ['pop', 12.96], ['ding', 13.1]] } },
};
