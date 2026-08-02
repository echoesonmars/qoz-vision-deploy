import type { AcademicQualityBlock, DirectorPeriod } from "@/lib/director/types";
import { getPeriodScale } from "@/lib/data/stubs/director/periods";

export function buildAcademicQualityBlock(
  period: DirectorPeriod,
): AcademicQualityBlock {
  const scale = getPeriodScale(period);
  return {
    avgSorSoch: scale.avgSorSoch,
    dynamicsDelta: scale.dynamicsDelta,
    studentsWithGaps: scale.studentsWithGaps,
    entForecastPercent: period === "year" ? 68 : 72,
    modoForecastPercent: period === "today" ? 74 : 71,
    topErrorTopics: [
      {
        id: "t1",
        code: "ГОСО-M-8.2",
        title: "Линейные уравнения",
        subject: "Математика",
        errorPercent: 34,
        classLabel: "8 «А»",
      },
      {
        id: "t2",
        code: "ГОСО-P-9.1",
        title: "Законы Ньютона",
        subject: "Физика",
        errorPercent: 29,
        classLabel: "9 «Б»",
      },
      {
        id: "t3",
        code: "ГОСО-M-10.4",
        title: "Тригонометрия",
        subject: "Математика",
        errorPercent: 27,
        classLabel: "10 «А»",
      },
      {
        id: "t4",
        code: "ГОСО-C-9.3",
        title: "Окислительно-восстановительные реакции",
        subject: "Химия",
        errorPercent: 26,
        classLabel: "9 «А»",
      },
    ],
    decliningClasses: [
      {
        classId: "9b",
        classLabel: "9 «Б»",
        subject: "Алгебра",
        deltaPercent: -6,
      },
      {
        classId: "10a",
        classLabel: "10 «А»",
        subject: "Физика",
        deltaPercent: -5,
      },
      {
        classId: "11a",
        classLabel: "11 «А»",
        subject: "Математика",
        deltaPercent: -5,
      },
      {
        classId: "8a",
        classLabel: "8 «А»",
        subject: "Геометрия",
        deltaPercent: -5,
      },
    ],
  };
}
