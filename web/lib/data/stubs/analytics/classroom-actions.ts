import type { ClassroomActionsData } from "@/lib/analytics/types";
import { CLASS_8B_STUDENTS } from "@/lib/data/stubs/analytics/filters";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildStudentShares(index: number): ClassroomActionsData["byStudent"][0]["shares"] {
  const phone = index % 5 === 2 || index % 7 === 4 ? 0.12 + seededRandom(index) * 0.08 : 0.02 + seededRandom(index + 1) * 0.04;
  const writes = 0.22 + seededRandom(index + 2) * 0.1;
  const reads = 0.14 + seededRandom(index + 3) * 0.06;
  const sits = 0.12 + seededRandom(index + 4) * 0.05;
  const listens = 0.18 + seededRandom(index + 5) * 0.06;
  const speaks = 0.04 + seededRandom(index + 6) * 0.04;
  const eats = index % 9 === 0 ? 0.03 : 0;
  const stands = 0.02 + seededRandom(index + 7) * 0.02;
  const raw = { writes, reads, sits, phone, listens, speaks, eats, stands };
  const other = Math.max(0, 1 - Object.values(raw).reduce((a, b) => a + b, 0));
  const total = writes + reads + sits + phone + listens + speaks + eats + stands + other;
  return {
    writes: writes / total,
    reads: reads / total,
    sits: sits / total,
    phone: phone / total,
    listens: listens / total,
    speaks: speaks / total,
    eats: eats / total,
    stands: stands / total,
    other: other / total,
  };
}

const byStudent = CLASS_8B_STUDENTS.map((s, i) => ({
  studentId: s.id,
  studentName: s.name,
  shares: buildStudentShares(i),
}));

const timeline = Array.from({ length: 41 }, (_, minute) => {
  const t = minute;
  const base = 0.15 + Math.sin(t / 6) * 0.05;
  return {
    minute: t,
    writes: base + 0.12 + seededRandom(t) * 0.04,
    reads: 0.08 + seededRandom(t + 10) * 0.03,
    sits: 0.06 + seededRandom(t + 20) * 0.02,
    phone: t > 25 && t < 35 ? 0.04 + seededRandom(t) * 0.03 : 0.01,
    listens: 0.14 + seededRandom(t + 30) * 0.04,
    speaks: 0.03 + seededRandom(t + 40) * 0.02,
    eats: 0,
    stands: 0.02,
    other: 0.02,
  };
});

const actionTotals = {
  writes: 0,
  reads: 0,
  sits: 0,
  phone: 0,
  listens: 0,
  speaks: 0,
  eats: 0,
  stands: 0,
  other: 0,
};

for (const row of byStudent) {
  for (const key of Object.keys(actionTotals) as (keyof typeof actionTotals)[]) {
    actionTotals[key] += row.shares[key];
  }
}

const donut = [
  { key: "writes", label: "Пишет", value: Math.round(actionTotals.writes * 1000) },
  { key: "reads", label: "Читает", value: Math.round(actionTotals.reads * 1000) },
  { key: "sits", label: "Сидит", value: Math.round(actionTotals.sits * 1000) },
  { key: "phone", label: "В телефоне", value: Math.round(actionTotals.phone * 1000) },
  { key: "listens", label: "Слушает", value: Math.round(actionTotals.listens * 1000) },
  { key: "speaks", label: "Говорит", value: Math.round(actionTotals.speaks * 1000) },
  { key: "eats", label: "Кушает", value: Math.round(actionTotals.eats * 1000) },
  { key: "stands", label: "Стоит", value: Math.round(actionTotals.stands * 1000) },
  { key: "other", label: "Другое", value: Math.round(actionTotals.other * 1000) },
];

export const classroomActionsData: ClassroomActionsData = {
  timeline,
  byStudent,
  byDuration: donut.map((d) => ({ key: d.key, label: d.label, value: d.value })),
  donut,
};
