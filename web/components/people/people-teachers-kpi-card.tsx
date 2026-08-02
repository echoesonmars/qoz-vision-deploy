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
import { teacherKpiDemo } from "@/lib/data/stubs/people/teachers-mock";
import { MdAnalytics } from "react-icons/md";

export function PeopleTeachersKpiCard() {
  const { verificationHoursAvg, manualEditPercent, engagementIndex } = teacherKpiDemo;
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdAnalytics className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          KPI
        </p>
        <CardTitle className="text-lg font-semibold">Эффективность ИИ</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Sozley и вовлечённость по Qoz (агрегат по школе, демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="space-y-2">
          <div className="flex justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Среднее время верификации, ч</span>
            <span className="text-primary font-semibold tabular-nums">{verificationHoursAvg}</span>
          </div>
          <Progress value={Math.min(100, verificationHoursAvg * 25)} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Ручные правки после ИИ, %</span>
            <span className="font-semibold tabular-nums text-foreground">{manualEditPercent}%</span>
          </div>
          <Progress value={manualEditPercent} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Индекс вовлечённости на уроках</span>
            <span className="text-primary font-semibold tabular-nums">
              {Math.round(engagementIndex * 100)}%
            </span>
          </div>
          <Progress value={engagementIndex * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
