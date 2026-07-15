# Generates AnimationDictionary brand icons: three left-aligned "motion" bars of
# varying width (the wordmark) in blue (#2563EB), on an ink (#0F172A) rounded
# background for the icon/favicon, or transparent for the adaptive/splash layers.
Add-Type -AssemblyName System.Drawing

$dir = Join-Path $PSScriptRoot "..\assets\images"
$dir = [System.IO.Path]::GetFullPath($dir)

function New-Bitmap([int]$size) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  return @($bmp, $g)
}

function Add-RoundRect($path, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
}

# Three left-aligned motion bars of varying width, vertically centered.
function Draw-Mark($g, [int]$size, [double]$fillFrac) {
  $blockW = $size * $fillFrac
  $blockH = $size * ($fillFrac * 0.86)
  $startX = ($size - $blockW) / 2
  $startY = ($size - $blockH) / 2
  $barH = $blockH * 0.235
  $gap = ($blockH - $barH * 3) / 2
  $r = $barH * 0.5
  $widths = @(1.0, 0.62, 0.82)
  $alphas = @(255, 200, 235)
  for ($i = 0; $i -lt 3; $i++) {
    $w = $blockW * $widths[$i]
    $y = $startY + $i * ($barH + $gap)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundRect $path $startX $y $w $barH $r
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($alphas[$i], 37, 99, 235)) # #2563EB
    $g.FillPath($brush, $path)
    $brush.Dispose(); $path.Dispose()
  }
}

function Save-Icon([int]$size, [string]$name, [bool]$inkBg, [double]$fillFrac) {
  $r = New-Bitmap $size
  $bmp = $r[0]; $g = $r[1]
  if ($inkBg) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundRect $path 0 0 $size $size ($size * 0.225)
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)) # #0F172A
    $g.FillPath($brush, $path)
    $brush.Dispose(); $path.Dispose()
  }
  Draw-Mark $g $size $fillFrac
  $out = Join-Path $dir $name
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  Write-Output "wrote $name ($size x $size)"
}

Save-Icon 1024 "icon.png" $true 0.5
Save-Icon 1024 "adaptive-foreground.png" $false 0.4
Save-Icon 1024 "splash-icon.png" $false 0.52
Save-Icon 196  "favicon.png" $true 0.5
Save-Icon 1024 "android-icon-foreground.png" $false 0.4
Write-Output "done -> $dir"
