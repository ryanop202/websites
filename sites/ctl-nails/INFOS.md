# CTL Nails Onglerie — Payerne (maquette Wibzo)

Demande : réponse au message WhatsApp du 15.10.2026 (+41 79 133 64 31) : « Bonjour, oui je veux bien la voir si c'est possible. Et si j'accepte le prix serait de combien ? »
Maquette créée le 15.10.2026.

## Infos vérifiées (source + date)
- **Fiche Google Maps** « CTL Nails Onglerie » (lue le 15.10.2026) :
  - Salon de manucure, Rue de Lausanne 8, 1530 Payerne · 079 133 64 31
  - Horaires : lundi–vendredi 09:00–19:00 · samedi et dimanche fermé
  - 7 avis, tous à 5 étoiles (note 5,0). Les 4 avis cités sur la maquette sont recopiés de Google (texte raccourci pour « lil deh » et « Cynthia C. »).
  - Lien vers Instagram, pas de site.
- **Instagram @ctlnailss** (lu le 15.10.2026) : « NAIL ARTIST Payerne », « Beauté, cosmétique et soins », « Rendez-vous en dm », Rue de Lausanne 8, Payerne. 165 publications, 411 abonnés.
  - Logo : rond rose avec « Ctl » en écriture et « STYLISTE ONGULAIRE ». La maquette refait ce monogramme en texte (le logo d'origine fait 150 px, trop petit).
  - Story à la une « Prix » (publiée il y a environ 58 semaines) : tarifs recopiés sur la maquette.
  - Story « Prix » suivante : paiement cash ou par carte.

## À vérifier avec elle
- ⚠️ **Tarifs** : la story date d'il y a environ 1 an et l'image est petite. Les prix sont lisibles mais à reconfirmer. Surtout la ligne du haut « −10.– avec carte étudiante ».
- ✅ Prénom « Carolina » confirmé (nom WhatsApp « CTLnails Carolina », 15.10.2026).
- Le nom complet derrière « CTL » : inconnu.
- La rubrique « Pieds » de la story est coupée en bas par la barre de réponse d'Instagram : il peut y avoir une ligne de plus.
- WhatsApp : la maquette envoie les demandes sur son 079 133 64 31 (elle a WhatsApp sur ce numéro, notre message y est arrivé). Lui demander si c'est OK.
- Pas d'e-mail trouvé. Pas de site trouvé (recherches web du 15.10.2026).

## Photos
`img/` : 10 photos de ses réalisations, prises sur son Instagram (ses propres photos, captures 860×860).
Avant une vraie mise en ligne, lui demander son accord et si possible les fichiers originaux.

## Direction artistique
- Secteur : onglerie, une indépendante, nail art très travaillé (fleurs 3D, perles, étoiles de mer, dégradés).
- Idée : **un écrin à bijoux**, différent de Quinn Beauty (BD pop-art). Rose poudré, framboise profond, filets dorés.
- Palette : ivoire #FFF8F4 · rose poudré #F5E3E1 · framboise #8C1D4D · rose #E0628F · or #B48F57 · encre #2B1620.
- Typos : Bodoni Moda (titres) · Pinyon Script (monogramme) · Jost (texte).
- Signature : **les photos en forme d'ongles** (accueil : 3 ongles comme une main, galerie « Le nuancier » à faire glisser), petites perles dorées.

## Le problème réglé
Aujourd'hui, les clientes doivent écrire en DM et attendre pour avoir un prix et un rendez-vous.
Sur la maquette : **« Composez votre rendez-vous »** → la cliente choisit la prestation (ou « Je ne sais pas encore : on en discute ensemble »), les options (French, nail art, carte étudiante), puis une vraie date (les 10 prochains jours ouvrables) et une heure (09:00 à 18:00, dans l'horaire du salon ; demande de Ryan, 15.10.2026). Le total s'affiche, puis le bouton ouvre WhatsApp avec le message déjà écrit.
Mobile : barre fixe Appeler + WhatsApp en bas de l'écran.

## Captures pour WhatsApp
`captures/` : 6 captures mobile (accueil, réalisations, tarifs, rendez-vous, avis, infos) + 1 capture ordinateur.
La carte Google ne s'affiche pas sur la capture « infos » (limite de l'outil de capture). Dans un vrai navigateur, elle s'affiche.

## En ligne
https://ctl-nails-wibzo.pages.dev — Cloudflare Pages (compte de Ryan), projet `ctl-nails-wibzo`, mis en ligne le 15.10.2026 par Claude avec wrangler (Ryan a fait `npx wrangler login`).
Demande de Ryan : pas son nom dans l'adresse. Par défaut, wrangler crée maintenant un Worker en .ryanoppliger2021.workers.dev : il faut créer le projet avec `npx wrangler pages project create <nom> --production-branch main --force` (une seule fois), puis plus de --force.
Mettre à jour : un dossier avec `public/` (index.html, style.css, img/) et `functions/` à côté, puis `npx wrangler pages deploy public --project-name ctl-nails-wibzo --branch main` (depuis ce dossier). Voir « Agenda Google » plus bas.
`ctl-nails-en-ligne.zip` reste disponible pour un téléversement à la main.

## Agenda Google relié au site (préparé le 15.10.2026)
Demande de Carolina (15.10, 19:08) : elle aime confirmer sur WhatsApp, mais veut que les jours et les heures suivent ses disponibilités.
- **Comment ça marche** : `functions/api/busy.js` (une « fonction » Cloudflare Pages) lit son Google Agenda par son **adresse secrète iCal** et renvoie seulement les heures prises (jamais les titres). Le site barre ces heures et affiche « complet » les jours pleins. La demande part toujours sur WhatsApp, et c'est elle qui confirme.
- **En attendant** : sans adresse, le site utilise un **agenda de démonstration** (rendez-vous fictifs). C'est indiqué sous les heures.
- **Durées des prestations** : ⚠️ ce sont des ESTIMATIONS (objet `DUREE` dans `index.html`). Il faut les remplacer par les vraies durées de Carolina. French +15 min, nail art +30 min, « à discuter » = 60 min. Créneaux toutes les 30 min, de 09:00 à 19:00.
- Limites : seules les répétitions quotidiennes et hebdomadaires sont lues (une répétition mensuelle ne bloque que la 1re date). Google peut mettre un peu de temps à mettre à jour l'adresse iCal (à vérifier).

### Pour relier son agenda
1. Carolina, **sur un ordinateur** (pas dans l'app du téléphone) : calendar.google.com → roue ⚙️ → Paramètres → à gauche, sous « Paramètres de mes agendas », cliquer sur son agenda → « Intégrer l'agenda » → copier « **Adresse secrète au format iCal** ».
2. Elle l'envoie à Ryan, Ryan la donne à Claude (ne la mettre nulle part ailleurs : avec ce lien, on peut lire tout son agenda. Elle peut le réinitialiser à tout moment au même endroit).
3. Claude (depuis un dossier qui contient `functions/` et `public/`) :
   `npx wrangler pages secret put ICAL_URL --project-name ctl-nails-wibzo` (coller le lien), puis redéployer :
   `npx wrangler pages deploy public --project-name ctl-nails-wibzo --branch main`
4. Vérifier : https://ctl-nails-wibzo.pages.dev/api/busy doit renvoyer des heures (et plus `"demo":true`).

`ctl-nails-en-ligne.zip` = version sans agenda (un téléversement à la main ne prend pas la fonction).
