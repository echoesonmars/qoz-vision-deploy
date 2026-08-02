import Link from "next/link";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { directorDetailRepo } from "@/lib/data";

export default function DirectorDecliningClassesPage() {
  const { decliningClasses } = directorDetailRepo.getDecliningClasses(directorDetailRepo.getDefaultPeriod());

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Классы со снижением" },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Классы с устойчивым снижением</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {decliningClasses.map((row) => (
          <Link
            key={row.classId}
            href={`/dashboard/director/classes/${row.classId}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card/80 p-4 ring-1 ring-border/50 transition-colors hover:bg-muted/30"
          >
            <div>
              <p className="font-medium">{row.classLabel}</p>
              <p className="text-muted-foreground text-sm">{row.subject}</p>
            </div>
            <Badge variant="destructive">{row.deltaPercent}%</Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
