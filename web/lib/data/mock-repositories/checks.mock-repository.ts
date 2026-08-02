import type { IChecksRepository } from "@/lib/data/contracts";
import * as bank from "@/lib/data/stubs/checks/bank-mock";
import * as archive from "@/lib/data/stubs/checks/archive-mock";
import * as status from "@/lib/data/stubs/checks/status-mock";

export class MockChecksRepository implements IChecksRepository {
  readonly bank = bank;
  readonly archive = archive;
  readonly status = status;
}
