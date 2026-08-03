from __future__ import annotations

import asyncio
import base64
import json
import logging
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from typing import Any, Dict, Optional

import cv2
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, ConfigDict, Field, field_validator

from core.config import settings
from core.frame_inference import analyze_bgr_to_vision_dto, encode_small_jpeg_bytes
from models.zone_resolver import zone_from_device_id

log = logging.getLogger(__name__)

router = APIRouter(tags=["live-driver"])

_drivers: Dict[str, asyncio.Task] = {}

MAX_INTERVAL_MS = 120_000


def _min_push_gap_ms() -> int:
    v = int(settings.LIVE_DRIVER_MIN_PUSH_GAP_MS or 250)
    return max(50, min(60_000, v))


class LiveDriverStartBody(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    session_id: str = Field(..., alias="sessionId", min_length=1)
    device_id: str = Field(..., alias="deviceId", min_length=1)
    hls_url: str = Field(..., alias="hlsUrl", min_length=8)
    started_at_iso: str = Field(..., alias="startedAtIso", min_length=10)
    interval_ms: int = Field(
        10_000,
        alias="intervalMs",
        ge=50,
        le=MAX_INTERVAL_MS,
    )

    @field_validator("interval_ms")
    @classmethod
    def _interval_floor(cls, v: int) -> int:
        lo = _min_push_gap_ms()
        if v < lo:
            raise ValueError(f"interval_ms must be >= {lo}")
        return v


class LiveDriverStopBody(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    device_id: str = Field(..., alias="deviceId", min_length=1)


def _check_ingest_secret(x: Optional[str]) -> None:
    secret = (settings.VISION_INTERNAL_SECRET or "").strip()
    if secret and (x or "").strip() != secret:
        raise HTTPException(status_code=401, detail="Invalid vision internal secret")


def _offset_sec(started_iso: str) -> int:
    s = started_iso.strip().replace("Z", "+00:00")
    try:
        start = datetime.fromisoformat(s)
    except ValueError:
        start = datetime.now(timezone.utc)
    if start.tzinfo is None:
        start = start.replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    return max(0, int((now - start).total_seconds()))


def _open_cap(url: str):
    return cv2.VideoCapture(url)


def _read_cap(cap) -> tuple:
    if not cap.isOpened():
        return False, None
    return cap.read()


def _post_snapshot_sync(
    payload: Dict[str, Any],
    timeout_sec: float,
) -> int:
    base = (settings.BACKEND_PUSH_URL or "").strip().rstrip("/")
    secret = (settings.BACKEND_INTERNAL_SECRET or "").strip()
    if not base or not secret:
        raise RuntimeError("BACKEND_PUSH_URL or BACKEND_INTERNAL_SECRET missing")
    url = f"{base}/api/live/internal/vision-ingest/snapshot"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "X-Backend-Secret": secret,
        },
    )
    with urllib.request.urlopen(req, timeout=timeout_sec) as resp:
        return int(resp.getcode())


async def shutdown_all_drivers() -> None:
    items = list(_drivers.items())
    _drivers.clear()
    for _, t in items:
        if not t.done():
            t.cancel()
    for _, t in items:
        try:
            await t
        except asyncio.CancelledError:
            pass


def _push_config_ok() -> bool:
    b = (settings.BACKEND_PUSH_URL or "").strip()
    s = (settings.BACKEND_INTERNAL_SECRET or "").strip()
    return bool(b and s)


