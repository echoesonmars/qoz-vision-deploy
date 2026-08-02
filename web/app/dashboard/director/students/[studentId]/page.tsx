import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { DirectorPageShell } from "@/components/director/shared/director-page-shell";
import { Badge } from "@/components/ui/badge";
import { directorDetailRepo } from "@/lib/data";

type PageProps = {
  params: Promise<{ studentId: string }>;
};

const RISK_LABELS = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
} as const;

export default async function DirectorStudentPage({ params }: PageProps) {
  const { studentId } = await params;
  const student = directorDetailRepo.getStudentDetail(studentId);
  if (!student) notFound();

  return (
    <DirectorPageShell
      breadcrumbs={[
        { label: "Главный экран", href: "/dashboard" },
        { label: "Группа риска", href: "/dashboard/director/risk-group" },
        { label: student.fullName },
      ]}
      title={student.fullName}
      description={`${student.classLabel} · КР: ${student.homeroom}`}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DirectorKpiTile label="Прогноз" value={student.modoForecast} />
        <DirectorKpiTile
          label="Δ за месяц"
          value={student.deltaMonth}
          status={student.deltaMonth < 0 ? "warning" : "ok"}
        />
        <DirectorKpiTile label="Посещаемость" value={`${student.attendancePercent}%`} />
      </div>
      <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
        <p className="mb-2 text-sm font-semibold">Ключевые пробелы</p>
        <div className="flex flex-wrap gap-2">
          {student.gaps.map((gap) => (
            <Badge key={gap} variant="outline">
              {gap}
            </Badge>
          ))}
        </div>
        <Badge
          variant={student.riskLevel === "high" ? "destructive" : "outline"}
          className="mt-3"
        >
          Риск: {RISK_LABELS[student.riskLevel]}
        </Badge>
      </div>
      <Link
        href={`/dashboard/director/classes/9b-modo-risk`}
        className="text-primary text-sm hover:underline"
      >
        План поддержки класса →
      </Link>
    </DirectorPageShell>
  );
}
