import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { summaryCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { settingsRepo } from "@/lib/data";
import { Shield } from "lucide-react";

export default function SettingsAuditPage() {
  const auditRows = settingsRepo.getAuditRows();
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "История действий (Аудит)" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <Card className={summaryCardInteractive}>
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <div className="flex flex-wrap items-start gap-3">
              <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-primary/20">
                <Shield className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 space-y-1">
                <p className={summaryKicker}>Настройки</p>
                <CardTitle className="text-xl font-semibold">История действий (Аудит)</CardTitle>
                <CardDescription className="max-w-3xl text-sm leading-relaxed">
                  Лог безопасности: кто из учителей или завучей заходил на стрим камер, кто вручную
                  менял оценку Sozley. Инструмент против коррупции в цифровой школе.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Время</th>
                    <th className="px-4 py-3 font-medium">Субъект</th>
                    <th className="px-4 py-3 font-medium">Событие</th>
                    <th className="px-4 py-3 font-medium">Зона</th>
                    <th className="px-4 py-3 font-medium">Риск</th>
                  </tr>
                </thead>
                <tbody>
                  {auditRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/40 transition-colors odd:bg-muted/15 hover:bg-muted/35"
                    >
                      <td className="text-muted-foreground px-4 py-3 font-mono text-xs whitespace-nowrap">
                        {row.time}
                      </td>
                      <td className="px-4 py-3">{row.actor}</td>
                      <td className="max-w-md px-4 py-3 leading-relaxed">{row.action}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-normal">
                          {row.scope}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            row.risk === "Высокий" && "text-destructive",
                            row.risk === "Средний" && "text-amber-600 dark:text-amber-500",
                            row.risk === "Низкий" && "text-muted-foreground",
                          )}
                        >
                          {row.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
