"use client";

import { useMemo } from "react";
import type { AnalyticsFilters } from "@/lib/analytics/types";
import { analyticsRepo } from "@/lib/data";

export function useAnalyticsDataset(filters?: AnalyticsFilters) {
  return useMemo(() => analyticsRepo.getDataset(filters), [filters]);
}

export function useAnalyticsFilterOptions() {
  return useMemo(() => analyticsRepo.getFilterOptions(), []);
}

export function useDefaultAnalyticsFilters() {
  return useMemo(() => analyticsRepo.getDefaultFilters(), []);
}
