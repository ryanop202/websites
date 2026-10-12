# Livrer une maquette en moins de 24 h — méthode Wibzo

Préparé le 12.10.2026. But : qu'une demande WhatsApp « MAQUETTE » devienne une maquette envoyée en 1–2 h de travail,
sans oublier une étape et sans rien inventer (règle absolue de CLAUDE.md).

## Limite de charge
- **Max 3 maquettes par jour** (LANCEMENT.md). Au-delà : mettre les pubs en pause dans le Gestionnaire de publicités.
- Toujours répondre dans l'heure avec `/maquette` (voir `whatsapp-business.md`), même si la maquette arrive plus tard.

## Étape 1 — Réception (5 min, sur le téléphone)
1. Répondre avec la réponse rapide `/maquette`.
2. Étiquette WhatsApp : 🔵 Maquette en cours.
3. Ajouter une ligne dans `suivi-wibzo.xlsx` → onglet Contacts (date, source, commerce, ville, téléphone, statut « Maquette en cours »).
4. S'il manque le nom exact ou la ville : les demander tout de suite.

## Étape 2 — Lancer Claude (sur le PC) — prompt à coller tel quel
```
Nouvelle demande de maquette Wibzo.
Commerce : <NOM EXACT>
Ville : <VILLE>
Métier : <MÉTIER>
Infos reçues du client : <ce qu'il a envoyé : horaires, photos, logo… ou « rien »>
Lis CLAUDE.md et wibzo/LIVRER-UNE-MAQUETTE.md, puis fais la maquette dans sites/<nom-du-commerce>/ :
recherche les infos vérifiées, direction artistique propre, site one-page mobile d'abord, « À compléter » pour tout ce qui n'est pas vérifié.
```

## Étape 3 — Ce que Claude doit faire (checklist)
**Recherche (sources dans l'ordre de fiabilité)**
- [ ] Fiche Google / search.ch / local.ch : adresse, téléphone, horaires, catégorie
- [ ] Registre du commerce (zefix.ch / moneyhouse) : le commerce existe-t-il encore ? (cf. `sites/aux-delices-de-lina/INFOS.md` : société radiée)
- [ ] Réseaux sociaux du commerce : photos, style, prestations
- [ ] Vérifier qu'il n'a PAS déjà un site officiel
- [ ] Écrire `sites/<nom>/INFOS.md` : chaque info + sa source, le reste « À compléter »

**Interdit** (CLAUDE.md) : inventer horaires, prix, avis, notes Google, prestations, adresse, téléphone ; présenter des photos de banque d'images comme celles du commerce.

**Design**
- [ ] Direction artistique propre au commerce (skill ckw-design) : palette, typo, élément signature — différente des maquettes précédentes
- [ ] One-page mobile d'abord : nom + accroche, bouton **Appeler**, bouton **WhatsApp**, prestations, horaires, adresse + carte, (réservation / devis / carte si utile au métier — marqué « démo »)
- [ ] Bandeau discret « Maquette de démonstration — préparée par Wibzo »
- [ ] Vérifier sur téléphone (375 px) et ordinateur, aucun débordement

## Étape 4 — Mise en ligne de la démo (le lien à envoyer)
⚠️ **Point bloquant actuel** : Netlify n'a plus de crédits (« production deploys paused »).
Options, à choisir par Ryan :
1. **Cloudflare Pages** (gratuit) — Ryan crée le compte, Claude prépare le reste.
2. **Prochain cycle Netlify** — attendre le renouvellement des crédits.
3. En dépannage : envoyer **3–4 captures d'écran** de la maquette sur WhatsApp (moins impressionnant qu'un lien, mais ça marche tout de suite).

## Étape 5 — Envoi et suivi
1. Envoyer avec `/envoi` (+ lien ou captures). Étiquette 🟣 Maquette envoyée. Dans le tableau : date « Maquette envoyée le ».
2. **J+3** sans réponse → `/relance` (le tableau colore la date en orange). Étiquette 🟠.
3. **J+7** → dernière relance, si possible par un autre moyen (appel / passage). Puis arrêter (PROCESS.md : max 2 relances).
4. Oui → `/infos` puis `/merci`, prix exact fixé AVANT la mise en ligne, étiquette 🟢, colonne « Vendu » = Oui.

## Temps visé
| Étape | Temps |
|---|---|
| Réception | 5 min |
| Recherche + INFOS.md | 15–20 min |
| Maquette | 45–60 min |
| Vérification + mise en ligne démo | 15 min |
| **Total** | **≈ 1 h 30** |
