<#
  Generate pack audio files with a Text-to-Speech voice installed in Windows (SAPI 5),
  e.g. a Silero / RHVoice Tatar voice.

  Usage (from the repo folder, or just double-click tools\make-voice.bat):
    powershell -ExecutionPolicy Bypass -File tools\tts-to-wav.ps1 -List
    powershell -ExecutionPolicy Bypass -File tools\tts-to-wav.ps1
    powershell -ExecutionPolicy Bypass -File tools\tts-to-wav.ps1 -Pack heroes -Voice silero -Rate -2 -Force

  -Pack   pack folder name in packs\ (default: all packs in packs\index.json)
  -Voice  part of the voice name; default: first voice with Tatar culture (tt-*) or "tatar/silero/talgat" in its name
  -Rate   speed -10..10 (default -1, a bit slower for kids)
  -Force  overwrite existing files (by default existing recordings are kept, so your own recordings are safe)
  -List   only list installed voices
#>
param(
  [string]$Pack = '',
  [string]$Voice = '',
  [int]$Rate = -1,
  [switch]$Force,
  [switch]$List,
  [switch]$NoRelaunch
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$root = Split-Path -Parent $PSScriptRoot
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voices = @($synth.GetInstalledVoices() | Where-Object { $_.Enabled } | ForEach-Object { $_.VoiceInfo })

function Find-Voice {
  if ($Voice) { return $voices | Where-Object { $_.Name -like "*$Voice*" } | Select-Object -First 1 }
  return $voices | Where-Object { $_.Culture.Name -like 'tt*' -or $_.Name -match 'tatar|silero|talgat' } | Select-Object -First 1
}

$v = Find-Voice

# Some SAPI voices are registered only for 32-bit programs. If nothing was found in 64-bit
# PowerShell, run this script again in the 32-bit one.
if (-not $v -and -not $List -and -not $NoRelaunch -and [Environment]::Is64BitProcess) {
  $ps32 = Join-Path $env:WINDIR 'SysWOW64\WindowsPowerShell\v1.0\powershell.exe'
  if (Test-Path $ps32) {
    Write-Host 'Tatar voice not found in 64-bit voices, trying 32-bit...' -ForegroundColor Yellow
    $argList = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $PSCommandPath, '-NoRelaunch', '-Rate', $Rate)
    if ($Pack)  { $argList += @('-Pack', $Pack) }
    if ($Voice) { $argList += @('-Voice', $Voice) }
    if ($Force) { $argList += '-Force' }
    & $ps32 @argList
    exit $LASTEXITCODE
  }
}

if ($List -or -not $v) {
  $bits = if ([Environment]::Is64BitProcess) { '64-bit' } else { '32-bit' }
  Write-Host "Installed voices ($bits):" -ForegroundColor Cyan
  $voices | Format-Table Name, @{n = 'Culture'; e = { $_.Culture.Name } }, Gender -AutoSize | Out-String | Write-Host
  if (-not $List) {
    Write-Host 'No Tatar voice found. Run again with -Voice "<part of name>" from the list above.' -ForegroundColor Red
    exit 1
  }
  exit 0
}

Write-Host "Voice: $($v.Name) [$($v.Culture.Name)]  rate=$Rate" -ForegroundColor Green
$synth.SelectVoice($v.Name)
$synth.Rate = $Rate

$fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(
  22050,
  [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,
  [System.Speech.AudioFormat.AudioChannel]::Mono)

if ($Pack) {
  $packs = @($Pack)
} else {
  $packs = @((Get-Content (Join-Path $root 'packs\index.json') -Raw -Encoding UTF8 | ConvertFrom-Json).packs)
}

$made = 0; $skipped = 0
foreach ($p in $packs) {
  $packDir = Join-Path $root "packs\$p"
  $json = Get-Content (Join-Path $packDir 'pack.json') -Raw -Encoding UTF8 | ConvertFrom-Json
  foreach ($it in $json.items) {
    $text = if ($it.tt) { $it.tt } else { ($it.words | ForEach-Object { $_.tt }) -join ' ' }
    $rel = if ($it.audio) { $it.audio } else { "audio/$($it.id).wav" }
    if ($rel -notmatch '\.wav$') {
      Write-Host "  skip $($it.id): audio '$rel' is not .wav" -ForegroundColor Yellow; $skipped++; continue
    }
    $out = Join-Path $packDir ($rel -replace '/', '\')
    if ((Test-Path $out) -and -not $Force) {
      Write-Host "  keep $p/$rel (exists, use -Force to overwrite)"; $skipped++; continue
    }
    New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null
    $synth.SetOutputToWaveFile($out, $fmt)
    $synth.Speak($text)
    $synth.SetOutputToNull()
    Write-Host "  made $p/$rel  <- $text"
    $made++
  }
}
$synth.Dispose()
Write-Host "Done: $made created, $skipped kept/skipped." -ForegroundColor Green
Write-Host 'Listen to them, then bump VERSION in sw.js, commit and push.'
