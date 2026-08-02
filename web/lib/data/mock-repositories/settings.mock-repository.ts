import type { ISettingsRepository } from "@/lib/data/contracts";
import { settingsAuditRows } from "@/lib/data/stubs/settings/audit";

export class MockSettingsRepository implements ISettingsRepository {
  getAuditRows() {
    return settingsAuditRows;
  }
}
