from typing import Optional


def zone_from_device_id(device_id: Optional[str], camera_zone: Optional[str] = None) -> str:
    if camera_zone:
        z = camera_zone.strip().lower()
        if z in ("classroom", "corridor", "entrance", "street"):
            return z
    raw = (device_id or "").strip().lower()
    if not raw or raw == "-":
        return "classroom"
    if "street" in raw or "outdoor" in raw or "yard" in raw or "fence" in raw:
        return "street"
    if "corridor" in raw or "hall" in raw or "hallway" in raw:
        return "corridor"
    if "entrance" in raw or "gate" in raw or "anpr" in raw:
        return "entrance"
    if "class" in raw or "room" in raw or "lesson" in raw:
        return "classroom"
    return "classroom"
