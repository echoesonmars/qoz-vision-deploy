import Link from "next/link";
import { DirectorSection } from "@/components/director/shared/director-section";
import { directorStatusClass } from "@/components/director/shared/director-styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAttendanceStatus } from "@/lib/hierarchy/attendance-status";
import { cn } from "@/lib/utils";

export type OverviewEntityColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type OverviewEntityTableProps<T> = {
  id: string;
  kicker: string;
  title: string;
  description?: string;
  rows: T[];
  columns: OverviewEntityColumn<T>[];
  getRowHref?: (row: T) => string | null;
  getRowKey: (row: T) => string;
};

export function OverviewEntityTable<T>({
  id,
  kicker,
  title,
  description,
  rows,
  columns,
  getRowHref,
  getRowKey,
}: OverviewEntityTableProps<T>) {
  return (
    <DirectorSection id={id} kicker={kicker} title={title} description={description}>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const rowHref = getRowHref?.(row) ?? null;
              return (
                <TableRow key={getRowKey(row)} className="hover:bg-muted/40">
                  {columns.map((column, index) => (
                    <TableCell key={column.key} className={column.className}>
                      {index === 0 && rowHref ? (
                        <Link
                          href={rowHref}
                          className="font-medium text-primary hover:underline"
                        >
                          {column.render(row)}
                        </Link>
                      ) : (
                        <span
                          className={cn(
                            index === 0 && !rowHref ? "font-medium text-muted-foreground" : "",
                          )}
                        >
                          {column.render(row)}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </DirectorSection>
  );
}

export function AttendanceCell({ value }: { value: number }) {
  const status = getAttendanceStatus(value);
  return (
    <span className={cn("tabular-nums", directorStatusClass(status))}>{value}%</span>
  );
}
