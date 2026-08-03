import postgres from "postgres";
import { randomUUID, randomBytes, scryptSync } from "node:crypto";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function run() {
  const args = process.argv.slice(2);
  let email = "";
  let name = "";
  let org = "";
  let password = "";

  for (const arg of args) {
    if (arg.startsWith("--email=")) email = arg.split("=")[1];
    if (arg.startsWith("--name=")) name = arg.split("=")[1];
    if (arg.startsWith("--org=")) org = arg.split("=")[1];
    if (arg.startsWith("--password=")) password = arg.split("=")[1];
  }

  if (!email || !org || !password) {
    console.error("Использование: node create-director.js --email=EMAIL --org=\"Организация\" --password=PASSWORD [--name=\"Имя\"]");
    process.exit(1);
  }

  name = name || `Директор (${org})`;

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL не установлена!");
    process.exit(1);
  }

  const sql = postgres(url);

  try {
    // 1. Создаем таблицу public.users если отсутствует
    await sql`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'director',
        organization_name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const userId = randomUUID();
    const passwordHash = hashPassword(password);

    await sql`
      INSERT INTO public.users (id, email, password_hash, name, role, organization_name)
      VALUES (${userId}, ${email}, ${passwordHash}, ${name}, 'director', ${org})
      ON CONFLICT (email) DO UPDATE SET
        password_hash = ${passwordHash},
        name = ${name},
        role = 'director',
        organization_name = ${org};
    `;

    console.log(`✅ Пользователь ${email} успешно создан/обновлен с ролью 'director' и привязкой к '${org}'!`);
  } catch (err) {
    console.error("❌ Ошибка при создании директора:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

run();
