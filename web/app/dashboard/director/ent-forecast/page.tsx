import Link from "next/link";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { DirectorCountPercentValue } from "@/components/director/shared/director-count-percent-value";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatSharePercent } from "@/lib/director/format-metric-value";
import { directorDetailRepo } from "@/lib/data";

export default function DirectorEntForecastPage() {
  const data = directorDetailRepo.getEntForecast();
  const maxCount = Math.max(...data.distribution.map((d) => d.count));
  const distributionTotal = data.distribution.reduce((sum, band) => sum + band.count, 0);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Прогноз ЕНТ" },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Прогноз ЕНТ — {data.classLabel}</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DirectorKpiTile label="Проходной прогноз" value={`${data.passPercent}%`} status="ok" />
        <DirectorKpiTile
          label="Группа риска"
          value={
            <DirectorCountPercentValue
              count={data.riskGroup}
              total={data.studentCount}
              fractionDigits={0}
            />
          }
          context="учеников"
          status="warning"
        />
      </div>
      <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
        <p className="mb-4 text-sm font-semibold">Распределение баллов</p>
        <div className="space-y-4">
          {data.distribution.map((band) => (
            <div key={band.band} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{band.band}</span>
                <span className="tabular-nums">
                  {band.count} уч. ({formatSharePercent(band.count, distributionTotal, 0)})
                </span>
              </div>
              <Progress value={(band.count / maxCount) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
