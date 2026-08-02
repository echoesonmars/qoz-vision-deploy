"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getDefaultSchoolBackHref,
  getDefaultSchoolId,
  resolveSchoolForDashboard,
  resolveSchoolMeta,
} from "@/lib/hierarchy/resolvers";
import { OVERVIEW_PATHS } from "@/lib/hierarchy/paths";
import type { ResolvedSchoolMeta } from "@/lib/hierarchy/types";
import type { School } from "@/lib/director/types";

const SELECTED_SCHOOL_KEY = "qv_selected_school";
const HIERARCHY_BACK_KEY = "qv_hierarchy_back";

type SchoolContextValue = {
  schoolId: string | null;
  school: School;
  meta: ResolvedSchoolMeta | null;
  backHref: string;
  setSchoolContext: (schoolId: string, backHref: string) => void;
};

const SchoolContext = createContext<SchoolContextValue | null>(null);

function readStoredSchoolId(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(SELECTED_SCHOOL_KEY);
}

function readStoredBackHref(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(HIERARCHY_BACK_KEY);
}

export function SchoolContextProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSchoolId = searchParams.get("school");
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [backHref, setBackHref] = useState<string>(OVERVIEW_PATHS.country);

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) {
      const nextSchoolId = urlSchoolId ?? readStoredSchoolId() ?? getDefaultSchoolId();
      const urlBack = searchParams.get("back");
      const storedBack = readStoredBackHref();
      const meta = resolveSchoolMeta(nextSchoolId);
      const nextBackHref = urlBack ?? storedBack ?? getDefaultSchoolBackHref(meta);
      setSchoolId(nextSchoolId);
      setBackHref(nextBackHref);
      window.sessionStorage.setItem(SELECTED_SCHOOL_KEY, nextSchoolId);
      window.sessionStorage.setItem(HIERARCHY_BACK_KEY, nextBackHref);
    }
  }, [pathname, urlSchoolId, searchParams]);

  const setSchoolContext = useCallback((nextSchoolId: string, nextBackHref: string) => {
    setSchoolId(nextSchoolId);
    setBackHref(nextBackHref);
    window.sessionStorage.setItem(SELECTED_SCHOOL_KEY, nextSchoolId);
    window.sessionStorage.setItem(HIERARCHY_BACK_KEY, nextBackHref);
  }, []);

  const meta = useMemo(() => resolveSchoolMeta(schoolId), [schoolId]);
  const school = useMemo(() => resolveSchoolForDashboard(schoolId), [schoolId]);

  const value = useMemo(
    () => ({
      schoolId,
      school,
      meta,
      backHref,
      setSchoolContext,
    }),
    [schoolId, school, meta, backHref, setSchoolContext],
  );

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
}

export function useSchoolContext() {
  const ctx = useContext(SchoolContext);
  if (!ctx) {
    throw new Error("useSchoolContext must be used within SchoolContextProvider");
  }
  return ctx;
}

export function buildDashboardHomeHref(schoolId: string | null): string {
  if (!schoolId) return OVERVIEW_PATHS.country;
  return OVERVIEW_PATHS.schoolDashboard(schoolId);
}
