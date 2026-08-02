#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f dist/qoz-offline-images.tar ]]; then
  echo "Missing dist/qoz-offline-images.tar"
  exit 1
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example — edit passwords before production use"
fi

if [[ ! -f .env.backend ]]; then
  echo "Missing .env.backend"
  exit 1
fi

if [[ ! -f .env.web ]]; then
  echo "Missing .env.web"
  exit 1
fi

echo "Loading images..."
docker load -i dist/qoz-offline-images.tar

echo "Starting stack..."
docker compose -f docker-compose.offline.yml up -d

PG_USER="$(grep -E '^POSTGRES_USER=' .env | cut -d= -f2- | tr -d '\r')"
PG_DB="$(grep -E '^POSTGRES_DB=' .env | cut -d= -f2- | tr -d '\r')"
PG_USER="${PG_USER:-kap1c}"
PG_DB="${PG_DB:-qoz}"

echo "Waiting for postgres..."
for i in $(seq 1 30); do
  if docker compose -f docker-compose.offline.yml exec -T postgres pg_isready -U "$PG_USER" -d "$PG_DB" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo "Running migrations..."
docker compose -f docker-compose.offline.yml --profile migrate run --rm migrate

echo "Restarting backend to sync MediaMTX paths..."
docker compose -f docker-compose.offline.yml up -d --force-recreate backend

echo "Done."
echo "Open http://<server-ip>/ and register the first user."
echo "Cameras: http://<server-ip>/dashboard/cameras/manage"
