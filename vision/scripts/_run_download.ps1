$ErrorActionPreference = "Continue"
$Root = "d:\edtech\qoz-vision"
Set-Location $Root
$env:TEMP = Join-Path $Root ".tmp"
$env:TMP = $env:TEMP
$env:PIP_CACHE_DIR = Join-Path $Root ".pip-cache"
New-Item -ItemType Directory -Force -Path $env:TEMP, $env:PIP_CACHE_DIR | Out-Null
$python = Join-Path $Root "venv\Scripts\python.exe"
$log = Join-Path $Root "_download_log.txt"
if (-not (Test-Path $python)) {
    "ERROR: venv\Scripts\python.exe not found" | Out-File $log -Encoding utf8
    exit 1
}
& $python (Join-Path $Root "scripts\download_weights.py") *>&1 | Tee-Object -FilePath $log
exit $LASTEXITCODE
