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
import { classPerformanceRows } from "@/lib/data/stubs/people/classes-mock";
import { MdBarChart } from "react-icons/md";

export function PeopleClassesPerformanceCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdBarChart
            className="mr-1 inline size-4 align-text-bottom text-primary"
            aria-hidden
          />
          Метрики
        </p>
        <CardTitle className="text-lg font-semibold">Сводка по классам</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Средние баллы и коллективные слепые зоны (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Класс</TableHead>
              <TableHead>Средний балл</TableHead>
              <TableHead>Слепая зона</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classPerformanceRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.classLabel}</TableCell>
                <TableCell className="tabular-nums">{row.avgScore}</TableCell>
                <TableCell className="max-w-xs text-sm text-muted-foreground">
                  {row.blindSpot ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
