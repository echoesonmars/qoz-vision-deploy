import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  summaryCardHeaderMuted,
  summaryCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { strategicTargets } from "@/lib/data/stubs/dashboard/forecasts-mock";
import { cn } from "@/lib/utils";
import { MdSchool, MdShowChart, MdTrendingDown, MdTrendingUp, MdWarningAmber } from "react-icons/md";

export function ForecastStrategicCards() {
  const { meskEntPassPercent, meskEntDetail, gpaForecast, gpaTrend, gpaPeriodLabel, riskZoneCount, riskZoneDetail } =
    strategicTargets;
  const trendUp = gpaTrend === "up";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className={summaryCardInteractive}>
        <CardHeader className={cn(summaryCardHeaderMuted, "space-y-3")}>
          <div className="flex items-start gap-3">
            <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-primary/20">
              <MdSchool className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <CardDescription className={summaryKicker}>Целевые экзамены</CardDescription>
              <CardTitle className="text-base font-semibold leading-snug">
                Прогноз МЕСК / ЕНТ
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-3xl font-semibold tabular-nums tracking-tight text-primary">
            {meskEntPassPercent}%
          </p>
          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
            Учащихся подтверждают сдачу на целевой балл: {meskEntDetail}
          </p>
        </CardContent>
      </Card>

      <Card className={summaryCardInteractive}>
        <CardHeader className={cn(summaryCardHeaderMuted, "space-y-3")}>
          <div className="flex items-start gap-3">
            <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-primary/20">
              <MdShowChart className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <CardDescription className={summaryKicker}>Траектория школы</CardDescription>
              <CardTitle className="text-base font-semibold leading-snug">
                GPA на {gpaPeriodLabel}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-wrap items-end gap-2">
            <p className="text-3xl font-semibold tabular-nums tracking-tight">{gpaForecast}</p>
            <Badge variant="default" className="mb-1 gap-1 font-normal">
              {trendUp ? (
                <MdTrendingUp className="size-3.5" aria-hidden />
              ) : (
                <MdTrendingDown className="size-3.5" aria-hidden />
              )}
              {trendUp ? "Рост" : "Снижение"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
            Прогнозируемый средний балл школы и направление тренда по модели ИИ.
          </p>
        </CardContent>
      </Card>

      <Card className={summaryCardInteractive}>
        <CardHeader className={cn(summaryCardHeaderMuted, "space-y-3")}>
          <div className="flex items-start gap-3">
            <span className="bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-destructive/20">
              <MdWarningAmber className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <CardDescription className={summaryKicker}>Зона риска</CardDescription>
              <CardTitle className="text-base font-semibold leading-snug">
                Счётчик внимания
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-destructive text-3xl font-semibold tabular-nums tracking-tight">
            {riskZoneCount}
          </p>
          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">{riskZoneDetail}</p>
        </CardContent>
      </Card>
    </div>
  );
}
