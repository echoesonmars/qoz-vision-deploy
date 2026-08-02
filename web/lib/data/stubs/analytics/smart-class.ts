import type { SmartClassData } from "@/lib/analytics/types";

export const smartClassData: SmartClassData = {
  waveLabels: ["Wave 1", "Wave 2", "Wave 3", "Wave 4", "Wave 5", "Wave 6", "Wave 7", "Wave 8"],
  criteria: [
    {
      id: "speech-culture",
      label: "Культура речи",
      waves: [95.33, 95.8, 96.2, 96.8, 97.1, 97.5, 97.9, 98.33],
    },
    {
      id: "emotional-safety",
      label: "Эмоциональная безопасность",
      waves: [92.33, 93.1, 94.0, 95.2, 96.1, 96.8, 97.5, 98.33],
    },
    {
      id: "text-work",
      label: "Работа с текстом",
      waves: [92.67, 93.5, 94.2, 95.0, 96.0, 96.8, 97.5, 98.33],
    },
    {
      id: "engagement",
      label: "Вовлечённость и равное участие",
      waves: [90.0, 90.5, 91.0, 91.2, 91.5, 92.0, 92.2, 92.5],
    },
    {
      id: "four-k",
      label: "4К + UpGrade",
      waves: [72.67, 74.0, 75.5, 76.8, 77.5, 78.2, 79.0, 80.0],
    },
    {
      id: "formative",
      label: "Формативное оценивание и рефлексия",
      waves: [59.09, 62.0, 65.5, 67.0, 72.0, 76.5, 82.0, 86.21],
    },
    {
      id: "goals",
      label: "Цели и ясность урока",
      waves: [58.67, 62.0, 68.0, 72.5, 76.0, 80.0, 83.0, 85.0],
    },
    {
      id: "questions",
      label: "Вопросы и мышление",
      waves: [41.33, 44.0, 47.5, 50.0, 52.0, 54.5, 56.0, 57.69],
    },
    {
      id: "differentiation",
      label: "Дифференциация",
      waves: [16.67, 22.0, 28.0, 29.41, 38.0, 45.0, 58.0, 69.05],
    },
  ],
};
