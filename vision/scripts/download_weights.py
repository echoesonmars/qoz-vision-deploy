import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import core.drive_paths  # noqa: E402, F401

import argparse
import json
import os
import shutil
from typing import List, Optional

import core.drive_paths

MANIFEST = ROOT / "weights" / "manifest.json"
BASE_DIR = ROOT / "weights" / "base"
SPEC_DIR = ROOT / "weights" / "specialized"


def load_manifest():
    with open(MANIFEST, encoding="utf-8") as f:
        return json.load(f)


def find_best_pt(search_root: Path) -> Optional[Path]:
    candidates = list(search_root.rglob("best.pt")) + list(search_root.rglob("weights/best.pt"))
    if candidates:
        return candidates[0]
    pt_files = list(search_root.rglob("*.pt"))
    return pt_files[0] if pt_files else None


def download_base(entry: dict) -> bool:
    dest = BASE_DIR / entry["filename"]
    if dest.exists():
        print(f"  skip base {entry['filename']} (exists)")
        return True
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    try:
        from ultralytics import YOLO
    except ImportError:
        print("  ultralytics not installed; pip install -r requirements.txt")
        return False
    name = entry.get("ultralytics_name", entry["filename"])
    print(f"  downloading base {name} via Ultralytics...")
    model = YOLO(name)
    src = Path(model.ckpt_path) if getattr(model, "ckpt_path", None) else None
    if src and src.is_file():
        shutil.copy2(src, dest)
        print(f"  saved {dest}")
        return True
    cache = Path.home() / ".config" / "Ultralytics"
    for pt in cache.rglob(entry["filename"]):
        shutil.copy2(pt, dest)
        print(f"  saved {dest} from cache")
        return True
    print(f"  could not locate {entry['filename']} after Ultralytics download")
    return False


PREFERRED_EXPORT_FORMATS: List[str] = [
    "yolov11",
    "yolov9",
    "yolov5pytorch",
    "yolov7pytorch",
]


def pick_export_format(version, entry: dict) -> str:
    explicit = entry.get("roboflow_format")
    if explicit:
        return explicit
    exports = getattr(version, "exports", None) or []
    for fmt in PREFERRED_EXPORT_FORMATS:
        if fmt in exports:
            return fmt
    return "yolov11"


def train_specialized(dataset_dir: Path, entry: dict, dest: Path, epochs: int) -> bool:
    data_yaml = dataset_dir / "data.yaml"
    if not data_yaml.is_file():
        print(f"  no data.yaml in {dataset_dir}")
        return False
    try:
        from ultralytics import YOLO
    except ImportError:
        print("  ultralytics not installed")
        return False
    base_pt = BASE_DIR / "yolov8n.pt"
    model = YOLO(str(base_pt if base_pt.is_file() else "yolov8n.pt"))
    train_root = core.drive_paths.CACHE_ROOT / "train" / entry["id"]
    train_root.mkdir(parents=True, exist_ok=True)
    device = "0" if os.environ.get("USE_GPU", "true").lower() in ("1", "true", "yes") else "cpu"
    try:
        import torch

        if device == "0" and not torch.cuda.is_available():
            device = "cpu"
    except ImportError:
        device = "cpu"
    print(f"  training {entry['id']} for {epochs} epochs on {device}...")
    model.train(
        data=str(data_yaml),
        epochs=epochs,
        imgsz=640,
        batch=8,
        project=str(train_root),
        name="run",
        exist_ok=True,
        device=device,
        verbose=False,
    )
    best = train_root / "run" / "weights" / "best.pt"
    if not best.is_file():
        best = find_best_pt(train_root)
    if not best:
        print(f"  training finished but no best.pt under {train_root}")
        return False
    shutil.copy2(best, dest)
    print(f"  saved {dest} from training")
    return True


