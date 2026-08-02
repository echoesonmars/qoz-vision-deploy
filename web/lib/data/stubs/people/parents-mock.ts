export type ParentMappingRow = {
  id: string;
  parentName: string;
  phone: string;
  children: string;
};

export const parentMappingRows: ParentMappingRow[] = [
  {
    id: "p1",
    parentName: "Алимбекова Г.Р.",
    phone: "+7 7•• ••• 12 34",
    children: "Алимбеков Д. — 10«А»; Алимбекова А. — 7«В»",
  },
  {
    id: "p2",
    parentName: "Уразов К.С.",
    phone: "+7 7•• ••• 56 78",
    children: "Уразова М. — 10«Б»",
  },
];

export type ParentCredentialAction = {
  id: string;
  label: string;
  hint: string;
};

export const parentCredentialActions: ParentCredentialAction[] = [
  {
    id: "a1",
    label: "Supabase Auth: портал родителя",
    hint: "Демо: привязка email и magic-link.",
  },
  { id: "a2", label: "Сброс пароля", hint: "Очередь SMS и email." },
  { id: "a3", label: "SMS для уведомлений", hint: "Верификация номера." },
];

export type NotificationTrigger = {
  id: string;
  label: string;
  channel: "whatsapp" | "sms";
  enabled: boolean;
};

export const notificationTriggers: NotificationTrigger[] = [
  { id: "n1", label: "Вовлечённость на уроке < 50%", channel: "whatsapp", enabled: true },
  { id: "n2", label: "Скан Sozley после утверждения учителем", channel: "sms", enabled: true },
  { id: "n3", label: "Еженедельный сводный отчёт", channel: "sms", enabled: false },
];

export type AppealThread = {
  id: string;
  title: string;
  status: "open" | "review" | "closed";
  updatedAt: string;
};

export const appealThreads: AppealThread[] = [
  {
    id: "ap1",
    title: "Апелляция по баллу за задачу 4",
    status: "review",
    updatedAt: "2026-05-14",
  },
  {
    id: "ap2",
    title: "Комментарий к выводу ИИ в сочинении",
    status: "open",
    updatedAt: "2026-05-15",
  },
];

export type AppealChatLine = {
  id: string;
  author: string;
  body: string;
  at: string;
};

export const appealChatLines: AppealChatLine[] = [
  {
    id: "m1",
    author: "Классный руководитель",
    body: "Передала предметнику, ответ до 48 ч.",
    at: "10:02",
  },
  { id: "m2", author: "Родитель", body: "Спасибо, жду разбор критерия §2.", at: "10:04" },
];
