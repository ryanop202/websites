# Prospection — commerces sans site (Broye)

Créé le 12.10.2026.

## Fichier

`prospects_sans_site.xlsx` — onglet « À contacter » : 206 commerces de la Broye (zone 1) qui remplissent tous les critères :

- pas de site sur la fiche Google Maps (pages de réservation Salonkee, Salonized, SimplyBook, www-barber.com, Facebook, Instagram = pas un site)
- pas de site trouvé ailleurs (recherche Bing « nom + village »)
- numéro mobile 07X (source : fiche Google Maps)
- pas de chaîne, pas d'administration, pas de doublon

Colonnes Statut / Date d'envoi / Date de relance à remplir au fur et à mesure.

Limites :

- « Fermé définitivement » non vérifiable à coup sûr : regarder la fiche Google avant d'envoyer.
- Astérisque annuaire (= refuse la pub, LCD) non vérifié, à la demande.

Régénérer l'Excel depuis la liste brute : `py outils/build_xlsx.py outils/prospects_broye.txt prospects_sans_site.xlsx`

## Meta Ads — où on en est

⚠️ À trancher : CLAUDE.md dit « pas de publicité payante pour le moment » et ~100 CHF max par test. 12 CHF/jour ≈ 360 CHF/mois. Options : un test de 7-8 jours (~100 CHF), ou mettre à jour CLAUDE.md.

Décisions :

- **Budget** : automatique (Advantage+ campaign budget), ~12 CHF/jour, 1 campagne, 1 ensemble de pubs, ciblage large (30 km autour de Payerne, 25-60 ans, pas d'intérêts).
- **Objectif** : Messages → WhatsApp. On mesure le coût par conversation, puis le nombre de clients.
- **Andromeda** : c'est la pub qui cible → pubs vraiment différentes (concepts), pas des variantes. Ne rien toucher pendant 7 jours. Remplacer les pubs perdantes par un nouveau concept.
- **Secteur** : uniquement la beauté au début (coiffeurs, barbiers, esthéticiennes, ongleries) = environ la moitié du fichier. 2e secteur (auto ou bâtiment) seulement si le coût par conversation est bon.
- **4 pubs, sans visage** : 2 vidéos verticales de 15 s + 2 images (carrousel de 3 maquettes beauté + visuel texte simple).
- **En parallèle** : envoyer les WhatsApp aux commerces beauté du fichier.
- Ne jamais montrer un vrai salon reconnaissable sans son accord (noms inventés ou floutés).

Angle principal : « Tu n'as pas moins de talent que ta concurrente, elle est juste mieux présentée quand la cliente compare. »

### Hooks (texte à l'écran, 3 premières secondes)

Comparaison :
1. Pourquoi ta concurrente a l'agenda plein… et pas toi ?
2. Une nouvelle cliente hésite entre ton salon et celui d'à côté. Voilà ce qu'elle voit.
3. Même talent. Même quartier. Une seule a un site. Devine qui elle réserve.

Problème :
4. Tu as 50 avis 5★… et des nouvelles clientes qui ne viennent pas ?
5. Les clientes te cherchent sur Google à 22 h. Elles tombent sur quoi ?
6. Si une cliente ne peut pas réserver en 30 secondes, elle va chez une autre.

Curiosité :
7. J'ai cherché « onglerie Payerne » sur Google. Regarde ce qui s'affiche.
8. Ce que voient tes futures clientes avant de choisir un salon (et tu ne le sais pas).

Transformation :
9. Ta fiche Google aujourd'hui → ton site demain.
10. De « simple fiche Google » à « salon qu'on réserve en 2 clics ».

Objection :
11. Pas le temps de t'occuper d'un site ? Tu n'as rien à faire. Je te montre.
12. « Un site, c'est cher et compliqué. » Regarde celui-là, fait en 24 h.

Fin de vidéo (offre) : « Je te prépare la maquette de ton site gratuitement, prête aujourd'hui. Si elle ne te plaît pas, on en reste là. »

Plan des 2 vidéos :
- Vidéo 1 (comparaison) : hook 3 → défilement des deux fiches / site de la concurrente → ta maquette → offre.
- Vidéo 2 (curiosité) : hook 7 → recherche Google → « elle n'apparaît pas comme un vrai salon » → ta maquette → offre.
- Ensuite tester les hooks 1, 4, 5 sur la même vidéo en changeant seulement les 3 premières secondes.

### Prochaine étape

Scripts vidéo faits : voir `scripts-videos.md`. Reste : créer les maquettes beauté fictives, monter les 2 vidéos, faire les 2 images.
