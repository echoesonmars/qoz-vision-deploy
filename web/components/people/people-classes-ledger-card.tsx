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
import { classLedgerRows } from "@/lib/data/stubs/people/classes-mock";
import { MdMenuBook } from "react-icons/md";

export function PeopleClassesLedgerCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdMenuBook className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Журнал
        </p>
        <CardTitle className="text-lg font-semibold">Оценки и посещаемость</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Четверть: оценки, пропуски, опоздания (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ученик</TableHead>
              <TableHead>Четверть</TableHead>
              <TableHead>Пропуски</TableHead>
              <TableHead>Опоздания</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classLedgerRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.student}</TableCell>
                <TableCell className="tabular-nums">{row.quarterGrade}</TableCell>
                <TableCell className="tabular-nums">{row.absentDays}</TableCell>
                <TableCell className="tabular-nums">{row.lateCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
