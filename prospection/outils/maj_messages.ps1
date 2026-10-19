# Réécrit le message (col. I) et le lien WhatsApp (col. J) de prospects_sans_site.xlsx
# pour tous les commerces pas encore contactés (Statut vide ou « SMS à faire »).
# Message validé par Ryan le 19.10.2026 : offre 3 premiers clients (création offerte, 50 CHF/mois, maquette déjà prête).
# Pas d'avis Google dans le message : Google interdit les avis obtenus en échange d'un service gratuit.
# (Ancien message du 15.10.2026 avec note Google + métier + village : 16 réponses / 63.)
# Lancer : powershell -ExecutionPolicy Bypass -File prospection\outils\maj_messages.ps1   (Excel doit être fermé)

$dir  = Split-Path $MyInvocation.MyCommand.Path
$xlsx = Join-Path $dir "..\prospects_sans_site.xlsx" | Resolve-Path

$met = @{}
foreach ($l in Get-Content (Join-Path $dir "metiers.txt") -Encoding UTF8) {
  if ($l.Trim() -and -not $l.StartsWith("#")) { $p = $l -split "\s*¦\s*"; $met[$p[0].Trim()] = @($p[1].Trim(), $p[2].Trim()) }
}

$keys = @(
 @('resto', @('pizz','kebab','restaurant','traiteur','sandwich','dessert','boucherie','charcuterie')),
 @('rdv',   @('coiff','barbier','beauté','massa','masso','massage','manucure','tatouage','ostéo','podolog','physio','toiletteur','drainage','soin des pieds','auto-école','coach','danse','musique','bien-être','garage','réparation automobile','mécanique automobile','carrosserie','pension pour chiens','équestre',"maison d'hôtes")),
 @('devis', @('paysagiste','charpentier','peintre','cvc','carreleur','assainissement','entrepreneur','serrurier','menuisier','couvreur','nettoyage','scierie','stores','rideaux','couturier','informatique','ordinateur','fiscal',"location d'outils")))
$benefit = @{ rdv = 'voir vos prestations ou réserver'; devis = 'voir vos réalisations ou demander un devis'; resto = 'voir votre carte ou vos horaires'; shop = 'voir vos produits ou vos horaires' }
function Kind($m) { $m = $m.ToLower(); foreach ($k in $keys) { foreach ($w in $k[1]) { if ($m.Contains($w)) { return $k[0] } } }; 'shop' }

function ShortName($name, $village) {
  $s = $name -replace '\s*\(.*\)\s*$', ''
  $s = ($s -split '\s+[:\-–]\s+')[0].Trim()
  if ($s.EndsWith(" $village", 'OrdinalIgnoreCase') -and $s.Length -gt $village.Length + 4) { $s = $s.Substring(0, $s.Length - $village.Length - 1).Trim() }
  $s
}
# « que Institut » -> « qu'Institut », « de Aline » -> « d'Aline »
function Elide($mot, $nom) { if ($nom -match '^[AEIOUYÉÈÊÂÎaeiouyéèêâî]') { $mot.Substring(0, $mot.Length - 1) + "'" + $nom } else { "$mot $nom" } }

$x = New-Object -ComObject Excel.Application; $x.DisplayAlerts = $false
$wb = $x.Workbooks.Open([string]$xlsx); $ws = $wb.Worksheets.Item(1)
$n = $ws.UsedRange.Rows.Count; $changed = 0; $kept = 0; $missing = @()
for ($r = 2; $r -le $n; $r++) {
  $statut = $ws.Cells.Item($r, 11).Text
  if ($statut -and $statut -notlike '*SMS à faire*') { $kept++; continue }
  $metier = $ws.Cells.Item($r, 2).Text; $village = $ws.Cells.Item($r, 3).Text
  if (-not $met.ContainsKey($metier)) { $missing += "$r ($metier)"; continue }
  $nom = ShortName $ws.Cells.Item($r, 1).Text $village
  $msg = "Bonjour, ici Ryan de Wibzo, créateur web dans la Broye.`n`nJ'ai vu $(Elide 'que' $nom) à $village n'a pas encore de site.`n`nPour mes 3 premiers clients, j'offre la création du site. Ensuite, c'est seulement 50 CHF/mois tout compris (hébergement, nom de domaine, modifications).`n`nJe vous ai déjà préparé une maquette, gratuitement et sans engagement. Je vous l'envoie ?"
  $ph = ($ws.Cells.Item($r, 7).Text -replace '\s', '')
  $ws.Cells.Item($r, 9).Value2 = $msg
  $c = $ws.Cells.Item($r, 10); $null = $c.Hyperlinks.Delete()
  $null = $ws.Hyperlinks.Add($c, "https://wa.me/41$($ph.Substring(1))?text=$([uri]::EscapeDataString($msg))", "", "", "Ouvrir WhatsApp")
  $changed++
}
$wb.Save(); $wb.Close(); $x.Quit()
"modifiés=$changed  pas touchés (déjà contactés)=$kept"
if ($missing) { "MÉTIER INCONNU (ajouter dans metiers.txt) : " + ($missing -join ', ') }
