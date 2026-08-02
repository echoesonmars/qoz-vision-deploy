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
import { recommendedActions } from "@/lib/data/stubs/dashboard/forecasts-mock";
import { cn } from "@/lib/utils";
import { MdLightbulbOutline } from "react-icons/md";

export function ForecastRecommendedActions() {
  return (
    <Card className={summaryCardInteractive}>
      <CardHeader className={cn(summaryCardHeaderMuted, "space-y-2")}>
        <div className="flex items-start gap-3">
          <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-primary/20">
            <MdLightbulbOutline className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-1">
            <p className={summaryKicker}>Рекомендованные действия</p>
            <CardTitle className="text-lg font-semibold">Планы интервенций от ИИ</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Конкретные шаги для расписания и педагогов, чтобы сгладить негативные тренды.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-2">
        {recommendedActions.map((item) => (
          <div
            key={item.id}
            className={cn(
              "bg-card/80 rounded-xl border-l-4 border-l-primary p-4 ring-1 ring-border/50",
              "transition-all duration-200 hover:bg-muted/50 hover:shadow-sm hover:ring-primary/15",
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <MdLightbulbOutline className="text-primary size-4 shrink-0" aria-hidden />
              <Badge variant="outline" className="font-normal">
                ИИ-сценарий
              </Badge>
            </div>
            <p className="text-muted-foreground mt-3 border-t border-border/40 pt-3 text-sm leading-relaxed">
              {item.body}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
