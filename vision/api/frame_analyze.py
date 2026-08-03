import asyncio
import logging
import time
import uuid

import cv2
import numpy as np
from fastapi import APIRouter, File, Header, HTTPException, UploadFile
from typing import Any, Dict, Optional, Tuple

from core.config import settings
from core.frame_inference import analyze_bgr_to_vision_dto
from models.state_key import resolve_state_key
from models.zone_resolver import zone_from_device_id

log = logging.getLogger(__name__)

router = APIRouter(tags=["frame"])

MAX_FRAME_BYTES = 5 * 1024 * 1024

_frame_sem = asyncio.Semaphore(max(1, int(settings.VISION_FRAME_MAX_CONCURRENT)))


def _parse_run_all_specialized(header: Optional[str]) -> bool:
    v = (header or "").strip().lower()
    return v in ("1", "true", "yes", "on")


def _analyze_frame_bytes_sync(
    raw: bytes,
    req_id: str,
    session_id: str,
    device_id: str,
    run_all_specialized: bool,
    state_key: str,
    zone: str,
) -> Tuple[Dict[str, Any], int, int, int, bool]:
    size = len(raw)
    arr = np.frombuffer(raw, dtype=np.uint8)
    frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Invalid image bytes")
    try:
        payload = analyze_bgr_to_vision_dto(
            frame,
            state_key=state_key,
            device_id=device_id,
            session_id=session_id,
            zone=zone,
            run_all_specialized=run_all_specialized,
        )
    except Exception as e:
        log.exception("analyze failed request_id=%s", req_id)
        if isinstance(e, ValueError):
            raise
        raise RuntimeError(str(e) or "analyze failed") from e
    return (
        payload,
        size,
        len(payload["detections"]),
        len(payload["actions"]),
        run_all_specialized,
    )


@router.post("/analyze/frame")
async def analyze_frame(
    file: UploadFile = File(...),
    x_vision_internal_secret: Optional[str] = Header(None, alias="X-Vision-Internal-Secret"),
    x_request_id: Optional[str] = Header(None, alias="X-Request-Id"),
    x_session_id: Optional[str] = Header(None, alias="X-Session-Id"),
    x_device_id: Optional[str] = Header(None, alias="X-Device-Id"),
    x_camera_zone: Optional[str] = Header(None, alias="X-Camera-Zone"),
    x_run_all_specialized: Optional[str] = Header(None, alias="X-Run-All-Specialized"),
):
    started = time.perf_counter()
    req_id = (x_request_id or "").strip() or str(uuid.uuid4())
    session_id = (x_session_id or "").strip() or "-"
    device_id = (x_device_id or "").strip() or "-"
    secret = (settings.VISION_INTERNAL_SECRET or "").strip()
    if secret and (x_vision_internal_secret or "").strip() != secret:
        raise HTTPException(status_code=401, detail="Invalid vision internal secret")

    raw = await file.read()
    size = len(raw)
    if size == 0:
        raise HTTPException(status_code=400, detail="Empty body")
    if size > MAX_FRAME_BYTES:
        raise HTTPException(status_code=413, detail="Frame exceeds size limit")

    header_run_all = _parse_run_all_specialized(x_run_all_specialized)
    if (x_run_all_specialized or "").strip():
        run_all = header_run_all
    else:
        run_all = settings.RUN_ALL_SPECIALIZED

    state_key = resolve_state_key(device_id=device_id, session_id=session_id)
    header_zone = (x_camera_zone or "").strip() or None
    zone = zone_from_device_id(device_id if device_id != "-" else None, camera_zone=header_zone)

    async with _frame_sem:
        try:
            result = await asyncio.to_thread(
                _analyze_frame_bytes_sync,
                raw,
                req_id,
                session_id,
                device_id,
                run_all,
                state_key,
                zone,
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e
        except RuntimeError as e:
            msg = str(e)
            if "unavailable" in msg.lower():
                raise HTTPException(status_code=503, detail=msg) from e
            raise HTTPException(status_code=500, detail=msg) from e

    payload, _size2, det_n, act_n, run_all_flag = result
    ms = (time.perf_counter() - started) * 1000.0
    log.info(
        "frame_analyze ok request_id=%s session_id=%s device_id=%s bytes=%s duration_ms=%.1f detections=%s actions=%s run_all_specialized=%s",
        req_id,
        session_id,
        device_id,
        size,
        ms,
        det_n,
        act_n,
        run_all_flag,
    )
    return payload
