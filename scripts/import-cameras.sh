#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1}"
IN_FILE="${2:-cameras-backup.json}"

if [[ ! -f "$IN_FILE" ]]; then
  echo "Missing file: $IN_FILE"
  exit 1
fi

python3 - "$BASE_URL" "$IN_FILE" <<'PY'
import json, sys, urllib.request, urllib.error

base = sys.argv[1].rstrip("/")
path = sys.argv[2]

with open(path, encoding="utf-8") as f:
    doc = json.load(f)

cameras = doc.get("cameras") if isinstance(doc, dict) else doc
if not isinstance(cameras, list):
    raise SystemExit("JSON must be {\"cameras\": [...]} or a list")

ok = 0
skip = 0
fail = 0

for cam in cameras:
    body = json.dumps(cam, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        f"{base}/backend/api/cameras",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            data = json.loads(res.read().decode("utf-8"))
            name = (data.get("camera") or {}).get("name") or cam.get("name")
            print(f"OK  {cam.get('equipmentId')} ch={cam.get('channel')} {name}")
            ok += 1
    except urllib.error.HTTPError as e:
        text = e.read().decode("utf-8", errors="replace")
        if e.code in (409, 400) and ("unique" in text.lower() or "duplicate" in text.lower() or "already" in text.lower()):
            print(f"SKIP {cam.get('equipmentId')} ch={cam.get('channel')} ({e.code})")
            skip += 1
        else:
            print(f"FAIL {cam.get('equipmentId')} ch={cam.get('channel')} ({e.code}) {text}")
            fail += 1
    except Exception as e:
        print(f"FAIL {cam.get('equipmentId')} ch={cam.get('channel')} {e}")
        fail += 1

print(f"done: ok={ok} skip={skip} fail={fail}")
if fail:
    raise SystemExit(1)
PY
