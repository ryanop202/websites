// Réglages des Reels de la série 2 (vraies maquettes, serie2.html).
// id = numéro utilisé par render.js / music.js / mix.js · dur = durée (s) · name = fichier dans l'atelier ·
// pub = où le fichier fini est copié dans ../pubs-organiques/ (jour + heure de publication).
module.exports = {
  7:  { code: 'R-007', dur: 16.2, name: 'R-007_cafe-detail',            pub: '2026-10-14_mercredi/20h30_reel_cafe-detail.mp4' },
  8:  { code: 'I-001', dur: 11.0, name: 'I-001_envoie-ca-institut',     pub: '2026-10-15_jeudi/18h00_reel_envoie-ca-institut.mp4',
        music: { bpm: 100, pre: 'min', post: 'maj', drop: 6.7, sfx: [['pop', .2], ['pop', .9], ['buzz', 2.9], ['thud', 3.2], ['tap', 5.3], ['whoosh', 5.45],
          ['riser', 5.6, 6.68], ['impact', 6.7], ['ding', 7.6], ['pop', 8.6], ['whoosh', 8.9], ['ding', 9.6]] } },
  9:  { code: 'R-006', dur: 15.4, name: 'R-006_speedrun2-barbier',      pub: '2026-10-14_mercredi/20h30_reel_speedrun2-barbier.mp4',
        music: { bpm: 132, pre: 'min', post: 'min', drop: 2.4, sfx: [['pop', .1], ['pop', .94], ['riser', 1.3, 2.38], ['impact', 2.4], ['beep', 2.4, 93],
          ['thud', 2.9], ['thud', 3.9], ['thud', 4.9], ['thud', 5.9], ['thud', 6.9], ['tap', 7.3], ['thud', 8.0], ['thud', 9.0], ['riser', 8.6, 9.98],
          ['impact', 10.0], ['ding', 10.03], ['tick', 11.1], ['tick', 11.15], ['tick', 11.2], ['tick', 11.25], ['tick', 11.3], ['pop', 12.66], ['pop', 12.76], ['pop', 12.86], ['pop', 12.96], ['ding', 13.1]] } },
  // Format « capture d'écran native » (natif.html, 13.10.2026) : remplace Reel3 et Reel1 du mardi 13.10. Voix Noah (ElevenLabs).
  11: { code: 'R-001b', dur: 13.2, name: 'R-001b_speedrun-boulangerie-natif', file: 'natif.html', pub: '2026-10-13_mardi/20h30_reel_speedrun-boulangerie.mp4',
        music: { bpm: 124, pre: 'min', post: 'maj', drop: 2.37, sfx: [['tick', .25], ['tick', .5], ['whoosh', 1.95], ['impact', 2.37], ['pop', 3.0],
          ['whoosh', 3.82], ['thud', 4.25], ['pop', 4.9], ['tap', 5.55], ['whoosh', 6.15], ['pop', 6.4], ['pop', 6.6], ['whoosh', 7.5], ['ding', 8.35], ['pop', 9.2], ['pop', 10.55]] } },
  13: { code: 'R-003b', dur: 18.3, name: 'R-003b_3-raisons-natif', file: 'natif.html', pub: '2026-10-13_mardi/18h00_reel_3-raisons.mp4',
        music: { bpm: 92, pre: 'min', post: 'maj', drop: 12.4, pluck: false, sfx: [['tick', .1], ['tick', .25], ['tick', .4], ['tap', 1.1], ['whoosh', 1.25],
          ['whoosh', 4.85], ['tap', 5.72], ['whoosh', 5.85], ['whoosh', 8.45], ['tap', 9.05], ['whoosh', 9.17], ['whoosh', 12.4], ['tap', 13.35], ['whoosh', 13.45],
          ['tap', 14.0], ['tap', 14.35], ['tap', 14.65], ['ding', 14.78]] } },
  // « Devine le commerce » (13.10.2026) : remplace le speedrun de 20:30. Voix Noah audio/voix_r15.mp3, morceaux espacés pour laisser deviner.
  15: { code: 'R-008', dur: 19.0, name: 'R-008_devine-le-commerce', file: 'natif.html', pub: '2026-10-13_mardi/20h30_reel_devine-le-commerce.mp4',
        seg: [[0, 2.45, 0], [2.5, 3.4, 2.6], [3.45, 4.45, 5.15], [4.5, 5.4, 6.6], [5.42, 6.45, 9.15], [6.5, 8.2, 10.6], [8.22, 9.8, 13.85], [9.85, 12.32, 15.9]],
        music: { bpm: 100, pre: 'min', post: 'maj', drop: 15.85, pluck: false, sfx: [['tick', 3.6], ['tick', 4.1], ['tick', 4.6], ['whoosh', 5.05], ['ding', 5.15],
          ['whoosh', 6.5], ['tick', 7.6], ['tick', 8.1], ['tick', 8.6], ['whoosh', 9.05], ['ding', 9.15],
          ['whoosh', 10.5], ['tick', 12.3], ['tick', 12.8], ['tick', 13.3], ['whoosh', 13.75], ['ding', 13.85], ['pop', 15.9]] } },
  // « Conversation coiffeur » (13.10.2026, format chat) : remplace « Devine le commerce » à 20:30 (Ryan veut tester des formats très différents).
  17: { code: 'R-009', dur: 26.2, name: 'R-009_conversation-coiffeur', file: 'natif.html', pub: '2026-10-13_mardi/20h30_reel_conversation-coiffeur.mp4',
        music: { bpm: 84, pre: 'min', post: 'maj', drop: 13.81, pluck: false, sfx: [['pop', 0.06], ['pop', 0.28], ['pop', 0.51], ['whoosh', 1.68], ['ding', 3.0], ['whoosh', 3.9], ['whoosh', 4.15], ['pop', 4.71], ['pop', 7.22], ['pop', 9.5], ['pop', 10.27], ['buzz', 11.55], ['whoosh', 13.74], ['tap', 15.36], ['whoosh', 15.5], ['tap', 15.89], ['tap', 16.46], ['tap', 16.74], ['tap', 17.08], ['ding', 17.27], ['pop', 19.46], ['pop', 19.67], ['pop', 19.88], ['pop', 20.09], ['pop', 20.3], ['pop', 20.5], ['whoosh', 21.6], ['ding', 22.84]] } },
  // « Ton idée → ton site » (13.10.2026) : idée de Ryan, vise les gens qui veulent lancer un projet. Pour mercredi 14.10 20:30 (remplace le speedrun barbier).
  19: { code: 'R-010', dur: 20.0, name: 'R-010_ton-idee-ton-site', file: 'natif.html', pub: '2026-10-14_mercredi/18h00_reel_ton-idee-ton-site.mp4',
        music: { bpm: 108, pre: 'min', post: 'maj', drop: 2.27, sfx: [['tap', 2.15], ['whoosh', 2.3], ['ding', 4.0], ['ding', 4.4], ['ding', 4.8], ['whoosh', 6.7], ['ding', 7.05],
          ['whoosh', 7.75], ['ding', 8.1], ['whoosh', 9.0], ['pop', 9.2], ['pop', 9.45], ['pop', 9.7], ['pop', 10.2], ['pop', 10.45], ['pop', 10.7], ['pop', 11.2], ['pop', 11.45], ['pop', 11.7],
          ['whoosh', 15.4], ['tick', 15.6], ['tick', 15.75], ['tick', 15.9], ['ding', 16.4]] } },
  // Script B « Tape ton nom sur Google » (messaging-architect, 13.10.2026). Pour mercredi 14.10 20:30 (remplace le Reel café, ancien style).
  21: { code: 'R-011', dur: 17.4, name: 'R-011_tape-ton-nom-sur-google', file: 'natif.html', pub: '2026-10-14_mercredi/20h30_reel_tape-ton-nom-sur-google.mp4',
        music: { bpm: 96, pre: 'min', post: 'maj', drop: 9.81, pluck: false, sfx: [['tick', .2], ['tick', .4], ['tick', .6], ['tick', .8], ['buzz', 3.22], ['buzz', 4.06], ['buzz', 4.99],
          ['whoosh', 8.2], ['tap', 9.0], ['whoosh', 9.81], ['tap', 10.55], ['tap', 11.0], ['tap', 11.45], ['tap', 11.75], ['ding', 12.0], ['whoosh', 12.7], ['pop', 12.9], ['pop', 15.6]] } },
  // Pub « La maquette est gratuite. Toujours gratuite. » (13.10.2026, idée de Ryan d'après une pub d'opticien), voix de femme Clémence. Jeudi 15.10 12:00 (PUB 3/4).
  23: { code: 'P-003', dur: 18.9, name: 'P-003_toujours-gratuite', file: 'natif.html', pub: '2026-10-15_jeudi/12h00_pub_toujours-gratuite.mp4',
        music: { bpm: 96, pre: 'maj', post: 'maj', drop: 8.06, pluck: false, sfx: [['tick', .1], ['tick', .25], ['tick', .4], ['buzz', 3.1], ['buzz', 3.9], ['buzz', 4.6],
          ['whoosh', 5.8], ['tap', 7.2], ['whoosh', 8.06], ['whoosh', 10.45], ['ding', 10.6], ['impact', 11.75], ['tap', 13.6], ['tap', 14.45], ['whoosh', 15.85], ['ding', 16.0]] } },
  // « Ce coiffeur a des clients toute la journée » (13.10.2026, concept refait par Ryan) : remplace la conversation coiffeur ce soir 20:30.
  25: { code: 'R-012', dur: 13.0, name: 'R-012_coiffeur-clients-toute-la-journee', file: 'natif.html', pub: '2026-10-13_mardi/20h30_reel_coiffeur-clients-toute-la-journee.mp4',
        music: { bpm: 110, pre: 'maj', post: 'maj', drop: 4.62, sfx: [['pop', .4], ['pop', .9], ['pop', 1.4], ['pop', 1.9], ['pop', 2.4], ['pop', 2.9], ['pop', 3.4],
          ['buzz', 2.3], ['ding', 3.8], ['whoosh', 4.6], ['tap', 5.9], ['whoosh', 6.05], ['tap', 6.35], ['tap', 6.75], ['tap', 7.0], ['tap', 7.2], ['ding', 7.4], ['whoosh', 7.95], ['ding', 8.9]] } },
  // « Où sont passés tes clients ? » (13.10.2026) : style explainer laptop d'après la vidéo de référence de Ryan, voix de femme Sara. Créneau à choisir.
  27: { code: 'R-013', dur: 36.5, name: 'R-013_ou-sont-passes-tes-clients', file: 'explainer.html',
        music: { bpm: 92, pre: 'min', post: 'maj', drop: 24.3, pluck: false, sfx: [['pop', .1], ['whoosh', 4.0], ['pop', 5.4], ['whoosh', 7.1], ['impact', 8.6], ['whoosh', 12.8],
          ['buzz', 13.2], ['impact', 14.8], ['whoosh', 16.0], ['impact', 18.53], ['whoosh', 19.55], ['tick', 21.1], ['tick', 22.35], ['whoosh', 24.3], ['tap', 26.63],
          ['pop', 28.1], ['pop', 28.3], ['pop', 28.5], ['ding', 28.9], ['whoosh', 29.35], ['ding', 30.0]] } },
};
