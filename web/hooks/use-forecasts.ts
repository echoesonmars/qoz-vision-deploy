"use client";

import { useMemo } from "react";
import { forecastsRepo } from "@/lib/data";

export function useDashboardForecasts() {
  return useMemo(() => forecastsRepo.dashboard, []);
}

export function useDirectorForecasts() {
  return useMemo(() => forecastsRepo.director, []);
}
