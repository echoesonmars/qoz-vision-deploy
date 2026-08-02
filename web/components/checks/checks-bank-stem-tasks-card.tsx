import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { stemTasks } from "@/lib/data/stubs/checks/bank-mock";
import { cn } from "@/lib/utils";

function difficultyRu(d: (typeof stemTasks)[0]["difficulty"]) {
  if (d === "easy") return "базовый";
  if (d === "medium") return "средний";
  return "повышенный";
}

export function ChecksBankStemTasksCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Банк</p>
        <CardTitle className="text-lg font-semibold">STEM задания</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Карточки с превью условия и шкалой рубрики (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-0 sm:grid-cols-2">
        {stemTasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex flex-col gap-2 rounded-xl border border-border/60 bg-card/50 p-4",
              "ring-1 ring-border/40 transition-all hover:-translate-y-0.5 hover:ring-primary/25",
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                {task.subject}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {difficultyRu(task.difficulty)}
              </Badge>
              <span className="text-muted-foreground ml-auto text-xs">
                до {task.rubricPoints} б.
              </span>
            </div>
            <p className="text-sm font-semibold leading-snug">{task.title}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{task.preview}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
