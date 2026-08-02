"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  AuthenticatedAppShell,
  type AppShellUser,
} from "@/components/authenticated-app-shell";
import { DirectorAppShell } from "@/components/director/director-app-shell";
import { isDirectorShellPath } from "@/lib/director/paths";

export function DashboardAppShellRouter({
  user,
  children,
}: {
  user: AppShellUser;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (isDirectorShellPath(pathname)) {
    return <DirectorAppShell>{children}</DirectorAppShell>;
  }

  return <AuthenticatedAppShell user={user}>{children}</AuthenticatedAppShell>;
}
