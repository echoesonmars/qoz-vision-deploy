import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { auditLogRows } from "@/lib/data/stubs/checks/archive-mock";

export function ChecksArchiveAuditCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Аудит</p>
        <CardTitle className="text-lg font-semibold">Журнал правок и оценок</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Ручные вмешательства после оценки ИИ (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Кто</TableHead>
              <TableHead>Было</TableHead>
              <TableHead>Стало</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Причина</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.editedBy}</TableCell>
                <TableCell>{row.beforeScore}</TableCell>
                <TableCell>{row.afterScore}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{row.changedAt}</TableCell>
                <TableCell className="max-w-xs text-sm leading-relaxed">{row.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
