import logging
from pathlib import Path
from typing import Any, Optional

from ultralytics import YOLO

from core.config import settings
from models.incident_labels import DETECTION_TO_QOZ_INCIDENT

log = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[1]

QOZ_MODEL_SPECS: tuple[dict[str, Any], ...] = (
    {
        "id": "qoz_ma",
        "env_path": "QOZ_MA_MODEL",
        "default_rel": "qoz/ma/qoz-critical.pt",
        "classes": {
            "weapon": "weapon",
            "fight": "fight",
            "fire": "fire",
            "smoke": "smoke",
        },
    },
    {
        "id": "qoz_mb",
        "env_path": "QOZ_MB_MODEL",
        "default_rel": "qoz/mb/qoz-conduct.pt",
        "classes": {
            "phone_usage": "phone_usage",
            "sleep": "sleep",
            "smoking": "smoking",
            "fall": "fall",
        },
    },
    {
        "id": "qoz_mc",
        "env_path": "QOZ_MC_MODEL",
        "default_rel": "qoz/mc/qoz-perimeter.pt",
        "classes": {
            "intrusion": "crowd",
        },
    },
    {
        "id": "qoz_eventguard",
        "env_path": "QOZ_EVENTGUARD_MODEL",
        "default_rel": "specialized/best_v4.pt",
        "classes": {
            "phone_usage": "phone_usage",
            "smoking": "smoking",
            "smoke": "smoke",
            "fighting": "fight",
            "fight": "fight",
            "climbing": "fence_climbing",
            "weapon": "weapon",
            "fallen": "fall",
            "fall": "fall",
        },
    },
)


def _weights_root() -> Path:
    p = Path(settings.WEIGHTS_DIR)
    if not p.is_absolute():
        p = ROOT / p
    return p


def resolve_qoz_model_path(spec: dict[str, Any]) -> Path:
    env_key = str(spec["env_path"])
    override = getattr(settings, env_key, "").strip()
    if override:
        p = Path(override)
        if not p.is_absolute():
            p = ROOT / p
        return p
    return _weights_root() / str(spec["default_rel"])


def normalize_class_label(raw: str) -> str:
    return str(raw).lower().replace(" ", "_").replace("-", "_")


CLASS_LABEL_ALIASES: dict[str, str] = {
    "violence": "fight",
    "fighting": "fight",
    "brawl": "fight",
    "gun": "weapon",
    "knife": "weapon",
    "pistol": "weapon",
    "rifle": "weapon",
    "firearm": "weapon",
    "phone": "phone_usage",
    "cell_phone": "phone_usage",
    "cellphone": "phone_usage",
    "smartphone": "phone_usage",
    "sleeping": "sleep",
    "cigarette": "smoking",
    "cigar": "smoking",
    "vape": "smoking",
    "falling": "fall",
    "fallen": "fall",
    "climbing_fence": "fence_climbing",
}


def resolve_class_label(raw: str, allowed: dict[str, str]) -> str | None:
    label_norm = normalize_class_label(raw)
    if label_norm in allowed:
        return label_norm
    alias = CLASS_LABEL_ALIASES.get(label_norm)
    if alias and alias in allowed:
        return alias
    return None


def model_class_name(names: dict, cls_id: int) -> str:
    if cls_id in names:
        return str(names[cls_id])
    key = str(cls_id)
    if key in names:
        return str(names[key])
    return ""


def _enabled_qoz_ids() -> frozenset[str]:
    raw = (settings.QOZ_ENABLED_MODELS or "qoz_ma,qoz_mb,qoz_mc,qoz_eventguard").strip().lower()
    return frozenset(x.strip() for x in raw.split(",") if x.strip())


def _active_qoz_specs() -> tuple[dict[str, Any], ...]:
    enabled = _enabled_qoz_ids()
    return tuple(spec for spec in QOZ_MODEL_SPECS if str(spec["id"]) in enabled)


class QozUnifiedRunner:
    def __init__(self) -> None:
        self._cache: dict[str, YOLO] = {}
        self._resolved: dict[str, Path] = {}
        self.available_ids: list[str] = []
        self._specs = _active_qoz_specs()
        for spec in self._specs:
            path = resolve_qoz_model_path(spec)
            model_id = str(spec["id"])
            if path.is_file():
                self._resolved[model_id] = path
                self.available_ids.append(model_id)
            else:
                log.warning("qoz model missing: %s -> %s", model_id, path)

    def status(self) -> dict[str, Any]:
        return {
            "qoz_models_enabled": sorted(_enabled_qoz_ids()),
            "qoz_models_available": self.available_ids,
            "qoz_models_resolved": {k: str(v) for k, v in self._resolved.items()},
            "qoz_incident_classes": sorted(
                {
                    qoz
                    for spec in self._specs
                    for qoz in spec["classes"].values()
                }
            ),
        }

    def _get_model(self, model_id: str, path: Path) -> YOLO:
        if model_id in self._cache:
            return self._cache[model_id]
        model = YOLO(str(path))
        self._cache[model_id] = model
        return model

    def _run_one(
        self,
        spec: dict[str, Any],
        frame,
        conf: float,
    ) -> list[dict]:
        model_id = str(spec["id"])
        path = self._resolved.get(model_id)
        if path is None:
            return []
        allowed = spec["classes"]
        detections: list[dict] = []
        model = self._get_model(model_id, path)
        imgsz = max(320, int(settings.INFERENCE_IMGSZ))
        try:
            results = model(frame, conf=conf, verbose=False, imgsz=imgsz)
        except Exception as e:
            log.warning("qoz model %s failed: %s", model_id, e)
            return detections
        for r in results:
            if r.boxes is None:
                continue
            names = r.names or {}
            for box in r.boxes:
                cls_id = int(box.cls[0])
                raw_label = model_class_name(names, cls_id)
                label_norm = resolve_class_label(raw_label, allowed)
                if label_norm is None:
                    continue
                out_label = label_norm
                qoz = allowed[label_norm]
                box_conf = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                detections.append({
                    "label": out_label,
                    "qoz_incident": DETECTION_TO_QOZ_INCIDENT.get(qoz, qoz),
                    "confidence": box_conf,
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "source_model": model_id,
                })
        return detections

    def run_all(self, frame, conf: float = 0.4) -> list[dict]:
        detections: list[dict] = []
        for spec in self._specs:
            if str(spec["id"]) not in self._resolved:
                continue
            detections.extend(self._run_one(spec, frame, conf))
        return detections


_runner: Optional[QozUnifiedRunner] = None


def get_qoz_runner() -> QozUnifiedRunner:
    global _runner
    if _runner is None:
        _runner = QozUnifiedRunner()
    return _runner
