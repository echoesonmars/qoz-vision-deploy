import type { Node } from "@xyflow/react";
import type { ResolvedTopic } from "@/lib/data/stubs/dashboard/knowledge-map-mock";

export type KnowledgeMapTopicNodeData = ResolvedTopic & { graphSelected: boolean };

export type KnowledgeMapTopicFlowNode = Node<KnowledgeMapTopicNodeData, "topic">;
