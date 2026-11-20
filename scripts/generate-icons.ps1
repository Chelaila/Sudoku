<#
  Regenerates the Android launcher icons and splash images from assets/logo.png
  (a 1024px transparent render of assets/logo.svg):  npm run android:icons

  Uses only System.Drawing (built into Windows PowerShell), no npm packages.
  Output replaces the Capacitor template images under android/app/src/main/res.
#>
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$AppDir = Split-Path $PSScriptRoot -Parent
$Res = Join-Path $AppDir 'android\app\src\main\res'
$BackgroundHex = '#0E1117'
$Background = [System.Drawing.ColorTranslator]::FromHtml($BackgroundHex)
$Densities = [ordered]@{ mdpi = 1; hdpi = 1.5; xhdpi = 2; xxhdpi = 3; xxxhdpi = 4 }

# Logo size relative to each canvas. The adaptive foreground is a 108dp canvas
# masked to a ~72dp shape, so the logo must stay inside that center area.
$LegacyScale = 1.0
$RoundScale = 0.8
$AdaptiveScale = 0.62
$SplashScale = 0.35

$logo = [System.Drawing.Image]::FromFile((Join-Path $AppDir 'assets\logo.png'))

function New-Canvas([int]$Width, [int]$Height) {
  $bitmap = New-Object System.Drawing.Bitmap($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  [pscustomobject]@{ Bitmap = $bitmap; Graphics = $graphics; Width = $Width; Height = $Height }
}

function Add-Logo($Canvas, [double]$Scale) {
  $size = [int]([Math]::Min($Canvas.Width, $Canvas.Height) * $Scale)
  $x = [int](($Canvas.Width - $size) / 2)
  $y = [int](($Canvas.Height - $size) / 2)
  $Canvas.Graphics.DrawImage($logo, $x, $y, $size, $size)
}

function Save-Canvas($Canvas, [string]$Path) {
  $Canvas.Graphics.Dispose()
  $Canvas.Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $Canvas.Bitmap.Dispose()
}

try {
  foreach ($density in $Densities.GetEnumerator()) {
    $dir = Join-Path $Res "mipmap-$($density.Key)"
    $iconSize = [int](48 * $density.Value)
    $adaptiveSize = [int](108 * $density.Value)

    $legacy = New-Canvas $iconSize $iconSize
    Add-Logo $legacy $LegacyScale
    Save-Canvas $legacy (Join-Path $dir 'ic_launcher.png')

    $round = New-Canvas $iconSize $iconSize
    $brush = New-Object System.Drawing.SolidBrush($Background)
    $round.Graphics.FillEllipse($brush, 0, 0, $iconSize, $iconSize)
    $brush.Dispose()
    Add-Logo $round $RoundScale
    Save-Canvas $round (Join-Path $dir 'ic_launcher_round.png')

    $foreground = New-Canvas $adaptiveSize $adaptiveSize
    Add-Logo $foreground $AdaptiveScale
    Save-Canvas $foreground (Join-Path $dir 'ic_launcher_foreground.png')
  }

  # Splash images keep the template's sizes (portrait/landscape per density).
  foreach ($file in Get-ChildItem $Res -Recurse -Filter 'splash.png') {
    $existing = [System.Drawing.Image]::FromFile($file.FullName)
    $width = $existing.Width
    $height = $existing.Height
    $existing.Dispose()

    $splash = New-Canvas $width $height
    $splash.Graphics.Clear($Background)
    Add-Logo $splash $SplashScale
    Save-Canvas $splash $file.FullName
  }
} finally {
  $logo.Dispose()
}

# Background of the adaptive icon (behind the foreground layer).
# ascii, not utf8: Windows PowerShell's utf8 adds a BOM that Android XML parsing dislikes.
Set-Content -Path (Join-Path $Res 'values\ic_launcher_background.xml') -Encoding ascii -Value @"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">$BackgroundHex</color>
</resources>
"@

Write-Host 'Android icons and splash images regenerated.'
