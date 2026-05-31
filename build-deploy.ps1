# Build and deploy animationdictionary.xyz (ASCII-only safe)
$ErrorActionPreference = 'Continue'
$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
$log = "C:\migration\adxyz-build-$ts.log"
Start-Transcript -Path $log | Out-Null

$src = 'C:\inetpub\repos\animationdictionary.xyz'
$dst = 'C:\inetpub\wwwroot\animationdictionary.xyz'

Push-Location $src

Write-Host "=== npm install ===" -ForegroundColor Cyan
npm install --no-audit --no-fund --loglevel=error 2>&1 | Out-Host
$installExit = $LASTEXITCODE
Write-Host "  install exit: $installExit"
if ($installExit -ne 0) {
  Pop-Location
  Stop-Transcript | Out-Null
  Write-Host "INSTALL FAILED"
  exit 1
}

Write-Host ""
Write-Host "=== next build (static export) ===" -ForegroundColor Cyan
$env:NEXT_TELEMETRY_DISABLED = '1'
$env:CI = '1'
cmd /c 'npx --no-install next build 2>&1' | Out-Host
$buildExit = $LASTEXITCODE
Write-Host "  build exit: $buildExit"

# Hard-gate the deploy on the actual build exit code. If next build errored we
# absolutely do NOT want to re-publish the previous good out/ silently — that
# masks regressions and led to a confusing "smoke tests pass on stale content"
# situation. Keep the existing wwwroot intact instead.
if ($buildExit -ne 0) {
  Pop-Location
  Stop-Transcript | Out-Null
  Write-Host "BUILD FAILED (exit $buildExit). NOT deploying — wwwroot keeps the previous good build."
  exit 1
}
if (-not (Test-Path "$src\out")) {
  Pop-Location
  Stop-Transcript | Out-Null
  Write-Host "BUILD FAILED: no out/ folder"
  exit 1
}

Write-Host ""
Write-Host "=== deploy ===" -ForegroundColor Cyan
Import-Module WebAdministration
Stop-Website -Name 'animationdictionary.xyz' -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

if (Test-Path $dst) {
  Get-ChildItem $dst -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
} else {
  New-Item -Path $dst -ItemType Directory -Force | Out-Null
}

Copy-Item -Path "$src\out\*" -Destination $dst -Recurse -Force
$fileCount = (Get-ChildItem $dst -Recurse -File).Count
Write-Host "  deployed: $fileCount files"

$acl = Get-Acl $dst
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
  'IIS_IUSRS','ReadAndExecute','ContainerInherit,ObjectInherit','None','Allow')
$acl.SetAccessRule($rule)
Set-Acl -Path $dst -AclObject $acl

Start-Website -Name 'animationdictionary.xyz'
Pop-Location

Write-Host ""
Write-Host "=== smoke tests ===" -ForegroundColor Cyan
$paths = @('/','/verbs/','/verbs/vault/','/verbs/sneak/','/nouns/','/nouns/bird/','/nouns/dragon/','/marketplace/','/animation-300/')
foreach ($p in $paths) {
  $code = & curl.exe -s -o NUL -w '%{http_code}' -H 'Host: animationdictionary.xyz' "http://127.0.0.1$p"
  $bytes = & curl.exe -s -o NUL -w '%{size_download}' -H 'Host: animationdictionary.xyz' "http://127.0.0.1$p"
  "  {0,-24} HTTP {1}  {2,8} bytes" -f $p, $code, $bytes
}

Stop-Transcript | Out-Null
Write-Host ""
Write-Host "Log: $log"
