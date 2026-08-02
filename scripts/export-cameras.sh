#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1}"
OUT_FILE="${2:-cameras-backup.json}"

curl -fsS "${BASE_URL%/}/backend/api/cameras" | python3 - "$OUT_FILE" <<'PY'
import json, sys

out_file = sys.argv[1]
payload = json.load(sys.stdin)
rows = payload.get("raw") or []
cameras = []
for row in rows:
    cameras.append({
        "name": row.get("name") or "",
        "organizationName": row.get("organization_name") or "",
        "vendor": row.get("vendor") or "dahua",
        "nvrAddress": row.get("nvr_address") or "",
        "nvrPort": int(row.get("nvr_port") or 554),
        "username": row.get("username") or "",
        "password": row.get("password") or "",
        "channel": int(row.get("channel") or 1),
        "streamProfile": row.get("stream_profile") or "main",
        "transcodeToH264": bool(row.get("transcode_to_h264") or False),
        "rtspUrlOverride": row.get("rtsp_url_override"),
        "deviceType": row.get("device_type") or "XVR",
        "serialNo": row.get("serial_no") or "",
        "equipmentId": row.get("equipment_id") or "",
        "isEnabled": bool(row.get("is_enabled") if row.get("is_enabled") is not None else True),
        "sortIndex": int(row.get("sort_index") or row.get("channel") or 0),
    })

doc = {"version": 1, "cameras": cameras}
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(doc, f, ensure_ascii=False, indent=2)
    f.write("\n")
print(f"saved {len(cameras)} cameras -> {out_file}")
PY
