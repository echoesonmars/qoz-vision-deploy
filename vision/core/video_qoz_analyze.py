from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import cv2

from core.config import settings
from models.incident_labels import DETECTION_TO_QOZ_INCIDENT
from models.qoz_unified_models import get_qoz_runner

log = logging.getLogger(__name__)


def _qoz_native_video_enabled() -> bool:
    source = (settings.WEIGHTS_SOURCE or "").strip().lower()
    return source == "qoz"


def _pick_frame(
    decoded_index: int,
    video_fps: float,
    all_frames: bool,
    sample_fps: float,
) -> bool:
    if all_frames:
        return True
    if sample_fps <= 0:
        return True
    if video_fps > 0:
        step = max(1, round(video_fps / sample_fps))
        return decoded_index % step == 0
    step = max(1, round(30.0 / sample_fps))
    return decoded_index % step == 0


def analyze_video_path_qoz(
    video_path: str | Path,
    *,
    all_frames: bool = True,
    sample_fps: float = 1.0,
    max_frames: int = 0,
    conf: float | None = None,
) -> dict[str, Any]:
    if not _qoz_native_video_enabled():
        raise ValueError("Native video analyze requires WEIGHTS_SOURCE=qoz")

    path = Path(video_path)
    if not path.is_file():
        raise ValueError("Video file not found")

    runner = get_qoz_runner()
    if not runner.available_ids:
        raise RuntimeError("No qoz models available")

    detection_conf = settings.DETECTION_CONF if conf is None else conf
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened():
        raise ValueError("Cannot open video")

    video_fps = float(cap.get(cv2.CAP_PROP_FPS) or 0.0)
    frames: list[dict[str, Any]] = []
    decoded_index = 0
    analyzed_count = 0
    cap_max = int(settings.VIDEO_ANALYZE_MAX_FRAMES or 0)
    effective_max = max_frames if max_frames > 0 else cap_max

    try:
        while True:
            ok, bgr = cap.read()
            if not ok:
                break
            if effective_max > 0 and analyzed_count >= effective_max:
                break
            if not _pick_frame(decoded_index, video_fps, all_frames, sample_fps):
                decoded_index += 1
                continue

            detections = runner.run_all(bgr, conf=detection_conf)
            for det in detections:
                if "qoz_incident" not in det:
                    label = str(det.get("label", ""))
                    det["qoz_incident"] = DETECTION_TO_QOZ_INCIDENT.get(label, label)

            frames.append(
                {
                    "detections": detections,
                    "actions": [],
                    "engagement": 0.0,
                }
            )
            analyzed_count += 1
            decoded_index += 1
    finally:
        cap.release()

    if analyzed_count == 0:
        raise ValueError("No frames decoded from video")

    return {
        "frames": frames,
        "meta": {
            "frame_count": decoded_index,
            "analyzed_frames": analyzed_count,
            "video_fps": video_fps,
            "mode": "native_qoz",
            "qoz_models": list(runner.available_ids),
            "detection_conf": detection_conf,
        },
    }
