import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { getAttendanceStatus } from "@/lib/hierarchy/attendance-status";
import type { HierarchyMetrics } from "@/lib/hierarchy/types";

type OverviewKpiGridProps = {
  metrics: HierarchyMetrics;
};

export function OverviewKpiGrid({ metrics }: OverviewKpiGridProps) {
  const attendanceStatus = getAttendanceStatus(metrics.attendance);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <DirectorKpiTile
        label="Посещаемость"
        value={`${metrics.attendance}%`}
        status={attendanceStatus}
      />
      <DirectorKpiTile label="Школ" value={metrics.totalSchools} />
      <DirectorKpiTile
        label="Учеников"
        value={metrics.totalStudents.toLocaleString("ru-RU")}
      />
      <DirectorKpiTile label="Средний GPA" value={metrics.gpa.toFixed(1)} />
      <DirectorKpiTile label="Инциденты сегодня" value={metrics.incidentsToday} />
    </div>
  );
}
