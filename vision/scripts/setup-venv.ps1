param(
    [switch]$DownloadOnly
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root
. (Join-Path $Root "scripts\use-d-drive.ps1")

function Find-PythonLauncher {
    foreach ($ver in @("3.12", "3.11", "3.10")) {
        $null = & py "-$ver" -c "import sys" 2>$null
        if ($LASTEXITCODE -eq 0) { return "-$ver" }
    }
    return "-3"
}

if (Test-Path "venv") {
    $bin = Join-Path $Root "venv\bin\python"
    $win = Join-Path $Root "venv\Scripts\python.exe"
    if ((Test-Path $bin) -and -not (Test-Path $win)) {
        Write-Host "Removing old Mac/Linux venv..."
        Remove-Item -Recurse -Force "venv"
    }
}

if (-not (Test-Path "venv\Scripts\python.exe")) {
    $pyArg = Find-PythonLauncher
    Write-Host "Creating Windows venv (py $pyArg)..."
    & py $pyArg -m venv venv
    if (-not (Test-Path "venv\Scripts\python.exe")) {
        python -m venv venv
    }
}

$python = ".\venv\Scripts\python.exe"
& $python -m pip install --upgrade pip
& ".\venv\Scripts\pip.exe" install -r requirements-download.txt
if (-not $DownloadOnly) {
    & ".\venv\Scripts\pip.exe" install -r requirements.txt
}
& $python --version
Write-Host "Done. Activate: .\venv\Scripts\Activate.ps1"
