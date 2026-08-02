import type { TeacherRecommendation } from "@/lib/director/types";

export const mockTeacherRecommendations: TeacherRecommendation[] = [
  {
    id: "rec-1",
    category: "method_support",
    teacherId: "t-kasymova",
    teacherName: "Касымова А. С.",
    subject: "Физика",
    classes: "7–9 классы",
    experienceYears: 1,
    reason:
      "Вовлечённость 58% по видеоаналитике, преимущественно фронтальная работа.",
    action: "Наставник + модуль ПК «Интерактивные методы»",
    responsible: "Завуч по УВР",
  },
  {
    id: "rec-2",
    category: "mentor_candidate",
    teacherId: "t-akhmetova",
    teacherName: "Ахметова Н. К.",
    subject: "Химия",
    classes: "10–11 классы",
    experienceYears: 12,
    reason:
      "Стабильный рост СОР/СОЧ +3.2% за 2 цикла, низкая доля ручных правок Sozley.",
    action: "Пригласить в программу наставничества",
    responsible: "Директор",
  },
  {
    id: "rec-3",
    category: "pk_module",
    teacherId: "t-sadykov",
    teacherName: "Садыков М. Р.",
    subject: "Математика",
    classes: "8–9 классы",
    experienceYears: 5,
    reason: "Не завершён обязательный модуль ПК по Указу №1274.",
    action: "Назначить модуль «ИИ в образовании» до 15 июня",
    responsible: "Методист",
  },
  {
    id: "rec-4",
    category: "overload",
    teacherId: "t-omarov",
    teacherName: "Омаров Е. Т.",
    subject: "История",
    classes: "5–11 классы",
    experienceYears: 18,
    reason: "Нагрузка выше норматива 3 четверти подряд: 32 ч/нед.",
    action: "Пересмотреть расписание и делегировать факультатив",
    responsible: "Завуч по УВР",
  },
];
