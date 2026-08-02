import Link from "next/link";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { DirectorPageShell } from "@/components/director/shared/director-page-shell";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { directorDetailRepo } from "@/lib/data";

export default function DirectorBenchmarksPage() {
  const summary = directorDetailRepo.getBenchmarksBlock(directorDetailRepo.getDefaultPeriod());
  const rows = directorDetailRepo.getBenchmarkRows();

  return (
    <DirectorPageShell
      breadcrumbs={[
        { label: "Главный экран", href: "/dashboard" },
        { label: "Бенчмарки" },
      ]}
      title="Бенчмарки района"
      description="Сравнение ОШ №147 с школами Бостандыкского района"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DirectorKpiTile
          label="Место в районе"
          value={`${summary.schoolRank} / ${summary.totalSchools}`}
          status="ok"
        />
        <DirectorKpiTile label="Перцентиль посещаемости" value={`${summary.attendancePercentile}%`} />
        <DirectorKpiTile label="Средняя посещаемость района" value={`${summary.districtAvgAttendance}%`} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[
          { label: "Посещаемость", value: 72 },
          { label: "СОР/СОЧ", value: 68 },
          { label: "ЕНТ pass", value: 61 },
          { label: "Инфраструктура", value: 55 },
        ].map((row) => (
          <div key={row.label} className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
            <div className="mb-2 flex justify-between text-sm">
              <span>{row.label} — перцентиль</span>
              <span className="tabular-nums">{row.value}%</span>
            </div>
            <Progress value={row.value} className="h-2" />
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Школа</TableHead>
              <TableHead>Посещ.</TableHead>
              <TableHead>СОР/СОЧ</TableHead>
              <TableHead>ЕНТ</TableHead>
              <TableHead>Инц.</TableHead>
              <TableHead>Инфра</TableHead>
              <TableHead>Район</TableHead>
              <TableHead>Город</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.school}>
                <TableCell className="font-medium">{row.school}</TableCell>
                <TableCell>{row.attendance}%</TableCell>
                <TableCell>{row.sorSoch}</TableCell>
                <TableCell>{row.entPass}%</TableCell>
                <TableCell>{row.incidents}</TableCell>
                <TableCell>{row.infrastructure}%</TableCell>
                <TableCell>#{row.districtRank}</TableCell>
                <TableCell>#{row.cityRank}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Link href="/dashboard#extras" className="text-primary text-sm hover:underline">
        ← К блоку на главном экране
      </Link>
    </DirectorPageShell>
  );
}
