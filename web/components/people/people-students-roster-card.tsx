"use client";

import { useMemo, useState } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { Badge } from "@/components/ui/badge";
import type { StudentRow } from "@/lib/data/stubs/people/students-mock";
import { studentsRosterRows } from "@/lib/data/stubs/people/students-mock";
import { MdGroups } from "react-icons/md";

const columnHelper = createColumnHelper<StudentRow>();

function bandLabel(b: StudentRow["performanceBand"]) {
  if (b === "high") return "высокий";
  if (b === "mid") return "средний";
  return "низкий";
}

const columns = [
  columnHelper.accessor("name", { header: "Ученик" }),
  columnHelper.accessor("parallel", { header: "Параллель" }),
  columnHelper.accessor("className", { header: "Класс" }),
  columnHelper.accessor("performanceBand", {
    header: "Уровень",
    cell: ({ getValue }) => (
      <span className="text-sm">{bandLabel(getValue())}</span>
    ),
  }),
  columnHelper.accessor("earlyWarning", {
    header: "Риск",
    cell: ({ getValue }) =>
      getValue() ? (
        <Badge variant="destructive" className="font-normal">
          Early Warning
        </Badge>
      ) : (
        <Badge variant="secondary" className="font-normal">
          —
        </Badge>
      ),
  }),
] as ColumnDef<StudentRow, unknown>[];

type PeopleStudentsRosterCardProps = {
  selectedRowId: string;
  onSelectStudent: (id: string) => void;
};

export function PeopleStudentsRosterCard({ selectedRowId, onSelectStudent }: PeopleStudentsRosterCardProps) {
  const [parallel, setParallel] = useState<string>("all");
  const [classQ, setClassQ] = useState("");
  const [band, setBand] = useState<string>("all");
  const [ewOnly, setEwOnly] = useState<string>("all");

  const filtered = useMemo(() => {
    return studentsRosterRows.filter((row) => {
      if (parallel !== "all" && row.parallel !== parallel) return false;
      if (band !== "all" && row.performanceBand !== band) return false;
      if (ewOnly === "yes" && !row.earlyWarning) return false;
      if (ewOnly === "no" && row.earlyWarning) return false;
      if (classQ.trim() && !row.className.toLowerCase().includes(classQ.trim().toLowerCase()))
        return false;
      return true;
    });
  }, [parallel, classQ, band, ewOnly]);

  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdGroups className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Реестр
        </p>
        <CardTitle className="text-lg font-semibold">Учащиеся</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Фильтры и выбор строки для цифрового двойника (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="st-par">Параллель</Label>
            <Select value={parallel} onValueChange={setParallel}>
              <SelectTrigger id="st-par" size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="11">11</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="st-class">Класс</Label>
            <Input
              id="st-class"
              value={classQ}
              onChange={(e) => setClassQ(e.target.value)}
              placeholder="10«А»"
              className="h-8"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="st-band">Успеваемость</Label>
            <Select value={band} onValueChange={setBand}>
              <SelectTrigger id="st-band" size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="high">высокий</SelectItem>
                <SelectItem value="mid">средний</SelectItem>
                <SelectItem value="low">низкий</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="st-ew">Early Warning</Label>
            <Select value={ewOnly} onValueChange={setEwOnly}>
              <SelectTrigger id="st-ew" size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="yes">только риск</SelectItem>
                <SelectItem value="no">без риска</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filtered}
          getRowId={(r) => r.id}
          pageSize={6}
          selectedRowId={selectedRowId}
          onRowClick={(row) => onSelectStudent(row.id)}
        />
      </CardContent>
    </Card>
  );
}
