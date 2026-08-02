import { DirectorPageShell } from "@/components/director/shared/director-page-shell";

const POLICIES = [
  { title: "Видеозаписи уроков", text: "Хранение не дольше 30 дней (policy §7.6)." },
  { title: "Инциденты безопасности", text: "Фрагменты хранятся 90 дней, доступ по ролям." },
  { title: "Персональные данные", text: "Обработка по 94-З РК, только для образовательных целей." },
  { title: "Видеоаналитика педагогов", text: "Не для рейтинга; педагог может отказаться (§11.6)." },
];

export default function SettingsPrivacyPage() {
  return (
    <DirectorPageShell
      breadcrumbs={[
        { label: "Главный экран", href: "/dashboard" },
        { label: "Приватность" },
      ]}
      title="Политика приватности"
      description="Информационные сроки хранения (§16)"
    >
      <div className="flex flex-col gap-4">
        {POLICIES.map((item) => (
          <div key={item.title} className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
            <p className="font-medium">{item.title}</p>
            <p className="text-muted-foreground mt-1 text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </DirectorPageShell>
  );
}
