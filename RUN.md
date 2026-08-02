# QOZ Offline — как запустить

Автономный стек: **web + backend + Postgres + MinIO + MediaMTX + nginx**.  
Без Supabase. Без интернета на сервере. Без Python-анализа — только то, что в папке `qoz-offline`.

---

## Что получится

| URL | Что |
|---|---|
| `http://<IP>/` | сайт (логин / регистрация) |
| `http://<IP>/dashboard/cameras/all` | список камер |
| `http://<IP>/dashboard/cameras/manage` | добавить / править / удалить камеры |
| `http://<IP>/dashboard/cameras/live` | прямой эфир |
| `http://<IP>/backend/health` | health бэкенда |

Камеры пишутся в локальный Postgres и сами появляются в MediaMTX. Пересобирать образ ради новой камеры **не нужно**.

---

## Единые креды

Везде по умолчанию один логин и пароль:

```
логин:  kap1c
пароль: Qereq11@
```

| Где | Логин | Пароль |
|---|---|---|
| Postgres (`POSTGRES_USER` / `POSTGRES_PASSWORD`) | `kap1c` | `Qereq11@` |
| MinIO root + S3 ключи | `kap1c` | `Qereq11@` |
| Камеры / NVR (значения по умолчанию в форме) | `kap1c` | `Qereq11@` |
| Первый пользователь сайта — создаёшь сам при регистрации | — | — |

В `DATABASE_URL` пароль обязан быть URL-энкоднутым: `Qereq11%40`.  
Поэтому в `.env` лежат обе формы:

```
POSTGRES_PASSWORD=Qereq11@
POSTGRES_PASSWORD_ENC=Qereq11%40
```

Меняешь пароль — меняй **обе** строки.

---

## Часть 1. Собрать пакет (Windows, есть интернет)

Нужен **Docker Desktop** (запущенный).

### 1.1 Открой PowerShell

```powershell
cd D:\edtech\qoz-offline
```

### 1.2 Проверь env (по желанию)

Файлы уже есть и заполнены кредами `kap1c` / `Qereq11@`:

- `.env` — Postgres / MinIO
- `.env.backend` — backend
- `.env.web` — web runtime

Ничего менять не нужно. Если всё-таки меняешь пароль — правь его в `.env` (обе строки: обычную и `_ENC`), `.env.backend`, `.env.web`.

### 1.3 Собери образы в один tar

```powershell
.\scripts\package-images.ps1
```

Скрипт:

1. `docker compose -f docker-compose.build.yml build` — соберёт `qoz-offline-web` и `qoz-offline-backend`
2. скачает `postgres`, `minio`, `nginx`, `mediamtx`
3. сохранит всё в `dist\qoz-offline-images.tar`

Жди. Если Docker Desktop не запущен — будет ошибка про `dockerDesktopLinuxEngine`.

### 1.4 Что везти на сервер

Готовый комплект находится здесь:

```text
D:\edtech\qoz-offline\dist\qoz-offline-deploy.tar
```

Это единый архив для сервера. Внутри находятся Docker-образы, compose, env, nginx, MediaMTX, миграции, скрипт запуска и инструкция.

Его состав:

```
qoz-offline/
├── dist/qoz-offline-images.tar     ← обязательно
├── docker-compose.offline.yml
├── mediamtx.yml
├── nginx/default.conf
├── .env
├── .env.backend
├── .env.web
├── scripts/load-and-up.sh
├── scripts/migrate.mjs
├── web/db/                         ← SQL миграции
└── README-OFFLINE.md / RUN.md
```

Образы `web/` и `backend/` исходников на сервере для запуска **не нужны** — они уже внутри tar.  
Но `web/db/` нужен для миграций (скрипт монтирует эту папку).

---

## Часть 2. Развернуть на сервере (можно без интернета)

Сервер: Ubuntu, Docker уже установлен, пользователь `tts` (или любой с доступом к docker).

### 2.1 Залей и распакуй архив

С Windows:

```powershell
scp D:\edtech\qoz-offline\dist\qoz-offline-deploy.tar tts@<TAILSCALE_IP>:~/
```

На сервере:

```bash
mkdir -p ~/qoz-offline
tar -xf ~/qoz-offline-deploy.tar -C ~/qoz-offline
```

### 2.2 Зайди по SSH

```powershell
ssh tts@<TAILSCALE_IP>
```

### 2.3 Запуск одной командой

```bash
cd ~/qoz-offline
sed -i 's/\r$//' scripts/load-and-up.sh
chmod +x scripts/load-and-up.sh
bash scripts/load-and-up.sh
```

Скрипт делает:

1. `docker load -i dist/qoz-offline-images.tar`
2. `docker compose -f docker-compose.offline.yml up -d`
3. ждёт Postgres
4. прогоняет миграции (`cameras`, users, incidents, live, …)
5. перезапускает backend (синк камер в MediaMTX)

### 2.4 Проверка

```bash
docker compose -f docker-compose.offline.yml ps
curl -s http://127.0.0.1/backend/health
curl -o /dev/null -w '%{http_code}\n' http://127.0.0.1/login
```

