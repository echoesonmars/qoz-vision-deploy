from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Any, Optional

from core.config import settings
from models.incident_labels import DETECTION_TO_QOZ_INCIDENT

BAGGAGE_LABELS = frozenset({"baggage", "backpack", "suitcase", "handbag"})
PERSON_LABELS = frozenset({"person"})
PHONE_LABELS = frozenset({"phone", "cell_phone"})

ROTATE_GROUP_A = frozenset({"weapon", "fire_smoke"})
ROTATE_GROUP_B = frozenset({"fight", "smoking"})


@dataclass
class HeuristicsState:
    frame_index: int = 0
    phone_streak: int = 0
    sleep_streak: int = 0
    crowd_streak: int = 0
    fall_streak: int = 0
    baggage_lonely_since: Optional[float] = None


_states: dict[str, HeuristicsState] = {}


def _get_state(state_key: str) -> HeuristicsState:
    key = (state_key or "default").strip() or "default"
    if key not in _states:
        _states[key] = HeuristicsState()
    return _states[key]


def advance_frame(state_key: str) -> int:
    st = _get_state(state_key)
    idx = st.frame_index
    st.frame_index += 1
    return idx


def rotate_group_index(frame_index: int) -> int:
    return frame_index % 2


def rotate_model_ids(frame_index: int) -> frozenset[str]:
    if rotate_group_index(frame_index) == 0:
        return ROTATE_GROUP_A
    return ROTATE_GROUP_B


def _center(bbox: list[int]) -> tuple[float, float]:
    x1, y1, x2, y2 = bbox
    return (x1 + x2) / 2.0, (y1 + y2) / 2.0


def _center_inside(inner: list[int], outer: list[int]) -> bool:
    cx, cy = _center(inner)
    x1, y1, x2, y2 = outer
    return x1 <= cx <= x2 and y1 <= cy <= y2


def _dist_px(a: list[int], b: list[int]) -> float:
    ax, ay = _center(a)
    bx, by = _center(b)
    return ((ax - bx) ** 2 + (ay - by) ** 2) ** 0.5


def _bbox_aspect(bbox: list[int]) -> float:
    x1, y1, x2, y2 = bbox
    w = max(1.0, float(x2 - x1))
    h = max(1.0, float(y2 - y1))
    return w / h


def _crowd_min_for_zone(zone: Optional[str]) -> int:
    z = (zone or "").strip().lower()
    if z == "classroom":
        return int(settings.HEUR_CROWD_MIN_CLASSROOM)
    if z == "corridor":
        return int(settings.HEUR_CROWD_MIN_CORRIDOR)
    return int(settings.HEUR_CROWD_MIN_DEFAULT)


def _filter_label(detections: list[dict], labels: frozenset[str]) -> list[dict]:
    out: list[dict] = []
    for d in detections:
        lab = str(d.get("label", "")).lower()
        if lab in labels:
            out.append(d)
    return out


