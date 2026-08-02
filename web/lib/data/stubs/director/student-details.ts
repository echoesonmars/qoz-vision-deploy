export function getStudentDetail(studentId: string) {
  const students: Record<
    string,
    {
      fullName: string;
      classLabel: string;
      modoForecast: number;
      deltaMonth: number;
      gaps: string[];
      riskLevel: "high" | "medium" | "low";
      attendancePercent: number;
      homeroom: string;
    }
  > = {
    s1: {
      fullName: "Алиев Д. К.",
      classLabel: "9 «Б»",
      modoForecast: 2.8,
      deltaMonth: -0.6,
      gaps: ["Алгебра", "Геометрия"],
      riskLevel: "high",
      attendancePercent: 78,
      homeroom: "Садыкова М. Р.",
    },
    s2: {
      fullName: "Нурланова А. С.",
      classLabel: "11 «А»",
      modoForecast: 82,
      deltaMonth: -4,
      gaps: ["Физика"],
      riskLevel: "medium",
      attendancePercent: 91,
      homeroom: "Ахметова Н. К.",
    },
    st1: {
      fullName: "Алиев Д. К.",
      classLabel: "9 «Б»",
      modoForecast: 2.4,
      deltaMonth: -0.8,
      gaps: ["Алгебра", "Геометрия"],
      riskLevel: "high",
      attendancePercent: 78,
      homeroom: "Садыкова М. Р.",
    },
  };
  return students[studentId] ?? null;
}
