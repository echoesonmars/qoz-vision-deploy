import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { taskMetricRows } from "@/lib/data/stubs/checks/bank-mock";

export function ChecksBankTaskMetricsCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Аналитика</p>
        <CardTitle className="text-lg font-semibold">Метрики по заданиям</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Доля провалов по школе — ориентир для адаптации банка (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 pt-0">
        {taskMetricRows.map((row) => (
          <div key={row.taskId} className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium leading-snug">{row.label}</p>
              <span className="text-primary text-sm font-semibold tabular-nums">
                {row.failSchoolPercent}%
              </span>
            </div>
            <Progress value={row.failSchoolPercent} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
