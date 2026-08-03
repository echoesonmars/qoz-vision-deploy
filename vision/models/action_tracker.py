import cv2
from pathlib import Path
from ultralytics import YOLO

from core.config import settings
from models.weights_registry import get_registry


class ActionTracker:
    def __init__(self):
        registry = get_registry()
        pose_path = registry.pose_model_path()
        if not Path(pose_path).is_file():
            pose_path = "yolo11n-pose.pt"
        self.pose_model = YOLO(str(pose_path))
        self.imgsz = max(320, int(settings.INFERENCE_IMGSZ))

    def analyze_frame(self, frame, fence_polygon=None):
        results = self.pose_model(frame, conf=0.5, verbose=False, imgsz=self.imgsz)
        actions = []
        pose_items = []
        engagement_stats = {"looking_at_board": 0, "sleeping": 0, "total_students": 0}
        for r in results:
            keypoints = r.keypoints
            boxes = r.boxes
            if keypoints is None or boxes is None:
                continue
            for kp, box in zip(keypoints.data, boxes.xyxy):
                engagement_stats["total_students"] += 1
                kp_arr = kp.cpu().numpy()
                x1, y1, x2, y2 = box.cpu().numpy()
                pose_items.append({
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "keypoints": kp_arr.tolist(),
                })
                if len(kp_arr) > 6:
                    nose_y = kp_arr[0][1]
                    shoulders_y = (kp_arr[5][1] + kp_arr[6][1]) / 2
                    if nose_y > shoulders_y:
                        engagement_stats["sleeping"] += 1
                    else:
                        engagement_stats["looking_at_board"] += 1
                if fence_polygon is not None and len(kp_arr) > 16:
                    l_foot = (int(kp_arr[15][0]), int(kp_arr[15][1]))
                    r_foot = (int(kp_arr[16][0]), int(kp_arr[16][1]))
                    if cv2.pointPolygonTest(fence_polygon, l_foot, False) >= 0 or cv2.pointPolygonTest(fence_polygon, r_foot, False) >= 0:
                        actions.append({"type": "climbing_fence", "bbox": [int(x1), int(y1), int(x2), int(y2)]})
        total = engagement_stats["total_students"]
        engagement_index = (engagement_stats["looking_at_board"] / total) * 100 if total > 0 else 0
        return {
            "actions": actions,
            "engagement_index": engagement_index,
            "stats": engagement_stats,
            "pose_items": pose_items,
        }
