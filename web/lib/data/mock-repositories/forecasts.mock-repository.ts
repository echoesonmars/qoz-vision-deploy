import type { IForecastsRepository } from "@/lib/data/contracts";
import * as dashboardForecasts from "@/lib/data/stubs/dashboard/forecasts-mock";
import * as directorForecasts from "@/lib/data/stubs/director/forecasts";

export class MockForecastsRepository implements IForecastsRepository {
  readonly dashboard = dashboardForecasts;
  readonly director = directorForecasts;
}
