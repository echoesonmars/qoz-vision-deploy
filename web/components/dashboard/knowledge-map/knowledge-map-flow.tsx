"use client";

import {
  Background,
  Controls,
  type Edge,
  MarkerType,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useMemo } from "react";

import type {
  KnowledgeScaleKey,
  KnowledgeStandardKey,
  KnowledgeSubjectKey,
} from "@/lib/data/stubs/dashboard/knowledge-map-mock";
import { getResolvedTopics, knowledgeEdges } from "@/lib/data/stubs/dashboard/knowledge-map-mock";

import type { KnowledgeMapTopicFlowNode } from "./knowledge-map-node-types";
import { KnowledgeMapTopicNode } from "./knowledge-map-topic-node";

const nodeTypes = { topic: KnowledgeMapTopicNode };

type KnowledgeMapFlowProps = {
  subject: KnowledgeSubjectKey;
  scale: KnowledgeScaleKey;
  standard: KnowledgeStandardKey;
  focusedNodeId: string | null;
};

export function useKnowledgeGraph(
  subject: KnowledgeSubjectKey,
  scale: KnowledgeScaleKey,
  standard: KnowledgeStandardKey,
  focusedNodeId: string | null,
) {
  return useMemo(() => {
    const topics = getResolvedTopics(subject, scale, standard);
    const ids = new Set(topics.map((topic) => topic.id));
    const topicById = Object.fromEntries(topics.map((topic) => [topic.id, topic]));

    const spacingX = 220;
    const spacingY = 140;

    const nodes: KnowledgeMapTopicFlowNode[] = topics.map((topic) => ({
      id: topic.id,
      type: "topic",
      position: {
        x: topic.col * spacingX,
        y: topic.row * spacingY,
      },
      draggable: false,
      selectable: true,
      data: {
        ...topic,
        graphSelected: Boolean(focusedNodeId && focusedNodeId === topic.id),
      },
    }));

    const edges: Edge[] = knowledgeEdges
      .filter((edge) => ids.has(edge.source) && ids.has(edge.target))
      .map((edge) => {
        const sourceTopic = topicById[edge.source];
        const blocked = sourceTopic?.masteryLevel === "red";
        return {
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          style: {
            stroke: blocked ? "var(--muted-foreground)" : "var(--primary)",
            strokeWidth: blocked ? 1.25 : 1.75,
            opacity: blocked ? 0.45 : 1,
            strokeDasharray: blocked ? "6 6" : undefined,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: blocked ? "var(--muted-foreground)" : "var(--primary)",
            width: 16,
            height: 16,
          },
        };
      });

    return { nodes, edges };
  }, [subject, scale, standard, focusedNodeId]);
}

export function KnowledgeMapFlow({
  subject,
  scale,
  standard,
  focusedNodeId,
}: KnowledgeMapFlowProps) {
  const { nodes: layoutNodes, edges: layoutEdges } = useKnowledgeGraph(
    subject,
    scale,
    standard,
    focusedNodeId,
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setEdges, setNodes]);

  return (
    <div className="h-full w-full min-h-0 bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        panOnScroll={false}
        zoomOnScroll
        zoomOnPinch
        panOnDrag
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.35}
        maxZoom={1.6}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode="light"
        className="h-full w-full bg-white"
      >
        <MiniMap
          className="max-md:hidden rounded-lg border border-neutral-200 bg-white/95 shadow-sm"
          maskColor="rgba(0,0,0,0.08)"
          nodeStrokeWidth={2}
        />
        <Controls className="rounded-lg border border-neutral-200 bg-white shadow-sm" />
        <Background gap={20} size={1} color="#d4d4d4" />
      </ReactFlow>
    </div>
  );
}
