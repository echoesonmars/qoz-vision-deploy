"use client";

import Link from "next/link";
import { useState } from "react";
import { DirectorRoleSwitcher } from "@/components/director/settings/director-role-switcher";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { DirectorPageHomeLink } from "@/components/director/shared/director-page-home-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import { buildDashboardHomeHref, useSchoolContext } from "@/lib/hierarchy/school-context";

export function SchoolSettingsClient() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const { school, schoolId } = useSchoolContext();
  const homeHref = buildDashboardHomeHref(schoolId);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: homeHref },
          { label: "Настройки школы" },
        ]}
      />
      <Card className="rounded-2xl ring-1 ring-border/60">
        <CardHeader>
          <CardTitle>Настройки школы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <div>
            <p className="font-medium">{school.name}</p>
            <p className="text-muted-foreground">{school.district}</p>
            <p className="text-muted-foreground">Директор: {school.directorName}</p>
          </div>
          <DirectorRoleSwitcher />
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="push">Push-уведомления</Label>
            <input
              id="push"
              type="checkbox"
              checked={pushEnabled}
              onChange={(e) => setPushEnabled(e.target.checked)}
              className="size-4 accent-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={DIRECTOR_PATHS.permissions}>Матрица доступа</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={DIRECTOR_PATHS.privacy}>Приватность</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={DIRECTOR_PATHS.dataRights}>Права субъектов</Link>
            </Button>
          </div>
          <DirectorPageHomeLink />
        </CardContent>
      </Card>
    </div>
  );
}
