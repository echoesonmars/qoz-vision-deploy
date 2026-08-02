export const ADM_COPY = {
  serviceName: "Almaty Digital Mektebi",
  moduleTitle: "Видеоаналитика уроков",
  pageTitle: "Almaty Digital Mektebi | Видеоаналитика",
  pageDescription:
    "Видео- и аудиоаналитика уроков Almaty Digital Mektebi: вовлечённость, посещаемость, инциденты и отчёты.",
  loadingText: "Загрузка видеоаналитики",
  footerCredit: "Технологическое решение предоставлено Алатау",
  videoAnalyticsNav: "Видеоаналитика уроков",
} as const;

export type AdmCopyKey = keyof typeof ADM_COPY;
