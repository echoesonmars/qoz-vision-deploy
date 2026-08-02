"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  filterClasses,
  filterQuarters,
  filterSubjects,
  filterYears,
} from "@/lib/data/stubs/checks/archive-mock";

export function ChecksArchiveFiltersCard() {
  const yearDefault = filterYears[0]?.value ?? "";
  const quarterDefault = filterQuarters[0]?.value ?? "";
  const classDefault = filterClasses[0]?.value ?? "";
  const subjectDefault = filterSubjects[0]?.value ?? "";

  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Поиск по архиву</p>
        <CardTitle className="text-lg font-semibold">Глобальный поиск</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Фильтры по году, четверти, классу, предмету и ученику (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-0 sm:grid-cols-2 lg:grid-cols-4">
        <div className="grid gap-2">
          <Label htmlFor="checks-year">Год</Label>
          <Select defaultValue={yearDefault}>
            <SelectTrigger id="checks-year" size="sm" className="w-full">
              <SelectValue placeholder="Год" />
            </SelectTrigger>
            <SelectContent>
              {filterYears.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="checks-quarter">Четверть</Label>
          <Select defaultValue={quarterDefault}>
            <SelectTrigger id="checks-quarter" size="sm" className="w-full">
              <SelectValue placeholder="Четверть" />
            </SelectTrigger>
            <SelectContent>
              {filterQuarters.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="checks-class">Класс</Label>
          <Select defaultValue={classDefault}>
            <SelectTrigger id="checks-class" size="sm" className="w-full">
              <SelectValue placeholder="Класс" />
            </SelectTrigger>
            <SelectContent>
              {filterClasses.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="checks-subject">Предмет</Label>
          <Select defaultValue={subjectDefault}>
            <SelectTrigger id="checks-subject" size="sm" className="w-full">
              <SelectValue placeholder="Предмет" />
            </SelectTrigger>
            <SelectContent>
              {filterSubjects.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="checks-student">Ученик</Label>
          <Input id="checks-student" placeholder="ФИО или ID" className="h-8" />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="checks-score">Баллы (диапазон)</Label>
          <Input id="checks-score" placeholder="например 8–16" className="h-8" />
        </div>
      </CardContent>
    </Card>
  );
}
