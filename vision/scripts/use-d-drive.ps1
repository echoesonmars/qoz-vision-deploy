$Root = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { "d:\edtech\qoz-vision" }
$cache = Join-Path $Root ".cache"
$dirs = @("tmp", "pip", "ultralytics", "torch", "hf", "xdg", "roboflow")
foreach ($d in $dirs) {
    New-Item -ItemType Directory -Force -Path (Join-Path $cache $d) | Out-Null
}
$tmp = Join-Path $cache "tmp"
$env:TEMP = $tmp
$env:TMP = $tmp
$env:TMPDIR = $tmp
$env:PIP_CACHE_DIR = Join-Path $cache "pip"
$env:ULTRALYTICS_CONFIG_DIR = Join-Path $cache "ultralytics"
$env:TORCH_HOME = Join-Path $cache "torch"
$env:HF_HOME = Join-Path $cache "hf"
$env:XDG_CACHE_HOME = Join-Path $cache "xdg"
Write-Host "Cache on D: $cache"
