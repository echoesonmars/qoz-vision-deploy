"use client";

import { useMemo } from "react";
import { checksRepo } from "@/lib/data";

export function useChecksBank() {
  return useMemo(() => checksRepo.bank, []);
}

export function useChecksArchive() {
  return useMemo(() => checksRepo.archive, []);
}

export function useChecksStatus() {
  return useMemo(() => checksRepo.status, []);
}
