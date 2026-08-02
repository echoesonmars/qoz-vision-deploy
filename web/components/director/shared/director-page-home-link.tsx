"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildDashboardHomeHref } from "@/lib/hierarchy/school-context";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import { useSchoolContext } from "@/lib/hierarchy/school-context";

export function DirectorPageHomeLink() {
  const { schoolId } = useSchoolContext();
  const href = schoolId ? buildDashboardHomeHref(schoolId) : DIRECTOR_PATHS.overview;

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={href}>На главный экран</Link>
    </Button>
  );
}
