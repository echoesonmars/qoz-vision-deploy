import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { Button } from "@/components/ui/button";
import { directorDetailRepo } from "@/lib/data";

type PageProps = {
  params: Promise<{ topicId: string }>;
};

export default async function DirectorTopicPage({ params }: PageProps) {
  const { topicId } = await params;
  const detail = directorDetailRepo.getTopicDetail(topicId);
  if (!detail) notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Качество обучения", href: "/dashboard#quality" },
          { label: detail.topic.title },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{detail.topic.title}</h1>
          <p className="text-muted-foreground text-sm">
            {detail.topic.subject} · {detail.topic.classLabel} · {detail.topic.code}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <DirectorKpiTile
        label="Доля ошибок"
        value={`${detail.topic.errorPercent}%`}
        status="warning"
        className="max-w-xs"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
          <p className="mb-3 text-sm font-semibold">Ученики с пробелом</p>
          <ul className="space-y-2 text-sm">
            {detail.students.map((s) => (
              <li key={s.id}>
                {s.fullName} — {s.classLabel}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
          <p className="mb-3 text-sm font-semibold">КСП (ГОСО)</p>
          <ul className="space-y-2 text-sm">
            {detail.kspLinks.map((k) => (
              <li key={k.title}>
                {k.title} <span className="text-muted-foreground">({k.gosoCode})</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50 lg:col-span-2">
          <p className="mb-3 text-sm font-semibold">Учебники РК</p>
          <ul className="space-y-2 text-sm">
            {detail.textbooks.map((b) => (
              <li key={b.title}>
                {b.title} — {b.publisher}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
