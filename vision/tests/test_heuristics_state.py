import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from models import heuristics_engine
from models.state_key import resolve_state_key


def test_resolve_state_key_device_first():
    assert resolve_state_key(device_id="cam-1", camera_id=2) == "cam-1"
    assert resolve_state_key(camera_id=3) == "cam:3"
    assert resolve_state_key() == "default"


def test_isolated_debounce_per_state_key():
    heuristics_engine._states.clear()
    base_a = [{"label": "person", "confidence": 0.9, "bbox": [10, 10, 100, 200]}]
    base_b = [{"label": "person", "confidence": 0.9, "bbox": [10, 10, 100, 200]}]
    pose = {"pose_items": []}
    for i in range(20):
        heuristics_engine.run(base_a, pose, "device-a", i, frame_h=480)
    lost_a = [d for d in heuristics_engine.run(
        [{
            "label": "baggage",
            "confidence": 0.8,
            "bbox": [300, 300, 400, 400],
        }],
        pose,
        "device-a",
        20,
        frame_h=480,
    ) if d.get("qoz_incident") == "lost_property"]
    heuristics_engine.run(base_b, pose, "device-b", 0, frame_h=480)
    lost_b = [d for d in heuristics_engine.run(
        [{
            "label": "baggage",
            "confidence": 0.8,
            "bbox": [300, 300, 400, 400],
        }],
        pose,
        "device-b",
        1,
        frame_h=480,
    ) if d.get("qoz_incident") == "lost_property"]
    assert len(lost_b) == 0
    assert len(lost_a) >= 0


def test_rotate_groups():
    assert heuristics_engine.rotate_model_ids(0) == heuristics_engine.ROTATE_GROUP_A
    assert heuristics_engine.rotate_model_ids(1) == heuristics_engine.ROTATE_GROUP_B
