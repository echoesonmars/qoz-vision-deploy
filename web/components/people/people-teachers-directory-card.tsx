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
import type { TeacherRow } from "@/lib/data/stubs/people/teachers-mock";
import { teachersDirectoryRows } from "@/lib/data/stubs/people/teachers-mock";
import { MdSchool } from "react-icons/md";

const columnHelper = createColumnHelper<TeacherRow>();

const columns = [
  columnHelper.accessor("name", { header: "ФИО" }),
  columnHelper.accessor("department", {
    header: "Кафедра",
    cell: ({ getValue }) => {
      const d = getValue();
      return (
        <Badge variant={d === "stem" ? "default" : "secondary"} className="font-normal">
          {d === "stem" ? "STEM" : "Гуманитарные"}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("category", { header: "Категория" }),
  columnHelper.accessor("classes", { header: "Классы / предметы" }),
  columnHelper.accessor("yearsExp", { header: "Стаж, лет" }),
] as ColumnDef<TeacherRow, unknown>[];

export function PeopleTeachersDirectoryCard() {
  const [department, setDepartment] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [classQuery, setClassQuery] = useState("");
  const [yearsMin, setYearsMin] = useState("");

  const filtered = useMemo(() => {
    const yMin = yearsMin === "" ? null : Number(yearsMin);
    return teachersDirectoryRows.filter((row) => {
      if (department !== "all" && row.department !== department) return false;
      if (category !== "all" && row.category !== category) return false;
      if (classQuery.trim() && !row.classes.toLowerCase().includes(classQuery.trim().toLowerCase()))
        return false;
      if (yMin != null && !Number.isNaN(yMin) && row.yearsExp < yMin) return false;
      return true;
    });
  }, [department, category, classQuery, yearsMin]);

  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdSchool className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Реестр
        </p>
        <CardTitle className="text-lg font-semibold">Преподаватели</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Фильтры по кафедре, категории, классу и стажу (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="pf-dept">Кафедра</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="pf-dept" size="sm" className="w-full">
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="stem">STEM</SelectItem>
                <SelectItem value="humanities">Гуманитарные</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pf-cat">Категория</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="pf-cat" size="sm" className="w-full">
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="первая">первая</SelectItem>
                <SelectItem value="вторая">вторая</SelectItem>
                <SelectItem value="высшая">высшая</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pf-class">Класс в строке</Label>
            <Input
              id="pf-class"
              value={classQuery}
              onChange={(e) => setClassQuery(e.target.value)}
              placeholder="напр. 10«А»"
              className="h-8"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pf-years">Стаж от (лет)</Label>
            <Input
              id="pf-years"
              value={yearsMin}
              onChange={(e) => setYearsMin(e.target.value)}
              placeholder="0"
              className="h-8"
              inputMode="numeric"
            />
          </div>
        </div>
        <DataTable columns={columns} data={filtered} getRowId={(r) => r.id} pageSize={6} />
      </CardContent>
    </Card>
  );
}
