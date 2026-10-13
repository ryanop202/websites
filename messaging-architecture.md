# Messaging Architecture — Wibzo — 2026-10-13

Sources : CLAUDE.md, LANCEMENT.md, founder-context.md, wibzo/whatsapp-business.md, site wibzo.ch (v3).
Pas de positioning.md / customer-profile.md / problem-validation-report.md encore : ce document est une **hypothèse de message** à tester, pas une vérité validée par des clients (0 client au 13.10.2026).

## 0. À qui on parle (une seule cible)
**Le/la patron·ne d'un commerce sur rendez-vous de Suisse romande (Broye d'abord) qui n'a pas de site** : coiffeur, barbier, institut, physio, garage.
Il/elle gère les rendez-vous par téléphone ou messages, souvent en travaillant. Sa présence en ligne = une fiche Google vide et/ou un Instagram.
**Moment douloureux :** un client veut réserver pendant que le patron travaille, ou le soir — personne ne répond, le client va chez celui qui a un site / une réservation en ligne.
Cible secondaire (à tester séparément, ne pas mélanger dans le même message) : les gens qui lancent une activité (« ton idée → ton site »).

## 1. Le récit en un paragraphe
Tes clients te cherchent quand toi tu travailles ou tu dors. Sans site, ils trouvent une fiche vide, pas de prix, pas de bouton pour réserver — et ils vont ailleurs, sans que tu le saches. Un site simple, à ton nom, leur permet de voir tes prestations et de réserver tout seuls, à n'importe quelle heure. Et pour que tu n'aies aucun risque : je te montre d'abord la maquette de TON site, gratuitement, en 24 h. Elle te plaît, on la met en ligne. Sinon, tu ne paies rien.

## 2. Hiérarchie du message
| Niveau | Message | Lien avec une vraie douleur / preuve |
|---|---|---|
| **Problème** | « Tes clients réservent ailleurs pendant que tu travailles. » | Moment vécu : téléphone qui sonne pendant une coupe, messages du soir sans réponse. |
| **Promesse** | « Un site simple où on voit tes prestations et où on réserve tout seul. » | Capacité réelle du produit (réservation en ligne, prix, horaires). Pas de promesse de résultat. |
| **Preuve** | « Tu vois ta maquette avant de payer 1 franc — en 24 h. » | Seule preuve honnête aujourd'hui : l'offre elle-même (maquette gratuite). Pas de témoignage tant qu'il n'y a pas de client. |
| **Différence** | « Une personne d'ici qui te répond, pas une agence : tu vois avant, tu paies après. » | Local, risque zéro, simple. |

Phrase-mère (à répéter partout) : **« Tes clients réservent même quand tu bosses. Vois ton site avant de payer. »**

## 3. Objections et meilleure réponse
| Objection | Réponse |
|---|---|
| « C'est trop cher. » | La maquette est gratuite : tu vois exactement ce que tu achètes avant de payer. Le prix est fixé avec toi avant la mise en ligne. |
| « J'ai déjà Instagram / Google. » | Sur Instagram on ne réserve pas à 22 h, et Google n'affiche ni tes prix ni un bouton pour réserver. Le site complète, il ne remplace pas. |
| « Mes clients m'appellent, ça marche. » | Ceux qui appellent, oui. Ceux qui tombent sur ta messagerie ou n'osent pas appeler, tu ne les vois jamais. |
| « Pas le temps. » | Tu m'envoies le nom de ton commerce et ta ville. Je fais tout le reste. |
| « Je n'y connais rien, je ne saurai pas le gérer. » | Tu n'as rien à gérer : les petites modifications sont comprises dans l'abonnement. |
| « C'est un jeune / je ne connais pas, arnaque ? » | Tu ne paies rien avant d'avoir vu ton site. Si ça ne te plaît pas, on en reste là. |

## 4. Adaptation par canal
- **Page d'accueil wibzo.ch** : titre = problème + promesse (« Vos clients réservent même quand vous travaillez »), sous-titre = preuve (« Maquette gratuite de votre site en 24 h »), bouton = « Recevoir ma maquette ». Vouvoiement.
- **Prospection directe (WhatsApp / SMS / en personne)** : 1 phrase douleur personnalisée (« J'ai vu que [commerce] n'a pas de site pour réserver »), 1 phrase preuve (« Je vous ai préparé une maquette, gratuite »), 1 question fermée facile (« Je vous l'envoie ? »). Vouvoiement. Possibilité de dire non.
- **Reels organiques** : tutoiement au patron (« ton salon », « tes clients »), toujours : douleur vécue → montrer la réservation qui se fait toute seule → « vois ton site avant de payer ». Format propre validé (fond sombre, texte en haut, écran entier).
- **Pub Meta** : vouvoiement, phrase-mère + « Écrivez MAQUETTE sur WhatsApp 076 757 43 93 ».
- **SEO/GEO** : plus tard (« site web coiffeur Payerne », « site web commerce Broye »), quand il y aura des sites clients à montrer.

## 5. Mots et promesses à ne plus utiliser
- Jargon : typo, palette, UX, responsive, SEO, template, landing page.
- Promesses de résultat : « clients garantis », « plus de clients assurés », « tu vas remplir ton agenda » (dire plutôt « on peut réserver tout seul »).
- « IA », « généré automatiquement » (casse la confiance).
- Chiffres ou statistiques inventés (« 80 % des clients… ») — interdit (CLAUDE.md).
- Mélanger tutoiement et vouvoiement dans un même support.

## 6. Le test de message à lancer ensuite
**Deux accroches, mêmes conditions, sur la prospection directe (20 messages chacune) :**
- A — douleur : « Vos clients peuvent-ils réserver chez vous quand vous travaillez ? »
- B — preuve : « Je vous ai préparé la maquette de votre site, gratuite, vous voulez la voir ? »
Mesure : taux de réponse + nb de « oui, envoyez-la ». La gagnante devient le hook des Reels et de la pub.
Les Reels v2 (scripts dans `wibzo/reels-organiques/SCRIPTS-MESSAGE.md`) testent les mêmes deux angles côté Instagram.
