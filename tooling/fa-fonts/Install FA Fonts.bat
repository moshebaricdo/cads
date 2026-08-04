@echo off
setlocal
title Install FA Fonts
cd /d "%~dp0"

if "%~1"=="" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-fa-fonts.ps1"
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-fa-fonts.ps1" "%~1"
)

endlocal
