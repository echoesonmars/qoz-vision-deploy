from __future__ import annotations

import logging
from typing import Any, Dict, Optional

import numpy as np

from core.config import settings
from core.image_infer import encode_jpeg_bytes, infer_frame_bgr
from models import heuristics_engine
from models.state_key import resolve_state_key
from models.weights_registry import get_registry
from models.zone_resolver import zone_from_device_id

log = logging.getLogger(__name__)


def _qoz_only_infer(_state_key: str) -> bool:
    source = (settings.WEIGHTS_SOURCE or "").strip().lower()
    if source != "qoz":
        return False
    if settings.QOZ_AUX_MODELS:
        return False
    return True


def analyze_bgr_to_vision_dto(
    bgr: np.ndarray,
    state_key: Optional[str] = None,
    device_id: Optional[str] = None,
    session_id: Optional[str] = None,
    camera_id: int = 0,
    zone: Optional[str] = None,
    run_all_specialized: bool | None = None,
) -> Dict[str, Any]:
    if bgr is None or bgr.size == 0:
        raise ValueError("empty frame")
    sk = state_key or resolve_state_key(device_id=device_id, session_id=session_id, camera_id=camera_id)
    infer_frame, frame_h = infer_frame_bgr(bgr)
    from core.processor import video_processor
    od = video_processor.object_detector
    at = video_processor.action_tracker
    if od is None or at is None:
        raise RuntimeError("Vision models unavailable")
    run_all = settings.RUN_ALL_SPECIALIZED if run_all_specialized is None else run_all_specialized
    registry = get_registry()
    cam_zone = registry.zone_for_camera(camera_id)
    resolved_zone = zone_from_device_id(device_id, camera_zone=zone or cam_zone)
    qoz_only = _qoz_only_infer(sk)
    frame_index = 0 if qoz_only else heuristics_engine.advance_frame(sk)
    base_public: list[dict] = []
    base_heur: list[dict] = []
    analysis: dict[str, Any] = {"actions": [], "engagement_index": 0.0, "stats": {}, "pose_items": []}
    heur_dets: list[dict] = []
    if not qoz_only:
        try:
            base_public, base_heur = od.run_base(infer_frame)
        except Exception as e:
            log.exception("base detect failed")
            raise RuntimeError(str(e) or "base detect failed") from e
        try:
            analysis = at.analyze_frame(infer_frame)
        except Exception as e:
            log.exception("pose analyze failed")
            raise RuntimeError(str(e) or "pose analyze failed") from e
        try:
            heur_dets = heuristics_engine.run(
                base_heur,
                analysis,
                sk,
                frame_index,
                zone=resolved_zone,
                frame_h=frame_h,
            )
        except Exception as e:
            log.exception("heuristics failed")
            raise RuntimeError(str(e) or "heuristics failed") from e
    try:
        spec_dets = registry.run_specialized(
            infer_frame,
            conf=settings.DETECTION_CONF,
            camera_id=camera_id,
            run_all=run_all,
            frame_index=frame_index,
            state_key=sk,
        )
    except Exception as e:
        log.exception("specialized failed")
        raise RuntimeError(str(e) or "specialized failed") from e
    detections = list(base_public) + list(heur_dets) + list(spec_dets)
    for d in detections:
        if "qoz_incident" not in d:
            from models.incident_labels import DETECTION_TO_QOZ_INCIDENT
            d["qoz_incident"] = DETECTION_TO_QOZ_INCIDENT.get(d.get("label", ""), d.get("label", ""))
    return {
        "detections": detections,
        "actions": analysis.get("actions") or [],
        "engagement": float(analysis.get("engagement_index", 0.0)),
        "stats": analysis.get("stats"),
        "meta": {
            "state_key": sk,
            "frame_index": frame_index,
            "rotate_group": "A" if frame_index % 2 == 0 else "B",
            "zone": resolved_zone,
            "qoz_only": qoz_only,
            "infer_shape": [int(infer_frame.shape[1]), int(infer_frame.shape[0])],
        },
    }


def encode_small_jpeg_bytes(bgr: np.ndarray, quality: int = 90) -> bytes:
    return encode_jpeg_bytes(bgr, quality=quality)
