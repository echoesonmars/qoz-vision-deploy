import { DirectorPageShell } from "@/components/director/shared/director-page-shell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PERMISSION_MATRIX } from "@/lib/director/permissions";

export default function SettingsPermissionsPage() {
  return (
    <DirectorPageShell
      breadcrumbs={[
        { label: "Главный экран", href: "/dashboard" },
        { label: "Настройки", href: "/dashboard/settings/school" },
        { label: "Права доступа" },
      ]}
      title="Матрица доступа (§14)"
      description="Read-only для демо ролей"
    >
      <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Секция</TableHead>
              <TableHead>Директор</TableHead>
              <TableHead>Завуч</TableHead>
              <TableHead>Методист</TableHead>
              <TableHead>Учитель</TableHead>
              <TableHead>Психолог</TableHead>
              <TableHead>УО</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSION_MATRIX.map((row) => (
              <TableRow key={row.section}>
                <TableCell className="font-medium">{row.section}</TableCell>
                <TableCell>{row.director ? "✓" : "—"}</TableCell>
                <TableCell>{row.deputy ? "✓" : "—"}</TableCell>
                <TableCell>{row.methodist ? "✓" : "—"}</TableCell>
                <TableCell>{row.teacher ? "✓" : "—"}</TableCell>
                <TableCell>{row.psychologist ? "✓" : "—"}</TableCell>
                <TableCell>{row.uo ? "✓" : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DirectorPageShell>
  );
}
