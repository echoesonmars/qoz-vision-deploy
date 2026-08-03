from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Set
import asyncio
import json

from utils.alerts import alert_system

router = APIRouter()

class StudentAttendance(BaseModel):
    student_id: str
    name: str
    grade: str
    is_expected_today: bool

class AttendanceData(BaseModel):
    students: List[StudentAttendance]
    date: str

expected_attendance = []

class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

@router.post("/attendance")
async def update_attendance(data: AttendanceData):
    global expected_attendance
    expected_attendance = data.students
    alert_system.trigger_alert(
        camera_id=0,
        alert_type="system",
        message=f"Received attendance sync: {len(data.students)} expected",
        severity="info"
    )
    await manager.broadcast({
        "type": "attendance_update",
        "expected_count": len(expected_attendance)
    })
    return {"status": "success", "message": f"Updated expected attendance for {len(data.students)} students"}

@router.get("/attendance/current")
async def get_current_attendance():
    return {"expected_attendance": expected_attendance}

@router.get("/alerts")
async def get_alerts():
    return {"alerts": alert_system.get_latest_alerts()}

@router.get("/models/status")
async def models_status():
    from models.weights_registry import get_registry
    return get_registry().status()

# Video stream generator
async def frame_generator(camera_id: int):
    from core.processor import video_processor
    while True:
        frame_bytes = video_processor.latest_frames.get(camera_id)
        if frame_bytes:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        await asyncio.sleep(0.04) # 25 FPS stream speed

@router.get("/video_feed/{camera_id}")
async def video_feed(camera_id: int):
    """MJPEG stream for a camera."""
    return StreamingResponse(
        frame_generator(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_text(json.dumps({
            "type": "initial",
            "alerts": alert_system.get_latest_alerts(),
            "expected_count": len(expected_attendance)
        }))
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
