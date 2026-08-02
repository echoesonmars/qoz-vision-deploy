import fs from "fs";
import path from "path";

const directorDetailReplacements = [
  {
    pattern: /import \{ getClassDetail \} from "@\/lib\/director\/mock\/class-details";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bgetClassDetail\(/g, "directorDetailRepo.getClassDetail("),
  },
  {
    pattern: /import \{ getStudentDetail \} from "@\/lib\/director\/mock\/student-details";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bgetStudentDetail\(/g, "directorDetailRepo.getStudentDetail("),
  },
  {
    pattern: /import \{ getTeacherDetail \} from "@\/lib\/director\/mock\/teacher-details";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bgetTeacherDetail\(/g, "directorDetailRepo.getTeacherDetail("),
  },
  {
    pattern: /import \{ getTopicDetail \} from "@\/lib\/director\/mock\/topic-details";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bgetTopicDetail\(/g, "directorDetailRepo.getTopicDetail("),
  },
  {
    pattern:
      /import \{ getRoomDetail, ROOM_STATUS_LABELS \} from "@\/lib\/director\/mock\/room-details";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src
        .replace(/\bgetRoomDetail\(/g, "directorDetailRepo.getRoomDetail(")
        .replace(/\bROOM_STATUS_LABELS\b/g, "directorDetailRepo.getRoomStatusLabels()"),
  },
  {
    pattern: /import \{ getSecurityEvent \} from "@\/lib\/director\/mock\/security-events";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bgetSecurityEvent\(/g, "directorDetailRepo.getSecurityEvent("),
  },
  {
    pattern: /import \{ modoRisk9b \} from "@\/lib\/director\/mock\/modo-risk-9b";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) => src.replace(/\bmodoRisk9b\b/g, "directorDetailRepo.getModoRisk9b()"),
  },
  {
    pattern: /import \{ entForecastMock \} from "@\/lib\/director\/mock\/forecasts";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bentForecastMock\b/g, "directorDetailRepo.getEntForecast()"),
  },
  {
    pattern: /import \{ modoForecastMock \} from "@\/lib\/director\/mock\/forecasts";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bmodoForecastMock\b/g, "directorDetailRepo.getModoForecast()"),
  },
  {
    pattern: /import \{ mockMonitoringZones \} from "@\/lib\/director\/mock\/security-events";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bmockMonitoringZones\b/g, "directorDetailRepo.getMonitoringZones()"),
  },
  {
    pattern: /import \{ mockSecurityAuditLog \} from "@\/lib\/director\/mock\/security-events";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bmockSecurityAuditLog\b/g, "directorDetailRepo.getSecurityAuditLog()"),
  },
  {
    pattern: /import \{ ROUTINE_OPERATIONS_TOTAL \} from "@\/lib\/director\/mock\/teacher-load";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(
        /\bROUTINE_OPERATIONS_TOTAL\b/g,
        "directorDetailRepo.getRoutineOperationsTotal()",
      ),
  },
  {
    pattern: /import \{ ROOM_STATUS_LABELS \} from "@\/lib\/director\/mock\/room-details";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bROOM_STATUS_LABELS\b/g, "directorDetailRepo.getRoomStatusLabels()"),
  },
  {
    pattern: /import \{ mockRooms \} from "@\/lib\/director\/mock\/infrastructure";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) => src.replace(/\bmockRooms\b/g, "directorDetailRepo.getRooms()"),
  },
  {
    pattern: /import \{ mockMapIncidentPins \} from "@\/lib\/director\/mock\/zones";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bmockMapIncidentPins\b/g, "directorDetailRepo.getMapIncidentPins()"),
  },
  {
    pattern:
      /import \{ getRiskGroupStudents \} from "@\/lib\/director\/mock\/risk-group";\r?\nimport \{ DEFAULT_DIRECTOR_PERIOD \} from "@\/lib\/director\/mock\/periods";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src
        .replace(/\bDEFAULT_DIRECTOR_PERIOD\b/g, "directorDetailRepo.getDefaultPeriod()")
        .replace(
          /\bgetRiskGroupStudents\(/g,
          "directorDetailRepo.getRiskGroupStudents(",
        ),
  },
  {
    pattern:
      /import \{ buildDirectorTasks \} from "@\/lib\/director\/mock\/director-tasks";\r?\nimport \{ DEFAULT_DIRECTOR_PERIOD \} from "@\/lib\/director\/mock\/periods";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src
        .replace(/\bDEFAULT_DIRECTOR_PERIOD\b/g, "directorDetailRepo.getDefaultPeriod()")
        .replace(/\bbuildDirectorTasks\(/g, "directorDetailRepo.getDirectorTasks("),
  },
  {
    pattern:
      /import \{ buildAcademicQualityBlock \} from "@\/lib\/director\/mock\/academic-quality";\r?\nimport \{ DEFAULT_DIRECTOR_PERIOD \} from "@\/lib\/director\/mock\/periods";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src
        .replace(/\bDEFAULT_DIRECTOR_PERIOD\b/g, "directorDetailRepo.getDefaultPeriod()")
        .replace(
          /\bbuildAcademicQualityBlock\(/g,
          "directorDetailRepo.getDecliningClasses(",
        ),
  },
  {
    pattern: /import \{ DEFAULT_DIRECTOR_PERIOD \} from "@\/lib\/director\/mock\/periods";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src.replace(/\bDEFAULT_DIRECTOR_PERIOD\b/g, "directorDetailRepo.getDefaultPeriod()"),
  },
  {
    pattern:
      /import \{ DIRECTOR_PERIOD_LABELS, DIRECTOR_PERIODS \} from "@\/lib\/director\/mock\/periods";/g,
    replacement: 'import { directorDetailRepo } from "@/lib/data";',
    usage: (src) =>
      src
        .replace(/\bDIRECTOR_PERIOD_LABELS\b/g, "directorDetailRepo.getPeriodLabels()")
        .replace(/\bDIRECTOR_PERIODS\b/g, "directorDetailRepo.getDirectorPeriods()"),
  },
];

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && !["node_modules", ".next", ".git", "scripts"].includes(ent.name)) {
      walk(p, files);
    } else if (/\.(tsx?)$/.test(ent.name)) {
      files.push(p);
    }
  }
  return files;
}

let count = 0;
for (const file of walk(".")) {
  let src = fs.readFileSync(file, "utf8");
  let next = src;
  for (const rule of directorDetailReplacements) {
    if (rule.pattern.test(next)) {
      next = next.replace(rule.pattern, rule.replacement);
      next = rule.usage(next);
    }
    rule.pattern.lastIndex = 0;
  }
  if (next !== src) {
    fs.writeFileSync(file, next);
    count += 1;
    console.log(file);
  }
}

console.log(`Updated ${count} director files`);
