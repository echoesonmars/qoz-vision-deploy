$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root
. (Join-Path $Root "scripts\use-d-drive.ps1")
$python = Join-Path $Root "venv\Scripts\python.exe"
$ids = @("weapon", "fall", "smoking", "phone", "sleep")
foreach ($id in $ids) {
    Write-Host "=== $id ==="
    & $python scripts\download_weights.py --specialized-only --id $id --train-epochs 15
    if ($LASTEXITCODE -ne 0) { Write-Host "failed: $id"; exit $LASTEXITCODE }
}
& $python scripts\download_weights.py --check-only
