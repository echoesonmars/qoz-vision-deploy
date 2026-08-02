import type { IKnowledgeMapRepository } from "@/lib/data/contracts";
import * as knowledgeMap from "@/lib/data/stubs/dashboard/knowledge-map-mock";

export class MockKnowledgeMapRepository implements IKnowledgeMapRepository {
  readonly data = knowledgeMap;
}
