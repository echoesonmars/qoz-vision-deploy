"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getStudentTwin, studentsRosterRows } from "@/lib/data/stubs/people/students-mock";
import { PeopleStudentsPrescriptionCard } from "@/components/people/people-students-prescription-card";
import { PeopleStudentsRosterCard } from "@/components/people/people-students-roster-card";
import { PeopleStudentsTwinCard } from "@/components/people/people-students-twin-card";
import { PeopleStudentsVisionCard } from "@/components/people/people-students-vision-card";
import { Button } from "@/components/ui/button";

export function PeopleStudentsView() {
  const searchParams = useSearchParams();
  const initialId =
    searchParams.get("student") ?? studentsRosterRows[0]?.id ?? "perf-01";
  const [selectedId, setSelectedId] = useState(initialId);
  const twin = useMemo(() => getStudentTwin(selectedId), [selectedId]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {studentsRosterRows.length} учеников в реестре школы
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard?tab=analytics&section=lesson&student=${selectedId}`}>
            Аналитика урока
          </Link>
        </Button>
      </div>
      <PeopleStudentsRosterCard selectedRowId={selectedId} onSelectStudent={setSelectedId} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
        <PeopleStudentsTwinCard twin={twin} />
        <PeopleStudentsVisionCard visionSeries={twin.visionSeries} />
      </div>
      <PeopleStudentsPrescriptionCard items={twin.prescriptionItems} />
    </>
  );
}
