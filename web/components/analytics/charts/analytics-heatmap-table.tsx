"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PerformanceHeatmapData, PerformanceSubject } from "@/lib/analytics/types";
import {
  admFocusRingClass,
  admGradeHeatHighClass,
  admGradeHeatMidClass,
  admStatusSuccessTextClass,
} from "@/lib/brand/ui-classes";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { cn } from "@/lib/utils";

const SUBJECTS: PerformanceSubject[] = [
  "algebra",
  "biology",
  "literature",
  "physics",
  "chemistry",
];

function gradeCellClass(grade: number): string {
  if (grade >= 4.5) return admGradeHeatHighClass;
  if (grade >= 4) return admGradeHeatMidClass;
  if (grade >= 3.5) return "bg-[var(--status-warning)]/20 text-foreground";
  if (grade >= 3) return "bg-[var(--status-warning)]/30 text-foreground";
  return "bg-destructive/20 text-foreground";
}

type AnalyticsHeatmapTableProps = {
  data: PerformanceHeatmapData;
};

export function AnalyticsHeatmapTable({ data }: AnalyticsHeatmapTableProps) {
  const { navigate } = useAppNavigation();

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[140px]">Ученик</TableHead>
            {SUBJECTS.map((s) => (
              <TableHead key={s} className="text-center">
                {data.subjectLabels[s]}
              </TableHead>
            ))}
            <TableHead className="text-center">Среднее</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.students.map((row) => (
            <TableRow key={row.studentId}>
              <TableCell className="font-medium">{row.name}</TableCell>
              {SUBJECTS.map((subject) => (
                <TableCell key={subject} className="p-1">
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-lg px-2 py-2 text-center text-sm font-medium tabular-nums",
                      "transition-opacity hover:opacity-80 focus-visible:outline-none",
                      admFocusRingClass,
                      gradeCellClass(row.grades[subject]),
                    )}
                    onClick={() =>
                      navigate({
                        to: "dashboard",
                        tab: "analytics",
                        section: "lesson",
                        filters: {
                          studentId: row.studentId,
                          subject,
                          view: "actions",
                        },
                      })
                    }
                  >
                    {row.grades[subject].toFixed(1)}
                  </button>
                </TableCell>
              ))}
              <TableCell className="text-center font-semibold tabular-nums">
                {row.average.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/40 font-semibold">
            <TableCell>Среднее</TableCell>
            {SUBJECTS.map((s) => (
              <TableCell key={s} className="text-center tabular-nums">
                {data.subjectAverages[s].toFixed(2)}
              </TableCell>
            ))}
            <TableCell className={cn("text-center tabular-nums", admStatusSuccessTextClass)}>
              {data.overallAverage.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
