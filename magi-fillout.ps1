# Generate all remaining verb + noun images and report totals.
# Requires GEMINI_API_KEY in the environment (never commit API keys to git).
$ErrorActionPreference = 'Continue'
if (-not $env:GEMINI_API_KEY) {
  Write-Error @"
GEMINI_API_KEY is not set. Export your key before running, e.g. in PowerShell:

  `$env:GEMINI_API_KEY = '<your-key-from-google-ai-studio>'

Or store it in a local .env file (gitignored) and load it in your shell session.
"@
  exit 1
}
$repo = 'C:\inetpub\repos\animationdictionary.xyz'
$magi = "$env:USERPROFILE\.claude\skills\magi\scripts\magi.ps1"
Set-Location $repo
$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
$log = "C:\migration\magi-fillout-$ts.log"
Start-Transcript -Path $log | Out-Null

function Report-Dir($label, $dir) {
  Write-Host ""
  Write-Host "=== $label : $dir ==="
  if (Test-Path $dir) {
    $files = Get-ChildItem $dir -File
    Write-Host "   $($files.Count) PNG files, total $([math]::Round(($files | Measure-Object Length -Sum).Sum / 1MB, 1)) MB"
  }
}

Write-Host "##### batch 1 : verbs (~70 prompts) #####"
& $magi -Shotlist "$repo\magi-shotlist-verbs-batch3.json" `
        -OutDir   "$repo\public\img\verbs" `
        -StyleFile "$repo\magi.style.txt"
Report-Dir 'verbs' "$repo\public\img\verbs"

Write-Host ""
Write-Host "##### batch 2 : noun characters (~21 prompts) #####"
& $magi -Shotlist "$repo\magi-shotlist-nouns-characters.json" `
        -OutDir   "$repo\public\img\nouns" `
        -StyleFile "$repo\magi.style.noun.txt"

Write-Host ""
Write-Host "##### batch 3 : noun objects (~48 prompts) #####"
& $magi -Shotlist "$repo\magi-shotlist-nouns-objects.json" `
        -OutDir   "$repo\public\img\nouns" `
        -StyleFile "$repo\magi.style.noun-object.txt"
Report-Dir 'nouns' "$repo\public\img\nouns"

Write-Host ""
Write-Host "##### done #####"
Stop-Transcript | Out-Null
Write-Host "Log: $log"