def run(
    base_detections: list[dict],
    pose_result: dict[str, Any],
    state_key: str,
    frame_index: int,
    zone: Optional[str] = None,
    frame_h: int = 480,
) -> list[dict]:
    st = _get_state(state_key)
    out: list[dict] = []

    persons = _filter_label(base_detections, PERSON_LABELS)
    phones = _filter_label(base_detections, PHONE_LABELS)
    baggage = _filter_label(base_detections, BAGGAGE_LABELS)

    phone_hit = False
    phone_conf = 0.0
    phone_bbox: Optional[list[int]] = None
    for p in persons:
        pb = p.get("bbox") or []
        if len(pb) != 4:
            continue
        for ph in phones:
            hb = ph.get("bbox") or []
            if len(hb) != 4:
                continue
            if float(ph.get("confidence", 0)) >= settings.HEUR_PHONE_CONF and _center_inside(hb, pb):
                phone_hit = True
                phone_conf = max(phone_conf, float(ph.get("confidence", 0)))
                phone_bbox = hb
                break
        if phone_hit:
            break

    if phone_hit:
        st.phone_streak += 1
    else:
        st.phone_streak = 0
    if st.phone_streak >= settings.HEUR_PHONE_DEBOUNCE and phone_bbox is not None:
        out.append({
            "label": "phone_usage",
            "qoz_incident": DETECTION_TO_QOZ_INCIDENT["phone_usage"],
            "confidence": phone_conf,
            "bbox": phone_bbox,
            "source_model": "heuristic",
        })

    sleep_hit = False
    sleep_bbox: Optional[list[int]] = None
    sleep_conf = 0.72
    offset = float(settings.HEUR_SLEEP_Y_OFFSET)
    for item in pose_result.get("pose_items") or []:
        kp = item.get("keypoints")
        bbox = item.get("bbox") or []
        if kp is None or len(bbox) != 4:
            continue
        if len(kp) > 6:
            nose_y = float(kp[0][1])
            shoulders_y = (float(kp[5][1]) + float(kp[6][1])) / 2.0
            if nose_y > shoulders_y + offset:
                sleep_hit = True
                sleep_bbox = [int(x) for x in bbox]
                break

    if sleep_hit:
        st.sleep_streak += 1
    else:
        st.sleep_streak = 0
    if st.sleep_streak >= settings.HEUR_SLEEP_DEBOUNCE and sleep_bbox is not None:
        out.append({
            "label": "sleep",
            "qoz_incident": DETECTION_TO_QOZ_INCIDENT["sleep"],
            "confidence": sleep_conf,
            "bbox": sleep_bbox,
            "source_model": "heuristic",
        })

    crowd_min = _crowd_min_for_zone(zone)
    person_count = len(persons)
    if person_count >= crowd_min:
        st.crowd_streak += 1
    else:
        st.crowd_streak = 0
    if st.crowd_streak >= settings.HEUR_CROWD_DEBOUNCE and persons:
        best = max(persons, key=lambda d: float(d.get("confidence", 0)))
        out.append({
            "label": "crowd",
            "qoz_incident": DETECTION_TO_QOZ_INCIDENT["crowd"],
            "confidence": min(0.95, 0.5 + person_count * 0.03),
            "bbox": best.get("bbox") or [0, 0, 0, 0],
            "source_model": "heuristic",
            "message": f"{person_count} persons detected",
        })

    fall_hit = False
    fall_bbox: Optional[list[int]] = None
    fall_conf = 0.0
    aspect_min = float(settings.HEUR_FALL_ASPECT)
    for p in persons:
        bb = p.get("bbox") or []
        if len(bb) != 4:
            continue
        aspect = _bbox_aspect(bb)
        _, _, _, y2 = bb
        if aspect >= aspect_min and float(y2) >= frame_h * 0.72:
            fall_hit = True
            fall_bbox = [int(x) for x in bb]
            fall_conf = max(fall_conf, float(p.get("confidence", 0)))
    if fall_hit:
        st.fall_streak += 1
    else:
        st.fall_streak = 0
    if st.fall_streak >= settings.HEUR_FALL_DEBOUNCE and fall_bbox is not None:
        out.append({
            "label": "fall",
            "qoz_incident": DETECTION_TO_QOZ_INCIDENT["fall"],
            "confidence": fall_conf,
            "bbox": fall_bbox,
            "source_model": "heuristic",
        })

    near_px = int(settings.HEUR_BAGGAGE_NEAR_PX)
    baggage_lonely = False
    lonely_bbox: Optional[list[int]] = None
    lonely_conf = 0.0
    for bag in baggage:
        bb = bag.get("bbox") or []
        if len(bb) != 4:
            continue
        lonely = True
        for p in persons:
            pb = p.get("bbox") or []
            if len(pb) == 4 and _dist_px(bb, pb) <= near_px:
                lonely = False
                break
        if lonely:
            baggage_lonely = True
            lonely_bbox = [int(x) for x in bb]
            lonely_conf = max(lonely_conf, float(bag.get("confidence", 0)))

    now = time.monotonic()
    min_sec = float(settings.HEUR_BAGGAGE_MIN_SEC)
    if baggage_lonely and lonely_bbox is not None:
        if st.baggage_lonely_since is None:
            st.baggage_lonely_since = now
        elif now - st.baggage_lonely_since >= min_sec:
            out.append({
                "label": "baggage",
                "qoz_incident": DETECTION_TO_QOZ_INCIDENT["baggage"],
                "confidence": lonely_conf,
                "bbox": lonely_bbox,
                "source_model": "heuristic",
            })
    else:
        st.baggage_lonely_since = None

    return out
