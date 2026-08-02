"use client";

import Link from "next/link";
import {
  DirectorBreadcrumbs,
  type DirectorBreadcrumbItem,
} from "@/components/director/shared/director-breadcrumbs";
import { buildSchoolDashboardBreadcrumbs } from "@/lib/hierarchy/resolvers";
import { useSchoolContext } from "@/lib/hierarchy/school-context";

export function DirectorSchoolBreadcrumbs() {
  const { meta } = useSchoolContext();

  if (!meta) return null;

  const items: DirectorBreadcrumbItem[] = buildSchoolDashboardBreadcrumbs(meta).map(
    (item, index, array) => ({
      label: item.label,
      href: index < array.length - 1 ? item.href : undefined,
    }),
  );

  return <DirectorBreadcrumbs items={items} />;
}

export function DirectorBackToSchoolsLink() {
  const { meta, backHref } = useSchoolContext();

  if (!meta) return null;

  return (
    <Link
      href={backHref}
      className="text-muted-foreground hover:text-primary inline-flex min-h-11 items-center gap-1 text-sm"
    >
      ← К списку школ
    </Link>
  );
}
