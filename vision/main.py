import core.drive_paths  # noqa: F401
import core.torch_load  # noqa: F401

from fastapi import FastAPI
import uvicorn
from contextlib import asynccontextmanager

from core.config import settings
from api.routes import router as api_router
from api.frame_analyze import router as frame_analyze_router
from api.video_analyze import router as video_analyze_router
from api.transcribe import router as transcribe_router, transcribe_mode_label
from api.live_driver import router as live_driver_router, shutdown_all_drivers
from core.processor import video_processor

@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.DISABLE_BACKGROUND_STREAMS:
        video_processor.start()
    yield
    await shutdown_all_drivers()
    video_processor.stop()

app = FastAPI(title="Qoz Vision API", version="1.0.0", lifespan=lifespan)
app.include_router(api_router, prefix="/api")
app.include_router(frame_analyze_router, prefix="/api")
app.include_router(video_analyze_router, prefix="/api")
app.include_router(transcribe_router, prefix="/api")
app.include_router(live_driver_router, prefix="/api")

@app.get("/health")
async def health():
    od_ok = video_processor.object_detector is not None
    at_ok = video_processor.action_tracker is not None
    return {
        "ok": True,
        "models_loaded": od_ok and at_ok,
        "object_detector": od_ok,
        "action_tracker": at_ok,
        "transcribe_mode": transcribe_mode_label(),
    }

@app.get("/")
async def root():
    return {
        "service": "Qoz Vision",
        "docs": "/docs",
        "api": "/api",
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)
