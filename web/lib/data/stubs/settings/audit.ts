export type SettingsAuditRow = {
  id: string;
  time: string;
  actor: string;
  action: string;
  scope: string;
  risk: string;
};

export const settingsAuditRows: SettingsAuditRow[] = [
  {
    id: "a1",
    time: "15.05.2026 09:14",
    actor: "Завуч · ipetrov@school.local",
    action: "Открыл прямой эфир: камера каб. 304 (архив 4 мин)",
    scope: "Камеры",
    risk: "Средний",
  },
  {
    id: "a2",
    time: "14.05.2026 16:02",
    actor: "Учитель · nakhmetova@school.local",
    action: "Вручную изменила оценку Sozley: работа #8821, было 4 → стало 5",
    scope: "Sozley",
    risk: "Высокий",
  },
  {
    id: "a3",
    time: "14.05.2026 11:38",
    actor: "Админ · admin@school.local",
    action: "Экспорт журнала посещаемости за неделю (Excel)",
    scope: "Аналитика",
    risk: "Низкий",
  },
  {
    id: "a4",
    time: "13.05.2026 14:20",
    actor: "Завуч · ipetrov@school.local",
    action: "Просмотр стрима входной группы, камера 01",
    scope: "Камеры",
    risk: "Средний",
  },
  {
    id: "a5",
    time: "05.06.2026 10:05",
    actor: "Завуч · ibraeva@school.local",
    action: "Workflow: инцидент sec-2 переведён «На проверке»",
    scope: "Безопасность",
    risk: "Средний",
  },
  {
    id: "a6",
    time: "05.06.2026 09:50",
    actor: "Директор · director@school.local",
    action: "Просмотр видеофрагмента инцидента (audit)",
    scope: "Безопасность",
    risk: "Высокий",
  },
];
