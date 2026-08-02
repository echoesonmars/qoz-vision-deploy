"use client";

import { useMemo } from "react";
import { knowledgeMapRepo } from "@/lib/data";

export function useKnowledgeMapData() {
  return useMemo(() => knowledgeMapRepo.data, []);
}
