"use client";

import Link from "next/link";
import { DirectorAlertRow } from "@/components/director/shared/director-alert-row";
import { DirectorSection } from "@/components/director/shared/director-section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DIRECTOR_SECTION_ANCHORS } from "@/lib/director/anchors";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import type { DirectorAlert } from "@/lib/director/types";

type DirectorAttentionSectionProps = {
  alerts: DirectorAlert[] | undefined;
  loading: boolean;
  isMobile: boolean;
};

export function DirectorAttentionSection({
  alerts,
  loading,
  isMobile,
}: DirectorAttentionSectionProps) {
  const visible = alerts
    ?.filter((a) => (isMobile ? a.priority !== "info" : true))
    .slice(0, isMobile ? 3 : 7);

  return (
    <DirectorSection
      id={DIRECTOR_SECTION_ANCHORS.attention}
      kicker="Оперативный контроль"
      title="Требует внимания"
      description="Приоритезированные сигналы с действием и ответственным"
      action={
        <Button asChild variant="outline" size="sm">
          <Link href={DIRECTOR_PATHS.alerts}>Все события</Link>
        </Button>
      }
    >
      {loading ? (
        <Skeleton className="h-24 rounded-xl" />
      ) : visible && visible.length > 0 ? (
        <div className="flex flex-col gap-3">
          {visible.map((alert) => (
            <DirectorAlertRow key={alert.id} alert={alert} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Сегодня всё в норме.</p>
      )}
    </DirectorSection>
  );
}
