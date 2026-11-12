# Documents client — quand quelqu'un dit oui (préparés le 12.11.2026)

Ordre d'envoi :
1. **Le client choisit sa formule** → envoyer `1-INFOS-A-DEMANDER.md` (FR ou DE), en réponse à son mail.
2. **En même temps** : envoyer le contrat `2-CONTRAT.md` en PDF, rempli avec sa formule. Il répond « bon pour accord » ou renvoie le PDF signé.
3. **Configurateur adapté** → lien de test au client → il valide → mise en ligne.
4. **À la mise en ligne** → facture `3-facture.html` (payable à 30 jours).

## À compléter une seule fois par Ryan (ne pas inventer)
- Ton nom complet et ton adresse (en-tête du contrat et de la facture)
- Le nom du parent qui signe
- Ton IBAN, pour le bulletin QR
(Conditions du contrat validées par Ryan le 12.11.2026 : 15 mois minimum, facturation par trimestre 180 CHF (177 CHF pour Varioplant et Lejan), hébergement compris pour la formule achat.)

## La facture QR (bulletin créé automatiquement, 12.11.2026)
La BCF ne propose pas de créer des factures QR dans l'e-banking. `3-facture.html` crée donc le bulletin QR elle-même, avec la bibliothèque gratuite swissqrbill 4.4.4 (licence MIT), copiée dans `vendor/` : elle fonctionne sans internet.
- Ouvrir `3-facture.html` (double-clic) → remplir les cases en haut. **Taper ton IBAN toi-même la première fois** : il reste mémorisé dans ce navigateur. Il n'est **jamais** écrit dans les fichiers du projet, qui sont envoyés sur GitHub.
- Remplir le client, le montant et le n° de facture → cliquer sur les lignes pour les modifier → bouton Français/Deutsch.
- Ctrl + P → « Enregistrer au format PDF », marges : **aucune**, pour que le bulletin QR soit à la bonne taille en bas de la page.
- Tester une fois avant la première vraie facture : scanner le QR avec l'app BCF (sans payer) pour vérifier que l'IBAN et le montant sont justes.
Numéros de facture : 2026-001, 2026-002… (un numéro par facture, ne jamais le réutiliser).
Formule achat : remplacer les 2 lignes par « Configurateur 3D — formule achat … 1 900.00 ».

## Rappels
- Ce n'est **pas un avis juridique**. Faire relire le contrat par tes parents avant le premier envoi.
- TVA : pas assujetti tant que le chiffre d'affaires reste sous 100 000 CHF par an.
- AVS : pas concerné avant le 1er janvier 2027 (noté le 29.10.2026). À vérifier dès 2027.
