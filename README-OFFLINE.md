# QOZ Offline

Полная пошаговая инструкция запуска: **[RUN.md](./RUN.md)**

Кратко:

1. Windows (есть интернет, Docker Desktop): `.\scripts\package-images.ps1`
2. Скопировать папку `qoz-offline` на сервер (внутри должен быть `dist/qoz-offline-images.tar`)
3. Сервер: `bash scripts/load-and-up.sh`
4. Браузер: `http://<IP>/` → регистрация → `/dashboard/cameras/manage`

Единые креды по всему стеку (Postgres, MinIO, камеры): логин `kap1c`, пароль `Qereq11@`.  
В `DATABASE_URL` пароль хранится как `Qereq11%40`.

Без Supabase. Без Python-анализа. Камеры в Postgres + MediaMTX. На офлайн-сервере ничего не билдим.
