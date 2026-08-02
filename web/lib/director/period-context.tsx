"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DirectorPeriod } from "@/lib/director/types";
import { directorDetailRepo } from "@/lib/data";

type DirectorPeriodContextValue = {
  period: DirectorPeriod;
  setPeriod: (period: DirectorPeriod) => void;
};

const DirectorPeriodContext = createContext<DirectorPeriodContextValue | null>(
  null,
);

export function DirectorPeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriodState] = useState<DirectorPeriod>(directorDetailRepo.getDefaultPeriod());

  const setPeriod = useCallback((next: DirectorPeriod) => {
    setPeriodState(next);
  }, []);

  const value = useMemo(
    () => ({
      period,
      setPeriod,
    }),
    [period, setPeriod],
  );

  return (
    <DirectorPeriodContext.Provider value={value}>
      {children}
    </DirectorPeriodContext.Provider>
  );
}

export function useDirectorPeriod() {
  const ctx = useContext(DirectorPeriodContext);
  if (!ctx) {
    throw new Error("useDirectorPeriod must be used within DirectorPeriodProvider");
  }
  return ctx;
}
