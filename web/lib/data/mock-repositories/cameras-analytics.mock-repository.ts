import type { ICamerasAnalyticsRepository } from "@/lib/data/contracts";
import { engagementHistoryWeek } from "@/lib/data/stubs/cameras/engagement-history-mock";

export class MockCamerasAnalyticsRepository implements ICamerasAnalyticsRepository {
  getEngagementHistoryWeek() {
    return engagementHistoryWeek;
  }
}
