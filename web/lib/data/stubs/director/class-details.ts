export function getClassDetail(classId: string) {
  const classes: Record<
    string,
    {
      label: string;
      homeroom: string;
      students: number;
      avgScore: number;
      riskCount: number;
      gaps: string[];
    }
  > = {
    "9b": {
      label: "9 «Б»",
      homeroom: "Садыкова М. Р.",
      students: 28,
      avgScore: 3.4,
      riskCount: 12,
      gaps: ["Алгебра", "Геометрия", "Физика"],
    },
    "10a": {
      label: "10 «А»",
      homeroom: "Касымова А. С.",
      students: 26,
      avgScore: 3.6,
      riskCount: 5,
      gaps: ["Тригонометрия"],
    },
    "11a": {
      label: "11 «А»",
      homeroom: "Ахметова Н. К.",
      students: 24,
      avgScore: 3.7,
      riskCount: 4,
      gaps: ["ЕНТ профиль: физика"],
    },
    "8a": {
      label: "8 «А»",
      homeroom: "Омаров Е. Т.",
      students: 27,
      avgScore: 3.5,
      riskCount: 6,
      gaps: ["Геометрия"],
    },
  };
  return classes[classId] ?? null;
}
