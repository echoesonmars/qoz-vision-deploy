export type DirectorActivityItem = {
  id: string;
  time: string;
  text: string;
  href: string;
};

export const directorActivityFeed: DirectorActivityItem[] = [
  {
    id: "a1",
    time: "10:42",
    text: "Инцидент у входной группы — новый сигнал",
    href: "/dashboard/director/security/sec-1",
  },
  {
    id: "a2",
    time: "09:55",
    text: "Конфликт на дворе — на проверке",
    href: "/dashboard/director/security/sec-2",
  },
  {
    id: "a3",
    time: "08:30",
    text: "Посещаемость 9 «Б» ниже порога",
    href: "/dashboard/director/attendance",
  },
  {
    id: "a4",
    time: "Вчера",
    text: "План поддержки 9 «Б» ожидает утверждения",
    href: "/dashboard/director/classes/9b-modo-risk",
  },
];
