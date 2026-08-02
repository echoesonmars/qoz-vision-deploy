import type { ExportFilters, ExportRecipientType } from "@/lib/exports/export-types";
import type { IExportsRepository } from "@/lib/data/contracts";
import { aggregateExportData } from "@/lib/exports/aggregate";
import * as exportOptions from "@/lib/data/stubs/exports/export-options-mock";

export class MockExportsRepository implements IExportsRepository {
  buildBundle(type: ExportRecipientType, filters: ExportFilters) {
    return aggregateExportData(type, filters);
  }

  getOptions() {
    return exportOptions;
  }
}
