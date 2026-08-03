# Qoz Vision

Local video analytics API for schools: multi-camera RTSP processing, YOLO detection, pose-based behavior alerts, attendance sync, and WebSocket updates.

Repository: https://github.com/echoesonmars/qoz-vision

## Project Structure
- `api/`: API router and WebSocket logic
- `core/`: Config and video processor
- `models/`: YOLO registry, detectors, pose tracker
- `weights/`: Model manifest (`.pt` files are local only, not in git)
- `scripts/download_weights.py`: Download base + Roboflow specialized weights
- `utils/`: Alert management
- `data/faces_db/`: Known faces for DeepFace

## Requirements
Python 3.9+ (Windows: install from [python.org](https://www.python.org/downloads/) and enable **Add to PATH**)

## Windows venv

Старый `venv` с Mac/Linux (`venv/bin/python`) на Windows не работает. Пересоздай:

```powershell
cd d:\edtech\qoz-vision
.\scripts\setup-venv.ps1
.\venv\Scripts\Activate.ps1
```

Вручную:

```powershell
cd d:\edtech\qoz-vision
Remove-Item -Recurse -Force venv
py -3 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## Installation & Setup
1. After venv is active:
   ```powershell
   pip install -r requirements.txt
   ```
2. Copy `.env.example` to `.env` and set `RTSP_URLS`, optional `ROBOFLOW_API_KEY`.
3. Download weights:
   ```powershell
   python scripts/download_weights.py --base-only
   python scripts/download_weights.py
   ```
   See [weights/README.md](weights/README.md). Check: `python scripts/download_weights.py --check-only`
4. Env (see `.env.example`):
   ```env
   WEIGHTS_DIR=weights
   EXTERNAL_SELECTED_DIR=weights/external/selected
   WEIGHTS_SOURCE=external
   MODEL_VARIANT=heavy
   ENABLED_MODELS=weapon,fire_smoke,fight,smoking
   RUNTIME_PROFILE=single_stream_optimized
   USE_BASE_DETECT=true
   SPECIALIZED_ROTATE_PER_FRAME=true
   SPECIALIZED_PER_FRAME_MAX=2
   STREAM_PROCESS_EVERY_NTH_FRAME=5
   VISION_FRAME_MAX_CONCURRENT=1
   DISABLE_BACKGROUND_STREAMS=true
   ```

   **Demo stack (~4 GB VRAM):** base `yolo11m` + `yolo11n-pose` + heuristics (phone, sleep, crowd, fall, baggage). Specialized heavy only for weapon, fire_smoke, fight, smoking — **2 models per frame** (rotate A: weapon+fire, B: fight+smoking). Per-device state: `X-Device-Id` / `cam:{id}`.

## Face Registration (Attendance)
To register students or wanted persons, place an image of their face in `data/faces_db/` named as `{first_name}_{last_name}.jpg` or `.png`. DeepFace will automatically compute embeddings for verification.
Example:
`data/faces_db/alex_smith.jpg`

## Running the Application

Windows:
```powershell
.\venv\Scripts\Activate.ps1
.\run.ps1
```

Linux / macOS:
```bash
chmod +x run.sh
./run.sh
```
The server will start on `http://localhost:8000`. API docs: `http://localhost:8000/docs`.

### Переключение Gemini ⇄ Python (demo stack)

Скрипты в корне monorepo `edtech/scripts/`:

```powershell
cd d:\edtech
.\scripts\switch-vision-python.ps1
.\scripts\switch-live-python.ps1
```

Откат на Gemini: `.\scripts\switch-live-gemini.ps1` (перезапуск только backend).

Подробно: [LIVE_ANALYSIS_GEMINI_VS_PYTHON.md](../docs/LIVE_ANALYSIS_GEMINI_VS_PYTHON.md).

### Health / readiness

`GET /health` — `models_loaded`, наличие object detector и action tracker (удобно для k8s/Railway и для проверки из qoz-demo-backend).

### Docker

```bash
cd qoz-vision
docker compose up --build
```

Каталог `weights/` смонтируется read-only; перед запуском скачайте веса (см. README выше).

### Continuous live streams (RTSP / HLS)

Фоновый цикл в `core/processor.py` читает поток через OpenCV **непрерывно**. URL: `rtsp://...`, `https://.../index.m3u8`, `http://...`.

Список задаётся в **`RTSP_URLS`** и/или **`STREAM_URLS`** (через запятую). При обрыве живого потока — переподключение.

Частота инференса: **`STREAM_PROCESS_EVERY_NTH_FRAME`** (по умолчанию `3`; `1` — почти каждый кадр, выше нагрузка) и пауза **`STREAM_AFTER_FRAME_SLEEP_SEC`** после кадра.

Нужно **`DISABLE_BACKGROUND_STREAMS=false`**. Результат: MJPEG `/api/video_feed/{id}`, события по WebSocket.

Это **отдельно** от Plan A (`POST /api/analyze/frame` из Node): не включайте оба тяжёлых пути на один поток без необходимости.

### Model status
`GET /api/models/status` — which base/specialized `.pt` files are present on disk.

Status includes resolved runtime paths, active variant, source strategy, per-camera zones and intervals.

### Runtime profiles

`RUNTIME_PROFILE=single_stream_optimized`:
- priority order: `weapon, fire_smoke, fight, fall, sleep, phone_usage, smoking, crowd` (`anpr` off by default — add to `ENABLED_MODELS` when needed)
- works best for one live stream on laptop hardware.

`RUNTIME_PROFILE=multi_zone`:
- use `CAMERA_ZONE_MAP=1:classroom,2:corridor,3:entrance`
- zone presets:
  - `classroom`: `sleep, phone_usage, fight, smoking, fall, weapon, fire_smoke`
  - `corridor`: `crowd, fall, fight, weapon, fire_smoke`
  - `entrance`: `anpr, weapon, fire_smoke, crowd`

### Performance tuning for school demo

- Default `MODEL_VARIANT=small` with `WEIGHTS_SOURCE=external` (`weights/external/selected/*/small.pt`).
- Every frame runs all zone-active specialized models (`RUN_ALL_SPECIALIZED=true`).
- Tune `SPECIALIZED_INFERENCE_WORKERS` (default `4`) and `STREAM_PROCESS_EVERY_NTH_FRAME` if GPU/CPU is saturated.

### Live validation checklist

- `GET /health` returns `models_loaded: true`.
- `GET /api/models/status` shows `specialized_available` and `specialized_resolved`.
- `WEIGHTS_SOURCE=external` + `MODEL_VARIANT=small` resolves paths from `weights/external/selected`.
- No OOM and stable API latency during 10+ minute live run.

### Single-frame analysis (Plan A, raw DTO)

`POST /api/analyze/frame` — multipart field `file` (JPEG), max ~5 MB. Returns flat JSON for **Node** mapping, not `LiveAnalysisPayload`:

```json
{
  "detections": [{ "label", "qoz_incident", "confidence", "bbox", "source_model"? }],
  "actions": [{ "type", "bbox" }],
  "engagement": 87.2,
  "stats": { "looking_at_board", "sleeping", "total_students" }
}
```

Optional header `X-Vision-Internal-Secret` if `VISION_INTERNAL_SECRET` is set in `.env`. Does **not** push to `alert_system` or WebSocket (avoids duplicate alerts with RTSP loop).

Env: `DISABLE_BACKGROUND_STREAMS=true` — skip RTSP background tasks; models still load for this endpoint.

## API Documentation

### Update Expected Attendance
Sends list of students expected today:
`POST /api/attendance`
```json
{
  "date": "2026-05-19",
  "students": [
    {
      "student_id": "1001",
      "name": "Alex Smith",
      "grade": "10A",
      "is_expected_today": true
    }
  ]
}
```
