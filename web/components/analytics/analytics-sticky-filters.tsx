"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalyticsFilters } from "@/components/analytics/analytics-filters-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { MdFilterAlt, MdRefresh } from "react-icons/md";

export function AnalyticsStickyFilters() {
  const { filters, options, setFilter, resetFilters } = useAnalyticsFilters();
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 z-20 rounded-2xl bg-background/95 p-4 shadow-sm ring-1 ring-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MdFilterAlt className="size-4 text-primary" aria-hidden />
          <span className="text-sm font-medium">Фильтры урока</span>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
          <MdRefresh className="mr-1 size-4" aria-hidden />
          Сбросить
        </Button>
      </div>
      <div
        className={
          isMobile
            ? "grid grid-cols-2 gap-3"
            : "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
        }
      >
        <FilterSelect
          label="Дата"
          value={filters.date ?? ""}
          options={options.dates}
          onChange={(v) => setFilter("date", v)}
        />
        <FilterSelect
          label="Кабинет"
          value={filters.room ?? ""}
          options={options.rooms}
          onChange={(v) => setFilter("room", v)}
        />
        <FilterSelect
          label="Урок №"
          value={filters.lesson ?? ""}
          options={options.lessons}
          onChange={(v) => setFilter("lesson", v)}
        />
        <FilterSelect
          label="Класс"
          value={filters.classId ?? ""}
          options={options.classes}
          onChange={(v) => setFilter("classId", v)}
        />
        {!isMobile ? (
          <FilterSelect
            label="Ученик"
            value={filters.studentId ?? "all"}
            options={[
              { value: "all", label: "Все ученики" },
              ...options.students.filter((s) => s.classId === filters.classId),
            ]}
            onChange={(v) => setFilter("studentId", v === "all" ? undefined : v)}
          />
        ) : null}
        {!isMobile ? (
          <FilterSelect
            label="Локация"
            value={filters.location ?? "all"}
            options={[{ value: "all", label: "Все зоны" }, ...options.locations]}
            onChange={(v) => setFilter("location", v === "all" ? undefined : v)}
          />
        ) : null}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
