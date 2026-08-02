import type { ChartConfig } from "@/components/ui/chart";

export const ACTION_LABELS: Record<string, string> = {
  writes: "Пишет",
  reads: "Читает",
  sits: "Сидит",
  phone: "В телефоне",
  listens: "Слушает",
  speaks: "Говорит",
  eats: "Кушает",
  stands: "Стоит",
  other: "Другое",
};

export const EMOTION_LABELS: Record<string, string> = {
  calm: "Спокойный",
  focused: "Сосредоточенный",
  anxious: "Тревожный",
  sad: "Грустный",
  happy: "Радостный",
};

export const INCIDENT_TYPE_LABELS: Record<string, string> = {
  playing: "Playing",
  "fight-3": "Fight-3",
  normal: "Normal",
  "fight-5": "Fight-5",
  laying: "Laying",
  "bullying-1": "Bullying-1",
  "bullying-2": "Bullying-2",
  "bullying-3": "Bullying-3",
  "fight-2": "Fight-2",
};

export const actionChartConfig: ChartConfig = {
  writes: { label: "Пишет", color: "hsl(142 71% 45%)" },
  reads: { label: "Читает", color: "hsl(199 89% 48%)" },
  sits: { label: "Сидит", color: "hsl(262 83% 58%)" },
  phone: { label: "В телефоне", color: "hsl(0 84% 60%)" },
  listens: { label: "Слушает", color: "hsl(38 92% 50%)" },
  speaks: { label: "Говорит", color: "hsl(173 58% 39%)" },
  eats: { label: "Кушает", color: "hsl(280 65% 60%)" },
  stands: { label: "Стоит", color: "hsl(215 16% 47%)" },
  other: { label: "Другое", color: "hsl(220 9% 46%)" },
};

export const emotionChartConfig: ChartConfig = {
  calm: { label: "Спокойный", color: "hsl(142 71% 45%)" },
  focused: { label: "Сосредоточенный", color: "hsl(199 89% 48%)" },
  anxious: { label: "Тревожный", color: "hsl(38 92% 50%)" },
  sad: { label: "Грустный", color: "hsl(215 16% 47%)" },
  happy: { label: "Радостный", color: "hsl(262 83% 58%)" },
};

export const waveChartConfig: ChartConfig = {
  wave1: { label: "Wave 1", color: "hsl(215 16% 47%)" },
  wave4: { label: "Wave 4", color: "hsl(199 89% 48%)" },
  wave8: { label: "Wave 8", color: "hsl(142 71% 45%)" },
};

export const platformChartConfig: ChartConfig = {
  videoPathThousands: { label: "Video path, тыс.", color: "hsl(142 71% 45%)" },
  lessons: { label: "Уроки", color: "hsl(199 89% 48%)" },
};

export function buildDonutConfig(
  slices: { key: string; label: string }[],
  colors: string[],
): ChartConfig {
  const config: ChartConfig = {};
  slices.forEach((slice, i) => {
    config[slice.key] = {
      label: slice.label,
      color: colors[i % colors.length],
    };
  });
  return config;
}

export const INCIDENT_COLORS = [
  "hsl(142 71% 45%)",
  "hsl(199 89% 48%)",
  "hsl(38 92% 50%)",
  "hsl(0 84% 60%)",
  "hsl(262 83% 58%)",
  "hsl(173 58% 39%)",
  "hsl(280 65% 60%)",
  "hsl(215 16% 47%)",
  "hsl(220 9% 46%)",
];
