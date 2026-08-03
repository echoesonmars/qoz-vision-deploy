import asyncio
import cv2
from core.config import settings
from core.frame_inference import analyze_bgr_to_vision_dto
from models.object_detector import ObjectDetector
from models.action_tracker import ActionTracker
from models.incident_labels import INCIDENT_ALERT, DETECTION_TO_QOZ_INCIDENT
from models.state_key import resolve_state_key
from models.weights_registry import get_registry
from models.zone_resolver import zone_from_device_id
from utils.alerts import alert_system
from api.routes import manager

class VideoProcessor:
    def __init__(self):
        self.rtsp_urls = settings.RTSP_URLS.split(",")
        self.running = False
        self.latest_frames = {}
        try:
            self.object_detector = ObjectDetector()
            self.action_tracker = ActionTracker()
            print("Models loaded successfully.")
        except Exception as e:
            import traceback
            print(f"Error loading models: {e}. Falling back to mock processing mode.")
            traceback.print_exc()
            self.object_detector = None
            self.action_tracker = None

    def start(self):
        self.running = True

        def _parse_list(s: str):
            return [
                u.strip().strip('"').strip("'") for u in s.split(",") if u.strip()
            ]

        merged = _parse_list(settings.RTSP_URLS) + _parse_list(settings.STREAM_URLS)
        self.rtsp_urls = merged
        print(f"Parsed streams to process: {self.rtsp_urls}")
        for i, url in enumerate(self.rtsp_urls):
            asyncio.create_task(self._process_stream(url, i + 1))

    def stop(self):
        self.running = False

    def _trigger_detection_alert(self, camera_id: int, detection: dict):
        incident = detection.get("qoz_incident") or DETECTION_TO_QOZ_INCIDENT.get(detection.get("label", ""), detection.get("label"))
        if incident not in INCIDENT_ALERT:
            return
        alert_type, message, severity = INCIDENT_ALERT[incident]
        if incident == "crowd" and detection.get("message"):
            message = detection["message"]
        alert_system.trigger_alert(
            camera_id=camera_id,
            alert_type=alert_type,
            message=message,
            severity=severity,
        )

    def _trigger_action_alert(self, camera_id: int, action: dict):
        mapping = {
            "climbing_fence": "fence_climbing",
        }
        incident = mapping.get(action.get("type"))
        if incident and incident in INCIDENT_ALERT:
            alert_type, message, severity = INCIDENT_ALERT[incident]
            alert_system.trigger_alert(camera_id=camera_id, alert_type=alert_type, message=message, severity=severity)

    async def _process_stream(self, url, camera_id):
        print(f"Starting processing for camera {camera_id} ({url})...")

        def _is_live_stream(u: str) -> bool:
            x = u.strip().lower()
            return x.startswith("rtsp://") or x.startswith("http://") or x.startswith("https://")

        is_live_stream = _is_live_stream(url)
        n_every = max(1, settings.STREAM_PROCESS_EVERY_NTH_FRAME)
        post_sleep = max(0.0, settings.STREAM_AFTER_FRAME_SLEEP_SEC)

        cap = cv2.VideoCapture(url)
        frame_count = 0
        while self.running:
            if not cap.isOpened():
                await asyncio.sleep(5)
                cap = cv2.VideoCapture(url)
                continue
            ret, frame = cap.read()
            if not ret:
                if not is_live_stream:
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    continue
                await asyncio.sleep(2)
                cap.release()
                cap = cv2.VideoCapture(url)
                continue
            frame_count += 1
            if frame_count % n_every != 0:
                await asyncio.sleep(0.01)
                continue
            detections: list = []
            analysis: dict = {"actions": [], "engagement_index": 85.0, "stats": {}}
            try:
                reg = get_registry()
                dto = analyze_bgr_to_vision_dto(
                    frame,
                    state_key=resolve_state_key(camera_id=camera_id),
                    camera_id=camera_id,
                    zone=zone_from_device_id(None, camera_zone=reg.zone_for_camera(camera_id)),
                    run_all_specialized=True,
                )
                detections = dto.get("detections") or []
                analysis = {
                    "actions": dto.get("actions") or [],
                    "engagement_index": dto.get("engagement", 85.0),
                    "stats": dto.get("stats") or {},
                }
            except Exception:
                pass
            annotated_frame = frame.copy()
            for d in detections:
                x1, y1, x2, y2 = d["bbox"]
                label = d.get("qoz_incident", d["label"])
                conf = d["confidence"]
                color = (0, 255, 0) if label == "person" else (0, 0, 255) if label in ("phone", "phone_usage") else (0, 165, 255)
                cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(annotated_frame, f"{label} {conf:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            for act in analysis.get("actions", []):
                x1, y1, x2, y2 = act["bbox"]
                act_type = act["type"]
                cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (0, 0, 255), 3)
                cv2.putText(annotated_frame, f"ALERT: {act_type.upper()}", (x1, y1 - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            _, jpeg = cv2.imencode(".jpg", annotated_frame)
            self.latest_frames[camera_id] = jpeg.tobytes()
            people_count = sum(1 for d in detections if d.get("label") == "person")
            for d in detections:
                self._trigger_detection_alert(camera_id, d)
            for action in analysis.get("actions", []):
                self._trigger_action_alert(camera_id, action)
            stats = {
                "type": "camera_update",
                "camera_id": camera_id,
                "people_count": people_count,
                "engagement_index": round(analysis.get("engagement_index", 85.0), 1),
                "alerts": alert_system.get_latest_alerts(),
            }
            await manager.broadcast(stats)
            await asyncio.sleep(post_sleep)
        cap.release()

video_processor = VideoProcessor()
