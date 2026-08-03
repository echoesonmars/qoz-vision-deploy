import json
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any, Optional

log = logging.getLogger(__name__)

from ultralytics import YOLO

from core.config import settings
from models.incident_labels import DETECTION_TO_QOZ_INCIDENT

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "weights" / "manifest.json"
ZONE_PRESETS = {
    "classroom": {"sleep", "phone_usage", "fight", "smoking", "fall", "weapon", "fire_smoke"},
    "corridor": {"crowd", "fall", "fight", "weapon", "fire_smoke"},
    "entrance": {"anpr", "weapon", "fire_smoke", "crowd"},
    "street": {"weapon", "fire_smoke", "fight", "fence_climbing"},
}
PROFILE_DEFAULT_MODELS = {
    "single_stream_optimized": ["weapon", "fire_smoke", "fight", "smoking"],
}
ROTATE_GROUP_A = frozenset({"weapon", "fire_smoke"})
ROTATE_GROUP_B = frozenset({"fight", "smoking"})
INCIDENT_UPLOAD_MODEL_ORDER = {
    "weapon": 0,
    "fire_smoke": 1,
    "smoking": 2,
    "fight": 3,
}
MODEL_ALIASES = {
    "phone": "phone_usage",
}
VARIANT_FALLBACK_ORDER: dict[str, tuple[str, ...]] = {
    "small": ("small", "medium", "heavy"),
    "medium": ("medium", "small", "heavy"),
    "heavy": ("heavy", "medium", "small"),
}


def _weights_root() -> Path:
    p = Path(settings.WEIGHTS_DIR)
    if not p.is_absolute():
        p = ROOT / p
    return p


def _external_root() -> Path:
    p = Path(settings.EXTERNAL_SELECTED_DIR)
    if not p.is_absolute():
        p = ROOT / p
    return p


def _load_manifest() -> dict[str, Any]:
    with open(MANIFEST_PATH, encoding="utf-8") as f:
        return json.load(f)


def base_model_path(name: str) -> Path:
    root = _weights_root() / "base"
    legacy = ROOT / name
    candidate = root / name
    if candidate.is_file():
        return candidate
    if legacy.is_file():
        return legacy
    return candidate


def specialized_path(filename: str) -> Path:
    return _weights_root() / "specialized" / filename


