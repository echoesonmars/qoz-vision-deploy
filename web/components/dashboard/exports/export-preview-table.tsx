"use client";

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
import { summaryKicker } from "@/components/dashboard/summary-card-shell";
import { getPreviewRows, previewHeaders } from "@/lib/exports/aggregate";
import type { ExportFilters, ExportRecipientType } from "@/lib/exports/export-types";
import { exportTypeLabels } from "@/lib/exports/export-recipients";

type ExportPreviewTableProps = {
  previewType: ExportRecipientType;
  filters: ExportFilters;
};

export function ExportPreviewTable({ previewType, filters }: ExportPreviewTableProps) {
  const headers = previewHeaders(previewType, filters);
  const rows = getPreviewRows(previewType, filters);

  return (
    <Card className="border-0 shadow-sm ring-1 ring-border/60">
      <CardHeader className="border-b border-border/60 bg-muted/30 pb-3">
        <p className={summaryKicker}>Превью</p>
        <CardTitle className="text-base font-semibold">
          Первые строки · {exportTypeLabels[previewType]}
        </CardTitle>
        <CardDescription className="text-sm">
          Обновляется при смене фильтров (демо-данные).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{headers[0]}</TableHead>
              <TableHead>{headers[1]}</TableHead>
              <TableHead>{headers[2]}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={`${row.col1}-${i}`}>
                <TableCell className="font-medium">{row.col1}</TableCell>
                <TableCell>{row.col2}</TableCell>
                <TableCell>{row.col3}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
