# Runs the animationdictionary API Worker locally (wrangler dev, local D1/R2)
# bound to 127.0.0.1:8787. IIS reverse-proxies /api/* here (see public/web.config).
# Registered as the "AnimationDictionaryAPI" scheduled task (runs at startup).
$ErrorActionPreference = 'Continue'

$nodeDir = 'C:\Program Files\nodejs'
if (Test-Path $nodeDir) { $env:Path = "$nodeDir;$env:Path" }

Set-Location 'C:\inetpub\repos\animationdictionary.xyz\worker'

# Bail out if something is already listening on 8787 (avoid double-start).
$busy = Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue
if ($busy) { Write-Output "8787 already in use; exiting"; return }

if (-not (Test-Path 'C:\migration')) { New-Item -ItemType Directory -Path 'C:\migration' -Force | Out-Null }

# --local keeps the SQLite/R2 state under .wrangler/state (no Cloudflare auth needed).
& cmd /c "npx wrangler dev --ip 127.0.0.1 --port 8787 --log-level info >> C:\migration\adxyz-api.log 2>&1"