class WeightsRegistry:
    def __init__(self):
        self._manifest = _load_manifest()
        self._specialized_cache: dict[str, YOLO] = {}
        self._enabled = self._parse_enabled()
        self._weights_source = (settings.WEIGHTS_SOURCE or "external").strip().lower()
        if self._weights_source not in ("auto", "external", "legacy", "qoz"):
            self._weights_source = "external"
        self._qoz_mode = self._weights_source == "qoz"
        self._qoz_runner = None
        if self._qoz_mode:
            from models.qoz_unified_models import get_qoz_runner
            self._qoz_runner = get_qoz_runner()
        self._model_variant = (settings.MODEL_VARIANT or "small").strip().lower()
        self._zone_by_camera = self._parse_camera_zones()
        self._inference_workers = max(1, int(settings.SPECIALIZED_INFERENCE_WORKERS))
        self._entries = self._build_entries()
        self._entry_by_id = {e["id"]: e for e in self._entries}
        self._resolved_paths: dict[str, Path] = {}
        self.available_specialized: list[str] = []
        if self._qoz_mode and self._qoz_runner is not None:
            self.available_specialized = list(self._qoz_runner.available_ids)
        else:
            for entry in self._entries:
                path = self._resolve_model_path(entry)
                if path is not None and path.is_file():
                    self.available_specialized.append(entry["id"])
                    self._resolved_paths[entry["id"]] = path

    def _parse_enabled(self) -> set[str]:
        raw = (settings.ENABLED_MODELS or "all").strip().lower()
        if raw == "all":
            return {"all"}
        out = set()
        for x in raw.split(","):
            k = x.strip()
            if not k:
                continue
            out.add(MODEL_ALIASES.get(k, k))
        return out

    def zone_for_camera(self, camera_id: int) -> Optional[str]:
        z = self._zone_by_camera.get(camera_id, "").strip().lower()
        return z or None

    def _parse_camera_zones(self) -> dict[int, str]:
        raw = (settings.CAMERA_ZONE_MAP or "").strip()
        out: dict[int, str] = {}
        if not raw:
            return out
        for item in raw.split(","):
            part = item.strip()
            if ":" not in part:
                continue
            camera_txt, zone_txt = part.split(":", 1)
            try:
                camera_id = int(camera_txt.strip())
            except ValueError:
                continue
            zone = zone_txt.strip().lower()
            if zone:
                out[camera_id] = zone
        return out

    def _build_entries(self) -> list[dict[str, Any]]:
        rows = []
        for entry in self._manifest.get("specialized", []):
            item = dict(entry)
            item["id"] = MODEL_ALIASES.get(str(entry["id"]).lower(), str(entry["id"]).lower())
            if item["id"] in self._enabled or "all" in self._enabled:
                rows.append(item)
        return rows

    def _variant_order_for_entry(
        self,
        entry: dict[str, Any],
        state_key: Optional[str] = None,
    ) -> tuple[str, ...]:
        if (state_key or "").strip() == "incident-upload" and entry.get("id") == "smoking":
            return ("small", "heavy", "medium")
        return VARIANT_FALLBACK_ORDER.get(
            self._model_variant,
            (self._model_variant, "small", "heavy"),
        )

    def _external_candidate(
        self,
        entry: dict[str, Any],
        state_key: Optional[str] = None,
    ) -> Optional[Path]:
        subdir = str(entry.get("external_subdir") or entry["id"]).strip()
        if not subdir:
            return None
        model_dir = _external_root() / subdir
        size_files = entry.get("size_files") or {}
        order = self._variant_order_for_entry(entry, state_key)
        seen: set[str] = set()
        for key in order:
            if key in seen:
                continue
            seen.add(key)
            pick = size_files.get(key)
            if not pick:
                continue
            p = model_dir / pick
            if p.is_file():
                return p
        return None

    def _resolve_model_path(
        self,
        entry: dict[str, Any],
        state_key: Optional[str] = None,
    ) -> Optional[Path]:
        if self._weights_source in ("auto", "external"):
            ext = self._external_candidate(entry, state_key)
            if ext is not None and ext.is_file():
                return ext
        if self._weights_source in ("auto", "legacy"):
            fn = str(entry.get("filename") or "").strip()
            if fn:
                leg = specialized_path(fn)
                if leg.is_file():
                    return leg
        return None

    def _profile_models(self) -> Optional[list[str]]:
        name = (settings.RUNTIME_PROFILE or "single_stream_optimized").strip().lower()
        rows = PROFILE_DEFAULT_MODELS.get(name)
        if not rows:
            return None
        return [MODEL_ALIASES.get(x, x) for x in rows]

    def _active_model_ids(self, camera_id: int) -> list[str]:
        available = [m for m in self.available_specialized if m in self._entry_by_id]
        if settings.RUN_ALL_SPECIALIZED:
            prof = self._profile_models()
            if prof:
                order = {m: i for i, m in enumerate(prof)}
                return sorted(available, key=lambda m: order.get(m, len(order)))
            return available
        zone = self._zone_by_camera.get(camera_id, "").strip().lower()
        if zone and zone in ZONE_PRESETS:
            zone_set = ZONE_PRESETS[zone]
            return [m for m in available if m in zone_set]
        prof = self._profile_models()
        if prof:
            order = {m: i for i, m in enumerate(prof)}
            return sorted(available, key=lambda m: order.get(m, len(order)))
        return available

    def _base_path_by_ids(self, preferred_ids: tuple[str, ...], fallback_filename: str) -> str:
        by_id = {e["id"]: e["filename"] for e in self._manifest.get("base", [])}
        for bid in preferred_ids:
            fn = by_id.get(bid)
            if fn:
                p = base_model_path(fn)
                if p.is_file():
                    return str(p)
        p = base_model_path(fallback_filename)
        if p.is_file():
            return str(p)
        return str(p)

    def pose_model_path(self) -> str:
        return self._base_path_by_ids(
            ("yolo11n-pose", "yolov8n-pose"),
            "yolo11n-pose.pt",
        )

    def base_detect_model_path(self) -> str:
        return self._base_path_by_ids(
            ("yolo11m", "yolov8n"),
            "yolo11m.pt",
        )

    def _specialized_cache_key(self, entry: dict, state_key: Optional[str] = None) -> str:
        model_id = entry["id"]
        if (state_key or "").strip() == "incident-upload" and model_id == "smoking":
            return f"{model_id}:incident-upload"
        return model_id

    def _get_specialized_model(
        self,
        entry: dict,
        state_key: Optional[str] = None,
    ) -> Optional[YOLO]:
        cache_key = self._specialized_cache_key(entry, state_key)
        if cache_key in self._specialized_cache:
            return self._specialized_cache[cache_key]
        path = self._resolve_model_path(entry, state_key=state_key)
        if path is None or not path.is_file():
            path = self._resolved_paths.get(entry["id"])
        if path is None or not path.is_file():
            return None

        # Check if we already loaded a model with this exact path to share the instance
        path_str = str(path)
        for cached_key, cached_model in self._specialized_cache.items():
            if getattr(cached_model, '_original_path_str', None) == path_str:
                self._specialized_cache[cache_key] = cached_model
                return cached_model

        model = YOLO(path_str)
        model._original_path_str = path_str
        model._is_unified_best = (Path(path_str).name == "best.pt")
        self._specialized_cache[cache_key] = model
        return model

    def _skip_rotate_for_state(self, state_key: Optional[str]) -> bool:
        sk = (state_key or "").strip()
        return sk == "incident-upload"

    def all_specialized_entries(
        self,
        camera_id: int = 0,
        frame_index: Optional[int] = None,
        state_key: Optional[str] = None,
    ) -> list[dict]:
        active = self._active_model_ids(camera_id)
        out: list[dict] = []
        for model_id in active:
            entry = self._entry_by_id.get(model_id)
            if entry is not None:
                out.append(entry)
        if (
            settings.SPECIALIZED_ROTATE_PER_FRAME
            and frame_index is not None
            and not self._skip_rotate_for_state(state_key)
        ):
            group = ROTATE_GROUP_A if frame_index % 2 == 0 else ROTATE_GROUP_B
            out = [e for e in out if e.get("id") in group]
        if self._skip_rotate_for_state(state_key):
            out.sort(key=lambda e: INCIDENT_UPLOAD_MODEL_ORDER.get(e.get("id"), 9))
        elif not self._skip_rotate_for_state(state_key):
            cap = max(1, int(settings.SPECIALIZED_PER_FRAME_MAX))
            if len(out) > cap:
                out = out[:cap]
        return out

    def _run_one_specialized(
        self,
        entry: dict,
        frame,
        conf: float,
        state_key: Optional[str] = None,
    ) -> list[dict]:
        detections: list[dict] = []
        model = self._get_specialized_model(entry, state_key=state_key)
        if model is None:
            return detections
        entry_id = entry["id"]
        ALLOWED_CLASSES = {
            "fight", "violence", "fighting",
            "smoke", "fire",
            "weapon", "gun", "pistol", "rifle", "knife", "firearm",
            "fall", "falling", "fallen",
            "phone", "cell_phone", "cellphone", "smartphone", "phone_usage",
            "smoking", "cigarette", "cigar", "vape",
            "sleep", "sleeping", "head_on_desk",
            "crowd", "gathering",
            "anpr", "license_plate", "plate",
            "baggage", "lost_property", "bag", "backpack",
            entry_id, entry_id.replace("_", "")
        }

        is_unified_best = getattr(model, "_is_unified_best", False)
        imgsz = max(320, int(settings.INFERENCE_IMGSZ))
        for r in model(frame, conf=conf, verbose=False, imgsz=imgsz):
            if r.boxes is None:
                continue
            names = r.names or {}
            for box in r.boxes:
                cls_id = int(box.cls[0])
                label = names.get(cls_id, entry_id)
                label_norm = str(label).lower().replace(" ", "_").replace("-", "_")
                
                if is_unified_best:
                    if entry_id == "fight" and label_norm == "fight":
                        pass
                    elif entry_id == "fall" and label_norm == "laying":
                        label_norm = "fall"
                    else:
                        continue

                if label_norm not in ALLOWED_CLASSES:
                    continue

                if entry_id == "fire_smoke" and label_norm in ("fire", "smoke"):
                    out_label = label_norm
                elif entry_id == "anpr":
                    out_label = "anpr"
                else:
                    out_label = entry_id if entry_id != "fire_smoke" else label_norm
                qoz = DETECTION_TO_QOZ_INCIDENT.get(out_label, entry.get("qoz_incident", out_label))
                box_conf = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                detections.append({
                    "label": out_label,
                    "qoz_incident": qoz,
                    "confidence": box_conf,
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "source_model": entry_id,
                })
        return detections

    def _cuda_cleanup(self) -> None:
        if not settings.USE_GPU:
            return
        try:
            import torch
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
        except Exception:
            pass

    def _run_all_specialized_entries(
        self,
        entries: list[dict],
        frame,
        conf: float,
        state_key: Optional[str] = None,
    ) -> list[dict]:
        detections: list[dict] = []
        for entry in entries:
            model_id = entry.get("id", "?")
            try:
                detections.extend(
                    self._run_one_specialized(entry, frame, conf, state_key=state_key)
                )
            except RuntimeError as e:
                msg = str(e).lower()
                if "out of memory" in msg or "cuda" in msg:
                    log.warning("specialized model %s OOM, skipping: %s", model_id, e)
                    self._cuda_cleanup()
                else:
                    log.warning("specialized model %s failed: %s", model_id, e)
            except Exception as e:
                log.warning("specialized model %s failed: %s", model_id, e)
            if self._skip_rotate_for_state(state_key):
                self._cuda_cleanup()
        self._cuda_cleanup()
        return detections

    def run_specialized(
        self,
        frame,
        conf: float = 0.4,
        camera_id: int = 0,
        run_all: bool = True,
        frame_index: Optional[int] = None,
        state_key: Optional[str] = None,
    ) -> list[dict]:
        if self._qoz_mode and self._qoz_runner is not None:
            return self._qoz_runner.run_all(frame, conf=conf)
        entries = self.all_specialized_entries(
            camera_id=camera_id,
            frame_index=frame_index,
            state_key=state_key,
        )
        if not entries:
            return []
        if not settings.RUN_ALL_SPECIALIZED and not run_all:
            return []
        use_parallel = (
            not settings.USE_GPU
            and self._inference_workers > 1
            and len(entries) > 1
        )
        if not use_parallel:
            return self._run_all_specialized_entries(entries, frame, conf, state_key=state_key)
        detections: list[dict] = []
        workers = min(self._inference_workers, len(entries))
        with ThreadPoolExecutor(max_workers=workers) as pool:
            futures = {
                pool.submit(self._run_one_specialized, entry, frame, conf, state_key): entry
                for entry in entries
            }
            for fut in as_completed(futures):
                entry = futures[fut]
                model_id = entry.get("id", "?")
                try:
                    detections.extend(fut.result())
                except Exception as e:
                    log.warning("specialized model %s failed: %s", model_id, e)
        return detections

    def status(self) -> dict:
        per_frame = len(self.all_specialized_entries(0, frame_index=0))
        out = {
            "weights_dir": str(_weights_root()),
            "external_selected_dir": str(_external_root()),
            "weights_source": self._weights_source,
            "model_variant": self._model_variant,
            "use_base_detect": settings.USE_BASE_DETECT,
            "run_all_specialized": settings.RUN_ALL_SPECIALIZED,
            "specialized_rotate_per_frame": settings.SPECIALIZED_ROTATE_PER_FRAME,
            "specialized_per_frame_max": int(settings.SPECIALIZED_PER_FRAME_MAX),
            "specialized_rotate_groups": {
                "A": sorted(ROTATE_GROUP_A),
                "B": sorted(ROTATE_GROUP_B),
            },
            "specialized_rotate_skipped_for": "incident-upload",
            "heuristics_enabled": True,
            "specialized_inference_workers": self._inference_workers,
            "specialized_run_parallel": not settings.USE_GPU and self._inference_workers > 1,
            "specialized_per_frame_count": per_frame,
            "specialized_total_enabled": len(self.all_specialized_entries(0, frame_index=None)),
            "runtime_profile": (settings.RUNTIME_PROFILE or "single_stream_optimized").strip().lower(),
            "base": {
                "yolo11m": Path(self.base_detect_model_path()).is_file(),
                "yolo11n_pose": Path(self.pose_model_path()).is_file(),
                "yolov8n": base_model_path("yolov8n.pt").is_file(),
                "yolov8n_pose": base_model_path("yolov8n-pose.pt").is_file(),
            },
            "specialized_available": self.available_specialized,
            "specialized_enabled": [e["id"] for e in self._entries],
            "specialized_resolved": {k: str(v) for k, v in self._resolved_paths.items()},
            "camera_zone_map": self._zone_by_camera,
        }
        if self._qoz_mode and self._qoz_runner is not None:
            out.update(self._qoz_runner.status())
            out["specialized_enabled"] = out.get("qoz_incident_classes", [])
        return out


_registry: Optional[WeightsRegistry] = None


def get_registry() -> WeightsRegistry:
    global _registry
    if _registry is None:
        _registry = WeightsRegistry()
    return _registry
