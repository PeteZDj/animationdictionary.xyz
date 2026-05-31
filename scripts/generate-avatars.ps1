# generate-avatars.ps1
# Script to generate fun profile images for the Animation 300 roster
$ErrorActionPreference = 'Stop'

$repo = 'C:\inetpub\repos\animationdictionary.xyz'
$outDir = Join-Path $repo 'public\img\profiles'

if (-not (Test-Path $outDir)) {
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
  Write-Host "Created output directory: $outDir"
}

# The 30 animators matching animators.ts
$animators = @(
  @{ name = "Captain Mocap"; slug = "captain-mocap" },
  @{ name = "Keyframe King"; slug = "keyframe-king" },
  @{ name = "Spline Whisperer"; slug = "spline-whisperer" },
  @{ name = "Rig-Master"; slug = "rig-master" },
  @{ name = "Roto Phantom"; slug = "roto-phantom" },
  @{ name = "Onion Skin"; slug = "onion-skin" },
  @{ name = "Squash & Stretch"; slug = "squash-and-stretch" },
  @{ name = "Mr. Frame-One"; slug = "mr-frame-one" },
  @{ name = "Inertia Sensei"; slug = "inertia-sensei" },
  @{ name = "The Tweener"; slug = "the-tweener" },
  @{ name = "Hipline Henry"; slug = "hipline-henry" },
  @{ name = "Anticipation Ada"; slug = "anticipation-ada" },
  @{ name = "Follow-Through Fei"; slug = "follow-through-fei" },
  @{ name = "Lipsync Luma"; slug = "lipsync-luma" },
  @{ name = "Arc Architect"; slug = "arc-architect" },
  @{ name = "Pose Engineer"; slug = "pose-engineer" },
  @{ name = "Combat Choreo"; slug = "combat-choreo" },
  @{ name = "Ninja Bezier"; slug = "ninja-bezier" },
  @{ name = "Quadruped Quill"; slug = "quadruped-quill" },
  @{ name = "Wing Captain"; slug = "wing-captain" },
  @{ name = "Hex Boss"; slug = "hex-boss" },
  @{ name = "Loop Lord"; slug = "loop-lord" },
  @{ name = "Reaction Rin"; slug = "reaction-rin" },
  @{ name = "Crowd Director"; slug = "crowd-director" },
  @{ name = "Slow-Mo Sato"; slug = "slow-mo-sato" },
  @{ name = "Locomotion Liz"; slug = "locomotion-liz" },
  @{ name = "Vault Vega"; slug = "vault-vega" },
  @{ name = "Roar Engineer"; slug = "roar-engineer" },
  @{ name = "Dance Kernel"; slug = "dance-kernel" },
  @{ name = "Pose-To-Pose Pia"; slug = "pose-to-pose-pia" }
)

Write-Host "Generating $($animators.Length) avatars using Dicebear Adventurer..." -ForegroundColor Cyan

foreach ($a in $animators) {
  $file = Join-Path $outDir "$($a.slug).svg"
  
  # Fetch transparent adventurer SVG avatar using the slug as a seed
  $url = "https://api.dicebear.com/7.x/adventurer/svg?seed=$($a.slug)"
  
  Write-Host "Fetching avatar for $($a.name) -> $($a.slug).svg..."
  
  try {
    # Download with TLS 1.2 support enabled just in case
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $file -TimeoutSec 15
  } catch {
    Write-Warning "Failed downloading for $($a.name), retrying..."
    Start-Sleep -Seconds 2
    Invoke-WebRequest -Uri $url -OutFile $file -TimeoutSec 30
  }
}

$files = Get-ChildItem -Path $outDir -Filter '*.svg'
Write-Host "Successfully generated $($files.Count) SVG avatars in $outDir!" -ForegroundColor Green
