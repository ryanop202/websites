# Prompt — nouvelles entreprises FOSC (Vaud + Fribourg)

Écrit le 20.10.2026. Remplace la version « Broye » : zone = tout VD et FR, numéro fixe OU mobile accepté.
À coller tel quel dans Claude Code.

```
Trouve les nouvelles entreprises des cantons de Vaud et Fribourg publiées dans la FOSC (sogc.ch) pour que je puisse les prospecter avec Wibzo.

SOURCE : API publique gratuite de la FOSC (amtsblattportal.ch).
- Liste : https://amtsblattportal.ch/api/v1/publications?publicationStates=PUBLISHED&tenant=shab&subRubrics=HR01&publicationDate.start=AAAA-MM-JJ&pageRequest.size=200&pageRequest.page=0
  (HR01 = nouvelles inscriptions. Le filtre canton ne marche pas : trier soi-même.)
- Détail d'une fiche : https://amtsblattportal.ch/api/v1/publications/{id}/xml
  (nom, adresse, NPA, but de l'entreprise)

PÉRIODE : les 3 derniers mois.

ZONE : tout le canton de Vaud et tout le canton de Fribourg. Vérifier avec le NPA de l'adresse de l'entreprise (pas seulement le canton du registre).

CIBLE : seulement les artisans et entreprises qui ont les moyens de payer un site :
paysagiste, toiture/charpente, menuiserie, construction/maçonnerie, façades, carrelage, peinture, électricien, sanitaire/chauffage, cuisiniste, garage, froid/climatisation, et métiers du même genre.
EXCLURE : coiffeurs, barbiers, beauté, ongleries, petits nettoyages, holdings, immobilier, trading, conseil, succursales de grosses entreprises.

POUR CHAQUE ENTREPRISE GARDÉE :
1. Vérifier avec Chrome sur Google si elle a déjà un site (recherche « nom + commune » + fiche Google Maps).
2. Faire 2 autres vérifications pour être sûr (ex. local.ch, search.ch, recherche du nom seul). Facebook, Instagram ou un annuaire = pas un site.
3. Si elle a un site → on la retire.
4. Chercher son numéro de téléphone (fixe OU mobile) sur la fiche Google, local.ch ou search.ch. Aucun numéro trouvé → on la retire.
5. Écrire un message court et personnalisé, selon la méthode de PROCESS.md (version du 15.10.2026), avec le métier, la commune et un bénéfice adapté aux artisans (« voir vos réalisations ou demander un devis »). Ils viennent de se lancer : le dire simplement (« J'ai vu que [nom] vient de s'inscrire au registre du commerce… »).

RÉSULTAT : un fichier Excel prospection/nouvelles-entreprises-vaud-fribourg.xlsx avec seulement 4 colonnes :
Nom | Numéro | Message | Réponse
(Réponse = vide, je la remplis moi-même.)

Mettre aussi le script dans prospection/outils/ pour que je puisse relancer la recherche chaque semaine.

RÈGLES : ne rien inventer (CLAUDE.md). Ne contacter personne : seulement préparer la liste. À la fin, me dire combien d'entreprises ont été trouvées, combien retirées (site trouvé / pas de numéro) et combien restent.
```

Note : ~1 700 nouvelles inscriptions VD/FR en 3 mois → environ 400–450 artisans à vérifier dans Chrome (estimation d'après la Broye). Prévoir de le faire par lots.
