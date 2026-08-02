import type { DirectorAlert, DirectorPeriod } from "@/lib/director/types";
import { DIRECTOR_PATHS } from "@/lib/director/paths";

export function buildDirectorAlerts(period: DirectorPeriod): DirectorAlert[] {
  void period;
  return [
    {
      id: "alert-1",
      priority: "critical",
      title: "Посторонний посетитель у входной группы без сопровождения",
      context: "Входная группа · 10:42 · Видеоаналитика + СКУД",
      actionLabel: "Проверить",
      responsible: "Охрана · Толеуов Б.",
      href: DIRECTOR_PATHS.camerasIncidents,
      reactionDeadline: "В течение часа",
    },
    {
      id: "alert-2",
      priority: "critical",
      title: "Сбой Wi-Fi в кабинете 304 — прерван контрольная работа",
      context: "Каб. 304 · 10:38 · Мониторинг инфраструктуры",
      actionLabel: "Назначить",
      responsible: "Завуч · Петров И. В.",
      href: `${DIRECTOR_PATHS.managementMap}#304`,
      reactionDeadline: "В течение часа",
    },
    {
      id: "alert-3",
      priority: "attention",
      title: "12 учеников 9 «Б» — высокий риск МОДО",
      context: "9 «Б» · Прогноз ИИ · Электронный журнал",
      actionLabel: "План",
      responsible: "Завуч по УВР · Касымова А. С.",
      href: "/dashboard/director/classes/9b-modo-risk",
      reactionDeadline: "В течение дня",
    },
    {
      id: "alert-4",
      priority: "attention",
      title: "Снижение посещаемости 11 «А» на 3-й урок",
      context: "11 «А» · 09:15 · Электронный журнал",
      actionLabel: "Разбор",
      responsible: "Классный руководитель · Садыкова М.",
      href: DIRECTOR_PATHS.attendance,
      reactionDeadline: "В течение дня",
    },
    {
      id: "alert-5",
      priority: "info",
      title: "Заявка на ремонт проектора в кабинете 201",
      context: "Каб. 201 · Вчера · Система заявок",
      actionLabel: "Проверить",
      responsible: "Завхоз · Омаров Е.",
      href: DIRECTOR_PATHS.managementMap,
      reactionDeadline: "В течение недели",
    },
  ];
}

export function sortAlertsByPriority(alerts: DirectorAlert[]): DirectorAlert[] {
  const order = { critical: 0, attention: 1, info: 2 };
  return [...alerts].sort((a, b) => order[a.priority] - order[b.priority]);
}
