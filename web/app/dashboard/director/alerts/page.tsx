import Link from "next/link";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { DirectorAlertRow } from "@/components/director/shared/director-alert-row";
import { Button } from "@/components/ui/button";
import { getDirectorDashboard } from "@/lib/director/director-data";
import { directorDetailRepo } from "@/lib/data";

export default async function DirectorAlertsPage() {
  const data = await getDirectorDashboard(directorDetailRepo.getDefaultPeriod());

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Все события" },
        ]}
      />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Все события</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {data.alerts.map((alert) => (
          <DirectorAlertRow key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
