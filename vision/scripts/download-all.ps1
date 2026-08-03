$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root
. (Join-Path $Root "scripts\use-d-drive.ps1")

$python = Join-Path $Root "venv\Scripts\python.exe"
if (-not (Test-Path $python)) {
    Write-Host "No venv. Run: .\scripts\setup-venv.ps1 -DownloadOnly"
    exit 1
}

& $python scripts\download_weights.py --base-only
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$envFile = Join-Path $Root ".env"
$key = ""
if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^\s*ROBOFLOW_API_KEY\s*=\s*(.+)\s*$') {
            $key = $matches[1].Trim()
        }
    }
}
if ($key) {
    & $python scripts\download_weights.py --specialized-only --train-epochs 25
} else {
    Write-Host "ROBOFLOW_API_KEY not in .env - specialized models skipped."
}

& $python scripts\download_weights.py --check-only