async def _run_driver(
    device_id: str,
    session_id: str,
    hls_url: str,
    started_iso: str,
    interval_ms: int,
) -> None:
    push_timeout = float(settings.LIVE_DRIVER_PUSH_TIMEOUT_SEC or 90)
    dense = bool(getattr(settings, "LIVE_DRIVER_ANALYZE_EVERY_DECODE", False))
    yield_sleep = float(getattr(settings, "LIVE_DRIVER_LOOP_YIELD_SEC", 0.002) or 0.002)
    gap_sec = max(0.05, interval_ms / 1000.0)
    last_push_mono = 0.0
    cap = None
    try:
        cap = await asyncio.to_thread(_open_cap, hls_url)
        while True:
            ret, frame = await asyncio.to_thread(_read_cap, cap)
            if not ret or frame is None:
                await asyncio.sleep(2)
                if cap is not None:
                    await asyncio.to_thread(cap.release)
                cap = await asyncio.to_thread(_open_cap, hls_url)
                continue
            try:
                zone = zone_from_device_id(device_id)
                dto = await asyncio.to_thread(
                    lambda f=frame, d=device_id, s=session_id, z=zone: analyze_bgr_to_vision_dto(
                        f,
                        state_key=d,
                        device_id=d,
                        session_id=s,
                        zone=z,
                    ),
                )
            except Exception as e:
                log.warning("live_driver analyze fail device=%s: %s", device_id, e)
                await asyncio.sleep(min(5.0, gap_sec))
                continue
            now_mono = time.monotonic()
            if dense and (now_mono - last_push_mono) < gap_sec:
                await asyncio.sleep(yield_sleep)
                continue
            try:
                jpeg = await asyncio.to_thread(encode_small_jpeg_bytes, frame, 78)
            except Exception as e:
                log.warning("live_driver jpeg fail device=%s: %s", device_id, e)
                await asyncio.sleep(min(2.0, gap_sec))
                continue
            b64 = base64.standard_b64encode(jpeg).decode("ascii")
            body = {
                "sessionId": session_id,
                "deviceId": device_id,
                "sessionOffsetSec": _offset_sec(started_iso),
                "dto": dto,
                "frameJpegBase64": b64,
            }
            try:
                code = await asyncio.to_thread(_post_snapshot_sync, body, push_timeout)
                log.info(
                    "live_driver pushed device=%s session=%s http=%s off=%s",
                    device_id,
                    session_id,
                    code,
                    body["sessionOffsetSec"],
                )
                last_push_mono = time.monotonic()
            except urllib.error.HTTPError as e:
                log.warning(
                    "live_driver push HTTP %s device=%s: %s",
                    e.code,
                    device_id,
                    e.read().decode("utf-8", errors="replace")[:300],
                )
            except Exception as e:
                log.warning("live_driver push fail device=%s: %s", device_id, e)

            if dense:
                await asyncio.sleep(yield_sleep)
            else:
                await asyncio.sleep(gap_sec)
    except asyncio.CancelledError:
        log.info("live_driver cancelled device=%s", device_id)
        raise
    finally:
        if cap is not None:
            try:
                await asyncio.to_thread(cap.release)
            except Exception:
                pass


@router.post("/live-driver/sessions/start")
async def live_driver_start(
    body: LiveDriverStartBody,
    x_vision_internal_secret: Optional[str] = Header(None, alias="X-Vision-Internal-Secret"),
):
    _check_ingest_secret(x_vision_internal_secret)
    if not _push_config_ok():
        raise HTTPException(
            status_code=503,
            detail="BACKEND_PUSH_URL and BACKEND_INTERNAL_SECRET are required for live driver",
        )
    device_id = body.device_id
    old = _drivers.pop(device_id, None)
    if old is not None and not old.done():
        old.cancel()
        try:
            await old
        except asyncio.CancelledError:
            pass
    t = asyncio.create_task(
        _run_driver(
            device_id,
            body.session_id,
            body.hls_url,
            body.started_at_iso,
            body.interval_ms,
        ),
        name=f"live-driver-{device_id}",
    )
    _drivers[device_id] = t

    def _done(_t: asyncio.Task) -> None:
        if _drivers.get(device_id) is _t:
            _drivers.pop(device_id, None)

    t.add_done_callback(_done)
    return {"status": "started", "deviceId": device_id, "sessionId": body.session_id}


@router.post("/live-driver/sessions/stop")
async def live_driver_stop(
    body: LiveDriverStopBody,
    x_vision_internal_secret: Optional[str] = Header(None, alias="X-Vision-Internal-Secret"),
):
    _check_ingest_secret(x_vision_internal_secret)
    device_id = body.device_id
    t = _drivers.pop(device_id, None)
    if t is None or t.done():
        return {"status": "idle", "deviceId": device_id}
    t.cancel()
    try:
        await t
    except asyncio.CancelledError:
        pass
    return {"status": "stopped", "deviceId": device_id}
