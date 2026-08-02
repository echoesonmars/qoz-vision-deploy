"use client";

import Link from "next/link";
import { useState } from "react";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DirectorMockFeedback } from "@/components/director/shared/director-mock-feedback";
import { formatIntegrationActorLabel } from "@/lib/brand/integration-labels";
import {
  SECURITY_SIGNAL_LABELS,
  SECURITY_WORKFLOW_LABELS,
  SECURITY_WORKFLOW_NEXT,
} from "@/lib/director/security-labels";
import { directorDetailRepo } from "@/lib/data";
import type { SecurityEvent, SecurityWorkflowStatus } from "@/lib/director/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

type SecurityEventClientProps = {
  event: SecurityEvent;
};

export function SecurityEventClient({ event }: SecurityEventClientProps) {
  const [status, setStatus] = useState<SecurityWorkflowStatus>(event.workflowStatus);
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const audit = directorDetailRepo.getSecurityAuditLog()[event.id] ?? [];

  function advance() {
    const next = SECURITY_WORKFLOW_NEXT[status];
    if (!next) return;
    setStatus(next);
    setFeedback(`Статус: ${SECURITY_WORKFLOW_LABELS[next]}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Безопасность", href: "/dashboard#security" },
          { label: event.zoneName },
        ]}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{SECURITY_SIGNAL_LABELS[event.type]}</h1>
          <p className="text-muted-foreground text-sm">{event.description}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {format(new Date(event.occurredAt), "d MMMM yyyy, HH:mm", { locale: ru })} ·{" "}
            {event.zoneName}
          </p>
        </div>
        <Badge variant="outline">{SECURITY_WORKFLOW_LABELS[status]}</Badge>
      </div>
      <div className="aspect-video max-w-2xl rounded-xl bg-muted/50 ring-1 ring-border/50">
        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
          Видеофрагмент (reuse incidents signed-url на проде)
        </div>
      </div>
      <DirectorMockFeedback message={feedback} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
          <p className="mb-3 text-sm font-semibold">Протокол проверки</p>
          <textarea
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
            placeholder="Результат проверки, комментарий сотрудника…"
            rows={4}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {status !== "closed" ? (
              <Button type="button" size="sm" onClick={advance}>
                {status === "new"
                  ? "Взять на проверку"
                  : status === "reviewing"
                    ? "Передать"
                    : "Закрыть"}
              </Button>
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/cameras/engagement?tab=incidents">Журнал с видео</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
          <p className="mb-3 text-sm font-semibold">Аудит-лог</p>
          <ul className="space-y-2 text-sm">
            {audit.map((entry, i) => (
              <li key={`${entry.at}-${i}`} className="text-muted-foreground">
                <span className="text-foreground font-medium">{entry.at}</span> —{" "}
                {formatIntegrationActorLabel(entry.actor)}: {entry.action}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Button asChild variant="outline" size="sm" className="w-fit">
        <Link href="/dashboard">На главный экран</Link>
      </Button>
    </div>
  );
}
