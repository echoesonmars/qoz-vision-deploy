import type { ClassroomEmotionsData } from "@/lib/analytics/types";
import { CLASS_8B_STUDENTS } from "@/lib/data/stubs/analytics/filters";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildEmotionShares(index: number): ClassroomEmotionsData["byStudent"][0]["shares"] {
  const anxious = index % 6 === 3 || index % 8 === 5 ? 0.18 + seededRandom(index) * 0.1 : 0.05 + seededRandom(index) * 0.04;
  const sad = index % 9 === 2 ? 0.12 : 0.03 + seededRandom(index + 1) * 0.02;
  const focused = 0.35 + seededRandom(index + 2) * 0.12;
  const calm = 0.28 + seededRandom(index + 3) * 0.1;
  const happy = Math.max(0.05, 1 - anxious - sad - focused - calm);
  const total = calm + focused + anxious + sad + happy;
  return {
    calm: calm / total,
    focused: focused / total,
    anxious: anxious / total,
    sad: sad / total,
    happy: happy / total,
  };
}

const byStudent = CLASS_8B_STUDENTS.map((s, i) => ({
  studentId: s.id,
  studentName: s.name,
  shares: buildEmotionShares(i),
}));

const timeline = Array.from({ length: 41 }, (_, minute) => ({
  minute,
  calm: 0.25 + seededRandom(minute) * 0.08,
  focused: 0.35 + seededRandom(minute + 5) * 0.1,
  anxious: minute > 20 && minute < 32 ? 0.12 + seededRandom(minute) * 0.06 : 0.06,
  sad: 0.04 + seededRandom(minute + 15) * 0.02,
  happy: 0.15 + seededRandom(minute + 25) * 0.05,
}));

const emotionTotals = { calm: 0, focused: 0, anxious: 0, sad: 0, happy: 0 };
for (const row of byStudent) {
  for (const key of Object.keys(emotionTotals) as (keyof typeof emotionTotals)[]) {
    emotionTotals[key] += row.shares[key];
  }
}

const donut = [
  { key: "calm", label: "Спокойный", value: Math.round(emotionTotals.calm * 1000) },
  { key: "focused", label: "Сосредоточенный", value: Math.round(emotionTotals.focused * 1000) },
  { key: "anxious", label: "Тревожный", value: Math.round(emotionTotals.anxious * 1000) },
  { key: "sad", label: "Грустный", value: Math.round(emotionTotals.sad * 1000) },
  { key: "happy", label: "Радостный", value: Math.round(emotionTotals.happy * 1000) },
];

export const classroomEmotionsData: ClassroomEmotionsData = {
  timeline,
  byStudent,
  byDuration: donut.map((d) => ({ key: d.key, label: d.label, value: d.value })),
  donut,
  byDay: [
    { date: "2026-02-08", label: "8 фев", calm: 28, focused: 38, anxious: 12, sad: 8, happy: 14 },
    { date: "2026-02-07", label: "7 фев", calm: 30, focused: 35, anxious: 14, sad: 9, happy: 12 },
    { date: "2026-02-01", label: "1 фев", calm: 32, focused: 34, anxious: 11, sad: 7, happy: 16 },
    { date: "2026-01-21", label: "21 янв", calm: 29, focused: 36, anxious: 13, sad: 10, happy: 12 },
  ],
  summaryTable: [
    { room: "422", calm: 28, focused: 38, anxious: 12, sad: 8, happy: 14, total: 100 },
    { room: "301", calm: 32, focused: 35, anxious: 10, sad: 7, happy: 16, total: 100 },
    { room: "Итого", calm: 30, focused: 36, anxious: 11, sad: 8, happy: 15, total: 100 },
  ],
};
