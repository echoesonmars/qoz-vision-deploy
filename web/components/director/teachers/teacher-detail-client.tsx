"use client";

import Link from "next/link";
import { useState } from "react";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { DirectorDisclaimer } from "@/components/director/shared/director-disclaimer";
import { DirectorKpiTile } from "@/components/director/shared/director-kpi-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DirectorMockFeedback } from "@/components/director/shared/director-mock-feedback";
import type { TeacherRecommendation } from "@/lib/director/types";

const CATEGORY_LABELS = {
  mentor_candidate: "Кандидат в наставники",
  method_support: "Методическая поддержка",
  pk_module: "Модуль ПК",
  overload: "Перегрузка",
} as const;

type TeacherDetail = TeacherRecommendation & {
  rights: {
    canViewOwnData: boolean;
    canDispute: boolean;
    canOptOutVideo: boolean;
    videoOptOut: boolean;
  };
  metrics: {
    engagementPercent: number;
    sorSochDelta: number;
    weeklyHours: number;
  };
};

type TeacherDetailClientProps = {
  teacher: TeacherDetail;
};

export function TeacherDetailClient({ teacher }: TeacherDetailClientProps) {
  const [dispute, setDispute] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function submitDispute() {
    setFeedback("Оспаривание отправлено");
    setDispute("");
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Педагоги", href: "/dashboard#teachers" },
          { label: teacher.teacherName },
        ]}
      />
      <DirectorDisclaimer>
        Данные для поддержки педагога, не для рейтинга. Без сравнения с коллегами.
      </DirectorDisclaimer>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{teacher.teacherName}</h1>
          <p className="text-muted-foreground text-sm">
            {teacher.subject} · {teacher.classes} · стаж {teacher.experienceYears} г.
          </p>
          <Badge variant="outline" className="mt-2">
            {CATEGORY_LABELS[teacher.category]}
          </Badge>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DirectorKpiTile
          label="Вовлечённость"
          value={`${teacher.metrics.engagementPercent}%`}
        />
        <DirectorKpiTile
          label="Δ СОР/СОЧ"
          value={`${teacher.metrics.sorSochDelta > 0 ? "+" : ""}${teacher.metrics.sorSochDelta}%`}
          status={teacher.metrics.sorSochDelta >= 0 ? "ok" : "warning"}
        />
        <DirectorKpiTile label="Нагрузка" value={`${teacher.metrics.weeklyHours} ч/нед`} />
      </div>
      <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
        <p className="text-sm font-semibold">Рекомендация</p>
        <p className="mt-2 text-sm">{teacher.reason}</p>
        <p className="mt-2 text-sm">
          <span className="text-muted-foreground">Действие: </span>
          {teacher.action}
        </p>
        <p className="text-muted-foreground mt-2 text-xs">Ответственный: {teacher.responsible}</p>
      </div>
      <DirectorMockFeedback message={feedback} />
      <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
        <p className="mb-3 text-sm font-semibold">Оспорить рекомендацию (§11.6)</p>
        <textarea
          value={dispute}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDispute(e.target.value)}
          placeholder="Комментарий педагога…"
          rows={3}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        />
        <Button type="button" size="sm" className="mt-3" onClick={submitDispute}>
          Отправить
        </Button>
      </div>
    </div>
  );
}
