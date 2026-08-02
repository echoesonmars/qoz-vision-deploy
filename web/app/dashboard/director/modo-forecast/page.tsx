import Link from "next/link";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { DirectorCountPercentValue } from "@/components/director/shared/director-count-percent-value";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { directorDetailRepo } from "@/lib/data";

export default function DirectorModoForecastPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Прогноз МОДО" },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Прогноз МОДО</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {directorDetailRepo.getModoForecast().parallels.map((p) => (
          <div key={p.label} className="rounded-xl bg-muted/30 p-6 ring-1 ring-border/50">
            <h2 className="mb-4 text-lg font-semibold">{p.label}</h2>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <DirectorKpiTile label="Прогноз" value={`${p.forecastPercent}%`} />
              <DirectorKpiTile
                label="В группе риска"
                value={
                  <DirectorCountPercentValue
                    count={p.riskCount}
                    total={p.studentCount}
                    fractionDigits={0}
                  />
                }
                status={p.riskCount > 20 ? "critical" : "warning"}
              />
            </div>
            <p className="mb-2 text-sm font-semibold">Топ пробелы</p>
            <div className="flex flex-wrap gap-2">
              {p.topGaps.map((gap) => (
                <Badge key={gap} variant="outline">
                  {gap}
                </Badge>
              ))}
            </div>
            {p.label === "9 класс" ? (
              <Button asChild size="sm" className="mt-4">
                <Link href="/dashboard/director/classes/9b-modo-risk">9 «Б» — детали</Link>
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
