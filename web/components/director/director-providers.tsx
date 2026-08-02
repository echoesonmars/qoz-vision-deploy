"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { DirectorLocaleProvider } from "@/lib/director/i18n/locale-context";
import { DirectorPeriodProvider } from "@/lib/director/period-context";
import { DirectorRoleProvider } from "@/lib/director/role-context";
import { SchoolContextProvider } from "@/lib/hierarchy/school-context";

export function DirectorProviders({ children }: { children: ReactNode }) {
  return (
    <DirectorLocaleProvider>
      <DirectorRoleProvider>
        <DirectorPeriodProvider>
          <Suspense fallback={null}>
            <SchoolContextProvider>{children}</SchoolContextProvider>
          </Suspense>
        </DirectorPeriodProvider>
      </DirectorRoleProvider>
    </DirectorLocaleProvider>
  );
}