def download_specialized(entry: dict, api_key: str, train_epochs: int, allow_train: bool) -> bool:
    dest = SPEC_DIR / entry["filename"]
    if dest.exists():
        print(f"  skip {entry['filename']} (exists)")
        return True
    workspace = entry.get("workspace")
    project = entry.get("project")
    version = entry.get("version")
    if not workspace or not project or not version:
        print(f"  skip {entry['id']}: set workspace/project/version in manifest or export manually")
        return False
    SPEC_DIR.mkdir(parents=True, exist_ok=True)
    try:
        from roboflow import Roboflow
    except ImportError:
        print("  pip install roboflow")
        return False
    tmp_dir = core.drive_paths.CACHE_ROOT / "roboflow" / entry["id"]
    tmp_dir.mkdir(parents=True, exist_ok=True)
    rf = Roboflow(api_key=api_key)
    proj = rf.workspace(workspace).project(project)
    ver = proj.version(int(version))
    export_fmt = pick_export_format(ver, entry)
    print(f"  roboflow {workspace}/{project} v{version} ({export_fmt}) -> {entry['filename']}...")
    print(f"  cache dir: {tmp_dir}")
    data_yaml = tmp_dir / "data.yaml"
    if data_yaml.is_file():
        print(f"  reuse cached dataset")
        tmp_root = tmp_dir
    else:
        dataset = ver.download(export_fmt, location=str(tmp_dir), overwrite=True)
        tmp_root = Path(dataset.location) if hasattr(dataset, "location") else tmp_dir
    best = find_best_pt(tmp_root)
    if best:
        shutil.copy2(best, dest)
        print(f"  saved {dest}")
        return True
    if not allow_train or train_epochs < 1:
        print(f"  no .pt in export; enable --train-epochs to train locally")
        return False
    return train_specialized(tmp_root, entry, dest, train_epochs)


def check_only(manifest: dict) -> int:
    missing = 0
    for entry in manifest.get("base", []):
        path = BASE_DIR / entry["filename"]
        status = "ok" if path.is_file() else "MISSING"
        print(f"[{status}] base/{entry['filename']}")
        if status == "MISSING":
            missing += 1
    for entry in manifest.get("specialized", []):
        path = SPEC_DIR / entry["filename"]
        status = "ok" if path.is_file() else "MISSING"
        print(f"[{status}] specialized/{entry['filename']} ({entry['id']})")
        if status == "MISSING":
            missing += 1
    return missing


def main():
    parser = argparse.ArgumentParser(description="Download Qoz Vision YOLO weights")
    parser.add_argument("--check-only", action="store_true")
    parser.add_argument("--base-only", action="store_true")
    parser.add_argument("--specialized-only", action="store_true")
    parser.add_argument("--train-epochs", type=int, default=25, help="Train yolov8n on Roboflow export if no .pt (0=skip)")
    parser.add_argument("--id", dest="only_id", help="Only this specialized model id from manifest")
    args = parser.parse_args()
    try:
        from dotenv import load_dotenv
        load_dotenv(ROOT / ".env")
    except ImportError:
        pass
    manifest = load_manifest()
    if args.check_only:
        missing = check_only(manifest)
        sys.exit(1 if missing else 0)
    ok = True
    if not args.specialized_only:
        print("Base models:")
        for entry in manifest.get("base", []):
            if not download_base(entry):
                ok = False
    if not args.base_only:
        api_key = os.environ.get("ROBOFLOW_API_KEY", "").strip()
        if not api_key:
            try:
                from dotenv import load_dotenv
                load_dotenv(ROOT / ".env")
                api_key = os.environ.get("ROBOFLOW_API_KEY", "").strip()
            except ImportError:
                pass
        if not api_key:
            print("ROBOFLOW_API_KEY not set; skipping specialized Roboflow downloads.")
            print("Export .pt manually into weights/specialized/ (see weights/README.md).")
        else:
            print("Specialized models:")
            allow_train = args.train_epochs > 0
            for entry in manifest.get("specialized", []):
                if args.only_id and entry.get("id") != args.only_id:
                    continue
                if not download_specialized(entry, api_key, args.train_epochs, allow_train):
                    ok = False
    print("\nInventory:")
    check_only(manifest)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
