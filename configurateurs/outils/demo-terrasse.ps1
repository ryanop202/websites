# Prépare la démo d'un vendeur de vérandas / pergolas (03.11.2026) : copie de carport-demo/ + config à son nom,
# seulement ses produits, son logo. Mise en ligne ensuite : `npx wrangler deploy` dans clients/<Id>.
# Exemple :
#   .\outils\demo-terrasse.ps1 -Id cei-habitat -Nom "CEI Habitat SA" -Activite "Vérandas & pergolas · Meyrin" `
#     -Initiales CEI -Logo "https://.../logo.png" -Produits "pergola-bio,veranda"
param(
  [Parameter(Mandatory)] [string] $Id,
  [Parameter(Mandatory)] [string] $Nom,
  [Parameter(Mandatory)] [string] $Activite,
  [Parameter(Mandatory)] [string] $Initiales,
  [string] $Logo = '',
  [Parameter(Mandatory)] [string] $Produits,  # parmi : pergola-bio, veranda, pergola, carport (ordre d'affichage)
  [switch] $Remplacer                          # refaire une démo déjà préparée
)
$ErrorActionPreference = 'Stop'
$racine = Split-Path $PSScriptRoot -Parent
$src = Join-Path $racine 'carport-demo'
$dst = Join-Path $racine "clients\$Id"
if (-not $Remplacer -and (Test-Path (Join-Path $dst 'config.js'))) { throw "clients\$Id existe déjà (ajouter -Remplacer)" }

robocopy $src $dst /E /XD .wrangler /XF config.js wrangler.jsonc MESSAGE.md *.pdf /NFL /NDL /NJH /NJS /NP | Out-Null

# Logo repris de leur site (sinon : initiales)
$logoCfg = "''"
if ($Logo) {
  New-Item -ItemType Directory -Force (Join-Path $dst 'marque') | Out-Null
  $ext = [IO.Path]::GetExtension(([uri]$Logo).AbsolutePath); if (-not $ext) { $ext = '.png' }
  Invoke-WebRequest -UseBasicParsing $Logo -OutFile (Join-Path $dst "marque\logo$ext")
  $logoCfg = "'marque/logo$ext'"
}

$infos = @{
  'pergola-bio' = @{ var = 'pergolaBio'; fichier = 'pergola-bio'; label = 'Pergola bioclimatique'; aide = 'Lames alu orientables pour régler soleil et ventilation, stores en option.'; icone = '<path d="M3 20h18M5 20V8M19 20V8M3 8h18M6 5.5l2 1M10 5.5l2 1M14 5.5l2 1"/>' }
  'veranda'     = @{ var = 'veranda'; fichier = 'veranda'; label = 'Véranda'; aide = 'Une pièce vitrée en aluminium, accolée à la façade.'; icone = '<path d="M3 20h18M4 20V8l16-3v15M4 8h16M9 20V8M14 20V7"/>' }
  'pergola'     = @{ var = 'pergola'; fichier = 'pergola'; label = 'Pergola en bois'; aide = 'Une structure contre la maison, sur votre terrasse, avec brise-vue en option.'; icone = '<path d="M3 20h18M6 20V9M18 20V9M3 9h18M5 6h14M8 6v3M12 6v3M16 6v3"/>' }
  'carport'     = @{ var = 'carport'; fichier = 'carport'; label = 'Carport'; aide = 'Un abri ouvert pour une ou deux voitures, avec local de rangement en option.'; icone = '<path d="M3 20h18M5 20V10M19 20V10M2 11l10-6 10 6"/>' }
}
$liste = @($Produits.Split(',') | ForEach-Object { $_.Trim() })
$imports = ($liste | ForEach-Object { "import { CONFIG as $($infos[$_].var) } from './produits/$($infos[$_].fichier).js';" }) -join "`n"
$cartes = ($liste | ForEach-Object { $p = $infos[$_]; "  '$_': { label: '$($p.label)', aide: '$($p.aide)', icone: '$($p.icone)', config: perso($($p.var)) }," }) -join "`n"
$nomJs = $Nom.Replace("'", "\'")
$actJs = $Activite.Replace("'", "\'")

@"
// Démo préparée pour $Nom, $(Get-Date -Format dd.MM.yyyy) (outils/demo-terrasse.ps1).
// Seulement leurs produits, vérifiés sur leur site. ⚠️ Tous les PRIX sont FICTIFS.
$imports

const ENTREPRISE = {
  nom: '$nomJs',
  activite: '$actJs',
  initiales: '$Initiales',
  logo: $logoCfg,
  email: '', // e-mail qui reçoit les demandes (vide = démo)
};
const perso = (c) => ({ ...c, entreprise: ENTREPRISE });

export const PRODUITS = {
$cartes
};

const choix = new URLSearchParams(location.search).get('produit');
export const PRODUIT = PRODUITS[choix] ? choix : '$($liste[0])';
export const CONFIG = { ...PRODUITS[PRODUIT].config, assistant: true, couleurs: { plan: '#3D3A35', 'plan-clair': '#EFEBE3' } };
"@ | Set-Content -Encoding utf8 (Join-Path $dst 'config.js')

@"
{
  // Démo $Nom : https://$Id.wibzo.ch — mise à jour : ``npx wrangler deploy`` dans ce dossier
  "name": "$Id-3d-configurateur",
  "compatibility_date": "2026-10-23",
  "workers_dev": false,
  "routes": [{ "pattern": "$Id.wibzo.ch", "custom_domain": true }],
  "assets": { "directory": "." }
}
"@ | Set-Content -Encoding utf8 (Join-Path $dst 'wrangler.jsonc')

"Démo prête : clients\$Id ($($liste -join ', '))"