Нужно: контейнеры `Up`, health ок, login `200`/`307`/`302`.

---

## Часть 3. Первый вход и камеры

### 3.1 Открой в браузере

```
http://<IP-сервера>/
```

Зарегистрируй первого пользователя. Чтобы не плодить сущности — тот же пароль `Qereq11@`, email на своё усмотрение (например `kap1c@qoz.local`).

### 3.2 Добавь камеры

```
http://<IP-сервера>/dashboard/cameras/manage
```

Поля:

| Поле | Пример Dahua | Пример Hikvision |
|---|---|---|
| Vendor | `dahua` | `hikvision` |
| NVR IP | `192.168.0.101` | `192.168.11.200` |
| Логин | `kap1c` | `kap1c` |
| Пароль | `Qereq11@` | `Qereq11@` |
| Канал | `5` | `1` (= поток `101`) |
| Transcode H.265→H.264 | нет, если h264 | **да**, если hevc |

Логин и пароль уже подставлены в форму по умолчанию.  
Кнопка **Probe** — проверка потока через ffprobe.  
После **Добавить** камера сразу видна в «Все камеры» и в HLS.

### 3.3 Смотреть поток

```
http://<IP-сервера>/dashboard/cameras/all
http://<IP-сервера>/dashboard/cameras/live
```

---

## Часть 4. Ручной запуск (если скрипт не подошёл)

```bash
cd ~/qoz-offline

docker load -i dist/qoz-offline-images.tar

docker compose -f docker-compose.offline.yml up -d

# миграции
docker compose -f docker-compose.offline.yml --profile migrate run --rm migrate

docker compose -f docker-compose.offline.yml up -d --force-recreate backend nginx
```

Логи:

```bash
docker compose -f docker-compose.offline.yml logs -f backend
docker compose -f docker-compose.offline.yml logs -f mediamtx
docker compose -f docker-compose.offline.yml logs -f web
```

Остановка:

```bash
docker compose -f docker-compose.offline.yml down
```

Данные Postgres/MinIO в volumes **сохранятся**. Чтобы стереть всё:

```bash
docker compose -f docker-compose.offline.yml down -v
```

---

## Часть 5. Обновление без интернета на сервере

1. На Windows снова: `.\scripts\package-images.ps1`
2. Залей новый `dist/qoz-offline-images.tar` (+ изменённые compose/env если надо)
3. На сервере:

```bash
cd ~/qoz-offline
docker load -i dist/qoz-offline-images.tar
docker compose -f docker-compose.offline.yml up -d
docker compose -f docker-compose.offline.yml --profile migrate run --rm migrate
```

---

## Частые ошибки

| Симптом | Что делать |
|---|---|
| `dockerDesktopLinuxEngine` на Windows | Запусти Docker Desktop |
| `Connection timed out` SSH | `tailscale status` / `tailscale ping <IP>` |
| Сайт открыл по `:8080` и CORS | Открывай только `:80` (через nginx). API = `/backend` |
| `hls: 502` | `docker logs qoz-offline-mediamtx`, подожди 10–15 сек после открытия камеры |
| Камеры пустые после рестарта | Backend должен подняться и сделать sync; проверь `docker logs qoz-offline-backend` |
| Пароль с `@` в RTSP | В UI пиши как есть (`Qereq11@`) — в URL уйдёт как `%40` |
| `password authentication failed for user "kap1c"` | Том БД создан со старым паролем: `docker compose -f docker-compose.offline.yml down -v` и заново |
| Ошибка парсинга `DATABASE_URL` | Пароль в URL должен быть `Qereq11%40`, а не `Qereq11@` |
| `sed` / `chmod` «не найдено» | Ты в Windows PowerShell — эти команды только на Linux после `ssh` |

---

## Структура папки

```
qoz-offline/
├── web/                         # исходники фронта (для билда)
├── backend/                     # исходники бэкенда (для билда)
├── nginx/default.conf           # / → web, /backend → api, /hls → mediamtx
├── mediamtx.yml                 # api:yes, paths пустые (камеры из БД)
├── docker-compose.build.yml     # сборка на машине с интернетом
├── docker-compose.offline.yml   # запуск на сервере (только image:)
├── Dockerfile.web
├── .env / .env.backend / .env.web
├── scripts/
│   ├── package-images.ps1       # Windows → tar
│   ├── load-and-up.sh           # Linux → load + up + migrate
│   └── migrate.mjs
├── dist/qoz-offline-images.tar  # появляется после package-images
└── README-OFFLINE.md / RUN.md
```

---

## Коротко напарнику

1. На ПК с интернетом: `cd D:\edtech\qoz-offline` → `.\scripts\package-images.ps1`
2. Скопировать папку на сервер
3. На сервере: `bash scripts/load-and-up.sh`
4. Браузер: `http://<IP>/` → регистрация → `/dashboard/cameras/manage`

На сервере **не** запускаем `npm`, **не** делаем `docker compose build`, **не** нужен интернет.
