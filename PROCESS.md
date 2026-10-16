# PROCESS — Méthode de prospection et de création

## MÉTHODE DE PROSPECTION

1. Trouver des commerces locaux qui :

   * n'ont pas de site
   * ont un site ancien
   * ont une mauvaise présence en ligne
   * n'ont pas de réservation alors que cela serait utile

2. Créer éventuellement une maquette/démo personnalisée.

3. Présenter la maquette au commerce :

   * en personne en priorité
   * sinon message individuel

4. Si le prospect est intéressé :

   * récupérer les informations
   * récupérer les photos
   * confirmer les prestations
   * confirmer les horaires
   * définir les fonctionnalités
   * définir le prix
   * acheter le domaine si nécessaire
   * mettre le site en ligne
   * connecter la réservation

5. Suivre chaque prospect dans PROSPECTS.md.

Ne pas envoyer de messages de masse.

Une maquette de démonstration ne doit jamais être présentée comme le site officiel du commerce.

## SUIVI / RELANCE DES PROSPECTS

Une fois le message et la démo envoyés (J0), suivre ce rythme :

1. **J0** : message + lien de démo envoyés. Noter la date dans PROSPECTS.md.
2. **J+3 à J+4 (jours ouvrables)** : si pas de réponse, une relance courte et polie (rappel bref + lien démo). Ne pas renvoyer le même message tel quel.
3. **J+7 à J+10** : si toujours pas de réponse, dernière relance — idéalement par un autre canal (ex. passage en personne ou appel si le message écrit n'a rien donné, surtout pour les commerces qu'on peut visiter facilement : coiffeurs, barbiers, garages).
4. **Après 2 relances sans réponse** : arrêter. Marquer le prospect "sans réponse" dans PROSPECTS.md et passer au suivant. Ne pas insister davantage.

Maximum 2 relances par prospect. Ne jamais transformer une relance en message de masse — rester individuel et personnalisé à chaque fois.

## CRÉATION D'UN NOUVEAU SITE

1. créer son dossier dans `sites/<nom-du-client>/`
2. rechercher/collecter les informations disponibles
3. ne conserver que les informations vérifiées (sinon « À compléter »)
4. définir la direction artistique (voir CLAUDE.md, section DESIGN)
5. créer le site
6. vérifier le responsive
7. préparer la mise en ligne

## MESSAGE DE PROSPECTION (version du 15.10.2026)

Choisi par Ryan le 15.10.2026 (version « perso » proposée le 14.10 après la recherche Instagram). Message court, un fait réel en premier (la note Google), le métier et le village du commerce, une question fermée facile à la fin. Jamais « je crée des sites » (conseil Timéo Klein).

Déjà écrit dans `prospection/prospects_sans_site.xlsx` (colonne Message + lien WhatsApp) pour tous les commerces pas encore contactés, par `prospection/outils/maj_messages.ps1` (métiers → `prospection/outils/metiers.txt`). Les commerces déjà contactés gardent leur ancien texte. Sauvegarde : `prospection/prospects_sans_site.backup-2026-10-15.xlsx`.

**Premier message (WhatsApp / SMS, vouvoiement)**

> Bonjour, ici Ryan de Wibzo, dans la Broye.
>
> J'ai vu que [nom] a [nb] avis à [note]/5 sur Google, vos clients sont visiblement contents. Mais quand un nouveau client cherche [un coiffeur / un garage…] à [village], il ne trouve pas de site pour [bénéfice selon le métier], et il va ailleurs.
>
> Je vous ai préparé la maquette de votre site, gratuitement. Si elle ne vous plaît pas, on en reste là.
>
> Je vous l'envoie ?

* Peu d'avis (moins de 5, ou note sous 4,5) : « J'ai vu la fiche Google de [nom] à [village]. » à la place de la phrase sur les avis.
* Coiffure, beauté, onglerie, vêtements : « une nouvelle cliente… elle » au lieu de « un nouveau client… il ».
* Déjà une page de réservation (Salonkee, Salonized, SimplyBook, OneDoc…) : « Vous avez déjà une page de réservation, c'est très bien. Mais quand un nouveau client cherche [métier] à [village], un vrai site à votre nom lui donne beaucoup plus confiance. » (Ne pas dire qu'ils ne peuvent pas réserver : c'est faux.)
* Bénéfice : rendez-vous → « voir vos prestations ou réserver » ; artisans → « voir vos réalisations ou demander un devis » ; restos → « voir votre carte ou vos horaires » ; magasins → « voir vos produits ou vos horaires ».
* « dans la Broye » et pas « à Payerne » : on ne met pas une adresse non vérifiée.

⚠️ « Je vous ai préparé la maquette » : la maquette n'existe pas encore au moment de l'envoi. Dès qu'un commerce répond oui, la faire tout de suite et l'envoyer dans les heures qui suivent (captures d'écran si Netlify est bloqué). D'où le maximum de 20 envois par jour.

**Relance (J+3 à J+4, si pas de réponse)**

> Bonjour, je reviens vers vous pour la maquette de [nom du commerce]. Je vous l'envoie ? Sinon, pas de souci, dites-le-moi et je ne vous relance plus.

**Réponse « pas intéressé »** : remercier une fois si on veut (« Merci pour votre réponse, bonne journée ! »), puis ne plus jamais relancer. Mettre le statut dans l'Excel prospects, dans `prospection/outils/statuts.txt`, et ajouter une ligne dans `wibzo/suivi-wibzo.xlsx` (onglet Contacts, statut « Pas intéressé », raison dans Notes).

Règles :

* remplacer [nom du commerce] à chaque envoi, ajouter un détail réel si possible
* ne pas donner de prix dans le premier message. Pas de prix fixe (décision du 15.10.2026) : si on demande, le prix dépend du projet et se fixe avec le client après la maquette
* 20 à 30 messages par jour maximum
