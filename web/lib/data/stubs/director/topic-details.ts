import type { GosoConcept } from "@/lib/director/types";

export function getTopicDetail(topicId: string): {
  topic: GosoConcept;
  students: { id: string; fullName: string; classLabel: string }[];
  kspLinks: { title: string; gosoCode: string }[];
  textbooks: { title: string; publisher: string }[];
} | null {
  const topics: Record<string, GosoConcept> = {
    t1: {
      id: "t1",
      code: "ГОСО-M-8.2",
      title: "Линейные уравнения",
      subject: "Математика",
      errorPercent: 34,
      classLabel: "8 «А»",
    },
    t2: {
      id: "t2",
      code: "ГОСО-P-9.1",
      title: "Законы Ньютона",
      subject: "Физика",
      errorPercent: 29,
      classLabel: "9 «Б»",
    },
    t3: {
      id: "t3",
      code: "ГОСО-M-10.4",
      title: "Тригонометрия",
      subject: "Математика",
      errorPercent: 27,
      classLabel: "10 «А»",
    },
    t4: {
      id: "t4",
      code: "ГОСО-C-9.3",
      title: "Окислительно-восстановительные реакции",
      subject: "Химия",
      errorPercent: 26,
      classLabel: "9 «А»",
    },
  };
  const topic = topics[topicId];
  if (!topic) return null;
  return {
    topic,
    students: [
      { id: "st1", fullName: "Алиев Д. К.", classLabel: topic.classLabel },
      { id: "st2", fullName: "Касым А. Б.", classLabel: topic.classLabel },
      { id: "st3", fullName: "Нурланова К. С.", classLabel: "9 «Б»" },
    ],
    kspLinks: [
      { title: `КСП: ${topic.title} — отработка`, gosoCode: topic.code },
      { title: "КСП: Повторение с опорой на ГОСО", gosoCode: topic.code },
    ],
    textbooks: [
      { title: "Алгебра 8", publisher: "Мектеп" },
      { title: "Физика 9", publisher: "Алматыкітап" },
    ],
  };
}
