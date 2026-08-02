import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const FONT_DIR = path.join(ROOT, "lib", "exports", "fonts");
const PUBLIC_DIR = path.join(ROOT, "public", "fonts");

const FILES = [
  {
    name: "NotoSans-Regular.ttf",
    url: "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
  },
  {
    name: "NotoSans-Bold.ttf",
    url: "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf",
  },
];

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await mkdir(FONT_DIR, { recursive: true });
  await mkdir(PUBLIC_DIR, { recursive: true });
  for (const file of FILES) {
    const bytes = await download(file.url);
    await writeFile(path.join(FONT_DIR, file.name), bytes);
    await writeFile(path.join(PUBLIC_DIR, file.name), bytes);
    console.log(`OK ${file.name} (${bytes.length} bytes)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
