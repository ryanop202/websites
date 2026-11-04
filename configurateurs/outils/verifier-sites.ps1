# Vérifie rapidement des sites de prospects (03.11.2026) : e-mails affichés, produits cités, configurateur, logo.
# Exemple : .\outils\verifier-sites.ps1 conceptalu.com lamatec.ch
param([Parameter(Mandatory, ValueFromRemainingArguments)] [string[]] $Sites)
foreach ($s in $Sites) {
  try {
    $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 20 "https://$s" -UserAgent 'Mozilla/5.0'
    $h = $r.Content
    $t = ($h -replace '<script[\s\S]*?</script>', ' ' -replace '<[^>]+>', ' ' -replace '\s+', ' ')
    $mails = ([regex]::Matches($h, '[\w.+-]+@[\w-]+\.[a-z]{2,}') | ForEach-Object Value | Where-Object { $_ -notmatch '\.(png|jpg|webp|svg)$|sentry|wixpress|example' } | Sort-Object -Unique) -join ', '
    $prod = @('véranda', 'veranda', 'pergola', 'bioclimatique', 'carport', 'store', 'jardin d.hiver', 'abri') | Where-Object { $t -match $_ }
    $config = ([regex]::Matches($t, '.{0,40}(configurateur|configurez|simulateur|3D).{0,40}', 'IgnoreCase') | Select-Object -First 3 | ForEach-Object Value) -join ' || '
    $logo = ([regex]::Matches($h, '<img[^>]+(logo)[^>]*>', 'IgnoreCase') | Select-Object -First 1 | ForEach-Object { if ($_.Value -match 'src="([^"]+)"') { $Matches[1] } })
    "== $s`n  e-mails : $mails`n  produits : $($prod -join ', ')`n  config : $config`n  logo : $logo"
  } catch { "== $s : ERREUR $($_.Exception.Message)" }
}
