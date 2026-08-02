import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { bottleneckTeachers } from "@/lib/data/stubs/checks/status-mock";
import { MdSchedule } from "react-icons/md";

export function ChecksStatusBottlenecksCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Контроль задержек</p>
        <CardTitle className="text-lg font-semibold">Teacher Bottlenecks</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Очередь на ручное подтверждение по преподавателям (мок).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        {bottleneckTeachers.map((row) => (
          <div
            key={row.teacher}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 ring-1 ring-border/40"
          >
            <div className="flex items-center gap-2">
              <MdSchedule className="text-primary size-5 shrink-0" aria-hidden />
              <span className="font-medium text-foreground">{row.teacher}</span>
            </div>
            <div className="text-muted-foreground flex gap-6 text-sm">
              <span>Очередь: {row.backlog}</span>
              <span>Старейшая: {row.oldestHours} ч</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
