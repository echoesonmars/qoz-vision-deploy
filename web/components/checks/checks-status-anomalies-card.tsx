import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { anomalies } from "@/lib/data/stubs/checks/status-mock";
import { MdOutlineReportProblem } from "react-icons/md";

export function ChecksStatusAnomaliesCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>ИИ-аппроксимация</p>
        <CardTitle className="text-lg font-semibold">Anomaly Detector</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Предупреждения Sozley по подозрительным работам.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-64 pr-4">
          <ul className="flex flex-col gap-3">
            {anomalies.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-border/60 bg-muted/30 p-4 ring-1 ring-border/40"
              >
                <div className="flex items-start gap-2">
                  <MdOutlineReportProblem className="text-destructive mt-0.5 size-5 shrink-0" aria-hidden />
                  <div>
                    <p className="font-semibold text-foreground">{item.label}</p>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
