import Link from "next/link";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { directorDetailRepo } from "@/lib/data";

export default function DirectorAttendancePage() {
  const period = directorDetailRepo.getDefaultPeriod();
  const overall = directorDetailRepo.getPeriodScale(period).attendance;
  const rows = directorDetailRepo.getAttendanceByClass(period);
  const attendanceThreshold = directorDetailRepo.getAttendanceThreshold();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Посещаемость" },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Посещаемость</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <DirectorKpiTile
        label="По школе"
        value={`${overall}%`}
        context={`Порог ${attendanceThreshold}%`}
        status={overall >= attendanceThreshold ? "ok" : "warning"}
        className="max-w-xs"
      />
      <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Класс</TableHead>
              <TableHead>Посещаемость</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.classId}>
                <TableCell>
                  <Link
                    href={`/dashboard/director/classes/${row.classId}`}
                    className="font-medium hover:text-primary"
                  >
                    {row.label}
                  </Link>
                </TableCell>
                <TableCell>{row.percent}%</TableCell>
                <TableCell>
                  {row.percent >= attendanceThreshold ? "В норме" : "Ниже порога"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
