# Install / replace Font Awesome desktop fonts (Windows).
# Usage: drag the otfs folder onto "Install FA Fonts.bat", or double-click and pick it.

$ErrorActionPreference = "Stop"

function Get-SourcePath {
  param([string[]]$ArgsIn)
  if ($ArgsIn -and $ArgsIn.Count -ge 1 -and (Test-Path -LiteralPath $ArgsIn[0])) {
    return (Resolve-Path -LiteralPath $ArgsIn[0]).Path
  }

  Add-Type -AssemblyName System.Windows.Forms | Out-Null
  $folderDialog = New-Object System.Windows.Forms.FolderBrowserDialog
  $folderDialog.Description = "Select the otfs folder from your unzipped Font Awesome download"
  $folderDialog.ShowNewFolderButton = $false
  if ($folderDialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    return $folderDialog.SelectedPath
  }
  return $null
}

function Get-FontDir {
  param([string]$Src)

  if (-not (Test-Path -LiteralPath $Src -PathType Container)) {
    return $null
  }

  $otfs = Get-ChildItem -LiteralPath $Src -Directory -Recurse -Filter "otfs" -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($otfs) {
    return $otfs.FullName
  }

  $hasFonts = Get-ChildItem -LiteralPath $Src -File -Recurse -Include *.otf, *.ttf -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($hasFonts) {
    return $Src
  }

  return $null
}

function Install-FontFile {
  param([string]$FontPath)
  # Shell special folder 0x14 = Fonts; CopyHere registers the font for the user.
  # Flags 0x14 ≈ quiet + Yes to All on overwrite dialogs.
  $shell = New-Object -ComObject Shell.Application
  $fontsNamespace = $shell.Namespace(0x14)
  $fontsNamespace.CopyHere($FontPath, 0x14)
}

Write-Host ""
Write-Host "======================================"
Write-Host "  Install FA Fonts"
Write-Host "======================================"
Write-Host ""

$src = Get-SourcePath -ArgsIn $args
if (-not $src) {
  Write-Host "No folder selected. Nothing to do."
  Write-Host ""
  Read-Host "Press Enter to close"
  exit 0
}

$fontDir = Get-FontDir -Src $src
if (-not $fontDir) {
  Write-Host "Couldn't find any .otf / .ttf fonts in:"
  Write-Host "  $src"
  Write-Host ""
  Write-Host "Tip: unzip the Font Awesome download, then select the otfs folder inside it."
  Write-Host ""
  Read-Host "Press Enter to close"
  exit 1
}

$userFonts = Join-Path $env:LOCALAPPDATA "Microsoft\Windows\Fonts"
New-Item -ItemType Directory -Path $userFonts -Force | Out-Null

$incoming = @(Get-ChildItem -LiteralPath $fontDir -File -Recurse -Include *.otf, *.ttf -ErrorAction SilentlyContinue)
if ($incoming.Count -eq 0) {
  Write-Host "No font files found in: $fontDir"
  Write-Host ""
  Read-Host "Press Enter to close"
  exit 1
}

$incomingNames = @($incoming | ForEach-Object { $_.Name })
# Must match FA's "Font Awesome Kit …" prefix — NOT substring "kit" (e.g. BlackItalic)
$installingKit = $incomingNames | Where-Object { $_ -like 'Font Awesome Kit*' } | Select-Object -First 1

$added = 0
$replaced = 0
$removed = 0

# Remove stale FA Kit fonts (different kit id) from the user fonts folder
if ($installingKit) {
  $existingKits = @(Get-ChildItem -LiteralPath $userFonts -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like 'Font Awesome Kit*' -and ($_.Extension -match '\.(otf|ttf)$') })
  foreach ($old in $existingKits) {
    if ($incomingNames -notcontains $old.Name) {
      try {
        Remove-Item -LiteralPath $old.FullName -Force
        $regPath = "HKCU:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts"
        if (Test-Path $regPath) {
          Get-ItemProperty $regPath | Get-Member -MemberType NoteProperty | ForEach-Object {
            $n = $_.Name
            if ($n -in @("PSPath", "PSParentPath", "PSChildName", "PSDrive", "PSProvider")) { return }
            $val = (Get-ItemProperty $regPath).$n
            if ($val -and ($val -eq $old.Name -or $val -eq $old.FullName)) {
              Remove-ItemProperty -Path $regPath -Name $n -ErrorAction SilentlyContinue
            }
          }
        }
        Write-Host "  Removed old kit font: $($old.Name)"
        $removed++
      } catch {
        Write-Host "  Could not remove $($old.Name) (close apps using it and retry)"
      }
    }
  }
}

Write-Host "Installing from:"
Write-Host "  $fontDir"
Write-Host "Into your user Fonts folder"
Write-Host ""

foreach ($font in $incoming) {
  $target = Join-Path $userFonts $font.Name
  $existed = Test-Path -LiteralPath $target
  Copy-Item -LiteralPath $font.FullName -Destination $target -Force
  Install-FontFile -FontPath $target
  if ($existed) {
    Write-Host "  Replaced  $($font.Name)"
    $replaced++
  } else {
    Write-Host "  Added     $($font.Name)"
    $added++
  }
}

Write-Host ""
Write-Host "Done. Added: $added  ·  Replaced: $replaced  ·  Removed old kits: $removed"
Write-Host ""
Write-Host "Next: fully quit Figma and reopen it."
Write-Host ""
Read-Host "Press Enter to close"
