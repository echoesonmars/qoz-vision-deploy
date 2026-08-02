"use client";

import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import type { ParentMappingRow } from "@/lib/data/stubs/people/parents-mock";
import { parentMappingRows } from "@/lib/data/stubs/people/parents-mock";
import { MdFamilyRestroom } from "react-icons/md";

const columnHelper = createColumnHelper<ParentMappingRow>();

const columns = [
  columnHelper.accessor("parentName", { header: "Родитель" }),
  columnHelper.accessor("phone", { header: "Телефон" }),
  columnHelper.accessor("children", {
    header: "Дети",
    cell: ({ getValue }) => (
      <span className="max-w-md whitespace-normal text-sm leading-snug">{getValue()}</span>
    ),
  }),
] as ColumnDef<ParentMappingRow, unknown>[];

export function PeopleParentsMappingCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdFamilyRestroom
            className="mr-1 inline size-4 align-text-bottom text-primary"
            aria-hidden
          />
          Связи
        </p>
        <CardTitle className="text-lg font-semibold">Родитель — ученик</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Многодетные семьи и классы (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <DataTable columns={columns} data={parentMappingRows} getRowId={(r) => r.id} pageSize={4} />
      </CardContent>
    </Card>
  );
}
