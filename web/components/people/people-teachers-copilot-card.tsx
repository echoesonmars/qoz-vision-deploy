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
import { copilotStats } from "@/lib/data/stubs/people/teachers-mock";
import { MdAutoAwesome } from "react-icons/md";

export function PeopleTeachersCopilotCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdAutoAwesome className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Copilot
        </p>
        <CardTitle className="text-lg font-semibold">Логи ИИ-ассистента</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Планы, методички и варианты тестов (демо-счётчики).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-4 sm:grid-cols-3">
          {copilotStats.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border/60 bg-muted/20 p-4 text-center ring-1 ring-border/40"
            >
              <p className="text-primary text-2xl font-semibold tabular-nums">{item.count}</p>
              <p className="text-muted-foreground mt-1 text-sm leading-snug">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
