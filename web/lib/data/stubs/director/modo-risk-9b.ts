export const modoRisk9b = {
  classLabel: "9 «Б»",
  homeroomTeacher: "Садыкова М. Р.",
  studentCount: 28,
  riskBadge: "Высокий риск МОДО",
  kpis: {
    classForecast: 3.1,
    inRiskGroup: 12,
    avgScore: 3.4,
    sharedGaps: 5,
  },
  students: [
    {
      id: "s1",
      fullName: "Алиев Д. К.",
      modoForecast: 2.4,
      deltaMonth: -0.8,
      gaps: "Алгебра, геометрия",
      riskLevel: "high" as const,
    },
    {
      id: "s2",
      fullName: "Оспанова К. Н.",
      modoForecast: 2.9,
      deltaMonth: -0.5,
      gaps: "Физика",
      riskLevel: "high" as const,
    },
    {
      id: "s3",
      fullName: "Жумабеков А. Т.",
      modoForecast: 3.2,
      deltaMonth: -0.3,
      gaps: "Химия, ОРК",
      riskLevel: "medium" as const,
    },
  ],
  classGaps: [
    { topic: "Квадратные уравнения", mastery: 42 },
    { topic: "Векторы на плоскости", mastery: 38 },
    { topic: "Законы Ньютона", mastery: 47 },
  ],
  supportPlan: [
    {
      id: "step-1",
      title: "Целевой мини-модуль по алгебре для группы риска",
      responsible: "Завуч по УВР",
      deadline: "10.06.2026",
    },
    {
      id: "step-2",
      title: "Два дополнительных СОР с разбором типовых ошибок",
      responsible: "Учитель математики",
      deadline: "14.06.2026",
    },
    {
      id: "step-3",
      title: "Консультации с классным руководителем (2 встречи)",
      responsible: "Классный руководитель",
      deadline: "20.06.2026",
    },
  ],
  effectForecast: "+0.4 балла к прогнозу класса при выполнении всех шагов",
};
