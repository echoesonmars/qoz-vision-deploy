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
import { teachingLoadSlots } from "@/lib/data/stubs/people/teachers-mock";
import { MdSchedule } from "react-icons/md";
import { cn } from "@/lib/utils";

function overloadBadge(overload: (typeof teachingLoadSlots)[0]["overload"]) {
  if (overload === "ok") return { label: "норма", variant: "secondary" as const };
  if (overload === "high") return { label: "перегруз", variant: "destructive" as const };
  return { label: "недогруз", variant: "outline" as const };
}

export function PeopleTeachersLoadCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdSchedule className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Нагрузка
        </p>
        <CardTitle className="text-lg font-semibold">Учебная нагрузка</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Часы, классы и индикатор баланса (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 pt-0 sm:grid-cols-1">
        {teachingLoadSlots.map((slot) => {
          const { label, variant } = overloadBadge(slot.overload);
          return (
            <div
              key={slot.id}
              className={cn(
                "flex flex-col gap-2 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between",
                "bg-card/50 ring-1 ring-border/40",
              )}
            >
              <div>
                <p className="text-sm font-semibold">{slot.subject}</p>
                <p className="text-muted-foreground text-sm">{slot.classLabel}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm tabular-nums">{slot.hoursPerWeek} ч / нед</span>
                <Badge variant={variant} className="font-normal">
                  {label}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
