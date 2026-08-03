import asyncio
import logging
import os
import tempfile
import time
import uuid
from typing import Optional

from fastapi import APIRouter, File, Header, HTTPException, UploadFile

from core.config import settings
from core.video_qoz_analyze import analyze_video_path_qoz

log = logging.getLogger(__name__)

router = APIRouter(tags=["video"])

MAX_VIDEO_BYTES = settings.VIDEO_ANALYZE_MAX_BYTES
_video_sem = asyncio.Semaphore(max(1, settings.VISION_VIDEO_MAX_CONCURRENT))


def _parse_bool_header(value: Optional[str], default: bool) -> bool:
    if value is None or not str(value).strip():
        return default
    v = str(value).strip().lower()
    return v in ("1", "true", "yes", "on")


def _parse_float_header(value: Optional[str], default: float) -> float:
    if value is None or not str(value).strip():
        return default
    try:
        return float(str(value).strip())
    except ValueError:
        return default


def _parse_int_header(value: Optional[str], default: int) -> int:
    if value is None or not str(value).strip():
        return default
    try:
        return int(str(value).strip())
    except ValueError:
        return default


def _analyze_video_sync(
    raw: bytes,
    suffix: str,
    all_frames: bool,
    sample_fps: float,
    max_frames: int,
) -> tuple[dict, int]:
    fd, tmp_path = tempfile.mkstemp(suffix=suffix)
    os.close(fd)
    try:
        with open(tmp_path, "wb") as f:
            f.write(raw)
        payload = analyze_video_path_qoz(
            tmp_path,
            all_frames=all_frames,
            sample_fps=sample_fps,
            max_frames=max_frames,
        )
        return payload, len(raw)
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


@router.post("/analyze/video")
async def analyze_video(
    file: UploadFile = File(...),
    x_vision_internal_secret: Optional[str] = Header(None, alias="X-Vision-Internal-Secret"),
    x_request_id: Optional[str] = Header(None, alias="X-Request-Id"),
    x_all_frames: Optional[str] = Header(None, alias="X-All-Frames"),
    x_sample_fps: Optional[str] = Header(None, alias="X-Sample-Fps"),
    x_max_frames: Optional[str] = Header(None, alias="X-Max-Frames"),
):
    started = time.perf_counter()
    req_id = (x_request_id or "").strip() or str(uuid.uuid4())
    secret = (settings.VISION_INTERNAL_SECRET or "").strip()
    if secret and (x_vision_internal_secret or "").strip() != secret:
        raise HTTPException(status_code=401, detail="Invalid vision internal secret")

    raw = await file.read()
    size = len(raw)
    if size == 0:
        raise HTTPException(status_code=400, detail="Empty body")
    if size > MAX_VIDEO_BYTES:
        raise HTTPException(status_code=413, detail="Video exceeds size limit")

    all_frames = _parse_bool_header(x_all_frames, True)
    sample_fps = _parse_float_header(x_sample_fps, 1.0)
    max_frames = _parse_int_header(x_max_frames, 0)

    filename = (file.filename or "video.mp4").lower()
    suffix = ".mp4"
    for ext in (".mp4", ".mov", ".mkv", ".webm", ".avi"):
        if filename.endswith(ext):
            suffix = ext
            break

    async with _video_sem:
        try:
            payload, _size2 = await asyncio.to_thread(
                _analyze_video_sync,
                raw,
                suffix,
                all_frames,
                sample_fps,
                max_frames,
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e
        except RuntimeError as e:
            msg = str(e)
            if "unavailable" in msg.lower():
                raise HTTPException(status_code=503, detail=msg) from e
            raise HTTPException(status_code=500, detail=msg) from e

    ms = (time.perf_counter() - started) * 1000.0
    meta = payload.get("meta") or {}
    meta["duration_ms"] = ms
    payload["meta"] = meta
    log.info(
        "video_analyze ok request_id=%s bytes=%s duration_ms=%.1f analyzed_frames=%s decoded_frames=%s",
        req_id,
        size,
        ms,
        meta.get("analyzed_frames"),
        meta.get("frame_count"),
    )
    return payload
