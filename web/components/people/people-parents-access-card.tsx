import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { parentCredentialActions } from "@/lib/data/stubs/people/parents-mock";
import { MdVpnKey } from "react-icons/md";

export function PeopleParentsAccessCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdVpnKey className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Доступы
        </p>
        <CardTitle className="text-lg font-semibold">Учётные записи</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Портал родителя и уведомления (демо, без реального Supabase).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        {parentCredentialActions.map((action) => (
          <div
            key={action.id}
            className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-semibold">{action.label}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{action.hint}</p>
            </div>
            <Button type="button" size="sm" className="shrink-0 bg-primary text-primary-foreground">
              Открыть
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
