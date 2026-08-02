export type DirectorLocale = "kk" | "ru" | "en";

export const DIRECTOR_LOCALE_STORAGE_KEY = "qv_director_locale";

export const directorMessages: Record<
  DirectorLocale,
  Record<string, string>
> = {
  kk: {
    home: "Басты экран",
    today: "Бүгін мектепте",
    attention: "Назар аудару керек",
    quality: "Оқу сапасы",
    lessons: "Сабақ видеоаналитикасы",
    security: "Мектеп қауіпсіздігі",
    teachers: "Педагог жүктемесі",
    infrastructure: "Инфрақұрылым",
    extras: "Бенчмарк және есеп",
    refresh: "Жаңартылды",
    periodToday: "Бүгін",
    periodWeek: "Апта",
    periodQuarter: "Тоқсан",
    periodYear: "Жыл",
    allNormal: "Бүгін бәрі қалыпты",
    confirmTitle: "Әрекетті растайсыз ба?",
    confirmAction: "Растау",
    cancel: "Болдырмау",
  },
  ru: {
    home: "Главный экран",
    today: "Сегодня в школе",
    attention: "Требует внимания",
    quality: "Качество обучения",
    lessons: "Видео- и аудиоаналитика уроков",
    security: "Безопасность школы",
    teachers: "Нагрузка педагогов",
    infrastructure: "Инфраструктура",
    extras: "Бенчмарки и отчётность УО",
    refresh: "Обновлено",
    periodToday: "Сегодня",
    periodWeek: "Неделя",
    periodQuarter: "Четверть",
    periodYear: "Год",
    allNormal: "Сегодня всё в норме",
    confirmTitle: "Вы подтверждаете действие?",
    confirmAction: "Подтвердить",
    cancel: "Отмена",
  },
  en: {
    home: "Home",
    today: "Today at school",
    attention: "Needs attention",
    quality: "Learning quality",
    lessons: "Lesson video analytics",
    security: "School security",
    teachers: "Teacher workload",
    infrastructure: "Infrastructure",
    extras: "Benchmarks & reporting",
    refresh: "Updated",
    periodToday: "Today",
    periodWeek: "Week",
    periodQuarter: "Quarter",
    periodYear: "Year",
    allNormal: "All clear today",
    confirmTitle: "Confirm this action?",
    confirmAction: "Confirm",
    cancel: "Cancel",
  },
};

export function t(locale: DirectorLocale, key: string): string {
  return directorMessages[locale][key] ?? directorMessages.ru[key] ?? key;
}
