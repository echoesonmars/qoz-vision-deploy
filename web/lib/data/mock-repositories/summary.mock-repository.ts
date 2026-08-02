import type { ISummaryRepository } from "@/lib/data/contracts";
import * as summary from "@/lib/data/stubs/dashboard/summary-mock";

export class MockSummaryRepository implements ISummaryRepository {
  readonly data = summary;
}
