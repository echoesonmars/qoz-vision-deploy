import fs from "fs";
import path from "path";

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && !["node_modules", ".next", ".git"].includes(ent.name)) {
      walk(p, files);
    } else if (/\.(tsx?|jsx?)$/.test(ent.name)) {
      files.push(p);
    }
  }
  return files;
}

const replacements = [
  [/from "@\/lib\/people\/students-mock"/g, 'from "@/lib/data/stubs/people/students-mock"'],
  [/from "@\/lib\/people\/teachers-mock"/g, 'from "@/lib/data/stubs/people/teachers-mock"'],
  [/from "@\/lib\/people\/parents-mock"/g, 'from "@/lib/data/stubs/people/parents-mock"'],
  [/from "@\/lib\/people\/classes-mock"/g, 'from "@/lib/data/stubs/people/classes-mock"'],
  [/from "@\/lib\/checks\/bank-mock"/g, 'from "@/lib/data/stubs/checks/bank-mock"'],
  [/from "@\/lib\/checks\/archive-mock"/g, 'from "@/lib/data/stubs/checks/archive-mock"'],
  [/from "@\/lib\/checks\/status-mock"/g, 'from "@/lib/data/stubs/checks/status-mock"'],
  [/from "@\/lib\/dashboard\/knowledge-map-mock"/g, 'from "@/lib/data/stubs/dashboard/knowledge-map-mock"'],
  [/from "@\/lib\/dashboard\/forecasts-mock"/g, 'from "@/lib/data/stubs/dashboard/forecasts-mock"'],
  [/from "@\/lib\/dashboard\/summary-mock"/g, 'from "@/lib/data/stubs/dashboard/summary-mock"'],
  [/from "@\/lib\/cameras\/engagement-history-mock"/g, 'from "@/lib/data/stubs/cameras/engagement-history-mock"'],
  [/from "@\/lib\/analytics\/mock\/filters"/g, 'from "@/lib/data/stubs/analytics/filters"'],
  [/from "@\/lib\/analytics\/mock"/g, 'from "@/lib/data/stubs/analytics/index"'],
  [/from "@\/lib\/exports\/export-options-mock"/g, 'from "@/lib/data/stubs/exports/export-options-mock"'],
  [/from "@\/lib\/integrations\/mock"/g, 'from "@/lib/data/stubs/integrations/index"'],
];

let count = 0;
for (const file of walk(".")) {
  if (file.includes(`${path.sep}lib${path.sep}data${path.sep}`)) continue;
  const src = fs.readFileSync(file, "utf8");
  let next = src;
  for (const [re, rep] of replacements) {
    next = next.replace(re, rep);
  }
  if (next !== src) {
    fs.writeFileSync(file, next);
    count += 1;
  }
}

console.log(`Updated ${count} files`);
