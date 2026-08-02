import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  directorKicker,
  directorMetricValue,
  directorSectionCard,
  directorStatusClass,
} from "@/components/director/shared/director-styles";
import {
  admActiveBadgeClass,
  admActiveRingClass,
  admActiveSurfaceClass,
} from "@/lib/brand/ui-classes";
import { getAttendanceStatus } from "@/lib/hierarchy/attendance-status";
import { OVERVIEW_PATHS } from "@/lib/hierarchy/paths";
import type { HierarchyRegion } from "@/lib/hierarchy/types";
import { cn } from "@/lib/utils";
import { MdChevronRight, MdMap } from "react-icons/md";

type OverviewRegionGridProps = {
  regions: HierarchyRegion[];
};

export function OverviewRegionGrid({ regions }: OverviewRegionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {regions.map((region) => {
        const attendanceStatus = getAttendanceStatus(region.metrics.attendance);
        const isActive = region.isActive === true;
        return (
          <Link key={region.id} href={OVERVIEW_PATHS.region(region.id)} className="group">
            <Card
              className={cn(
                directorSectionCard,
                "h-full transition-colors hover:bg-muted/30",
                isActive && cn(admActiveSurfaceClass, admActiveRingClass),
              )}
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1",
                        isActive
                          ? cn("ring-1", admActiveBadgeClass)
                          : "bg-primary/10 text-primary ring-primary/20",
                      )}
                    >
                      <MdMap className="size-5" aria-hidden />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold group-hover:text-primary">{region.name}</p>
                        {isActive ? (
                          <Badge className={admActiveBadgeClass}>
                            Активный
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {region.cities.length} городов · {region.metrics.totalSchools} школ
                      </p>
                    </div>
                  </div>
                  <MdChevronRight
                    className="text-muted-foreground size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={directorKicker}>Посещаемость</p>
                    <p className={cn(directorMetricValue, directorStatusClass(attendanceStatus))}>
                      {region.metrics.attendance}%
                    </p>
                  </div>
                  <div>
                    <p className={directorKicker}>Учеников</p>
                    <p className={directorMetricValue}>
                      {region.metrics.totalStudents.toLocaleString("ru-RU")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
