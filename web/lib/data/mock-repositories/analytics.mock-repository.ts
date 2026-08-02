import type { AnalyticsFilters } from "@/lib/analytics/types";
import type { IAnalyticsRepository } from "@/lib/data/contracts";
import { getAnalyticsDataset } from "@/lib/data/stubs/analytics/index";
import {
  analyticsFilterOptions,
  DEFAULT_ANALYTICS_FILTERS,
} from "@/lib/data/stubs/analytics/filters";

export class MockAnalyticsRepository implements IAnalyticsRepository {
  getDataset(filters?: AnalyticsFilters) {
    return getAnalyticsDataset(filters);
  }

  getFilterOptions() {
    return analyticsFilterOptions;
  }

  getDefaultFilters() {
    return DEFAULT_ANALYTICS_FILTERS;
  }
}
