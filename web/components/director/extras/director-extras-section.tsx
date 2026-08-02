"use client";

import Link from "next/link";
import { useState } from "react";
import { ExportsPreview } from "@/components/director/extras/exports-preview";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { DirectorSection } from "@/components/director/shared/director-section";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DIRECTOR_SECTION_ANCHORS } from "@/lib/director/anchors";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import type { BenchmarksBlock } from "@/lib/director/types";
import { Skeleton } from "@/components/ui/skeleton";
import { MdExpandMore } from "react-icons/md";

type DirectorExtrasSectionProps = {
  data: BenchmarksBlock | undefined;
  loading: boolean;
  defaultOpen?: boolean;
};

export function DirectorExtrasSection({
  data,
  loading,
  defaultOpen = false,
}: DirectorExtrasSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <DirectorSection
      id={DIRECTOR_SECTION_ANCHORS.extras}
      kicker="По запросу"
      title="Бенчмарки и отчётность УО"
      description="Раскрываемый блок — сравнение с районом и отчёты для управления образованием"
      action={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/director/benchmarks">Бенчмарки</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={DIRECTOR_PATHS.exports}>Отчётность УО</Link>
          </Button>
        </div>
      }
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="mb-4 min-h-11 w-full justify-between">
            {open ? "Свернуть блок" : "Развернуть: бенчмарки и отчётность"}
            <MdExpandMore
              className={`size-5 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-6">
          {loading || !data ? (
            <Skeleton className="h-40 rounded-2xl" />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <DirectorKpiTile
                  label="Место в районе"
                  value={`${data.schoolRank} из ${data.totalSchools}`}
                  status="ok"
                />
                <DirectorKpiTile
                  label="Перцентиль посещаемости"
                  value={`${data.attendancePercentile ?? 72}%`}
                />
                <DirectorKpiTile
                  label="Средняя посещаемость района"
                  value={`${data.districtAvgAttendance}%`}
                />
              </div>
              <ExportsPreview />
              <Button asChild variant="outline" size="sm" className="w-fit">
                <Link href="/overview/republican-cities/almaty">Дэшборд УО (агрегаты)</Link>
              </Button>
            </>
          )}
        </CollapsibleContent>
      </Collapsible>
    </DirectorSection>
  );
}
