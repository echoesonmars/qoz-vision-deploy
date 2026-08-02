import { MockAnalyticsRepository } from "@/lib/data/mock-repositories/analytics.mock-repository";
import { MockCamerasAnalyticsRepository } from "@/lib/data/mock-repositories/cameras-analytics.mock-repository";
import { MockChecksRepository } from "@/lib/data/mock-repositories/checks.mock-repository";
import { MockDirectorDashboardRepository } from "@/lib/data/mock-repositories/director-dashboard.mock-repository";
import { MockDirectorDetailRepository } from "@/lib/data/mock-repositories/director-detail.mock-repository";
import { MockExportsRepository } from "@/lib/data/mock-repositories/exports.mock-repository";
import { MockForecastsRepository } from "@/lib/data/mock-repositories/forecasts.mock-repository";
import { MockHierarchyRepository } from "@/lib/data/mock-repositories/hierarchy.mock-repository";
import { MockIntegrationsRepository } from "@/lib/data/mock-repositories/integrations.mock-repository";
import { MockKnowledgeMapRepository } from "@/lib/data/mock-repositories/knowledge-map.mock-repository";
import { MockPeopleRepository } from "@/lib/data/mock-repositories/people.mock-repository";
import { MockSettingsRepository } from "@/lib/data/mock-repositories/settings.mock-repository";
import { MockSummaryRepository } from "@/lib/data/mock-repositories/summary.mock-repository";

export const hierarchyRepo = new MockHierarchyRepository();
export const integrationsRepo = new MockIntegrationsRepository();
export const directorDashboardRepo = new MockDirectorDashboardRepository(
  hierarchyRepo,
  integrationsRepo,
);
export const directorDetailRepo = new MockDirectorDetailRepository();
export const peopleRepo = new MockPeopleRepository();
export const checksRepo = new MockChecksRepository();
export const analyticsRepo = new MockAnalyticsRepository();
export const exportsRepo = new MockExportsRepository();
export const knowledgeMapRepo = new MockKnowledgeMapRepository();
export const forecastsRepo = new MockForecastsRepository();
export const camerasAnalyticsRepo = new MockCamerasAnalyticsRepository();
export const summaryRepo = new MockSummaryRepository();
export const settingsRepo = new MockSettingsRepository();
