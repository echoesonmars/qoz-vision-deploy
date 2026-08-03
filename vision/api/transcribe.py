import asyncio
import json
import os
import subprocess
import tempfile
import threading
from typing import List, Optional, Tuple

from fastapi import APIRouter, File, UploadFile

from core.config import settings

router = APIRouter()

TRANSCRIBE_STUB_SEGMENT_SEC = 30

STUB_TEXTS = [
    "Сәлеметсіздер ме, балалар. Бүгін сабақты бастаймыз.",
    "Итак, сегодня мы проходим новую тему. Откройте тетради.",
    "Формула дискриминанта записана на доске. Посмотрите внимательно.",
    "Теперь решайте задачи самостоятельно. Я пройду по рядам.",
    "Кто может ответить на вопрос? Поднимите руку.",
    "Отлично. Переходим к следующему примеру.",
    "Проверьте решение с соседом и обсудите ошибки.",
    "Внимание: на доске другой способ решения.",
    "Сделайте паузу. Запишите домашнее задание.",
    "Подведём итоги: что мы узнали сегодня?",
    "Домашнее задание: упражнения 12–15. До свидания.",
]

_whisper_model: Optional[object] = None
_whisper_lock = threading.Lock()


def resolve_transcribe_mode() -> str:
    mode = (settings.TRANSCRIBE_MODE or "auto").strip().lower()
    path = (settings.WHISPER_MODEL_PATH or "").strip()
    if mode == "auto":
        return "live" if path and os.path.isdir(path) else "stub"
    return mode


def transcribe_mode_label() -> str:
    mode = resolve_transcribe_mode()
    if mode == "live" and (settings.WHISPER_MODEL_PATH or "").strip():
        return "live"
    return "placeholder"


def _resolve_ffprobe() -> str:
    custom = os.environ.get("FFPROBE_PATH", "").strip()
    if custom:
        return custom
    ffmpeg = os.environ.get("FFMPEG_PATH", "ffmpeg").strip()
    if ffmpeg.endswith("ffmpeg.exe"):
        return ffmpeg.replace("ffmpeg.exe", "ffprobe.exe")
    if ffmpeg.endswith("ffmpeg"):
        return ffmpeg.replace("ffmpeg", "ffprobe")
    return "ffprobe"


def _probe_duration_sec(path: str) -> float:
    ffprobe = _resolve_ffprobe()
    proc = subprocess.run(
        [
            ffprobe,
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "json",
            path,
        ],
        capture_output=True,
        text=True,
        check=False,
    )
    if proc.returncode != 0:
        return 60.0
    try:
        data = json.loads(proc.stdout or "{}")
        value = float(data.get("format", {}).get("duration", 0))
        if value > 0:
            return value
    except (TypeError, ValueError, json.JSONDecodeError):
        pass
    return 60.0


def _stub_text(index: int, total: int) -> str:
    if index == 0:
        return STUB_TEXTS[0]
    if index >= total - 1:
        return STUB_TEXTS[-1]
    mid = int((index / max(total - 1, 1)) * (len(STUB_TEXTS) - 2))
    return STUB_TEXTS[min(mid + 1, len(STUB_TEXTS) - 2)]


def _build_stub_segments(duration_sec: float) -> List[dict]:
    segments: List[dict] = []
    start = 0.0
    index = 0
    total = max(1, int((duration_sec + TRANSCRIBE_STUB_SEGMENT_SEC - 1) // TRANSCRIBE_STUB_SEGMENT_SEC))
    while start < duration_sec:
        end = min(start + TRANSCRIBE_STUB_SEGMENT_SEC, duration_sec)
        lang = "kk" if index == 0 else "ru"
        segments.append(
            {
                "start_sec": round(start, 3),
                "end_sec": round(end, 3),
                "text": _stub_text(index, total),
                "language": lang,
            }
        )
        start = end
        index += 1
    return segments


def _get_whisper_model():
    global _whisper_model
    with _whisper_lock:
        if _whisper_model is not None:
            return _whisper_model
        from faster_whisper import WhisperModel

        model_path = (settings.WHISPER_MODEL_PATH or "").strip()
        if not model_path or not os.path.isdir(model_path):
            raise RuntimeError(f"WHISPER_MODEL_PATH missing or not a directory: {model_path!r}")

        device = (settings.WHISPER_DEVICE or "cuda").strip().lower()
        compute_type = (settings.WHISPER_COMPUTE_TYPE or "int8").strip()
        if device == "cuda":
            try:
                import torch

                if not torch.cuda.is_available():
                    device = "cpu"
                    compute_type = "int8"
            except ImportError:
                device = "cpu"

        _whisper_model = WhisperModel(model_path, device=device, compute_type=compute_type)
        return _whisper_model


def _transcribe_live(path: str) -> Tuple[float, List[dict]]:
    model = _get_whisper_model()
    segments_iter, info = model.transcribe(path, beam_size=5, vad_filter=True)
    segments: List[dict] = []
    for seg in segments_iter:
        segments.append(
            {
                "start_sec": round(float(seg.start), 3),
                "end_sec": round(float(seg.end), 3),
                "text": (seg.text or "").strip(),
                "language": info.language or "ru",
            }
        )
    duration = float(info.duration or 0.0)
    if duration <= 0 and segments:
        duration = segments[-1]["end_sec"]
    if duration <= 0:
        duration = _probe_duration_sec(path)
    return duration, segments


@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    content = await file.read()
    fd, tmp_path = tempfile.mkstemp(suffix=".wav", prefix="qoz-transcribe-")
    os.close(fd)
    with open(tmp_path, "wb") as f:
        f.write(content)
    try:
        mode = resolve_transcribe_mode()
        if mode == "live":
            try:
                duration_sec, segments = await asyncio.to_thread(_transcribe_live, tmp_path)
                return {
                    "placeholder": False,
                    "duration_sec": round(duration_sec, 3),
                    "segments": segments,
                }
            except Exception as exc:
                duration_sec = await asyncio.to_thread(_probe_duration_sec, tmp_path)
                segments = _build_stub_segments(duration_sec)
                return {
                    "placeholder": True,
                    "duration_sec": round(duration_sec, 3),
                    "segments": segments,
                    "error": str(exc)[:400],
                }

        duration_sec = await asyncio.to_thread(_probe_duration_sec, tmp_path)
        segments = _build_stub_segments(duration_sec)
        return {
            "placeholder": True,
            "duration_sec": round(duration_sec, 3),
            "segments": segments,
        }
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            pass
