import Link from "next/link";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { Badge } from "@/components/ui/badge";
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

const RISK_LABELS = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
} as const;

export default function DirectorRiskGroupPage() {
  const students = directorDetailRepo.getRiskGroupStudents(directorDetailRepo.getDefaultPeriod());

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Группа риска" },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Группа риска СОР/СОЧ/МОДО</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ученик</TableHead>
              <TableHead>Класс</TableHead>
              <TableHead>Прогноз</TableHead>
              <TableHead>Δ за месяц</TableHead>
              <TableHead>Пробелы</TableHead>
              <TableHead>Риск</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/dashboard/director/students/${s.id}`}
                    className="hover:text-primary"
                  >
                    {s.fullName}
                  </Link>
                </TableCell>
                <TableCell>{s.classLabel}</TableCell>
                <TableCell>{s.modoForecast}</TableCell>
                <TableCell>{s.deltaMonth}</TableCell>
                <TableCell>{s.gaps.join(", ")}</TableCell>
                <TableCell>
                  <Badge variant={s.riskLevel === "high" ? "destructive" : "outline"}>
                    {RISK_LABELS[s.riskLevel]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button asChild variant="outline" size="sm" className="w-fit">
        <Link href="/dashboard/director/classes/9b-modo-risk">9 «Б» — план МОДО</Link>
      </Button>
    </div>
  );
}
