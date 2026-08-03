from typing import Optional


def resolve_state_key(
    device_id: Optional[str] = None,
    session_id: Optional[str] = None,
    camera_id: Optional[int] = None,
) -> str:
    dev = (device_id or "").strip()
    if dev and dev != "-":
        return dev
    if camera_id is not None and camera_id > 0:
        return f"cam:{camera_id}"
    sess = (session_id or "").strip()
    if sess and sess != "-":
        return f"session:{sess}"
    return "default"
