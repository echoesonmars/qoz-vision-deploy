from __future__ import annotations

import cv2
import numpy as np


def infer_frame_bgr(bgr: np.ndarray) -> tuple[np.ndarray, int]:
    if bgr is None or bgr.size == 0:
        raise ValueError("empty frame")
    return bgr, int(bgr.shape[0])


def encode_jpeg_bytes(bgr: np.ndarray, quality: int = 90, max_width: int = 1280) -> bytes:
    h, w = bgr.shape[:2]
    out = bgr
    if w > max_width:
        scale = max_width / w
        out = cv2.resize(
            bgr,
            (max_width, max(1, int(round(h * scale)))),
            interpolation=cv2.INTER_AREA,
        )
    ok, buf = cv2.imencode(".jpg", out, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
    if not ok:
        raise RuntimeError("jpeg encode failed")
    return buf.tobytes()
