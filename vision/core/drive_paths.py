import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE_ROOT = ROOT / ".cache"


def apply_drive_cache() -> Path:
    paths = {
        "TEMP": CACHE_ROOT / "tmp",
        "TMP": CACHE_ROOT / "tmp",
        "TMPDIR": CACHE_ROOT / "tmp",
        "PIP_CACHE_DIR": CACHE_ROOT / "pip",
        "ULTRALYTICS_CONFIG_DIR": CACHE_ROOT / "ultralytics",
        "TORCH_HOME": CACHE_ROOT / "torch",
        "HF_HOME": CACHE_ROOT / "hf",
        "XDG_CACHE_HOME": CACHE_ROOT / "xdg",
    }
    for p in paths.values():
        p.mkdir(parents=True, exist_ok=True)
    for key, p in paths.items():
        os.environ[key] = str(p)
    return CACHE_ROOT


apply_drive_cache()
