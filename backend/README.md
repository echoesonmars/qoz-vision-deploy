# Qoz Vision Prod Backend

Слой автоматизации на **Fastify** для деплоя на **Railway**. Postgres и Storage — **Supabase**. Фронтенд: [qoz-vision-prod-web](../qoz-vision-prod-web). Анализ кадров и видео — через **[qoz-vision](../qoz-vision)** (Python/YOLO).

## Граница ответственности

| Компонент | Next.js | Этот бэкенд (Railway) |
|-----------|---------|------------------------|
| Auth, сессии | да | нет |
| `GET/POST /api/incidents`, upload, signed-url | да | нет |
| ИИ-анализ видео после загрузки | триггер | `POST /api/incidents/analyze` → qoz-vision |
| Прямой эфир, оверлей | клиент | `WSS /api/live` (mock overlay) |
| Live-снапшоты с HLS | UI | ingest → qoz-vision `POST /api/analyze/frame` |
| Телеметрия устройств | UI | `GET /api/devices/fleet` |

## Быстрый старт

```bash
cp .env.example .env
# DATABASE_URL, SUPABASE_S3_*, BACKEND_INTERNAL_SECRET, VISION_LIVE_URL=http://localhost:8000

npm install
npm run dev
```

Проверка: `curl http://localhost:8080/health`

Подробные контракты API: [docs/API.md](docs/API.md)

## Переменные окружения

См. [.env.example](.env.example). Обязательны: `DATABASE_URL`, `SUPABASE_S3_*`, `BACKEND_INTERNAL_SECRET` (≥16 символов), `VISION_LIVE_URL`.

`BACKEND_INTERNAL_SECRET` — тот же ключ в `qoz-vision-prod-web`.

## Деплой Railway

1. Deploy from repo `qoz-vision-prod-backend`
2. Variables из `.env.example`
3. `HOST=0.0.0.0`, не задавайте `PORT` вручную
4. В `qoz-vision-prod-web`:
   - `BACKEND_URL=https://<railway-host>`
   - `BACKEND_INTERNAL_SECRET=...`
   - `NEXT_PUBLIC_STREAM_WS_URL=wss://<railway-host>/api/live`
   - `NEXT_PUBLIC_BACKEND_URL=https://<railway-host>`

## Стек

- Fastify 5, `@fastify/cors`, `@fastify/websocket`
- Postgres (`postgres`), Supabase S3 (`@aws-sdk/client-s3`)
- qoz-vision (HTTP) для анализа кадров и инцидентов

## Схема БД

Таблица `public.incidents` — `qoz-vision-prod-web/db/incidents.sql` (`npm run db:incidents`).
