import type { DirectorPeriod, DirectorTask } from "@/lib/director/types";
import { getPeriodScale } from "@/lib/data/stubs/director/periods";
import { DIRECTOR_PATHS } from "@/lib/director/paths";

export function buildDirectorTasks(period: DirectorPeriod): DirectorTask[] {
  void getPeriodScale(period);
  return [
    {
      id: "task-1",
      title: "Утвердить план поддержки 9 «Б» (МОДО)",
      dueLabel: "Сегодня",
      priority: "critical",
      href: "/dashboard/director/classes/9b-modo-risk",
    },
    {
      id: "task-2",
      title: "Согласовать отчёт для УО за четверть",
      dueLabel: "До пятницы",
      priority: "attention",
      href: DIRECTOR_PATHS.exports,
    },
    {
      id: "task-3",
      title: "Проверить закрытие инцидента у спортзала",
      dueLabel: "Сегодня",
      priority: "attention",
      href: DIRECTOR_PATHS.camerasIncidents,
    },
    {
      id: "task-4",
      title: "Назначить встречу с педагогом (модуль ПК)",
      dueLabel: "На неделе",
      priority: "info",
      href: "/dashboard/director/teachers/t1",
    },
    {
      id: "task-5",
      title: "Подписать график дежурств на июнь",
      dueLabel: "До 10 июня",
      priority: "info",
    },
  ];
}

export function buildDirectorTasksMetric(period: DirectorPeriod) {
  const count = getPeriodScale(period).directorTasks;
  return {
    key: "director_tasks" as const,
    label: "Задачи директору",
    value: count,
    context: count > 0 ? "В очереди действий" : "Очередь пуста",
    status: count >= 5 ? ("warning" as const) : ("ok" as const),
    href: DIRECTOR_PATHS.tasks,
    source: "casper" as const,
  };
}
