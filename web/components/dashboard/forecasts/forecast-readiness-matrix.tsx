import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  summaryCardHeaderMuted,
  summaryCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import {
  forecastSubjectKeys,
  forecastSubjectLabels,
  readinessMatrixRows,
  type ForecastSubjectKey,
  type ReadinessLevel,
} from "@/lib/data/stubs/dashboard/forecasts-mock";
import {
  admGradeHeatHighClass,
  admGradeHeatMidClass,
} from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

const levelLabel: Record<ReadinessLevel, string> = {
  stable: "Стабильно",
  risk: "Риск",
  critical: "Критично",
};

function cellClass(level: ReadinessLevel) {
  return cn(
    "text-center text-xs font-medium",
    level === "stable" && admGradeHeatMidClass,
    level === "risk" && "bg-yellow-500/20 text-yellow-900 dark:text-yellow-100",
    level === "critical" && "bg-red-500/20 text-red-900 dark:text-red-100",
  );
}

export function ForecastReadinessMatrix() {
  return (
    <Card className={summaryCardInteractive}>
      <CardHeader className={cn(summaryCardHeaderMuted, "space-y-2")}>
        <p className={summaryKicker}>Матрица готовности</p>
        <CardTitle className="text-lg font-semibold">По предметам и классам</CardTitle>
        <CardDescription className="max-w-3xl text-sm leading-relaxed">
          Прогноз по параллелям и STEM: зелёный — опережение программы, жёлтый — риск не успеть
          закрепить темы, красный — высокая вероятность провала ближайшего среза.
        </CardDescription>
        <div className="flex flex-wrap gap-3 pt-2 text-xs">
          <span className="flex items-center gap-2">
            <span className={cn("inline-block size-3 rounded-sm ring-1 ring-[var(--status-success)]/30", admGradeHeatHighClass)} />
            Стабильно
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-sm bg-yellow-500/40 ring-1 ring-yellow-600/30" />
            Риск
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-sm bg-red-500/40 ring-1 ring-red-600/30" />
            Критично
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="rounded-xl bg-muted/20 p-2 ring-1 ring-border/50">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-36 whitespace-normal">Класс</TableHead>
                {forecastSubjectKeys.map((key) => (
                  <TableHead key={key} className="text-center">
                    {forecastSubjectLabels[key as ForecastSubjectKey]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {readinessMatrixRows.map((row) => (
                <TableRow key={row.className}>
                  <TableCell className="whitespace-normal font-medium">{row.className}</TableCell>
                  {forecastSubjectKeys.map((key) => {
                    const k = key as ForecastSubjectKey;
                    const lvl = row.cells[k];
                    return (
                      <TableCell key={k} className={cellClass(lvl)}>
                        {levelLabel[lvl]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
