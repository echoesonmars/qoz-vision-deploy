import Link from "next/link";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { directorDetailRepo } from "@/lib/data";

const PRIORITY_LABELS = {
  critical: "Критично",
  attention: "Внимание",
  info: "Информация",
} as const;

export default function DirectorTasksPage() {
  const tasks = directorDetailRepo.getDirectorTasks(directorDetailRepo.getDefaultPeriod());

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Задачи директору" },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Задачи директору</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col gap-3 rounded-xl bg-card/80 p-4 ring-1 ring-border/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{PRIORITY_LABELS[task.priority]}</Badge>
                <span className="text-muted-foreground text-xs">{task.dueLabel}</span>
              </div>
              <p className="text-sm font-medium">{task.title}</p>
            </div>
            {task.href ? (
              <Button asChild size="sm" className="shrink-0">
                <Link href={task.href}>Открыть</Link>
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
