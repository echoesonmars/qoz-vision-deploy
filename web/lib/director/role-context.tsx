"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DIRECTOR_ROLE_STORAGE_KEY,
  getDefaultDirectorRole,
} from "@/lib/director/role";
import type { DirectorRole } from "@/lib/director/types";

type DirectorRoleContextValue = {
  role: DirectorRole;
  setRole: (role: DirectorRole) => void;
};

const DirectorRoleContext = createContext<DirectorRoleContextValue | null>(null);

function readStoredRole(): DirectorRole {
  if (typeof window === "undefined") return getDefaultDirectorRole();
  const raw = window.localStorage.getItem(DIRECTOR_ROLE_STORAGE_KEY);
  if (
    raw === "director" ||
    raw === "deputy" ||
    raw === "methodist" ||
    raw === "teacher" ||
    raw === "psychologist" ||
    raw === "uo"
  ) {
    return raw;
  }
  return getDefaultDirectorRole();
}

export function DirectorRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<DirectorRole>(readStoredRole);

  const setRole = useCallback((next: DirectorRole) => {
    setRoleState(next);
    window.localStorage.setItem(DIRECTOR_ROLE_STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return (
    <DirectorRoleContext.Provider value={value}>
      {children}
    </DirectorRoleContext.Provider>
  );
}

export function useDirectorRole() {
  const ctx = useContext(DirectorRoleContext);
  if (!ctx) {
    throw new Error("useDirectorRole must be used within DirectorRoleProvider");
  }
  return ctx;
}
