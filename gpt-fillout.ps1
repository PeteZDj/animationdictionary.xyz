# Generate GPT Image versions of the dictionary robot verb thumbnails.
# Uses the existing Magi shotlists + robot style anchor as the prompt source,
# but sends jobs to the bundled OpenAI GPT Images CLI instead of Magi/Gemini.

param(
  [string]$Repo = 'C:\inetpub\repos\animationdictionary.xyz',
  [string]$OutDir = '',
  [string]$Python = 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe',
  [string]$ImageCli = 'C:\Users\Administrator\.codex\skills\.system\imagegen\scripts\image_gen.py',
  [ValidateSet('low','medium','high','auto')]
  [string]$Quality = 'medium',
  [string]$Size = '1024x1024',
  [int]$Concurrency = 3,
  [switch]$DryRun,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

if (-not $OutDir) {
  $OutDir = Join-Path $Repo 'public\img\gpt\verbs'
}

$tmpDir = Join-Path $Repo 'tmp\imagegen'
$manifest = Join-Path $tmpDir 'gpt-verbs-from-magi-prompts.jsonl'
$logDir = 'C:\migration'
$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
$log = Join-Path $logDir "gpt-fillout-$ts.log"

New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

if (-not (Test-Path $Python)) {
  throw "Python not found at $Python"
}
if (-not (Test-Path $ImageCli)) {
  throw "GPT image CLI not found at $ImageCli"
}
if (-not $DryRun -and -not $env:OPENAI_API_KEY) {
  throw "OPENAI_API_KEY is not set. Set it in this shell, then re-run this script."
}

$anchorPath = Join-Path $Repo 'magi.style.txt'
$shotFiles = @(
  'magi-shotlist.json',
  'magi-shotlist-verbs-batch2.json',
  'magi-shotlist-verbs-batch3.json'
)

$anchor = Get-Content -Raw -Encoding UTF8 -Path $anchorPath
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$writer = New-Object System.IO.StreamWriter($manifest, $false, $utf8NoBom)
$count = 0

try {
  foreach ($file in $shotFiles) {
    $items = Get-Content -Raw -Encoding UTF8 -Path (Join-Path $Repo $file) | ConvertFrom-Json
    foreach ($item in $items) {
      $prompt = @"
Use case: stylized-concept
Asset type: animation dictionary verb thumbnail
Primary request: $($item.prompt)
Style/medium: high-end stylized 3D render matching the established AnimationDictionary barracks robot thumbnails
Composition/framing: square 1:1, centered full-body action pose, readable silhouette, comfortable padding
Constraints: preserve the exact recurring robot character design; no text, no watermark, no logo, no clothing, no props unless the action requires an invisible implied prop

Style anchor: $anchor
"@.Trim()

      $job = [ordered]@{
        prompt = $prompt
        out = "$($item.name).png"
        size = $Size
        quality = $Quality
        output_format = 'png'
      }
      $writer.WriteLine(($job | ConvertTo-Json -Compress -Depth 8))
      $count += 1
    }
  }
} finally {
  $writer.Close()
}

Write-Host "Wrote $count GPT image jobs to $manifest"
Write-Host "Output directory: $OutDir"

$args = @(
  $ImageCli,
  'generate-batch',
  '--input', $manifest,
  '--out-dir', $OutDir,
  '--model', 'gpt-image-2',
  '--size', $Size,
  '--quality', $Quality,
  '--output-format', 'png',
  '--concurrency', "$Concurrency",
  '--no-augment'
)

if ($DryRun) {
  $args += '--dry-run'
}
if ($Force) {
  $args += '--force'
}

Start-Transcript -Path $log | Out-Null
try {
  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  & $Python @args
  $exit = $LASTEXITCODE
} finally {
  $ErrorActionPreference = $previousErrorActionPreference
  Stop-Transcript | Out-Null
}

if ($exit -ne 0) {
  throw "GPT image batch failed with exit code $exit. See $log"
}

$files = Get-ChildItem -Path $OutDir -File -Filter '*.png' -ErrorAction SilentlyContinue
Write-Host "Done. $($files.Count) PNG files in $OutDir"
Write-Host "Log: $log"
