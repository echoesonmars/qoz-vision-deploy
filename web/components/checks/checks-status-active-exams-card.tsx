import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { activeExams } from "@/lib/data/stubs/checks/status-mock";

export function ChecksStatusActiveExamsCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Монитор срезов</p>
        <CardTitle className="text-lg font-semibold">Активные контрольные</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Прогресс проверки и число спорных моментов.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Предмет</TableHead>
              <TableHead>Класс</TableHead>
              <TableHead>Учитель</TableHead>
              <TableHead>Споры</TableHead>
              <TableHead className="min-w-40">Прогресс</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeExams.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.subject}</TableCell>
                <TableCell>{row.className}</TableCell>
                <TableCell>{row.teacher}</TableCell>
                <TableCell>{row.disputed}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress className="h-2 flex-1" value={row.progressPercent} />
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {row.progressPercent}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
