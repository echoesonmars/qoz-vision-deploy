"use client";

import { useMemo } from "react";
import { camerasAnalyticsRepo } from "@/lib/data";

export function useEngagementHistoryWeek() {
  return useMemo(() => camerasAnalyticsRepo.getEngagementHistoryWeek(), []);
}
