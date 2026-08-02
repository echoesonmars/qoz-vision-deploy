import { DirectorPageShell } from "@/components/director/shared/director-page-shell";

const RIGHTS = [
  "Просмотр своих данных в личном кабинете педагога",
  "Оспаривание рекомендаций ИИ (форма)",
  "Отказ от видеоаналитики уроков",
  "Запрос на удаление видеофрагмента (ticket)",
  "Обратная связь по качеству рекомендаций",
];

export default function SettingsDataRightsPage() {
  return (
    <DirectorPageShell
      breadcrumbs={[
        { label: "Главный экран", href: "/dashboard" },
        { label: "Права субъектов данных" },
      ]}
      title="Права субъектов (§16.4)"
      description="Информация для педагогов, учеников и родителей"
    >
      <ul className="space-y-3 text-sm">
        {RIGHTS.map((right) => (
          <li key={right} className="rounded-xl bg-muted/30 px-4 py-3 ring-1 ring-border/50">
            {right}
          </li>
        ))}
      </ul>
    </DirectorPageShell>
  );
}
