import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { DirectorCountPercentValue } from "@/components/director/shared/director-count-percent-value";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { directorDetailRepo } from "@/lib/data";

type PageProps = {
  params: Promise<{ classId: string }>;
};

export default async function DirectorClassPage({ params }: PageProps) {
  const { classId } = await params;
  const detail = directorDetailRepo.getClassDetail(classId);
  if (!detail) notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Класс", href: "/dashboard#quality" },
          { label: detail.label },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{detail.label}</h1>
          <p className="text-muted-foreground text-sm">
            КР: {detail.homeroom} · {detail.students} учеников
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DirectorKpiTile label="Средний балл" value={detail.avgScore.toFixed(1)} />
        <DirectorKpiTile
          label="В группе риска"
          value={
            <DirectorCountPercentValue
              count={detail.riskCount}
              total={detail.students}
              fractionDigits={0}
            />
          }
          status={detail.riskCount > 8 ? "critical" : "warning"}
        />
        <DirectorKpiTile label="Учеников" value={detail.students} />
      </div>
      <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
        <p className="mb-3 text-sm font-semibold">Ключевые пробелы</p>
        <div className="flex flex-wrap gap-2">
          {detail.gaps.map((gap) => (
            <Badge key={gap} variant="outline">
              {gap}
            </Badge>
          ))}
        </div>
      </div>
      {classId === "9b" ? (
        <Button asChild size="sm" className="w-fit">
          <Link href="/dashboard/director/classes/9b-modo-risk">План МОДО 9 «Б»</Link>
        </Button>
      ) : null}
    </div>
  );
}
