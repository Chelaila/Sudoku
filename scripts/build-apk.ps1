<#
  Builds the debug APK of the Sudoku app:  npm run android:apk  (from Hub/sudoku)

  Why the detour: the Windows user folder contains a non-ASCII character and
  the Android Gradle Plugin fails on non-ASCII project paths. So the Hub folder
  is mapped to a temporary drive letter (subst) and Gradle builds from there,
  while the JDK, SDK and Gradle cache live in ASCII paths under C:\Android.

  Gradle runs with --no-daemon, so no background JVM is left running.
#>
$ErrorActionPreference = 'Stop'

$AndroidRoot = 'C:\Android'
$JavaHome = Get-ChildItem $AndroidRoot -Directory -Filter 'jdk-21*' |
  Select-Object -First 1 -ExpandProperty FullName
if (-not $JavaHome) { throw "JDK 21 not found under $AndroidRoot" }
$SdkRoot = Join-Path $AndroidRoot 'Sdk'

$AppDir = Split-Path $PSScriptRoot -Parent
$HubDir = Split-Path $AppDir -Parent

$env:JAVA_HOME = $JavaHome
$env:ANDROID_HOME = $SdkRoot
$env:GRADLE_USER_HOME = Join-Path $AndroidRoot 'gradle-home'

# 1. Web build + copy into the native project.
Push-Location $AppDir
try {
  npm run android:sync
  if ($LASTEXITCODE -ne 0) { throw 'Web build / cap sync failed' }
} finally {
  Pop-Location
}

# 2. Native build from an ASCII-only path.
Set-Content -Path (Join-Path $AppDir 'android\local.properties') `
  -Value "sdk.dir=$($SdkRoot.Replace('\', '/'))" -Encoding ascii

$used = (Get-PSDrive -PSProvider FileSystem).Name
$letter = 'S', 'T', 'U', 'V', 'W', 'X', 'Y' | Where-Object { $used -notcontains $_ } |
  Select-Object -First 1
if (-not $letter) { throw 'No free drive letter for subst' }
$drive = "${letter}:"

subst $drive $HubDir
try {
  Push-Location "$drive\sudoku\android"
  try {
    & .\gradlew.bat assembleDebug --no-daemon
    if ($LASTEXITCODE -ne 0) { throw "Gradle build failed (exit $LASTEXITCODE)" }
  } finally {
    Pop-Location
  }
} finally {
  subst $drive /D
}

$apk = Join-Path $AppDir 'android\app\build\outputs\apk\debug\app-debug.apk'
Write-Host "`nAPK: $apk"
