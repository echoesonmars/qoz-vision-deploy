from pathlib import Path
from typing import Optional

from ultralytics import YOLO

from core.config import settings
from models.incident_labels import DETECTION_TO_QOZ_INCIDENT
from models.weights_registry import get_registry


class ObjectDetector:
    def __init__(self):
        self.registry = get_registry()
        self.use_base_detect = settings.USE_BASE_DETECT
        self.base_model: Optional[YOLO] = None
        if self.use_base_detect:
            base_path = self.registry.base_detect_model_path()
            if not Path(base_path).is_file():
                base_path = "yolo11m.pt"
            self.base_model = YOLO(str(base_path))
        self.conf = settings.DETECTION_CONF
        self.imgsz = max(320, int(settings.INFERENCE_IMGSZ))
        print(f"ObjectDetector: {self.registry.status()}")

    def run_base(self, frame) -> tuple[list[dict], list[dict]]:
        public: list[dict] = []
        heuristics_input: list[dict] = []
        if not self.use_base_detect or self.base_model is None:
            return public, heuristics_input
        results = self.base_model(frame, conf=settings.DETECTION_CONF, verbose=False, imgsz=self.imgsz)
        for r in results:
            boxes = r.boxes
            if boxes is None:
                continue
            for box in boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                label = "unknown"
                if cls_id == 0:
                    label = "person"
                elif cls_id == 67:
                    label = "phone"
                elif cls_id in [24, 26, 28]:
                    label = "baggage"
                if label == "unknown":
                    continue
                qoz = DETECTION_TO_QOZ_INCIDENT.get(label, label)
                row = {
                    "label": label,
                    "qoz_incident": qoz,
                    "confidence": conf,
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "source_model": "yolo11m",
                }
                heuristics_input.append(row)
                if label != "phone":
                    public.append(row)
        return public, heuristics_input

    def count_people(self, detections):
        return sum(1 for d in detections if d.get("label") == "person")
