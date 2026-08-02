"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AnalyticsFilters, AnalyticsSection } from "@/lib/analytics/types";
import {
  useAnalyticsDataset,
  useAnalyticsFilterOptions,
  useDefaultAnalyticsFilters,
} from "@/hooks/use-analytics-dataset";
import { parseDashboardNavigation } from "@/lib/navigation/app-navigation";
import type { analyticsRepo } from "@/lib/data/registry";

type AnalyticsFiltersContextValue = {
  filters: AnalyticsFilters;
  section?: AnalyticsSection;
  options: ReturnType<typeof analyticsRepo.getFilterOptions>;
  dataset: ReturnType<typeof analyticsRepo.getDataset>;
  setFilter: (key: keyof AnalyticsFilters, value: string | undefined) => void;
  setSection: (section: AnalyticsSection) => void;
  resetFilters: () => void;
};

const AnalyticsFiltersContext = createContext<AnalyticsFiltersContextValue | null>(
  null,
);

export function AnalyticsFiltersProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parsed = parseDashboardNavigation(searchParams);
  const defaultFilters = useDefaultAnalyticsFilters();
  const filterOptions = useAnalyticsFilterOptions();

  const filters: AnalyticsFilters = useMemo(
    () => ({
      date: parsed.filters.date ?? defaultFilters.date,
      room: parsed.filters.room ?? defaultFilters.room,
      lesson: parsed.filters.lesson ?? defaultFilters.lesson,
      classId: parsed.filters.classId ?? defaultFilters.classId,
      studentId: parsed.filters.studentId,
      studentName: parsed.filters.studentName,
      location: parsed.filters.location,
      view: parsed.filters.view ?? "actions",
      subject: parsed.filters.subject,
    }),
    [parsed.filters, defaultFilters],
  );
  const dataset = useAnalyticsDataset(filters);

  const updateParams = useCallback(
    (next: Partial<AnalyticsFilters> & { section?: AnalyticsSection }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "analytics");
      const merged = { ...filters, ...next };
      if (next.section) params.set("section", next.section);
      if (merged.date) params.set("date", merged.date);
      else params.delete("date");
      if (merged.room) params.set("room", merged.room);
      else params.delete("room");
      if (merged.lesson) params.set("lesson", merged.lesson);
      else params.delete("lesson");
      if (merged.classId) params.set("class", merged.classId);
      else params.delete("class");
      if (merged.studentId) params.set("student", merged.studentId);
      else params.delete("student");
      if (merged.location) params.set("location", merged.location);
      else params.delete("location");
      if (merged.view) params.set("view", merged.view);
      else params.delete("view");
      if (merged.subject) params.set("subject", merged.subject);
      else params.delete("subject");
      router.replace(`/dashboard?${params.toString()}`);
    },
    [filters, router, searchParams],
  );

  const setFilter = useCallback(
    (key: keyof AnalyticsFilters, value: string | undefined) => {
      updateParams({ [key]: value });
    },
    [updateParams],
  );

  const setSection = useCallback(
    (section: AnalyticsSection) => {
      updateParams({ section });
    },
    [updateParams],
  );

  const resetFilters = useCallback(() => {
    updateParams({
      date: defaultFilters.date,
      room: defaultFilters.room,
      lesson: defaultFilters.lesson,
      classId: defaultFilters.classId,
      studentId: undefined,
      location: undefined,
      subject: undefined,
    });
  }, [defaultFilters, updateParams]);

  const value = useMemo(
    () => ({
      filters,
      section: parsed.section,
      options: filterOptions,
      dataset,
      setFilter,
      setSection,
      resetFilters,
    }),
    [filters, parsed.section, filterOptions, dataset, setFilter, setSection, resetFilters],
  );

  return (
    <AnalyticsFiltersContext.Provider value={value}>
      {children}
    </AnalyticsFiltersContext.Provider>
  );
}

export function useAnalyticsFilters() {
  const ctx = useContext(AnalyticsFiltersContext);
  if (!ctx) {
    throw new Error("useAnalyticsFilters must be used within AnalyticsFiltersProvider");
  }
  return ctx;
}
