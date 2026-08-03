import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from models import heuristics_engine
from models.zone_resolver import zone_from_device_id


def test_phone_not_in_public_base():
    from models.object_detector import ObjectDetector
    od = ObjectDetector.__new__(ObjectDetector)
    od.use_base_detect = False
    od.base_model = None
    public, heur = od.run_base(None)
    assert public == [] and heur == []


def test_zone_from_device_id():
    assert zone_from_device_id("cam-corridor-1") == "corridor"
    assert zone_from_device_id("classroom_3") == "classroom"
    assert zone_from_device_id("-") == "classroom"
    assert zone_from_device_id(None) == "classroom"


def test_baggage_timestamp_trigger():
    heuristics_engine._states.clear()
    pose = {"pose_items": []}
    bag_frame = [{
        "label": "baggage",
        "confidence": 0.9,
        "bbox": [300, 300, 400, 400],
    }]
    st = heuristics_engine._get_state("t-bag")
    st.baggage_lonely_since = time.monotonic() - 11.0
    lost = heuristics_engine.run(bag_frame, pose, "t-bag", 0, zone="classroom")
    assert any(d.get("qoz_incident") == "lost_property" for d in lost)


def test_phone_only_via_heuristics_debounce():
    heuristics_engine._states.clear()
    person = {"label": "person", "confidence": 0.9, "bbox": [10, 10, 100, 200]}
    phone = {"label": "phone", "confidence": 0.9, "bbox": [40, 80, 60, 120]}
    pose = {"pose_items": []}
    for _ in range(2):
        out = heuristics_engine.run([person, phone], pose, "t-phone", 0)
        assert not any(d.get("qoz_incident") == "phone_usage" for d in out)
    out = heuristics_engine.run([person, phone], pose, "t-phone", 0)
    assert any(d.get("qoz_incident") == "phone_usage" for d in out)
