$Root = $PSScriptRoot
Set-Location $Root
. (Join-Path $Root "scripts\use-d-drive.ps1")
& "$Root\venv\Scripts\python.exe" main.py
